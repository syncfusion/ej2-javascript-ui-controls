/**
 * delete-list-item.ts — Internal infrastructure command: collapse the next
 * listItem (or list wrapper) into the current listItem when Delete is
 * pressed at the end of a list item. The next item's first textblock
 * merges inline; its remaining children move into the current item.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import {
    PMEditorState,
    PMFragment,
    PMNode,
    PMResolvedPos,
    PMTransaction,
    TextSelection
} from '../../../pm/pm-guard';

/** Node type names treated as list items. */
const LIST_ITEM_TYPE_NAMES: ReadonlySet<string> = new Set<string>(['listItem', 'taskItem']);

/** Node type names treated as list wrappers. */
const LIST_WRAPPER_NAMES: ReadonlySet<string> = new Set<string>(['bulletList', 'orderedList', 'taskList']);

/**
 * Resolve the list item node depth at the current cursor position.
 *
 * Walks up the selection depth to find the nearest `listItem` or `taskItem`
 * ancestor and returns its depth. Returns -1 when no such ancestor exists.
 *
 * @param {PMResolvedPos} $from - The cursor's resolved from position.
 * @returns {number} Depth of the nearest listItem ancestor, or -1.
 */
function getListItemDepth($from: PMResolvedPos): number {
    for (let d: number = $from.depth; d >= 0; d--) {
        if (LIST_ITEM_TYPE_NAMES.has($from.node(d).type.name)) { return d; }
    }
    return -1;
}

/**
 * Whether the cursor sits at the very end of its parent textblock.
 *
 * @param {PMEditorState} pmState - The current ProseMirror editor state.
 * @returns {boolean} True when the cursor is at the end of the parent.
 */
function isAtEndOfParent(pmState: PMEditorState): boolean {
    const { $from } = pmState.selection;
    return $from.parentOffset === $from.parent.content.size;
}

/**
 * Splice the next listItem's first textblock into the current listItem's
 * last textblock, move the next item's remaining children into the current
 * item, and delete the next listItem — all in a single transaction.
 *
 * Multi-child items keep their extra blocks: merging
 * `[p("first")]` with `[p("split"), table]` produces
 * `[p("firstsplit"), table]`. The `block*` tail of the item content model
 * accepts the moved children directly.
 *
 * Returns the merge boundary position for cursor placement, or null when
 * the merge cannot apply (cursor not in the item's last textblock, next
 * item's first child not a textblock, or schema-incompatible content).
 *
 * @param {PMTransaction} tr - The PM transaction to mutate.
 * @param {PMNode} currentListItem - The listItem that absorbs the next item.
 * @param {PMNode} cursorTextblock - The textblock holding the cursor (must
 * be the current item's last child).
 * @param {PMNode} nextListItem - The listItem that is consumed.
 * @param {number} nextItemStart - Absolute document position of nextListItem's open token.
 * @returns {number | null} The merge boundary position, or null on failure.
 */
function mergeListItems(
    tr: PMTransaction,
    currentListItem: PMNode,
    cursorTextblock: PMNode,
    nextListItem: PMNode,
    nextItemStart: number
): number | null {
    const currentLastChild: PMNode | null | undefined = currentListItem.lastChild;
    const nextFirstChild: PMNode | null | undefined = nextListItem.firstChild;
    if (!currentLastChild || !nextFirstChild) { return null; }
    // Only merge across the item boundary when the cursor sits at the end
    // of the current item's LAST child. A mid-item cursor (e.g. the first
    // paragraph of `[paragraph, table]`) keeps its default Delete
    // behavior instead of pulling the next item in.
    if (currentLastChild !== cursorTextblock) { return null; }
    if (!currentLastChild.isTextblock || !nextFirstChild.isTextblock) { return null; }

    // Validate the inline splice against the target textblock's content
    // BEFORE mutating anything — a schema-incompatible fragment must not
    // delete the next item without merging its text.
    const spliceMatch: ReturnType<PMNode['contentMatchAt']> = currentLastChild.contentMatchAt(currentLastChild.childCount);
    let contentCompatible: boolean = spliceMatch !== null && spliceMatch.matchFragment(nextFirstChild.content) !== null;
    nextFirstChild.content.forEach((node: PMNode): boolean => {
        if (!currentLastChild.type.allowsMarks(node.marks)) { contentCompatible = false; }
        return contentCompatible;
    });
    if (!contentCompatible) { return null; }

    // The current item's last textblock content ends exactly two tokens
    // before the next item's open token:
    //   ... T-content-end | T close | item close | next item open ...
    const mergeBoundary: number = nextItemStart - 2;

    // Capture the next item's tail children (everything after its first
    // child) before deleting it — they move into the current item.
    const tailChildren: PMNode[] = [];
    nextListItem.forEach((child: PMNode, _offset: number, index: number): void => {
        if (index > 0) { tailChildren.push(child); }
    });

    // Delete the next listItem first so positions before it stay valid.
    tr.delete(nextItemStart, nextItemStart + nextListItem.nodeSize);

    // Splice the first child's inline content at the boundary.
    tr.insert(mergeBoundary, nextFirstChild.content);

    // Move the tail children into the current item, right after the
    // merged textblock (the splice above shifts the item's content end).
    if (tailChildren.length > 0) {
        const tailInsertPos: number = nextItemStart - 1 + nextFirstChild.content.size;
        tr.insert(tailInsertPos, PMFragment.from(tailChildren));
    }

    return mergeBoundary;
}

