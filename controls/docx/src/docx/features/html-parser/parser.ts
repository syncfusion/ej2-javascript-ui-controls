/**
 * @private
 */

import {
    _HTMLElement,
    _HTMLBodyElement,
    _HTMLParagraphElement,
    _HTMLHeadingElement,
    _HTMLTableElement,
    _HTMLTableRowElement,
    _HTMLTableCellElement,
    _HTMLUnorderedListElement,
    _HTMLOrderedListElement,
    _HTMLListItemElement,
    _HTMLImageElement,
    _HTMLBrElement,
    _HTMLHrElement,
    _HTMLWbrElement,
    _HTMLDivElement,
    _HTMLSpanElement,
    _HTMLAnchorElement,
    _HTMLSubElement,
    _HTMLSupElement,
    _HTMLCodeElement,
    _HTMLBElement,
    _HTMLStrongElement,
    _HTMLEmElement,
    _HTMLIElement,
    _HTMLUElement,
    _HTMLGenericElement,
    _HTMLTextNode,
    _HTMLBlockquoteElement,
    _HTMLCenterElement,
    _HTMLFontElement,
    _HTMLSampElement
} from './dom-node.js';
import { parseInlineStyles } from './style-parser.js';
import { _CSSProcessor } from './css-processor.js';
import { sniffImageContentType } from '../images/image-sniff.js';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _CSSRule = any;

/**
 * @private
 */
export class _HTMLParser {
    private _html: string;
    private _position: number = 0;

    constructor(html: string) {
        this._html = html || '';
    }

    /**
     * Process CSS styles on an element tree.
     * This is a static utility method that can be called on any element tree,
     * whether created by the parser or directly in code.
     * Useful when elements are created programmatically without going through the parser.
     *
     * @param element - Root element to process (typically body or any container)
     * @returns void
     * @private
     */
    static processElementStyles(element: _HTMLElement): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const htmlElement = element as any;
        
        // Get stylesheets from element (if it's a body element)
        if (!htmlElement.styleSheets || !Array.isArray(htmlElement.styleSheets)) {
            return;
        }
        
        const styleSheets: string[] = htmlElement.styleSheets;
        
        // Parse all CSS rules
        const allRules: _CSSRule[] = [];
        for (const styleText of styleSheets) {
            try {
                const rules = _CSSProcessor.parseCSS(styleText);
                allRules.push(...rules);
            } catch (error) {
                console.warn('Error parsing CSS rules:', error);
            }
        }
        
        // Store parsed rules in element for later access
        htmlElement.cssRules = allRules;
        
