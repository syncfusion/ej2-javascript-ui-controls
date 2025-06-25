import { Component, Observer, L10n, KeyboardEventArgs, EmitType } from '@syncfusion/ej2-base';
import { ItemModel, OverflowMode } from '@syncfusion/ej2-navigations';
import { ItemModel as DropDownItemModel, DropDownButton, SplitButton } from '@syncfusion/ej2-splitbuttons';
import { RenderType } from './enum';
import { ToolbarType, ImageInputSource, TriggerType, CommandName, DialogType, ColorModeType } from '../../common/enum';
import { Toolbar } from '../actions/toolbar';
import { UndoRedoManager } from '../../editor-manager/plugin/undo';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { BaseToolbar } from '../actions/base-toolbar';
import { BaseQuickToolbar } from '../actions/base-quick-toolbar';
import { NodeSelection } from '../../selection/selection';
import { EditorMode, EnterKey, ShiftEnterKey } from './../../common/types';
import { MarkdownSelection } from './../../markdown-parser/plugin/markdown-selection';
import { ToolbarSettingsModel, IFrameSettingsModel, ImageSettingsModel, AudioSettingsModel, VideoSettingsModel, TableSettingsModel, FormatPainterSettingsModel, ImportWordModel, ExportWordModel, ExportPdfModel, CodeBlockSettingsModel } from '../../models/models';
import { QuickToolbarSettingsModel, InlineModeModel, PasteCleanupSettingsModel, EmojiSettingsModel } from '../../models/models';
import { FileManagerSettingsModel } from '../models/models';
import { Count } from '../actions/count';
import { ColorPicker, ColorPickerEventArgs, ColorPickerModel, FileInfo } from '@syncfusion/ej2-inputs';
import { Link } from '../renderer/link-module';
import { Image } from '../renderer/image-module';
import { Audio } from '../renderer/audio-module';
import { Video } from '../renderer/video-module';
import { Table } from '../renderer/table-module';
import { ServiceLocator } from '../services/service-locator';
import { UndoRedoCommands } from '../../markdown-parser/plugin/undo';
import { MDSelectionFormats } from '../../markdown-parser/plugin/md-selection-formats';
import { QuickToolbar } from '../actions/quick-toolbar';
import { HtmlEditor } from '../actions/html-editor';
import { MarkdownEditor } from '../actions/markdown-editor';
import { FullScreen } from '../actions/full-screen';
import { DropDownButtons } from '../actions/dropdown-buttons';
import { IColorPickerModel, IDropDownItemModel, IDropDownModel, IEditorModel, IExecutionGroup, IFormatPainter, IImageCommandsArgs, ISplitButtonModel, IToolbarItemModel, IToolbarItems, IToolbarStatus, ResponseEventArgs, IListDropDownModel, ISlashMenuItem, ICodeBlockCommandsArgs } from '../../common/interface';
import { KeyboardEvents } from '../actions/keyboard';
import { ViewSource } from '../renderer/view-source';
import { PasteCleanup } from '../actions/paste-clean-up';
import { Popup } from '@syncfusion/ej2-popups';
import { Resize } from '../actions/resize';
import { FileManager } from '../actions/file-manager';
import { NodeCutter, DOMNode, IFormatPainterEditor, TableCommand, LinkCommand, ImageCommand, AudioCommand, VideoCommand, EmojiPickerAction, FormatPainterActions } from '../../editor-manager';
import { EnterKeyAction } from '../actions/enter-key';
import { EmojiPicker } from '../actions/emoji-picker';
import { SlashMenuSettingsModel } from '../../models';
import { DOMMethods } from '../../editor-manager/plugin/dom-tree';
import { CustomUserAgentData } from '../../common/user-agent';
import { MDTable, MDLink } from '../../markdown-parser';
import { CodeBlock } from '../actions/code-block';
import { CodeBlockPlugin } from '../../editor-manager/plugin/code-block';
import { PasteCleanupAction } from '../../editor-manager/plugin/paste-clean-up-action';
import { PasteCleanupSettings } from '../../models/toolbar-settings';

