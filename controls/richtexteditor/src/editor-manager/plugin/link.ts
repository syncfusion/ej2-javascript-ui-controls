import { createElement, isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { IHtmlItem } from './../base/interface';
import { NodeSelection } from '../../selection/selection';
import { NodeCutter } from './nodecutter';
import { InsertHtml } from './inserthtml';
/**
 * Link internal component
 * @hidden
 * @deprecated
 */
export class LinkCommand {
    private parent: EditorManager;
    /**
     * Constructor for creating the Formats plugin
     * @hidden
     * @deprecated
     */
    constructor(parent: EditorManager) {
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.LINK, this.linkCommand, this);
    }

    private linkCommand(e: IHtmlItem): void {
        switch (e.value.toString().toLocaleLowerCase()) {
            case 'createlink':
            case 'editlink':
                this.createLink(e);
                break;
            case 'openlink':
                this.openLink(e);
                break;
            case 'removelink':
                this.removeLink(e);
                break;
        }
    }

    private createLink(e: IHtmlItem): void {
        let closestAnchor: Element = (!isNullOrUndefined(e.item.selectParent) && e.item.selectParent.length > 0) &&
            closest(e.item.selectParent[0], 'a');
        closestAnchor = !isNullOrUndefined(closestAnchor) ? closestAnchor :
            (!isNullOrUndefined(e.item.selectParent) && e.item.selectParent.length > 0) ? (e.item.selectParent[0]) as Element : null;
        if (!isNullOrUndefined(closestAnchor) && (closestAnchor as HTMLElement).tagName === 'A') {
            let anchorEle: HTMLElement = closestAnchor as HTMLElement;
            anchorEle.setAttribute('href', e.item.url);
            anchorEle.setAttribute('title', e.item.title);
            let linkText: string = anchorEle.innerText;
            anchorEle.innerText = e.item.text;
            if (!isNullOrUndefined(e.item.target)) {
                anchorEle.setAttribute('target', e.item.target);
            } else {
                anchorEle.removeAttribute('target');
            }
            if (linkText === e.item.text) {
                e.item.selection.setSelectionText(this.parent.currentDocument, anchorEle, anchorEle, 1, 1);
                e.item.selection.restore();
            } else {
                let startIndex: number = e.item.action === 'Paste' ? anchorEle.childNodes[0].textContent.length : 0;
                e.item.selection.setSelectionText(
                this.parent.currentDocument,
                anchorEle.childNodes[0],
                anchorEle.childNodes[0], startIndex, anchorEle.childNodes[0].textContent.length);
            }
        } else {
            let domSelection: NodeSelection = new NodeSelection();
            let range: Range = domSelection.getRange(this.parent.currentDocument);
            let  text : boolean = isNullOrUndefined(e.item.text) ? true : e.item.text.replace(/ /g, '').localeCompare(range.toString()
            .replace(/\n/g, ' ').replace(/ /g, '')) < 0;
            if (e.event && (e.event as KeyboardEvent).type === 'keydown' && ((e.event as KeyboardEvent).keyCode === 32
                || (e.event as KeyboardEvent).keyCode === 13) || e.item.action === 'Paste' || range.collapsed || text) {
                let anchor: HTMLElement = this.createAchorNode(e);
                anchor.innerText = e.item.text === '' ? e.item.url : e.item.text;
                e.item.selection.restore();
                InsertHtml.Insert(this.parent.currentDocument, anchor, this.parent.editableElement);
                if (e.event && (e.event as KeyboardEvent).type === 'keydown' && ((e.event as KeyboardEvent).keyCode === 32
                    || (e.event as KeyboardEvent).keyCode === 13)) {
                    let startContainer: Node = e.item.selection.range.startContainer;
                    startContainer.textContent = this.removeText(startContainer.textContent, e.item.text);
                } else {
                    let startIndex: number = e.item.action === 'Paste' ? anchor.childNodes[0].textContent.length : 0;
                    e.item.selection.setSelectionText(
                        this.parent.currentDocument, anchor.childNodes[0], anchor.childNodes[0],
                        startIndex, anchor.childNodes[0].textContent.length);
                }

            } else {
                this.createLinkNode(e);
            }
        }
        if (e.callBack) {
            e.callBack({
                requestType: 'Links',
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    };
    private createLinkNode(e: IHtmlItem): void {
        let domSelection: NodeSelection = new NodeSelection();
        let nodeCutter: NodeCutter = new NodeCutter();
        let range: Range = domSelection.getRange(this.parent.currentDocument);
        let nodes: Node[] = this.getSelectionNodes(domSelection.getNodeCollection(range));
        let save: NodeSelection = domSelection.save(range, this.parent.currentDocument);
        let txtArray: Node[] = [];
        let inlineNodes: Node[] = [];
        let currentNode: Node;
        let removeNodes: Node[] = [];
        let anchorNodes: Node[] = [];
        let finalinlineNodes: Node[] = [];
        let cloneNode: Node;
        for (let index: number = 0; index < nodes.length; index++) {
            nodes[index] = nodeCutter.GetSpliceNode(range, nodes[index] as HTMLElement);
            txtArray[index] = nodes[index];
        }
        for (let i: number = 0; i < txtArray.length; i++) {
            let check: boolean = true;
            currentNode = txtArray[i];
            while (check === true) {
                if (currentNode.parentElement.nodeName === 'A') {
                    let anchorEle: HTMLElement = currentNode.parentElement;
                    currentNode.parentElement.parentElement.insertBefore(anchorEle.firstChild, anchorEle);
                    currentNode.parentElement.removeChild(anchorEle);
                }
                if (this.isBlockNode(currentNode.parentElement) || txtArray.length === 0 || i === 0 || i === txtArray.length - 1) {
                    inlineNodes[i] = currentNode;
                    check = false;
                } else {
                    currentNode = currentNode.parentElement;
                }
            }
        }

        for (let i: number = 0, j : number = 0; i < inlineNodes.length; i++) {
            if (i === 0) {
                finalinlineNodes[j] = inlineNodes[i];
            }
            if (inlineNodes.length > 1 && i < inlineNodes.length - 1) {
                if ((inlineNodes[i].parentElement === inlineNodes[i + 1].parentElement) && (inlineNodes[i] === inlineNodes[i + 1])) {
                    continue;
                } else {
                    finalinlineNodes[j + 1] = inlineNodes[i + 1];
                    j++;
                }
            }
        }
        let j: number = 0;
        anchorNodes[j] = this.createAchorNode(e);
        for (let i: number = 0; i < finalinlineNodes.length; i++) {
            if (i === 0) {
                cloneNode = finalinlineNodes[i].cloneNode(true);
                anchorNodes[i].appendChild(cloneNode);
            }
            if (i < finalinlineNodes.length - 1) {
                if (finalinlineNodes[i].parentNode === finalinlineNodes[i + 1].parentNode) {
                    let cln: Node = finalinlineNodes[i + 1].cloneNode(true);
                    anchorNodes[j].appendChild(cln);
                } else {
                    j = j + 1;
                    anchorNodes[j] = this.createAchorNode(e);
                    cloneNode = finalinlineNodes[i + 1].cloneNode(true);
                    anchorNodes[j].appendChild(cloneNode);
                }
            }
        }
        this.parent.nodeSelection.setRange(document, save.range);
        for (let i: number = 0, j: number = 0, k: number = 0; i <= finalinlineNodes.length; i++) {
            if (i === 0) {
                finalinlineNodes[i].parentNode.insertBefore(anchorNodes[j], finalinlineNodes[i].nextSibling);
                if (this.parent.domNode.blockNodes().length === 1) {
                    this.parent.nodeSelection.setSelectionNode(this.parent.currentDocument, anchorNodes[j]);
                }
                removeNodes[k] = finalinlineNodes[i];
                k++;
            }
            if (i < finalinlineNodes.length - 1) {
                if (finalinlineNodes[i].parentNode === finalinlineNodes[i + 1].parentNode) {
                    removeNodes[k] = finalinlineNodes[i + 1];
                    k++;
                } else {
                    j = j + 1;
                    finalinlineNodes[i + 1].parentNode.insertBefore(anchorNodes[j], finalinlineNodes[i + 1]);
                    removeNodes[k] = finalinlineNodes[i + 1];
                    k++;
                }
            }
        }
        for (let i: number = 0; i < removeNodes.length; i++) {
            if (removeNodes[i].parentNode) {
                removeNodes[i].parentNode.removeChild(removeNodes[i]);
            }
        }
    }

    private createAchorNode(e: IHtmlItem): HTMLElement {
        let anchorEle: HTMLElement = createElement('a', {
            className: 'e-rte-anchor',
            attrs: {
                href: e.item.url,
                title: isNullOrUndefined(e.item.title) || e.item.title === '' ? e.item.url : e.item.title
            }
        });
        if (!isNullOrUndefined(e.item.target)) {
            anchorEle.setAttribute('target', e.item.target);
        }
        return anchorEle;
    }

    private getSelectionNodes(nodeCollection: Node[]): Node[] {
        nodeCollection = nodeCollection.reverse();
        for (let index: number = 0; index < nodeCollection.length; index++) {
            if (nodeCollection[index].nodeType !== 3 || nodeCollection[index].textContent.trim() === '') {
                if (nodeCollection[index].nodeName !== 'IMG') {
                    nodeCollection.splice(index, 1);
                    index--;
                }
            }
        }
        return nodeCollection.reverse();
    }

    private isBlockNode(element: Element): boolean {
        return (!!element && (element.nodeType === Node.ELEMENT_NODE && CONSTANT.BLOCK_TAGS.indexOf(element.tagName.toLowerCase()) >= 0));
    }

    private removeText(text: string, val: string): string {
        let arr: string[] = text.split(' ');
        for (let i: number = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                arr.splice(i, 1);
                i--;
            }
        }
        return arr.join(' ') + ' ';
    }
    private openLink(e: IHtmlItem): void {
        document.defaultView.open(e.item.url, e.item.target);
        this.callBack(e);
    }
    private removeLink(e: IHtmlItem): void {

        let blockNodes: Node[] = this.parent.domNode.blockNodes();
        if (blockNodes.length < 2) {
            this.parent.domNode.setMarker(e.item.selection);
            let closestAnchor: Node = closest(e.item.selectParent[0], 'a');
            let selectParent: Node = closestAnchor ? closestAnchor : e.item.selectParent[0];
            let parent: Node = selectParent.parentNode;
            let child: Node[] = [];
            for (; selectParent.firstChild; null) {
                child.push(parent.insertBefore(selectParent.firstChild, selectParent));
            }
            parent.removeChild(selectParent);
            if (child && child.length === 1) {
                e.item.selection.startContainer = e.item.selection.getNodeArray(child[child.length - 1], true);
                e.item.selection.endContainer = e.item.selection.startContainer;
            }
            e.item.selection = this.parent.domNode.saveMarker(e.item.selection);
        } else {
            for (let i: number = 0; i < blockNodes.length; i++) {
                let linkNode : NodeListOf<HTMLAnchorElement> = (blockNodes[i] as HTMLElement).querySelectorAll('a');
                for (let j: number = 0; j < linkNode.length; j++) {
                    if (document.getSelection().containsNode(linkNode[j], true)) {
                        linkNode[j].outerHTML = linkNode[j].innerHTML;
                    }
                }
            }
        }
        e.item.selection.restore();
        this.callBack(e);
    }
    private callBack(e: IHtmlItem): void {
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
        }
    }
}