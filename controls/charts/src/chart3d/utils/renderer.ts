import { Rect, Size, measureText } from '@syncfusion/ej2-svg-base';
import { Chart3D } from './../chart3D';
import { Chart3DAxis, Visible3DLabels } from '../axis/axis';
import { rotateTextSize } from '../../common/utils/helper';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Chart3DDataElement, Chart3DLabelElement, Chart3DLabelRect, Chart3DPolygon, Chart3DTickPosition, Chart3DBasicTransform, Chart3DWallRect, Chart3DTickElement, Chart3DVector } from '../model/chart3d-Interface';
import { Chart3DTextFontModel } from '../model/chart3d-Interface-model';
import { valueToCoefficients } from './chart3dRender';
/**
 * The WallRenderer class provides methods to update the 3D wall of the chart.
 */
export class WallRenderer {

    /**
     * Updates the 3D wall of the chart based on the chart area type.
     *
     * @param {Chart3D} chart - The Chart3D instance to update the 3D wall for.
     * @returns {void}
     */
    public update3DWall(chart: Chart3D): void {
        this.updateBackWall(chart);
        for (let i: number = 0; i < chart.axisCollections.length; i++) {
            const axis: Chart3DAxis = chart.axisCollections[i as number];
            const opposedPosition: boolean = axis.opposedPosition || axis.isAxisOpposedPosition;
            if (axis.orientation.toLowerCase() === 'vertical') {
                if (!opposedPosition) {
                    this.updateLeftWall(chart);
                }
                else {
                    this.updateRightWall(chart);
                }
            }
            else {
                if (!opposedPosition) {
                    this.updateBottomWall(chart);
                }
                else {
                    this.updateTopWall(chart);
                }
            }
        }
    }

    /**
     * Updates the top wall of the 3D chart based on the specified chart and axis.
     *
     * @param {Chart3D} chart - The Chart3D instance for which the top wall is updated.
     * @returns {void}
     */
    private updateTopWall(chart: Chart3D): void {
        let offset: number = 0;
        const areaBounds: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        const y: number = areaBounds.y;
        if (chart.wallSize < y) {
            offset = y - chart.wallSize;
        }
        else {
            offset = -(chart.wallSize - y);
        }
        const topLeftFrontVector: Chart3DVector = chart.vector.vector3D(areaBounds.x + areaBounds.width, -chart.depth, y - 0.1);
        const bottomRightBackVector: Chart3DVector = chart.vector.vector3D(areaBounds.x, -0.1, offset);
        const topSideWallPlans: Chart3DPolygon[] = chart.polygon.createBox(topLeftFrontVector, bottomRightBackVector, chart, 0, chart.wallColor || chart.themeStyle.leftWallColor, chart.wallColor || chart.themeStyle.leftWallColor, 0, 0.5, false, 'top-wall-brush', chart.chart3D);

        for (let i: number = 0; i < topSideWallPlans.length; i++) {
            chart.polygon.transform(chart.matrixObj.tilt(Math.PI / 2), topSideWallPlans[i as number]);
        }
    }

    /**
     * Updates the right wall of the 3D chart based on the specified chart and axis.
     *
     * @param {Chart3D} chart - The Chart3D instance for which the right wall is updated.
     * @returns {void}
     */
    private updateRightWall(chart: Chart3D): void {
        const areaBounds: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        const x: number = areaBounds.x + areaBounds.width;
        const rightRect: Chart3DWallRect = { left: -chart.depth, top: areaBounds.y, bottom: areaBounds.height + areaBounds.y, right: 0 };
        const topLeftFrontVector: Chart3DVector = chart.vector.vector3D(rightRect.left, rightRect.top, x + 1.5);
        const bottomRightBackVector: Chart3DVector = chart.vector.vector3D(rightRect.right, rightRect.bottom, x + chart.wallSize);
        const rightSideWallPlans: Chart3DPolygon[] = chart.polygon.createBox(topLeftFrontVector, bottomRightBackVector, chart, 0, chart.wallColor || chart.themeStyle.leftWallColor, chart.wallColor || chart.themeStyle.leftWallColor, 0, 0.5, false, 'right-wall-brush', chart.chart3D);
        for (let i: number = 0; i < rightSideWallPlans.length; i++) {
            chart.polygon.transform(chart.matrixObj.turn(-Math.PI / 2), rightSideWallPlans[i as number]);
        }
    }

