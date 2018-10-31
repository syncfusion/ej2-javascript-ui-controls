import { Chart } from '../chart';
import { Axis, Row, Column, VisibleRangeModel } from '../axis/axis';
import { valueToCoefficient, TextOption, inside } from '../../common/utils/helper';
import { measureText, appendChildElement } from '../../common/utils/helper';
import { Size, Rect, PathOption, CircleOption } from '../../common/utils/helper';
import { LineBase } from '../series/line-base';
import { textElement, ChartLocation, valueToPolarCoefficient, CoefficientToVector } from '../../common/utils/helper';
import { BorderModel } from '../../index';

/**
 * Specifies the Polar Axis Layout.
 */
const axisPadding: number = 10;

export class PolarRadarPanel extends LineBase {

    private initialClipRect: Rect;
    private htmlObject: HTMLElement;
    private element: Element;
    private centerX: number;
    private centerY: number;
    private startAngle: number;
    /** @private */
    public seriesClipRect: Rect;
    /**
     * Measure the polar radar axis size.
     * @return {void}
     * @private
     */

    public measureAxis(rect: Rect): void {

        let chart: Chart = this.chart;

        this.initialClipRect = rect;

        this.seriesClipRect = new Rect(rect.x, rect.y, rect.width, rect.height);

        //Measure axis size calculation
        this.measureRowAxis(chart, this.initialClipRect);

        this.measureColumnAxis(chart, this.initialClipRect);

        this.calculateAxisSize();
    }
    private measureRowAxis(chart: Chart, rect: Rect): void {
        this.calculateRowSize(rect);
        let row: Row = <Row>chart.rows[0];
        this.measureDefinition(row, chart, new Size(chart.availableSize.width, row.computedHeight), rect);
    }

    private measureColumnAxis(chart: Chart, rect: Rect): void {
        this.calculateColumnSize(rect);
        let column: Column = <Column>chart.columns[0];
        this.measureDefinition(column, chart, new Size(column.computedWidth, chart.availableSize.height), rect);
    }

    /**
     * Measure the column and row in chart.
     * @return {void}
     * @private
     */
    public measureDefinition(definition: Row | Column, chart: Chart, size: Size, clipRect: Rect): void {
        for (let axis of definition.axes) {
            axis.getModule(chart);
            axis.baseModule.calculateRangeAndInterval(size, axis);
        }
    }

    /**
     * Measure the axis.
     * @return {void}
     * @private
     */
    private calculateAxisSize(): void {

        let chart: Chart = this.chart;
        let axis: Axis;
        let padding: number = 5;
        this.centerX = this.initialClipRect.width * 0.5 + this.initialClipRect.x;
        this.centerY = this.initialClipRect.height * 0.5 + this.initialClipRect.y;
        chart.radius = Math.min(this.initialClipRect.width, this.initialClipRect.height) / 2 - padding -
           (<Axis>chart.primaryXAxis).majorTickLines.height - (<Axis>chart.primaryXAxis).maxLabelSize.height;
        chart.radius = ((<Axis>chart.primaryXAxis).coefficient * chart.radius) / 100;
        this.seriesClipRect.y = this.centerY - chart.radius;
        this.seriesClipRect.x = this.centerX - chart.radius;
        this.seriesClipRect.height = 2 * chart.radius;
        this.seriesClipRect.width = 2 * chart.radius;

        this.calculateRowSize(this.seriesClipRect);
        axis = <Axis>chart.primaryYAxis;
        axis.rect = this.seriesClipRect;

        this.calculateColumnSize(this.seriesClipRect);
        axis = <Axis>chart.primaryXAxis;
        axis.rect = this.seriesClipRect;
    }

    /**
     * Measure the axis.
     * @return {void}
     * @private
     */
    public measure(): void {
        let chart: Chart = this.chart;
        chart.verticalAxes.push(<Axis>chart.primaryYAxis);
        let row: Row = <Row>chart.rows[0];
        row.axes[0] = <Axis>chart.primaryYAxis;
        chart.rows[0] = row;
        chart.horizontalAxes.push(<Axis>chart.primaryXAxis);
        let column: Column = <Column>chart.columns[0];
        column.axes[0] = <Axis>chart.primaryXAxis;
        chart.columns[0] = column;
    }

