/**
 * Parse and serialize OPC `[Content_Types].xml`.
 *
 * @remarks
 * Namespace: `http://schemas.openxmlformats.org/package/2006/content-types`
 * (opc-contentTypes.xsd). Override wins over Default for a given part name.
 */
import { InvalidPackageError } from '../security/errors';
import { SecurityLimits } from '../security/limits';
import { parseXml, serializeXmlDocument, OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/index';
import { CONTENT_TYPES_NS } from './constants';
import { isTrashItem } from './paths';
import { stringIncludes, arrayAt } from '../util/es5-compat';
import { PackagePart } from './package-model';
export interface ContentTypesModel {
    /** Extension (no dot) → content type. */
    readonly defaults: Map<string, string>;
    /** Absolute part name → content type. */
    readonly overrides: Map<string, string>;
}
/**
 * Parses `[Content_Types].xml` bytes into defaults and overrides.
 *
 * @param {Uint8Array} xmlBytes - The xmlBytes value.
 * @param {SecurityLimits} limits - The limits value.
 * @returns {ContentTypesModel} The result.
 */
export function parseContentTypes(xmlBytes: Uint8Array, limits: SecurityLimits): ContentTypesModel {
    const text: string = new TextDecoder('utf-8').decode(xmlBytes);
    const root: OoxmlElement = parseXml(text, { limits, partName: '/[Content_Types].xml' });
    if (root.localName !== 'Types' || root.namespaceUri !== CONTENT_TYPES_NS) {
        throw new InvalidPackageError('Content_Types root must be Types in the OPC content-types namespace',
                                      { partName: '/[Content_Types].xml' });
    }
    const defaults: Map<string, string> = new Map<string, string>();
    const overrides: Map<string, string> = new Map<string, string>();
    for (let i: number = 0; i < root.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(root.children, i);
        if (child.kind !== 'element' || child.namespaceUri !== CONTENT_TYPES_NS) {
            continue;
        }
        if (child.localName === 'Default') {
            const ext: string = getAttr(child, 'Extension');
            const ct: string = getAttr(child, 'ContentType');
            if (ext === undefined || ct === undefined) {
                throw new InvalidPackageError('Content_Types Default requires Extension and ContentType', {
                    partName: '/[Content_Types].xml'
                });
            }
            defaults.set(ext.toLowerCase(), ct);
        }
        else if (child.localName === 'Override') {
            const partName: string = getAttr(child, 'PartName');
            const ct: string = getAttr(child, 'ContentType');
            if (partName === undefined || ct === undefined) {
                throw new InvalidPackageError('Content_Types Override requires PartName and ContentType', {
                    partName: '/[Content_Types].xml'
                });
            }
            const absolute: string = partName.startsWith('/') ? partName : `/${partName}`;
            overrides.set(absolute, ct);
        }

    }
    return { defaults, overrides };
}
/**
 * Resolves the content type for a part name using Override then Default-by-extension.
 *
 * @param {ContentTypesModel} model - The model value.
 * @param {string} partName - The partName value.
 * @returns {string | undefined} The result.
 */
export function resolveContentType(model: ContentTypesModel, partName: string): string | undefined {
    const over: string = model.overrides.get(partName);
    if (over !== undefined) {
        return over;
    }
    const base: string = stringIncludes(partName, '/') ? partName.slice(partName.lastIndexOf('/') + 1) : partName;
    const dot: number = base.lastIndexOf('.');
    if (dot < 0 || dot === base.length - 1) {
        return undefined;
    }
    const ext: string = base.slice(dot + 1).toLowerCase();
    return model.defaults.get(ext);
}
/**
 * Serializes a content-types model to UTF-8 XML bytes.
 *
 * @param {ContentTypesModel} model - The model value.
 * @returns {Uint8Array} The result.
 */
export function serializeContentTypes(model: ContentTypesModel): Uint8Array {
    const children: OoxmlElement[] = [];
    const defaultExts: Array<string> = [...model.defaults.keys()].sort();
    for (let i: number = 0; i < defaultExts.length; i++) {
        const ext: string = arrayAt(defaultExts, i);
        const defaultCt: string = model.defaults.get(ext);
        const ct: string = defaultCt != null ? defaultCt : '';
        children.push({
            kind: 'element' as 'element',
            localName: 'Default',
            namespaceUri: CONTENT_TYPES_NS,
            prefixHint: '',
            attributes: [attr('Extension', ext), attr('ContentType', ct)],
            children: []
        });

    }
    const partNames: Array<string> = [...model.overrides.keys()].sort();
    for (let i: number = 0; i < partNames.length; i++) {
        const partName: string = arrayAt(partNames, i);
        const overrideCt: string = model.overrides.get(partName);
        const ct: string = overrideCt != null ? overrideCt : '';
        children.push({
            kind: 'element' as 'element',
            localName: 'Override',
            namespaceUri: CONTENT_TYPES_NS,
            prefixHint: '',
            attributes: [attr('PartName', partName), attr('ContentType', ct)],
            children: []
        });

    }
    const root: OoxmlElement = {
        kind: 'element' as 'element',
        localName: 'Types',
        namespaceUri: CONTENT_TYPES_NS,
        prefixHint: '',
        attributes: [],
        children
    };
    const xml: string = serializeXmlDocument(root);
    return new TextEncoder().encode(xml);
}
/**
 * Builds a content-types model covering every OPC part in the package map.
 * Existing defaults/overrides are preserved when still applicable.
 *
 * @remarks ECMA-376 Part 1 §9.1.5 Trash Items (`/[trash]/HHHH.dat`) are **not** OPC parts and shall not be associated with a content type.
 * They are skipped here and any pre-existing Override for a trash name is stripped, even if the ZIP bytes are still retained in the package
 * map for round-trip.
 * @param {ContentTypesModel} existing - The existing value.
 * @param {*} parts - The parts value.
 * @returns {ContentTypesModel} The result.
 */
export function ensureContentTypesForParts(existing: ContentTypesModel, parts: ReadonlyMap<string, {
    contentType: string;
}>): ContentTypesModel {
    const defaults: Map<string, string> = new Map(existing.defaults);
    const overrides: Map<string, string> = new Map(existing.overrides);
    if (!defaults.has('rels')) {
        defaults.set('rels', 'application/vnd.openxmlformats-package.relationships+xml');
    }
    if (!defaults.has('xml')) {
        defaults.set('xml', 'application/xml');
    }
    const partEntries: [string, { contentType: string; }][] = Array.from(parts.entries());// eslint-disable-line
    for (let i: number = 0; i < partEntries.length; i++) {
        const partName: string = arrayAt(partEntries, i)[0];
        const part: PackagePart = arrayAt(partEntries, i)[1] as PackagePart;
        if (partName.toLowerCase() === '/[content_types].xml' || isTrashItem(partName)) {
            continue;
        }
        const current: string = resolveContentType({ defaults, overrides }, partName);
        if (current === part.contentType) {
            continue;
        }
        overrides.set(partName, part.contentType);

    }
    const items: string[] = [...overrides.keys()];
    for (let i: number = 0; i < items.length; i++) {
        const key: string = arrayAt(items, i);
        // Drop Overrides for removed parts and for trash items (never content-typed).
        if (!parts.has(key) || isTrashItem(key)) {
            overrides.delete(key);
        }

    }
    return { defaults, overrides };
}
/**
 *
 * @param {string} localName - The localName value.
 * @param {string} value - The value value.
 * @returns {OoxmlAttribute} The result.
 */
function attr(localName: string, value: string): OoxmlAttribute {
    return { namespaceUri: '', localName, value };
}
/**
 *
 * @param {OoxmlElement} el - The el value.
 * @param {string} localName - The localName value.
 * @returns {string | undefined} The result.
 */
function getAttr(el: OoxmlElement, localName: string): string | undefined {
    for (let i: number = 0; i < el.attributes.length; i++) {
        const a: OoxmlAttribute = arrayAt(el.attributes, i);
        if (a.localName === localName) {
            return a.value;
        }

    }
    return undefined;
}
