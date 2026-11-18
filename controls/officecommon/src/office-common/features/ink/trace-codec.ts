import { Literal } from '../../core/literal-type';
/**
 * Pure InkML trace codec (W3C InkML §3.2.1 via [MS-ODRAWXML] §1.2.1 / §2.1.4).
 *
 * Decodes differential-prefix packet text into absolute channel rows and plane
 * points; encodes points as absolute `"x y, x y, …"` text. No XML dependency.
 */

/**
 * Plane point used by ink traces and scaled path helpers.
 *
 * @private
 */
export interface InkPoint {
    /** Horizontal coordinate in the active ink plane units. */
    readonly x: number;
    /** Vertical coordinate in the active ink plane units. */
    readonly y: number;
}

/**
 * Axis-aligned bounding box over decoded plane points.
 *
 * @private
 */
export interface InkBounds {
    /** Minimum horizontal coordinate among the points. */
    readonly minX: number;
    /** Minimum vertical coordinate among the points. */
    readonly minY: number;
    /** Maximum horizontal coordinate among the points. */
    readonly maxX: number;
    /** Maximum vertical coordinate among the points. */
    readonly maxY: number;
}

/**
 * Width and height extent in the same coordinate space as plane points.
 *
 * @private
 */
export interface InkExtent {
    /** Horizontal span of the drawing area. */
    readonly width: number;
    /** Vertical span of the drawing area. */
    readonly height: number;
}

/**
 * Security / guard counters for a decode pass.
 *
 * Consumers enforce hard limits; this module only surfaces counts so empty or
 * whitespace-only input cannot loop unbounded without observability.
 *
 * @public
 */
export interface TraceDecodeStats {
    readonly packetCount: number;
    readonly channelValueCount: number;
    readonly pointCount: number;
}

/**
 * Result of decoding a trace string to channel rows and plane points.
 *
 * @public
 */
export interface TraceDecodeResult {
    /** Absolute channel rows in document channel order (default X, Y, …). */
    readonly channelRows: ReadonlyArray<ReadonlyArray<number>>;
    /** Plane points from X/Y reduction (missing X or Y → point omitted). */
    readonly points: ReadonlyArray<InkPoint>;
    /** Guard counters for the decode pass. */
    readonly stats: TraceDecodeStats;
}

const PREFIX_ABSOLUTE: Literal<'!'> = '!';
const PREFIX_FIRST_DIFF: Literal<'\''> = '\'';
const PREFIX_SECOND_DIFF: Literal<'"'> = '"';

/**
 * Tokenize a single channel value, stripping an optional InkML prefix.
 * Source: W3C InkML §3.2.1 — `!` absolute, `'` first difference, `"` second difference.
 *
 * @param {string} token - The token.
 * @returns {object} The result.
 */
function splitPrefix(token: string): {
    prefix: 'absolute' | 'first' | 'second' | undefined;
    raw: string;
} {
    if (token.length === 0) {
        return { prefix: undefined, raw: token };
    }
    const head: string = token.charAt(0);
    if (head === PREFIX_ABSOLUTE) {
        return { prefix: 'absolute', raw: token.slice(1) };
    }
    if (head === PREFIX_FIRST_DIFF) {
        return { prefix: 'first', raw: token.slice(1) };
    }
    if (head === PREFIX_SECOND_DIFF) {
        return { prefix: 'second', raw: token.slice(1) };
    }
    return { prefix: undefined, raw: token };
}

/**
 * The parse number.
 *
 * @param {string} raw - The raw.
 * @returns {number | undefined} The result.
 */
function parseNumber(raw: string): number | undefined {
    if (raw.length === 0) {
        return undefined;
    }
    const n: number = Number(raw);
    return Number.isFinite(n) ? n : undefined;
}

