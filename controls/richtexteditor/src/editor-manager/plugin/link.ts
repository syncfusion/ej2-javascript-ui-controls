import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { IHtmlItem } from './../base/interface';
import { ImageDropEventArgs } from '../../common/interface';
import { NodeSelection } from '../../selection/selection';
import { NodeCutter } from './nodecutter';
import { InsertHtml } from './inserthtml';
import { createElement, isNullOrUndefined as isNOU, closest, EventHandler } from '@syncfusion/ej2-base';
import * as EVENTS from './../../common/constant';
import { DOMMethods } from './dom-tree';
import { InsertMethods } from './insert-methods';
import { IsFormatted } from './isformatted';
import { IEditorModel } from '../../common/interface';

/**
 * Link internal component
 *
 * @hidden
 * @deprecated
 */
export class LinkCommand {
    private parent: IEditorModel;
    private drop: EventListenerOrEventListenerObject;
    private enter: EventListenerOrEventListenerObject;
    private start: EventListenerOrEventListenerObject;
    private dragSelectionRange: Range;

    /**
     * Constructor for creating the Formats plugin
     *
     * @param {IEditorModel} parent - specifies the editor manager
     * @hidden
     * @deprecated
     */
    public constructor(parent: IEditorModel) {
        this.parent = parent;
        this.drop = this.dragDrop.bind(this);
        this.enter = this.dragEnter.bind(this);
        this.start = this.dragStart.bind(this);
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.observer.on(CONSTANT.LINK, this.linkCommand, this);
        this.parent.observer.on(EVENTS.INTERNAL_DESTROY, this.destroy, this);
        const dropElement: Element = this.parent.editableElement;
        if (dropElement) {
            EventHandler.add(dropElement, 'drop', this.drop as EventListener);
            EventHandler.add(dropElement, 'dragenter', this.enter as EventListener);
            EventHandler.add(dropElement, 'dragover', this.start as EventListener);
        }
    }

    private removeEventListener(): void {
        this.parent.observer.off(CONSTANT.LINK, this.linkCommand);
        this.parent.observer.off(EVENTS.INTERNAL_DESTROY, this.destroy);
        const dropElement: Element = this.parent.editableElement;
        if (dropElement) {
            EventHandler.remove(dropElement, 'drop', this.drop as EventListener);
            EventHandler.remove(dropElement, 'dragenter', this.enter as EventListener);
            EventHandler.remove(dropElement, 'dragover', this.start as EventListener);
        }
        this.drop = null;
        this.enter = null;
        this.start = null;
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
    private dragStart(event: DragEvent): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        if (range) {
            const startContainer: Node = range.startContainer;
            const endContainer: Node = range.endContainer;
            let startAnchor: HTMLAnchorElement | null = null;
            let endAnchor: HTMLAnchorElement | null = null;
            if (startContainer.nodeType === Node.ELEMENT_NODE) {
                startAnchor = (startContainer as Element).closest('a');
            } else {
                const parentElement: Element | null = (startContainer as Element).parentElement;
                if (parentElement) {
                    startAnchor = parentElement.closest('a');
                }
            }
            if (endContainer.nodeType === Node.ELEMENT_NODE) {
                endAnchor = (endContainer as Element).closest('a');
            } else {
                const parentElement: Element | null = (endContainer as Element).parentElement;
                if (parentElement) {
                    endAnchor = parentElement.closest('a');
                }
            }
            if ((event.target as HTMLElement).nodeName === 'A' || startAnchor || endAnchor) {
                this.dragSelectionRange = range.cloneRange();
            }
        }
    }

    private dragEnter(event: DragEvent): void {
        event.dataTransfer.dropEffect = 'copy';
        event.preventDefault();
    }

