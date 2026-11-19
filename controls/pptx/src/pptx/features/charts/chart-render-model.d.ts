/**
 * Clone-safe, read-only chart render model (chart rendering support).
 *
 * @remarks
 * A DOM-free projection of a classic DrawingML `c:chartSpace` that carries what a viewer needs to paint a
 * chart: plot families, series with their cached category/value points, axes, legend, title, data labels,
 * trendlines, error bars and frame formatting. Colours are kept as authored {@link ColorValue} plus
 * transforms, so the host resolves them against the theme and never receives a literal RGB for a scheme
 * reference (see `.agent/policies/ooxml.md`). Data comes from the chart part's own `c:numCache` /
 * `c:strCache` elements - the embedded workbook is never opened.
 *
 * Citations: ECMA-376 Part 1 §21.2 (DrawingML Charts): `c:chartSpace` §21.2.2.29, `c:plotArea` §21.2.2.145,
 * `c:ser` §21.2.2.168, `c:numCache` §21.2.2.120, `c:strCache` §21.2.2.199, `c:dLbls` §21.2.2.49,
 * `c:legend` §21.2.2.93, `c:catAx`/`c:valAx`/`c:dateAx` §21.2.2.25/§21.2.2.226/§21.2.2.39.
 */
import { ColorValue } from '../../core/theme/color-value';
/**
 * One authored DrawingML colour transform (`a:lumMod`, `a:alpha`, ...).
 *
 * @public
 */
export interface ChartColorTransform {
    /** Transform element local name. */
    readonly kind: string;
    /** `@val` in 1/1000 percent (or raw) when numeric. */
    readonly value?: number;
}
/**
 * Authored colour with unresolved transforms.
 *
 * @public
 */
export interface ChartColor {
    /** Authored colour choice (srgb, scheme, sys, ...). */
    readonly color: ColorValue;
    /** Colour transforms in authored order. */
    readonly transforms: ReadonlyArray<ChartColorTransform>;
}
/**
 * Fill of a chart element.
 *
 * @public
 */
export declare type ChartFill = {
    readonly kind: 'none';
} | {
    readonly kind: 'solid';
    readonly color: ChartColor;
} | {
    readonly kind: 'gradient';
    /** First stop (kept for consumers that only paint a solid approximation). */
    readonly color: ChartColor;
    /** All `a:gs` stops in authored order; `position` is 0..100 percent. */
    readonly stops?: ReadonlyArray<{
        readonly position: number;
        readonly color: ChartColor;
    }>;
    /** `a:lin/@ang` in degrees (clockwise from the x axis) when linear. */
    readonly angleDeg?: number;
    /** `a:path/@path` (`circle`, `rect`, `shape`) when the gradient is not linear. */
    readonly path?: string;
} | {
    readonly kind: 'pattern';
    /** `a:pattFill/@prst` (`ST_PresetPatternVal`, e.g. `ltHorz`, `pct50`). */
    readonly preset: string;
    /** `a:fgClr`; the pattern strokes. */
    readonly foreground?: ChartColor;
    /** `a:bgClr`; the pattern background. */
    readonly background?: ChartColor;
} | {
    readonly kind: 'unsupported';
    readonly detail: string;
};
/**
 * Outline of a chart element.
 *
 * @public
 */
export interface ChartLine {
    /** Outline fill. */
    readonly fill: ChartFill;
    /** Outline width in points. */
    readonly widthPt?: number;
    /** `a:prstDash/@val` when authored. */
    readonly dash?: string;
}
/**
 * Fill plus outline of a chart frame, series, point or marker.
 *
 * @public
 */
export interface ChartShapeFormat {
    /** Fill when `c:spPr` authored one; `undefined` = automatic. */
    readonly fill?: ChartFill;
    /** Outline when `c:spPr` authored one; `undefined` = automatic. */
    readonly line?: ChartLine;
}
/**
 * Text formatting resolved from `c:txPr` / `a:rPr` / `a:defRPr`.
 *
 * @public
 */
export interface ChartTextStyle {
    /** Font size in points. */
    readonly sizePt?: number;
    /** Bold. */
    readonly bold?: boolean;
    /** Italic. */
    readonly italic?: boolean;
    /** Latin typeface (may be a theme token such as `+mn-lt`). */
    readonly fontFamily?: string;
    /** Text colour. */
    readonly color?: ChartColor;
    /** `a:bodyPr/@rot` in degrees (clockwise), when authored. */
    readonly rotationDeg?: number;
    /** `a:defRPr/@cap`: `all`, `small` or `none`, when authored. */
    readonly caps?: 'all' | 'small' | 'none';
}
/**
 * Chart or axis title.
 *
 * @public
 */
export interface ChartTitleModel {
    /** Plain title text; paragraphs are joined with a line feed. */
    readonly text: string;
    /** Title text style. */
    readonly style: ChartTextStyle;
    /** Whether the title overlays the plot area. */
    readonly overlay: boolean;
    /** `true` when `c:title` has no `c:tx`: the host shows an automatic title (series name or "Chart Title"). */
    readonly auto?: boolean;
}
/**
 * Legend model.
 *
 * @public
 */
