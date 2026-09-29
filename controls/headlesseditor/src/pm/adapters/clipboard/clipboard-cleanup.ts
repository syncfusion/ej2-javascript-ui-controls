import { ClipboardSanitizer } from './sanitizer';
import { MSOfficeCleaner } from './ms-office-cleanup';
import { ListConverter } from './list-converter';

/**
 * Clipboard Extract Result - Output of clipboard extraction and cleaning
 *
 * Contains the processed HTML and text content from clipboard operations,
 * along with metadata about the source format.
 *
 * @hidden
 * @internal
 */
export interface ClipboardExtractResult {
    /**
     * Cleaned HTML content ready for parsing into ProseMirror.
     * All security vulnerabilities removed, Office artifacts cleaned,
     * list formats converted to standard HTML.
     */
    htmlContent: string;

    /**
     * Plain text fallback content.
     */
    textContent: string;

    /**
     * Detected source format: 'html' | 'text' | 'mixed'
     */
    sourceFormat: 'html' | 'text' | 'mixed';

    /**
     * Whether content was sanitized (security threats removed).
     */
    wasSanitized: boolean;

    /**
     * Whether Office artifacts were detected and cleaned.
     */
    hadOfficeArtifacts: boolean;

    /**
     * Whether list format conversion was applied.
     */
    listFormatConverted: boolean;
}

/**
 * Clipboard Adapter - Main orchestrator for clipboard cleanup pipeline
 *
 * Provides headless-layer clipboard extraction and sanitization.
 * Orchestrates: Sanitization → Office Artifact Removal → List Format Conversion
 *
 * Architecture:
 * - Security-focused (blocklist approach preserves extension-specific markup)
 * - Generic (no product/RTE-specific rules; only standard HTML semantics)
 * - No ProseMirror types exposed; uses interface contracts
 *
 * Product layer applies brand-specific/format policies BEFORE parsing,
 * by listening to BEFORE_PASTE_CLEANED event.
 *
 * @hidden
 */
export class ClipboardCleanup {
    private sanitizer: ClipboardSanitizer;
    private officeArtifactCleaner: MSOfficeCleaner;
    private listConverter: ListConverter;

    constructor() {
        this.sanitizer = new ClipboardSanitizer();
        this.officeArtifactCleaner = new MSOfficeCleaner();
        this.listConverter = new ListConverter();
    }

    /**
     * Extracts clipboard content from ClipboardEvent and applies full cleanup pipeline.
     *
     * Pipeline stages:
     * 1. Extract raw HTML/text from clipboard
     * 2. Security sanitization (blocklist approach)
     * 3. Office artifact detection and removal
     * 4. List format conversion (MS Word lists → HTML lists)
     *
     * @param {ClipboardEvent} event - Clipboard event from paste handler
     * @returns {ClipboardExtractResult} Cleaned content ready for parsing
     * @hidden
     */
    public extractAndCleanClipboard(event: ClipboardEvent): ClipboardExtractResult {
        const result: ClipboardExtractResult = {
            htmlContent: '',
            textContent: '',
            sourceFormat: 'text',
            wasSanitized: false,
            hadOfficeArtifacts: false,
            listFormatConverted: false
        };

        // Guard: No clipboard data
        if (!event.clipboardData) {
            return result;
        }

        // Stage 1: Extract raw content
        const rawHtmlContent: string = this.extractHtmlFromClipboard(event.clipboardData);
        const textContent: string = this.extractTextFromClipboard(event.clipboardData);

        // Determine source format
        result.textContent = textContent;
        result.sourceFormat = this.detectSourceFormat(rawHtmlContent, textContent);

        // If only text, return early (no sanitization needed)
        if (result.sourceFormat === 'text') {
            return result;
        }

        // Stage 2: Security sanitization (blocklist approach)
        let sanitizedHtml: string = this.sanitizer.sanitizeHTML(rawHtmlContent);
        result.wasSanitized = true;

        // Create working container from sanitized HTML
        const container: HTMLElement = this.createContainerFromHtml(sanitizedHtml);

        // Stage 3: Office artifact detection and removal
        // Check if Office cleanup will be needed by testing against known patterns
        const beforeClean: string = sanitizedHtml;
        sanitizedHtml = this.officeArtifactCleaner.cleanOfficeArtifacts(sanitizedHtml);
        result.hadOfficeArtifacts = beforeClean !== sanitizedHtml;

        if (result.hadOfficeArtifacts) {
            // Update container with cleaned HTML
            const cleanedContainer: HTMLElement = this.createContainerFromHtml(sanitizedHtml);
            container.innerHTML = cleanedContainer.innerHTML;
        }

        // Stage 4: List format conversion
        if (this.hasOfficeListFormats(container)) {
            this.listConverter.convertOfficeListsToHtml(container);
            result.listFormatConverted = true;
        }

        // Stage 5: Final cleanup - empty elements and comments
        this.sanitizer.removeComments(container);
        this.removeEmptyNodes(container);

        // Extract final HTML
        result.htmlContent = container.innerHTML;

        return result;
    }

    /**
     * Extracts HTML content from clipboard.
     * Tries multiple MIME types in order of preference.
     *
     * @param {DataTransfer} clipboardData - Clipboard data from event
     * @returns {string} HTML content or empty string
     * @hidden
     */
    private extractHtmlFromClipboard(clipboardData: DataTransfer): string {
        const mimeTypes: string[] = [
            'text/html',
            'application/xhtml+xml',
            'text/xml'
        ];

        for (const mimeType of mimeTypes) {
            const content: string = clipboardData.getData(mimeType);
            if (!!content && content.length > 0) {
                return content;
            }
        }

        return '';
    }

