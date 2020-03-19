import { Maps } from '../../index';
import { BubbleSettingsModel, ColorMapping, IBubbleRenderingEventArgs, bubbleRendering } from '../index';
import { IBubbleClickEventArgs, bubbleClick, LayerSettings, IBubbleMoveEventArgs, bubbleMouseMove } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { CircleOption, MapLocation, findMidPointOfPolygon, Point, drawCircle, elementAnimate, getTranslate } from '../utils/helper';
import { RectOption, Rect, drawRectangle, checkPropertyPath, getZoomTranslate, getRatioOfBubble, maintainSelection,
    getValueFromObject } from '../utils/helper';

/**
 * Bubble module class
 */
export class Bubble {
    private maps: Maps;
    public bubbleCollection: Object[];
    /**
     * Bubble Id for current layer
     */
    public id: string = '';
    constructor(maps: Maps) {
        this.maps = maps;
        this.bubbleCollection = [];
    }
    /**
     * To render bubble
     */
    /* tslint:disable:no-string-literal */
    /* tslint:disable-next-line:max-func-body-length */
    public renderBubble(
        bubbleSettings: BubbleSettingsModel, shapeData: object, color: string, range: { min: number, max: number },
        bubbleIndex: number, dataIndex: number, layerIndex: number, layer: LayerSettings, group: Element, bubbleID? : string
    ): void {
        let layerData: object[] = layer.layerData; let colorValuePath: string = bubbleSettings.colorValuePath;
        let equalValue: string = (!isNullOrUndefined(colorValuePath)) ? ((colorValuePath.indexOf('.') > -1) ?
            (getValueFromObject(shapeData, bubbleSettings.colorValuePath)) : shapeData[colorValuePath]) : shapeData[colorValuePath];
        let colorValue: number = (!isNullOrUndefined(colorValuePath)) ? ((colorValuePath.indexOf('.') > -1) ?
            Number(getValueFromObject(shapeData, bubbleSettings.colorValuePath)) : Number(shapeData[colorValuePath])) :
            Number(shapeData[colorValuePath]);
        let bubbleValue: number = (!isNullOrUndefined(bubbleSettings.valuePath)) ? ((bubbleSettings.valuePath.indexOf('.') > -1) ?
            Number(getValueFromObject(shapeData, bubbleSettings.valuePath)) : Number(shapeData[bubbleSettings.valuePath])) :
            Number(shapeData[bubbleSettings.valuePath]);
        let opacity: number; let bubbleColor: string;
        if (isNaN(bubbleValue) && isNaN(colorValue) && isNullOrUndefined(equalValue)) {
            return null;
        }
        let radius: number = getRatioOfBubble(bubbleSettings.minRadius, bubbleSettings.maxRadius, bubbleValue, range.min, range.max);
        let colorMapping: ColorMapping = new ColorMapping(this.maps);
        let shapeColor: Object = colorMapping.getColorByValue(bubbleSettings.colorMapping, colorValue, equalValue);
        bubbleColor = (Object.prototype.toString.call(shapeColor) === '[object Object]' &&
            !isNullOrUndefined(shapeColor['fill'])) ? shapeColor['fill'] : color;
        opacity = (Object.prototype.toString.call(shapeColor) === '[object Object]' &&
            !isNullOrUndefined(shapeColor['opacity'])) ? shapeColor['opacity'] : bubbleSettings.opacity;
        let shapePoints: [MapLocation[]] = [[]]; this.maps.translateType = 'bubble';
        let midIndex: number = 0; let pointsLength: number = 0; let currentLength: number = 0;
        for (let i: number = 0, len: number = layerData.length; i < len; i++) {
            let shape: object = layerData[i];
            shape = shape['property'];
            let shapePath: string = checkPropertyPath(shapeData[layer.shapeDataPath], layer.shapePropertyPath, shape);
            if (shapeData[layer.shapeDataPath] === shape[shapePath]) {
                if (layerData[i]['type'] === 'Point') {
                    shapePoints.push(this.getPoints(<Object[]>layerData[i], []));
                } else if (!layerData[i]['_isMultiPolygon']) {
                    shapePoints.push(this.getPoints(layerData[i] as object[], []));
                    currentLength = shapePoints[shapePoints.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoints.length - 1;
                    }

                } else {
                    let layer: Object[] = <Object[]>layerData[i];
                    for (let j: number = 0; j < layer.length; j++) {
                        shapePoints.push(this.getPoints(layer[j] as Object[], []));
                        currentLength = shapePoints[shapePoints.length - 1].length;
                        if (pointsLength < currentLength) {
                            pointsLength = currentLength;
                            midIndex = shapePoints.length - 1;
                        }
                    }
                }
            }
        }
        let projectionType: string = this.maps.projectionType;
        let centerY: number; let eventArgs: IBubbleRenderingEventArgs;
        let center: object = findMidPointOfPolygon(shapePoints[midIndex], projectionType);
        if (bubbleSettings.visible) {
            if (!isNullOrUndefined(center)) {
                centerY = this.maps.projectionType === 'Mercator' ? center['y'] : (-center['y']);
                eventArgs = {
                    cancel: false, name: bubbleRendering, border: bubbleSettings.border,
                    cx: center['x'], cy: centerY, data: shapeData, fill: bubbleColor,
                    maps: this.maps.isBlazor ? null : this.maps, radius: radius
                };
            } else {
                let shapePointsLength: number = shapePoints.length - 1;
                if (shapePoints[shapePointsLength]['x'] && shapePoints[shapePointsLength]['y']) {
                    eventArgs = {
                        cancel: false, name: bubbleRendering, border: bubbleSettings.border,
                        cx: shapePoints[shapePointsLength]['x'], cy: shapePoints[shapePointsLength]['y'],
                        data: shapeData, fill: bubbleColor, maps: this.maps.isBlazor ? null : this.maps,
                        radius: radius
                    };
                } else {
                    return;
                }
                if (this.maps.isBlazor) {
                    const { maps, ...blazorEventArgs }: IBubbleRenderingEventArgs = eventArgs;
                    eventArgs = blazorEventArgs;
                }
            }
            this.maps.trigger('bubbleRendering', eventArgs, (bubbleArgs: IBubbleRenderingEventArgs) => {
                if (eventArgs.cancel) {
                    return;
                }
                let bubbleElement: Element;
                if (bubbleSettings.bubbleType === 'Circle') {
                    let circle: CircleOption = new CircleOption(
                        bubbleID, eventArgs.fill, eventArgs.border, opacity,
                        0, 0, eventArgs.radius, null
                    );
                    bubbleElement = drawCircle(this.maps, circle, group);
                } else {
                    let y: number = this.maps.projectionType === 'Mercator' ? (eventArgs.cy - radius) : (eventArgs.cy + radius);
                    let rectangle: RectOption = new RectOption(
                        bubbleID, eventArgs.fill, eventArgs.border, opacity,
                        new Rect(0, 0, radius * 2, radius * 2), 2, 2
                    );
                    eventArgs.cx -= radius; eventArgs.cy = y;
                    bubbleElement = drawRectangle(this.maps, rectangle, group);
                }
                maintainSelection(this.maps.selectedBubbleElementId, this.maps.bubbleSelectionClass, bubbleElement,
                                  'BubbleselectionMapStyle');
                this.bubbleCollection.push({
                    LayerIndex: layerIndex,
                    BubbleIndex: bubbleIndex,
                    DataIndex: dataIndex,
                    element: bubbleElement,
                    center: { x: eventArgs.cx, y: eventArgs.cy }
                });
                let translate: Object;
                let animate: boolean = layer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
                if (this.maps.zoomSettings.zoomFactor > 1 && !isNullOrUndefined(this.maps.zoomModule)) {
                    translate = getZoomTranslate(this.maps, layer, animate);
                } else {
                    translate = getTranslate(this.maps, layer, animate);
                }
                let scale: number = translate['scale']; let transPoint: Point = translate['location'] as Point;
                let position: MapLocation = new MapLocation(
                    (this.maps.isTileMap ? (eventArgs.cx) : ((eventArgs.cx + transPoint.x) * scale)),
                    (this.maps.isTileMap ? (eventArgs.cy) : ((eventArgs.cy + transPoint.y) * scale)));
                bubbleElement.setAttribute('transform', 'translate( ' + (position.x) + ' ' + (position.y) + ' )');
                let bubble: string = (bubbleSettings.dataSource.length - 1) === dataIndex ? 'bubble' : null;
                if (bubbleSettings.bubbleType === 'Square') {
                    position.x += radius;
                    position.y += radius * (this.maps.projectionType === 'Mercator' ? 1 : -1);
                } else {
                    radius = 0;
                }
                if (bubbleSettings.animationDuration > 0) {
                    elementAnimate(
                        bubbleElement, bubbleSettings.animationDelay, bubbleSettings.animationDuration, position, this.maps, bubble, radius
                    );
                }
            });
        }
    }
    private getPoints(shape: object[], points: MapLocation[]): MapLocation[] {
        if (isNullOrUndefined(shape.map)) {
            points = shape['point'];
        } else {
            shape.map((current: object, index: number) => {
                points.push(new Point(current['point']['x'], current['point']['y']));
            });
        }
        return points;
    }


