/**
 * InkML element-tree → {@link OfficeInk} parser ([MS-ODRAWXML] §2.1.4).
 *
 * The caller supplies an OpenXml element tree; this module never reads bytes
 * and never expands entities. Count guards are surfaced via
 * {@link getLastInkParseDiagnostics} for consumer limits policy.
 */

import { Literal } from '../../core/literal-type';
import { OpenXmlElement } from '../../core/xml/model';
import { XML_NAMESPACE } from '../../core/xml/model';
import { INKML_NAMESPACE } from './constants';
import { InkBrush, InkChannel, InkContext, InkEffectType, InkTrace, InkTraceTreeNode, OfficeInk } from './ink-model';
import { createDecodedInk } from './ink-model';
import { unitValueToPoints } from './ink-units';
import { elementText, getAttr, isInkMlElement } from './ink-xml';
import { decodeTrace, TraceDecodeResult, InkPoint } from './trace-codec';

/**
 * Diagnostic code for untokenizable / empty-result malformed traces.
 *
 * @public
 */
export const DIAG_INVALID_INK_TRACE: Literal<'content/invalid-ink-trace'> = 'content/invalid-ink-trace';

/**
 * Single diagnostic entry from an ink parse pass.
 *
 * @private
 */
export interface InkParseDiagnostic {
    /** Diagnostic code identifying the issue class. */
    readonly code: string;
    /** Human-readable description of the diagnostic. */
    readonly message: string;
    /** Optional zero-based index of the related trace when applicable. */
    readonly traceIndex?: number;
}

/**
 * Aggregate diagnostics and guard counters from the most recent {@link parseInkXml} call.
 *
 * @private
 */
export interface InkParseDiagnostics {
    /** Ordered diagnostic items collected during the parse pass. */
    readonly items: ReadonlyArray<InkParseDiagnostic>;
    /** Number of traces observed during the parse pass. */
    readonly traceCount: number;
    /** Number of packets observed across traces. */
    readonly packetCount: number;
    /** Number of plane points produced during decode. */
    readonly pointCount: number;
    /** Number of channel values processed during decode. */
    readonly channelValueCount: number;
}
const RECOGNIZED_CHANNELS: Set<string> = new Set(['X', 'Y', 'Z', 'S', 'T', 'SN', 'F', 'TP', 'BP', 'OTx', 'OTy', 'OA', 'OE', 'OR', 'RP', 'RR', 'RY', 'TW', 'TH', 'TC']);
const RECOGNIZED_CHANNEL_UNITS: Set<string> = new Set(['dev', 'in', 'cm', 'deg', 'rad', 's', 'lb', 'g']);

/** §2.1.4 ignore-list local names (skipped, never persisted). */
const IGNORE_LOCAL_NAMES: Set<string> = new Set(['timestamp', 'canvas', 'canvasTransform', 'mapping', 'bind', 'table', 'matrix', 'traceView', 'annotation', 'annotationXML', 'channelProperty', 'traceProperty', 'brushPropertyRef', 'intermittentInfo', 'latency', 'sampleRate', 'sampleRateExact', 'srcRef', 'channelRef']);
const BRUSH_PROP_NAMES: Set<string> = new Set(['width', 'height', 'color', 'transparency', 'tip', 'rasterop', 'antialiased', 'fittocurve', 'ignorepressure', 'inkeffects', 'anchorx', 'anchory', 'scalefactor']);
const EFFECT_TOKENS: ReadonlyMap<string, InkEffectType> = new Map([
    ['none', 'none'],
    ['pencil', 'pencil'],
    ['rainbow', 'rainbow'],
    ['galaxy', 'galaxy'],
    ['lava', 'lava'],
    ['ocean', 'ocean'],
    ['rosegold', 'roseGold'],
    ['gold', 'gold'],
    ['silver', 'silver'],
    ['bronze', 'bronze']
]) as any;

