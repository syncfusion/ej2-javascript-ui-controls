import { IsFormatted } from './isformatted';
import * as CONSTANT from './../base/constant';
import { NodeSelection } from './../../selection/index';
import { IToolbarStatus } from './../../common/interface';
/**
 * Update Toolbar Status
 * @hidden
 */

export const statusCollection: IToolbarStatus = {
    bold: false,
    italic: false,
    subscript: false,
    superscript: false,
    strikethrough: false,
    orderedlist: false,
    unorderedlist: false,
    underline: false,
    alignments: null,
    backgroundcolor: null,
    fontcolor: null,
    fontname: null,
    fontsize: null,
    formats: null,
    createlink: false
};

export class ToolbarStatus {

    public static get(
        docElement: Document,
        targetNode: Node,
        formatNode?: string[],
        fontSize?: string[],
        fontName?: string[], documentNode?: Node): IToolbarStatus {
        let formatCollection: IToolbarStatus = JSON.parse(JSON.stringify(statusCollection));
        let nodeCollection: IToolbarStatus = JSON.parse(JSON.stringify(statusCollection));
        let nodeSelection: NodeSelection = new NodeSelection();
        let nodes: Node[] = documentNode ? [documentNode] : nodeSelection.getNodeCollection(nodeSelection.getRange(docElement));
        for (let index: number = 0; index < nodes.length; index++) {
            if (nodes[index].nodeType !== 3) {
                nodes.splice(index, 1);
                index--;
            }
        }
        for (let index: number = 0; index < nodes.length; index++) {
            formatCollection = this.getFormatParent(docElement, formatCollection, nodes[index], targetNode, formatNode, fontSize, fontName);
            if ((index === 0 && formatCollection.bold) || !formatCollection.bold) {
                nodeCollection.bold = formatCollection.bold;
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
            if ((index === 0 && formatCollection.fontname) || !formatCollection.fontname) {
                nodeCollection.fontname = formatCollection.fontname;
            }
            if ((index === 0 && formatCollection.fontsize) || !formatCollection.fontsize) {
                nodeCollection.fontsize = formatCollection.fontsize;
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
            if ((index === 0 && formatCollection.formats) || !formatCollection.formats) {
                nodeCollection.formats = formatCollection.formats;
            }
            if ((index === 0 && formatCollection.createlink) || !formatCollection.createlink) {
                nodeCollection.createlink = formatCollection.createlink;
            }
            formatCollection = JSON.parse(JSON.stringify(statusCollection));
        }
        return nodeCollection;
    }

    private static getFormatParent(
        docElement: Document,
        formatCollection: IToolbarStatus,
        node: Node,
        targetNode: Node,
        formatNode?: string[],
        fontSize?: string[],
        fontName?: string[]): IToolbarStatus {
        if (targetNode.contains(node)) {
            do {
                formatCollection = this.isFormattedNode(docElement, formatCollection, node, formatNode, fontSize, fontName);
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
            formatCollection.fontsize = this.isFontSize(node, fontSize);
        }
        if (!formatCollection.backgroundcolor) {
            formatCollection.backgroundcolor = this.isBackgroundColor(node);
        }
        if (!formatCollection.orderedlist) {
            formatCollection.orderedlist = this.isOrderedList(node);
        }
        if (!formatCollection.unorderedlist) {
            formatCollection.unorderedlist = this.isUnorderedList(node);
        }
        if (!formatCollection.alignments) {
            formatCollection.alignments = this.isAlignment(node);
        }
        if (!formatCollection.formats) {
            formatCollection.formats = this.isFormats(node, formatNode);
        }
        if (!formatCollection.createlink) {
            formatCollection.createlink = this.isLink(node);
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
        let backColor: string = (node as HTMLElement).style && (node as HTMLElement).style.backgroundColor;
        if (backColor !== null && backColor !== '' && backColor !== undefined) {
            return backColor;
        } else {
            return null;
        }
    }

    private static isFontSize(node: Node, fontSize?: string[]): string {
        let size: string = (node as HTMLElement).style && (node as HTMLElement).style.fontSize;
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
                if (value.replace(/"/g, '').replace(/ /g, '') === name.replace(/"/g, '').replace(/ /g, '')) {
                    index = pos;
                }
            }) && (index !== null)))) {
            return (index !== null) ? fontName[index] : name.replace(/"/g, '');
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
        let align: string = (node as HTMLElement).style && (node as HTMLElement).style.textAlign;
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

}