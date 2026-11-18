/**
 */
/* eslint-disable security/detect-object-injection, valid-jsdoc */
import { ParagraphAlignment } from '../document/alignment.js';
import { WordDocument } from '../document/document.js';
import { Paragraph, ParagraphOwner } from '../document/paragraph.js';
import { TextRange, BreakType } from '../document/text-range.js';
import { SubSuperScript } from '../document/sub-super-script.js';
import { UnderlineStyle } from '../document/underline-style.js';
import { HyperlinkType } from '../fields/index.js';
import { BuiltInStyle } from '../styles/builtin-catalog.js';
import { _HTMLElement, _HTMLParagraphElement, _HTMLHeadingElement } from '../html-parser/dom-node.js';
import { _ImageMapper } from './image-mapper.js';
import { CSSStyleCache, applyCharacterDeclarations, applyParagraphDeclarations } from './css-paragraph-style-builder.js';
import { CSSCharacterStyleCache } from './css-character-style-builder.js';
import { cssToCharacterFormat, CharacterFormatDelta } from './css-character-format-converter.js';

/**
 */
export class _ParagraphMapper {
    /**
     * Apply inherited character properties (for example from the body element) to a text range.
     *
     * @param {TextRange} textRange - The text range to format
     * @param {Record<string, string>} styles - The inherited CSS declarations
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static applyInheritedCharacterStyles(textRange: any, styles: Record<string, string>): void {
        applyCharacterStylesToRange(textRange, styles, undefined);
    }

    /**
     * CSS rules collected from stylesheets.
     *
     * @private
     */
    static _cssRules: any[] = [];

    /**
     * CSS style cache for creating paragraph styles.
     *
     * @private
     */
    static _styleCache: CSSStyleCache | undefined;

    /**
     * CSS character style cache for creating character styles from class selectors.
     *
     * @private
     */
    static _characterStyleCache: CSSCharacterStyleCache | undefined;

    /**
     * Set CSS rules for class selector processing.
     *
     * @private
     */
    static setCSSRules(rules: any[]): void {
        this._cssRules = rules || [];
    }

    /**
     * Set CSS style cache for paragraph style creation.
     *
     * @private
     */
    static setStyleCache(cache: CSSStyleCache | undefined): void {
        this._styleCache = cache;
    }

    /**
     * Set CSS character style cache for character style creation.
     *
     * @private
     */
    static setCharacterStyleCache(cache: CSSCharacterStyleCache | undefined): void {
        this._characterStyleCache = cache;
    }

