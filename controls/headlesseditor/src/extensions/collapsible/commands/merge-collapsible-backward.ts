/**
 * merge-collapsible-backward.ts — Merge a collapsible with the previous block.
 *
 * Handles merging when backspace is pressed at the start of a collapsible header.
 * Takes the last content from the previous sibling block and merges it with the
 * collapsible's header, preserving the collapsible structure.
 *
 * Scenarios:
 * - Previous block is a paragraph: merge text into header, delete previous block
 * - Previous block is another collapsible: move header content to previous body (not merge structures)
 * - Previous block is a heading: merge text into header, delete previous block
 * - No previous block: no-op (allow fallthrough)
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */

import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMNode, PMFragment, PMResolvedPos, PMTransaction, PMSchema, TextSelection } from '../../../pm/pm-guard';
import {
    findCollapsibleAncestorPos,
    getBodyNode,
    getHeaderNode,
    isCollapsibleCollapsed,
    isCollapsibleExpanded,
    isInsideHeader,
    isInsideBody
} from './collapsible-helpers';

/**
 * Locate the "active block" we consider the subject of a backspace merger.
 * Two scenarios:
 *   A. cursor is inside a collapsible header (caller is backspacing at
 *      header start) → active = the collapsible node.
 *   B. cursor is at the start of a normal block whose previous sibling is a
 *      collapsible → active = current block, prev = collapsible.
 */
interface MergeContext {
    collapsiblePos: number;
    collapsibleNode: PMNode;
    prevNodePos: number;
    prevNode: PMNode;
}

function resolveMergeContext(state: PMEditorState): MergeContext | null {
    const { $from } = state.selection;
    // Scenario A: cursor inside collapsible header.
    if (isInsideHeader(state)) {
        const collapsiblePos: number = findCollapsibleAncestorPos(state);
        if (collapsiblePos === -1) {
            return null;
        }
        const collapsibleNode: PMNode | null = state.doc.nodeAt(collapsiblePos);
        if (!collapsibleNode) {
            return null;
        }
        const $resolved: PMResolvedPos = state.doc.resolve(collapsiblePos);
        if ($resolved.depth === 0) {
            return null;
        }
        const parent: PMNode = $resolved.parent;
        const index: number = $resolved.index();
        if (index === 0) {
            return null;
        }
        const prevNode: PMNode = parent.child(index - 1);
        const prevNodePos: number = collapsiblePos - prevNode.nodeSize;
        return { collapsiblePos, collapsibleNode, prevNodePos, prevNode };
    }
    // Scenario B: cursor at start of normal block whose previous sibling is a collapsible.
    if (isInsideBody(state)) {
        return null;
    }
    // Find the innermost block child that contains the cursor.
    let blockDepth: number = -1;
    for (let d: number = $from.depth; d > 0; d--) {
        const node: PMNode = $from.node(d);
        if (node && node.type.spec && node.type.spec.group &&
            String(node.type.spec.group).indexOf('block') !== -1) {
            blockDepth = d;
            break;
        }
    }
    if (blockDepth === -1) {
        return null;
    }
    // Cursor must be at the very start of the block.
    const blockStart: number = $from.before(blockDepth);
    if ($from.pos !== blockStart + 1) {
        return null;
    }
    const $resolved: PMResolvedPos = state.doc.resolve(blockStart);
    const parent: PMNode = $resolved.depth === 0 ? $resolved.node(0) : $resolved.parent;
    const index: number = $resolved.depth === 0
        ? ($resolved.node(0).children as readonly PMNode[]).indexOf($from.node(blockDepth)) : $resolved.index();
    if (index === 0) {
        return null;
    }
    const prevNode: PMNode = parent.child(index - 1);
    if (prevNode.type.name !== 'collapsible') {
        return null;
    }
    const prevNodePos: number = blockStart - prevNode.nodeSize;
    return { collapsiblePos: blockStart, collapsibleNode: state.doc.nodeAt(blockStart), prevNodePos, prevNode };
}


// Merge current block content into the LAST body child of an expanded collapsible previous sibling. Used for Case 3.2 (expanded).

function mergeIntoLastBodyChild(state: PMEditorState, ctx: PMCommandContext, mc: MergeContext): boolean {
    if (!isCollapsibleExpanded(mc.prevNode)) {
        return false;
    }
    const bodyNode: PMNode | null = getBodyNode(mc.prevNode);
    if (!bodyNode || bodyNode.childCount === 0) {
        // Expanded collapsible with empty body — fall through to base.
        return false;
    }
    const lastBodyChild: PMNode = bodyNode.child(bodyNode.childCount - 1);
    const schema: PMSchema = state.schema;
    // Compose lastBodyChild with the subject's content.
    const subjectContent: PMFragment = mc.collapsibleNode.content;
    const mergedContent: PMFragment = lastBodyChild.content.append(subjectContent);
    const newLastChild: PMNode = lastBodyChild.type.create(lastBodyChild.attrs, mergedContent);
    // Build a new body fragment: replace only the last child.
    const bodyChildren: PMNode[] = [];
    for (let i: number = 0; i < bodyNode.childCount - 1; i++) {
        bodyChildren.push(bodyNode.child(i));
    }
    bodyChildren.push(newLastChild);
    const newBodyNode: PMNode = schema.nodes['collapsibleBody'].create(null, bodyChildren);
    const headerNode: PMNode | null = getHeaderNode(mc.prevNode);
    if (!headerNode) {
        return false;
    }
    const newPrevCollapsible: PMNode = schema.nodes['collapsible'].create(mc.prevNode.attrs, [headerNode, newBodyNode]);
    const tr: PMTransaction = state.tr;
    const subjectStart: number = mc.collapsiblePos;
    const subjectEnd: number = subjectStart + mc.collapsibleNode.nodeSize;
    // Replace the subject with nothing (delete it).
    tr.delete(subjectStart, subjectEnd);
    // Replace previous collapsible with the new merged one.
    tr.replaceWith(mc.prevNodePos, mc.prevNodePos + mc.prevNode.nodeSize, newPrevCollapsible);

    tr.setSelection(TextSelection.near(tr.doc.resolve(mc.prevNodePos + 1 + headerNode.nodeSize + 1 + lastBodyChild.content.size)));
    ctx.dispatch(wrapTransaction(tr));
    return true;
}

