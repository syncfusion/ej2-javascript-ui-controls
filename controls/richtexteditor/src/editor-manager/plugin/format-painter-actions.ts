import { closest, createElement, detach, isNullOrUndefined as isNOU, removeClass } from '@syncfusion/ej2-base';
import { CSSPropCollection, DeniedFormatsCollection, FormatPainterCollection, FormatPainterValue, IFormatPainterEditor, IFormatPainterSettings, IHtmlItem } from '../base';
import { NodeSelection } from '../../selection/selection';
import * as EVENTS from '../../common/constant';
import { SelectionCommands } from '../plugin';
import { EditorManager } from '../base';
import { IFormatPainterContext } from '../base/enum';

export class FormatPainterActions implements IFormatPainterEditor{
    private INVALID_TAGS: string[] = ['A', 'AUDIO', 'IMG', 'VIDEO', 'IFRAME'];
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
        this.parent.observer.on(EVENTS.MODEL_CHANGED_PLUGIN, this.onPropertyChanged, this);
    }

    private onPropertyChanged(prop: { module: string; newProp: { formatPainterSettings: IFormatPainterSettings }}): void {
        if (prop && prop.module === 'formatPainter') {
            if (!isNOU(prop.newProp.formatPainterSettings.allowedFormats)) {
                this.settings.allowedFormats = prop.newProp.formatPainterSettings.allowedFormats;
            }
            if (!isNOU(prop.newProp.formatPainterSettings.deniedFormats)) {
                this.settings.deniedFormats = prop.newProp.formatPainterSettings.deniedFormats;
                this.setDeniedFormats();
            }
        }
    }

    private removeEventListener(): void {
        this.parent.observer.off(EVENTS.FORMAT_PAINTER_ACTIONS, this.actionHandler);
        this.parent.observer.off(EVENTS.MODEL_CHANGED_PLUGIN, this.onPropertyChanged);
    }

    /**
     * Destroys the format painter.
     *
     * @function destroy
     * @returns {void}
     * @hidden
     * @deprecated
     */
    public destroy(): void {
        this.removeEventListener();
        this.INVALID_TAGS = null;
        this.copyCollection = null;
        this.deniedFormatsCollection = null;
        this.newElem = null;
        this.newElemLastChild = null;
        this.settings = null;
        this.parent = null;
    }

    private actionHandler(args: IHtmlItem): void {
        this.settings.allowedContext = ['Text', 'List', 'Table'];
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
            this.callBack(args);
        }
    }

    private callBack (event: IHtmlItem): void {
        if (event.callBack) {
            event.callBack({
                requestType: 'FormatPainter',
                action: event.item.formatPainterAction,
                event: event.event,
                editorMode: 'HTML',
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument) as Element[]
            });
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
                                    removeClass([elementsList[j as number] as HTMLElement], classes[k as number].trim());
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
                                (elementsList[j as number] as HTMLElement).style.removeProperty(styles[k as number].trim());
                            }
                            if ((elementsList[j as number] as HTMLElement).style.length === 0){
                                (elementsList[j as number] as HTMLElement).removeAttribute('style');
                            }
                        }
                        if (deniedPropArray[i as number].attributes.length > 0){
                            const attributes: string[] = deniedPropArray[i as number].attributes;
                            const attributeLength: number = attributes.length;
                            for (let k: number = 0; k < attributeLength; k++){
                                (elementsList[j as number] as HTMLElement).removeAttribute(attributes[k as number].trim());
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
        const domSelection: NodeSelection = this.parent.nodeSelection;
        let nodes: Node[] = range.collapsed  ? domSelection.getSelectionNodeCollection(range) :
            domSelection.getSelectionNodeCollectionBr(range);
        if (nodes.length === 0 && domSelection.getSelectionNodeCollectionBr(range).length === 0) {
            return;
        } else {
            nodes = nodes.length === 0 ? domSelection.getSelectionNodeCollectionBr(range) : nodes;
        }
        let parentElem: HTMLElement = nodes[0].parentElement;
        let currentContext: string | null = this.findCurrentContext(parentElem);
        const allowedRulesArray: string[] = this.settings.allowedFormats.indexOf(';') > -1 ? this.settings.allowedFormats.split(';') :
            [this.settings.allowedFormats];
        for (let i: number = 0; i < allowedRulesArray.length; i++) {
            allowedRulesArray[i as number] = allowedRulesArray[i as number].trim();
        }
        const [rangeParentElem, context] = this.getRangeParentElem(currentContext, parentElem);
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

    private getRangeParentElem(currentContext: string, rangeParent: HTMLElement): [Element, string] {
        let startContainer: Node = rangeParent;
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
            const nearBlockParentName: string | null = this.getNearestBlockParentElement(rangeParent);
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

    private getNearestBlockParentElement(rangeParent: HTMLElement): string | null {
        let node: Node | null = rangeParent;
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
        if (node.nodeType === 3){
            node = node.parentElement;
        }
        return this.INVALID_TAGS.indexOf((node as HTMLElement).tagName) > -1 ;
    }

    private findCurrentContext (parentElem: HTMLElement) : string | null {
        if (closest(parentElem, 'p')) {
            return 'Text';
        } else if (closest(parentElem, 'li')) {
            return 'List';
        }else if (closest(parentElem, 'td') || closest(parentElem, 'tr') || closest(parentElem, 'th')){
            return 'Table';
        }
        return null;
    }

    private insertFormatNode(elem: HTMLElement, lastChild : HTMLElement): void {
        let clonedElem: HTMLElement = elem.cloneNode(true) as HTMLElement;
        if (!this.isBlockElement(elem)) {
            const newBlockElem: Element = createElement('P');
            newBlockElem.appendChild(elem);
            clonedElem = newBlockElem.cloneNode(true) as HTMLElement;
        }
        const endNode: Element = this.parent.editableElement;
        const docElement: Document = this.parent.currentDocument;
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
        const range: Range = this.parent.nodeSelection.getRange(docElement);
        const isCollapsed: boolean = range.collapsed;
        const blockNodes: Node[] = this.parent.domNode.blockNodes();
        let isFullNodeSelected: boolean = false;
        if (blockNodes.length === 1) {
            isFullNodeSelected = blockNodes[0].textContent.trim() === range.toString().trim();
        }
        if (this.isBlockElement(clonedElem) && isCollapsed || blockNodes.length > 1 || isFullNodeSelected) {
            this.insertBlockNode(clonedElem, range, docElement, blockNodes);
        }
    }

    private insertBlockNode(element: HTMLElement, range: Range, docElement: Document, nodes: Node[]): void {
        const domSelection: NodeSelection = this.parent.nodeSelection;
        const saveSelection: NodeSelection = domSelection.save(range, docElement);
        this.parent.domNode.setMarker(saveSelection);
        let listElement: HTMLElement; // To clone to multiple list elements
        let cloneListParentNode: Node;
        let sameListType: boolean = false;
        if (element.nodeName === 'UL' || element.nodeName === 'OL'){
            cloneListParentNode = element.cloneNode(true);
            listElement = cloneListParentNode.firstChild as HTMLElement;
        }
        const cloneElementNode: Node = isNOU(cloneListParentNode) ? element : element.firstChild;
        for (let index: number = 0; index < nodes.length; index++) {
            if (this.INVALID_TAGS.indexOf(nodes[index as number].nodeName) > -1  ||
            (nodes[index as number] as HTMLElement).querySelectorAll('a,img,audio,video,iframe').length > 0) {
                continue;
            }
            const cloneParentNode: Node = cloneElementNode.cloneNode(false);
            // Appending all the child elements
            while (nodes[index as number].firstChild) {
                if (nodes[index as number].textContent.trim().length !== 0) {
                    cloneParentNode.appendChild(nodes[index as number].firstChild);
                } else {
                    nodes[index as number].removeChild(nodes[index as number].firstChild);
                }
            }
            if (nodes[index as number].nodeName === 'TD' || nodes[index as number].nodeName === 'TH') {
                if (isNOU(cloneListParentNode)) {
                    nodes[index as number].appendChild(cloneParentNode);
                    continue;
                } else if (index === 0 && !isNOU(cloneListParentNode)) {
                    nodes[index as number].appendChild(cloneListParentNode);
                    cloneListParentNode.appendChild(cloneParentNode);
                    continue;
                } else {
                    nodes[index as number].appendChild(cloneParentNode);
                    continue;
                }
            }
            if (!isNOU(cloneListParentNode)) {
                sameListType = this.isSameListType(element, nodes[index as number]);
            }
            if (cloneParentNode.nodeName === 'LI' && !sameListType) {
                this.insertNewList(range, nodes, index, cloneListParentNode, cloneParentNode);
            } else if (sameListType) {
                this.insertSameList(nodes, index, cloneListParentNode, cloneParentNode);
            } else {
                nodes[index as number].parentNode.replaceChild(cloneParentNode, nodes[index as number]);
            }
            /**Removing the inserted block node in list and appending to previous element sibling */
            if (cloneParentNode.nodeName !== 'LI' && (cloneParentNode.parentElement.nodeName === 'OL' ||
            cloneParentNode.parentElement.nodeName === 'UL')) {
                const parent: HTMLElement = cloneParentNode.parentElement;
                // Cutting single ul or ol to two ul or ol based on the range
                this.parent.nodeCutter.SplitNode(range, parent, true);
                if (!isNOU(parent.previousElementSibling)) {
                    parent.previousElementSibling.after(cloneParentNode);
                    // To remove the nested list items out of the block element
                    if (cloneParentNode.childNodes.length > 1) {
                        for (let j: number = 0; j < cloneParentNode.childNodes.length; j++) {
                            const currentChild: Node =  cloneParentNode.childNodes[j as number];
                            if (currentChild.nodeName === 'OL' || currentChild.nodeName === 'UL') {
                                (cloneParentNode as Element).after(currentChild);
                            }
                        }
                    }
                } else {
                    parent.parentElement.prepend(cloneParentNode);
                }
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        !isNOU(listElement) ? detach(listElement) : false;
        this.cleanEmptyLists();
        const save : NodeSelection = this.parent.domNode.saveMarker(saveSelection, null);
        save.restore();
    }

    private insertNewList(range: Range, nodes: Node[], index: number, cloneListParentNode: Node, cloneParentNode: Node): void {
        // Appending the li nodes to the ol or ul node
        if (index === 0) {
            const nodeName: string = nodes[index as number].nodeName;
            nodes[index as number] = nodes[index as number].parentNode.replaceChild(cloneListParentNode, nodes[index as number]);
            const parent: HTMLElement = nodeName === 'LI' ? cloneListParentNode.parentElement
                : cloneListParentNode as HTMLElement;
            // Splicing and then inserting the node to previous element sibling of the Listparent.parent
            this.parent.nodeCutter.SplitNode(range, parent, true);
            if (nodes[index as number].nodeName === 'LI' && !isNOU(parent)) {
                (cloneListParentNode as HTMLElement).append(cloneParentNode);
                if (!isNOU(parent.parentNode)) {
                    parent.parentNode.insertBefore(cloneListParentNode, parent);
                }
            } else {
                if (!isNOU(parent)) {
                    if (!isNOU(parent.previousElementSibling) && parent.previousElementSibling.nodeName === cloneListParentNode.nodeName) {
                        const currentParent: Element = parent.previousElementSibling;
                        currentParent.append(cloneParentNode);
                        while (currentParent.firstChild) {
                            (cloneListParentNode as HTMLElement).append(currentParent.firstChild);
                        }
                    } else if (!isNOU(parent.nextElementSibling) && parent.nextElementSibling.nodeName === cloneListParentNode.nodeName) {
                        const currentParent: Element = parent.nextElementSibling;
                        currentParent.prepend(cloneParentNode);
                        while (currentParent.firstChild) {
                            (cloneListParentNode as HTMLElement).append(currentParent.firstChild);
                        }
                    } else {
                        (cloneListParentNode as HTMLElement).append(cloneParentNode);
                    }
                } else {
                    (cloneListParentNode as HTMLElement).append(cloneParentNode);
                }
            }
        } else {
            (cloneListParentNode as HTMLElement).append(cloneParentNode);
        }
        this.detachEmptyBlockNodes(nodes[index as number]);
    }

    private insertSameList(nodes: Node[], index: number, cloneListParentNode: Node, cloneParentNode: Node): void {
        if (index === 0) {
            if (!isNOU(nodes[index as number].parentNode)  && (nodes[index as number].parentNode.nodeName === 'UL' || nodes[index as number].parentNode.nodeName === 'OL')) {
                // append the nodes[index].parentNode.childNodes to the clonelistparentnode
                if (nodes.length === 1) {
                    // When clicked with cursor in the single list item
                    while (cloneParentNode.firstChild) {
                        (nodes[index as number] as HTMLElement).append(cloneParentNode.firstChild);
                    }
                    for (let i: number = 0; i < nodes[index as number].parentNode.childNodes.length; i++) {
                        const currentChild: Node = nodes[index as number].parentNode.childNodes[i as number];
                        (cloneListParentNode as HTMLElement).append(currentChild.cloneNode(true));
                    }
                } else {
                    (cloneListParentNode as HTMLElement).append(cloneParentNode);
                }
                // replace the older ol and ul with new ol and ul of clonelistparentnode
                nodes[index as number].parentNode.parentNode.replaceChild(cloneListParentNode, nodes[index as number].parentNode);
            }
        } else {
            (cloneListParentNode as HTMLElement).append(cloneParentNode);
        }
        this.detachEmptyBlockNodes(nodes[index as number]);
    }

    private isSameListType(element: HTMLElement, node: Node): boolean {
        let isSameListType: boolean = false;
        const nearestListNode: Node = closest(node, 'ol, ul');
        if (!isNOU(nearestListNode) && (nearestListNode as Element).querySelectorAll('li').length > 0) {
            if (nearestListNode.nodeName === element.nodeName) {
                isSameListType = true;
            } else {
                isSameListType = false;
            }
        }
        return isSameListType;
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
        const deniedFormats: string[] = this.settings.deniedFormats.indexOf(';') > -1 ? this.settings.deniedFormats.split(';') :
            [this.settings.deniedFormats];
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

    private detachEmptyBlockNodes(node: Node): void {
        if (!isNOU(node) && node.textContent.trim() === '') {
            detach(node);
        }
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
        tagName = tagName.trim();
        return({
            tag: tagName, styles: stylesList, classes: classList,
            attributes:  attributesList
        });
    }
}
