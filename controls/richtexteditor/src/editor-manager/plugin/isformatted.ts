/**
 * Is formatted or not.
 *
 * @hidden
 * @deprecated
 */
export class IsFormatted {
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
     * getFormattedNode method
     *
     * @param {Node} node - specifies the node.
     * @param {string} format - specifies the string value.
     * @param {Node} endNode - specifies the end node
     * @returns {Node} - returns the node
     * @hidden
     * @deprecated
     */
    public getFormattedNode(node: Node, format: string, endNode: Node ): Node {
        const parentNode: Node = this.getFormatParent(node, format, endNode);
        if (parentNode !== null && parentNode !== endNode) {
            return parentNode;
        }
        return null;
    }

    private getFormatParent(node: Node, format: string, endNode: Node ): Node {
        do {
            node = node.parentNode;
        }
        while (node && (node !== endNode) && !this.isFormattedNode(node, format));
        return node;
    }

    private isFormattedNode(node: Node, format: string): boolean {
        switch (format) {
        case 'bold':
            return IsFormatted.isBold(node);
        case 'italic':
            return IsFormatted.isItalic(node);
        case 'underline':
            return IsFormatted.isUnderline(node);
        case 'strikethrough':
            return IsFormatted.isStrikethrough(node);
        case 'superscript':
            return IsFormatted.isSuperscript(node);
        case 'subscript':
            return IsFormatted.isSubscript(node);
        case 'fontcolor':
            return this.isFontColor(node);
        case 'fontname':
            return this.isFontName(node);
        case 'fontsize':
            return this.isFontSize(node);
        case 'backgroundcolor':
            return this.isBackgroundColor(node);
        case 'inlinecode':
            return IsFormatted.isCode(node);
        default:
            return false;
        }
    }

    /**
     * isBold method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     * @deprecated
     */
    public static isBold(node : Node): boolean {
        const validTags : string[] = ['strong', 'b'];
        if ( validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        } else if ( this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        (node as HTMLElement).style && (node as HTMLElement).style.fontWeight === 'bold') {
            return true;
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
     * @deprecated
     */
    public static isItalic(node : Node): boolean {
        const validTags : string[] = ['em', 'i'];
        if ( validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        } else if ( this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
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
     * @deprecated
     */
    public static isUnderline(node : Node): boolean {
        const validTags : string[] = ['u'];
        if ( validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        /* eslint-disable */
        } else if ( this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
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
     * @deprecated
     */
    public static isStrikethrough(node : Node): boolean {
        const validTags: string[] = ['del', 'strike', 's'];
        if ( validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
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
     * @deprecated
     */
    public static isSuperscript(node : Node): boolean {
        const validTags : string[] = ['sup'];
        if ( validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
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
     * @deprecated
     */
    public static isSubscript(node : Node): boolean {
        const validTags : string[] = ['sub'];
        if ( validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        } else {
            return false;
        }
    }

    private isFontColor(node : Node): boolean {
        const color: string = (node as HTMLElement).style && (node as HTMLElement).style.color;
        if (  IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        color !== null && color !== '' && color !== undefined ) {
            return true;
        } else {
            return false;
        }
    }

    private isBackgroundColor(node : Node): boolean {
        const backColor: string = (node as HTMLElement).style && (node as HTMLElement).style.backgroundColor;
        if ( IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        backColor !== null && backColor !== '' && backColor !== undefined ) {
            return true;
        } else {
            return false;
        }
    }

    private isFontSize(node : Node): boolean {
        const size: string = (node as HTMLElement).style && (node as HTMLElement).style.fontSize;
        if (  IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        size !== null && size !== '' && size !== undefined ) {
            return true;
        } else {
            return false;
        }
    }

    private isFontName(node : Node): boolean {
        const name: string = (node as HTMLElement).style && (node as HTMLElement).style.fontFamily;
        if ( IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        name !== null && name !== '' && name !== undefined ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * isCode method
     *
     * @param {Node} node - specifies the node value
     * @returns {boolean} - returns the boolean value
     * @hidden
     * @deprecated
     */
    public static isCode(node: Node): boolean {
        const validTags: string[] = ['code'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        } else {
            return false;
        }
    }
}
