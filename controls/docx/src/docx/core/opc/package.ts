import { PackageError } from '../errors/docx-error';
import { ResourceLimitOverrides, resolveResourceLimits, ResourceLimits } from '../security/limits';
import { WML_TRANSITIONAL_NAMESPACE } from '../xml/index';
import { readZip } from '../zip/read';
import { writeZip } from '../zip/write';
import { ZipEntry } from '../zip/zip-entry';
import { CONTENT_TYPES_ZIP_ITEM, createTransitionalContentTypes, lookupContentType, MAIN_DOCUMENT_CONTENT_TYPE, readContentTypes, serializeContentTypes, ContentTypes, ContentTypeRecord } from './content-types';
import { assertPartNameSetIntegrity, isPackageRelationshipsPartName, isRelationshipsPartName, packageRelationshipsPartName, partName, partNameFromZipItem, partNameKey, partRelationshipsPartName, resolveInternalTarget, sourcePartNameFromRelationshipsPart, zipItemFromPartName, PartName } from './part-name';
import { emptyRelationships, findOfficeDocumentRelationship, OFFICE_DOCUMENT_RELATIONSHIP_TYPE, parseRelationshipsXml, relationshipId, relationshipsWith, serializeRelationships, TargetMode, OpcRelationship, Relationships } from './relationships';
const utf8: TextEncoder = new TextEncoder();
const utf8Decoder: TextDecoder = new TextDecoder('utf-8');
export interface PackagePart {
    readonly name: PartName;
    readonly contentType: string;
    readonly data: Uint8Array;
}
export interface PartRelationshipSet {
    readonly source: PartName;
    readonly relationships: Relationships;
}
/**
 * In-memory OPC package (ZIP + content types + relationships + part payloads).
 * Not the public WordDocument API (TASK-1010).
 */
export interface OpcPackage {
    readonly contentTypes: ContentTypes;
    readonly packageRelationships: Relationships;
    readonly parts: ReadonlyArray<PackagePart>;
    readonly partRelationships: ReadonlyArray<PartRelationshipSet>;
}
function bytesOf(xml: string): Uint8Array {
    return utf8.encode(xml);
}
function decodeXml(data: Uint8Array): string {
    return utf8Decoder.decode(data);
}
function findPart(parts: ReadonlyArray<PackagePart>, name: PartName): PackagePart | undefined {
    const key: string = partNameKey(name);
    return parts.find((part: PackagePart) => partNameKey(part.name) === key);
}
function findPartRels(sets: ReadonlyArray<PartRelationshipSet>, source: PartName): Relationships | undefined {
    let ts330: any;
    const key: string = partNameKey(source);
    return (
        (ts330 = sets.find((set: PartRelationshipSet) => partNameKey(set.source) === key)),
        ts330 == null ? undefined : ts330.relationships
    );
}
/**
 * Stub Transitional main document payload. Not a WML parser (TASK-1005 out of scope).
 *
 * @returns {string} The result.
 * @private
 */
