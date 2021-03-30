/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/dot-notation */
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public bubbleCollection: any[];
    /**
     * Bubble Id for current layer
     */
    public id: string = '';
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(maps: Maps) {
        this.maps = maps;
        this.bubbleCollection = [];
    }
    // eslint-disable-next-line valid-jsdoc
    /**
     * To render bubble
     */
    public renderBubble(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bubbleSettings: BubbleSettingsModel, shapeData: any, color: string, range: { min: number, max: number },
        bubbleIndex: number, dataIndex: number, layerIndex: number, layer: LayerSettings, group: Element, bubbleID? : string
    ): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const layerData: any[] = layer.layerData; const colorValuePath: string = bubbleSettings.colorValuePath;
        const equalValue: string = (!isNullOrUndefined(colorValuePath)) ? ((colorValuePath.indexOf('.') > -1) ?
            (getValueFromObject(shapeData, bubbleSettings.colorValuePath)) : shapeData[colorValuePath]) : shapeData[colorValuePath];
        const colorValue: number = (!isNullOrUndefined(colorValuePath)) ? ((colorValuePath.indexOf('.') > -1) ?
            Number(getValueFromObject(shapeData, bubbleSettings.colorValuePath)) : Number(shapeData[colorValuePath])) :
            Number(shapeData[colorValuePath]);
        const bubbleValue: number = (!isNullOrUndefined(bubbleSettings.valuePath)) ? ((bubbleSettings.valuePath.indexOf('.') > -1) ?
            Number(getValueFromObject(shapeData, bubbleSettings.valuePath)) : Number(shapeData[bubbleSettings.valuePath])) :
            Number(shapeData[bubbleSettings.valuePath]);
        let opacity: number; let bubbleColor: string;
        if (isNaN(bubbleValue) && isNaN(colorValue) && isNullOrUndefined(equalValue)) {
            return null;
        }
        let radius: number = getRatioOfBubble(bubbleSettings.minRadius, bubbleSettings.maxRadius, bubbleValue, range.min, range.max);
        const colorMapping: ColorMapping = new ColorMapping(this.maps);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shapeColor: any = colorMapping.getColorByValue(bubbleSettings.colorMapping, colorValue, equalValue);
        // eslint-disable-next-line prefer-const
        bubbleColor = (Object.prototype.toString.call(shapeColor) === '[object Object]' &&
            !isNullOrUndefined(shapeColor['fill'])) ? shapeColor['fill'] : color;
        // eslint-disable-next-line prefer-const
        opacity = (Object.prototype.toString.call(shapeColor) === '[object Object]' &&
            !isNullOrUndefined(shapeColor['opacity'])) ? shapeColor['opacity'] : bubbleSettings.opacity;
        const shapePoints: [MapLocation[]] = [[]]; this.maps.translateType = 'bubble';
        let midIndex: number = 0; let pointsLength: number = 0; let currentLength: number = 0;
        for (let i: number = 0, len: number = layerData.length; i < len; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let shape: any = layerData[i];
            shape = shape['property'];
            const shapePath: string = checkPropertyPath(shapeData[layer.shapeDataPath], layer.shapePropertyPath, shape);
            const shapeDataLayerPathValue : string = !isNullOrUndefined(shapeData[layer.shapeDataPath]) &&
            isNaN(shapeData[layer.shapeDataPath]) ? shapeData[layer.shapeDataPath].toLowerCase() : shapeData[layer.shapeDataPath];
            const shapePathValue : string =  !isNullOrUndefined(shape[shapePath]) && isNaN(shape[shapePath])
                ? shape[shapePath].toLowerCase() : shape[shapePath];
            if (shapeDataLayerPathValue === shapePathValue) {
                if (layerData[i]['type'] === 'Point') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    shapePoints.push(this.getPoints(<any[]>layerData[i], []));
                } else if (!layerData[i]['_isMultiPolygon']) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    shapePoints.push(this.getPoints(layerData[i] as any[], []));
                    currentLength = shapePoints[shapePoints.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoints.length - 1;
                    }

                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const layer: any[] = <any[]>layerData[i];
                    for (let j: number = 0; j < layer.length; j++) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        shapePoints.push(this.getPoints(layer[j] as any[], []));
                        currentLength = shapePoints[shapePoints.length - 1].length;
                        if (pointsLength < currentLength) {
                            pointsLength = currentLength;
                            midIndex = shapePoints.length - 1;
                        }
                    }
                }
            }
        }
        const projectionType: string = this.maps.projectionType;
        let centerY: number; let eventArgs: IBubbleRenderingEventArgs;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const center: any = findMidPointOfPolygon(shapePoints[midIndex], projectionType);
        if (bubbleSettings.visible) {
            if (!isNullOrUndefined(center)) {
                centerY = this.maps.projectionType === 'Mercator' ? center['y'] : (-center['y']);
                eventArgs = {
                    cancel: false, name: bubbleRendering, border: bubbleSettings.border,
                    cx: center['x'], cy: centerY, data: shapeData, fill: bubbleColor,
                    maps: this.maps.isBlazor ? null : this.maps, radius: radius
                };
            } else {
                const shapePointsLength: number = shapePoints.length - 1;
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
                    const circle: CircleOption = new CircleOption(
                        bubbleID, eventArgs.fill, eventArgs.border, opacity,
                        0, 0, eventArgs.radius, null
                    );
                    bubbleElement = drawCircle(this.maps, circle, group);
                } else {
                    const y: number = this.maps.projectionType === 'Mercator' ? (eventArgs.cy - radius) : (eventArgs.cy + radius);
                    const rectangle: RectOption = new RectOption(
                        bubbleID, eventArgs.fill, eventArgs.border, opacity,
                        new Rect(0, 0, radius * 2, radius * 2), 2, 2
                    );
                    eventArgs.cx -= radius; eventArgs.cy = y;
                    bubbleElement = drawRectangle(this.maps, rectangle, group);
                }
                maintainSelection(this.maps.selectedBubbleElementId, this.maps.bubbleSelectionClass, bubbleElement,
                                  'BubbleselectionMapStyle');
                this.bubbleCollection.push({
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    LayerIndex: layerIndex,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    BubbleIndex: bubbleIndex,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    DataIndex: dataIndex,
                    element: bubbleElement,
                    center: { x: eventArgs.cx, y: eventArgs.cy }
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let translate: any;
                const animate: boolean = layer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
                if (this.maps.zoomSettings.zoomFactor > 1 && !isNullOrUndefined(this.maps.zoomModule)) {
                    translate = getZoomTranslate(this.maps, layer, animate);
                } else {
                    translate = getTranslate(this.maps, layer, animate);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const bubbleDataSource: any[] = bubbleSettings.dataSource as any[];
                const scale: number = translate['scale']; const transPoint: Point = translate['location'] as Point;
                const position: MapLocation = new MapLocation(
                    (this.maps.isTileMap ? (eventArgs.cx) : ((eventArgs.cx + transPoint.x) * scale)),
                    (this.maps.isTileMap ? (eventArgs.cy) : ((eventArgs.cy + transPoint.y) * scale)));
                bubbleElement.setAttribute('transform', 'translate( ' + (position.x) + ' ' + (position.y) + ' )');
                const bubble: string = (bubbleDataSource.length - 1) === dataIndex ? 'bubble' : null;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getPoints(shape: any[], points: MapLocation[]): MapLocation[] {
        if (isNullOrUndefined(shape.map)) {
            points = shape['point'];
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shape.map((current: any, index: number) => {
                points.push(new Point(current['point']['x'], current['point']['y']));
            });
        }
        return points;
    }


    // eslint-disable-next-line valid-jsdoc
    /**
     * To check and trigger bubble click event
     */
    public bubbleClick(e: PointerEvent): void {
        const target: string = (e.target as Element).id;
        if (target.indexOf('_LayerIndex_') === -1) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = this.getbubble(target);
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
     *
     * @param {string} target - Specifies the target
     * @returns {object} - Returns the object
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getbubble(target: string): any {
        const id: string[] = target.split('_LayerIndex_');
        const index: number = parseInt(id[1].split('_')[0], 10);
        const layer: LayerSettings = <LayerSettings>this.maps.layers[index];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any;
        if (target.indexOf('_BubbleIndex_') > -1) {
            const bubbleIndex: number = parseInt(id[1].split('_BubbleIndex_')[1], 10);
            const dataIndex: number = parseInt(id[1].split('_BubbleIndex_')[1].split('_dataIndex_')[1], 10);
            if (!isNaN(bubbleIndex)) {
                data = layer.bubbleSettings[bubbleIndex].dataSource[dataIndex];
                return data;
            }
        }
        return null;
    }
    // eslint-disable-next-line valid-jsdoc
    /**
     * To check and trigger bubble move event
     */
    public bubbleMove(e: PointerEvent): void {
        const target: string = (e.target as Element).id;
        if (target.indexOf('_LayerIndex_') === -1) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = this.getbubble(target);
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
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'Bubble';
    }

    /**
     * To destroy the bubble.
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
