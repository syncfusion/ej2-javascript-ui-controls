import { Maps } from '../../index';
import { BubbleSettingsModel, ColorMapping, IBubbleRenderingEventArgs, bubbleRendering } from '../index';
import { IBubbleClickEventArgs, bubbleClick, LayerSettings, IBubbleMoveEventArgs, bubbleMouseMove } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { CircleOption, MapLocation, findMidPointOfPolygon, Point, drawCircle, elementAnimate, getTranslate } from '../utils/helper';
import { RectOption, Rect, drawRectangle } from '../utils/helper';

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
    public renderBubble(
        bubbleSettings: BubbleSettingsModel, shapeData: object, color: string, range: { min: number, max: number },
        bubbleIndex: number, dataIndex: number, layerIndex: number, layer: LayerSettings, group: Element
    ): void {
        let layerData: object[] = layer.layerData;
        let colorValuePath: string = bubbleSettings.colorValuePath;
        let equalValue: string = shapeData[colorValuePath];
        let colorValue: number = Number(shapeData[colorValuePath]);
        let bubbleValue: number = Number(shapeData[bubbleSettings.valuePath]);
        if (isNaN(bubbleValue) && isNaN(colorValue) && isNullOrUndefined(equalValue)) {
            return null;
        }
        let radius: number = this.getRatioOfBubble(bubbleSettings.minRadius, bubbleSettings.maxRadius, bubbleValue, range.min, range.max);
        let colorMapping: ColorMapping = new ColorMapping(this.maps);
        let shapeColor: string = colorMapping.getColorByValue(bubbleSettings.colorMapping, colorValue, equalValue);
        shapeColor = shapeColor ? shapeColor : color;
        let shapePoints: [MapLocation[]] = [[]];
        let midIndex: number = 0;
        let pointsLength: number = 0;
        let currentLength: number = 0;
        for (let i: number = 0, len: number = layerData.length; i < len; i++) {
            let shape: object = layerData[i];
            shape = shape['property'];
            if (shapeData[layer.shapeDataPath] === shape[layer.shapePropertyPath]) {
                if (!layerData[i]['_isMultiPolygon']) {
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
        let center: object = findMidPointOfPolygon(shapePoints[midIndex]);
        if (!isNullOrUndefined(center)) {
            let centerY: number = this.maps.projectionType === 'Mercator' ? center['y'] : (-center['y']);
            let eventArgs: IBubbleRenderingEventArgs = {
                cancel: false, name: bubbleRendering, border: bubbleSettings.border,
                cx: center['x'], cy: centerY, data: shapeData, fill: shapeColor, maps: this.maps,
                radius: radius
            };
            this.maps.trigger(bubbleRendering, eventArgs);
            if (eventArgs.cancel) {
                return;
            }
            let bubbleElement: Element;
            if (bubbleSettings.bubbleType === 'Circle') {
                let circle: CircleOption = new CircleOption(
                    this.id, eventArgs.fill, eventArgs.border, bubbleSettings.opacity,
                    0, 0, eventArgs.radius, null
                );
                bubbleElement = drawCircle(this.maps, circle, group);
            } else {
                let y: number = this.maps.projectionType === 'Mercator' ? (eventArgs.cy - radius) : (eventArgs.cy + radius);
                let rectangle: RectOption = new RectOption(
                    this.id, eventArgs.fill, eventArgs.border, bubbleSettings.opacity,
                    new Rect(0, 0, radius * 2, radius * 2), 2, 2
                );
                eventArgs.cx -= radius;
                eventArgs.cy = y;
                bubbleElement = drawRectangle(this.maps, rectangle, group);
            }
            this.bubbleCollection.push({
                LayerIndex: layerIndex,
                BubbleIndex: bubbleIndex,
                DataIndex: dataIndex,
                element: bubbleElement,
                center: { x: eventArgs.cx, y: eventArgs.cy }
            });
            let animate: boolean = layer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
            let translate: Object = getTranslate(this.maps, layer, animate);
            let scale: number = translate['scale'];
            let transPoint: Point = translate['location'] as Point;
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
        }
    }
    private getPoints(shape: object[], points: MapLocation[]): MapLocation[] {
        shape.map((current: object, index: number) => {
            points.push(new Point(current['point']['x'], current['point']['y']));
        });
        return points;
    }
    private getRatioOfBubble(min: number, max: number, value: number, minValue: number, maxValue: number): number {
        let percent: number = (100 / (maxValue - minValue)) * (value - minValue);
        let bubbleRadius: number = (((max - min) / 100) * percent) + min;
        if (maxValue === minValue) {
            bubbleRadius = (((max - min) / 100)) + min;
        }
        return bubbleRadius;
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
            if (!isNaN(bubbleIndex)) {
                data = layer.dataSource[bubbleIndex];
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
