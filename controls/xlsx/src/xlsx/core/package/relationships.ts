/**
 * OPC relationships parts (`.rels`) parse / serialize / resolve.
 *
 * XSD: `specs/ecma/.../OpenPackagingConventions-XMLSchema/opc-relationships.xsd`
 * Namespace: `http://schemas.openxmlformats.org/package/2006/relationships`
 *
 * External targets (`TargetMode="External"`) are never fetched.
 *
 * @private
 */

import { InvalidPackageError } from '../errors';
import { assertRootLocalName, decodeUtf8, encodeUtf8, escapeXml, findElementsWithAttrs } from '../xml/minimal-xml';
import { RELATIONSHIPS_NS } from './constants';
import { normalizePartName, relationshipsPartNameFor, resolveRelationshipTarget } from './part-names';

/**
 * One OPC relationship.
 */
export interface OpcRelationship {
    readonly id: string;
    readonly type: string;
    /** Raw Target attribute as stored. */
    readonly target: string;
    readonly targetMode?: 'Internal' | 'External';
    /**
     * Resolved absolute part name for Internal targets; raw URI for External.
     */
    readonly resolvedTarget: string;
}

/**
 * Parse a relationships part.
 *
 * @param {Uint8Array} bytes - The bytes parameter.
 * @param {string} sourcePart - The sourcePart parameter.
 * @param {string} partName - The partName parameter.
 * @returns {OpcRelationship[]} - Returns the result.
 */
export function parseRelationships(bytes: Uint8Array, sourcePart: string | null, partName: string): OpcRelationship[] {
    const xml: string = decodeUtf8(bytes);
    assertRootLocalName(xml, 'Relationships', partName);

    const seenIds: Set<string> = new Set<string>();
    const list: OpcRelationship[] = [];

    for (const el of findElementsWithAttrs(xml, 'Relationship')) {
        const id: string = el.attrs.get('Id');
        const type: string = el.attrs.get('Type');
        const target: string = el.attrs.get('Target');
        if (id === undefined || type === undefined || target === undefined) {
            throw new InvalidPackageError(`Relationship missing Id, Type, or Target in "${partName}"`, { partName });
        }
        if (seenIds.has(id)) {
            throw new InvalidPackageError(`Duplicate relationship Id "${id}" in "${partName}"`, {
                partName
            });
        }
        seenIds.add(id);

        const modeRaw: string = el.attrs.get('TargetMode');
        let targetMode: 'Internal' | 'External' | undefined;
        if (modeRaw === undefined) {
            targetMode = undefined;
        } else if (modeRaw === 'External') {
            targetMode = 'External';
        } else if (modeRaw === 'Internal') {
            targetMode = 'Internal';
        } else {
            throw new InvalidPackageError(`Invalid TargetMode "${modeRaw}" on relationship "${id}" in "${partName}"`, { partName });
        }

        const resolvedTarget: string = resolveRelationshipTarget(sourcePart, target, targetMode);

        const rel: OpcRelationship = {
            id,
            type,
            target,
            resolvedTarget,
            ...(targetMode !== undefined ? { targetMode } : {})
        };
        list.push(rel);
    }

    return list;
}

/**
 * Serialize relationships to XML bytes.
 *
 * @param {Object} relationships - The relationships parameter.
 * @returns {Uint8Array} - Returns the result.
 */
export function serializeRelationships(relationships: ReadonlyArray<OpcRelationship>): Uint8Array {
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
    lines.push(`<Relationships xmlns="${RELATIONSHIPS_NS}">`);
    for (const r of relationships) {
        const mode: string = r.targetMode === undefined ? '' : ` TargetMode="${escapeXml(r.targetMode)}"`;
        lines.push(`<Relationship Id="${escapeXml(r.id)}" Type="${escapeXml(r.type)}" Target="${escapeXml(r.target)}"${mode}/>`);
    }
    lines.push('</Relationships>');
    return encodeUtf8(lines.join(''));
}

/**
 * Map key for package-level relationships collections.
 */
export const PACKAGE_RELATIONSHIP_SOURCE: null = null;

/**
 * RelationshipSourceKey.
 */
export type RelationshipSourceKey = string | typeof PACKAGE_RELATIONSHIP_SOURCE;

/**
 * Build the ZIP/OPC part name for a relationship collection key.
 *
 * @param {RelationshipSourceKey} source - The source parameter.
 * @returns {string} - Returns the result.
 */
export function relationshipPartName(source: RelationshipSourceKey): string {
    if (source === null) {
        return relationshipsPartNameFor(null);
    }
    return relationshipsPartNameFor(normalizePartName(source));
}
