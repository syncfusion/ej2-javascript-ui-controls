import { isNullOrUndefined, extend, createElement, Ajax } from '@syncfusion/ej2-base';
import { Maps } from '../../maps/maps';
import { getShapeColor } from '../model/theme';
import { GeoLocation, isCustomPath, convertGeoToPoint, Point, PathOption, Size, PolylineOption, removeElement } from '../utils/helper';
import { getElementByID, maintainSelection, getValueFromObject } from '../utils/helper';
import { MapLocation, RectOption, getTranslate, convertTileLatLongToPoint, checkShapeDataFields, CircleOption } from '../utils/helper';
import { getZoomTranslate, fixInitialScaleForTile } from '../utils/helper';
import { LayerSettings, ShapeSettings, Tile, BubbleSettings } from '../model/base';
import { LayerSettingsModel, ShapeSettingsModel, ToggleLegendSettingsModel } from '../model/base-model';
import { BingMap } from './bing-map';
import { ColorMapping } from './color-mapping';
import { layerRendering, ILayerRenderingEventArgs, shapeRendering, IShapeRenderingEventArgs, BubbleSettingsModel, Rect } from '../index';
/**
 * To calculate and render the shape layer
 */

export class LayerPanel {
    private mapObject: Maps;
    private currentFactor: number;
    private groupElements: Element[];
    private layerObject: Element;
    private currentLayer: LayerSettings;
    private rectBounds: Object;
    public tiles: Tile[];
    private clipRectElement: Element;
    private layerGroup: Element;
    private urlTemplate: string;
    private isMapCoordinates: boolean = true;
    private tileSvgObject: Element;
    private ajaxModule: Ajax;
    private ajaxResponse: LayerSettings[];
    private bing: BingMap;
    private animateToZoomX : number;
    private animateToZoomY : number;
    public horizontalPan: boolean = false;
    public horizontalPanXCount: number = 0;
    constructor(map: Maps) {
        this.mapObject = map;
        this.ajaxModule = new Ajax();
        this.ajaxResponse = [];
    }

