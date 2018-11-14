import { Maps, doubleClick, Orientation, ITouches, ZoomSettings } from '../../index';
import { Point, getElementByID, Size, PathOption, Rect, convertGeoToPoint, CircleOption, convertTileLatLongToPoint } from '../utils/helper';
import { RectOption, PolygonOption, createTooltip, calculateScale, getTouchCenter, getTouches, targetTouches } from '../utils/helper';
import { MapLocation, zoomAnimate, smoothTranslate } from '../utils/helper';
import { isNullOrUndefined, EventHandler, Browser, remove, createElement } from '@syncfusion/ej2-base';
import { MarkerSettings, LayerSettings, changeBorderWidth } from '../index';

/**
 * Zoom module used to process the zoom for maps
 */
/* tslint:disable:max-line-length */
export class Zoom {
    private maps: Maps;
    public toolBarGroup: Element;
    private groupElements: Element[];
    private currentToolbarEle: Element;
    public zoomingRect: Rect;
    public selectionColor: string;
    private fillColor: string;
    private zoomInElements: Element;
    private zoomOutElements: Element;
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
    private pinchRect: Rect = new Rect(0, 0, 0, 0);
    public mouseDownPoints: Point;
    public mouseMovePoints: Point;
    public currentLayer: LayerSettings;
    private panColor: string;
    public zoomColor: string;
    public browserName: string = Browser.info.name;
    public isPointer: Boolean = Browser.isPointer;
    private handled: boolean = false;
    private fingers: number;
    public firstMove: boolean;
    private interaction: string;
    private lastScale: number;
    private pinchFactor: number = 1;
    private startTouches: Object[] = [];
    private templateCount: number;
    /** @private */
    public layerCollectionEle: Element;
    constructor(maps: Maps) {
        this.maps = maps;
        this.wheelEvent = this.browserName === 'mozilla' ? (this.isPointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';
        this.cancelEvent = this.isPointer ? 'pointerleave' : 'mouseleave';
        this.selectionColor = this.maps.zoomSettings.selectionColor;
        this.fillColor = this.maps.zoomSettings.color;
        this.addEventListener();
        this.groupElements = [];
    }

    /* tslint:disable:no-string-literal */
    /**
     * To perform zooming for maps
     * @param position 
     * @param newZoomFactor 
     * @param type 
     */
    public performZooming(position: Point, newZoomFactor: number, type: string): void {
        let map: Maps = this.maps;
        let prevLevel: number = map.tileZoomLevel;
        let prevScale: number = map.scale;
        let maxZoom: number = map.zoomSettings.maxZoom;
        let minZoom: number = map.zoomSettings.minZoom;
        if ((!map.isTileMap) && (type === 'ZoomIn' ? newZoomFactor >= minZoom && newZoomFactor <= maxZoom : newZoomFactor >= minZoom)) {
            let availSize: Rect = map.mapAreaRect;
            let minBounds: Object = map.baseMapRectBounds['min'] as Object;
            let maxBounds: Object = map.baseMapRectBounds['max'] as Object;
            let mapTotalWidth: number = Math.abs(minBounds['x'] - maxBounds['x']);
            let mapTotalHeight: number = Math.abs(minBounds['y'] - maxBounds['y']);
            let point: Point = map.translatePoint;
            let translatePointX: number = point.x - (((availSize.width / prevScale) - (availSize.width / newZoomFactor)) / (availSize.width / position.x));
            let translatePointY: number = point.y - (((availSize.height / prevScale) - (availSize.height / newZoomFactor)) / (availSize.height / position.y));
            let currentHeight: number = Math.abs(map.baseMapRectBounds['max']['y'] - map.baseMapRectBounds['min']['y']) * newZoomFactor;
            translatePointX = (currentHeight < map.mapAreaRect.height) ? (availSize.x + ((-(minBounds['x'])) + ((availSize.width / 2) - (mapTotalWidth / 2)))) : translatePointX;
            translatePointY = (currentHeight < map.mapAreaRect.height) ? (availSize.y + ((-(minBounds['y'])) + ((availSize.height / 2) - (mapTotalHeight / 2)))) : translatePointY;
            map.translatePoint = new Point(translatePointX, translatePointY);
            map.scale = newZoomFactor;
        } else if ((map.isTileMap) && (newZoomFactor >= minZoom && newZoomFactor <= maxZoom)) {
            this.getTileTranslatePosition(prevLevel, newZoomFactor, position);
            map.tileZoomLevel = newZoomFactor;
            map.scale = Math.pow(2, newZoomFactor - 1);
            map.mapLayerPanel.generateTiles(newZoomFactor, map.tileTranslatePoint);
            map.translatePoint.x = (map.tileTranslatePoint.x - (0.5 * map.scale)) / map.scale;
            map.translatePoint.y = (map.tileTranslatePoint.y - (0.5 * map.scale)) / map.scale;
        }
        this.applyTransform();
        map.trigger(doubleClick, this);
    }

    private getTileTranslatePosition(prevLevel: number, currentLevel: number, position: Point): void {
        let map: Maps = this.maps;
        let tileDefaultSize: number = 256;
        let bounds: ClientRect = getElementByID(this.maps.element.id).getBoundingClientRect();
        let prevSize: number = Math.pow(2, prevLevel) * 256;
        let totalSize: number = Math.pow(2, currentLevel) * 256;
        let x: number = ((position.x - map.tileTranslatePoint.x) / prevSize) * 100;
        let y: number = ((position.y - map.tileTranslatePoint.y) / prevSize) * 100;
        map.tileTranslatePoint.x = (currentLevel === 1) ? (bounds.width / 2) - ((tileDefaultSize * 2) / 2) :
            position.x - ((x * totalSize) / 100);
        map.tileTranslatePoint.y = (currentLevel === 1) ? (bounds.height / 2) - ((tileDefaultSize * 2) / 2) :
            position.y - ((y * totalSize) / 100);
    }

    public performRectZooming(): void {
        let map: Maps = this.maps;
        let size: Size = map.availableSize;
        let prevLevel: number = map.tileZoomLevel;
        let zoomRect: Rect = this.zoomingRect;
        if (zoomRect.height > 0 && zoomRect.width > 0) {
            let x: number = this.zoomingRect.x + (this.zoomingRect.width / 2);
            let y: number = this.zoomingRect.y + (this.zoomingRect.height / 2);
            let zoomCalculationFactor: number;
            if (!map.isTileMap) {
                let scale: number = map.previousScale = map.scale;
                zoomCalculationFactor = scale + Math.round((((size.width / zoomRect.width) + (size.height / zoomRect.height)) / 2));
                let translatePoint: Point = map.previousPoint = map.translatePoint;
                let translatePointX: number = translatePoint.x - (((size.width / scale) - (size.width / zoomCalculationFactor)) / (size.width / x));
                let translatePointY: number = translatePoint.y - (((size.height / scale) - (size.height / zoomCalculationFactor)) / (size.height / y));
                map.translatePoint = new Point(translatePointX, translatePointY);
                map.scale = zoomCalculationFactor;
            } else {
                zoomCalculationFactor = prevLevel + (Math.round(prevLevel + (((size.width / zoomRect.width) + (size.height / zoomRect.height)) / 2)));
                this.getTileTranslatePosition(prevLevel, zoomCalculationFactor, { x: x, y: y });
                map.tileZoomLevel = zoomCalculationFactor;
                map.mapLayerPanel.generateTiles(zoomCalculationFactor, map.tileTranslatePoint);
                map.translatePoint.x = (map.tileTranslatePoint.x - (0.5 * Math.pow(2, zoomCalculationFactor))) /
                    (Math.pow(2, zoomCalculationFactor));
                map.translatePoint.y = (map.tileTranslatePoint.y - (0.5 * Math.pow(2, zoomCalculationFactor))) /
                    (Math.pow(2, zoomCalculationFactor));
                map.scale = (Math.pow(2, zoomCalculationFactor));
            }
            this.applyTransform(true);
            this.zoomingRect = null;
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
        let touches: TouchList = null;
        let map: Maps = this.maps;
        let prevLevel: number = map.tileZoomLevel;
        let availSize: Rect = map.mapAreaRect;
        let scale: number = calculateScale(<ITouches[]>this.touchStartList, <ITouches[]>this.touchMoveList);
        let touchCenter: Point = getTouchCenter(getTouches(<ITouches[]>this.touchMoveList, this.maps));
        let newScale: number = scale / this.lastScale;
        this.lastScale = scale;
        this.pinchFactor *= newScale;
        this.pinchFactor = Math.min(this.maps.zoomSettings.maxZoom, Math.max(this.pinchFactor, this.maps.zoomSettings.minZoom));
        let zoomCalculationFactor: number = this.pinchFactor;
        let translatePointX: number; let translatePointY: number;
        if (!map.isTileMap) {
            let minBounds: Object = map.baseMapRectBounds['min'] as Object;
            let maxBounds: Object = map.baseMapRectBounds['max'] as Object;
            let mapTotalWidth: number = Math.abs(minBounds['x'] - maxBounds['x']);
            let mapTotalHeight: number = Math.abs(minBounds['y'] - maxBounds['y']);
            let translatePoint: Point = map.translatePoint;
            let currentHeight: number = Math.abs(map.baseMapRectBounds['max']['y'] - map.baseMapRectBounds['min']['y']) * zoomCalculationFactor;
            let translatePointX: number = translatePoint.x - (((availSize.width / map.scale) - (availSize.width / zoomCalculationFactor)) / (availSize.width / touchCenter.x));
            let translatePointY: number = translatePoint.y - (((availSize.height / map.scale) - (availSize.height / zoomCalculationFactor)) / (availSize.height / touchCenter.y));
            // translatePointX = (currentHeight < map.mapAreaRect.height) ? (availSize.x + ((-(minBounds['x'])) + ((availSize.width / 2) - (mapTotalWidth / 2)))) : translatePointX;
            //translatePointY = (currentHeight < map.mapAreaRect.height) ? (availSize.y + ((-(minBounds['y'])) + ((availSize.height / 2) - (mapTotalHeight / 2)))) : translatePointY;
            map.translatePoint = new Point(translatePointX, translatePointY);
            map.scale = zoomCalculationFactor;
        } else {
            let newTileFactor: number = zoomCalculationFactor;
            this.getTileTranslatePosition(prevLevel, newTileFactor, { x: touchCenter.x, y: touchCenter.y });
            map.tileZoomLevel = newTileFactor;
            map.mapLayerPanel.generateTiles(newTileFactor, map.tileTranslatePoint);
            map.translatePoint.x = (map.tileTranslatePoint.x - (0.5 * Math.pow(2, newTileFactor))) /
                (Math.pow(2, newTileFactor));
            map.translatePoint.y = (map.tileTranslatePoint.y - (0.5 * Math.pow(2, newTileFactor))) /
                (Math.pow(2, newTileFactor));
            map.scale = (Math.pow(2, newTileFactor));
        }
        this.applyTransform();
    }

    public drawZoomRectangle(): void {
        let map: Maps = this.maps;
        let down: Point = this.mouseDownPoints;
        let move: Point = this.mouseMovePoints;
        let x: number; let y: number; let width: number; let height: number;
        let border: Object = { width: 1, color: '#009900' };
        width = Math.abs(move.x - down.x);
        height = Math.abs(move.y - down.y);
        x = ((move.x > down.x) ? down.x : down.x - width);
        y = ((move.y > down.y) ? down.y : down.y - height);
        let elementRect: ClientRect = getElementByID(map.element.id).getBoundingClientRect();
        if ((x > map.mapAreaRect.x && x < (map.mapAreaRect.x + map.mapAreaRect.width)) &&
            (y > map.mapAreaRect.y) && (y < map.mapAreaRect.y + map.mapAreaRect.height)) {
            this.zoomingRect = new Rect(x, y, width, height);
            let rectSVGObject: Element = map.renderer.createSvg({
                id: map.element.id + '_Selection_Rect_Zooming',
                width: map.availableSize.width,
                height: map.availableSize.height,
            });
            let rectOption: RectOption = new RectOption(
                map.element.id + '_ZoomRect', '#d3d3d3', border, 0.5, this.zoomingRect, 0, 0, '', '3'
            );
            rectSVGObject.appendChild(map.renderer.drawRectangle(rectOption));
            getElementByID(map.element.id + '_Secondary_Element').appendChild(rectSVGObject);
        }
    }
    /**
     * To animate the zooming process
     */
    private animateTransform(element: Element, animate: boolean, x: number, y: number, scale: number): void {
        let duration: number = this.currentLayer.animationDuration;
        if (!animate || duration === 0) {
            element.setAttribute('transform', 'scale(' + (scale) + ') translate( ' + x + ' ' + y + ' )');
            return;
        }
        zoomAnimate(element, 0, duration, new MapLocation(x, y), scale, this.maps.mapAreaRect, this.maps);
    }

    public applyTransform(animate?: boolean): void {
        let layerIndex: number;
        this.templateCount = 0;
        let scale: number = this.maps.scale;
        let x: number = this.maps.translatePoint.x;
        let y: number = this.maps.translatePoint.y;
        let collection: Object[] = [];
        if (this.layerCollectionEle) {
            for (let i: number = 0; i < this.layerCollectionEle.childElementCount; i++) {
                let layerElement: Element = this.layerCollectionEle.childNodes[i] as Element;
                if (layerElement.tagName === 'g') {
                    this.templateCount++;
                    let index: number = parseFloat(layerElement.id.split('_')[2]);
                    this.currentLayer = <LayerSettings>this.maps.layersCollection[index];
                    let factor: number = this.maps.mapLayerPanel.calculateFactor(this.currentLayer);
                    for (let j: number = 0; j < layerElement.childElementCount; j++) {
                        let currentEle: Element = layerElement.childNodes[j] as Element;
                        if (!(currentEle.id.indexOf('_Markers_Group') > -1) && (!(currentEle.id.indexOf('_bubble_Group') > -1))
                            && (!(currentEle.id.indexOf('_dataLableIndex_Group') > -1))
                        ) {
                            if (this.maps.isTileMap && (currentEle.id.indexOf('_line_Group') > -1)) {
                                currentEle.remove();
                                layerElement.appendChild(this.maps.navigationLineModule.renderNavigation(this.currentLayer, this.maps.tileZoomLevel, index));
                            } else {
                                changeBorderWidth(currentEle, index, scale, this.maps);
                                this.animateTransform(currentEle, animate, x, y, scale);
                            }
                        } else if (currentEle.id.indexOf('_Markers_Group') > -1) {
                            for (let k: number = 0; k < currentEle.childElementCount; k++) {
                                this.markerTranslate(<Element>currentEle.childNodes[k], factor, x, y, scale, 'Marker', animate);
                            }
                        } else if (currentEle.id.indexOf('_bubble_Group') > -1) {
                            let childElement: HTMLElement;
                            for (let k: number = 0; k < currentEle.childElementCount; k++) {
                                childElement = currentEle.childNodes[k] as HTMLElement;
                                let bubbleTransform: string = childElement.getAttribute('transform');
                                layerIndex = parseFloat(childElement.id.split('_')[2]);
                                let bubleIndex: number = parseFloat(childElement.id.split('_')[4]);
                                let dataIndex: number = parseFloat(childElement.id.split('_')[6]);
                                for (let l: number = 0; l < this.maps.bubbleModule.bubbleCollection.length; l++) {
                                    let bubbleCollection: Object = this.maps.bubbleModule.bubbleCollection[l];
                                    if (bubbleCollection['LayerIndex'] === layerIndex && bubbleCollection['BubbleIndex'] === bubleIndex &&
                                        bubbleCollection['DataIndex'] === dataIndex) {
                                        let centerX: number = bubbleCollection['center']['x'];
                                        let centerY: number = bubbleCollection['center']['y'];
                                        let currentX: number = ((centerX + x) * scale);
                                        let currentY: number = ((centerY + y) * scale);
                                        let duration: number = this.currentLayer.animationDuration;
                                        if (!animate || duration === 0) {
                                            childElement.setAttribute('transform', 'translate( ' + currentX + ' ' + currentY + ' )');
                                        } else {
                                            smoothTranslate(childElement, 0, duration, new MapLocation(currentX, currentY));
                                        }
                                        break;
                                    }
                                }
                            }
                        } else if (currentEle.id.indexOf('_dataLableIndex_Group') > -1) {
                            for (let k: number = 0; k < currentEle.childElementCount; k++) {
                                this.dataLabelTranslate(<Element>currentEle.childNodes[k], factor, x, y, scale, 'DataLabel', animate);
                            }
                        }
                    }
                }
            }
            if (!animate || this.currentLayer.animationDuration === 0) {
                this.processTemplate(x, y, scale, this.maps);
            }
        }
    }
    /**
     * To translate the layer template elements
     * @private
     */
    public processTemplate(x: number, y: number, scale: number, maps: Maps): void {
        for (let i: number = 0; i < this.templateCount; i++) {
            this.currentLayer = <LayerSettings>maps.layersCollection[i];
            let factor: number = maps.mapLayerPanel.calculateFactor(this.currentLayer);
            let markerTemplateElement: HTMLElement = <HTMLElement>getElementByID(maps.element.id + '_LayerIndex_' +
                i + '_Markers_Template_Group');
            let datalabelTemplateElemement: HTMLElement = <HTMLElement>getElementByID(maps.element.id + '_LayerIndex_'
                + i + '_Label_Template_Group');
            if ((!isNullOrUndefined(markerTemplateElement)) && markerTemplateElement.childElementCount > 0) {
                for (let k: number = 0; k < markerTemplateElement.childElementCount; k++) {
                    this.markerTranslate(<HTMLElement>markerTemplateElement.childNodes[k], factor, x, y, scale, 'Template');
                }
            }
            if ((!isNullOrUndefined(datalabelTemplateElemement)) && datalabelTemplateElemement.childElementCount > 0) {
                for (let k: number = 0; k < datalabelTemplateElemement.childElementCount; k++) {
                    this.dataLabelTranslate(<HTMLElement>datalabelTemplateElemement.childNodes[k], factor, x, y, scale, 'Template');
                }
            }
        }
    }

    private dataLabelTranslate(element: Element | HTMLElement, factor: number, x: number, y: number, scale: number, type: string, animate: boolean = false): void {
        let labelCollection: Object[] = this.maps.dataLabelModule.dataLabelCollections;
        let layerIndex: number = parseFloat(element.id.split('_')[2]);
        let shapeIndex: number = parseFloat(element.id.split('_')[4]);
        let labelIndex: number = parseFloat(element.id.split('_')[6]);
        let duration: number = this.currentLayer.animationDuration;
        for (let l: number = 0; l < labelCollection.length; l++) {
            let label: Object = labelCollection[l];
            if (label['layerIndex'] === layerIndex && label['shapeIndex'] === shapeIndex
                && label['labelIndex'] === labelIndex) {
                let labelX: number = label['location']['x'];
                let labelY: number = label['location']['y'];
                if (type === 'Template') {
                    let layerEle: Element = getElementByID(this.maps.element.id + '_Layer_Collections');
                    labelX = ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - labelX)) * scale);
                    labelY = ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - labelY)) * scale);
                    let templateOffset: ClientRect = element.getBoundingClientRect();
                    let layerOffset: ClientRect = layerEle.getBoundingClientRect();
                    let elementOffset: ClientRect = element.parentElement.getBoundingClientRect();
                    let x: number = ((labelX) + (layerOffset.left - elementOffset.left) - (templateOffset.width / 2));
                    let y: number = ((labelY) + (layerOffset.top - elementOffset.top) - (templateOffset.height / 2));
                    (<HTMLElement>element).style.left = x + 'px';
                    (<HTMLElement>element).style.top = y + 'px';
                } else {
                    labelX = ((labelX + x) * scale);
                    labelY = ((labelY + y) * scale);
                    if (!animate || duration === 0) {
                        element.setAttribute('transform', 'translate( ' + labelX + ' ' + labelY + ' )');
                    } else {
                        smoothTranslate(element, 0, duration, new MapLocation(labelX, labelY));
                    }
                }
            }
        }
    }

    private markerTranslate(
        element: Element | HTMLElement, factor: number, x: number, y: number, scale: number, type: string, animate: boolean = false
    ): void {
        let layerIndex: number = parseInt(element.id.split('_')[2], 10);
        let markerIndex: number = parseInt(element.id.split('_')[4], 10);
        let dataIndex: number = parseInt(element.id.split('_')[6], 10);
        let layer: LayerSettings = <LayerSettings>this.maps.layersCollection[layerIndex];
        let marker: MarkerSettings = <MarkerSettings>layer.markerSettings[markerIndex];
        if (!isNullOrUndefined(marker) && !isNullOrUndefined(marker.dataSource) && !isNullOrUndefined(marker.dataSource[dataIndex])) {
            let lng: number = marker.dataSource[dataIndex]['longitude'];
            let lat: number = marker.dataSource[dataIndex]['latitude'];
            let duration: number = this.currentLayer.animationDuration;
            let location: Point = (this.maps.isTileMap) ? convertTileLatLongToPoint(
                new Point(lng, lat), this.maps.tileZoomLevel, this.maps.tileTranslatePoint, true
            ) : convertGeoToPoint(lat, lng, factor, layer, this.maps);
            if (this.maps.isTileMap) {
                if (type === 'Template') {
                    let templateOffset: ClientRect = element.getBoundingClientRect();
                    (<HTMLElement>element).style.left = (location.x - (templateOffset.width / 2)) + 'px';
                    (<HTMLElement>element).style.top = (location.y - (templateOffset.height / 2)) + 'px';
                } else {
                    element.setAttribute('transform', 'translate( ' + location.x + ' ' + location.y + ' )');
                }
            } else {
                if (type === 'Template') {
                    location.x = ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - location.x)) * scale);
                    location.y = ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - location.y)) * scale);
                    let templateOffset: ClientRect = element.getBoundingClientRect();
                    let layerOffset: ClientRect = getElementByID(this.maps.element.id + '_Layer_Collections').getBoundingClientRect();
                    let elementOffset: ClientRect = element.parentElement.getBoundingClientRect();
                    (<HTMLElement>element).style.left = (((location.x) + (layerOffset.left - elementOffset.left) -
                        (templateOffset.width / 2)) + marker.offset.x) + 'px';
                    (<HTMLElement>element).style.top = (((location.y) + (layerOffset.top - elementOffset.top)
                        - (templateOffset.height / 2)) + marker.offset.y) + 'px';
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

    public panning(): void {
        let map: Maps = this.maps;
        let areaRect: Rect = map.mapAreaRect;
        let down: Point = this.mouseDownPoints;
        let move: Point = this.mouseMovePoints;
        let scale: number = map.scale;
        let translatePoint: Point = map.translatePoint;
        let x: number; let y: number; let transY: number; let transX: number;
        if (!map.isTileMap) {
            let x: number = translatePoint.x - (down.x - move.x) / scale;
            let y: number = translatePoint.y - (down.y - move.y) / scale;
            let layerRect: ClientRect = getElementByID(map.element.id + '_Layer_Collections').getBoundingClientRect();
            let elementRect: ClientRect = getElementByID(map.element.id + '_svg').getBoundingClientRect();
            let panningXDirection: boolean = (((down.x - move.x) < 0 ? layerRect.left <= (elementRect.left + map.mapAreaRect.x) :
                ((layerRect.left + layerRect.width) >= (elementRect.left + elementRect.width) + map.mapAreaRect.x + map.margin.left)));
            let panningYDirection: boolean = (((down.y - move.y) < 0 ? layerRect.top <= (elementRect.top + map.mapAreaRect.y) :
                ((layerRect.top + layerRect.height) >= (elementRect.top + elementRect.height) + map.mapAreaRect.y + map.margin.top)));
            if (panningXDirection && panningYDirection) {
                map.translatePoint = new Point(x, y);
                this.applyTransform();
            } else if (panningXDirection) {
                map.translatePoint = new Point(x, map.translatePoint.y);
                this.applyTransform();
            } else if (panningYDirection) {
                map.translatePoint = new Point(map.translatePoint.x, y);
                this.applyTransform();
            }
        } else if (this.maps.tileZoomLevel > 1) {
            x = map.tileTranslatePoint.x - (down.x - move.x);
            y = map.tileTranslatePoint.y - (down.y - move.y);
            map.tileTranslatePoint.x = x;
            map.tileTranslatePoint.y = y;
            map.mapLayerPanel.generateTiles(map.tileZoomLevel, map.tileTranslatePoint);
            map.translatePoint.x = (map.tileTranslatePoint.x - (down.x - move.x)) / map.scale;
            map.translatePoint.y = (map.tileTranslatePoint.y - (down.y - move.y)) / map.scale;
            this.applyTransform();
        }
        this.mouseDownPoints = this.mouseMovePoints;
    }

    public toolBarZooming(zoomFactor: number, type: string): void {
        let map: Maps = this.maps;
        let prevLevel: number = map.tileZoomLevel;
        let scale: number = map.previousScale = map.scale;
        let maxZoom: number = map.zoomSettings.maxZoom;
        let minZoom: number = map.zoomSettings.minZoom;
        let size: Rect = map.mapAreaRect;
        zoomFactor = (type === 'ZoomOut') ? (Math.round(zoomFactor) === 1 ? 1 : zoomFactor) : zoomFactor;
        if ((!map.isTileMap) && (type === 'ZoomIn' ? zoomFactor >= minZoom && zoomFactor <= maxZoom : zoomFactor >= minZoom)) {
            let translatePoint: Point = map.previousPoint = map.translatePoint;
            let min: Object = map.baseMapRectBounds['min'] as Object;
            let max: Object = map.baseMapRectBounds['max'] as Object;
            let mapWidth: number = Math.abs(max['x'] - min['x']);
            let mapHeight: number = Math.abs(min['y'] - max['y']);
            let translatePointX: number = translatePoint.x - (((size.width / scale) - (size.width / zoomFactor)) / 2);
            let translatePointY: number = translatePoint.y - (((size.height / scale) - (size.height / zoomFactor)) / 2);
            let currentHeight: number = Math.abs(map.baseMapRectBounds['max']['y'] - map.baseMapRectBounds['min']['y']) * zoomFactor;
            translatePointX = (currentHeight < map.mapAreaRect.height) ? (size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2))))
                : translatePointX;
            translatePointY = (currentHeight < map.mapAreaRect.height) ? (size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2))))
                : translatePointY;
            map.translatePoint = new Point(translatePointX, translatePointY);
            map.scale = zoomFactor;
        } else if ((map.isTileMap) && (zoomFactor >= minZoom && zoomFactor <= maxZoom)) {
            let tileZoomFactor: number = zoomFactor;
            map.scale = Math.pow(2, tileZoomFactor - 1);
            map.tileZoomLevel = tileZoomFactor;
            let position: Point = { x: map.availableSize.width / 2, y: map.availableSize.height / 2 };
            this.getTileTranslatePosition(prevLevel, tileZoomFactor, position);
            map.mapLayerPanel.generateTiles(tileZoomFactor, map.tileTranslatePoint);
            map.translatePoint.x = (map.tileTranslatePoint.x - (0.5 * map.scale)) / map.scale;
            map.translatePoint.y = (map.tileTranslatePoint.y - (0.5 * map.scale)) / map.scale;
        }
        this.applyTransform(true);
    }

    /* tslint:disable:max-func-body-length */
    public createZoomingToolbars(): void {
        let map: Maps = this.maps;
        this.toolBarGroup = map.renderer.createGroup({
            id: map.element.id + '_Zooming_KitCollection',
            opacity: 0.3,
        });
        let kitHeight: number = 16; let kitWidth: number = 16;
        let xSpacing: number = 15; let ySpacing: number = 15;
        let padding: number = 20;
        let orientation: Orientation = map.zoomSettings.toolBarOrientation;
        let toolbarsCollection: string[] = map.zoomSettings.toolbars;
        let shadowElement: string = '<filter id="chart_shadow" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/>';
        shadowElement += '<feOffset dx="-3" dy="4" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="1"/>';
        shadowElement += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        let toolBarLength: number = map.zoomSettings.toolbars.length;
        let toolWidth: number = (map.zoomSettings.toolBarOrientation === 'Horizontal') ? (toolBarLength * kitWidth) + (toolBarLength * padding) : (kitWidth * 2);
        let toolHeight: number = (map.zoomSettings.toolBarOrientation === 'Horizontal') ? (kitHeight * 2) : (toolBarLength * kitHeight) + (toolBarLength * padding);
        this.toolBarGroup.appendChild(map.renderer.drawRectangle(new RectOption(
            map.element.id + '_Zooming_Rect', 'transparent', { color: 'transparent', width: 1 },
            1, new Rect(0, 0, toolWidth, toolHeight), 0, 0
        )) as SVGRectElement);
        let defElement: Element = map.renderer.createDefs();
        defElement.innerHTML = shadowElement;
        this.toolBarGroup.appendChild(defElement);
        let outerElement: Element = map.renderer.drawRectangle(new RectOption(
            map.element.id + '_Zooming_Rect', 'transparent', { color: 'transparent', width: 1 },
            0.1, new Rect(0, 0, toolWidth, toolHeight), 0, 0
        ));
        outerElement.setAttribute('filter', 'url(#chart_shadow)');
        this.toolBarGroup.appendChild(outerElement);
        let performFunction: Function;
        for (let i: number = 0; i < toolbarsCollection.length; i++) {
            let toolbar: string = toolbarsCollection[i];
            let pathOptions: PathOption; let polyOptions: PolygonOption;
            this.currentToolbarEle = map.renderer.createGroup({
                id: map.element.id + '_Zooming_ToolBar_' + toolbar + '_Group',
                transform: 'translate( ' + xSpacing + ' ' + ySpacing + ' ) '
            });
            this.currentToolbarEle.setAttribute('class', 'e-maps-toolbar');
            let fillColor: string = '';
            let direction: string = ''; let polygonDirection: string = '';
            switch (toolbar.toLowerCase()) {
                case 'zoom':
                    direction = 'M0.001,14.629L1.372,16l4.571-4.571v-0.685l0.228-0.274c1.051,0.868,2.423,1.417,3.885,1.417c3.291,0,';
                    direction += '5.943-2.651,5.943-5.943S13.395,0,10.103,0S4.16,2.651,4.16,5.943c0,1.508,0.503,2.834,1.417,3.885l-0.274,0.228H4.571';
                    direction = direction + 'L0.001,14.629L0.001,14.629z M5.943,5.943c0-2.285,1.828-4.114,4.114-4.114s4.114,1.828,4.114,';
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(
                        map.element.id + '_Zooming_ToolBar_' + toolbar, this.fillColor, 1, this.fillColor, 1, null,
                        direction + '4.114s-1.828,4.114-4.114,4.114S5.943,8.229,5.943,5.943z')
                    ) as SVGPathElement);
                    this.zoomElements = this.currentToolbarEle;
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
                case 'zoomin':
                    direction = 'M 8, 0 L 8, 16 M 0, 8 L 16, 8';
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(
                        map.element.id + '_Zooming_ToolBar_' + toolbar + '_Path', this.fillColor, 3, this.fillColor, 1, null, direction)
                    ) as SVGPathElement);
                    this.zoomInElements = this.currentToolbarEle;
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
                case 'zoomout':
                    direction = 'M 0, 8 L 16, 8';
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(
                        map.element.id + '_Zooming_ToolBar_' + toolbar, this.fillColor, 3, this.fillColor, 1, null, direction)
                    ) as SVGPathElement);
                    this.zoomOutElements = this.currentToolbarEle;
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
                case 'pan':
                    direction = 'M5,3h2.3L7.275,5.875h1.4L8.65,3H11L8,0L5,3z M3,11V8.7l2.875,0.025v-1.4L3,7.35V5L0,8L3,';
                    direction += '11z M11,13H8.7l0.025-2.875h-1.4L7.35,13H5l3,3L11,13z M13,5v2.3l-2.875-0.025v1.4L13,8.65V11l3-3L13,5z';
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(
                        map.element.id + '_Zooming_ToolBar_' + toolbar, this.selectionColor, 1, this.selectionColor, 1, null,
                        direction)
                    ) as SVGPathElement);
                    this.panColor = this.selectionColor;
                    this.panElements = this.currentToolbarEle;
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
                case 'reset':
                    direction = 'M12.364,8h-2.182l2.909,3.25L16,8h-2.182c0-3.575-2.618-6.5-5.818-6.5c-1.128,0-2.218,0.366-3.091,';
                    direction += '1.016l1.055,1.178C6.581,3.328,7.272,3.125,8,3.125C10.4,3.125,12.363,5.319,12.364,8L12.364,8z M11.091,';
                    direction += '13.484l-1.055-1.178C9.419,12.672,8.728,12.875,8,12.875c-2.4,0-4.364-2.194-4.364-4.875h2.182L2.909,4.75L0,8h2.182c0,';
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(
                        map.element.id + '_Zooming_ToolBar_' + toolbar, this.fillColor, null, null, 1, null,
                        direction + '3.575,2.618,6.5,5.818,6.5C9.128,14.5,10.219,14.134,11.091,13.484L11.091,13.484z')
                    ) as HTMLElement);
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
            }
            this.currentToolbarEle.appendChild(map.renderer.drawCircle(
                new CircleOption(map.element.id + '_Zooming_ToolBar_' + toolbar + '_Rect', 'transparent', { color: this.fillColor, width: 1 }, 1, 8, 8, 16, '')
            ) as SVGRectElement);
            xSpacing = (orientation === 'Horizontal') ? (xSpacing + (kitWidth + padding)) : xSpacing;
            ySpacing = (orientation === 'Horizontal') ? ySpacing : (ySpacing + (kitHeight + padding));
            this.toolBarGroup.appendChild(this.currentToolbarEle);
        }
    }

    public performToolBarAction(e: PointerEvent): void {
        let target: Element = <Element>e.target;
        e.stopImmediatePropagation();
        let isTouch: boolean = e.pointerType === 'touch' || e.pointerType === '2' || (e.type.indexOf('touch') > -1);
        let toolbar: string = target.id.split('_')[3];
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
     * 
     * @private
     */
    public performZoomingByToolBar(type: string): void {
        let map: Maps = this.maps;
        switch (type.toLowerCase()) {
            case 'zoom':
                this.panColor = this.fillColor;
                this.zoomColor = this.selectionColor;
                this.applySelection(this.zoomElements, this.selectionColor);
                this.applySelection(this.panElements, this.fillColor);
                break;
            case 'pan':
                this.panColor = this.selectionColor;
                this.zoomColor = this.fillColor;
                this.applySelection(this.zoomElements, this.fillColor);
                this.applySelection(this.panElements, this.selectionColor);
                break;
            case 'zoomin':
                this.toolBarZooming((map.isTileMap ? map.tileZoomLevel : map.scale) + 1, 'ZoomIn');
                break;
            case 'zoomout':
                this.toolBarZooming((map.isTileMap ? map.tileZoomLevel : map.scale) - 1, 'ZoomOut');
                break;
            case 'reset':
                this.toolBarZooming(1, 'ZoomOut');
                this.applySelection(this.zoomElements, this.fillColor);
                this.applySelection(this.panElements, this.selectionColor);
        }
        this.panningStyle(type.toLowerCase());
    }

    private panningStyle(toolbar: string): void {
        let svg: Element = getElementByID(this.maps.element.id + '_svg');
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
            childElement = elements.childNodes[i] as HTMLElement;
            if (childElement.tagName !== 'circle') {
                childElement.setAttribute('fill', color);
                childElement.setAttribute('stroke', color);
            }
        }
    }

    public showTooltip(e: PointerEvent): void {
        let text: string = (<Element>e.target).id.split('_')[3];
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
        let map: Maps = this.maps;
        let padding: number = 10;
        let element: HTMLElement = createElement('div', { id: map.element.id + '_ToolBar', styles: 'position:absolute;z-index:2' });
        let rectSVGObject: Element = map.renderer.createSvg({
            id: map.element.id + '_Zooming_ToolBar', width: 10, height: 10,
        });
        rectSVGObject.appendChild(this.toolBarGroup);
        element.appendChild(rectSVGObject);
        if (getElementByID(map.element.id + '_Secondary_Element')) {
            getElementByID(map.element.id + '_Secondary_Element').appendChild(element);
        }
        let toolBarSize: ClientRect = this.toolBarGroup.getBoundingClientRect();
        rectSVGObject.setAttribute('height', (toolBarSize.height + padding / 2).toString());
        rectSVGObject.setAttribute('width', (toolBarSize.width + padding / 2).toString());
        let size: Rect = map.mapAreaRect;
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
                x = (size.width - toolBarSize.width) - padding;
                break;
        }
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        let color: string = this.maps.zoomSettings.highlightColor;
        let css: string = ' .e-maps-toolbar:hover > circle { stroke:' + color + '; } .e-maps-toolbar:hover > path { fill: ' + color + ' ;  stroke: ' + color + '; }';
        let style: HTMLStyleElement = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        element.appendChild(style);
    }

    /**
     * To bind events.
     * @return {void}
     * @private
     */
    public wireEvents(element: Element, process: Function): void {
        EventHandler.add(element, Browser.touchStartEvent, process, this);
        EventHandler.add(element, 'mouseover', this.showTooltip, this);
        EventHandler.add(element, 'mouseout', this.removeTooltip, this);
    }

    public mapMouseWheel(e: WheelEvent): void {
        if (this.maps.zoomSettings.enable && this.maps.zoomSettings.mouseWheelZoom) {
            let position: Point = this.getMousePosition(e.pageX, e.pageY);
            let map: Maps = this.maps;
            let size: Size = map.availableSize;
            let prevLevel: number = map.tileZoomLevel;
            let prevScale: number = map.scale;
            let delta: number = 1;
            let value: number = (map.isTileMap) ? prevLevel : prevScale;
            if (((position.x > map.mapAreaRect.x) && (position.x < (map.mapAreaRect.x + map.mapAreaRect.width))) &&
                (position.y > map.mapAreaRect.y) && position.y < (map.mapAreaRect.y + map.mapAreaRect.height)) {
                e.preventDefault();
                let direction: string = (this.browserName === 'mozilla' && !this.isPointer) ?
                    -(e.detail) / 3 > 0 ? 'ZoomIn' : 'ZoomOut' : (e.wheelDelta / 120) > 0 ? 'ZoomIn' : 'ZoomOut';
                if (direction === 'ZoomIn') {
                    this.performZooming(position, (value + delta), direction);
                } else {
                    this.performZooming(position, (value - delta), direction);
                }
            }
        }
    }

    public doubleClick(e: PointerEvent): void {
        let pageX: number = e.pageX;
        let pageY: number = e.pageY;
        let target: Element = <Element>(<PointerEvent>e).target;
        if (this.maps.zoomSettings.enable && this.maps.zoomSettings.doubleClickZoom) {
            let position: Point = this.getMousePosition(pageX, pageY);
            let map: Maps = this.maps;
            let size: Size = map.availableSize;
            let prevLevel: number = map.tileZoomLevel;
            let prevScale: number = map.scale;
            let value: number = (map.isTileMap) ? prevLevel : prevScale;
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
        let element: Element = <Element>e.target;
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
        this.isPanning = this.panColor === this.selectionColor ? true : this.zoomColor !== this.selectionColor;
        this.rectZoomingStart = ((!this.isPanning) && this.maps.zoomSettings.enable);
        this.mouseDownPoints = this.getMousePosition(pageX, pageY);
        if (this.isTouch) {
            this.firstMove = true;
            this.pinchFactor = this.maps.scale;
            this.fingers = touches.length;
        }
    }

    public mouseMoveHandler(e: PointerEvent | TouchEvent): void {
        let pageX: number;
        let pageY: number;
        let map: Maps = this.maps;
        let touchArg: TouchEvent;
        let target: Element;
        let touches: TouchList = null;
        let zoom: ZoomSettings = <ZoomSettings>this.maps.zoomSettings;
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
            } else {
                getElementByID(map.element.id + '_Zooming_KitCollection').setAttribute('opacity', '0.3');
            }
        }
        if (this.isTouch) {
            if (this.maps.zoomSettings.pinchZooming) {
                if (this.firstMove && touches.length === 2) {
                    this.rectZoomingStart = false;
                    this.updateInteraction();
                    this.touchStartList = targetTouches(e);
                } else if (this.touchStartList.length === 2 && touches.length === 2) {
                    this.touchMoveList = targetTouches(e);
                    e.preventDefault();
                    this.rectZoomingStart = false;
                    this.performPinchZooming(<PointerEvent>e);
                }
                this.firstMove = false;
            }
        }
        this.mouseMovePoints = this.getMousePosition(pageX, pageY);
        let targetId: string = e.target['id'];
        let targetEle: Element = <Element>e.target;
        if (zoom.enable && this.isPanning) {
            e.preventDefault();
            this.maps.element.style.cursor = 'pointer';
            this.panning();
        }
        if (this.isTouch ? (touches.length === 1 && this.rectZoomingStart) : this.rectZoomingStart) {
            e.preventDefault();
            this.drawZoomRectangle();
        }
    }

    public mouseUpHandler(e: PointerEvent | TouchEvent): void {
        let map: Maps = this.maps;
        this.rectZoomingStart = false;
        this.isPanning = false;
        this.isTouch = false;
        this.touchStartList = [];
        this.touchMoveList = [];
        this.lastScale = 1;
        this.maps.element.style.cursor = 'auto';
        let zoomRectElement: HTMLElement = <HTMLElement>getElementByID(this.maps.element.id + '_Selection_Rect_Zooming');
        if (zoomRectElement && this.maps.zoomSettings.enable) {
            remove(zoomRectElement);
            this.performRectZooming();
        }
    }

    public mouseCancelHandler(e: PointerEvent): void {
        this.isPanning = false;
        this.isTouch = false;
        this.rectZoomingStart = false;
        let zoomRectElement: HTMLElement = <HTMLElement>getElementByID(this.maps.element.id + '_Selection_Rect_Zooming');
        if (zoomRectElement && this.maps.zoomSettings.enable) {
            remove(zoomRectElement);
            this.performRectZooming();
        }
    }
    /**
     * To handle the click event for maps.
     * @param e 
     */
    public click(e: PointerEvent): void {
        let map: Maps = this.maps;
        if (map.zoomSettings.zoomOnClick && (<Element>e.target).id.indexOf('_ShapeIndex_') > -1 && !map.zoomSettings.doubleClickZoom
            && (this.zoomColor === this.selectionColor && this.zoomElements)) {
            let bounds: Rect = (<SVGPathElement>e.target).getBBox() as Rect;
            let boundwidth: number = bounds.width;
            let boundHeight: number = bounds.height;
            let layerScale: number; let baseScale: number = 1;
            let availWidth: number = map.availableSize.width;
            let availHeight: number = map.availableSize.height;
            layerScale = ((availWidth - 100) / (availHeight - 100) > boundwidth / boundHeight) ? (availHeight - 100) / boundHeight :
                (availWidth - 100) / boundwidth;
            let zoomFactor: number = (layerScale - baseScale + 1);
            let leftPos: number = ((availWidth / 2) - ((boundwidth * map.scale) / 2)) / layerScale;
            let topPos: number = ((availHeight / 2) - ((boundHeight * map.scale) / 2)) / layerScale;
            let translatePointX: number = (-bounds.x) + leftPos;
            let translatePointY: number = (-bounds.y) + topPos;
            map.previousScale = map.scale;
            map.previousPoint = map.translatePoint;
            map.scale = layerScale;
            map.translatePoint = { x: translatePointX, y: translatePointY };
            this.applyTransform(true);
        }
    }

    public getMousePosition(pageX: number, pageY: number): Point {
        let map: Maps = this.maps;
        let elementRect: ClientRect = map.element.getBoundingClientRect();
        let pageXOffset: number = map.element.ownerDocument.defaultView.pageXOffset;
        let pageYOffset: number = map.element.ownerDocument.defaultView.pageYOffset;
        let clientTop: number = map.element.ownerDocument.documentElement.clientTop;
        let clientLeft: number = map.element.ownerDocument.documentElement.clientLeft;
        let positionX: number = elementRect.left + pageXOffset - clientLeft;
        let positionY: number = elementRect.top + pageYOffset - clientTop;
        return new Point((pageX - positionX), (pageY - positionY));
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
     */
    protected getModuleName(): string {
        return 'Zoom';
    }

    /**
     * To destroy the zoom. 
     * @return {void}
     * @private
     */
    public destroy(maps: Maps): void {
        this.removeEventListener();
        /**
         * Destroy method performed here
         */
    }
}
