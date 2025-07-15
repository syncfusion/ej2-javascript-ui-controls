/**
 * Specifies  common models interfaces.
 *
 * @hidden
 * @deprecated
 */
import { EmitType, KeyboardEventArgs, Observer } from '@syncfusion/ej2-base';
import { EditorMode, EnterKey, SelectionDirection, TriggerType } from './types';
import { MarkdownSelection } from '../markdown-parser/plugin/markdown-selection';
import { UndoRedoManager } from '../editor-manager/plugin/undo';
import { UndoRedoCommands } from '../markdown-parser/plugin/undo';
import { NodeSelection } from '../selection/selection';
import { MDSelectionFormats } from '../markdown-parser/plugin/md-selection-formats';
import { AudioCommand, CodeBlockPlugin, DOMNode, EmojiPickerAction, FormatPainterActions, IFormatPainterEditor, ImageCommand, LinkCommand, NodeCutter, PasteCleanupAction, TableCommand, VideoCommand } from '../editor-manager';
import { DOMMethods } from '../editor-manager/plugin/dom-tree';
import { MDLink, MDTable } from '../markdown-parser';
import { CustomUserAgentData } from './user-agent';
import { DropDownButton, ItemModel as DropDownItemModel, SplitButton } from '@syncfusion/ej2-splitbuttons';
import { ItemModel, OverflowMode } from '@syncfusion/ej2-navigations';
import { EmojiSettingsModel } from '../models/emoji-settings-model';
import { FormatPainterSettingsModel, IFrameSettingsModel, ImageSettingsModel, PasteCleanupSettingsModel, QuickToolbarSettingsModel, TableSettingsModel } from '../models/models';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Popup, Dialog } from '@syncfusion/ej2-popups';
import { ColorPicker, ColorPickerEventArgs, ColorPickerModel } from '@syncfusion/ej2-inputs';
import { ImageInputSource } from './enum';


/**
 * @deprecated
 */
export interface IAdvanceListItem {
    listStyle?: string
    listImage?: string
    type?: string
}

/**
 * @deprecated
 */
export interface ICodeBlockItem {
    language?: string
    action?: string
    label?: string
    enterAction?: string
    currentFormat?: ICodeBlockItem
    codeBlockElement?: HTMLElement
    id?: string
}

/**
 * @deprecated
 */
export interface IMarkdownFormatterCallBack {
    selectedText?: string
    editorMode?: EditorMode
    action?: string
    event?: KeyboardEvent | MouseEvent
    requestType?: string
}

/**
 * @deprecated
 */
export interface IHtmlFormatterCallBack {
    selectedNode?: Element
    requestType?: string
    range?: Range
    editorMode?: EditorMode
    action?: string
    elements?: Element | Element[]
    imgElem?: Element | Element[]
    event?: KeyboardEvent | MouseEvent | ClipboardEvent
    isKeyboardEvent?: boolean
}

/**
 * @deprecated
 */
export interface IMarkdownToolbarStatus {
    OrderedList: boolean
    UnorderedList: boolean
    Formats: string
}
/**
 * @deprecated
 */
export interface IUndoCallBack {
    callBack?: Function
    event?: Object
}

/**
 * @deprecated
 */
export interface IToolbarStatus {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
    superscript?: boolean
    subscript?: boolean
    fontcolor?: string
    fontname?: string
    fontsize?: string
    backgroundcolor?: string
    formats?: string
    alignments?: string
    orderedlist?: boolean
    unorderedlist?: boolean
    inlinecode?: boolean
    uppercase?: boolean
    lowercase?: boolean
    createlink?: boolean
    insertcode?: boolean
    blockquote?: boolean
    numberFormatList?: string | boolean
    bulletFormatList?: string | boolean
    InlineCode?: boolean
    isCodeBlock?: boolean
}
/**
 * @deprecated
 * @private
 *
 *
 * */
