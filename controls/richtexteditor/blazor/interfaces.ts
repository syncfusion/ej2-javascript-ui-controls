import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { ItemModel, DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { ClickEventArgs, OverflowMode } from '@syncfusion/ej2-navigations';
import { Link } from './renderer/link-module';
import { Image } from './renderer/image-module';
import { Table } from './renderer/table-module';
import { IToolbarStatus } from '../src/common/interface';
import { SfRichTextEditor } from './sf-richtexteditor-fn';
import { MDSelectionFormats } from '../src/markdown-parser/plugin/md-selection-formats';
import { IEditorModel, IDropDownItemModel } from '../src/rich-text-editor/base/interface';
import { NodeSelection, IToolbarItemModel, IImageCommandsArgs, ITouchData } from '../src';

/**
 * Interfaces
 */

export interface BlazorRteElement extends HTMLElement {
    blazor__instance: SfRichTextEditor;
}

export interface ToolsItem {
    id: string;
    icon: string;
    command: string;
    subCommand: string;
    tooltip: string;
    value?: string;
}

export interface FormatterMode {
    markdownFormatter: IMarkdownFormatterModel;
    htmlFormatter: IHtmlFormatterModel;
}

export interface IDropDownItem extends ItemModel {
    command?: string;
    subCommand?: string;
    value?: string;
    controlParent?: DropDownButton;
}

export interface IDropDownClickArgs extends ClickEventArgs {
    item: IDropDownItem;
    name: string;
}

export interface FormatModel {
    default?: string;
    width?: string;
    items?: IDropDownItemModel[];

}
export interface IHtmlFormatterModel {
    currentDocument?: Document;
    element?: Element;
    keyConfig?: { [key: string]: string };
    options?: { [key: string]: number };
}

export interface ISetToolbarStatusArgs {
    args: IToolbarStatus;
    parent: SfRichTextEditor;
    tbElements: HTMLElement[];
    tbItems: IToolbarItemModel[];
    dropDownModule: { [key: string]: object };
}
export interface IMarkdownFormatterModel {
    element?: Element;
    formatSyntax?: { [key: string]: string };
    listSyntax?: { [key: string]: string };
    keyConfig?: { [key: string]: string };
    options?: { [key: string]: number };
    selectionSyntax?: { [key: string]: string };
}

export interface IFormatter {
    /** Configure the format tags. */
    formatSyntax?: { [key: string]: string };
    /** Configure the list tags. */
    listSyntax?: { [key: string]: string };
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

export interface ToolbarClickEventArgs {
    cancel: boolean;
    item: ToolsItem;
    originalEvent: MouseEvent;
    requestType: string;
    name?: string;
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

export interface LinkFormModel {
    url: string;
    text: string;
    title: string;
    target: boolean;
}

export interface EditTableModel {
    width: number;
    padding: number;
    spacing: number;
}

export interface IQuickToolbarOptions {
    popupType: string;
    mode: OverflowMode;
}

export interface ShowQuickPopOptions {
    x: number;
    y: number;
    target: HTMLElement;
}

export interface IShowImageDialog {
    width?: number;
    height?: number;
    maxWidth?: number;
    minWidth?: number;
    maxHeight?: number;
    minHeight?: number;
    mode: string;
    url?: string;
    altText?: string;
    newWindow?: boolean;
}

export interface FocusBlurEventArgs {
    isInteracted: boolean;
}

export interface AfterImageDeleteEventArgs {
    src: String;
}