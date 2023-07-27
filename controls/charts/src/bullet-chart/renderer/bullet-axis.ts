/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
import { BulletChart } from '../bullet-chart';
import { measureText, TextOption, Rect, textElement } from '@syncfusion/ej2-svg-base';
import { Orientation } from '../../chart/utils/enum';
import { MajorTickLinesModel } from '../../chart/axis/axis-model';

/**
 * Class for Bullet chart axis
 */
export class BulletChartAxis {
    public bulletChart: BulletChart;
    private labelOffset: number;
    private labelSize: number;
    private isHorizontal: boolean;
    private isVertical: boolean;
    private isLabelBelow: boolean;
    private isLabelsInside: boolean;
    private majorTickSize: number;
    private length: number;
    private isLeft: boolean;
    private isRight: boolean;
    private isTop: boolean;
    private location: number;
    private rangeCollection: number[];
    /** @private */
    public format: Function;
    constructor(bullet: BulletChart) {
        //super();
        this.bulletChart = bullet;
        this.isVertical = (bullet.orientation === 'Vertical');
        this.isLabelsInside = (bullet.labelPosition === 'Inside');
        this.isHorizontal = (bullet.orientation === 'Horizontal');
        this.isLeft = bullet.titlePosition === 'Left';
        this.isRight = bullet.titlePosition === 'Right';
        this.isTop = bullet.titlePosition === 'Top';
        this.majorTickSize = bullet.majorTickLines.height;
        this.location = 10;
        this.labelOffset = 15;
        this.labelSize = parseFloat(bullet.labelStyle.size);
        this.isLabelBelow = !this.bulletChart.opposedPosition;
    }

    public renderMajorTickLines(intervalValue: number, scale: Element): void {
        if (this.bulletChart.orientation === 'Horizontal') {
            this.renderXMajorTickLines(intervalValue, scale);
        } else {
            this.renderYMajorTickLines(intervalValue, scale);
        }
    }
    public renderMinorTickLines(intervalValue: number, scale: Element): void {
        if (this.bulletChart.orientation === 'Horizontal') {
            this.renderXMinorTickLines(intervalValue, scale);
        } else {
            this.renderYMinorTickLines(intervalValue, scale);
        }
    }
    public renderAxisLabels(intervalValue: number, scale: Element): void {
        if (this.bulletChart.orientation === 'Horizontal') {
            this.renderXAxisLabels(intervalValue, scale);
        } else {
            this.renderYAxisLabels(intervalValue, scale);
        }
    }