/**
 * Specifies Rich Text Editor interfaces.
 *
 * @hidden
 * @deprecated
 */
export interface IRichTextEditor extends Component<HTMLElement> {
    /**
     * Provides data about the user agent, platform and then whether its a mobile device.
     *
     * @hidden
     *
     */
    userAgentData: CustomUserAgentData;
    /**
     * Specifies the root container of the Rich Text Editor component.
     *
     **/
    rootContainer: HTMLElement;
    toolbarSettings?: ToolbarSettingsModel

    quickToolbarSettings?: QuickToolbarSettingsModel

    iframeSettings?: IFrameSettingsModel

    /**
     * Configures the image settings of the RTE.
     *
     * @default
     * {
     * allowedTypes: ['jpeg', 'jpg', 'png'],
     * display: 'inline', width: '200px', saveFormat: 'Base64',
     * height: '200px', saveUrl:null, path: null, resize: false,
     * maxFileSize: 30000000
     * }
     */
    insertImageSettings: ImageSettingsModel
    /**
     * Configures the import word of the RTE.
     *
     * @default
     * {
     * serviceUrl:null,
     * }
     */
    importWord: ImportWordModel
    /**
     * Configures the export word of the RTE.
     *
     * @default
     * {
     * serviceUrl:null, fileName:Sample.docx, stylesheet: null,
     * }
     */
    exportWord: ExportWordModel
    /**
     * Configures the export pdf of the RTE.
     *
     * @default
     * {
     * serviceUrl:null, fileName:Sample.pdf, stylesheet: null,
     * }
     */
    exportPdf: ExportPdfModel
    /**
     * Configures the image settings of the RTE.
     *
     * @default
     * {
     * allowedTypes: ['wav', 'mp3', 'm4a','wma'],
     * layoutOption: 'Inline', saveFormat: 'Blob',
     * saveUrl:null, path: null,
     * maxFileSize: 30000000
     * }
     */
    insertAudioSettings: AudioSettingsModel
    /**
     * Configures the video settings of the RTE.
     *
     * @default
     * {
     * allowedTypes: ['mp4', 'mov', 'wmv', 'avi'],
     * layoutOption: 'Inline', width: '200px', saveFormat: 'Blob',
     * height: '200px', saveUrl:null, path: null, resize: false,
     * maxFileSize: 30000000
     * }
     */
    insertVideoSettings: VideoSettingsModel
    fileManagerSettings: FileManagerSettingsModel

    tableSettings: TableSettingsModel

    pasteCleanupSettings: PasteCleanupSettingsModel
    /**
     * Configure the format painter settings of the RTE.
     *
     * @default
     * {
     * allowedFormats: 'b; em; font; sub; sup; kbd; i; s; u; code; strong; span; p; div; h1; h2; h3; h4; h5; h6; blockquote; table; thead; tbody; tr; td; th; ol; ul; li; pre;',
     * deniedFormats: null
     * }
     */
    formatPainterSettings: FormatPainterSettingsModel

    emojiPickerSettings: EmojiSettingsModel

    floatingToolbarOffset?: number

    showCharCount?: boolean
    enableTabKey?: boolean

    maxLength?: number

    inlineMode?: InlineModeModel

    width?: string | number

    height?: string | number

    fontFamily?: IFontProperties

    fontSize?: IFontProperties

    fontColor?: IColorProperties

    numberFormatList?: INumberFormatListPropertiesProperties

    bulletFormatList?: IBulletFormatListPropertiesProperties

    codeBlockSettings?: CodeBlockSettingsModel

    backgroundColor?: IColorProperties

    format?: IFormatProperties

    value?: string
    saveInterval?: number

