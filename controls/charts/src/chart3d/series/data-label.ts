
import { Chart3D } from '../chart3D';
import { Chart3DSeries, Chart3DPoint } from './chart-series';
import { Chart3DDataLabelSettingsModel } from './chart-series-model';
import { Rect, Size, measureText } from '@syncfusion/ej2-svg-base';
import { Chart3DTextRenderEventArgs, Chart3DLabelElement, Chart3DLocation, Chart3DPolygon, Chart3DVector, Chart3DTickElement } from '../model/chart3d-Interface';
import { textRender } from '../../common/model/constants';
import { createElement } from '@syncfusion/ej2-base';
import { ConnectorLineStyleModel, MarginModel } from '../../common/model/base-model';
import { ColorValue, appendChildElement, colorNameToHex, convertHexToColor, getFontStyle, getTemplateFunction, isCollide, measureElementRect, withIn } from '../../common/utils/helper';
import { Chart3DAxis } from '../axis/axis';
import { Chart3DTextFontModel } from '../model/chart3d-Interface-model';

/**
 * The `DataLabel` module is used to render data label for the data point.
 */
export class DataLabel3D {

    private chart: Chart3D;
    private margin: MarginModel;
    private fontBackground: string;
    /** @private */
    public repositionedLabels: Rect[] = [];
    /**
     * Constructor for the data label module.
     *
     * @param {Chart3D} chart - Chart3D instance.
     * @private
     */
    constructor(chart: Chart3D) {
        this.chart = chart;
    }

    /**
     * Renders a 3D series on a 3D chart with data labels.
     *
     * @param {Chart3DSeries} series - The 3D series to be rendered.
     * @param {Chart3D} chart - The 3D chart on which the series is rendered.
     * @param {Chart3DDataLabelSettingsModel} dataLabel - The data label style for the series.
     * @returns {void}
     */
    public render(series: Chart3DSeries, chart: Chart3D, dataLabel: Chart3DDataLabelSettingsModel): void {
        let point: Chart3DPoint;
        const templateId: string = chart.element.id + '-series-' + series.index + '-data-label-collections';
        series.dataLabelElement = createElement('div', { id: templateId });
        for (let i: number = 0; i < series.visiblePoints.length; i++) {
            point = series.visiblePoints[i as number];
            if (point.visible) {
                this.draw3DDataLabel(series, point.index, point, chart, dataLabel);
            }
        }
        if (series.dataLabel.template) {
            appendChildElement(false, document.getElementById(this.chart.element.id + '_Secondary_Element'), series.dataLabelElement, chart.redraw, false, 'x', 'y', null, '', false, false, null);
        }
    }

