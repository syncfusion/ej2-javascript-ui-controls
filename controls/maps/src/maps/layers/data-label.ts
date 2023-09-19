import { Maps } from '../../index';
import {
    findMidPointOfPolygon, Rect, filter, getTemplateFunction, getZoomTranslate,
    getTranslate, RectOption, convertElementFromLabel,
    Point, TextOption, renderTextElement, MapLocation, textTrim, Size, measureText, Internalize
} from '../utils/helper';
import { isNullOrUndefined, AnimationOptions, Animation, animationMode } from '@syncfusion/ej2-base';
import { FontModel, DataLabelSettingsModel, ILabelRenderingEventArgs, LayerSettings } from '../index';
import { dataLabelRendering } from '../model/constants';
import { Theme } from '../model/theme';

/**
 * DataLabel Module used to render the maps datalabel
 */
export class DataLabel {
    private maps: Maps;
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
            const data: any = dataSource[i as number];
            const dataShapePathValue: string = !isNullOrUndefined(data[shapeDataPath as string]) && isNaN(data[shapeDataPath as string]) &&
                typeof data[shapeDataPath as string] === 'string' ? data[shapeDataPath as string].toLowerCase() : data[shapeDataPath as string];
            shapeName = !isNullOrUndefined(shapeName) && typeof shapeName === 'string' ? shapeName.toString() : shapeName;
            shapeNameValue = !isNullOrUndefined(shapeName) && typeof shapeName === 'string' ? shapeName.toLowerCase() : shapeName;
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
     * @private
     */
    public renderLabel(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layer: LayerSettings, layerIndex: number, shape: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layerData: any[], group: Element, labelTemplateElement: HTMLElement, index: number, intersect: any[]
    ): void {
        const dataLabel: DataLabelSettingsModel = layer.dataLabelSettings;
        const style: FontModel = layer.dataLabelSettings.textStyle;
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
        let rect: Element;
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
        const shapes: any = layerData[index as number]; let locationX: any; let locationY: any;
        style.fontFamily = this.maps.theme.toLowerCase() !== 'material' ? this.maps.themeStyle.labelFontFamily : style.fontFamily;
        style.fontWeight =   style.fontWeight || this.maps.themeStyle.fontWeight || Theme.dataLabelFont.fontWeight;
        shape = shapes['property'];
        const properties: string[] = (Object.prototype.toString.call(layer.shapePropertyPath) === '[object Array]' ?
            layer.shapePropertyPath : [layer.shapePropertyPath]) as string[];
        let propertyPath: string; const isPoint : boolean = false;
        const animate: boolean = (layer.animationDuration !== 0 || animationMode === 'Enable') || isNullOrUndefined(this.maps.zoomModule);
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
            if (shapeProperties[properties[j as number]]) {
                propertyPath = properties[j as number];
                datasrcObj = this.getDataLabel(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    layer.dataSource as any[], layer.shapeDataPath, shapeData['properties'][propertyPath as string], layer.shapeDataPath);
                if (datasrcObj) {
                    break;
                }
            }
        }
        datasrcObj = this.getDataLabel(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            layer.dataSource as any[], layer.shapeDataPath, shapeData['properties'][propertyPath as string], layer.shapeDataPath);
        if (!isNullOrUndefined(shapes['property'])) {
            shapePoint = [[]];
            if (!layerData[index as number]['_isMultiPolygon'] && layerData[index as number]['type'] !== 'Point' && layerData[index as number]['type'] !== 'MultiPoint') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                shapePoint.push(this.getPoint(layerData[index as number] as any[], []));
                currentLength = shapePoint[shapePoint.length - 1].length;
                if (pointsLength < currentLength) {
                    pointsLength = currentLength;
                    midIndex = shapePoint.length - 1;
                }
            } else if (layerData[index as number]['type'] !== 'Point' && layerData[index as number]['type'] !== 'MultiPoint') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const layer: any[] = <any[]>layerData[index as number];
                for (let j: number = 0; j < layer.length; j++) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    shapePoint.push(this.getPoint(layer[j as number] as any[], []));
                    currentLength = shapePoint[shapePoint.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoint.length - 1;
                    }
                }
            }
        }
        text = (!isNullOrUndefined(datasrcObj)) ? !isNullOrUndefined(datasrcObj[labelpath as string]) ?
            datasrcObj[labelpath as string].toString() : datasrcObj[layer.shapeDataPath] : shapeData['properties'][labelpath as string];
        if ((Object.prototype.toString.call(layer.shapePropertyPath) === '[object Array]') &&
            (isNullOrUndefined(text) && layer.dataSource['length'] === 0)) {
            for (let l: number = 0; l < layer.shapePropertyPath.length; l++) {
                if (shapeData['properties'][layer.shapePropertyPath[l as number]]) {
                    text = shapeData['properties'][layer.shapePropertyPath[l as number]];
                    break;
                }
            }
        }
        if (isNullOrUndefined(text) && (layer.dataLabelSettings.template !== '' && layer.dataSource['length'] === 0)) {
            text = shapeData['properties'][layer.shapePropertyPath as string];
        }
        if (isNullOrUndefined(text) && layer.dataSource['length'] > 0) {
            text = '';
        }
        const dataLabelText : string = text;
        const projectionType : string = this.maps.projectionType;
        if (isPoint) {
            location = {
                x: shapePoint[midIndex as number][index as number]['x'], y: shapePoint[midIndex as number][index as number]['y'],
                rightMin: 0, rightMax: 0, leftMin: 0, leftMax: 0,
                points: shapePoint[midIndex as number][index as number], topMax: 0, topMin: 0,
                bottomMax: 0, bottomMin: 0, height: 0
            };
        } else {
            location = findMidPointOfPolygon(shapePoint[midIndex as number], projectionType, layer.geometryType);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const firstLevelMapLocation : any = location;
        if (!isNullOrUndefined(text) && !isNullOrUndefined(location)) {
            if (zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied && dataLabel.template === '') {
                if (layerIndex > 0){
                    for (let k : number = 0; k < this.maps.zoomLabelPositions.length; k++){
                        if (this.maps.zoomLabelPositions[k as number]['dataLabelText'] === text) {
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
            if (!isNullOrUndefined(this.maps.format) && !isNaN(parseFloat(text))) {
                if (this.maps.useGroupingSeparator) {
                    text = Internalize(this.maps, parseFloat(text));
                    if (!isNullOrUndefined(datasrcObj)) {
                        datasrcObj[labelpath as string] = text;
                    }
                }
            }
            const eventargs: ILabelRenderingEventArgs = {
                name: dataLabelRendering, maps: this.maps, cancel: false, border: { color: dataLabel.border.color,
                    width: dataLabel.border.width, opacity: dataLabel.border.opacity }, datalabel: dataLabel,
                fill: dataLabel.fill, template: dataLabel.template, text: text, offsetX: 0, offsetY: 0
            };
            this.maps.trigger('dataLabelRendering', eventargs, (labelArgs: ILabelRenderingEventArgs) => {
                if (eventargs.cancel) {
                    return;
                }
                let position: MapLocation[] = [];
                let width: number = zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied
                    && this.maps.zoomShapeCollection.length > index ? (this.maps.dataLabelShape[index as number]) * scale :
                    (location['rightMax']['x'] - location['leftMax']['x']) * scale;
                if (!isNullOrUndefined(this.maps.dataLabelShape) && !this.maps.isReset){
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
                position = filter(shapePoint[midIndex as number], startY, endY);
                if (!isPoint && position.length > 5 && (shapeData['geometry']['type'] !== 'MultiPolygon') &&
                    (shapeData['type'] !== 'MultiPolygon')) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const location1: any = findMidPointOfPolygon(position, projectionType, layer.geometryType);
                    if (zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied && eventargs.template === '') {
                        location1['x'] = ((this.maps.zoomLabelPositions[index as number]['location']['x'] + zoomTransPoint['x']) * scale);
                        location1['y'] = ((this.maps.zoomLabelPositions[index as number]['location']['y'] + zoomTransPoint['y']) * scale);
                    }
                    locationX = location1['x'];
                    location['x'] = location1['x'];
                    width = zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied
                        && this.maps.zoomShapeCollection.length > index ? (this.maps.dataLabelShape[index as number]) * scale :
                        ((location1['rightMax']['x'] - location1['leftMax']['x']) * scale) > 0 ?
                        ((location1['rightMax']['x'] - location1['leftMax']['x']) * scale) : width;
                }
                const xpositionEnds: number = ((location['x'] + transPoint['x']) * scale) + textSize['width'] / 2;
                const xpositionStart: number = ((location['x'] + transPoint['x']) * scale) - textSize['width'] / 2;
                this.value[index as number] = { rightWidth: xpositionEnds, leftWidth: xpositionStart, heightTop: start, heightBottom: end };
                let labelElement: HTMLElement;
                if (eventargs.template !== '') {
                    templateFn = getTemplateFunction(eventargs.template, this.maps);
                    const templateElement: Element = templateFn ? templateFn(!isNullOrUndefined(datasrcObj) ?
                        datasrcObj : shapeData['properties'], this.maps, eventargs.template, this.maps.element.id + '_LabelTemplate', false) : document.createElement('div');
                    templateElement.innerHTML =  !templateFn ? eventargs.template as any : '';
                    labelElement = <HTMLElement>convertElementFromLabel(
                        templateElement, labelId, !isNullOrUndefined(datasrcObj) ? datasrcObj : shapeData['properties'], index, this.maps);
                    if (this.maps.isTileMap) {
                        labelElement.style.left = (((location['x'] + transPoint['x']) * scale) - (textSize['width'] / 2)) + 'px';
                        labelElement.style.top = (((location['y'] + transPoint['y']) * scale) - textSize['height']) + 'px';
                    } else {
                        labelElement.style.left = ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - location['x'])) * scale) + labelArgs.offsetX + 'px';
                        labelElement.style.top = ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - location['y'])) * scale) + labelArgs.offsetY + 'px';
                    }
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
                            if (!isNullOrUndefined(intersect[i as number])) {
                                if (!(this.value[index as number]['leftWidth'] > intersect[i as number]['rightWidth']
                                    || this.value[index as number]['rightWidth'] < intersect[i as number]['leftWidth']
                                    || this.value[index as number]['heightTop'] > intersect[i as number]['heightBottom']
                                    || this.value[index as number]['heightBottom'] < intersect[i as number]['heightTop'])) {
                                    text = '';
                                    break;
                                }
                            }
                        }
                        intersect.push(this.value[index as number]);
                        options = new TextOption(labelId, textLocation.x, textLocation.y, 'middle', text, '', '');
                    }
                    let difference: number;
                    if (dataLabelSettings.intersectionAction === 'Trim') {
                        for (let j: number = 0; j < intersect.length; j++) {
                            if (!isNullOrUndefined(intersect[j as number])) {
                                if (intersect[j as number]['rightWidth'] < this.value[index as number]['leftWidth']
                                    || intersect[j as number]['leftWidth'] > this.value[index as number]['rightWidth']
                                    || intersect[j as number]['heightBottom'] < this.value[index as number]['heightTop']
                                    || intersect[j as number]['heightTop'] > this.value[index as number]['heightBottom']) {
                                    trimmedLable = text;
                                    difference = 0;
                                } else {
                                    if (this.value[index as number]['leftWidth'] > intersect[j as number]['leftWidth']) {
                                        width = intersect[j as number]['rightWidth'] - this.value[index as number]['leftWidth'];
                                        difference = width - (this.value[index as number]['rightWidth'] - this.value[index as number]['leftWidth']);
                                        trimmedLable = textTrim(difference, text, style);
                                        break;
                                    }
                                    if (this.value[index as number]['leftWidth'] < intersect[j as number]['leftWidth']) {
                                        width = this.value[index as number]['rightWidth'] - intersect[j as number]['leftWidth'];
                                        difference = Math.abs(width - (this.value[index as number]['rightWidth'] - this.value[index as number]['leftWidth']));
                                        trimmedLable = textTrim(difference, text, style);
                                        break;
                                    }
                                }
                            }
                        }
                        elementSize = measureText(trimmedLable, style);
                        intersect.push(this.value[index as number]);
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
                                fill, border, opacity, new Rect((x + labelArgs.offsetX), (y + labelArgs.offsetY), textSize['width'], textSize['height']), rx, ry
                            );
                            rect = this.maps.renderer.drawRectangle(rectOptions) as SVGRectElement;
                            rect.setAttribute('visibility', layer.dataLabelSettings.animationDuration > 0 || animationMode === 'Enable' ? 'hidden' : 'visibile');
                            group.appendChild(rect);
                        }
                    }
                    element = renderTextElement(options, style, style.color || this.maps.themeStyle.dataLabelFontColor, group);
                    element.setAttribute('visibility', layer.dataLabelSettings.animationDuration > 0 || animationMode === 'Enable' ? 'hidden' : 'visibile');
                    if (zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied){
                        element.setAttribute('transform', 'translate( ' + ((location['x'] + labelArgs.offsetX) ) + ' '
                      + (((location['y'] + labelArgs.offsetY) )  ) + ' )');
                        location['x'] = locationX;
                        location['y'] = locationY;
                    } else {
                        element.setAttribute('transform', 'translate( ' + (((location['x'] + transPoint.x) * scale) + labelArgs.offsetX) + ' '
                        + ((((location['y'] + transPoint.y) * scale) + (elementSize.height / 4)) + labelArgs.offsetY) + ' )');
                    }
                    group.appendChild(element);
                }
                this.dataLabelCollections.push({
                    location: { x: location['x'] + labelArgs.offsetX, y: location['y'] + labelArgs.offsetY },
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
                if (layer.dataLabelSettings.animationDuration > 0 || animationMode === 'Enable') {
                    if (!isNullOrUndefined(element)) {
                        this.datalabelAnimate(element as HTMLElement, dataLabelSettings.animationDuration, style.opacity, false);
                        if (!isNullOrUndefined(rect)) {
                            this.datalabelAnimate(rect as HTMLElement, dataLabelSettings.animationDuration, dataLabelSettings.opacity, true);
                        }
                    }
                }
            });
        }
    }

    private datalabelAnimate(element: HTMLElement, duration: number, opacity: number, isRect: boolean): void {
        let height: number = 0;
        new Animation({}).animate(<HTMLElement>element, {
            duration: (duration === 0 && animationMode === 'Enable') ? 1000: duration,
            delay: 0,
            progress: (args: AnimationOptions) => {
                if (args.timeStamp > args.delay) {
                    height = ((args.timeStamp - args.delay) / args.duration);
                    element.setAttribute('style', 'user-select: none; visibility: visible;');
                    element.setAttribute(isRect ? 'fill-opacity' : 'opacity', (opacity * height).toString());
                }
            },
            end: (model: AnimationOptions) => {
                element.style.visibility = 'visible';
                element.setAttribute(isRect ? 'fill-opacity' : 'opacity', opacity.toString());
            }
        });
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
            shapes.map((current: any) => {
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
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.dataLabelCollections = [];
        this.value = null;
        this.maps = null;
    }
}
