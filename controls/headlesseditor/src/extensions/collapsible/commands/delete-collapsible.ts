/**
 * delete-collapsible.ts — Multi-stage Delete handler for collapsible blocks.
 *
 * Implements a fallthrough chain:
 * 1. Try delete empty collapsible (both header and body have no text)
 * 2. Case 4.1 — Delete at end of EXPANDED header → merge first body block
 *    into header.
 * 3. Case 4.2 — Delete at end of COLLAPSED header → merge next sibling
 *    block content into header (preserves collapsed state).
 * 4. Try forward merge (at end of collapsible with mergeable next block)
 * 5. Fall through to default delete.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */

import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMNode, PMFragment, PMResolvedPos, PMTransaction, PMNodeType, TextSelection } from '../../../pm/pm-guard';
import { mergeCollapsibleForwardCommand } from './merge-collapsible-forward';
import {
    findCollapsibleAncestorPos,
    getBodyNode,
    getHeaderNode,
    isCollapsibleCollapsed,
    isCollapsibleEmpty,
    isCollapsibleExpanded,
    isInsideHeader,
    isInsideBody
} from './collapsible-helpers';

/**
 * Delete the entire collapsible if it's completely empty.
 *
 * @param {PMEditorState} state - Current editor state.
 * @param {PMCommandContext} ctx - Command execution context.
 * @returns {boolean} True if the collapsible was deleted, false otherwise.
 */
function tryDeleteEmptyCollapsible(state: PMEditorState, ctx: PMCommandContext): boolean {
    const collapsiblePos: number = findCollapsibleAncestorPos(state);
    if (collapsiblePos === -1) {
        return false;
    }
    const collapsibleNode: PMNode | null = state.doc.nodeAt(collapsiblePos);
    if (!collapsibleNode) {
        return false;
    }
    if (!isCollapsibleEmpty(collapsibleNode)) {
        return false;
    }
    const tr: PMTransaction = state.tr;
    tr.delete(collapsiblePos, collapsiblePos + collapsibleNode.nodeSize);
    ctx.dispatch(wrapTransaction(tr));
    return true;
}

/**
 * Gets the document position immediately after the collapsible header trigger content.
 *
 * This is the shared endpoint used to detect the collapsed-header delete boundary.
 * For a collapsible structure of the form:
 *
 *   collapsible
 *   ├── collapsibleHeader
 *   │   └── triggerNode
 *   └── collapsibleBody
 *
 * the end position is calculated from the trigger node's content size, rather than
 * relying on raw magic offsets in multiple call sites.
 *
 * @param {number} collapsiblePos - Document position of the collapsible node.
 * @param {PMNode} headerNode - The collapsible header node.
 * @returns {number | null} The document position immediately after the header trigger text, or null when the trigger is missing.
 */
function getHeaderTriggerEndPos(collapsiblePos: number, headerNode: PMNode): number | null {
    if (headerNode.childCount === 0) {
        return null;
    }
    const triggerNode: PMNode = headerNode.child(0);
    return collapsiblePos + 3 + triggerNode.content.size;
}

/**
 * Checks whether the selection is at the end of the collapsible header content.
 *
 * @param {PMEditorState} state - Current editor state.
 * @param {number} collapsiblePos - Document position of the collapsible node.
 * @param {PMNode} headerNode - Collapsible header node.
 * @returns {boolean} True when the selection is at a header-end boundary.
 */
function isAtCollapsibleHeaderEnd(state: PMEditorState, collapsiblePos: number, headerNode: PMNode): boolean {
    const headerContentEnd: number | null = getHeaderTriggerEndPos(collapsiblePos, headerNode);
    if (headerContentEnd === null) {
        return false;
    }
    const { $from } = state.selection;
    return $from.pos === headerContentEnd || $from.pos === headerContentEnd - 1;
}

// Case 4.1 — Delete at the end of an EXPANDED header merges the FIRST body block's content into the header. Subsequent body blocks are preserved.
/**
 * @param {PMEditorState} state - Current editor state.
 * @param {PMCommandContext} ctx - Command execution context.
 * @returns {boolean} True if the delete was handled, false otherwise.
 */
