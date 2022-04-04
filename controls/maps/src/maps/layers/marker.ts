/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { Maps } from '../../index';
import {
    LayerSettings, MarkerSettings, IMarkerRenderingEventArgs, markerRendering,
    convertTileLatLongToPoint, MapLocation, MarkerClusterData
} from '../index';
import {
    IMarkerClickEventArgs, markerClick, IMarkerMoveEventArgs, markerMouseMove,
    IMarkerClusterClickEventArgs, IMarkerClusterMoveEventArgs, markerClusterClick, markerClusterMouseMove,
    MarkerSettingsModel
} from '../index';
import { isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
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
    private previousExplodeId: string;
    /**
     * @private
     */
    public sameMarkerData: MarkerClusterData[];
    constructor(maps: Maps) {
        this.maps = maps;
        this.trackElements = [];
        this.sameMarkerData = [];
    }

    public markerRender(layerElement: Element, layerIndex: number, factor: number, type: string): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let templateFn: any;
        let markerCount: number = 0;
        let nullCount: number = 0;
        let markerTemplateCount: number = 0; this.maps.translateType = 'marker';
        const currentLayer: LayerSettings = <LayerSettings>this.maps.layersCollection[layerIndex];
        this.markerSVGObject = this.maps.renderer.createGroup({
            id: this.maps.element.id + '_Markers_Group',
            class: 'GroupElement',
            style: 'pointer-events: auto;'
        });
        const markerTemplateEle: HTMLElement = createElement('div', {
            id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_Markers_Template_Group',
            className: this.maps.element.id + '_template',
            styles: 'overflow: hidden; position: absolute;pointer-events: none;' +
                'top:' + this.maps.mapAreaRect.y + 'px;' +
                'left:' + this.maps.mapAreaRect.x + 'px;' +
                'height:' + this.maps.mapAreaRect.height + 'px;' +
                'width:' + this.maps.mapAreaRect.width + 'px;'
        });
        currentLayer.markerSettings.map((markerSettings: MarkerSettings, markerIndex: number) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const markerData: any[] = <any[]>markerSettings.dataSource;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Array.prototype.forEach.call(markerData, (data: any, dataIndex: number) => {
                this.maps.markerNullCount = markerIndex > 0 && dataIndex === 0 ? 0 : this.maps.markerNullCount;
                let eventArgs: IMarkerRenderingEventArgs = {
                    cancel: false, name: markerRendering, fill: markerSettings.fill, height: markerSettings.height,
                    width: markerSettings.width, imageUrl: markerSettings.imageUrl, shape: markerSettings.shape,
                    template: markerSettings.template, data: data, maps: this.maps, marker: markerSettings,
                    border: markerSettings.border, colorValuePath: markerSettings.colorValuePath,
                    shapeValuePath: markerSettings.shapeValuePath, imageUrlValuePath: markerSettings.imageUrlValuePath
                };
                this.maps.trigger('markerRendering', eventArgs, (MarkerArgs: IMarkerRenderingEventArgs) => {
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
                        const markerID: string = this.maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_'
                            + markerIndex + '_dataIndex_' + dataIndex;
                        let location: Point = (this.maps.isTileMap) ? convertTileLatLongToPoint(
                            new MapLocation(lng, lat), factor, this.maps.tileTranslatePoint, true
                        ) : convertGeoToPoint(lat, lng, factor, currentLayer, this.maps);
                        const animate: boolean = currentLayer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const translate: any = (this.maps.isTileMap) ? (currentLayer.type === 'SubLayer' && isNullOrUndefined(this.maps.zoomModule)) ? location = convertTileLatLongToPoint(
                            new MapLocation(lng, lat), this.maps.tileZoomLevel, this.maps.tileTranslatePoint, true
                        ) : new Object() :
                            !isNullOrUndefined(this.maps.zoomModule) && this.maps.zoomSettings.zoomFactor > 1 ?
                                getZoomTranslate(this.maps, currentLayer, animate) :
                                getTranslate(this.maps, currentLayer, animate);
                        const scale: number = type === 'AddMarker' ? this.maps.scale : translate['scale'];
                        const transPoint: Point = type === 'AddMarker' ? this.maps.translatePoint : translate['location'] as Point;
                        if (eventArgs.template &&  (!isNaN(location.x) && !isNaN(location.y))) {
                            markerTemplateCount++;
                            markerTemplate(eventArgs, templateFn, markerID, data, markerIndex, markerTemplateEle, location, transPoint,
                                           scale, offset, this.maps);
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (this.maps as any).renderReactTemplates();
                        } else if (!eventArgs.template && (!isNaN(location.x) && !isNaN(location.y))) {
                            markerCount++;
                            marker(eventArgs, markerSettings, markerData, dataIndex,
                                   location, transPoint, markerID, offset, scale, this.maps, this.markerSVGObject);
                        }
                    }
                    nullCount += (!isNaN(lat) && !isNaN(lng)) ? 0 : 1;
                    markerTemplateCount += (eventArgs.cancel) ? 1 : 0;
                    markerCount += (eventArgs.cancel) ? 1 : 0;
                    this.maps.markerNullCount = (isNullOrUndefined(lng) || isNullOrUndefined(lat)) ? this.maps.markerNullCount + 1 : this.maps.markerNullCount;
                    const markerDataLength: number = markerData.length - this.maps.markerNullCount;
                    if (this.markerSVGObject.childElementCount === (markerDataLength - markerTemplateCount - nullCount) && (type !== 'Template')) {
                        layerElement.appendChild(this.markerSVGObject);
                        if (currentLayer.markerClusterSettings.allowClustering) {
                            this.maps.svgObject.appendChild(this.markerSVGObject);
                            this.maps.element.appendChild(this.maps.svgObject);
                            if (currentLayer.layerType !== 'OSM' || !this.maps.zoomSettings.enable) {
                                clusterTemplate(currentLayer, this.markerSVGObject,
                                                this.maps, layerIndex, this.markerSVGObject, layerElement, true, false);
                            } else {
                                layerElement.appendChild(this.markerSVGObject);
                            }
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (this.maps as any).renderReactTemplates();
                        }
                    }
                    if (markerTemplateEle.childElementCount === (markerDataLength - markerCount - nullCount) && getElementByID(this.maps.element.id + '_Secondary_Element')) {
                        getElementByID(this.maps.element.id + '_Secondary_Element').appendChild(markerTemplateEle);
                        if (this.maps.checkInitialRender) {
                            if (currentLayer.markerClusterSettings.allowClustering) {
                                clusterTemplate(currentLayer, markerTemplateEle, this.maps,
                                                layerIndex, this.markerSVGObject, layerElement, false, false);
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (this.maps as any).renderReactTemplates();
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
     */
    public calculateZoomCenterPositionAndFactor(layersCollection: LayerSettings[]): void {
        if (this.maps.zoomSettings.shouldZoomInitially && this.maps.markerModule) {
            let minLong: number; let maxLat: number; let minLat: number; let maxLong: number;
            let latZoom: number; let lngZoom : number; let result: number; let zoomLevel : number;
            let centerLat: number; let centerLong: number; const maxZoomFact: number = this.maps.zoomSettings.maxZoom;
            const mapWidth: number = this.maps.mapAreaRect.width;
            const mapHeight: number = this.maps.mapAreaRect.height;
            this.maps.markerZoomedState =  this.maps.markerZoomedState ? this.maps.markerZoomedState : isNullOrUndefined(this.maps.markerZoomFactor) ?
                !this.maps.markerZoomedState : this.maps.markerZoomFactor > 1 ? this.maps.markerZoomedState : !this.maps.markerZoomedState;
            this.maps.defaultState = this.maps.markerZoomedState ? !this.maps.markerZoomedState : this.maps.defaultState;
            Array.prototype.forEach.call(layersCollection, (currentLayer: LayerSettings, layerIndex: number) => {
                const isMarker: boolean = currentLayer.markerSettings.length !== 0;
                if (isMarker) {
                    Array.prototype.forEach.call(currentLayer.markerSettings, (markerSetting: MarkerSettingsModel, markerIndex: number) => {
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
                    zoomLevel = calculateZoomLevel(minLat, maxLat, minLong, maxLong, mapWidth, mapHeight, this.maps);
                    if (this.maps.isTileMap) {
                        markerFactor = isNullOrUndefined(this.maps.markerZoomFactor) ?
                            zoomLevel : isNullOrUndefined(this.maps.mapScaleValue) ?
                                zoomLevel : this.maps.mapScaleValue > 1 && this.maps.markerZoomFactor !== 1 ?
                                    this.maps.mapScaleValue : zoomLevel;
                    } else {
                        markerFactor = isNullOrUndefined(this.maps.mapScaleValue) ?  zoomLevel :
                            (Math.floor(this.maps.scale) !== 1 &&
                            this.maps.mapScaleValue !==  zoomLevel)
                            &&
                            (isNullOrUndefined(this.maps.shouldZoomCurrentFactor))
                                ? this.maps.mapScaleValue :  zoomLevel;
                        if (((markerFactor === this.maps.mapScaleValue &&
                                (this.maps.markerZoomFactor === 1 || this.maps.mapScaleValue === 1))
                                && (!this.maps.enablePersistence))) {
                            markerFactor =  zoomLevel;
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
                if (!this.maps.enablePersistence){
                    this.maps.mapScaleValue = 1;
                }
            }
            if (this.maps.isTileMap && !this.maps.enablePersistence
                && this.maps.mapScaleValue <= 1) {
                this.maps.tileZoomLevel = this.maps.mapScaleValue === 0 ? 1 : this.maps.mapScaleValue;
                if (this.maps.mapScaleValue === 1 && this.maps.markerZoomFactor === 1) {
                    this.maps.tileTranslatePoint.x = 0;
                    this.maps.tileTranslatePoint.y = 0;
                }
            }
        }
    }
    /**
     * To check and trigger marker click event
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
        const eventArgs: IMarkerClickEventArgs = {
            cancel: false, name: markerClick, data: options.data, maps: this.maps,
            marker: options.marker, target: target, x: e.clientX, y: e.clientY,
            latitude: options.data['latitude'] || options.data['Latitude'],
            longitude: options.data['longitude'] || options.data['Longitude'],
            value: options.data['name']
        };
        this.maps.trigger(markerClick, eventArgs);
    }
    /**
     * To check and trigger Cluster click event
     */
    public markerClusterClick(e: PointerEvent): void {
        const target: string = (e.target as Element).id;
        if (target.indexOf('_LayerIndex_') === -1 || target.indexOf('_cluster_') === -1) {
            return;
        }
        const options: { marker: MarkerSettingsModel, data: object, clusterCollection: MarkerClusterData[], markCollection: object[] } = this.getMarker(target);
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
    private getMarker(target: string): { marker: MarkerSettingsModel, data: any, clusterCollection: MarkerClusterData[], markCollection: any[] } {
        const id: string[] = target.split('_LayerIndex_');
        const index: number = parseInt(id[1].split('_')[0], 10);
        const layer: LayerSettings = <LayerSettings>this.maps.layers[index];
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
            marker = layer.markerSettings[markerIndex];
            if (!isNaN(markerIndex)) {
                data = marker.dataSource[dataIndex];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let collection: any[] = [];
                if (!marker.template && (target.indexOf('_cluster_') > -1) && (this.maps.layers[index].markerClusterSettings.allowClusterExpand)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    Array.prototype.forEach.call(marker.dataSource, (location: any, index: number) => {
                        if (location['latitude'] === data['latitude'] && location['longitude'] === data['longitude']) {
                            collection.push({ data: data, index: index });
                        }
                    });
                }
                if ((target.indexOf('_cluster_') > -1)) {
                    let isClusterSame: boolean = false;
                    const clusterElement: HTMLElement = document.getElementById(target.indexOf('_datalabel_') > -1 ? target.split('_datalabel_')[0] : target);
                    const indexes: number[] = layer.markerClusterSettings.shape === 'Balloon' ? clusterElement.children[0].innerHTML.split(',').map(Number) : clusterElement.innerHTML.split(',').map(Number);
                    collection = [];
                    for (const i of indexes) {
                        collection.push({ data: marker.dataSource[i], index: i });
                        markCollection.push(marker.dataSource[i]);
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
        const eventArgs: IMarkerMoveEventArgs = {
            cancel: false, name: markerMouseMove, data: options.data,
            maps: this.maps, target: targetId, x: e.clientX, y: e.clientY
        };
        this.maps.trigger(markerMouseMove, eventArgs);
    }
    /**
     * To check and trigger cluster move event
     */
    public markerClusterMouseMove(e: PointerEvent): void {
        const targetId: string = (e.target as Element).id;
        if (targetId.indexOf('_LayerIndex_') === -1 || targetId.indexOf('_cluster_') === -1) {
            return;
        }
        const options: { marker: MarkerSettingsModel, data: object, clusterCollection: MarkerClusterData[] } = this.getMarker(targetId);
        if (this.maps.markerClusterExpand) {
            (e.target as Element).setAttribute('style', 'cursor: pointer');
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
     * @param {Maps} maps - Specifies the instance of the map
     * @returns {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
    }
}