export interface ChartLegendModel {
    /** `c:legendPos/@val` (`r` | `l` | `t` | `b` | `tr`). */
    readonly position: string;
    /** Legend entry text style. */
    readonly style: ChartTextStyle;
    /** Whether the legend overlays the plot area. */
    readonly overlay: boolean;
}
/**
 * Series or point data labels (`c:dLbls`).
 *
 * @public
 */
export interface ChartDataLabelsModel {
    /** Show value. */
    readonly showValue: boolean;
    /** Show category name. */
    readonly showCategoryName: boolean;
    /** Show series name. */
    readonly showSeriesName: boolean;
    /** Show percentage (pie family). */
    readonly showPercent: boolean;
    /** Show bubble size. */
    readonly showBubbleSize: boolean;
    /** `c:dLblPos/@val` when authored. */
    readonly position?: string;
    /** Label number format code when authored. */
    readonly numberFormat?: string;
    /** Label text style. */
    readonly style: ChartTextStyle;
    /** `c:separator` text between label parts (for example `", "` or a line feed), when authored. */
    readonly separator?: string;
    /** `c:dLbls/c:spPr` label box fill and outline, when authored. */
    readonly format?: ChartShapeFormat;
}
/**
 * Series marker.
 *
 * @public
 */
export interface ChartMarkerModel {
    /** `c:symbol/@val` (`circle`, `none`, `auto`, ...). */
    readonly symbol: string;
    /** Marker size 2-72 when authored. */
    readonly size?: number;
    /** Marker fill and outline. */
    readonly format: ChartShapeFormat;
}
/**
 * Data point override (`c:dPt`).
 *
 * @public
 */
export interface ChartPointFormat {
    /** Zero-based point index. */
    readonly index: number;
    /** Point fill and outline. */
    readonly format: ChartShapeFormat;
    /** Pie explosion percent when authored. */
    readonly explosion?: number;
}
/**
 * Trendline (`c:trendline`).
 *
 * @public
 */
export interface ChartTrendlineModel {
    /** `c:trendlineType/@val`: `exp` | `linear` | `log` | `movingAvg` | `poly` | `power`. */
    readonly type: string;
    /** Display name when authored. */
    readonly name?: string;
    /** Polynomial order. */
    readonly order?: number;
    /** Moving-average period. */
    readonly period?: number;
    /** Forward extrapolation in category units. */
    readonly forward?: number;
    /** Backward extrapolation in category units. */
    readonly backward?: number;
    /** Fixed intercept when authored. */
    readonly intercept?: number;
    /** Trendline outline. */
    readonly line?: ChartLine;
}
/**
 * Error bars (`c:errBars`).
 *
 * @public
 */
export interface ChartErrorBarsModel {
    /** `c:errBarType/@val`: `both` | `minus` | `plus`. */
    readonly direction: string;
    /** `c:errValType/@val`: `cust` | `fixedVal` | `percentage` | `stdDev` | `stdErr`. */
    readonly valueType: string;
    /** `c:val/@val` when authored. */
    readonly value?: number;
    /** `true` when `c:noEndCap` is set. */
    readonly noEndCap: boolean;
    /** `c:errDir/@val` (`x` | `y`) when authored. */
    readonly axis?: string;
}
/**
 * One series with cached data.
 *
 * @public
 */
export interface ChartSeriesModel {
    /** `c:idx/@val`. */
    readonly index: number;
    /** `c:order/@val`. */
    readonly order: number;
    /** Series name from `c:tx` cache or literal. */
    readonly name?: string;
    /** Category labels (`c:cat`); empty when absent. */
    readonly categories: ReadonlyArray<string>;
    /** Numeric category cache (date axes) when `c:cat` is a number cache. */
    readonly categoryNumbers: ReadonlyArray<number | null>;
    /** Value points (`c:val` or `c:yVal`); `null` = blank. */
    readonly values: ReadonlyArray<number | null>;
    /** Scatter/bubble X points (`c:xVal`). */
    readonly xValues: ReadonlyArray<number | null>;
    /** Bubble sizes (`c:bubbleSize`). */
    readonly bubbleSizes: ReadonlyArray<number | null>;
    /** Value cache format code. */
    readonly formatCode?: string;
    /** Series fill and outline. */
    readonly format: ChartShapeFormat;
    /** Marker when authored. */
    readonly marker?: ChartMarkerModel;
    /** Data labels when authored. */
    readonly dataLabels?: ChartDataLabelsModel;
    /** Per-point overrides. */
    readonly points: ReadonlyArray<ChartPointFormat>;
    /** Trendlines. */
    readonly trendlines: ReadonlyArray<ChartTrendlineModel>;
    /** Error bars. */
    readonly errorBars: ReadonlyArray<ChartErrorBarsModel>;
    /** `c:smooth` on the series. */
    readonly smooth: boolean;
    /** Series-wide pie explosion percent. */
    readonly explosion?: number;
}
/**
 * Plot family discriminator.
 *
 * @public
 */
