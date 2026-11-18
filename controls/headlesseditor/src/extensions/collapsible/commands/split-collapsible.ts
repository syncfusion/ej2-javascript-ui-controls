/**
 * split-collapsible.ts — Split a collapsible at the cursor position within the header.
 *
 * When the cursor is in the middle of a collapsible header:
 * - Creates two collapsible blocks
 * - First collapsible gets header text before cursor + empty body
 * - Second collapsible gets header text after cursor + original body content
 * - Cursor moves to the start of the second collapsible's body
 *
 * Both resulting collapsibles inherit the original collapsed state.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */

import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNode, PMNodeType, PMFragment, PMSchema, TextSelection } from '../../../pm/pm-guard';
import { findCollapsibleHeaderAncestorPos, findCollapsibleAncestorPos, getHeaderNode, getBodyNode } from './collapsible-helpers';
/**
 * Splits a collapsible node at the cursor position within the header.
 *
 * Returns the position of the newly created second collapsible's body start,
 * so the caller can position the cursor there.
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @param {PMCommandContext} ctx - Command execution context.
 * @returns {number} Position to move cursor to, or -1 on failure.
 */
function performCollapsibleSplit(pmState: PMEditorState, ctx: PMCommandContext): number {
    const schema: PMSchema = pmState.schema;
    const collapsibleType: PMNodeType = schema.nodes['collapsible'];
    const collapsibleHeaderType: PMNodeType = schema.nodes['collapsibleHeader'];
    const collapsibleBodyType: PMNodeType = schema.nodes['collapsibleBody'];
    const paragraphType: PMNodeType = schema.nodes['paragraph'];
    const triggerType: PMNodeType = schema.nodes['heading'] || schema.nodes['paragraph'];
    if (!collapsibleType || !collapsibleHeaderType || !collapsibleBodyType || !paragraphType || !triggerType) {
        return -1;
    }
    const { $from, $to } = pmState.selection;
    const collapsiblePos: number = findCollapsibleAncestorPos(pmState);
    if (collapsiblePos === -1) {
        return -1;
    }
    const collapsibleNode: PMNode | null = pmState.doc.nodeAt(collapsiblePos);
    if (!collapsibleNode) {
        return -1;
    }
    const headerNode: PMNode | null = getHeaderNode(collapsibleNode);
    const bodyNode: PMNode | null = getBodyNode(collapsibleNode);
    if (!headerNode || !bodyNode) {
        return -1;
    }
    const triggerNode: PMNode = headerNode.child(0);
    if (!triggerNode) {
        return -1;
    }
    // Calculate the offset within the header trigger's content where we split
    const headerPosInDoc: number = collapsiblePos + 2; // collapsible open + header open
    const triggerPosInDoc: number = headerPosInDoc + 1; // trigger open
    const cursorOffsetInTrigger: number = $from.pos - triggerPosInDoc;
    // Split the trigger node's content at cursor position
    const triggerContent: PMFragment = triggerNode.content;
    const beforeCursorContent: PMFragment = triggerContent.cut(0, Math.max(0, cursorOffsetInTrigger));
    const afterCursorContent: PMFragment = triggerContent.cut(cursorOffsetInTrigger);
    // Build first collapsible (before cursor content)
    const firstTriggerNode: PMNode = triggerNode.type.create(triggerNode.attrs, beforeCursorContent);
    const firstHeaderNode: PMNode = collapsibleHeaderType.create(null, [firstTriggerNode]);
    const firstBodyParagraph: PMNode = paragraphType.create();
    const firstBodyNode: PMNode = collapsibleBodyType.create(null, [firstBodyParagraph]);
    const firstCollapsibleNode: PMNode = collapsibleType.create(
        { collapsed: collapsibleNode.attrs['collapsed'] },
        [firstHeaderNode, firstBodyNode]
    );
    // Build second collapsible (after cursor content + original body)
    const secondTriggerNode: PMNode = triggerNode.type.create(triggerNode.attrs, afterCursorContent);
    const secondHeaderNode: PMNode = collapsibleHeaderType.create(null, [secondTriggerNode]);
    const secondCollapsibleNode: PMNode = collapsibleType.create(
        {
            collapsed: collapsibleNode.attrs['collapsed']
        }, [secondHeaderNode, bodyNode]);
    const from: number = collapsiblePos;
    const to: number = collapsiblePos + collapsibleNode.nodeSize;
    const tr: PMTransaction = pmState.tr.replaceWith(from, to, [firstCollapsibleNode, secondCollapsibleNode]);
    const secondCollapsibleStart: number = from + firstCollapsibleNode.nodeSize;
    const triggerStartInDoc: number = secondCollapsibleStart + 1 + 1 + 1;
    tr.setSelection(TextSelection.near(tr.doc.resolve(triggerStartInDoc)));
    ctx.dispatch(wrapTransaction(tr));
    return triggerStartInDoc;
}
export const splitCollapsibleCommand: PMCommandInternal<void> = {
    name: 'splitCollapsible',
    meta: { label: 'Split Collapsible', category: 'structure' },
    canExecute(ctx: PMCommandContext): boolean {
        // Can execute if cursor is inside a collapsible header
        // AND the header content is not empty (something to split)
        if (findCollapsibleHeaderAncestorPos(ctx.pmState) === -1) {
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
        const headerNode: PMNode | null = getHeaderNode(collapsibleNode);
        if (!headerNode || headerNode.textContent.trim().length === 0) {
            return false;
        }
        const { $from, $to } = ctx.pmState.selection;
        if ($from.pos === $to.pos) {
            const headerContentStart: number = collapsiblePos + 3; // collapsible open + header open + trigger open
            const headerContentEnd: number = collapsiblePos + 1 + headerNode.nodeSize; // before header close
            // Don't split if at absolute start or end
            if ($from.pos <= headerContentStart || $from.pos >= headerContentEnd) {
                return false;
            }
            return true;
        }
        return false;
    },
    execute(ctx: PMCommandContext): void {
        performCollapsibleSplit(ctx.pmState, ctx);
    }
};
