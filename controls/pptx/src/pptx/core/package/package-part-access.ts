/**
 * Live package part get/set for optional feature modules that own foreign part DOM.
 *
 * @remarks
 * Mirrors {@link HostPartRelationshipAccess} and picture media write access: closures
 * over the live {@link OpcPackage} so part byte writes, relationship edits, and
 * content-type overrides are visible to {@link Presentation.save} without
 * re-open. Used by optional modules (e.g. `@syncfusion/ej2-pptx/notes`) whose markup lives outside
 * the presentation/slide roots flushed by core. Does not open network connections or
 * execute part content.
 *
 * @internal
 */
import { SecurityLimits } from '../security/limits';
import { OoxmlElement } from '../xml/dom';
import { OpcPackage, PackagePart } from './package-model';
import { PackageRelationship } from './relationships';
import { arrayAt } from '../util/es5-compat';
/**
 * Mutable package surface for reading relationships and reading/writing part bytes.
 *
 * @remarks
 * Obtained from {@link Presentation.packagePartAccess}. Callers that mutate
 * a parsed DOM for a non-slide part must {@link PackagePartAccess.setPart} the
 * serialized bytes before {@link Presentation.save} (core flush only covers
 * presentation + slide roots). Create/associate paths (notes) also use
 * {@link PackagePartAccess.replaceRelationships} and
 * {@link PackagePartAccess.ensureContentTypeOverride}.
 *
 * @public
 */
export interface PackagePartAccess {
    /**
     * Security limits bound to the package (XML, shape walk, text length, entry count, …).
     */
    readonly limits: SecurityLimits;
    /**
     * Relationships whose source is `sourcePartName` (`/` for package relationships).
     *
     * @param sourcePartName - Absolute source part URI, or `/`.
     */
    getRelationships(sourcePartName?: string): ReadonlyArray<PackageRelationship>;
    /**
     * Replaces the full relationship collection for a source part.
     *
     * @param sourcePartName - Absolute source part URI (relationship map key).
     * @param rels - New relationship rows (copied into the package model).
     */
    replaceRelationships(sourcePartName: string, rels: ReadonlyArray<PackageRelationship>): void;
    /**
     * Package part by absolute OPC name, or `undefined` when missing.
     *
     * @param partName - Absolute part URI.
     * @returns A **copy** of the part (name, content type, data). Mutating the returned
     *   `data` does not change the package; use {@link PackagePartAccess.setPart}.
     */
    getPart(partName: string): PackagePart | undefined;
    /**
     * Inserts or replaces a package part by absolute name.
     *
     * @param part - Part to store (data is copied into the package model).
     */
    setPart(part: PackagePart): void;
    /**
     * Ensures an Override content type for an absolute part name.
     *
     * @param partName - Absolute part URI.
     * @param contentType - Content type string (e.g. notesSlide).
     *
     * @remarks
     * Live override keeps the in-memory model consistent before save; save also runs
     * `ensureContentTypesForParts` from part content types.
     */
    ensureContentTypeOverride(partName: string, contentType: string): void;
    /**
     * Deletes a package part, its relationship map entry, and content-type Override.
     *
     * @param partName - Absolute OPC part URI.
     *
     * @remarks
     * Mirrors digital-signature cleanup `removePart` behaviour: drops `parts` and
     * `partRelationships` for the name, and removes the Override key when present.
     * No-op when the part is already absent. Used by optional modules that remove
     * owned parts (e.g. diagrams `removeSmartArt`). Does not rewrite other sources'
     * relationship rows — callers must filter those separately.
     */
    deletePart(partName: string): void;
    /**
     * Number of parts currently in the package map (for `entryCount` checks).
     */
    partCount(): number;
    /**
     * Drops the content-types Override for `partName` only.
     *
     * @param partName - Absolute part URI.
     *
     * @remarks Never removes Default rows for image extensions.
     */
    removeContentTypeOverride(partName: string): void;
    /**
     * Ensures a Default content-type mapping for an extension (e.g. `png` → `image/png`).
     *
     * @param extension - Extension without a leading dot.
     * @param contentType - Content type string.
     */
    ensureContentTypeDefault(extension: string, contentType: string): void;
    /**
     * Iterates every source-part relationship map entry in the package.
     *
     * @remarks
     * Used for package-wide media part-name refcount after picture remove.
     * Does not include package-level `/_rels/.rels` rows.
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
     * Live `p:presentation` root, when this access was created from a document.
     * Save flushes this root, so notes-master registration must mutate it.
     */
    readonly presentationRoot?: OoxmlElement;
}
/**
 * Builds live part access closures over a package.
 *
 * @remarks Closures read/write the live `parts`, `partRelationships`, and `contentTypes` maps. Never opens network connections.
 * @internal
 * @param {OpcPackage} pkg - Mutable package owned by the document.
 * @returns {PackagePartAccess} Access used by optional feature modules (notes write-back / create, …).
 */
export function createPackagePartAccess(pkg: OpcPackage, presentationRoot?: () => OoxmlElement): PackagePartAccess {
    return {
        limits: pkg.limits,
        get presentationRoot(): OoxmlElement | undefined {
            return presentationRoot === undefined ? undefined : presentationRoot();
        },
        getRelationships: (sourcePartName: string = '/') => {
            const key: string = sourcePartName === '' ? '/' : sourcePartName;
            const rels: Array<PackageRelationship> = pkg.partRelationships.get(key);
            if (rels === undefined) {
                return Object.freeze([]);
            }
            return Object.freeze(rels.map((r: PackageRelationship) => ({ ...r })));
        },
        replaceRelationships: (sourcePartName: string, rels: ReadonlyArray<PackageRelationship>) => {
            const key: string = sourcePartName === '' ? '/' : sourcePartName;
            pkg.partRelationships.set(key, [...rels]);
        },
        getPart: (partName: string) => {
            const part: PackagePart = pkg.parts.get(partName);
            if (part === undefined) {
                return undefined;
            }
            return {
                name: part.name,
                contentType: part.contentType,
                data: part.data.slice()
            };
        },
        setPart: (part: PackagePart) => {
            pkg.parts.set(part.name, {
                name: part.name,
                contentType: part.contentType,
                data: part.data.slice()
            });
        },
        ensureContentTypeOverride: (partName: string, contentType: string) => {
            pkg.contentTypes.overrides.set(partName, contentType);
        },
        deletePart: (partName: string) => {
            pkg.parts.delete(partName);
            pkg.partRelationships.delete(partName);
            if (pkg.contentTypes.overrides.has(partName)) {
                const overrides: Map<string, string> = new Map(pkg.contentTypes.overrides);
                overrides.delete(partName);
                pkg.contentTypes = {
                    defaults: pkg.contentTypes.defaults,
                    overrides
                };
            }
        },
        partCount: () => pkg.parts.size,
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
        ensureContentTypeDefault: (extension: string, contentType: string) => {
            pkg.contentTypes.defaults.set(extension, contentType);
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
        iterateParts: (): IterableIterator<PackagePart> => pkg.parts.values()
    };
}
