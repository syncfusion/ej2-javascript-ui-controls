import { ChartRenderModel, parseChartRenderModel } from '@syncfusion/ej2-pptx';
import { addGradientDef, addPatternDef } from './pattern-fill';
import { SlideFrameThemeSnapshot } from '../../main-slide/slide-frame-model';
import {
    ChartAxisHint, ChartExtraSeries, ChartLineStyle, ChartFrameSize, ChartLabelSpec, ChartMappingResult, ChartSeriesStyle, ChartSliceStyle, ChartStyleHints, ChartTextHint,
    mapChartToOfficeChart
} from './chart-model-mapper';

/**
 * Writable subset of an ej2-charts `Chart` / `AccumulationChart` instance.
 *
 * @internal
 */
export interface ChartLike {
    series: Array<Record<string, unknown>>;
    appendTo(element: HTMLElement): void;
    element?: HTMLElement;
    [property: string]: unknown;
}

/**
 * Minimal surface of ej2-office-chart's `ChartComponent` used by the editor (structural, so it can be lazy-loaded).
 *
 * @internal
 */
export interface OfficeChartComponentLike {
    chart: ChartLike;
    chartRender(json: object): void;
    destroy(): void;
}

/**
 * Creates the office-chart converter.
 *
 * @internal
 */
export type OfficeChartComponentFactory = () => OfficeChartComponentLike;

/**
 * Handle returned for a rendered chart.
 *
 * @internal
 */
export interface OfficeChartHandle {
    /** Result of mapping, including features that could not be represented. */
    readonly mapping: ChartMappingResult;
    /** Releases the ej2-charts instance and DOM. */
    dispose(): void;
}

/**
 * Parses chart XML, maps it, and renders it with ej2-office-chart into `host`.
 * @param {string} xml - `c:chartSpace` part XML.
 * @param {HTMLElement} host - Element sized to the chart frame in slide points.
 * @param {ChartFrameSize} size - Frame size in slide points.
 * @param {SlideFrameThemeSnapshot} theme - Slide theme for colour/font resolution.
 * @param {OfficeChartComponentFactory} factory - Creates the office-chart converter.
 * @returns {OfficeChartHandle | undefined} Handle, or `undefined` when the chart cannot be represented.
 *
 * @internal
 */
export function renderOfficeChart(
    xml: string,
    host: HTMLElement,
    size: ChartFrameSize,
    theme: SlideFrameThemeSnapshot | undefined,
    factory: OfficeChartComponentFactory
): OfficeChartHandle | undefined {
    const model: ChartRenderModel | undefined = parseChartRenderModel(xml);
    const mapping: ChartMappingResult | undefined = model ? mapChartToOfficeChart(model, size, theme) : undefined;
    if (!mapping) {
        return undefined;
    }
    const component: OfficeChartComponentLike = factory();
    try {
        component.chartRender(mapping.json);
        applyHints(component.chart, mapping);
        host.style.overflow = 'hidden';
        component.chart.appendTo(host);
    } catch (error) {
        component.destroy();
        throw error;
    }
    return {
        mapping,
        dispose: (): void => {
            component.destroy();
            while (host.firstChild) {
                host.removeChild(host.firstChild);
            }
        }
    };
}

function font(hint: ChartTextHint): Record<string, string | undefined> {
    return {
        size: hint.size, fontFamily: hint.fontFamily, color: hint.color, fontWeight: hint.fontWeight, fontStyle: hint.fontStyle
    };
}

function assign(target: Record<string, unknown>, key: string, value: Record<string, unknown>): void {
    const current: unknown = target[key];
    target[key] = { ...(current && typeof current === 'object' ? current as Record<string, unknown> : {}), ...value };
}

