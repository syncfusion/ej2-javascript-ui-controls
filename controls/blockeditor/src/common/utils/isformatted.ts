/**
 * Helper class to check whether a node has particular format or not
 *
 * @hidden
 */
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

    public static getFontColor(node : Node): string {
        return this.getStyleProperty(node, 'color');
    }

    public static getBackgroundColor(node : Node): string {
        return this.getStyleProperty(node, 'backgroundColor');
    }

    private static getStyleProperty(node: Node, property: 'color' | 'backgroundColor'): string {
        const nodeName: string = node.nodeName.toLowerCase();
        if (this.inlineTagsSet.has(nodeName) && (node as HTMLElement).style) {
            return (node as HTMLElement).style[property as any] || '';
        }
        return '';
    }
}
