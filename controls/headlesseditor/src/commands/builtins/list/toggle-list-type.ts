/**
 * toggle-list-type.ts — Internal infrastructure command.
 *
 * Wraps the selection in a list node when not in a list; lifts out when
 * already inside a list of the same type.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { pmWrapInList, pmLift, ResolvedPos } from '../../../pm/pm-guard';
import { DefaultIdGenerator } from '../../../utils/id-generator';
import { buildListAttributes } from './list-style-defaults';
import { normalizeBlocksToParagraph } from '../structure/clear-nodes';
import { PMNodeType, PMSchema, PMEditorState, PMTransaction, PMNode, PMFragment, PMMark, PMStep, PMCommand, TextSelection, PMSelection } from '../../../pm/pm-guard';

export interface ToggleListTypePayload {
    listType: 'bullet' | 'ordered' | 'task';
    /** When true, active marks are preserved on the new list item after toggling. */
    keepMarks?: boolean;
}

/** PM node type names for the three logical list types. */
const LIST_TYPE_MAP: Record<string, string> = {
    bullet: 'bulletList',
    ordered: 'orderedList',
    task: 'taskList'
};

/** PM node type names for the items living inside each list type. */
const ITEM_TYPE_MAP: Record<string, string> = {
    bullet: 'listItem',
    ordered: 'listItem',
    task: 'taskItem'
};

/** All PM node type names that count as a list container. */
const ALL_LIST_NAMES: ReadonlySet<string> = new Set<string>([
    'bulletList', 'orderedList', 'taskList'
]);

/** All PM node type names that count as a list item. */
const ALL_ITEM_NAMES: ReadonlySet<string> = new Set<string>([
    'listItem', 'taskItem'
]);

const idGen: DefaultIdGenerator = new DefaultIdGenerator();

/**
 * Locate the outermost list container ancestor of the current selection and
 * the position of the nearest list-item ancestor. The container is the
 * topmost ancestor whose type is a list — that is the node whose type and
 * children we want to convert.
 *
 * @param {PMEditorState} pmState - The current ProseMirror editor state.
 * @returns {{ listPos: number, listNode: PMNode, itemPos: number } | null}
 *   Position and node of the enclosing list container plus the position of
 *   the nearest list item, or `null` when the cursor is not in a list.
 */
function findEnclosingList(pmState: PMEditorState): {
    listPos: number;
    listNode: PMNode;
    itemPos: number;
} | null {
    const { $from } = pmState.selection;
    let nearestItemPos: number = -1;
    let listPos: number = -1;
    let listNode: PMNode | null = null;

    for (let d: number = $from.depth; d >= 0; d--) {
        const node: PMNode = $from.node(d);
        if (ALL_ITEM_NAMES.has(node.type.name) && nearestItemPos === -1) {
            nearestItemPos = $from.before(d);
        }
        if (ALL_LIST_NAMES.has(node.type.name) && listNode === null) {
            listPos = $from.before(d);
            listNode = node;
        }
    }

    if (listPos === -1 || listNode === null) {
        return null;
    }
    return {
        listPos,
        listNode,
        itemPos: nearestItemPos === -1 ? listPos : nearestItemPos
    };
}

/**
 * True when the cursor's `$from` has a `collapsibleHeader` anywhere in its
 * ancestor chain. Used by `canExecute` to disable list toggles that would
 * otherwise attempt to rewrite a heading/paragraph nested inside the
 * header slot of a collapsible section.
 *
 * @param {PMEditorState} pmState - The current PM state.
 * @returns {boolean} True when the cursor is inside a `collapsibleHeader`.
 * @hidden
 */
