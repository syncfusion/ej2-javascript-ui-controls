/* eslint-disable no-case-declarations */
import { isNullOrUndefined, extend, createElement, Fetch, animationMode } from '@syncfusion/ej2-base';
import { Maps } from '../../maps/maps';
import { getShapeColor } from '../model/theme';
import { GeoLocation, isCustomPath, convertGeoToPoint, Point, PathOption, Size, removeElement, maintainToggleSelection } from '../utils/helper';
import { getElementByID, maintainSelection, getValueFromObject } from '../utils/helper';
import { MapLocation, RectOption, getTranslate, convertTileLatLongToPoint, checkShapeDataFields, CircleOption } from '../utils/helper';
import { getZoomTranslate, fixInitialScaleForTile } from '../utils/helper';
import { LayerSettings, ShapeSettings, Tile} from '../model/base';
import { BorderModel, LayerSettingsModel } from '../model/base-model';
import { BingMap } from './bing-map';
import { ColorMapping } from './color-mapping';
import { layerRendering, ILayerRenderingEventArgs, shapeRendering, IShapeRenderingEventArgs, BubbleSettingsModel, Rect } from '../index';
/**
 * To calculate and render the shape layer
 */

export class LayerPanel {
    private mapObject: Maps;
    public currentFactor: number;
    private groupElements: Element[];
    private layerObject: Element;
    private currentLayer: LayerSettings;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private rectBounds: any;
    public tiles: Tile[];
    private clipRectElement: Element;
    private urlTemplate: string;
    private isMapCoordinates: boolean = true;
    private tileSvgObject: Element;
    private ajaxModule: Fetch;
    private ajaxResponse: LayerSettings[];
    private bing: BingMap;
    private animateToZoomX : number;
    private animateToZoomY : number;
    public horizontalPan: boolean = false;
    public horizontalPanXCount: number = 0;
    public layerGroup: Element;
    constructor(map: Maps) {
        this.mapObject = map;
        this.ajaxModule = new Fetch();
        this.ajaxResponse = [];
    }