export interface IImageResizeFactor {
    // [x multiplier, y multiplier]
    topLeft: [number, number];
    topRight: [number, number];
    botLeft: [number, number];
    botRight: [number, number];
}

/**
 * The `ImageOrTableCursor` is used to specify the image or table cursor in Enter key Module.
 *
 * @private
 * @hidden
 *
 *
 * */
export interface ImageOrTableCursor {
    start: boolean;
    startName: string;
    end: boolean;
    endName: string;
    startNode?: HTMLElement;
    endNode?: HTMLElement;
}

/**
 * The `ImageDimension` is used to specify the width and height of the editor image.
 *
 * @private
 * @hidden
 */
export interface ImageDimension {
    width: number;
    height: number;
}

/**
 * List item properties for the list conversion in MS Word cleanup
 *
 * @private
 * @hidden
 */
export interface ListItemProperties {
    listType: string;
    content: string[];
    nestedLevel: number;
    listFormatOverride: number;
    class: string;
    listStyle: string;
    listStyleTypeName: string;
    start: number;
    styleMarginLeft: string;
}

/**
 * File Info for PasteCleanup Action.
 *
 * @private
 * @hidden
 */
export interface FileInfo {
    /**
     * Returns the upload file name.
     */
    name: string;
    /**
     * Returns the details about upload file.
     *
     */
    rawFile: string | Blob;
    /**
     * Returns the size of file in bytes.
     */
    size: number;
    /**
     * Returns the status of the file.
     */
    status: string;
    /**
     * Returns the MIME type of file as a string. Returns empty string if the file’s type is not determined.
     */
    type: string;
    /**
     * Returns the list of validation errors (if any).
     */
    validationMessages: ValidationMessages;
    /**
     * Returns the current state of the file such as Failed, Canceled, Selected, Uploaded, or Uploading.
     */
    statusCode: string;
}

export interface ValidationMessages {
    /**
     * Returns the minimum file size validation message, if selected file size is less than specified minFileSize property.
     */
    minSize?: string;
    /**
     * Returns the maximum file size validation message, if selected file size is less than specified maxFileSize property.
     */
    maxSize?: string;
}

/**
 * Provides information about a EditorModel.
 *
 * @hidden
 */
export interface IEditorModel {
    currentDocument?: Document
    execCommand?: Function
    observer?: Observer
    markdownSelection?: MarkdownSelection
    undoRedoManager?: UndoRedoManager | UndoRedoCommands
    nodeSelection?: NodeSelection
    mdSelectionFormats?: MDSelectionFormats
    domNode?: DOMNode
    nodeCutter?: NodeCutter
    formatPainterEditor?: IFormatPainterEditor
    domTree?: DOMMethods
    linkObj?: LinkCommand | MDLink
    videoObj?: VideoCommand
    audioObj?: AudioCommand
    imgObj?: ImageCommand
    formatPainterObj?: FormatPainterActions
    tableObj?: TableCommand | MDTable
    pasteObj?: PasteCleanupAction
    emojiPickerObj?: EmojiPickerAction
    editableElement?: Element
    userAgentData?: CustomUserAgentData
    destroy?(): void
    beforeSlashMenuApplyFormat?(): void
    codeBlockObj?: CodeBlockPlugin
}

/**
 * @hidden
 * @deprecated
 */
export interface IDropDownItemModel extends DropDownItemModel {
    cssClass?: string
    command?: string
    subCommand?: string
    value?: string
    text?: string
}

/**
 * @hidden
 * @deprecated
 */
export interface IToolbarItemModel extends ItemModel {
    command?: string
    subCommand?: string
}

/**
 * Represents the details of an image integrated into the Rich Text Editor.
 */
export interface IImageCommandsArgs {
    /** Specifies the `src` attribute of the image. */
    url?: string
    /** Represents the current selection instance. */
    selection?: NodeSelection
    /** Specifies the minimum, maximum, and actual width of the image. */
    width?: { minWidth?: string | number; maxWidth?: string | number; width?: string | number }
    /** Specifies the minimum, maximum, and actual height of the image. */
    height?: { minHeight?: string | number; maxHeight?: string | number; height?: string | number }
    /** Describes the alternate text attribute for the image. */
    altText?: string
    /** Defines the CSS class names to be applied to the image. */
    cssClass?: string
    /** Refers to the image element that is to be edited. */
    selectParent?: Node[]
}