    showTooltip?: boolean;
    isBlur?: boolean
    isRTE?: boolean
    contentModule?: IRenderer
    enabled?: boolean
    readonly?: boolean
    placeholder?: string
    cssClass?: string
    valueContainer?: HTMLTextAreaElement
    editorMode?: EditorMode
    enableHtmlEncode?: boolean
    formatter?: IFormatter
    inputElement?: HTMLElement
    toolbarModule?: Toolbar
    tableModule?: Table
    fileManagerModule?: FileManager
    sourceCodeModule?: ViewSource
    getToolbarElement?(): Element
    fullScreenModule?: FullScreen
    resizeModule?: Resize
    refreshUI?(): void
    enterKeyModule?: EnterKeyAction
    enterKey?: EnterKey
    shiftEnterKey?: ShiftEnterKey
    audioModule?: Audio
    videoModule?: Video
    pasteCleanupModule?: PasteCleanup
    codeBlockModule?: CodeBlock
    undoRedoModule?: UndoRedoManager
    quickToolbarModule?: QuickToolbar
    undoRedoSteps?: number
    markdownEditorModule: MarkdownEditor
    htmlEditorModule: HtmlEditor
    countModule?: Count
    formatPainterModule?: IFormatPainter
    emojiPickerModule?: EmojiPicker
    serviceLocator?: ServiceLocator
    setEnable?(): void
    setReadOnly?(isInit?: boolean): void
    setPlaceHolder?(): void
    updateValue?(): void
    print(): void
    getContent?(): Element
    setRTEContent?(value: Element): void
    ensureModuleInjected(module: object): boolean
    getToolbar(): HTMLElement
    getTBarItemsIndex?(items: string[]): number[]
    getCollection?(items: string | string[]): string[]
    getRange(): Range
    getID(): string
    getCssClass(isSpace?: boolean): string
    getText(): string
    updateValueData?(): void
    getBaseToolbarObject(): BaseToolbar
    keyConfig?: { [key: string]: string }
    undoRedoTimer?: number
    sourceCode?(): void
    enableToolbarItem?(items: string | string[]): void
    disableToolbarItem?(items: string | string[]): void
    wireScrollElementsEvents?(): void
    unWireScrollElementsEvents?(): void
    keyDown?(e?: KeyboardEvent): void
    keyboardModule?: KeyboardEvents
    onCopy?(): void
    onCut?(): void
    onPaste?(): void
    clipboardAction?: Function
    localeObj?: L10n
    invokeChangeEvent?(): void
    addAudioVideoWrapper?(): void
    preventDefaultResize?(e?: FocusEvent | MouseEvent): void
    autoResize?(): void
    executeCommand?(commandName: CommandName, value?: string | HTMLElement | ICodeBlockCommandsArgs): void
    serializeValue?(value: string): string
    sanitizeHtml?(value: string): string
    enableAutoUrl?: boolean
    enableXhtml?: boolean
    enableHtmlSanitizer?: boolean
    getInsertImgMaxWidth?(): string | number
    getInsertVidMaxWidth?(): string | number
    getSelection(): string
    currentTarget: HTMLElement
    focusIn(): void
    showEmojiPicker?(x?: number, y?: number): void
    addAnchorAriaLabel?(value: string): string
    autoSaveOnIdle: boolean
    slashMenuSettings: SlashMenuSettingsModel
    showDialog(type: DialogType): void
    scrollParentElements: HTMLElement[]
}

export interface IQuickToolbar {
    linkQTBar: BaseQuickToolbar;
    textQTBar: BaseQuickToolbar;
    imageQTBar: BaseQuickToolbar;
    audioQTBar: BaseQuickToolbar;
    videoQTBar: BaseQuickToolbar;
    tableQTBar: BaseQuickToolbar;
    inlineQTBar: BaseQuickToolbar;
    debounceTimeout: number;
}

/**
 * Provides information about the current and previous cssClass property .
 */
export interface ICssClassArgs {
    cssClass?: string
    oldCssClass?: string
}

/**
 * @deprecated
 */
