import { arrayAt } from '../../core/util/es5-compat';
/**
 * Resolve a slide `graphicFrame` chart hook to a host {@link ChartInstance}.
 *
 * @remarks
 * Detection path (spec 037 / TASK-1067):
 * `graphicFrame` → `a:graphic` → `a:graphicData` with chart URI → `c:chart`
 * (`r:id`) → source-part relationship → chart part → optional child rels →
 * ej2-xlsx `parseChartSpace` (async load of xlsx root).
 *
 * Incomplete hooks soft-skip on {@link enumerateDocumentCharts}. Explicit
 * {@link asChart} / {@link resolveChart} throw {@link Error} when the
 * frame is a chart hook but structure fails. Non-chart shapes yield
 * `undefined` from {@link asChart}.
 *
 * Host keeps {@link ChartInstance.originalXml} for true no-op preserve when
 * the engine does not return `preservedChartXml` (req 022). Nested embeddings
 * are listed via relationships but **not** opened.
 *
 * Citations: ECMA-376-1 chart part + `c:chart` hook; Part 4 chart
 * relationship; DRAWINGML_CHART_URI; ADR 2026-09-18.
 */
import { Presentation } from '../../core/package/index';
import { OFFICE_REL_ATTR_NS } from '../../core/presentation/constants';
import { DML_NS } from '../../core/shapes/constants';
import { findChild, getAttr } from '../../core/shapes/dom-utils';
import { Shape } from '../../core/shapes/shape';
import { OoxmlElement, OoxmlText } from '../../core/xml/dom';
import { CHART_COLOR_STYLE_RELATIONSHIP_TYPE, CHART_RELATIONSHIP_TYPE, CHART_STYLE_RELATIONSHIP_TYPE,
    CHART_USER_SHAPES_RELATIONSHIP_TYPE, DRAWINGML_CHART_URI, EMBEDDED_PACKAGE_RELATIONSHIP_TYPE } from './constants';
import { ChartsError, partNameOptions } from './errors';
import { buildChartPackageGraph, ChartPackageGraph, ChartPackageRelationship } from './package-graph';
import { getXlsxChartHostApi, ChartDataSource, ParsedChartSpace, XlsxChartHostApi } from './xlsx-chart-api';
import { getCachedXlsxRoot, loadXlsxRoot, Ej2XlsxRootModule } from './xlsx-surface';
import { PackageRelationship } from '../../core/package/relationships';
import { PackagePart } from '../../core/package/package-model';
import { Slide } from 'src/pptx/core/slideimplementation/slide';
const utf8: TextDecoder = new TextDecoder('utf-8');
/**
 * Host classification of optional chart-part child relationships.
 *
 * @remarks
 * Known kinds cite ECMA-376 / [MS-ODRAWXML]; `unknown` covers any other
 * internal child (still listed for preserve).
 *
 * @public
 */
export type ChartRelatedKind = 'userShapes' | 'colorStyle' | 'style' | 'embeddedPackage' | 'unknown';
/**
 * One related part hanging off the chart part (userShapes, style, embedding, …).
 *
 * @public
 */
export interface ChartRelatedPart {
    /** Relationship id on the chart part. */
    readonly relationshipId: string;
    /** Relationship type URI. */
    readonly relationshipType: string;
    /** Absolute target part name when internal. */
    readonly targetPartName: string;
    /** Content type when the target part exists. */
    readonly contentType: string | undefined;
    /**
     * Host classification of known optional chart children; `unknown` for
     * anything else (still preserved in the package graph).
     */
    readonly kind: ChartRelatedKind;
}
/**
 * Host-held classic chart binding (TASK-1067 read model; TASK-1068 collection).
 *
 * @remarks
 * Bound instances back {@link Chart} handles on `slide.charts`. Carries original
 * chart part XML for preserve-on-load and the engine parse result for read APIs.
 *
 * @public
 */
