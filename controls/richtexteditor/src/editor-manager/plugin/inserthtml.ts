import { NodeSelection } from './../../selection/index';

import { NodeCutter } from './nodecutter';
import * as CONSTANT from './../base/constant';
import { detach, Browser, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { InsertMethods } from './insert-methods';

/**
 * Insert a HTML Node or Text
 * @hidden
 */
export class InsertHtml {
    public static Insert(docElement: Document, insertNode: Node | string, editNode?: Element): void {
        let node: Node;
        if (typeof insertNode === 'string') {
            let divNode: HTMLElement = document.createElement('div');
            divNode.innerHTML = insertNode;
            node = divNode.firstChild;
        } else {
            node = insertNode;
        }
        let nodeSelection: NodeSelection = new NodeSelection();
        let nodeCutter: NodeCutter = new NodeCutter();
        let range: Range = nodeSelection.getRange(docElement);
        let isCollapsed: boolean = range.collapsed;
        let nodes: Node[] = nodeSelection.getInsertNodeCollection(range);
        let closestParentNode: Node = (node.nodeName.toLowerCase() === 'table') ? this.closestEle(nodes[0].parentNode, editNode) : nodes[0];
        if (editNode !== range.startContainer && ((!isCollapsed && !(closestParentNode.nodeType === Node.ELEMENT_NODE &&
            CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) !== -1))
            || (node.nodeName.toLowerCase() === 'table' && closestParentNode &&
                CONSTANT.TABLE_BLOCK_TAGS.indexOf((closestParentNode as Element).tagName.toLocaleLowerCase()) === -1))) {
            let preNode: Node = nodeCutter.GetSpliceNode(range, closestParentNode as HTMLElement);
            let sibNode: Node = preNode.previousSibling;
            let parentNode: Node = preNode.parentNode;
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement);
            } else {
                let lasNode: Node = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1].parentElement as HTMLElement);
                lasNode = isNOU(lasNode) ? preNode : lasNode;
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                    lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement);
            }
            range.extractContents();
            if ((insertNode as HTMLElement).tagName === 'TABLE') {
                this.removeEmptyElements(editNode as HTMLElement);
            }
            for (let index: number = 0; index < nodes.length; index++) {
                if (nodes[index].nodeType !== 3 && nodes[index].parentNode != null) {
                    if (nodes[index].nodeName === 'IMG') { continue; }
                    nodes[index].parentNode.removeChild(nodes[index]);
                }
            }
            if (sibNode) {
                InsertMethods.AppendBefore(node as HTMLElement, sibNode as HTMLElement, true);
            } else {
                let previousNode: Node = null;
                while (parentNode !== editNode && parentNode.firstChild &&
                    (parentNode.textContent.trim() === '')) {
                    let parentNode1: Node = parentNode.parentNode;
                    previousNode = parentNode;
                    parentNode = parentNode1;
                }
                if (previousNode !== null) {
                    parentNode = previousNode;
                }
                if (parentNode.firstChild && (parentNode as HTMLElement).contentEditable !== 'true') {
                    if (parentNode.textContent.trim() === '') {
                        InsertMethods.AppendBefore(node as HTMLElement, parentNode as HTMLElement, false);
                        detach(parentNode);
                    } else {
                        InsertMethods.AppendBefore(node as HTMLElement, parentNode.firstChild as HTMLElement, false);
                    }
                } else {
                    parentNode.appendChild(node);
                }
            }
            if (node.nodeType !== 3) {
                nodeSelection.setSelectionText(docElement, node, node, 0, node.childNodes.length);
            } else {
                nodeSelection.setSelectionText(docElement, node, node, 0, node.textContent.length);
            }
        } else {
            range.deleteContents();
            if (Browser.isIE) {
                let frag: DocumentFragment = docElement.createDocumentFragment();
                frag.appendChild(node);
                range.insertNode(frag);
            } else {
                range.insertNode(node);
            }
            if (node.nodeType !== 3 && node.childNodes.length > 0) {
                nodeSelection.setSelectionText(docElement, node, node, 1, 1);
            } else if (node.nodeType !== 3) {
                nodeSelection.setSelectionContents(docElement, node);
            } else {
                nodeSelection.setSelectionText(docElement, node, node, node.textContent.length, node.textContent.length);
            }
        }
        if (!isNOU(node) && !isNOU((node as HTMLElement).classList) && (node as HTMLElement).classList.contains('pasteContent')) {
            let lastNode: Node = node.lastChild;
            while (!isNOU(lastNode) && lastNode.nodeName !== '#text' && lastNode.nodeName !== 'IMG') {
                lastNode = lastNode.lastChild;
            }
            lastNode = isNOU(lastNode) ? node : lastNode;
            nodeSelection.setSelectionText(docElement, lastNode, lastNode, lastNode.textContent.length, lastNode.textContent.length);
        }
    }
    private static findDetachEmptyElem(element: Element): HTMLElement {
        let removableElement: HTMLElement;
        if (!isNOU(element.parentElement)) {
            if (element.parentElement.textContent.trim() === '' && element.parentElement.contentEditable !== 'true') {
                removableElement = this.findDetachEmptyElem(element.parentElement);
            } else {
                removableElement = element as HTMLElement;
            }
        } else {
            removableElement = null;
        }
        return removableElement;
    }
    private static removeEmptyElements(element: HTMLElement): void {
        let emptyElements: NodeListOf<Element> = element.querySelectorAll(':empty');
        for (let i: number = 0; i < emptyElements.length; i++) {
            if (emptyElements[i].tagName !== 'IMG' && emptyElements[i].tagName !== 'BR') {
                let detachableElement: HTMLElement = this.findDetachEmptyElem(emptyElements[i]);
                if (!isNOU(detachableElement)) { detach(detachableElement); }
            }
        }
    }
    private static closestEle(element: Element | Node, editNode: Element): Element {
        let el: Element = <Element>element;
        while (el && el.nodeType === 1) {
            if (el.parentNode === editNode ||
                (!isNOU((el.parentNode as Element).tagName) &&
                CONSTANT.IGNORE_BLOCK_TAGS.indexOf((el.parentNode as Element).tagName.toLocaleLowerCase()) !== -1)) {
                return el;
            }
            el = <Element>el.parentNode;
        }
        return null;
    }
}