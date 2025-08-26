import { measureText, PathOption, Rect, removeElement, Size, SvgRenderer, TextOption } from '@syncfusion/ej2-svg-base';
import { RectOption, linear, textElement, appendChildElement, ChartLocation } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { LastValueLabelSettingsModel} from './chart-series-model';
import { AnimationOptions, createElement, Animation, isNullOrUndefined } from '@syncfusion/ej2-base';
import { FontModel, MarginModel } from '../../common/model/base-model';
import { StockChart } from '../../stock-chart';
import { Axis } from '../../chart/index';

export class LastValueLabel {

    private chart: Chart;
    private svgRenderer: SvgRenderer;
    private padding: number = 6;
    public commonId: string;
    locationX: number;
    locationY: number;
    private elementID: string;

    constructor(chartInstance: Chart | StockChart['chart']) {
        this.chart = chartInstance;
    }

    public initPrivateVariables(chart: Chart): void {
        this.chart = chart;
        this.elementID = chart.element.id;
        this.svgRenderer = chart.renderer as SvgRenderer;
    }

    public render(series: Series, chart: Chart, lastValueLabel: LastValueLabelSettingsModel, isExisting?: boolean): void {
        if (!this.chart || !this.svgRenderer) {
            this.initPrivateVariables(chart);
        }
        if (!chart.enableCanvas && !series.lastValueLabelElement) {
            const groupID: string = `${this.elementID}_LastValueLabel_Group_${series.index}`;
            series.lastValueLabelElement = chart.renderer.createGroup({ id: groupID }) as HTMLElement;
        }
        this.renderLastValue(series, chart, lastValueLabel, isExisting ? isExisting : false);
    }

