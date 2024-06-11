import { IsFormatted } from './isformatted';
import * as CONSTANT from './../base/constant';
import { NodeSelection } from './../../selection/index';
import { IToolbarStatus } from './../../common/interface';
import { getDefaultHtmlTbStatus } from './../../common/util';
import { closest, isNullOrUndefined } from '@syncfusion/ej2-base';
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
        const nodeSelection: NodeSelection = new NodeSelection();
        const range: Range = nodeSelection.getRange(docElement);
        const nodes: Node[] = documentNode ? [documentNode] : range.collapsed ? nodeSelection.getNodeCollection(range) :
            nodeSelection.getSelectionNodeCollectionBr(range);
        const nodesLength: number = nodes.length;
        let isNodeChanged: boolean = false;
        for (let index: number = 0; index < nodes.length; index++) {
            while (nodes[index as number].nodeType === 3 && range.startContainer.nodeType === 3 && nodes[index as number].parentNode &&
                nodes[index as number].parentNode.lastElementChild && nodes[index as number].parentNode.lastElementChild.nodeName !== 'BR' &&
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
            if ((nodes[index as number].nodeName !== 'BR' && nodes[index as number].nodeType !== 3) ||
            (nodesLength > 1 && nodes[index as number].nodeType === 3 && nodes[index as number].textContent.trim() === '')) {
                nodes.splice(index, 1);
                index--;
            }
        }
        for (let index: number = 0; index < nodes.length; index++) {
            // eslint-disable-next-line max-len
            formatCollection = this.getFormatParent(docElement, formatCollection, nodes[index as number], rootNode, formatNode, fontSize, fontName);
            if ((index === 0 && formatCollection.bold) || !formatCollection.bold) {
                nodeCollection.bold = formatCollection.bold;
            }
            if ((index === 0 && formatCollection.insertcode) || !formatCollection.insertcode) {
                nodeCollection.insertcode = formatCollection.insertcode;
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
            formatCollection = JSON.parse(JSON.stringify(statusCollection));
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
        let isListUpdated: boolean = false;
        let isComplexListUpdated: boolean = false;
        if (targetNode.contains(node) ||
            (node.nodeType === 3 && targetNode.nodeType !== 3 && targetNode.contains(node.parentNode))) {
            do {
                formatCollection = this.isFormattedNode(
                    docElement, formatCollection, node, isListUpdated, isComplexListUpdated,
                    formatNode, fontSize, fontName);
                if (formatCollection.orderedlist || formatCollection.unorderedlist) {
                    isListUpdated = true;
                }
                if (formatCollection.bulletFormatList || formatCollection.numberFormatList) {
                    isComplexListUpdated = true;
                }
                node = node.parentNode;
            }
            while (node && (node !== targetNode));
        }
        return formatCollection;
    }

    private static isFormattedNode(
        docElement: Document,
        formatCollection: IToolbarStatus,
        node: Node,
        isListUpdated: boolean,
        isComplexListUpdated: boolean,
        formatNode?: string[],
        fontSize?: string[],
        fontName?: string[]): IToolbarStatus {
        if (!formatCollection.bold) {
            formatCollection.bold = IsFormatted.isBold(node);
        }
        if (!formatCollection.italic) {
            formatCollection.italic = IsFormatted.isItalic(node);
        }
        if (!formatCollection.underline) {
            formatCollection.underline = IsFormatted.isUnderline(node);
        }
        if (!formatCollection.strikethrough) {
            formatCollection.strikethrough = IsFormatted.isStrikethrough(node);
        }
        if (!formatCollection.superscript) {
            formatCollection.superscript = IsFormatted.isSuperscript(node);
        }
        if (!formatCollection.subscript) {
            formatCollection.subscript = IsFormatted.isSubscript(node);
        }
        if (!formatCollection.fontcolor) {
            formatCollection.fontcolor = this.isFontColor(docElement, node);
        }
        if (!formatCollection.fontname) {
            formatCollection.fontname = this.isFontName(docElement, node, fontName);
        }
        if (!formatCollection.fontsize) {
            formatCollection.fontsize = this.isFontSize(docElement, node, fontSize);
        }
        if (!formatCollection.backgroundcolor) {
            formatCollection.backgroundcolor = this.isBackgroundColor(node);
        }
        if (!formatCollection.orderedlist && !isListUpdated) {
            formatCollection.orderedlist = this.isOrderedList(node);
        }
        if (!formatCollection.unorderedlist && !isListUpdated) {
            formatCollection.unorderedlist = this.isUnorderedList(node);
        }
        if (!formatCollection.alignments) {
            formatCollection.alignments = this.isAlignment(node);
        }
        if (!formatCollection.formats) {
            formatCollection.formats = this.isFormats(node, formatNode);
            if (formatCollection.formats === 'pre') {
                formatCollection.insertcode = true;
            }
        }
        if (!formatCollection.blockquote) {
            let currentFormatCollection: string;
            if (!isNullOrUndefined(formatNode)) {
                if (formatNode.indexOf('blockquote') > -1) {
                    formatCollection.formats = this.isFormats(node, formatNode);
                    currentFormatCollection = formatCollection.formats;
                } else {
                    formatNode.push('blockquote');
                    currentFormatCollection = this.isFormats(node, formatNode);
                    for (let i: number = formatNode.length - 1; i >= 0; i--) {
                        if (formatNode[i as number] === 'blockquote') {
                            formatNode.splice(i, 1);
                        }
                    }
                }
            }
            if (currentFormatCollection === 'blockquote') {
                formatCollection.blockquote = true;
            }
        }
        if (!formatCollection.createlink) {
            formatCollection.createlink = this.isLink(node);
        }
        if (!formatCollection.numberFormatList && !isComplexListUpdated) {
            formatCollection.numberFormatList = this.isNumberFormatList(node) as string;
        }
        if (!formatCollection.bulletFormatList && !isComplexListUpdated) {
            formatCollection.bulletFormatList = this.isBulletFormatList(node) as string;
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

    private static isLink(node: Node): boolean {
        if (node.nodeName.toLocaleLowerCase() === 'a') {
            return true;
        } else {
            return false;
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
        if ((name === null || name === undefined || name === '') && node.nodeType !== 3) {
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

    private static isOrderedList(node: Node): boolean {
        if (node.nodeName.toLocaleLowerCase() === 'ol') {
            return true;
        } else {
            return false;
        }
    }

    private static isUnorderedList(node: Node): boolean {
        if (node.nodeName.toLocaleLowerCase() === 'ul') {
            return true;
        } else {
            return false;
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
        if (((formatNode === undefined || formatNode === null)
            && CONSTANT.BLOCK_TAGS.indexOf((node as Node).nodeName.toLocaleLowerCase()) > -1)
            || (formatNode !== null && formatNode !== undefined
                && formatNode.indexOf((node as Node).nodeName.toLocaleLowerCase()) > -1)) {
            return (node as Node).nodeName.toLocaleLowerCase();
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
        }else if (list === 'lower-greek') {
            return 'Lower Greek';
        }else if (list === 'none') {
            return 'None';
        } else if (this.isOrderedList(node)) {
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
        } else if (list === 'none') {
            return 'None';
        } else if (list === 'disc') {
            return 'Disc';
        } else if (this.isUnorderedList(node)) {
            return true;
        } else {
            return null;
        }
    }
}
