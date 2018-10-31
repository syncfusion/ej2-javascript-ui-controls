import { Sparkline, ITooltipRenderingEventArgs } from '../index';
import { SparkValues, PathOption, drawPath, getIdElement, Rect, withInBounds } from '../utils/helper';
import { Browser, extend, isNullOrUndefined, remove, createElement } from '@syncfusion/ej2-base';
import { TrackLineSettingsModel, SparklineTooltipSettingsModel } from '../model/base-model';
import { Tooltip } from '@syncfusion/ej2-svg-base';
/**
 * Sparkline Tooltip Module
 */
export class SparklineTooltip {
    /**
     * Sparkline instance in tooltip.
     */
    private sparkline: Sparkline;
    /**
     * Sparkline current point index.
     */
    private pointIndex: number;
    /**
     * Sparkline tooltip timer.
     */
    private clearTooltip: number;

    constructor(sparkline: Sparkline) {
        this.sparkline = sparkline;
        this.addEventListener();
    }

    /**
     * @hidden
     */
    private addEventListener(): void {
        if (this.sparkline.isDestroyed) { return; }
        // this.sparkline.on('mouseleave', this.mouseLeaveHandler, this);
        this.sparkline.on(Browser.isPointer ? 'pointerleave' : 'mouseleave', this.mouseLeaveHandler, this);
        this.sparkline.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.sparkline.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }

    private mouseLeaveHandler(e: PointerEvent): void {
        this.removeTooltipElements();
    }

    private mouseUpHandler(e: PointerEvent | TouchEvent): void {
        if (!this.sparkline.isTouch) {
            return;
        }
        this.processTooltip(e);
        this.fadeOut();
    }
    private fadeOut(): void {
        clearTimeout(this.clearTooltip);
        this.clearTooltip = setTimeout(this.removeTooltipElements.bind(this), 5000);
    }
    /**
     * To remove tooltip and tracker elements.
     * @private
     */
    public removeTooltipElements(): void {
        this.removeTooltip();
        this.removeTracker();
    }
    private mouseMoveHandler(e: PointerEvent | TouchEvent): void {
        this.processTooltip(e);
    }
    private processTooltip(e: PointerEvent | TouchEvent): void {
        let pointIndex: number;
        let spark: Sparkline = this.sparkline;
        let visiblePoints: SparkValues[] = spark.sparklineRenderer.visiblePoints;
        let mouseX: number = spark.mouseX;
        let mouseY: number = spark.mouseY;
        if (spark.type !== 'Pie') {
            let locations: SparkValues[] = extend([], [], visiblePoints) as SparkValues[];
            let trackerPositions: number[] = locations.map((point: SparkValues): number => { return point.location.x; });
            let temp: number = Infinity;
            let mousePosition: number;
            for (let i: number = 0, diff: number, len: number = trackerPositions.length; i < len; i++) {
                diff = Math.abs(mouseX - trackerPositions[i]);
                if (temp > diff) {
                    temp = diff;
                    mousePosition = trackerPositions[i];
                    pointIndex = i;
                }
            }
        } else {
            let target: string = (e.target as Element).id;
            pointIndex = parseInt(target.split('_pie_')[1], 10);
        }
        if (isNaN(pointIndex) || !withInBounds(mouseX, mouseY, new Rect(0, 0, spark.availableSize.width, spark.availableSize.height))) {
            this.removeTracker();
            this.removeTooltip();
            return;
        }
        if (this.pointIndex === pointIndex) {
            return;
        }
        this.pointIndex = pointIndex;
        this.renderTrackerLine(visiblePoints[pointIndex]);
        this.renderTooltip(visiblePoints[pointIndex]);
    }

    /**
     * To render tracker line
     */
    private renderTrackerLine(points: SparkValues): void {
        let spark: Sparkline = this.sparkline;
        let tracker: TrackLineSettingsModel = spark.tooltipSettings.trackLineSettings;
        let color: string = (spark.theme === 'Highcontrast') ? '#FFFFFF' : '#000000';
        color = (tracker.color) ? tracker.color : color;
        if (!tracker.visible || spark.type === 'Pie') {
            return;
        }
        let group: Element = getIdElement(spark.element.id + '_sparkline_tracker_g');
        if (isNullOrUndefined(group)) {
            group = spark.renderer.createGroup({ id: spark.element.id + '_sparkline_tracker_g' });
            spark.svgObject.appendChild(group);
        }
        let pathEle: Element = getIdElement(spark.element.id + '_sparkline_tracker');
        let d: string = 'M ' + points.location.x + ' ' + spark.padding.top + ' L ' + points.location.x + ' ' +
        (spark.availableSize.height - spark.padding.bottom);
        if (isNullOrUndefined(pathEle)) {
            let pathOption: PathOption = new PathOption(
                spark.element.id + '_sparkline_tracker', 'transparent', tracker.width, color, 1);
            pathOption.d = d;
            drawPath(spark, pathOption, group);
        } else {
            pathEle.setAttribute('d', d);
            pathEle.setAttribute('stroke-width', tracker.width.toString());
            pathEle.setAttribute('stroke', color);
        }
    }

