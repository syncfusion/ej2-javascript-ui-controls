export abstract class _HTMLElement {
    tagName: string;

    _parentNode: _HTMLElement | null = null;

    _childNodes: _HTMLElement[] = [];

    _previousSibling: _HTMLElement | null = null;

    _nextSibling: _HTMLElement | null = null;

    _attributes: Map<string, string> = new Map();

    _styles: Record<string, string> = {};

    _text: string = '';

    protected constructor(tagName: string) {
        this.tagName = tagName.toLowerCase();
    }

    /**
     * Get all text content of this element and its descendants.
     *
     * @returns {string} The combined text content
     * @private
     */
    get textContent(): string {
        let result: string = this._text;
        for (const child of this._childNodes) {
            result += child.textContent;
        }
        return result;
    }

    /**
     * Get HTML content of this element's children.
     *
     * @returns {string} The inner HTML content
     * @private
     */
    get innerHTML(): string {
        return this._childNodes.map((node: _HTMLElement) => node.outerHTML).join('');
    }

    /**
     * Get the HTML representation of this element.
     *
     * @returns {string} The outer HTML string
     * @private
     */
    get outerHTML(): string {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const attrs: string = Array.from(this._attributes.entries())
            .map(([key, value]: [string, string]) => `${key}="${value}"`)
            .join(' ');
        const attrsStr: string = attrs ? ` ${attrs}` : '';
        return `<${this.tagName}${attrsStr}>${this._text}${this.innerHTML}</${this.tagName}>`;
    }

    /**
     * Get the first child element.
     *
     * @returns {_HTMLElement|null} The first child element or null
     * @private
     */
    get firstChild(): _HTMLElement | null {
        return this._childNodes.length > 0 ? this._childNodes[0] : null;
    }

    /**
     * Get the last child element.
     *
     * @returns {_HTMLElement|null} The last child element or null
     * @private
     */
    get lastChild(): _HTMLElement | null {
        return this._childNodes.length > 0 ? this._childNodes[this._childNodes.length - 1] : null;
    }

    /**
     * Append a child element.
     *
     * @param {_HTMLElement} child - The child element to append
     * @returns {void}
     * @private
     */
    appendChild(child: _HTMLElement): void {
        if (child._parentNode) {
            child._parentNode.removeChild(child);
        }
        child._parentNode = this;
        child._previousSibling = this.lastChild;
        if (this.lastChild) {
            this.lastChild._nextSibling = child;
        }
        child._nextSibling = null;
        this._childNodes.push(child);
    }

    /**
     * Remove a child element.
     *
     * @param {_HTMLElement} child - The child element to remove
     * @returns {void}
     * @private
     */
    removeChild(child: _HTMLElement): void {
        const index: number = this._childNodes.indexOf(child);
        if (index !== -1) {
            this._childNodes.splice(index, 1);
            if (child._previousSibling) {
                child._previousSibling._nextSibling = child._nextSibling;
            }
            if (child._nextSibling) {
                child._nextSibling._previousSibling = child._previousSibling;
            }
            child._parentNode = null;
            child._previousSibling = null;
            child._nextSibling = null;
        }
    }

    /**
     * Set an attribute value.
     *
     * @param {string} name - The attribute name
     * @param {string} value - The attribute value
     * @returns {void}
     * @private
     */
    setAttribute(name: string, value: string): void {
        this._attributes.set(name.toLowerCase(), value);
    }

    /**
     * Get an attribute value.
     *
     * @param {string} name - The attribute name
     * @returns {string|null} The attribute value or null
     * @private
     */
    getAttribute(name: string): string | null {
        return this._attributes.get(name.toLowerCase()) || null;
    }

    /**
     * Check if an attribute exists.
     *
     * @param {string} name - The attribute name
     * @returns {boolean} True if the attribute exists
     * @private
     */
    hasAttribute(name: string): boolean {
        return this._attributes.has(name.toLowerCase());
    }

    /**
     * Get computed styles for this element.
     * Provides access to internal _styles via public property.
     *
     * @returns {Record<string, string>} The computed styles
     * @private
     */
    get styles(): Record<string, string> {
        return this._styles || {};
    }
}

