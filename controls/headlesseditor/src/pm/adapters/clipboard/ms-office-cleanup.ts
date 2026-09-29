/**
 * Office Artifact Cleaner - Removes MS Word, Google Docs, and other office suite artifacts
 *
 * Adapted from RTE's ms-word-clean-up.ts
 * Handles detection and removal of Office-specific markup while preserving semantic content.
 *
 * @hidden
 * @internal
 */
export class MSOfficeCleaner {
    /**
     * HTML elements that should be preserved during cleanup.
     * Determines which elements are semantically important.
     */
    private readonly IGNORABLE_NODES: string[] = [
        'A', 'APPLET', 'B', 'BLOCKQUOTE', 'BR',
        'BUTTON', 'CENTER', 'CODE', 'COL', 'COLGROUP', 'DD', 'DEL', 'DFN', 'DIR', 'DIV',
        'DL', 'DT', 'EM', 'FIELDSET', 'FONT', 'FORM', 'FRAME', 'FRAMESET', 'H1', 'H2',
        'H3', 'H4', 'H5', 'H6', 'HR', 'I', 'IMG', 'IFRAME', 'INPUT', 'INS', 'LABEL',
        'LI', 'OL', 'OPTION', 'P', 'PARAM', 'PRE', 'Q', 'S', 'SELECT', 'SPAN', 'STRIKE',
        'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH',
        'THEAD', 'TITLE', 'TR', 'TT', 'U', 'UL'
    ];

    /**
     * Block-level HTML elements used for content structure.
     */
    private readonly BLOCK_NODES: string[] = [
        'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'address', 'blockquote', 'button', 'center', 'dd', 'dir', 'dl', 'dt', 'fieldset',
        'frameset', 'hr', 'iframe', 'isindex', 'li', 'map', 'menu', 'noframes', 'noscript',
        'object', 'ol', 'pre', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul',
        'header', 'article', 'nav', 'footer', 'section', 'aside', 'main', 'figure', 'figcaption'
    ];

    /**
     * Elements that should be removed entirely (not just their attributes).
     */
    private readonly REMOVABLE_ELEMENTS: string[] = ['o:p', 'style', 'w:sdt'];

    /**
     * Cleans HTML content by removing Office-specific artifacts.
     * Detects content source and applies appropriate cleanup.
     *
     * @param {string} html - The HTML content to clean
     * @returns {string} Cleaned HTML with Office artifacts removed
     * @hidden
     */
    public cleanOfficeArtifacts(html: string): string {
        if (!html || html.trim() === '') {
            return html;
        }

        // Detect Office content patterns
        const isMSWordContent: boolean = this.detectMSWordContent(html);
        const isGoogleDocsContent: boolean = this.detectGoogleDocsContent(html);

        // Only apply cleanup if office content is detected
        if (!isMSWordContent && !isGoogleDocsContent) {
            return html;
        }

        // Apply appropriate cleanup
        if (isMSWordContent) {
            html = this.cleanMSWordArtifacts(html);
        }

        if (isGoogleDocsContent) {
            html = this.cleanGoogleDocsArtifacts(html);
        }

        // General cleanup (applies to all detected Office content)
        html = this.removeGeneralOfficeArtifacts(html);

        return html;
    }

