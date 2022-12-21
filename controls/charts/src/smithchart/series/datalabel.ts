/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { createElement } from '@syncfusion/ej2-base';
import { Smithchart} from '../../smithchart';
import { SmithchartMarginModel, SmithchartFontModel} from '../../smithchart/utils/utils-model';
import { measureText } from '../../smithchart/utils/helper';
import {getTemplateFunction, convertElementFromLabel, PathOption } from '../../smithchart/utils/helper';
import { SeriesMarkerModel, SeriesMarkerDataLabelModel} from '../../smithchart/series/series-model';
import { SmithchartRect, SmithchartSize, Point, PointRegion, SmithchartLabelPosition } from  '../../smithchart/utils/utils';
import { DataLabelTextOptions, LabelOption } from  '../../smithchart/utils/utils';
import { SeriesMarkerDataLabelConnectorLineModel } from '../../smithchart/series/series-model';

export class DataLabel {

    public textOptions: DataLabelTextOptions[] = [];
    public labelOptions: LabelOption[] = [];
    private connectorFlag: boolean;
    private prevLabel: DataLabelTextOptions;
    private allPoints: DataLabelTextOptions[] = [];

    public drawDataLabel(smithchart: Smithchart, seriesindex: number,
                         groupElement: Element, pointsRegion: PointRegion[], bounds: SmithchartRect): void {

        this.textOptions = [];
        this.allPoints = [];
        const margin: SmithchartMarginModel = smithchart.margin;
        let pointIndex: number;
        const marker: SeriesMarkerModel = smithchart.series[seriesindex as number].marker;
        let region: Point;
        let labelPosition: SmithchartLabelPosition;
        let labelText: string;
        let textSize: SmithchartSize;
        const dataLabel: SeriesMarkerDataLabelModel = marker.dataLabel;
        const font: SmithchartFontModel = dataLabel.textStyle;
        const count: number = pointsRegion.length;
        for (let i: number = 0; i < count; i++) {

            labelText = smithchart.series[seriesindex as number].points[i as number].reactance.toString();
            textSize = measureText(labelText, font);
            region = pointsRegion[i as number]['point'];
            const xPos: number = region.x - textSize.width / 2;
            const yPos: number = region.y - (textSize.height + marker['height'] + (margin.top));
            const width: number = textSize.width + (margin.left / 2) + (margin.right / 2);
            const height: number = textSize.height + (margin.top / 2) + (margin.bottom / 2);
            pointIndex = i;
            labelPosition = new SmithchartLabelPosition();
            labelPosition = { textX: xPos + (margin.left / 2), textY: yPos + (height / 2) + margin.top / 2, x: xPos, y: yPos };
            this.textOptions[i as number] = {
                id: smithchart.element.id + '_Series' + seriesindex + '_Points' + pointIndex + '_dataLabel' + '_displayText' + i,
                x: labelPosition['textX'],
                y: labelPosition['textY'],
                fill: 'black',
                text: labelText,
                font: font,
                xPosition: xPos,
                yPosition: yPos,
                width: width,
                height: height,
                location: region,
                labelOptions: labelPosition,
                visible: true,
                connectorFlag: null
            };
        }
        const labelOption: LabelOption = new LabelOption();
        labelOption.textOptions = this.textOptions;
        this.labelOptions.push( labelOption);
        this.drawDatalabelSymbol(smithchart, seriesindex, dataLabel, groupElement, bounds, pointsRegion);
    }

