import * as CONSTANT from './../base/constant';
import { append, detach } from '@syncfusion/ej2-base';
import { NodeSelection } from './../../selection/index';

export const markerClassName: { [key: string]: string } = {
    startSelection: 'e-editor-select-start',
    endSelection: 'e-editor-select-end'
};
/**
 * DOMNode internal plugin
 * @hidden
 */
export class DOMNode {
    private parent: Element;
    private currentDocument: Document;
    private nodeSelection: NodeSelection;
    /**
     * Constructor for creating the DOMNode plugin
     * @hidden
     */
    constructor(parent: Element, currentDocument: Document) {
        this.parent = parent;
        this.nodeSelection = new NodeSelection();
        this.currentDocument = currentDocument;
    }

    public contents(element: Element): Node[] {
        return (element && 'IFRAME' !== element.tagName ? Array.prototype.slice.call(element.childNodes || []) : []);
    }

    public isBlockNode(element: Element): boolean {
        return (!!element && (element.nodeType === Node.ELEMENT_NODE && CONSTANT.BLOCK_TAGS.indexOf(element.tagName.toLowerCase()) >= 0));
    }

    public isLink(element: Element): boolean {
        return (!!element && (element.nodeType === Node.ELEMENT_NODE && 'a' === element.tagName.toLowerCase()));
    }

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

    public rawAttributes(element: Element): { [key: string]: string } {
        let rawAttr: { [key: string]: string; } = {};
        let attributes: NamedNodeMap = element.attributes;
        if (attributes.length > 0) {
            for (let d: number = 0; d < attributes.length; d++) {
                let e: Attr = attributes[d];
                rawAttr[e.nodeName] = e.value;
            }
        }
        return rawAttr;
    }

