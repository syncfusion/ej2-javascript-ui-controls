import { Component, Observer, L10n, KeyboardEventArgs, EmitType } from '@syncfusion/ej2-base';
import { ItemModel, OverflowMode } from '@syncfusion/ej2-navigations';
import { ItemModel as DropDownItemModel, DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { ToolbarType, RenderType, ImageInputSource, DialogType } from './enum';
import { Toolbar } from '../actions/toolbar';
import { UndoRedoManager } from '../../editor-manager/plugin/undo';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { BaseToolbar } from '../actions/base-toolbar';
import { BaseQuickToolbar } from '../actions/base-quick-toolbar';
import { NodeSelection } from '../../selection/selection';
import { EditorMode, EnterKey, ShiftEnterKey } from './../../common/types';
import { MarkdownSelection } from './../../markdown-parser/plugin/markdown-selection';
import { ToolbarSettingsModel, IFrameSettingsModel, ImageSettingsModel, AudioSettingsModel, VideoSettingsModel, TableSettingsModel, FormatPainterSettingsModel, EmojiSettingsModel, ImportWordModel, ExportWordModel, ExportPdfModel } from '../models/models';
import { QuickToolbarSettingsModel, InlineModeModel, PasteCleanupSettingsModel, FileManagerSettingsModel } from '../models/models';
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
import { IToolbarStatus } from '../../common/interface';
import { KeyboardEvents } from '../actions/keyboard';
import { ViewSource } from '../renderer/view-source';
import { PasteCleanup } from '../actions/paste-clean-up';
import { Popup } from '@syncfusion/ej2-popups';
import { Resize } from '../actions/resize';
import { FileManager } from '../actions/file-manager';
import { NodeCutter, DOMNode, IFormatPainterEditor } from '../../editor-manager';
import { EnterKeyAction } from '../actions/enter-key';
import { EmojiPicker } from '../actions/emoji-picker';
import { SlashMenuSettingsModel } from '../models/slash-menu-settings-model';
import { CustomUserAgentData } from '../../common/user-agent';
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
     * height: '200px', saveUrl:null, path: null, resize: false
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
     * height: '200px', saveUrl:null, path: null, resize: false
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

    emojiPickerSettings : EmojiSettingsModel

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
    executeCommand?(commandName: CommandName, value?: string | HTMLElement): void
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
}
/**
 * @deprecated
 */