    /**
     * Updates the back wall of the 3D chart based on the specified chart.
     *
     * @param {Chart3D} chart - The Chart3D instance for which the back wall is updated.
     * @returns {void}
     */
    private updateBackWall(chart: Chart3D): void {
        const areaBounds: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        const topLeftFrontVector: Chart3DVector = chart.vector.vector3D(areaBounds.x, areaBounds.y,
                                                                   chart.depth === 0 ? 1.5 : chart.depth + chart.wallSize);
        const bottomRightBackVector: Chart3DVector = chart.vector.vector3D(
            (areaBounds.x + areaBounds.width), areaBounds.y + areaBounds.height, chart.depth === 0 ? 1.5 : chart.depth);
        chart.polygon.createBox(topLeftFrontVector, bottomRightBackVector, chart, 0, chart.wallColor || chart.themeStyle.backWallColor, chart.wallColor || chart.themeStyle.backWallColor, 0, 0.25, false, 'back-wall-brush', chart.chart3D);
    }

    /**
     * Updates the left wall of the 3D chart based on the specified chart.
     *
     * @param {Chart3D} chart - The Chart3D instance for which the left wall is updated.
     * @returns {void}
     */
    private updateLeftWall(chart: Chart3D): void {
        const areaBounds: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        const leftRect: Chart3DWallRect = { left: -chart.depth, top: areaBounds.y, bottom: areaBounds.height + areaBounds.y, right: 0 };
        const offset: number = areaBounds.x;
        const topLeftFrontVector: Chart3DVector = chart.vector.vector3D(leftRect.left, leftRect.top, offset - 0.1);
        const bottomRightBackVector: Chart3DVector= chart.vector.vector3D(leftRect.right, leftRect.bottom, offset - chart.wallSize);
        const leftSideWallPlans: Chart3DPolygon[] = chart.polygon.createBox(topLeftFrontVector, bottomRightBackVector, chart, 0, chart.wallColor || chart.themeStyle.leftWallColor, chart.wallColor || chart.themeStyle.leftWallColor, 0, 0.5, false, 'left-wall-brush', chart.chart3D);
        for (let i: number = 0; i < leftSideWallPlans.length; i++) {
            chart.polygon.transform(chart.matrixObj.turn(-Math.PI / 2), leftSideWallPlans[i as number]);
        }
    }

    /**
     * Updates the bottom wall of the 3D chart based on the specified chart.
     *
     * @param {Chart3D} chart - The Chart3D instance for which the bottom wall is updated.
     * @returns {void}
     */
    private updateBottomWall(chart: Chart3D): void {
        const areaBounds: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        const y: number = areaBounds.y + areaBounds.height;
        const topLeftFrontVector: Chart3DVector = chart.vector.vector3D((areaBounds.x + areaBounds.width), -chart.depth, chart.wallSize + y);
        const bottomRightBackVector: Chart3DVector = chart.vector.vector3D(areaBounds.x, -0.1, y + 1);

        const bottomSideWallPlans: Chart3DPolygon[] = chart.polygon.createBox(bottomRightBackVector, topLeftFrontVector, chart, 0, chart.wallColor || chart.themeStyle.leftWallColor, chart.wallColor || chart.themeStyle.leftWallColor, 0, 0.5, false, 'bottom-wall-brush', chart.chart3D);
        for (let i: number = 0; i < bottomSideWallPlans.length; i++) {
            chart.polygon.transform(chart.matrixObj.tilt(Math.PI / 2), bottomSideWallPlans[i as number]);
        }
    }
}

/**
 * 3D chart axis render/
 */
export class AxisRenderer {
    /**
     * Draws the 3D axes at the specified index for the given axis and chart.
     *
     * @param {number} index - The index of the axis.
     * @param {Chart3DAxis} axis - The Chart3DAxis instance to draw.
     * @param {Chart3D} chart - The Chart3D instance for which the axes are drawn.
     * @returns {void}
     */
    public drawAxes(index: number, axis: Chart3DAxis, chart: Chart3D): void {
        if (axis.majorGridLines.width) {
            this.drawGridLines3D(axis, chart, index);
        }
        if (axis.visible && axis.internalVisibility && axis.majorTickLines.width) {
            this.renderTicks3D(axis, axis.majorTickLines.height, axis.majorTickLines.width, chart, index);
        }
        if (axis.visible && axis.internalVisibility) {
            this.drawAxisLabel(axis, chart, index);
            this.drawAxisTitle(axis, chart, index);
        }
    }

