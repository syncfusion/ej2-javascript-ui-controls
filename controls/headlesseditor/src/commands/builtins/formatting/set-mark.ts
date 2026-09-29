/**
 * Internal command for applying or updating marks on the current
 * selection.
 *
 * When a mark of the target type already exists, its attributes are
 * merged with the provided attributes instead of being replaced. This
 * allows multiple text style attributes to coexist on the same mark.
 */
import { PMCommandInternal, PMCommandContext } from '../../internal/pm-command-context';
import { wrapTransaction } from '../../../pm/adapters/editor-state-adapter';
import { AllSelection, PMEditorState, PMMark, PMMarkType, PMNode, PMTransaction, PMSchema, AddMarkStep, RemoveMarkStep } from '../../../pm/pm-guard';

/**
 * Payload for the `setMark` command.
 *
 */
export interface SetMarkPayload {
    /** The target mark type. */
    markType: string;
    /** Attributes to apply to the mark. */
    attrs?: Record<string, string | null>;
}

/**
 * Applies a mark to the current selection and merges it with any
 * existing mark of the same type.
 *
 * For non-empty selections, the mark is applied to every inline node
 * within the range, merging attributes with any existing marks of the
 * same type. For collapsed (cursor) selections, the mark is stored as
 * a `storedMark` on the transaction so that subsequent text input —
 * typing, pasting, or any other content insertion — inherits the mark.
 *
 * @param {PMTransaction} transaction The transaction to update.
 * @param {PMEditorState} pmState The current editor state.
 * @param {SetMarkPayload} payload The mark details to apply.
 * @returns {PMTransaction} The updated transaction.
 */
export function applySetMarkInTransaction(transaction: PMTransaction, pmState: PMEditorState, payload: SetMarkPayload): PMTransaction {
    // Get the target mark type from the schema.
    const schema: PMSchema = pmState.schema;
    const markType: PMMarkType = schema.marks[payload.markType];
    // Exit if the requested mark type is not defined in the schema.
    if (!markType) {
        return transaction;
    }
    const { from, to } = pmState.selection;
    const incomingAttrs: Record<string, string | null> = payload.attrs ?? {};
    // At a collapsed cursor, the mark is stored as a transaction-level
    // storedMark so the next inserted character inherits it. We merge
    // with any active stored marks and the marks at the cursor so that
    // combining `setColor` + `setHighlight` at the same cursor produces
    // a single textStyle mark carrying both attrs.
    if (from === to) {
        applyStoredMark(transaction, pmState, markType, incomingAttrs);
        return transaction;
    }
    const defaultAttrs: Record<string, string | null> = markTypeSpecDefaults(markType, schema);
    // Apply the mark to each inline node within the selection.
    transaction.doc.nodesBetween(from, to, (node: PMNode, pos: number): boolean => {
        // Marks can only be applied to inline content.
        if (!node.isInline) {
            return true;
        }
        // Restrict the operation to the selected portion of the node.
        const nodeStart: number = Math.max(pos, from);
        const nodeEnd: number = Math.min(pos + node.nodeSize, to);
        if (nodeStart >= nodeEnd) {
            return true;
        }
        // Collect existing marks of the target type.
        const existing: PMMark[] = [];
        for (const mark of node.marks) {
            if (mark.type === markType) {
                existing.push(mark);
            }
        }
        // Merge attributes from existing marks.
        const merged: Record<string, string | null> = {};
        for (const mark of existing) {
            for (const key in mark.attrs) {
                if (Object.prototype.hasOwnProperty.call(mark.attrs, key)) {
                    merged[key as string] = mark.attrs[key as string];
                }
            }
        }
        // Apply incoming attributes, overriding existing values.
        for (const key in incomingAttrs) {
            if (Object.prototype.hasOwnProperty.call(incomingAttrs, key)) {
                merged[key as string] = incomingAttrs[key as string];
            }
        }
        // Remove existing instances of the target mark.
        for (const mark of existing) {
            transaction.step(new RemoveMarkStep(nodeStart, nodeEnd, mark));
        }
        // Skip creating a mark when all attributes match schema defaults.
        if (matchesDefaults(merged, defaultAttrs)) {
            return true;
        }
        // Add a single mark containing the merged attributes.
        transaction.step(new AddMarkStep(nodeStart, nodeEnd, markType.create(merged)));
        return true;
    });

    return transaction;
}

