/* eslint-disable max-len */
import { Maps, Orientation, ITouches, ZoomSettings } from '../../index';
import { Point, getElementByID, Size, PathOption, Rect, convertGeoToPoint, CircleOption, convertTileLatLongToPoint } from '../utils/helper';
import { RectOption, PolygonOption, createTooltip, calculateScale, getTouchCenter, getTouches, targetTouches } from '../utils/helper';
import { MapLocation, zoomAnimate, smoothTranslate , measureText, textTrim, clusterTemplate, marker } from '../utils/helper';
import { markerTemplate, removeElement, getElement, clusterSeparate, markerColorChoose } from '../utils/helper';
import { markerShapeChoose   } from '../utils/helper';
import { isNullOrUndefined, EventHandler, Browser, remove, createElement } from '@syncfusion/ej2-base';
import { MarkerSettings, LayerSettings, changeBorderWidth, IMarkerRenderingEventArgs, markerRendering } from '../index';
import { IMapZoomEventArgs, IMapPanEventArgs } from '../model/interface';
import { pan } from '../model/constants';
import { getValueFromObject } from '../utils/helper';
import { PanDirection } from '../utils/enum';
import { FontModel, DataLabelSettingsModel, BorderModel } from '../model/base-model';
import { MapsTooltip } from './tooltip';

/**
 * Zoom module used to process the zoom for maps
 */
