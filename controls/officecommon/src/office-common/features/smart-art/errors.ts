/**
 * Errors for DrawingML diagram (SmartArt) part parse and serialize.
 *
 * @remarks
 * Explicit part APIs throw when required schema structure is absent (e.g. missing
 * `ptLst` on `dataModel`). Package-level opaque preserve of unknown parts is a
 * separate path and does not use these errors for unmodeled content.
 * @public
 */

/**
 * Thrown when diagram part XML cannot be parsed or fails a required schema check
 * for an explicit SmartArt API call.
 *
 * @public
 */
export class DiagramPartError extends Error {
    /**
     * Creates a diagram part error.
     *
     * @param {string} message - Human-readable description (no secrets).
     */
    public constructor(message: string) {
        super(message);
        this.name = 'DiagramPartError';
        // ES5 / AMD emit: restore prototype so `instanceof DiagramPartError` works in browsers.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