    public calculateSmartLabels(points: object, seriesIndex: number): void {
        const length : number = points['textOptions'].length;
        const count: number = 0;

        for (let k: number = 0; k < length; k++) {
            this.allPoints[this.allPoints.length] = points['textOptions'][k as number];
            this.connectorFlag = false;
            this.compareDataLabels(k, points, count, seriesIndex);
            this.labelOptions[seriesIndex as number]['textOptions'][k as number] = points['textOptions'][k as number];
            this.labelOptions[seriesIndex as number]['textOptions'][k as number].connectorFlag = this.connectorFlag;
        }

    }
    private compareDataLabels(i: number, points: object, count: number, m: number): void {
        const length: number = this.allPoints.length;
        const padding: number = 10;
        let collide: boolean;
        let currentLabel: DataLabelTextOptions;
        let prevLabel: DataLabelTextOptions;
        for (let j: number = 0; j < length; j++) {
            prevLabel = this.allPoints[j as number];
            currentLabel = this.allPoints[length - 1];
            collide = this.isCollide(prevLabel, currentLabel);
            if (collide) {
                this.connectorFlag = true;
                switch (count) {
                case 0:
                    // Right
                    this.resetValues(currentLabel);
                    this.prevLabel = prevLabel;
                    currentLabel['xPosition'] = this.prevLabel['xPosition'] + (this.prevLabel['width'] / 2 +
                                                   currentLabel['width'] / 2 + padding);
                    currentLabel['x'] = currentLabel['xPosition'] + padding / 2;
                    count += 1;
                    this.compareDataLabels(i, points, count, m);
                    break;
                case 1:
                    // Right Bottom
                    this.resetValues(currentLabel);
                    currentLabel['xPosition'] = this.prevLabel['xPosition'] + this.prevLabel['width'] / 2 +
                                                   currentLabel['width'] / 2 + padding;
                    currentLabel['x'] = currentLabel['xPosition'] + padding / 2;
                    currentLabel['yPosition'] = currentLabel['location'].y + currentLabel['height'] / 2 + padding / 2;
                    currentLabel['y'] = currentLabel['yPosition'] + ((currentLabel['height'] / 2)) + padding / 2;
                    count += 1;
                    this.compareDataLabels(i, points, count, m);
                    break;
                case 2:
                    // Bottom
                    this.resetValues(currentLabel);
                    currentLabel['yPosition'] = currentLabel['location'].y + currentLabel['height'] / 2 + padding / 2;
                    currentLabel['y'] = currentLabel['yPosition'] + (currentLabel['height'] / 2) + padding / 2;
                    count += 1;
                    this.compareDataLabels(i, points, count, m);
                    break;
                case 3:
                    // Left Bottom
                    this.resetValues(currentLabel);
                    currentLabel['xPosition'] = this.prevLabel['xPosition'] - this.prevLabel['width'] / 2
                                                   - currentLabel['width'] / 2 - padding;
                    currentLabel['x'] = currentLabel['xPosition'] + padding / 2;
                    currentLabel['yPosition'] = currentLabel['height'] / 2 + currentLabel['location'].y + padding / 2;
                    currentLabel['y'] = currentLabel['yPosition'] + ((currentLabel['height'] / 2)) + padding / 2;
                    count += 1;
                    this.compareDataLabels(i, points, count, m);
                    break;
                case 4:
                    // Left
                    this.resetValues(currentLabel);
                    currentLabel['xPosition'] = (this.prevLabel['xPosition'] - this.prevLabel['width'] / 2 -
                                                   currentLabel['width'] / 2 - padding);
                    currentLabel['x'] = currentLabel['xPosition'] + padding / 2;
                    count += 1;
                    this.compareDataLabels(i, points, count, m);
                    break;
                case 5:
                    //Left Top
                    this.resetValues(currentLabel);
                    currentLabel['xPosition'] = this.prevLabel['xPosition'] - this.prevLabel['width'] / 2 -
                                                   currentLabel['width'] / 2 - padding;
                    currentLabel['x'] = currentLabel['xPosition'] + padding / 2;
                    currentLabel['yPosition'] = this.prevLabel['yPosition'] - currentLabel['height'] - padding;
                    currentLabel['y'] = currentLabel['yPosition'] + currentLabel['height'] / 2 + padding / 2;
                    count += 1;
                    this.compareDataLabels(i, points, count, m);
                    break;
                case 6:
                    // Top
                    this.resetValues(currentLabel);
                    currentLabel['yPosition'] = (this.prevLabel['yPosition']) - (currentLabel['height'] + padding);
                    currentLabel['y'] = currentLabel['yPosition'] + (currentLabel['height'] / 2) + padding / 2;
                    count += 1;
                    this.compareDataLabels(i, points, count, m);
                    break;
                case 7:
                    // Right Top
                    this.resetValues(currentLabel);
                    currentLabel['xPosition'] = this.prevLabel['xPosition'] + this.prevLabel['width'] / 2 +
                                                   currentLabel['width'] / 2 + padding;
                    currentLabel['x'] = currentLabel['xPosition'] + padding / 2;
                    currentLabel['yPosition'] = this.prevLabel['yPosition'] - currentLabel['height'] - padding;
                    currentLabel['y'] = currentLabel['yPosition'] + (currentLabel['height'] / 2) + padding / 2;
                    count += 1;
                    this.compareDataLabels(i, points, count, m);
                    break;
                case 8:
                    count = 0;
                    this.compareDataLabels(i, points, count, m);
                    break;
                }
            }
        }

    }

