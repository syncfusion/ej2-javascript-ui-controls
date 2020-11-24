import { Chart } from '../chart';
import { extend, Browser, remove } from '@syncfusion/ej2-base';
import { PointData, ChartLocation } from '../../common/utils/helper';
import { Rect, getElement } from '@syncfusion/ej2-svg-base';
import { valueToCoefficient, removeElement, valueToPolarCoefficient, withInBounds } from '../../common/utils/helper';
import { Axis } from '../axis/axis';
import { Series, Points } from '../series/chart-series';
import { BaseTooltip } from '../../common/user-interaction/tooltip';
import { ChartShape } from '../utils/enum';
import { StockChart } from '../../stock-chart/stock-chart';
import { ITooltipRenderEventArgs, ISharedTooltipRenderEventArgs } from '../model/chart-interface';
import { tooltipRender, sharedTooltipRender } from '../../common/model/constants';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * `Tooltip` module is used to render the tooltip for chart series.
 */
export class Tooltip extends BaseTooltip {
    /**
     * Constructor for tooltip module.
     * @private.
     */
    constructor(chart: Chart) {
        super(chart);
        this.addEventListener();
    }

    /**
     * @hidden
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chart.on(cancelEvent, this.mouseLeaveHandler, this);
        this.chart.on('tapHold', this.longPress, this);
        this.chart.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.chart.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }

    private mouseUpHandler(): void {
        let chart: Chart = this.control as Chart;
        if (chart.isTouch && !this.isSelected(chart) &&
            ((withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect) && chart.tooltip.shared)
             || !chart.tooltip.shared)) {
            if (!chart.crosshair.enable) {
                this.tooltip();
                this.removeTooltip(2000);
            } else if (chart.startMove) {
                this.removeTooltip(2000);
            }
        }
    }

    private mouseLeaveHandler(): void {
        this.removeTooltip(this.chart.tooltip.fadeOutDuration);
    }

    private mouseMoveHandler(): void {
        let chart: Chart = this.chart;
        // Tooltip for chart series.
        if (!chart.disableTrackTooltip && !this.isSelected(chart)) {
            if (!chart.tooltip.shared && (!chart.isTouch || (chart.startMove))) {
                this.tooltip();
            }
            if (withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect)) {
                if (chart.tooltip.shared && (!chart.isTouch || (chart.startMove))) {
                    this.tooltip();
                }
            } else {
                if (chart.tooltip.shared) {
                    this.removeTooltip(this.chart.tooltip.fadeOutDuration);
                }
            }
        }
    }

    /**
     * Handles the long press on chart.
     * @return {boolean}
     * @private
     */
    private longPress(): boolean {
        let chart: Chart = this.chart;
        if (chart.crosshair.enable && withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect)) {
            this.tooltip();
        }
        return false;
    }


    /**
     * Renders the tooltip.
     * @return {void}
     */
    public tooltip(): void {
        if ((this.chart.stockChart && this.chart.stockChart.onPanning)) { this.removeTooltip(1000); return null; }
        let svgElement: HTMLElement;
        let elementId: string = this.chart.enableCanvas ? this.element.id + '_tooltip_group' : this.element.id + '_tooltip_svg';
        svgElement = this.getElement(elementId);
        // To prevent the disappearance of the tooltip, while resize the stock chart.
        let isStockSvg: boolean = this.chart.stockChart && svgElement && (svgElement.firstChild.childNodes.length > 1);
        let isTooltip: boolean = (svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0 && !isStockSvg);
        let tooltipDiv: HTMLDivElement = this.getTooltipElement(isTooltip);
        if (this.chart.enableCanvas && tooltipDiv) {
            document.getElementById(this.chart.element.id + '_Secondary_Element').appendChild(tooltipDiv);
            tooltipDiv.appendChild(document.getElementById(this.chart.element.id + '_tooltip_svg'));
        }
        if (!this.chart.tooltip.shared) {
            this.renderSeriesTooltip(this.chart, !isTooltip, tooltipDiv);
        } else {
            this.renderGroupedTooltip(this.chart, !isTooltip, tooltipDiv);
        }
    }

    private findHeader(data: PointData): string {
        if (this.header === '') {
            return '';
        }
        this.header = this.parseTemplate(data.point, data.series, this.header, data.series.xAxis, data.series.yAxis);
        if (this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '') {
            return this.header;
        }
        return '';
    }

    private findShapes(): ChartShape[] {
        if (!this.chart.tooltip.enableMarker) {
            return [];
        }
        let marker: ChartShape[] = [];
        for (let data of this.currentPoints) {
            marker.push((<PointData>data).point.marker.shape || (<Series>data.series).marker.shape);
        }
        return marker;
    }

    private renderSeriesTooltip(chart: Chart, isFirst: boolean, tooltipDiv: HTMLDivElement): void {
        let data: PointData = this.getData();
        data.lierIndex = this.lierIndex;
        let rect : Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        this.currentPoints = [];
        let tool: this;
        if (this.findData(data, this.previousPoints[0] as PointData)) {
            if (!(chart.dataEditingModule && chart.dataEditingModule.isPointDragging) && (this.previousPoints[0] &&
                data.point.index === this.previousPoints[0].point.index && data.series.index === this.previousPoints[0].series.index)) {
                return null;
            }
            if (this.pushData(data, isFirst, tooltipDiv, true)) {
                this.triggerTooltipRender(data, isFirst, this.getTooltipText(data), this.findHeader(data));
            }
        } else {
            if (!data.point && this.isRemove) {
                this.removeTooltip(this.chart.tooltip.fadeOutDuration);
                this.isRemove = false;
            } else {
                for (let series of chart.visibleSeries) {
                    if (series.visible && !(series.category === 'TrendLine')) {
                        data = this.getClosestX(chart, series) || data;
                    }
                }
            }
        }
        if (data && data.point) {
            this.findMouseValue(data, chart);
        }
    }

    private triggerTooltipRender(point: PointData, isFirst: boolean, textCollection: string,
                                 headerText: string, firstText: boolean = true): void {
        let template: string;
        let argsData: ITooltipRenderEventArgs = {
            cancel: false, name: tooltipRender, text: textCollection, headerText : headerText, template : template,
            series: this.chart.isBlazor ? {} as Series : point.series, textStyle: this.textStyle,  point: point.point,
            data : { pointX: point.point.x , pointY: point.point.y, seriesIndex: point.series.index, seriesName: point.series.name,
                     pointIndex: point.point.index, pointText: point.point.text  }
        };
        let chartTooltipSuccess: Function = (argsData: ITooltipRenderEventArgs) => {
            if (!argsData.cancel) {
                if (point.series.type === 'BoxAndWhisker') {
                    this.removeText();
                    isFirst = true;
                }
                this.headerText = argsData.headerText;
                this.formattedText = this.formattedText.concat(argsData.text);
                this.text = this.formattedText;
                this.createTooltip(
                    this.chart, isFirst, this.getSymbolLocation(point),
                    point.series.clipRect, point.point, this.findShapes(),
                    this.findMarkerHeight(<PointData>this.currentPoints[0]),
                    this.chart.chartAxisLayoutPanel.seriesClipRect, null, this.getTemplateText(point),
                    this.chart.tooltip.template ? argsData.template : '', this.chart.tooltip.position
                );
            } else {
                this.removeHighlight(this.control);
                remove(this.getElement(this.element.id + '_tooltip'));
            }
            this.isRemove = true;
        };
        chartTooltipSuccess.bind(this, point);
        this.chart.trigger(tooltipRender, argsData, chartTooltipSuccess);
    }

    private findMarkerHeight(pointData: PointData): number {
        if (!this.chart.tooltip.enableMarker) {
            return 0;
        }
        let markerHeight: number = 0;
        let series: Series = <Series>pointData.series;
        markerHeight = ((series.marker.visible || (this.chart.tooltip.shared &&
            (!series.isRectSeries || series.marker.visible)) || series.type === 'Scatter' || series.drawType === 'Scatter')
            && !(series.type === 'Candle' || series.type === 'Hilo' || series.type === 'HiloOpenClose')) ?
            ((series.marker.height + 2) / 2 + (2 * series.marker.border.width)) : 0;
        return markerHeight;
   }

    private findData(data : PointData, previous : PointData) : boolean {
        return data.point && ((!previous || (previous.point !== data.point)) ||
        (previous && previous.lierIndex > 3 && previous.lierIndex !== this.lierIndex) || (previous.point === data.point));
    }

    private getSymbolLocation(data : PointData) : ChartLocation {
        let location: ChartLocation;
        if (data.series.type !== 'BoxAndWhisker') {
            if (!data.point.symbolLocations[0]) {
                return null;
            }
            location = new ChartLocation(data.point.symbolLocations[0].x, data.point.symbolLocations[0].y);
        }
        switch (data.series.type) {
            case 'BoxAndWhisker':
            return this.getBoxLocation(data);
            case 'Waterfall':
            return this.getWaterfallRegion(data, location);
            case 'RangeArea':
            return this.getRangeArea(data, location);
            default:
            return location;
        }
    }

    private getRangeArea(data : PointData , location : ChartLocation) : ChartLocation {
        if (data.point.regions[0]) {
            if (!this.inverted) {
                location.y = data.point.regions[0].y + data.point.regions[0].height / 2;
            } else {
                location.x = data.point.regions[0].x + data.point.regions[0].width / 2;
            }
        }
        return location;
    }

    private getWaterfallRegion(data : PointData, location : ChartLocation) : ChartLocation {
        if (!this.inverted) {
        location.y = (data.point.y < 0) ?
        location.y - data.point.regions[0].height : location.y;
        } else {
            location.x = (data.point.y < 0) ?
            location.x + data.point.regions[0].width : location.x;
        }
        return location;
    }

    private getTooltipText(pointData: PointData): string {
        let series: Series = pointData.series;
        return this.parseTemplate(pointData.point, series, this.getFormat(this.chart, series), series.xAxis, series.yAxis);
    }

    private getTemplateText(data : PointData) : Points {
        if (this.chart.tooltip.template) {
        let point: Points = extend({}, data.point) as Points;
        point.x = this.formatPointValue(data.point, data.series.xAxis, 'x', true, false);
        if ((data.series.seriesType === 'XY')) {
            point.y = this.formatPointValue(data.point, data.series.yAxis, 'y', false, true);
        } else {
            point.low = this.formatPointValue(data.point, data.series.yAxis, 'low', false, true);
            point.high = this.formatPointValue(data.point, data.series.yAxis, 'high', false, true);
        }
        return point;
    } else {
        return data.point;
    }
    }

    private findMouseValue(data: PointData, chart: Chart): void {
        if (!chart.requireInvertedAxis) {
            if (chart.chartAreaType === 'PolarRadar') {
                this.valueX = valueToPolarCoefficient(data.point.xValue, data.series.xAxis) * data.series.xAxis.rect.width
                    + data.series.xAxis.rect.x;
            } else {
                this.valueX = (data.series.category === 'TrendLine' && chart.tooltip.shared) ? this.valueX :
                    valueToCoefficient(data.point.xValue, data.series.xAxis) * data.series.xAxis.rect.width
                    + data.series.xAxis.rect.x;
            }
            this.valueY = chart.mouseY;
        } else {
            this.valueY = (1 - valueToCoefficient(data.point.xValue, data.series.xAxis)) * data.series.xAxis.rect.height
                + data.series.xAxis.rect.y;
            this.valueX = chart.mouseX;
        }
    }

    private renderGroupedTooltip(chart: Chart, isFirst: boolean, tooltipDiv: Element): void {
        let data: PointData;
        let lastData: PointData;
        let height: number = 0; let width: number = 0;
        let pointData: PointData = chart.chartAreaType === 'PolarRadar' ? this.getData() : null;
        this.stopAnimation();
        this.removeHighlight(chart);
        this.currentPoints = [];
        let extraPoints: PointData[] = [];
        let headerContent : string = '';
        if (isFirst) {
            if (!chart.stockChart) {
                if (tooltipDiv) {
                    document.getElementById(this.element.id + '_Secondary_Element').appendChild(tooltipDiv);
                }
            } else {
                if (tooltipDiv && !getElement(tooltipDiv.id)) {
                    document.getElementById(chart.stockChart.element.id + '_Secondary_Element').appendChild(tooltipDiv);
                }
            }
        }
        this.removeText();
        let argument: ISharedTooltipRenderEventArgs = {
            text: [], cancel: false, name: sharedTooltipRender, data: [], headerText: '', textStyle: this.textStyle
        };
        for (let series of chart.visibleSeries) {
            if (!series.enableTooltip || !series.visible) {
                continue;
            }
            if (chart.chartAreaType === 'Cartesian' && series.visible) {
                data = this.getClosestX(chart, series);
            } else if (chart.chartAreaType === 'PolarRadar' && series.visible && pointData.point !== null) {
                data = new PointData(series.points[pointData.point.index], series);
            }
            if (data && this.header !== '' && this.currentPoints.length === 0) {
                headerContent = this.findHeader(data);
            }
            if (data) {
                if (!chart.isBlazor) {
                    this.triggerSharedTooltip(data, isFirst, this.getTooltipText(data), this.findHeader(data), extraPoints);
                } else {
                    argument.data.push({ pointX: data.point.x , pointY: data.point.y, seriesIndex: data.series.index,
                        seriesName: data.series.name, pointIndex: data.point.index, pointText: data.point.text  });
                    argument.headerText = this.findHeader(data);
                    (<PointData[]>this.currentPoints).push(data);
                    argument.text.push(this.getTooltipText(data));
                    lastData = (data.series.category === 'TrendLine' && chart.tooltip.shared) ? lastData : data;
                }
            }
            // if (data && this.triggerEvent(data, isFirst, this.getTooltipText(data)), this.findHeader(data)) {
            //     this.findMouseValue(data, chart);
            //     (<PointData[]>this.currentPoints).push(data);
            //     data = null;
            // } else if (data) {
            //     extraPoints.push(data);
            // }
        }
        if (chart.isBlazor && data) { // To avoid console error when we have empty chart with shared tooltip.
            this.triggerBlazorSharedTooltip(argument, lastData, extraPoints, chart, isFirst);
        }
        if (this.currentPoints.length > 0) {
            this.createTooltip(chart, isFirst, this.findSharedLocation(),
                               this.currentPoints.length === 1 ? this.currentPoints[0].series.clipRect : null,  null,
                               this.findShapes(), this.findMarkerHeight(<PointData>this.currentPoints[0]),
                               chart.chartAxisLayoutPanel.seriesClipRect, extraPoints);
        } else if (this.getElement(this.element.id + '_tooltip_path')) {
            this.getElement(this.element.id + '_tooltip_path').setAttribute('d', '');
        }
    }
    private triggerBlazorSharedTooltip(
        argument: ISharedTooltipRenderEventArgs, point: PointData, extraPoints: PointData[], chart: Chart, isFirst: boolean
    ): void {
        let argsData: ISharedTooltipRenderEventArgs = {
            cancel: false, name: sharedTooltipRender, text: argument.text, headerText: argument.headerText,
            textStyle: argument.textStyle,
            data: argument.data
        };
        let blazorSharedTooltip: Function = (argsData: ISharedTooltipRenderEventArgs) => {
            if (!argsData.cancel) {
                this.text = argsData.text;
                this.headerText = argsData.headerText;
                this.findMouseValue(point, this.chart);
                point = null;
                this.createTooltip(chart, isFirst, this.findSharedLocation(), null, null, this.findShapes(),
                                   this.findMarkerHeight(<PointData>this.currentPoints[0]),
                                   chart.chartAxisLayoutPanel.seriesClipRect, extraPoints);
            } else {
                extraPoints.push(point);
            }
        };
        blazorSharedTooltip.bind(this, point, extraPoints);
        this.chart.trigger(sharedTooltipRender, argsData, blazorSharedTooltip);
    }
    private triggerSharedTooltip(point: PointData, isFirst: boolean, textCollection: string, headerText: string,
                                 extraPoints: PointData[]): void {
        let argsData: ITooltipRenderEventArgs = {
            cancel: false, name: tooltipRender, text: textCollection, headerText: headerText,
            point: point.point, series: this.chart.isBlazor ? {} as Series : point.series, textStyle: this.textStyle,
            data : { pointX: point.point.x , pointY: point.point.y, seriesIndex: point.series.index, seriesName: point.series.name,
                pointIndex: point.point.index, pointText: point.point.text  }
        };
        let sharedTooltipSuccess: Function = (argsData: ITooltipRenderEventArgs) => {
            if (!argsData.cancel) {
                if (point.series.type === 'BoxAndWhisker') {
                    this.removeText();
                    isFirst = true;
                }
                this.formattedText = this.formattedText.concat(argsData.text);
                this.text = this.formattedText;
                this.headerText = argsData.headerText;
                this.findMouseValue(point, this.chart);
                (<PointData[]>this.currentPoints).push(point);
                point = null;
            } else {
                extraPoints.push(point);
            }
        };
        sharedTooltipSuccess.bind(this, point, extraPoints);
        this.chart.trigger(tooltipRender, argsData, sharedTooltipSuccess);
    }

    private findSharedLocation(): ChartLocation {
        let stockChart: StockChart = this.chart.stockChart;
        if (stockChart) {
            if (this.text.length === 1) {
                this.text.push('');
            }
            let toolbarHeight: number = stockChart.enablePeriodSelector ? stockChart.toolbarHeight : 0;
            let element: Element = document.getElementById(stockChart.element.id + '_ChartTitle');
            let titleHeight: number = stockChart.title !== '' ? element.getBoundingClientRect().height + 10 : 0;
            return new ChartLocation(this.chart.chartAxisLayoutPanel.seriesClipRect.x + 5,
                                     this.chart.chartAxisLayoutPanel.seriesClipRect.y + toolbarHeight + 5 + titleHeight);

        } else {
            if (this.currentPoints.length > 1) {
                return new ChartLocation(this.valueX, this.valueY);
            } else {
                return this.getSymbolLocation(<PointData>this.currentPoints[0]);
            }
        }
    }

    private getBoxLocation(data: PointData): ChartLocation {
        let location: ChartLocation;
        location = this.lierIndex > 3 ? data.point.symbolLocations[this.lierIndex - 4] :
            {
                x: data.point.regions[0].x + (data.point.regions[0].width / 2),
                y: data.point.regions[0].y + (data.point.regions[0].height / 2)
            };
        return location;
    }

    private parseTemplate(point: Points, series: Series, format: string, xAxis: Axis, yAxis: Axis): string {
        let val: RegExp;
        let textValue: string;
        let xFormat: Function;
        let customLabelFormat: boolean;
        let chart: Chart = this.chart;
        for (let dataValue of Object.keys(point)) {
            val = new RegExp('${point' + '.' + dataValue + '}', 'gm');
            format = format.replace(
                val.source, this.formatPointValue(
                    point, val.source === '${point.x}' ? xAxis : yAxis,
                    dataValue, val.source === '${point.x}',
                    (
                        val.source === '${point.high}' ||
                        val.source === '${point.open}' ||
                        val.source === '${point.close}' ||
                        val.source === '${point.low}' ||
                        val.source === '${point.y}' ||
                        val.source === '${point.minimum}' ||
                        val.source === '${point.maximum}' ||
                        val.source === '${point.outliers}' ||
                        val.source === '${point.upperQuartile}' ||
                        val.source === '${point.lowerQuartile}' ||
                        val.source === '${point.median}'
                    )
                )
            );
        }

        for (let dataValue of Object.keys(Object.getPrototypeOf(series))) {
            val = new RegExp('${series' + '.' + dataValue + '}', 'gm');
            textValue = series[dataValue];
            format = format.replace(val.source, textValue);
        }
        return format;
    }

    private formatPointValue(point: Points, axis: Axis, dataValue: string, isXPoint: boolean, isYPoint: boolean): string {
        let textValue: string;
        let customLabelFormat: boolean;
        let value: string;
        if (axis.valueType !== 'Category' && isXPoint) {
            customLabelFormat = axis.labelFormat && axis.labelFormat.match('{value}') !== null;
            textValue = customLabelFormat ? axis.labelFormat.replace('{value}', axis.format(point[dataValue])) :
                axis.format(point[dataValue]);
        } else if (isYPoint && !isNullOrUndefined(point[dataValue])) {
            customLabelFormat = axis.labelFormat && axis.labelFormat.match('{value}') !== null;
            value = dataValue === 'outliers' ? axis.format(point[dataValue][this.lierIndex - 4]) :
                axis.format(point[dataValue]);
            textValue = customLabelFormat ? axis.labelFormat.replace('{value}', value) : value;

        } else {
            textValue = point[dataValue];
        }
        return textValue;
    }

    private getFormat(chart: Chart, series: Series): string {
        if (series.tooltipFormat) {
            if (series.seriesType === 'XY' && series.category === 'Indicator') {
                return this.getIndicatorTooltipFormat(series, chart, chart.tooltip.format);
            }
            return series.tooltipFormat;
        }
        if (!series.tooltipFormat && chart.tooltip.format) {
            if (series.seriesType === 'XY' && series.category === 'Indicator') {
                return this.getIndicatorTooltipFormat(series, chart, chart.tooltip.format);
            }
            return chart.tooltip.format;
        }
        let textX: string = (series.type === 'Histogram') ? '${point.minimum}' + '-' + '${point.maximum}' :  '${point.x}';
        let format: string = !chart.tooltip.shared ? textX : '${series.name}';
        switch (series.seriesType) {
            case 'XY':
                if (series.category === 'Indicator') {
                    this.getIndicatorTooltipFormat(series, chart, chart.tooltip.format);
                }
                return format + ' : ' + ((series.type === 'Bubble') ? '<b>${point.y}</b>  Size : <b>${point.size}</b>' :
                 '<b>${point.y}</b>');
            case 'HighLow':
                return format + ('<br/>High : <b>${point.high}</b><br/>Low : <b>${point.low}</b>');
            case 'HighLowOpenClose':
                return format + ('<br/>High : <b>${point.high}</b><br/>Low : <b>${point.low}</b><br/>' +
                    'Open : <b>${point.open}</b><br/>Close : <b>${point.close}</b>');
            case 'BoxPlot': {
                return format + '<br/>' + (this.lierIndex > 3 ? 'Outliers : <b>${point.outliers}</b>' :
                    'Maximum : <b>${point.maximum}</b><br/>Q3 : <b>${point.upperQuartile}</b><br/>' +
                    'Median : <b>${point.median}</b><br/>Q1 : <b>${point.lowerQuartile}</b><br/>Minimum : <b>${point.minimum}</b>');
            }
        }
        return '';
    }

    private getIndicatorTooltipFormat(series: Series, chart: Chart, format: string): string {
        let toolTip: string;
        let points: Points[] = [];
        if (series.seriesType === 'XY') {
            toolTip = series.name + ' : <b>${point.y}</b>';
        } else {
            toolTip = format;
        }
        return toolTip;
    }

 /*
    * @hidden
    */
   public removeHighlightedMarker(data: PointData[]): void {
    for (let item of data) {
        removeElement(this.element.id + '_Series_' + item.series.index +
            '_Point_' + item.point.index + '_Trackball');
    }
    if (this.chart.markerRender) {
        this.chart.markerRender.removeHighlightedMarker();
    }
    this.previousPoints = [];
}
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'Tooltip';
    }
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    public destroy(chart: Chart): void {
        /**
         * Destroy method performed here
         */
    }
}