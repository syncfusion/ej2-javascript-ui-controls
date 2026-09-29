/**
 * @hidden
 */
export const destroy: string = 'destroyed';

/**
 * @hidden
 */
export const bindCssClass: string = 'bindCssClass';

/**
 * @hidden
 */
export const insertTable: string = 'insertTable';

/**
 * @hidden
 */
export const modelChanged: string = 'modelchanged';

/**
 * @hidden
 */
export const updateContent: string = 'updateContent';

/**
 * @hidden
 */
export const actionBegin: string = 'actionBegin';

/**
 * @hidden
 */
export const actionComplete: string = 'actionComplete';

/**
 * @hidden
 */
export const change: string = 'change';

/**
 * @hidden
 */
export const focused: string = 'focused';

/**
 * @hidden
 */
export const blurred: string = 'blurred';

/**
 * @hidden
 */
export const executeCommand: string = 'executeCommand';

/**
 * @hidden
 */
export const beforeQuickToolbarOpen: string = 'beforeQuickToolbarOpen';
/**
 * @hidden
 */
export const updateToolbarStatus: string = 'updateToolbarStatus';

/**
 * @hidden
 *
 * Internal observer signal emitted by the RichTextEditor whenever the
 * `updateToolbarStatus` signal arrives from the EditorCore and a toolbar
 * status refresh is required. The ToolbarModule listens for this event and
 * runs the formatting-state refresh on the toolbar UI.
 */
export const refreshToolbarStatus: string = 'refreshToolbarStatus';

/**
 * @hidden
 *
 * Internal observer event emitted by the toolbar module after the toolbar
 * item status (active states, dropdown values, color pickers) has been
 * synchronized with the current editor selection. The RichTextEditor
 * listens for this and raises the public `updatedToolbarStatus` event.
 */
export const updateTbItemsStatus: string = 'updateTbItemsStatus';

/**
 * @hidden
 */
export const editorMouseup: string = 'editor-mouseup';
/**
 * @hidden
 */
export const updatedToolbarStatus: string = 'updatedToolbarStatus';

/**
 * @hidden
 */
export const initialEnd: string = 'initial-end';

/**
 * @hidden
 */
export const toolbarRefresh: string = 'toolbar-refresh';

/**
 * @hidden
 */
export const slashCommandOpening: string = 'slash-command-opening';

/**
 * @private
 */
export const imageModelChanged: string = 'image-model-changed';

/**
 * @hidden
 */
export const linkModelChanged: string = 'link-model-changed';

/**
 * @private
 */
export const readOnlyChanged: string = 'readOnlyChanged';

/**
 * @hidden
 */
export const insertLink: string = 'insertLink';

/**
 * @hidden
 */
export const insertImage: string = 'insertImage';

/**
 * @private
 */
export const linkOperations: string = 'linkOperations';

/**
 * @private
 */
export const imageOperations: string = 'imageOperations';

/**
 * @private
 */
export const insertCompleted: string = 'insertCompleted';

/**
 * @hidden
 */
export const quickToolbarClose: string = 'quickToolbarClose';
/**
 * @hidden
 */
export const quickToolbarOpen: string = 'quickToolbarOpen';

/**
 * @hidden
 */
export const parentScroll: string = 'parent-scroll';

/**
 * @hidden
 *
 * Internal observer event raised by the RichTextEditor when a `keyup` event fires on the editor input element.
 */
export const editorKeyup: string = 'editor-keyup';
export const editorKeydown: string = 'editor-keydown';
export const linkQuickToolbar: string = 'link-quick-toolbar';

/**
 * @hidden
 *
 * Internal observer event raised by the RichTextEditor when the owner document's `selectionchange` event fires.
 */
export const editorSelectionChange: string = 'editor-selectionchange';

/**
 * @hidden
 *
 * Internal observer event raised by the RichTextEditor when the owner document's `mousedown` event fires.
 */
export const documentMouseDown: string = 'document-mousedown';

/**
 * @hidden
 *
 * Internal observer event raised by the RichTextEditor when the owner document's `mouseup` event fires.
 */
export const documentMouseUp: string = 'document-mouseup';

/**
 * @hidden
 *
 * Internal observer event raised by the RichTextEditor when the owner window's `resize` event fires.
 */
export const windowResize: string = 'window-resize';
/**
 * @hidden
 */
export const selectRange: string = 'selectRange';
/**
 * @hidden
 */
export const contentscroll: string = 'contentscroll';
/**
 * @hidden
 */
export const closeLinkDialog: string = 'closeLinkDialog';

/**
 * @hidden
 */
export const closeImageDialog: string = 'closeImageDialog';
/**
 * @hidden
 */
export const closeTableDialog: string = 'closeTableDialog';