    /**
     * Draws data labels for a specific data point in a 3D series on a 3D chart.
     *
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs.
     * @param {number} pointIndex - The index of the data point within the series.
     * @param {Chart3DPoint} point - The data point for which data labels are drawn.
     * @param {Chart3D} chart - The 3D chart that contains the series and data point.
     * @param {Chart3DDataLabelSettingsModel} dataLabel - The style for data labels.
     * @returns {void}
     */
    private draw3DDataLabel(series: Chart3DSeries, pointIndex: number, point: Chart3DPoint, chart: Chart3D,
                            dataLabel: Chart3DDataLabelSettingsModel): void {
        let pointX: number;
        let pointY: number;
        const xOffset: number = 0;
        const yOffset: number = 0;
        const commonEventArgs: {
            data: {
                text: string, location: { x: number, y: number },
                series: Chart3DSeries, pointIndex: number, Text?: string
            }
        } = { data: null };
        const pointText: string = this.getLabelText(point, series, this.chart)[0];
        const textSize: Size = measureText(pointText as string, dataLabel.font, this.chart.themeStyle.datalabelFont);
        const location: Chart3DLocation = chart.svg3DRenderer.transform3DToVisible(series, point.symbolLocations.x,
                                                                                   point.symbolLocations.y, chart);
        pointY = location.y;
        pointX = location.x;
        if (series.dataLabel.position === 'Bottom') {
            pointY = location.y + yOffset;
        } else {
            pointY = location.y - yOffset;
        }
        pointX = location.x + xOffset;

        // Calculate point region boundaries by transforming the front rectangle corners
        // Transform top-left corner (point.left, point.top)
        const topLeftFront: Chart3DLocation = chart.svg3DRenderer.transform3DToVisible(
            series, point.left, point.top, chart);
        // Transform bottom-right corner (point.right, point.bottom)
        const bottomRightFront: Chart3DLocation = chart.svg3DRenderer.transform3DToVisible(
            series, point.right, point.bottom, chart);
        // Create point region rect for boundary checking
        const pointRegionRect: Rect = new Rect(
            Math.min(topLeftFront.x, bottomRightFront.x), Math.min(topLeftFront.y, bottomRightFront.y),
            Math.abs(bottomRightFront.x - topLeftFront.x), Math.abs(bottomRightFront.y - topLeftFront.y));
        commonEventArgs.data = {
            text: pointText,
            location: { x: pointX, y: pointY },
            series: series,
            pointIndex: pointIndex
        };
        commonEventArgs.data.Text = commonEventArgs.data.text;
        const argsData: Chart3DTextRenderEventArgs = {
            cancel: false, series: series,
            point: point, text: pointText, border: dataLabel.border,
            color: dataLabel.fill, template: dataLabel.template, textStyle: dataLabel.font
        };
        chart.trigger(textRender, argsData);
        this.fontBackground = series.dataLabel.position === 'Middle' ? argsData.color === 'transparent' ? point.color : argsData.color : argsData.color;
        commonEventArgs.data.text = argsData.text;

        // Create label rect at current position to check for collision
        let labelRect: Rect = new Rect(pointX - (textSize.width / 2), pointY - (textSize.height / 2), textSize.width, textSize.height);
        const isStackingColumn: boolean = series.type === 'StackingColumn';
        const isStackingBar: boolean = series.type === 'StackingBar';
        // Check if label is outside the point region rect
        const isLabelOutsidePointRegion: boolean = !(
            isStackingBar ? labelRect.x >= pointRegionRect.x && labelRect.x + labelRect.width <= pointRegionRect.x + pointRegionRect.width :
                labelRect.y >= pointRegionRect.y && labelRect.y + labelRect.height <= pointRegionRect.y + pointRegionRect.height
        );

        // Also ensure label stays within chart bounds
        const chartBounds: Rect = new Rect(0, 0, chart.element.clientWidth, chart.element.clientHeight);

        // Check if label collides with existing labels
        let hasCollision: boolean = false;
        for (const existingRect of this.chart.dataLabelCollections) {
            if (isCollide(labelRect, [existingRect], chartBounds)) {
                hasCollision = true;
                break;
            }
        }

        // Enable smart repositioning if label is outside point region OR collides with other labels OR outside chart bounds.
        const isRelocateAction: boolean = dataLabel.labelIntersectAction === 'RelocateVertically' ||
            dataLabel.labelIntersectAction === 'RelocateHorizontally';
        const shouldUseSmartReposition: boolean = (hasCollision || isLabelOutsidePointRegion) &&
            isRelocateAction && (isStackingColumn || isStackingBar);

        let repositionedLabelLocation: Chart3DLocation = { x: pointX, y: pointY };

        // Apply smart repositioning if collision detected
        if (shouldUseSmartReposition && !argsData.cancel) {
            const textPadding: number = 3;
            let xPos: number = pointX;
            let yPos: number = textSize.height + chart.initialClipRect.y;

            // Repositioning logic for StackingColumn series
            if (isStackingColumn) {
                // Calculate repositioned label position for StackingColumn
                if (dataLabel.labelIntersectAction === 'RelocateHorizontally') {
                    // Start at the left edge of the point's column region, on the first row.
                    const pointLeftEdgeX: number = pointRegionRect.x;
                    const pointRightEdgeX: number = pointRegionRect.x + pointRegionRect.width;
                    xPos = pointLeftEdgeX + textPadding;

                    const rowThreshold: number = Math.max(5, textSize.height * 0.2);

                    // If the label no longer fits within the point region width, wrap to the next row.
                    let needsRowCheck: boolean = true;
                    let rowCheckGuard: number = 0;
                    // Limits the row search to 50 iterations as a safeguard. In practice,
                    // only a few stacked labels can fit within the available chart height.
                    const maxRowChecks: number = 50;
                    while (needsRowCheck && rowCheckGuard < maxRowChecks) {
                        rowCheckGuard++;
                        needsRowCheck = false;
                        const labelYMin: number = yPos - textSize.height / 2;
                        const labelYMax: number = yPos + textSize.height / 2;

                        for (const existingRect of this.repositionedLabels) {
                            // Only consider labels that belong to this point's column region.
                            const samePoint: boolean = existingRect.x >= pointLeftEdgeX - textSize.width &&
                                existingRect.x < pointRightEdgeX;

                            if (samePoint) {
                                // Check if this existing label is in approximately the same row (Y range overlap)
                                const existingYMin: number = existingRect.y;
                                const existingYMax: number = existingRect.y + existingRect.height;

                                // ONLY check labels in the CURRENT row - not previous rows
                                if ((labelYMin <= existingYMax + rowThreshold) && (labelYMax >= existingYMin - rowThreshold)) {
                                    xPos = Math.max(xPos, existingRect.x + existingRect.width + (textSize.width / 2) +
                                     dataLabel.margin.left + dataLabel.margin.right + textPadding);
                                }
                            }
                        }

                        // Check if label exceeds the point region width - if yes, wrap to next row
                        if (xPos > pointRightEdgeX) {
                            // Wrap to next row and re-run the collision check against the new row
                            yPos = yPos + textSize.height + textPadding;
                            xPos = pointLeftEdgeX + (textPadding * rowCheckGuard);
                            needsRowCheck = true;
                        }
                    }
                } else {
                    // StackingColumn RelocateVertically: anchor the first label in this column to the
                    // data point's actual screen Y so the label is visually associated with the column.
                    const normalizedOffset: number = (dataLabel.smartLabelSettings && dataLabel.smartLabelSettings.offset !== undefined &&
                        dataLabel.smartLabelSettings.offset >= 0 && dataLabel.smartLabelSettings.offset <= 1
                        ? dataLabel.smartLabelSettings.offset : 0.5);
                    xPos = pointRegionRect.x + (pointRegionRect.width * normalizedOffset);
                    // Compute the horizontal bounds of the current column so we only bump yPos for
                    // labels that belong to this column (N3 — column-scoped collision detection).
                    const columnLeftX: number = pointRegionRect.x;
                    const columnRightX: number = pointRegionRect.x + pointRegionRect.width;
                    for (const existingRect of this.repositionedLabels) {
                        // Skip labels that belong to a different column.
                        const inSameColumn: boolean = existingRect.x >= columnLeftX - textSize.width &&
                            existingRect.x < columnRightX;
                        if (!inSameColumn) {
                            continue;
                        }
                        // Within the same column, only push the label down when the existing label
                        // overlaps horizontally with the proposed position.
                        if (existingRect.x < xPos + textSize.width && existingRect.x + existingRect.width > xPos - textSize.width) {
                            yPos = Math.max(yPos, existingRect.y + existingRect.height + textSize.height + (textPadding * 2));
                        }
                    }
                }
                if (yPos + labelRect.height > pointRegionRect.y && yPos < chart.initialClipRect.y + chart.initialClipRect.height) {
                    yPos = chart.initialClipRect.y + chart.initialClipRect.height + textSize.height + textPadding;
                }
            } else {
                // Repositioning logic for StackingBar series - position on the right with horizontal stacking (stacking to the left)
                // Calculate y-position based on point region center
                const normalizedOffset: number = dataLabel.labelIntersectAction === 'RelocateHorizontally' ? 0 : (dataLabel.smartLabelSettings && dataLabel.smartLabelSettings.offset !== undefined &&
                        dataLabel.smartLabelSettings.offset >= 0 && dataLabel.smartLabelSettings.offset <= 1
                    ? dataLabel.smartLabelSettings.offset : 0.5);
                const pointRegionCenterY: number = pointRegionRect.y + (pointRegionRect.height * normalizedOffset);
                yPos = pointRegionCenterY;

                // Start from the right edge of the chart
                const chartWidth: number = chart.initialClipRect.x + chart.initialClipRect.width;
                xPos = this.chart.enableRtl ? (textPadding * 2) : chartWidth - (textSize.width + (textPadding * 2));

                // Calculate label bounds for collision detection. The label is text-anchored at 'middle'
                // so the vertical center of the label is `yPos` (matching the StackingColumn branch's
                // `yPos - textSize.height / 2` / `yPos + textSize.height / 2` formula).
                const labelYMin: number = yPos - textSize.height / 2;
                const labelYMax: number = yPos + textSize.height / 2;
                // Use the same row-overlap formula as the StackingColumn branch so the two series types
                // behave consistently when labels from neighboring rows are close together.
                const rowThreshold: number = Math.max(5, textSize.height * 0.2);

                // Check for overlapping labels - stack them horizontally to the left
                for (const existingRect of this.repositionedLabels) {
                    const existingYMin: number = existingRect.y;
                    const existingYMax: number = existingRect.y + existingRect.height;

                    // If labels overlap in Y-axis range (with a small tolerance), they're in the same
                    // row — stack them horizontally to the left. Symmetric to the StackingColumn branch.
                    if ((labelYMin <= existingYMax + rowThreshold) && (labelYMax >= existingYMin - rowThreshold)) {
                        // Position this label to the left of the existing one
                        xPos = this.chart.enableRtl ? Math.max(xPos, existingRect.x + existingRect.width + (textSize.width) + textPadding)
                            : Math.min(xPos, existingRect.x - (textSize.width) - (textPadding * 2));
                        if (dataLabel.labelIntersectAction === 'RelocateHorizontally') {
                            yPos += textPadding;
                            if (yPos > pointRegionRect.y + pointRegionRect.height){
                                yPos = pointRegionCenterY;
                            }
                        }
                    }
                }
                if ((xPos - textSize.width) < pointRegionRect.x + pointRegionRect.width && !this.chart.enableRtl) {
                    xPos = chart.initialClipRect.x - textSize.width;
                }
            }

            repositionedLabelLocation = { x: xPos, y: yPos };
            labelRect = new Rect(xPos - textSize.width / 2, yPos - textSize.height / 2, textSize.width, textSize.height);
            this.repositionedLabels.push(labelRect);
            // Anchor the connector to the actual rendered label bounding box. The label is text-anchored
            // at 'middle' so the horizontal center of the label is `repositionedLabelLocation.x`. The
            // connector line should land at the edge of the label closest to the data point so there
            // is no visible gap between the line and the label.
            //   - StackingColumn: connector comes from above, lands at the label's bottom edge.
            //   - StackingBar:    connector comes from the right, lands at the label's left edge.
            const labelAnchor: Chart3DLocation = isStackingBar
                ? { x: labelRect.x, y: repositionedLabelLocation.y }
                : { x: repositionedLabelLocation.x, y: labelRect.y + labelRect.height };

            // Anchor the connector source at the data point's actual screen position. For
            // StackingColumn this is the top of the column region; for StackingBar this is the right edge of the bar.
            const sourceAnchor: Chart3DLocation = isStackingBar
                ? { x: pointRegionRect.x + pointRegionRect.width, y: yPos }
                : { x: xPos, y: pointRegionRect.y };

            this.drawConnectorLine(labelAnchor, sourceAnchor, series, point, dataLabel);
        }

        if (!series.dataLabel.template && commonEventArgs.data.Text !== '' && !argsData.cancel) {
            /**
             * The element object for data label.
             */
            const element: Chart3DLabelElement = {
                tag: 'dataLabel',
                series: series,
                point: point,
                pointIndex: pointIndex,
                id: chart.svgObject.id + series.index + '-data-label' + pointIndex,
                child: chart.chart3D,
                smartLabelSettings: shouldUseSmartReposition ? dataLabel.smartLabelSettings : null
            };
            chart.graphics.addVisual(
                chart.polygon.createTextElement(
                    chart.vector.vector3D(repositionedLabelLocation.x, repositionedLabelLocation.y, point.symbolLocations.z), element, 0,
                    -textSize.height), chart
            );
        }
        const tag: string = !(series.dataLabel && series.dataLabel.template ) ? 'text' : 'template';
        const backgroundColor: string = this.fontBackground === 'transparent' ? ((this.chart.theme.indexOf('Dark') > -1 || this.chart.theme === 'HighContrast') ? '#000000' : '#FFFFFF') : this.fontBackground;
        const rgbValue: ColorValue = convertHexToColor(colorNameToHex(backgroundColor));
        const contrast: number = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
        const font: Chart3DTextFontModel = {
            size: argsData.textStyle.size || this.chart.themeStyle.datalabelFont.size,
            fontWeight: argsData.textStyle.fontWeight || this.chart.themeStyle.datalabelFont.fontWeight,
            fontStyle: argsData.textStyle.fontStyle || chart.themeStyle.datalabelFont.fontStyle,
            fontFamily: argsData.textStyle.fontFamily || this.chart.themeStyle.datalabelFont.fontFamily,
            color: argsData.textStyle.color || (shouldUseSmartReposition ? this.chart.themeStyle.tooltipLabelFont.color : this.chart.theme === 'Bootstrap5' ? '#212529' : this.chart.theme === 'Bootstrap5Dark' ? '#DEE2E6' : argsData.textStyle.color),
            opacity: argsData.textStyle.opacity
        };
        const element: Chart3DLabelElement = {
            width: textSize.width,
            height: textSize.height,
            label: commonEventArgs.data,
            textAnchor: 'middle',
            tag: tag,
            font: font,
            angle: series.dataLabel.angle,
            id: chart.element.id + '-svg' + '-series-' + series.index + '-point-' + pointIndex + '-data-label',
            child: chart.chart3D,
            argsData: argsData,
            fill: (contrast >= 128) ? (this.chart.theme.indexOf('Tailwind3') > -1 ? '#111827' : '#000000') : '#FFFFFF'
        };
        if (!argsData.cancel) {
            chart.graphics.addVisual(
                chart.polygon.createTextElement(
                    chart.vector.vector3D(repositionedLabelLocation.x, repositionedLabelLocation.y, point.symbolLocations.z), element, 0,
                    -textSize.height), chart);
        }
    }

