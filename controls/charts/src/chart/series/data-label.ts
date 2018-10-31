import { ChartLocation, Size, Rect, TextOption, ColorValue, RectOption, isCollide } from '../../common/utils/helper';
import { markerAnimate, appendChildElement } from '../../common/utils/helper';
import { getLabelText, measureText, convertHexToColor, calculateRect, textElement, colorNameToHex } from '../../common/utils/helper';
import { Chart } from '../chart';
import { BorderModel, MarginModel, FontModel } from '../../common/model/base-model';
import { DataLabelSettingsModel, MarkerSettingsModel } from '../series/chart-series-model';
import { LabelPosition, ErrorBarDirection } from '../utils/enum';
import { SvgRenderer } from '@syncfusion/ej2-base';
import { Series, Points } from './chart-series';
import { ITextRenderEventArgs } from '../../common/model/interface';
import { textRender } from '../../common/model/constants';
import {
    createTemplate, getFontStyle, getElement, measureElementRect, templateAnimate, withIn
} from '../../common/utils/helper';
import { createElement, getValue, extend } from '@syncfusion/ej2-base';
import { Alignment } from '../../common/utils/enum';
import { getPoint } from '../../common/utils/helper';
import { Axis } from '../../chart/axis/axis';

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
    private commonId: string;
    private yAxisInversed: boolean;
    private inverted: boolean;
    private errorHeight: number = 0;
    private chartBackground: string;

    /**
     * Constructor for the data label module.
     * @private
     */

    constructor(chart: Chart) {
        this.chart = chart;
    }

    private initPrivateVariables(series: Series, marker: MarkerSettingsModel): void {
        let transform: string;
        let render: SvgRenderer = series.chart.renderer;
        let index: number | string = (series.index === undefined) ? series.category : series.index;
        transform = series.chart.chartAreaType === 'Cartesian' ? 'translate(' + series.clipRect.x + ',' + (series.clipRect.y) + ')' : '';
        if (marker.dataLabel.visible) {
            series.shapeElement = render.createGroup({
                'id': this.chart.element.id + 'ShapeGroup' + index,
                'transform': transform,
                'clip-path': 'url(#' + this.chart.element.id + '_ChartSeriesClipRect_' + index + ')'
            });
            series.textElement = render.createGroup({
                'id': this.chart.element.id + 'TextGroup' + index,
                'transform': transform,
                'clip-path': 'url(#' + this.chart.element.id + '_ChartSeriesClipRect_' + index + ')'
            });
        }
        this.markerHeight = ((series.type === 'Scatter' || marker.visible)) ? (marker.height / 2) : 0;
        this.commonId = this.chart.element.id + '_Series_' + index + '_Point_';
        this.calculateErrorHeight(series, series.marker.dataLabel.position);
        this.chartBackground = this.chart.chartArea.background === 'trasparent' ?
            this.chart.background || this.chart.themeStyle.background : this.chart.chartArea.background;
    }

    private calculateErrorHeight(series: Series, position: LabelPosition): void {
        if (!series.errorBar.visible) {
            return null;
        } else if (series.errorBar.visible && this.chart.chartAreaType !== 'PolarRadar') {
            let direction: ErrorBarDirection = series.errorBar.direction;
            let positiveHeight: number = this.chart.errorBarModule.positiveHeight;
            let negativeHeight: number = this.chart.errorBarModule.negativeHeight;
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
        return series.isRectSeries || series.type === 'RangeArea';
    }

    /**
     * Render the data label for series.
     * @return {void}
     */

    public render(series: Series, chart: Chart, dataLabel: DataLabelSettingsModel): void {
        // initialize the private variable
        this.initPrivateVariables(series, series.marker);
        let rect: Rect;
        let rgbValue: ColorValue;
        let contrast: number;
        let argsData: ITextRenderEventArgs;
        let border: BorderModel;
        let textSize: Size;
        this.inverted = chart.requireInvertedAxis;
        this.yAxisInversed = series.yAxis.isInversed;
        let redraw: boolean = chart.redraw;
        let templateId: string = chart.element.id + '_Series_' +
            (series.index === undefined ? series.category : series.index) + '_DataLabelCollections';
        let element: HTMLElement = createElement('div', {
            id: templateId
        });
        // Data label point iteration started
        series.points.map((point: Points, index: number) => {
            this.margin = dataLabel.margin;
            let labelText: string[] = [];
            let labelLength: number;
            let clip: Rect = series.clipRect;
            border = { width: dataLabel.border.width, color: dataLabel.border.color };
            let argsFont: FontModel = <FontModel>(extend({}, getValue('properties', dataLabel.font), null, true));
            if (
                (point.symbolLocations.length && point.symbolLocations[0]) ||
                (series.type === 'BoxAndWhisker' && point.regions.length)
            ) {
                labelText = getLabelText(point, series, chart);
                labelLength = labelText.length;
                for (let i: number = 0; i < labelLength; i++) {
                    argsData = {
                        cancel: false, name: textRender, series: series,
                        point: point, text: labelText[i], border: border,
                        color: dataLabel.fill, template: dataLabel.template, font: argsFont
                    };
                    chart.trigger(textRender, argsData);
                    if (!argsData.cancel) {
                        this.fontBackground = argsData.color;
                        this.isDataLabelShape(argsData);
                        this.markerHeight = series.type === 'Bubble' ? (point.regions[0].height / 2) : this.markerHeight;
                        if (argsData.template !== null) {
                            this.createDataLabelTemplate(element, series, dataLabel, point, argsData, i, redraw);
                        } else {
                            textSize = measureText(argsData.text, dataLabel.font);
                            rect = this.calculateTextPosition(point, series, textSize, dataLabel, i);
                            if (!isCollide(rect, chart.dataLabelCollections, clip)) {
                                chart.dataLabelCollections.push(new Rect(
                                    rect.x + clip.x, rect.y + clip.y, rect.width, rect.height
                                ));
                                if (this.isShape) {
                                    series.shapeElement.appendChild(chart.renderer.drawRectangle(
                                        new RectOption(
                                            this.commonId + index + '_TextShape_' + i,
                                            argsData.color, argsData.border, dataLabel.opacity, rect, dataLabel.rx,
                                            dataLabel.ry
                                        )) as HTMLElement);
                                }
                                // Checking the font color
                                rgbValue = convertHexToColor(colorNameToHex(this.fontBackground));
                                contrast = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
                                textElement(
                                    new TextOption(
                                        this.commonId + index + '_Text_' + i,
                                        rect.x + this.margin.left + textSize.width / 2, rect.y + this.margin.top + textSize.height * 3 / 4,
                                        'middle', argsData.text, 'rotate(0,' + (rect.x) + ',' + (rect.y) + ')', 'auto'
                                    ),
                                    argsData.font, argsData.font.color ||
                                    ((contrast >= 128 || series.type === 'Hilo') ? 'black' : 'white'),
                                    series.textElement, false, redraw, true
                                );
                            }
                        }
                    }
                }
            }
        });
        if (element.childElementCount) {
            appendChildElement(getElement(chart.element.id + '_Secondary_Element'), element, chart.redraw);
        }
    }

    /**
     * Render the data label template.
     * @return {void}
     * @private
     */
    private createDataLabelTemplate(
        parentElement: HTMLElement, series: Series,
        dataLabel: DataLabelSettingsModel, point: Points, data: ITextRenderEventArgs, labelIndex: number,
        redraw: boolean
    ): void {
        this.margin = { left: 0, right: 0, bottom: 0, top: 0 };
        let clip: Rect = series.clipRect;
        let childElement: HTMLElement = createTemplate(
            createElement('div', {
                id: this.chart.element.id + '_Series_' + (series.index === undefined ? series.category : series.index) + '_DataLabel_'
                + point.index + (labelIndex ? ('_' + labelIndex) : ''),
                styles: 'position: absolute;background-color:' + data.color + ';' +
                getFontStyle(dataLabel.font) + ';border:' + data.border.width + 'px solid ' + data.border.color + ';'
            }),
            point.index, data.template, this.chart, point, series);
        let elementRect: ClientRect = measureElementRect(childElement, redraw);
        let rect: Rect = this.calculateTextPosition(
            point, series, { width: elementRect.width, height: elementRect.height },
            dataLabel, labelIndex
        );
        childElement.style.left = ((this.chart.chartAreaType === 'PolarRadar' ? 0 : series.clipRect.x) + rect.x) + 'px';
        childElement.style.top = ((this.chart.chartAreaType === 'PolarRadar' ? 0 : series.clipRect.y) + rect.y) + 'px';
        let rgbValue: ColorValue = convertHexToColor(colorNameToHex(this.fontBackground));
        let vAxis: Axis = series.chart.requireInvertedAxis ? series.xAxis : series.yAxis;
        let hAxis: Axis = series.chart.requireInvertedAxis ? series.yAxis : series.xAxis;
        childElement.style.color = dataLabel.font.color ||
            ((Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000)) >= 128 ? 'black' : 'white');
        if (childElement.childElementCount && !isCollide(rect, this.chart.dataLabelCollections, clip)
            && (series.seriesType !== 'XY' || point.yValue === undefined || withIn(point.yValue, series.yAxis.visibleRange) ||
                (series.type.indexOf('100') > -1 && withIn(series.stackedValues.endValues[point.index], series.yAxis.visibleRange)))
            && withIn(point.xValue, series.xAxis.visibleRange) && parseFloat(childElement.style.top) >= vAxis.rect.y &&
            parseFloat(childElement.style.left) >= hAxis.rect.x && parseFloat(childElement.style.top) <= vAxis.rect.y + vAxis.rect.height &&
            parseFloat(childElement.style.left) <= hAxis.rect.x + hAxis.rect.width
        ) {
            this.chart.dataLabelCollections.push(new Rect(
                rect.x + clip.x, rect.y + clip.y, rect.width, rect.height
            ));
            appendChildElement(parentElement, childElement, redraw, true, 'left', 'top');
            if (series.animation.enable && this.chart.animateSeries) {
                this.doDataLabelAnimation(series, childElement);
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
        let padding: number = 5;
        let clipRect: Rect = series.clipRect;
        let rect: Rect;
        // calculating alignment
        if (!this.chart.requireInvertedAxis || !this.isRectSeries(series) || series.type === 'BoxAndWhisker') {
            this.locationX = location.x;
            let alignmentValue: number = textSize.height + (this.borderWidth * 2) + this.markerHeight +
                this.margin.bottom + this.margin.top + padding;
            location.y = (dataLabel.position === 'Auto') ? location.y :
                this.calculateAlignment(
                    alignmentValue, location.y, dataLabel.alignment,
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
                location = this.calculatePolarRectPosition(location, dataLabel.position, series, point, textSize, labelIndex);
            }
        } else {
            this.locationY = location.y;
            let alignmentValue: number = textSize.width + this.borderWidth + this.margin.left + this.margin.right - padding;
            location.x = dataLabel.position === 'Auto' ? location.x :
                this.calculateAlignment(alignmentValue, location.x, dataLabel.alignment, point.yValue < 0);
            location.x = this.calculateRectPosition(
                location.x, labelRegion, point.yValue < 0 !== this.yAxisInversed,
                dataLabel.position, series, textSize, labelIndex, point
            );
        }
        rect = calculateRect(location, textSize, this.margin);
        // Checking the condition whether data Label has been exist the clip rect
        if (!((rect.y > clipRect.height) || (rect.x > clipRect.width) ||
            (rect.x + rect.width < 0) || (rect.y + rect.height < 0))) {
            rect.x = rect.x < 0 ? padding : rect.x;
            rect.y = rect.y < 0 ? padding : rect.y;
            rect.x -= (rect.x + rect.width) > clipRect.width ? (rect.x + rect.width) - clipRect.width + padding : 0;
            rect.y -= (rect.y + rect.height) > clipRect.height ? (rect.y + rect.height) - clipRect.height + padding : 0;
            this.fontBackground = this.fontBackground === 'transparent' ? this.chartBackground : this.fontBackground;
        }

        return rect;
    }

    // Calculation label location for polar column draw types
    private calculatePolarRectPosition(
        location: ChartLocation, position: LabelPosition, series: Series,
        point: Points, size: Size, labelIndex: number
    ): ChartLocation {
        let padding: number = 5;
        let columnRadius: number;
        let angle: number = (point.regionData.startAngle - 0.5 * Math.PI) + (point.regionData.endAngle - point.regionData.startAngle) / 2;
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
        } else if (position === 'Top') {
            columnRadius = labelIndex === 0 ? columnRadius - 2 * padding - this.markerHeight :
                columnRadius + 2 * padding + this.markerHeight;
        } else if (position === 'Bottom') {
            columnRadius = padding;
        } else {
            if (labelIndex === 0) {
                columnRadius = columnRadius >= series.chart.radius ? columnRadius - padding :
                    series.drawType === 'StackingColumn' ? columnRadius - 2 * padding : columnRadius + 2 * padding;
            } else {
                columnRadius = columnRadius >= series.chart.radius ? columnRadius + padding : columnRadius - 2 * padding;
            }
        }
        location.x = series.clipRect.width / 2 + series.clipRect.x + columnRadius * Math.cos(angle);
        location.y = series.clipRect.height / 2 + series.clipRect.y + columnRadius * Math.sin(angle);
        return location;
    }


    /**
     * Get the label location
     */
    private getLabelLocation(point: Points, series: Series, textSize: Size, labelIndex: number): ChartLocation {
        let location: ChartLocation = new ChartLocation(0, 0);
        let labelRegion: Rect = (series.type === 'Candle' && labelIndex > 1) ? point.regions[1] : point.regions[0];
        if (series.type === 'HiloOpenClose') {
            labelRegion = (labelIndex === 2) ? point.regions[1] : point.regions[2];
        }
        let xAxis: Axis = series.xAxis;
        let yAxis: Axis = series.yAxis;
        let isInverted: boolean = series.chart.requireInvertedAxis;
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
                let height: number = labelRegion.height;
                location.y = labelRegion.y + height / 2 + 2 * (labelIndex === 2 ? 1 : -1);
            } else {
                let width: number = labelRegion.width;
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
        let padding: number = 5;
        let margin: MarginModel = this.margin;
        let textLength: number = !this.inverted ? textSize.height : textSize.width;
        let extraSpace: number = this.borderWidth + textLength / 2 + padding;
        if (series.type.indexOf('Stacking') > -1) {
            position = position === 'Outer' ? 'Top' : position;
        } else if (series.type.indexOf('Range') > -1) {
            position = (position === 'Outer' || position === 'Top') ? position : 'Auto';
        } else if (series.type === 'Waterfall') {
            position = position === 'Auto' ? 'Middle' : position;
        }

        switch (position) {
            case 'Bottom':
                labelLocation = !this.inverted ?
                    isMinus ? (labelLocation - rect.height + extraSpace + margin.top) :
                        (labelLocation + rect.height - extraSpace - margin.bottom) :
                    isMinus ? (labelLocation + rect.width - extraSpace - margin.left) :
                        (labelLocation - rect.width + extraSpace + margin.right);
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
                extraSpace += this.errorHeight;
                labelLocation = this.calculateTopAndOuterPosition(labelLocation, rect, position, series, labelIndex, extraSpace, isMinus);

                break;
        }
        let check: boolean = !this.inverted ? (labelLocation < rect.y || labelLocation > rect.y + rect.height) :
            (labelLocation < rect.x || labelLocation > rect.x + rect.width);
        this.fontBackground = check ?
            (this.fontBackground === 'transparent' ? this.chartBackground : this.fontBackground)
            : this.fontBackground === 'transparent' ? (point.color || series.interior) : this.fontBackground;
        return labelLocation;
    }

    private calculatePathPosition(
        labelLocation: number, position: LabelPosition, series: Series,
        point: Points, size: Size, labelIndex: number
    ): number {
        let padding: number = 5;
        if ((series.type.indexOf('Area') > -1 && series.type !== 'RangeArea')
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
        let collection: Rect[] = this.chart.dataLabelCollections;
        let finalPosition: number = series.type.indexOf('Range') !== -1 || series.type === 'Hilo' ? 2 : 4;
        while (isOverLap && position < finalPosition) {
            location = this.calculateRectPosition(
                labelLocation, rect, isMinus, this.getPosition(position), series, size, labelIndex, point);
            if (!this.inverted) {
                labelRect = calculateRect(new ChartLocation(this.locationX, location), size, this.margin);
                isOverLap = labelRect.y < 0 || isCollide(labelRect, collection, series.clipRect) || labelRect.y > series.clipRect.height;
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
            case 'Center': labelLocation = labelLocation; break;
        }
        return labelLocation;
    }
    //calculation for top and outer position of datalabel for rect series
    private calculateTopAndOuterPosition(
        location: number, rect: Rect, position: LabelPosition, series: Series, index: number,
        extraSpace: number, isMinus: boolean
    ): number {
        let margin: MarginModel = this.margin;
        let top: boolean;
        switch (series.type) {
            case 'RangeColumn':
            case 'RangeArea':
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
                if ((isMinus && position === 'Top') || (!isMinus && position === 'Outer')) {
                    location = !this.inverted ? location - extraSpace - margin.bottom - this.markerHeight :
                        location + extraSpace + margin.left + this.markerHeight;
                } else {
                    location = !this.inverted ? location + extraSpace + margin.top + this.markerHeight :
                        location - extraSpace - margin.right - this.markerHeight;
                }
                break;
        }
        return location;
    }

    /**
     * Updates the label location
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
        let points: Points[] = series.points;
        let index: number = point.index;
        let yValue: number = points[index].yValue;
        let position: LabelPosition;
        let nextPoint: Points = points.length - 1 > index ? points[index + 1] : null;
        let previousPoint: Points = index > 0 ? points[index - 1] : null;
        let yLocation: number;
        let isOverLap: boolean = true;
        let labelRect: Rect;
        let isBottom: boolean;
        let positionIndex: number;
        let collection: Rect[] = this.chart.dataLabelCollections;
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
                position = series.yAxis.isInversed ? 'Bottom' : 'Top';
            } else if (labelIndex === 2 || labelIndex === 4) {
                position = series.yAxis.isInversed ? 'Top' : 'Bottom';
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
                    let slope: number = (nextPoint.yValue - previousPoint.yValue) / 2;
                    let intersectY: number = (slope * index) + (nextPoint.yValue - (slope * (index + 1)));
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
     * Animates the data label.
     * @param  {Series} series - Data label of the series gets animated.
     * @return {void}
     */
    public doDataLabelAnimation(series: Series, element?: Element): void {
        let shapeElements: NodeList = series.shapeElement.childNodes;
        let textNode: NodeList = series.textElement.childNodes;
        let delay: number = series.animation.delay + series.animation.duration;
        let location: ChartLocation;
        let length: number = element ? 1 : textNode.length;
        let tempElement: HTMLElement;
        for (let i: number = 0; i < length; i++) {
            tempElement = textNode[i] as HTMLElement;
            if (element) {
                (<HTMLElement>element).style.visibility = 'hidden';
                templateAnimate(element, delay, 200, 'ZoomIn');
            } else {
                location = new ChartLocation(
                    (+tempElement.getAttribute('x')) + ((+tempElement.getAttribute('width')) / 2),
                    (+tempElement.getAttribute('y')) + ((+tempElement.getAttribute('height')) / 2));
                markerAnimate(tempElement, delay, 200, series, null, location, true);
                if (shapeElements[i]) {
                    tempElement = shapeElements[i] as HTMLElement;
                    location = new ChartLocation(
                        (+tempElement.getAttribute('x')) + ((+tempElement.getAttribute('width')) / 2),
                        (+tempElement.getAttribute('y')) + ((+tempElement.getAttribute('height')) / 2));
                    markerAnimate(tempElement, delay, 200, series, null, location, true);
                }
            }
        }
    }

    private getPosition(index: number): LabelPosition {
        return <LabelPosition>(['Outer', 'Top', 'Bottom', 'Middle', 'Auto'][index]);
    }

    /**
     * Get module name.
     */

    protected getModuleName(): string {
        // Returns the module name
        return 'DataLabel';
    }
    /**
     * To destroy the dataLabel for series.
     * @return {void}
     * @private
     */

    public destroy(chart: Chart): void {
        // Destroy method performed here
    }

}