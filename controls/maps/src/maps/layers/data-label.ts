/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Maps } from '../../index';
import {
    findMidPointOfPolygon, Rect, filter, getTemplateFunction, getZoomTranslate,
    getTranslate, RectOption, convertElementFromLabel, checkPropertyPath,
    Point, TextOption, renderTextElement, MapLocation, textTrim, Size, measureText, Internalize
} from '../utils/helper';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
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
     *
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public dataLabelCollections: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private value: any = { rightWidth: 0, leftWidth: 0, heightTop: 0, heightBottom: 0 };
    constructor(maps: Maps) {
        this.maps = maps;
        this.dataLabelCollections = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getDataLabel(dataSource: any[], labelPath: string, shapeName: string, shapeDataPath: string): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let text: any; let shapeNameValue : string;
        for (let i: number = 0; i < dataSource.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = dataSource[i];
            const dataShapePathValue : string = !isNullOrUndefined(data[shapeDataPath]) && isNaN(data[shapeDataPath]) ?
                data[shapeDataPath].toLowerCase() : data[shapeDataPath];
            shapeName = !isNullOrUndefined(shapeName) ? shapeName.toString() : shapeName;
            shapeNameValue = !isNullOrUndefined(shapeName) ? shapeName.toLowerCase() : shapeName;
            if ((dataShapePathValue) === shapeNameValue) {
                text = data;
                break;
            }
        }
        return text;
    }
    /**
     * To render label for maps
     *
     * @param {LayerSettings} layer - Specifies the layer settings
     * @param {number} layerIndex - Specifies the layer index.
     * @param {any} shape - Specifies the shape.
     * @param {any[]} layerData - Specifies the layer data.
     * @param {Element} group Specifies the element.
     * @param {HTMLElement} labelTemplateElement - Specifies the template element.
     * @param {number} index - Specifies the index number.
     * @param {any[]} intersect - Specifies the intersect.
     * @returns {void}
     */
    public renderLabel(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layer: LayerSettings, layerIndex: number, shape: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layerData: any[], group: Element, labelTemplateElement: HTMLElement, index: number, intersect: any[]
    ): void {
        const dataLabel: DataLabelSettingsModel = layer.dataLabelSettings;
        const style: FontModel = layer.dataLabelSettings.textStyle;
        let markerEle: Element;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let templateFn: any;
        let options: TextOption;
        const dataLabelSettings: DataLabelSettingsModel = layer.dataLabelSettings;
        const labelpath: string = layer.dataLabelSettings.labelPath;
        let shapePoint: [MapLocation[]] = [[]];
        let midIndex: number = 0;
        let pointsLength: number = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shapeData: any = shape;
        let element: Element;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any;
        let text: string = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let datasrcObj: any;
        let currentLength: number = 0; let oldIndex : number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let location: any;
        let sublayerIndexLabel : boolean = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shapeProperties: any = shape['properties'];
        const labelId: string = this.maps.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + index + '_LabelIndex_' + index;
        const textLocation: Point = new Point(0, 0);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shapes: any = layerData[index]; let locationX: any; let locationY: any;
        style.fontFamily = this.maps.theme.toLowerCase() !== 'material' ? this.maps.themeStyle.labelFontFamily : style.fontFamily;
        shape = shapes['property'];
        const properties: string[] = (Object.prototype.toString.call(layer.shapePropertyPath) === '[object Array]' ?
            layer.shapePropertyPath : [layer.shapePropertyPath]) as string[];
        let propertyPath: string; let isPoint : boolean = false;
        const animate: boolean = layer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const translate: any = (this.maps.isTileMap) ? new Object() : ((this.maps.zoomSettings.zoomFactor > 1 &&
            !isNullOrUndefined(this.maps.zoomModule)) ? getZoomTranslate(this.maps, layer, animate) :
            getTranslate(this.maps, layer, animate));
        const scale: number = (this.maps.isTileMap) ? this.maps.scale : translate['scale'];
        const transPoint: Point = (this.maps.isTileMap) ? this.maps.translatePoint : translate['location'] as Point;
        const zoomTransPoint : Point = this.maps.zoomTranslatePoint; let shapeWidth: number;
        const scaleZoomValue : number = !isNullOrUndefined(this.maps.scale)  ? Math.floor(this.maps.scale) : 1;
        const zoomLabelsPosition : boolean = this.maps.zoomSettings.enable ? !isNullOrUndefined(this.maps.zoomShapeCollection) &&
        this.maps.zoomShapeCollection.length > 0 && !this.maps.isAddLayer : this.maps.zoomSettings.enable; this.maps.translateType = 'labels';
        for (let j: number = 0; j < properties.length; j++) {
            if (shapeProperties[properties[j]]) {
                propertyPath = properties[j];
                datasrcObj = this.getDataLabel(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    layer.dataSource as any[], layer.shapeDataPath, shapeData['properties'][propertyPath], layer.shapeDataPath);
                if (datasrcObj) {
                    break;
                }
            }
        }
        datasrcObj = this.getDataLabel(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            layer.dataSource as any[], layer.shapeDataPath, shapeData['properties'][propertyPath], layer.shapeDataPath);
        if (!isNullOrUndefined(shapes['property'])) {
            shapePoint = [[]];
            if (!layerData[index]['_isMultiPolygon'] && layerData[index]['type'] !== 'Point' && layerData[index]['type'] !== 'MultiPoint') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                shapePoint.push(this.getPoint(layerData[index] as any[], []));
                currentLength = shapePoint[shapePoint.length - 1].length;
                if (pointsLength < currentLength) {
                    pointsLength = currentLength;
                    midIndex = shapePoint.length - 1;
                }
            } else if (layerData[index]['type'] !== 'Point' && layerData[index]['type'] !== 'MultiPoint') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const layer: any[] = <any[]>layerData[index];                
                for (let j: number = 0; j < layer.length; j++) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    shapePoint.push(this.getPoint(layer[j] as any[], []));
                    currentLength = shapePoint[shapePoint.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoint.length - 1;
                    }
                }
            }
        }
        text = (!isNullOrUndefined(datasrcObj)) ? !isNullOrUndefined(datasrcObj[labelpath]) ?
            datasrcObj[labelpath].toString() : datasrcObj[layer.shapeDataPath] : shapeData['properties'][labelpath];
        if ((Object.prototype.toString.call(layer.shapePropertyPath) === '[object Array]') &&
            (isNullOrUndefined(text) && layer.dataSource['length'] === 0)) {
            for (let l: number = 0; l < layer.shapePropertyPath.length; l++) {
                if (shapeData['properties'][layer.shapePropertyPath[l]]) {
                    text = shapeData['properties'][layer.shapePropertyPath[l]];
                    break;
                }
            }
        }
        if (isNullOrUndefined(text) && (layer.dataLabelSettings.template !== '' && layer.dataSource['length'] === 0)) {
            text = shapeData['properties'][layer.shapePropertyPath as string];
        }
        const dataLabelText : string = text;
        const projectionType : string = this.maps.projectionType;
        if (isPoint) {
            location = {
                x: shapePoint[midIndex][index]['x'], y: shapePoint[midIndex][index]['y'],
                rightMin: 0, rightMax: 0, leftMin: 0, leftMax: 0,
                points: shapePoint[midIndex][index], topMax: 0, topMin: 0,
                bottomMax: 0, bottomMin: 0, height: 0
            };
        } else {
            location = findMidPointOfPolygon(shapePoint[midIndex], projectionType, layer.geometryType);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const firstLevelMapLocation : any = location;
        if (!isNullOrUndefined(text) && !isNullOrUndefined(location)) {
            if (zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied && dataLabel.template === '') {
                if (layerIndex > 0){
                    for (let k : number = 0; k < this.maps.zoomLabelPositions.length; k++){
                        if (this.maps.zoomLabelPositions[k]['dataLabelText'] === text) {
                            oldIndex = index;
                            index = k;
                            sublayerIndexLabel = true;
                            break;
                        }
                    }
                }
                locationX = location['x'];
                locationY = location['y'];
                location['x'] = ((location['x'] + zoomTransPoint['x']) * scale);
                location['y'] = ((location['y'] + zoomTransPoint['y']) * scale);
            }
            location['y'] = (this.maps.projectionType === 'Mercator') || layer.geometryType === 'Normal' ? location['y'] : (-location['y']);
            data = location;
            if (!isNullOrUndefined(this.maps.format) && !isNaN(parseFloat(text))) {
                if (this.maps.useGroupingSeparator) {
                    text = Internalize(this.maps, parseFloat(text));
                    if (!isNullOrUndefined(datasrcObj)) {
                        datasrcObj[labelpath] = text;
                    }
                }
            }
            const eventargs: ILabelRenderingEventArgs = {
                name: dataLabelRendering, maps: this.maps, cancel: false, border: { color: dataLabel.border.color,
                    width: dataLabel.border.width, opacity: dataLabel.border.opacity }, datalabel: dataLabel,
                fill: dataLabel.fill, template: dataLabel.template, text: text
            };
            this.maps.trigger('dataLabelRendering', eventargs, (labelArgs: ILabelRenderingEventArgs) => {
                if (eventargs.cancel) {
                    return;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const border: any = { color: 'yellow' };
                let position: MapLocation[] = [];
                let width: number = zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied
                    && this.maps.zoomShapeCollection.length > index ? this.maps.zoomShapeCollection[index]['width'] :
                    (location['rightMax']['x'] - location['leftMax']['x']) * scale;
                if (!isNullOrUndefined(this.maps.dataLabelShape)){
                    shapeWidth = firstLevelMapLocation['rightMax']['x'] - firstLevelMapLocation['leftMax']['x'];
                    this.maps.dataLabelShape.push(shapeWidth);
                }
                if (eventargs.text !== text && !eventargs.cancel){
                    text = eventargs.text;
                }
                const textSize: Size = measureText(text, style);
                let trimmedLable: string = text;
                let elementSize: Size = textSize;
                const startY: number = location['y'] - textSize['height'] / 4;
                const endY: number = location['y'] + textSize['height'] / 4;
                const start: number = ((location['y'] + transPoint['y']) * scale) - textSize['height'] / 4;
                const end: number = ((location['y'] + transPoint['y']) * scale) + textSize['height'] / 4;
                position = filter(shapePoint[midIndex], startY, endY);
                if (!isPoint && position.length > 5 && (shapeData['geometry']['type'] !== 'MultiPolygon') &&
                    (shapeData['type'] !== 'MultiPolygon')) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const location1: any = findMidPointOfPolygon(position, projectionType, layer.geometryType);
                    if (zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied && eventargs.template === '') {
                        location1['x'] = ((this.maps.zoomLabelPositions[index]['location']['x'] + zoomTransPoint['x']) * scale);
                        location1['y'] = ((this.maps.zoomLabelPositions[index]['location']['y'] + zoomTransPoint['y']) * scale);
                    }
                    locationX = location1['x'];
                    location['x'] = location1['x'];
                    width = zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied
                        && this.maps.zoomShapeCollection.length > index ? this.maps.zoomShapeCollection[index]['width'] :
                        (location1['rightMax']['x'] - location1['leftMax']['x']) * scale;
                }
                const xpositionEnds: number = ((location['x'] + transPoint['x']) * scale) + textSize['width'] / 2;
                const xpositionStart: number = ((location['x'] + transPoint['x']) * scale) - textSize['width'] / 2;
                this.value[index] = { rightWidth: xpositionEnds, leftWidth: xpositionStart, heightTop: start, heightBottom: end };
                let labelElement: HTMLElement;
                if (eventargs.template !== '') {
                    templateFn = getTemplateFunction(eventargs.template, this.maps);
                    const templateElement: Element = templateFn ? templateFn(!isNullOrUndefined(datasrcObj) ?
                        datasrcObj : shapeData['properties'], this.maps, eventargs.template, this.maps.element.id + '_LabelTemplate', false) : document.createElement('div');
                    templateElement.innerHTML =  !templateFn ? eventargs.template : '';
                    labelElement = <HTMLElement>convertElementFromLabel(
                        templateElement, labelId, !isNullOrUndefined(datasrcObj) ? datasrcObj : shapeData['properties'], index, this.maps);
                    labelElement.style.left = ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - location['x'])) * scale) + 'px';
                    labelElement.style.top = ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - location['y'])) * scale) + 'px';
                    labelTemplateElement.appendChild(labelElement);
                } else {
                    if (dataLabelSettings.smartLabelMode === 'Trim') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const textType: any = typeof text === 'number' ? (text as any).toString() : text;
                        trimmedLable = textTrim(width, textType, style);
                        elementSize = measureText(trimmedLable, style);
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
                        for (let i: number = 0; i < intersect.length; i++) {
                            if (!isNullOrUndefined(intersect[i])) {
                                if (!(this.value[index]['leftWidth'] > intersect[i]['rightWidth']
                                    || this.value[index]['rightWidth'] < intersect[i]['leftWidth']
                                    || this.value[index]['heightTop'] > intersect[i]['heightBottom']
                                    || this.value[index]['heightBottom'] < intersect[i]['heightTop'])) {
                                    text = '';
                                    break;
                                }
                            }
                        }
                        intersect.push(this.value[index]);
                        options = new TextOption(labelId, textLocation.x, textLocation.y, 'middle', text, '', '');
                    }
                    let difference: number;
                    if (dataLabelSettings.intersectionAction === 'Trim') {
                        for (let j: number = 0; j < intersect.length; j++) {
                            if (!isNullOrUndefined(intersect[j])) {
                                if (intersect[j]['rightWidth'] < this.value[index]['leftWidth']
                                    || intersect[j]['leftWidth'] > this.value[index]['rightWidth']
                                    || intersect[j]['heightBottom'] < this.value[index]['heightTop']
                                    || intersect[j]['heightTop'] > this.value[index]['heightBottom']) {
                                    trimmedLable = text;
                                    difference = 0;
                                } else {
                                    if (this.value[index]['leftWidth'] > intersect[j]['leftWidth']) {
                                        width = intersect[j]['rightWidth'] - this.value[index]['leftWidth'];
                                        difference = width - (this.value[index]['rightWidth'] - this.value[index]['leftWidth']);
                                        trimmedLable = textTrim(difference, text, style);
                                        break;
                                    }
                                    if (this.value[index]['leftWidth'] < intersect[j]['leftWidth']) {
                                        width = this.value[index]['rightWidth'] - intersect[j]['leftWidth'];
                                        difference = Math.abs(width - (this.value[index]['rightWidth'] - this.value[index]['leftWidth']));
                                        trimmedLable = textTrim(difference, text, style);
                                        break;
                                    }
                                }
                            }
                        }
                        elementSize = measureText(trimmedLable, style);
                        intersect.push(this.value[index]);
                        options = new TextOption(labelId, textLocation.x, (textLocation.y), 'middle', trimmedLable, '', '');
                    }
                    if (dataLabelSettings.intersectionAction === 'None') {
                        options = new TextOption(labelId, (textLocation.x), (textLocation.y), 'middle', text, '', '');
                    }
                    if (trimmedLable.length > 1) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const border: any = eventargs.border;
                        if (border['width'] > 1) {
                            const fill: string = eventargs.fill;
                            const opacity: number = dataLabelSettings.opacity;
                            const rx: number = dataLabelSettings.rx;
                            const ry: number = dataLabelSettings.ry;
                            let x : number ; let y : number; const padding : number = 5;
                            if (zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied) {
                                x = ((location['x'] ) ) - textSize['width'] / 2;
                                y = ((location['y'] ) ) - textSize['height'] / 2 - padding;
                            } else {
                                x = ((location['x'] + transPoint['x']) * scale) - textSize['width'] / 2;
                                y = ((location['y'] + transPoint['y'] ) * scale) - textSize['height'] / 2;
                            }
                            border.opacity = isNullOrUndefined(border.opacity) ? opacity : border.opacity;
                            const rectOptions: RectOption = new RectOption(
                                this.maps.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + index + '_rectIndex_' + index,
                                fill, border, opacity, new Rect(x, y, textSize['width'], textSize['height']), rx, ry
                            );
                            const rect: Element = this.maps.renderer.drawRectangle(rectOptions) as SVGRectElement;
                            group.appendChild(rect);
                        }
                    }
                    element = renderTextElement(options, style, style.color || this.maps.themeStyle.dataLabelFontColor, group);
                    if (zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied){
                        element.setAttribute('transform', 'translate( ' + ((location['x'] ) ) + ' '
                      + (((location['y'] ) )  ) + ' )');
                        location['x'] = locationX;
                        location['y'] = locationY;
                    } else {
                        element.setAttribute('transform', 'translate( ' + ((location['x'] + transPoint.x) * scale) + ' '
                        + (((location['y'] + transPoint.y) * scale) + (elementSize.height / 4)) + ' )');
                    }
                    group.appendChild(element);
                }
                this.dataLabelCollections.push({
                    location: { x: location['x'], y: location['y'] },
                    element: isNullOrUndefined(labelElement) ? element : labelElement,
                    layerIndex: layerIndex,
                    shapeIndex: sublayerIndexLabel ? oldIndex : index,
                    labelIndex: sublayerIndexLabel ? oldIndex : index,
                    dataLabelText: dataLabelText
                });
                if (labelTemplateElement.childElementCount > 0 && !this.maps.element.contains(labelTemplateElement)) {
                    document.getElementById(this.maps.element.id + '_Secondary_Element').appendChild(labelTemplateElement);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (this.maps as any).renderReactTemplates();
                }
            });
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getPoint(shapes: any[], points: MapLocation[]): MapLocation[] {
        if (shapes['type'] === 'MultiLineString') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shapes.map((current: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                current.map((shape: any) => {
                    points.push(new Point(shape['point']['x'], shape['point']['y']));
                });
            });
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shapes.map((current: any, index: number) => {
                points.push(new Point(current['point']['x'], current['point']['y']));
            });
        }
        return points;
    }
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'DataLabel';
    }

    /**
     * To destroy the layers.
     *
     * @param {Maps} maps - Specifies the instance of the maps.
     * @returns {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
    }
}
