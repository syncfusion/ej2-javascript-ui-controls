import {
    PdfGraphics,
    PdfBrush,
    PdfPen,
    PdfFont,
    PdfStandardFont,
    PdfFontFamily,
    PdfFontStyle,
    Rectangle,
    PdfStringFormat,
    PdfTextAlignment,
    PdfVerticalAlignment
} from '@syncfusion/ej2-pdf';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IChart, IChartSeriesData } from '../common/index';
import { parseHexColor, toPdfColor, sanitizeTextForFont, measurePdfText } from '../common/index';

const DEFAULT_CHART_PALETTE: { r: number; g: number; b: number }[] = [
    { r: 91, g: 155, b: 213 },
    { r: 237, g: 125, b: 49 },
    { r: 165, g: 165, b: 165 },
    { r: 255, g: 192, b: 0 },
    { r: 68, g: 114, b: 196 },
    { r: 112, g: 173, b: 71 },
    { r: 155, g: 194, b: 230 },
    { r: 244, g: 177, b: 131 },
    { r: 217, g: 217, b: 217 },
    { r: 255, g: 217, b: 102 }
];

const PADDING: number = 12;
const SWATCH_SIZE: number = 8;
const SWATCH_PAD: number = 4;
const ITEM_SPACING: number = 16;
const ROW_HEIGHT: number = 14;
const ENTRY_HEIGHT: number = 12;
const PIE_START_ANGLE: number = -90;
const MAX_CHUNK_ANGLE: number = 90;
const FULL_CIRCLE_ANGLE: number = 360;

/**
 * Handles vector rendering of Excel charts (column, bar, line, pie, scatter, area) to PDF pages.
 */
