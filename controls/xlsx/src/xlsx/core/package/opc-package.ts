/**
 * OPC package open/save over ZIP.
 *
 * Read path: ZIP inflate → content types → package rels → require officeDocument.
 * Write path: emit all parts + content types + relationship parts; preserve opaque bytes.
 *
 * Standards: ECMA-376-2 (OPC), officeDocument relationship types (transitional + strict).
 * Compression: `@syncfusion/ej2-compression` (see `../zip/`).
 *
 * @private
 */

import { InvalidPackageError } from '../errors';
import { ZipReadOptions } from '../zip/limits';
import { readZipEntries } from '../zip/zip-reader';
import { writeZip, ZipWriteEntry } from '../zip/zip-writer';
import { CONTENT_TYPES_PART_NAME, CONTENT_TYPES_ZIP_NAME, isOfficeDocumentRelationshipType, PACKAGE_RELS_PART_NAME } from './constants';
import { parseContentTypes, resolveContentType, serializeContentTypes, ContentTypes } from './content-types';
import { normalizePartName, partNameToZipName, partNamesEqual } from './part-names';
import { parseRelationships, relationshipPartName, serializeRelationships, OpcRelationship, RelationshipSourceKey } from './relationships';

/**
 * One OPC part held in memory.
 */
export interface OpcPart {
    /** Absolute OPC part name (`/xl/workbook.xml`). */
    readonly name: string;
    /** Raw part payload (opaque unless a higher layer parses it). */
    readonly data: Uint8Array;
    /** Resolved content type, when known. */
    readonly contentType: string | undefined;
}

/**
 * Options for {@link OpcPackage.open}.
 */
export interface OpcPackageOpenOptions extends ZipReadOptions {
    /**
     * When true, skip the officeDocument relationship requirement.
     * Default false (workbook packages must have officeDocument).
     */
    readonly allowMissingOfficeDocument?: boolean;
}

/**
 * Seed descriptor for {@link OpcPackage.createFromParts}.
 *
 * @private
 */
export interface OpcPackageCreatePartsOptions {
    readonly parts: ReadonlyArray<{
        readonly name: string;
        readonly data: Uint8Array;
        readonly contentType?: string;
    }>;
    readonly relationshipSets: ReadonlyArray<{
        readonly source: string | null;
        readonly relationships: ReadonlyArray<OpcRelationship>;
    }>;
    readonly contentTypeDefaults?: ReadonlyArray<{
        readonly extension: string;
        readonly contentType: string;
    }>;
}

/**
 * In-memory OPC package (Phase 1 full load).
 *
 * @private
 */
export class OpcPackage {
    private readonly partMap: Map<string, Uint8Array>;
    private contentTypesData: ContentTypes;
    private readonly relsBySource: Map<string, OpcRelationship[]>;

    /**
     * Creates an instance.
     *
     * @param {string} partMap - The partMap parameter.
     * @param {ContentTypes} contentTypes - The contentTypes parameter.
     * @param {string} relsBySource - The relsBySource parameter.
     */
    private constructor(partMap: Map<string, Uint8Array>, contentTypes: ContentTypes, relsBySource: Map<string, OpcRelationship[]>) {
        this.partMap = partMap;
        this.contentTypesData = contentTypes;
        this.relsBySource = relsBySource;
    }

    /**
     * Build a package from in-memory parts and relationship sets (no ZIP round-trip). Used by `Workbook.create` for Transitional empty workbooks.
     *
     * @param {OpcPackageCreatePartsOptions} options - The options parameter.
     * @returns {OpcPackage} - Returns the result.
     */
    public static createFromParts(options: OpcPackageCreatePartsOptions): OpcPackage {
        const partMap: Map<string, Uint8Array> = new Map<string, Uint8Array>();
        const defaults: ReadonlyArray<{ readonly extension: string; readonly contentType: string }> =
            options.contentTypeDefaults != null
                ? options.contentTypeDefaults
                : [
                    {
                        extension: 'rels',
                        contentType: 'application/vnd.openxmlformats-package.relationships+xml'
                    },
                    {
                        extension: 'xml',
                        contentType: 'application/xml'
                    }
                ];
        let contentTypes: ContentTypes = {
            defaults: defaults.map(
                (d: { readonly extension: string; readonly contentType: string }): { extension: string; contentType: string } => ({
                    extension: d.extension,
                    contentType: d.contentType
                })
            ),
            overrides: []
        };
        const relsBySource: Map<string, OpcRelationship[]> = new Map<string, OpcRelationship[]>();

        const pkg: OpcPackage = new OpcPackage(partMap, contentTypes, relsBySource);

        for (const p of options.parts) {
            if (p.contentType !== undefined) {
                pkg.setPart(p.name, p.data, p.contentType);
            } else {
                pkg.setPart(p.name, p.data);
            }
        }

        for (const set of options.relationshipSets) {
            pkg.setRelationships(set.source, set.relationships);
        }

        // Refresh local contentTypes reference after mutations
        contentTypes = pkg.contentTypesData;
        void contentTypes;
        return pkg;
    }