export interface IImageNotifyArgs {
    module?: string
    args?: KeyboardEvent | MouseEvent | ClickEventArgs | IToolbarItemModel | ClipboardEvent | TouchEvent
    cancel?: boolean
    requestType?: string
    enable?: boolean
    properties?: object
    selection?: NodeSelection
    selfImage?: Image
    selfAudio?: Audio
    selfVideo?: Video
    link?: HTMLInputElement | HTMLElement
    selectNode?: Node[]
    selectParent?: Node[]
    target?: string
    alt?: HTMLInputElement | HTMLElement
    text?: string
    member?: string
    name?: string
    cssClass?: string
    ariaLabel?: string
}

/**
 * @deprecated
 */
export interface IRenderer {
    renderPanel?(): void
    setPanel?(panel: Element): void
    /**
     * Retrieves the parent element of the content editable div.
     * If the editor is in iframe mode, it returns the `iframe` element.
     * Otherwise, it returns the parent element with the class `e-rte-content`.
     *
     * @returns {Element} - The parent element of the content editable div or the `iframe` element.
     */
    getPanel?(): Element
    /**
     * Retrieves the content editable `div` element of the RichTextEditor.
     * If the editor is in iframe mode, it returns the `body` element of the iframe.
     *
     */
    getEditPanel?(): Element
    getText?(): string
    getDocument?(): Document
    addEventListener?(): void
    removeEventListener?(): void
    renderToolbar?(args: IToolbarOptions): void
    renderDropDownButton?(args: DropDownItemModel): DropDownButton
    renderColorPicker?(args: IColorPickerModel, item?: string, toobarType?: string): ColorPicker
    renderListDropDown?(args: IDropDownModel): DropDownButton
    renderSplitButton?(args: ISplitButtonModel): SplitButton
}

/**
 * @deprecated
 */
export interface IToolbarOptions {
    enableRtl: boolean
    target: HTMLElement
    items?: ItemModel[]
    rteToolbarObj: BaseToolbar
    enablePersistence: boolean
    overflowMode?: OverflowMode
    cssClass?: string
    type?: string
}

/**
 * @deprecated
 */
export interface IToolbarSettings {
    enable?: boolean
    items?: (string | IToolbarItems)[]
    target?: HTMLElement
    type?: ToolbarType
}

/**
 * @deprecated
 */
export interface IToolbarRenderOptions {
    target: HTMLElement
    items?: (string | IToolbarItems)[]
    mode?: OverflowMode
    container?: string
    cssClass?: string
}


/**
 * @deprecated
 */
export interface IUpdateItemsModel {
    targetItem: string
    updateItem: string
    baseToolbar: BaseToolbar
}

/**
 * @deprecated
 */
export interface IDropDownRenderArgs {
    items?: string[]
    containerType?: string
    container?: HTMLElement
}

/**
 * @deprecated
 */
export interface IShowQuickTBarOptions {
    x: number
    y: number
    target: HTMLElement
    editTop: number
    editHeight: number
    popup: HTMLElement
    parentElement: HTMLElement
    tBarElementHeight: number
    parentData: ClientRect
    windowY: number
    windowHeight: number
    windowWidth: number
    popWidth: number
    popHeight: number
    bodyRightSpace: number
}

/**
 * @deprecated
 */
export interface IPositionChanged {
    x: boolean
    y: boolean
}

/**
 * @deprecated
 */
export interface IQuickToolbarOptions {
    popupType: string
    mode: OverflowMode
    renderType: RenderType
    toolbarItems: (string | IToolbarItems)[],
    cssClass: string
}

/**
 * Provides detailed information about the AfterImageDeleteEvent event in the editor.
 */
export interface AfterImageDeleteEventArgs {
    /** Defines the image DOM element that was deleted. */
    element: Node
    /** Defines the 'src' attribute of the deleted image element. */
    src: string
}

/**
 * Provides detailed information about the AfterMediaDeleteEvent event in the editor.
 */
export interface AfterMediaDeleteEventArgs {
    /** Defines the audio/video DOM element that was deleted. */
    element: Node
    /** Defines the 'src' attribute of the deleted audio/video element. */
    src: string
}

/**
 * Provides detailed information about the QuickToolbar event in the editor.
 */