    /**
     * Measure the row size.
     * @return {void}
     */

    private calculateRowSize(rect: Rect): void {
        /*! Calculate row size */
        let chart: Chart = this.chart;
        let row: Row = <Row>chart.rows[0];
        row.computedHeight = rect.height / 2;
        row.computedTop = rect.y;
        chart.rows[0] = row;
    }

    /**
     * Measure the row size.
     * @return {void}
     */

    private calculateColumnSize(rect: Rect): void {
        /*! Calculate column size */
        let chart: Chart = this.chart;
        let column: Column = <Column>chart.columns[0];
        column.computedLeft = rect.x;
        column.computedWidth = rect.width;
        chart.columns[0] = column;
    }

    /**
     * To render the axis element.
     * @return {void}
     * @private
     */

    public renderAxes(): Element {
        let axis: Axis;
        let chart: Chart = this.chart;
        this.startAngle = (<Axis>chart.primaryXAxis).startAngle;
        let axisElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisCollection' });
        let axisLineElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisOutsideCollection' });
        for (let i: number = 0, len: number = chart.axisCollections.length; i < len; i++) {

            this.element = chart.renderer.createGroup({ id: chart.element.id + 'AxisGroup' + i });

            axis = chart.axisCollections[i];

            if (axis.orientation === 'Horizontal') {

                if (axis.majorGridLines.width > 0 || axis.majorTickLines.width > 0) {
                    this.drawXAxisGridLine(axis, i);
                }

                if (axis.visible) {
                    this.drawXAxisLabels(axis, i);
                }

            } else {
                this.drawYAxisGridLine(axis, i);
                if (axis.lineStyle.width > 0) {
                    this.drawYAxisLine(axis, i, axis.plotOffset, 0);
                }
                if (axis.visible) {
                    this.drawYAxisLabels(axis, i);
                }
            }
            axisElement.appendChild(this.element);
        }

        axisElement.appendChild(this.element);

        appendChildElement(chart.svgObject, axisElement, chart.redraw);

        return axisLineElement;
    }

    private drawYAxisLine(axis: Axis, index: number, plotX: number, plotY: number): void {

        let chart: Chart = this.chart;
        let optionsLine: Object = {};
        let vector: ChartLocation = CoefficientToVector(valueToPolarCoefficient(axis.visibleLabels[0].value, axis), this.startAngle);
        let axisLine: string = 'M ' + this.centerX + ' ' + this.centerY + 'L ' +
            (this.centerX + chart.radius * vector.x) + ' ' + (this.centerY + chart.radius * vector.y);
        optionsLine = {
            'id': chart.element.id + 'AxisLine_' + index,
            'd': axisLine,
            'stroke-dasharray': axis.lineStyle.dashArray,
            'stroke-width': axis.lineStyle.width,
            'stroke': axis.lineStyle.color || chart.themeStyle.axisLine
        };
        chart.yAxisElements.appendChild(chart.renderer.drawPath(optionsLine));
    }

    public drawYAxisLabels(axis: Axis, index: number): void {
        let chart: Chart = this.chart;
        let elementSize: Size;
        let options: TextOption;
        let pointX: number = 0;
        let pointY: number = 0;
        let vector: ChartLocation;
        let angle: number = this.startAngle < 0 ? this.startAngle + 360 : this.startAngle;
        let anchor: string = 'middle';
        let radius: number; let padding: number = 5;
        let labelElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisLabels' + index });
        vector = CoefficientToVector(valueToPolarCoefficient(axis.visibleLabels[0].value, axis), this.startAngle);
        for (let i: number = 0, len: number = axis.visibleLabels.length; i < len; i++) {
            radius = chart.radius * valueToCoefficient(axis.visibleLabels[i].value, axis);
            elementSize = axis.visibleLabels[i].size;
            radius = chart.radius * valueToCoefficient(axis.visibleLabels[i].value, axis);
            pointX = (this.centerX + radius * vector.x) + ((axis.majorTickLines.height + elementSize.width / 2 + padding / 2)
              * (Math.cos(angle * Math.PI / 180)) * (axis.labelPosition === 'Inside' ? 1 : -1));
            pointY = (this.centerY + radius * vector.y) + ((axis.majorTickLines.height + elementSize.height / 2)
              * (Math.sin(angle * Math.PI / 180)) * (axis.labelPosition === 'Inside' ? 1 : -1));
            options = new TextOption(chart.element.id + index + '_AxisLabel_' + i, pointX, pointY + (elementSize.height / 4),
                                     anchor, axis.visibleLabels[i].text);
            textElement(options, axis.labelStyle, axis.labelStyle.color || chart.themeStyle.axisLabel, labelElement);
        }
        chart.yAxisElements.appendChild(labelElement);
    }

