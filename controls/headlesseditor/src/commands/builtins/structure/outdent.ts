/**
 * Public outdent command.
 *
 * Handles block outdenting, list lifting,
 * table-cell outdenting and image outdenting.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMSchema, PMNode, PMResolvedPos } from '../../../pm/pm-guard';
import { outdentListItemCommand } from '../list/outdent-list-item';

/** Step value of a single outdent — must match `INDENT_STEP` in indent.ts. */
export const OUTDENT_STEP: number = 1;

/** Set of block-shaped node names that the outdent registry recognises. */
const PLAIN_BLOCK_NAMES: ReadonlySet<string> = new Set([
    'paragraph',
    'heading',
    'callout',
    'collapsible'
]);

/** List-item-shaped node names: delegate to the list subsystem. */
const LIST_ITEM_NAMES: ReadonlySet<string> = new Set(['listItem', 'taskItem']);

/** Table-cell-shaped node names. */
const TABLE_CELL_NAMES: ReadonlySet<string> = new Set(['tableCell', 'tableHeader']);

/** Image-shaped node name (single block/inline image). */
const IMAGE_NAME: string = 'image';

/** Handler signature used by OUTDENT_HANDLERS. */
type OutdentShapeHandler = (
    transaction: PMTransaction,
    editorState: PMEditorState,
    pmSchema: PMSchema,
    pmNode: PMNode,
    absolutePosition: number
) => PMTransaction;

// ── helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns true when the node belongs to a list item.
 *
 * @param {PMEditorState} editorState - The PM editor state.
 * @param {number} absolutePosition - Absolute document position to inspect.
 * @returns {boolean} `true` when an ancestor is a list item.
 */
function isInsideListItem(
    editorState: PMEditorState,
    absolutePosition: number
): boolean {
    const resolvedPosition: PMResolvedPos = editorState.doc.resolve(absolutePosition);

    for (let depth: number = resolvedPosition.depth; depth >= 0; depth--) {
        const ancestorNode: PMNode = resolvedPosition.node(depth);

        if (LIST_ITEM_NAMES.has(ancestorNode.type.name)) {
            return true;
        }
    }

    return false;
}

/**
 * Returns a normalized indent value (minimum 0).
 *
 * @param {PMNode} pmNode - Node whose `indent` attr to read.
 * @returns {number} The current indent value, normalised to a non-negative integer.
 */
function readIndent(pmNode: PMNode): number {
    const rawIndentValue: unknown = pmNode.attrs ? pmNode.attrs['indent'] : undefined;
    const normalizedIndentValue: number =
        typeof rawIndentValue === 'number' && Number.isFinite(rawIndentValue)
            ? Math.floor(rawIndentValue)
            : 0;
    return normalizedIndentValue < 0 ? 0 : normalizedIndentValue;
}

/**
 * Returns a copy of attrs with the specified indent value.
 *
 * @param {PMNode} pmNode - Node whose attrs to copy.
 * @param {number} indentValue - New indent value to write.
 * @returns {Record<string, unknown>} A fresh attrs record with the indent set.
 */
function withIndent(pmNode: PMNode, indentValue: number): Record<string, unknown> {
    return { ...pmNode.attrs, indent: indentValue };
}

/**
 * Decrements a node's indent when greater than zero.
 *
 * @param {PMTransaction} transaction - PM transaction to mutate.
 * @param {PMNode} pmNode - The block node to outdent.
 * @param {number} absolutePosition - Absolute document position of the block.
 * @returns {PMTransaction} The same transaction, with a `setNodeMarkup` step appended when applicable.
 */
function subtractMarginLeft(
    transaction: PMTransaction,
    pmNode: PMNode,
    absolutePosition: number
): PMTransaction {
    const currentIndentLevel: number = readIndent(pmNode);
    if (currentIndentLevel <= 0) {
        // Already at root indent.
        return transaction;
    }
    const nextIndentLevel: number = currentIndentLevel - OUTDENT_STEP;
    return transaction.setNodeMarkup(absolutePosition, undefined, withIndent(pmNode, nextIndentLevel));
}

/** Paragraph inside a table cell that receives outdent. */
interface TableCellParagraphTarget {
    readonly node: PMNode;
    readonly absolutePosition: number;
}

/**
 * Finds the first paragraph inside a table cell for outdent.
 *
 * @param {PMNode} tableCellNode - The `tableCell` / `tableHeader` node.
 * @param {number} absolutePosition - Absolute document position of the cell.
 * @returns {TableCellParagraphTarget | null} The outdent target, or null when the cell is empty.
 */
