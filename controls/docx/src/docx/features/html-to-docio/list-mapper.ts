/**
 */
/* eslint-disable valid-jsdoc, security/detect-object-injection */

import { WordDocument } from '../document/document.js';
import { Paragraph, ParagraphOwner } from '../document/paragraph.js';
import { _HTMLElement, _HTMLGenericElement } from '../html-parser/dom-node.js';
import { _ParagraphMapper } from './paragraph-mapper.js';
import { numberingFor } from '../numbering/index.js';

// Type aliases for compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _Paragraph = any;

/**
 */
interface ListContext {
    listType: 'ul' | 'ol'; // Unordered or ordered list
    level: number; // Nesting level (0-9)
    listId: number | undefined; // Numbering instance of this list (captured from its first item)
    startNumber?: number; // Starting number for <ol>
    style?: string; // List style type (disc, circle, square, decimal, etc.)
}

/**
 */
export class _ListMapper {

    /**
     * Map an HTML list element (ul/ol) and its items to DocIO paragraphs with list formatting.
     *
     * Handles:
     * - Unordered lists (<ul>) with bullet styles
     * - Ordered lists (<ol>) with numbering styles (all-Arabic for decimal at each level)
     * - Nested lists with proper indentation levels
     * - List item content (paragraphs, inline formatting)
     *
     * @param {unknown} listElement - The HTML <ul> or <ol> element to map
     * @param {unknown} document - The WordDocument (for context)
     * @param {unknown} owner - Optional list owner (Body) to attach paragraphs to
     * @param {unknown} level - Nesting level (default 0)
     * @param {unknown} parentContext - Parent list context for nested lists
     * @returns Array of mapped Paragraph objects (if owner not provided)
     * @private
     */
    static mapHTMLList(
        listElement: _HTMLElement,
        document: WordDocument,
        owner?: ParagraphOwner,
        level: number = 0,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        parentContext?: ListContext
    ): Paragraph[] {
    // tslint:disable-next-line: no-any
        const paragraphs: Paragraph[] = [];

        try {
            const tagName: string = listElement.tagName.toLowerCase();
            const isOrderedList: boolean = tagName === 'ol';

            // Create list context
            const context: ListContext = {
                listType: isOrderedList ? 'ol' : 'ul',
                level: level,
                startNumber: isOrderedList ? this.getStartNumber(listElement) : undefined,
                style: this.getListStyle(listElement),
                listId: undefined
            };

            // Track if this is the first item in this list level
            // tslint:disable-next-line: no-any
            let isFirstItem: boolean = true;

            // Process list items
            for (const child of listElement._childNodes) {
                const childTag: string = child.tagName.toLowerCase();

                if (childTag === 'li') {
                    // Map list item with proper formatting
                    const itemParagraphs: _Paragraph[] = this.mapListItem(
                        child,
                        document,
                        owner,
                        context,
                        isFirstItem
                    );

                    // Only set isFirstItem to false AFTER we've processed at least one list item
                    // This ensures the first item is always marked as first, regardless of its content structure
                    if (isFirstItem) {
                        isFirstItem = false;
                        if (itemParagraphs.length > 0 && (itemParagraphs[0] as any).listFormat) {
                            context.listId = (itemParagraphs[0] as any).listFormat.listId;
                        }
                    }

                    paragraphs.push(...itemParagraphs);
                }
            }

            return paragraphs;
        } catch (error) {
            console.error('Error mapping HTML list:', error);
            return paragraphs;
        }
    }

