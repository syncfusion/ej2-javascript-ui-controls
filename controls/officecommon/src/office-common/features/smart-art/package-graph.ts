/**
 * Host-neutral discovery of DrawingML diagram instances from a package graph.
 *
 * @remarks
 * Locates the four diagram parts (content types / relationship types from
 * ECMA-376 Part 1 §14.2.3–14.2.6 and Part 4 §12.2.3–12.2.6) and binds them via
 * `dgm:relIds` (`CT_RelIds`) and/or outbound diagram relationships from a common
 * source part. Layout parts are never shared across instances (§14.2.5).
 *
 * This module does not import PPT/Word/Excel product types. Callers supply a
 * {@link DiagramPackageGraph} (parts + relationships).
 * @public
 */

import { DiagramPartError } from './errors';
import { DIAGRAM_COLORS_CONTENT_TYPE, DIAGRAM_COLORS_RELATIONSHIP_TYPE, DIAGRAM_DATA_CONTENT_TYPE, DIAGRAM_DATA_RELATIONSHIP_TYPE, DIAGRAM_LAYOUT_CONTENT_TYPE, DIAGRAM_LAYOUT_RELATIONSHIP_TYPE, DIAGRAM_QUICK_STYLE_RELATIONSHIP_TYPE, DIAGRAM_STYLE_CONTENT_TYPE } from './namespaces';
import { parseDiagramColors } from './parse-colors';
import { parseDiagramData } from './parse-data';
import { parseDiagramLayout } from './parse-layout';
import { findDiagramRelIds } from './parse-rel-ids';
import { parseDiagramStyle } from './parse-style';
import { DiagramColorsPart, DiagramDataPart, DiagramInstance, DiagramLayoutPart, DiagramPackageGraph, DiagramPackagePart, DiagramPackageRelationship, DiagramPartNames, DiagramRelIds, DiagramStylePart, GetDiagramInstanceOptions } from './types';

/**
 * Normalize package part names for map keys (leading `/`, no trailing `/`).
 *
 * @param {string} name - The name.
 * @returns {string} The result.
 */
export function normalizePartName(name: string): string {
    let n: string = name.trim().replace(/\\/g, '/');
    if (n.length === 0) {
        return '/';
    }
    if (!n.startsWith('/')) {
        n = `/${n}`;
    }
    if (n.length > 1 && n.endsWith('/')) {
        n = n.slice(0, -1);
    }
    return n;
}
/**
 * The build part map.
 *
 * @param {ReadonlyArray<DiagramPackagePart>} parts - The parts.
 * @returns {Map<string, DiagramPackagePart>} The result.
 */
function buildPartMap(parts: ReadonlyArray<DiagramPackagePart>): Map<string, DiagramPackagePart> {
    const map: Map<string, DiagramPackagePart> = new Map<string, DiagramPackagePart>();
    for (const part of parts) {
        map.set(normalizePartName(part.name), part);
    }
    return map;
}
/**
 * The relationships from source.
 *
 * @param {ReadonlyArray<DiagramPackageRelationship>} relationships - The relationships.
 * @param {string} source - The source.
 * @returns {DiagramPackageRelationship[]} The result.
 */
function relationshipsFromSource(relationships: ReadonlyArray<DiagramPackageRelationship>, source: string): DiagramPackageRelationship[] {
    const src: string = normalizePartName(source);
    return relationships.filter((r: DiagramPackageRelationship) => normalizePartName(r.source) === src);
}
/**
 * The resolve target.
 *
 * @param {ReadonlyArray<DiagramPackageRelationship>} rels - The rels.
 * @param {string} relId - The rel id.
 * @returns {string | undefined} The result.
 */
function resolveTarget(rels: ReadonlyArray<DiagramPackageRelationship>, relId: string): string | undefined {
    for (const r of rels) {
        if (r.id === relId) {
            return normalizePartName(r.target);
        }
    }
    return undefined;
}
/**
 * The require part.
 *
 * @param {Map<string, DiagramPackagePart>} map - The map.
 * @param {string} name - The name.
 * @param {string} role - The role.
 * @returns {DiagramPackagePart} The result.
 */