    /**
     * To render line series
     */
    private renderTooltip(points: SparkValues): void {
        let spark: Sparkline = this.sparkline;
        let tooltip: SparklineTooltipSettingsModel = spark.tooltipSettings;
        if (!tooltip.visible) {
            return;
        }
        let div: Element = getIdElement(spark.element.id + '_sparkline_tooltip_div');
        if (isNullOrUndefined(div)) {
            div = createElement('div', { id: spark.element.id + '_sparkline_tooltip_div',
            styles: 'pointer-events: none; position: absolute;z-index:1;' });
            getIdElement(spark.element.id + '_Secondary_Element').appendChild(div);
        }
        let size: number = (spark.markerSettings.visible.length) ? spark.markerSettings.size : 0;
        let x: string = points.xVal.toString();
        if (spark.valueType === 'Category') {
            x = spark.dataSource[points.xVal][spark.xName] as string;
        } else if (spark.valueType === 'DateTime') {
            x = new Date(points.xVal).toDateString();
        }
        let y: string = points.yVal.toString();
        let text: string[] |  HTMLElement = this.getFormat(
            spark.tooltipSettings.format, spark, x, this.formatValue(points.yVal, spark).toString());
        let location: {x: number, y: number } = { x: points.location.x, y: points.location.y };
        location = spark.type === 'Pie' ? {x: points.location.x, y: points.location.y} : location;
        let tooltipEvent: ITooltipRenderingEventArgs = {
            name: 'tooltipInitialize', cancel: false, text: text,
            textStyle: {
                size: tooltip.textStyle.size,
                opacity: tooltip.textStyle.opacity,
                fontWeight: tooltip.textStyle.fontWeight,
                fontStyle: tooltip.textStyle.fontStyle,
                fontFamily: tooltip.textStyle.fontFamily,
                color: tooltip.textStyle.color,
            }
        };
        spark.trigger(tooltipEvent.name, tooltipEvent);
        if (tooltipEvent.cancel) {
            return;
        }
        let element: Tooltip = new Tooltip({
            content: tooltipEvent.text,
            border: tooltip.border,
            template: tooltip.template,
            data: spark.dataSource[this.pointIndex],
            fill: tooltip.fill,
            textStyle: tooltipEvent.textStyle,
            enableAnimation: false,
            location: {x: location.x, y: location.y},
            shared: false,
            areaBounds: new Rect(0, 0, spark.availableSize.width, spark.availableSize.height),
            theme: spark.theme
        });
        element.appendTo(div as HTMLElement);
    }
    /**
     * To get tooltip format.
     */
    private getFormat(format: string, spark: Sparkline, x: string, y: string): string[] {
        if (isNullOrUndefined(format) || format === '') {
            return [y];
        }
        let text: string = format;
        text = text.split('${' + spark.xName + '}').join(x).split('${' + spark.yName + '}').join(y);
        return [text];
    }
    private formatValue(value: number, sparkline: Sparkline): string | number {
        let formatValue: string | number; let formatFunction: Function;
        if (sparkline.format && !isNaN(Number(value))) {
            formatFunction = sparkline.intl.getNumberFormat(
                { format: sparkline.format, useGrouping: sparkline.useGroupingSeparator });
            formatValue = formatFunction(value);
        } else {
            formatValue = value;
        }
        return formatValue;
    }
    /**
     * To remove tracker line.
     */
    private removeTracker(): void {
        let tracker: Element = this.sparkline.element.querySelector('#' + this.sparkline.element.id + '_sparkline_tracker_g');
        return tracker ? remove(tracker) : null;
    }
    /**
     * To remove tooltip element.
     */
    private removeTooltip(): void {
        this.pointIndex = null;
        let tooltip: Element = this.sparkline.element.querySelector('#' + this.sparkline.element.id + '_sparkline_tooltip_div');
        return tooltip ? remove(tooltip) : null;
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'SparklineTooltip';
    }
    /**
     * To destroy the tooltip.
     */
    public destroy(sparkline: Sparkline): void {
        // To remove tooltip module
    }
}