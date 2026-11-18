/**
 * Pure layout helpers for the Thumbnail Panel (TASK-1013).
 *
 * @module @syncfusion/ej2-pptxeditor/thumbnail-panel/layout
 *
 * Thumbnail geometry reuses the same pt → CSS px mapping as the main slide
 * (`pt * 96/72`) so mini previews share aspect ratio with the main frame.
 */

import { ptToPx } from '../main-slide/layout';

/**
 * Default target width of the thumbnail slide surface (CSS px).
 */
export const DEFAULT_THUMBNAIL_WIDTH_PX: number = 176;

/**
 * Approximate target height for a 16:9 slide at default width (CSS px).
 * Not forced when aspect ratio differs — height is derived from width × ratio.
 */
export const DEFAULT_THUMBNAIL_HEIGHT_TARGET_PX: number = 120;

/**
 * Minimum resizable panel width (CSS px).
 */
export const MIN_PANEL_WIDTH_PX: number = 120;

/**
 * Maximum resizable panel width (CSS px).
 */
export const MAX_PANEL_WIDTH_PX: number = 240;

/**
 * Horizontal padding / chrome reserved inside the panel when sizing thumbs
 * (list padding + scrollbar allowance). The selection stroke is reserved
 * separately by {@link THUMB_SELECTION_CHROME_PX}.
 */
export const PANEL_INNER_CHROME_PX: number = 24;

/**
 * Horizontal space taken by the thumb button on both sides (CSS px).
 * 2px padding + 2px border, left and right, so the orange stroke is not clipped.
 */
export const THUMB_SELECTION_CHROME_PX: number = 8;

/**
 * Default panel width: target thumb width + inner chrome.
 */
export const DEFAULT_PANEL_WIDTH_PX: number =
  DEFAULT_THUMBNAIL_WIDTH_PX + PANEL_INNER_CHROME_PX;

/**
 * IntersectionObserver rootMargin so thumbs prepare slightly before visible.
 */
export const THUMB_LAZY_ROOT_MARGIN: string = '80px 0px';

/**
 * Breakpoint matching `--ej2-pptx-breakpoint-md` / `$ej2-pptx-bp-md`.
 * Desktop ≥ this width shows the panel by default; below is mobile collapse.
 */
export const THUMBNAIL_PANEL_DESKTOP_MIN_PX: number = 768;

/**
 * Clamps panel width to the supported 120–240 range.
 *
 * @param {number} widthPx - Requested width
 * @returns {number} Clamped integer width in CSS px
 */
export function clampPanelWidth(widthPx: number): number {
    if (typeof widthPx !== 'number' || !Number.isFinite(widthPx)) {
        return DEFAULT_PANEL_WIDTH_PX;
    }
    return Math.min(
        MAX_PANEL_WIDTH_PX,
        Math.max(MIN_PANEL_WIDTH_PX, Math.round(widthPx))
    );
}

/**
 * Available width for the thumbnail surface given panel width.
 *
 * @param {number} panelWidthPx - Panel outer width
 * @returns {number} Non-negative content width for the thumb frame
 */
export function thumbnailContentWidth(panelWidthPx: number): number {
    const clamped: number = clampPanelWidth(panelWidthPx);
    return Math.max(1, clamped - PANEL_INNER_CHROME_PX - THUMB_SELECTION_CHROME_PX);
}

/**
 * Computes thumbnail frame size preserving slide aspect ratio.
 *
 * @param {number} contentWidthPx - Available width for the slide surface
 * @param {number} slideWidthPt - Intrinsic slide width in points
 * @param {number} slideHeightPt - Intrinsic slide height in points
 * @returns {Object} Frame width/height in CSS px
 */
export function computeThumbnailFrameSize(
    contentWidthPx: number,
    slideWidthPt: number,
    slideHeightPt: number
): { widthPx: number; heightPx: number; scale: number } {
    const naturalW: number = ptToPx(slideWidthPt);
    const naturalH: number = ptToPx(slideHeightPt);
    if (naturalW <= 0 || naturalH <= 0 || contentWidthPx <= 0) {
        return {
            widthPx: DEFAULT_THUMBNAIL_WIDTH_PX,
            heightPx: DEFAULT_THUMBNAIL_HEIGHT_TARGET_PX,
            scale: 1
        };
    }
    const scale: number = contentWidthPx / naturalW;
    return {
        widthPx: contentWidthPx,
        heightPx: naturalH * scale,
        scale
    };
}

/**
 * Whether a viewport width is treated as desktop for default panel visibility.
 *
 * @param {number} viewportWidthPx - Window or host width
 * @returns {boolean} True when desktop default (panel visible)
 */
export function isDesktopViewport(viewportWidthPx: number): boolean {
    return viewportWidthPx >= THUMBNAIL_PANEL_DESKTOP_MIN_PX;
}
