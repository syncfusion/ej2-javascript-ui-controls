import { WorkflowRuntimeContext } from '../models/workflow-runtime-context';
import { WorkflowStep } from '../models/workflow-step';
import { WorkflowConnection } from '../models/workflow-connection';
import { ExpressionEvaluator } from './expression-evaluator';
import { ReachabilityResolver } from './reachability-resolver';

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

const UNSAFE_KEYS: string[] = ['__proto__', 'prototype', 'constructor', 'password', 'token', 'apiKey', 'secret', 'authorization'];

/**
 * Builds design-time and runtime expression suggestions from upstream context.
 * First step / no inbound edge returns an empty list (property popup shows empty state).
 *
 * @private
 */
export class SuggestionBuilder {
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
    public static buildItemFieldSuggestions(
        itemsPath: string,
        context: WorkflowRuntimeContext
    ): WorkflowSuggestionGroup[] {
        const resolved: unknown = ExpressionEvaluator.resolve(itemsPath, context);
        const items: unknown[] = Array.isArray(resolved) ? resolved : [];
        const sample: unknown = items.length ? items[0] : undefined;
        const root: string = '$.loop.currentItem';
        const entries: WorkflowSuggestionEntry[] = sample === undefined
            ? [{ expression: root, label: 'Array current item', kind: 'runtime', expandable: true }]
            : SuggestionBuilder.expand(root, sample, 'runtime');
        return [{
            root: root,
            label: 'Array item fields',
            kind: 'Filter / Sort item',
            entries: entries,
            tree: sample === undefined ? null : SuggestionBuilder.wrapForTree(sample),
            subtitle: items.length ? 'Fields from the first array item' : 'Run the workflow to populate array item fields',
            flatList: sample === undefined,
            selectRoot: true,
            rootLabel: 'Array current item'
        }];
    }

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
    public static build(
        selected: WorkflowStep | null,
        steps: WorkflowStep[],
        connections: WorkflowConnection[],
        context: WorkflowRuntimeContext
    ): WorkflowSuggestionGroup[] {
        if (!selected || !selected.id) {
            return [];
        }
        // Loop iteration group is shown BEFORE the upstream nodes so the
        // body step author sees the loop context first (most relevant
        // binding) and then the upstream step outputs. Only shown when
        // the selected step sits inside at least one loop body.
        const enclosingLoopIds: string[] = ReachabilityResolver.findEnclosingLoops(
            selected.id,
            steps,
            connections
        );
        const loopGroups: WorkflowSuggestionGroup[] = SuggestionBuilder.loopGroups(
            selected,
            steps,
            context,
            enclosingLoopIds
        );
        const upstream: string[] = ReachabilityResolver.getUpstreamStepIds(selected.id, steps, connections);
        // No upstream at all = nothing to bind. This covers both the
        // "no in-edge" case (first step) and disconnected branches.
        // Loop context counts as binding too, so the loop group still
        // surfaces even when there's nothing upstream to bind (design-time).
        if (upstream.length === 0 && loopGroups.length === 0) {
            return [];
        }
        const groups: WorkflowSuggestionGroup[] = loopGroups;
        // One card per upstream node, in upstream order. The card title is
        // the node's name (e.g. "Form Input Trigger") and the subtitle is
        // the step type. The card body is the raw response object rendered
        // as an expandable JSON tree — the same affordance the reference
        // picker uses. No "Workflow input" / "Previous step" / "AI context"
        // / "Action context" categories; those produced duplicate rows when
        // the predecessor was also upstream, and they were the source of
        // the noise the user reported.
        upstream.forEach((id: string) => {
            const step: WorkflowStep | undefined = steps.filter((item: WorkflowStep) => item.id === id)[0];
            const runtime: unknown = context.nodes && context.nodes[`${id}`] ? context.nodes[`${id}`].response : undefined;
            const label: string = (step && step.name) || id;
            const stepTypeLabel: string = step ? String(step.stepType || '') : '';
            // The qualified expression is the path the runtime resolver
            // will read. Even when the step is also the direct predecessor
            // (so `context.previousStep` holds the same data) `$.nodes["…"]`
            // resolves to the same payload, so we always use the nodes
            // path — keeping a single canonical form.
            const qualifiedRoot: string = '$.nodes["' + id + '"].response';
            // See `wrapForTree` notes: only `undefined` is fetched to `{}`
            // (design-time placeholder). Everything else — including
            // primitives and null — passes through unchanged so `expand()`
            // walks the real shape and emits the bare root entry
            // (`$.nodes["<id>"].response`).
            const tree: unknown = SuggestionBuilder.wrapForTree(runtime);
            const nodeEntries: WorkflowSuggestionEntry[] =
                SuggestionBuilder.mergeEntries(
                    SuggestionBuilder.expand(
                        qualifiedRoot,
                        runtime,
                        'runtime'
                    ).concat(
                        SuggestionBuilder.designTimeFields(
                            step,
                            qualifiedRoot
                        )
                    )
                );
            const isFilterResult: boolean = !!step && step.stepType === 'Filter';
            const isSortResult: boolean = !!step && step.stepType === 'Sort';
            groups.push({
                root: qualifiedRoot,
                label: label,
                kind: 'Node output',
                subtitle: stepTypeLabel,
                entries: nodeEntries,
                tree: tree,
                selectRoot: isFilterResult || isSortResult,
                rootLabel: isFilterResult
                    ? 'Filtered array result'
                    : (isSortResult ? 'Sorted array result' : undefined),
                // For object/array runtime values the picker renders the
                // clickable JSON tree. For primitive values (`Condition`
                // returning `false`, `Formatter` returning a Text string,
                // `ManualTrigger` returning an object) the tree's root row
                // is intentionally unclickable, so fall through to the
                // chip-list path that uses `expand()`'s already-emitted
                // bare-root entry. Picking that entry resolves to the
                // actual runtime value, not a fabricated `.result` suffix
                // that wouldn't exist on the underlying primitive.
                flatList: runtime === null || runtime === undefined
                    || typeof runtime !== 'object'
            });
        });
        // Dedicated "Previous step response" card — always the immediate
        // predecessor in the diagram (`ReachabilityResolver.getDirectPredecessor`),
        // appended last (below every upstream node card and the loop
        // context) so authors see the full upstream picture first and this
        // pinned shortcut last. This mirrors `{{$.previousStep}}` exactly,
        // including the loop-iteration override (`RuntimeContextStore.setLoop`
        // swaps in the current item), so the section stays correct at every
        // nesting level without extra logic here — it just reflects
        // whatever `context.previousStep` holds.
        const directPredecessorId: string | null = ReachabilityResolver.getDirectPredecessor(selected.id, connections);
        const previousStepGroup: WorkflowSuggestionGroup | null = SuggestionBuilder.previousStepGroup(
            upstream.length > 0,
            directPredecessorId,
            steps,
            context
        );
        if (previousStepGroup) {
            groups.push(previousStepGroup);
        }
        return groups.filter((group: WorkflowSuggestionGroup) => group.entries.length > 0);
    }

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
    private static previousStepGroup(
        hasUpstream: boolean,
        directPredecessorId: string | null,
        steps: WorkflowStep[],
        context: WorkflowRuntimeContext
    ): WorkflowSuggestionGroup | null {
        if (!hasUpstream || !directPredecessorId) {
            return null;
        }

        /*
        * The graph is the source of truth for the previous step shown for the
        * currently selected node. Do not prefer context.previousStep.id here,
        * because it can belong to the last executed node rather than the node
        * directly connected to the currently selected designer node.
        */
        const referenceId: string = directPredecessorId;

        const referenceStep: WorkflowStep | undefined =
            steps.filter(
                (step: WorkflowStep): boolean =>
                    step.id === referenceId
            )[0];

        const previous: WorkflowRuntimeContext['previousStep'] =
            context.previousStep;

        const previousMatchesReference: boolean =
            !!previous
            && !!previous.id
            && previous.id === referenceId;

        /*
        * Prefer the matching $.previousStep response. If the runtime store's
        * previousStep points at another recently executed node, use the direct
        * predecessor's node response.
        */
        const nodeRuntime: unknown =
            context.nodes
            && context.nodes[`${referenceId}`]
                ? context.nodes[`${referenceId}`].response
                : undefined;

        const runtime: unknown =
            previousMatchesReference
                ? previous!.response
                : nodeRuntime;

        const root: string = '$.previousStep.response';

        const runtimeEntries: WorkflowSuggestionEntry[] =
            runtime === undefined
                ? []
                : SuggestionBuilder.expand(
                    root,
                    runtime,
                    'runtime'
                );

        const configuredEntries: WorkflowSuggestionEntry[] =
            SuggestionBuilder.designTimeFields(
                referenceStep,
                root
            );

        let entries: WorkflowSuggestionEntry[] =
            SuggestionBuilder.mergeEntries(
                runtimeEntries.concat(configuredEntries)
            );

        /*
        * Preserve the root fallback only when the predecessor genuinely has
        * no discoverable response fields.
        */
        if (entries.length === 0) {
            entries = [{
                expression: root,
                label: root,
                kind: 'runtime',
                expandable: true
            }];
        }

        const referenceLabel: string =
            (referenceStep && referenceStep.name)
            || referenceId;

        const referenceType: string =
            referenceStep
                ? String(referenceStep.stepType || '')
                : '';

        const subtitle: string =
            referenceType
                ? referenceLabel + ' · ' + referenceType
                : referenceLabel;

        const hasRuntimeTree: boolean =
            runtime !== null
            && runtime !== undefined
            && typeof runtime === 'object';

        return {
            root: root,
            label: 'Previous step response',
            kind: 'Previous step',
            subtitle: subtitle,
            entries: entries,

            /*
            * Do not pass {} for undefined. The empty object causes the popup
            * to render Object(0) instead of configured field entries.
            */
            tree: hasRuntimeTree
                ? runtime
                : null,

            /*
            * When no runtime object is available, display the configured
            * design-time entries as individual selectable fields.
            */
            flatList: !hasRuntimeTree
        };
    }

