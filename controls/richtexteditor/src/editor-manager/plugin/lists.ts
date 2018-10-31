import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { NodeSelection } from './../../selection';
import { createElement, detach, prepend, append, attributes, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { IHtmlSubCommands } from './../base/interface';
import { IHtmlKeyboardEvent } from './../../editor-manager/base/interface';
import { DOMNode, markerClassName } from './dom-node';
import * as EVENTS from './../../common/constant';

/**
 * Lists internal component
 * @hidden
 */
export class Lists {
    private parent: EditorManager;
    private startContainer: Element;
    private endContainer: Element;
    private saveSelection: NodeSelection;
    private domNode: DOMNode;
    private currentAction: string;
    /**
     * Constructor for creating the Lists plugin
     * @hidden
     */
    constructor(parent: EditorManager) {
        this.parent = parent;
        this.domNode = this.parent.domNode;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(EVENTS.LIST_TYPE, this.applyListsHandler, this);
        this.parent.observer.on(EVENTS.KEY_DOWN_HANDLER, this.keyDownHandler, this);
    }
    private keyDownHandler(e: IHtmlKeyboardEvent): void {
        if (e.event.which === 9) {
            let range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
            this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
            let blockNodes: Element[];
            let startOffset: number = range.startOffset;
            let endOffset: number = range.endOffset;
            let startNode: Element = this.parent.domNode.getSelectedNode(range.startContainer as Element, range.startOffset);
            let endNode: Element = this.parent.domNode.getSelectedNode(range.endContainer as Element, range.endOffset);
            if ((startNode === endNode && (startNode.nodeName === 'BR' || startNode.nodeName === '#text') &&
                CONSTANT.IGNORE_BLOCK_TAGS.indexOf((startNode.parentNode as Element).tagName.toLocaleLowerCase()) >= 0)) {
                return;
            } else {
                blockNodes = <Element[]>this.domNode.blockNodes();
            }
            let nodes: Element[] = [];
            let isNested: boolean = true;
            for (let i: number = 0; i < blockNodes.length; i++) {
                if (blockNodes[i].tagName === 'LI') {
                    nodes.push(blockNodes[i]);
                } else if ((blockNodes[i].parentNode as Element).tagName === 'LI') {
                    nodes.push(blockNodes[i].parentNode as Element);
                }
            }
            if (nodes.length > 1 || nodes.length && ((startOffset === 0 && endOffset === 0) || e.ignoreDefault)) {
                e.event.preventDefault();
                e.event.stopPropagation();
                if (!(e.event.action && e.event.action === 'indent')) {
                    this.domNode.setMarker(this.saveSelection);
                }
                this.currentAction = this.getAction(nodes[0]);
                if (e.event.shiftKey) {
                    this.revertList(nodes as HTMLElement[]);
                    this.revertClean();
                } else {
                    isNested = this.nestedList(nodes);
                }
                if (isNested) {
                    this.cleanNode();
                    (this.parent.editableElement as HTMLElement).focus();
                }
                if (!(e.event.action && e.event.action === 'indent')) {
                    this.saveSelection = this.domNode.saveMarker(this.saveSelection);
                    this.saveSelection.restore();
                    if (e.callBack) {
                        e.callBack({
                            requestType: this.currentAction,
                            editorMode: 'HTML',
                            range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                            elements: this.parent.domNode.blockNodes() as Element[],
                            event: e.event
                        });
                    }
                }
            }
        } else {
            switch ((e.event as KeyboardEventArgs).action) {
                case 'ordered-list':
                    this.applyListsHandler({ subCommand: 'OL', callBack: e.callBack });
                    e.event.preventDefault();
                    break;
                case 'unordered-list':
                    this.applyListsHandler({ subCommand: 'UL', callBack: e.callBack });
                    e.event.preventDefault();
                    break;
            }
        }
    }

    private getAction(element: Element): string {
        let parentNode: Element = element.parentNode as Element;
        return (parentNode.nodeName === 'OL' ? 'OL' : 'UL');
    }

    private revertClean(): void {
        let collectionNodes: Element[] = <NodeListOf<Element> & Element[]>this.parent.editableElement.querySelectorAll('ul, ol');
        for (let i: number = 0; i < collectionNodes.length; i++) {
            let listNodes: Element[] = <NodeListOf<Element> & Element[]>collectionNodes[i].querySelectorAll('ul, ol');
            if (listNodes.length > 0) {
                for (let j: number = 0; j < listNodes.length; j++) {
                    let prevSibling: Element = listNodes[j].previousSibling as Element;
                    if (prevSibling && prevSibling.tagName === 'LI') {
                        prevSibling.appendChild(listNodes[j]);
                    }
                }
            }
        }
    }

    private nestedList(elements: Node[]): boolean {
        let isNested: boolean = false;
        for (let i: number = 0; i < elements.length; i++) {
            let prevSibling: Element = this.domNode.getPreviousNode(elements[i] as Element);
            if (prevSibling) {
                isNested = true;
                let siblingList: Element[] = <NodeListOf<Element> & Element[]>(elements[i] as Element).querySelectorAll('ul, ol');
                let firstNode: Element = siblingList[0];
                if (firstNode) {
                    let nestedElement: Element = createElement('li');
                    prepend([nestedElement], firstNode);
                    for (let h: Node = this.domNode.contents(elements[i] as Element)[0]; h && !this.domNode.isList(h as Element); null) {
                        let nextSibling: Element = h.nextSibling as Element;
                        nestedElement.appendChild(h as Element);
                        h = nextSibling;
                    }
                    append([firstNode], prevSibling);
                    detach(elements[i]);
                } else {
                    siblingList = <NodeListOf<Element> & Element[]>prevSibling.querySelectorAll('ul, ol');
                    firstNode = siblingList[0];
                    if (firstNode) {
                        append([elements[i] as Element], firstNode);
                    } else {
                        let nestedElement: Element = createElement((elements[i].parentNode as Element).tagName);
                        append([nestedElement], prevSibling as Element);
                        append([elements[i] as Element], nestedElement);
                    }
                }
            }
        }
        return isNested;
    }

    private applyListsHandler(e: IHtmlSubCommands): void {
        let range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        this.currentAction = e.subCommand;
        this.domNode.setMarker(this.saveSelection);
        let listsNodes: Node[] = this.domNode.blockNodes();
        for (let i: number = 0; i < listsNodes.length; i++) {
            if ((listsNodes[i] as Element).tagName !== 'LI' && 'LI' === (listsNodes[i].parentNode as Element).tagName) {
                listsNodes[i] = listsNodes[i].parentNode;
            }
        }
        this.applyLists(listsNodes as HTMLElement[], this.currentAction);
        if (e.callBack) {
            e.callBack({
                requestType: this.currentAction,
                event: e.event,
                editorMode: 'HTML',
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.domNode.blockNodes() as Element[]
            });
        }
    }

    private applyLists(elements: HTMLElement[], type: string): void {
        let isReverse: boolean = true;
        if (this.isRevert(elements, type)) {
            this.revertList(elements);
        } else {
            this.checkLists(elements, type);
            for (let i: number = 0; i < elements.length; i++) {
                if ('LI' !== elements[i].tagName) {
                    isReverse = false;
                    let openTag: string = '<' + type + this.domNode.attributes(elements[i]) + '>';
                    let closeTag: string = '</' + type + '>';
                    let newTag: string = 'li class="e-rte-replace-tag"';
                    let replaceHTML: string = (elements[i].tagName.toLowerCase() === CONSTANT.DEFAULT_TAG ? elements[i].innerHTML :
                        elements[i].outerHTML);
                    let innerHTML: string = this.domNode.createTagString(newTag, null, replaceHTML);
                    let collectionString: string = openTag + innerHTML + closeTag;
                    this.domNode.replaceWith(elements[i], collectionString);
                    let element: Element = this.parent.editableElement.querySelector('.e-rte-replace-tag');
                    element.removeAttribute('class');
                }
            }
        }
        this.cleanNode();
        (this.parent.editableElement as HTMLElement).focus();
        this.saveSelection = this.domNode.saveMarker(this.saveSelection);
        this.saveSelection.restore();
    }

    private isRevert(nodes: Element[], tagName: string): boolean {
        let isRevert: boolean = true;
        for (let i: number = 0; i < nodes.length; i++) {
            if (nodes[i].tagName !== 'LI') {
                return false;
            }
            if ((nodes[i].parentNode as Element).tagName !== tagName) { isRevert = false; }
        }
        return isRevert;
    }

    private checkLists(nodes: Element[], tagName: string): void {
        let nodesTemp: Element[] = [];
        for (let i: number = 0; i < nodes.length; i++) {
            let node: Element = nodes[i].parentNode as Element;
            if (nodes[i].tagName === 'LI' && node.tagName !== tagName && nodesTemp.indexOf(node) < 0) {
                nodesTemp.push(node);
            }
        }
        for (let j: number = nodesTemp.length - 1; j >= 0; j--) {
            let h: Element = nodesTemp[j];
            let replace: string = '<' + tagName.toLowerCase() + ' '
                + this.domNode.attributes(h) + '>' + h.innerHTML + '</' + tagName.toLowerCase() + '>';
            this.domNode.replaceWith(nodesTemp[j], replace);
        }
    }

    private cleanNode(): void {
        let liParents: Element[] = <Element[] & NodeListOf<Element>>this.parent.editableElement.querySelectorAll('ol + ol, ul + ul');
        for (let c: number = 0; c < liParents.length; c++) {
            let node: Element = liParents[c];
            if (this.domNode.isList(node.previousSibling as Element) &&
                this.domNode.openTagString(node) === this.domNode.openTagString(node.previousSibling as Element)) {
                let contentNodes: Node[] = this.domNode.contents(node);
                for (let f: number = 0; f < contentNodes.length; f++) {
                    node.previousSibling.appendChild(contentNodes[f]);
                }
                node.parentNode.removeChild(node);
            }
        }
    }

    private revertList(elements: HTMLElement[]): void {
        for (let i: number = elements.length - 1; i >= 0; i--) {
            for (let j: number = i - 1; j >= 0; j--) {
                if (elements[j].contains((elements[i])) || elements[j] === elements[i]) {
                    elements.splice(i, 1);
                    break;
                }
            }
        }
        let viewNode: Element[] = [];
        for (let i: number = 0; i < elements.length; i++) {
            let element: Element = elements[i];
            let parentNode: Element = elements[i].parentNode as Element;
            let className: string = element.getAttribute('class');
            if (element.parentNode.insertBefore(this.closeTag(parentNode.tagName) as Element, element),
                'LI' === (parentNode.parentNode as Element).tagName) {
                element.parentNode.insertBefore(this.closeTag('LI') as Element, element);
                this.domNode.insertAfter(this.openTag('LI'), element);
            } else {
                let classAttr: string = '';
                if (className) {
                    classAttr += ' class="' + className + '"';
                }
                if (CONSTANT.DEFAULT_TAG && 0 === element.querySelectorAll(CONSTANT.BLOCK_TAGS.join(', ')).length) {
                    let wrapper: string = '<' + CONSTANT.DEFAULT_TAG + classAttr + ' class="e-rte-wrap-inner"' +
                        this.domNode.attributes(parentNode) + '></' + CONSTANT.DEFAULT_TAG + '>';
                    this.domNode.wrapInner(element, this.domNode.parseHTMLFragment(wrapper));
                } else if (this.domNode.contents(element)[0].nodeType === 3) {
                    let replace: string = this.domNode.createTagString(
                        CONSTANT.DEFAULT_TAG, parentNode, this.parent.domNode.encode(this.domNode.contents(element)[0].textContent));
                    this.domNode.replaceWith(this.domNode.contents(element)[0] as Element, replace);
                } else if ((this.domNode.contents(element)[0] as HTMLElement).classList.contains(markerClassName.startSelection) ||
                    (this.domNode.contents(element)[0] as HTMLElement).classList.contains(markerClassName.endSelection)) {
                    let replace: string = this.domNode.createTagString(
                        CONSTANT.DEFAULT_TAG, parentNode, (this.domNode.contents(element)[0] as HTMLElement).outerHTML);
                    this.domNode.replaceWith(this.domNode.contents(element)[0] as Element, replace);
                } else {
                    let childNode: Element = element.firstChild as Element;
                    className = childNode.getAttribute('class');
                    attributes(childNode, this.domNode.rawAttributes(parentNode));
                    if (className && childNode.getAttribute('class')) {
                        attributes(childNode, { 'class': className + ' ' + childNode.getAttribute('class') });
                    }
                }
                append([this.openTag('LI') as Element], element);
                prepend([this.closeTag('LI') as Element], element);
            }
            this.domNode.insertAfter(this.openTag(parentNode.tagName), element);
            if ((parentNode.parentNode as Element).tagName === 'LI') {
                parentNode = parentNode.parentNode.parentNode as Element;
            }
            if (viewNode.indexOf(parentNode) < 0) {
                viewNode.push(parentNode);
            }
        }
        for (let i: number = 0; i < viewNode.length; i++) {
            let node: Element = viewNode[i] as Element;
            let nodeInnerHtml: string = node.innerHTML;
            let closeTag: RegExp = /<span class="e-rte-list-close-([a-z]*)"><\/span>/g;
            let openTag: RegExp = /<span class="e-rte-list-open-([a-z]*)"><\/span>/g;
            nodeInnerHtml = nodeInnerHtml.replace(closeTag, '</$1>');
            nodeInnerHtml = nodeInnerHtml.replace(openTag, '<$1 ' + this.domNode.attributes(node) + '>');
            this.domNode.replaceWith(node, this.domNode.openTagString(node) + nodeInnerHtml.trim() + this.domNode.closeTagString(node));
        }
        let emptyLi: Element[] = <NodeListOf<Element> & Element[]>this.parent.editableElement.querySelectorAll('li:empty');
        for (let i: number = 0; i < emptyLi.length; i++) {
            detach(emptyLi[i]);
        }
        let emptyUl: Element[] = <NodeListOf<Element> & Element[]>this.parent.editableElement.querySelectorAll('ul:empty, ol:empty');
        for (let i: number = 0; i < emptyUl.length; i++) {
            detach(emptyUl[i]);
        }
    }

    private openTag(type: string): Element {
        return this.domNode.parseHTMLFragment('<span class="e-rte-list-open-' + type.toLowerCase() + '"></span>');
    }

    private closeTag(type: string): Element {
        return this.domNode.parseHTMLFragment('<span class="e-rte-list-close-' + type.toLowerCase() + '"></span>');
    }

}