export interface QuickToolbarEventArgs {
    /**
     * Defines the instance of the current popup element
     *
     * @deprecated
     */
    popup?: Popup
    /**
     * Returns the HTMLElement associated with the dialog in the quick toolbar.
     */
    element: HTMLElement
    /**
     * Specify the name identifier of the event within the quick toolbar.
     */
    name?: string
}

/**
 * @deprecated
 */
export interface IAdapterProcess {
    text: string
    range: Range
    actionName: string
}

/**
 * Provides information about a Formatter.
 */
export interface IFormatter {
    /** Configure the format tags, mapping tag names to their respective format. */
    formatTags?: { [key: string]: string }
    /** Configure the list tags, mapping tag names to their respective list format. */
    listTags?: { [key: string]: string }
    /** Configure the key settings with specific shortcut key configurations. */
    keyConfig?: { [key: string]: string }
    process?: Function
    onKeyHandler?: Function
    editorManager?: IEditorModel
    /** Retrieves the undo and redo stack arrays for tracking changes. */
    getUndoRedoStack?: Function
    onSuccess?: Function
    /** Saves the current state for undo and redo actions within the editor. */
    saveData?: Function
    disableToolbarItem?(items: string | string[]): void
    /** Enables the undo functionality to revert changes. */
    enableUndo?: Function
    setDocument?: Function
    getDocument?: Function
    setEditPanel?: Function
    getEditPanel?: Function
    updateFormatter?: Function
    initializePlugin?: Function
    isAppliedCommand?(e?: MouseEvent): string
    mdSelectionFormat?: MDSelectionFormats
    beforeSlashMenuApply(): void
    getCurrentStackIndex(): number
    clearUndoRedoStack(): void
}

/**
 * @deprecated
 */
export interface IFontProperties {
    default?: string
    items?: IDropDownItemModel[]
    width?: string
}

/**
 * @deprecated
 */
export interface IBulletFormatListPropertiesProperties {
    types?: IListDropDownModel[]
}

/**
 * @deprecated
 */
export interface INumberFormatListPropertiesProperties {
    types?: IListDropDownModel[]
}

/**
 * @deprecated
 */
export interface IFormatProperties {
    default?: string
    types?: IDropDownItemModel[]
    width?: string
}

/**
 * @deprecated
 */
export interface ISetToolbarStatusArgs {
    args: IToolbarStatus
    parent: IRichTextEditor
    tbElements: HTMLElement[]
    tbItems: IToolbarItemModel[]
    dropDownModule: DropDownButtons
}

/**
 * Provides detailed information about a change event in the RichTextEditor.
 */
export interface ChangeEventArgs {
    /**
     * Returns the current value/content of the RichTextEditor.
     */
    value: string
    /** Defines the name of the event. */
    name?: string
    /** Specifies if the request should be saved automatically or triggered by user interaction (focus out). */
    isInteracted: boolean
}

/**
 * Provides information regarding a DialogOpen event in the RichTextEditor.
 */
export interface DialogOpenEventArgs {
    /**
     * Defines if the current dialog action can be prevented.
     */
    target: HTMLElement | string
    /**
     * Returns the root container element of the dialog being opened.
     */
    container: HTMLElement
    /**
     * Returns the element reference of the dialog.
     */
    element: Element
    /**
     * Name of the event if specified.
     */
    name?: string
}

/**
 * Provides detailed information about a failed Image upload event in the RichTextEditor.
 */
export interface ImageFailedEventArgs {
    /**
     * Returns the original event arguments.
     */
    e?: object
    /**
     * Details about the file that failed to upload.
     */
    file: FileInfo
    /**
     * Provides status text describing the failed upload.
     */
    statusText?: string
    /**
     * Describes the operation performed during the failed upload attempt.
     */
    operation: string
    /**
     * Returns the response details of the failed upload event.
     */
    response?: ResponseEventArgs
    /**
     * Specifies the event name.
     */
    name?: string
}

/**
 * Provides specific details about a Destroyed event in the RichTextEditor.
 */