    public attributes(element?: Element): string {
        if (!element) { return ''; }
        let attr: string = '';
        let rawAttr: { [key: string]: string } = this.rawAttributes(element);
        let orderRawAttr: string[] = Object.keys(rawAttr).sort();
        for (let e: number = 0; e < orderRawAttr.length; e++) {
            let attrKey: string = orderRawAttr[e];
            let attrValue: string = rawAttr[attrKey];
            /* tslint:disable */
            if (attrValue.indexOf("'") < 0 && attrValue.indexOf('"') >= 0) {
                attr += ' ' + attrKey + "='" + attrValue + "'";
            } else if (attrValue.indexOf('"') >= 0 && attrValue.indexOf("'") >= 0) {
                /* tslint:enable */
                attrValue = attrValue.replace(/"/g, '&quot;');
                attr += ' ' + attrKey + '="' + attrValue + '"';
            } else {
                attr += ' ' + attrKey + '="' + attrValue + '"';
            }
        }
        return attr;
    }

    public clearAttributes(element: Element): void {
        for (let attr: NamedNodeMap = element.attributes, c: number = attr.length - 1; c >= 0; c--) {
            let key: Attr = attr[c];
            element.removeAttribute(key.nodeName);
        }
    }
    public openTagString(element: Element): string {
        return '<' + element.tagName.toLowerCase() + this.attributes(element) + '>';
    }

    public closeTagString(element: Element): string {
        return '</' + element.tagName.toLowerCase() + '>';
    }

    public createTagString(tagName: string, relativeElement: Element, innerHTML: string): string {
        return '<' + tagName.toLowerCase() + this.attributes(relativeElement) + '>' + innerHTML + '</' + tagName.toLowerCase() + '>';
    }

    public isList(element: Element): boolean {
        return !!element && ['UL', 'OL'].indexOf(element.tagName) >= 0;
    }

    public isElement(element: Element): boolean {
        return element === this.parent;
    }

    public isEditable(element: Element): boolean {
        return ((!element.getAttribute || element.getAttribute('contenteditable') === 'true')
            && ['STYLE', 'SCRIPT'].indexOf(element.tagName) < 0);
    }

    public hasClass(element: Element, className: string): boolean {
        return element && element.classList && element.classList.contains(className);
    }

    public replaceWith(element: Element, value: string): void {
        let parentNode: Element = element.parentNode as Element;
        parentNode.insertBefore(this.parseHTMLFragment(value), element);
        detach(element);
    }

    public parseHTMLFragment(value: string): Element {
        /* tslint:disable */
        return document.createRange().createContextualFragment(value) as any;
        /* tslint:enable */
    }

    public wrap(element: Element, wrapper: Element): Element {
        element.parentNode.insertBefore(wrapper, element);
        wrapper = element.previousSibling as Element;
        wrapper.appendChild(element);
        return wrapper;
    }

    public insertAfter(newNode: Element, referenceNode: Element): void {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    public wrapInner(parent: Element, wrapper: Element): Element {
        parent.appendChild(wrapper);
        wrapper = parent.querySelector('.e-rte-wrap-inner');
        wrapper.classList.remove('e-rte-wrap-inner');
        if (wrapper.classList.length === 0) { wrapper.removeAttribute('class'); }
        while (parent.firstChild !== wrapper) {
            wrapper.appendChild(parent.firstChild);
        }
        return wrapper;
    }

    public unWrap(element: Element): Element[] {
        let parent: Element = element.parentNode as Element;
        let unWrapNode: Element[] = [];
        while (element.firstChild) {
            unWrapNode.push(element.firstChild as Element);
            parent.insertBefore(element.firstChild, element);
        }
        unWrapNode = unWrapNode.length > 0 ? unWrapNode : [element.parentNode as Element];
        parent.removeChild(element);
        return unWrapNode;
    }

    public getSelectedNode(element: Element, index: number): Element {
        if (element.nodeType === Node.ELEMENT_NODE && element.childNodes.length > 0 &&
            element.childNodes[index - 1] && element.childNodes[index - 1].nodeType === Node.ELEMENT_NODE &&
            ((element.childNodes[index - 1] as Element).classList.contains(markerClassName.startSelection) ||
                (element.childNodes[index - 1] as Element).classList.contains(markerClassName.endSelection))) {
            element = element.childNodes[index - 1] as Element;
        } else if (element.nodeType === Node.ELEMENT_NODE && element.childNodes.length > 0 && element.childNodes[index]) {
            element = element.childNodes[index] as Element;
        }
        if (element.nodeType === Node.TEXT_NODE) {
            element = element.parentNode as Element;
        }
        return element;
    }

    public nodeFinds(element: Element, elements: Element[]): Element[] {
        let existNodes: Element[] = [];
        for (let i: number = 0; i < elements.length; i++) {
            if (element.contains(elements[i]) && element !== elements[i]) {
                existNodes.push(elements[i]);
            }
        }
        return existNodes;
    }

    public isEditorArea(): boolean {
        let range: Range = <Range>this.getRangePoint(0);
        let element: Element;
        for (element = range.commonAncestorContainer as Element; element && !this.isElement(element); null) {
            element = element.parentNode as Element;
        }
        return !!this.isElement(element);
    }

    public getRangePoint(point?: number): Range | Range[] {
        let selection: Selection = this.getSelection();
        let ranges: Range[] = [];
        if (selection && selection.getRangeAt && selection.rangeCount) {
            ranges = [];
            for (let f: number = 0; f < selection.rangeCount; f++) {
                ranges.push(selection.getRangeAt(f));
            }
        } else {
            ranges = [this.currentDocument.createRange()];
        }
        return 'undefined' !== typeof point ? ranges[point] : ranges;
    }

    public getSelection(): Selection {
        return this.nodeSelection.get(this.currentDocument);
    }

    public getPreviousNode(element: Element): Element {
        element = element.previousSibling as Element;
        for (; element && element.textContent === '\n'; null) {
            element = element.previousSibling as Element;
        }
        return element;
    }

    public encode(value: string): string {
        let divNode: HTMLDivElement = document.createElement('div');
        divNode.innerText = value;
        return divNode.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
    }

    public saveMarker(save: NodeSelection): NodeSelection {
        let start: Element = this.parent.querySelector('.' + markerClassName.startSelection);
        let startTextNode: Element;
        if (this.hasClass(start, markerClassName.startSelection) && start.classList.length > 1) {
            let replace: string = this.createTagString(CONSTANT.DEFAULT_TAG, start, this.encode(start.textContent));
            this.replaceWith(start, replace);
            start = this.parent.querySelector('.' + markerClassName.startSelection);
            start.classList.remove(markerClassName.startSelection);
            startTextNode = start.childNodes[0] as Element;
        } else {
            startTextNode = this.unWrap(start)[0];
        }
        let endTextNode: Element;
        let end: Element = this.parent.querySelector('.' + markerClassName.endSelection);
        if (this.hasClass(end, markerClassName.endSelection) && end.classList.length > 1) {
            let replace: string = this.createTagString(CONSTANT.DEFAULT_TAG, end, this.encode(end.textContent));
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

    public setMarker(save: NodeSelection): void {
        let range: Range = save.range;
        let start: Element = <Element>(range.startContainer.childNodes[range.startOffset]
            || range.startContainer);
        let end: Element = <Element>(range.endContainer.childNodes[(range.endOffset > 0) ? (range.endOffset - 1) : range.endOffset]
            || range.endContainer);
        if ((start.nodeType === Node.ELEMENT_NODE && end.nodeType === Node.ELEMENT_NODE) && (start.contains(end) || end.contains(start))) {
            let existNode: Element = start.contains(end) ? start : end;
            let isElement: boolean = existNode.nodeType !== Node.TEXT_NODE;
            if (isElement) {
                let nodes: Element[] = [];
                let textNodes: Element[] = [];
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
                            && node.tagName === 'BR'))) {
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
            if (start.nodeType !== Node.TEXT_NODE && start.tagName === 'BR' &&
                CONSTANT.IGNORE_BLOCK_TAGS.indexOf((start.parentNode as Element).tagName.toLocaleLowerCase()) >= 0) {
                this.replaceWith(start, this.marker(markerClassName.startSelection, this.encode(start.textContent)));
                let markerStart: Element = (range.startContainer as HTMLElement).querySelector('.' + markerClassName.startSelection);
                markerStart.appendChild(start);
            } else {
                this.replaceWith(start, this.marker(markerClassName.startSelection, this.encode(start.textContent)));
            }
            if (end.nodeType !== Node.TEXT_NODE && end.tagName === 'BR' &&
                CONSTANT.IGNORE_BLOCK_TAGS.indexOf((end.parentNode as Element).tagName.toLocaleLowerCase()) >= 0) {
                this.replaceWith(end, this.marker(markerClassName.endSelection, this.encode(end.textContent)));
                let markerEnd: Element = (range.endContainer as HTMLElement).querySelector('.' + markerClassName.endSelection);
                markerEnd.appendChild(end);
            } else {
                this.replaceWith(end, this.marker(markerClassName.endSelection, this.encode(end.textContent)));
            }
        } else {
            if (start.nodeType === 3) {
                this.replaceWith(start, this.marker(markerClassName.startSelection, this.encode(start.textContent)));
            } else {
                start = start.tagName === 'BR' ? start.parentNode as Element : start;
                let marker: string = this.marker(markerClassName.startSelection, '');
                append([this.parseHTMLFragment(marker)], start);
            }
        }
    }

    public createTempNode(element: Element): Element {
        let textContent: string = element.textContent;
        if (element.tagName === 'BR') {
            let wrapper: string = '<' + CONSTANT.DEFAULT_TAG + '></' + CONSTANT.DEFAULT_TAG + '>';
            let node: Element = (element.parentNode as Element);
            if (CONSTANT.IGNORE_BLOCK_TAGS.indexOf(node.tagName.toLocaleLowerCase()) >= 0) {
                element = this.wrap(element, this.parseHTMLFragment(wrapper));
            }
        } else if (((element.nodeType !== Node.TEXT_NODE &&
            (element.classList.contains(markerClassName.startSelection) ||
                element.classList.contains(markerClassName.endSelection))) ||
            textContent.replace(/\n/g, '').replace(/(^ *)|( *$)/g, '').length > 0 ||
            textContent.length && textContent.indexOf('\n') < 0)) {
            let wrapper: string = '<' + CONSTANT.DEFAULT_TAG + '></' + CONSTANT.DEFAULT_TAG + '>';
            let target: Element = element;
            element = this.wrap(element, this.parseHTMLFragment(wrapper));
            let ignoreBr: boolean = target.nodeType === Node.ELEMENT_NODE && target.firstChild && target.firstChild.nodeName === 'BR'
                && (target.classList.contains(markerClassName.startSelection) ||
                    target.classList.contains(markerClassName.endSelection));
            if (!ignoreBr && element.nextElementSibling && element.nextElementSibling.tagName === 'BR') {
                element.appendChild(element.nextElementSibling);
            }
        }
        return element;
    }
    public blockNodes(): Node[] {
        let collectionNodes: Element[] = [];
        let selection: Selection = this.getSelection();
        if (this.isEditorArea() && selection.rangeCount) {
            let ranges: Range[] = <Range[]>this.getRangePoint();
            for (let j: number = 0; j < ranges.length; j++) {
                let parentNode: Element;
                let range: Range = ranges[j] as Range;
                let startNode: Element = this.getSelectedNode(range.startContainer as Element, range.startOffset);
                let endNode: Element = this.getSelectedNode(range.endContainer as Element, range.endOffset);
                if (this.isBlockNode(startNode) && collectionNodes.indexOf(startNode) < 0) {
                    collectionNodes.push(startNode);
                }
                parentNode = this.blockParentNode(startNode);
                if (parentNode && collectionNodes.indexOf(parentNode) < 0) {
                    if (CONSTANT.IGNORE_BLOCK_TAGS.indexOf(parentNode.tagName.toLocaleLowerCase()) >= 0 && (startNode.tagName === 'BR' ||
                        startNode.nodeType === Node.TEXT_NODE ||
                        startNode.classList.contains(markerClassName.startSelection) ||
                        startNode.classList.contains(markerClassName.endSelection))) {
                        let tempNode: Element = startNode.previousSibling &&
                            (startNode.previousSibling as Element).nodeType === Node.TEXT_NODE ?
                            startNode.previousSibling as Element : startNode;
                        collectionNodes.push(this.createTempNode(tempNode));
                    } else {
                        collectionNodes.push(parentNode);
                    }
                }
                let nodes: Element[] = [];
                for (let node: Element = startNode; node !== endNode && node !== this.parent; null) {
                    if (nodes.indexOf(node) < 0 && node.childNodes && node.childNodes.length) {
                        nodes.push(node);
                        node = node.childNodes[0] as Element;
                    } else if (node && (node.tagName === 'BR' || node.nodeType === Node.TEXT_NODE ||
                        (node as Element).classList.contains(markerClassName.startSelection) ||
                        (node as Element).classList.contains(markerClassName.endSelection)) &&
                        CONSTANT.IGNORE_BLOCK_TAGS.indexOf((node.parentNode as Element).tagName.toLocaleLowerCase()) >= 0) {
                        node = this.createTempNode(node as Element);
                    } else if (node.nextSibling && ((node.nextSibling as Element).tagName === 'BR' ||
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
                }
                parentNode = this.blockParentNode(endNode);
                if (parentNode && this.ignoreTableTag(parentNode) && collectionNodes.indexOf(parentNode) < 0) {
                    collectionNodes.push(parentNode);
                }
            }
        }
        for (let i: number = collectionNodes.length - 1; i > 0; i--) {
            let nodes: Element[] = this.nodeFinds(collectionNodes[i], collectionNodes);
            if (nodes.length) {
                let listNodes: Element[] = <NodeListOf<Element> & Element[]>collectionNodes[i].querySelectorAll('ul, ol');
                if (collectionNodes[i].tagName === 'LI' && listNodes.length > 0) {
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
}