/**
 * HTML Body element with stylesheet support.
 */
export class _HTMLBodyElement extends _HTMLElement {
    /**
     * Stylesheets extracted from <style> elements.
     *
     * @private
     */
    styleSheets: string[] = [];

    constructor() {
        super('body');
    }

    /**
     * Add a stylesheet from a <style> element.
     *
     * @param cssText - The CSS text content
     * @private
     */
    addStyleSheet(cssText: string): void {
        this.styleSheets.push(cssText);
    }

    /**
     * Get all stylesheets.
     *
     * @returns Array of CSS text strings
     * @private
     */
    getStyleSheets(): string[] {
        return [...this.styleSheets];
    }
}

/**

 */
export class _HTMLParagraphElement extends _HTMLElement {
    constructor() {
        super('p');
    }
}

/**

 */
export class _HTMLTableElement extends _HTMLElement {
    constructor() {
        super('table');
    }
}

/**

 */
export class _HTMLTableRowElement extends _HTMLElement {
    constructor() {
        super('tr');
    }
}

/**

 */
export class _HTMLTableCellElement extends _HTMLElement {
    constructor(tagName: string) {
        super(tagName);
    }
}

/**

 */
export class _HTMLUnorderedListElement extends _HTMLElement {
    constructor() {
        super('ul');
    }
}

/**

 */
export class _HTMLOrderedListElement extends _HTMLElement {
    constructor() {
        super('ol');
    }
}

/**

 */
export class _HTMLListItemElement extends _HTMLElement {
    constructor() {
        super('li');
    }
}

/**

 */
export class _HTMLImageElement extends _HTMLElement {
    // Basic image properties

    src: string | null = null;

    width: number | null = null;

    height: number | null = null;

    alt: string | null = null;

    title: string | null = null;

    /**
     * Resolved image bytes (PNG or JPEG).
     * Set by the HTML parser after downloading/extracting the image.
     *
     * @private
     */
    _resolvedImageBytes: Uint8Array | undefined;

    // Alignment and layout properties

    align?: 'left' | 'center' | 'right' | 'top' | 'bottom' | 'middle' | 'texttop' | 'textmiddle' | 'textbottom';

    border?: number;

    hspace?: number;

    vspace?: number;

    // Identity and metadata

    id?: string;

    loading?: 'lazy' | 'eager';

    // Responsive image support

    srcset?: string;

    sizes?: string;

    // CSS style effects

    opacity?: number;

    rotation?: number;

    flipHorizontal?: boolean;

    flipVertical?: boolean;

    // Custom data attributes

    customData?: Record<string, string>;

    constructor() {
        super('img');
    }

    /**
     * Synchronize HTML attributes with typed properties.
     *
     * @returns {void}
     * @private
     */
    syncFromAttributes(): void {
        this.src = this.getAttribute('src');

        const widthAttr: string | null = this.getAttribute('width');
        this.width = widthAttr ? parseInt(widthAttr, 10) : null;

        const heightAttr: string | null = this.getAttribute('height');
        this.height = heightAttr ? parseInt(heightAttr, 10) : null;

        this.alt = this.getAttribute('alt');
        this.title = this.getAttribute('title');

        const alignAttr: string | null = this.getAttribute('align');
        if (alignAttr) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.align = alignAttr as any;
        }

        const borderAttr: string | null = this.getAttribute('border');
        this.border = borderAttr ? parseInt(borderAttr, 10) : undefined;

        const hspaceAttr: string | null = this.getAttribute('hspace');
        this.hspace = hspaceAttr ? parseInt(hspaceAttr, 10) : undefined;

        const vspaceAttr: string | null = this.getAttribute('vspace');
        this.vspace = vspaceAttr ? parseInt(vspaceAttr, 10) : undefined;

        const idAttr: string | null = this.getAttribute('id');
        this.id = idAttr || undefined;

        const loadingAttr: string | null = this.getAttribute('loading');
        if (loadingAttr === 'lazy' || loadingAttr === 'eager') {
            this.loading = loadingAttr;
        }

        const srcsetAttr: string | null = this.getAttribute('srcset');
        this.srcset = srcsetAttr || undefined;

