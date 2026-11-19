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

import { ownValue } from '../../core/own-value';
import { Literal } from '../../core/literal-type';
import { InkPoint } from './trace-codec';
import { computeInkBounds, scalePointsStretch, scalePointsUniform } from './trace-codec';

/**
 * Visual effect applied to an ink stroke.
 *
 * Source: [MS-ODRAWXML] ink effect tokens + cross-repo effect→color table.
 *
 * @public
 */
export type InkEffectType =
  | 'none'
  | 'pencil'
  | 'rainbow'
  | 'galaxy'
  | 'lava'
  | 'ocean'
  | 'roseGold'
  | 'gold'
  | 'silver'
  | 'bronze';

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
    size: { width: number; height: number };
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
export type InkTraceTreeNode =
  | { readonly kind: 'trace'; readonly traceIndex: number }
  | { readonly kind: 'group'; readonly children: ReadonlyArray<InkTraceTreeNode> };

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

/** Marker used by {@link isOfficeInk}. */
const OFFICE_INK_BRAND: unique symbol = Symbol.for('@syncfusion/ej2-office-common.OfficeInk');

type OfficeInkInternal = OfficeInk & {
    readonly [OFFICE_INK_BRAND]: true;
    traces: InkTrace[];
    brushes: InkBrush[];
    scaleMode: 'authored' | 'decoded';
    contexts?: InkContext[];
    traceTree?: InkTraceTreeNode[];
};

/** Default authored brush size (spec mutation §): 1.42pt × 1.42pt. */
const DEFAULT_AUTHORED_BRUSH_SIZE: Literal<1.42> = 1.42;
const DEFAULT_AUTHORED_COLOR: Literal<'#000000'> = '#000000';
const DEFAULT_AUTHORED_UNITS: Literal<'pt'> = 'pt';
const DEFAULT_CONTEXT_REF: Literal<'#ctx0'> = '#ctx0';

/**
 * The is ink effect type.
 *
 * @param {unknown} value - The value.
 * @returns {boolean} The result.
 */
function isInkEffectType(value: unknown): value is InkEffectType {
    return (
        value === 'none' ||
    value === 'pencil' ||
    value === 'rainbow' ||
    value === 'galaxy' ||
    value === 'lava' ||
    value === 'ocean' ||
    value === 'roseGold' ||
    value === 'gold' ||
    value === 'silver' ||
    value === 'bronze'
    );
}

/**
 * The clone brush.
 *
 * @param {InkBrush} source - The source.
 * @param {string} id - The id.
 * @returns {InkBrush} The result.
 */
function cloneBrush(source: InkBrush, id: string): InkBrush {
    const next: InkBrush = {
        color: source.color,
        size: { width: source.size.width, height: source.size.height },
        units: source.units,
        inkEffect: source.inkEffect,
        ignorePressure: source.ignorePressure,
        id
    };
    if (source.tip !== undefined) {
        next.tip = source.tip;
    }
    if (source.rasterOp !== undefined) {
        next.rasterOp = source.rasterOp;
    }
    if (source.anchorX !== undefined) {
        next.anchorX = source.anchorX;
    }
    if (source.anchorY !== undefined) {
        next.anchorY = source.anchorY;
    }
    if (source.scaleFactor !== undefined) {
        next.scaleFactor = source.scaleFactor;
    }
    if (source.transparency !== undefined) {
        next.transparency = source.transparency;
    }
    if (source.antiAliased !== undefined) {
        next.antiAliased = source.antiAliased;
    }
    if (source.fitToCurve !== undefined) {
        next.fitToCurve = source.fitToCurve;
    }
    return next;
}

/**
 * The clone context.
 *
 * @param {InkContext} source - The source.
 * @returns {InkContext} The result.
 */
function cloneContext(source: InkContext): InkContext {
    const next: InkContext = {
        id: source.id,
        channels: source.channels.map((ch: InkChannel) => {
            const c: InkChannel = { name: ch.name };
            if (ch.type !== undefined) {
                (c as { type?: string }).type = ch.type;
            }
            if (ch.min !== undefined) {
                (c as { min?: string }).min = ch.min;
            }
            if (ch.max !== undefined) {
                (c as { max?: string }).max = ch.max;
            }
            if (ch.units !== undefined) {
                (c as { units?: string }).units = ch.units;
            }
            return c;
        })
    };
    if (source.inkSourceId !== undefined) {
        (next as { inkSourceId?: string }).inkSourceId = source.inkSourceId;
    }
    return next;
}

/**
 * The default authored brush.
 *
 * @param {string} id - The id.
 * @returns {InkBrush} The result.
 */
function defaultAuthoredBrush(id: string): InkBrush {
    return {
        color: DEFAULT_AUTHORED_COLOR,
        size: { width: DEFAULT_AUTHORED_BRUSH_SIZE, height: DEFAULT_AUTHORED_BRUSH_SIZE },
        units: DEFAULT_AUTHORED_UNITS,
        inkEffect: 'none',
        ignorePressure: true,
        id
    };
}

