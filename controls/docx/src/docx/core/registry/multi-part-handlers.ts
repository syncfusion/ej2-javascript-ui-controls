import { FeatureMultiPackagePart } from '../../features/document/feature-multi-package-part';
import { allocateRelationshipId, relationshipsWith, OpcRelationship, Relationships, RelationshipId } from '../opc/relationships';
import { partByName, relationshipsForPart, withAddedPart, withContentTypeOverride, withPartRelationships, withReplacedPart, OpcPackage, PackagePart } from '../opc/package';
import { partName, PartName } from '../opc/part-name';
import { ResourceLimitOverrides } from '../security/limits';
import { FeatureId } from './feature-registry';
/**
 * @public
 */
export interface FeatureMultiPartLoadContext {
    readonly mainPartName: PartName;
    readonly limits?: ResourceLimitOverrides | undefined;
}
/**
 *  Internal feature handler interface. Not part of the public API.
 *
 * @private
 */
export interface FeatureMultiPartHandler {
    readonly featureId: FeatureId;
    readonly relationshipTypes: ReadonlyArray<string>;
    loadParts(pkg: OpcPackage, ctx: FeatureMultiPartLoadContext): FeatureMultiPackagePart;
}
const handlers: FeatureMultiPartHandler[] = [];
/**
 * @returns {void} Nothing is returned.
 *  Test hook. Not part of the public API.
 *
 * @private
 */
export function resetFeatureMultiPartHandlers(): void {
    handlers.length = 0;
}
/**
 * @param {FeatureMultiPartHandler} handler - The handler.
 * @returns {void} Nothing is returned.
 *  Internal feature registration. Not part of the public API.
 *
 * @private
 */
export function registerFeatureMultiPartHandler(handler: FeatureMultiPartHandler): void {
    handlers.push(handler);
}
/**
 * @returns {ReadonlyArray<FeatureMultiPartHandler>} The result.
 *  Internal feature multi-part listing. Not part of the public API.
 *
 * @private
 */
export function listFeatureMultiPartHandlers(): ReadonlyArray<FeatureMultiPartHandler> {
    return handlers;
}
/**
 * @param {OpcPackage} pkg - The pkg.
 * @param {PartName} mainPartName - The main part name.
 * @param {ResourceLimitOverrides} limits - The limits.
 * @returns {Map<FeatureId, FeatureMultiPackagePart>} The result.
 *  Internal feature multi-part loading. Not part of the public API.
 *
 * @private
 */
export function loadFeatureMultiParts(
    pkg: OpcPackage,
    mainPartName: PartName,
    limits?: ResourceLimitOverrides
): Map<FeatureId, FeatureMultiPackagePart> {
    const out: Map<FeatureId, FeatureMultiPackagePart> = new Map<FeatureId, FeatureMultiPackagePart>();
    const ctx: FeatureMultiPartLoadContext = { mainPartName, limits };
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
 * Relationship ids already claimed on the main document part — package items plus
 * every multi-part catalog that has already allocated pending entries.
 *
 * Materialize handlers for independent features (images, ink, hyperlinks, …) must
 * share this set so concurrent pending allocations cannot emit the same rId.
 *
 * @param {Object} document - The document.
 * @returns {Set<string>} The result.
 * @private
 */
export function usedMainDocumentRelationshipIds(document: {
    opcPackage(): OpcPackage;
    featurePart(id: FeatureId): unknown;
}): Set<string> {
    const main: PartName = partName('/word/document.xml');
    const used: Set<string> = new Set<string>();
    for (const rel of relationshipsForPart(document.opcPackage(), main).items) {
        used.add(rel.id);
    }
    for (const handler of handlers) {
        const part: unknown = document.featurePart(handler.featureId);
        if (part === undefined || part === null || typeof part !== 'object') {
            continue;
        }
        const catalog: { pendingRelationshipIds?: () => ReadonlyArray<string>; } = part as {
            pendingRelationshipIds?: () => ReadonlyArray<string>;
        };
        if (typeof catalog.pendingRelationshipIds !== 'function') {
            continue;
        }
        for (const id of catalog.pendingRelationshipIds()) {
            used.add(id);
        }
    }
    return used;
}
/**
 * @param {OpcPackage} pkg - The pkg.
 * @param {PartName} mainPartName - The main part name.
 * @param {ReadonlyMap<FeatureId, FeatureMultiPackagePart>} featureParts - The feature parts.
 * @returns {OpcPackage} The result.
 *  Internal feature multi-part application. Not part of the public API.
 *
 * @private
 */
export function applyFeatureMultiParts(
    pkg: OpcPackage,
    mainPartName: PartName,
    featureParts: ReadonlyMap<FeatureId, FeatureMultiPackagePart>
): OpcPackage {
    let next: OpcPackage = pkg;
    for (const handler of handlers) {
        const state: FeatureMultiPackagePart = featureParts.get(handler.featureId);
        if (state === undefined || !state.isDirty()) {
            continue;
        }
        next = state.applyToPackage(next, mainPartName);
    }
    return next;
}
/**
 * Helpers for feature modules implementing {@link FeatureMultiPackagePart}.
 *
 * @private
 *
 * @param {OpcPackage} pkg - The pkg.
 * @param {PartName} mainPartName - The main part name.
 * @param {PartName} partName - The part name.
 * @param {string} contentType - The content type.
 * @param {Uint8Array} data - The data.
 * @param {OpcRelationship | undefined} relationship - The relationship.
 * @returns {OpcPackage} The result.
 */
export function replaceOrAddPackagePart(
    pkg: OpcPackage,
    mainPartName: PartName,
    partName: PartName,
    contentType: string,
    data: Uint8Array,
    relationship: OpcRelationship | undefined
): OpcPackage {
    let next: OpcPackage = pkg;
    const existing: PackagePart = partByName(next, partName);
    if (existing === undefined) {
        next = withAddedPart(next, { name: partName, contentType, data });
        next = withContentTypeOverride(next, partName, contentType);
        if (relationship !== undefined) {
            const merged: Relationships = mergeRelationships(relationshipsForPart(next, mainPartName), [relationship]);
            next = withPartRelationships(next, mainPartName, merged);
        }
        return next;
    }
    next = withReplacedPart(next, partName, data);
    return next;
}
