/**
 * executor.ts — CommandExecutor and ExecutionTarget
 *
 * THE single execution algorithm. Both immediate and chained execution flow
 * through here. `canExecute` is evaluated and `execute` is called in exactly
 * one place — here.
 */
import { Command, CommandContext, EditorTransaction } from './types';
import { DispatchRecorder } from './internal/dispatch-recorder';

// ── ExecutionTarget ───────────────────────────────────────────────────────────

/**
 * ExecutionTarget — strategy interface that provides context and receives
 * dispatch notifications.
 *
 * `ImmediateExecutor` and `ChainExecutor` each implement this differently;
 * the algorithm in `CommandExecutor.run()` is the same for both.
 *
 * @hidden
 */
export interface ExecutionTarget {
    /** Provide the `CommandContext` for the next command invocation. */
    buildContext(): CommandContext;
    /** Called exactly once when a command successfully calls `ctx.dispatch(tr)`. */
    onDispatched(transaction: EditorTransaction): void;
}

// ── CommandExecutor ───────────────────────────────────────────────────────────

/**
 * CommandExecutor — the single execution algorithm.
 *
 * Flow for `run()`:
 *  1. Build context via `target.buildContext()`
 *  2. Wrap `ctx.dispatch` to detect whether it was called
 *  3. If `command.canExecute` is defined → evaluate; return `false` if blocked
 *  4. Call `command.execute(ctx, payload)`
 *  5. If dispatch was invoked → call `target.onDispatched(tr)`
 *  6. Return whether a dispatch occurred
 */
export class CommandExecutor {
    /**
     * Run a command against an `ExecutionTarget`.
     *
     * @param {Command} command - The command to execute.
     * @param {*} payload - Arbitrary payload — typed by the command's TPayload.
     * @param {ExecutionTarget} target - Provides context and receives dispatch notifications.
     * @returns {boolean} `true` if the command dispatched a transaction; `false` otherwise.
     * @hidden
     */
    public run(command: Command<unknown>, payload: unknown, target: ExecutionTarget): boolean {
        const baseContext: CommandContext = target.buildContext();

        // Dispatch-tracking: use DispatchRecorder to enforce exactly-one-dispatch invariant
        const recorder: DispatchRecorder = new DispatchRecorder();

        const trackedContext: CommandContext = {
            ...baseContext,
            dispatch: (transaction: EditorTransaction): void => {
                // Record only — do NOT commit here. onDispatched() is the single commit gate.
                recorder.record(transaction, command.name);
            }
        };

        // Step 3: guard check
        if (command.canExecute !== undefined) {
            const allowed: boolean = command.canExecute(trackedContext, payload);
            if (!allowed) {
                return false;
            }
        }

        // Step 4: execute
        command.execute(trackedContext, payload);

        // Step 5: notify target if dispatch occurred — target.onDispatched() is the commit gate
        if (recorder.hasDispatched) {
            const dispatched: EditorTransaction | undefined = recorder.recorded;
            if (dispatched !== undefined) {
                target.onDispatched(dispatched);
            }
            return true;
        }

        return false;
    }
}
