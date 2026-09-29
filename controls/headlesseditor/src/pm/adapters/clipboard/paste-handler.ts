import { PMDOMParser, PMTransaction, PMEditorView, PMSlice, PMFragment, PMEditorState, PMNode, PMNodeType, PMSchema } from '../../pm-guard';
import { EventBus } from '../../../events/event-bus';
import { ClipboardCleanup, ClipboardExtractResult } from './clipboard-cleanup';
import { defaultFileResolver, FileSourceResolver, ResolvedFileSource } from './file-resolver';
import { DefaultIdGenerator } from '../../../utils/id-generator';
import {
    PasteContent,
    BeforePasteRawEvent,
    BeforePasteCleanedEvent,
    BeforePasteEvent,
    AfterPasteEvent,
    createBeforePasteRawEvent,
    createBeforePasteCleanedEvent,
    createBeforePasteEvent,
    createAfterPasteEvent
} from '../../../events/public-events/clipboard-events';
import { FileHandler } from '../../../services/file-handler';

/**
 * Paste Handler
 *
 * Designed to be attached to PMEditorView as paste event handler.
 * No ProseMirror plugin needed (stateless handler approach).
 *
 * @hidden
 */
export class PasteHandler {
    /**
     * Reference to ProseMirror view (set when handler is attached).
     */
    private view: PMEditorView | null = null;

    /**
     * EventBus for publishing paste events.
     * Extensions and product layer subscribe to paste events via EventBus.
     */
    private eventBus: EventBus;

    /**
     * FileHandler for file upload orchestration.
     * Routes paste/drop files through the generic upload pipeline.
     */
    private fileHandler: FileHandler | null = null;

    /**
     * Clipboard adapter for extraction and cleanup.
     */
    private adapter: ClipboardCleanup;

    /**
     * File source resolver for image paste / drop.
     * Defaults to the in-adapter DataURL/BlobURL implementation; product layer can swap.
     */
    private fileResolver: FileSourceResolver = defaultFileResolver;

    /**
     * Generates unique IDs for inserted image nodes.
     */
    private readonly idGen: DefaultIdGenerator = new DefaultIdGenerator();

    /**
     * When true, inserted images use Base64 data: URLs (so they survive
     * undo/redo history). When false, blob: URLs are used and large files
     * are rejected by the default resolver.
     */
    private allowBase64: boolean = true;

    /**
     * Debounce timer for undo/redo grouping.
     * Groups paste events within 500ms into single undo entry.
     */
    private undoGroupTimer: number = null;
    private readonly UNDO_GROUP_DELAY: number = 500;

    constructor(eventBus: EventBus, fileHandler?: any) {
        this.eventBus = eventBus;
        this.fileHandler = fileHandler || null;
        this.adapter = new ClipboardCleanup();
    }

    /**
     * Main paste event handler.
     * Called by ProseMirror when user pastes content.
     *
     * Branches into two paths:
     * - Image files detected in clipboard → delegate to `handleImagePaste`
     *   (handles file-explorer copies, screenshots, multi-file pastes)
     * - Otherwise run the four-stage text workflow.
     *
     * @param {PMEditorView} view - ProseMirror view
     * @param {ClipboardEvent} event - Native paste event
     * @returns {boolean} True if handled (prevents default browser paste)
     * @hidden
     */
    public async handlePaste(view: PMEditorView, event: ClipboardEvent): Promise<boolean> {
        // Ensure handler is attached to this view
        this.view = view;

        // Always preventBrowser default — we own paste semantics.
        event.preventDefault();

        // Branch 1: Image files from clipboard
        const imageFiles: File[] = this.detectImageFiles(event);
        if (imageFiles.length > 0) {
            return this.handleImagePaste(view, imageFiles, event, 'paste');
        }

        // Branch 2: text/html or text/plain paste. Standard four-stage flow.
        const rawContent: PasteContent = this.extractRawPasteContent(event);

        // Publish BEFORE_PASTE_RAW
        const beforeRawEvent: BeforePasteRawEvent = createBeforePasteRawEvent(rawContent, event);
        this.eventBus.publish(beforeRawEvent);
        if (beforeRawEvent.cancel) {
            return true;
        }

        // Stage 2: Clean content
        const cleanResult: ClipboardExtractResult = this.adapter.extractAndCleanClipboard(event);
        const cleanedContent: PasteContent = this.resultToContent(cleanResult);

        // Publish BEFORE_PASTE_CLEANED
        const beforeCleanedEvent: BeforePasteCleanedEvent = createBeforePasteCleanedEvent(
            cleanedContent,
            event,
            {
                wasSanitized: cleanResult.wasSanitized,
                hadOfficeArtifacts: cleanResult.hadOfficeArtifacts,
                listFormatConverted: cleanResult.listFormatConverted
            }
        );
        this.eventBus.publish(beforeCleanedEvent);
        if (beforeCleanedEvent.cancel) {
            return true;
        }

        // Update content if listeners modified it
        cleanedContent.htmlContent = beforeCleanedEvent.payload.content.htmlContent;
        cleanedContent.text = beforeCleanedEvent.payload.content.text;
        cleanedContent.metadata = beforeCleanedEvent.payload.content.metadata;

        // Stage 3: Parse and prepare for insertion
        const pasteContent: PasteContent = {
            htmlContent: cleanedContent.htmlContent,
            text: cleanedContent.text,
            sourceFormat: cleanedContent.sourceFormat,
            metadata: cleanedContent.metadata
        };

        // Publish BEFORE_PASTE
        const beforePasteEvent: BeforePasteEvent = createBeforePasteEvent(pasteContent, event);
        this.eventBus.publish(beforePasteEvent);
        if (beforePasteEvent.cancel) {
            return true;
        }

        // Update content if listeners modified it (shallow copy)
        Object.assign(pasteContent, beforePasteEvent.payload.content);

        // Stage 4: Insert content
        const insertPosition: number = view.state.selection.from;
        const insertedLength: number = this.insertPasteContent(view, pasteContent);

        // Publish AFTER_PASTE
        const afterPasteEvent: AfterPasteEvent = createAfterPasteEvent(
            pasteContent,
            event,
            insertPosition,
            insertedLength
        );
        this.eventBus.publish(afterPasteEvent);

        return true;
    }

