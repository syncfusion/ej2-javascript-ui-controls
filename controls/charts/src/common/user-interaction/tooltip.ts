import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart } from '../../chart';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { AccPoints, AccumulationSeries } from '../../accumulation-chart/model/acc-base';
import { PointData, ChartLocation } from '../../common/utils/helper';
import { Rect, Size } from '@syncfusion/ej2-svg-base';
import {  stopTimer, AccPointData, removeElement } from '../../common/utils/helper';
import { ChartData } from '../../chart/utils/get-data';
import { Tooltip } from '../../chart/user-interaction/tooltip';
import { AccumulationTooltip } from '../../accumulation-chart/user-interaction/tooltip';
import { Series, Points } from '../../chart/series/chart-series';
import { FontModel } from '../../common/model/base-model';
import { Tooltip as SVGTooltip, ITooltipAnimationCompleteArgs } from '@syncfusion/ej2-svg-base';
import { ChartShape } from '../../chart/utils/enum';
import { AccumulationSelection } from '../../accumulation-chart';
import { Chart3D, Tooltip3D} from '../../chart3d';
import { Chart3DSeries, Chart3DPoint } from '../../chart3d/series/chart-series';
import {Point3D} from '../../common/utils/helper';

/**
 * `Tooltip` module is used to render the tooltip for series.
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
    /**
     * @aspType string
     * @private
     */
    public template: string | Function;

    /** @private */
    public valueX: number;
    /** @private */
    public valueY: number;

    public control: AccumulationChart | Chart | Chart3D;
    public text: string[];
    public svgTooltip: SVGTooltip;
    public headerText: string;
    /**
     * Constructor for tooltip module.
     *
     * @private
     */

    constructor(chart: Chart | AccumulationChart | Chart3D) {
        super(chart as Chart);
        this.element = this.chart.element;
        this.textStyle = chart.tooltip.textStyle;
        this.control = chart;
        this.template = chart.tooltip.template;
    }



    public getElement(id: string): HTMLElement {
        return document.getElementById(id);
    }

    /**
     * Renders the tooltip.
     *
     * @returns {void}
     * @private
     */

    public getTooltipElement(isTooltip: boolean): HTMLDivElement {
        this.inverted = this.chart.requireInvertedAxis;
        this.header = (this.control.tooltip.header === null) ?
            (((this.control as Chart | AccumulationChart).tooltip.shared) ? '${point.x}' : '${series.name}')
            : (this.control.tooltip.header);
        this.formattedText = [];
        const tooltipDiv: HTMLElement = document.getElementById(this.chart.element.id + '_tooltip');
        const isStockChart: boolean = this.chart.element.id.indexOf('stockChart') > -1;
        if (!isTooltip && !tooltipDiv || isStockChart) {
            return this.createElement();
        }
        return null;
    }

    public createElement(): HTMLDivElement {
        const tooltipDiv: HTMLDivElement = document.createElement('div');
        tooltipDiv.id = this.element.id + '_tooltip'; tooltipDiv.className = 'ejSVGTooltip';
        tooltipDiv.style.pointerEvents = 'none';
        tooltipDiv.style.position = 'absolute';
        tooltipDiv.style.zIndex = '1';
        return tooltipDiv;
    }


    public pushData(data: PointData | AccPointData | Point3D, isFirst: boolean, tooltipDiv: HTMLDivElement,
                    isChart: boolean, enable3D?: boolean): boolean {
        if (data.series.enableTooltip) {
            if (enable3D) {
                (<Point3D[]>this.currentPoints).push(<Point3D>data);
            }
            else if (isChart) {
                (<PointData[]>this.currentPoints).push(<PointData>data);
            } else {
                (<AccPointData[]>this.currentPoints).push(<AccPointData>data);
            }
            this.stopAnimation();
            if (tooltipDiv && !document.getElementById(tooltipDiv.id)) {
                if (!this.chart.stockChart) {
                    document.getElementById(this.element.id + '_Secondary_Element').appendChild(tooltipDiv);
                } else {
                    document.getElementById(this.chart.stockChart.element.id + '_Secondary_Element').appendChild(tooltipDiv);
                }
            }
            return true;
        }
        return false;
    }

    public removeHighlight(): void {
        let item: PointData | AccPointData | Point3D;
        // let series: Series;
        for (let i: number = 0, len: number = this.previousPoints.length; i < len; i++) {
            item = this.previousPoints[i as number];
            if (item.series.isRectSeries) {
                if (item.series.visible) {
                    this.highlightPoint(item.series, item.point.index, false);
                }
                continue;
            }
            // series = item.series as Series;
        }
    }

    public highlightPoint(series: Series | AccumulationSeries | Chart3DSeries, pointIndex: number, highlight: boolean): void {
        const element: HTMLElement = this.getElement(this.element.id + '_Series_' + series.index + '_Point_' + pointIndex);
        const selectionModule: AccumulationSelection = (this.control as AccumulationChart).accumulationSelectionModule;
        const isSelectedElement: boolean = selectionModule && selectionModule.selectedDataIndexes.length > 0 ? true : false;
        if (element) {
            if ((!isSelectedElement || isSelectedElement && element.getAttribute('class')
                && element.getAttribute('class').indexOf('_ej2_chart_selection_series_') === -1)) {
                if (this.chart.highlightColor !== '' && !isNullOrUndefined(this.chart.highlightColor)) {
                    element.setAttribute('fill', (highlight && this.chart.highlightColor !== 'transparent' ? this.chart.highlightColor : series.pointColorMapping !== '' ? ((series as Series).points[0]).color : (series as Series).points[pointIndex as number].color || (series as Series).interior));
                }
                else {
                    element.setAttribute('opacity', (highlight && this.chart.highlightColor !== 'transparent' ? series.opacity / 2 : series.opacity).toString());
                }
            } else {
                element.setAttribute('opacity', series.opacity.toString());
            }
        }
    }

    public highlightPoints(): void {
        for (const item of this.currentPoints) {
            if (item.series.isRectSeries && item.series.category === 'Series') {
                this.highlightPoint(item.series as Series | AccumulationSeries, item.point.index, true);
            }
        }
    }

    public createTooltip(
        chart: Chart | AccumulationChart | Chart3D, isFirst: boolean, location: ChartLocation, clipLocation: ChartLocation,
        point: Points | AccPoints | Chart3DPoint, shapes: ChartShape[], offset: number, bounds: Rect,
        crosshairEnabled: boolean = false, extraPoints: PointData[] = null,
        templatePoint: Points | Points[] | AccPoints | Chart3DPoint| Chart3DPoint[] = null, customTemplate?: string
    ): void {
        const series: Series = <Series>this.currentPoints[0].series;
        const tooltipModule: AccumulationTooltip | Tooltip | Tooltip3D = (<Chart>chart).tooltipModule || (<Chart3D>chart).tooltip3DModule ||
         (<AccumulationChart>chart).accumulationTooltipModule;
        if (!tooltipModule || location === null) { // For the tooltip enable is false.
            removeElement(this.chart.element.id + '_tooltip');
            return;
        }

        if (isFirst) {
            this.svgTooltip = new SVGTooltip(
                {
                    opacity: chart.tooltip.opacity ?  chart.tooltip.opacity : ((this.chart.theme === 'Material3' || this.chart.theme === 'Material3Dark') ? 1 : 0.75),
                    header: this.headerText,
                    content: this.text,
                    fill: chart.tooltip.fill,
                    border: chart.tooltip.border,
                    enableAnimation: chart.tooltip.enableAnimation,
                    location: location,
                    shared: (this.control as Chart | AccumulationChart).tooltip.shared,
                    crosshair: crosshairEnabled,
                    shapes: shapes,
                    clipBounds: this.chart.chartAreaType === 'PolarRadar' ? new ChartLocation(0, 0) : clipLocation,
                    areaBounds: bounds,
                    palette: this.findPalette(),
                    template: customTemplate || this.template as string | Function,
                    data: templatePoint,
                    theme: chart.theme,
                    offset: offset,
                    textStyle: chart.tooltip.textStyle,
                    isNegative: (series.isRectSeries && series.type !== 'Waterfall' && point && point.y < 0),
                    inverted: this.chart.requireInvertedAxis && series.isRectSeries,
                    arrowPadding: this.text.length > 1 || this.chart.stockChart || (this.chart.tooltip.location.x !== null
                        || this.chart.tooltip.location.y !== null ) ? 0 : 7,
                    availableSize: chart.availableSize,
                    duration: this.chart.tooltip.duration,
                    isCanvas: this.chart.enableCanvas,
                    isFixed: (this.chart.tooltip.location.x !== null || this.chart.tooltip.location.y !== null),
                    isTextWrap: chart.tooltip.enableTextWrap && chart.getModuleName() === 'chart',
                    blazorTemplate: { name: 'Template', parent: this.chart.tooltip },
                    controlInstance: this.chart,
                    enableRTL: chart.enableRtl,
                    controlName: 'Chart',
                    allowHighlight: chart.getModuleName() === 'chart' && !series.marker.allowHighlight,
                    tooltipRender: () => {
                        tooltipModule.removeHighlight();
                        tooltipModule.highlightPoints();
                        tooltipModule.updatePreviousPoint(extraPoints);
                    },
                    animationComplete: (args: ITooltipAnimationCompleteArgs) => {
                        if (args.tooltip.fadeOuted) {
                            tooltipModule.fadeOut(<PointData[]>tooltipModule.previousPoints);
                        }
                    }
                });
            this.svgTooltip.appendTo(this.getElement(this.element.id + '_tooltip'));
        } else {
            if (this.svgTooltip) {
                this.svgTooltip.location = location;
                this.svgTooltip.content = this.text;
                this.svgTooltip.header = this.headerText;
                this.svgTooltip.offset = offset;
                this.svgTooltip.palette = this.findPalette();
                this.svgTooltip.shapes = shapes;
                this.svgTooltip.data = templatePoint;
                this.svgTooltip.template = this.template as string | Function;
                this.svgTooltip.controlName = 'Chart';
                this.svgTooltip.crosshair = crosshairEnabled;
                this.svgTooltip.textStyle = chart.tooltip.textStyle;
                this.svgTooltip.isNegative = (series.isRectSeries && series.type !== 'Waterfall' && point && point.y < 0);
                this.svgTooltip.clipBounds = this.chart.chartAreaType === 'PolarRadar' ? new ChartLocation(0, 0) : clipLocation;
                this.svgTooltip.arrowPadding = this.text.length > 1 || this.chart.stockChart || (this.chart.tooltip.location.x !== null
                    || this.chart.tooltip.location.y !== null) ? 0 : 7;
                this.svgTooltip.allowHighlight = chart.getModuleName() === 'chart' && !series.marker.allowHighlight;
                this.svgTooltip.dataBind();
            }
        }
        if ((this.chart as any).isReact) { (this.chart as any).renderReactTemplates(); }
    }

    private findPalette() : string[] {
        const colors : string[] = [];
        for (const data of this.currentPoints) {
            colors.push(this.findColor(data, <Series>data.series));
        }
        return colors;
    }

    private findColor(data: PointData | AccPointData | Point3D, series: Series) : string {
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

    public fadeOut(data: PointData[]): void {
        const svgElement: HTMLElement = this.chart.enableCanvas ? this.getElement(this.element.id + '_tooltip_group') :
            this.getElement(this.element.id + '_tooltip_svg');
        const isTooltip: boolean = (svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0);
        if (!isTooltip) {
            this.valueX = null;
            this.valueY = null;
            this.currentPoints = [];
            this.removeHighlight();
            this.removeHighlightedMarker(data, true);
            this.svgTooltip = null;
            this.control.trigger('animationComplete', {});
        }
    }

    /*
    * @hidden
    */
    public removeHighlightedMarker(data: PointData[], fadeOut: boolean): void {
        if (this.chart.markerRender) {
            for (const item of data) {
                removeElement(this.element.id + '_Series_' + item.series.index +
                '_Point_' + item.point.index + '_Trackball');
                this.chart.markerRender.removeHighlightedMarker(item.series, item.point, fadeOut);
            }
        }
        this.previousPoints = [];
    }


    // public triggerEvent(point: PointData | AccPointData, isFirst: boolean, textCollection: string, firstText: boolean = true): boolean {
    //     let argsData: ITooltipRenderEventArgs = {
    //         cancel: false, name: tooltipRender, text: textCollection,
    //         point: point.point, series: point.series, textStyle: this.textStyle
    //     };
    //     this.chart.trigger(tooltipRender, argsData);
    //     if (!argsData.cancel) {
    //         if (point.series.type === 'BoxAndWhisker') {
    //             this.removeText();
    //             isFirst = true;
    //         }
    //         this.formattedText = this.formattedText.concat(argsData.text);
    //         this.text = this.formattedText;
    //     }
    //     return !argsData.cancel;
    // }

    public removeText(): void {
        this.textElements = [];
        const element: Element = this.getElement(this.element.id + '_tooltip_group');
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
     *
     * @returns {void}
     * @private
     */

    public removeTooltip(duration: number): void {
        const tooltipElement: HTMLElement =  this.getElement(this.element.id + '_tooltip');
        // const tooltipTemplate: HTMLElement = tooltipElement ? this.getElement(tooltipElement.id + 'parent_template') : null;
        // const isTemplateRendered: boolean = tooltipTemplate && tooltipTemplate.innerText !== '<div></div>';
        this.stopAnimation();
        if (tooltipElement && this.previousPoints.length > 0) {
            this.toolTipInterval = +setTimeout(
                (): void => {
                    if (this.svgTooltip) {
                        this.svgTooltip.fadeOut();
                    }
                },
                duration);
        }
    }
}
