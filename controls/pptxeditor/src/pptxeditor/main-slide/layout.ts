/**
 * Pure layout math for the Main Slide Area.
 *
 * @module @syncfusion/ej2-pptxeditor/main-slide/layout
 *
 * Coordinates arrive in PowerPoint points (pt). CSS pixels use the standard
 * CSS absolute-length mapping: `px = pt * (96 / 72)`.
 */

/**
 * Points → CSS pixels scale factor (96 CSS px per inch / 72 pt per inch).
 * @internal
 */
export const PT_TO_PX: number = 96 / 72;

/**
 * Default slide width in points (standard 16:9 widescreen EMU-derived size).
 * Used until presentation slide size is supplied by the document pipeline.
 * @internal
 */
export const DEFAULT_SLIDE_WIDTH_PT: number = 960;

/**
 * Default slide height in points (standard 16:9 widescreen).
 * @internal
 */
export const DEFAULT_SLIDE_HEIGHT_PT: number = 540;

/**
 * Padding (CSS px) applied on each side when computing fit scales so the
 * frame is not flush against the viewport edge.
 * @internal
 */
export const FIT_PADDING_PX: number = 24;

/**
 * Minimum zoom percentage (matches editor {@link setZoom} clamp).
 * @internal
 */
export const MIN_ZOOM_PERCENT: number = 10;

/**
 * Maximum zoom percentage (matches editor {@link setZoom} clamp).
 * @internal
 */
export const MAX_ZOOM_PERCENT: number = 400;

/**
 * How the display scale is derived from viewport and slide geometry.
 * @internal
 */
export type ZoomMode = 'fit-to-window' | 'fit-width' | 'percent';

/**
 * Result of computing the on-screen slide layout.
 * @internal
 */
export interface DisplayLayout {
    /** Display scale relative to 1 = 100% of natural pt→px size. */
    scale: number;
    /** Natural content width in CSS px (before scale). */
    contentWidthPx: number;
    /** Natural content height in CSS px (before scale). */
    contentHeightPx: number;
    /** Frame width in CSS px after scale (what the border wraps). */
    frameWidthPx: number;
    /** Frame height in CSS px after scale. */
    frameHeightPx: number;
    /** Rounded zoom percent for ribbon sync (clamped 10–400). */
    zoomPercent: number;
}

/**
 * Converts points to CSS pixels.
 *
 * @param {number} pt - Length in points
 * @returns {number} CSS pixel length
 * @internal
 */
export function ptToPx(pt: number): number {
    return pt * PT_TO_PX;
}

/**
 * Clamps a zoom percentage to the supported 10–400 range and rounds.
 *
 * @param {number} percent - Requested zoom percentage
 * @returns {number} Clamped integer zoom percent
 * @internal
 */
export function clampZoomPercent(percent: number): number {
    if (typeof percent !== 'number' || !Number.isFinite(percent)) {
        return 100;
    }
    return Math.min(
        MAX_ZOOM_PERCENT,
        Math.max(MIN_ZOOM_PERCENT, Math.round(percent))
    );
}

/**
 * Scale that fits the entire slide inside the viewport with padding.
 *
 * @param {number} viewportWidthPx - Viewport client width
 * @param {number} viewportHeightPx - Viewport client height
 * @param {number} slideWidthPx - Natural slide width in CSS px
 * @param {number} slideHeightPx - Natural slide height in CSS px
 * @param {number} paddingPx - Padding on each side (default {@link FIT_PADDING_PX})
 * @returns {number} Uniform scale factor (≥ 0; 1 when inputs are non-positive)
 * @internal
 */
export function computeFitToWindowScale(
    viewportWidthPx: number,
    viewportHeightPx: number,
    slideWidthPx: number,
    slideHeightPx: number,
    paddingPx: number = FIT_PADDING_PX
): number {
    if (
        slideWidthPx <= 0 ||
    slideHeightPx <= 0 ||
    viewportWidthPx <= 0 ||
    viewportHeightPx <= 0
    ) {
        return 1;
    }
    const availW: number = Math.max(0, viewportWidthPx - 2 * paddingPx);
    const availH: number = Math.max(0, viewportHeightPx - 2 * paddingPx);
    if (availW <= 0 || availH <= 0) {
        return 1;
    }
    return Math.min(availW / slideWidthPx, availH / slideHeightPx);
}

/**
 * Scale that fits slide width inside the viewport with horizontal padding.
 *
 * @param {number} viewportWidthPx - Viewport client width
 * @param {number} slideWidthPx - Natural slide width in CSS px
 * @param {number} paddingPx - Padding on each side (default {@link FIT_PADDING_PX})
 * @returns {number} Scale factor (≥ 0; 1 when inputs are non-positive)
 * @internal
 */
export function computeFitWidthScale(
    viewportWidthPx: number,
    slideWidthPx: number,
    paddingPx: number = FIT_PADDING_PX
): number {
    if (slideWidthPx <= 0 || viewportWidthPx <= 0) {
        return 1;
    }
    const availW: number = Math.max(0, viewportWidthPx - 2 * paddingPx);
    if (availW <= 0) {
        return 1;
    }
    return availW / slideWidthPx;
}

/**
 * Computes display layout for the given mode, viewport, and slide size.
 *
 * @param {ZoomMode} mode - Active zoom mode
 * @param {number} viewportWidthPx - Viewport client width
 * @param {number} viewportHeightPx - Viewport client height
 * @param {number} slideWidthPt - Intrinsic slide width in points
 * @param {number} slideHeightPt - Intrinsic slide height in points
 * @param {number} zoomPercent - Host zoom percent (used in `percent` mode)
 * @param {number} paddingPx - Fit padding
 * @returns {DisplayLayout} Display layout metrics
 * @internal
 */
export function computeDisplayLayout(
    mode: ZoomMode,
    viewportWidthPx: number,
    viewportHeightPx: number,
    slideWidthPt: number,
    slideHeightPt: number,
    zoomPercent: number,
    paddingPx: number = FIT_PADDING_PX
): DisplayLayout {
    const contentWidthPx: number = ptToPx(slideWidthPt);
    const contentHeightPx: number = ptToPx(slideHeightPt);

    let scale: number;
    switch (mode) {
    case 'fit-to-window':
        scale = computeFitToWindowScale(
            viewportWidthPx,
            viewportHeightPx,
            contentWidthPx,
            contentHeightPx,
            paddingPx
        );
        break;
    case 'fit-width':
        scale = computeFitWidthScale(viewportWidthPx, contentWidthPx, paddingPx);
        break;
    case 'percent':
    default:
        scale = clampZoomPercent(zoomPercent) / 100;
        break;
    }

    if (!Number.isFinite(scale) || scale <= 0) {
        scale = 1;
    }

    return {
        scale,
        contentWidthPx,
        contentHeightPx,
        frameWidthPx: contentWidthPx * scale,
        frameHeightPx: contentHeightPx * scale,
        zoomPercent: clampZoomPercent(scale * 100)
    };
}