        const sizesAttr: string | null = this.getAttribute('sizes');
        this.sizes = sizesAttr || undefined;
    }

    /**
     * Get image source as data URL or return src attribute.
     *
     * @returns {string|null} The image source URL or null
     * @private
     */
    getImageSource(): string | null {
        return this.src;
    }

    /**
     * Get image dimensions as object.
     *
     * @returns {Object} Object with width and height properties
     * @private
     */
    getDimensions(): { width: number | null; height: number | null } {
        return {
            width: this.width,
            height: this.height
        };
    }

    /**
     * Get alignment values.
     *
     * @returns {Object} Object with horizontal and vertical alignment values
     * @private
     */
    getAlignment(): { horizontal?: string; vertical?: string } {
        const result: { horizontal?: string; vertical?: string } = {};

        if (this.align) {
            const horizontalAlignments: string[] = ['left', 'center', 'right'];
            const verticalAlignments: string[] = ['top', 'bottom', 'middle', 'texttop', 'textmiddle', 'textbottom'];

            if (horizontalAlignments.indexOf(this.align) !== -1) {
                result.horizontal = this.align;
            }
            if (verticalAlignments.indexOf(this.align) !== -1) {
                result.vertical = this.align;
            }
        }

        return result;
    }

    /**
     * Check if image has responsive attributes.
     *
     * @returns {boolean} True if the image has responsive attributes
     * @private
     */
    isResponsive(): boolean {
        return !!(this.srcset || this.sizes);
    }

    /**
     * Check if image has CSS effects applied.
     *
     * @returns {boolean} True if the image has CSS effects
     * @private
     */
    hasCSSEffects(): boolean {
        return !!(this.opacity !== undefined || this.rotation !== undefined ||
              this.flipHorizontal || this.flipVertical);
    }
}

/**

 */
export class _HTMLBrElement extends _HTMLElement {
    constructor() {
        super('br');
    }

    /**
     * Override outerHTML to render self-closing br tag
     *
     * @returns {string} The self-closing br tag
     * @private
     */
    get outerHTML(): string {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const attrs: string = Array.from((this as any)._attributes.entries())
            .map(([key, value]: [string, string]) => `${key}="${value}"`)
            .join(' ');
        const attrsStr: string = attrs ? ` ${attrs}` : '';
        return `<br${attrsStr} />`;
    }
}

/**

 */
export class _HTMLHrElement extends _HTMLElement {
    constructor() {
        super('hr');
    }

    /**
     * Override outerHTML to render self-closing hr tag
     *
     * @returns {string} The self-closing hr tag
     * @private
     */
    get outerHTML(): string {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const attrs: string = Array.from((this as any)._attributes.entries())
            .map(([key, value]: [string, string]) => `${key}="${value}"`)
            .join(' ');
        const attrsStr: string = attrs ? ` ${attrs}` : '';
        return `<hr${attrsStr} />`;
    }
}

/**

 */
export class _HTMLWbrElement extends _HTMLElement {
    constructor() {
        super('wbr');
    }
    /**
     * Override outerHTML to render self-closing wbr tag
     *
     * @returns {string} The self-closing wbr tag
     * @private
     */
    get outerHTML(): string {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const attrs: string = Array.from((this as any)._attributes.entries())
            .map(([key, value]: [string, string]) => `${key}="${value}"`)
            .join(' ');
        const attrsStr: string = attrs ? ` ${attrs}` : '';
        return `<wbr${attrsStr} />`;
    }
}

/**

 */
export class _HTMLHeadingElement extends _HTMLElement {
    /**
     * Get the heading level (1-6) from the tag name (h1-h6).
     *
     * @returns {number} The heading level (1-6)
     * @private
     */
    get level(): number {
        const tagName: string = this.tagName.toLowerCase();
        if (tagName.match(/^h[1-6]$/)) {
            return parseInt(tagName.charAt(1), 10);
        }
        return 1; // Default to Heading 1
    }

    constructor(tagName: string) {
        super(tagName);
    }
}

/**
 * HTML Div element.
 */
