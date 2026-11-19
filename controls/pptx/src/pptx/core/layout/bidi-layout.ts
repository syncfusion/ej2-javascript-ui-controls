import { _Bidirectional } from './bidirectional';
import { TextLayoutSegment } from './layout-paragraph';
import { arrayAt, arraySet } from '../util/es5-compat';

interface VisualWidget {
    readonly segment: TextLayoutSegment;
    readonly visualIndex: number;
}

/** Internal test hook called only after the strong-RTL guard is passed. */
export type BidiLayoutEntry = () => void;

/**
 * Reports whether text contains a strong character handled by the copied bidi
 * engine. Isolates are intentionally outside this Stage-1 range.
 *
 * @param {string} text - Logical-order paragraph or line text.
 * @returns {boolean} Whether the text contains strong Hebrew or Arabic text.
 * @private
 */
export function containsStrongRightToLeft(text: string): boolean {
    return /[\u0590-\u08ff\ufb1d-\ufdff\ufe70-\ufeff]/u.test(text);
}

/**
 * Ports the integration roles of `Paragraph.SplitTextPartsByRTL`,
 * `CombineconsecutiveRTL`, `ReorderWidgets`, `UpdateBounds`,
 * `GetStartPosition`, `ShiftWidgetsForRTLLayouting` and
 * `IsLineContainsRTL`. Logical text and UTF-16 offsets are retained; only
 * segment visual order and x positions change.
 *
 * @param {ReadonlyArray<TextLayoutSegment>} segments - AL2 logical segments.
 * @param {string} logicalText - Logical-order line text.
 * @param {boolean} paragraphRightToLeft - Paragraph bidi setting.
 * @param {BidiLayoutEntry} entered - Optional guarded-entry test hook.
 * @returns {ReadonlyArray<TextLayoutSegment>} Positioned visual segments.
 * @private
 */
export function applyBidiLayout(
    segments: ReadonlyArray<TextLayoutSegment>,
    logicalText: string,
    paragraphRightToLeft: boolean,
    entered?: BidiLayoutEntry
): ReadonlyArray<TextLayoutSegment> {
    // AN invariant: ordinary AL2 lines return the original array by identity.
    if (!containsStrongRightToLeft(logicalText)) {
        return segments;
    }
    if (entered) {
        entered();
    }
    return shiftWidgetsForRtlLayouting(segments, logicalText, paragraphRightToLeft);
}

/**
 * Ports `Paragraph.ShiftWidgetsForRTLLayouting`.
 *
 * @param {ReadonlyArray<TextLayoutSegment>} segments - AL2 segments for one laid-out line.
 * @param {string} logicalText - Logical text behind the segments.
 * @param {boolean} paragraphRightToLeft - Authored paragraph RTL flag.
 * @returns {ReadonlyArray<TextLayoutSegment>} Re-ordered and re-positioned segments.
 */
function shiftWidgetsForRtlLayouting(
    segments: ReadonlyArray<TextLayoutSegment>, logicalText: string, paragraphRightToLeft: boolean
): ReadonlyArray<TextLayoutSegment> {
    if (!isLineContainsRtl(logicalText) || segments.length === 0) {
        return segments;
    }
    const widgets: ReadonlyArray<VisualWidget> = splitTextPartsByRtl(segments, logicalText, paragraphRightToLeft);
    const combined: ReadonlyArray<VisualWidget> = combineConsecutiveRtl(widgets, logicalText);
    const reordered: ReadonlyArray<TextLayoutSegment> = reorderWidgets(combined, logicalText);
    return updateBounds(reordered, segments, logicalText, paragraphRightToLeft);
}

/**
 * Ports the visual-range role of `Paragraph.SplitTextPartsByRTL`.
 *
 * @param {ReadonlyArray<TextLayoutSegment>} segments - AL2 segments for one laid-out line.
 * @param {string} logicalText - Logical text behind the segments.
 * @param {boolean} paragraphRightToLeft - Authored paragraph RTL flag.
 * @returns {ReadonlyArray<VisualWidget>} Widgets tagged with their visual index.
 */
function splitTextPartsByRtl(
    segments: ReadonlyArray<TextLayoutSegment>, logicalText: string, paragraphRightToLeft: boolean
): ReadonlyArray<VisualWidget> {
    if (!containsStrongRightToLeft(logicalText)) {
        return segments.map((segment: TextLayoutSegment, index: number): VisualWidget => ({ segment, visualIndex: index }));
    }
    const bidi: _Bidirectional = new _Bidirectional();
    bidi._getLogicalToVisualString(logicalText, paragraphRightToLeft);
    const visualPositions: number[] = new Array(logicalText.length);
    bidi._indexes.forEach((logicalIndex: number, visualIndex: number): void => {
        arraySet(visualPositions, logicalIndex, visualIndex);
    });
    return segments.map((segment: TextLayoutSegment): VisualWidget => ({
        segment,
        visualIndex: segmentVisualPosition(segment, visualPositions)
    }));
}

