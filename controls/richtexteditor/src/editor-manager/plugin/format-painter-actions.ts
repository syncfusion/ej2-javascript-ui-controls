import { closest, createElement, detach, isNullOrUndefined as isNOU, removeClass } from '@syncfusion/ej2-base';
import { IFormatPainterActionArgs, IFormatPainterSettings } from '../base';
import { NodeSelection } from '../../selection/selection';
import * as EVENTS from '../../common/constant';
import { SelectionCommands } from '../plugin';
import { EditorManager } from '../base';
import { IFormatPainterContext } from '../base/enum';

export class FormatPainterActions{
    private parent: EditorManager;
    private copyCollection: FormatPainterCollection[];
    private deniedFormatsCollection: DeniedFormatsCollection[];
    private newElem: HTMLElement;
    private newElemLastChild: HTMLElement;
    private settings: IFormatPainterSettings;

    public constructor (parent?: EditorManager, options?: IFormatPainterSettings) {
        this.parent = parent;
        this.settings = options;
        this.addEventListener();
        this.setDeniedFormats();
    }

    private addEventListener(): void {
        this.parent.observer.on(EVENTS.FORMAT_PAINTER_ACTIONS, this.actionHandler, this);
    }

    private actionHandler(args: IFormatPainterActionArgs): void {
        if (!isNOU(args) && !isNOU(args.item) &&  !isNOU(args.item.formatPainterAction)) {
            switch (args.item.formatPainterAction) {
            case 'format-copy':
                this.copyAction();
                break;
            case 'format-paste':
                this.pasteAction();
                break;
            case 'escape':
                this.escapeAction();
                break;
            }
        }
    }

    private generateElement(): void {
        const copyCollection: FormatPainterCollection[] = this.copyCollection.slice(); // To clone without reversing the collcection array
        copyCollection.reverse();
        const length: number = copyCollection.length;
        const elemCollection: HTMLElement = createElement('div', {className: 'e-format-paste-wrapper'});
        let lastAppendChild: HTMLElement;
        for (let i: number = 0 ; i < length; i++){
            const { attrs, className, styles, tagName} = copyCollection[i as number];
            const elem: HTMLElement = createElement(tagName);
            if (className !== ''){
                elem.className = className;
            }
            for (let i: number = 0; i < attrs.length; i++){
                const property: string = attrs[i as number].name;
                const value: string = attrs[i as number].value;
                elem.setAttribute(property, value);
            }
            for (let i: number = 0; i < styles.length; i++){
                const property: string = styles[i as number].property;
                const value: string = styles[i as number].value;
                const priority: string = styles[i as number].priority;
                elem.style.setProperty(property, value, priority);
            }
            if (elemCollection.childElementCount === 0) {
                elemCollection.append(elem);
                lastAppendChild = elem as HTMLElement;
            } else{
                lastAppendChild.append(elem);
                lastAppendChild = elem as HTMLElement;
            }
        }
        const elemChild: HTMLElement = this.removeDeniedFormats(elemCollection as HTMLElement);
        let currentElem: Node = elemChild;
        while (currentElem){
            if (currentElem.firstChild === null) {
                lastAppendChild =  currentElem as HTMLElement;
                currentElem = undefined;
            } else {
                currentElem = currentElem.firstChild;
            }
        }
        this.newElem = elemChild;
        this.newElemLastChild = lastAppendChild;
    }

    private pasteAction() : void  {
        if (isNOU(this.copyCollection) || this.copyCollection.length === 0){
            this.paintPlainTextFormat();
            return;
        }
        this.insertFormatNode(this.newElem, this.newElemLastChild);
        this.parent.undoRedoManager.saveData();
    }

