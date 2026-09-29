/**
 * active-marks-resolver.ts — Resolves active marks from PM selection state.
 *
 * Converts PM's mark representation to a PM-free Set<string> for toolbar queries.
 * Uses ProseMirror's native mark handling patterns for efficiency.
 *
 * Algorithms:
 * - Cursor: Collect marks at cursor position + stored marks
 * - Range: Walk inline nodes in range, collect intersection of marks
 * - Other: Return empty set (marks apply to inline text only)
 */

import type { PMMark, PMEditorState, PMNode } from '../pm-guard';

export class ActiveMarksResolver {

    /**
     * Resolve active marks on current PM selection.
     *
     * **Cursor semantics:**
     * - Marks at cursor position
     * - Plus stored marks (marks for next typed character)
     *
     * **Range semantics (from ≠ to):**
     * - Walk inline nodes in range using PM's nodesBetween()
     * - Collect intersection of marks common to all nodes
     * - Only includes marks present on every node (all/all semantics)
     * - Unmarked text participates with an empty set, so a mixed-format
     *   selection (part bold, part plain) reports the mark as INACTIVE —
     *   the toolbar shows the true mixed state
     * - Structural leaves (hard breaks, images) never carry text formatting
     *   and are skipped so they do not dilute equally-formatted text
     *
     * **Other selection types (NodeSelection, CellSelection):**
     * - Return empty set (marks apply to inline text, not nodes)
     *
     * @param {PMEditorState} pmState - PM EditorState (contains selection and document)
     * @returns {Set<string>} Set of active mark type names; empty if no marks or not a text selection
     * @hidden
     */
    public resolveActiveMarks(pmState: PMEditorState): Set<string> {
        const { selection, doc, storedMarks } = pmState;

        // Step 1: Detect selection type
        const isCollapsed: boolean = selection.from === selection.to;

        if (isCollapsed) {
            // Cursor position: collect marks at cursor + stored marks
            const cursorMarks: readonly PMMark[] = selection.$from.marks();
            const marksAtCursor: Set<string> = this._markSetToNameSet(cursorMarks);

            // Add stored marks (marks for next typed character)
            if (storedMarks) {
                storedMarks.forEach((mark: PMMark): void => {
                    marksAtCursor.add(mark.type.name);
                });
            }

            return marksAtCursor;
        }

        // Step 2: Range selection - walk inline nodes and collect intersection
        const nodeMarkSets: Set<string>[] = [];

        // Use PM's efficient node iteration
        doc.nodesBetween(selection.from, selection.to, (node: PMNode): void => {
            // Marks apply only to inline content — skip block wrappers.
            if (!node.isInline) {
                return;
            }
            // Structural leaves (hardBreak, image, inlineMath…) carry no
            // text formatting of their own. Including them would dilute
            // the intersection and turn an uniformly-bold range containing
            // a line break into "inactive" — so they are excluded.
            if (node.isLeaf && !node.isText) {
                return;
            }
            // Text nodes with NO marks MUST participate with an empty set:
            // they represent genuinely unformatted content. Skipping them
            // (the previous behaviour) made a mixed-format selection report
            // the partial mark as fully active, so the toolbar showed e.g.
            // Bold as active when only part of the range was bold.
            const nodeMarks: Set<string> = this._markSetToNameSet(node.marks);
            nodeMarkSets.push(nodeMarks);
        });

        // Step 3: Compute intersection of marks across all inline nodes
        if (nodeMarkSets.length === 0) {
            return new Set();
        }

        // Start with marks from first node
        const intersection: Set<string> = new Set(nodeMarkSets[0]);

        // Remove marks not present in all nodes
        for (let i: number = 1; i < nodeMarkSets.length; i++) {
            const currentNodeMarks: Set<string> = nodeMarkSets[i as number];
            const toDelete: string[] = [];

            intersection.forEach((mark: string): void => {
                if (!currentNodeMarks.has(mark)) {
                    toDelete.push(mark);
                }
            });

            toDelete.forEach((mark: string): boolean => intersection.delete(mark));
        }

        return intersection;
    }

    /**
     * Get attributes for a specific active mark.
     *
     * Returns attributes only if the mark is active at current selection.
     * For range selections, returns anchor (first) mark's attributes.
     * For collapsed selections, prefers the storedMarks set (so callers
     * querying the result of `setMark` at a cursor see the just-stored
     * attrs) and falls back to the marks at the cursor.
     *
     * @param {PMEditorState} pmState - PM EditorState
     * @param {string} markName - Mark type name to query (e.g., 'bold', 'link')
     * @returns {Readonly<object>} Readonly attributes if active; null if not active or not a text selection
     * @hidden
     */
    public getActiveMarkAttributes(
        pmState: PMEditorState,
        markName: string
    ): Readonly<Record<string, unknown>> | null {
        const activeMarks: Set<string> = this.resolveActiveMarks(pmState);

        // Mark not active
        if (!activeMarks.has(markName)) {
            return null;
        }

        // Mark is active; find its attributes at selection start.
        // For collapsed selections, prefer storedMarks so the toolbar can
        // read back the attrs that were just stored by a setMark command
        // before any text has been typed. Range selections always use the
        // anchor's marks.
        const { selection } = pmState;
        const isCollapsed: boolean = selection.from === selection.to;
        if (isCollapsed && pmState.storedMarks) {
            for (const mark of pmState.storedMarks) {
                if (mark.type.name === markName) {
                    return Object.freeze({ ...mark.attrs }) as Readonly<Record<string, unknown>>;
                }
            }
        }

        // Get marks at cursor/anchor position
        const marksAtAnchor: readonly PMMark[] = selection.$from.marks();

        // Find the mark by name and return its attributes as readonly
        for (const mark of marksAtAnchor) {
            if (mark.type.name === markName) {
                return Object.freeze({ ...mark.attrs }) as Readonly<Record<string, unknown>>;
            }
        }

        // Fallback (shouldn't reach here if mark is in activeMarks)
        return null;
    }

    /**
     * Convert PM MarkType set to Set<string> of mark names.
     *
     * @param {PMMark[]} pmMarks - Array of PM marks
     * @returns {Set<string>} Set of mark type names
     * @hidden
     */
    private _markSetToNameSet(pmMarks: readonly PMMark[]): Set<string> {
        const nameSet: Set<string> = new Set<string>();
        for (let i: number = 0; i < pmMarks.length; i++) {
            const mark: PMMark = pmMarks[i as number];
            nameSet.add(mark.type.name);
        }
        return nameSet;
    }
}