    private drawYAxisGridLine(axis: Axis, index: number): void {
        let chart: Chart = this.chart;
        let options: PathOption;
        let radius: number;
        let majorTick: string = '';
        let majorGrid: string = '';
        let vector: ChartLocation;
        let vector2: ChartLocation;
        let angle: number = this.startAngle < 0 ? this.startAngle + 360 : this.startAngle;
        let rect: Rect = axis.rect;
        let x1: number;
        let y1: number;
        let x2: number;
        let y2: number;
        let border: BorderModel = {
            color: axis.majorGridLines.color || chart.themeStyle.majorGridLine,
            width: axis.majorGridLines.width
        };
        if (axis.majorGridLines.width > 0) {
            if (chart.visibleSeries[0].type === 'Polar') {
                for (let j: number = 0; j < axis.visibleLabels.length; j++) {
                    radius = chart.radius * valueToCoefficient(axis.visibleLabels[j].value, axis);
                    options = new CircleOption(
                        chart.element.id + '_MajorGridLine_' + index, 'transparent', border,
                        axis.majorGridLines.width, this.centerX, this.centerY, radius
                    );

                    this.element.appendChild(chart.renderer.drawCircle(options));
                }
            } else {
                for (let j: number = 0; j < axis.visibleLabels.length; j++) {
                    radius = chart.radius * valueToCoefficient(axis.visibleLabels[j].value, axis);
                    for (let i: number = 0, len : number = (<Axis>chart.primaryXAxis).visibleLabels.length; i < len; i++) {
                        vector = CoefficientToVector(valueToPolarCoefficient((<Axis>chart.primaryXAxis).visibleLabels[i].value,
                                                                             (<Axis>chart.primaryXAxis)),
                                                     this.startAngle);
                        if (i + 1 < len) {
                            vector2 = CoefficientToVector(valueToPolarCoefficient((<Axis>chart.primaryXAxis).visibleLabels[i + 1].value,
                                                                                  (<Axis>chart.primaryXAxis)),
                                                          this.startAngle);
                        } else {
                            vector2 = CoefficientToVector(valueToPolarCoefficient((<Axis>chart.primaryXAxis).visibleLabels[0].value,
                                                                                  (<Axis>chart.primaryXAxis)),
                                                          this.startAngle);
                        }
                        x1 = this.centerX + radius * vector.x;
                        y1 = this.centerY + radius * vector.y;
                        x2 = this.centerX + radius * vector2.x;
                        y2 = this.centerY + radius * vector2.y;
                        majorGrid = majorGrid.concat('M' + ' ' + x1 + ' ' + y1 + ' ' + 'L' + ' ' + x2 + ' ' + y2 + ' ');
                    }
                }
                options = new PathOption(chart.element.id + '_MajorGridLine_' + index, 'transparent', axis.majorGridLines.width,
                                         axis.majorGridLines.color || chart.themeStyle.majorGridLine, null, null, majorGrid);

                this.element.appendChild(chart.renderer.drawPath(options));
            }
        }
        if (axis.majorTickLines.width > 0) {
            vector = CoefficientToVector(valueToPolarCoefficient(axis.visibleLabels[0].value, axis), this.startAngle);
            for (let i: number = 0; i < axis.visibleLabels.length; i++) {
                radius = chart.radius * valueToCoefficient(axis.visibleLabels[i].value, axis);
                x1 = this.centerX + radius * vector.x;
                y1 = this.centerY + radius * vector.y;
                x2 = x1 + (axis.majorTickLines.height * (Math.cos(angle * Math.PI / 180)) * (axis.tickPosition === 'Inside' ? 1 : -1));
                y2 = y1 + (axis.majorTickLines.height * (Math.sin(angle * Math.PI / 180)) * (axis.tickPosition === 'Inside' ? 1 : -1));
                majorTick = majorTick.concat('M ' + x1 + ' ' + y1 +
                    ' L ' + x2 + ' ' + y2 + ' ');
            }
        }
        this.renderTickLine(axis, index, majorTick, '');
    }

