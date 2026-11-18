/**
 * special-node-deletion-plugin.ts — Two-beat selection/deletion for the
 * built-in special blocks (Table, Divider, Callout, Collapsible, Image, CodeBlock).
 *
 * Behavior (MD Parts 6–8, 10):
 *   1. Backspace immediately after a special block (empty TextSelection) →
 *      select that block via NodeSelection. Nothing is deleted.
 *   2. Delete immediately before a special block (empty TextSelection) →
 *      select that block via NodeSelection. Nothing is deleted.
 *   3. Backspace/Delete while the special block is already NodeSelected →
 *      delete the whole block and restore the caret to a valid editable
 *      position (appending a Paragraph only when the doc would otherwise
 *      have no textblock — MD Part 10).
 *
 * Guards preserving existing behavior (MD Part 11/17, 12, 18):
 *   - Non-empty selections fall through (normal range deletion unaffected).
 *   - Only built-in special-block node names participate; everything else
 *     falls through to the base keymap (tableEditing, baseKeymap, etc.).
 *   - The depth walk prefers the innermost special neighbour: a Divider
 *     inside a table cell is selected before the surrounding Table.
 *   - Tables participate in the opt-in set (`table` is in
 *     BUILT_IN_SPECIAL_BLOCKS), with `allowTableNodeSelection: true` so
 *     `tableEditing` does not silently coerce a Table NodeSelection into a
 *     CellSelection. `tableEditing` and PM's joinBackward/joinForward still
 *     run when this handler returns false.
 *   - External NodeSelections (e.g. produced by image insertion) are
 *     re-armed on first interaction rather than deleted immediately — the
 *     selection token just produced is treated as the start of a new Beat-1
 *     sequence. The single integer plugin state holds the armed position.
 *
 * PM boundary: sealed inside src/pm/. PM imports via pm-guard only.
 */

import { NodeSelection, PMEditorState, PMEditorView, PMNode, PMNodeType,
    PMPlugin, PMResolvedPos, PMSelection, PMTransaction, TextSelection } from '../pm-guard';

/**
 * Built-in node names that participate in the two-beat selection/deletion UX
 * by default. Composed into the active opt-in set inside the factory.
 *
 * Adding a new built-in special block is a one-line change here.
 */
const BUILT_IN_SPECIAL_BLOCKS: ReadonlyArray<string> = [
    'table',
    'horizontalRule',
    'callout',
    'collapsible',
    'image',
    'codeBlock'
];

/**
 * Options passed to {@link specialNodeDeletionPlugin}. Consumers who
 * define their own "special block" node types (for example inside a custom
 * extension's `plugins()` capability) can opt those names in without touching
 * the editor's public API surface.
 */
export interface SpecialNodeDeletionOptions {
    /**
     * Additional node names that should participate in the two-beat
     * selection/deletion UX on top of the built-in defaults.
     */
    readonly nodeNames?: ReadonlyArray<string>;
}

/**
 * Returns the special-block neighbour targeted by a deletion keypress.
 *
 * Mirrors ProseMirror's `findCutBefore`/`findCutAfter` (used by
 * `selectNodeBackward`/`selectNodeForward`): walk from the caret's
 * deepest boundary upward through ancestors. At each depth, check
 * whether there is an adjacent sibling (previous for Backspace, next
 * for Delete) whose node type is in the built-in special-block set.
 * The first match at the innermost depth wins.
 *
 * The textblock boundary guard preserves normal character deletion:
 * when the caret is mid-paragraph, no special neighbour is targeted and
 * the keystroke falls through to the base keymap.
 *
 * @param  {PMSelection} sel                    Current selection (must be empty).
 * @param  {boolean}     backwards             True for Backspace, false for Delete.
 * @param  {ReadonlySet<string>} specialBlockNodeNames  Node names that participate in the two-beat UX.
 * @returns {number}                            Document position of the target block
 *                                              start, or -1 when no target applies.
 */
function findSpecialBlockNeighbour(
    sel: PMSelection,
    backwards: boolean,
    specialBlockNodeNames: ReadonlySet<string>
): number {
    const $pos: PMResolvedPos = sel.$from;
    // Only fire on block boundaries; mid-paragraph caret is normal char deletion.
    if ($pos.parent.isTextblock) {
        if (backwards && $pos.parentOffset !== 0) {
            return -1;
        }
        if (!backwards && $pos.parentOffset !== $pos.parent.content.size) {
            return -1;
        }
    }
    for (let depth: number = $pos.depth; depth >= 0; depth--) {
        const parent: PMNode = $pos.node(depth);
        let boundaryNode: PMNode | null = null;
        let childIndex: number;
        if (backwards) {
            const index: number = $pos.index(depth);
            if (index === 0) {
                continue;
            }
            childIndex = index - 1;
            boundaryNode = parent.child(childIndex);
        } else {
            const index: number = $pos.indexAfter(depth);
            if (index >= parent.childCount) {
                continue;
            }
            childIndex = index;
            boundaryNode = parent.child(childIndex);
        }
        if (boundaryNode && specialBlockNodeNames.has(boundaryNode.type.name)) {
            // codeBlock directly after codeBlock: let PM's joinBackward merge them.
            if (backwards && depth === $pos.depth - 1 && $pos.parent.type.name === 'codeBlock'
                && boundaryNode.type.name === 'codeBlock') {
                return -1;
            }
            let offset: number = 0;
            for (let i: number = 0; i < childIndex; i++) {
                offset += parent.child(i).nodeSize;
            }
            return $pos.start(depth) + offset;
        }
    }
    return -1;
}