    /**
     * Draws the connector line between the relocated label and its corresponding
     * data point, and renders an arrow pointer when enabled.
     *
     * @param {Chart3DLocation} labelLocation - The location of the repositioned label.
     * @param {Chart3DLocation} pointLocation - The location of the data point.
     * @param {Chart3DSeries} series - The series associated with the data label.
     * @param {Chart3DPoint} point - The data point.
     * @param {Chart3DDataLabelSettingsModel} dataLabel - The data label settings.
     * @returns {void}
     * @private
     */
    private drawConnectorLine(
        labelLocation: Chart3DLocation, pointLocation: Chart3DLocation, series: Chart3DSeries,
        point: Chart3DPoint, dataLabel: Chart3DDataLabelSettingsModel
    ): void {
        // Guard against missing `smartLabelSettings` or `connectorLineStyle`. A user that only configures
        // `background`/`border`/`pointerShape` should not throw a `TypeError` here. When no style is
        // supplied we fall back to the theme defaults (color = tooltipFill, width = 1).
        if (!dataLabel.smartLabelSettings) {
            return;
        }
        const connectorStyle: ConnectorLineStyleModel = dataLabel.smartLabelSettings.connectorLineStyle || {};
        const stroke: string = connectorStyle.color || this.chart.themeStyle.tooltipFill;
        const width: number = connectorStyle.width != null ? connectorStyle.width : 1;
        const opacity: number = connectorStyle.opacity != null ? connectorStyle.opacity : 1;

        // Create connector line element using the correct Chart3DTickElement interface
        const connectorElement: Chart3DTickElement = {
            width: width,
            opacity: opacity,
            stroke: stroke,
            child: this.chart.chart3D,
            tag: 'line',
            id: this.chart.element.id + '-datalabel-series-' + series.index + '-connector-' + point.index
        };

        // Add connector line to graphics using createLine with individual x, y coordinates
        // createLine(element, x1, y1, x2, y2, depth)
        const connectorLine: Chart3DPolygon = this.chart.polygon.createLine(
            connectorElement,
            pointLocation.x,
            pointLocation.y,
            labelLocation.x,
            labelLocation.y,
            0
        );
        this.chart.graphics.addVisual(connectorLine, this.chart);

        // Draw arrow pointer if enabled
        if (dataLabel.smartLabelSettings.pointerShape === 'Arrow') {
            this.drawArrowPointer(labelLocation, pointLocation, stroke, width, series, point, opacity);
        }
    }

