import { WorkflowPosition } from './workflow-position';
import { WorkflowSize } from './workflow-size';
import { WorkflowStickyNoteStyle } from './workflow-style';

/**
 * Defines a sticky note: a text note on the canvas used to document the workflow.
 * Sticky notes are not part of the workflow logic and are never run.
 */
export interface WorkflowStickyNote {
    /**
     * Defines the unique identifier of the sticky note.
     *
     * @default ''
     */
    id?: string;

    /**
     * Defines the text of the sticky note. Basic Markdown is supported for display, such as bold,
     * italic, inline code, headings and lists. The text is HTML-escaped before it is displayed.
     *
     * @default ''
     */
    text?: string;

    /**
     * Defines the exact canvas position of the sticky note.
     *
     * @default { x: 0, y: 0 }
     */
    position?: WorkflowPosition;

    /**
     * Defines the size of the sticky note.
     *
     * @default {}
     */
    size?: WorkflowSize;

    /**
     * Defines the visual style of the sticky note.
     *
     * @default {}
     */
    style?: WorkflowStickyNoteStyle;
}