/**
 * The apply brush partial.
 *
 * @param {InkBrush} target - The target.
 * @param {Partial<InkBrush>} partial - The partial.
 * @returns {void} Nothing is returned.
 */
function applyBrushPartial(target: InkBrush, partial: Partial<InkBrush>): void {
    if (partial.color !== undefined) {
        target.color = partial.color;
    }
    if (partial.size !== undefined) {
        target.size = {
            width: partial.size.width,
            height: partial.size.height
        };
    }
    if (partial.units !== undefined) {
        target.units = partial.units;
    }
    if (partial.inkEffect !== undefined && isInkEffectType(partial.inkEffect)) {
        target.inkEffect = partial.inkEffect;
    }
    if (partial.ignorePressure !== undefined) {
        target.ignorePressure = partial.ignorePressure;
    }
    if (partial.tip !== undefined) {
        target.tip = partial.tip;
    }
    if (partial.rasterOp !== undefined) {
        target.rasterOp = partial.rasterOp;
    }
    if (partial.anchorX !== undefined) {
        target.anchorX = partial.anchorX;
    }
    if (partial.anchorY !== undefined) {
        target.anchorY = partial.anchorY;
    }
    if (partial.scaleFactor !== undefined) {
        target.scaleFactor = partial.scaleFactor;
    }
}

/**
 * Allocate the next `#br{N}` key that does not collide with existing brushes.
 *
 * @param {ReadonlyArray<InkBrush>} brushes - The brushes.
 * @returns {string} The result.
 */
function allocateBrushId(brushes: ReadonlyArray<InkBrush>): string {
    const used: Set<string> = new Set(brushes.map((b: InkBrush) => b.id));
    let n: number = 0;
    for (;;) {
        const id: string = `#br${String(n)}`;
        if (!used.has(id)) {
            return id;
        }
        n += 1;
    }
}

/**
 * The brand ink.
 *
 * @param {object} ink - The ink.
 * @returns {OfficeInk} The result.
 */
function brandInk(ink: {
    traces: InkTrace[];
    brushes: InkBrush[];
    scaleMode: 'authored' | 'decoded';
    contexts?: InkContext[];
    traceTree?: InkTraceTreeNode[];
}): OfficeInk {
    const internal: OfficeInkInternal = ink as OfficeInkInternal;
    Object.defineProperty(internal, OFFICE_INK_BRAND, {
        value: true,
        enumerable: false,
        configurable: false,
        writable: false
    });
    return internal;
}

/**
 * Build a branded ink from parsed InkML state (`scaleMode: 'decoded'`).
 *
 * @param {object} init - The init.
 * @returns {OfficeInk} The result.
 * @private
 */
export function createDecodedInk(init: {
    traces: InkTrace[];
    brushes: InkBrush[];
    contexts?: InkContext[];
    traceTree?: InkTraceTreeNode[];
}): OfficeInk {
    return brandInk({
        traces: init.traces,
        brushes: init.brushes,
        scaleMode: 'decoded',
        ...(init.contexts !== undefined ? { contexts: init.contexts } : {}),
        ...(init.traceTree !== undefined ? { traceTree: init.traceTree } : {})
    });
}

/**
 * Allocate a fresh, empty ink DOM for authoring.
 *
 * Empty traces; no brushes until the first {@link addInkTrace}. Scale mode
 * is `'authored'` (stretch-to-fit for {@link inkPathPoints}).
 *
 * @returns {OfficeInk} The result.
 * @private
 */
export function createInk(): OfficeInk {
    return brandInk({
        traces: [],
        brushes: [],
        scaleMode: 'authored'
    });
}

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
export function addInkTrace(
    ink: OfficeInk,
    points: ReadonlyArray<{ readonly x: number; readonly y: number }>,
    brush?: Partial<InkBrush>
): InkTrace {
    if (!isOfficeInk(ink)) {
        throw new TypeError('addInkTrace: expected OfficeInk from createInk/cloneInk');
    }
    const internal: OfficeInkInternal = ink as OfficeInkInternal;
    const pointCopy: InkPoint[] = points.map((p: { readonly x: number; readonly y: number; }) => ({ x: p.x, y: p.y }));

    let sourceBrush: InkBrush | undefined;
    const lastTrace: InkTrace = internal.traces[internal.traces.length - 1];
    if (lastTrace !== undefined) {
        sourceBrush = internal.brushes.find((b: InkBrush) => b.id === lastTrace.brushRef);
    }

    const newId: string = allocateBrushId(internal.brushes);
    const newBrush: InkBrush =
    sourceBrush !== undefined
        ? cloneBrush(sourceBrush, newId)
        : defaultAuthoredBrush(newId);

    if (brush !== undefined) {
        applyBrushPartial(newBrush, brush);
    }

    internal.brushes.push(newBrush);

    const trace: InkTrace = {
        points: pointCopy,
        brushRef: newBrush.id,
        contextRef: DEFAULT_CONTEXT_REF
    };
    const traceIndex: number = internal.traces.length;
    internal.traces.push(trace);
    // Keep ordered tree in sync so serializeInkXml (tree-preferring) emits new traces.
    if (internal.traceTree !== undefined) {
        (internal as any).traceTree = [...internal.traceTree, { kind: 'trace', traceIndex }];
    }
    return trace;
}

