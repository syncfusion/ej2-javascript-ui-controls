/**
 * join-list-backward.ts — Internal infrastructure command: merge a top-level
 * textblock (paragraph or heading) sitting directly before a list into the
 * last item of that list when Backspace is pressed at the start of the
 * textblock.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import {
    PMFragment,
    PMResolvedPos,
    PMEditorState,
    PMNode,
    PMTransaction,
    TextSelection
} from '../../../pm/pm-guard';

/** Node type names treated as list wrappers. */
const LIST_WRAPPER_NAMES: readonly string[] = ['bulletList', 'orderedList', 'taskList'];

/** Node type names treated as list items. */
const LIST_ITEM_NAMES: readonly string[] = ['listItem', 'taskItem'];

/**
 * Whether `block` is a supported source for the backward join: a textblock
 * whose type the given list item accepts as its content. The item content
 * model `(paragraph | heading) block*` only matches paragraph/heading at
 * the first-child position, so this is schema-driven rather than a
 * hard-coded block-name check.
 *
 * @param {PMNode} block - The candidate source block (the cursor's parent).
 * @param {PMNode} itemNode - The last list item of the previous list.
 * @returns {boolean} True when the block may join into the item's content.
 */
function isSupportedSourceBlock(block: PMNode, itemNode: PMNode): boolean {
    if (!block.isTextblock) { return false; }
    return itemNode.type.contentMatch.matchType(block.type) !== null;
}

/**
 * Whether the cursor sits at the very start of its parent textblock.
 *
 * @param {PMResolvedPos} $pos - The resolved cursor position.
 * @returns {boolean} True when parent offset is 0.
 */
function isAtStartOfTextblock($pos: PMResolvedPos): boolean {
    return $pos.parentOffset === 0;
}

/**
 * Locate the list wrapper immediately before the cursor.
 *
 * Returns the wrapper's absolute position and node when the cursor is at
 * the start of a top-level paragraph or heading (the supported source
 * blocks) whose previous sibling is a list wrapper. Returns null otherwise.
 *
 * @param {PMEditorState} pmState - The current ProseMirror editor state.
 * @returns {{ wrapperPos: number, wrapperNode: PMNode } | null} The previous list's position and node, or null.
 */
function findPreviousListWrapper(pmState: PMEditorState): { wrapperPos: number; wrapperNode: PMNode } | null {
    const { $from } = pmState.selection;
    if ($from.parent.type.name !== 'paragraph' && $from.parent.type.name !== 'heading') { return null; }
    // Get the immediate container that owns the current block node.
    // This works regardless of whether the block is at the document level or nested within another structure.
    const containerDepth: number = $from.depth - 1;
    const parent: PMNode = $from.node(containerDepth);
    const indexInParent: number = $from.index(containerDepth);
    // There must be a preceding sibling to inspect.
    if (indexInParent <= 0) {
        return null;
    }
    // Use the parent's child list directly — `doc.nodeAt` returns null at
    // token boundaries, which is where the previous block's close token
    // lives.
    const previousNode: PMNode | null = parent.maybeChild(indexInParent - 1);
    if (!previousNode) { return null; }
    if (LIST_WRAPPER_NAMES.indexOf(previousNode.type.name) === -1) { return null; }

    // Calculate the absolute document position of the previous node.
    // Start at the container's content position and advance through all
    // siblings that appear before the target node.
    const containerStart: number = $from.start(containerDepth);
    let wrapperPos: number = containerStart;
    for (let i: number = 0; i < indexInParent - 1; i++) {
        const child: PMNode | null = parent.maybeChild(i);
        if (!child) { return null; }
        wrapperPos += child.nodeSize;
    }

    return { wrapperPos, wrapperNode: previousNode };
}

/**
 * Descend into a list wrapper and return the position of the last
 * `listItem` / `taskItem` inside it. Returns null if the wrapper has
 * no matching items.
 *
 * @param {PMEditorState} _pmState - The current PM state (kept for signature symmetry; unused).
 * @param {number} wrapperPos - Absolute document position of the wrapper's open token.
 * @param {PMNode} wrapperNode - The wrapper node itself.
 * @returns {{ itemPos: number, itemNode: PMNode } | null} The last item's absolute start position and node.
 */
function findLastListItem(
    _pmState: PMEditorState,
    wrapperPos: number,
    wrapperNode: PMNode
): { itemPos: number; itemNode: PMNode } | null {
    let lastMatch: { itemPos: number; itemNode: PMNode } | null = null;
    wrapperNode.descendants((node: PMNode, relPos: number): boolean => {
        if (LIST_ITEM_NAMES.indexOf(node.type.name) !== -1) {
            lastMatch = { itemPos: wrapperPos + 1 + relPos, itemNode: node };
        }
        return true;
    });
    return lastMatch;
}