function applyHints(chart: ChartLike, mapping: ChartMappingResult): void {
    const hints: ChartStyleHints = mapping.hints;
    const pie: boolean = mapping.json.chartType === 'Pie' || mapping.json.chartType === 'Doughnut';
    chart.titleStyle = font(hints.title);
    assign(chart, 'legendSettings', { textStyle: font(hints.legend) });
    chart.background = hints.background || 'transparent';
    chart.border = { width: 0 };
    chart.enableAnimation = false;
    chart.series.forEach((series: Record<string, unknown>): void => {
        const trendlines: Array<Record<string, unknown>> = (series.trendlines as Array<Record<string, unknown>> | undefined) || [];
        trendlines.forEach((trendline: Record<string, unknown>): void => {
            trendline.animation = { enable: false };
        });
    });
    applyLabelContent(chart, hints, pie);
    if (pie) {
        const start: number = hints.firstSliceAngle === undefined ? 0 : hints.firstSliceAngle;
        chart.series.forEach((series: Record<string, unknown>): void => {
            series.startAngle = start;
            series.endAngle = start + 360;
            assign(series, 'dataLabel', { font: font(hints.dataLabels) });
            if (hints.pieLabelPosition) {
                assign(series, 'dataLabel', { position: hints.pieLabelPosition });
            }
            if (hints.labelBoxFill) {
                assign(series, 'dataLabel', { fill: hints.labelBoxFill });
            }
            if (mapping.json.chartType === 'Doughnut') {
                series.innerRadius = (hints.holeSizePercent === undefined ? 50 : hints.holeSizePercent) + '%';
                series.radius = '100%';
            }
        });
        applyPieSlices(chart, hints);
        return;
    }
    assign(chart, 'chartArea', { border: { width: 0 }, background: hints.plotBackground || 'transparent' });
    const numericX: boolean = mapping.json.chartType === 'Bubble' || mapping.json.chartType === 'Scatter_Markers';
    if (numericX && !(chart.primaryXAxis as Record<string, unknown>).valueType) {
        // ej2-office-chart leaves the X axis type unset for Bubble, which makes ej2-charts throw while measuring it.
        (chart.primaryXAxis as Record<string, unknown>).valueType = 'Double';
    }
    styleAxis(chart, 'primaryXAxis', hints.categoryLabels, hints.categoryTitle, hints.categoryLineVisible, hints.categoryLineColor);
    styleAxis(chart, 'primaryYAxis', hints.valueLabels, hints.valueTitle, hints.valueLineVisible, hints.valueLineColor);
    assign(chart.primaryXAxis as Record<string, unknown>, 'majorGridLines',
           hints.categoryGridlines ? { color: hints.categoryGridlineColor || hints.gridlineColor || '#D9D9D9', width: 1 } : { width: 0 });
    assign(chart.primaryYAxis as Record<string, unknown>, 'majorGridLines',
           hints.valueGridlines ? { color: hints.gridlineColor || '#D9D9D9', width: 1 } : { width: 0 });
    if (hints.valueMinorGridlines) {
        assign(chart.primaryYAxis as Record<string, unknown>, 'minorGridLines',
               { color: hints.gridlineColor || '#D9D9D9', width: 0.5 });
        (chart.primaryYAxis as Record<string, unknown>).minorTicksPerInterval = 4;
    }
    if (hints.chartBorder) {
        chart.border = hints.chartBorder;
    }
    if (hints.fullOverlap) {
        chart.enableSideBySidePlacement = false;
    }
    chart.series.slice(0, hints.seriesStyles.length).forEach((series: Record<string, unknown>, index: number): void => {
        const style: ChartSeriesStyle = hints.seriesStyles[index];
        if (style.fill) {
            series.fill = style.fill;
        }
        if (style.opacity !== undefined) {
            series.opacity = style.opacity;
        }
        if (style.border) {
            series.border = style.border;
        }
    });
    if (hints.columnWidth !== undefined) {
        chart.series.forEach((series: Record<string, unknown>): void => {
            series.columnWidth = hints.columnWidth;
            series.columnSpacing = hints.columnSpacing;
        });
    }
    chart.series.forEach((series: Record<string, unknown>): void => {
        const marker: Record<string, unknown> | undefined = series.marker as Record<string, unknown> | undefined;
        if (marker && marker.dataLabel) {
            assign(marker.dataLabel as Record<string, unknown>, 'font', font(hints.dataLabels));
            if (hints.dataLabels.rotation !== undefined) {
                (marker.dataLabel as Record<string, unknown>).angle = hints.dataLabels.rotation;
                (marker.dataLabel as Record<string, unknown>).enableRotation = true;
            }
        }
    });
    applyLineStyles(chart, hints);
    applyUpperCase(chart, hints);
    applyPatterns(chart, hints);
    applyAxisScaling(chart.primaryXAxis as Record<string, unknown>, hints.categoryAxis, false);
    applyAxisScaling(chart.primaryYAxis as Record<string, unknown>, hints.valueAxis, true);
    applyPointColors(chart, hints);
    if (hints.radar) {
        chart.series.forEach((series: Record<string, unknown>): void => {
            series.type = 'Radar';
            series.drawType = hints.radar && hints.radar.filled ? 'Area' : 'Line';
            series.opacity = hints.radar && hints.radar.filled ? 0.5 : 1;
        });
    }
    addExtraSeries(chart, hints);
}

