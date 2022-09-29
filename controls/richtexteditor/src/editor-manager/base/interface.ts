import { NodeSelection } from './../../selection/index';
import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { IHtmlFormatterCallBack, IAdvanceListItem } from '../../common/interface';
/**
 * Specifies  Command models interfaces.
 *
 * @hidden
 * @deprecated
 */
export interface ICommandModel {
    /**
     * Specifies the current document.
     */
    document: HTMLDocument
    /**
     * Specifies the current window.
     */
    editableElement: Element
    options?: { [key: string]: number }
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
    event?: KeyboardEvent | MouseEvent
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
}
/**
 * @deprecated
 */
export interface IHtmlUndoRedoData {
    text?: string
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
     * Specifies the ignoreDefault.
     */
    ignoreDefault?: boolean
    /**
     * Specifies the notifier name.
     */
    name?: string
    /**
     * Specifies the enter key configuration.
     */
    enterAction?: string
}
