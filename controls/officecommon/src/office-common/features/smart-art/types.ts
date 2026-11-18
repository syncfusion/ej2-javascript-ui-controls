/**
 * Public types for DrawingML diagram (SmartArt) part models.
 *
 * @remarks
 * Citations: `dml-diagram.xsd` (`CT_DataModel`, `CT_Pt`, `ST_PtType`, `CT_Cxn`,
 * `CT_ColorTransform`, `CT_DiagramDefinition`, `CT_StyleDefinition`);
 * ECMA-376 Part 1 §14.2.3–14.2.6.
 *
 * Colors, layout, and style parts are identity + opaque XML preserve in v1
 * (TASK-8102). Data points expose `modelId` / `type` / optional text body;
 * plain-text read/write is {@link diagramPointText} / {@link withDiagramPointText}.
 * @public
 */

import { DiagramXmlElement } from './diagram-xml';

/**
 * `ST_PtType` values from Transitional `dml-diagram.xsd`.
 *
 * @public
 */
export const DiagramPointType: { Node: string; Asst: string; Doc: string; Pres: string; ParTrans: string; SibTrans: string; } = {
    /** Default when `@type` is absent. */
    Node: 'node',
    Asst: 'asst',
    Doc: 'doc',
    Pres: 'pres',
    ParTrans: 'parTrans',
    SibTrans: 'sibTrans'
};

/**
 * Union of {@link DiagramPointType} values.
 *
 * @public
 */
export type DiagramPointType = (typeof DiagramPointType)[keyof typeof DiagramPointType];

/**
 * One `dgm:pt` (`CT_Pt`) with modeled fields and full element preserve.
 *
 * @public
 */
export interface DiagramPoint {
    /** Required `modelId` attribute. */
    readonly modelId: string;
    /**
     * Point kind from `@type`. When the attribute is absent in XML, this is
     * {@link DiagramPointType.Node} (XSD default).
     */
    readonly type: DiagramPointType;
    /**
     * True when `type` was written on the element; false when applying the XSD default.
     */
    readonly typeAttributePresent: boolean;
    /**
     * Optional connection id (`cxnId`) when present.
     */
    readonly connectionId?: string;
    /**
     * Optional `dgm:t` text-body child, preserved as an element subtree when present.
     *
     * @private
     */
    readonly textBody?: DiagramXmlElement;
    /**
     * Full `dgm:pt` element including unknown children/attributes for round-trip.
     *
     * @private
     */
    readonly element: DiagramXmlElement;
}

/**
 * One `dgm:cxn` (`CT_Cxn`) preserved for round-trip with key ids exposed.
 *
 * @public
 */
export interface DiagramConnection {
    readonly modelId: string;
    readonly sourceId: string;
    readonly destinationId: string;
    /**
     * Full `dgm:cxn` element.
     *
     * @private
     */
    readonly element: DiagramXmlElement;
}

/**
 * Parsed Diagram Data part (`dgm:dataModel` / `CT_DataModel`).
 *
 * @public
 */
export interface DiagramDataPart {
    readonly kind: 'diagramData';
    /** Points from required `ptLst`. */
    readonly points: ReadonlyArray<DiagramPoint>;
    /** Connections from optional `cxnLst` (empty when absent). */
    readonly connections: ReadonlyArray<DiagramConnection>;
    /**
     * Full root element including `bg`, `whole`, `extLst`, and unknown content.
     *
     * @private
     */
    readonly root: DiagramXmlElement;
}

/**
 * Parsed Diagram Colors part (`dgm:colorsDef` / `CT_ColorTransform`).
 *
 * @public
 */
export interface DiagramColorsPart {
    readonly kind: 'diagramColors';
    /** Optional `uniqueId` attribute when present. */
    readonly uniqueId?: string;
    /**
     * Full root element for opaque preserve serialize.
     *
     * @private
     */
    readonly root: DiagramXmlElement;
}

/**
 * Parsed Diagram Layout Definition part (`dgm:layoutDef` / `CT_DiagramDefinition`).
 *
 * @public
 */
export interface DiagramLayoutPart {
    readonly kind: 'diagramLayout';
    /** Optional `uniqueId` attribute when present. */
    readonly uniqueId?: string;
    /**
     * Full root element for opaque preserve serialize.
     *
     * @private
     */
    readonly root: DiagramXmlElement;
}

/**
 * Parsed Diagram Style part (`dgm:styleDef` / `CT_StyleDefinition`).
 *
 * @public
 */
