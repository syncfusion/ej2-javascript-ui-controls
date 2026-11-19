/**
 * Assembles an in-memory OPC package for `Presentation.create`.
 */
import {
    CONTENT_TYPES_PART_NAME,
    PRESENTATION_MAIN_CONTENT_TYPES,
    RELATIONSHIPS_CONTENT_TYPE
} from '../package/constants';
import { parseContentTypes, resolveContentType, ContentTypesModel } from '../package/content-types';
import { OpcPackage, PackagePart } from '../package/package-model';
import { parseRelationships, PackageRelationship } from '../package/relationships';
import { isContentTypesPart, relationshipsPartName } from '../package/paths';
import { readStoredZipEntries } from '../package/zip-reader';
import { resolveLimits, SecurityLimits } from '../security/limits';
import { InvalidPackageError } from '../security/errors';
import { arrayAt } from '../util/es5-compat';
import { CREATE_PRESENTATION_PART, CREATE_SLIDE_MASTER_PART, CREATE_THEME_PART } from './part-names';
import { DEFAULT_CONTENT_BASE64 } from './default-content.generated';
import { _decode } from '../errors';
/**
 * Relationship Id for presentation → slide master on a freshly created package.
 *
 * @remarks
 * Create ships **zero slides**. Presentation relationships are contiguous from
 * rId1 without a slide entry; the first `slides.add` allocates the next free id
 * via {@link allocateNextRelationshipId} (rId6 with the current skeleton).
 */
export const CREATE_MASTER_REL_ID: string = 'rId1';
/** Relationship Id for presentation → presentation properties (ECMA §13.3.7). */
export const CREATE_PRES_PROPS_REL_ID: string = 'rId2';
/** Relationship Id for presentation → view properties (ECMA §13.3.13). */
export const CREATE_VIEW_PROPS_REL_ID: string = 'rId3';
/**
 * Relationship Id for presentation → theme from `defaultContent.zip` (rId4).
 *
 * @remarks Table styles are rId5 in that template. `slides.add` allocates the next free id.
 */
export const CREATE_PRESENTATION_THEME_REL_ID: string = 'rId4';
/** Relationship Id for presentation → table styles (ECMA §14.2.9). */
export const CREATE_TABLE_STYLES_REL_ID: string = 'rId5';
/** Relationship Id for package → officeDocument (presentation main part). */
export const CREATE_OFFICE_DOC_REL_ID: string = 'rId1';
/**
 * Relationship Id for package → thumbnail (`docProps/thumbnail.jpeg`).
 *
 * @remarks Present in `defaultContent.zip` `_rels/.rels` as rId2.
 */
export const CREATE_THUMBNAIL_REL_ID: string = 'rId2';
/** Relationship Id for package → core properties (ECMA-376-2 §8.2). */
export const CREATE_CORE_PROPS_REL_ID: string = 'rId3';
/** Relationship Id for package → extended properties (ECMA-376-1 §15.2.12.3). */
export const CREATE_APP_PROPS_REL_ID: string = 'rId4';
/** Relationship Id for master → first layout (`slideLayout1.xml`) in the template. */
export const CREATE_MASTER_LAYOUT_REL_ID: string = 'rId1';
/**
 * Master → theme relationship id from `defaultContent.zip`
 * (`slideMaster1.xml.rels` uses rId12; rId2 is slideLayout2).
 */
export const CREATE_MASTER_THEME_REL_ID: string = 'rId12';
/** Relationship Id for layout → master. */
export const CREATE_LAYOUT_MASTER_REL_ID: string = 'rId1';
/**
 * Relationship Id for slide → layout on the first (and subsequent) added slides.
 *
 * @remarks
 * Create no longer seeds a slide part; `addSlideToPresentation` still wires each
 * new slide to its layout with this conventional first relationship id.
 */
export const CREATE_SLIDE_LAYOUT_REL_ID: string = 'rId1';
/**
 * Options for building a new presentation package (internal create path).
 */
export interface BuildCreatePackageOptions {
    /** Partial security limit overrides (same shape as open). */
    readonly limits?: Partial<SecurityLimits>;
}
/**
 * Builds a presentation package ready for `new Presentation(pkg)`.
 *
 * @remarks Copies every part and relationship from the embedded `defaultContent.zip`
 * (the same approach as the .NET library's `AddDefaultContent()`). That template
 * already registers `slideLayout1.xml` through `slideLayout11.xml`, the slide master,
 * theme, and package properties. Layouts are not generated in code. No slide part,
 * slide relationship, or `p:sldIdLst` is present in the template, so create still
 * starts with zero slides. Consumers add slides only through `presentation.slides.add({ layout })`.
 * @param {BuildCreatePackageOptions} options - Optional security limits.
 * @returns {OpcPackage} Mutable package with master, eleven layouts, and theme — **zero slides**.
 */