    /* tslint:disable:no-string-literal */
    public measureLayerPanel(): void {
        let layerCollection: LayerSettings[] = <LayerSettings[]>this.mapObject.layersCollection;
        let areaRect: Rect = this.mapObject.mapAreaRect;
        let secondaryEle: HTMLElement = <HTMLElement>getElementByID(this.mapObject.element.id + '_Secondary_Element');
        if (this.mapObject.isTileMap && secondaryEle) {
            this.tileSvgObject = this.mapObject.renderer.createSvg({
                id: this.mapObject.element.id + '_Tile_SVG', width: areaRect.width,
                height: areaRect.height,
            });
            let parentElement: Element = createElement('div', {
                id: this.mapObject.element.id + '_Tile_SVG_Parent', styles: 'position: absolute; height: ' +
                    (areaRect.height) + 'px; width: '
                    + (areaRect.width) + 'px;'
            });
            parentElement.appendChild(this.tileSvgObject);
            secondaryEle.appendChild(parentElement);
        }
        this.layerGroup = (this.mapObject.renderer.createGroup({
            id: this.mapObject.element.id + '_Layer_Collections',
            'clip-path': 'url(#' + this.mapObject.element.id + '_MapArea_ClipRect)'
        }));
        if (this.mapObject.layers[this.mapObject.baseLayerIndex].layerType === 'GoogleStaticMap') {
            let staticMapSize : number = 640;
            this.clipRectElement = this.mapObject.renderer.drawClipPath(new RectOption(
                this.mapObject.element.id + '_MapArea_ClipRect',
                'transparent', { width: 1, color: 'Gray' }, 1,
                {
                    x: ((areaRect.width - staticMapSize) / 2), y: 0,
                    width: staticMapSize, height: areaRect.height
                }));
        } else {
            this.clipRectElement = this.mapObject.renderer.drawClipPath(new RectOption(
                this.mapObject.element.id + '_MapArea_ClipRect',
                'transparent', { width: 1, color: 'Gray' }, 1,
                {
                    x: this.mapObject.isTileMap ? 0 : areaRect.x, y: this.mapObject.isTileMap ? 0 : areaRect.y,
                    width: areaRect.width, height: areaRect.height
                }));
        }

        this.layerGroup.appendChild(this.clipRectElement);
        this.mapObject.baseMapBounds = null;
        this.mapObject.baseMapRectBounds = null;
        this.mapObject.baseSize = null;
        Array.prototype.forEach.call(layerCollection, (layer: LayerSettings, index: number) => {
            this.currentLayer = <LayerSettings>layer;
            this.processLayers(layer, index);
        });
    }
    /**
     * Tile rendering
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public renderTileLayer(panel: LayerPanel, layer: LayerSettings, layerIndex: number, bing?: BingMap): void {
        panel.currentFactor = panel.calculateFactor(layer);
        if (isNullOrUndefined(panel.mapObject.previousCenterLatitude) &&
            isNullOrUndefined(panel.mapObject.previousCenterLongitude)) {
            panel.mapObject.previousCenterLatitude = panel.mapObject.centerPosition.latitude;
            panel.mapObject.previousCenterLongitude = panel.mapObject.centerPosition.longitude;
        } else if (panel.mapObject.previousCenterLatitude !==
            panel.mapObject.centerPosition.latitude && panel.mapObject.previousCenterLongitude !==
            panel.mapObject.centerPosition.longitude) {
            panel.mapObject.centerPositionChanged = true;
            panel.mapObject.previousCenterLatitude = panel.mapObject.centerPosition.latitude;
            panel.mapObject.previousCenterLongitude = panel.mapObject.centerPosition.longitude;
        } else {
            panel.mapObject.centerPositionChanged = false;
        }
        let center: Point = new Point(panel.mapObject.centerPosition.longitude, panel.mapObject.centerPosition.latitude);
        let centerTileMap : Point = center;
        if ((this.mapObject.isTileMap && panel.mapObject.markerModule) && panel.mapObject.zoomSettings.enable) {
            panel.mapObject.markerModule.calculateZoomCenterPositionAndFactor(this.mapObject.layersCollection);
            if (!isNullOrUndefined(this.mapObject.markerCenterLatitude) && !isNullOrUndefined(this.mapObject.markerCenterLongitude)) {
                centerTileMap = new Point(panel.mapObject.markerCenterLongitude, panel.mapObject.markerCenterLatitude);
            }
        }
        if (!panel.mapObject.zoomSettings.shouldZoomInitially && panel.mapObject.centerPosition.longitude
            && panel.mapObject.centerPosition.latitude && !panel.mapObject.zoomPersistence && panel.mapObject.defaultState) {
            center = new Point(panel.mapObject.centerPosition.longitude, panel.mapObject.centerPosition.latitude);
        } else if (panel.mapObject.zoomSettings.shouldZoomInitially
            && panel.mapObject.markerZoomedState && !panel.mapObject.zoomPersistence
            && !isNullOrUndefined(panel.mapObject.markerZoomCenterPoint)) {
            center = new Point(panel.mapObject.markerZoomCenterPoint.longitude, panel.mapObject.markerZoomCenterPoint.latitude);
        } else {
            center = { x: null, y: null };
        }
        let zoomFactorValue: number = panel.mapObject.zoomSettings.shouldZoomInitially ?
            isNullOrUndefined(panel.mapObject.markerZoomFactor) ? 1 :
            panel.mapObject.markerZoomFactor : panel.mapObject.zoomSettings.zoomFactor;
        zoomFactorValue = (panel.mapObject.enablePersistence) ? ((isNullOrUndefined(panel.mapObject.mapScaleValue))
        ? (isNullOrUndefined(panel.mapObject.markerZoomFactor) ? panel.mapObject.zoomSettings.zoomFactor :
         panel.mapObject.markerZoomFactor) : panel.mapObject.mapScaleValue) : zoomFactorValue;
        zoomFactorValue = panel.mapObject.zoomSettings.enable ? zoomFactorValue : panel.mapObject.zoomSettings.zoomFactor;
        if (isNullOrUndefined(panel.mapObject.tileZoomLevel)) {
            panel.mapObject.tileZoomLevel = zoomFactorValue;
            panel.mapObject.previousZoomFactor = zoomFactorValue;
        }  else if (this.mapObject.isReset && panel.mapObject.tileZoomLevel === 1 && !panel.mapObject.zoomSettings.shouldZoomInitially) {
            panel.mapObject.tileZoomLevel = panel.mapObject.tileZoomLevel;
        } else if (panel.mapObject.zoomSettings.zoomFactor !== 1 || panel.mapObject.zoomSettings.shouldZoomInitially) {
            panel.mapObject.tileZoomLevel = panel.mapObject.defaultState ?
                panel.mapObject.tileZoomLevel : !panel.mapObject.zoomSettings.shouldZoomInitially
                && !panel.mapObject.centerPositionChanged ?
                panel.mapObject.previousZoomFactor !== panel.mapObject.zoomSettings.zoomFactor ?
                    panel.mapObject.zoomSettings.zoomFactor : panel.mapObject.tileZoomLevel : zoomFactorValue;
            if (!isNullOrUndefined(panel.mapObject.tileTranslatePoint) &&
                panel.mapObject.markerZoomFactor !== panel.mapObject.mapScaleValue
                && panel.mapObject.zoomSettings.zoomFactor <= 1) {
                panel.mapObject.tileTranslatePoint.x = 0;
                panel.mapObject.tileTranslatePoint.y = 0;
            }
        }
        if ( zoomFactorValue <= 1 && !isNullOrUndefined(panel.mapObject.height) && !panel.mapObject.zoomSettings.shouldZoomInitially
        && (panel.mapObject.tileZoomLevel === panel.mapObject.tileZoomScale) && this.mapObject.initialCheck ) {
            fixInitialScaleForTile(this.mapObject);
        }
        if (!isNullOrUndefined(panel.mapObject.centerLatOfGivenLocation) && !isNullOrUndefined(panel.mapObject.centerLongOfGivenLocation) &&
            panel.mapObject.zoomNotApplied) {
            centerTileMap.y = panel.mapObject.centerLatOfGivenLocation;
            centerTileMap.x = panel.mapObject.centerLongOfGivenLocation;
            panel.mapObject.tileZoomLevel = panel.mapObject.mapScaleValue = panel.mapObject.scaleOfGivenLocation;
        }
        panel.mapObject.tileTranslatePoint = panel.panTileMap(
            panel.mapObject.availableSize.width, panel.mapObject.availableSize.height, centerTileMap
        );
        if (this.mapObject.zoomSettings.resetToInitial && this.mapObject.initialCheck && !isNullOrUndefined(panel.mapObject.height)
        && this.mapObject.availableSize.height > 512) {
        this.mapObject.applyZoomReset = true;
        this.mapObject.initialZoomLevel = Math.floor(this.mapObject.availableSize.height / 512) + 1;
        let padding : number = this.mapObject.layers[this.mapObject.baseLayerIndex].layerType !== 'GoogleStaticMap' ?
            20 : 0;
        let totalSize : number = Math.pow(2, this.mapObject.initialZoomLevel) * 256;
        this.mapObject.initialTileTranslate.x = (this.mapObject.availableSize.width / 2) - (totalSize / 2);
        this.mapObject.initialTileTranslate.y = (this.mapObject.availableSize.height / 2) - (totalSize / 2) + padding;
        }
        panel.generateTiles(panel.mapObject.tileZoomLevel, panel.mapObject.tileTranslatePoint, null, bing);
        if (panel.mapObject.navigationLineModule) {
            panel.layerObject.appendChild(
                panel.mapObject.navigationLineModule.renderNavigation(panel.currentLayer, panel.mapObject.tileZoomLevel, layerIndex)
            );
        }
        if (panel.mapObject.markerModule) {
            panel.mapObject.markerModule.markerRender(panel.layerObject, layerIndex, panel.mapObject.tileZoomLevel, null);
        }
        panel.translateLayerElements(panel.layerObject, layerIndex);
        panel.layerGroup.appendChild(panel.layerObject);
    }


    protected processLayers(layer: LayerSettings, layerIndex: number): void {
        this.layerObject = (this.mapObject.renderer.createGroup({
            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex
        }));
        if (!this.mapObject.enablePersistence) {
            let itemName: string = this.mapObject.getModuleName() + this.mapObject.element.id;
            if (navigator.userAgent.indexOf('Edge') === -1) {
                if (!isNullOrUndefined(window.localStorage) && window.localStorage.getItem(itemName)) {
                    window.localStorage.removeItem(itemName);
                }
            }
        }
        let eventArgs: ILayerRenderingEventArgs = {
            cancel: false, name: layerRendering, index: layerIndex,
            layer: layer, maps: this.mapObject, visible: layer.visible
        };
        if (this.mapObject.isBlazor) {
            const { maps, layer, ...blazorEventArgs }: ILayerRenderingEventArgs = eventArgs;
            eventArgs = blazorEventArgs;
        }
        this.mapObject.trigger('layerRendering', eventArgs, (observedArgs: ILayerRenderingEventArgs) => {
            if (!eventArgs.cancel && eventArgs.visible) {
                if (layer.layerType !== 'Geometry') {
                    if (layer.layerType !== 'Bing' || this.bing) {
                        this.renderTileLayer(this, layer, layerIndex);
                    } else if (layer.key && layer.key.length > 1) {
                        let proxy: LayerPanel = this;
                        let bing: BingMap = new BingMap(this.mapObject);
                        let bingType: string = layer.bingMapType === 'AerialWithLabel' ? 'AerialWithLabelsOnDemand' : layer.bingMapType;
                        let url: string = 'https://dev.virtualearth.net/REST/V1/Imagery/Metadata/' + bingType;
                        let ajax: Ajax = new Ajax({
                            url: url + '?output=json&include=ImageryProviders&urischeme=https&key=' + layer.key
                        });
                        ajax.onSuccess = (json: string) => {
                            let jsonObject: object = JSON.parse(json);
                            let resource: object = jsonObject['resourceSets'][0]['resources'][0];
                            let imageUrl: string = <string>resource['imageUrl'];
                            let subDomains: string[] = <string[]>resource['imageUrlSubdomains'];
                            let maxZoom: string = <string>resource['zoomMax'];
                            if (imageUrl !== null && imageUrl !== undefined && imageUrl !== bing.imageUrl) {
                                bing.imageUrl = imageUrl;
                            }
                            if (subDomains !== null && subDomains !== undefined && subDomains !== bing.subDomains) {
                                bing.subDomains = subDomains;
                            }
                            if (maxZoom !== null && maxZoom !== undefined && maxZoom !== bing.maxZoom) {
                                bing.maxZoom = maxZoom;
                            }
                            proxy.mapObject['bingMap'] = bing;
                            proxy.renderTileLayer(proxy, layer, layerIndex, bing);
                            this.mapObject.arrangeTemplate();
                        };
                        ajax.send();
                    }
                } else {
                    if (!isNullOrUndefined(layer.shapeData) && (!isNullOrUndefined(layer.shapeData['geometries']) ||
                        !isNullOrUndefined(layer.shapeData['features']))) {
                        let featureData: Object[] = (!isNullOrUndefined(layer.shapeData['geometries']) &&
                            (<Object[]>layer.shapeData['geometries']).length > 0 ? layer.shapeData['geometries'] :
                            layer.shapeData['features']);
                        layer.layerData = [];
                        let bbox: Object = layer.shapeData['bbox'];
                        if (!isNullOrUndefined(bbox) && layer.isBaseLayer) {
                            this.mapObject.baseMapBounds = new GeoLocation(
                                { min: bbox[0][1], max: bbox[1][1] },
                                { min: bbox[0][0], max: bbox[1][0] }
                            );
                        } else if (isNullOrUndefined(this.mapObject.baseMapBounds) && !isCustomPath(featureData)) {
                            this.calculateRectBounds(featureData);
                        }
                        this.calculatePathCollection(layerIndex, featureData);
                    }
                }
            }
        });
        if (!this.mapObject.isTileMap) {
            this.mapObject.svgObject.appendChild(this.layerGroup);
        } else if (this.tileSvgObject) {
            this.tileSvgObject.appendChild(this.layerGroup);
            this.mapObject.baseMapBounds = null;
        }
    }

    //tslint:disable:max-func-body-length
    private bubbleCalculation(bubbleSettings: BubbleSettingsModel, range: { min: number, max: number }): void {
        if (bubbleSettings.dataSource != null && bubbleSettings != null) {
            for (let i: number = 0; i < bubbleSettings.dataSource.length; i++) {
                let bubbledata: number = (!isNullOrUndefined(bubbleSettings.valuePath)) ? ((bubbleSettings.valuePath.indexOf('.') > -1) ?
                                          Number(getValueFromObject(bubbleSettings.dataSource[i], bubbleSettings.valuePath)) :
                                          parseFloat(bubbleSettings.dataSource[i][bubbleSettings.valuePath])) :
                                          parseFloat(bubbleSettings.dataSource[i][bubbleSettings.valuePath]);
                if (i !== 0) {
                    if (bubbledata > range.max) {
                        range.max = bubbledata;
                    } else if (bubbledata < range.min) {
                        range.min = bubbledata;
                    }
                } else {
                    range.max = range.min = bubbledata;
                }
            }
        }
    }
    // tslint:disable-next-line:max-func-body-length
    public calculatePathCollection(layerIndex: number, renderData: Object[]): void {
        this.groupElements = [];
        if ((!isCustomPath(renderData))) {
            this.currentFactor = this.calculateFactor(this.currentLayer);
        }
        this.rectBounds = null;
        let shapeSettings: ShapeSettings = <ShapeSettings>this.currentLayer.shapeSettings;
        let bubbleSettings: BubbleSettings[] = <BubbleSettings[]>this.currentLayer.bubbleSettings;
        Array.prototype.forEach.call(renderData, (geometryData: Object, index: number) => {
            if (!isNullOrUndefined(geometryData['geometry']) || !isNullOrUndefined(geometryData['coordinates'])) {
                let type: string = !isNullOrUndefined(geometryData['geometry']) ? geometryData['geometry']['type'] : geometryData['type'];
                let coords: Object[] = !isNullOrUndefined(geometryData['geometry']) ? geometryData['geometry']['coordinates'] :
                    geometryData['coordinates'];
                let data: Object = geometryData['geometry'];
                let properties: Object = geometryData['properties'];
                this.generatePoints(type, coords, data, properties);
            }
        });
        this.currentLayer.rectBounds = this.rectBounds;
        if (isNullOrUndefined(this.mapObject.baseMapRectBounds) && this.currentLayer.isBaseLayer) {
            this.mapObject.baseMapRectBounds = this.rectBounds;
        }
        let colors: string[] = shapeSettings.palette.length > 1 ? shapeSettings.palette : getShapeColor(this.mapObject.theme);
        let labelTemplateEle: HTMLElement = createElement('div', {
            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_Label_Template_Group',
            className: 'template',
            styles: 'pointer-events: none; overflow: hidden; position: absolute;' +
                'top:' + this.mapObject.mapAreaRect.y + 'px;' +
                'left:' + this.mapObject.mapAreaRect.x + 'px;' +
                'height:' + this.mapObject.mapAreaRect.height + 'px;' +
                'width:' + this.mapObject.mapAreaRect.width + 'px;'
        });
        if (this.currentLayer.layerData.length !== 0) {
            for (let i: number = 0; i < this.currentLayer.layerData.length; i++) {
                let k: number;
                let currentShapeData: Object[] = <Object[]>this.currentLayer.layerData[i];
                let pathOptions: PathOption; let polyLineOptions: PolylineOption;
                let circleOptions: CircleOption; let groupElement: Element; let drawObject: Element;
                let path: string = ''; let points: string = ''; let getShapeColor: Object;
                let fill: string = (shapeSettings.autofill) ? colors[i % colors.length] : shapeSettings.fill;
                let opacity: number;
                if (shapeSettings.colorValuePath !== null && !isNullOrUndefined(currentShapeData['property'])) {
                    k = checkShapeDataFields(
                        <Object[]>this.currentLayer.dataSource, currentShapeData['property'],
                        this.currentLayer.shapeDataPath, this.currentLayer.shapePropertyPath, this.currentLayer
                    );
                    if (k !== null && shapeSettings.colorMapping.length === 0) {
                        fill = ((this.currentLayer.shapeSettings.colorValuePath.indexOf('.') > -1) ?
                                (getValueFromObject(this.currentLayer.dataSource[k], shapeSettings.colorValuePath)) :
                                this.currentLayer.dataSource[k][shapeSettings.colorValuePath]);
                    } else if (currentShapeData['property'][shapeSettings.colorValuePath] &&
                        (<Object[]>this.currentLayer.dataSource).length === 0 && shapeSettings.colorMapping.length === 0) {
                            fill = ((this.currentLayer.shapeSettings.colorValuePath.indexOf('.') > -1) ?
                                   (getValueFromObject(currentShapeData['property'], shapeSettings.colorValuePath)) :
                                   currentShapeData['property'][shapeSettings.colorValuePath]);
                    }
                }
                let shapeID: string = this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + i + '_dataIndex_' + k;
                getShapeColor = this.getShapeColorMapping(this.currentLayer, currentShapeData['property'], fill);
                fill = Object.prototype.toString.call(getShapeColor) === '[object Object]' && !isNullOrUndefined(getShapeColor['fill'])
                    ? getShapeColor['fill'] : fill;
                opacity = (Object.prototype.toString.call(getShapeColor) === '[object Object]'
                    && !isNullOrUndefined(getShapeColor['opacity'])) ? getShapeColor['opacity'] : shapeSettings.opacity;
                let eventArgs: IShapeRenderingEventArgs = {
                    cancel: false, name: shapeRendering, index: i,
                    data: this.currentLayer.dataSource ? this.currentLayer.dataSource[k] : null,
                    maps: this.mapObject,
                    shape: shapeSettings, fill: fill,
                    border: { width: shapeSettings.border.width, color: shapeSettings.border.color }
                };
                if (this.mapObject.isBlazor) {
                    const { maps, ...blazorEventArgs }: IShapeRenderingEventArgs = eventArgs;
                    eventArgs = blazorEventArgs;
                }
                 // tslint:disable-next-line:max-func-body-length
                 let shapeRenderingSuccess: Function = (eventArgs: IShapeRenderingEventArgs) => {
                    let drawingType: string = !isNullOrUndefined(currentShapeData['_isMultiPolygon'])
                    ? 'MultiPolygon' : isNullOrUndefined(currentShapeData['type']) ? currentShapeData[0]['type'] : currentShapeData['type'];
                    drawingType = (drawingType === 'Polygon' || drawingType === 'MultiPolygon') ? 'Polygon' : drawingType;
                    if (!eventArgs.cancel) {
                        eventArgs.fill = eventArgs.fill === '#A6A6A6' ? eventArgs.shape.fill : eventArgs.fill;
                        eventArgs.border.color = eventArgs.border.color === '#000000' ? eventArgs.shape.border.color
                            : eventArgs.border.color;
                        eventArgs.border.width = eventArgs.border.width === 0 ? eventArgs.shape.border.width : eventArgs.border.width;
                        this.mapObject.layers[layerIndex].shapeSettings.border = eventArgs.border;
                    } else {
                        eventArgs.fill = fill;
                        eventArgs.border.color = shapeSettings.border.color;
                        eventArgs.border.width = shapeSettings.border.width;
                        this.mapObject.layers[layerIndex].shapeSettings.border = shapeSettings.border;
                    }
                    if (this.groupElements.length < 1) {
                        groupElement = this.mapObject.renderer.createGroup({
                            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_' + drawingType + '_Group', transform: ''
                        });
                        this.groupElements.push(groupElement);
                    } else {
                        for (let i: number = 0; i < this.groupElements.length; i++) {
                            let ele: Element = this.groupElements[i];
                            if (ele.id.indexOf(drawingType) > -1) {
                                groupElement = ele;
                                break;
                            } else if (i >= this.groupElements.length - 1) {
                                groupElement = this.mapObject.renderer.createGroup({
                                    id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_' + drawingType + '_Group'
                                });
                                this.groupElements.push(groupElement);
                                break;
                            }
                        }
                    }
                    let pathEle: Element;
                    switch (drawingType) {
                        case 'Polygon':
                            if (!currentShapeData['_isMultiPolygon']) {
                                path += 'M' + (currentShapeData[0]['point']['x']) + ' ' + (currentShapeData[0]['point']['y']);
                                currentShapeData.map((shapeData: Object) => {
                                    path += ' L ' + (shapeData['point']['x']) + ' ' + (shapeData['point']['y']);
                                });
                            } else {
                                path = this.generateMultiPolygonPath(<Object[]>currentShapeData);
                            }
                            path += ' z ';
                            if (path.length > 3) {
                                pathOptions = new PathOption(
                                    shapeID, eventArgs.fill, eventArgs.border.width, eventArgs.border.color,
                                    opacity, shapeSettings.dashArray, path);
                                pathEle = this.mapObject.renderer.drawPath(pathOptions) as SVGPathElement;
                            }
                            break;
                        case 'LineString':
                            currentShapeData.map((lineData: Object) => {
                                points += lineData['point']['x'] + ' , ' + lineData['point']['y'] + ' ';
                            });
                            polyLineOptions = new PolylineOption(
                                shapeID, points, eventArgs.fill, eventArgs.border.width, eventArgs.border.color,
                                opacity, shapeSettings.dashArray);
                            pathEle = this.mapObject.renderer.drawPolyline(polyLineOptions) as SVGPolylineElement;
                            break;
                        case 'Point':
                            let pointData: Object = <Object>currentShapeData['point'];
                            circleOptions = new CircleOption(
                                shapeID, eventArgs.fill, eventArgs.border, opacity,
                                pointData['x'], pointData['y'], shapeSettings.circleRadius, null);
                            pathEle = this.mapObject.renderer.drawCircle(circleOptions) as SVGCircleElement;
                            break;
                        case 'Path':
                            path = <string>currentShapeData['point'];
                            pathOptions = new PathOption(
                                shapeID, eventArgs.fill, eventArgs.border.width, eventArgs.border.color, opacity,
                                shapeSettings.dashArray, path);
                            pathEle = this.mapObject.renderer.drawPath(pathOptions) as SVGPathElement;
                            break;
                    }
                    if (!isNullOrUndefined(pathEle)) {
                        let property: string[] = (Object.prototype.toString.call(this.currentLayer.shapePropertyPath) === '[object Array]' ?
                            this.currentLayer.shapePropertyPath : [this.currentLayer.shapePropertyPath]) as string[];
                        // tslint:disable-next-line:align
                        let properties: string;
                        for (let j: number = 0; j < property.length; j++) {
                            if (!isNullOrUndefined(currentShapeData['property'])) {
                                properties = property[j];
                                break;
                            }
                        }
                        pathEle.setAttribute('aria-label', ((!isNullOrUndefined(currentShapeData['property'])) ?
                            (currentShapeData['property'][properties]) : ''));
                        pathEle.setAttribute('tabindex', (this.mapObject.tabIndex + i + 2).toString());
                        maintainSelection(this.mapObject.selectedElementId, this.mapObject.shapeSelectionClass, pathEle,
                                          'ShapeselectionMapStyle');
                        if (this.mapObject.toggledShapeElementId) {
                            for (let j: number = 0; j < this.mapObject.toggledShapeElementId.length; j++) {
                                let styleProperty: ShapeSettingsModel | ToggleLegendSettingsModel =
                                    this.mapObject.legendSettings.toggleLegendSettings.applyShapeSettings ?
                                    this.currentLayer.shapeSettings : this.mapObject.legendSettings.toggleLegendSettings;
                                if (this.mapObject.toggledShapeElementId[j] === pathEle.id) {
                                    pathEle.setAttribute('fill', styleProperty.fill);
                                    pathEle.setAttribute('stroke', styleProperty.border.color);
                                    pathEle.setAttribute('opacity', (styleProperty.opacity).toString());
                                    pathEle.setAttribute('stroke-width', (styleProperty.border.width).toString());
                                }
                            }
                        }
                        groupElement.appendChild(pathEle);
                    }
                    if (i === this.currentLayer.layerData.length - 1) {
                        this.layerFeatures(layerIndex, colors, renderData, labelTemplateEle);
                    }
                };
                shapeRenderingSuccess.bind(this);
                this.mapObject.trigger('shapeRendering', eventArgs, shapeRenderingSuccess);
            }
        } else {
            this.layerFeatures(layerIndex, colors, renderData, labelTemplateEle);
        }
    }

    /**
     *  layer features as bubble, marker, datalabel, navigation line.
     */
    private layerFeatures(
        layerIndex: number, colors: string[], renderData: Object[],
        labelTemplateEle: HTMLElement
    ): void {
        let bubbleG: Element;
        if (this.currentLayer.bubbleSettings.length && this.mapObject.bubbleModule) {
            let length: number = this.currentLayer.bubbleSettings.length;
            let bubble: BubbleSettingsModel;
            for (let j: number = 0; j < length; j++) {
                bubble = this.currentLayer.bubbleSettings[j];
                bubbleG = this.mapObject.renderer.createGroup({
                    id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_bubble_Group_' + j
                });
                let range: {
                    min: number;
                    max: number;
                } = { min: 0, max: 0 };
                this.bubbleCalculation(bubble, range);
                bubble.dataSource.map((bubbleData: object, i: number) => {
                    this.renderBubble(
                        this.currentLayer, bubbleData, colors[i % colors.length], range, j, i, bubbleG, layerIndex, bubble);
                });
                this.groupElements.push(bubbleG);
            }
        }
        if ((this.mapObject.markerModule && !this.mapObject.isTileMap) && this.mapObject.zoomSettings.enable) {
            this.mapObject.markerModule.calculateZoomCenterPositionAndFactor(this.mapObject.layersCollection);
        }
        let group: Element = (this.mapObject.renderer.createGroup({
            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_dataLableIndex_Group',
            style: 'pointer-events: none;'
        }));
        if (this.mapObject.dataLabelModule && this.currentLayer.dataLabelSettings.visible) {
            let intersect: object[] = [];
            renderData.map((currentShapeData: object[], i: number) => {
                this.renderLabel(this.currentLayer, layerIndex, currentShapeData, group, i, labelTemplateEle, intersect);
            });
            this.groupElements.push(group);
        }
        if (this.mapObject.navigationLineModule) {
            this.groupElements.push(
                this.mapObject.navigationLineModule.renderNavigation(this.currentLayer, this.currentFactor, layerIndex)
                );
        }
        this.groupElements.map((element: Element) => {
            this.layerObject.appendChild(element);
        });
        if (this.mapObject.markerModule) {
            this.mapObject.markerModule.markerRender(
                this.layerObject, layerIndex, (this.mapObject.isTileMap ? Math.floor(this.currentFactor)
                : this.currentFactor),
                null
            );
        }
        this.translateLayerElements(this.layerObject, layerIndex);
        this.layerGroup.appendChild(this.layerObject);
    }