    /**
     * To check and trigger bubble click event
     */
    public bubbleClick(e: PointerEvent): void {
        let target: string = (e.target as Element).id;
        if (target.indexOf('_LayerIndex_') === -1) {
            return;
        }
        let data: object = this.getbubble(target);
        if (isNullOrUndefined(data)) {
            return;
        }
        let eventArgs: IBubbleClickEventArgs = {
            cancel: false, name: bubbleClick, data: data, maps: this.maps,
            target: target, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            const {maps, ...blazorEventArgs}:  IBubbleClickEventArgs = eventArgs;
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(bubbleClick, eventArgs);
    }
    /**
     * To get bubble from target id
     */
    private getbubble(target: string): object {
        let id: string[] = target.split('_LayerIndex_');
        let index: number = parseInt(id[1].split('_')[0], 10);
        let layer: LayerSettings = <LayerSettings>this.maps.layers[index];
        let data: object;
        if (target.indexOf('_BubbleIndex_') > -1) {
            let bubbleIndex: number = parseInt(id[1].split('_BubbleIndex_')[1], 10);
            let dataIndex: number = parseInt(id[1].split('_BubbleIndex_')[1].split('_dataIndex_')[1], 10);
            if (!isNaN(bubbleIndex)) {
                data = layer.bubbleSettings[bubbleIndex].dataSource[dataIndex];
                return data;
            }
        }
        return null;
    }
    /**
     * To check and trigger bubble move event
     */
    public bubbleMove(e: PointerEvent): void {
        let target: string = (e.target as Element).id;
        if (target.indexOf('_LayerIndex_') === -1) {
            return;
        }
        let data: object = this.getbubble(target);
        if (isNullOrUndefined(data)) {
            return;
        }
        let eventArgs: IBubbleMoveEventArgs = {
            cancel: false, name: bubbleMouseMove, data: data, maps: this.maps,
            target: target, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            const {maps, ...blazorEventArgs} :  IBubbleMoveEventArgs = eventArgs;
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(bubbleMouseMove, eventArgs);
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'Bubble';
    }

    /**
     * To destroy the bubble.
     * @return {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
    }
}