export interface IRenderer {
    linkQTBar?: BaseQuickToolbar
    imageQTBar?: BaseQuickToolbar
    audioQTBar?: BaseQuickToolbar
    videoQTBar?: BaseQuickToolbar
    tableQTBar?: BaseQuickToolbar
    textQTBar?: BaseQuickToolbar
    inlineQTBar?: BaseQuickToolbar
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
    renderPopup?(args: BaseQuickToolbar): void
    renderDropDownButton?(args: DropDownItemModel): DropDownButton
    renderColorPicker?(args: IColorPickerModel, item?: string, toobarType?: string): ColorPicker
    renderColorPickerDropDown?(args?: IColorPickerModel, item?: string, colorPicker?: ColorPicker, defaultColor?: string,
        toobarType?: string): DropDownButton
    renderListDropDown?(args: IDropDownModel): DropDownButton
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
    selfLink?: Link
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
    emojiPickerSettings?: EmojiSettingsModel
    ariaLabel?: string
    /**
     * Defines the source of the Table content.
     *
     * @private
     */
    pasteTableSource?: string
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
 * Provides information about a TouchData.
 */
export interface ITouchData {
    prevClientX?: number
    prevClientY?: number
    clientX?: number
    clientY?: number
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
 * @hidden
 * @deprecated
 */
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
 * @hidden
 * @deprecated
 */
export interface IDropDownItem extends ItemModel {
    command?: string
    subCommand?: string
    controlParent?: DropDownButton
    listImage?: string
    value?: string
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
export interface IColorPickerRenderArgs {
    items?: string[]
    containerType?: string
    container?: HTMLElement
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
 * @deprecated
 */
export interface ImageDragEvent extends DragEvent {
    rangeParent?: Element
    rangeOffset?: number
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
 * @deprecated
 */
export interface IFormatPainterArgs {
    /**
     * Defines the action to be performed.
     * Allowed values are 'format-copy', 'format-paste', 'escape'.
     */
    formatPainterAction: string
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
    self?: Table
}

/**
 * Provides information about a EditorModel.
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
    destroy?(): void
    beforeSlashMenuApplyFormat?(): void
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
 * @hidden
 * @deprecated
 */
export interface IToolbarItemModel extends ItemModel {
    command?: string
    subCommand?: string
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
export interface IToolsItems {
    id: string
    icon?: string
    tooltip?: string
    command?: string
    subCommand?: string
    value?: string
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

export interface IEmojiPickerArgs{
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
export interface IShowPopupArgs {
    args?: MouseEvent | TouchEvent | KeyboardEvent
    type?: string
    isNotify: boolean
    elements?: Element | Element[]
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
 * Provides detailed information about the beforeQuickToolbarOpen event in the editor.
 */
export interface BeforeQuickToolbarOpenArgs {
    /**
     * Defines the instance of the current popup element
     *
     * @deprecated
     */
    popup?: Popup
    /** Determine whether the quick toolbar should be prevented from opening. */
    cancel?: boolean
    /** Defines the target element on which the quick toolbar is triggered. */
    targetElement?: Element
    /** Defines the X-coordinate position where the quick toolbar will appear. */
    positionX?: number
    /** Defines the Y-coordinate position where the quick toolbar will appear. */
    positionY?: number
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
 * Provides information about a ExecuteCommandOption.
 */
export interface ExecuteCommandOption {
    undo ?: boolean
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
 * Defines types to be used as colorMode for color selection in the RichTextEditor.
 */
export declare type ColorModeType = 'Picker' | 'Palette';

/**
 * @deprecated
 */
export interface IColorProperties {
    default?: string
    mode?: ColorModeType
    columns?: number
    colorCode?: { [key: string]: string[] }
    modeSwitcher?: boolean
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
    'copyFormatPainter' : {
        command: 'FormatPainter',
        value: 'format-copy'
    },
    'applyFormatPainter' : {
        command: 'FormatPainter',
        value: 'format-paste'
    },
    'escapeFormatPainter' : {
        command: 'FormatPainter',
        value: 'escape'
    },
    'InlineCode': {
        command: 'Style',
        subCommand: 'inlinecode',
        value: 'inlinecode'
    }
};

/**
 * Defines types to be used as CommandName.
 *
 * The `CommandName` type encompasses various commands that can be applied within the rich text editor.
 * Each command represents a specific formatting or editing action, such as applying text styles,
 * inserting multimedia content, and handling text alignment or structure.
 *
 */
export declare type CommandName = 'bold' | 'italic' | 'underline' | 'strikeThrough' | 'superscript' |
'subscript' | 'uppercase' | 'lowercase' | 'fontColor' | 'fontName' | 'fontSize' | 'backColor' |
'justifyCenter' | 'justifyFull' | 'justifyLeft' | 'justifyRight' | 'undo' | 'createLink' |
'formatBlock' | 'heading' | 'indent' | 'insertHTML' | 'insertOrderedList' | 'insertUnorderedList' |
'insertParagraph' | 'outdent' | 'redo' | 'removeFormat' | 'insertText' | 'insertImage' | 'insertAudio' | 'insertVideo' |
'insertHorizontalRule' | 'insertBrOnReturn' | 'insertCode' | 'insertTable' | 'editImage' | 'editLink' | 'applyFormatPainter'|
'copyFormatPainter' | 'escapeFormatPainter' | 'emojiPicker' | 'InlineCode' | 'importWord';

/**
 * @hidden
 * @deprecated
 */
export interface StatusArgs {
    html: Object
    markdown: Object
}

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
 * @deprecated
 */
export interface CleanupResizeElemArgs {
    name?: string,
    value: string,
    callBack (value: string): void
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