/**
 * Deep-copy an ink DOM (independent traces, points, brushes, and contexts).
 *
 * @param {OfficeInk} ink - The ink.
 * @returns {OfficeInk} The result.
 * @private
 */
export function cloneInk(ink: OfficeInk): OfficeInk {
    if (!isOfficeInk(ink)) {
        throw new TypeError('cloneInk: expected OfficeInk from createInk/cloneInk');
    }
    const internal: OfficeInkInternal = ink as OfficeInkInternal;
    const brushes: InkBrush[] = internal.brushes.map((b: InkBrush) => cloneBrush(b, b.id));
    const traces: InkTrace[] = internal.traces.map((t: InkTrace) => {
        const copy: InkTrace = {
            points: t.points.map((p: InkPoint) => ({ x: p.x, y: p.y })),
            brushRef: t.brushRef,
            contextRef: t.contextRef
        };
        if (t.timeOffset !== undefined) {
            (copy as { timeOffset?: string }).timeOffset = t.timeOffset;
        }
        return copy;
    });
    const next: {
        traces: InkTrace[];
        brushes: InkBrush[];
        scaleMode: 'authored' | 'decoded';
        contexts?: InkContext[];
        traceTree?: InkTraceTreeNode[];
    } = {
        traces,
        brushes,
        scaleMode: internal.scaleMode
    };
    if (internal.contexts !== undefined) {
        next.contexts = internal.contexts.map(cloneContext);
    }
    if (internal.traceTree !== undefined) {
        next.traceTree = cloneTraceTree(internal.traceTree);
    }
    return brandInk(next);
}

/**
 * The clone trace tree.
 *
 * @param {ReadonlyArray<InkTraceTreeNode>} nodes - The nodes.
 * @returns {InkTraceTreeNode[]} The result.
 */
function cloneTraceTree(nodes: ReadonlyArray<InkTraceTreeNode>): InkTraceTreeNode[] {
    return nodes.map((n: InkTraceTreeNode): InkTraceTreeNode => {
        if (n.kind === 'trace') {
            return { kind: 'trace', traceIndex: n.traceIndex  };
        }
        return { kind: 'group', children: cloneTraceTree(n.children)  };
    });
}

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
export function inkPathPoints(
    ink: OfficeInk,
    extent: { readonly width: number; readonly height: number }
): ReadonlyArray<ReadonlyArray<InkPoint>> {
    if (!isOfficeInk(ink)) {
        throw new TypeError('inkPathPoints: expected OfficeInk from createInk/cloneInk');
    }
    const internal: OfficeInkInternal = ink as OfficeInkInternal;
    const allPoints: InkPoint[] = [];
    for (const t of internal.traces) {
        for (const p of t.points) {
            allPoints.push(p);
        }
    }
    if (allPoints.length === 0) {
        return internal.traces.map((): InkPoint[] => []);
    }

    // Build a single scaled cloud, then slice back per trace by index.
    const scaledAll: ReadonlyArray<InkPoint> =
    internal.scaleMode === 'decoded'
        ? scalePointsUniform(allPoints, extent)
        : scalePointsStretch(allPoints, extent);

    let offset: number = 0;
    const paths: InkPoint[][] = [];
    for (const t of internal.traces) {
        const slice: InkPoint[] = scaledAll.slice(offset, offset + t.points.length);
        offset += t.points.length;
        paths.push([...slice]);
    }
    return paths;
}

/**
 * Type guard for {@link OfficeInk} instances produced by this module.
 *
 * @param {unknown} value - The value.
 * @returns {boolean} The result.
 * @private
 */
export function isOfficeInk(value: unknown): value is OfficeInk {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    return ownValue<unknown>(value as object, OFFICE_INK_BRAND) === true;
}

/**
 * Mark an ink as authored or decoded (uniform scale path).
 * Hosts and tests use this to select the scale mode for bounds/path computation.
 *
 * @param {OfficeInk} ink - The ink.
 * @param {'authored' | 'decoded'} mode - The mode.
 * @returns {void} Nothing is returned.
 * @private
 */
export function setInkScaleMode(ink: OfficeInk, mode: 'authored' | 'decoded'): void {
    if (!isOfficeInk(ink)) {
        throw new TypeError('setInkScaleMode: expected OfficeInk');
    }
    (ink as any).scaleMode = mode;
}

export { computeInkBounds };
