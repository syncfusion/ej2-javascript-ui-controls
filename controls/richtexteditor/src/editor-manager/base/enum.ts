/**
 * Enum values for EditorManager
 */

/**
 *
 * @private
 * @hidden
 * Defines the context or contexts in which styles will be copied.
 */
export type IFormatPainterContext = 'Text'| 'List' | 'Table';

/**
 *
 * @private
 * @hidden
 * Defines the action values for format painter.
 */
export type IFormatPainterActionValue = 'format-copy' | 'format-paste' | 'escape';

/**
 * Specifies the position of the toolbar.
 */
export enum ToolbarPosition {
    /**
     * Positions the toolbar at the top of the RichTextEditor.
     */
    Top = 'Top',
    /**
     * Positions the toolbar at the bottom of the RichTextEditor.
     */
    Bottom = 'Bottom'
}