export interface DestroyedEventArgs {
    /**
     * Specifies the name of the event.
     */
    name?: string
    /**
     * Determines if the current action of destruction can be prevented.
     */
    cancel: boolean
}

/**
 * Provides information regarding content pasted in the RichTextEditor for cleanup operations.
 */
export interface PasteCleanupArgs {
    /**
     * Returns the content data present in the ClipboardEvent arguments.
     */
    value: string;
    /**
     * Returns a list of image file data that was pasted into the editor.
     */
    filesData: FileInfo[]
}

/**
 * Provides specific information about a Blur event in the RichTextEditor.
 */
export interface BlurEventArgs {
    /**
     * Contains the original event arguments related to the blur event.
     */
    event: Event
    /**
     * Indicates if the blur event was caused by user interaction.
     */
    isInteracted: boolean
    /**
     * Specifies the name of the blur event.
     */
    name?: string
}

/**
 * Provides details about a Focus event in the RichTextEditor.
 */
export interface FocusEventArgs {
    /**
     * Contains the original event arguments associated with the focus event.
     */
    event: FocusEvent
    /**
     * Indicates if the focus event was triggered by user interaction.
     */
    isInteracted: boolean
    /**
     * Specifies the name of the focus event.
     */
    name?: string
}


/**
 * @deprecated
 */
export interface IColorProperties {
    default?: string
    mode?: ColorModeType
    columns?: number
    colorCode?: { [key: string]: string[] }
    modeSwitcher?: boolean
    showRecentColors? : boolean
}


/**
 * @hidden
 * @deprecated
 */
export const executeGroup: { [key: string]: IExecutionGroup } = {
    'bold': {
        command: 'Style',
        subCommand: 'Bold',
        value: 'strong'
    },
    'italic': {
        command: 'Style',
        subCommand: 'Italic',
        value: 'em'
    },
    'underline': {
        command: 'Style',
        subCommand: 'Underline',
        value: 'span'
    },
    'strikeThrough': {
        command: 'Style',
        subCommand: 'StrikeThrough',
        value: 'span'
    },
    'insertCode': {
        command: 'Formats',
        subCommand: 'Pre',
        value: 'pre'
    },
    'superscript': {
        command: 'Effects',
        subCommand: 'SuperScript',
        value: 'sup'
    },
    'subscript': {
        command: 'Effects',
        subCommand: 'SubScript',
        value: 'sub'
    },
    'uppercase': {
        command: 'Casing',
        subCommand: 'UpperCase'
    },
    'lowercase': {
        command: 'Casing',
        subCommand: 'LowerCase'
    },
    'fontColor': {
        command: 'font',
        subCommand: 'fontcolor',
        value: '#ff0000'
    },
    'fontName': {
        command: 'font',
        subCommand: 'fontname',
        value: 'Segoe UI'
    },
    'fontSize': {
        command: 'font',
        subCommand: 'fontsize',
        value: '10pt'
    },
    'backColor': {
        command: 'font',
        subCommand: 'backgroundcolor',
        value: '#ffff00'
    },
    'justifyCenter': {
        command: 'Alignments',
        subCommand: 'JustifyCenter'
    },
    'justifyFull': {
        command: 'Alignments',
        subCommand: 'JustifyFull'
    },
    'justifyLeft': {
        command: 'Alignments',
        subCommand: 'JustifyLeft'
    },
    'justifyRight': {
        command: 'Alignments',
        subCommand: 'JustifyRight'
    },
    'undo': {
        command: 'Actions',
        subCommand: 'Undo'
    },
    'redo': {
        command: 'Actions',
        subCommand: 'Redo'
    },
    'createLink': {
        command: 'Links',
        subCommand: 'createLink'
    },
    'editLink': {
        command: 'Links',
        subCommand: 'createLink'
    },
    'createImage': {
        command: 'Images',
        subCommand: 'Images'
    },
    'formatBlock': {
        command: 'Formats',
        value: 'P'
    },
    'heading': {
        command: 'Formats',
        value: 'H1'
    },
    'indent': {
        command: 'Indents',
        subCommand: 'Indent'
    },
    'outdent': {
        command: 'Indents',
        subCommand: 'Outdent'
    },
    'insertHTML': {
        command: 'InsertHTML',
        subCommand: 'InsertHTML',
        value: ''
    },
    'insertText': {
        command: 'InsertText',
        subCommand: 'InsertText',
        value: ''
    },
    'insertHorizontalRule': {
        command: 'InsertHTML',
        subCommand: 'InsertHTML',
        value: '<hr/>'
    },
    'insertImage': {
        command: 'Images',
        subCommand: 'Image'
    },
    'insertAudio': {
        command: 'Audios',
        subCommand: 'Audio'
    },
    'insertVideo': {
        command: 'Videos',
        subCommand: 'Video'
    },
    'editImage': {
        command: 'Images',
        subCommand: 'Image'
    },
    'insertTable': {
        command: 'Table',
        subCommand: 'CreateTable'
    },
    'insertBrOnReturn': {
        command: 'InsertHTML',
        subCommand: 'InsertHTML',
        value: '<br/>'
    },
    'insertOrderedList': {
        command: 'Lists',
        value: 'OL'
    },
    'insertUnorderedList': {
        command: 'Lists',
        value: 'UL'
    },
    'insertParagraph': {
        command: 'Formats',
        value: 'P'
    },
    'removeFormat': {
        command: 'Clear',
        subCommand: 'ClearFormat'
    },
    'copyFormatPainter': {
        command: 'FormatPainter',
        value: 'format-copy'
    },
    'applyFormatPainter': {
        command: 'FormatPainter',
        value: 'format-paste'
    },
    'escapeFormatPainter': {
        command: 'FormatPainter',
        value: 'escape'
    },
    'InlineCode': {
        command: 'Style',
        subCommand: 'inlinecode',
        value: 'inlinecode'
    },
    'insertCodeBlock': {
        command: 'CodeBlock',
        subCommand: 'CodeBlock'
    }
};