    /**
     * Detects image files in a clipboard/drag event.
     * Filters out non-image MIME types so screenshots, PNGs, JPEGs,
     * and other raster formats are picked up while stray text files
     * fall through to PM's default drop handler.
     *
     * @param {ClipboardEvent | DragEvent} event - Source event.
     * @returns {File[]} Image files, possibly empty.
     * @hidden
     */
    private detectImageFiles(event: ClipboardEvent | DragEvent): File[] {
        const dataTransfer: DataTransfer | null =
            (event as ClipboardEvent).clipboardData
            ?? (event as DragEvent).dataTransfer
            ?? null;

        if (!dataTransfer || !dataTransfer.files || dataTransfer.files.length === 0) {
            return [];
        }

        return Array.from(dataTransfer.files).filter(
            (file: File) => file.type && file.type.startsWith('image/')
        );
    }

    /**
     * Handles paste/drop of image files. Shared between handlePaste and
     * handleDrop so both paths emit identical events and use the same
     * insertion logic.
     *
     * @param {PMEditorView} view - ProseMirror view.
     * @param {File[]} files - Image files to insert.
     * @param {ClipboardEvent} event - Source DOM event.
     * @param {string} source - Origin of the paste/drop action.
     * @returns {boolean} True if handled.
     * @hidden
     */
    private async handleImagePaste(
        view: PMEditorView,
        files: File[],
        event: ClipboardEvent,
        source: 'paste' | 'drop' | 'api'
    ): Promise<boolean> {
        if (files.length === 0) {
            return false;
        }

        // Route files through FileHandler for generic upload pipeline
        if (this.fileHandler) {
            this.fileHandler.handleFileInput(files, source);
            return true;
        }

        // Fallback: old behavior if fileHandler not available
        // Resolve all files in parallel. We collect both successes and
        // failures so a single bad file does not abort the whole paste.
        const resolved: ResolvedFileSource[] = [];
        for (const file of files) {
            try {
                const source: ResolvedFileSource = await this.fileResolver(file, this.allowBase64);
                resolved.push(source);
            } catch (error) {
                console.warn('fileResolver rejected file', error);
            }
        }

        if (resolved.length === 0) {
            return true;
        }

        // Single transaction, single undo entry.
        const insertPosition: number = view.state.selection.from;
        const insertedLength: number = this.insertImageNodes(view, resolved);

        const content: PasteContent = {
            htmlContent: '',
            text: undefined,
            sourceFormat: 'text',
            files: resolved.map((r: ResolvedFileSource) => r.file),
            metadata: {
                sanitized: false,
                hadOfficeArtifacts: false,
                listFormatConverted: false
            }
        };
        const afterPasteEvent: AfterPasteEvent = createAfterPasteEvent(
            content,
            event,
            insertPosition,
            insertedLength
        );
        this.eventBus.publish(afterPasteEvent);

        return true;
    }