// Backward-merge coordinator. Branches deterministically by previous-sibling type to honor the collapsible sibling semantics.

function performBackwardMerge(state: PMEditorState, ctx: PMCommandContext): void {
    const mc: MergeContext | null = resolveMergeContext(state);
    if (!mc) {
        return;
    }
    if (mc.prevNode.type.name === 'collapsible') {
        if (isInsideHeader(state) && mc.collapsibleNode.type.name === 'collapsible') {
            return;
        }
        if (isCollapsibleCollapsed(mc.prevNode)) {
            const headerNode: PMNode | null = getHeaderNode(mc.prevNode);
            if (!headerNode) {
                return;
            }
            const triggerNode: PMNode | null = headerNode.child(0);
            if (!triggerNode) {
                return;
            }
            const schema: PMSchema = state.schema;
            const merged: PMFragment = triggerNode.content.append(mc.collapsibleNode.content);
            const newTrigger: PMNode = triggerNode.type.create(triggerNode.attrs, merged);
            const newHeader: PMNode = schema.nodes['collapsibleHeader'].create(null, [newTrigger]);
            const bodyNode: PMNode | null = getBodyNode(mc.prevNode);
            if (!bodyNode) {
                return;
            }
            const newPrevCollapsible: PMNode = schema.nodes['collapsible'].create(mc.prevNode.attrs, [newHeader, bodyNode]);
            const tr: PMTransaction = state.tr;
            const subjectStart: number = mc.collapsiblePos;
            const subjectEnd: number = subjectStart + mc.collapsibleNode.nodeSize;
            tr.delete(subjectStart, subjectEnd);
            tr.replaceWith(mc.prevNodePos, mc.prevNodePos + mc.prevNode.nodeSize, newPrevCollapsible);
            const cursorPos: number = mc.prevNodePos + 3 + triggerNode.content.size;
            tr.setSelection(TextSelection.near(tr.doc.resolve(cursorPos)));
            ctx.dispatch(wrapTransaction(tr));
            return;
        }
        if (isCollapsibleExpanded(mc.prevNode)) {
            mergeIntoLastBodyChild(state, ctx, mc);
            return;
        }
    }
}

export const mergeCollapsibleBackwardCommand: PMCommandInternal<void> = {
    name: 'mergeCollapsibleBackward',
    meta: { label: 'Merge Collapsible Backward', category: 'structure' },
    canExecute(ctx: PMCommandContext): boolean {
        // Can execute if cursor is at the start of a collapsible header OR at the start of a normal block whose previous sibling is a collapsible.
        const state: PMEditorState = ctx.pmState;
        // Case 3.1/legacy: cursor inside a collapsible header.
        if (isInsideHeader(state)) {
            const collapsiblePos: number = findCollapsibleAncestorPos(state);
            if (collapsiblePos === -1) {
                return false;
            }
            const collapsibleNode: PMNode | null = state.doc.nodeAt(collapsiblePos);
            if (!collapsibleNode) {
                return false;
            }
            const { $from } = state.selection;
            const headerStart: number = collapsiblePos + 2;
            if ($from.pos > headerStart) {
                return false;
            }
            const $resolved: PMResolvedPos = state.doc.resolve(collapsiblePos);
            const parent: PMNode = $resolved.depth === 0 ? $resolved.node(0) : $resolved.parent;
            const index: number = $resolved.depth === 0 ? $resolved.index(0) : $resolved.index();
            if (index === 0) {
                return false;
            }
            const prevNode: PMNode = parent.child(index - 1);
            return prevNode.type.name === 'paragraph' || prevNode.type.name === 'heading';
        }
        // Case 3.2: cursor at start of normal block whose previous sibling is a collapsible.
        const { $from } = state.selection;
        if (isInsideBody(state)) {
            return false;
        }
        let blockDepth: number = -1;
        for (let d: number = $from.depth; d > 0; d--) {
            const node: PMNode = $from.node(d);
            if (node && node.type.spec && node.type.spec.group &&
                String(node.type.spec.group).indexOf('block') !== -1) {
                blockDepth = d;
                break;
            }
        }
        if (blockDepth === -1) {
            return false;
        }
        const blockStart: number = $from.before(blockDepth);
        if ($from.pos !== blockStart + 1) {
            return false;
        }
        const $resolved: PMResolvedPos = state.doc.resolve(blockStart);
        const parent: PMNode = $resolved.depth === 0 ? $resolved.node(0) : $resolved.parent;
        const index: number = $resolved.depth === 0 ? $resolved.index(0) : $resolved.index();
        if (index === 0) {
            return false;
        }
        const prevNode: PMNode = parent.child(index - 1);
        return prevNode.type.name === 'collapsible';
    },
    execute(ctx: PMCommandContext): void {
        performBackwardMerge(ctx.pmState, ctx);
    }
};
