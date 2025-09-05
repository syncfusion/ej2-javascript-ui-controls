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
    lineBreakAdded = 'lineBreakAdded',
    blockAdded = 'blockAdded',
    blockRemoved = 'blockRemoved',
    blockMoved = 'blockMoved',
    multipleBlocksDeleted = 'multipleBlocksDeleted',
    blockTransformed = 'blockTransformed',
    clipboardPaste = 'clipboardPaste'
}

/* Constant string values */
export const RTL_CLS: string = 'e-rtl';
export const DISABLED_CLS: string = 'e-disabled';
export const SPACE: string = ' ';
export const OVERLAY_CONTAINER_CLS: string = 'e-blockeditor-overlay-container';
export const BLOCK_WRAPPER_CLS: string = 'e-block-container-wrapper';

export const BLOCK_ID_PREFIX: string = 'block';
export const CONTENT_ID_PREFIX: string = 'content';
export const INDENT_KEY: string = '--block-indent';
export const BLOCK_CLS: string = 'e-block';
export const CONTENT_CLS: string = 'e-block-content';
export const CALLOUT_BLOCK_CLS: string = 'e-callout-block';
export const TOGGLE_BLOCK_CLS: string = 'e-toggle-block';
export const CALLOUT_CONTENT_CLS: string = 'e-callout-content';
export const TOGGLE_CONTENT_CLS: string = 'e-toggle-content';

export const BLOCKACTION_MENUBAR_CLS: string = 'e-blockeditor-blockaction-menubar';
export const BLOCKACTION_POPUP_CLS: string = 'e-blockeditor-blockaction-popup';
export const BLOCKACTION_TOOLTIP_CLS: string = 'e-blockeditor-blockaction-tooltip';

export const BLOCKEDITOR_CONTEXTMENU_CLS: string = 'e-blockeditor-contextmenu';

export const BLOCKEDITOR_INLINETBAR_CLS: string = 'e-blockeditor-inline-toolbar';
export const INLINE_TBAR_POPUP_CLS: string = 'e-blockeditor-inline-toolbar-popup';
export const INLINE_TBAR_TOOLTIP_CLS: string = 'e-blockeditor-inline-toolbar-tooltip';
export const TBAR_ITEM_CLS: string = 'e-toolbar-item';
