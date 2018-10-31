import { Maps } from '../../index';
import {
    LayerSettings, MarkerSettings, IMarkerRenderingEventArgs, markerRendering,
    MarkerType, convertTileLatLongToPoint, MapLocation
} from '../index';
import { MarkerSettingsModel, IMarkerClickEventArgs, markerClick, IMarkerMoveEventArgs, markerMouseMove } from '../index';
import { isNullOrUndefined, merge, createElement } from '@syncfusion/ej2-base';
import { CircleOption, PathOption, Point, getTranslate, convertGeoToPoint } from '../utils/helper';
import {
    getTemplateFunction, getElementByID, convertElement, calculateShapes, Size, RectOption, Rect, elementAnimate
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
    constructor(maps: Maps) {
        this.maps = maps;
        this.trackElements = [];
    }

    /* tslint:disable:no-string-literal */
    public markerRender(layerElement: Element, layerIndex: number, factor: number): void {
        let templateFn: Function;
        let currentLayer: LayerSettings = <LayerSettings>this.maps.layersCollection[layerIndex];
        this.markerSVGObject = this.maps.renderer.createGroup({ id: this.maps.element.id + '_Markers_Group',
            style: 'pointer-events: auto;' });
        let markerTemplateEle: HTMLElement = createElement('div', {
            id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_Markers_Template_Group',
            className: 'template',
            styles: 'overflow: hidden; position: absolute;pointer-events: none;' +
                'top:' + (this.maps.isTileMap ? 0 : this.maps.mapAreaRect.y) + 'px;' +
                'left:' + (this.maps.isTileMap ? 0 : this.maps.mapAreaRect.x) + 'px;' +
                'height:' + this.maps.mapAreaRect.height + 'px;' +
                'width:' + this.maps.mapAreaRect.width + 'px;'
        });
        currentLayer.markerSettings.map((markerSettings: MarkerSettings, markerIndex: number) => {
            let markerData: Object[] = <Object[]>markerSettings.dataSource;
            markerData.forEach((data: Object, dataIndex: number) => {
                let eventArgs: IMarkerRenderingEventArgs = {
                    cancel: false, name: markerRendering, fill: markerSettings.fill, height: markerSettings.height,
                    width: markerSettings.width, imageUrl: markerSettings.imageUrl, shape: markerSettings.shape,
                    template: markerSettings.template, data: data, maps: this.maps, marker: markerSettings,
                    border: markerSettings.border
                };
                this.maps.trigger(markerRendering, eventArgs);
                let lng: number = data['longitude'];
                let lat: number = data['latitude'];
                let offset: Point = markerSettings.offset;
                if (!eventArgs.cancel && markerSettings.visible && !isNullOrUndefined(lng) && !isNullOrUndefined(lat)) {
                    let markerID: string = this.maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_'
                        + markerIndex + '_DataIndex_' + dataIndex;
                    let location: Point = (this.maps.isTileMap) ? convertTileLatLongToPoint(
                        new MapLocation(lng, lat), factor, this.maps.tileTranslatePoint, true
                    ) : convertGeoToPoint(lat, lng, factor, currentLayer, this.maps);
                    let animate: boolean = currentLayer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
                    let translate: Object = (this.maps.isTileMap) ? new Object() : getTranslate(this.maps, currentLayer, animate);
                    let scale: number = translate['scale'];
                    let transPoint: Point = translate['location'] as Point;
                    if (eventArgs.template) {
                        templateFn = getTemplateFunction(eventArgs.template);
                        if (templateFn && templateFn(this.maps).length) {
                            let templateElement: HTMLCollection = templateFn(this.maps);
                            let markerElement: HTMLElement = <HTMLElement>convertElement(
                                templateElement, markerID, data, markerIndex, this.maps
                            );
                            for (let i: number = 0; i < markerElement.children.length; i++) {
                                (<HTMLElement>markerElement.children[i]).style.pointerEvents = 'none';
                            }
                            markerElement.style.left = ((this.maps.isTileMap ? location.x :
                                ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - location.x)) * scale)) + offset.x) + 'px';
                            markerElement.style.top = ((this.maps.isTileMap ? location.y :
                                ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - location.y)) * scale)) + offset.y) + 'px';
                            markerTemplateEle.appendChild(markerElement);
                        }
                    } else {
                        let shapeCustom: Object = {
                            size: new Size(eventArgs.width, eventArgs.height),
                            fill: eventArgs.fill, borderColor: eventArgs.border.color,
                            borderWidth: eventArgs.border.width, opacity: markerSettings.opacity,
                            dashArray: markerSettings.dashArray
                        };
                        let ele: Element = this.drawSymbol(eventArgs.shape, eventArgs.imageUrl, { x: 0, y: 0 }, markerID, shapeCustom);
                        let x: number = (this.maps.isTileMap ? location.x : (location.x + transPoint.x) * scale) + offset.x;
                        let y: number = (this.maps.isTileMap ? location.y : (location.y + transPoint.y) * scale) + offset.y;
                        ele.setAttribute('transform', 'translate( ' + x + ' ' + y + ' )');
                        this.markerSVGObject.appendChild(ele);
                        let element: string = (markerData.length - 1) === dataIndex ? 'marker' : null;
                        let markerPoint: Point = new Point(x, y);
                        if (markerSettings.animationDuration > 0) {
                            elementAnimate(
                                ele, markerSettings.animationDelay, markerSettings.animationDuration, markerPoint, this.maps, element
                            );
                        }
                    }
                }
            });
        });
        if (this.markerSVGObject.childElementCount > 0) {
            layerElement.appendChild(this.markerSVGObject);
        }
        if (markerTemplateEle.childElementCount > 0 && getElementByID(this.maps.element.id + '_Secondary_Element')) {
            getElementByID(this.maps.element.id + '_Secondary_Element').appendChild(markerTemplateEle);
        }
    }

    public drawSymbol(shape: MarkerType, imageUrl: string, location: Point, markerID: string, shapeCustom: Object): Element {
        let markerEle: Element; let x: number; let y: number;
        let size: Size = <Size>shapeCustom['size'];
        let borderColor: string = shapeCustom['borderColor'];
        let borderWidth: number = parseFloat(shapeCustom['borderWidth']);
        let fill: string = shapeCustom['fill'];
        let dashArray: string = shapeCustom['dashArray'];
        let border: Object = { color: borderColor, width: borderWidth };
        let opacity: number = shapeCustom['opacity'];
        let circleOptions: CircleOption; let pathOptions: PathOption; let rectOptions: RectOption;
        pathOptions = new PathOption(markerID, fill, borderWidth, borderColor, opacity, dashArray, '');
        if (shape === 'Circle') {
            let radius: number = (size.width + size.height) / 4;
            circleOptions = new CircleOption(markerID, fill, border, opacity, location.x, location.y, radius, dashArray);
            markerEle = this.maps.renderer.drawCircle(circleOptions) as SVGCircleElement;
        } else if (shape === 'Rectangle') {
            x = location.x - (size.width / 2);
            y = location.y - (size.height / 2);
            rectOptions = new RectOption(
                markerID, fill, border, opacity, new Rect(x, y, size.width, size.height), null, null, '', dashArray
            );
            markerEle = this.maps.renderer.drawRectangle(rectOptions) as SVGRectElement;
        } else if (shape === 'Image') {
            x = location.x - (size.width / 2);
            y = location.y - (size.height / 2);
            merge(pathOptions, { 'href': imageUrl, 'height': size.height, 'width': size.width, x: x, y: y });
            markerEle = this.maps.renderer.drawImage(pathOptions) as SVGImageElement;
        } else {
            markerEle = calculateShapes(this.maps, shape, pathOptions, size, location, this.markerSVGObject);
        }
        return markerEle;
    }

    /**
     * To check and trigger marker click event
     */
    public markerClick(e: PointerEvent): void {
        let target: string = (e.target as Element).id;
        if (target.indexOf('_LayerIndex_') === -1) {
            return;
        }
        let options: { marker: MarkerSettingsModel, data: object } = this.getMarker(target);
        if (isNullOrUndefined(options)) {
            return;
        }
        let eventArgs: IMarkerClickEventArgs = {
            cancel: false, name: markerClick, data: options.data, maps: this.maps, marker: options.marker,
            target: target, x: e.clientX, y: e.clientY
        };
        this.maps.trigger(markerClick, eventArgs);
    }
    /**
     * To get marker from target id
     */
    private getMarker(target: string): { marker: MarkerSettingsModel, data: object } {
        let id: string[] = target.split('_LayerIndex_');
        let index: number = parseInt(id[1].split('_')[0], 10);
        let layer: LayerSettings = <LayerSettings>this.maps.layers[index];
        let data: object;
        let marker: MarkerSettingsModel;
        if (target.indexOf('_MarkerIndex_') > -1) {
            let markerIndex: number = parseInt(id[1].split('_MarkerIndex_')[1].split('_')[0], 10);
            let dataIndex: number = parseInt(id[1].split('_DataIndex_')[1].split('_')[0], 10);
            marker = layer.markerSettings[markerIndex];
            if (!isNaN(markerIndex)) {
                data = marker.dataSource[dataIndex];
                return { marker: marker, data: data };
            }
        }
        return null;
    }
    /**
     * To check and trigger marker move event
     */
    public markerMove(e: PointerEvent): void {
        let targetId: string = (e.target as Element).id;
        if (targetId.indexOf('_LayerIndex_') === -1) {
            return;
        }
        let options: { marker: MarkerSettingsModel, data: object } = this.getMarker(targetId);
        if (isNullOrUndefined(options)) {
            return;
        }
        let eventArgs: IMarkerMoveEventArgs = {
            cancel: false, name: markerMouseMove, data: options.data, maps: this.maps,
            target: targetId, x: e.clientX, y: e.clientY
        };
        this.maps.trigger(markerMouseMove, eventArgs);
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