    /**
     * Map a single HTML list item (<li>) to one or more DocIO paragraphs.
     *
     * @param {unknown} liElement - The liElement value
     * @param {unknown} document - The document value
     * @param {unknown} owner - The owner value
     * @param {unknown} context - The context value
     * @param {unknown} isFirstInList - The isFirstInList value
     * @private
     */
    private static mapListItem(
        liElement: _HTMLElement,
        document: WordDocument,
        owner: ParagraphOwner | undefined,
        context: ListContext,
        isFirstInList: boolean
    ): Paragraph[] {
    // tslint:disable-next-line: no-any
        const paragraphs: Paragraph[] = [];

        try {
            // Separate block-level content (paragraphs, nested lists) from inline content
            const blockContent: _HTMLElement[] = [];
            const inlineAndTextContent: _HTMLElement[] = [];

            for (const child of liElement._childNodes) {
                const childTag: string = child.tagName.toLowerCase();

                if (childTag === 'ul' || childTag === 'ol') {
                    // Block-level: nested list
                    blockContent.push(child);
                } else if (childTag === 'p') {
                    // Block-level: paragraph
                    blockContent.push(child);
                } else if (this.isInlineContent(child) || childTag === '#text') {
                    // Inline content and text nodes - accumulate for combined processing
                    inlineAndTextContent.push(child);
                } else {
                    // Other block elements - treat as block-level
                    blockContent.push(child);
                }
            }

            // Track whether we've already created the first paragraph in this list item
            let isFirstParagraphInItem: boolean = isFirstInList;

            // Create the main list item paragraph with inline + text content ONLY
            if (inlineAndTextContent.length > 0 || blockContent.length === 0) {
                // Create a synthetic wrapper element with only inline content
                // This prevents nested block elements from being included
                const inlineWrapper: _Paragraph = this.createInlineOnlyWrapper(inlineAndTextContent, liElement);
                const para: _Paragraph = this.createListItemParagraphForInlineOnly(
                    inlineWrapper,
                    document,
                    owner,
                    context,
                    isFirstParagraphInItem
                );

                if (para) {
                    paragraphs.push(para);
                    isFirstParagraphInItem = false; // Mark first paragraph as created
                }
            }

            // Process block-level content separately
            for (const blockElement of blockContent) {
                const blockTag: string = blockElement.tagName.toLowerCase();

                if (blockTag === 'ul' || blockTag === 'ol') {
                    // Nested list
                    // IMPORTANT: Always preserve nesting level for proper Word multi-level list hierarchy
                    // Word requires listLevelNumber to differ (0, 1, 2...) for items to appear indented
                    const nestingLevel = context.level + 1;
                    
                    const nestedContext: ListContext = {
                        listType: blockTag === 'ol' ? 'ol' : 'ul',
                        level: nestingLevel,
                        startNumber: blockTag === 'ol' ? this.getStartNumber(blockElement) : undefined,
                        style: this.getListStyle(blockElement),
                        listId: undefined
                    };

                    const nestedParagraphs: _Paragraph[] = this.mapHTMLList(
                        blockElement,
                        document,
                        owner,
                        nestingLevel,
                        nestedContext
                    );

                    paragraphs.push(...nestedParagraphs);
                } else if (blockTag === 'p') {
                    // Nested paragraph - use isFirstParagraphInItem to track first paragraph
                    const para: _Paragraph = this.createListItemParagraph(
                        blockElement,
                        document,
                        owner,
                        context,
                        isFirstParagraphInItem // Pass the correct first-item flag
                    );

                    if (para) {
                        paragraphs.push(para);
                        isFirstParagraphInItem = false; // Mark first paragraph as created
                    }
                }
                // Skip other block elements for now
            }

            // If no content was added, create empty list item paragraph
            if (paragraphs.length === 0) {
                const para: _Paragraph = this.createEmptyListItemParagraph(document, owner, context, isFirstInList, liElement);
                paragraphs.push(para);
            }

            return paragraphs;
        } catch (error) {
            console.error('Error mapping list item:', error);
            return paragraphs;
        }
    }