    public measureLayerPanel(): void {
        const layerCollection: LayerSettings[] = <LayerSettings[]>this.mapObject.layersCollection;
        const areaRect: Rect = this.mapObject.mapAreaRect;
        const secondaryEle: HTMLElement = <HTMLElement>getElementByID(this.mapObject.element.id + '_Secondary_Element');
        if (this.mapObject.isTileMap && secondaryEle) {
            this.tileSvgObject = this.mapObject.renderer.createSvg({
                id: this.mapObject.element.id + '_Tile_SVG', width: areaRect.width,
                height: areaRect.height
            });
            const parentElement: Element = createElement('div', {
                id: this.mapObject.element.id + '_Tile_SVG_Parent'
            });
            (parentElement as HTMLElement).style.cssText = 'position: absolute; height: ' + (areaRect.height) + 'px; width: ' +
            (areaRect.width) + 'px;';
            parentElement.appendChild(this.tileSvgObject);
            secondaryEle.appendChild(parentElement);
        }
        this.layerGroup = (this.mapObject.renderer.createGroup({
            id: this.mapObject.element.id + '_Layer_Collections',
            'clip-path': 'url(#' + this.mapObject.element.id + '_MapArea_ClipRect)'
        }));
        this.clipRectElement = this.mapObject.renderer.drawClipPath(new RectOption(
            this.mapObject.element.id + '_MapArea_ClipRect',
            'transparent', { width: 1, color: 'Gray' }, 1,
            {
                x: this.mapObject.isTileMap ? 0 : areaRect.x, y: this.mapObject.isTileMap ? 0 : areaRect.y,
                width: areaRect.width, height: areaRect.height
            }));

        this.layerGroup.appendChild(this.clipRectElement);
        this.mapObject.baseMapBounds = null;
        this.mapObject.baseMapRectBounds = null;
        this.mapObject.baseSize = null;
        Array.prototype.forEach.call(layerCollection, (layer: LayerSettings, index: number) => {
            this.currentLayer = <LayerSettings>layer;
            this.processLayers(layer, index);
        });
        if (!isNullOrUndefined(this.mapObject.legendModule) && this.mapObject.legendSettings.position === 'Float') {
            if (this.mapObject.isTileMap) {
                this.layerGroup.appendChild(this.mapObject.legendModule.legendGroup);
            } else {
                this.mapObject.svgObject.appendChild(this.mapObject.legendModule.legendGroup);
            }
        }
    }
    /**
     * Tile rendering
     *
     * @param {LayerPanel} panel - Specifies the layer panel.
     * @param {LayerSettings} layer - Specifies the layer settings.
     * @param {number} layerIndex - Specifies the layer index.
     * @param {BingMap} bing - Specifies the bing map.
     * @returns {void}
     * @private
     */
    public renderTileLayer(panel: LayerPanel, layer: LayerSettings, layerIndex: number, bing?: BingMap): void {
        panel.currentFactor = panel.calculateFactor(layer);
        panel.mapObject.defaultState = ((panel.mapObject.zoomSettings.zoomFactor !== 1) &&
        (!isNullOrUndefined(panel.mapObject.tileZoomLevel) && panel.mapObject.tileZoomLevel !== 1 )) ?
            false : true;
        if (isNullOrUndefined(panel.mapObject.previousCenterLatitude) &&
            isNullOrUndefined(panel.mapObject.previousCenterLongitude) && !panel.mapObject.isZoomByPosition) {
            panel.mapObject.previousCenterLatitude = panel.mapObject.centerPosition.latitude;
            panel.mapObject.previousCenterLongitude = panel.mapObject.centerPosition.longitude;
        } else if ((panel.mapObject.previousCenterLatitude !==
            panel.mapObject.centerPosition.latitude && panel.mapObject.previousCenterLongitude !==
            panel.mapObject.centerPosition.longitude) || panel.mapObject.isZoomByPosition) {
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
            if (!isNullOrUndefined(this.mapObject.markerCenterLatitude) && !isNullOrUndefined(this.mapObject.markerCenterLongitude)
                && !panel.mapObject.isZoomByPosition) {
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
        let zoomFactorValue: number = (panel.mapObject.zoomSettings.shouldZoomInitially && !panel.mapObject.isZoomByPosition) ?
            isNullOrUndefined(panel.mapObject.markerZoomFactor) ? 1 :
                panel.mapObject.markerZoomFactor : panel.mapObject.zoomSettings.zoomFactor;
        zoomFactorValue = (panel.mapObject.enablePersistence) ? ((isNullOrUndefined(panel.mapObject.mapScaleValue))
            ? (isNullOrUndefined(panel.mapObject.markerZoomFactor) ? panel.mapObject.zoomSettings.zoomFactor :
                panel.mapObject.markerZoomFactor) : panel.mapObject.mapScaleValue) : zoomFactorValue;
        zoomFactorValue = panel.mapObject.zoomSettings.enable ? zoomFactorValue : panel.mapObject.zoomSettings.zoomFactor;
        zoomFactorValue = zoomFactorValue > 0 ? zoomFactorValue : 1;
        panel.mapObject.defaultState = zoomFactorValue !== 1 ? false : true;
        if (!panel.mapObject.markerZoomedState && panel.mapObject.zoomSettings.shouldZoomInitially &&
            panel.mapObject.zoomSettings.zoomFactor === 1) {
            panel.mapObject.defaultState = true;
        }
        if (isNullOrUndefined(panel.mapObject.tileZoomLevel)) {
            panel.mapObject.tileZoomLevel = zoomFactorValue;
            panel.mapObject.previousZoomFactor = zoomFactorValue;
        }  else if (this.mapObject.isReset && panel.mapObject.tileZoomLevel === 1 && !panel.mapObject.zoomSettings.shouldZoomInitially) {
            const zoomLevel: number = panel.mapObject.tileZoomLevel;
            panel.mapObject.tileZoomLevel = zoomLevel;
        } else if (panel.mapObject.zoomSettings.zoomFactor !== 1 || panel.mapObject.zoomSettings.shouldZoomInitially) {
            panel.mapObject.previousZoomFactor = panel.mapObject.tileZoomLevel;
            panel.mapObject.tileZoomLevel = panel.mapObject.defaultState && panel.mapObject.zoomSettings.enable ?
                panel.mapObject.tileZoomLevel : !panel.mapObject.zoomSettings.shouldZoomInitially
                && !panel.mapObject.centerPositionChanged ?
                    panel.mapObject.previousZoomFactor !== panel.mapObject.zoomSettings.zoomFactor ?
                        panel.mapObject.zoomSettings.zoomFactor : panel.mapObject.tileZoomLevel : zoomFactorValue;
            panel.mapObject.tileZoomLevel = zoomFactorValue === 1 && panel.mapObject.zoomSettings.zoomFactor === 0 ?
                zoomFactorValue : panel.mapObject.tileZoomLevel;
            if (!isNullOrUndefined(panel.mapObject.tileTranslatePoint) &&
                    (panel.mapObject.markerZoomFactor !== panel.mapObject.mapScaleValue
                        || (isNullOrUndefined(panel.mapObject.markerZoomFactor)
                        && isNullOrUndefined(panel.mapObject.mapScaleValue)))
                    && (panel.mapObject.zoomSettings.zoomFactor <= 1 || panel.mapObject.previousZoomFactor !==
                        panel.mapObject.zoomSettings.zoomFactor)) {
                panel.mapObject.tileTranslatePoint.x = 0;
                panel.mapObject.tileTranslatePoint.y = 0;
            }
        } else if (panel.mapObject.defaultState) {
            panel.mapObject.previousZoomFactor = panel.mapObject.tileZoomLevel;
            panel.mapObject.tileZoomLevel = zoomFactorValue;
            if (!isNullOrUndefined(panel.mapObject.tileTranslatePoint)) {
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
            if (!isNullOrUndefined(centerTileMap)) {
                centerTileMap.y = panel.mapObject.centerLatOfGivenLocation;
                centerTileMap.x = panel.mapObject.centerLongOfGivenLocation;
            }
            panel.mapObject.tileZoomLevel = panel.mapObject.mapScaleValue = panel.mapObject.scaleOfGivenLocation;
        }
        panel.mapObject.tileTranslatePoint = panel.panTileMap(
            panel.mapObject.availableSize.width, panel.mapObject.availableSize.height, centerTileMap
        );
        if (this.mapObject.zoomSettings.resetToInitial && this.mapObject.initialCheck && !isNullOrUndefined(panel.mapObject.height)
        && this.mapObject.availableSize.height > 512) {
            this.mapObject.applyZoomReset = true;
            this.mapObject.initialZoomLevel = Math.floor(this.mapObject.availableSize.height / 512);
            const padding : number = 20;
            const totalSize : number = Math.pow(2, this.mapObject.initialZoomLevel) * 256;
            if (!isNullOrUndefined(this.mapObject.initialTileTranslate)) {
                this.mapObject.initialTileTranslate.x = (this.mapObject.availableSize.width / 2) - (totalSize / 2);
                this.mapObject.initialTileTranslate.y = (this.mapObject.availableSize.height / 2) - (totalSize / 2) + padding;
            }
        }
        panel.generateTiles(panel.mapObject.tileZoomLevel, panel.mapObject.tileTranslatePoint, null, bing);
        if (!isNullOrUndefined(panel.mapObject.previousZoomFactor)
            && panel.mapObject.previousZoomFactor !== panel.mapObject.zoomSettings.zoomFactor) {
            panel.mapObject.previousZoomFactor = panel.mapObject.zoomSettings.zoomFactor;
        }
        if (panel.mapObject.polygonModule) {
            const polygonElement: Element =
            panel.mapObject.polygonModule.polygonRender(this.mapObject, layerIndex, panel.mapObject.tileZoomLevel);
            if (!isNullOrUndefined(polygonElement)) {
                panel.layerObject.appendChild(polygonElement);
            }
        }
        if (panel.mapObject.navigationLineModule) {
            const navigationLineElement: Element =
                panel.mapObject.navigationLineModule.renderNavigation(panel.currentLayer, panel.mapObject.tileZoomLevel, layerIndex);
            if (!isNullOrUndefined(navigationLineElement)) {
                panel.layerObject.appendChild(navigationLineElement);
            }
        }
        if (panel.mapObject.markerModule) {
            panel.mapObject.markerModule.markerRender(this.mapObject, panel.layerObject, layerIndex, panel.mapObject.tileZoomLevel, null);
        }
        panel.translateLayerElements(panel.layerObject);
        panel.layerGroup.appendChild(panel.layerObject);
    }


    protected processLayers(layer: LayerSettings, layerIndex: number): void {
        this.layerObject = (this.mapObject.renderer.createGroup({
            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex
        }));
        if (!this.mapObject.enablePersistence) {
            const itemName: string = this.mapObject.getModuleName() + this.mapObject.element.id;
            if (navigator.userAgent.indexOf('Edge') === -1) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let data: any;
                try {
                    data = window.localStorage;
                } catch (e) {
                    data = null;
                }
                if (!isNullOrUndefined(data) && window.localStorage.getItem(itemName)) {
                    window.localStorage.removeItem(itemName);
                }
            }
        }
        const eventArgs: ILayerRenderingEventArgs = {
            cancel: false, name: layerRendering, index: layerIndex,
            layer: layer, maps: this.mapObject, visible: layer.visible
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.mapObject.trigger('layerRendering', eventArgs, (observedArgs: ILayerRenderingEventArgs) => {
            if (!eventArgs.cancel && eventArgs.visible) {
                if ((isNullOrUndefined(layer.shapeData) && !isNullOrUndefined(layer.urlTemplate) && layer.urlTemplate !== '')) {
                    if (!isNullOrUndefined(layer.urlTemplate) && layer.urlTemplate.indexOf('quadkey') > -1) {
                        const bing: BingMap = new BingMap(this.mapObject);
                        this.bingMapCalculation(layer, layerIndex, this, bing);
                    } else {
                        this.renderTileLayer(this, layer, layerIndex);
                    }
                } else {
                    if (!isNullOrUndefined(layer.shapeData) && (!isNullOrUndefined(layer.shapeData['geometries']) ||
                        !isNullOrUndefined(layer.shapeData['features']))) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const featureData: any[] = (!isNullOrUndefined(layer.shapeData['geometries']) &&
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (<any[]>layer.shapeData['geometries']).length > 0 ? layer.shapeData['geometries'] :
                            layer.shapeData['features']);
                        layer.layerData = [];
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const bbox: any = layer.shapeData['bbox'];
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

    private bingMapCalculation(layer: LayerSettings, layerIndex: number, proxy: LayerPanel, bing: BingMap): void {
        bing.imageUrl = layer.urlTemplate;
        bing.subDomains = ['t0', 't1', 't2', 't3'];
        bing.maxZoom = '21';
        proxy.mapObject.bingMap = bing;
        proxy.renderTileLayer(proxy, layer, layerIndex, bing);
        this.mapObject.arrangeTemplate();
        if (this.mapObject.zoomModule && (this.mapObject.previousScale !== this.mapObject.scale)) {
            this.mapObject.zoomModule.applyTransform(this.mapObject, true);
        }
    }

    private bubbleCalculation(bubbleSettings: BubbleSettingsModel, range: { min: number, max: number }): void {
        if (bubbleSettings.dataSource != null && bubbleSettings != null) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const bubbleDataSource: any[] = bubbleSettings.dataSource as any[];
            for (let i: number = 0; i < bubbleDataSource.length; i++) {
                const bubbledata: number = (!isNullOrUndefined(bubbleSettings.valuePath)) ? ((bubbleSettings.valuePath.indexOf('.') > -1) ?
                    Number(getValueFromObject(bubbleSettings.dataSource[i as number], bubbleSettings.valuePath)) :
                    parseFloat(bubbleSettings.dataSource[i as number][bubbleSettings.valuePath])) :
                    parseFloat(bubbleSettings.dataSource[i as number][bubbleSettings.valuePath]);
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public calculatePathCollection(layerIndex: number, renderData: any[]): void {
        this.groupElements = [];
        if ((!isCustomPath(renderData))) {
            this.currentFactor = this.calculateFactor(this.currentLayer);
        }
        this.rectBounds = null;
        const shapeSettings: ShapeSettings = <ShapeSettings>this.currentLayer.shapeSettings;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Array.prototype.forEach.call(renderData, (geometryData: any) => {
            if (!isNullOrUndefined(geometryData['geometry']) || !isNullOrUndefined(geometryData['coordinates'])) {
                const type: string = !isNullOrUndefined(geometryData['geometry']) ? geometryData['geometry']['type'] : geometryData['type'];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const coords: any[] = !isNullOrUndefined(geometryData['geometry']) ? geometryData['geometry']['coordinates'] :
                    geometryData['coordinates'];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data: any = geometryData['geometry'];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const properties: any = geometryData['properties'];
                this.generatePoints(type, coords, data, properties);
            }
        });
        this.currentLayer.rectBounds = this.rectBounds;
        if (isNullOrUndefined(this.mapObject.baseMapRectBounds) && this.currentLayer.isBaseLayer) {
            this.mapObject.baseMapRectBounds = this.rectBounds;
        }
        const colors: string[] = shapeSettings.palette.length > 1 ? shapeSettings.palette : getShapeColor(this.mapObject.theme);
        const labelTemplateEle: HTMLElement = createElement('div', {
            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_Label_Template_Group',
            className: this.mapObject.element.id + '_template'
        });
        labelTemplateEle.style.cssText = 'pointer-events: none; overflow: hidden; position: absolute;' +
                                        'top:' + this.mapObject.mapAreaRect.y + 'px;' +
                                        'left:' + this.mapObject.mapAreaRect.x + 'px;' +
                                        'height:' + this.mapObject.mapAreaRect.height + 'px;' +
                                        'width:' + this.mapObject.mapAreaRect.width + 'px;';
        if (this.currentLayer.layerData.length !== 0) {
            for (let i: number = 0; i < this.currentLayer.layerData.length; i++) {
                let k: number;
                const borderValue: BorderModel = {
                    color: shapeSettings.border.color || this.mapObject.themeStyle.shapeBorderColor,
                    width: shapeSettings.border.width,
                    opacity: shapeSettings.border.opacity
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const currentShapeData: any[] = <any[]>this.currentLayer.layerData[i as number];
                let pathOptions: PathOption;
                let circleOptions: CircleOption; let groupElement: Element;
                let path: string = '';
                let fill: string = (shapeSettings.autofill) ? colors[i % colors.length] :
                    (shapeSettings.fill || this.mapObject.themeStyle.shapeFill);
                if (shapeSettings.colorValuePath !== null && !isNullOrUndefined(currentShapeData['property'])) {
                    k = checkShapeDataFields(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        <any[]>this.currentLayer.dataSource, currentShapeData['property'],
                        this.currentLayer.shapeDataPath, this.currentLayer.shapePropertyPath, this.currentLayer
                    );
                    if (k !== null && shapeSettings.colorMapping.length === 0) {
                        fill = ((this.currentLayer.shapeSettings.colorValuePath.indexOf('.') > -1) ?
                            (getValueFromObject(this.currentLayer.dataSource[k as number], shapeSettings.colorValuePath)) :
                            this.currentLayer.dataSource[k as number][shapeSettings.colorValuePath]);
                    } else if (currentShapeData['property'][shapeSettings.colorValuePath] &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (<any[]>this.currentLayer.dataSource).length === 0 && shapeSettings.colorMapping.length === 0) {
                        fill = ((this.currentLayer.shapeSettings.colorValuePath.indexOf('.') > -1) ?
                            (getValueFromObject(currentShapeData['property'], shapeSettings.colorValuePath)) :
                            currentShapeData['property'][shapeSettings.colorValuePath]);
                    }
                    fill = !isNullOrUndefined(fill) ? fill : (shapeSettings.fill || this.mapObject.themeStyle.shapeFill);
                }
                const shapeID: string = this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + i + '_dataIndex_' + k;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const getShapeColor: any = this.getShapeColorMapping(this.currentLayer, currentShapeData['property'], fill);
                fill = Object.prototype.toString.call(getShapeColor) === '[object Object]' && !isNullOrUndefined(getShapeColor['fill'])
                    ? getShapeColor['fill'] : fill;
                if (this.currentLayer.shapeSettings.borderColorValuePath || this.currentLayer.shapeSettings.borderWidthValuePath) {
                    k = checkShapeDataFields(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        <any[]>this.currentLayer.dataSource, currentShapeData['property'],
                        this.currentLayer.shapeDataPath, this.currentLayer.shapePropertyPath, this.currentLayer
                    );
                    if (k !== null) {
                        if (this.currentLayer.dataSource[k as number][shapeSettings.borderColorValuePath]) {
                            borderValue.color = this.currentLayer.dataSource[k as number][shapeSettings.borderColorValuePath];
                        }
                        if (this.currentLayer.dataSource[k as number][shapeSettings.borderWidthValuePath]) {
                            borderValue.width = this.currentLayer.dataSource[k as number][shapeSettings.borderWidthValuePath];
                        }
                    }
                }
                const opacity: number = (Object.prototype.toString.call(getShapeColor) === '[object Object]'
                    && !isNullOrUndefined(getShapeColor['opacity'])) ? getShapeColor['opacity'] : shapeSettings.opacity;
                const eventArgs: IShapeRenderingEventArgs = {
                    cancel: false, name: shapeRendering, index: i,
                    data: this.currentLayer.dataSource ? this.currentLayer.dataSource[k as number] : null,
                    maps: this.mapObject,
                    shape: shapeSettings, fill: fill,
                    border: { width: borderValue.width, color: borderValue.color, opacity: borderValue.opacity}
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const shapeRenderingSuccess: any = (eventArgs: IShapeRenderingEventArgs) => {
                    let drawingType: string = !isNullOrUndefined(currentShapeData['_isMultiPolygon'])
                        ? 'MultiPolygon' : isNullOrUndefined(currentShapeData['type']) ? currentShapeData[0]['type'] : currentShapeData['type'];
                    drawingType = (drawingType === 'Polygon' || drawingType === 'MultiPolygon') ? 'Polygon' : drawingType;
                    if (!eventArgs.cancel) {
                        eventArgs.fill = eventArgs.fill === '#A6A6A6' ? eventArgs.shape.fill ||
                            this.mapObject.themeStyle.shapeFill : eventArgs.fill;
                        eventArgs.border.color = eventArgs.border.color === 'transparent' ?
                            eventArgs.shape.border.color : eventArgs.border.color;
                        eventArgs.border.width = eventArgs.border.width === 0 ? eventArgs.shape.border.width : eventArgs.border.width;
                        if (isNullOrUndefined(shapeSettings.borderColorValuePath)) {
                            borderValue.color = eventArgs.border.color;
                        }
                        if (isNullOrUndefined(shapeSettings.borderWidthValuePath)) {
                            borderValue.width = eventArgs.border.width;
                        }
                    } else {
                        eventArgs.fill = fill;
                        eventArgs.border.color = shapeSettings.border.color || this.mapObject.themeStyle.shapeBorderColor;
                        eventArgs.border.width = shapeSettings.border.width;
                    }
                    eventArgs.border.opacity = isNullOrUndefined(eventArgs.border.opacity) ? opacity : eventArgs.border.opacity;
                    if (this.groupElements.length < 1) {
                        groupElement = this.mapObject.renderer.createGroup({
                            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_' + drawingType + '_Group', transform: ''
                        });
                        this.groupElements.push(groupElement);
                    } else {
                        for (let i: number = 0; i < this.groupElements.length; i++) {
                            const ele: Element = this.groupElements[i as number];
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
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            currentShapeData.map((shapeData: any) => {
                                path += ' L ' + (shapeData['point']['x']) + ' ' + (shapeData['point']['y']);
                            });
                        } else {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            path = this.generateMultiPolygonPath(<any[]>currentShapeData);
                        }
                        path += ' z ';
                        if (path.length > 3) {
                            pathOptions = new PathOption(
                                shapeID, eventArgs.fill, eventArgs.border.width, eventArgs.border.color,
                                opacity, eventArgs.border.opacity, shapeSettings.dashArray, path);
                            pathEle = this.mapObject.renderer.drawPath(pathOptions) as SVGPathElement;
                        }
                        break;
                    case 'LineString':
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        currentShapeData.map((lineData: any, index: number) => {
                            if (index === 0) {
                                path += 'M ' + (lineData['point']['x']) + ' ' + (lineData['point']['y']);
                            } else {
                                path += 'L' + (lineData['point']['x']) + ' , ' + (lineData['point']['y']) + ' ';
                            }
                        });
                        if (path.length > 3) {
                            pathOptions = new PathOption(
                                shapeID, 'transparent', !isNullOrUndefined(eventArgs.border.width) ? eventArgs.border.width : 1, !isNullOrUndefined(eventArgs.fill) ? eventArgs.fill :
                                    eventArgs.border.color,
                                opacity, eventArgs.border.opacity, shapeSettings.dashArray, path);
                            pathEle = this.mapObject.renderer.drawPath(pathOptions) as SVGPathElement;
                        }
                        break;
                    case 'MultiLineString':
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        currentShapeData.map((multilineData: any) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            multilineData.map((lineData: any, index: number) => {
                                if (index === 0) {
                                    path += 'M ' + (lineData['point']['x']) + ' ' + (lineData['point']['y']);
                                } else {
                                    path += 'L' + (lineData['point']['x']) + ' , ' + (lineData['point']['y']) + ' ';
                                }
                            });
                        });
                        if (path.length > 3) {
                            pathOptions = new PathOption(
                                shapeID, 'transparent', !isNullOrUndefined(eventArgs.border.width) ? eventArgs.border.width : 1, !isNullOrUndefined(eventArgs.fill) ? eventArgs.fill :
                                    eventArgs.border.color,
                                opacity, eventArgs.border.opacity, shapeSettings.dashArray, path);
                            pathEle = this.mapObject.renderer.drawPath(pathOptions) as SVGPathElement;
                        }
                        break;
                    case 'Point':
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const pointData: any = <any>currentShapeData['point'];
                        const circleRadius: number = (this.mapObject.layers[layerIndex as number].type !== 'SubLayer') ?
                            shapeSettings.circleRadius : shapeSettings.circleRadius / (this.mapObject.isTileMap ?
                                this.mapObject.scale : this.currentFactor);
                        circleOptions = new CircleOption(
                            shapeID, eventArgs.fill, eventArgs.border, opacity,
                            pointData['x'], pointData['y'], circleRadius, shapeSettings.dashArray);
                        pathEle = this.mapObject.renderer.drawCircle(circleOptions) as SVGCircleElement;
                        break;
                    case 'MultiPoint':
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        currentShapeData.map((multiPointData: any, index: number) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const pointData: any = multiPointData['point'];
                            const circleRadius: number = (this.mapObject.layers[layerIndex as number].type !== 'SubLayer') ? shapeSettings.circleRadius : shapeSettings.circleRadius / (this.mapObject.isTileMap ? this.mapObject.scale : this.currentFactor);
                            circleOptions = new CircleOption(
                                (shapeID + '_multiLine_' + index), eventArgs.fill, eventArgs.border, opacity,
                                pointData['x'], pointData['y'], circleRadius, shapeSettings.dashArray);
                            pathEle = this.mapObject.renderer.drawCircle(circleOptions) as SVGCircleElement;
                            this.pathAttributeCalculate(groupElement, pathEle, drawingType, currentShapeData);
                        });
                        break;
                    case 'Path':
                        path = <string>currentShapeData['point'];
                        pathOptions = new PathOption(
                            shapeID, eventArgs.fill, eventArgs.border.width, eventArgs.border.color,
                            opacity, eventArgs.border.opacity, shapeSettings.dashArray, path);
                        pathEle = this.mapObject.renderer.drawPath(pathOptions) as SVGPathElement;
                        break;
                    }
                    if (!isNullOrUndefined(pathEle) && drawingType !== 'MultiPoint') {
                        this.pathAttributeCalculate(groupElement, pathEle, drawingType, currentShapeData);
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
     * layer features as bubble, marker, datalabel, navigation line.
     *
     * @param {Element} groupElement - Specifies the element to append the group.
     * @param {Element} pathEle - Specifies the svg element.
     * @param {string} drawingType - Specifies the data type.
     * @param {any} currentShapeData - Specifies the layer of shapedata.
     * @returns {void}
     */
    private pathAttributeCalculate(groupElement: Element, pathEle: Element, drawingType: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                   currentShapeData: any): void {
        const property: string[] = (Object.prototype.toString.call(this.currentLayer.shapePropertyPath) === '[object Array]' ?
            this.currentLayer.shapePropertyPath : [this.currentLayer.shapePropertyPath]) as string[];
        let properties: string;
        for (let j: number = 0; j < property.length; j++) {
            if (!isNullOrUndefined(currentShapeData['property'])) {
                properties = property[j as number];
                break;
            }
        }
        pathEle.setAttribute('aria-label', ((!isNullOrUndefined(currentShapeData['property'])) ?
            (currentShapeData['property'][properties as string]) : ''));
        if (this.currentLayer.selectionSettings.enable || this.currentLayer.highlightSettings.enable) {
            (pathEle as HTMLElement).tabIndex = this.mapObject.tabIndex;
            pathEle.setAttribute('role', 'button');
            (pathEle as HTMLElement).style.cursor = this.currentLayer.highlightSettings.enable && !this.currentLayer.selectionSettings.enable ? 'default' : 'pointer';
        }
        else {
            pathEle.setAttribute('role', 'region');
        }
        if (drawingType === 'LineString' || drawingType === 'MultiLineString') {
            (pathEle as HTMLElement).style.cssText = 'outline:none';
        }
        maintainSelection(this.mapObject.selectedElementId, this.mapObject.shapeSelectionClass, pathEle,
                          'ShapeselectionMapStyle');
        if (this.mapObject.legendSettings.toggleLegendSettings.enable && this.mapObject.legendSettings.type === 'Layers') {
            maintainToggleSelection(this.mapObject.toggledElementId, pathEle,
                                    this.mapObject.legendSettings.toggleLegendSettings.applyShapeSettings ? this.currentLayer.shapeSettings
                                        : this.mapObject.legendSettings.toggleLegendSettings);
        }
        groupElement.appendChild(pathEle);
    }
    /**
     * layer features as bubble, marker, datalabel, navigation line.
     *
     * @param {number} layerIndex - Specifies the layer index
     * @param {string[]} colors - Specifies the colors
     * @param {any[]} renderData - Specifies the render data
     * @param {HTMLElement} labelTemplateEle - Specifies the label template element
     * @returns {void}
     */
    private layerFeatures(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layerIndex: number, colors: string[], renderData: any[],
        labelTemplateEle: HTMLElement
    ): void {
        let bubbleG: Element;
        if (this.mapObject.polygonModule) {
            this.groupElements.push(
                this.mapObject.polygonModule.polygonRender(this.mapObject, layerIndex,
                                                           (this.mapObject.isTileMap ? Math.floor(this.currentFactor)
                                                               : this.currentFactor)));
        }
        if (this.currentLayer.bubbleSettings.length && this.mapObject.bubbleModule) {
            const length: number = this.currentLayer.bubbleSettings.length;
            let bubble: BubbleSettingsModel;
            for (let j: number = 0; j < length; j++) {
                bubble = this.currentLayer.bubbleSettings[j as number];
                bubbleG = this.mapObject.renderer.createGroup({
                    id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_bubble_Group_' + j
                });
                const range: {
                    min: number;
                    max: number;
                } = { min: 0, max: 0 };
                this.bubbleCalculation(bubble, range);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const bubbleDataSource: any[] = bubble.dataSource as any[];
                this.mapObject.bubbleModule.bubbleCollection = [];
                if (!isNullOrUndefined(bubbleDataSource) && bubbleDataSource.length > 0) {
                    bubbleDataSource.map((bubbleData: object, i: number) => {
                        this.renderBubble(
                            this.currentLayer, bubbleData, colors[i % colors.length], range, j, i, bubbleG, layerIndex, bubble);
                    });
                    this.groupElements.push(bubbleG);
                }
            }
        }
        if ((this.mapObject.markerModule && !this.mapObject.isTileMap) && this.mapObject.zoomSettings.enable) {
            this.mapObject.markerModule.calculateZoomCenterPositionAndFactor(this.mapObject.layersCollection);
        }
        const group: Element = (this.mapObject.renderer.createGroup({
            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_dataLableIndex_Group'
        }));
        (group as HTMLElement).style.pointerEvents = 'none';
        if (this.mapObject.dataLabelModule && this.currentLayer.dataLabelSettings.visible) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const intersect: any[] = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Array.prototype.forEach.call(renderData, (currentShapeData: any[], i: number) => {
                this.renderLabel(this.currentLayer, layerIndex, currentShapeData, group, i, labelTemplateEle, intersect);
            });
            this.groupElements.push(group);
        }
        if (this.mapObject.navigationLineModule) {
            this.groupElements.push(
                this.mapObject.navigationLineModule.renderNavigation(this.currentLayer, this.currentFactor, layerIndex)
            );
        }
        if (!isNullOrUndefined(this.groupElements) && !isNullOrUndefined(this.layerObject)) {
            this.groupElements.map((element: Element) => {
                if (!isNullOrUndefined(element)) {
                    this.layerObject.appendChild(element);
                }
            });
        }
        if (this.mapObject.markerModule) {
            this.mapObject.markerModule.markerRender(this.mapObject, this.layerObject, layerIndex,
                                                     (this.mapObject.isTileMap ? Math.floor(this.currentFactor) :
                                                         this.currentFactor), null);
        }
        this.translateLayerElements(this.layerObject);
        this.layerGroup.appendChild(this.layerObject);
    }

    /**
     * render datalabel.
     *
     * @param {LayerSettings} layer - Specifies the layer
     * @param {number} layerIndex - Specifies the layer index
     * @param {any[]} shape - Specifies the shape
     * @param {Element} group - Specifies the group
     * @param {number} shapeIndex - Specifies the shape index
     * @param {HTMLElement} labelTemplateEle - Specifies the label template element
     * @param {any[]} intersect - Specifies the intersect
     * @returns {void}
     */
    private renderLabel(
        layer: LayerSettings, layerIndex: number,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        shape: any[], group: Element, shapeIndex: number, labelTemplateEle: HTMLElement, intersect: any[]
    ): void {
        this.mapObject.dataLabelModule.renderLabel(
            layer, layerIndex, shape, layer.layerData, group, labelTemplateEle, shapeIndex, intersect
        );
    }
    /**
     * To render path for multipolygon.
     *
     * @param {any[]} currentShapeData Specifies the current shape data
     * @returns {string} Returns the path
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private generateMultiPolygonPath(currentShapeData: any[]): string {
        let path: string = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let shape: any[];
        for (let j: number = 0; j < currentShapeData.length; j++) {
            path += 'M' + (currentShapeData[j as number][0]['point']['x']) + ' ' + (currentShapeData[j as number][0]['point']['y']);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shape = <any[]>currentShapeData[j as number];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shape.map((shapeData: any) => {
                path += ' L ' + (shapeData['point']['x']) + ' ' + (shapeData['point']['y']);
            });
        }
        return path;
    }
    /**
     * To render bubble.
     *
     * @param {LayerSettings} layer - Specifies the layer
     * @param {object} bubbleData - Specifies the bubble data
     * @param {string} color - Specifies the color
     * @param {number} range - Specifies the range
     * @param {number} range.min - Specifies the minimum range
     * @param {number} range.max - Specifies the maximum range
     * @param {number} bubbleIndex - Specifies the bubble index
     * @param {number} dataIndex - Specifies the data index
     * @param {number} group - Specifies the group
     * @param {number} layerIndex - Specifies the layer index
     * @param {BubbleSettingsModel} bubbleSettings - Specifies the bubble settings
     * @returns {void}
     */
    private renderBubble(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layer: LayerSettings, bubbleData: any, color: string, range: { min: number, max: number },
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
     * To get the shape color from color mapping module.
     *
     * @param {LayerSettingsModel} layer - Specifies the layer
     * @param {any} shape - Specifies the shape
     * @param {string} color - Specifies the color
     * @returns {any} - Returns the object
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getShapeColorMapping(layer: LayerSettingsModel, shape: any, color: string): any {
        color = color ? color : layer.shapeSettings.fill;
        if (layer.shapeSettings.colorMapping.length === 0 && isNullOrUndefined(layer.dataSource)) {
            return color;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const index: number = checkShapeDataFields(<any[]>layer.dataSource, shape, layer.shapeDataPath, layer.shapePropertyPath, layer);
        const colorMapping: ColorMapping = new ColorMapping(this.mapObject);
        if (isNullOrUndefined(layer.dataSource) || isNullOrUndefined(layer.dataSource[index as number])) {
            return color;
        }
        return colorMapping.getShapeColorMapping(layer.shapeSettings, layer.dataSource[index as number], color);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public generatePoints(type: string, coordinates: any[], data: object, properties: object): void {
        let latitude: number; let longitude: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let newData: any[] = [];
        switch (type.toLowerCase()) {
        case 'polygon':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newData = <any[]>this.calculatePolygonBox(<any[]>coordinates[0]);
            if (newData.length > 0) {
                newData['property'] = properties;
                newData['type'] = type;
                newData['_isMultiPolygon'] = false;
                this.currentLayer.layerData.push(newData);
            }
            break;
        case 'multipolygon':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const multiPolygonDatas: any[] = [];
            for (let i: number = 0; i < coordinates.length; i++) {
                for (let j: number = 0; j < coordinates[i as number].length; j++) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    newData = <any[]>this.calculatePolygonBox(<any[]>coordinates[i as number][j as number]);
                    if (newData.length > 0) {
                        multiPolygonDatas.push(newData);
                    }
                }
            }
            multiPolygonDatas['property'] = properties;
            multiPolygonDatas['type'] = type;
            multiPolygonDatas['_isMultiPolygon'] = true;
            this.currentLayer.layerData.push(multiPolygonDatas);
            break;
        case 'linestring':
            const lineExtraSpace: number = !isNullOrUndefined(this.currentLayer.shapeSettings.border.width) ?
                (typeof(this.currentLayer.shapeSettings.border.width) === 'string' ?
                    parseInt(this.currentLayer.shapeSettings.border.width, 10) : this.currentLayer.shapeSettings.border.width) : 1;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            coordinates.map((points: any) => {
                latitude = <number>points[1];
                longitude = <number>points[0];
                const point: Point = convertGeoToPoint(
                    latitude, longitude, this.currentFactor, this.currentLayer, this.mapObject);
                this.calculateBox(point, lineExtraSpace);
                newData.push({
                    point: point, lat: latitude, lng: longitude
                });
            });
            newData['property'] = properties;
            newData['type'] = type;
            this.currentLayer.layerData.push(newData);
            break;
        case 'multilinestring':
            const extraSpaces: number = !isNullOrUndefined(this.currentLayer.shapeSettings.border.width) ?
                (typeof(this.currentLayer.shapeSettings.border.width) === 'string' ?
                    parseInt(this.currentLayer.shapeSettings.border.width, 10) : this.currentLayer.shapeSettings.border.width) : 1;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const multiLineData: any[] = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            coordinates.map((multiPoints: any) => {
                newData = [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                multiPoints.map((points: any) => {
                    latitude = <number>points[1];
                    longitude = <number>points[0];
                    const point: Point = convertGeoToPoint(
                        latitude, longitude, this.currentFactor, this.currentLayer, this.mapObject);
                    this.calculateBox(point, extraSpaces);
                    newData.push({
                        point: point, lat: latitude, lng: longitude
                    });
                });
                multiLineData.push(newData);
            });
            multiLineData['property'] = properties;
            multiLineData['type'] = type;
            this.currentLayer.layerData.push(multiLineData);
            break;
        case 'point':
            const pointExtraSpace: number = (!isNullOrUndefined(this.currentLayer.shapeSettings.border.width) ?
                (typeof(this.currentLayer.shapeSettings.border.width) === 'string' ?
                    parseInt(this.currentLayer.shapeSettings.border.width, 10) : this.currentLayer.shapeSettings.border.width) : 1) +
                (this.currentLayer.shapeSettings.circleRadius * 2);
            latitude = <number>coordinates[1];
            longitude = <number>coordinates[0];
            const point: Point = convertGeoToPoint(latitude, longitude, this.currentFactor, this.currentLayer, this.mapObject);
            this.calculateBox(point, pointExtraSpace);
            this.currentLayer.layerData.push({
                point: point, type: type, lat: latitude, lng: longitude, property: properties
            });
            break;
        case 'multipoint':
            const extraSpace: number = (!isNullOrUndefined(this.currentLayer.shapeSettings.border.width) ?
                (typeof(this.currentLayer.shapeSettings.border.width) === 'string' ?
                    parseInt(this.currentLayer.shapeSettings.border.width, 10) : this.currentLayer.shapeSettings.border.width) : 1) +
                (this.currentLayer.shapeSettings.circleRadius * 2);
            newData = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            coordinates.map((points: any) => {
                latitude = points[1];
                longitude = points[0];
                const point: Point = convertGeoToPoint(latitude, longitude, this.currentFactor, this.currentLayer, this.mapObject);
                this.calculateBox(point, extraSpace);
                newData.push({
                    point: point, lat: latitude, lng: longitude
                });
            });
            newData['property'] = properties;
            newData['type'] = type;
            this.currentLayer.layerData.push(newData);
            break;
        case 'path':
            this.currentLayer.layerData.push({
                point: data['d'], type: type, property: properties
            });
            break;
        }
    }

    public calculateBox(point: Point, extraSpace: number): void {
        if (isNullOrUndefined(this.rectBounds)) {
            this.rectBounds = { min: { x: point.x - extraSpace, y: point.y - extraSpace }, max: { x: point.x + extraSpace,
                y: point.y + extraSpace } };
        } else {
            this.rectBounds['min']['x'] = Math.min(this.rectBounds['min']['x'], point.x - extraSpace);
            this.rectBounds['min']['y'] = Math.min(this.rectBounds['min']['y'], point.y - extraSpace);
            this.rectBounds['max']['x'] = Math.max(this.rectBounds['max']['x'], point.x + extraSpace);
            this.rectBounds['max']['y'] = Math.max(this.rectBounds['max']['y'], point.y + extraSpace);
        }
    }

    public calculateFactor(layer: LayerSettings): number {
        let horFactor: number; let verFactor: number = 1;
        const divide: number = 10;
        const exp: string = 'e+1';
        const bounds: GeoLocation = this.mapObject.baseMapBounds;
        const mapSize: Size = new Size(this.mapObject.mapAreaRect.width, this.mapObject.mapAreaRect.height - 5);
        let mapHeight: number; let mapWidth: number;
        if (bounds) {
            const start: Point = convertGeoToPoint(
                bounds.latitude.min, bounds.longitude.min, null, layer, this.mapObject);
            const end: Point = convertGeoToPoint(
                bounds.latitude.max, bounds.longitude.max, null, layer, this.mapObject);
            mapHeight = end.y - start.y;
            mapWidth = end.x - start.x;
            if (mapHeight === 0 || mapWidth === 0) {
                mapWidth = mapSize.width / 2;
                mapHeight = mapSize.height;
            }
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

    public translateLayerElements(layerElement: Element): void {
        let childNode: HTMLElement;
        this.mapObject.translateType = 'layer';
        if (!isNullOrUndefined(this.mapObject.baseMapRectBounds)) {
            const duration: number = animationMode === 'Disable' ? 0 : (this.currentLayer.animationDuration === 0 && animationMode === 'Enable') ?
                1000 : this.currentLayer.animationDuration;
            const animate: boolean = duration !== 0 || isNullOrUndefined(this.mapObject.zoomModule);
            this.mapObject.baseTranslatePoint = this.mapObject.zoomTranslatePoint;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let translate: any;
            if (this.mapObject.zoomSettings.zoomFactor > 1 && !isNullOrUndefined(this.mapObject.zoomModule)) {
                translate = getZoomTranslate(this.mapObject, this.currentLayer, animate);
            } else {
                translate = getTranslate(this.mapObject, this.currentLayer, animate);
            }
            const scale: number = this.mapObject.previousScale = translate['scale'];
            const location: Point = this.mapObject.previousPoint = translate['location'] as Point;
            this.mapObject.baseTranslatePoint = this.mapObject.translatePoint = location;
            this.mapObject.baseScale = this.mapObject.scale = scale;
            for (let i: number = 0; i < layerElement.childElementCount; i++) {
                childNode = layerElement.childNodes[i as number] as HTMLElement;
                if (!(childNode.id.indexOf('_Markers_Group') > -1) &&
                    (!(childNode.id.indexOf('_bubble_Group') > -1)) &&
                    (!(childNode.id.indexOf('_dataLableIndex_Group') > -1))
                ) {
                    const transform: string = 'scale( ' + scale + ' ) '
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
                childNode = layerElement.childNodes[j as number] as HTMLElement;
                if (!(childNode.id.indexOf('_Markers_Group') > -1) &&
                    (!(childNode.id.indexOf('_bubble_Group') > -1)) &&
                    (!(childNode.id.indexOf('_dataLableIndex_Group') > -1)) &&
                    (!(childNode.id.indexOf('_line_Group') > -1))) {
                    if (childNode.id.indexOf('_Polygons_Group') === -1) {
                        const transform: string = 'scale( ' + this.mapObject.scale + ' ) ' + 'translate( ' + this.mapObject.translatePoint.x
                            + ' ' + this.mapObject.translatePoint.y + ' ) ';
                        childNode.setAttribute('transform', transform);
                    }
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public calculateRectBounds(layerData: any[]): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Array.prototype.forEach.call(layerData, (obj: any) => {
            if (!isNullOrUndefined(obj['geometry']) || !isNullOrUndefined(obj['coordinates'])) {
                const type: string = !isNullOrUndefined(obj['geometry']) ? obj['geometry']['type'] : obj['type'];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const coordinates: any[] = !isNullOrUndefined(obj['geometry']) ? obj['geometry']['coordinates'] : obj['coordinates'];
                switch (type.toLowerCase()) {
                case 'polygon':
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this.calculateRectBox(<any[]>coordinates[0]);
                    break;
                case 'multipolygon':
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    coordinates.map((point: any) => {
                        this.calculateRectBox(point[0]);
                    });
                    break;
                case 'multilinestring':
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    coordinates.map((multiPoint: any) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        multiPoint.map((point: any, index: number) => {
                            this.calculateRectBox(point, 'multilinestring', index === 0 ? true : false);
                        });
                    });
                    break;
                case 'linestring':
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    coordinates.map((point: any, index: number) => {
                        this.calculateRectBox(point, 'linestring', index === 0 ? true : false);
                    });
                    break;
                case 'point':
                    this.calculateRectBox(coordinates, 'point');
                    break;
                case 'multipoint':
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    coordinates.map((point: any, index: number) => {
                        this.calculateRectBox(point, 'multipoint', index === 0 ? true : false);
                    });
                    break;
                }
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public calculatePolygonBox(coordinates: any[]): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newData: any[] = [];
        const bounds: GeoLocation = this.mapObject.baseMapBounds;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        coordinates.map((currentPoint: any) => {
            const latitude: number = currentPoint[1];
            const longitude: number = currentPoint[0];
            if ((longitude >= bounds.longitude.min && longitude <= bounds.longitude.max)
                && (latitude >= bounds.latitude.min && latitude <= bounds.latitude.max)) {
                const point: Point = convertGeoToPoint(
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public calculateRectBox(coordinates: any[], type?: string, isFirstItem?: boolean): void {
        if ((type !== 'linestring' && type !== 'multilinestring') && (type !== 'point' && type !== 'multipoint')) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Array.prototype.forEach.call(coordinates, (currentCoords: any) => {
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
        } else {
            if ((isFirstItem || type === 'point') && isNullOrUndefined(this.mapObject.baseMapBounds)) {
                this.mapObject.baseMapBounds = new GeoLocation(
                    { min: coordinates[1], max: coordinates[1] },
                    { min: coordinates[0], max: coordinates[0] });
            } else {
                this.mapObject.baseMapBounds.latitude.min = Math.min(this.mapObject.baseMapBounds.latitude.min, coordinates[1]);
                this.mapObject.baseMapBounds.latitude.max = Math.max(this.mapObject.baseMapBounds.latitude.max, coordinates[1]);
                this.mapObject.baseMapBounds.longitude.min = Math.min(this.mapObject.baseMapBounds.longitude.min, coordinates[0]);
                this.mapObject.baseMapBounds.longitude.max = Math.max(this.mapObject.baseMapBounds.longitude.max, coordinates[0]);
            }
        }
    }
    public generateTiles(zoomLevel: number, tileTranslatePoint: Point, zoomType?: string, bing?: BingMap, position?: Point): void {
        const userLang: string = this.mapObject.locale;
        const size: Size = this.mapObject.availableSize;
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
            xcount = (this.horizontalPanXCount >= xcount) ? this.horizontalPanXCount : xcount;
            this.horizontalPan = false;
        } else {
            this.horizontalPanXCount = xcount;
            this.horizontalPan = true;
        }
        const baseLayer: LayerSettingsModel = this.mapObject.layers[this.mapObject.baseLayerIndex];
        this.urlTemplate = baseLayer.urlTemplate;
        const endY: number = Math.min(ycount, ((-tileTranslatePoint.y + size.height) / 256) + 1);
        const endX: number = Math.min(xcount, ((-tileTranslatePoint.x + size.width + (xRight * 256)) / 256) + 1);
        const startX: number = (-((tileTranslatePoint.x + (xLeft * 256)) + 256) / 256);
        const startY: number = (-(tileTranslatePoint.y + 256) / 256);
        bing = bing || this.bing || this.mapObject.bingMap;
        for (let i: number = Math.round(startX); i < Math.round(endX); i++) {
            for (let j: number = Math.round(startY); j < Math.round(endY); j++) {
                const x: number = 256 * i + tileTranslatePoint.x;
                const y: number = 256 * j + tileTranslatePoint.y;
                if (x > -256 && x <= size.width && y > -256 && y < size.height) {
                    if (j >= 0) {
                        let tileI: number = i;
                        if (i < 0) {
                            tileI = (tileI % ycount) + ycount;
                        }
                        const tile: Tile = new Tile(tileI % ycount, j);
                        tile.left = Math.round(x);
                        tile.top = Math.round(y);
                        if ((bing && !isNullOrUndefined(baseLayer.urlTemplate) && baseLayer.urlTemplate !== '' && baseLayer.urlTemplate.indexOf('quadkey') > -1)) {
                            tile.src = bing.getBingMap(tile, '', '', userLang, bing.imageUrl, bing.subDomains);
                        } else {
                            bing = null;
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
        const proxTiles: Tile[] = extend([], this.tiles, [], true) as Tile[];
        for (const layer of this.mapObject.layers) {
            if (!(layer.type === 'SubLayer' && layer.visible)) {
                continue;
            }
            if (isNullOrUndefined(layer.shapeData) && !isNullOrUndefined(layer.urlTemplate) && layer.urlTemplate !== '') {
                for (const baseTile of proxTiles) {
                    const subtile: Tile = extend({}, baseTile, {}, true) as Tile;
                    if (layer.urlTemplate.indexOf('quadkey')) {
                        bing = new BingMap(this.mapObject);
                        subtile.src = bing.getBingMap(subtile, '', '', userLang, bing.imageUrl, bing.subDomains);
                    } else {
                        subtile.src = layer.urlTemplate.replace('level', zoomLevel.toString()).replace('tileX', baseTile.x.toString())
                            .replace('tileY', baseTile.y.toString());
                    }
                    this.tiles.push(subtile);
                }
            }
        }
        if (this.mapObject.previousScale !== this.mapObject.scale || this.mapObject.isReset || this.mapObject.isZoomByPosition
            || this.mapObject.zoomNotApplied) {
            this.arrangeTiles(zoomType, this.animateToZoomX, this.animateToZoomY);
        }
    }

    public arrangeTiles(type: string, x: number, y: number): void {
        const element: HTMLElement = document.getElementById(this.mapObject.element.id + '_tile_parent');
        const element1: HTMLElement = document.getElementById(this.mapObject.element.id + '_tiles');
        let timeOut: number;
        if (!isNullOrUndefined(type) && type !== 'Pan') {
            this.tileAnimation(type, x, y);
            timeOut = animationMode === 'Disable' ? 0 : (this.mapObject.layersCollection[0].animationDuration === 0 &&
                animationMode === 'Enable') ? 1000 : this.mapObject.layersCollection[0].animationDuration;
        } else {
            timeOut = 0;
        }
        setTimeout(() => {
            if (element) {
                element.style.zIndex = '1';
            }
            if (element1) {
                element1.style.zIndex = '0';
            }
            let animateElement: HTMLElement;
            if (!document.getElementById(this.mapObject.element.id + '_animated_tiles') && element) {
                animateElement = createElement('div', { id: this.mapObject.element.id + '_animated_tiles' });
                element.appendChild(animateElement);
            } else {
                if (type !== 'Pan' && element1 && element) {
                    element1.appendChild(element.children[0]);
                    if (!this.mapObject.isAddLayer && !isNullOrUndefined(document.getElementById(this.mapObject.element.id + '_animated_tiles'))) {
                        document.getElementById(this.mapObject.element.id + '_animated_tiles').id =
                            this.mapObject.element.id + '_animated_tiles_old';
                    }
                    animateElement = createElement('div', { id: this.mapObject.element.id + '_animated_tiles' });
                    element.appendChild(animateElement);
                } else {
                    animateElement = element ? element.children[0] as HTMLElement : null;
                }
            }
            for (let id: number = 0; id < this.tiles.length; id++) {
                const tile: Tile = this.tiles[id as number];
                let imgElement: HTMLImageElement = null;
                const mapId: string = this.mapObject.element.id;
                if (type === 'Pan') {
                    let child: HTMLElement = document.getElementById(mapId + '_tile_' + id);
                    let isNewTile: boolean = false;
                    if (isNullOrUndefined(child)) {
                        isNewTile = true;
                        child = createElement('div', { id: mapId + '_tile_' + id });
                        imgElement = createElement('img') as HTMLImageElement;
                    } else {
                        child.style.removeProperty('display');
                        imgElement = <HTMLImageElement>child.children[0];
                    }
                    if (!isNewTile && imgElement && imgElement.src !== tile.src) {
                        imgElement.src = tile.src;
                    }
                    child.style.position = 'absolute';
                    child.style.left = tile.left + 'px';
                    child.style.top = tile.top + 'px';
                    child.style.height = tile.height + 'px';
                    child.style.width = tile.width + 'px';
                    if (isNewTile) {
                        imgElement.setAttribute('height', '256px');
                        imgElement.setAttribute('width', '256px');
                        imgElement.setAttribute('src', tile.src);
                        imgElement.setAttribute('alt', this.mapObject.getLocalizedLabel('ImageNotFound'));
                        imgElement.style.setProperty('user-select', 'none');
                        child.appendChild(imgElement);
                        animateElement.appendChild(child);
                    }
                } else {
                    imgElement = createElement('img') as HTMLImageElement;
                    imgElement.setAttribute('height', '256px');
                    imgElement.setAttribute('width', '256px');
                    imgElement.setAttribute('src', tile.src);
                    imgElement.style.setProperty('user-select', 'none');
                    imgElement.setAttribute('alt', this.mapObject.getLocalizedLabel('ImageNotFound'));
                    const child: HTMLElement = createElement('div', { id: mapId + '_tile_' + id });
                    child.style.position = 'absolute';
                    child.style.left = tile.left + 'px';
                    child.style.top = tile.top + 'px';
                    child.style.height = tile.height + 'px';
                    child.style.width = tile.width + 'px';
                    child.appendChild(imgElement);
                    if (animateElement) {
                        animateElement.appendChild(child);
                    }
                }
                if (id === (this.tiles.length - 1) && document.getElementById(this.mapObject.element.id + '_animated_tiles_old')) {
                    removeElement(this.mapObject.element.id + '_animated_tiles_old');
                }
            }
            if (!isNullOrUndefined(this.mapObject.currentTiles)) {
                for (let l: number = this.tiles.length; l < animateElement.childElementCount; l++) {
                    let isExistingElement: boolean = false;
                    for (let a: number = 0; a < this.mapObject.currentTiles.childElementCount; a++) {
                        if (!isExistingElement &&
                            this.mapObject.currentTiles.children[a as number].id === animateElement.children[l as number].id) {
                            isExistingElement = true;
                        }
                    }
                    if (isExistingElement) {
                        (animateElement.children[l as number] as HTMLElement).style.display = 'none';
                    } else {
                        animateElement.removeChild(animateElement.children[l as number]);
                    }
                }
            }
        }, timeOut);
    }

    /**
     * Animation for tile layers and hide the group element until the tile layer rendering.
     *
     * @param {string} zoomType - Specifies the zoom type
     * @param {number} translateX - Specifies the x translate point
     * @param {number} translateY - Specifies the y translate point
     * @returns {void}
     */
    private tileAnimation(zoomType: string, translateX: number, translateY: number): void {
        const tileParent: HTMLElement =  document.getElementById(this.mapObject.element.id + '_tile_parent');
        const animatedTiles: HTMLElement = document.getElementById(this.mapObject.element.id + '_animated_tiles');
        const tileElement: HTMLElement = document.getElementById(this.mapObject.element.id + '_tiles');
        let scaleValue: string = '2';
        if (zoomType.indexOf('ZoomOut') === 0 || zoomType === 'Reset') {
            tileElement.style.zIndex = '1';
            tileParent.style.zIndex = '0';
            while (tileElement.childElementCount >= 1) {
                tileElement.removeChild(tileElement.children[0]);
            }
            translateX = 0;
            translateY = document.getElementById(this.mapObject.element.id + '_tile_parent').getClientRects()[0].height / 4;
            scaleValue = zoomType.indexOf('ZoomOut') === 0 ? '0.5' : '0.2';
        }
        if (!isNullOrUndefined(animatedTiles)) {
            animatedTiles.style.transition = animationMode === 'Disable' ? '0ms' : (this.mapObject.layersCollection[0].animationDuration === 0
                && animationMode === 'Enable') ? '1000ms' : this.mapObject.layersCollection[0].animationDuration + 'ms';
            animatedTiles.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scaleValue + ')';
        }
    }

    /**
     * To find the tile translate point.
     *
     * @param {number} factorX - Specifies the x factor
     * @param {number} factorY - Specifies the x factor
     * @param {MapLocation} centerPosition - Specifies the map location
     * @returns {Point} - Returns point values
     */
    private panTileMap(factorX: number, factorY: number, centerPosition: MapLocation): Point {
        if (this.mapObject.tileZoomLevel <= this.mapObject.tileZoomScale && this.mapObject.initialCheck) {
            this.mapObject.tileZoomLevel = this.mapObject.tileZoomScale;
        }
        const level: number = this.mapObject.tileZoomLevel;
        let padding: number = 20;
        let x: number; let y: number;
        const totalSize: number = Math.pow(2, level) * 256;
        x = (factorX / 2) - (totalSize / 2);
        y = (factorY / 2) - (totalSize / 2);
        const position: MapLocation = convertTileLatLongToPoint(
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
                const xdiff: number = x - ((this.mapObject.previousTileWidth / 2) - (totalSize / 2));
                const ydiff: number = y - ((this.mapObject.previousTileHeight / 2) - (totalSize / 2) + padding);
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
            (x - (0.01 * this.mapObject.zoomSettings.zoomFactor)) / this.mapObject.scale,
            (y - (0.01 * this.mapObject.zoomSettings.zoomFactor)) / this.mapObject.scale
        );
        this.mapObject.previousTileWidth = factorX;
        this.mapObject.previousTileHeight = factorY;
        return new Point(x, y);
    }

    /**
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.mapObject = null;
        this.groupElements = [];
        this.layerObject = null;
        this.currentLayer = null;
        this.rectBounds = null;
        this.tiles = [];
        this.clipRectElement = null;
        this.tileSvgObject = null;
        this.ajaxModule = null;
        this.ajaxResponse = [];
        this.layerGroup = null;
        if (!isNullOrUndefined(this.bing)) {
            this.bing.destroy();
        }
        this.bing = null;
    }
}