    /**
     * Extracts text content from clipboard.
     *
     * @param {DataTransfer} clipboardData - Clipboard data from event
     * @returns {string} Text content or empty string
     * @hidden
     */
    private extractTextFromClipboard(clipboardData: DataTransfer): string {
        const content: string = clipboardData.getData('text/plain');
        return content ? content : '';
    }

    /**
     * Detects source format of clipboard content.
     * Analyzes whether content is pure text, pure HTML, or mixed.
     *
     * @param {string} htmlContent - HTML content
     * @param {string} textContent - Text content
     * @returns {'html' | 'text' | 'mixed'} Detected format
     * @hidden
     */
    private detectSourceFormat(
        htmlContent: string,
        textContent: string
    ): 'html' | 'text' | 'mixed' {
        if (!htmlContent || htmlContent.length === 0) {
            return 'text';
        }

        // Check if HTML contains actual HTML tags (beyond basic structure)
        const htmlTagPattern: RegExp = /<(?!html|body|meta|DOCTYPE|\/html|\/body)[^>]+>/i;
        const hasHtmlMarkup: boolean = htmlTagPattern.test(htmlContent);

        if (!hasHtmlMarkup) {
            return 'text';
        }

        // Has both HTML structure and text
        return textContent && textContent.length > 0 ? 'mixed' : 'html';
    }

    /**
     * Creates a DOM container from HTML string.
     * Uses DOMParser for safe parsing.
     *
     * @param {string} htmlContent - HTML content to parse
     * @returns {HTMLElement} Container element with parsed content
     * @hidden
     */
    private createContainerFromHtml(htmlContent: string): HTMLElement {
        const container: HTMLElement = document.createElement('div');

        if (!htmlContent || htmlContent.length === 0) {
            return container;
        }

        try {
            // Use DOMParser for safe parsing
            const parser: DOMParser = new DOMParser();
            const doc: Document = parser.parseFromString(htmlContent, 'text/html');

            // Extract body content (DOMParser wraps everything in html/body)
            const body: HTMLElement | null = doc.body;
            if (body) {
                // Move all children from body to container
                while (body.firstChild) {
                    container.appendChild(body.firstChild);
                }
            }
        } catch (error) {
            // Fallback: Use innerHTML if DOMParser fails
            container.innerHTML = htmlContent;
        }

        return container;
    }

    /**
     * Checks if container has Office list formats.
     * Detects mso-list styles and MsoListParagraph classes.
     *
     * @param {HTMLElement} container - Container to check
     * @returns {boolean} True if Office list formats detected
     * @hidden
     */
    private hasOfficeListFormats(container: HTMLElement): boolean {
        // Check for MS Word list style markers
        const msoListElements: NodeListOf<Element> = container.querySelectorAll('[style*="mso-list"]');
        if (msoListElements.length > 0) {
            return true;
        }

        // Check for MS Word list class markers
        const msoListClassElements: NodeListOf<Element> = container.querySelectorAll('.MsoListParagraph, .msolistparagraph');
        if (msoListClassElements.length > 0) {
            return true;
        }

        // Check for nesting level markers
        const nestingElements: NodeListOf<Element> = container.querySelectorAll('[style*="level"]');
        if (nestingElements.length > 0) {
            // Verify it's a list-related level marker
            for (let i: number = 0; i < nestingElements.length; i++) {
                // eslint-disable-next-line security/detect-object-injection
                const style: string = (nestingElements[i] as HTMLElement).getAttribute('style') || '';
                if (style.indexOf('mso-list:') >= 0) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Removes empty nodes from container.
     * Preserves self-closing tags (BR, IMG, HR, etc.)
     * and empty table cells.
     *
     * @param {HTMLElement} container - Container to clean
     * @returns {void}
     * @hidden
     */
    private removeEmptyNodes(container: HTMLElement): void {
        const allNodes: NodeListOf<Element> = container.querySelectorAll('*');
        const nodesToRemove: Element[] = [];

        // Self-closing tags that should never be removed
        const selfClosingTags: string[] = ['BR', 'IMG', 'HR', 'INPUT', 'META', 'LINK'];

        for (let i: number = 0; i < allNodes.length; i++) {
            // eslint-disable-next-line security/detect-object-injection
            const node: Element = allNodes[i];
            const tagName: string = node.nodeName;

            // Skip self-closing tags
            if (selfClosingTags.indexOf(tagName) !== -1) {
                continue;
            }

            // Skip table cells (always kept, even if empty)
            if (tagName === 'TD' || tagName === 'TH') {
                continue;
            }

            // Check if node is empty (no text, no child elements except empty children)
            const hasContent: boolean = this.nodeHasContent(node);
            if (!hasContent) {
                nodesToRemove.push(node);
            }
        }

        // Remove marked nodes
        for (const node of nodesToRemove) {
            node.parentElement?.removeChild(node);
        }
    }

    /**
     * Checks if a node has meaningful content.
     *
     * @param {Element} node - Node to check
     * @returns {boolean} True if node has content
     * @hidden
     */
    private nodeHasContent(node: Element): boolean {
        // Check for text content (trimmed)
        const textContent: string | undefined = node.textContent?.trim();
        if (textContent && textContent.length > 0) {
            return true;
        }

        // Check for child elements with content
        const children: HTMLCollection = node.children;
        for (let i: number = 0; i < children.length; i++) {
            // eslint-disable-next-line security/detect-object-injection
            const child: Element = children[i];
            const tagName: string = child.nodeName;

            // Self-closing tags count as content
            if (['BR', 'IMG', 'HR', 'INPUT'].indexOf(tagName) !== -1) {
                return true;
            }

            // Recursively check children
            if (this.nodeHasContent(child)) {
                return true;
            }
        }

        return false;
    }
}
