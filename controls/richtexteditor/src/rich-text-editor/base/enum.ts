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
    TableToolbar,
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
| 'sourceCode' | 'preview' | 'viewSide' | 'insertCode' | 'blockquote' | 'tableHeader'
| 'tableRemove' | 'tableRows' | 'tableColumns' | 'tableCellBackground'
| 'tableCellHorizontalAlign' | 'tableCellVerticalAlign' | 'tableEditProperties'
| 'styles' | 'removeLink'| 'merge' | 'InlineCode';

/**
 * Defines types to be used to configure the toolbarSettings items.
 */
export type ToolbarConfigItems = 'Alignments' | 'JustifyLeft'| 'JustifyCenter' | 'JustifyRight'
| 'JustifyFull' | 'FontName' | 'FontSize' | 'FontColor' | 'BackgroundColor' | 'ImportWord' | 'ExportWord' | 'ExportPdf'
| 'Bold' | 'Italic' | 'Underline' | 'StrikeThrough' | 'ClearFormat' | 'ClearAll'
| 'Cut' | 'Copy' | 'Paste' | 'UnorderedList' | 'OrderedList' | 'Indent'| 'Outdent'
| 'Undo' | 'Redo' | 'SuperScript' | 'SubScript'
| 'CreateLink'| 'Image' | 'CreateTable' |'InsertLink' |'FullScreen' | 'LowerCase'
| 'UpperCase' | 'Print' | 'Formats'|'FormatPainter'|'EmojiPicker'|'UnderLine'|'ZoomOut'|'ZoomIn'
| 'SourceCode' | 'Preview' | 'ViewSide' | 'InsertCode' | 'Blockquote' |'Audio'|'Video'|'NumberFormatList'
|'BulletFormatList'|'FileManager'| '|'|'-'| 'InlineCode';

/**
 * Defines types to be used as inserted image.
 */
export enum ImageInputSource {
    /** Defines ImageInputSource as Uploaded */
    Uploaded = 'Uploaded',
    /** Defines ImageInputSource as Dropped */
    Dropped = 'Dropped',
    /** Defines ImageInputSource as Pasted */
    Pasted = 'Pasted'
}

/**
 * Defines the available items in the slash menu.
 */
export type SlashMenuItems = 'Heading 1' | 'Heading 2' | 'Heading 3' | 'Heading 4'
| 'Paragraph'| 'Blockquote' | 'OrderedList' | 'UnorderedList' | 'Table' | 'Image' |
'Audio' | 'Video' | 'CodeBlock' | 'Emojipicker' | 'Link';