    /**
     *  render datalabel
     */
    private renderLabel(
        layer: LayerSettings, layerIndex: number,
        shape: object[], group: Element, shapeIndex: number, labelTemplateEle: HTMLElement, intersect: object[]
    ): void {
        this.mapObject.dataLabelModule.renderLabel(
            layer, layerIndex, shape, layer.layerData, group, labelTemplateEle, shapeIndex, intersect
        );
    }
    /**
     * To render path for multipolygon
     */
    private generateMultiPolygonPath(currentShapeData: Object[]): string {
        let path: string = '';
        let shape: Object[];
        for (let j: number = 0; j < currentShapeData.length; j++) {
            path += 'M' + (currentShapeData[j][0]['point']['x']) + ' ' + (currentShapeData[j][0]['point']['y']);
            shape = <Object[]>currentShapeData[j];
            shape.map((shapeData: Object) => {
                path += ' L ' + (shapeData['point']['x']) + ' ' + (shapeData['point']['y']);
            });
        }
        return path;
    }
    /**
     * To render bubble
     */
    private renderBubble(
        layer: LayerSettings, bubbleData: object, color: string, range: { min: number, max: number },
        bubbleIndex: number, dataIndex: number, group: Element, layerIndex: number, bubbleSettings: BubbleSettingsModel
    ): void {
        if (isNullOrUndefined(this.mapObject.bubbleModule) || !bubbleSettings.visible) {
            return null;
        }
        color = bubbleSettings.fill ? bubbleSettings.fill : color;
        this.mapObject.bubbleModule.id = this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_BubbleIndex_' +
            bubbleIndex + '_dataIndex_' + dataIndex;
        this.mapObject.bubbleModule.renderBubble(
            bubbleSettings, bubbleData, color, range, bubbleIndex, dataIndex, layerIndex, layer, group, this.mapObject.bubbleModule.id);
    }
    /**
     * To get the shape color from color mapping module
     */
    private getShapeColorMapping(layer: LayerSettingsModel, shape: object, color: string): Object {
        color = color ? color : layer.shapeSettings.fill;
        if (layer.shapeSettings.colorMapping.length === 0 && isNullOrUndefined(layer.dataSource)) {
            return color;
        }
        let index: number = checkShapeDataFields(<Object[]>layer.dataSource, shape, layer.shapeDataPath, layer.shapePropertyPath, layer);
        let colorMapping: ColorMapping = new ColorMapping(this.mapObject);
        if (isNullOrUndefined(layer.dataSource[index])) {
            return color;
        }
        return colorMapping.getShapeColorMapping(layer.shapeSettings, layer.dataSource[index], color);
    }
    public generatePoints(type: string, coordinates: Object[], data: Object, properties: Object): void {
        let latitude: number; let longitude: number;
        let newData: Object[] = [];
        switch (type.toLowerCase()) {
            case 'polygon':
                newData = <Object[]>this.calculatePolygonBox(<Object[]>coordinates[0], data, properties);
                if (newData.length > 0) {
                    newData['property'] = properties;
                    newData['type'] = type;
                    newData['_isMultiPolygon'] = false;
                    this.currentLayer.layerData.push(newData);
                }
                break;
            case 'multipolygon':
                let multiPolygonDatas: Object[] = [];
                for (let i: number = 0; i < coordinates.length; i++) {
                    newData = <Object[]>this.calculatePolygonBox(<Object[]>coordinates[i][0], data, properties);
                    if (newData.length > 0) {
                        multiPolygonDatas.push(newData);
                    }
                }
                multiPolygonDatas['property'] = properties;
                multiPolygonDatas['type'] = type;
                multiPolygonDatas['_isMultiPolygon'] = true;
                this.currentLayer.layerData.push(multiPolygonDatas);
                break;
            case 'linestring':
                coordinates.map((points: Object, index: number) => {
                    latitude = <number>points[1];
                    longitude = <number>points[0];
                    let point: Point = convertGeoToPoint(
                        latitude, longitude, this.currentFactor, this.currentLayer, this.mapObject);
                    newData.push({
                        point: point, lat: latitude, lng: longitude
                    });
                });
                newData['property'] = properties;
                newData['type'] = type;
                this.currentLayer.layerData.push(newData);
                break;
            case 'point':
                let arrayCollections: boolean = false;
                coordinates.map((points: Object, index: number) => {
                    if (Object.prototype.toString.call(points) === '[object Array]') {
                        latitude = points[1];
                        longitude = points[0];
                        arrayCollections = true;
                        let point: Point = convertGeoToPoint(latitude, longitude, this.currentFactor, this.currentLayer, this.mapObject);
                        this.currentLayer.layerData.push({
                            point: point, type: type, lat: latitude, lng: longitude, property: properties
                        });
                    }
                });
                if (!arrayCollections) {
                    latitude = <number>coordinates[1];
                    longitude = <number>coordinates[0];
                    let point: Point = convertGeoToPoint(latitude, longitude, this.currentFactor, this.currentLayer, this.mapObject);
                    this.currentLayer.layerData.push({
                        point: point, type: type, lat: latitude, lng: longitude, property: properties
                    });
                }
                break;
            case 'path':
                this.currentLayer.layerData.push({
                    point: data['d'], type: type, property: properties
                });
                break;
        }
    }

