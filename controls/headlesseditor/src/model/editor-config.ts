import { IdGenerator } from '../utils/id-generator';
import { DocumentRoot } from './editor-node';
import type { ExtensionDefinition } from '../extensions/types';
import type { ContentChangedPayload, SelectionChangedPayload } from '../events/public-events/document-events';
import type { BeforePastePayload, AfterPastePayload, BeforeDeletePayload, AfterDeletePayload } from '../events/public-events/user-events';
import type { FileUploadHandler } from './file-upload-handler';

/**
 * EditorConfig — the public configuration object for creating an Editor instance.
 *
 * Contains Syncfusion-owned types only. No implementation-specific types are exposed.
 * Products use this interface to configure editor behavior, content, and lifecycle hooks.
 */
export interface EditorConfig {
    /**
     * Initial document content as a structured object.
     *
     * Use this when you have pre-built document data (e.g., from a database,
     * API response, or previous editor state).
     *
     * This property is read once at creation. To replace the document of a
     * live editor later, use `editor.setDocument(doc)` instead — it swaps the
     * document in a single transaction and preserves the editor instance,
     * plugins, and undo history.
     *
     * If both `document` and `content` are provided, `document` takes precedence.
     *
     * @default Empty document with single paragraph
     */
    document?: DocumentRoot;

    /**
     * Initial document content as HTML markup.
     *
     * Convenience property for importing HTML content (templates, copy-paste,
     * or migration scenarios).
     *
     * This property is read once at creation. To replace the content of a
     * live editor later, use `editor.setContent(html)` instead — it swaps the
     * document in a single transaction and preserves the editor instance,
     * plugins, and undo history.
     *
     * Requires an HTML content parser extension to be loaded. If `document`
     * is also provided, it takes precedence and this is ignored.
     *
     * @default undefined
     * @example
     * content: '<h1>Welcome</h1><p>Start typing...</p>'
     */
    content?: string;

    /**
     * Array of extensions that provide formatting, blocks, and behaviors.
     *
     * Extensions add support for features like bold/italic, headings, lists,
     * tables, links, and custom functionality.
     *
     * @default Empty array (minimal schema: paragraph and text only)
     * @example
     * extensions: [
     *   boldExtension,
     *   italicExtension,
     *   headingExtension,
     *   linkExtension
     * ]
     */
    extensions?: ExtensionDefinition<object>[];

    /**
     * Custom ID generator for document nodes.
     *
     * By default, generates random UUIDs for each node.
     * Override to provide deterministic IDs for testing or external synchronization.
     *
     * @default Random UUID generator
     */
    idGenerator?: IdGenerator;

    /**
     * Auto-focus the editor when mounted.
     *
     * Values:
     * - `true` | `'auto'`: Focus at the last known selection (or start if none)
     * - `'start'`: Focus at document beginning
     * - `'end'`: Focus at document end
     * - `undefined`: No auto-focus (default)
     *
     * When using a toolbar, combine with `autoSaveSelectionOnBlur` to recover
     * the user's selection after toolbar interactions.
     *
     * @default undefined (no auto-focus)
     * @example
     * autofocus: 'start'  // Focus at document start
     */
    autofocus?: boolean | 'start' | 'end' | 'auto';

    /**
     * Enable automatic formatting from text patterns.
     *
     * When enabled, typing patterns like `**text**` (bold), `# heading`,
     * or `> quote` are automatically converted to formatted content.
     *
     * Disable if your product requires explicit formatting via toolbar/commands only.
     * Commands always work regardless of this setting.
     *
     * @default true
     */
    enableInputRules?: boolean;

    /**
     * Render editor in read-only mode.
     *
     * When enabled, all mutations are blocked. Content is viewable only.
     * Commands execute but do not modify state.
     *
     * Useful for read-only views, content preview, or collaborator-viewing mode.
     *
     * @default false (editable)
     */
    readOnly?: boolean;

    /**
     * Automatically save selection when editor loses focus.
     *
     * When enabled, the editor captures the current cursor/selection whenever
     * focus is lost. The saved selection is automatically restored before
     * executing the next command.
     *
     * Essential for toolbar-based editors where toolbar clicks blur the editor.
     * After clicking a toolbar button, the editor recovers the original selection
     * before applying the formatting command.
     *
     * @default false
     * @example
     * autoSaveSelectionOnBlur: true  // For toolbar scenarios
     */
    autoSaveSelectionOnBlur?: boolean;

    /**
     * Enables Tab and Shift+Tab keyboard behavior.
     *
     * @default true
     */
    enableTabKey?: boolean;

    /**
     * Invoked once after the editor is fully initialized and ready for use.
     */
    created?: () => void;

    /**
     * Invoked before the editor starts its teardown sequence.
     */
    destroyed?: () => void;

    /**
     * Invoked after content is modified (document change committed).
     */
    contentChanged?: (payload: ContentChangedPayload) => void;

    /**
     * Invoked when the cursor or selection moves (without document change).
     */
    selectionChanged?: (payload: SelectionChangedPayload) => void;

    /**
     * Invoked when the editor gains DOM focus.
     */
    focus?: () => void;

    /**
     * Invoked when the editor loses DOM focus.
     */
    blur?: () => void;

    /**
     * Invoked before pasted content is inserted into the document.
     * Allows inspection and transformation of clipboard content.
     */
    beforePaste?: (payload: BeforePastePayload) => void;

    /**
     * Invoked after pasted content has been inserted into the document.
     */
    afterPaste?: (payload: AfterPastePayload) => void;

    /**
     * Invoked before content is deleted from the document.
     */
    beforeDelete?: (payload: BeforeDeletePayload) => void;

    /**
     * Invoked after content has been deleted from the document.
     */
    afterDelete?: (payload: AfterDeletePayload) => void;

    /**
     * File upload handler for processing files (images, documents, etc.).
     * Must be provided to enable file upload functionality.
     *
     * The handler is called asynchronously when files are pasted, dropped,
     * or submitted via the API. It should upload the file to a server and
     * return the hosted URL.
     *
     * @example
     * ```ts
     * fileUploadHandler: {
     *   upload: async ({ file, onProgress }) => {
     *     const formData = new FormData();
     *     formData.append('file', file);
     *     const response = await fetch('/api/upload', { method: 'POST', body: formData });
     *     const data = await response.json();
     *     return { url: data.url };
     *   }
     * }
     * ```
     */
    fileUploadHandler?: FileUploadHandler;
}