function applyLineStyles(chart: ChartLike, hints: ChartStyleHints): void {
    chart.series.slice(0, hints.lineStyles.length).forEach((series: Record<string, unknown>, index: number): void => {
        const style: ChartLineStyle = hints.lineStyles[index];
        if (style.width !== undefined) {
            series.width = style.width;
        }
        if (style.dashArray) {
            series.dashArray = style.dashArray;
        }
        if (style.smooth && series.type === 'Line') {
            series.type = 'Spline';
        }
        if (style.marker) {
            const marker: Record<string, unknown> = { visible: style.marker.visible };
            if (style.marker.visible) {
                marker.shape = style.marker.shape;
                marker.width = style.marker.size;
                marker.height = style.marker.size;
                marker.isFilled = true;
                marker.fill = style.marker.fill;
                marker.border = { color: style.marker.border, width: 1 };
            }
            assign(series, 'marker', marker);
        }
        const existing: Record<string, unknown> | undefined = (series.marker as Record<string, unknown> | undefined);
        if (style.labelPosition && existing && existing.dataLabel) {
            (existing.dataLabel as Record<string, unknown>).position = style.labelPosition;
        }
    });
}

function applyUpperCase(chart: ChartLike, hints: ChartStyleHints): void {
    if (hints.categoryLabels.upperCase) {
        chart.axisLabelRender = (args: { axis: { name: string }; text: string }): void => {
            if (args.axis.name === 'primaryXAxis') {
                args.text = args.text.toUpperCase();
            }
        };
    }
    if (hints.dataLabels.upperCase) {
        const previous: unknown = chart.textRender;
        chart.textRender = (args: { text: string }): void => {
            if (typeof previous === 'function') {
                previous(args);
            }
            args.text = args.text.toUpperCase();
        };
    }
}

/** Paints pattern-filled series (and their legend swatches) with SVG `<pattern>` fills once the chart has drawn. */
function applyPatterns(chart: ChartLike, hints: ChartStyleHints): void {
    if (!hints.seriesStyles.some((style: ChartSeriesStyle): boolean => style.pattern !== undefined)) {
        return;
    }
    chart.loaded = (): void => {
        const element: HTMLElement = chart.element as HTMLElement;
        const svg: Element | null = element.querySelector('svg');
        if (!svg) {
            return;
        }
        hints.seriesStyles.forEach((style: ChartSeriesStyle, index: number): void => {
            if (!style.pattern) {
                return;
            }
            const paint: string = addPatternDef(svg, element.id + '_pptx_pattern_' + index, style.pattern);
            const targets: NodeListOf<Element> = svg.querySelectorAll(
                '[id^="' + element.id + '_Series_' + index + '_Point_"], [id="' + element.id + '_chart_legend_shape_' + index + '"]');
            for (let i: number = 0; i < targets.length; i++) {
                targets[i].setAttribute('fill', paint);
            }
        });
    };
}

/** Paints per-slice pattern/gradient fills, outlines and opacity once the pie has drawn. */
function applyPieSlices(chart: ChartLike, hints: ChartStyleHints): void {
    const slices: ChartSliceStyle[] = hints.pieSlices;
    if (!slices.some((slice: ChartSliceStyle): boolean =>
        slice.pattern !== undefined || slice.gradient !== undefined || slice.border !== undefined || slice.opacity !== undefined)) {
        return;
    }
    chart.loaded = (): void => {
        const element: HTMLElement = chart.element as HTMLElement;
        const svg: Element | null = element.querySelector('svg');
        if (!svg) {
            return;
        }
        slices.forEach((slice: ChartSliceStyle, index: number): void => {
            const targets: Element[] = Array.prototype.slice.call(svg.querySelectorAll(
                '[id$="_Series_0_Point_' + index + '"], [id$="_chart_legend_shape_' + index + '"]'));
            let paint: string | undefined;
            if (slice.pattern) {
                paint = addPatternDef(svg, element.id + '_pptx_slice_' + index, slice.pattern);
            } else if (slice.gradient) {
                paint = addGradientDef(svg, element.id + '_pptx_slice_' + index, slice.gradient);
            }
            targets.forEach((target: Element): void => {
                if (paint) {
                    target.setAttribute('fill', paint);
                }
                if (slice.opacity !== undefined) {
                    target.setAttribute('fill-opacity', String(slice.opacity));
                }
                if (slice.border === 'none') {
                    target.setAttribute('stroke-width', '0');
                } else if (slice.border && target.id.indexOf('_Point_') > 0) {
                    target.setAttribute('stroke', slice.border.color);
                    target.setAttribute('stroke-width', String(slice.border.width));
                }
            });
        });
    };
}