/**
 * Provides details about an audio element added to the Rich Text Editor.
 */
export interface IAudioCommandsArgs {
    /** Specifies the source URL of the audio. */
    url?: string
    /** Represents the instance of the current selection within the editor. */
    selection?: NodeSelection
    /** Specifies the file name of the audio. */
    fileName?: string
    /** Specifies the CSS class to be applied to the audio element. */
    cssClass?: string
    /** Represents the selected parent node of the audio element to be edited. */
    selectParent?: Node[]
    /** Specifies the title attribute for the audio element. */
    title?: string
}

/**
 * Provides details about a video element added to the Rich Text Editor.
 */
export interface IVideoCommandsArgs {
    /** Specifies the source URL of the video. */
    url?: string
    /** Represents the instance of the current selection within the editor. */
    selection?: NodeSelection
    /** Defines the minimum, maximum, and current width of the video. */
    width?: { minWidth?: string | number; maxWidth?: string | number; width?: string | number }
    /** Defines the minimum, maximum, and current height of the video. */
    height?: { minHeight?: string | number; maxHeight?: string | number; height?: string | number }
    /** Specifies the file name of the video, which can be a string or a DocumentFragment. */
    fileName?: string | DocumentFragment
    /** Indicates whether the video link is an embedded URL. */
    isEmbedUrl?: boolean
    /** Specifies the CSS class to be applied to the video element. */
    cssClass?: string
    /** Represents the selected parent node of the video element to be edited. */
    selectParent?: Node[]
    /** Specifies the title attribute for the video element. */
    title?: string
}

/**
 * Provides information about a TouchData.
 */
export interface ITouchData {
    prevClientX?: number
    prevClientY?: number
    clientX?: number
    clientY?: number
}

/**
 * Provides details about a table added to the Rich Text Editor.
 */
export interface ITableCommandsArgs {
    /**
     * @deprecated
     * This argument deprecated. Use `rows` argument.
     */
    row?: number
    /** Specifies the number of rows to be inserted in the table. */
    rows?: number
    /** Specifies the number of columns to be inserted in the table. */
    columns?: number
    /** Defines the minimum width, maximum width, and width of the table. */
    width?: { minWidth?: string | number; maxWidth?: string | number; width?: string | number }
    /** Represents the instance of the current selection. */
    selection?: NodeSelection
}

/**
 * Provides information about a ExecuteCommandOption.
 */
export interface ExecuteCommandOption {
    undo?: boolean
}

/**
 * @hidden
 * @deprecated
 */
export interface StatusArgs {
    html: Object
    markdown: Object
}

/**
 * @hidden
 * @deprecated
 */
export interface CleanupResizeElemArgs {
    name?: string,
    value: string,
    callBack(value: string): void
}

/**
 * @hidden
 * @deprecated
 */
export interface ICodeBlockLanguageModel {
    label?: string
    language?: string
}

/**
 * Provides detailed information about an actionBegin event.
 */
export interface ActionBeginEventArgs {
    /** Specifies the type of the current action. */
    requestType?: string
    /** Indicates whether to cancel the current action. */
    cancel?: boolean
    /**
     * Specifies the current toolbar or dropdown item involved in the action.
     *
     * @deprecated
     */
    item?: IToolbarItemModel | IDropDownItemModel
    /** Specifies the event that initiated the action, such as mouse, keyboard, or drag events. */
    originalEvent?: MouseEvent | KeyboardEvent | DragEvent
    /** Specifies the name of the event. */
    name?: string
    /** Specifies whether the selection type is a dropdown. */
    selectType?: string
    /**
     * Provides details about URL actions.
     *
     * @deprecated
     */
    itemCollection?: IItemCollectionArgs
    /**
     * Defines the emoji picker details.
     *
     * @deprecated
     */
    emojiPickerArgs?: IEmojiPickerArgs
    /**
     * Defines the content to be exported.
     *
     * @deprecated
     */
    exportValue?: string
}

