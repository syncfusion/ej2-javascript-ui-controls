import { PMTransaction, PMEditorView, PMSlice, PMFragment, PMEditorState, PMNode, PMNodeType, pmTableHandlePaste, ResolvedPos } from '../../pm-guard';
import { EventBus } from '../../../core/events/event-bus';
import {
    PasteContent,
    BeforePasteEventArgs,
    AfterPasteEventArgs
} from '../../../core/events/public-events/clipboard-events';
import { defaultFileResolver, FileSourceResolver, ResolvedFileSource } from './file-resolver';
import { FileHandler } from '../../../core/services/file-handler';
import { CancelableEvent } from '../../../core/events/cancelable-event';
import { EditorEvent } from '../../../core/events';

/**
 * Paste Handler
 *
 * Thin gate attached to PMEditorView as the `handlePaste` / `handleDrop`
 * props. ProseMirror's native clipboard pipeline owns HTML extraction,
 * `transformPastedHTML`, DOM construction, schema-driven `parseSlice`,
 * `transformPasted`, and slice normalisation. Headless intercepts only
 * the cases it genuinely owns:
 *
 * - image files in the clipboard / drop payload â†’ FileHandler upload pipeline
 * - cursor inside a table â†’ prosemirror-tables `handlePaste`
 * - `BEFORE_PASTE` (cancellable) + `AFTER_PASTE` event emission
 *
 * For the common HTML/text paste path, `handlePaste` returns `false` after
 * firing `BEFORE_PASTE` so PM's native `replaceSelection` insertion runs,
 * unless a listener cancelled the paste.
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
     * File source resolver for image paste / drop.
     */
    private fileResolver: FileSourceResolver = defaultFileResolver;

    /**
     * When true, inserted images use Base64 data: URLs (so they survive
     * undo/redo history).
     */
    private allowBase64: boolean = true;

    /**
     * Debounce timer for undo/redo grouping.
     * Groups paste events within 500ms into single undo entry.
     */
    private undoGroupTimer: number = null;
    private readonly UNDO_GROUP_DELAY: number = 500;

    constructor(eventBus: EventBus, fileHandler?: FileHandler | null) {
        this.eventBus = eventBus;
        this.fileHandler = fileHandler ?? null;
    }

    /**
     * Creates a BeforePasteEvent instance.
     *
     * @param {PasteContent} content - The parsed clipboard content.
     * @param {ClipboardEvent} event - The DOM paste event.
     * @returns {CancelableEvent<BeforePasteEventArgs>} The constructed event.
     * @private
     */
    private createBeforePasteEvent(
        content: PasteContent,
        event: ClipboardEvent
    ): CancelableEvent<BeforePasteEventArgs> {
        return {
            type: 'beforePaste',
            payload: {
                content,
                event
            },
            cancel: false
        };
    }

    /**
     * Creates an AfterPasteEvent instance.
     *
     * @param {PasteContent} content - The content that was pasted.
     * @param {ClipboardEvent} event - The DOM paste event.
     * @param {number} insertPosition - Position where content was inserted.
     * @param {number} insertedLength - Number of characters/nodes inserted.
     * @returns {EditorEvent<AfterPasteEventArgs>} The constructed event.
     * @private
     */
    private createAfterPasteEvent(
        content: PasteContent,
        event: ClipboardEvent,
        insertPosition: number,
        insertedLength: number
    ): EditorEvent<AfterPasteEventArgs> {
        return {
            type: 'afterPaste',
            payload: {
                content,
                event,
                insertPosition,
                insertedLength
            }
        };
    }

    /**
     * Main paste event handler. Called by ProseMirror after it has
     * already built a `Slice` from the clipboard HTML via the native
     * `transformPastedHTML` â†’ `readHTML` â†’ `parseSlice` â†’
     * `transformPasted` pipeline.
     *
     * Headless fires `BEFORE_PASTE` (cancellable), then branches:
     * - image files in clipboard â†’ FileHandler upload pipeline
     * - cursor inside a table â†’ prosemirror-tables `handlePaste`
     * - common case â†’ dispatch `replaceSelection(slice)` + `AFTER_PASTE`
     *
     * @param {PMEditorView} view - ProseMirror view
     * @param {ClipboardEvent} event - Native paste event
     * @param {PMSlice} slice - Slice PM already parsed from clipboard HTML
     * @returns {boolean} True if handled (prevents default browser paste)
     * @hidden
     */
    public async handlePaste(view: PMEditorView, event: ClipboardEvent, slice: PMSlice): Promise<boolean> {
        this.view = view;

        // Image files from clipboard take the dedicated upload pipeline.
        const imageFiles: File[] = this.detectImageFiles(event);
        if (imageFiles.length > 0) {
            event.preventDefault();
            return this.handleImagePaste(view, imageFiles, event, 'paste');
        }

        // Fire BEFORE_PASTE (cancellable). A listener may inspect the
        // raw clipboard payload and abort the paste.
        const content: PasteContent = this.buildPasteContent(event);
        const beforePasteEvent: CancelableEvent<BeforePasteEventArgs> = this.createBeforePasteEvent(content, event);
        this.eventBus.publish(beforePasteEvent);
        if (beforePasteEvent.cancel) {
            return true;
        }

        // Cursor inside a table → delegate to prosemirror-tables for
        // row/column-aware paste expansion. Use `content.childCount`
        // rather than `slice.size` to avoid skipping valid open slices
        // (see the common-case guard below for details).
        if (this.isCursorInTable(view) && slice && slice.content.childCount > 0) {
            event.preventDefault();
            const handled: boolean = pmTableHandlePaste(view, event, slice);
            if (handled) {
                return true;
            }
        }

        // Common case: PM already parsed the slice; dispatch the
        // replacement in a single transaction with undo grouping and
        // fire AFTER_PASTE.
        // Use `content.childCount` rather than `slice.size` — an open
        // slice wrapping a single block node (e.g. an open image slice
        // with openStart/openEnd = 1) reports `size = 0` because the
        // open boundaries consume the wrapping structure, even though
        // it carries real content that should be inserted.
        if (!slice || slice.content.childCount === 0) {
            return false;
        }

        event.preventDefault();
        const insertPosition: number = view.state.selection.from;
        const tr: PMTransaction = view.state.tr.replaceSelection(slice);
        tr.setMeta('paste', true);
        this.applyTransactionWithUndoGrouping(view, tr);

        const afterPasteEvent: EditorEvent<AfterPasteEventArgs> = this.createAfterPasteEvent(
            content,
            event,
            insertPosition,
            slice.size
        );
        this.eventBus.publish(afterPasteEvent);

        return true;
    }

    /**
     * Drag-and-drop handler. Detects image files in the drop event and
     * delegates to the shared image path. Returns `false` for non-image
     * drags so ProseMirror's default text/drop handling can take over
     * (e.g. dropping a `.txt` file should still place its text content).
     *
     * @param {PMEditorView} view - ProseMirror view.
     * @param {DragEvent} event - Native drop event.
     * @param {PMSlice} _slice - Slice PM built from the drop payload (unused for image path).
     * @returns {boolean} True if handled.
     * @hidden
     */
    public async handleDrop(view: PMEditorView, event: DragEvent, _slice: PMSlice): Promise<boolean> {
        this.view = view;

        const imageFiles: File[] = this.detectImageFiles(event);
        if (imageFiles.length === 0) {
            // Not files we recognise â€” defer to PM's default behavior.
            return false;
        }

        // Prevent the default drop behavior; we're taking over.
        event.preventDefault();

        return this.handleImagePaste(view, imageFiles, event as unknown as ClipboardEvent, 'drop');
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

        // Route files through FileHandler for generic upload pipeline.
        if (this.fileHandler) {
            this.fileHandler.handleFileInput(files, source);
            return true;
        }

        // Fallback: old behavior if fileHandler not available.
        // Resolve all files in parallel. We collect both successes and
        // failures so a single bad file does not abort the whole paste.
        const resolved: ResolvedFileSource[] = [];
        for (const file of files) {
            try {
                const resolvedSource: ResolvedFileSource = await this.fileResolver(file, this.allowBase64);
                resolved.push(resolvedSource);
            } catch (err) {
                console.warn('fileResolver rejected file', err);
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
            files: resolved.map((r: ResolvedFileSource) => r.file)
        };
        const afterPasteEvent: EditorEvent<AfterPasteEventArgs> = this.createAfterPasteEvent(
            content,
            event,
            insertPosition,
            insertedLength
        );
        this.eventBus.publish(afterPasteEvent);

        return true;
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
     * Returns true when the current selection is inside a `table` node.
     *
     * @param {PMEditorView} view - The ProseMirror view.
     * @returns {boolean} True if the cursor is inside a table.
     * @hidden
     */
    private isCursorInTable(view: PMEditorView): boolean {
        const $from: ResolvedPos = view.state.selection.$from;
        for (let d: number = $from.depth; d >= 0; d--) {
            const node: PMNode = $from.node(d);
            if (node && node.type.name === 'table') {
                return true;
            }
        }
        return false;
    }

    /**
     * Builds a PM-independent `PasteContent` payload for events from the
     * originating clipboard event. The parsed ProseMirror slice is not
     * included here — events stay PM-free; post-parse transformation is
     * owned by `config.clipboard.transformContent`.
     *
     * @param {ClipboardEvent} event - The originating paste event.
     * @returns {PasteContent} Event payload describing the paste.
     * @hidden
     */
    private buildPasteContent(event: ClipboardEvent): PasteContent {
        const htmlContent: string = event.clipboardData?.getData('text/html') ?? '';
        const text: string | undefined = event.clipboardData?.getData('text/plain') ?? undefined;
        const sourceFormat: 'html' | 'text' | 'mixed' =
            htmlContent && text ? 'mixed' : htmlContent ? 'html' : 'text';
        return {
            htmlContent,
            text,
            sourceFormat
        };
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
        // Clear any pending undo group timer.
        if (this.undoGroupTimer) {
            clearTimeout(this.undoGroupTimer);
        }

        // Apply transaction.
        view.dispatch(tr);

        // Set timer to mark undo group end.
        this.undoGroupTimer = setTimeout((): void => {
            // Mark end of undo group (EPIC 7 integration).
            // If using history plugin, this ensures paste is a single undo entry.
            this.undoGroupTimer = null;
        }, this.UNDO_GROUP_DELAY);
    }

    /**
     * Cleanup resources. Call when editor is destroyed.
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
 * @param {FileHandler | null} [fileHandler] - Optional FileHandler for file upload routing
 * @returns {PasteHandler} Handler instance
 * @hidden
 */
export function createPasteHandler(eventBus: EventBus, fileHandler?: FileHandler | null): PasteHandler {
    return new PasteHandler(eventBus, fileHandler);
}

