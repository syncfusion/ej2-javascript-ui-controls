/**
 * Optional feature-owned OPC package part state.
 *
 * Required on the public surface under `stripInternal` because document
 * package-part wiring and related exports reference this type.
 *
 * @private
 */
export interface FeaturePackagePart {
    /** Whether serialized output must replace the part on save. */
    isDirty(): boolean;
    /** UTF-8 payload for the package part. */
    serialize(): Uint8Array;
}