    private removeDeniedFormats(parentElement: HTMLElement): HTMLElement {
        if (!isNOU(this.deniedFormatsCollection) && this.deniedFormatsCollection.length > 0){
            const deniedPropArray: DeniedFormatsCollection[] = this.deniedFormatsCollection;
            const length: number = deniedPropArray.length;
            for (let i: number = 0; i < length; i++) {
                const tag: string = deniedPropArray[i as number].tag;
                if (deniedPropArray[i as number].tag) {
                    const elementsList: NodeList = parentElement.querySelectorAll(tag);
                    for ( let j: number = 0; j < elementsList.length; j++){
                        if (deniedPropArray[i as number].classes.length > 0){
                            const classes: string[] = deniedPropArray[i as number].classes;
                            const classLength: number = classes.length;
                            for (let k: number = 0; k < classLength; k++){
                                if ((elementsList[j as number] as HTMLElement).classList.contains(classes[k as number])){
                                    removeClass([elementsList[j as number] as HTMLElement], classes[k as number]);
                                }
                            }
                            if ((elementsList[j as number] as HTMLElement).classList.length === 0){
                                (elementsList[j as number] as HTMLElement).removeAttribute('class');
                            }
                        }
                        if (deniedPropArray[i as number].styles.length > 0){
                            const styles: string[] = deniedPropArray[i as number].styles;
                            const styleLength: number = styles.length;
                            for (let k: number = 0; k < styleLength; k++){
                                (elementsList[j as number] as HTMLElement).style.removeProperty(styles[k as number]);
                            }
                            if ((elementsList[j as number] as HTMLElement).style.length === 0){
                                (elementsList[j as number] as HTMLElement).removeAttribute('style');
                            }
                        }
                        if (deniedPropArray[i as number].attributes.length > 0){
                            const attributes: string[] = deniedPropArray[i as number].attributes;
                            const attributeLength: number = attributes.length;
                            for (let k: number = 0; k < attributeLength; k++){
                                (elementsList[j as number] as HTMLElement).removeAttribute(attributes[k as number]);
                            }
                        }
                    }
                }
            }
        }
        return parentElement.firstElementChild as HTMLElement;
    }

    private copyAction(): void {
        const copyCollection: FormatPainterCollection[] = [];
        const range: Range = this.parent.nodeSelection.getRange(document);
        let parentElem: HTMLElement = range.startContainer.parentElement as HTMLElement;
        let currentContext: string | null = this.findCurrentContext(parentElem);
        const allowedRulesArray: string[] = this.settings.allowedFormats.split(';');
        for (let i: number = 0; i < allowedRulesArray.length; i++) {
            allowedRulesArray[i as number] = allowedRulesArray[i as number].trim();
        }
        const [rangeParentElem, context] = this.getRangeParentElem(currentContext, range);
        if (currentContext === null) {
            currentContext = context;
        }
        if (!isNOU(currentContext) && this.settings.allowedContext.indexOf(currentContext as IFormatPainterContext) > -1){
            if (range.startContainer.nodeName === '#text') {
                parentElem = range.startContainer.parentElement;
            }
            const lastElement: HTMLElement = parentElem;
            do {
                if (allowedRulesArray.indexOf(parentElem.nodeName.toLowerCase()) > -1){
                    const allAttributes: NamedNodeMap = parentElem.attributes;
                    const attribute: Attr[] = [];
                    for (let i: number = 0; i < allAttributes.length; i++){
                        if (allAttributes[i as number].name !== 'class' && allAttributes[i as number].name !== 'style') {
                            attribute.push(allAttributes[i as number]);
                        }
                    }
                    const classes: string =  parentElem.className;
                    const allStyles: CSSStyleDeclaration =  parentElem.style;
                    const styleProp: CSSPropCollection[] = [];
                    for (let i: number = 0; i < allStyles.length; i++) {
                        const property: string = allStyles[i as number];
                        const value: string = allStyles.getPropertyValue(property);
                        const priority: string = allStyles.getPropertyPriority(property);
                        styleProp.push({ property: property, value: value, priority: priority});
                    }
                    copyCollection.push({
                        attrs: attribute, className: classes , styles: styleProp, tagName: parentElem.nodeName
                    });
                }if (rangeParentElem === parentElem) {
                    parentElem = undefined;
                } else if (!isNOU(parentElem.parentElement)){
                    parentElem = parentElem.parentElement;
                }
                if (lastElement === parentElem) {
                    break;
                }
            } while (!isNOU(parentElem) || parentElem === this.parent.editableElement);
            this.copyCollection = copyCollection;
        }
        this.generateElement();
    }