export function buildCreatePackage(options: BuildCreatePackageOptions = {}): OpcPackage {
    const limits: SecurityLimits = resolveLimits(options.limits);
    const decoded: Uint8Array | Array<number> = _decode(DEFAULT_CONTENT_BASE64, false);
    const bytes: Uint8Array = decoded instanceof Uint8Array ? decoded : new Uint8Array(decoded);
    const rawParts: Map<string, Uint8Array> = readStoredZipEntries(bytes, limits);
    const ctBytes: Uint8Array = rawParts.get(CONTENT_TYPES_PART_NAME);
    if (ctBytes === undefined) {
        throw new InvalidPackageError('defaultContent.zip is missing [Content_Types].xml', {
            partName: CONTENT_TYPES_PART_NAME
        });
    }
    const contentTypes: ContentTypesModel = parseContentTypes(ctBytes, limits);
    const parts: Map<string, PackagePart> = new Map<string, PackagePart>();
    const rawEntries: Array<[string, Uint8Array]> = Array.from(rawParts.entries());
    for (let i: number = 0; i < rawEntries.length; i++) {
        const name: string = arrayAt(rawEntries, i)[0];
        const data: Uint8Array = arrayAt(rawEntries, i)[1].slice();
        if (isContentTypesPart(name)) {
            continue;
        }
        const resolvedCt: string = resolveContentType(contentTypes, name);
        const contentType: string = resolvedCt != null
            ? resolvedCt
            : (name.endsWith('.rels') ? RELATIONSHIPS_CONTENT_TYPE : 'application/octet-stream');
        parts.set(name, { name, contentType, data });
    }
    const partRelationships: Map<string, Array<PackageRelationship>> = new Map<string, PackageRelationship[]>();
    const packageRelsName: string = relationshipsPartName('/');
    const packageRelsPart: PackagePart = parts.get(packageRelsName);
    if (packageRelsPart === undefined) {
        throw new InvalidPackageError('defaultContent.zip is missing package relationships', { partName: packageRelsName });
    }
    const packageRelationships: Array<PackageRelationship> = parseRelationships(packageRelsPart.data, '/', limits, packageRelsName);
    partRelationships.set('/', packageRelationships);
    const partEntries: Array<[string, PackagePart]> = Array.from(parts.entries());
    for (let i: number = 0; i < partEntries.length; i++) {
        const name: string = arrayAt(partEntries, i)[0];
        if (!name.endsWith('.rels')) {
            continue;
        }
        const source: string = sourcePartFromRelsName(name);
        if (source === '/') {
            continue;
        }
        const relsPart: PackagePart = parts.get(name);
        if (relsPart === undefined) {
            continue;
        }
        partRelationships.set(source, parseRelationships(relsPart.data, source, limits, name));
    }
    if (!parts.has(CREATE_SLIDE_MASTER_PART) || !parts.has(CREATE_THEME_PART)) {
        throw new InvalidPackageError('defaultContent.zip is missing the slide master or theme', {
            partName: CREATE_SLIDE_MASTER_PART
        });
    }
    for (let n: number = 1; n <= 11; n++) {
        const layoutName: string = `/ppt/slideLayouts/slideLayout${String(n)}.xml`;
        if (!parts.has(layoutName)) {
            throw new InvalidPackageError(`defaultContent.zip is missing ${layoutName}`, { partName: layoutName });
        }
    }
    if (parts.has('/ppt/slides/slide1.xml')) {
        throw new InvalidPackageError('defaultContent.zip must not contain a slide part', {
            partName: '/ppt/slides/slide1.xml'
        });
    }
    const presentation: PackagePart = parts.get(CREATE_PRESENTATION_PART);
    if (presentation === undefined || PRESENTATION_MAIN_CONTENT_TYPES.indexOf(presentation.contentType) < 0) {
        throw new InvalidPackageError('defaultContent.zip presentation part is not a presentation main part', {
            partName: CREATE_PRESENTATION_PART
        });
    }
    return {
        parts,
        contentTypes,
        packageRelationships,
        partRelationships,
        presentationPartName: CREATE_PRESENTATION_PART,
        limits
    };
}
/**
 * Maps `/ppt/_rels/presentation.xml.rels` → `/ppt/presentation.xml`.
 *
 * @param {string} relsName - Relationships part name.
 * @returns {string} Source part name, or `/` for the package relationships part.
 */
function sourcePartFromRelsName(relsName: string): string {
    if (relsName === '/_rels/.rels') {
        return '/';
    }
    const marker: string = '/_rels/';
    const idx: number = relsName.lastIndexOf(marker);
    if (idx < 0 || !relsName.endsWith('.rels')) {
        throw new InvalidPackageError(`Cannot infer source part for relationships part "${relsName}"`, {
            partName: relsName
        });
    }
    const dir: string = relsName.slice(0, idx);
    const fileWithRels: string = relsName.slice(idx + marker.length);
    const file: string = fileWithRels.slice(0, -'.rels'.length);
    return dir.length === 0 ? `/${file}` : `${dir}/${file}`;
}
