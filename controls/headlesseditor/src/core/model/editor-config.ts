import { DocumentRoot } from './editor-node';
import type { ExtensionDefinition } from '../../extensions/types';
import type { ContentChangedEventArgs, DocumentChangedEventArgs, SelectionChangedEventArgs } from '../events/public-events/document-events';
import type { BeforePasteEventArgs, AfterPasteEventArgs } from '../events/public-events/clipboard-events';
import type { ResizeStartEventArgs, ResizingEventArgs, ResizeStopEventArgs } from '../events/public-events/user-events';
import type { FileUploadHandler } from './file-upload-handler';
import type { HeadlessEditor } from '../../headless-editor/headless-editor';
import type { PMSlice } from '../../pm/pm-guard';
import { BeforeFileUploadEventArgs, FileReceivedEventArgs } from '../events/public-events';

/**
 * The public configuration object for creating a Headless Editor instance.
 *
 * Provides a declarative way to configure editor behavior, initial content, extensions,
 * clipboard handling, file upload, and lifecycle event handlers. Contains Syncfusion-owned
 * types only — no implementation-specific or ProseMirror types are exposed.
 *
 * ```ts
 * const editor = new HeadlessEditor({
 *   content: '<h1>Welcome</h1>',
 *   extensions: [boldExtension, italicExtension],
 *   enableInputRules: true,
 *   autoSaveSelectionOnBlur: true,
 *   contentChanged: (args) => console.log('Content updated')
 * });
 * ```
 *
 * @public
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
     *
     * Use this hook to perform initialization tasks, such as setting up event listeners,
     * restoring saved state, or announcing editor readiness to the application.
     */
    created?: () => void;

    /**
     * Invoked before the editor starts its teardown sequence.
     *
     * Use this hook to clean up resources, save state, or perform other teardown tasks
     * before the editor is destroyed.
     */
    destroyed?: () => void;

    /**
     * Invoked after content is modified (document change committed).
     *
     * Fires whenever the document content changes as a result of user input, commands,
     * or programmatic operations. Use this to detect content mutations and update dependent state.
     *
     * @param {ContentChangedEventArgs} payload - Event arguments containing change details.
     */
    contentChanged?: (payload: ContentChangedEventArgs) => void;

    /**
     * Invoked after the document is modified (document change committed).
     *
     * Fires whenever the document structure changes. Use this to detect and respond to
     * structural changes such as node insertions, deletions, or transformations.
     *
     * @param {DocumentChangedEventArgs} payload - Event arguments containing change details.
     */
    documentChanged?: (payload: DocumentChangedEventArgs) => void;

    /**
     * Invoked when the cursor or selection moves (without document change).
     *
     * Fires whenever the user's selection or cursor position changes without modifying
     * the document content. Use this to update selection-dependent UI (e.g., highlight
     * the active heading, update toolbar button states).
     *
     * @param {SelectionChangedEventArgs} payload - Event arguments containing selection details.
     */
    selectionChanged?: (payload: SelectionChangedEventArgs) => void;

    /**
     * Invoked when the editor gains DOM focus.
     *
     * Use this to update UI state when the editor becomes active (e.g., show formatting toolbar,
     * apply visual focus styles).
     */
    focus?: () => void;

    /**
     * Invoked when the editor loses DOM focus.
     *
     * Use this to save state, close dropdowns, or update UI when the editor loses focus.
     */
    blur?: () => void;

    /**
     * Invoked before pasted content is inserted into the document.
     *
     * Allows inspection and transformation of clipboard content before insertion.
     * Use this to validate, sanitize, or modify pasted content.
     *
     * @param {BeforePasteEventArgs} payload - Event arguments with access to the paste content and metadata.
     */
    beforePaste?: (payload: BeforePasteEventArgs) => void;

    /**
     * Invoked after pasted content has been inserted into the document.
     *
     * Use this to perform post-paste operations, such as logging, analytics, or
     * post-processing of the inserted content.
     *
     * @param {AfterPasteEventArgs} payload - Event arguments with paste result details.
     */
    afterPaste?: (payload: AfterPasteEventArgs) => void;

    /**
     * Invoked before a resize operation starts on a resizable element
     * (e.g., image or media).
     *
     * Set `cancel` to `true` in the event arguments to prevent the resize.
     *
     * @param {ResizeStartEventArgs} args - Event arguments for resize start.
     */
    resizeStart?: (args: ResizeStartEventArgs) => void;

    /**
     * Invoked for every dimension update during an active resize operation
     * on a resizable element (e.g., image or media).
     *
     * @param {ResizingEventArgs} args - Event arguments containing current resize dimensions.
     */
    resizing?: (args: ResizingEventArgs) => void;

    /**
     * Invoked when a resize operation on a resizable element
     * (e.g., image or media) completes.
     *
     * @param {ResizeStopEventArgs} args - Event arguments for resize completion.
     */
    resizeStop?: (args: ResizeStopEventArgs) => void;

    /**
     * Invoked before a file is uploaded.
     *
     * Use this to validate files, show progress indicators, or log upload events.
     *
     * @param {BeforeFileUploadEventArgs} args - Event arguments with file and upload details.
     */
    beforeFileUpload?: (args: BeforeFileUploadEventArgs) => void;

    /**
     * Invoked after a file is received.
     *
     * Use this to track upload completion, update UI, or log file receipt.
     *
     * @param {FileReceivedEventArgs} args - Event arguments with file and result details.
     */
    fileReceived?: (args: FileReceivedEventArgs) => void;

    /**
     * File upload handler for processing files (images, documents, etc.).
     *
     * Must be provided to enable file upload functionality. The handler is called
     * asynchronously when files are pasted, dropped, or submitted via the API.
     * It should upload the file to a server and return the hosted URL.
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

    /**
     * Clipboard transformation hooks for product-level paste policy.
     *
     * `transformHTML` runs after Headless's non-overridable security
     * sanitiser, on the raw HTML string before ProseMirror parsing.
     * `transformContent` runs on the parsed ProseMirror slice before
     * insertion. Use these to implement `deniedTags`, `deniedAttrs`,
     * `allowedStyles`, `allowedTags`, and Word/Office-specific
     * normalisation that does not belong in generic Headless.
     *
     * @example
     * ```ts
     * clipboard: {
     *   transformHTML: (html, { editor, source }) => {
     *     // strip a denied tag before parsing
     *     return html.replace(/<table[^>]*>[\s\S]*?<\/table>/gi, '');
     *   }
     * }
     * ```
     */
    clipboard?: ClipboardOptions;
}

