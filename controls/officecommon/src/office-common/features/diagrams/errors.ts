/**
 * Typed errors for diagram parse / model / catalog operations.
 * Load of recoverable diagram damage MUST NOT throw at package level;
 * parsers of a single part MAY throw DiagramParseError for that part.
 */

export type DiagramErrorCode =
  | 'invalid_root'
  | 'missing_required'
  | 'invalid_attribute'
  | 'limit_exceeded'
  | 'unknown_point'
  | 'inconsistent_graph'
  | 'invalid_rel_ids'
  | 'not_diagram'
  | 'catalog_error';

export class DiagramError extends Error {
    readonly code: DiagramErrorCode;

    constructor(code: DiagramErrorCode, message: string) {
        super(message);
        this.name = 'DiagramError';
        this.code = code;
        // ES5 / AMD emit: restore prototype so `instanceof` works in browsers.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class DiagramParseError extends DiagramError {
    constructor(code: DiagramErrorCode, message: string) {
        super(code, message);
        this.name = 'DiagramParseError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class DiagramModelError extends DiagramError {
    constructor(code: DiagramErrorCode, message: string) {
        super(code, message);
        this.name = 'DiagramModelError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * The is diagram error.
 *
 * @param {unknown} value - The value.
 * @returns {boolean} The result.
 */
export function isDiagramError(value: unknown): value is DiagramError {
    return value instanceof DiagramError;
}
