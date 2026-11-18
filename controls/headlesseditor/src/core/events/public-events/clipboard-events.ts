import { CancelableEvent } from '../cancelable-event';
import { EditorEvent } from '../editor-event';

/**
 * Clipboard content carried by paste events.
 *
 * This is a PM-independent view of the clipboard payload. Listeners that
 * need the parsed document structure should read `editor.getDocument()`
 * in the `AFTER_PASTE` handler. Post-parse transformation belongs in the
 * `config.clipboard.transformContent` hook, not in these events.
 *
 * @public
 */
export interface PasteContent {
    /**
     * HTML content from the clipboard (after Headless security sanitisation
     * and any product `transformHTML` hook has run).
     */
    htmlContent: string;

    /**
     * Plain text fallback content from the clipboard.
     */
    text?: string;

    /**
     * Detected source format: 'html' | 'text' | 'mixed'.
     */
    sourceFormat: 'html' | 'text' | 'mixed';

    /**
     * Image files extracted from clipboard content.
     *
     * Populated when:
     * - User pastes direct image files (image/png, image/jpeg, etc.) from system clipboard
     * - HTML content contains images as data URIs (automatically converted to File objects)
     *
     * Empty or undefined when source is plain text or HTML without embedded images.
     */
    files?: File[];
}

/**
 * Payload for beforePaste — carries the parsed clipboard content ready
 * for insertion. Set `event.cancel = true` to abort the paste.
 *
 * @public
 */
export interface BeforePasteEventArgs {
    /** The parsed clipboard content about to be inserted. */
    content: PasteContent;
    /** The original DOM paste event. */
    event: ClipboardEvent;
}

/**
 * Payload for afterPaste — describes what was actually inserted.
 *
 * @public
 */
export interface AfterPasteEventArgs {
    /** The content that was inserted. */
    content: PasteContent;
    /** Position in document where content was inserted. */
    insertPosition: number;
    /** Number of characters/nodes inserted. */
    insertedLength: number;
    /** The original DOM paste event. */
    event: ClipboardEvent;
}
