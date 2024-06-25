import { ChartLocation, ColorValue, RectOption, isCollide, isOverlap, LabelLocation, rotateTextSize } from '../../common/utils/helper';
import { markerAnimate, appendChildElement, getVisiblePoints } from '../../common/utils/helper';
import { getLabelText, convertHexToColor, calculateRect, textElement, colorNameToHex } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Size, measureText, TextOption, Rect, SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { BorderModel, MarginModel, FontModel } from '../../common/model/base-model';
import { DataLabelSettingsModel, MarkerSettingsModel } from '../series/chart-series-model';
import { ErrorBarDirection } from '../utils/enum';
import { Series, Points } from './chart-series';
import { ITextRenderEventArgs } from '../../chart/model/chart-interface';
import { textRender } from '../../common/model/constants';
import {
    createTemplate, getFontStyle, getElement, measureElementRect, templateAnimate, withIn, withInBounds
} from '../../common/utils/helper';
import { createElement, getValue, extend } from '@syncfusion/ej2-base';
import { Alignment, LabelPosition } from '../../common/utils/enum';
import { getPoint, isRotatedRectIntersect } from '../../common/utils/helper';
import { Axis } from '../../chart/axis/axis';
import { PolarRadarPanel } from '../axis/polar-radar-panel';

/**
 * `DataLabel` module is used to render data label for the data point.
 */
export class DataLabel {

    private chart: Chart;
    private margin: MarginModel;
    private isShape: boolean;
    private locationX: number;
    private locationY: number;
    private fontBackground: string;
    private borderWidth: number;
    private markerHeight: number;
    public commonId: string;
    private yAxisInversed: boolean;
    private inverted: boolean;
    private errorHeight: number = 0;
    private chartBackground: string;
    private extraSpace: number;
    /**
     * Constructor for the data label module.
     *
     * @private
     */

    constructor(chart: Chart) {
        this.chart = chart;
    }

    private initPrivateVariables(series: Series, marker: MarkerSettingsModel): void {
        let transform: string = '';
        let clipPath: string = '';
        const render: SvgRenderer | CanvasRenderer = series.chart.renderer;
        const index: number | string = (series.index === undefined) ? series.category : series.index;
        if (series.chart.chartAreaType === 'Cartesian') {
            transform = 'translate(' + series.clipRect.x + ',' + (series.clipRect.y) + ')';
            clipPath = 'url(#' + this.chart.element.id + '_ChartSeriesClipRect_' + index + ')';
        }
        if (marker.dataLabel.visible && !this.chart.enableCanvas) {
            series.shapeElement = render.createGroup({
                'id': this.chart.element.id + 'ShapeGroup' + index,
                'transform': transform,
                'clip-path': 'url(#' + this.chart.element.id + '_ChartSeriesClipRect_' + index + ')'
            });
            series.textElement = render.createGroup({
                'id': this.chart.element.id + 'TextGroup' + index,
                'transform': transform,
                'clip-path': clipPath
            });
            series.textElement.setAttribute('aria-hidden', 'true');
        }
        this.markerHeight = ((series.type === 'Scatter' || marker.visible)) ? (marker.height / 2) : 0;
        this.commonId = this.chart.element.id + '_Series_' + index + '_Point_';
        this.calculateErrorHeight(series, series.marker.dataLabel.position);
        this.chartBackground = this.chart.chartArea.background === 'transparent' ?
            this.chart.background || this.chart.themeStyle.background : this.chart.chartArea.background;
    }

    private calculateErrorHeight(series: Series, position: LabelPosition): void {
        if (!series.errorBar.visible) {
            return null;
        } else if (series.errorBar.visible && this.chart.chartAreaType !== 'PolarRadar') {
            const direction: ErrorBarDirection = series.errorBar.direction;
            const positiveHeight: number = this.chart.errorBarModule.positiveHeight;
            const negativeHeight: number = this.chart.errorBarModule.negativeHeight;
            if (this.isRectSeries(series)) {
                if (position === 'Top' || position === 'Auto') {
                    if (direction === 'Both' || direction === 'Minus') {
                        this.errorHeight = negativeHeight;
                    } else {
                        this.errorHeight = 0;
                    }
                }
                if (position === 'Outer' || position === 'Auto') {
                    if (direction === 'Both' || direction === 'Plus') {
                        this.errorHeight = positiveHeight;
                    } else {
                        this.errorHeight = 0;
                    }
                }
            } else {
                if (position === 'Top' || position === 'Outer' || position === 'Auto') {
                    if ((direction === 'Both' || direction === 'Plus') && (!series.chart.isTransposed)) {
                        this.errorHeight = positiveHeight;
                    } else {
                        this.errorHeight = 0;
                    }
                }
                if (position === 'Bottom' || position === 'Auto') {
                    if (direction === 'Both' || direction === 'Minus') {
                        this.errorHeight = negativeHeight;
                    } else {
                        this.errorHeight = 0;
                    }
                }
            }
        } else {
            this.errorHeight = 0;
        }
    }

    private isRectSeries(series: Series): boolean {
        return series.isRectSeries || series.type === 'RangeArea' || series.type === 'SplineRangeArea' || series.type === 'RangeStepArea';
    }

    /**
     * Render the data label for series.
     *
     * @param {Series} series - The series to render.
     * @param {Chart} chart - The parent chart.
     * @param {DataLabelSettingsModel} dataLabel - The settings for data labels.
     * @returns {void}
     */
    public render(series: Series, chart: Chart, dataLabel: DataLabelSettingsModel): void {
        // initialize the private variable
        this.initPrivateVariables(series, series.marker);
        this.inverted = chart.requireInvertedAxis;
        this.yAxisInversed = series.yAxis.isAxisInverse;
        const templateId: string = chart.element.id + '_Series_' +
            (series.index === undefined ? series.category : series.index) + '_DataLabelCollections';
        const element: HTMLElement = createElement('div', {
            id: templateId
        });
        const visiblePoints: Points[] = getVisiblePoints(series);
        // Data label point iteration started
        if (series.visible) {
            for (let i: number = 0; i < visiblePoints.length; i++) {
                this.renderDataLabel(series, visiblePoints[i as number], element, dataLabel);
            }
        }
        if (element.childElementCount) {
            if (!chart.enableCanvas) {
                appendChildElement(chart.enableCanvas, getElement(chart.element.id + '_Secondary_Element'), element, chart.redraw,
                                   false, 'x', 'y', null, '', false, false, null, chart.duration);
            } else {
                getElement(chart.element.id + '_Secondary_Element').appendChild(element);
            }
        }
    }

