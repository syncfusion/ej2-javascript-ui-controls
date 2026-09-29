/**
 * immediate-executor.ts — ImmediateExecutor
 *
 * Implements `ExecutionTarget` for single-command execution.
 *
 * - `buildContext()` reads live state from `IntegrationManager`
 * - `onDispatched(tr)` calls `IntegrationManager.dispatch(tr)` immediately
 *
 * For dry-run (`canExecute` checks), a no-op dispatch variant is used —
 * same `CommandExecutor.run()` path, no actual state mutation.
 *
 * This file imports from src/pm/ — allowed by boundary rule (Shape C):
 * src/commands/immediate-executor.ts is a framework-core file that bridges
 * the command layer to PM. PM types do NOT appear on any method signature
 * visible outside this file.
 */
import { ExecutionTarget } from './executor';
import { CommandContext, EditorState, EditorTransaction } from './types';
import { IntegrationManager } from '../pm/integration/integration-manager';
import {
    buildEditorState,
    unwrapTransaction
} from '../pm/adapters/editor-state-adapter';
import { PMCommandContext } from './internal/pm-command-context';
import { PMEditorState } from '../pm/pm-guard';

// ── ImmediateExecutor ─────────────────────────────────────────────────────────

/**
 * ImmediateExecutor — live execution target.
 *
 * Reads the current PM state on every `buildContext()` call and dispatches
 * the transaction immediately when `onDispatched()` is called.
 */
export class ImmediateExecutor implements ExecutionTarget {
    private readonly integration: IntegrationManager;

    constructor(integration: IntegrationManager) {
        this.integration = integration;
    }

    public buildContext(): CommandContext {
        const pmState: PMEditorState = this.integration.getState();
        const editorState: EditorState = buildEditorState(pmState, this.integration.isMounted);

        const ctx: PMCommandContext = {
            editorState,
            selection: editorState.selection,
            document: editorState.document,
            editor: { commandRegistry: null }, // wired in Editor.create()
            dispatch: (): void => {
                // placeholder — CommandExecutor's recorder overrides this via spread
            },
            pmState // snapshot at command start; consumed by PMCommandInternal implementations
        };
        return ctx;
    }

    public onDispatched(transaction: EditorTransaction): void {
        // Single commit gate: called by CommandExecutor after recorder captures the transaction.
        this.integration.dispatch(unwrapTransaction(transaction));
    }
}

// ── DryRunExecutor ────────────────────────────────────────────────────────────

/**
 * DryRunExecutor — read-only variant of ImmediateExecutor.
 *
 * Used by `CommandManager.canExecute()`. Builds context from live state
 * but replaces `dispatch` with a no-op so no state mutation occurs.
 *
 * Reuses the same `CommandExecutor.run()` path — no duplicated logic.
 */
export class DryRunExecutor implements ExecutionTarget {
    private readonly integration: IntegrationManager;

    constructor(integration: IntegrationManager) {
        this.integration = integration;
    }

    public buildContext(): CommandContext {
        const pmState: PMEditorState = this.integration.getState();
        const editorState: EditorState = buildEditorState(pmState, this.integration.isMounted);

        const ctx: PMCommandContext = {
            editorState,
            selection: editorState.selection,
            document: editorState.document,
            editor: { commandRegistry: null },
            dispatch: (): void => {
                // intentional no-op — dry run never mutates state
            },
            pmState // snapshot at command start; consumed by PMCommandInternal implementations
        };
        return ctx;
    }

    public onDispatched(): void {
        // no-op — dry run dispatches nothing
    }
}