    /**
     * Draws a filled arrow pointer at the data point location.
     *
     * @param {Chart3DLocation} labelLocation - The location of the label.
     * @param {Chart3DLocation} pointLocation - The location of the data point.
     * @param {string} stroke - The color of the arrow.
     * @param {number} width - The width of the arrow lines.
     * @param {Chart3DSeries} series - The series associated with the data label.
     * @param {Chart3DPoint} point - The data point.
     * @param {number} opacity - The opacity of the arrow.
     * @returns {void}
     * @private
     */
    private drawArrowPointer(
        labelLocation: Chart3DLocation, pointLocation: Chart3DLocation, stroke: string, width: number,
        series: Chart3DSeries, point: Chart3DPoint, opacity: number = 1
    ): void {
        // Minimum visible arrow size (8 px) ensures the pointer remains legible for thin
        // connector lines; larger arrows scale up with the connector line width (×4).
        const minArrowSize: number = 8;
        const arrowSize: number = Math.max(minArrowSize, width * 4);
        // Direction is computed from the label back to the data point so the arrow's apex
        // sits exactly on the data point (i.e. the arrow "points at" the data point).
        const dx: number = pointLocation.x - labelLocation.x;
        const dy: number = pointLocation.y - labelLocation.y;
        const distance: number = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) {
            return;
        }

