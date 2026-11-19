/**
 * AccumulationChart DataLabel module file
 */
import { extend, createElement, getValue, isNullOrUndefined, animationMode } from '@syncfusion/ej2-base';
import { Rect, Size, PathOption, measureText, TextOption } from '@syncfusion/ej2-svg-base';
import { ChartLocation, degreeToLocation, isOverlap, stringToNumber, getAngle, appendChildElement } from '../../common/utils/helper';
import { textTrim, subtractThickness, Thickness, getElement } from '../../common/utils/helper';
import { removeElement, RectOption, textElement, showTooltip } from '../../common/utils/helper';
import { ColorValue, colorNameToHex, convertHexToColor, containsRect, textWrap, CircleOption } from '../../common/utils/helper';
import { AccumulationLabelPosition } from '../model/enum';
import { AccPoints, getSeriesFromIndex, AccumulationSeries } from '../model/acc-base';
import { IAccTextRenderEventArgs } from '../model/pie-interface';
import { AccumulationDataLabelSettingsModel } from '../model/acc-base-model';
import { MarginModel, FontModel, BorderModel, ConnectorModel } from '../../common/model/base-model';
import { textRender } from '../../common/model/constants';
import { AccumulationChart } from '../accumulation';
import { getFontStyle, createTemplate, measureElementRect, templateAnimate } from '../../common/utils/helper';
import { AccumulationBase } from './accumulation-base';
import { AccumulationLegend } from './legend';

/**
 * The `AccumulationDataLabel` module is used to render data labels for the Accumulation chart.
 */
export class AccumulationDataLabel extends AccumulationBase {
    /** @private */
    public titleRect: Rect;
    /** @private */
    public areaRect: Rect;
    /** @private */
    public clearTooltip: number;
    private id: string;
    public marginValue: number;
    /**
     * This varaible indicated the change of angle direction.
     * Such as increase/decrease the label angle while doing smart label arrangements.
     */
    private isIncreaseAngle: boolean;
    private rightSideRenderingPoints: AccPoints[] = [];
    private leftSideRenderingPoints: AccPoints[] = [];
    constructor(accumulation: AccumulationChart) {
        super(accumulation);
        this.id = accumulation.element.id + '_datalabel_Series_';
    }
    /**
     * Method to get datalabel text location.
     *
     * @private
     * @param {AccPoints} point - The data point for which to calculate the label text location.
     * @param {AccumulationDataLabelSettingsModel} dataLabel - The data label settings for the series.
     * @param {Size} textSize - The size of the text to be displayed.
     * @param {AccPoints[]} points - The array of data points in the series.
     * @param {number} seriesIndex - The series index.
     * @returns {void}
     */
    public getDataLabelPosition(
        point: AccPoints, dataLabel: AccumulationDataLabelSettingsModel, textSize: Size,
        points: AccPoints[], seriesIndex?: number): void {
        const currentSeriesIndex: number = seriesIndex ? seriesIndex : 0;
        const radius: number = this.isCircular() ? (!this.isVariousRadius() ? this.accumulation.pieSeriesModule.labelRadius :
            this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[currentSeriesIndex as number], point)) :
            this.getLabelDistance(point, dataLabel, currentSeriesIndex);