    private static designTimeFields(
        step: WorkflowStep | undefined,
        responseRoot: string
    ): WorkflowSuggestionEntry[] {
        if (!step || !step.props || typeof step.props !== 'object') {
            return [];
        }

        const props: Record<string, unknown> =
            step.props as Record<string, unknown>;

        const entries: WorkflowSuggestionEntry[] = [];

        if (Array.isArray(props.fields)) {
            (
                props.fields as Array<{
                    name?: string;
                    fieldName?: string;
                    key?: string;
                    id?: string;
                    label?: string;
                }>
            ).forEach((field: { name?: string; fieldName?: string; key?: string; id?: string; label?: string; }): void => {
                if (!field) {
                    return;
                }

                // Support the common field property names used by form builders.
                const fieldName: string =
                    String(
                        field.name
                        || field.fieldName
                        || field.key
                        || field.id
                        || ''
                    ).trim();

                if (!fieldName) {
                    return;
                }

                entries.push({
                    expression: ExpressionEvaluator.joinPath(
                        responseRoot,
                        fieldName
                    ),
                    label: field.label || fieldName,
                    kind: 'design-time'
                });
            });
        }

        if (Array.isArray(props.variables)) {
            (
                props.variables as Array<{
                    variableName?: string;
                    name?: string;
                }>
            ).forEach((variable: { variableName?: string; name?: string; }): void => {
                if (!variable) {
                    return;
                }

                const variableName: string =
                    String(
                        variable.variableName
                        || variable.name
                        || ''
                    ).trim();

                if (!variableName) {
                    return;
                }

                entries.push({
                    expression: ExpressionEvaluator.joinPath(
                        responseRoot,
                        variableName
                    ),
                    label: variableName,
                    kind: 'design-time'
                });
            });
        }

        return entries;
    }

