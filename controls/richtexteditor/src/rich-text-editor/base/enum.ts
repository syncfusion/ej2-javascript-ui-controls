/**
 * Defines types of Render
 * @hidden
 */
export enum RenderType {
    /**  Defines RenderType as Toolbar */
    Toolbar,
    /**  Defines RenderType as Content */
    Content,
    /**  Defines RenderType as Popup */
    Popup,
    /**  Defines RenderType as LinkToolbar */
    LinkToolbar,
    /**  Defines RenderType as TextToolbar */
    TextToolbar,
    /**  Defines RenderType as ImageToolbar */
    ImageToolbar,
    /**  Defines RenderType as InlineToolbar */
    InlineToolbar,
    /**  Defines RenderType as TableToolbar */
    TableToolbar
}

export type ActionOnScroll = 'hide' | 'none';

export enum ToolbarType {
    /**  Defines ToolbarType as Standard */
    Expand = 'Expand',
    /**  Defines ToolbarType as MultiRow */
    MultiRow = 'MultiRow'
}

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
    | 'styles' | 'removeLink';