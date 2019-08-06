// tslint:disable-next-line:missing-jsdoc
import { Component, Observer, L10n, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { ItemModel, OverflowMode } from '@syncfusion/ej2-navigations';
import { ItemModel as DropDownItemModel, DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { ToolbarType, RenderType } from './enum';
import { Toolbar } from '../actions/toolbar';
import { UndoRedoManager } from '../../editor-manager/plugin/undo';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { BaseToolbar } from '../actions/base-toolbar';
import { BaseQuickToolbar } from '../actions/base-quick-toolbar';
import { NodeSelection } from '../../selection/selection';
import { EditorMode } from './../../common/types';
import { MarkdownSelection } from './../../markdown-parser/plugin/markdown-selection';
import { ToolbarSettingsModel, IFrameSettingsModel, ImageSettingsModel, TableSettingsModel } from '../models/models';
import { QuickToolbarSettingsModel, InlineModeModel, PasteCleanupSettingsModel } from '../models/models';
import { Count } from '../actions/count';
import { ColorPicker, ColorPickerEventArgs, ColorPickerModel } from '@syncfusion/ej2-inputs';
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
/**
 * Specifies RichTextEditor interfaces.
 * @hidden
 */
export interface IRichTextEditor extends Component<HTMLElement> {
    toolbarSettings?: ToolbarSettingsModel;

    quickToolbarSettings?: QuickToolbarSettingsModel;

    iframeSettings?: IFrameSettingsModel;

    /**
     * Configures the image settings of the RTE.
     * @default
     * {
     *  allowedTypes: ['jpeg', 'jpg', 'png'],
     * display: 'inline', width: '200px',
     * height: '200px', saveUrl:null, path: null, resize: false
     * }
     */
    insertImageSettings: ImageSettingsModel;

    tableSettings: TableSettingsModel;

    pasteCleanupSettings: PasteCleanupSettingsModel;

    floatingToolbarOffset?: number;

    showCharCount?: boolean;
    enableTabKey?: boolean;

    maxLength?: number;

    inlineMode?: InlineModeModel;

    width?: string | number;

    fontFamily?: IFontProperties;

    fontSize?: IFontProperties;

    fontColor?: IColorProperties;

    backgroundColor?: IColorProperties;

    format?: IFormatProperties;

    value?: string;

    isBlur?: boolean;
    isRTE?: boolean;
    contentModule?: IRenderer;
    enabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    valueContainer?: HTMLTextAreaElement;
    editorMode?: EditorMode;
    enableHtmlEncode?: boolean;
    formatter?: IFormatter;
    inputElement?: HTMLElement;
    toolbarModule?: Toolbar;
    tableModule?: Table;
    sourceCodeModule?: ViewSource;
    getToolbarElement?(): Element;
    fullScreenModule?: FullScreen;
    pasteCleanupModule?: PasteCleanup;
    undoRedoModule?: UndoRedoManager;
    quickToolbarModule?: QuickToolbar;
    undoRedoSteps?: number;
    markdownEditorModule: MarkdownEditor;
    htmlEditorModule: HtmlEditor;
    countModule?: Count;
    serviceLocator?: ServiceLocator;
    setEnable?(): void;
    setReadOnly?(isInit?: boolean): void;
    setPlaceHolder?(): void;
    updateValue?(): void;
    print(): void;
    getContent?(): Element;
    setRTEContent?(value: Element): void;
    ensureModuleInjected(module: Function): Boolean;
    getToolbar(): HTMLElement;
    getTBarItemsIndex?(items: string[]): number[];
    getCollection?(items: string | string[]): string[];
    getRange(): Range;
    getID(): string;
    updateValueData?(): void;
    getBaseToolbarObject(): BaseToolbar;
    setContentHeight(target?: string, isExpand?: boolean): void;
    keyConfig?: { [key: string]: string };
    undoRedoTimer?: number;
    sourceCode?(): void;
    enableToolbarItem?(items: string | string[]): void;
    disableToolbarItem?(items: string | string[]): void;
    wireScrollElementsEvents?(): void;
    unWireScrollElementsEvents?(): void;
    keyDown?(e?: KeyboardEvent): void;
    keyboardModule?: KeyboardEvents;
    onCopy?(): void;
    onCut?(): void;
    onPaste?(): void;
    clipboardAction?: Function;
    localeObj?: L10n;
    invokeChangeEvent?(): void;
    preventDefaultResize?(e?: FocusEvent | MouseEvent): void;
    autoResize?(): void;
    executeCommand?(commandName: CommandName, value?: string | HTMLElement): void;
    serializeValue?(value: string): string;
    sanitizeHtml?(value: string): string;
}
export interface IRenderer {
    linkQTBar?: BaseQuickToolbar;
    imageQTBar?: BaseQuickToolbar;
    tableQTBar?: BaseQuickToolbar;
    textQTBar?: BaseQuickToolbar;
    inlineQTBar?: BaseQuickToolbar;
    renderPanel?(): void;
    setPanel?(panel: Element): void;
    getPanel?(): Element;
    getEditPanel?(): Element;
    getText?(): string;
    getDocument?(): Document;
    addEventListener?(): void;
    removeEventListener?(): void;
    renderToolbar?(args: IToolbarOptions): void;
    renderPopup?(args: BaseQuickToolbar): void;
    renderDropDownButton?(args: DropDownItemModel): DropDownButton;
    renderColorPicker?(args: IColorPickerModel, item?: string): ColorPicker;
    renderColorPickerDropDown?(args?: IColorPickerModel, item?: string, colorPicker?: ColorPicker): DropDownButton;
}

export interface NotifyArgs {
    module?: string;
    args?: KeyboardEvent | MouseEvent | ClickEventArgs | ClipboardEvent | TouchEvent;
    cancel?: boolean;
    requestType?: string;
    enable?: boolean;
    properties?: Object;
    selection?: NodeSelection;
    selfLink?: Link;
    link?: HTMLInputElement;
    selectNode?: Node[];
    selectParent?: Node[];
    url?: string;
    text?: string;
    title?: string;
    target?: string;
    member?: string;
    /** Defines the notifier name. */
    name?: string;
    /** Defines the selection range. */
    range?: Range;
    /** Defines the action. */
    action?: string;
    callBack?(args?: string | IImageCommandsArgs): void;
    file?: Blob;
    insertElement?: Element;
    touchData?: ITouchData;
    allowedStylePropertiesArray?: string[];
}

export interface IItemCollectionArgs {
    /** Defines the instance of the current selection */
    selection?: NodeSelection;
    /** Defines the HTML elements of currently selected content */
    selectNode?: Node[];
    /** Defines the parent HTML elements of current selection */
    selectParent?: Node[];
    /** Defines the URL action details for link element */
    url?: string;
    /** Defines the title of the link action details */
    title?: string;
    /** Defines the target as string for link element */
    target?: string;
    /** Defines the element to be inserted */
    insertElement?: Element;
}

export interface ITouchData {
    prevClientX?: number;
    prevClientY?: number;
    clientX?: number;
    clientY?: number;
}

/** 
 * @hidden
 */
export interface IColorPickerModel extends ColorPickerModel {
    element?: HTMLElement;
    value?: string;
    command?: string;
    subCommand?: string;
    target?: string;
    iconCss?: string;
}

/** 
 * @hidden
 */
export interface IColorPickerEventArgs extends ColorPickerEventArgs {
    item?: IColorPickerModel;
    originalEvent: string;
    cancel?: boolean;
}

/** 
 * @hidden
 */
export interface IDropDownItem extends ItemModel {
    command?: string;
    subCommand?: string;
    controlParent?: DropDownButton;
}

/** 
 * @hidden
 */
export interface IDropDownClickArgs extends ClickEventArgs {
    item: IDropDownItem;
}

export interface IColorPickerRenderArgs {
    items?: string[];
    containerType?: string;
    container?: HTMLElement;
}

export interface IImageNotifyArgs {
    module?: string;
    args?: KeyboardEvent | MouseEvent | ClickEventArgs | IToolbarItemModel | ClipboardEvent | TouchEvent;
    cancel?: boolean;
    requestType?: string;
    enable?: boolean;
    properties?: Object;
    selection?: NodeSelection;
    selfImage?: Image;
    link?: HTMLInputElement | HTMLElement;
    selectNode?: Node[];
    selectParent?: Node[];
    target?: string;
    alt?: HTMLInputElement | HTMLElement;
    text?: string;
    member?: string;
    name?: string;
    cssClass?: string;
}
export interface IImageCommandsArgs {
    url?: string;
    selection?: NodeSelection;
    width?: { minWidth?: string | number, maxWidth?: string | number; width?: string | number };
    height?: { minHeight?: string | number, maxHeight?: string | number; height?: string | number };
    altText?: string;
    selectParent?: Node[];
    cssClass?: string;
    selectNode?: Node[];
}

export interface ILinkCommandsArgs {
    url?: string;
    selection?: NodeSelection;
    title?: string;
    text?: string;
    target?: Element;
    selectParent?: Node[];
}

export interface ITableArgs {
    row?: number;
    columns?: number;
    width?: { minWidth?: string | number, maxWidth?: string | number; width?: string | number };
    selection?: NodeSelection;
    selectNode?: Node[];
    selectParent?: Node[];
    subCommand?: string;
}

export interface ITableNotifyArgs {
    module?: string;
    args?: ClickEventArgs | MouseEvent | KeyboardEventArgs;
    selection?: NodeSelection;
    selectNode?: Node[];
    selectParent?: Node[];
    cancel?: boolean;
    requestType?: string;
    enable?: boolean;
    properties?: Object;
    self?: Table;
}

export interface IEditorModel {
    execCommand?: Function;
    observer?: Observer;
    markdownSelection?: MarkdownSelection;
    undoRedoManager?: UndoRedoManager | UndoRedoCommands;
    nodeSelection?: NodeSelection;
    mdSelectionFormats?: MDSelectionFormats;
}

export interface IToolbarItems {
    template?: string;
    tooltipText?: string;
}

/** 
 * @hidden
 */
export interface IToolbarItemModel extends ItemModel {
    command?: string;
    subCommand?: string;
}

export interface IToolbarOptions {
    enableRtl: boolean;
    target: HTMLElement;
    items?: ItemModel[];
    rteToolbarObj: BaseToolbar;
    enablePersistence: boolean;
    overflowMode?: OverflowMode;
}

export interface IToolbarSettings {
    enable?: boolean;
    items?: (string | IToolbarItems)[];
    target?: HTMLElement;
    type?: ToolbarType;
}

export interface IToolbarRenderOptions {
    target: HTMLElement;
    items?: (string | IToolbarItems)[];
    mode?: OverflowMode;
    container?: string;
}

export interface IDropDownModel {
    content?: string;
    items: IDropDownItemModel[];
    iconCss?: string;
    itemName: string;
    cssClass: string;
    element: HTMLElement;
}

export interface IToolsItems {
    id: string;
    icon?: string;
    tooltip?: string;
    command?: string;
    subCommand?: string;
    value?: string;
}
export interface IToolsItemConfigs {
    icon?: string;
    tooltip?: string;
    command?: string;
    subCommand?: string;
    value?: string;
}

/** 
 * @hidden
 */
export interface IDropDownItemModel extends DropDownItemModel {
    cssClass?: string;
    command?: string;
    subCommand?: string;
    value?: string;
    text?: string;
}

export interface ActionCompleteEventArgs {
    /** Defines the current action. */
    requestType?: string;
    /** Defines the event name. */
    name?: string;
    /** Defines the editor mode. */
    editorMode?: string;
    /** Defines the selected elements. */
    elements?: Node[];
    /** Defines the event item. */
    event?: MouseEvent | KeyboardEvent;
    /** 
     * Defines the selected range.
     * @deprecated
     */
    range?: Range;
}

export interface ActionBeginEventArgs {
    /** Defines the current action. */
    requestType?: string;
    /** Cancel the print action */
    cancel?: boolean;
    /** Defines the current item. 
     * @deprecated
     */
    item?: IToolbarItemModel | IDropDownItemModel;
    /** Defines the current item. */
    originalEvent?: MouseEvent | KeyboardEvent;
    /** Defines the event name. */
    name?: string;
    /** Defines the url action details. 
     * @deprecated
     */
    itemCollection?: IItemCollectionArgs;
}

export interface PrintEventArgs extends ActionBeginEventArgs {
    /** Defines the RTE element. */
    element?: Element;
}

export interface IShowPopupArgs {
    args?: MouseEvent | TouchEvent | KeyboardEvent;
    type?: string;
    isNotify: boolean;
    elements?: Element | Element[];
}

export interface IUpdateItemsModel {
    targetItem: string;
    updateItem: string;
    baseToolbar: BaseToolbar;
}

export interface IDropDownRenderArgs {
    items?: string[];
    containerType?: string;
    container?: HTMLElement;
}

export interface IShowQuickTBarOptions {
    x: number;
    y: number;
    target: HTMLElement;
    editTop: number;
    editHeight: number;
    popup: HTMLElement;
    parentElement: HTMLElement;
    tBarElementHeight: number;
    parentData: ClientRect;
    windowY: number;
    windowHeight: number;
    windowWidth: number;
    popWidth: number;
    popHeight: number;
    bodyRightSpace: number;
}

export interface IQuickToolbarOptions {
    popupType: string;
    mode: OverflowMode;
    renderType: RenderType;
    toolbarItems: (string | IToolbarItems)[];
}

export interface BeforeQuickToolbarOpenArgs {
    /** Defines the instance of the current popup element
     * @deprecated
     */
    popup: Popup;
    /** Determine whether the quick toolbar is open */
    cancel: boolean;
    /** Defines the target element of the quick toolbar */
    targetElement: Element;
}

export interface IAdapterProcess {
    text: string;
    range: Range;
    actionName: string;
}

export interface IFormatter {
    /** Configure the format tags. */
    formatTags?: { [key: string]: string };
    /** Configure the list tags. */
    listTags?: { [key: string]: string };
    /** Configure the key settings. */
    keyConfig?: { [key: string]: string };
    process?: Function;
    onKeyHandler?: Function;
    editorManager?: IEditorModel;
    getUndoRedoStack?: Function;
    onSuccess?: Function;
    saveData?: Function;
    disableToolbarItem?(items: string | string[]): void;
    enableUndo?: Function;
    setDocument?: Function;
    getDocument?: Function;
    setEditPanel?: Function;
    getEditPanel?: Function;
    updateFormatter?: Function;
    initializePlugin?: Function;
    isAppliedCommand?(e?: MouseEvent): string;
    mdSelectionFormat?: MDSelectionFormats;
}
export interface IHtmlFormatterModel {
    currentDocument?: Document;
    element?: Element;
    keyConfig?: { [key: string]: string };
    options?: { [key: string]: number };
}
export interface IMarkdownFormatterModel {
    element?: Element;
    formatTags?: { [key: string]: string };
    listTags?: { [key: string]: string };
    keyConfig?: { [key: string]: string };
    options?: { [key: string]: number };
    selectionTags?: { [key: string]: string };
}

export interface IFontProperties {
    default?: string;
    items?: IDropDownItemModel[];
    width?: string;
}

export interface IFormatProperties {
    default?: string;
    types?: IDropDownItemModel[];
    width?: string;
}

export interface OffsetPosition {
    left: number;
    top: number;
}

export interface ResizeArgs {
    /** Defines the resize event args. */
    event?: MouseEvent | TouchEvent;
    /** Defines the request type. */
    requestType?: string;
    /** Defines the prevent action. */
    cancel?: boolean;
}

export interface BeforeSanitizeHtmlArgs {
    /** Illustrates whether the current action needs to be prevented or not. */
    cancel?: boolean;
    /** It is a callback function and executed it before our inbuilt action. It should return HTML as a string.
     * @function
     * @param {string} value - Returns the value.
     * @returns {string}
     */
    helper?: Function;
    /** Returns the selectors object which carrying both tags and attributes selectors to block list of cross-site scripting attack.
     *  Also possible to modify the block list in this event.
     */
    selectors?: SanitizeSelectors;
}

export interface SanitizeSelectors {
    /** Returns the tags. */
    tags?: string[];
    /** Returns the attributes. */
    attributes?: SanitizeRemoveAttrs[];
}

export interface SanitizeRemoveAttrs {
    /** Defines the attribute name to sanitize */
    attribute?: string;
    /** Defines the selector that sanitize the specified attributes within the selector */
    selector?: string;
}

export interface ISetToolbarStatusArgs {
    args: IToolbarStatus;
    parent: IRichTextEditor;
    tbElements: HTMLElement[];
    tbItems: IToolbarItemModel[];
    dropDownModule: DropDownButtons;
}

export declare type ColorModeType = 'Picker' | 'Palette';

export interface IColorProperties {
    default?: string;
    mode?: ColorModeType;
    columns?: number;
    colorCode?: { [key: string]: string[] };
    modeSwitcher?: boolean;
}

export interface IExecutionGroup {
    command: string;
    subCommand?: string;
    value?: string;
}

/** @hidden  */
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
        subCommand: 'Image',
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

export declare type CommandName = 'bold' | 'italic' | 'underline' | 'strikeThrough' | 'superscript' |
    'subscript' | 'uppercase' | 'lowercase' | 'fontColor' | 'fontName' | 'fontSize' | 'backColor' |
    'justifyCenter' | 'justifyFull' | 'justifyLeft' | 'justifyRight' | 'undo' | 'createLink' |
    'formatBlock' | 'heading' | 'indent' | 'insertHTML' | 'insertOrderedList' | 'insertUnorderedList' |
    'insertParagraph' | 'outdent' | 'redo' | 'removeFormat' | 'insertText' | 'insertImage' |
    'insertHorizontalRule' | 'insertBrOnReturn';