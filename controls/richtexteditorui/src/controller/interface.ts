/**
 * Type definitions and interfaces for the `EditorController` and its public surface.
 *
 * These types define the contract between the component layer (toolbars, dialogs,
 * context menus) and the headless `EditorCore`. All command-driven mutations
 * route through the controller via the action pipeline defined here.
 */
import { InsertTablePayload } from '../common/table-payload';

/**
 * Re-export the local adapter so call sites that depend on
 * `EditorCommandMap.insertTable` can use a single import path.
 */
export type { InsertTablePayload };
/**
 * Enumerates the origin of an action invocation.
 *
 * Used to attach provenance metadata to every action so handlers, analytics,
 * and audit logs can identify how a command was triggered.
 */
export interface ExecuteOptions {
    readonly source?: 'api' | 'toolbar' | 'quickToolbar' | 'dialog' | 'contextMenu' | 'keyboard' | 'paste' | 'drop';
}

type LinkCommandBase = {
    url?: string;
    href?: string;
    text?: string;
    displayText?: string;
    title?: string | null;
    target?: string | null;
    rel?: string | null;
};

type LinkCommand =
    ({
        operation: 'insert';
    } & LinkCommandBase) |
    ({
        operation: 'edit';
    } & LinkCommandBase) |
    {
        operation: 'remove';
    } |
    ({
        operation: 'open' | 'copy';
    } & LinkCommandBase)

export type { LinkCommand };

export type ColorCommand = {
    color: string
}

/**
 * Value payload for the `fontSize` command.
 *
 * @property size - CSS size string (e.g. `"12px"`, `"1.5em"`, `"small"`).
 *                  An empty string signals the unset variant and clears
 *                  any previously applied font size.
 */
export type FontSizeCommand = {
    size: string
}

/**
 * Value payload for the `fontFamily` command.
 *
 * @property family - Font family name (e.g. `"Arial"`, `"Times New Roman"`, `"monospace"`).
 *                    An empty string signals the unset variant and clears
 *                    any previously applied font family.
 */
export type FontFamilyCommand = {
    family: string
}

/**
 * Value payload for the `codeBlock` command.
 *
 * @property language - Language identifier for syntax highlighting. Common
 *                      values include `"javascript"`, `"typescript"`,
 *                      `"html"`, `"css"`, `"python"`, `"plaintext"`, etc.
 *                      An empty string applies a plain code block with no
 *                      specific language annotation.
 */
export type CodeBlockCommand = {
    language: string
}

/**
 * Numbered (ordered) list style types.
 *
 * Mirrors the CSS `list-style-type` values supported by the
 * `<ol type>` attribute and the headless editor's `orderedList`
 * node schema. `'none'` signals the unset variant and clears any
 * previously applied numbered-list style.
 */
export type NumberListType =
    | 'none'
    | 'decimal'
    | 'lowerGreek'
    | 'lowerRoman'
    | 'upperAlpha'
    | 'lowerAlpha'
    | 'upperRoman';

/**
 * Bulleted (unordered) list style types.
 *
 * Mirrors the CSS `list-style-type` values supported by the
 * `<ul>` element and the headless editor's `bulletList` node
 * schema. `'none'` signals the unset variant and clears any
 * previously applied bulleted-list style.
 */
export type BulletListType =
    | 'none'
    | 'disc'
    | 'circle'
    | 'square';

/**
 * Discriminated union of all list-style type identifiers.
 *
 * Use {@link NumberListType} or {@link BulletListType} for
 * narrower contexts. This union is the full set supported by
 * the editor and is the value type for the
 * {@link ListStyleTypeCommand} payload.
 */
export type ListStyleType = NumberListType | BulletListType;

/**
 * Value payload for the `numberedList` and `bulletList` commands.
 *
 * @property listType - Optional style identifier to apply when the
 *                      list is created. When omitted the editor
 *                      uses its default (decimal for numbered,
 *                      disc for bulleted).
 * @property keepMarks - When true, active marks on the new list
 *                       item are preserved after toggling.
 */
export type ListCommand = {
    listType?: ListStyleType;
    keepMarks?: boolean;
}

/**
 * Value payload for the `setListStyle` command.
 *
 * Converts the list at the current selection to the supplied
 * list style type (e.g. `'lowerAlpha'`, `'square'`).
 */
export type ListStyleTypeCommand = {
    listType: ListStyleType;
}

/**
 * Text alignment values supported by the editor.
 *
 * Mirrors the headless editor's `SetTextAlignPayload.align` and
 * the CSS `text-align` property.
 */
export type AlignmentType = 'left' | 'center' | 'right' | 'justify';

/**
 * Value payload for the `setTextAlign` command.
 *
 * @property align - The alignment value to apply to the
 *                   selected block (paragraph or heading).
 */
export type AlignmentCommand = {
    align: AlignmentType;
}

/**
 * Image display modes supported by the editor.
 *
 * Mirrors the headless editor's `ImageDisplayMode`. The RTE
 * surface exposes the same union to consumers; the bridge from
 * `imageSettings.display` (`'inline' | 'break'`) → `'inline' | 'block'`
 * happens at insertion time inside `EditorController`.
 */