export interface IEmojiPickerArgs {
    emojiSettings: EmojiSettingsModel

}

/**
 * Provides detailed information about a Print event in the Rich Text Editor (RTE).
 */
export interface PrintEventArgs extends ActionBeginEventArgs {
    /** Defines the Rich Text Editor (RTE) element associated with the Print event. */
    element?: Element
}

/**
 * @deprecated
 */
export interface IItemCollectionArgs {
    /** Defines the instance of the current selection */
    selection?: NodeSelection
    /** Defines the HTML elements of currently selected content */
    selectNode?: Node[]
    /** Defines the parent HTML elements of current selection */
    selectParent?: Node[]
    /** Defines the URL action details for link element */
    url?: string
    /** Defines the Display Text action details for link element */
    text?: string
    /** Defines the title of the link action details */
    title?: string
    /** Defines the target as string for link element */
    target?: string
    /** Defines the element to be inserted */
    insertElement?: Element
}

/**
 * @deprecated
 */
export interface IExecutionGroup {
    command: string
    subCommand?: string
    value?: string
}

/**
 * Provides information about a notification event in the rich text editor.
 */
export interface NotifyArgs {
    module?: string
    args?: KeyboardEvent | MouseEvent | ClickEventArgs | ClipboardEvent | TouchEvent
    cancel?: boolean
    requestType?: string
    enable?: boolean
    properties?: object
    selection?: NodeSelection
    link?: HTMLInputElement
    selectNode?: Node[]
    selectParent?: Node[]
    url?: string
    text?: string
    isWordPaste?: boolean
    title?: string
    target?: string
    member?: string
    /** Specifies the name of the notifier handling the event. */
    name?: string
    /** Represents the range of text selection involved in the notification. */
    range?: Range
    /** Describes the action associated with the notification event. */
    action?: string
    callBack?(args?: string | IImageCommandsArgs, cropImageData?:
    { [key: string]: string | boolean | number }[], pasteTableSource?: string): void
    file?: Blob
    insertElement?: Element
    touchData?: ITouchData
    allowedStylePropertiesArray?: string[]
    isPlainPaste?: boolean
    formatPainterSettings?: FormatPainterSettingsModel
    ariaLabel?: string
    /**
     * Defines the source of the Table content.
     *
     * @private
     */
    pasteTableSource?: string
}

/**
 * Provides details about a link added to the Rich Text Editor.
 */
export interface ILinkCommandsArgs {
    /** Specifies the URL attribute of the link. */
    url?: string
    /** Represents the instance of the current selection. */
    selection?: NodeSelection
    /** Indicates the title for the link to be inserted. */
    title?: string
    /** Specifies the text for the link to be inserted. */
    text?: string
    /** Indicates the target attribute of the link. */
    target?: string
    /** Identifies the link element to be edited. */
    selectParent?: Node[]
}

/**
 * @hidden
 * @deprecated
 */
export interface IDropDownItem extends ItemModel {
    command?: string
    subCommand?: string
    controlParent?: DropDownButton
    listImage?: string
    value?: string
    label?: string
}

/**
 * @hidden
 * @deprecated
 */
export interface IDropDownClickArgs extends ClickEventArgs {
    item: IDropDownItem;
}

/**
 * @deprecated
 */
export interface IToolsItems {
    id: string
    icon?: string
    tooltip?: string
    command?: string
    subCommand?: string
    value?: string
}

/**
 * Provides detailed information about an ActionComplete event.
 */