    /**
     * To render grid lines of bullet chart axis.
     */
    public renderXMajorTickLines(intervalValue: number, scale: Element): void {
        const bullet: BulletChart = this.bulletChart;
        const tickGroup: Element = bullet.renderer.createGroup({ 'id': bullet.svgObject.id + '_majorTickGroup' });
        const min: number = bullet.minimum;
        const max: number = bullet.maximum;
        const interval: number = bullet.interval;
        const enableRtl: boolean = bullet.enableRtl;
        const y1: number = bullet.initialClipRect.y + ((bullet.opposedPosition) ? 0 : bullet.initialClipRect.height);
        const y2: number = y1 + ((!bullet.opposedPosition) ? ((bullet.tickPosition !== 'Inside' ?
            this.majorTickSize : -this.majorTickSize)) : ((bullet.tickPosition !== 'Inside' ? -this.majorTickSize : this.majorTickSize)));
        const majorTick: MajorTickLinesModel = bullet.majorTickLines;
        let strokeColor: string = majorTick.color || bullet.themeStyle.majorTickLineColor;
        let options: Object;
        let condition: boolean;
        const size: number = bullet.initialClipRect.x + ((bullet.enableRtl) ? bullet.initialClipRect.width : 0);
        let majorPointX: number = bullet.initialClipRect.x + majorTick.width / 2 + ((enableRtl) ? bullet.initialClipRect.width : 0);
        for (let i: number = min; i <= max; i += interval) {
            condition = (!bullet.enableRtl) ? (i === max) : (i === min);
            if (condition) {
                majorPointX -= majorTick.width / 2;
            }
            condition = (!bullet.enableRtl) ? (i === max) : (i === min);
            if (bullet.majorTickLines.useRangeColor) {
                strokeColor = this.bindingRangeStrokes(
                    majorPointX - ((condition) ? this.bulletChart.majorTickLines.width / 2 : 0), size,
                    this.bulletChart.orientation, bullet.enableRtl);
            }
            options = this.majorTicks(majorPointX, majorPointX, y1, y2, strokeColor, i);
            const majorTicks: Element = bullet.renderer.drawLine(options);
            majorPointX = majorPointX + ((enableRtl ? -intervalValue : intervalValue));
            tickGroup.appendChild(majorTicks);
            scale.appendChild(tickGroup);
        }
    }
    /**
     * To render grid lines of bullet chart axis.
     */
    public renderYMajorTickLines(intervalValue: number, scale: Element): void {
        const bulletChart: BulletChart = this.bulletChart;
        const tickGroup: Element = bulletChart.renderer.createGroup({ 'id': bulletChart.svgObject.id + '_majorTickGroup' });
        const min: number = bulletChart.minimum;
        const max: number = bulletChart.maximum;
        const interval: number = bulletChart.interval;
        const enableRtl: boolean = bulletChart.enableRtl;
        const rect: Rect = bulletChart.initialClipRect;
        const x1: number = rect.x + ((!bulletChart.opposedPosition) ? 0 : rect.width);
        const x2: number = x1 - ((!bulletChart.opposedPosition) ? ((bulletChart.tickPosition !== 'Inside' ?
            this.majorTickSize : -this.majorTickSize)) : ((bulletChart.tickPosition !== 'Inside'
            ? -this.majorTickSize : this.majorTickSize)));
        const majorTick: MajorTickLinesModel = bulletChart.majorTickLines;
        let strokeColor: string = majorTick.color || bulletChart.themeStyle.majorTickLineColor;
        let condition: boolean;
        let options: Object;
        const size: number = rect.y + ((!bulletChart.enableRtl) ? rect.height : 0);
        let majorPointY: number = rect.y + majorTick.width / 2 + ((!enableRtl) ? rect.height : 0);
        for (let i: number = min; i <= max; i += interval) {
            condition = (bulletChart.enableRtl) ? (i === max) : (i === min);
            if (condition) {
                majorPointY -= majorTick.width / 2;
            }
            condition = (!bulletChart.enableRtl) ? (i === max) : (i === min);
            if (bulletChart.majorTickLines.useRangeColor) {
                strokeColor = this.bindingRangeStrokes(
                    majorPointY - ((condition) ? this.bulletChart.majorTickLines.width / 2 : 0), size,
                    this.bulletChart.orientation, bulletChart.enableRtl);
            }
            options = this.majorTicks(x1, x2, majorPointY, majorPointY, strokeColor, i);
            const majorTicks: Element = bulletChart.renderer.drawLine(options);
            majorPointY = majorPointY + ((!enableRtl ? -intervalValue : intervalValue));
            tickGroup.appendChild(majorTicks);
            scale.appendChild(tickGroup);
        }
    }

    private majorTicks(x1: number, x2: number, y1: number, y2: number, strokeColor: string, i: number): object {
        const options: object = {
            'id': this.bulletChart.svgObject.id + '_MajorTickLine_' + i,
            'x1': x1,
            'y1': y1,
            'x2': x2,
            'y2': y2,
            'stroke-width': this.bulletChart.majorTickLines.width,
            'stroke': (this.bulletChart.majorTickLines.useRangeColor && strokeColor) ? strokeColor :
                this.bulletChart.majorTickLines.color || strokeColor
        };
        return options;
    }

    private bindingRangeStrokes(majorPointX: number, size: number, orientation: Orientation, rtl: boolean): string {
        if ((orientation === 'Vertical' && !rtl) || (rtl && orientation === 'Horizontal')) {
            return this.backwardStrokeBinding(majorPointX, size);
        } else {
            return this.forwardStrokeBinding(majorPointX, size);
        }
    }