        // Apply styles to all elements in the tree
        this._applyStylesToElementTree(element, allRules);
    }

    /**
     * Recursively apply CSS rules to all elements in a tree.
     * Static version for use with programmatically-created elements.
     *
     * @param element - Current element to process
     * @param rules - Array of CSS rules to apply
     * @returns void
     * @private
     */
    private static _applyStylesToElementTree(element: _HTMLElement, rules: _CSSRule[]): void {
        // Apply styles to this element
        _CSSProcessor.applyStylesToElement(element, rules);
        
        // Recursively apply to children
        for (const child of element._childNodes) {
            this._applyStylesToElementTree(child, rules);
        }
    }

    /**
     * Parse the HTML string and return the root element.
     *
     * @returns {_HTMLElement} The root _HTMLBodyElement or _HTMLElement
     * @private
     */
    parse(): _HTMLElement {
    // Find or create body element
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const body: _HTMLElement | null = null;
        const rootElement: _HTMLElement = new _HTMLBodyElement();

        // First, collect stylesheets from <head> section
        this._collectStylesheetsFromHead(rootElement);

        // Skip to body if html/body elements are present
        const bodyMatch: RegExpMatchArray | null = this._html.match(/<body[^>]*>/i);
        const bodyStart: number = bodyMatch ? this._html.indexOf(bodyMatch[0]) + bodyMatch[0].length : 0;
        const bodyEnd: number = this._html.lastIndexOf('</body>');
        const contentToparse: string = bodyEnd > bodyStart ? this._html.substring(bodyStart, bodyEnd) : this._html;

        // Parse body content
        this.parseChildren(rootElement, contentToparse);

        // Parse and apply CSS rules from stylesheets
        this._parseAndApplyCSS(rootElement);

        // The <body> tag's own style attribute is inherited by its descendants
        if (bodyMatch) {
            const bodyAttrs: RegExpMatchArray | null = bodyMatch[0].match(/^<body([\s\S]*)>$/i);
            if (bodyAttrs) {
                this.parseAttributes(rootElement, bodyAttrs[1].trim());
                this._inheritBodyStyles(rootElement);
            }
        }

        return rootElement;
    }

    /**
     * Async parse: Parse HTML and resolve all image bytes during parsing.
     * This ensures all <img> elements have their bytes pre-resolved before conversion.
     * Allows downstream consumers (DOCX, PDF, etc.) to use the same parsed tree
     * with image bytes already available.
     *
     * @param supplied - Optional pre-supplied image bytes keyed by URL (skip download for these)
     * @returns {Promise<_HTMLElement>} The root element with all images resolved
     * @private
     */
    async parseAsync(supplied?: Record<string, Uint8Array>): Promise<_HTMLElement> {
        const rootElement = this.parse();
        await this._resolveAllImages(rootElement, supplied);
        return rootElement;
    }

    /**
     * Recursively resolve all images in the element tree.
     * Extracts <img src> URLs, downloads/resolves bytes, and stores in element._resolvedImageBytes.
     * Supports: data URIs, http(s) URLs, and caller-supplied bytes.
     *
     * @param element - Root element to process
     * @param supplied - Pre-supplied image bytes keyed by URL (skip download for these)
     * @returns Promise that resolves when all images are processed
     * @private
     */
    private async _resolveAllImages(element: _HTMLElement, supplied?: Record<string, Uint8Array>): Promise<void> {
        // Process this element
        if (element instanceof _HTMLImageElement) {
            await this._resolveImage(element, supplied);
        }

        // Recursively process children
        for (const child of element._childNodes) {
            await this._resolveAllImages(child, supplied);
        }
    }

    /**
     * Resolve a single image element.
     * Tries in order: supplied bytes, data URI, HTTP/HTTPS download, unsupported.
     *
     * @param imgElement - The _HTMLImageElement to resolve
     * @param supplied - Pre-supplied bytes keyed by URL
     * @private
     */
    private async _resolveImage(imgElement: _HTMLImageElement, supplied?: Record<string, Uint8Array>): Promise<void> {
        const src = imgElement.src || imgElement.getAttribute('src');
        if (!src) {
            return; // No src, skip
        }

        // 1. Check if caller supplied this image
        if (supplied && supplied[src]) {
            imgElement._resolvedImageBytes = supplied[src];
            return;
        }

        // 2. Try data URI
        if (src.startsWith('data:')) {
            const bytes = this._decodeDataUri(src);
            if (bytes) {
                imgElement._resolvedImageBytes = bytes;
                return;
            }
        }

        // 3. Try HTTP/HTTPS download
        if (/^https?:\/\//i.test(src)) {
            const bytes = await this._downloadImage(src);
            if (bytes) {
                imgElement._resolvedImageBytes = bytes;
                return;
            }
        }

        // 4. All resolution strategies failed (e.g. HTTP 521, network error).
        // No bytes: the converter will preserve the <img> as alt text.
    }

    /**
     * Download an HTTP/HTTPS image and return the bytes.
     * Validates response, content type, and size.
     *
     * @param url - HTTP/HTTPS URL
     * @returns Image bytes or null if download failed
     * @private
     */
    private async _downloadImage(url: string): Promise<Uint8Array | null> {
        if (typeof fetch !== 'function') {
            return null; // fetch unavailable
        }

        const MAX_SIZE = 10 * 1024 * 1024; // 10 MB limit

        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Silently fail - image will render as alt text
                return null;
            }

            const buffer = await response.arrayBuffer();
            if (buffer.byteLength === 0 || buffer.byteLength > MAX_SIZE) {
                // Silently fail - size check or empty response
                return null;
            }

            const data = new Uint8Array(buffer);
            if (sniffImageContentType(data) === undefined) {
                // Silently fail - not a valid image format
                return null;
            }

            return data;
        } catch (err) {
            // Silently fail - network error, image will render as alt text
            return null;
        }
    }

    /**
     * Decode a data URI to image bytes.
     *
     * @param dataUri - data: URI with base64 encoding
     * @returns Image bytes or null
     * @private
     */
    private _decodeDataUri(dataUri: string): Uint8Array | null {
        try {
            const match = dataUri.match(/^data:[^;]*(;base64)?,(.*)$/);
            if (!match) {
                return null;
            }

            const isBase64 = !!match[1];
            const data = match[2];

            if (isBase64) {
                return this._base64ToBytes(data);
            }

            // URL-encoded data - not commonly used for images, skip
            return null;
        } catch (err) {
            return null;
        }
    }

    /**
     * Decode base64 string to Uint8Array.
     *
     * @param base64 - Base64 encoded string
     * @returns Uint8Array
     * @private
     */
    private _base64ToBytes(base64: string): Uint8Array {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    /**
     * Parse child elements of a parent node.
     *
     * @param {_HTMLElement} parent - The parent HTML element
     * @param {string} html - The HTML string to parse
     * @returns {void}
     * @private
     */
    private parseChildren(parent: _HTMLElement, html: string): void {
        let pos: number = 0;

        while (pos < html.length) {
            // Find next tag
            const nextTag: number = html.indexOf('<', pos);

            if (nextTag === -1) {
                // No more tags, rest is text
                const text: string = html.substring(pos);
                const processedText: string = this.decodeCharacterReferences(text);
                if (processedText) {
                    // Create a text node instead of concatenating into parent.text
                    const textNode: _HTMLTextNode = new _HTMLTextNode(processedText);
                    parent.appendChild(textNode);
                }
                break;
            }

            // Get text before tag
            if (nextTag > pos) {
                const textContent: string = html.substring(pos, nextTag);
                const processedContent: string = this.decodeCharacterReferences(textContent);
                if (processedContent) {
                    // Create a text node for the text before this tag
                    const textNode: _HTMLTextNode = new _HTMLTextNode(processedContent);
                    parent.appendChild(textNode);
                }
            }

            // Parse the tag
            const tagEnd: number = html.indexOf('>', nextTag);
            if (tagEnd === -1) {
                break;
            }

            const tagContent: string = html.substring(nextTag + 1, tagEnd);
            pos = tagEnd + 1;

            // Check if closing tag
            if (tagContent.startsWith('/')) {
                // Browsers ignore a closing tag that does not match the currently
                // open element (e.g. a stray </td> inside <tr>, or </tr> inside
                // <table>). Only stop parsing children when the closing tag matches
                // the parent element; otherwise skip it and keep parsing.
                // eslint-disable-next-line security/detect-non-literal-regexp
                const closeTagName: string = tagContent.substring(1).trim().split(/\s+/)[0].toLowerCase();
                const parentTagName: string = parent.tagName ? parent.tagName.toLowerCase() : '';
                if (closeTagName === parentTagName) {
                    // This is the closing tag of the parent, stop parsing children
                    break;
                }
                // Mismatched closing tag: skip it and continue with the next tag
                continue;
            }

            // Check if self-closing
            const isSelfClosing: boolean = tagContent.endsWith('/') || this.isVoidElement(tagContent.split(/\s+/)[0]);

            if (tagContent.startsWith('!')) {
                // Skip comments and doctype
                continue;
            }

            // Parse opening tag
            // Use /s flag to make . match newlines for multi-line attributes
            const tagMatch: RegExpMatchArray | null = tagContent.match(/^(\w+)([\s\S]*)/);
            if (!tagMatch) {
                continue;
            }

            const tagName: string = tagMatch[1].toLowerCase();
            const attrString: string = tagMatch[2].trim();

            // Create element
            const element: _HTMLElement | null = this.createElementByTag(tagName);
            if (!element) {
                continue;
            }

            // Parse attributes
            this.parseAttributes(element, attrString);

            // Sync attributes to typed properties for image elements
            if (element instanceof _HTMLImageElement) {
                element.syncFromAttributes();
            }

            // Add to parent
            parent.appendChild(element);

            // If not self-closing, parse children recursively
            if (!isSelfClosing) {
                // Find the matching closing tag, accounting for nesting
                const closingTagIndex: number = this.findMatchingClosingTag(html, pos, tagName);

                let childContent: string;
                if (closingTagIndex !== -1) {
                    childContent = html.substring(pos, closingTagIndex);
                } else {
                    // No matching closing tag (unclosed element): parse the rest of the
                    // content as children instead of silently dropping it
                    childContent = html.substring(pos);
                }

                // Special handling for <style> elements
                if (tagName === 'style' && parent instanceof _HTMLBodyElement) {
                    // Store stylesheet in body element
                    parent.addStyleSheet(childContent);
                } else {
                    // Regular parsing for other elements
                    this.parseChildren(element, childContent);
                }

                // Move position past the closing tag
                if (closingTagIndex !== -1) {
                    // eslint-disable-next-line security/detect-non-literal-regexp
                    const closeTagPattern: RegExp = new RegExp(`</\\s*${tagName}\\s*>`, 'i');
                    const closeTagMatch: RegExpExecArray | null = closeTagPattern.exec(html.substring(closingTagIndex));
                    if (closeTagMatch) {
                        pos = closingTagIndex + closeTagMatch[0].length;
                    } else {
                        pos = html.length;
                    }
                } else {
                    pos = html.length;
                }
            }
        }
    }

    /**
     * Parse attributes from tag attribute string.
     * Handles single-quoted, double-quoted, and unquoted attributes with newlines.
     *
     * @param {_HTMLElement} element - The element to set attributes on
     * @param {string} attrString - The attribute string
     * @returns {void}
     * @private
     */
    private parseAttributes(element: _HTMLElement, attrString: string): void {
        if (!attrString) {
            return;
        }

        // Improved attribute parser that handles both single and double quotes
        // Including newlines within attribute values
        // Pattern matches: name="value" or name='value' or name=value (unquoted) or name (boolean)
        // [\s\S] matches any character including newlines
        const attrPattern: RegExp = /(\w+)\s*=\s*"([\s\S]*?)"|(\w+)\s*=\s*'([\s\S]*?)'|(\w+)\s*=\s*([^\s>]+)|(\w+)/g;
        let match: RegExpExecArray | null;

        // eslint-disable-next-line no-cond-assign
        while ((match = attrPattern.exec(attrString)) !== null) {
            if (match[1]) {
                // Double-quoted: name="value"
                const name: string = match[1].toLowerCase();
                const value: string = match[2];

                if (name === 'style') {
                    element._styles = parseInlineStyles(value);
                } else {
                    element.setAttribute(name, value);
                }
            } else if (match[3]) {
                // Single-quoted: name='value'
                const name: string = match[3].toLowerCase();
                const value: string = match[4];

                if (name === 'style') {
                    element._styles = parseInlineStyles(value);
                } else {
                    element.setAttribute(name, value);
                }
            } else if (match[5]) {
                // Unquoted: name=value
                const name: string = match[5].toLowerCase();
                const value: string = match[6];

                if (name === 'style') {
                    element._styles = parseInlineStyles(value);
                } else {
                    element.setAttribute(name, value);
                }
            } else if (match[7]) {
                // Boolean attribute: name
                const name: string = match[7].toLowerCase();
                element.setAttribute(name, '');
            }
        }
    }

    /**
     * Find the index of the matching closing tag, accounting for nested tags.
     *
     * @param {string} html - The HTML string
     * @param {number} startPos - The starting position
     * @param {string} tagName - The tag name to match
     * @returns {number} The index of the matching closing tag
     * @private
     */
    private findMatchingClosingTag(html: string, startPos: number, tagName: string): number {
        let depth: number = 1;
        let pos: number = startPos;
        const lowerTagName: string = tagName.toLowerCase();
        // eslint-disable-next-line security/detect-non-literal-regexp
        const openTagPattern: RegExp = new RegExp(`<\\s*${lowerTagName}(?:\\s|>|/)`, 'i');
        // eslint-disable-next-line security/detect-non-literal-regexp
        const closeTagPattern: RegExp = new RegExp(`</\\s*${lowerTagName}\\s*>`, 'i');

        while (pos < html.length && depth > 0) {
            // Find next opening or closing tag of the same type
            const remainingHtml: string = html.substring(pos);

            const openTagMatch: RegExpExecArray | null = openTagPattern.exec(remainingHtml);
            const closeTagMatch: RegExpExecArray | null = closeTagPattern.exec(remainingHtml);

            let nextPos: number = -1;
            let isClosing: boolean = false;

            if (closeTagMatch && (!openTagMatch || closeTagMatch.index < openTagMatch.index)) {
                // Found closing tag first
                nextPos = pos + closeTagMatch.index;
                isClosing = true;
            } else if (openTagMatch) {
                // Found opening tag first
                nextPos = pos + openTagMatch.index;
                isClosing = false;
            } else {
                // No more tags found
                break;
            }

            if (isClosing) {
                depth--;
                if (depth === 0) {
                    return nextPos;
                }
                pos = nextPos + (closeTagMatch as RegExpExecArray)[0].length;
            } else {
                depth++;
                pos = nextPos + (openTagMatch as RegExpExecArray)[0].length;
            }
        }

        return -1;
    }

    /**
     * Check if a tag is self-closing (void element).
     *
     * @param {string} tagName - The tag name to check
     * @returns {boolean} True if the tag is a void element
     * @private
     */
    /**
     * Decode HTML character references (named entities like &nbsp; and numeric
     * references like &#xa0; / &#160;) in text content. HTML sources often carry
     * &nbsp; for non-breaking spaces; Word expects the actual U+00A0 character.
     *
     * @param {string} text - The text value
     * @returns {string} The text with character references decoded
     */
    private decodeCharacterReferences(text: string): string {
        if (text.indexOf('&') === -1) {
            return text;
        }
        // eslint-disable-next-line security/detect-non-literal-regexp
        const entityPattern: RegExp = /&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g;
        return text.replace(entityPattern, (match: string, body: string): string => {
            let codePoint: number = -1;
            if (body.startsWith('#x') || body.startsWith('#X')) {
                codePoint = parseInt(body.substring(2), 16);
            } else if (body.startsWith('#')) {
                codePoint = parseInt(body.substring(1), 10);
            } else {
                const named: string | undefined = _HTMLParser.namedEntities[body];
                if (named !== undefined) {
                    return named;
                }
            }
            if (codePoint >= 0 && codePoint <= 0x10FFFF) {
                try {
                    return String.fromCodePoint(codePoint);
                } catch (error) {
                    return match;
                }
            }
            return match;
        });
    }

    /**
     * Named character references (HTML5 subset covering common entities).
     */
    private static namedEntities: Readonly<{ [name: string]: string }> = Object.freeze({
        nbsp: '\u00A0',
        lt: '<',
        gt: '>',
        amp: '&',
        quot: '"',
        apos: '\'',
        copy: '\u00A9',
        reg: '\u00AE',
        trade: '\u2122',
        hellip: '\u2026',
        mdash: '\u2014',
        ndash: '\u2013',
        lsquo: '\u2018',
        rsquo: '\u2019',
        ldquo: '\u201C',
        rdquo: '\u201D',
        bull: '\u2022',
        dagger: '\u2020',
        prime: '\u2032',
        prime_reversed: '\u2035',
        deg: '\u00B0',
        plusmn: '\u00B1',
        frac12: '\u00BD',
        frac14: '\u00BC',
        frac34: '\u00BE',
        times: '\u00D7',
        divide: '\u00F7',
        micro: '\u00B5',
        para: '\u00B6',
        sect: '\u00A7',
        middot: '\u00B7',
        laquo: '\u00AB',
        raquo: '\u00BB',
        iexcl: '\u00A1',
        iquest: '\u00BF',
        euro: '\u20AC',
        pound: '\u00A3',
        yen: '\u00A5',
        cent: '\u00A2',
        curren: '\u00A4',
        szlig: '\u00DF',
        agrave: '\u00E0',
        aacute: '\u00E1',
        eacute: '\u00E9',
        egrave: '\u00E8',
        uuml: '\u00FC',
        ouml: '\u00F6',
        auml: '\u00E4',
        ecirc: '\u00EA',
        ocirc: '\u00F4',
        acirc: '\u00E2',
        ucirc: '\u00FB',
        ntilde: '\u00F1',
        ccedil: '\u00E7'
    });

    private isVoidElement(tagName: string): boolean {
        const voidElements: string[] = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
        return voidElements.indexOf(tagName.toLowerCase()) !== -1;
    }

    /**
     * Create the appropriate element class based on tag name.
     *
     * @param {string} tagName - The HTML tag name
     * @returns {_HTMLElement|null} The created element or null
     * @private
     */
    private createElementByTag(tagName: string): _HTMLElement | null {
        const lowerTagName: string = tagName.toLowerCase();
        switch (lowerTagName) {
        case 'body':
            return new _HTMLBodyElement();
        case 'p':
            return new _HTMLParagraphElement();
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            return new _HTMLHeadingElement(tagName);
        case 'br':
            return new _HTMLBrElement();
        case 'hr':
            return new _HTMLHrElement();
        case 'wbr':
            return new _HTMLWbrElement();
        case 'div':
            return new _HTMLDivElement();
        case 'span':
            return new _HTMLSpanElement();
        case 'a':
            return new _HTMLAnchorElement();
        case 'sub':
            return new _HTMLSubElement();
        case 'sup':
            return new _HTMLSupElement();
        case 'code':
            return new _HTMLCodeElement();
        case 'b':
            return new _HTMLBElement();
        case 'strong':
            return new _HTMLStrongElement();
        case 'em':
            return new _HTMLEmElement();
        case 'i':
            return new _HTMLIElement();
        case 'u':
            return new _HTMLUElement();
        case 'blockquote':
            return new _HTMLBlockquoteElement();
        case 'center':
            return new _HTMLCenterElement();
        case 'font':
            return new _HTMLFontElement();
        case 'samp':
            return new _HTMLSampElement();
        case 'table':
            return new _HTMLTableElement();
        case 'tr':
            return new _HTMLTableRowElement();
        case 'td':
        case 'th':
            return new _HTMLTableCellElement(tagName);
        case 'ul':
            return new _HTMLUnorderedListElement();
        case 'ol':
            return new _HTMLOrderedListElement();
        case 'li':
            return new _HTMLListItemElement();
        case 'img':
            return new _HTMLImageElement();
        default:
        // For any other tag, create a generic element
            return new _HTMLGenericElement(tagName);
        }
    }

    /**
     * Collect stylesheets from <head> section before body parsing.
     * Extracts all <style> elements and stores their content in the body element.
     * 
     * @param rootElement - The root body element to store stylesheets
     * @returns void
     * @private
     */
    private _collectStylesheetsFromHead(rootElement: _HTMLElement): void {
        // Style sheets live in <head>, but real-world HTML may omit </head> (or <head> entirely).
        // The scanned region ends at </head>, else at <body>, and starts after <head> when present.
        const headMatch: RegExpMatchArray | null = this._html.match(/<head[^>]*>/i);
        const headStart: number = headMatch ? this._html.indexOf(headMatch[0]) + headMatch[0].length : 0;
        let headEnd: number = this._html.toLowerCase().indexOf('</head>', headStart);
        if (headEnd === -1) {
            const bodyTag: RegExpMatchArray | null = this._html.match(/<body[^>]*>/i);
            headEnd = bodyTag ? this._html.indexOf(bodyTag[0]) : -1;
        }

        if (headEnd === -1 || headEnd <= headStart) {
            return;
        }

        const headContent: string = this._html.substring(headStart, headEnd);

        // Find all <style> elements in head
        const stylePattern: RegExp = /<style[^>]*>([\s\S]*?)<\/style>/gi;
        let styleMatch: RegExpExecArray | null;

        // eslint-disable-next-line no-cond-assign
        while ((styleMatch = stylePattern.exec(headContent)) !== null) {
            const cssText: string = styleMatch[1];
            if (cssText && cssText.trim()) {
                // Add stylesheet to body element
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (rootElement as any).addStyleSheet(cssText);
            }
        }
    }

    /**
     * Parse CSS rules from stylesheets and apply them to elements.
     * This is called after HTML parsing is complete to resolve all styles.
     * 
     * @param rootElement - The root element (typically _HTMLBodyElement)
     * @returns void
     * @private
     */
    private _parseAndApplyCSS(rootElement: _HTMLElement): void {
        // Get stylesheets from body element
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(rootElement as any).styleSheets || !Array.isArray((rootElement as any).styleSheets)) {
            return;
        }
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const styleSheets: string[] = (rootElement as any).styleSheets;
        
        // Parse all CSS rules
        const allRules: _CSSRule[] = [];
        for (const styleText of styleSheets) {
            try {
                const rules = _CSSProcessor.parseCSS(styleText);
                allRules.push(...rules);
            } catch (error) {
                console.warn('Error parsing CSS rules:', error);
            }
        }
        
        // Store parsed rules in body element for later access (e.g., by DocIO mapper)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (rootElement as any).cssRules = allRules;
        
        // Apply styles to all elements in the tree
        this._applyStylesToTree(rootElement, allRules);
    }

    /**
     * Push the inheritable text properties of the body element down to every descendant element
     * that does not set them itself (CSS inheritance). Headings keep their own default size.
     *
     * @param body - The root body element
     * @returns void
     * @private
     */
    private _inheritBodyStyles(body: _HTMLElement): void {
        const inheritable: string[] = ['fontFamily', 'fontSize', 'color'];
        const bodyStyles: Record<string, string> = body._styles || {};
        const walk: (el: _HTMLElement) => void = (el: _HTMLElement): void => {
            for (const child of el._childNodes) {
                if (!child.tagName || child.tagName === '#text') {
                    continue;
                }
                const isHeading: boolean = /^h[1-6]$/i.test(child.tagName);
                for (const key of inheritable) {
                    if (bodyStyles[key] && !child._styles[key] && !(isHeading && key === 'fontSize')) {
                        child._styles[key] = bodyStyles[key];
                    }
                }
                walk(child);
            }
        };
        walk(body);
    }

    /**
     * Recursively apply CSS rules to all elements in the DOM tree.
     * 
     * @param element - Current element to process
     * @param rules - Array of CSS rules to apply
     * @returns void
     * @private
     */
    private _applyStylesToTree(element: _HTMLElement, rules: _CSSRule[]): void {
        // Apply styles to this element
        _CSSProcessor.applyStylesToElement(element, rules);
        
        // Recursively apply to children
        for (const child of element._childNodes) {
            this._applyStylesToTree(child, rules);
        }
    }
}
