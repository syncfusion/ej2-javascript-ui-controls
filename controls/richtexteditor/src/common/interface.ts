/**
 * Specifies  common models interfaces.
 * @hidden
 */
import { EditorMode } from './types';

export interface IMarkdownFormatterCallBack {
    selectedText?: string;
    editorMode?: EditorMode;
    action?: string;
    event?: KeyboardEvent | MouseEvent;
    requestType?: string;
}

export interface IHtmlFormatterCallBack {
    selectedNode?: Element;
    requestType?: string;
    range?: Range;
    editorMode?: EditorMode;
    action?: string;
    elements?: Element | Element[];
    event?: KeyboardEvent | MouseEvent;
}

export interface IMarkdownToolbarStatus {
    OrderedList: boolean;
    UnorderedList: boolean;
    Formats: string;
}
export interface IUndoCallBack {
    callBack?: Function;
    event?: Object;
}

export interface IToolbarStatus {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    superscript?: boolean;
    subscript?: boolean;
    fontcolor?: string;
    fontname?: string;
    fontsize?: string;
    backgroundcolor?: string;
    formats?: string;
    alignments?: string;
    orderedlist?: boolean;
    unorderedlist?: boolean;
    inlinecode?: boolean;
    uppercase?: boolean;
    createlink?: boolean;
}