    /**
     * Draws the title for the specified 3D axis on the given chart.
     *
     * @param {Chart3DAxis} axis - The Chart3DAxis instance for which the title is drawn.
     * @param {Chart3D} chart - The Chart3D instance on which the title is drawn.
     * @param {number} index - The index of the axis.
     * @returns {void}
     */
    private drawAxisTitle(axis: Chart3DAxis, chart: Chart3D, index: number): void {
        if (axis.title) {
            let font: Chart3DTextFontModel = {
                size: axis.titleStyle.size,
                fontWeight: axis.titleStyle.fontWeight,
                fontStyle: axis.titleStyle.fontStyle,
                fontFamily: axis.titleStyle.fontFamily,
                color: axis.titleStyle.color,
                opacity: axis.titleStyle.opacity
            };
            const opposedPosition: boolean = axis.opposedPosition || axis.isAxisOpposedPosition;
            const size: Size = { width: chart.availableSize.width, height: chart.availableSize.height };
            const transform: Chart3DBasicTransform = chart.transform3D.transform3D(size);
            transform.viewingArea = size;
            transform.rotation = 0;
            transform.tilt = 0;
            transform.depth = 100;
            transform.perspectiveAngle = 90;
            chart.transform3D.transform(transform);
            const orientation: string = axis.orientation.toLowerCase();
            const elementSpacing: number = 10;
            if (orientation === 'horizontal') {
                let padding: number = 0;
                const titlesize: number = (measureText(axis.title, axis.titleStyle, chart.themeStyle.axisLabelFont).height / 2);
                if (axis.titleRotation) {
                    padding = axis.titlePadding + (elementSpacing) + axis.labelPadding + (axis.titleSize.height / 2);
                }
                else {
                    padding = axis.titlePadding + titlesize + axis.labelPadding + elementSpacing;
                }
                const xtitleLocation: number = axis.maxLabelSize.height + padding
                const data: Chart3DDataElement = {
                    text: axis.title,
                    location: {
                        x: (axis.rect.width) / 2,
                        y: (xtitleLocation + axis.majorTickLines.height + chart.wallSize)
                    }
                };
                const x1: number = data.location.x + axis.rect.x;
                const y1: number = (opposedPosition) ? (axis.rect.y - data.location.y) : (data.location.y + axis.rect.y);
                const element: Chart3DLabelElement = { width: 0, height: 0, angle: axis.titleRotation ? axis.titleRotation : 0, label: data, textAnchor: 'middle', tag: 'text', font: font, id: chart.element.id + '-svg-axis-title-' + index, child: chart.chart3D };
                element.font.color = element.font.color ? element.font.color : chart.themeStyle.axisTitle;
                element.font.fontFamily = element.font.fontFamily ? element.font.fontFamily : chart.themeStyle.axisTitleFont.fontFamily; 
                chart.graphics.addVisual(chart.polygon.createTextElement(chart.vector.vector3D(x1, y1, 0), element, 10, 10), chart);
            }
            else {
                const titleSize: Size = measureText(axis.title, axis.titleStyle, chart.themeStyle.axisLabelFont);
                let padding: number = 0;
                if (axis.titleRotation) {
                    padding = axis.labelPadding + axis.titlePadding + axis.titleSize.width / 2;
                }
                else {
                    padding = axis.titlePadding + axis.labelPadding;
                }
                const x1: number = (opposedPosition) ? axis.rect.x + ((elementSpacing) + axis.maxLabelSize.width +
                    axis.majorTickLines.height + chart.wallSize + padding) : axis.rect.x - ((elementSpacing) +
                        axis.maxLabelSize.width + axis.majorTickLines.height + chart.wallSize + padding);
                const angle: number = (axis.titleRotation == null ? (opposedPosition ? 90 : -90) : axis.titleRotation) % 360;
                const data: Chart3DDataElement = {
                    text: axis.title,
                    location: {
                        x: titleSize.width / 2,
                        y: 0
                    }
                };
                const y1: number = data.location.y + (axis.rect.y + axis.rect.height) + (((axis.rect.height) / 2) * -1);
                const element: Chart3DLabelElement = { width: titleSize.width, height: titleSize.height, angle: angle, label: data, textAnchor: 'middle', tag: 'text', font: font, id: chart.element.id + '-svg-axis-title-' + index, child: chart.chart3D };
                element.font.color = element.font.color ? element.font.color : chart.themeStyle.axisTitle;
                element.font.fontFamily = element.font.fontFamily ? element.font.fontFamily : chart.themeStyle.axisTitleFont.fontFamily; 
                chart.graphics.addVisual(chart.polygon.createTextElement(chart.vector.vector3D(x1, y1, 0), element, 10, 10), chart);
            }
        }
    }

    /**
     * Trims the specified text to fit within the maximum width, applying the provided labelStyle and font settings.
     *
     * @param {number} maxWidth - The maximum width to fit the text within.
     * @param {string} text - The text to be trimmed.
     * @param {Chart3DTextFontModel} labelStyle - The label style settings to be applied.
     * @param {Chart3DTextFontModel} font - The font settings to be applied.
     * @returns {string} - The trimmed text.
     */
    private textTrim(maxWidth: number, text: string, labelStyle: Chart3DTextFontModel, font: Chart3DTextFontModel): string {
        const textLength: number = text.length;
        let trimmedSize: Size;
        let label: string;
        const textSize: Size = measureText(text, labelStyle, font);
        if (textSize.width > maxWidth) {
            for (let k: number = textLength - 1; k >= 0; --k) {
                label = text.substring(0, k) + '...';
                trimmedSize = measureText(label, labelStyle, font);
                if (trimmedSize.width <= maxWidth) {
                    return label;
                }
            }
            return '';
        } else {
            return text;
        }
    }

