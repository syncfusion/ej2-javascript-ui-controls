/**
 * toggle-list-type.ts — Internal infrastructure command.
 *
 * Wraps the selection in a list node when not in a list; lifts out when
 * already inside a list of the same type.
 *
 * PM boundary: allowed inside src/commands/builtins/.
 */
import { PMCommandInternal, PMCommandContext } from '../../../core/commands/internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { pmWrapInList, pmLift, pmLiftListItem, ResolvedPos } from '../../../pm/pm-guard';
import { DEFAULT_BULLET_LIST_STYLE, DEFAULT_ORDERED_LIST_STYLE, buildListAttributes } from './list-style-defaults';
import { PMNodeType, PMSchema, PMEditorState, PMTransaction, PMNode, PMFragment, PMMark, PMCommand, TextSelection, PMSelection } from '../../../pm/pm-guard';

export interface ToggleListTypePayload {
    listType: 'bullet' | 'ordered' | 'task';
    /** When true, active marks are preserved on the new list item after toggling. */
    keepMarks?: boolean;
    /**
     * CSS `list-style-type` value for the target list container. Applies to
     * `bullet` and `ordered` lists only. When omitted, the target type's
     * default style (`disc` / `decimal`) is used to build fresh list attrs;
     * when the selection already sits in a list of the same type and the
     * current style differs, the list is updated instead of lifted.
     */
    listStyleType?: string;
    /**
     * Checked state applied to task items when toggling into a task list.
     * When omitted, the existing default behavior (unchecked on wrap,
     * preserved on conversion) is unchanged. Task lists ignore
     * `listStyleType`.
     */
    checked?: boolean;
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

/**
 * Resolve the list item node type used to lift the current list selection.
 *
 * @param {PMSchema} schema - The current editor schema.
 * @param {ToggleListTypePayload} payload - The target list payload.
 * @returns {PMNodeType | null} The target list item type, when registered.
 */
function resolveListItemType(schema: PMSchema, payload: ToggleListTypePayload): PMNodeType | null {
    const itemTypeName: string = ITEM_TYPE_MAP[payload.listType];
    return Object.prototype.hasOwnProperty.call(schema.nodes, itemTypeName)
        ? schema.nodes[`${itemTypeName}`]
        : null;
}

/**
 * Resolve the effective `listStyleType` for a toggle payload: an explicitly
 * provided non-empty style wins; otherwise the target type's default
 * (`disc` for bullet, `decimal` for ordered) is used.
 *
 * @param {ToggleListTypePayload} payload - The toggle payload.
 * @returns {string} The effective marker style for bullet/ordered targets.
 */
function resolveListStyleType(payload: ToggleListTypePayload): string {
    if (payload.listType === 'bullet') {
        return typeof payload.listStyleType === 'string' && payload.listStyleType.length > 0
            ? payload.listStyleType
            : DEFAULT_BULLET_LIST_STYLE;
    }
    if (payload.listType === 'ordered') {
        return typeof payload.listStyleType === 'string' && payload.listStyleType.length > 0
            ? payload.listStyleType
            : DEFAULT_ORDERED_LIST_STYLE;
    }
    return '';
}

/**
 * Resolve the effective checked state for task items when toggling into a
 * task list. An explicitly provided boolean wins; `false` is the default
 * (both for fresh wraps and conversions from other list types).
 *
 * @param {ToggleListTypePayload} payload - The toggle payload.
 * @returns {boolean} The effective checked state for task items.
 */
function resolveTaskChecked(payload: ToggleListTypePayload): boolean {
    return typeof payload.checked === 'boolean' ? payload.checked : false;
}

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

// Adjacent lists can be merged only when they use the same list node type
// and the same marker style.
function areListWrappersCompatible(first: PMNode, second: PMNode): boolean {
    return first.type.name === second.type.name
        && first.attrs['listStyleType'] === second.attrs['listStyleType'];
}

// Find the list containing the current transaction selection.
function findSelectedList(tr: PMTransaction): {
    listPos: number;
    listNode: PMNode;
    parent: PMNode;
    index: number;
} | null {
    const $from: ResolvedPos = tr.selection.$from;
    for (let d: number = $from.depth; d >= 0; d--) {
        if (ALL_LIST_NAMES.has($from.node(d).type.name)) {
            return {
                listPos: $from.before(d),
                listNode: $from.node(d),
                parent: $from.node(d - 1),
                index: $from.index(d - 1)
            };
        }
    }
    return null;
}

// Merge the selected list into its compatible preceding list, when present.
function mergeSelectedListWithPrevious(tr: PMTransaction): boolean {
    const selected: ReturnType<typeof findSelectedList> = findSelectedList(tr);
    if (!selected) { return false; }

    if (selected.index <= 0) { return false; }

    const previousNode: PMNode | null = selected.parent.maybeChild(selected.index - 1);
    if (!previousNode || !areListWrappersCompatible(previousNode, selected.listNode)) {
        return false;
    }

    const previousPos: number = selected.listPos - previousNode.nodeSize;
    const selection: PMSelection = tr.selection;
    const fromOffset: number = selection.from - selected.listPos;
    const toOffset: number = selection.to - selected.listPos;
    const mergedList: PMNode = previousNode.copy(previousNode.content.append(selected.listNode.content));
    tr.replaceWith(previousPos, selected.listPos + selected.listNode.nodeSize, mergedList);
    const mergedContentStart: number = previousPos + previousNode.content.size;
    if (selection instanceof TextSelection) {
        const from: number = Math.max(1, Math.min(mergedContentStart + fromOffset, tr.doc.content.size));
        const to: number = Math.max(from, Math.min(mergedContentStart + toOffset, tr.doc.content.size));
        tr.setSelection(TextSelection.create(tr.doc, from, to));
    }
    return true;
}

// Merge the selected list into its compatible following list, when present.
function mergeSelectedListWithFollowing(tr: PMTransaction): boolean {
    const selected: ReturnType<typeof findSelectedList> = findSelectedList(tr);
    if (!selected) { return false; }

    const followingNode: PMNode | null = selected.parent.maybeChild(selected.index + 1);
    if (!followingNode || !areListWrappersCompatible(selected.listNode, followingNode)) {
        return false;
    }

    const followingPos: number = selected.listPos + selected.listNode.nodeSize;
    const selection: PMSelection = tr.selection;
    const fromOffset: number = selection.from - selected.listPos;
    const toOffset: number = selection.to - selected.listPos;
    const mergedList: PMNode = selected.listNode.copy(selected.listNode.content.append(followingNode.content));
    tr.replaceWith(selected.listPos, followingPos + followingNode.nodeSize, mergedList);
    if (selection instanceof TextSelection) {
        const from: number = Math.max(1, Math.min(selected.listPos + fromOffset, tr.doc.content.size));
        const to: number = Math.max(from, Math.min(selected.listPos + toOffset, tr.doc.content.size));
        tr.setSelection(TextSelection.create(tr.doc, from, to));
    }
    return true;
}

// Merge the selected list with compatible adjacent lists on both sides.
function mergeAdjacentLists(tr: PMTransaction): void {
    mergeSelectedListWithPrevious(tr);
    mergeSelectedListWithFollowing(tr);
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
 * should be created as task items with the requested checked state.
 * @param {boolean} convertNestedLists - Whether nested list descendants
 * should be converted as part of the selected hierarchy.
 * @param {string=} targetListType - Logical target list type
 * ('bullet' | 'ordered') for nested lists; omitted for task lists.
 * @param {string=} listStyleType - Effective marker style for bullet/ordered
 * targets; nested lists inherit the same requested style.
 * @param {boolean=} checked - Checked state applied to converted task items.
 * @returns {PMNode} A fully-constructed replacement list node.
 */
function buildConvertedList(
    oldList: PMNode,
    targetListTypeNode: PMNodeType,
    targetItemTypeNode: PMNodeType,
    newListAttrs: Record<string, unknown>,
    isTaskItem: boolean,
    convertNestedLists: boolean,
    targetListType?: 'bullet' | 'ordered',
    listStyleType?: string,
    checked?: boolean
): PMNode {
    const newItems: PMNode[] = [];
    oldList.forEach((child: PMNode): void => {
        if (ALL_LIST_NAMES.has(child.type.name) && convertNestedLists) {
            // Nested list directly under the list container.
            newItems.push(buildConvertedList(
                child,
                targetListTypeNode,
                targetItemTypeNode,
                targetListType
                    ? buildListAttributes(targetListType, listStyleType)
                    : {},
                isTaskItem,
                convertNestedLists,
                targetListType,
                listStyleType,
                checked
            ));
            return;
        }
        if (ALL_ITEM_NAMES.has(child.type.name)) {
            const itemAttrs: Record<string, unknown> = {
                ...child.attrs
            };
            if (isTaskItem) {
                itemAttrs['checked'] = checked ?? false;
            } else {
                delete itemAttrs['checked'];
            }
            // Rebuild the list item's content, converting nested lists only
            // when the selection explicitly covers the list hierarchy.
            const newItemContent: PMNode[] = [];
            child.forEach((itemChild: PMNode): void => {
                if (ALL_LIST_NAMES.has(itemChild.type.name) && convertNestedLists) {
                    newItemContent.push(buildConvertedList(
                        itemChild,
                        targetListTypeNode,
                        targetItemTypeNode,
                        targetListType
                            ? buildListAttributes(targetListType, listStyleType)
                            : {},
                        isTaskItem,
                        convertNestedLists,
                        targetListType,
                        listStyleType,
                        checked
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
 * @param {ToggleListTypePayload} payload - The toggle payload carrying the
 * target list type, optional `listStyleType`, and optional task `checked` state.
 * @returns {void} Nothing — `tr` is mutated in place.
 */
function convertListInPlace(
    tr: PMTransaction,
    schema: PMSchema,
    pmState: PMEditorState,
    listPos: number,
    listNode: PMNode,
    payload: ToggleListTypePayload
): void {
    const targetListType: 'bullet' | 'ordered' | 'task' = payload.listType;
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
    // duplicate-id bookkeeping across the document. Conversions adopt the
    // requested marker style (or the target type's default); ordered lists
    // also reset `order`. Task lists carry no list-level attrs.
    const isTask: boolean = targetListType === 'task';
    const nonTaskListType: 'bullet' | 'ordered' = targetListType === 'ordered' ? 'ordered' : 'bullet';
    const newListAttrs: Record<string, unknown> = isTask
        ? {}
        : buildListAttributes(nonTaskListType, resolveListStyleType(payload));

    const replacement: PMNode = buildConvertedList(
        listNode,
        targetListTypeNode,
        targetItemTypeNode,
        newListAttrs,
        isTask,
        !pmState.selection.empty,
        isTask ? undefined : nonTaskListType,
        isTask ? undefined : resolveListStyleType(payload),
        isTask ? resolveTaskChecked(payload) : undefined
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
 * Apply post-wrap tweaks to `tr`: `keepMarks` and the task-list wrap fixup.
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

    // When wrapping into a taskList, pmWrapInList may place the selected
    // blocks directly inside taskList instead of nesting them in taskItem
    // (taskList requires taskItem children). Walk the post-wrap doc and
    // convert each direct non-taskItem child of the new taskList into a
    // taskItem via setNodeMarkup.
    if (payload.listType === 'task') {
        const checked: boolean = resolveTaskChecked(payload);
        const wrappedDoc: PMNode = tr.doc;
        const $sel: ResolvedPos = tr.selection.$from;
        let newListDepth: number = -1;
        for (let d: number = $sel.depth; d >= 0; d--) {
            if ($sel.node(d).type === listNodeType) {
                newListDepth = d;
                break;
            }
        }
        if (newListDepth !== -1) {
            const freshList: PMNode = $sel.node(newListDepth);
            const freshListPos: number = $sel.before(newListDepth);
            const seeded: { pos: number; attrs: Record<string, unknown> }[] = [];
            wrappedDoc.nodesBetween(
                freshListPos + 1,
                freshListPos + freshList.nodeSize - 1,
                (node: PMNode, pos: number): boolean => {
                    if (node === freshList) { return true; }
                    if (wrappedDoc.resolve(pos).parent !== freshList) { return false; }
                    if (node.type === itemNodeType) {
                        if (node.attrs['checked'] !== checked) {
                            seeded.push({ pos, attrs: { ...node.attrs, checked } });
                        }
                    } else {
                        seeded.push({ pos, attrs: { checked } });
                    }
                    return false;
                }
            );
            for (let i: number = 0; i < seeded.length; i++) {
                tr.setNodeMarkup(seeded[parseInt((i).toString(), 10)].pos, itemNodeType, seeded[parseInt((i).toString(), 10)].attrs);
            }
        }
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
            // Supported source blocks (paragraph, heading) are handled
            // directly by pmWrapInList — the listItem/taskItem content model
            // accepts `(paragraph | heading) block*`. Unsupported blocks
            // (codeBlock, blockquote, table, ...) report unavailable instead
            // of being normalized to paragraphs.
            return pmWrapInList(listNodeType)(pmState);
        }

        if (enclosing.listNode.type === listNodeType) {
            if (payload.listType === 'task') {
                const taskItem: PMNode | null = pmState.doc.nodeAt(enclosing.itemPos);
                const currentChecked: boolean = (taskItem?.attrs['checked'] as boolean) ?? false;
                if (taskItem && currentChecked !== resolveTaskChecked(payload)) {
                    return true;
                }
            }

            // Same list type + a different effective marker style (bullet/
            // ordered only) resolves to an in-place style update, which is
            // always available. Same style (or style not applicable) lifts.
            if (payload.listType !== 'task') {
                const effectiveStyle: string = resolveListStyleType(payload);
                const currentStyle: unknown = enclosing.listNode.attrs['listStyleType'];
                if (typeof currentStyle === 'string' && currentStyle !== effectiveStyle) {
                    return true;
                }
            }
            const itemType: PMNodeType | null = resolveListItemType(schema, payload);
            return itemType ? pmLiftListItem(itemType)(pmState) : pmLift(pmState);
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

            // Fresh list containers adopt the requested marker style (or their
            // type's default: disc / decimal). Task lists carry no list-level attrs.
            const listAttrs: Record<string, unknown> = payload.listType === 'task'
                ? {}
                : buildListAttributes(payload.listType, resolveListStyleType(payload));

            // Single direct wrap via pmWrapInList. The item content model
            // accepts paragraph and heading as the first child, so supported
            // source blocks wrap without any normalization. Unsupported
            // blocks (codeBlock, blockquote, table, callout, ...) fail
            // findWrapping inside pmWrapInList, in which case the dispatch
            // callback is never invoked and nothing is dispatched.
            const wrap: PMCommand = pmWrapInList(listNodeType, listAttrs);
            wrap(pmState, (tr: PMTransaction): void => {
                applyPostWrapTweaks(tr, pmState, payload, listNodeType, itemNodeType);
                mergeAdjacentLists(tr);
                ctx.dispatch(wrapTransaction(tr));
            });
            return;
        }

        // Case 2: cursor is in a list of the same type.
        if (enclosing.listNode.type === listNodeType) {
            if (payload.listType === 'task') {
                const taskItem: PMNode | null = pmState.doc.nodeAt(enclosing.itemPos);
                const currentChecked: boolean = (taskItem?.attrs['checked'] as boolean) ?? false;
                const requestedChecked: boolean = resolveTaskChecked(payload);
                if (taskItem && currentChecked !== requestedChecked) {
                    const checkedTr: PMTransaction = pmState.tr.setNodeMarkup(enclosing.itemPos, undefined, {
                        ...taskItem.attrs,
                        checked: requestedChecked
                    });
                    ctx.dispatch(wrapTransaction(checkedTr));
                    return;
                }
            }

            // Bullet/ordered lists: when the effective marker style differs
            // from the list's current style, update the list's style in a
            // single transaction instead of lifting it. Same style (or no
            // style applicable) keeps the legacy lift (toggle off) behavior.
            if (payload.listType !== 'task') {
                const effectiveStyle: string = resolveListStyleType(payload);
                const currentStyle: unknown = enclosing.listNode.attrs['listStyleType'];
                if (typeof currentStyle === 'string' && currentStyle !== effectiveStyle) {
                    const styleTr: PMTransaction = pmState.tr.setNodeMarkup(enclosing.listPos, undefined, {
                        ...enclosing.listNode.attrs,
                        listStyleType: effectiveStyle
                    });
                    if (payload.keepMarks) {
                        const styleMarks: readonly PMMark[] = pmState.storedMarks ?? pmState.selection.$from.marks();
                        styleTr.ensureMarks(styleMarks);
                    }
                    mergeAdjacentLists(styleTr);
                    ctx.dispatch(wrapTransaction(styleTr));
                    return;
                }
            }

            const itemType: PMNodeType | null = resolveListItemType(schema, payload);
            const lift: PMCommand = itemType ? pmLiftListItem(itemType) : pmLift;
            lift(pmState, (tr: PMTransaction): void => {
                ctx.dispatch(wrapTransaction(tr));
            });
            return;
        }

        // Case 3: cursor is in a different list type — convert in place.
        const tr: PMTransaction = pmState.tr;
        convertListInPlace(tr, schema, pmState, enclosing.listPos, enclosing.listNode, payload);
        if (payload.keepMarks) {
            const marks: readonly PMMark[] = pmState.storedMarks ?? pmState.selection.$from.marks();
            tr.ensureMarks(marks);
        }
        mergeAdjacentLists(tr);
        ctx.dispatch(wrapTransaction(tr));
    }
};