    /**
     * Type guard that distinguishes a DragEvent from a ClipboardEvent.
     * Useful in the new image path which accepts both.
     *
     * @param {ClipboardEvent | DragEvent} event - Event to check.
     * @returns {boolean} True when the event is a DragEvent.
     * @hidden
     */
    private isDragEvent(event: ClipboardEvent | DragEvent): event is DragEvent {
        // DragEvent extends MouseEvent which extends UIEvent — none of
        // those extend ClipboardEvent. A safe runtime check uses the
        // dataTransfer presence plus zero clipboardData.
        return !!((event as DragEvent).dataTransfer)
            && !(event as ClipboardEvent).clipboardData;
    }

    /**
     * Inserts a list of resolved file sources as image nodes in a single
     * transaction. Reused by both paste-of-images and drop-of-images
     * paths so the undo/redo grouping, transaction meta and selection
     * semantics stay identical.
     *
     * @param {PMEditorView} view - ProseMirror view.
     * @param {ResolvedFileSource[]} resolved - Resolved sources to insert.
     * @returns {number} Sum of inserted node sizes.
     * @hidden
     */
    public insertImageNodes(view: PMEditorView, resolved: ReadonlyArray<ResolvedFileSource>): number {
        if (!this.view || resolved.length === 0) {
            return 0;
        }

        const state: PMEditorState = view.state;
        const imageType: PMNodeType | null = state.schema.nodes['image'] ?? null;
        if (!imageType) {
            // Schema without image node — silently no-op so RTE/block editor
            // products that disable images still build cleanly.
            return 0;
        }

        const imageNodes: PMNode[] = resolved.map((source: ResolvedFileSource) => {
            const attrs: Record<string, unknown> = {
                // Stable unique id so updates / removes work later.
                id: this.idGen.generate(),
                src: source.src,
                alt: source.file.name ?? '',
                title: '',
                width: source.width ?? null,
                height: source.height ?? null,
                display: 'block',
                align: 'none',
                wrap: 'none',
                attributes: ''
            };
            return imageType.create(attrs);
        });

        // Single transaction replaces the current selection with all
        // image nodes; selection range auto-collapses to insertion point.
        // `replaceSelectionWith` accepts a single Node; PM does not let us
        // pass a Fragment directly with our type guards. Build a Slice
        // with openStart/openEnd=0 so multi-node insertion still works
        // and matches the pattern.
        const imageSlice: PMSlice = new PMSlice(PMFragment.fromArray(imageNodes), 0, 0);
        const tr: PMTransaction = state.tr.replaceSelection(imageSlice);
        tr.setMeta('paste', true);
        // Tag with image-paste meta so extension listeners (e.g. analytics)
        // can identify the source.
        tr.setMeta('pasteType', 'images');
        this.applyTransactionWithUndoGrouping(view, tr);

        return imageNodes.reduce((sum: number, n: PMNode) => sum + n.nodeSize, 0);
    }

    /**
     * Drag-and-drop handler. Detects image files in the drop event and
     * delegates to the shared image path. Returns `false` for non-image
     * drags so ProseMirror's default text/drop handling can take over
     * (e.g. dropping a `.txt` file should still place its text content).
     *
     * @param {PMEditorView} view - ProseMirror view.
     * @param {DragEvent} event - Native drop event.
     * @returns {boolean} True if handled.
     * @hidden
     */
    public async handleDrop(view: PMEditorView, event: DragEvent): Promise<boolean> {
        // Ensure handler is attached.
        this.view = view;

        const imageFiles: File[] = this.detectImageFiles(event);
        if (imageFiles.length === 0) {
            // Not files we recognise — defer to PM's default behavior.
            return false;
        }

        // Prevent the default drop behavior; we're taking over.
        event.preventDefault();

        return this.handleImagePaste(view, imageFiles, event as any, 'drop');
    }

    /**
     * Extracts raw paste content from clipboard event.
     * Returns content as-is without any cleanup.
     *
     * @param {ClipboardEvent} event - Paste event
     * @returns {PasteContent} Raw clipboard content
     * @hidden
     */
    private extractRawPasteContent(event: ClipboardEvent): PasteContent {
        if (!event.clipboardData) {
            return {
                htmlContent: '',
                text: undefined,
                sourceFormat: 'text'
            };
        }

        const htmlContent: string = event.clipboardData.getData('text/html') || '';
        const text: string = event.clipboardData.getData('text/plain') || undefined;

        return {
            htmlContent,
            text,
            sourceFormat: this.detectSourceFormat(htmlContent, text || '')
        };
    }