/** Parse defaults ([MS-ODRAWXML] §2.1.4 / OfficeParser). */
const DEFAULT_WIDTH_CM: Literal<0.053> = 0.053;
const DEFAULT_HEIGHT_CM: Literal<0.001> = 0.001;
const DEFAULT_COLOR: Literal<'#000000'> = '#000000';
const DEFAULT_TIP: Literal<'ellipse'> = 'ellipse';
const DEFAULT_RASTER_OP: Literal<'copyPen'> = 'copyPen';
const DEFAULT_CONTEXT_REF: Literal<'#ctx0'> = '#ctx0';
let lastDiagnostics: InkParseDiagnostics = {
    items: [],
    traceCount: 0,
    packetCount: 0,
    pointCount: 0,
    channelValueCount: 0
};

/**
 * Diagnostics from the most recent {@link parseInkXml} invocation.
 *
 * @returns {InkParseDiagnostics} The result.
 * @public
 */
export function getLastInkParseDiagnostics(): InkParseDiagnostics {
    return lastDiagnostics;
}

/**
 * Parse an InkML `ink` root element tree into a branded {@link OfficeInk}.
 *
 * Source: [MS-ODRAWXML] §2.1.4; W3C InkML 1.0; `docs/specs/ink-shared-codec.md`.
 *
 * @param {OpenXmlElement} root - The root.
 * @returns {OfficeInk} The result.
 * @public
 */
export function parseInkXml(root: OpenXmlElement): OfficeInk {
    const diagnostics: InkParseDiagnostic[] = [];
    let packetCount: number = 0;
    let pointCount: number = 0;
    let channelValueCount: number = 0;
    const brushes: InkBrush[] = [];
    const contexts: InkContext[] = [];
    const traces: InkTrace[] = [];
    const treeRoots: InkTraceTreeNode[] = [];
    if (!isInkRoot(root)) {
        lastDiagnostics = {
            items: diagnostics,
            traceCount: 0,
            packetCount: 0,
            pointCount: 0,
            channelValueCount: 0
        };
        return createDecodedInk({
            traces: [],
            brushes: []
        });
    }

    // First pass: definitions (at most one considered; extras ignored after first)
    let sawDefinitions: boolean = false;
    for (const child of root.children) {
        if (child.kind !== 'element' || !isInkMlElement(child)) {
            continue;
        }
        const name: string = child.localName;
        if (IGNORE_LOCAL_NAMES.has(name)) {
            continue;
        }
        if (name === 'definitions') {
            if (sawDefinitions) {
                continue;
            }
            sawDefinitions = true;
            parseDefinitions(child, brushes, contexts);
        }
    }

    // Second pass: traces / groups in document order (C# only walks root children)
    for (const child of root.children) {
        if (child.kind !== 'element' || !isInkMlElement(child)) {
            continue;
        }
        const name: string = child.localName;
        if (IGNORE_LOCAL_NAMES.has(name) || name === 'definitions') {
            continue;
        }
        if (name === 'trace') {
            const {
                trace,
                node,
                stats,
                diagnostic
            } = parseTraceElement(child, traces.length);
            traces.push(trace);
            treeRoots.push(node);
            packetCount += stats.packetCount;
            pointCount += stats.pointCount;
            channelValueCount += stats.channelValueCount;
            if (diagnostic !== undefined) {
                diagnostics.push(diagnostic);
            }
        } else if (name === 'traceGroup') {
            const group: { kind: 'group'; children: InkTraceTreeNode[]; } = parseTraceGroup(child, traces, diagnostics, (s: { packetCount: number; pointCount: number; channelValueCount: number; }) => {
                packetCount += s.packetCount;
                pointCount += s.pointCount;
                channelValueCount += s.channelValueCount;
            });
            if (group.children.length > 0) {
                treeRoots.push(group);
            }
        }
    }
    lastDiagnostics = {
        items: diagnostics,
        traceCount: traces.length,
        packetCount,
        pointCount,
        channelValueCount
    };
    return createDecodedInk({
        traces,
        brushes,
        ...(contexts.length > 0 ? {
            contexts
        } : {}),
        // Always attach tree when traces exist so nesting is available; flatten-only
        // trees are a list of {kind:'trace'} nodes.
        ...(traces.length > 0 ? {
            traceTree: treeRoots
        } : {})
    });
}
/**
 * The is ink root.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {boolean} The result.
 */