function isInsideCollapsibleHeader(pmState: PMEditorState): boolean {
    const $from: ResolvedPos = pmState.selection.$from;
    for (let d: number = $from.depth; d >= 0; d--) {
        const ancestor: PMNode = $from.node(d);
        if (ancestor.type.name === 'collapsibleHeader') {
            return true;
        }
    }
    const $to: ResolvedPos = pmState.selection.$to;
    for (let d: number = $to.depth; d >= 0; d--) {
        const ancestor: PMNode = $to.node(d);
        if (ancestor.type.name === 'collapsibleHeader') {
            return true;
        }
    }
    return false;
}

/**
 * Build a converted list node from an existing one, replacing the container
 * type and each direct item's type where the type differs. Nested lists
 * (lists living inside list items) are converted recursively so the whole
 * subtree is consistent with the target type.
 *
 * The returned node is fully valid against the schema, so it can be passed
 * to `tr.replaceWith` as a single replace step. The alternative — calling
 * `setNodeMarkup` on the container first and then on each child — is
 * rejected by PM because the intermediate state (e.g. `taskList` with
 * `listItem` children) violates the schema's content expression.
 *
 * @param {PMNode} oldList - The existing list node to convert.
 * @param {PMNodeType} targetListTypeNode - Target list node type.
 * @param {PMNodeType} targetItemTypeNode - Target item node type.
 * @param {Object} newListAttrs - Fresh list-level attributes.
 * @param {boolean} isTaskItem - Indicates whether converted items
 * should be created as task items with a default checked state.
 * @param {string=} targetListType - Logical target list type
 * ('bullet' | 'ordered') for nested lists; omitted for task lists.
 * @returns {PMNode} A fully-constructed replacement list node.
 */
function buildConvertedList(
    oldList: PMNode,
    targetListTypeNode: PMNodeType,
    targetItemTypeNode: PMNodeType,
    newListAttrs: Record<string, unknown>,
    isTaskItem: boolean,
    targetListType?: 'bullet' | 'ordered'
): PMNode {
    const newItems: PMNode[] = [];
    oldList.forEach((child: PMNode): void => {
        if (ALL_LIST_NAMES.has(child.type.name)) {
            // Nested list directly under the list container.
            newItems.push(buildConvertedList(
                child,
                targetListTypeNode,
                targetItemTypeNode,
                targetListType
                    ? buildListAttributes(targetListType, idGen.generate())
                    : { id: idGen.generate() },
                isTaskItem,
                targetListType
            ));
            return;
        }
        if (ALL_ITEM_NAMES.has(child.type.name)) {
            const itemAttrs: Record<string, unknown> = {
                ...child.attrs,
                id: child.attrs['id'] ?? idGen.generate()
            };
            if (isTaskItem) {
                itemAttrs['checked'] = false;
            } else {
                delete itemAttrs['checked'];
            }
            // Rebuild the list item's content so that nested lists are
            // converted recursively instead of being copied unchanged.
            const newItemContent: PMNode[] = [];
            child.forEach((itemChild: PMNode): void => {
                if (ALL_LIST_NAMES.has(itemChild.type.name)) {
                    newItemContent.push(buildConvertedList(
                        itemChild,
                        targetListTypeNode,
                        targetItemTypeNode,
                        targetListType
                            ? buildListAttributes(targetListType, idGen.generate())
                            : { id: idGen.generate() },
                        isTaskItem,
                        targetListType
                    ));
                    return;
                }
                newItemContent.push(itemChild);
            });
            newItems.push(
                targetItemTypeNode.create(
                    itemAttrs,
                    PMFragment.from(newItemContent)
                )
            );
            return;
        }
        newItems.push(child);
    });
    return targetListTypeNode.create(
        newListAttrs,
        PMFragment.from(newItems)
    );
}

