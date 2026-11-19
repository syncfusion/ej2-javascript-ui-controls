import { officeRelationshipType } from '../xml/office-dialect';
import { _decode } from '../errors';
import { EncryptedPackageError, InvalidPackageError } from '../security/errors';
import { resolveLimits, SecurityLimits } from '../security/limits';
import { CONTENT_TYPES_PART_NAME, OFFICE_DOCUMENT_REL_TYPE, PRESENTATION_MAIN_CONTENT_TYPES,
    RELATIONSHIPS_CONTENT_TYPE } from './constants';
import { parseContentTypes, resolveContentType, ContentTypesModel } from './content-types';
import { OpcPackage, PackagePart } from './package-model';
import { isContentTypesPart, relationshipsPartName } from './paths';
import { parseRelationships, PackageRelationship } from './relationships';
import { looksLikeOleCompoundFile, readZipEntries } from './zip-reader';
import { arrayAt } from '../util/es5-compat';

/**
 * Bytes or base64 text accepted by {@link Presentation.open}.
 *
 * @remarks
 * `string` is treated as base64 of the full package (plain OPC ZIP).
 * Data-URL prefixes are not stripped — pass the base64 payload only.
 */
export type OpenPresentationInput = Uint8Array | ArrayBuffer | number[] | string;

/**
 * Options for {@link Presentation.open}.
 */
export interface OpenPresentationOptions {
    /**
     * Partial override of {@link SecurityLimits}. Omitted keys keep library defaults.
     */
    readonly limits?: Partial<SecurityLimits>;
}

/** Stable message when CFB is presented (never includes password text). */
const ENCRYPTED_PACKAGE_REFUSED: string =
    'Package uses the OLE compound-file format (often OFFCRYPTO encryption); encrypted packages cannot be opened';

/**
 * Loads an OPC presentation package model from raw bytes.
 *
 * @throws {Error} When the package is encrypted / OFFCRYPTO CFB or ZIP traditional encryption is present.
 * @throws {Error} When a security limit is exceeded.
 * @throws {Error} When the package is not a valid presentation OPC package.
 * @remarks Public entry is {@link Presentation.open}. This helper stays package-scoped so `open.ts` does not import `Presentation` (avoids
 * a create/open cycle). Unknown parts and relationship types are retained for round-trip. ECMA-376 Part 1 section 9.1.5 trash items keep
 * their ZIP bytes but are never associated with a content type on save. External relationship targets are never fetched. Macro-enabled main
 * content types are accepted as packages; macros are never executed. Encrypted OFFCRYPTO / OLE CFB packages are refused. Decrypt-open is
 * not supported.
 * @internal
 * @param {OpenPresentationInput} input - Entire `.pptx` (or related) package as bytes, or base64 `string`.
 * @param {OpenPresentationOptions} options - Optional security limit overrides.
 * @returns {*} Bound {@link OpcPackage} for {@link Presentation} construction.
 */
export async function openPresentationPackage(
    input: OpenPresentationInput,
    options: OpenPresentationOptions = {}
): Promise<OpcPackage> {
    const limits: SecurityLimits = resolveLimits(options.limits);
    const bytes: Uint8Array = toUint8Array(input);
    if (looksLikeOleCompoundFile(bytes)) {
        throw new EncryptedPackageError(ENCRYPTED_PACKAGE_REFUSED);
    }
    const rawParts: Map<string, Uint8Array> = await readZipEntries(bytes, limits);
    const ctBytes: Uint8Array = findContentTypesBytes(rawParts);
    const contentTypes: ContentTypesModel = parseContentTypes(ctBytes, limits);
    const parts: Map<string, PackagePart> = new Map<string, PackagePart>();
    const rawPartEntries: Array<[string, Uint8Array]> = Array.from(rawParts.entries());
    for (let i: number = 0; i < rawPartEntries.length; i++) {
        const name: string = arrayAt(rawPartEntries, i)[0];
        const data: Uint8Array = arrayAt(rawPartEntries, i)[1];
        if (isContentTypesPart(name)) {
            continue;
        }
        const resolvedCt: string = resolveContentType(contentTypes, name);
        const contentType: string = resolvedCt != null
            ? resolvedCt
            : (name.endsWith('.rels') ? RELATIONSHIPS_CONTENT_TYPE : 'application/octet-stream');
        parts.set(name, { name, contentType, data });

    }
    const packageRelsName: string = relationshipsPartName('/');
    const packageRelsPart: PackagePart = parts.get(packageRelsName);
    if (packageRelsPart === undefined) {
        throw new InvalidPackageError('Package relationships part /_rels/.rels is missing', {
            partName: packageRelsName
        });
    }
    const packageRelationships: Array<PackageRelationship> = parseRelationships(packageRelsPart.data, '/', limits, packageRelsName);
    const presentationPartName: string = resolvePresentationPartName(packageRelationships, contentTypes, parts);
    const partRelationships: Map<string, Array<PackageRelationship>> = new Map<string, PackageRelationship[]>();
    // Load package rels source as `/` and every other part that has a sibling `.rels`.
    partRelationships.set('/', packageRelationships);
    const partEntries: Array<[string, PackagePart]> = Array.from(parts.entries());
    for (let i: number = 0; i < partEntries.length; i++) {
        const name: string = arrayAt(partEntries, i)[0];
        if (!name.endsWith('.rels')) {
            continue;
        }
        // Infer source part from relationships part path.
        const source: string = sourcePartFromRelsName(name);
        if (source === '/') {
            continue; // already loaded
        }
        const relsPart: PackagePart = parts.get(name);
        if (relsPart === undefined) {
            continue;
        }
        const rels: Array<PackageRelationship> = parseRelationships(relsPart.data, source, limits, name);
        partRelationships.set(source, rels);

    }
    return {
        parts,
        contentTypes,
        packageRelationships,
        partRelationships,
        presentationPartName,
        limits
    };
}