    /**
     * Map an HTML paragraph element to a DocIO Paragraph with applied styles.
     *
     * Handles inline formatting tags (b, strong, i, em, u, mark, code, sub, sup, etc.)
     * and applies character-level styles. Supports color, bold, italic, font-size, font-family.
     * Also applies paragraph styles based on CSS class selectors.
     *
     * @param {_HTMLParagraphElement} pElement - The HTML <p> element to map
     * @param {WordDocument} document - The WordDocument (for TextRange context)
     * @param {ParagraphOwner} [owner] - Optional paragraph owner (Body) to attach the paragraph to
     * @returns {Paragraph} A new Paragraph with applied styles
     * @private
     */
    static mapHTMLParagraph(
        pElement: _HTMLParagraphElement,
        document: WordDocument,
        owner?: ParagraphOwner
    ): Paragraph {
    // Create paragraph - if owner provided, attach immediately before processing items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const paragraph: any = new Paragraph(undefined);
        
        // Apply CSS class-based paragraph style BEFORE attaching to owner
        if (this._styleCache && owner) {
            applyCSSClassStyleToParagraph(paragraph, pElement, this._styleCache);
        }
        
        // If an owner is provided, attach AFTER applying style
        if (owner) {
            // For Body owner, use items.add() API; for ParagraphOwner, use appendParagraph()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((owner as any).items) {
                // This is a Body instance
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (owner as any).items.add(paragraph);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } else if ((owner as any).appendParagraph) {
                // This is another ParagraphOwner type
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (owner as any).appendParagraph(paragraph);
            }
        }
        // Process paragraph content: child nodes with inline formatting
        const hasContent: boolean = this.processNodeContent(pElement, paragraph, document, !!owner);
        // Apply paragraph-level styles (alignment) only if paragraph is attached to an owner
        // Detached paragraphs cannot have styles modified
        if (hasContent && owner) {
            applyParagraphStyles(paragraph, pElement._styles, pElement);
        }
        return paragraph;
    }
    /**
     * Map HTML paragraph content to an existing Paragraph object.
     * Used when reusing an empty paragraph instead of creating a new one.
     *
     * @param {_HTMLParagraphElement} pElement - The HTMLParagraphElement to map
     * @param {Paragraph} paragraph - The Paragraph object to populate (must be already attached to owner)
     * @param {WordDocument} document - The WordDocument (for TextRange context)
     * @param {ParagraphOwner} owner - The paragraph owner (for isAttached flag)
     * @returns {boolean} True if content was added
     * @private
     */
    static mapHTMLParagraphContent(
        pElement: _HTMLParagraphElement,
        paragraph: Paragraph,
        document: WordDocument,
        owner: ParagraphOwner
    ): boolean {
    // Process paragraph content: split at <br> elements to create multiple paragraphs
        const hasContent: boolean = this.processNodeContentWithBrHandling(pElement, paragraph, document, !!owner, owner);
        // Apply paragraph-level styles (alignment) - paragraph must be attached to owner
        if (hasContent) {
            applyParagraphStyles(paragraph, pElement._styles, pElement);
        }
        return hasContent;
    }
    /**
     * Map an HTML heading element (h1-h6) to a DocIO Paragraph with heading style.
     *
     * Similar to mapHTMLParagraph, but applies the appropriate heading style
     * (Heading1-Heading9) based on the heading level.
     *
     * @param {_HTMLHeadingElement} hElement - The HTML heading element to map (h1-h6)
     * @param {WordDocument} document - The WordDocument (for TextRange context)
     * @param {ParagraphOwner} [owner] - Optional heading owner (Body) to attach the paragraph to
     * @returns {Paragraph} A new Paragraph with heading style applied
     * @private
     */
    static mapHTMLHeading(
        hElement: _HTMLHeadingElement,
        document: WordDocument,
        owner?: ParagraphOwner
    ): Paragraph {
    // Create paragraph - if owner provided, attach immediately before processing items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const paragraph: any = new Paragraph(undefined);
        // If an owner is provided, attach BEFORE processing content so items can be added
        if (owner) {
            // For Body owner, use items.add() API; for ParagraphOwner, use appendParagraph()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((owner as any).items) {
                // This is a Body instance
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (owner as any).items.add(paragraph);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } else if ((owner as any).appendParagraph) {
                // This is another ParagraphOwner type
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (owner as any).appendParagraph(paragraph);
            }
        }
        // Process heading content: child nodes with inline formatting
        const hasContent: boolean = this.processNodeContent(hElement, paragraph, document, !!owner);
        // Apply heading style and paragraph-level styles only if paragraph is attached to an owner
        if (hasContent && owner) {
            // Apply the heading style based on level (h1 → Heading1, h2 → Heading2, etc.)
            const level: number = hElement.level;
            this.applyHeadingStyle(paragraph, level);
            // Also apply any other paragraph-level styles from the element
            applyParagraphStyles(paragraph, hElement._styles, hElement);
        }
        return paragraph;
    }
    /**
     * Map HTML heading content to an existing Paragraph object.
     * Used when reusing an empty paragraph instead of creating a new one.
     *
     * @param {unknown} hElement - The HTMLHeadingElement to map
     * @param {unknown} paragraph - The Paragraph object to populate (must be already attached to owner)
     * @param {unknown} document - The WordDocument (for TextRange context)
     * @param {unknown} owner - The paragraph owner (for isAttached flag)
     * @returns True if content was added
     * @private
     */
    static mapHTMLHeadingContent(
        hElement: _HTMLHeadingElement,
        paragraph: Paragraph,
        document: WordDocument,
        owner: ParagraphOwner
    ): boolean {
    // Process heading content: child nodes with inline formatting
        const hasContent: boolean = this.processNodeContent(hElement, paragraph, document, !!owner);
        // Apply heading style and paragraph-level styles - paragraph must be attached to owner
        if (hasContent) {
            // Apply the heading style based on level
            const level: number = hElement.level;
            this.applyHeadingStyle(paragraph, level);
            // Also apply any other paragraph-level styles from the element
            applyParagraphStyles(paragraph, hElement._styles, hElement);
        }
        return hasContent;
    }
    /**
     * Apply heading style to a paragraph based on the heading level.
     * Maps HTML heading levels (1-6) to Word heading styles (Heading1-Heading9).
     *
     * @param {Paragraph} paragraph - The paragraph to apply the heading style to
     * @param {number} level - The heading level (1-6)
     * @returns {void}
     * @private
     */
    private static applyHeadingStyle(paragraph: Paragraph, level: number): void {
        const headingStyles: Record<number, string> = {
            1: BuiltInStyle.Heading1,
            2: BuiltInStyle.Heading2,
            3: 'Heading3',
            4: 'Heading4',
            5: 'Heading5',
            6: 'Heading6'
        };
        const styleId: string = headingStyles[level] || BuiltInStyle.Heading1;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (paragraph && (paragraph as any).applyStyle) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (paragraph as any).applyStyle(styleId);
            }
        } catch (error) {
            console.error(`Error applying heading style ${styleId}:`, error);
        }
    }
    /**
     * Process node content recursively, handling both text nodes and inline elements.
     * Creates separate text ranges for differently formatted content.
     * Handles special elements like <br> that don't contain text.
     * Maintains document order by processing child nodes in sequence.
     *
     * @param {_HTMLElement} node - The HTML element to process
     * True when a text node has an inline element on both sides (skipping other
     * whitespace-only text nodes). Whitespace in that position is significant
     * per HTML and must be kept as one collapsed space.
     *
     * @param {unknown} textNode - The textNode value
     * @param {unknown} parent - The parent value
     * @returns {boolean} True when whitespace is between inline siblings
     * @private
     */
    private static hasInlineSiblingsAround(textNode: _HTMLElement, parent: _HTMLElement): boolean {
        const inlineTags: string[] = ['span', 'b', 'i', 'u', 'strong', 'em', 's', 'ins', 'del', 'code',
            'samp', 'kbd', 'mark', 'small', 'big', 'sub', 'sup', 'a', 'abbr', 'cite', 'dfn', 'var',
            'q', 'bdi', 'bdo', 'br', 'wbr', 'font', 'img'];
        const isInline = (el: _HTMLElement): boolean => {
            const tag: string = el && el.tagName ? el.tagName.toLowerCase() : '';
            return inlineTags.indexOf(tag) !== -1;
        };
        const isBlankText = (el: _HTMLElement): boolean =>
            el && el.tagName === '#text' && isBlankHtmlText(el._text || '');
        const siblings: _HTMLElement[] = parent._childNodes;
        const myIndex: number = siblings.indexOf(textNode);
        if (myIndex === -1) {
            return false;
        }
        let hasPrev: boolean = false;
        for (let i: number = myIndex - 1; i >= 0; i--) {
            if (isBlankText(siblings[i])) { continue; }
            hasPrev = isInline(siblings[i]);
            break;
        }
        if (!hasPrev) {
            return false;
        }
        for (let i: number = myIndex + 1; i < siblings.length; i++) {
            if (isBlankText(siblings[i])) { continue; }
            return isInline(siblings[i]);
        }
        return false;
    }

    private static processNodeContent(
        node: _HTMLElement,
        paragraph: Paragraph,
        document: WordDocument,
        isAttached: boolean
    ): boolean {
        let hasContent: boolean = false;
        // Process child nodes in document order (mix of text nodes and elements)
        if (node._childNodes && Array.isArray(node._childNodes)) {
            for (const child of node._childNodes) {
                // Check if it's a text node (nodeType === 3 or tagName === '#text')
                const isTextNode: boolean = typeof child === 'string' ||
          (child && typeof child === 'object' && (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ('nodeType' in child && (child as any).nodeType === 3) ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ('tagName' in child && (child as any).tagName === '#text')
          ));
                if (isTextNode) {
                    // Handle text nodes
                    const text: string = typeof child === 'string' ? child :
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ((child as any).textContent || (child as any)._nodeValue || (child as any)._text || '');
                    
                    // Get parent tag name to check if we're in a <pre> element
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const parentTagName = node.tagName ? node.tagName.toLowerCase() : '';
                    const isPreTag: boolean = parentTagName === 'pre';
                    
                    // For <pre> tags, preserve ALL whitespace (including whitespace-only text nodes)
                    // For other tags, skip whitespace-only text nodes — except:
                    //  - a non-breaking space is rendered content, not collapsible whitespace
                    //  - whitespace between two inline siblings is significant (HTML keeps
                    //    one collapsed space, e.g. "<b>bold</b> <i>it</i>")
                    const isBlank: boolean = isBlankHtmlText(text);
                    const shouldSkip: boolean = !isPreTag && isBlank && !this.hasInlineSiblingsAround(child, node);
                    if (shouldSkip) {
                        continue;
                    }
                    
                    // Process non-empty or <pre> whitespace text
                    if (text.length > 0) {
                        // isPreTag already defined above
                        
                        if (isPreTag) {
                            // For <pre> tags, handle line breaks explicitly
                            // Split by newlines and add line breaks between them
                            const lines: string[] = text.split(/\r?\n/);
                            for (let i: number = 0; i < lines.length; i++) {
                                const line: string = lines[i];
                                
                                // Add the line text if it's not empty (or if it's the last line and was originally there)
                                if (line.length > 0 || i < lines.length - 1) {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const textRange: any = new TextRange(document);
                                    textRange.text = line;
                                    
                                    // Apply character styles
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const isBlockElement = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].indexOf(parentTagName) !== -1;
                                    if (isBlockElement) {
                                        applyBlockRunStyles(textRange, node);
                                    } else {
                                        applyCharacterStylesToRange(textRange, {}, node);
                                    }
                                    
                                    if (isAttached) {
                                        try {
                                            paragraph.items.add(textRange);
                                        } catch (error) {
                                            console.error('Error adding text range to paragraph:', error);
                                        }
                                    } else {
                                        // For detached paragraphs, store reference for testing (first one only)
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        if (!(paragraph as any).__testTextRange) {
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            (paragraph as any).__testTextRange = textRange;
                                        }
                                    }
                                    hasContent = true;
                                }
                                
                                // Add a line break after each line except the last
                                if (i < lines.length - 1) {
                                    try {
                                        paragraph.appendBreak(BreakType.LineBreak);
                                        hasContent = true;
                                    } catch (error) {
                                        console.error('Error adding line break:', error);
                                    }
                                }
                            }
                        } else {
                            // For non-pre tags, use normal whitespace normalization
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const textRange: any = new TextRange(document);
                            // Collapse multiple spaces/tabs/newlines into single space
                            const normalizedText: string = text.replace(HTML_BLANK_PATTERN, ' ');
                            textRange.text = normalizedText;
                            
                            // For heading and paragraph elements, don't apply character-level styles from the parent
                            // to text content; only apply inline element styles (b, i, em, strong, etc.)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const isBlockElement = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].indexOf(parentTagName) !== -1;;
                            
                            // If parent is a block element (heading/paragraph), pass undefined instead of node
                            // to prevent CSS character styles from the heading from applying to text content.
                            // Inline tags like <b>, <i>, <em>, etc. will apply their styles via processInlineElement.
                            if (isBlockElement) {
                                applyBlockRunStyles(textRange, node);
                            } else {
                                applyCharacterStylesToRange(textRange, {}, node);
                            }
                            if (isAttached) {
                                try {
                                    paragraph.items.add(textRange);
                                } catch (error) {
                                    console.error('Error adding text range to paragraph:', error);
                                }
                            } else {
                                // For detached paragraphs, store reference for testing (first one only)
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                if (!(paragraph as any).__testTextRange) {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    (paragraph as any).__testTextRange = textRange;
                                }
                            }
                            hasContent = true;
                        }
                    }
                } else if (child.tagName && child.tagName !== '#text') {
                    // Handle element nodes (skip text nodes)
                    // Pass parent node to detect if we're in <pre> tag
                    hasContent = this.processInlineElement(child, paragraph, document, isAttached, node) || hasContent;
                }
            }
        }
        // Also process direct text on the node if it has text property (fallback for some cases)
        if (node._text && !isBlankHtmlText(node._text) && (!node._childNodes || node._childNodes.length === 0)) {
            // Get parent tag name to check if we're in a <pre> element
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const parentTagName = node.tagName ? node.tagName.toLowerCase() : '';
            const isPreTag: boolean = parentTagName === 'pre';
            
            if (isPreTag) {
                // For <pre> tags, handle line breaks explicitly
                const lines: string[] = node._text.split(/\r?\n/);
                for (let i: number = 0; i < lines.length; i++) {
                    const line: string = lines[i];
                    
                    // Add the line text if it's not empty (or if it's the last line and was originally there)
                    if (line.length > 0 || i < lines.length - 1) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const textRange: any = new TextRange(document);
                        textRange.text = line;
                        
                        // For heading and paragraph elements, don't apply character-level styles
                        const isBlockElement = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].indexOf(parentTagName) !== -1;;
                        
                        if (isBlockElement) {
                            applyBlockRunStyles(textRange, node);
                        } else {
                            applyCharacterStylesToRange(textRange, node._styles, node);
                        }
                        
                        if (isAttached) {
                            try {
                                paragraph.items.add(textRange);
                            } catch (error) {
                                console.error('Error adding text range to paragraph:', error);
                            }
                        } else {
                            // For detached paragraphs, store reference for testing
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            if (!(paragraph as any).__testTextRange) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (paragraph as any).__testTextRange = textRange;
                            }
                        }
                    }
                    
                    // Add a line break after each line except the last
                    if (i < lines.length - 1) {
                        try {
                            paragraph.appendBreak(BreakType.LineBreak);
                        } catch (error) {
                            console.error('Error adding line break:', error);
                        }
                    }
                }
            } else {
                // For non-pre tags, use normal whitespace normalization
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const textRange: any = new TextRange(document);
                const normalizedText: string = node._text.replace(HTML_BLANK_PATTERN, ' ');
                textRange.text = normalizedText;
                
                // For heading and paragraph elements, don't apply character-level styles from the parent
                const isBlockElement = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].indexOf(parentTagName) !== -1;;
                
                if (isBlockElement) {
                    applyBlockRunStyles(textRange, node);
                } else {
                    applyCharacterStylesToRange(textRange, node._styles, node);
                }
                if (isAttached) {
                    try {
                        paragraph.items.add(textRange);
                    } catch (error) {
                        console.error('Error adding text range to paragraph:', error);
                    }
                } else {
                    // For detached paragraphs, store reference for testing
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (!(paragraph as any).__testTextRange) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (paragraph as any).__testTextRange = textRange;
                    }
                }
            }
        }
        return hasContent;
    }
    /**
     * Process paragraph content while handling <br> tags specially.
     * When <br> is encountered, creates a new paragraph for content after the break.
     * This ensures inline elements separated by <br> appear on separate lines in Word.
     *
     * @param {_HTMLElement} node - The parent node (paragraph/heading) to process
     * @param {Paragraph} paragraph - The first paragraph to add content to
     * @param {WordDocument} document - The WordDocument context
     * @param {boolean} isAttached - Whether paragraph is attached to an owner
     * @param {ParagraphOwner} [owner] - Optional owner to attach new paragraphs to
     * @returns {boolean} True if any content was added
     * @private
     */
    private static processNodeContentWithBrHandling(
        node: _HTMLElement,
        paragraph: Paragraph,
        document: WordDocument,
        isAttached: boolean,
        owner?: ParagraphOwner
    ): boolean {
        let hasContent: boolean = false;
        let currentParagraph: Paragraph = paragraph;
        
        // Split children into groups separated by <br>
        if (node._childNodes && Array.isArray(node._childNodes)) {
            let currentGroup: any[] = [];
            
            for (const child of node._childNodes) {
                // Check if this is a <br> tag
                const isBrTag = child.tagName && child.tagName.toLowerCase() === 'br';
                
                if (isBrTag) {
                    // Process the current group in the current paragraph
                    if (currentGroup.length > 0) {
                        const groupHasContent: boolean = this.processNodeGroup(currentGroup, currentParagraph, document, isAttached, node);
                        hasContent = groupHasContent || hasContent;
                    }
                    
                    // Create a new paragraph for the next group (after <br>)
                    if (owner) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        currentParagraph = new Paragraph(undefined);
                        if ((owner as any).items) {
                            // Body owner
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (owner as any).items.add(currentParagraph);
                        } else if ((owner as any).appendParagraph) {
                            // Other owner types
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (owner as any).appendParagraph(currentParagraph);
                        }
                        // Copy paragraph styles from original
                        try {
                            if (currentParagraph.paragraphFormat && paragraph.paragraphFormat) {
                                currentParagraph.paragraphFormat.beforeSpacing = paragraph.paragraphFormat.beforeSpacing;
                                currentParagraph.paragraphFormat.afterSpacing = paragraph.paragraphFormat.afterSpacing;
                                currentParagraph.paragraphFormat.leftIndent = paragraph.paragraphFormat.leftIndent;
                                currentParagraph.paragraphFormat.rightIndent = paragraph.paragraphFormat.rightIndent;
                            }
                        } catch (error) {
                            // Ignore errors copying format
                        }
                    }
                    
                    // Clear the current group
                    currentGroup = [];
                } else {
                    // Add to current group
                    currentGroup.push(child);
                }
            }
            
            // Process remaining group
            if (currentGroup.length > 0) {
                const groupHasContent: boolean = this.processNodeGroup(currentGroup, currentParagraph, document, isAttached, node);
                hasContent = groupHasContent || hasContent;
            }
        }
        
        return hasContent;
    }
    
    /**
     * Process a group of child nodes (text/elements) and add their content to a paragraph.
     * This is extracted from processNodeContent to be reusable with <br> handling.
     *
     * @param {any[]} children - Array of child nodes to process
     * @param {Paragraph} paragraph - The paragraph to add content to
     * @param {WordDocument} document - The WordDocument context
     * @param {boolean} isAttached - Whether paragraph is attached to an owner
     * @param {_HTMLElement} parentNode - The parent HTML element (for context)
     * @returns {boolean} True if any content was added
     * @private
     */
    private static processNodeGroup(
        children: any[],
        paragraph: Paragraph,
        document: WordDocument,
        isAttached: boolean,
        parentNode: _HTMLElement
    ): boolean {
        let hasContent: boolean = false;
        
        for (const child of children) {
            // Check if it's a text node
            const isTextNode: boolean = typeof child === 'string' ||
                (child && typeof child === 'object' && (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ('nodeType' in child && (child as any).nodeType === 3) ||
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ('tagName' in child && (child as any).tagName === '#text')
                ));
            
            if (isTextNode) {
                // Handle text nodes
                const text: string = typeof child === 'string' ? child :
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ((child as any).textContent || (child as any)._nodeValue || (child as any)._text || '');
                
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const parentTagName = parentNode.tagName ? parentNode.tagName.toLowerCase() : '';
                const isPreTag: boolean = parentTagName === 'pre';
                
                // For <pre> tags with newlines, split and add each line with line breaks
                if (isPreTag && text.includes('\n')) {
                    const lines: string[] = text.split(/\r?\n/);
                    for (let i: number = 0; i < lines.length; i++) {
                        const line: string = lines[i];
                        // Add line text if not empty, or if between other lines
                        if (line.length > 0 || i < lines.length - 1) {
                            if (line.length > 0) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const textRange: any = new TextRange(document);
                                textRange.text = line;
                                
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const isBlockElement = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].indexOf(parentTagName) !== -1;;
                                
                                if (isBlockElement) {
                                    applyBlockRunStyles(textRange, parentNode);
                                } else {
                                    applyCharacterStylesToRange(textRange, {}, parentNode);
                                }
                                
                                if (isAttached) {
                                    try {
                                        paragraph.items.add(textRange);
                                    } catch (error) {
                                        console.error('Error adding text range to paragraph:', error);
                                    }
                                } else {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    if (!(paragraph as any).__testTextRange) {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        (paragraph as any).__testTextRange = textRange;
                                    }
                                }
                                hasContent = true;
                            }
                            
                            // Add line break after each line except the last
                            if (i < lines.length - 1) {
                                try {
                                    paragraph.appendBreak(BreakType.LineBreak);
                                    hasContent = true;
                                } catch (error) {
                                    console.error('Error adding line break:', error);
                                }
                            }
                        }
                    }
                } else if (!isBlankHtmlText(text) || this.hasInlineSiblingsAround(child, parentNode)) {
                    // For non-<pre> tags or single-line <pre> tags
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const textRange: any = new TextRange(document);
                    const normalizedText: string = isPreTag ? text : text.replace(HTML_BLANK_PATTERN, ' ');
                    textRange.text = normalizedText;
                    
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const isBlockElement = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].indexOf(parentTagName) !== -1;;
                    
                    if (isBlockElement) {
                        applyBlockRunStyles(textRange, parentNode);
                    } else {
                        applyCharacterStylesToRange(textRange, {}, parentNode);
                    }
                    
                    if (isAttached) {
                        try {
                            paragraph.items.add(textRange);
                        } catch (error) {
                            console.error('Error adding text range to paragraph:', error);
                        }
                    } else {
                        // For detached paragraphs, store reference
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (!(paragraph as any).__testTextRange) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (paragraph as any).__testTextRange = textRange;
                        }
                    }
                    hasContent = true;
                }
            } else if (child.tagName && child.tagName !== '#text') {
                // Handle element nodes
                hasContent = this.processInlineElement(child, paragraph, document, isAttached) || hasContent;
            }
        }
        
        return hasContent;
    }
    /**
     * Process an inline element, extracting text and applying tag-specific formatting.
     * Handles void elements like <br> that don't contain text.
     *
     * @param {unknown} element - The inline element to process
     * @param {Paragraph} paragraph - The paragraph to add content to
     * @param {WordDocument} document - The WordDocument context
     * @param {boolean} isAttached - Whether the paragraph is attached to an owner
     * @returns {boolean} True if any content was added
     * @private
     */
    static processInlineElement(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        element: any,
        paragraph: Paragraph,
        document: WordDocument,
        isAttached: boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parentNode?: any
    ): boolean {
        const tagName: string = element.tagName ? element.tagName.toLowerCase() : '';
        // Handle self-closing/void elements like <br>
        if (tagName === 'br') {
            try {
                paragraph.appendBreak(BreakType.LineBreak);
                return true;
            } catch (error) {
                console.error('Error adding line break to paragraph:', error);
                return false;
            }
        }
        // Handle horizontal rule <hr> (insert as text or break)
        if (tagName === 'hr') {
            try {
                paragraph.appendBreak(BreakType.LineBreak);
                return true;
            } catch (error) {
                console.error('Error adding break for <hr> to paragraph:', error);
                return false;
            }
        }
        // Handle <img> tags - add as Picture objects if data is available
        if (tagName === 'img') {
            try {
                // Extract image data
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const imageData: any = _ImageMapper.extractImageData(element);
                // If we have image bytes and the paragraph is attached, add as Picture
                if (imageData && imageData.bytes && isAttached) {
                    try {
                        // eslint-disable-next-line
            const appendImageMethod = (paragraph as any).appendImage;
                        if (appendImageMethod) {
                            appendImageMethod.call(paragraph, imageData.bytes, {
                                width: imageData.width,
                                height: imageData.height,
                                name: imageData.name || imageData.alt,
                                title: imageData.title,
                                description: imageData.alt
                            });
                        }
                        return true;
                    } catch (error) {
                        console.error('Error appending image to paragraph:', error);
                        // Fall through to alt text fallback below
                    }
                }
                // Fallback: if image cannot be added as Picture, add alt text
                const altText: string | null = element.getAttribute('alt') || '';
                if (altText) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const textRange: any = new TextRange(document);
                    textRange.text = `[Image: ${altText}]`;
                    const styles: Record<string, string> = { ...element.styles };
                    applyCharacterStylesToRange(textRange, styles, element);
                    if (isAttached) {
                        paragraph.items.add(textRange);
                    } else {
                        // For detached paragraphs, store reference for testing (only first one)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (!(paragraph as any).__testTextRange) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (paragraph as any).__testTextRange = textRange;
                        }
                    }
                    return true;
                }
                // If no image data and no alt text, return false (no content added)
                return false;
            } catch (error) {
                console.error('Error processing image tag:', error);
                return false;
            }
        }
        // Handle <a> (anchor/hyperlink) tags - use appendHyperlink for proper hyperlink support
        if (tagName === 'a') {
            const href: string | null = element._attributes && element._attributes.get ? element._attributes.get('href') || '' : '';
            const textContent: string = element.textContent ? element.textContent.trim() : '';
            if (textContent && href && isAttached) {
                try {
                    // Use appendHyperlink to create a proper hyperlink field
                    // appendHyperlink adds: Field, TextRange (instruction), Separator, TextRange (result), End
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const hyperlink: any = (paragraph as any).appendHyperlink(href, textContent, HyperlinkType.WebLink);
                    // The hyperlink was successfully added. Now apply the hyperlink character style
                    if (hyperlink && hyperlink.field) {
                        // Get the paragraph's items collection
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const items: any = (paragraph as any).items;
                        if (items && typeof items.snapshot === 'function') {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const itemsArray: any[] = items.snapshot();
                            let fieldIndex: number = -1;
                            // Find the field begin marker (should be the one we just added)
                            for (let i: number = itemsArray.length - 5; i < itemsArray.length; i++) {
                                if (i >= 0 && itemsArray[i] === hyperlink.field) {
                                    fieldIndex = i;
                                    break;
                                }
                            }
                            // The result text range is at fieldIndex + 3 (after Field, TextRange, Separator)
                            // Structure: [Field, TextRange(instruction), Separator, TextRange(result), End]
                            if (fieldIndex >= 0 && fieldIndex + 3 < itemsArray.length) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const resultRange: any = itemsArray[fieldIndex + 3];
                                if (resultRange && resultRange.characterFormat) {
                                    // Apply the "Hyperlink" character style which provides blue + underline
                                    resultRange.characterFormat.characterStyle = 'Hyperlink';
                                    // If custom styles are provided, apply them as overrides
                                    const styles: Record<string, string> = { ...element.styles };
                                    if (styles.color || styles.textDecoration) {
                                        applyCharacterStylesToRange(resultRange, styles, element);
                                    }
                                }
                            }
                        }
                    }
                    return true;
                } catch (error) {
                    console.error(`Error adding hyperlink to paragraph: ${href}`, error);
                }
            } else if (textContent && !isAttached) {
                // For detached paragraphs, we can't use appendHyperlink (no owner), so store as styled text
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const textRange: any = new TextRange(document);
                    textRange.text = textContent;
                    // Get base styles from the element
                    const styles: Record<string, string> = { ...element.styles };
                    // Apply link styling (blue color and underline)
                    styles.color = styles.color || '#0563C1'; // Office blue
                    styles.textDecoration = styles.textDecoration ? styles.textDecoration + ' underline' : 'underline';
                    // Apply tag-specific formatting
                    applyInlineTagFormatting(tagName, styles, element);
                    // Apply the combined styles to the text range
                    applyCharacterStylesToRange(textRange, styles, element);
                    // Store the href in a data property for later use
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (textRange as any).__hyperlinkHref = href;
                    // Store reference for testing (only first one)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (!(paragraph as any).__testTextRange) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (paragraph as any).__testTextRange = textRange;
                    }
                    // For detached paragraphs, still try to add to items if possible
                    if (paragraph.items && paragraph.items.add) {
                        try {
                            paragraph.items.add(textRange);
                        } catch (e) {
                            // If add fails, at least we stored the reference above
                        }
                    }
                    return true;
                } catch (error) {
                    console.error(`Error adding text range for <${tagName}> to paragraph:`, error);
                }
            }
            return false;
        }
        
        // For other inline elements (span, b, i, u, strong, em, etc.):
        // Recursively process children to preserve nested formatting
        let hasContent: boolean = false;
        const styles: Record<string, string> = { ...element.styles };
        
        // Apply tag-specific formatting
        applyInlineTagFormatting(tagName, styles, element);
        
        // Process children (both text nodes and nested inline elements)
        if (element._childNodes && Array.isArray(element._childNodes)) {
            for (const child of element._childNodes) {
                // Check if it's a text node
                const isTextNode: boolean = typeof child === 'string' ||
                    (child && typeof child === 'object' && (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ('nodeType' in child && (child as any).nodeType === 3) ||
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ('tagName' in child && (child as any).tagName === '#text')
                    ));
                
                if (isTextNode) {
                    // Handle text node within inline element
                    const text: string = typeof child === 'string' ? child :
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ((child as any).textContent || (child as any)._nodeValue || (child as any)._text || '');

                    if (!isBlankHtmlText(text) || this.hasInlineSiblingsAround(child, element)) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const textRange: any = new TextRange(document);
                        // Check if parent is <pre> tag - if so, preserve whitespace
                        const parentTagName: string = parentNode && parentNode.tagName ? parentNode.tagName.toLowerCase() : '';
                        const isPreTag: boolean = parentTagName === 'pre';
                        const normalizedText: string = isPreTag ? text : text.replace(HTML_BLANK_PATTERN, ' ');
                        textRange.text = normalizedText;
                        
                        // Apply the parent inline element's styles to text content
                        applyCharacterStylesToRange(textRange, styles, element);
                        
                        if (isAttached) {
                            try {
                                paragraph.items.add(textRange);
                                hasContent = true;
                            } catch (error) {
                                console.error(`Error adding text range to paragraph:`, error);
                            }
                        } else {
                            // For detached paragraphs, store reference for testing (only first one)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            if (!(paragraph as any).__testTextRange) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (paragraph as any).__testTextRange = textRange;
                            }
                            hasContent = true;
                        }
                    }
                } else if (child.tagName && child.tagName !== '#text') {
                    // Handle nested inline elements recursively
                    const childTagName: string = child.tagName ? child.tagName.toLowerCase() : '';
                    // Only recurse if it's an inline element; block elements should not appear inside inline
                    const inlineElements = ['span', 'b', 'i', 'u', 'strong', 'em', 's', 'ins', 'del', 'code', 'samp', 'kbd', 'mark', 'small', 'big', 'sub', 'sup', 'a', 'abbr', 'cite', 'dfn', 'var', 'q', 'bdi', 'bdo', 'br', 'wbr', 'font'];
                    if (inlineElements.indexOf(childTagName) !== -1) {
                        // Merge parent styles into child for proper style inheritance
                        // Child's own styles take precedence over parent styles
                        const inheritedStyles: Record<string, string> = { ...styles };
                        if (child.styles) {
                            Object.assign(inheritedStyles, child.styles);
                        }
                        // Temporarily replace child._styles with merged styles
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const originalStyles = (child as any)._styles;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (child as any)._styles = inheritedStyles;
                        
                        // Pass parent node to detect if we're in <pre> tag
                        const childProcessed = this.processInlineElement(child, paragraph, document, isAttached, parentNode);
                        hasContent = childProcessed || hasContent;
                        
                        // Restore original styles
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (child as any)._styles = originalStyles;
                    }
                }
            }
        }
        
        // If no children, try to get text directly from element
        if (!hasContent && element._text && !isBlankHtmlText(element._text)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const textRange: any = new TextRange(document);
            // Check if parent is <pre> tag - if so, preserve whitespace
            const parentTagName: string = parentNode && parentNode.tagName ? parentNode.tagName.toLowerCase() : '';
            const isPreTag: boolean = parentTagName === 'pre';
            const normalizedText: string = isPreTag ? element._text : element._text.replace(HTML_BLANK_PATTERN, ' ');
            textRange.text = normalizedText;
            
            // Apply styles to text range
            applyCharacterStylesToRange(textRange, styles, element);
            
            if (isAttached) {
                try {
                    paragraph.items.add(textRange);
                    hasContent = true;
                } catch (error) {
                    console.error(`Error adding text range for <${tagName}> to paragraph:`, error);
                }
            } else {
                // For detached paragraphs, save reference for testing (only first one)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (!(paragraph as any).__testTextRange) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (paragraph as any).__testTextRange = textRange;
                }
                hasContent = true;
            }
        }
        
        return hasContent;
    }
}
/**
 * Apply formatting styles based on inline tag name (b, i, u, mark, code, sub, sup).
 *
 * @param {string} tagName - The HTML tag name to process
 * @param {Record<string, string>} styles - The styles object to update
 * @param {unknown} element - The HTML element being processed
 * @returns {void}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function applyInlineTagFormatting(tagName: string, styles: Record<string, string>, element: any): void {
    switch (tagName) {
    case 'b':
    case 'strong':
        styles.fontWeight = 'bold';
        break;
    case 'i':
    case 'em':
        styles.fontStyle = 'italic';
        break;
    case 'u':
        styles.textDecoration = 'underline';
        break;
    case 'mark':
        // Highlight/yellow background - apply as yellow color or via style
        if (!styles.backgroundColor) {
            styles.backgroundColor = 'yellow';
        }
        break;
    case 'small':
        // Reduce font size to 80% of current
        if (!styles.fontSize) {
            styles.fontSize = '9.6pt'; // 80% of 12pt default
        }
        break;
    case 'big':
        // Increase font size to 125% of current
        if (!styles.fontSize) {
            styles.fontSize = '15pt'; // 125% of 12pt default
        }
        break;
    case 'code':
    case 'kbd':
    case 'samp':
        // Monospace font
        if (!styles.fontFamily) {
            styles.fontFamily = 'Courier New, monospace';
        }
        break;
    case 'del':
    case 's':
        styles.textDecoration = 'line-through';
        break;
    case 'sub':
        styles.verticalAlign = 'subscript';
        break;
    case 'sup':
        styles.verticalAlign = 'superscript';
        break;
    case 'var':
        styles.fontStyle = 'italic';
        break;
    case 'ins':
        styles.textDecoration = 'underline';
        break;
    case 'abbr':
    case 'cite':
    case 'dfn':
    case 'q':
    case 'bdi':
    case 'bdo':
    case 'span':
        // These tags don't have default formatting
        // Use their inline styles if available
        break;
    case 'br':
    case 'hr':
    case 'wbr':
        // Line breaks - handled separately in content processing
        break;
    case 'font':
        // Handle <font> tag color and size attributes
        if (element && element._attributes) {
            // Handle color attribute
            const color = element._attributes.get ? element._attributes.get('color') : element._attributes.color;
            if (color && !styles.color) {
                // Color can be hex like "#FF0000" or named like "red" or "blue"
                if (color.startsWith('#') || /^[0-9a-fA-F]{6}$/.test(color)) {
                    styles.color = color.startsWith('#') ? color : '#' + color;
                } else {
                    // Try to convert named color to hex
                    const colorMap: Record<string, string> = {
                        'red': '#FF0000', 'blue': '#0000FF', 'green': '#00B050', 'yellow': '#FFFF00',
                        'black': '#000000', 'white': '#FFFFFF', 'cyan': '#00FFFF', 'magenta': '#FF00FF',
                        'silver': '#C0C0C0', 'gray': '#808080', 'grey': '#808080', 'maroon': '#800000',
                        'olive': '#808000', 'lime': '#00FF00', 'aqua': '#00FFFF', 'teal': '#008080',
                        'navy': '#000080', 'purple': '#800080', 'fuchsia': '#FF00FF'
                    };
                    const hexColor = colorMap[color.toLowerCase()];
                    if (hexColor) {
                        styles.color = hexColor;
                    }
                }
            }
            // Handle size attribute (1-7 in HTML)
            const size = element._attributes.get ? element._attributes.get('size') : element._attributes.size;
            if (size && !styles.fontSize) {
                // HTML font sizes: 1=10pt, 2=13pt, 3=16pt, 4=18pt, 5=24pt, 6=32pt, 7=48pt
                // Can also be relative: +1, -1, etc.
                const sizeMap: Record<string, string> = {
                    '1': '10pt', '2': '13pt', '3': '16pt', '4': '18pt',
                    '5': '24pt', '6': '32pt', '7': '48pt'
                };
                const ptSize = sizeMap[size];
                if (ptSize) {
                    styles.fontSize = ptSize;
                } else if (size.startsWith('+') || size.startsWith('-')) {
                    // Relative sizing: +1 means one size larger, -1 means one size smaller
                    const baseSize = 4; // Default is size 4 (18pt)
                    const delta = parseInt(size, 10);
                    const newSize = baseSize + delta;
                    const relativeSizeMap: Record<number, string> = {
                        1: '10pt', 2: '13pt', 3: '16pt', 4: '18pt',
                        5: '24pt', 6: '32pt', 7: '48pt'
                    };
                    if (newSize >= 1 && newSize <= 7) {
                        styles.fontSize = relativeSizeMap[newSize];
                    }
                }
            }
        }
        break;
    case 'a':
        // Hyperlinks - styled as blue underlined text
        // Default color is Office blue if not already specified
        if (!styles.color) {
            styles.color = '#0563C1';
        }
        if (!styles.textDecoration) {
            styles.textDecoration = 'underline';
        }
        break;
    case 'img':
        // Images are converted to alt text representation
        // No special formatting needed
        break;
    default:
        // Unknown tags - just use as generic container
        break;
    }
}
/**
 * Applies CSS class-based, ID-based, or descendant selector paragraph style to a paragraph.
 *
 * Looks up the first CSS class or ID on the element and creates/applies
 * a paragraph style with full formatting (paragraph and character format).
 * 
 * Priority: ID selector > Descendant selector > Class selector
 *
 * @param {any} paragraph - The paragraph to apply style to
 * @param {_HTMLElement} element - The HTML element with class, ID, or descendant selector
 * @param {CSSStyleCache} styleCache - The style cache for creating styles
 * @returns {void}
 * @private
 */