export class _HTMLDivElement extends _HTMLElement {
    constructor() {
        super('div');
    }
}

/**
 * HTML Span element.
 */
export class _HTMLSpanElement extends _HTMLElement {
    constructor() {
        super('span');
    }
}

/**
 * HTML Anchor element.
 */
export class _HTMLAnchorElement extends _HTMLElement {
    /**
     * Get the href attribute value.
     *
     * @returns {string|null} The href URL or null
     * @private
     */
    get href(): string | null {
        return this.getAttribute('href');
    }

    /**
     * Set the href attribute value.
     *
     * @param {string} value - The href URL
     * @private
     */
    set href(value: string) {
        this.setAttribute('href', value);
    }

    /**
     * Get the target attribute value.
     *
     * @returns {string|null} The target value or null
     * @private
     */
    get target(): string | null {
        return this.getAttribute('target');
    }

    /**
     * Set the target attribute value.
     *
     * @param {string} value - The target value
     * @private
     */
    set target(value: string) {
        this.setAttribute('target', value);
    }

    /**
     * Get the title attribute value.
     *
     * @returns {string|null} The title or null
     * @private
     */
    get title(): string | null {
        return this.getAttribute('title');
    }

    /**
     * Set the title attribute value.
     *
     * @param {string} value - The title
     * @private
     */
    set title(value: string) {
        this.setAttribute('title', value);
    }

    constructor() {
        super('a');
    }
}

/**
 * HTML Subscript element.
 */
export class _HTMLSubElement extends _HTMLElement {
    constructor() {
        super('sub');
    }
}

/**
 * HTML Superscript element.
 */
export class _HTMLSupElement extends _HTMLElement {
    constructor() {
        super('sup');
    }
}

/**
 * HTML Code element.
 */
export class _HTMLCodeElement extends _HTMLElement {
    constructor() {
        super('code');
    }
}

/**
 * HTML Bold element (b tag).
 */
export class _HTMLBElement extends _HTMLElement {
    constructor() {
        super('b');
    }
}

/**
 * HTML Strong element.
 */
export class _HTMLStrongElement extends _HTMLElement {
    constructor() {
        super('strong');
    }
}

/**
 * HTML Emphasis element (em tag).
 */
export class _HTMLEmElement extends _HTMLElement {
    constructor() {
        super('em');
    }
}

/**
 * HTML Italic element (i tag).
 */
export class _HTMLIElement extends _HTMLElement {
    constructor() {
        super('i');
    }
}

/**
 * HTML Underline element (u tag).
 */
export class _HTMLUElement extends _HTMLElement {
    constructor() {
        super('u');
    }
}

/**
 * Generic HTML element for unrecognized or custom tags.
 */
export class _HTMLGenericElement extends _HTMLElement {
    constructor(tagName: string) {
        super(tagName);
    }
}

/**
 * HTML Text node representing text content.
 */
export class _HTMLTextNode extends _HTMLElement {

    nodeType: number = 3; // TEXT_NODE

    constructor(textContent: string) {
        super('#text');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)._text = textContent;
    }

    /**
     * Get text content of this node.
     *
     * @returns {string} The text content

     * @private
     */
    get textContent(): string {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (this as any)._text as string;
    }

    /**
     * Get the HTML representation of this text node.
     *
     * @returns {string} The escaped text content

     * @private
     */
    get outerHTML(): string {
    // Text nodes don't have HTML representation, just return escaped text
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const text: string = (this as any)._text as string;
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}

/**
 * Blockquote element for indented quoted content
 *
 * @private
 */
export class _HTMLBlockquoteElement extends _HTMLElement {
    constructor() {
        super('blockquote');
    }
}

/**
 * Center element for center-aligned content
 *
 * @private
 */
export class _HTMLCenterElement extends _HTMLElement {
    constructor() {
        super('center');
    }
}

/**
 * Font element for color and size attributes
 *
 * @private
 */
export class _HTMLFontElement extends _HTMLElement {
    constructor() {
        super('font');
    }
}

/**
 * Sample element for monospace output formatting
 *
 * @private
 */
export class _HTMLSampElement extends _HTMLElement {
    constructor() {
        super('samp');
    }
}
