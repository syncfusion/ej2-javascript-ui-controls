/**
 */
/* eslint-disable security/detect-object-injection, valid-jsdoc, no-console */
import { WordDocument } from '../document/document.js';
import { Body } from '../document/body.js';
import { ParagraphFormat } from '../document/paragraph-format.js';
import { Paragraph } from '../document/paragraph.js';
import { BreakType, TextRange } from '../document/text-range.js';
import {
    _HTMLElement,
    _HTMLBodyElement,
    _HTMLParagraphElement,
    _HTMLHeadingElement,
    _HTMLTableElement,
    _HTMLListItemElement,
    _HTMLTextNode,
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
    _HTMLBlockquoteElement,
    _HTMLCenterElement,
    _HTMLFontElement,
    _HTMLSampElement
} from '../html-parser/dom-node.js';
import { _ParagraphMapper } from './paragraph-mapper.js';
import { _ListMapper } from './list-mapper.js';
import { _TableMapper } from './table-mapper.js';
import { _ImageMapper } from './image-mapper.js';
import { registerTablesFeature } from '../tables/index.js';
import { CSSStyleCache, applyParagraphDeclarations, parseCssHex } from './css-paragraph-style-builder.js';
import { CSSCharacterStyleCache } from './css-character-style-builder.js';

// Type aliases for compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _Paragraph = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _Table = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _Section = any;

/**
 */
export class _HTMLToDocIOMapper {
    private _htmlElement: _HTMLElement;
    private _document: WordDocument;
    /**
     * Collected CSS rules from stylesheets.
     *
     * @private
     */
    private _cssRules: any[] = [];
    /**
     * Cache for CSS paragraph styles created during mapping.
     *
     * @private
     */
    private _styleCache: CSSStyleCache;