function isInkRoot(el: OpenXmlElement): boolean {
    if (el.localName !== 'ink') {
        return false;
    }
    return isInkMlElement(el) || el.namespaceUri === INKML_NAMESPACE;
}
/**
 * The parse definitions.
 *
 * @param {OpenXmlElement} def - The def.
 * @param {InkBrush[]} brushes - The brushes.
 * @param {InkContext[]} contexts - The contexts.
 * @returns {void} Nothing is returned.
 */
function parseDefinitions(def: OpenXmlElement, brushes: InkBrush[], contexts: InkContext[]): void {
    for (const child of def.children) {
        if (child.kind !== 'element' || !isInkMlElement(child)) {
            continue;
        }
        if (IGNORE_LOCAL_NAMES.has(child.localName)) {
            continue;
        }
        if (child.localName === 'brush') {
            brushes.push(parseBrush(child));
        } else if (child.localName === 'context') {
            const ctx: InkContext = parseContext(child);
            if (ctx !== undefined) {
                contexts.push(ctx);
            }
        }
    // context only under definitions (already here); ignore elsewhere handled by root walk
    }
}
/**
 * The parse context.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {InkContext | undefined} The result.
 */
function parseContext(el: OpenXmlElement): InkContext | undefined {
    const rawId: string = readXmlId(el);
    if (rawId === undefined || rawId.length === 0) {
    // Still accept context without id using a synthetic key? Spec requires id for inkSource;
    // skip malformed context without id.
        return undefined;
    }
    const id: string = ensureHash(rawId);
    let inkSourceId: string | undefined;
    const channels: InkChannel[] = [];
    for (const child of el.children) {
        if (child.kind !== 'element' || !isInkMlElement(child)) {
            continue;
        }
        if (IGNORE_LOCAL_NAMES.has(child.localName)) {
            continue;
        }
        if (child.localName === 'inkSource') {
            const srcId: string = readXmlId(child);
            if (srcId !== undefined && srcId.length > 0) {
                inkSourceId = srcId;
            }
            // Walk inkSource for nested traceFormat as Office often nests it here
            collectChannelsFrom(child, channels);
        } else if (child.localName === 'traceFormat') {
            collectChannelsFrom(child, channels);
        }
    }
    const ctx: InkContext = {
        id,
        channels
    };
    if (inkSourceId !== undefined) {
        (ctx as {
            inkSourceId?: string;
        }).inkSourceId = inkSourceId;
    }
    return ctx;
}
/**
 * The collect channels from.
 *
 * @param {OpenXmlElement} el - The el.
 * @param {InkChannel[]} channels - The channels.
 * @returns {void} Nothing is returned.
 */
function collectChannelsFrom(el: OpenXmlElement, channels: InkChannel[]): void {
    for (const child of el.children) {
        if (child.kind !== 'element' || !isInkMlElement(child)) {
            continue;
        }
        if (child.localName === 'traceFormat') {
            collectChannelsFrom(child, channels);
            continue;
        }
        if (child.localName !== 'channel') {
            continue;
        }
        const name: string = function (): string {
            const _nc: string = getAttr(child, 'name');
            return _nc != null ? _nc : '';
        }();
        if (!RECOGNIZED_CHANNELS.has(name)) {
            continue;
        }
        const ch: InkChannel = {
            name
        };
        const type: string = getAttr(child, 'type');
        if (type !== undefined) {
            (ch as {
                type?: string;
            }).type = type;
        }
        const min: string = getAttr(child, 'min');
        if (min !== undefined) {
            (ch as {
                min?: string;
            }).min = min;
        }
        const max: string = getAttr(child, 'max');
        if (max !== undefined) {
            (ch as {
                max?: string;
            }).max = max;
        }
        const units: string = getAttr(child, 'units');
        if (units !== undefined && RECOGNIZED_CHANNEL_UNITS.has(units)) {
            (ch as {
                units?: string;
            }).units = units;
        } else if (units !== undefined) {
            // Preserve units string even if outside short list (cm always recognized)
            (ch as {
                units?: string;
            }).units = units;
        }
        // orientation / respectTo ignored
        channels.push(ch);
    }
}
/**
 * The parse brush.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {InkBrush} The result.
 */