function applyAxisScaling(axis: Record<string, unknown>, hint: ChartAxisHint, value: boolean): void {
    if (hint.deleted || hint.hidden) {
        axis.visible = false;
    }
    if (hint.reversed) {
        axis.isInversed = true;
    }
    if (!value) {
        return;
    }
    if (hint.logBase !== undefined) {
        axis.valueType = 'Logarithmic';
        axis.logBase = hint.logBase;
    }
    if (hint.min !== undefined) {
        axis.minimum = hint.min;
    }
    if (hint.max !== undefined) {
        axis.maximum = hint.max;
    }
    if (hint.majorUnit !== undefined && hint.majorUnit > 0 && hint.logBase === undefined) {
        axis.interval = hint.majorUnit;
    }
}

function applyPointColors(chart: ChartLike, hints: ChartStyleHints): void {
    if (Object.keys(hints.pointColors).length === 0) {
        return;
    }
    chart.pointRender = (args: { seriesIndex: number; pointIndex: number; fill: string }): void => {
        const series: { [pointIndex: number]: string } | undefined = hints.pointColors[args.seriesIndex];
        if (series && series[args.pointIndex]) {
            args.fill = series[args.pointIndex];
        }
    };
}

function labelText(spec: ChartLabelSpec, args: { text: string; point: Record<string, unknown>; series: Record<string, unknown> },
                   pie: boolean): string {
    const parts: string[] = [];
    if (spec.series) {
        parts.push(String(args.series.name === undefined ? '' : args.series.name));
    }
    if (spec.category) {
        parts.push(String(args.point.x === undefined ? '' : args.point.x));
    }
    if (spec.value) {
        parts.push(pie && !spec.percent ? args.text : String(args.point.y === undefined ? args.text : args.point.y));
    }
    if (spec.percent) {
        const percent: unknown = args.point.percentage;
        parts.push(typeof percent === 'number' ? percent.toFixed(spec.percentDecimals) + '%'
            : percent === undefined ? args.text : percent + '%');
    }
    return parts.join(spec.separator === undefined ? ', ' : spec.separator.replace(/\r?\n/g, '<br>'));
}

function applyLabelContent(chart: ChartLike, hints: ChartStyleHints, pie: boolean): void {
    const specs: Array<ChartLabelSpec | undefined> = hints.labelSpecs;
    const needed: boolean = specs.some((spec: ChartLabelSpec | undefined): boolean =>
        spec !== undefined && (spec.category || spec.series || spec.percent));
    if (!needed) {
        return;
    }
    chart.textRender = (args: { seriesIndex: number; text: string; point: Record<string, unknown>;
        series: Record<string, unknown> }): void => {
        const spec: ChartLabelSpec | undefined = specs[args.seriesIndex === undefined ? 0 : args.seriesIndex];
        if (spec) {
            args.text = labelText(spec, args, pie);
        }
    };
}

function addExtraSeries(chart: ChartLike, hints: ChartStyleHints): void {
    if (hints.extraSeries.length === 0 && !hints.secondaryValueAxis) {
        return;
    }
    if (hints.secondaryValueAxis) {
        const secondary: ChartAxisHint & { labels: ChartTextHint; lineColor?: string } = hints.secondaryValueAxis;
        const axis: Record<string, unknown> = {
            name: 'secondaryY', opposedPosition: true, labelStyle: font(secondary.labels),
            lineStyle: { width: 1, color: secondary.lineColor || '#D9D9D9' }, majorTickLines: { width: 0 },
            majorGridLines: { width: 0 }
        };
        applyAxisScaling(axis, secondary, true);
        chart.axes = [axis];
    }
    const added: Array<Record<string, unknown>> = [];
    hints.extraSeries.forEach((extra: ChartExtraSeries): void => {
        const series: Record<string, unknown> = {
            type: extra.type, name: extra.name, fill: extra.color, width: 2, animation: { enable: false },
            dataSource: extra.points, xName: 'x', yName: 'y'
        };
        if (extra.type === 'Line' || extra.type === 'StackingLine' || extra.type === 'StackingLine100') {
            series.marker = { visible: extra.markers, shape: 'Circle', isFilled: true };
        }
        if (extra.type === 'Area' || extra.type.indexOf('StackingArea') === 0) {
            series.opacity = 0.7;
        }
        if (extra.secondary) {
            series.yAxisName = 'secondaryY';
        }
        added.push(series);
    });
    chart.series = chart.series.concat(added);
}

function styleAxis(chart: ChartLike, key: string, labels: ChartTextHint, title: ChartTextHint, lineVisible: boolean, lineColor?: string): void {
    const axis: Record<string, unknown> = chart[key] as Record<string, unknown>;
    axis.labelStyle = font(labels);
    axis.titleStyle = font(title);
    axis.lineStyle = lineVisible ? { width: 1, color: lineColor || '#D9D9D9' } : { width: 0 };
    axis.majorTickLines = { width: 0 };
    if (labels.rotation !== undefined) {
        axis.labelRotation = labels.rotation;
    }
}
