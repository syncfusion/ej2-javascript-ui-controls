import { OpcPackage } from '../../core/opc/package';
/**
 * Optional feature-owned state for OPC parts linked from package relationships.
 *
 *  Internal package-part state. Not part of the public API.
 *
 * @private
 */
export interface FeaturePackageLevelPart {
    /** Whether serialized output must replace or add package parts on save. */
    isDirty(): boolean;
    /** Apply dirty part payloads and package relationships. */
    applyToPackage(pkg: OpcPackage): OpcPackage;
}
/**
 * @param {Object} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isFeaturePackageLevelPart(value: {
    isDirty(): boolean;
}): value is FeaturePackageLevelPart {
    return ('applyToPackage' in value &&
        typeof (value as FeaturePackageLevelPart).applyToPackage === 'function' &&
        (value as FeaturePackageLevelPart).applyToPackage.length === 1);
}