    /**
     * Distributes labels into multiple rows based on the specified length, currentX, currentLabel, axis, and font settings.
     *
     * @param {number} length - The length of the labels.
     * @param {number} currentX - The current X-coordinate.
     * @param {Visible3DLabels} currentLabel - The current label settings.
     * @param {Chart3DAxis} axis - The Chart3DAxis instance.
     * @param {Chart3DTextFontModel} font - The font settings to be applied.
     * @returns {void}
     */
    private multipleRows(length: number, currentX: number, currentLabel: Visible3DLabels, axis: Chart3DAxis, font: Chart3DTextFontModel): void {
        let label: Visible3DLabels;
        let pointX: number;
        let labelSize: Size;
        const store: number[] = [];
        let isMultiRows: boolean;
        for (let i: number = length - 1; i >= 0; i--) {
            label = axis.visibleLabels[i as number];
            labelSize = measureText(label.text as string, axis.labelStyle, font);
            pointX = valueToCoefficients(i, axis) * axis.rect.width + axis.rect.x;
            isMultiRows = currentX < (pointX + labelSize.width / 2);
            if (isMultiRows) {
                label.index = label.index ? label.index : 0;
                store.push(label.index);
                currentLabel.index = (currentLabel.index > label.index) ? currentLabel.index : label.index + 1;
            } else {
                currentLabel.index = store.indexOf(label.index) > -1 ? currentLabel.index : label.index;
            }
        }
    }

