/**
 * Create / remove DrawingML diagram instances on a host-neutral package graph.
 *
 * @remarks
 * - {@link createDiagramInstance}: factory per API-RULES R1.6 (not a banned
 *   content `add*` verb). Add algorithm in the SmartArt technical spec.
 * - {@link removeDiagramInstance}: content `remove*` verb (R1.1). Remove
 *   algorithm: delete four owned diagram parts, drop package-graph relationships
 *   targeting or sourced from those parts, and GC image targets from the Data
 *   part only when reference count across the graph becomes zero (Part 1 §14.2.4).
 *
 * Host must remove graphic-frame / `dgm:relIds` markup; this module never imports
 * PPT/Word/Excel product types.
 *
 * Citations: ECMA-376 Part 1 §14.2.3–14.2.6; Part 4 §12.2.3–12.2.6;
 * Part 4 Transitional `relationships/image`; `dml-diagram.xsd` `CT_RelIds`.
 * @public
 */

import { Literal } from '../../core/literal-type';
import { DiagramPartError } from './errors';
import { MINIMAL_DIAGRAM_COLORS_XML, MINIMAL_DIAGRAM_DATA_XML, MINIMAL_DIAGRAM_LAYOUT_XML, MINIMAL_DIAGRAM_STYLE_XML } from './minimal-samples';
import { DIAGRAM_COLORS_CONTENT_TYPE, DIAGRAM_COLORS_RELATIONSHIP_TYPE, DIAGRAM_DATA_CONTENT_TYPE, DIAGRAM_DATA_RELATIONSHIP_TYPE, DIAGRAM_GRAPHIC_DATA_URI, DIAGRAM_LAYOUT_CONTENT_TYPE, DIAGRAM_LAYOUT_RELATIONSHIP_TYPE, DIAGRAM_QUICK_STYLE_RELATIONSHIP_TYPE, DIAGRAM_STYLE_CONTENT_TYPE, OFFICE_IMAGE_RELATIONSHIP_TYPE } from './namespaces';
import { getDiagramInstance, normalizePartName } from './package-graph';
import { parseDiagramColors } from './parse-colors';
import { parseDiagramData } from './parse-data';
import { parseDiagramLayout } from './parse-layout';
import { parseDiagramStyle } from './parse-style';
import { CreateDiagramInstanceOptions, CreateDiagramInstanceResult, CreateDiagramInstanceSeeds, DiagramColorsPart, DiagramDataPart, DiagramInstance, DiagramLayoutPart, DiagramPackageGraph, DiagramPackagePart, DiagramPackageRelationship, DiagramPartNames, DiagramRelIds, DiagramStylePart, RemoveDiagramInstanceOptions, RemoveDiagramInstanceResult } from './types';
const DEFAULT_PART_PREFIX: Literal<'/diagrams'> = '/diagrams';
/**
 * The require non empty xml.
 *
 * @param {string} label - The label.
 * @param {string | undefined} xml - The xml.
 * @param {string} fallback - The fallback.
 * @returns {string} The result.
 */
function requireNonEmptyXml(label: string, xml: string | undefined, fallback: string): string {
    if (xml === undefined) {
        return fallback;
    }
    if (xml.trim().length === 0) {
        throw new DiagramPartError(`createDiagramInstance: seeds.${label} must be non-empty XML when provided`);
    }
    return xml;
}
/**
 * The resolve seeds.
 *
 * @param {CreateDiagramInstanceSeeds | undefined} seeds - The seeds.
 * @returns {object} The result.
 */
