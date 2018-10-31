// tslint:disable-next-line:missing-jsdoc
import { Component, Observer, L10n } from '@syncfusion/ej2-base';
import { ItemModel, OverflowMode } from '@syncfusion/ej2-navigations';
import { ItemModel as DropDownItemModel, DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Action, ToolbarType, RenderType } from './enum';
import { Toolbar } from '../actions/toolbar';
import { UndoRedoManager } from '../../editor-manager/plugin/undo';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { BaseToolbar } from '../actions/base-toolbar';
import { BaseQuickToolbar } from '../actions/base-quick-toolbar';
import { NodeSelection } from '../../selection/selection';
import { EditorMode } from './../../common/types';
import { MarkdownSelection } from './../../markdown-parser/plugin/markdown-selection';
import { ToolbarSettingsModel, IFrameSettingsModel, ImageSettingsModel, TableSettingsModel } from '../models/models';
import { QuickToolbarSettingsModel, InlineModeModel } from '../models/models';
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
    formatter?: IFormatter;

    toolbarModule?: Toolbar;
    sourceCodeModule?: ViewSource;
    getToolbarElement?(): Element;
    fullScreenModule?: FullScreen;
    undoRedoModule?: UndoRedoManager;
    quickToolbarModule?: QuickToolbar;
    undoRedoSteps?: number;
    markdownEditorModule: MarkdownEditor;
    htmlEditorModule: HtmlEditor;
    countModule?: Count;
    serviceLocator?: ServiceLocator;
    setEnable?(): void;
    setReadOnly?(): void;
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
    args?: KeyboardEvent | MouseEvent | ClickEventArgs;
    cancel?: boolean;
    requestType?: Action;
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
    name?: string;
    range?: Range;
    action?: string;
    callBack?(args?: string): void;
    file?: Blob;
}

export interface IColorPickerModel extends ColorPickerModel {
    element?: HTMLElement;
    value?: string;
    command?: string;
    subCommand?: string;
    target?: string;
    iconCss?: string;
}

export interface IColorPickerEventArgs extends ColorPickerEventArgs {
    item?: IColorPickerModel;
    originalEvent: string;
    cancel?: boolean;
}

export interface IDropDownItem extends ItemModel {
    command?: string;
    subCommand?: string;
}

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
    args?: KeyboardEvent | MouseEvent | ClickEventArgs | IToolbarItemModel;
    cancel?: boolean;
    requestType?: Action;
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
    args?: ClickEventArgs | MouseEvent;
    selection?: NodeSelection;
    selectNode?: Node[];
    selectParent?: Node[];
    cancel?: boolean;
    requestType?: Action;
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
    icon: string;
    tooltip: string;
    command: string;
    subCommand: string;
    value?: string;
}

export interface IDropDownItemModel extends DropDownItemModel {
    class?: string;
    command?: string;
    subCommand?: string;
    value?: string;
    text?: string;
}

export interface ActionCompleteEventArgs {
    /** Defines the current action. */
    requestType?: Action;
    /** Defines the event name. */
    name?: string;
    /** Defines the editor mode. */
    editorMode?: string;
    /** Defines the selected elements. */
    elements?: Node[];
    /** Defines the event item. */
    event?: MouseEvent | KeyboardEvent;
    /** Defines the selected range. */
    range?: Range;
}

export interface ActionBeginEventArgs {
    /** Defines the current action. */
    requestType?: Action;
    /** Cancel the print action */
    cancel?: boolean;
    /** Defines the current item. */
    item?: IToolbarItemModel | IDropDownItemModel;
    /** Defines the current item. */
    originalEvent?: MouseEvent | KeyboardEvent;
    /** Defines the event name. */
    name?: string;
    /** Defines the url action details. */
    itemCollection?: NotifyArgs;
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

export interface IAdapterProcess {
    text: string;
    range: Range;
    actionName: string;
}

export interface IFormatter {
    formatTags?: { [key: string]: string };
    listTags?: { [key: string]: string };
    keyConfig?: { [key: string]: string };
    process?: Function;
    onKeyHandler?: Function;
    editorManager?: IEditorModel;
    getUndoRedoStack?: Function;
    onSuccess?: Function;
    saveData?: Function;
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
    event?: MouseEvent | TouchEvent;
    requestType?: string;
    cancel?: boolean;
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
        command: 'style',
        subCommand: 'bold',
        value: 'strong'
    },
    'italic': {
        command: 'style',
        subCommand: 'italic',
        value: 'em'
    },
    'underline': {
        command: 'style',
        subCommand: 'underline',
        value: 'span'
    },
    'strikeThrough': {
        command: 'style',
        subCommand: 'strikeThrough',
        value: 'span'
    },
    'superscript': {
        command: 'effects',
        subCommand: 'superscript',
        value: 'sup'
    },
    'subscript': {
        command: 'effects',
        subCommand: 'subscript',
        value: 'sub'
    },
    'uppercase': {
        command: 'casing',
        subCommand: 'uppercase'
    },
    'lowercase': {
        command: 'casing',
        subCommand: 'lowercase'
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
        subCommand: 'Links'
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
        command: 'InsertHTML',
        subCommand: 'InsertHTML',
        value: ''
    },
    'insertHorizontalRule': {
        command: 'InsertHTML',
        subCommand: 'InsertHTML',
        value: '<hr/>'
    },
    'insertImage': {
        command: 'InsertHTML',
        subCommand: 'InsertHTML',
        value: '<img/>'
    },
    'insertBrOnReturn': {
        command: 'InsertHTML',
        subCommand: 'InsertHTML',
        value: '<br/>'
    },
    'insertOrderedList': {
        command: 'Formats',
        value: 'OL'
    },
    'insertUnorderedList': {
        command: 'Formats',
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