function applyCSSClassStyleToParagraph(
    paragraph: any,
    element: _HTMLElement,
    styleCache: CSSStyleCache
): void {
    // Elements with an ID that are not a/span are formatted directly (see applyParagraphStyles)
    if (hasIdAttribute(element) && !usesNamedStyle(element)) {
        return;
    }
    // Priority 1: Try ID selector first (highest specificity)
    const idAttr = element._attributes.get('id');
    if (idAttr) {
        // Look up CSS rules for this ID
        if (_ParagraphMapper._cssRules && _ParagraphMapper._cssRules.length > 0) {
            // Find matching ID selector rule
            let matchingRule: any = null;
            for (const rule of _ParagraphMapper._cssRules) {
                if (!rule.selector || rule.selector.type !== 'id') {
                    continue;
                }
                if (rule.selector.idValue === idAttr) {
                    matchingRule = rule;
                    break;
                }
            }

            if (matchingRule && matchingRule.declarations) {
                // Get or create paragraph style from cache
                const style = styleCache.getOrCreateStyle(idAttr, {
                    ...matchingRule.declarations,
                    ...getIDSelectorStyles(element)
                });

                // Apply style to paragraph
                if (style) {
                    basePStyleOnNormalWeb(undefined, style, element);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    paragraph.style = (style as any).styleId || style;
                    return; // Successfully applied ID selector style
                }
            }
        }
    }

    // Priority 3: Try class selector (medium specificity)
    // Get class attribute
    const classAttr = element._attributes.get('class');
    if (!classAttr) {
        return;
    }

    // Get first class name
    const classNames = classAttr.split(/\s+/).filter((c) => c.length > 0);
    if (classNames.length === 0) {
        return;
    }

    const className = classNames[0];

    // Look up CSS rules for this class
    if (!_ParagraphMapper._cssRules || _ParagraphMapper._cssRules.length === 0) {
        return;
    }

    // Find matching CSS rule
    let matchingRule: any = null;
    for (const rule of _ParagraphMapper._cssRules) {
        if (!rule.selector || rule.selector.type !== 'class') {
            continue;
        }
        if (rule.selector.className === className) {
            matchingRule = rule;
            break;
        }
    }

    if (!matchingRule || !matchingRule.declarations) {
        return;
    }

    // Get or create paragraph style from cache
    const style = styleCache.getOrCreateStyle(className, matchingRule.declarations);

    // Apply style to paragraph
    if (style) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paragraph.style = (style as any).styleId || style;
    }
}

