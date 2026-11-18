import { PackageError, SecurityError } from '../errors/docx-error';
import { DEFAULT_RESOURCE_LIMITS } from '../security/limits';
import { parseXml, serializeXml, OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../xml/index';
/**
 * Relationship Id (`Id` on `Relationship`, `xsd:ID` in opc-relationships.xsd).
 */
export type RelationshipId = string & {
    readonly __brand: 'RelationshipId';
};
/** `opc-relationships.xsd` targetNamespace. */
export const RELATIONSHIPS_NAMESPACE: string = 'http://schemas.openxmlformats.org/package/2006/relationships';
/**
 * Transitional officeDocument relationship Type (ECMA-376-4 §9.2.10).
 */
export const OFFICE_DOCUMENT_RELATIONSHIP_TYPE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument';
/**
 * Strict officeDocument relationship Type (ECMA-376-1 §11.2 example).
 * Accepted on load; never rewritten to Transitional on save.
 */
export const STRICT_OFFICE_DOCUMENT_RELATIONSHIP_TYPE: string = 'http://purl.oclc.org/ooxml/officeDocument/relationships/officeDocument';
export enum TargetMode {
    Internal = 'Internal',
    External = 'External'
}
export interface OpcRelationship {
    readonly id: RelationshipId;
    readonly type: string;
    readonly target: string;
    readonly targetMode?: TargetMode;
    readonly extraAttributes: ReadonlyArray<OpenXmlAttribute>;
    readonly children: ReadonlyArray<OpenXmlChild>;
}
export interface Relationships {
    readonly items: ReadonlyArray<OpcRelationship>;
    readonly opaque: ReadonlyArray<OpenXmlElement>;
}
const ID_PATTERN: RegExp = /^[A-Za-z_][\w.-]*$/;
export function relationshipId(value: string): RelationshipId {
    if (!ID_PATTERN.test(value)) {
        throw new PackageError('package/invalid-relationship-id', `Relationship Id is not a valid xsd:ID token: ${value}`);
    }
    return value as RelationshipId;
}
export function allocateRelationshipId(used: ReadonlySet<string>): RelationshipId {
    let n: number = 1;
    while (used.has(`rId${String(n)}`)) {
        n += 1;
    }
    return relationshipId(`rId${String(n)}`);
}
export function isOfficeDocumentRelationshipType(type: string): boolean {
    return type === OFFICE_DOCUMENT_RELATIONSHIP_TYPE || type === STRICT_OFFICE_DOCUMENT_RELATIONSHIP_TYPE;
}
function childElements(el: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return el.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
function attr(el: OpenXmlElement, localName: string): string | undefined {
    const found: OpenXmlAttribute = el.attributes.find((a: OpenXmlAttribute) => a.localName === localName && a.namespaceUri === '');
    return found == null ? undefined : found.value;
}
function requiredAttr(el: OpenXmlElement, localName: string): string {
    const value: string = attr(el, localName);
    if (value === undefined || value.length === 0) {
        throw new PackageError('package/invalid-relationships', `Relationship is missing ${localName}`);
    }
    return value;
}
function parseTargetMode(value: string | undefined): TargetMode | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (value === TargetMode.Internal || value === TargetMode.External) {
        return value;
    }
    throw new PackageError('package/invalid-relationships', `TargetMode must be Internal or External (opc-relationships.xsd ST_TargetMode), got ${value}`);
}
export function parseRelationshipsXml(xml: string, options?: {
    readonly relationshipCountLimit?: number;
    readonly sourceLabel?: string;
}): Relationships {
    let ts330: any; let ts331: any;
    const limit: number =
        ((ts330 = options == null ? undefined : options.relationshipCountLimit),
        ts330 != null ? ts330 : DEFAULT_RESOURCE_LIMITS.relationshipCountPerPart);
    const sourceLabel: string = ((ts331 = options == null ? undefined : options.sourceLabel), ts331 != null ? ts331 : 'Relationships part');
    const root: OpenXmlElement = parseXml(xml);
    if (root.localName !== 'Relationships' || root.namespaceUri !== RELATIONSHIPS_NAMESPACE) {
        throw new PackageError('package/invalid-relationships', `Expected Relationships in ${RELATIONSHIPS_NAMESPACE}, found {${root.namespaceUri}}${root.localName}`);
    }
    const items: OpcRelationship[] = [];
    const opaque: OpenXmlElement[] = [];
    const seenIds: Set<string> = new Set<string>();
    let relationshipCount: number = 0;
    for (const child of childElements(root)) {
        if (child.namespaceUri !== RELATIONSHIPS_NAMESPACE || child.localName !== 'Relationship') {
            opaque.push(child);
            continue;
        }
        relationshipCount += 1;
        if (relationshipCount > limit) {
            throw new SecurityError('security/relationship-count', `Relationship count exceeds ${String(limit)} on ${sourceLabel}`);
        }
        const id: RelationshipId = relationshipId(requiredAttr(child, 'Id'));
        if (seenIds.has(id)) {
            throw new PackageError('package/invalid-relationships', `Duplicate Relationship Id ${id} in ${sourceLabel} (xsd:ID uniqueness)`);
        }
        seenIds.add(id);
        const known: Set<string> = new Set(['Id', 'Type', 'Target', 'TargetMode']);
        const extraAttributes: OpenXmlAttribute[] = child.attributes.filter((a: OpenXmlAttribute) => a.namespaceUri !== '' || !known.has(a.localName));
        const mode: TargetMode = parseTargetMode(attr(child, 'TargetMode'));
        const relationship: OpcRelationship = {
            id,
            type: requiredAttr(child, 'Type'),
            target: requiredAttr(child, 'Target'),
            extraAttributes,
            children: child.children,
            ...(mode === undefined ? {} : { targetMode: mode })
        };
        items.push(relationship);
    }
    return { items, opaque };
}
export function serializeRelationships(rels: Relationships): string {
    const children: OpenXmlElement['children'] = [
        ...rels.items.map((item: OpcRelationship): OpenXmlElement => {
            const attributes: OpenXmlAttribute[] = [
                { namespaceUri: '', localName: 'Id', prefix: '', value: item.id },
                { namespaceUri: '', localName: 'Type', prefix: '', value: item.type },
                { namespaceUri: '', localName: 'Target', prefix: '', value: item.target }
            ];
            if (item.targetMode !== undefined) {
                attributes.push({
                    namespaceUri: '',
                    localName: 'TargetMode',
                    prefix: '',
                    value: item.targetMode
                });
            }
            attributes.push(...item.extraAttributes);
            return {
                kind: 'element',
                namespaceUri: RELATIONSHIPS_NAMESPACE,
                localName: 'Relationship',
                prefix: '',
                attributes,
                namespaceDeclarations: [],
                children: item.children
            };
        }),
        ...rels.opaque
    ];
    const root: OpenXmlElement = {
        kind: 'element',
        namespaceUri: RELATIONSHIPS_NAMESPACE,
        localName: 'Relationships',
        prefix: '',
        attributes: [],
        namespaceDeclarations: [{ prefix: '', namespaceUri: RELATIONSHIPS_NAMESPACE }],
        children
    };
    return serializeXml(root);
}
export function findOfficeDocumentRelationship(rels: Relationships): OpcRelationship | undefined {
    return rels.items.find((item: OpcRelationship) => isOfficeDocumentRelationshipType(item.type));
}
export function emptyRelationships(): Relationships {
    return { items: [], opaque: [] };
}
export function relationshipsWith(items: ReadonlyArray<OpcRelationship>, opaque: ReadonlyArray<OpenXmlElement> = []): Relationships {
    const seen: Set<string> = new Set<string>();
    for (const item of items) {
        if (seen.has(item.id)) {
            throw new PackageError('package/invalid-relationships', `Duplicate Relationship Id ${item.id}`);
        }
        seen.add(item.id);
    }
    return { items, opaque };
}
