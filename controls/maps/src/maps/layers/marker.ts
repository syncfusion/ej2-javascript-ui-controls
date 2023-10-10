import { Maps } from '../../index';
import {
    LayerSettings, MarkerSettings, IMarkerRenderingEventArgs, markerRendering,
    convertTileLatLongToPoint, MapLocation, MarkerClusterData, markerDragStart
} from '../index';
import {
    IMarkerClickEventArgs, markerClick, IMarkerMoveEventArgs, markerMouseMove,
    IMarkerClusterClickEventArgs, IMarkerClusterMoveEventArgs, markerClusterClick, markerClusterMouseMove,
    MarkerSettingsModel, IMarkerDragEventArgs
} from '../index';
import { isNullOrUndefined, createElement, animationMode } from '@syncfusion/ej2-base';
import { Point, getTranslate, convertGeoToPoint, clusterTemplate, marker, markerTemplate, getZoomTranslate } from '../utils/helper';
import {
    getElementByID, mergeSeparateCluster, clusterSeparate, removeElement, getElement,
    markerColorChoose, markerShapeChoose, calculateZoomLevel, compareZoomFactor, getValueFromObject
} from '../utils/helper';

/**
 * Marker class
 */
export class Marker {
    private maps: Maps;
    private isMarkerExplode: number;
    private trackElements: Element[];
    private markerSVGObject: Element;
    /**
     * @private
     */
    public sameMarkerData: MarkerClusterData[];
    constructor(maps: Maps) {
        this.maps = maps;
        this.trackElements = [];
        this.sameMarkerData = [];
    }

