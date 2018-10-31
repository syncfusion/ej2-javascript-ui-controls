/**
 * Is formatted or not.
 * @hidden
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
    'var'   ];

    public getFormattedNode(node: Node, format: string, endNode: Node ): Node {
        let parentNode: Node = this.getFormatParent(node, format, endNode);
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
            default:
                return false;
        }
    }


    public static isBold(node : Node): boolean {
        let validTags : string[] = ['strong', 'b'];
        if ( validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        } else if ( this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        (node as HTMLElement).style && (node as HTMLElement).style.fontWeight === 'bold') {
            return true;
        } else {
            return false;
        }
    }

    public static isItalic(node : Node): boolean {
        let validTags : string[] = ['em', 'i'];
        if ( validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        } else if ( this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        (node as HTMLElement).style && (node as HTMLElement).style.fontStyle === 'italic') {
            return true;
        } else {
            return false;
        }
    }

    public static isUnderline(node : Node): boolean {
        let validTags : string[] = ['u'];
        if ( validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        } else if ( this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        (node as HTMLElement).style && (node as HTMLElement).style.textDecoration === 'underline') {
            return true;
        } else {
            return false;
        }
    }

    public static isStrikethrough(node : Node): boolean {
        let validTags : string[] = ['del', 'strike'];
        if ( validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        } else if (this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        (node as HTMLElement).style && (node as HTMLElement).style.textDecoration === 'line-through') {
            return true;
        } else {
            return false;
        }
    }

    public static isSuperscript(node : Node): boolean {
        let validTags : string[] = ['sup'];
        if ( validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        } else {
            return false;
        }
    }

    public static isSubscript(node : Node): boolean {
        let validTags : string[] = ['sub'];
        if ( validTags.indexOf(node.nodeName.toLowerCase()) !== -1 ) {
            return true;
        } else {
            return false;
        }
    }

    private isFontColor(node : Node): boolean {
        let color: string = (node as HTMLElement).style && (node as HTMLElement).style.color;
        if (  IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        color !== null && color !== '' && color !== undefined ) {
            return true;
        } else {
            return false;
        }
    }

    private isBackgroundColor(node : Node): boolean {
        let backColor: string = (node as HTMLElement).style && (node as HTMLElement).style.backgroundColor;
        if ( IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        backColor !== null && backColor !== '' && backColor !== undefined ) {
            return true;
        } else {
            return false;
        }
    }

    private isFontSize(node : Node): boolean {
        let size: string = (node as HTMLElement).style && (node as HTMLElement).style.fontSize;
        if (  IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        size !== null && size !== '' && size !== undefined ) {
            return true;
        } else {
            return false;
        }
    }

    private isFontName(node : Node): boolean {
        let name: string = (node as HTMLElement).style && (node as HTMLElement).style.fontFamily;
        if ( IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
        name !== null && name !== '' && name !== undefined ) {
            return true;
        } else {
            return false;
        }
    }
}