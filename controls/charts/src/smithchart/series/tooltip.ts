/**
 * 
 */
import { Smithchart } from '../../smithchart';
import { SmithchartSeriesModel } from '../../smithchart/series/series-model';
import { ClosestPoint, Point, SmithchartRect } from '../../smithchart/utils/utils';
import { Tooltip } from '@syncfusion/ej2-svg-base';
import { isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { ISmithChartTooltipEventArgs, ISmithChartPoint } from '../model/interface';

/**
 * To render tooltip
 */
export class TooltipRender {
    private mouseX: number;
    private mouseY: number;
    private locationX: number;
    private locationY: number;
    /** To define the tooltip element */
    public tooltipElement: Tooltip;
    public smithchartMouseMove(smithchart: Smithchart, e: PointerEvent): Tooltip {
        let touchArg: TouchEvent;
        let pageX: number;
        let pageY: number;
        if (e.type === 'touchend' || e.type === 'touchmove') {
            touchArg = <TouchEvent & PointerEvent>e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
            this.tooltipElement = undefined;
        } else {
            pageY = e.clientY;
            pageX = e.clientX;
        }
        this.setMouseXY(smithchart, pageX, pageY);
        for (let i: number = 0; i < smithchart.series.length; i++) {
            let series: SmithchartSeriesModel = smithchart.series[i];
            let seriesIndex: number = i;
            let closestPoint: ClosestPoint = new ClosestPoint();
            closestPoint = this.closestPointXY(smithchart, this.mouseX, this.mouseY, series, seriesIndex);
            if (closestPoint.location && series.tooltip.visible && series.visibility === 'visible') {
                this.createTooltip(smithchart, e, closestPoint.index, seriesIndex, series);
                break;
            } else if (this.tooltipElement) {
                if (this.tooltipElement.enable && !series.tooltip.template) {
                    this.tooltipElement.enable = false;
                }
                this.tooltipElement.fadeOut();
            }
        }
        return this.tooltipElement;
    }

    private setMouseXY(smithchart: Smithchart, pageX: number, pageY: number): void {
        let rect: ClientRect = smithchart.element.getBoundingClientRect();
        let svgRect: ClientRect = document.getElementById(smithchart.element.id + '_svg').getBoundingClientRect();
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
    }

    private createTooltip(
        smithchart: Smithchart, e: PointerEvent, pointindex: number, seriesindex: number, series: SmithchartSeriesModel): void {
        let currentPoint: ISmithChartPoint = series.points[pointindex];
        let pointX: number = currentPoint.resistance;
        let pointY: number = currentPoint.reactance;
        let tooltip: string[] = currentPoint.tooltip ? [currentPoint.tooltip] : null;
        let tooltipText: string[] = [pointX + ' ' + ':' + ' ' + '<b>' + pointY + '</b>'];
        let argsData: ISmithChartTooltipEventArgs = {
            cancel: false, name: 'tooltipRender',
            text: tooltip || tooltipText,
            headerText: '<b>' + series.name + '</b>',
            template: series.tooltip.template,
            point: currentPoint
        };


        let smithChartTooltipSuccess: Function = (argsData: ISmithChartTooltipEventArgs) => {
            let markerHeight: number = smithchart.series[seriesindex].marker.height / 2;
            let div: Element = document.getElementById(smithchart.element.id + '_smithchart_tooltip_div');
            if (isNullOrUndefined(div)) {
                div = createElement('div', {
                    id: smithchart.element.id + '_smithchart_tooltip_div',
                    styles: 'pointer-events: none; position: absolute;z-index:1;'
                });
                document.getElementById(smithchart.element.id + '_Secondary_Element').appendChild(div);
            }
            this.tooltipElement = new Tooltip({
                enable: true,
                header: argsData.headerText,
                content: argsData.text,
                border: series.tooltip.border,
                fill: smithchart.themeStyle.tooltipFill,
                data: currentPoint,
                template: argsData.template,
                location: {
                    x: this.locationX + smithchart.element.offsetLeft,
                    y: this.locationY - markerHeight + smithchart.element.offsetTop
                },
                shared: false,
                areaBounds: new SmithchartRect(
                    smithchart.bounds.x, smithchart.bounds.y,
                    smithchart.bounds.width, smithchart.bounds.height),
                palette: [series.fill || smithchart.seriesColors[seriesindex % smithchart.seriesColors.length]],
                shapes: ['Circle'],
                availableSize: smithchart.availableSize,
                theme: smithchart.theme,
                blazorTemplate: { name: 'TooltipTemplate', parent: smithchart.series[seriesindex].tooltip }
            });
            this.tooltipElement.opacity = smithchart.themeStyle.tooltipFillOpacity || this.tooltipElement.opacity;
            this.tooltipElement.textStyle.fontFamily = smithchart.themeStyle.fontFamily || 'Roboto, Segoe UI, Noto, Sans-serif';
            this.tooltipElement.textStyle.opacity = smithchart.themeStyle.tooltipTextOpacity || this.tooltipElement.textStyle.opacity;
            this.tooltipElement.appendTo(div as HTMLElement);
        };
        smithChartTooltipSuccess.bind(this, smithchart);
        smithchart.trigger('tooltipRender', argsData, smithChartTooltipSuccess);
    }
    private closestPointXY(smithchart: Smithchart, x: number, y: number, series: SmithchartSeriesModel, seriesindex: number): ClosestPoint {
        let pointIndex: number;
        let chartPoint: Point;
        let closePoint: Point;
        for (let j: number = 0; j < series.points.length; j++) {
            chartPoint = smithchart.seriesrender.getLocation(seriesindex, j);
            this.locationX = chartPoint.x;
            this.locationY = chartPoint.y;
            pointIndex = j;
            let a: number = x - chartPoint.x;
            let b: number = y - chartPoint.y;
            let distance: number = Math.abs(Math.sqrt((a * a) + (b * b)));
            if (distance < series.marker.width) {
                closePoint = chartPoint;
                pointIndex = j;
                break;
            }
        }
        return { location: closePoint, index: pointIndex };
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'TooltipRender';
    }
    /**
     * To destroy the legend. 
     * @return {void}
     * @private
     */
    public destroy(smithchart: Smithchart): void {
        /**
         * Destroy method performed here
         */
    }
} 