/**
 * Converts HTML presentation attributes to CSS-like declarations.
 *
 * HTML attributes like align, bgcolor, color, face, size are presentation attributes
 * that can be converted to CSS-equivalent style properties for unified processing.
 *
 * @param {_HTMLElement} element - The HTML element
 * @returns {Record<string, string>} Declarations from HTML attributes
 * @private
 */
function getHTMLAttributeDeclarations(element: _HTMLElement): Record<string, string> {
    if (!element || !element._attributes) {
        return {};
    }

    const declarations: Record<string, string> = {};

    // HTML presentation attributes → CSS equivalents
    // align → text-align (if not already set via CSS)
    if (element._attributes.has('align')) {
        const align = element._attributes.get('align');
        if (align && !declarations.textAlign) {
            declarations.textAlign = align.toLowerCase();
        }
    }

    // dir → direction
    if (element._attributes.has('dir')) {
        const dir = element._attributes.get('dir');
        if (dir && (dir.toLowerCase() === 'rtl' || dir.toLowerCase() === 'ltr') && !declarations.direction) {
            declarations.direction = dir.toLowerCase();
        }
    }

    // bgcolor → background-color / backgroundColor
    if (element._attributes.has('bgcolor')) {
        const bgcolor = element._attributes.get('bgcolor');
        if (bgcolor && !declarations.backgroundColor) {
            declarations.backgroundColor = bgcolor;
        }
    }

    // color → text color (for text-level HTML like <font>)
    if (element._attributes.has('color')) {
        const color = element._attributes.get('color');
        if (color && !declarations.color) {
            declarations.color = color;
        }
    }

    // face → font-family (legacy <font> attribute)
    if (element._attributes.has('face')) {
        const face = element._attributes.get('face');
        if (face && !declarations.fontFamily) {
            declarations.fontFamily = face;
        }
    }

    // size → font-size (legacy <font> attribute, values 1-7)
    if (element._attributes.has('size')) {
        const size = element._attributes.get('size');
        if (size && !declarations.fontSize) {
            // Convert HTML font size (1-7) to points
            // HTML: 1=8pt, 2=10pt, 3=12pt, 4=14pt, 5=18pt, 6=24pt, 7=36pt
            const sizeMap: Record<string, string> = {
                '1': '8pt',
                '2': '10pt',
                '3': '12pt',
                '4': '14pt',
                '5': '18pt',
                '6': '24pt',
                '7': '36pt'
            };
            if (sizeMap[size]) {
                declarations.fontSize = sizeMap[size];
            }
        }
    }

    // width, height → CSS width/height
    if (element._attributes.has('width')) {
        const width = element._attributes.get('width');
        if (width && !declarations.width) {
            // Append px if no unit is specified
            declarations.width = width.match(/^\d+$/) ? `${width}px` : width;
        }
    }

    if (element._attributes.has('height')) {
        const height = element._attributes.get('height');
        if (height && !declarations.height) {
            // Append px if no unit is specified
            declarations.height = height.match(/^\d+$/) ? `${height}px` : height;
        }
    }

    // valign → vertical-align (table cells)
    if (element._attributes.has('valign')) {
        const valign = element._attributes.get('valign');
        if (valign && !declarations.verticalAlign) {
            declarations.verticalAlign = valign.toLowerCase();
        }
    }

    return declarations;
}

