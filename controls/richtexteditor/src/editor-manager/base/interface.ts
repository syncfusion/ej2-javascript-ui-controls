import { NodeSelection } from './../../selection/index';
import { KeyboardEventArgs } from '@syncfusion/ej2-base';
import { IHtmlFormatterCallBack } from '../../common/interface';
/**
 * Specifies  Command models interfaces.
 * @hidden
 */
export interface ICommandModel {
    /**
     * Specifies the current document.
     */
    document: HTMLDocument;
    /**
     * Specifies the current window.
     */
    editableElement: Element;
    options?: { [key: string]: number };
}

/**
 * Specifies IHtmlSubCommands interfaces.
 * @hidden
 */
export interface IHtmlSubCommands {
    /**
     * Specifies the subCommand.
     */
    subCommand: string;
    /**
     * Specifies the callBack.
     */
    callBack(args: IHtmlFormatterCallBack): () => void;
    /**
     * Specifies the callBack.
     */
    value?: string | Node;
    /**
     * Specifies the originalEvent.
     */
    event?: MouseEvent;
}

/**
 * Specifies  IKeyboardActionArgs interfaces for command line.
 * @hidden
 */
export interface IKeyboardActionArgs extends KeyboardEvent {
    /**
     * action of the KeyboardEvent
     */
    action: string;
}

export interface IHtmlItem {
    module?: string;
    event?: KeyboardEvent | MouseEvent;
    selection?: NodeSelection;
    link?: HTMLInputElement;
    selectNode?: Node[];
    selectParent?: Node[];
    item: IHtmlItemArgs;
    subCommand: string;
    callBack(args: IHtmlFormatterCallBack): () => void;
}
export interface IHtmlItemArgs {
    selection?: NodeSelection;
    selectNode?: Node[];
    selectParent?: Node[];
    url?: string;
    text?: string;
    title?: string;
    target?: string;
    width?: { minWidth?: string | number, maxWidth?: string | number; width?: string | number };
    height?: { minHeight?: string | number, maxHeight?: string | number; height?: string | number };
    altText?: string;
    row?: number;
    columns?: number;
    subCommand?: string;
    tableCell?: HTMLElement;
    cssClass?: string;
}
export interface IHtmlUndoRedoData {
    text?: string;
    range?: NodeSelection;
}

/**
 * Specifies IHtmlKeyboardEvent interfaces.
 * @hidden
 */
export interface IHtmlKeyboardEvent {
    /**
     * Specifies the callBack.
     */
    callBack(args?: IHtmlFormatterCallBack): () => void;
    /**
     * Specifies the event.
     */
    event: KeyboardEventArgs;
    /**
     * Specifies the ignoreDefault.
     */
    ignoreDefault?: boolean;
}