export interface ActionCompleteEventArgs {
    /** Specifies the type of the current action. */
    requestType?: string
    /** Specifies the name of the event. */
    name?: string
    /** Specifies the current mode of the editor. */
    editorMode?: string
    /**
     * Defines the selected elements.
     *
     * @deprecated
     */
    elements?: Node[];
    /** Specifies the event associated with the action, such as a mouse or keyboard event. */
    event?: MouseEvent | KeyboardEvent;
    /**
     * Defines the selected range.
     *
     * @deprecated
     */
    range?: Range
}

/**
 * Provides details about an code block element added to the Rich Text Editor.
 */
export interface ICodeBlockCommandsArgs {
    /** Specifies the language of the code block. */
    language?: string
    /** Specifies the label for the code block. */
    label?: string
}

/**
 * Provides information about a BeforeSanitizeHtml event.
 */
export interface BeforeSanitizeHtmlArgs {
    /** Indicates whether the current action needs to be prevented. */
    cancel?: boolean
    /** A callback function executed before the inbuilt action, which should return HTML as a string.
     *
     * @function
     * @param {string} value - The input value.
     * @returns {string} - The HTML string.
     */
    helper?: Function
    /** Returns the selectors object containing both tags and attribute selectors to block cross-site scripting attacks.
     * It is also possible to modify the block list within this event.
     */
    selectors?: SanitizeSelectors
}

/**
 * Provides information about SanitizeSelectors.
 */
export interface SanitizeSelectors {
    /** Returns the list of tags. */
    tags?: string[]
    /** Returns the list of attributes to be removed. */
    attributes?: SanitizeRemoveAttrs[]
}

/**
 * Provides information about a SanitizeRemoveAttributes.
 */
export interface SanitizeRemoveAttrs {
    /** Defines the attribute name to sanitize. */
    attribute?: string
    /** Defines the selector that sanitizes the specified attributes within the selector. */
    selector?: string
}

/**
 * Provides information about a ToolbarClick event in the RichTextEditor.
 */
export interface ToolbarClickEventArgs {
    /**
     * Determines if the current toolbar click action can be canceled.
     */
    cancel: boolean
    /**
     * Defines the current Toolbar Item Object being clicked.
     */
    item: ItemModel
    /**
     * Contains the original mouse event arguments related to the toolbar click.
     */
    originalEvent: MouseEvent
    /**
     * Specifies the request type associated with the toolbar click event.
     */
    requestType: string
    /**
     * Specifies the name of the event.
     */
    name?: string
}

/**
 * @deprecated
 */
export interface IShowPopupArgs {
    args?: MouseEvent | TouchEvent | KeyboardEvent
    type?: string
    isNotify: boolean
    elements?: Element | Element[]
}

/**
 * @deprecated
 */
export interface OffsetPosition {
    left: number
    top: number
}

/**
 * Provides information about a Resize event.
 */
export interface ResizeArgs {
    /** Specifies the resize event arguments. */
    event?: MouseEvent | TouchEvent
    /** Describes the type of request. */
    requestType?: string
    /** Indicates whether the action should be canceled. */
    cancel?: boolean
}

/**
 * Provides information related to a DialogClose event in the RichTextEditor.
 */
export interface DialogCloseEventArgs {
    /**
     * Identifies if the current action can be canceled.
     */
    cancel: boolean
    /**
     * Returns the root container element of the dialog being closed.
     */
    container: HTMLElement
    /**
     * Provides reference to the dialog element being closed.
     */
    element: Element
    /**
     * Returns the original event arguments, if any.
     */
    event: Event
    /**
     * Determines if the dialog close event is triggered by user interaction.
     */
    isInteracted: boolean
    /**
     * DEPRECATED-Determines whether the event is triggered by interaction.
     */
    isInteraction: boolean
    /**
     * Specifies the event name, if available.
     */
    /* eslint-disable */
    name?: String
    /* eslint-enable */
    /**
     * Determines if action can be prevented; target details.
     */
    /* eslint-disable */
    target: HTMLElement | String
    /* eslint-enable */
}

/**
 * Provides information about a TableModel.
 */
