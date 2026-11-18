/**
 * Live host-part relationship access for optional feature mutators.
 *
 * @remarks
 * Mirrors the picture media-access pattern: closures over the live
 * {@link OpcPackage} so relationship edits are visible to subsequent reads and
 * {@link Presentation.save} without re-open. Does not open network
 * connections or fetch relationship Targets.
 *
 * @internal
 */
import { SecurityLimits } from '../security/limits';
import { OpcPackage } from './package-model';
import { PackageRelationship } from './relationships';
/**
 * Mutable relationship surface for a single OPC source part (e.g. a slide).
 *
 * @remarks
 * Used by optional modules (hyperlinks-actions) that must add, retarget, or
 * remove relationships while enforcing {@link SecurityLimits.relationshipsPerPart}.
 * Not a public content-mutation verb on the object model — callers obtain this
 * bag from {@link Presentation.hostPartRelationshipAccess}.
 *
 * @public
 */
export interface HostPartRelationshipAccess {
    /**
     * Absolute OPC URI of the relationship source part.
     */
    readonly partName: string;
    /**
     * Security limits bound to the package (relationship count, etc.).
     */
    readonly limits: SecurityLimits;
    /**
     * Current relationships whose source is {@link HostPartRelationshipAccess.partName}.
     */
    getRelationships(): ReadonlyArray<PackageRelationship>;
    /**
     * Replaces the full relationship collection for this host part.
     *
     * @param rels - New relationship rows (copied into the package model).
     */
    replaceRelationships(rels: ReadonlyArray<PackageRelationship>): void;
}
/**
 * Builds live relationship access closures over a package source part.
 *
 * @remarks Closures read/write the live `partRelationships` map. Never opens network connections.
 * @internal
 * @param {OpcPackage} pkg - Mutable package owned by the document.
 * @param {string} sourcePartName - Absolute source part URI (relationship map key).
 * @returns {HostPartRelationshipAccess} Access used by optional feature mutators.
 */
export function createHostPartRelationshipAccess(pkg: OpcPackage, sourcePartName: string): HostPartRelationshipAccess {
    const key: string = sourcePartName === '' ? '/' : sourcePartName;
    return {
        partName: key,
        limits: pkg.limits,
        getRelationships: () => ((function (): PackageRelationship[] {
            const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(key);
            return __rels != null ? __rels : [];
        })()),
        replaceRelationships: (rels: ReadonlyArray<PackageRelationship>) => {
            pkg.partRelationships.set(key, [...rels]);
        }
    };
}
