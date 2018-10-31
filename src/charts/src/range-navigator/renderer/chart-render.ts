import { Chart, DateTime, Logarithmic, IntervalType } from '../../chart/index';
import { Axis, AxisModel, firstToLowerCase, RectOption, Rect, measureText } from '../../chart/index';
import { RangeNavigator } from '../range-navigator';
import { DataManager, Query, DataUtil } from '@syncfusion/ej2-data';
import { DataPoint } from '../utils/helper';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Double } from '../../chart/axis/double-axis';
import { RangeNavigatorSeries } from '../model/range-base';
import { getSeriesColor } from '../../common/model/theme';
import { NiceInterval, Size, PathOption } from '../../chart/index';
import { Data } from '../../common/model/data';

/**
 * To render Chart series
 */
export class RangeSeries extends NiceInterval {
    private dataSource: Object | DataManager;
    private xName: string;
    private yName: string;
    private query: Query;
    public xMin: number;
    public xMax: number;
    private yMin: number;
    private yMax: number;
    private yAxis: Axis;
    public xAxis: Axis;
    private seriesLength: number;
    constructor(range: RangeNavigator) {
        super();
        this.dataSource = range.dataSource;
        this.xName = range.xName;
        this.yName = range.yName;
        this.query = range.query;
        this.xMin = Infinity; this.xMax = -Infinity;
        this.yMin = Infinity; this.yMax = -Infinity;
    }
    /**
     * To render light weight and data manager process
     * @param control 
     */
    public renderChart(control: RangeNavigator): void {
        let dataSource: Object;
        let query: Query;
        this.seriesLength = 0;
        control.rangeSlider.points = [];
        if (control.series.length) {
            control.series.map((series: RangeNavigatorSeries) => {
                dataSource = series.dataSource || control.dataSource;
                query = series.query || control.query;
                series.points = [];
                this.processDataSource(dataSource, query, control, series);
            });
        } else {
            this.processDataSource(control.dataSource, control.query, control);
        }
    }

    private processDataSource(dataSource: Object, query: Query, control: RangeNavigator, series?: RangeNavigatorSeries): void {
        if (isNullOrUndefined(query) && !isNullOrUndefined(dataSource)) {
            this.dataManagerSuccess({ result: dataSource, count: (dataSource as Object[]).length }, control, series);
            return;
        }
        control.dataModule = new Data(dataSource, query);
        let dataManager: Promise<Object> = control.dataModule.getData(control.dataModule.generateQuery().requiresCount());
        dataManager.then((e: { result: Object, count: number }) => this.dataManagerSuccess(e, control, series));
    }
    /**
     * data manager process calculated here
     * @param e 
     */
    private dataManagerSuccess(e: { result: Object, count: number }, control: RangeNavigator, series?: RangeNavigatorSeries): void {
        let viewData: Object = e.result !== '' ? e.result : [];
        this.processJsonData(viewData as Object[], control, Object.keys(viewData).length, series);
        this.seriesLength += series ? 1 : this.seriesLength;
        if (!series || this.seriesLength === control.series.length) {
            this.processXAxis(control);
            this.calculateGroupingBounds(control);
            this.processYAxis(control);
            control.renderChart();
        }
    }
    /**
     * Process JSON data from data source
     * @param control 
     * @param len 
     */
    private processJsonData(viewData: Object[], control: RangeNavigator, len: number, series: RangeNavigatorSeries): void {
        let i: number = 0;
        let point: DataPoint;
        let xName: string = (series && series.xName) || control.xName;
        let yName: string = (series && series.yName) || control.yName;
        while (i < len) {
            point = new DataPoint(getValue(xName, viewData[i]), getValue(yName, viewData[i]));
            point.yValue = +point.y;
            if (control.valueType === 'DateTime') {
                let dateParser: Function = control.intl.getDateParser({ skeleton: 'full', type: 'dateTime' });
                let dateFormatter: Function = control.intl.getDateFormat({ skeleton: 'full', type: 'dateTime' });
                point.x = new Date( DataUtil.parse.parseJson({ val: point.x }).val );
                point.xValue = Date.parse(dateParser(dateFormatter(point.x)));
            } else {
                point.xValue = +point.x;
            }
            if (series) {
                series.points.push(point);
            }
            this.xMin = Math.min(this.xMin, point.xValue);
            this.yMin = Math.min(this.yMin, point.yValue);
            this.xMax = Math.max(this.xMax, point.xValue);
            this.yMax = Math.max(this.yMax, point.yValue);
            control.rangeSlider.points.push(point);
            i++;
        }
    }
    private processXAxis(control: RangeNavigator): void {
        let axisModule: DateTime | Double | DateTime | Logarithmic;
        let axis: AxisModel = {
            minimum: control.minimum, maximum: control.maximum,
            interval: control.interval, valueType: control.valueType,
            isInversed: control.enableRtl, labelFormat: control.labelFormat,
            logBase: control.logBase, skeleton: control.skeleton, skeletonType: control.skeletonType
        };
        this.xAxis = axis as Axis;
        this.xAxis.intervalType = control.intervalType as IntervalType;
        this.xAxis.maximumLabels = 3;
        this.xAxis.skeleton = control.skeleton;
        this.xAxis.intervalDivs = [10, 5, 2, 1];
        this.xAxis.rect = control.bounds;
        this.xAxis.visibleLabels = [];
        this.xAxis.orientation = 'Horizontal';
        axisModule = control[firstToLowerCase(control.valueType) + 'Module'];
        axisModule.min = this.xMin;
        axisModule.max = this.xMax;
        axisModule.getActualRange(this.xAxis, control.bounds);
        if (this.xAxis.valueType !== 'Logarithmic') {
            axisModule.updateActualRange(
                this.xAxis, this.xAxis.actualRange.min, this.xAxis.actualRange.max, this.xAxis.actualRange.interval
            );
        }
        this.xAxis.actualRange.delta = this.xAxis.actualRange.max - this.xAxis.actualRange.min;
        this.xAxis.visibleRange = this.xAxis.actualRange;
        axisModule.calculateVisibleLabels(this.xAxis, control);
    }
    /**
     * Process yAxis for range navigator
     * @param control 
     */
    private processYAxis(control: RangeNavigator): void {
        let axis: AxisModel = {
            majorGridLines: { width: 0 }, rangePadding: 'None',
            majorTickLines: { width: 0 }, labelStyle: { size: '0' },
            visible: false, valueType: 'Double', minimum: null, maximum: null,
            interval: null
        };
        this.yAxis = axis as Axis;
        this.yAxis.rect = control.bounds;
        this.yAxis.maximumLabels = 3;
        this.yAxis.intervalDivs = [10, 5, 2, 1];
        this.yAxis.orientation = 'Vertical';
        control.doubleModule.min = this.yMin;
        control.doubleModule.max = this.yMax;
        control.doubleModule.getActualRange(this.yAxis, control.bounds);
        control.doubleModule.updateActualRange(
            this.yAxis, this.yAxis.actualRange.min, this.yAxis.actualRange.max, this.yAxis.actualRange.interval
        );
        this.yAxis.actualRange.delta = this.yAxis.actualRange.max - this.yAxis.actualRange.min;
        this.yAxis.visibleRange = this.yAxis.actualRange;
    }

