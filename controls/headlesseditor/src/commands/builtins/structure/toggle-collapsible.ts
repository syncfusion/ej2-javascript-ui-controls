/**
 * Public facade: wrap the current block in a collapsible
 * container, or unwrap it if the selection is already inside one.
 *
 * When wrapping, the current block becomes the trigger child of the collapsible
 * node. The trigger must be either a `heading` (any level 1-6) or a `paragraph`.
 *
 * When unwrapping, the collapsible node is dissolved and its children are hoisted
 * up one level into the parent — equivalent to pmLift on the wrapper.
 *
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMNodeType, PMNode, PMSchema, TextSelection, PMSelection } from '../../../pm/pm-guard';
import { DefaultIdGenerator } from '../../../utils/id-generator';

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * Payload for the toggleCollapsible command.
 *
 * @property {'heading' | 'paragraph'} triggerType - The node type of the
 *   collapsible trigger child. This determines which block type is used as the
 *   first child of the created collapsible container.
 * @property {number} [level] - Heading level (1-6). Only used when triggerType
 *   is 'heading'. Defaults to 1.
 */
export interface ToggleCollapsiblePayload {
    triggerType: 'heading' | 'paragraph';
    level?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const idGen: DefaultIdGenerator = new DefaultIdGenerator();

/**
 * Walks the resolved position's ancestor chain from innermost to outermost.
 * Returns the document position of the `collapsible` node if one is found,
 * otherwise returns -1.
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @returns {number} Document position of the collapsible ancestor, or -1.
 */
function findCollapsibleAncestorPos(pmState: PMEditorState): number {
    const { $from } = pmState.selection;
    for (let d: number = $from.depth; d >= 0; d--) {
        if ($from.node(d).type.name === 'collapsible') {
            return $from.before(d);
        }
    }
    return -1;
}

/**
 * Builds a new collapsible node from the current selection block using the
 * three-node structure:
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @param {PMCommandContext} ctx - Command execution context.
 * @param {ToggleCollapsiblePayload} payload - Command payload.
 * @returns {void} Nothing.
 */
function wrapInCollapsible(
    pmState: PMEditorState,
    ctx: PMCommandContext,
    payload: ToggleCollapsiblePayload
): void {
    const schema: PMSchema = pmState.schema;
    const collapsibleType: PMNodeType = schema.nodes['collapsible'];
    const collapsibleHeaderType: PMNodeType = schema.nodes['collapsibleHeader'];
    const collapsibleBodyType: PMNodeType = schema.nodes['collapsibleBody'];
    const triggerType: PMNodeType = schema.nodes[payload.triggerType];
    const paragraphType: PMNodeType = schema.nodes['paragraph'];

    const { $from } = pmState.selection;

    // Find the top-level block that the selection starts inside
    // (depth=1 is a direct child of the document)
    const blockDepth: number = $from.depth > 0 ? 1 : 0;
    const blockStart: number = $from.start(blockDepth) - 1; // pos of node open
    const blockNode: PMNode = $from.node(blockDepth);

    // Build the trigger node — preserve inline content from the current block
    const triggerAttrs: Record<string, unknown> = {};
    if (payload.triggerType === 'heading') {
        triggerAttrs['level'] = payload.level ?? 1;
    }
    const triggerNode: PMNode = triggerType.create(
        triggerAttrs as Parameters<PMNodeType['create']>[0],
        blockNode.content
    );

    // Wrap trigger in collapsibleHeader
    const headerNode: PMNode = collapsibleHeaderType.create(null, [triggerNode]);

    // Build a placeholder body paragraph and wrap in collapsibleBody
    const bodyParagraph: PMNode = paragraphType.create();
    const bodyNode: PMNode = collapsibleBodyType.create(null, [bodyParagraph]);

    // Build the collapsible wrapper with header + body as children
    const collapsibleAttrs: Record<string, unknown> = {
        id: idGen.generate(),
        collapsed: false
    };
    const collapsibleNode: PMNode = collapsibleType.create(
        collapsibleAttrs as Parameters<PMNodeType['create']>[0],
        [headerNode, bodyNode]
    );

    // Replace the current block with the new collapsible
    const blockEnd: number = blockStart + blockNode.nodeSize;
    const tr: PMTransaction = pmState.tr.replaceWith(blockStart, blockEnd, collapsibleNode);
    // Selection restore with the same shape
    // re-establish the selection if the original positions lived inside the
    // replaced inner content (strictly inside `[blockStart+1, blockEnd-1)`);
    // boundary positions (`blockStart`, `blockEnd`) are invalid text paths
    // in the new doc, so leave them unmapped and let PM pick a fallback.
    const sel: PMSelection = pmState.selection;
    const oldContentStart: number = blockStart + 1;
    const newContentStart: number = blockStart + 3;
    const oldContentEnd: number = blockEnd - 1;
    if (sel.from >= oldContentStart && sel.to <= oldContentEnd && sel.from <= sel.to) {
        const fromOffset: number = sel.from - oldContentStart;
        const toOffset: number = sel.to - oldContentStart;
        const newFrom: number = newContentStart + fromOffset;
        const newTo: number = newContentStart + toOffset;
        tr.setSelection(TextSelection.create(tr.doc, newFrom, newTo));
    }
    ctx.dispatch(wrapTransaction(tr));
}

/**
 * Dissolves the collapsible wrapper at `collapsiblePos`, hoisting the
 * content of `collapsibleHeader` and `collapsibleBody` up one level.
 *
 * @param {PMEditorState} pmState - Current ProseMirror state.
 * @param {PMCommandContext} ctx - Command execution context.
 * @param {number} collapsiblePos - Document position of the collapsible node.
 * @returns {void} Nothing.
 */
function unwrapCollapsible(
    pmState: PMEditorState,
    ctx: PMCommandContext,
    collapsiblePos: number
): void {
    const collapsibleNode: PMNode | null = pmState.doc.nodeAt(collapsiblePos);
    if (!collapsibleNode) { return; }

    // Collect grandchildren: children of collapsibleHeader and collapsibleBody
    const hoisted: PMNode[] = [];
    collapsibleNode.content.forEach((slotNode: PMNode) => {
        slotNode.content.forEach((inner: PMNode) => {
            hoisted.push(inner);
        });
    });

    const from: number = collapsiblePos;
    const to: number = collapsiblePos + collapsibleNode.nodeSize;

    if (hoisted.length === 0) {
        const tr: PMTransaction = pmState.tr.delete(from, to);
        ctx.dispatch(wrapTransaction(tr));
        return;
    }

    // Unwrap replaces the entire collapsible with the hoisted children
    // directly. Inner positions inside the slot wrappers (collapsibleHeader /
    // collapsibleBody open/close tokens) collapse during the step's mapping,
    // so a flat replaceWith here would move the cursor to the end of the
    // hoisted block, dropping the user's range selection. Restore what we
    // can: positions strictly inside `[from+1, to-1)` that resolve to text
    // on the new doc.
    const tr: PMTransaction = pmState.tr.replaceWith(from, to, hoisted);
    const sel: PMSelection = pmState.selection;
    const selFrom: number = sel.from;
    const selTo: number = sel.to;
    const innerFrom: number = from + 1;
    const innerTo: number = to - 1;
    if (selFrom >= innerFrom && selTo <= innerTo && selFrom <= selTo) {
        const newFrom: number = selFrom - 2;
        const newTo: number = selTo - 2;
        if (newFrom >= 0 && newTo >= newFrom && newTo <= tr.doc.content.size) {
            tr.setSelection(TextSelection.create(tr.doc, newFrom, newTo));
        }
    }
    ctx.dispatch(wrapTransaction(tr));
}

// ── Command ───────────────────────────────────────────────────────────────────

export const toggleCollapsibleCommand: PMCommandInternal<ToggleCollapsiblePayload> = {
    name: 'toggleCollapsible',
    meta: { label: 'Toggle Collapsible', category: 'structure' },

    canExecute(ctx: PMCommandContext, payload: ToggleCollapsiblePayload): boolean {
        const schema: PMSchema = ctx.pmState.schema;
        if (!schema.nodes['collapsible']) { return false; }
        if (!schema.nodes['collapsibleHeader']) { return false; }
        if (!schema.nodes['collapsibleBody']) { return false; }
        if (!schema.nodes[payload.triggerType]) { return false; }
        return true;
    },

    execute(ctx: PMCommandContext, payload: ToggleCollapsiblePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const collapsiblePos: number = findCollapsibleAncestorPos(pmState);

        if (collapsiblePos !== -1) {
            unwrapCollapsible(pmState, ctx, collapsiblePos);
        } else {
            wrapInCollapsible(pmState, ctx, payload);
        }
    }
};