        // Unit vector from the label towards the data point.
        const dirX: number = dx / distance;
        const dirY: number = dy / distance;

        // Apex of the arrow (tip) is at the data point location.
        const arrowTipX: number = pointLocation.x;
        const arrowTipY: number = pointLocation.y;

        // The base of the arrow sits on the label-side of the data point along the connector line,
        // at a distance of `arrowSize` back from the apex. This gives the triangle its full length
        // so the arrow visually points from the label toward the data point.
        const baseCenterX: number = arrowTipX - dirX * arrowSize;
        const baseCenterY: number = arrowTipY - dirY * arrowSize;

        // Perpendicular unit vector to the connector line direction, used to split the base
        // into left/right corners.
        const perpX: number = -dirY;
        const perpY: number = dirX;

        // Left/right base corners, offset perpendicular to the connector line by half the arrow size.
        const leftX: number = baseCenterX + perpX * (arrowSize / 2);
        const leftY: number = baseCenterY + perpY * (arrowSize / 2);

        const rightX: number = baseCenterX - perpX * (arrowSize / 2);
        const rightY: number = baseCenterY - perpY * (arrowSize / 2);

        const arrowPoints: Chart3DVector[] = [
            this.chart.vector.vector3D(arrowTipX, arrowTipY, 0),
            this.chart.vector.vector3D(leftX, leftY, 0),
            this.chart.vector.vector3D(rightX, rightY, 0)
        ];