export type EditorImageDisplay = 'inline' | 'block';

/**
 * Image insertion payload for the `imageInsert` command.
 *
 * Mirrors the headless editor's `InsertImagePayload` from
 * `@syncfusion/ej2-headless-editor/src/extensions/builtins/image`. The
 * editor surface carries the same fields; `width` / `height` are
 * `number` to match the headless schema. The `display` field bridges
 * `imageSettings.display` to the headless's `'inline' | 'block'`.
 *
 * The headless editor renders block and inline images as `<img>`
 * tags that differ only in their CSS class
 * (`e-img-block` / `e-img-inline`); the spec's `<figure>` /
 * `<figcaption>` story is captured in a follow-up change that
 * introduces a NodeView override.
 */
export interface ImageInsertCommand {
    src: string;
    alt?: string;
    title?: string;
    /** Width in CSS pixels; `null`/`undefined` clears. */
    width?: number;
    /** Height in CSS pixels; `null`/`undefined` clears. */
    height?: number;
    /** Display mode at insertion; default is `'block'`. */
    display?: EditorImageDisplay;
    /**
     * Forward-compat attribute bag for editor-level concerns that the
     * headless extension does not natively model (caption, wrap, …).
     * Stored on the node and emitted as DOM attributes. Empty by
     * default.
     */
    attributes?: Record<string, string>;
}

/**
 * Image update payload for the `imageUpdate` command.
 *
 * Mirrors the headless editor's `UpdateImagePayload`. `null` on
 * `width` / `height` signals "clear". `display` round-trips between
 * `'inline'` and `'block'` and the headless plugin automatically
 * preserves any other stored attributes across the transform.
 */
export interface ImageUpdateCommand {
    /** Optional selector for which image to update. Defaults to the current selection. */
    target?: { src?: string; id?: string };
    src?: string;
    alt?: string;
    title?: string;
    /** `null` clears the width. */
    width?: number | null;
    /** `null` clears the height. */
    height?: number | null;
    display?: EditorImageDisplay;
    attributes?: Record<string, string>;
}

export type EditorCommandName =
    Extract<keyof EditorCommandMap, string>;

export interface EditorCommandMap {
    bold: string;
    italic: string;
    underline: string;
    strikethrough: string;
    subscript: string;
    superscript: string;
    /**
     * Inserts an image node at the current selection. Accepts a
     * partial {@link ImageInsertCommand} payload — `src` is required;
     * `display` falls back to `imageSettings.display`.
     */
    imageInsert: ImageInsertCommand;
    /**
     * Updates an existing image node identified by `target` (or the
     * current selection). All fields are optional; `null` on
     * `width` / `height` clears that dimension.
     */
    imageUpdate: ImageUpdateCommand;
    lowercase: string;
    uppercase: string;
    undo: string;
    redo: string;
    link: LinkCommand;
    heading1: string;
    heading2: string;
    heading3: string;
    heading4: string;
    paragraph: string;
    blockQuote: string;
    indent: string;
    outdent: string;
    codeBlock: CodeBlockCommand;
    horizontalRule: string;
    clearFormat: string;
    fontColor: ColorCommand;
    backgroundColor: ColorCommand;
    setFontSize: FontSizeCommand;
    setFontFamily: FontFamilyCommand;
    inlineCode: string;
    numberedList: ListCommand;
    bulletList: ListCommand;
    setListStyle: ListStyleTypeCommand;
    setTextAlign: AlignmentCommand;
    insertTable: InsertTablePayload;
    table: string;
    // Commands used by the Table Quick Toolbar.
    insertRowBefore: string;
    insertRowAfter: string;
    deleteRow: string;
    insertColumnBefore: string;
    insertColumnAfter: string;
    deleteColumn: string;
    toggleHeaderRow: string;
    tableCellBackground: ColorCommand;
    setTableCellVerticalAlign: { attribute: 'verticalAlign'; value: 'top' | 'middle' | 'bottom' };
    setTableCellHorizontalAlign: { attribute: 'textAlign'; value: 'left' | 'center' | 'right' | 'justify' };
    deleteTable: string;
    // Commands used by the Image Quick Toolbar
    altText: ImageUpdateCommand;
    caption: string;
    alignImage: string;
    setAlignImage: { attribute: 'alignImage'; value: 'left' | 'center' | 'right' };
    displayImage: string;
    inlineImage: string;
    breakImage: string;
    wrapTextImage: string;
    setWrapTextImage: { attribute: 'wrapTextImage'; value: 'left' | 'right' };
    dimensionImage: { width?: number | null; height?: number | null };
    replaceImage: ImageUpdateCommand;
    removeImage: string;

}

export type EditorCommandArguments<K extends EditorCommandName> =
    [EditorCommandMap[K]] extends [undefined]
        ? [ExecuteOptions?]
        : [EditorCommandMap[K]?, ExecuteOptions?];