/**
 * True when deleting [from, to) would leave the document with no textblock.
 * MD Part 10: append a Paragraph in that case so the editor stays focusable.
 *
 * @param  {PMEditorState} state Current editor state.
 * @param  {number} from        Deletion range start.
 * @param  {number} to          Deletion range end.
 * @returns {boolean}           True when no textblock remains outside the range.
 */
function deletionLeavesNoTextblock(state: PMEditorState, from: number, to: number): boolean {
    let hasTextblock: boolean = false;
    state.doc.nodesBetween(0, state.doc.content.size, (node: PMNode, pos: number): boolean => {
        if (hasTextblock) { return false; }
        if (node.isTextblock) {
            if (pos + node.nodeSize <= from || pos >= to) {
                hasTextblock = true;
                return false;
            }
        }
        return true;
    });
    return !hasTextblock;
}

/**
 * Plugin state: absolute position of the currently armed NodeSelection.
 * -1 (UNARMED) means no selection is armed.
 */
interface ArmedState {
    readonly pos: number;
}

const UNARMED: ArmedState = { pos: -1 };

/**
 * Creates the special-block delete keymap plugin. Registered directly by the
 * editor builder; no extension-system coupling.
 *
 * @param  {SpecialNodeDeletionOptions} options  Opt-in node names on top of the built-in defaults.
 * @returns {PMPlugin}                            The keymap plugin.
 */
export function specialNodeDeletionPlugin(
    options: SpecialNodeDeletionOptions = {}
): PMPlugin {
    const specialBlockNodeNames: ReadonlySet<string> = new Set<string>([
        ...BUILT_IN_SPECIAL_BLOCKS,
        ...(options.nodeNames ?? [])
    ]);
    const plugin: PMPlugin<ArmedState> = new PMPlugin<ArmedState>({
        state: {
            init(): ArmedState { return UNARMED; },
            apply(
                tr: PMTransaction,
                value: ArmedState
            ): ArmedState {
                // tr.getMeta(plugin) carries the Beat-1 / Beat-2 signals from handleKeyDown.
                // On any doc change, return to unarmed so the next interaction starts at Beat-1.
                const meta: ArmedState | undefined = tr.getMeta(plugin) as ArmedState | undefined;
                if (meta !== undefined) {
                    return meta;
                }
                if (tr.docChanged) {
                    return UNARMED;
                }
                return value;
            }
        },
        props: {
            handleKeyDown(view: PMEditorView, event: KeyboardEvent): boolean {
                const isBackspace: boolean = event.key === 'Backspace';
                const isDelete: boolean = event.key === 'Delete';
                if (!isBackspace && !isDelete) {
                    return false;
                }
                const state: PMEditorState = view.state;
                const selection: PMSelection = state.selection;
                const armed: ArmedState = plugin.getState(state) ?? UNARMED;
                // Beat 2: a NodeSelection whose absolute position matches the armed
                // position is the one we produced in Beat-1 → delete it. Any other
                // special-block NodeSelection (e.g. an external one produced by image
                // insertion) is treated as a fresh Beat-1: we re-arm and consume the
                // keypress without deleting.
                if (selection instanceof NodeSelection) {
                    const selectedNode: PMNode = selection.node;
                    if (!specialBlockNodeNames.has(selectedNode.type.name)) {
                        return false;
                    }
                    if (armed.pos !== selection.from) {
                        const tr: PMTransaction = state.tr;
                        tr.setMeta(plugin, { pos: selection.from });
                        view.dispatch(tr);
                        return true;
                    }
                    const from: number = selection.from;
                    const to: number = selection.to;
                    const tr: PMTransaction = state.tr;
                    tr.setMeta(plugin, UNARMED);
                    tr.deleteRange(from, to);
                    if (deletionLeavesNoTextblock(state, from, to)) {
                        const paragraphType: PMNodeType | undefined = state.schema.nodes['paragraph'];
                        const paragraph: PMNode | null = paragraphType
                            ? paragraphType.createAndFill()
                            : null;
                        if (paragraph) {
                            tr.insert(0, paragraph);
                        }
                    }
                    const anchor: number = Math.min(from, tr.doc.content.size);
                    tr.setSelection(TextSelection.near(tr.doc.resolve(anchor), 1));
                    view.dispatch(tr.scrollIntoView());
                    return true;
                }
                // Only empty TextSelections participate in Beat-1 selection.
                if (!selection.empty) {
                    return false;
                }
                // Beat 1: select the neighbouring special block.
                const targetPos: number = findSpecialBlockNeighbour(selection, isBackspace, specialBlockNodeNames);
                if (targetPos < 0) {
                    return false;
                }
                const targetNode: PMNode | undefined = state.doc.nodeAt(targetPos);
                if (!targetNode || !specialBlockNodeNames.has(targetNode.type.name)) {
                    return false;
                }
                const tr: PMTransaction = state.tr;
                const nodeSel: NodeSelection = NodeSelection.create(tr.doc, targetPos);
                tr.setSelection(nodeSel);
                tr.setMeta(plugin, { pos: targetPos });
                view.dispatch(tr);
                return true;
            }
        }
    });
    return plugin;
}
