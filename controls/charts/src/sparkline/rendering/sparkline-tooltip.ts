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
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.sparkline.isDestroyed) { return; }
        // this.sparkline.on('mouseleave', this.mouseLeaveHandler, this);
        this.sparkline.on(Browser.isPointer ? 'pointerleave' : 'mouseleave', this.mouseLeaveHandler, this);
        this.sparkline.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.sparkline.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }

    private mouseLeaveHandler(): void {
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
        this.clearTooltip = +setTimeout(this.removeTooltipElements.bind(this), 5000);
    }
    /**
     * To remove tooltip and tracker elements.
     *
     * @private
     * @returns {void}
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
        const spark: Sparkline = this.sparkline;
        const visiblePoints: SparkValues[] = spark.sparklineRenderer.visiblePoints;
        const mouseX: number = spark.mouseX;
        const mouseY: number = spark.mouseY;
        if (spark.type !== 'Pie') {
            const locations: SparkValues[] = extend([], [], visiblePoints) as SparkValues[];
            const trackerPositions: number[] = locations.map((point: SparkValues): number => { return point.location.x; });
            let temp: number = Infinity;
            for (let i: number = 0, diff: number, len: number = trackerPositions.length; i < len; i++) {
                diff = Math.abs(mouseX - trackerPositions[i as number]);
                if (temp > diff) {
                    temp = diff;
                    pointIndex = i;
                }
            }
        } else {
            const target: string = (e.target as Element).id;
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
        this.renderTrackerLine(visiblePoints[pointIndex as number]);
        this.renderTooltip(visiblePoints[pointIndex as number]);
    }

    /**
     * To render tracker line.
     *
     * @param {SparkValues} points - The data points for rendering the tracker line.
     * @returns {void}
     */
    private renderTrackerLine(points: SparkValues): void {
        const spark: Sparkline = this.sparkline;
        const tracker: TrackLineSettingsModel = spark.tooltipSettings.trackLineSettings;
        const color: string = spark.sparkTheme.trackerLineColor ? spark.sparkTheme.trackerLineColor : tracker.color;
        if (!tracker.visible || spark.type === 'Pie') {
            return;
        }
        let group: Element = getIdElement(spark.element.id + '_sparkline_tracker_g');
        if (isNullOrUndefined(group)) {
            group = spark.renderer.createGroup({ id: spark.element.id + '_sparkline_tracker_g' });
            spark.svgObject.appendChild(group);
        }
        const pathEle: Element = getIdElement(spark.element.id + '_sparkline_tracker');
        const d: string = 'M ' + points.location.x + ' ' + spark.padding.top + ' L ' + points.location.x + ' ' +
            (spark.availableSize.height - spark.padding.bottom);
        if (isNullOrUndefined(pathEle)) {
            const pathOption: PathOption = new PathOption(
                spark.element.id + '_sparkline_tracker', color, tracker.width, color, 1);
            pathOption.d = d;
            drawPath(spark, pathOption, group);
        } else {
            pathEle.setAttribute('d', d);
            pathEle.setAttribute('stroke-width', tracker.width.toString());
            pathEle.setAttribute('stroke', color);
        }
    }

    /**
     * To render tooltip.
     *
     * @param {SparkValues} points - The data points for rendering the tooltip.
     * @returns {void}
     */
    public renderTooltip(points: SparkValues): void {
        const spark: Sparkline = this.sparkline;
        const tooltip: SparklineTooltipSettingsModel = spark.tooltipSettings;
        if (!tooltip.visible) {
            return;
        }
        let div: Element = getIdElement(spark.element.id + '_sparkline_tooltip_div');
        if (isNullOrUndefined(div)) {
            div = createElement('div', {
                id: spark.element.id + '_sparkline_tooltip_div',
                styles: 'pointer-events: none; position: absolute;z-index:1;'
            });
            getIdElement(spark.element.id + '_Secondary_Element').appendChild(div);
        }
        let x: string = points.xVal.toString();
        if (spark.valueType === 'Category') {
            x = spark.dataSource[points.xVal][spark.xName] as string;
        } else if (spark.valueType === 'DateTime') {
            x = new Date(points.xVal).toDateString();
        }
        const text: string[] | HTMLElement = this.getFormat(
            spark.tooltipSettings.format, spark, x, this.formatValue(points.yVal, spark).toString());
        let location: { x: number, y: number } = { x: points.location.x, y: points.location.y };
        location = spark.type === 'Pie' ? { x: points.location.x, y: points.location.y } : location;
        const textColor: string = tooltip.textStyle.color || spark.sparkTheme.tooltipFontColor;
        const backgroundColor: string = tooltip.fill === '' ? spark.sparkTheme.tooltipFill : tooltip.fill;
        const tooltipEvent: ITooltipRenderingEventArgs = {
            name: 'tooltipInitialize', cancel: false, text: text,
            textStyle: {
                size: tooltip.textStyle.size,
                opacity: spark.sparkTheme.tooltipTextOpacity || tooltip.textStyle.opacity,
                fontWeight: tooltip.textStyle.fontWeight || spark.sparkTheme.tooltipFontWeight,
                fontStyle: tooltip.textStyle.fontStyle,
                fontFamily: tooltip.textStyle.fontFamily || spark.sparkTheme.tooltipFontFamily,
                color: textColor
            }
        };
        spark.trigger('tooltipInitialize', tooltipEvent, () => {
            this.addTooltip(tooltipEvent, spark, backgroundColor, tooltip, location, div);
        });
    }

    private addTooltip(tooltipEvent: ITooltipRenderingEventArgs, spark: Sparkline, backgroundColor: string,
                       tooltip: SparklineTooltipSettingsModel, location: { x: number, y: number }, div: Element,
                       eventArgs?: ITooltipRenderingEventArgs): void {
        let cancel : boolean;
        let arg : object;
        let tootipArgs: ITooltipRenderingEventArgs;
        if (!isNullOrUndefined(tooltipEvent)) {
            const {cancel : c, ...otherArgs} : ITooltipRenderingEventArgs = tooltipEvent;
            cancel = c;
            tootipArgs = tooltipEvent;
        } else {
            cancel = eventArgs.cancel;
            arg = eventArgs as object;
            tootipArgs = eventArgs;
        }
        if (tooltipEvent.cancel) {
            return;
        }
        const element: Tooltip = new Tooltip({
            content: tootipArgs.text,
            border: tooltip.border,
            template: tooltip.template as string | Function,
            data: spark.dataSource[this.pointIndex],
            fill: backgroundColor,
            textStyle: tootipArgs.textStyle,
            enableAnimation: false,
            enableRTL: spark.enableRtl,
            location: { x: location.x, y: location.y },
            shared: false,
            availableSize: this.sparkline.availableSize,
            areaBounds: new Rect(0, 0, spark.availableSize.width, spark.availableSize.height),
            theme: spark.theme
        });
        element.opacity = spark.sparkTheme.tooltipFillOpacity || element.opacity;
        element.appendTo(div as HTMLElement);
    }
    /**
     * To get tooltip format.
     *
     * @param {string} format - The format string for tooltip.
     * @param {Sparkline} spark - The Sparkline instance.
     * @param {string} x - The x-coordinate of the data point.
     * @param {string} y - The y-coordinate of the data point.
     * @returns {string[]} - The formatted tooltip text.
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
     *
     * @returns {void}
     */
    private removeTracker(): void {
        const tracker: Element = this.sparkline.element.querySelector('#' + this.sparkline.element.id + '_sparkline_tracker_g');
        return tracker ? remove(tracker) : null;
    }
    /**
     * To remove tooltip element.
     *
     * @returns {void}
     */
    private removeTooltip(): void {
        this.pointIndex = null;
        const tooltip: Element = this.sparkline.element.querySelector('#' + this.sparkline.element.id + '_sparkline_tooltip_div');
        return tooltip ? remove(tooltip) : null;
    }
    /**
     * Get module name.
     *
     * @returns {string} - To get the module name.
     */
    protected getModuleName(): string {
        return 'SparklineTooltip';
    }
    /**
     * To destroy the tooltip.
     *
     * @returns {void}
     */
    public destroy(): void {
        // To remove tooltip module
    }
}
