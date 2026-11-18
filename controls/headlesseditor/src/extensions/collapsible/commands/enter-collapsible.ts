/**
 * enter-collapsible.ts — Handle Enter key when cursor is in a collapsible header.
 *
 * Implements all 6 Enter scenarios:
 * 1. Collapsed header at end + empty body → expand + move to body
 * 2. Collapsed header at end + body with content → create paragraph below collapsible
 * 3. Collapsed header at start → create paragraph above collapsible
 * 4. Collapsed header in middle → split collapsible into two
 * 5. Expanded header at end → create paragraph inside body
 * 6. Expanded header in middle → split collapsible
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */

import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMNode, PMNodeType, PMTransaction, TextSelection } from '../../../pm/pm-guard';

import {
    findCollapsibleHeaderAncestorPos,
    findCollapsibleAncestorPos,
    findCollapsibleBodyAncestorPos,
    getHeaderNode,
    getBodyNode,
    getBodyTextLength,
    isCollapsibleCollapsed,
    isCollapsibleExpanded,
    isInsideBody
} from './collapsible-helpers';
import { splitCollapsibleCommand } from './split-collapsible';

// Checks if cursor is at the start of the header trigger content.
function isHeaderAtStart(state: PMEditorState): boolean {
    const headerPos: number = findCollapsibleHeaderAncestorPos(state);
    if (headerPos === -1) {
        return false;
    }
    const { $from } = state.selection;
    const headerNode: PMNode | null = state.doc.nodeAt(headerPos);
    if (!headerNode) {
        return false;
    }
    // Find the trigger (first child of header)
    const triggerNode: PMNode | null = headerNode.child(0);
    if (!triggerNode) {
        return false;
    }
    // Calculate trigger start position in doc
    const triggerStart: number = headerPos + 1 + 1; // header open + trigger open
    return $from.pos <= triggerStart;
}

// Checks if cursor is at the end of the header trigger content.

function isHeaderAtEnd(state: PMEditorState): boolean {
    const headerPos: number = findCollapsibleHeaderAncestorPos(state);
    if (headerPos === -1) {
        return false;
    }
    const { $from } = state.selection;
    const headerNode: PMNode | null = state.doc.nodeAt(headerPos);
    if (!headerNode) {
        return false;
    }
    // Find the trigger (first child of header)
    const triggerNode: PMNode | null = headerNode.child(0);
    if (!triggerNode) {
        return false;
    }
    // Calculate trigger end position in doc
    const triggerEnd: number = headerPos + headerNode.nodeSize - 2; // before header close
    return $from.pos >= triggerEnd;
}


// Checks if cursor is in the middle of the header trigger content (not at boundaries).
function isHeaderInMiddle(state: PMEditorState): boolean {
    const headerPos: number = findCollapsibleHeaderAncestorPos(state);
    if (headerPos === -1) {
        return false;
    }
    return !isHeaderAtStart(state) && !isHeaderAtEnd(state);
}

// Handles Enter at the start of a collapsible header.
// Inserts an empty paragraph before the collapsible and keeps
// the cursor at the start of the collapsible header. Works for
// both collapsed and expanded states.
function splitAtHeaderStart(state: PMEditorState, ctx: PMCommandContext): void {
    const collapsiblePos: number = findCollapsibleAncestorPos(state);
    if (collapsiblePos === -1) {
        return;
    }
    const collapsibleNode: PMNode | null = state.doc.nodeAt(collapsiblePos);
    if (!collapsibleNode) {
        return;
    }
    const paragraphType: PMNodeType | undefined = state.schema.nodes['paragraph'];
    if (!paragraphType) {
        return;
    }
    const tr: PMTransaction = state.tr;
    const paragraph: PMNode = paragraphType.create();
    // Insert empty paragraph before the collapsible — the collapsible now
    // visually sits on the next line.
    tr.insert(collapsiblePos, paragraph);
    // Resolve the collapsible's new position after inserting a paragraph
    // before it. The inserted node shifts subsequent document positions
    // by its node size.
    const newCollapsiblePos: number = collapsiblePos + paragraph.nodeSize;
    // Get the collapsible node at its new position so the cursor can
    // be placed at the start of the header content.
    const newCollapsibleNode: PMNode | null = tr.doc.nodeAt(newCollapsiblePos);
    const triggerStart: number = newCollapsibleNode
        ? newCollapsiblePos + 2 + 1 // +2: collapsible open + header open, +1: trigger open
        : newCollapsiblePos + 1;   // fallback: inside the collapsible
    tr.setSelection(TextSelection.near(tr.doc.resolve(triggerStart)));
    ctx.dispatch(wrapTransaction(tr));
}

