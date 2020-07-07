import { EditorManager } from './../base/editor-manager';
import * as CONSTANT from './../base/constant';
import { NodeSelection } from './../../selection';
import { createElement, detach, prepend, append, attributes, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { IHtmlSubCommands } from './../base/interface';
import { IHtmlKeyboardEvent } from './../../editor-manager/base/interface';
import { DOMNode, markerClassName } from './dom-node';
import * as EVENTS from './../../common/constant';
import { setStyleAttribute } from '@syncfusion/ej2-base';
import { isIDevice, setEditFrameFocus } from '../../common/util';
import { isNullOrUndefined, isNullOrUndefined as isNOU, closest } from '@syncfusion/ej2-base';

/**
 * Lists internal component
 * @hidden
 * @deprecated
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
     * @deprecated
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
    private testList(elem: Element): boolean {
        let olListRegex: RegExp[] = [/^[\d]+[.]+$/,
        /^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})[.]$/gi,
        /^[a-zA-Z][.]+$/];
        let elementStart: string = !isNullOrUndefined(elem) ? (elem as HTMLElement).innerText.trim().split('.')[0] + '.' : null;
        if (!isNullOrUndefined(elementStart)) {
            for (let i: number = 0; i < olListRegex.length; i++) {
                if (olListRegex[i].test(elementStart)) {
                    return true;
                }
            }
        }
        return false;
    }
    private testCurrentList(range: Range): boolean {
        let olListStartRegex: RegExp[] = [/^[1]+[.]+$/, /^[i]+[.]+$/, /^[a]+[.]+$/];
        if (!isNullOrUndefined(range.startContainer.textContent.slice(0, range.startOffset))) {
            for (let i: number = 0; i < olListStartRegex.length; i++) {
                if (olListStartRegex[i].test(range.startContainer.textContent.slice(0, range.startOffset))) {
                    return true;
                }
            }
        }
        return false;
    }
    private spaceList(e: IHtmlKeyboardEvent): void {
        let range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
        let startNode: Element = this.parent.domNode.getSelectedNode(range.startContainer as Element, range.startOffset);
        let endNode: Element = this.parent.domNode.getSelectedNode(range.endContainer as Element, range.endOffset);
        let preElement: Element = startNode.previousElementSibling;
        let nextElement: Element = startNode.nextElementSibling;
        let preElemULStart: string =  !isNullOrUndefined(preElement) ?
        (preElement as HTMLElement).innerText.trim().substring(0, 1) : null;
        let nextElemULStart: string =  !isNullOrUndefined(nextElement) ?
        (nextElement as HTMLElement).innerText.trim().substring(0, 1) : null;
        let startElementOLTest: boolean = this.testCurrentList(range);
        let preElementOLTest : boolean = this.testList(preElement);
        let nextElementOLTest : boolean = this.testList(nextElement);
        if (!preElementOLTest && !nextElementOLTest && preElemULStart !== '*' && nextElemULStart !== '*') {
            if (startElementOLTest) {
                range.startContainer.textContent = range.startContainer.textContent.slice(
                    range.startOffset, range.startContainer.textContent.length);
                this.applyListsHandler({ subCommand: 'OL', callBack: e.callBack });
                e.event.preventDefault();
            } else if (range.startContainer.textContent.slice(0, range.startOffset) === '*') {
                range.startContainer.textContent = range.startContainer.textContent.slice(
                    range.startOffset, range.startContainer.textContent.length);
                this.applyListsHandler({ subCommand: 'UL', callBack: e.callBack });
                e.event.preventDefault();
            }
        }
    }
    private enterList(e: IHtmlKeyboardEvent): void {
        let range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        let startNode: Element = this.parent.domNode.getSelectedNode(range.startContainer as Element, range.startOffset);
        let endNode: Element = this.parent.domNode.getSelectedNode(range.endContainer as Element, range.endOffset);
        if (startNode === endNode && startNode.tagName === 'LI' && startNode.textContent.trim() === '' &&
        startNode.textContent.charCodeAt(0) === 65279) {
            startNode.textContent = '';
        }
    }
    private backspaceList(e: IHtmlKeyboardEvent): void {
        let range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        let startNode: Element = this.parent.domNode.getSelectedNode(range.startContainer as Element, range.startOffset);
        let endNode: Element = this.parent.domNode.getSelectedNode(range.endContainer as Element, range.endOffset);
        startNode = startNode.nodeName === 'BR' ? startNode.parentElement : startNode;
        endNode = endNode.nodeName === 'BR' ? endNode.parentElement : endNode;
        if (startNode === endNode && !isNullOrUndefined(closest(startNode, 'li')) &&
        startNode.textContent.trim() === '' && startNode.textContent.charCodeAt(0) === 65279) {
            startNode.textContent = '';
        }
        if (startNode === endNode && startNode.textContent === '') {
            if (startNode.closest('ul') || startNode.closest('ol')) {
                let parentList: HTMLElement = !isNOU(startNode.closest('ul')) ? startNode.closest('ul') : startNode.closest('ol');
                if (parentList.firstElementChild === startNode && (parentList.children[1].tagName === 'OL' ||
                parentList.children[1].tagName === 'UL')) {
                    if (parentList.tagName === parentList.children[1].tagName) {
                        while (parentList.children[1].lastChild) {
                            this.parent.domNode.insertAfter(parentList.children[1].lastChild as Element, parentList.children[1]);
                        }
                        detach(parentList.children[1]);
                    } else {
                        parentList.parentElement.insertBefore(parentList.children[1], parentList);
                    }
                }
            }
        } else if (startNode.firstChild.nodeName === 'BR' && (startNode.childNodes[1].nodeName === 'UL' ||
        startNode.childNodes[1].nodeName === 'OL')) {
            let parentList: HTMLElement = !isNOU(startNode.closest('ul')) ? startNode.closest('ul') : startNode.closest('ol');
            if (parentList.tagName === startNode.childNodes[1].nodeName) {
                while (startNode.childNodes[1].lastChild) {
                    this.parent.domNode.insertAfter(startNode.children[1].lastChild as Element, startNode);
                }
                detach(startNode.childNodes[1]);
            } else {
                parentList.parentElement.insertBefore(startNode.children[1], parentList);
            }
        }
    }
    private keyDownHandler(e: IHtmlKeyboardEvent): void {
        if (e.event.which === 13) {
            this.enterList(e);
        }
        if (e.event.which === 32) {
            this.spaceList(e);
        }
        if (e.event.which === 8) {
            this.backspaceList(e);
        }
        if (e.event.which === 9) {
            let range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
            if (!(e.event.action && e.event.action === 'indent')) {
                this.saveSelection = this.parent.nodeSelection.save(range, this.parent.currentDocument);
            }
            let blockNodes: Element[];
            let startOffset: number = range.startOffset;
            let endOffset: number = range.endOffset;
            let startNode: Element = this.parent.domNode.getSelectedNode(range.startContainer as Element, range.startOffset);
            let endNode: Element = this.parent.domNode.getSelectedNode(range.endContainer as Element, range.endOffset);
            if ((startNode === endNode && (startNode.nodeName === 'BR' || startNode.nodeName === '#text') &&
                CONSTANT.IGNORE_BLOCK_TAGS.indexOf((startNode.parentNode as Element).tagName.toLocaleLowerCase()) >= 0)) {
                return;
            } else {
                if (!(e.event.action && e.event.action === 'indent')) {
                    this.domNode.setMarker(this.saveSelection);
                }
                blockNodes = <Element[]>this.domNode.blockNodes();
            }
            let nodes: Element[] = [];
            let isNested: boolean = true;
            for (let i: number = 0; i < blockNodes.length; i++) {
                if ((blockNodes[i].parentNode as Element).tagName === 'LI') {
                    nodes.push(blockNodes[i].parentNode as Element);
                } else if (blockNodes[i].tagName === 'LI' && (blockNodes[i].childNodes[0] as Element).tagName !== 'P' &&
                    ((blockNodes[i].childNodes[0] as Element).tagName !== 'OL' &&
                        (blockNodes[i].childNodes[0] as Element).tagName !== 'UL')) {
                    nodes.push(blockNodes[i]);
                }
            }
            if (nodes.length > 1 || nodes.length && ((startOffset === 0 && endOffset === 0) || e.ignoreDefault)) {
                e.event.preventDefault();
                e.event.stopPropagation();
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
            } else {
                if (!(e.event.action && e.event.action === 'indent')) {
                    if (e.event && e.event.shiftKey && e.event.key === 'Tab') {
                        e.event.action = 'tab';
                    }
                    this.saveSelection = this.domNode.saveMarker(this.saveSelection, e.event.action);
                    this.saveSelection.restore();
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

    private noPreviousElement(elements: Node): void {
        let firstNode: Element;
        let firstNodeOL: Element;
        let siblingListOL: Element[] = <NodeListOf<Element> & Element[]>(elements as Element).querySelectorAll('ol, ul');
        let siblingListLI: NodeListOf<HTMLLIElement> = (elements as Element)
            .querySelectorAll('li') as NodeListOf<HTMLLIElement>;
        let siblingListLIFirst: Node = this.domNode.contents(siblingListLI[0] as Element)[0];
        if (siblingListLI.length > 0 && (siblingListLIFirst.nodeName === 'OL' || siblingListLIFirst.nodeName === 'UL')) {
            firstNode = siblingListLI[0];
        } else {
            firstNodeOL = siblingListOL[0];
        }
        if (firstNode) {
            for (let h: Node = this.domNode.contents(elements as Element)[0]; h && !this.domNode.isList(h as Element); null) {
                let nextSibling: Element = h.nextSibling as Element;
                prepend([h as Element], firstNode);
                setStyleAttribute(elements as HTMLElement, { 'list-style-type': 'none' });
                setStyleAttribute(firstNode as HTMLElement, { 'list-style-type': '' });
                h = nextSibling;
            }
        } else if (firstNodeOL) {
            let nestedElement: Element = createElement('li');
            prepend([nestedElement], firstNodeOL);
            for (let h: Node = this.domNode.contents(elements as Element)[0]; h && !this.domNode.isList(h as Element); null) {
                let nextSibling: Element = h.nextSibling as Element;
                nestedElement.appendChild(h as Element);
                h = nextSibling;
            }
            prepend([firstNodeOL], (elements.parentNode as Element));
            detach(elements);
            let nestedElementLI: Element = createElement('li', { styles: 'list-style-type: none;' });
            prepend([nestedElementLI], (firstNodeOL.parentNode as Element));
            append([firstNodeOL], nestedElementLI);
        } else {
            let nestedElementLI: Element = createElement('li', { styles: 'list-style-type: none;' });
            prepend([nestedElementLI], (elements.parentNode as Element));
            let nestedElement: Element = createElement((elements.parentNode as Element).tagName);
            prepend([nestedElement], nestedElementLI);
            append([elements as Element], nestedElement);
        }
    }
    private nestedList(elements: Node[]): boolean {
        let isNested: boolean = false;
        for (let i: number = 0; i < elements.length; i++) {
            let prevSibling: Element = this.domNode.getPreviousNode(elements[i] as Element);
            if (prevSibling) {
                isNested = true;
                let firstNode: Element;
                let firstNodeLI: Element;
                let siblingListOL: Element[] = <NodeListOf<Element> & Element[]>(elements[i] as Element).querySelectorAll('ol, ul');
                let siblingListLI: NodeListOf<HTMLLIElement> = (elements[i] as Element)
                    .querySelectorAll('li') as NodeListOf<HTMLLIElement>;
                let siblingListLIFirst: Node = this.domNode.contents(siblingListLI[0] as Element)[0];
                if (siblingListLI.length > 0 && (siblingListLIFirst.nodeName === 'OL' || siblingListLIFirst.nodeName === 'UL')) {
                    firstNodeLI = siblingListLI[0];
                } else {
                    firstNode = siblingListOL[0];
                }
                if (firstNode) {
                    let nestedElement: Element = createElement('li');
                    prepend([nestedElement], firstNode);
                    for (let h: Node = this.domNode.contents(elements[i] as Element)[0];
                        h && !this.domNode.isList(h as Element); null) {
                        let nextSibling: Element = h.nextSibling as Element;
                        nestedElement.appendChild(h as Element);
                        h = nextSibling;
                    }
                    append([firstNode], prevSibling);
                    detach(elements[i]);
                } else if (firstNodeLI) {
                    if (prevSibling.tagName === 'LI') {
                        for (let h: Node = this.domNode.contents(elements[i] as Element)[0];
                            h && !this.domNode.isList(h as Element); null) {
                            let nextSibling: Element = h.nextSibling as Element;
                            prepend([h as Element], firstNodeLI);
                            setStyleAttribute(elements[i] as HTMLElement, { 'list-style-type': 'none' });
                            setStyleAttribute(firstNodeLI as HTMLElement, { 'list-style-type': '' });
                            h = nextSibling;
                        }
                        append([firstNodeLI.parentNode as Element], prevSibling);
                        detach(elements[i]);
                    }
                } else {
                    if (prevSibling.tagName === 'LI') {
                        let nestedElement: Element = createElement((elements[i].parentNode as Element).tagName);
                        append([nestedElement], prevSibling as Element);
                        append([elements[i] as Element], nestedElement);
                    }
                }
            } else {
                let element: Node = elements[i];
                isNested = true;
                this.noPreviousElement(element);
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
            if ((listsNodes[i] as Element).tagName === 'TABLE') {
                listsNodes.splice(i, 1);
            }
            if ((listsNodes[i] as Element).tagName !== 'LI' && 'LI' === (listsNodes[i].parentNode as Element).tagName) {
                listsNodes[i] = listsNodes[i].parentNode;
            }
        }
        this.applyLists(listsNodes as HTMLElement[], this.currentAction, e.selector);
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

    private applyLists(elements: HTMLElement[], type: string, selector?: string): void {
        let isReverse: boolean = true;
        if (this.isRevert(elements, type)) {
            this.revertList(elements);
            this.removeEmptyListElements();
        } else {
            this.checkLists(elements, type);
            for (let i: number = 0; i < elements.length; i++) {
                if ('LI' !== elements[i].tagName) {
                    isReverse = false;
                    let elemAtt: string = elements[i].tagName === 'IMG' ? '' : this.domNode.attributes(elements[i]);
                    let openTag: string = '<' + type + '>';
                    let closeTag: string = '</' + type + '>';
                    let newTag: string = 'li' + elemAtt;
                    let replaceHTML: string = (elements[i].tagName.toLowerCase() === CONSTANT.DEFAULT_TAG ? elements[i].innerHTML :
                        elements[i].outerHTML);
                    let innerHTML: string = this.domNode.createTagString(newTag, null, replaceHTML);
                    let collectionString: string = openTag + innerHTML + closeTag;
                    this.domNode.replaceWith(elements[i], collectionString);
                }
            }
        }
        this.cleanNode();
        (this.parent.editableElement as HTMLElement).focus();
        if (isIDevice()) { setEditFrameFocus(this.parent.editableElement, selector); }
        this.saveSelection = this.domNode.saveMarker(this.saveSelection);
        this.saveSelection.restore();
    }
    private removeEmptyListElements(): void {
        let listElem: NodeListOf<Element> = this.parent.editableElement.querySelectorAll('ol, ul');
        for (let i: number = 0; i < listElem.length; i++) {
            if (listElem[i].textContent.trim() === '') {
                detach(listElem[i]);
            }
         }
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
            if (this.domNode.isList(node.previousElementSibling  as Element) &&
                this.domNode.openTagString(node) === this.domNode.openTagString(node.previousElementSibling  as Element)) {
                let contentNodes: Node[] = this.domNode.contents(node);
                for (let f: number = 0; f < contentNodes.length; f++) {
                    node.previousElementSibling .appendChild(contentNodes[f]);
                }
                node.parentNode.removeChild(node);
            }
        }
    }
    private findUnSelected(temp: HTMLElement[], elements: HTMLElement[]): void {
        temp = temp.slice().reverse();
        if (temp.length > 0) {
            let rightIndent: Element[] = [];
            let indentElements: Element[] = [];
            let lastElement: Element = elements[elements.length - 1];
            let lastElementChild: Element[] = [];
            let childElements: Element[] = [];
            lastElementChild = <NodeListOf<Element> & Element[]>(lastElement.childNodes);
            for (let z: number = 0; z < lastElementChild.length; z++) {
                if (lastElementChild[z].tagName === 'OL' || lastElementChild[z].tagName === 'UL') {
                    let childLI: NodeListOf<HTMLLIElement> = (lastElementChild[z] as Element)
                        .querySelectorAll('li') as NodeListOf<HTMLLIElement>;
                    if (childLI.length > 0) {
                        for (let y: number = 0; y < childLI.length; y++) {
                            childElements.push(childLI[y]);
                        }
                    }
                }
            }
            for (let i: number = 0; i < childElements.length; i++) {
                let count: number = 0;
                for (let j: number = 0; j < temp.length; j++) {
                    if (!childElements[i].contains((temp[j]))) {
                        count = count + 1;
                    }
                }
                if (count === temp.length) {
                    indentElements.push(childElements[i]);
                }
            }
            if (indentElements.length > 0) {
                for (let x: number = 0; x < indentElements.length; x++) {
                    if (this.domNode.contents(indentElements[x])[0].nodeName !== 'OL' &&
                        this.domNode.contents(indentElements[x])[0].nodeName !== 'UL') {
                        rightIndent.push(indentElements[x]);
                    }
                }
            }
            if (rightIndent.length > 0) {
                this.nestedList(rightIndent);
            }
        }
    }

    private revertList(elements: HTMLElement[]): void {
        let temp: Element[] = [];
        for (let i: number = elements.length - 1; i >= 0; i--) {
            for (let j: number = i - 1; j >= 0; j--) {
                if (elements[j].contains((elements[i])) || elements[j] === elements[i]) {
                    temp.push(elements[i]);
                    elements.splice(i, 1);
                    break;
                }
            }
        }
        this.findUnSelected(temp as HTMLElement[], elements as HTMLElement[]);
        let viewNode: Element[] = [];
        for (let i: number = 0; i < elements.length; i++) {
            let element: Element = elements[i];
            if (this.domNode.contents(element)[0].nodeType === 3 && this.domNode.contents(element)[0].textContent.trim().length === 0) {
                detach(this.domNode.contents(element)[0]);
            }

            let parentNode: Element = elements[i].parentNode as Element;
            let className: string = element.getAttribute('class');
            if (temp.length === 0) {
                let siblingList: Element[] = <NodeListOf<Element> & Element[]>(elements[i] as Element).querySelectorAll('ul, ol');
                let firstNode: Element = siblingList[0];
                if (firstNode) {
                    let child: NodeListOf<HTMLLIElement> = firstNode
                        .querySelectorAll('li') as NodeListOf<HTMLLIElement>;
                    if (child) {
                        let nestedElement: Element = createElement(firstNode.tagName);
                        append([nestedElement], firstNode.parentNode as Element);
                        let nestedElementLI: Element = createElement('li', { styles: 'list-style-type: none;' });
                        append([nestedElementLI], nestedElement);
                        append([firstNode], nestedElementLI);
                    }
                }
            }
            if (element.parentNode.insertBefore(this.closeTag(parentNode.tagName) as Element, element),
                'LI' === (parentNode.parentNode as Element).tagName) {
                element.parentNode.insertBefore(this.closeTag('LI') as Element, element);
            } else {
                let classAttr: string = '';
                if (className) {
                    classAttr += ' class="' + className + '"';
                }
                if (CONSTANT.DEFAULT_TAG && 0 === element.querySelectorAll(CONSTANT.BLOCK_TAGS.join(', ')).length) {
                    let wrapperclass: string = isNullOrUndefined(className) ? ' class="e-rte-wrap-inner"' :
                    ' class="' + className + ' e-rte-wrap-inner"';
                    let wrapper: string = '<' + CONSTANT.DEFAULT_TAG + wrapperclass +
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
        let emptyUl: Element[] = <NodeListOf<Element> & Element[]>this.parent.editableElement.querySelectorAll('ul:empty, ol:empty');
        for (let i: number = 0; i < emptyUl.length; i++) {
            detach(emptyUl[i]);
        }
        let emptyLi: Element[] = <NodeListOf<Element> & Element[]>this.parent.editableElement.querySelectorAll('li:empty');
        for (let i: number = 0; i < emptyLi.length; i++) {
            detach(emptyLi[i]);
        }
    }

    private openTag(type: string): Element {
        return this.domNode.parseHTMLFragment('<span class="e-rte-list-open-' + type.toLowerCase() + '"></span>');
    }

    private closeTag(type: string): Element {
        return this.domNode.parseHTMLFragment('<span class="e-rte-list-close-' + type.toLowerCase() + '"></span>');
    }

}