/**
 * Provides detailed information about the updatedToolbarStatus event in the Rich Text Editor.
 */
export interface ToolbarStatusEventArgs {
    /** Defines the name of the event. */
    name?: string
    /** Defines the undo state argument, indicating whether an undo action can be performed. */
    undo: boolean
    /** Defines the redo state argument, indicating whether a redo action can be performed. */
    redo: boolean
    /** Defines the HTML toolbar status arguments, providing the current status of the HTML toolbar. */
    html?: object
    /** Defines the markdown toolbar status arguments, providing the current status of the Markdown toolbar. */
    markdown?: object
}

/**
 * @hidden
 * @private
 */
export interface IBaseQuickToolbar {
    /**
     * Instance of the Quick Toolabr Popup.
     */
    popupObj: Popup;
    /**
     * Parent Element of the Quick Toolbar.
     */
    element: HTMLElement;
    /**
     * Boolean to check whether the quick toolbar is rendered in the DOM.
     */
    isRendered: boolean;
    /**
     * Instance of the Toolbar rendered inside the Popup.
     */
    quickTBarObj: BaseToolbar;
    /**
     * Element of the Toolbar rendered inside the Popup.
     */
    toolbarElement: HTMLElement;
}

/**
 * Provides detailed information about a SlashMenuItemSelect event.
 */
export interface SlashMenuItemSelectArgs {
    /**
     * If the event is triggered by user interaction, it returns true. Otherwise, it returns false.
     */
    isInteracted: boolean;
    /**
     * Returns the selected list item of the slash menu list as an HTMLLIElement.
     */
    item: HTMLLIElement;
    /**
     * Returns the selected slash menu item data corresponding to the interface.
     */
    itemData: ISlashMenuItem;
    /**
     * Specifies the original event arguments such as MouseEvent, KeyboardEvent, or TouchEvent.
     */
    originalEvent: MouseEvent | KeyboardEvent | TouchEvent;
    /**
     * Specifies the boolean value to cancel the default action if set to true.
     */
    cancel?: boolean;
}