function requirePart(map: Map<string, DiagramPackagePart>, name: string, role: string): DiagramPackagePart {
    const part: DiagramPackagePart = map.get(normalizePartName(name));
    if (part === undefined) {
        throw new DiagramPartError(`Diagram ${role} part not found: ${name}`);
    }
    return part;
}
/**
 * The parse four parts.
 *
 * @param {Map<string, DiagramPackagePart>} map - The map.
 * @param {DiagramPartNames} names - The names.
 * @returns {object} The result.
 */
function parseFourParts(map: Map<string, DiagramPackagePart>, names: DiagramPartNames): {
    data: DiagramDataPart;
    layout: DiagramLayoutPart;
    colors: DiagramColorsPart;
    style: DiagramStylePart;
} {
    const dataPart: DiagramPackagePart = requirePart(map, names.data, 'data');
    const layoutPart: DiagramPackagePart = requirePart(map, names.layout, 'layout');
    const colorsPart: DiagramPackagePart = requirePart(map, names.colors, 'colors');
    const stylePart: DiagramPackagePart = requirePart(map, names.style, 'style');
    if (dataPart.contentType !== DIAGRAM_DATA_CONTENT_TYPE) {
        throw new DiagramPartError(`Expected diagram data content type for ${names.data}, got ${dataPart.contentType}`);
    }
    if (layoutPart.contentType !== DIAGRAM_LAYOUT_CONTENT_TYPE) {
        throw new DiagramPartError(`Expected diagram layout content type for ${names.layout}, got ${layoutPart.contentType}`);
    }
    if (colorsPart.contentType !== DIAGRAM_COLORS_CONTENT_TYPE) {
        throw new DiagramPartError(`Expected diagram colors content type for ${names.colors}, got ${colorsPart.contentType}`);
    }
    if (stylePart.contentType !== DIAGRAM_STYLE_CONTENT_TYPE) {
        throw new DiagramPartError(`Expected diagram style content type for ${names.style}, got ${stylePart.contentType}`);
    }
    return {
        data: parseDiagramData(dataPart.xml),
        layout: parseDiagramLayout(layoutPart.xml),
        colors: parseDiagramColors(colorsPart.xml),
        style: parseDiagramStyle(stylePart.xml)
    };
}
/**
 * The instance from binding.
 *
 * @param {Map<string, DiagramPackagePart>} map - The map.
 * @param {string} sourcePartName - The source part name.
 * @param {DiagramRelIds} relIds - The rel ids.
 * @param {DiagramPartNames} names - The names.
 * @returns {DiagramInstance} The result.
 */
function instanceFromBinding(
    map: Map<string, DiagramPackagePart>,
    sourcePartName: string,
    relIds: DiagramRelIds,
    names: DiagramPartNames
): DiagramInstance {
    const parsed: {
        data: DiagramDataPart;
        layout: DiagramLayoutPart;
        colors: DiagramColorsPart;
        style: DiagramStylePart;
    } = parseFourParts(map, names);
    const id: string = normalizePartName(names.data);
    return {
        id,
        data: parsed.data,
        layout: parsed.layout,
        colors: parsed.colors,
        style: parsed.style,
        relIds: {
            dm: relIds.dm,
            lo: relIds.lo,
            qs: relIds.qs,
            cs: relIds.cs
        },
        partNames: {
            data: normalizePartName(names.data),
            layout: normalizePartName(names.layout),
            colors: normalizePartName(names.colors),
            style: normalizePartName(names.style)
        },
        sourcePartName: sourcePartName.length > 0 ? normalizePartName(sourcePartName) : ''
    };
}
/**
 * The try bind rel ids.
 *
 * @param {Map<string, DiagramPackagePart>} map - The map.
 * @param {ReadonlyArray<DiagramPackageRelationship>} sourceRels - The source rels.
 * @param {string} sourcePartName - The source part name.
 * @param {DiagramRelIds} relIds - The rel ids.
 * @returns {DiagramInstance | undefined} The result.
 */
function tryBindRelIds(
    map: Map<string, DiagramPackagePart>,
    sourceRels: ReadonlyArray<DiagramPackageRelationship>,
    sourcePartName: string,
    relIds: DiagramRelIds
): DiagramInstance | undefined {
    const data: string = resolveTarget(sourceRels, relIds.dm);
    const layout: string = resolveTarget(sourceRels, relIds.lo);
    const style: string = resolveTarget(sourceRels, relIds.qs);
    const colors: string = resolveTarget(sourceRels, relIds.cs);
    if (data === undefined || layout === undefined || style === undefined || colors === undefined) {
        return undefined;
    }
    try {
        return instanceFromBinding(map, sourcePartName, relIds, {
            data,
            layout,
            colors,
            style
        });
    } catch {
    // Orphan/partial graph: missing part or wrong content type — skip for enumerate.
        return undefined;
    }
}