function parseBrush(el: OpenXmlElement): InkBrush {
    const rawId: string = function (): string {
        const _nc: string = readXmlId(el);
        return _nc != null ? _nc : '';
    }();
    const id: string = ensureHash(rawId.length > 0 ? rawId : 'br0');

    // Defaults (parse §2.1.4) — size stored in points after unit conversion
    let widthPt: number = unitValueToPoints(DEFAULT_WIDTH_CM, 'cm');
    let heightPt: number = unitValueToPoints(DEFAULT_HEIGHT_CM, 'cm');
    let units: string = 'cm';
    let color: string = DEFAULT_COLOR;
    let tip: string | undefined = DEFAULT_TIP;
    let rasterOp: string | undefined = DEFAULT_RASTER_OP;
    let ignorePressure: boolean = false;
    let inkEffect: InkEffectType = 'none';
    let anchorX: string | undefined;
    let anchorY: string | undefined;
    let scaleFactor: string | undefined;
    let transparency: number | undefined;
    let antiAliased: boolean | undefined;
    let fitToCurve: boolean | undefined;
    let sawWidth: boolean = false;
    let sawHeight: boolean = false;
    for (const child of el.children) {
        if (child.kind !== 'element' || !isInkMlElement(child)) {
            continue;
        }
        if (child.localName !== 'brushProperty') {
            continue;
        }
        const nameRaw: string = getAttr(child, 'name');
        if (nameRaw === undefined) {
            continue;
        }
        const name: string = nameRaw.trim().toLowerCase();
        if (!BRUSH_PROP_NAMES.has(name)) {
            // Unknown property name → whole property dropped
            continue;
        }
        const valueRaw: string = function (): string {
            const _nc: string = getAttr(child, 'value');
            return _nc != null ? _nc : '';
        }();
        const unitsAttr: string = getAttr(child, 'units');
        switch (name) {
        case 'width':
        {
            const n: number = parseLengthNumber(valueRaw);
            if (n !== undefined) {
                const u: string = unitsAttr != null ? unitsAttr : 'cm';
                widthPt = unitValueToPoints(n, u);
                if (!sawHeight) {
                    units = u;
                }
                sawWidth = true;
                units = u;
            }
            break;
        }
        case 'height':
        {
            const n: number = parseLengthNumber(valueRaw);
            if (n !== undefined) {
                const u: string = unitsAttr != null ? unitsAttr : units;
                heightPt = unitValueToPoints(n, u);
                sawHeight = true;
                if (unitsAttr !== undefined) {
                    units = unitsAttr;
                }
            }
            break;
        }
        case 'color':
        {
            const hex: string = normalizeColor(valueRaw);
            if (hex !== undefined) {
                color = hex;
            }
            break;
        }
        case 'tip':
        {
            if (valueRaw.length > 0) {
                tip = valueRaw;
            }
            break;
        }
        case 'rasterop':
        {
            if (valueRaw.length > 0) {
                rasterOp = valueRaw;
            }
            break;
        }
        case 'ignorepressure':
        {
            ignorePressure = parseBoolish(valueRaw);
            break;
        }
        case 'inkeffects':
        {
            const token: string = valueRaw.trim().toLowerCase().replace(/[_\s-]/g, '');
            const mapped: InkEffectType = EFFECT_TOKENS.get(token);
            if (mapped !== undefined) {
                inkEffect = mapped;
            }
            break;
        }
        case 'anchorx':
        {
            anchorX = valueRaw;
            break;
        }
        case 'anchory':
        {
            anchorY = valueRaw;
            break;
        }
        case 'scalefactor':
        {
            scaleFactor = valueRaw;
            break;
        }
        case 'transparency':
        {
            const n: number = Number(valueRaw);
            if (Number.isFinite(n)) {
                transparency = n;
            }
            break;
        }
        case 'antialiased':
        {
            antiAliased = parseBoolish(valueRaw);
            break;
        }
        case 'fittocurve':
        {
            fitToCurve = parseBoolish(valueRaw);
            break;
        }
        default:
            break;
        }
    }

    // If neither width nor height units seen, keep cm (default source unit)
    if (!sawWidth && !sawHeight) {
        units = 'cm';
    }
    const brush: InkBrush = {
        id,
        color,
        size: {
            width: widthPt,
            height: heightPt
        },
        units,
        inkEffect,
        ignorePressure,
        tip,
        rasterOp
    };
    if (anchorX !== undefined) {
        brush.anchorX = anchorX;
    }
    if (anchorY !== undefined) {
        brush.anchorY = anchorY;
    }
    if (scaleFactor !== undefined) {
        brush.scaleFactor = scaleFactor;
    }
    if (transparency !== undefined) {
        brush.transparency = transparency;
    }
    if (antiAliased !== undefined) {
        brush.antiAliased = antiAliased;
    }
    if (fitToCurve !== undefined) {
        brush.fitToCurve = fitToCurve;
    }
    return brush;
}
/**
 * The parse trace element.
 *
 * @param {OpenXmlElement} el - The el.
 * @param {number} traceIndex - The trace index.
 * @returns {object} The result.
 */