    private static mergeEntries(
        entries: WorkflowSuggestionEntry[]
    ): WorkflowSuggestionEntry[] {
        const used: { [expression: string]: boolean } = Object.create(null);
        const result: WorkflowSuggestionEntry[] = [];

        entries.forEach((entry: WorkflowSuggestionEntry): void => {
            if (!entry || !entry.expression) {
                return;
            }

            if (used[entry.expression]) {
                return;
            }

            used[entry.expression] = true;
            result.push(entry);
        });

        return result;
    }

    private static expand(root: string, value: unknown, kind: 'design-time' | 'runtime'): WorkflowSuggestionEntry[] {
        const entries: WorkflowSuggestionEntry[] = [{ expression: root, label: root, kind, expandable: true }];
        SuggestionBuilder.walk(root, value, entries, 0);
        return entries;
    }

    private static walk(prefix: string, value: unknown, entries: WorkflowSuggestionEntry[], depth: number): void {
        if (depth > 4 || value === null || value === undefined) {
            return;
        }
        if (Array.isArray(value)) {
            entries.push({ expression: prefix, label: prefix + ' (array)', kind: 'runtime' });
            if (value.length && SuggestionBuilder.isJsonSafe(value[0]) && typeof value[0] === 'object') {
                SuggestionBuilder.walk(prefix, value[0], entries, depth + 1);
            }
            return;
        }
        if (typeof value !== 'object' || typeof value === 'function') {
            return;
        }
        Object.keys(value as Record<string, unknown>).forEach((key: string) => {
            if (UNSAFE_KEYS.indexOf(key) !== -1 || key.charAt(0) === '_') {
                return;
            }
            const child: unknown = (value as Record<string, unknown>)[`${key}`];
            if (!SuggestionBuilder.isJsonSafe(child)) {
                return;
            }
            // Bracket-encode spaced / special keys so suggestions resolve at runtime.
            const expression: string = prefix + ExpressionEvaluator.encodeSegment(key);
            entries.push({ expression, label: key, kind: 'runtime', expandable: child !== null && typeof child === 'object' });
            SuggestionBuilder.walk(expression, child, entries, depth + 1);
        });
    }