        const arrowPolygon: Chart3DPolygon = this.chart.polygon.polygon3D(
            arrowPoints,
            'arrow',
            0,
            stroke,
            0,
            opacity,
            stroke,
            'datalabel-arrow-' + point.index + '-' + series.index,
            this.chart.chart3D
        );
        this.chart.graphics.addVisual(arrowPolygon, this.chart);
    }

    /**
     * Gets the text for data labels associated with a specific data point in a 3D series.
     *
     * @param {Chart3DPoint} currentPoint - The data point for which data label text is generated.
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs.
     * @param {Chart3D} chart - The 3D chart containing the series and data point.
     * @returns {string[]} An array of text for data labels.
     */
    private getLabelText(currentPoint: Chart3DPoint, series: Chart3DSeries, chart: Chart3D): string[] {
        const labelFormat: string = series.dataLabel.format ? series.dataLabel.format : series.yAxis.labelFormat;
        const text: string[] = [];
        const customLabelFormat: boolean = labelFormat.match('{value}') !== null;
        text.push(currentPoint.text || currentPoint.yValue.toString());
        if ((labelFormat || chart.useGroupingSeparator) && !currentPoint.text) {
            series.yAxis.format = chart.intl.getNumberFormat({
                format: customLabelFormat ? '' : labelFormat,
                useGrouping: chart.useGroupingSeparator
            });
            for (let i: number = 0; i < text.length; i++) {
                text[i as number] = customLabelFormat ? labelFormat.replace('{value}', series.yAxis.format(parseFloat(text[i as number]))) :
                    series.yAxis.format(parseFloat(text[i as number]));
            }
        }
        return text;
    }

    /**
     * Creates a data label template for a specific data point in a 3D series.
     *
     * @param {HTMLElement} parentElement - The parent HTML element to which the data label template is attached.
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs.
     * @param {Chart3DDataLabelSettingsModel} dataLabel - The style settings for data labels.
     * @param {Chart3DPoint} point - The data point for which the data label template is created.
     * @param {Chart3DTextRenderEventArgs} data - The text render event arguments.
     * @param {number} labelIndex - The index of the data label.
     * @param {boolean} redraw - Indicates whether the template should be redrawn.
     * @param {Chart3DLocation} location - The location values for the data label.
     * @returns {void}
     * @private
     */
    public createDataLabelTemplate(
        parentElement: HTMLElement, series: Chart3DSeries,
        dataLabel: Chart3DDataLabelSettingsModel, point: Chart3DPoint, data: Chart3DTextRenderEventArgs, labelIndex: number,
        redraw: boolean, location: Chart3DLocation
    ): void {
        this.margin = { left: 0, right: 0, bottom: 0, top: 0 };
        const clip: Rect = series.clipRect;
        const childElement: HTMLElement = this.createTemplate(
            createElement('div', {
                id: this.chart.element.id + '-series-' + series.index + '-data-label-' + labelIndex,
                styles: 'position: absolute;background-color:' + data.color + ';' +
                    getFontStyle(dataLabel.font, this.chart.themeStyle.datalabelFont) + ';border:' + data.border.width + 'px solid ' + data.border.color + ';'
            }),
            data.template, this.chart, point, series, this.chart.element.id + '-data-label-', labelIndex, location );
        this.calculateTemplateLabelSize(parentElement, childElement, point, series, dataLabel, clip, redraw, location);
    }

    /**
     * Calculates the size of a data label template for a specific data point in a 3D series.
     *
     * @param {HTMLElement} parentElement - The parent HTML element containing the data label template.
     * @param {HTMLElement} childElement - The child HTML element representing the data label template.
     * @param {Chart3DPoint} point - The data point for which the data label template size is calculated.
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs.
     * @param {Chart3DDataLabelSettingsModel} dataLabel - The style for data labels.
     * @param {Rect} clip - The rectangular clipping area.
     * @param {boolean} redraw - Indicates whether the template should be redrawn.
     * @param {Chart3DLocation} location - The location values for the data label.
     * @param {boolean} isReactCallback - Indicates whether the callback is associated with React.
     * @returns {void}
     * @private
     */
    public calculateTemplateLabelSize(
        parentElement: HTMLElement, childElement: HTMLElement, point: Chart3DPoint, series: Chart3DSeries,
        dataLabel: Chart3DDataLabelSettingsModel, clip: Rect, redraw: boolean,
        location: Chart3DLocation, isReactCallback?: boolean
    ): void {
        const elementRect: ClientRect = measureElementRect(childElement, redraw, isReactCallback);
        const rect: Rect = { x: 0, y: 0, width: 0, height: 0 };
        const rectPosition: {left: number, top: number, right: number} = this.calculateTextPosition( series, point, elementRect, location);
        const clipWidth: number = 0;
        const clipHeight: number = 0;
        let isOverlap: boolean = false;
        if (isReactCallback) {
            isOverlap = (elementRect.width === 0 || elementRect.height === 0); // To check the data label already overlap before react callback call
        }
        childElement.style.left = (rectPosition.left - clipWidth) + 'px';
        childElement.style.top = (rectPosition.top + clipHeight) + 'px';
        const backgroundColor: string = this.fontBackground === 'transparent' ? (this.chart.theme.indexOf('Dark') > -1 ? 'black' : 'white') : this.fontBackground;
        const rgbValue: ColorValue = convertHexToColor(colorNameToHex(backgroundColor));
        const vAxis: Chart3DAxis = series.chart.requireInvertedAxis ? series.xAxis : series.yAxis;
        const hAxis: Chart3DAxis = series.chart.requireInvertedAxis ? series.yAxis : series.xAxis;
        childElement.style.color = dataLabel.font.color || this.chart.theme === 'Bootstrap5' ? '#212529' : this.chart.theme === 'Bootstrap5Dark' ? '#DEE2E6' :
            ((Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000)) >= 128 ? this.chart.theme.indexOf('Tailwind3') > -1 ? '#111827' : 'black' : this.chart.theme.indexOf('Tailwind3') > -1 ? '#FFFFFF' : 'white');
        if (childElement.childElementCount && !isOverlap && (!isCollide(rect, this.chart.dataLabelCollections, clip))
            && (point.yValue === undefined ||
                withIn(point.yValue, series.yAxis.visibleRange) || (series.type.indexOf('Stacking') > -1) ||
                (series.type.indexOf('100') > -1 && withIn(series.stackedValues.endValues[point.index], series.yAxis.visibleRange))) &&
            withIn(point.xValue, series.xAxis.visibleRange) && parseFloat(childElement.style.top) >= vAxis.rect.y &&
            parseFloat(childElement.style.left) >= hAxis.rect.x &&
            parseFloat(childElement.style.top) <= vAxis.rect.y + vAxis.rect.height &&
            parseFloat(childElement.style.left) <= hAxis.rect.x + hAxis.rect.width
        ) {
            this.chart.dataLabelCollections.push(new Rect(
                rect.x + clip.x, rect.y + clip.y, rect.width, rect.height
            ));
            appendChildElement(false, parentElement, childElement, redraw, true, 'left', 'top');
        }
    }

    /**
     * Calculates the text position for a data label associated with a specific data point in a 3D series.
     *
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs.
     * @param {Chart3DPoint} point - The data point for which the text position is calculated.
     * @param {ClientRect} elementSize - The size of the data label element.
     * @param {Chart3DLocation} location - The location values for the data label.
     * @returns {{ left: number, top: number, right: number }} An object representing the left, top, and right positions of the text.
     */
    private calculateTextPosition(series: Chart3DSeries, point: Chart3DPoint, elementSize: ClientRect,
                                  location: Chart3DLocation): { left: number, top: number, right: number } {
        const width: number = elementSize.width / 2;
        const height: number = elementSize.height;
        let left: number;
        let top: number;
        let right: number;
        if (series.type.indexOf('Bar') !== -1) {
            left = location.x - width;
            top = location.y - height + series.xAxis.plotOffset;
            right = location.x + width;
        } else {
            left = location.x - width;
            top = location.y - height;
            right = location.x + width;
        }
        return { left: left, top: top, right: right };
    }

    /**
     * Renders a React template for a data label associated with a specific data point in a 3D series.
     *
     * @param {HTMLElement} childElement - The child HTML element for the React template.
     * @param {Chart3D} chart - The 3D chart that contains the series and data point.
     * @param {Chart3DPoint} point - The data point for which the React template is rendered.
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs.
     * @param {number} labelIndex - The index of the data label.
     * @param {boolean} redraw - Indicates whether the template should be redrawn.
     * @param {Chart3DLocation} location - The location values for the data label.
     * @returns {void}
     */
    private chartReactTemplate(
        childElement: HTMLElement, chart: Chart3D, point: Chart3DPoint, series: Chart3DSeries,
        labelIndex: number, redraw?: boolean, location?: Chart3DLocation
    ): void {
        const parentElement: HTMLElement = document.getElementById(
            chart.element.id + '-series-' + series.index + '-data-label-collections'
        );
        if (parentElement) {
            if (point.index === 0) {
                chart.dataLabelCollections = []; // clear old datalabel bounds for react callback
            }
            chart.dataLabel3DModule.calculateTemplateLabelSize(
                parentElement, childElement, point, series, series.dataLabel,
                series.clipRect, redraw, location, true
            );
        }
    }

    /**
     * Creates a template element for rendering data labels associated with a specific data point in a 3D series.
     *
     * @param {HTMLElement} childElement - The child HTML element to contain the template content.
     * @param {string | Function} content - The content or function for the data label template.
     * @param {Chart3D} chart - The 3D chart containing the series and data point.
     * @param {Chart3DPoint} point - The data point for which the template is created (optional).
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs (optional).
     * @param {string} dataLabelId - The ID for the data label element (optional).
     * @param {number} labelIndex - The index of the data label (optional).
     * @param {Chart3DLocation} location - The location values for the data label (optional).
     * @param {boolean} redraw - Indicates whether the template should be redrawn (optional).
     * @returns {HTMLElement} The created template element.
     */
    private createTemplate(
        childElement: HTMLElement, content: string | Function, chart: Chart3D,
        point?: Chart3DPoint, series?: Chart3DSeries, dataLabelId?: string,
        labelIndex?: number, location?: Chart3DLocation, redraw?: boolean
    ): HTMLElement {
        const templateFn: Function = getTemplateFunction(content);
        let templateElement: HTMLCollection;
        try {
            const tempObject: Object = { chart: chart, series: series, point: point };
            const templateId: string = dataLabelId + '-template';
            const elementData: Element[] = templateFn ? templateFn(tempObject, chart, templateId, dataLabelId) : [];
            if (elementData.length) {
                templateElement = Array.prototype.slice.call(elementData);
                const len: number = templateElement.length;
                for (let i: number = 0; i < len; i++) {
                    childElement.appendChild(templateElement[i as number]);
                }
            }
            let reactCallback: Function;
            if (chart.getModuleName() === 'chart3d') {
                reactCallback = (point && series) ? this.chartReactTemplate.bind(
                    this, childElement, chart, point, series, labelIndex, redraw, location
                ) : reactCallback;
                if ((chart as any).isReact) { (chart as any).renderReactTemplates(reactCallback); }
            }
        } catch (e) {
            return childElement;
        }
        return childElement;
    }

    /**
     * Gets the name of the data label module.
     *
     * @returns {string} The name of the data label module.
     */
    protected getModuleName(): string {
        // Returns the module name
        return 'DataLabel3D';
    }

    /**
     * To destroy the dataLabel for series.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method performed here
    }
}
