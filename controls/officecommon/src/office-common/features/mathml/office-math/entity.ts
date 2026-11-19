/**
 * Root contract of every Office Math object.
 */

/**
 * Participates in the Math owner hierarchy.
 *
 * @public
 */
export interface OfficeMathEntity {
    /** The entity that contains this object, or `undefined` for a root/detached object. */
    readonly ownerMathEntity: OfficeMathEntity | undefined;
}
