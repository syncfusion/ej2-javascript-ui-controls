/**
 * merge-collapsible-forward.ts — Merge a collapsible with the next block.
 *
 * Handles merging when Delete is pressed at the end of a collapsible.
 * Takes the first content from the next sibling block and appends it to the
 * collapsible's body, preserving the collapsible structure.
 *
 * Scenarios:
 * - Next block is a paragraph: move content into body, delete next block
 * - Next block is another collapsible: move its body content into this body
 * - Next block is a heading: move text into body, delete next block
 * - No next block: no-op (allow fallthrough)
 * - Cursor not at end: no-op (allow fallthrough)
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */

import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMNode, PMFragment, PMResolvedPos, PMTransaction, PMSchema, TextSelection } from '../../../pm/pm-guard';

import { findCollapsibleAncestorPos, getBodyNode, getHeaderNode, isInsideHeader } from './collapsible-helpers';

// Merges the collapsible forward with the next sibling block.
// The next block is appended to this collapsible's body as a whole node
// (or as the next collapsible's flattened content when applicable).

function performForwardMerge(state: PMEditorState, ctx: PMCommandContext): void {
    const collapsiblePos: number = findCollapsibleAncestorPos(state);
    if (collapsiblePos === -1) {
        return;
    }
    const collapsibleNode: PMNode | null = state.doc.nodeAt(collapsiblePos);
    if (!collapsibleNode) {
        return;
    }
    const $collapsible: PMResolvedPos = state.doc.resolve(collapsiblePos);
    const parent: PMNode = $collapsible.depth === 0 ? $collapsible.node(0) : $collapsible.parent;
    const index: number = $collapsible.depth === 0 ? $collapsible.index(0) : $collapsible.index();
    if (index >= parent.childCount - 1) {
        return;
    }
    const nextNode: PMNode = parent.child(index + 1);
    if (!nextNode) {
        return;
    }
    if (nextNode.type.name !== 'paragraph' &&
        nextNode.type.name !== 'heading' &&
        nextNode.type.name !== 'collapsible') {
        return;
    }
    const bodyNode: PMNode | null = getBodyNode(collapsibleNode);
    if (!bodyNode) {
        return;
    }
    const schema: PMSchema = state.schema;
    const nextNodePos: number = collapsiblePos + collapsibleNode.nodeSize;
    let contentToAppend: PMFragment;
    if (nextNode.type.name === 'collapsible') {
        const nextBodyNode: PMNode | null = getBodyNode(nextNode);
        const nextHeaderNode: PMNode | null = getHeaderNode(nextNode);
        if (!nextBodyNode || !nextHeaderNode) {
            return;
        }
        // For an adjacent collapsible, inline the next header trigger
        // text and append its body block-children.
        contentToAppend = nextHeaderNode.content
            .append(nextBodyNode.content);
    } else {
        // For a normal paragraph/heading sibling, append the WHOLE block
        // (a single block child) so it lands inside collapsibleBody.
        contentToAppend = PMFragment.from(nextNode);
    }
    const newBodyContent: PMFragment = bodyNode.content.append(contentToAppend);
    const newBodyNode: PMNode = schema.nodes['collapsibleBody'].create(null, newBodyContent);
    const headerNode: PMNode | null = getHeaderNode(collapsibleNode);
    const newCollapsibleNode: PMNode = schema.nodes['collapsible'].create(
        collapsibleNode.attrs,
        [headerNode, newBodyNode]
    );
    const tr: PMTransaction = state.tr;
    // Replace the current collapsible and the next sibling with the merged one.
    tr.replaceWith(
        collapsiblePos,
        nextNodePos + nextNode.nodeSize,
        newCollapsibleNode
    );
    // Cursor at the start of the newly appended block (for normal siblings)
    // or at the join boundary (for adjacent collapsibles).
    const cursorPos: number = collapsiblePos + 1 + headerNode.nodeSize + 1 + bodyNode.content.size;
    tr.setSelection(TextSelection.near(tr.doc.resolve(cursorPos)));
    ctx.dispatch(wrapTransaction(tr));
}

export const mergeCollapsibleForwardCommand: PMCommandInternal<void> = {
    name: 'mergeCollapsibleForward',
    meta: { label: 'Merge Collapsible Forward', category: 'structure' },
    canExecute(ctx: PMCommandContext): boolean {
        if (isInsideHeader(ctx.pmState)) {
            return false;
        }
        const collapsiblePos: number = findCollapsibleAncestorPos(ctx.pmState);
        if (collapsiblePos === -1) {
            return false;
        }
        const collapsibleNode: PMNode | null = ctx.pmState.doc.nodeAt(collapsiblePos);
        if (!collapsibleNode) {
            return false;
        }
        const { $from } = ctx.pmState.selection;
        const collapsibleEnd: number = collapsiblePos + collapsibleNode.nodeSize;
        if ($from.pos !== collapsibleEnd - 1) {
            return false;
        }
        const $collapsible: PMResolvedPos = ctx.pmState.doc.resolve(collapsiblePos);
        const parent: PMNode = $collapsible.depth === 0 ? $collapsible.node(0) : $collapsible.parent;
        const index: number = $collapsible.depth === 0 ? $collapsible.index(0) : $collapsible.index();
        if (index >= parent.childCount - 1) {
            return false;
        }
        const nextNode: PMNode = parent.child(index + 1);
        return nextNode.type.name === 'paragraph'
            || nextNode.type.name === 'heading'
            || nextNode.type.name === 'collapsible';
    },
    execute(ctx: PMCommandContext): void {
        performForwardMerge(ctx.pmState, ctx);
    }
};