export const deleteListItemCommand: PMCommandInternal<void> = {
    name: 'deleteListItem',
    meta: { label: 'Delete From List Item', category: 'list' },

    /**
     * Whether the command can run. True only when the cursor is collapsed
     * at the end of a list item.
     *
     * @param {PMCommandContext} ctx - The internal command context.
     * @returns {boolean} True when the command may execute.
     */
    canExecute(ctx: PMCommandContext): boolean {
        const pmState: PMEditorState = ctx.pmState;
        if (pmState.selection.from !== pmState.selection.to) { return false; }
        if (getListItemDepth(pmState.selection.$from) === -1) { return false; }
        if (!isAtEndOfParent(pmState)) { return false; }
        return true;
    },

    /**
     * Collapse the next listItem (or list wrapper) into the current
     * listItem in a single transaction. Cursor lands at the merge
     * boundary between the two items' text.
     *
     * @param {PMCommandContext} ctx - The internal command context.
     * @returns {void} Nothing — the resulting tr is dispatched via ctx.
     */
    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        if (pmState.selection.from !== pmState.selection.to) { return; }
        const itemDepth: number = getListItemDepth(pmState.selection.$from);
        if (itemDepth === -1) { return; }
        if (!isAtEndOfParent(pmState)) { return; }

        const $from: PMResolvedPos = pmState.selection.$from;
        const itemEnd: number = $from.after(itemDepth);
        const after: PMNode | null = pmState.doc.nodeAt(itemEnd);
        if (!after) { return; }

        const tr: PMTransaction = pmState.tr;
        const currentListItem: PMNode = $from.node(itemDepth);
        const cursorTextblock: PMNode = $from.parent;

        // Case A — next block is a sibling listItem. Merge it into the
        // current item in a single transaction.
        if (LIST_ITEM_TYPE_NAMES.has(after.type.name)) {
            const boundary: number | null = mergeListItems(tr, currentListItem, cursorTextblock, after, itemEnd);
            if (boundary !== null) {
                const cursorAt: number = Math.max(1, Math.min(boundary, tr.doc.content.size));
                tr.setSelection(TextSelection.create(tr.doc, cursorAt));
                ctx.dispatch(wrapTransaction(tr));
            }
            return;
        }

        // Case B — next block is a list wrapper. Unwrap it, then merge
        // its first item into the current item.
        if (LIST_WRAPPER_NAMES.has(after.type.name)) {
            const listStart: number = itemEnd;
            const listEnd: number = listStart + after.nodeSize;
            tr.replaceWith(listStart, listEnd, PMFragment.from(after.content));
            const newFirst: PMNode | null = tr.doc.nodeAt(listStart);
            let boundary: number | null = null;
            if (newFirst && LIST_ITEM_TYPE_NAMES.has(newFirst.type.name)) {
                boundary = mergeListItems(tr, currentListItem, cursorTextblock, newFirst, listStart);
            }
            const cursorAt: number = Math.max(
                1,
                Math.min(boundary ?? itemEnd, tr.doc.content.size)
            );
            tr.setSelection(TextSelection.create(tr.doc, cursorAt));
            ctx.dispatch(wrapTransaction(tr));
            return;
        }

        // Case C — no dispatch; the keymap falls through to the base keymap.
    }
};