/**
 * Collects CSS styles from matching class selectors for an element.
 *
 * @param {_HTMLElement} element - The HTML element
 * @returns {Record<string, string>} Merged styles from matching class selectors
 * @private
 */
function getClassSelectorStyles(element: _HTMLElement): Record<string, string> {
    // CSS class selector styles are already applied to element._styles during parsing.
    // This means element._styles contains both:
    // - CSS class selector styles (applied by _HTMLParser._applyStylesToTree)
    // - Inline styles (parsed from style="..." attribute)
    //
    // We return a copy of element._styles to get all pre-resolved styles.
    if (element._styles && Object.keys(element._styles).length > 0) {
        return { ...element._styles };
    }
    
    return {};
}

/**
 * Collects CSS styles from matching ID selectors for an element.
 *
 * ID selectors have higher specificity than class selectors and are applied
 * the same way during parsing: resolved styles are stored in element._styles.
 *
 * @param {_HTMLElement} element - The HTML element
 * @returns {Record<string, string>} Merged styles from matching ID selectors
 * @private
 */
function getIDSelectorStyles(element: _HTMLElement): Record<string, string> {
    // CSS ID selector styles are already applied to element._styles during parsing.
    // ID selectors have highest specificity (100), so they override class and element selectors.
    // Same mechanism as class selectors: parser pre-resolves and applies to element._styles.
    if (element._styles && Object.keys(element._styles).length > 0) {
        return { ...element._styles };
    }
    
    return {};
}