    /**
     * Detects source format of paste content.
     *
     * @param {string} htmlContent - HTML content
     * @param {string} text - Text content
     * @returns {'html' | 'text' | 'mixed'} Detected format
     * @hidden
     */
    private detectSourceFormat(
        htmlContent: string,
        text: string
    ): 'html' | 'text' | 'mixed' {
        if (!htmlContent || htmlContent.length === 0) {
            return 'text';
        }

        // Check for HTML tags
        const htmlTagPattern: RegExp = /<(?!html|body|meta|DOCTYPE|\/html|\/body)[^>]+>/i;
        const hasHtmlMarkup: boolean = htmlTagPattern.test(htmlContent);

        if (!hasHtmlMarkup) {
            return 'text';
        }

        return text && text.length > 0 ? 'mixed' : 'html';
    }

    /**
     * Converts ClipboardExtractResult to PasteContent.
     *
     * @param {ClipboardExtractResult} result - Extraction result
     * @returns {PasteContent} Paste content
     * @hidden
     */
    private resultToContent(result: ClipboardExtractResult): PasteContent {
        return {
            htmlContent: result.htmlContent,
            text: result.textContent,
            sourceFormat: result.sourceFormat,
            metadata: {
                sanitized: result.wasSanitized,
                hadOfficeArtifacts: result.hadOfficeArtifacts,
                listFormatConverted: result.listFormatConverted
            }
        };
    }

    /**
     * Inserts paste content into editor at selection.
     * Uses ProseMirror parsing with all extension parseHTML() rules.
     *
     * @param {PMEditorView} view - ProseMirror view
     * @param {PasteContent} content - Content to insert
     * @returns {number} Number of characters inserted
     */
    private insertPasteContent(
        view: PMEditorView,
        content: PasteContent
    ): number {
        if (!this.view) {
            return 0;
        }

        const state: PMEditorState = view.state;

        // ── Code-block special path
        if (this.isInsideCodeBlock(state)) {
            return this.insertTextInsideCodeBlock(view, content.text);
        }

        // Use text content if HTML parsing fails
        if (content.sourceFormat === 'text' || content.htmlContent.length === 0) {
            return this.insertTextContent(view, content.text);
        }

        // Parse HTML using schema and extension parseHTML rules
        const slice: PMSlice = this.parseHtmlToSlice(view, content.htmlContent);

        if (!(slice) || slice.size === 0) {
            // Fallback to text if parsing fails
            return this.insertTextContent(view, content.text);
        }

        // Create transaction to replace selection with parsed slice
        const tr: PMTransaction = state.tr.replaceSelection(slice);

        // Group with other paste transactions for undo/redo
        tr.setMeta('paste', true);
        this.applyTransactionWithUndoGrouping(view, tr);

        return slice.size;
    }

    /**
     * Returns true when the current selection is inside a `codeBlock` node.
     *
     * @param {PMEditorState} state - The editor state
     * @returns {boolean} - True if inside code block
     */
    private isInsideCodeBlock(state: PMEditorState): boolean {
        const { $from } = state.selection;
        for (let d: number = $from.depth; d >= 0; d--) {
            if ($from.node(d).type.name === 'codeBlock') {
                return true;
            }
        }
        return false;
    }

    /**
     * Inserts plain text into a code block, preserving line breaks and
     * whitespace.
     *
     * @param {PMEditorView} view - The editor view
     * @param {string} text - The text to insert
     * @returns {number} - Returns the length of the inserted text
     * @hidden
     */
    private insertTextInsideCodeBlock(view: PMEditorView, text: string | undefined): number {
        if (!text || text.length === 0) {
            return 0;
        }

        const state: PMEditorState = view.state;
        const schema: PMSchema = state.schema;
        const normalized: string = text.replace(/\r\n?/g, '\n');
        const lines: string[] = normalized.split('\n');
        const textNodes: PMNode[] = lines.map((line: string) => schema.text(line));
        const nonEmpty: PMNode[] = textNodes.filter((node: PMNode) => (node as unknown as { text?: string }).text !== '');
        if (nonEmpty.length === 0) {
            return 0;
        }

        const fragment: PMFragment = PMFragment.fromArray(nonEmpty);
        const slice: PMSlice = new PMSlice(fragment, 0, 0);

        const tr: PMTransaction = state.tr.replaceSelection(slice);
        tr.setMeta('paste', true);
        this.applyTransactionWithUndoGrouping(view, tr);

        return normalized.length;
    }