    public calculateFactor(layer: LayerSettings): number {
        let horFactor: number; let verFactor: number = 1;
        let divide: number = 10;
        let exp: string = 'e+1';
        let bounds: GeoLocation = this.mapObject.baseMapBounds;
        let mapSize: Size = new Size(this.mapObject.mapAreaRect.width, this.mapObject.mapAreaRect.height - 5);
        let mapHeight: number; let mapWidth: number;
        if (bounds) {
            let start: Point = convertGeoToPoint(
                bounds.latitude.min, bounds.longitude.min, null, layer, this.mapObject);
            let end: Point = convertGeoToPoint(
                bounds.latitude.max, bounds.longitude.max, null, layer, this.mapObject);
            mapHeight = end.y - start.y;
            mapWidth = end.x - start.x;
        } else {
            mapHeight = mapWidth = 500;
        }
        if (mapHeight < mapSize.height) {
            horFactor = parseFloat(Math.abs(Number(mapSize.height / Number(mapHeight.toString() + exp)) * 100).toString().split('.')[0])
                / divide;
        } else {
            horFactor = mapSize.height / mapHeight;
        }
        if (mapWidth < mapSize.width) {
            verFactor = parseFloat(Math.abs(Number(mapSize.width / Number(mapWidth.toString() + exp)) * 100).toString().split('.')[0])
                / divide;
        } else {
            verFactor = mapSize.width / mapWidth;
        }
        return (Math.min(verFactor, horFactor));
    }