function resolveSeeds(seeds: CreateDiagramInstanceSeeds | undefined): {
    readonly dataXml: string;
    readonly layoutXml: string;
    readonly colorsXml: string;
    readonly styleXml: string;
} {
    const s: CreateDiagramInstanceSeeds = seeds != null ? seeds : {};
    return {
        dataXml: requireNonEmptyXml('dataXml', s.dataXml, MINIMAL_DIAGRAM_DATA_XML),
        layoutXml: requireNonEmptyXml('layoutXml', s.layoutXml, MINIMAL_DIAGRAM_LAYOUT_XML),
        colorsXml: requireNonEmptyXml('colorsXml', s.colorsXml, MINIMAL_DIAGRAM_COLORS_XML),
        styleXml: requireNonEmptyXml('styleXml', s.styleXml, MINIMAL_DIAGRAM_STYLE_XML)
    };
}
/**
 * The parse validated seeds.
 *
 * @param {object} resolved - The resolved.
 * @returns {object} The result.
 */
function parseValidatedSeeds(resolved: {
    readonly dataXml: string;
    readonly layoutXml: string;
    readonly colorsXml: string;
    readonly styleXml: string;
}): {
        readonly data: DiagramDataPart;
        readonly layout: DiagramLayoutPart;
        readonly colors: DiagramColorsPart;
        readonly style: DiagramStylePart;
        readonly dataXml: string;
        readonly layoutXml: string;
        readonly colorsXml: string;
        readonly styleXml: string;
    } {
    // Parse before any graph mutation — incomplete seeds must not write parts.
    let data: DiagramDataPart;
    let layout: DiagramLayoutPart;
    let colors: DiagramColorsPart;
    let style: DiagramStylePart;
    try {
        data = parseDiagramData(resolved.dataXml);
    } catch (e) {
        const msg: string = e instanceof Error ? e.message : String(e);
        throw new DiagramPartError(`createDiagramInstance: invalid data seed: ${msg}`);
    }
    try {
        layout = parseDiagramLayout(resolved.layoutXml);
    } catch (e) {
        const msg: string = e instanceof Error ? e.message : String(e);
        throw new DiagramPartError(`createDiagramInstance: invalid layout seed: ${msg}`);
    }
    try {
        colors = parseDiagramColors(resolved.colorsXml);
    } catch (e) {
        const msg: string = e instanceof Error ? e.message : String(e);
        throw new DiagramPartError(`createDiagramInstance: invalid colors seed: ${msg}`);
    }
    try {
        style = parseDiagramStyle(resolved.styleXml);
    } catch (e) {
        const msg: string = e instanceof Error ? e.message : String(e);
        throw new DiagramPartError(`createDiagramInstance: invalid style seed: ${msg}`);
    }
    return {
        data,
        layout,
        colors,
        style,
        dataXml: resolved.dataXml,
        layoutXml: resolved.layoutXml,
        colorsXml: resolved.colorsXml,
        styleXml: resolved.styleXml
    };
}
/**
 * The occupied part names.
 *
 * @param {ReadonlyArray<DiagramPackagePart>} parts - The parts.
 * @returns {Set<string>} The result.
 */
function occupiedPartNames(parts: ReadonlyArray<DiagramPackagePart>): Set<string> {
    const set: Set<string> = new Set<string>();
    for (const p of parts) {
        set.add(normalizePartName(p.name));
    }
    return set;
}
/**
 * The normalize prefix.
 *
 * @param {string | undefined} prefix - The prefix.
 * @returns {string} The result.
 */
function normalizePrefix(prefix: string | undefined): string {
    const raw: string = prefix === undefined || prefix.trim().length === 0 ? DEFAULT_PART_PREFIX : prefix;
    let p: string = normalizePartName(raw);
    // Drop trailing slash for join consistency (normalizePartName keeps leading /).
    if (p.length > 1 && p.endsWith('/')) {
        p = p.slice(0, -1);
    }
    return p;
}
/**
 * The allocate part names.
 *
 * @param {Set<string>} existing - The existing.
 * @param {string} prefix - The prefix.
 * @returns {DiagramPartNames} The result.
 */