    private getRangeParentElem(currentContext: string, range: Range): [Element, string] {
        let startContainer: Node = range.startContainer;
        let rangeParentELem: Element;
        if (startContainer.nodeType === 3){
            startContainer = startContainer.parentElement;
        }
        switch (currentContext){
        case 'Table':
            rangeParentELem = closest(startContainer, 'td');
            if (isNOU(rangeParentELem)) {
                rangeParentELem = closest(startContainer, 'th');
            }
            break;
        case 'List':
            rangeParentELem = closest(startContainer, 'li');
            break;
        case 'Text':
            rangeParentELem = closest(startContainer, 'p');
            break;
        }
        if (isNOU(rangeParentELem)) {
            const nearBlockParentName: string | null = this.getNearestBlockParentElement(range);
            if (!isNOU(nearBlockParentName) && nearBlockParentName !== 'UL' &&
            nearBlockParentName !== 'OL' && nearBlockParentName !==  'LI') {
                rangeParentELem = closest(startContainer, nearBlockParentName);
                currentContext = 'Text';
            }
        }
        if (currentContext === 'List') {
            rangeParentELem = rangeParentELem.parentElement;
        }
        return [rangeParentELem, currentContext];
    }

    private getNearestBlockParentElement(range: Range): string | null {
        let node: Node | null = range.commonAncestorContainer;
        if (node.nodeType === 3) {
            node = node.parentNode;
        }
        // iterate untill the content editable div
        while (node && (node as HTMLElement) !== this.parent.editableElement) {
            // If true return the block node name.
            if ( !isNOU(node) && this.isBlockElement(node)) {
                return node.nodeName;
            }
            // if false re assign node to parent node
            node = node.parentNode;
        }
        return null;
    }

    private isBlockElement(node: Node): boolean {
        const blockTags: string[] = ['P', 'DIV', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
            'ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'FIGCAPTION', 'FIGURE', 'FOOTER', 'HEADER',
            'HR', 'MAIN', 'NAV', 'SECTION', 'SUMMARY', 'PRE'];
        return blockTags.indexOf(node.nodeName) > -1;
    }

    private escapeAction(): void {
        this.copyCollection = [];
    }

    private paintPlainTextFormat(): void {
        const range: Range = this.parent.nodeSelection.getRange(this.parent.currentDocument);
        const domSelection: NodeSelection = this.parent.nodeSelection;
        const nodes: Node[] = range.collapsed ? domSelection.getSelectionNodeCollection(range) :
            domSelection.getSelectionNodeCollectionBr(range);
        let isInValid: boolean;
        if (nodes.length > 1){
            for (let i: number = 0; i < nodes.length; i++){
                isInValid = this.validateELementTag(nodes[i as number]);
            }
        } else{
            isInValid = this.validateELementTag(range.startContainer) && this.validateELementTag(range.endContainer);
        }
        if (!isInValid){
            this.parent.execCommand('Clear', 'ClearFormat', null, null);
        }
    }

    private validateELementTag(node: Node): boolean {
        const INVALID_TAGS: string[] = ['A', 'AUDIO', 'IMG', 'VIDEO', 'IFRAME'];
        if (node.nodeType === 3){
            node = node.parentElement;
        }
        return INVALID_TAGS.indexOf((node as HTMLElement).tagName) > -1 ;
    }

    private findCurrentContext (parentElem: HTMLElement) : string | null {
        if (closest(parentElem, 'td') || closest(parentElem, 'tr') || closest(parentElem, 'tbody')){
            return 'Table';
        } else if (closest(parentElem, 'li')) {
            return 'List';
        } else if (closest(parentElem, 'p')) {
            return 'Text';
        }
        return null;
    }

