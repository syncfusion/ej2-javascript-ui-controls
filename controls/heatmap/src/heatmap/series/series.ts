import { Property, ChildProperty, extend, merge, Complex, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { HeatMap } from '../heatmap';
import { Rect, TextBasic, Path, PathAttributes, RectOption, CircleOption, TextOption, CurrentRect, DrawSvgCanvas } from '../utils/helper';
import { convertHexToColor, colorNameToHex, formatValue } from '../utils/helper';
import { CellColor, RgbColor } from '../utils/colorMapping';
import { BorderModel, FontModel, BubbleSizeModel } from '../model/base-model';
import { Border, Font, BubbleTooltipData, BubbleSize } from '../model/base';
import { IThemeStyle, ICellEventArgs } from '../model/interface';
import { Theme} from '../model/theme';
import { CellType, BubbleType } from '../utils/enum';
import { CellSettingsModel } from './series-model';
import { DataModel } from '../datasource/adaptor-model';
import { Axis } from '../axis/axis';

/**
 * Configures the CellSettings property in the Heatmap.
 */
export class CellSettings extends ChildProperty<CellSettings> {
    /**
     * Toggles the visibility of data label over the heatmap cells.
     *
     * @default true
     */

    @Property(true)
    public showLabel: boolean;

    /**
     * Specifies the formatting options for the data label.
     *
     * @default ''
     */

    @Property('')
    public format: string;

    /**
     * Enable or disable the cell highlighting on mouse hover
     *
     * @default true
     */
    @Property(true)
    public enableCellHighlighting: boolean;

    /**
     * Specifies the minimum and maximum radius value of the cell in percentage.
     *
     * @default ''
     */
    @Complex<BubbleSizeModel>({}, BubbleSize)
    public bubbleSize: BubbleSizeModel;

    /**
     * Specifies the cell border style.
     *
     * @default ''
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     * Specifies the cell label style.
     *
     * @default ''
     */
    @Complex<FontModel>(Theme.rectLabelFont, Font)
    public textStyle: FontModel;

    /**
     * Defines cell Type. They are
     * * Rect: Render a HeatMap cells in rectangle shape.
     * * Bubble: Render a HeatMap cells in bubble shape.
     *
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
     *
     * @default 'Color'
     */
    @Property('Color')
    public bubbleType: BubbleType;

    /**
     * Enable or disable the bubble to display in inverse
     *
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
    public containerRectObject: Element;
    /** @private */
    public containerTextObject: Element;
    /** @private */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public format: Function;

    public checkLabelYDisplay: boolean;
    public checkLabelXDisplay: boolean;
    public rectPositionCollection: CurrentRect[][];

    /**
     * To render rect series.
     *
     * @returns {void}
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public renderRectSeries(): void {
        this.createSeriesGroup(); const heatMap: HeatMap = this.heatMap; let isValueInRange: boolean = false;
        heatMap.xLength = heatMap.axisCollections[0].axisLabelSize;
        heatMap.yLength = heatMap.axisCollections[1].axisLabelSize; // Series Part
        let tempX: number = Math.round(heatMap.initialClipRect.x * 100) / 100;
        let tempY: number = Math.round(heatMap.initialClipRect.y * 100) / 100;
        let dataXIndex: number = 0; let dataYIndex: number = 0; const cellSetting: CellSettingsModel = heatMap.cellSettings;
        const tempWidth: number = Math.round(((heatMap.initialClipRect.width -
            (cellSetting.border.width / 2)) / heatMap.xLength) * 100) / 100;
        const tempHeight: number = Math.round(((heatMap.initialClipRect.height -
            (cellSetting.border.width / 2)) / heatMap.yLength) * 100) / 100;
        let tempVal: number = 0; const themeStyle: IThemeStyle = heatMap.themeStyle;
        let tempRectPosition: CurrentRect[] = [];  const tempBorder: BorderModel = cellSetting.border; let borderColor: string;
        let displayText: string; this.rectPositionCollection = []; this.color = ''; this.bubbleColorValue = [];
        if (heatMap.yAxis.opposedPosition) {
            tempX = Math.round((heatMap.initialClipRect.x + (parseFloat(tempBorder.width.toString()) / 2)) * 100) / 100;
        }
        const circleRadius: number = this.getBubbleRadius(tempWidth, tempHeight);
        for (let x: number = 0; x < (heatMap.xLength * heatMap.yLength); x++) {
            if (heatMap.paletteSettings.colorGradientMode === 'Column' && this.heatMap.paletteSettings.type === 'Gradient') {
                this.heatMap.dataSourceMinValue = this.heatMap.dataMin[dataYIndex];
                this.heatMap.dataSourceMaxValue = this.heatMap.dataMax[dataYIndex];
            } else if (heatMap.paletteSettings.colorGradientMode === 'Row' && this.heatMap.paletteSettings.type === 'Gradient') {
                this.heatMap.dataSourceMinValue = this.heatMap.dataMin[dataXIndex];
                this.heatMap.dataSourceMaxValue = this.heatMap.dataMax[dataXIndex];
            }
            this.setTextAndColor(dataXIndex, dataYIndex);
            const rectPosition: CurrentRect = new CurrentRect(0, 0, 0, 0, 0, '', 0, 0, 0, 0, true, '', '', true);
            borderColor = tempBorder.color;
            if (this.heatMap.bubbleSizeWithColor) {
                this.updateRectDetails(
                    rectPosition, tempX, tempY, tempWidth, tempHeight,
                    <BubbleTooltipData[]>extend('', this.bubbleColorValue, null, true), x, dataYIndex, dataXIndex);
            } else {
                this.updateRectDetails(rectPosition, tempX, tempY, tempWidth, tempHeight, this.text, x, dataYIndex, dataXIndex);
            }
            if (cellSetting.showLabel) {
                displayText = this.getFormatedText(this.text, cellSetting.format);
            } else {
                displayText = '';
            }
            rectPosition.displayText = displayText;
            if (!isNullOrUndefined(this.heatMap.cellRender)) {
                displayText = this.cellRendering(rectPosition, displayText);
            }
            if ((heatMap.renderingMode === 'Canvas' && parseFloat(tempBorder.width.toString()) === 0) || (!borderColor &&
                cellSetting.tileType === 'Bubble' && cellSetting.bubbleType === 'Sector')) {
                borderColor = this.color;
            }
            if (cellSetting.tileType === 'Rect') { // Rectangle/Tile Series
                this.renderTileCell(rectPosition, tempBorder, x, this.color, borderColor);
                this.updateLabelVisibleStatus(tempWidth, tempHeight, displayText);
            } else {
                if (cellSetting.bubbleType === 'Color') { // Bubble by same size and different color Series
                    this.renderBubbleCell(rectPosition, tempBorder, x, this.color, borderColor, circleRadius);
                    this.updateLabelVisibleStatus(
                        (circleRadius * 2) - 12, (circleRadius * 2) - 6, displayText); // 6, 12 - circle padding
                } else if (!isNullOrUndefined(this.text) && (cellSetting.bubbleType === 'Size' || cellSetting.bubbleType === 'SizeAndColor')
                    && this.text.toString() !== '') { // Bubble by same color and different size Series
                    if (this.heatMap.paletteSettings.colorGradientMode !== 'Table' && this.heatMap.paletteSettings.type === 'Gradient') {
                        this.heatMap.minColorValue = !isFinite(this.heatMap.minColorValue) ?
                            this.heatMap.dataSourceMinValue : this.heatMap.minColorValue;
                        this.heatMap.maxColorValue = !isFinite(this.heatMap.maxColorValue) ?
                            this.heatMap.dataSourceMaxValue : this.heatMap.maxColorValue;
                    }
                    const tempCircleRadius: number = this.getRadiusBypercentage(
                        parseFloat(this.text.toString()), heatMap.dataSourceMinValue, heatMap.dataSourceMaxValue, circleRadius);
                    this.renderBubbleCell(rectPosition, tempBorder, x, this.color, borderColor, tempCircleRadius);
                    this.updateLabelVisibleStatus((tempCircleRadius * 2) - 12, (tempCircleRadius * 2) - 6, displayText);
                } else if (cellSetting.bubbleType === 'Sector' && !isNullOrUndefined(this.text) && this.text.toString() !== '') {
                    this.renderSectorCell(rectPosition, tempBorder, x.toString(), this.color, borderColor, circleRadius, this.text);
                    this.checkLabelXDisplay = false;
                    this.checkLabelYDisplay = false;
                }
            }
            tempRectPosition.push(rectPosition);
            if (heatMap.rangeSelection && heatMap.paletteSettings.type === 'Fixed') {
                isValueInRange = this.isCellValueInRange(dataXIndex, dataYIndex);
                rectPosition.visible = isValueInRange;
            }
            if (cellSetting.showLabel && this.checkLabelYDisplay && this.checkLabelXDisplay) {
                const themeCellTextStyle: FontModel = cellSetting.textStyle;
                const options: TextOption = new TextOption(
                    heatMap.element.id + '_HeatMapRectLabels_' + x, new TextBasic(
                        Math.round((tempX + tempWidth / 2) * 100) / 100, Math.round((tempY + tempHeight / 2) * 100) / 100,
                        'middle', displayText, null, null, 'middle'),
                    themeCellTextStyle, themeCellTextStyle.color || this.getSaturatedColor(this.color));
                rectPosition.textId = options.id;
                if (heatMap.rangeSelection && heatMap.paletteSettings.type === 'Fixed') {
                    options.fill = isValueInRange ? options.fill : this.heatMap.themeStyle.toggledColor;
                }
                if (Browser.isIE && !heatMap.enableCanvasRendering) {
                    options.dy = this.heatMap.cellSettings.tileType === 'Bubble' ? '0.5ex' : '1ex';
                }
                this.drawSvgCanvas.createText(options, this.containerTextObject, displayText);
            }
            if (tempVal === heatMap.xLength - 1) {
                tempY = Math.round((tempY + tempHeight) * 100) / 100;
                tempVal = 0; dataYIndex = 0;
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
     * To toggle the cell text color based on legend selection.
     */

    private isCellValueInRange(dataXIndex: number, dataYIndex: number): boolean {
        let isValueInRange: boolean = false;
        for (let i: number = 0; i < this.heatMap.toggleValue.length; i++) {
            let maxValue: number;
            const minValue : number = (i === 0) && !this.heatMap.isColorRange ? this.heatMap.dataSourceMinValue :
                this.heatMap.isColorRange ?
                    this.heatMap.toggleValue[i].startValue : this.heatMap.toggleValue[i].value;
            if (this.heatMap.cellSettings.tileType === 'Bubble' && this.heatMap.cellSettings.bubbleType === 'SizeAndColor') {
                maxValue = (i === this.heatMap.toggleValue.length - 1) ? this.heatMap.maxColorValue :
                    this.heatMap.toggleValue[i + 1].value - 0.01;
            } else {
                maxValue = (i === this.heatMap.toggleValue.length - 1 && !this.heatMap.isColorRange) ?
                    this.heatMap.dataSourceMaxValue : this.heatMap.isColorRange ?
                        this.heatMap.toggleValue[i].endValue : this.heatMap.toggleValue[i + 1].value - 0.01;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const clonedDataSource: any[] = this.heatMap.clonedDataSource;
            const bubbleText: number = !isNullOrUndefined(clonedDataSource[dataXIndex][dataYIndex][1]) &&
                clonedDataSource[dataXIndex][dataYIndex][1].toString() !== '' ? clonedDataSource[dataXIndex][dataYIndex][1] : '';
            const text: number = parseFloat(
                this.heatMap.cellSettings.tileType === 'Bubble' && this.heatMap.cellSettings.bubbleType === 'SizeAndColor' ?
                    bubbleText.toString() : this.text.toString());
            if (isNaN(text)) {
                isValueInRange = true;
            } else if (!isNaN(text) && text >= minValue && text <= maxValue) {
                if (!this.heatMap.toggleValue[i].visible) {
                    isValueInRange = false;
                    break;
                } else {
                    isValueInRange = true;
                    break;
                }
            } else if (this.heatMap.isColorRange &&
                maxValue >= this.heatMap.toggleValue[i].endValue && i === this.heatMap.toggleValue.length - 1) {
                isValueInRange = true;
                break;
            }
        }
        return isValueInRange;
    }

    /**
     * To customize the cell.
     *
     * @returns {void}
     * @private
     */

    public cellRendering(rectPosition: CurrentRect, text: string): string {
        const xAxis: Axis = this.heatMap.axisCollections[0];
        const yAxis: Axis = this.heatMap.axisCollections[1];
        const xLabels: string[] = xAxis.tooltipLabels;
        const yLabels: string[] = yAxis.tooltipLabels.slice().reverse();
        const yLabelValue: (string | number | Date)[] = yAxis.labelValue.slice().reverse();
        const argData: ICellEventArgs = {
            heatmap: this.heatMap,
            cancel: false,
            name: 'cellRender',
            value: rectPosition.value,
            xLabel: xLabels[rectPosition.xIndex].toString(),
            yLabel: yLabels[rectPosition.yIndex].toString(),
            displayText: text,
            xValue: xAxis.labelValue[rectPosition.xIndex],
            yValue: yLabelValue[rectPosition.yIndex],
            cellColor: this.color
        };
        this.heatMap.trigger('cellRender', argData);
        this.color = argData.cellColor;
        return argData.displayText;
    }

    /**
     * To set color and text details.
     *
     * @private
     */

    private setTextAndColor(dataXIndex: number, dataYIndex: number): void {
        this.bubbleColorValue = [];
        const adaptData: DataModel = this.heatMap.dataSourceSettings;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clonedDataSource: any[] = this.heatMap.clonedDataSource;
        if (this.heatMap.bubbleSizeWithColor) {
            this.text = !isNullOrUndefined(clonedDataSource[dataXIndex][dataYIndex][0]) &&
                clonedDataSource[dataXIndex][dataYIndex][0].toString() !== '' ? clonedDataSource[dataXIndex][dataYIndex][0] : '';
            this.color = !isNullOrUndefined(clonedDataSource[dataXIndex][dataYIndex][1]) &&
                clonedDataSource[dataXIndex][dataYIndex][1].toString() !== '' ?
                this.cellColor.getColorByValue(clonedDataSource[dataXIndex][dataYIndex][1])
                : this.heatMap.isColorValueExist ? this.heatMap.emptyPointColor : this.cellColor.getColorByValue(this.text);
            const tempBubbleCollection: BubbleTooltipData = new BubbleTooltipData(
                adaptData.isJsonData && adaptData.adaptorType === 'Cell' ? adaptData.bubbleDataMapping.size : null,
                this.text, 'Size');
            this.bubbleColorValue.push(tempBubbleCollection);
            this.bubbleColorValue.push({
                mappingName: adaptData.isJsonData && adaptData.adaptorType === 'Cell' ?
                    adaptData.bubbleDataMapping.color : null,
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
     *
     * @private
     */

    private createSeriesGroup(): void {
        if (!this.heatMap.enableCanvasRendering) {
            this.containerRectObject = this.heatMap.renderer.createGroup({
                id: this.heatMap.element.id + '_Container_RectGroup'});
            if (this.heatMap.cellSettings.showLabel &&
                !(this.heatMap.cellSettings.tileType === 'Bubble' && this.heatMap.cellSettings.bubbleType === 'Sector')) {
                this.containerTextObject = this.heatMap.renderer.createGroup(
                    { id: this.heatMap.element.id + '_Container_TextGroup', transform: 'translate( 0, 0)' });
            }
        }
    }

    /**
     * To update rect details.
     *
     * @private
     */

    private updateRectDetails(
        rectPosition: CurrentRect, tempX: number, tempY: number, tempWidth: number,
        tempHeight: number, text: number | BubbleTooltipData[], x: number, dataXIndex: number, dataYIndex: number): void {
        rectPosition.x = tempX;
        rectPosition.y = tempY;
        rectPosition.width = tempWidth;
        rectPosition.height = tempHeight;
        rectPosition.value = text;
        rectPosition.id = this.heatMap.element.id + '_HeatMapRect_' + x;
        rectPosition.xIndex = dataXIndex;
        rectPosition.yIndex = dataYIndex;
    }

    /**
     * To Render Tile Cell.
     *
     * @private
     */

    private renderTileCell(
        rectPosition: CurrentRect, tempBorder: BorderModel,
        x: number, color: string, borderColor: string): void {
        const rect: RectOption = new RectOption(
            this.heatMap.element.id + '_HeatMapRect_' + x, color, tempBorder, 1,
            new Rect(
                rectPosition.x, rectPosition.y, rectPosition.width, rectPosition.height),
            borderColor || this.heatMap.themeStyle.cellBorder,
            tempBorder.radius, tempBorder.radius);
        this.drawSvgCanvas.drawRectangle(rect, this.containerRectObject, true);
    }

    /**
     * To get bubble radius.
     *
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
     *
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
        let tempcX: number;
        let tempcY: number;
        let pathBorderWidth: number;
        const centerX: number = Math.round((bubblePosition.x + (bubblePosition.width / 2)) * 100) / 100;
        const centerY: number = Math.round((bubblePosition.y + (bubblePosition.height / 2)) * 100) / 100;
        let tempColor: string = color;
        const sectorContibution: number = this.getRadiusBypercentage(
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
            const path: Path = new Path(
                '', false, centerX, centerY, X1, Y1, cX, cY,
                startAngle, endAngle, circleRadius, true);
            const sector: PathAttributes = new PathAttributes(
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
     *
     * @private
     */

    private calculateShapes(options: PathAttributes, path: Path, sectorContibution: number, curve: number): void {
        let pathString: string;
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
     *
     * @private
     */

    private renderBubbleCell(
        bubblePosition: CurrentRect, tempBorder: BorderModel,
        x: number, color: string, borderColor: string, circleRadius: number): void {
        const circle: CircleOption = new CircleOption(
            this.heatMap.element.id + '_HeatMapRect_' + x, color, tempBorder, 1,
            borderColor || this.heatMap.themeStyle.cellBorder, Math.round((bubblePosition.x + (bubblePosition.width / 2)) * 100) / 100,
            Math.round((bubblePosition.y + (bubblePosition.height / 2)) * 100) / 100, circleRadius);
        this.drawSvgCanvas.drawCircle(circle, this.containerRectObject);
    }

    /**
     * To find whether the X,Y Label need to display or not.
     *
     * @private
     */

    private updateLabelVisibleStatus(tempWidth: number, tempHeight: number, displayText: string): void {
        if (this.heatMap.cellSettings.showLabel) {
            this.checkLabelYDisplay = tempHeight > parseInt(
                this.heatMap.cellSettings.textStyle.size, 10) ? true : false;
            this.checkLabelXDisplay = tempWidth > (displayText.length *
                (parseInt(this.heatMap.cellSettings.textStyle.size, 10) / 2)) ? true : false;
        }
    }

    /**
     * To find percentage value.
     *
     * @private
     */

    private getRadiusBypercentage(text: number, min: number, max: number, radius: number): number {
        let minimum: number = parseInt(this.heatMap.cellSettings.bubbleSize.minimum, 10);
        let maximum: number = parseInt(this.heatMap.cellSettings.bubbleSize.maximum, 10);
        if (minimum < 0 || minimum > 100 || isNaN(minimum)) {
            minimum = 0;
        }
        if (maximum < 0 || maximum > 100 || isNaN(maximum)) {
            maximum = 100;
        }
        let valueInPrecentage: number = ((text - min) /
            (max - min)) * 100;
        valueInPrecentage = isNaN(valueInPrecentage) ? 100 : valueInPrecentage;
        if ((this.heatMap.bubbleSizeWithColor ||
            (this.heatMap.cellSettings.tileType === 'Bubble' && this.heatMap.cellSettings.bubbleType === 'Size'))) {
            if (this.heatMap.cellSettings.isInversedBubbleSize) {
                valueInPrecentage = 100 - valueInPrecentage;
            }
            valueInPrecentage = ((valueInPrecentage * (maximum - minimum)) / 100) + minimum;
        }
        radius = radius * (valueInPrecentage / 100);
        return (Math.round(radius * 100) / 100) < 0 ? 0 : (Math.round(radius * 100) / 100);
    }

    /**
     * To find saturated color for datalabel.
     *
     * @returns {string}
     * @private
     */

    private getSaturatedColor(color: string): string {
        let saturatedColor: string = color;
        saturatedColor = (saturatedColor === 'transparent') ? window.getComputedStyle(document.body, null).backgroundColor : saturatedColor;
        const rgbValue: RgbColor = convertHexToColor(colorNameToHex(saturatedColor));
        const contrast: number = Math.round((rgbValue.R * 299 + rgbValue.G * 587 + rgbValue.B * 114) / 1000);
        return contrast >= 128 ? 'black' : 'white';
    }

    /**
     * To highlight the mouse hovered rect cell.
     *
     * @returns {void}
     * @private
     */

    public highlightSvgRect(tempID: string): void {
        if (tempID.indexOf('Celltooltip') === -1) {
            if (tempID.indexOf('_HeatMapRect') !== -1) {
                if (tempID.indexOf('_HeatMapRectLabels_') !== -1) {
                    const tempIndex: number = tempID.indexOf('_HeatMapRectLabels_') + 19;
                    tempID = this.heatMap.element.id + '_HeatMapRect_' + tempID.slice(tempIndex);
                }
                const element: HTMLElement = document.getElementById(tempID);
                if (this.heatMap.tempRectHoverClass !== tempID) {
                    if (this.heatMap.cellSettings.enableCellHighlighting) {
                        let oldElement: HTMLElement;
                        if (this.heatMap.tempRectHoverClass) {
                            oldElement = document.getElementById(this.heatMap.tempRectHoverClass);
                        }
                        if (oldElement && !this.heatMap.rectSelected) {
                            oldElement.setAttribute('opacity', '1');
                        }
                        if (element && !this.heatMap.rectSelected) {
                            element.setAttribute('opacity', '0.65');
                        }
                    }
                    this.heatMap.tempRectHoverClass = tempID;
                }
            } else {
                if (this.heatMap.cellSettings.enableCellHighlighting) {
                    let oldElement: HTMLElement;
                    if (this.heatMap.tempRectHoverClass) {
                        oldElement = document.getElementById(this.heatMap.tempRectHoverClass);
                    }
                    if (oldElement && !this.heatMap.rectSelected) {
                        oldElement.setAttribute('opacity', '1');
                        this.heatMap.tempRectHoverClass = '';
                    }
                }
            }
        }
    }

    /**
     * To get the value depends to format.
     *
     * @returns {string}
     * @private
     */

    public getFormatedText(val: number, getFormat: string): string {
        const format: string = getFormat;
        const isCustom: boolean = format.match('{value}') !== null;
        this.format = this.heatMap.intl.getNumberFormat({
            format: isCustom ? '' : format
        });
        let value: string = '';
        if (val.toString() !== '') {
            value = formatValue(isCustom, format, val, this.format);
        }
        return value;
    }

    /**
     * To get mouse hovered cell details.
     *
     * @returns {CurrentRect}
     * @private
     */

    public getCurrentRect(x: number, y: number): CurrentRect {
        let currentRect: CurrentRect;
        const firstRectDetails: CurrentRect[] = [];
        firstRectDetails.push(this.heatMap.heatMapSeries.rectPositionCollection[0][0]);
        let rectX: number = Math.ceil(
            (x - firstRectDetails[0].x) / firstRectDetails[0].width) <
            this.heatMap.axisCollections[0].axisLabelSize ?
            Math.ceil((
                x - firstRectDetails[0].x) / firstRectDetails[0].width) :
            this.heatMap.axisCollections[0].axisLabelSize;
        const rectY: number = Math.floor(
            ((y - firstRectDetails[0].y) / firstRectDetails[0].height)) <
            this.heatMap.axisCollections[1].axisLabelSize ?
            Math.floor(((y - firstRectDetails[0].y) / firstRectDetails[0].height)) :
            this.heatMap.axisCollections[1].axisLabelSize - 1;
        rectX = rectX === 0 ? 1 : rectX;
        // eslint-disable-next-line prefer-const
        currentRect = this.heatMap.heatMapSeries.rectPositionCollection[rectY][rectX - 1];
        this.hoverXAxisLabel = this.heatMap.axisCollections[0].tooltipLabels[rectX - 1];
        this.hoverXAxisValue = this.heatMap.axisCollections[0].labelValue[rectX - 1];
        this.hoverYAxisLabel = this.heatMap.axisCollections[1].tooltipLabels[(
            this.heatMap.axisCollections[1].tooltipLabels.length - 1) - rectY];
        this.hoverYAxisValue = this.heatMap.axisCollections[1].labelValue[(
            this.heatMap.axisCollections[1].labelValue.length - 1) - rectY];
        return currentRect;
    }
}