/**
 * Decode InkML trace text into absolute channel rows and X/Y plane points.
 *
 * Rules (W3C InkML §3.2.1):
 * - Packets are comma-separated.
 * - Channel values are whitespace-separated.
 * - A `!` / `'` / `"` prefix before a value switches interpretation for the
 *   **rest of that packet** (absolute, first-difference, second-difference).
 * - First differences apply against the previous packet's same-channel value.
 * - Second differences accumulate per channel across packets.
 * - Default channel order when no context is supplied: X then Y.
 * - Extra channels are tolerated; reduction uses the first two as X/Y when
 *   present. A row missing X or Y does not produce a plane point.
 *
 * Empty / whitespace-only input yields zero packets and zero points (guarded).
 *
 * @param {string} traceText - The trace text.
 * @returns {TraceDecodeResult} The result.
 * @public
 */
export function decodeTrace(traceText: string): TraceDecodeResult {
    const trimmed: string = traceText.trim();
    if (trimmed.length === 0) {
        return {
            channelRows: [],
            points: [],
            stats: { packetCount: 0, channelValueCount: 0, pointCount: 0 }
        };
    }

    const packetStrings: string[] = trimmed.split(',');
    const channelRows: number[][] = [];
    const points: InkPoint[] = [];
    let channelValueCount: number = 0;

    // Previous absolute channel values (for first-difference).
    let previous: Map<number, number> = new Map<number, number>();
    // Running second-difference deltas per channel (mutated in place per index).
    const secondDelta: Map<number, number> = new Map<number, number>();
    // Default mode between packets is absolute until a prefix appears.
    let defaultMode: 'absolute' | 'first' | 'second' = 'absolute';

    for (const packetString of packetStrings) {
        const tokens: string[] = packetString.trim().split(/\s+/).filter((t: string) => t.length > 0);
        if (tokens.length === 0) {
            // Empty packet (e.g. trailing comma) — skip without inventing channels.
            continue;
        }

        let mode: 'absolute' | 'first' | 'second' = defaultMode;
        const row: number[] = [];

        for (const [i, piece] of tokens.entries()) {
            if (piece === undefined) {
                continue;
            }
            const { prefix, raw } = splitPrefix(piece);
            if (prefix !== undefined) {
                mode = prefix;
                // Prefix mode persists for subsequent packets until another prefix.
                defaultMode = prefix;
            }
            const value: number = parseNumber(raw);
            channelValueCount += 1;
            if (value === undefined) {
                // Malformed token: skip channel slot (best-effort; no invented number).
                continue;
            }

            let absolute: number;
            if (mode === 'absolute') {
                absolute = value;
                // Reset second-diff accumulator for this channel when absolute is used.
                secondDelta.set(i, 0);
            } else if (mode === 'first') {
                const previousValue: number | undefined = previous.get(i);
                const base: number = (previousValue != null ? previousValue : 0);
                absolute = base + value;
                secondDelta.set(i, value);
            } else {
                // second difference: accumulate delta, then add to previous absolute
                const storedDelta: number | undefined = secondDelta.get(i);
                const prevDelta: number = (storedDelta != null ? storedDelta : 0);
                const newDelta: number = prevDelta + value;
                secondDelta.set(i, newDelta);
                const previousValue: number | undefined = previous.get(i);
                const base: number = (previousValue != null ? previousValue : 0);
                absolute = base + newDelta;
            }
            // Channels skipped as malformed leave holes, so length is set before the push.
            row.length = i;
            row.push(absolute);
        }

        channelRows.push(row);
        previous = new Map<number, number>();
        row.forEach((rowValue: number, channel: number) => previous.set(channel, rowValue));

        const x: number = row[0];
        const y: number = row[1];
        if (x !== undefined && y !== undefined) {
            points.push({ x, y });
        }
    }

    return {
        channelRows,
        points,
        stats: {
            packetCount: channelRows.length,
            channelValueCount,
            pointCount: points.length
        }
    };
}

/**
 * Encode plane points as absolute InkML trace text (`"x y, x y, …"`).
 *
 * Always absolute (no differential prefixes). Generated from points only —
 * never from stored markup (DOM mandate).
 *
 * @param {ReadonlyArray<InkPoint>} points - The points.
 * @returns {string} The result.
 * @public
 */