    /**
     * Draws the labels for the specified 3D axis on the given chart.
     *
     * @param {Chart3DAxis} axis - The Chart3DAxis instance for which the labels are drawn.
     * @param {Chart3D} chart - The Chart3D instance on which the labels are drawn.
     * @param {number} index - The index of the axis.
     * @returns {void}
     */
    private drawAxisLabel(axis: Chart3DAxis, chart: Chart3D, index: number): void {
        const labels: Chart3DLabelRect[] = [];
        let angleValue: number;
        const labelsCount: number = axis.visibleLabels.length;
        const areaBounds: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        const opposedPosition: boolean = axis.opposedPosition || axis.isAxisOpposedPosition;
        const elementSpacing: number = axis.angle ? 5 : 10;
        const y: number = areaBounds.y + (!opposedPosition && areaBounds.height);
        const x: number = areaBounds.x + (opposedPosition && areaBounds.width);

        for (let i: number = 0; i < labelsCount; i++) {
            if (!isNullOrUndefined(axis.visibleLabels[i as number].text)) {
                let x1: number = 0;
                let y1: number = 0;
                let pointX: number;
                axis.visibleLabels[i as number].originalText = axis.visibleLabels[i as number].text as string;
                let textAnchor: string;

                const textSize: Size = measureText(axis.visibleLabels[i as number].text as string,
                                                   axis.labelStyle, chart.themeStyle.axisLabelFont);
                let value: number = (axis.visibleLabels[i as number].value - axis.visibleRange.min) / axis.visibleRange.delta;
                value = axis.isInversed || axis.isAxisInverse ? 1 - value : value;
                value = isNaN(value) ? 0 : value;

                if (axis.orientation.toLowerCase() === 'horizontal') {
                    x1 = Math.round(axis.rect.width * value) + areaBounds.x + axis.plotOffset;
                    y1 = opposedPosition ? (y - chart.wallSize - axis.majorTickLines.height - axis.labelPadding - elementSpacing / 2) :
                        y + chart.wallSize + axis.majorTickLines.height + elementSpacing + axis.labelPadding;
                    textAnchor = 'middle';
                } else {
                    y1 = Math.round(axis.plotOffset + axis.rect.y + (textSize.height / 4) + (axis.rect.height * (1 - value)));
                    let padding: number = 0; 
                    if (axis.labelRotation == 90 || axis.labelRotation == -90 || axis.labelRotation == 270 || axis.labelRotation == -270) {
                        padding = elementSpacing * 2;
                    }
                    else {
                        padding = elementSpacing;
                    }
                    x1 = opposedPosition ? (axis.rect.x + axis.majorTickLines.height + padding + axis.labelPadding) :
                        (x - chart.wallSize - axis.majorTickLines.height - padding + axis.labelPadding);
                    textAnchor = opposedPosition ? (axis.isRTLEnabled ? 'end' : 'start') : (axis.isRTLEnabled ? 'start' : 'end');
                }

                labels.push({ x: x1, y: y1, size: textSize });
                const maxWidth: number = axis.rect.width / axis.visibleLabels.length - 5;
                const label: Chart3DLabelRect = labels[i as number];

                if (((label.x - label.size.width / 2 < axis.rect.x && i === 0) ||
                    (label.x + label.size.width / 2 > axis.rect.x + axis.rect.width && i === axis.visibleLabels.length - 1)) &&
                    axis.labelIntersectAction !== 'Trim' && axis.labelIntersectAction.indexOf('wrap') < 0) {
                    if (axis.edgeLabelPlacement === 'Hide') {
                        continue;
                    } else if (axis.edgeLabelPlacement === 'Shift') {
                        if (i === 0) {
                            label.x = x1 = axis.rect.x + label.size.width / 2;
                        } else if (i === axis.visibleLabels.length - 1) {
                            label.x = x1 = axis.rect.x + axis.rect.width - label.size.width / 2;
                        }
                    }
                }

                if (axis.orientation.toLowerCase() === 'horizontal') {
                    if (axis.labelRotation) {
                        angleValue = axis.labelRotation;
                        const rotatedSize: Size = rotateTextSize(axis.labelStyle,
                                                                 axis.visibleLabels[i as number].text as string, angleValue, chart);
                        y1 += rotatedSize.height / 2;
                    } else {
                        if (axis.labelIntersectAction === 'Trim') {
                            axis.visibleLabels[i as number].text = this.textTrim(maxWidth, axis.visibleLabels[i as number].text as string,
                                                                                 axis.labelStyle, chart.themeStyle.axisLabelFont);
                        }
                        else if (axis.angle && (axis.labelIntersectAction === 'Rotate45' || axis.labelIntersectAction === 'Rotate90')) {
                            const rotatedSize: Size = rotateTextSize(axis.labelStyle, axis.visibleLabels[i as number].text as string,
                                                                     axis.angle, chart);
                            y1 += rotatedSize.height / 2;
                        } else if (axis.labelIntersectAction === 'MultipleRows') {
                            pointX = label.x;
                            pointX -= textSize.width / 2;
                            this.multipleRows(i, pointX, axis.visibleLabels[i as number], axis, chart.themeStyle.axisLabelFont);
                            y1 = axis.visibleLabels[i as number].index ?
                                y1 + axis.visibleLabels[i as number].index * (textSize.height + 5) : y1;
                        } else if (axis.labelIntersectAction === 'Hide') {
                            let isAxisLabelHidden: boolean = false;
                            for (let j: number = 0; j < i; j++) {
                                if (labels[j as number].x + (labels[j as number].size.width / 2) >= labels[i as number].x - (labels[i as number].size.width / 2)) {
                                    isAxisLabelHidden = true;
                                    break;
                                }
                            }
                            if (isAxisLabelHidden) {
                                continue;
                            }
                        }
                    }
                }
                let font: Chart3DTextFontModel = {
                    size: axis.visibleLabels[i as number].labelStyle.size,
                    fontWeight: axis.visibleLabels[i as number].labelStyle.fontWeight,
                    fontStyle: axis.visibleLabels[i as number].labelStyle.fontStyle,
                    fontFamily: axis.visibleLabels[i as number].labelStyle.fontFamily,
                    color: axis.visibleLabels[i as number].labelStyle.color,
                    opacity: axis.visibleLabels[i as number].labelStyle.opacity
                };
                const element: Chart3DLabelElement = {
                    width: textSize.width, height: textSize.height, label: axis.visibleLabels[i as number], textAnchor: textAnchor,
                    tag: 'text', font: font, id: chart.element.id + '-' + index + '-axis-label-' + i, child: chart.chart3D, angle: axis.angle
                };
                element.font.color = element.font.color ? element.font.color : chart.themeStyle.axisLabel;
                element.font.fontFamily = element.font.fontFamily ? element.font.fontFamily : chart.themeStyle.axisLabelFont.fontFamily;
                chart.graphics.addVisual(chart.polygon.createTextElement(chart.vector.vector3D(x1, y1, 0), element, 10, 10), chart);
            }
        }
    }

