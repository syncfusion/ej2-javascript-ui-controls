
/**
 * Specifies the modes available for rendering the Rich Text Editor.
 * Options are either in HTML or Markdown format.
 */
export type EditorMode = 'HTML' | 'Markdown';

/**
 * Specifies the formats available for saving images.
 * Options include saving as Base64 or Blob.
 */
export type SaveFormat = 'Base64' | 'Blob';

/**
 * Specifies the layout options for displaying audio or video content.
 * Options are Inline or Break.
 */
export type DisplayLayoutOptions = 'Inline' | 'Break';

/**
 * Specifies the HTML tag used when the enter key is pressed.
 * Options include P, DIV, or BR.
 */
export type EnterKey = 'P' | 'DIV' | 'BR';

/**
 * Specifies the HTML tag used when shift + enter keys are pressed.
 * Options include P, DIV, or BR.
 */
export type ShiftEnterKey = 'P' | 'DIV' | 'BR';