    private dragDrop(event: ImageDropEventArgs): void {
        if (this.dragSelectionRange) {
            event.preventDefault();
            let range: Range;
            if (this.parent.currentDocument.caretRangeFromPoint) { //For chrome and safari
                range = this.parent.currentDocument.caretRangeFromPoint(event.clientX, event.clientY);
            } else if ((event.rangeParent)) { //For mozilla firefox
                range = this.parent.currentDocument.createRange();
                range.setStart(event.rangeParent, event.rangeOffset);
            }
            let html: string = event.dataTransfer.getData('text/html');
            if (html) {
                let anchorElement: HTMLAnchorElement | null = null;
                if (range.startContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
                    anchorElement = (range.startContainer.parentNode as HTMLAnchorElement);
                } else if (range.startContainer instanceof HTMLAnchorElement) {
                    anchorElement = range.startContainer;
                }
                if (!anchorElement) {
                    if (range.collapsed) {
                        const node: Node = range.startContainer;
                        if (node) {
                            const parentAnchor: Element | null = (node as Element).closest('a');
                            if (parentAnchor) {
                                anchorElement = parentAnchor as HTMLAnchorElement;
                            }
                        }
                    }
                } else if (anchorElement && anchorElement.nodeName !== 'A') {
                    anchorElement = anchorElement.closest('a');
                }
                if (anchorElement) {
                    const tempDiv: HTMLElement = createElement('div', { innerHTML: html });
                    const anchors: NodeListOf<HTMLAnchorElement> = tempDiv.querySelectorAll('a');
                    anchors.forEach((anchor: HTMLAnchorElement) => {
                        while (anchor.firstChild) {
                            anchor.parentNode.insertBefore(anchor.firstChild, anchor);
                        }
                        anchor.remove();
                    });
                    html = tempDiv.innerHTML;
                }
                range.deleteContents();
                const fragment: DocumentFragment = range.createContextualFragment(html);
                const anchorEle: NodeListOf<HTMLAnchorElement> = fragment.querySelectorAll('a');
                anchorEle.forEach((anchor: HTMLAnchorElement): void => {
                    anchor.style.textDecoration = '';
                });
                if (this.dragSelectionRange) {
                    this.dragSelectionRange.deleteContents();
                    this.normalizeEmptyLinks();
                    this.dragSelectionRange = null;
                }
                this.parent.nodeSelection.setRange(this.parent.currentDocument, range);
                InsertHtml.Insert(this.parent.currentDocument, fragment,
                                  this.parent.editableElement as HTMLElement, true);
                if (anchorElement) {
                    anchorElement.normalize();
                }
            }
        }
    }

    private normalizeEmptyLinks(): void {
        if (!this.dragSelectionRange) {
            return;
        }
        const commonAncestor: Node = this.dragSelectionRange.commonAncestorContainer;
        let parentElement: HTMLElement = commonAncestor.nodeType === Node.TEXT_NODE
            ? commonAncestor.parentElement
            : commonAncestor as HTMLElement;
        if (parentElement && CONSTANT.BLOCK_TAGS.indexOf(parentElement.nodeName.toLocaleLowerCase()) === -1) {
            parentElement = this.parent.domNode.getImmediateBlockNode(parentElement) as HTMLElement;
        }
        if (parentElement) {
            const emptyLinks: NodeListOf<HTMLAnchorElement> = parentElement.querySelectorAll('a:empty');
            emptyLinks.forEach((link: HTMLAnchorElement) => {
                if (link.textContent.trim() === '' && !link.querySelector('img') && !link.querySelector('video')) {
                    if (link.parentNode) {
                        link.parentNode.removeChild(link);
                    }
                }
            });
        }
    }

