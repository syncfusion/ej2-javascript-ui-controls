import { IDisposable } from '../events/types';
import { IErrorReporter } from '../events/event-bus';
import { DiagnosticsEntry } from './diagnostics-entry';

const MAX_ENTRIES: number = 100;

/**
 * DiagnosticsService
 *
 * Lightweight diagnostics service used internally by the editor runtime.
 * Stores the most recent diagnostic entries for debugging purposes.
 *
 * @hidden
 */
export class DiagnosticsService implements IDisposable, IErrorReporter {
    private readonly entries: DiagnosticsEntry[] = [];
    private disposed: boolean = false;

    /**
     * Records an info-level diagnostic entry.
     *
     * @param {string} message - Human-readable diagnostic message.
     * @param {*} [metadata] - Optional structured metadata to attach to the entry.
     * @returns {void}
     * @hidden
     */
    public info(message: string, metadata?: Record<string, unknown>): void {
        this.record('info', message, metadata);
    }

    /**
     * Records a warning-level diagnostic entry.
     *
     * @param {string} message - Human-readable diagnostic message.
     * @param {*} [metadata] - Optional structured metadata to attach to the entry.
     * @returns {void}
     * @hidden
     */
    public warn(message: string, metadata?: Record<string, unknown>): void {
        this.record('warn', message, metadata);
    }

    /**
     * Records an error-level diagnostic entry.
     * Used by EventBus to report subscriber errors.
     *
     * @param {string} message - Human-readable diagnostic message.
     * @param {*} [metadata] - Optional structured metadata to attach to the entry.
     * @returns {void}
     * @hidden
     */
    public error(message: string, metadata?: Record<string, unknown>): void {
        this.record('error', message, metadata);
    }

    /**
     * Records a debug-level diagnostic entry.
     *
     * @param {string} message - Human-readable diagnostic message.
     * @param {*} [metadata] - Optional structured metadata to attach to the entry.
     * @returns {void}
     * @hidden
     */
    public debug(message: string, metadata?: Record<string, unknown>): void {
        this.record('debug', message, metadata);
    }

    /**
     * Returns all recorded diagnostics (oldest → newest).
     *
     * @returns {ReadonlyArray<DiagnosticsEntry>} A copy of the recorded entries.
     * @hidden
     */
    public getEntries(): ReadonlyArray<DiagnosticsEntry> {
        return [...this.entries];
    }

    /**
     * Clears all entries and prevents further recording.
     *
     * @returns {void}
     * @hidden
     */
    public dispose(): void {
        if (this.disposed) {
            return;
        }

        this.disposed = true;
        this.entries.length = 0;
    }

    /**
     * Internal helper that appends a new entry, evicting the oldest when at capacity.
     *
     * @param {string} level - Severity level for the entry.
     * @param {string} message - Human-readable diagnostic message.
     * @param {*} [metadata] - Optional structured metadata to attach to the entry.
     * @returns {void}
     */
    private record(
        level: DiagnosticsEntry['level'],
        message: string,
        metadata?: Record<string, unknown>
    ): void {
        if (this.disposed) {
            return;
        }

        if (this.entries.length === MAX_ENTRIES) {
            this.entries.shift();
        }

        this.entries.push({
            level,
            message,
            timestamp: new Date().toISOString(),
            ...(metadata ? { metadata } : {})
        });
    }
}