export class Zoom {
    private maps: Maps;
    public toolBarGroup: Element;
    private currentToolbarEle: Element;
    public zoomingRect: Rect;
    public selectionColor: string;
    private fillColor: string;
    private zoomElements: Element;
    private panElements: Element;
    public isPanning: boolean = false;
    public mouseEnter: boolean = false;
    public baseTranslatePoint: Point;
    private wheelEvent: string;
    private cancelEvent: string;
    public currentScale: number;
    public isTouch: boolean = false;
    public rectZoomingStart: boolean = false;
    public touchStartList: ITouches[] | TouchList;
    public touchMoveList: ITouches[] | TouchList;
    public previousTouchMoveList: ITouches[] | TouchList;
    public mouseDownPoints: Point;
    public mouseMovePoints: Point;
    public isDragZoom: boolean;
    public currentLayer: LayerSettings;
    private panColor: string;
    public zoomColor: string;
    public browserName: string = Browser.info.name;
    // eslint-disable-next-line @typescript-eslint/ban-types
    public isPointer: Boolean = Browser.isPointer;
    private handled: boolean = false;
    private fingers: number;
    public firstMove: boolean;
    private interaction: string;
    private lastScale: number;
    private pinchFactor: number = 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private startTouches: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private zoomshapewidth: any;
    private index: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public intersect: any[] = [];
    private templateCount: number;
    private distanceX: number;
    private distanceY: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public mouseDownLatLong: any = { x: 0, y: 0 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public mouseMoveLatLong: any = { x: 0, y: 0 };
    /**
     * @private
     */
    public isSingleClick: boolean = false;
    /** @private */
    public layerCollectionEle: Element;
    constructor(maps: Maps) {
        this.maps = maps;
        this.wheelEvent = this.browserName === 'mozilla' ? (this.isPointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';
        this.cancelEvent = this.isPointer ? 'pointerleave' : 'mouseleave';
        this.selectionColor = this.maps.zoomSettings.selectionColor;
        this.fillColor = this.maps.zoomSettings.color;
        this.addEventListener();
    }

    /**
     * To perform zooming for maps
     *
     * @param {Point} position - Specifies the position.
     * @param {number} newZoomFactor - Specifies the zoom factor.
     * @param {string} type - Specifies the type.
     * @returns {void}
     */
    public performZooming(position: Point, newZoomFactor: number, type: string): void {
        const map: Maps = this.maps;
        map.previousProjection = map.projectionType;
        map.defaultState = false;
        map.initialCheck = false;
        map.markerZoomedState = false;
        map.zoomPersistence = map.enablePersistence;
        const prevLevel: number = map.tileZoomLevel;
        const scale: number = map.previousScale = map.scale;
        const maxZoom: number = map.zoomSettings.maxZoom;
        const minZoom: number = map.zoomSettings.minZoom;
        newZoomFactor = (minZoom > newZoomFactor && type === 'ZoomIn') ? minZoom + 1 : newZoomFactor;
        const prevTilePoint: Point = map.tileTranslatePoint;
        if ((!map.isTileMap) && ((type === 'ZoomIn' ? newZoomFactor >= minZoom && newZoomFactor <= maxZoom : newZoomFactor >= minZoom)
            || map.isReset)) {
            const availSize: Rect = map.mapAreaRect;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const minBounds: any = map.baseMapRectBounds['min'] as any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const maxBounds: any = map.baseMapRectBounds['max'] as any;
            let mapTotalWidth: number = Math.abs(minBounds['x'] - maxBounds['x']);
            let mapTotalHeight: number = Math.abs(minBounds['y'] - maxBounds['y']);
            let translatePointX: number;
            let translatePointY: number;
            if (newZoomFactor < 1.2 && map.projectionType !== 'Eckert5') {
                if (mapTotalWidth === 0 || mapTotalHeight === 0 || mapTotalWidth === mapTotalHeight) {
                    mapTotalWidth = availSize.width / 2;
                    mapTotalHeight = availSize.height;
                }
                newZoomFactor = parseFloat(Math.min(availSize.width / mapTotalWidth, availSize.height / mapTotalHeight).toFixed(2));
                newZoomFactor = newZoomFactor > 1.05 ? 1 : newZoomFactor;
                map.translatePoint = this.calculateInitalZoomTranslatePoint(newZoomFactor, mapTotalWidth, mapTotalHeight, availSize, minBounds, map);
            } else {
                const point: Point = map.translatePoint;
                translatePointX = point.x - (((availSize.width / scale) - (availSize.width / newZoomFactor)) / (availSize.width / position.x));
                translatePointY = point.y - (((availSize.height / scale) - (availSize.height / newZoomFactor)) / (availSize.height / position.y));
                const currentHeight: number = Math.abs(map.baseMapRectBounds['max']['y'] - map.baseMapRectBounds['min']['y']) * newZoomFactor;
                translatePointX = (currentHeight < map.mapAreaRect.height) ? (availSize.x + ((-(minBounds['x'])) + ((availSize.width / 2) - (mapTotalWidth / 2)))) : translatePointX;
                translatePointY = (currentHeight < map.mapAreaRect.height) ? (availSize.y + ((-(minBounds['y'])) + ((availSize.height / 2) - (mapTotalHeight / 2)))) : translatePointY;
                map.translatePoint = new Point(translatePointX, translatePointY);
            }
            map.scale = newZoomFactor;
            if (this.triggerZoomEvent(prevTilePoint, prevLevel, type)) {
                map.translatePoint = map.previousPoint;
                map.scale = map.mapScaleValue = map.previousScale;
            } else {
                this.applyTransform(map);
            }
        } else if ((map.isTileMap) && (newZoomFactor >= minZoom && newZoomFactor <= maxZoom)) {
            this.getTileTranslatePosition(prevLevel, newZoomFactor, position, type);
            map.tileZoomLevel = newZoomFactor;
            map.zoomSettings.zoomFactor = newZoomFactor;
            map.scale = Math.pow(2, newZoomFactor - 1);
            if (type === 'ZoomOut' && map.zoomSettings.resetToInitial && map.applyZoomReset && newZoomFactor <= map.initialZoomLevel) {
                map.initialCheck = true;
                map.zoomPersistence = false;
                map.tileTranslatePoint.x = map.initialTileTranslate.x;
                map.tileTranslatePoint.y = map.initialTileTranslate.y;
                newZoomFactor = map.tileZoomLevel = map.mapScaleValue = map.initialZoomLevel;
                map.scale = Math.pow(2, newZoomFactor - 1);
            }
            map.translatePoint.y = (map.tileTranslatePoint.y - (0.01 * map.mapScaleValue)) / map.scale;
            map.translatePoint.x = (map.tileTranslatePoint.x - (0.01 * map.mapScaleValue)) / map.scale;
            if (this.triggerZoomEvent(prevTilePoint, prevLevel, type)) {
                map.translatePoint = map.tileTranslatePoint = new Point(0, 0);
                map.scale = map.previousScale;
                map.tileZoomLevel = prevLevel;
                map.zoomSettings.zoomFactor = map.previousScale;
            } else {
                if (document.querySelector('.GroupElement')) {
                    (document.querySelector('.GroupElement') as HTMLElement).style.display = 'none';
                }
                if (document.getElementById(this.maps.element.id + '_LayerIndex_1')) {
                    document.getElementById(this.maps.element.id + '_LayerIndex_1').style.display = 'none';
                }
                this.markerLineAnimation(map);
                map.mapLayerPanel.generateTiles(newZoomFactor, map.tileTranslatePoint, type + 'wheel', null, position);
                const element1: HTMLElement = document.getElementById(this.maps.element.id + '_tiles');
                const animationDuration: number = this.maps.layersCollection[0].animationDuration;
                setTimeout(() => {
                    // if (type === 'ZoomOut') {
                    //     element1.removeChild(element1.children[element1.childElementCount - 1]);
                    //     if (element1.childElementCount) {
                    //         element1.removeChild(element1.children[element1.childElementCount - 1]);
                    //     } else {
                    //         element1 = element1;
                    //     }
                    // }
                    this.applyTransform(this.maps);
                    if (document.getElementById(this.maps.element.id + '_LayerIndex_1')) {
                        document.getElementById(this.maps.element.id + '_LayerIndex_1').style.display = 'block';
                    }
                }, animationDuration);
            }
        }
        this.maps.zoomNotApplied = false;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private calculateInitalZoomTranslatePoint(newZoomFactor: number, mapTotalWidth: number, mapTotalHeight: number, availSize: Rect, minBounds: any, map: Maps): Point {
        mapTotalWidth *= newZoomFactor;
        mapTotalHeight *= newZoomFactor;
        const widthDiff: number = minBounds['x'] !== 0 && map.translateType === 'layers' ? map.availableSize.width - availSize.width : 0;
        const translatePointX: number = availSize.x + ((-(minBounds['x'])) + ((availSize.width / 2) - (mapTotalWidth / 2))) - widthDiff;
        const translatePointY: number = availSize.y + ((-(minBounds['y'])) + ((availSize.height / 2) - (mapTotalHeight / 2)));
        return new Point(translatePointX, translatePointY);
    }

    private triggerZoomEvent(prevTilePoint: Point, prevLevel: number, type: string): boolean {
        const map: Maps = this.maps; let zoomArgs: IMapZoomEventArgs;
        if (!map.isTileMap) {
            zoomArgs = {
                cancel: false, name: 'zoom', type: type, maps: map,
                tileTranslatePoint: {}, translatePoint: { previous: map.previousPoint, current: map.translatePoint },
                tileZoomLevel: {}, scale: { previous: map.previousScale, current: map.scale }
            };
        } else {
            zoomArgs = {
                cancel: false, name: 'zoom', type: type, maps: map,
                tileTranslatePoint: { previous: prevTilePoint, current: map.tileTranslatePoint }, translatePoint: { previous: map.previousPoint, current: map.translatePoint },
                tileZoomLevel: { previous: prevLevel, current: map.tileZoomLevel }, scale: { previous: map.previousScale, current: map.scale }
            };
        }
        map.trigger('zoom', zoomArgs);
        return zoomArgs.cancel;
    }

    private getTileTranslatePosition(prevLevel: number, currentLevel: number, position: Point, type?: string): void {
        const map: Maps = this.maps;
        const tileDefaultSize: number = 256;
        const padding: number = type === 'ZoomOut' ? 10 : (type === 'Reset' && currentLevel > 1) ? 0 : 10;
        const bounds: Size = map.availableSize;
        const prevSize: number = Math.pow(2, prevLevel) * 256;
        const totalSize: number = Math.pow(2, currentLevel) * 256;
        const x: number = ((position.x - map.tileTranslatePoint.x) / prevSize) * 100;
        const y: number = ((position.y - map.tileTranslatePoint.y) / prevSize) * 100;
        map.tileTranslatePoint.x = (currentLevel === 1) ? (bounds.width / 2) - ((tileDefaultSize * 2) / 2) :
            position.x - ((x * totalSize) / 100);
        map.tileTranslatePoint.y = (currentLevel === 1) ? ((bounds.height / 2) - ((tileDefaultSize * 2) / 2) + (padding * 2)) :
            position.y - ((y * totalSize) / 100);
    }

    public performRectZooming(): void {
        this.isDragZoom = true;
        const map: Maps = this.maps;
        const size: Size = map.availableSize;
        map.previousProjection = map.projectionType;
        const prevLevel: number = map.tileZoomLevel;
        const prevTilePoint: Point = map.tileTranslatePoint;
        const zoomRect: Rect = this.zoomingRect;
        const maxZoom: number = map.zoomSettings.maxZoom;
        const minZoom: number = map.zoomSettings.minZoom;
        let isZoomCancelled: boolean;
        if (zoomRect.height > 0 && zoomRect.width > 0) {
            const x: number = this.zoomingRect.x + (this.zoomingRect.width / 2);
            const y: number = this.zoomingRect.y + (this.zoomingRect.height / 2);
            let zoomCalculationFactor: number;
            if (!map.isTileMap) {
                const scale: number = map.previousScale = map.scale;
                zoomCalculationFactor = scale + Math.round((((size.width / zoomRect.width) + (size.height / zoomRect.height)) / 2));
                const translatePoint: Point = map.previousPoint = map.translatePoint;
                const translatePointX: number = translatePoint.x - (((size.width / scale) - (size.width / zoomCalculationFactor)) / (size.width / x));
                const translatePointY: number = translatePoint.y - (((size.height / scale) - (size.height / zoomCalculationFactor)) / (size.height / y));
                map.translatePoint = new Point(translatePointX, translatePointY);
                map.scale = zoomCalculationFactor;
                isZoomCancelled = this.triggerZoomEvent(prevTilePoint, prevLevel, '');
                if (isZoomCancelled) {
                    map.translatePoint = map.previousPoint;
                    map.scale = map.previousScale;
                }
            } else {
                zoomCalculationFactor = prevLevel + (Math.round(prevLevel + (((size.width / zoomRect.width) + (size.height / zoomRect.height)) / 2)));
                zoomCalculationFactor = (zoomCalculationFactor >= minZoom && zoomCalculationFactor <= maxZoom) ? zoomCalculationFactor : maxZoom;
                map.zoomSettings.zoomFactor = zoomCalculationFactor;
                this.getTileTranslatePosition(prevLevel, zoomCalculationFactor, { x: x, y: y });
                map.tileZoomLevel = zoomCalculationFactor;
                map.translatePoint.x = (map.tileTranslatePoint.x - (0.5 * Math.pow(2, zoomCalculationFactor))) /
                    (Math.pow(2, zoomCalculationFactor));
                map.translatePoint.y = (map.tileTranslatePoint.y - (0.5 * Math.pow(2, zoomCalculationFactor))) /
                    (Math.pow(2, zoomCalculationFactor));
                map.scale = (Math.pow(2, zoomCalculationFactor));
                isZoomCancelled = this.triggerZoomEvent(prevTilePoint, prevLevel, '');
                if (isZoomCancelled) {
                    map.translatePoint = map.tileTranslatePoint = new Point(0, 0);
                    map.scale = map.tileZoomLevel = map.zoomSettings.zoomFactor = prevLevel;
                } else {
                    map.mapLayerPanel.generateTiles(zoomCalculationFactor, map.tileTranslatePoint);
                }
            }
            if (!isZoomCancelled) {
                map.mapScaleValue = zoomCalculationFactor;
                this.applyTransform(map, true);
                this.maps.zoomNotApplied = false;
                this.zoomingRect = null;
            }
        }
    }

    private setInteraction(newInteraction: string): void {
        this.lastScale = 1;
        this.interaction = newInteraction;
    }

    private updateInteraction(): void {
        if (this.fingers === 2) {
            this.setInteraction('zoom');
        } else {
            this.setInteraction(null);
        }
    }

    public performPinchZooming(e: PointerEvent | TouchEvent): void {
        const map: Maps = this.maps;
        const prevLevel: number = map.tileZoomLevel;
        const availSize: Rect = map.mapAreaRect;
        map.previousScale = map.scale;
        map.previousPoint = map.translatePoint;
        const prevTilePoint: Point = map.tileTranslatePoint;
        const scale: number = calculateScale(<ITouches[]>this.touchStartList, <ITouches[]>this.touchMoveList);
        const touchCenter: Point = getTouchCenter(getTouches(<ITouches[]>this.touchMoveList, this.maps));
        const newScale: number = scale / this.lastScale;
        this.lastScale = scale;
        this.pinchFactor *= newScale;
        this.pinchFactor = Math.min(this.maps.zoomSettings.maxZoom, Math.max(this.pinchFactor, this.maps.zoomSettings.minZoom));
        let zoomCalculationFactor: number = this.pinchFactor;
        let zoomArgs: IMapZoomEventArgs;
        let isZoomCancelled: boolean;
        if (!map.isTileMap) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const minBounds: any = map.baseMapRectBounds['min'] as any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const maxBounds: any = map.baseMapRectBounds['max'] as any;
            let mapTotalHeight: number = Math.abs(minBounds['y'] - maxBounds['y']);
            let mapTotalWidth: number = Math.abs(minBounds['x'] - maxBounds['x']);
            const translatePoint: Point = map.translatePoint;
            let translatePointX: number;
            let translatePointY: number;
            if (zoomCalculationFactor < 1.2 && map.projectionType !== 'Eckert5') {
                if (mapTotalWidth === 0 || mapTotalHeight === 0 || mapTotalWidth === mapTotalHeight) {
                    mapTotalWidth = availSize.width / 2;
                    mapTotalHeight = availSize.height;
                }
                zoomCalculationFactor = parseFloat(Math.min(availSize.width / mapTotalWidth, availSize.height / mapTotalHeight).toFixed(2));
                zoomCalculationFactor = zoomCalculationFactor > 1.05 ? 1 : zoomCalculationFactor;
                map.translatePoint = this.calculateInitalZoomTranslatePoint(zoomCalculationFactor, mapTotalWidth, mapTotalHeight, availSize, minBounds, map);
            }
            else {
                const currentHeight: number = Math.abs(map.baseMapRectBounds['max']['y'] - map.baseMapRectBounds['min']['y']) * zoomCalculationFactor;
                translatePointX = translatePoint.x - (((availSize.width / map.scale) - (availSize.width / zoomCalculationFactor)) / (availSize.width / touchCenter.x));
                translatePointY = translatePoint.y - (((availSize.height / map.scale) - (availSize.height / zoomCalculationFactor)) / (availSize.height / touchCenter.y));
                translatePointX = (currentHeight < map.mapAreaRect.height) ? (availSize.x + ((-(minBounds['x'])) + ((availSize.width / 2) - (mapTotalWidth / 2)))) : translatePointX;
                translatePointY = (currentHeight < map.mapAreaRect.height) ? (availSize.y + ((-(minBounds['y'])) + ((availSize.height / 2) - (mapTotalHeight / 2)))) : translatePointY;
                map.translatePoint = new Point(translatePointX, translatePointY);
            }
            map.scale = zoomCalculationFactor;
            isZoomCancelled = this.triggerZoomEvent(prevTilePoint, prevLevel, '');
            if (isZoomCancelled) {
                map.translatePoint = map.previousPoint;
                map.scale = map.previousScale;
            }
        } else {
            const newTileFactor: number = zoomCalculationFactor;
            this.getTileTranslatePosition(prevLevel, newTileFactor, { x: touchCenter.x, y: touchCenter.y });
            map.tileZoomLevel = newTileFactor;
            map.translatePoint.x = (map.tileTranslatePoint.x - (0.5 * Math.pow(2, newTileFactor))) /
                (Math.pow(2, newTileFactor));
            map.translatePoint.y = (map.tileTranslatePoint.y - (0.5 * Math.pow(2, newTileFactor))) /
                (Math.pow(2, newTileFactor));
            map.scale = (Math.pow(2, newTileFactor));
            isZoomCancelled = this.triggerZoomEvent(prevTilePoint, prevLevel, '');
            if (isZoomCancelled) {
                map.translatePoint = map.tileTranslatePoint = new Point(0, 0);
                map.scale = map.previousScale;
                map.tileZoomLevel = prevLevel;
                map.zoomSettings.zoomFactor = map.previousScale;
            } else {
                map.mapLayerPanel.generateTiles(newTileFactor, map.tileTranslatePoint);
            }
        }
        if (!isZoomCancelled) {
            this.applyTransform(map);
        }
    }

    public drawZoomRectangle(): void {
        const map: Maps = this.maps;
        const down: Point = this.mouseDownPoints;
        const move: Point = this.mouseMovePoints;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const border: any = { width: 1, color: '#009900' };
        const width: number = Math.abs(move.x - down.x);
        const height: number = Math.abs(move.y - down.y);
        const x: number = ((move.x > down.x) ? down.x : down.x - width);
        const y: number = ((move.y > down.y) ? down.y : down.y - height);
        const elementRect: ClientRect = getElementByID(map.element.id).getBoundingClientRect();
        if ((x > map.mapAreaRect.x && x < (map.mapAreaRect.x + map.mapAreaRect.width)) &&
            (y > map.mapAreaRect.y) && (y < map.mapAreaRect.y + map.mapAreaRect.height)) {
            this.zoomingRect = new Rect(x, y, width, height);
            const rectSVGObject: Element = map.renderer.createSvg({
                id: map.element.id + '_Selection_Rect_Zooming',
                width: map.availableSize.width,
                height: map.availableSize.height
            });
            const rectOption: RectOption = new RectOption(
                map.element.id + '_ZoomRect', '#d3d3d3', border, 0.5, this.zoomingRect, 0, 0, '', '3'
            );
            rectSVGObject.appendChild(map.renderer.drawRectangle(rectOption));
            getElementByID(map.element.id + '_Secondary_Element').appendChild(rectSVGObject);
        }
    }
    /**
     * To animate the zooming process
     *
     * @param {Element} element - Specifies the element
     * @param {boolean} animate - Specifies the boolean value
     * @param {number} x - Specifies the x value
     * @param {number} y - Specifies the y value
     * @param {number} scale - Specifies the scale value
     * @returns {void}
     */
    private animateTransform(element: Element, animate: boolean, x: number, y: number, scale: number): void {
        const duration: number = this.currentLayer.animationDuration;
        if (!animate || duration === 0 || this.maps.isTileMap) {
            element.setAttribute('transform', 'scale(' + (scale) + ') translate( ' + x + ' ' + y + ' )');
            return;
        }
        if (!this.maps.isTileMap) {
            zoomAnimate(element, 0, duration, new MapLocation(x, y), scale, this.maps.mapAreaRect, this.maps);
        }
    }

    public applyTransform(maps: Maps, animate?: boolean): void {
        let layerIndex: number;
        this.templateCount = 0;
        let layer: LayerSettings;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let zoomshapelocation: any;
        let i: number; let markerStyle: string;
        const scale: number = maps.scale;
        const x: number = maps.translatePoint.x;
        const y: number = maps.translatePoint.y;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const collection: any[] = []; maps.zoomShapeCollection = [];
        if (document.getElementById(maps.element.id + '_mapsTooltip')) {
            removeElement(maps.element.id + '_mapsTooltip');
        }
        if (this.layerCollectionEle) {
            for (let i: number = 0; i < this.layerCollectionEle.childElementCount; i++) {
                const layerElement: Element = this.layerCollectionEle.childNodes[i as number] as Element;
                if (layerElement.tagName === 'g') {
                    this.templateCount++;
                    this.index = layerElement.id.indexOf('_LayerIndex_') > -1 && parseFloat(layerElement.id.split('_LayerIndex_')[1].split('_')[0]);
                    this.currentLayer = <LayerSettings>maps.layersCollection[this.index];
                    const factor: number = maps.mapLayerPanel.calculateFactor(this.currentLayer);
                    const elementCount: number = layerElement.childElementCount;
                    for (let j: number = 0; j < elementCount; j++) {
                        let currentEle: Element = layerElement.childNodes[j as number] as Element;
                        if (!(currentEle.id.indexOf('_Markers_Group') > -1) && (!(currentEle.id.indexOf('_bubble_Group') > -1))
                            && (!(currentEle.id.indexOf('_dataLableIndex_Group') > -1))
                        ) {
                            if (maps.isTileMap && (currentEle.id.indexOf('_line_Group') > -1)) {
                                currentEle.remove();
                                if (layerElement.children.length > 0 && layerElement.children[0]) {
                                    layerElement.insertBefore(
                                        maps.navigationLineModule.renderNavigation(
                                            this.currentLayer, maps.tileZoomLevel, this.index
                                        ),
                                        layerElement.children[1]
                                    );
                                } else {
                                    layerElement.appendChild(maps.navigationLineModule.renderNavigation(this.currentLayer, maps.tileZoomLevel, this.index));
                                }
                            } else if (currentEle.id.indexOf('Legend') === -1) {
                                changeBorderWidth(currentEle, this.index, scale, maps);
                                maps.zoomTranslatePoint = maps.translatePoint;
                                this.animateTransform(currentEle, animate, x, y, scale);
                            }

                        } else if (currentEle.id.indexOf('_Markers_Group') > -1) {
                            if (!this.isPanning && !isNullOrUndefined(currentEle.childNodes[0])) {
                                this.markerTranslates(<Element>currentEle.childNodes[0], factor, x, y, scale, 'Marker', layerElement, animate);
                            }
                            currentEle = layerElement.childNodes[j as number] as Element;
                            let markerAnimation: boolean;
                            if (!isNullOrUndefined(currentEle) && currentEle.id.indexOf('Markers') !== -1) {
                                for (let k: number = 0; k < currentEle.childElementCount; k++) {
                                    this.markerTranslate(<Element>currentEle.childNodes[k as number], factor, x, y, scale, 'Marker', animate);
                                    const layerIndex : number = parseInt(currentEle.childNodes[k as number]['id'].split('_LayerIndex_')[1].split('_')[0], 10);
                                    const dataIndex : number = parseInt(currentEle.childNodes[k as number]['id'].split('_dataIndex_')[1].split('_')[0], 10);
                                    const markerIndex  : number = parseInt(currentEle.childNodes[k as number]['id'].split('_MarkerIndex_')[1].split('_')[0], 10);
                                    markerAnimation = this.currentLayer.markerSettings[markerIndex as number].animationDuration > 0;
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const markerSelectionValues : any = this.currentLayer.markerSettings[markerIndex as number].dataSource[dataIndex as number];
                                    for (let x : number = 0; x < this.currentLayer.markerSettings[markerIndex as number].initialMarkerSelection.length; x++) {
                                        if (this.currentLayer.markerSettings[markerIndex as number].initialMarkerSelection[x as number]['latitude'] ===
                                            markerSelectionValues['latitude'] ||
                                            this.currentLayer.markerSettings[markerIndex as number].initialMarkerSelection[x as number]['longitude'] ===
                                            markerSelectionValues['longitude']) {
                                            maps.markerSelection(this.currentLayer.markerSettings[markerIndex as number].selectionSettings,
                                                                 maps, currentEle.children[k as number],
                                                                 this.currentLayer.markerSettings[markerIndex as number].dataSource[dataIndex as number]
                                            );
                                        }
                                    }
                                    if ((this.currentLayer.animationDuration > 0 || (maps.layersCollection[0].animationDuration > 0 && this.currentLayer.type === 'SubLayer')) && !this.isPanning) {
                                        if (maps.isTileMap) {
                                            const groupElement: Element = document.querySelector('.GroupElement');
                                            if (groupElement && !(document.querySelector('.ClusterGroupElement')) && markerAnimation) {
                                                (groupElement as HTMLElement).style.display = 'none';
                                            }
                                        } else {
                                            markerStyle = 'visibility:hidden';
                                            (currentEle as HTMLElement).style.cssText = markerStyle;
                                        }
                                    }
                                }
                                if (this.isPanning && maps.markerModule.sameMarkerData.length > 0) {
                                    clusterSeparate(maps.markerModule.sameMarkerData, maps, currentEle, true);
                                } else if (maps.markerModule.sameMarkerData.length > 0) {
                                    maps.markerModule.sameMarkerData = [];
                                    if (document.getElementById(maps.element.id + '_mapsTooltip')) {
                                        removeElement(maps.element.id + '_mapsTooltip');
                                    }
                                }
                                if (document.getElementById(maps.element.id + '_mapsTooltip') && maps.mapsTooltipModule.tooltipTargetID.indexOf('_MarkerIndex_')
                                    && !this.isPanning) {
                                    const mapsTooltip: MapsTooltip = maps.mapsTooltipModule;
                                    const tooltipElement: Element = currentEle.querySelector('#' + mapsTooltip.tooltipTargetID);
                                    if (!isNullOrUndefined(tooltipElement)) {
                                        if (tooltipElement['style']['visibility'] === 'hidden') {
                                            removeElement(maps.element.id + '_mapsTooltip');
                                        } else {
                                            let x: number = parseFloat(tooltipElement.getAttribute('transform').split('(')[1].split(')')[0].split(' ')[1]);
                                            let y: number = parseFloat(tooltipElement.getAttribute('transform').split('(')[1].split(')')[0].split(' ')[2]);
                                            if (maps.isTileMap) {
                                                x += +getElement(maps.element.id + '_tile_parent')['style']['left'].split('px')[0];
                                                y += +getElement(maps.element.id + '_tile_parent')['style']['top'].split('px')[0];
                                            }
                                            mapsTooltip.svgTooltip.location.x = x;
                                            mapsTooltip.svgTooltip.location.y = y;
                                            mapsTooltip.svgTooltip.enableAnimation = false;
                                        }
                                    }
                                }
                            }
                        } else if (currentEle.id.indexOf('_bubble_Group') > -1) {
                            let childElement: HTMLElement;
                            for (let k: number = 0; k < currentEle.childElementCount; k++) {
                                childElement = currentEle.childNodes[k as number] as HTMLElement;
                                layerIndex = parseFloat(childElement.id.split('_LayerIndex_')[1].split('_')[0]);
                                const bubleIndex: number = parseFloat(childElement.id.split('_BubbleIndex_')[1].split('_')[0]);
                                const dataIndex: number = parseFloat(childElement.id.split('_BubbleIndex_')[1].split('_')[2]);
                                for (let l: number = 0; l < maps.bubbleModule.bubbleCollection.length; l++) {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const bubbleCollection: any = maps.bubbleModule.bubbleCollection[l as number];
                                    if (bubbleCollection['LayerIndex'] === layerIndex && bubbleCollection['BubbleIndex'] === bubleIndex &&
                                        bubbleCollection['DataIndex'] === dataIndex) {
                                        const centerX: number = bubbleCollection['center']['x'];
                                        const centerY: number = bubbleCollection['center']['y'];
                                        const currentX: number = ((centerX + x) * scale);
                                        const currentY: number = ((centerY + y) * scale);
                                        const duration: number = this.currentLayer.animationDuration;
                                        if (!animate || duration === 0) {
                                            childElement.setAttribute('transform', 'translate( ' + currentX + ' ' + currentY + ' )');
                                        } else {
                                            smoothTranslate(childElement, 0, duration, new MapLocation(currentX, currentY));
                                        }
                                        break;
                                    }
                                }
                            }
                        } else if (currentEle.id.indexOf('_dataLableIndex_Group') > -1 && !isNullOrUndefined(maps.layers[this.index])) {
                            this.intersect = []; maps.zoomLabelPositions = [];
                            maps.zoomLabelPositions = maps.dataLabelModule.dataLabelCollections;
                            const labelAnimate: boolean = !maps.isTileMap && animate;
                            for (let k: number = 0; k < currentEle.childElementCount; k++) {
                                if (currentEle.childNodes[k as number]['id'].indexOf('_LabelIndex_') > -1) {
                                    const labelIndex: number = parseFloat(currentEle.childNodes[k as number]['id'].split('_LabelIndex_')[1].split('_')[0]);
                                    this.zoomshapewidth = (currentEle.childNodes[k as number] as Element).getBoundingClientRect();
                                    maps.zoomShapeCollection.push(this.zoomshapewidth);
                                    this.dataLabelTranslate(<Element>currentEle.childNodes[k as number], factor, x, y, scale, 'DataLabel', labelAnimate);
                                    const dataLabel: DataLabelSettingsModel = maps.layers[this.index].dataLabelSettings;
                                    const border: BorderModel = dataLabel.border;
                                    if (k > 0 && border['width'] > 1) {
                                        if (currentEle.childNodes[k - 1]['id'].indexOf('_rectIndex_') > -1 && !isNullOrUndefined(maps.zoomLabelPositions[labelIndex as number])) {
                                            const labelX: number = ((maps.zoomLabelPositions[labelIndex as number]['location']['x'] + x) * scale);
                                            const labelY: number = ((maps.zoomLabelPositions[labelIndex as number]['location']['y'] + y) * scale);
                                            const zoomtext: string = currentEle.childNodes[k as number]['innerHTML'];
                                            const style: FontModel = maps.layers[this.index].dataLabelSettings.textStyle;
                                            const zoomtextSize: Size = measureText(zoomtext, style);
                                            const padding: number = 5;
                                            const rectElement: ChildNode = currentEle.childNodes[k - 1];
                                            const rectX: number = labelX - zoomtextSize['width'] / 2;
                                            const rectY: number = labelY - zoomtextSize['height'] / 2 - padding;
                                            rectElement['setAttribute']('x', rectX);
                                            rectElement['setAttribute']('y', rectY);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                maps.arrangeTemplate();
            }
            if (!isNullOrUndefined(this.currentLayer)) {
                if (!animate || this.currentLayer.animationDuration === 0 || maps.isTileMap) {
                    this.processTemplate(x, y, scale, maps);
                }
            }
        }
    }

    private markerTranslates(
        element: Element | HTMLElement, factor: number, x: number, y: number, scale: number, type: string, layerElement: Element, animate: boolean = false
    ): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let templateFn: any;
        let nullCount: number = 0;
        let markerCounts: number = 0;
        let markerTemplateCounts : number = 0;
        const layerIndex: number = parseInt((element ? element : layerElement).id.split('_LayerIndex_')[1].split('_')[0], 10);
        const markerSVGObject: Element = this.maps.renderer.createGroup({
            id: this.maps.element.id + '_Markers_Group',
            class: 'GroupElement'
        });
        (markerSVGObject as HTMLElement).style.pointerEvents = 'auto';
        if (document.getElementById(markerSVGObject.id)) {
            removeElement(markerSVGObject.id);
        }
        const mapsAreaRect: Rect = this.maps.mapAreaRect;
        const markerTemplateElements: HTMLElement = createElement('div', {
            id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_Markers_Template_Group',
            className: 'template'
        });
        markerTemplateElements.style.cssText = 'overflow: hidden; position: absolute;pointer-events: none;' +
                                                'top:' + mapsAreaRect.y + 'px;' +
                                                'left:' + mapsAreaRect.x + 'px;' +
                                                'height:' + mapsAreaRect.height + 'px;' +
                                                'width:' + mapsAreaRect.width + 'px;';
        if (document.getElementById(markerTemplateElements.id)) {
            removeElement(markerTemplateElements.id);
        }
        const currentLayers: LayerSettings = <LayerSettings>this.maps.layersCollection[layerIndex as number];
        currentLayers.markerSettings.map((markerSettings: MarkerSettings, markerIndex: number) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const markerDatas: any[] = <any[]>markerSettings.dataSource;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Array.prototype.forEach.call(markerDatas, (data: any, dataIndex: number) => {
                this.maps.markerNullCount = markerIndex >= 0 && dataIndex === 0 ? 0 : this.maps.markerNullCount;
                let eventArgs: IMarkerRenderingEventArgs = {
                    template: markerSettings.template, data: data, maps: this.maps, marker: markerSettings,
                    cancel: false, name: markerRendering, fill: markerSettings.fill, colorValuePath: markerSettings.colorValuePath,
                    shapeValuePath: markerSettings.shapeValuePath, height: markerSettings.height,
                    width: markerSettings.width, imageUrl: markerSettings.imageUrl, imageUrlValuePath: markerSettings.imageUrlValuePath, shape: markerSettings.shape,
                    border: markerSettings.border
                };
                eventArgs = markerShapeChoose(eventArgs, data);
                eventArgs = markerColorChoose(eventArgs, data);
                this.maps.trigger('markerRendering', eventArgs, (MarkerArgs: IMarkerRenderingEventArgs) => {
                    if (markerSettings.shapeValuePath !== eventArgs.shapeValuePath ) {
                        eventArgs = markerShapeChoose(eventArgs, data);
                    }
                    if (markerSettings.colorValuePath !== eventArgs.colorValuePath ) {
                        eventArgs = markerColorChoose(eventArgs, data);
                    }
                    const lati: number = (!isNullOrUndefined(markerSettings.latitudeValuePath)) ?
                        Number(getValueFromObject(data, markerSettings.latitudeValuePath)) : !isNullOrUndefined(data['latitude']) ?
                            parseFloat(data['latitude']) : !isNullOrUndefined(data['Latitude']) ? data['Latitude'] : null;
                    const long: number = (!isNullOrUndefined(markerSettings.longitudeValuePath)) ?
                        Number(getValueFromObject(data, markerSettings.longitudeValuePath)) : !isNullOrUndefined(data['longitude']) ?
                            parseFloat(data['longitude']) : !isNullOrUndefined(data['Longitude']) ? data['Longitude'] : null;
                    const offset: Point = markerSettings.offset;
                    if (!eventArgs.cancel && markerSettings.visible && !isNullOrUndefined(long) && !isNullOrUndefined(lati)) {
                        const markerID: string = this.maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_'
                            + markerIndex + '_dataIndex_' + dataIndex;
                        const location: Point = (this.maps.isTileMap) ? convertTileLatLongToPoint(
                            new MapLocation(long, lati), this.maps.tileZoomLevel, this.maps.tileTranslatePoint, true
                        ) : convertGeoToPoint(lati, long, factor, currentLayers, this.maps);
                        const transPoint: Point = {x: x, y: y};
                        if (eventArgs.template && (!isNaN(location.x) && !isNaN(location.y))) {
                            markerTemplateCounts++;
                            markerTemplate(eventArgs, templateFn, markerID, data, markerIndex, markerTemplateElements, location, transPoint,
                                           scale, offset, this.maps);
                        } else  if (!eventArgs.template && (!isNaN(location.x) && !isNaN(location.y))) {
                            markerCounts++;
                            marker(eventArgs, markerSettings, markerDatas, dataIndex, location, transPoint,
                                   markerID, offset, scale, this.maps, markerSVGObject);
                        }
                    }
                    nullCount += (!isNaN(lati) && !isNaN(long)) ? 0 : 1;
                    markerTemplateCounts += (eventArgs.cancel) ? 1 : 0;
                    markerCounts += (eventArgs.cancel) ? 1 : 0;
                    this.maps.markerNullCount = (isNullOrUndefined(lati) || isNullOrUndefined(long))
                        ? this.maps.markerNullCount + 1 : this.maps.markerNullCount;
                    const markerDataLength: number = markerDatas.length - this.maps.markerNullCount;
                    if (markerSVGObject.childElementCount === (markerDataLength - markerTemplateCounts - nullCount) && (type !== 'Template')) {
                        layerElement.appendChild(markerSVGObject);
                        if (currentLayers.markerClusterSettings.allowClustering) {
                            this.maps.svgObject.appendChild(markerSVGObject);
                            this.maps.element.appendChild(this.maps.svgObject);
                            clusterTemplate(currentLayers, markerSVGObject, this.maps, layerIndex, markerSVGObject, layerElement, true, true);
                        }
                    }
                    if (markerTemplateElements.childElementCount === (markerDataLength - markerCounts - nullCount) && getElementByID(this.maps.element.id + '_Secondary_Element')) {
                        getElementByID(this.maps.element.id + '_Secondary_Element').appendChild(markerTemplateElements);
                        if (scale >= 1) {
                            if (currentLayers.markerClusterSettings.allowClustering) {
                                clusterTemplate(currentLayers, markerTemplateElements, this.maps, layerIndex, markerSVGObject, layerElement, false, true) ;
                            }
                        }
                    }
                });
            });
        });
    }
    /**
     * To translate the layer template elements
     *
     * @param {number} x - Specifies the x value
     * @param {number} y - Specifies the y value
     * @param {number} scale - Specifies the scale value
     * @param {Maps} maps - Specifies the maps value
     * @returns {void}
     * @private
     */
    public processTemplate(x: number, y: number, scale: number, maps: Maps): void {
        for (let i: number = 0; i < this.templateCount; i++) {
            const factor: number = maps.mapLayerPanel.calculateFactor(this.currentLayer);
            const markerTemplateElement: HTMLElement = <HTMLElement>getElementByID(maps.element.id + '_LayerIndex_' +
                i + '_Markers_Template_Group');
            const datalabelTemplateElemement: HTMLElement = <HTMLElement>getElementByID(maps.element.id + '_LayerIndex_'
                + i + '_Label_Template_Group');
            if ((!isNullOrUndefined(markerTemplateElement)) && markerTemplateElement.childElementCount > 0) {
                for (let k: number = 0; k < markerTemplateElement.childElementCount; k++) {
                    this.markerTranslate(<HTMLElement>markerTemplateElement.childNodes[k as number], factor, x, y, scale, 'Template');
                }
            }
            if ((!isNullOrUndefined(datalabelTemplateElemement)) && datalabelTemplateElemement.childElementCount > 0) {
                for (let k: number = 0; k < datalabelTemplateElemement.childElementCount; k++) {
                    this.dataLabelTranslate(<HTMLElement>datalabelTemplateElemement.childNodes[k as number], factor, x, y, scale, 'Template');
                }
            }
        }
    }

    private dataLabelTranslate(element: Element | HTMLElement, factor: number, x: number, y: number, scale: number, type: string, animate: boolean = false): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const labelCollection: any[] = this.maps.dataLabelModule.dataLabelCollections;
        let text: string; let trimmedLable: string;
        const style: FontModel = this.maps.layers[this.index].dataLabelSettings.textStyle;
        let zoomtext: string; let zoomtextSize: Size; let zoomtrimLabel: string;
        const layerIndex: number = parseFloat(element.id.split('_LayerIndex_')[1].split('_')[0]);
        const shapeIndex: number = parseFloat(element.id.split('_shapeIndex_')[1].split('_')[0]);
        let labelIndex: number;
        if (element.id.indexOf('_LabelIndex_') > -1) {
            labelIndex = parseFloat(element.id.split('_LabelIndex_')[1].split('_')[0]);
        }
        const duration: number = this.currentLayer.animationDuration;
        for (let l: number = 0; l < labelCollection.length; l++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const label: any = labelCollection[l as number];
            if (label['layerIndex'] === layerIndex && label['shapeIndex'] === shapeIndex
                && label['labelIndex'] === labelIndex) {
                let labelX: number = label['location']['x'];
                let labelY: number = label['location']['y'];
                if (type === 'Template') {
                    let locationX: number = 0;
                    let locationY: number = 0;
                    if (this.maps.isTileMap) {
                        zoomtext = label['dataLabelText'];
                        zoomtextSize = measureText(zoomtext, style);
                        locationX = ((labelX + x) * scale) - (zoomtextSize['width'] / 2);
                        locationY = ((labelY + y) * scale) - (zoomtextSize['height']);
                    } else {
                        const layerEle: Element = getElementByID(this.maps.element.id + '_Layer_Collections');
                        labelX = ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - labelX)) * scale);
                        labelY = ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - labelY)) * scale);
                        const layerOffset: ClientRect = layerEle.getBoundingClientRect();
                        const elementOffset: ClientRect = element.parentElement.getBoundingClientRect();
                        locationX = ((labelX) + (layerOffset.left - elementOffset.left));
                        locationY = ((labelY) + (layerOffset.top - elementOffset.top));
                    }
                    (<HTMLElement>element).style.left = locationX + 'px';
                    (<HTMLElement>element).style.top = locationY + 'px';
                } else {
                    labelX = ((labelX + x) * scale); labelY = ((labelY + y) * scale);
                    zoomtext = label['dataLabelText'];
                    zoomtextSize = measureText(zoomtext, style);
                    const start: number = labelY - zoomtextSize['height'] / 4;
                    const end: number = labelY + zoomtextSize['height'] / 4;
                    const xpositionEnds: number = labelX + zoomtextSize['width'] / 2;
                    const xpositionStart: number = labelX - zoomtextSize['width'] / 2;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const textLocations: any = { rightWidth: xpositionEnds, leftWidth: xpositionStart, heightTop: start, heightBottom: end };
                    if (!animate || duration === 0) {
                        element.setAttribute('transform', 'translate( ' + labelX + ' ' + labelY + ' )');
                    }
                    if (this.maps.layers[this.index].dataLabelSettings.smartLabelMode === 'Hide') {
                        if (scale > 1) {
                            text = ((this.maps.dataLabelShape[l as number] * scale) >= zoomtextSize['width']) ? zoomtext : '';
                            element.innerHTML = text;
                        } else {
                            text = (this.maps.dataLabelShape[l as number] >= zoomtextSize['width']) ? zoomtext : '';
                            element.innerHTML = text;
                        }
                    }
                    if (this.maps.layers[this.index].dataLabelSettings.smartLabelMode === 'Trim') {
                        if (scale > 1) {
                            zoomtrimLabel = textTrim((this.maps.dataLabelShape[l as number] * scale), zoomtext, style);
                            text = zoomtrimLabel; element.innerHTML = text;
                        } else {
                            zoomtrimLabel = textTrim(this.maps.dataLabelShape[l as number], zoomtext, style);
                            text = zoomtrimLabel; element.innerHTML = text;
                        }
                    }
                    if (this.maps.layers[this.index].dataLabelSettings.intersectionAction === 'Hide') {
                        for (let m: number = 0; m < this.intersect.length; m++) {
                            if (!isNullOrUndefined(this.intersect[m as number])) {
                                if (textLocations['leftWidth'] > this.intersect[m as number]['rightWidth']
                                    || textLocations['rightWidth'] < this.intersect[m as number]['leftWidth']
                                    || textLocations['heightTop'] > this.intersect[m as number]['heightBottom']
                                    || textLocations['heightBottom'] < this.intersect[m as number]['heightTop']) {
                                    text = !isNullOrUndefined(text) ? text : zoomtext;
                                    element.innerHTML = text;
                                } else {
                                    text = ''; element.innerHTML = text;
                                    break;
                                }
                            }
                        }
                        this.intersect.push(textLocations);
                    }
                    if (this.maps.layers[this.index].dataLabelSettings.intersectionAction === 'Trim') {
                        for (let j: number = 0; j < this.intersect.length; j++) {
                            if (!isNullOrUndefined(this.intersect[j as number])) {
                                if (textLocations['rightWidth'] < this.intersect[j as number]['leftWidth']
                                    || textLocations['leftWidth'] > this.intersect[j as number]['rightWidth']
                                    || textLocations['heightBottom'] < this.intersect[j as number]['heightTop']
                                    || textLocations['heightTop'] > this.intersect[j as number]['heightBottom']) {
                                    trimmedLable = !isNullOrUndefined(text) ? text : zoomtext;
                                    if (scale > 1) {
                                        trimmedLable = textTrim((this.maps.dataLabelShape[l as number] * scale), trimmedLable, style);
                                    }
                                    element.innerHTML = trimmedLable;
                                } else {
                                    if (textLocations['leftWidth'] > this.intersect[j as number]['leftWidth']) {
                                        const width: number = this.intersect[j as number]['rightWidth'] - textLocations['leftWidth'];
                                        const difference: number = width - (textLocations['rightWidth'] - textLocations['leftWidth']);
                                        text = !isNullOrUndefined(text) ? text : zoomtext;
                                        trimmedLable = textTrim(difference, text, style);
                                        element.innerHTML = trimmedLable;
                                        break;
                                    }
                                    if (textLocations['leftWidth'] < this.intersect[j as number]['leftWidth']) {
                                        const width: number = textLocations['rightWidth'] - this.intersect[j as number]['leftWidth'];
                                        const difference: number = Math.abs(width - (textLocations['rightWidth'] - textLocations['leftWidth']));
                                        text = !isNullOrUndefined(text) ? text : zoomtext;
                                        trimmedLable = textTrim(difference, text, style);
                                        element.innerHTML = trimmedLable;
                                        break;
                                    }
                                }
                            }
                        }
                        this.intersect.push(textLocations);
                        if (isNullOrUndefined(trimmedLable)) {
                            trimmedLable = textTrim((this.maps.dataLabelShape[l as number] * scale), zoomtext, style);
                            element.innerHTML = trimmedLable;
                        }
                    }
                    if (animate || duration > 0) {
                        smoothTranslate(element, 0, duration, new MapLocation(labelX, labelY));
                    }
                }
            }
        }
    }

