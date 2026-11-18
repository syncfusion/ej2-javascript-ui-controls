import { arrayAt } from '../util/es5-compat';
/**
 * Package-backed media resolution for picture blips (read + insert path).
 *
 * @remarks
 * Resolves `r:embed` to package part bytes and records `r:link` External targets
 * **without** fetching. Used by {@link Picture} via {@link Shape} media access
 * attached at slide load/create. Optional {@link PictureMediaAccess.write} enables
 * embedded insert (TASK-1017) via live closures over the package.
 *
 * @internal
 */
import { OpcPackage, PackagePart } from '../package/package-model';
import { PackageRelationship } from '../package/relationships';
/**
 * Mutable package surface for embedded picture insert.
 *
 * @remarks
 * Implemented as closures over the live {@link OpcPackage} so new media parts and
 * slide relationships are visible to subsequent {@link Picture.readEmbeddedBytes}
 * without re-open. Does not open network connections.
 *
 * @internal
 */
export interface PictureMediaWriteAccess {
    /**
     * Package part by absolute OPC name, or `undefined` when missing.
     */
    getPart(partName: string): PackagePart | undefined;
    /**
     * Inserts or replaces a package part by absolute name.
     */
    setPart(part: PackagePart): void;
    /**
     * Replaces the full slide relationship collection (source = slide part).
     */
    setSlideRelationships(rels: ReadonlyArray<PackageRelationship>): void;
    /**
     * Ensures a Default content-type mapping for an extension (e.g. `png` → `image/png`).
     */
    ensureContentTypeDefault(extension: string, contentType: string): void;
    /**
     * Ensures an Override content type for an absolute part name.
     */
    ensureContentTypeOverride(partName: string, contentType: string): void;
    /**
     * Removes a package part and its relationship map entry (if any).
     *
     * @remarks
     * Does **not** strip content-type Defaults. Pair with
     * {@link PictureMediaWriteAccess.removeContentTypeOverride} when the part
     * had an Override. Citation: TASK-1089 / spec 039 media GC.
     */
    deletePart(partName: string): void;
    /**
     * Drops the content-types **Override** for `partName` only.
     *
     * @remarks
     * Never removes Default rows for `png` / `jpeg` / `jpg` / `gif`.
     */
    removeContentTypeOverride(partName: string): void;
    /**
     * Iterates every source-part relationship map entry in the package.
     *
     * @remarks
     * Used for package-wide media part-name refcount after slide rel GC.
     */
    iterateAllRelationships(): IterableIterator<{
        readonly sourcePartName: string;
        readonly relationships: ReadonlyArray<PackageRelationship>;
    }>;
    /**
     * Iterates current package parts (for size / media accounting).
     */
    iterateParts(): IterableIterator<PackagePart>;
    /**
     * Number of parts currently in the package map.
     */
    partCount(): number;
}
/**
 * Package surface needed to resolve blip relationships on a slide.
 *
 * @internal
 */
export interface PictureMediaAccess {
    /**
     * Relationships whose source is the slide part (absolute URI key).
     */
    getSlideRelationships(): ReadonlyArray<PackageRelationship>;
    /**
     * Package part by absolute OPC name, or `undefined` when missing.
     */
    getPart(partName: string): PackagePart | undefined;
    /**
     * Write surface for embedded picture insert when attached at load/create.
     */
    readonly write?: PictureMediaWriteAccess;
}
/**
 * Builds live read/write media access closures over a package slide part.
 *
 * @remarks Closures read/write the live maps so insert is visible without re-open. Never opens network connections.
 * @internal
 * @param {OpcPackage} pkg - Mutable package owned by the document.
 * @param {string} slidePartName - Absolute slide part URI used as the relationship source key.
 * @returns {PictureMediaAccess} Access used by {@link Picture} and {@link ShapeCollection.addPicture}.
 */