    private createLink(e: IHtmlItem): void {
        let closestAnchor: Element = (!isNOU(e.item.selectParent) && e.item.selectParent.length === 1) &&
            closest(e.item.selectParent[0], 'a');
        closestAnchor = !isNOU(closestAnchor) ? closestAnchor :
            (!isNOU(e.item.selectParent) && e.item.selectParent.length === 1) ?
                (e.item.selectParent[0]) as Element : null;
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
                const walker: TreeWalker = document.createTreeWalker(anchorEle, NodeFilter.SHOW_TEXT, null);
                const anchorTextnode: Node = walker.nextNode();
                if (anchorTextnode) {
                    anchorTextnode.textContent = e.item.text;
                }
            }
            if (!isNOU(e.item.target)) {
                anchorEle.setAttribute('target', e.item.target);
                anchorEle.setAttribute('aria-label', e.item.ariaLabel);
            } else {
                anchorEle.removeAttribute('target');
                anchorEle.removeAttribute('aria-label');
            }
            if (linkText === e.item.text) {
                e.item.selection.setSelectionText(this.parent.currentDocument, anchorEle, anchorEle, 1, 1);
                e.item.selection.restore();
            } else {
                const startIndex: number = e.item.action === 'Paste' ? anchorEle.childNodes[0].textContent.length : 0;
                const endIndex: number = anchorEle.firstChild.nodeName === '#text' ? anchorEle.childNodes[0].textContent.length : anchorEle.childNodes.length;
                e.item.selection.setSelectionText(this.parent.currentDocument,
                                                  anchorEle.childNodes[0],
                                                  anchorEle.childNodes[0],
                                                  startIndex, endIndex);
            }
        } else {
            const domSelection: NodeSelection = new NodeSelection(this.parent.editableElement as HTMLElement);
            let range: Range = domSelection.getRange(this.parent.currentDocument);
            if (range.endContainer.nodeName === '#text' && range.startContainer.textContent.length === (range.endOffset + 1) &&
                range.endContainer.textContent.charAt(range.endOffset) === ' ' && (!isNOU(range.endContainer.nextSibling) && range.endContainer.nextSibling.nodeName === 'A')) {
                domSelection.setSelectionText(this.parent.currentDocument, range.startContainer, range.endContainer,
                                              range.startOffset, range.endOffset + 1);
                range = domSelection.getRange(this.parent.currentDocument);
            }
            const text: boolean = isNOU(e.item.text) ? true : e.item.text.replace(/ /g, '').localeCompare(range.toString()
                .replace(/\n/g, ' ').replace(/ /g, '')) < 0;
            if (e.event && (e.event as KeyboardEvent).type === 'keydown' && ((e.event as KeyboardEvent).keyCode === 32
                || (e.event as KeyboardEvent).keyCode === 13) || e.item.action === 'Paste' || range.collapsed || text) {
                const anchor: HTMLElement = this.createAchorNode(e);
                anchor.innerText = e.item.text === '' ? e.item.url : e.item.text;
                const text: string = anchor.innerText;
                // Replace spaces with non-breaking spaces
                const modifiedText: string = text.replace(/  +/g, function (match: string): string {
                    return '\u00A0'.repeat(match.length);
                });
                anchor.innerText = modifiedText;
                e.item.selection.restore();
                InsertHtml.Insert(this.parent.currentDocument, anchor, this.parent.editableElement);
                if (!isNOU(anchor.parentElement) && anchor.parentElement.nodeName === 'LI') {
                    if (!isNOU(anchor.parentNode.childNodes) && anchor.parentNode.childNodes[0].textContent === '') {
                        anchor.parentNode.removeChild(anchor.parentNode.childNodes[0]);
                    }
                }
                const regex: RegExp = /[^\w\s\\/\\.\\:]/g;
                if (e.event && (e.event as KeyboardEvent).type === 'keydown' && ((e.event as KeyboardEvent).keyCode === 32
                    || (e.event as KeyboardEvent).keyCode === 13 || regex.test((e.event as KeyboardEvent).key))) {
                    const startContainer: Node = e.item.selection.range.startContainer;
                    startContainer.textContent = this.removeText(startContainer.textContent, e.item.text);
                } else {
                    const startIndex: number = e.item.action === 'Paste' ? anchor.childNodes[0].textContent.length : 0;
                    e.item.selection.setSelectionText(
                        this.parent.currentDocument, anchor.childNodes[0], anchor.childNodes[0],
                        startIndex, anchor.childNodes[0].textContent.length);
                }

            } else {
                this.handleLinkFormat(e);
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
        if (!isNOU(e.item.ariaLabel)) {
            anchorEle.setAttribute('aria-label', e.item.ariaLabel);
        }
        return anchorEle;
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
                if (parent) {
                    child.push(parent.insertBefore(selectParent.firstChild, selectParent));
                } else {
                    break;
                }
            }
            parent.removeChild(selectParent);
            if (child && child.length === 1) {
                e.item.selection.startContainer = e.item.selection.getNodeArray(child[child.length - 1], true);
                e.item.selection.endContainer = e.item.selection.startContainer;
                e.item.selection.startOffset = 0;
                e.item.selection.endOffset = child[child.length - 1].textContent.length;
            }
            e.item.selection = this.parent.domNode.saveMarker(e.item.selection);
        } else {
            for (let i: number = 0; i < blockNodes.length; i++) {
                const linkNode: NodeListOf<HTMLAnchorElement> = (blockNodes[i as number] as HTMLElement).querySelectorAll('a');
                for (let j: number = 0; j < linkNode.length; j++) {
                    if (this.parent.currentDocument.getSelection().containsNode(linkNode[j as number], true)) {
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

    public destroy(): void {
        this.removeEventListener();
    }

    private handleLinkFormat(e: IHtmlItem): void {
        const editableElement: HTMLDivElement = this.parent.editableElement as HTMLDivElement;
        const range: Range = this.parent.nodeSelection.getRange(editableElement.ownerDocument);
        const selection: Selection = this.parent.currentDocument.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return;
        }
        const domMethods: DOMMethods = new DOMMethods(editableElement);
        const blockNodes: HTMLElement[] = e.enterAction === 'BR' ? [this.parent.editableElement as HTMLElement] : domMethods.getBlockNode();
        const appliedNodes: Text[] = [];
        const inlineMediaTags: string[] = ['IMG', 'AUDIO', 'VIDEO'];
        let mediaStart: Node | null;
        let mediaEnd: Node | null;
        if (range.startContainer.nodeType === 1) {
            const mediaNode: Node = range.startContainer.childNodes[range.startOffset];
            mediaStart = mediaNode && inlineMediaTags.indexOf(mediaNode.nodeName) > -1 ? mediaNode : null;
        }
        if (range.endContainer.nodeType === 1) {
            const mediaNode: Node = range.endContainer.childNodes[range.endContainer.childNodes.length > 1 ?
                range.endOffset - 1 : range.endOffset];
            mediaEnd = mediaNode && inlineMediaTags.indexOf(mediaNode.nodeName) > -1 ? mediaNode : null;
        }
        const staticRange: StaticRange = {
            startContainer: range.startContainer,
            endContainer: range.endContainer,
            endOffset: range.endOffset,
            startOffset: range.startOffset,
            collapsed: range.collapsed
        };
        for (let i: number = 0; i < blockNodes.length; i++) {
            const currentNode: HTMLElement = blockNodes[i as number];
            this.unwrapLink(currentNode);
            currentNode.normalize();
            this.applyLinkToBlockNode(currentNode, e, appliedNodes);
            if (blockNodes.length <= 1 && appliedNodes.length <= 1) {
                const currentText: string = appliedNodes[appliedNodes.length - 1].textContent.trim();
                const newText: string = e.item.text.trim();
                if (currentText !== newText) {
                    appliedNodes[appliedNodes.length - 1].textContent = newText;
                }
            }
        }
        if (appliedNodes.length === 0) {
            return;
        }
        if (mediaStart || mediaEnd) {
            const start: Node = mediaStart ? mediaStart.parentElement : staticRange.startContainer;
            const end: Node = mediaEnd ? mediaEnd.parentElement : staticRange.endContainer;
            const startOffset: number = mediaStart ? 0 : staticRange.startOffset;
            const endOffset: number = staticRange.endOffset;
            this.parent.nodeSelection.setSelectionText(this.parent.currentDocument, start, end, startOffset, endOffset);
        } else {
            if (appliedNodes.length === 1) {
                this.parent.nodeSelection.setSelectionContents(this.parent.currentDocument, appliedNodes[0]);
            } else {
                this.parent.nodeSelection.setSelectionText(
                    this.parent.currentDocument,
                    appliedNodes[0], // Start Node
                    appliedNodes[appliedNodes.length - 1],  // end Node
                    0, // start offset
                    appliedNodes[appliedNodes.length - 1].textContent.length // end offset
                );
            }
        }
    }

    private applyLinkToBlockNode(blockNode: HTMLElement, e: IHtmlItem, appliedNode: Text[]): void {
        const domMethods: DOMMethods = new DOMMethods(this.parent.editableElement as HTMLDivElement);
        const textNodes: Text[] = domMethods.getTextNodes(blockNode);
        const inlineNodes: NodeListOf<HTMLElement> = blockNode.querySelectorAll('*');
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        // eslint-disable-next-line prefer-const
        let complexFormatNodes: Text[] = [];
        const hasOnlyTextNode: boolean = inlineNodes.length === 0;
        for (let i: number = 0; i < textNodes.length; i++) {
            let splitNode: HTMLElement;
            const currentTextNode: Text = textNodes[i as number];
            const fontColorNode: HTMLElement = new IsFormatted().getFormattedNode(currentTextNode, 'fontcolor', blockNode) as HTMLElement;
            if (hasOnlyTextNode) { // Only text node case.
                splitNode = this.getSplitNode(currentTextNode, range) as HTMLElement;
                appliedNode.push(InsertMethods.Wrap(splitNode, this.createAchorNode(e)) as unknown as Text);
            } else {
                if (fontColorNode) { // Font color foramt case.
                    if (complexFormatNodes.length > 0) {
                        this.replaceElementsWithAnchor(complexFormatNodes, this.createAchorNode(e) as HTMLAnchorElement, e.enterAction);
                    }
                    splitNode = this.getSplitNode(fontColorNode, range) as HTMLElement;
                    if (range.intersectsNode(fontColorNode)) {
                        InsertMethods.Wrap(fontColorNode.firstChild as HTMLElement, this.createAchorNode(e));
                        appliedNode.push(currentTextNode);
                    }
                } else { // Partial selection of Inline nodes.
                    const partialStart: boolean = range.startContainer.nodeName === '#text' &&
                        range.startContainer === currentTextNode && range.startOffset !== 0;
                    const partialEnd: boolean = range.endContainer.nodeName === '#text' &&
                        range.endContainer === currentTextNode && range.endOffset !== range.startContainer.textContent.length;
                    if (i > 0) {
                        const currentParent: Node = e.enterAction === 'BR' ? this.parent.editableElement : domMethods.getParentBlockNode(currentTextNode);
                        if (currentParent !== blockNode) {
                            this.replaceElementsWithAnchor(complexFormatNodes, this.createAchorNode(e) as HTMLAnchorElement, e.enterAction);
                        }
                    }
                    if (partialStart || partialEnd) {
                        const topMostFormatNode: Node = domMethods.getTopMostNode(currentTextNode);
                        splitNode = this.getSplitNode(topMostFormatNode, range) as HTMLElement;
                        appliedNode.push(currentTextNode);
                        complexFormatNodes.push(currentTextNode);
                    } else {
                        appliedNode.push(currentTextNode);
                        complexFormatNodes.push(currentTextNode);
                    }
                    if (i === textNodes.length - 1) {
                        this.replaceElementsWithAnchor(complexFormatNodes, this.createAchorNode(e) as HTMLAnchorElement, e.enterAction);
                    }
                }
            }
        }
    }

    private unwrapLink(elem: HTMLElement): void {
        const links: NodeListOf<HTMLAnchorElement> = elem.querySelectorAll('a');
        if (links.length === 0) {
            return;
        }
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        const startContainer: Node = range.startContainer;
        const endContainer: Node = range.endContainer;
        let startOffset: number = range.startOffset;
        const endOffset: number = range.endOffset;
        this.parent.nodeSelection.save(range, this.parent.currentDocument);
        const selection: Selection = this.parent.nodeSelection.get(this.parent.currentDocument);
        for (let i: number = 0; i < links.length; i++) {
            if (range.intersectsNode(links[i as number])) {
                if (selection.containsNode(links[i as number] as Node, false)) {
                    InsertMethods.unwrap(links[i as number]);
                } else {
                    const linkText: string = links[i as number] && links[i as number].textContent;
                    if (linkText && range.startContainer.textContent &&
                        linkText.indexOf(range.startContainer.textContent) !== -1) {
                        startOffset = 0;
                    }
                    const splitNode: Node = this.getSplitNode(links[i as number] as Node, range);
                    InsertMethods.unwrap(splitNode);
                }
            }
        }
        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
    }

    private replaceElementsWithAnchor(complexFormatNodes: Node[], anchor: HTMLAnchorElement, enterAction: string): void {
        const domMethods: DOMMethods = new DOMMethods(this.parent.editableElement as HTMLDivElement);
        const processedNodes: Node[] = [];
        for (let j: number = 0; j < complexFormatNodes.length; j++) {
            const currentText: Text = complexFormatNodes[j as number] as Text;
            processedNodes.push(domMethods.getTopMostNode(currentText));
        }
        complexFormatNodes.length = 0;
        const firstNode: Node = processedNodes[0];
        const cloneNode: HTMLAnchorElement = anchor.cloneNode(true) as HTMLAnchorElement;
        firstNode.parentElement.insertBefore(anchor, firstNode);
        let previousBRAnchor: HTMLAnchorElement;
        for (let i: number = 0; i < processedNodes.length; i++) {
            const node: Node = processedNodes[i as number];
            if (enterAction === 'BR') {
                if (i === 0) {
                    anchor.appendChild(node);
                } else {
                    if (isNOU(previousBRAnchor)) {
                        const anchorElem: HTMLAnchorElement = cloneNode.cloneNode(true) as HTMLAnchorElement;
                        node.parentElement.insertBefore(anchorElem, node);
                        anchorElem.appendChild(node);
                        previousBRAnchor = anchorElem;
                    } else {
                        const isNextSiblingBlockOrBR: boolean = (node.nextSibling && node.nextSibling.nodeName === 'BR') || domMethods.isBlockNode(node.nextSibling as Element);
                        const isPrevSiblingBlockOrBR: boolean = (node.previousSibling && node.previousSibling.nodeName === 'BR') || domMethods.isBlockNode(node.previousSibling as Element);
                        const isLastElement: boolean = this.parent.editableElement.lastChild === node;
                        const isBlockParent: boolean = domMethods.isBlockNode(node.parentElement);
                        if (isNextSiblingBlockOrBR && isPrevSiblingBlockOrBR) {
                            const anchorElem: HTMLAnchorElement = cloneNode.cloneNode(true) as HTMLAnchorElement;
                            node.parentElement.insertBefore(anchorElem, node);
                            anchorElem.appendChild(node);
                            previousBRAnchor = anchorElem;
                        } else if (isLastElement) {
                            const anchorElem: HTMLAnchorElement = cloneNode.cloneNode(true) as HTMLAnchorElement;
                            node.parentElement.insertBefore(anchorElem, node);
                            anchorElem.appendChild(node);
                        } else if (isBlockParent) {
                            const anchorElem: HTMLAnchorElement = cloneNode.cloneNode(true) as HTMLAnchorElement;
                            node.parentElement.insertBefore(anchorElem, node);
                            anchorElem.appendChild(node);
                            previousBRAnchor = anchorElem;
                        } else {
                            previousBRAnchor.appendChild(node);
                        }
                    }
                }
            } else {
                anchor.appendChild(node);
            }
        }
    }

    private getSplitNode(node: Node, range: Range): Node {
        const nodeCutter: NodeCutter = new NodeCutter();
        let splitNode: Node;
        if (range.collapsed) {
            splitNode = nodeCutter.SplitNode(range, node as HTMLElement, true);
        } else {
            splitNode = nodeCutter.GetSpliceNode(range, node as HTMLElement) as HTMLElement;
        }
        return splitNode;
    }
}