export interface ChartInstance {
    /** Live source paint edits require preservation through later engine exports. @internal */
    readonly sourcePaintAuthored?: boolean;
    /** Absolute chart part name (`/ppt/charts/chartN.xml`). */
    readonly partName: string;
    /** Absolute source part that owns the graphicFrame relationship (usually a slide). */
    readonly sourcePartName: string;
    /** Relationship id from `c:chart/@r:id` on the source part. */
    readonly relationshipId: string;
    /** Chart part content type when known. */
    readonly contentType: string | undefined;
    /** Original chart part bytes decoded as UTF-8 (preserve authority). */
    readonly originalXml: string;
    /**
     * Engine parse of `c:chartSpace`. May omit unrecognized markup unless
     * `preservedChartXml` is set — prefer {@link ChartInstance.originalXml}
     * for no-op identity writes.
     */
    readonly parsed: ParsedChartSpace;
    /** Internal relationships whose source is this chart part. */
    readonly relatedParts: ReadonlyArray<ChartRelatedPart>;
    /** Optional shape handle when resolved from a graphicFrame walk. */
    readonly shape: Shape | undefined;
}
/**
 * Returns whether `shape` is a chart `graphicFrame` with chart URI.
 *
 * @param {Shape} shape - Shape handle from the slide walk.
 * @returns {boolean} `true` when element is `graphicFrame` and graphicData URI matches chart.
 */
function isChartGraphicFrame(shape: Shape): boolean {
    if (shape.elementKind !== 'graphicFrame') {
        return false;
    }
    const frame: OoxmlElement = shape.getElement();
    const graphic: OoxmlElement = findChild(frame, DML_NS, 'graphic');
    if (graphic === undefined) {
        return false;
    }
    const graphicData: OoxmlElement = findChild(graphic, DML_NS, 'graphicData');
    if (graphicData === undefined) {
        return false;
    }
    return getAttr(graphicData, '', 'uri') === DRAWINGML_CHART_URI;
}
/**
 * Locates `a:graphicData` under a chart graphic frame.
 *
 * @param {Shape} shape - The shape value.
 * @returns {OoxmlElement | undefined} The result.
 */
function graphicDataElement(shape: Shape): OoxmlElement | undefined {
    const frame: OoxmlElement = shape.getElement();
    const graphic: OoxmlElement = findChild(frame, DML_NS, 'graphic');
    if (graphic === undefined) {
        return undefined;
    }
    return findChild(graphic, DML_NS, 'graphicData');
}
/**
 * Finds `c:chart` under graphicData (DrawingML chart namespace).
 *
 * @remarks Citation: ECMA-376 chart hook element `c:chart` with `r:id` under `a:graphicData` whose `@uri` is the chart URI.
 * @param {OoxmlElement} graphicData - The graphicData value.
 * @returns {OoxmlElement | undefined} The result.
 */
function findChartHookElement(graphicData: OoxmlElement): OoxmlElement | undefined {
    for (let i: number = 0; i < graphicData.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(graphicData.children, i);
        if (child.kind === 'element' &&
            child.localName === 'chart' &&
            child.namespaceUri === DRAWINGML_CHART_URI) {
            return child;
        }

    }
    return undefined;
}
/**
 * Reads required `r:id` from `c:chart`.
 *
 * @param {Shape} shape - The shape value.
 * @returns {string} The result.
 */
function parseChartRelationshipId(shape: Shape): string {
    const graphicData: OoxmlElement = graphicDataElement(shape);
    if (graphicData === undefined) {
        throw new ChartsError('Chart graphicFrame is missing a:graphicData', partNameOptions(shape.getPartName()));
    }
    const chartEl: OoxmlElement = findChartHookElement(graphicData);
    if (chartEl === undefined) {
        throw new ChartsError('Chart graphicFrame has no c:chart hook under a:graphicData', partNameOptions(shape.getPartName()));
    }
    const relId: string = getAttr(chartEl, OFFICE_REL_ATTR_NS, 'id');
    if (relId === undefined || relId.length === 0) {
        throw new ChartsError('Chart c:chart is missing required r:id', partNameOptions(shape.getPartName()));
    }
    return relId;
}
/**
 * Resolves a relationship id on the shape's source part to an absolute target name.
 *
 * @param {Presentation} document - The document value.
 * @param {string} sourcePartName - The sourcePartName value.
 * @param {string} relId - The relId value.
 * @returns {string} The result.
 */
