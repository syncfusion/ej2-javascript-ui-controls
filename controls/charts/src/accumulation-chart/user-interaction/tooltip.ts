/**
 * AccumulationChart Tooltip file.
 */
import { Browser, remove, getValue, extend } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AccPoints, AccumulationSeries } from '../model/acc-base';
import { AccumulationChart } from '../accumulation';
import { TooltipSettingsModel } from '../../common/model/base-model';
import { Index } from '../../common/model/base';
import { AccPointData, withInBounds, indexFinder } from '../../common/utils/helper';
//import { Rect } from '@syncfusion/ej2-svg-base';
import { BaseTooltip } from '../../common/user-interaction/tooltip';
import { ITooltipRenderEventArgs } from '../../chart/model/chart-interface';
import { tooltipRender } from '../../common/model/constants';

/**
 * The `AccumulationTooltip` module is used to render tooltips for the accumulation chart.
 */
export class AccumulationTooltip extends BaseTooltip {
    public accumulation: AccumulationChart;
    constructor(accumulation: AccumulationChart) {
        super(accumulation);
        this.accumulation = accumulation;
        this.addEventListener();
        this.template = this.accumulation.tooltip.template;
    }
    /**
     * Adds an event listener.
     *
     * @hidden
     * @returns {void}
     */
    private addEventListener(): void {
        if (this.accumulation.isDestroyed) { return; }
        this.accumulation.on(Browser.isPointer ? 'pointerleave' : 'mouseleave', this.mouseLeaveHandler, this);
        this.accumulation.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.accumulation.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }

    private mouseLeaveHandler(): void {
        this.removeTooltip(this.accumulation.tooltip.fadeOutDuration);
    }

    private mouseUpHandler(e: PointerEvent | TouchEvent): void {
        const control: AccumulationChart = this.accumulation;
        if (control.tooltip.enable && control.isTouch && withInBounds(control.mouseX, control.mouseY, control.initialClipRect)) {
            this.tooltip(e);
            this.removeTooltip(2000);
        }
    }


    private mouseMoveHandler(e: PointerEvent | TouchEvent): void {
        const control: AccumulationChart = this.accumulation;
        // Tooltip for chart series.
        if (control.tooltip.enable && withInBounds(control.mouseX, control.mouseY, control.initialClipRect)) {
            this.tooltip(e);
        }
    }



    /**
     * Renders the tooltip.
     *
     * @param {PointerEvent | TouchEvent} event - The mouse move event or touch event.
     * @returns {void}
     * @private
     */
    public tooltip(event: PointerEvent | TouchEvent): void {
        this.renderSeriesTooltip(this.accumulation,
                                 this.getPieData(event, this.accumulation));
    }

    /**
     * @private
     */

    public renderSeriesTooltip(chart: AccumulationChart, data: AccPointData): void {
        const svgElement: HTMLElement = this.getElement(this.element.id + '_tooltip_svg');
        const isTooltip: boolean = svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0;
        const tooltipDiv: HTMLDivElement = this.getTooltipElement(isTooltip);
        const isFirst: boolean = !isTooltip;
        this.currentPoints = [];
        if (data.point && (!this.previousPoints[0] || (this.previousPoints[0].point !== data.point
            || this.accumulation.tooltip.followPointer))) {
            if (!this.accumulation.tooltip.followPointer && (this.previousPoints[0]
                && data.point.index === this.previousPoints[0].point.index
                && data.series.index === this.previousPoints[0].series.index)) {
                return null;
            }
            if (this.pushData(data, isFirst, tooltipDiv, false)) {
                this.triggerTooltipRender(data, isFirst, this.getTooltipText(data, chart.tooltip), this.findHeader(data));
            }
        } else {
            if (!data.point && this.isRemove) {
                this.removeTooltip(this.accumulation.tooltip.fadeOutDuration);
                this.isRemove = false;
            }
        }
    }