/**
 * Groups outbound diagram relationship types from one source into part names.
 *
 * @param {ReadonlyArray<DiagramPackageRelationship>} sourceRels - The source rels.
 * @returns {*} Names + synthetic relIds when exactly one of each role is present.
 */
function clusterFromSourceRels(sourceRels: ReadonlyArray<DiagramPackageRelationship>): {
    relIds: DiagramRelIds;
    names: DiagramPartNames;
} | undefined {
    const dataRels: DiagramPackageRelationship[] =
        sourceRels.filter((r: DiagramPackageRelationship) => r.type === DIAGRAM_DATA_RELATIONSHIP_TYPE);
    const layoutRels: DiagramPackageRelationship[] =
        sourceRels.filter((r: DiagramPackageRelationship) => r.type === DIAGRAM_LAYOUT_RELATIONSHIP_TYPE);
    const styleRels: DiagramPackageRelationship[] =
        sourceRels.filter((r: DiagramPackageRelationship) => r.type === DIAGRAM_QUICK_STYLE_RELATIONSHIP_TYPE);
    const colorsRels: DiagramPackageRelationship[] =
        sourceRels.filter((r: DiagramPackageRelationship) => r.type === DIAGRAM_COLORS_RELATIONSHIP_TYPE);
    if (dataRels.length !== 1 || layoutRels.length !== 1 || styleRels.length !== 1 || colorsRels.length !== 1) {
        return undefined;
    }
    const dataRel: DiagramPackageRelationship = dataRels[0];
    const layoutRel: DiagramPackageRelationship = layoutRels[0];
    const styleRel: DiagramPackageRelationship = styleRels[0];
    const colorsRel: DiagramPackageRelationship = colorsRels[0];
    if (dataRel === undefined || layoutRel === undefined || styleRel === undefined || colorsRel === undefined) {
        return undefined;
    }
    return {
        relIds: {
            dm: dataRel.id,
            lo: layoutRel.id,
            qs: styleRel.id,
            cs: colorsRel.id
        },
        names: {
            data: normalizePartName(dataRel.target),
            layout: normalizePartName(layoutRel.target),
            colors: normalizePartName(colorsRel.target),
            style: normalizePartName(styleRel.target)
        }
    };
}

/**
 * Lists diagram instances discoverable from the package graph.
 *
 * @param {DiagramPackageGraph} graph - Host-neutral parts + relationships.
 * @returns {ReadonlyArray<DiagramInstance>} Instances in stable order (first by source part name, then data part name).
 * @remarks
 * Discovery order:
 * 1. Complete `dgm:relIds` hooks in part XML (incomplete hooks skipped —
 *    preserve-on-load).
 * 2. Source parts with exactly one outbound relationship of each diagram type
 *    (when not already covered by a relIds binding).
 *
 * Layout part names used by more than one instance violate Part 1 §14.2.5;
 * each binding is still returned so callers can detect the clash.
 *
 * Partial graphs (missing target part, wrong content type, incomplete relIds)
 * do not throw; they simply omit that candidate. Explicit {@link parseDiagramRelIds}
 * and mutate APIs throw instead.
 * @public
 */
