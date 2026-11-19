/**
 * Typed errors for hyperlink mutation failures.
 *
 * @remarks
 * Distinct from {@link Error} (relationship count) and
 * {@link Error} (path escape on internal retarget). Missing
 * element / missing `r:id` / missing relationship on retarget or clear use this
 * type so callers can distinguish authoring mistakes from package limits.
 *
 * Citation: `docs/specs/015-hyperlinks.md` Errors table.
 *
 * @packageDocumentation
 */
/**
 * Raised when a hyperlink mutation cannot proceed due to missing markup or rId.
 *
 * @remarks
 * Not part of the public hyperlinks-actions feature surface; import only from feature internals/tests.
 *
 * @internal
 */
export class HyperlinkMutationError extends Error {
    /**
     * Optional host part name for diagnostics.
     */
    readonly partName: string | undefined;
    /**
     * @param {string} message - Human-readable description.
     * @param {object} options - Optional part name.
     * @param {*} options.partName - The options.partName value.
     */
    constructor(message: string, options: {
        readonly partName?: string;
    } = {}) {
        super(message);
        this.name = 'HyperlinkMutationError';
        this.partName = options.partName;
    }
}