export interface ITableModel {
    rteElement?: HTMLElement,
    tableSettings?: TableSettingsModel
    readonly?: boolean;
    enableRtl?: boolean;
    enterKey?: EnterKey | string;
    editorMode?: EditorMode | string;
    quickToolbarSettings?: QuickToolbarSettingsModel;
    getEditPanel?(): Element;
    getDocument?(): Document;
    getCssClass(isSpace?: boolean): string
    preventDefaultResize(e?: PointerEvent | MouseEvent, isDefault?: boolean): void;
    resizeStart(args?: ResizeArgs): void;
    resizing(args?: ResizeArgs): void;
    resizeEnd(args?: ResizeArgs): void;
    addRow(selectCell?: NodeSelection, e?: ClickEventArgs | KeyboardEvent, tabkey?: boolean): void;
    hideTableQuickToolbar(): void;
    removeTable(selection?: NodeSelection, args?: ClickEventArgs | KeyboardEventArgs, delKey?: boolean): void;
    isTableQuickToolbarVisible(): boolean;
}

export interface IColorPickerModel extends ColorPickerModel {
    element?: HTMLElement
    value?: string
    command?: string
    subCommand?: string
    target?: string
    iconCss?: string
    cssClass?: string
}

/**
 * @hidden
 * @deprecated
 */
export interface IColorPickerEventArgs extends ColorPickerEventArgs {
    item?: IColorPickerModel
    originalEvent: string
    cancel?: boolean
}

/**
 * @deprecated
 */
export interface ITableArgs {
    rows?: number
    columns?: number
    width?: { minWidth?: string | number; maxWidth?: string | number; width?: string | number }
    selection?: NodeSelection
    selectNode?: Node[]
    selectParent?: Node[]
    subCommand?: string
}

/**
 * @deprecated
 */
export interface ImageDragEvent extends DragEvent {
    rangeParent?: Element
    rangeOffset?: number
}

/**
 * @deprecated
 */
export interface IMarkdownFormatterModel {
    element?: Element
    formatTags?: { [key: string]: string }
    listTags?: { [key: string]: string }
    keyConfig?: { [key: string]: string }
    options?: { [key: string]: number }
    selectionTags?: { [key: string]: string }
}

/**
 * @deprecated
 */
export interface IHtmlFormatterModel {
    currentDocument?: Document
    element?: Element
    keyConfig?: { [key: string]: string }
    options?: { [key: string]: number }
    formatPainterSettings?: FormatPainterSettingsModel
}

/**
 * Provides detailed information about an image uploading event.
 */
export interface ImageUploadingEventArgs {
    /**
     * Defines whether the current image upload action can be prevented.
     */
    cancel: boolean
    /**
     * Defines the additional data in a key and value pair format that will be submitted with the upload action.
     */
    customFormData: { [key: string]: Object; }[];
    /**
     * Returns the XMLHttpRequest instance that is associated with the current upload action.
     */
    currentRequest?: { [key: string]: string }[]
    /**
     * Returns the list of files that are scheduled to be uploaded.
     */
    filesData: FileInfo[]
}

/**
 * Provides information about a Paste Cleanup Action Model.
 */
export interface IPasteModel {
    rteElement?: HTMLElement,
    enterKey?: EnterKey | string;
    rootContainer?: HTMLElement;
    enableXhtml?: boolean;
    iframeSettings?: IFrameSettingsModel;
    pasteCleanupSettings?: PasteCleanupSettingsModel;
    insertImageSettings?: ImageSettingsModel;
    getInsertImgMaxWidth?(): string | number;
    getDocument?(): Document;
    getEditPanel?(): Element;
    updateValue?(): void;
    imageUpload?(): void;
    getCropImageData?(): CropImageDataItem[];
}

export interface CropImageDataItem {
    goalWidth?: number | string | boolean;
    goalHeight?: number | string | boolean;
    cropLength?: number | string | boolean;
    cropTop?: number | string | boolean;
    cropR?: number | string | boolean;
    cropB?: number | string | boolean;
}

