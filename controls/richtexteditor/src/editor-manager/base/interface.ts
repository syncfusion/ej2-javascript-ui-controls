import { NodeSelection } from './../../selection/index';
import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { IHtmlFormatterCallBack, IAdvanceListItem } from '../../common/interface';
import { IFormatPainterActionValue } from './enum';
/**
 * Specifies  Command models interfaces.
 *
 * @hidden
 * @deprecated
 */
export interface ICommandModel {
    /**
     * Specifies the editor element's current document.
     */
    document: HTMLDocument
    /**
     * Specifies the editable element.
     */
    editableElement: Element
    options?: { [key: string]: number }
    formatPainterSettings?: IFormatPainterSettings
}

/**
 * Specifies IHtmlSubCommands interfaces.
 *
 * @hidden
 * @deprecated
 */
export interface IHtmlSubCommands {
    /**
     * Specifies the item
     */
    item?: IAdvanceListItem
    /**
     * Specifies the subCommand.
     */
    subCommand: string
    /**
     * Specifies the callBack.
     */
    callBack(args: IHtmlFormatterCallBack): () => void
    /**
     * Specifies the callBack.
     */
    value?: string | Node
    /**
     * Specifies the originalEvent.
     */
    event?: MouseEvent
    /**
     * Specifies the iframe element selector.
     */
    selector?: string
    /**
     * Specifies if the icon click is from dropdown or direct toolbarclick.
     */
    exeValue?: { [key: string]: string }
    enterAction?: string
}

/**
 * Specifies  IKeyboardActionArgs interfaces for command line.
 *
 * @hidden
 * @deprecated
 */
export interface IKeyboardActionArgs extends KeyboardEvent {
    /**
     * action of the KeyboardEvent
     */
    action: string
}

/**
 * @deprecated
 */
export interface IHtmlItem {
    module?: string
    event?: KeyboardEvent | MouseEvent | ClipboardEvent
    selection?: NodeSelection
    link?: HTMLInputElement
    selectNode?: Node[]
    selectParent?: Node[]
    item: IHtmlItemArgs
    subCommand: string
    value: string
    selector: string
    callBack(args: IHtmlFormatterCallBack): () => void,
    enterAction?: string
}
/**
 * @deprecated
 */
export interface IHtmlItemArgs {
    selection?: NodeSelection
    selectNode?: Node[]
    selectParent?: Node[]
    src?: string
    url?: string
    isEmbedUrl?: string
    text?: string
    title?: string
    target?: string
    width?: { minWidth?: string | number, maxWidth?: string | number; width?: string | number }
    height?: { minHeight?: string | number, maxHeight?: string | number; height?: string | number }
    altText?: string
    fileName?: string
    rows?: number
    columns?: number
    subCommand?: string
    tableCell?: HTMLElement
    cssClass?: string
    insertElement?: Element
    captionClass?: string
    action?: string
    formatPainterAction?: IFormatPainterActionValue
    ariaLabel?: string
}
/**
 * @deprecated
 */
export interface IHtmlUndoRedoData {
    text?: DocumentFragment
    range?: NodeSelection
}

/**
 * Specifies IHtmlKeyboardEvent interfaces.
 *
 * @hidden
 * @deprecated
 */
export interface IHtmlKeyboardEvent {
    /**
     * Specifies the callBack.
     */
    callBack(args?: IHtmlFormatterCallBack): () => void
    /**
     * Specifies the event.
     */
    event: KeyboardEventArgs
    /**
     * Specifies the notifier name.
     */
    name?: string
    /**
     * Specifies the enter key configuration.
     */
    enterAction?: string
    /**
     * Specifies the tab key action in the Rich Text Editor content..
     */
    enableTabKey?: string
    /**
     * Defines tag to be used when enter key is pressed.
     */
    enterKey?: string
    /**
     * Defines tag to be used when shift enter key is pressed.
     */
    shiftEnterKey?: string
}

/**
 *
 * @deprecated
 * @hidden
 *
 */
export interface IFormatPainterSettings {
    allowedFormats?: string
    deniedFormats?: string
}

/**
 *
 * @deprecated
 * @hidden
 *
 */
export interface IFormatPainterAction {
    formatPainterAction: IFormatPainterActionValue
}


/**
 * @private
 * @hidden
 *
 */
export interface IFormatPainterEditor {
    destroy: Function;
}

/**
 * @private
 * @hidden
 */
export interface FormatPainterCollection {
    attrs: Attr[];
    className: string;
    styles: CSSPropCollection[];
    tagName: string;
}
/**
 * @private
 * @hidden
 *
 */
export interface FormatPainterValue {
    element: HTMLElement;
    lastChild: HTMLElement;
}

/**
 * @private
 * @hidden
 */
export interface DeniedFormatsCollection {
    tag: string;
    styles: string[];
    attributes: string[];
    classes: string[];
}

/**
 * @private
 * @hidden
 */
export interface CSSPropCollection {
    property: string;
    value: string;
    priority: string;
}

/**
 * @private
 * @hidden
 */
export interface IHTMLMouseEventArgs {
    name: string;
    args: MouseEvent;
}

/**
 * @private
 * @hidden
 */
export interface ITableSelection {
    getBlockNodes(action?: boolean): HTMLElement[];
    getTextNodes(): Node[];
}

/**
 * @private
 * @hidden
 */
export interface BeforeInputEvent extends Event {
    data: string | null;
    inputType: string;
    isComposing: boolean;
    preventDefault(): void;
}

/**
 * @private
 * @hidden
 */
export interface CodeBlockPosition {
    blockNode: Node;
    cursorAtLastPosition: boolean;
    nextSiblingCodeBlockElement: {currentNode: Node, nextSibling: Node } | null;
}
