import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { IHtmlItem } from './../base/interface';
import { NodeSelection } from '../../selection/selection';
import { NodeCutter } from './nodecutter';
import { InsertHtml } from './inserthtml';
import { createElement, isNullOrUndefined as isNOU, closest } from '@syncfusion/ej2-base';

/**
 * Link internal component
 *
 * @hidden
 * @deprecated
 */
export class LinkCommand {
    private parent: EditorManager;
    /**
     * Constructor for creating the Formats plugin
     *
     * @param {EditorManager} parent - specifies the editor manager
     * @hidden
     * @deprecated
     */
    public constructor(parent: EditorManager) {
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
        let closestAnchor: Element = (!isNOU(e.item.selectParent) && e.item.selectParent.length > 0) &&
            closest(e.item.selectParent[0], 'a');
        closestAnchor = !isNOU(closestAnchor) ? closestAnchor :
            (!isNOU(e.item.selectParent) && e.item.selectParent.length > 0) ? (e.item.selectParent[0]) as Element : null;
        if (!isNOU(closestAnchor) && (closestAnchor as HTMLElement).tagName === 'A') {
            const anchorEle: HTMLElement = closestAnchor as HTMLElement;
            let linkText: string = '';
            if (!isNOU(e.item.url)) {
                anchorEle.setAttribute('href', e.item.url);
            }
            if (!isNOU(e.item.title)) {
                anchorEle.setAttribute('title', e.item.title);
            }
            if (!isNOU(e.item.text) && e.item.text !== '') {
                linkText = anchorEle.innerText;
                anchorEle.innerText = e.item.text;
            }
            if (!isNOU(e.item.target)) {
                anchorEle.setAttribute('target', e.item.target);
            } else {
                anchorEle.removeAttribute('target');
            }
            if (linkText === e.item.text) {
                e.item.selection.setSelectionText(this.parent.currentDocument, anchorEle, anchorEle, 1, 1);
                e.item.selection.restore();
            } else {
                const startIndex: number = e.item.action === 'Paste' ? anchorEle.childNodes[0].textContent.length : 0;
                e.item.selection.setSelectionText(
                    this.parent.currentDocument,
                    anchorEle.childNodes[0],
                    anchorEle.childNodes[0], startIndex, anchorEle.childNodes[0].textContent.length);
            }
        } else {
            const domSelection: NodeSelection = new NodeSelection();
            let range: Range = domSelection.getRange(this.parent.currentDocument);
            if (range.endContainer.nodeName === '#text' && range.startContainer.textContent.length === (range.endOffset + 1) &&
            range.endContainer.textContent.charAt(range.endOffset) === ' ' && (!isNOU(range.endContainer.nextSibling) && range.endContainer.nextSibling.nodeName === 'A')) {
                domSelection.setSelectionText(this.parent.currentDocument, range.startContainer, range.endContainer,
                                              range.startOffset, range.endOffset + 1);
                range = domSelection.getRange(this.parent.currentDocument);
            }
            const  text : boolean = isNOU(e.item.text) ? true : e.item.text.replace(/ /g, '').localeCompare(range.toString()
                .replace(/\n/g, ' ').replace(/ /g, '')) < 0;
            if (e.event && (e.event as KeyboardEvent).type === 'keydown' && ((e.event as KeyboardEvent).keyCode === 32
                || (e.event as KeyboardEvent).keyCode === 13) || e.item.action === 'Paste' || range.collapsed || text) {
                const anchor: HTMLElement = this.createAchorNode(e);
                anchor.innerText = e.item.text === '' ? e.item.url : e.item.text;
                e.item.selection.restore();
                InsertHtml.Insert(this.parent.currentDocument, anchor, this.parent.editableElement);
                if (e.event && (e.event as KeyboardEvent).type === 'keydown' && ((e.event as KeyboardEvent).keyCode === 32
                    || (e.event as KeyboardEvent).keyCode === 13)) {
                    const startContainer: Node = e.item.selection.range.startContainer;
                    startContainer.textContent = this.removeText(startContainer.textContent, e.item.text);
                } else {
                    const startIndex: number = e.item.action === 'Paste' ? anchor.childNodes[0].textContent.length : 0;
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
    }
    private createLinkNode(e: IHtmlItem): void {
        const domSelection: NodeSelection = new NodeSelection();
        const nodeCutter: NodeCutter = new NodeCutter();
        const range: Range = domSelection.getRange(this.parent.currentDocument);
        const nodes: Node[] = this.getSelectionNodes(domSelection.getNodeCollection(range));
        const save: NodeSelection = domSelection.save(range, this.parent.currentDocument);
        const txtArray: Node[] = [];
        const inlineNodes: Node[] = [];
        let currentNode: Node;
        const removeNodes: Node[] = [];
        const anchorNodes: Node[] = [];
        const finalinlineNodes: Node[] = [];
        let cloneNode: Node;
        for (let index: number = 0; index < nodes.length; index++) {
            nodes[index as number] = nodeCutter.GetSpliceNode(range, nodes[index as number] as HTMLElement);
            txtArray[index as number] = nodes[index as number];
        }
        for (let i: number = 0; i < txtArray.length; i++) {
            let check: boolean = true;
            currentNode = txtArray[i as number];
            while (check === true) {
                if (currentNode.parentNode.nodeName === 'A') {
                    const anchorEle: HTMLElement = currentNode.parentNode as HTMLElement;
                    currentNode.parentNode.parentNode.insertBefore(anchorEle.firstChild, anchorEle);
                    currentNode.parentNode.removeChild(anchorEle);
                }
                if (this.isBlockNode(currentNode.parentNode as Element) || txtArray.length === 0 || i === 0 || i === txtArray.length - 1
                || range.startContainer.nodeType === 3) {
                    inlineNodes[i as number] = currentNode;
                    check = false;
                } else {
                    currentNode = currentNode.parentNode;
                }
            }
        }

        for (let i: number = 0, j : number = 0; i < inlineNodes.length; i++) {
            if (i === 0) {
                finalinlineNodes[j as number] = inlineNodes[i as number];
            }
            if (inlineNodes.length > 1 && i < inlineNodes.length - 1) {
                if ((inlineNodes[i as number].parentElement === inlineNodes[i + 1].parentElement) &&
                    (inlineNodes[i as number] === inlineNodes[i + 1])) {
                    continue;
                } else {
                    finalinlineNodes[j + 1] = inlineNodes[i + 1];
                    j++;
                }
            }
        }
        let j: number = 0;
        anchorNodes[j as number] = this.createAchorNode(e);
        for (let i: number = 0; i < finalinlineNodes.length; i++) {
            if (i === 0) {
                cloneNode = finalinlineNodes[i as number].cloneNode(true);
                anchorNodes[i as number].appendChild(cloneNode);
            }
            if (i < finalinlineNodes.length - 1) {
                if (finalinlineNodes[i as number].parentNode === finalinlineNodes[i + 1].parentNode) {
                    const cln: Node = finalinlineNodes[i + 1].cloneNode(true);
                    anchorNodes[j as number].appendChild(cln);
                } else {
                    j = j + 1;
                    anchorNodes[j as number] = this.createAchorNode(e);
                    cloneNode = finalinlineNodes[i + 1].cloneNode(true);
                    anchorNodes[j as number].appendChild(cloneNode);
                }
            }
        }
        this.parent.nodeSelection.setRange(document, save.range);
        for (let i: number = 0, j: number = 0, k: number = 0; i <= finalinlineNodes.length; i++) {
            if (i === 0) {
                finalinlineNodes[i as number].parentNode.insertBefore(anchorNodes[j as number], finalinlineNodes[i as number].nextSibling);
                if (this.parent.domNode.blockNodes().length === 1) {
                    this.parent.nodeSelection.setSelectionNode(this.parent.currentDocument, anchorNodes[j as number]);
                }
                removeNodes[k as number] = finalinlineNodes[i as number];
                k++;
            }
            if (i < finalinlineNodes.length - 1) {
                if (finalinlineNodes[i as number].parentNode === finalinlineNodes[i + 1].parentNode) {
                    removeNodes[k as number] = finalinlineNodes[i + 1];
                    k++;
                } else {
                    j = j + 1;
                    finalinlineNodes[i + 1].parentNode.insertBefore(anchorNodes[j as number], finalinlineNodes[i + 1]);
                    removeNodes[k as number] = finalinlineNodes[i + 1];
                    k++;
                }
            }
        }
        for (let i: number = 0; i < removeNodes.length; i++) {
            if (removeNodes[i as number].parentNode) {
                removeNodes[i as number].parentNode.removeChild(removeNodes[i as number]);
            }
        }
    }

    private createAchorNode(e: IHtmlItem): HTMLElement {
        const anchorEle: HTMLElement = createElement('a', {
            className: 'e-rte-anchor',
            attrs: {
                href: e.item.url,
                title: isNOU(e.item.title) || e.item.title === '' ? e.item.url : e.item.title
            }
        });
        if (!isNOU(e.item.target)) {
            anchorEle.setAttribute('target', e.item.target);
        }
        return anchorEle;
    }

    private getSelectionNodes(nodeCollection: Node[]): Node[] {
        nodeCollection = nodeCollection.reverse();
        for (let index: number = 0; index < nodeCollection.length; index++) {
            if (nodeCollection[index as number].nodeType !== 3 || nodeCollection[index as number].textContent.trim() === '') {
                if (nodeCollection[index as number].nodeName !== 'IMG') {
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
        const arr: string[] = text.split(' ');
        for (let i: number = 0; i < arr.length; i++) {
            if (arr[i as number] === val) {
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

        const blockNodes: Node[] = this.parent.domNode.blockNodes();
        if (blockNodes.length < 2) {
            this.parent.domNode.setMarker(e.item.selection);
            const closestAnchor: Node = closest(e.item.selectParent[0], 'a');
            const selectParent: Node = closestAnchor ? closestAnchor : e.item.selectParent[0];
            const parent: Node = selectParent.parentNode;
            const child: Node[] = [];
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
                const linkNode : NodeListOf<HTMLAnchorElement> = (blockNodes[i as number] as HTMLElement).querySelectorAll('a');
                for (let j: number = 0; j < linkNode.length; j++) {
                    if (document.getSelection().containsNode(linkNode[j as number], true)) {
                        linkNode[j as number].outerHTML = linkNode[j as number].innerHTML;
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
