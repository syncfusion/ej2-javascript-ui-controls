import { createElement, extend } from '@syncfusion/ej2-base';
import { Chart } from '../../chart';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { AccPoints, AccumulationSeries } from '../../accumulation-chart/model/acc-base';
import { Size, Rect, PointData, ChartLocation } from '../../common/utils/helper';
import {  stopTimer, AccPointData, removeElement } from '../../common/utils/helper';
import { ChartData } from '../../chart/utils/get-data';
import { Tooltip } from '../../chart/user-interaction/tooltip';
import { AccumulationTooltip } from '../../accumulation-chart/user-interaction/tooltip';
import { Series, Points } from '../../chart/series/chart-series';
import { FontModel } from '../../common/model/base-model';
import { ITooltipRenderEventArgs } from '../../common/model/interface';
import { tooltipRender } from '../../common/model/constants';
import { Tooltip as SVGTooltip, ITooltipAnimationCompleteArgs } from '@syncfusion/ej2-svg-base';
import { ChartShape } from '../../chart/utils/enum';


/**
 * Tooltip Module used to render the tooltip for series.
 */
export class BaseTooltip extends ChartData {
    //Internal variables
    public element: HTMLElement;
    public elementSize: Size;
    public textStyle: FontModel;
    public isRemove: boolean;
    public toolTipInterval: number;
    public textElements: Element[];
    public inverted: boolean;
    public formattedText: string[];
    public header: string;

    /** @private */
    public valueX: number;
    /** @private */
    public valueY: number;

    public control: AccumulationChart | Chart;
    public text: string[];
    public headerText: string;
    public svgTooltip: SVGTooltip;
    /**
     * Constructor for tooltip module.
     * @private.
     */
    constructor(chart: Chart | AccumulationChart) {
        super(chart as Chart);
        this.element = this.chart.element;
        this.textStyle = chart.tooltip.textStyle;
        this.control = chart;
    }



    public getElement(id: string): HTMLElement {
        return document.getElementById(id);
    }

    /**
     * Renders the tooltip.
     * @return {void}
     * @private
     */
    public getTooltipElement(isTooltip: boolean): HTMLDivElement {
        this.inverted = this.chart.requireInvertedAxis;
        this.header = (this.control.tooltip.header === null) ?
        ((this.control.tooltip.shared) ? '<b>${point.x}</b>' : '<b>${series.name}</b>')
        : (this.control.tooltip.header);
        this.formattedText = [];
        if (!isTooltip) {
            return this.createElement();
        }
        return null;
    }

    private createElement(): HTMLDivElement {
        let tooltipDiv: HTMLDivElement = document.createElement('div');
        tooltipDiv.id = this.element.id + '_tooltip'; tooltipDiv.className = 'ejSVGTooltip';
        tooltipDiv.setAttribute('style', 'pointer-events:none; position:absolute;z-index: 1');
        return tooltipDiv;
    }


    public pushData(data: PointData | AccPointData, isFirst: boolean, tooltipDiv: HTMLDivElement, isChart: boolean): boolean {
        if (data.series.enableTooltip) {
            if (isChart) {
                (<PointData[]>this.currentPoints).push(<PointData>data);
            } else {
                (<AccPointData[]>this.currentPoints).push(<AccPointData>data);
            }
            this.stopAnimation();
            if (tooltipDiv && !document.getElementById(tooltipDiv.id)) {
                document.getElementById(this.element.id + '_Secondary_Element').appendChild(tooltipDiv);
            }
            return true;
        }
        return false;
    }

    public removeHighlight(chart: Chart | AccumulationChart): void {
        let item: PointData | AccPointData;
        let series: Series;
        for (let i: number = 0, len: number = this.previousPoints.length; i < len; i++) {
            item = this.previousPoints[i];
            if (item.series.isRectSeries) {
                if (item.series.visible) {
                    this.highlightPoint(item.series, item.point.index, false);
                }
                continue;
            }
            series = item.series as Series;
            if (!series.marker.visible && item.series.type !== 'Scatter' && item.series.type !== 'Bubble') {
                this.previousPoints.shift();
                len -= 1;
            }
        }
    }

    public highlightPoint(series: Series | AccumulationSeries, pointIndex: number, highlight: boolean): void {
        let element: HTMLElement = this.getElement(this.element.id + '_Series_' + series.index + '_Point_' + pointIndex);
        if (element) {
            element.setAttribute('opacity', (highlight ? series.opacity / 2 : series.opacity).toString());
        }
    }

    public highlightPoints(): void {
        for (let item of this.currentPoints) {
            if (item.series.isRectSeries && item.series.category === 'Series') {
                this.highlightPoint(item.series, item.point.index, true);
            }
        }
    }

