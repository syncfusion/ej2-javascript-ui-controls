/**
 * Mark — represents inline formatting applied to text.
 */
export interface Mark {
    /** The mark type name (e.g. 'bold', 'italic', 'link'). */
    type: string;
    /** Mark attributes — type-safe values only, no PM types. */
    attrs: Record<string, unknown>;
}

/**
 * ActiveMarksState — represents the state of marks active on current selection.
 *
 * Users query this via Editor.getActiveMarks() → Set<string> for O(1) membership testing.
 * Mark attributes are queried separately via Editor.getMarkAttributes(markName).
 *
 * @example
 * ```typescript
 * const activeMarks = editor.getActiveMarks();
 * if (activeMarks.has('bold')) {
 *     console.log('Bold is active');
 * }
 * ```
 */
export interface ActiveMarksState {
    /** Set of active mark type names at current selection. */
    marks: Set<string>;
}