    /**
     * To render minor tick lines of bullet chart.
     */
    public renderXMinorTickLines(intervalValue: number, scaleGroup: Element): void {
        const minorTickGroup: Element = this.bulletChart.renderer.createGroup({ 'id': this.bulletChart.svgObject.id + '_minorTickGroup' });
        const bullet: BulletChart = this.bulletChart;
        const max: number = bullet.maximum;
        const min: number = bullet.minimum;
        const interval: number = bullet.interval;
        const minorTick: number = bullet.minorTickLines.height;
        const minorTicksPerInterval: number = this.bulletChart.minorTicksPerInterval;
        let minorPointX: number;
        let x: number;
        let majorPointX: number = bullet.initialClipRect.x;
        const y1: number = bullet.initialClipRect.y + ((bullet.opposedPosition) ? 0 : bullet.initialClipRect.height);
        const y2: number = y1 + ((!bullet.opposedPosition) ? ((bullet.tickPosition !== 'Inside' ? minorTick : -minorTick)) :
            ((bullet.tickPosition !== 'Inside' ? -minorTick : minorTick)));
        let strokeColor: string = bullet.minorTickLines.color || bullet.themeStyle.minorTickLineColor;
        let options: object;
        let minorTicks: Element;
        const size: number = bullet.initialClipRect.x + ((bullet.enableRtl) ? bullet.initialClipRect.width : 0);
        for (let i: number = min; i < max; i += interval) {
            minorPointX = intervalValue / minorTicksPerInterval;
            for (let j: number = 1; j <= minorTicksPerInterval; j++) {
                x = majorPointX + minorPointX - (minorPointX / (minorTicksPerInterval + 1));
                if (bullet.minorTickLines.useRangeColor) {
                    strokeColor = this.bindingRangeStrokes(x, size, this.bulletChart.orientation, bullet.enableRtl);
                }
                options = this.minorXTicks(x, x, y1, y2, strokeColor, i.toString() + j.toString());
                minorTicks = this.bulletChart.renderer.drawLine(options);
                minorTickGroup.appendChild(minorTicks);
                scaleGroup.appendChild(minorTickGroup);
                minorPointX = (intervalValue / minorTicksPerInterval) * (j + 1);
            }
            majorPointX += intervalValue;
        }
    }

    /**
     * To render minor tick lines of bullet chart.
     */
    public renderYMinorTickLines(intervalValue: number, scaleGroup: Element): void {
        const minorTickGroup: Element = this.bulletChart.renderer.createGroup({ 'id': this.bulletChart.svgObject.id + '_minorTickGroup' });
        const bulletChart: BulletChart = this.bulletChart;
        const max: number = bulletChart.maximum;
        const min: number = bulletChart.minimum;
        const interval: number = bulletChart.interval;
        const minorTick: number = bulletChart.minorTickLines.height;
        const minorTicksPerInterval: number = this.bulletChart.minorTicksPerInterval;
        let minorPointY: number;
        let y: number;
        let majorPointY: number = bulletChart.initialClipRect.y + ((!bulletChart.enableRtl) ? bulletChart.initialClipRect.height : 0);
        const x1: number = bulletChart.initialClipRect.x + ((!bulletChart.opposedPosition) ? 0 : bulletChart.initialClipRect.width);
        const x2: number = x1 - ((!bulletChart.opposedPosition) ? ((bulletChart.tickPosition !== 'Inside' ? minorTick : -minorTick)) :
            ((bulletChart.tickPosition !== 'Inside' ? -minorTick : minorTick)));
        let strokeColor: string = bulletChart.minorTickLines.color || bulletChart.themeStyle.minorTickLineColor;
        let options: object;
        let minorTicks: Element;
        const size: number = bulletChart.initialClipRect.y + ((!bulletChart.enableRtl) ? bulletChart.initialClipRect.height : 0);
        for (let i: number = min; i < max; i += interval) {
            minorPointY = intervalValue / minorTicksPerInterval;
            for (let j: number = 1; j <= minorTicksPerInterval; j++) {
                if (!this.bulletChart.enableRtl) {
                    y = majorPointY - minorPointY + (minorPointY / (minorTicksPerInterval + 1));
                } else {
                    y = majorPointY + minorPointY - (minorPointY / (minorTicksPerInterval + 1));
                }
                if (bulletChart.minorTickLines.useRangeColor) {
                    strokeColor = this.bindingRangeStrokes(y, size, this.bulletChart.orientation, bulletChart.enableRtl);
                }
                options = this.minorXTicks(x1, x2, y, y, strokeColor, i.toString() + j.toString());
                minorTicks = this.bulletChart.renderer.drawLine(options);
                minorTickGroup.appendChild(minorTicks);
                scaleGroup.appendChild(minorTickGroup);
                minorPointY = (intervalValue / minorTicksPerInterval) * (j + 1);
            }
            majorPointY -= (this.bulletChart.enableRtl) ? -intervalValue : intervalValue;
        }
    }

    private minorXTicks(x1: number, x2: number, y1: number, y2: number, strokeColor: string, i: string): object {
        const options: object = {
            'id': this.bulletChart.svgObject.id + '_MajorTickLine_' + i,
            'x1': x1,
            'x2': x2,
            'y1': y1,
            'y2': y2,
            'stroke-width': this.bulletChart.minorTickLines.width,
            'stroke': (this.bulletChart.minorTickLines.useRangeColor && strokeColor) ? strokeColor :
                this.bulletChart.minorTickLines.color || strokeColor
        };
        return options;
    }

