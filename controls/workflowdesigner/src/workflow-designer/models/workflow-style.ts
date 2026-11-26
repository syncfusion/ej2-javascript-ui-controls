/**
 * Defines the configurable visual style of a workflow sticky note.
 */
export interface WorkflowStickyNoteStyle {
    /**
     * Defines the sticky-note background fill color.
     *
     * @default ''
     */
    fill?: string;

    /**
     * Defines the sticky-note border width.
     *
     * @default 1
     * @private
     */
    strokeWidth?: number;

    /**
     * Defines the sticky-note corner radius.
     *
     * @default 0
     * @private
     */
    cornerRadius?: number;

    /**
     * Defines the sticky-note opacity.
     *
     * @default 1
     * @private
     */
    opacity?: number;

    /**
     * Defines the SVG stroke-dasharray for the sticky-note border.
     *
     * @default ''
     * @private
     */
    strokeDashArray?: string;
}

/**
 * Defines the configurable visual style of a workflow connection.
 *
 * @private
 */
export interface WorkflowConnectionStyle {
    /**
     * Defines the connection stroke color.
     *
     * @default ''
     */
    strokeColor?: string;

    /**
     * Defines the connection stroke width.
     *
     * @default 1
     */
    strokeWidth?: number;

    /**
     * Defines the SVG stroke-dasharray for the connection.
     *
     * @default ''
     * @private
     */
    strokeDashArray?: string;
}

