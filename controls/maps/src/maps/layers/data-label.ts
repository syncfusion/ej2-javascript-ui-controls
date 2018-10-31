import { Maps } from '../../index';
import {
    findMidPointOfPolygon, Rect, filter, getTemplateFunction,
    getTranslate, RectOption, convertElementFromLabel,
    Point, TextOption, renderTextElement, MapLocation, textTrim, Size, measureText, Internalize
} from '../utils/helper';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { FontModel, DataLabelSettingsModel, ILabelRenderingEventArgs, LayerSettings } from '../index';
import { dataLabelRendering } from '../model/constants';

/**
 * DataLabel Module used to render the maps datalabel
 */
export class DataLabel {
    private maps: Maps;
    private dataLabelObject: Element;
    /**
     * Datalabel collections
     * @private
     */
    public dataLabelCollections: Object[];
    private intersect: object[] = [];
    private value: object = { rightWidth: 0, leftWidth: 0, heightTop: 0, heightBottom: 0 };
    constructor(maps: Maps) {
        this.maps = maps;
        this.dataLabelCollections = [];
    }
    //tslint:disable:max-func-body-length
    private getDataLabel(dataSource: object[], labelPath: string, shapeName: string, shapeDataPath: string): object {
        let text: object;
        for (let i: number = 0; i < dataSource.length; i++) {
            let data: object = dataSource[i];
            if ((data[shapeDataPath]) === shapeName) {
                text = data;
                break;
            }
        }
        return text;
    }
    /**
     * To render label for maps
     * @param layer 
     * @param layerIndex 
     * @param shape 
     * @param layerData 
     * @param group 
     * @param labelTemplateElement 
     * @param index 
     */
    public renderLabel(
        layer: LayerSettings, layerIndex: number, shape: object,
        layerData: object[], group: Element, labelTemplateElement: HTMLElement, index: number
    ): void {
        let dataLabel: DataLabelSettingsModel = layer.dataLabelSettings;
        let style: FontModel = layer.dataLabelSettings.textStyle;
        let markerEle: Element;
        let templateFn: Function;
        let options: TextOption;
        let dataLabelSettings: DataLabelSettingsModel = layer.dataLabelSettings;
        let labelpath: string = layer.dataLabelSettings.labelPath;
        let shapePoint: [MapLocation[]] = [[]];
        let midIndex: number = 0;
        let pointsLength: number = 0;
        let shapeData: object = shape;
        let element: Element;
        let data: object;
        let text: string = '';
        let datasrcObj: object;
        let currentLength: number = 0;
        let location: object;
        let labelId: string = this.maps.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + index + '_LabelIndex_' + index;
        let textLocation: Point = new Point(0, 0);
        /* tslint:disable:no-string-literal */
        for (let i: number = 0, len: number = layerData.length; i < len; i++) {
            let shapes: object = layerData[i];
            shape = shapes['property'];
            if (!isNullOrUndefined(shapes['property']) &&
            (shapeData['properties'][layer.shapePropertyPath] === shape[layer.shapePropertyPath])) {
                if (!layerData[i]['_isMultiPolygon']) {
                    shapePoint.push(this.getPoint(layerData[i] as object[], []));
                    currentLength = shapePoint[shapePoint.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoint.length - 1;
                    }
                } else {
                    let layer: Object[] = <Object[]>layerData[i];
                    for (let j: number = 0; j < layer.length; j++) {
                        shapePoint.push(this.getPoint(layer[j] as Object[], []));
                        currentLength = shapePoint[shapePoint.length - 1].length;
                        if (pointsLength < currentLength) {
                            pointsLength = currentLength;
                            midIndex = shapePoint.length - 1;
                        }
                    }
                }
            }
        }
        if (!isNullOrUndefined(layer.dataSource) && (<Object[]>layer.dataSource).length > 0) {
            let localData: object[] = <object[]>extend([], layer.dataSource, null, true);
            datasrcObj = this.getDataLabel(
                localData, labelpath, shapeData['properties'][layer.shapePropertyPath], layer.shapeDataPath);
            if (isNullOrUndefined(datasrcObj) || isNullOrUndefined(datasrcObj[labelpath])) {
                text = undefined;
            } else {
                datasrcObj[labelpath] = datasrcObj[labelpath];
                text = datasrcObj[labelpath].toString();
            }
        } else {
            text = shapeData['properties'][labelpath] ? shapeData['properties'][labelpath].toString() : undefined;
        }
        location = findMidPointOfPolygon(shapePoint[midIndex]);
        if (!isNullOrUndefined(text) && !isNullOrUndefined(location)) {
            location['y'] = (this.maps.projectionType === 'Mercator') ? location['y'] : (-location['y']);
            data = location;
            if (!isNullOrUndefined(this.maps.format) && !isNaN(parseFloat(text))) {
                text = Internalize(this.maps, parseFloat(text));
                if (!isNullOrUndefined(datasrcObj)) {
                    datasrcObj[labelpath] = text;
                }
            }
            let eventargs: ILabelRenderingEventArgs = {
                name: dataLabelRendering, maps: this.maps, cancel: false, border: dataLabel.border, datalabel: dataLabel,
                fill: dataLabel.fill, template: dataLabel.template, text: text
            };
            this.maps.trigger(dataLabelRendering, eventargs);
            let border: Object = { color: 'yellow' };
            let position: MapLocation[] = [];
            let width: number = location['rightMax']['x'] - location['leftMax']['x'];
            let textSize: Size = measureText(text, style);
            let trimmedLable: string = textTrim(width, text, style);
            let elementSize: Size = measureText(trimmedLable, style);
            let startY: number = location['y'] - textSize['height'] / 4;
            let endY: number = location['y'] + textSize['height'] / 4;
            let start: number = location['y'] - textSize['height'] / 4;
            let end: number = location['y'] + textSize['height'] / 4;
            position = filter(shapePoint[midIndex], startY, endY);
            if (position.length > 5 && (!isNullOrUndefined(shapeData['geometry']) ? shapeData['geometry']['type'] !== 'MultiPolygon' :
                shapeData['type'] !== 'MultiPolygon')) {
                let location1: object = findMidPointOfPolygon(position);
                location['x'] = location1['x'];
                width = location1['rightMax']['x'] - location1['leftMax']['x'];
            }
            let xpositionEnds: number = location['x'] + textSize['width'] / 2;
            let xpositionStart: number = location['x'] - textSize['width'] / 2;
            trimmedLable = textTrim(width, text, style);
            elementSize = measureText(trimmedLable, style);
            this.value[index] = { rightWidth: xpositionEnds, leftWidth: xpositionStart, heightTop: start, heightBottom: end };
            let animate: boolean = layer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
            let translate: Object = getTranslate(this.maps, layer, animate);
            let scale: number = translate['scale'];
            let transPoint: Point = translate['location'] as Point;
            let labelElement: HTMLElement;
            if (eventargs.template !== '') {
                templateFn = getTemplateFunction(eventargs.template);
                let templateElement: Element = templateFn(this.maps);
                labelElement = <HTMLElement>convertElementFromLabel(
                    templateElement, labelId, !isNullOrUndefined(datasrcObj) ? datasrcObj : shapeData['properties'], index, this.maps);
                labelElement.style.left = ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - location['x'])) * scale) + 'px';
                labelElement.style.top = ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - location['y'])) * scale) + 'px';
                labelTemplateElement.appendChild(labelElement);
                let labelWidth: number = labelElement.offsetWidth;
                let labelHeight: number = labelElement.offsetHeight;
                // if (labelWidth > width || labelWidth === 0 || labelHeight > location['height']) {
                //     labelElement.style.display = 'None';
                // }
            } else {
                if (dataLabelSettings.smartLabelMode === 'Trim') {
                    options = new TextOption(labelId, textLocation.x, textLocation.y, 'middle', trimmedLable, '', '');
                }
                if (dataLabelSettings.smartLabelMode === 'None') {
                    options = new TextOption(labelId, (textLocation.x), textLocation.y, 'middle', text, '', '');
                }
                if (dataLabelSettings.smartLabelMode === 'Hide') {
                    text = (width >= textSize['width']) ? text : '';
                    options = new TextOption(labelId, (textLocation.x), (textLocation.y), 'middle', text, '', '');
                }
                text = options['text'] as string;
                if (dataLabelSettings.intersectionAction === 'Hide') {
                    for (let i: number = 0; i < this.intersect.length; i++) {
                        if (!isNullOrUndefined(this.intersect[i])) {
                            if (this.value[index]['leftWidth'] > this.intersect[i]['rightWidth']
                                || this.value[index]['rightWidth'] < this.intersect[i]['leftWidth']
                                || this.value[index]['heightTop'] > this.intersect[i]['heightBottom']
                                || this.value[index]['heightBottom'] < this.intersect[i]['heightTop']) {
                                text = text;
                            } else {
                                text = '';
                                break;
                            }
                        }
                    }
                    this.intersect.push(this.value[index]);
                    options = new TextOption(labelId, textLocation.x, textLocation.y, 'middle', text, '', '');
                }
                let difference: number;
                if (dataLabelSettings.intersectionAction === 'Trim') {
                    for (let j: number = 0; j < this.intersect.length; j++) {
                        if (!isNullOrUndefined(this.intersect[j])) {
                            if (this.intersect[j]['rightWidth'] < this.value[index]['leftWidth']
                                || this.intersect[j]['leftWidth'] > this.value[index]['rightWidth']
                                || this.intersect[j]['heightBottom'] < this.value[index]['heightTop']
                                || this.intersect[j]['heightTop'] > this.value[index]['heightBottom']) {
                                trimmedLable = text;
                                difference = 0;
                            } else {
                                if (this.value[index]['leftWidth'] > this.intersect[j]['leftWidth']) {
                                    width = this.intersect[j]['rightWidth'] - this.value[index]['leftWidth'];
                                    difference = width - (this.value[index]['rightWidth'] - this.value[index]['leftWidth']);
                                    trimmedLable = textTrim(difference, text, style);
                                    break;
                                }
                                if (this.value[index]['leftWidth'] < this.intersect[j]['leftWidth']) {
                                    width = this.value[index]['rightWidth'] - this.intersect[j]['leftWidth'];
                                    difference = Math.abs(width - (this.value[index]['rightWidth'] - this.value[index]['leftWidth']));
                                    trimmedLable = textTrim(difference, text, style);
                                    break;
                                }
                            }
                        }
                    }
                    this.intersect.push(this.value[index]);
                    options = new TextOption(labelId, textLocation.x, (textLocation.y), 'middle', trimmedLable, '', '');
                }
                if (dataLabelSettings.intersectionAction === 'None') {
                    options = new TextOption(labelId, (textLocation.x), (textLocation.y), 'middle', text, '', '');
                }
                if (trimmedLable.length > 1) {
                    let border: object = eventargs.border;
                    if (border['width'] > 1) {
                        let fill: string = eventargs.fill;
                        let opacity: number = dataLabelSettings.opacity;
                        let rx: number = dataLabelSettings.rx;
                        let ry: number = dataLabelSettings.ry;
                        let x: number = location['x'] - textSize['width'] / 2;
                        let y: number = location['y'] - textSize['height'] / 2;
                        let rectOptions: RectOption = new RectOption(
                            this.maps.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + index + '_rectIndex_' + index,
                            fill, border, opacity, new Rect(x, y, textSize['width'], textSize['height']), rx, ry
                        );
                        let rect: Element = this.maps.renderer.drawRectangle(rectOptions) as SVGRectElement;
                        group.appendChild(rect);
                    }
                }
                element = renderTextElement(options, style, style.color, group);
                element.setAttribute('transform', 'translate( ' + ((location['x'] + transPoint.x) * scale) + ' '
                    + (((location['y'] + transPoint.y) * scale) + (elementSize.height / 4)) + ' )');
                group.appendChild(element);
            }
            this.dataLabelCollections.push({
                location: { x: location['x'], y: (location['y'] + elementSize.height / 4) },
                element: isNullOrUndefined(labelElement) ? element : labelElement,
                layerIndex: layerIndex,
                shapeIndex: index,
                labelIndex: index
            });
            if (labelTemplateElement.childElementCount > 0 && !this.maps.element.contains(labelTemplateElement)) {
                document.getElementById(this.maps.element.id + '_Secondary_Element').appendChild(labelTemplateElement);
            }
        }
    }
    private getPoint(shapes: object[], points: MapLocation[]): MapLocation[] {
        shapes.map((current: object, index: number) => {
            points.push(new Point(current['point']['x'], current['point']['y']));
        });
        return points;
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'DataLabel';
    }

    /**
     * To destroy the layers. 
     * @return {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
    }

}