    public translateLayerElements(layerElement: Element, index: number): void {
        let childNode: HTMLElement;
        this.mapObject.translateType = 'layer';
        if (!isNullOrUndefined(this.mapObject.baseMapRectBounds)) {
            let duration: number = this.currentLayer.animationDuration;
            let animate: boolean = duration !== 0 || isNullOrUndefined(this.mapObject.zoomModule);
            this.mapObject.baseTranslatePoint = this.mapObject.zoomTranslatePoint;
            let translate: Object;
            if (this.mapObject.zoomSettings.zoomFactor > 1 && !isNullOrUndefined(this.mapObject.zoomModule)) {
                translate = getZoomTranslate(this.mapObject, this.currentLayer, animate);
            } else {
                translate = getTranslate(this.mapObject, this.currentLayer, animate);
            }
            let scale: number = this.mapObject.previousScale = translate['scale'];
            let location: Point = this.mapObject.previousPoint = translate['location'] as Point;
            this.mapObject.baseTranslatePoint = this.mapObject.translatePoint = location;
            this.mapObject.baseScale = this.mapObject.scale = scale;
            for (let i: number = 0; i < layerElement.childElementCount; i++) {
                childNode = layerElement.childNodes[i] as HTMLElement;
                if (!(childNode.id.indexOf('_Markers_Group') > -1) &&
                    (!(childNode.id.indexOf('_bubble_Group') > -1)) &&
                    (!(childNode.id.indexOf('_dataLableIndex_Group') > -1))
                ) {
                    let transform: string = 'scale( ' + scale + ' ) '
                        + 'translate( ' + location.x + ' ' + location.y + ' ) ';
                    childNode.setAttribute('transform', transform);
                    if (duration > 0 && !isNullOrUndefined(this.mapObject.zoomModule)) {
                        if (this.mapObject.zoomSettings.zoomFactor > 1) {
                            translate = getZoomTranslate(this.mapObject, this.currentLayer);
                        } else {
                            translate = getTranslate(this.mapObject, this.currentLayer);
                        }
                        this.mapObject.scale = translate['scale'];
                        this.mapObject.zoomTranslatePoint = this.mapObject.translatePoint = translate['location'] as Point;
                    }
                }
            }
        } else if (this.mapObject.isTileMap && !isNullOrUndefined(this.mapObject.scale)) {
            for (let j: number = 0; j < layerElement.childElementCount; j++) {
                childNode = layerElement.childNodes[j] as HTMLElement;
                if (!(childNode.id.indexOf('_Markers_Group') > -1) &&
                    (!(childNode.id.indexOf('_bubble_Group') > -1)) &&
                    (!(childNode.id.indexOf('_dataLableIndex_Group') > -1)) &&
                    (!(childNode.id.indexOf('_line_Group') > -1))) {
                    let transform: string = 'scale( ' + this.mapObject.scale + ' ) ' + 'translate( ' + this.mapObject.translatePoint.x
                        + ' ' + this.mapObject.translatePoint.y + ' ) ';
                    childNode.setAttribute('transform', transform);
                }
            }
        }
    }

