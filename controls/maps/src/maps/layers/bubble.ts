import { Maps } from '../../index';
import { BubbleSettingsModel, ColorMapping, IBubbleRenderingEventArgs, bubbleRendering } from '../index';
import { IBubbleClickEventArgs, bubbleClick, LayerSettings, IBubbleMoveEventArgs, bubbleMouseMove } from '../index';
import { isNullOrUndefined, animationMode } from '@syncfusion/ej2-base';
import { CircleOption, MapLocation, findMidPointOfPolygon, Point, drawCircle, elementAnimate, getTranslate } from '../utils/helper';
import { RectOption, Rect, drawRectangle, checkPropertyPath, getZoomTranslate, getRatioOfBubble, maintainSelection,
    getValueFromObject } from '../utils/helper';
import { BorderModel } from '../model/base-model';

/**
 * Bubble module class
 */
export class Bubble {
    private maps: Maps;
    /** @private */
    public bubbleCollection: object[];
    /**
     * Bubble Id for current layer
     *
     * @private
     */
    public id: string = '';
    constructor(maps: Maps) {
        this.maps = maps;
        this.bubbleCollection = [];
    }
    /**
     * To render bubble
     *
     * @param {BubbleSettingsModel} bubbleSettings - Specifies the bubble data to be rendered
     * @param {object} shapeData - Specifies the data about the shape
     * @param {string} color - Specifies the color of the bubble
     * @param {number} range - Specifies the range of the bubble
     * @param {number} range.min - Specifies the minimum range of the bubble
     * @param {number} range.max - Specifies the maximum range of the bubble
     * @param {number} bubbleIndex - Specifies the index of the bubble
     * @param {number} dataIndex - Specifies the index of the data
     * @param {number} layerIndex - Specifies the index of the layer
     * @param {LayerSettings} layer - Specifies the layer data
     * @param {Element} group - Specifies the element group
     * @param {string} bubbleID - Specifies the ID of the bubble
     * @returns {void}
     * @private
     */
    public renderBubble(
        bubbleSettings: BubbleSettingsModel, shapeData: object, color: string, range: { min: number, max: number },
        bubbleIndex: number, dataIndex: number, layerIndex: number, layer: LayerSettings, group: Element, bubbleID? : string
    ): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const layerData: any[] = layer.layerData; const colorValuePath: string = bubbleSettings.colorValuePath;
        const equalValue: string = (!isNullOrUndefined(colorValuePath)) ? ((colorValuePath.indexOf('.') > -1) ?
            (getValueFromObject(shapeData, bubbleSettings.colorValuePath)) : shapeData[colorValuePath as string]) :
            shapeData[colorValuePath as string];
        const colorValue: number = (!isNullOrUndefined(colorValuePath)) ? ((colorValuePath.indexOf('.') > -1) ?
            Number(getValueFromObject(shapeData, bubbleSettings.colorValuePath)) : Number(shapeData[colorValuePath as string])) :
            Number(shapeData[colorValuePath as string]);
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
            let shape: any = layerData[i as number];
            shape = shape['property'];
            const shapePath: string = checkPropertyPath(shapeData[layer.shapeDataPath], layer.shapePropertyPath, shape);
            const shapeDataLayerPathValue: string = !isNullOrUndefined(shapeData[layer.shapeDataPath]) &&
                isNaN(shapeData[layer.shapeDataPath]) ? shapeData[layer.shapeDataPath].toLowerCase() : shapeData[layer.shapeDataPath];
            const shapePathValue: string = !isNullOrUndefined(shape[shapePath as string]) && isNaN(shape[shapePath as string])
                ? shape[shapePath as string].toLowerCase() : shape[shapePath as string];
            if (shapeDataLayerPathValue === shapePathValue && (layerData[i as number].type !== 'LineString' && layerData[i as number].type !== 'MultiLineString' && layerData[i as number]['type'] !== 'Point' && layerData[i as number]['type'] !== 'MultiPoint')) {
                if (!layerData[i as number]['_isMultiPolygon']) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    shapePoints.push(this.getPoints(layerData[i as number] as any[], []));
                    currentLength = shapePoints[shapePoints.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoints.length - 1;
                    }

                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const layer: any[] = <any[]>layerData[i as number];
                    for (let j: number = 0; j < layer.length; j++) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        shapePoints.push(this.getPoints(layer[j as number] as any[], []));
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
        const bubbleBorder: BorderModel = {
            color: bubbleSettings.border.color, opacity: bubbleSettings.border.opacity,
            width: bubbleSettings.border.width
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const center: any = findMidPointOfPolygon(shapePoints[midIndex as number], projectionType, layer.geometryType);
        if (bubbleSettings.visible) {
            if (!isNullOrUndefined(center)) {
                centerY = this.maps.projectionType === 'Mercator' ? center['y'] : (-center['y']);
                eventArgs = {
                    cancel: false, name: bubbleRendering, border: bubbleBorder,
                    cx: center['x'], cy: centerY, data: shapeData, fill: bubbleColor,
                    maps: this.maps, radius: radius
                };
            } else {
                const shapePointsLength: number = shapePoints.length - 1;
                if (shapePoints[shapePointsLength as number]['x'] && shapePoints[shapePointsLength as number]['y']) {
                    eventArgs = {
                        cancel: false, name: bubbleRendering, border: bubbleBorder,
                        cx: shapePoints[shapePointsLength as number]['x'], cy: shapePoints[shapePointsLength as number]['y'],
                        data: shapeData, fill: bubbleColor, maps: this.maps,
                        radius: radius
                    };
                } else {
                    return;
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.maps.trigger('bubbleRendering', eventArgs, (bubbleArgs: IBubbleRenderingEventArgs) => {
                if (eventArgs.cancel) {
                    return;
                }
                let bubbleElement: Element;
                eventArgs.border.opacity = isNullOrUndefined(eventArgs.border.opacity) ? opacity : eventArgs.border.opacity;
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
                    LayerIndex: layerIndex,
                    BubbleIndex: bubbleIndex,
                    DataIndex: dataIndex,
                    element: bubbleElement,
                    center: { x: eventArgs.cx, y: eventArgs.cy }
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let translate: any;
                const animate: boolean = (layer.animationDuration !== 0 || animationMode === 'Enable') || isNullOrUndefined(this.maps.zoomModule);
                if (this.maps.zoomSettings.zoomFactor > 1 && !isNullOrUndefined(this.maps.zoomModule) && !this.maps.isTileMap) {
                    translate = getZoomTranslate(this.maps, layer, animate);
                } else {
                    translate = getTranslate(this.maps, layer, animate);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const bubbleDataSource: any[] = bubbleSettings.dataSource as any[];
                const scale: number = translate['scale']; const transPoint: Point = translate['location'] as Point;
                const position: MapLocation = new MapLocation(
                    (this.maps.isTileMap ? ((eventArgs.cx + this.maps.translatePoint.x) * this.maps.tileZoomLevel)
                        : ((eventArgs.cx + transPoint.x) * scale)),
                    (this.maps.isTileMap ? ((eventArgs.cy + this.maps.translatePoint.y) * this.maps.tileZoomLevel)
                        : ((eventArgs.cy + transPoint.y) * scale)));
                bubbleElement.setAttribute('transform', 'translate( ' + (position.x) + ' ' + (position.y) + ' )');
                const bubble: string = (bubbleDataSource.length - 1) === dataIndex ? 'bubble' : null;
                if (bubbleSettings.bubbleType === 'Square') {
                    position.x += radius;
                    position.y += radius * (this.maps.projectionType === 'Mercator' ? 1 : -1);
                } else {
                    radius = 0;
                }
                if (bubbleSettings.animationDuration > 0 || animationMode === 'Enable') {
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
            shape.map((current: any) => {
                points.push(new Point(current['point']['x'], current['point']['y']));
            });
        }
        return points;
    }

    /**
     * To check and trigger bubble click event.
     *
     * @param {PointerEvent} e - Specifies the pointer event argument.
     * @returns {void}
     * @private
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
        const eventArgs: IBubbleClickEventArgs = {
            cancel: false, name: bubbleClick, data: data, maps: this.maps,
            target: target, x: e.clientX, y: e.clientY
        };
        this.maps.trigger(bubbleClick, eventArgs);
    }
    /**
     * To get bubble from target id.
     *
     * @param {string} target - Specifies the target
     * @returns {object} - Returns the object
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getbubble(target: string): any {
        const id: string[] = target.split('_LayerIndex_');
        const index: number = parseInt(id[1].split('_')[0], 10);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any;
        if (target.indexOf('_BubbleIndex_') > -1) {
            const layer: LayerSettings = <LayerSettings>this.maps.layers[index as number];
            const bubbleIndex: number = parseInt(id[1].split('_BubbleIndex_')[1], 10);
            const dataIndex: number = parseInt(id[1].split('_BubbleIndex_')[1].split('_dataIndex_')[1], 10);
            if (!isNaN(bubbleIndex as number)) {
                data = layer.bubbleSettings[bubbleIndex as number].dataSource[dataIndex as number];
                return data;
            }
        }
        return null;
    }
    // eslint-disable-next-line valid-jsdoc
    /**
     * To check and trigger bubble move event.
     *
     * @param {PointerEvent} e - Specifies the pointer event argument.
     * @retruns {void}
     * @private
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
        const eventArgs: IBubbleMoveEventArgs = {
            cancel: false, name: bubbleMouseMove, data: data, maps: this.maps,
            target: target, x: e.clientX, y: e.clientY
        };
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
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.bubbleCollection = [];
        this.maps = null;
    }
}