    public markerRender(maps: Maps, layerElement: Element, layerIndex: number, factor: number, type: string): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let templateFn: any;
        let markerCount: number = 0;
        let nullCount: number = 0;
        let markerTemplateCount: number = 0; maps.translateType = 'marker';
        const currentLayer: LayerSettings = <LayerSettings>maps.layersCollection[layerIndex as number];
        this.markerSVGObject = maps.renderer.createGroup({
            id: maps.element.id + '_Markers_Group',
            class: 'GroupElement'
        });
        (this.markerSVGObject as HTMLElement).style.pointerEvents = 'auto';
        const markerTemplateEle: HTMLElement = createElement('div', {
            id: maps.element.id + '_LayerIndex_' + layerIndex + '_Markers_Template_Group',
            className: maps.element.id + '_template'
        });
        markerTemplateEle.style.cssText = 'overflow: hidden; position: absolute;pointer-events: none;' +
                                            'top:' + maps.mapAreaRect.y + 'px;' +
                                            'left:' + maps.mapAreaRect.x + 'px;' +
                                            'height:' + maps.mapAreaRect.height + 'px;' +
                                            'width:' + maps.mapAreaRect.width + 'px;';
        currentLayer.markerSettings.map((markerSettings: MarkerSettings, markerIndex: number) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const markerData: any[] = <any[]>markerSettings.dataSource;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Array.prototype.forEach.call(markerData, (data: any, dataIndex: number) => {
                maps.markerNullCount = markerIndex > 0 && dataIndex === 0 ? 0 : maps.markerNullCount;
                let eventArgs: IMarkerRenderingEventArgs = {
                    cancel: false, name: markerRendering, fill: markerSettings.fill, height: markerSettings.height,
                    width: markerSettings.width, imageUrl: markerSettings.imageUrl, shape: markerSettings.shape,
                    template: markerSettings.template, data: data, maps: maps, marker: markerSettings,
                    border: markerSettings.border, colorValuePath: markerSettings.colorValuePath,
                    shapeValuePath: markerSettings.shapeValuePath, imageUrlValuePath: markerSettings.imageUrlValuePath
                };
                maps.trigger('markerRendering', eventArgs, (MarkerArgs: IMarkerRenderingEventArgs) => {
                    eventArgs = markerColorChoose(eventArgs, data);
                    eventArgs = markerShapeChoose(eventArgs, data);
                    const lng: number = (!isNullOrUndefined(markerSettings.longitudeValuePath)) ?
                        Number(getValueFromObject(data, markerSettings.longitudeValuePath)) : !isNullOrUndefined(data['longitude']) ?
                            parseFloat(data['longitude']) : !isNullOrUndefined(data['Longitude']) ? parseFloat(data['Longitude']) : null;
                    const lat: number = (!isNullOrUndefined(markerSettings.latitudeValuePath)) ?
                        Number(getValueFromObject(data, markerSettings.latitudeValuePath)) : !isNullOrUndefined(data['latitude']) ?
                            parseFloat(data['latitude']) : !isNullOrUndefined(data['Latitude']) ? parseFloat(data['Latitude']) : null;
                    const offset: Point = markerSettings.offset;
                    if (!eventArgs.cancel && markerSettings.visible && !isNullOrUndefined(lng) && !isNullOrUndefined(lat)) {
                        const markerID: string = maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_'
                            + markerIndex + '_dataIndex_' + dataIndex;
                        let location: Point = (maps.isTileMap) ? convertTileLatLongToPoint(
                            new MapLocation(lng, lat), factor, maps.tileTranslatePoint, true
                        ) : convertGeoToPoint(lat, lng, factor, currentLayer, maps);
                        const animate: boolean = (currentLayer.animationDuration !== 0 || animationMode === 'Enable') || isNullOrUndefined(maps.zoomModule);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const translate: any = (maps.isTileMap) ? (currentLayer.type === 'SubLayer' && isNullOrUndefined(maps.zoomModule)) ? location = convertTileLatLongToPoint(
                            new MapLocation(lng, lat), maps.tileZoomLevel, maps.tileTranslatePoint, true
                        ) : new Object() :
                            !isNullOrUndefined(maps.zoomModule) && maps.zoomSettings.zoomFactor > 1 ?
                                getZoomTranslate(maps, currentLayer, animate) :
                                getTranslate(maps, currentLayer, animate);
                        const scale: number = type === 'AddMarker' ? maps.scale : translate['scale'];
                        const transPoint: Point = type === 'AddMarker' ? maps.translatePoint : translate['location'] as Point;
                        if (eventArgs.template &&  (!isNaN(location.x) && !isNaN(location.y))) {
                            markerTemplateCount++;
                            markerTemplate(eventArgs, templateFn, markerID, data, markerIndex, markerTemplateEle, location, transPoint,
                                           scale, offset, maps);
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (maps as any).renderReactTemplates();
                        } else if (!eventArgs.template && (!isNaN(location.x) && !isNaN(location.y))) {
                            markerCount++;
                            marker(eventArgs, markerSettings, markerData, dataIndex,
                                   location, transPoint, markerID, offset, scale, maps, this.markerSVGObject);
                        }
                    }
                    nullCount += (!isNaN(lat) && !isNaN(lng)) ? 0 : 1;
                    markerTemplateCount += (eventArgs.cancel) ? 1 : 0;
                    markerCount += (eventArgs.cancel) ? 1 : 0;
                    maps.markerNullCount = (isNullOrUndefined(lng) || isNullOrUndefined(lat)) ?
                        maps.markerNullCount + 1 : maps.markerNullCount;
                    const markerDataLength: number = markerData.length - maps.markerNullCount;
                    if (this.markerSVGObject.childElementCount === (markerDataLength - markerTemplateCount - nullCount) && (type !== 'Template')) {
                        layerElement.appendChild(this.markerSVGObject);
                        if (currentLayer.markerClusterSettings.allowClustering) {
                            maps.svgObject.appendChild(this.markerSVGObject);
                            maps.element.appendChild(maps.svgObject);
                            if ((currentLayer.layerType === 'OSM' || (currentLayer.urlTemplate.indexOf('openstreetmap') !== -1 && isNullOrUndefined(currentLayer.shapeData)))
                                && maps.zoomSettings.enable) {
                                clusterTemplate(currentLayer, this.markerSVGObject,
                                                maps, layerIndex, this.markerSVGObject, layerElement, true, false);
                                layerElement.appendChild(this.markerSVGObject);
                            } else {
                                clusterTemplate(currentLayer, this.markerSVGObject,
                                                maps, layerIndex, this.markerSVGObject, layerElement, true, false);
                            }
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (maps as any).renderReactTemplates();
                        }
                    }
                    if (markerTemplateEle.childElementCount === (markerDataLength - markerCount - nullCount) && getElementByID(maps.element.id + '_Secondary_Element')) {
                        getElementByID(maps.element.id + '_Secondary_Element').appendChild(markerTemplateEle);
                        if (maps.checkInitialRender) {
                            if (currentLayer.markerClusterSettings.allowClustering) {
                                clusterTemplate(currentLayer, markerTemplateEle, maps,
                                                layerIndex, this.markerSVGObject, layerElement, false, false);
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (maps as any).renderReactTemplates();
                            }
                        }
                    }
                });
            });
        });
    }
    /**
     * To find zoom level for individual layers like India, USA.
     *
     * @param {number} mapWidth - Specifies the width of the maps
     * @param {number} mapHeight - Specifies the height of the maps
     * @param {number} maxZoomFact - Specifies the maximum zoom factor
     * @returns {number} - Returns the scale factor
     */
    private calculateIndividualLayerMarkerZoomLevel(mapWidth : number, mapHeight : number,
                                                    maxZoomFact : number): number {
        let latZoom: number; let lngZoom : number;
        const height : number =  Math.abs(this.maps.baseMapBounds.latitude.max - this.maps.baseMapBounds.latitude.min);
        const width : number = Math.abs(this.maps.baseMapBounds.longitude.max - this.maps.baseMapBounds.longitude.min);
        latZoom = Math.floor(Math.log(mapHeight / height));
        latZoom = (latZoom > maxZoomFact) ? maxZoomFact : latZoom;
        lngZoom = Math.floor(Math.log(mapWidth / width));
        lngZoom = (lngZoom > maxZoomFact) ? maxZoomFact : lngZoom;
        const result: number = Math.min(latZoom, lngZoom);
        const scaleFactor: number = Math.min(result, maxZoomFact - 1);
        if (!this.maps.isTileMap) {
            compareZoomFactor(scaleFactor, this.maps);
        }
        return scaleFactor;
    }
    /**
     * To calculate center position and factor value dynamically
     *
     * @param {LayerSettings[]} layersCollection - Specifies the layer settings instance.
     * @returns {void}
     * @private
     */
    public calculateZoomCenterPositionAndFactor(layersCollection: LayerSettings[]): void {
        if (!isNullOrUndefined(this.maps)) {
            if (this.maps.zoomSettings.shouldZoomInitially && this.maps.markerModule) {
                let minLong: number; let maxLat: number; let minLat: number; let maxLong: number;
                let latZoom: number; let lngZoom: number; let result: number; let zoomLevel: number;
                let centerLat: number; let centerLong: number; const maxZoomFact: number = this.maps.zoomSettings.maxZoom;
                const mapWidth: number = this.maps.mapAreaRect.width;
                const mapHeight: number = this.maps.mapAreaRect.height;
                this.maps.markerZoomedState = this.maps.markerZoomedState ? this.maps.markerZoomedState :
                    isNullOrUndefined(this.maps.markerZoomFactor) ? !this.maps.markerZoomedState :
                        this.maps.markerZoomFactor > 1 ? this.maps.markerZoomedState : !this.maps.markerZoomedState;
                this.maps.defaultState = this.maps.markerZoomedState ? !this.maps.markerZoomedState : this.maps.defaultState;
                Array.prototype.forEach.call(layersCollection, (currentLayer: LayerSettings) => {
                    const isMarker: boolean = currentLayer.markerSettings.length !== 0;
                    if (isMarker) {
                        Array.prototype.forEach.call(currentLayer.markerSettings, (markerSetting: MarkerSettingsModel) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const markerData: any[] = <any[]>markerSetting.dataSource;
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            Array.prototype.forEach.call(markerData, (data: any, dataIndex: number) => {
                                const latitude: number = !isNullOrUndefined(data['latitude']) ? parseFloat(data['latitude']) :
                                    !isNullOrUndefined(data['Latitude']) ? parseFloat(data['Latitude']) : null;
                                const longitude: number = !isNullOrUndefined(data['longitude']) ? parseFloat(data['longitude']) :
                                    !isNullOrUndefined(data['Longitude']) ? parseFloat(data['Longitude']) : null;
                                minLong = isNullOrUndefined(minLong) && dataIndex === 0 ?
                                    longitude : minLong;
                                maxLat = isNullOrUndefined(maxLat) && dataIndex === 0 ?
                                    latitude : maxLat;
                                minLat = isNullOrUndefined(minLat) && dataIndex === 0 ?
                                    latitude : minLat;
                                maxLong = isNullOrUndefined(maxLong) && dataIndex === 0 ?
                                    longitude : maxLong;
                                if (minLong > longitude) {
                                    minLong = longitude;
                                }
                                if (minLat > latitude) {
                                    minLat = latitude;
                                }
                                if (maxLong < longitude) {
                                    maxLong = longitude;
                                }
                                if (maxLat < latitude) {
                                    maxLat = latitude;
                                }
                            });
                        });
                    }
                });
                if (!isNullOrUndefined(minLat) && !isNullOrUndefined(minLong) &&
                    !isNullOrUndefined(maxLong) && !isNullOrUndefined(maxLat)) {
                    // To find the center position
                    centerLat = (minLat + maxLat) / 2;
                    centerLong = (minLong + maxLong) / 2;
                    this.maps.markerCenterLatitude = centerLat;
                    this.maps.markerCenterLongitude = centerLong;
                    if (isNullOrUndefined(this.maps.markerZoomCenterPoint) || this.maps.markerZoomedState) {
                        this.maps.markerZoomCenterPoint = {
                            latitude: centerLat,
                            longitude: centerLong
                        };
                    }
                    let markerFactor: number;
                    if (this.maps.isTileMap || this.maps.baseMapRectBounds['min']['x'] === 0) {
                        zoomLevel = calculateZoomLevel(minLat, maxLat, minLong, maxLong, mapWidth, mapHeight, this.maps, false);
                        if (this.maps.isTileMap) {
                            markerFactor = isNullOrUndefined(this.maps.markerZoomFactor) ?
                                zoomLevel : isNullOrUndefined(this.maps.mapScaleValue) ?
                                    zoomLevel : this.maps.mapScaleValue > 1 && this.maps.markerZoomFactor !== 1 ?
                                        this.maps.mapScaleValue : zoomLevel;
                        } else {
                            markerFactor = isNullOrUndefined(this.maps.mapScaleValue) ? zoomLevel :
                                (Math.floor(this.maps.scale) !== 1 &&
                                    this.maps.mapScaleValue !== zoomLevel)
                                    &&
                                    (isNullOrUndefined(this.maps.shouldZoomCurrentFactor))
                                    ? this.maps.mapScaleValue : zoomLevel;
                            if (((markerFactor === this.maps.mapScaleValue &&
                                (this.maps.markerZoomFactor === 1 || this.maps.mapScaleValue === 1))
                                && (!this.maps.enablePersistence))) {
                                markerFactor = zoomLevel;
                            }
                        }
                    } else {
                        zoomLevel = this.calculateIndividualLayerMarkerZoomLevel(mapWidth, mapHeight, maxZoomFact);
                        markerFactor = isNullOrUndefined(this.maps.mapScaleValue) ? zoomLevel :
                            (this.maps.mapScaleValue !== zoomLevel)
                                ? this.maps.mapScaleValue : zoomLevel;
                    }
                    this.maps.markerZoomFactor = markerFactor;
                }
            } else {
                this.maps.markerZoomedState = false;
                if (this.maps.markerZoomFactor > 1) {
                    this.maps.markerCenterLatitude = null;
                    this.maps.markerCenterLongitude = null;
                    this.maps.markerZoomFactor = 1;
                    if (!this.maps.enablePersistence) {
                        this.maps.mapScaleValue = 1;
                    }
                }
                if (this.maps.isTileMap && !this.maps.enablePersistence
                    && this.maps.mapScaleValue <= 1) {
                    this.maps.tileZoomLevel = this.maps.mapScaleValue === 0 ? (this.maps.isZoomByPosition ? this.maps.tileZoomLevel : 1)
                        : this.maps.mapScaleValue;
                    if (this.maps.mapScaleValue === 1 && this.maps.markerZoomFactor === 1) {
                        this.maps.tileTranslatePoint.x = 0;
                        this.maps.tileTranslatePoint.y = 0;
                    }
                }
            }
        }
    }
    /**
     * To check and trigger marker click event
     * @param {PointerEvent} e - Specifies the pointer event argument.
     * @returns {void}
     * @private
     */
    public markerClick(e: PointerEvent): void {
        const target: string = (e.target as Element).id;
        if (target.indexOf('_LayerIndex_') === -1 || target.indexOf('_cluster_') > 0) {
            return;
        }
        const options: { marker: MarkerSettingsModel, data: object } = this.getMarker(target);
        if (isNullOrUndefined(options)) {
            return;
        }
        if (options.marker.enableDrag){
            document.getElementById(this.maps.element.id + "_svg").style.cursor = 'grabbing';
        }
        const eventArgs: IMarkerClickEventArgs = {
            cancel: false, name: markerClick, data: options.data, maps: this.maps,
            marker: options.marker, target: target, x: e.clientX, y: e.clientY,
            latitude: options.data['latitude'] || options.data['Latitude'],
            longitude: options.data['longitude'] || options.data['Longitude'],
            value: options.data['name']
        };
        this.maps.trigger(markerClick, eventArgs);
        if (options.marker.enableDrag) {
            let isCluster = false;
            const layerIndex: number = parseInt(target.split('_LayerIndex_')[1].split('_')[0], 10);
            const markerIndex: number = parseInt(target.split('_MarkerIndex_')[1].split('_')[0], 10);
            const dataIndex: number = parseInt(target.split('_dataIndex_')[1].split('_')[0], 10);
            const marker: MarkerSettingsModel = this.maps.layers[layerIndex as number].markerSettings[markerIndex as number];
            if (this.sameMarkerData.length > 0) {
                isCluster = (this.sameMarkerData[0].data.filter((el) => { return ((el['index'] as number) == dataIndex); })).length > 0 &&
                    this.sameMarkerData[0].layerIndex === layerIndex && this.sameMarkerData[0].markerIndex === markerIndex
            }
            if (!isCluster) {
                const dragEventArgs: IMarkerDragEventArgs = {
                    name: markerDragStart, x: e.clientX, y: e.clientY,
                    latitude: options.data['latitude'] || options.data['Latitude'],
                    longitude: options.data['longitude'] || options.data['Longitude'],
                    layerIndex: layerIndex, markerIndex: markerIndex, dataIndex: dataIndex
                };
                this.maps.trigger(markerDragStart, dragEventArgs);
                this.maps.markerDragArgument = {
                    targetId: target, x: e.clientX, y: e.clientY,
                    latitude: options.data['latitude'] || options.data['Latitude'],
                    longitude: options.data['longitude'] || options.data['Longitude'],
                    shape: isNullOrUndefined(marker.shapeValuePath) ? marker.shape : marker.dataSource[dataIndex as number][marker.shapeValuePath],
                    layerIndex: layerIndex, markerIndex: markerIndex, dataIndex: dataIndex
                }
            }
        }
    }
    /**
     * To check and trigger Cluster click event
     * @param {PointerEvent} e - Specifies the pointer event argument.
     * @returns {void}
     * @private
     */
    public markerClusterClick(e: PointerEvent): void {
        const target: string = (e.target as Element).id;
        if (target.indexOf('_LayerIndex_') === -1 || target.indexOf('_cluster_') === -1) {
            return;
        }
        const options: { marker: MarkerSettingsModel, data: object, clusterCollection: MarkerClusterData[],
            markCollection: object[] } = this.getMarker(target);
        if (isNullOrUndefined(options)) {
            return;
        }
        if ((options.clusterCollection.length > 0 && this.maps.markerClusterExpand)) {
            if (getElement(this.maps.element.id + '_mapsTooltip') &&
                this.maps.mapsTooltipModule.tooltipTargetID.indexOf('_MarkerIndex_') > -1) {
                removeElement(this.maps.element.id + '_mapsTooltip');
            }
            if (this.sameMarkerData.length > 0 && !this.maps.markerClusterExpandCheck) {
                this.maps.markerClusterExpandCheck = true;
                mergeSeparateCluster(this.sameMarkerData, this.maps, this.markerSVGObject);
            }  else {
                this.sameMarkerData = options.clusterCollection;
                this.maps.markerClusterExpandCheck = false;
                clusterSeparate(this.sameMarkerData, this.maps, this.markerSVGObject, true);
            }
        }
        const eventArgs: IMarkerClusterClickEventArgs = {
            cancel: false, name: markerClusterClick, data: options, maps: this.maps,
            target: target, x: e.clientX, y: e.clientY,
            latitude: options.data['latitude'] || options.data['Latitude'], longitude: options.data['longitude'] || options.data['Longitude'],
            markerClusterCollection: options['markCollection']
        };
        this.maps.trigger(markerClusterClick, eventArgs);
    }
    /**
     * To get marker from target id
     *
     * @param {string} target - Specifies the target
     * @returns {string} - Returns the string
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private getMarker(target: string): { marker: MarkerSettingsModel, data: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clusterCollection: MarkerClusterData[], markCollection: any[] } {
        const id: string[] = target.split('_LayerIndex_');
        const index: number = parseInt(id[1].split('_')[0], 10);
        const layer: LayerSettings = <LayerSettings>this.maps.layers[index as number];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let data: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const markCollection: any[] = [];
        const clusterCollection: MarkerClusterData[] = [];
        let marker: MarkerSettingsModel;
        this.maps.markerClusterExpand = layer.markerClusterSettings.allowClusterExpand;
        if (target.indexOf('_MarkerIndex_') > -1) {
            const markerIndex: number = parseInt(id[1].split('_MarkerIndex_')[1].split('_')[0], 10);
            const dataIndex: number = parseInt(id[1].split('_dataIndex_')[1].split('_')[0], 10);
            marker = layer.markerSettings[markerIndex as number];
            if (!isNaN(markerIndex)) {
                data = marker.dataSource[dataIndex as number];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let collection: any[] = [];
                if (!marker.template && (target.indexOf('_cluster_') > -1) && (this.maps.layers[index as number].markerClusterSettings.allowClusterExpand)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    Array.prototype.forEach.call(marker.dataSource, (location: any, index: number) => {
                        if (location['latitude'] === data['latitude'] && location['longitude'] === data['longitude']) {
                            collection.push({ data: data, index: index });
                        }
                    });
                }
                if ((target.indexOf('_cluster_') > -1)) {
                    let isClusterSame: boolean = false;
                    const clusterElement: HTMLElement = document.getElementById(target.indexOf('_datalabel_') > -1 ? layer.markerClusterSettings.shape === 'Balloon' ? target.split('_datalabel_')[0] + '_Group' : target.split('_datalabel_')[0] : layer.markerClusterSettings.shape === 'Balloon' ? target + '_Group' : target);
                    const indexes: number[] = layer.markerClusterSettings.shape === 'Balloon' ? (clusterElement.children[0] as HTMLElement).textContent.split(',').map(Number) : (clusterElement as HTMLElement).textContent.split(',').map(Number);
                    collection = [];
                    for (const i of indexes) {
                        collection.push({ data: marker.dataSource[i as number], index: i });
                        markCollection.push(marker.dataSource[i as number]);
                    }
                    isClusterSame = false;
                    clusterCollection.push(<MarkerClusterData>{
                        data: collection, layerIndex: index, markerIndex: markerIndex, dataIndex: dataIndex,
                        targetClusterIndex: +(target.split('_cluster_')[1].indexOf('_datalabel_') > -1 ? target.split('_cluster_')[1].split('_datalabel_')[0] : target.split('_cluster_')[1]),
                        isClusterSame: isClusterSame
                    });
                }
                return { marker: marker, data: data, clusterCollection: clusterCollection, markCollection: markCollection };
            }
        }
        return null;
    }
    /**
     * To check and trigger marker move event
     *
     * @param {PointerEvent} e - Specifies the pointer event argument.
     * @returns {void}
     * @private
     */
    public markerMove(e: PointerEvent): void {
        const targetId: string = (e.target as Element).id;
        if (targetId.indexOf('_LayerIndex_') === -1 || targetId.indexOf('_cluster_') > 0) {
            return;
        }
        const options: { marker: MarkerSettingsModel, data: object } = this.getMarker(targetId);
        if (isNullOrUndefined(options)) {
            return;
        }
        if (options.marker.enableDrag){
            document.getElementById(this.maps.element.id + "_svg").style.cursor = isNullOrUndefined(this.maps.markerDragArgument) ?
                    'pointer' : 'grabbing';
        }
        const eventArgs: IMarkerMoveEventArgs = {
            cancel: false, name: markerMouseMove, data: options.data,
            maps: this.maps, target: targetId, x: e.clientX, y: e.clientY
        };
        this.maps.trigger(markerMouseMove, eventArgs);
    }
    /**
     * To check and trigger cluster move event
     *
     * @param {PointerEvent} e - Specifies the pointer event argument.
     * @returns {void}
     * @private
     */
    public markerClusterMouseMove(e: PointerEvent): void {
        const targetId: string = (e.target as Element).id;
        if (targetId.indexOf('_LayerIndex_') === -1 || targetId.indexOf('_cluster_') === -1) {
            return;
        }
        const options: { marker: MarkerSettingsModel, data: object, clusterCollection: MarkerClusterData[] } = this.getMarker(targetId);
        if (this.maps.markerClusterExpand) {
            (e.target as HTMLElement).style.cursor = 'pointer';
        }
        if (isNullOrUndefined(options)) {
            return;
        }
        const eventArgs: IMarkerClusterMoveEventArgs = {
            cancel: false, name: markerClusterMouseMove, data: options.data, maps: this.maps,
            target: targetId, x: e.clientX, y: e.clientY
        };
        this.maps.trigger(markerClusterMouseMove, eventArgs);
    }
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name
     */
    protected getModuleName(): string {
        return 'Marker';
    }

    /**
     * To destroy the layers.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.maps = null;
        this.trackElements = [];
        this.markerSVGObject = null;
        this.sameMarkerData = [];
    }
}
