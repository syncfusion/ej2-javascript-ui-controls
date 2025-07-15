/**
 * Defines types to be used as CommandName.
 *
 * The `CommandName` type encompasses various commands that can be applied within the rich text editor.
 * Each command represents a specific formatting or editing action, such as applying text styles,
 * inserting multimedia content, and handling text alignment or structure.
 *
 */
export declare type CommandName = 'bold' | 'italic' | 'underline' | 'strikeThrough' | 'superscript' |
'subscript' | 'uppercase' | 'lowercase' | 'fontColor' | 'fontName' | 'fontSize' | 'backColor' |
'justifyCenter' | 'justifyFull' | 'justifyLeft' | 'justifyRight' | 'undo' | 'createLink' |
'formatBlock' | 'heading' | 'indent' | 'insertHTML' | 'insertOrderedList' | 'insertUnorderedList' |
'insertParagraph' | 'outdent' | 'redo' | 'removeFormat' | 'insertText' | 'insertImage' | 'insertAudio' | 'insertVideo' |
'insertHorizontalRule' | 'insertBrOnReturn' | 'insertCode' | 'insertTable' | 'editImage' | 'editLink' | 'applyFormatPainter' |
'copyFormatPainter' | 'escapeFormatPainter' | 'emojiPicker' | 'InlineCode' | 'importWord' | 'insertCodeBlock';


/**
 * Specifies the types of items that can be used in the toolbar.
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
| 'styles' | 'removeLink' | 'merge' | 'inlineCode' | 'horizontalLine';

/**
 * Specifies the configuration items available for the toolbar settings.
 */
export type ToolbarConfigItems = 'Alignments' | 'JustifyLeft' | 'JustifyCenter' | 'JustifyRight'
| 'JustifyFull' | 'FontName' | 'FontSize' | 'FontColor' | 'BackgroundColor' | 'ImportWord' | 'ExportWord' | 'ExportPdf'
| 'Bold' | 'Italic' | 'Underline' | 'StrikeThrough' | 'ClearFormat' | 'ClearAll'
| 'Cut' | 'Copy' | 'Paste' | 'UnorderedList' | 'OrderedList' | 'Indent' | 'Outdent'
| 'Undo' | 'Redo' | 'SuperScript' | 'SubScript'
| 'CreateLink' | 'Image' | 'CreateTable' | 'InsertLink' | 'FullScreen' | 'LowerCase'
| 'UpperCase' | 'Print' | 'Formats' | 'FormatPainter' | 'EmojiPicker' | 'UnderLine' | 'ZoomOut' | 'ZoomIn'
| 'SourceCode' | 'Preview' | 'ViewSide' | 'InsertCode' | 'Blockquote' | 'Audio' | 'Video' | 'NumberFormatList'
| 'BulletFormatList' | 'FileManager' | '|' | '-' | 'InlineCode' | 'HorizontalLine';

/**
 * Defines types to be used as colorMode for color selection in the RichTextEditor.
 */
export declare type ColorModeType = 'Picker' | 'Palette';

/**
 * Enumerates the types of dialogs that can be opened or closed in the Rich Text Editor.
 */
export enum DialogType {
    /** Defines DialogType for inserting a link. */
    InsertLink = 'InsertLink',
    /** Defines DialogType for inserting an image. */
    InsertImage = 'InsertImage',
    /** Defines DialogType for inserting audio. */
    InsertAudio = 'InsertAudio',
    /** Defines DialogType for inserting video. */
    InsertVideo = 'InsertVideo',
    /** Defines DialogType for inserting a table. */
    InsertTable = 'InsertTable'
}
/**
 * Enumerates the types of toolbars available.
 */
export enum ToolbarType {
    /** Defines ToolbarType as Expand. */
    Expand = 'Expand',
    /** Defines ToolbarType as MultiRow. */
    MultiRow = 'MultiRow',
    /** Defines ToolbarType as Scrollable. */
    Scrollable = 'Scrollable',
    /** Defines ToolbarType as popup. */
    Popup = 'Popup'
    /* eslint-enable */
}

/**
 * Enumerates the sources for images to be inserted.
 */
export enum ImageInputSource {
    /** Defines ImageInputSource as Uploaded. */
    Uploaded = 'Uploaded',
    /** Defines ImageInputSource as Dropped. */
    Dropped = 'Dropped',
    /** Defines ImageInputSource as Pasted. */
    Pasted = 'Pasted'
}
