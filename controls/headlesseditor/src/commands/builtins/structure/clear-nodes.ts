/**
 * clear-nodes.ts — Internal infrastructure: normalize non-paragraph blocks
 * to paragraphs across the current selection.
 *
 * It walks every block covered by `ctx.pmState.selection` (top-level AND nested) and, for
 * each block that is not already a `paragraph` and not a list item,
 * replaces it with a `paragraph` in place via `tr.setNodeMarkup`.
 *
 * Used by `toggleListType` so that any non-paragraph block can be converted
 * to a list
 *
 *     Heading
 *        ↓
 *     Paragraph
 *        ↓   wrapInList
 *     • Heading
 *
 * And for the nested case:
 *
 *     <blockquote><h1>"..."</h1></blockquote>
 *        ↓   inner h1 → paragraph (blockquote preserved by pmWrapInList)
 *     <blockquote><p>"..."</p></blockquote>
 *        ↓   wrapInList
 *     <blockquote><ul><li><p>"..."</p></li></ul></blockquote>
 *
 * The two operations land on the same `tr` (one transaction, one dispatch).
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMNode, PMNodeType, PMEditorState, PMTransaction, PMMark, ResolvedPos } from '../../../pm/pm-guard';

// Block types that the normalize walker must not descend into or convert.
const PROTECTED_BLOCK_TYPES: ReadonlySet<string> = new Set<string>([
    'listItem', 'taskItem'
]);

// ── normalizeBlocksToParagraph ───────────────────────────────────────────────

/**
 * Mutate `tr` so that every block covered (directly or transitively) by the
 * selection that is not already a `paragraph` (and not a list item) is
 * replaced in place with a `paragraph` via `tr.setNodeMarkup`.
 *
 * Handles the cases the `clearNodes` analogue must cover:
 *
 *  1. A non-list block at the top level (e.g. heading, codeBlock):
 *     replaced in place with a paragraph.
 *  2. A non-list block nested inside a block container
 *     (e.g. `<blockquote><h1>x</h1></blockquote>`):
 *     the inner block is converted to a paragraph; the container is
 *     preserved by `pmWrapInList`, which wraps content via `ReplaceAroundStep`
 *     at the appropriate depth without lifting it out of the parent.
 *
 * Operates right-to-left so each mutation does not invalidate the positions
 * of remaining blocks.
 *
 * A no-op when:
 *   - the schema has no `paragraph` node type,
 *   - or the selection covers no non-list, non-paragraph block.
 *
 * @param {PMTransaction} tr - The transaction to mutate in place.
 * @param {PMSchema} schema - The PM schema.
 * @param {PMEditorState} pmState - The original PM state (used for storedMarks).
 * @returns {void} Nothing — `tr` is mutated in place.
 * @hidden
 */
export function normalizeBlocksToParagraph(
    tr: PMTransaction,
    schema: PMEditorState['schema'],
    pmState: PMEditorState
): void {
    const paraType: PMNodeType | undefined = Object.prototype.hasOwnProperty.call(schema.nodes, 'paragraph')
        ? schema.nodes['paragraph']
        : undefined;
    if (!paraType) { return; }

    const from: number = tr.selection.from;
    const to: number = tr.selection.to;
    if (from === to) {
        // Collapsed cursor: find the deepest non-paragraph, non-list block
        // ancestor and normalize from there. The recursive child-first walk
        // in `normalizeBlockAt` handles nested containers.
        const $pos: ResolvedPos = tr.doc.resolve(from);
        let targetPos: number = -1;
        for (let d: number = $pos.depth; d >= 0; d--) {
            const ancestor: PMNode = $pos.node(d);
            if (ancestor === tr.doc) { continue; }
            if (ancestor.type === paraType) { continue; }
            if (PROTECTED_BLOCK_TYPES.has(ancestor.type.name)) { continue; }
            targetPos = $pos.before(d);
            break;
        }
        if (targetPos >= 0) {
            normalizeBlockAt(tr, pmState, paraType, targetPos);
        }
        return;
    }

    // Collect every non-paragraph, non-list block position covered by the
    // selection. `normalizeBlockAt` recurses into nested blocks
    // first, so processing inner-first (right-to-left position order) is the
    // safe sequence.
    const positions: Array<{ pos: number; node: PMNode }> = [];
    tr.doc.nodesBetween(from, to, (node: PMNode, pos: number): boolean => {
        if (!node.isBlock) { return true; }
        if (node === tr.doc) { return true; }
        if (node.type === paraType) { return true; }
        if (PROTECTED_BLOCK_TYPES.has(node.type.name)) { return true; }
        positions.push({ pos, node });
        return true;
    });
    positions.sort((a: { pos: number, node: PMNode }, b: { pos: number, node: PMNode }) => b.pos - a.pos);

    for (const entry of positions) {
        // After earlier (later-position) mutations, the entry's pos may now
        // point at a different node or be stale. `normalizeBlockAt` re-reads
        // from the current tr.doc and bails when the position is no longer
        // meaningful.
        normalizeBlockAt(tr, pmState, paraType, entry.pos);
    }
}

