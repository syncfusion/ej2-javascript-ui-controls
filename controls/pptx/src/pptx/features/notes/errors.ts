/**
 * Typed errors for the optional notes module.
 *
 * @remarks
 * Malformed package/XML conditions continue to use core
 * {@link Error} / {@link Error}. This module adds
 * notes-domain guidance (e.g. missing body placeholder on write).
 */
/**
 * Notes-domain failure (missing body placeholder, unexpected notes DOM state).
 *
 * @remarks
 * Not part of the public notes feature surface; import only from feature internals/tests.
 *
 * @internal
 */
export class NotesError extends Error {
    /** Absolute notes slide part URI when known. */
    readonly partName: string | undefined;
    /**
     * @param {string} message - Human-readable description.
     * @param {object} options - Optional part name for diagnostics.
     * @param {*} options.partName - The options.partName value.
     */
    constructor(message: string, options: {
        readonly partName?: string;
    } = {}) {
        super(message);
        this.name = 'NotesError';
        this.partName = options.partName;
    }
}