    /**
     * Open an OPC package from a ZIP buffer.
     *
     * @param {Uint8Array} data - The data parameter.
     * @param {OpcPackageOpenOptions} options - The options parameter.
     * @returns {Promise} - Returns the result.
     */
    public static async open(data: Uint8Array | ArrayBuffer, options?: OpcPackageOpenOptions): Promise<OpcPackage> {
        const bytes: Uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data);
        const entries: ReadonlyArray<any> = await readZipEntries(bytes, options);

        const partMap: Map<string, Uint8Array> = new Map<string, Uint8Array>();
        for (const entry of entries) {
            const name: string = normalizePartName(entry.name);
            // Last entry wins on duplicate names (unusual).
            partMap.set(name, entry.data);
        }

        const ctBytes: Uint8Array = partMap.get(CONTENT_TYPES_PART_NAME);
        if (ctBytes === undefined) {
            // Also accept ZIP name lookup without normalize edge cases
            const alt: { name: string; data: Uint8Array } = findPartInsensitive(partMap, CONTENT_TYPES_PART_NAME);
            if (alt === undefined) {
                throw new InvalidPackageError(`Missing required part "${CONTENT_TYPES_ZIP_NAME}"`, { partName: CONTENT_TYPES_PART_NAME });
            }
            partMap.set(CONTENT_TYPES_PART_NAME, alt.data);
        }

        const contentTypesBytes: Uint8Array = partMap.get(CONTENT_TYPES_PART_NAME);
        if (contentTypesBytes === undefined) {
            throw new InvalidPackageError(`Missing required part "${CONTENT_TYPES_ZIP_NAME}"`, {
                partName: CONTENT_TYPES_PART_NAME
            });
        }
        const contentTypes: ContentTypes = parseContentTypes(contentTypesBytes);

        const relsBySource: Map<string, OpcRelationship[]> = new Map<string, OpcRelationship[]>();

        // Package-level relationships are required for workbook packages.
        const pkgRelsBytes: Uint8Array = partMap.get(PACKAGE_RELS_PART_NAME);
        if (pkgRelsBytes === undefined) {
            throw new InvalidPackageError(`Missing required part "${PACKAGE_RELS_PART_NAME}"`, {
                partName: PACKAGE_RELS_PART_NAME
            });
        }
        const packageRels: OpcRelationship[] = parseRelationships(pkgRelsBytes, null, PACKAGE_RELS_PART_NAME);
        relsBySource.set(sourceKey(null), packageRels);

        if (!(options == null ? undefined : options.allowMissingOfficeDocument)) {
            const officeDoc: OpcRelationship = packageRels.find((r: OpcRelationship): boolean => isOfficeDocumentRelationshipType(r.type));
            if (officeDoc === undefined) {
                throw new InvalidPackageError('Package relationships do not contain an officeDocument relationship', {
                    partName: PACKAGE_RELS_PART_NAME
                });
            }
            if (officeDoc.targetMode === 'External') {
                throw new InvalidPackageError('officeDocument relationship must be internal', { partName: PACKAGE_RELS_PART_NAME });
            }
            const wbName: string = officeDoc.resolvedTarget;
            if (!partMap.has(wbName) && findPartInsensitive(partMap, wbName) === undefined) {
                throw new InvalidPackageError(`officeDocument target part "${wbName}" is missing from the package`, { partName: wbName });
            }
        }

        // Parse every relationships part present in the ZIP.
        for (const [name, data] of partMap) {
            if (partNamesEqual(name, PACKAGE_RELS_PART_NAME)) {
                continue;
            }
            if (!isRelationshipsPartName(name)) {
                continue;
            }
            const source: string = sourcePartFromRelsPartName(name);
            const rels: OpcRelationship[] = parseRelationships(data, source, name);
            relsBySource.set(sourceKey(source), rels);
        }

