import { arrayAt } from '../util/es5-compat';
/**
 * Parse and serialize OPC relationships parts (`.rels`).
 *
 * @remarks
 * Namespace: `http://schemas.openxmlformats.org/package/2006/relationships`
 * (opc-relationships.xsd). TargetMode is optional; default is Internal.
 */
import { InvalidPackageError, PackageLimitError } from '../security/errors';
import { SecurityLimits } from '../security/limits';
import { parseXml, serializeXmlDocument, OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/index';
import { RELATIONSHIPS_NS } from './constants';
import { resolveInternalTarget } from './paths';
/** OPC relationship TargetMode: Internal (default) or External. */
export type RelationshipTargetMode = 'Internal' | 'External';
/** One OPC Relationship row from a .rels part (Id, Type, Target, TargetMode). */
export interface PackageRelationship {
    /** Relationship Id attribute (e.g. rId1). */
    readonly id: string;
    /** Relationship Type URI (namespace-qualified relationship type). */
    readonly type: string;
    /** Raw Target attribute as stored on the Relationship element. */
    readonly target: string;
    /** TargetMode (Internal or External); defaults to Internal when omitted in markup. */
    readonly targetMode: RelationshipTargetMode;
    /**
     * Absolute part URI when TargetMode is Internal; undefined for External.
     */
    readonly targetPartName: string | undefined;
}
/**
 * Parses a relationships part.
 *
 * @param {Uint8Array} xmlBytes - Part octets.
 * @param {string} sourcePartName - Absolute source part URI, or `/` for package rels.
 * @param {SecurityLimits} limits - XML / relationship security limits.
 * @param {string} relsPartName - Absolute URI of the `.rels` part (diagnostics).
 * @returns {PackageRelationship[]} The result.
 */
export function parseRelationships(xmlBytes: Uint8Array, sourcePartName: string, limits: SecurityLimits,
                                   relsPartName: string): PackageRelationship[] {
    const text: string = new TextDecoder('utf-8').decode(xmlBytes);
    const root: OoxmlElement = parseXml(text, { limits, partName: relsPartName });
    if (root.localName !== 'Relationships' || root.namespaceUri !== RELATIONSHIPS_NS) {
        throw new InvalidPackageError('Relationships root must be Relationships in the OPC relationships namespace',
                                      { partName: relsPartName });
    }
    const result: PackageRelationship[] = [];
    const seenIds: Set<string> = new Set<string>();
    for (let i: number = 0; i < root.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(root.children, i);
        if (child.kind !== 'element' ||
            child.namespaceUri !== RELATIONSHIPS_NS ||
            child.localName !== 'Relationship') {
            continue;
        }
        const id: string = getAttr(child, 'Id');
        const type: string = getAttr(child, 'Type');
        const target: string = getAttr(child, 'Target');
        const modeRaw: string = getAttr(child, 'TargetMode');
        if (id === undefined || type === undefined || target === undefined) {
            throw new InvalidPackageError('Relationship requires Id, Type, and Target', {
                partName: relsPartName
            });
        }
        if (seenIds.has(id)) {
            throw new InvalidPackageError(`Duplicate relationship Id "${id}"`, {
                partName: relsPartName
            });
        }
        seenIds.add(id);
        if (result.length >= limits.relationshipsPerPart) {
            throw new PackageLimitError('relationshipsPerPart', {
                partName: relsPartName,
                actual: result.length + 1
            });
        }
        let targetMode: RelationshipTargetMode = 'Internal';
        if (modeRaw !== undefined) {
            if (modeRaw !== 'Internal' && modeRaw !== 'External') {
                throw new InvalidPackageError(`Invalid TargetMode "${modeRaw}"`, {
                    partName: relsPartName
                });
            }
            targetMode = modeRaw;
        }
        let targetPartName: string | undefined;
        if (targetMode === 'Internal') {
            targetPartName = resolveInternalTarget(sourcePartName, target);
        }
        result.push({ id, type, target, targetMode, targetPartName });

    }
    return result;
}
/**
 * Serializes relationships to UTF-8 XML bytes.
 *
 * @param {*} rels - The rels value.
 * @returns {Uint8Array} The result.
 */
export function serializeRelationships(rels: ReadonlyArray<PackageRelationship>): Uint8Array {
    const children: OoxmlElement[] = rels.map((r: PackageRelationship) => {
        const attributes: OoxmlAttribute[] = [
            attr('Id', r.id),
            attr('Type', r.type),
            attr('Target', r.target)
        ];
        if (r.targetMode === 'External') {
            attributes.push(attr('TargetMode', 'External'));
        }
        return {
            kind: 'element' as 'element',
            localName: 'Relationship',
            namespaceUri: RELATIONSHIPS_NS,
            prefixHint: '',
            attributes,
            children: []
        };
    });
    const root: OoxmlElement = {
        kind: 'element' as 'element',
        localName: 'Relationships',
        namespaceUri: RELATIONSHIPS_NS,
        prefixHint: '',
        attributes: [],
        children
    };
    const xml: string = serializeXmlDocument(root);
    return new TextEncoder().encode(xml);
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