export function createPictureMediaAccess(pkg: OpcPackage, slidePartName: string): PictureMediaAccess {
    const write: PictureMediaWriteAccess = {
        getPart: (name: string) => pkg.parts.get(name),
        setPart: (part: PackagePart) => {
            pkg.parts.set(part.name, part);
        },
        setSlideRelationships: (rels: ReadonlyArray<PackageRelationship>) => {
            pkg.partRelationships.set(slidePartName, [...rels]);
        },
        ensureContentTypeDefault: (extension: string, contentType: string) => {
            pkg.contentTypes.defaults.set(extension, contentType);
        },
        ensureContentTypeOverride: (partName: string, contentType: string) => {
            pkg.contentTypes.overrides.set(partName, contentType);
        },
        deletePart: (partName: string) => {
            pkg.parts.delete(partName);
            pkg.partRelationships.delete(partName);
        },
        removeContentTypeOverride: (partName: string) => {
            if (!pkg.contentTypes.overrides.has(partName)) {
                return;
            }
            const overrides: Map<string, string> = new Map(pkg.contentTypes.overrides);
            overrides.delete(partName);
            pkg.contentTypes = {
                defaults: pkg.contentTypes.defaults,
                overrides
            };
        },
        iterateAllRelationships: function* (): IterableIterator<{
            sourcePartName: string;
            relationships: ReadonlyArray<PackageRelationship>;
        }> {
            const relEntries: Array<[string, PackageRelationship[]]> = Array.from(pkg.partRelationships.entries());
            for (let i: number = 0; i < relEntries.length; i++) {
                const sourcePartName: string = arrayAt(relEntries, i)[0];
                const relationships: PackageRelationship[] = arrayAt(relEntries, i)[1];
                yield { sourcePartName, relationships };

            }
        },
        iterateParts: (): IterableIterator<PackagePart> => pkg.parts.values(),
        partCount: (): number => pkg.parts.size
    };
    return {
        getSlideRelationships: (): PackageRelationship[] => ((function (): PackageRelationship[] {
            const __rels: Array<PackageRelationship> | undefined = pkg.partRelationships.get(slidePartName);
            return __rels != null ? __rels : [];
        })()),
        getPart: (name: string) => pkg.parts.get(name),
        write
    };
}
/**
 * Looks up a relationship by Id on the slide relationship collection.
 *
 * @internal
 * @param {PictureMediaAccess} access - The access value.
 * @param {string} relationshipId - The relationshipId value.
 * @returns {PackageRelationship | undefined} The result.
 */
export function findSlideRelationship(access: PictureMediaAccess, relationshipId: string): PackageRelationship | undefined {
    const slideRelationships: ReadonlyArray<PackageRelationship> = access.getSlideRelationships();
    for (let i: number = 0; i < slideRelationships.length; i++) {
        const rel: PackageRelationship = arrayAt(slideRelationships, i);
        if (rel.id === relationshipId) {
            return rel;
        }

    }
    return undefined;
}
/**
 * Resolves an Internal embed relationship to part octets (slice-safe copy).
 *
 * @remarks Does not validate image codecs. External targets return `undefined` (never fetched).
 * @internal
 * @param {PictureMediaAccess} access - The access value.
 * @param {string} embedRelationshipId - The embedRelationshipId value.
 * @returns {Uint8Array | undefined} Bytes when the target part exists; `undefined` when missing or not Internal.
 */
export function readEmbeddedPartBytes(access: PictureMediaAccess, embedRelationshipId: string): Uint8Array | undefined {
    const rel: PackageRelationship = findSlideRelationship(access, embedRelationshipId);
    if (rel === undefined || rel.targetMode !== 'Internal' || rel.targetPartName === undefined) {
        return undefined;
    }
    const part: PackagePart = access.getPart(rel.targetPartName);
    if (part === undefined) {
        return undefined;
    }
    // Return a copy so callers cannot mutate the package store through the view.
    return part.data.slice();
}
/**
 * External `Target` string for a link relationship Id, when TargetMode is External.
 *
 * @remarks Returns the authored Target only — **never** opens a network connection.
 * @internal
 * @param {PictureMediaAccess} access - The access value.
 * @param {string} linkRelationshipId - The linkRelationshipId value.
 * @returns {string | undefined} The result.
 */
export function readExternalLinkTarget(access: PictureMediaAccess, linkRelationshipId: string): string | undefined {
    const rel: PackageRelationship = findSlideRelationship(access, linkRelationshipId);
    if (rel === undefined || rel.targetMode !== 'External') {
        return undefined;
    }
    return rel.target;
}
