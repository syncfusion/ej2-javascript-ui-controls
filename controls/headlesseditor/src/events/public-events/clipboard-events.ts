import { CancelableEvent } from '../cancelable-event';
import { EditorEvent } from '../editor-event';

/**
 * Raw clipboard content before any processing.
 *
 * @public
 */
export interface PasteContent {
    /**
     * HTML content from clipboard or cleaned via adapter.
     * May contain office artifacts before cleaning stage.
     */
    htmlContent: string;

    /**
     * Plain text fallback content from clipboard.
     */
    text?: string;

    /**
     * Detected source format: 'html' | 'text' | 'mixed'
     */
    sourceFormat: 'html' | 'text' | 'mixed';

    /**
     * Image files from clipboard.
     */
    files?: File[];

    /**
     * Metadata attached during cleaning (sanitization, office detection, etc).
     */
    metadata?: {
        sanitized?: boolean;
        hadOfficeArtifacts?: boolean;
        listFormatConverted?: boolean;
    };
}

/**
 * Payload for beforePasteRaw — carries the raw clipboard content.
 *
 * @public
 */
export interface BeforePasteRawPayload {
    /** The raw HTML or plain text content from clipboard. */
    content: PasteContent;
    /** The original DOM paste event for advanced customization. */
    event: ClipboardEvent;
}

/**
 * BeforePasteRawEvent — cancelable event published before any clipboard processing.
 * Allows interception of raw clipboard content before sanitization and cleaning.
 * Set `event.cancel = true` to prevent paste.
 *
 * @public
 */
export type BeforePasteRawEvent = CancelableEvent<BeforePasteRawPayload>;

/**
 * Payload for beforePasteCleaned — carries the cleaned clipboard content.
 *
 * @public
 */
export interface BeforePasteCleanedPayload {
    /** The clipboard content after office artifact cleanup. */
    content: PasteContent;
    /** The original DOM paste event. */
    event: ClipboardEvent;
}

/**
 * BeforePasteCleanedEvent — cancelable event published after office cleanup, before PM parsing.
 * Allows customization of content before it's converted to document structure.
 * Set `event.cancel = true` to prevent paste.
 *
 * @public
 */
export type BeforePasteCleanedEvent = CancelableEvent<BeforePasteCleanedPayload>;

/**
 * Payload for beforePaste — carries the content ready for insertion into document.
 *
 * @public
 */
export interface BeforePastePayload {
    /** The content ready to be inserted (may be modified by listeners). */
    content: PasteContent;
    /** The original DOM paste event. */
    event: ClipboardEvent;
}

/**
 * BeforePasteEvent — cancelable event published before content insertion.
 * This is the final opportunity to cancel or inspect the paste operation.
 * Set `event.cancel = true` to prevent insertion.
 *
 * @public
 */
export type BeforePasteEvent = CancelableEvent<BeforePastePayload>;

/**
 * Payload for afterPaste — describes what was actually inserted.
 *
 * @public
 */
export interface AfterPastePayload {
    /** The content that was inserted. */
    content: PasteContent;
    /** Position in document where content was inserted. */
    insertPosition: number;
    /** Number of characters/nodes inserted. */
    insertedLength: number;
    /** The original DOM paste event. */
    event: ClipboardEvent;
}

/**
 * AfterPasteEvent — published after paste completes successfully.
 * Allows extensions to react to paste completion.
 *
 * @public
 */
export type AfterPasteEvent = EditorEvent<AfterPastePayload>;

/**
 * Enumeration of paste event type names for EventBus subscription.
 *
 * @public
 */
export const PASTE_EVENT_TYPES: Record<string, string> = {
    /** Fired before any clipboard processing — raw content from clipboard. */
    BEFORE_PASTE_RAW: 'beforePasteRaw',
    /** Fired after office cleanup — sanitized content before PM parsing. */
    BEFORE_PASTE_CLEANED: 'beforePasteCleaned',
    /** Fired before content insertion — final processed content. */
    BEFORE_PASTE: 'beforePaste',
    /** Fired after paste completes — for monitoring and analytics. */
    AFTER_PASTE: 'afterPaste'
} as const;

/**
 * Creates a BeforePasteRawEvent instance.
 *
 * @param {PasteContent} content - The raw clipboard content.
 * @param {ClipboardEvent} event - The DOM paste event.
 * @returns {BeforePasteRawEvent} The constructed event.
 *
 * @public
 */
export function createBeforePasteRawEvent(
    content: PasteContent,
    event: ClipboardEvent
): BeforePasteRawEvent {
    return {
        type: PASTE_EVENT_TYPES.BEFORE_PASTE_RAW,
        payload: {
            content,
            event
        },
        cancel: false
    };
}

/**
 * Creates a BeforePasteCleanedEvent instance.
 *
 * @param {PasteContent} content - The cleaned clipboard content.
 * @param {ClipboardEvent} event - The DOM paste event.
 * @param {Object} metadata - Optional metadata about cleaning process.
 * @returns {BeforePasteCleanedEvent} The constructed event.
 *
 * @public
 */
export function createBeforePasteCleanedEvent(
    content: PasteContent,
    event: ClipboardEvent,
    metadata?: {
        wasSanitized?: boolean;
        hadOfficeArtifacts?: boolean;
        listFormatConverted?: boolean;
    }
): BeforePasteCleanedEvent {
    // Merge metadata into content if provided
    if (metadata) {
        content.metadata = {
            sanitized: metadata.wasSanitized,
            hadOfficeArtifacts: metadata.hadOfficeArtifacts,
            listFormatConverted: metadata.listFormatConverted
        };
    }

    return {
        type: PASTE_EVENT_TYPES.BEFORE_PASTE_CLEANED,
        payload: {
            content,
            event
        },
        cancel: false
    };
}

/**
 * Creates a BeforePasteEvent instance.
 *
 * @param {PasteContent} content - The content ready for insertion.
 * @param {ClipboardEvent} event - The DOM paste event.
 * @returns {BeforePasteEvent} The constructed event.
 *
 * @public
 */
export function createBeforePasteEvent(
    content: PasteContent,
    event: ClipboardEvent
): BeforePasteEvent {
    return {
        type: PASTE_EVENT_TYPES.BEFORE_PASTE,
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
 * @returns {AfterPasteEvent} The constructed event.
 *
 * @public
 */
export function createAfterPasteEvent(
    content: PasteContent,
    event: ClipboardEvent,
    insertPosition: number,
    insertedLength: number
): AfterPasteEvent {
    return {
        type: PASTE_EVENT_TYPES.AFTER_PASTE,
        payload: {
            content,
            event,
            insertPosition,
            insertedLength
        }
    };
}
