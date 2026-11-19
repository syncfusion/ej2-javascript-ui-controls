/**
 * Parser options and diagnostics shared by the Office Math parser.
 */

/**
 * Optional diagnostic callback for degradation events.
 *
 * @public
 */
export interface MathParseDiagnostic {
    readonly path: string;
    readonly message: string;
    readonly localName: string;
}

/**
 * Parser options.
 *
 * @public
 */
export interface ParseMathOptions {
    /** Called when a structure is degraded to preserve-only. */
    readonly onDiagnostic?: (d: MathParseDiagnostic) => void;
}