export declare type ChartPlotKind = 'bar' | 'line' | 'area' | 'pie' | 'doughnut' | 'scatter' | 'bubble' | 'radar' | 'stock' | 'surface' | 'ofPie';
/**
 * One plot (`c:barChart`, `c:lineChart`, ...).
 *
 * @public
 */
export interface ChartPlotModel {
    /** Plot family. */
    readonly kind: ChartPlotKind;
    /** `true` for `c:bar3DChart` / `c:line3DChart` / `c:area3DChart` / `c:pie3DChart` / `c:surface3DChart`. */
    readonly is3D: boolean;
    /** `bar` (horizontal) or `col`. */
    readonly barDirection: string;
    /** `clustered` | `stacked` | `percentStacked` | `standard`. */
    readonly grouping: string;
    /** `c:varyColors`. */
    readonly varyColors: boolean;
    /** `c:gapWidth` percent. */
    readonly gapWidth?: number;
    /** `c:overlap` percent. */
    readonly overlap?: number;
    /** `c:holeSize` percent (doughnut). */
    readonly holeSize?: number;
    /** `c:firstSliceAng` degrees. */
    readonly firstSliceAngle?: number;
    /** `c:scatterStyle/@val`. */
    readonly scatterStyle?: string;
    /** `c:radarStyle/@val`. */
    readonly radarStyle?: string;
    /** Plot-level `c:marker/@val` (line plots). */
    readonly markers: boolean;
    /** `c:axId` values in authored order (category/X first). */
    readonly axisIds: ReadonlyArray<string>;
    /** Series in `c:order` order. */
    readonly series: ReadonlyArray<ChartSeriesModel>;
}
/**
 * Category, date, value or series axis.
 *
 * @public
 */
export interface ChartAxisModel {
    /** `c:axId/@val`. */
    readonly id: string;
    /** `catAx` | `dateAx` | `valAx` | `serAx`. */
    readonly kind: string;
    /** `c:delete/@val`. */
    readonly deleted: boolean;
    /** `c:axPos/@val`. */
    readonly position?: string;
    /** `c:scaling/c:min`. */
    readonly min?: number;
    /** `c:scaling/c:max`. */
    readonly max?: number;
    /** `c:scaling/c:logBase`. */
    readonly logBase?: number;
    /** `true` when `c:scaling/c:orientation` is `maxMin`. */
    readonly reversed: boolean;
    /** `c:majorUnit`. */
    readonly majorUnit?: number;
    /** `c:minorUnit`. */
    readonly minorUnit?: number;
    /** Major gridlines present. */
    readonly majorGridlines: boolean;
    /** Major gridlines outline. */
    readonly majorGridlineFormat?: ChartLine;
    /** Minor gridlines present. */
    readonly minorGridlines: boolean;
    /** Axis title. */
    readonly title?: ChartTitleModel;
    /** `c:numFmt/@formatCode`. */
    readonly numberFormat?: string;
    /** `c:numFmt/@sourceLinked`. */
    readonly numberFormatSourceLinked: boolean;
    /** `c:majorTickMark/@val`. */
    readonly majorTickMark: string;
    /** `c:minorTickMark/@val`. */
    readonly minorTickMark: string;
    /** `c:tickLblPos/@val`. */
    readonly tickLabelPosition: string;
    /** Axis line. */
    readonly line?: ChartLine;
    /** Tick label text style. */
    readonly labelStyle: ChartTextStyle;
}
/**
 * Complete render model for one chart part.
 *
 * @public
 */
export interface ChartRenderModel {
    /** Chart title when shown. */
    readonly title?: ChartTitleModel;
    /** Legend when present. */
    readonly legend?: ChartLegendModel;
    /** Plots in authored order; the first plot drives the primary axes. */
    readonly plots: ReadonlyArray<ChartPlotModel>;
    /** Category / X axis of the first plot. */
    readonly categoryAxis?: ChartAxisModel;
    /** Value / Y axis of the first plot. */
    readonly valueAxis?: ChartAxisModel;
    /** Every axis in the plot area (primary and secondary) in authored order. */
    readonly axes: ReadonlyArray<ChartAxisModel>;
    /** Outer chart-area frame (`c:chartSpace/c:spPr`). */
    readonly chartArea: ChartShapeFormat;
    /** Plot-area frame (`c:plotArea/c:spPr`). */
    readonly plotArea: ChartShapeFormat;
    /** Chart-wide default text style (`c:chartSpace/c:txPr`). */
    readonly textStyle: ChartTextStyle;
    /** `c:style/@val` when authored. */
    readonly styleId?: number;
    /** Features present in the part that this model cannot represent faithfully. */
    readonly unsupported: ReadonlyArray<string>;
}
