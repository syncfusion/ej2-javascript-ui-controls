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
    /** To define the tooltip element. */
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
            const series: SmithchartSeriesModel = smithchart.series[i as number];
            const seriesIndex: number = i;
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
        const svgRectElement: Element = document.getElementById(smithchart.element.id + '_svg');
        if (smithchart.element && svgRectElement) {
            const rect: ClientRect = smithchart.element.getBoundingClientRect();
            const svgRect: ClientRect = svgRectElement.getBoundingClientRect();
            this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
            this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        }
    }

    private createTooltip(
        smithchart: Smithchart, e: PointerEvent, pointindex: number, seriesindex: number, series: SmithchartSeriesModel): void {
        const currentPoint: ISmithChartPoint = series.points[pointindex as number];
        const pointX: number = currentPoint.resistance;
        const pointY: number = currentPoint.reactance;
        const tooltip: string[] = currentPoint.tooltip ? [currentPoint.tooltip] : null;
        const tooltipText: string[] = [pointX + ' ' + ':' + ' ' + '<b>' + pointY + '</b>'];
        const argsData: ISmithChartTooltipEventArgs = {
            cancel: false, name: 'tooltipRender',
            text: tooltip || tooltipText,
            headerText: '<b>' + series.name + '</b>',
            template: series.tooltip.template,
            point: currentPoint
        };



        const smithChartTooltipSuccess: Function = (argsData: ISmithChartTooltipEventArgs) => {
            const markerHeight: number = smithchart.series[seriesindex as number].marker.height / 2;
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
                fill: series.tooltip.fill || smithchart.themeStyle.tooltipFill,
                opacity: series.tooltip.opacity,
                data: currentPoint,
                template: argsData.template as any,
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
                theme: smithchart.theme
            });
            this.tooltipElement.opacity = smithchart.themeStyle.tooltipFillOpacity || this.tooltipElement.opacity;
            this.tooltipElement.textStyle.fontFamily = smithchart.themeStyle.fontFamily || 'Roboto, Segoe UI, Noto, Sans-serif';
            this.tooltipElement.textStyle.size = smithchart.themeStyle.tooltipFontSize || '13px';
            this.tooltipElement.textStyle.color = smithchart.themeStyle.tooltipBoldLabel || this.tooltipElement.textStyle.color;
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
            const a: number = x - chartPoint.x;
            const b: number = y - chartPoint.y;
            const distance: number = Math.abs(Math.sqrt((a * a) + (b * b)));
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
     *
     * @returns {string} It returns module name
     */
    protected getModuleName(): string {
        return 'TooltipRender';
    }
    /**
     * To destroy the legend.
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
