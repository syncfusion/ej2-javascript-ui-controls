/**
 * Enum values for EditorManager
 */

/**
 *
 * @deprecated
 * @hidden
 * Defines the context or contexts in which styles will be copied.
 */
export type IFormatPainterContext = 'Text'| 'List' | 'Table';

/**
 *
 * @deprecated
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
