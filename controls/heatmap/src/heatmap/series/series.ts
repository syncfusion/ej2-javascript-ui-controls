import { Property, ChildProperty, extend, merge, Complex, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { HeatMap } from '../heatmap';
import { Rect, TextBasic, Path, PathAttributes, RectOption, CircleOption, TextOption, CurrentRect, DrawSvgCanvas } from '../utils/helper';
import { convertHexToColor, colorNameToHex } from '../utils/helper';
import { CellColor, RgbColor } from '../utils/colorMapping';
import { BorderModel, FontModel } from '../model/base-model';
import { Border, Font, BubbleTooltipData } from '../model/base';
import { IThemeStyle } from '../model/interface';
import { Theme } from '../model/theme';
import { CellType, BubbleType } from '../utils/enum';
import { CellSettingsModel } from './series-model';
import { DataModel } from '../datasource/adaptor-model';

/**
 * Configures the CellSettings property in the Heatmap.
 */
export class CellSettings extends ChildProperty<CellSettings> {
    /**
     * Toggles the visibility of data label over the heatmap cells.
     * @default true
     */

    @Property(true)
    public showLabel: boolean;

    /**
     * Specifies the formatting options for the data label. 
     * @default ''
     */

    @Property('')
    public format: string;

    /**
     * Enable or disable the cell highlighting on mouse hover
     * @default true
     */
    @Property(true)
    public enableCellHighlighting: Boolean;

    /**
     * Specifies the cell border style. 
     * @default ''
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     * Specifies the cell label style. 
     * @default ''
     */
    @Complex<FontModel>(Theme.rectLabelFont, Font)
    public textStyle: FontModel;

    /**
     * Defines cell Type. They are
     * * Rect: Render a HeatMap cells in rectangle shape.
     * * Bubble: Render a HeatMap cells in bubble shape.
     * @default 'Rect'
     */
    @Property('Rect')
    public tileType: CellType;

    /**
     * Defines Bubble Type. They are
     * * Size: Define the bubble type is size.
     * * Color: Define the bubble type is color.
     * * Sector: Define the bubble type is sector.
     * * SizeAndColor: Define the bubble type is sizeandcolor.
     * @default 'Color'
     */
    @Property('Color')
    public bubbleType: BubbleType;

    /**
     * Enable or disable the bubble to display in inverse
     * @default true
     */
    @Property(false)
    public isInversedBubbleSize: boolean;

}

export class Series {
    private heatMap: HeatMap;
    private drawSvgCanvas: DrawSvgCanvas;
    private cellColor: CellColor;
    private text: number;
    private color: string;
    private bubbleColorValue: BubbleTooltipData[];
    public hoverXAxisLabel: string | number;
    public hoverYAxisLabel: string | number;
    public hoverXAxisValue: string | number | Date;
    public hoverYAxisValue: string | number | Date;
    constructor(heatMap?: HeatMap) {
        this.heatMap = heatMap;
        this.drawSvgCanvas = new DrawSvgCanvas(this.heatMap);
        this.cellColor = new CellColor(this.heatMap);
    }
    /** @private */
    private containerRectObject: Element;
    /** @private */
    private containerTextObject: Element;
    /** @private */
    public format: Function;

    public checkLabelYDisplay: boolean;
    public checkLabelXDisplay: boolean;
    public rectPositionCollection: CurrentRect[][];

    /**
     * To render rect series.
     * @return {void}
     * @private
     */
    public renderRectSeries(): void {
        this.createSeriesGroup();
        let heatMap: HeatMap = this.heatMap;
        heatMap.xLength = heatMap.axisCollections[0].axisLabelSize;
        heatMap.yLength = heatMap.axisCollections[1].axisLabelSize; // Series Part
        let tempX: number = Math.round(heatMap.initialClipRect.x * 100) / 100;
        let tempY: number = Math.round(heatMap.initialClipRect.y * 100) / 100;
        let dataXIndex: number = 0;
        let dataYIndex: number = 0;
        let cellSetting: CellSettingsModel = heatMap.cellSettings;
        let tempWidth: number = Math.round(((heatMap.initialClipRect.width -
            (cellSetting.border.width / 2)) / heatMap.xLength) * 100) / 100;
        let tempHeight: number = Math.round(((heatMap.initialClipRect.height -
            (cellSetting.border.width / 2)) / heatMap.yLength) * 100) / 100;
        let tempVal: number = 0;
        let themeStyle: IThemeStyle = heatMap.themeStyle;
        let tempBorder: BorderModel;
        let tempRectPosition: CurrentRect[] = [];
        let circleRadius: number;
        tempBorder = cellSetting.border;
        let borderColor: string;
        this.rectPositionCollection = [];
        this.color = '';
        this.bubbleColorValue = [];
        if (heatMap.yAxis.opposedPosition) {
            tempX = Math.round((heatMap.initialClipRect.x + (parseFloat(tempBorder.width.toString()) / 2)) * 100) / 100;
        }
        circleRadius = this.getBubbleRadius(tempWidth, tempHeight);
        for (let x: number = 0; x < (heatMap.xLength * heatMap.yLength); x++) {
            this.setTextAndColor(dataXIndex, dataYIndex);
            let rectPosition: CurrentRect = new CurrentRect(0, 0, 0, 0, 0, '');
            borderColor = tempBorder.color;
            if ((heatMap.renderingMode === 'Canvas' && parseFloat(tempBorder.width.toString()) === 0) || (!borderColor &&
                cellSetting.tileType === 'Bubble' && cellSetting.bubbleType === 'Sector')) {
                borderColor = this.color;
            }
            if (this.heatMap.bubbleSizeWithColor) {
                this.updateRectDetails(
                    rectPosition, tempX, tempY, tempWidth, tempHeight,
                    <BubbleTooltipData[]>extend('', this.bubbleColorValue, null, true), x);
            } else {
                this.updateRectDetails(rectPosition, tempX, tempY, tempWidth, tempHeight, this.text, x);
            }
            if (cellSetting.tileType === 'Rect') { // Rectangle/Tile Series
                this.renderTileCell(rectPosition, tempBorder, x, this.color, borderColor);
                this.updateLabelVisibleStatus(tempWidth, tempHeight);
            } else {
                if (cellSetting.bubbleType === 'Color') { // Bubble by same size and different color Series
                    this.renderBubbleCell(rectPosition, tempBorder, x, this.color, borderColor, circleRadius);
                    this.updateLabelVisibleStatus((circleRadius * 2) - 12, (circleRadius * 2) - 6); // 6, 12 - circle padding
                } else if (!isNullOrUndefined(this.text) && (cellSetting.bubbleType === 'Size' || cellSetting.bubbleType === 'SizeAndColor')
                    && this.text.toString() !== '') { // Bubble by same color and different size Series
                    let tempCircleRadius: number = this.getRadiusBypercentage(
                        parseFloat(this.text.toString()), heatMap.dataSourceMinValue, heatMap.dataSourceMaxValue, circleRadius);
                    this.renderBubbleCell(rectPosition, tempBorder, x, this.color, borderColor, tempCircleRadius);
                    this.updateLabelVisibleStatus((tempCircleRadius * 2) - 12, (tempCircleRadius * 2) - 6);
                } else if (cellSetting.bubbleType === 'Sector' && !isNullOrUndefined(this.text) && this.text.toString() !== '') {
                    this.renderSectorCell(rectPosition, tempBorder, x.toString(), this.color, borderColor, circleRadius, this.text);
                    this.checkLabelXDisplay = false;
                    this.checkLabelYDisplay = false;
                }
            }
            tempRectPosition.push(rectPosition);
            if (cellSetting.showLabel && this.checkLabelYDisplay && this.checkLabelXDisplay) {
                let displayText: string = this.getFormatedText(this.text, cellSetting.format);
                let themeCellTextStyle: FontModel = cellSetting.textStyle;
                let options: TextOption = new TextOption(
                    heatMap.element.id + '_HeatMapRectLabels_' + x, new TextBasic(
                        Math.round((tempX + tempWidth / 2) * 100) / 100, Math.round((tempY + tempHeight / 2) * 100) / 100,
                        'middle', displayText, null, null, 'middle'),
                    themeCellTextStyle, themeCellTextStyle.color || this.getSaturatedColor(this.color));
                if (Browser.isIE && !heatMap.enableCanvasRendering) {
                    options.dy = this.heatMap.cellSettings.tileType === 'Bubble' ? '0.5ex' : '1ex';
                }
                this.drawSvgCanvas.createText(options, this.containerTextObject, displayText);
            }
            if (tempVal === heatMap.xLength - 1) {
                tempY = Math.round((tempY + tempHeight) * 100) / 100;
                tempVal = 0;
                dataYIndex = 0;
                if (heatMap.yAxis.opposedPosition) {
                    tempX = Math.round((heatMap.initialClipRect.x + (parseFloat(tempBorder.width.toString()) / 2)) * 100) / 100;
                } else {
                    tempX = Math.round(heatMap.initialClipRect.x * 100) / 100;
                }
                this.rectPositionCollection.push(tempRectPosition);
                tempRectPosition = [];
                dataXIndex++;
            } else {
                tempX = Math.round((tempX + tempWidth) * 100) / 100;
                tempVal++;
                dataYIndex++;
            }
        }
        if (!heatMap.enableCanvasRendering) {
            heatMap.svgObject.appendChild(this.containerRectObject as HTMLElement);
            if (cellSetting.showLabel && !(cellSetting.tileType === 'Bubble' && cellSetting.bubbleType === 'Sector')) {
                heatMap.svgObject.appendChild(this.containerTextObject as HTMLElement);
            }
        }
    }

    /**
     * To set color and text details.
     * @private
     */
    private setTextAndColor(dataXIndex: number, dataYIndex: number): void {
        let cellSetting: CellSettingsModel = this.heatMap.cellSettings;
        this.bubbleColorValue = [];
        let adaptData: DataModel = this.heatMap.dataSource;
        // tslint:disable-next-line:no-any
        let clonedDataSource: any[] = this.heatMap.clonedDataSource;
        if (this.heatMap.bubbleSizeWithColor) {
            this.text = !isNullOrUndefined(clonedDataSource[dataXIndex][dataYIndex][0]) &&
                clonedDataSource[dataXIndex][dataYIndex][0].toString() !== '' ? clonedDataSource[dataXIndex][dataYIndex][0] : '';
            this.color = !isNullOrUndefined(clonedDataSource[dataXIndex][dataYIndex][1]) &&
                clonedDataSource[dataXIndex][dataYIndex][1].toString() !== '' ?
                this.cellColor.getColorByValue(clonedDataSource[dataXIndex][dataYIndex][1])
                : this.heatMap.isColorValueExist ? this.heatMap.emptyPointColor : this.cellColor.getColorByValue(this.text);
            let tempBubbleCollection: BubbleTooltipData = new BubbleTooltipData(
                adaptData.isJsonData && adaptData.adaptorType === 'Cell' ? (
                    this.heatMap.dataSource as DataModel).bubbleDataMapping.size : null,
                this.text, 'Size');
            this.bubbleColorValue.push(tempBubbleCollection);
            this.bubbleColorValue.push({
                mappingName: adaptData.isJsonData && adaptData.adaptorType === 'Cell' ?
                    (this.heatMap.dataSource as DataModel).bubbleDataMapping.color : null,
                bubbleData: !isNullOrUndefined(clonedDataSource[dataXIndex][dataYIndex][1]) &&
                    clonedDataSource[dataXIndex][dataYIndex][1].toString() !== '' ? clonedDataSource[dataXIndex][dataYIndex][1] : '',
                valueType: 'Color'
            });
        } else {
            this.text = clonedDataSource[dataXIndex][dataYIndex];
            this.color = this.cellColor.getColorByValue(this.text);
        }
    }

    /**
     * To update rect details.
     * @private
     */
    private createSeriesGroup(): void {
        if (!this.heatMap.enableCanvasRendering) {
            this.containerRectObject = this.heatMap.renderer.createGroup(
                {
                    id: this.heatMap.element.id + '_Container_RectGroup',
                    x: this.heatMap.initialClipRect.x, y: this.heatMap.initialClipRect.y, transform: 'translate( 0, 0)'
                });
            if (this.heatMap.cellSettings.showLabel &&
                !(this.heatMap.cellSettings.tileType === 'Bubble' && this.heatMap.cellSettings.bubbleType === 'Sector')) {
                this.containerTextObject = this.heatMap.renderer.createGroup(
                    { id: this.heatMap.element.id + '_Container_TextGroup', transform: 'translate( 0, 0)' });
            }
        }
    }

    /**
     * To update rect details.
     * @private
     */
    private updateRectDetails(
        rectPosition: CurrentRect, tempX: number, tempY: number, tempWidth: number,
        tempHeight: number, text: number|BubbleTooltipData[], x: number): void {
        rectPosition.x = tempX;
        rectPosition.y = tempY;
        rectPosition.width = tempWidth;
        rectPosition.height = tempHeight;
        rectPosition.value = text;
        rectPosition.id = this.heatMap.element.id + '_HeatMapRect_' + x;
    }

    /**
     * To Render Tile Cell.
     * @private
     */
    private renderTileCell(
        rectPosition: CurrentRect, tempBorder: BorderModel,
        x: number, color: string, borderColor: string): void {
        let rect: RectOption = new RectOption(
            this.heatMap.element.id + '_HeatMapRect_' + x, color, tempBorder, 1,
            new Rect(
                rectPosition.x, rectPosition.y, rectPosition.width, rectPosition.height),
            borderColor || this.heatMap.themeStyle.cellBorder,
            tempBorder.radius, tempBorder.radius, );
        this.drawSvgCanvas.drawRectangle(rect, this.containerRectObject, true);
    }

    /**
     * To get bubble radius.
     * @private
     */
    private getBubbleRadius(width: number, height: number): number {
        let radius: number = (width / 2) - 2;
        if (height / 2 < width / 2) {
            radius = (height / 2) - 2;
        }
        return radius < 0 ? 0 : radius;
    }

    /**
     * To Render Bubble Cell.
     * @private
     */
    private renderSectorCell(
        bubblePosition: CurrentRect, tempBorder: BorderModel,
        x: string, color: string, borderColor: string, circleRadius: number, text: number): void {
        let curve: number;
        let startAngle: number;
        let endAngle: number;
        let cX: number;
        let cY: number;
        let X1: number;
        let Y1: number;
        let tempcX : number;
        let tempcY : number;
        let pathBorderWidth: number;
        let centerX: number = Math.round((bubblePosition.x + (bubblePosition.width / 2)) * 100) / 100;
        let centerY: number = Math.round((bubblePosition.y + (bubblePosition.height / 2)) * 100) / 100;
        let tempColor: string = color;
        let sectorContibution: number = this.getRadiusBypercentage(
            text, this.heatMap.dataSourceMinValue, this.heatMap.dataSourceMaxValue, 360); // Circle total angle.
        for (let y: number = 0; y < 2; y++) {
            pathBorderWidth = parseFloat(tempBorder.width.toString());
            if (y === 0) {
                curve = sectorContibution >= 180 ? 1 : 0;
                startAngle = -90;
                if (sectorContibution === 0) {
                    endAngle = 270; // (360 - 90) for zero position adjustment.
                } else {
                    endAngle = (sectorContibution - 90);
                }
                cX = Math.round((centerX + circleRadius * Math.cos((sectorContibution - 90) * (Math.PI / 180))) * 100) / 100;
                cY = Math.round((centerY + circleRadius * Math.sin((sectorContibution - 90) * (Math.PI / 180))) * 100) / 100;
                X1 = Math.round(centerX * 100) / 100;
                Y1 = Math.round((centerY - circleRadius) * 100) / 100;
                if (sectorContibution === 0) {
                    tempColor = this.heatMap.emptyPointColor;
                }
            } else {
                curve = sectorContibution >= 180 ? 0 : 1;
                startAngle = endAngle;
                endAngle = 270; // (360 - 90) for zero position adjustment.
                tempColor = this.heatMap.emptyPointColor;
                x = x + '_Unfilled';
                tempcX = cX;
                tempcY = cY;
                cX = X1;
                cY = Y1;
                X1 = tempcX;
                Y1 = tempcY;
                if (sectorContibution === 0) {
                    pathBorderWidth = 1;
                    borderColor = color;
                }
            }
            let path: Path = new Path(
                '', false, centerX, centerY, X1, Y1, cX, cY,
                startAngle, endAngle, circleRadius, true);
            let sector: PathAttributes = new PathAttributes(
                this.heatMap.element.id + '_HeatMapRect_' + x, path, tempColor, tempBorder, pathBorderWidth, 1,
                borderColor);
            this.calculateShapes(sector, path, sectorContibution, curve);
            this.drawSvgCanvas.drawPath(sector, path, this.containerRectObject);
            if (sectorContibution === 360) {
                break;
            }
        }
    }

    /**
     * To Render sector Cell.
     * @private
     */
    private calculateShapes(options: PathAttributes, path: Path, sectorContibution: number, curve: number): void {
        let pathString: string;
        let clockWise: number;
        switch (sectorContibution) {
            case 360:
            case 0:
                if (sectorContibution === 0 && path.start === path.end) {
                    pathString = 'M' + ' ' + options.x + ' ' + options.y + ' ' + 'L' + ' ' + path.x + ' ' + (path.y - path.radius);
                } else {
                    pathString = !this.heatMap.enableCanvasRendering ? 'M' + ' ' + options.x + ' ' + options.y + ' ' : '';
                    pathString = pathString + 'm' + ' ' + (-path.radius) + ' ' + '0' + ' ' +
                        'a' + ' ' + path.radius + ' ' + path.radius + ' ' + '0' + ' ' + '1' + ' ' + '0' +
                        ' ' + (path.radius * 2) + ' ' + '0' + ' ' + 'a' + ' ' + path.radius +
                        ' ' + path.radius + ' ' + '0' + ' ' + '1' + ' ' + '0' +
                        ' ' + (-(path.radius * 2)) + ' ' + '0' + ' ';
                }
                merge(options, { 'd': pathString });
                break;
            default:
                pathString = 'M' + ' ' + options.x + ' ' + options.y + ' ' + 'L' + ' ' + path.x1 + ' ' + path.y1 + ' ' +
                    'A' + ' ' + path.radius + ' ' + path.radius + ' ' + '0' + ' ' + curve + ' ' + '1' + ' ' +
                    path.cx + ' ' + path.cy + ' ' + 'Z';
                merge(options, { 'd': pathString });
                break;
        }
    }

    /**
     * To Render Bubble Cell.
     * @private
     */
    private renderBubbleCell(
        bubblePosition: CurrentRect, tempBorder: BorderModel,
        x: number, color: string, borderColor: string, circleRadius: number): void {
        let circle: CircleOption = new CircleOption(
            this.heatMap.element.id + '_HeatMapRect_' + x, color, tempBorder, 1,
            borderColor || this.heatMap.themeStyle.cellBorder, Math.round((bubblePosition.x + (bubblePosition.width / 2)) * 100) / 100,
            Math.round((bubblePosition.y + (bubblePosition.height / 2)) * 100) / 100, circleRadius);
        this.drawSvgCanvas.drawCircle(circle, this.containerRectObject);
    }

    /**
     * To find whether the X,Y Label need to display or not.
     * @private
     */
    private updateLabelVisibleStatus(tempWidth: number, tempHeight: number): void {
        let tempMaxString: string = this.getFormatedText(
            this.text, this.heatMap.cellSettings.format);
        this.checkLabelYDisplay = tempHeight > parseInt(
            this.heatMap.cellSettings.textStyle.size, 10) ? true : false;
        this.checkLabelXDisplay = tempWidth > (tempMaxString.length *
            (parseInt(this.heatMap.cellSettings.textStyle.size, 10) / 2)) ? true : false;
    }

    /**
     * To find percentage value.
     * @private
     */
    private getRadiusBypercentage(text: number, min: number, max: number, radius: number): number {
        let valueInPrecentage: number = ((text - min) /
            (max - min)) * 100;
        radius = ((this.heatMap.bubbleSizeWithColor ||
            (this.heatMap.cellSettings.tileType === 'Bubble' && this.heatMap.cellSettings.bubbleType === 'Size'))
            && this.heatMap.cellSettings.isInversedBubbleSize) ? radius - (radius * (valueInPrecentage / 100))
            : radius * (valueInPrecentage / 100);
        return (Math.round(radius * 100) / 100) < 0 ? 0 : (Math.round(radius * 100) / 100);
    }

    /**
     * To find saturated color for datalabel.
     * @return {string}
     * @private
     */
    private getSaturatedColor(color: string): string {
        let saturatedColor: string = color;
        saturatedColor = (saturatedColor === 'transparent') ? window.getComputedStyle(document.body, null).backgroundColor : saturatedColor;
        let rgbValue: RgbColor = convertHexToColor(colorNameToHex(saturatedColor));
        let contrast: number = Math.round((rgbValue.R * 299 + rgbValue.G * 587 + rgbValue.B * 114) / 1000);
        return contrast >= 128 ? 'black' : 'white';
    }

    /**
     * To highlight the mouse hovered rect cell.
     * @return {void}
     * @private
     */
    public highlightSvgRect(tempID: string): void {
        if (tempID.indexOf('Celltooltip') === -1) {
            if (tempID.indexOf('_HeatMapRect') !== -1) {
                if (tempID.indexOf('_HeatMapRectLabels_') !== -1) {
                    let tempIndex: number = tempID.indexOf('_HeatMapRectLabels_') + 19;
                    tempID = this.heatMap.element.id + '_HeatMapRect_' + tempID.slice(tempIndex);
                }
                let element: HTMLElement = document.getElementById(tempID);
                if (this.heatMap.tempRectHoverClass !== tempID) {
                    if (this.heatMap.cellSettings.enableCellHighlighting) {
                        let oldElement: HTMLElement = document.getElementById(this.heatMap.tempRectHoverClass);
                        if (oldElement) {
                            oldElement.style.opacity = '1';
                        }
                        if (element) {
                        element.style.opacity = '0.65';
                        }
                    }
                    this.heatMap.tempRectHoverClass = tempID;
                }
            } else {
                if (this.heatMap.cellSettings.enableCellHighlighting) {
                    let oldElement: HTMLElement = document.getElementById(this.heatMap.tempRectHoverClass);
                    if (oldElement) {
                        oldElement.style.opacity = '1';
                        this.heatMap.tempRectHoverClass = '';
                    }
                }
            }
        }
    }

    /**
     * To get the value depends to format.
     * @return {string}
     * @private
     */
    public getFormatedText(val: number, getFormat: string): string {
        let format: string = getFormat;
        let isCustom: boolean = format.match('{value}') !== null;
        this.format = this.heatMap.intl.getNumberFormat({
            format: isCustom ? '' : format
        });
        let value: string = '';
        if (val.toString() !== '') {
            value = this.formatValue(isCustom, format, val);
        }
        return value;
    }

    /**
     * To get mouse hovered cell details.
     * @return {CurrentRect}
     * @private
     */
    public getCurrentRect(x: number, y: number): CurrentRect {
        let currentRect: CurrentRect;
        let firstRectDetails: CurrentRect[] = [];
        firstRectDetails.push(this.heatMap.heatMapSeries.rectPositionCollection[0][0]);
        let rectX: number = Math.ceil(
            (x - firstRectDetails[0].x) / firstRectDetails[0].width) <
            this.heatMap.axisCollections[0].axisLabelSize ?
            Math.ceil((
                x - firstRectDetails[0].x) / firstRectDetails[0].width) :
            this.heatMap.axisCollections[0].axisLabelSize;
        let rectY: number = Math.floor(
            ((y - firstRectDetails[0].y) / firstRectDetails[0].height)) <
            this.heatMap.axisCollections[1].axisLabelSize ?
            Math.floor(((y - firstRectDetails[0].y) / firstRectDetails[0].height)) :
            this.heatMap.axisCollections[1].axisLabelSize - 1;
        rectX = rectX === 0 ? 1 : rectX;
        currentRect = this.heatMap.heatMapSeries.rectPositionCollection[rectY][rectX - 1];
        this.hoverXAxisLabel = this.heatMap.axisCollections[0].tooltipLabels[rectX - 1];
        this.hoverXAxisValue = this.heatMap.axisCollections[0].labelValue[rectX - 1];
        this.hoverYAxisLabel = this.heatMap.axisCollections[1].tooltipLabels[(
            this.heatMap.axisCollections[1].tooltipLabels.length - 1) - rectY];
        this.hoverYAxisValue = this.heatMap.axisCollections[1].labelValue[(
            this.heatMap.axisCollections[1].labelValue.length - 1) - rectY];
        return currentRect;
    }

    /**
     * Format the cell label.
     * @private
     */
    private formatValue(isCustom: boolean, format: string, tempInterval: number): string {
        return isCustom ? format.replace('{value}', this.format(tempInterval))
            : this.format(tempInterval);
    }
}