function allocatePartNames(existing: Set<string>, prefix: string): DiagramPartNames {
    let n: number = 1;
    for (;;) {
        const suffix: string = String(n);
        const data: string = `${prefix}/data${suffix}.xml`;
        const layout: string = `${prefix}/layout${suffix}.xml`;
        const colors: string = `${prefix}/colors${suffix}.xml`;
        const style: string = `${prefix}/quickStyle${suffix}.xml`;
        if (!existing.has(data) && !existing.has(layout) && !existing.has(colors) && !existing.has(style)) {
            return {
                data,
                layout,
                colors,
                style
            };
        }
        n += 1;
        if (n > 1000000) {
            throw new DiagramPartError('createDiagramInstance: could not allocate unique part names');
        }
    }
}

/**
 * Collect relationship ids already used from a given source (and globally when
 * source is empty — still avoid id collisions in the graph slice).
 *
 * @param {ReadonlyArray<DiagramPackageRelationship>} relationships - The relationships.
 * @param {string | undefined} sourceNorm - The source norm.
 * @returns {Set<string>} The result.
 */
function usedRelationshipIds(relationships: ReadonlyArray<DiagramPackageRelationship>, sourceNorm: string | undefined): Set<string> {
    const used: Set<string> = new Set<string>();
    for (const rel of relationships) {
        if (sourceNorm !== undefined) {
            if (normalizePartName(rel.source) !== sourceNorm) {
                continue;
            }
        }
        used.add(rel.id);
    }
    // Also avoid any id already present in the graph (OPC ids are unique per .rels).
    for (const rel of relationships) {
        used.add(rel.id);
    }
    return used;
}
/**
 * The allocate rel ids.
 *
 * @param {Set<string>} used - The used.
 * @returns {DiagramRelIds} The result.
 */
function allocateRelIds(used: Set<string>): DiagramRelIds {
    let n: number = 1;
    const take: () => string = (): string => {
        for (;;) {
            const id: string = `rId${String(n)}`;
            n += 1;
            if (!used.has(id)) {
                used.add(id);
                return id;
            }
            if (n > 1000000) {
                throw new DiagramPartError('createDiagramInstance: could not allocate relationship ids');
            }
        }
    };
    return {
        dm: take(),
        lo: take(),
        qs: take(),
        cs: take()
    };
}

/**
 * Creates a new diagram instance: four package parts (exactly one of each type),
 * optional source relationships, and a graphic-frame hook DTO.
 *
 * @param {DiagramPackageGraph} graph - Existing host-neutral package graph (not mutated).
 * @param {CreateDiagramInstanceOptions} options - Seeds, optional source part name, optional part name prefix.
 * @returns {CreateDiagramInstanceResult} Updated graph, bound instance, and hook for host markup.
 * @throws {DiagramPartError} When any seed is empty or fails parse — before writing parts.
 * @public
 */