    private renderLastValue(series: Series, chart: Chart, lastValueLabel: LastValueLabelSettingsModel
        , isExisting?: boolean): void {
        const isHighLowOpenClose: boolean = series.seriesType === 'HighLowOpenClose';
        const isHighLow: boolean = series.seriesType === 'HighLow';
        if (series.visiblePoints.length < 1) {
            return ;
        }
        const lastPoint: Points = series.visiblePoints[series.visiblePoints.length - 1];
        const yAxis: Axis = series.yAxis;
        const clipRect: Rect = series.clipRect;
        const labelId: string = `${this.elementID}_LastValueLabel_${series.index}`;
        const rawValue: number = isHighLowOpenClose ? parseFloat(lastPoint.close as string)
            : isHighLow ? parseFloat(lastPoint.low as string) : lastPoint.yValue;
        if (!(series.type === 'Candle'
            ? (lastPoint.symbolLocations && lastPoint.symbolLocations.length > 0)
            : isHighLowOpenClose
                ? (lastPoint.regions && lastPoint.regions.length > 0)
                : (lastPoint.symbolLocations && lastPoint.symbolLocations.length > 0))
            || (rawValue > yAxis.visibleRange.max || rawValue < yAxis.visibleRange.min)) {
            return;
        }
        let translateX: number = series.chart.requireInvertedAxis ? clipRect.x + (series.type === 'Candle'
            ? lastPoint.symbolLocations[1].x : isHighLowOpenClose ? (lastPoint.open <= lastPoint.close)
                ? lastPoint.regions[1].x : lastPoint.regions[2].x : lastPoint.symbolLocations[0].x) : clipRect.x;
        let translateY: number = series.chart.requireInvertedAxis ? (clipRect.y) : clipRect.y
            + (series.type === 'Candle' ? lastPoint.symbolLocations[1].y : isHighLowOpenClose
                ? (lastPoint.open <= lastPoint.close) ? lastPoint.regions[1].y : lastPoint.regions[2].y : lastPoint.symbolLocations[0].y);
        translateX = chart.requireInvertedAxis && (isHighLow || series.type === 'Candle') && !yAxis.isInversed
            ? translateX - lastPoint.regions[isHighLow ? 0 : 1].width : translateX;
        translateY = !chart.requireInvertedAxis && (isHighLow || series.type === 'Candle') && !yAxis.isInversed
            ? translateY + lastPoint.regions[isHighLow ? 0 : 1].height : translateY;
        const transformValue: string = 'translate(' + translateX + ',' + translateY + ')';
        const previousTransform: string = series.lastValueLabelElement ? series.lastValueLabelElement.getAttribute('transform') : null;
        const labelFormat: string = yAxis.labelFormat;
        let formattedRawValue: string = rawValue.toString();
        if (!(labelFormat && labelFormat.indexOf('n') > -1)) {
            formattedRawValue = (rawValue % 1 === 0)
                ? rawValue.toFixed(0)
                : (rawValue.toFixed(2).slice(-1) === '0'
                    ? rawValue.toFixed(1)
                    : rawValue.toFixed(2));
        }
        const lastLabeltext: string = labelFormat && labelFormat.match('{value}') !== null
            ? labelFormat.replace('{value}', yAxis.format(parseFloat(formattedRawValue)))
            : yAxis.format(parseFloat(formattedRawValue));

        const style: FontModel = lastValueLabel.font;
        const size: Size = measureText(lastLabeltext, style, this.chart.themeStyle.crosshairLabelFont);

        const labelWidth: number = size.width + this.padding * 2;
        const labelHeight: number = size.height + this.padding * 2;
        const baseValue: number = chart.requireInvertedAxis ? (chart.enableCanvas ? yAxis.rect.y : yAxis.rect.y - translateY)
            : (chart.enableCanvas ? yAxis.rect.x : yAxis.rect.x - translateX);
        const tickSize: number = yAxis.tickPosition === 'Outside' ? yAxis.majorTickLines.height : 0;
        const axisLabelPadding: number = yAxis.labelPadding;
        const borderWidth: number = lastValueLabel.border.width * 2;
        const labelSize: number = chart.requireInvertedAxis ? yAxis.maxLabelSize.height : yAxis.maxLabelSize.width;
        const isOutside: boolean = yAxis.labelPosition === 'Outside';
        const isOpposed: boolean = chart.enableRtl && !chart.requireInvertedAxis ? !yAxis.opposedPosition : yAxis.opposedPosition;

        let labelX: number = chart.requireInvertedAxis ? (chart.enableCanvas ? translateX : 0) - labelWidth / 2 : isOutside
            ? baseValue + (isOpposed
                ? axisLabelPadding + tickSize - borderWidth
                : -(axisLabelPadding + tickSize + borderWidth + labelSize))
            : baseValue + (isOpposed
                ? -(labelWidth)
                : 0);
        let labelY: number = chart.requireInvertedAxis ? isOutside
            ? baseValue + (isOpposed
                ? -(labelHeight + axisLabelPadding + tickSize)
                : (axisLabelPadding + tickSize + borderWidth))
            : baseValue + (isOpposed
                ? 0
                : -(labelHeight)) : (chart.enableCanvas ? translateY : 0) - labelHeight / 2;
        labelX = Math.max(-translateX + borderWidth
            , Math.min(labelX, chart.availableSize.width - labelWidth - borderWidth - translateX));
        labelY = Math.max(-translateY + borderWidth
            , Math.min(labelY, chart.availableSize.height - labelHeight - borderWidth - translateY));
        const labelRect: Rect = new Rect(labelX, labelY, labelWidth, labelHeight);
        chart.lastValueLabelCollections.push(labelRect);

        const background: Element = this.chart.renderer.drawRectangle(new RectOption(
            `${this.elementID}_LastValueLabel_Background_${series.index}`, lastValueLabel.background || chart.themeStyle.crosshairFill,
            { width: lastValueLabel.border.width || 1, color: lastValueLabel.border.color },
            1,
            labelRect, lastValueLabel.rx, lastValueLabel.ry
        ));
        appendChildElement(this.chart.enableCanvas, series.lastValueLabelElement, background, this.chart.redraw);
        const lineStartY: number = chart.requireInvertedAxis ? (chart.enableCanvas ? translateY : 0)
            + (isOpposed ? clipRect.height : 0) : chart.enableCanvas ? translateY : 0;
        const lineStartX: number = chart.requireInvertedAxis ? chart.enableCanvas ? translateX : 0
            : (isOpposed ? chart.enableCanvas ? translateX : 0 : chart.enableCanvas ? translateX
                + clipRect.width : clipRect.width);
        const lineEndX: number = chart.requireInvertedAxis ? chart.enableCanvas ? translateX : 0
            : isOpposed ? labelX : labelX + labelWidth;
        const lineEndY: number = chart.requireInvertedAxis ? (isOpposed ? (labelY + labelHeight)
            : labelY) : chart.enableCanvas ? translateY : 0;
        const linePath: string = `M ${lineStartX} ${lineStartY} L ${lineEndX} ${lineEndY}`;

        const line: Element = this.chart.renderer.drawPath(new PathOption(
            `${this.elementID}_LastValueLine_${series.index}`, 'none', lastValueLabel.lineWidth || 1, lastValueLabel.lineColor || chart.themeStyle.crosshairLine, 1, lastValueLabel.dashArray || '', linePath
        ));
        appendChildElement(this.chart.enableCanvas, series.lastValueLabelElement, line, this.chart.redraw);


        textElement(this.chart.renderer, new TextOption(labelId, labelRect.x + labelRect.width / 2, (labelRect.y + labelRect.height / 2 + size.height * 0.35), 'middle', lastLabeltext), style, style.color || chart.themeStyle.crosshairLabelFont.color, series.lastValueLabelElement, false, chart.redraw, false, false, null, null, null, null, chart.enableCanvas, null, this.chart.themeStyle.crosshairLabelFont, new ChartLocation(labelRect.x + labelRect.width / 2, (labelRect.y + labelRect.height / 2 + size.height * 0.35)));

        if (!this.chart.enableCanvas && isExisting && previousTransform && this.chart.enableAnimation) {
            this.animateLastValueLabel(series.lastValueLabelElement as HTMLElement
                , previousTransform, translateX, translateY, series.chart.duration);
        }
        else if (!this.chart.enableCanvas) {
            series.lastValueLabelElement.setAttribute('transform', transformValue);
            series.lastValueLabelElement.setAttribute('visibility', (chart.stockChart ? chart.stockChart.initialRender : chart.animateSeries) && series.animation.enable ? 'hidden' : 'visible');
        }


    }

