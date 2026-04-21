import { StyleModel } from '../../models/index';
import { findClosestParent } from './dom';

export class FormattingHelper {
    private static validBoldTags: Set<string> = new Set(['strong', 'b']);
    private static validItalicTags: Set<string> = new Set(['em', 'i']);
    private static validUnderlineTags: Set<string> = new Set(['u']);
    private static validStrikethroughTags: Set<string> = new Set(['del', 'strike', 's']);
    private static validSuperscriptTags: Set<string> = new Set(['sup']);
    private static validSubscriptTags: Set<string> = new Set(['sub']);
    private static validInlineCodeTags: Set<string> = new Set(['code']);
    private static inlineTagsSet: Set<string> = new Set(['a', 'abbr', 'acronym', 'b', 'bdo', 'big', 'cite', 'code', 'dfn', 'em',
        'font', 'i', 'kbd', 'label', 'q', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'tt', 'u', 'var', 'del']);
    /**
     * isBold method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isBold(node : Node): boolean {
        const nodeName: string = node.nodeName.toLowerCase();
        if (this.validBoldTags.has(nodeName)) {
            return true;
        } else if (this.inlineTagsSet.has(nodeName) && (node as HTMLElement).style) {
            const fontWeight: string = (node as HTMLElement).style.fontWeight;
            return fontWeight && (fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600);
        }
        return false;
    }

    /**
     * isItalic method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isItalic(node: Node): boolean {
        const nodeName: string = node.nodeName.toLowerCase();
        if (this.validItalicTags.has(nodeName)) {
            return true;
        }
        if (this.inlineTagsSet.has(nodeName) && (node as HTMLElement).style) {
            return (node as HTMLElement).style.fontStyle === 'italic';
        }
        return false;
    }

    /**
     * isUnderline method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isUnderline(node: Node): boolean {
        const nodeName: string = node.nodeName.toLowerCase();
        if (this.validUnderlineTags.has(nodeName)) {
            return true;
        }
        if (this.inlineTagsSet.has(nodeName) && (node as HTMLElement).style) {
            const style: CSSStyleDeclaration = (node as HTMLElement).style;
            return style.textDecoration === 'underline' || (style as any).textDecorationLine === 'underline';
        }
        return false;
    }

    /**
     * isStrikethrough method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isStrikethrough(node: Node): boolean {
        const nodeName: string = node.nodeName.toLowerCase();
        if (this.validStrikethroughTags.has(nodeName)) {
            return true;
        }
        if (this.inlineTagsSet.has(nodeName) && (node as HTMLElement).style) {
            const style: CSSStyleDeclaration = (node as HTMLElement).style;
            return style.textDecoration === 'line-through' || (style as any).textDecorationLine === 'line-through';
        }
        return false;
    }

    /**
     * isSuperscript method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isSuperscript(node : Node): boolean {
        return this.validSuperscriptTags.has(node.nodeName.toLowerCase());
    }

    /**
     * isSubscript method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isSubscript(node : Node): boolean {
        return this.validSubscriptTags.has(node.nodeName.toLowerCase());
    }

    /**
     * isInlineCode method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isInlineCode(node : Node): boolean {
        const nodeName: string = node.nodeName.toLowerCase();
        if (this.validInlineCodeTags.has(nodeName)) {
            return true;
        }
        return false;
    }

    /**
     * isLink method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isLink(node : Node): boolean {
        return (node as HTMLElement).tagName === 'A' && (node as HTMLElement).hasAttribute('href');
    }

    public static getLinkUrl(node : Node): string {
        const url: string = (node as HTMLElement).getAttribute('href');
        return url;
    }

    public static getFontColor(node : Node): string {
        const color: string = this.getStyleProperty(node, 'color');
        return this.normalizeColor(color);
    }

    public static getBackgroundColor(node : Node): string {
        const color: string = this.getStyleProperty(node, 'backgroundColor');
        return this.normalizeColor(color);
    }

    private static getStyleProperty(node: Node, property: 'color' | 'backgroundColor'): string {
        const nodeName: string = node.nodeName.toLowerCase();
        if (this.inlineTagsSet.has(nodeName) && (node as HTMLElement).style) {
            return (node as HTMLElement).style[property as any] || '';
        }
        return '';
    }

    /**
     * Converts RGB/RGBA color to hex format. If already hex or other format, returns as-is.
     *
     * @param {string} color - The color string (e.g., 'rgb(255, 0, 0)' or '#FF0000')
     * @returns {string} - The normalized color in hex format
     */
    private static normalizeColor(color: string): string {
        if (!color) { return ''; }

        // If already hex format, return as-is
        if (color.startsWith('#')) { return color.toUpperCase(); }

        // Handle rgb(...) or rgba(...) by simple parsing (avoid complex regex to prevent unsafe-regex lint)
        if (color.startsWith('rgb')) {
            const start: number = color.indexOf('(');
            const end: number = color.lastIndexOf(')');
            if (start > -1 && end > start) {
                const parts: string[] = color.substring(start + 1, end).split(',').map((p: string) => p.trim());
                const r: number = parseInt(parts[0] || '0', 10);
                const g: number = parseInt(parts[1] || '0', 10);
                const b: number = parseInt(parts[2] || '0', 10);
                const toHex: (n: number) => string = (n: number) => {
                    const hex: string = n.toString(16).toUpperCase();
                    return hex.length === 1 ? '0' + hex : hex;
                };
                if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
                }
            }
        }