function tryDeleteExpandedHeaderEnd(state: PMEditorState, ctx: PMCommandContext): boolean {
    if (!isInsideHeader(state)) {
        return false;
    }
    const collapsiblePos: number = findCollapsibleAncestorPos(state);
    if (collapsiblePos === -1) {
        return false;
    }
    const collapsibleNode: PMNode | null = state.doc.nodeAt(collapsiblePos);
    if (!collapsibleNode) {
        return false;
    }
    if (!isCollapsibleExpanded(collapsibleNode)) {
        return false;
    }
    const headerNode: PMNode | null = getHeaderNode(collapsibleNode);
    if (!headerNode) {
        return false;
    }
    if (headerNode.childCount === 0) {
        return false;
    }
    const triggerNode: PMNode = headerNode.child(0);
    const { $from } = state.selection;
    const triggerEnd: number | null = getHeaderTriggerEndPos(collapsiblePos, headerNode);
    if (triggerEnd === null) {
        return false;
    }
    if ($from.pos !== triggerEnd) {
        return false;
    }
    const bodyNode: PMNode | null = getBodyNode(collapsibleNode);
    if (!bodyNode || bodyNode.childCount === 0) {
        return false;
    }
    const firstBodyChild: PMNode = bodyNode.child(0);
    // Merge the first body block's content into the header.
    const newTriggerContent: PMFragment = triggerNode.content.append(firstBodyChild.content);
    const newTrigger: PMNode = triggerNode.type.create(
        triggerNode.attrs,
        newTriggerContent
    );
    const newHeader: PMNode = state.schema.nodes['collapsibleHeader'].create(headerNode.attrs, [newTrigger]);
    // Remove the first body block.
    const remainingBody: PMNode[] = [];
    for (let i: number = 1; i < bodyNode.childCount; i++) {
        remainingBody.push(bodyNode.child(i));
    }
    if (remainingBody.length === 0) {
        const paragraphType: PMNodeType | undefined = state.schema.nodes['paragraph'];
        if (!paragraphType) {
            return false;
        }
        remainingBody.push(paragraphType.create());
    }
    const newBody: PMNode = state.schema.nodes['collapsibleBody'].create(bodyNode.attrs, remainingBody);
    const newCollapsible: PMNode = state.schema.nodes['collapsible'].create(collapsibleNode.attrs, [newHeader, newBody]);
    const tr: PMTransaction = state.tr;
    tr.replaceWith(collapsiblePos, collapsiblePos + collapsibleNode.nodeSize, newCollapsible);
    const newTriggerEnd: number = collapsiblePos + 3 + newTrigger.content.size;
    tr.setSelection(TextSelection.near(tr.doc.resolve(newTriggerEnd)));
    ctx.dispatch(wrapTransaction(tr));
    return true;
}
// Case 4.2 — Delete at the end of a COLLAPSED header merges the NEXT sibling block's content into the header. The collapsible stays collapsed and the next sibling is removed/consumed according to merge semantics.
/**
 * @param {PMEditorState} state - Current editor state.
 * @param {PMCommandContext} ctx - Command execution context.
 * @returns {boolean} True if the delete was handled, false otherwise.
 */
function tryDeleteCollapsedHeaderEnd(state: PMEditorState, ctx: PMCommandContext): boolean {
    const selectionInHeader: boolean = isInsideHeader(state);
    const selectionInBody: boolean = isInsideBody(state);
    if (!selectionInHeader && !selectionInBody) {
        return false;
    }
    const collapsiblePos: number = findCollapsibleAncestorPos(state);
    if (collapsiblePos === -1) {
        return false;
    }
    const collapsibleNode: PMNode | null = state.doc.nodeAt(collapsiblePos);
    if (!collapsibleNode) {
        return false;
    }
    if (!isCollapsibleCollapsed(collapsibleNode)) {
        return false;
    }
    const headerNode: PMNode | null = getHeaderNode(collapsibleNode);
    if (!headerNode) {
        return false;
    }
    if (selectionInHeader && !isAtCollapsibleHeaderEnd(state, collapsiblePos, headerNode)) {
        return false;
    }
    if (headerNode.childCount === 0) {
        return false;
    }
    const triggerNode: PMNode = headerNode.child(0);
    // Identify next sibling. (At root level, $resolved.depth is 0; the doc itself is the parent.)
    const $resolved: PMResolvedPos = state.doc.resolve(collapsiblePos);
    const parent: PMNode = $resolved.depth === 0 ? $resolved.node(0) : $resolved.parent;
    const index: number = $resolved.depth === 0 ? $resolved.index(0) : $resolved.index();
    if (index >= parent.childCount - 1) {
        return false;
    }
    const nextNode: PMNode = parent.child(index + 1);
    const nextNodePos: number = collapsiblePos + collapsibleNode.nodeSize;
    // Special branch: next sibling is another collapsible.Consume next's header trigger text into the current header; lift next's body children out as top-level blocks.
    if (nextNode.type.name === 'collapsible') {
        const nextHeaderNode: PMNode | null = getHeaderNode(nextNode);
        if (!nextHeaderNode) {
            return false;
        }
        if (nextHeaderNode.childCount === 0) {
            return false;
        }
        const nextTriggerNode: PMNode = nextHeaderNode.child(0);
        const newTriggerContent: PMFragment = triggerNode.content.append(nextTriggerNode.content);
        const newTrigger: PMNode = triggerNode.type.create(triggerNode.attrs, newTriggerContent);
        const newHeader: PMNode = state.schema.nodes['collapsibleHeader'].create(null, [newTrigger]);
        const bodyNode: PMNode | null = getBodyNode(collapsibleNode);
        if (!bodyNode) {
            return false;
        }
        const newCollapsible: PMNode = state.schema.nodes['collapsible'].create(collapsibleNode.attrs, [newHeader, bodyNode]);
        const nextBodyNode: PMNode | null = getBodyNode(nextNode);
        const lifted: PMNode[] = [];
        if (nextBodyNode) {
            for (let i: number = 0; i < nextBodyNode.childCount; i++) {
                lifted.push(nextBodyNode.child(i));
            }
        }
        const tr: PMTransaction = state.tr;
        tr.replaceWith(collapsiblePos, collapsiblePos + collapsibleNode.nodeSize, newCollapsible);
        const mappedNextNodePos: number = tr.mapping.map(nextNodePos);
        tr.replaceWith(mappedNextNodePos, mappedNextNodePos + nextNode.nodeSize, lifted);
        const newTriggerEnd: number = collapsiblePos + 3 + triggerNode.content.size;
        tr.setSelection(TextSelection.near(tr.doc.resolve(newTriggerEnd)));
        ctx.dispatch(wrapTransaction(tr));
        return true;
    }
    // Only merges with normal blocks; other cases are out of scope here.
    if (nextNode.type.name !== 'paragraph' && nextNode.type.name !== 'heading') {
        return false;
    }
    const newTriggerContent: PMFragment = triggerNode.content.append(nextNode.content);
    const newTrigger: PMNode = triggerNode.type.create(triggerNode.attrs, newTriggerContent);
    const newHeader: PMNode = state.schema.nodes['collapsibleHeader'].create(null, [newTrigger]);
    const bodyNode: PMNode | null = getBodyNode(collapsibleNode);
    if (!bodyNode) {
        return false;
    }

    const newCollapsible: PMNode = state.schema.nodes['collapsible'].create(
        collapsibleNode.attrs,
        [newHeader, bodyNode]
    );
    const tr: PMTransaction = state.tr;
    tr.replaceWith(collapsiblePos, nextNodePos + nextNode.nodeSize, newCollapsible);
    // Cursor at the new header trigger end (collapsed preserved).
    const newTriggerEnd: number = collapsiblePos + 3 + triggerNode.content.size;
    tr.setSelection(TextSelection.near(tr.doc.resolve(newTriggerEnd)));
    ctx.dispatch(wrapTransaction(tr));
    return true;
}

