/**
 * Defines types of Render
 *
 * @hidden
 * @deprecated
 */
export enum RenderType {
/* eslint-disable */
/** Defines RenderType as Toolbar */
Toolbar,
/** Defines RenderType as Content */
    Content,
/** Defines RenderType as Popup */
    Popup,
/** Defines RenderType as LinkToolbar */
    LinkToolbar,
/** Defines RenderType as TextToolbar */
    TextToolbar,
/** Defines RenderType as ImageToolbar */
    ImageToolbar,
/** Defines RenderType as AudioToolbar */
    AudioToolbar,
/** Defines RenderType as AudioToolbar */
    VideoToolbar,
/** Defines RenderType as InlineToolbar */
    InlineToolbar,
/** Defines RenderType as TableToolbar */
    TableToolbar
/* eslint-enable */
}

/**
 * Defines types of action to be done on a quick toolbar scroll.
 */
export type ActionOnScroll = 'hide' | 'none';

/**
 * Defines types to be used as Toolbar.
 */
export enum ToolbarType {
/* eslint-disable */
/** Defines ToolbarType as Standard */
Expand = 'Expand',
/** Defines ToolbarType as MultiRow */
    MultiRow = 'MultiRow',
/** Defines ToolbarType as Scrollable */
    Scrollable = 'Scrollable'
/* eslint-enable */
}

/**
 * Defines the type of dialog, which open or close in the Rich Text Editor.
 */
export enum DialogType {
/* eslint-disable */
/** Defines ToolbarType as Standard */
    InsertLink = 'InsertLink',
/** Defines ToolbarType as MultiRow */
    InsertImage = 'InsertImage',
/** Defines DialogType as Audio*/
    InsertAudio = 'InsertAudio',
/** Defines DialogType as Video*/
    InsertVideo = 'InsertVideo',
/** Defines ToolbarType as Scrollable */
    InsertTable = 'InsertTable'
/* eslint-enable */
}

/**
 * Defines types to be used to configure the toolbar items.
 */
export type ToolbarItems = 'alignments' | 'justifyLeft' | 'justifyCenter' | 'justifyRight'
| 'justifyFull' | 'fontName' | 'fontSize' | 'fontColor' | 'backgroundColor'
| 'bold' | 'italic' | 'underline' | 'strikeThrough' | 'clearFormat' | 'clearAll'
| 'cut' | 'copy' | 'paste' | 'unorderedList' | 'orderedList' | 'indent'
| 'outdent' | 'undo' | 'redo' | 'superScript' | 'subScript'
| 'createLink' | 'openLink' | 'editLink' | 'image' | 'createTable'
| 'removeTable' | 'replace' | 'align' | 'caption' | 'remove'
| 'openImageLink' | 'editImageLink' | 'removeImageLink' | 'insertLink'
| 'display' | 'altText' | 'dimension' | 'fullScreen' | 'maximize'
| 'minimize' | 'lowerCase' | 'upperCase' | 'print' | 'formats'
| 'sourceCode' | 'preview' | 'viewSide' | 'insertCode' | 'tableHeader'
| 'tableRemove' | 'tableRows' | 'tableColumns' | 'tableCellBackground'
| 'tableCellHorizontalAlign' | 'tableCellVerticalAlign' | 'tableEditProperties'
| 'styles' | 'removeLink'| 'merge';