    private drawXAxisGridLine(axis: Axis, index: number): void {
        let chart: Chart = this.chart;
        let tempInterval: number;
        let vector: ChartLocation;
        let majorGrid: string = '';
        let majorTick: string = '';
        let minorGirdLine: string = '';
        let minorTickLine: string = '';
        let x1: number = this.centerX;
        let x2: number;
        let y1: number = this.centerY;
        let y2: number;
        let minorDirection: string[];
        let tickSize: number = axis.majorTickLines.height;
        let rect: Rect = axis.rect;
        let length: number = axis.visibleLabels.length;
        //Gridlines
        for (let i: number = 0; i < length; i++) {
            tempInterval = axis.visibleLabels[i].value;
            vector = CoefficientToVector(valueToPolarCoefficient(axis.visibleLabels[i].value, axis), this.startAngle);
            x2 = this.centerX + chart.radius * vector.x;
            y2 = this.centerY + chart.radius * vector.y;
            let xLoc: number = x2 +  (axis.majorTickLines.height * vector.x * (axis.tickPosition === 'Inside' ? -1 : 1));
            let yLoc: number = y2 +  (axis.majorTickLines.height * vector.y * (axis.tickPosition === 'Inside' ? -1 : 1));
            majorGrid = majorGrid.concat('M ' + x1 + ' ' + y1 + ' ' + 'L' + x2 + ' ' + y2);
            majorTick = majorTick.concat('M ' + x2 + ' ' + y2 +
                ' L ' + xLoc + ' ' + yLoc + ' ');
            if (axis.minorTicksPerInterval > 0 && (axis.minorGridLines.width > 0 || axis.minorTickLines.width > 0)
                && axis.valueType !== 'Category' && chart.visibleSeries[0].type !== 'Radar') {
                minorDirection = this.drawAxisMinorLine(axis, tempInterval, minorGirdLine, minorTickLine);
                minorGirdLine = minorDirection[0];
                minorTickLine = minorDirection[1];
            }
        }
        this.renderTickLine(axis, index, majorTick, minorTickLine);
        this.renderGridLine(axis, index, majorGrid, minorGirdLine);
    }
    private drawAxisMinorLine(axis: Axis, tempInterval: number, minorGird: string, minorTick: string): string[] {
        let value: number = tempInterval;
        let x: number;
        let y: number;
        let vector: ChartLocation;
        let range: VisibleRangeModel = axis.visibleRange;
        let direction: string[] = [];
        for (let j: number = 0; j < axis.minorTicksPerInterval; j++) {
            value += (axis.valueType === 'DateTime' ? axis.dateTimeInterval : axis.visibleRange.interval) /
                (axis.minorTicksPerInterval + 1);
            if (inside(value, range)) {
                vector = CoefficientToVector(valueToPolarCoefficient(value, axis), this.startAngle);
                x = this.centerX + this.chart.radius * vector.x;
                y = this.centerY + this.chart.radius * vector.y;
                let tickXSize: number =  x + (axis.minorTickLines.height * vector.x * (axis.tickPosition === 'Inside' ? -1 : 1));
                let tickYSize: number =  y + (axis.minorTickLines.height * vector.y * (axis.tickPosition === 'Inside' ? -1 : 1));
                minorGird = minorGird.concat('M' + ' ' + this.centerX + ' ' + this.centerY
                    + 'L ' + x + ' ' + y);
                minorTick = minorTick.concat('M' + ' ' + x + ' ' + y + 'L' + ' ' + (tickXSize) + ' ' +
                    (tickYSize));
            }
        }
        direction.push(minorGird);
        direction.push(minorTick);
        return direction;
    }

