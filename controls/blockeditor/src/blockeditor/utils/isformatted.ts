/**
 * Is formatted or not.
 *
 * @hidden
 */
export class FormattingHelper {
    // Get Formatted Node
    public static inlineTags: string[] = [
        'a',
        'abbr',
        'acronym',
        'b',
        'bdo',
        'big',
        'cite',
        'code',
        'dfn',
        'em',
        'font',
        'i',
        'kbd',
        'label',
        'q',
        'samp',
        'small',
        'span',
        'strong',
        'sub',
        'sup',
        'tt',
        'u',
        'var',
        'del'
    ];

    /**
     * isBold method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isBold(node : Node): boolean {
        const validTags : string[] = ['strong', 'b'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        } else if (this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 && (node as HTMLElement).style) {
            const fontWeight: string = (node as HTMLElement).style.fontWeight;
            if (fontWeight &&
                (fontWeight === 'bold' || parseInt(fontWeight.toString(), 10) >= 600)) {
                return true;
            }
            else { return false; }
        } else {
            return false;
        }
    }

    /**
     * isItalic method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isItalic(node : Node): boolean {
        const validTags : string[] = ['em', 'i'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        } else if (this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        (node as HTMLElement).style && (node as HTMLElement).style.fontStyle === 'italic') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * isUnderline method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isUnderline(node : Node): boolean {
        const validTags : string[] = ['u'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        /* eslint-disable */
        } else if (this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        (node as HTMLElement).style && ((node as HTMLElement).style.textDecoration === 'underline' ||
        ((node as HTMLElement).style as any).textDecorationLine === 'underline')) {
        /* eslint-enable */
            return true;
        } else {
            return false;
        }
    }

    /**
     * isStrikethrough method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isStrikethrough(node : Node): boolean {
        const validTags: string[] = ['del', 'strike', 's'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        /* eslint-disable */
        } else if (this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        (node as HTMLElement).style && ((node as HTMLElement).style.textDecoration === 'line-through' ||
        ((node as HTMLElement).style as any).textDecorationLine === 'line-through')) {
        /* eslint-enable */
            return true;
        } else {
            return false;
        }
    }

    /**
     * isSuperscript method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isSuperscript(node : Node): boolean {
        const validTags : string[] = ['sup'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * isSubscript method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     */
    public static isSubscript(node : Node): boolean {
        const validTags : string[] = ['sub'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        } else {
            return false;
        }
    }

    public static getFontColor(node : Node): string {
        const color: string = (node as HTMLElement).style && (node as HTMLElement).style.color;
        if (FormattingHelper.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        color !== null && color !== '' && color !== undefined ) {
            return color;
        } else {
            return '';
        }
    }

    public static getBackgroundColor(node : Node): string {
        const bgColor: string = (node as HTMLElement).style && (node as HTMLElement).style.backgroundColor;
        if (FormattingHelper.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        bgColor !== null && bgColor !== '' && bgColor !== undefined ) {
            return bgColor;
        } else {
            return '';
        }
    }
}