    /**
     * Detects if HTML content is from MS Word.
     * Looks for Word-specific patterns and markers.
     *
     * @param {string} html - HTML content to check
     * @returns {boolean} True if content appears to be from MS Word
     * @hidden
     */
    private detectMSWordContent(html: string): boolean {
        const patterns: RegExp[] = [
            /class='?Mso|style='[^ ]*\bmso-/i,                    // Single quotes
            /class="?Mso|style="[^ ]*\bmso-/i,                    // Double quotes
            /class="?Xl|class='?Xl|class=Xl/i,                    // Excel markers
            /style="[^"]*\bmso-|style='[^']*\bmso-/i,             // MSO styles
            /w:WordDocument/i,                                     // Word document marker
            /xmlns:w="/i                                          // Word namespace
        ];

        return patterns.some((pattern: RegExp) => pattern.test(html));
    }

    /**
     * Detects if HTML content is from Google Docs.
     * Looks for Google Docs-specific markers.
     *
     * @param {string} html - HTML content to check
     * @returns {boolean} True if content appears to be from Google Docs
     * @hidden
     */
    private detectGoogleDocsContent(html: string): boolean {
        const patterns: RegExp[] = [
            /data-docs-internal-/i,  // Google Docs internal attributes
            /google-docs-mode/i      // Google Docs mode marker
        ];

        return patterns.some((pattern: RegExp) => pattern.test(html));
    }

    /**
     * Cleans MS Word-specific artifacts from HTML.
     * Removes Word namespace declarations, MSO styles, and Word-specific tags.
     *
     * @param {string} html - HTML content to clean
     * @returns {string} Cleaned HTML
     * @hidden
     */
    private cleanMSWordArtifacts(html: string): string {
        // Remove Word namespace declarations
        html = html.replace(/xmlns:w="[^"]*"/g, '');
        html = html.replace(/xmlns:o="[^"]*"/g, '');
        html = html.replace(/xmlns:m="[^"]*"/g, '');
        html = html.replace(/xmlns:v="[^"]*"/g, '');

        // Remove MSO-specific styles (keep other inline styles)
        html = html.replace(/\bmso-[^:]*:[^;]*/gi, '');

        // Remove Word-specific style attributes
        html = html.replace(/style='mso-width-source:[^']*'/gi, '');
        html = html.replace(/style="mso-width-source:[^"]*"/gi, '');

        return html;
    }

    /**
     * Cleans Google Docs-specific artifacts from HTML.
     * Removes internal Google Docs attributes and markers.
     *
     * @param {string} html - HTML content to clean
     * @returns {string} Cleaned HTML
     * @hidden
     */
    private cleanGoogleDocsArtifacts(html: string): string {
        // Remove Google Docs internal attributes (attr name + optional ="value").
        // Stripped from sanitized clipboard HTML of bounded size — not user-controlled regex input.
        // eslint-disable-next-line security/detect-unsafe-regex
        html = html.replace(/\bdata-docs-internal-[a-zA-Z0-9_-]+(?:\s*=\s*"[^"]*")?/g, '');

        // Remove Google Docs mode marker
        html = html.replace(/google-docs-mode/g, '');

        return html;
    }

    /**
     * Removes general Office artifacts that apply to all Office content.
     * Removes Office-specific tags and attributes.
     *
     * @param {string} html - HTML content to clean
     * @returns {string} Cleaned HTML
     * @hidden
     */
    private removeGeneralOfficeArtifacts(html: string): string {
        const temp: HTMLElement = document.createElement('div');
        temp.innerHTML = html;

        // Remove Office-specific tags
        for (const tagName of this.REMOVABLE_ELEMENTS) {
            const elements: NodeListOf<HTMLElement> = temp.querySelectorAll(tagName);
            for (let i: number = elements.length - 1; i >= 0; i--) {
                // eslint-disable-next-line security/detect-object-injection
                const element: HTMLElement = elements[i];
                while (element.firstChild) {
                    element.parentNode?.insertBefore(element.firstChild, element);
                }
                element.parentNode?.removeChild(element);
            }
        }

        // Remove style elements (often contain Office-specific styles)
        const styleElements: NodeListOf<HTMLElement> = temp.querySelectorAll('style');
        for (let i: number = styleElements.length - 1; i >= 0; i--) {
            // eslint-disable-next-line security/detect-object-injection
            styleElements[i].parentNode?.removeChild(styleElements[i]);
        }

        // Clean Office-specific attributes from remaining elements
        const allElements: HTMLCollectionOf<Element> = temp.getElementsByTagName('*');
        for (let i: number = 0; i < allElements.length; i++) {
            // eslint-disable-next-line security/detect-object-injection
            const element: Element = allElements[i];

            // Remove Office-specific attributes (namespaced or urn-* attrs)
            for (const attr of Array.from(element.attributes)) {
                if (attr.name.indexOf(':') > -1 || attr.name.indexOf('urn') > -1) {
                    element.removeAttribute(attr.name);
                }
            }
        }

        return temp.innerHTML;
    }

    /**
     * Removes empty elements from HTML content.
     * Cleans up structural clutter left behind by Office cleanup.
     *
     * @param {HTMLElement} container - Container element to process
     * @returns {HTMLElement} Processed container
     * @hidden
     */
    public removeEmptyElements(container: HTMLElement): HTMLElement {
        const emptyElements: NodeListOf<HTMLElement> = container.querySelectorAll(':empty');

        for (let i: number = emptyElements.length - 1; i >= 0; i--) {
            // eslint-disable-next-line security/detect-object-injection
            const element: HTMLElement = emptyElements[i];

            // Preserve certain empty elements that have meaning
            const preservedTags: string[] = ['BR', 'IMG', 'IFRAME', 'INPUT', 'HR'];
            if (preservedTags.indexOf(element.tagName) > -1) {
                continue;
            }

            // Preserve cells in tables (can be intentionally empty)
            if (element.tagName === 'TD' || element.tagName === 'TH') {
                continue;
            }

            // Remove the element
            element.parentNode?.removeChild(element);
        }

        return container;
    }

    /**
     * Removes empty anchor tags and preserves their content.
     * Anchor tags without href attribute are not functional and should be unwrapped.
     *
     * @param {HTMLElement} container - Container element to process
     * @returns {HTMLElement} Processed container
     * @hidden
     */
    public removeEmptyAnchorTags(container: HTMLElement): HTMLElement {
        const emptyAnchors: NodeListOf<HTMLElement> = container.querySelectorAll('a:not([href])');

        for (let i: number = emptyAnchors.length - 1; i >= 0; i--) {
            // eslint-disable-next-line security/detect-object-injection
            const anchor: HTMLElement = emptyAnchors[i];
            const parent: Node | null = anchor.parentNode;

            // Move all children of the anchor to its parent
            while (anchor.firstChild) {
                parent?.insertBefore(anchor.firstChild, anchor);
            }

            // Remove the now-empty anchor
            parent?.removeChild(anchor);
        }

        return container;
    }

    /**
     * Processes table borders from Office content.
     * Converts Office table border settings to standard CSS.
     *
     * @param {HTMLElement} container - Container element to process
     * @returns {HTMLElement} Processed container
     * @hidden
     */
    public processTableBorders(container: HTMLElement): HTMLElement {
        const tableElements: NodeListOf<HTMLElement> = container.querySelectorAll('table');
        const borderSeparatePattern: RegExp = /mso-cellspacing\s*:\s*([^;]+);?/i;

        for (let i: number = 0; i < tableElements.length; i++) {
            // eslint-disable-next-line security/detect-object-injection
            const table: HTMLElement = tableElements[i];
            const styleAttr: string = table.getAttribute('style') || '';

            // Check for MSO cell spacing
            if (borderSeparatePattern.test(styleAttr)) {
                const match: RegExpMatchArray | null = styleAttr.match(borderSeparatePattern);
                if (match && match[1]) {
                    const cellSpacingValue: string = match[1];
                    table.style.borderCollapse = 'separate';
                    table.style.borderSpacing = cellSpacingValue;
                }
            }

            // Remove width: 0 styles (Office artifacts)
            const widthMatch: RegExpMatchArray | null = styleAttr.match(/width\s*:\s*0(?:px)?\s*;?/);
            if (widthMatch) {
                table.style.width = '';
                // Clean up the style attribute entirely if it's completely empty now
                if (table.getAttribute('style') === '' || table.style.cssText.trim() === '') {
                    table.removeAttribute('style');
                }
            }
        }

        return container;
    }

    /**
     * Removes margin styles from table elements.
     * Office content often includes negative margins for layout that don't apply in headless.
     *
     * @param {HTMLElement} container - Container element to process
     * @returns {HTMLElement} Processed container
     * @hidden
     */
    public removeTableMargins(container: HTMLElement): HTMLElement {
        const tables: NodeListOf<HTMLElement> = container.querySelectorAll('table');

        for (let i: number = 0; i < tables.length; i++) {
            // eslint-disable-next-line security/detect-object-injection
            const table: HTMLElement = tables[i];
            const marginLeft: string = table.style.marginLeft || '';

            // Clear negative margins (these are Office artifacts)
            if (marginLeft && marginLeft.indexOf('-') >= 0) {
                table.style.marginLeft = '';
            }
        }

        return container;
    }

    /**
     * Removes class attributes that are Office-specific or no longer needed.
     * Preserves classes that are extension-specific or semantic.
     *
     * @param {HTMLElement} container - Container element to process
     * @returns {HTMLElement} Processed container
     * @hidden
     */
    public removeOfficeClasses(container: HTMLElement): HTMLElement {
        const elementsWithClass: NodeListOf<HTMLElement> = container.querySelectorAll('[class]');

        for (let i: number = 0; i < elementsWithClass.length; i++) {
            // eslint-disable-next-line security/detect-object-injection
            const element: HTMLElement = elementsWithClass[i];
            const className: string = element.getAttribute('class') || '';

            // Remove Office-specific classes
            if (className.toLowerCase().indexOf('mso') > -1 ||
                className.toLowerCase().indexOf('xl') > -1) {
                element.removeAttribute('class');
            }
        }

        return container;
    }

    /**
     * Checks if HTML content is a block element.
     * Used for determining content structure.
     *
     * @param {Element} element - Element to check
     * @returns {boolean} True if element is a block element
     * @hidden
     */
    private isBlockElement(element: Element): boolean {
        return this.BLOCK_NODES.indexOf(element.nodeName.toLowerCase()) !== -1;
    }

    /**
     * Determines the source format of pasted content based on detection.
     *
     * @param {string} html - HTML content
     * @param {string} text - Plain text content
     * @returns {'html' | 'text' | 'mixed'} Detected source format
     * @hidden
     */
    public detectSourceFormat(html: string, text: string): 'html' | 'text' | 'mixed' {
        const hasHtml: boolean = !!html && html.trim().length > 0;
        const hasText: boolean = !!text && text.trim().length > 0;

        if (hasHtml && hasText) {
            return 'mixed';
        }
        if (hasHtml) {
            return 'html';
        }
        return 'text';
    }
}
