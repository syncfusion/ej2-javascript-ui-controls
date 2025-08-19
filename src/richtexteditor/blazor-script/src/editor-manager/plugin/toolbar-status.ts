import { IsFormatted } from './isformatted';
import * as CONSTANT from './../base/constant';
import { NodeSelection } from './../../selection/index';
import { IToolbarStatus } from './../../common/interface';
import { getDefaultHtmlTbStatus } from './../../common/util';
import { closest, isNullOrUndefined } from '../../../../base'; /*externalscript*/
/**
 * Update Toolbar Status
 *
 * @hidden
 * @deprecated
 */

export const statusCollection: IToolbarStatus = getDefaultHtmlTbStatus();

export class ToolbarStatus {
    /**
     * get method
     *
     * @param {Document} docElement - specifies the document element
     * @param {Node} rootNode - specifies the content editable element
     * @param {string[]} formatNode - specifies the format node
     * @param {string[]} fontSize - specifies the font size
     * @param {string[]} fontName - specifies the font name.
     * @param {Node} documentNode - specifies the document node.
     * @returns {IToolbarStatus} - returns the toolbar status
     * @hidden
     * @deprecated
     */
    public static get(
        docElement: Document,
        rootNode: Node,
        formatNode?: string[],
        fontSize?: string[],
        fontName?: string[], documentNode?: Node): IToolbarStatus {
        let formatCollection: IToolbarStatus = JSON.parse(JSON.stringify(statusCollection));
        const nodeCollection: IToolbarStatus = JSON.parse(JSON.stringify(statusCollection));
        const nodeSelection: NodeSelection = new NodeSelection(rootNode as HTMLElement);
        const range: Range = nodeSelection.getRange(docElement);
        const nodes: Node[] = documentNode ? [documentNode] : range.collapsed ? nodeSelection.getNodeCollection(range) :
            nodeSelection.getSelectionNodeCollectionBr(range);
        const nodesLength: number = nodes.length;
        let isNodeChanged: boolean = false;
        for (let index: number = 0; index < nodes.length; index++) {
            while (nodes[index as number] && nodes[index as number].nodeType === 3 && range.startContainer.nodeType === 3 &&
                nodes[index as number].parentNode && nodes[index as number].parentNode.lastElementChild && nodes[index as number].parentNode.lastElementChild.nodeName !== 'BR' &&
                (this.getImmediateBlockNode(nodes[index as number].parentNode as Node)) &&
                (this.getImmediateBlockNode(nodes[index as number].parentNode as Node)).textContent.replace(/\u200B/g, '').length === 0 &&
                range.startContainer.textContent.replace(/\u200B/g, '').length === 0 &&
                nodeSelection.get(docElement).toString().replace(/\u200B/g, '').length === 0) {
                nodes[index as number] = nodes[index as number].parentNode.lastElementChild.firstChild;
                isNodeChanged = true;
            }
            if (isNodeChanged && nodes[index as number]) {
                nodeSelection.setCursorPoint(docElement, (nodes[index as number] as Element), nodes[index as number].textContent.length);
                isNodeChanged = false;
            }
            if (nodes[index as number] && ((nodes[index as number].nodeName !== 'BR' && nodes[index as number].nodeType !== 3) ||
            (nodesLength > 1 && nodes[index as number].nodeType === 3 && nodes[index as number].textContent.trim() === ''))) {
                nodes.splice(index, 1);
                index--;
            }
        }
        for (let index: number = 0; index < nodes.length; index++) {
            const closestColOrColgroup: Element = closest(nodes[index as number] as Element, 'col, colgroup');
            if (isNullOrUndefined(closestColOrColgroup)) {
                // eslint-disable-next-line max-len
                formatCollection = this.getFormatParent(
                    docElement, formatCollection, nodes[index as number],
                    rootNode, formatNode, fontSize, fontName
                );
                if ((index === 0 && formatCollection.bold) || !formatCollection.bold) {
                    nodeCollection.bold = formatCollection.bold;
                }
                if ((index === 0 && formatCollection.insertcode) || !formatCollection.insertcode) {
                    nodeCollection.insertcode = formatCollection.insertcode;
                }
                if ((index === 0 && formatCollection.isCodeBlock) || !formatCollection.isCodeBlock) {
                    nodeCollection.isCodeBlock = formatCollection.isCodeBlock;
                }
                if ((index === 0 && formatCollection.blockquote) || !formatCollection.blockquote) {
                    nodeCollection.blockquote = formatCollection.blockquote;
                }
                if ((index === 0 && formatCollection.italic) || !formatCollection.italic) {
                    nodeCollection.italic = formatCollection.italic;
                }
                if ((index === 0 && formatCollection.underline) || !formatCollection.underline) {
                    nodeCollection.underline = formatCollection.underline;
                }
                if ((index === 0 && formatCollection.strikethrough) || !formatCollection.strikethrough) {
                    nodeCollection.strikethrough = formatCollection.strikethrough;
                }
                if ((index === 0 && formatCollection.superscript) || !formatCollection.superscript) {
                    nodeCollection.superscript = formatCollection.superscript;
                }
                if ((index === 0 && formatCollection.subscript) || !formatCollection.subscript) {
                    nodeCollection.subscript = formatCollection.subscript;
                }
                if ((index === 0 && formatCollection.fontcolor) || !formatCollection.fontcolor) {
                    nodeCollection.fontcolor = formatCollection.fontcolor;
                }
                if (index === 0 && formatCollection.fontname) {
                    nodeCollection.fontname = formatCollection.fontname;
                } else {
                    nodeCollection.fontname = formatCollection.fontname === nodeCollection.fontname ? formatCollection.fontname : 'empty';
                }
                if (index === 0 && formatCollection.fontsize) {
                    nodeCollection.fontsize = formatCollection.fontsize;
                } else{
                    nodeCollection.fontsize = formatCollection.fontsize === nodeCollection.fontsize ? formatCollection.fontsize : 'empty';
                }
                if ((index === 0 && formatCollection.backgroundcolor) || !formatCollection.backgroundcolor) {
                    nodeCollection.backgroundcolor = formatCollection.backgroundcolor;
                }
                if ((index === 0 && formatCollection.orderedlist) || !formatCollection.orderedlist) {
                    nodeCollection.orderedlist = formatCollection.orderedlist;
                }
                if ((index === 0 && formatCollection.unorderedlist) || !formatCollection.unorderedlist) {
                    nodeCollection.unorderedlist = formatCollection.unorderedlist;
                }
                if ((index === 0 && formatCollection.alignments) || !formatCollection.alignments) {
                    nodeCollection.alignments = formatCollection.alignments;
                }
                if (index === 0 && formatCollection.formats) {
                    nodeCollection.formats = formatCollection.formats;
                } else {
                    nodeCollection.formats = formatCollection.formats === nodeCollection.formats ? formatCollection.formats : 'empty';
                }
                if ((index === 0 && formatCollection.createlink) || !formatCollection.createlink) {
                    nodeCollection.createlink = formatCollection.createlink;
                }
                if ((index === 0 && formatCollection.numberFormatList) || !formatCollection.numberFormatList) {
                    nodeCollection.numberFormatList = formatCollection.numberFormatList;
                }
                if ((index === 0 && formatCollection.bulletFormatList) || !formatCollection.bulletFormatList) {
                    nodeCollection.bulletFormatList = formatCollection.bulletFormatList;
                }
                if ((index === 0 && formatCollection.inlinecode) || !formatCollection.inlinecode) {
                    nodeCollection.inlinecode = formatCollection.inlinecode;
                }
                formatCollection = JSON.parse(JSON.stringify(statusCollection));
            }
        }
        return nodeCollection;
    }