    private triggerTooltipRender(point: AccPointData, isFirst: boolean, textCollection: string,
                                 headerText: string): void {
        //let template: string;
        const tooltip: TooltipSettingsModel = this.chart.tooltip;
        const argsData: ITooltipRenderEventArgs = {
            cancel: false, name: tooltipRender, text: textCollection, point: point.point, textStyle: this.textStyle,
            series: point.series, headerText: headerText,
            data: {
                pointX: point.point.x, pointY: point.point.y as Object, seriesIndex: point.series.index,
                pointIndex: point.point.index, pointText: point.point.text, seriesName: point.series.name,
                rawData: this.getRawData(point)
            }
        };
        const tooltipSuccess: Function = (argsData: ITooltipRenderEventArgs) => {
            if (!argsData.cancel) {
                this.formattedText = this.formattedText.concat(argsData.text);
                this.text = this.formattedText;
                this.headerText = argsData.headerText;
                this.createTooltip(this.chart, isFirst, { x: (tooltip.location.x !== null) ? tooltip.location.x :
                    point.point.symbolLocation.x, y: (tooltip.location.y !== null) ? tooltip.location.y : point.point.symbolLocation.y },
                                   point.series.clipRect, point.point, !tooltip.enableMarker ? [] : ['Circle'], 0, this.chart.initialClipRect, false,
                                   null, point.point, this.template ? this.accumulation.enableHtmlSanitizer ? this.accumulation.sanitize(this.template as string) : argsData.template : '');
            } else {
                this.removeHighlight();
                remove(this.getElement(this.element.id + '_tooltip'));
            }
            this.isRemove = true;
        };
        tooltipSuccess.bind(this, point);
        this.chart.trigger(tooltipRender, argsData, tooltipSuccess);
    }
    private getPieData(e: PointerEvent | TouchEvent, chart: AccumulationChart): AccPointData {
        const target: Element = e.target as Element;
        const id: Index = indexFinder(target.id, true);
        if (!isNaN(id.series)) {
            const seriesIndex: number = id.series;
            const pointIndex: number = id.point;
            if (!isNullOrUndefined(seriesIndex) && !isNaN(seriesIndex) && !isNullOrUndefined(pointIndex) && !isNaN(pointIndex)) {
                const series: AccumulationSeries = this.getSeriesFromIndex(seriesIndex, chart.visibleSeries);
                if (series.enableTooltip) {
                    return new AccPointData(series.points[pointIndex as number], series);
                }
            }
        }
        return new AccPointData(null, null);
    }

    /**
     * Resolves a copy of the complete underlying datasource record for a hovered
     * accumulation point. The returned record can be modified without changing
     * the accumulation chart datasource.
     *
     * @param {AccPointData} data - The hovered point data.
     * @returns {Object} - A copy of the underlying datasource record, or null.
     * @private
     */
    private getRawData(data: AccPointData): Object {
        if (!data || !data.point || !data.series) {
            return null;
        }

        const rawRecord: Object = data.point.rawdata !== undefined && data.point.rawdata !== null
            ? data.point.rawdata : this.getSeriesRawRecord(data.point, data.series);

        return rawRecord != null ? extend({}, rawRecord, null, true) : null;
    }

    /**
     * Resolves the underlying datasource record for a point/series pair via
     * the series data source. Used by the event-argument population and the
     * ${point.data.*} token path as a fallback.
     *
     * @param {AccPoints} point - The accumulation point.
     * @param {AccumulationSeries} series - The accumulation series.
     * @returns {Object} - The underlying datasource record, or null.
     * @private
     */
    private getSeriesRawRecord(point: AccPoints, series: AccumulationSeries): Object {
        const rows: Object[] = series.dataSource as Object[];
        if (!Array.isArray(rows) || point.index == null) {
            return null;
        }
        const row: Object = rows[point.index as number];
        return row != null ? row : null;
    }
    /**
     * To get series from index.
     *
     * @param {number} index - The index of the series to retrieve.
     * @param {AccumulationSeries[]} visibleSeries - The array of visible series in the accumulation chart.
     * @returns {AccumulationSeries} - The series retrieved from the specified index.
     */
    private getSeriesFromIndex(index: number, visibleSeries: AccumulationSeries[]): AccumulationSeries {
        return <AccumulationSeries>visibleSeries[index as number];
    }

    private getTooltipText(data: AccPointData, tooltip: TooltipSettingsModel): string {
        const series: AccumulationSeries = data.series;
        let format: string = tooltip.format ? tooltip.format : this.accumulation.theme.indexOf('Tailwind3') > -1 ? '${point.x} : ${point.y}' : '${point.x} : <b>${point.y}</b>';
        format = this.accumulation.useGroupingSeparator ? format.replace('${point.y}', '${point.separatorY}') : format;
        return this.parseTemplate(data.point, series, format);
    }

    private findHeader(data: AccPointData): string {
        if (this.header === '') {
            return '';
        }
        this.header = this.parseTemplate(data.point, data.series, this.header);
        if (this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '') {
            return this.header;
        }
        return '';
    }

    /**
     * Parses the tooltip template string and resolves all supported point and series tokens.
     *
     * @param {AccPoints} point - The accumulation chart point used to resolve point-based tooltip tokens.
     * @param {AccumulationSeries} series - The accumulation chart series used to resolve series-based tooltip tokens.
     * @param {string} format - The tooltip template format string.
     * @returns {string} - Returns the parsed tooltip text with resolved token values.
     * @private
     */
    private parseTemplate(point: AccPoints, series: AccumulationSeries, format: string): string {
        const pointKeys: string[] = Object.keys(point);
        const seriesKeys: string[] = Object.keys(Object.getPrototypeOf(series));

        if (format.indexOf('${') !== -1) {
            let previous: string;
            do {
                previous = format;
                format = this.resolveTooltipTokens(format, point, series, pointKeys, seriesKeys);
            } while (format !== previous && format.indexOf('${') !== -1);
        }

        return format;
    }

