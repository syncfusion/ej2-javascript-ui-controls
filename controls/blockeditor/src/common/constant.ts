/* Events */

export const events: { [key: string]: string } = {
    keydown: 'keydown',
    input: 'input',

    moduleChanged: 'moduleChanged',
    inlineToolbarCreated: 'inlineToolbarCreated',
    inlineToolbarItemClick: 'inlineToolbarItemClick',
    inlineToolbarBeforeOpen: 'inlineToolbarBeforeOpen',
    formattingPerformed: 'formatting-performed',
    cut: 'cut',
    copy: 'copy',
    paste: 'paste',
    destroy: 'destroy',
    rtlChanged: 'rtl-changed',

    contentChanged: 'contentChanged',
    blockAdded: 'blockAdded',
    blockRemoved: 'blockRemoved',
    blockMoved: 'blockMoved',
    blockTransformed: 'blockTransformed',
    undoRedoPerformed: 'undoRedoPerformed',
    undoStackChanged: 'undoStackChanged',
    localeChanged: 'localeChanged',

    editorClick: 'editorClick',
    documentClick: 'documentClick'

};

/* Action Types */
export enum actionType {
    contentChanged = 'contentChanged',
    formattingAction = 'formattingAction',
    indent = 'indent',
    checked = 'checked',
    lineBreakAdded = 'lineBreakAdded',
    isExpanded = 'isExpanded',
    blockAdded = 'blockAdded',
    blockRemoved = 'blockRemoved',
    blockMoved = 'blockMoved',
    multipleBlocksDeleted = 'multipleBlocksDeleted',
    blockTransformed = 'blockTransformed',
    clipboardPaste = 'clipboardPaste',
    tableRowInserted = 'tableRowInserted',
    tableRowDeleted = 'tableRowDeleted',
    tableColumnInserted = 'tableColumnInserted',
    tableColumnDeleted = 'tableColumnDeleted',
    tableCellsCleared = 'tableCellsCleared',
    tableCellsPasted = 'tableCellsPasted',
    tableRowsDeleted = 'tableRowsDeleted',
    tableColumnsDeleted = 'tableColumnsDeleted',
    tableHeaderInput = 'tableHeaderInput'
}

/* Commands */
export const ADDBLOCK: string = 'ADDBLOCK';
export const SPLITBLOCK: string = 'SPLITBLOCK';
export const DELETEBLOCK: string = 'DELETEBLOCK';
export const INDENTBLOCK: string = 'INDENTBLOCK';
export const DELETEATCURSOR: string = 'DELETEATCURSOR';
export const MOVEBLOCK: string = 'MOVEBLOCK';
export const DUPLICATEBLOCK: string = 'DUPLICATEBLOCK';

export const FORMATTINGACTION: string = 'FORMATTINGACTION';

export const CLEAREVENTCHANGES: string = 'CLEAREVENTCHANGES';
export const DELETE_NON_MERGABLEBLOCK: string = 'DELETE_NON_MERGABLEBLOCK';

/* Constant string values */
export const RTL_CLS: string = 'e-rtl';
export const DISABLED_CLS: string = 'e-disabled';
export const HIDDEN_CLS: string = 'e-hidden';
export const SPACE: string = ' ';
export const BLOCK_CONTAINER_ID: string = '_blockcontainer';
export const BLOCK_CONTAINER_CLS: string = 'e-block-container';

export const BLOCK_ID_PREFIX: string = 'block';
export const CONTENT_ID_PREFIX: string = 'content';
export const INDENT_KEY: string = '--block-indent';
export const BLOCK_CLS: string = 'e-block';
export const CONTENT_CLS: string = 'e-block-content';
export const CALLOUT_BLOCK_CLS: string = 'e-callout-block';
export const TOGGLE_BLOCK_CLS: string = 'e-toggle-block';
export const CALLOUT_CONTENT_CLS: string = 'e-callout-content';
export const TOGGLE_CONTENT_CLS: string = 'e-toggle-content';
export const TABLE_BLOCK_CLS: string = 'e-table-block';
export const TABLE_CELL_BLK_CONTAINER: string = 'e-cell-blocks-container';
export const TABLE_CELL_FOCUS: string = 'e-cell-focus';

export const BLOCKACTION_MENUBAR_ID: string = '_blockaction-menubar';
export const BLOCKACTION_POPUP_ID: string = '_blockaction-popup';
export const BLOCKACTION_TOOLTIP_ID: string = '_blockaction-tooltip';
export const BLOCKEDITOR_CONTEXTMENU_ID: string = '_contextmenu';
export const BLOCKEDITOR_INLINETBAR_ID: string = '_inline-toolbar';
export const INLINE_TBAR_POPUP_ID: string = '_inline-toolbar-popup';
export const INLINE_TBAR_TOOLTIP_ID: string = '_inline-toolbar-tooltip';
export const LINKDIALOG_ID: string = '_linkDialog';

export const BLOCKACTION_MENUBAR_CLS: string = 'e-blockeditor-blockaction-menubar';
export const BLOCKACTION_POPUP_CLS: string = 'e-blockeditor-blockaction-popup';
export const BLOCKACTION_TOOLTIP_CLS: string = 'e-blockeditor-blockaction-tooltip';
export const BLOCKEDITOR_CONTEXTMENU_CLS: string = 'e-blockeditor-contextmenu';
export const BLOCKEDITOR_INLINETBAR_CLS: string = 'e-blockeditor-inline-toolbar';
export const INLINE_TBAR_POPUP_CLS: string = 'e-blockeditor-inline-toolbar-popup';
export const INLINE_TBAR_TOOLTIP_CLS: string = 'e-blockeditor-inline-toolbar-tooltip';
export const LINKDIALOG_CLS: string = 'e-blockeditor-link-dialog';
export const TBAR_ITEM_CLS: string = 'e-toolbar-item';