export function createDiagramInstance(graph: DiagramPackageGraph, options: CreateDiagramInstanceOptions = {}): CreateDiagramInstanceResult {
    const resolved: {
        readonly dataXml: string;
        readonly layoutXml: string;
        readonly colorsXml: string;
        readonly styleXml: string;
    } = resolveSeeds(options.seeds);
    const parsed: {
        readonly data: DiagramDataPart;
        readonly layout: DiagramLayoutPart;
        readonly colors: DiagramColorsPart;
        readonly style: DiagramStylePart;
        readonly dataXml: string;
        readonly layoutXml: string;
        readonly colorsXml: string;
        readonly styleXml: string;
    } = parseValidatedSeeds(resolved);
    const prefix: string = normalizePrefix(options.partNamePrefix);
    const occupied: Set<string> = occupiedPartNames(graph.parts);
    const partNames: DiagramPartNames = allocatePartNames(occupied, prefix);
    const sourceRaw: string = (options.sourcePartName == null ? void 0 : options.sourcePartName.trim());
    const sourcePartName: string = sourceRaw !== undefined && sourceRaw.length > 0 ? normalizePartName(sourceRaw) : '';
    const usedIds: Set<string> = usedRelationshipIds(graph.relationships, sourcePartName.length > 0 ? sourcePartName : undefined);
    const relIds: DiagramRelIds = allocateRelIds(usedIds);
    const newParts: DiagramPackagePart[] = [{
        name: partNames.data,
        contentType: DIAGRAM_DATA_CONTENT_TYPE,
        xml: parsed.dataXml
    }, {
        name: partNames.layout,
        contentType: DIAGRAM_LAYOUT_CONTENT_TYPE,
        xml: parsed.layoutXml
    }, {
        name: partNames.colors,
        contentType: DIAGRAM_COLORS_CONTENT_TYPE,
        xml: parsed.colorsXml
    }, {
        name: partNames.style,
        contentType: DIAGRAM_STYLE_CONTENT_TYPE,
        xml: parsed.styleXml
    }];
    const newRels: DiagramPackageRelationship[] = [];
    if (sourcePartName.length > 0) {
        newRels.push({
            id: relIds.dm,
            type: DIAGRAM_DATA_RELATIONSHIP_TYPE,
            target: partNames.data,
            source: sourcePartName
        }, {
            id: relIds.lo,
            type: DIAGRAM_LAYOUT_RELATIONSHIP_TYPE,
            target: partNames.layout,
            source: sourcePartName
        }, {
            id: relIds.qs,
            type: DIAGRAM_QUICK_STYLE_RELATIONSHIP_TYPE,
            target: partNames.style,
            source: sourcePartName
        }, {
            id: relIds.cs,
            type: DIAGRAM_COLORS_RELATIONSHIP_TYPE,
            target: partNames.colors,
            source: sourcePartName
        });
    }
    const nextGraph: DiagramPackageGraph = {
        parts: [...graph.parts, ...newParts],
        relationships: [...graph.relationships, ...newRels]
    };
    const instance: DiagramInstance = {
        id: partNames.data,
        data: parsed.data,
        layout: parsed.layout,
        colors: parsed.colors,
        style: parsed.style,
        relIds,
        partNames,
        sourcePartName
    };
    return {
        graph: nextGraph,
        instance,
        hook: {
            graphicDataUri: DIAGRAM_GRAPHIC_DATA_URI,
            relIds
        }
    };
}
/**
 * The part names set.
 *
 * @param {DiagramPartNames} names - The names.
 * @returns {Set<string>} The result.
 */
function partNamesSet(names: DiagramPartNames): Set<string> {
    return new Set([
        normalizePartName(names.data),
        normalizePartName(names.layout),
        normalizePartName(names.colors),
        normalizePartName(names.style)
    ]);
}

/**
 * Validates that each claimed diagram part exists with a diagram content type.
 * Rejects forged ids that would delete non-diagram package parts.
 *
 * @param {DiagramPackageGraph} graph - The graph.
 * @param {DiagramPartNames} names - The names.
 * @returns {DiagramPartNames} The result.
 */
