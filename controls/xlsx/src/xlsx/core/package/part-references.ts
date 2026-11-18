/**
 * Package-wide reference checks used to remove parts that nothing points at.
 *
 * @private
 */

import { OpcPackage } from './opc-package';
import { OpcRelationship } from './relationships';
import { partNamesEqual } from './part-names';

/**
 * True when any relationship in the package targets `partName`.
 *
 * @param {OpcPackage} pkg - Package to scan.
 * @param {string} partName - Absolute part name.
 * @returns {boolean} Whether a relationship targets the part.
 *
 * @private
 */
export function isPartReferenced(pkg: OpcPackage, partName: string): boolean {
    const sources: Array<string | null> = [null];
    for (const name of pkg.partNames()) {
        sources.push(name);
    }
    for (const source of sources) {
        const rels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(source);
        for (const rel of rels) {
            if (rel.targetMode !== 'External' && partNamesEqual(rel.resolvedTarget, partName)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Remove a part (and its content-type override and own relationships) when no
 * relationship in the package targets it any more.
 *
 * @param {OpcPackage} pkg - Package to edit.
 * @param {string} partName - Absolute part name.
 * @returns {boolean} True when the part was removed.
 *
 * @private
 */
export function removePartIfUnreferenced(pkg: OpcPackage, partName: string): boolean {
    if (pkg.getPart(partName) === undefined || isPartReferenced(pkg, partName)) {
        return false;
    }
    return pkg.removePart(partName);
}