        return new OpcPackage(partMap, contentTypes, relsBySource);
    }

    /**
     * Absolute part names currently in the package (including content types and rels).
     *
     * @returns {string} - Returns the result.
     */
    public partNames(): ReadonlyArray<string> {
        return [...this.partMap.keys()].sort((a: string, b: string): number => a.localeCompare(b));
    }

    /**
     * Iterate parts with resolved content types.
     *
     * @returns {Object} - Returns the result.
     */
    public *parts(): IterableIterator<OpcPart> {
        for (const name of this.partNames()) {
            const data: Uint8Array = this.partMap.get(name);
            if (data === undefined) {
                continue;
            }
            yield {
                name,
                data,
                contentType: this.contentType(name)
            };
        }
    }

    /**
     * Get a part by absolute or ZIP-relative name.
     *
     * @param {string} name - The name parameter.
     * @returns {*} - Returns the result.
     */
    public getPart(name: string): OpcPart | undefined {
        const normalized: string = normalizePartName(name);
        let data: Uint8Array = this.partMap.get(normalized);
        if (data === undefined) {
            const found: { name: string; data: Uint8Array } = findPartInsensitive(this.partMap, normalized);
            if (found === undefined) {
                return undefined;
            }
            data = found.data;
            return {
                name: found.name,
                data,
                contentType: this.contentType(found.name)
            };
        }
        return {
            name: normalized,
            data,
            contentType: this.contentType(normalized)
        };
    }

    /**
     * Resolved content type for a part (Override then Default).
     *
     * @param {string} partName - The partName parameter.
     * @returns {string} - Returns the result.
     */
    public contentType(partName: string): string | undefined {
        const normalized: string = normalizePartName(partName);
        if (partNamesEqual(normalized, CONTENT_TYPES_PART_NAME)) {
            return undefined;
        }
        return resolveContentType(this.contentTypesData, normalized);
    }

    /**
     * Relationships for a source part (`null` = package-level `/_rels/.rels`).
     *
     * @param {string} sourcePart - The sourcePart parameter.
     * @returns {Object} - Returns the result.
     */
    public getRelationships(sourcePart: string | null): ReadonlyArray<OpcRelationship> {
        const key: string = sourceKey(sourcePart === null ? null : normalizePartName(sourcePart));
        const list: OpcRelationship[] = this.relsBySource.get(key);
        return list != null ? list : [];
    }

    /**
     * Resolved officeDocument target part name, if present.
     *
     * @returns {string} - Returns the result.
     */
    public officeDocumentPartName(): string | undefined {
        const rels: ReadonlyArray<OpcRelationship> = this.getRelationships(null);
        const office: OpcRelationship = rels.find((r: OpcRelationship): boolean => isOfficeDocumentRelationshipType(r.type));
        return office == null ? undefined : office.resolvedTarget;
    }

    /**
     * Replace or add a part's bytes. Does not invent content types.
     *
     * @param {string} name - The name parameter.
     * @param {Uint8Array} data - The data parameter.
     * @param {string} contentType - The contentType parameter.
     * @returns {void} - Returns the result.
     */
    public setPart(name: string, data: Uint8Array, contentType?: string): void {
        const normalized: string = normalizePartName(name);
        this.partMap.set(normalized, data);
        if (contentType !== undefined) {
            this.ensureOverride(normalized, contentType);
        }
    }

    /**
     * Remove a part if present. Also drops any content-type Override for the part and any relationships **sourced** from that part (the matching `.rels` entry).
     *
     * @param {string} name - The name parameter.
     * @returns {boolean} - Returns the result.
     */
    public removePart(name: string): boolean {
        const normalized: string = normalizePartName(name);
        const deleted: boolean = this.partMap.delete(normalized);
        if (deleted) {
            this.contentTypesData = {
                defaults: this.contentTypesData.defaults,
                overrides: this.contentTypesData.overrides.filter(
                    (o: any): boolean => !partNamesEqual(o.partName, normalized)
                )
            };
        }
        // Drop source relationships even if the part body was already gone so
        // save() does not re-emit orphaned `…/_rels/….rels` parts.
        const relKey: string = sourceKey(normalized);
        this.relsBySource.delete(relKey);
        this.partMap.delete(relationshipPartName(normalized));
        return deleted;
    }

    /**
     * Replace relationship collection for a source.
     *
     * @param {string} sourcePart - The sourcePart parameter.
     * @param {Object} relationships - The relationships parameter.
     * @returns {void} - Returns the result.
     */
    public setRelationships(sourcePart: string | null, relationships: ReadonlyArray<OpcRelationship>): void {
        const source: string = sourcePart === null ? null : normalizePartName(sourcePart);
        this.relsBySource.set(sourceKey(source), [...relationships]);
        const relsName: string = relationshipPartName(source);
        this.partMap.set(relsName, serializeRelationships(relationships));
    }

    /**
     * Serialize package to a ZIP buffer. Opaque part bytes are written unchanged. Content types and relationship parts are serialized from the in-memory model.
     *
     * @returns {Uint8Array} - Returns the result.
     */
    public async save(): Promise<Uint8Array> {
        // Refresh relationship part bytes from model.
        for (const [key, rels] of this.relsBySource) {
            const source: string = key === '' ? null : key;
            const relsName: string = relationshipPartName(source);
            this.partMap.set(relsName, serializeRelationships(rels));
        }

        // Content types must be present and cover non-special parts for write checks.
        this.contentTypesData = {
            defaults: [...this.contentTypesData.defaults],
            overrides: [...this.contentTypesData.overrides]
        };
        this.partMap.set(CONTENT_TYPES_PART_NAME, serializeContentTypes(this.contentTypesData));

        const entries: ZipWriteEntry[] = [];
        // Prefer well-known order: content types, package rels, then others sorted.
        const names: ReadonlyArray<string> = this.partNames();
        const ordered: string[] = [
            ...names.filter((n: string): boolean => partNamesEqual(n, CONTENT_TYPES_PART_NAME)),
            ...names.filter((n: string): boolean => partNamesEqual(n, PACKAGE_RELS_PART_NAME)),
            ...names.filter(
                (n: string): boolean => !partNamesEqual(n, CONTENT_TYPES_PART_NAME) && !partNamesEqual(n, PACKAGE_RELS_PART_NAME)
            )
        ];

        for (const name of ordered) {
            const data: Uint8Array = this.partMap.get(name);
            if (data === undefined) {
                continue;
            }
            // Skip empty directory markers if any slipped in.
            if (name.endsWith('/') && data.byteLength === 0) {
                continue;
            }
            entries.push({ name: partNameToZipName(name), data });
        }

        return writeZip(entries);
    }

    /**
     * ensureOverride method.
     *
     * @param {string} partName - The partName parameter.
     * @param {string} contentType - The contentType parameter.
     * @returns {void} - Returns the result.
     */
    private ensureOverride(partName: string, contentType: string): void {
        const overrides: any[] = this.contentTypesData.overrides.filter(
            (o: any): boolean => !partNamesEqual(o.partName, partName)
        );
        overrides.push({ partName, contentType });
        this.contentTypesData = {
            defaults: this.contentTypesData.defaults,
            overrides
        };
    }
}