    public calculateRectBounds(layerData: Object[]): void {
        Array.prototype.forEach.call(layerData, (obj: Object, index: number) => {
            if (!isNullOrUndefined(obj['geometry']) || !isNullOrUndefined(obj['coordinates'])) {
                let type: string = !isNullOrUndefined(obj['geometry']) ? obj['geometry']['type'] : obj['type'];
                let coordinates: Object[] = !isNullOrUndefined(obj['geometry']) ? obj['geometry']['coordinates'] : obj['coordinates'];
                switch (type.toLowerCase()) {
                    case 'polygon':
                        this.calculateRectBox(<Object[]>coordinates[0]);
                        break;
                    case 'multipolygon':
                        coordinates.map((point: Object, index: number) => {
                            this.calculateRectBox(point[0]);
                        });
                        break;
                }
            }
        });
    }

    public calculatePolygonBox(coordinates: Object[], data: Object, properties: Object): Object {
        let newData: Object[] = [];
        let bounds: GeoLocation = this.mapObject.baseMapBounds;
        coordinates.map((currentPoint: Object, index: number) => {
            let latitude: number = currentPoint[1];
            let longitude: number = currentPoint[0];
            if ((longitude >= bounds.longitude.min && longitude <= bounds.longitude.max)
                && (latitude >= bounds.latitude.min && latitude <= bounds.latitude.max)) {
                let point: Point = convertGeoToPoint(
                    latitude, longitude, this.currentFactor, this.currentLayer, this.mapObject
                );
                if (isNullOrUndefined(this.rectBounds)) {
                    this.rectBounds = { min: { x: point.x, y: point.y }, max: { x: point.x, y: point.y } };
                } else {
                    this.rectBounds['min']['x'] = Math.min(this.rectBounds['min']['x'], point.x);
                    this.rectBounds['min']['y'] = Math.min(this.rectBounds['min']['y'], point.y);
                    this.rectBounds['max']['x'] = Math.max(this.rectBounds['max']['x'], point.x);
                    this.rectBounds['max']['y'] = Math.max(this.rectBounds['max']['y'], point.y);
                }
                newData.push({
                    point: point,
                    lat: latitude,
                    lng: longitude
                });
            }
        });
        return newData;
    }