function findTableCellParagraphTarget(
    tableCellNode: PMNode,
    absolutePosition: number
): TableCellParagraphTarget | null {
    if (!tableCellNode.childCount) { return null; }
    const childNode: PMNode | null | undefined = tableCellNode.firstChild;
    if (!childNode) { return null; }
    if (childNode.type.name !== 'paragraph') { return null; }
    // First child starts at absolutePosition + 1.
    return { node: childNode, absolutePosition: absolutePosition + 1 };
}

/**
 * Applies outdent within a table cell.
 *
 * @param {PMTransaction} transaction - PM transaction to mutate.
 * @param {PMNode} tableCellNode - The `tableCell` / `tableHeader` node.
 * @param {number} absolutePosition - Absolute document position of the cell.
 * @returns {PMTransaction} The same transaction, with a `setNodeMarkup` step appended when applicable.
 */
function outdentTableCell(
    transaction: PMTransaction,
    tableCellNode: PMNode,
    absolutePosition: number
): PMTransaction {
    const paragraphTarget: TableCellParagraphTarget | null =
        findTableCellParagraphTarget(tableCellNode, absolutePosition);
    if (!paragraphTarget) {
        // No paragraph target.
        return transaction;
    }
    return subtractMarginLeft(transaction, paragraphTarget.node, paragraphTarget.absolutePosition);
}

/**
 * Applies outdent to a block image or its containing block.
 *
 * @param {PMTransaction} transaction - PM transaction to mutate.
 * @param {PMEditorState} editorState - The PM editor state (used for the inline walk).
 * @param {PMNode} imageNode - The image node.
 * @param {number} absolutePosition - Absolute document position of the image.
 * @returns {PMTransaction} The same transaction, possibly mutated.
 */
function outdentImage(
    transaction: PMTransaction,
    editorState: PMEditorState,
    imageNode: PMNode,
    absolutePosition: number
): PMTransaction {
    const nodeIsInline: boolean = imageNode.attrs ? imageNode.attrs['inline'] === true : false;
    if (!nodeIsInline) {
        // Block image: stamp the image node itself.
        return subtractMarginLeft(transaction, imageNode, absolutePosition);
    }
    // Inline image: walk up to the nearest block ancestor.
    const resolvedPosition: PMResolvedPos = editorState.doc.resolve(absolutePosition + 1);
    let blockAncestorPosition: number | null = null;
    for (let ancestorDepth: number = resolvedPosition.depth; ancestorDepth >= 0; ancestorDepth--) {
        const ancestorNode: PMNode = resolvedPosition.node(ancestorDepth);
        const ancestorIsInline: boolean =
            (ancestorNode as unknown as { isInline?: boolean }).isInline === true
            || (ancestorNode.type as unknown as { isInline?: boolean }).isInline === true;
        if (!ancestorIsInline) {
            blockAncestorPosition = resolvedPosition.start(ancestorDepth);
            break;
        }
    }
    if (blockAncestorPosition === null) {
        // Fallback to the image itself.
        return subtractMarginLeft(transaction, imageNode, absolutePosition);
    }
    const blockAncestorNode: PMNode | null = editorState.doc.nodeAt(blockAncestorPosition);
    if (!blockAncestorNode) { return transaction; }
    return subtractMarginLeft(transaction, blockAncestorNode, blockAncestorPosition);
}

// ── the public command ──────────────────────────────────────────────────────

/** Maps node types to outdent handlers. */
const OUTDENT_HANDLERS: Record<string, OutdentShapeHandler> = {

    paragraph: subtractMarginLeftToHandler,
    heading: subtractMarginLeftToHandler,
    callout: subtractMarginLeftToHandler,
    collapsible: subtractMarginLeftToHandler,

    tableCell: outdentTableCellToHandler,
    tableHeader: outdentTableCellToHandler,

    image: outdentImageToHandler
};

/**
 * Adapter wrappers used by OUTDENT_HANDLERS.
 *
 * @param {PMTransaction} transaction - PM transaction to mutate.
 * @param {PMEditorState} _editorState - Editor state (unused by this handler).
 * @param {PMSchema} _pmSchema - PM schema (unused by this handler).
 * @param {PMNode} pmNode - The block node to outdent.
 * @param {number} absolutePosition - Absolute document position of the block.
 * @returns {PMTransaction} The same transaction, with a `setNodeMarkup` step appended when applicable.
 */
function subtractMarginLeftToHandler(
    transaction: PMTransaction,
    _editorState: PMEditorState,
    _pmSchema: PMSchema,
    pmNode: PMNode,
    absolutePosition: number
): PMTransaction {
    return subtractMarginLeft(transaction, pmNode, absolutePosition);
}

