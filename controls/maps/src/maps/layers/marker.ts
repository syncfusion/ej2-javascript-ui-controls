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
    markerColorChoose, markerShapeChoose, calculateZoomLevel, compareZoomFactor
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

    /* tslint:disable:no-string-literal */
    public markerRender(layerElement: Element, layerIndex: number, factor: number, type: string): void {
        let templateFn: Function;
        let markerCount: number = 0;
        let markerTemplateCount: number = 0;
        let currentLayer: LayerSettings = <LayerSettings>this.maps.layersCollection[layerIndex];
        this.markerSVGObject = this.maps.renderer.createGroup({
            id: this.maps.element.id + '_Markers_Group',
            style: 'pointer-events: auto;'
        });
        let markerTemplateEle: HTMLElement = createElement('div', {
            id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_Markers_Template_Group',
            className: 'template',
            styles: 'overflow: hidden; position: absolute;pointer-events: none;' +
                'top:' + this.maps.mapAreaRect.y + 'px;' +
                'left:' + this.maps.mapAreaRect.x + 'px;' +
                'height:' + this.maps.mapAreaRect.height + 'px;' +
                'width:' + this.maps.mapAreaRect.width + 'px;'
        });
        //tslint:disable
        currentLayer.markerSettings.map((markerSettings: MarkerSettings, markerIndex: number) => {
            let markerData: Object[] = <Object[]>markerSettings.dataSource;
            Array.prototype.forEach.call(markerData, (data: Object, dataIndex: number) => {
                this.maps.markerNullCount = markerIndex > 0 && dataIndex === 0 ? 0 : this.maps.markerNullCount;
                let eventArgs: IMarkerRenderingEventArgs = {
                    cancel: false, name: markerRendering, fill: markerSettings.fill, height: markerSettings.height,
                    width: markerSettings.width, imageUrl: markerSettings.imageUrl, shape: markerSettings.shape,
                    template: markerSettings.template, data: data, maps: this.maps, marker: markerSettings,
                    border: markerSettings.border, colorValuePath: markerSettings.colorValuePath,
                    shapeValuePath: markerSettings.shapeValuePath, imageUrlValuePath: markerSettings.imageUrlValuePath
                };
                eventArgs = markerColorChoose(eventArgs, data);
                eventArgs = markerShapeChoose(eventArgs, data);
                if (this.maps.isBlazor) {
                    const { maps, marker, ...blazorEventArgs }: IMarkerRenderingEventArgs = eventArgs;
                    eventArgs = blazorEventArgs;
                }
                this.maps.trigger('markerRendering', eventArgs, (MarkerArgs: IMarkerRenderingEventArgs) => {
                    if (markerSettings.colorValuePath !== eventArgs.colorValuePath ) {
                        eventArgs = markerColorChoose(eventArgs, data);
                    }
                    if (markerSettings.shapeValuePath !== eventArgs.shapeValuePath ) {
                        eventArgs = markerShapeChoose(eventArgs, data);
                    }
                    let lng: number = !isNullOrUndefined(data['longitude']) ? parseFloat(data['longitude']) : null;
                    let lat: number = !isNullOrUndefined(data['latitude']) ? parseFloat(data['latitude']) : null;
                    if (this.maps.isBlazor) {
                        let data1: Object = {};
                        let text: string[] = [];
                        let j: number = 0;
                        for (let i: number = 0; i < Object.keys(data).length; i++) {
                            if (Object.keys(data)[i].toLowerCase() !== 'latitude' && Object.keys(data)[i].toLowerCase() !== 'longitude'
                                && Object.keys(data)[i].toLowerCase() !== 'name' && Object.keys(data)[i].toLowerCase() !== 'blazortemplateid'
                                && Object.keys(data)[i].toLowerCase() !== 'text') {
                                text[j] = data[Object.keys(data)[i].toLowerCase()];
                                data1['text'] = text;
                                j++;
                            }
                        }
                        data['text'] = data1['text'];
                    }
                    let offset: Point = markerSettings.offset;
                    if (!eventArgs.cancel && markerSettings.visible && !isNullOrUndefined(lng) && !isNullOrUndefined(lat)) {
                        let markerID: string = this.maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_'
                            + markerIndex + '_dataIndex_' + dataIndex;
                        let location: Point = (this.maps.isTileMap) ? convertTileLatLongToPoint(
                            new MapLocation(lng, lat), factor, this.maps.tileTranslatePoint, true
                        ) : convertGeoToPoint(lat, lng, factor, currentLayer, this.maps);
                        let animate: boolean = currentLayer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
                        let translate: Object = (this.maps.isTileMap) ? new Object() :
                            !isNullOrUndefined(this.maps.zoomModule) && this.maps.zoomSettings.zoomFactor > 1 ?
                                getZoomTranslate(this.maps, currentLayer, animate) :
                                getTranslate(this.maps, currentLayer, animate);
                        let scale: number = type === 'AddMarker' ? this.maps.scale : translate['scale'];
                        let transPoint: Point = type === 'AddMarker' ? this.maps.translatePoint : translate['location'] as Point;
                        if (eventArgs.template) {
                            markerTemplateCount++;
                            markerTemplate(eventArgs, templateFn, markerID, data, markerIndex, markerTemplateEle, location,
                                scale, offset, this.maps);
                        } else {
                            markerCount++;
                            marker(eventArgs, markerSettings, markerData, dataIndex,
                                location, transPoint, markerID, offset, scale, this.maps, this.markerSVGObject);
                        }
                    }
                    markerTemplateCount += (eventArgs.cancel) ? 1 : 0;
                    markerCount += (eventArgs.cancel) ? 1 : 0;
                    this.maps.markerNullCount = (isNullOrUndefined(lng) || isNullOrUndefined(lat))
                        ? this.maps.markerNullCount + 1 : this.maps.markerNullCount;
                    let markerDataLength: number = markerData.length - this.maps.markerNullCount;
                    if (this.markerSVGObject.childElementCount === (markerDataLength - markerTemplateCount) && (type !== 'Template')) {
                        layerElement.appendChild(this.markerSVGObject);
                        if (currentLayer.markerClusterSettings.allowClustering) {
                            this.maps.svgObject.appendChild(this.markerSVGObject);
                            this.maps.element.appendChild(this.maps.svgObject);
                            clusterTemplate(currentLayer, this.markerSVGObject,
                                this.maps, layerIndex, this.markerSVGObject, layerElement, true, false);
                        }
                    }
                    if (markerTemplateEle.childElementCount === (markerData.length - markerCount) && getElementByID(this.maps.element.id + '_Secondary_Element')) {
                        getElementByID(this.maps.element.id + '_Secondary_Element').appendChild(markerTemplateEle);
                        if (currentLayer.markerClusterSettings.allowClustering) {
                            clusterTemplate(currentLayer, markerTemplateEle, this.maps,
                                layerIndex, this.markerSVGObject, layerElement, false, false);
                        }
                    }
                });
            });
        });
    }
    /**
     * To find zoom level for individual layers like India, USA.
     */ 
    private calculateIndividualLayerMarkerZoomLevel(mapWidth : number, mapHeight : number, 
        maxZoomFact : number): number {
        let latZoom: number; let lngZoom : number; let result: number; let scaleFactor : number;
        let height : number =  Math.abs(this.maps.baseMapBounds.latitude.max - this.maps.baseMapBounds.latitude.min);
        let width : number = Math.abs(this.maps.baseMapBounds.longitude.max - this.maps.baseMapBounds.longitude.min);
        latZoom = Math.floor(Math.log(mapHeight / height));
        latZoom = (latZoom > maxZoomFact) ? maxZoomFact : latZoom;
        lngZoom = Math.floor(Math.log(mapWidth / width));
        lngZoom = (lngZoom > maxZoomFact) ? maxZoomFact : lngZoom;
        result = Math.min(latZoom, lngZoom);
        scaleFactor = Math.min(result, maxZoomFact - 1);
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
            let centerLat: number; let centerLong: number; let maxZoomFact = 10;
            let mapWidth: number = this.maps.mapAreaRect.width;
            let mapHeight: number = this.maps.mapAreaRect.height; 
            let scaleFactor : number;
            Array.prototype.forEach.call(layersCollection, (currentLayer: LayerSettings, layerIndex: number) => {
                let isMarker: boolean = currentLayer.markerSettings.length !== 0;
                if (isMarker) {
                    Array.prototype.forEach.call(currentLayer.markerSettings, (markerSetting: MarkerSettingsModel, markerIndex: number) => {
                        let markerData: Object[] = <Object[]>markerSetting.dataSource;
                        Array.prototype.forEach.call(markerData, (data: Object, dataIndex: number) => {
                            let latitude: number = !isNullOrUndefined(data['latitude']) ? parseFloat(data['latitude']) : null;
                            let longitude: number = !isNullOrUndefined(data['longitude']) ? parseFloat(data['longitude']) : null;
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
                let markerFactor: number;
                if (this.maps.isTileMap || this.maps.baseMapRectBounds['min']['x'] === 0) {
                    zoomLevel = calculateZoomLevel(minLat, maxLat, minLong, maxLong, mapWidth, mapHeight, this.maps);
                    if(this.maps.isTileMap) {
                        markerFactor = isNullOrUndefined(this.maps.markerZoomFactor) ?
                        zoomLevel : isNullOrUndefined(this.maps.mapScaleValue) ?
                        zoomLevel : this.maps.mapScaleValue > 1 && this.maps.markerZoomFactor !== 1? 
                        this.maps.mapScaleValue : zoomLevel;
                    } else {
                        markerFactor = isNullOrUndefined(this.maps.mapScaleValue) ?  zoomLevel :
                        (Math.floor(this.maps.scale) !== 1 &&
                            this.maps.mapScaleValue !==  zoomLevel) 
                            && 
                            (isNullOrUndefined(this.maps.shouldZoomCurrentFactor))
                            ? this.maps.mapScaleValue :  zoomLevel;
                        if(((markerFactor === this.maps.mapScaleValue &&
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
            if(this.maps.markerZoomFactor > 1) {
                this.maps.markerCenterLatitude = null;
                this.maps.markerCenterLongitude = null;
                this.maps.markerZoomFactor = 1;
                if(!this.maps.enablePersistence){
                    this.maps.mapScaleValue = 1;
                }
            }
            if(this.maps.isTileMap && !this.maps.enablePersistence  
                && this.maps.mapScaleValue <= 1) {
                this.maps.tileZoomLevel = this.maps.mapScaleValue === 0 ? 1 : this.maps.mapScaleValue;
                if(this.maps.mapScaleValue === 1 && this.maps.markerZoomFactor === 1) {
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
        let target: string = (e.target as Element).id;
        if (target.indexOf('_LayerIndex_') === -1 || target.indexOf('_cluster_') > 0) {
            return;
        }
        let options: { marker: MarkerSettingsModel, data: object } = this.getMarker(target);
        if (isNullOrUndefined(options)) {
            return;
        }
        let eventArgs: IMarkerClickEventArgs = {
            cancel: false, name: markerClick, data: options.data, maps: this.maps,
            marker: options.marker, target: target, x: e.clientX, y: e.clientY,
            latitude: options.data["latitude"] || options.data["Latitude"],
            longitude: options.data["longitude"] || options.data["Longitude"],
            value: options.data["name"]
        };
        if (this.maps.isBlazor) {
            const { maps, marker, data, ...blazorEventArgs }: IMarkerClickEventArgs = eventArgs;
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerClick, eventArgs);
    }
    /**
     * To check and trigger Cluster click event
     */
    public markerClusterClick(e: PointerEvent): void {
        let target: string = (e.target as Element).id;
        if (target.indexOf('_LayerIndex_') === -1 || target.indexOf('_cluster_') === -1) {
            return;
        }
        let options: { marker: MarkerSettingsModel, data: object, clusterCollection: MarkerClusterData[] } = this.getMarker(target);
        if (isNullOrUndefined(options)) {
            return;
        }
        if ((options.clusterCollection.length > 0) && options.clusterCollection[0].isClusterSame) {
            if (getElement(this.maps.element.id + '_mapsTooltip') &&
                this.maps.mapsTooltipModule.tooltipTargetID.indexOf('_MarkerIndex_') > -1) {
                removeElement(this.maps.element.id + '_mapsTooltip');
            }
            if (this.sameMarkerData.length > 0) {
                mergeSeparateCluster(this.sameMarkerData, this.maps, this.markerSVGObject);
            }
            this.sameMarkerData = options.clusterCollection;
            clusterSeparate(this.sameMarkerData, this.maps, this.markerSVGObject, true);
        }
        let eventArgs: IMarkerClusterClickEventArgs = {
            cancel: false, name: markerClusterClick, data: options, maps: this.maps,
            target: target, x: e.clientX, y: e.clientY,
            latitude: options.data["latitude"] || options.data["Latitude"], longitude: options.data["longitude"] || options.data["Longitude"]
        };
        if (this.maps.isBlazor) {
            const { maps, data, ...blazorEventArgs }: IMarkerClusterClickEventArgs = eventArgs;
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerClusterClick, eventArgs);
    }
    /**
     * To get marker from target id
     */
    private getMarker(target: string): { marker: MarkerSettingsModel, data: object, clusterCollection: MarkerClusterData[] } {
        let id: string[] = target.split('_LayerIndex_');
        let index: number = parseInt(id[1].split('_')[0], 10);
        let layer: LayerSettings = <LayerSettings>this.maps.layers[index];
        let data: object;
        let clusterCollection: MarkerClusterData[] = [];
        let marker: MarkerSettingsModel;
        if (target.indexOf('_MarkerIndex_') > -1) {
            let markerIndex: number = parseInt(id[1].split('_MarkerIndex_')[1].split('_')[0], 10);
            let dataIndex: number = parseInt(id[1].split('_dataIndex_')[1].split('_')[0], 10);
            marker = layer.markerSettings[markerIndex];
            if (!isNaN(markerIndex)) {
                data = marker.dataSource[dataIndex];
                let collection: Object[] = [];
                if (!marker.template && (target.indexOf('_cluster_') > -1) && (this.maps.layers[index].markerClusterSettings.allowClusterExpand)) {
                    Array.prototype.forEach.call(marker.dataSource, (location, index) => {
                        if (location['latitude'] === data['latitude'] && location['longitude'] === data['longitude']) {
                            collection.push({ data: data, index: index });
                        }
                    });
                }
                if ((target.indexOf('_cluster_') > -1)) {
                    let textElement = document.getElementById(target.indexOf('_datalabel_') > -1 ? target : target + '_datalabel_' + target.split('_cluster_')[1]);
                    let isClusterSame: boolean = false;
                    if (+textElement.textContent === collection.length) {
                        isClusterSame = true;
                    } else {
                        let clusterElement = document.getElementById(target.indexOf('_datalabel_') > -1 ? target.split('_datalabel_')[0] : target);
                        let indexes: number[] = clusterElement.innerHTML.split(',').map(Number);
                        collection = [];
                        for (let i of indexes) {
                            collection.push({ data: marker.dataSource[i], index: i });
                        }
                        isClusterSame = false;
                    }
                    clusterCollection.push(<MarkerClusterData>{
                        data: collection, layerIndex: index, markerIndex: markerIndex,
                        targetClusterIndex: +(target.split('_cluster_')[1].indexOf('_datalabel_') > -1 ? target.split('_cluster_')[1].split('_datalabel_')[0] : target.split('_cluster_')[1]),
                        isClusterSame: isClusterSame
                    });
                }
                return { marker: marker, data: data, clusterCollection: clusterCollection };
            }
        }
        return null;
    }
    /**
     * To check and trigger marker move event
     */
    public markerMove(e: PointerEvent): void {
        let targetId: string = (e.target as Element).id;
        if (targetId.indexOf('_LayerIndex_') === -1 || targetId.indexOf('_cluster_') > 0) {
            return;
        }
        let options: { marker: MarkerSettingsModel, data: object } = this.getMarker(targetId);
        if (isNullOrUndefined(options)) {
            return;
        }
        let eventArgs: IMarkerMoveEventArgs = {
            cancel: false, name: markerMouseMove, data: options.data,
            maps: this.maps, target: targetId, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            const { maps, ...blazorEventArgs }: IMarkerMoveEventArgs = eventArgs;
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerMouseMove, eventArgs);
    }
    /**
     * To check and trigger cluster move event
     */
    public markerClusterMouseMove(e: PointerEvent): void {
        let targetId: string = (e.target as Element).id;
        if (targetId.indexOf('_LayerIndex_') === -1 || targetId.indexOf('_cluster_') === -1) {
            return;
        }
        let options: { marker: MarkerSettingsModel, data: object, clusterCollection: MarkerClusterData[] } = this.getMarker(targetId);
        if (options.clusterCollection[0].isClusterSame) {
            (e.target as Element).setAttribute('style', 'cursor: pointer');
        }
        if (isNullOrUndefined(options)) {
            return;
        }
        let eventArgs: IMarkerClusterMoveEventArgs = {
            cancel: false, name: markerClusterMouseMove, data: options.data, maps: this.maps,
            target: targetId, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            const { maps, ...blazorEventArgs }: IMarkerClusterMoveEventArgs = eventArgs;
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerClusterMouseMove, eventArgs);
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'Marker';
    }

    /**
     * To destroy the layers. 
     * @return {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
    }
}