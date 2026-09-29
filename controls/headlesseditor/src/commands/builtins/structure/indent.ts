/**
 * Public indent command.
 *
 * Handles block indentation, list nesting, table-cell indentation and image indentation
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMSchema, PMNode, PMResolvedPos } from '../../../pm/pm-guard';
import { indentListItemCommand } from '../list/indent-list-item';

/** Step value of a single indent (matches the requirement doc: 20px on the DOM side). */
export const INDENT_STEP: number = 1;

/** Set of block-shaped node names that the indent registry recognises. */
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

/**
 * Handler signature used by INDENT_HANDLERS.
 */
type IndentShapeHandler = (
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
 * @param {PMNode} pmNode - PM node to inspect.
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
 * Returns a copy of attrs with the updated indent value.
 *
 * @param {PMNode} pmNode - Node whose attrs to copy.
 * @param {number} indentValue - New indent value to write.
 * @returns {Object} A fresh attrs record with the indent set.
 */
function withIndent(pmNode: PMNode, indentValue: number): Record<string, unknown> {
    return { ...pmNode.attrs, indent: indentValue };
}

/**
 * Increments a node's indent attribute.
 *
 * @param {PMTransaction} transaction - PM transaction to mutate.
 * @param {PMNode} pmNode - The block node to indent.
 * @param {number} absolutePosition - Absolute document position of the block.
 * @returns {PMTransaction} The same transaction, with a `setNodeMarkup` step appended.
 */
function applyMarginLeft(
    transaction: PMTransaction,
    pmNode: PMNode,
    absolutePosition: number
): PMTransaction {
    const nextIndentLevel: number = readIndent(pmNode) + INDENT_STEP;
    return transaction.setNodeMarkup(absolutePosition, undefined, withIndent(pmNode, nextIndentLevel));
}

/**
 * Paragraph inside a table cell that receives indentation.
 */
interface TableCellParagraphTarget {
    readonly node: PMNode;
    readonly absolutePosition: number;
}

/**
 * Finds the first paragraph inside a table cell for indentation.
 *
 * @param {PMNode} tableCellNode - The `tableCell` / `tableHeader` node.
 * @param {number} absolutePosition - Absolute document position of the cell.
 * @returns {TableCellParagraphTarget | null} The indent target, or null when the cell is empty.
 */
function findTableCellParagraphTarget(
    tableCellNode: PMNode,
    absolutePosition: number
): TableCellParagraphTarget | null {
    // A cell's first child sits at `absolutePosition + 1` (just past the opening token).
    const childNode: PMNode | null | undefined = tableCellNode.firstChild;
    if (!childNode) {
        return null;
    }
    const childAbsolutePosition: number = absolutePosition + 1;
    if (childNode.type.name === 'paragraph') {
        return { node: childNode, absolutePosition: childAbsolutePosition };
    }
    // Non-paragraph block child — leave it alone; the cell's children
    // shape is owned by the cell extension. Indent on it would create
    // unexpected layout, so we no-op for non-paragraph children.
    return null;
}

/**
 * Applies indentation within a table cell.
 *
 * @param {PMTransaction} transaction - PM transaction to mutate.
 * @param {PMNode} tableCellNode - The `tableCell` / `tableHeader` node.
 * @param {number} absolutePosition - Absolute document position of the cell.
 * @returns {PMTransaction} The same transaction, with a `setNodeMarkup` step appended when applicable.
 */
function indentTableCell(
    transaction: PMTransaction,
    tableCellNode: PMNode,
    absolutePosition: number
): PMTransaction {
    if (!tableCellNode.childCount) {
        return transaction;
    }
    const paragraphTarget: TableCellParagraphTarget | null =
        findTableCellParagraphTarget(tableCellNode, absolutePosition);
    if (!paragraphTarget) {
        return transaction;
    }
    return applyMarginLeft(
        transaction,
        paragraphTarget.node,
        paragraphTarget.absolutePosition
    );
}

/**
 * Applies indentation to a block image or its containing block.
 *
 * @param {PMTransaction} transaction - PM transaction to mutate.
 * @param {PMEditorState} editorState - The PM editor state (used for the inline walk).
 * @param {PMNode} imageNode - The image node.
 * @param {number} absolutePosition - Absolute document position of the image.
 * @returns {PMTransaction} The same transaction, possibly mutated.
 */
function indentImage(
    transaction: PMTransaction,
    editorState: PMEditorState,
    imageNode: PMNode,
    absolutePosition: number
): PMTransaction {
    const nodeIsInline: boolean = imageNode.attrs ? imageNode.attrs['inline'] === true : false;
    if (!nodeIsInline) {
        // Block image: stamp the image node itself.
        return applyMarginLeft(transaction, imageNode, absolutePosition);
    }
    // Inline image: walk up to the nearest block ancestor.
    // Resolve the position just inside the image so PM's ResolvedPos
    // walks up to the image's parent (block) and beyond.
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
        // Defensive: every ancestor is inline — indent the image itself.
        return applyMarginLeft(transaction, imageNode, absolutePosition);
    }
    const blockAncestorNode: PMNode | null = editorState.doc.nodeAt(blockAncestorPosition);
    if (!blockAncestorNode) { return transaction; }
    return applyMarginLeft(transaction, blockAncestorNode, blockAncestorPosition);
}

// ── the public command ──────────────────────────────────────────────────────

