/**
 * Ink DOM model and authoring API (office-common).
 *
 * Contract: `docs/specs/ink-shared-codec.md` / cross-repo
 * `ej2-docx/docs/specs/ink-dom-parse-serialize.md` § Internal semantic model,
 * § Mutation behavior.
 *
 * Trace-group decision (TASK-9002): `OfficeInk.traces` is flat document-order.
 * Nested `traceGroup` structure is reserved for TASK-9003 via an optional
 * internal ordered tree field (`traceTree`) that 9003 may populate; when
 * absent, serialize emits a flat sequence of traces. Consumers of 9002 only
 * see the flat `traces` array.
 */
import { InkPoint } from './trace-codec';
import { computeInkBounds } from './trace-codec';
/**
 * Visual effect applied to an ink stroke.
 *
 * Source: [MS-ODRAWXML] ink effect tokens + cross-repo effect→color table.
 *
 * @public
 */
export declare type InkEffectType = 'none' | 'pencil' | 'rainbow' | 'galaxy' | 'lava' | 'ocean' | 'roseGold' | 'gold' | 'silver' | 'bronze';
/**
 * A single ink stroke with decoded plane points and brush/context references.
 *
 * @private
 */
export interface InkTrace {
    /** Decoded plane coordinates in document trace order. */
    readonly points: ReadonlyArray<InkPoint>;
    /** Brush reference key (for example `"#br0"`). */
    readonly brushRef: string;
    /** Context reference key (for example `"#ctx0"`). */
    readonly contextRef: string;
    /** Optional time-offset attribute preserved when present on the source. */
    readonly timeOffset?: string;
}
/**
 * Channel definition under a context trace format ([MS-ODRAWXML] §2.1.4).
 *
 * @private
 */
export interface InkChannel {
    /** Channel name token such as `X` or `Y`. */
    readonly name: string;
    /** Optional channel value type such as `integer` or `decimal`. */
    readonly type?: string;
    /** Optional minimum value as the authored string. */
    readonly min?: string;
    /** Optional maximum value as the authored string. */
    readonly max?: string;
    /** Optional units token such as `cm` or `dev`. */
    readonly units?: string;
}
/**
 * InkML context under definitions, including channels and optional ink source id.
 *
 * @private
 */
export interface InkContext {
    /** Context key (for example `"#ctx0"`). */
    readonly id: string;
    /** Optional inkSource `@xml:id`, normalized with or without a leading `#` on write. */
    readonly inkSourceId?: string;
    /** Ordered channel definitions for this context. */
    readonly channels: ReadonlyArray<InkChannel>;
}
/**
 * Brush settings used to render ink strokes.
 *
 * Authoring defaults: color `#000000`, size `1.42pt × 1.42pt`, units `'pt'`,
 * effect `'none'`, and `ignorePressure` `true`. Parse-time [MS-ODRAWXML] §2.1.4
 * defaults (width `.053 cm`, height `.001 cm`, tip `ellipse`, rasterOp `copyPen`)
 * apply during parse, not createInk authoring.
 *
 * After parse, size values are stored in **points** with `units` retained for
 * re-emit. After authoring, size values use the brush `units` (default `pt`).
 *
 * @private
 */
export interface InkBrush {
    /** Stroke color in `#RRGGBB` form. Default is black (`#000000`). */
    color: string;
    /**
     * Brush width and height.
     * After parse: values are in points.
     * After authoring (`createInk` / `addInkTrace`): values use `units` (default `pt`).
     */
    size: {
        width: number;
        height: number;
    };
    /** Length unit key (`cm`, `mm`, `pt`, `px`, `in`, or `emu`). Default is `pt`. */
    units: string;
    /** Visual ink effect. Default is `'none'`. */
    inkEffect: InkEffectType;
    /** Optional pen tip token such as `ellipse` or `rectangle`, or a preserved value. */
    tip?: string;
    /** Optional raster operation token from [MS-ODRAWXML] §2.1.4. */
    rasterOp?: string;
    /** When true, pressure channel input is ignored. Authoring default is `true`. */
    ignorePressure: boolean;
    /** Optional effect texture horizontal anchor for authored strokes. */
    anchorX?: string;
    /** Optional effect texture vertical anchor for authored strokes. */
    anchorY?: string;
    /** Optional effect texture scale factor for authored strokes. */
    scaleFactor?: string;
    /** Optional transparency from 0 through 1 when present as a brush property. */
    transparency?: number;
    /** Optional anti-alias flag when present as a brush property. */
    antiAliased?: boolean;
    /** Optional fit-to-curve flag when present as a brush property. */
    fitToCurve?: boolean;
    /** Brush key on the owning ink object (for example `"#br0"`). */
    readonly id: string;
}
/**
 * Optional nesting node for TASK-9003 group preservation.
 * 9002 keeps this internal / absent for authored ink.
 *
 * @private
 */