function resolveRelTarget(document: Presentation, sourcePartName: string, relId: string): string {
    const rels: ReadonlyArray<PackageRelationship> = document.getRelationships(sourcePartName);
    const match: PackageRelationship = rels.find((r: PackageRelationship) => r.id === relId);
    if (match === undefined) {
        throw new ChartsError(`Chart relationship "${relId}" is missing on source part`, { partName: sourcePartName });
    }
    if (match.targetMode === 'External' || match.targetPartName === undefined) {
        throw new ChartsError(`Chart relationship "${relId}" must be an internal package target`, { partName: sourcePartName });
    }
    // Prefer chart relationship type when present; still accept internal targets
    // if type differs (preserve exotic hosts) but record via ChartsError only on structural miss.
    if (match.type.length > 0 &&
        match.type !== CHART_RELATIONSHIP_TYPE &&
        !match.type.endsWith('/chart')) {
        // Soft note: still resolve — transitional + purl variants both end with /chart.
    }
    return match.targetPartName;
}
/**
 * Classifies a chart-part child relationship type.
 *
 * @param {string} relationshipType - The relationshipType value.
 * @returns {ChartRelatedKind} The result.
 */
function classifyRelatedKind(relationshipType: string): ChartRelatedKind {
    if (relationshipType === CHART_USER_SHAPES_RELATIONSHIP_TYPE) {
        return 'userShapes';
    }
    if (relationshipType === CHART_COLOR_STYLE_RELATIONSHIP_TYPE) {
        return 'colorStyle';
    }
    if (relationshipType === CHART_STYLE_RELATIONSHIP_TYPE) {
        return 'style';
    }
    if (relationshipType === EMBEDDED_PACKAGE_RELATIONSHIP_TYPE) {
        return 'embeddedPackage';
    }
    return 'unknown';
}
/**
 * Lists internal relationships whose source is the chart part.
 *
 * @param {Presentation} document - The document value.
 * @param {string} chartPartName - The chartPartName value.
 * @returns {*} The result.
 */
function listRelatedParts(document: Presentation, chartPartName: string): ReadonlyArray<ChartRelatedPart> {
    const out: ChartRelatedPart[] = [];
    const relationships: ReadonlyArray<PackageRelationship> = document.getRelationships(chartPartName);
    for (let i: number = 0; i < relationships.length; i++) {
        const rel: PackageRelationship = arrayAt(relationships, i);
        if (rel.targetMode === 'External') {
            continue;
        }
        const target: string = rel.targetPartName;
        if (target === undefined) {
            continue;
        }
        const part: PackagePart = document.getPart(target);
        out.push({
            relationshipId: rel.id,
            relationshipType: rel.type,
            targetPartName: target,
            contentType: (part == null ? undefined : part.contentType),
            kind: classifyRelatedKind(rel.type)
        });

    }
    return out;
}
/**
 * Builds a {@link ChartInstance} after structural resolution succeeds (sync parse).
 *
 * @remarks Requires a warmed xlsx root ({@link loadXlsxRoot} / feature activate). Used by both async resolve and the synchronous
 * `slide.charts` materializer (TASK-1068).
 * @param {Presentation} document - The document value.
 * @param {string} sourcePartName - The sourcePartName value.
 * @param {string} relationshipId - The relationshipId value.
 * @param {string} chartPartName - The chartPartName value.
 * @param {Shape | undefined} shape - The shape value.
 * @param {*} api - The api value.
 * @returns {ChartInstance} The result.
 */
function bindChartInstanceWithApi(document: Presentation, sourcePartName: string, relationshipId: string, chartPartName: string,
                                  shape: Shape | undefined, api: ReturnType<typeof getXlsxChartHostApi>): ChartInstance {
    const part: PackagePart = document.getPart(chartPartName);
    if (part === undefined) {
        throw new ChartsError(`Chart part is missing: ${chartPartName}`, {
            partName: chartPartName
        });
    }
    const originalXml: string = utf8.decode(part.data);
    const parsed: ParsedChartSpace = api.parseChartSpace(originalXml, undefined, chartPartName);
    if (parsed === undefined) {
        throw new ChartsError(`parseChartSpace returned undefined for chart part ${chartPartName}`, { partName: chartPartName });
    }
    return {
        partName: chartPartName,
        sourcePartName,
        relationshipId,
        contentType: part.contentType,
        originalXml,
        parsed,
        relatedParts: listRelatedParts(document, chartPartName),
        shape
    };
}
/**
 * Builds a {@link ChartInstance} after structural resolution succeeds.
 *
 * @param {Presentation} document - The document value.
 * @param {string} sourcePartName - The sourcePartName value.
 * @param {string} relationshipId - The relationshipId value.
 * @param {string} chartPartName - The chartPartName value.
 * @param {Shape | undefined} shape - The shape value.
 * @returns {*} The result.
 */
