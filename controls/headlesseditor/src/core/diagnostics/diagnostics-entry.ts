/**
 * DiagnosticsEntry — a single recorded diagnostic event.
 *
 * @hidden
 */
export interface DiagnosticsEntry {
    /** Severity level of the entry. */
    readonly level: 'info' | 'warn' | 'error' | 'debug';
    /** Human-readable message. */
    readonly message: string;
    /** ISO 8601 timestamp produced by `new Date().toISOString()`. */
    readonly timestamp: string;
    /** Optional structured metadata attached to the entry. */
    readonly metadata?: Record<string, unknown>;
}
