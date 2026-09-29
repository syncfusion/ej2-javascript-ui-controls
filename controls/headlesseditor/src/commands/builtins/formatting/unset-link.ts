/**
 * unsetLink — removes the link mark while preserving text.
 * Delegates to ProseMirror's toggleMark with `removeWhenPresent: true`.
 */

import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMMarkType, PMCommand, PMEditorState, pmToggleMark, PMMark, PMTransaction } from '../../../pm/pm-guard';

export const unsetLinkCommand: PMCommandInternal<void> = {
    name: 'unsetLink',
    meta: { label: 'Unset Link', category: 'formatting' },

    canExecute(ctx: PMCommandContext): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const { from, empty } = pmState.selection;
        // When text is selected, the command always works — PM removes
        // the link from any part of the range that has one.
        if (!empty) {
            return true;
        }
        // Cursor only (no selection): only allow if a link already exists
        // at the cursor position, otherwise there is nothing to remove.
        const linkMark: PMMarkType | undefined = pmState.schema.marks.link;
        if (!linkMark) {
            return false;
        }
        return pmState.doc.resolve(from).marks().some((mark: PMMark) => mark.type === linkMark);
    },

    execute(ctx: PMCommandContext): void {
        const pmState: PMEditorState = ctx.pmState;
        const markType: PMMarkType | undefined = pmState.schema.marks.link;
        // If the schema has no link mark, there is nothing to remove.
        if (!markType) {
            return;
        }
        const { from, empty } = pmState.selection;
        if (empty) {
            // A collapsed cursor has no range for toggleMark to remove the link
            const $from: ReturnType<PMEditorState['doc']['resolve']> = pmState.doc.resolve(from);
            const parent: typeof $from.parent = $from.parent;
            const index: number = $from.index();
            // Calculate the linked node's offset within the parent.
            // The linked text may not be the first child.
            let childOffset: number = 0;
            // Add the size of all preceding children to get the linked node's
            // actual position within the document.
            for (let i: number = 0; i < index; i++) {
                childOffset += parent.child(i).nodeSize;
            }
            const node: ReturnType<typeof parent.child> = parent.child(index);
            if (!node.isText || !markType.isInSet(node.marks)) {
                return;
            }
            let start: number = $from.start() + childOffset;
            let end: number = start + node.nodeSize;
            // Extend the range to include adjacent nodes that have the same link mark.
            // Stop as soon as a node without the link mark is found.
            for (let i: number = index - 1; i >= 0; i--) {
                const child: ReturnType<typeof parent.child> = parent.child(i);
                if (!markType.isInSet(child.marks)) {
                    break;
                }
                start -= child.nodeSize;
            }
            // Extend the range to the right for adjacent nodes with the same link mark.
            // This ensures the entire linked text is unlinked, not just the node at the cursor.
            for (let i: number = index + 1; i < parent.childCount; i++) {
                const child: ReturnType<typeof parent.child> = parent.child(i);
                if (!markType.isInSet(child.marks)) {
                    break;
                }
                end += child.nodeSize;
            }
            ctx.dispatch(
                wrapTransaction(
                    pmState.tr.removeMark(start, end, markType)
                )
            );
            return;
        }
        // Existing behavior for selected text.
        const command: PMCommand = pmToggleMark(
            markType,
            null,
            { removeWhenPresent: true }
        );
        command(pmState, (transaction: PMTransaction) => {
            ctx.dispatch(wrapTransaction(transaction));
        });
    }
};