/**
 * Returns whether the current selection touches at least one inline node
 * whose parent can accept the target mark.
 *
 * This is used by `canExecute` so range selections such as `AllSelection`
 * are not rejected simply because their `$from` points at the document root.
 *
 * @param {PMEditorState} pmState The current editor state.
 * @param {PMMarkType} markType The mark type to test.
 * @returns {boolean} True when the selection can accept the mark.
 */
function selectionCanAcceptMark(pmState: PMEditorState, markType: PMMarkType): boolean {
    let canApply: boolean = false;
    pmState.doc.nodesBetween(pmState.selection.from, pmState.selection.to, (node: PMNode, _pos: number, parent: PMNode | null): boolean => {
        if (node.isInline && parent?.type.allowsMarkType(markType)) {
            canApply = true;
            return false;
        }
        return !canApply;
    });
    return canApply;
}

/**
 * Stores a mark on the transaction as a `storedMark` so that any text
 * subsequently inserted at the current collapsed cursor inherits it.
 *
 * The stored mark is built by merging:
 *   1. The mark already active at the cursor (or the existing storedMark).
 *   2. The incoming attributes from the payload.
 *
 * Storing a single merged mark (rather than several individual ones)
 * keeps the active-mark state tidy and matches what a range-based apply
 * would produce, so a cursor setColor followed by setHighlight at the
 * same position behaves the same as selecting a range and applying
 * both marks.
 *
 * When the merged attributes exactly match the schema defaults the
 * stored mark is cleared instead of being set, so an unset command at
 * a cursor does not leave behind a "default" stored mark.
 *
 * @param {PMTransaction} transaction The transaction to update.
 * @param {PMEditorState} pmState The current editor state.
 * @param {PMMarkType} markType The mark type being set or unset.
 * @param {Record<string, string | null>} incomingAttrs Attributes to merge in.
 * @returns {void}
 */
function applyStoredMark(
    transaction: PMTransaction,
    pmState: PMEditorState,
    markType: PMMarkType,
    incomingAttrs: Record<string, string | null>
): void {
    // Start from the active storedMark set, falling back to the marks
    // at the cursor. This means a second call at the same cursor builds
    // on the previous one instead of resetting.
    const baselineMarks: readonly PMMark[] = pmState.storedMarks || pmState.selection.$from.marks();
    const baselineNonTarget: PMMark[] = [];
    const merged: Record<string, string | null> = {};
    for (const mark of baselineMarks) {
        if (mark.type === markType) {
            for (const key in mark.attrs) {
                if (Object.prototype.hasOwnProperty.call(mark.attrs, key)) {
                    merged[key as string] = mark.attrs[key as string];
                }
            }
        } else {
            // Preserve any non-target marks in the storedMarks set so a
            // setColor at a cursor that already has bold-as-stored-mark
            // leaves the bold mark in place.
            baselineNonTarget.push(mark);
        }
    }
    for (const key in incomingAttrs) {
        if (Object.prototype.hasOwnProperty.call(incomingAttrs, key)) {
            merged[key as string] = incomingAttrs[key as string];
        }
    }

    const defaultAttrs: Record<string, string | null> = markTypeSpecDefaults(
        markType,
        pmState.schema
    );

    // When every merged attribute is at its default value the mark has
    // no effect — clear any stored mark of this type so the cursor
    // returns to inheriting marks from the surrounding text.
    if (matchesDefaults(merged, defaultAttrs)) {
        transaction.removeStoredMark(markType);
        return;
    }

    // Replace any existing stored mark of the target type with the
    // freshly-merged one. Using setStoredMarks (rather than
    // addStoredMark) keeps a single textStyle mark in the set, so
    // typing does not produce overlapping textStyle marks on the new
    // character. Non-target marks in the existing storedMark set are
    // preserved so unrelated active marks survive.
    const newTargetMark: PMMark = markType.create(merged);
    const nextStoredMarks: PMMark[] = [...baselineNonTarget, newTargetMark];
    transaction.setStoredMarks(nextStoredMarks);
}