function parseTraceElement(el: OpenXmlElement, traceIndex: number): {
    trace: InkTrace;
    node: InkTraceTreeNode;
    stats: {
        packetCount: number;
        pointCount: number;
        channelValueCount: number;
    };
    diagnostic: InkParseDiagnostic | undefined;
} {
    const brushRefRaw: string = function (): string {
        const _nc: string = getAttr(el, 'brushRef');
        return _nc != null ? _nc : '';
    }();
    const contextRefRaw: string = function (): string {
        const _nc: string = getAttr(el, 'contextRef');
        return _nc != null ? _nc : '';
    }();
    const timeOffset: string = getAttr(el, 'timeOffset');
    const text: string = elementText(el).trim();
    const decoded: TraceDecodeResult = decodeTrace(text);
    let diagnostic: InkParseDiagnostic | undefined;
    // Malformed: non-empty text that produced zero points → diagnostic
    if (text.length > 0 && decoded.points.length === 0) {
        diagnostic = {
            code: DIAG_INVALID_INK_TRACE,
            message: 'malformed or untokenizable ink trace text',
            traceIndex
        };
    }
    const trace: InkTrace = {
        points: decoded.points.map((p: InkPoint) => ({
            x: p.x,
            y: p.y
        })),
        brushRef: brushRefRaw.length > 0 ? ensureHash(brushRefRaw.replace(/^#/, '')) : '',
        contextRef: contextRefRaw.length > 0 ? ensureHash(contextRefRaw.replace(/^#/, '')) : DEFAULT_CONTEXT_REF
    };
    // Preserve brushRef as given with hash; empty string means unset
    if (brushRefRaw.length > 0) {
        (trace as {
            brushRef: string;
        }).brushRef = brushRefRaw.startsWith('#') ? brushRefRaw : ensureHash(brushRefRaw);
    }
    if (timeOffset !== undefined) {
        (trace as {
            timeOffset?: string;
        }).timeOffset = timeOffset;
    }
    return {
        trace,
        node: {
            kind: 'trace',
            traceIndex
        },
        stats: {
            packetCount: decoded.stats.packetCount,
            pointCount: decoded.stats.pointCount,
            channelValueCount: decoded.stats.channelValueCount
        },
        diagnostic
    };
}
/**
 * The parse trace group.
 *
 * @param {OpenXmlElement} el - The el.
 * @param {InkTrace[]} traces - The traces.
 * @param {InkParseDiagnostic[]} diagnostics - The diagnostics.
 * @param {Function} onStats - The on stats.
 * @returns {object} The result.
 */
function parseTraceGroup(el: OpenXmlElement, traces: InkTrace[], diagnostics: InkParseDiagnostic[], onStats: (s: {
    packetCount: number;
    pointCount: number;
    channelValueCount: number;
}) => void): {
        kind: 'group';
        children: InkTraceTreeNode[];
    } {
    const children: InkTraceTreeNode[] = [];
    for (const child of el.children) {
        if (child.kind !== 'element' || !isInkMlElement(child)) {
            continue;
        }
        if (IGNORE_LOCAL_NAMES.has(child.localName)) {
            // annotationXML / annotation: ignored per §2.1.4 (decision: do not retain)
            continue;
        }
        if (child.localName === 'trace') {
            const {
                trace,
                node,
                stats,
                diagnostic
            } = parseTraceElement(child, traces.length);
            traces.push(trace);
            children.push(node);
            onStats(stats);
            if (diagnostic !== undefined) {
                diagnostics.push(diagnostic);
            }
        } else if (child.localName === 'traceGroup') {
            const nested: { kind: 'group'; children: InkTraceTreeNode[]; } = parseTraceGroup(child, traces, diagnostics, onStats);
            if (nested.children.length > 0) {
                children.push(nested);
            }
        }
    }
    return {
        kind: 'group',
        children
    };
}
/**
 * The read xml id.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {string | undefined} The result.
 */
function readXmlId(el: OpenXmlElement): string | undefined {
    const fromNs: string = getAttr(el, 'id', XML_NAMESPACE);
    if (fromNs !== undefined) {
        return fromNs;
    }
    return getAttr(el, 'id');
}
/**
 * The ensure hash.
 *
 * @param {string} id - The id.
 * @returns {string} The result.
 */
function ensureHash(id: string): string {
    return id.startsWith('#') ? id : `#${id}`;
}
/**
 * The parse length number.
 *
 * @param {string} raw - The raw.
 * @returns {number | undefined} The result.
 */
function parseLengthNumber(raw: string): number | undefined {
    let s: string = raw.trim();
    if (s.length === 0) {
        return undefined;
    }
    // GetPointValue: leading `.` → `0.`
    if (s.startsWith('.')) {
        s = `0${s}`;
    }
    const n: number = Number(s);
    return Number.isFinite(n) ? n : undefined;
}
/**
 * The normalize color.
 *
 * @param {string} raw - The raw.
 * @returns {string | undefined} The result.
 */
function normalizeColor(raw: string): string | undefined {
    let s: string = raw.trim();
    if (s.length === 0) {
        return undefined;
    }
    if (!s.startsWith('#')) {
        s = `#${s}`;
    }
    // Accept #RGB or #RRGGBB
    if (/^#[0-9A-Fa-f]{6}$/.test(s) || /^#[0-9A-Fa-f]{3}$/.test(s)) {
        if (s.length === 4) {
            const r: string = s.charAt(1);
            const g: string = s.charAt(2);
            const b: string = s.charAt(3);
            return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
        }
        return s.toUpperCase();
    }
    return undefined;
}
/**
 * The parse boolish.
 *
 * @param {string} raw - The raw.
 * @returns {boolean} The result.
 */
function parseBoolish(raw: string): boolean {
    const s: string = raw.trim().toLowerCase();
    return s === '1' || s === 'true';
}