    public renderDataLabel(series: Series, point: Points, element: HTMLElement, dataLabel: DataLabelSettingsModel): Element[] {
        if (!dataLabel.showZero && ((point.y === 0) || (point.y === 0 && series.emptyPointSettings.mode === 'Zero'))) {
            return null;
        }
        this.margin = dataLabel.margin;
        let labelText: string[] = [];
        let labelLength: number;
        let xPos: number;
        let yPos: number;
        let xValue: number;
        let yValue: number;
        let degree: number;
        let isRender: boolean = true;
        let rectCenterX: number; let rectCenterY: number;
        let labelLocation: LabelLocation = { x: 0, y: 0 };
        let textSize: Size;
        const clip: Rect = series.clipRect;
        let shapeRect: HTMLElement;
        let isDataLabelOverlap: boolean = false;
        const dataLabelElement: Element[] = [];
        dataLabel.angle = dataLabel.labelIntersectAction === 'Rotate90' ? 90 : dataLabel.angle;
        dataLabel.enableRotation = dataLabel.labelIntersectAction === 'Rotate90' ? true : dataLabel.enableRotation;
        const angle: number = degree = dataLabel.angle;
        const border: BorderModel = { width: dataLabel.border.width, color: dataLabel.border.color };
        const argsFont: FontModel = <FontModel>(extend({}, getValue('properties', dataLabel.font), null, true));
        if (
            (point.symbolLocations.length && point.symbolLocations[0]) ||
            (series.type === 'BoxAndWhisker' && point.regions.length)
        ) {
            labelText = point.text !== null ? getLabelText(point, series, this.chart) : [];
            labelLength = labelText.length;
            for (let i: number = 0; i < labelLength; i++) {
                const argsData: ITextRenderEventArgs = {
                    cancel: false, name: textRender, series: series,
                    point: point, text: labelText[i as number], border: border,
                    color: dataLabel.fill, template: dataLabel.template, font: argsFont, location: labelLocation,
                    textSize: measureText(labelText[i as number], dataLabel.font, this.chart.themeStyle.datalabelFont)
                };
                this.chart.trigger(textRender, argsData);
                if (!argsData.cancel) {
                    this.fontBackground = argsData.color;
                    this.isDataLabelShape(argsData);
                    this.markerHeight = series.type === 'Bubble' ? (point.regions[0].height / 2) : this.markerHeight;
                    if (argsData.template !== null) {
                        this.createDataLabelTemplate(element, series, dataLabel, point, argsData, i, this.chart.redraw);
                    } else {
                        if (dataLabel.enableRotation) {
                            textSize = rotateTextSize(dataLabel.font, argsData.text, dataLabel.angle, this.chart,
                                                      this.chart.themeStyle.datalabelFont);
                        }
                        else {
                            textSize = measureText(argsData.text, dataLabel.font, this.chart.themeStyle.datalabelFont);
                        }
                        const rect: Rect = this.calculateTextPosition(point, series, textSize, dataLabel, i);
                        // To check whether the polar radar chart datalabel intersects the axis label or not
                        if (this.chart.chartAreaType === 'PolarRadar') {
                            for (const rectRegion of (<PolarRadarPanel>this.chart.chartAxisLayoutPanel).visibleAxisLabelRect) {
                                if (isOverlap(new Rect(rect.x, rect.y, rect.width, rect.height), rectRegion)) {
                                    isRender = false;
                                    break;
                                }
                            }
                        }
                        const actualRect: Rect = new Rect(rect.x + clip.x, rect.y + clip.y, rect.width, rect.height);
                        //let notOverlapping: boolean;
                        if (dataLabel.enableRotation) {
                            const rectCoordinates: ChartLocation[] = this.getRectanglePoints(rect);
                            rectCenterX = rect.x + (rect.width / 2);
                            rectCenterY = (rect.y + (rect.height / 2));
                            isDataLabelOverlap = (dataLabel.labelIntersectAction === 'Rotate90' || angle === -90) ? false : this.isDataLabelOverlapWithChartBound(rectCoordinates, this.chart, clip);
                            if (!isDataLabelOverlap) {
                                this.chart.rotatedDataLabelCollections.push(rectCoordinates);
                                const currentPointIndex: number = this.chart.rotatedDataLabelCollections.length - 1;
                                for (let index: number = currentPointIndex; index >= 0; index--) {
                                    if (this.chart.rotatedDataLabelCollections[currentPointIndex as number] &&
                                        this.chart.rotatedDataLabelCollections[index - 1] &&
                                        isRotatedRectIntersect(
                                            this.chart.rotatedDataLabelCollections[currentPointIndex as number],
                                            this.chart.rotatedDataLabelCollections[index - 1])
                                    ) {
                                        isDataLabelOverlap = true;
                                        this.chart.rotatedDataLabelCollections[currentPointIndex as number] = null;
                                        break;
                                    }
                                }
                            }
                        } else {
                            isDataLabelOverlap = isCollide(rect, this.chart.dataLabelCollections, clip);
                        }
                        if ((!isDataLabelOverlap || dataLabel.labelIntersectAction === 'None') && isRender) {
                            this.chart.dataLabelCollections.push(actualRect);
                            if (this.isShape) {
                                shapeRect = this.chart.renderer.drawRectangle(
                                    new RectOption(
                                        this.commonId + point.index + '_TextShape_' + i,
                                        argsData.color, argsData.border, dataLabel.opacity, rect, dataLabel.rx,
                                        dataLabel.ry, '', dataLabel.border.dashArray
                                    ),
                                    new Int32Array([clip.x, clip.y])) as HTMLElement;
                                if (series.shapeElement) {
                                    series.shapeElement.appendChild(shapeRect);
                                }
                            }
                            // Checking the font color
                            const backgroundColor: string = this.fontBackground === 'transparent' ? ((this.chart.theme.indexOf('Dark') > -1 || this.chart.theme.indexOf('HighContrast') > -1) ? 'black' : 'white') : this.fontBackground;
                            const rgbValue: ColorValue = convertHexToColor(colorNameToHex(backgroundColor));
                            const contrast: number = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
                            xPos = (rect.x + this.margin.left + textSize.width / 2) + labelLocation.x;
                            yPos = dataLabel.enableRotation && this.chart.chartAreaType !== 'PolarRadar' ? (rect.y + this.margin.top + textSize.height / 2 + textSize.width / 4 + (dataLabel.position === 'Auto' ? point.regions[0].width / 10 : 0)) + labelLocation.y : (rect.y + this.margin.top + textSize.height * 3 / 4) + labelLocation.y;
                            labelLocation = { x: 0, y: 0 };
                            if (angle !== 0 && dataLabel.enableRotation) {
                                // xValue = xPos - (dataLabel.margin.left) / 2 + (dataLabel.margin.right / 2);
                                xValue = rectCenterX;
                                //yValue = yPos - (dataLabel.margin.top) / 2 - (textSize.height / dataLabel.margin.top) +
                                // (dataLabel.margin.bottom) / 2;
                                yValue = rectCenterY;
                                degree = (angle > 360) ? angle - 360 : (angle < -360) ? angle + 360 : angle;
                            } else {
                                degree = 0;
                                xValue = rect.x;
                                yValue = rect.y;
                                xPos -= this.chart.chartAreaType === 'Cartesian' && xPos + (textSize.width / 2) > clip.width ? (xPos + textSize.width / 2) - clip.width : 0;
                                yPos -= (yPos + textSize.height > clip.y + clip.height && !(series.type.indexOf('Bar') > -1)) ? (yPos + textSize.height) - (clip.y + clip.height) : 0;
                            }
                            const textAnchor: string = dataLabel.labelIntersectAction === 'Rotate90' ? (dataLabel.position === 'Top' ? 'start' : (dataLabel.position === 'Middle' ? 'middle' : 'end')) :
                                ((angle === -90 && dataLabel.enableRotation) ? (dataLabel.position === 'Top' ? 'end' : (dataLabel.position === 'Middle' ? 'middle' : 'start')) : 'middle');
                            dataLabelElement.push(textElement(
                                this.chart.renderer,
                                new TextOption(
                                    this.commonId + ((series.removedPointIndex !== null && series.removedPointIndex <= point.index) ? (point.index + 1) : point.index) + '_Text_' + i,
                                    xPos, yPos,
                                    textAnchor, argsData.text, 'rotate(' + degree + ',' + (xValue) + ',' + (yValue) + ')', 'auto', degree
                                ),
                                argsData.font, argsData.font.color ||
                            ((contrast >= 128 || series.type === 'Hilo' || series.type === 'HiloOpenClose') ? 'black' : 'white'),
                                series.textElement, false, this.chart.redraw, true, false, series.chart.duration, series.clipRect, null,
                                null, this.chart.enableCanvas, null, this.chart.themeStyle.datalabelFont, new ChartLocation(xValue, yValue)
                            ));
                            if (series.removedPointIndex !== null && series.removedPointIndex <= point.index) {
                                (series.textElement.lastChild as HTMLElement).id = this.commonId + point.index + '_Text_' + i;
                            }
                        }
                    }
                }
            }
        }
        return dataLabelElement;
    }