    /**
     * Create a synthetic wrapper element containing only inline content.
     * This ensures _ParagraphMapper won't extract nested block elements.
     *
     * IMPORTANT: This creates a VIEW over the inline content without moving or
     * mutating the original elements. The wrapper is virtual - it exists only for
     * _ParagraphMapper to iterate over. The original liElement is untouched.
     *
     * @param {unknown} inlineContent - The inlineContent value
     * @returns {_HTMLElement}
     * @private
     */
    private static createInlineOnlyWrapper(inlineContent: _HTMLElement[], source?: _HTMLElement): _HTMLElement {
    // Create a wrapper that presents the inline content as its children
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrapper: _HTMLElement = new _HTMLGenericElement('span') as any;

        // Directly assign the childNodes array - no appendChild() calls!
        // This avoids mutating the original elements' parent pointers.
        // _ParagraphMapper will iterate over this array.
        (wrapper as any)._childNodes = [...inlineContent];
        // The li / td / th element's own declarations (alignment, colour, ...) apply to its paragraph.
        // CSS inheritance: the <li> also inherits inheritable declarations from its enclosing
        // list ancestors (<ul>/<ol>), closest ancestor winning - class / ID / inline styles on a
        // list element must reach the runs of its items. Box declarations (background, border)
        // of the list ancestors stay on the block and are not inherited by the runs.
        const inherited: Record<string, string> = {};
        const ancestorStyles: Record<string, string>[] = [];
        let ancestor: _HTMLElement | undefined = source ? source._parentNode : undefined;
        while (ancestor && ancestor.tagName) {
            const ancestorTag: string = ancestor.tagName.toLowerCase();
            if (ancestorTag !== 'ul' && ancestorTag !== 'ol') {
                break;
            }
            if (ancestor._styles) {
                ancestorStyles.push(ancestor._styles);
            }
            ancestor = ancestor._parentNode;
        }
        for (let i: number = ancestorStyles.length - 1; i >= 0; i--) {
            for (const key of Object.keys(ancestorStyles[i])) {
                if (key !== 'background' && key !== 'backgroundColor' && key.indexOf('border') !== 0) {
                    inherited[key] = ancestorStyles[i][key];
                }
            }
        }
        if (source && source._styles) {
            Object.assign(inherited, source._styles);
        } // Create a copy to avoid mutations
        if (Object.keys(inherited).length > 0) {
            wrapper._styles = inherited;
        }

        return wrapper;
    }