/**
 * Context passed to clipboard transform hooks.
 *
 * Provides the editor instance and detected source format to allow transform hooks
 * to make context-aware decisions about clipboard content handling.
 *
 * @public
 */
export interface ClipboardTransformContext {
    /**
     * The editor instance receiving the paste operation.
     */
    editor: HeadlessEditor;

    /**
     * Detected source format of the clipboard payload.
     * - `'html'`: Content was pasted from rich-text source (HTML format)
     * - `'text'`: Content was pasted as plain text
     * - `'unknown'`: Source format could not be determined
     */
    source: 'html' | 'text' | 'unknown';
}

/**
 * Parsed clipboard content as a ProseMirror slice.
 *
 * Product `transformContent` hooks receive the slice that ProseMirror's
 * schema-driven parser produced, and may return a new slice to replace it.
 * This allows for content restructuring, node type normalization, or mark filtering
 * after parsing but before insertion into the document.
 *
 * @public
 */
export interface ClipboardContent {
    /**
     * The parsed ProseMirror slice ready for insertion into the document.
     * Transform hooks may modify and return a new slice to alter the inserted content.
     */
    slice: PMSlice;
}

/**
 * Clipboard transformation options exposed on `EditorConfig.clipboard`.
 *
 * Provides extensibility points for product-level paste policies. Headless composes a
 * non-overridable security sanitiser ahead of `transformHTML`. Products register their
 * paste policy (deniedTags, deniedAttrs, allowedStyles, allowedTags, etc.) by
 * implementing one or both of these hooks to enforce content rules, normalize structure,
 * and handle platform-specific content (e.g., Office, Google Docs).
 *
 * @public
 */
export interface ClipboardOptions {
    /**
     * Transform clipboard HTML before it is parsed into editor content.
     *
     * Runs after Headless's non-overridable security sanitiser, so the input is already
     * stripped of dangerous tags, event-handler attributes, and unsafe URL protocols.
     *
     * Use this hook to:
     * - Strip platform-specific markup (Office, Google Docs boilerplate)
     * - Normalize HTML structure before schema parsing
     * - Apply deniedTags or deniedAttrs rules at the HTML level
     *
     * Return the (possibly rewritten) HTML string to feed into the ProseMirror schema parser.
     *
     * @param {string} html - The sanitized HTML string to transform.
     * @param {ClipboardTransformContext} context - Context including editor instance and source format.
     *
     * @returns {string} The transformed HTML string for parsing.
     */
    transformHTML?: (
        html: string,
        context: ClipboardTransformContext
    ) => string;

    /**
     * Transform parsed clipboard content before it is inserted.
     *
     * Receives the slice produced by ProseMirror's schema parser and may
     * return a modified slice to alter insertion behavior.
     *
     * Use this hook to:
     * - Drop foreign marks not supported by your schema
     * - Restructure node hierarchies to match document rules
     * - Normalize content after parsing but before insertion
     * - Apply schema-aware filtering and transformation
     *
     * @param {ClipboardContent} content - The parsed clipboard content with ProseMirror slice.
     * @param {ClipboardTransformContext} context - Context including editor instance and source format.
     *
     * @returns {ClipboardContent} The transformed clipboard content for insertion.
     */
    transformContent?: (
        content: ClipboardContent,
        context: ClipboardTransformContext
    ) => ClipboardContent;
}