async function bindChartInstance(document: Presentation, sourcePartName: string, relationshipId: string, chartPartName: string,
                                 shape: Shape | undefined): Promise<ChartInstance> {
    const xlsx: Ej2XlsxRootModule = await loadXlsxRoot();
    const api: XlsxChartHostApi = getXlsxChartHostApi(xlsx);
    return bindChartInstanceWithApi(document, sourcePartName, relationshipId, chartPartName, shape, api);
}
/**
 * Synchronous bind when the xlsx root is already cached (TASK-1068).
 *
 * @throws {Error} When the xlsx root is not warmed or binding fails.
 * @param {Presentation} document - The document value.
 * @param {string} sourcePartName - The sourcePartName value.
 * @param {string} relationshipId - The relationshipId value.
 * @param {string} chartPartName - The chartPartName value.
 * @param {Shape | undefined} shape - The shape value.
 * @returns {ChartInstance} The result.
 */
function bindChartInstanceSync(document: Presentation, sourcePartName: string, relationshipId: string, chartPartName: string,
                               shape: Shape | undefined): ChartInstance {
    const xlsx: Ej2XlsxRootModule = getCachedXlsxRoot();
    if (xlsx === undefined) {
        throw new ChartsError('ej2-xlsx root is not loaded; await loadXlsxRoot() or ensureFeature(CHARTS_FEATURE_ID) before slide.charts');
    }
    const api: XlsxChartHostApi = getXlsxChartHostApi(xlsx);
    return bindChartInstanceWithApi(document, sourcePartName, relationshipId, chartPartName, shape, api);
}
/**
 * Binds a {@link ChartInstance} when `shape` is a chart graphic frame.
 *
 * @throws {Error} When the frame is a chart hook but the relationship, part, or parse fails.
 * @remarks Async because ej2-xlsx is loaded via dynamic import ({@link loadXlsxRoot}). Non-chart shapes return `undefined` (same pattern as
 * `asDiagram`).
 * @public
 * @param {Shape} shape - Shape from the slide/group walk.
 * @param {Presentation} document - Open presentation providing package parts and relationships.
 * @returns {*} Bound instance, or `undefined` when the shape is not a chart frame.
 */
export async function asChart(shape: Shape, document: Presentation): Promise<ChartInstance | undefined> {
    if (!isChartGraphicFrame(shape)) {
        return undefined;
    }
    return resolveChart(shape, document);
}
/**
 * Resolves a chart graphic frame to a {@link ChartInstance} (throws on failure).
 *
 * @throws {Error} When not a chart frame or binding fails.
 * @public
 * @param {Shape} shape - Shape that must be a chart `graphicFrame`.
 * @param {Presentation} document - Open presentation.
 * @returns {*} Bound chart instance with parse result and related-part list.
 */
export async function resolveChart(shape: Shape, document: Presentation): Promise<ChartInstance> {
    if (!isChartGraphicFrame(shape)) {
        throw new ChartsError('Shape is not a DrawingML chart graphicFrame', partNameOptions(shape.getPartName()));
    }
    const sourcePartName: string = shape.getPartName();
    if (sourcePartName === undefined || sourcePartName.length === 0) {
        throw new ChartsError('Chart shape has no source part name');
    }
    const relationshipId: string = parseChartRelationshipId(shape);
    const chartPartName: string = resolveRelTarget(document, sourcePartName, relationshipId);
    return bindChartInstance(document, sourcePartName, relationshipId, chartPartName, shape);
}
/**
 * Synchronous chart bind for warmed xlsx (TASK-1068 `slide.charts`).
 *
 * @throws {Error} When the frame is a chart hook but bind fails, or when the xlsx root is not yet cached.
 * @remarks Mirrors {@link asChart} without async import. Callers that soft-skip must catch {@link Error}. Prefer warming via `await
 * loadXlsxRoot()` or `await ensureFeature(CHARTS_FEATURE_ID)` first.
 * @internal
 * @param {Shape} shape - Shape from the slide walk.
 * @param {Presentation} document - Open presentation.
 * @returns {ChartInstance | undefined} Bound instance, or `undefined` when the shape is not a chart frame.
 */
