/**
 * chain-executor.ts — ChainExecutor
 *
 * Implements `ExecutionTarget` for deferred multi-command execution.
 *
 * Design:
 *   - Holds a single virtual PM state that advances with each dispatched step.
 *   - `buildContext()` always returns context reflecting ALL prior dispatched steps.
 *   - `onDispatched(tr)` applies the transaction to the virtual state, then replays
 *     its steps + selection/storedMarks onto the single accumulating transaction.
 *   - `commit()` dispatches the final accumulated transaction exactly once.
 *
 * Why not copy only `tr.steps`:
 *   PM transactions carry selection, storedMarks, metadata, and plugin state in
 *   addition to steps. Copying steps alone silently drops all of that. We replay
 *   full transaction properties onto the accumulating transaction to preserve the
 *   complete envelope.
 *
 * No-dispatch variant:
 *   `DryRunChainExecutor` subclass overrides `commit()` to be a no-op, so the
 *   chain can be evaluated (canRun) without touching real state.
 */
import { ExecutionTarget } from './executor';
import { CommandContext, EditorTransaction } from './types';
import { IntegrationManager } from '../pm/integration/integration-manager';
import { buildEditorState, unwrapTransaction } from '../pm/adapters/editor-state-adapter';
import { PMEditorState, PMTransaction, PMStep } from '../pm/pm-guard';
import { PMCommandContext } from './internal/pm-command-context';
import { CommandRegistry } from './registry';

// ── ChainExecutor ─────────────────────────────────────────────────────────────

export class ChainExecutor implements ExecutionTarget {
    protected readonly integration: IntegrationManager;
    private readonly registry: CommandRegistry | null;

    /**
     * The current virtual PM state — starts from live state, advances with each
     * dispatched step so the next command sees up-to-date context.
     */
    private virtualState: PMEditorState;

    /**
     * The single accumulating PM transaction.
     * Forked from the original live state at construction time.
     * Each dispatched step's steps, selection, and storedMarks are replayed onto it.
     */
    private accumulatingTransaction: PMTransaction;

    /** Whether at least one step was dispatched (needed for commit guard). */
    private hasSteps: boolean;

    constructor(integration: IntegrationManager, registry?: CommandRegistry) {
        this.integration = integration;
        this.registry = registry ?? null;
        this.virtualState = integration.getState();
        this.accumulatingTransaction = this.virtualState.tr;
        this.hasSteps = false;
    }

    // ── ExecutionTarget ───────────────────────────────────────────────────────

    /**
     * Build context reflecting the current virtual state (all prior steps applied).
     * The `editor` reference is an empty stub — built-in chain commands access
     * PM state via `ctx.dispatch`, not via `ctx.editor`.
     *
     * @returns {CommandContext} Context object representing current virtual state.
     * @hidden
     */
    public buildContext(): CommandContext {
        const editorState: ReturnType<typeof buildEditorState> = buildEditorState(this.virtualState, this.integration.isMounted);

        const ctx: PMCommandContext = {
            editorState,
            selection: editorState.selection,
            document: editorState.document,
            editor: { commandRegistry: this.registry }, // real registry for nested canExecute checks
            dispatch: (): void => {
                // Intentionally empty — CommandExecutor wraps this with a recorder.
                // The recorder captures the transaction; our onDispatched() is called
                // from CommandExecutor.run() after execute() returns.
            },
            pmState: this.virtualState // virtual state snapshot for PMCommandInternal implementations
        };
        return ctx;
    }

    /**
     * Called by CommandExecutor after a step dispatches.
     *
     * Algorithm:
     *   1. Unwrap the PM transaction from the opaque EditorTransaction.
     *   2. Replay ALL steps from the step's transaction onto the accumulating tx.
     *   3. Forward selection and storedMarks from the step's transaction.
     *   4. Advance the virtual state by applying the step's transaction.
     *
     * @param {EditorTransaction} transaction - The dispatched transaction from the step.
     * @returns {void}
     * @hidden
     */
    public onDispatched(transaction: EditorTransaction): void {
        const stepTr: PMTransaction = unwrapTransaction(transaction);

        // Replay steps onto the accumulating transaction
        for (const step of Array.from(stepTr.steps) as PMStep[]) {
            this.accumulatingTransaction.step(step);
        }

        // Forward selection (chain may include setSelection-only steps)
        this.accumulatingTransaction.setSelection(stepTr.selection);

        // Forward storedMarks (affects inline formatting in subsequent steps)
        if (stepTr.storedMarks !== null) {
            this.accumulatingTransaction.setStoredMarks(stepTr.storedMarks);
        }

        // Advance virtual state so the next step sees correct context
        this.virtualState = this.virtualState.apply(stepTr);

        this.hasSteps = true;
    }

    // ── Terminal ──────────────────────────────────────────────────────────────

    /**
     * Dispatches the accumulated transaction exactly once.
     * No-op if no steps were accumulated.
     *
     * @returns {void}
     * @hidden
     */
    public commit(): void {
        if (!this.hasSteps) { return; }
        this.integration.dispatch(this.accumulatingTransaction);
    }

    /**
     * Whether at least one step has been accumulated.
     *
     * @returns {boolean} True when at least one step has been accumulated.
     * @hidden
     */
    public get hasAccumulatedSteps(): boolean {
        return this.hasSteps;
    }

    /**
     * Returns the current virtual PM state.
     * Used by `DryRunChainExecutor` and `ChainBuilder.canRun()` to read
     * progressively updated virtual state.
     *
     * @returns {PMEditorState} The current virtual PM state.
     * @hidden
     */
    public getVirtualState(): PMEditorState {
        return this.virtualState;
    }
}

// ── DryRunChainExecutor ───────────────────────────────────────────────────────

/**
 * No-dispatch variant for `ChainBuilder.canRun()`.
 *
 * Overrides `commit()` to be a no-op so the chain can be fully evaluated
 * (including `canExecute` checks against virtual state) without touching real state.
 * `onDispatched` still advances the virtual state so subsequent canExecute
 * evaluations see the correct progressive context.
 */
export class DryRunChainExecutor extends ChainExecutor {
    /**
     * Override: do NOT dispatch — dry-run mode.
     *
     * @returns {void}
     * @hidden
     */
    public commit(): void {
        // intentional no-op
    }
}