    /**
     * Create a list item paragraph for inline-only content.
     * Uses _ParagraphMapper to properly handle formatting.
     *
     * @param {unknown} inlineWrapper - The inlineWrapper value
     * @param {unknown} document - The document value
     * @param {unknown} owner - The owner value
     * @param {unknown} context - The context value
     * @param {unknown} isFirstInList - The isFirstInList value
     * @private
     */
    private static createListItemParagraphForInlineOnly(
        inlineWrapper: _HTMLElement,
        document: WordDocument,
        owner: ParagraphOwner | undefined,
        context: ListContext,
        isFirstInList: boolean
    ): Paragraph | null {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const para: any = new Paragraph(undefined);

            // Attach to owner if provided
            if (owner) {
                try {
                    // eslint-disable-next-line
          const ownerItems = (owner as any).items;
                    if (ownerItems && ownerItems.add) {
                        ownerItems.add(para);
                    }
                } catch (error) {
                    console.error('Error adding paragraph to owner:', error);
                    return null;
                }
            }

            // Apply list formatting FIRST
            this.applyListFormatting(para, context, isFirstInList, document);

            // Use _ParagraphMapper to properly handle all inline content and formatting
            // The wrapper element is a generic <span> containing only inline children
            _ParagraphMapper.mapHTMLParagraphContent(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                inlineWrapper as any,
                para,
                document,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                owner || (para as any)
            );

            return para;
        } catch (error) {
            console.error('Error creating list item paragraph for inline content:', error);
            return null;
        }
    }

    /**
     * Create a paragraph for a list item.
     *
     * @param {unknown} element - The element value
     * @param {unknown} document - The document value
     * @param {unknown} owner - The owner value
     * @param {unknown} context - The context value
     * @param {unknown} isFirstInList - The isFirstInList value
     * @private
     */
    private static createListItemParagraph(
        element: _HTMLElement,
        document: WordDocument,
        owner: ParagraphOwner | undefined,
        context: ListContext,
        isFirstInList: boolean
    ): Paragraph | null {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const para: any = new Paragraph(undefined);

            // Attach to owner if provided
            if (owner) {
                try {
                    // eslint-disable-next-line
          const ownerItems = (owner as any).items;
                    if (ownerItems && ownerItems.add) {
                        ownerItems.add(para);
                    }
                } catch (error) {
                    console.error('Error adding paragraph to owner:', error);
                    return null;
                }
            }

            // Apply list formatting
            this.applyListFormatting(para, context, isFirstInList, document);

            // Map element content
            const tagName: string = element.tagName.toLowerCase();

            if (tagName === 'p' || tagName === 'li') {
                // Map paragraph content
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _ParagraphMapper.mapHTMLParagraphContent(element as any, para, document, owner || (para as any));
            } else {
                // Map as inline content or generic block
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _ParagraphMapper.mapHTMLParagraphContent(element as any, para, document, owner || (para as any));
            }

            return para;
        } catch (error) {
            console.error('Error creating list item paragraph:', error);
            return null;
        }
    }

    /**
     * Create an empty paragraph for an empty list item.
     *
     * @param {unknown} document - The document value
     * @param {unknown} owner - The owner value
     * @param {unknown} context - The context value
     * @param {unknown} isFirstInList - The isFirstInList value
     * @param {_HTMLElement} [liElement] - Optional list item element for CSS class detection
     * @private
     */
    private static createEmptyListItemParagraph(
        document: WordDocument,
        owner: ParagraphOwner | undefined,
        context: ListContext,
        isFirstInList: boolean,
        liElement?: _HTMLElement
    ): Paragraph {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const para: any = new Paragraph(undefined);

        if (owner) {
            try {
                // eslint-disable-next-line
        const ownerItems = (owner as any).items;
                if (ownerItems && ownerItems.add) {
                    ownerItems.add(para);
                }
            } catch (error) {
                console.error('Error adding paragraph to owner:', error);
            }
        }

        // Apply list formatting
        this.applyListFormatting(para, context, isFirstInList, document);
        
        // Note: Empty list items don't go through paragraph mapper, so CSS class styles
        // won't be applied here. That's acceptable since empty items have no content anyway.

        return para;
    }

    /**
     * Apply list formatting to a paragraph.
     *
     * Strategy: Use increaseIndentLevel() to properly manage Word's multi-level list hierarchy.
     * This preserves both the nesting structure AND numbering continuity within each level.
     *
     * For nested lists with decimal numbering at all levels:
     * 1. Apply the appropriate list style (bullet or numbered) at level 0
     * 2. Use increaseIndentLevel() to move to the target nesting level
     * 3. Continue numbering naturally within each level (Word handles this automatically)
     *
     * @param {unknown} para - The para value
     * @param {unknown} context - The context value
     * @param {unknown} isFirstInList - The isFirstInList value (first item in THIS level)
     * @private
     */
    private static applyListFormatting(
        para: Paragraph,
        context: ListContext,
        isFirstInList: boolean,
        document?: WordDocument
    ): void {
        try {
            if (!para.listFormat) {return; }

            // For the first item in this nesting level, create a new list or apply default style
            if (isFirstInList) {
                // First item: apply default style to establish the list at level 0
                if (context.listType === 'ul') {
                    if (para.listFormat.applyDefBulletStyle) {
                        para.listFormat.applyDefBulletStyle();
                    }
                } else {
                    // HTML <ol> numbers decimal at every nesting level (browsers do not
                    // cycle decimal / lowerLetter / lowerRoman like Word's default list)
                    const listFormatAny: any = para.listFormat;
                    if (listFormatAny.applyDefNumberedStyle) {
                        listFormatAny.applyDefNumberedStyle();
                        try {
                            const numbering: any = numberingFor(document);
                            if (numbering && numbering.createHtmlDecimalInstance) {
                                const htmlNumId: number = numbering.createHtmlDecimalInstance(
                                    _ListMapper.htmlNumFmt(context.style));
                                listFormatAny.listId = htmlNumId;
                                listFormatAny.listLevelNumber = 0;
                                context.listId = htmlNumId;
                            }
                        } catch (numberingError) {
                            console.debug('Could not use the HTML decimal numbering instance:', numberingError);
                        }
                    }
                }
                
                // After applying the style, use increaseIndentLevel() to reach the target level
                // This ensures Word's multi-level list mechanism properly handles nesting
                if (para.listFormat.increaseIndentLevel) {
                    for (let i = 0; i < context.level; i++) {
                        para.listFormat.increaseIndentLevel();
                    }
                }
            } else if (context.listId !== undefined) {
                // Not the first item of this list: bind to the list's own numbering
                // instance and level. continueListNumbering() would pick up the nested
                // list that was mapped most recently instead of this (outer) list.
                para.listFormat.listId = context.listId;
                para.listFormat.listLevelNumber = context.level;
            } else {
                // Subsequent items: continue numbering at the current level
                let shouldApplyStyle = false;
                
                if (para.listFormat.continueListNumbering) {
                    try {
                        para.listFormat.continueListNumbering();
                    } catch (continueError) {
                        // If continuation fails, apply style and indent
                        shouldApplyStyle = true;
                    }
                } else {
                    shouldApplyStyle = true;
                }
                
                if (shouldApplyStyle) {
                    try {
                        if (context.listType === 'ul') {
                            if (para.listFormat.applyDefBulletStyle) {
                                para.listFormat.applyDefBulletStyle();
                            }
                        } else {
                            if (para.listFormat.applyDefNumberedStyle) {
                                para.listFormat.applyDefNumberedStyle();
                            }
                        }
                        
                        // Indent to the target level
                        if (para.listFormat.increaseIndentLevel) {
                            for (let i = 0; i < context.level; i++) {
                                para.listFormat.increaseIndentLevel();
                            }
                        }
                    } catch (defaultStyleError) {
                        // Even applying default style failed - log but don't throw
                        // eslint-disable-next-line no-console
                        console.error('Failed to apply list style at level ' + context.level + ':', defaultStyleError);
                    }
                }
            }
        } catch (error) {
            console.error('Error applying list formatting:', error);
        }
    }

    /**
     * Get the starting number from an <ol> element.
     *
     * @param {unknown} listElement - The listElement value
     * @returns {number}
     * @private
     */
    private static getStartNumber(listElement: _HTMLElement): number {
        const startAttr: string | null = listElement.getAttribute('start');
        if (startAttr) {
            const startNum: number = parseInt(startAttr, 10);
            if (!isNaN(startNum)) {
                return startNum;
            }
        }
        return 1; // Default to 1
    }

    /**
     * Get the list style type from <ul> or <ol> element.
     *
     * @param {unknown} listElement - The listElement value
     * @returns {string | undefined}
     */
    /**
     * HTML list type / list-style-type to an ST_NumberFormat value.
     * Ordered lists fall back to decimal, unordered lists ignore the value.
     *
     * @private
     */
    private static htmlNumFmt(style: string | undefined): string {
        // HTML type values 'a'/'A'/'i'/'I' are case-significant; CSS keywords are not.
        const single: string = style || '';
        if (single === 'a') { return 'lowerLetter'; }
        if (single === 'A') { return 'upperLetter'; }
        if (single === 'i') { return 'lowerRoman'; }
        if (single === 'I') { return 'upperRoman'; }
        switch (single.toLowerCase()) {
        case '1':
        case 'decimal':
            return 'decimal';
        case 'lower-alpha':
        case 'lower-latin':
            return 'lowerLetter';
        case 'upper-alpha':
        case 'upper-latin':
            return 'upperLetter';
        case 'lower-roman':
            return 'lowerRoman';
        case 'upper-roman':
            return 'upperRoman';
        default:
            return 'decimal';
        }
    }

    /**
     * Gets the list style type of a list element from its type attribute or CSS styles.
     *
     * @param {_HTMLElement} listElement - The list element to inspect.
     * @returns {string|undefined} The list style type, or undefined when not specified.
     * @private
     */
    private static getListStyle(listElement: _HTMLElement): string | undefined {
        const typeAttr: string | null = listElement.getAttribute('type');
        if (typeAttr) {
            // Keep the original case: HTML type 'a' and 'A' select different numbering
            return typeAttr;
        }

        // Check CSS style attribute
        const styleValue: string = listElement._styles && listElement._styles.listStyleType;
        if (styleValue) {
            return styleValue.toLowerCase();
        }

        return undefined;
    }

    /**
     * Check if an element has style="list-style:none"
     * This indicates the list should use manual numbering/bullets, not Word's default multilevel styles.
     *
     * @param {unknown} listElement - The listElement value
     * @returns {boolean}
     * @private
     */
    private static hasListStyleNone(listElement: _HTMLElement): boolean {
        // Check for list-style: none in the style attribute
        const styleAttr: string | null = listElement.getAttribute('style');
        if (styleAttr && styleAttr.includes('list-style:none')) {
            return true;
        }
        
        // Also check the parsed _styles object
        if (listElement._styles) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const style = (listElement._styles as any);
            if (style.listStyle === 'none' || style.listStyleType === 'none') {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Check if an element is inline content (text node or inline element).
     *
     * @param {unknown} element - The element value
     * @returns {boolean}
     * @private
     */
    private static isInlineContent(element: _HTMLElement): boolean {
        const tagName: string = element.tagName.toLowerCase();

        // Text nodes
        if (tagName === '#text') {
            return true;
        }

        // Inline elements that can be directly rendered as text
        const inlineElements: string[] = [
            'span', 'strong', 'em', 'b', 'i', 'u', 'mark', 'code', 'kbd', 'samp',
            'sub', 'sup', 'small', 's', 'del', 'ins', 'a', 'abbr', 'cite', 'dfn', 'q'
        ];

        return inlineElements.indexOf(tagName) !== -1;
    }

    /**
     * Map a single HTML list item (<li>) that appears directly at block level.
     * This handles malformed HTML where <li> is not inside <ul>/<ol>.
     * Treats the item as a single-item list with bullet formatting.
     *
     * @param {unknown} liElement - The liElement value
     * @param {unknown} document - The document value
     * @param {unknown} owner - The owner value
     * @param {unknown} level - The level value
     * @private
     */
    static mapListItemDirect(
        liElement: _HTMLElement,
        document: WordDocument,
        owner: ParagraphOwner | undefined,
        level: number = 0
    ): Paragraph[] {
        const context: ListContext = {
            listType: 'ul', // Default to unordered list (bullet)
            level: level,
            style: 'disc',
            listId: undefined
        };

        return this.mapListItem(liElement, document, owner, context, true);
    }

    /**
     * Map an HTML list (ul/ol) inside a table cell.
     * Similar to mapHTMLList but designed for cell contexts.
     *
     * @param {unknown} cell - The cell value
     * @param {unknown} listElement - The listElement value
     * @param {unknown} document - The document value
     * @private
     */
    static mapListInTableCell(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell: any,
        listElement: _HTMLElement,
        document: WordDocument
    ): void {
        try {
            const tagName: string = listElement.tagName.toLowerCase();
            const isOrderedList: boolean = tagName === 'ol';

            // Create list context
            const context: ListContext = {
                listType: isOrderedList ? 'ol' : 'ul',
                level: 0,
                startNumber: isOrderedList ? this.getStartNumber(listElement) : undefined,
                style: this.getListStyle(listElement),
                listId: undefined
            };

            // Track if this is the first item
            let isFirstItem: boolean = true;

            // Process list items
            for (const child of listElement._childNodes) {
                const childTag: string = child.tagName.toLowerCase();

                if (childTag === 'li') {
                    // Map list item with proper formatting
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const itemParagraphs: _Paragraph[] = this.mapListItem(
                        child,
                        document,
                        cell,
                        context,
                        isFirstItem
                    );

                    isFirstItem = false;
                }
            }
        } catch (error) {
            console.error('Error mapping list in table cell:', error);
        }
    }

    /**
     * Map list properties from HTML to DocIO list styles.
     * This is a placeholder for more advanced list style mapping.
     *
     * @param {unknown} para - The para value
     * @param {unknown} context - The context value
     * @private
     */
    static applyCustomListStyle(
        para: Paragraph,
        context: ListContext
    ): void {
        try {
            if (!para.listFormat) {return; }

            // Apply custom style properties based on list style type
            if (context.style) {
                switch (context.style.toLowerCase()) {
                case 'disc':
                case 'circle':
                case 'square':
                    // Bullet list styles
                    if (context.listType === 'ul') {
                        // Apply specific bullet style
                        // Note: This requires more advanced list style configuration
                    }
                    break;

                case 'decimal':
                case 'decimal-leading-zero':
                case 'lower-alpha':
                case 'upper-alpha':
                case 'lower-roman':
                case 'upper-roman':
                    // Numbered list styles
                    if (context.listType === 'ol') {
                        // Apply specific number style
                        // Note: This requires more advanced list style configuration
                    }
                    break;
                }
            }
        } catch (error) {
            console.error('Error applying custom list style:', error);
        }
    }
}