/**
 * @deprecated
 */
export interface IDropDownModel {
    content?: string
    items: IDropDownItemModel[]
    iconCss?: string
    itemName: string
    cssClass: string
    element: HTMLElement
    activeElement?: HTMLElement
}

/**
 * @deprecated
 */
export interface ISplitButtonModel {
    content?: string
    items: DropDownItemModel[]
    iconCss?: string
    itemName: string
    cssClass: string
    element: HTMLElement
}

/**
 * @hidden
 * @deprecated
 */
export interface IFormatPainter {
    /** Stores the previous action. */
    previousAction: string
    destroy: Function
}

/**
 * @deprecated
 */
export interface IFormatPainterArgs {
    /**
     * Defines the action to be performed.
     * Allowed values are 'format-copy', 'format-paste', 'escape'.
     */
    formatPainterAction: string
}

/**
 * Provides information about a ToolbarItems.
 */
export interface IToolbarItems {
    template?: string
    tooltipText?: string
    command?: string
    subCommand?: string
    undo?: boolean
    click?: EmitType<ClickEventArgs>
}

/**
 * Provides information about a ToolbarItemConfig.
 */
export interface IToolsItemConfigs {
    icon?: string
    tooltip?: string
    command?: string
    subCommand?: string
    value?: string
}

/**
 * @hidden
 * @deprecated
 */
export interface IListDropDownModel extends DropDownItemModel {
    cssClass?: string
    command?: string
    subCommand?: string
    value?: string
    text?: string
    listStyle?: string
    listImage?: string
}

/**
 * Provides detailed information about the `beforeQuickToolbarOpen` event in the editor.
 */
export interface BeforeQuickToolbarOpenArgs {
    /**
     * Defines the instance of the current popup element.
     *
     * @deprecated
     */
    popup?: Popup
    /** Determine whether the quick toolbar should be prevented from opening. */
    cancel?: boolean
    /** Defines the target element on which the quick toolbar is triggered. */
    targetElement?: Element
    /**
     * @deprecated
     *
     * Defines the X-coordinate position where the quick toolbar will appear.
     */
    positionX?: number
    /**
     * @deprecated
     *
     * Defines the Y-coordinate position where the quick toolbar will appear.
     */
    positionY?: number
    /**
     * @hidden
     *
     * Defines the trigger type of the Quick toolbar action.
     */
    type?: TriggerType
}

/**
 * The interface helps to generate necessary arguments for calculating the offsetX and offsetY values.
 *
 * @hidden
 */
export interface QuickToolbarOffsetParam {
    /**
     * Specifies the relative element of the popup.
     */
    blockElement: HTMLElement
    /**
     * Specifies the DOMRect of the popup relative element.
     */
    blockRect: DOMRect
    /**
     * Specifies the range of the editor instance.
     */
    range: Range
    /**
     * Specifies the current range DOMRect of the editor.
     */
    rangeRect: DOMRect
    /**
     * Specifies the iframe element DOMRect, when the editor is in `iframe` mode.
     */
    iframeRect?: DOMRect
    /**
     * Specifies the content panel element.
     */
    contentPanelElement?: HTMLElement
    /**
     * Specifies the editable element DOMRect.
     */
    editPanelDomRect?: DOMRect
    /**
     * Specifies the selection direction.
     */
    direction: SelectionDirection
    /**
     * Specifies the Quick toolbar trigger type.
     */
    type: TriggerType
}

/**
 * Provides specific details about a successful Image upload event in the RichTextEditor.
 */
export interface ImageSuccessEventArgs {
    /**
     * Returns the original event arguments.
     */
    e?: object
    /**
     * Details about the file that was successfully uploaded.
     */
    file: FileInfo
    /**
     * Provides the status text describing the image upload.
     */
    statusText?: string
    /**
     * Describes the operation performed during the upload event.
     */
    operation: string
    /**
     * Returns the response details of the upload event, if any.
     */
    response?: ResponseEventArgs
    /**
     * Specifies the name of the event.
     */
    name?: string
    /**
     * Specifies the HTML element related to the event.
     */
    element?: HTMLElement
    /**
     * Provides the detected image source related to the event.
     */
    detectImageSource?: ImageInputSource
}