/**
 * Convert an existing list container in place to a different list type.
 *
 * Builds a fully-constructed replacement list (target container + converted
 * items, recursively for nested lists) and replaces the old list in a single
 * step. This avoids the invalid intermediate state that `setNodeMarkup` on
 * the container would create.
 *
 * Selection preservation: the replacement preserves every child position
 * verbatim (items keep their content; only node types and list attrs
 * change), so document offsets inside the list are unchanged by the
 * replace step. Positions strictly inside a replaced range are discarded
 * by PM's step mapping though, which collapses the selection. Since the
 * mapping is a no-op for content positions, restore the original
 * selection (clamped to the new list's range) after the replace.
 *
 * @param {PMTransaction} tr - The transaction to mutate.
 * @param {PMSchema} schema - The PM schema (for node-type lookup).
 * @param {PMEditorState} pmState - The current PM state (for the selection to preserve).
 * @param {number} listPos - Position of the list container node to convert.
 * @param {PMNode} listNode - The existing list node.
 * @param {'bullet' | 'ordered' | 'task'} targetListType - Logical target list type.
 * @returns {void} Nothing — `tr` is mutated in place.
 */
function convertListInPlace(
    tr: PMTransaction,
    schema: PMSchema,
    pmState: PMEditorState,
    listPos: number,
    listNode: PMNode,
    targetListType: 'bullet' | 'ordered' | 'task'
): void {
    const targetListName: string = LIST_TYPE_MAP[`${targetListType}`];
    const targetItemName: string = ITEM_TYPE_MAP[`${targetListType}`];
    const targetListTypeNode: PMNodeType = Object.prototype.hasOwnProperty.call(schema.nodes, targetListName)
        ? schema.nodes[`${targetListName}`]
        : undefined;
    const targetItemTypeNode: PMNodeType = Object.prototype.hasOwnProperty.call(schema.nodes, targetItemName)
        ? schema.nodes[`${targetItemName}`]
        : undefined;
    if (!targetListTypeNode || !targetItemTypeNode) { return; }

    // Drop the list id and start fresh — a recycled id avoids stale
    // duplicate-id bookkeeping across the document. Conversions always
    // adopt the target type's default marker style; ordered lists also
    // reset `order`. Task lists carry no list-level attrs.
    const newListAttrs: Record<string, unknown> = targetListType === 'task'
        ? { id: idGen.generate() }
        : buildListAttributes(targetListType, idGen.generate());

    const replacement: PMNode = buildConvertedList(
        listNode,
        targetListTypeNode,
        targetItemTypeNode,
        newListAttrs,
        targetListType === 'task',
        targetListType === 'task' ? undefined : targetListType
    );
    tr.replaceWith(listPos, listPos + listNode.nodeSize, replacement);

    // Restore the selection collapsed by the replace step. Content offsets
    // are identical before/after (the replacement copies all content
    // verbatim), so the original from/to still resolve inside the new list.
    // Clamp defensively in case future item-type changes alter sizes (e.g.
    // task items carry extra content).
    const sel: PMSelection = pmState.selection;
    const newFrom: number = sel.from;
    const newTo: number = sel.to;
    const endPos: number = listPos + replacement.nodeSize;
    if (newFrom >= listPos && newTo <= endPos && newFrom <= newTo) {
        tr.setSelection(TextSelection.create(tr.doc, newFrom, newTo));
    }
}

/**
 * True when the current selection covers any non-paragraph, non-list block
 * (top-level OR nested) that clearNodes can convert.
 *
 * Used by `canExecute` so that toggleList on a heading (including one nested
 * inside a blockquote) still reports as available — `execute` will normalize
 * the block to a paragraph before applying `wrapInList`.
 *
 * @param {PMEditorState} pmState - The current PM state.
 * @returns {boolean} True when at least one block in the selection is a
 * candidate for normalization.
 * @hidden
 */
function canNormalizeTopLevelBlockToParagraph(pmState: PMEditorState): boolean {
    const paraType: PMNodeType | undefined = Object.prototype.hasOwnProperty.call(pmState.schema.nodes, 'paragraph')
        ? pmState.schema.nodes['paragraph']
        : undefined;
    if (!paraType) { return false; }
    const { from, to } = pmState.selection;
    let ok: boolean = false;
    pmState.doc.nodesBetween(from, to, (node: PMNode): boolean => {
        if (ok) { return false; }
        if (!node.isBlock) { return true; }
        if (node.type === paraType) { return true; }
        ok = true;
        return false;
    });
    return ok;
}