    public createTooltip(chart: Chart | AccumulationChart, isFirst: boolean, location: ChartLocation,
                         clipLocation: ChartLocation, point: Points | AccPoints, shapes : ChartShape[], offset : number,
                         bounds : Rect, extraPoints: PointData[] = null, templatePoint : Points | AccPoints = null ): void {
        let series: Series = <Series>this.currentPoints[0].series;
        let module : AccumulationTooltip | Tooltip = (<Chart>chart).tooltipModule || (<AccumulationChart>chart).accumulationTooltipModule;
        if (isFirst) {
            this.svgTooltip = new SVGTooltip(
                {
                opacity: chart.tooltip.opacity,
                header: this.headerText, content: this.text, fill: chart.tooltip.fill, border: chart.tooltip.border,
                enableAnimation: chart.tooltip.enableAnimation, location: location, shared: chart.tooltip.shared,
                shapes: shapes, clipBounds: this.chart.chartAreaType === 'PolarRadar' ? new ChartLocation(0, 0) : clipLocation,
                areaBounds: bounds, palette: this.findPalette(), template: chart.tooltip.template, data: templatePoint,
                theme : chart.theme,  offset: offset, textStyle : chart.tooltip.textStyle,
                isNegative: (series.isRectSeries && series.type !== 'Waterfall' && point && point.y < 0),
                inverted: this.chart.requireInvertedAxis && series.isRectSeries,
                arrowPadding : this.text.length > 1 ? 0 : 12,
                tooltipRender: () => {
                    module.removeHighlight(module.control);
                    module.highlightPoints();
                    module.updatePreviousPoint(extraPoints);
                },
                animationComplete: (args: ITooltipAnimationCompleteArgs) => {
                    if (args.tooltip.fadeOuted) {
                        module.fadeOut(<PointData[]>module.previousPoints, chart);
                    }
                }
                },
                '#' + this.element.id + '_tooltip');
        } else {
            this.svgTooltip.location = location;
            this.svgTooltip.content = this.text;
            this.svgTooltip.header = this.headerText;
            this.svgTooltip.offset = offset;
            this.svgTooltip.palette = this.findPalette();
            this.svgTooltip.shapes = shapes;
            this.svgTooltip.data = templatePoint;
            this.svgTooltip.template = chart.tooltip.template;
            this.svgTooltip.textStyle = chart.tooltip.textStyle;
            this.svgTooltip.isNegative = (series.isRectSeries && series.type !== 'Waterfall' && point && point.y < 0);
            this.svgTooltip.clipBounds = this.chart.chartAreaType === 'PolarRadar' ? new ChartLocation(0, 0) : clipLocation;
            this.svgTooltip.arrowPadding = this.text.length > 1 ? 0 : 12;
            this.svgTooltip.dataBind();
        }
    }

    private findPalette() : string[] {
        let colors : string[] = [];
        for (let data of this.currentPoints) {
            colors.push(this.findColor(data, <Series>data.series));
        }
        return colors;
    }

    private findColor(data: PointData | AccPointData, series: Series) : string {
        if (series.isRectSeries && (series.type === 'Candle' || series.type === 'Hilo' || series.type === 'HiloOpenClose')) {
            return data.point.color;
        } else {
            return (data.point.color && data.point.color !== '#ffffff' ? data.point.color
                                                                       : (<Points>data.point).interior) ||
                                                                         series.marker.fill || series.interior;
        }
    }


    public updatePreviousPoint(extraPoints: PointData[]): void {
        if (extraPoints) {
            this.currentPoints = (<PointData[]>this.currentPoints).concat(extraPoints);
        }
        this.previousPoints = <PointData[]>extend([], this.currentPoints, null, true);
    }

    public fadeOut(data: PointData[], chart: Chart | AccumulationChart): void {
        let svgElement: HTMLElement = this.getElement(this.element.id + '_tooltip_svg');
        let isTooltip: boolean = (svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0);
        if (!isTooltip) {
            this.valueX = null;
            this.valueY = null;
            this.currentPoints = [];
            this.removeHighlight(chart);
            this.removeHighlightedMarker(data);
            this.svgTooltip = null;
            this.control.trigger('animationComplete', {});
        }
    }

    /*
    * @hidden
    */
    public removeHighlightedMarker(data: PointData[]): void {
        if (this.chart.markerRender) {
        for (let item of data) {
            removeElement(this.element.id + '_Series_' + item.series.index +
                '_Point_' + item.point.index + '_Trackball');
        }
        this.chart.markerRender.removeHighlightedMarker();
        }
        this.previousPoints = [];
    }


    public triggerEvent(point: PointData | AccPointData, isFirst: boolean, textCollection: string, headerText: string,
                        firstText: boolean = true): boolean {
        let argsData: ITooltipRenderEventArgs = {
            cancel: false, name: tooltipRender, text: textCollection,
            point: point.point, series: point.series, textStyle: this.textStyle, headerText: headerText
        };
        this.chart.trigger(tooltipRender, argsData);
        if (!argsData.cancel) {
            if (point.series.type === 'BoxAndWhisker') {
                this.removeText();
                isFirst = true;
            }
            this.formattedText = this.formattedText.concat(argsData.text);
            this.text = this.formattedText;
            this.headerText = argsData.headerText;
        }
        return !argsData.cancel;
    }

    public removeText(): void {
        this.textElements = [];
        let element: Element = this.getElement(this.element.id + '_tooltip_group');
        if (element && element.childNodes.length > 0) {
            while (element.lastChild && element.childNodes.length !== 1) {
                element.removeChild(element.lastChild);
            }
        }
    }


    public stopAnimation(): void {
        stopTimer(this.toolTipInterval);
    }
   /**
    * Removes the tooltip on mouse leave.
    * @return {void}
    * @private
    */

    public removeTooltip(duration: number): void {
        let tooltipElement: HTMLElement = this.getElement(this.element.id + '_tooltip');
        this.stopAnimation();
        if (tooltipElement && this.previousPoints.length > 0) {
            this.toolTipInterval = setTimeout(
                (): void => {
                    if (this.svgTooltip) {
                    this.svgTooltip.fadeOut();
                    }
                },
                duration);
        }
    }
}
