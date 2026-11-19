import { FontDesignUnit, TextPoint } from './text-units';
import { fontDesignUnit, textPoint } from './text-units';

/** Renderer-consumed vertical metrics for one pinned family and point size.  @internal */
/**
 * @internal
 */
export interface SkiaFontMetrics {
    /** Raw Skia cell ascent in points. */
    readonly cellAscentPt: TextPoint;
    /** Raw Skia cell descent in points. */
    readonly cellDescentPt: TextPoint;
    /** Ascent consumed by PresentationRenderer, in points. */
    readonly rendererAscentPt: TextPoint;
    /** Half-cell descent consumed by PresentationRenderer, in points. */
    readonly rendererDescentPt: TextPoint;
    /** Skia line spacing in points. */
    readonly lineSpacingPt: TextPoint;
    /** Font em-square size in design units. */
    readonly emHeightUnits: FontDesignUnit;
}

interface PinnedFontUnits {
    /** Cell ascent in font design units. */
    readonly ascent: FontDesignUnit;
    /** Cell descent in font design units. */
    readonly descent: FontDesignUnit;
    /** Line spacing in font design units. */
    readonly lineSpacing: FontDesignUnit;
    /** Em-square height in font design units. */
    readonly emHeight: FontDesignUnit;
}

const ARIAL_UNITS: PinnedFontUnits = Object.freeze({
    ascent: fontDesignUnit(1854), descent: fontDesignUnit(434),
    lineSpacing: fontDesignUnit(2355), emHeight: fontDesignUnit(2048)
});
const CALADEA_UNITS: PinnedFontUnits = Object.freeze({
    ascent: fontDesignUnit(900), descent: fontDesignUnit(250),
    lineSpacing: fontDesignUnit(1150), emHeight: fontDesignUnit(1000)
});
const CARLITO_UNITS: PinnedFontUnits = Object.freeze({
    ascent: fontDesignUnit(1950), descent: fontDesignUnit(550),
    lineSpacing: fontDesignUnit(2500), emHeight: fontDesignUnit(2048)
});
const COURIER_NEW_UNITS: PinnedFontUnits = Object.freeze({
    ascent: fontDesignUnit(1705), descent: fontDesignUnit(615),
    lineSpacing: fontDesignUnit(2320), emHeight: fontDesignUnit(2048)
});
const TIMES_NEW_ROMAN_UNITS: PinnedFontUnits = Object.freeze({
    ascent: fontDesignUnit(1825), descent: fontDesignUnit(443),
    lineSpacing: fontDesignUnit(2355), emHeight: fontDesignUnit(2048)
});

// Ports `PresentationRenderer.GetAscent`: Net.Core/Skia paragraph layout uses
// FontMetricsData.Ascent rather than the Win/hhea cell ascent returned by
// FontExtension.GetCellAscent. These are design units from the pinned files.
const LAYOUT_ASCENT_UNITS: Readonly<Record<string, FontDesignUnit>> = Object.freeze({
    Arial: fontDesignUnit(1577),
    Calibri: fontDesignUnit(1536),
    'Calibri Light': fontDesignUnit(1536),
    'Century Gothic': fontDesignUnit(2060),
    Impact: fontDesignUnit(2067),
    'Segoe UI': fontDesignUnit(2210),
    'Segoe UI Light': fontDesignUnit(2210),
    'Apple Symbols': fontDesignUnit(1365)
});

/** Pinned TTF metric values used by licensed Skia 35.1.39 on the baseline host.  @internal */
/**
 * @internal
 */
export const PINNED_FONT_METRIC_UNITS: Readonly<Record<string, PinnedFontUnits>> = Object.freeze({
    Arial: ARIAL_UNITS,
    Caladea: CALADEA_UNITS,
    Carlito: CARLITO_UNITS,
    'Courier New': COURIER_NEW_UNITS,
    'Times New Roman': TIMES_NEW_ROMAN_UNITS,
    // The fidelity harness registers document-scoped FontFace aliases so a
    // system font cannot win browser selection. They share the source file's
    // exact Skia design units rather than falling through to Arial metrics.
    'EJ2 Fidelity Arial': ARIAL_UNITS,
    'EJ2 Fidelity Caladea': CALADEA_UNITS,
    'EJ2 Fidelity Carlito': CARLITO_UNITS,
    'EJ2 Fidelity Courier New': COURIER_NEW_UNITS,
    'EJ2 Fidelity Times New Roman': TIMES_NEW_ROMAN_UNITS
});

/**
 * Ports `FontExtension.GetCellAscent/GetCellDescent/GetLineSpacing/GetEmHeight`
 * and `PresentationRenderer.GetDescent` (which halves the cell descent).
 *
 * @param {string} family - Resolved pinned family.
 * @param {TextPoint} sizePt - Font size in typographic points.
 * @returns {SkiaFontMetrics} Scaled renderer metrics with explicit units.
 * @internal
 */
export function skiaFontMetrics(family: string, sizePt: TextPoint): SkiaFontMetrics {
    const units: PinnedFontUnits = PINNED_FONT_METRIC_UNITS[family] || PINNED_FONT_METRIC_UNITS.Arial;
    const scale: number = sizePt / units.emHeight;
    const cellAscentPt: TextPoint = textPoint(units.ascent * scale);
    const cellDescentPt: TextPoint = textPoint(units.descent * scale);
    return {
        cellAscentPt,
        cellDescentPt,
        rendererAscentPt: cellAscentPt,
        rendererDescentPt: textPoint(cellDescentPt / 2),
        lineSpacingPt: textPoint(units.lineSpacing * scale),
        emHeightUnits: units.emHeight
    };
}

/**
 * Returns the Net.Core/Skia paragraph baseline ascent.
 *
 * @param {string} family - Authored family before application substitution.
 * @param {TextPoint} sizePt - Effective font size in points.
 * @returns {TextPoint} Baseline offset used by paragraph layout.
 * @internal
 */
export function skiaLayoutAscent(family: string, sizePt: TextPoint): TextPoint {
    const normalized: string = family.trim().replace(/^["']|["']$/gu, '');
    const units: FontDesignUnit = LAYOUT_ASCENT_UNITS[normalized] || LAYOUT_ASCENT_UNITS.Arial;
    return textPoint(units * sizePt / 2048);
}