/**
 * Detects and creates styles for descendant selector matches.
 *
 * Descendant selectors (e.g., ".content p", "#header span") are resolved by the parser
 * and pre-applied to element._styles. This function checks if the element matched
 * a descendant selector and returns the matching selector's style ID if available.
 *
 * @param {_HTMLElement} element - The HTML element to check
 * @returns {string|undefined} The descendant selector style ID, or undefined if no match
 * @private
 */
function detectDescendantSelectorStyle(element: _HTMLElement): string | undefined {
    // Descendant selectors are pre-resolved during parsing and stored as metadata on the element
    // Check if element has descendant selector information
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elementAny = element as any;
    
    // Check if element has descendant selector data attached by parser
    if (elementAny._descendantSelectorId) {
        return elementAny._descendantSelectorId;
    }
    
    return undefined;
}

/**
 * Apply character formatting styles to a TextRange (bold, italic, color, etc.).
 *
 * @param {unknown} textRange - The TextRange to format
 * @param {Record<string, string>} styles - The styles to apply
 * @returns {void}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * Apply character-level formatting styles to a TextRange.
 *
 * Uses the centralized CSS converter (cssToCharacterFormat) to apply all
 * supported character format properties. Combines class/ID/descendant selector styles with
 * inline element styles, with inline styles taking precedence.
 *
 * Priority: ID selector > Descendant selector > Class selector > Direct formatting
 *
 * @param {any} textRange - The TextRange to format
 * @param {Record<string, string>} styles - Inline styles (camelCase keys)
 * @param {_HTMLElement} [element] - Optional HTML element for class/ID/descendant selector matching
 * @returns {void}
 * @private
 */
