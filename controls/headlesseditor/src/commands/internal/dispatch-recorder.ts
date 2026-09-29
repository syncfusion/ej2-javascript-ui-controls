/**
 * dispatch-recorder.ts — DispatchRecorder
 *
 * Shared, reusable dispatch tracking used exclusively by CommandExecutor.
 *
 * A fresh instance is created per command invocation inside CommandExecutor.run().
 * All execution targets (ImmediateExecutor, DryRunExecutor, ChainExecutor) benefit
 * from the same single-dispatch enforcement without any duplicated logic.
 *
 * Responsibilities:
 *   - Record the dispatched transaction exactly once.
 *   - Throw MultipleDispatchError on any second call.
 *   - Expose hasDispatched / recorded for CommandExecutor to read.
 *
 * CommandExecutor owns the recorder lifecycle. Executors never create or touch it.
 */
import { EditorTransaction, MultipleDispatchError } from '../types';

export class DispatchRecorder {
    private transaction: EditorTransaction | undefined = undefined;

    /**
     * True after the first successful record() call.
     *
     * @returns {boolean} True if a transaction has been recorded.
     */
    public get hasDispatched(): boolean {
        return this.transaction !== undefined;
    }

    /**
     * The recorded transaction. Undefined until record() is called.
     *
     * @returns {EditorTransaction} The recorded transaction, or undefined.
     */
    public get recorded(): EditorTransaction | undefined {
        return this.transaction;
    }

    /**
     * Record a transaction.
     *
     * @param {EditorTransaction} transaction - The dispatched transaction to record.
     * @param {string} commandName - The originating command name (used in error messages).
     * @returns {void}
     * @throws MultipleDispatchError if called more than once for the same invocation.
     * Does NOT commit anything — onDispatched() on the ExecutionTarget commits.
     */
    public record(transaction: EditorTransaction, commandName: string): void {
        if (this.transaction !== undefined) {
            throw new MultipleDispatchError(commandName);
        }
        this.transaction = transaction;
    }
}