/**
 * Apply post-wrap tweaks to `tr`: `keepMarks` and the task-list
 * paragraph→taskItem conversion. Shared between the direct-wrap path and the
 * normalize-then-wrap path so behavior is identical regardless of which path
 * was taken.
 *
 * @param {PMTransaction} tr - The accumulating transaction.
 * @param {PMEditorState} pmState - The original PM state (for storedMarks).
 * @param {ToggleListTypePayload} payload - The toggle payload.
 * @param {PMNodeType} listNodeType - The list container node type.
 * @param {PMNodeType} itemNodeType - The list item node type for the target.
 * @returns {void} Nothing — `tr` is mutated in place.
 * @hidden
 */
function applyPostWrapTweaks(
    tr: PMTransaction,
    pmState: PMEditorState,
    payload: ToggleListTypePayload,
    listNodeType: PMNodeType,
    itemNodeType: PMNodeType
): void {
    if (payload.keepMarks) {
        const marks: readonly PMMark[] = pmState.storedMarks ?? pmState.selection.$from.marks();
        tr.ensureMarks(marks);
    }

    // When wrapping into a taskList, pmWrapInList nests the selected blocks
    // directly inside taskList — but taskList requires taskItem children, not
    // raw paragraphs. Walk the post-wrap doc and convert each direct child of
    // the new taskList from paragraph to taskItem via setNodeMarkup.
    if (payload.listType === 'task') {
        tr.doc.nodesBetween(tr.selection.from, tr.selection.to, (node: PMNode, pos: number): boolean => {
            if (tr.doc.resolve(pos).parent.type === listNodeType &&
                node.type !== itemNodeType) {
                tr.setNodeMarkup(pos, itemNodeType, { checked: false });
            }
            return true;
        });
    }
}

