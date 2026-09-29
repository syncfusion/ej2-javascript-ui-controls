/**
 * chain.ts — ChainBuilder
 *
 * Coordinates deferred multi-command execution. Does not contain execution logic —
 * delegates to `CommandExecutor` + `ChainExecutor`.
 *
 * Responsibilities:
 *   - Queue steps via `execute(name, payload?)` — validates command exists at queue time
 *   - Reject `undo` / `redo` at queue time with `HistoryCommandInChainError`
 *   - `run(): ChainResult` — all-or-nothing: runs steps, commits on full success
 *   - `canRun(): boolean` — dry-run simulation using DryRunChainExecutor
 */
import { CommandRegistration, CommandRegistry } from './registry';
import { CommandExecutor } from './executor';
import { ChainExecutor, DryRunChainExecutor } from './chain-executor';
import { ChainResult, HistoryCommandInChainError } from './types';
import { IntegrationManager } from '../pm/integration/integration-manager';

// ── History command names that are forbidden inside a chain ───────────────────

const HISTORY_COMMANDS: ReadonlySet<string> = new Set(['undo', 'redo']);

// ── ChainStep ─────────────────────────────────────────────────────────────────

interface ChainStep {
    readonly name: string;
    readonly payload: unknown;
}

// ── ChainBuilder ──────────────────────────────────────────────────────────────

export class ChainBuilder {
    private readonly registry: CommandRegistry;
    private readonly cmdExecutor: CommandExecutor;
    private readonly integration: IntegrationManager;
    private readonly steps: ChainStep[];

    constructor(registry: CommandRegistry, integration: IntegrationManager) {
        this.registry = registry;
        this.cmdExecutor = new CommandExecutor();
        this.integration = integration;
        this.steps = [];
    }

    // ── Step queuing ──────────────────────────────────────────────────────────

    /**
     * Queue a command step.
     *
     * @param {string} name - The command name to queue.
     * @param {*} [payload] - Optional payload for the queued command.
     * @returns {ChainBuilder} `this` for fluent chaining.
     * @hidden
     */
    public execute(name: string, payload?: unknown): this {
        if (HISTORY_COMMANDS.has(name)) {
            throw new HistoryCommandInChainError(
                `"${name}" cannot be queued inside a chain — history commands must execute in isolation`
            );
        }
        // Validate existence at queue time (throws UnknownCommandError if absent)
        this.registry.get(name);
        this.steps.push({ name, payload });
        return this;
    }

    // ── run() — all-or-nothing ────────────────────────────────────────────────

    /**
     * Execute all queued steps as one atomic operation.
     *
     * - Zero steps → `{ success: false, reason: 'empty' }`
     * - Any step's `canExecute` returns `false` → abort everything, dispatch nothing,
     *   return `{ success: false, reason: 'aborted', failedStep: name }`
     * - All steps succeed → `chainExecutor.commit()`, return `{ success: true }`
     *
     * @returns {ChainResult} The aggregated outcome of the chain.
     * @hidden
     */
    public run(): ChainResult {
        if (this.steps.length === 0) {
            return { success: false, reason: 'empty' };
        }

        const chainExecutor: ChainExecutor = new ChainExecutor(this.integration, this.registry);
        try {
            for (const step of this.steps) {
                const registration: CommandRegistration = this.registry.get(step.name);
                const dispatched: boolean = this.cmdExecutor.run(
                    registration.command,
                    step.payload,
                    chainExecutor
                );

                if (!dispatched) {
                    return { success: false, reason: 'aborted', failedStep: step.name };
                }
            }

            chainExecutor.commit();
            return { success: true };
        } finally {
            this.integration.focusView();
        }
    }

    // ── canRun() — dry-run simulation ─────────────────────────────────────────

    /**
     * Evaluate whether all steps would succeed without dispatching anything.
     *
     * Uses `DryRunChainExecutor` — virtual state advances but nothing is committed.
     * Evaluates `canExecute` against progressively updated virtual state.
     *
     * @returns {boolean} True if every step would succeed; false otherwise (including empty chains).
     * @hidden
     */
    public canRun(): boolean {
        if (this.steps.length === 0) {
            return false;
        }

        const dryExecutor: DryRunChainExecutor = new DryRunChainExecutor(this.integration, this.registry);

        for (const step of this.steps) {
            const registration: CommandRegistration = this.registry.get(step.name);
            const dispatched: boolean = this.cmdExecutor.run(
                registration.command,
                step.payload,
                dryExecutor
            );

            if (!dispatched) {
                return false;
            }
        }

        return true;
    }
}