/**
 * Discriminated union describing all valid action variants that
 * `EditorController.execute()` can accept.
 *
 * Initially empty (`never`); populated as specific action types are
 * designed in follow-up phases. Each variant must include a `type` field
 * that uniquely identifies the command.
 */
export type EditorAction = 'Bold' | 'Italic' | 'Strikethrough' | 'Subscript' | 'SuperScript' | 'UpperCase' |
'LowerCase' | 'InlineCode' | 'NumberedList' | 'BulletList' | 'SetListStyle' | 'Indent' | 'Outdent' | 'InsertTable';

/**
 * The result returned by `EditorController.execute()`.
 *
 * @property actionId - The unique identifier of the action that was executed.
 * @property status - The final status of the action.
 * @property documentChanged - True if the action produced at least one observable document change.
 */
export interface EditorActionResult {
    /**
     * The unique opaque identifier assigned to this action invocation.
     * The same value appears in `ActionBeginEventArgs.actionId` and
     * `ActionCompleteEventArgs.actionId` for correlation.
     */
    actionId: string;
    /**
     * The terminal status of the action invocation.
     *  - `success`: Action executed and (if applicable) produced changes.
     *  - `cancelled`: Action was cancelled by a handler in `actionBegin`.
     *  - `noop`: Action executed but had no observable effect.
     */
    status: 'success' | 'cancelled' | 'noop';
    /**
     * True if the action produced at least one observable document mutation.
     * False for cancelled actions and for no-op actions.
     */
    documentChanged: boolean;
}

/**
 * Event arguments for the `actionBegin` event in the controller's action pipeline.
 *
 * Fired synchronously after action creation and `actionId` generation but
 * BEFORE validation and `EditorCore.execute()`. Handlers may set `cancel = true`
 * to prevent execution, or replace `action` with a different valid action.
 *
 * Distinguished from the component's public `ActionBeginEventArgs` by the
 * presence of `action`, `actionId`, and `source` fields that are specific
 * to the controller pipeline.
 */
export interface ActionBeginEventArgs {
    /**
     * Discriminator string identifying the event type.
     */
    readonly name: 'actionBegin';
    /**
     * The action to be executed. Mutable: handlers may replace this with any
     * other valid `EditorAction` union member. The replacement is validated
     * after all handlers complete.
     */
    action: EditorCommandName;
    /**
     * Initially `false`. Handlers may set to `true` to prevent the action
     * from being executed. When set, no `actionComplete` event is emitted.
     */
    cancel: boolean;
    /**
     * Read-only unique identifier for this action invocation. Stable across
     * `actionBegin` and `actionComplete` to allow correlation.
     */
    actionId: string;
    /**
     * Read-only origin of the command. See {@link EditorActionSource}.
     */
    source: ExecuteOptions;
    /**
     * Read-only flag indicating whether this action was triggered by a user
     * gesture (e.g., toolbar click, key press) or a programmatic API call.
     */
    isInteracted: boolean;
}

/**
 * Event arguments for the `actionComplete` event in the controller's action pipeline.
 *
 * Fired synchronously after `EditorCore.execute()` completes and component
 * state is synchronized. Does NOT fire for cancelled actions.
 */
export interface ActionCompleteEventArgs {
    /**
     * Discriminator string identifying the event type.
     */
    name: 'actionComplete';
    /**
     * The final action that was executed, including any handler
     * customization from `actionBegin`.
     */
    action: EditorAction;
    /**
     * Read-only unique identifier for this action invocation. Matches the
     * value of the corresponding `EditorActionBeginEventArgs.actionId`.
     */
    actionId?: string;
    /**
     * Read-only origin of the command. See {@link EditorActionSource}.
     */
    source: ExecuteOptions;
    /**
     * Read-only flag indicating whether this action was triggered by a user
     * gesture or a programmatic API call.
     */
    isInteracted: boolean;
    /**
     * Read-only flag indicating whether the action produced at least one
     * observable document mutation.
     */
    documentChanged: boolean;
}

/**
 * The UI state broadcast to listeners when `EditorCore` signals a change.
 *
 * This object is frozen before being passed to listeners, ensuring
 * immutability. Fields are added as UI modules require them.
 */
export interface EditorUiState {
    /**
     * True if the document contains no content (text or nodes).
     */
    isDocumentEmpty: boolean;
    /**
     * True if a selection currently exists in the document.
     */
    hasSelection: boolean;
}

/**
 * Restricted interface exposed to UI modules (toolbars, dialogs, etc.).
 *
 * The facade enforces that all mutations route through `EditorController`
 * and that UI modules do not obtain a direct reference to `EditorController`
 * or `EditorCore`.
 */
export interface IEditorController {
    process?: Function;
    /**
     * Narrow command-execution surface used by the toolbar layer.
     *
     * Invokes a registered command by name on the headless editor through
     * the controller's action pipeline. Returning `void` keeps the surface
     * simple — the toolbar does not need to know whether the action
     * dispatched a transaction.
     *
     * @param command - Built-in command name (e.g. `'bold'`, `'italic'`).
     * @param value - Optional command value (e.g. a color string).
     */
    execute?: (command: EditorCommandName, value?: unknown) => void;
}


