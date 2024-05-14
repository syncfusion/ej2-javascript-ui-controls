import * as CONSTANT from './../base/constant';
import { append, detach, createElement, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { NodeSelection } from './../../selection/index';
import { selfClosingTags } from '../../common/config';
import { getLastTextNode } from '../../common/util';

export const markerClassName: { [key: string]: string } = {
    startSelection: 'e-editor-select-start',
    endSelection: 'e-editor-select-end'
};
/**
 * DOMNode internal plugin
 *
 * @hidden
 * @deprecated
 */
export class DOMNode {
    private parent: Element;
    private currentDocument: Document;
    private nodeSelection: NodeSelection;
    /**
     * Constructor for creating the DOMNode plugin
     *
     * @param {Element} parent - specifies the parent element
     * @param {Document} currentDocument - specifies the current document.
     * @hidden
     * @deprecated
     */
    public constructor(parent: Element, currentDocument: Document) {
        this.parent = parent;
        this.nodeSelection = new NodeSelection();
        this.currentDocument = currentDocument;
    }

    /**
     * contents method
     *
     * @param {Element} element - specifies the element.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public contents(element: Element): Node[] {
        return (element && 'IFRAME' !== element.tagName ? Array.prototype.slice.call(element.childNodes || []) : []);
    }

    /**
     * isBlockNode method
     *
     * @param {Element} element - specifies the node element.
     * @returns {boolean} - sepcifies the boolean value
     * @hidden
     * @deprecated
     */
    public isBlockNode(element: Element): boolean {
        return (!!element && (element.nodeType === Node.ELEMENT_NODE && CONSTANT.BLOCK_TAGS.indexOf(element.tagName.toLowerCase()) >= 0));
    }

    /**
     * isLink method
     *
     * @param {Element} element - specifies the element
     * @returns {boolean} -  specifies the boolean value
     * @hidden
     * @deprecated
     */
    public isLink(element: Element): boolean {
        return (!!element && (element.nodeType === Node.ELEMENT_NODE && 'a' === element.tagName.toLowerCase()));
    }

    /**
     * blockParentNode method
     *
     * @param {Element} element - specifies the element
     * @returns {Element} - returns the element value
     * @hidden
     * @deprecated
     */
    public blockParentNode(element: Element): Element {
        for (; element && element.parentNode !== this.parent && ((!element.parentNode ||
            !this.hasClass(element.parentNode as Element, 'e-node-inner'))); null) {
            element = element.parentNode as Element;
            if (this.isBlockNode(element)) {
                return element;
            }
        }
        return element;
    }

    /**
     * rawAttributes method
     *
     * @param {Element} element - specifies the element
     * @returns {string} - returns the string value
     * @hidden
     * @deprecated
     */
    public rawAttributes(element: Element): { [key: string]: string } {
        const rawAttr: { [key: string]: string } = {};
        const attributes: NamedNodeMap = element.attributes;
        if (attributes.length > 0) {
            for (let d: number = 0; d < attributes.length; d++) {
                const e: Attr = attributes[d as number];
                rawAttr[e.nodeName] = e.value;
            }
        }
        return rawAttr;
    }

    /**
     * attributes method
     *
     * @param {Element} element - sepcifies the element.
     * @returns {string} - returns the string value.
     * @hidden
     * @deprecated
     */
    public attributes(element?: Element): string {
        if (!element) {
            return '';
        }
        let attr: string = '';
        const rawAttr: { [key: string]: string } = this.rawAttributes(element);
        const orderRawAttr: string[] = Object.keys(rawAttr).sort();
        for (let e: number = 0; e < orderRawAttr.length; e++) {
            const attrKey: string = orderRawAttr[e as number];
            let attrValue: string = rawAttr[`${attrKey}`];
            /* eslint-disable */
            if (attrValue.indexOf("'") < 0 && attrValue.indexOf('"') >= 0) {
                attr += ' ' + attrKey + "='" + attrValue + "'";
            } else if (attrValue.indexOf('"') >= 0 && attrValue.indexOf("'") >= 0) {
                /* eslint-enable */
                attrValue = attrValue.replace(/"/g, '&quot;');
                attr += ' ' + attrKey + '="' + attrValue + '"';
            } else {
                attr += ' ' + attrKey + '="' + attrValue + '"';
            }
        }
        return attr;
    }

    /**
     * clearAttributes method
     *
     * @param {Element} element - specifies the element
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public clearAttributes(element: Element): void {
        for (let attr: NamedNodeMap = element.attributes, c: number = attr.length - 1; c >= 0; c--) {
            const key: Attr = attr[c as number];
            element.removeAttribute(key.nodeName);
        }
    }

    /**
     * openTagString method
     *
     * @param {Element} element - specifies the element.
     * @returns {string} - returns the string
     * @hidden
     * @deprecated
     */
    public openTagString(element: Element): string {
        return '<' + element.tagName.toLowerCase() + this.attributes(element) + '>';
    }

    /**
     * closeTagString method
     *
     * @param {Element} element - specifies the element
     * @returns {string} - returns the string value
     * @hidden
     * @deprecated
     */
    public closeTagString(element: Element): string {
        return '</' + element.tagName.toLowerCase() + '>';
    }

    /**
     * createTagString method
     *
     * @param {string} tagName - specifies the tag name
     * @param {Element} relativeElement - specifies the relative element
     * @param {string} innerHTML - specifies the string value
     * @returns {string} - returns the string value.
     * @hidden
     * @deprecated
     */
    public createTagString(tagName: string, relativeElement: Element, innerHTML: string): string {
        return '<' + tagName.toLowerCase() + this.attributes(relativeElement) + '>' + innerHTML + '</' + tagName.toLowerCase() + '>';
    }

    /**
     * isList method
     *
     * @param {Element} element - specifes the element.
     * @returns {boolean} - returns the boolean value
     * @hidden
     * @deprecated
     */
    public isList(element: Element): boolean {
        return !!element && ['UL', 'OL'].indexOf(element.tagName) >= 0;
    }

    /**
     * isElement method
     *
     * @param {Element} element - specifes the element.
     * @returns {boolean} - returns the boolean value
     * @hidden
     * @deprecated
     */
    public isElement(element: Element): boolean {
        return element === this.parent;
    }

    /**
     * isEditable method
     *
     * @param {Element} element - specifes the element.
     * @returns {boolean} - returns the boolean value
     * @hidden
     * @deprecated
     */
    public isEditable(element: Element): boolean {
        return ((!element.getAttribute || element.getAttribute('contenteditable') === 'true')
            && ['STYLE', 'SCRIPT'].indexOf(element.tagName) < 0);
    }

    /**
     * hasClass method
     *
     * @param {Element} element - specifes the element.
     * @param {string} className - specifies the class name value
     * @returns {boolean} - returns the boolean value
     * @hidden
     * @deprecated
     */
    public hasClass(element: Element, className: string): boolean {
        return element && element.classList && element.classList.contains(className);
    }

    /**
     * replaceWith method
     *
     * @param {Element} element - specifes the element.
     * @param {string} value - specifies the string value
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public replaceWith(element: Element, value: string): void {
        const parentNode: Element = element.parentNode as Element;
        parentNode.insertBefore(this.parseHTMLFragment(value), element);
        detach(element);
    }

    /**
     * parseHTMLFragment method
     *
     * @param {string} value - specifies the string value
     * @returns {Element} - returns the element
     * @hidden
     * @deprecated
     */
    public parseHTMLFragment(value: string): Element {
        /* eslint-disable */
        let temp: HTMLTemplateElement = <HTMLTemplateElement>createElement('template');
        temp.innerHTML = value;
        if (temp.content instanceof DocumentFragment) {
            return temp.content as any;
        } else {
            return document.createRange().createContextualFragment(value) as any;
        }
        /* eslint-enable */
    }

    /**
     * wrap method
     *
     * @param {Element} element - specifies the element
     * @param {Element} wrapper - specifies the element.
     * @returns {Element} - returns the element
     * @hidden
     * @deprecated
     */
    public wrap(element: Element, wrapper: Element): Element {
        element.parentNode.insertBefore(wrapper, element);
        wrapper = element.previousSibling as Element;
        wrapper.appendChild(element);
        return wrapper;
    }

    /**
     * insertAfter method
     *
     * @param {Element} newNode - specifies the new node element
     * @param {Element} referenceNode - specifies the referenece node
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public insertAfter(newNode: Element, referenceNode: Element): void {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    /**
     * wrapInner method
     *
     * @param {Element} parent - specifies the parent element.
     * @param {Element} wrapper - specifies the wrapper element.
     * @returns {Element} - returns the element
     * @hidden
     * @deprecated
     */
    public wrapInner(parent: Element, wrapper: Element): Element {
        parent.appendChild(wrapper);
        wrapper = parent.querySelector('.e-rte-wrap-inner');
        wrapper.classList.remove('e-rte-wrap-inner');
        if (wrapper.classList.length === 0) {
            wrapper.removeAttribute('class');
        }
        while (parent.firstChild !== wrapper) {
            wrapper.appendChild(parent.firstChild);
        }
        return wrapper;
    }

    /**
     * unWrap method
     *
     * @param {Element} element - specifies the element.
     * @returns {Element} - returns the element.
     * @hidden
     * @deprecated
     */
    public unWrap(element: Element): Element[] {
        const parent: Element = element.parentNode as Element;
        let unWrapNode: Element[] = [];
        while (element.firstChild && (element.previousSibling !== this.parent.querySelector('.e-mention-chip') || element.textContent !== ' ')) {
            unWrapNode.push(element.firstChild as Element);
            parent.insertBefore(element.firstChild, element);
        }
        unWrapNode = unWrapNode.length > 0 ? unWrapNode : [element.parentNode as Element];
        parent.removeChild(element);
        return unWrapNode;
    }

    /**
     * getSelectedNode method
     *
     * @param {Element} element - specifies the element
     * @param {number} index - specifies the index value.
     * @returns {Element} - returns the element
     * @hidden
     * @deprecated
     */
    public getSelectedNode(element: Element, index: number): Element {
        if (element.nodeType === Node.ELEMENT_NODE && element.childNodes.length > 0 &&
            element.childNodes[index - 1] && element.childNodes[index - 1].nodeType === Node.ELEMENT_NODE &&
            ((element.childNodes[index - 1] as Element).classList.contains(markerClassName.startSelection) ||
                (element.childNodes[index - 1] as Element).classList.contains(markerClassName.endSelection))) {
            element = element.childNodes[index - 1] as Element;
        } else if (element.nodeType === Node.ELEMENT_NODE && element.childNodes.length > 0 && element.childNodes[index as number]) {
            element = element.childNodes[index as number] as Element;
        }
        if (element.nodeType === Node.TEXT_NODE) {
            element = element.parentNode as Element;
        }
        return element;
    }

    /**
     * nodeFinds method
     *
     * @param {Element} element - specifies the element.
     * @param {Element[]} elements - specifies the array of elements
     * @returns {Element[]} - returnts the array elements
     * @hidden
     * @deprecated
     */
    public nodeFinds(element: Element, elements: Element[]): Element[] {
        const existNodes: Element[] = [];
        for (let i: number = 0; i < elements.length; i++) {
            if (element.contains(elements[i  as number]) && element !== elements[i as number]) {
                existNodes.push(elements[i as number]);
            }
        }
        return existNodes;
    }

    /**
     * isEditorArea method
     *
     * @returns {boolean} - returns the boolean value
     * @hidden
     * @deprecated
     */
    public isEditorArea(): boolean {
        const range: Range = <Range>this.getRangePoint(0);
        let element: Element;
        for (element = range.commonAncestorContainer as Element; element && !this.isElement(element); null) {
            element = element.parentNode as Element;
        }
        return !!this.isElement(element);
    }

    /**
     * getRangePoint method
     *
     * @param {number} point - specifies the number value.
     * @returns {Range} - returns the range.
     * @hidden
     * @deprecated
     */
    public getRangePoint(point?: number): Range | Range[] {
        const selection: Selection = this.getSelection();
        let ranges: Range[] = [];
        if (selection && selection.getRangeAt && selection.rangeCount) {
            ranges = [];
            for (let f: number = 0; f < selection.rangeCount; f++) {
                ranges.push(selection.getRangeAt(f));
            }
        } else {
            ranges = [this.currentDocument.createRange()];
        }
        return 'undefined' !== typeof point ? ranges[point  as number] : ranges;
    }

    public getSelection(): Selection {
        return this.nodeSelection.get(this.currentDocument);
    }

    /**
     * getPreviousNode method
     *
     * @param {Element} element - specifies the element
     * @returns {Element} - returns the element
     * @hidden
     * @deprecated
     */
    public getPreviousNode(element: Element): Element {
        element = element.previousElementSibling  as Element;
        for (; element && element.textContent === '\n'; null) {
            element = element.previousElementSibling  as Element;
        }
        return element;
    }

    /**
     * encode method
     *
     * @param {string} value - specifies the string value
     * @returns {string} - specifies the string value
     * @hidden
     * @deprecated
     */
    public encode(value: string): string {
        const divNode: HTMLDivElement = document.createElement('div');
        divNode.innerText = value;
        // eslint-disable-next-line
        return divNode.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
    }

    /**
     * saveMarker method
     *
     * @param {NodeSelection} save - specifies the node selection,
     * @param {string} action - specifies the action  value.
     * @returns {NodeSelection} - returns the value
     * @hidden
     * @deprecated
     */
    public saveMarker(save: NodeSelection, action?: string): NodeSelection {
        let start: Element = this.parent.querySelector('.' + markerClassName.startSelection);
        let end: Element = this.parent.querySelector('.' + markerClassName.endSelection);
        let startTextNode: Element;
        let endTextNode: Element;
        if (this.hasClass(start, markerClassName.startSelection) && start.classList.length > 1) {
            const replace: string = this.createTagString(CONSTANT.DEFAULT_TAG, start, this.encode(start.textContent));
            this.replaceWith(start, replace);
            start = this.parent.querySelector('.' + markerClassName.startSelection);
            start.classList.remove(markerClassName.startSelection);
            startTextNode = start.childNodes[0] as Element;
        } else {
            startTextNode = this.unWrap(start)[0];
        }
        if (this.hasClass(end, markerClassName.endSelection) && end.classList.length > 1) {
            const replace: string = this.createTagString(CONSTANT.DEFAULT_TAG, end, this.encode(end.textContent));
            this.replaceWith(end, replace);
            end = this.parent.querySelector('.' + markerClassName.endSelection);
            end.classList.remove(markerClassName.endSelection);
            endTextNode = end.childNodes[0] as Element;
        } else {
            endTextNode = end ? this.unWrap(end)[0] : startTextNode;
        }
        save.startContainer = save.getNodeArray(startTextNode, true);
        save.endContainer = save.getNodeArray(endTextNode, false);
        return save;
    }

    private marker(className: string, textContent: string): string {
        return '<span class="' + className + '">' + textContent + '</span>';
    }

    /**
     * setMarker method
     *
     * @param {NodeSelection} save - specifies the node selection.
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public setMarker(save: NodeSelection): void {
        const range: Range = save.range;
        const startChildNodes: NodeListOf<Node> = range.startContainer.childNodes;
        const isTableStart: boolean = startChildNodes.length > 1 && startChildNodes[0].nodeName === 'TABLE';
        const isImgOnlySelected: boolean = startChildNodes.length > 1 && startChildNodes[0].nodeName === 'IMAGE' &&
            range.endOffset === 1 && range.endContainer.nodeName === '#text' && range.endContainer.textContent.length === 0;
        let start: Element = <Element>((isTableStart ? getLastTextNode(startChildNodes[range.startOffset + 1]) :
            startChildNodes[(range.startOffset > 0) ? (range.startOffset - 1) : range.startOffset]) || range.startContainer);
        let end: Element = <Element>(range.endContainer.childNodes[(range.endOffset > 0) ? (isImgOnlySelected ? range.endOffset : (range.endOffset - 1)) : range.endOffset]
            || range.endContainer);
        if ((start.nodeType === Node.ELEMENT_NODE && end.nodeType === Node.ELEMENT_NODE) && (start.contains(end) || end.contains(start))) {
            const existNode: Element = start.contains(end) ? start : end;
            const isElement: boolean = existNode.nodeType !== Node.TEXT_NODE;
            if (isElement) {
                const nodes: Element[] = [];
                const textNodes: Element[] = [];
                for (let node: Element = existNode; existNode.contains(node); null) {
                    if (nodes.indexOf(node) < 0 && node.childNodes && node.childNodes.length) {
                        nodes.push(node);
                        node = node.childNodes[0] as Element;
                    } else if (node.nextSibling) {
                        node = node.nextSibling as Element;
                    } else if (node.parentNode) {
                        node = node.parentNode as Element;
                        nodes.push(node);
                    }
                    if (textNodes.indexOf(node) < 0 && (node.nodeType === Node.TEXT_NODE ||
                        (CONSTANT.IGNORE_BLOCK_TAGS.indexOf((node.parentNode as Element).tagName.toLocaleLowerCase()) >= 0
                            && (node.tagName === 'BR' || node.tagName === 'IMG')))) {
                        textNodes.push(node);
                    }
                }
                if (textNodes.length) {
                    start = start.contains(end) ? textNodes[0] as Element : start;
                    end = textNodes[textNodes.length - 1] as Element;
                }
            }
        }
        if (start !== end) {
            if (start.nodeType !== Node.TEXT_NODE && ((start.tagName === 'BR' &&
                CONSTANT.IGNORE_BLOCK_TAGS.indexOf((start.parentNode as Element).tagName.toLocaleLowerCase()) >= 0) ||
                start.tagName === 'IMG')) {
                this.replaceWith(start, this.marker(markerClassName.startSelection, this.encode(start.textContent)));
                const markerStart: Element = (range.startContainer as HTMLElement).querySelector('.' + markerClassName.startSelection);
                markerStart.appendChild(start);
            } else {
                if (start.nodeType !== 3 && start.nodeName !== '#text' && start.nodeName !== 'BR') {
                    const marker: string = this.marker(markerClassName.startSelection, '');
                    append([this.parseHTMLFragment(marker)], start);
                } else {
                    this.replaceWith(start, this.marker(markerClassName.startSelection, this.encode(start.textContent)));
                }
            }
            if (end.nodeType !== Node.TEXT_NODE && end.tagName === 'BR' &&
                CONSTANT.IGNORE_BLOCK_TAGS.indexOf((end.parentNode as Element).tagName.toLocaleLowerCase()) >= 0) {
                this.replaceWith(end, this.marker(markerClassName.endSelection, this.encode(end.textContent)));
                const markerEnd: Element = (range.endContainer as HTMLElement).querySelector('.' + markerClassName.endSelection);
                markerEnd.appendChild(end);
            } else {
                this.ensureSelfClosingTag(end, markerClassName.endSelection, range);
            }
        } else {
            this.ensureSelfClosingTag(start, markerClassName.startSelection, range);
        }
    }

    /**
     * ensureSelfClosingTag method
     *
     * @param {Element} start - specifies the element.
     * @param {string} className - specifes the class name string value
     * @param {Range} range - specifies the range value
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public ensureSelfClosingTag(start: Element, className: string, range: Range): void {
        let isTable: boolean = false;
        if (start.nodeType === 3) {
            this.replaceWith(start, this.marker(className, this.encode(start.textContent)));
        } else if (start.tagName === 'BR') {
            this.replaceWith(start, this.marker(className, this.encode(start.textContent)));
            const markerStart: Element = (range.startContainer as HTMLElement).querySelector('.' + className);
            if (markerStart) {
                markerStart.parentElement.appendChild(start);
            }
        } else {
            let tagName: string = !isNOU(start.parentElement)? start.parentElement.tagName.toLocaleLowerCase(): '';
            if (start.tagName === 'IMG' && tagName !== 'p' && tagName !== 'div') {
                const parNode: HTMLParagraphElement = document.createElement('p');
                start.parentElement.insertBefore(parNode, start);
                parNode.appendChild(start);
                start = parNode.children[0];
            }
            if (start.tagName === 'TABLE') {
                isTable = true;
                if (start.textContent === '') {
                    const tdNode: NodeListOf<HTMLElement> = start.querySelectorAll('td');
                    start = tdNode[tdNode.length - 1];
                    start = !isNOU(start.childNodes[0]) ? start.childNodes[0] as Element : start;
                } else {
                    let lastNode: Node = start.lastChild;
                    while (lastNode.nodeType !== 3 && lastNode.nodeName !== '#text' &&
                    lastNode.nodeName !== 'BR') {
                        lastNode = lastNode.lastChild;
                    }
                    start = lastNode as Element;
                }
            }
            for (let i: number = 0; i < selfClosingTags.length; i++) {
                start = (start.tagName === selfClosingTags[i as number] && !isTable) ? start.parentNode as Element : start;
            }
            if (start.nodeType === 3 && start.nodeName === '#text') {
                this.replaceWith(start, this.marker(className, this.encode(start.textContent)));
            } else if (start.nodeName === 'BR') {
                this.replaceWith(start, this.marker(markerClassName.endSelection, this.encode(start.textContent)));
                const markerEnd: Element = (range.endContainer as HTMLElement).querySelector('.' + markerClassName.endSelection);
                markerEnd.appendChild(start);
            } else {
                const marker: string = this.marker(className, '');
                append([this.parseHTMLFragment(marker)], start);
            }
        }
    }

    /**
     * createTempNode method
     *
     * @param {Element} element - specifies the element.
     * @returns {Element} - returns the element
     * @hidden
     * @deprecated
     */
    public createTempNode(element: Element): Element {
        const textContent: string = element.textContent;
        if (element.tagName === 'BR') {
            const wrapper: string = '<' + CONSTANT.DEFAULT_TAG + '></' + CONSTANT.DEFAULT_TAG + '>';
            const node: Element = (element.parentNode as Element);
            if (CONSTANT.IGNORE_BLOCK_TAGS.indexOf(node.tagName.toLocaleLowerCase()) >= 0) {
                element = this.wrap(element, this.parseHTMLFragment(wrapper));
            }
        } else if (((element.nodeType !== Node.TEXT_NODE &&
            (element.classList.contains(markerClassName.startSelection) ||
                element.classList.contains(markerClassName.endSelection))) ||
            textContent.replace(/\n/g, '').replace(/(^ *)|( *$)/g, '').length > 0 ||
            textContent.length && textContent.indexOf('\n') < 0)) {
            const wrapper: string = '<' + CONSTANT.DEFAULT_TAG + '></' + CONSTANT.DEFAULT_TAG + '>';
            const target: Element = element;
            element = this.wrap(element, this.parseHTMLFragment(wrapper));
            const ignoreBr: boolean = target.nodeType === Node.ELEMENT_NODE && target.firstChild && target.firstChild.nodeName === 'BR'
                && (target.classList.contains(markerClassName.startSelection) ||
                    target.classList.contains(markerClassName.endSelection));
            if (!ignoreBr && element.nextElementSibling && element.nextElementSibling.tagName === 'BR') {
                element.appendChild(element.nextElementSibling);
            }
        }
        return element;
    }
    /**
     * getImageTagInSelection method
     *
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public getImageTagInSelection(): NodeListOf<HTMLImageElement> {
        const selection: Selection = this.getSelection();
        if (this.isEditorArea() && selection.rangeCount) {
            return (selection.focusNode as HTMLElement).querySelectorAll('img');
        }
        return null;
    }
    /**
     * blockNodes method
     *
     * @param {boolean} action - Optional Boolean that specifies the action is whether performed.
     * @returns {Node[]} - returns the node array values
     * @hidden
     * @deprecated
     */
    public blockNodes(action?: boolean): Node[] {
        const collectionNodes: Element[] = [];
        const selection: Selection = this.getSelection();
        if (this.isEditorArea() && selection.rangeCount) {
            const ranges: Range[] = <Range[]>this.getRangePoint();
            for (let j: number = 0; j < ranges.length; j++) {
                let parentNode: Element;
                const range: Range = ranges[j as number] as Range;
                const startNode: Element = this.getSelectedNode(range.startContainer as Element, range.startOffset);
                const endNode: Element = this.getSelectedNode(range.endContainer as Element, range.endOffset);
                if (this.isBlockNode(startNode) && collectionNodes.indexOf(startNode) < 0) {
                    collectionNodes.push(startNode);
                }
                parentNode = this.blockParentNode(startNode);
                const endParentNode: Element = this.blockParentNode(endNode);
                if (parentNode && collectionNodes.indexOf(parentNode) < 0) {
                    if (!isNOU(action) && action) {
                        if (range.commonAncestorContainer.nodeName === 'TD' || parentNode.nodeName === 'TD' || endParentNode.nodeName === 'TD') {
                            const processedNodes: Node[] = this.getPreBlockNodeCollection(range);
                            if (processedNodes.length > 1) {
                                this.wrapWithBlockNode(processedNodes, collectionNodes);
                            } else if (processedNodes.length > 0) {
                                if (startNode !== endNode && startNode.nodeName !== 'BR') {
                                    collectionNodes.push(this.createTempNode(startNode));
                                } else if (startNode === endNode && startNode.nodeName === 'SPAN' && ((startNode as HTMLElement).classList.contains(markerClassName.startSelection)
                                || (startNode as HTMLElement).classList.contains(markerClassName.endSelection))) {
                                    collectionNodes.push(this.createTempNode(startNode));
                                }
                            }
                        } else {
                            collectionNodes.push(parentNode);
                        }
                    } else {
                        if (CONSTANT.IGNORE_BLOCK_TAGS.indexOf(parentNode.tagName.toLocaleLowerCase()) >= 0 && (startNode.tagName === 'BR' ||
                        startNode.nodeType === Node.TEXT_NODE ||
                        startNode.classList.contains(markerClassName.startSelection) ||
                        startNode.classList.contains(markerClassName.endSelection))) {
                            const tempNode: Element = startNode.previousSibling &&
                                (startNode.previousSibling as Element).nodeType === Node.TEXT_NODE ?
                                startNode.previousSibling as Element : startNode;
                            if (!startNode.nextSibling && !startNode.previousSibling && startNode.tagName === 'BR') {
                                collectionNodes.push(tempNode);
                            } else {
                                collectionNodes.push(this.createTempNode(tempNode));
                            }
                        } else {
                            collectionNodes.push(parentNode);
                        }
                    }
                }
                const nodes: Element[] = [];
                for (let node: Element = startNode; node !== endNode && node !== this.parent; null) {
                    if (nodes.indexOf(node) < 0 && node.childNodes && node.childNodes.length) {
                        nodes.push(node);
                        node = node.childNodes[0] as Element;
                    } else if (node && node.nodeType !== 8 && (node.tagName === 'BR' || (node.nodeType === Node.TEXT_NODE &&
                        node.textContent.trim() !== '') || (node.nodeType !== Node.TEXT_NODE &&
                        ((node as Element).classList.contains(markerClassName.startSelection) ||
                        (node as Element).classList.contains(markerClassName.endSelection)))) &&
                        CONSTANT.IGNORE_BLOCK_TAGS.indexOf((node.parentNode as Element).tagName.toLocaleLowerCase()) >= 0) {
                        node = this.createTempNode(node as Element);
                    } else if (node.nextSibling && node.nextSibling.nodeType !== 8 &&
                        ((node.nextSibling as Element).tagName === 'BR' ||
                        node.nextSibling.nodeType === Node.TEXT_NODE ||
                        (node.nextSibling as Element).classList.contains(markerClassName.startSelection) ||
                        (node.nextSibling as Element).classList.contains(markerClassName.endSelection)) &&
                        CONSTANT.IGNORE_BLOCK_TAGS.indexOf((node.nextSibling.parentNode as Element).tagName.toLocaleLowerCase()) >= 0) {
                        node = this.createTempNode(node.nextSibling as Element);
                    } else if (node.nextSibling) {
                        node = node.nextSibling as Element;
                    } else if (node.parentNode) {
                        node = node.parentNode as Element;
                        nodes.push(node);
                    }
                    if (collectionNodes.indexOf(node) < 0 && node.nodeType === Node.ELEMENT_NODE &&
                        CONSTANT.IGNORE_BLOCK_TAGS.indexOf((node.parentNode as Element).tagName.toLocaleLowerCase()) >= 0 &&
                        ((node as Element).classList.contains(markerClassName.startSelection) ||
                            (node as Element).classList.contains(markerClassName.endSelection))) {
                        collectionNodes.push(this.createTempNode(node as Element));
                    }
                    if (this.isBlockNode(node) && this.ignoreTableTag((node as Element)) && nodes.indexOf(node) < 0 &&
                        collectionNodes.indexOf(node) < 0 && (node !== endNode || range.endOffset > 0)) {
                        collectionNodes.push(node);
                    }
                    if (node.nodeName === 'IMG' && node.parentElement.contentEditable === 'true') {
                        collectionNodes.push(node);
                    }
                }
                parentNode = this.blockParentNode(endNode);
                if (parentNode && this.ignoreTableTag(parentNode) && collectionNodes.indexOf(parentNode) < 0 &&
                (!isNOU(parentNode.previousElementSibling) && parentNode.previousElementSibling.tagName !== 'IMG')) {
                    collectionNodes.push(parentNode);
                }
            }
        }
        for (let i: number = collectionNodes.length - 1; i > 0; i--) {
            const nodes: Element[] = this.nodeFinds(collectionNodes[i as number], collectionNodes);
            if (nodes.length) {
                const listNodes: Element[] = <NodeListOf<Element> & Element[]>collectionNodes[i as number].querySelectorAll('ul, ol');
                if (collectionNodes[i as number].tagName === 'LI' && listNodes.length > 0) {
                    continue;
                } else {
                    collectionNodes.splice(i, 1);
                }
            }
        }
        return collectionNodes;
    }

    private ignoreTableTag(element: Element): boolean {
        return !(CONSTANT.TABLE_BLOCK_TAGS.indexOf(element.tagName.toLocaleLowerCase()) >= 0);
    }

    private getPreBlockNodeCollection(range: Range): Node[] {
        const startNode: Element = this.getSelectedNode(range.startContainer as Element, range.startOffset);
        const endNode: Element = this.getSelectedNode(range.endContainer as Element, range.endOffset);
        const nodes: Element[] = [];
        const rootNode: Node = startNode.closest('td, th');
        if (isNOU(rootNode)) {
            return nodes;
        }
        const rootChildNode : ChildNode[] = Array.from(rootNode.childNodes);
        let isContinue: boolean = true;
        const processedStart: Node =  this.getClosestInlineParent(startNode, rootNode, true);
        const processedEnd: Node =  this.getClosestInlineParent(endNode, rootNode, false);
        for (let i: number = 0; i < rootChildNode.length; i++) {
            const child: Node = rootChildNode[i as number];
            if (processedStart === processedEnd && child === processedStart) {
                nodes.push(child as Element);
                isContinue = true;
            }
            else if (child === processedStart) {
                isContinue = false;
            } else if (child === processedEnd) {
                nodes.push(child as Element); // Early Exit so Push the end node.
                isContinue = true;
            }
            if (isContinue) {
                continue;
            } else {
                nodes.push(child as Element);
            }
        }
        return nodes;
    }

    private getClosestInlineParent(node: Node, rootNode: Node, isStart: boolean): Node | null {
        // 1. If the node is a text node, return the node
        // 2. If the node is a block node return block node
        // 3. If the node is a inline node,
        //      Traverse back untill the TD or TH node
        //      Check if the the previous sibling , next sibling is a block node.
        //      If yes return the inline node that is closest to the block node.
        if (node.nodeType === Node.TEXT_NODE) {
            return node;
        }
        if (this.isBlockNode(node as Element)) {
            return node;
        }
        let currentNode: Node = node;
        let rootFlag: boolean = false;
        while (currentNode) {
            const previousNode: Node = currentNode;
            if (rootFlag) {
                if (this.isBlockNode(currentNode as Element)) {
                    return previousNode;
                }
                if (isStart && currentNode.previousSibling) {
                    if (this.isBlockNode(currentNode.previousSibling as Element) || currentNode.previousSibling.nodeName === 'BR') {
                        return previousNode;
                    } else {
                        currentNode = currentNode.previousSibling;
                    }
                } else if (!isStart && currentNode.nextSibling) {
                    if (this.isBlockNode(currentNode.nextSibling as Element) || currentNode.nextSibling.nodeName === 'BR') {
                        return previousNode;
                    } else {
                        currentNode = currentNode.nextSibling;
                    }
                } else {
                    return currentNode;
                }
            } else {
                currentNode = currentNode.parentElement;
                if (currentNode === rootNode ) {
                    currentNode = previousNode;
                    rootFlag = true;
                }
            }
        }
        return null;
    }

    private wrapWithBlockNode(nodes: Node[], collectionNodes: Node[]): void {
        let wrapperElement: Element = createElement('p');
        for (let i: number = 0; i < nodes.length; i++) {
            const child: Node = nodes[i as number];
            if (child.nodeName === 'BR') {
                child.parentNode.insertBefore(wrapperElement, child);
                wrapperElement.appendChild(child);
                if (wrapperElement.childNodes.length > 0) {
                    collectionNodes.push(wrapperElement);
                }
                wrapperElement = createElement('p');
            } else {
                if (!this.isBlockNode(child as Element)) {
                    if (child.nodeName === '#text' && child.textContent.trim() === '') {
                        continue;
                    }
                    if (wrapperElement.childElementCount === 0) {
                        child.parentNode.insertBefore(wrapperElement, child);
                        wrapperElement.appendChild(child);
                    } else {
                        wrapperElement.appendChild(child);
                    }
                } else {
                    collectionNodes.push(child);
                }
                // Use case when the BR is next sibling but the BR is not the part of selection.
                if ((i === nodes.length - 1) && wrapperElement.nextElementSibling && 
                    wrapperElement.querySelectorAll('br').length === 0 &&
                    wrapperElement.nextElementSibling.nodeName === 'BR') {
                    wrapperElement.appendChild(wrapperElement.nextElementSibling);
                }
            }
        }
        if (wrapperElement.childNodes.length > 0 && collectionNodes.indexOf(wrapperElement) < 0){
            collectionNodes.push(wrapperElement);
        }
    }
}
