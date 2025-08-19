import { KeyboardEventArgs } from '../../base'; /*externalscript*/
import { ItemModel, DropDownButton, SplitButton } from '../../splitbuttons/src'; /*externalscript*/
import { ClickEventArgs, OverflowMode } from '../../navigations/src'; /*externalscript*/
import { Link } from './renderer/link-module';
import { Image } from './renderer/image-module';
import { Audio } from './renderer/audio-module';
import { Video } from './renderer/video-module';
import { Table } from './renderer/table-module';
import { IColorPickerModel, IDropDownModel, ISplitButtonModel, IToolbarStatus } from '../src/common/interface';
import { SfRichTextEditor } from './sf-richtexteditor-fn';
import { MDSelectionFormats } from '../src/markdown-parser/plugin/md-selection-formats';
import { IEditorModel, IDropDownItemModel } from '../src/common/interface';
import { IToolbarItemModel, IImageCommandsArgs, IAudioCommandsArgs, IVideoCommandsArgs, ITouchData } from '../src/common/interface';
import { NodeSelection } from '../src/selection/selection';
import { Popup } from '../../popups/src'; /*externalscript*/
import { ColorPicker } from '../../inputs/src'; /*externalscript*/
/**
 * Interfaces
 */

export interface ToolsItem {
    id: string;
    icon: string;
    command: string;
    subCommand: string;
    tooltip: string;
    value?: string;
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
     * Element of the Toolbar rendered inside the Popup.
     */
    toolbarElement: HTMLElement;
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
    renderDropDownButton?(args: ItemModel): DropDownButton
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
    enablePersistence: boolean
    overflowMode?: OverflowMode
    cssClass?: string
    type?: string
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
    getCurrentStackIndex(): number;
    clearUndoRedoStack?: Function
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
    selfAudio?: Audio;
    selfVideo?: Video;
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
    callBack?(args?: string | IImageCommandsArgs | IAudioCommandsArgs | IVideoCommandsArgs): void;
    file?: Blob;
    insertElement?: Element;
    touchData?: ITouchData;
    allowedStylePropertiesArray?: string[];
    ariaLabel?: string;
}

export interface LinkFormModel {
    url: string;
    text: string;
    title: string;
    target: boolean;
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
    width?: string;
    height?: string;
    maxWidth?: number;
    minWidth?: number;
    maxHeight?: number;
    minHeight?: number;
    mode: string;
    url?: string;
    altText?: string;
    newWindow?: boolean;
}

export interface IShowAudioDialog {
    mode: string;
    url?: string;
    fileName?: string;
}

export interface IShowVideoDialog {
    width?: string;
    height?: string;
    maxWidth?: number;
    minWidth?: number;
    maxHeight?: number;
    minHeight?: number;
    mode: string;
    url?: string;
    fileName?: string;
}

export interface FocusBlurEventArgs {
    isInteracted: boolean;
}

export interface AfterImageDeleteEventArgs {
    src: string;
}

export interface MediaDeletedEventArgs {
    src: string;
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
}

export interface AdditionalSanitizeAttributes {
    attribute: string;
    selector: string;
}