    /**
     * To render the axis label.
     * @return {void}
     * @private
     */
    public drawXAxisLabels(axis: Axis, index: number): void {

        let chart: Chart = this.chart;
        let pointX: number = 0;
        let pointY: number = 0;
        let labelElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisLabels' + index });
        let options: TextOption;
        let vector: ChartLocation;
        let labelText: string;
        let firstLabelX: number;
        let islabelInside: boolean = axis.labelPosition === 'Inside';
        let padding: number = 5;
        let lastLabelX: number;
        let textAnchor: string = '';
        let ticksbwtLabel: number = axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks'
                  && chart.visibleSeries[0].type !== 'Radar' ? 0.5 : 0;
        let radius: number = chart.radius + axis.majorTickLines.height;
        radius = (islabelInside) ? -radius : radius;

        for (let i: number = 0, len: number = axis.visibleLabels.length; i < len; i++) {

            vector = CoefficientToVector(valueToPolarCoefficient(axis.visibleLabels[i].value + ticksbwtLabel, axis), this.startAngle);
            if (!isNaN(vector.x) && !isNaN(vector.y)) {
                pointX = this.centerX + (radius + axis.majorTickLines.height + padding) * vector.x;
                pointY = this.centerY + (radius + axis.majorTickLines.height + padding) * vector.y;
                textAnchor = parseFloat(pointX.toFixed(1)) === parseFloat(this.centerX.toFixed(1)) ? 'middle' :
                ((pointX < this.centerX && !islabelInside) || (pointX > this.centerX && islabelInside)) ? 'end' : 'start';
            }
            labelText = <string>axis.visibleLabels[i].text;
            if (i === 0) {
                firstLabelX = pointX;
            } else if (i === axis.visibleLabels.length - 1 && axis.valueType !== 'Category') {
                lastLabelX = measureText(labelText, axis.labelStyle).height;
                lastLabelX += pointX;
                labelText = (lastLabelX > firstLabelX) ? '' : labelText;
            }

            options = new TextOption(chart.element.id + index + '_AxisLabel_' + i, pointX, pointY, textAnchor, labelText, '', 'central');
            textElement(options, axis.labelStyle, axis.labelStyle.color || chart.themeStyle.axisLabel, labelElement);
        }

        this.element.appendChild(labelElement);
    }

    private renderTickLine(axis: Axis, index: number, majorTickLine: string, minorTickLine?: string): void {

        let tickOptions: PathOption;
        let chart: Chart = this.chart;

        if (axis.majorTickLines.width > 0) {

            tickOptions = new PathOption(chart.element.id + '_MajorTickLine_' + index, 'transparent', axis.majorTickLines.width,
                                         axis.majorTickLines.color || chart.themeStyle.majorTickLine, null, null, majorTickLine);

            chart.yAxisElements.appendChild(chart.renderer.drawPath(tickOptions));

        }
        if (axis.minorTickLines.width > 0) {

            tickOptions = new PathOption(chart.element.id + '_MinorTickLine_' + index, 'transparent', axis.minorTickLines.width,
                                         axis.minorTickLines.color || chart.themeStyle.minorTickLine, null, null, minorTickLine);

            chart.yAxisElements.appendChild(chart.renderer.drawPath(tickOptions));

        }
    }

    private renderGridLine(axis: Axis, index: number, majorGrid: string, minorGird: string): void {
        let chart: Chart = this.chart;
        let gridOptions: PathOption;
        if (axis.majorGridLines.width > 0) {
            gridOptions = new PathOption(
                chart.element.id + '_MajorGridLine_' + index, 'transparent', axis.majorGridLines.width,
                axis.majorGridLines.color || chart.themeStyle.majorGridLine, null, axis.majorGridLines.dashArray, majorGrid
            );

            this.element.appendChild(chart.renderer.drawPath(gridOptions));

        }
        if (axis.minorGridLines.width > 0) {
            gridOptions = new PathOption(
                chart.element.id + '_MinorGridLine_' + index, 'transparent', axis.minorGridLines.width,
                axis.minorGridLines.color || chart.themeStyle.minorGridLine, null, axis.minorGridLines.dashArray, minorGird
            );

            this.element.appendChild(chart.renderer.drawPath(gridOptions));
        }
    }
}