export function transitionalDocumentStubXml(): string {
    return ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        `<w:document xmlns:w="${WML_TRANSITIONAL_NAMESPACE}"><w:body/></w:document>`);
}
export function createTransitionalWordPackage(options?: {
    readonly documentXml?: Uint8Array;
    readonly extraParts?: ReadonlyArray<PackagePart>;
    readonly extraPackageRelationships?: ReadonlyArray<OpcRelationship>;
}): OpcPackage {
    let ts331: any; let ts332: any; let ts333: any;
    const main: PartName = partName('/word/document.xml');
    const documentXml: Uint8Array =
        ((ts331 = options == null ? undefined : options.documentXml), ts331 != null ? ts331 : bytesOf(transitionalDocumentStubXml()));
    const officeRel: OpcRelationship = {
        id: relationshipId('rId1'),
        type: OFFICE_DOCUMENT_RELATIONSHIP_TYPE,
        target: 'word/document.xml',
        extraAttributes: [],
        children: []
    };
    const extra: ReadonlyArray<OpcRelationship> =
        ((ts332 = options == null ? undefined : options.extraPackageRelationships), ts332 != null ? ts332 : []);
    const packageRelationships: Relationships = relationshipsWith([officeRel, ...extra]);
    const extraParts: ReadonlyArray<PackagePart> = ((ts333 = options == null ? undefined : options.extraParts), ts333 != null ? ts333 : []);
    const parts: PackagePart[] = [
        { name: main, contentType: MAIN_DOCUMENT_CONTENT_TYPE, data: documentXml },
        ...extraParts
    ];
    assertPartNameSetIntegrity(parts.map((p: PackagePart) => p.name));
    return {
        contentTypes: createTransitionalContentTypes(main),
        packageRelationships,
        parts,
        partRelationships: []
    };
}
export function officeDocumentPartName(pkg: OpcPackage): PartName {
    const rel: OpcRelationship = findOfficeDocumentRelationship(pkg.packageRelationships);
    if (rel === undefined) {
        throw new PackageError('package/missing-part', 'Package Relationships part has no officeDocument relationship (ECMA-376-1 §11.2)');
    }
    if (rel.targetMode === TargetMode.External) {
        throw new PackageError('package/missing-part', 'officeDocument relationship must not use TargetMode External');
    }
    return resolveInternalTarget(rel.target);
}
function parseRelsEntry(data: Uint8Array, sourceLabel: string, relationshipCountLimit: number): Relationships {
    return parseRelationshipsXml(decodeXml(data), { sourceLabel, relationshipCountLimit });
}
export function loadOpcPackage(bytes: Uint8Array, limits?: ResourceLimitOverrides): OpcPackage {
    let ts334: any;
    const resolved: ResourceLimits = resolveResourceLimits(limits);
    const entries: ReadonlyArray<ZipEntry> = readZip(bytes, limits);
    const contentTypes: ContentTypes = readContentTypes(entries);
    const parts: PackagePart[] = [];
    let packageRelationships: Relationships | undefined;
    const partRelationships: PartRelationshipSet[] = [];
    for (const entry of entries) {
        if (entry.name === CONTENT_TYPES_ZIP_ITEM) {
            continue;
        }
        // ZIP directory markers (name ends with '/') are not OPC parts
        // (ECMA-376-2 §6.2.2.2 part_name has no trailing slash; ECMA-376-1:
        // ZIP items that do not conform to OPC part naming are not parts).
        if (entry.name.endsWith('/')) {
            continue;
        }
        const logical: PartName = partNameFromZipItem(entry.name);
        if (isRelationshipsPartName(logical)) {
            const rels: Relationships = parseRelsEntry(entry.data, entry.name, resolved.relationshipCountPerPart);
            if (isPackageRelationshipsPartName(logical)) {
                packageRelationships = rels;
            }
            else {
                const source: PartName = sourcePartNameFromRelationshipsPart(logical);
                if (source === undefined) {
                    throw new PackageError('package/invalid-relationships', `Could not invert Relationships part ${logical}`);
                }
                partRelationships.push({ source, relationships: rels });
            }
            continue;
        }
        const contentType: string = ((ts334 = lookupContentType(contentTypes, logical)), ts334 != null ? ts334 : 'application/octet-stream');
        parts.push({ name: logical, contentType, data: entry.data });
    }
    if (packageRelationships === undefined) {
        throw new PackageError('package/missing-part', `Missing package Relationships part ${zipItemFromPartName(packageRelationshipsPartName())}`);
    }
    assertPartNameSetIntegrity(parts.map((p: PackagePart) => p.name));
    const pkg: OpcPackage = {
        contentTypes,
        packageRelationships,
        parts,
        partRelationships
    };
    const mainName: PartName = officeDocumentPartName(pkg);
    if (findPart(parts, mainName) === undefined) {
        throw new PackageError('package/missing-part', `officeDocument target part ${mainName} is not in the package`);
    }
    return pkg;
}
/**
 * External TargetMode values are stored only. This module never calls fetch or
 * opens a network/filesystem URI (`.agent/policies/security.md`).
 *
 * @param {OpcPackage} pkg - The pkg.
 * @returns {ReadonlyArray<string>} The result.
 * @private
 */
export function getExternalRelationshipTargets(pkg: OpcPackage): ReadonlyArray<string> {
    const targets: string[] = [];
    const collect: (rels: Relationships) => void = (rels: Relationships): void => {
        for (const item of rels.items) {
            if (item.targetMode === TargetMode.External) {
                targets.push(item.target);
            }
        }
    };
    collect(pkg.packageRelationships);
    for (const set of pkg.partRelationships) {
        collect(set.relationships);
    }
    return targets;
}
export function saveOpcPackage(pkg: OpcPackage): Uint8Array {
    officeDocumentPartName(pkg);
    const entries: ZipEntry[] = [
        { name: CONTENT_TYPES_ZIP_ITEM, data: bytesOf(serializeContentTypes(pkg.contentTypes)) },
        {
            name: zipItemFromPartName(packageRelationshipsPartName()),
            data: bytesOf(serializeRelationships(pkg.packageRelationships))
        }
    ];
    const seenZip: Set<string> = new Set<string>(entries.map((e: ZipEntry) => e.name.toLowerCase()));
    const push: (name: string, data: Uint8Array) => void = (name: string, data: Uint8Array): void => {
        const key: string = name.toLowerCase();
        if (seenZip.has(key)) {
            throw new PackageError('package/duplicate-zip-entry', `Duplicate ZIP item on save: ${name}`);
        }
        seenZip.add(key);
        entries.push({ name, data });
    };
    for (const part of pkg.parts) {
        push(zipItemFromPartName(part.name), part.data);
    }
    for (const set of pkg.partRelationships) {
        if (set.relationships.items.length === 0 && set.relationships.opaque.length === 0) {
            continue;
        }
        push(zipItemFromPartName(partRelationshipsPartName(set.source)), bytesOf(serializeRelationships(set.relationships)));
    }
    return writeZip(entries);
}
export function partByName(pkg: OpcPackage, name: PartName): PackagePart | undefined {
    return findPart(pkg.parts, name);
}
export function relationshipsForPart(pkg: OpcPackage, source: PartName): Relationships {
    let ts335: any;
    return ((ts335 = findPartRels(pkg.partRelationships, source)), ts335 != null ? ts335 : emptyRelationships());
}
/**
 *  Replace one part's payload, keeping content type and other parts.
 *
 * @param {OpcPackage} pkg - The pkg.
 * @param {PartName} name - The name.
 * @param {Uint8Array} data - The data.
 * @returns {OpcPackage} The result.
 * @private
 */