    /**
     * Create a mapper for an HTML DOM tree.
     *
     * @param {unknown} htmlElement - Root HTML element (typically _HTMLBodyElement)
     * @param {unknown} document - The WordDocument to attach mapped content to
     */
    constructor(htmlElement: _HTMLElement, document: WordDocument) {
        this._htmlElement = htmlElement;
        this._document = document;
        this._styleCache = new CSSStyleCache(document);
        // Initialize character style cache for CSS class selectors
        const characterStyleCache = new CSSCharacterStyleCache(document);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_ParagraphMapper as any).setCharacterStyleCache(characterStyleCache);
        // Collect CSS rules from stylesheets
        this._collectCSSRules();
        // Ensure tables feature is registered for table and list support
        registerTablesFeature();
    }

    /**
     * Collects CSS rules that were pre-parsed by the HTML parser.
     * The parser is responsible for ALL CSS processing - this mapper only reads results.
     *
     * @private
     */
    private _collectCSSRules(): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const htmlElement = this._htmlElement as any;
        
        // Get pre-parsed CSS rules from parser (stored in body.cssRules)
        // The parser is responsible for parsing ALL stylesheets
        if (htmlElement.cssRules && Array.isArray(htmlElement.cssRules)) {
            this._cssRules.push(...htmlElement.cssRules);
        }
    }

    /**
     * Gets collected CSS rules.
     *
     * @private
     */
    getCSSRules(): any[] {
        return this._cssRules;
    }

    /**
     * Gets the CSS style cache for creating/retrieving paragraph styles.
     *
     * @private
     */
    getStyleCache(): CSSStyleCache {
        return this._styleCache;
    }
    /**
     * @param {unknown} container - The container value
     * @param {unknown} item - The item value
     * @returns {boolean}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static addItemToContainer(container: any, item: any): boolean {
        try {
            if (container && container.items && container.items.add) {
                container.items.add(item);
                return true;
            }
        } catch (error) {
            console.error('Error adding item to container:', error);
        }
        return false;
    }
    /**
     * @param {unknown} obj - The obj value
     * @param {unknown} methodName - The methodName value
     * @param {unknown} args - The args value
     * @returns {unknown}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static callOptionalMethod(obj: any, methodName: string, args?: any[]): any {
        try {
            if (obj && obj[methodName] && typeof obj[methodName] === 'function') {
                return obj[methodName](...(args || []));
            }
        } catch (error) {
            console.error(`Error calling ${methodName}:`, error);
        }
        return null;
    }
	 /**
     * Map HTML elements to the document body and add paragraphs directly.
     *
     * Phase 1 only supports paragraphs. Paragraphs are created and attached
     * to the document's body using appendParagraph().
     *
     * @returns The WordDocument with mapped content added
     * @private
     */
    mapToDocument(): WordDocument {
        const section: _Section = this._document.sections[0];
        if (section && section.body) {
            // Map HTML paragraphs by appending them to the body
            this._mapElementChildrenToBody(this._htmlElement, section.body);
        }
        return this._document;
    }
    /**
     * Map children elements to body, attaching them during mapping.
     *
     * @param {unknown} parent - The parent value
     * @param {unknown} body - The body value
     * @returns {void}
     */
    /**
     * Copy block-level container styles (alignment, background, border, padding) of a
     * `<div>` onto the paragraphs generated from its children, without overriding
     * values a paragraph already has.
     *
     * @private
     */
    private _containerStyleDeclarations(div: _HTMLElement): Record<string, string> {
        const out: Record<string, string> = {};
        const styles: Record<string, string> = div._styles || {};
        for (const key of Object.keys(styles)) {
            if (key === 'textAlign' || key === 'backgroundColor' || key === 'background' ||
                key.indexOf('border') === 0 || key.indexOf('padding') === 0) {
                out[key] = styles[key].trim().toLowerCase();
            }
        }
        return out;
    }

    /**
     * Applies the container style declarations of a `<div>` to the body paragraphs
     * created after the given start index, without overriding existing alignment.
     *
     * @param {_HTMLElement} div - The container element whose styles are applied.
     * @param {Body} body - The body containing the paragraphs to update.
     * @param {number} startIndex - The index of the first paragraph to update.
     * @returns {void} Returns void.
     * @private
     */
    private _applyContainerStyles(div: _HTMLElement, body: Body, startIndex: number): void {
        const decls: Record<string, string> = this._containerStyleDeclarations(div);
        if (Object.keys(decls).length === 0 || !body.paragraphs) {
            return;
        }
        for (let i: number = startIndex; i < body.paragraphs.length; i++) {
            const format: ParagraphFormat = body.paragraphs[i].paragraphFormat;
            if (!format) {
                continue;
            }
            const own: Record<string, string> = { ...decls };
            if (format.horizontalAlignment !== undefined) {
                delete own.textAlign;
            }
            applyParagraphDeclarations(format, { ...own });
        }
    }

    /**
     * Maps the children of the given element to the document body.
     *
     * @param {_HTMLElement} parent - The element whose children are mapped.
     * @param {Body} body - The body to add the mapped paragraphs to.
     * @returns {void} Returns void.
     * @private
     */
    private _mapElementChildrenToBody(parent: _HTMLElement, body: Body): void {
        // Pass CSS rules and style cache to paragraph mapper for class selector support
        if (this._cssRules.length > 0) {
            _ParagraphMapper.setCSSRules(this._cssRules);
        }
        _ParagraphMapper.setStyleCache(this._styleCache);

        let isFirstParagraph: boolean = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let currentInlineParagraph: any = null; // Buffer for consecutive inline elements
        
        for (const child of parent._childNodes) {
            // A span wrapping block elements: unwrap it and map its children at body level
            if (child instanceof _HTMLSpanElement && this._containsBlockLevelElements(child)) {
                currentInlineParagraph = null;
                this._mapElementChildrenToBody(child, body);
                isFirstParagraph = false;
                continue;
            }
const isInlineElement: boolean =
    child instanceof _HTMLFontElement ||
    child instanceof _HTMLSpanElement ||
    child instanceof _HTMLAnchorElement ||
    child instanceof _HTMLBElement ||
    child instanceof _HTMLStrongElement ||
    child instanceof _HTMLEmElement ||
    child instanceof _HTMLIElement ||
    child instanceof _HTMLUElement ||
    child instanceof _HTMLSubElement ||
    child instanceof _HTMLSupElement ||
    child instanceof _HTMLCodeElement ||
    child instanceof _HTMLSampElement;
            const isTextNode = child instanceof _HTMLTextNode;
            // Also check for inline-like generic elements (s, ins, big, small, del, mark, etc.)
            const isGenericInlineElement = child instanceof _HTMLGenericElement &&
                (child.tagName && ['s', 'del', 'ins', 'mark', 'big', 'small', 'abbr', 'cite', 'dfn', 'var', 'q', 'bdi', 'bdo'].indexOf(child.tagName.toLowerCase()) !== -1);
            
            // Check if this is a <br> element (which should stay with inline content)
            const isBrElement = child instanceof _HTMLBrElement || 
                (child.tagName && child.tagName.toLowerCase() === 'br');
            // Handle <br> as an inline line break
if (isBrElement) {
    if (!currentInlineParagraph) {

        if (isFirstParagraph &&
            body.paragraphs &&
            body.paragraphs.length === 1) {

            const defaultPara: _Paragraph = body.paragraphs[0];

            let isEmptyPara: boolean = false;

            if (defaultPara.items && defaultPara.items.snapshot) {
                const items: any[] = defaultPara.items.snapshot();
                isEmptyPara = !items || items.length === 0;
            }

            if (isEmptyPara) {
                currentInlineParagraph = defaultPara;
            }
        }

        if (!currentInlineParagraph) {
            currentInlineParagraph = new Paragraph(undefined);

            _HTMLToDocIOMapper.addItemToContainer(
                body,
                currentInlineParagraph
            );
        }
    }

    currentInlineParagraph.appendBreak(
        BreakType.LineBreak
    );

    isFirstParagraph = false;
    continue;
}
            // If this is NOT an inline element and NOT a <br>, and we have accumulated inline elements, flush them
            if (!isInlineElement && !isGenericInlineElement && !isBrElement && !isTextNode && currentInlineParagraph) {
                currentInlineParagraph = null;
            }
            if (child instanceof _HTMLTextNode) {

    const textContent: string = child._text || '';

    if (textContent.length === 0) {
        continue;
    }

    // Whitespace-only text is insignificant when it is not between two inline
    // elements: HTML collapses it away next to block elements (newlines and
    // tabs used for source formatting must not become text runs / tabs).
    // eslint-disable-next-line no-irregular-whitespace
    const isBlankText: boolean = textContent.replace(/[^\S\u00A0]+/g, '').length === 0;
    if (isBlankText) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isInlineNode = (node: any): boolean => {
            if (node instanceof _HTMLTextNode) { return true; }
            const t: string = node.tagName ? node.tagName.toLowerCase() : '';
            return node instanceof _HTMLSpanElement || node instanceof _HTMLBElement ||
                node instanceof _HTMLIElement || node instanceof _HTMLUElement ||
                node instanceof _HTMLStrongElement || node instanceof _HTMLEmElement ||
                node instanceof _HTMLAnchorElement || node instanceof _HTMLImageElement ||
                node instanceof _HTMLBrElement || node instanceof _HTMLFontElement ||
                ['strong', 'em', 's', 'ins', 'del', 'code', 'samp', 'kbd', 'mark',
                    'small', 'big', 'sub', 'sup', 'abbr', 'cite', 'q', 'wbr'].indexOf(t) !== -1;
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const siblings: any[] = parent._childNodes;
        const myIndex: number = siblings.indexOf(child);
        let nextSibling = null;
        for (let i = myIndex + 1; i < siblings.length; i++) {
            // eslint-disable-next-line no-irregular-whitespace
            if (siblings[i] instanceof _HTMLTextNode && (siblings[i]._text || '').replace(/[^\S\u00A0]+/g, '').length === 0) {
                continue; // consecutive whitespace nodes act as one
            }
            nextSibling = siblings[i];
            break;
        }
        if (!nextSibling || !isInlineNode(nextSibling)) {
            currentInlineParagraph = null;
            continue;
        }
    }

    // Create paragraph for body-level text
    if (!currentInlineParagraph) {

        if (isFirstParagraph &&
            body.paragraphs &&
            body.paragraphs.length === 1) {

            const defaultPara: _Paragraph = body.paragraphs[0];

            let isEmptyPara: boolean = false;

            if (defaultPara.items && defaultPara.items.snapshot) {
                const items: any[] = defaultPara.items.snapshot();
                isEmptyPara = !items || items.length === 0;
            }

            if (isEmptyPara) {
                currentInlineParagraph = defaultPara;
            }
        }

        if (!currentInlineParagraph) {
            currentInlineParagraph = new Paragraph(undefined);
            _HTMLToDocIOMapper.addItemToContainer(
                body,
                currentInlineParagraph
            );
        }
    }

    const textRange: any = new TextRange(this._document);
    textRange.text = textContent;
    _ParagraphMapper.applyInheritedCharacterStyles(textRange, parent._styles || {});
    currentInlineParagraph.items.add(textRange);

    isFirstParagraph = false;
}
             else if (child instanceof _HTMLHeadingElement) {
                // Map heading element (h1-h6) to a heading paragraph style
                // For the first heading, try to reuse the default empty paragraph if available
                if (isFirstParagraph && body.paragraphs && body.paragraphs.length === 1) {
                    const defaultPara: _Paragraph = body.paragraphs[0];
                    // Check if it's empty (no items or only whitespace)
                    let isEmptyPara: boolean = false;
                    if (defaultPara && defaultPara.items && defaultPara.items.snapshot) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const items: any[] = defaultPara.items.snapshot();
                        isEmptyPara = !items || items.length === 0;
                    }
                    if (isEmptyPara) {
                        // Reuse the default empty paragraph instead of creating a new one
                        _ParagraphMapper.mapHTMLHeadingContent(child as _HTMLHeadingElement, defaultPara, this._document, body);
                        isFirstParagraph = false;
                        continue;
                    }
                }
                isFirstParagraph = false;
                // Map heading WITH body owner so paragraph is attached and mutable
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const paragraph: _Paragraph = _ParagraphMapper.mapHTMLHeading(child as _HTMLHeadingElement, this._document, body);
                // The paragraph is already added to body via the owner parameter
            } else if (child instanceof _HTMLParagraphElement) {
                // Browsers auto-close a <p> before a block-level child (div, table, ul, ...).
                // This parser does not perform that fixup, so detect block children first:
                // map the inline prefix as a paragraph, then map block children at body level.
                if (this._containsBlockLevelElements(child)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const inlineNodes: any[] = [];
                    for (const pChild of child._childNodes) {
                        if (pChild instanceof _HTMLTextNode) { inlineNodes.push(pChild); continue; }
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const pChildTag: string = pChild.tagName ? pChild.tagName.toLowerCase() : '';
                        const isInline: boolean = pChild instanceof _HTMLSpanElement ||
                            pChild instanceof _HTMLBElement ||
                            pChild instanceof _HTMLIElement ||
                            pChild instanceof _HTMLUElement ||
                            pChild instanceof _HTMLAnchorElement ||
                            pChild instanceof _HTMLImageElement ||
                            pChild instanceof _HTMLBrElement ||
                            ['strong', 'em', 's', 'ins', 'del', 'code', 'samp', 'kbd', 'mark',
                                'small', 'big', 'sub', 'sup', 'font', 'abbr', 'cite', 'q', 'wbr'].indexOf(pChildTag) !== -1;
                        if (isInline) {
                            inlineNodes.push(pChild);
                        } else {
                            break;
                        }
                    }
                    if (inlineNodes.length > 0) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const prefixPara: any = new Paragraph(undefined);
                        _HTMLToDocIOMapper.addItemToContainer(body, prefixPara);
                        // Build a temporary <p>-like element containing only the inline prefix
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const prefixElement: any = new (child.constructor as any)();
                        prefixElement.tagName = 'p';
                        for (const inlineNode of inlineNodes) {
                            prefixElement.appendChild(inlineNode);
                        }
                        _ParagraphMapper.mapHTMLParagraphContent(prefixElement, prefixPara, this._document, body);
                    }
                    // Recursively map the remaining (block) children at body level
                    this._mapElementChildrenToBody(child, body);
                    isFirstParagraph = false;
                    continue;
                }
                // For the first paragraph, try to reuse the default empty paragraph if available
                if (isFirstParagraph && body.paragraphs && body.paragraphs.length === 1) {
                    const defaultPara: _Paragraph = body.paragraphs[0];
                    // Check if it's empty (no items or only whitespace)
                    let isEmptyPara: boolean = false;
                    if (defaultPara && defaultPara.items && defaultPara.items.snapshot) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const items: any[] = defaultPara.items.snapshot();
                        isEmptyPara = !items || items.length === 0;
                    }
                    if (isEmptyPara) {
                        // Reuse the default empty paragraph instead of creating a new one
                        _ParagraphMapper.mapHTMLParagraphContent(child, defaultPara, this._document, body);
                        isFirstParagraph = false;
                        continue;
                    }
                }
                isFirstParagraph = false;
                // Pure inline <p>: map normally
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const paragraph: any = _ParagraphMapper.mapHTMLParagraph(child, this._document, body);
                // The paragraph is already added to body via the owner parameter
            } else if (child instanceof _HTMLTableElement) {
                // <caption> is rendered as a paragraph placed before the table
                for (const captionNode of child._childNodes) {
                    if (captionNode.tagName && captionNode.tagName.toLowerCase() === 'caption') {
                        const captionPara: _Paragraph = new Paragraph(undefined);
                        _HTMLToDocIOMapper.addItemToContainer(body, captionPara);
                        _ParagraphMapper.mapHTMLParagraphContent(captionNode as any, captionPara, this._document, body);
                        try {
                            captionPara.applyStyle('Caption');
                            captionPara.paragraphFormat.keepFollow = true;
                        } catch (error) {
                            console.debug('Could not apply the Caption style:', error);
                        }
                    }
                }
                // Map table element and add to body
                try {
                    const table: _Table = _TableMapper.mapHTMLTable(child as _HTMLTableElement, this._document, body);
                    if (table) {
                        // Table is already added to body by TableMapper when owner is provided
                        isFirstParagraph = false;
                    } else {
                        console.warn('[MAPPER] Table mapper returned null for table element');
                        // Fallback: if table mapping failed, try to recursively process table content at body level
                        this._mapElementChildrenToBody(child, body);
                    }
                } catch (error) {
                    console.error('[MAPPER] Error mapping table element:', error);
                    // Fallback: recursively process table content
                    this._mapElementChildrenToBody(child, body);
                }
                isFirstParagraph = false;
            } else if (child instanceof _HTMLListItemElement) {
                // List items appearing at body level indicate malformed HTML
                // (li should be inside ul/ol, but we'll handle gracefully)
                // For the first list item, remove the default empty paragraph if it exists
                // to avoid an extra blank paragraph at the start of the document
                if (isFirstParagraph && body.paragraphs && body.paragraphs.length === 1) {
                    const defaultPara: _Paragraph = body.paragraphs[0];
                    // Check if it's empty (no items or only whitespace)
                    let isEmptyPara: boolean = false;
                    if (defaultPara && defaultPara.items && defaultPara.items.snapshot) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const items: any[] = defaultPara.items.snapshot();
                        isEmptyPara = !items || items.length === 0;
                    }
                    if (isEmptyPara) {
                        // Remove the default empty paragraph - we'll add list items instead
                        try {
                            body.paragraphs.removeAt(0);
                        } catch (error) {
                            // If removal fails, continue anyway
                            console.debug('Could not remove default paragraph:', error);
                        }
                    }
                }
                // Create a synthetic list context and process as list item with bullet
                const liParagraphs: _Paragraph[] = _ListMapper.mapListItemDirect(
                    child,
                    this._document,
                    body,
                    0 // level 0
                );
                isFirstParagraph = false;
            } else if (child instanceof _HTMLImageElement) {
                // Map image element at body level
                // Create a paragraph to hold the image
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const imageParagraph: any = new Paragraph(undefined);
                try {
                    _HTMLToDocIOMapper.addItemToContainer(body, imageParagraph);
                } catch (error) {
                    console.error('Error adding image paragraph to body:', error);
                }
                // Extract image data and add to paragraph
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const imageData: any = _ImageMapper.extractImageData(child as _HTMLImageElement);
                if (imageData && imageData.bytes) {
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const appendImageMethod: any = (imageParagraph as any).appendImage;
                        if (appendImageMethod) {
                            appendImageMethod.call(imageParagraph, imageData.bytes, {
                                width: imageData.width,
                                height: imageData.height,
                                name: imageData.name || imageData.alt,
                                title: imageData.title,
                                description: imageData.alt
                            });
                        }
                        isFirstParagraph = false;
                    } catch (error) {
                        console.error('Error appending image to paragraph:', error);
                    }
                } else {
                    const altText: string | null = child.getAttribute('alt');
                    if (altText) {
                        const altRange: any = new TextRange(this._document);
                        altRange.text = '[Image: ' + altText + ']';
                        imageParagraph.items.add(altRange);
                    }
                    isFirstParagraph = false;
                }
            } else if (child instanceof _HTMLHrElement || child instanceof _HTMLWbrElement) {
                // Handle void elements (br, hr, wbr) at body level
                // Create a paragraph to hold the break
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const breakParagraph: any = new Paragraph(undefined);
                try {
                    _HTMLToDocIOMapper.addItemToContainer(body, breakParagraph);
                } catch (error) {
                    console.error('Error adding break paragraph to body:', error);
                }
                // Add the appropriate break type to the paragraph
                try {
                    if (child instanceof _HTMLHrElement) {
                        // Horizontal rule: an empty paragraph with a bottom border
                        const hrBorder: any = breakParagraph.paragraphFormat.borders.bottom;
                        hrBorder.borderType = 'single';
                        hrBorder.lineWidth = 0.75;
                        hrBorder.color = parseCssHex(child._styles && (child._styles.borderColor || child._styles.color)) || '808080';
                    } else if (child instanceof _HTMLWbrElement) {
                        // Word break opportunity - add a soft break if available
                        breakParagraph.appendBreak(BreakType.LineBreak);
                    }
                    isFirstParagraph = false;
                } catch (error) {
                    console.error('Error adding break to paragraph:', error);
                }
            } else if (child instanceof _HTMLDivElement ||
                (child instanceof _HTMLBlockquoteElement && !this._containsBlockLevelElements(child))) {
                // Handle div element as a block-level container
                // Div should contain its content as a paragraph (like <p> but can contain block elements)
                // Check if div contains block-level elements (p, h*, table, ul, ol, div, etc.)
                let hasBlockElements: boolean = this._containsBlockLevelElements(child);
                
                // Additional check: explicitly look for table elements which are critical
                if (!hasBlockElements && child._childNodes) {
                    for (const dchild of child._childNodes) {
                        if (dchild instanceof _HTMLTableElement) {
                            hasBlockElements = true;
                            break;
                        }
                    }
                }
                
                if (hasBlockElements) {
                    // If div contains block elements, recursively process its children at body level
                    let before: number = body.paragraphs ? body.paragraphs.length : 0;
                    if (isFirstParagraph && before === 1 && body.paragraphs[0].items.snapshot().length === 0) {
                        before = 0; // the empty default paragraph is reused by the first child
                    }
                    this._mapElementChildrenToBody(child, body);
                    this._applyContainerStyles(child, body, before);
                } else {
                    // If div contains only inline content, treat it like a paragraph
                    // Create a paragraph to hold the inline content
                    if (isFirstParagraph && body.paragraphs && body.paragraphs.length === 1) {
                        const defaultPara: _Paragraph = body.paragraphs[0];
                        // Check if it's empty (no items or only whitespace)
                        let isEmptyPara: boolean = false;
                        if (defaultPara && defaultPara.items && defaultPara.items.snapshot) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const items: any[] = defaultPara.items.snapshot();
                            isEmptyPara = !items || items.length === 0;
                        }
                        if (isEmptyPara) {
                            // Reuse the default empty paragraph
                            _ParagraphMapper.mapHTMLParagraphContent(child, defaultPara, this._document, body);
                            isFirstParagraph = false;
                            continue;
                        }
                    }
                    // Create new paragraph for div content
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const divParagraph: any = new Paragraph(undefined);
                    _HTMLToDocIOMapper.addItemToContainer(body, divParagraph);
                    _ParagraphMapper.mapHTMLParagraphContent(child, divParagraph, this._document, body);
                }
                isFirstParagraph = false;
            } else if (child instanceof _HTMLBlockquoteElement) {
                // Handle blockquote element with indentation
                // Add inline styles to element so they get picked up during paragraph processing
                if (!child._styles) {
                    child._styles = {};
                }
                // Add margin-left style to create indentation (0.5 inch = 36pt)
                if (!child._styles['margin-left']) {
                    child._styles['margin-left'] = '36pt';
                }
                
                // Recursively process children, then apply the container declarations to them
                const quoteBefore: number = body.paragraphs ? body.paragraphs.length : 0;
                this._mapElementChildrenToBody(child, body);
                this._applyContainerStyles(child, body, quoteBefore);
                isFirstParagraph = false;
            } else if (child instanceof _HTMLCenterElement) {
                // Handle center element with center alignment
                // Add inline styles to element so they get picked up during paragraph processing
                if (!child._styles) {
                    child._styles = {};
                }
                // Add text-align style for center alignment
                if (!child._styles['text-align'] && !child._styles.textAlign) {
                    child._styles['text-align'] = 'center';
                }

                // Recursively process children, then apply the centre / class declarations to them
                let centerBefore: number = body.paragraphs ? body.paragraphs.length : 0;
                if (isFirstParagraph && centerBefore === 1 && body.paragraphs[0].items.snapshot().length === 0) {
                    centerBefore = 0; // the empty default paragraph is reused by the first child
                }
                this._mapElementChildrenToBody(child, body);
                this._applyContainerStyles(child, body, centerBefore);
                isFirstParagraph = false;
            } else if (isInlineElement || isGenericInlineElement) {
                // Handle inline/text formatting elements at body level
                // Buffer consecutive inline elements into the same paragraph
                if (!currentInlineParagraph) {
                    // Create a new paragraph for inline elements
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    currentInlineParagraph = new Paragraph(undefined);
                    if (isFirstParagraph && body.paragraphs && body.paragraphs.length === 1) {
                        const defaultPara: _Paragraph = body.paragraphs[0];
                        // Check if it's empty (no items or only whitespace)
                        let isEmptyPara: boolean = false;
                        if (defaultPara && defaultPara.items && defaultPara.items.snapshot) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const items: any[] = defaultPara.items.snapshot();
                            isEmptyPara = !items || items.length === 0;
                        }
                        if (isEmptyPara) {
                            // Reuse the default empty paragraph
                            currentInlineParagraph = defaultPara;
                        } else {
                            // Add new paragraph to body
                            _HTMLToDocIOMapper.addItemToContainer(body, currentInlineParagraph);
                            // Remove spacing between consecutive inline paragraphs
                            try {
                                if (currentInlineParagraph.paragraphFormat) {
                                    currentInlineParagraph.paragraphFormat.beforeSpacing = 0;
                                    currentInlineParagraph.paragraphFormat.afterSpacing = 0;
                                }
                            } catch (error) {
                                // Ignore errors setting paragraph format
                            }
                        }
                    } else {
                        // Add new paragraph to body
                        _HTMLToDocIOMapper.addItemToContainer(body, currentInlineParagraph);
                        // Remove spacing between consecutive inline paragraphs
                        try {
                            if (currentInlineParagraph.paragraphFormat) {
                                currentInlineParagraph.paragraphFormat.beforeSpacing = 0;
                                currentInlineParagraph.paragraphFormat.afterSpacing = 0;
                            }
                        } catch (error) {
                            // Ignore errors setting paragraph format
                        }
                    }
                    isFirstParagraph = false;
                }
                // Add this inline element to the current paragraph via processInlineElement
                _ParagraphMapper.processInlineElement(child, currentInlineParagraph, this._document, true);

            } else {
                // Other element types - check tag name for list elements and nested content
                const tagName: string = child.tagName ? child.tagName.toLowerCase() : '';
                if (tagName === 'ul' || tagName === 'ol') {
                    // Map list elements
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const listParagraphs: any[] = _ListMapper.mapHTMLList(child, this._document, body);
                    // Paragraphs are already added to body by ListMapper when owner is provided
                    isFirstParagraph = false;
                } else if (tagName === 'dl') {
                    // Map description list (dl/dt/dd) elements
                    this._mapDescriptionList(child, this._document, body, _ParagraphMapper);
                    isFirstParagraph = false;
                } else if (tagName === 'body') {
                    // Recursively process body element children
                    this._mapElementChildrenToBody(child, body);
                } else if (tagName === 'br' || tagName === 'hr' || tagName === 'wbr') {
                    // Handle void elements (br, hr, wbr) when they're generic elements (not instance types)
                    // br at body level should flush current inline paragraph and create a new one
                    if (tagName === 'hr') {
                        // Horizontal rule - flush current paragraph first
                        if (currentInlineParagraph) {
                            currentInlineParagraph = null;
                        }
                        // Create paragraph with hr
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const hrParagraph: any = new Paragraph(undefined);
                        try {
                            _HTMLToDocIOMapper.addItemToContainer(body, hrParagraph);
                        } catch (error) {
                            console.error('Error adding hr paragraph to body:', error);
                        }
                    }
                } else if (tagName === 'img') {
                    // img tag not in an HTMLImageElement instance - handle as generic element
                    // Create a paragraph to hold the image
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const imageParagraph: any = new Paragraph(undefined);
                    try {
                        _HTMLToDocIOMapper.addItemToContainer(body, imageParagraph);
                    } catch (error) {
                        console.error('Error adding image paragraph to body:', error);
                    }
                    // Extract image data and add to paragraph
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const imageData: any = _ImageMapper.extractImageData(child);
                    if (imageData && imageData.bytes) {
                        try {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const appendImageMethod: any = (imageParagraph as any).appendImage;
                            if (appendImageMethod) {
                                appendImageMethod.call(imageParagraph, imageData.bytes, {
                                    width: imageData.width,
                                    height: imageData.height,
                                    name: imageData.name || imageData.alt,
                                    title: imageData.title,
                                    description: imageData.alt
                                });
                            }
                            isFirstParagraph = false;
                        } catch (error) {
                            console.error('Error appending image to paragraph:', error);
                        }
                    }
                } else if (child instanceof _HTMLGenericElement) {
                    // Handle generic block-level elements (div, blockquote, pre, code, section, article, etc.)
                    // Treat them as paragraph containers with their styling applied
                    this._mapGenericBlockElement(child as _HTMLGenericElement, this._document, body, _ParagraphMapper);
                    isFirstParagraph = false;
                } else {
                    // For other elements, try to recursively find content (tables, lists, paragraphs)
                    this._mapElementChildrenToBody(child, body);
                }
            }
        }
    }

    /**
     * Check if an element contains block-level child elements.
     * Used to determine if a container like <div> should recursively process
     * its children or treat them as inline content.
     *
     * @param {_HTMLElement} element - The element to check
     * @returns {boolean} True if element contains block-level elements
     * @private
     */
    private _containsBlockLevelElements(element: _HTMLElement): boolean {
        if (!element._childNodes || element._childNodes.length === 0) {
            return false;
        }
        
        for (const child of element._childNodes) {
            // Skip text nodes
            if (child instanceof _HTMLTextNode) {
                continue;
            }
            
            const tagName: string = child.tagName ? child.tagName.toLowerCase() : '';
            
            // Check if child is a block-level element
            const blockLevelTags: string[] = [
                'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'div', 'blockquote', 'pre',
                'ul', 'ol', 'li',
                'table', 'tr', 'td', 'th',
                'section', 'article', 'header', 'footer', 'main',
                'aside', 'nav'
            ];
            
            if (blockLevelTags.indexOf(tagName) !== -1) {
                return true;
            }

            // Block content nested in an inline wrapper (invalid <span><p>) still needs block handling
            if (child instanceof _HTMLSpanElement && this._containsBlockLevelElements(child)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * to one or more Word paragraphs.
     *
     * These elements are treated as paragraph containers with their class and style
     * attributes applied to the paragraph formatting.
     *
     * @param {_HTMLGenericElement} element - The generic HTML element to map
     * @param {WordDocument} document - The Word document
     * @param {Body} body - The document body to add paragraphs to
     * @param {any} paragraphMapper - The ParagraphMapper for creating paragraphs
     * @returns {void}
     * @private
     */
    private _mapGenericBlockElement(
        element: _HTMLGenericElement | _HTMLCodeElement,
        document: WordDocument,
        body: Body,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paragraphMapper: any
    ): void {
        const tagName: string = element.tagName ? element.tagName.toLowerCase() : '';

        // Handle pre and code elements as preformatted text in monospace paragraphs
        if (tagName === 'pre' || tagName === 'code') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const preformattedParagraph: any = new Paragraph(undefined);
            try {
                body.items.add(preformattedParagraph);
            } catch (error) {
                console.error(`Error adding ${tagName} paragraph to body:`, error);
                return;
            }
            // Apply preformatted styling
            if (preformattedParagraph.characterFormat) {
                preformattedParagraph.characterFormat.fontName = 'Courier New';
                preformattedParagraph.characterFormat.fontSize = 10;
            }
            // Map content
            paragraphMapper.mapHTMLParagraphContent(element, preformattedParagraph, document, body);
        } else if (tagName === 'blockquote') {
            // Handle blockquote - recursively process children with indentation
            // blockquote can contain multiple block elements, so process each child
            if (!element._childNodes || element._childNodes.length === 0) {
                return;
            }
            
            // Process each child of blockquote with indentation applied
            for (const child of element._childNodes) {
                // Skip text nodes at blockquote level
                if (child instanceof _HTMLTextNode) {
                    continue;
                }
                
                const childTagName: string = child.tagName ? child.tagName.toLowerCase() : '';
                
                // Create a paragraph for each content element in blockquote
                if (childTagName === 'p' || childTagName === 'div') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const blockquoteParagraph: any = new Paragraph(undefined);
                    try {
                        body.items.add(blockquoteParagraph);
                    } catch (error) {
                        console.error('Error adding blockquote paragraph to body:', error);
                        continue;
                    }
                    // Apply blockquote indentation
                    if (blockquoteParagraph.paragraphFormat) {
                        blockquoteParagraph.paragraphFormat.leftIndent = 720; // 0.5 inch in twips
                    }
                    // Map paragraph content
                    _ParagraphMapper.mapHTMLParagraphContent(child, blockquoteParagraph, document, body);
                } else if (childTagName === '') {
                    // Handle text nodes that are direct children
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const blockquoteParagraph: any = new Paragraph(undefined);
                    try {
                        body.items.add(blockquoteParagraph);
                    } catch (error) {
                        console.error('Error adding blockquote text paragraph to body:', error);
                        continue;
                    }
                    // Apply blockquote indentation
                    if (blockquoteParagraph.paragraphFormat) {
                        blockquoteParagraph.paragraphFormat.leftIndent = 720;
                    }
                    // Add text content
                    _ParagraphMapper.mapHTMLParagraphContent(child, blockquoteParagraph, document, body);
                }
                // For other elements like headings, recursively process
                // but we'll handle them at the next level
            }
        } else if (tagName === 'center') {
            // Handle <center> tag - center align content
            if (!element._childNodes || element._childNodes.length === 0) {
                return;
            }
            
            // Process each child with center alignment
            for (const child of element._childNodes) {
                if (child instanceof _HTMLTextNode) {
                    continue;
                }
                
                const childTagName: string = child.tagName ? child.tagName.toLowerCase() : '';
                
                if (childTagName === 'p' || childTagName === 'div' || childTagName === '') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const centerParagraph: any = new Paragraph(undefined);
                    try {
                        body.items.add(centerParagraph);
                    } catch (error) {
                        console.error('Error adding center paragraph to body:', error);
                        continue;
                    }
                    // Apply center alignment
                    if (centerParagraph.paragraphFormat) {
                        centerParagraph.paragraphFormat.alignment = 'Center'; // or might be 'Center' or other format
                    }
                    // Map content
                    _ParagraphMapper.mapHTMLParagraphContent(child, centerParagraph, document, body);
                }
            }
        } else {
            // For div, section, article, and other generic block elements,
            // recursively process their children
            this._mapElementChildrenToBody(element, body);
        }
    }

    /**
     * Map description list (dl) elements with dt (term) and dd (definition) children.
     * dt elements create normal paragraphs with bold formatting.
     * dd elements create indented paragraphs with left indent applied.
     *
     * @param {_HTMLElement} dlElement - The description list (dl) element
     * @param {WordDocument} document - The Word document
     * @param {Body} body - The document body to add paragraphs to
     * @param {any} paragraphMapper - The ParagraphMapper for creating paragraphs
     * @returns {void}
     * @private
     */
    private _mapDescriptionList(
        dlElement: _HTMLElement,
        document: WordDocument,
        body: Body,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paragraphMapper: any
    ): void {
        if (!dlElement._childNodes || dlElement._childNodes.length === 0) {
            return;
        }

        const dlDeclarations: Record<string, string> = this._containerStyleDeclarations(dlElement);
        for (const child of dlElement._childNodes) {
            // Skip text nodes
            if (child instanceof _HTMLTextNode) {
                continue;
            }
            // dt / dd inherit the list's alignment unless they declare their own
            if (child._styles) {
                for (const key of Object.keys(dlDeclarations)) {
                    if (key === 'textAlign' && !child._styles.textAlign) {
                        child._styles.textAlign = dlDeclarations[key];
                    }
                }
            }

            const tagName: string = child.tagName ? child.tagName.toLowerCase() : '';

            if (tagName === 'dt') {
                // Map definition term (dt) as a bold paragraph
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dtParagraph: any = new Paragraph(undefined);
                try {
                    _HTMLToDocIOMapper.addItemToContainer(body, dtParagraph);
                } catch (error) {
                    console.error('Error adding dt paragraph to body:', error);
                    continue;
                }
                // Add bold style to dt element so it gets applied when processing content
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (!((child as any)._styles)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (child as any)._styles = {};
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ((child as any)._styles as Record<string, string>).fontWeight = 'bold';
                // Map content - will apply bold through character styles
                paragraphMapper.mapHTMLParagraphContent(child, dtParagraph, document, body);
            } else if (tagName === 'dd') {
                // Map definition (dd) as an indented paragraph
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ddParagraph: any = new Paragraph(undefined);
                try {
                    _HTMLToDocIOMapper.addItemToContainer(body, ddParagraph);
                } catch (error) {
                    console.error('Error adding dd paragraph to body:', error);
                    continue;
                }
                // Apply left indentation to dd (0.125 inch for subtle indentation)
                if (ddParagraph.paragraphFormat) {
                    ddParagraph.paragraphFormat.leftIndent = 180; // 0.125 inch in twips
                }
                // Map content
                paragraphMapper.mapHTMLParagraphContent(child, ddParagraph, document, body);
            }
        }
    }
}
