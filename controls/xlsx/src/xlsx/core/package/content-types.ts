/**
 * OPC `[Content_Types].xml` parse / serialize / resolve.
 *
 * XSD: `specs/ecma/.../OpenPackagingConventions-XMLSchema/opc-contentTypes.xsd`
 * Namespace: `http://schemas.openxmlformats.org/package/2006/content-types`
 *
 * Resolution: Override (PartName) wins over Default (Extension).
 *
 * @private
 */

import { InvalidPackageError } from '../errors';
import { assertRootLocalName, decodeUtf8, encodeUtf8, escapeXml, findElementsWithAttrs } from '../xml/minimal-xml';
import { CONTENT_TYPES_NS, CONTENT_TYPES_PART_NAME } from './constants';
import { normalizePartName, partExtension, partNamesEqual } from './part-names';

/**
 * A Default content type mapping (by file extension, no leading dot).
 */
export interface ContentTypeDefault {
    readonly extension: string;
    readonly contentType: string;
}

/**
 * An Override content type mapping (by absolute part name).
 */
export interface ContentTypeOverride {
    readonly partName: string;
    readonly contentType: string;
}

/**
 * Parsed content types part.
 */
export interface ContentTypes {
    readonly defaults: ReadonlyArray<ContentTypeDefault>;
    readonly overrides: ReadonlyArray<ContentTypeOverride>;
}

/**
 * Parse `[Content_Types].xml` bytes.
 *
 * @param {Uint8Array} bytes - The bytes parameter.
 * @returns {ContentTypes} - Returns the result.
 */
export function parseContentTypes(bytes: Uint8Array): ContentTypes {
    const xml: string = decodeUtf8(bytes);
    assertRootLocalName(xml, 'Types', CONTENT_TYPES_PART_NAME);

    const defaults: ContentTypeDefault[] = [];
    for (const el of findElementsWithAttrs(xml, 'Default')) {
        const extension: string = el.attrs.get('Extension');
        const contentType: string = el.attrs.get('ContentType');
        if (extension === undefined || contentType === undefined) {
            throw new InvalidPackageError('Content Types Default missing Extension or ContentType', { partName: CONTENT_TYPES_PART_NAME });
        }
        defaults.push({
            extension: extension.toLowerCase(),
            contentType
        });
    }

    const overrides: ContentTypeOverride[] = [];
    for (const el of findElementsWithAttrs(xml, 'Override')) {
        const partName: string = el.attrs.get('PartName');
        const contentType: string = el.attrs.get('ContentType');
        if (partName === undefined || contentType === undefined) {
            throw new InvalidPackageError('Content Types Override missing PartName or ContentType', { partName: CONTENT_TYPES_PART_NAME });
        }
        overrides.push({
            partName: normalizePartName(partName),
            contentType
        });
    }

    return { defaults, overrides };
}

/**
 * Resolve content type for a part. Override wins; else Default by extension.
 *
 * @param {ContentTypes} contentTypes - The contentTypes parameter.
 * @param {string} partName - The partName parameter.
 * @returns {string} - Returns the result.
 */
export function resolveContentType(contentTypes: ContentTypes, partName: string): string | undefined {
    const normalized: string = normalizePartName(partName);
    for (const o of contentTypes.overrides) {
        if (partNamesEqual(o.partName, normalized)) {
            return o.contentType;
        }
    }
    const ext: string = partExtension(normalized);
    if (ext === undefined) {
        return undefined;
    }
    for (const d of contentTypes.defaults) {
        if (d.extension === ext) {
            return d.contentType;
        }
    }
    return undefined;
}

/**
 * Serialize content types to XML bytes (UTF-8, transitional OPC namespace).
 *
 * @param {ContentTypes} contentTypes - The contentTypes parameter.
 * @returns {Uint8Array} - Returns the result.
 */
export function serializeContentTypes(contentTypes: ContentTypes): Uint8Array {
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
    lines.push(`<Types xmlns="${CONTENT_TYPES_NS}">`);
    for (const d of contentTypes.defaults) {
        lines.push(`<Default Extension="${escapeXml(d.extension)}" ContentType="${escapeXml(d.contentType)}"/>`);
    }
    for (const o of contentTypes.overrides) {
        lines.push(`<Override PartName="${escapeXml(normalizePartName(o.partName))}" ContentType="${escapeXml(o.contentType)}"/>`);
    }
    lines.push('</Types>');
    return encodeUtf8(lines.join(''));
}

/**
 * Ensure every part (except content types itself) has a resolvable content type. Returns a copy with any missing Defaults/Overrides required by `partNames`. Does not invent spreadsheet content types — caller supplies maps.
 *
 * @param {ContentTypes} contentTypes - The contentTypes parameter.
 * @param {string} partNames - The partNames parameter.
 * @param {string} fallbackByExtension - The fallbackByExtension parameter.
 * @returns {ContentTypes} - Returns the result.
 */
export function ensureContentTypesForParts(
    contentTypes: ContentTypes,
    partNames: ReadonlyArray<string>,
    fallbackByExtension: ReadonlyMap<string, string>
): ContentTypes {
    const defaults: ContentTypeDefault[] = [...contentTypes.defaults];
    const overrides: ContentTypeOverride[] = [...contentTypes.overrides];
    const defaultExts: Set<string> = new Set(defaults.map((d: ContentTypeDefault): string => d.extension));

    for (const raw of partNames) {
        const name: string = normalizePartName(raw);
        if (partNamesEqual(name, CONTENT_TYPES_PART_NAME)) {
            continue;
        }
        if (resolveContentType({ defaults, overrides }, name) !== undefined) {
            continue;
        }
        const ext: string = partExtension(name);
        if (ext !== undefined && !defaultExts.has(ext)) {
            const ct: string = fallbackByExtension.get(ext);
            if (ct !== undefined) {
                defaults.push({ extension: ext, contentType: ct });
                defaultExts.add(ext);
                continue;
            }
        }
        throw new InvalidPackageError(`No content type for part "${name}" and no Default extension mapping`, { partName: name });
    }

    return { defaults, overrides };
}
