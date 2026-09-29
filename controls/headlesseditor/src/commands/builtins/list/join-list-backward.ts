/**
 * join-list-backward.ts — Internal infrastructure command: merge a top-level
 * paragraph sitting directly before a list into the last item of that
 * list when Backspace is pressed at the start of the paragraph.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
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
 * Locate the list wrapper immediately before the cursor.
 *
 * Returns the wrapper's absolute position and node when the cursor is at
 * the start of a top-level paragraph whose previous sibling is a list
 * wrapper. Returns null otherwise.
 *
 * @param {PMEditorState} pmState - The current ProseMirror editor state.
 * @returns {{ wrapperPos: number, wrapperNode: PMNode } | null} The previous list's position and node, or null.
 */
function findPreviousListWrapper(pmState: PMEditorState): { wrapperPos: number; wrapperNode: PMNode } | null {
    const { $from } = pmState.selection;
    if ($from.depth !== 1) { return null; }
    if ($from.parent.type.name !== 'paragraph') { return null; }

    const parent: PMNode = $from.node(0);
    const indexInDoc: number = $from.index(0);
    if (indexInDoc <= 0) { return null; }

    // Use the parent's child list directly — `doc.nodeAt` returns null at
    // token boundaries, which is where the previous block's close token
    // lives.
    const previousNode: PMNode | null = parent.maybeChild(indexInDoc - 1);
    if (!previousNode) { return null; }
    if (LIST_WRAPPER_NAMES.indexOf(previousNode.type.name) === -1) { return null; }

    // Absolute position of the previous block's open token: sum of the
    // nodeSize of all preceding children.
    let wrapperPos: number = 0;
    for (let i: number = 0; i < indexInDoc - 1; i++) {
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

/**
 * Whether the cursor sits at the very start of its parent paragraph.
 *
 * @param {PMResolvedPos} $pos - The resolved cursor position.
 * @returns {boolean} True when parent offset is 0.
 */
function isAtStartOfParagraph($pos: PMResolvedPos): boolean {
    return $pos.parentOffset === 0;
}

export const joinListBackwardCommand: PMCommandInternal<void> = {
    name: 'joinListBackward',
    meta: { label: 'Merge Paragraph Into Previous List', category: 'list' },

    /**
     * Whether the command can run. True only when the cursor is collapsed
     * at the start of a paragraph whose previous sibling is a list wrapper
     * that contains at least one list item.
     *
     * @param {PMCommandContext} ctx - The internal command context.
     * @returns {boolean} True when the command may execute.
     */
    canExecute(ctx: PMCommandContext): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const { $from } = pmState.selection;
        if (pmState.selection.from !== pmState.selection.to) { return false; }
        if (!isAtStartOfParagraph($from)) { return false; }

        const wrapper: ReturnType<typeof findPreviousListWrapper> = findPreviousListWrapper(pmState);
        if (!wrapper) { return false; }

        return findLastListItem(pmState, wrapper.wrapperPos, wrapper.wrapperNode) !== null;
    },

    /**
     * Consume the orphan paragraph in front of the list. If the paragraph
     * is empty, just delete it and place the cursor at the end of the
     * last item. If it has content, splice the content into the last
     * item's last textblock so a single Backspace merges both items.
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
        const paragraphStart: number = $from.before($from.depth);
        const paragraphEnd: number = paragraphStart + $from.parent.nodeSize;
        const orphan: PMNode = $from.parent;

        // Position at the end of the last item's content (just before
        // its closing token).
        const lastItemContentEnd: number = lastItem.itemPos + lastItem.itemNode.nodeSize - 1;
        const tr: PMTransaction = pmState.tr;

        if (orphan.content.size === 0) {
            // Empty paragraph — delete it and place cursor at the end
            // of the last paragraph inside the last list item.
            tr.delete(paragraphStart, paragraphEnd);
            const safePos: number = Math.max(
                1,
                Math.min(lastItemContentEnd - 1, tr.doc.content.size)
            );
            tr.setSelection(
                TextSelection.create(tr.doc, safePos, safePos)
            );
        } else {
            // Non-empty paragraph — splice its inline content into the
            // last item's last textblock. Cursor lands at the splice
            // boundary.
            const inlineFragment: PMFragment = orphan.content;
            tr.delete(paragraphStart, paragraphEnd);

            const $end: PMResolvedPos = tr.doc.resolve(lastItemContentEnd);
            const lastItemNode: PMNode = $end.parent;
            const lastChild: PMNode | null | undefined = lastItemNode.lastChild;
            if (lastChild && lastChild.isTextblock) {
                // End of the last paragraph's content inside the listItem.
                const lastParaContentEnd: number = lastItemContentEnd - 1;
                tr.insert(lastParaContentEnd, inlineFragment);
                const boundary: number = Math.min(lastParaContentEnd, tr.doc.content.size);
                tr.setSelection(TextSelection.create(tr.doc, Math.max(1, boundary), Math.max(1, boundary)));
            } else {
                // Fallback: append a new paragraph with the orphan's
                // content at the end of the last item.
                const newPara: PMNode = orphan.copy(inlineFragment);
                tr.insert(lastItemContentEnd, PMFragment.from(newPara));
                const paraStart: number = Math.min(lastItemContentEnd + 1, tr.doc.content.size);
                tr.setSelection(TextSelection.create(tr.doc, Math.max(1, paraStart), Math.max(1, paraStart)));
            }
        }

        ctx.dispatch(wrapTransaction(tr));
    }
};
