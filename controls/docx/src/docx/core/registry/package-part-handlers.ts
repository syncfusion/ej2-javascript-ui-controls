import { FeaturePackageLevelPart } from '../../features/document/feature-package-level-part';
import { allocateRelationshipId, relationshipsWith, TargetMode, OpcRelationship, Relationships, RelationshipId } from '../opc/relationships';
import { partByName, withAddedPart, withContentTypeOverride, withPackageRelationships, withReplacedPart, OpcPackage, PackagePart } from '../opc/package';
import { partNameKey, resolveInternalTarget, PartName } from '../opc/part-name';
import { ResourceLimitOverrides } from '../security/limits';
import { FeatureId } from './feature-registry';
/** @public */
export interface FeaturePackagePartLoadContext {
    readonly limits?: ResourceLimitOverrides | undefined;
}
/**
 *  Internal feature handler interface. Not part of the public API.
 *
 * @private
 */
export interface FeaturePackagePartHandler {
    readonly featureId: FeatureId;
    loadParts(pkg: OpcPackage, ctx: FeaturePackagePartLoadContext): FeaturePackageLevelPart;
}
const handlers: FeaturePackagePartHandler[] = [];
/**
 * @returns {void} Nothing is returned.
 *  Test hook. Not part of the public API.
 *
 * @private
 */
export function resetFeaturePackagePartHandlers(): void {
    handlers.length = 0;
}
/**
 * @param {FeaturePackagePartHandler} handler - The handler.
 * @returns {void} Nothing is returned.
 *  Internal feature registration. Not part of the public API.
 *
 * @private
 */
export function registerFeaturePackagePartHandler(handler: FeaturePackagePartHandler): void {
    handlers.push(handler);
}
/**
 * @returns {ReadonlyArray<FeaturePackagePartHandler>} The result.
 *  Internal feature package part listing. Not part of the public API.
 *
 * @private
 */
export function listFeaturePackagePartHandlers(): ReadonlyArray<FeaturePackagePartHandler> {
    return handlers;
}
/**
 * @param {OpcPackage} pkg - The pkg.
 * @param {ResourceLimitOverrides} limits - The limits.
 * @returns {Map<FeatureId, FeaturePackageLevelPart>} The result.
 *  Internal feature package part loading. Not part of the public API.
 *
 * @private
 */
export function loadFeaturePackageParts(pkg: OpcPackage, limits?: ResourceLimitOverrides): Map<FeatureId, FeaturePackageLevelPart> {
    const out: Map<FeatureId, FeaturePackageLevelPart> = new Map<FeatureId, FeaturePackageLevelPart>();
    const ctx: FeaturePackagePartLoadContext = { limits };
    for (const handler of handlers) {
        out.set(handler.featureId, handler.loadParts(pkg, ctx));
    }
    return out;
}
function mergeRelationships(existing: Relationships, add: ReadonlyArray<OpcRelationship>): Relationships {
    if (add.length === 0) {
        return existing;
    }
    const used: Set<RelationshipId> = new Set(existing.items.map((item: OpcRelationship) => item.id));
    const next: OpcRelationship[] = [...existing.items];
    for (const rel of add) {
        if (next.some((item: OpcRelationship) => item.type === rel.type && item.target === rel.target)) {
            continue;
        }
        let id: RelationshipId = rel.id;
        while (used.has(id)) {
            id = allocateRelationshipId(used);
        }
        used.add(id);
        next.push({ ...rel, id });
    }
    return relationshipsWith(next, existing.opaque);
}
/**
 * @param {OpcPackage} pkg - The pkg.
 * @param {ReadonlyMap<FeatureId, FeaturePackageLevelPart>} featureParts - The feature parts.
 * @returns {OpcPackage} The result.
 *  Internal feature package part application. Not part of the public API.
 *
 * @private
 */
export function applyFeaturePackageParts(pkg: OpcPackage, featureParts: ReadonlyMap<FeatureId, FeaturePackageLevelPart>): OpcPackage {
    let next: OpcPackage = pkg;
    for (const handler of handlers) {
        const state: FeaturePackageLevelPart = featureParts.get(handler.featureId);
        if (state === undefined || !state.isDirty()) {
            continue;
        }
        next = state.applyToPackage(next);
    }
    return next;
}
/**
 *  @public Helpers for feature modules implementing {@link FeaturePackageLevelPart}.
 *
 * @param {OpcPackage} pkg - The pkg.
 * @param {string} relationshipType - The relationship type.
 * @returns {Object} The result.
 */
export function findPackageRelatedPart(pkg: OpcPackage, relationshipType: string): {
    readonly relationship: OpcRelationship;
    readonly part: PackagePart;
} | undefined {
    for (const rel of pkg.packageRelationships.items) {
        if (rel.type !== relationshipType || rel.targetMode === TargetMode.External) {
            continue;
        }
        const target: PartName = resolveInternalTarget(rel.target);
        const part: PackagePart = partByName(pkg, target);
        if (part === undefined) {
            continue;
        }
        return { relationship: rel, part };
    }
    return undefined;
}
export function replaceOrAddPackageLevelPart(
    pkg: OpcPackage,
    partNameValue: PartName,
    contentType: string,
    data: Uint8Array,
    relationship: OpcRelationship | undefined
): OpcPackage {
    let next: OpcPackage = pkg;
    const existing: PackagePart = partByName(next, partNameValue);
    if (existing === undefined) {
        next = withAddedPart(next, { name: partNameValue, contentType, data });
        next = withContentTypeOverride(next, partNameValue, contentType);
        if (relationship !== undefined) {
            next = withPackageRelationships(next, mergeRelationships(next.packageRelationships, [relationship]));
        }
        return next;
    }
    next = withReplacedPart(next, partNameValue, data);
    return next;
}
export function usedPackagePartNameKeys(pkg: OpcPackage): Set<string> {
    const used: Set<string> = new Set<string>();
    for (const part of pkg.parts) {
        used.add(partNameKey(part.name));
    }
    return used;
}
export function usedPackageRelationshipIds(pkg: OpcPackage): Set<string> {
    return new Set(pkg.packageRelationships.items.map((item: OpcRelationship) => item.id));
}
