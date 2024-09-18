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
export interface IAdvanceListItem {
    listStyle? : string
    listImage?: string
    type?: string
}

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
    callBack?: Function
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
    lowercase?: boolean
    createlink?: boolean
    insertcode?: boolean
    blockquote?: boolean
    numberFormatList?: string | boolean
    bulletFormatList?: string | boolean
    InlineCode?: boolean
}
/**
 * @deprecated
 * @private
 *
 *
 * */
export interface IImageResizeFactor {
    // [x multiplier, y multiplier]
    topLeft     : [number, number];
    topRight    : [number, number];
    botLeft     : [number, number];
    botRight    : [number, number];
}

/**
 * The `ImageOrTableCursor` is used to specify the image or table cursor in Enter key Module.
 *
 * @private
 * @hidden
 *
 *
 * */
export interface ImageOrTableCursor  {
    start: boolean;
    startName: string;
    end: boolean;
    endName: string;
}