export function enumerateDiagramInstances(graph: DiagramPackageGraph): ReadonlyArray<DiagramInstance> {
    const map: Map<string, DiagramPackagePart> = buildPartMap(graph.parts);
    const byId: Map<string, DiagramInstance> = new Map<string, DiagramInstance>();

    // Path 1: relIds in part XML.
    for (const part of graph.parts) {
        const sourceName: string = normalizePartName(part.name);
        let hooks: ReadonlyArray<DiagramRelIds>;
        try {
            hooks = findDiagramRelIds(part.xml);
        } catch {
            // Malformed host XML — skip this part for discovery.
            continue;
        }
        if (hooks.length === 0) {
            continue;
        }
        const sourceRels: DiagramPackageRelationship[] = relationshipsFromSource(graph.relationships, sourceName);
        for (const relIds of hooks) {
            const inst: DiagramInstance = tryBindRelIds(map, sourceRels, sourceName, relIds);
            if (inst !== undefined && !byId.has(inst.id)) {
                byId.set(inst.id, inst);
            }
        }
    }

    // Path 2: relationship clustering by source (exactly one of each role).
    const sources: Set<string> = new Set<string>();
    for (const rel of graph.relationships) {
        if (rel.type === DIAGRAM_DATA_RELATIONSHIP_TYPE ||
            rel.type === DIAGRAM_LAYOUT_RELATIONSHIP_TYPE ||
            rel.type === DIAGRAM_QUICK_STYLE_RELATIONSHIP_TYPE ||
            rel.type === DIAGRAM_COLORS_RELATIONSHIP_TYPE) {
            sources.add(normalizePartName(rel.source));
        }
    }
    for (const sourceName of sources) {
        const sourceRels: DiagramPackageRelationship[] = relationshipsFromSource(graph.relationships, sourceName);
        const clustered: { relIds: DiagramRelIds; names: DiagramPartNames; } = clusterFromSourceRels(sourceRels);
        if (clustered === undefined) {
            continue;
        }
        try {
            const inst: DiagramInstance = instanceFromBinding(map, sourceName, clustered.relIds, clustered.names);
            if (!byId.has(inst.id)) {
                byId.set(inst.id, inst);
            }
        } catch {
            // Partial graph — skip.
        }
    }
    const list: DiagramInstance[] = [...byId.values()];
    list.sort((a: DiagramInstance, b: DiagramInstance) => {
        const s: number = a.sourcePartName.localeCompare(b.sourcePartName);
        if (s !== 0) {
            return s;
        }
        return a.id.localeCompare(b.id);
    });
    return list;
}

/**
 * Resolves a single diagram instance from the package graph.
 *
 * @param {DiagramPackageGraph} graph - Host-neutral parts + relationships.
 * @param {GetDiagramInstanceOptions} options - Match by {@link GetDiagramInstanceOptions.id} and/or
`dataPartName` (normalized). At least one matcher is required.
 * @returns {DiagramInstance | undefined} The instance, or `undefined` when not found.
 * @throws {DiagramPartError} When no matcher is provided.
 * @public
 */
export function getDiagramInstance(graph: DiagramPackageGraph, options: GetDiagramInstanceOptions): DiagramInstance | undefined {
    const idOpt: string = (options.id == null ? void 0 : options.id.trim());
    const dataOpt: string = (options.dataPartName == null ? void 0 : options.dataPartName.trim());
    if ((idOpt === undefined || idOpt.length === 0) && (dataOpt === undefined || dataOpt.length === 0)) {
        throw new DiagramPartError('getDiagramInstance requires options.id and/or options.dataPartName');
    }
    const wantId: string = idOpt !== undefined && idOpt.length > 0 ? normalizePartName(idOpt) : undefined;
    const wantData: string = dataOpt !== undefined && dataOpt.length > 0 ? normalizePartName(dataOpt) : undefined;
    const all: ReadonlyArray<DiagramInstance> = enumerateDiagramInstances(graph);
    for (const inst of all) {
        if (wantId !== undefined && inst.id !== wantId) {
            continue;
        }
        if (wantData !== undefined && inst.partNames.data !== wantData) {
            continue;
        }
        return inst;
    }
    return undefined;
}

/**
 * Lists package parts whose content type is one of the four diagram types.
 *
 * @param {DiagramPackageGraph} graph - Host-neutral package graph.
 * @returns {ReadonlyArray<DiagramPackagePart>} Matching parts in input order (names normalized on the returned copies).
 * @public
 */
export function listDiagramParts(graph: DiagramPackageGraph): ReadonlyArray<DiagramPackagePart> {
    const types: Set<string> = new Set<string>([
        DIAGRAM_DATA_CONTENT_TYPE,
        DIAGRAM_LAYOUT_CONTENT_TYPE,
        DIAGRAM_COLORS_CONTENT_TYPE,
        DIAGRAM_STYLE_CONTENT_TYPE
    ]);
    const out: DiagramPackagePart[] = [];
    for (const part of graph.parts) {
        if (types.has(part.contentType)) {
            out.push({
                name: normalizePartName(part.name),
                contentType: part.contentType,
                xml: part.xml
            });
        }
    }
    return out;
}