export interface DiagramStylePart {
    readonly kind: 'diagramStyle';
    /** Optional `uniqueId` attribute when present. */
    readonly uniqueId?: string;
    /**
     * Full root element for opaque preserve serialize.
     *
     * @private
     */
    readonly root: DiagramXmlElement;
}

/**
 * Handler pair for a diagram part content type (in-module registry).
 *
 * @public
 */
export interface DiagramPartHandler {
    readonly contentType: string;
    readonly parse: (xml: string) => DiagramDataPart | DiagramColorsPart | DiagramLayoutPart | DiagramStylePart;
    readonly serialize: (
        part: DiagramDataPart | DiagramColorsPart | DiagramLayoutPart | DiagramStylePart,
    ) => string;
}

/**
 * `dgm:relIds` (`CT_RelIds`) relationship id strings.
 *
 * @remarks
 * Schema (`dml-diagram.xsd`): attributes `r:dm`, `r:lo`, `r:qs`, `r:cs` are all
 * required. They target the Diagram Data, Layout Definition, Style (quick style),
 * and Colors parts respectively ([MS-ODRAWXML] §3.7.1).
 * @public
 */
export interface DiagramRelIds {
    /** Relationship id for the Diagram Data part (`r:dm`). */
    readonly dm: string;
    /** Relationship id for the Diagram Layout Definition part (`r:lo`). */
    readonly lo: string;
    /** Relationship id for the Diagram Style / quick style part (`r:qs`). */
    readonly qs: string;
    /** Relationship id for the Diagram Colors part (`r:cs`). */
    readonly cs: string;
}

/**
 * Package part names for the four diagram parts of one instance.
 *
 * @remarks
 * Paths are host-supplied package part names (leading `/` normalized). Layout
 * part names must not be shared across instances (ECMA-376 Part 1 §14.2.5).
 * @public
 */
export interface DiagramPartNames {
    readonly data: string;
    readonly layout: string;
    readonly colors: string;
    readonly style: string;
}

/**
 * One discoverable DrawingML diagram instance (four parts + hook rel ids).
 *
 * @remarks
 * Host-neutral: no slide, main-document, or worksheet types. The host owns the
 * graphic-frame markup that embeds `dgm:relIds`; this handle exposes the package
 * subgraph and the relationship ids only.
 * @public
 */
export interface DiagramInstance {
    /**
     * Stable library id for this instance (data part name after normalization).
     */
    readonly id: string;
    readonly data: DiagramDataPart;
    readonly layout: DiagramLayoutPart;
    readonly colors: DiagramColorsPart;
    readonly style: DiagramStylePart;
    readonly relIds: DiagramRelIds;
    readonly partNames: DiagramPartNames;
    /**
     * Package part that sources the four diagram relationships (host drawing or
     * document part name). Empty string when the instance was clustered from
     * relationships without a recorded source.
     */
    readonly sourcePartName: string;
}

/**
 * One package part entry for diagram discovery (host-neutral OPC view).
 *
 * @public
 */
export interface DiagramPackagePart {
    /** Package part name (e.g. `/diagrams/data1.xml`). */
    readonly name: string;
    /** Content type of the part. */
    readonly contentType: string;
    /** Part XML text (UTF-8). */
    readonly xml: string;
}

/**
 * One package relationship edge for diagram discovery.
 *
 * @remarks
 * `target` should be the resolved package part name of the relationship target
 * (hosts normalize relative Target attributes before calling into this module).
 * @public
 */
export interface DiagramPackageRelationship {
    /** Relationship id (`Id` attribute, e.g. `rId8`). */
    readonly id: string;
    /** Relationship type URI. */
    readonly type: string;
    /** Resolved target part name. */
    readonly target: string;
    /** Source part name that owns this relationship. */
    readonly source: string;
}

/**
 * Host-neutral package graph slice used to discover diagram instances.
 *
 * @remarks
 * This encryption-base tree has no core OPC module. Hosts (or tests) supply
 * parts and relationships; SmartArt never imports PPT/Word/Excel product types.
 * @public
 */
export interface DiagramPackageGraph {
    readonly parts: ReadonlyArray<DiagramPackagePart>;
    readonly relationships: ReadonlyArray<DiagramPackageRelationship>;
}

/**
 * Options for {@link getDiagramInstance}.
 *
 * @public
 */
export interface GetDiagramInstanceOptions {
    /** Match {@link DiagramInstance.id} (normalized data part name). */
    readonly id?: string;
    /** Match the data part package name (normalized). */
    readonly dataPartName?: string;
}

