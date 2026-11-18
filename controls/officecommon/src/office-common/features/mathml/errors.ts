import { Literal } from '../../core/literal-type';
/**
 * Typed mathml errors (mathml-spec Errors section).
 *
 * Common-owned; docx-js passes them through untouched.
 */

/**
 * Constraint categories for {@link MathmlValidationError}.
 *
 * @private
 * Internal error detail; not part of the public authoring API.
 */
export type MathmlConstraintKind =
  | 'child-order'
  | 'enum-value'
  | 'required-child'
  | 'value-range';

/**
 * Schema violation detected on author/serialize of a typed math tree.
 *
 * Source: mathml-spec Errors section —
 * `elementPath` dotted model path (e.g. `'oMath.f.den'`),
 * `constraintKind` one of child-order | enum-value | required-child | value-range.
 *
 * @private
 * Internal error contract between the mathml model, parser, and serializer;
 * not part of the public authoring API.
 */
export class MathmlValidationError extends Error {
    /**
     * Dotted model path of the violating element (e.g. `'oMath.f.den'`).
     */
    readonly elementPath: string;

    /**
     * Constraint category that was violated.
     */
    readonly constraintKind: MathmlConstraintKind;

    constructor(
        message: string,
        elementPath: string,
        constraintKind: MathmlConstraintKind
    ) {
        super(message);
        this.name = 'MathmlValidationError';
        this.elementPath = elementPath;
        this.constraintKind = constraintKind;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Mutation attempted on a preserve-only (degraded) math equation.
 *
 * Source: mathml-spec §8b — malformed load degrades; later mutate throws.
 *
 * @private
 * Internal error contract between the mathml model, parser, and serializer;
 * not part of the public authoring API.
 */
export class MathmlReadOnlyError extends Error {
    /**
     * Always `true` — the equation is locked in preserve-only mode and mutations are blocked.
     */
    readonly isPreserveOnly: Literal<true> = true;

    constructor(message: string = 'Math equation is preserve-only and cannot be mutated') {
        super(message);
        this.name = 'MathmlReadOnlyError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
