/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable max-len */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { Chart } from '../chart';
import { extend, Browser, remove } from '@syncfusion/ej2-base';
import { PointData, ChartLocation } from '../../common/utils/helper';
import { getElement, measureText, Rect } from '@syncfusion/ej2-svg-base';
import { valueToCoefficient, removeElement, valueToPolarCoefficient, withInBounds } from '../../common/utils/helper';
import { Axis } from '../axis/axis';
import { Series, Points } from '../series/chart-series';
import { BaseTooltip } from '../../common/user-interaction/tooltip';
import { ChartShape } from '../utils/enum';
import { StockChart } from '../../stock-chart/stock-chart';
import { ITooltipRenderEventArgs, ISharedTooltipRenderEventArgs } from '../model/chart-interface';
import { tooltipRender, sharedTooltipRender } from '../../common/model/constants';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TooltipSettingsModel } from '../../common/model/base-model';

/**
 * `Tooltip` module is used to render the tooltip for chart series.
 */
export class Tooltip extends BaseTooltip {
    /**
     * Constructor for tooltip module.
     *
     * @private
     */
    constructor(chart: Chart) {
        super(chart);
        this.commonXvalues = [];
        this.addEventListener();
    }

    /**
     * @hidden
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chart.on(cancelEvent, this.mouseLeaveHandler, this);
        this.chart.on('tapHold', this.longPress, this);
        this.chart.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.chart.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }

    private mouseUpHandler(): void {
        const chart: Chart = this.control as Chart;
        const data: PointData = this.getData();
        data.lierIndex = this.lierIndex;
        if (chart.isTouch && !this.isSelected(chart) &&
            ((withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect) && chart.tooltip.shared)
             || !chart.tooltip.shared)) {
            if (!chart.crosshair.enable) {
                this.tooltip();
                if (chart.tooltip.fadeOutMode === 'Move') {
                    this.removeTooltip(chart.tooltip.fadeOutDuration);
                }
            } else if (chart.startMove && chart.tooltip.fadeOutMode === 'Move') {
                this.removeTooltip(2000);
            }
        } else if (!this.findData(data, this.previousPoints[0] as PointData) && chart.tooltip.fadeOutMode === 'Click') {
            this.removeTooltip(0);
        }
    }

    private mouseLeaveHandler(): void {
        this.removeTooltip(this.chart.tooltip.fadeOutDuration);
    }

    public mouseMoveHandler(): void {
        const chart: Chart = this.chart;
        chart.mouseX = chart.mouseX / chart.scaleX;
        chart.mouseY = chart.mouseY / chart.scaleY;
        if (chart.stockChart && chart.stockChart.onPanning) {
            if (chart.mouseY < chart.chartAxisLayoutPanel.seriesClipRect.y) {
                chart.mouseY = chart.chartAxisLayoutPanel.seriesClipRect.y;
            }
            else if (chart.mouseY > chart.chartAxisLayoutPanel.seriesClipRect.y + chart.chartAxisLayoutPanel.seriesClipRect.height) {
                chart.mouseY = chart.chartAxisLayoutPanel.seriesClipRect.y + chart.chartAxisLayoutPanel.seriesClipRect.height;
            }
        }
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
                if (chart.tooltip.shared && chart.tooltip.fadeOutMode === 'Move') {
                    this.removeTooltip(this.chart.tooltip.fadeOutDuration);
                }
            }
        }
    }

    /**
     * Handles the long press on chart.
     *
     * @returns {boolean} false
     * @private
     */
    private longPress(): boolean {
        const chart: Chart = this.chart;
        if (chart.crosshair.enable && withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect)) {
            this.tooltip();
            chart.markerRender.markerMove(false);
        }
        return false;
    }


    /**
     * Renders the tooltip.
     *
     * @returns {void}
     */
    public tooltip(): void {
        const elementId: string = this.chart.enableCanvas ? this.element.id + '_tooltip_group' : this.element.id + '_tooltip_svg';
        const svgElement: HTMLElement = this.getElement(elementId);
        // To prevent the disappearance of the tooltip, while resize the stock chart.
        const isStockSvg: boolean = this.chart.stockChart && svgElement && (svgElement.firstChild.childNodes.length > 1);
        const isTooltip: boolean = (svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0 && !isStockSvg);
        const tooltipDiv: HTMLDivElement = this.getTooltipElement(isTooltip);
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
        const marker: ChartShape[] = [];
        for (const data of this.currentPoints) {
            marker.push((<PointData>data).point.marker.shape || (<Series>data.series).marker.shape || 'Circle');
        }
        return marker;
    }

    private renderSeriesTooltip(chart: Chart, isFirst: boolean, tooltipDiv: HTMLDivElement): void {
        let data: PointData = this.getData();
        data.lierIndex = this.lierIndex;
        this.currentPoints = [];
        if (this.findData(data, this.previousPoints[0] as PointData)) {
            if (!(chart.dataEditingModule && chart.dataEditingModule.isPointDragging) && (this.previousPoints[0] &&
                data.point.index === this.previousPoints[0].point.index && data.series.index === this.previousPoints[0].series.index)) {
                return null;
            }
            if (this.pushData(data, isFirst, tooltipDiv, true)) {
                this.triggerTooltipRender(data, isFirst, this.getTooltipText(data), this.findHeader(data));
            }
        } else {
            if (!data.point && this.isRemove && chart.tooltip.fadeOutMode === 'Move') {
                this.removeTooltip(this.chart.tooltip.fadeOutDuration);
                this.isRemove = false;
            } else {
                const commonXvalues: number[] = this.mergeXvalues(this.chart.visibleSeries);
                for (const series of chart.visibleSeries) {
                    if (series.visible && !(series.category === 'TrendLine')) {
                        data = this.getClosestX(chart, series, commonXvalues) || data;
                    }
                }
            }
        }
        if (data && data.point) {
            this.findMouseValue(data, chart);
        }
    }

    private triggerTooltipRender(point: PointData, isFirst: boolean, textCollection: string,
                                 headerText: string): void {
        let tooltipTemplate: string;
        const argsData: ITooltipRenderEventArgs = {
            cancel: false, name: tooltipRender, text: textCollection, headerText : headerText, template : tooltipTemplate,
            series: this.chart.isBlazor ? {} as Series : point.series, textStyle: this.textStyle,  point: point.point,
            data : { pointX: point.point.x , pointY: point.point.y, seriesIndex: point.series.index, seriesName: point.series.name,
                pointIndex: point.point.index, pointText: point.point.text  }
        };
        const borderWidth : number = this.chart.border.width;
        const padding : number = 3;
        const tooltip: TooltipSettingsModel = this.chart.tooltip
        const chartTooltipSuccess: Function = (argsData: ITooltipRenderEventArgs) => {
            if (!argsData.cancel) {
                if (point.series.type === 'BoxAndWhisker') {
                    this.removeText();
                    isFirst = true;
                }
                this.headerText = argsData.headerText;
                this.formattedText = this.formattedText.concat(argsData.text);
                this.text = this.formattedText;
                let location: ChartLocation = this.getSymbolLocation(point);
                location = location ? location : new ChartLocation(null, null);
                location.x = tooltip.location.x !== null ? tooltip.location.x : location.x;
                location.y = tooltip.location.y !== null ? tooltip.location.y : location.y;
                location = (location.x === null && location.y === null) ? null : location;
                this.createTooltip(
                    this.chart, isFirst, location,
                    point.series.clipRect, point.point, this.findShapes(),
                    this.findMarkerHeight(<PointData>this.currentPoints[0]),
                    new Rect(borderWidth, borderWidth, this.chart.availableSize.width - padding - borderWidth * 2, this.chart.availableSize.height - padding - borderWidth * 2),
                    this.chart.crosshair.enable, null, this.getTemplateText(point),
                    this.template ? argsData.template : ''
                );
            } else {
                this.removeHighlight();
                remove(this.getElement(this.element.id + '_tooltip'));
            }
            this.isRemove = true;
        };
        chartTooltipSuccess.bind(this, point);
        this.chart.trigger(tooltipRender, argsData, chartTooltipSuccess);
    }

    private findMarkerHeight(pointData: PointData): number {
        let markerHeight: number = 0;
        const series: Series = <Series>pointData.series;
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
        case 'RangeStepArea':
        case 'SplineRangeArea':
        case 'RangeColumn':
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
            if (data.series.type === 'RangeStepArea'){
                location.y = data.point.regions[0].y + data.point.regions[0].height / 2 + data.point.regions[0].width;
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
        const series: Series = pointData.series;
        return this.parseTemplate(pointData.point, series, this.getFormat(this.chart, series), series.xAxis, series.yAxis);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getTemplateText(data: any): Points | Points[] {
        if (this.template && this.chart.tooltip.shared) {
            const point: Points[] = [];
            for (let i: number = 0; i < data.length; i++) {
                point[i as number] = extend({}, data[i as number].point) as Points;
                point[i as number].x = this.formatPointValue(data[i as number].point, data[i as number].series.xAxis, 'x', true, false);
                if ((data[i as number].series.seriesType === 'XY')) {
                    point[i as number].y = this.formatPointValue(data[i as number].point, data[i as number].series.yAxis, 'y', false, true);
                } else {
                    point[i as number].low = this.formatPointValue(data[i as number].point, data[i as number].series.yAxis, 'low', false, true);
                    point[i as number].high = this.formatPointValue(data[i as number].point, data[i as number].series.yAxis, 'high', false, true);
                }
            }
            return point;
        } else if (this.template) {
            const point: Points = extend({}, data.point) as Points;
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
        let dataCollection: PointData[] = [];
        let lastData: PointData;
        const pointData: PointData = chart.chartAreaType === 'PolarRadar' ? this.getData() : null;
        this.stopAnimation();
        this.removeHighlight();
        this.currentPoints = [];
        const extraPoints: PointData[] = [];
        let closestXValue: number = Number.MAX_VALUE;
        let closetYValue: number = Number.MAX_VALUE;
        let pointXValue: number;
        let pointYValue: number;
        let tempData: PointData;
        //let headerContent : string = '';
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
        const argument: ISharedTooltipRenderEventArgs = {
            text: [], cancel: false, name: sharedTooltipRender, data: [], point: [], series: [], headerText: '', textStyle: this.textStyle, template: []
        };
        let i: number = 0;
        for (const series of chart.visibleSeries) {
            if (!series.enableTooltip || !series.visible) {
                continue;
            }
            if (chart.chartAreaType === 'Cartesian' && series.visible) {
                data = this.getClosestX(chart, series, this.commonXValue(this.chart.visibleSeries));
            } else if (chart.chartAreaType === 'PolarRadar' && series.visible && pointData.point !== null) {
                data = new PointData(series.points[pointData.point.index], series);
            }
            // if (data && this.header !== '' && this.currentPoints.length === 0) {
            //     headerContent = this.findHeader(data);
            // }
            if (chart.tooltip.showNearestPoint && !data) {
                data = this.getClosestX(chart, series, this.commonXValue([series]));
            }
            if (data) {
                argument.data.push({ pointX: data.point.x , pointY: data.point.y, seriesIndex: data.series.index,
                    seriesName: data.series.name, pointIndex: data.point.index, pointText: data.point.text  });
                argument.series[i as number] = data.series;
                argument.point[i as number] = data.point;
                argument.headerText = this.findHeader(data);
                (<PointData[]>this.currentPoints).push(data);
                if (this.template != null) {
                    argument.template.push(this.template.toString())
                };
                argument.text.push(this.getTooltipText(data));
                pointXValue = (!chart.requireInvertedAxis) ? chart.mouseX - data.series.clipRect.x : chart.mouseY - data.series.clipRect.y;
                pointYValue = chart.mouseY - data.series.clipRect.y;
                if (data.point.symbolLocations && data.point.symbolLocations.length && Math.abs(pointXValue - data.point.symbolLocations[0].x) <= closestXValue &&
                    Math.abs(data.point.symbolLocations[0].y - pointYValue) < Math.abs(closetYValue - pointYValue)) {
                    closestXValue = Math.abs(pointXValue - data.point.symbolLocations[0].x);
                    closetYValue = data.point.symbolLocations[0].y;
                    tempData = data;
                }
                lastData = (data.series.category === 'TrendLine' && chart.tooltip.shared) ? lastData : tempData || data;
                dataCollection.push(data);
            }
            // if (data && this.triggerEvent(data, isFirst, this.getTooltipText(data)), this.findHeader(data)) {
            //     this.findMouseValue(data, chart);
            //     (<PointData[]>this.currentPoints).push(data);
            //     data = null;
            // } else if (data) {
            //     extraPoints.push(data);
            // }
            i++;
        }
        if (!chart.tooltip.showNearestPoint) {
            const collection: PointData[] = [];
            this.currentPoints = []; argument.point = [];
            argument.series = []; argument.data = [];
            argument.text = [];
            for (const data of dataCollection) {
                if (data.point.symbolLocations[0].x === lastData.point.symbolLocations[0].x || ((data.series.type.indexOf('Column') !== -1 || lastData.series.type.indexOf('Column') !== -1) && (data.point.xValue === lastData.point.xValue))) {
                    argument.point.push(data.point);
                    argument.series.push(data.series);
                    argument.text.push(this.getTooltipText(data));
                    argument.headerText = this.findHeader(data);
                    collection.push(data);
                    argument.data.push({
                        pointX: data.point.x, pointY: data.point.y, seriesIndex: data.series.index,
                        seriesName: data.series.name, pointIndex: data.point.index, pointText: data.point.text
                    });
                }
            }
            dataCollection = collection;
            this.currentPoints = collection;
        }
        if (dataCollection.length > 0 && this.currentPoints.length > 0) { // To avoid console error when we have empty chart with shared tooltip.
            this.triggerSharedTooltip(argument, lastData, extraPoints, chart, isFirst, dataCollection);
        } else if (this.getElement(this.element.id + '_tooltip_path')) {
            this.getElement(this.element.id + '_tooltip_path').setAttribute('d', '');
        }
    }
    private triggerSharedTooltip(
        argument: ISharedTooltipRenderEventArgs, point: PointData, extraPoints: PointData[], chart: Chart, isFirst: boolean, dataCollection: PointData[]
    ): void {
        let tooltipTemplate: string[] = argument.template;
        const argsData: ISharedTooltipRenderEventArgs = {
            cancel: false, name: sharedTooltipRender, text: argument.text, headerText: argument.headerText,
            textStyle: argument.textStyle, template: tooltipTemplate,
            point: argument.point, series: argument.series,
            data: argument.data
        };
        const borderWidth : number = this.chart.border.width;
        const padding : number = 3;
        let toolbarHeight: number;
        let titleHeight: number;
        const currentPoints: PointData[] = [];
        if (chart.stockChart) {
            toolbarHeight = chart.stockChart.enablePeriodSelector ? chart.stockChart.toolbarHeight : 0;
            titleHeight = measureText(this.chart.stockChart.title, this.chart.stockChart.titleStyle, this.chart.themeStyle.tooltipLabelFont).height + 10;
        }
        const sharedTooltip: Function = (argsData: ISharedTooltipRenderEventArgs) => {
            if (!argsData.cancel) {
                if (point.series.type === 'BoxAndWhisker') {
                    this.removeText();
                    isFirst = true;
                }
                for (let i: number = 0; i < argsData.text.length; i++) {
                    if (argsData.text[i as number]) { currentPoints.push(this.currentPoints[i as number] as PointData); }
                }
                this.currentPoints = currentPoints;
                this.formattedText = this.formattedText.concat(argsData.text);
                this.text = argsData.text;
                this.headerText = argsData.headerText;
                if (typeof(argsData.template) != 'object') {
                    argsData.template = (argsData.template as string).split(',');
                    if (argsData.template.length > currentPoints.length ) {
                        argsData.template = argsData.template.splice(argsData.template.length - 1);
                    }
                   }
                   else {
                    if (argsData.template.length > currentPoints.length ) {
                        argsData.template.splice(argsData.template.length - 1);
                    }
                }
                const tooltip: TooltipSettingsModel = this.chart.tooltip
                this.findMouseValue(point, this.chart);
                let location: ChartLocation = this.findSharedLocation();
                location = location ? location : new ChartLocation(null, null);
                location.x = tooltip.location.x !== null ? tooltip.location.x : location.x;
                location.y = tooltip.location.y !== null ? tooltip.location.y : location.y;
                location = (location.x === null && location.y === null) ? null : location;
                this.createTooltip(
                    chart, isFirst, location,
                    this.currentPoints.length === 1 ? this.currentPoints[0].series.clipRect : null, dataCollection.length === 1 ? dataCollection[0].point : null,
                    this.findShapes(), this.findMarkerHeight(<PointData>this.currentPoints[0]),
                    new Rect(borderWidth, (chart.stockChart ? (toolbarHeight + titleHeight + borderWidth) : borderWidth), this.chart.availableSize.width - padding - borderWidth * 2, this.chart.availableSize.height - padding - borderWidth * 2),
                    this.chart.crosshair.enable, extraPoints,
                    this.template ? this.getTemplateText(dataCollection) : null,
                    this.template ? argsData.template.join('') : ''
                );
                point = null;
            } else {
                extraPoints.push(point);
            }
        };
        sharedTooltip.bind(this, point, extraPoints);
        this.chart.trigger(sharedTooltipRender, argsData, sharedTooltip);
    }

    private findSharedLocation(): ChartLocation {
        const stockChart: StockChart = this.chart.stockChart;
        if (stockChart) {
            if (this.text.length === 1) {
                this.text.push('');
            }
            const toolbarHeight: number = stockChart.enablePeriodSelector ? stockChart.toolbarHeight : 0;
            const element: Element = document.getElementById(stockChart.element.id + '_ChartTitle');
            const titleHeight: number = stockChart.title !== '' ? element.getBoundingClientRect().height + 10 : 0;
            if (stockChart.tooltip.position === 'Nearest') {
                return new ChartLocation(this.valueX, this.valueY + toolbarHeight + titleHeight);
            }
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
        const location: ChartLocation = this.lierIndex > 3 ? (data.point.outliers.length > 0 ? data.point.symbolLocations[this.lierIndex - 4] : null) :
            {
                x: data.point.regions[0].x + (data.point.regions[0].width / 2),
                y: data.point.regions[0].y + (data.point.regions[0].height / 2)
            };
        return location;
    }

    private parseTemplate(point: Points, series: Series, format: string, xAxis: Axis, yAxis: Axis): string {
        let val: RegExp;
        let textValue: string;
        for (const dataValue of Object.keys(point)) {
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

        for (const dataValue of Object.keys(Object.getPrototypeOf(series))) {
            val = new RegExp('${series' + '.' + dataValue + '}', 'gm');
            textValue = series[dataValue as string];
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
            textValue = customLabelFormat ? axis.labelFormat.replace('{value}', axis.format(point[dataValue as string])) :
                axis.format(point[dataValue as string]);
        } else if (isYPoint && !isNullOrUndefined(point[dataValue as string])) {
            customLabelFormat = axis.labelFormat && axis.labelFormat.match('{value}') !== null;
            value = dataValue === 'outliers' ? axis.format(point[dataValue as string][this.lierIndex - 4]) :
                axis.format(point[dataValue as string]);
            textValue = customLabelFormat ? axis.labelFormat.replace('{value}', value) : value;

        } else if (dataValue === 'size') {
            const format: Function = this.chart.intl.getNumberFormat({ format: '', useGrouping: this.chart.useGroupingSeparator });
            textValue = typeof point[dataValue as string] === 'number' ? format(point[dataValue as string]) : point[dataValue as string];
        } else {
            textValue = point[dataValue as string];
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
        const textX: string = (series.type === 'Histogram') ? '${point.minimum}' + '-' + '${point.maximum}' :  '${point.x}';
        const format: string = !chart.tooltip.shared ? textX : '${series.name}';
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
        default: return '';
        }
    }

    private getIndicatorTooltipFormat(series: Series, chart: Chart, format: string): string {
        let toolTip: string;
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
    public removeHighlightedMarker(data: PointData[], fadeOut: boolean): void {
        for (const item of data) {
            removeElement(this.element.id + '_Series_' + item.series.index +
            '_Point_' + item.point.index + '_Trackball');
            if (this.chart.markerRender) {
                this.chart.markerRender.removeHighlightedMarker(item.series, item.point, fadeOut);
            }
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
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method performed here
         */
    }
}
