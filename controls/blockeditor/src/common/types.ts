/**
 * Types type for EditorManager
 *
 * @hidden
 */
export type EditorExecCommand = 'AddBlock' | 'DeleteBlock' | 'SplitBlock' | 'IndentBlock' | 'DeleteAtCursor' | 'MoveBlock' | 'DuplicateBlock' | 'FormattingAction' | 'DeleteNonMergableBlock';

/**
 * Defines the direction of the selection.
 *
 * @hidden
 */
export type SelectionDirection = 'Backward' | 'Forward';

/**
 * Defines the Inline toolbar collision type.
 *
 * @hidden
 */
export type InlineToolbarCollision = 'ViewPort' | 'ParentElement' | 'ScrollableContainer' | 'Hidden';