/**
 * Dispatcher adapter for `outdentTableCell`.
 *
 * @param {PMTransaction} transaction - PM transaction to mutate.
 * @param {PMEditorState} _editorState - Editor state (unused by this handler).
 * @param {PMSchema} _pmSchema - PM schema (unused by this handler).
 * @param {PMNode} pmNode - The `tableCell` / `tableHeader` node.
 * @param {number} absolutePosition - Absolute document position of the cell.
 * @returns {PMTransaction} The same transaction, with a `setNodeMarkup` step appended when applicable.
 */
function outdentTableCellToHandler(
    transaction: PMTransaction,
    _editorState: PMEditorState,
    _pmSchema: PMSchema,
    pmNode: PMNode,
    absolutePosition: number
): PMTransaction {
    return outdentTableCell(transaction, pmNode, absolutePosition);
}

/**
 * Dispatcher adapter for `outdentImage`.
 *
 * @param {PMTransaction} transaction - PM transaction to mutate.
 * @param {PMEditorState} editorState - The PM editor state (used for the inline walk).
 * @param {PMSchema} _pmSchema - PM schema (unused by this handler).
 * @param {PMNode} pmNode - The image node.
 * @param {number} absolutePosition - Absolute document position of the image.
 * @returns {PMTransaction} The same transaction, possibly mutated.
 */
function outdentImageToHandler(
    transaction: PMTransaction,
    editorState: PMEditorState,
    _pmSchema: PMSchema,
    pmNode: PMNode,
    absolutePosition: number
): PMTransaction {
    return outdentImage(transaction, editorState, pmNode, absolutePosition);
}

/** Applies outdent to all supported nodes in the current selection. */
export const outdentCommand: PMCommandInternal<void> = {
    name: 'outdent',
    meta: { label: 'Outdent', category: 'structure' },

    canExecute(commandContext: PMCommandContext): boolean {
        const editorState: PMEditorState = commandContext.pmState;
        const { from: selectionFrom, to: selectionTo } = editorState.selection;
        let hasOutdentableShape: boolean = false;
        editorState.doc.nodesBetween(selectionFrom, selectionTo, (pmNode: PMNode): void => {
            // Plain block with a positive indent → outdent-able.
            if (PLAIN_BLOCK_NAMES.has(pmNode.type.name) && readIndent(pmNode) > 0) {
                hasOutdentableShape = true;
                return;
            }
            // Table cell with an interior paragraph carrying a positive
            // indent → outdent-able.
            if (TABLE_CELL_NAMES.has(pmNode.type.name)) {
                const paragraphChild: PMNode | null | undefined = pmNode.firstChild;
                if (paragraphChild
                    && paragraphChild.type.name === 'paragraph'
                    && readIndent(paragraphChild) > 0) {
                    hasOutdentableShape = true;
                    return;
                }
            }
            // Images are outdentable when they have a positive indent.
            if (pmNode.type.name === IMAGE_NAME && readIndent(pmNode) > 0) {
                hasOutdentableShape = true;
                return;
            }
            // List outdentability is handled by outdentListItemCommand.
            if (LIST_ITEM_NAMES.has(pmNode.type.name)) {
                hasOutdentableShape = true;
            }
        });
        return hasOutdentableShape;
    },

    execute(commandContext: PMCommandContext): void {
        const editorState: PMEditorState = commandContext.pmState;
        const pmSchema: PMSchema = editorState.schema;
        const { from: selectionFrom, to: selectionTo } = editorState.selection;

        // Phase 1: shape handlers that mutate the transaction directly.
        let transaction: PMTransaction = editorState.tr;
        let listDelegatePending: boolean = false;

        editorState.doc.nodesBetween(selectionFrom, selectionTo, (pmNode: PMNode, absolutePosition: number): void => {
            if (LIST_ITEM_NAMES.has(pmNode.type.name)) {
                listDelegatePending = true;
                return;
            }
            const shapeHandler: OutdentShapeHandler | undefined = OUTDENT_HANDLERS[pmNode.type.name];
            if (!shapeHandler) { return; }
            if (PLAIN_BLOCK_NAMES.has(pmNode.type.name) && isInsideListItem(editorState, absolutePosition)) {
                return;
            }
            transaction = shapeHandler(transaction, editorState, pmSchema, pmNode, absolutePosition);
        });

        if (transaction.docChanged) {
            commandContext.dispatch(wrapTransaction(transaction));
        }
        if (listDelegatePending) {
            outdentListItemCommand.execute(commandContext, undefined);
        }
    }
};
