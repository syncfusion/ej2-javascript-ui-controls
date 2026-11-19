/**
 * backspace-collapsible.ts — Multi-stage backspace handler for collapsible blocks.
 *
 * Implements a fallthrough chain:
 * 1. Try backward merge (at header start with mergeable previous block)
 * 2. Try delete empty collapsible (both header and body have no text)
 * 3. Fall through to default backspace (allow other handlers to process)
 *
 * Scenarios:
 * - Cursor at header start + previous mergeable block → merge backward
 * - Cursor anywhere in empty collapsible → delete entire collapsible
 * - Cursor at body start → attempt to merge with header
 * - Default → fall through to standard backspace
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */

import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNode, PMFragment, PMResolvedPos, TextSelection } from '../../../pm/pm-guard';
import { mergeCollapsibleBackwardCommand } from './merge-collapsible-backward';

import {
    findCollapsibleAncestorPos,
    findCollapsibleBodyAncestorPos,
    getBodyNode,
    getHeaderNode,
    isCollapsibleEmpty,
    isInsideBody,
    isInsideHeader
} from './collapsible-helpers';

// Delete the entire collapsible if it's completely empty.

/**
 * Try deleting the entire collapsible when both header and body are empty.
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
    const collapsibleNode: PMNode = state.doc.nodeAt(collapsiblePos);
    if (!collapsibleNode) {
        return false;
    }
    // Only delete if completely empty
    if (!isCollapsibleEmpty(collapsibleNode)) {
        return false;
    }
    const tr: PMTransaction = state.tr;
    tr.delete(collapsiblePos, collapsiblePos + collapsibleNode.nodeSize);
    ctx.dispatch(wrapTransaction(tr));
    return true;
}
/**
 * Try backward merge if at header start with mergeable previous block.
 *
 * @param {PMEditorState} state - Current editor state.
 * @param {PMCommandContext} ctx - Command execution context.
 * @returns {boolean} True if the merge succeeded, false otherwise.
 */
function tryMergeBackward(state: PMEditorState, ctx: PMCommandContext): boolean {
    if (mergeCollapsibleBackwardCommand.canExecute(ctx)) {
        mergeCollapsibleBackwardCommand.execute(ctx);
        return true;
    }
    return false;
}

/**
 * Transform: when backspace is pressed at the start of a collapsible header
 * and the previous sibling is a normal block (paragraph / heading), lift the
 * header content into the previous block and lift the body content out as
 * one or more normal paragraphs immediately following the previous block.
 * Removes the original collapsible entirely.
 *
 * This is Case 3.1 — distinct from a simple merge-with-previous because it
 * also dissolves the collapsible structure and preserves the body content
 * as independent paragraphs.
 *
 * @param {PMEditorState} state - Current editor state.
 * @param {PMCommandContext} ctx - Command execution context.
 * @returns {boolean} True if the collapsible was transformed, false otherwise.
 */
