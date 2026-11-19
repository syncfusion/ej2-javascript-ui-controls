import { OpcPackage } from '../../core/opc/package';
import { PartName } from '../../core/opc/part-name';
/**
 * Optional feature-owned state spanning multiple OPC parts (for example headers).
 *
 *  Internal package-part state. Not part of the public API.
 *
 * @private
 */
export interface FeatureMultiPackagePart {
    /** Whether serialized output must replace or add package parts on save. */
    isDirty(): boolean;
    /** Apply dirty part payloads and relationships to the package. */
    applyToPackage(pkg: OpcPackage, mainPartName: PartName): OpcPackage;
}
/**
 * @param {Object} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isFeatureMultiPackagePart(value: {
    isDirty(): boolean;
}): value is FeatureMultiPackagePart {
    return ('applyToPackage' in value &&
        typeof (value as FeatureMultiPackagePart).applyToPackage === 'function' &&
        (value as FeatureMultiPackagePart).applyToPackage.length >= 2);
}