    public calculateRectBox(coordinates: Object[]): void {
        Array.prototype.forEach.call(coordinates, (currentCoords: Object) => {
            if (isNullOrUndefined(this.mapObject.baseMapBounds)) {
                this.mapObject.baseMapBounds = new GeoLocation(
                    { min: currentCoords[1], max: currentCoords[1] },
                    { min: currentCoords[0], max: currentCoords[0] });
            } else {
                this.mapObject.baseMapBounds.latitude.min = Math.min(this.mapObject.baseMapBounds.latitude.min, currentCoords[1]);
                this.mapObject.baseMapBounds.latitude.max = Math.max(this.mapObject.baseMapBounds.latitude.max, currentCoords[1]);
                this.mapObject.baseMapBounds.longitude.min = Math.min(this.mapObject.baseMapBounds.longitude.min, currentCoords[0]);
                this.mapObject.baseMapBounds.longitude.max = Math.max(this.mapObject.baseMapBounds.longitude.max, currentCoords[0]);
            }
        });
    }
    public generateTiles(zoomLevel: number, tileTranslatePoint: Point, zoomType?: string, bing?: BingMap, position?: Point): void {
        let userLang: string = this.mapObject.locale;
        let size: Size = this.mapObject.availableSize;
        this.tiles = [];
        let xcount: number;
        let ycount: number;
        xcount = ycount = Math.pow(2, zoomLevel);
        let xLeft: number = 0; let xRight: number = 0;
        if ((tileTranslatePoint.x + (xcount * 256)) < size.width) {
            xLeft = tileTranslatePoint.x > 0 ? Math.ceil(tileTranslatePoint.x / 256) : 0;
            xRight = ((tileTranslatePoint.x + xcount * 256) < size.width) ?
                Math.ceil((size.width - (tileTranslatePoint.x + xcount * 256)) / 256) : 0;
        }
        xcount += xLeft + xRight;
        if (zoomType === 'Pan') {
            if (this.horizontalPanXCount !== xcount) {
                xcount = this.horizontalPanXCount;
                this.horizontalPan = false;
                return null;
            }
        } else {
            this.horizontalPanXCount = xcount;
            this.horizontalPan = true;
        }
        let baseLayer: LayerSettingsModel = this.mapObject.layers[this.mapObject.baseLayerIndex];
        this.urlTemplate = baseLayer.urlTemplate;
        let endY: number = Math.min(ycount, ((-tileTranslatePoint.y + size.height) / 256) + 1);
        let endX: number = Math.min(xcount, ((-tileTranslatePoint.x + size.width + (xRight * 256)) / 256) + 1);
        let startX: number = (-((tileTranslatePoint.x + (xLeft * 256)) + 256) / 256);
        let startY: number = (-(tileTranslatePoint.y + 256) / 256);
        bing = bing || this.bing || this.mapObject['bingMap'];
        for (let i: number = Math.round(startX); i < Math.round(endX); i++) {
            for (let j: number = Math.round(startY); j < Math.round(endY); j++) {
                let x: number = 256 * i + tileTranslatePoint.x;
                let y: number = 256 * j + tileTranslatePoint.y;
                if (x > -256 && x <= size.width && y > -256 && y < size.height) {
                    if (j >= 0) {
                        let tileI: number = i;
                        if (i < 0) {
                            tileI = (tileI % ycount) + ycount;
                        }
                        let tile: Tile = new Tile(tileI % ycount, j);
                        tile.left = x;
                        tile.top = y;
                        if (baseLayer.layerType === 'Bing') {
                            let key: string = baseLayer.key;
                            tile.src = bing.getBingMap(tile, key, baseLayer.bingMapType, userLang, bing.imageUrl, bing.subDomains);
                        } else {
                            tile.src = this.urlTemplate.replace('level', zoomLevel.toString()).replace('tileX', tile.x.toString())
                                .replace('tileY', tile.y.toString());
                        }
                        this.tiles.push(tile);
                    }
                }
            }
        }
        if (!isNullOrUndefined(zoomType)) {
            if (zoomType.indexOf('wheel') > 1) {
                this.animateToZoomX = (this.mapObject.availableSize.width / 2) - position.x - 10;
                this.animateToZoomY = -position.y;
            } else {
                this.animateToZoomX = -10;
                this.animateToZoomY = -(this.mapObject.availableSize.height / 2 + 11.5) + 10;
            }
        }
        let proxTiles: Tile[] = extend([], this.tiles, [], true) as Tile[];
        for (let layer of this.mapObject.layers) {
            if (!(layer.type === 'SubLayer' && layer.visible)) {
                continue;
            }
            if (layer.layerType === 'OSM' || layer.layerType === 'Bing') {
                for (let baseTile of proxTiles) {
                    let subtile: Tile = extend(baseTile, {}, {}, true) as Tile;
                    if (layer.layerType === 'Bing') {
                        subtile.src = bing.getBingMap(subtile, layer.key, layer.bingMapType, userLang, bing.imageUrl, bing.subDomains);
                    } else {
                        subtile.src = layer.urlTemplate.replace('level', zoomLevel.toString()).replace('tileX', baseTile.x.toString())
                            .replace('tileY', baseTile.y.toString());
                    }
                    this.tiles.push(subtile);
                }
            }
        }
        this.arrangeTiles(zoomType, this.animateToZoomX, this.animateToZoomY);
    }

    public arrangeTiles(type: string, x: number, y: number): void {
        let element: HTMLElement = document.getElementById(this.mapObject.element.id + '_tile_parent');
        let element1: HTMLElement = document.getElementById(this.mapObject.element.id + '_tiles');
        let timeOut: number;
        if (!isNullOrUndefined(type) && type !== 'Pan' && type !== 'Reset' && type.indexOf('ZoomOut') === -1) {
            this.tileAnimation(type, x, y);
            timeOut = 250;
        } else {
            timeOut = 0;
        }
        if (this.mapObject.layers[this.mapObject.baseLayerIndex].layerType === 'GoogleStaticMap') {
            this.renderGoogleMap(this.mapObject.layers[0].key, this.mapObject.staticMapZoom);
        } else {
            setTimeout(() => {
                if (element) {
                    element.style.zIndex = '1';
                }
                if (element1) {
                    element1.style.zIndex = '0';
                }
                let animateElement: HTMLElement;
                if (!document.getElementById('animated_tiles') && element) {
                    animateElement = createElement('div', { id: 'animated_tiles' });
                    element.appendChild(animateElement);
                } else {
                    if (type !== 'Pan' && element1 && element) {
                        element1.appendChild(element.children[0]);
                        animateElement = createElement('div', { id: 'animated_tiles' });
                        element.appendChild(animateElement);
                    } else {
                        animateElement = element ? element.children[0] as HTMLElement : null;
                    }
                }
                let id: number = 0;
                for (let tile of this.tiles) {
                    let imgElement: HTMLElement = createElement('img');
                    imgElement.setAttribute('src', tile.src);
                    let child: HTMLElement;
                    if (document.getElementById('tile_' + id) && type === 'Pan') {
                        removeElement('tile_' + id);
                    }
                    child = createElement('div', { id: 'tile_' + id });
                    child.style.position = 'absolute';
                    child.style.left = tile.left + 'px';
                    child.style.top = tile.top + 'px';
                    child.style.height = tile.height + 'px';
                    child.style.width = tile.width + 'px';
                    child.appendChild(imgElement);
                    if (animateElement) {
                        animateElement.appendChild(child);
                    }
                    id++;
                }
            // tslint:disable-next-line:align
            }, timeOut);
        }
    }

