/* eslint-disable max-len */
import { Maps, Orientation, ITouches, ZoomSettings } from '../../index';
import { Point, getElementByID, Size, PathOption, Rect, convertGeoToPoint, CircleOption, convertTileLatLongToPoint, measureTextElement } from '../utils/helper';
import { RectOption, createTooltip, calculateScale, getTouchCenter, getTouches, targetTouches, Coordinate } from '../utils/helper';
import { MapLocation, zoomAnimate, smoothTranslate , measureText, textTrim, clusterTemplate, marker, getProcessedMarginValue } from '../utils/helper';
import { markerTemplate, removeElement, getElement, clusterSeparate, markerColorChoose, calculatePolygonPath } from '../utils/helper';
import { markerShapeChoose   } from '../utils/helper';
import { isNullOrUndefined, EventHandler, Browser, remove, createElement, animationMode } from '@syncfusion/ej2-base';
import { MarkerSettings, LayerSettings, changeBorderWidth, IMarkerRenderingEventArgs, markerRendering} from '../index';
import { IMapZoomEventArgs, IMapPanEventArgs, IMinMaxLatitudeLongitude, GeoPosition } from '../model/interface';
import { pan } from '../model/constants';
import { getValueFromObject } from '../utils/helper';
import { PanDirection } from '../utils/enum';
import { FontModel, DataLabelSettingsModel, BorderModel, ZoomToolbarButtonSettingsModel, ZoomToolbarTooltipSettingsModel, ZoomToolbarSettingsModel, PolygonSettingModel } from '../model/base-model';
import { MapsTooltip } from './tooltip';

/**
 * Zoom module used to process the zoom for maps
 */
