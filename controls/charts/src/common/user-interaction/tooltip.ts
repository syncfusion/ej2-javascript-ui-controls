/* eslint-disable @typescript-eslint/no-inferrable-types */
import { extend } from '@syncfusion/ej2-base';
import { Chart } from '../../chart';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { AccPoints, AccumulationSeries } from '../../accumulation-chart/model/acc-base';
import { PointData, ChartLocation, withInBounds } from '../../common/utils/helper';
import { Rect, Size, measureText, TooltipPlacement } from '@syncfusion/ej2-svg-base';
import {  stopTimer, AccPointData, removeElement } from '../../common/utils/helper';
import { ChartData } from '../../chart/utils/get-data';
import { Tooltip } from '../../chart/user-interaction/tooltip';
import { AccumulationTooltip } from '../../accumulation-chart/user-interaction/tooltip';
import { Series, Points } from '../../chart/series/chart-series';
import { FontModel } from '../../common/model/base-model';
import { Tooltip as SVGTooltip, ITooltipAnimationCompleteArgs } from '@syncfusion/ej2-svg-base';
import { ChartShape } from '../../chart/utils/enum';
import { AccumulationSelection } from '../../accumulation-chart';

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
    public svgTooltip: SVGTooltip;
    public headerText: string;
    /**
     * Constructor for tooltip module.
     *
     * @private
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
     *
     * @returns {void}
     * @private
     */

    public getTooltipElement(isTooltip: boolean): HTMLDivElement {
        this.inverted = this.chart.requireInvertedAxis;
        this.header = (this.control.tooltip.header === null) ?
            ((this.control.tooltip.shared) ? '<b>${point.x}</b>' : '<b>${series.name}</b>')
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
        const element: HTMLElement = this.getElement(this.element.id + '_Series_' + series.index + '_Point_' + pointIndex);
        const selectionModule: AccumulationSelection = (this.control as AccumulationChart).accumulationSelectionModule;
        const isSelectedElement: boolean = selectionModule && selectionModule.selectedDataIndexes.length > 0 ? true : false;
        if (element) {
            if ((!isSelectedElement || isSelectedElement && element.getAttribute('class')
                && element.getAttribute('class').indexOf('_ej2_chart_selection_series_') === -1)) {
                element.setAttribute('opacity', (highlight ? series.opacity / 2 : series.opacity).toString());
            } else {
                element.setAttribute('opacity', series.opacity.toString());
            }
        }
    }

    public highlightPoints(): void {
        for (const item of this.currentPoints) {
            if (item.series.isRectSeries && item.series.category === 'Series') {
                this.highlightPoint(item.series, item.point.index, true);
            }
        }
    }

    // tslint:disable-next-line:max-func-body-length
    public createTooltip(
        chart: Chart | AccumulationChart, isFirst: boolean, location: ChartLocation, clipLocation: ChartLocation,
        point: Points | AccPoints, shapes: ChartShape[], offset: number, bounds: Rect, extraPoints: PointData[] = null,
        templatePoint: Points | AccPoints = null, customTemplate?: string
    ): void {
        const series: Series = <Series>this.currentPoints[0].series;
        const module: AccumulationTooltip | Tooltip = (<Chart>chart).tooltipModule || (<AccumulationChart>chart).accumulationTooltipModule;
        if (!module) { // For the tooltip enable is false.
            return;
        }
        let isNegative: boolean = (series.isRectSeries && series.type !== 'Waterfall' && point && point.y < 0);
        let inverted: boolean = this.chart.requireInvertedAxis && series.isRectSeries;
        let position: TooltipPlacement = null;
        if (this.text.length <= 1) {
            let contentSize: Size; let headerSize: Size;
            if (chart.tooltip.template && chart.getModuleName() === 'chart' && chart.tooltip.template[0] !== '#' && typeof chart.tooltip.template === 'string') {
                const templateDiv: HTMLDivElement = document.createElement('div');
                templateDiv.id = 'testing_template'; templateDiv.className = 'ejSVGTooltip';
                templateDiv.setAttribute('style', 'pointer-events:none; position:absolute;z-index: 1');
                document.getElementById(this.chart.element.id + '_Secondary_Element').appendChild(templateDiv);
                const template: string =
                    ((chart.tooltip.template as any).replaceAll('${x}', point.x as string) as any).replaceAll('${y}', point.y as string);
                templateDiv.innerHTML = template;
                contentSize = new Size(
                    (templateDiv.firstElementChild as HTMLElement).offsetWidth,
                    (templateDiv.firstElementChild as HTMLElement).offsetHeight);
                headerSize = new Size(0, 0);
                templateDiv.remove();
            } else {
                contentSize = measureText(this.text[0], chart.tooltip.textStyle);
                headerSize = (!(this.header === '' || this.header === '<b></b>')) ? measureText(this.header, this.textStyle) :
                    new Size(0, 0);
            }
            // marker size + arrowpadding + 2 * padding + markerpadding
            const markerSize: number = 10 + 12 + (2 * 10) + 5;
            contentSize.width = Math.max(contentSize.width, headerSize.width) + ((shapes.length > 0) ? markerSize : 0);
            const heightPadding: number = 12 + (2 * 10) + (headerSize.height > 0 ? (2 * 10) : 0);
            contentSize.height = contentSize.height + headerSize.height + heightPadding;
            position = this.getCurrentPosition(isNegative, inverted);
            position = this.getPositionBySize(contentSize, new Rect(0, 0, bounds.width, bounds.height), location, position);
            isNegative = (position === 'Left') || (position === 'Bottom');
            inverted = (position === 'Left') || (position === 'Right');
        }
        // else if (tooltipPosition !== 'None' && this.text.length <= 1) {
        //     position = tooltipPosition as TooltipPlacement;
        //     isNegative = (position === 'Left') || (position === 'Bottom');
        //     inverted = (position === 'Left') || (position === 'Right');
        // }

        if (isFirst) {
            this.svgTooltip = new SVGTooltip(
                {
                    opacity: chart.tooltip.opacity,
                    header: this.headerText,
                    content: this.text,
                    fill: chart.tooltip.fill,
                    border: chart.tooltip.border,
                    enableAnimation: chart.tooltip.enableAnimation,
                    location: location,
                    shared: chart.tooltip.shared,
                    shapes: shapes,
                    clipBounds: this.chart.chartAreaType === 'PolarRadar' ? new ChartLocation(0, 0) : clipLocation,
                    areaBounds: bounds,
                    palette: this.findPalette(),
                    template: customTemplate || chart.tooltip.template,
                    data: templatePoint,
                    theme: chart.theme,
                    offset: offset,
                    textStyle: chart.tooltip.textStyle,
                    isNegative: isNegative,
                    inverted: inverted,
                    arrowPadding: this.text.length > 1 || this.chart.stockChart ? 0 : 12,
                    availableSize: chart.availableSize,
                    duration: this.chart.tooltip.duration,
                    isCanvas: this.chart.enableCanvas,
                    isTextWrap: chart.tooltip.enableTextWrap && chart.getModuleName() === 'chart',
                    blazorTemplate: { name: 'Template', parent: this.chart.tooltip },
                    controlInstance: this.chart,
                    tooltipPlacement: position,
                    tooltipRender: () => {
                        module.removeHighlight();
                        module.highlightPoints();
                        module.updatePreviousPoint(extraPoints);
                    },
                    animationComplete: (args: ITooltipAnimationCompleteArgs) => {
                        if (args.tooltip.fadeOuted) {
                            module.fadeOut(<PointData[]>module.previousPoints);
                        }
                    }
                },
                '#' + this.element.id + '_tooltip');
        } else {
            if (this.svgTooltip) {
                this.svgTooltip.location = location;
                this.svgTooltip.content = this.text;
                this.svgTooltip.header = this.headerText;
                this.svgTooltip.offset = offset;
                this.svgTooltip.palette = this.findPalette();
                this.svgTooltip.shapes = shapes;
                this.svgTooltip.data = templatePoint;
                this.svgTooltip.template = chart.tooltip.template;
                this.svgTooltip.textStyle = chart.tooltip.textStyle;
                this.svgTooltip.isNegative = isNegative;
                this.svgTooltip.inverted = inverted;
                this.svgTooltip.clipBounds = this.chart.chartAreaType === 'PolarRadar' ? new ChartLocation(0, 0) : clipLocation;
                this.svgTooltip.arrowPadding = this.text.length > 1 || this.chart.stockChart ? 0 : 12;
                this.svgTooltip.tooltipPlacement = position;
                this.svgTooltip.dataBind();
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this.chart as any).isReact) { (this.chart as any).renderReactTemplates(); }
    }

    private getPositionBySize(textSize: Size, bounds: Rect, arrowLocation: ChartLocation, position: TooltipPlacement): TooltipPlacement {
        const isTop: boolean = this.isTooltipFitPosition('Top', new Rect(0, 0, bounds.width, bounds.height), arrowLocation, textSize);
        const isBottom: boolean = this.isTooltipFitPosition('Bottom', new Rect(0, 0, bounds.width, bounds.height), arrowLocation, textSize);
        const isRight: boolean = this.isTooltipFitPosition('Right', new Rect(0, 0, bounds.width, bounds.height), arrowLocation, textSize);
        const isLeft: boolean = this.isTooltipFitPosition('Left', new Rect(0, 0, bounds.width, bounds.height), arrowLocation, textSize);
        let tooltipPos: TooltipPlacement;
        if (isTop || isBottom || isRight || isLeft) {
            if (position === 'Top') {
                tooltipPos = isTop ? 'Top' : (isBottom ? 'Bottom' : (isRight ? 'Right' : 'Left'));
            } else if (position === 'Bottom') {
                tooltipPos = isBottom ? 'Bottom' : (isTop ? 'Top' : (isRight ? 'Right' : 'Left'));
            } else if (position === 'Right') {
                tooltipPos = isRight ? 'Right' : (isLeft ? 'Left' : (isTop ? 'Top' : 'Bottom'));
            } else {
                tooltipPos = isLeft ? 'Left' : (isRight ? 'Right' : (isTop ? 'Top' : 'Bottom'));
            }
        } else {
            const size: number[] = [(arrowLocation.x - bounds.x), ((bounds.x + bounds.width) - arrowLocation.x),
                (arrowLocation.y - bounds.y), ((bounds.y + bounds.height) - arrowLocation.y)];
            const index: number = size.indexOf(Math.max.apply(this, size));
            position = (index === 0) ? 'Left' : (index === 1) ? 'Right' : (index === 2) ? 'Top' : 'Bottom';
            return position;
        }
        return tooltipPos;
    }

    private isTooltipFitPosition(position: TooltipPlacement, bounds: Rect, location: ChartLocation, size: Size): boolean {
        const start: ChartLocation = new ChartLocation(0, 0);
        const end: ChartLocation = new ChartLocation(0, 0);
        switch (position) {
        case 'Top':
            start.x = location.x - (size.width / 2);
            start.y = location.y - size.height;
            end.x = location.x + (size.width / 2);
            end.y = location.y;
            break;
        case 'Bottom':
            start.x = location.x - (size.width / 2);
            start.y = location.y;
            end.x = location.x + (size.width / 2);
            end.y = location.y + size.height;
            break;
        case 'Right':
            start.x = location.x;
            start.y = location.y - (size.height / 2);
            end.x = location.x + size.width;
            end.y = location.y + (size.height / 2);
            break;
        case 'Left':
            start.x = location.x - size.width;
            start.y = location.y - (size.height / 2);
            end.x = location.x;
            end.y = location.y + (size.height / 2);
            break;
        }
        return (withInBounds(start.x, start.y, bounds) && withInBounds(end.x, end.y, bounds));
    }

    private getCurrentPosition(isNegative: boolean, inverted: boolean): TooltipPlacement {
        let position: TooltipPlacement;
        if (inverted) {
            position = isNegative ? 'Left' : 'Right';
        } else {
            position = isNegative ? 'Bottom' : 'Top';
        }
        return position;
    }

    private findPalette() : string[] {
        const colors : string[] = [];
        for (const data of this.currentPoints) {
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

    public fadeOut(data: PointData[]): void {
        const svgElement: HTMLElement = this.chart.enableCanvas ? this.getElement(this.element.id + '_tooltip_group') :
            this.getElement(this.element.id + '_tooltip_svg');
        const isTooltip: boolean = (svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0);
        if (!isTooltip) {
            this.valueX = null;
            this.valueY = null;
            this.currentPoints = [];
            this.removeHighlight();
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
            for (const item of data) {
                removeElement(this.element.id + '_Series_' + item.series.index +
                '_Point_' + item.point.index + '_Trackball');
            }
            this.chart.markerRender.removeHighlightedMarker();
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
        const tooltipTemplate: HTMLElement = tooltipElement ? this.getElement(tooltipElement.id + 'parent_template') : null;
        const isTemplateRendered: boolean = tooltipTemplate && tooltipTemplate.innerHTML !== '<div></div>';
        this.stopAnimation();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this.chart as any).isReact && isTemplateRendered) { (this.chart as any).clearTemplate([tooltipTemplate.id], [0]); }
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