export function withReplacedPart(pkg: OpcPackage, name: PartName, data: Uint8Array): OpcPackage {
    const key: string = partNameKey(name);
    const index: number = pkg.parts.findIndex((part: PackagePart) => partNameKey(part.name) === key);
    if (index < 0) {
        throw new PackageError('package/invalid-part-name', `Part not in package: ${name}`);
    }
    const parts: PackagePart[] = pkg.parts.map((part: PackagePart, i: number) =>
        i === index ? { name: part.name, contentType: part.contentType, data } : part
    );
    return { ...pkg, parts };
}
function upsertPartRelationships(
    sets: ReadonlyArray<PartRelationshipSet>,
    source: PartName,
    relationships: Relationships
): PartRelationshipSet[] {
    const key: string = partNameKey(source);
    const index: number = sets.findIndex((set: PartRelationshipSet) => partNameKey(set.source) === key);
    if (index < 0) {
        return [...sets, { source, relationships }];
    }
    const next: PartRelationshipSet[] = [...sets];
    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
    next[index] = { source, relationships };
    return next;
}
function upsertContentTypeOverride(types: ContentTypes, logicalPartName: PartName, contentType: string): ContentTypes {
    const records: ContentTypeRecord[] = types.records.map((record: ContentTypeRecord): ContentTypeRecord => {
        if (record.kind === 'override' && record.partName === logicalPartName) {
            return { kind: 'override', partName: logicalPartName, contentType };
        }
        return record;
    });
    if (!records.some((record: ContentTypeRecord) => record.kind === 'override' && record.partName === logicalPartName)) {
        records.push({ kind: 'override', partName: logicalPartName, contentType });
    }
    return { records };
}
/**
 *  Append a part if absent; replace payload if the name already exists.
 *
 * @param {OpcPackage} pkg - The pkg.
 * @param {PackagePart} part - The part.
 * @returns {OpcPackage} The result.
 * @private
 */
export function withAddedPart(pkg: OpcPackage, part: PackagePart): OpcPackage {
    const key: string = partNameKey(part.name);
    const index: number = pkg.parts.findIndex((existing: PackagePart) => partNameKey(existing.name) === key);
    if (index >= 0) {
        const parts: PackagePart[] = pkg.parts.map((existing: PackagePart, i: number) => (i === index ? part : existing));
        return { ...pkg, parts };
    }
    const parts: PackagePart[] = [...pkg.parts, part];
    return { ...pkg, parts };
}
/**
 *  Remove a part together with its relationships and content-type override.
 *
 * @param {OpcPackage} pkg - The pkg.
 * @param {PartName} name - The name.
 * @returns {OpcPackage} The result.
 * @private
 */
export function withRemovedPart(pkg: OpcPackage, name: PartName): OpcPackage {
    const key: string = partNameKey(name);
    return {
        ...pkg,
        parts: pkg.parts.filter((part: PackagePart) => partNameKey(part.name) !== key),
        partRelationships: pkg.partRelationships.filter((set: PartRelationshipSet) => partNameKey(set.source) !== key),
        contentTypes: {
            records: pkg.contentTypes.records.filter((record: ContentTypeRecord) => !(record.kind === 'override' && record.partName === name))
        }
    };
}
export function withContentTypeOverride(pkg: OpcPackage, logicalPartName: PartName, contentType: string): OpcPackage {
    return {
        ...pkg,
        contentTypes: upsertContentTypeOverride(pkg.contentTypes, logicalPartName, contentType)
    };
}
export function withPartRelationships(pkg: OpcPackage, source: PartName, relationships: Relationships): OpcPackage {
    return {
        ...pkg,
        partRelationships: upsertPartRelationships(pkg.partRelationships, source, relationships)
    };
}
export function withPackageRelationships(pkg: OpcPackage, relationships: Relationships): OpcPackage {
    return { ...pkg, packageRelationships: relationships };
}
