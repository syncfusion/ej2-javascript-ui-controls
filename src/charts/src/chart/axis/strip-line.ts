/**
 * StripLine src
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart } from '../chart';
import { Axis } from '../axis/axis';
import { StripLineSettingsModel } from '../model/chart-base-model';
import {
    Rect, TextOption, measureText, valueToCoefficient, textElement, RectOption,
    Size, PathOption, appendChildElement, appendClipElement, withIn
} from '../../common/utils/helper';
import { ZIndex, Anchor, sizeType } from '../utils/enum';
/**
 * `StripLine` module is used to render the stripLine in chart.
 */
export class StripLine {
    /**
     * Finding x, y, width and height of the strip line
     * @param axis
     * @param strip line
     * @param seriesClipRect
     * @param startValue
     * @param segmentAxis
     */
    private measureStripLine(
        axis: Axis, stripline: StripLineSettingsModel, seriesClipRect: Rect, startValue: number, segmentAxis: Axis
    ): Rect {
        let actualStart: number; let actualEnd: number;
        let orientation: string = axis.orientation;
        if (stripline.isRepeat && stripline.size !== null) {
            actualStart = startValue;
            actualEnd = null;
        } else {
            if (axis.valueType === 'DateTimeCategory') {
                let start: Date | number = stripline.start;
                let end: Date | number = stripline.end;
                actualStart = (start != null && typeof start !== 'number') ? axis.labels.indexOf((start).getTime().toString()) :
                    start as number;
                actualEnd = (end != null && typeof end !== 'number') ? axis.labels.indexOf((end).getTime().toString()) : end as number;
            } else {
                actualStart = stripline.start === null ? null : +stripline.start;
                actualEnd = stripline.end === null ? null : +stripline.end;
            }
        }
        let rect: { from: number, to: number } = this.getFromTovalue(
            actualStart, actualEnd, stripline.size, stripline.startFromAxis,
            axis, stripline
        );
        let height: number = (orientation === 'Vertical') ? (rect.to - rect.from) * axis.rect.height : seriesClipRect.height;
        let width: number = (orientation === 'Horizontal') ? (rect.to - rect.from) * axis.rect.width : seriesClipRect.width;
        let x: number = (orientation === 'Vertical') ? seriesClipRect.x : ((rect.from * axis.rect.width) + axis.rect.x);
        let y: number = (orientation === 'Horizontal') ? seriesClipRect.y : (axis.rect.y + axis.rect.height -
            ((stripline.sizeType === 'Pixel' ? rect.from : rect.to) * axis.rect.height));
        if (stripline.isSegmented && stripline.segmentStart != null && stripline.segmentEnd != null && stripline.sizeType !== 'Pixel') {
            let segRect: { from: number, to: number } = this.getFromTovalue(
                +stripline.segmentStart, +stripline.segmentEnd, null, null, segmentAxis, stripline);
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
     * To get from to value from start, end, size, start from axis
     * @param start
     * @param end
     * @param size
     * @param startFromAxis
     * @param axis
     * @param strip line
     */
    private getFromTovalue(
        start: number, end: number, size: number, startFromAxis: boolean, axis: Axis,
        stripline: StripLineSettingsModel): { from: number, to: number } {
        let from: number = (!stripline.isRepeat && startFromAxis) ? axis.visibleRange.min : start;
        let to: number = this.getToValue(Math.max(start, isNullOrUndefined(end) ? start : end), from, size, axis, end, stripline);
        from = this.findValue(from, axis); to = this.findValue(to, axis);
        return { from: valueToCoefficient(axis.isInversed ? to : from, axis), to: valueToCoefficient(axis.isInversed ? from : to, axis) };
    }
    /**
     * Finding end value of the strip line
     * @param to
     * @param from
     * @param size
     * @param axis
     * @param end
     * @param strip line
     */
    private getToValue(
        to: number, from: number, size: number, axis: Axis, end: number, stripline: StripLineSettingsModel
    ): number {
        let sizeType: sizeType = stripline.sizeType;
        let isEnd: boolean = (end === null);
        if (axis.valueType === 'DateTime') {
            let fromValue: Date = new Date(from);
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
     * @param value
     * @param axis
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
     * To render strip lines based start and end.
     * @private
     * @param chart
     * @param position
     * @param axes
     */
    public renderStripLine(chart: Chart, position: ZIndex, axes: Axis[]): void {
        let id: string = chart.element.id + '_stripline_' + position + '_';
        let seriesClipRect: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        let count: number = 0; let end: number = 0;
        let limit: number = 0; let startValue: number = 0;
        let segmentAxis: Axis = null; let range: boolean;
        let options: RectOption = new RectOption(
            id + 'ClipRect', 'transparent', { width: 1, color: 'Gray' }, 1,
            {
                x: chart.initialClipRect.x, y: chart.initialClipRect.y,
                width: chart.initialClipRect.width,
                height: chart.initialClipRect.height
            }
        );
        let striplineGroup: Element = chart.renderer.createGroup({
            id: id + 'collections',
            'clip-path': 'url(#' + id + 'ClipRect' + ')'
        });
        striplineGroup.appendChild(
            appendClipElement(chart.redraw, options, chart.renderer)
        );
        for (let axis of axes) {
            for (let stripline of axis.stripLines) {
                if (stripline.visible && stripline.zIndex === position) {
                    if (stripline.isSegmented && stripline.segmentStart != null && stripline.segmentEnd != null &&
                        stripline.sizeType !== 'Pixel') {
                        segmentAxis = this.getSegmentAxis(axes, axis, stripline);
                    }
                    if (stripline.isRepeat && stripline.repeatEvery != null && stripline.size !== null && stripline.sizeType !== 'Pixel') {
                        limit = (stripline.repeatUntil != null) ? ((axis.valueType === 'DateTime') ?
                            (stripline.repeatUntil as Date).getTime() : +stripline.repeatUntil) : axis.actualRange.max;
                        startValue = stripline.start as number;
                        if ((stripline.startFromAxis && axis.valueType === 'DateTime' && stripline.sizeType === 'Auto') ||
                        (stripline.start < axis.visibleRange.min)) {
                            startValue = axis.visibleLabels[0].value === axis.visibleRange.min ? axis.visibleRange.min :
                                axis.visibleLabels[0].value - (axis.valueType === 'DateTime' ? axis.dateTimeInterval :
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
        appendChildElement(chart.svgObject, striplineGroup, chart.redraw);
    }
    /**
     * To draw the single line strip line
     * @param strip line
     * @param rect
     * @param id
     * @param parent
     * @param chart
     * @param axis
     */
    private renderPath(
        stripline: StripLineSettingsModel, rect: Rect, id: string, parent: Element, chart: Chart, axis: Axis
    ): void {

        let d: string = (axis.orientation === 'Vertical') ? ('M' + rect.x + ' ' + rect.y + ' ' + 'L' + (rect.x + rect.width)
            + ' ' + rect.y) :
            ('M' + rect.x + ' ' + rect.y + ' ' + 'L' + rect.x + ' ' + (rect.y + rect.height));
        parent.appendChild(chart.renderer.drawPath(
            new PathOption(
                id, '', stripline.size, stripline.color, stripline.opacity, stripline.dashArray, d
            )
        ));
    };
    /**
     * To draw the rectangle
     * @param strip line
     * @param rect
     * @param id
     * @param parent
     * @param chart
     */
    private renderRectangle(
        stripline: StripLineSettingsModel, rect: Rect, id: string, parent: Element, chart: Chart
    ): void {
        parent.appendChild(chart.renderer.drawRectangle(
            new RectOption(id, stripline.color, stripline.border, stripline.opacity, rect, 0, 0, '', stripline.dashArray)
        ));
    }
    /**
     * To create the text on strip line
     * @param strip line
     * @param rect
     * @param id
     * @param parent
     * @param chart
     * @param axis
     */
    private renderText(
        stripline: StripLineSettingsModel, rect: Rect, id: string, parent: Element, chart: Chart, axis: Axis
    ): void {
        let textSize: Size = measureText(stripline.text, stripline.textStyle);
        let textMid: number = 3 * (textSize.height / 8);
        let ty: number = rect.y + (rect.height / 2) + textMid;
        let rotation: number = (stripline.rotation === null) ? ((axis.orientation === 'Vertical') ? 0 : -90) : stripline.rotation;
        let tx: number = rect.x + (rect.width / 2);
        let anchor: Anchor;
        let padding: number = 5;
        if (axis.orientation === 'Horizontal') {
            tx = this.getTextStart(
                tx + (textMid * this.factor(stripline.horizontalAlignment)),
                rect.width, stripline.horizontalAlignment
            );
            ty = this.getTextStart(ty - textMid, rect.height, stripline.verticalAlignment);
            anchor = stripline.horizontalAlignment;
        } else {
            tx = this.getTextStart(tx, rect.width, stripline.horizontalAlignment);
            ty = this.getTextStart(
                ty + (textMid * this.factor(stripline.verticalAlignment)) - padding,
                rect.height, stripline.verticalAlignment
            );
            anchor = stripline.verticalAlignment;
        }
        textElement(
            new TextOption(id, tx, ty, anchor, stripline.text, 'rotate(' + rotation + ' ' + tx + ',' + ty + ')', 'middle'),
            stripline.textStyle, stripline.textStyle.color, parent);
    }
    /**
     * To find the next value of the recurrence strip line
     * @param axis
     * @param stripline
     * @param startValue
     */
    private getStartValue(axis: Axis, stripline: StripLineSettingsModel, startValue: number): number {
        if (axis.valueType === 'DateTime') {
            return this.getToValue(null, startValue, +stripline.repeatEvery, axis, null, stripline);

        } else {
            return startValue + (+stripline.repeatEvery);

        }
    }
    /**
     * Finding segment axis for segmented strip line
     * @param axes
     * @param axis
     * @param strip line
     */
    private getSegmentAxis(axes: Axis[], axis: Axis, stripline: StripLineSettingsModel): Axis {
        let segment: Axis;
        if (stripline.segmentAxisName == null) {
            return (axis.orientation === 'Horizontal') ? axes[1] : axes[0];

        } else {
            for (let i: number = 0; i < axes.length; i++) {
                if (stripline.segmentAxisName === axes[i].name) {
                    segment = axes[i];
                }
            }
            return segment;
        }
    }
    /**
     * To render strip line on chart
     * @param axis
     * @param stripline
     * @param seriesClipRect
     * @param id
     * @param striplineGroup
     * @param chart
     * @param startValue
     * @param segmentAxis
     * @param count
     */
    private renderStripLineElement(
        axis: Axis, stripline: StripLineSettingsModel, seriesClipRect: Rect, id: string, striplineGroup: Element, chart: Chart,
        startValue: number, segmentAxis: Axis, count: number
    ): void {
        let rect: Rect = this.measureStripLine(axis, stripline, seriesClipRect, startValue, segmentAxis);
        if (stripline.sizeType === 'Pixel') {
            this.renderPath(stripline, rect, id + 'path_' + count, striplineGroup, chart, axis);
        } else {
            if (rect.height !== 0 && rect.width !== 0) {
                this.renderRectangle(stripline, rect, id + 'rect_' + count, striplineGroup, chart);
            }
        }
        if (stripline.text !== '') {
            this.renderText(stripline, rect, id + 'text_' + count, striplineGroup, chart, axis);
        }
    }
    /**
     * To find the factor of the text
     * @param anchor
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
     * To find the start value of the text
     * @param xy
     * @param size
     * @param textAlignment
     */
    private getTextStart(xy: number, size: number, textAlignment: Anchor): number {
        let padding: number = 5;
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
     */
    public getModuleName(): string {
        return 'StripLine';
    }
    /**
     * To destroy the `StripLine` module.
     */
    public destroy(): void {
        // destroy peform here
    }
}