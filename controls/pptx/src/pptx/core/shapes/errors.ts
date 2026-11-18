/**
 * Typed errors for shape tree and text-body access.
 */
/**
 * Builds an options bag that includes `partName` only when defined.
 *
 * Required under `exactOptionalPropertyTypes` so callers never pass
 * `partName: undefined` into `{ partName?: string }` option objects.
 *
 * @internal
 * @param {string | undefined} partName - The partName value.
 * @returns {object} The result.
 */
export function partNameOptions(partName: string | undefined): {
    readonly partName?: string;
} {
    return partName === undefined ? {} : { partName };
}
/**
 * Raised when a slide shape cannot be resolved by `cNvPr/@id`.
 *
 * @remarks
 * Not part of the public package surface; import only from core internals/tests.
 *
 * @internal
 */
export class ShapeNotFoundError extends Error {
    /** Requested drawing element id (`cNvPr/@id` string as authored). */
    readonly shapeId: string;
    /**
     * @param {string} shapeId - Id that was looked up.
     * @param {object} options - Optional slide part name for diagnostics.
     * @param {*} options.partName - The options.partName value.
     */
    constructor(shapeId: string, options: {
        readonly partName?: string;
    } = {}) {
        const partSuffix: string = options.partName === undefined ? '' : ` (part: ${options.partName})`;
        super(`Shape with id "${shapeId}" was not found on the slide${partSuffix}`);
        this.name = 'ShapeNotFoundError';
        this.shapeId = shapeId;
    }
}
/**
 * Raised when a text operation is invalid for the target shape or run.
 *
 * @remarks
 * Examples: the shape has no `p:txBody` / `a:txBody`, or a run element has no `a:t`.
 * Not part of the public package surface; import only from core internals/tests.
 *
 * @internal
 */
export class ShapeTextError extends Error {
    /** Offending part name when applicable. */
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
        this.name = 'ShapeTextError';
        this.partName = options.partName;
    }
}
/**
 * Raised when shape-tree walk detects a cyclic group structure.
 *
 * @remarks
 * Fail-closed defensive guard: normal OOXML DOM trees cannot cycle. A cycle can only
 * appear via hostile/custom trees or internal graph mistakes. Walk and
 * {@link Shape.children} abort rather than recurse forever.
 * Not part of the public package surface; import only from core internals/tests.
 *
 * Citation: `docs/specs/017-group-navigate-depth.md` cycle detection.
 *
 * @internal
 */
export class ShapeTreeCycleError extends Error {
    /** Offending part name when applicable. */
    readonly partName: string | undefined;
    /**
     * @param {string} message - Human-readable description.
     * @param {object} options - Optional part name.
     * @param {*} options.partName - The options.partName value.
     */
    constructor(message: string = 'Shape tree contains a cyclic group structure', options: {
        readonly partName?: string;
    } = {}) {
        super(message);
        this.name = 'ShapeTreeCycleError';
        this.partName = options.partName;
    }
}