function requireOwnedDiagramParts(graph: DiagramPackageGraph, names: DiagramPartNames): DiagramPartNames {
    const byName: Map<string, DiagramPackagePart> = new Map<string, DiagramPackagePart>();
    for (const part of graph.parts) {
        byName.set(normalizePartName(part.name), part);
    }
    const roles: ReadonlyArray<{
        readonly role: 'data' | 'layout' | 'colors' | 'style';
        readonly name: string;
        readonly expected: string;
    }> = [{
        role: 'data',
        name: names.data,
        expected: DIAGRAM_DATA_CONTENT_TYPE
    }, {
        role: 'layout',
        name: names.layout,
        expected: DIAGRAM_LAYOUT_CONTENT_TYPE
    }, {
        role: 'colors',
        name: names.colors,
        expected: DIAGRAM_COLORS_CONTENT_TYPE
    }, {
        role: 'style',
        name: names.style,
        expected: DIAGRAM_STYLE_CONTENT_TYPE
    }];
    const resolved: {
        data?: string;
        layout?: string;
        colors?: string;
        style?: string;
    } = {};
    for (const {
        role,
        name,
        expected
    } of roles) {
        const key: string = normalizePartName(name);
        const part: DiagramPackagePart = byName.get(key);
        if (part === undefined) {
            throw new DiagramPartError(`removeDiagramInstance: diagram ${role} part not found: ${key}`);
        }
        if (part.contentType !== expected) {
            throw new DiagramPartError(`removeDiagramInstance: refused to delete non-diagram part ${key} ` + `(content type ${part.contentType}, expected ${expected})`);
        }
        switch (role) {
        case 'data':
            resolved.data = key;
            break;
        case 'layout':
            resolved.layout = key;
            break;
        case 'colors':
            resolved.colors = key;
            break;
        case 'style':
            resolved.style = key;
            break;
        }
    }
    const data: string = resolved.data;
    const layout: string = resolved.layout;
    const colors: string = resolved.colors;
    const style: string = resolved.style;
    if (data === undefined || layout === undefined || colors === undefined || style === undefined) {
        throw new DiagramPartError('removeDiagramInstance: incomplete diagram part set');
    }
    return {
        data,
        layout,
        colors,
        style
    };
}
/**
 * The resolve instance for remove.
 *
 * @param {DiagramPackageGraph} graph - The graph.
 * @param {RemoveDiagramInstanceOptions} options - The options.
 * @returns {DiagramPartNames} The result.
 */
function resolveInstanceForRemove(graph: DiagramPackageGraph, options: RemoveDiagramInstanceOptions): DiagramPartNames {
    const hasInstance: boolean = options.instance !== undefined;
    const idRaw: string = (options.id == null ? void 0 : options.id.trim());
    const dataRaw: string = (options.dataPartName == null ? void 0 : options.dataPartName.trim());
    const hasId: boolean = idRaw !== undefined && idRaw.length > 0;
    const hasData: boolean = dataRaw !== undefined && dataRaw.length > 0;
    if (!hasInstance && !hasId && !hasData) {
        throw new DiagramPartError('removeDiagramInstance requires options.instance and/or options.id and/or options.dataPartName');
    }
    if (hasInstance) {
        const inst: DiagramInstance = options.instance;
        // Prefer live graph binding when id/data matchers are also supplied.
        if (hasId || hasData) {
            const lookup: {
                id?: string;
                dataPartName?: string;
            } = {};
            if (hasId) {
                lookup.id = idRaw;
            }
            lookup.dataPartName = hasData ? dataRaw : inst.partNames.data;
            const found: DiagramInstance = getDiagramInstance(graph, lookup);
            if (found === undefined) {
                throw new DiagramPartError('removeDiagramInstance: no diagram instance matches the given id/dataPartName');
            }
            if (normalizePartName(found.partNames.data) !== normalizePartName(inst.partNames.data)) {
                throw new DiagramPartError('removeDiagramInstance: options.instance does not match id/dataPartName');
            }
            return requireOwnedDiagramParts(graph, found.partNames);
        }
        return requireOwnedDiagramParts(graph, inst.partNames);
    }
    const lookup: {
        id?: string;
        dataPartName?: string;
    } = {};
    if (hasId) {
        lookup.id = idRaw;
    }
    if (hasData) {
        lookup.dataPartName = dataRaw;
    }
    const found: DiagramInstance = getDiagramInstance(graph, lookup);
    if (found === undefined) {
        throw new DiagramPartError('removeDiagramInstance: unknown diagram instance (no match for id/dataPartName)');
    }
    return requireOwnedDiagramParts(graph, found.partNames);
}

/**
 * Image part names referenced only from the Data part’s outbound image rels
 * that should be deleted after the Data part is removed (ref-count → 0).
 *
 * @param {ReadonlyArray<DiagramPackageRelationship>} relationships - The relationships.
 * @param {string} dataPartName - The data part name.
 * @param {ReadonlySet<string>} diagramParts - The diagram parts.
 * @returns {string[]} The result.
 */