export function encodeTrace(points: ReadonlyArray<InkPoint>): string {
    if (points.length === 0) {
        return '';
    }
    return points.map((p: InkPoint) => `${formatCoord(p.x)} ${formatCoord(p.y)}`).join(', ');
}

/**
 * The format coord.
 *
 * @param {number} n - The n.
 * @returns {string} The result.
 */
function formatCoord(n: number): string {
    // Prefer compact integer form when exact; otherwise default number string.
    if (Number.isInteger(n)) {
        return String(n);
    }
    return String(n);
}

/**
 * Compute axis-aligned bounds over plane points.
 * Empty input returns a zero box (min=max=0) so callers can branch on count.
 *
 * @param {ReadonlyArray<InkPoint>} points - The points.
 * @returns {InkBounds} The result.
 * @public
 */
export function computeInkBounds(points: ReadonlyArray<InkPoint>): InkBounds {
    const first: InkPoint = points[0];
    if (first === undefined) {
        return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }
    let minX: number = first.x;
    let minY: number = first.y;
    let maxX: number = minX;
    let maxY: number = minY;
    for (const p of points.slice(1)) {
        if (p === undefined) {
            continue;
        }
        if (p.x < minX) {minX = p.x; }
        if (p.y < minY) {minY = p.y; }
        if (p.x > maxX) {maxX = p.x; }
        if (p.y > maxY) {maxY = p.y; }
    }
    return { minX, minY, maxX, maxY };
}

/**
 * Uniform scale of decoded strokes into an extent **without re-zeroing**.
 *
 * scale = min(extent.w / (maxX−minX), extent.h / (maxY−minY)) when the span
 * is positive; origin of the coordinate system is preserved (decoded path).
 * Degenerate (zero-span) axes map to the extent origin for that axis only.
 *
 * Source: cross-repo ink spec § Parser behavior — uniform scale for decoded
 * strokes.
 *
 * @param {ReadonlyArray<InkPoint>} points - The points.
 * @param {InkExtent} extent - The extent.
 * @returns {ReadonlyArray<InkPoint>} The result.
 * @public
 */
export function scalePointsUniform(
    points: ReadonlyArray<InkPoint>,
    extent: InkExtent
): ReadonlyArray<InkPoint> {
    if (points.length === 0) {
        return [];
    }
    const bounds: InkBounds = computeInkBounds(points);
    const spanX: number = bounds.maxX - bounds.minX;
    const spanY: number = bounds.maxY - bounds.minY;
    const scaleX: number = spanX > 0 ? extent.width / spanX : 0;
    const scaleY: number = spanY > 0 ? extent.height / spanY : 0;
    const scale: number =
    spanX > 0 && spanY > 0
        ? Math.min(scaleX, scaleY)
        : spanX > 0
            ? scaleX
            : spanY > 0
                ? scaleY
                : 0;

    return points.map((p: InkPoint) => ({
        x: p.x * scale,
        y: p.y * scale
    }));
}

/**
 * Stretch-to-fit scale for **authored** strokes: re-zero to minX/minY, then
 * stretch independently to the extent.
 *
 * Source: cross-repo ink spec § Parser behavior — authored strokes re-zero
 * and stretch to the extent.
 *
 * @param {ReadonlyArray<InkPoint>} points - The points.
 * @param {InkExtent} extent - The extent.
 * @returns {ReadonlyArray<InkPoint>} The result.
 * @public
 */
export function scalePointsStretch(
    points: ReadonlyArray<InkPoint>,
    extent: InkExtent
): ReadonlyArray<InkPoint> {
    if (points.length === 0) {
        return [];
    }
    const bounds: InkBounds = computeInkBounds(points);
    const spanX: number = bounds.maxX - bounds.minX;
    const spanY: number = bounds.maxY - bounds.minY;
    const scaleX: number = spanX > 0 ? extent.width / spanX : 0;
    const scaleY: number = spanY > 0 ? extent.height / spanY : 0;

    return points.map((p: InkPoint) => ({
        x: spanX > 0 ? (p.x - bounds.minX) * scaleX : 0,
        y: spanY > 0 ? (p.y - bounds.minY) * scaleY : 0
    }));
}
