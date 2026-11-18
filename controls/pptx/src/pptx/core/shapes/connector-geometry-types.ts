/**
 * Connector end and geometry-kind read models (preserve path).
 *
 * @remarks
 * Citation: Transitional `dml-main.xsd` `CT_Connection`, `CT_NonVisualConnectorProperties`,
 * `EG_Geometry` (`custGeom` | `prstGeom`); `pml.xsd` `CT_Connector` / `CT_ConnectorNonVisual`.
 * Read-only — no retarget, create, or path edit in Phase 3.
 */
/**
 * One connector attachment site (`a:stCxn` / `a:endCxn`).
 *
 * @remarks
 * `drawingElementId` is `CT_Connection/@id` (`ST_DrawingElementId` as decimal string).
 * `siteIndex` is `@idx` (`xsd:unsignedInt`). Both attributes are required by schema;
 * incomplete markup is omitted rather than invented.
 */
export interface ConnectorConnection {
    /** Target drawing element id (`CT_Connection/@id`). */
    readonly drawingElementId: string;
    /** Connection site index on the target (`CT_Connection/@idx`). */
    readonly siteIndex: number;
}
/**
 * Optional start and end attachments on a connector shape.
 *
 * @remarks
 * Absent ends are omitted (not invented). Non-`cxnSp` shapes yield an empty object.
 */
export interface ConnectorEnds {
    /** Optional start attachment (a:stCxn) when present on the connector. */
    readonly start?: ConnectorConnection;
    /** Optional end attachment (a:endCxn) when present on the connector. */
    readonly end?: ConnectorConnection;
}
/**
 * Classification of `EG_Geometry` under shape `spPr`.
 *
 * - `preset` — `a:prstGeom` present
 * - `custom` — `a:custGeom` present
 * - `none` — neither geometry choice present
 *
 * When both appear (invalid), `custom` wins so freeform markup is not mislabeled.
 */
export type GeometryKind = 'preset' | 'custom' | 'none';

/** One authored `a:gd` adjustment entry under `a:prstGeom/a:avLst`. */
export interface GeometryGuide {
    /** Guide name referenced by preset formulae. */
    readonly name: string;
    /** DrawingML guide formula as authored, for example `val 25000`. */
    readonly formula: string;
}

/** Direct geometry choice under shape properties. */
export type DirectGeometry = PresetGeometry | CustomGeometry | MissingGeometry;

/** Authored preset geometry and its direct adjustment guides. */
export interface PresetGeometry {
    readonly kind: 'preset';
    /** `a:prstGeom/@prst` token. */
    readonly preset: string;
    /** Direct `a:avLst/a:gd` entries in document order. */
    readonly adjustments: ReadonlyArray<GeometryGuide>;
}

/** One authored point expression in custom geometry coordinates. */
export interface CustomGeometryPoint {
    /** DrawingML x coordinate or guide name. */
    readonly x: string;
    /** DrawingML y coordinate or guide name. */
    readonly y: string;
}

/** One authored command in an `a:custGeom/a:path`. */
export type CustomGeometryCommand =
    | { readonly kind: 'move' | 'line'; readonly point: CustomGeometryPoint; }
    | { readonly kind: 'quadratic'; readonly points: ReadonlyArray<CustomGeometryPoint>; }
    | { readonly kind: 'cubic'; readonly points: ReadonlyArray<CustomGeometryPoint>; }
    | { readonly kind: 'arc'; readonly widthRadius: string; readonly heightRadius: string;
        readonly startAngle: string; readonly sweepAngle: string; }
    | { readonly kind: 'close'; };

/** One authored custom-geometry path, retaining its own coordinate space. */
export interface CustomGeometryPath {
    readonly width: string | undefined;
    readonly height: string | undefined;
    readonly fill: string | undefined;
    readonly stroke: boolean | undefined;
    readonly commands: ReadonlyArray<CustomGeometryCommand>;
}

/** One custom-geometry connector site from `a:cxnLst`. */
export interface CustomGeometryConnectionSite {
    readonly angle: string;
    readonly point: CustomGeometryPoint;
}

/** Direct custom geometry. Authored formula strings remain separate from evaluated paths. */
export interface CustomGeometry {
    readonly kind: 'custom';
    /** Adjustment guides from `a:avLst`. */
    readonly adjustments: ReadonlyArray<GeometryGuide>;
    /** Calculated guides from `a:gdLst`. */
    readonly guides: ReadonlyArray<GeometryGuide>;
    /** Authored connector sites from `a:cxnLst`. */
    readonly connectionSites: ReadonlyArray<CustomGeometryConnectionSite>;
    /** Authored paths in document order. */
    readonly paths: ReadonlyArray<CustomGeometryPath>;
}

/** No authored geometry choice. */
export interface MissingGeometry {
    readonly kind: 'none';
}