/**
 * Provides information about a response received after an Image upload event in the RichTextEditor.
 */
export interface ResponseEventArgs {
    /**
     * Returns upload image headers information, if available.
     */
    headers?: string
    /**
     * Returns readyState information of the upload process.
     */
    readyState?: object
    /**
     * Provides the status code returned for the uploaded image.
     */
    statusCode?: object
    /**
     * Returns the status text of the uploaded image.
     */
    statusText?: string
    /**
     * Indicates if the upload was performed with credentials.
     */
    withCredentials?: boolean
}

/**
 * @deprecated
 */
export interface IColorPickerRenderArgs {
    items?: string[]
    containerType?: string
    container?: HTMLElement
}

/**
 * Provides information about the image drop event in a rich text editor.
 */
export interface ImageDropEventArgs extends DragEvent {
    /** Determines whether the action should be prevented. */
    cancel: boolean
    /** Refers to the parent element of the drop range. */
    rangeParent?: Element
    /** Specifies the offset value for the drop range. */
    rangeOffset?: number
}

/**
 * @deprecated
 */
export interface ITableNotifyArgs {
    module?: string
    args?: ClickEventArgs | MouseEvent | KeyboardEventArgs | TouchEvent
    selection?: NodeSelection
    selectNode?: Node[]
    selectParent?: Node[]
    cancel?: boolean
    requestType?: string
    enable?: boolean
    properties?: object
    self?: ITableModule
}
/**
 * @hidden
 * @private
 */
export interface MetaTag {
    /**
     * The name attribute of the meta tag.
     */
    name?: string;
    /**
     * The content attribute of the meta tag.
     */
    content?: string;
    /**
     * The charset attribute of the meta tag.
     */
    charset?: string;
    /**
     * The http-equiv attribute of the meta tag.
     */
    httpEquiv?: string;
    /**
     * The property attribute of the meta tag.
     */
    property?: string;
}
/**
 * @hidden
 * @private
 */
export interface EditTableModel {
    width: number;
    padding: number;
    spacing: number;
}

/**
 * @hidden
 * @private
 */
export interface ITableModule {
    // Public properties
    tableObj?: TableCommand;
    element?: HTMLElement;
    popupObj?: Popup;
    editdlgObj?: Dialog;

    // Public methods
    createTablePopupOpened?(): void;
    customTable?(rowValue: number, columnValue: number): void;
    applyTableProperties?(model: EditTableModel): void;
    showDialog?(isExternal: boolean, e?: NotifyArgs): void;
    destroy?(): void;
}

export interface IEmojiIcons {
    /** Specifies the description of the emoji icon. */
    desc: string
    /** Specifies the Unicode representation of the emoji icon. */
    code: string
}

export interface EmojiIconsSet {
    /** Specifies the name of the category for the Unicode. */
    name: string
    /** Specifies the Unicode representation of the icon displayed in the emoji picker toolbar item. */
    code: string
    /** Specifies the CSS class for styling the emoji icon. */
    iconCss?: string
    /** Specifies the collection of emoji icons. */
    icons: IEmojiIcons[]
}

/**
 * Specifies the custom slash menu item configuration.
 *
 */
export interface ISlashMenuItem {
    /**
     * Specifies the text to be displayed in the slash menu item.
     */
    text: string
    /**
     * Specifies the command to be executed when the slash menu item is clicked.
     */
    command: string
    /**
     * Specifies the icon class to be added in the slash menu item for visual representation.
     */
    iconCss: string
    /**
     * Specifies the description to be displayed in the slash menu item.
     */
    description?: string
    /**
     * Specifies the type of the slash menu item. Grouping will be done based on the type.
     */
    type: string
}