    /**
     * Inserts plain text content.
     *
     * @param {PMEditorView} view - ProseMirror view
     * @param {string} text - Text to insert
     * @returns {number} Number of characters inserted
     * @hidden
     */
    private insertTextContent(view: PMEditorView, text: string): number {
        if (!text || text.length === 0) {
            return 0;
        }

        const state: PMEditorState = view.state;
        const schema: PMSchema = state.schema;

        // Create paragraph node with text
        const node: PMNode = schema.text(text);
        const tr: PMTransaction = state.tr.replaceSelectionWith(node);

        tr.setMeta('paste', true);
        this.applyTransactionWithUndoGrouping(view, tr);

        return text.length;
    }

    /**
     * Parses HTML content to ProseMirror slice.
     * Uses PMDOMParser.fromSchema which automatically includes
     * all extension parseHTML() rules defined on node/mark specs.
     *
     * Uses `parseSlice` (not `parse`) so the resulting slice is open on
     * both sides. This is what makes inline content paste into the
     * current paragraph instead of always being promoted to a new
     * block: a closed slice (openStart=0, openEnd=0) would force PM
     * to treat the pasted content as a complete block and split the
     * surrounding paragraph around it.
     *
     * @param {PMEditorView} view - ProseMirror view
     * @param {string} htmlContent - HTML to parse
     * @returns {PMSlice | null} Parsed slice or null
     * @hidden
     */
    private parseHtmlToSlice(
        view: PMEditorView,
        htmlContent: string
    ): PMSlice | null {
        if (!htmlContent || htmlContent.length === 0) {
            return null;
        }

        try {
            const schema: PMSchema = view.state.schema;

            // Create PMDOMParser with schema (includes all extension parseHTML rules)
            const pmParser: PMDOMParser = PMDOMParser.fromSchema(schema);

            // Parse HTML and get DOM
            const dom: HTMLElement = this.createDOMFromHtml(htmlContent);
            if (!(dom)) {
                return null;
            }

            // parseSlice (not parse) returns a slice that is open on
            // both sides, with openStart/openEnd set to the maximum
            // depth the parsed content can support. That is what allows
            // a piece of text copied from inside a paragraph to be
            // pasted inline at the cursor — a closed slice would force
            // PM to insert the content as its own block.
            const slice: PMSlice = pmParser.parseSlice(dom);

            if (slice && slice.size > 0) {
                return slice;
            }

            return null;
        } catch (error) {
            console.error('Error parsing pasted HTML:', error);
            return null;
        }
    }

    /**
     * Creates DOM element from HTML string.
     * Uses safe DOMParser parsing.
     *
     * @param {string} htmlContent - HTML content
     * @returns {HTMLElement | null} DOM element or null
     * @hidden
     */
    private createDOMFromHtml(htmlContent: string): HTMLElement | null {
        if (!htmlContent || htmlContent.length === 0) {
            return null;
        }

        try {
            const parser: DOMParser = new DOMParser();
            const doc: Document = parser.parseFromString(htmlContent, 'text/html');

            // Return body content wrapped in div
            const container: HTMLElement = document.createElement('div');
            const body: HTMLElement = doc.body;

            if (body) {
                while (body.firstChild) {
                    container.appendChild(body.firstChild);
                }
            }

            return container.childNodes.length > 0 ? container : null;
        } catch (error) {
            console.error('Error creating DOM from HTML:', error);
            return null;
        }
    }

    /**
     * Applies transaction with undo/redo grouping.
     * Groups multiple paste transactions within 500ms
     * into a single undo entry.
     *
     * @param {PMEditorView} view - ProseMirror view
     * @param {PMTransaction} tr - PMTransaction to apply
     * @returns {void}
     * @hidden
     */
    private applyTransactionWithUndoGrouping(view: PMEditorView, tr: PMTransaction): void {
        // Clear any pending undo group timer
        if (this.undoGroupTimer) {
            clearTimeout(this.undoGroupTimer);
        }

        // Apply transaction
        view.dispatch(tr);

        // Set timer to mark undo group end
        this.undoGroupTimer = setTimeout(() => {
            // Mark end of undo group (EPIC 7 integration)
            // If using history plugin, this ensures paste is a single undo entry
            this.undoGroupTimer = null;
        }, this.UNDO_GROUP_DELAY);
    }

    /**
     * Cleanup resources.
     * Call when editor is destroyed.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.undoGroupTimer) {
            clearTimeout(this.undoGroupTimer);
            this.undoGroupTimer = null;
        }
        this.view = null;
    }
}

/**
 * Factory function to create a paste handler.
 *
 * @param {EventBus} eventBus - Event bus for paste event emission
 * @param {any} [fileHandler] - Optional FileHandler for file upload routing
 * @returns {PasteHandler} Handler instance
 * @hidden
 */
export function createPasteHandler(eventBus: EventBus, fileHandler?: any): PasteHandler {
    return new PasteHandler(eventBus, fileHandler);
}