/**
 * Try forward merge if at end of collapsible with mergeable next block.
 *
 * @param {PMEditorState} state The current editor state.
 * @param {PMCommandContext} ctx The command context.
 * @returns {boolean} Whether the merge was performed.
 */
function tryMergeForward(state: PMEditorState, ctx: PMCommandContext): boolean {
    const collapsiblePos: number = findCollapsibleAncestorPos(state);
    if (collapsiblePos !== -1) {
        const collapsibleNode: PMNode | null = state.doc.nodeAt(collapsiblePos);
        const headerNode: PMNode | null = collapsibleNode ? getHeaderNode(collapsibleNode) : null;
        if (collapsibleNode && isCollapsibleCollapsed(collapsibleNode) && headerNode &&
            isAtCollapsibleHeaderEnd(state, collapsiblePos, headerNode)) {
            return false;
        }
    }
    if (mergeCollapsibleForwardCommand.canExecute(ctx)) {
        mergeCollapsibleForwardCommand.execute(ctx);
        return true;
    }
    return false;
}

/**
 * Multi-stage delete handler dispatch.
 *
 * @param {PMEditorState} state The current editor state.
 * @param {PMCommandContext} ctx The command context.
 * @returns {boolean} True if the merge succeeded, false otherwise.
 */
function performDeleteLogic(state: PMEditorState, ctx: PMCommandContext): void {
    // Stage 1: Completely empty collapsible.
    if (tryDeleteEmptyCollapsible(state, ctx)) {
        return;
    }
    // Stage 2: Case 4.1 — expanded header end merges first body content.
    if (tryDeleteExpandedHeaderEnd(state, ctx)) {
        return;
    }
    // Stage 3: Case 4.2 — collapsed header end merges next sibling.
    if (tryDeleteCollapsedHeaderEnd(state, ctx)) {
        return;
    }
    if (isInsideHeader(state)) {
        return;
    }
    // Stage 4: Forward merge (existing behavior).
    if (tryMergeForward(state, ctx)) {
        return;
    }
    // Stage 5: Fall through to default delete.
}

export const deleteCollapsibleCommand: PMCommandInternal<void> = {
    name: 'deleteCollapsible',
    meta: { label: 'Delete Collapsible', category: 'structure' },
    canExecute(ctx: PMCommandContext): boolean {
        return findCollapsibleAncestorPos(ctx.pmState) !== -1;
    },
    execute(ctx: PMCommandContext): void {
        performDeleteLogic(ctx.pmState, ctx);
    }
};