    private static getImmediateBlockNode(node: Node): Node {
        do {
            node = node.parentNode;
        } while (node && CONSTANT.BLOCK_TAGS.indexOf(node.nodeName.toLocaleLowerCase()) < 0);
        return node;
    }

    private static getFormatParent(
        docElement: Document,
        formatCollection: IToolbarStatus,
        node: Node,
        targetNode: Node,
        formatNode?: string[],
        fontSize?: string[],
        fontName?: string[]): IToolbarStatus {
        const isListUpdated: boolean = false;
        const isComplexListUpdated: boolean = false;
        if (targetNode.contains(node) ||
            (node && node.nodeType === 3 && targetNode.nodeType !== 3 && targetNode.contains(node.parentNode))) {
            formatCollection = this.isFormattedNode(
                docElement, formatCollection, node,
                isListUpdated, isComplexListUpdated, formatNode,
                fontSize, fontName, targetNode
            );
        }
        return formatCollection;
    }
    private static checkCodeBlock(element: HTMLElement): boolean {
        return (element.nodeName === 'CODE' && element.parentElement && element.parentElement.nodeName === 'PRE' && element.parentElement.hasAttribute('data-language'));
    }
    private static isFormattedNode(
        docElement: Document,
        formatCollection: IToolbarStatus,
        node: Node,
        isListUpdated: boolean,
        isComplexListUpdated: boolean,
        formatNode?: string[],
        fontSize?: string[],
        fontName?: string[],
        targetNode?: Node): IToolbarStatus {
        const BLOCK_TAGS : string[] = CONSTANT.BLOCK_TAGS;
        let currentNode: Node | null = node;
        const collectedTags: string[] = [];
        const collectedStyles: { [key: string]: string } = {};
        //Traverse and collect tags and styles for inline nodes
        while (currentNode && (!(BLOCK_TAGS.indexOf(currentNode.nodeName.toLowerCase()) > -1)) &&
        (!targetNode || currentNode.nodeName !== targetNode.nodeName)) {
            if (currentNode.nodeType === 1) {
                const element: HTMLElement = currentNode as HTMLElement;
                if (!this.checkCodeBlock(element)) {
                    collectedTags.push(element.nodeName.toLowerCase());
                }
                this.collectStyles(currentNode, collectedStyles, docElement, fontName, fontSize);
            }
            currentNode = currentNode.parentNode;
        }
        // Keep traversing up until document root
        while (currentNode && currentNode !== targetNode) {
            const nodeName : string  = currentNode.nodeName.toLowerCase();
            if (!formatCollection.unorderedlist && nodeName === 'ul' && !isListUpdated && !isComplexListUpdated) {
                formatCollection.unorderedlist = true;
                isListUpdated = true;
                formatCollection.bulletFormatList = this.isBulletFormatList(currentNode) as string;
                isComplexListUpdated = formatCollection.bulletFormatList !== null ? true : false;
            }
            if (!formatCollection.orderedlist && nodeName === 'ol' && !isListUpdated && !isComplexListUpdated) {
                formatCollection.orderedlist = true;
                isListUpdated = true;
                formatCollection.numberFormatList = this.isNumberFormatList(currentNode) as string;
                isComplexListUpdated = formatCollection.numberFormatList !== null ? true : false;
            }
            if (!formatCollection.blockquote && nodeName === 'blockquote') {
                formatCollection.blockquote = true;
            }
            if (!formatCollection.formats ) {
                formatCollection.formats = this.isFormats(currentNode, formatNode);
                if (formatCollection.formats === 'pre' && nodeName === 'pre' && currentNode.firstChild.nodeName !== 'CODE' && !(currentNode as Element).hasAttribute('data-language')) {
                    formatCollection.insertcode = true;
                }
            }
            if (!formatCollection.isCodeBlock && currentNode.nodeName.toLocaleLowerCase() === 'pre' && (currentNode as HTMLElement).hasAttribute('data-language')) {
                formatCollection.isCodeBlock = true;
            }
            this.collectStyles(currentNode, collectedStyles, docElement, fontName, fontSize);
            currentNode = currentNode.parentNode;
        }
        if (collectedTags.indexOf('b') > -1 || collectedTags.indexOf('strong') > -1) {
            formatCollection.bold = true;
        }
        if (collectedTags.indexOf('i') > -1 || collectedTags.indexOf('em') > -1) {
            formatCollection.italic = true;
        }
        if (collectedTags.indexOf('u') > -1 || (collectedStyles['underLine'])) {
            formatCollection.underline = true;
        }
        if (collectedTags.indexOf('s') > -1 || collectedTags.indexOf('del') > -1 || (collectedStyles['strikeThrough'])) {
            formatCollection.strikethrough = true;
        }
        if (collectedTags.indexOf('sup') > -1) {
            formatCollection.superscript = true;
        }
        if (collectedTags.indexOf('sub') > -1) {
            formatCollection.subscript = true;
        }
        if (collectedStyles['color']) {
            formatCollection.fontcolor = collectedStyles['color'];
        }
        if (collectedStyles['backgroundColor']) {
            formatCollection.backgroundcolor = collectedStyles['backgroundColor'];
        }
        if (collectedStyles['fontFamily']) {
            formatCollection.fontname = collectedStyles['fontFamily'];
        }
        if (collectedStyles['fontSize']) {
            formatCollection.fontsize = collectedStyles['fontSize'];
        }
        if (collectedStyles['textAlign']) {
            formatCollection.alignments = collectedStyles['textAlign'];
        }
        if (collectedTags.indexOf('a') > -1) {
            formatCollection.createlink = true;
        }
        if (collectedTags.indexOf('code') > -1) {
            formatCollection.inlinecode = true;
        }
        return formatCollection;
    }

