/**
 * Pure layout helpers for the Status Bar (TASK-1014).
 *
 * @module @syncfusion/ej2-pptxeditor/status-bar/layout
 */

/**
 * Discrete zoom snap levels for the status-bar slider (percent).
 * Includes 300 (ribbon View presets omit 300).
 * @private
 */
export const STATUS_BAR_ZOOM_SNAPS: number[] = [
    25, 50, 75, 100, 125, 150, 200, 300, 400
];

/**
 * Breakpoint matching `$ej2-pptx-bp-md` / thumbnail desktop min.
 * Desktop ≥ this width shows Fit + slider + view badge.
 * @private
 */
export const STATUS_BAR_DESKTOP_MIN_PX: number = 768;

/**
 * Default view-mode badge label (before the zoom cluster).
 * @private
 */
export const DEFAULT_VIEW_MODE_LABEL: string = 'Reading View';

/**
 * Approximate status bar height in CSS px (token may override in SCSS).
 * @private
 */
export const STATUS_BAR_HEIGHT_PX: number = 28;

/**
 * Plus/minus step for the status-bar zoom cluster (percentage points).
 * Matches host {@link PptxEditor.zoomIn} / {@link PptxEditor.zoomOut}.
 * The slider still uses {@link STATUS_BAR_ZOOM_SNAPS}.
 * @private
 */
export const STATUS_BAR_ZOOM_STEP: number = 10;

/** Minimum zoom percent the status-bar buttons may request. * @private
 */
export const STATUS_BAR_ZOOM_MIN: number = 10;

/** Maximum zoom percent the status-bar buttons may request. * @private
 */
export const STATUS_BAR_ZOOM_MAX: number = 400;

/**
 * Steps a zoom percent by ±{@link STATUS_BAR_ZOOM_STEP}, clamped to 10–400.
 * Does not snap to {@link STATUS_BAR_ZOOM_SNAPS}.
 *
 * @param {number} percent - Current zoom percentage
 * @param {-1|1} direction - `-1` decrease, `1` increase
 * @returns {number} Stepped zoom percent
 * @private
 */
export function stepZoomPercent(percent: number, direction: -1 | 1): number {
    const base: number =
    typeof percent === 'number' && Number.isFinite(percent) ? percent : 100;
    const delta: number = direction < 0 ? -STATUS_BAR_ZOOM_STEP : STATUS_BAR_ZOOM_STEP;
    const next: number = Math.round(base) + delta;
    return Math.min(STATUS_BAR_ZOOM_MAX, Math.max(STATUS_BAR_ZOOM_MIN, next));
}

/**
 * Snaps a zoom percent to the nearest discrete status-bar level.
 * When equidistant, prefers the higher snap value.
 *
 * @param {number} percent - Raw zoom percentage
 * @returns {number} Nearest snap percent from {@link STATUS_BAR_ZOOM_SNAPS}
 * @private
 */
export function snapZoomPercent(percent: number): number {
    if (typeof percent !== 'number' || !Number.isFinite(percent)) {
        return 100;
    }
    const snaps: number[] = STATUS_BAR_ZOOM_SNAPS;
    let best: number = snaps[0];
    let bestDist: number = Math.abs(percent - best);
    for (let i: number = 1; i < snaps.length; i++) {
        const candidate: number = snaps[i];
        const dist: number = Math.abs(percent - candidate);
        if (dist < bestDist || (dist === bestDist && candidate > best)) {
            best = candidate;
            bestDist = dist;
        }
    }
    return best;
}

/**
 * Index of the nearest snap level for a zoom percent.
 *
 * @param {number} percent - Zoom percentage
 * @returns {number} Index into {@link STATUS_BAR_ZOOM_SNAPS}
 * @private
 */
export function snapIndexForPercent(percent: number): number {
    const snapped: number = snapZoomPercent(percent);
    const snaps: number[] = STATUS_BAR_ZOOM_SNAPS;
    for (let i: number = 0; i < snaps.length; i++) {
        if (snaps[i] === snapped) {
            return i;
        }
    }
    return 3; // 100%
}

/**
 * Zoom percent for a snap index (clamped).
 *
 * @param {number} index - Snap index
 * @returns {number} Snap percent
 * @private
 */
export function percentForSnapIndex(index: number): number {
    const snaps: number[] = STATUS_BAR_ZOOM_SNAPS;
    if (typeof index !== 'number' || !Number.isFinite(index)) {
        return 100;
    }
    const clamped: number = Math.min(
        snaps.length - 1,
        Math.max(0, Math.round(index))
    );
    return snaps[clamped];
}

/**
 * Formats the left slide counter as "Slide N of M" (1-based N).
 *
 * @param {number} index0 - 0-based slide index
 * @param {number} count - Total slide count
 * @param {string} [template] - Localized template with `{0}` (slide) and `{1}` (count)
 * @returns {string} Counter label
 * @private
 */
export function formatSlideCounter(index0: number, count: number, template: string = 'Slide {0} of {1}'): string {
    const safeCount: number =
    typeof count === 'number' && Number.isFinite(count) && count > 0
        ? Math.floor(count)
        : 1;
    let n: number = 1;
    if (typeof index0 === 'number' && Number.isFinite(index0)) {
        n = Math.min(safeCount, Math.max(1, Math.floor(index0) + 1));
    }
    return template.replace('{0}', String(n)).replace('{1}', String(safeCount));
}

/**
 * Formats zoom percent label for the status bar.
 *
 * @param {number} percent - Zoom percentage
 * @returns {string} Label such as `100%`
 * @private
 */
export function formatStatusZoomLabel(percent: number): string {
    if (typeof percent !== 'number' || !Number.isFinite(percent)) {
        return '100%';
    }
    return String(Math.round(percent)) + '%';
}

/**
 * Whether a viewport width is treated as desktop for full status-bar chrome.
 *
 * @param {number} viewportWidthPx - Window or host width
 * @returns {boolean} True when Fit / slider / badge should show
 * @private
 */
export function isStatusBarDesktop(viewportWidthPx: number): boolean {
    return (
        typeof viewportWidthPx === 'number' &&
    Number.isFinite(viewportWidthPx) &&
    viewportWidthPx >= STATUS_BAR_DESKTOP_MIN_PX
    );
}