export const joinListBackwardCommand: PMCommandInternal<void> = {
    name: 'joinListBackward',
    meta: { label: 'Merge Block Into Previous List', category: 'list' },

    /**
     * Whether the command can run. True only when the cursor is collapsed
     * at the start of a supported textblock (paragraph or heading) whose
     * previous sibling is a list wrapper that contains at least one list
     * item.
     *
     * @param {PMCommandContext} ctx - The internal command context.
     * @returns {boolean} True when the command may execute.
     */
    canExecute(ctx: PMCommandContext): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const { $from } = pmState.selection;
        if (pmState.selection.from !== pmState.selection.to) { return false; }
        if (!isAtStartOfTextblock($from)) { return false; }

        const wrapper: ReturnType<typeof findPreviousListWrapper> = findPreviousListWrapper(pmState);
        if (!wrapper) { return false; }

        const lastItem: ReturnType<typeof findLastListItem> = findLastListItem(pmState, wrapper.wrapperPos, wrapper.wrapperNode);
        if (!lastItem) { return false; }

        return isSupportedSourceBlock($from.parent, lastItem.itemNode);
    },

    /**
     * Consume the orphan textblock in front of the list. If the source
     * block is empty, just delete it and place the cursor at the end of
     * the last item. If it has content, splice the inline content into
     * the last item's last textblock so a single Backspace merges both.
     * When the last child is not a textblock, move the source block
     * itself into the item as its new last child.
     *
     * @param {PMCommandContext} ctx - The internal command context.
     * @returns {void} Nothing — the resulting tr is dispatched via ctx.
     */
    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        const wrapper: ReturnType<typeof findPreviousListWrapper> = findPreviousListWrapper(pmState);
        if (!wrapper) { return; }

        const lastItem: ReturnType<typeof findLastListItem> = findLastListItem(pmState, wrapper.wrapperPos, wrapper.wrapperNode);
        if (!lastItem) { return; }

        const { $from } = pmState.selection;
        if (!isSupportedSourceBlock($from.parent, lastItem.itemNode)) { return; }

        const sourceStart: number = $from.before($from.depth);
        const sourceEnd: number = sourceStart + $from.parent.nodeSize;
        const orphan: PMNode = $from.parent;

        // Position at the end of the last item's content (just before
        // its closing token).
        const lastItemContentEnd: number = lastItem.itemPos + lastItem.itemNode.nodeSize - 1;
        const tr: PMTransaction = pmState.tr;

        if (orphan.content.size === 0) {
            // Empty source block — delete it and place cursor at the end
            // of the last textblock inside the last list item.
            tr.delete(sourceStart, sourceEnd);
            const safePos: number = Math.max(
                1,
                Math.min(lastItemContentEnd - 1, tr.doc.content.size)
            );
            tr.setSelection(
                TextSelection.create(tr.doc, safePos, safePos)
            );
        } else {
            // Non-empty source block — inspect the last child of the
            // last item: textblocks take an inline-content splice; any
            // other block receives the whole source block unchanged.
            tr.delete(sourceStart, sourceEnd);

            const $end: PMResolvedPos = tr.doc.resolve(lastItemContentEnd);
            const lastItemNode: PMNode = $end.parent;
            const lastChild: PMNode | null | undefined = lastItemNode.lastChild;
            if (lastChild && lastChild.isTextblock) {
                // End of the last textblock's content inside the item.
                const lastChildContentEnd: number = lastItemContentEnd - 1;
                tr.insert(lastChildContentEnd, orphan.content);
                const boundary: number = Math.min(lastChildContentEnd, tr.doc.content.size);
                tr.setSelection(TextSelection.create(tr.doc, Math.max(1, boundary), Math.max(1, boundary)));
            } else {
                // Last child is not a textblock — move the source block
                // itself as the item's new last child. The splice below
                // re-inserts it before the item's closing token; it stays
                // below any non-textblock children, satisfying the `block*`
                // tail of the item's content expression.
                tr.insert(lastItemContentEnd, PMFragment.from(orphan));
                const insertPos: number = Math.min(lastItemContentEnd + 1, tr.doc.content.size);
                tr.setSelection(TextSelection.create(tr.doc, Math.max(1, insertPos), Math.max(1, insertPos)));
            }
        }

        ctx.dispatch(wrapTransaction(tr));
    }
};