    private insertFormatNode(elem: HTMLElement, lastChild : HTMLElement): void {
        const endNode: Element = this.parent.editableElement;
        const docElement: Document = this.parent.currentDocument;
        const domSelection: NodeSelection = this.parent.nodeSelection;
        const clonedElem: HTMLElement = elem.cloneNode(true) as HTMLElement;
        let childElem: HTMLElement = clonedElem.firstChild as HTMLElement;
        let inlineElement: Node;
        while (childElem) {
            if (this.isBlockElement(childElem)) {
                childElem = childElem.firstChild as HTMLElement;
            } else {
                inlineElement = childElem.parentNode.removeChild(childElem);
                break;
            }
        }
        const formatValues: FormatPainterValue = {
            element: inlineElement as HTMLElement,
            lastChild: lastChild
        };
        SelectionCommands.applyFormat(docElement, null , endNode, 'P', 'formatPainter', null, formatValues);
        let isFullNodeSelected: boolean;
        const range: Range = this.parent.nodeSelection.getRange(docElement);
        const isCollapsed: boolean = range.collapsed;
        const nodes: Node[] = range.collapsed ? domSelection.getSelectionNodeCollection(range) :
            domSelection.getSelectionNodeCollectionBr(range);
        if (nodes.length === 1) {
            while (!this.isBlockElement(nodes[0])){
                nodes[0] = nodes[0].parentElement;
            }
            isFullNodeSelected = nodes[0].textContent.trim() === (range.commonAncestorContainer as Text).wholeText.trim();
        }
        if (this.isBlockElement(elem) && isCollapsed || nodes.length > 1 || isFullNodeSelected) {
            this.insertBlockNode(elem, range, docElement, endNode, nodes);
        }
    }

