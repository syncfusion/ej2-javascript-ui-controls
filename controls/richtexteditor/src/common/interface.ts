/**
 * Specifies  common models interfaces.
 * 
 * @hidden
 * @deprecated
 */
import { EditorMode } from './types';

/**
 * @deprecated
 */
export interface IMarkdownFormatterCallBack {
    selectedText?: string
    editorMode?: EditorMode
    action?: string
    event?: KeyboardEvent | MouseEvent
    requestType?: string
}

/**
 * @deprecated
 */
export interface IHtmlFormatterCallBack {
    selectedNode?: Element
    requestType?: string
    range?: Range
    editorMode?: EditorMode
    action?: string
    elements?: Element | Element[]
    imgElem?: Element | Element[]
    event?: KeyboardEvent | MouseEvent
}

/**
 * @deprecated
 */
export interface IMarkdownToolbarStatus {
    OrderedList: boolean
    UnorderedList: boolean
    Formats: string
}
/**
 * @deprecated
 */
export interface IUndoCallBack {
    // eslint-disable-next-line
    callBack?: Function
    // eslint-disable-next-line
    event?: Object
}

/**
 * @deprecated
 */
export interface IToolbarStatus {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
    superscript?: boolean
    subscript?: boolean
    fontcolor?: string
    fontname?: string
    fontsize?: string
    backgroundcolor?: string
    formats?: string
    alignments?: string
    orderedlist?: boolean
    unorderedlist?: boolean
    inlinecode?: boolean
    uppercase?: boolean
    createlink?: boolean
    insertcode?: boolean
}