const BLOCK_TAGS: string[] = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'li'];

/**
 * Collapsible HTML whitespace, deliberately excluding U+00A0 (no-break space).
 * JS \s matches \u00A0, but a non-breaking space is rendered content in Word and
 * must survive whitespace collapsing and blank-text checks.
 */
const HTML_BLANK_PATTERN: RegExp = /[^\S\u00A0]+/g;

/**
 * True when the text is blank (only collapsible whitespace) while treating
 * non-breaking spaces as content: an nbsp-only string is NOT blank.
 */
function isBlankHtmlText(text: string): boolean {
    // eslint-disable-next-line no-irregular-whitespace
    return text.replace(HTML_BLANK_PATTERN, '').length === 0;
}

/**
 * Block elements draw their box (border, background, padding) on the paragraph itself,
 * so those declarations must not be repeated on the runs inside it.
 */
function isBlockElement(element?: _HTMLElement): boolean {
    return !!element && !!element.tagName && BLOCK_TAGS.indexOf(element.tagName.toLowerCase()) !== -1;
}

/**
 * Only p, span and a get reusable styles in styles.xml; every other tag (div, li,
 * blockquote, headings, ...) is formatted directly in document.xml.
 */
function usesNamedStyle(element?: _HTMLElement): boolean {
    const tag: string = element && element.tagName ? element.tagName.toLowerCase() : '';
    if (element && detectDescendantSelectorStyle(element) && !hasIdAttribute(element) &&
        !(element._attributes && element._attributes.get('class'))) {
        // Descendant selectors never create styles of their own; the cascaded result
        // (already merged into element._styles) is applied directly.
        return tag === 'a';
    }
    if (hasIdAttribute(element)) {
        // ID selectors: p, span and a get a style named after the ID in styles.xml.
        // Headings/pre/blockquote use built-in styles; every other tag is formatted directly.
        return tag === 'p' || tag === 'span' || tag === 'a';
    }
    return tag === 'p' || tag === 'span' || tag === 'a';
}

/**
 * An ID style on <p> is based on the built-in NormalWeb style (instantiated on demand),
 * only when the style has no base yet, so an existing style is reused unchanged.
 */
function basePStyleOnNormalWeb(paragraph: any, style: any, element: _HTMLElement): void {
    if (!style || !element.tagName || element.tagName.toLowerCase() !== 'p' || style.basedOnId !== undefined) {
        return;
    }
    try {
        if (paragraph && paragraph.applyStyle) {
            paragraph.applyStyle('NormalWeb');
        }
        style.applyBaseStyle('NormalWeb');
    } catch (error) {
        console.error('Error basing ID style on NormalWeb:', error);
    }
}

/**
 * Runs directly inside h1-h6 / p receive the block's resolved (element / descendant / inline)
 * character formatting directly. A <p> that carries an id or class is skipped: its
 * ID / class style already holds that formatting.
 */
function applyBlockRunStyles(textRange: any, block?: _HTMLElement): void {
    const tag: string = block && block.tagName ? block.tagName.toLowerCase() : '';
    const hasOwnStyle: boolean = !!block && !!block._attributes &&
        (!!block._attributes.get('id') || !!block._attributes.get('class'));
    applyRunDirection(textRange, block);
    if (!block || (tag === 'p' && hasOwnStyle)) {
        applyCharacterStylesToRange(textRange, {}, undefined);
        return;
    }
    applyCharacterStylesToRange(textRange, {}, block);
}

/**
 * Resolve the text direction of an element: its own `dir` attribute (or CSS `direction`),
 * otherwise the nearest ancestor that sets one. Returns undefined when none is set.
 */
function resolveTextDirection(element?: _HTMLElement): 'rtl' | 'ltr' | undefined {
    let node: _HTMLElement | null | undefined = element;
    while (node) {
        const dir: string | undefined = node._attributes && node._attributes.get ? node._attributes.get('dir') || undefined : undefined;
        const css: string | undefined = node._styles ? node._styles.direction : undefined;
        const value: string = (css || dir || '').toLowerCase();
        if (value === 'rtl' || value === 'ltr') {
            return value;
        }
        node = node._parentNode;
    }
    return undefined;
}

function applyRunDirection(textRange: any, element?: _HTMLElement): void {
    const direction: 'rtl' | 'ltr' | undefined = resolveTextDirection(element);
    if (direction !== undefined && textRange && textRange.characterFormat) {
        textRange.characterFormat.bidi = direction === 'rtl';
    }
}

function hasIdAttribute(element?: _HTMLElement): boolean {
    return !!element && !!element._attributes && !!element._attributes.get('id');
}

/**
 * Built-in paragraph style referenced (not defined) for ID-selector elements that are
 * formatted directly: p -> NormalWeb, pre/blockquote -> HTMLPreformatted. Headings get
 * Heading1-6 from applyHeadingStyle; every other tag gets no style.
 */
function builtInStyleForIdElement(element: _HTMLElement): string | undefined {
    const tag: string = element.tagName ? element.tagName.toLowerCase() : '';
    if (tag === 'p') {
        return 'NormalWeb';
    }
    if (tag === 'pre' || tag === 'blockquote') {
        return 'HTMLPreformatted';
    }
    return undefined;
}

function withoutBoxStyles(styles: Record<string, string>, element?: _HTMLElement): Record<string, string> {
    if (!isBlockElement(element)) {
        return styles;
    }
    const out: Record<string, string> = {};
    for (const key of Object.keys(styles)) {
        if (key !== 'background' && key !== 'backgroundColor' && key.indexOf('border') !== 0) {
            out[key] = styles[key];
        }
    }
    return out;
}