        // No match or not rgb/rgba, return as-is

        // Return as-is if not recognized format
        return color;
    }

    /**
     * Check if a node has a specific format by traversing UP the DOM tree.
     *
     * @param {Node} node - The node to check
     * @param {string} format - The format to search for
     * @param {Node} endNode - Stop traversing at this node (usually block boundary)
     * @returns {HTMLElement | null} - The format element if found, null otherwise
     */
    public static getFormattedNode(
        node: Node,
        format: string,
        endNode?: Node
    ): HTMLElement | null {
        let element: HTMLElement = node.nodeType === Node.TEXT_NODE
            ? node.parentElement
            : node as HTMLElement;

        while (element && (endNode === undefined || element !== endNode)) {
            if (this.isFormattedNode(element, format)) {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    }

    /**
     * Count how many nodes in an array have a specific format.
     *
     * Used for deciding: apply or remove?
     * - If count === nodes.length: all have format → remove
     * - If count < nodes.length: some lack format → apply
     *
     * @param {Node[]} nodes - Array of nodes to check
     * @param {string} format - Format to count
     * @param {Node} endNode - Stop traversing at this node
     * @returns {number} - Count of nodes with the format
     */
    public static countFormatted(
        nodes: Node[],
        format: string,
        endNode?: Node
    ): number {
        let count: number = 0;
        for (const node of nodes) {
            const isMentionNode: HTMLElement = findClosestParent(node, '.e-mention-chip');
            if (this.getFormattedNode(node, format, endNode) || isMentionNode) {
                count++;
            }
        }
        return count;
    }

    /**
     * Checks if a given HTMLElement has the specified format applied.
     *
     * @param {HTMLElement} element - The element to check
     * @param {string} format - The format to verify
     * @returns {boolean} - True if the element has the format, false otherwise
     */
    public static isFormattedNode(element: HTMLElement, format: string): boolean {
        if (!element || !element.tagName) {
            return false;
        }

        switch (format) {
        case 'bold':
            return FormattingHelper.isBold(element);
        case 'italic':
            return FormattingHelper.isItalic(element);
        case 'underline':
            return FormattingHelper.isUnderline(element);
        case 'strikethrough':
            return FormattingHelper.isStrikethrough(element);
        case 'subscript':
            return FormattingHelper.isSubscript(element);
        case 'superscript':
            return FormattingHelper.isSuperscript(element);
        case 'inlineCode':
            return FormattingHelper.isInlineCode(element);
        case 'color':
            return !!FormattingHelper.getFontColor(element);
        case 'backgroundColor':
            return !!FormattingHelper.getBackgroundColor(element);
        case 'uppercase':
            return element.style.textTransform === 'uppercase';
        case 'lowercase':
            return element.style.textTransform === 'lowercase';
        case 'link':
            return FormattingHelper.isLink(element);
        default:
            return false;
        }
    }

    /**
     * Determine if should apply or remove format
     * Based on whether all selected nodes have the format
     *
     * @param {Node[]} nodes - Nodes to perform check
     * @param {string} format - format to toggle
     * @param {Node} endNode - Optional node to limit traversal
     * @returns {boolean} - Whether to remove format or not
     */
    public static shouldRemoveFormat(
        nodes: Node[],
        format: string,
        endNode?: Node
    ): boolean {
        // Value-based styles should never be "removed" in the toggle sense
        // They should be replaced with a new value instead
        const valueBasedFormats: string[] = ['color', 'backgroundColor', 'link'];
        if (valueBasedFormats.indexOf(format as string) !== -1) {
            return false; // Never auto-remove; let applyFormat handle the replacement
        }

        // For boolean styles (bold, italic, underline, etc.): remove if all nodes have it
        const formattedCount: number = this.countFormatted(nodes, format, endNode);
        return formattedCount === nodes.length;
    }
}
