import { LineBase } from '../series/line-base';
import { Series, Points } from '../series/chart-series';
import { RectOption, Rect, appendClipElement } from '../../common/utils/helper';
import { findClipRect } from '../../common/utils/helper';
import { TechnicalIndicator } from './technical-indicator';
import { Chart } from '../chart';
import { BaseAttibutes } from '@syncfusion/ej2-base';
/**
 * Technical Analysis module helps to predict the market trend
 */
export class TechnicalAnalysis extends LineBase {
    /**
     * Defines the collection of series, that are used to represent the given technical indicator
     * @private
     */
    public initSeriesCollection(indicator: TechnicalIndicator, chart: Chart): void {
        indicator.targetSeries = [];
        let signalLine: Series = new Series(indicator, 'targetSeries', {}, true);
        this.setSeriesProperties(signalLine, indicator, 'SignalLine', indicator.fill, indicator.width, chart);
    }

    /**
     * Initializes the properties of the given series
     * @private
     */
    protected setSeriesProperties(
        series: Series, indicator: TechnicalIndicator, name: string, fill: string,
        width: number, chart: Chart): void {
        series.name = name;
        series.xName = 'x';
        series.yName = 'y';
        series.fill = fill || '#606eff';
        series.dashArray = indicator.dashArray;
        series.width = width;
        series.xAxisName = indicator.xAxisName;
        series.animation = indicator.animation;
        series.yAxisName = indicator.yAxisName;
        series.clipRectElement = indicator.clipRectElement;
        series.points = [];
        series.enableTooltip = true;
        series.interior = series.fill;
        series.category = 'Indicator';
        series.index = indicator.index;
        series.chart = chart;
        series.xMin = Infinity; series.xMax = -Infinity;
        series.yMin = Infinity; series.yMax = -Infinity;
        series.xData = [];
        series.yData = [];
        series.marker.visible = false;
        indicator.targetSeries.push(series);
    }

    /**
     * Creates the elements of a technical indicator
     * @private
     */
    public createIndicatorElements(chart: Chart, indicator: TechnicalIndicator, index: number): void {
        if (indicator.seriesName || indicator.dataSource) {
            findClipRect(indicator.targetSeries[0]);
        }
        let clipRect: Rect = new Rect(0, 0, 0, 0);
        if (indicator.seriesName || indicator.dataSource) {
            clipRect = indicator.targetSeries[0].clipRect;
        }
        let options: BaseAttibutes = new RectOption(
            chart.element.id + '_ChartIndicatorClipRect_' + index, 'transparent', { width: 1, color: 'Gray' }, 1,
            {
                x: 0, y: 0, width: clipRect.width,
                height: clipRect.height,
            });
        let clipRectElement: Element = appendClipElement(chart.redraw, options, chart.renderer);
        //defines the clip rect element

        //creates the group for an indicator
        indicator.indicatorElement = chart.renderer.createGroup({
            'id': chart.element.id + 'IndicatorGroup' + index,
            'transform': 'translate(' + clipRect.x + ',' + clipRect.y + ')',
            'clip-path': 'url(#' + chart.element.id + '_ChartIndicatorClipRect_' + index + ')'
        });

        indicator.indicatorElement.appendChild(clipRectElement);

        //Defines a group for each series in a technical indicator
        for (let series of indicator.targetSeries) {
            series.clipRectElement = clipRectElement;
            let element: Element = series.chart.renderer.createGroup({
                'id': series.chart.element.id + '_Indicator_' +
                    indicator.index + '_' + series.name + '_Group'
            });
            indicator.indicatorElement.appendChild(element);
            series.seriesElement = element;
        }
        chart.indicatorElements.appendChild(indicator.indicatorElement);
    }

    protected getDataPoint(
        x: Object, y: Object, sourcePoint: Points, series: Series, index: number,
        indicator: TechnicalIndicator = null): Points {
        let point: Points = new Points();
        point.x = x;
        point.y = y;
        point.xValue = sourcePoint.xValue;
        point.color = series.fill;
        point.index = index;
        point.yValue = <number>y;
        point.visible = true;
        series.xMin = Math.min(series.xMin, point.xValue);
        series.yMin = Math.min(series.yMin, point.yValue);
        series.xMax = Math.max(series.xMax, point.xValue);
        series.yMax = Math.max(series.yMax, point.yValue);
        series.xData.push(point.xValue);
        if (indicator && indicator.type === 'Macd' && series.type === 'Column') {
            if (point.y >= 0) {
                point.color = indicator.macdPositiveColor;
            } else {
                point.color = indicator.macdNegativeColor;
            }
        }
        return point;
    }
    protected getRangePoint(
        x: Object, high: Object, low: Object, sourcePoint: Points, series: Series, index: number,
        indicator: TechnicalIndicator = null): Points {
        let point: Points = new Points();
        point.x = x;
        point.high = <number>high;
        point.low = <number>low;
        point.xValue = sourcePoint.xValue;
        point.color = series.fill;
        point.index = index;
        point.visible = true;
        series.xData.push(point.xValue);
        return point;
    }

    protected setSeriesRange(points: Points[], indicator: TechnicalIndicator, series: Series = null): void {
        if (!series) {
            indicator.targetSeries[0].points = points;
        } else {
            series.points = points;
        }
    }

}