    private static isJsonSafe(value: unknown): boolean {
        if (value === null) {
            return true;
        }
        const type: string = typeof value;
        if (type === 'string' || type === 'number' || type === 'boolean') {
            return true;
        }
        if (type === 'function') {
            return false;
        }
        if (typeof HTMLElement !== 'undefined' && value instanceof HTMLElement) {
            return false;
        }
        return type === 'object';
    }

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
    private static wrapForTree(value: unknown): unknown {
        if (value === undefined) {
            return {};
        }
        return value;
    }

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
    private static loopGroups(
        selected: WorkflowStep,
        steps: WorkflowStep[],
        context: WorkflowRuntimeContext,
        enclosingLoopIds: string[]
    ): WorkflowSuggestionGroup[] {
        if (!enclosingLoopIds.length) {
            return [];
        }
        const loop: WorkflowRuntimeContext['loop'] = context.loop;
        const groups: WorkflowSuggestionGroup[] = [];
        enclosingLoopIds.forEach((loopId: string) => {
            const step: WorkflowStep | undefined = steps.filter(
                (item: WorkflowStep) => item.id === loopId
            )[0];
            if (!step) {
                return;
            }
            const label: string = step.name || step.id || 'Loop';
            const index: number = loop ? Number(loop.index || 0) : 0;
            const count: number = loop ? Number(loop.count || 0) : 0;
            const currentItem: unknown = loop ? loop.currentItem : undefined;
            const all: unknown[] = loop && Array.isArray(loop.all) ? loop.all : [];
            // Mirror $.loop.* as a tree. Render `{ all, currentItem, index,
            // count }` so the click-to-insert buttons emit exact paths.
            const tree: { all: unknown[]; currentItem: unknown; index: number; count: number } = {
                all: all,
                currentItem: currentItem,
                index: index,
                count: count
            };
            const currentEntry: string = '$.loop.currentItem';
            const indexEntry: string = '$.loop.index';
            const countEntry: string = '$.loop.count';
            const allEntry: string = '$.loop.all';
            // When the loop hasn't run yet (design-time) $.loop is undefined
            // and the array is empty. Show a placeholder tree so the author
            // can still pick the binding; we attach explanatory text via
            // `subtitle` instead of inventing fake sample data.
            const subtitleText: string = loop
                ? 'currentItem / index / count / all · iteration ' + (index + 1) + ' of ' + count
                : 'Run the workflow to populate iteration values';
            const items: unknown[] = all;
            const isCurrentItemPrimitive: boolean =
                currentItem !== undefined
                && currentItem !== null
                && (typeof currentItem === 'string' || typeof currentItem === 'number' || typeof currentItem === 'boolean');
            const flatEntries: WorkflowSuggestionEntry[] = loop
                ? SuggestionBuilder.loopFlatEntries(
                    items,
                    currentItem,
                    index,
                    isCurrentItemPrimitive
                )
                : [];
            const loopEntries: WorkflowSuggestionEntry[] = [
                { expression: currentEntry, label: 'currentItem', kind: 'runtime', expandable: true },
                { expression: indexEntry, label: 'index', kind: 'runtime' },
                { expression: countEntry, label: 'count', kind: 'runtime' },
                { expression: allEntry, label: 'all', kind: 'runtime', expandable: Array.isArray(items) && items.length > 0 }
            ];
            const entries: WorkflowSuggestionEntry[] = loopEntries.concat(flatEntries);
            // At design-time (loop has not run) prefer the flat chip list
            // so authors can still click to insert `$.loop.currentItem`
            // etc; the tree would be empty and unhelpful. When the loop
            // has run, prefer the tree so authors see real iteration values
            // and can expand them.
            const flatList: boolean = !loop;
            const runtimeAwareTree: { all: unknown[]; currentItem: unknown; index: number; count: number } | null = loop
                ? tree
                : null;
            groups.push({
                root: '$.loop',
                label: 'Loop · ' + label,
                kind: 'Loop',
                subtitle: subtitleText,
                entries: entries,
                tree: runtimeAwareTree,
                flatList: flatList
            });
        });
        return groups;
    }

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
    private static loopFlatEntries(
        items: unknown[],
        currentItem: unknown,
        index: number,
        currentItemPrimitive: boolean
    ): WorkflowSuggestionEntry[] {
        if (!currentItemPrimitive) {
            return [];
        }
        if (!Array.isArray(items) || items.length === 0) {
            return [];
        }
        return [{
            expression: '$.loop.all[' + index + ']',
            label: 'current item (' + items.length + ' items, index ' + index + ')',
            kind: 'runtime'
        }];
    }
}