    private animateLastValueLabel(element: HTMLElement, previousTransform: string
        , targetX: number, targetY: number, animateDuration: number): void {
        const transform: string = previousTransform;
        const transformValues: string[] = transform.split(/[(),\s]+/);
        const existingTranslateX: number = parseFloat(transformValues[1]) || 0;
        const existingTranslateY: number = parseFloat(transformValues[2]) || 0;
        let duration: number = 500;
        if (!isNullOrUndefined(animateDuration)) {
            duration = animateDuration;
        }
        new Animation({}).animate(createElement('div'), {
            duration: duration,
            progress: (args: AnimationOptions): void => {
                const calculatedTranslateY: number = linear(args.timeStamp, existingTranslateY
                    , targetY - existingTranslateY, args.duration);
                const calculatedTranslateX: number = linear(args.timeStamp, existingTranslateX
                    , targetX - existingTranslateX, args.duration);
                const transformValue: string = 'translate(' + calculatedTranslateX + ',' + calculatedTranslateY + ')';
                element.setAttribute('transform', transformValue);
            },
            end: (): void => {
                const transformValue: string = 'translate(' + targetX + ',' + targetY + ')';
                element.setAttribute('transform', transformValue);
            }
        });
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        // Returns the module name
        return 'LastValueLabel';
    }
    /**
     * To destroy the seiresLabel for series.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method performed here
    }
}
