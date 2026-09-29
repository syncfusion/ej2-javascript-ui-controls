/**
 * manager.ts — CommandManager
 *
 * Thin orchestrator. Looks up commands, builds the right executor, and
 * delegates to `CommandExecutor`. No event publishing, no batching, no PM lifecycle.
 *
 * Responsibilities:
 *  - `execute(name, payload?)` — registry lookup → ImmediateExecutor → CommandExecutor.run()
 *  - `canExecute(name, payload?)` — registry lookup → DryRunExecutor → CommandExecutor.run()
 */
import { CommandRegistration, CommandRegistry } from './registry';
import { CommandExecutor } from './executor';
import { ImmediateExecutor, DryRunExecutor } from './immediate-executor';
import { IntegrationManager } from '../pm/integration/integration-manager';

// ── CommandManager ────────────────────────────────────────────────────────────

export class CommandManager {
    private readonly registry: CommandRegistry;
    private readonly executor: CommandExecutor;
    private readonly integration: IntegrationManager;

    constructor(registry: CommandRegistry, integration: IntegrationManager) {
        this.registry = registry;
        this.executor = new CommandExecutor();
        this.integration = integration;
    }

    /**
     * Execute a command by name.
     *
     * @param {string} name - Registered command name.
     * @param {*} [payload] - Optional payload — typed by the command's TPayload at runtime.
     * @returns {boolean} `true` if the command dispatched a transaction; `false` otherwise.
     * @hidden
     */
    public execute(name: string, payload?: unknown): boolean {
        // Throws UnknownCommandError if not found
        const registration: CommandRegistration = this.registry.get(name);
        const target: ImmediateExecutor = new ImmediateExecutor(this.integration);
        const focusAfterDispatch: boolean = registration.command.meta?.focusAfterDispatch;
        try {
            // Run the command and record whether it dispatched a transaction.
            const dispatched: boolean = this.executor.run(registration.command, payload ?? undefined, target);
            if (dispatched && focusAfterDispatch) {
                // Restore DOM focus after commands that update or recreate their NodeView.
                this.integration.focusView(true);
            }
            // Tell the caller whether the command actually changed editor state.
            return dispatched;
        } finally {
            if (!focusAfterDispatch) {
                this.integration.focusView();
            }
        }
    }

    /**
     * Check whether a command would execute successfully in the current state.
     *
     * Uses a dry-run (no-dispatch) variant — never mutates state.
     * Returns `false` (not throw) for unknown command names.
     *
     * @param {string} name - Registered command name.
     * @param {*} [payload] - Optional payload.
     * @returns {boolean} `true` if the command would succeed; `false` otherwise.
     * @hidden
     */
    public canExecute(name: string, payload?: unknown): boolean {
        if (!this.registry.has(name)) {
            return false;
        }
        const registration: CommandRegistration = this.registry.get(name);
        const target: DryRunExecutor = new DryRunExecutor(this.integration);
        return this.executor.run(registration.command, payload ?? undefined, target);
    }
}