function exclusiveImageTargets(
    relationships: ReadonlyArray<DiagramPackageRelationship>,
    dataPartName: string,
    diagramParts: ReadonlySet<string>
): string[] {
    const dataKey: string = normalizePartName(dataPartName);
    const candidates: Set<string> = new Set<string>();
    for (const rel of relationships) {
        if (rel.type !== OFFICE_IMAGE_RELATIONSHIP_TYPE) {
            continue;
        }
        if (normalizePartName(rel.source) !== dataKey) {
            continue;
        }
        const target: string = normalizePartName(rel.target);
        // Never treat a diagram part name as an image GC target.
        if (diagramParts.has(target)) {
            continue;
        }
        candidates.add(target);
    }
    const exclusive: string[] = [];
    for (const target of candidates) {
    // After Data-part (and other deleted diagram) outbound edges are dropped,
    // count surviving image edges from sources outside the deleted set.
        let surviving: number = 0;
        for (const rel of relationships) {
            if (rel.type !== OFFICE_IMAGE_RELATIONSHIP_TYPE) {
                continue;
            }
            if (normalizePartName(rel.target) !== target) {
                continue;
            }
            const src: string = normalizePartName(rel.source);
            if (src === dataKey || diagramParts.has(src)) {
                continue;
            }
            surviving += 1;
        }
        if (surviving === 0) {
            exclusive.push(target);
        }
    }
    return exclusive;
}

/**
 * Removes a diagram instance from a host-neutral package graph.
 *
 * @param {DiagramPackageGraph} graph - Current package graph (not mutated).
 * @param {RemoveDiagramInstanceOptions} options - Instance handle and/or id / dataPartName matchers.
 * @returns {RemoveDiagramInstanceResult} Updated graph and list of removed part names.
 * @remarks
 * Implements the Remove algorithm in `docs/specs/smart-art-shared-common.md`:
 * 1. Resolve four owned diagram part names (from `instance` and/or id matchers).
 * 2. Collect Data-part outbound {@link OFFICE_IMAGE_RELATIONSHIP_TYPE} targets;
 *    delete image parts only when no remaining graph relationship (outside the
 *    deleted diagram parts) still references them (Part 1 §14.2.4).
 * 3. Delete the four diagram parts (content-type entries travel with parts on
 *    this host-neutral graph).
 * 4. Delete relationships that target any removed part, or whose source is one
 *    of the four diagram parts.
 * 5. Host graphic-frame / `dgm:relIds` XML cleanup remains the host’s duty.
 *
 * Unknown instance id throws {@link DiagramPartError} (explicit mutate policy).
 * Input `graph` is never mutated. Part names that do not carry diagram content
 * types are refused (forged-id safety).
 * @throws {DiagramPartError} When matchers are missing, the instance is unknown,
 *   or claimed part names are not owned diagram parts.
 * @public
 */
export function removeDiagramInstance(graph: DiagramPackageGraph, options: RemoveDiagramInstanceOptions): RemoveDiagramInstanceResult {
    const partNames: DiagramPartNames = resolveInstanceForRemove(graph, options);
    const diagramParts: Set<string> = partNamesSet(partNames);
    const imageGc: string[] = exclusiveImageTargets(graph.relationships, partNames.data, diagramParts);
    const removeParts: Set<string> = new Set<string>([...diagramParts, ...imageGc]);
    const nextParts: DiagramPackagePart[] = graph.parts.filter((p: DiagramPackagePart) => !removeParts.has(normalizePartName(p.name)));
    const nextRels: DiagramPackageRelationship[] = graph.relationships.filter((r: DiagramPackageRelationship) => {
        const src: string = normalizePartName(r.source);
        const tgt: string = normalizePartName(r.target);
        if (removeParts.has(tgt)) {
            return false;
        }
        if (diagramParts.has(src)) {
            return false;
        }
        return true;
    });
    const removedPartNames: string[] = [...removeParts].sort((a: string, b: string) => a.localeCompare(b));
    return {
        graph: {
            parts: nextParts,
            relationships: nextRels
        },
        removedPartNames
    };
}
