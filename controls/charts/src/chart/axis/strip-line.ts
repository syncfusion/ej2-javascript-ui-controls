/**
 * StripLine src
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart } from '../chart';
import { Axis } from '../axis/axis';
import { StripLineSettingsModel } from '../model/chart-base-model';
import {
    valueToCoefficient, textElement, RectOption,
    appendChildElement, appendClipElement, withIn, getElement, ImageOption, logBase
} from '../../common/utils/helper';
import { Size, measureText, TextOption, PathOption, Rect, SvgRenderer } from '@syncfusion/ej2-svg-base';
import { ZIndex, Anchor, SizeType } from '../utils/enum';
import { DataUtil } from '@syncfusion/ej2-data';
/**
 * The `StripLine` module is used to render strip lines in charts.
 */
export class StripLine {
    /**
     * Finding x, y, width and height of the strip line
     *
     * @param {Axis} axis axis
     * @param {StripLineSettingsModel} stripline stripline
     * @param {Rect} seriesClipRect seriesClipRect
     * @param {number} startValue startValue
     * @param {Axis} segmentAxis segmentAxis
     * @param {Chart} chart chart instance
     * @returns {Rect} rect
     */
    private measureStripLine(
        axis: Axis, stripline: StripLineSettingsModel, seriesClipRect: Rect, startValue: number, segmentAxis: Axis, chart: Chart
    ): Rect {
        let actualStart: number; let actualEnd: number;
        const orientation: string = axis.orientation;
        const isDateTimeAxis: boolean = axis.valueType === 'DateTime';
        if (stripline.isRepeat && stripline.size !== null) {
            actualStart = startValue;
            actualEnd = null;
        } else {
            if (axis.valueType === 'DateTimeCategory') {
                const start: Date | number | Object = stripline.start;
                const end: Date | number | Object = stripline.end;
                actualStart = (start != null && typeof start !== 'number') ?
                    axis.labels.indexOf(this.dateToMilliSeconds(start, chart).toString()) : start as number;
                actualEnd = (end != null && typeof end !== 'number') ?
                    axis.labels.indexOf(this.dateToMilliSeconds(end, chart).toString()) : end as number;
            } else {
                actualStart = stripline.start === null ? null : isDateTimeAxis && this.isCoreDate(stripline.start) ?
                    this.dateToMilliSeconds(stripline.start, chart) : +(axis.valueType === 'Logarithmic' ? logBase(stripline.start as number, axis.logBase) : stripline.start);
                actualEnd = stripline.end === null ? null : isDateTimeAxis && this.isCoreDate(stripline.start) ?
                    this.dateToMilliSeconds(stripline.end, chart) : +(axis.valueType === 'Logarithmic' ? logBase(stripline.end as number, axis.logBase) : stripline.end);
            }
        }
        const rect: { from: number, to: number } = this.getFromTovalue(
            actualStart, actualEnd, stripline.size, stripline.startFromAxis,
            axis, stripline
        );
        let height: number = (orientation === 'Vertical') ? (rect.to - rect.from) * axis.rect.height : seriesClipRect.height;
        let width: number = (orientation === 'Horizontal') ? (rect.to - rect.from) * axis.rect.width : seriesClipRect.width;
        let x: number = (orientation === 'Vertical') ? seriesClipRect.x : ((rect.from * axis.rect.width) + axis.rect.x);
        let y: number = (orientation === 'Horizontal') ? seriesClipRect.y : (axis.rect.y + axis.rect.height -
            ((stripline.sizeType === 'Pixel' ? rect.from : rect.to) * axis.rect.height));
        if (stripline.isSegmented && stripline.segmentStart != null && stripline.segmentEnd != null && stripline.sizeType !== 'Pixel') {
            const start: number = isDateTimeAxis && this.isCoreDate(stripline.segmentStart) ?
                this.dateToMilliSeconds(stripline.segmentStart, chart) : +stripline.segmentStart;
            const end: number = isDateTimeAxis && this.isCoreDate(stripline.segmentEnd) ?
                this.dateToMilliSeconds(stripline.segmentEnd, chart) : +stripline.segmentEnd;
            const segRect: { from: number, to: number } = this.getFromTovalue(start, end, null, null, segmentAxis, stripline);
            if (segmentAxis.orientation === 'Vertical') {
                y = (segmentAxis.rect.y + segmentAxis.rect.height -
                    (segRect.to * segmentAxis.rect.height));
                height = (segRect.to - segRect.from) * segmentAxis.rect.height;
            } else {
                x = ((segRect.from * segmentAxis.rect.width) + segmentAxis.rect.x);
                width = (segRect.to - segRect.from) * segmentAxis.rect.width;
            }
        }
        if ((height !== 0 && width !== 0) || (stripline.sizeType === 'Pixel' && (stripline.start !== null || stripline.startFromAxis))) {
            return new Rect(x, y, width, height);
        }
        return new Rect(0, 0, 0, 0);
    }
    /**
     * Retrieves the 'from' and 'to' values from start, end, size, starting from the axis.
     *
     * @param {number} start - The start value.
     * @param {number} end - The end value.
     * @param {number} size - The size value.
     * @param {boolean} startFromAxis - Indicates whether to start from the axis.
     * @param {Axis} axis - The axis.
     * @param {StripLineSettingsModel} stripline - The strip line settings.
     * @returns {{ from: number, to: number }} - The 'from' and 'to' values.
     * @private
     */
    private getFromTovalue(
        start: number, end: number, size: number, startFromAxis: boolean, axis: Axis,
        stripline: StripLineSettingsModel): { from: number, to: number } {
        let from: number = (!stripline.isRepeat && startFromAxis) ? axis.visibleRange.min : start;
        if (axis.valueType === 'Double' && size !== null && !startFromAxis && stripline.start == null) { from += size; }
        let to: number = this.getToValue(Math.max(start, isNullOrUndefined(end) ? start : end), from, size, axis, end, stripline);
        from = this.findValue(from, axis); to = this.findValue(to, axis);
        return { from: valueToCoefficient(axis.isAxisInverse ? to : from, axis),
            to: valueToCoefficient(axis.isAxisInverse ? from : to, axis) };
    }
    /**
     * Finding end value of the strip line
     *
     * @param {number} to to
     * @param {number} from from
     * @param {number} size size
     * @param {Axis} axis axis
     * @param {number} end end
     * @param {StripLineSettingsModel} stripline stripline
     * @returns {number} number
     */
    private getToValue(
        to: number, from: number, size: number, axis: Axis, end: number, stripline: StripLineSettingsModel
    ): number {
        let sizeType: SizeType = stripline.sizeType;
        const isEnd: boolean = (end === null);
        if (axis.valueType === 'DateTime') {
            const fromValue: Date = new Date(from);
            if (sizeType === 'Auto') {
                sizeType = axis.actualIntervalType;
                size *= axis.visibleRange.interval;
            }
            switch (sizeType) {
            case 'Years':
                return <number>(isEnd ? new Date(fromValue.setFullYear(fromValue.getFullYear() + size)) : to);
            case 'Months':
                return <number>(isEnd ? new Date(fromValue.setMonth(fromValue.getMonth() + size)) : to);
            case 'Days':
                return <number>(isEnd ? new Date(fromValue.setDate(fromValue.getDate() + size)) : to);
            case 'Hours':
                return <number>(isEnd ? new Date(fromValue.setHours(fromValue.getHours() + size)) : to);
            case 'Minutes':
                return <number>(isEnd ? new Date(fromValue.setMinutes(fromValue.getMinutes() + size)) : to);
            case 'Seconds':
                return <number>(isEnd ? new Date(fromValue.setSeconds(fromValue.getSeconds() + size)) : to);
            default:
                return from;
            }
        } else {
            return stripline.sizeType === 'Pixel' ? from : (isEnd ? (from + size) : to);
        }
    }
    /**
     * To check the strip line values within range
     *
     * @param {number} value value
     * @param {Axis} axis axis
     * @returns {number} - To returns a strip line value.
     */
    private findValue(value: number, axis: Axis): number {
        if (value < axis.visibleRange.min) {
            value = axis.visibleRange.min;
        } else if (value > axis.visibleRange.max) {
            value = axis.visibleRange.max;
        }
        return value;
    }
    /**
     * Date parse
     *
     * @param {Date} value date
     * @param {Chart} chart chart instance
     * @returns {Date} parsed date
     */
    private dateParse(value: Date | Object, chart: Chart): Date {
        const dateParser: Function = chart.intl.getDateParser({ skeleton: 'full', type: 'dateTime' });
        const dateFormatter: Function = chart.intl.getDateFormat({ skeleton: 'full', type: 'dateTime' });
        return new Date((Date.parse(dateParser(dateFormatter(new Date(DataUtil.parse.parseJson({ val: value }).val))))));
    }
    /**
     * To render strip lines based start and end.
     *
     * @param {Chart} chart chart
     * @param {ZIndex} position position
     * @param {Axis[]} axes axes
     * @returns {void}
     * @private
     */
    public renderStripLine(chart: Chart, position: ZIndex, axes: Axis[]): void {
        const id: string = chart.element.id + '_stripline_' + position + '_';
        const seriesClipRect: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        let end: number = 0;
        let limit: number = 0; let startValue: number = 0;
        let segmentAxis: Axis = null; let range: boolean;
        const options: RectOption = new RectOption(
            id + 'ClipRect', 'transparent', { width: 1, color: 'Gray' }, 1,
            {
                x: seriesClipRect.x, y: seriesClipRect.y,
                width: seriesClipRect.width,
                height: seriesClipRect.height
            }
        );
        const striplineGroup: Element = chart.renderer.createGroup({
            id: id + 'collections',
            'clip-path': 'url(#' + id + 'ClipRect' + ')'
        });
        if (!chart.enableCanvas) {
            striplineGroup.appendChild(appendClipElement(chart.redraw, options, chart.renderer as SvgRenderer));
        }
        for (const axis of axes) {
            let count: number = 0;
            for (const stripline of axis.stripLines) {
                if (stripline.visible && stripline.zIndex === position) {
                    if (stripline.isSegmented && stripline.segmentStart != null && stripline.segmentEnd != null &&
                        stripline.sizeType !== 'Pixel') {
                        segmentAxis = this.getSegmentAxis(axes, axis, stripline);
                    }
                    if (stripline.isRepeat && stripline.repeatEvery != null && stripline.size !== null && stripline.sizeType !== 'Pixel') {
                        limit = (stripline.repeatUntil != null) ? ((axis.valueType === 'DateTime') ?
                            this.dateToMilliSeconds(stripline.repeatUntil, chart) : +stripline.repeatUntil) : axis.actualRange.max;
                        startValue = axis.valueType === 'DateTime' && this.isCoreDate(stripline.start) ?
                            this.dateToMilliSeconds(stripline.start, chart) : stripline.start as number;
                        if ((stripline.startFromAxis && axis.valueType === 'DateTime' && stripline.sizeType === 'Auto') ||
                        (stripline.start < axis.visibleRange.min)) {
                            startValue = axis.visibleLabels[0] &&
                                axis.visibleLabels[0].value === axis.visibleRange.min ? axis.visibleRange.min :
                                axis.visibleLabels[0] && axis.visibleLabels[0].value - (axis.valueType === 'DateTime' ? axis.dateTimeInterval :
                                    axis.visibleRange.interval);
                        }
                        startValue = stripline.startFromAxis && axis.valueType !== 'DateTime' ? axis.visibleRange.min : startValue;
                        while (startValue < limit) {
                            end = (startValue + (axis.valueType === 'DateTime' ? axis.dateTimeInterval * +stripline.size : stripline.size));
                            range = withIn(end, axis.visibleRange);
                            if ((startValue >= axis.visibleRange.min && startValue < axis.visibleRange.max) || range) {
                                this.renderStripLineElement(
                                    axis, stripline, seriesClipRect, id, striplineGroup, chart, startValue, segmentAxis, count
                                );
                            }
                            count++;
                            startValue = this.getStartValue(axis, stripline, startValue);
                        }
                    } else {
                        this.renderStripLineElement(
                            axis, stripline, seriesClipRect, id, striplineGroup, chart, null, segmentAxis, count
                        );
                        count++;
                    }
                }
            }
        }
        appendChildElement(chart.enableCanvas, chart.svgObject, striplineGroup, chart.redraw);
    }
    /**
     * To convert the C# date to js date
     *
     * @param {string | number | Object} value date value
     * @returns {boolean} returns true if datetime value type is string(for asp platform)
     */
    private isCoreDate(value: string | number | Object | Date): boolean {
        return typeof value === 'string' ? true : false;
    }
    /**
     * To get the total milli seconds
     *
     * @param {Date | number | Object} value date value
     * @param {Chart} chart chart instance
     * @returns {number} returns milliseconds
     */
    private dateToMilliSeconds(value: Date | number | Object, chart: Chart): number {
        return this.dateParse(value, chart).getTime();
    }
    /**
     * To draw the single line strip line
     *
     * @param {StripLineSettingsModel} stripline stripline
     * @param {Rect} rect rect
     * @param {string} id id
     * @param {Element} parent parent
     * @param {Chart} chart chart
     * @param {Axis} axis axis
     * @returns {void}
     */
    private renderPath(
        stripline: StripLineSettingsModel, rect: Rect, id: string, parent: Element, chart: Chart, axis: Axis
    ): void {
        const element: Element = getElement(id);
        const direction: string = element ? element.getAttribute('d') : '';
        let strokeWidth: number = stripline.size;
        let d: string = (axis.orientation === 'Vertical') ? ('M ' + rect.x + ' ' + rect.y + ' ' + 'L ' + (rect.x + rect.width)
            + ' ' + rect.y) :
            ('M ' + rect.x + ' ' + rect.y + ' ' + 'L ' + rect.x + ' ' + (rect.y + rect.height));

        if (stripline.sizeType !== 'Pixel') {
            d = (axis.orientation === 'Vertical') ? ('M ' + rect.x + ' ' + (rect.y + (rect.height / 2)) + ' ' + 'L ' + (rect.x + rect.width)
                + ' ' + (rect.y + (rect.height / 2))) :
                ('M ' + (rect.x + (rect.width / 2)) + ' ' + rect.y + ' ' + 'L ' + (rect.x + (rect.width / 2)) + ' ' + (rect.y + rect.height));
            strokeWidth = axis.orientation === 'Vertical' ? rect.height : rect.width;
        }
        appendChildElement(
            chart.enableCanvas, parent, chart.renderer.drawPath(
                new PathOption(
                    id, 'none', strokeWidth, stripline.color, stripline.opacity, stripline.dashArray, d
                )
            ),
            chart.redraw, true, 'x', 'y', null, direction, true, null, null, chart.duration
        );
    }
    /**
     * To draw the rectangle
     *
     * @param {StripLineSettingsModel} stripline stripline
     * @param {Rect} rect rect
     * @param {string} id id
     * @param {Element} parent parent
     * @param {Chart} chart chart
     * @returns {void}
     */
    private renderRectangle(
        stripline: StripLineSettingsModel, rect: Rect, id: string, parent: Element, chart: Chart
    ): void {
        const element: Element = getElement(id);
        const previousRect: Rect = element ? new Rect(
            +element.getAttribute('x'), +element.getAttribute('y'),
            +element.getAttribute('width'), +element.getAttribute('height')
        ) : null;
        appendChildElement(
            chart.enableCanvas, parent, chart.renderer.drawRectangle(
                new RectOption(
                    id, 'none', stripline.border, stripline.opacity,
                    rect, 0, 0, '', stripline.border.dashArray
                )
            ),
            chart.redraw, true, 'x', 'y', null, null, true, true, previousRect, chart.duration
        );
    }