// Creates a paragraph below the collapsible.
function createParagraphBelow(state: PMEditorState, ctx: PMCommandContext): void {
    const collapsiblePos: number = findCollapsibleAncestorPos(state);
    if (collapsiblePos === -1) {
        return;
    }
    const collapsibleNode: PMNode | null = state.doc.nodeAt(collapsiblePos);
    if (!collapsibleNode) {
        return;
    }
    const paragraphType: PMNodeType | undefined = state.schema.nodes['paragraph'];
    if (!paragraphType) {
        return;
    }
    const tr: PMTransaction = state.tr;
    const paragraph: PMNode = paragraphType.create();
    // Insert paragraph after the collapsible
    const insertPos: number = collapsiblePos + collapsibleNode.nodeSize;
    tr.insert(insertPos, paragraph);
    // Move cursor to the start of the new paragraph
    tr.setSelection(TextSelection.near(tr.doc.resolve(insertPos + 1)));
    ctx.dispatch(wrapTransaction(tr));
}
// Creates a paragraph inside the body of the collapsible at the end.
function createParagraphInBody(state: PMEditorState, ctx: PMCommandContext): void {
    const collapsiblePos: number = findCollapsibleAncestorPos(state);
    if (collapsiblePos === -1) {
        return;
    }
    const collapsibleNode: PMNode | null = state.doc.nodeAt(collapsiblePos);
    if (!collapsibleNode) {
        return;
    }
    const bodyNode: PMNode | null = getBodyNode(collapsibleNode);
    if (!bodyNode) {
        return;
    }
    const paragraphType: PMNodeType | undefined = state.schema.nodes['paragraph'];
    if (!paragraphType) {
        return;
    }
    const headerNode: PMNode | null = getHeaderNode(collapsibleNode);
    if (!headerNode) {
        return;
    }
    // Calculate body end position
    const bodyStart: number = collapsiblePos + 1 + headerNode.nodeSize + 1;
    // Body already contains one empty block.
    if (bodyNode.childCount === 1 && bodyNode.child(0).textContent.length === 0) {
        const tr: PMTransaction = state.tr;
        tr.setSelection(TextSelection.near(tr.doc.resolve(bodyStart + 1)));
        ctx.dispatch(wrapTransaction(tr));
        return;
    }
    // Body contains content → create a new paragraph at the beginning.
    const tr: PMTransaction = state.tr;
    const paragraph: PMNode = paragraphType.create();
    tr.insert(bodyStart, paragraph);
    // Move cursor to the start of the new paragraph
    tr.setSelection(TextSelection.near(tr.doc.resolve(bodyStart + 1)));
    ctx.dispatch(wrapTransaction(tr));
}

function expandAndMoveToBody(state: PMEditorState, ctx: PMCommandContext): void {
    const collapsiblePos: number = findCollapsibleAncestorPos(state);
    if (collapsiblePos === -1) {
        return;
    }

    const collapsibleNode: PMNode | null = state.doc.nodeAt(collapsiblePos);
    if (!collapsibleNode) {
        return;
    }

    const headerNode: PMNode | null = getHeaderNode(collapsibleNode);
    if (!headerNode) {
        return;
    }

    const bodyNode: PMNode | null = getBodyNode(collapsibleNode);
    if (!bodyNode) {
        return;
    }

    const paragraphType: PMNodeType | undefined = state.schema.nodes['paragraph'];
    if (!paragraphType) {
        return;
    }

    const tr: PMTransaction = state.tr;

    // Expand if collapsed.
    if (isCollapsibleCollapsed(collapsibleNode)) {
        tr.setNodeMarkup(collapsiblePos, undefined, {
            ...collapsibleNode.attrs,
            collapsed: false
        });
    }

    const newCollapsibleNode: PMNode | null = tr.doc.nodeAt(collapsiblePos);
    if (!newCollapsibleNode) {
        return;
    }

    const newBodyNode: PMNode | null = getBodyNode(newCollapsibleNode);
    if (!newBodyNode) {
        return;
    }

    const bodyStart: number = collapsiblePos + 1 + headerNode.nodeSize + 1;

    // Empty body: create exactly one empty paragraph.
    if (newBodyNode.childCount === 0) {
        tr.insert(bodyStart, paragraphType.create());
    }

    // Move into the first body paragraph.
    tr.setSelection(TextSelection.near(
        tr.doc.resolve(bodyStart + 1)
    ));

    ctx.dispatch(wrapTransaction(tr));
}

//  Calls the split collapsible command if available, otherwise delegates to fallthrough.
function splitCollapsibleIfAvailable(state: PMEditorState, ctx: PMCommandContext): boolean {
    if (splitCollapsibleCommand.canExecute && splitCollapsibleCommand.canExecute(ctx)) {
        splitCollapsibleCommand.execute(ctx);
        return true;
    }
    return false;
}