    private insertBlockNode(element: HTMLElement, range: Range, docElement: Document, endNode: Element, nodes: Node[]): void {
        const domSelection: NodeSelection = this.parent.nodeSelection;
        let listElement: HTMLElement; // To clone to multiple list elements
        let cloneListParentNode: Node;
        if (element.nodeName === 'UL' || element.nodeName === 'OL'){
            cloneListParentNode = element.cloneNode(true);
            listElement = cloneListParentNode.firstChild as HTMLElement;
        }
        const textNode: Node = range.startContainer; // To set cursor position
        for (let index: number = 0; index < nodes.length; index++) {
            const lastTextNode: Node = nodes[index as number];
            if (nodes[index as number].nodeType === 3) {
                nodes[index as number] = nodes[index as number].parentElement;
            }
            while (!this.isBlockElement(nodes[index as number])){
                nodes[index as number] = nodes[index as number].parentElement;
            }
            let cloneParentNode: Node;
            if (!isNOU(cloneListParentNode)) {
                cloneParentNode = listElement.cloneNode(true);
            } else {
                cloneParentNode = element.cloneNode(true);
            }
            // Appending all the child elements
            while (nodes[index as number].firstChild) {
                if (cloneParentNode.nodeName === 'LI') {
                    cloneParentNode.appendChild(nodes[index  as number].firstChild);
                } else {
                    // Except list nodes other block nodes replaced here
                    if (nodes[index as number].nodeType === 3) {
                        cloneParentNode.appendChild(nodes[index as number].firstChild);
                    } else {
                        (cloneParentNode as HTMLElement).innerHTML = (nodes[index as number] as HTMLElement).innerHTML;
                        (nodes[index as number] as HTMLElement).innerHTML = '';
                    }
                    nodes[index as number] = nodes[index as number].parentNode.replaceChild(cloneParentNode, nodes[index as number]);
                }
            }
            if (cloneParentNode.nodeName === 'LI') {
                // Appending the li nodes to the ol or ul node
                (cloneListParentNode as HTMLElement).append(cloneParentNode);
                if (index === 0) {
                    const nodeName: string = nodes[index as number].nodeName;
                    nodes[index as number] = nodes[index as number].parentNode.replaceChild(cloneListParentNode, nodes[index as number]);
                    const parent: HTMLElement = nodeName === 'LI' ? cloneListParentNode.parentElement
                        : cloneListParentNode as HTMLElement;
                    // Splicing and then inserting the node to previous element sibling of the Listparent.parent
                    this.parent.nodeCutter.SplitNode(range, parent, true);
                    if (!isNOU(parent.previousElementSibling)) {
                        parent.parentNode.insertBefore(cloneListParentNode, parent.nextElementSibling);
                    } else {
                        parent.parentElement.insertBefore(cloneListParentNode, parent);
                    }
                }
                detach(nodes[index  as number]);
            }
            /**Removing the inserted block node in list and appending to previous element sibling */
            if (cloneParentNode.nodeName !== 'LI' && (cloneParentNode.parentElement.nodeName === 'OL' ||
            cloneParentNode.parentElement.nodeName === 'UL')) {
                const parent: HTMLElement = cloneParentNode.parentElement;
                // Cutting single ul or ol to two ul or ol based on the range
                this.parent.nodeCutter.SplitNode(range, parent, true);
                if (!isNOU(parent.previousElementSibling)) {
                    parent.previousElementSibling.after(cloneParentNode);
                } else {
                    parent.parentElement.prepend(cloneParentNode);
                }
            }
            nodes[index as number] = lastTextNode;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        !isNOU(listElement) ? detach(listElement) : false;
        this.cleanEmptyLists();
        if (nodes.length > 1) {
            const startSelectNode: Node = nodes[0];
            const endSelectNode: Node = nodes[nodes.length - 1];
            domSelection.setSelectionText(docElement, startSelectNode, endSelectNode, 0, endSelectNode.textContent.length);
        } else {
            domSelection.setCursorPoint(docElement, textNode as Element, textNode.textContent.length);
        }
    }

    private cleanEmptyLists(): void {
        const listElem: NodeList = this.parent.editableElement.querySelectorAll('ol, ul');
        for (let i: number = 0; i < listElem.length; i++) {
            if (listElem[i as number].textContent.trim() === '') {
                detach(listElem[i as number]);
            }
        }
    }

    private setDeniedFormats(): void {
        const deniedFormatsCollection: DeniedFormatsCollection[] = [];
        if (isNOU(this.settings) || isNOU(this.settings.deniedFormats)) {
            return;
        }
        const deniedFormats: string[] = this.settings.deniedFormats.split(';');
        const length: number = deniedFormats.length;
        for (let i: number = 0; i < length; i++){
            const formatString: string = deniedFormats[i as number];
            if (formatString !== ''){
                formatString.trim();
                const collection: DeniedFormatsCollection = this.makeDeniedFormatsCollection(formatString);
                if (!isNOU(collection)) {
                    deniedFormatsCollection.push(collection);
                }
            }
        }
        this.deniedFormatsCollection = deniedFormatsCollection;
    }

    private makeDeniedFormatsCollection(value: string): DeniedFormatsCollection {
        const openParenIndex: number = value.indexOf('(');
        const closeParenIndex: number = value.indexOf(')');
        const openBracketIndex: number = value.indexOf('[');
        const closeBracketIndex: number = value.indexOf(']');
        const openBraceIndex: number = value.indexOf('{');
        const closeBraceIndex: number = value.indexOf('}');

        let classes: string[] = [];
        let attributes: string = '';
        let styles: string = '';
        let tagName: string = '';
        let classList: string[] = [];
        let attributesList: string[] = [];
        let stylesList: string[] = [];

        if (openParenIndex > -1 && closeParenIndex > -1) {
            classes = value.substring(openParenIndex + 1, closeParenIndex).split(' ');
            classList = classes[0].split(')')[0].split(',');
        }
        if (openBracketIndex > -1 && closeBracketIndex > -1) {
            attributes = value.substring(openBracketIndex + 1, closeBracketIndex);
            attributesList = attributes.split(',');
        }
        if (openBraceIndex > -1 && closeBraceIndex > -1) {
            styles = value.substring(openBraceIndex + 1, closeBraceIndex);
            stylesList = styles.split(',');
        }
        let openIndexArray: number[] = [openParenIndex, openBracketIndex, openBraceIndex];
        openIndexArray = openIndexArray.filter((index: number) => index > -1);
        const len: number = openIndexArray.length;
        let min: number;
        if (len === 1) {
            min = openIndexArray[0];
        } else if (len === 2) {
            min = Math.min(openIndexArray[0], openIndexArray[1]);
        } else if (len === 3) {
            min = Math.min(openIndexArray[0], openIndexArray[1], openIndexArray[2]);
        }
        tagName = value.substring(0, min);
        tagName.trim();
        return({
            tag: tagName, styles: stylesList, classes: classList,
            attributes:  attributesList
        });
    }
}

/**
 * @hidden
 */
export interface FormatPainterCollection {
    attrs: Attr[];
    className: string;
    styles: CSSPropCollection[];
    tagName: string
}
/**
 * @hidden
 *
 */
export interface FormatPainterValue {
    element: HTMLElement,
    lastChild: HTMLElement
}

/**
 * @hidden
 */
export interface DeniedFormatsCollection {
    tag: string;
    styles: string[];
    attributes: string[];
    classes: string[];
}

/**
 * @hidden
 */
export interface CSSPropCollection {
    property: string;
    value: string;
    priority: string;
}