    /**
     * Animation for tile layers and hide the group element until the tile layer rendering 
     */
    private tileAnimation(zoomType: string, translateX: number, translateY: number): void {
        let element: HTMLElement =  document.getElementById(this.mapObject.element.id + '_tile_parent');
        let element1: HTMLElement = document.getElementById('animated_tiles');
        let ele: HTMLElement = document.getElementById(this.mapObject.element.id + '_tiles');
        let scaleValue: string = '2';
        if (zoomType.indexOf('ZoomOut') === 0) {
            ele.style.zIndex = '1';
            element.style.zIndex = '0';
            // element1 = ele.children[ele.childElementCount - 1] as HTMLElement;
            while (ele.childElementCount >= 1) {
                ele.removeChild(ele.children[0]);
            }
            translateX = 0;
            translateY = 128 - 23;
            scaleValue = '0.5';
        } else if (zoomType === 'Reset') {
            ele.style.zIndex = '1';
            element.style.zIndex = '0';
            while (!(ele.childElementCount === 1) && !(ele.childElementCount === 0)) {
                ele.removeChild(ele.children[1]);
            }
            element1 = ele.children[0] as HTMLElement;
            translateX = 0;
            translateY = 0;
            scaleValue = '1';
        }
        if (!isNullOrUndefined(element1)) {
            element1.style.transition = '250ms';
            element1.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scaleValue + ')';
        }
    }

    /* tslint:disable:no-string-literal */
    /**
     * Static map rendering
     * @param apikey 
     * @private
     */
    public renderGoogleMap(apikey: string, zoom: number): void {
        let staticMapString: string;
        let map: Maps = this.mapObject;
        // zoom = this.mapObject.zoomSettings.shouldZoomInitially ? this.mapObject.markerZoomFactor : zoom;
        zoom = this.mapObject.tileZoomLevel;
        let x: number; let y: number;
        let totalSize: number = Math.pow(2, zoom) * 256;
        x = (map.mapAreaRect.width / 2) - (totalSize / 2);
        y = (map.mapAreaRect.height / 2) - (totalSize / 2);
        let centerPoint: Point = new Point(null, null);
        let diffX: number = 0; let diffY: number = 0;
        let position: MapLocation = convertTileLatLongToPoint(
            centerPoint, zoom, { x: x, y: y }, this.isMapCoordinates);
        if (map.zoomModule && map.zoomSettings.enable) {
            diffX = map.zoomModule.mouseDownLatLong['x'] - map.zoomModule.mouseMoveLatLong['x'];
            diffY = map.zoomModule.mouseDownLatLong['y'] - map.zoomModule.mouseMoveLatLong['y'];
        }
        let panLatLng: Object = map.pointToLatLong(position.x - diffX, position.y - diffY);
        map.centerPosition.latitude = panLatLng['latitude'];
        map.centerPosition.longitude = panLatLng['longitude'];
        let mapWidth: number;
        let mapHeight: number;
        if (isNullOrUndefined(parseInt(map.width, 10))) {
            mapWidth = parseInt(map.width, 10) - 22;
        } else {
            mapWidth = Math.round(map.mapAreaRect.width);
        }
        if (isNullOrUndefined(parseInt(map.height, 10))) {
            mapHeight = parseInt(map.height, 10) - 22;
        } else {
            mapHeight = Math.round(map.mapAreaRect.height);
        }
        let eleWidth: number = mapWidth > 640 ? (mapWidth - 640) / 2 : 0;
        let eleHeight: number = mapHeight > 640 ? (mapHeight - 640) / 2 : 0;
        let center: string;
        let mapType: string = (map.layers[map.layers.length - 1].staticMapType).toString().toLowerCase();
        if (map.centerPosition.latitude && map.centerPosition.longitude) {
            center =  map.centerPosition.latitude.toString() + ',' + map.centerPosition.longitude.toString();
            } else {
            center = '0,0';
        }
        staticMapString = 'https://maps.googleapis.com/maps/api/staticmap?size=' + mapWidth + 'x' + mapHeight +
            '&zoom=' + zoom + '&center=' + center + '&maptype=' + mapType + '&key=' + apikey;
        document.getElementById(this.mapObject.element.id + '_tile_parent').innerHTML
            = '<div id="' + this.mapObject.element.id + '_StaticGoogleMap"' + 'style="position:absolute; left:' + eleWidth + 'px; top:'
            + eleHeight + 'px"><img src="' + staticMapString + '"></div>';
    }

    /**
     * To find the tile translate point
     * @param factorX 
     * @param factorY 
     * @param centerPosition 
     */
    private panTileMap(factorX: number, factorY: number, centerPosition: MapLocation): Point {
        if (this.mapObject.tileZoomLevel <= this.mapObject.tileZoomScale && this.mapObject.initialCheck) {
            this.mapObject.tileZoomLevel = this.mapObject.tileZoomScale;
        }
        let level: number = this.mapObject.tileZoomLevel;
        let padding: number = this.mapObject.layers[this.mapObject.layers.length - 1].layerType !== 'GoogleStaticMap' ?
            20 : 0;
        let x: number; let y: number;
        let totalSize: number = Math.pow(2, level) * 256;
        x = (factorX / 2) - (totalSize / 2);
        y = (factorY / 2) - (totalSize / 2);
        let position: MapLocation = convertTileLatLongToPoint(
            centerPosition, level, { x: x, y: y }, this.isMapCoordinates);
        padding = this.mapObject.zoomNotApplied ? 0 : padding;
        x -= position.x - (factorX / 2);
        y = (y - (position.y - (factorY / 2))) + padding;
        this.mapObject.scale = Math.pow(2, level - 1);
        if ((isNullOrUndefined(this.mapObject.tileTranslatePoint) || (this.mapObject.tileTranslatePoint.y === 0 &&
            this.mapObject.tileTranslatePoint.x === 0)) || (isNullOrUndefined(this.mapObject.previousTileWidth) ||
            isNullOrUndefined(this.mapObject.previousTileHeight))) {
            this.mapObject.previousTileWidth = factorX;
            this.mapObject.previousTileHeight = factorY;
        }
        if (!isNullOrUndefined(this.mapObject.tileTranslatePoint)  && (isNullOrUndefined(centerPosition.x)) &&
            (this.mapObject.zoomSettings.zoomFactor === 1 ||
                this.mapObject.zoomSettings.zoomFactor !== level || !this.mapObject.defaultState)) {
            if ((factorX !== this.mapObject.previousTileWidth || factorY !== this.mapObject.previousTileHeight) ) {
                let xdiff: number = x - ((this.mapObject.previousTileWidth / 2) - (totalSize / 2));
                let ydiff: number = y - ((this.mapObject.previousTileHeight / 2) - (totalSize / 2) + padding);
                this.mapObject.tileTranslatePoint.x = this.mapObject.tileTranslatePoint.x + xdiff;
                this.mapObject.tileTranslatePoint.y = this.mapObject.tileTranslatePoint.y + ydiff;
            }
        }
        if (!isNullOrUndefined(this.mapObject.tileTranslatePoint) && !this.mapObject.zoomNotApplied) {
            if (this.mapObject.tileTranslatePoint.x !== 0 && this.mapObject.tileTranslatePoint.x !== x
                && !this.mapObject.centerPositionChanged) {
                x = this.mapObject.tileTranslatePoint.x;
            }
            if (this.mapObject.tileTranslatePoint.y !== 0 && this.mapObject.tileTranslatePoint.y !== y
                && !this.mapObject.centerPositionChanged) {
                y = this.mapObject.tileTranslatePoint.y;
            }
        }
        this.mapObject.translatePoint = new Point(
            (x - (0.01 * this.mapObject.scale)) / this.mapObject.scale,
            (y - (0.01 * this.mapObject.scale)) / this.mapObject.scale
        );
        this.mapObject.previousTileWidth = factorX;
        this.mapObject.previousTileHeight = factorY;
        return new Point(x, y);
    }
}