/**
 * Normalize the block at `pos` (a top-level or nested block) to a paragraph
 * when the conversion is schema-valid. Recurses into non-list block
 * children first so nested non-paragraph blocks (e.g. a heading inside a
 * blockquote) are converted before their parent is considered.
 *
 * @param {PMTransaction} tr - The transaction to mutate.
 * @param {PMEditorState} pmState - The original state (for storedMarks).
 * @param {PMNodeType} paraType - The paragraph node type.
 * @param {number} pos - Position of the block in the current tr.doc.
 * @returns {void} Nothing — `tr` is mutated in place.
 * @hidden
 */
function normalizeBlockAt(
    tr: PMTransaction,
    pmState: PMEditorState,
    paraType: PMNodeType,
    pos: number
): void {
    if (pos < 0 || pos >= tr.doc.content.size) { return; }
    const node: PMNode | null = tr.doc.nodeAt(pos);
    if (!node) { return; }
    if (!node.isBlock) { return; }
    if (node.type === paraType) { return; }
    if (PROTECTED_BLOCK_TYPES.has(node.type.name)) { return; }

    // First, normalize any non-list, non-paragraph block children of `node`
    // so we don't try to convert a parent that still contains an incompatible
    // child. Children are processed right-to-left to keep positions valid.
    const childPositions: number[] = [];
    node.forEach((_child: PMNode, offset: any) => {
        const childPos: number = pos + 1 + offset;
        childPositions.push(childPos);
    });
    childPositions.sort((a: number, b: number) => b - a);
    for (const childPos of childPositions) {
        normalizeBlockAt(tr, pmState, paraType, childPos);
    }

    // Re-read the node after child normalization.
    const fresh: PMNode | null = tr.doc.nodeAt(pos);
    if (!fresh || !fresh.isBlock) { return; }
    if (fresh.type === paraType) { return; }
    if (PROTECTED_BLOCK_TYPES.has(fresh.type.name)) { return; }

    // If the node's content is valid for a paragraph, swap its type to
    // paragraph. If it would violate the schema (e.g. a block container with
    // block children we can't convert), do nothing — the caller will see the
    // unchanged structure and `pmWrapInList` will still fail, which is the
    // correct behavior for an unconvertible selection. The wrap at the right
    // depth preserves the container hierarchy (e.g. blockquote).
    if (paraType.validContent(fresh.content)) {
        tr.setNodeMarkup(pos, paraType);
        const marks: readonly PMMark[] = pmState.storedMarks ?? pmState.selection.$from.marks();
        tr.ensureMarks(marks);
    }
}

// ── clearNodesCommand ────────────────────────────────────────────────────────

/**
 * Internal command.
 *
 * @hidden
 */
export const clearNodesCommand: PMCommandInternal<void> = {
    name: 'clearNodes',
    meta: { label: 'Clear Nodes', category: 'structure' },

    canExecute(ctx: PMCommandContext): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const paraType: PMNodeType | undefined = Object.prototype.hasOwnProperty.call(pmState.schema.nodes, 'paragraph')
            ? pmState.schema.nodes['paragraph']
            : undefined;
        if (!paraType) { return false; }
        // canExecute: true when the selection covers at least one
        // non-paragraph, non-list block that the recursive walker can
        // convert.
        const { from, to } = pmState.selection;
        let found: boolean = false;
        pmState.doc.nodesBetween(from, to, (node: PMNode): boolean => {
            if (found) { return false; }
            if (!node.isBlock) { return true; }
            if (node.type === paraType) { return true; }
            if (PROTECTED_BLOCK_TYPES.has(node.type.name)) { return true; }
            found = true;
            return false;
        });
        if (found) { return true; }
        // Collapsed-selection fallback.
        if (from === to) {
            const $pos: ResolvedPos = pmState.doc.resolve(from);
            for (let d: number = $pos.depth; d >= 0; d--) {
                const ancestor: PMNode = $pos.node(d);
                if (ancestor.type === paraType) { continue; }
                if (PROTECTED_BLOCK_TYPES.has(ancestor.type.name)) { continue; }
                return true;
            }
        }
        return false;
    },

    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        const tr: PMTransaction = pmState.tr;
        normalizeBlocksToParagraph(tr, pmState.schema, pmState);
        if (tr.docChanged) {
            ctx.dispatch(wrapTransaction(tr));
        }
    }
};