    /**
     * Retrieves the points of a rectangle.
     *
     * @param {Rect} rect - The rectangle whose points are to be retrieved.
     * @returns {ChartLocation[]} - The points of the rectangle.
     */
    private getRectanglePoints(rect: Rect): ChartLocation[] {
        const loc1: ChartLocation = new ChartLocation(rect.x, rect.y);
        const loc2: ChartLocation = new ChartLocation(rect.x + rect.width, rect.y);
        const loc3: ChartLocation = new ChartLocation(rect.x + rect.width, rect.y + rect.height);
        const loc4: ChartLocation = new ChartLocation(rect.x, rect.y + rect.height);
        return [loc1, loc2, loc3, loc4];
    }

    private isDataLabelOverlapWithChartBound(rectCoordinates: ChartLocation[], chart: Chart, clip: Rect): boolean {
        for (let index: number = 0; index < rectCoordinates.length; index++) {
            if (!withInBounds(rectCoordinates[index as number].x + clip.x,
                              rectCoordinates[index as number].y + clip.y, chart.initialClipRect)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Creates a template for data labels.
     *
     * @param {HTMLElement} parentElement - The parent element to which the template will be appended.
     * @param {Series} series - The series associated with the data label.
     * @param {DataLabelSettingsModel} dataLabel - The settings for the data label.
     * @param {Points} point - The data point to which the data label is associated.
     * @param {ITextRenderEventArgs} data - The event data associated with rendering the data label.
     * @param {number} labelIndex - The index of the data label.
     * @param {boolean} redraw - Specifies whether to redraw the template.
     * @returns {void}
     */
    private createDataLabelTemplate(
        parentElement: HTMLElement, series: Series,
        dataLabel: DataLabelSettingsModel, point: Points, data: ITextRenderEventArgs, labelIndex: number,
        redraw: boolean
    ): void {
        this.margin = { left: 0, right: 0, bottom: 0, top: 0 };
        const clip: Rect = series.clipRect;
        const childElement: HTMLElement = createTemplate(
            createElement('div', {
                id: this.chart.element.id + '_Series_' + (series.index === undefined ? series.category : series.index) + '_DataLabel_'
                    + point.index + (labelIndex ? ('_' + labelIndex) : ''),
                styles: 'position: absolute;background-color:' + data.color + ';' +
                    getFontStyle(dataLabel.font, this.chart.themeStyle.datalabelFont) + ';border:' + data.border.width + 'px solid ' + data.border.color + ';'
            }),
            point.index, data.template, this.chart, point, series, this.chart.element.id + '_DataLabel', labelIndex);
        this.calculateTemplateLabelSize(parentElement, childElement, point, series, dataLabel, labelIndex, clip, redraw);
    }
    public calculateTemplateLabelSize(
        parentElement: HTMLElement, childElement: HTMLElement, point: Points, series: Series, dataLabel: DataLabelSettingsModel,
        labelIndex: number, clip: Rect, redraw: boolean, isReactCallback?: boolean
    ): void {
        const elementRect: ClientRect = measureElementRect(childElement, redraw, isReactCallback);
        const rect: Rect = this.calculateTextPosition(
            point, series, { width: elementRect.width, height: elementRect.height },
            dataLabel, labelIndex
        );
        const clipWidth: number = 0;
        const clipHeight: number = 0;
        let isOverlap: boolean = false;
        if (isReactCallback) {
            isOverlap = (elementRect.width === 0 || elementRect.height === 0); // To check the data label already overlap before react callback call
            // clipWidth = ((series.clipRect.x + rect.x) + elementRect.width) > parentElement.clientWidth ?
            //     (parentElement.clientWidth - (series.clipRect.x + rect.x)) : 0;
            // clipHeight = (series.points.length - 1 === point.index) ? elementRect.height / 2 : 0;
        }
        childElement.style.left = ((this.chart.chartAreaType === 'PolarRadar' ? 0 : series.clipRect.x) + rect.x - clipWidth) + 'px';
        childElement.style.top = ((this.chart.chartAreaType === 'PolarRadar' ? 0 : series.clipRect.y) + rect.y + clipHeight) + 'px';
        const backgroundColor: string = this.fontBackground === 'transparent' ? (this.chart.theme.indexOf('Dark') > -1 ? 'black' : 'white') : this.fontBackground;
        const rgbValue: ColorValue = convertHexToColor(colorNameToHex(backgroundColor));
        const vAxis: Axis = series.chart.requireInvertedAxis ? series.xAxis : series.yAxis;
        const hAxis: Axis = series.chart.requireInvertedAxis ? series.yAxis : series.xAxis;
        childElement.style.color = dataLabel.font.color ||
            ((Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000)) >= 128 ? 'black' : 'white');
        if (childElement.childElementCount && !isOverlap && (!isCollide(rect, this.chart.dataLabelCollections, clip) ||
            dataLabel.labelIntersectAction === 'None') && (series.seriesType !== 'XY' || point.yValue === undefined ||
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
            appendChildElement(this.chart.enableCanvas, parentElement, childElement, redraw, true, 'left', 'top');
            if (series.animation.enable && this.chart.animateSeries && !this.chart.enableCanvas) {
                this.doDataLabelAnimation(series, childElement);
            } else if (this.chart.enableCanvas) {
                parentElement.appendChild(childElement);
            }
        }
    }
    private calculateTextPosition(
        point: Points, series: Series, textSize: Size,
        dataLabel: DataLabelSettingsModel, labelIndex: number
    ): Rect {
        let labelRegion: Rect = labelIndex > 1 ? (series.type === 'Candle') ? point.regions[1] : point.regions[0] : point.regions[0];
        if (labelIndex > 1 && series.type === 'HiloOpenClose') {
            labelRegion = (labelIndex === 2) ? point.regions[1] : point.regions[2];
        }
        let location: ChartLocation;
        location = this.getLabelLocation(point, series, textSize, labelIndex);
        const padding: number = 5;
        const clipRect: Rect = series.clipRect;
        // calculating alignment
        if (!this.chart.requireInvertedAxis || !this.isRectSeries(series) || series.type === 'BoxAndWhisker') {
            this.locationX = location.x;
            const alignmentValue: number = textSize.height + (this.borderWidth * 2) + this.markerHeight +
                this.margin.bottom + this.margin.top + padding;
            location.x = (dataLabel.position === 'Auto') ? location.x :
                this.calculateAlignment(
                    alignmentValue, location.x, dataLabel.alignment,
                    this.isRectSeries(series) ? point.yValue < 0 : false
                );
            // calculating position
            location.y = (!this.isRectSeries(series) || series.type === 'BoxAndWhisker') ?
                this.calculatePathPosition(
                    location.y, dataLabel.position, series, point, textSize, labelIndex
                ) :
                this.calculateRectPosition(
                    location.y, labelRegion, point.yValue < 0 !== this.yAxisInversed,
                    dataLabel.position, series, textSize, labelIndex, point
                );
            if (this.isRectSeries(series) && this.chart.chartAreaType === 'PolarRadar') {
                location = this.calculatePolarRectPosition(
                    location, dataLabel.position, series, point, textSize, labelIndex, dataLabel.alignment, alignmentValue);
            }
        } else {
            this.locationY = location.y;
            const alignmentValue: number = textSize.width + this.borderWidth + this.margin.left + this.margin.right - padding;
            location.x = dataLabel.position === 'Auto' ? location.x :
                this.calculateAlignment(alignmentValue, location.x, dataLabel.alignment, point.yValue < 0);
            location.x = this.calculateRectPosition(
                location.x, labelRegion, point.yValue < 0 !== this.yAxisInversed,
                dataLabel.position, series, textSize, labelIndex, point
            );
        }
        const rect: Rect = calculateRect(location, textSize, this.margin);
        // Checking the condition whether data Label has been exist the clip rect
        if (!(dataLabel.enableRotation === true && dataLabel.angle !== 0) &&
            !((rect.y > (clipRect.y + clipRect.height)) || (rect.x > (clipRect.x + clipRect.width)) ||
                (rect.x + rect.width < 0) || (rect.y + rect.height < 0))) {
            rect.x = rect.x < 0 ? padding : rect.x;
            rect.y = (rect.y < 0) && !(dataLabel.labelIntersectAction === 'None') ? padding : rect.y;
            rect.x -= (rect.x + rect.width) > (clipRect.x + clipRect.width) ? (rect.x + rect.width)
                - (clipRect.x + clipRect.width) + padding : 0;
            rect.y -= (rect.y + rect.height) > (clipRect.y + clipRect.height) ? (rect.y + rect.height)
                - (clipRect.y + clipRect.height) + padding : 0;
            this.fontBackground = this.fontBackground === 'transparent' ? this.chartBackground : this.fontBackground;
        }

        let dataLabelOutRegion: boolean;
        if (this.inverted && series.isRectSeries && (rect.x + rect.width > labelRegion.x + labelRegion.width)) {
            dataLabelOutRegion = true;
        }
        this.fontBackground = dataLabelOutRegion ? this.chartBackground : this.fontBackground;

        return rect;
    }

    // Calculation label location for polar column draw types
    private calculatePolarRectPosition(
        location: ChartLocation, position: LabelPosition, series: Series,
        point: Points, size: Size, labelIndex: number, alignment: Alignment, alignmentValue: number
    ): ChartLocation {
        const padding: number = 5;
        let columnRadius: number;
        const chartWidth: number = this.chart.availableSize.width;
        const alignmentSign: number = (alignment === 'Center') ? 0 : (alignment === 'Far' ? 1 : -1);
        const angle: number = (point.regionData.startAngle - 0.5 * Math.PI) + (point.regionData.endAngle - point.regionData.startAngle) / 2;
        if (labelIndex === 0) {
            columnRadius = point.regionData.radius < point.regionData.innerRadius ? point.regionData.innerRadius
                : point.regionData.radius;
        } else {
            columnRadius = point.regionData.radius > point.regionData.innerRadius ? point.regionData.innerRadius
                : point.regionData.radius;
        }
        this.fontBackground = this.fontBackground === 'transparent' ? this.chartBackground : this.fontBackground;
        if (series.drawType.indexOf('Stacking') > -1) {
            position = position === 'Outer' ? 'Top' : position;
        } else if (series.drawType.indexOf('Range') > -1) {
            position = (position === 'Outer' || position === 'Top') ? position : 'Auto';
        }
        if (position === 'Outer') {
            columnRadius = labelIndex === 0 ? columnRadius + 2 * padding + this.markerHeight :
                columnRadius - 2 * padding - this.markerHeight;
        } else if (position === 'Middle') {
            columnRadius = columnRadius / 2 + padding;
            if (series.drawType === 'StackingColumn') {
                columnRadius = point.regionData.innerRadius + ((point.regionData.radius - point.regionData.innerRadius) / 2)
                    + padding - (size.height / 2);
            }
        } else if (position === 'Top') {
            columnRadius = labelIndex === 0 ? columnRadius - 2 * padding - this.markerHeight :
                columnRadius + 2 * padding + this.markerHeight;
        } else if (position === 'Bottom') {
            columnRadius = 2 * padding;
            columnRadius += (series.drawType === 'StackingColumn') ? (point.regionData.innerRadius + this.markerHeight) : 0;
        } else {
            if (labelIndex === 0) {
                columnRadius = columnRadius >= series.chart.radius ? columnRadius - padding :
                    series.drawType === 'StackingColumn' ? columnRadius - 2 * padding : columnRadius + 2 * padding;
            } else {
                columnRadius = columnRadius >= series.chart.radius ? columnRadius + padding : columnRadius - 2 * padding;
            }
        }
        columnRadius += (alignmentValue * alignmentSign);
        location.x = series.clipRect.width / 2 + series.clipRect.x + columnRadius * Math.cos(angle);
        // To change x location based on text anchor for column and stackingcolumn chart
        if (series.drawType === 'StackingColumn') {
            location.x = location.x < chartWidth / 2 ? location.x + size.width / 2 :
                (location.x > chartWidth / 2 ? location.x - size.width / 2 : location.x);
        } else if (series.drawType === 'Column') {
            location.x = location.x < chartWidth / 2 ? location.x - size.width / 2 :
                (location.x > chartWidth / 2 ? location.x + size.width / 2 : location.x);
        }
        location.y = series.clipRect.height / 2 + series.clipRect.y + columnRadius * Math.sin(angle);
        return location;
    }


    /**
     * Gets the location for the data label.
     *
     * @param {Points} point - The data point associated with the label.
     * @param {Series} series - The series associated with the data label.
     * @param {Size} textSize - The size of the text to be displayed in the data label.
     * @param {number} labelIndex - The index of the data label.
     * @returns {ChartLocation} - The location for the data label.
     */
    private getLabelLocation(point: Points, series: Series, textSize: Size, labelIndex: number): ChartLocation {
        let location: ChartLocation = new ChartLocation(0, 0);
        let labelRegion: Rect = (series.type === 'Candle' && labelIndex > 1) ? point.regions[1] : point.regions[0];
        if (series.type === 'HiloOpenClose') {
            labelRegion = (labelIndex === 2) ? point.regions[1] : point.regions[2];
        }
        const xAxis: Axis = series.xAxis;
        const yAxis: Axis = series.yAxis;
        const isInverted: boolean = series.chart.requireInvertedAxis;
        if (series.type === 'BoxAndWhisker') {
            this.markerHeight = 0;
            switch (labelIndex) {
            case 0: location = getPoint(point.xValue, point.median, xAxis, yAxis, isInverted); break;
            case 1: location = getPoint(point.xValue, point.maximum, xAxis, yAxis, isInverted); break;
            case 2: location = getPoint(point.xValue, point.minimum, xAxis, yAxis, isInverted); break;
            case 3: location = getPoint(point.xValue, point.upperQuartile, xAxis, yAxis, isInverted); break;
            case 4: location = getPoint(point.xValue, point.lowerQuartile, xAxis, yAxis, isInverted); break;
            default: {
                location = getPoint(point.xValue, point.outliers[labelIndex - 5], xAxis, yAxis, isInverted);
                this.markerHeight = series.marker.height / 2;
                break;
            }
            }
            if (isInverted) {
                location.y = point.regions[0].y + (point.regions[0].height / 2);
            } else {
                location.x = point.regions[0].x + (point.regions[0].width / 2);
            }
        } else if (labelIndex === 0 || labelIndex === 1) {
            location = new ChartLocation(point.symbolLocations[0].x, point.symbolLocations[0].y);
        } else if ((labelIndex === 2 || labelIndex === 3) && series.type === 'Candle') {
            location = new ChartLocation(point.symbolLocations[1].x, point.symbolLocations[1].y);
        } else if (isInverted) {
            location = { x: labelRegion.x + (labelRegion.width) / 2, y: labelRegion.y };
        } else {
            location = { x: labelRegion.x + labelRegion.width, y: labelRegion.y + (labelRegion.height) / 2 };
        }

        //Aligning the label at the beginning of the tick, when tick size is less than text size
        if (labelIndex > 1 && series.type === 'HiloOpenClose') {
            if (series.chart.requireInvertedAxis) {
                const height: number = labelRegion.height;
                location.y = labelRegion.y + height / 2 + 2 * (labelIndex === 2 ? 1 : -1);
            } else {
                const width: number = labelRegion.width;
                location.x = labelRegion.x + width / 2 + 2 * (labelIndex === 2 ? 1 : -1);
            }
        }
        return location;
    }

    private calculateRectPosition(
        labelLocation: number, rect: Rect, isMinus: boolean,
        position: LabelPosition, series: Series, textSize: Size, labelIndex: number, point: Points
    ): number {
        if (series.chart.chartAreaType === 'PolarRadar') {
            return null;
        }
        const padding: number = 5;
        const margin: MarginModel = this.margin;
        const textLength: number = (series.marker.dataLabel.enableRotation ? textSize.width :
            (!this.inverted ? textSize.height : textSize.width));
        this.extraSpace = this.borderWidth + textLength / 2 + (position !== 'Outer' && series.type.indexOf('Column') > -1 &&
            (Math.abs(rect.height - textSize.height) < padding) ? 0 : padding);
        if (series.type === 'StackingColumn100' || series.type === 'StackingBar100') {
            position = (position === 'Outer') ? 'Top' : position;
        } else if (series.type.indexOf('Range') > -1) {
            position = (position === 'Outer' || position === 'Top') ? position : 'Auto';
        } else if (series.type === 'Waterfall') {
            position = position === 'Auto' ? 'Middle' : position;
        }

        switch (position) {
        case 'Bottom':
            labelLocation = !this.inverted ?
                isMinus ? (labelLocation + (series.type === 'Waterfall' ? (- this.extraSpace - margin.top - this.markerHeight) : (-rect.height + this.extraSpace + margin.top))) :
                    (labelLocation + rect.height - this.extraSpace - margin.bottom) :
                isMinus ? (labelLocation + (series.type === 'Waterfall' ? (+ this.extraSpace + margin.left + this.markerHeight) : (+ rect.width - this.extraSpace - margin.left))) :
                    (labelLocation - rect.width + this.extraSpace + margin.right);
            break;
        case 'Middle':
            labelLocation = labelLocation = !this.inverted ?
                (isMinus ? labelLocation - (rect.height / 2) : labelLocation + (rect.height / 2)) :
                (isMinus ? labelLocation + (rect.width / 2) : labelLocation - (rect.width / 2));
            break;
        case 'Auto':
            labelLocation = this.calculateRectActualPosition(labelLocation, rect, isMinus, series, textSize, labelIndex, point);
            break;
        default:
            this.extraSpace += this.errorHeight;
            labelLocation = this.calculateTopAndOuterPosition(labelLocation, rect, position, series, labelIndex, this.extraSpace, isMinus, point);

            break;
        }
        const check: boolean = !this.inverted ? (labelLocation < rect.y || labelLocation > rect.y + rect.height) :
            (labelLocation < rect.x || labelLocation > rect.x + rect.width);
        this.fontBackground = check ?
            (this.fontBackground === 'transparent' ? this.chartBackground : this.fontBackground)
            : this.fontBackground === 'transparent' ? (point.color || series.interior) : this.fontBackground;
        const seriesLength: number = series.chart.series.length;
        if (position === 'Outer' && (series.type.indexOf('Stacking') > -1) && ((seriesLength - 1) > series.index)) {
            let nextSeries: Series;
            let nextSeriesPoint: Points;
            for (let i: number = series.index + 1; i < seriesLength; i++) {
                nextSeries = series.chart.series[i as number] as Series;
                nextSeriesPoint = <Points>nextSeries.points[point.index];
                if ((nextSeries.type.indexOf('Stacking') > -1) && (nextSeries.type.indexOf('100') === -1)) {
                    this.fontBackground = (nextSeriesPoint && ((nextSeriesPoint.yValue < 0 && point.yValue < 0) ||
                        (nextSeriesPoint.yValue > 0 && point.yValue > 0))) ? (nextSeriesPoint ? nextSeriesPoint.color :
                            nextSeries.interior) : this.fontBackground;
                    break;
                }
            }
        }
        return labelLocation;
    }

    private calculatePathPosition(
        labelLocation: number, position: LabelPosition, series: Series,
        point: Points, size: Size, labelIndex: number
    ): number {
        const padding: number = 5;
        if ((series.type.indexOf('Area') > -1 && series.type !== 'RangeArea' && series.type !== 'SplineRangeArea' && series.type !== 'RangeStepArea')
            && this.yAxisInversed && series.marker.dataLabel.position !== 'Auto') {
            position = position === 'Top' ? 'Bottom' : position === 'Bottom' ? 'Top' : position;
        }
        this.fontBackground = this.fontBackground === 'transparent' ? this.chartBackground : this.fontBackground;
        switch (position) {
        case 'Top':
        case 'Outer':
            labelLocation = labelLocation - this.markerHeight - this.borderWidth - size.height / 2 - this.margin.bottom - padding -
                    this.errorHeight;
            break;
        case 'Bottom':
            labelLocation = labelLocation + this.markerHeight + this.borderWidth + size.height / 2 + this.margin.top + padding +
                    this.errorHeight;
            break;
        case 'Auto':
            labelLocation = this.calculatePathActualPosition(
                labelLocation, this.markerHeight, series, point, size, labelIndex
            );
            break;
        }
        return labelLocation;
    }

    private isDataLabelShape(style: ITextRenderEventArgs): void {
        this.isShape = (style.color !== 'transparent' || style.border.width > 0);
        this.borderWidth = style.border.width;
        if (!this.isShape) {
            this.margin = { left: 0, right: 0, bottom: 0, top: 0 };
        }
    }

    private calculateRectActualPosition(
        labelLocation: number, rect: Rect, isMinus: boolean,
        series: Series, size: Size, labelIndex: number, point: Points
    ): number {
        let location: number;
        let labelRect: Rect;
        let isOverLap: boolean = true;
        let position: number = 0;
        const collection: Rect[] = this.chart.dataLabelCollections;
        const finalPosition: number = series.type.indexOf('Range') !== -1 || series.type === 'Hilo' ? 2 : 4;
        while (isOverLap && position < finalPosition) {
            let actualPosition: LabelPosition = this.getPosition(position);
            if (series.type.indexOf('Stacking') > -1 && actualPosition === 'Outer') {
                actualPosition = 'Top';
                position++;
            }
            location = this.calculateRectPosition(
                labelLocation, rect, isMinus, actualPosition,
                series, size, labelIndex, point);
            if (!this.inverted) {
                if (series.marker.dataLabel.enableRotation) {
                    size.width = size.width - point.regions[0].width / 10;
                }
                labelRect = calculateRect(new ChartLocation(this.locationX, location), size, this.margin);
                isOverLap = labelRect.y < 0 || isCollide(labelRect, collection, series.clipRect) || labelRect.y > series.clipRect.height;
                if (series.marker.dataLabel.template === null && isOverLap !== true) {
                    isOverLap = labelRect.y / 2 + size.height + (actualPosition === 'Outer' ? point.regions[0].height + this.extraSpace : point.regions[0].height - 2 * this.extraSpace) > series.clipRect.height;
                }
            } else {
                labelRect = calculateRect(new ChartLocation(location, this.locationY), size, this.margin);
                isOverLap = labelRect.x < 0 || isCollide(labelRect, collection, series.clipRect) ||
                    labelRect.x + labelRect.width > series.clipRect.width;
            }
            position++;
        }
        return location;
    }

    // alignment calculation assigned here
    private calculateAlignment(value: number, labelLocation: number, alignment: Alignment, isMinus: boolean): number {
        switch (alignment) {
        case 'Far': labelLocation = !this.inverted ? (isMinus ? labelLocation + value : labelLocation - value) :
            (isMinus ? labelLocation - value : labelLocation + value); break;
        case 'Near': labelLocation = !this.inverted ? (isMinus ? labelLocation - value : labelLocation + value) :
            (isMinus ? labelLocation + value : labelLocation - value); break;
        }
        return labelLocation;
    }
    //calculation for top and outer position of datalabel for rect series
    private calculateTopAndOuterPosition(
        location: number, rect: Rect, position: LabelPosition, series: Series, index: number,
        extraSpace: number, isMinus: boolean, point: Points
    ): number {
        const margin: MarginModel = this.margin;
        let top: boolean;
        switch (series.type) {
        case 'RangeColumn':
        case 'RangeArea':
        case 'RangeStepArea':
        case 'SplineRangeArea':
        case 'Hilo':
            top = (index === 0 && !this.yAxisInversed) || (index === 1 && this.yAxisInversed);
            location = this.updateLabelLocation(position, location, extraSpace, margin, rect, top);
            break;
        case 'Candle':
            top = (index === 0 || index === 2) && !this.yAxisInversed
                    || (index === 1 || index === 3) && this.yAxisInversed;

            location = this.updateLabelLocation(position, location, extraSpace, margin, rect, top, index > 1);
            break;
        case 'HiloOpenClose':
            if (index <= 1) {
                top = (index === 0 && !this.yAxisInversed) || (index === 1 && this.yAxisInversed);
                location = this.updateLabelLocation(position, location, extraSpace, margin, rect, top);
            } else {
                if (this.yAxisInversed) {
                    location = !this.inverted ? location + extraSpace + margin.top : location - extraSpace - margin.right;
                } else {
                    location = !this.inverted ? location - extraSpace - margin.bottom : location + extraSpace + margin.left;
                }
            }
            break;
        default:
            if (((isMinus && position === 'Top') || (!isMinus && position === 'Outer')) || (position === 'Top' && series.visiblePoints[point.index].yValue === 0)) {
                location = !this.inverted ? location + (isMinus && series.type === 'Waterfall' ? (-rect.height + extraSpace + margin.bottom) : (-extraSpace - margin.bottom - this.markerHeight)) :
                    location + (isMinus && series.type === 'Waterfall' ?  (+ rect.width - extraSpace - margin.left) : (+ extraSpace + margin.left + this.markerHeight));
            } else {
                location = !this.inverted ? location + (isMinus && series.type === 'Waterfall' ? (-rect.height - extraSpace - margin.top) : (+ extraSpace + margin.top + this.markerHeight)) :
                    location + (isMinus && series.type === 'Waterfall' ? (+rect.width + extraSpace + margin.top) : (- extraSpace - margin.right - this.markerHeight));
            }
            break;
        }
        return location;
    }

    /**
     * Updates the location of the data label.
     *
     * @param {LabelPosition} position - The position of the data label.
     * @param {number} location - The initial location of the data label.
     * @param {number} extraSpace - Extra space to adjust the label position.
     * @param {MarginModel} margin - The margin for the chart.
     * @param {Rect} rect - The rectangle associated with the data label.
     * @param {boolean} top - Indicates whether the label is positioned at the top.
     * @param {boolean} inside - Indicates whether the label is inside the chart area.
     * @returns {number} The updated location of the data label.
     */
    private updateLabelLocation(
        position: LabelPosition, location: number, extraSpace: number,
        margin: MarginModel, rect: Rect, top: boolean, inside: boolean = false
    ): number {
        if (!this.inverted) {
            if (top) {
                location = (position === 'Outer' && !inside) ? location - extraSpace - margin.bottom - this.markerHeight :
                    location + extraSpace + margin.top + this.markerHeight;
            } else {
                location = (position === 'Outer' && !inside) ? location + rect.height + extraSpace + margin.top + this.markerHeight :
                    location + rect.height - extraSpace - margin.bottom - this.markerHeight;
            }
        } else {
            if (top) {
                location = (position === 'Outer' && !inside) ? location + extraSpace + margin.left + this.markerHeight :
                    location - extraSpace - margin.right - this.markerHeight;
            } else {
                location = (position === 'Outer' && !inside) ? location - rect.width - extraSpace - margin.right - this.markerHeight :
                    location - rect.width + extraSpace + margin.left + this.markerHeight;
            }
        }
        return location;
    }

    private calculatePathActualPosition(
        y: number, markerSize: number, series: Series,
        point: Points, size: Size, labelIndex: number
    ): number {
        const points: Points[] = series.points;
        const index: number = point.index;
        const yValue: number = points[index as number].yValue;
        let position: LabelPosition;
        const nextPoint: Points = points.length - 1 > index ? points[index + 1] : null;
        const previousPoint: Points = index > 0 ? points[index - 1] : null;
        let yLocation: number;
        let isOverLap: boolean = true;
        let labelRect: Rect;
        let isBottom: boolean;
        let positionIndex: number;
        const collection: Rect[] = this.chart.dataLabelCollections;
        if (series.type === 'Bubble') {
            position = 'Top';
        } else if (series.type.indexOf('Step') > -1) {
            position = 'Top';
            if (index) {
                position = (!previousPoint || !previousPoint.visible || (yValue > previousPoint.yValue !== this.yAxisInversed)
                    || yValue === previousPoint.yValue) ? 'Top' : 'Bottom';
            }
        } else if (series.type === 'BoxAndWhisker') {
            if (labelIndex === 1 || labelIndex === 3 || labelIndex > 4) {
                position = series.yAxis.isAxisInverse ? 'Bottom' : 'Top';
            } else if (labelIndex === 2 || labelIndex === 4) {
                position = series.yAxis.isAxisInverse ? 'Top' : 'Bottom';
            } else {
                isOverLap = false;
                position = 'Middle';
                yLocation = this.calculatePathPosition(y, position, series, point, size, labelIndex);
            }
        } else {
            if (index === 0) {
                position = (!nextPoint || !nextPoint.visible || yValue > nextPoint.yValue ||
                    (yValue < nextPoint.yValue && this.yAxisInversed)) ? 'Top' : 'Bottom';
            } else if (index === points.length - 1) {
                position = (!previousPoint || !previousPoint.visible || yValue > previousPoint.yValue ||
                    (yValue < previousPoint.yValue && this.yAxisInversed)) ? 'Top' : 'Bottom';
            } else {
                if (!nextPoint.visible && !(previousPoint && previousPoint.visible)) {
                    position = 'Top';
                } else if (!nextPoint.visible || !previousPoint) {
                    position = (nextPoint.yValue > yValue || (previousPoint && previousPoint.yValue > yValue)) ?
                        'Bottom' : 'Top';
                } else {
                    const slope: number = (nextPoint.yValue - previousPoint.yValue) / 2;
                    const intersectY: number = (slope * index) + (nextPoint.yValue - (slope * (index + 1)));
                    position = !this.yAxisInversed ? intersectY < yValue ? 'Top' : 'Bottom' :
                        intersectY < yValue ? 'Bottom' : 'Top';
                }
            }
        }
        isBottom = position === 'Bottom';
        positionIndex = ['Outer', 'Top', 'Bottom', 'Middle', 'Auto'].indexOf(position);
        while (isOverLap && positionIndex < 4) {
            yLocation = this.calculatePathPosition(y, this.getPosition(positionIndex), series, point, size, labelIndex);
            labelRect = calculateRect(new ChartLocation(this.locationX, yLocation), size, this.margin);
            isOverLap = labelRect.y < 0 || isCollide(labelRect, collection, series.clipRect)
                || (labelRect.y + labelRect.height) > series.clipRect.height;
            positionIndex = isBottom ? positionIndex - 1 : positionIndex + 1;
            isBottom = false;
        }
        return yLocation;
    }
    /**
     * Initiates the animation for data labels.
     *
     * @param {Series} series - The series associated with the data labels.
     * @param {Element} [element] - The element to animate.
     * @returns {void}
     */
    public doDataLabelAnimation(series: Series, element?: Element): void {
        const shapeElements: NodeList = series.shapeElement.childNodes;
        const textNode: NodeList = series.textElement.childNodes;
        const delay: number = series.animation.delay + series.animation.duration;
        const duration: number = series.chart.animated ? series.chart.duration : 200;
        let location: ChartLocation;
        const length: number = element ? 1 : textNode.length;
        let tempElement: HTMLElement;
        for (let i: number = 0; i < length; i++) {
            tempElement = textNode[i as number] as HTMLElement;
            if (element) {
                (<HTMLElement>element).style.visibility = 'hidden';
                templateAnimate(element, delay, duration, 'ZoomIn');
            } else {
                location = new ChartLocation(
                    (+tempElement.getAttribute('x')) + ((+tempElement.getAttribute('width')) / 2),
                    (+tempElement.getAttribute('y')) + ((+tempElement.getAttribute('height')) / 2));
                markerAnimate(tempElement, delay, duration, series, null, location, true);
                if (shapeElements[i as number]) {
                    tempElement = shapeElements[i as number] as HTMLElement;
                    location = new ChartLocation(
                        (+tempElement.getAttribute('x')) + ((+tempElement.getAttribute('width')) / 2),
                        (+tempElement.getAttribute('y')) + ((+tempElement.getAttribute('height')) / 2));
                    markerAnimate(tempElement, delay, duration, series, null, location, true);
                }
            }
        }
    }

    private getPosition(index: number): LabelPosition {
        return <LabelPosition>(['Outer', 'Top', 'Bottom', 'Middle', 'Auto'][index as number]);
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        // Returns the module name
        return 'DataLabel';
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