export function asChartSync(shape: Shape, document: Presentation): ChartInstance | undefined {
    if (!isChartGraphicFrame(shape)) {
        return undefined;
    }
    const sourcePartName: string = shape.getPartName();
    if (sourcePartName === undefined || sourcePartName.length === 0) {
        throw new ChartsError('Chart shape has no source part name');
    }
    const relationshipId: string = parseChartRelationshipId(shape);
    const chartPartName: string = resolveRelTarget(document, sourcePartName, relationshipId);
    return bindChartInstanceSync(document, sourcePartName, relationshipId, chartPartName, shape);
}
/**
 * Walks slide shape trees (including one level of group children) collecting shapes.
 *
 * @param {Presentation} document - The document value.
 * @returns {Shape[]} The result.
 */
function collectWalkShapes(document: Presentation): Shape[] {
    const out: Shape[] = [];
    for (let i: number = 0; i < document.slides.length; i++) {
        const slide: Slide = arrayAt(document.slides, i);
        for (let j: number = 0; j < slide.shapes.length; j++) {
            const shape: Shape = arrayAt(slide.shapes, j);
            out.push(shape);
            if (shape.elementKind === 'grpSp') {
                for (let k: number = 0; k < shape.children.length; k++) {
                    const child: any = arrayAt(shape.children, k);// eslint-disable-line
                    out.push(child);

                }
            }

        }

    }
    return out;
}
/**
 * Enumerates all discoverable chart instances in the package (soft-skip incomplete).
 *
 * @remarks Incomplete hooks are omitted without throw (spec 037 enumerate policy). Use {@link asChart} / {@link resolveChart} for explicit
 * shape binding errors. Lazy: each successful frame triggers xlsx load + parse (cached module load).
 * @public
 * @param {Presentation} document - Open presentation.
 * @returns {*} Successfully bound chart instances in document walk order.
 */
export async function enumerateDocumentCharts(document: Presentation): Promise<ReadonlyArray<ChartInstance>> {
    const results: ChartInstance[] = [];
    const collectWalkShapesResult: Shape[] = collectWalkShapes(document);
    for (let i: number = 0; i < collectWalkShapesResult.length; i++) {
        const shape: Shape = arrayAt(collectWalkShapesResult, i);
        if (!isChartGraphicFrame(shape)) {
            continue;
        }
        try {
            const instance: ChartInstance = await resolveChart(shape, document);
            results.push(instance);
        }
        catch (err) {
            if (err instanceof ChartsError) {
                continue;
            }
            throw err;
        }

    }
    return results;
}
/**
 * Re-export graph builder for callers that only need the package snapshot.
 *
 * @public
 * @param {Presentation} document - Open presentation.
 * @returns {ChartPackageGraph} Host-local {@link ChartPackageGraph}.
 */
export function getChartPackageGraph(document: Presentation): ChartPackageGraph {
    return buildChartPackageGraph(document);
}
/**
 * Lists graph relationships whose source is `chartPartName`.
 *
 * @public
 * @param {ChartPackageGraph} graph - Snapshot from {@link buildChartPackageGraph}.
 * @param {string} chartPartName - Absolute chart part name.
 * @returns {*} Child relationships (unknown types included).
 */
export function listChartChildRelationships(graph: ChartPackageGraph, chartPartName: string): ReadonlyArray<ChartPackageRelationship> {
    return graph.relationships.filter((r: ChartPackageRelationship) => r.source === chartPartName);
}
/**
 * Returns the engine `dataSource` kind for a bound instance.
 *
 * @remarks When parse was called with `pkg: undefined`, kind may be `none` even if chart-part package relationships exist — use {@link
 * ChartInstance.relatedParts} / {@link listChartChildRelationships} for host-side classification.
 * @public
 * @param {ChartInstance} instance - Bound chart instance.
 * @returns {*} `embedded` | `external` | `none`.
 */
export function chartDataSourceKind(instance: ChartInstance): ChartDataSource['kind'] {
    return instance.parsed.dataSource.kind;
}