    private forwardStrokeBinding(position: number, size: number): string {
        const bullet: BulletChart = this.bulletChart;
        let previous: number = size;
        // (bullet.orientation === 'Horizontal') ? bullet.initialClipRect.x :
        // (bullet.initialClipRect.y + bullet.initialClipRect.height);
        for (let k: number = 0; k <= bullet.rangeCollection.length - 1; k++) {
            previous += (!k) ? 0 : bullet.rangeCollection[k - 1];
            if (position >= previous && position < previous + bullet.rangeCollection[k as number]) {
                return bullet.ranges[k as number].color;
            }
        }
        return null;
    }

    private backwardStrokeBinding(position: number, size: number): string {
        const bullet: BulletChart = this.bulletChart;
        let previous: number = size;
        for (let k: number = 0; k <= bullet.rangeCollection.length - 1; k++) {
            previous -= (!k) ? 0 : bullet.rangeCollection[k - 1];
            if (Math.round(position) >= Math.round(previous - bullet.rangeCollection[k as number]) && position <= previous) {
                return bullet.ranges[k as number].color;
            }
        }
        return null;
    }

    /**
     * To render axis labels of bullet chart.
     */
    public renderXAxisLabels(intervalValue: number, scaleGroup: Element): void {
        const axisLabelGroup: Element = this.bulletChart.renderer.createGroup({ 'id': this.bulletChart.svgObject.id + '_axisLabelGroup' });
        let text: string;
        const bullet: BulletChart = this.bulletChart;
        const locale: string = this.bulletChart.locale;
        const padding: number = 5;
        const enableRtl: boolean = bullet.enableRtl;
        const tick: number = (((bullet.tickPosition === bullet.labelPosition) ? bullet.majorTickLines.height : 0) + padding * 2);
        let y: number = bullet.initialClipRect.y + ((bullet.opposedPosition) ? ((bullet.labelPosition === 'Inside') ? tick : -tick)
            : bullet.initialClipRect.height + ((bullet.labelPosition === 'Inside') ? -tick : tick));
        let x: number = bullet.initialClipRect.x + ((enableRtl) ? bullet.initialClipRect.width : 0);
        const min: number = bullet.minimum; const max: number = bullet.maximum;
        const interval: number = bullet.interval;
        const localizedText: boolean = locale && this.bulletChart.enableGroupSeparator;
        const format: string = this.getFormat(this.bulletChart);
        let strokeColor: string = bullet.labelStyle.color || bullet.themeStyle.axisLabelFont.color;
        let condition: boolean; const isCustomFormat: boolean = format.match('{value}') !== null;
        this.format = this.bulletChart.intl.getNumberFormat({
            format: isCustomFormat ? '' : format, useGrouping: this.bulletChart.enableGroupSeparator
        });
        const size: number = bullet.initialClipRect.x + ((bullet.enableRtl) ? bullet.initialClipRect.width : 0);
        y += measureText(this.formatValue(this, isCustomFormat, format, this.bulletChart.maximum), bullet.labelStyle, this.bulletChart.themeStyle.axisLabelFont).height / 3;
        for (let i: number = min; i <= max; i += interval) {
            condition = (!bullet.enableRtl) ? (i === max) : (i === min);
            if (bullet.labelStyle.useRangeColor) {
                strokeColor = this.bindingRangeStrokes(
                    x - ((condition) ? this.bulletChart.majorTickLines.width / 2 : 0), size,
                    this.bulletChart.orientation, bullet.enableRtl);
            }
            text = localizedText ? i.toLocaleString(locale) : this.formatValue(this, isCustomFormat, format, i);
            const labelOptions: TextOption = this.labelXOptions(x, y, text, i);
            this.bulletChart.labelStyle.fontFamily = this.bulletChart.labelStyle.fontFamily || this.bulletChart.themeStyle.axisLabelFont.fontFamily;
            this.bulletChart.labelStyle.fontFamily = this.bulletChart.labelStyle.fontFamily || this.bulletChart.themeStyle.axisLabelFont.fontFamily;
            const label: Element = textElement(
                labelOptions, this.bulletChart.labelStyle, strokeColor, scaleGroup
            );
            axisLabelGroup.appendChild(label);
            x += (enableRtl) ? -intervalValue : intervalValue;
        }
        scaleGroup.appendChild(axisLabelGroup);
    }