/**
 * Ports the adjacency role of `Paragraph.CombineconsecutiveRTL`.
 *
 * @param {ReadonlyArray<VisualWidget>} widgets - Visual-indexed widgets for the line.
 * @param {string} logicalText - Logical text behind the segments.
 * @returns {ReadonlyArray<VisualWidget>} Widgets sorted into visual order.
 */
function combineConsecutiveRtl(
    widgets: ReadonlyArray<VisualWidget>, logicalText: string
): ReadonlyArray<VisualWidget> {
    if (!containsStrongRightToLeft(logicalText)) {
        return widgets;
    }
    // Formatting spans must remain separate, so combining here means treating
    // adjacent RTL widgets as one sortable visual sequence, not merging text.
    return widgets.slice().sort((left: VisualWidget, right: VisualWidget): number =>
        left.visualIndex - right.visualIndex);
}

/**
 * Ports `Paragraph.ReorderWidgets`.
 *
 * @param {ReadonlyArray<VisualWidget>} widgets - Visual-ordered widgets for the line.
 * @param {string} logicalText - Logical text behind the segments.
 * @returns {ReadonlyArray<TextLayoutSegment>} Segments in visual order.
 */
function reorderWidgets(
    widgets: ReadonlyArray<VisualWidget>, logicalText: string
): ReadonlyArray<TextLayoutSegment> {
    if (!containsStrongRightToLeft(logicalText)) {
        return widgets.map((widget: VisualWidget): TextLayoutSegment => widget.segment);
    }
    return widgets.map((widget: VisualWidget): TextLayoutSegment => widget.segment);
}

/**
 * Ports `Paragraph.UpdateBounds`.
 *
 * @param {ReadonlyArray<TextLayoutSegment>} reordered - Segments in visual order.
 * @param {ReadonlyArray<TextLayoutSegment>} original - Original AL2 segments.
 * @param {string} logicalText - Logical text behind the segments.
 * @param {boolean} paragraphRightToLeft - Authored paragraph RTL flag.
 * @returns {ReadonlyArray<TextLayoutSegment>} Segments with updated `leftPt` bounds.
 */
function updateBounds(
    reordered: ReadonlyArray<TextLayoutSegment>,
    original: ReadonlyArray<TextLayoutSegment>,
    logicalText: string,
    paragraphRightToLeft: boolean
): ReadonlyArray<TextLayoutSegment> {
    if (!containsStrongRightToLeft(logicalText)) {
        return original;
    }
    let position: number = getStartPosition(original, logicalText, paragraphRightToLeft);
    if (paragraphRightToLeft) {
        return reordered.map((segment: TextLayoutSegment): TextLayoutSegment => {
            position -= segment.widthPt;
            return { ...segment, leftPt: position };
        });
    }
    return reordered.map((segment: TextLayoutSegment): TextLayoutSegment => {
        const positioned: TextLayoutSegment = { ...segment, leftPt: position };
        position += segment.widthPt;
        return positioned;
    });
}

/**
 * Ports `Paragraph.GetStartPosition`.
 *
 * @param {ReadonlyArray<TextLayoutSegment>} segments - Original AL2 segments.
 * @param {string} logicalText - Logical text behind the segments.
 * @param {boolean} paragraphRightToLeft - Authored paragraph RTL flag.
 * @returns {number} Starting `leftPt` for re-ordering.
 */
function getStartPosition(
    segments: ReadonlyArray<TextLayoutSegment>, logicalText: string, paragraphRightToLeft: boolean
): number {
    if (!containsStrongRightToLeft(logicalText) || segments.length === 0) {
        return segments.length === 0 ? 0 : segments[0].leftPt;
    }
    if (paragraphRightToLeft) {
        return segments.reduce((right: number, segment: TextLayoutSegment): number =>
            Math.max(right, segment.leftPt + segment.widthPt), Number.NEGATIVE_INFINITY);
    }
    return segments.reduce((left: number, segment: TextLayoutSegment): number =>
        Math.min(left, segment.leftPt), Number.POSITIVE_INFINITY);
}

/** Ports `Paragraph.IsLineContainsRTL`.
 * @param {string} logicalText - Logical-order line text.
 * @returns {boolean} Whether the line contains strong RTL text.
 */
function isLineContainsRtl(logicalText: string): boolean {
    if (!containsStrongRightToLeft(logicalText)) {
        return false;
    }
    return true;
}

/** Smallest visual index covered by a segment.
 * @param {TextLayoutSegment} segment - Segment whose visual position is needed.
 * @param {ReadonlyArray<number>} positions - Logical-to-visual index map.
 * @returns {number} Smallest visual index, or +Infinity when unmapped.
 */
function segmentVisualPosition(segment: TextLayoutSegment, positions: ReadonlyArray<number>): number {
    let result: number = Number.POSITIVE_INFINITY;
    for (let index: number = segment.startOffset; index < segment.endOffset; index++) {
        const position: number | undefined = arrayAt(positions, index);
        if (position !== undefined) {
            result = Math.min(result, position);
        }
    }
    return result;
}

