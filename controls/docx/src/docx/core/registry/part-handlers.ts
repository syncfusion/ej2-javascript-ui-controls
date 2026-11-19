import { FeaturePackagePart } from '../../features/document/feature-package-part';
import { allocateRelationshipId, relationshipsWith, TargetMode, OpcRelationship, Relationships, RelationshipId } from '../opc/relationships';
import { partByName, relationshipsForPart, withAddedPart, withContentTypeOverride, withPartRelationships, withReplacedPart, OpcPackage, PackagePart } from '../opc/package';
import { resolveInternalTarget, PartName } from '../opc/part-name';
import { ResourceLimitOverrides } from '../security/limits';
import { FeatureId } from './feature-registry';
/** @public */
export interface FeaturePartLoadContext {
    readonly mainPartName: PartName;
    readonly limits?: ResourceLimitOverrides | undefined;
}
/**
 *  Internal feature handler interface. Not part of the public API.
 *
 * @private
 */
export interface FeaturePartHandler {
    readonly featureId: FeatureId;
    readonly relationshipTypes: ReadonlyArray<string>;
    readonly defaultRelativeTarget: string;
    readonly partName: PartName;
    readonly contentType: string;
    loadPart(part: PackagePart | undefined, ctx: FeaturePartLoadContext): FeaturePackagePart;
}
const handlers: FeaturePartHandler[] = [];
/**
 * @returns {void} Nothing is returned.
 *  Test hook. Not part of the public API.
 *
 * @private
 */
export function resetFeaturePartHandlers(): void {
    handlers.length = 0;
}
/**
 * @param {FeaturePartHandler} handler - The handler.
 * @returns {void} Nothing is returned.
 *  Internal feature registration. Not part of the public API.
 *
 * @private
 */
export function registerFeaturePartHandler(handler: FeaturePartHandler): void {
    handlers.push(handler);
}
/**
 * @returns {ReadonlyArray<FeaturePartHandler>} The result.
 *  Internal feature part listing. Not part of the public API.
 *
 * @private
 */
export function listFeaturePartHandlers(): ReadonlyArray<FeaturePartHandler> {
    return handlers;
}
function findRelatedPart(pkg: OpcPackage, source: PartName, relationshipTypes: ReadonlyArray<string>): PackagePart | undefined {
    const rels: Relationships = relationshipsForPart(pkg, source);
    for (const rel of rels.items) {
        if (relationshipTypes.indexOf(rel.type) === -1 || rel.targetMode === TargetMode.External) {
            continue;
        }
        const target: PartName = resolveInternalTarget(rel.target, source);
        return partByName(pkg, target);
    }
    return undefined;
}
/**
 * @param {OpcPackage} pkg - The pkg.
 * @param {PartName} mainPartName - The main part name.
 * @param {ResourceLimitOverrides} limits - The limits.
 * @returns {Map<FeatureId, FeaturePackagePart>} The result.
 *  Internal feature part loading. Not part of the public API.
 *
 * @private
 */
export function loadFeatureParts(
    pkg: OpcPackage,
    mainPartName: PartName,
    limits?: ResourceLimitOverrides
): Map<FeatureId, FeaturePackagePart> {
    const out: Map<FeatureId, FeaturePackagePart> = new Map<FeatureId, FeaturePackagePart>();
    const ctx: FeaturePartLoadContext = { mainPartName, limits };
    for (const handler of handlers) {
        const part: PackagePart = findRelatedPart(pkg, mainPartName, handler.relationshipTypes);
        out.set(handler.featureId, handler.loadPart(part, ctx));
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
 * @param {PartName} mainPartName - The main part name.
 * @param {ReadonlyMap<FeatureId, FeaturePackagePart>} featureParts - The feature parts.
 * @returns {OpcPackage} The result.
 *  Internal feature part application. Not part of the public API.
 *
 * @private
 */
export function applyFeatureParts(
    pkg: OpcPackage,
    mainPartName: PartName,
    featureParts: ReadonlyMap<FeatureId, FeaturePackagePart>
): OpcPackage {
    let next: OpcPackage = pkg;
    for (const handler of handlers) {
        const state: FeaturePackagePart = featureParts.get(handler.featureId);
        if (state === undefined || !state.isDirty()) {
            continue;
        }
        const data: Uint8Array = state.serialize();
        const existing: PackagePart = partByName(next, handler.partName);
        if (existing === undefined) {
            next = withAddedPart(next, {
                name: handler.partName,
                contentType: handler.contentType,
                data
            });
            next = withContentTypeOverride(next, handler.partName, handler.contentType);
            const rel: OpcRelationship = {
                id: allocateRelationshipId(new Set([
                    ...next.packageRelationships.items.map((item: OpcRelationship) => item.id),
                    ...relationshipsForPart(next, mainPartName).items.map((item: OpcRelationship) => item.id)
                ])),
                type: handler.relationshipTypes[0] != null ? handler.relationshipTypes[0] : '',
                target: handler.defaultRelativeTarget,
                extraAttributes: [],
                children: []
            };
            const merged: Relationships = mergeRelationships(relationshipsForPart(next, mainPartName), [rel]);
            next = withPartRelationships(next, mainPartName, merged);
            continue;
        }
        next = withReplacedPart(next, handler.partName, data);
    }
    return next;
}
