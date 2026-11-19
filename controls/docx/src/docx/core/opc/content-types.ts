import { PackageError } from '../errors/docx-error';
import { parseXml, serializeXml, OpenXmlElement } from '../xml/index';
import { ZipEntry } from '../zip/zip-entry';
import { OpenXmlChild, OpenXmlAttribute } from '../xml/model';
/** OPC Media Types stream ZIP item name (ECMA-376-2 §7.3.7). */
export const CONTENT_TYPES_ZIP_ITEM: string = '[Content_Types].xml';
/** `opc-contentTypes.xsd` targetNamespace. */
export const CONTENT_TYPES_NAMESPACE: string = 'http://schemas.openxmlformats.org/package/2006/content-types';
/** ECMA-376-1 §11.3.10 Main Document content type. */
export const MAIN_DOCUMENT_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml';
/** ECMA-376-1 §11.2 example Default for relationship parts. */
export const RELATIONSHIPS_CONTENT_TYPE: string = 'application/vnd.openxmlformats-package.relationships+xml';
export type ContentTypeRecord = {
    readonly kind: 'default';
    readonly extension: string;
    readonly contentType: string;
} | {
    readonly kind: 'override';
    readonly partName: string;
    readonly contentType: string;
} | {
    readonly kind: 'opaque';
    readonly xml: OpenXmlElement;
};
export interface ContentTypes {
    readonly records: ReadonlyArray<ContentTypeRecord>;
}
function isTypesElement(el: OpenXmlElement): boolean {
    return el.localName === 'Types' && el.namespaceUri === CONTENT_TYPES_NAMESPACE;
}
function childElements(el: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return el.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
function requiredAttr(el: OpenXmlElement, localName: string, what: string): string {
    const attr: OpenXmlAttribute = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName && a.namespaceUri === '');
    if (attr === undefined || attr.value.length === 0) {
        throw new PackageError('package/invalid-content-types', `${what} is missing ${localName}`);
    }
    return attr.value;
}
export function parseContentTypesXml(xml: string): ContentTypes {
    const root: OpenXmlElement = parseXml(xml);
    if (!isTypesElement(root)) {
        throw new PackageError('package/invalid-content-types', `Expected Types in ${CONTENT_TYPES_NAMESPACE}, found {${root.namespaceUri}}${root.localName}`);
    }
    const records: ContentTypeRecord[] = [];
    for (const child of childElements(root)) {
        if (child.namespaceUri !== CONTENT_TYPES_NAMESPACE) {
            records.push({ kind: 'opaque', xml: child });
            continue;
        }
        if (child.localName === 'Default') {
            records.push({
                kind: 'default',
                extension: requiredAttr(child, 'Extension', 'Default'),
                contentType: requiredAttr(child, 'ContentType', 'Default')
            });
            continue;
        }
        if (child.localName === 'Override') {
            records.push({
                kind: 'override',
                partName: requiredAttr(child, 'PartName', 'Override'),
                contentType: requiredAttr(child, 'ContentType', 'Override')
            });
            continue;
        }
        records.push({ kind: 'opaque', xml: child });
    }
    return { records };
}
export function readContentTypes(entries: ReadonlyArray<ZipEntry>): ContentTypes {
    const item: ZipEntry = entries.find((e: ZipEntry) => e.name === CONTENT_TYPES_ZIP_ITEM);
    if (item === undefined) {
        throw new PackageError('package/missing-part', `ZIP item ${CONTENT_TYPES_ZIP_ITEM} is required (ECMA-376-2 §7.3.7)`);
    }
    return parseContentTypesXml(new TextDecoder('utf-8').decode(item.data));
}
/**
 * Lookup as specified by OPC: Override by part name, else Default by extension.
 * ECMA-376-2: order of Default/Override is not significant for lookup.
 *
 * @param {ContentTypes} types - The types.
 * @param {string} logicalPartName - The logical part name.
 * @returns {string | undefined} The result.
 * @private
 */
export function lookupContentType(types: ContentTypes, logicalPartName: string): string | undefined {
    const override: ContentTypeRecord = types.records.find((r: ContentTypeRecord) => r.kind === 'override' && r.partName === logicalPartName);
    // Classic guards: TS 3.3 does not narrow after `(x == null ? undefined : x.kind) === …`.
    if (override !== undefined && override.kind === 'override') {
        return override.contentType;
    }
    const slash: number = logicalPartName.lastIndexOf('/');
    const fileName: string = slash === -1 ? logicalPartName : logicalPartName.slice(slash + 1);
    const dot: number = fileName.lastIndexOf('.');
    if (dot <= 0 || dot === fileName.length - 1) {
        return undefined;
    }
    const extension: string = fileName.slice(dot + 1);
    const def: ContentTypeRecord = types.records.find((r: ContentTypeRecord) => r.kind === 'default' && r.extension.toLowerCase() === extension.toLowerCase());
    if (def !== undefined && def.kind === 'default') {
        return def.contentType;
    }
    return undefined;
}
export function createTransitionalContentTypes(mainDocumentPartName: string = '/word/document.xml'): ContentTypes {
    return {
        records: [
            { kind: 'default', extension: 'rels', contentType: RELATIONSHIPS_CONTENT_TYPE },
            { kind: 'default', extension: 'xml', contentType: 'application/xml' },
            {
                kind: 'override',
                partName: mainDocumentPartName,
                contentType: MAIN_DOCUMENT_CONTENT_TYPE
            }
        ]
    };
}
export function serializeContentTypes(types: ContentTypes): string {
    const children: OpenXmlElement['children'] = types.records.map((record: ContentTypeRecord): OpenXmlChild => {
        if (record.kind === 'opaque') {
            return record.xml;
        }
        if (record.kind === 'default') {
            return {
                kind: 'element',
                namespaceUri: CONTENT_TYPES_NAMESPACE,
                localName: 'Default',
                prefix: '',
                attributes: [
                    { namespaceUri: '', localName: 'Extension', prefix: '', value: record.extension },
                    { namespaceUri: '', localName: 'ContentType', prefix: '', value: record.contentType }
                ],
                namespaceDeclarations: [],
                children: []
            };
        }
        return {
            kind: 'element',
            namespaceUri: CONTENT_TYPES_NAMESPACE,
            localName: 'Override',
            prefix: '',
            attributes: [
                { namespaceUri: '', localName: 'PartName', prefix: '', value: record.partName },
                { namespaceUri: '', localName: 'ContentType', prefix: '', value: record.contentType }
            ],
            namespaceDeclarations: [],
            children: []
        };
    });
    const root: OpenXmlElement = {
        kind: 'element',
        namespaceUri: CONTENT_TYPES_NAMESPACE,
        localName: 'Types',
        prefix: '',
        attributes: [],
        namespaceDeclarations: [{ prefix: '', namespaceUri: CONTENT_TYPES_NAMESPACE }],
        children
    };
    return serializeXml(root);
}