export const toggleListTypeCommand: PMCommandInternal<ToggleListTypePayload> = {
    name: 'toggleListType',
    meta: { label: 'Toggle List', category: 'list' },

    canExecute(ctx: PMCommandContext, payload: ToggleListTypePayload): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        const listTypeName: string = LIST_TYPE_MAP[payload.listType];
        const listNodeType: PMNodeType | undefined = Object.prototype.hasOwnProperty.call(schema.nodes, listTypeName)
            ? schema.nodes[`${listTypeName}`]
            : undefined;
        if (!listNodeType) { return false; }

        // List toggling is disabled inside a `collapsibleHeader` regardless
        // of which list type is requested. The header slot accepts exactly
        // one heading OR one paragraph, and rewriting either as a listItem
        // is not the supported behavior for the collapsible extension.
        if (isInsideCollapsibleHeader(pmState)) { return false; }

        const enclosing: ReturnType<typeof findEnclosingList> = findEnclosingList(pmState);

        if (!enclosing) {
            const itemTypeName: string = ITEM_TYPE_MAP[payload.listType];
            const itemNodeType: PMNodeType | undefined = Object.prototype.hasOwnProperty.call(schema.nodes, itemTypeName)
                ? schema.nodes[`${itemTypeName}`]
                : undefined;
            if (!itemNodeType) { return false; }
            if (pmWrapInList(listNodeType)(pmState)) { return true; }
            // heading/codeBlock can be converted to
            // a list by first normalizing it to a paragraph (clearNodes) and
            // then wrapping. So canExecute is true whenever the current
            // top-level block can be normalized to a paragraph; execute()
            // will fail (no dispatch) only if the schema rejects both.
            return canNormalizeTopLevelBlockToParagraph(pmState);
        }

        if (enclosing.listNode.type === listNodeType) {
            return pmLift(pmState);
        }

        // Cross-list conversion is always available when both node types
        // exist in the schema (the target type is verified above).
        return true;
    },

    execute(ctx: PMCommandContext, payload: ToggleListTypePayload): void {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        const listTypeName: string = LIST_TYPE_MAP[payload.listType];
        const listNodeType: PMNodeType | undefined = Object.prototype.hasOwnProperty.call(schema.nodes, listTypeName)
            ? schema.nodes[`${listTypeName}`]
            : undefined;
        if (!listNodeType) { return; }

        const enclosing: ReturnType<typeof findEnclosingList> = findEnclosingList(pmState);

        // Case 1: cursor is not in any list — wrap selection in the target list.
        if (!enclosing) {
            const itemTypeName: string = ITEM_TYPE_MAP[payload.listType];
            const itemNodeType: PMNodeType | undefined = Object.prototype.hasOwnProperty.call(schema.nodes, itemTypeName)
                ? schema.nodes[`${itemTypeName}`]
                : undefined;
            if (!itemNodeType) { return; }

            // Fresh list containers adopt their type's default marker style
            // (disc / decimal). Task lists carry no list-level attrs.
            const listAttrs: Record<string, unknown> = payload.listType === 'task'
                ? { id: idGen.generate() }
                : buildListAttributes(payload.listType, idGen.generate());

            // Try the direct wrap first (preserves existing behavior for
            // paragraph → list, which is the common case).
            const directWrap: PMCommand = pmWrapInList(listNodeType, listAttrs);
            if (directWrap(pmState)) {
                directWrap(pmState, (tr: PMTransaction): void => {
                    applyPostWrapTweaks(tr, pmState, payload, listNodeType, itemNodeType);
                    ctx.dispatch(wrapTransaction(tr));
                });
                return;
            }

            // Direct wrap failed (e.g. cursor is in a heading/codeBlock).
            // normalize the current block to a paragraph first,
            // then wrap. Both operations land on a single `tr` and dispatch
            // exactly once.
            const tr: PMTransaction = pmState.tr;
            normalizeBlocksToParagraph(tr, schema, pmState);
            if (tr.docChanged) {
                // tr which contains the normalization. But pmWrapInList() requires a PM EditorState, not just a transaction.
                const normalizedState: PMEditorState = pmState.apply(tr);
                const wrapOnNormalized: PMCommand = pmWrapInList(listNodeType, listAttrs);
                if (wrapOnNormalized(normalizedState)) {
                    wrapOnNormalized(normalizedState, (wrapTr: PMTransaction): void => {
                        // Replay the wrap step(s) onto our accumulating tr so
                        // the final dispatch is a single transaction. We do
                        // not dispatch wrapTr directly.
                        for (const step of Array.from(wrapTr.steps) as PMStep[]) {
                            tr.step(step);
                        }
                        // Re-apply keepMarks on the accumulating tr (it would
                        // otherwise be lost between the two steps).
                        if (payload.keepMarks) {
                            const marks: readonly PMMark[] = pmState.storedMarks ?? pmState.selection.$from.marks();
                            tr.ensureMarks(marks);
                        }
                        applyPostWrapTweaks(tr, pmState, payload, listNodeType, itemNodeType);
                    });
                }
            }
            if (tr.docChanged) {
                ctx.dispatch(wrapTransaction(tr));
            }
            return;
        }

        // Case 2: cursor is in a list of the same type — lift (toggle off).
        if (enclosing.listNode.type === listNodeType) {
            pmLift(pmState, (tr: PMTransaction): void => {
                ctx.dispatch(wrapTransaction(tr));
            });
            return;
        }

        // Case 3: cursor is in a different list type — convert in place.
        const tr: PMTransaction = pmState.tr;
        convertListInPlace(tr, schema, pmState, enclosing.listPos, enclosing.listNode, payload.listType);
        if (payload.keepMarks) {
            const marks: readonly PMMark[] = pmState.storedMarks ?? pmState.selection.$from.marks();
            tr.ensureMarks(marks);
        }
        ctx.dispatch(wrapTransaction(tr));
    }
};