export class ChartRenderer {
    /**
     * Renders a chart entity with plot area, axes, series data, titles, and legends.
     *
     * @param {PdfGraphics} graphics The target PDF page graphics context.
     * @param {IChart} chart The chart model instance.
     * @param {Rectangle} rect The bounding rectangle where the chart should be rendered in points.
     * @param {PdfFont} font Base font for chart labels and legend.
     * @returns {void}
     */
    public static renderChart(
        graphics: PdfGraphics,
        chart: IChart,
        rect: Rectangle,
        font: PdfFont
    ): void {
        if (!graphics || !chart || rect.width <= 0 || rect.height <= 0) {
            return;
        }
        const bgBrush: PdfBrush = new PdfBrush({ r: 255, g: 255, b: 255 });
        const borderPen: PdfPen = new PdfPen({ r: 217, g: 217, b: 217 }, 1);
        graphics.drawRectangle(rect, bgBrush);
        graphics.drawRectangle(rect, borderPen);
        let topY: number = rect.y + 8;
        if (chart.hasTitle && chart.chartTitle) {
            const titleFormat: PdfStringFormat = new PdfStringFormat();
            titleFormat.alignment = PdfTextAlignment.center;
            titleFormat.lineAlignment = PdfVerticalAlignment.top;
            const titleBrush: PdfBrush = new PdfBrush({ r: 51, g: 51, b: 51 });
            const titleFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 9, PdfFontStyle.bold);
            graphics.drawString(
                sanitizeTextForFont(chart.chartTitle, titleFont),
                titleFont,
                { x: rect.x + PADDING, y: topY, width: rect.width - (PADDING * 2), height: 18 },
                titleBrush,
                titleFormat
            );
            topY += 22;
        }
        const chartType: string = (chart.type || '').toLowerCase();
        const isPie: boolean = chartType.indexOf('pie') >= 0 || chartType.indexOf('doughnut') >= 0;
        const isArea: boolean = chartType.indexOf('area') >= 0;
        const isScatter: boolean = chartType.indexOf('scatter') >= 0;
        const isLine: boolean = chartType.indexOf('line') >= 0 && !isScatter;
        const isBar: boolean = chartType.indexOf('bar') >= 0;
        const isColumn: boolean = !isPie && !isArea && !isLine && !isBar && !isScatter;
        const isArea100Percent: boolean = isArea && (chartType.indexOf('percent') >= 0 || chartType.indexOf('100') >= 0);
        const isAreaStacked: boolean = isArea && !isArea100Percent && chartType.indexOf('stacked') >= 0;
        const series: IChartSeriesData[] = chart.series || [];
        let maxCatLabelWidth: number = 0;
        if (series.length > 0) {
            const firstSeries: IChartSeriesData = series[0 as number];
            if (firstSeries.categoryLabels) {
                const catLabelsList: (string | number)[] = firstSeries.categoryLabels;
                for (let catIdx: number = 0; catIdx < catLabelsList.length; catIdx++) {
                    const category: string | number = catLabelsList[catIdx as number];
                    if (category) {
                        const sanitized: string = sanitizeTextForFont(String(category), font);
                        const labelWidth: number = Math.ceil(measurePdfText(sanitized, font).width);
                        if (labelWidth > maxCatLabelWidth) {
                            maxCatLabelWidth = labelWidth;
                        }
                    }
                }
            }
        }
        let bottomLabelSpace: number = 0;
        if (isColumn) {
            bottomLabelSpace = Math.max(20, maxCatLabelWidth + 8);
        } else if (isArea || isLine || isScatter) {
            bottomLabelSpace = Math.max(24, Math.ceil(maxCatLabelWidth * 0.707) + 12);
        } else if (!isPie) {
            bottomLabelSpace = 16;
        }
        const isLegendRight: boolean = (chart.legendPosition || '').toLowerCase() === 'right';
        let legendWidth: number = 0;
        let legendHeight: number = 0;
        if (chart.hasLegend && series.length > 0) {
            if (isLegendRight) {
                let maxTitleWidth: number = 0;
                for (let seriesIndex: number = 0; seriesIndex < series.length; seriesIndex++) {
                    const sItem: IChartSeriesData = series[seriesIndex as number];
                    const defaultTitle: string = 'Series ' + (seriesIndex + 1);
                    const titleText: string = sanitizeTextForFont(sItem.title || defaultTitle, font);
                    const titleWidth: number = Math.ceil(measurePdfText(titleText, font).width);
                    if (titleWidth > maxTitleWidth) { maxTitleWidth = titleWidth; }
                }
                legendWidth = SWATCH_SIZE + SWATCH_PAD + maxTitleWidth + 8;
            } else if (isPie) {
                const firstSeriesItem: IChartSeriesData = series[0 as number];
                const categories: (string | number)[] = firstSeriesItem.categoryLabels || [];
                const numCols: number = categories.length > 4 ? 3 : Math.min(categories.length, 4);
                const rowCount: number = Math.ceil(categories.length / (numCols || 1));
                legendHeight = Math.max(16, rowCount * ROW_HEIGHT + 4);
            } else {
                legendHeight = 16;
            }
        }
        let axisScale: { axisMax: number; step: number; ticks: number[] };
        let isPercentAxis: boolean = false;
        if (isArea100Percent) {
            axisScale = {
                axisMax: 100,
                step: 20,
                ticks: [0, 20, 40, 60, 80, 100]
            };
            isPercentAxis = true;
        } else if (isAreaStacked) {
            let maxCount: number = 1;
            for (let i: number = 0; i < series.length; i++) {
                if (series[i as number].values && series[i as number].values.length > maxCount) {
                    maxCount = series[i as number].values.length;
                }
            }
            const categoryCount: number = maxCount;
            let stackedMax: number = 0;
            for (let catIndex: number = 0; catIndex < categoryCount; catIndex++) {
                let colSum: number = 0;
                for (let sIdx: number = 0; sIdx < series.length; sIdx++) {
                    const sItem: IChartSeriesData = series[sIdx as number];
                    const valuesList: number[] = sItem.values;
                    const val: number = valuesList[catIndex as number] || 0;
                    colSum += Math.max(0, val);
                }
                if (colSum > stackedMax) { stackedMax = colSum; }
            }
            if (stackedMax <= 0) { stackedMax = 100; }
            axisScale = this.calculateAxisScale(stackedMax);
        } else {
            let maxVal: number = 0;
            for (let sIdx: number = 0; sIdx < series.length; sIdx++) {
                const sItem: IChartSeriesData = series[sIdx as number];
                const valuesList: number[] = sItem.values;
                for (let vIdx: number = 0; vIdx < valuesList.length; vIdx++) {
                    const value: number = valuesList[vIdx as number];
                    if (value > maxVal) { maxVal = value; }
                }
            }
            if (maxVal <= 0) { maxVal = 100; }
            axisScale = this.calculateAxisScale(maxVal);
        }
        const maxValStr: string = isPercentAxis ? '100%' : parseFloat(axisScale.axisMax.toFixed(4)).toString();
        const measuredY: number = Math.ceil(measurePdfText(maxValStr, font).width);
        const yAxisLabelWidth: number = isPie ? 0 : Math.max(18, measuredY + 6);
        const plotRect: Rectangle = {
            x: isPie ? rect.x + PADDING : rect.x + PADDING + yAxisLabelWidth,
            y: topY,
            width: isPie
                ? Math.max(10, rect.width - (PADDING * 2) - (isLegendRight ? legendWidth + 8 : 0))
                : Math.max(10, rect.width - (PADDING * 2) - yAxisLabelWidth - (isLegendRight ? legendWidth + 8 : 8)),
            height: Math.max(10, rect.height - (topY - rect.y) - PADDING - (isLegendRight ? 0 : legendHeight) - bottomLabelSpace)
        };
        if (isPie) {
            this.renderPieChart(graphics, chart, plotRect);
        } else if (isArea) {
            this.renderAreaChart(
                graphics, chart, plotRect, font, yAxisLabelWidth, axisScale,
                isArea100Percent, isAreaStacked, maxCatLabelWidth
            );
        } else if (isScatter) {
            this.renderScatterChart(graphics, chart, plotRect, font, yAxisLabelWidth, axisScale, maxCatLabelWidth);
        } else if (isLine) {
            this.renderLineChart(graphics, chart, plotRect, font, yAxisLabelWidth, axisScale, maxCatLabelWidth);
        } else if (isBar) {
            this.renderBarChart(graphics, chart, plotRect, axisScale);
        } else {
            this.renderColumnChart(graphics, chart, plotRect, font, maxCatLabelWidth, yAxisLabelWidth, axisScale);
        }
        if (isLegendRight && legendWidth > 0) {
            this.renderRightLegend(graphics, chart, {
                x: rect.x + rect.width - legendWidth - PADDING,
                y: topY + Math.max(0, (plotRect.height - (series.length * ROW_HEIGHT)) / 2),
                width: legendWidth,
                height: series.length * ROW_HEIGHT
            }, font);
        } else if (legendHeight > 0) {
            this.renderLegend(graphics, chart, {
                x: rect.x + PADDING,
                y: rect.y + rect.height - legendHeight - 4,
                width: rect.width - (PADDING * 2),
                height: legendHeight
            }, font);
        }
    }

    private static calculateAxisScale(dataMax: number): { axisMax: number; step: number; ticks: number[] } {
        if (dataMax <= 0) {
            return { axisMax: 1, step: 0.2, ticks: [0, 0.2, 0.4, 0.6, 0.8, 1] };
        }
        const rawStep: number = dataMax / 7;
        const power: number = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const fraction: number = rawStep / power;
        let niceFraction: number = 1;
        if (fraction <= 1) {
            niceFraction = 1;
        } else if (fraction <= 2) {
            niceFraction = 2;
        } else if (fraction <= 2.5) {
            niceFraction = 2.5;
        } else if (fraction <= 5) {
            niceFraction = 5;
        } else {
            niceFraction = 10;
        }
        const step: number = niceFraction * power;
        let axisMax: number = Math.ceil(dataMax / step) * step;
        if (Math.abs(axisMax - dataMax) < 1e-6) {
            axisMax += step;
        }
        const ticks: number[] = [];
        const count: number = Math.round(axisMax / step);
        for (let i: number = 0; i <= count; i++) {
            ticks.push(Math.round(i * step * 100000) / 100000);
        }
        return { axisMax, step, ticks };
    }

    private static renderAreaChart(
        graphics: PdfGraphics,
        chart: IChart,
        plotRect: Rectangle,
        font: PdfFont,
        yAxisLabelWidth: number,
        axisScale: { axisMax: number; step: number; ticks: number[] },
        is100Percent: boolean,
        isStacked: boolean,
        maxCatLabelWidth: number
    ): void {
        const series: IChartSeriesData[] = chart.series || [];
        if (series.length === 0) { return; }
        this.drawAxes(graphics, chart, plotRect, axisScale, font, yAxisLabelWidth, is100Percent);
        let maxCount: number = 1;
        for (let i: number = 0; i < series.length; i++) {
            if (series[i as number].values && series[i as number].values.length > maxCount) {
                maxCount = series[i as number].values.length;
            }
        }
        const categoryCount: number = maxCount;
        const stepX: number = categoryCount > 1 ? plotRect.width / (categoryCount - 1) : plotRect.width;
        const cumPrev: number[] = new Array(categoryCount).fill(0);
        const cumNext: number[] = new Array(categoryCount).fill(0);
        const catSums: number[] = new Array(categoryCount).fill(0);
        if (is100Percent) {
            for (let catIndex: number = 0; catIndex < categoryCount; catIndex++) {
                let sum: number = 0;
                for (let seriesIndex: number = 0; seriesIndex < series.length; seriesIndex++) {
                    const currentSeries: IChartSeriesData = series[seriesIndex as number];
                    const valuesList: number[] = currentSeries.values;
                    const val: number = valuesList[catIndex as number] || 0;
                    sum += Math.max(0, val);
                }
                catSums[catIndex as number] = sum > 0 ? sum : 1;
            }
        }
        for (let seriesIndex: number = 0; seriesIndex < series.length; seriesIndex++) {
            const seriesItem: IChartSeriesData = series[seriesIndex as number];
            for (let catIndex: number = 0; catIndex < categoryCount; catIndex++) {
                const valuesList: number[] = seriesItem.values;
                const rawVal: number = Math.max(0, valuesList[catIndex as number] || 0);
                if (is100Percent) {
                    const totalSum: number = catSums[catIndex as number];
                    const percent: number = (rawVal / totalSum) * 100;
                    cumNext[catIndex as number] = cumPrev[catIndex as number] + percent;
                } else if (isStacked) {
                    cumNext[catIndex as number] = cumPrev[catIndex as number] + rawVal;
                } else {
                    cumPrev[catIndex as number] = 0;
                    cumNext[catIndex as number] = rawVal;
                }
            }
            const polyPoints: { x: number; y: number }[] = [];
            for (let catIndex: number = 0; catIndex < categoryCount; catIndex++) {
                const pointX: number = plotRect.x + (catIndex * stepX);
                const valNext: number = cumNext[catIndex as number];
                const ratio: number = Math.min(1, Math.max(0, valNext / axisScale.axisMax));
                const pointY: number = plotRect.y + plotRect.height - (ratio * plotRect.height);
                polyPoints.push({ x: pointX, y: pointY });
            }
            for (let catIndex: number = categoryCount - 1; catIndex >= 0; catIndex--) {
                const pointX: number = plotRect.x + (catIndex * stepX);
                const valPrev: number = cumPrev[catIndex as number];
                const ratio: number = Math.min(1, Math.max(0, valPrev / axisScale.axisMax));
                const pointY: number = plotRect.y + plotRect.height - (ratio * plotRect.height);
                polyPoints.push({ x: pointX, y: pointY });
            }
            const color: { r: number; g: number; b: number } = this.getSeriesColor(seriesItem, seriesIndex);
            const brush: PdfBrush = new PdfBrush(color);
            const pen: PdfPen = new PdfPen(color, 1);
            const graphicsObj: Record<string, unknown> = graphics as unknown as Record<string, unknown>;
            const drawPolygonFn: (points: { x: number; y: number }[], penOrBrush: unknown) => void =
                graphicsObj['drawPolygon'] as (points: { x: number; y: number }[], penOrBrush: unknown) => void;
            drawPolygonFn.call(graphics, polyPoints, brush);
            drawPolygonFn.call(graphics, polyPoints, pen);
            for (let catIndex: number = 0; catIndex < categoryCount; catIndex++) {
                cumPrev[catIndex as number] = cumNext[catIndex as number];
            }
        }
        const firstSeries: IChartSeriesData | undefined = series[0 as number];
        const catLabels: (string | number)[] = firstSeries && firstSeries.categoryLabels ? firstSeries.categoryLabels : [];
        for (let catIndex: number = 0; catIndex < categoryCount; catIndex++) {
            const catLabel: string | number = catLabels[catIndex as number];
            if (catLabel) {
                const catX: number = plotRect.x + (catIndex * stepX);
                const labelY: number = plotRect.y + plotRect.height + 4;
                const graphicsObj: Record<string, unknown> = graphics as unknown as Record<string, unknown>;
                const saveFn: () => unknown = graphicsObj['save'] as () => unknown;
                const translateFn: (p: { x: number; y: number }) => void =
                    graphicsObj['translateTransform'] as (p: { x: number; y: number }) => void;
                const rotateFn: (deg: number) => void = graphicsObj['rotateTransform'] as (deg: number) => void;
                const restoreFn: (s: unknown) => void = graphicsObj['restore'] as (s: unknown) => void;
                const state: unknown = saveFn.call(graphics);
                translateFn.call(graphics, { x: catX, y: labelY });
                rotateFn.call(graphics, 45);
                const labelFormat: PdfStringFormat = new PdfStringFormat();
                labelFormat.alignment = PdfTextAlignment.left;
                labelFormat.lineAlignment = PdfVerticalAlignment.middle;
                labelFormat.lineLimit = false;
                labelFormat.noClip = true;
                const labelBrush: PdfBrush = new PdfBrush({ r: 51, g: 51, b: 51 });
                const rotWidth: number = Math.max(20, maxCatLabelWidth + 8);
                graphics.drawString(String(catLabel), font, { x: 0, y: 0, width: rotWidth, height: 12 }, labelBrush, labelFormat);
                restoreFn.call(graphics, state);
            }
        }
    }

    private static renderColumnChart(
        graphics: PdfGraphics,
        chart: IChart,
        plotRect: Rectangle,
        font: PdfFont,
        maxCatLabelWidth: number,
        yAxisLabelWidth: number,
        axisScale: { axisMax: number; step: number; ticks: number[] }
    ): void {
        const series: IChartSeriesData[] = chart.series || [];
        if (series.length === 0) {
            return;
        }
        this.drawAxes(graphics, chart, plotRect, axisScale, font, yAxisLabelWidth, false);
        let maxCount: number = 1;
        for (let i: number = 0; i < series.length; i++) {
            if (series[i as number].values && series[i as number].values.length > maxCount) {
                maxCount = series[i as number].values.length;
            }
        }
        const categoryCount: number = maxCount;
        const catWidth: number = plotRect.width / categoryCount;
        const barPadRatio: number = 0.2;
        const availableBarWidth: number = catWidth * (1 - barPadRatio);
        const singleBarWidth: number = Math.max(2, availableBarWidth / series.length);
        for (let catIndex: number = 0; catIndex < categoryCount; catIndex++) {
            const catX: number = plotRect.x + (catIndex * catWidth) + (catWidth * barPadRatio / 2);
            for (let seriesIndex: number = 0; seriesIndex < series.length; seriesIndex++) {
                const currentSeries: IChartSeriesData = series[seriesIndex as number];
                const valuesList: number[] = currentSeries.values;
                const value: number = valuesList[catIndex as number] || 0;
                const barHeight: number = Math.max(0, (value / axisScale.axisMax) * plotRect.height);
                const barX: number = catX + (seriesIndex * singleBarWidth);
                const barY: number = plotRect.y + plotRect.height - barHeight;
                const color: { r: number; g: number; b: number } = this.getSeriesColor(currentSeries, seriesIndex);
                const barBrush: PdfBrush = new PdfBrush(color);
                const barPen: PdfPen = new PdfPen({ r: 255, g: 255, b: 255 }, 0.5);
                graphics.drawRectangle({ x: barX, y: barY, width: Math.max(1, singleBarWidth - 1), height: barHeight }, barBrush);
                graphics.drawRectangle({ x: barX, y: barY, width: Math.max(1, singleBarWidth - 1), height: barHeight }, barPen);
            }
            const firstSeries: IChartSeriesData = series[0 as number];
            const catLabel: string | number | undefined = firstSeries && firstSeries.categoryLabels ?
                firstSeries.categoryLabels[catIndex as number] : undefined;
            if (catLabel) {
                const graphicsObj: Record<string, unknown> = graphics as unknown as Record<string, unknown>;
                const saveFn: () => unknown = graphicsObj['save'] as () => unknown;
                const translateFn: (p: { x: number; y: number }) => void =
                    graphicsObj['translateTransform'] as (p: { x: number; y: number }) => void;
                const rotateFn: (deg: number) => void = graphicsObj['rotateTransform'] as (deg: number) => void;
                const restoreFn: (s: unknown) => void = graphicsObj['restore'] as (s: unknown) => void;
                const state: unknown = saveFn.call(graphics);
                const barCenterX: number = catX + (singleBarWidth * series.length) / 2;
                const labelY: number = plotRect.y + plotRect.height + 4;
                translateFn.call(graphics, { x: barCenterX, y: labelY });
                rotateFn.call(graphics, 90);
                const labelFormat: PdfStringFormat = new PdfStringFormat();
                labelFormat.alignment = PdfTextAlignment.left;
                labelFormat.lineAlignment = PdfVerticalAlignment.middle;
                labelFormat.lineLimit = false;
                labelFormat.noClip = true;
                const formatObj: Record<string, unknown> = labelFormat as unknown as Record<string, unknown>;
                formatObj['_wordWrapType'] = 1;
                const labelBrush: PdfBrush = new PdfBrush({ r: 51, g: 51, b: 51 });
                const rotWidth: number = Math.max(20, maxCatLabelWidth + 8);
                graphics.drawString(String(catLabel), font, { x: 0, y: -6, width: rotWidth, height: 12 }, labelBrush, labelFormat);
                restoreFn.call(graphics, state);
            }
        }
    }

    private static renderBarChart(
        graphics: PdfGraphics,
        chart: IChart,
        plotRect: Rectangle,
        axisScale: { axisMax: number; step: number; ticks: number[] }
    ): void {
        const series: IChartSeriesData[] = chart.series || [];
        if (series.length === 0) { return; }
        const gridPen: PdfPen = new PdfPen({ r: 217, g: 217, b: 217 }, 0.5);
        const axisPen: PdfPen = new PdfPen({ r: 180, g: 180, b: 180 }, 1);
        const ticks: number[] = axisScale.ticks;
        for (let tickIndex: number = 0; tickIndex < ticks.length; tickIndex++) {
            const tickVal: number = ticks[tickIndex as number];
            const ratio: number = tickVal / axisScale.axisMax;
            const gridX: number = plotRect.x + (ratio * plotRect.width);
            if (tickIndex > 0) {
                graphics.drawLine(gridPen, { x: gridX, y: plotRect.y }, { x: gridX, y: plotRect.y + plotRect.height });
            }
        }
        let maxCount: number = 1;
        for (let i: number = 0; i < series.length; i++) {
            if (series[i as number].values && series[i as number].values.length > maxCount) {
                maxCount = series[i as number].values.length;
            }
        }
        const categoryCount: number = maxCount;
        const catHeight: number = plotRect.height / categoryCount;
        const singleBarHeight: number = Math.max(2, (catHeight * 0.75) / series.length);
        for (let catIndex: number = 0; catIndex < categoryCount; catIndex++) {
            const catY: number = plotRect.y + (catIndex * catHeight);
            for (let seriesIndex: number = 0; seriesIndex < series.length; seriesIndex++) {
                const currentSeries: IChartSeriesData = series[seriesIndex as number];
                const valuesList: number[] = currentSeries.values;
                const value: number = valuesList[catIndex as number] || 0;
                const barWidth: number = Math.max(0, (value / axisScale.axisMax) * plotRect.width);
                const barY: number = catY + (seriesIndex * singleBarHeight);
                const color: { r: number; g: number; b: number } = this.getSeriesColor(currentSeries, seriesIndex);
                const barBrush: PdfBrush = new PdfBrush(color);
                graphics.drawRectangle({ x: plotRect.x, y: barY, width: barWidth, height: singleBarHeight - 1 }, barBrush);
            }
        }
        graphics.drawLine(axisPen, { x: plotRect.x, y: plotRect.y }, { x: plotRect.x, y: plotRect.y + plotRect.height });
    }

    private static renderLineChart(
        graphics: PdfGraphics,
        chart: IChart,
        plotRect: Rectangle,
        font: PdfFont,
        yAxisLabelWidth: number,
        axisScale: { axisMax: number; step: number; ticks: number[] },
        maxCatLabelWidth: number
    ): void {
        const series: IChartSeriesData[] = chart.series || [];
        if (series.length === 0) { return; }
        this.drawAxes(graphics, chart, plotRect, axisScale, font, yAxisLabelWidth, false);
        const dataLabelFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 7, PdfFontStyle.regular);
        const dataLabelBrush: PdfBrush = new PdfBrush({ r: 51, g: 51, b: 51 });
        const labelFormat: PdfStringFormat = new PdfStringFormat();
        labelFormat.alignment = PdfTextAlignment.center;
        labelFormat.lineAlignment = PdfVerticalAlignment.middle;
        labelFormat.noClip = true;
        let maxCount: number = 1;
        for (let i: number = 0; i < series.length; i++) {
            if (series[i as number].values && series[i as number].values.length > maxCount) {
                maxCount = series[i as number].values.length;
            }
        }
        const categoryCount: number = maxCount;
        const stepX: number = categoryCount > 1 ? plotRect.width / (categoryCount - 1) : plotRect.width;
        for (let seriesIndex: number = 0; seriesIndex < series.length; seriesIndex++) {
            const seriesItem: IChartSeriesData = series[seriesIndex as number];
            const count: number = seriesItem.values.length;
            if (count < 2) { continue; }
            const color: { r: number; g: number; b: number } = this.getSeriesColor(seriesItem, seriesIndex);
            const linePen: PdfPen = new PdfPen(color, 2);
            const valuesList: number[] = seriesItem.values;
            const firstVal: number = valuesList[0 as number];
            let prevX: number = plotRect.x;
            let prevY: number = plotRect.y + plotRect.height - ((firstVal / axisScale.axisMax) * plotRect.height);
            for (let pointIndex: number = 1; pointIndex < count; pointIndex++) {
                const currVal: number = valuesList[pointIndex as number];
                const currX: number = plotRect.x + (pointIndex * stepX);
                const currY: number = plotRect.y + plotRect.height - ((currVal / axisScale.axisMax) * plotRect.height);
                graphics.drawLine(linePen, { x: prevX, y: prevY }, { x: currX, y: currY });
                prevX = currX;
                prevY = currY;
            }
            for (let pointIndex: number = 0; pointIndex < count; pointIndex++) {
                const value: number = valuesList[pointIndex as number];
                if (!isNullOrUndefined(value)) {
                    const currX: number = plotRect.x + (pointIndex * stepX);
                    const currY: number = plotRect.y + plotRect.height - ((value / axisScale.axisMax) * plotRect.height);
                    const labelYOffset: number = seriesIndex === 0 ? -12 : -10;
                    graphics.drawString(
                        String(value),
                        dataLabelFont,
                        { x: currX - 20, y: currY + labelYOffset, width: 40, height: 10 },
                        dataLabelBrush,
                        labelFormat
                    );
                }
            }
        }
        const firstSeries: IChartSeriesData | undefined = series[0 as number];
        const catLabels: (string | number)[] = firstSeries && firstSeries.categoryLabels ? firstSeries.categoryLabels : [];
        this.renderSlantedCategoryLabels(graphics, plotRect, font, catLabels, categoryCount, stepX, 1, maxCatLabelWidth);
    }

    private static renderScatterChart(
        graphics: PdfGraphics,
        chart: IChart,
        plotRect: Rectangle,
        font: PdfFont,
        yAxisLabelWidth: number,
        axisScale: { axisMax: number; step: number; ticks: number[] },
        maxCatLabelWidth: number
    ): void {
        const series: IChartSeriesData[] = chart.series || [];
        if (series.length === 0) { return; }
        this.drawAxes(graphics, chart, plotRect, axisScale, font, yAxisLabelWidth, false);
        let maxCount: number = 1;
        for (let i: number = 0; i < series.length; i++) {
            if (series[i as number].values && series[i as number].values.length > maxCount) {
                maxCount = series[i as number].values.length;
            }
        }
        const categoryCount: number = maxCount;
        const stepX: number = categoryCount > 1 ? plotRect.width / (categoryCount - 1) : plotRect.width;
        const gridPen: PdfPen = new PdfPen({ r: 217, g: 217, b: 217 }, 0.5);
        for (let catIndex: number = 0; catIndex < categoryCount; catIndex++) {
            const gridX: number = plotRect.x + (catIndex * stepX);
            graphics.drawLine(gridPen, { x: gridX, y: plotRect.y }, { x: gridX, y: plotRect.y + plotRect.height });
        }
        for (let seriesIndex: number = 0; seriesIndex < series.length; seriesIndex++) {
            const seriesItem: IChartSeriesData = series[seriesIndex as number];
            const color: { r: number; g: number; b: number } = this.getSeriesColor(seriesItem, seriesIndex);
            const markerBrush: PdfBrush = new PdfBrush(color);
            const valuesList: number[] = seriesItem.values;
            for (let pointIndex: number = 0; pointIndex < valuesList.length; pointIndex++) {
                const value: number = valuesList[pointIndex as number];
                if (!isNullOrUndefined(value)) {
                    const pointX: number = plotRect.x + (pointIndex * stepX);
                    const pointY: number = plotRect.y + plotRect.height - ((value / axisScale.axisMax) * plotRect.height);
                    if (seriesIndex === 0) {
                        const diamond: { x: number; y: number }[] = [
                            { x: pointX, y: pointY - 3 },
                            { x: pointX + 3, y: pointY },
                            { x: pointX, y: pointY + 3 },
                            { x: pointX - 3, y: pointY }
                        ];
                        const graphicsObj: Record<string, unknown> = graphics as unknown as Record<string, unknown>;
                        const drawPolygonFn: (points: { x: number; y: number }[], penOrBrush: unknown) => void =
                            graphicsObj['drawPolygon'] as (points: { x: number; y: number }[], penOrBrush: unknown) => void;
                        drawPolygonFn.call(graphics, diamond, markerBrush);
                    } else {
                        graphics.drawRectangle({ x: pointX - 2.5, y: pointY - 2.5, width: 5, height: 5 }, markerBrush);
                    }
                }
            }
        }
        const firstSeries: IChartSeriesData | undefined = series[0 as number];
        const catLabels: (string | number)[] = firstSeries && firstSeries.categoryLabels ? firstSeries.categoryLabels : [];
        const labelStep: number = Math.max(1, Math.ceil(categoryCount / 6));
        this.renderSlantedCategoryLabels(graphics, plotRect, font, catLabels, categoryCount, stepX, labelStep, maxCatLabelWidth);
    }

    private static renderSlantedCategoryLabels(
        graphics: PdfGraphics,
        plotRect: Rectangle,
        font: PdfFont,
        catLabels: (string | number)[],
        categoryCount: number,
        stepX: number,
        labelStep: number,
        maxCatLabelWidth: number
    ): void {
        const rotWidth: number = Math.max(20, maxCatLabelWidth + 12);
        const catFormat: PdfStringFormat = new PdfStringFormat();
        catFormat.alignment = PdfTextAlignment.right;
        catFormat.lineAlignment = PdfVerticalAlignment.middle;
        catFormat.lineLimit = false;
        catFormat.noClip = true;
        const catBrush: PdfBrush = new PdfBrush({ r: 51, g: 51, b: 51 });
        for (let catIndex: number = 0; catIndex < categoryCount; catIndex += labelStep) {
            const catLabel: string | number = catLabels[catIndex as number];
            if (!isNullOrUndefined(catLabel) && String(catLabel).length > 0) {
                const catX: number = plotRect.x + (catIndex * stepX);
                const labelY: number = plotRect.y + plotRect.height + 6;
                const graphicsObj: Record<string, unknown> = graphics as unknown as Record<string, unknown>;
                const saveFn: () => unknown = graphicsObj['save'] as () => unknown;
                const translateFn: (p: { x: number; y: number }) => void =
                    graphicsObj['translateTransform'] as (p: { x: number; y: number }) => void;
                const rotateFn: (deg: number) => void = graphicsObj['rotateTransform'] as (deg: number) => void;
                const restoreFn: (s: unknown) => void = graphicsObj['restore'] as (s: unknown) => void;
                const state: unknown = saveFn.call(graphics);
                translateFn.call(graphics, { x: catX, y: labelY });
                rotateFn.call(graphics, -30);
                graphics.drawString(String(catLabel), font, { x: -rotWidth, y: -4, width: rotWidth, height: 12 }, catBrush, catFormat);
                restoreFn.call(graphics, state);
            }
        }
    }

    private static renderPieChart(graphics: PdfGraphics, chart: IChart, plotRect: Rectangle): void {
        const series: IChartSeriesData[] = chart.series || [];
        if (series.length === 0) { return; }
        const size: number = Math.min(plotRect.width, plotRect.height);
        const centerX: number = plotRect.x + plotRect.width / 2;
        const centerY: number = plotRect.y + plotRect.height / 2;
        const isDoughnut: boolean = (chart.type || '').toLowerCase().indexOf('doughnut') >= 0;
        const seriesCount: number = isDoughnut ? series.length : 1;
        const holeFraction: number = isDoughnut ? 0.5 : 0;
        const trackFraction: number = (1.0 - holeFraction) / seriesCount;
        const ringPen: PdfPen = new PdfPen({ r: 255, g: 255, b: 255 }, 1.5);
        for (let seriesIndex: number = seriesCount - 1; seriesIndex >= 0; seriesIndex--) {
            const seriesItem: IChartSeriesData = series[seriesIndex as number];
            const values: number[] = seriesItem.values || [];
            const total: number = values.reduce((sum: number, val: number) => sum + Math.max(0, val), 0);
            if (total <= 0) { continue; }
            const outerFraction: number = holeFraction + (seriesIndex + 1) * trackFraction;
            const innerFraction: number = isDoughnut ? (holeFraction + seriesIndex * trackFraction) : 0;
            const outerDiameter: number = size * outerFraction;
            const outerRadius: number = outerDiameter / 2;
            const innerRadius: number = (size * innerFraction) / 2;
            const currentRect: Rectangle = {
                x: centerX - outerRadius,
                y: centerY - outerRadius,
                width: outerDiameter,
                height: outerDiameter
            };
            let startAngle: number = PIE_START_ANGLE;
            const boundaryAngles: number[] = [];
            for (let valueIndex: number = 0; valueIndex < values.length; valueIndex++) {
                const rawVal: number = values[valueIndex as number];
                const sweepAngle: number = (Math.max(0, rawVal) / total) * FULL_CIRCLE_ANGLE;
                if (sweepAngle <= 0) { continue; }
                boundaryAngles.push(startAngle);
                const paletteIdx: number = valueIndex % DEFAULT_CHART_PALETTE.length;
                const paletteList: { r: number; g: number; b: number }[] = DEFAULT_CHART_PALETTE;
                const color: { r: number; g: number; b: number } = paletteList[paletteIdx as number];
                const sliceBrush: PdfBrush = new PdfBrush(color);
                let remainingAngle: number = sweepAngle;
                let currentAngle: number = startAngle;
                while (remainingAngle > 0) {
                    const chunk: number = Math.min(remainingAngle, MAX_CHUNK_ANGLE);
                    graphics.drawPie(currentRect, currentAngle, chunk, sliceBrush);
                    currentAngle += chunk;
                    remainingAngle -= chunk;
                }
                startAngle += sweepAngle;
            }
            if (isDoughnut || values.length > 1) {
                for (let angleIndex: number = 0; angleIndex < boundaryAngles.length; angleIndex++) {
                    const angleVal: number = boundaryAngles[angleIndex as number];
                    const rad: number = (angleVal * Math.PI) / 180;
                    graphics.drawLine(
                        ringPen,
                        { x: centerX + innerRadius * Math.cos(rad), y: centerY + innerRadius * Math.sin(rad) },
                        { x: centerX + outerRadius * Math.cos(rad), y: centerY + outerRadius * Math.sin(rad) }
                    );
                }
            }
            graphics.drawEllipse(currentRect, ringPen);
        }
        if (isDoughnut) {
            const holeDiameter: number = size * holeFraction;
            const holeRect: Rectangle = {
                x: centerX - holeDiameter / 2,
                y: centerY - holeDiameter / 2,
                width: holeDiameter,
                height: holeDiameter
            };
            const holeBrush: PdfBrush = new PdfBrush({ r: 255, g: 255, b: 255 });
            graphics.drawEllipse(holeRect, ringPen, holeBrush);
        }
    }

    private static drawAxes(
        graphics: PdfGraphics,
        chart: IChart,
        plotRect: Rectangle,
        axisScale: { axisMax: number; step: number; ticks: number[] },
        font: PdfFont,
        yAxisLabelWidth: number,
        isPercent: boolean = false
    ): void {
        const showValAxis: boolean = !chart.primaryValueAxis || chart.primaryValueAxis.visible !== false;
        const showCatAxis: boolean = !chart.primaryCategoryAxis || chart.primaryCategoryAxis.visible !== false;
        const showGridLines: boolean = !chart.primaryValueAxis || chart.primaryValueAxis.hasMajorGridLines !== false;
        const axisPen: PdfPen = new PdfPen({ r: 217, g: 217, b: 217 }, 0.8);
        const gridPen: PdfPen = new PdfPen({ r: 217, g: 217, b: 217 }, 0.5);
        const textBrush: PdfBrush = new PdfBrush({ r: 89, g: 89, b: 89 });
        const axisFormat: PdfStringFormat = new PdfStringFormat();
        axisFormat.alignment = PdfTextAlignment.right;
        axisFormat.lineAlignment = PdfVerticalAlignment.middle;
        axisFormat.lineLimit = false;
        axisFormat.noClip = true;
        const ticks: number[] = axisScale.ticks;
        const axisMax: number = axisScale.axisMax;
        for (let tickIndex: number = 0; tickIndex < ticks.length; tickIndex++) {
            const tickValue: number = ticks[tickIndex as number];
            const ratio: number = tickValue / axisMax;
            const tickY: number = plotRect.y + plotRect.height - (ratio * plotRect.height);
            if (tickIndex > 0 && showGridLines) {
                graphics.drawLine(gridPen, { x: plotRect.x, y: tickY }, { x: plotRect.x + plotRect.width, y: tickY });
            }
            if (showValAxis) {
                const valStr: string = isPercent ? (Math.round(tickValue) + '%') : parseFloat(tickValue.toFixed(4)).toString();
                graphics.drawString(
                    valStr,
                    font,
                    { x: plotRect.x - yAxisLabelWidth - 4, y: tickY - 6, width: yAxisLabelWidth, height: 12 },
                    textBrush,
                    axisFormat
                );
            }
        }
        if (showValAxis) {
            graphics.drawLine(axisPen, { x: plotRect.x, y: plotRect.y }, { x: plotRect.x, y: plotRect.y + plotRect.height });
        }
        if (showCatAxis) {
            graphics.drawLine(
                axisPen,
                { x: plotRect.x, y: plotRect.y + plotRect.height },
                { x: plotRect.x + plotRect.width, y: plotRect.y + plotRect.height }
            );
        }
        if (chart.primaryValueAxis && chart.primaryValueAxis.title) {
            const vTitleFormat: PdfStringFormat = new PdfStringFormat();
            vTitleFormat.alignment = PdfTextAlignment.center;
            vTitleFormat.lineAlignment = PdfVerticalAlignment.middle;
            const titleFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 7, PdfFontStyle.regular);
            const graphicsObj: Record<string, unknown> = graphics as unknown as Record<string, unknown>;
            const saveFn: () => unknown = graphicsObj['save'] as () => unknown;
            const translateFn: (p: { x: number; y: number }) => void =
                graphicsObj['translateTransform'] as (p: { x: number; y: number }) => void;
            const rotateFn: (deg: number) => void = graphicsObj['rotateTransform'] as (deg: number) => void;
            const restoreFn: (s: unknown) => void = graphicsObj['restore'] as (s: unknown) => void;
            const state: unknown = saveFn.call(graphics);
            translateFn.call(graphics, { x: plotRect.x - yAxisLabelWidth - 10, y: plotRect.y + plotRect.height / 2 });
            rotateFn.call(graphics, -90);
            graphics.drawString(
                String(chart.primaryValueAxis.title),
                titleFont,
                { x: -plotRect.height / 2, y: -6, width: plotRect.height, height: 12 },
                textBrush,
                vTitleFormat
            );
            restoreFn.call(graphics, state);
        }
        if (chart.primaryCategoryAxis && chart.primaryCategoryAxis.title) {
            const cTitleFormat: PdfStringFormat = new PdfStringFormat();
            cTitleFormat.alignment = PdfTextAlignment.center;
            cTitleFormat.lineAlignment = PdfVerticalAlignment.top;
            const titleFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 7, PdfFontStyle.regular);
            graphics.drawString(
                String(chart.primaryCategoryAxis.title),
                titleFont,
                { x: plotRect.x, y: plotRect.y + plotRect.height + 18, width: plotRect.width, height: 12 },
                textBrush,
                cTitleFormat
            );
        }
    }

    private static renderRightLegend(graphics: PdfGraphics, chart: IChart, legendRect: Rectangle, font: PdfFont): void {
        const series: IChartSeriesData[] = chart.series || [];
        if (series.length === 0) { return; }
        const labelBrush: PdfBrush = new PdfBrush({ r: 80, g: 80, b: 80 });
        const labelFormat: PdfStringFormat = new PdfStringFormat();
        labelFormat.alignment = PdfTextAlignment.left;
        labelFormat.lineAlignment = PdfVerticalAlignment.middle;
        labelFormat.noClip = true;
        const isBar: boolean = (chart.type || '').toLowerCase().indexOf('bar') >= 0;
        let curY: number = legendRect.y;
        for (let itemIndex: number = 0; itemIndex < series.length; itemIndex++) {
            const seriesIndex: number = isBar ? (series.length - 1 - itemIndex) : itemIndex;
            const currentSeries: IChartSeriesData = series[seriesIndex as number];
            const defaultTitle: string = 'Series ' + (seriesIndex + 1);
            const title: string = sanitizeTextForFont(currentSeries.title || defaultTitle, font);
            const color: { r: number; g: number; b: number } = this.getSeriesColor(currentSeries, seriesIndex);
            const swatchBrush: PdfBrush = new PdfBrush(color);
            graphics.drawRectangle({ x: legendRect.x, y: curY + 2, width: SWATCH_SIZE, height: SWATCH_SIZE }, swatchBrush);
            const maxWidth: number = Math.max(10, legendRect.width - SWATCH_SIZE - SWATCH_PAD);
            graphics.drawString(
                title,
                font,
                { x: legendRect.x + SWATCH_SIZE + SWATCH_PAD, y: curY, width: maxWidth, height: ENTRY_HEIGHT },
                labelBrush,
                labelFormat
            );
            curY += ROW_HEIGHT;
        }
    }

    private static renderLegend(graphics: PdfGraphics, chart: IChart, legendRect: Rectangle, font: PdfFont): void {
        const series: IChartSeriesData[] = chart.series || [];
        if (series.length === 0) { return; }
        const chartType: string = (chart.type || '').toLowerCase();
        const isPie: boolean = chartType.indexOf('pie') >= 0 || chartType.indexOf('doughnut') >= 0;
        const labelBrush: PdfBrush = new PdfBrush({ r: 80, g: 80, b: 80 });
        if (isPie) {
            const firstSeries: IChartSeriesData = series[0 as number];
            const categories: (string | number)[] = firstSeries && firstSeries.categoryLabels ? firstSeries.categoryLabels : [];
            const numCols: number = categories.length > 4 ? 3 : Math.min(categories.length, 4);
            const pieLegendFont: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 7, PdfFontStyle.regular);
            const pieSwatchSize: number = 6;
            const pieColGap: number = 8;
            const colWidths: number[] = new Array(numCols).fill(0);
            for (let catIndex: number = 0; catIndex < categories.length; catIndex++) {
                const colIndex: number = catIndex % numCols;
                const catVal: string | number = categories[catIndex as number];
                const defaultLabel: string = 'Item ' + (catIndex + 1);
                const label: string = sanitizeTextForFont(String(catVal || defaultLabel), pieLegendFont);
                const textWidth: number = Math.ceil(measurePdfText(label, pieLegendFont).width);
                const itemWidth: number = pieSwatchSize + SWATCH_PAD + textWidth + 2;
                const prevColWidth: number = colWidths[colIndex as number];
                if (itemWidth > prevColWidth) {
                    colWidths[colIndex as number] = itemWidth;
                }
            }
            let totalGridWidth: number = 0;
            for (let colIndex: number = 0; colIndex < numCols; colIndex++) {
                totalGridWidth += colWidths[colIndex as number] + (colIndex < numCols - 1 ? pieColGap : 0);
            }
            const gridStartX: number = legendRect.x + Math.max(0, (legendRect.width - totalGridWidth) / 2);
            const colX: number[] = [];
            let curColX: number = gridStartX;
            for (let colIndex: number = 0; colIndex < numCols; colIndex++) {
                colX.push(curColX);
                curColX += colWidths[colIndex as number] + pieColGap;
            }
            const labelFormat: PdfStringFormat = new PdfStringFormat();
            labelFormat.alignment = PdfTextAlignment.left;
            labelFormat.lineAlignment = PdfVerticalAlignment.middle;
            labelFormat.noClip = true;
            labelFormat.lineLimit = false;
            const formatObj: Record<string, unknown> = labelFormat as unknown as Record<string, unknown>;
            formatObj['_wordWrapType'] = 0;
            for (let catIndex: number = 0; catIndex < categories.length; catIndex++) {
                const rowIndex: number = Math.floor(catIndex / numCols);
                const colIndex: number = catIndex % numCols;
                const itemX: number = colX[colIndex as number];
                const itemY: number = legendRect.y + (rowIndex * ROW_HEIGHT);
                const catVal: string | number = categories[catIndex as number];
                const defaultLabel: string = 'Item ' + (catIndex + 1);
                const label: string = sanitizeTextForFont(String(catVal || defaultLabel), pieLegendFont);
                const paletteIdx: number = catIndex % DEFAULT_CHART_PALETTE.length;
                const paletteList: { r: number; g: number; b: number }[] = DEFAULT_CHART_PALETTE;
                const color: { r: number; g: number; b: number } = paletteList[paletteIdx as number];
                const swatchBrush: PdfBrush = new PdfBrush(color);
                graphics.drawRectangle({ x: itemX, y: itemY + 3, width: pieSwatchSize, height: pieSwatchSize }, swatchBrush);
                const textWidth: number = colWidths[colIndex as number] - (pieSwatchSize + SWATCH_PAD);
                graphics.drawString(
                    label,
                    pieLegendFont,
                    { x: itemX + pieSwatchSize + SWATCH_PAD, y: itemY, width: textWidth, height: ENTRY_HEIGHT },
                    labelBrush,
                    labelFormat
                );
            }
            return;
        }
        const titleWidths: number[] = [];
        let totalWidth: number = 0;
        for (let seriesIndex: number = 0; seriesIndex < series.length; seriesIndex++) {
            const currentSeries: IChartSeriesData = series[seriesIndex as number];
            const defaultTitle: string = 'Series ' + (seriesIndex + 1);
            const title: string = sanitizeTextForFont(currentSeries.title || defaultTitle, font);
            const titleWidth: number = Math.ceil(measurePdfText(title, font).width);
            titleWidths.push(titleWidth);
            totalWidth += SWATCH_SIZE + SWATCH_PAD + titleWidth + (seriesIndex < series.length - 1 ? ITEM_SPACING : 0);
        }
        let currentX: number = Math.max(legendRect.x, legendRect.x + (legendRect.width - totalWidth) / 2);
        for (let seriesIndex: number = 0; seriesIndex < series.length; seriesIndex++) {
            const currentSeries: IChartSeriesData = series[seriesIndex as number];
            const defaultTitle: string = 'Series ' + (seriesIndex + 1);
            const title: string = sanitizeTextForFont(currentSeries.title || defaultTitle, font);
            const color: { r: number; g: number; b: number } = this.getSeriesColor(currentSeries, seriesIndex);
            const swatchBrush: PdfBrush = new PdfBrush(color);
            const itemTextWidth: number = titleWidths[seriesIndex as number];
            const isLineLike: boolean = chartType.indexOf('line') >= 0 || chartType.indexOf('scatter') >= 0;
            if (isLineLike) {
                const swatchPen: PdfPen = new PdfPen(color, 2);
                graphics.drawLine(swatchPen, { x: currentX, y: legendRect.y + 6 }, { x: currentX + SWATCH_SIZE, y: legendRect.y + 6 });
            } else {
                graphics.drawRectangle({ x: currentX, y: legendRect.y + 2, width: SWATCH_SIZE, height: SWATCH_SIZE }, swatchBrush);
            }
            currentX += SWATCH_SIZE + SWATCH_PAD;
            graphics.drawString(title, font, { x: currentX, y: legendRect.y, width: itemTextWidth + 4, height: ENTRY_HEIGHT }, labelBrush);
            currentX += itemTextWidth + ITEM_SPACING;
        }
    }

    private static getSeriesColor(seriesItem: IChartSeriesData, seriesIndex: number): { r: number; g: number; b: number } {
        if (seriesItem.color) {
            const cleanHex: string = seriesItem.color.replace('#', '').trim();
            if (cleanHex.length === 6 || cleanHex.length === 8 || cleanHex.length === 3) {
                return toPdfColor(parseHexColor(seriesItem.color));
            }
        }
        const paletteIdx: number = seriesIndex % DEFAULT_CHART_PALETTE.length;
        const paletteList: { r: number; g: number; b: number }[] = DEFAULT_CHART_PALETTE;
        return paletteList[paletteIdx as number];
    }
}