/**
 * sourceKey function.
 *
 * @param {RelationshipSourceKey} source - The source parameter.
 * @returns {string} - Returns the result.
 */
function sourceKey(source: RelationshipSourceKey): string {
    return source === null ? '' : normalizePartName(source);
}

/**
 * findPartInsensitive function.
 *
 * @param {string} map - The map parameter.
 * @param {string} want - The want parameter.
 * @returns {Uint8Array} - Returns the result.
 */
function findPartInsensitive(map: Map<string, Uint8Array>, want: string): { name: string; data: Uint8Array } | undefined {
    const target: string = normalizePartName(want).toLowerCase();
    for (const [name, data] of map) {
        if (name.toLowerCase() === target) {
            return { name, data };
        }
    }
    return undefined;
}

/**
 * True when part name looks like an OPC relationships part (`.../_rels/....rels`).
 *
 * @param {string} partName - The partName parameter.
 * @returns {boolean} - Returns the result.
 */
function isRelationshipsPartName(partName: string): boolean {
    const n: string = normalizePartName(partName).toLowerCase();
    if (n === PACKAGE_RELS_PART_NAME.toLowerCase()) {
        return true;
    }
    // /foo/_rels/bar.baz.rels
    const m: RegExpExecArray = /^(.+)\/_rels\/([^/]+)\.rels$/i.exec(n);
    return m !== null;
}

/**
 * Inverse of {@link relationshipsPartNameFor}.
 *
 * @param {string} relsPartName - The relsPartName parameter.
 * @returns {string} - Returns the result.
 */
function sourcePartFromRelsPartName(relsPartName: string): string | null {
    const n: string = normalizePartName(relsPartName);
    if (partNamesEqual(n, PACKAGE_RELS_PART_NAME)) {
        return null;
    }
    const m: RegExpExecArray = /^(.+)\/_rels\/([^/]+)\.rels$/i.exec(n);
    if (m === null || m[1] === undefined || m[2] === undefined) {
        throw new InvalidPackageError(`Cannot derive source part from relationships part "${n}"`, {
            partName: n
        });
    }
    const dir: string = m[1];
    const file: string = m[2];
    if (dir === '') {
        return `/${file}`;
    }
    return normalizePartName(`${dir}/${file}`);
}