        //let radius: number = this.isCircular() ? this.labelRadius : this.getLabelDistance(point, dataLabel);
        if (this.accumulation.title) {
            const titleSize: Size = measureText(this.accumulation.title, this.accumulation.titleStyle,
                                                this.accumulation.themeStyle.datalabelFont);
            this.titleRect = new Rect(
                this.accumulation.availableSize.width / 2 - titleSize.width / 2,
                this.accumulation.margin.top,
                titleSize.width, titleSize.height
            );
        }
        this.getLabelRegion(point, dataLabel.position, textSize, radius, this.getPointMargin(point));
        point.labelAngle = point.midAngle;
        point.labelPosition = dataLabel.position;
        if (this.accumulation.enableSmartLabels) {
            this.getSmartLabel(point, dataLabel, textSize, points, currentSeriesIndex);
        }
    }
    /**
     * Method to get datalabel bound.
     */

    private getLabelRegion(
        point: AccPoints, position: AccumulationLabelPosition, textSize: Size,
        labelRadius: number, margin: number, endAngle: number = 0): void {
        const labelAngle: number = endAngle || point.midAngle;
        const space: number = 20;

        const location: ChartLocation = degreeToLocation(labelAngle, labelRadius, this.isCircular() ? this.center :
            this.getLabelLocation(point, position));

        location.y = (position === 'Inside') ? (location.y - textSize.height / 2) : location.y;
        location.x = (position === 'Inside') ? (location.x - textSize.width / 2) : location.x;

        point.labelRegion = new Rect(
            location.x, location.y, textSize.width + (margin * 2), textSize.height + (margin * 2));

        if (position === 'Outside') {
            point.labelRegion.y -= point.labelRegion.height / 2;
            if (labelAngle >= 90 && labelAngle <= 270) {
                point.labelRegion.x -= (point.labelRegion.width + space);
            } else {
                point.labelRegion.x += space;
            }
        }
    }

    /**
     * Method to get data label collection.
     *
     * @param {AccPoints} point - The data point for which to calculate the label collection.
     * @param {AccumulationDataLabelSettingsModel} dataLabel - The data label settings for the series.
     * @param {number} seriesIndex - The series index.
     * @param {number} labelAngle - The label Angle
     * @returns {void}
     * @private
     */
    public calculateLabelCollection(
        point: AccPoints, dataLabel: AccumulationDataLabelSettingsModel, seriesIndex?: number, labelAngle?: number
    ): void {
        if (point.argsData.template !== null) {
            return null;
        }
        const position : AccumulationLabelPosition = point.labelPosition || dataLabel.position;
        const currentSeriesIndex: number = seriesIndex ? seriesIndex : 0;
        const labelRadius : number = this.isCircular() ? (!this.isVariousRadius() ? this.accumulation.pieSeriesModule.labelRadius :
            this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[currentSeriesIndex as number], point)) :
            this.getLabelDistance(point, dataLabel, currentSeriesIndex);
        const radius : number = (!this.isVariousRadius() ?
            (this.accumulation.pieSeriesModule.radius - this.accumulation.pieSeriesModule.innerRadius) :
            this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[currentSeriesIndex as number], point));
        const currentLabelAngle: number = isNullOrUndefined(labelAngle) ? point.midAngle : labelAngle;
        const location: ChartLocation = degreeToLocation(currentLabelAngle, labelRadius, this.isCircular() ? this.center :
            this.getLabelLocation(point, position));
        const padding: number = 20;
        let maxWidth: number = dataLabel.maxWidth;
        if (!maxWidth) {
            if (position === 'Outside') {
                const labelPadding: number = this.isCircular() ? padding + (this.getPointMargin(point) * 2) : 0;
                maxWidth = this.isCircular() ? (location.x >= this.center.x) ?
                    this.areaRect.x + this.areaRect.width - location.x - labelPadding :
                    location.x - this.areaRect.x - labelPadding : (location.x >= point.region.x) ?
                    this.areaRect.x + this.areaRect.width - location.x : location.x - this.areaRect.x;
                maxWidth = Math.max(maxWidth, 1);
            }
            else {
                maxWidth = this.isCircular() ? (radius - padding) : point.region.width;
            }
        }
        if ((point.label.indexOf('<br>') !== -1)) {
            point.labelCollection = point.label.split('<br>');
        }
        else if (dataLabel.textWrap === 'Normal' && dataLabel.textOverflow === 'Ellipsis') {
            point.labelCollection[0] = textTrim(maxWidth, point.label, point.argsData.font, this.accumulation.enableRtl,
                                                this.accumulation.themeStyle.datalabelFont);
        }
        else if (dataLabel.textWrap === 'Wrap' || dataLabel.textWrap === 'AnyWhere') {
            point.labelCollection = textWrap(point.label, maxWidth, point.argsData.font, this.accumulation.enableRtl, dataLabel.textWrap === 'AnyWhere', dataLabel.textOverflow === 'Clip', this.accumulation.themeStyle.datalabelFont);
        }
        else if (dataLabel.textWrap === 'Normal' && dataLabel.textOverflow === 'Clip' && dataLabel.maxWidth) {
            point.labelCollection[0] = this.clipText(dataLabel.maxWidth, point.label, point.argsData.font);
        }
        else {
            point.labelCollection[0] = point.label;
        }
    }
    /**
     * To calculate label collection text size.
     *
     * @param {string[]} labelCollection - The collection of label texts.
     * @param {AccumulationDataLabelSettingsModel} dataLabel - The data label settings for the series.
     * @param {FontModel} font - The optional font for datalabel.
     * @returns {Size} - The size of the label text collection.
     * @private
     */
    public getTextSize(labelCollection: string[], dataLabel: AccumulationDataLabelSettingsModel, font?: FontModel): Size {
        let height: number = 0;
        let width: number = 0;
        let textSize: Size;
        const labelFont: FontModel = font || dataLabel.font;
        for (let i: number = 0; i < labelCollection.length; i++) {
            textSize = measureText(labelCollection[i as number], labelFont, this.accumulation.themeStyle.datalabelFont);
            width = Math.max(textSize.width, width);
            height += textSize.height;
        }
        if (dataLabel.textOverflow === 'Clip' && dataLabel.textWrap !== 'Normal' && dataLabel.maxWidth) {
            width = dataLabel.maxWidth;
        }
        return new Size(width, height);
    }

    /**
     * Method to get datalabel smart position.
     *
     * @param {AccPoints} point - The data point for which to calculate the label smart position.
     * @param {AccumulationDataLabelSettingsModel} dataLabel - The data label settings for the series.
     * @param {Size} textSize - The size of the text.
     * @param {AccPoints[]} points - The collection of data points.
     * @param {number} index -Index of the series.
     * @returns {void}
     */
    private getSmartLabel(
        point: AccPoints, dataLabel: AccumulationDataLabelSettingsModel, textSize: Size,
        points: AccPoints[], index: number): void {

        const circular: boolean = this.isCircular();

        let labelRadius: number = circular ? this.radius : this.getLabelDistance(point, dataLabel, index);

        const connectorLength: string = circular ? (dataLabel.connectorStyle.length || '4%') :
            '0px';

        labelRadius += stringToNumber(connectorLength, labelRadius);

        let previousPoint: AccPoints = this.findPreviousPoint(points, point.index, point.labelPosition);

        if (dataLabel.position === 'Inside') {
            // `4` is padding adding to height and width of label region.
            point.labelRegion.height -= 4;
            point.labelRegion.width -= 4;
            if (previousPoint && previousPoint.labelRegion && !dataLabel.enableRotation &&
                (isOverlap(point.labelRegion, previousPoint.labelRegion)
                || this.isOverlapping(point, points)) || !circular && !containsRect(point.region, point.labelRegion)) {
                point.labelPosition = 'Outside';
                if (!circular) {
                    labelRadius = this.getLabelDistance(point, dataLabel, index);
                }
                this.calculateLabelCollection(point, dataLabel, index);
                textSize = this.getTextSize(point.labelCollection, dataLabel, point.argsData.font);
                textSize.height += 4;  // 4 for calculation with padding for smart label shape
                textSize.width += 4;
                point.textSize = textSize;
                this.getLabelRegion(point, point.labelPosition, textSize, labelRadius, this.getPointMargin(point));
                previousPoint = this.findPreviousPoint(points, point.index, point.labelPosition);
                if (previousPoint && (isOverlap(point.labelRegion, previousPoint.labelRegion) ||
                    this.isConnectorLineOverlapping(point, previousPoint))) {
                    this.setOuterSmartLabel(
                        previousPoint, point, dataLabel.border.width, labelRadius, textSize, this.getPointMargin(point), index
                    );
                }
            }
        } else {
            if (previousPoint && previousPoint.labelRegion && (isOverlap(point.labelRegion, previousPoint.labelRegion)
                || this.isOverlapping(point, points) || this.isConnectorLineOverlapping(point, previousPoint))) {
                this.setOuterSmartLabel(
                    previousPoint, point, dataLabel.border.width, labelRadius, textSize, this.getPointMargin(point), index
                );
            }
        }
        if (this.isOverlapping(point, points) && (this.accumulation.type === 'Pyramid' || this.accumulation.type === 'Funnel')) {
            const position: string = 'OutsideLeft';
            const space: number = 20;
            const labelAngle: number = point.midAngle || 0;
            const labelRadius: number = circular ? this.radius : this.getLabelDistance(point, dataLabel);
            const location: ChartLocation = degreeToLocation(labelAngle, -labelRadius, this.isCircular() ? this.center :
                this.getLabelLocation(point, position));
            point.labelRegion = new Rect(
                location.x, location.y, textSize.width + (this.getPointMargin(point) * 2),
                textSize.height + (this.getPointMargin(point) * 2));
            point.labelRegion.y -= point.labelRegion.height / 2;
            point.labelRegion.x = point.labelRegion.x - space - point.labelRegion.width;
            if (previousPoint && previousPoint.labelRegion && (isOverlap(point.labelRegion, previousPoint.labelRegion)
                || this.isOverlapping(point, points) || this.isConnectorLineOverlapping(point, previousPoint))) {
                this.setOuterSmartLabel(
                    previousPoint, point, dataLabel.border.width, labelRadius, textSize, this.getPointMargin(point), index
                );
            }
        }
    }

    /**
     * To find trimmed datalabel tooltip needed.
     *
     * @param {Event} e - The move event.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {boolean} isTouch - Indicates if the interaction is touch-based.
     * @returns {void}
     * @private
     */
    public move(e: Event, x: number, y: number, isTouch?: boolean): void {
        if ((<HTMLElement>e.target).textContent.indexOf('...') > -1) {
            const targetId: string[] = (<HTMLElement>e.target).id.split(this.id);
            if (targetId.length === 2) {
                const seriesIndex: number = parseInt(targetId[1].split('_text_')[0], 10);
                const pointIndex: number = parseInt(targetId[1].split('_text_')[1], 10);
                if (!isNaN(seriesIndex) && !isNaN(pointIndex)) {
                    if (isTouch) {
                        removeElement(this.accumulation.element.id + '_EJ2_Datalabel_Tooltip');
                    }
                    const point: AccPoints = getSeriesFromIndex(seriesIndex,
                                                                (this.accumulation).visibleSeries).points[pointIndex as number];
                    showTooltip(
                        point.text || point.y.toString(), x, y, this.areaRect.width,
                        this.accumulation.element.id + '_EJ2_Datalabel_Tooltip',
                        getElement(this.accumulation.element.id + '_Secondary_Element'), null, null, this.accumulation.initialClipRect
                    );
                }
            }
        } else {
            removeElement(this.accumulation.element.id + '_EJ2_Datalabel_Tooltip');
        }
        if (isTouch) {
            clearTimeout(this.clearTooltip);
            this.clearTooltip = +setTimeout(() => { removeElement(this.accumulation.element.id + '_EJ2_Datalabel_Tooltip'); }, 1000);
        }
    }
    /**
     * To find previous valid label point.
     *
     * @param {AccPoints[]} points - The array of accumulation points.
     * @param {number} index - The index of the current point.
     * @param {AccumulationLabelPosition} position - The position of the label.
     * @returns {AccPoints} - Find the previous value of accumulation point.
     */
    private findPreviousPoint(points: AccPoints[], index: number, position: AccumulationLabelPosition): AccPoints {
        let point: AccPoints = points[0];
        for (let i: number = index - 1; i >= 0; i--) {
            point = points[i as number];
            if (point.visible && point.labelVisible && point.labelRegion && point.labelPosition === position) {
                return point;
            }
        }
        return null;
    }
    /**
     * To find current point datalabel is overlapping with other points.
     *
     * @param {AccPoints} currentPoint - The current point.
     * @param {AccPoints[]} points - The array of accumulation points.
     * @returns {boolean} - It returns boolean value of overlapping.
     */
    private isOverlapping(currentPoint: AccPoints, points: AccPoints[]): boolean {
        for (let i: number = currentPoint.index - 1; i >= 0; i--) {
            if (points[i as number].visible && points[i as number].labelVisible &&
                points[i as number].labelRegion && currentPoint.labelRegion &&
                currentPoint.labelVisible && isOverlap(currentPoint.labelRegion, points[i as number].labelRegion)) {
                return true;
            }
        }
        return false;
    }
    /**
     * To get text trimmed while exceeds the accumulation chart area.
     *
     * @param {AccPoints} point - The accumulation point.
     * @param {Rect} rect - The area of the accumulation chart.
     * @param {FontModel} font - The font settings.
     * @param {string} position - The position of the data label.
     * @param {AccumulationDataLabelSettingsModel} dataLabel - The data label settings.
     * @returns {void}
     */
    private textTrimming(point: AccPoints, rect: Rect, font: FontModel, position: string,
                         dataLabel: AccumulationDataLabelSettingsModel): void {
        if (isOverlap(point.labelRegion, rect)) {
            let size: number = point.labelRegion.width;
            if (position === 'Right') {
                size = rect.x - point.labelRegion.x;
            } else if (position === 'Left') {
                size = point.labelRegion.x - (rect.x + rect.width);
                if (size < 0) {
                    size += point.labelRegion.width;
                    point.labelRegion.x = rect.x + rect.width;
                }
            } else if (position === 'InsideRight') {
                size = (rect.x + rect.width) - point.labelRegion.x;
            } else if (position === 'InsideLeft') {
                size = (point.labelRegion.x + point.labelRegion.width) - rect.x;
                if (size < point.labelRegion.width) {
                    point.labelRegion.x = rect.x;
                }
            } else if (this.accumulation.enableSmartLabels) {
                this.setPointVisibileFalse(point);
            }
            if (point.labelVisible && point.labelRegion) {
                if ((point.label.indexOf('<br>') !== -1)) {
                    point.labelCollection = point.label.split('<br>');
                }
                else if (size < point.labelRegion.width) {
                    if (dataLabel.textWrap === 'Normal' && dataLabel.textOverflow === 'Ellipsis') {
                        point.labelCollection[0] = textTrim(
                            size - (this.getPointMargin(point) * 2), point.label, font, this.accumulation.enableRtl,
                            this.accumulation.themeStyle.datalabelFont);
                    }
                    else if (dataLabel.textWrap === 'Normal' && dataLabel.textOverflow === 'Clip') {
                        point.labelCollection[0] = this.clipText(size - (this.getPointMargin(point) * 2), point.label, font);
                    }
                    else if (dataLabel.textWrap === 'Wrap' || dataLabel.textWrap === 'AnyWhere') {
                        point.labelCollection = textWrap(
                            point.label, size - (this.getPointMargin(point) * 2), font, this.accumulation.enableRtl,
                            dataLabel.textWrap === 'AnyWhere', dataLabel.textOverflow === 'Clip',
                            this.accumulation.themeStyle.datalabelFont);
                    }
                    point.labelRegion.width = size;
                }
                for (let i: number = 0 ; i < point.labelCollection.length ; i++)
                {
                    if ((point.labelCollection[i as number].length === 3 && point.labelCollection[i as number].indexOf('...') > -1) ||
                        point.labelCollection[i as number] === '') {
                        this.setPointVisibileFalse(point);
                        break;
                    }
                }
            }
        }
    }
    /**
     * Cuts the text to the characters that fit the width, without reserving space for an ellipsis.
     *
     * @param {number} maxWidth - The available width.
     * @param {string} text - The text to clip.
     * @param {FontModel} font - The font settings.
     * @returns {string} - The clipped text.
     */
    private clipText(maxWidth: number, text: string, font: FontModel): string {
        const themeFont: FontModel = this.accumulation.themeStyle.datalabelFont;
        for (let i: number = text.length; i > 0; i--) {
            const label: string = this.accumulation.enableRtl ? text.substring(text.length - i) : text.substring(0, i);
            if (measureText(label, font, themeFont).width <= maxWidth) {
                return label;
            }
        }
        return '';
    }
    /**
     * To set point label visible and region to disable.
     *
     * @param {AccPoints} point - The accumulation point.
     * @returns {void}
     */
    private setPointVisibileFalse(point: AccPoints): void {
        point.labelVisible = false;
        point.labelRegion = null;
    }
    /**
     * To set point label visible to enable.
     *
     * @param {AccPoints} point - The accumulation point.
     * @returns {void}
     */
    private setPointVisibleTrue(point: AccPoints): void {
        point.labelVisible = true;
    }
    /**
     * To set datalabel angle position for outside labels.
     *
     * @param {AccPoints} previousPoint - The previous accumulation point.
     * @param {AccPoints} point - The accumulation point.
     * @param {number} border - The border size.
     * @param {number} labelRadius - The radius for the labels.
     * @param {Size} textsize - The size of the labels.
     * @param {number} margin - The margin value.
     * @param {number} seriesIndex - The series indec value.
     * @returns {void}
     */
    private setOuterSmartLabel(
        previousPoint: AccPoints, point: AccPoints, border: number, labelRadius: number,
        textsize: Size, margin: number, seriesIndex: number
    ): void {
        if (!this.isCircular()) {
            this.setSmartLabelForSegments(point, previousPoint);
        } else {
            const dataLabel: AccumulationDataLabelSettingsModel = this.accumulation.series[seriesIndex as number].dataLabel;
            let labelAngle: number = this.getOverlappedAngle(
                previousPoint.labelRegion, point.labelRegion, point.midAngle, border * 2
            );
            this.updateLabelRegion(point, dataLabel, textsize, labelRadius, margin, labelAngle, seriesIndex);
            if (labelAngle > point.endAngle) {
                labelAngle = point.midAngle;
                //this.setPointVisibileFalse(point);
            }
            point.labelAngle = labelAngle;
            while (point.labelVisible && (isOverlap(previousPoint.labelRegion, point.labelRegion) ||
                labelAngle <= previousPoint.labelAngle || labelAngle <= point.midAngle * 0.9 ||
                this.isConnectorLineOverlapping(point, previousPoint))) {
                if (labelAngle > point.endAngle) {
                    //this.setPointVisibileFalse(point);
                    break;
                }
                point.labelAngle = labelAngle;
                this.updateLabelRegion(point, dataLabel, textsize, labelRadius, margin, labelAngle, seriesIndex);
                labelAngle += 0.1;
            }
        }
    }

    private updateLabelRegion(
        point: AccPoints, dataLabel: AccumulationDataLabelSettingsModel, textSize: Size, labelRadius: number,
        margin: number, labelAngle: number, seriesIndex: number
    ): void {
        if (!dataLabel.maxWidth && point.labelPosition === 'Outside' &&
            (dataLabel.textWrap === 'Wrap' || dataLabel.textWrap === 'AnyWhere')) {
            this.calculateLabelCollection(point, dataLabel, seriesIndex, labelAngle);
            point.textSize = this.getTextSize(point.labelCollection, dataLabel, point.argsData.font);
            textSize = point.textSize;
        }
        this.getLabelRegion(point, 'Outside', textSize, labelRadius, margin, labelAngle);
    }

    /**
     * Sets smart label positions for funnel and pyramid series.
     *
     * @param {AccPoints} point - The accumulation point.
     * @param {AccPoints} prevPoint - The previous point.
     * @returns {void} setSmartLabelForSegments.
     */
    private setSmartLabelForSegments(
        point: AccPoints, prevPoint: AccPoints): void {
        const textRegion: Rect = point.labelRegion;
        //let overlapWidth: number = prevPoint.labelRegion.x + prevPoint.labelRegion.width - textRegion.x;
        const overlapHeight: number = this.accumulation.type === 'Funnel' ?
            prevPoint.labelRegion.y - (textRegion.y + textRegion.height) :
            point.labelRegion.y - (prevPoint.labelRegion.y + prevPoint.labelRegion.height);
        if (overlapHeight < 0) {
            point.labelRegion.y += this.accumulation.type === 'Funnel' ? overlapHeight : -overlapHeight;
        }
    }

    /**
     * To find connector line overlapping.
     *
     * @param {AccPoints} point - The accumulation point.
     * @param {AccPoints} previous - The previous point.
     * @returns {boolean} - To find connector line overlapping or not.
     */
    private isConnectorLineOverlapping(point: AccPoints, previous: AccPoints): boolean {
        let position: string;
        if (!this.isCircular() && point.labelRegion.x < point.region.x) {
            position = 'outsideLeft';
        }
        const start: ChartLocation = this.getLabelLocation(point, position);
        const end: ChartLocation = new ChartLocation(0, 0);
        this.getEdgeOfLabel(point.labelRegion, point.labelAngle, end, 0, point);

        const previousstart: ChartLocation = this.getLabelLocation(previous);
        const previousend: ChartLocation = new ChartLocation(0, 0);
        this.getEdgeOfLabel(previous.labelRegion, previous.labelAngle, previousend, 0, point);
        return this.isLineRectangleIntersect(start, end, point.labelRegion) ||
            this.isLineRectangleIntersect(start, end, previous.labelRegion) ||
            this.isLineRectangleIntersect(previousstart, previousend, point.labelRegion);
    }
    /**
     * To find two rectangle intersect.
     *
     * @param {ChartLocation} line1 - The first line.
     * @param {ChartLocation} line2 - The second line.
     * @param {Rect} rect - The rectangle to check against.
     * @returns {boolean} - To find line rectangle intersect value.
     */
    private isLineRectangleIntersect(line1: ChartLocation, line2: ChartLocation, rect: Rect): boolean {
        const rectPoints: ChartLocation[] = [
            new ChartLocation(Math.round(rect.x), Math.round(rect.y)),
            new ChartLocation(Math.round((rect.x + rect.width)), Math.round(rect.y)),
            new ChartLocation(Math.round((rect.x + rect.width)), Math.round((rect.y + rect.height))),
            new ChartLocation(Math.round(rect.x), Math.round((rect.y + rect.height)))
        ];
        line1.x = Math.round(line1.x);
        line1.y = Math.round(line1.y);
        line2.x = Math.round(line2.x);
        line2.y = Math.round(line2.y);
        for (let i: number = 0; i < rectPoints.length; i++) {
            if (this.isLinesIntersect(line1, line2, rectPoints[i as number], rectPoints[(i + 1) % rectPoints.length])) {
                return true;
            }
        }
        return false;
    }
    /**
     * To find two line intersect.
     *
     * @param {ChartLocation} point1 - The first point of the first line.
     * @param {ChartLocation} point2 - The second point of the first line.
     * @param {ChartLocation} point11 - The first point of the second line.
     * @param {ChartLocation} point12 - The second point of the second line.
     * @returns {boolean} - To find line intersect or not.
     */
    private isLinesIntersect(point1: ChartLocation, point2: ChartLocation, point11: ChartLocation, point12: ChartLocation): boolean {
        const a1: number = point2.y - point1.y;
        const b1: number = point1.x - point2.x;
        const c1: number = a1 * point1.x + b1 * point1.y;
        const a2: number = point12.y - point11.y;
        const b2: number = point11.x - point12.x;
        const c2: number = a2 * point11.x + b2 * point11.y;
        const delta: number = a1 * b2 - a2 * b1;
        if (delta !== 0) {
            const x: number = (b2 * c1 - b1 * c2) / delta;
            const y: number = (a1 * c2 - a2 * c1) / delta;
            let lies: boolean = Math.min(point1.x, point2.x) <= x && x <= Math.max(point1.x, point2.x);
            lies = lies && Math.min(point1.y, point2.y) <= y && y <= Math.max(point1.y, point2.y);
            lies = lies && Math.min(point11.x, point12.x) <= x && x <= Math.max(point11.x, point12.x);
            lies = lies && Math.min(point11.y, point12.y) <= y && y <= Math.max(point11.y, point12.y);
            return lies;
        }
        return false;
    }
    /**
     * To get two rectangle overlapping angles.
     *
     * @param {Rect} first - The first rectangle.
     * @param {Rect} second - The second rectangle.
     * @param {number} angle - The angle.
     * @param {number} padding - The padding.
     * @returns {number} - Get overlapped angle.
     */
    private getOverlappedAngle(first: Rect, second: Rect, angle: number, padding: number): number {
        let x: number = first.x;
        if (angle >= 90 && angle <= 270) {
            second.y = first.y - (padding + second.height / 2);
            x = first.x + first.width;
        } else {
            second.y = first.y + first.height + padding;
        }
        return getAngle(this.center, new ChartLocation(x, second.y));
    }

    /**
     * To get connector line path.
     *
     * @param {Rect} label - The label.
     * @param {AccPoints} point - The accumulation point.
     * @param {AccumulationDataLabelSettingsModel} dataLabel - The data label settings.
     * @param {number} end - The end.
     * @param {number} seriesIndex - The index value of the series.
     * @returns {string} - Get connector line path.
     */
    private getConnectorPath(label: Rect, point: AccPoints, dataLabel: AccumulationDataLabelSettingsModel,
                             end: number = 0, seriesIndex?: number): string {
        const connector: ConnectorModel = dataLabel.connectorStyle;
        const currentSeriesIndex: number = seriesIndex ? seriesIndex : 0;

        const labelRadius: number = this.isCircular() ? (!this.isVariousRadius() ? this.labelRadius :
            this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[currentSeriesIndex as number], point)) :
            this.getLabelDistance(point, dataLabel, currentSeriesIndex);
        //let labelRadius: number = this.isCircular() ? this.labelRadius : this.getLabelDistance(point, dataLabel);

        const start: ChartLocation = this.getConnectorStartPoint(point, connector);

        let labelAngle: number = this.accumulation.enableSmartLabels ? point.midAngle : end || point.midAngle;
        const isCircularOutsideLabel: boolean = this.isCircular() && point.labelPosition === 'Outside';
        const isLabelOnLeft: boolean = isCircularOutsideLabel && label.x + (label.width / 2) < this.center.x;
        const isPointOnLeft: boolean = isCircularOutsideLabel && point.midAngle >= 90 && point.midAngle <= 270;
        const isConnectorSideChanged: boolean = isCircularOutsideLabel && isLabelOnLeft !== isPointOnLeft;
        if (isConnectorSideChanged) {
            labelAngle = isLabelOnLeft ? 180 : 0;
        }

        let middle: ChartLocation = new ChartLocation(0, 0);

        const endPoint: ChartLocation = this.getEdgeOfLabel(label, labelAngle, middle, connector.width, point);

        if (connector.type === 'Curve') {
            if (this.isCircular()) {
                if (point.labelPosition === 'Outside' && (!!point.isLabelUpdated || isConnectorSideChanged)) {
                    const line: ChartLocation[] = this.getOutsideConnectorLine(point, label, isLabelOnLeft);
                    return 'M ' + line[0].x + ' ' + line[0].y + ' Q ' + line[1].x + ' ' + line[1].y +
                        ' ' + line[2].x + ' ' + line[2].y;
                }
                const r: number = labelRadius - (
                    this.isVariousRadius() ? stringToNumber(point.sliceRadius, this.accumulation.pieSeriesModule.size / 2) :
                        this.radius);
                //let r: number = labelRadius - this.radius;
                if (point.isLabelUpdated) {
                    middle = this.getPerpendicularDistance(start, point);
                } else {
                    middle = degreeToLocation(labelAngle, labelRadius - (r / 2), this.center);
                    if (point.labelPosition === 'Outside' && dataLabel.position === 'Inside') {
                        middle = degreeToLocation(labelAngle, labelRadius - r * 1.25, this.center);
                    }
                }
                return 'M ' + start.x + ' ' + start.y + ' Q ' + middle.x + ' ' + middle.y + ' ' + endPoint.x + ' ' + endPoint.y;
            } else {
                return this.getPolyLinePath(start, endPoint);
            }
        } else {
            const useIndicatorConnector: boolean = isCircularOutsideLabel &&
                (!!point.isLabelUpdated || isConnectorSideChanged);
            if (useIndicatorConnector) {
                return this.getAdaptiveConnectorPath(label, point);
            }
            return 'M ' + start.x + ' ' + start.y + ' L ' + middle.x + ' ' + middle.y +
                ' L ' + endPoint.x + ' ' + endPoint.y;
        }
    }

    // Moved outside label: slanted line from the slice to the label, then a short horizontal stub toward the label.
    private getAdaptiveConnectorPath(label: Rect, point: AccPoints): string {
        const line: ChartLocation[] = this.getOutsideConnectorLine(point, label, label.x + (label.width / 2) < this.center.x);
        return 'M ' + line[0].x + ' ' + line[0].y + ' L ' + line[1].x + ' ' + line[1].y +
            ' L ' + line[2].x + ' ' + line[2].y;
    }

    /**
     * Finds the curved path for funnel/pyramid data label connectors.
     *
     * @param {ChartLocation} start - The start location.
     * @param {ChartLocation} end - The end location.
     * @returns {string} - Get poly line path.
     */
    private getPolyLinePath(start: ChartLocation, end: ChartLocation): string {
        const controlPoints: ChartLocation[] = [start, end];
        if (start.y === end.y) {
            return 'M ' + start.x + ' ' + start.y + ' L ' + end.x + ' ' + end.y;
        }
        let path: string = 'M';
        for (let i: number = 0; i <= 16; i++) {
            const t: number = i / 16;
            const points: ChartLocation = this.getBezierPoint(t, controlPoints, 0, 2);
            path += points.x + ',' + points.y;
            if (i !== 16) {
                path += ' L';
            }
        }
        return path;
    }

    /**
     * Finds the bezier point for funnel/pyramid data label connectors.
     *
     * @param {number} t - The parameter value.
     * @param {ChartLocation[]} controlPoints - The control points for the bezier point.
     * @param {number} index - The index of the point.
     * @param {number} count - The total count of points.
     * @returns {ChartLocation} - Get bazier point.
     */
    private getBezierPoint(t: number, controlPoints: ChartLocation[], index: number, count: number): ChartLocation {
        if (count === 1) {
            return controlPoints[index as number];
        }
        const p0: ChartLocation = this.getBezierPoint(t, controlPoints, index, count - 1);
        const p1: ChartLocation = this.getBezierPoint(t, controlPoints, index + 1, count - 1);
        const x: number = (p0.x) ? p0.x : p0.x;
        const y: number = (p0.y) ? p0.y : p0.y;
        const x1: number = (p1.x) ? p1.x : p1.x;
        const y1: number = (p1.y) ? p1.y : p1.y;
        const x2: number = (1 - t) * x + t * x1;
        const y2: number = (1 - t) * y + t * y1;
        if (p0.x) {
            return { x: x2, y: y2 };
        } else {
            return { x: x2, y: y2 };
        }
    }

    /**
     * To get label edges based on the center and label rect position.
     *
     * @param {Rect} labelshape - The label shape.
     * @param {number} angle - The angle of the label.
     * @param {ChartLocation} middle - The middle point of the label.
     * @param {number} border - The border value.
     * @param {AccPoints} point - The accumulation point.
     * @returns {ChartLocation} - Get label edge value.
     */
    private getEdgeOfLabel(labelshape: Rect, angle: number, middle: ChartLocation, border: number = 1, point?: AccPoints): ChartLocation {
        const edge: ChartLocation = new ChartLocation(labelshape.x, labelshape.y);
        const space : number = 10;
        if (angle >= 90 && angle <= 270) {
            edge.x += labelshape.width + border / 2 + space;
            edge.y += labelshape.height / 2;
            middle.x = edge.x + 10;
            middle.y = edge.y;
        } else if (point && point.region && point.region.x > point.labelRegion.x) {
            edge.x += border * 2 + labelshape.width + space;
            edge.y += labelshape.height / 2;
            middle.x = edge.x + 10;
            middle.y = edge.y;
        } else {
            edge.x -= space - border / 2;
            edge.y += labelshape.height / 2;
            middle.x = edge.x - 10;
            middle.y = edge.y;
        }
        return edge;
    }

    /**
     * Finds the distance between the label position and the edge/center of the funnel/pyramid.
     *
     * @param {AccPoints} point - The accumulation point.
     * @param {AccumulationDataLabelSettingsModel} dataLabel - The data label settings.
     * @param {number} seriesIndex - The series index.
     * @returns {number} - Get label distance.
     */
    private getLabelDistance(point: AccPoints, dataLabel: AccumulationDataLabelSettingsModel, seriesIndex?: number): number {
        if (point.labelPosition && dataLabel.position !== point.labelPosition || (dataLabel.connectorStyle.length && dataLabel.position === 'Outside')) {
            const length: number = stringToNumber(dataLabel.connectorStyle.length || '70px', this.accumulation.initialClipRect.width);
            if (length < this.accumulation.initialClipRect.width) {
                return length;
            }
        }

        const position: AccumulationLabelPosition = point.labelPosition || dataLabel.position;
        const currentSeriesIndex: number = seriesIndex ? seriesIndex : 0;
        const series: AccumulationSeries = this.accumulation.visibleSeries[currentSeriesIndex as number];
        const extraSpace: number = (this.accumulation.initialClipRect.width - series.triangleSize.width) / 2;

        let labelLocation: number;
        switch (position) {
        case 'Inside':
            return 0;
        case 'Outside':
            labelLocation = point.symbolLocation.x + point.labelOffset.x;
            return this.accumulation.initialClipRect.width - labelLocation - extraSpace;
        }
    }

    /**
     * Finds the label position / beginning of the connector(ouside funnel labels).
     *
     * @param {AccPoints} point - The accumulation point.
     * @param {AccumulationLabelPosition | string} position - The data label position.
     * @returns {ChartLocation} - Get label location.
     */
    private getLabelLocation(point: AccPoints, position: AccumulationLabelPosition | string = 'Outside'): ChartLocation {
        if (this.accumulation.type !== 'Pie' && this.accumulation.series[0].funnelMode !== 'Trapezoidal') {
            position = position === 'OutsideLeft' ? 'OutsideLeft' : point.labelPosition || position;
            const location: ChartLocation = {
                x: point.symbolLocation.x,
                y: point.symbolLocation.y - point.labelOffset.y
            };
            switch (position) {
            case 'Inside':
                location.y = point.region.y + point.region.height / 2;
                break;
            case 'Outside':
                location.x += point.labelOffset.x;
                break;
            case 'OutsideLeft':
                location.x -= point.labelOffset.x;
            }
            return location;
        } else if (this.accumulation.series[0].funnelMode === 'Trapezoidal' && this.accumulation.type === 'Funnel') {
            const location: ChartLocation = {
                x: point.symbolLocation.x,
                y: point.symbolLocation.y
            };
            if (position === 'Outside') {
                location.x = point.labelOffset.x;
            }
            return location;
        } else {
            //return degreeToLocation(point.midAngle, this.radius, this.center);
            return degreeToLocation(
                point.midAngle,
                (this.isVariousRadius() ? stringToNumber(point.sliceRadius, this.accumulation.pieSeriesModule.seriesRadius) :
                    this.radius),
                this.center
            );

        }
    }

    /**
     * Finds the beginning of connector line.
     *
     * @param {AccPoints} point - The accumulation point.
     * @param {ConnectorModel} connector - The connector line.
     * @returns {ChartLocation} - Staring point of connector line.
     */
    private getConnectorStartPoint(point: AccPoints, connector: ConnectorModel): ChartLocation {
        // return this.isCircular() ? degreeToLocation(point.midAngle, this.radius - connector.width, this.center) :
        //     this.getLabelLocation(point);
        let position: string;
        if (!this.isCircular() && point.region.x > point.labelRegion.x) {
            position = 'OutsideLeft';
        }
        const seriesRadius: number = this.isVariousRadius() ?
            stringToNumber(point.sliceRadius, this.accumulation.pieSeriesModule.seriesRadius) : this.radius;
        const startRadius: number = (point.labelPosition === 'Outside' && (point.isLabelUpdated || this.accumulation.enableSmartLabels)) ?
            seriesRadius : seriesRadius - connector.width;
        return this.isCircular() ? degreeToLocation(point.midAngle, startRadius, this.center) :
            this.getLabelLocation(point, position);

    }

    /**
     * To find area rect based on margin, available size.
     *
     * @private
     * @returns {void}
     */
    public findAreaRect(): void {
        this.areaRect = new Rect(0, 0, this.accumulation.availableSize.width, this.accumulation.availableSize.height);
        const margin: MarginModel = this.accumulation.margin;
        subtractThickness(this.areaRect, new Thickness(margin.left, margin.right, margin.top, margin.bottom));
    }
    /**
     * To render the data labels from series points.
     *
     * @param {AccPoints} point - The point for which to render the data label.
     * @param {AccumulationDataLabelSettingsModel} dataLabel - The settings for the data labels.
     * @param {Element} parent - The parent element to which the data labels are appended.
     * @param {AccPoints[]} points - The collection of points in the series.
     * @param {number} series - The index of the series.
     * @param {HTMLElement} templateElement - The template element for the data label.
     * @param {boolean} redraw - Indicates whether the data labels are being redrawn.
     * @returns {void}
     * @private
     */
    public renderDataLabel(
        point: AccPoints, dataLabel: AccumulationDataLabelSettingsModel, parent: Element,
        points: AccPoints[], series: number, templateElement?: HTMLElement,
        redraw?: boolean
    ): void {
        const id: string = this.accumulation.element.id + '_datalabel_Series_' + series + '_';
        const datalabelGroup: Element = this.accumulation.renderer.createGroup({ id: id + 'g_' + point.index });
        const border: BorderModel = { width: dataLabel.border.width, color: dataLabel.border.color };
        const argsFont: FontModel = <FontModel>(extend({}, getValue('properties', dataLabel.font), null, true));
        point.label = this.getDatalabelText(dataLabel.format, this.accumulation, point.originalText || point.y.toString());
        const argsData: IAccTextRenderEventArgs = {
            cancel: false, name: textRender, series: this.accumulation.visibleSeries[series as number], point: point,
            text: point.label, border: border, color: dataLabel.fill, template: this.accumulation.enableHtmlSanitizer ?
                this.accumulation.sanitize(dataLabel.template as string) : dataLabel.template, font: argsFont
        };
        this.accumulation.trigger(textRender, argsData);
        point.argsData = argsData;
        const isTemplate: boolean = argsData.template !== null;
        point.labelVisible = !argsData.cancel; point.text = point.label = argsData.text;
        point.labelCollection = [];
        this.marginValue = argsData.border.width ? (5 + argsData.border.width) : 1;
        const childElement: HTMLElement = createElement('div', {
            id: this.accumulation.element.id + '_Series_' + 0 + '_DataLabel_' + point.index,
            styles: 'position: absolute;background-color:' + argsData.color + ';' +
                getFontStyle(dataLabel.font, this.accumulation.themeStyle.datalabelFont) + ';border:' + argsData.border.width + 'px solid ' + argsData.border.color + ';'
        });
        this.calculateLabelSize(isTemplate, childElement, point, points, argsData, datalabelGroup, id,
                                dataLabel, redraw, null, false, series);
    }
    /**
     * To get the label padding of a point from its final textRender border.
     *
     * @param {AccPoints} point - The point whose label padding is required.
     * @returns {number} - The label padding.
     */
    private getPointMargin(point: AccPoints): number {
        const width: number = point.argsData && point.argsData.border ? point.argsData.border.width : 0;
        return width ? (5 + width) : 1;
    }
    private getDatalabelText(labelFormat: string, chart: AccumulationChart, labelText: string): string {
        if (Number(labelText)) {
            const customLabelFormat: boolean = labelFormat.match('{value}') !== null;
            const format: Function = chart.intl.getNumberFormat({
                format: customLabelFormat ? '' : labelFormat,
                useGrouping: chart.useGroupingSeparator
            });
            labelText = customLabelFormat ? labelFormat.replace('{value}', format(parseFloat(labelText))) : format(parseFloat(labelText));
        }
        return labelText;
    }
    /**
     * To calculate label size.
     *
     * @param {boolean} isTemplate - Indicates whether the label is a template.
     * @param {HTMLElement} childElement - The child element of the label.
     * @param {AccPoints} point - The point associated with the label.
     * @param {AccPoints[]} points - The collection of points.
     * @param {IAccTextRenderEventArgs} argsData - The arguments data for text rendering.
     * @param {Element} datalabelGroup - The group element for data labels.
     * @param {string} id - The id of the label.
     * @param {AccumulationDataLabelSettingsModel} dataLabel - The settings for the data labels.
     * @param {boolean} redraw - Indicates whether the labels are being redrawn.
     * @param {ClientRect} clientRect - The client rectangle.
     * @param {boolean} isReactCallback - Indicates whether a React callback is being used.
     * @param {number} series - The series index.
     * @returns {void}
     * @private
     */
    public calculateLabelSize(
        isTemplate: boolean, childElement: HTMLElement, point: AccPoints, points: AccPoints[],
        argsData: IAccTextRenderEventArgs, datalabelGroup: Element, id: string,
        dataLabel: AccumulationDataLabelSettingsModel, redraw?: boolean,
        clientRect?: ClientRect, isReactCallback?: boolean, series?: number ): void {
        this.calculateLabelCollection(point, dataLabel, series);
        const textSize: Size = isTemplate ? (isReactCallback ? { width: clientRect.width, height: clientRect.height } :
            this.getTemplateSize(childElement, point, argsData, redraw, isTemplate, points, datalabelGroup, id, dataLabel, series)
        ) : this.getTextSize(point.labelCollection, dataLabel, point.argsData.font);
        textSize.height += 4; // 4 for calculation with padding for smart label shape
        textSize.width += 4;
        point.textSize = textSize;
        point.templateElement = childElement;
        this.getDataLabelPosition(point, dataLabel, textSize, points, series);
        if (point.labelRegion) {
            this.correctLabelRegion(point.labelRegion, point.textSize);
        }
    }

    /**
     * To draw a data label.
     *
     * @param {AccumulationSeries} series - The series associated with the data label.
     * @param {AccumulationDataLabelSettingsModel} dataLabel - The settings for the data labels.
     * @param {HTMLElement} parent - The parent element of the data labels.
     * @param {HTMLElement} templateElement - The template element for the data label.
     * @param {boolean} redraw - Indicates whether the data labels are being redrawn.
     * @returns {void}
     * @private
     */
    public drawDataLabels(series: AccumulationSeries, dataLabel: AccumulationDataLabelSettingsModel, parent: HTMLElement,
                          templateElement?: HTMLElement, redraw?: boolean): void {
        let angle: number; let degree: number;
        const modifiedPoints: AccPoints[] = series.leftSidePoints.concat(series.rightSidePoints);
        modifiedPoints.sort((a: AccPoints, b: AccPoints) => a.index - b.index);
        if (series.type === 'Pie' && this.accumulation.enableSmartLabels) {
            this.extendedLabelsCalculation(series.index);
        }
        for (const point of modifiedPoints) {
            if (!isNullOrUndefined(point.argsData) && !isNullOrUndefined(point.y)) {
                this.finalizeDatalabels(point, modifiedPoints, dataLabel, series.index);
                const pointElement: Element = document.getElementById(this.accumulation.element.id + '_Series_' + series.index + '_Point_' + point.index);
                const id: string = this.accumulation.element.id + '_datalabel_Series_' + series.index + '_';
                const datalabelGroup: Element = this.accumulation.renderer.createGroup({ id: id + 'g_' + point.index });
                datalabelGroup.setAttribute('aria-hidden', 'true');
                let dataLabelElement: Element; let location: ChartLocation;
                let element: Element;
                if (point.visible && point.labelVisible) {
                    angle = degree = dataLabel.angle;
                    if (point.argsData.template) {
                        this.setTemplateStyle(
                            point.templateElement, point, templateElement, dataLabel.font.color, point.color, redraw);
                    } else {
                        location = new ChartLocation(
                            point.labelRegion.x + this.getPointMargin(point), point.labelRegion.y
                            + (point.textSize.height * 3 / (point.labelCollection.length * 4)) + this.getPointMargin(point));
                        element = getElement(id + 'shape_' + point.index);
                        const startLocation: ChartLocation = element ? new ChartLocation(
                            +element.getAttribute('x'), +element.getAttribute('y')
                        ) : null;
                        const textWidth: number = point.textSize.width;
                        if (dataLabel.enableRotation) {
                            if (angle === 0) {
                                if (point.labelPosition === 'Outside') {
                                    degree = 0;
                                }
                                else if (point.midAngle >= 90 && point.midAngle <= 260) {
                                    degree = point.midAngle + 180;
                                } else {
                                    degree = point.midAngle;
                                }
                            } else {
                                degree = (angle > 360) ? angle - 360 : (angle < -360) ? angle + 360 : angle;
                            }
                        } else {
                            degree = 0;
                        }
                        const rotate: string = 'rotate(' + degree + ',' + (location.x + (textWidth / 2)) + ',' + (location.y) + ')';
                        point.transform = rotate;
                        dataLabelElement = this.accumulation.renderer.drawRectangle(new RectOption(
                            id + 'shape_' + point.index, point.argsData.color, point.argsData.border, 1,
                            point.labelRegion, dataLabel.rx, dataLabel.ry, rotate, series.dataLabel.border.dashArray));
                        appendChildElement(false, datalabelGroup, dataLabelElement, redraw, true, 'x', 'y', startLocation, null,
                                           false, false, null, this.accumulation.duration);
                        textElement(
                            this.accumulation.renderer,
                            new TextOption(
                                id + 'text_' + point.index, location.x, location.y,
                                this.accumulation.enableRtl ? 'end' : 'start', point.labelCollection, rotate, 'auto', degree
                            ),
                            point.argsData.font, point.argsData.font.color || this.getSaturatedColor(point, point.argsData.color),
                            datalabelGroup, false, redraw, true, false, this.accumulation.duration,
                            null, null, null, null, true, this.accumulation.themeStyle.datalabelFont
                        );
                        element = null;
                    }
                    if (pointElement && this.accumulation.highlightMode !== 'None') {
                        datalabelGroup.setAttribute('class', pointElement.getAttribute('class') ? pointElement.getAttribute('class') : '');
                        for (let i: number = 0; i < datalabelGroup.children.length; i++) {
                            const existing: HTMLElement = document.getElementById(datalabelGroup.children[i as number].id);
                            if (existing) {
                                (datalabelGroup.children[i as number] as HTMLElement).style.opacity = existing.style.opacity;
                            }
                        }
                    }
                    if (this.accumulation.accumulationLegendModule && this.accumulation.legendSettings.visible && !this.accumulation.redraw && (dataLabel.position === 'Outside'
                        || this.accumulation.enableSmartLabels)) {
                        series.findMaxBounds(series.labelBound, point.labelRegion);
                    }
                    if (point.labelPosition === 'Outside') {
                        const element: Element = getElement(id + 'connector_' + point.index);
                        const previousDirection: string = element ? element.getAttribute('d') : '';
                        const pathElement: Element = this.accumulation.renderer.drawPath(new PathOption(
                            id + 'connector_' + point.index, 'transparent', dataLabel.connectorStyle.width,
                            dataLabel.connectorStyle.color || point.color, 1, dataLabel.connectorStyle.dashArray,
                            this.getConnectorPath(
                                <Rect>extend({}, point.labelRegion, null, true), point, dataLabel, point.labelAngle, series.index
                            )
                        ));
                        appendChildElement(false, datalabelGroup, pathElement, redraw, true, null, null, null, previousDirection,
                                           false, false, null, this.accumulation.duration);
                    }
                    appendChildElement(false, parent, datalabelGroup, redraw);
                }
                else if (getElement(datalabelGroup.id)) {
                    (getElement(datalabelGroup.id)).parentNode.removeChild(getElement(datalabelGroup.id));
                }
            }
        }
        if (this.accumulation.type === 'Pie' && dataLabel.textWrap === 'Normal' && dataLabel.textOverflow === 'Clip') {
            this.dataLabelClipPath(dataLabel, parent);
        }
    }

    /**
     * To calculate data label clip path.
     *
     * @param {AccumulationDataLabelSettingsModel} dataLabel - The settings for the data labels.
     * @param {HTMLElement} parent - The parent element of the data labels.
     * @returns {void}
     */
    private dataLabelClipPath(dataLabel: AccumulationDataLabelSettingsModel, parent: HTMLElement) : void {
        const id : string = this.accumulation.element.id + '_datalabel_Series_' + 0 + '_';
        const clippath : Element = this.accumulation.renderer.createClipPath({ id: id + 'clipPath' });
        let clipRect : Element;
        const radius : number = this.accumulation.pieSeriesModule.pieBaseRadius;
        if (dataLabel.position === 'Inside') {
            clipRect = this.accumulation.renderer.drawCircle(new CircleOption(id + 'clipPath_rect', 'transparent', { width: 0 }, 0, this.center.x, this.center.y, radius));
        }
        // Outside labels with maxWidth are already cut to the width, so no clip path is needed.
        if (dataLabel.position === 'Inside') {
            clippath.appendChild(clipRect);
            appendChildElement(false, this.accumulation.svgObject, clippath);
            parent.style.cssText = 'clip-path:url(#' + clippath.id + ')';
        }
    }

    /**
     * In this method datalabels region checked with legebdBounds and areaBounds.
     * Trimming of datalabel and point's visibility again changed here.
     *
     * @param {AccPoints} point - Current point in which trimming and visibility to be checked.
     * @param {AccPoints[]} points - Finalized points.
     * @param {AccumulationDataLabelSettingsModel} dataLabel - Datalabel model.
     * @param {number} seriesIndex - The series index for multi-series support.
     * @returns {void}
     */
    private finalizeDatalabels(point: AccPoints, points: AccPoints[], dataLabel: AccumulationDataLabelSettingsModel,
                               seriesIndex: number = 0): void {
        if (this.isOverlapping(point, points) ||
            (this.titleRect && point.labelRegion && isOverlap(point.labelRegion, this.titleRect))) {
            if (this.isCircular() && point.labelPosition === 'Outside' && this.accumulation.enableSmartLabels) {
                this.setPointVisibileFalse(point);
            }
        }
        if (this.accumulation.enableSmartLabels && point.labelVisible && point.labelRegion && point.labelPosition === 'Outside' &&
            this.isCircular() && dataLabel.textWrap === 'Normal' &&
            !point.argsData.template && point.label.indexOf('<br>') === -1) {
            this.repositionOutsideLabel(point, points, dataLabel);
        }
        if (this.accumulation.accumulationLegendModule && this.accumulation.legendSettings.visible &&
            point.labelVisible && point.labelRegion && !dataLabel.maxWidth &&
            dataLabel.textWrap === 'Normal') {
            const rect: Rect = this.accumulation.accumulationLegendModule.legendBounds;
            const currentSeries: AccumulationSeries = this.accumulation.visibleSeries[seriesIndex as number];
            if (currentSeries.type !== 'Pie' && this.accumulation.legendSettings.position === 'Left'
                && dataLabel.position === 'Outside') {
                point.labelRegion.x = point.labelRegion.x + rect.width;
            }
            const padding: number = this.accumulation.legendSettings.border.width / 2;
            this.textTrimming(
                point, new Rect(rect.x - padding, rect.y - padding, rect.width + (2 * padding), rect.height + (2 * padding)),
                dataLabel.font, this.accumulation.accumulationLegendModule.position, dataLabel);
        } else if (this.accumulation.accumulationLegendModule && this.accumulation.legendSettings.visible &&
            point.labelVisible && point.labelRegion && this.accumulation.enableSmartLabels) {
            // Wrapped, clipped or maxWidth-restricted labels: trim/wrap them to fit beside the legend,
            // and hide the label only if it still overlaps afterwards.
            const legendRect: Rect = this.accumulation.accumulationLegendModule.legendBounds;
            const legendPadding: number = this.accumulation.legendSettings.border.width / 2;
            const legendArea: Rect = new Rect(
                legendRect.x - legendPadding, legendRect.y - legendPadding,
                legendRect.width + (2 * legendPadding), legendRect.height + (2 * legendPadding));
            this.textTrimming(point, legendArea, dataLabel.font, this.accumulation.accumulationLegendModule.position, dataLabel);
            if (point.labelVisible && point.labelRegion && isOverlap(point.labelRegion, legendArea)) {
                this.setPointVisibileFalse(point);
            }
        }
        if (point.labelVisible && point.labelRegion && !dataLabel.maxWidth &&
            dataLabel.textWrap === 'Normal') {
            const position: string = this.isCircular() ? (point.labelRegion.x >= this.center.x) ? 'InsideRight' : 'InsideLeft' :
                (point.labelRegion.x >= point.region.x) ? 'InsideRight' : 'InsideLeft';

            this.textTrimming(point, this.areaRect, dataLabel.font, position, dataLabel);
        }
        if (point.labelVisible && point.labelRegion && !dataLabel.maxWidth  && dataLabel.textOverflow !== 'Clip' && this.accumulation.enableSmartLabels && ((point.labelRegion.y + point.labelRegion.height / 2 >
            this.areaRect.y + this.areaRect.height || point.labelRegion.y < this.areaRect.y) || (point.labelRegion.x < this.areaRect.x ||
                point.labelRegion.x + point.labelRegion.width > this.areaRect.x + this.areaRect.width))) {
            this.setPointVisibileFalse(point);
        }
        // Labels were moved after the arrangement; hide the label when its connector crosses a label that is already shown.
        if (this.accumulation.enableSmartLabels && this.isCircular() && point.labelVisible && point.labelRegion &&
            point.labelPosition === 'Outside' && !point.argsData.template) {
            const earlier: AccPoints[] = points.filter((other: AccPoints) => other.index < point.index && other.visible &&
                other.labelVisible && other.labelRegion && other.labelPosition === 'Outside');
            const isLeft: boolean = point.labelRegion.x + (point.labelRegion.width / 2) < this.center.x;
            if (point.isLabelUpdated && this.isConnectorPassingThroughSeries(point, point.labelRegion, isLeft)) {
                this.setPointVisibileFalse(point);
            } else if (this.isDrawnConnectorCrossingLabels(point, earlier, dataLabel) ||
                earlier.some((other: AccPoints) => this.isDrawnConnectorCrossingLabels(other, [point], dataLabel))) {
                this.setPointVisibileFalse(point);
            }
        }
    }

    // Coordinates (x1, y1, x2, y2, ...) of the connector as it will be drawn for the point.
    private getDrawnConnectorValues(point: AccPoints, dataLabel: AccumulationDataLabelSettingsModel): number[] {
        const path: string = this.getConnectorPath(
            <Rect>extend({}, point.labelRegion, null, true), point, dataLabel, point.labelAngle, 0);
        return (path.match(/-?\d+\.?\d*/g) || []).map(Number);
    }

    // True when the connector as it will be drawn for the point crosses another label, the gap between that label and
    // the end of its own connector, or the connector of that label.
    private isDrawnConnectorCrossingLabels(
        point: AccPoints, others: AccPoints[], dataLabel: AccumulationDataLabelSettingsModel
    ): boolean {
        const values: number[] = this.getDrawnConnectorValues(point, dataLabel);
        for (let j: number = 0; j < others.length; j++) {
            const region: Rect = others[j as number].labelRegion;
            const otherValues: number[] = this.getDrawnConnectorValues(others[j as number], dataLabel);
            // The label together with the end of its connector is treated as one block.
            let left: number = region.x - 1;
            let right: number = region.x + region.width + 1;
            let top: number = region.y - 1;
            let bottom: number = region.y + region.height + 1;
            if (otherValues.length >= 4) {
                const endX: number = otherValues[otherValues.length - 2];
                const endY: number = otherValues[otherValues.length - 1];
                left = Math.min(left, endX - 1);
                right = Math.max(right, endX + 1);
                top = Math.min(top, endY - 1);
                bottom = Math.max(bottom, endY + 1);
            }
            for (let i: number = 0; i + 3 < values.length; i += 2) {
                for (let t: number = 0; t <= 1.0001; t += 0.01) {
                    const x: number = values[i as number] + ((values[i + 2] - values[i as number]) * t);
                    const y: number = values[i + 1] + ((values[i + 3] - values[i + 1]) * t);
                    if (x >= left && x <= right && y >= top && y <= bottom) {
                        return true;
                    }
                }
                for (let k: number = 0; k + 3 < otherValues.length; k += 2) {
                    if (this.isLinesIntersect(
                        new ChartLocation(values[i as number], values[i + 1]), new ChartLocation(values[i + 2], values[i + 3]),
                        new ChartLocation(otherValues[k as number], otherValues[k + 1]),
                        new ChartLocation(otherValues[k + 2], otherValues[k + 3]))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Moves an outside label up or down to a valid position that offers more horizontal space before trimming.
    private repositionOutsideLabel(point: AccPoints, points: AccPoints[], dataLabel: AccumulationDataLabelSettingsModel): void {
        const isLeftSide: boolean = point.labelRegion.x < this.center.x;
        const legendModule: AccumulationLegend = this.accumulation.accumulationLegendModule;
        const legendVisible: boolean = !!legendModule && this.accumulation.legendSettings.visible;
        const padding: number = legendVisible ? this.accumulation.legendSettings.border.width / 2 : 0;
        // The legend only restricts labels that share its vertical span; labels above or below it may use the full width.
        const getLimit: (top: number, bottom: number) => number[] = (top: number, bottom: number): number[] => {
            const bounds: Rect = legendVisible ? legendModule.legendBounds : null;
            const shares: boolean = !!bounds && top < bounds.y + bounds.height + padding && bottom > bounds.y - padding;
            return [
                shares && legendModule.position === 'Left' ? bounds.x + bounds.width + padding : this.areaRect.x,
                shares && legendModule.position === 'Right' ? bounds.x - padding : this.areaRect.x + this.areaRect.width];
        };
        const isClip: boolean = dataLabel.textOverflow === 'Clip';
        // A fixed-width label that already fits is moved only when its drawn connector would cross an earlier label.
        const earlierShown: AccPoints[] = points.filter((other: AccPoints) => other.index < point.index && other.labelVisible &&
            other.labelRegion && other.labelPosition === 'Outside');
        const isForced: boolean = this.isDrawnConnectorCrossingLabels(point, earlierShown, dataLabel);
        // With maxWidth, the "full" text is the one limited to maxWidth, never the untrimmed label.
        const fullText: string = (dataLabel.maxWidth && !isForced) ? (isClip ?
            this.clipText(dataLabel.maxWidth, point.label, point.argsData.font) :
            textTrim(dataLabel.maxWidth, point.label, point.argsData.font, this.accumulation.enableRtl,
                     this.accumulation.themeStyle.datalabelFont)) : point.label;
        const textSize: Size = isForced ? point.textSize : this.getTextSize([fullText], dataLabel, point.argsData.font);
        const fullWidth: number = isForced ? point.labelRegion.width : textSize.width + (this.getPointMargin(point) * 2);
        const gap: number = 10;
        const currentLimit: number[] = getLimit(point.labelRegion.y, point.labelRegion.y + point.labelRegion.height);
        const currentSpace: number = isLeftSide ? point.labelRegion.x + point.labelRegion.width - currentLimit[0] :
            currentLimit[1] - point.labelRegion.x;
        if (currentSpace >= fullWidth && !isForced) {
            return;
        }
        const others: AccPoints[] = points.filter((other: AccPoints) => other !== point && other.labelVisible && other.labelRegion);
        const sameSide: AccPoints[] = others.filter((other: AccPoints) =>
            other.labelPosition === 'Outside' && (other.labelRegion.x < this.center.x) === isLeftSide);
        const areaTop: number = this.titleRect ? Math.max(this.areaRect.y, this.titleRect.y + this.titleRect.height + 2) : this.areaRect.y;
        const areaBottom: number = this.areaRect.y + this.areaRect.height;
        const height: number = point.labelRegion.height;
        const startCenter: number = point.labelRegion.y + height / 2;
        let bestRegion: Rect = null;
        let bestSpace: number = isForced ? fullWidth - 1 : currentSpace;
        // A trimmed label must keep at least one character besides the ellipsis.
        const minSpace: number = Math.min(fullWidth, measureText(isClip ? point.label.charAt(0) : point.label.charAt(0) + '...',
                                                                 point.argsData.font, this.accumulation.themeStyle.datalabelFont).width +
            (this.getPointMargin(point) * 2));
        for (let offset: number = 2; offset <= this.areaRect.height; offset += 2) {
            for (let direction: number = -1; direction <= 1; direction += 2) {
                const centerY: number = startCenter + (direction * offset);
                const limit: number[] = getLimit(centerY - height / 2, centerY + height / 2);
                // Move the label towards the pie, when the label ring leaves too little room, to gain width.
                const fullEdge: number = isLeftSide ? limit[0] + gap + fullWidth : limit[1] - gap - fullWidth;
                const ringEdge: number = this.getOutsideSeriesEdge(centerY, point, isLeftSide);
                const edges: number[] = [ringEdge, isLeftSide ? Math.max(ringEdge, fullEdge) : Math.min(ringEdge, fullEdge)];
                for (let e: number = 0; e < edges.length; e++) {
                    const edge: number = edges[e as number];
                    const space: number = isLeftSide ? edge - gap - limit[0] : limit[1] - (edge + gap);
                    if (space <= bestSpace || space < minSpace) {
                        continue;
                    }
                    const width: number = Math.min(fullWidth, space);
                    const region: Rect = new Rect(isLeftSide ? edge - gap - width : edge + gap, centerY - height / 2, width, height);
                    if ((e && this.isRegionInsidePie(region, point)) ||
                        region.y < areaTop || region.y + height > areaBottom || region.x < this.areaRect.x ||
                        region.x + width > this.areaRect.x + this.areaRect.width ||
                        this.isOutsideLabelOverlapping(region, others) ||
                        this.isOutsideConnectorOverlapping(point, region, isLeftSide, sameSide) ||
                        this.isConnectorPassingThroughSeries(point, region, isLeftSide)) {
                        continue;
                    }
                    bestSpace = space;
                    bestRegion = region;
                }
            }
            if (bestRegion && bestSpace >= fullWidth) {
                break;
            }
        }
        if (bestRegion) {
            if (bestSpace >= fullWidth) {
                bestRegion = new Rect(
                    isLeftSide ? bestRegion.x + bestRegion.width - fullWidth : bestRegion.x, bestRegion.y, fullWidth, height);
                point.labelCollection = isForced ? point.labelCollection : [fullText];
                point.textSize = textSize;
            } else {
                // Trim only to the maximum valid space available at the final position.
                const textSpace: number = bestRegion.width - (this.getPointMargin(point) * 2);
                point.labelCollection = [isClip ? this.clipText(textSpace, point.label, point.argsData.font) :
                    textTrim(textSpace, point.label, point.argsData.font,
                             this.accumulation.enableRtl, this.accumulation.themeStyle.datalabelFont)];
                point.textSize = this.getTextSize(point.labelCollection, dataLabel, point.argsData.font);
                const trimmedWidth: number = point.textSize.width + (this.getPointMargin(point) * 2);
                bestRegion.x = isLeftSide ? bestRegion.x + bestRegion.width - trimmedWidth : bestRegion.x;
                bestRegion.width = trimmedWidth;
            }
            point.labelRegion = bestRegion;
            point.isLabelUpdated = 1;
        }
    }

    /**
     * To find the template element size.
     *
     * @param {HTMLElement} element - To get a template element.
     * @param {AccPoints} point - The accumulation point for the template.
     * @param {IAccTextRenderEventArgs} argsData - The arguments for the accumulation points.
     * @param {boolean} redraw - Indicates whether to redraw the template.
     * @param {boolean} isTemplate - Indicates whether the element is a template.
     * @param {AccPoints[]} points - The accumulation points for the template.
     * @param {Element} datalabelGroup - The group element for the data labels.
     * @param {string} id - The identifier for the template.
     * @param {AccumulationDataLabelSettingsModel} dataLabel - The settings for the data labels.
     * @param {number} series - The series index.
     * @returns {Size} - The size of the template.
     */
    private getTemplateSize(
        element: HTMLElement, point: AccPoints, argsData: IAccTextRenderEventArgs, redraw: boolean,
        isTemplate: boolean, points: AccPoints[], datalabelGroup: Element,
        id: string, dataLabel: AccumulationDataLabelSettingsModel, series?: number
    ): Size {
        const seriesIndex: number = series ? series : 0;
        element = createTemplate(
            element, point.index, argsData.template, this.accumulation,
            point, this.accumulation.visibleSeries[seriesIndex as number], this.accumulation.element.id + '_DataLabel',
            seriesIndex, argsData, isTemplate, points, datalabelGroup, id, dataLabel, redraw
        );
        const clientRect: ClientRect = measureElementRect(element, redraw);
        return { width: clientRect.width, height: clientRect.height };
    }

    /**
     * To set the template element style.
     *
     * @param {HTMLElement} childElement - The child element of the template.
     * @param {AccPoints} point - The point data for the template.
     * @param {Element} parent - The parent element of the template.
     * @param {string} labelColor - The color of the label in the template.
     * @param {string} fill - The fill color of the template.
     * @param {boolean} redraw - Indicates whether to redraw the template.
     * @returns {void}
     */
    private setTemplateStyle(
        childElement: HTMLElement, point: AccPoints, parent: Element,
        labelColor: string, fill: string, redraw?: boolean
    ): void {
        childElement.style.left = (point.labelRegion.x) + 'px';
        childElement.style.top = (point.labelRegion.y) + 'px';
        childElement.style.color = labelColor || this.getSaturatedColor(point, point.labelPosition === 'Inside' ? fill : this.getLabelBackground(point));
        if (childElement.childElementCount) {
            appendChildElement(false, parent, childElement, redraw, true, 'left', 'top');
            this.doTemplateAnimation(this.accumulation, childElement);
        }
    }
    /**
     * To find saturated color for datalabel
     *
     * @param {AccPoints} point - The accumulation point.
     * @param {string} color - The original color.
     * @returns {string} - Get a saturated color.
     */
    private getSaturatedColor(point: AccPoints, color: string): string {
        let saturatedColor: string;
        if (this.getPointMargin(point) >= 1) {
            saturatedColor = color === 'transparent' ? this.getLabelBackground(point) : color;
        } else {
            saturatedColor = this.getLabelBackground(point);
        }
        saturatedColor = (saturatedColor === 'transparent') ? ((this.accumulation.theme.indexOf('Dark') > -1 || this.accumulation.theme.indexOf('HighContrast') > -1) ? 'black' : 'white') : saturatedColor;
        const rgbValue: ColorValue = convertHexToColor(colorNameToHex(saturatedColor));
        const contrast: number = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
        return this.accumulation.theme === 'Bootstrap5' ? '#212529' : this.accumulation.theme === 'Bootstrap5Dark' ? '#DEE2E6' : contrast >= 128 ? this.accumulation.theme.indexOf('Tailwind3') > -1 ? '#111827' : 'black' : this.accumulation.theme.indexOf('Tailwind3') > -1 ? '#FFFFFF' : 'white';
    }

    /**
     * Animates the data label template.
     *
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {Element} element - The element to animate.
     * @returns {void}
     * @private
     */
    public doTemplateAnimation(accumulation: AccumulationChart, element: Element): void {
        // Extract seriesIndex from element ID (format: {chartId}_Series_{seriesIndex}_DataLabel_{pointIndex})
        let seriesIndex: number = 0;
        if (element && element.id) {
            const match: RegExpMatchArray = element.id.match(/_Series_(\d+)_/);
            if (match) {
                seriesIndex = parseInt(match[1], 10);
            }
        }
        const series: AccumulationSeries = accumulation.visibleSeries[seriesIndex as number];
        const delay: number = series.animation.delay + series.animation.duration;
        if (((series.animation.enable && animationMode !== 'Disable') || animationMode === 'Enable') && accumulation.animateSeries) {
            (<HTMLElement>element).style.visibility = 'hidden';
            templateAnimate(element, delay, 200, 'ZoomIn');
        }
    }
    /**
     * To find background color for the datalabel.
     *
     * @param {AccPoints} point - The data point for which to determine the background color.
     * @returns {string} - The background color for the data label.
     */
    private getLabelBackground(point: AccPoints): string {
        return point.labelPosition === 'Outside' ?
            this.accumulation.background || this.accumulation.themeStyle.background : !point.y ? this.accumulation.theme.indexOf('dark') ? 'white' : 'black' : point.color;
    }
    /**
     * To correct the padding between datalabel regions.
     *
     * @param {Rect} labelRegion - The region occupied by the data label.
     * @param {Size} textSize - The size of the text within the data label.
     * @param {number} padding - The padding value to adjust the spacing.
     * @returns {void}
     */
    private correctLabelRegion(labelRegion: Rect, textSize: Size, padding: number = 4): void {
        labelRegion.height -= padding;
        labelRegion.width -= padding;
        labelRegion.x += padding / 2;
        labelRegion.y += padding / 2;
        textSize.height -= padding;
        textSize.width -= padding;
    }
    /**
     * To get the dataLabel module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'AccumulationDataLabel';
    }

    /**
     * To destroy the data label.
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroy method performed here.
         */
    }

    //calculation for placing labels smartly
    private extendedLabelsCalculation(index: number): void {
        const series: AccumulationSeries = <AccumulationSeries>this.accumulation.series[index as number];
        series.rightSidePoints.forEach((point: AccPoints, pointIndex: number, halfSidePoints: AccPoints[]) => {
            point.initialLabelRegion = point.labelRegion;
            point.isLabelUpdated = 0;
            this.skipPoints(point, halfSidePoints, pointIndex);
        });
        series.leftSidePoints.forEach((point: AccPoints, pointIndex: number, halfSidePoints: AccPoints[]) => {
            point.initialLabelRegion = point.labelRegion;
            point.isLabelUpdated = 0;
            this.skipPoints(point, halfSidePoints, pointIndex);
        });
        const dataLabel: AccumulationDataLabelSettingsModel = series.dataLabel;
        if (this.isCircular() && !this.isVariousRadius()) {
            const leftAccepted: AccPoints[] = this.arrangeSequentialOutsideLabels(series.leftSidePoints, dataLabel, true);
            const rightAccepted: AccPoints[] = this.arrangeSequentialOutsideLabels(series.rightSidePoints, dataLabel, false, leftAccepted);
            this.placeOnOppositeSide(series.leftSidePoints, dataLabel, true, leftAccepted, rightAccepted);
            this.placeOnOppositeSide(series.rightSidePoints, dataLabel, false, rightAccepted, leftAccepted);
            return;
        }
        this.arrangeLeftSidePoints(series);
        this.isIncreaseAngle = false;
        this.arrangeRightSidePoints(series);
    }

    // otherSidePoints: already arranged labels of the opposite side, checked for label and connector collisions.
    private arrangeSequentialOutsideLabels(
        points: AccPoints[], dataLabel: AccumulationDataLabelSettingsModel, isLeftSide: boolean, otherSidePoints?: AccPoints[]
    ): AccPoints[] {
        const renderPoints: AccPoints[] = points.filter(
            (point: AccPoints) => point.labelVisible && point.labelPosition === 'Outside' && point.labelRegion
        );
        renderPoints.sort((first: AccPoints, second: AccPoints) => {
            const firstAnchor: ChartLocation = degreeToLocation(first.midAngle, this.radius, this.center);
            const secondAnchor: ChartLocation = degreeToLocation(second.midAngle, this.radius, this.center);
            return firstAnchor.y - secondAnchor.y;
        });
        const acceptedPoints: AccPoints[] = [];
        for (let i: number = 0; i < renderPoints.length; i++) {
            const point: AccPoints = renderPoints[i as number];
            const otherPoints: AccPoints[] = otherSidePoints || [];
            const isClear: boolean = !this.isOutsideLabelOverlapping(point.labelRegion, acceptedPoints) &&
                !this.isOutsideConnectorOverlapping(point, point.labelRegion, isLeftSide, acceptedPoints) &&
                !this.isOutsideLabelOverlapping(point.labelRegion, otherPoints) &&
                !this.isOutsideConnectorOverlapping(point, point.labelRegion, isLeftSide, otherPoints);
            if (isClear && this.isOutsideRegionInBounds(point.labelRegion)) {
                // Neither label nor connector overlaps: keep original position and original connector.
                acceptedPoints.push(point);
                continue;
            }
            if (this.placeNearestOutsideLabel(point, acceptedPoints, dataLabel, isLeftSide, otherPoints)) {
                acceptedPoints.push(point);
            } else if (isClear) {
                // No better position exists: keep the original so it can still be trimmed to the available width.
                acceptedPoints.push(point);
            } else {
                this.setPointVisibileFalse(point);
            }
        }
        return acceptedPoints;
    }

    // Second pass: a label that found no room on its own side moves to the opposite side (for example above or below
    // the pie) when a collision-free position exists there.
    private placeOnOppositeSide(
        points: AccPoints[], dataLabel: AccumulationDataLabelSettingsModel, isLeftSide: boolean,
        ownAccepted: AccPoints[], oppositeAccepted: AccPoints[]
    ): void {
        const hidden: AccPoints[] = points.filter((point: AccPoints) =>
            !point.labelVisible && point.labelPosition === 'Outside' && point.initialLabelRegion && point.visible);
        for (let i: number = 0; i < hidden.length; i++) {
            const point: AccPoints = hidden[i as number];
            const preferredCenter: number = this.getPreferredLabelCenter(point);
            const savedRegion: Rect = point.labelRegion;
            point.labelRegion = point.initialLabelRegion;
            point.labelVisible = true;
            this.skipOrderCheck = true;
            let placed: boolean = false;
            try {
                for (let offset: number = 0; offset <= this.areaRect.height && !placed; offset += 2) {
                    placed = this.setNearestOutsideCandidate(
                        point, oppositeAccepted, dataLabel, !isLeftSide, preferredCenter - offset, ownAccepted) ||
                        (offset > 0 && this.setNearestOutsideCandidate(
                            point, oppositeAccepted, dataLabel, !isLeftSide, preferredCenter + offset, ownAccepted));
                }
            } finally {
                this.skipOrderCheck = false;
            }
            if (placed) {
                oppositeAccepted.push(point);
            } else {
                point.labelRegion = savedRegion;
                point.labelVisible = false;
            }
        }
    }

    private skipOrderCheck: boolean = false;

    // True when the whole label lies inside the chart area and does not run into the legend.
    private isOutsideRegionInBounds(region: Rect): boolean {
        if (region.x < this.areaRect.x || region.x + region.width > this.areaRect.x + this.areaRect.width) {
            return false;
        }
        const legendModule: AccumulationLegend = this.accumulation.accumulationLegendModule;
        if (legendModule && this.accumulation.legendSettings.visible) {
            const bounds: Rect = legendModule.legendBounds;
            return !isOverlap(region, bounds);
        }
        return true;
    }

    private placeNearestOutsideLabel(
        point: AccPoints, acceptedPoints: AccPoints[], dataLabel: AccumulationDataLabelSettingsModel,
        isLeftSide: boolean, otherPoints: AccPoints[]
    ): boolean {
        const preferredCenter: number = this.getPreferredLabelCenter(point);
        const movementLimit: number = Math.max(point.labelRegion.height * 1.25, this.areaRect.height * 0.08);
        for (let offset: number = 0; offset <= movementLimit; offset += 2) {
            if (this.setNearestOutsideCandidate(point, acceptedPoints, dataLabel, isLeftSide, preferredCenter - offset, otherPoints)) {
                return true;
            }
            if (offset > 0 &&
                this.setNearestOutsideCandidate(point, acceptedPoints, dataLabel, isLeftSide, preferredCenter + offset, otherPoints)) {
                return true;
            }
        }
        return false;
    }

    private setNearestOutsideCandidate(
        point: AccPoints, acceptedPoints: AccPoints[], dataLabel: AccumulationDataLabelSettingsModel,
        isLeftSide: boolean, centerY: number, otherPoints: AccPoints[]
    ): boolean {
        const connectorGap: number = 10;
        const areaTop: number = this.titleRect ?
            Math.max(this.areaRect.y, this.titleRect.y + this.titleRect.height + 2) : this.areaRect.y;
        const areaBottom: number = this.areaRect.y + this.areaRect.height;
        const seriesEdge: number = this.getOutsideSeriesEdge(centerY, point, isLeftSide);
        const regionWidth: number = isLeftSide ? seriesEdge - this.areaRect.x :
            this.areaRect.x + this.areaRect.width - seriesEdge;
        const chartWidth: number = regionWidth - connectorGap - (this.getPointMargin(point) * 2);
        const availableWidth: number = dataLabel.maxWidth ? Math.min(dataLabel.maxWidth, chartWidth) : chartWidth;
        if (availableWidth <= 0) {
            return false;
        }
        const isWrap: boolean = dataLabel.textWrap === 'Wrap' || dataLabel.textWrap === 'AnyWhere';
        const labelCollection: string[] = isWrap ? textWrap(
            point.label, availableWidth, point.argsData.font, this.accumulation.enableRtl,
            dataLabel.textWrap === 'AnyWhere', dataLabel.textOverflow === 'Clip',
            this.accumulation.themeStyle.datalabelFont
        ) : point.labelCollection;
        const textSize: Size = this.getTextSize(labelCollection, dataLabel, point.argsData.font);
        const labelRegion: Rect = new Rect(
            isLeftSide ? seriesEdge - connectorGap - textSize.width - (this.getPointMargin(point) * 2) : seriesEdge + connectorGap,
            centerY - (textSize.height + (this.getPointMargin(point) * 2)) / 2,
            textSize.width + (this.getPointMargin(point) * 2), textSize.height + (this.getPointMargin(point) * 2)
        );
        if (labelRegion.y < areaTop || labelRegion.y + labelRegion.height > areaBottom ||
            labelRegion.x < this.areaRect.x || labelRegion.x + labelRegion.width > this.areaRect.x + this.areaRect.width ||
            this.isOutsideLabelOverlapping(labelRegion, acceptedPoints) ||
            this.isOutsideConnectorOverlapping(point, labelRegion, isLeftSide, acceptedPoints) ||
            this.isOutsideLabelOverlapping(labelRegion, otherPoints) ||
            this.isOutsideConnectorOverlapping(point, labelRegion, isLeftSide, otherPoints) ||
            !this.isOutsideLabelOrderValid(labelRegion, acceptedPoints) ||
            this.isConnectorPassingThroughSeries(point, labelRegion, isLeftSide)) {
            return false;
        }
        point.labelCollection = labelCollection;
        point.textSize = textSize;
        point.labelRegion = labelRegion;
        point.labelAngle = point.midAngle;
        point.isLabelUpdated = 1;
        return true;
    }

    private isOutsideLabelOrderValid(labelRegion: Rect, acceptedPoints: AccPoints[]): boolean {
        if (this.skipOrderCheck || !acceptedPoints.length) {
            return true;
        }
        const previousPoint: AccPoints = acceptedPoints[(acceptedPoints.length - 1) as number];
        const labelPadding: number = 2;
        return labelRegion.y >= previousPoint.labelRegion.y + previousPoint.labelRegion.height + labelPadding;
    }

    private isOutsideLabelOverlapping(labelRegion: Rect, acceptedPoints: AccPoints[]): boolean {
        for (let i: number = 0; i < acceptedPoints.length; i++) {
            if (isOverlap(labelRegion, acceptedPoints[i as number].labelRegion)) {
                return true;
            }
        }
        return false;
    }

    // Mirrors the drawn connector of a moved label: [start on own slice arc, stub start, stub end].
    // The start is the point of the slice arc nearest to the label, kept inside the middle 70% of the slice's angular span
    // so it never reaches the neighbouring slice's connector start area.
    private getOutsideConnectorLine(point: AccPoints, labelRegion: Rect, isLeftSide: boolean): ChartLocation[] {
        const radius: number = this.getPointRadius(point);
        const centerY: number = labelRegion.y + labelRegion.height / 2;
        const edgeX: number = isLeftSide ? labelRegion.x + labelRegion.width : labelRegion.x;
        const direction: number = isLeftSide ? 1 : -1;
        const anchor: ChartLocation = new ChartLocation(edgeX + (direction * 20), centerY);
        let angle: number = Math.atan2(anchor.y - this.center.y, anchor.x - this.center.x) * 180 / Math.PI;
        const halfSpan: number = isNaN(point.degree) || point.degree === undefined ? 0 : point.degree * 0.35;
        let diff: number = ((angle - point.midAngle + 540) % 360) - 180;
        diff = Math.max(-halfSpan, Math.min(halfSpan, diff));
        angle = point.midAngle + diff;
        return [
            degreeToLocation(angle, radius, this.center),
            anchor,
            new ChartLocation(edgeX + (direction * 10), centerY)
        ];
    }

    // The connector must reach its own label before touching, crossing or passing the start segment of another connector.
    private isOutsideConnectorOverlapping(
        point: AccPoints, labelRegion: Rect, isLeftSide: boolean, acceptedPoints: AccPoints[]
    ): boolean {
        const clearance: number = 3;
        const current: ChartLocation[] = this.getOutsideConnectorLine(point, labelRegion, isLeftSide);
        for (let i: number = 0; i < acceptedPoints.length; i++) {
            const accepted: AccPoints = acceptedPoints[i as number];
            const other: ChartLocation[] = this.getOutsideConnectorLine(
                accepted, accepted.labelRegion, accepted.labelRegion.x + (accepted.labelRegion.width / 2) < this.center.x);
            if (this.isLineRectangleIntersect(current[0], current[1], accepted.labelRegion) ||
                this.isLineRectangleIntersect(other[0], other[1], labelRegion)) {
                return true;
            }
            for (let a: number = 0; a < 2; a++) {
                for (let b: number = 0; b < 2; b++) {
                    if (this.isLinesIntersect(current[a as number], current[a + 1], other[b as number], other[b + 1]) ||
                        this.getSegmentDistance(current[a as number], current[a + 1], other[b as number], other[b + 1]) < clearance) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Minimum distance between two non-intersecting segments.
    private getSegmentDistance(a1: ChartLocation, a2: ChartLocation, b1: ChartLocation, b2: ChartLocation): number {
        const pointToSegment: Function = (p: ChartLocation, s1: ChartLocation, s2: ChartLocation): number => {
            const dx: number = s2.x - s1.x;
            const dy: number = s2.y - s1.y;
            const lengthSquare: number = (dx * dx) + (dy * dy);
            const t: number = lengthSquare ? Math.max(0, Math.min(1, (((p.x - s1.x) * dx) + ((p.y - s1.y) * dy)) / lengthSquare)) : 0;
            return Math.sqrt(Math.pow(p.x - (s1.x + (t * dx)), 2) + Math.pow(p.y - (s1.y + (t * dy)), 2));
        };
        return Math.min(pointToSegment(a1, b1, b2), pointToSegment(a2, b1, b2), pointToSegment(b1, a1, a2), pointToSegment(b2, a1, a2));
    }

    // True when the label rectangle touches the slice circle.
    private isRegionInsidePie(region: Rect, point: AccPoints): boolean {
        const nearestX: number = Math.max(region.x, Math.min(this.center.x, region.x + region.width));
        const nearestY: number = Math.max(region.y, Math.min(this.center.y, region.y + region.height));
        return Math.pow(nearestX - this.center.x, 2) + Math.pow(nearestY - this.center.y, 2) <
            Math.pow(this.getPointRadius(point) + 2, 2);
    }

    // The connector (at most two segments) must leave its slice outward, stay at or beyond the slice radius and clear of its own label.
    private isConnectorPassingThroughSeries(point: AccPoints, labelRegion: Rect, isLeftSide: boolean): boolean {
        const line: ChartLocation[] = this.getOutsideConnectorLine(point, labelRegion, isLeftSide);
        const radius: number = this.getPointRadius(point);
        for (let i: number = 0; i < 2; i++) {
            const start: ChartLocation = line[i as number];
            const end: ChartLocation = line[i + 1];
            for (let t: number = i ? 0 : 0.02; t <= 1.0001; t += 0.02) {
                const x: number = start.x + ((end.x - start.x) * t);
                const y: number = start.y + ((end.y - start.y) * t);
                if (Math.sqrt(Math.pow(x - this.center.x, 2) + Math.pow(y - this.center.y, 2)) < radius - 0.01) {
                    return true;
                }
                // The connector must not run through its own label either.
                if (x > labelRegion.x && x < labelRegion.x + labelRegion.width &&
                    y > labelRegion.y && y < labelRegion.y + labelRegion.height) {
                    return true;
                }
            }
        }
        return false;
    }

    // Slice radius of the point; differs from the series radius when per-point radius is mapped.
    private getPointRadius(point: AccPoints): number {
        return this.isVariousRadius() ?
            stringToNumber(point.sliceRadius, this.accumulation.pieSeriesModule.seriesRadius) : this.radius;
    }

    private getPreferredLabelCenter(point: AccPoints): number {
        const region: Rect = point.initialLabelRegion || point.labelRegion;
        return region.y + region.height / 2;
    }

    private getOutsideSeriesEdge(centerY: number, point: AccPoints, isLeftSide: boolean): number {
        const labelRadius: number = !this.isVariousRadius() ? this.accumulation.pieSeriesModule.labelRadius + 10 :
            this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[0 as number], point);
        const verticalDistance: number = Math.abs(centerY - this.center.y);
        const horizontalDistance: number = verticalDistance < labelRadius ?
            Math.sqrt((labelRadius * labelRadius) - (verticalDistance * verticalDistance)) : 0;
        return isLeftSide ? this.center.x - horizontalDistance : this.center.x + horizontalDistance;
    }

    /**
     * Rightside points alignments calculation.
     *
     * @param {AccumulationSeries} series - To get a proper series.
     * @returns {void}
     */
    private arrangeRightSidePoints(series: AccumulationSeries): void {
        let startFresh: boolean;
        let angleChanged: boolean;
        const rightSideRenderPoints: AccPoints[] = series.rightSidePoints.filter(
            (point: AccPoints) => (point.labelVisible && point.labelPosition === 'Outside'));
        this.rightSideRenderingPoints = rightSideRenderPoints;
        let checkAngle: number;
        let currentPoint: AccPoints;
        const lastPoint: AccPoints = rightSideRenderPoints[rightSideRenderPoints.length - 1];
        let nextPoint: AccPoints;
        if (lastPoint) {
            if (lastPoint.labelAngle > 90 && lastPoint.labelAngle < 270) {
                this.isIncreaseAngle = true;
                this.changeLabelAngle(lastPoint, 89, series.index);
            }
        }
        /**
         * Right side points arranged from last point.
         * A point checked with successive points for overlapping.
         * If that is overlapped, its label angle is decreased and placing in optimal position
         * If one point's angle is decreased, its previous points in the half side points also decreased until it reaced optimum position.
         * When decreasing angle falls beyond 270, label angle increased.
         * If one point's angle is increased, its successive points in that half point also increased until it reaced optimum position.
         */
        for (let i: number = rightSideRenderPoints.length - 1; i >= 0; i--) {
            currentPoint = rightSideRenderPoints[i as number];
            nextPoint = rightSideRenderPoints[i + 1];
            // A point checked for overlapping, label visibility
            if (this.isOverlapWithNext(currentPoint, rightSideRenderPoints, i) && currentPoint.labelVisible
                || !(currentPoint.labelAngle <= 90 || currentPoint.labelAngle >= 270)) {
                checkAngle = lastPoint.labelAngle + 10;
                angleChanged = true;
                //If last's point change angle in beyond the limit, stop the increasing angle and do decrease the angle.
                if (startFresh) {
                    this.isIncreaseAngle = false;
                } else if (checkAngle > 90 && checkAngle < 270 && nextPoint.isLabelUpdated) {
                    this.isIncreaseAngle = true;
                }
                if (!this.isIncreaseAngle) {
                    for (let k: number = i + 1; k < rightSideRenderPoints.length; k++) {
                        this.increaseAngle(rightSideRenderPoints[k - 1], rightSideRenderPoints[k as number], series, true);
                    }
                } else {
                    for (let k: number = i + 1; k > 0; k--) {
                        this.decreaseAngle(rightSideRenderPoints[k as number], rightSideRenderPoints[k - 1], series, true);
                    }
                }
            } else {
                //If a point did not overlapped with previous points, increase the angle always for right side points.
                if (angleChanged && nextPoint && !nextPoint.isLabelUpdated) {
                    startFresh = true;
                }
            }
        }
    }

    /**
     * Leftside points alignments calculation.
     *
     * @param {AccumulationSeries} series - To get a proper series.
     * @returns {void}
     */
    private arrangeLeftSidePoints(series: AccumulationSeries): void {
        const leftSideRenderPoints: AccPoints[] = series.leftSidePoints.filter(
            (point: AccPoints) => (point.labelVisible && point.labelPosition === 'Outside'));
        this.leftSideRenderingPoints = leftSideRenderPoints;
        let previousPoint: AccPoints;
        let currentPoint: AccPoints;
        let angleChanged: boolean;
        let startFresh: boolean;
        /**
         * Left side points arranged from first point.
         * A point checked with previous points for overlapping.
         * If that is overlapped, its label angle is decreased and placing in optimal position
         * If one point's angle is decreased, its previous points in the half side points also decreased until it reaced optimum position.
         * When decreasing angle falls beyond 90, label angle increased.
         * If one point's angle is increased, its successive points in that half point also increased until it reaced optimum position.
         */
        for (let i: number = 0; i < leftSideRenderPoints.length; i++) {
            currentPoint = leftSideRenderPoints[i as number];
            previousPoint = leftSideRenderPoints[i - 1];
            // A point checked
            if (this.isOverlapWithPrevious(currentPoint, leftSideRenderPoints, i) && currentPoint.labelVisible
                || !(currentPoint.labelAngle < 270)) {
                angleChanged = true;
                if (startFresh) {
                    this.isIncreaseAngle = false;
                }
                if (!this.isIncreaseAngle) {
                    for (let k: number = i; k > 0; k--) {
                        this.decreaseAngle(leftSideRenderPoints[k as number], leftSideRenderPoints[k - 1], series, false);
                        leftSideRenderPoints.filter((point: AccPoints, index: number) => {
                            if (point.isLabelUpdated && leftSideRenderPoints[index as number].labelAngle - 10 < 100) {
                                this.isIncreaseAngle = true;
                            }
                        });
                    }
                } else {
                    for (let k: number = i; k < leftSideRenderPoints.length; k++) {
                        this.increaseAngle(leftSideRenderPoints[k - 1], leftSideRenderPoints[k as number], series, false);
                    }
                }
            } else {
                if (angleChanged && previousPoint && previousPoint.isLabelUpdated) {
                    startFresh = true;
                }
            }
        }
    }

    private decreaseAngle(currentPoint: AccPoints, previousPoint: AccPoints, series: AccumulationSeries, isRightSide: boolean): void {
        if (isNullOrUndefined(currentPoint) || isNullOrUndefined(previousPoint)) {
            return null;
        }
        let count: number = 1;
        if (isRightSide) {
            while (isOverlap(currentPoint.labelRegion, previousPoint.labelRegion) || (!this.isVariousRadius() &&
                !((previousPoint.labelRegion.height + previousPoint.labelRegion.y) < currentPoint.labelRegion.y))) {
                let newAngle: number = previousPoint.midAngle - count;
                if (newAngle < 0) {
                    newAngle = 360 + newAngle;
                }
                if (newAngle <= 270 && newAngle >= 90) {
                    newAngle = 270;
                    this.isIncreaseAngle = true;
                    break;
                }
                this.changeLabelAngle(previousPoint, newAngle, series.index);
                count++;
            }
        } else {
            if (currentPoint.labelAngle > 270) {
                this.changeLabelAngle(currentPoint, 270, series.index);
                previousPoint.labelAngle = 270;
            }
            while (isOverlap(currentPoint.labelRegion, previousPoint.labelRegion) || (!this.isVariousRadius() &&
                ((currentPoint.labelRegion.y + currentPoint.labelRegion.height) > previousPoint.labelRegion.y))) {
                let newAngle: number = previousPoint.midAngle - count;
                if (!(newAngle <= 270 && newAngle >= 90)) {
                    newAngle = 90;
                    this.isIncreaseAngle = true;
                    break;
                }
                this.changeLabelAngle(previousPoint, newAngle, series.index);
                if (isOverlap(currentPoint.labelRegion, previousPoint.labelRegion) &&
                    !series.leftSidePoints.indexOf(previousPoint) && (newAngle - 1 < 90 && newAngle - 1 > 270)) {
                    this.changeLabelAngle(currentPoint, currentPoint.labelAngle + 1, series.index);
                    this.arrangeLeftSidePoints(series);
                    break;
                }
                count++;
            }
        }
    }

    private increaseAngle(currentPoint: AccPoints, nextPoint: AccPoints, series: AccumulationSeries, isRightSide: boolean): void {
        if (isNullOrUndefined(currentPoint) || isNullOrUndefined(nextPoint)) {
            return null;
        }
        let count: number = 1;
        if (isRightSide) {
            while (isOverlap(currentPoint.labelRegion, nextPoint.labelRegion) || (!this.isVariousRadius() &&
                !((currentPoint.labelRegion.y + currentPoint.labelRegion.height) < nextPoint.labelRegion.y))) {
                let newAngle: number = nextPoint.midAngle + count;
                if (newAngle < 270 && newAngle > 90) {
                    newAngle = 90;
                    this.isIncreaseAngle = true;
                    break;
                }
                this.changeLabelAngle(nextPoint, newAngle, series.index);
                if (isOverlap(currentPoint.labelRegion, nextPoint.labelRegion) && (newAngle + 1 > 90 && newAngle + 1 < 270) &&
                    this.rightSideRenderingPoints.indexOf(nextPoint) === this.rightSideRenderingPoints.length - 1) {
                    this.changeLabelAngle(currentPoint, currentPoint.labelAngle - 1, series.index);
                    nextPoint.labelRegion = nextPoint.initialLabelRegion;
                    this.arrangeRightSidePoints(series);
                    break;
                }
                if (count > 360) {
                    break;
                }
                count++;
            }
        } else {
            while (isOverlap(currentPoint.labelRegion, nextPoint.labelRegion) || (!this.isVariousRadius() &&
                (currentPoint.labelRegion.y < (nextPoint.labelRegion.y + nextPoint.labelRegion.height)))) {
                let newAngle: number = nextPoint.midAngle + count;
                if (!(newAngle < 270 && newAngle > 90)) {
                    newAngle = 270;
                    this.isIncreaseAngle = false;
                    break;
                }
                this.changeLabelAngle(nextPoint, newAngle, series.index);
                if (count > 360) {
                    break;
                }
                count++;
            }
        }
    }

    private changeLabelAngle(currentPoint: AccPoints, newAngle: number, seriesIndex?: number): void {
        const currentSeriesIndex: number = seriesIndex ? seriesIndex : 0;
        const dataLabel: AccumulationDataLabelSettingsModel =
            this.accumulation.series[currentSeriesIndex as number].dataLabel;
        let variableR: number;
        if (this.isVariousRadius()) {
            variableR = this.accumulation.pieSeriesModule.getLabelRadius(
                this.accumulation.visibleSeries[currentSeriesIndex as number], currentPoint
            );
        }

        //padding 10px is added to label radius for increasing the angle and avoid congestion.
        const labelRadius: number = (currentPoint.labelPosition === 'Outside' && this.accumulation.enableSmartLabels &&
            dataLabel.position === 'Inside') ?
            this.radius + stringToNumber(dataLabel.connectorStyle.length || '4%', this.accumulation.pieSeriesModule.size / 2) :
            (!this.isVariousRadius() ? this.accumulation.pieSeriesModule.labelRadius + 10 : variableR);
        const radius: number = (!this.isVariousRadius() ? labelRadius : variableR);
        this.updateLabelRegion(
            currentPoint, dataLabel, currentPoint.textSize, radius, this.getPointMargin(currentPoint), newAngle, currentSeriesIndex
        );
        currentPoint.isLabelUpdated = 1;
        currentPoint.labelAngle = newAngle;
    }

    private isOverlapWithPrevious(currentPoint: AccPoints, points: AccPoints[], currentPointIndex?: number): boolean {
        for (let i: number = 0; i < currentPointIndex; i++) {
            if (i !== points.indexOf(currentPoint) &&
                points[i as number].visible && points[i as number].labelVisible &&
                points[i as number].labelRegion && currentPoint.labelRegion &&
                currentPoint.labelVisible && isOverlap(currentPoint.labelRegion, points[i as number].labelRegion)) {
                return true;
            }
        }
        return false;
    }

    private isOverlapWithNext(point: AccPoints, points: AccPoints[], pointIndex?: number): boolean {
        for (let i: number = pointIndex; i < points.length; i++) {
            if (i !== points.indexOf(point) && points[i as number].visible &&
                points[i as number].labelVisible && points[i as number].labelRegion &&
                point.labelRegion && point.labelVisible && isOverlap(point.labelRegion, points[i as number].labelRegion)) {
                return true;
            }
        }
        return false;
    }


    private skipPoints(currentPoint: AccPoints, halfsidePoints: AccPoints[], pointIndex: number): void {
        if (pointIndex > 0 && ((currentPoint.midAngle < 285 && currentPoint.midAngle > 255) ||
            (currentPoint.midAngle < 105 && currentPoint.midAngle > 75))) {
            const previousPoint: AccPoints = halfsidePoints[pointIndex - 1];
            const angleDiff: number = currentPoint.endAngle % 360 - currentPoint.startAngle % 360;
            const prevAngleDiff: number = previousPoint.endAngle % 360 - previousPoint.startAngle % 360;
            if (prevAngleDiff <= angleDiff && angleDiff < 5 && previousPoint.labelVisible) {
                this.setPointVisibleTrue(currentPoint);
            }
        } else if (pointIndex > 1 && ((currentPoint.midAngle < 300 && currentPoint.midAngle > 240) ||
            (currentPoint.midAngle < 120 && currentPoint.midAngle > 60))) {
            const prevPoint: AccPoints = halfsidePoints[pointIndex - 1];
            const secondPrevPoint: AccPoints = halfsidePoints[pointIndex - 2];
            const angleDiff: number = currentPoint.endAngle % 360 - currentPoint.startAngle % 360;
            const prevAngleDiff: number = prevPoint.endAngle % 360 - prevPoint.startAngle % 360;
            const thirdAngleDiff: number = secondPrevPoint.endAngle % 360 - secondPrevPoint.startAngle % 360;
            if (angleDiff < 3 && prevAngleDiff < 3 && thirdAngleDiff < 3 && prevPoint.labelVisible && currentPoint.labelVisible) {
                this.setPointVisibleTrue(currentPoint);
            }
        }
    }

    private getPerpendicularDistance(startPoint: ChartLocation, point: AccPoints): ChartLocation {
        let increasedLocation: ChartLocation;
        const add: number = 10;
        const height: number = add + 10 * Math.sin(point.midAngle * Math.PI / 360);
        if (point.midAngle > 270 && point.midAngle < 360) {
            increasedLocation = new ChartLocation(startPoint.x + height * (Math.cos((360 - point.midAngle) * Math.PI / 180)),
                                                  startPoint.y - height * (Math.sin((360 - point.midAngle) * Math.PI / 180)));
        } else if (point.midAngle > 0 && point.midAngle < 90) {
            increasedLocation = new ChartLocation(startPoint.x + height * (Math.cos((point.midAngle) * Math.PI / 180)),
                                                  startPoint.y + height * (Math.sin((point.midAngle) * Math.PI / 180)));
        // eslint-disable-next-line no-dupe-else-if
        } else if (point.midAngle > 0 && point.midAngle < 90) {
            increasedLocation = new ChartLocation(startPoint.x - height * (Math.cos((point.midAngle - 90) * Math.PI / 180)),
                                                  startPoint.y + height * (Math.sin((point.midAngle - 90) * Math.PI / 180)));
        } else {
            increasedLocation = new ChartLocation(startPoint.x - height * (Math.cos((point.midAngle - 180) * Math.PI / 180)),
                                                  startPoint.y - height * (Math.sin((point.midAngle - 180) * Math.PI / 180)));
        }
        return increasedLocation;
    }
}