    /**
     * Renders the 3D ticks for the specified axis with the given size, width, and on the provided chart.
     *
     * @param {Chart3DAxis} axis - The Chart3DAxis instance for which the ticks are rendered.
     * @param {number} size - The size of the ticks.
     * @param {number} width - The width of the ticks.
     * @param {Chart3D} chart - The Chart3D instance on which the ticks are rendered.
     * @param {number} index - The index of the axis.
     * @returns {void}
     */
    private renderTicks3D(axis: Chart3DAxis, size: number, width: number, chart: Chart3D, index: number): void {
        let labelsCount: number = axis.visibleLabels.length;
        let minorTicks: number;
        const areaBounds: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        const ticksbwtLabel: number = (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') ? 0.5 : 0;
        labelsCount += (axis.valueType === 'Category' && labelsCount > 0 && axis.labelPlacement === 'BetweenTicks') ? 1 : 0;
        let labelValue: number;
        for (let i: number = 0; i < labelsCount; i++) {
            if (axis.valueType !== 'DateTimeCategory') {
                labelValue = axis.visibleLabels[i as number] ? axis.visibleLabels[i as number].value - ticksbwtLabel :
                    (axis.visibleLabels[i - 1].value + axis.visibleRange.interval) - ticksbwtLabel;
            }
            else {
                labelValue = axis.visibleLabels[i as number].value ? axis.visibleLabels[i as number].value - ticksbwtLabel
                    : axis.visibleRange.max;
            }
            let x1: number = 0;
            let x2: number = 0;
            let y1: number = 0;
            let y2: number = 0;
            let value: number = (labelValue - axis.visibleRange.min) / axis.visibleRange.delta;
            value = axis.isInversed || axis.isAxisInverse ? 1 - value : value;
            value = isNaN(value) ? 0 : value;
            if (axis.orientation.toLowerCase() === 'horizontal') {
                x2 = x1 = (Math.round(axis.rect.width * value)) + areaBounds.x + axis.plotOffset;
            } else {
                y1 = y2 = Math.round(axis.plotOffset + (axis.rect.height * (1 - value))) + axis.rect.y;
            }
            const position: Chart3DTickPosition = this.calculatePosition3D(axis, size, width, x1, y1, x2, y2, chart);
            const line: Chart3DTickElement = { width: axis.majorTickLines.width, opacity: 1, stroke: axis.majorTickLines.color || chart.themeStyle.majorTickLine, child: chart.chart3D, tag: 'line', id: '' };
            line.id = chart.element.id + '-' + index + '-major-tick-lines-' + i;
            chart.graphics.addVisual(chart.polygon.createLine(line, position.x1, position.y1, position.x2, position.y2, 0), chart);
            if (axis.minorGridLines.width && axis.minorTicksPerInterval > 0 && i < labelsCount - 1) {
                minorTicks = axis.visibleRange.interval / (axis.minorTicksPerInterval + 1);
                for (let k: number = 0; k < axis.minorTicksPerInterval; k++) {
                    value = valueToCoefficients(axis.visibleLabels[i as number].value + (minorTicks * (k + 1)), axis);
                    value = isNaN(value) ? 0 : value;
                    if (axis.orientation.toLowerCase() === 'horizontal') {
                        x1 = x2 = Math.round(axis.plotOffset + (areaBounds.width * value) + areaBounds.x);
                    } else {
                        y1 = y2 = Math.round(axis.plotOffset + ((areaBounds.height) * (1 - value))) + axis.rect.y;
                    }
                    const position: Chart3DTickPosition = this.calculatePosition3D(axis, size, width, x1, y1, x2, y2, chart);
                    const line: Chart3DTickElement = { width: axis.minorTickLines.width, opacity: 0.6, stroke: axis.minorTickLines.color || chart.themeStyle.minorTickLine, child: chart.chart3D, tag: 'line', id: '' };
                    line.id = chart.element.id + '-' + index + '-minor-tick-lines-' + i + '-' + k;
                    chart.graphics.addVisual(chart.polygon.createLine(line, position.x1, position.y1, position.x2, position.y2, 0), chart);
                }
            }
        }
    }

    /**
     * Calculates the 3D position for ticks on the specified axis with the given tickSize, width, and chart dimensions.
     *
     * @param {Chart3DAxis} axis - The Chart3DAxis instance for which the tick position is calculated.
     * @param {number} tickSize - The size of the ticks.
     * @param {number} width - The width of the ticks.
     * @param {number} x1 - The X-coordinate of the starting point.
     * @param {number} y1 - The Y-coordinate of the starting point.
     * @param {number} x2 - The X-coordinate of the ending point.
     * @param {number} y2 - The Y-coordinate of the ending point.
     * @param {Chart3D} chart - The Chart3D instance.
     * @returns {Chart3DTickPosition} - The calculated 3D tick position.
     */
    private calculatePosition3D(axis: Chart3DAxis, tickSize: number, width: number, x1: number,
                                y1: number, x2: number, y2: number, chart: Chart3D): Chart3DTickPosition {
        const isOpposed: boolean = axis.opposedPosition || axis.isAxisOpposedPosition;
        const areaBounds: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        const y: number = areaBounds.y + (!isOpposed && areaBounds.height);
        const x: number = areaBounds.x + (isOpposed && areaBounds.width);
        if (axis.orientation.toLowerCase() === 'horizontal') {
            y1 = 0;
            y2 = isOpposed ? tickSize : y1 + tickSize;
            const screenPositionTop: number = isOpposed ? y - chart.wallSize - tickSize : y + chart.wallSize - (tickSize / 2);
            y1 += screenPositionTop;
            y2 += screenPositionTop;

            x1 = x2 = x1;
        } else {
            x1 = 0;
            x2 = isOpposed ? x1 + tickSize : tickSize;
            const screenPositionLeft: number = isOpposed ? x + chart.wallSize : (x - chart.wallSize - tickSize);
            x1 += screenPositionLeft;
            x2 += screenPositionLeft;

            y1 = y2 = y1;
        }
        return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }

    /**
     * Draws the 3D grid lines for the specified axis on the given chart.
     *
     * @param {Chart3DAxis} axis - The Chart3DAxis instance for which the grid lines are drawn.
     * @param {Chart3D} chart - The Chart3D instance on which the grid lines are drawn.
     * @param {number} index - The index of the axis.
     * @returns {void}
     */
    private drawGridLines3D(axis: Chart3DAxis, chart: Chart3D, index: number): void {
        if (axis == null) {
            return;
        }
        let labelsCount: number = axis.visibleLabels.length;
        let minorTicks: number;
        const opposedPosition: boolean = axis.opposedPosition || axis.isAxisOpposedPosition;
        const orientation: string = axis.orientation;
        let x1: number;
        let x2: number;
        let y1: number;
        let y2: number;
        let labelValue: number;
        const ticksbwtLabel: number = (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') ? 0.5 : 0;
        labelsCount += (axis.valueType === 'Category' && labelsCount > 0 && axis.labelPlacement === 'BetweenTicks') ? 1 : 0;
        const areaBounds: Rect = chart.chartAxisLayoutPanel.seriesClipRect;
        if (orientation.toLowerCase() === 'horizontal') {
            let i: number;
            for (i = 0; i < labelsCount; i++) {
                if (axis.valueType !== 'DateTimeCategory') {
                    labelValue = axis.visibleLabels[i as number] ? axis.visibleLabels[i as number].value - ticksbwtLabel :
                        (axis.visibleLabels[i - 1].value + axis.visibleRange.interval) - ticksbwtLabel;
                }
                else {
                    labelValue = axis.visibleLabels[i as number].value ? axis.visibleLabels[i as number].value - ticksbwtLabel
                        : axis.visibleRange.max;
                }
                let value: number = valueToCoefficients(labelValue, axis);
                value = isNaN(value) ? 0 : value;
                x2 = x1 = (Math.round(axis.rect.width * value)) + areaBounds.x + axis.plotOffset;
                y1 = areaBounds.y;
                y2 = areaBounds.y + areaBounds.height;
                const depth: number = chart.depth > 2 ? chart.depth - 2 : 1;
                const bottom: number = areaBounds.y + (!opposedPosition && areaBounds.height);
                const line: Chart3DTickElement = { opacity: 1, width: axis.majorGridLines.width, stroke: axis.majorGridLines.color || chart.themeStyle.majorGridLine, child: chart.chart3D, tag: 'line', id: '' };
                line.id = chart.element.id + '-' + index + '-grid-lines-' + i;
                chart.graphics.addVisual(chart.polygon.createLine(line, x1, y1, x2, y2, depth), chart);
                const parallelLine: Chart3DTickElement = { opacity: line.opacity, width: line.width, stroke: line.stroke, child: line.child, tag: line.tag, id: '' };
                parallelLine.id = line.id + '-parallel';
                parallelLine.id = chart.element.id + '-' + index + '-parallel-grid-lines-' + i;
                const line3D: Chart3DPolygon = chart.polygon.createLine(parallelLine, x2, 0, x2, -depth, bottom);
                // To fold the gridline alone the wall(bottom)
                chart.polygon.transform(chart.matrixObj.tilt(Math.PI / 2), line3D);
                chart.graphics.addVisual(line3D, chart);
                if (axis.minorGridLines.width && axis.minorTicksPerInterval > 0 && i < labelsCount - 1) {
                    minorTicks = axis.visibleRange.interval / (axis.minorTicksPerInterval + 1);
                    for (let k: number = 0; k < axis.minorTicksPerInterval; k++) {
                        value = valueToCoefficients(axis.visibleLabels[i as number].value + (minorTicks * (k + 1)), axis);
                        value = isNaN(value) ? 0 : value;
                        x2 = x1 = (Math.round(areaBounds.width * value) + areaBounds.x);
                        y1 = areaBounds.y;
                        y2 = areaBounds.y + areaBounds.height;
                        const line: Chart3DTickElement = { opacity: 0.6, width: axis.minorGridLines.width, stroke: axis.minorGridLines.color || chart.themeStyle.minorGridLine, child: chart.chart3D, tag: 'line', id: '' };
                        line.id = chart.element.id + '-' + index + '-minor-grid-lines-' + i + '-' + k;
                        chart.graphics.addVisual(chart.polygon.createLine(line, x1, y1, x2, y2, depth), chart);
                        const parallelLine: Chart3DTickElement = { opacity: line.opacity, width: line.width, stroke: line.stroke, child: line.child, tag: line.tag, id: '' };
                        parallelLine.id = chart.element.id + '-' + index + '-parallel-minor-grid-lines-' + i + '-' + k;
                        const line3D: Chart3DPolygon = chart.polygon.createLine(parallelLine, x2, 0, x2, -depth, bottom);
                        // To fold the gridline alone the wall(bottom)
                        chart.polygon.transform(chart.matrixObj.tilt(Math.PI / 2), line3D);
                        chart.graphics.addVisual(line3D, chart);
                    }
                }
            }
        } else {
            for (let i: number = 0; i < labelsCount; i++) {
                labelValue = axis.visibleLabels[i as number] ? axis.visibleLabels[i as number].value - ticksbwtLabel :
                    (axis.visibleLabels[i - 1].value + axis.visibleRange.interval) - ticksbwtLabel;
                const value: number = (labelValue - axis.visibleRange.min) / axis.visibleRange.delta;
                x1 = areaBounds.x;
                y1 = Math.round((axis.rect.height) * (1 - value)) + 0.5;
                y1 += axis.rect.y;
                x2 = x1 + areaBounds.width;
                y2 = y1;
                const depth: number = chart.depth > 2 ? chart.depth - 2 : 1;
                const line: Chart3DTickElement = { opacity: 1, width: axis.majorGridLines.width, stroke: axis.majorGridLines.color || chart.themeStyle.majorGridLine, axisName: axis.name, child: chart.chart3D, tag: 'line', id: '' };
                line.id = chart.element.id + '-' + index + '-grid-lines-' + i;
                chart.graphics.addVisual(chart.polygon.createLine(line, x1, y1, x2, y2, depth), chart);
                const depthD: number = areaBounds.x + (opposedPosition && areaBounds.width + 1);
                const sideLine: Chart3DTickElement = { opacity: line.opacity, width: line.width, stroke: line.stroke, child: line.child, tag: line.tag, id: '' };
                sideLine.id = chart.element.id + '-' + index + '-parallel-grid-lines-' + i;
                const line3D: Chart3DPolygon = chart.polygon.createLine(sideLine, -depth, y2, 0, y2, depthD);
                // To fold the gridline alone the wall(right of vertical)
                chart.polygon.transform(chart.matrixObj.turn(-Math.PI / 2), line3D);
                chart.graphics.addVisual(line3D, chart);
                if (axis.minorGridLines.width && axis.minorTicksPerInterval > 0 && i < labelsCount - 1) {
                    minorTicks = axis.visibleRange.interval / (axis.minorTicksPerInterval + 1);
                    for (let k: number = 0; k < axis.minorTicksPerInterval; k++) {
                        const value: number = valueToCoefficients(axis.visibleLabels[i as number].value + (minorTicks * (k + 1)), axis);
                        x1 = areaBounds.x;
                        y1 = Math.round((axis.rect.height) * (1 - value)) + 0.5;
                        y1 += axis.rect.y;
                        x2 = x1 + areaBounds.width;
                        y2 = y1;
                        const line: Chart3DTickElement = { opacity: 0.6, width: axis.minorGridLines.width, stroke: axis.minorGridLines.color || chart.themeStyle.minorGridLine, axisName: axis.name, child: chart.chart3D, tag: 'line', id: '' };
                        line.id = chart.element.id + '-' + index + '-minor-grid-lines-' + i + '-' + k;
                        chart.graphics.addVisual(chart.polygon.createLine(line, x1, y1, x2, y2, depth), chart);
                        const sideLine: Chart3DTickElement = { opacity: line.opacity, width: line.width, stroke: line.stroke, child: line.child, tag: line.tag, id: '' };
                        sideLine.id = chart.element.id + '-' + index + '-parallel-minor-grid-lines-' + i + k;
                        const line3D: Chart3DPolygon = chart.polygon.createLine(sideLine, -depth, y2, 0, y2, depthD);
                        // To fold the gridline alone the wall(right of vertical)
                        chart.polygon.transform(chart.matrixObj.turn(-Math.PI / 2), line3D);
                        chart.graphics.addVisual(line3D, chart);
                    }
                }
            }
        }
    }
}