/**
 * Block-shape dispatcher.
 *
 * Each entry maps a node type name to a handler with the signature
 * declared as `IndentShapeHandler` above.
 *
 * Public so it can be unit-tested directly without going through the
 * full command dispatch path.
 */
const INDENT_HANDLERS: Record<string, IndentShapeHandler> = {
    paragraph: applyMarginLeftToHandler,
    heading: applyMarginLeftToHandler,
    callout: applyMarginLeftToHandler,
    collapsible: applyMarginLeftToHandler,

    tableCell: indentTableCellToHandler,
    tableHeader: indentTableCellToHandler,

    image: indentImageToHandler
};

/**
 * Thin handler wrappers that adapt `(transaction, pmNode, absolutePosition)`
 * to the `(transaction, editorState, pmSchema, pmNode, absolutePosition)`
 * dispatcher signature.
 *
 * Keeping the wrappers separate from the plain helpers makes the
 * underlying logic (`applyMarginLeft`, `indentTableCell` and `indentImage`) directly testable in isolation.
 *
 * @param {PMTransaction} transaction - PM transaction to mutate.
 * @param {PMEditorState} _editorState - Editor state (unused by this handler).
 * @param {PMSchema} _pmSchema - PM schema (unused by this handler).
 * @param {PMNode} pmNode - The block node to indent.
 * @param {number} absolutePosition - Absolute document position of the block.
 * @returns {PMTransaction} The same transaction, with a `setNodeMarkup` step appended.
 */
function applyMarginLeftToHandler(
    transaction: PMTransaction,
    _editorState: PMEditorState,
    _pmSchema: PMSchema,
    pmNode: PMNode,
    absolutePosition: number
): PMTransaction {
    return applyMarginLeft(transaction, pmNode, absolutePosition);
}

/**
 * Dispatcher adapter for `indentTableCell`.
 *
 * @param {PMTransaction} transaction - PM transaction to mutate.
 * @param {PMEditorState} _editorState - Editor state (unused by this handler).
 * @param {PMSchema} _pmSchema - PM schema (unused by this handler).
 * @param {PMNode} pmNode - The `tableCell` / `tableHeader` node.
 * @param {number} absolutePosition - Absolute document position of the cell.
 * @returns {PMTransaction} The same transaction, with a `setNodeMarkup` step appended.
 */
function indentTableCellToHandler(
    transaction: PMTransaction,
    _editorState: PMEditorState,
    _pmSchema: PMSchema,
    pmNode: PMNode,
    absolutePosition: number
): PMTransaction {
    return indentTableCell(transaction, pmNode, absolutePosition);
}

/**
 * Dispatcher adapter for `indentImage`.
 *
 * @param {PMTransaction} transaction - PM transaction to mutate.
 * @param {PMEditorState} editorState - The PM editor state (used for the inline walk).
 * @param {PMSchema} _pmSchema - PM schema (unused by this handler).
 * @param {PMNode} pmNode - The image node.
 * @param {number} absolutePosition - Absolute document position of the image.
 * @returns {PMTransaction} The same transaction, possibly mutated.
 */
function indentImageToHandler(
    transaction: PMTransaction,
    editorState: PMEditorState,
    _pmSchema: PMSchema,
    pmNode: PMNode,
    absolutePosition: number
): PMTransaction {
    return indentImage(transaction, editorState, pmNode, absolutePosition);
}

/**
 * The `indent` command.
 *
 * Public facade reachable via `editor.commands.indent()` once the
 * `indentOutdentExtension` has been registered. The command has no
 * payload; it walks the active selection and bumps the `indent`
 * attribute on every supported block shape.
 *
 * The "Do Nothing" baseline ONLY applies to outdent. Indent always
 * proceeds when the selection contains at least one indentable node.
 */
export const indentCommand: PMCommandInternal<void> = {
    name: 'indent',
    meta: { label: 'Indent', category: 'structure' },

    canExecute(commandContext: PMCommandContext): boolean {
        const editorState: PMEditorState = commandContext.pmState;
        const { from: selectionFrom, to: selectionTo } = editorState.selection;
        let hasIndentableShape: boolean = false;
        editorState.doc.nodesBetween(selectionFrom, selectionTo, (pmNode: PMNode): void => {
            if (PLAIN_BLOCK_NAMES.has(pmNode.type.name)
                || LIST_ITEM_NAMES.has(pmNode.type.name)
                || TABLE_CELL_NAMES.has(pmNode.type.name)
                || pmNode.type.name === IMAGE_NAME) {
                hasIndentableShape = true;
            }
        });
        return hasIndentableShape;
    },

    execute(commandContext: PMCommandContext): void {
        const editorState: PMEditorState = commandContext.pmState;
        const pmSchema: PMSchema = editorState.schema;
        const { from: selectionFrom, to: selectionTo } = editorState.selection;

        // Apply indent to selected nodes.
        let transaction: PMTransaction = editorState.tr;
        let listDelegatePending: boolean = false;

        editorState.doc.nodesBetween(selectionFrom, selectionTo, (pmNode: PMNode, absolutePosition: number): void => {
            if (LIST_ITEM_NAMES.has(pmNode.type.name)) {
                listDelegatePending = true;
                return;
            }
            const shapeHandler: IndentShapeHandler | undefined = INDENT_HANDLERS[pmNode.type.name];
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
            indentListItemCommand.execute(commandContext, undefined);
        }
    }
};
