import { WorkflowRuntimeContext } from '../models/workflow-runtime-context';
import { WorkflowStep } from '../models/workflow-step';
import { WorkflowConnection } from '../models/workflow-connection';
/**
 * Workflow Suggestion Entry.
 *
 * @private
 */
export interface WorkflowSuggestionEntry {
    expression: string;
    label: string;
    kind: 'design-time' | 'runtime';
    expandable?: boolean;
}
/**
 * Per-group visual metadata for the variable picker popup. The popup renders
 * one collapsible card per group; inside the card the JSON tree under
 * `tree` is shown expandably (Object(n) / Array(n) rows with click-to-insert
 * key buttons and type badges). When the group has no tree (e.g. loop,
 * variables list, or a step with no captured output yet) `tree` is null and
 * the popup falls back to the flat `entries` list.
 *
 * @private
 */
export interface WorkflowSuggestionGroup {
    root: string;
    label: string;
    kind: string;
    entries: WorkflowSuggestionEntry[];
    /**
     * Root value shown as a tree inside the group card. `null` when the group
     * is a flat list (loop context, variables, etc.) or when the upstream
     * node has not produced an object/array at runtime.
     */
    tree?: unknown | null;
    /**
     * Optional sub-title rendered in the group card (e.g. the upstream
     * step's stepType label, or "currentItem / index / count" for the loop
     * context). Empty string hides it.
     */
    subtitle?: string;
    /**
     * When true the popup should render this group as a flat chip list of
     * entries instead of a tree. The current picker uses this for the
     * Variables, Loop, and Reachable-nodes-fallback cases.
     */
    flatList?: boolean;
    /** Allow the group's root expression to be inserted as a value. */
    selectRoot?: boolean;
    /** Display label used when the selectable root is not a generic marker. */
    rootLabel?: string;
}
/**
 * Builds design-time and runtime expression suggestions from upstream context.
 * First step / no inbound edge returns an empty list (property popup shows empty state).
 *
 * @private
 */
export declare class SuggestionBuilder {
    /**
     * Build picker entries whose root is the current item of an array.
     * Filter and Sort use this root as a field pointer rather than as a
     * value resolved once for the whole workflow context.
     *
     * @param {string} itemsPath - The expression resolving the source array.
     * @param {WorkflowRuntimeContext} context - The runtime context.
     * @returns {WorkflowSuggestionGroup[]} The item-field suggestion groups.
     * @private
     */
    static buildItemFieldSuggestions(itemsPath: string, context: WorkflowRuntimeContext): WorkflowSuggestionGroup[];
    /**
     * Builds suggestion groups for a selected workflow step.
     *
     * @param {WorkflowStep | null} selected - The selected step.
     * @param {WorkflowStep[]} steps - All workflow steps.
     * @param {WorkflowConnection[]} connections - All workflow connections.
     * @param {WorkflowRuntimeContext} context - The runtime context.
     * @returns {WorkflowSuggestionGroup[]} The suggestion groups.
     * @private
     */
    static build(selected: WorkflowStep | null, steps: WorkflowStep[], connections: WorkflowConnection[], context: WorkflowRuntimeContext): WorkflowSuggestionGroup[];
    /**
     * Builds the dedicated "Previous step response" group — a single
     * pinned section that always mirrors `{{$.previousStep}}` for the
     * currently selected step, independent of how many upstream cards are
     * also rendered.
     *
     * Content always comes from `context.previousStep` (never
     * re-derived from `context.nodes`) so the section is byte-for-byte
     * what the runtime resolver returns for `$.previousStep.response` —
     * including the loop-iteration override where the store swaps in the
     * current item instead of the whole iterated array. That keeps the
     * section correct at every loop-nesting level without any extra
     * loop-aware branching here.
     *
     * The label/subtitle, however, are resolved from the *graph* (the
     * direct predecessor connected into the selected step) whenever the
     * live context hasn't recorded a `previousStep` yet, so the picker can
     * still tell the author which node this section will represent before
     * the workflow has been run.
     *
     * @param {boolean} hasUpstream - Whether the selected step has at least one upstream node.
     * @param {string | null} directPredecessorId - The step directly wired into the selected step, if any.
     * @param {WorkflowStep[]} steps - All workflow steps.
     * @param {WorkflowRuntimeContext} context - The runtime context.
     * @returns {WorkflowSuggestionGroup | null} The previous-step group, or null when there's nothing upstream.
     * @private
     */
    private static previousStepGroup;
    private static designTimeFields;
    private static mergeEntries;
    private static expand;
    private static walk;
    private static isJsonSafe;
    /**
     * Pick a `tree` value for the picker card body.
     * Object/array runtime values pass through unchanged so the picker can
     * show a clickable JSON tree (e.g. Formatter holding an array, an
     * upstream Form Input payload). Primitive runtime values (`string`,
     * `number`, `boolean`, `null`) also pass through — the picker uses the
     * group's `entries` list instead, which always includes the bare
     * `.response` entry that resolves correctly at runtime.
     * An empty object `{}` is returned only for the design-time placeholder
     * (`runtime === undefined`), where the picker paints an empty
     * `Object(0)` card to signal "the upstream step exists but has not
     * run yet".
     * Note: a previous version wrapped primitives into a synthetic
     * `{ result: <value> }` so the picker could show a `result` leaf.
     * That fabricated suffix did not exist on the actual runtime value,
     * so picking it resolved to `undefined` (real example: Formatter
     * step produces a Text string — wrapping emitted `$.nodes[...].response.result`
     * but the recorded response was just the string).
     * /
     *
     * @param {unknown} value - The runtime value.
     * @returns {unknown} The value or an empty object placeholder.
     */
    private static wrapForTree;
    /**
     * Build the "Loop iteration" group(s) for a step that lives inside a
     * loop body. One group per enclosing loop step, in enclosing order.
     * The group's tree mirrors `$.loop.*` so the author can pick:
     *
     *   $.loop.all            — the full iteration array
     *   $.loop.currentItem    — this iteration's value
     *   $.loop.index          — 0-based current iteration number
     *   $.loop.count          — total item count being visited
     *
     * Group kind is `'Loop'` and the body is rendered as a tree even when
     * the runtime currentItem is a primitive (wrapped in `{ currentItem }`
     * so the picker has a selectable leaf).
     *
     * @param {WorkflowStep} selected - The selected workflow step.
     * @param {WorkflowStep[]} steps - All workflow steps.
     * @param {WorkflowRuntimeContext} context - The runtime context.
     * @param {string[]} enclosingLoopIds - Enclosing loop identifiers.
     * @returns {WorkflowSuggestionGroup[]} The loop suggestion groups.
     */
    private static loopGroups;
    /**
     * Adds quick-pick chips for the iteration's item when the array holds
     * primitive values (so the author sees a concrete indexed path like
     * `$.loop.all[0]` next to the loop context). For object arrays the
     * tree view already exposes the per-item keys; we skip the chips to
     * avoid noise.
     *
     * @param {unknown[]} items - The loop items.
     * @param {unknown} currentItem - The current loop item.
     * @param {number} index - The current item index.
     * @param {boolean} currentItemPrimitive - Whether the item is primitive.
     * @returns {WorkflowSuggestionEntry[]} The loop item suggestions.
     */
    private static loopFlatEntries;
}