function splitBodyBlockAtCursor(state: PMEditorState, ctx: PMCommandContext): boolean {
    const bodyPos: number = findCollapsibleBodyAncestorPos(state);
    if (bodyPos === -1) {
        return false;
    }
    const { $from } = state.selection;
    // Find the innermost block inside the body that contains the cursor.
    let blockDepth: number = -1;
    for (let d: number = $from.depth; d > 0; d--) {
        const node: PMNode = $from.node(d);
        if (node && node.type && node.type.spec && node.type.spec.group &&
            String(node.type.spec.group).indexOf('block') !== -1) {
            blockDepth = d;
            break;
        }
    }
    if (blockDepth === -1) {
        return false;
    }
    const blockStart: number = $from.before(blockDepth);
    const blockNode: PMNode = $from.node(blockDepth);
    const insideOffset: number = $from.pos - blockStart - 1; // offset within block content
    if (insideOffset !== blockNode.content.size) {
        return false;
    }
    // Insert a new empty paragraph immediately after this block in the body.
    const paragraphType: PMNodeType | undefined = state.schema.nodes['paragraph'];
    if (!paragraphType) {
        return false;
    }
    const insertPos: number = blockStart + blockNode.nodeSize;
    const tr: PMTransaction = state.tr;
    tr.insert(insertPos, paragraphType.create());
    tr.setSelection(TextSelection.near(tr.doc.resolve(insertPos + 1)));
    ctx.dispatch(wrapTransaction(tr));
    return true;
}

export const enterCollapsibleCommand: PMCommandInternal<void> = {
    name: 'enterCollapsible',
    meta: { label: 'Enter Collapsible', category: 'structure' },
    canExecute(ctx: PMCommandContext): boolean {
        return findCollapsibleHeaderAncestorPos(ctx.pmState) !== -1
            || findCollapsibleBodyAncestorPos(ctx.pmState) !== -1;
    },

    execute(ctx: PMCommandContext): void {
        const state: PMEditorState = ctx.pmState;
        const collapsiblePos: number = findCollapsibleAncestorPos(state);
        if (collapsiblePos === -1) {
            return;
        }

        const collapsibleNode: PMNode | null = state.doc.nodeAt(collapsiblePos);
        if (!collapsibleNode) {
            return;
        }

        const collapsed: boolean = isCollapsibleCollapsed(collapsibleNode);
        const atStart: boolean = isHeaderAtStart(state);
        const atEnd: boolean = isHeaderAtEnd(state);
        const inMiddle: boolean = isHeaderInMiddle(state);
        const bodyEmpty: boolean = getBodyTextLength(collapsibleNode) === 0;
        const collapsibleExpanded: boolean = isCollapsibleExpanded(collapsibleNode);
        if (collapsibleExpanded && isInsideBody(state)) {
            if (splitBodyBlockAtCursor(state, ctx)) {
                return;
            }
            return;
        }
        // Scenario 1: Collapsed header at end + empty body → expand + move to body
        if (collapsed && atEnd && bodyEmpty) {
            expandAndMoveToBody(state, ctx);
            return;
        }
        // Scenario 2: Collapsed header at end + body with content → create paragraph below collapsible
        if (collapsed && atEnd && !bodyEmpty) {
            createParagraphBelow(state, ctx);
            return;
        }
        // Scenario 3: Collapsed header at start → split at header start
        //   - inserts an empty paragraph above the collapsible
        //   - cursor lands inside the collapsible header at trigger start
        if (collapsed && atStart) {
            splitAtHeaderStart(state, ctx);
            return;
        }
        // Scenario 4: Collapsed header in middle → split collapsible into two
        if (collapsed && inMiddle) {
            if (!splitCollapsibleIfAvailable(state, ctx)) {
                // Fallthrough if split not available
                return;
            }
            return;
        }
        // Scenario 5: Expanded header at end → create paragraph inside body
        if (!collapsed && atEnd) {
            createParagraphInBody(state, ctx);
            return;
        }
        // Scenario 6: Expanded header at start → split at header start
        //   - same behavior as Scenario 3 but for expanded collapsibles
        //   - inserts an empty paragraph above, cursor stays in the header
        if (!collapsed && atStart) {
            splitAtHeaderStart(state, ctx);
            return;
        }
        // Scenario 7: Expanded header in middle → split collapsible
        if (!collapsed && inMiddle) {
            if (!splitCollapsibleIfAvailable(state, ctx)) {
                // Fallthrough if split not available
                return;
            }
            return;
        }
        // Default: no-op (allow fallthrough)
    }
};