function tryTransformCollapsibleAtHeaderStart(state: PMEditorState, ctx: PMCommandContext): boolean {
    // Must be inside a collapsible header.
    if (!isInsideHeader(state)) {
        return false;
    }
    const collapsiblePos: number = findCollapsibleAncestorPos(state);
    if (collapsiblePos === -1) {
        return false;
    }
    const { $from } = state.selection;
    const collapsibleNode: PMNode | null = state.doc.nodeAt(collapsiblePos);
    if (!collapsibleNode) {
        return false;
    }
    const headerNode: PMNode | null = getHeaderNode(collapsibleNode);
    if (!headerNode) {
        return false;
    }
    // Cursor must be at the very start of the header trigger content.
    const triggerStart: number = collapsiblePos + 1 + 1 + 1; // collapsible + header + trigger
    if ($from.pos !== triggerStart) {
        return false;
    }
    // Resolve parent / index to inspect previous sibling.
    // (At root level, $resolved.depth is 0; the doc itself is the parent.)
    const $resolved: PMResolvedPos = state.doc.resolve(collapsiblePos);
    const parent: PMNode = $resolved.depth === 0 ? $resolved.node(0) : $resolved.parent;
    const index: number = $resolved.depth === 0 ? $resolved.index(0) : $resolved.index();
    // First top-level block — no previous sibling exists.
    // Dissolve the current collapsible into [triggerNode, ...bodyFragments].
    if (index === 0) {
        const triggerNode: PMNode | null = headerNode.child(0);
        if (!triggerNode) {
            return false;
        }
        const bodyNode: PMNode | null = getBodyNode(collapsibleNode);
        if (!bodyNode) {
            return false;
        }
        const bodyFragments: PMNode[] = [];
        for (let i: number = 0; i < bodyNode.childCount; i++) {
            bodyFragments.push(bodyNode.child(i));
        }
        if (bodyFragments.length === 0) {
            bodyFragments.push(state.schema.nodes['paragraph'].create());
        }
        const tr: PMTransaction = state.tr;
        const collapsibleEnd: number = collapsiblePos + collapsibleNode.nodeSize;
        tr.replaceWith(
            collapsiblePos,
            collapsibleEnd,
            [triggerNode, ...bodyFragments]
        );
        tr.setSelection(TextSelection.near(tr.doc.resolve(collapsiblePos + 1)));
        ctx.dispatch(wrapTransaction(tr));
        return true;
    }

    const prevNode: PMNode = parent.child(index - 1);
    // If previous block is another collapsible,
    // dissolve only the current collapsible.
    if (prevNode.type.name === 'collapsible') {
        const triggerNode: PMNode | null = headerNode.child(0);
        if (!triggerNode) {
            return false;
        }

        const bodyNode: PMNode | null = getBodyNode(collapsibleNode);
        if (!bodyNode) {
            return false;
        }

        const bodyFragments: PMNode[] = [];

        for (let i: number = 0; i < bodyNode.childCount; i++) {
            bodyFragments.push(bodyNode.child(i));
        }

        if (bodyFragments.length === 0) {
            bodyFragments.push(state.schema.nodes['paragraph'].create());
        }

        const tr: PMTransaction = state.tr;
        const collapsibleEnd: number = collapsiblePos + collapsibleNode.nodeSize;

        tr.replaceWith(
            collapsiblePos,
            collapsibleEnd,
            [triggerNode, ...bodyFragments]
        );

        tr.setSelection(
            TextSelection.near(tr.doc.resolve(collapsiblePos + 1))
        );

        ctx.dispatch(wrapTransaction(tr));
        return true;
    }

    // Existing paragraph/heading behavior.
    // Universal dissolve: regardless of the previous sibling type, the FIRST
    // Backspace at the start of a collapsible header must dissolve the
    // current collapsible into its trigger block plus body fragments. No
    // merge with the previous sibling happens here — that is reserved for
    // the SECOND Backspace via the normal block-merging path.
    {
        const triggerNode: PMNode | null = headerNode.child(0);
        if (!triggerNode) {
            return false;
        }

        const bodyNode: PMNode | null = getBodyNode(collapsibleNode);
        if (!bodyNode) {
            return false;
        }

        const bodyFragments: PMNode[] = [];
        for (let i: number = 0; i < bodyNode.childCount; i++) {
            bodyFragments.push(bodyNode.child(i));
        }
        if (bodyFragments.length === 0) {
            bodyFragments.push(state.schema.nodes['paragraph'].create());
        }

        const tr: PMTransaction = state.tr;
        const collapsibleEnd: number = collapsiblePos + collapsibleNode.nodeSize;
        tr.replaceWith(
            collapsiblePos,
            collapsibleEnd,
            [triggerNode, ...bodyFragments]
        );
        tr.setSelection(TextSelection.near(tr.doc.resolve(collapsiblePos + 1)));
        ctx.dispatch(wrapTransaction(tr));
        return true;
    }
}
/**
 *
 * Lift an empty body block out of a collapsible when there is no preceding
 * body content. Used as the final backspace stage for Case 5.4b.
 *
 * @param {PMEditorState} state The current editor state.
 * @param {PMCommandContext} ctx The command context.
 * @returns {boolean} Whether the operation was handled.
 */
