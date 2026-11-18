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
            spark.tooltipSettings.format, spark, x, this.formatValue(points.yVal, spark).toString(), points);
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
        let arg: object;
        let tootipArgs: ITooltipRenderingEventArgs;
        if (!isNullOrUndefined(tooltipEvent)) {
            const { cancel: c, ...otherArgs }: ITooltipRenderingEventArgs = tooltipEvent;
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
     * Gets the formatted tooltip text for the specified Sparkline point.
     *
     * @param {string} format - The tooltip template format string.
     * @param {Sparkline} spark - The Sparkline instance used to resolve tooltip values.
     * @param {string} x - The formatted x-value text.
     * @param {string} y - The formatted y-value text.
     * @param {SparkValues} points - The Sparkline point values used to resolve tooltip tokens.
     * @returns {string[]} - Returns the formatted tooltip text collection.
     * @private
     */
    private getFormat(format: string, spark: Sparkline, x: string, y: string, points: SparkValues): string[] {
        if (isNullOrUndefined(format) || format === '') {
            return [y];
        }

        let text: string = format;
        const xName: string = spark.xName;
        const yName: string = spark.yName;

        if (text.indexOf('${') !== -1) {
            let previous: string;
            do {
                previous = text;
                text = this.resolveSparklineTooltipTokens(text, spark, x, y, points, xName, yName);
            } while (text !== previous && text.indexOf('${') !== -1);
        }

        return [text];
    }

    /**
     * Resolves inline Sparkline tooltip tokens in the specified template string.
     *
     * @param {string} input - The tooltip template string that contains inline tokens to resolve.
     * @param {Sparkline} spark - The Sparkline instance used to resolve tooltip values.
     * @param {string} x - The formatted x-value text.
     * @param {string} y - The formatted y-value text.
     * @param {SparkValues} points - The Sparkline point values used to resolve tooltip tokens.
     * @param {string} xName - The x-value field name used in the tooltip template.
     * @param {string} yName - The y-value field name used in the tooltip template.
     * @returns {string} - Returns the tooltip template string with supported tokens resolved.
     * @private
     */
    private resolveSparklineTooltipTokens(
        input: string,
        spark: Sparkline,
        x: string,
        y: string,
        points: SparkValues,
        xName: string,
        yName: string
    ): string {
        return input.replace(
            /\$\{([^{}]+)\}/g,
            this.replaceSparklineTooltipToken.bind(this, spark, x, y, points, xName, yName)
        );
    }

    /**
     * Replaces a single inline Sparkline tooltip token with the corresponding x or y value.
     *
     * @param {Sparkline} spark - The Sparkline instance used to resolve and format tooltip values.
     * @param {string} x - The formatted x-value text.
     * @param {string} y - The formatted y-value text.
     * @param {SparkValues} points - The Sparkline point values used to resolve the token.
     * @param {string} xName - The x-value field name used in the tooltip template.
     * @param {string} yName - The y-value field name used in the tooltip template.
     * @param {string} match - The complete matched tooltip token text.
     * @param {string} token - The token content inside the tooltip expression.
     * @returns {string} - Returns the resolved tooltip token value, or the original token text when it cannot be resolved.
     * @private
     */
    private replaceSparklineTooltipToken(
        spark: Sparkline,
        x: string,
        y: string,
        points: SparkValues,
        xName: string,
        yName: string,
        match: string,
        token: string
    ): string {
        const colonIndex: number = token.indexOf(':');
        let rawPath: string;
        let inlineFormat: string = '';

        if (colonIndex === -1) {
            rawPath = token;
        } else {
            rawPath = token.substring(0, colonIndex);
            inlineFormat = token.substring(colonIndex + 1).trim();
        }

        // Path should not contain leading, trailing, or internal whitespace.
        // Format can contain whitespace, for example: ${x:MMM dd}
        if (rawPath !== rawPath.trim() || /\s/.test(rawPath)) {
            return match;
        }

        let rawValue: any;
        let fallbackText: string;

        if (rawPath === xName) {
            rawValue = spark.valueType === 'DateTime' ? new Date(points.xVal) :
                spark.valueType === 'Category' ? spark.dataSource[points.xVal][spark.xName] as Object : points.xVal;
            fallbackText = x;
        } else if (rawPath === yName) {
            rawValue = points.yVal;
            fallbackText = y;
        } else {
            // Path does not exist, so keep original token text.
            return match;
        }

        return this.formatValue(rawValue, spark, inlineFormat, fallbackText).toString();
    }

    /**
     * Formats the specified Sparkline tooltip value using inline formatting, Sparkline formatting, or fallback text.
     *
     * @param {any} value - The raw tooltip value to format.
     * @param {Sparkline} sparkline - The Sparkline instance used to apply number or date formatting.
     * @param {string} inlineFormat - The optional inline format string specified in the tooltip token.
     * @param {string} fallbackText - The optional fallback tooltip text returned when inline formatting cannot be applied.
     * @returns {string | number} - Returns the formatted tooltip value.
     * @private
     */
    private formatValue(
        value: any,
        sparkline: Sparkline,
        inlineFormat?: string,
        fallbackText?: string
    ): string | number {
        if (isNullOrUndefined(value)) {
            return String(value);
        }

        if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
            return isNaN(value) ? 'NaN' : value < 0 ? '-Infinity' : 'Infinity';
        }

        if (!isNullOrUndefined(inlineFormat) && inlineFormat !== '') {
            if (value instanceof Date && sparkline.intl && !this.isNumericFormat(inlineFormat)) {
                return sparkline.intl.getDateFormat({ format: inlineFormat })(value);
            }

            if (
                typeof value === 'number' &&
                sparkline.intl &&
                this.isNumericFormat(inlineFormat)
            ) {
                return sparkline.intl.getNumberFormat({
                    format: inlineFormat,
                    useGrouping: sparkline.useGroupingSeparator
                })(value);
            }

            return !isNullOrUndefined(fallbackText) ? fallbackText : String(value);
        }

        if (!isNullOrUndefined(fallbackText)) {
            return fallbackText;
        }

        if (sparkline.format && typeof value === 'number' && !isNaN(Number(value))) {
            const formatFunction: Function = sparkline.intl.getNumberFormat({
                format: sparkline.format,
                useGrouping: sparkline.useGroupingSeparator
            });
            return formatFunction(value);
        }

        return String(value);
    }

    /**
     * Checks whether the specified inline format is a numeric format.
     *
     * @param {string} format - The inline format string to validate.
     * @returns {boolean} - Returns true when the format is numeric; otherwise, false.
     * @private
     */
    private isNumericFormat(format: string): boolean {
        format = format ? format.trim() : '';
        return !!format && (/^[nNpPcCeE]\d*$/.test(format) || /[0#%]/.test(format));
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
