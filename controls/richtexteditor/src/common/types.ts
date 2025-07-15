// Public types.

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

/**
 * Defines the behavior of the quick toolbar when scrolling occurs.
 *
 * Options:
 * - 'hide': The quick toolbar will be hidden when scrolling occurs
 * - 'none': No action will be taken when scrolling occurs (toolbar remains visible)
 */
export type ActionOnScroll = 'hide' | 'none';

/**
 * Lists the items available in the slash menu.
 */
export type SlashMenuItems = 'Heading 1' | 'Heading 2' | 'Heading 3' | 'Heading 4'
| 'Paragraph' | 'Blockquote' | 'OrderedList' | 'UnorderedList' | 'Table' | 'Image'
| 'Audio' | 'Video' | 'CodeBlock' | 'Emojipicker' | 'Link';

// Private types.

/**
 * Defines the type of the Quick toolbar popup.
 *
 * @hidden
 */
export type QuickToolbarType = 'Audio' | 'Image' | 'Inline' | 'Link' | 'Table' | 'Text' | 'Video';

/**
 * Defines the Quick toolbar collision type.
 *
 * @hidden
 */
export type QuickToolbarCollision = 'ViewPort' | 'ParentElement' | 'ScrollableContainer' | 'Hidden';

/**
 * Defines the direction of the selection.
 *
 * @hidden
 */
export type SelectionDirection = 'Backward' | 'Forward';

/**
 * Defines the Quick toolbar open event trigger.
 *
 * @hidden
 */
export type TriggerType = 'keyup' | 'contextmenu' | 'mouseup' | 'trippleclick' | 'none' | 'scroll';

/**
 * Defines the type of the Quick Toolbar tip pointer position.
 *
 * @hidden
 *
 */
export type TipPointerPosition = 'Top-Left' | 'Top-LeftMiddle' | 'Top-Center' | 'Top-RightMiddle' | 'Top-Right' | 'Bottom-Left' | 'Bottom-LeftMiddle' | 'Bottom-Center' | 'Bottom-RightMiddle' | 'Bottom-Right' | 'None';