function applyCharacterStylesToRange(textRange: any, styles: Record<string, string>, element?: _HTMLElement): void {
    if (!textRange || !textRange.characterFormat) {
        return;
    }
    const blockSuffix: string = '';
    applyRunDirection(textRange, element);

    // Priority 1: ID selector - highest specificity
    if (usesNamedStyle(element) && element && element._attributes && element._attributes.has('id')) {
        const idAttr = element._attributes.get('id');
        if (idAttr && _ParagraphMapper._characterStyleCache) {
            const idStyles = withoutBoxStyles(getIDSelectorStyles(element), element);
            
            // Try to create a character style for this ID selector
            const styleId = _ParagraphMapper._characterStyleCache.getOrCreateCharacterStyle(`${idAttr}${blockSuffix}`, idStyles);
            if (styleId) {
                // Apply the character style instead of direct formatting
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (textRange as any).characterFormat.characterStyle = styleId;
                return; // Don't apply direct formatting if using a character style
            }
        }
    }

    // Priority 3: Class selector - medium specificity
    // For elements with CSS class selectors, try to create/use a character style
    // This creates reusable styles in styles.xml instead of applying direct formatting
    if (usesNamedStyle(element) && element && element._attributes && element._attributes.has('class')) {
        const classAttr = element._attributes.get('class');
        if (classAttr) {
            const classNames = classAttr.split(/\s+/).filter((c: string) => c.length > 0);
            // Use the first class as the primary style
            if (classNames.length > 0 && _ParagraphMapper._characterStyleCache) {
                const primaryClass = classNames[0];
                const classStyles = withoutBoxStyles(getClassSelectorStyles(element), element);
                
                // Try to create a character style for this class
                const styleId = _ParagraphMapper._characterStyleCache.getOrCreateCharacterStyle(primaryClass + blockSuffix, classStyles);
                if (styleId) {
                    // Apply the character style instead of direct formatting
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (textRange as any).characterFormat.characterStyle = styleId;
                    return; // Don't apply direct formatting if using a character style
                }
            }
        }
    }

    // Priority 4: element selector on <a> (e.g. `a { ... }`) -> reusable style in styles.xml
    if (element && element.tagName && element.tagName.toLowerCase() === 'a' && _ParagraphMapper._characterStyleCache &&
        !hasIdAttribute(element) && !(element._attributes && element._attributes.get('class'))) {
        const anchorStyles = getClassSelectorStyles(element);
        if (!(element._attributes && element._attributes.has('style')) && Object.keys(anchorStyles).length > 0) {
            const styleId = _ParagraphMapper._characterStyleCache.getOrCreateCharacterStyle('CSS_el_a', anchorStyles);
            if (styleId) {
                (textRange as any).characterFormat.characterStyle = styleId;
                return;
            }
        }
    }

    // Merge styles in priority order:
    // 1. CSS class selector styles (from stylesheet)
    // 2. Inline style attribute (from <elem style="...">)
    // 3. Programmatic styles passed as parameter (highest priority)
    let mergedStyles: Record<string, string> = {};

    if (element) {
        // Start with CSS class selector styles
        const classStyles = getClassSelectorStyles(element);
        Object.assign(mergedStyles, classStyles);
        
        // Merge with element's inline style attribute (_styles from style="...")
        if (element._styles && Object.keys(element._styles).length > 0) {
            Object.assign(mergedStyles, element._styles);
        }
    }

    // Finally, apply programmatic styles (highest priority)
    Object.assign(mergedStyles, styles);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const format: any = textRange.characterFormat;

    // Use centralized CSS converter to apply all character format properties
    // This eliminates code duplication and ensures consistency
    const delta: CharacterFormatDelta = cssToCharacterFormat(withoutBoxStyles(mergedStyles, element));
    
    // Apply all converted properties
    if (delta.bold !== undefined) format.bold = delta.bold;
    if (delta.italic !== undefined) format.italic = delta.italic;
    if (delta.fontSize !== undefined) format.fontSize = delta.fontSize;
    if (delta.fontName !== undefined) format.fontName = delta.fontName;
    if (delta.textColor !== undefined) format.textColor = delta.textColor;
    if (delta.strikethrough !== undefined) format.strikethrough = delta.strikethrough;
    if (delta.doubleStrikethrough !== undefined) format.doubleStrikethrough = delta.doubleStrikethrough;
    if (delta.underlineStyle !== undefined) format.underlineStyle = delta.underlineStyle;
    if (delta.underlineColor !== undefined) format.underlineColor = delta.underlineColor;
    if (delta.highlightColor !== undefined) format.highlightColor = delta.highlightColor;
    if (delta.textBackgroundColor !== undefined) format.textBackgroundColor = delta.textBackgroundColor;
    if (delta.textColorHex !== undefined || delta.textBackgroundHex !== undefined) {
        // Colours outside the Color enum are written through the snapshot to keep the exact RGB value.
        const snap = format.snapshot();
        if (delta.textColorHex !== undefined) {
            snap.textColorValue = delta.textColorHex;
            snap.textColorTheme = undefined;
        }
        if (delta.textBackgroundHex !== undefined) {
            snap.shadingValue = { pattern: 'clear', fill: delta.textBackgroundHex };
        }
        format.hydrate(snap);
    }
    if (!isBlockElement(element)) {
        // `background` / `border` shorthands on inline content become run shading / run border
        const boxDecls: Record<string, string> = {};
        for (const key of ['background', 'backgroundColor', 'border']) {
            if (mergedStyles[key] && mergedStyles[key].trim() !== '') {
                boxDecls[key] = mergedStyles[key].trim().toLowerCase();
            }
        }
        if (boxDecls.background !== undefined || boxDecls.border !== undefined) {
            applyCharacterDeclarations(format, boxDecls);
        }
    }
    if (delta.allCaps !== undefined) format.allCaps = delta.allCaps;
    if (delta.smallCaps !== undefined) format.smallCaps = delta.smallCaps;
    if (delta.subSuperScript !== undefined) format.subSuperScript = delta.subSuperScript;
    if (delta.noProof !== undefined) format.noProof = delta.noProof;
    if (delta.webHidden !== undefined) format.webHidden = delta.webHidden;
}
/**
 * Apply paragraph-level formatting styles (alignment, indentation, background color, etc.).
 *
 * For elements with CSS class, ID, or descendant selectors, creates a paragraph style in styles.xml instead of
 * applying inline formatting. This ensures proper Word document structure matching .NET behavior.
 *
 * Priority: ID selector > Descendant selector > Class selector > Direct formatting
 *
 * @param {Paragraph} paragraph - The paragraph to format
 * @param {Record<string, string>} styles - The styles to apply
 * @param {_HTMLElement} [element] - Optional HTML element for CSS class/ID/descendant selector detection
 * @returns {void}
 */
function applyParagraphStyles(paragraph: Paragraph, styles: Record<string, string>, element?: _HTMLElement): void {
    if (element && hasIdAttribute(element) && !usesNamedStyle(element)) {
        const builtIn: string | undefined = builtInStyleForIdElement(element);
        if (builtIn !== undefined) {
            try {
                paragraph.applyStyle(builtIn);
            } catch (error) {
                console.error(`Error applying built-in style ${builtIn}:`, error);
            }
        }
    }
    // Priority 1: ID selector - highest specificity
    if (usesNamedStyle(element) && element && element._attributes && element._attributes.has('id')) {
        const idAttr = element._attributes.get('id');
        if (idAttr && _ParagraphMapper._styleCache) {
            const idStyles = getIDSelectorStyles(element);
            
            // Try to create a paragraph style for this ID selector
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const style = (_ParagraphMapper._styleCache as any).getOrCreateStyle(idAttr, idStyles);
                basePStyleOnNormalWeb(paragraph, style, element);
                if (style && (style as any).styleId) {
                    // Apply the paragraph style instead of direct formatting
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if ((paragraph as any).applyStyle) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (paragraph as any).applyStyle((style as any).styleId);
                    }
                    return; // Don't apply direct formatting if using a paragraph style
                }
            } catch (error) {
                console.error(`Error creating paragraph style for ID selector "#${idAttr}":`, error);
                // Fall through to apply direct formatting
            }
        }
    }

    // Priority 3: Class selector - medium specificity
    // For elements with CSS class selectors, try to create/use a paragraph style
    // This creates reusable styles in styles.xml instead of applying direct formatting
    if (usesNamedStyle(element) && element && element._attributes && element._attributes.has('class')) {
        const classAttr = element._attributes.get('class');
        if (classAttr && _ParagraphMapper._styleCache) {
            const classNames = classAttr.split(/\s+/).filter((c: string) => c.length > 0);
            // Use the first class as the primary style
            if (classNames.length > 0) {
                const primaryClass = classNames[0];
                const classStyles = getClassSelectorStyles(element);
                
                // Try to create a paragraph style for this class
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const style = (_ParagraphMapper._styleCache as any).getOrCreateStyle(primaryClass, classStyles);
                    if (style && (style as any).styleId) {
                        // Apply the paragraph style instead of direct formatting
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if ((paragraph as any).applyStyle) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (paragraph as any).applyStyle((style as any).styleId);
                        }
                        return; // Don't apply direct formatting if using a paragraph style
                    }
                } catch (error) {
                    console.error(`Error creating paragraph style for class "${primaryClass}":`, error);
                    // Fall through to apply direct formatting
                }
            }
        }
    }

    // Priority 4: element selectors (e.g. `p { ... }`) are already merged into the element's
    // styles. p / pre / blockquote reference a built-in style; the merged declarations are
    // then applied directly below. No element-selector style is created.
    if (element && !(paragraph as any).styleId) {
        const builtIn: string | undefined = builtInStyleForIdElement(element);
        if (builtIn !== undefined) {
            try {
                paragraph.applyStyle(builtIn);
            } catch (error) {
                console.error(`Error applying built-in style ${builtIn}:`, error);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const format: any = paragraph.paragraphFormat;
    
    // Defensive check: if format is not available, skip direct formatting
    if (!format) {
        return;
    }
    
    // Merge declarations: CSS styles take priority over HTML attributes
    // HTML attributes provide fallback values when CSS is not specified
    const mergedDeclarations: Record<string, string> = {};
    
    // Start with HTML attribute declarations (lowest priority)
    if (element) {
        const attrDeclarations = getHTMLAttributeDeclarations(element);
        Object.assign(mergedDeclarations, attrDeclarations);
    }
    
    // Override with CSS styles (higher priority)
    Object.assign(mergedDeclarations, styles);
    
    // Direct formatting in document.xml (tags that do not use a named style)
    const declarations: Record<string, string> = {};
    for (const key of Object.keys(mergedDeclarations)) {
        const v: string = mergedDeclarations[key];
        if (typeof v === 'string' && v.trim() !== '') {
            declarations[key] = v.trim().toLowerCase();
        }
    }
    applyParagraphDeclarations(format, declarations);
}