/**
 *
 * @param {OpenPresentationInput} input - The input value.
 * @returns {Uint8Array} The result.
 */
function toUint8Array(input: OpenPresentationInput): Uint8Array {
    if (typeof input === 'string') {
        const decoded: Uint8Array | Array<number> = _decode(input, false);
        return decoded instanceof Uint8Array ? decoded : new Uint8Array(decoded);
    }
    if (input instanceof Uint8Array) {
        return input;
    }
    return new Uint8Array(input);
}

/**
 *
 * @param {Map<string, Uint8Array>} rawParts - The rawParts value.
 * @returns {Uint8Array} The result.
 */
function findContentTypesBytes(rawParts: Map<string, Uint8Array>): Uint8Array {
    const rawPartEntries: Array<[string, Uint8Array]> = Array.from(rawParts.entries());
    for (let i: number = 0; i < rawPartEntries.length; i++) {
        const name: string = arrayAt(rawPartEntries, i)[0];
        const data: Uint8Array = arrayAt(rawPartEntries, i)[1];
        if (isContentTypesPart(name)) {
            return data;
        }

    }
    throw new InvalidPackageError('Missing [Content_Types].xml part', {
        partName: CONTENT_TYPES_PART_NAME
    });
}

/**
 *
 * @param {*} packageRelationships - The packageRelationships value.
 * @param {ContentTypesModel} contentTypes - The contentTypes value.
 * @param {ReadonlyMap<string, PackagePart>} parts - The parts value.
 * @returns {string} The result.
 */
function resolvePresentationPartName(
    packageRelationships: ReadonlyArray<PackageRelationship>,
    contentTypes: ContentTypesModel,
    parts: ReadonlyMap<string, PackagePart>
): string {
    const officeRels: Array<PackageRelationship> = packageRelationships.filter(
        (r: PackageRelationship) => officeRelationshipType(r.type, OFFICE_DOCUMENT_REL_TYPE) && r.targetMode === 'Internal'
    );
    if (officeRels.length === 0) {
        throw new InvalidPackageError(
            'Package relationships must include an officeDocument relationship to the presentation part',
            { partName: '/_rels/.rels' }
        );
    }
    const allowed: Set<string> = new Set(PRESENTATION_MAIN_CONTENT_TYPES);
    for (let i: number = 0; i < officeRels.length; i++) {
        const rel: PackageRelationship = arrayAt(officeRels, i);
        const target: string = rel.targetPartName;
        if (target === undefined) {
            continue;
        }
        const part: PackagePart = parts.get(target);
        if (part === undefined) {
            throw new InvalidPackageError(
                `officeDocument relationship target "${target}" is not present in the package`,
                { partName: target }
            );
        }
        const ct: string = part.contentType || resolveContentType(contentTypes, target);
        if (ct !== undefined && allowed.has(ct)) {
            return target;
        }

    }
    throw new InvalidPackageError(
        'No officeDocument relationship targets a presentation main content type',
        { partName: '/_rels/.rels' }
    );
}

/**
 * Maps `/ppt/_rels/presentation.xml.rels` → `/ppt/presentation.xml`,
 * `/_rels/.rels` → `/`.
 *
 * @param {string} relsName - The relsName value.
 * @returns {string} The result.
 */
function sourcePartFromRelsName(relsName: string): string {
    if (relsName === '/_rels/.rels') {
        return '/';
    }
    // Pattern: {dir}/_rels/{file}.rels → {dir}/{file}
    const marker: string = '/_rels/';
    const idx: number = relsName.lastIndexOf(marker);
    if (idx < 0 || !relsName.endsWith('.rels')) {
        throw new InvalidPackageError(`Cannot infer source part for relationships part "${relsName}"`, {
            partName: relsName
        });
    }
    const dir: string = relsName.slice(0, idx);
    const fileWithRels: string = relsName.slice(idx + marker.length); // e.g. presentation.xml.rels
    if (!fileWithRels.endsWith('.rels')) {
        throw new InvalidPackageError(`Malformed relationships part name "${relsName}"`, {
            partName: relsName
        });
    }
    const file: string = fileWithRels.slice(0, -'.rels'.length);
    return dir.length === 0 ? `/${file}` : `${dir}/${file}`;
}