export class Zoom {
    private maps: Maps;
    /** @private */
    public toolBarGroup: Element;
    private currentToolbarEle: Element;
    /** @private */
    public zoomingRect: Rect;
    /** @private */
    public selectionColor: string;
    private fillColor: string;
    private zoomElements: Element;
    private panElements: Element;
    /** @private */
    public isPanModeEnabled: boolean = false;
    /** @private */
    public mouseEnter: boolean = false;
    /** @private */
    public baseTranslatePoint: Point;
    private wheelEvent: string;
    private cancelEvent: string;
    /** @private */
    public currentScale: number;
    /** @private */
    public isTouch: boolean = false;
    /** @private */
    public rectZoomingStart: boolean = false;
    /** @private */
    public touchStartList: ITouches[] | TouchList;
    /** @private */
    public touchMoveList: ITouches[] | TouchList;
    /** @private */
    public previousTouchMoveList: ITouches[] | TouchList;
    /** @private */
    public mouseDownPoints: Point;
    /** @private */
    public mouseMovePoints: Point;
    /** @private */
    public isDragZoom: boolean;
    /** @private */
    public currentLayer: LayerSettings;
    private panColor: string;
    private clearTimeout: number;
    /** @private */
    public zoomColor: string;
    /** @private */
    public browserName: string = Browser.info.name;
    /** @private */
    public isPointer: boolean = Browser.isPointer;
    private handled: boolean = false;
    private fingers: number;
    /** @private */
    public firstMove: boolean;
    /** @private */
    public isPanningInProgress: boolean = false;
    private isPan: boolean = false;
    private isZoomFinal: boolean = false;
    private isZoomSelection: boolean = false;
    private interaction: string;
    private lastScale: number;
    private pinchFactor: number = 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private startTouches: any[] = [];
    private index: number;
    private templateCount: number;
    private pinchDistance: number;
    /** @private */
    public mouseDownLatLong: object = { x: 0, y: 0 };
    /** @private */
    public mouseMoveLatLong: object = { x: 0, y: 0 };
    /** @private */
    public isSingleClick: boolean = false;
    /** @private */
    public layerCollectionEle: Element;
    constructor(maps: Maps) {
        this.maps = maps;
        this.wheelEvent = this.browserName === 'mozilla' ? (this.isPointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';
        this.cancelEvent = this.isPointer ? 'pointerleave' : 'mouseleave';
        this.selectionColor = this.maps.zoomSettings.toolbarSettings.buttonSettings.selectionColor;
        this.fillColor = this.maps.zoomSettings.toolbarSettings.buttonSettings.color;
        this.addEventListener();
    }

    /**
     * To perform zooming for maps.
     *
     * @param {Point} position - Specifies the position.
     * @param {number} newZoomFactor - Specifies the zoom factor.
     * @param {string} type - Specifies the type.
     * @param {boolean} isMouseWheel - Indicates whether the zoom operation was triggered by the mouse wheel.
     * @returns {void}
     * @private
     */
    public performZooming(position: Point, newZoomFactor: number, type: string, isMouseWheel: boolean = false): void {
        const map: Maps = this.maps;
        map.previousProjection = newZoomFactor <= 1.5 ? undefined : map.projectionType;
        map.defaultState = false;
        map.initialCheck = false;
        map.markerZoomedState = map.isMarkerZoomCompleted = false;
        map.zoomPersistence = map.enablePersistence;
        const prevLevel: number = map.tileZoomLevel;
        const scale: number = map.previousScale = map.scale;
        const maxZoom: number = map.zoomSettings.maxZoom;
        const minZoom: number = map.zoomSettings.minZoom;
        newZoomFactor = maxZoom >= newZoomFactor ? newZoomFactor : maxZoom; let isToolbarPerform: boolean = true;
        switch (type.toLowerCase()) {
        case 'zoomin':
            isToolbarPerform = newZoomFactor <= this.maps.zoomSettings.maxZoom;
            break;
        case 'zoomout':
            isToolbarPerform = newZoomFactor >= this.maps.zoomSettings.minZoom;
            break;
        }
        if (isToolbarPerform) {
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
                map.zoomTranslatePoint = map.translatePoint;
                if (this.triggerZoomEvent(prevTilePoint, prevLevel, type)) {
                    map.translatePoint = map.previousPoint;
                    map.scale = map.mapScaleValue = map.previousScale;
                } else {
                    this.applyTransform(map, isMouseWheel);
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
                map.mapScaleValue = isNaN(map.mapScaleValue) ? 1 : map.mapScaleValue;
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
                    const animationDuration: number = this.maps.layersCollection[0].animationDuration === 0 && animationMode === 'Enable' ? 1000 : this.maps.layersCollection[0].animationDuration;
                    setTimeout(() => {
                        // if (type === 'ZoomOut') {
                        //     element1.removeChild(element1.children[element1.childElementCount - 1]);
                        //     if (element1.childElementCount) {
                        //         element1.removeChild(element1.children[element1.childElementCount - 1]);
                        //     } else {
                        //         element1 = element1;
                        //     }
                        // }
                        this.applyTransform(this.maps, isMouseWheel);
                        if (document.getElementById(this.maps.element.id + '_LayerIndex_1')) {
                            document.getElementById(this.maps.element.id + '_LayerIndex_1').style.display = 'block';
                        }
                    }, animationDuration);
                }
            }
            this.triggerZoomComplete(map, prevLevel, type);
        }
        this.maps.zoomNotApplied = false;
        if (this.maps.isDevice) {
            this.removeToolbarOpacity(map.isTileMap ? Math.round(map.tileZoomLevel) : map.scale, map.element.id + '_Zooming_');
        }
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
        if (map.isTileMap) {
            map.mapScaleValue = isNullOrUndefined(map.mapScaleValue) ? 1 : map.mapScaleValue;
            map.translatePoint.y = (map.tileTranslatePoint.y - (0.01 * map.mapScaleValue)) / map.scale;
            map.translatePoint.x = (map.tileTranslatePoint.x - (0.01 * map.mapScaleValue)) / map.scale;
        }
        const minMaxLatitudeLongitude : IMinMaxLatitudeLongitude = this.maps.getMinMaxLatitudeLongitude();
        if (!map.isTileMap) {
            zoomArgs = {
                cancel: false, name: 'zoom', type: type, maps: map,
                tileTranslatePoint: {}, translatePoint: { previous: map.previousPoint, current: map.translatePoint },
                tileZoomLevel: {}, scale: { previous: map.previousScale, current: map.scale },
                minLatitude: minMaxLatitudeLongitude.minLatitude, maxLatitude: minMaxLatitudeLongitude.maxLatitude,
                minLongitude: minMaxLatitudeLongitude.minLongitude, maxLongitude: minMaxLatitudeLongitude.maxLongitude
            };
        } else {
            zoomArgs = {
                cancel: false, name: 'zoom', type: type, maps: map,
                tileTranslatePoint: { previous: prevTilePoint, current: map.tileTranslatePoint }, translatePoint: { previous: map.previousPoint, current: map.translatePoint },
                tileZoomLevel: { previous: prevLevel, current: map.tileZoomLevel }, scale: { previous: map.previousScale, current: map.scale },
                minLatitude: minMaxLatitudeLongitude.minLatitude, maxLatitude: minMaxLatitudeLongitude.maxLatitude,
                minLongitude: minMaxLatitudeLongitude.minLongitude, maxLongitude: minMaxLatitudeLongitude.maxLongitude
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

    /**
     * @returns {void}
     * @private
     */
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
                zoomCalculationFactor = zoomCalculationFactor < this.maps.zoomSettings.maxZoom ? zoomCalculationFactor : this.maps.zoomSettings.maxZoom;
                const translatePoint: Point = map.previousPoint = map.translatePoint;
                if (zoomCalculationFactor <= maxZoom) {
                    const translatePointX: number = translatePoint.x - (((size.width / scale) - (size.width / zoomCalculationFactor)) / (size.width / x));
                    const translatePointY: number = translatePoint.y - (((size.height / scale) - (size.height / zoomCalculationFactor)) / (size.height / y));
                    map.translatePoint = new Point(translatePointX, translatePointY);
                }
                map.scale = zoomCalculationFactor < this.maps.zoomSettings.maxZoom ? zoomCalculationFactor : this.maps.zoomSettings.maxZoom;
                isZoomCancelled = this.triggerZoomEvent(prevTilePoint, prevLevel, '');
                if (isZoomCancelled) {
                    map.translatePoint = map.previousPoint;
                    map.scale = map.previousScale;
                }
                map.zoomTranslatePoint = map.translatePoint;
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
                this.applyTransform(map, false, true);
                this.maps.zoomNotApplied = false;
                this.zoomingRect = null;
            }
        }
        this.isZoomFinal = this.isZoomSelection && Math.round(map.scale) === this.maps.zoomSettings.maxZoom;
        this.triggerZoomComplete(map, prevLevel, '');
        this.removeToolbarOpacity(map.scale, this.maps.element.id + '_Zooming_');
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

    /**
     * @param {PointerEvent} e - Specifies the vent in the map
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public performPinchZooming(e: PointerEvent | TouchEvent): void {
        const map: Maps = this.maps;
        const prevLevel: number = map.tileZoomLevel;
        let zoomCalculationFactor: number = this.pinchFactor;
        let isZoomCancelled: boolean;
        const prevTilePoint: Point = map.tileTranslatePoint;
        this.maps.mergeCluster();
        if (!map.isTileMap) {
            const availSize: Rect = map.mapAreaRect;
            map.isMarkerZoomCompleted = false;
            map.previousScale = map.scale;
            map.previousPoint = map.translatePoint;
            map.previousProjection = map.projectionType;
            const scale: number = calculateScale(<ITouches[]>this.touchStartList, <ITouches[]>this.touchMoveList);
            const touchCenter: Point = getTouchCenter(getTouches(<ITouches[]>this.touchMoveList, this.maps));
            const newScale: number = scale / this.lastScale;
            this.lastScale = scale;
            this.pinchFactor *= newScale;
            this.pinchFactor = Math.min(this.maps.zoomSettings.maxZoom, Math.max(this.pinchFactor, this.maps.zoomSettings.minZoom));
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
            const touchCenter: Point = this.getTouchCenterPoint();
            const distance: number = Math.sqrt(Math.pow((this.touchMoveList[0].pageX - this.touchMoveList[1].pageX), 2) + Math.pow((this.touchMoveList[0].pageY - this.touchMoveList[1].pageY), 2));
            let factor: number = map.tileZoomLevel;
            if (!isNullOrUndefined(this.pinchDistance)) {
                if (this.pinchDistance > distance) {
                    factor = factor - 1;
                } else if (this.pinchDistance < distance) {
                    factor = factor + 1;
                }
                factor = Math.min(this.maps.zoomSettings.maxZoom, Math.max(this.maps.zoomSettings.minZoom, factor));
                if (factor !== map.tileZoomLevel) {
                    this.pinchFactor = factor;
                    map.previousScale = map.scale;
                    map.tileZoomLevel = this.pinchFactor;
                    map.scale = Math.pow(2, map.tileZoomLevel - 1);
                    this.getTileTranslatePosition(prevLevel, this.pinchFactor, { x: touchCenter.x, y: touchCenter.y }, null);
                    map.translatePoint.x = (map.tileTranslatePoint.x - (0.01 * map.scale)) / map.scale;
                    map.translatePoint.y = (map.tileTranslatePoint.y - (0.01 * map.scale)) / map.scale;
                    isZoomCancelled = this.triggerZoomEvent(prevTilePoint, prevLevel, '');
                    if (isZoomCancelled) {
                        map.translatePoint = map.tileTranslatePoint = new Point(0, 0);
                        map.scale = map.previousScale;
                        map.tileZoomLevel = prevLevel;
                        map.zoomSettings.zoomFactor = map.previousScale;
                    } else {
                        map.mapLayerPanel.generateTiles(factor, map.tileTranslatePoint);
                    }
                }
            }
            this.pinchDistance = distance;
        }
        map.mapScaleValue = zoomCalculationFactor;
        if (!isZoomCancelled) {
            this.applyTransform(map);
        }
        this.triggerZoomComplete(map, prevLevel, '');
        if (Browser.isDevice) {
            this.removeToolbarOpacity(map.isTileMap ? Math.round(map.tileZoomLevel) : map.scale, map.element.id + '_Zooming_');
        }
    }

    private getTouchCenterPoint(): Point {
        const touchList: Point[] = [];
        for (let i: number = 0; i < this.touchMoveList.length; i++) {
            touchList.push(this.getMousePosition(this.touchMoveList[i as number].pageX, this.touchMoveList[i as number].pageY));
        }
        return {
            x: (touchList[0].x + touchList[1].x) / 2,
            y: (touchList[0].y + touchList[1].y) / 2
        };
    }

    private triggerZoomComplete(map: Maps, prevLevel: number, type: string): void {
        if (map.zoomSettings.enable) {
            let zoomArgs: IMapZoomEventArgs;
            if (map.isTileMap) {
                map.mapScaleValue = isNullOrUndefined(map.mapScaleValue) ? 1 : map.mapScaleValue;
                map.translatePoint.y = (map.tileTranslatePoint.y - (0.01 * map.mapScaleValue)) / map.scale;
                map.translatePoint.x = (map.tileTranslatePoint.x - (0.01 * map.mapScaleValue)) / map.scale;
            }
            const minMaxLatitudeLongitude : IMinMaxLatitudeLongitude = this.maps.getMinMaxLatitudeLongitude();
            if (!map.isTileMap) {
                zoomArgs = {
                    cancel: false, name: 'zoomComplete', type: type, maps: map,
                    tileTranslatePoint: {}, translatePoint: { previous: map.previousPoint, current: map.translatePoint },
                    tileZoomLevel: {}, scale: { previous: map.previousScale, current: map.scale },
                    minLatitude: minMaxLatitudeLongitude.minLatitude, maxLatitude: minMaxLatitudeLongitude.maxLatitude,
                    minLongitude: minMaxLatitudeLongitude.minLongitude, maxLongitude: minMaxLatitudeLongitude.maxLongitude
                };
            } else {
                zoomArgs = {
                    cancel: false, name: 'zoomComplete', type: type, maps: map,
                    tileTranslatePoint: { previous: map.tileTranslatePoint, current: map.tileTranslatePoint }, translatePoint: { previous: map.previousPoint, current: map.translatePoint },
                    tileZoomLevel: { previous: prevLevel, current: map.tileZoomLevel }, scale: { previous: map.previousScale, current: map.scale },
                    minLatitude: minMaxLatitudeLongitude.minLatitude, maxLatitude: minMaxLatitudeLongitude.maxLatitude,
                    minLongitude: minMaxLatitudeLongitude.minLongitude, maxLongitude: minMaxLatitudeLongitude.maxLongitude
                };
            }
            this.maps.trigger('zoomComplete', zoomArgs);
        }
    }

    /**
     * @returns {void}
     * @private
     */
    public drawZoomRectangle(): void {
        const map: Maps = this.maps;
        const down: Point = this.mouseDownPoints;
        const move: Point = this.mouseMovePoints;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const border: any = { width: 1, color: this.maps.themeStyle.rectangleZoomBorderColor };
        const width: number = Math.abs(move.x - down.x);
        const height: number = Math.abs(move.y - down.y);
        const x: number = ((move.x > down.x) ? down.x : down.x - width);
        const y: number = ((move.y > down.y) ? down.y : down.y - height);
        if ((x > map.mapAreaRect.x && x < (map.mapAreaRect.x + map.mapAreaRect.width)) &&
            (y > map.mapAreaRect.y) && (y < map.mapAreaRect.y + map.mapAreaRect.height)) {
            this.zoomingRect = new Rect(x, y, width, height);
            const rectSVGObject: Element = map.renderer.createSvg({
                id: map.element.id + '_Selection_Rect_Zooming',
                width: map.availableSize.width,
                height: map.availableSize.height,
                style: 'position: absolute;'
            });
            const rectOption: RectOption = new RectOption(
                map.element.id + '_ZoomRect', this.maps.themeStyle.rectangleZoomFillColor, border, this.maps.themeStyle.rectangleZoomFillOpacity, this.zoomingRect, 0, 0, '', '3'
            );
            rectSVGObject.appendChild(map.renderer.drawRectangle(rectOption));
            getElementByID(map.element.id + '_Secondary_Element').appendChild(rectSVGObject);
        }
    }
    /**
     * To animate the zooming process.
     *
     * @param {Element} element - Specifies the element
     * @param {boolean} animate - Specifies the boolean value
     * @param {number} x - Specifies the x value
     * @param {number} y - Specifies the y value
     * @param {number} scale - Specifies the scale value
     * @returns {void}
     */
    private animateTransform(element: Element, animate: boolean, x: number, y: number, scale: number): void {
        const duration: number = this.currentLayer.animationDuration === 0 && animationMode === 'Enable' ? 1000 : this.currentLayer.animationDuration;
        if (!animate || duration === 0 || this.maps.isTileMap) {
            if (!(this.maps.isTileMap && element.id.indexOf('_Polygons_Group') > -1)) {
                element.setAttribute('transform', 'scale(' + (scale) + ') translate( ' + x + ' ' + y + ' )');
            }
            return;
        }
        if (!this.maps.isTileMap) {
            zoomAnimate(element, 0, duration, new MapLocation(x, y), scale, this.maps.mapAreaRect, this.maps);
        }
    }

    /**
     * @param {Maps} maps - Specifies the Map control
     * @param {boolean} isMouseWheel - Indicates whether the zoom operation was triggered by the mouse wheel.
     * @param {boolean} animate - Specifies the animation is available or not
     * @param {boolean} isPanning - Specifies that it is panning or not
     * @returns {void}
     * @private
     */
    public applyTransform(maps: Maps, isMouseWheel?: boolean, animate?: boolean, isPanning?: boolean): void {
        let layerIndex: number;
        this.templateCount = 0;
        let markerStyle: string;
        const scale: number = maps.scale;
        const x: number = maps.translatePoint.x;
        const y: number = maps.translatePoint.y;
        let currentLabelIndex: number = 0;
        maps.zoomShapeCollection = [];
        this.isPanningInProgress = isPanning || false;
        if (document.getElementById(maps.element.id + '_mapsTooltip')) {
            removeElement(maps.element.id + '_mapsTooltip');
        }
        if (maps.isTileMap) {
            const element: HTMLElement = document.getElementById(maps.element.id + '_svg');
            if (element) {
                for (let k: number = 0; k < maps.layers.length; k++) {
                    const layerElement: Element = element.querySelector('#' + maps.element.id + '_LayerIndex_' + k);
                    if (layerElement) {
                        element.removeChild(layerElement);
                    }
                }
            }
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
                    const templateElement: Element = document.getElementById(maps.element.id + '_LayerIndex_' + this.index + '_Markers_Template_Group');
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
                            } else if (maps.isTileMap && (currentEle.id.indexOf('_Polygons_Group') > -1)){
                                if (this.currentLayer.polygonSettings.polygons.length > 0) {
                                    this.currentLayer.polygonSettings.polygons.map((polygonSettings: PolygonSettingModel, polygonIndex: number) => {
                                        const markerData: Coordinate[] = polygonSettings.points;
                                        const path: string = calculatePolygonPath(maps, maps.tileZoomLevel, this.currentLayer, markerData);
                                        const element: Element = document.getElementById(maps.element.id + '_LayerIndex_' + this.index + '_PolygonIndex_' + polygonIndex);
                                        if (!isNullOrUndefined(element)) {
                                            element.setAttribute('d', path);
                                        }
                                    });
                                    document.getElementById(maps.element.id + '_LayerIndex_' + this.index + '_Polygons_Group').style.visibility = '';
                                }
                            } else if (currentEle.id.indexOf('Legend') === -1) {
                                changeBorderWidth(currentEle, this.index, scale, maps);
                                maps.zoomTranslatePoint = maps.translatePoint;
                                this.animateTransform(currentEle, animate, x, y, scale);
                            }

                        } else if (currentEle.id.indexOf('_Markers_Group') > -1) {
                            if ((!this.isPanModeEnabled || !isPanning) && (!isNullOrUndefined(currentEle.childNodes[0]) || !isNullOrUndefined(templateElement.childNodes[0]))) {
                                const processElement: Element = <Element>(!isNullOrUndefined(currentEle.childNodes[0]) ? currentEle.childNodes[0] : templateElement.childNodes[0]);
                                this.markerTranslates(processElement, factor, x, y, scale, 'Marker', layerElement);
                            }
                            currentEle = layerElement.childNodes[j as number] as Element;
                            if (!isNullOrUndefined(currentEle) && currentEle.id.indexOf('Markers') !== -1) {
                                Array.prototype.forEach.call(currentEle.childNodes, (childNode: HTMLElement, k: number) => {
                                    this.markerTranslate(<Element>childNode, factor, x, y, scale, 'Marker', animate);
                                    const dataIndex : number = parseInt(childNode['id'].split('_dataIndex_')[1].split('_')[0], 10);
                                    const markerIndex  : number = parseInt(childNode['id'].split('_MarkerIndex_')[1].split('_')[0], 10);
                                    if (this.currentLayer.markerSettings[markerIndex as number].initialMarkerSelection.length > 0) {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        const markerSelectionValues: any = this.currentLayer.markerSettings[markerIndex as number].dataSource[dataIndex as number];
                                        for (let x: number = 0; x < this.currentLayer.markerSettings[markerIndex as number].initialMarkerSelection.length; x++) {
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
                                    }
                                    if (((this.currentLayer.animationDuration > 0 || animationMode === 'Enable') || ((maps.layersCollection[0].animationDuration > 0 || animationMode === 'Enable') && this.currentLayer.type === 'SubLayer')) && !this.isPanModeEnabled) {
                                        if (!maps.isTileMap) {
                                            markerStyle = isMouseWheel ? markerStyle : 'visibility:hidden';
                                            if (!isNullOrUndefined(markerStyle)) {
                                                (currentEle as HTMLElement).style.cssText = markerStyle;
                                            }
                                        }
                                    }
                                });
                                if (this.isPanModeEnabled && maps.markerModule.sameMarkerData.length > 0) {
                                    clusterSeparate(maps.markerModule.sameMarkerData, maps, currentEle, true);
                                } else if (maps.markerModule.sameMarkerData.length > 0) {
                                    maps.markerModule.sameMarkerData = [];
                                    if (document.getElementById(maps.element.id + '_mapsTooltip')) {
                                        removeElement(maps.element.id + '_mapsTooltip');
                                    }
                                }
                                if (document.getElementById(maps.element.id + '_mapsTooltip') && maps.mapsTooltipModule.tooltipTargetID.indexOf('_MarkerIndex_')
                                    && !this.isPanModeEnabled) {
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
                                        const duration: number = this.currentLayer.animationDuration === 0 && animationMode === 'Enable' ? 1000 : this.currentLayer.animationDuration;
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
                            maps.zoomLabelPositions = [];
                            maps.zoomLabelPositions = maps.dataLabelModule.dataLabelCollections;
                            const labelAnimate: boolean = !maps.isTileMap && animate;
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const intersect: any[] = [];
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            Array.prototype.forEach.call(currentEle.childNodes, (childNode: any, k: number) => {
                                if (currentEle.childNodes[k as number]['id'].indexOf('_LabelIndex_') > -1) {
                                    const labelIndex: number = parseFloat(currentEle.childNodes[k as number]['id'].split('_LabelIndex_')[1].split('_')[0]);
                                    const zoomShapeWidth : string = (currentEle.childNodes[k as number] as Element).id;
                                    maps.zoomShapeCollection.push(zoomShapeWidth);
                                    this.dataLabelTranslate(<Element>currentEle.childNodes[k as number], factor, x, y, scale, 'DataLabel', labelAnimate, currentLabelIndex, isPanning, intersect);
                                    currentLabelIndex++;
                                    const dataLabel: DataLabelSettingsModel = maps.layers[this.index].dataLabelSettings;
                                    const border: BorderModel = dataLabel.border;
                                    if (k > 0 && border['width'] > 1) {
                                        if (currentEle.childNodes[k - 1]['id'].indexOf('_rectIndex_') > -1 && !isNullOrUndefined(maps.zoomLabelPositions[labelIndex as number])) {
                                            const labelX: number = ((maps.zoomLabelPositions[labelIndex as number]['location']['x'] + x) * scale);
                                            const labelY: number = ((maps.zoomLabelPositions[labelIndex as number]['location']['y'] + y) * scale);
                                            const zoomtext: string = currentEle.childNodes[k as number]['textContent'];
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
                            });
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
        element: Element | HTMLElement, factor: number, x: number, y: number, scale: number, type: string, layerElement: Element): void {
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
        const allowInnerClusterSetting: boolean = this.maps.markerModule.allowInnerClusterSetting(currentLayers);
        Array.prototype.forEach.call(currentLayers.markerSettings, (markerSettings: MarkerSettings, markerIndex: number) => {
            markerTemplateCounts = 0;
            markerCounts = 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const markerDatas: any[] = <any[]>markerSettings.dataSource;
            if (!isNullOrUndefined(markerDatas)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Array.prototype.forEach.call(markerDatas, (data: any, dataIndex: number) => {
                    this.maps.markerNullCount = markerIndex >= 0 && dataIndex === 0 ? 0 : this.maps.markerNullCount;
                    let eventArgs: IMarkerRenderingEventArgs = {
                        template: markerSettings.template, data: data, maps: this.maps, marker: markerSettings,
                        cancel: false, name: markerRendering, fill: markerSettings.fill, colorValuePath: markerSettings.colorValuePath,
                        shapeValuePath: markerSettings.shapeValuePath,
                        height: !isNullOrUndefined(markerSettings.heightValuePath) && !isNullOrUndefined(data[markerSettings.heightValuePath])
                            ? data[markerSettings.heightValuePath] : markerSettings.height,
                        width: !isNullOrUndefined(markerSettings.widthValuePath) && !isNullOrUndefined(data[markerSettings.widthValuePath])
                            ? data[markerSettings.widthValuePath] : markerSettings.width,
                        imageUrl: markerSettings.imageUrl, imageUrlValuePath: markerSettings.imageUrlValuePath, shape: markerSettings.shape,
                        border: markerSettings.border
                    };
                    eventArgs = markerShapeChoose(eventArgs, data);
                    eventArgs = markerColorChoose(eventArgs, data);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                        let isMarkersClustered: boolean = false;
                        const markerGroup: NodeListOf<Element> | NodeListOf<ChildNode> = (markerSettings.clusterSettings.allowClustering
                            || (currentLayers.markerClusterSettings.allowClustering && currentLayers.markerSettings.length > 1))
                            ? markerSVGObject.querySelectorAll(`[id*='LayerIndex_${layerIndex}_MarkerIndex_${markerIndex}']:not([id*='_Group'])`)
                            : markerSVGObject.childNodes;
                        if (markerGroup.length === (markerDataLength - markerTemplateCounts - nullCount) && (type !== 'Template')) {
                            if (this.maps.isTileMap) {
                                const polygonsElement: Element = document.getElementById(this.maps.element.id + '_LayerIndex_' + layerIndex + '_Polygons_Group');
                                const polygonElement: Element = document.getElementById(this.maps.element.id + '_LayerIndex_' + layerIndex + '_Polygon_Group');
                                if (!isNullOrUndefined(polygonsElement)) {
                                    polygonsElement.insertAdjacentElement('afterend', markerSVGObject);
                                } else {
                                    if (!isNullOrUndefined(polygonElement)) {
                                        polygonElement.insertAdjacentElement('afterend', markerSVGObject);
                                    } else {
                                        layerElement.insertBefore(markerSVGObject, layerElement.firstElementChild);
                                    }
                                }
                            } else {
                                layerElement.appendChild(markerSVGObject);
                            }
                            if (currentLayers.markerSettings[markerIndex as number].clusterSettings.allowClustering ||
                                !allowInnerClusterSetting && currentLayers.markerClusterSettings.allowClustering) {
                                this.maps.svgObject.appendChild(markerSVGObject);
                                this.maps.element.appendChild(this.maps.svgObject);
                                isMarkersClustered = clusterTemplate(currentLayers, markerSVGObject, this.maps, layerIndex, markerIndex, markerSVGObject, layerElement, true, true, null, allowInnerClusterSetting);
                            }
                        }
                        const markerTemplateGroup: NodeListOf<Element> | NodeListOf<ChildNode> = (markerSettings.clusterSettings.allowClustering
                            || (currentLayers.markerClusterSettings.allowClustering && currentLayers.markerSettings.length > 1))
                            ? markerTemplateElements.querySelectorAll(`[id*='LayerIndex_${layerIndex}_MarkerIndex_${markerIndex}']:not([id*='_Group'])`)
                            : markerTemplateElements.childNodes;
                        if (markerTemplateGroup.length === (markerDataLength - markerCounts - nullCount) && getElementByID(this.maps.element.id + '_Secondary_Element')) {
                            getElementByID(this.maps.element.id + '_Secondary_Element').appendChild(markerTemplateElements);
                            if (scale >= 1) {
                                if ((markerSettings.clusterSettings.allowClustering || !allowInnerClusterSetting &&
                                    currentLayers.markerClusterSettings.allowClustering) && !isMarkersClustered) {
                                    clusterTemplate(currentLayers, markerTemplateElements, this.maps, layerIndex, markerIndex, markerSVGObject, layerElement, false, true, null, allowInnerClusterSetting);
                                }
                            }
                        }
                    });
                });
            }
        });
    }
    /**
     * To translate the layer template elements.
     *
     * @param {number} x - Specifies the x value
     * @param {number} y - Specifies the y value
     * @param {number} scale - Specifies the scale value
     * @param {Maps} maps - Specifies the maps value
     * @returns {void}
     * @private
     */
    public processTemplate(x: number, y: number, scale: number, maps: Maps): void {
        let currentLabelIndex: number = 0;
        for (let i: number = 0; i < this.templateCount; i++) {
            const factor: number = maps.mapLayerPanel.calculateFactor(this.currentLayer);
            const markerTemplateElement: HTMLElement = <HTMLElement>getElementByID(maps.element.id + '_LayerIndex_' +
                i + '_Markers_Template_Group');
            const datalabelTemplateElemement: HTMLElement = <HTMLElement>getElementByID(maps.element.id + '_LayerIndex_'
                + i + '_Label_Template_Group');
            const polygonElement: HTMLElement = <HTMLElement>getElementByID(maps.element.id + '_LayerIndex_'
                + i + '_Polygons_Group');
            if ((!isNullOrUndefined(markerTemplateElement)) && markerTemplateElement.childElementCount > 0) {
                markerTemplateElement.style.visibility = 'visible';
                for (let k: number = 0; k < markerTemplateElement.childElementCount; k++) {
                    this.markerTranslate(<HTMLElement>markerTemplateElement.childNodes[k as number], factor, x, y, scale, 'Template');
                }
            }
            if ((!isNullOrUndefined(datalabelTemplateElemement)) && datalabelTemplateElemement.childElementCount > 0) {
                for (let k: number = 0; k < datalabelTemplateElemement.childElementCount; k++) {
                    this.dataLabelTranslate(<HTMLElement>datalabelTemplateElemement.childNodes[k as number], factor, x, y, scale, 'Template', false, currentLabelIndex);
                    currentLabelIndex++;
                }
            }
            if (!isNullOrUndefined(polygonElement)) {
                for (let k: number = 0; k < polygonElement.childElementCount; k++) {
                    const width: number = maps.layersCollection[i as number].polygonSettings.polygons[k as number].borderWidth;
                    (polygonElement.childNodes[k as number].childNodes[0] as HTMLElement).setAttribute('stroke-width', (width / scale).toString());
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private dataLabelTranslate(element: Element | HTMLElement, factor: number, x: number, y: number, scale: number, type: string, animate: boolean = false, currentLabelIndex: number, isPanning?: boolean, intersect?: any[]): void {
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
        const duration: number = this.currentLayer.animationDuration === 0 && animationMode === 'Enable' ? 1000 : this.currentLayer.animationDuration;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const label: any = labelCollection[currentLabelIndex as number];
        const index: number = currentLabelIndex;
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
                if (!animate || duration === 0) {
                    element.setAttribute('transform', 'translate( ' + labelX + ' ' + labelY + ' )');
                }
                if ((isNullOrUndefined(isPanning) || !isPanning) && (this.maps.layers[this.index].dataLabelSettings.smartLabelMode !== 'None' ||
                    this.maps.layers[this.index].dataLabelSettings.intersectionAction !== 'None')) {
                    zoomtextSize = measureTextElement(zoomtext, style);
                    const start: number = labelY - zoomtextSize['height'] / 2;
                    const end: number = labelY + zoomtextSize['height'] / 2;
                    const xpositionEnds: number = labelX + zoomtextSize['width'] / 2;
                    const xpositionStart: number = labelX - zoomtextSize['width'] / 2;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const textLocations: any = { rightWidth: xpositionEnds, leftWidth: xpositionStart, heightTop: start, heightBottom: end };
                    if (this.maps.layers[this.index].dataLabelSettings.smartLabelMode === 'Hide') {
                        if (scale > 1) {
                            text = ((this.maps.dataLabelShape[index as number] * scale) >= zoomtextSize['width']) ? zoomtext : '';
                            element.textContent = text;
                        } else {
                            text = (this.maps.dataLabelShape[index as number] >= zoomtextSize['width']) ? zoomtext : '';
                            element.textContent = text;
                        }
                    }
                    const widthList: number[] = [];
                    if (this.maps.layers[this.index].dataLabelSettings.smartLabelMode === 'Trim') {
                        if (scale > 1) {
                            zoomtrimLabel = textTrim((this.maps.dataLabelShape[index as number] * scale), zoomtext, style, zoomtextSize.width, true, widthList);
                            text = zoomtrimLabel; element.textContent = text;
                        } else {
                            zoomtrimLabel = textTrim(this.maps.dataLabelShape[index as number], zoomtext, style, zoomtextSize.width, true, widthList);
                            text = zoomtrimLabel; element.textContent = text;
                        }
                    }
                    if (this.maps.layers[this.index].dataLabelSettings.intersectionAction === 'Hide') {
                        for (let m: number = 0; m < intersect.length; m++) {
                            if (!isNullOrUndefined(intersect[m as number])) {
                                if (textLocations['leftWidth'] > intersect[m as number]['rightWidth']
                                    || textLocations['rightWidth'] < intersect[m as number]['leftWidth']
                                    || textLocations['heightTop'] > intersect[m as number]['heightBottom']
                                    || textLocations['heightBottom'] < intersect[m as number]['heightTop']) {
                                    text = !isNullOrUndefined(text) ? text : zoomtext;
                                    (element as HTMLElement).textContent = text;
                                } else {
                                    text = ''; element.textContent = text;
                                    break;
                                }
                            }
                        }
                        intersect.push(textLocations);
                    }
                    if (this.maps.layers[this.index].dataLabelSettings.intersectionAction === 'Trim') {
                        for (let j: number = 0; j < intersect.length; j++) {
                            if (!isNullOrUndefined(intersect[j as number])) {
                                if (textLocations['rightWidth'] < intersect[j as number]['leftWidth']
                                    || textLocations['leftWidth'] > intersect[j as number]['rightWidth']
                                    || textLocations['heightBottom'] < intersect[j as number]['heightTop']
                                    || textLocations['heightTop'] > intersect[j as number]['heightBottom']) {
                                    trimmedLable = !isNullOrUndefined(text) ? text : zoomtext;
                                    if (scale > 1) {
                                        const trimmedWidth: number = widthList.length > 0 ? widthList[0] : zoomtextSize.width;
                                        trimmedLable = textTrim((this.maps.dataLabelShape[index as number] * scale), trimmedLable, style, trimmedWidth, true);
                                    }
                                    element.textContent = trimmedLable;
                                } else {
                                    if (textLocations['leftWidth'] > intersect[j as number]['leftWidth']) {
                                        const width: number = intersect[j as number]['rightWidth'] - textLocations['leftWidth'];
                                        const difference: number = width - (textLocations['rightWidth'] - textLocations['leftWidth']);
                                        text = !isNullOrUndefined(text) ? text : zoomtext;
                                        const trimmedWidth: number = widthList.length > 0 ? widthList[0] : zoomtextSize.width;
                                        trimmedLable = textTrim(difference, text, style, trimmedWidth, true);
                                        element.textContent = trimmedLable;
                                        break;
                                    }
                                    if (textLocations['leftWidth'] < intersect[j as number]['leftWidth']) {
                                        const width: number = textLocations['rightWidth'] - intersect[j as number]['leftWidth'];
                                        const difference: number = Math.abs(width - (textLocations['rightWidth'] - textLocations['leftWidth']));
                                        text = !isNullOrUndefined(text) ? text : zoomtext;
                                        const trimmedWidth: number = widthList.length > 0 ? widthList[0] : zoomtextSize.width;
                                        trimmedLable = textTrim(difference, text, style, trimmedWidth, true);
                                        element.textContent = trimmedLable;
                                        break;
                                    }
                                }
                            }
                        }
                        intersect.push(textLocations);
                        if (isNullOrUndefined(trimmedLable)) {
                            trimmedLable = textTrim((this.maps.dataLabelShape[index as number] * scale), zoomtext, style, zoomtextSize.width, true);
                            element.textContent = trimmedLable;
                        }
                    }
                }
                if (animate || duration > 0) {
                    smoothTranslate(element, 0, duration, new MapLocation(labelX, labelY));
                }
            }
        }
    }

    /**
     *
     * @param {Element | HTMLElement} element - Specifies the marker element.
     * @param {number} factor - Specifies scale factor.
     * @param {number} x - Specifies the x location of the marker element.
     * @param {number} y - Specifies the y location of the marker element.
     * @param {number} scale - Specifies scale factor.
     * @param {number} type - Specifies the type of the marker processing.
     * @param {number} animate - Specifies whether the animation is enabled or not.
     * @returns {void}
     * @private
     */
    public markerTranslate(
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
                    !isNullOrUndefined(marker.dataSource[dataIndex as number]['Longitude']) ? parseFloat(marker.dataSource[dataIndex as number]['Longitude']) : 0;
            const lat: number = (!isNullOrUndefined(marker.latitudeValuePath)) ?
                Number(getValueFromObject(marker.dataSource[dataIndex as number], marker.latitudeValuePath)) :
                !isNullOrUndefined(marker.dataSource[dataIndex as number]['latitude']) ? parseFloat(marker.dataSource[dataIndex as number]['latitude']) :
                    !isNullOrUndefined(marker.dataSource[dataIndex as number]['Latitude']) ? parseFloat(marker.dataSource[dataIndex as number]['Latitude']) : 0;
            const duration: number = this.currentLayer.animationDuration === 0 && animationMode === 'Enable' ? 1000 : this.currentLayer.animationDuration;
            const location: Point = (this.maps.isTileMap) ? convertTileLatLongToPoint(
                new Point(lng, lat), this.maps.tileZoomLevel, this.maps.tileTranslatePoint, true
            ) : convertGeoToPoint(lat, lng, factor, layer, this.maps);
            if (this.maps.isTileMap) {
                if (type === 'Template') {
                    (<HTMLElement>element).style.left = (location.x + marker.offset.x) + 'px';
                    (<HTMLElement>element).style.top = (location.y + marker.offset.y) + 'px';
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
                        (<HTMLElement>element).style.left = ((location.x + x) * scale) + marker.offset.x - this.maps.mapAreaRect.x + 'px';
                        (<HTMLElement>element).style.top = ((location.y + y) * scale) + marker.offset.y - this.maps.mapAreaRect.y + 'px';
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
                const polygonElement: HTMLElement = <HTMLElement>getElementByID(this.maps.element.id + '_LayerIndex_' + i + '_Polygons_Group');
                if (!isNullOrUndefined(markerTemplateElement)) {
                    markerTemplateElement.style.visibility = 'hidden';
                }
                if (!isNullOrUndefined(lineElement)) {
                    lineElement.style.visibility = 'hidden';
                }
                if (!isNullOrUndefined(polygonElement)) {
                    polygonElement.style.visibility = 'hidden';
                }
            }
        }
    }
    /**
     * @param {PanDirection} direction - Specifies the direction of the panning.
     * @param {number} xDifference - Specifies the distance moved in the horizontal direction.
     * @param {number} yDifference - Specifies the distance moved in the vertical direction.
     * @param {PointerEvent | TouchEvent | KeyboardEvent} event - Specifies the pointer event argument.
     * @returns {void}
     * @private
     */
    public panning(direction: PanDirection, xDifference: number, yDifference: number, event?: PointerEvent | TouchEvent | KeyboardEvent): void {
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
        const layerX: number = event.type.indexOf('mouse') > -1 || event.type.indexOf('key') > -1 ? event['layerX'] : (event as TouchEvent).touches[0].pageX;
        const layerY: number = event.type.indexOf('mouse') > -1 || event.type.indexOf('key') > -1 ? event['layerY'] : (event as TouchEvent).touches[0].pageY;
        this.maps.mergeCluster();
        if (!map.isTileMap) {
            const marginTop: number = getProcessedMarginValue(map.margin.top);
            const legendElement: HTMLElement = document.getElementById(map.element.id + '_Legend_Group');
            const legendHeight: number = !isNullOrUndefined(legendElement) ? legendElement.getClientRects()[0].height : 0;
            x = translatePoint.x - xDifference / scale;
            y = translatePoint.y - yDifference / scale;
            const layerRect: ClientRect = getElementByID(map.element.id + '_Layer_Collections').getBoundingClientRect();
            const elementRect: ClientRect = getElementByID(map.element.id + '_svg').getBoundingClientRect();
            const panningXDirection: boolean = ((xDifference < 0 ? layerRect.left <= (elementRect.left + map.mapAreaRect.x) :
                ((layerRect.left + layerRect.width + map.mapAreaRect.x) >= (elementRect.width))));
            const panningYDirection: boolean = ((yDifference < 0 ? layerRect.top <= (elementRect.top + map.mapAreaRect.y) :
                ((layerRect.top + layerRect.height + legendHeight + marginTop) >= (elementRect.top + elementRect.height))));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const location: any = this.maps.getGeoLocation(this.maps.layersCollection.length - 1, layerX, layerY);
            const minMaxLatitudeLongitude: IMinMaxLatitudeLongitude = this.maps.getMinMaxLatitudeLongitude();
            panArgs = {
                cancel: false, name: pan, maps: map,
                tileTranslatePoint: {}, translatePoint: { previous: translatePoint, current: new Point(x, y) },
                scale: map.scale, tileZoomLevel: map.tileZoomLevel, latitude: location['latitude'], longitude: location['longitude'],
                minLatitude: minMaxLatitudeLongitude.minLatitude, maxLatitude: minMaxLatitudeLongitude.maxLatitude,
                minLongitude: minMaxLatitudeLongitude.minLongitude, maxLongitude: minMaxLatitudeLongitude.maxLongitude
            };
            map.trigger(pan, panArgs);
            if (!panArgs.cancel) {
                if (panningXDirection && panningYDirection) {
                    map.translatePoint = new Point(x, y);
                    this.applyTransform(map, false, false, true);
                } else if (panningXDirection) {
                    map.translatePoint = new Point(x, map.translatePoint.y);
                    this.applyTransform(map, false, false, true);
                } else if (panningYDirection) {
                    map.translatePoint = new Point(map.translatePoint.x, y);
                    this.applyTransform(map, false, false, true);
                }
            }
            this.maps.zoomNotApplied = false;
        } else if (this.maps.tileZoomLevel > 1) {
            x = map.tileTranslatePoint.x - xDifference;
            y = map.tileTranslatePoint.y - yDifference;
            map.tileTranslatePoint.x = x;
            map.tileTranslatePoint.y = y;
            if ((map.tileTranslatePoint.y > -10 && yDifference < 0) || ((map.tileTranslatePoint.y < -((Math.pow(2, this.maps.tileZoomLevel) - 2) * 256) && yDifference > 0))) {
                map.tileTranslatePoint.x = x + xDifference;
                map.tileTranslatePoint.y = y + yDifference;
            }
            map.translatePoint.x = (map.tileTranslatePoint.x) / map.scale;
            map.translatePoint.y = (map.tileTranslatePoint.y) / map.scale;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const location: any = this.maps.getTileGeoLocation(layerX, layerY);
            const minMaxLatitudeLongitude: IMinMaxLatitudeLongitude = this.maps.getMinMaxLatitudeLongitude();
            panArgs = {
                cancel: false, name: pan, maps: map,
                tileTranslatePoint: { previous: prevTilePoint, current: map.tileTranslatePoint },
                translatePoint: { previous: translatePoint, current: map.translatePoint }, scale: map.scale,
                tileZoomLevel: map.tileZoomLevel, latitude: location['latitude'], longitude: location['longitude'],
                minLatitude: minMaxLatitudeLongitude.minLatitude, maxLatitude: minMaxLatitudeLongitude.maxLatitude,
                minLongitude: minMaxLatitudeLongitude.minLongitude, maxLongitude: minMaxLatitudeLongitude.maxLongitude
            };
            map.trigger(pan, panArgs);
            map.mapLayerPanel.generateTiles(map.tileZoomLevel, map.tileTranslatePoint, 'Pan');
            this.applyTransform(map, false, false, true);
            map.translatePoint.x = (map.tileTranslatePoint.x - xDifference) / map.scale;
            map.translatePoint.y = (map.tileTranslatePoint.y - yDifference) / map.scale;
        }
        map.zoomTranslatePoint = map.translatePoint;
        this.mouseDownPoints = this.mouseMovePoints;
        this.isSingleClick = false;
    }

    /**
     * @param {number} zoomFactor - Specifies the factor for zooming
     * @param {string} type - Specifies the type
     * @returns {void}
     * @private
     */
    public toolBarZooming(zoomFactor: number, type: string): void {
        const map: Maps = this.maps;
        map.initialCheck = map.isMarkerZoomCompleted = false;
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
        this.maps.mergeCluster();
        map.previousProjection = type === 'Reset' ? undefined : map.projectionType;
        zoomFactor = (type === 'ZoomOut') ? (Math.round(zoomFactor) === 1 ? 1 : zoomFactor) : zoomFactor;
        zoomFactor = (type === 'Reset') ? minZoom : (Math.round(zoomFactor) === 0) ? 1 : zoomFactor;
        zoomFactor = (minZoom > zoomFactor && type === 'ZoomIn') ? minZoom + 1 : zoomFactor;
        if ((!map.isTileMap) && (type === 'ZoomIn' ? zoomFactor >= minZoom && Math.round(zoomFactor) <= maxZoom : zoomFactor >= minZoom
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
                this.applyTransform(map, false, true);
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
                    const animationDuration: number = this.maps.layersCollection[0].animationDuration === 0 && animationMode === 'Enable' ? 1000 : this.maps.layersCollection[0].animationDuration;
                    setTimeout(() => {
                        if (type === 'ZoomOut' || type === 'Reset') {
                            // element1.removeChild(element1.children[element1.childElementCount - 1]);
                            // element1.childElementCount ? element1.removeChild(element1.children[element1.childElementCount - 1]) : element1;
                        }
                        this.applyTransform(this.maps, false, true);
                        if (document.getElementById(this.maps.element.id + '_LayerIndex_1')) {
                            document.getElementById(this.maps.element.id + '_LayerIndex_1').style.display = 'block';
                        }
                        this.maps.isAddLayer = false;
                    }, animationDuration);
                }
            }
            this.maps.zoomNotApplied = false;
        }
        this.triggerZoomComplete(map, prevLevel, type);
    }

    /**
     * @returns {void}
     * @private
     */
    public createZoomingToolbars(): void {
        const map: Maps = this.maps;
        this.toolBarGroup = map.renderer.createGroup({
            id: map.element.id + '_Zooming_KitCollection',
            opacity: map.theme.toLowerCase() === 'fluentdark' ? 0.6 : 0.3
        });
        let xSpacing: number = 15; let ySpacing: number = 15;
        const toolbar: ZoomToolbarSettingsModel = map.zoomSettings.toolbarSettings;
        const button: ZoomToolbarButtonSettingsModel = map.zoomSettings.toolbarSettings.buttonSettings;
        this.maps.toolbarProperties = {
            toolBarOrientation: toolbar.orientation,
            highlightColor: button.highlightColor,
            selectionColor: button.selectionColor,
            horizontalAlignment: toolbar.horizontalAlignment,
            verticalAlignment: toolbar.verticalAlignment,
            color: button.color,
            shapeOpacity: button.opacity,
            borderOpacity: button.borderOpacity
        };
        const buttonRadius: number = button.radius || map.themeStyle.zoomButtonRadius;
        const cx: number = buttonRadius / 4;
        const cy: number = buttonRadius / 4;
        const radius: number = buttonRadius / 2;
        const padding: number = button.padding;
        const orientation: Orientation = this.maps.toolbarProperties.toolBarOrientation;
        const toolbarCollection: string[] = map.zoomSettings.toolbarSettings.buttonSettings.toolbarItems.map((value: string) => { return value; });
        xSpacing = (buttonRadius / 4) + (button.borderWidth / 2) + padding;
        ySpacing = (buttonRadius / 4) + (button.borderWidth / 2) + padding;
        let shadowElement: string = '<filter id="chart_shadow" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/>';
        shadowElement += '<feOffset dx="-3" dy="4" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="1"/>';
        shadowElement += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        const toolBarLength: number = toolbarCollection.length;
        const toolWidth: number = (orientation === 'Horizontal') ? ((toolBarLength * buttonRadius) + (toolBarLength * padding) + padding + (toolBarLength * button.borderWidth)) : (buttonRadius + button.borderWidth + (2 * padding));
        const toolHeight: number = (orientation === 'Horizontal') ? (buttonRadius + button.borderWidth + (2 * padding)) : ((toolBarLength * buttonRadius) + (toolBarLength * padding) + padding + (toolBarLength * button.borderWidth));
        const defElement: Element = map.renderer.createDefs();
        defElement.innerHTML = shadowElement;
        this.toolBarGroup.appendChild(defElement);
        const outerElement: Element = map.renderer.drawRectangle(new RectOption(
            map.element.id + '_Zooming_Rect', toolbar.backgroundColor, { color: toolbar.borderColor, width: toolbar.borderWidth, opacity: toolbar.borderOpacity },
            toolbar.borderOpacity, new Rect((toolbar.borderWidth / 2), (toolbar.borderWidth / 2), (toolWidth - toolbar.borderWidth), (toolHeight - toolbar.borderWidth)), 0, 0
        ));
        this.toolBarGroup.appendChild(outerElement);
        const scaleX: number = (buttonRadius - (button.borderWidth / 2)) / 30;
        for (let i: number = 0; i < toolbarCollection.length; i++) {
            if (i !== 0) {
                xSpacing = (map.toolbarProperties.toolBarOrientation === 'Horizontal') ? (xSpacing + (buttonRadius + padding) + button.borderWidth) : xSpacing;
                ySpacing = (map.toolbarProperties.toolBarOrientation === 'Horizontal') ? ySpacing : (ySpacing + (buttonRadius + padding) + button.borderWidth);
            }
            const toolbar: string = toolbarCollection[i as number];
            const pathStroke: string = !isNullOrUndefined(this.maps.toolbarProperties.color) ? this.maps.toolbarProperties.color : this.maps.themeStyle.zoomFillColor;
            const borderColor: string = button.borderColor || (this.maps.themeStyle.zoomBorderColor || this.maps.themeStyle.zoomFillColor);
            this.currentToolbarEle = map.renderer.createGroup({
                id: map.element.id + '_Zooming_ToolBar_' + toolbar + '_Group',
                transform: 'translate( ' + xSpacing + ' ' + ySpacing + ' ) '
            });
            this.currentToolbarEle.setAttribute('class', 'e-maps-toolbar');
            this.currentToolbarEle.appendChild(map.renderer.drawCircle(
                new CircleOption(map.element.id + '_Zooming_ToolBar_' + toolbar + '_Rect', button.fill, { color: borderColor, width: button.borderWidth, opacity: button.borderOpacity }, button.opacity, cx, cy, radius, '')
            ) as SVGRectElement);
            const opacity: number = 1;
            let direction: string = '';
            const fill: string = button.fill;
            this.selectionColor = this.maps.toolbarProperties.selectionColor || this.maps.themeStyle.zoomSelectionColor;
            switch (toolbar.toLowerCase()) {
            case 'zoom': {
                let fillColor: string;
                let strokeColor: string;
                direction = 'M0.001,14.629L1.372,16l4.571-4.571v-0.685l0.228-0.274c1.051,0.868,2.423,1.417,3.885,1.417c3.291,0,';
                direction += '5.943-2.651,5.943-5.943S13.395,0,10.103,0S4.16,2.651,4.16,5.943c0,1.508,0.503,2.834,1.417,3.885l-0.274,0.228H4.571';
                direction = direction + 'L0.001,14.629L0.001,14.629z M5.943,5.943c0-2.285,1.828-4.114,4.114-4.114s4.114,1.828,4.114,';
                this.currentToolbarEle.setAttribute('class', (this.maps.zoomSettings.enableSelectionZooming ? 'e-maps-toolbar' : ''));
                if (this.maps.zoomSettings.enablePanning && !this.maps.zoomSettings.enableSelectionZooming) {
                    fillColor = fill;
                    strokeColor = pathStroke;
                } else if (this.maps.zoomSettings.enablePanning && this.maps.zoomSettings.enableSelectionZooming) {
                    fillColor = fill;
                    strokeColor = pathStroke;
                } else if (!this.maps.zoomSettings.enablePanning && !this.maps.zoomSettings.enableSelectionZooming) {
                    fillColor = fill;
                    strokeColor = pathStroke;
                } else if (!this.maps.zoomSettings.enablePanning && this.maps.zoomSettings.enableSelectionZooming) {
                    fillColor = this.maps.themeStyle.zoomFillColor;
                    strokeColor = pathStroke;
                } else {
                    fillColor = this.selectionColor;
                    strokeColor = this.selectionColor;
                }
                const zoomPath: Element = map.renderer.drawPath(new PathOption(
                    map.element.id + '_Zooming_ToolBar_' + toolbar, fillColor, 1, strokeColor, opacity, opacity, null,
                    direction + '4.114s-1.828,4.114-4.114,4.114S5.943,8.229,5.943,5.943z')
                );
                zoomPath.setAttribute('transform', 'scale( ' + scaleX + ',' + scaleX + ' )');
                this.currentToolbarEle.appendChild(zoomPath);
                this.zoomElements = this.currentToolbarEle;
                this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                break;
            }
            case 'zoomin':
                direction = 'M 8, 0 L 8, 16 M 0, 8 L 16, 8';
                /* eslint-disable no-case-declarations */
                const zoomInPath: Element = map.renderer.drawPath(new PathOption(
                    map.element.id + '_Zooming_ToolBar_' + toolbar + '_Path', fill, 3, pathStroke, 1, 1, null, direction)
                );
                /* eslint-enable no-case-declarations */
                zoomInPath.setAttribute('transform', 'scale( ' + scaleX + ',' + scaleX + ' )');
                this.currentToolbarEle.appendChild(zoomInPath);
                this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                break;
            case 'zoomout':
                direction = 'M 0, 8 L 16, 8';
                /* eslint-disable no-case-declarations */
                const zoomOutPath: Element = map.renderer.drawPath(new PathOption(
                    map.element.id + '_Zooming_ToolBar_' + toolbar, fill, 3, pathStroke, 1, 1, null, direction)
                );
                /* eslint-enable no-case-declarations */
                zoomOutPath.setAttribute('transform', 'scale( ' + scaleX + ',' + scaleX + ' )');
                this.currentToolbarEle.appendChild(zoomOutPath);
                this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                break;
            case 'pan': {
                let color: string;
                direction = 'M5,3h2.3L7.275,5.875h1.4L8.65,3H11L8,0L5,3z M3,11V8.7l2.875,0.025v-1.4L3,7.35V5L0,8L3,';
                direction += '11z M11,13H8.7l0.025-2.875h-1.4L7.35,13H5l3,3L11,13z M13,5v2.3l-2.875-0.025v1.4L13,8.65V11l3-3L13,5z';
                this.currentToolbarEle.setAttribute('class', (this.maps.zoomSettings.enablePanning ? 'e-maps-toolbar' : ''));
                if (this.maps.zoomSettings.enablePanning && this.maps.zoomModule.isDragZoom) {
                    color = this.selectionColor || this.maps.themeStyle.zoomFillColor;
                } else if (!this.maps.zoomSettings.enablePanning) {
                    color = this.selectionColor || this.maps.themeStyle.zoomFillColor;
                    this.currentToolbarEle.setAttribute('class', '');
                }
                else {
                    color = fill || this.maps.themeStyle.zoomFillColor;
                }
                const panPath: Element = map.renderer.drawPath(new PathOption(
                    map.element.id + '_Zooming_ToolBar_' + toolbar, color, 1, pathStroke, opacity, opacity, null,
                    direction)
                );
                panPath.setAttribute('transform', 'scale( ' + scaleX + ',' + scaleX + ' )');
                this.currentToolbarEle.appendChild(panPath);
                this.panColor = color;
                this.panElements = this.currentToolbarEle;
                this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                break;
            }
            case 'reset':
                direction = 'M12.364,8h-2.182l2.909,3.25L16,8h-2.182c0-3.575-2.618-6.5-5.818-6.5c-1.128,0-2.218,0.366-3.091,';
                direction += '1.016l1.055,1.178C6.581,3.328,7.272,3.125,8,3.125C10.4,3.125,12.363,5.319,12.364,8L12.364,8z M11.091,';
                direction += '13.484l-1.055-1.178C9.419,12.672,8.728,12.875,8,12.875c-2.4,0-4.364-2.194-4.364-4.875h2.182L2.909,4.75L0,8h2.182c0,';
                /* eslint-disable no-case-declarations */
                const resetPath: Element = map.renderer.drawPath(new PathOption(
                    map.element.id + '_Zooming_ToolBar_' + toolbar, fill, null, pathStroke,
                    1, 1, null, direction + '3.575,2.618,6.5,5.818,6.5C9.128,14.5,10.219,14.134,11.091,13.484L11.091,13.484z')
                );
                /* eslint-enable no-case-declarations */
                resetPath.setAttribute('transform', 'scale( ' + scaleX + ',' + scaleX + ' )');
                this.currentToolbarEle.appendChild(resetPath);
                this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                break;
            }
            this.toolBarGroup.appendChild(this.currentToolbarEle);
        }
    }

    /**
     * @param {PointerEvent} e - Specifies the event in the map
     * @returns {void}
     * @private
     */
    public performToolBarAction(e: PointerEvent): void {
        const target: Element = <Element>e.target;
        e.stopImmediatePropagation();
        const isTouch: boolean = e.pointerType === 'touch' || e.pointerType === '2' || (e.type.indexOf('touch') > -1);
        const toolbar: string = target.id.split('_Zooming_ToolBar_')[1].split('_')[0];
        let isToolbarPerform: boolean = true;
        switch (toolbar.toLowerCase()) {
        case 'zoomin':
            isToolbarPerform = (this.maps.isTileMap ? this.maps.tileZoomLevel : this.maps.scale) + 1 <= this.maps.zoomSettings.maxZoom;
            break;
        case 'zoomout':
            /* eslint-disable no-case-declarations */
            const scaleValue: number = this.maps.isTileMap ? this.maps.tileZoomLevel : this.maps.scale;
            /* eslint-enable no-case-declarations */
            isToolbarPerform = (this.maps.projectionType === 'Miller' || this.maps.projectionType === 'Winkel3' ||
                this.maps.projectionType === 'AitOff') ? Math.round(scaleValue) - 1 >= this.maps.zoomSettings.minZoom :
                (scaleValue) - 1 >= this.maps.zoomSettings.minZoom;
            break;
        case 'reset' :
            isToolbarPerform = Math.round(this.maps.isTileMap ? this.maps.tileZoomLevel : this.maps.scale) !== this.maps.zoomSettings.minZoom;
            break;
        }
        if (isTouch && isToolbarPerform) {
            this.handled = true;
            this.performZoomingByToolBar(toolbar);
        } else if ((e.type === 'mousedown' || e.type === 'pointerdown') && !this.handled && isToolbarPerform) {
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
        let scale: number = 0;
        const stateColor: string = this.fillColor || this.maps.themeStyle.zoomFillColor;
        switch (type.toLowerCase()) {
        case 'zoom':
            this.panColor = stateColor;
            this.zoomColor = this.maps.zoomSettings.enableSelectionZooming ? this.selectionColor : stateColor;
            this.applySelection(this.zoomElements, this.zoomColor);
            this.applySelection(this.panElements, this.panColor);
            this.isPan = false;
            this.isZoomSelection = this.maps.zoomSettings.enableSelectionZooming;
            break;
        case 'pan':
            this.panColor = this.maps.zoomSettings.enablePanning ?  this.selectionColor : stateColor;
            this.zoomColor = stateColor;
            if (!this.maps.zoomSettings.enablePanning) {
                this.applySelection(this.zoomElements, this.selectionColor);
                this.applySelection(this.panElements, this.panColor);
            } else {
                this.applySelection(this.zoomElements, (this.fillColor || stateColor));
                this.applySelection(this.panElements, this.panColor);
            }
            this.isPan = this.maps.zoomSettings.enablePanning;
            this.isZoomSelection = false;
            break;
        case 'zoomin':
            map.staticMapZoom = map.tileZoomLevel;
            if (map.staticMapZoom > 0 && map.staticMapZoom < map.zoomSettings.maxZoom) {
                map.staticMapZoom += 1;
            }
            if (map.isTileMap && map.tileZoomLevel >= map.zoomSettings.minZoom && map.tileZoomLevel < map.zoomSettings.maxZoom) {
                this.toolBarZooming(map.tileZoomLevel + 1, 'ZoomIn');
            } else if (!map.isTileMap) {
                this.toolBarZooming(map.scale + 1, 'ZoomIn');
            }
            scale = this.maps.isTileMap ? Math.round(this.maps.tileZoomLevel) : Math.round(this.maps.mapScaleValue);
            if (!this.isZoomSelection) {
                if (scale === map.zoomSettings.maxZoom || scale > 1 || (scale === 1 && this.maps.isTileMap)) {
                    this.applySelection(this.zoomElements, stateColor);
                    this.applySelection(this.panElements, map.zoomSettings.enablePanning ? this.selectionColor : stateColor);
                } else if (scale === 1 && !this.maps.isTileMap) {
                    this.applySelection(this.zoomElements, stateColor);
                    this.applySelection(this.panElements, stateColor);
                }
            }
            break;
        case 'zoomout':
            map.staticMapZoom = map.tileZoomLevel;
            map.markerCenterLatitude = null;
            map.markerCenterLongitude = null;
            this.toolBarZooming((map.isTileMap ? map.tileZoomLevel : map.scale) - 1, 'ZoomOut');
            scale = this.maps.isTileMap ? Math.round(this.maps.tileZoomLevel) : Math.round(this.maps.mapScaleValue);
            if (!this.isPan && this.isZoomSelection) {
                this.panColor = stateColor;
                this.zoomColor = this.selectionColor;
                this.applySelection(this.zoomElements, this.selectionColor);
                this.applySelection(this.panElements, this.panColor);
            } else {
                if (scale <= 1 && !map.isTileMap) {
                    this.applySelection(this.panElements, stateColor);
                } else {
                    this.applySelection(this.panElements, map.zoomSettings.enablePanning ? this.selectionColor : stateColor);
                }
            }
            break;
        case 'reset':
            map.staticMapZoom = map.zoomSettings.enable ? map.zoomSettings.zoomFactor : 0;
            map.markerCenterLatitude = null;
            map.markerCenterLongitude = null;
            this.isZoomSelection = false;
            this.isPan = map.zoomSettings.enablePanning;
            this.toolBarZooming(map.zoomSettings.minZoom, 'Reset');
            if ((this.isPan && !this.isZoomSelection) || (!this.isPan && this.isZoomSelection)) {
                if (!this.maps.zoomSettings.enablePanning) {
                    this.applySelection(this.zoomElements, this.selectionColor);
                    this.applySelection(this.panElements, stateColor);
                }
                else {
                    this.applySelection(this.zoomElements, stateColor);
                    this.applySelection(this.panElements, this.selectionColor);
                }
            } else if (!this.isPan && !this.isZoomSelection) {
                this.applySelection(this.zoomElements, stateColor);
                this.applySelection(this.panElements, stateColor);
            }
        }
        this.panningStyle(type.toLowerCase());
    }

    private panningStyle(toolbar: string): void {
        const svg: Element = getElementByID(this.maps.element.id + '_svg');
        if (toolbar === 'pan' || (this.isPanModeEnabled && toolbar !== 'reset')) {
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
                childElement.setAttribute('fill', (elements.id.indexOf('Pan') > -1 ? color : 'transparent'));
                childElement.setAttribute('stroke', color);
            }
        }
    }

    /**
     * @param {PointerEvent} e - Specifies the event in the map
     * @returns {void}
     * @private
     */
    public showTooltip(e: PointerEvent): void {
        const text: string = (<Element>e.target).id.split('_Zooming_ToolBar_')[1].split('_')[0];
        const tooltip: ZoomToolbarTooltipSettingsModel = this.maps.zoomSettings.toolbarSettings.tooltipSettings;
        const tooltipSettings: ZoomToolbarTooltipSettingsModel = {
            visible: tooltip.visible,
            fill: tooltip.fill,
            borderOpacity: tooltip.borderOpacity,
            borderWidth: tooltip.borderWidth,
            borderColor: tooltip.borderColor,
            fontColor: tooltip.fontColor,
            fontFamily: tooltip.fontFamily,
            fontStyle: tooltip.fontStyle,
            fontWeight: tooltip.fontWeight,
            fontSize: tooltip.fontSize || '10px',
            fontOpacity: tooltip.fontOpacity
        };
        tooltipSettings.fontFamily = this.maps.themeStyle.fontFamily;
        if (!this.isTouch) {
            createTooltip('EJ2_Map_Toolbar_Tip', this.maps.getLocalizedLabel(text), (e.pageY + 10), (e.pageX + 10), tooltipSettings);
            if (this.maps.isDevice) {
                clearTimeout(this.clearTimeout);
                this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
            }
        }
    }

    /**
     * @returns {void}
     * @private
     */
    public removeTooltip(): void {
        if (getElementByID('EJ2_Map_Toolbar_Tip')) {
            remove(getElementByID('EJ2_Map_Toolbar_Tip'));
        }
    }
    /**
     * @returns {void}
     * @private
     */
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
        rectSVGObject.setAttribute('height', (toolBarSize.height + map.zoomSettings.toolbarSettings.borderWidth).toString());
        rectSVGObject.setAttribute('width', (toolBarSize.width + map.zoomSettings.toolbarSettings.borderWidth).toString());
        const size: Rect = !isNullOrUndefined(map.totalRect) ? map.totalRect : map.mapAreaRect;
        let x: number = 0; let y: number = 0;
        switch (map.toolbarProperties.verticalAlignment) {
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
        switch (map.toolbarProperties.horizontalAlignment) {
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
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        const color: string = this.maps.toolbarProperties.highlightColor || this.maps.themeStyle.zoomSelectionColor;
        const css: string = ' .e-maps-toolbar:hover > circle { stroke:' + color + '; } .e-maps-toolbar:hover > path { fill: ' + color + ' ;  stroke: ' + color + '; }' +
            '.e-maps-toolbar:hover { cursor: pointer; } .e-maps-cursor-disable:hover { cursor: not-allowed; } .e-maps-panning:hover { cursor: pointer; } ' +
            '.e-maps-popup-close { display: block; opacity: 0; }';
        const style: HTMLStyleElement = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        element.appendChild(style);
    }

    /**
     * @param {number} factor - Specifies the factor for toolbar
     * @param {string} id - Specifies the id
     * @returns {void}
     * @private
     */
    public removeToolbarOpacity(factor: number, id: string): void {
        if (!isNullOrUndefined(this.maps) && this.maps.zoomModule && this.maps.zoomSettings.enable) {
            if (getElementByID(this.maps.element.id + '_Zooming_KitCollection') && id.indexOf(this.maps.element.id + '_Zooming_') > -1) {
                if (this.maps.isDevice) {
                    getElementByID(this.maps.element.id + '_Zooming_KitCollection').setAttribute('opacity', '1');
                    this.removeToolbarClass('', '', '', '', '');
                } else {
                    this.removeToolbarClass(this.maps.zoomSettings.enableSelectionZooming ? 'e-maps-toolbar' : '', 'e-maps-toolbar', 'e-maps-toolbar',
                                            this.maps.zoomSettings.enablePanning ? 'e-maps-toolbar' : '', 'e-maps-toolbar');
                }
                const toolbarShapeOpacity: number = this.maps.toolbarProperties.shapeOpacity;
                const toolbarButtonOpacity: number = this.maps.toolbarProperties.borderOpacity;

                if (this.maps.isTileMap && (factor <= 1.1 || this.maps.zoomSettings.minZoom === factor)) {
                    if (!this.maps.isDevice) {
                        this.removeToolbarClass(this.maps.zoomSettings.enableSelectionZooming ? 'e-maps-toolbar' : '', 'e-maps-toolbar', '',
                                                this.maps.zoomSettings.enablePanning ? 'e-maps-toolbar' : '', '');
                    }
                    if (this.maps.zoomSettings.enablePanning) {
                        this.removePanColor(this.maps.toolbarProperties.selectionColor || this.maps.themeStyle.zoomSelectionColor);
                    }
                    if (this.isZoomSelection && this.maps.zoomSettings.enableSelectionZooming && !this.maps.isReset) {
                        this.removeZoomColor(this.maps.toolbarProperties.selectionColor || this.maps.themeStyle.zoomSelectionColor);
                        this.removePanColor(this.maps.toolbarProperties.color || this.maps.themeStyle.zoomFillColor);
                    }
                    this.removeZoomOpacity((this.maps.zoomSettings.enableSelectionZooming ? toolbarShapeOpacity : 0.3),
                                           (this.maps.zoomSettings.enableSelectionZooming ? toolbarButtonOpacity : 0.3), toolbarShapeOpacity, toolbarButtonOpacity,
                                           0.3, 0.3, (this.maps.zoomSettings.enablePanning ? toolbarShapeOpacity : 0.3),
                                           (this.maps.zoomSettings.enablePanning ? toolbarButtonOpacity : 0.3), 0.3, 0.3);

                } else if ((factor <= 1.1 || this.maps.zoomSettings.minZoom === factor)) {
                    if (!this.maps.isDevice) {
                        this.removeToolbarClass(this.maps.zoomSettings.enableSelectionZooming ? 'e-maps-toolbar' : '', 'e-maps-toolbar', '', '', '');
                    }
                    if (!this.isZoomSelection && this.maps.zoomSettings.enablePanning) {
                        this.removePanColor(this.maps.toolbarProperties.color || this.maps.themeStyle.zoomFillColor);
                    }
                    if (this.isZoomSelection && this.maps.zoomSettings.enableSelectionZooming && !this.maps.isReset) {
                        this.removeZoomColor(this.maps.toolbarProperties.selectionColor || this.maps.themeStyle.zoomSelectionColor);
                        this.removePanColor(this.maps.toolbarProperties.color || this.maps.themeStyle.zoomFillColor);
                    }
                    this.removeZoomOpacity((this.maps.zoomSettings.enableSelectionZooming ? toolbarShapeOpacity : 0.3),
                                           (this.maps.zoomSettings.enableSelectionZooming ? toolbarButtonOpacity : 0.3), toolbarShapeOpacity, toolbarButtonOpacity,
                                           0.3, 0.3, 0.3, 0.3, 0.3, 0.3);

                } else if (factor < this.maps.zoomSettings.maxZoom) {
                    if (!this.maps.isDevice) {
                        this.removeToolbarClass(this.maps.zoomSettings.enableSelectionZooming ? 'e-maps-toolbar' : '', 'e-maps-toolbar', 'e-maps-toolbar',
                                                this.maps.zoomSettings.enablePanning ? 'e-maps-toolbar' : '', 'e-maps-toolbar');
                    }
                    if (!this.maps.zoomModule.isZoomFinal) {
                        this.removeZoomOpacity((this.maps.zoomSettings.enableSelectionZooming ? toolbarShapeOpacity : 0.3),
                                               (this.maps.zoomSettings.enableSelectionZooming ? toolbarButtonOpacity : 0.3), toolbarShapeOpacity, toolbarButtonOpacity,
                                               toolbarShapeOpacity, toolbarButtonOpacity, (this.maps.zoomSettings.enablePanning ? toolbarShapeOpacity : 0.3),
                                               (this.maps.zoomSettings.enablePanning ? toolbarButtonOpacity : 0.3), toolbarShapeOpacity, toolbarButtonOpacity);
                    } else {
                        this.maps.zoomModule.isZoomFinal = false;
                    }
                    if (this.isZoomSelection && this.maps.zoomSettings.enableSelectionZooming) {
                        this.removeZoomColor(this.maps.toolbarProperties.selectionColor || this.maps.themeStyle.zoomSelectionColor);
                        if (this.maps.zoomModule.isPan && this.maps.zoomSettings.enablePanning) {
                            this.removePanColor(this.maps.toolbarProperties.color || this.maps.themeStyle.zoomFillColor);
                        }
                    } else if (!this.isZoomSelection && this.maps.zoomSettings.enablePanning) {
                        this.removePanColor(this.maps.toolbarProperties.selectionColor || this.maps.themeStyle.zoomSelectionColor);
                        if (this.maps.zoomSettings.enableSelectionZooming) {
                            this.removeZoomColor(this.maps.toolbarProperties.color || this.maps.themeStyle.zoomFillColor);
                        }
                    }
                } else {
                    if (!this.maps.isDevice) {
                        this.removeToolbarClass('', '', 'e-maps-toolbar', this.maps.zoomSettings.enablePanning ? 'e-maps-toolbar' : '', 'e-maps-toolbar');
                    }
                    this.removeZoomOpacity(0.3, 0.3, 0.3, 0.3, toolbarShapeOpacity, toolbarButtonOpacity,
                                           (this.maps.zoomSettings.enablePanning ? toolbarShapeOpacity : 0.3), (this.maps.zoomSettings.enablePanning ? toolbarButtonOpacity : 0.3),
                                           toolbarShapeOpacity, toolbarButtonOpacity);
                    if (this.maps.zoomSettings.enableSelectionZooming) {
                        this.removeZoomColor(this.maps.toolbarProperties.color || this.maps.themeStyle.zoomFillColor);
                    }
                    if (!this.isZoomSelection && this.maps.zoomSettings.enablePanning) {
                        this.removePanColor(this.maps.toolbarProperties.selectionColor || this.maps.themeStyle.zoomSelectionColor);
                    }
                }
            }
            else {
                if (!this.maps.isDevice) {
                    this.removePanColor(this.maps.toolbarProperties.color || this.maps.themeStyle.zoomFillColor);
                    this.removeZoomColor(this.maps.toolbarProperties.color || this.maps.themeStyle.zoomFillColor);
                    this.removeZoomOpacity(1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
                }
            }
        }
    }
    private setOpacity(circleId: string, pathId: string, circleOpacity: number, pathOpacity: number): void {
        if (getElementByID(this.maps.element.id + circleId)) {
            getElementByID(this.maps.element.id + circleId).setAttribute('stroke-opacity', circleOpacity.toString());
            getElementByID(this.maps.element.id + circleId).setAttribute('fill-opacity', circleOpacity.toString());
            getElementByID(this.maps.element.id + pathId).setAttribute('stroke-opacity', pathOpacity.toString());
            getElementByID(this.maps.element.id + pathId).setAttribute('fill-opacity', pathOpacity.toString());
        }
    }

    private removeZoomOpacity(zoomOpacity: number, zoomStrokeOpacity: number, zoomInOpacity: number, zoomInStrokeOpacity: number, zoomOutOpacity: number,
                              zoomOutStrokeOpacity: number, panOpacity: number, panStrokeOpacity: number, resetOpacity: number, resetStrokeOpacity: number): void {
        this.setOpacity('_Zooming_ToolBar_Zoom_Rect', '_Zooming_ToolBar_Zoom', zoomStrokeOpacity, zoomOpacity);
        this.setOpacity('_Zooming_ToolBar_ZoomIn_Rect', '_Zooming_ToolBar_ZoomIn_Path', zoomInStrokeOpacity, zoomInOpacity);
        this.setOpacity('_Zooming_ToolBar_ZoomOut_Rect', '_Zooming_ToolBar_ZoomOut', zoomOutStrokeOpacity, zoomOutOpacity);
        this.setOpacity('_Zooming_ToolBar_Pan_Rect', '_Zooming_ToolBar_Pan', panStrokeOpacity, panOpacity);
        this.setOpacity('_Zooming_ToolBar_Reset_Rect', '_Zooming_ToolBar_Reset', resetStrokeOpacity, resetOpacity);
    }
    /**
     * @param {string} zoomClassStyle - Specifies the style for zoom class.
     * @param {string} zoomInClassStyle - Specifies the style for zoom in.
     * @param {string} zoomOutClassStyle - Specifies the style for zoom out.
     * @param {string} panClassStyle -  Specifies the style for pan.
     * @param {string} resetClassStyle - Specifies the style for reset.
     * @returns {void}
     * @private
     */
    public removeToolbarClass(zoomClassStyle: string, zoomInClassStyle: string, zoomOutClassStyle: string,
                              panClassStyle: string, resetClassStyle: string): void {
        if (getElementByID(this.maps.element.id + '_Zooming_KitCollection')) {
            if (document.getElementById(this.maps.element.id + '_Zooming_ToolBar_ZoomIn_Group')) {
                getElementByID(this.maps.element.id + '_Zooming_ToolBar_ZoomIn_Group').setAttribute('class', zoomInClassStyle);
            }
            if (document.getElementById(this.maps.element.id + '_Zooming_ToolBar_ZoomOut_Group')) {
                getElementByID(this.maps.element.id + '_Zooming_ToolBar_ZoomOut_Group').setAttribute('class', zoomOutClassStyle);
            }
            if (document.getElementById(this.maps.element.id + '_Zooming_ToolBar_Reset_Group')) {
                getElementByID(this.maps.element.id + '_Zooming_ToolBar_Reset_Group').setAttribute('class', resetClassStyle);
            }
            if (document.getElementById(this.maps.element.id + '_Zooming_ToolBar_Zoom_Group') && this.maps.zoomSettings.enableSelectionZooming) {
                getElementByID(this.maps.element.id + '_Zooming_ToolBar_Zoom_Group').setAttribute('class', zoomClassStyle);
            }
            if (document.getElementById(this.maps.element.id + '_Zooming_ToolBar_Pan_Group') && this.maps.zoomSettings.enablePanning) {
                getElementByID(this.maps.element.id + '_Zooming_ToolBar_Pan_Group').setAttribute('class', panClassStyle);
            }
        }
    }
    private removePanColor(selectionColor: string): void {
        if (getElementByID(this.maps.element.id + '_Zooming_ToolBar_Pan_Rect') && this.maps.zoomSettings.enablePanning) {
            getElementByID(this.maps.element.id + '_Zooming_ToolBar_Pan').setAttribute('fill', selectionColor);
            getElementByID(this.maps.element.id + '_Zooming_ToolBar_Pan').setAttribute('stroke', selectionColor);
        }
    }
    private removeZoomColor(selectionColor: string): void {
        if (getElementByID(this.maps.element.id + '_Zooming_ToolBar_Zoom_Rect') && this.maps.zoomSettings.enableSelectionZooming) {
            getElementByID(this.maps.element.id + '_Zooming_ToolBar_Zoom').setAttribute('fill', 'transparent');
            getElementByID(this.maps.element.id + '_Zooming_ToolBar_Zoom').setAttribute('stroke', selectionColor);
        }
    }

    /**
     * To bind events.
     *
     * @param {Element} element - Specifies the element.
     * @param {Function} process - Specifies the process.
     * @returns {void}
     * @private
     */
    public wireEvents(element: Element, process: Function): void {
        EventHandler.add(element, Browser.touchStartEvent, process, this);
        EventHandler.add(element, 'mouseover', this.showTooltip, this);
        EventHandler.add(element, 'mouseout', this.removeTooltip, this);
    }

    /**
     * @param {WheelEvent} e - Specifies the wheel event in the map for zooming
     * @returns {void}
     * @private
     */
    public mapMouseWheel(e: WheelEvent): void {
        if (this.maps.zoomSettings.enable && this.maps.zoomSettings.mouseWheelZoom) {
            const map: Maps = this.maps;
            map.markerZoomedState = false;
            map.zoomPersistence = map.enablePersistence;
            const position: Point = this.getMousePosition(e.pageX, e.pageY);
            const prevLevel: number = map.tileZoomLevel;
            const prevScale: number = map.scale;
            const delta: number = 1;
            const staticMaxZoomLevel : number =  map.zoomSettings.maxZoom;
            const value: number = (map.isTileMap) ? prevLevel : prevScale;
            this.maps.mergeCluster();
            if (((position.x > map.mapAreaRect.x) && (position.x < (map.mapAreaRect.x + map.mapAreaRect.width))) &&
                (position.y > map.mapAreaRect.y) && position.y < (map.mapAreaRect.y + map.mapAreaRect.height)) {
                e.preventDefault();
                const direction: string = (this.browserName === 'mozilla' && !this.isPointer) ?
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    -(e.detail) / 3 > 0 ? 'ZoomIn' : 'ZoomOut' : ((e as any).wheelDelta / 120) > 0 ? 'ZoomIn' : 'ZoomOut';
                if (direction === 'ZoomIn') {
                    map.mapScaleValue = value + delta;
                    if (map.isTileMap) {
                        map.staticMapZoom = map.tileZoomLevel;
                        if (map.staticMapZoom > 0 && map.staticMapZoom < staticMaxZoomLevel) {
                            map.staticMapZoom += 1;
                            this.performZooming(position, (value + delta), direction, true);
                        }
                    } else {
                        this.performZooming(position, (value + delta), direction, true);
                    }
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
                    this.performZooming(position, (value - delta), direction, true);
                }
            }
            this.removeToolbarOpacity(map.mapScaleValue, (!this.maps.isDevice ? (!isNullOrUndefined(e.target) ?  e.target['id'] :
                this.maps.element.id) : this.maps.element.id + '_Zooming_'));
        }
    }

    /**
     * @param {PointerEvent} e - Specifies the event in the map
     * @returns {void}
     * @private
     */
    public doubleClick(e: PointerEvent): void {
        const pageX: number = e.pageX;
        const pageY: number = e.pageY;
        const tooltipElement: Element = (e.target as HTMLElement).closest('#' + this.maps.element.id + '_mapsTooltipparent_template');
        if (this.maps.zoomSettings.enable && this.maps.zoomSettings.doubleClickZoom
            && !(e.target['id'].indexOf('_Zooming_') > -1) && isNullOrUndefined(tooltipElement)) {
            const position: Point = this.getMousePosition(pageX, pageY);
            const map: Maps = this.maps;
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

    /**
     * @param {PointerEvent} e - Specifies the event in the map
     * @returns {void}
     * @private
     */
    public mouseDownHandler(e: PointerEvent | TouchEvent): void {
        let pageX: number;
        let pageY: number;
        let target: Element;
        let touches: TouchList = null;
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const element: Element = <Element>e.target;
        if (e.type === 'touchstart') {
            this.isTouch = true;
            touches = (<TouchEvent & PointerEvent>e).touches;
            target = <Element>(<TouchEvent & PointerEvent>e).target;
            pageX = touches[0].pageX;
            pageY = touches[0].pageY;
        } else {
            pageX = (<PointerEvent>e).pageX;
            pageY = (<PointerEvent>e).pageY;
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            target = <Element>e.target;
        }
        if (!this.isTouch) {
            e.preventDefault();
        }
        if (!this.maps.zoomSettings.enablePanning) {
            this.isPan = this.isPanModeEnabled = this.panColor !== this.selectionColor ? this.maps.zoomSettings.enablePanning
                : this.zoomColor === this.selectionColor;
        } else {
            this.isPan = this.isPanModeEnabled = !this.isZoomSelection;
        }
        this.mouseDownLatLong = { x: pageX, y: pageY };
        const scale: number = this.maps.isTileMap ? Math.round(this.maps.tileZoomLevel) : Math.round(this.maps.mapScaleValue);
        this.rectZoomingStart = ((this.isZoomSelection && scale < this.maps.zoomSettings.maxZoom) && this.maps.zoomSettings.enable);
        this.mouseDownPoints = this.getMousePosition(pageX, pageY);
        if (this.isTouch && touches !== null) {
            this.firstMove = true;
            this.pinchFactor = this.maps.scale;
            this.fingers = touches.length;
        }
        this.isSingleClick = true;
    }

    /**
     * @param {PointerEvent} e - Specifies the event in the map
     * @returns {void}
     * @private
     */
    public mouseMoveHandler(e: PointerEvent | TouchEvent): void {
        let pageX: number;
        let pageY: number;
        const map: Maps = this.maps;
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        let touchArg: TouchEvent;
        let target: Element;
        let touches: TouchList = null;
        const zoom: ZoomSettings = <ZoomSettings>this.maps.zoomSettings;
        if (e.type === 'touchmove') {
            this.isTouch = true;
            target = <Element>(<TouchEvent & PointerEvent>e).target;
            touches = (<TouchEvent & PointerEvent>e).touches;
            pageX = touches[0].pageX;
            pageY = touches[0].pageY;
        } else {
            pageX = (<PointerEvent>e).pageX;
            pageY = (<PointerEvent>e).pageY;
            target = <Element>e.target;
        }
        if (getElementByID(map.element.id + '_Zooming_KitCollection')) {
            if (target.id.indexOf('_Zooming_') > -1) {
                getElementByID(map.element.id + '_Zooming_KitCollection').setAttribute('opacity', '1');
            }
            else if (!map.isDevice) {
                getElementByID(map.element.id + '_Zooming_KitCollection').setAttribute('opacity', map.theme.toLowerCase() === 'fluentdark' ? '0.6' : '0.3');
            }
        }
        if (this.isTouch) {
            if (this.maps.zoomSettings.pinchZooming && touches !== null) {
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
        if (zoom.enable && this.isPanModeEnabled && this.maps.markerDragId.indexOf('_MarkerIndex_') === -1 && ((Browser.isDevice && touches.length >= 1) || !Browser.isDevice)) {
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
        if (this.isTouch ? (touches !== null && touches.length === 1 && this.rectZoomingStart) : this.rectZoomingStart) {
            e.preventDefault();
            const scale : number = this.maps.isTileMap ? Math.round(this.maps.tileZoomLevel) : Math.round(this.maps.mapScaleValue);
            if (this.maps.zoomSettings.enableSelectionZooming && scale < this.maps.zoomSettings.maxZoom) {
                this.drawZoomRectangle();
            }
            else {
                this.rectZoomingStart = false;
                this.isPan = true;
            }
        }
    }

    /**
     * @param {PointerEvent} e - Specifies the event in the map
     * @returns {void}
     * @private
     */
    public mouseUpHandler(e: PointerEvent | TouchEvent): void {
        this.rectZoomingStart = false;
        this.isSingleClick = this.isSingleClick ? true : false;
        this.isTouch = false;
        this.touchStartList = [];
        this.touchMoveList = [];
        this.lastScale = 1;
        this.maps.element.style.cursor = 'auto';
        if (this.isPanModeEnabled && this.maps.zoomSettings.enablePanning && !isNullOrUndefined(this.maps.previousPoint) &&
            (!this.maps.isTileMap  ? (this.maps.translatePoint.x !== this.maps.previousPoint.x && this.maps.translatePoint.y !== this.maps.previousPoint.y)
                : this.isPanningInProgress)) {
            let pageX: number;
            let pageY: number;
            let layerX: number = 0;
            let layerY: number = 0;
            let target: Element;
            const element: Element = <Element>e.target;
            if (e.type.indexOf('touch') !== - 1) {
                const touchArg: TouchEvent = <TouchEvent & PointerEvent>e;
                layerX = pageX = touchArg.changedTouches[0].pageX;
                pageY = touchArg.changedTouches[0].pageY;
                layerY = pageY - (this.maps.isTileMap ? 10 : 0);
                target = <Element>touchArg.target;
                this.maps.mouseClickEvent = { x: pageX, y: pageY };
            } else {
                pageX = (e as PointerEvent).pageX;
                pageY = (e as PointerEvent).pageY;
                layerX = e['layerX'];
                layerY = e['layerY'] - (this.maps.isTileMap ? 10 : 0);
                //eslint-disable-next-line @typescript-eslint/no-unused-vars
                target = <Element>e.target;
            }
            let panCompleteEventArgs: IMapPanEventArgs;
            const minMaxLatitudeLongitude: IMinMaxLatitudeLongitude = this.maps.getMinMaxLatitudeLongitude();
            if (!this.maps.isTileMap) {
                this.maps.mouseClickEvent['x'] = this.maps.mouseDownEvent['x'];
                this.maps.mouseClickEvent['y'] = this.maps.mouseDownEvent['y'];
                const location: GeoPosition = this.maps.getClickLocation(element.id, pageX, pageY, (element as HTMLElement), pageX, pageY);
                panCompleteEventArgs = {
                    cancel: false, name: 'panComplete', maps: this.maps,
                    tileTranslatePoint: {}, translatePoint: { previous: this.maps.previousPoint, current: this.maps.translatePoint },
                    scale: this.maps.scale, tileZoomLevel: this.maps.tileZoomLevel, latitude: !isNullOrUndefined(location) ?
                        location.latitude : 0, longitude: !isNullOrUndefined(location) ? location.longitude : 0,
                    minLatitude: minMaxLatitudeLongitude.minLatitude, maxLatitude: minMaxLatitudeLongitude.maxLatitude,
                    minLongitude: minMaxLatitudeLongitude.minLongitude, maxLongitude: minMaxLatitudeLongitude.maxLongitude
                };
            } else {
                const location: GeoPosition = this.maps.getTileGeoLocation(layerX, layerY);
                panCompleteEventArgs = {
                    cancel: false, name: 'panComplete', maps: this.maps,
                    tileTranslatePoint: { previous: this.maps.tileTranslatePoint , current: this.maps.tileTranslatePoint },
                    translatePoint: { previous: this.maps.previousPoint, current: this.maps.translatePoint}, scale: this.maps.scale,
                    tileZoomLevel: this.maps.tileZoomLevel, latitude: location.latitude, longitude: location.longitude,
                    minLatitude: minMaxLatitudeLongitude.minLatitude, maxLatitude: minMaxLatitudeLongitude.maxLatitude,
                    minLongitude: minMaxLatitudeLongitude.minLongitude, maxLongitude: minMaxLatitudeLongitude.maxLongitude
                };
            }
            this.maps.trigger('panComplete', panCompleteEventArgs);
        }
        this.isPanModeEnabled = false;
        this.isPanningInProgress = false;
        const zoomRectElement: HTMLElement = <HTMLElement>getElementByID(this.maps.element.id + '_Selection_Rect_Zooming');
        if (zoomRectElement && this.maps.zoomSettings.enable && this.maps.zoomSettings.enableSelectionZooming) {
            remove(zoomRectElement);
            this.performRectZooming();
        }
        this.mouseMoveLatLong = { x: 0, y: 0 };
        this.mouseDownLatLong = { x: 0, y: 0 };
        this.pinchDistance = null;
    }

    /**
     * @param {PointerEvent} e - Specifies the event in the map
     * @returns {void}
     * @private
     */
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    public mouseCancelHandler(e: PointerEvent): void {
        this.isPanModeEnabled = false;
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
     * @private
     */
    public click(e: PointerEvent): void {
        const map: Maps = this.maps;
        const tooltipElement: Element = (e.target as HTMLElement).closest('#' + this.maps.element.id + '_mapsTooltipparent_template');
        if ((map.markerModule && map.markerModule.sameMarkerData.length > 0) ||
            (e.target['id'].indexOf('MarkerIndex') > -1 && e.target['id'].indexOf('cluster') === -1) || !isNullOrUndefined(tooltipElement)) {
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

    /**
     * Gets the Mouse Position.
     *
     * @param {number} pageX - Specifies the Page x in map
     * @param {number} pageY - Specifies the Page y in map
     * @returns {Point} - returns the mouse point position
     * @private
     */
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

    /**
     * @returns {void}
     * @private
     */
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

    /**
     * @returns {void}
     * @private
     */
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
        EventHandler.remove(this.maps.element, this.cancelEvent, this.mouseCancelHandler);
        const toolbarElement: HTMLElement = document.getElementById(this.maps.element.id + '_Zooming_KitCollection');
        if (toolbarElement) {
            for (let i: number = 0; i < toolbarElement.childNodes.length; i++) {
                if ((toolbarElement.childNodes[i as number] as HTMLElement).tagName === 'g') {
                    EventHandler.add((toolbarElement.childNodes[i as number] as HTMLElement), Browser.touchStartEvent, this.performToolBarAction);
                    EventHandler.add((toolbarElement.childNodes[i as number] as HTMLElement), 'mouseover', this.showTooltip);
                    EventHandler.add((toolbarElement.childNodes[i as number] as HTMLElement), 'mouseout', this.removeTooltip);
                }
            }
        }
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
        this.mouseDownLatLong = null;
        this.mouseMoveLatLong = null;
        this.removeEventListener();
        this.layerCollectionEle = null;
        this.currentLayer = null;
        this.pinchDistance = null;
    }
}