    private static isFontColor(docElement: Document, node: Node): string {
        let color: string = (node as HTMLElement).style && (node as HTMLElement).style.color;
        if ((color === null || color === undefined || color === '') && node.nodeType !== 3) {
            color = this.getComputedStyle(docElement, (node as HTMLElement), 'color');
        }
        if (color !== null && color !== '' && color !== undefined) {
            return color;
        } else {
            return null;
        }
    }

    private static isBackgroundColor(node: Node): string {
        const backColor: string = (node as HTMLElement).style && (node as HTMLElement).style.backgroundColor;
        if (backColor !== null && backColor !== '' && backColor !== undefined) {
            return backColor;
        } else {
            return null;
        }
    }

    private static isFontSize(docElement: Document, node: Node, fontSize?: string[]): string {
        let size: string = (node as HTMLElement).style && (node as HTMLElement).style.fontSize;
        const isInlineTags: boolean = IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) > -1;
        if (size && node.nodeType === 1 && !isInlineTags ) {
            size = null;
        }
        if ((size === null || size === undefined || size === '') && node.nodeType !== 3 &&
            (node as HTMLElement).parentElement.classList.contains('e-content')) {
            size = this.getComputedStyle(docElement, (node as HTMLElement), 'font-size');
        }
        if ((size !== null && size !== '' && size !== undefined)
            && (fontSize === null || fontSize === undefined || (fontSize.indexOf(size) > -1))) {
            return size;
        } else {
            return null;
        }
    }

    private static isFontName(docElement: Document, node: Node, fontName?: string[]): string {
        let name: string = (node as HTMLElement).style && (node as HTMLElement).style.fontFamily;
        const isInlineTags: boolean = IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) > -1;
        if (name && node.nodeType === 1 && !isInlineTags ) {
            name = null;
        }
        if ((name === null || name === undefined || name === '') && node.nodeType !== 3 && isInlineTags) {
            name = this.getComputedStyle(docElement, (node as HTMLElement), 'font-family');
        }
        let index: number = null;
        if ((name !== null && name !== '' && name !== undefined)
            && (fontName === null || fontName === undefined || (fontName.filter((value: string, pos: number) => {
                const regExp: RegExpConstructor = RegExp;
                const pattern: RegExp = new regExp(name, 'i');
                if ((value.replace(/"/g, '').replace(/ /g, '').toLowerCase() === name.replace(/"/g, '').replace(/ /g, '').toLowerCase()) ||
                    (value.split(',')[0] && !isNullOrUndefined(value.split(',')[0].trim().match(pattern)) &&
                    value.split(',')[0].trim() === value.split(',')[0].trim().match(pattern)[0])) {
                    index = pos;
                }
            }) && (index !== null)))) {
            return (index !== null) ? fontName[index as number] : name.replace(/"/g, '');
        } else {
            return null;
        }
    }

    private static isAlignment(node: Node): string {
        const align: string = (node as HTMLElement).style && (node as HTMLElement).style.textAlign;
        if (align === 'left') {
            return 'justifyleft';
        } else if (align === 'center') {
            return 'justifycenter';
        } else if (align === 'right') {
            return 'justifyright';
        } else if (align === 'justify') {
            return 'justifyfull';
        } else {
            return null;
        }
    }

    private static isFormats(node: Node, formatNode?: string[]): string {
        const tags: string[] = ['tbody', 'tfoot', 'thead', 'ol', 'ul', 'table', 'li', 'td', 'th'];
        if (((formatNode === undefined || formatNode === null)
            && CONSTANT.BLOCK_TAGS.indexOf((node as Node).nodeName.toLocaleLowerCase()) > -1)
            || (formatNode !== null && formatNode !== undefined
                && formatNode.indexOf((node as Node).nodeName.toLocaleLowerCase()) > -1)) {
            return (node as Node).nodeName.toLocaleLowerCase();
        } else if (tags.indexOf((node as Node).nodeName.toLocaleLowerCase()) > -1) {
            return 'p';
        } else {
            return null;
        }
    }

    private static getComputedStyle(docElement: Document, node: HTMLElement, prop: string): string {
        return docElement.defaultView.getComputedStyle(node, null).getPropertyValue(prop);
    }
    private static isNumberFormatList(node: Node): string | boolean {
        const list: string = (node as HTMLElement).style && (node as HTMLElement).style.listStyleType;
        if (list === 'lower-alpha') {
            return 'Lower Alpha';
        } else if (list === 'number') {
            return 'Number';
        } else if (list === 'upper-alpha') {
            return 'Upper Alpha';
        } else if (list === 'lower-roman') {
            return 'Lower Roman';
        } else if (list === 'upper-roman') {
            return 'Upper Roman';
        } else if (list === 'lower-greek') {
            return 'Lower Greek';
        } else if (list === 'none' && node.nodeName === 'OL') {
            return 'None';
        } else if (node.nodeName === 'OL') {
            return true;
        } else {
            return null;
        }
    }

    private static isBulletFormatList(node: Node): string | boolean {
        const list: string = (node as HTMLElement).style && (node as HTMLElement).style.listStyleType;
        if (list === 'circle') {
            return 'Circle';
        } else if (list === 'square') {
            return 'Square';
        } else if (list === 'none' && node.nodeName === 'UL') {
            return 'None';
        } else if (list === 'disc') {
            return 'Disc';
        } else if (node.nodeName === 'UL') {
            return true;
        } else {
            return null;
        }
    }

    // collecting styles of the current node
    private static collectStyles(currentNode: Node, collectedStyles: { [key: string]: string }, docElement: Document, fontName: string[],
                                 fontSize: string[]): void {
        if (!collectedStyles['color']) {
            collectedStyles['color'] = this.isFontColor(docElement, currentNode);
        }
        if (!collectedStyles['backgroundColor']) {
            collectedStyles['backgroundColor'] = this.isBackgroundColor(currentNode);
        }
        if (!collectedStyles['fontFamily']) {
            const font: string = this.isFontName(docElement, currentNode, fontName);
            if (font) {
                collectedStyles['fontFamily'] = font;
            }
        }
        if (!collectedStyles['fontSize']) {
            const size: string = this.isFontSize(docElement, currentNode, fontSize);
            if (size) {
                collectedStyles['fontSize'] = size;
            }
        }
        if (!collectedStyles['textAlign']) {
            collectedStyles['textAlign'] = this.isAlignment(currentNode);
        }
        let textDecoration: string = null;
        if ((currentNode as HTMLElement).style && (currentNode as HTMLElement).style.textDecoration) {
            textDecoration = (currentNode as HTMLElement).style.textDecoration;
        } else {
            textDecoration = this.getComputedStyle(docElement, currentNode as HTMLElement, 'text-decoration');
            if (currentNode.nodeName === 'A' && textDecoration.includes('underline')) {
                textDecoration = null;
            }
        }
        if (textDecoration) {
            if (!collectedStyles['underLine']) {
                collectedStyles['underLine'] = textDecoration.includes('underline') ? 'underline' : null;
            }
            if (!collectedStyles['strikeThrough']) {
                collectedStyles['strikeThrough'] = textDecoration.includes('line-through') ? 'line-through' : null;
            }
        }
    }
}
