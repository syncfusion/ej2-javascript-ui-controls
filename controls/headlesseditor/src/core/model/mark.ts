/**
 * Mark — represents inline formatting applied to text.
 */
export interface Mark {
    /** The mark type name (e.g. 'bold', 'italic', 'link'). */
    type: string;
    /** Mark attributes — type-safe values only, no PM types. */
    attrs: Record<string, unknown>;
}