/**
 * Returns the default attribute values defined for a mark type.
 *
 * These defaults are used when determining whether a mark contains
 * any non-default formatting values.
 *
 * @param {PMMarkType} markType The mark type.
 * @param {PMSchema} schema The editor schema.
 * @returns {Record<string, string | null>} A map of attribute names to their default values.
 *
 */
function markTypeSpecDefaults(markType: PMMarkType, schema: PMSchema): Record<string, string | null> {
    // Read the mark specification from the schema.
    const spec: { attrs?: Record<string, { default?: string | null }> } | undefined = schema.spec?.marks?.get
        ? (schema.spec.marks.get(markType.name) as { attrs?: Record<string, { default?: string | null }> })
        : undefined;
    // Return an empty object when the mark does not define any attributes.
    if (!spec || !spec.attrs) {
        return {};
    }
    // Collect the default value for each attribute.
    const defaultAttrValues: Record<string, string | null> = {};
    for (const key in spec.attrs) {
        // Only process attributes defined directly on the spec.
        if (Object.prototype.hasOwnProperty.call(spec.attrs, key)) {
            defaultAttrValues[key as string] = spec.attrs[key as string].default ?? null;
        }
    }
    return defaultAttrValues;
}

/**
 * Checks whether all attribute values match their default values.
 *
 * Used to determine whether a mark contains any meaningful formatting
 * before creating or reapplying it.
 *
 * @param {Record<string, string | null>} attrs The attribute values to evaluate.
 * @param {Record<string, string | null>} defaults The default attribute values defined by the schema.
 * @returns {boolean} True if all attributes match their default values.
 */
function matchesDefaults(attrs: Record<string, string | null>, defaults: Record<string, string | null>): boolean {
    // Compare each attribute against its default value.
    for (const key in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, key)) {
            const candidate: string | null = attrs[key as string];
            // Use null when no explicit default value exists.
            const fallback: string | null = defaults[key as string] ?? null;
            // A non-default value indicates meaningful formatting.
            if (candidate != null && candidate !== fallback) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Applies a mark to the current selection.
 *
 * Existing mark attributes are preserved unless overridden by the
 * provided payload.
 */
export const setMarkCommand: PMCommandInternal<SetMarkPayload> = {
    name: 'setMark',
    meta: { label: 'Set Mark', category: 'formatting' },
    canExecute(ctx: PMCommandContext, payload: SetMarkPayload): boolean {
        const pmState: PMEditorState = ctx.pmState;
        const schema: PMSchema = pmState.schema;
        // Resolve the target mark type from the schema.
        const markType: PMMarkType = schema.marks[payload.markType];
        if (!markType) {
            return false;
        }
        const { selection } = pmState;
        const { $from } = selection;
        // A collapsed cursor is allowed: the command stores the mark as a
        // storedMark so subsequent text input inherits it.
        if (selection.empty) {
            return $from.parent.type.allowsMarkType(markType);
        }
        // Range selections, including `AllSelection`, are accepted when any
        // inline node in the range can receive the mark.
        return selectionCanAcceptMark(pmState, markType);
    },
    execute(ctx: PMCommandContext, payload: SetMarkPayload): void {
        const transaction: PMTransaction = applySetMarkInTransaction(ctx.pmState.tr, ctx.pmState, payload);
        ctx.dispatch(wrapTransaction(transaction));
    }
};