    private markerTranslate(
        element: Element | HTMLElement, factor: number, x: number, y: number, scale: number, type: string, animate: boolean = false
    ): void {
        const layerIndex: number = parseInt(element.id.split('_LayerIndex_')[1].split('_')[0], 10);
        const markerIndex: number = parseInt(element.id.split('_MarkerIndex_')[1].split('_')[0], 10);
        const dataIndex: number = parseInt(element.id.split('_dataIndex_')[1].split('_')[0], 10);
        const layer: LayerSettings = <LayerSettings>this.maps.layersCollection[layerIndex as number];
        const marker: MarkerSettings = <MarkerSettings>layer.markerSettings[markerIndex as number];
        if (!isNullOrUndefined(marker) && !isNullOrUndefined(marker.dataSource) && !isNullOrUndefined(marker.dataSource[dataIndex as number])) {
            const lng: number = (!isNullOrUndefined(marker.longitudeValuePath)) ?
                Number(getValueFromObject(marker.dataSource[dataIndex as number], marker.longitudeValuePath)) :
                !isNullOrUndefined(marker.dataSource[dataIndex as number]['longitude']) ? parseFloat(marker.dataSource[dataIndex as number]['longitude']) :
                    !isNullOrUndefined(marker.dataSource[dataIndex as number]['Latitude']) ? parseFloat(marker.dataSource[dataIndex as number]['Latitude']) : 0;
            const lat: number = (!isNullOrUndefined(marker.latitudeValuePath)) ?
                Number(getValueFromObject(marker.dataSource[dataIndex as number], marker.latitudeValuePath)) :
                !isNullOrUndefined(marker.dataSource[dataIndex as number]['latitude']) ? parseFloat(marker.dataSource[dataIndex as number]['latitude']) :
                    !isNullOrUndefined(marker.dataSource[dataIndex as number]['Latitude']) ? parseFloat(marker.dataSource[dataIndex as number]['Latitude']) : 0;
            const duration: number = this.currentLayer.animationDuration;
            const location: Point = (this.maps.isTileMap) ? convertTileLatLongToPoint(
                new Point(lng, lat), this.maps.tileZoomLevel, this.maps.tileTranslatePoint, true
            ) : convertGeoToPoint(lat, lng, factor, layer, this.maps);
            if (this.maps.isTileMap) {
                if (type === 'Template') {
                    const templateOffset: ClientRect = element.getBoundingClientRect();
                    (<HTMLElement>element).style.left = ((location.x - (templateOffset.width / 2)) + marker.offset.x) + 'px';
                    (<HTMLElement>element).style.top = ((location.y - (templateOffset.height / 2)) + marker.offset.y) + 'px';
                    if (this.maps.layers[this.maps.baseLayerIndex].layerType === 'GoogleStaticMap') {
                        const staticMapOffset : ClientRect = getElementByID(this.maps.element.id + '_StaticGoogleMap').getBoundingClientRect();
                        const staticMapOffsetWidth : number  = 640;
                        if (element['style']['display'] !== 'none') {
                            if ((staticMapOffset['x'] > templateOffset['x']  || staticMapOffset['x'] + staticMapOffsetWidth < templateOffset['x'] + templateOffset['width'])
                            && (staticMapOffset['y'] > templateOffset['y'] || staticMapOffset['y'] + staticMapOffset['height'] < templateOffset['y'] + templateOffset['height'])
                            ) {
                                (element as HTMLElement).style.display = 'none';
                            } else if ((staticMapOffset['x'] > templateOffset['x'] || staticMapOffset['x'] + staticMapOffsetWidth < templateOffset['x'] + templateOffset['width'])) {
                                (element as HTMLElement).style.display = 'none';
                            }
                        }
                    }

                } else {
                    location.x += marker.offset.x;
                    location.y += marker.offset.y;
                    element.setAttribute('transform', 'translate( ' + location.x + ' ' + location.y + ' )');
                }
            } else {
                if (type === 'Template') {
                    if (duration > 0) {
                        location.x = ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - location.x)) * scale);
                        location.y = ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - location.y)) * scale);
                        const layerOffset: ClientRect = getElementByID(this.maps.element.id + '_Layer_Collections').getBoundingClientRect();
                        const elementOffset: ClientRect = element.parentElement.getBoundingClientRect();
                        (<HTMLElement>element).style.left = (((location.x) + (layerOffset.left - elementOffset.left)) + marker.offset.x) + 'px';
                        (<HTMLElement>element).style.top = (((location.y) + (layerOffset.top - elementOffset.top)) + marker.offset.y) + 'px';
                        (<HTMLElement>element).style.transform = 'translate(-50%, -50%)';
                    } else {
                        const elementOffset: ClientRect = element.getBoundingClientRect();
                        (<HTMLElement>element).style.left = ((location.x + x) * scale) + marker.offset.x - this.maps.mapAreaRect.x - (elementOffset.width / 2) + 'px';
                        (<HTMLElement>element).style.top = ((location.y + y) * scale) + marker.offset.y - this.maps.mapAreaRect.y - (elementOffset.height / 2) + 'px';
                    }
                } else {
                    location.x = (((location.x + x) * scale) + marker.offset.x);
                    location.y = (((location.y + y) * scale) + marker.offset.y);
                    if (!animate || duration === 0) {
                        element.setAttribute('transform', 'translate( ' + location.x + ' ' + location.y + ' )');
                    } else {
                        smoothTranslate(element, 0, duration, location);
                    }
                }
            }
        }
    }
    private markerLineAnimation(map: Maps): void {
        if (map.isTileMap) {
            for (let i: number = 0; i < map.layersCollection.length; i++) {
                const markerTemplateElement: HTMLElement = <HTMLElement>getElementByID(this.maps.element.id + '_LayerIndex_' + i + '_Markers_Template_Group');
                const lineElement: HTMLElement = <HTMLElement>getElementByID(this.maps.element.id + '_LayerIndex_' + i + '_line_Group');
                if (!isNullOrUndefined(markerTemplateElement)) {
                    markerTemplateElement.style.visibility = 'hidden';
                }
                if (!isNullOrUndefined(lineElement)) {
                    lineElement.style.visibility = 'hidden';
                }
            }
        }
    }
    /**
     * @param {PanDirection} direction - Specifies the direction of the panning.
     * @param {number} xDifference - Specifies the distance moved in the horizontal direction.
     * @param {number} yDifference - Specifies the distance moved in the vertical direction.
     * @param {PointerEvent | TouchEvent | KeyboardEvent} mouseLocation - Specifies the pointer event argument.
     * @returns {void}
     * @private
     */
    public panning(direction: PanDirection, xDifference: number, yDifference: number, mouseLocation?: PointerEvent | TouchEvent | KeyboardEvent): void {
        const map: Maps = this.maps; let panArgs: IMapPanEventArgs;
        const down: Point = this.mouseDownPoints;
        const move: Point = this.mouseMovePoints;
        const scale: number = map.scale;
        map.markerZoomedState = false;
        map.zoomPersistence = map.enablePersistence;
        map.defaultState = false;
        map.initialCheck = false;
        const translatePoint: Point = map.translatePoint;
        const prevTilePoint: Point = map.tileTranslatePoint;
        let x: number; let y: number;
        xDifference = !isNullOrUndefined(xDifference) ? xDifference : (down.x - move.x);
        yDifference = !isNullOrUndefined(yDifference) ? yDifference : (down.y - move.y);
        this.maps.mergeCluster();
        if (!map.isTileMap) {
            const legendElement: HTMLElement = document.getElementById(map.element.id + '_Legend_Group');
            const legendHeight: number = !isNullOrUndefined(legendElement) ? legendElement.getClientRects()[0].height : 0;
            x = translatePoint.x - xDifference / scale;
            y = translatePoint.y - yDifference / scale;
            const layerRect: ClientRect = getElementByID(map.element.id + '_Layer_Collections').getBoundingClientRect();
            const elementRect: ClientRect = getElementByID(map.element.id + '_svg').getBoundingClientRect();
            const panningXDirection: boolean = ((xDifference < 0 ? layerRect.left <= (elementRect.left + map.mapAreaRect.x) :
                ((layerRect.left + layerRect.width + map.mapAreaRect.x) >= (elementRect.width))));
            const panningYDirection: boolean = ((yDifference < 0 ? layerRect.top <= (elementRect.top + map.mapAreaRect.y) :
                ((layerRect.top + layerRect.height + legendHeight + map.margin.top) >= (elementRect.top + elementRect.height))));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const location: any = this.maps.getGeoLocation(this.maps.layersCollection.length - 1, mouseLocation['layerX'], mouseLocation['layerY']);
            panArgs = {
                cancel: false, name: pan, maps: map,
                tileTranslatePoint: {}, translatePoint: { previous: translatePoint, current: new Point(x, y) },
                scale: map.scale, tileZoomLevel: map.tileZoomLevel, latitude: location['latitude'], longitude: location['longitude']
            };
            map.trigger(pan, panArgs);
            if (!panArgs.cancel) {
                if (panningXDirection && panningYDirection) {
                    map.translatePoint = new Point(x, y);
                    this.applyTransform(map);
                } else if (panningXDirection) {
                    map.translatePoint = new Point(x, map.translatePoint.y);
                    this.applyTransform(map);
                } else if (panningYDirection) {
                    map.translatePoint = new Point(map.translatePoint.x, y);
                    this.applyTransform(map);
                }
            }
            this.maps.zoomNotApplied = false;
        } else if (this.maps.tileZoomLevel > 1) {
            x = map.tileTranslatePoint.x - xDifference;
            y = map.tileTranslatePoint.y - yDifference;
            this.distanceX = x - map.tileTranslatePoint.x;
            this.distanceY = y - map.tileTranslatePoint.y;
            map.tileTranslatePoint.x = x;
            map.tileTranslatePoint.y = y;
            if ((map.tileTranslatePoint.y > -10 && yDifference < 0) || ((map.tileTranslatePoint.y < -((Math.pow(2, this.maps.tileZoomLevel) - 2) * 256) && yDifference > 0))) {
                map.tileTranslatePoint.x = x + xDifference;
                map.tileTranslatePoint.y = y + yDifference;
            }
            map.translatePoint.x = (map.tileTranslatePoint.x - xDifference) / map.scale;
            map.translatePoint.y = (map.tileTranslatePoint.y - yDifference) / map.scale;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const location: any = this.maps.getTileGeoLocation(mouseLocation['layerX'], mouseLocation['layerY']);
            panArgs = {
                cancel: false, name: pan, maps: map,
                tileTranslatePoint: { previous: prevTilePoint, current: map.tileTranslatePoint },
                translatePoint: { previous: translatePoint, current: map.translatePoint }, scale: map.scale,
                tileZoomLevel: map.tileZoomLevel, latitude: location['latitude'], longitude: location['longitude']
            };
            map.trigger(pan, panArgs);
            map.mapLayerPanel.generateTiles(map.tileZoomLevel, map.tileTranslatePoint, 'Pan');
            this.applyTransform(map);
        }
        map.zoomTranslatePoint = map.translatePoint;
        this.mouseDownPoints = this.mouseMovePoints;
        this.isSingleClick = false;
    }

    private toAlignSublayer(): void {
        this.maps.translatePoint.x = !isNullOrUndefined(this.distanceX) ? (this.maps.translatePoint.x -
            (this.distanceX / this.maps.scale)) : this.maps.translatePoint.x;
        this.maps.translatePoint.y = !isNullOrUndefined(this.distanceY) ? this.maps.translatePoint.y -
            (this.distanceY / this.maps.scale) : this.maps.translatePoint.y;
        this.applyTransform(this.maps, false);
    }

    public toolBarZooming(zoomFactor: number, type: string): void {
        const map: Maps = this.maps;
        map.initialCheck = false;
        map.defaultState = ((type === 'Reset' && zoomFactor === 1 && !(map.zoomSettings.resetToInitial && map.applyZoomReset))
            || (type === 'ZoomOut' && zoomFactor === 1));
        const prevLevel: number = map.tileZoomLevel;
        const scale: number = map.previousScale = map.scale;
        map.markerZoomedState = false;
        map.zoomPersistence = map.enablePersistence;
        map.mapScaleValue = zoomFactor;
        const maxZoom: number = map.zoomSettings.maxZoom;
        const minZoom: number = map.zoomSettings.minZoom;
        const size: Rect = map.mapAreaRect;
        const translatePoint: Point = map.previousPoint = map.translatePoint;
        const prevTilePoint: Point = map.tileTranslatePoint;
        map.previousProjection = map.projectionType;
        zoomFactor = (type === 'ZoomOut') ? (Math.round(zoomFactor) === 1 ? 1 : zoomFactor) : zoomFactor;
        zoomFactor = (type === 'Reset') ? 1 : (Math.round(zoomFactor) === 0) ? 1 : zoomFactor;
        zoomFactor = (minZoom > zoomFactor && type === 'ZoomIn') ? minZoom + 1 : zoomFactor;
        let zoomArgs: IMapZoomEventArgs;
        if ((!map.isTileMap) && (type === 'ZoomIn' ? zoomFactor >= minZoom && zoomFactor <= maxZoom : zoomFactor >= minZoom
        || map.isReset)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const min: any = map.baseMapRectBounds['min'] as any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const max: any = map.baseMapRectBounds['max'] as any;
            let mapWidth: number = Math.abs(max['x'] - min['x']);
            let mapHeight: number = Math.abs(min['y'] - max['y']);
            let translatePointX: number;
            let translatePointY: number;
            if (zoomFactor < 1.2 && map.projectionType !== 'Eckert5') {
                if (mapHeight === 0 || mapWidth === 0 || mapHeight === mapWidth) {
                    mapWidth = size.width / 2;
                    mapHeight = size.height;
                }
                zoomFactor = parseFloat(Math.min(size.width / mapWidth, size.height / mapHeight).toFixed(2));
                zoomFactor = zoomFactor > 1.05 ? 1 : zoomFactor;
                map.translatePoint = this.calculateInitalZoomTranslatePoint(zoomFactor, mapWidth, mapHeight, size, min, map);
            } else {
                translatePointX = translatePoint.x - (((size.width / scale) - (size.width / zoomFactor)) / 2);
                translatePointY = translatePoint.y - (((size.height / scale) - (size.height / zoomFactor)) / 2);
                const currentHeight: number = Math.abs(map.baseMapRectBounds['max']['y'] - map.baseMapRectBounds['min']['y']) * zoomFactor;
                translatePointX = (currentHeight < map.mapAreaRect.height) ? (size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2))))
                    : translatePointX;
                translatePointY = (currentHeight < map.mapAreaRect.height) ? (size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2))))
                    : translatePointY;
                map.translatePoint = new Point(translatePointX, translatePointY);
            }
            map.zoomTranslatePoint = map.translatePoint;
            map.scale = zoomFactor;
            if (this.triggerZoomEvent(prevTilePoint, prevLevel, type)) {
                map.translatePoint = map.zoomTranslatePoint = map.previousPoint;
                map.scale = map.previousScale;
            } else {
                this.applyTransform(map, true);
            }
        } else if ((map.isTileMap) && ((zoomFactor >= minZoom && zoomFactor <= maxZoom) || map.isReset)) {
            let tileZoomFactor: number = prevLevel < minZoom && !map.isReset ? minZoom : zoomFactor;
            map.scale = Math.pow(2, tileZoomFactor - 1);
            map.tileZoomLevel = tileZoomFactor;
            if (map.previousScale !== map.scale || map.isReset) {
                map.zoomSettings.zoomFactor = zoomFactor;
                const position: Point = { x: map.availableSize.width / 2, y: map.availableSize.height / 2 };
                this.getTileTranslatePosition(prevLevel, tileZoomFactor, position, type);
                if (map.zoomSettings.resetToInitial && map.applyZoomReset && type === 'Reset' || (type === 'ZoomOut' && map.zoomSettings.resetToInitial && map.applyZoomReset && tileZoomFactor <= map.initialZoomLevel)) {
                    map.initialCheck = true;
                    map.zoomPersistence = false;
                    map.tileTranslatePoint.x = map.initialTileTranslate.x;
                    map.tileTranslatePoint.y = map.initialTileTranslate.y;
                    tileZoomFactor = map.tileZoomLevel = map.mapScaleValue = map.initialZoomLevel;
                }
                if (this.triggerZoomEvent(prevTilePoint, prevLevel, type)) {
                    map.translatePoint = map.tileTranslatePoint = new Point(0, 0);
                    map.scale = map.previousScale;
                    map.tileZoomLevel = prevLevel;
                    map.zoomSettings.zoomFactor = map.previousScale;
                } else {
                    map.translatePoint.y = (map.tileTranslatePoint.y - (0.01 * map.mapScaleValue)) / map.scale;
                    map.translatePoint.x = (map.tileTranslatePoint.x - (0.01 * map.mapScaleValue)) / map.scale;
                    if (document.getElementById(this.maps.element.id + '_LayerIndex_1')) {
                        document.getElementById(this.maps.element.id + '_LayerIndex_1').style.display = 'none';
                    }
                    if (document.querySelector('.GroupElement')) {
                        (document.querySelector('.GroupElement') as HTMLElement).style.display = 'none';
                    }
                    this.markerLineAnimation(map);
                    map.mapLayerPanel.generateTiles(tileZoomFactor, map.tileTranslatePoint, type);
                    const element1: HTMLElement = document.getElementById(this.maps.element.id + '_tiles');
                    const animationDuration: number = this.maps.layersCollection[0].animationDuration;
                    setTimeout(() => {
                        if (type === 'ZoomOut' || type === 'Reset') {
                            // element1.removeChild(element1.children[element1.childElementCount - 1]);
                            // element1.childElementCount ? element1.removeChild(element1.children[element1.childElementCount - 1]) : element1;
                        }
                        this.applyTransform(this.maps, true);
                        if (document.getElementById(this.maps.element.id + '_LayerIndex_1')) {
                            document.getElementById(this.maps.element.id + '_LayerIndex_1').style.display = 'block';
                        }
                        this.maps.isAddLayer = false;
                    }, animationDuration);
                }
            }
            this.maps.zoomNotApplied = false;
        }
    }

    public createZoomingToolbars(): void {
        const map: Maps = this.maps;
        let zoomInElements: Element;
        let zoomOutElements: Element;
        this.toolBarGroup = map.renderer.createGroup({
            id: map.element.id + '_Zooming_KitCollection',
            opacity: map.theme.toLowerCase() === 'fluentdark' ? 0.6 : 0.3
        });
        const kitHeight: number = 16; const kitWidth: number = 16;
        let xSpacing: number = 15; let ySpacing: number = 15;
        const padding: number = 20;
        const orientation: Orientation = map.zoomSettings.toolBarOrientation;
        const toolbarsCollection: string[] = map.zoomSettings.toolbars;
        let shadowElement: string = '<filter id="chart_shadow" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/>';
        shadowElement += '<feOffset dx="-3" dy="4" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="1"/>';
        shadowElement += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        const toolBarLength: number = map.zoomSettings.toolbars.length;
        const toolWidth: number = (map.zoomSettings.toolBarOrientation === 'Horizontal') ? (toolBarLength * kitWidth) + (toolBarLength * padding) : (kitWidth * 2);
        const toolHeight: number = (map.zoomSettings.toolBarOrientation === 'Horizontal') ? (kitHeight * 2) : (toolBarLength * kitHeight) + (toolBarLength * padding);
        const defElement: Element = map.renderer.createDefs();
        defElement.innerHTML = shadowElement;
        this.toolBarGroup.appendChild(defElement);
        const outerElement: Element = map.renderer.drawRectangle(new RectOption(
            map.element.id + '_Zooming_Rect', 'transparent', { color: 'transparent', width: 1 },
            0.1, new Rect(0, 0, toolWidth, toolHeight), 0, 0
        ));
        outerElement.setAttribute('filter', 'url(#chart_shadow)');
        this.toolBarGroup.appendChild(outerElement);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let performFunction: any;
        for (let i: number = 0; i < toolbarsCollection.length; i++) {
            const toolbar: string = toolbarsCollection[i as number];
            let pathOptions: PathOption; let polyOptions: PolygonOption;
            this.currentToolbarEle = map.renderer.createGroup({
                id: map.element.id + '_Zooming_ToolBar_' + toolbar + '_Group',
                transform: 'translate( ' + xSpacing + ' ' + ySpacing + ' ) '
            });
            this.currentToolbarEle.setAttribute('class', 'e-maps-toolbar');
            const fillColor: string = '';
            const fill: string = 'transparent';
            let direction: string = ''; const polygonDirection: string = '';
            this.selectionColor = this.maps.zoomSettings.selectionColor || this.maps.themeStyle.zoomSelectionColor;
            switch (toolbar.toLowerCase()) {
            case 'zoom': {
                let fillColor: string;
                let strokeColor: string;
                direction = 'M0.001,14.629L1.372,16l4.571-4.571v-0.685l0.228-0.274c1.051,0.868,2.423,1.417,3.885,1.417c3.291,0,';
                direction += '5.943-2.651,5.943-5.943S13.395,0,10.103,0S4.16,2.651,4.16,5.943c0,1.508,0.503,2.834,1.417,3.885l-0.274,0.228H4.571';
                direction = direction + 'L0.001,14.629L0.001,14.629z M5.943,5.943c0-2.285,1.828-4.114,4.114-4.114s4.114,1.828,4.114,';
                if (this.maps.zoomSettings.enablePanning && !this.maps.zoomSettings.enableSelectionZooming) {
                    fillColor = fill;
                    strokeColor = this.maps.themeStyle.zoomFillColor;
                } else if (this.maps.zoomSettings.enablePanning && this.maps.zoomSettings.enableSelectionZooming){
                    fillColor = fill;
                    strokeColor = this.maps.themeStyle.zoomFillColor;
                } else if (!this.maps.zoomSettings.enablePanning && !this.maps.zoomSettings.enableSelectionZooming) {
                    fillColor = fill;
                    strokeColor = this.maps.themeStyle.zoomFillColor;
                } else {
                    fillColor = this.selectionColor;
                    strokeColor = this.selectionColor;
                }
                this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(
                    map.element.id + '_Zooming_ToolBar_' + toolbar, fillColor, 1, strokeColor, 1, 1, null,
                    direction + '4.114s-1.828,4.114-4.114,4.114S5.943,8.229,5.943,5.943z')
                ) as SVGPathElement);
                this.zoomElements = this.currentToolbarEle;
                this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                break;
            }
            case 'zoomin':
                direction = 'M 8, 0 L 8, 16 M 0, 8 L 16, 8';
                this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(
                    map.element.id + '_Zooming_ToolBar_' + toolbar + '_Path', fill, 3, this.maps.themeStyle.zoomFillColor, 1, 1, null, direction)
                ) as SVGPathElement);
                zoomInElements = this.currentToolbarEle;
                this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                break;
            case 'zoomout':
                direction = 'M 0, 8 L 16, 8';
                this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(
                    map.element.id + '_Zooming_ToolBar_' + toolbar, fill, 3, this.maps.themeStyle.zoomFillColor, 1, 1, null, direction)
                ) as SVGPathElement);
                zoomOutElements = this.currentToolbarEle;
                this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                break;
            case 'pan': {
                let color: string;
                direction = 'M5,3h2.3L7.275,5.875h1.4L8.65,3H11L8,0L5,3z M3,11V8.7l2.875,0.025v-1.4L3,7.35V5L0,8L3,';
                direction += '11z M11,13H8.7l0.025-2.875h-1.4L7.35,13H5l3,3L11,13z M13,5v2.3l-2.875-0.025v1.4L13,8.65V11l3-3L13,5z';
                if (this.maps.zoomSettings.enablePanning && this.maps.zoomModule.isDragZoom) {
                    color = '#737373';
                } else if (!this.maps.zoomSettings.enablePanning) {
                    color = '#737373';
                    this.currentToolbarEle.setAttribute('class', '');
                } else {
                    color = this.selectionColor;
                }
                this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(
                    map.element.id + '_Zooming_ToolBar_' + toolbar, color, 1, color, 1, 1, null,
                    direction)
                ) as SVGPathElement);
                this.panColor = color;
                this.panElements = this.currentToolbarEle;
                this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                break;
            }
            case 'reset':
                direction = 'M12.364,8h-2.182l2.909,3.25L16,8h-2.182c0-3.575-2.618-6.5-5.818-6.5c-1.128,0-2.218,0.366-3.091,';
                direction += '1.016l1.055,1.178C6.581,3.328,7.272,3.125,8,3.125C10.4,3.125,12.363,5.319,12.364,8L12.364,8z M11.091,';
                direction += '13.484l-1.055-1.178C9.419,12.672,8.728,12.875,8,12.875c-2.4,0-4.364-2.194-4.364-4.875h2.182L2.909,4.75L0,8h2.182c0,';
                this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(
                    map.element.id + '_Zooming_ToolBar_' + toolbar, this.fillColor, null, this.maps.themeStyle.zoomFillColor,
                    1, 1, null, direction + '3.575,2.618,6.5,5.818,6.5C9.128,14.5,10.219,14.134,11.091,13.484L11.091,13.484z')
                ) as HTMLElement);
                this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                break;
            }
            this.currentToolbarEle.appendChild(map.renderer.drawCircle(
                new CircleOption(map.element.id + '_Zooming_ToolBar_' + toolbar + '_Rect', fill, { color: this.maps.themeStyle.zoomFillColor, width: 1 }, 1, 8, 8, 16, '')
            ) as SVGRectElement);
            xSpacing = (orientation === 'Horizontal') ? (xSpacing + (kitWidth + padding)) : xSpacing;
            ySpacing = (orientation === 'Horizontal') ? ySpacing : (ySpacing + (kitHeight + padding));
            this.toolBarGroup.appendChild(this.currentToolbarEle);
        }
    }

    public performToolBarAction(e: PointerEvent): void {
        const target: Element = <Element>e.target;
        e.stopImmediatePropagation();
        const isTouch: boolean = e.pointerType === 'touch' || e.pointerType === '2' || (e.type.indexOf('touch') > -1);
        const toolbar: string = target.id.split('_Zooming_ToolBar_')[1].split('_')[0];
        if (isTouch) {
            this.handled = true;
            this.performZoomingByToolBar(toolbar);
        } else if ((e.type === 'mousedown' || e.type === 'pointerdown') && !this.handled) {
            this.handled = false;
            this.performZoomingByToolBar(toolbar);
        } else {
            this.handled = false;
        }
    }

    /**
     * @param {string} type - Specifies the type.
     * @returns {void}
     * @private
     */
    public performZoomingByToolBar(type: string): void {
        const map: Maps = this.maps;
        map.isReset = false;
        switch (type.toLowerCase()) {
        case 'zoom':
            this.panColor = this.fillColor;
            this.zoomColor = this.selectionColor;
            this.applySelection(this.zoomElements, this.selectionColor);
            this.applySelection(this.panElements, this.fillColor);
            break;
        case 'pan':
            if (!this.maps.zoomSettings.enablePanning) {
                this.panColor = '#737373';
            } else {
                this.panColor = this.selectionColor;
            }
            this.zoomColor = this.fillColor;
            if (!this.maps.zoomSettings.enablePanning) {
                this.applySelection(this.zoomElements, this.selectionColor);
                this.applySelection(this.panElements, this.panColor);
            } else {
                this.applySelection(this.zoomElements, this.fillColor);
                this.applySelection(this.panElements, this.panColor);
            }
            break;
        case 'zoomin':
            map.staticMapZoom = map.tileZoomLevel;
            if (map.staticMapZoom > 0 && map.staticMapZoom < 22) {
                map.staticMapZoom += 1;
            }
            this.toolBarZooming((map.isTileMap ? map.tileZoomLevel : map.scale) + 1, 'ZoomIn');
            break;
        case 'zoomout':
            map.staticMapZoom = map.tileZoomLevel;
            map.markerCenterLatitude = null;
            map.markerCenterLongitude = null;
            this.toolBarZooming((map.isTileMap ? map.tileZoomLevel : map.scale) - 1, 'ZoomOut');
            break;
        case 'reset':
            map.staticMapZoom = map.zoomSettings.enable ? map.zoomSettings.zoomFactor : 0;
            map.markerCenterLatitude = null;
            map.markerCenterLongitude = null;
            this.toolBarZooming(1, 'Reset');
            if (!this.maps.zoomSettings.enablePanning) {
                this.applySelection(this.zoomElements, this.selectionColor);
                this.applySelection(this.panElements, '#737373');
            } else {
                this.applySelection(this.zoomElements, this.fillColor);
                this.applySelection(this.panElements, this.selectionColor);
            }
        }
        this.panningStyle(type.toLowerCase());
    }

    private panningStyle(toolbar: string): void {
        const svg: Element = getElementByID(this.maps.element.id + '_svg');
        if (toolbar === 'pan' || this.isPanning) {
            svg.setAttribute('class', 'e-maps-panning');
        } else {
            svg.setAttribute('class', '');
        }
    }
    private applySelection(elements: Element, color: string): void {
        if (!elements) {
            return;
        }
        let childElement: HTMLElement;
        for (let i: number = 0; i < elements.childElementCount; i++) {
            childElement = elements.childNodes[i as number] as HTMLElement;
            if (childElement.tagName !== 'circle') {
                childElement.setAttribute('fill', color);
                childElement.setAttribute('stroke', color);
            }
        }
    }

    public showTooltip(e: PointerEvent): void {
        const text: string = (<Element>e.target).id.split('_Zooming_ToolBar_')[1].split('_')[0];
        if (!this.isTouch) {
            createTooltip('EJ2_Map_Toolbar_Tip', this.maps.getLocalizedLabel(text), (e.pageY + 10), (e.pageX + 10), '10px');
        }
    }

    public removeTooltip(): void {
        if (getElementByID('EJ2_Map_Toolbar_Tip')) {
            remove(getElementByID('EJ2_Map_Toolbar_Tip'));
        }
    }
    public alignToolBar(): void {
        const map: Maps = this.maps;
        const padding: number = 10;
        const element: HTMLElement = createElement('div', { id: map.element.id + '_ToolBar' });
        element.style.cssText = 'position:absolute;z-index:2';
        const rectSVGObject: Element = map.renderer.createSvg({
            id: map.element.id + '_Zooming_ToolBar', width: 10, height: 10
        });
        rectSVGObject.appendChild(this.toolBarGroup);
        element.appendChild(rectSVGObject);
        if (getElementByID(map.element.id + '_Secondary_Element')) {
            getElementByID(map.element.id + '_Secondary_Element').appendChild(element);
        }
        const toolBarSize: ClientRect = this.toolBarGroup.getBoundingClientRect();
        rectSVGObject.setAttribute('height', (toolBarSize.height + padding / 2).toString());
        rectSVGObject.setAttribute('width', (toolBarSize.width + padding / 2).toString());
        const size: Rect = !isNullOrUndefined(map.totalRect) ? map.totalRect : map.mapAreaRect;
        let x: number = 0; let y: number = 0;
        switch (map.zoomSettings.verticalAlignment) {
        case 'Near':
            y = size.y;
            break;
        case 'Center':
            y = (size.height / 2) - (toolBarSize.height / 2);
            break;
        case 'Far':
            y = (size.height - toolBarSize.height) - padding;
            break;
        }
        switch (map.zoomSettings.horizontalAlignment) {
        case 'Near':
            x = size.x;
            break;
        case 'Center':
            x = (size.width / 2) - (toolBarSize.width / 2);
            break;
        case 'Far':
            if (!isNullOrUndefined(map.legendModule) && map.legendSettings.position === 'Left') {
                x = size.width + size.x - toolBarSize.width - padding;
            } else {
                x = (size.width - toolBarSize.width) - padding;
            }
            break;
        }
        const extraPosition: Point = map.getExtraPosition();
        element.style.left = x + extraPosition.x + 'px';
        element.style.top = y + extraPosition.y + 'px';
        const color: string = this.maps.zoomSettings.highlightColor || this.maps.themeStyle.zoomSelectionColor;
        const css: string = ' .e-maps-toolbar:hover > circle { stroke:' + color + '; } .e-maps-toolbar:hover > path { fill: ' + color + ' ;  stroke: ' + color + '; }' +
            '.e-maps-toolbar:hover { cursor: pointer; } .e-maps-cursor-disable:hover { cursor: not-allowed; } .e-maps-panning:hover { cursor: pointer; } ' +
            '.e-maps-popup-close { display: block; opacity: 0; }';
        const style: HTMLStyleElement = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        element.appendChild(style);
    }

    /**
     * To bind events.
     *
     * @param {Element} element - Specifies the element.
     * @param {any} process - Specifies the process.
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public wireEvents(element: Element, process: any): void {
        EventHandler.add(element, Browser.touchStartEvent, process, this);
        EventHandler.add(element, 'mouseover', this.showTooltip, this);
        EventHandler.add(element, 'mouseout', this.removeTooltip, this);
    }

    public mapMouseWheel(e: WheelEvent): void {
        if (this.maps.zoomSettings.enable && this.maps.zoomSettings.mouseWheelZoom) {
            const map: Maps = this.maps;
            const size: Size = map.availableSize;
            map.markerZoomedState = false;
            map.zoomPersistence = map.enablePersistence;
            const position: Point = this.getMousePosition(e.pageX, e.pageY);
            const prevLevel: number = map.tileZoomLevel;
            const prevScale: number = map.scale;
            const delta: number = 1;
            const staticMaxZoomLevel : number = 22; // google map maximum zoom level value
            const value: number = (map.isTileMap) ? prevLevel : prevScale;
            if (((position.x > map.mapAreaRect.x) && (position.x < (map.mapAreaRect.x + map.mapAreaRect.width))) &&
                (position.y > map.mapAreaRect.y) && position.y < (map.mapAreaRect.y + map.mapAreaRect.height)) {
                e.preventDefault();
                const direction: string = (this.browserName === 'mozilla' && !this.isPointer) ?
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    -(e.detail) / 3 > 0 ? 'ZoomIn' : 'ZoomOut' : ((e as any).wheelDelta / 120) > 0 ? 'ZoomIn' : 'ZoomOut';
                if (direction === 'ZoomIn') {
                    map.mapScaleValue = value + delta;
                    map.staticMapZoom = map.tileZoomLevel;
                    if (map.staticMapZoom > 0 && map.staticMapZoom < staticMaxZoomLevel) {
                        map.staticMapZoom += 1;
                    }
                    this.performZooming(position, (value + delta), direction);
                } else {
                    map.mapScaleValue = value - delta;
                    map.isReset = (map.mapScaleValue < 1) ? true : false;
                    map.staticMapZoom = map.tileZoomLevel;
                    if (map.mapScaleValue === 1) {
                        map.markerCenterLatitude = null;
                        map.markerCenterLongitude = null;
                    }
                    if (map.staticMapZoom > 1 && map.staticMapZoom < staticMaxZoomLevel) {
                        map.staticMapZoom -= 1;
                    }
                    this.performZooming(position, (value - delta), direction);
                }
            }
        }
    }

    public doubleClick(e: PointerEvent): void {
        const pageX: number = e.pageX;
        const pageY: number = e.pageY;
        const target: Element = <Element>(<PointerEvent>e).target;
        if (this.maps.zoomSettings.enable && this.maps.zoomSettings.doubleClickZoom
            && !(e.target['id'].indexOf('_Zooming_') > -1)) {
            const position: Point = this.getMousePosition(pageX, pageY);
            const map: Maps = this.maps;
            const size: Size = map.availableSize;
            const prevLevel: number = map.tileZoomLevel;
            const prevScale: number = map.scale;
            map.mapScaleValue = map.mapScaleValue + 1;
            const value: number = (map.isTileMap) ? prevLevel : prevScale;
            if (((position.x > map.mapAreaRect.x) && (position.x < (map.mapAreaRect.x + map.mapAreaRect.width))) &&
                (position.y > map.mapAreaRect.y) && position.y < (map.mapAreaRect.y + map.mapAreaRect.height)) {
                this.performZooming(position, (value + 1), 'ZoomIn');
            }
        }
    }

    public mouseDownHandler(e: PointerEvent | TouchEvent): void {
        let pageX: number;
        let pageY: number;
        let target: Element;
        let touches: TouchList = null;
        const element: Element = <Element>e.target;
        if (e.type === 'touchstart') {
            this.isTouch = true;
            touches = (<TouchEvent & PointerEvent>e).touches;
            target = <Element>(<TouchEvent & PointerEvent>e).target;
            pageX = touches[0].clientX;
            pageY = touches[0].clientY;
        } else {
            pageX = (<PointerEvent>e).pageX;
            pageY = (<PointerEvent>e).pageY;
            target = <Element>e.target;
        }
        if (!this.maps.zoomSettings.enablePanning) {
            this.isPanning = this.panColor !== this.selectionColor ? this.maps.zoomSettings.enablePanning
                : this.zoomColor === this.selectionColor;
        } else {
            this.isPanning = this.panColor === this.selectionColor ? this.maps.zoomSettings.enablePanning
                : this.zoomColor !== this.selectionColor;
        }
        this.mouseDownLatLong = { x: pageX, y: pageY };
        this.rectZoomingStart = ((!this.isPanning) && this.maps.zoomSettings.enable);
        this.mouseDownPoints = this.getMousePosition(pageX, pageY);
        if (this.isTouch) {
            this.firstMove = true;
            this.pinchFactor = this.maps.scale;
            this.fingers = touches.length;
        }
        this.isSingleClick = true;
    }

    public mouseMoveHandler(e: PointerEvent | TouchEvent): void {
        let pageX: number;
        let pageY: number;
        const map: Maps = this.maps;
        let touchArg: TouchEvent;
        let target: Element;
        let touches: TouchList = null;
        const zoom: ZoomSettings = <ZoomSettings>this.maps.zoomSettings;
        if (e.type === 'touchmove') {
            this.isTouch = true;
            target = <Element>(<TouchEvent & PointerEvent>e).target;
            touches = (<TouchEvent & PointerEvent>e).touches;
            pageX = touches[0].clientX;
            pageY = touches[0].clientY;
        } else {
            pageX = (<PointerEvent>e).pageX;
            pageY = (<PointerEvent>e).pageY;
            target = <Element>e.target;
        }
        if (getElementByID(map.element.id + '_Zooming_KitCollection')) {
            if (target.id.indexOf('_Zooming_') > -1) {
                getElementByID(map.element.id + '_Zooming_KitCollection').setAttribute('opacity', '1');
                if (document.getElementById(map.element.id + '_Zooming_ToolBar_Pan_Group')) {
                    if (!this.maps.zoomSettings.enablePanning) {
                        if (target.id.indexOf('_Zooming_ToolBar') > -1 || target.id.indexOf('_Zooming_Rect') > -1) {
                            getElementByID(map.element.id + '_Zooming_ToolBar_Pan_Rect').setAttribute('opacity', map.theme.toLowerCase() === 'fluentdark' ? '0.6' : '0.3');
                            getElementByID(map.element.id + '_Zooming_ToolBar_Pan').setAttribute('opacity', map.theme.toLowerCase() === 'fluentdark' ? '0.6' : '0.3');
                        }
                    }
                }
            }
            else {
                getElementByID(map.element.id + '_Zooming_KitCollection').setAttribute('opacity', map.theme.toLowerCase() === 'fluentdark' ? '0.6' : '0.3');
                if (!this.maps.zoomSettings.enablePanning && document.getElementById(map.element.id + '_Zooming_ToolBar_Pan_Group')) {
                    getElementByID(map.element.id + '_Zooming_ToolBar_Pan_Rect').setAttribute('opacity', '1');
                    getElementByID(map.element.id + '_Zooming_ToolBar_Pan').setAttribute('opacity', '1');
                }
            }
        }
        if (this.isTouch) {
            if (this.maps.zoomSettings.pinchZooming) {
                if (this.firstMove && touches.length === 2) {
                    this.rectZoomingStart = false;
                    this.updateInteraction();
                    this.touchStartList = targetTouches(e);
                } else if (touches.length === 2 && this.touchStartList.length === 2) {
                    this.touchMoveList = targetTouches(e);
                    e.preventDefault();
                    this.rectZoomingStart = false;
                    this.performPinchZooming(<PointerEvent>e);
                }
                this.firstMove = false;
            }
        }
        this.mouseMovePoints = this.getMousePosition(pageX, pageY);
        const targetId: string = e.target['id'];
        const targetEle: Element = <Element>e.target;
        if (zoom.enable && this.isPanning && ((Browser.isDevice && touches.length >= 1) || !Browser.isDevice)) {
            e.preventDefault();
            this.maps.element.style.cursor = 'pointer';
            this.mouseMoveLatLong = { x: pageX, y: pageY };
            if ((this.mouseDownLatLong['x'] !== this.mouseMoveLatLong['x']) && (this.mouseDownLatLong['y'] !== this.mouseMoveLatLong['y'])) {
                if (this.maps.zoomSettings.enablePanning) {
                    this.panning('None', null, null, e);
                }
                this.mouseDownLatLong['x'] = pageX;
                this.mouseDownLatLong['y'] = pageY;
            }
        }
        if (this.isTouch ? (touches.length === 1 && this.rectZoomingStart) : this.rectZoomingStart) {
            e.preventDefault();
            if (this.maps.zoomSettings.enableSelectionZooming) {
                this.drawZoomRectangle();
            }
        }
    }

    public mouseUpHandler(e: PointerEvent | TouchEvent): void {
        let isDragZoom: boolean;
        const map: Maps = this.maps;
        this.rectZoomingStart = false;
        this.isPanning = false;
        this.isSingleClick = this.isSingleClick ? true : false;
        this.isTouch = false;
        this.touchStartList = [];
        this.touchMoveList = [];
        this.lastScale = 1;
        this.maps.element.style.cursor = 'auto';
        if ((!isNullOrUndefined(this.distanceX) || !isNullOrUndefined(this.distanceY)) && (!isNullOrUndefined(this.currentLayer) && this.currentLayer.type === 'SubLayer')) {
            this.toAlignSublayer();
            this.distanceX = this.distanceY = null;
        }
        const zoomRectElement: HTMLElement = <HTMLElement>getElementByID(this.maps.element.id + '_Selection_Rect_Zooming');
        if (zoomRectElement && this.maps.zoomSettings.enable && this.maps.zoomSettings.enableSelectionZooming) {
            isDragZoom = true;
            remove(zoomRectElement);
            this.performRectZooming();
        }
        this.mouseMoveLatLong = { x: 0, y: 0 };
        this.mouseDownLatLong = { x: 0, y: 0 };
    }

    public mouseCancelHandler(e: PointerEvent): void {
        this.isPanning = false;
        this.isTouch = false;
        this.rectZoomingStart = false;
        const zoomRectElement: HTMLElement = <HTMLElement>getElementByID(this.maps.element.id + '_Selection_Rect_Zooming');
        if (zoomRectElement && this.maps.zoomSettings.enable) {
            remove(zoomRectElement);
            this.performRectZooming();
        }
    }
    /**
     * To handle the click event for maps.
     *
     * @param {PointerEvent} e - Specifies the pointer event.
     * @returns {void}
     */
    public click(e: PointerEvent): void {
        const map: Maps = this.maps;
        if ((map.markerModule && map.markerModule.sameMarkerData.length > 0) ||
            (e.target['id'].indexOf('MarkerIndex') > -1 && e.target['id'].indexOf('cluster') === -1)) {
            return null;
        }
        if (this.isSingleClick && map.zoomSettings.zoomOnClick && !(e.target['id'].indexOf('_Zooming_') > -1) && !map.zoomSettings.doubleClickZoom
            && (this.zoomColor !== this.selectionColor)) {
            const pageX: number = e.pageX;
            const pageY: number = e.pageY;
            const position: Point = this.getMousePosition(pageX, pageY);
            const prevLevel: number = map.tileZoomLevel;
            const prevScale: number = map.scale;
            map.mapScaleValue = map.mapScaleValue + 1;
            const value: number = (map.isTileMap) ? prevLevel : prevScale;
            if (((position.x > map.mapAreaRect.x) && (position.x < (map.mapAreaRect.x + map.mapAreaRect.width))) &&
                (position.y > map.mapAreaRect.y) && position.y < (map.mapAreaRect.y + map.mapAreaRect.height)) {
                this.performZooming(position, (value + 1), 'ZoomIn');
            }
        }
    }

    public getMousePosition(pageX: number, pageY: number): Point {
        const map: Maps = this.maps;
        const elementRect: ClientRect = map.element.getBoundingClientRect();
        const pageXOffset: number = map.element.ownerDocument.defaultView.pageXOffset;
        const pageYOffset: number = map.element.ownerDocument.defaultView.pageYOffset;
        const clientTop: number = map.element.ownerDocument.documentElement.clientTop;
        const clientLeft: number = map.element.ownerDocument.documentElement.clientLeft;
        const positionX: number = elementRect.left + pageXOffset - clientLeft;
        const positionY: number = elementRect.top + pageYOffset - clientTop;
        return new Point(Math.abs(pageX - positionX), Math.abs(pageY - positionY));
    }

    public addEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        EventHandler.add(this.maps.element, this.wheelEvent, this.mapMouseWheel, this);
        EventHandler.add(this.maps.element, 'click', this.click, this);
        EventHandler.add(this.maps.element, 'dblclick', this.doubleClick, this);
        this.maps.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.maps.on(Browser.touchStartEvent, this.mouseDownHandler, this);
        this.maps.on(Browser.touchEndEvent, this.mouseUpHandler, this);
        EventHandler.add(this.maps.element, this.cancelEvent, this.mouseCancelHandler, this);
    }

    public removeEventListener(): void {
        if (this.maps.isDestroyed) {
            return;
        }
        EventHandler.remove(this.maps.element, this.wheelEvent, this.mapMouseWheel);
        EventHandler.remove(this.maps.element, 'click', this.click);
        EventHandler.remove(this.maps.element, 'dblclick', this.doubleClick);
        this.maps.off(Browser.touchMoveEvent, this.mouseMoveHandler);
        this.maps.off(Browser.touchStartEvent, this.mouseDownHandler);
        this.maps.off(Browser.touchEndEvent, this.mouseUpHandler);
        this.maps.off(this.cancelEvent, this.mouseCancelHandler);
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        return 'Zoom';
    }

    /**
     * To destroy the zoom.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.toolBarGroup = null;
        this.currentToolbarEle = null;
        this.zoomingRect = null;
        this.zoomElements = null;
        this.panElements = null;
        this.baseTranslatePoint = null;
        this.touchStartList = null;
        this.touchMoveList = null;
        this.previousTouchMoveList = null;
        this.mouseDownPoints = null;
        this.mouseMovePoints = null;
        this.startTouches = [];
        this.zoomshapewidth = null;
        this.intersect = [];
        this.mouseDownLatLong = null;
        this.mouseMoveLatLong = null;
        this.removeEventListener();
        //TODO: Calling the below code throws spec issue.
        //this.maps = null;
        this.currentLayer = null;
    }
}