    /**
     * Process Light weight control
     * @param control
     * @private
     */
    public renderSeries(control: RangeNavigator): void {
        let chartGroup: Element = control.renderer.createGroup({ id: control.element.id + '_chart' });
        let colors: string[] = getSeriesColor(control.theme);
        control.series.map((series: RangeNavigatorSeries, index: number) => {
            series.xAxis = this.xAxis;
            series.yAxis = this.yAxis;
            series.chart = control;
            series.index = index;
            series.xAxis.isInversed = control.enableRtl;
            series.interior = series.fill || colors[index % colors.length];
            this.createSeriesElement(control, series, index);
            control[firstToLowerCase(series.type) + 'SeriesModule'].render(
                series, this.xAxis, this.yAxis, false
            );
            chartGroup.appendChild(series.seriesElement);
            if (series.animation.enable && control.animateSeries) {
                control[firstToLowerCase(series.type) + 'SeriesModule'].doAnimation(series);
            }
        });
        control.svgObject.appendChild(chartGroup);
        if (control.series.length) {
            this.drawSeriesBorder(control, chartGroup);
        }
    }

    private createSeriesElement(control: RangeNavigator, series: RangeNavigatorSeries, index: number): void {
        let elementId: string = control.element.id;
        series.clipRect = new Rect(
            this.xAxis.rect.x, this.yAxis.rect.y,
            this.xAxis.rect.width, this.yAxis.rect.height
        );
        series.clipRectElement = control.renderer.drawClipPath(new RectOption(
            elementId + '_RangeSeriesClipRect_' + index, 'transparent', { width: 1, color: 'Gray' }, 1,
            {
                x: 0, y: 0,
                width: series.clipRect.width,
                height: series.clipRect.height
            })
        );
        series.seriesElement = control.renderer.createGroup({
            'id': elementId + 'SeriesGroup' + index,
            'transform': 'translate(' + series.clipRect.x + ',' + (series.clipRect.y) + ')',
            'clip-path': 'url(#' + elementId + '_RangeSeriesClipRect_' + index + ')'
        });
        series.seriesElement.appendChild(series.clipRectElement);
    }

    private calculateGroupingBounds(control: RangeNavigator): void {
        let padding: number = control.margin.bottom;
        let labelHeight: number = measureText('string', control.labelStyle).height;
        this.calculateDateTimeNiceInterval(this.xAxis, new Size(control.bounds.width, control.bounds.height), this.xMin, this.xMax, false);
        if (control.enableGrouping && control.valueType === 'DateTime'
            && (this.xAxis.actualIntervalType !== 'Years' || !control.series.length)
        ) {
            control.bounds.height -= (control.labelPosition === 'Outside' || control.series.length === 0) ? padding + labelHeight :
                (labelHeight + 2 * padding);
        }
        if (!control.series.length) {
            control.bounds.y += control.bounds.height / 4;
            control.bounds.height = control.bounds.height / 2;
        }
    }

    private drawSeriesBorder(control: RangeNavigator, chartElement: Element): void {
        let options: PathOption = new PathOption(
            control.element.id + '_SeriesBorder', 'transparent', control.navigatorBorder.width,
            control.navigatorBorder.color, 1, '',
            ('M ' + (control.bounds.x) + ' ' + (control.bounds.y) +
                ' L ' + (control.bounds.x + control.bounds.width) + ' ' + control.bounds.y +
                ' L ' + (control.bounds.x + control.bounds.width) + ' ' + (control.bounds.y + control.bounds.height) +
                ' L ' + (control.bounds.x) + ' ' + (control.bounds.y + control.bounds.height) + 'Z')

        );
        let htmlObject: Element = control.renderer.drawPath(options) as HTMLElement;

        control.svgObject.appendChild(htmlObject);
    }
}