function tryLiftOrphanedEmptyBodyBlock(state: PMEditorState, ctx: PMCommandContext): boolean {
    if (!isInsideBody(state)) {
        return false;
    }
    const { $from } = state.selection;
    // Find the body block containing the cursor.
    let blockDepth: number = -1;
    for (let d: number = $from.depth; d > 0; d--) {
        const node: PMNode = $from.node(d);
        const parent: PMNode = $from.node(d - 1);
        if (node &&
            node.type.spec &&
            node.type.spec.group &&
            String(node.type.spec.group).indexOf('block') !== -1 &&
            parent &&
            parent.type.name === 'collapsibleBody'
        ) {
            blockDepth = d;
            break;
        }
    }

    if (blockDepth === -1) {
        return false;
    }

    const blockNode: PMNode = $from.node(blockDepth);

    // Only handle an empty paragraph/block.
    if (blockNode.textContent.length !== 0) {
        return false;
    }

    const blockStart: number = $from.before(blockDepth);

    const blockEnd: number = blockStart + blockNode.nodeSize;

    // Cursor must be at the start of the empty block.
    if ($from.pos !== blockStart + 1) {
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

    const headerNode: PMNode | null = getHeaderNode(collapsibleNode);
    if (!headerNode) {
        return false;
    }

    const bodyNode: PMNode | null = getBodyNode(collapsibleNode);
    if (!bodyNode) {
        return false;
    }

    // Find the current block inside the actual collapsibleBody.
    const bodyStart: number =
        collapsiblePos + 1 + headerNode.nodeSize + 1;

    let blockIndex: number = -1;
    let currentBlockPos: number = bodyStart;

    for (let i: number = 0; i < bodyNode.childCount; i++) {
        if (currentBlockPos === blockStart) {
            blockIndex = i;
            break;
        }
        currentBlockPos += bodyNode.child(i).nodeSize;
    }

    if (blockIndex === -1) {
        return false;
    }
    // Only handle a trailing empty block.
    for (let i: number = blockIndex + 1; i < bodyNode.childCount; i++) {
        if (bodyNode.child(i).textContent.length !== 0) {
            return false;
        }
    }

    const tr: PMTransaction = state.tr;

    // Remove the empty block from the collapsible body.
    tr.delete(blockStart, blockEnd);

    const updatedCollapsible: PMNode | null = tr.doc.nodeAt(collapsiblePos);
    if (!updatedCollapsible) {
        return false;
    }

    const updatedCollapsibleEnd: number =
        collapsiblePos + updatedCollapsible.nodeSize;

    const paragraphNode: PMNode = state.schema.nodes['paragraph'].create();

    tr.insert(updatedCollapsibleEnd, paragraphNode);

    tr.setSelection(
        TextSelection.near(
            tr.doc.resolve(updatedCollapsibleEnd + 1)
        )
    );

    ctx.dispatch(wrapTransaction(tr));
    return true;
}

/**
 * Merge the first body block's content into the collapsible header.
 *
 * @param {PMEditorState} state - Current editor state.
 * @param {PMCommandContext} ctx - Command execution context.
 * @returns {boolean} True if the merge succeeded, false otherwise.
 */
function tryMergeFirstBodyBlockIntoHeader(state: PMEditorState, ctx: PMCommandContext
): boolean {
    if (!isInsideBody(state)) {
        return false;
    }

    const { $from } = state.selection;

    // Find the body block containing the cursor.
    let bodyBlockDepth: number = -1;
    for (let d: number = $from.depth; d > 0; d--) {
        const node: PMNode = $from.node(d);
        const parent: PMNode = $from.node(d - 1);

        if (
            node &&
            node.type.spec &&
            node.type.spec.group &&
            String(node.type.spec.group).indexOf('block') !== -1 &&
            parent &&
            parent.type.name === 'collapsibleBody'
        ) {
            bodyBlockDepth = d;
            break;
        }
    }

    if (bodyBlockDepth === -1) {
        return false;
    }

    const bodyBlock: PMNode = $from.node(bodyBlockDepth);
    const bodyBlockStart: number = $from.before(bodyBlockDepth);

    // Only handle Backspace at the start of the body block.
    if ($from.pos !== bodyBlockStart + 1) {
        return false;
    }

    // Empty body blocks are handled by tryLiftOrphanedEmptyBodyBlock().
    if (bodyBlock.textContent.length === 0) {
        return false;
    }

    const bodyPos: number = findCollapsibleBodyAncestorPos(state);
    if (bodyPos === -1) {
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

    // Only handle an expanded collapsible.
    if (collapsibleNode.attrs.collapsed) {
        return false;
    }

    const headerNode: PMNode | null = getHeaderNode(collapsibleNode);
    if (!headerNode) {
        return false;
    }

    const triggerNode: PMNode | null = headerNode.childCount > 0
        ? headerNode.child(0)
        : null;
    if (!triggerNode) {
        return false;
    }

    const bodyNode: PMNode | null = getBodyNode(collapsibleNode);
    if (!bodyNode || bodyNode.childCount === 0) {
        return false;
    }

    // The current block must be the first block in the body.
    if (bodyNode.child(0) !== bodyBlock) {
        return false;
    }

    // Merge the body block's inline content into the header trigger.
    const mergedContent: PMFragment = triggerNode.content.append(bodyBlock.content);

    const newTrigger: PMNode = triggerNode.type.create(
        triggerNode.attrs,
        mergedContent
    );

    const newHeader: PMNode = headerNode.type.create(headerNode.attrs, [newTrigger]);

    // Remove the first body block from the body. If that leaves the body
    // empty, the collapsibleBody content contract requires at least one
    // block (`oneOrMore`), so we drop in a fresh empty paragraph to keep
    // the document valid.
    const remainingBodyContent: PMFragment = bodyNode.content.cut(bodyBlock.nodeSize);
    let newBody: PMNode;
    if (remainingBodyContent.size === 0) {
        newBody = bodyNode.type.create(bodyNode.attrs, [state.schema.nodes['paragraph'].create()]);
    } else {
        newBody = bodyNode.type.create(bodyNode.attrs, remainingBodyContent);
    }

    const newCollapsible: PMNode = collapsibleNode.type.create(
        collapsibleNode.attrs,
        [newHeader, newBody]
    );

    const tr: PMTransaction = state.tr;

    tr.replaceWith(
        collapsiblePos,
        collapsiblePos + collapsibleNode.nodeSize,
        newCollapsible
    );

    // Place the cursor between the original header text
    // and the body text that was merged into the header.
    const cursorPos: number = collapsiblePos + 3 + triggerNode.content.size;

    tr.setSelection(
        TextSelection.near(tr.doc.resolve(cursorPos))
    );

    ctx.dispatch(wrapTransaction(tr));
    return true;
}
/**
 * Merge the current body block backward with its previous sibling block.
 *
 * @param {PMEditorState} state - Current editor state.
 * @param {PMCommandContext} ctx - Command execution context.
 * @returns {boolean} True if the merge succeeded, false otherwise.
 */
function tryMergeBodyBlockBackward(state: PMEditorState, ctx: PMCommandContext): boolean {
    if (!isInsideBody(state)) {
        return false;
    }

    const { $from } = state.selection;

    let blockDepth: number = -1;
    for (let d: number = $from.depth; d > 0; d--) {
        const node: PMNode = $from.node(d);
        const parent: PMNode = $from.node(d - 1);

        if (
            node &&
            node.type.spec &&
            node.type.spec.group &&
            String(node.type.spec.group).indexOf('block') !== -1 &&
            parent &&
            parent.type.name === 'collapsibleBody'
        ) {
            blockDepth = d;
            break;
        }
    }

    if (blockDepth === -1) {
        return false;
    }

    const blockNode: PMNode = $from.node(blockDepth);
    const blockStart: number = $from.before(blockDepth);

    // Only handle Backspace at the start of the current body block.
    if ($from.pos !== blockStart + 1) {
        return false;
    }

    const bodyPos: number = findCollapsibleBodyAncestorPos(state);
    if (bodyPos === -1) {
        return false;
    }

    const $body: PMResolvedPos = state.doc.resolve(bodyPos);
    const bodyNode: PMNode | null = $body.node($body.depth);
    if (!bodyNode) {
        return false;
    }

    let blockIndex: number = -1;
    let currentBlockPos: number = bodyPos + 1;

    for (let i: number = 0; i < bodyNode.childCount; i++) {
        if (currentBlockPos === blockStart) {
            blockIndex = i;
            break;
        }
        currentBlockPos += bodyNode.child(i).nodeSize;
    }

    // No previous body block.
    if (blockIndex <= 0) {
        return false;
    }

    const previousBlock: PMNode = bodyNode.child(blockIndex - 1);
    const previousBlockPos: number = blockStart - previousBlock.nodeSize;

    // Let normal PM joining handle only compatible block types.
    if (previousBlock.type !== blockNode.type) {
        return false;
    }

    // Position of the boundary between the previous text and current text
    // after the two blocks are joined.
    const cursorPos: number =
        previousBlockPos + 1 + previousBlock.content.size;

    const tr: PMTransaction = state.tr;
    tr.join(blockStart);

    tr.setSelection(
        TextSelection.near(tr.doc.resolve(cursorPos))
    );

    ctx.dispatch(wrapTransaction(tr));
    return true;
}
/**
 * Handles backspace key when cursor is in a collapsible.
 * Uses a multi-stage fallthrough approach.
 *
 * @param {PMEditorState} state The current editor state.
 * @param {PMCommandContext} ctx The command context.
 * @returns {boolean} True if the merge succeeded, false otherwise.
 */
function performBackspaceLogic(state: PMEditorState, ctx: PMCommandContext): void {
    // Stage 1: Try structural transformation at header start (Case 3.1).
    // Runs before the merge stage because the result is irreversible and
    // conceptually distinct from a "merge" operation.
    if (tryTransformCollapsibleAtHeaderStart(state, ctx)) {
        return;
    }

    // Stage 2: Try backward merge (now extended for collapsible siblings).
    if (tryMergeBackward(state, ctx)) {
        return;
    }

    // Stage 3: Try delete if empty
    if (tryDeleteEmptyCollapsible(state, ctx)) {
        return;
    }
    if (tryMergeFirstBodyBlockIntoHeader(state, ctx)) {
        return;
    }
    // Stage 4: Lift orphaned empty body block out of the collapsible (5.4b).
    if (tryLiftOrphanedEmptyBodyBlock(state, ctx)) {
        return;
    }
    // Stage 5: Merge body blocks backward.
    if (tryMergeBodyBlockBackward(state, ctx)) {
        return;
    }
    // Stage 5: Fall through to default backspace (no-op, let keymap handle it)
    // The keymap will then try other handlers or the default PM backspace
}

export const backspaceCollapsibleCommand: PMCommandInternal<void> = {
    name: 'backspaceCollapsible',

    meta: { label: 'Backspace Collapsible', category: 'structure' },

    canExecute(ctx: PMCommandContext): boolean {
        const state: PMEditorState = ctx.pmState;
        // (a) cursor inside a collapsible (header or body).
        if (findCollapsibleAncestorPos(state) !== -1) {
            return true;
        }
        // (b) cursor at the start of a plain block whose previous sibling
        //     is a collapsible (Scenario B for backward merge).
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
        // (At root level, $resolved.depth is 0; the doc itself is the parent.)
        const $resolved: PMResolvedPos = state.doc.resolve(blockStart);
        const parent: PMNode = $resolved.depth === 0 ? $resolved.node(0) : $resolved.parent;
        const index: number = $resolved.depth === 0 ? $resolved.index(0) : $resolved.index();
        if (index === 0) {
            return false;
        }
        return parent.child(index - 1).type.name === 'collapsible';
    },

    execute(ctx: PMCommandContext): void {
        performBackspaceLogic(ctx.pmState, ctx);
    }
};