    /**
     * Resolves tooltip tokens in the specified template string.
     *
     * @param {string} input - The tooltip template string that contains tokens to resolve.
     * @param {AccPoints} point - The accumulation chart point used to resolve point-based tokens.
     * @param {AccumulationSeries} series - The accumulation chart series used to resolve series-based tokens.
     * @param {string[]} pointKeys - The available point property keys.
     * @param {string[]} seriesKeys - The available series property keys.
     * @returns {string} - Returns the tooltip template string with supported tokens resolved.
     * @private
     */
    private resolveTooltipTokens(
        input: string,
        point: AccPoints,
        series: AccumulationSeries,
        pointKeys: string[],
        seriesKeys: string[]
    ): string {
        return input.replace(
            /\$\{([^{}]+)\}/g,
            this.replaceTooltipToken.bind(this, point, series, pointKeys, seriesKeys)
        );
    }

    /**
     * Replaces a single tooltip token with the corresponding point or series value.
     *
     * @param {AccPoints} point - The accumulation chart point used to resolve point-based tokens.
     * @param {AccumulationSeries} series - The accumulation chart series used to resolve series-based tokens.
     * @param {string[]} pointKeys - The available point property keys.
     * @param {string[]} seriesKeys - The available series property keys.
     * @param {string} match - The complete matched tooltip token text.
     * @param {string} token - The token content inside the tooltip expression.
     * @returns {string} - Returns the resolved tooltip token value, or the original token text when it cannot be resolved.
     * @private
     */
    private replaceTooltipToken(
        point: AccPoints,
        series: AccumulationSeries,
        pointKeys: string[],
        seriesKeys: string[],
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
        // Format can contain whitespace, for example: ${point.x:MMM dd}
        if (rawPath !== rawPath.trim() || /\s/.test(rawPath)) {
            return match;
        }

        const path: string = rawPath;
        let rawValue: any;
        let fallbackText: string = '';

        // ${point.data.<field>} — resolve against the point's underlying
        // datasource record (supports nested field paths and :format suffix).
        if (path.indexOf('point.data.') === 0 && path.length > 'point.data.'.length) {
            const fieldPath: string = path.slice('point.data.'.length);
            const rawRecord: Object = point.rawdata != null ? point.rawdata : this.getSeriesRawRecord(point, series);
            if (rawRecord == null) {
                return match;
            }
            const fieldValue: any = getValue(fieldPath, rawRecord);
            if (isNullOrUndefined(fieldValue)) {
                return match;
            }
            if (typeof fieldValue === 'number' && (isNaN(fieldValue) || !isFinite(fieldValue))) {
                return isNaN(fieldValue) ? 'NaN' : fieldValue < 0 ? '-Infinity' : 'Infinity';
            }
            if (colonIndex === -1 || inlineFormat === '') {
                return String(fieldValue);
            }
            return this.getFormattedTooltipValue(
                fieldValue, inlineFormat, String(fieldValue), this.accumulation.intl,
                this.accumulation.useGroupingSeparator
            );
        }

        if (path.indexOf('point.') === 0) {
            const key: string = path.slice(6);

            // Path does not exist, so keep original token text.
            if (pointKeys.indexOf(key) === -1) {
                return match;
            }

            rawValue = point[key as string];

            if (isNullOrUndefined(rawValue)) {
                return String(rawValue);
            }

            if (typeof rawValue === 'number' && (isNaN(rawValue) || !isFinite(rawValue))) {
                return isNaN(rawValue) ? 'NaN' : rawValue < 0 ? '-Infinity' : 'Infinity';
            }

            fallbackText = this.getPointRawText(key, rawValue);
        } else if (path.indexOf('series.') === 0) {
            const key: string = path.slice(7);

            // Path does not exist, so keep original token text.
            if (seriesKeys.indexOf(key) === -1) {
                return match;
            }

            rawValue = series[key as string];

            if (isNullOrUndefined(rawValue)) {
                return String(rawValue);
            }

            fallbackText = String(rawValue);
        } else {
            return match;
        }

        // No inline format, so return the normal template value directly.
        if (colonIndex === -1 || inlineFormat === '') {
            return fallbackText;
        }

        return this.getFormattedTooltipValue(
            rawValue,
            inlineFormat,
            fallbackText,
            this.accumulation.intl,
            this.accumulation.useGroupingSeparator
        );
    }

    /**
     * Gets the raw tooltip text for the specified point value.
     *
     * @param {string} key - The point property key.
     * @param {any} rawValue - The raw point value.
     * @returns {string} - Returns the raw point value as tooltip text.
     * @private
     */
    private getPointRawText(
        key: string,
        rawValue: any
    ): string {
        if (
            key === 'x' &&
            this.accumulation.useGroupingSeparator &&
            typeof rawValue === 'number'
        ) {
            return this.accumulation.intl.formatNumber(rawValue, { useGrouping: true });
        }

        return String(rawValue);
    }
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'AccumulationTooltip';
    }
    /**
     * To destroy the Tooltip.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        /**
         * Destroy method calling here
         */
    }
}