    /**
     * To draw the Image
     *
     * @param {StripLineSettingsModel} stripline stripline
     * @param {Rect} rect rect
     * @param {string} id id
     * @param {Element} parent parent
     * @param {Chart} chart chart
     * @returns {void}
     */
    private drawImage(stripline: StripLineSettingsModel, rect: Rect, id: string, parent: Element, chart: Chart): void {
        if (stripline.sizeType === 'Pixel') {
            rect.width = rect.width ? rect.width : stripline.size;
            rect.height = rect.height ? rect.height : stripline.size;
        }
        const image: ImageOption = new ImageOption(rect.height, rect.width, stripline.imageUrl, rect.x, rect.y, id, 'visible', 'none');
        const htmlObject: HTMLElement = chart.renderer.drawImage(image) as HTMLElement;
        appendChildElement(chart.enableCanvas, parent, htmlObject, chart.redraw, true, 'x', 'y', null, null, true, true);
    }

    /**
     * To create the text on strip line
     *
     * @param {StripLineSettingsModel} stripline stripline
     * @param {Rect} rect rect
     * @param {string} id id
     * @param {Element} parent parent
     * @param {Chart} chart chart
     * @param {Axis} axis axis
     * @returns {void}
     */
    private renderText(
        stripline: StripLineSettingsModel, rect: Rect, id: string, parent: Element, chart: Chart, axis: Axis
    ): void {
        const textSize: Size = measureText(stripline.text, stripline.textStyle, chart.themeStyle.stripLineLabelFont);
        const isRotationNull: boolean = (stripline.rotation === null);
        const textMid: number = 3 * (textSize.height / 8);
        const rectMid: number = (textSize.height / 4);
        let ty: number = rect.y + (rect.height / 2) + rectMid;
        const rotation: number = isRotationNull ? ((axis.orientation === 'Vertical') ? 0 : -90) : stripline.rotation;
        let tx: number = rect.x + (rect.width / 2);
        let anchor: Anchor;
        const padding: number = 5;
        if (axis.orientation === 'Horizontal') {
            tx = this.getTextStart(
                tx + (textMid * this.factor(stripline.horizontalAlignment)),
                rect.width, stripline.horizontalAlignment
            );
            ty = this.getTextStart(ty - textMid, rect.height, stripline.verticalAlignment) +
                (stripline.verticalAlignment === 'Start' && !isRotationNull ? (textSize.height / 4) : 0);
            anchor = isRotationNull ? this.invertAlignment(stripline.verticalAlignment) : stripline.horizontalAlignment;
            const isVertical: boolean = Math.abs(stripline.rotation) === 90 || Math.abs(stripline.rotation) === 270;
            const halfSize: number = isVertical ? textSize.height / 2 : textSize.width / 2;
            anchor = (tx - halfSize < axis.rect.x) ? 'Start' :
                (tx + halfSize > axis.rect.x + axis.rect.width) ? 'End' : anchor;
        } else {
            tx = this.getTextStart(tx, rect.width, stripline.horizontalAlignment);
            ty = this.getTextStart(
                ty + (textMid * this.factor(stripline.verticalAlignment)) - padding,
                rect.height, stripline.verticalAlignment
            );
            anchor = stripline.horizontalAlignment;
            anchor = chart.enableRtl ? (anchor === 'End' ? 'Start' : anchor === 'Start' ? 'End' : anchor) : anchor;
        }
        textElement(
            chart.renderer,
            new TextOption(id, tx, ty, anchor, stripline.text, 'rotate(' + rotation + ' ' + tx + ',' + ty + ')', 'middle'),
            stripline.textStyle, stripline.textStyle.color || chart.themeStyle.stripLineLabelFont.color, parent,
            null, null, null, null, null, null, null, null, chart.enableCanvas, null, chart.themeStyle.stripLineLabelFont
        );
    }
    private invertAlignment(anchor: Anchor): Anchor {
        switch (anchor) {
        case 'Start':
            anchor = 'End';
            break;
        case 'End':
            anchor = 'Start';
            break;
        }
        return anchor;
    }
    /**
     * To find the next value of the recurrence strip line
     *
     * @param {Axis} axis axis
     * @param {StripLineSettingsModel} stripline stripline
     * @param {number} startValue startValue
     * @returns {number} next start value of the recurrence strip line
     */
    private getStartValue(axis: Axis, stripline: StripLineSettingsModel, startValue: number): number {
        if (axis.valueType === 'DateTime') {
            return (this.getToValue(
                null, startValue,
                +stripline.repeatEvery,
                axis, null, stripline
            ));
        } else {
            return startValue + (+stripline.repeatEvery);
        }
    }
    /**
     * Finds the segment axis for a segmented strip line.
     *
     * @param {Axis[]} axes - The collection of axes.
     * @param {Axis} axis - The axis.
     * @param {StripLineSettingsModel} stripline - The strip line settings.
     * @returns {Axis} - The segment axis.
     * @private
     */
    private getSegmentAxis(axes: Axis[], axis: Axis, stripline: StripLineSettingsModel): Axis {
        let segment: Axis;
        if (stripline.segmentAxisName == null) {
            return (axis.orientation === 'Horizontal') ? axes[1] : axes[0];

        } else {
            for (let i: number = 0; i < axes.length; i++) {
                if (stripline.segmentAxisName === axes[i as number].name) {
                    segment = axes[i as number];
                }
            }
            return segment;
        }
    }
    /**
     * To render strip line on chart
     *
     * @param {Axis} axis axis
     * @param {StripLineSettingsModel} stripline stripline
     * @param {Rect} seriesClipRect seriesClipRect
     * @param {string} id id
     * @param {Element} striplineGroup striplineGroup
     * @param {Chart} chart chart
     * @param {number} startValue startValue
     * @param {Axis} segmentAxis segmentAxis
     * @param {number} count count
     * @returns {void}
     */
    private renderStripLineElement(
        axis: Axis, stripline: StripLineSettingsModel, seriesClipRect: Rect, id: string, striplineGroup: Element, chart: Chart,
        startValue: number, segmentAxis: Axis, count: number
    ): void {
        const rect: Rect = this.measureStripLine(axis, stripline, seriesClipRect, startValue, segmentAxis, chart);
        if (stripline.imageUrl) {
            this.drawImage(stripline, rect, id + 'rect_' + axis.name + '_' + count, striplineGroup, chart);
        } else {
            this.renderPath(stripline, rect, id + (stripline.sizeType === 'Pixel' ? 'path_' : 'rect_') + axis.name + '_' + count, striplineGroup, chart, axis);
            const pixelRect: Rect = new Rect(axis.orientation === 'Horizontal' ? (rect.x - stripline.size / 2) : rect.x, axis.orientation === 'Vertical' ? (rect.y - stripline.size / 2) : rect.y,
                                             rect.width ? rect.width : stripline.size, rect.height ? rect.height : stripline.size);
            this.renderRectangle(stripline, stripline.sizeType === 'Pixel' ? pixelRect : rect, id + 'border_' + axis.name + '_' + count, striplineGroup, chart);
        }
        if (stripline.text !== '') {
            this.renderText(stripline, rect, id + 'text_' + axis.name + '_' + count, striplineGroup, chart, axis);
        }
    }
    /**
     * Finds the factor of the text based on its anchor position.
     *
     * @param {Anchor} anchor - The text anchor position.
     * @returns {number} - The factor.
     * @private
     */
    private factor(anchor: Anchor): number {
        let factor: number = 0;
        switch (anchor) {
        case 'Start':
            factor = 1;
            break;
        case 'End':
            factor = -1;
            break;
        }
        return factor;
    }
    /**
     * Finds the start value of the text based on its alignment.
     *
     * @param {number} xy - The coordinate value.
     * @param {number} size - The size of the text.
     * @param {Anchor} textAlignment - The text alignment.
     * @returns {number} - The start value.
     * @private
     */
    private getTextStart(xy: number, size: number, textAlignment: Anchor): number {
        const padding: number = 5;
        switch (textAlignment) {
        case 'Start':
            xy = xy - (size / 2) + padding;
            break;
        case 'End':
            xy = xy + (size / 2) - padding;
            break;
        }
        return xy;
    }
    /**
     * To get the module name for `StripLine`.
     *
     * @private
     * @returns {string} - Returns the module name.
     */
    public getModuleName(): string {
        return 'StripLine';
    }
    /**
     * To destroy the `StripLine` module.
     *
     * @returns {void}
     */
    public destroy(): void {
        // destroy peform here
    }
}
