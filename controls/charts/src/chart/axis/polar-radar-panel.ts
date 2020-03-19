import { Chart } from '../chart';
import { Axis, Row, Column, VisibleRangeModel, VisibleLabels } from '../axis/axis';
import { valueToCoefficient, inside, isOverlap, textTrim } from '../../common/utils/helper';
import { appendChildElement } from '../../common/utils/helper';
import { CircleOption } from '../../common/utils/helper';
import { Size, measureText, TextOption, PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { LineBase } from '../series/line-base';
import { textElement, ChartLocation, valueToPolarCoefficient, CoefficientToVector, getElement } from '../../common/utils/helper';
import { BorderModel } from '../../index';
import { LabelIntersectAction, AxisPosition } from '../utils/enum';

/**
 * Specifies the Polar Axis Layout.
 */
const axisPadding: number = 10;

export class PolarRadarPanel extends LineBase {

    private initialClipRect: Rect;
    private htmlObject: HTMLElement;
    private element: Element;
    public centerX: number;
    public centerY: number;
    public startAngle: number;
    /** @private */
    public visibleAxisLabelRect: Rect[] = [];
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

                if (axis.visible && axis.internalVisibility) {
                    this.drawXAxisLabels(axis, i);
                }

            } else {
                this.drawYAxisGridLine(axis, i);
                if (axis.lineStyle.width > 0) {
                    this.drawYAxisLine(axis, i, axis.plotOffset, 0);
                }
                if (axis.visible && axis.internalVisibility) {
                    this.drawYAxisLabels(axis, i);
                }
            }
            axisElement.appendChild(this.element);
        }

        axisElement.appendChild(this.element);

        appendChildElement(chart.enableCanvas, chart.svgObject, axisElement, chart.redraw);

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
        /**
         * I252450
         * When we click the center of the marker which is plotted in the axis line, selection did not work is fixed
         * Cause: Instead of marker id, axis  line id is obtained while clicking
         * Fix: Pointer events set to none for axis lines
         */
        let element: Element = chart.renderer.drawPath(optionsLine);
        this.setPointerEventNone(element);
        chart.yAxisElements.appendChild(element);
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
        let isIntersect: boolean;
        let labelRegions: Rect[] = [];
        let isLabelVisible: boolean[] = [];
        isLabelVisible[0] = true;
        let intersectType: LabelIntersectAction = axis.labelIntersectAction;
        let labelElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisLabels' + index });
        vector = CoefficientToVector(valueToPolarCoefficient(axis.visibleLabels[0].value, axis), this.startAngle);
        for (let i: number = 0, len: number = axis.visibleLabels.length; i < len; i++) {
            isIntersect = false;
            radius = chart.radius * valueToCoefficient(axis.visibleLabels[i].value, axis);
            elementSize = axis.visibleLabels[i].size;
            radius = chart.radius * valueToCoefficient(axis.visibleLabels[i].value, axis);
            pointX = (this.centerX + radius * vector.x) + ((axis.majorTickLines.height + elementSize.width / 2 + padding / 2)
              * (Math.cos(angle * Math.PI / 180)) * (axis.labelPosition === 'Inside' ? 1 : -1));
            pointY = (this.centerY + radius * vector.y) + ((axis.majorTickLines.height + elementSize.height / 2)
              * (Math.sin(angle * Math.PI / 180)) * (axis.labelPosition === 'Inside' ? 1 : -1));
            pointY += (elementSize.height / 4);
            labelRegions[i] = this.getLabelRegion(pointX, pointY, axis.visibleLabels[i], anchor);
            if (i !== 0 && intersectType === 'Hide') {
                for (let j: number = i; j >= 0; j--) {
                    j = (j === 0) ? 0 : (j === i) ? (j - 1) : j;
                    if (isLabelVisible[j] && isOverlap(labelRegions[i], labelRegions[j])) {
                        isIntersect = true;
                        isLabelVisible[i] = false;
                        break;
                    } else {
                        isLabelVisible[i] = true;
                    }
                }
                if (isIntersect) {
                    continue; // If the label is intersect, the label render is ignored.
                }
                // To check Y axis label with visible X axis label
                for (let rect of this.visibleAxisLabelRect) {
                    if (isOverlap(labelRegions[i], rect)) {
                        isIntersect = true;
                        break;
                    }
                }
            }
            if (isIntersect) {
                continue;
            }
            this.visibleAxisLabelRect.push(labelRegions[i]);
            options = new TextOption(chart.element.id + index + '_AxisLabel_' + i, pointX, pointY,
                                     anchor, axis.visibleLabels[i].text);

            textElement(
                chart.renderer, options, axis.labelStyle, axis.labelStyle.color || chart.themeStyle.axisLabel, labelElement,
                false, chart.redraw, true, true
            );
        }
        chart.yAxisElements.appendChild(labelElement);
    }

    private drawYAxisGridLine(axis: Axis, index: number): void {
        let chart: Chart = this.chart;
        let options: CircleOption | PathOption;
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
        let previousValue: string;
        let element: Element;
        if (axis.majorGridLines.width > 0) {
            if (chart.visibleSeries[0].type === 'Polar') {
                for (let j: number = 0; j < axis.visibleLabels.length; j++) {
                    element = getElement(chart.element.id + '_MajorGridLine_' + index + '_' + j);
                    previousValue = element ? element.getAttribute('r') : null;
                    radius = chart.radius * valueToCoefficient(axis.visibleLabels[j].value, axis);
                    options = new CircleOption(
                        chart.element.id + '_MajorGridLine_' + index + '_' + j, 'transparent', border,
                        axis.majorGridLines.width, this.centerX, this.centerY, radius
                    );
                    appendChildElement(
                        chart.enableCanvas,
                        this.element, chart.renderer.drawCircle(options), chart.redraw,
                        true, 'r', 'r', new ChartLocation(+previousValue, +previousValue), null, true
                    );
                }
                if (radius !== chart.radius) {
                    options = new CircleOption(
                        chart.element.id + '_MajorGridLine_' + index + '_' + axis.visibleLabels.length + 1, 'transparent', border,
                        axis.majorGridLines.width, this.centerX, this.centerY, chart.radius
                    );
                    appendChildElement(
                        chart.enableCanvas,
                        this.element, chart.renderer.drawCircle(options), chart.redraw,
                        true, 'r', 'r', new ChartLocation(+previousValue, +previousValue), null, true
                    );
                }
            } else {
                for (let j: number = 0; j < axis.visibleLabels.length; j++) {
                    radius = chart.radius * valueToCoefficient(axis.visibleLabels[j].value, axis);
                    majorGrid = this.renderRadarGrid(radius, '', chart);
                    element = getElement(chart.element.id + '_MajorGridLine_' + index + '_' + j);
                    previousValue = element ? element.getAttribute('d') : null;
                    options = new PathOption(
                        chart.element.id + '_MajorGridLine_' + index + '_' + j, 'transparent', axis.majorGridLines.width,
                        axis.majorGridLines.color || chart.themeStyle.majorGridLine, null, null, majorGrid
                    );
                    appendChildElement(
                        chart.enableCanvas,
                        this.element, chart.renderer.drawPath(options), chart.redraw, true, 'x', 'y', null, previousValue, true
                    );
                }
                if (radius !== chart.radius) {
                    majorGrid = this.renderRadarGrid(chart.radius, '', chart);
                    element = getElement(chart.element.id + '_MajorGridLine_' + index + '_' + axis.visibleLabels.length);
                    previousValue = element ? element.getAttribute('d') : null;
                    options = new PathOption(
                        chart.element.id + '_MajorGridLine_' + index + '_' + axis.visibleLabels.length, 'transparent',
                        axis.majorGridLines.width, axis.majorGridLines.color || chart.themeStyle.majorGridLine, null, null, majorGrid
                    );
                    appendChildElement(
                        chart.enableCanvas,
                        this.element, chart.renderer.drawPath(options), chart.redraw, true, 'x', 'y', null, previousValue, true
                    );
                }
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
                majorTick = 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2;
                this.renderTickLine(axis, index, majorTick, '', i);
            }
        }
    }

    private renderRadarGrid(radius : number, majorGrid : string, chart : Chart ) : string {
        let vector: ChartLocation;
        let vector2: ChartLocation;
        let x1 : number; let y1 : number;
        let x2 : number; let y2 : number;
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
            majorGrid = majorGrid.concat((i ? 'L ' : 'M ') + ' ' + x1 + ' ' + y1 + ' ' + 'L ' + ' ' + x2 + ' ' + y2 + ' ');
        }
        return majorGrid;
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
            majorGrid = 'M ' + x1 + ' ' + y1 + ' ' + 'L ' + x2 + ' ' + y2;
            majorTick = 'M ' + x2 + ' ' + y2 + ' L ' + xLoc + ' ' + yLoc;
            if (axis.minorTicksPerInterval > 0 && (axis.minorGridLines.width > 0 || axis.minorTickLines.width > 0)
                && axis.valueType !== 'Category' && chart.visibleSeries[0].type !== 'Radar') {
                minorDirection = this.drawAxisMinorLine(axis, tempInterval, minorGirdLine, minorTickLine);
                minorGirdLine = minorDirection[0];
                minorTickLine = minorDirection[1];
            }
            this.renderTickLine(axis, index, majorTick, minorTickLine, i);
            this.renderGridLine(axis, index, majorGrid, minorGirdLine, i);
        }
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
    //tslint:disable-next-line:max-func-body-length
    public drawXAxisLabels(axis: Axis, index: number): void {
        this.visibleAxisLabelRect = [];
        let legendRect: Rect;
        if (this.chart.legendModule) {
            legendRect = this.chart.legendModule.legendBounds;
        }
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
        let label: VisibleLabels;
        let textAnchor: string = '';
        let isIntersect: boolean;
        let labelRegions: Rect[] = [];
        let isLabelVisible: boolean[] = [];
        isLabelVisible[0] = true;
        let intersectType: LabelIntersectAction = axis.labelIntersectAction;
        let ticksbwtLabel: number = axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks' ? 0.5 : 0;
        let radius: number = chart.radius + axis.majorTickLines.height;
        radius = (islabelInside) ? -radius : radius;

        for (let i: number = 0, len: number = axis.visibleLabels.length; i < len; i++) {
            isIntersect = false;
            vector = CoefficientToVector(valueToPolarCoefficient(axis.visibleLabels[i].value + ticksbwtLabel, axis), this.startAngle);
            if (!isNaN(vector.x) && !isNaN(vector.y)) {
                pointX = this.centerX + (radius + axis.majorTickLines.height + padding) * vector.x;
                pointY = this.centerY + (radius + axis.majorTickLines.height + padding) * vector.y;
                textAnchor = parseFloat(pointX.toFixed(1)) === parseFloat(this.centerX.toFixed(1)) ? 'middle' :
                ((pointX < this.centerX && !islabelInside) || (pointX > this.centerX && islabelInside)) ? 'end' : 'start';
            }
            label = axis.visibleLabels[i];
            labelText = <string>label.text;
            // to trim axis labels based on available size
            if (axis.enableTrim || intersectType === 'Trim') {
                let originalText: string = axis.visibleLabels[i].originalText;
                let trimText: string;
                let size: number;
                let labelPosition: AxisPosition = axis.labelPosition;
                let chartWidth : number = chart.availableSize.width;
                let textLength: number = originalText.length;
                for (let i: number = textLength - 1; i >= 0; --i) {
                    trimText = originalText.substring(0, i) + '...';
                    size = measureText(trimText, axis.labelStyle).width;
                    if (pointX === chartWidth / 2 ? (pointX - size / 2 >= 0 && pointX + size / 2 <= chartWidth) :
                       ((labelPosition === 'Outside' && ((pointX >= chartWidth / 2 && pointX + size <= chartWidth) ||
                        (pointX <= chartWidth / 2 && pointX - size >= 0))) || (labelPosition === 'Inside' &&
                        (pointX + size <= chartWidth / 2 || pointX - size >= chartWidth / 2)))) {
                            labelText = i === textLength - 1 ? originalText : trimText;
                            label.size.width = measureText(labelText, axis.labelStyle).width;
                            label.text = labelText;
                            break;
                    }
                }
            }
            // fix for label style not working in axisLabelRender event issue
            labelRegions[i] = this.getLabelRegion(pointX, pointY, label, textAnchor);
            if (i === 0) {
                firstLabelX = pointX;
            } else if (i === axis.visibleLabels.length - 1 && axis.valueType !== 'Category') {
                lastLabelX = measureText(labelText, axis.labelStyle).height;
                lastLabelX += pointX;
                labelText = (lastLabelX > firstLabelX) ? '' : labelText;
            }

            // Label intersect action (Hide) perform here
            if (i !== 0 && intersectType === 'Hide') {
                for (let j: number = i; j >= 0; j--) {
                    j = (j === 0) ? 0 : ((j === i) ? (j - 1) : j);
                    if (isLabelVisible[j] && isOverlap(labelRegions[i], labelRegions[j])) {
                        isIntersect = true;
                        isLabelVisible[i] = false;
                        break;
                    } else {
                        isLabelVisible[i] = true;
                    }
                }
            }
            if (!isIntersect && legendRect) {
                isIntersect = isOverlap(labelRegions[i], legendRect);
                if (isIntersect) {
                    let width: number = this.getAvailableSpaceToTrim(legendRect, labelRegions[i]);
                    if (width > 0) {
                        labelText = textTrim(width, axis.visibleLabels[i].originalText, axis.labelStyle);
                        isIntersect = false;
                    }
                }
            }
            options = new TextOption(chart.element.id + index + '_AxisLabel_' + i, pointX, pointY, textAnchor, labelText, '', 'central');
            if (isIntersect) {
                continue; // If the label is intersect, the label render is ignored.
            }
            this.visibleAxisLabelRect.push(labelRegions[i]);
            textElement(
                chart.renderer, options, label.labelStyle, label.labelStyle.color || chart.themeStyle.axisLabel, labelElement,
                false, chart.redraw, true, true
            );
        }
        this.element.appendChild(labelElement);
    }
    /**
     * To get available space to trim.
     * @param legendRect 
     * @param labelRect 
     */
    private getAvailableSpaceToTrim(legendRect: Rect, labelRect: Rect): number {
        let legendX1: number = legendRect.x;
        let legendX2: number = legendX1 + legendRect.width;
        let labelX1: number = labelRect.x;
        let labelX2: number = labelX1 + labelRect.width;
        let width: number = 0;
        if (labelX1 > legendX1 && labelX1 < legendX2 && labelX2 > legendX2) {
            width = labelX2 - legendX2;
        } else if (labelX1 > legendX1 && labelX1 < legendX2 && labelX2 < legendX2) {
            width = 0;
         } else if (labelX2 > legendX1 && labelX2 < legendX2 && labelX1 < legendX1) {
            width = legendX1 - labelX1;
         } else if (labelX2 > legendX1 && labelX2 > legendX2 && labelX1 < legendX1) {
            width = legendX1 - labelX1;
         }
        return width;
    }

    /**
     * Getting axis label bounds
     * @param pointX
     * @param pointY
     * @param label
     * @param anchor
     */
    private getLabelRegion(pointX: number, pointY: number, label: VisibleLabels, anchor: string): Rect {
        if (anchor === 'middle') {
            pointX -= (label.size.width / 2);
        } else if (anchor === 'end') {
            pointX -= label.size.width;
        } else {
            pointX = pointX;
        }
        pointY -= (label.size.height / 2);
        return new Rect(pointX, pointY, label.size.width, label.size.height);
    }

    private renderTickLine(
        axis: Axis, index: number, majorTickLine: string, minorTickLine: string, gridIndex: number
    ): void {

        let tickOptions: PathOption;
        let chart: Chart = this.chart;
        let direction: string;
        let element: Element;

        if (axis.majorTickLines.width > 0) {
            element = getElement(chart.element.id + '_MajorTickLine_' + index + '_' + gridIndex);
            direction = element ? element.getAttribute('d') : null;
            tickOptions = new PathOption(
                chart.element.id + '_MajorTickLine_' + index + '_' + gridIndex, 'transparent', axis.majorTickLines.width,
                axis.majorTickLines.color || chart.themeStyle.majorTickLine, null, null, majorTickLine
            );
            /**
             * I252450
             * When we click the center of the marker which is plotted in the axis, selection did not work is fixed
             * Cause: Instead of marker id, axis Tick line id is obtained while clicking
             * Fix: Pointer events set to none for tick lines
             */
            element = chart.renderer.drawPath(tickOptions);
            this.setPointerEventNone(element);
            appendChildElement(
                chart.enableCanvas, chart.yAxisElements, element,
                chart.redraw, true, 'x', 'y', null, direction
            );
        }
        if (axis.minorTickLines.width > 0) {
            element = getElement(chart.element.id + '_MinorTickLine_' + index + '_' + gridIndex);
            direction = element ? element.getAttribute('d') : null;
            tickOptions = new PathOption(
                chart.element.id + '_MinorTickLine_' + index + '_' + gridIndex, 'transparent', axis.minorTickLines.width,
                axis.minorTickLines.color || chart.themeStyle.minorTickLine, null, null, minorTickLine
            );
            /**
             * I252450
             * When we click the center of the marker which is plotted in the axis, selection did not work is fixed
             * Cause: Instead of marker id, axis Tick line id is obtained while clicking
             * Fix: Pointer events set to none for tick lines
             */
            element = chart.renderer.drawPath(tickOptions);
            this.setPointerEventNone(element);
            appendChildElement(
                chart.enableCanvas, chart.yAxisElements, element,
                chart.redraw, true, 'x', 'y', null, direction
            );
        }
    }

    private renderGridLine(axis: Axis, index: number, majorGrid: string, minorGird: string, gridIndex: number): void {
        let chart: Chart = this.chart;
        let gridOptions: PathOption;
        let direction: string;
        let element: Element;
        if (axis.majorGridLines.width > 0) {
            element = getElement(chart.element.id + '_MajorGridLine_' + index + '_' + gridIndex);
            direction = element ? element.getAttribute('d') : null;
            gridOptions = new PathOption(
                chart.element.id + '_MajorGridLine_' + index + '_' + gridIndex, 'transparent', axis.majorGridLines.width,
                axis.majorGridLines.color || chart.themeStyle.majorGridLine, null, axis.majorGridLines.dashArray, majorGrid
            );
            appendChildElement(
                chart.enableCanvas, this.element, chart.renderer.drawPath(gridOptions), chart.redraw, true, 'x', 'y', null, direction
            );
        }
        if (axis.minorGridLines.width > 0) {
            element = getElement(chart.element.id + '_MinorGridLine_' + index + '_' + gridIndex);
            direction = element ? element.getAttribute('d') : null;
            gridOptions = new PathOption(
                chart.element.id + '_MinorGridLine_' + index + '_' + gridIndex, 'transparent', axis.minorGridLines.width,
                axis.minorGridLines.color || chart.themeStyle.minorGridLine, null, axis.minorGridLines.dashArray, minorGird
            );
            appendChildElement(
                chart.enableCanvas, this.element, chart.renderer.drawPath(gridOptions), chart.redraw, true, 'x', 'y', null, direction
            );
        }
    }

    private setPointerEventNone(element: Element): void {
        if (element) {
            element.setAttribute('style', 'pointer-events:none');
        }
    }
}