export declare type InkTraceTreeNode = {
    readonly kind: 'trace';
    readonly traceIndex: number;
} | {
    readonly kind: 'group';
    readonly children: ReadonlyArray<InkTraceTreeNode>;
};
/**
 * One InkML part: ordered traces + brush table.
 *
 * @public
 */
export interface OfficeInk {
    /**
     * Ordered traces in document order (root-level and, flattened, from groups).
     */
    readonly traces: ReadonlyArray<InkTrace>;
    /** Brush table; ids are `"#br{N}"`-style keys. */
    readonly brushes: ReadonlyArray<InkBrush>;
    /**
     * Parsed contexts under `definitions` (TASK-9003). When empty/undefined,
     * serializer emits the default `#ctx0` channel set when needed.
     *
     * @public
     */
    readonly contexts?: ReadonlyArray<InkContext>;
    /**
     * Optional nested group tree for TASK-9003. When undefined, traces are a
     * flat sequence. Not part of the public authoring surface for 9002.
     *
     * @private
     */
    readonly traceTree?: ReadonlyArray<InkTraceTreeNode>;
    /**
     * Scale intent for {@link inkPathPoints}: `'authored'` stretch-to-fit
     * (re-zero); `'decoded'` uniform (no re-zero). Defaults to `'authored'`
     * for ink created via {@link createInk}.
     *
     * @private
     */
    readonly scaleMode?: 'authored' | 'decoded';
}
/**
 * Build a branded ink from parsed InkML state (`scaleMode: 'decoded'`).
 *
 * @param {object} init - The init.
 * @returns {OfficeInk} The result.
 * @private
 */
export declare function createDecodedInk(init: {
    traces: InkTrace[];
    brushes: InkBrush[];
    contexts?: InkContext[];
    traceTree?: InkTraceTreeNode[];
}): OfficeInk;
/**
 * Allocate a fresh, empty ink DOM for authoring.
 *
 * Empty traces; no brushes until the first {@link addInkTrace}. Scale mode
 * is `'authored'` (stretch-to-fit for {@link inkPathPoints}).
 *
 * @returns {OfficeInk} The result.
 * @private
 */
export declare function createInk(): OfficeInk;
/**
 * Add a trace to an ink DOM.
 *
 * Brush selection (spec mutation §):
 * - If `brush` partial is provided, clone previous brush (or default) then
 *   apply the partial onto a **new** brush id.
 * - Else if a previous trace exists, clone that trace's brush under a new id.
 * - Else allocate the default black `1.42pt × 1.42pt` authored brush as `#br0`.
 *
 * Returns the new trace. Mutates `ink` in place (traces/brushes arrays grow).
 *
 * @param {OfficeInk} ink - The ink.
 * @param {*} points - The points.
 * @param {Partial<InkBrush> | undefined} brush - The brush.
 * @returns {InkTrace} The result.
 * @private
 */
export declare function addInkTrace(ink: OfficeInk, points: ReadonlyArray<{
    readonly x: number;
    readonly y: number;
}>, brush?: Partial<InkBrush>): InkTrace;
/**
 * Deep-copy an ink DOM (independent traces, points, brushes, and contexts).
 *
 * @param {OfficeInk} ink - The ink.
 * @returns {OfficeInk} The result.
 * @private
 */
export declare function cloneInk(ink: OfficeInk): OfficeInk;
/**
 * Convert ink traces into plane point paths scaled to a drawing extent.
 *
 * Authored ink (`scaleMode === 'authored'`, default from {@link createInk})
 * uses stretch-to-fit (re-zero). Decoded ink uses uniform scale (no re-zero).
 * Bounds are computed over **all** points in the ink, then each path is scaled
 * with the same transform.
 *
 * @param {OfficeInk} ink - The ink.
 * @param {object} extent - The extent.
 * @returns {ReadonlyArray<ReadonlyArray<InkPoint>>} The result.
 * @private
 */
export declare function inkPathPoints(ink: OfficeInk, extent: {
    readonly width: number;
    readonly height: number;
}): ReadonlyArray<ReadonlyArray<InkPoint>>;
/**
 * Type guard for {@link OfficeInk} instances produced by this module.
 *
 * @param {unknown} value - The value.
 * @returns {boolean} The result.
 * @private
 */
export declare function isOfficeInk(value: unknown): value is OfficeInk;
/**
 * Mark an ink as authored or decoded (uniform scale path).
 * Hosts and tests use this to select the scale mode for bounds/path computation.
 *
 * @param {OfficeInk} ink - The ink.
 * @param {'authored' | 'decoded'} mode - The mode.
 * @returns {void} Nothing is returned.
 * @private
 */
export declare function setInkScaleMode(ink: OfficeInk, mode: 'authored' | 'decoded'): void;
export { computeInkBounds };