/**
 * Caller-supplied XML seeds for the four diagram parts.
 *
 * @remarks
 * Each non-empty string is validated with the corresponding parse API before
 * any package mutation. Omitted fields fall back to the library minimal sample
 * when the entire `seeds` object is omitted, or when individual fields are
 * omitted under a partial `seeds` object. Explicit empty string is invalid.
 * @public
 */
export interface CreateDiagramInstanceSeeds {
    /** UTF-8 XML with `dgm:dataModel` root. */
    readonly dataXml?: string;
    /** UTF-8 XML with `dgm:layoutDef` root. */
    readonly layoutXml?: string;
    /** UTF-8 XML with `dgm:colorsDef` root. */
    readonly colorsXml?: string;
    /** UTF-8 XML with `dgm:styleDef` root. */
    readonly styleXml?: string;
}

/**
 * Options for {@link createDiagramInstance}.
 *
 * @public
 */
export interface CreateDiagramInstanceOptions {
    /**
     * Part XML seeds. When omitted entirely, built-in minimal samples are used
     * for all four parts.
     */
    readonly seeds?: CreateDiagramInstanceSeeds;
    /**
     * Host part that will own the four diagram relationships (slide, document,
     * drawings part, etc.). When set, the returned graph includes four new
     * relationship edges from this source and allocates unique relationship ids.
     * When omitted, no relationship edges are written; {@link DiagramGraphicHook.relIds}
     * still carries suggested ids for the host to create.
     */
    readonly sourcePartName?: string;
    /**
     * Package directory prefix for new part names (default `/diagrams`).
     * Final names are `{prefix}/data{N}.xml`, `layout{N}.xml`, `colors{N}.xml`,
     * `quickStyle{N}.xml` with N chosen so names do not collide with existing parts.
     */
    readonly partNamePrefix?: string;
}

/**
 * Host graphic-frame hook payload produced by {@link createDiagramInstance}.
 *
 * @remarks
 * The host must embed `a:graphicData@uri` = {@link graphicDataUri} with child
 * `dgm:relIds` carrying {@link relIds} in its own drawing tree. This module does
 * not mutate host product markup.
 * @public
 */
export interface DiagramGraphicHook {
    /**
     * Value for `a:graphicData@uri` (diagram namespace).
     *
     * @see DIAGRAM_GRAPHIC_DATA_URI
     */
    readonly graphicDataUri: string;
    /** Relationship id tokens for `r:dm` / `r:lo` / `r:qs` / `r:cs`. */
    readonly relIds: DiagramRelIds;
}

/**
 * Result of {@link createDiagramInstance}.
 *
 * @public
 */
export interface CreateDiagramInstanceResult {
    /**
     * New package graph: previous parts/relationships plus the four diagram parts
     * and optional source relationships. Input graph is not mutated.
     */
    readonly graph: DiagramPackageGraph;
    /** Bound instance handle (parsed parts + part names + rel ids). */
    readonly instance: DiagramInstance;
    /** Payload for the host to attach a graphic frame / `dgm:relIds`. */
    readonly hook: DiagramGraphicHook;
}

/**
 * Options for {@link removeDiagramInstance}.
 *
 * @remarks
 * Provide {@link instance}, and/or {@link id} / {@link dataPartName} so the
 * four owned diagram parts can be resolved. At least one identification path
 * is required. Unknown instances throw (explicit mutate policy).
 * @public
 */
export interface RemoveDiagramInstanceOptions {
    /**
     * Instance handle (e.g. from {@link createDiagramInstance} or enumerate).
     * Part names are validated against the graph (diagram content types only)
     * before any delete — forged non-diagram names are rejected.
     */
    readonly instance?: DiagramInstance;
    /** Match {@link DiagramInstance.id} (normalized data part name). */
    readonly id?: string;
    /** Match the data part package name (normalized). */
    readonly dataPartName?: string;
}

/**
 * Result of {@link removeDiagramInstance}.
 *
 * @public
 */
export interface RemoveDiagramInstanceResult {
    /**
     * New package graph without the instance’s four diagram parts, relationships
     * targeting or sourced from those parts (as visible on the graph), and any
     * exclusively owned image parts. Input graph is not mutated.
     */
    readonly graph: DiagramPackageGraph;
    /**
     * Normalized names of parts removed (four diagram parts plus exclusive
     * image parts, if any).
     */
    readonly removedPartNames: ReadonlyArray<string>;
}