    private labelXOptions(labelX: number, pointY: number, displayText: string, i: number): TextOption {
        const labelOptions: TextOption = {
            'id': this.bulletChart.svgObject.id + '_AxisLabel_' + i,
            'anchor': 'middle',
            'text': displayText,
            'transform': '',
            'x': labelX,
            'y': pointY,
            'baseLine': '',
            'labelRotation': 0
        };
        return labelOptions;
    }

    /**
     * To render axis labels of bullet chart.
     */
    public renderYAxisLabels(intervalValue: number, scaleGroup: Element): void {
        const axisLabelGroup: Element = this.bulletChart.renderer.createGroup({ 'id': this.bulletChart.svgObject.id + '_axisLabelGroup' });
        let text: string;
        const bulletChart: BulletChart = this.bulletChart;
        const locale: string = bulletChart.locale;
        const padding: number = 5;
        const enableRtl: boolean = bulletChart.enableRtl;
        const tick: number = (((bulletChart.tickPosition === bulletChart.labelPosition) ?
            bulletChart.majorTickLines.height : 0) + padding * 2);
        let y: number = bulletChart.initialClipRect.y + ((!enableRtl) ? bulletChart.initialClipRect.height : 0);
        const x: number = bulletChart.initialClipRect.x + ((!bulletChart.opposedPosition) ?
            ((bulletChart.labelPosition === 'Inside') ? (tick + padding * 2) : -tick)
            : bulletChart.initialClipRect.width + ((bulletChart.labelPosition === 'Inside') ? -(tick + padding * 2) : tick));
        const min: number = bulletChart.minimum; const max: number = bulletChart.maximum;
        const interval: number = bulletChart.interval;
        const localizedText: boolean = locale && this.bulletChart.enableGroupSeparator;
        let strokeColor: string = bulletChart.labelStyle.color || bulletChart.themeStyle.axisLabelFont.color;
        const format: string = this.getFormat(this.bulletChart);
        const isCustomFormat: boolean = format.match('{value}') !== null;
        let condition: boolean;
        this.format = this.bulletChart.intl.getNumberFormat({
            format: isCustomFormat ? '' : format, useGrouping: this.bulletChart.enableGroupSeparator
        });
        const size: number = bulletChart.initialClipRect.y + ((!bulletChart.enableRtl) ? bulletChart.initialClipRect.height : 0);
        const labelWidth: number = measureText(
            this.formatValue(this, isCustomFormat, format, this.bulletChart.maximum), bulletChart.labelStyle, this.bulletChart.themeStyle.axisLabelFont).width / 2;
        const height: number = measureText(
            this.formatValue(this, isCustomFormat, format, this.bulletChart.maximum), bulletChart.labelStyle, this.bulletChart.themeStyle.axisLabelFont).height / 3;
        y += height;
        for (let i: number = min; i <= max; i += interval) {
            condition = (bulletChart.enableRtl) ? (i === max) : (i === min);
            if (bulletChart.labelStyle.useRangeColor) {
                strokeColor = this.bindingRangeStrokes(
                    y - height - ((condition) ? this.bulletChart.majorTickLines.width / 2 : 0), size,
                    this.bulletChart.orientation, bulletChart.enableRtl);
            }
            text = localizedText ? i.toLocaleString(locale) : this.formatValue(this, isCustomFormat, format, i);
            //labelWidth = measureText(text, bullet.labelStyle).width / 2;
            const labelOptions: TextOption = this.labelXOptions(
                x - (!this.bulletChart.opposedPosition ? labelWidth : -labelWidth), y, text, i);
            this.bulletChart.labelStyle.fontFamily = this.bulletChart.labelStyle.fontFamily || this.bulletChart.themeStyle.axisLabelFont.fontFamily;
            this.bulletChart.labelStyle.fontFamily = this.bulletChart.labelStyle.fontFamily || this.bulletChart.themeStyle.axisLabelFont.fontFamily;
            const label: Element = textElement(
                labelOptions, this.bulletChart.labelStyle, strokeColor, scaleGroup
            );
            axisLabelGroup.appendChild(label);
            y += (!enableRtl) ? -intervalValue : intervalValue;
        }
        scaleGroup.appendChild(axisLabelGroup);
    }

    /**
     * Format of the axis label.
     *
     * @private
     */

    public getFormat(axis: BulletChart): string {
        if (axis.labelFormat) {
            return axis.labelFormat;
        }
        return '';
    }

    /**
     * Formatted the axis label.
     *
     * @private
     */

    public formatValue(axis: BulletChartAxis, isCustom: boolean, format: string, tempInterval: number): string {
        return isCustom ? format.replace('{value}', axis.format(tempInterval))
            : axis.format(tempInterval);
    }
}