    private isCollide(dataLabel1: DataLabelTextOptions, dataLabel2: DataLabelTextOptions): boolean {
        let state: boolean = false;
        if (dataLabel1 !== dataLabel2) {
            state = !(                    // to compare data labels
                ((dataLabel1['y'] + dataLabel1['height']) < (dataLabel2['y'])) ||
                (dataLabel1['y'] > (dataLabel2['y'] + dataLabel2['height'])) ||
                ((dataLabel1['x'] + dataLabel1['width'] / 2) < dataLabel2['x'] - dataLabel2['width'] / 2) ||
                (dataLabel1['x'] - dataLabel1['width'] / 2 > (dataLabel2['x'] + dataLabel2['width'] / 2)));
        }
        return state;
    }
    private resetValues(currentPoint: DataLabelTextOptions): void {
        currentPoint['xPosition'] = currentPoint['labelOptions']['x'];
        currentPoint['yPosition'] = currentPoint['labelOptions']['y'];
        currentPoint['x'] = currentPoint['labelOptions']['textX'];
        currentPoint['y'] = currentPoint['labelOptions']['textY'];
    }

    public drawConnectorLines(smithchart: Smithchart, seriesIndex: number, index: number,
                              currentPoint: DataLabelTextOptions, groupElement: Element): void {

        const location: Point = currentPoint['location'];
        let endY: number;
        if (location.y > currentPoint['y']) {
            endY = (currentPoint['y']);
        } else {
            endY = (currentPoint['y'] - currentPoint['height'] / 2);  // bottom
        }
        const connectorDirection: string = 'M' + ' ' + (location.x) + ' ' + (location.y) + ' ' + 'L' + ' ' +
                                             (currentPoint['x']) + ' ' + (endY);
        const connectorLineValues: SeriesMarkerDataLabelConnectorLineModel = smithchart.series[seriesIndex as number].
            marker.dataLabel.connectorLine;
        const stroke : string = connectorLineValues.color ? connectorLineValues.color :
            (smithchart.series[seriesIndex as number].fill ||
                                                      smithchart.seriesColors[seriesIndex % smithchart.seriesColors.length]);
        const options: PathOption = new PathOption(
            smithchart.element.id + '_dataLabelConnectorLine' + '_series' + seriesIndex + '_point' + index,
            'none',
            connectorLineValues.width,
            stroke,
            1,
            'none',
            connectorDirection
        );
        const element: Element = smithchart.renderer.drawPath(options);
        groupElement.appendChild(element);

    }
    private drawDatalabelSymbol(smithchart: Smithchart, seriesindex : number, dataLabel: SeriesMarkerDataLabelModel,
                                groupElement: Element, bounds: SmithchartRect, pointsRegion: PointRegion[]): void {

        for (let i: number = 0; i < smithchart.series[seriesindex as number].points.length; i++) {
            if (dataLabel.template) {
                const labelTemplateElement: HTMLElement = createElement('div', {
                    id: smithchart.element.id + '_seriesIndex_' + seriesindex + '_Label_Template_Group',
                    className: 'template',
                    styles: 'position: absolute;'
                    /* 'top:' + bounds['x'] + 'px;' +
                'left:' + bounds['y'] + 'px;' +
                'height:' + smithchart.availableSize.height + 'px;' +
                'width:' + smithchart.availableSize.width + 'px;'*/
                });
                document.getElementById(smithchart.element.id + '_Secondary_Element').appendChild(labelTemplateElement);
                const id: string = dataLabel.template + '_seriesIndex' + seriesindex + '_pointIndex' + i + smithchart.element.id;
                const data: object = {point: smithchart.series[seriesindex as number].points[i as number].reactance};
                const templateFn: Function = getTemplateFunction(dataLabel.template);
                const templateElement: Element = templateFn(smithchart);
                const labelElement: HTMLElement = <HTMLElement>convertElementFromLabel(
                    templateElement, id, data);
                labelTemplateElement.appendChild(labelElement);
                labelElement.style.left = pointsRegion[i as number].point.x - labelElement.offsetWidth / 2 + 'px';
                labelElement.style.top =  pointsRegion[i as number].point.y - labelElement.offsetHeight -
                                          smithchart.series[seriesindex as number].marker.height / 2 + 'px';
                const left: number = parseInt(labelElement.style.left, 10);
                const top: number = parseInt(labelElement.style.top, 10);
                const width: number = labelElement.offsetWidth;
                const height: number = labelElement.offsetHeight;
                const region: Point = pointsRegion[i as number]['point'];
                const labelPosition: SmithchartLabelPosition = { textX: left, textY: top,
                    x: left, y: top};
                this.labelOptions[seriesindex as number]['textOptions'][i as number] = {
                    id: id,
                    x: left,
                    y: top,
                    fill: 'black',
                    text: '',
                    font: dataLabel.textStyle,
                    xPosition: left,
                    yPosition: top,
                    width: width,
                    height: height,
                    location: region,
                    labelOptions: labelPosition,
                    visible: true,
                    connectorFlag: null
                };
            }
        }
    }
}
