import { Component, Observer, L10n, KeyboardEventArgs, EmitType } from '@syncfusion/ej2-base';
import { ItemModel, OverflowMode } from '@syncfusion/ej2-navigations';
import { ItemModel as DropDownItemModel, DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { ToolbarType, RenderType } from './enum';
import { Toolbar } from '../actions/toolbar';
import { UndoRedoManager } from '../../editor-manager/plugin/undo';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { BaseToolbar } from '../actions/base-toolbar';
import { BaseQuickToolbar } from '../actions/base-quick-toolbar';
import { NodeSelection } from '../../selection/selection';
import { EditorMode, EnterKey, ShiftEnterKey } from './../../common/types';
import { MarkdownSelection } from './../../markdown-parser/plugin/markdown-selection';
import { ToolbarSettingsModel, IFrameSettingsModel, ImageSettingsModel, TableSettingsModel } from '../models/models';
import { QuickToolbarSettingsModel, InlineModeModel, PasteCleanupSettingsModel, FileManagerSettingsModel } from '../models/models';
import { Count } from '../actions/count';
import { ColorPicker, ColorPickerEventArgs, ColorPickerModel, FileInfo } from '@syncfusion/ej2-inputs';
import { Link } from '../renderer/link-module';
import { Image } from '../renderer/image-module';
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
import { NodeCutter, DOMNode } from '../../editor-manager';
import { EnterKeyAction } from '../actions/enter-key';
/**
 * Specifies Rich Text Editor interfaces.
 *
 * @hidden
 * @deprecated
 */
export interface IRichTextEditor extends Component<HTMLElement> {
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
    fileManagerSettings: FileManagerSettingsModel

    tableSettings: TableSettingsModel

    pasteCleanupSettings: PasteCleanupSettingsModel

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
    pasteCleanupModule?: PasteCleanup
    undoRedoModule?: UndoRedoManager
    quickToolbarModule?: QuickToolbar
    undoRedoSteps?: number
    markdownEditorModule: MarkdownEditor
    htmlEditorModule: HtmlEditor
    countModule?: Count
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
    updateValueData?(): void
    getBaseToolbarObject(): BaseToolbar
    setContentHeight(target?: string, isExpand?: boolean): void
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
    preventDefaultResize?(e?: FocusEvent | MouseEvent): void
    autoResize?(): void
    executeCommand?(commandName: CommandName, value?: string | HTMLElement): void
    serializeValue?(value: string): string
    sanitizeHtml?(value: string): string
    enableAutoUrl?: boolean
    enableXhtml?: boolean
    enableHtmlSanitizer?: boolean
    getInsertImgMaxWidth?(): string | number
    getSelection(): string
}
/**
 * @deprecated
 */
export interface IRenderer {
    linkQTBar?: BaseQuickToolbar
    imageQTBar?: BaseQuickToolbar
    tableQTBar?: BaseQuickToolbar
    textQTBar?: BaseQuickToolbar
    inlineQTBar?: BaseQuickToolbar
    renderPanel?(): void
    setPanel?(panel: Element): void
    getPanel?(): Element
    getEditPanel?(): Element
    getText?(): string
    getDocument?(): Document
    addEventListener?(): void
    removeEventListener?(): void
    renderToolbar?(args: IToolbarOptions): void
    renderPopup?(args: BaseQuickToolbar): void
    renderDropDownButton?(args: DropDownItemModel): DropDownButton
    renderColorPicker?(args: IColorPickerModel, item?: string): ColorPicker
    renderColorPickerDropDown?(args?: IColorPickerModel, item?: string, colorPicker?: ColorPicker, defaultColor?: string): DropDownButton
    renderListDropDown?(args: IDropDownModel): DropDownButton
}

/**
 * Provides information about a Notify.
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
    /** Defines the notifier name. */
    name?: string
    /** Defines the selection range. */
    range?: Range
    /** Defines the action. */
    action?: string
    callBack?(args?: string | IImageCommandsArgs): void
    file?: Blob
    insertElement?: Element
    touchData?: ITouchData
    allowedStylePropertiesArray?: string[]
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
export interface IColorPickerModel extends ColorPickerModel {
    element?: HTMLElement
    value?: string
    command?: string
    subCommand?: string
    target?: string
    iconCss?: string
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
    link?: HTMLInputElement | HTMLElement
    selectNode?: Node[]
    selectParent?: Node[]
    target?: string
    alt?: HTMLInputElement | HTMLElement
    text?: string
    member?: string
    name?: string
    cssClass?: string
}

/**
 * Provides information about a Image added in the Rich Text Editor.
 */
export interface IImageCommandsArgs {
    /** Defines the src attribute of the image */
    url?: string
    /** Defines the instance of the current selection */
    selection?: NodeSelection
    /** Defines the minWidth, maxWidth and width of the image */
    width?: { minWidth?: string | number; maxWidth?: string | number; width?: string | number }
    /** Defines the minHeight, maxHeight and height of the image */
    height?: { minHeight?: string | number; maxHeight?: string | number; height?: string | number }
    /** Defines the alternate text attribute of the image */
    altText?: string
    /** Defines the class name to be added to the image */
    cssClass?: string
    /** Defines the image element to be edited */
    selectParent?: Node[]
}

/**
 * @deprecated
 */
export interface ImageDragEvent extends DragEvent {
    rangeParent?: Element
    rangeOffset?: number
}

/**
 * Provides information about imageDrop event.
 */
export interface ImageDropEventArgs extends DragEvent {
    /** Defines the prevent action. */
    cancel: boolean
    /** Defines the parent of drop range. */
    rangeParent?: Element
    /** Defines the offset value of drop range. */
    rangeOffset?: number
}

/**
 * Provides information about a Link added to the Rich Text Editor.
 */
export interface ILinkCommandsArgs {
    /** Defines the url attribute of the link */
    url?: string
    /** Defines the instance of the current selection */
    selection?: NodeSelection
    /** Defines the title of the link to be inserted */
    title?: string
    /** Defines the text of the link to be inserted */
    text?: string
    /** Defines the target attribute of the link */
    target?: string
    /** Defines the link element to be edited */
    selectParent?: Node[]
}

/**
 * Provides information about a Table added to the Rich Text Editor.
 */
export interface ITableCommandsArgs {
    /**
     * @deprecated
     * This argument deprecated. Use `rows` argument.
     */
    row?: number
    /** Defines the number of rows to be inserted in the table */
    rows?: number
    /** Defines the number of columns to be inserted in the table */
    columns?: number
    /** Defines the minWidth, maxWidth and width of the table */
    width?: { minWidth?: string | number; maxWidth?: string | number; width?: string | number }
    /** Defines the instance of the current selection */
    selection?: NodeSelection
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
    args?: ClickEventArgs | MouseEvent | KeyboardEventArgs
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
    execCommand?: Function
    observer?: Observer
    markdownSelection?: MarkdownSelection
    undoRedoManager?: UndoRedoManager | UndoRedoCommands
    nodeSelection?: NodeSelection
    mdSelectionFormats?: MDSelectionFormats
    domNode?: DOMNode
    nodeCutter?: NodeCutter
}

/**
 * Provides information about a ToolbarItems.
 */
export interface IToolbarItems {
    template?: string
    tooltipText?: string
    command?: string
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
 * Provides information about a ActionComplete event.
 */
export interface ActionCompleteEventArgs {
    /** Defines the current action. */
    requestType?: string
    /** Defines the event name. */
    name?: string
    /** Defines the editor mode. */
    editorMode?: string
    /**
     * Defines the selected elements.
     *
     * @deprecated
     */
    elements?: Node[]
    /** Defines the event item. */
    event?: MouseEvent | KeyboardEvent
    /**
     * Defines the selected range.
     *
     * @deprecated
     */
    range?: Range
}

/**
 * Provides information about a ActionBegin event.
 */
export interface ActionBeginEventArgs {
    /** Defines the current action. */
    requestType?: string
    /** Cancel the print action */
    cancel?: boolean
    /**
     * Defines the current item.
     *
     * @deprecated
     */
    item?: IToolbarItemModel | IDropDownItemModel
    /** Defines the current item. */
    originalEvent?: MouseEvent | KeyboardEvent
    /** Defines the event name. */
    name?: string
    /** Defines the selection type is dropdown. */
    selectType?: string
    /**
     * Defines the url action details.
     *
     * @deprecated
     */
    itemCollection?: IItemCollectionArgs
}

/**
 * Provides information about a Print event.
 */
export interface PrintEventArgs extends ActionBeginEventArgs {
    /** Defines the RTE element. */
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
export interface IQuickToolbarOptions {
    popupType: string
    mode: OverflowMode
    renderType: RenderType
    toolbarItems: (string | IToolbarItems)[],
    cssClass: string
}

/**
 * Provides information about a BeforeQuickToolbarOpen event.
 */
export interface BeforeQuickToolbarOpenArgs {
    /**
     * Defines the instance of the current popup element
     *
     * @deprecated
     */
    popup?: Popup
    /** Determine whether the quick toolbar is open */
    cancel: boolean
    /** Defines the target element of the quick toolbar */
    targetElement: Element
}

/**
 * Provides information about a AfterImageDeleteEvent event.
 */
export interface AfterImageDeleteEventArgs {
    /** Defined the image element deleted */
    element: Node
    /** Defines the src attribute of the image element deleted */
    src: string
}

/**
 * Provides information about a QuickToolbar event.
 */
export interface QuickToolbarEventArgs {
    /**
     * Defines the instance of the current popup element
     *
     * @deprecated
     */
    popup?: Popup
    /**
     * Returns the element of the dialog.
     */
    element: HTMLElement
    /**
     * Specify the name of the event.
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
    /** Configure the format tags. */
    formatTags?: { [key: string]: string }
    /** Configure the list tags. */
    listTags?: { [key: string]: string }
    /** Configure the key settings. */
    keyConfig?: { [key: string]: string }
    process?: Function
    onKeyHandler?: Function
    editorManager?: IEditorModel
    getUndoRedoStack?: Function
    onSuccess?: Function
    saveData?: Function
    disableToolbarItem?(items: string | string[]): void
    enableUndo?: Function
    setDocument?: Function
    getDocument?: Function
    setEditPanel?: Function
    getEditPanel?: Function
    updateFormatter?: Function
    initializePlugin?: Function
    isAppliedCommand?(e?: MouseEvent): string
    mdSelectionFormat?: MDSelectionFormats
}
/**
 * @deprecated
 */
export interface IHtmlFormatterModel {
    currentDocument?: Document
    element?: Element
    keyConfig?: { [key: string]: string }
    options?: { [key: string]: number }
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
    /** Defines the resize event args. */
    event?: MouseEvent | TouchEvent
    /** Defines the request type. */
    requestType?: string
    /** Defines the prevent action. */
    cancel?: boolean
}

/**
 * Provides information about a BeforeSanitizeHtml event.
 */
export interface BeforeSanitizeHtmlArgs {
    /** Illustrates whether the current action needs to be prevented or not. */
    cancel?: boolean
    /** It is a callback function and executed it before our inbuilt action. It should return HTML as a string
     *
     * @function
     * @param {string} value - Returns the value.
     * @returns {string}
     */
    helper?: Function
    /** Returns the selectors object which carrying both tags and attributes selectors to block list of cross-site scripting attack.
     * Also possible to modify the block list in this event.
     */
    selectors?: SanitizeSelectors
}

/**
 * Provides information about a SanitizeSelectors.
 */
export interface SanitizeSelectors {
    /** Returns the tags. */
    tags?: string[]
    /** Returns the attributes. */
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
    /** Defines the attribute name to sanitize */
    attribute?: string
    /** Defines the selector that sanitize the specified attributes within the selector */
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
 * Provides information about a Change event.
 */
export interface ChangeEventArgs {
    /**
     * Returns value of RichTextEditor
     */
    value: string
    /** Defines the event name. */
    name?: string
}

/**
 * Provides information about a DialogOpen event.
 */
export interface DialogOpenEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    target: HTMLElement | string
    /**
     * Returns the root container element of the dialog.
     */
    container: HTMLElement
    /**
     * Returns the element of the dialog.
     */
    element: Element
    /**
     * Specify the name of the event.
     */
    name?: string
}

/**
 * Provides information about a DialogClose event.
 */
export interface DialogCloseEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean
    /**
     * Returns the root container element of the dialog.
     */
    container: HTMLElement
    /**
     * Returns the element of the dialog.
     */
    element: Element
    /**
     * Returns the original event arguments.
     */
    event: Event
    /**
     * Determines whether the event is triggered by interaction.
     */
    isInteracted: boolean
    /**
     * DEPRECATED-Determines whether the event is triggered by interaction.
     */
    isInteraction: boolean
    /**
     * Specify the name of the event.
     */
    /* eslint-disable */
    name?: String
    /* eslint-enable */
    /**
     * Defines whether the current action can be prevented.
     */
    /* eslint-disable */
    target: HTMLElement | String
    /* eslint-enable */
}

/**
 * Provides information about a ImageSuccess event.
 */
export interface ImageSuccessEventArgs {
    /**
     * Returns the original event arguments.
     */
    e?: object
    /**
     * Returns the details about upload file.
     *
     * @blazorType Syncfusion.EJ2.Blazor.Inputs.FileInfo
     */
    file: FileInfo
    /**
     * Returns the upload status.
     */
    statusText?: string
    /**
     * Returns the upload event operation.
     */
    operation: string
    /**
     * Returns the upload event operation.
     *
     * @blazorType ResponseEventArgs
     */
    response?: ResponseEventArgs
    /**
     * Specify the name of the event.
     */
    name?: string
    /**
     * Specify the name of the event.
     */
    element?: HTMLElement
}

/**
 * Provides information about a ImageFailed event.
 */
export interface ImageFailedEventArgs {
    /**
     * Returns the original event arguments.
     */
    e?: object
    /**
     * Returns the details about upload file.
     *
     * @blazorType Syncfusion.EJ2.Blazor.Inputs.FileInfo
     */
    file: FileInfo
    /**
     * Returns the upload status.
     */
    statusText?: string
    /**
     * Returns the upload event operation.
     */
    operation: string
    /**
     * Returns the upload event operation.
     *
     * @blazorType ResponseEventArgs
     */
    response?: ResponseEventArgs
    /**
     * Specify the name of the event.
     */
    name?: string
}

/**
 * Provides information about a ImageResponse event.
 */
export interface ResponseEventArgs {
    /**
     * Returns the headers information of the upload image.
     */
    headers?: string
    /**
     * Returns the readyState information.
     */
    readyState?: object
    /**
     * Returns the upload image statusCode.
     */
    statusCode?: object
    /**
     * Returns the upload image statusText.
     */
    statusText?: string
    /**
     * Returns the credentials status of the upload image.
     */
    withCredentials?: boolean
}

/**
 * Provides information about a Destroyed event.
 */
export interface DestroyedEventArgs {
    /**
     * Specify the name of the event.
     */
    name?: string
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean
}

/**
 * Provides information about a pasteCleanup args.
 */
export interface PasteCleanupArgs {
    /**
     * Returns the content in the ClipboardEvent arguments.
     */
    value: string;
}

/**
 * Provides information about a Blur event.
 */
export interface BlurEventArgs {
    /**
     * Returns the original event arguments.
     */
    event: Event
    /**
     * Determines whether the event is triggered by interaction.
     */
    isInteracted: boolean
    /**
     * Specify the name of the event.
     */
    name?: string
}

/**
 * Provides information about a ToolbarClick event.
 */
export interface ToolbarClickEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean
    /**
     * Defines the current Toolbar Item Object.
     *
     * @blazorType Syncfusion.EJ2.Blazor.Navigations.ItemModel
     */
    item: ItemModel
    /**
     * Defines the current Event arguments
     */
    originalEvent: MouseEvent
    /**
     * Specify the request type of the event.
     */
    requestType: string
    /**
     * Specify the name of the event.
     */
    name?: string
}

/**
 * Provides information about a Focus event.
 */
export interface FocusEventArgs {
    /**
     * Returns the original event arguments.
     */
    event: FocusEvent
    /**
     * Determines whether the event is triggered by interaction.
     */
    isInteracted: boolean
    /**
     * Specify the name of the event.
     */
    name?: string
}

/**
 * Defines types to be used as ColorMode.
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
 * Provides information about a image uploading event.
 */
export interface ImageUploadingEventArgs {
    /**
     * Defines whether the current action can be prevented.
     */
    cancel: boolean
    /**
     * Defines the additional data in key and value pair format that will be submitted to the upload action.
     *
     * @blazorType object
     */
    customFormData: { [key: string]: Object; }[];
    /**
     * Returns the XMLHttpRequest instance that is associated with upload action.
     *
     * @blazorType object
     */
    currentRequest?: { [key: string]: string }[]
    /**
     * Returns the list of files that will be uploaded.
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
    }
};

/**
 * Defines types to be used as CommandName.
 */
export declare type CommandName = 'bold' | 'italic' | 'underline' | 'strikeThrough' | 'superscript' |
'subscript' | 'uppercase' | 'lowercase' | 'fontColor' | 'fontName' | 'fontSize' | 'backColor' |
'justifyCenter' | 'justifyFull' | 'justifyLeft' | 'justifyRight' | 'undo' | 'createLink' |
'formatBlock' | 'heading' | 'indent' | 'insertHTML' | 'insertOrderedList' | 'insertUnorderedList' |
'insertParagraph' | 'outdent' | 'redo' | 'removeFormat' | 'insertText' | 'insertImage' |
'insertHorizontalRule' | 'insertBrOnReturn' | 'insertCode' | 'insertTable' | 'editImage' | 'editLink';

/**
 * @hidden
 * @deprecated
 */
export interface StatusArgs {
    html: Object
    markdown: Object
}

/**
 * Provides information about a updatedToolbarStatus event.
 */
export interface ToolbarStatusEventArgs {
    /** Defines the event name. */
    name?: string
    /** Defines the redo argument. */
    undo: boolean
    /** Defines the redo argument. */
    redo: boolean
    /** Defines the HTML toolbar status arguments. */
    html?: object
    /** Defines the markdown toolbar status arguments. */
    markdown?: object
}
