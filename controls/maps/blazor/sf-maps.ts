/**
 * Maps Blazor introp module
 */
import { BlazorDotnetObject, EventHandler, Animation, Browser, AnimationOptions, isNullOrUndefined } from '@syncfusion/ej2-base';
const rect: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
class Size {
    public height: number;
    public width: number;
}
class AreaRect {
    public height: number;
    public width: number;
    public x: number;
    public y: number;
}
class MarkerClusterData {
    public data: Object[];
    public layerIndex: number;
    public markerIndex: number;
    public dataIndex: number;
    public targetClusterIndex: number;
    public isClusterSame: boolean;
}
class BaseMapBound {
    // tslint:disable
    public latitudeMin: number;
    public longitudeMin: number;
    public latitudeMax: number;
    public longitudeMax: number;
    public minBounds: any;
    public maxBounds: any;
    public availableSize: any;
}
class MapLocation {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
class LatLog {
    public latitude: number;
    public longitude: number;
}
class PathOption {
    public id: string;
    public opacity: number;
    public fill?: string;
    public stroke: string;
    public strokeWidth?: number;
    public strokeDasharray?: string;
    public d: string;
}
class NaviagtionInfo {
    public latitude: number[];
    public longitude: number[];
    public angle: number;
}
class TileAttribute {
    public x: number;
    public y: number;
    public top: number;
    public left: number;
    public width: number;
    public height: number;
    public src: string;
}
function createGroup(id: string): Element {
    let group: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', id);
    return group;
}
// tslint:disable-next-line
function calculateShape(shape: any, size: Size, location: MapLocation): string {
    let path: string = '';
    switch (shape) {
        case 'Balloon':
            path = 'M15,0C8.8,0,3.8,5,3.8,11.2C3.8,17.5,9.4,24.4,15,30c5.6-5.6,11.2-12.5,11.2-18.8C26.2,5,21.2,0,15,0z M15,16' +
                    'c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S17.8,16,15,16z';
            break;
        case 'Cross':
            path = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' + (location.y + size.height
                / 2) + ' M ' + (location.x - size.width / 2) + ' ' + location.y + ' L ' + (location.x + size.width / 2) + ' ' + location.y;
            break;
        case 'Diamond':
            path = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + (location.x + size.width / 2) + ' '
                + location.y + ' L ' + location.x + ' ' + (location.y + size.height / 2) + ' L ' + (location.x - size.width / 2)
                + ' ' + location.y + ' Z';
            break;
        case 'Star':
            path = 'M ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + (location.x - size.width / 2)
                + ' ' + (location.y + size.height / 6) + ' L ' + (location.x + size.width / 2) + ' ' + (location.y + size.height / 6)
                + ' L ' + (location.x - size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' +
                (location.y + size.height / 2) + ' L ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' Z';
            break;
        case 'Triangle':
            path = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + (location.x + size.width / 2) + ' ' +
                (location.y + size.height / 2) + ' L ' + (location.x - size.width / 2) + ' ' + (location.y + size.height / 2) + ' Z';
            break;
        case 'HorizontalLine':
            path = ' M ' + (location.x - size.width / 2) + ' ' + location.y + ' L ' + (location.x + size.width / 2) + ' '
                + location.y;
            break;
        case 'VerticalLine':
            path = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' +
                (location.y + size.height / 2);
            break;
        case 'InvertedTriangle':
            path = 'M ' + (location.x - size.width / 2) + ' ' + (location.y - size.height / 2) +
                ' L ' + (location.x + size.width / 2) + ' ' +
                (location.y - size.height / 2) + ' L ' + (location.x) + ' ' + (location.y + size.height / 2) + ' Z';
            break;
        case 'Pentagon':
            let factor: number = 72;
            let xValue: number;
            let yValue: number;
            for (let i: number = 0; i < 5; i++) {
                xValue = (size.width / 2) * Math.cos((Math.PI / 180) * (i * factor));
                yValue = (size.height / 2) * Math.sin((Math.PI / 180) * (i * factor));
                path += (i === 0 ? 'M ' : 'L ') + (location.x + xValue) + ' ' + (location.y + yValue);
            }
            path += ' Z';
            break;
    }
    return path;
}
interface BlazorMapsElement extends HTMLElement {
    blazor__instance: SfMaps;
}
interface IMapsOptions {
    // tslint:disable
    doubleClickZoom: boolean;
    tooltipDisplayMode: string;
    zoomOnClick: boolean;
    shapeTranslatePoint: MapLocation;
    enableZoom: boolean;
    enableSelectionZooming: boolean;
    selectionSettings: any[];
    legendSettings: number;
    enablePanning: boolean;
    enablePinchZooming: boolean;
    layerHighlightSettings: any[];
    markerHighlightSettings: any;
    bubbleHighlightSettings: any;
    navigationHighlightSettings: any;
    factor: number;
    layerCount: number;
    maxZoom: number;
    minZoom: number;
    dataSource: any;
    markerCluster: any;
    urlTemplate: any;
    shapeBorderWidth: number;
    projectionType: any;
}
class SfMaps {
    // tslint:disable
    public id: string;
    public options: any;
    public dotNetRef: BlazorDotnetObject;
    public moveClientX: number;
    public moveClientY: number;
    public clientX: number;
    public clientY: number;
    public allowPanning: boolean = false;
    public isPanning: boolean = false;
    public zoomClick: boolean = false;
    public mouseClick: boolean = false;
    public position: MapLocation = null;
    public height: number = 0;
    public width: number = 0;
    public markerClusterExpandCheck: boolean = false;
    public sameMarkerData: MarkerClusterData[];
    public startValue: MapLocation;
    public svgCreated: boolean = false;
    public zoomIn: number = 1;
    public zoomOut: number = 1;
    public scaleFactor: number = 1;
    public factorCount: number = 0;
    public svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    public lastScale: number = 1;
    public isTouch: boolean = false;
    public touchMoveList: any[] = [];
    public touchStartList: any[] = [];
    public isTileMap: boolean;
    public newTiles: any[] = [];
    public shapeTranslatePoint: MapLocation;
    public tileTranslatePoint: MapLocation = null;
    public isToolbarTooltip: boolean = false;
    public translatePoint: MapLocation;
    public horizontalPanXCount: number;
    public horizontalPan: boolean;
    public tileZoomLevel: number;
    public urlTemplate: string;
    public x: number;
    public y: number;
    public baseMapBounds: BaseMapBound;
    public areaRect: AreaRect;
    public marginTop: number = 0;
    public marginLeft: number = 0;
    public navigation: any;
    public dataSource: any;
    public individualId: string;
    public labelCollection: any;
    public projectionType: any;
    public bubbleCollection: any;
    public element: BlazorMapsElement;
    public shapeBorderWidth: number;
    public pinchFactor: number;
    public layerCount: number;
    public clusterSettings: any;
    public previousScale: number;
    public previousPoint: MapLocation;
    private exportedCount: number;
    private isPinchZoomed: boolean = false;
    public previousWidth: number;
    public previousHeight: number;
    public key: string;
    public panComplete: boolean = false;
    public pinchComplete: boolean = false;
    constructor(id: string, element: BlazorMapsElement, options: any, dotnetRef: BlazorDotnetObject) {
        this.id = id;
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.layerCount = options.layerCount;
        this.clusterSettings = options.markerCluster ? JSON.parse(options.markerCluster) : null;
        this.dataSource = options.dataSource ? JSON.parse(options.dataSource) : null;
        this.navigation = options.navigationSettings ? JSON.parse(options.navigationSettings) : null;
        this.shapeTranslatePoint = options.shapeTranslatePoint ? options.shapeTranslatePoint : null;
        this.shapeBorderWidth = options.shapeBorderWidth;
        this.projectionType = options.projectionType;
        this.options = options;
        this.options.layerHighlightSettings = JSON.parse(this.options.layerHighlightSettings);
        this.options.markerHighlightSettings = JSON.parse(this.options.markerHighlightSettings);
        this.options.bubbleHighlightSettings = JSON.parse(this.options.bubbleHighlightSettings);
        this.options.navigationHighlightSettings = JSON.parse(this.options.navigationHighlightSettings);
        this.options.selectionSettings = JSON.parse(this.options.selectionSettings);
        this.element.blazor__instance = this;
        this.marginLeft = 0;
        this.urlTemplate = options.urlTemplate ? options.urlTemplate : null;
        this.newTiles = [];
        this.isToolbarTooltip = false;
        this.isTouch = false;
        this.pinchFactor = 1;
        this.lastScale = 1;
        this.touchStartList = [];
        this.touchMoveList = [];
    }
    public wireEvents(): void {
        EventHandler.add(this.element, 'mousewheel', this.mapMouseWheel.bind(this), this);
        EventHandler.add(this.element, 'touchmove mousemove', this.mouseMove.bind(this), this);
        EventHandler.add(this.element, 'touchend mouseup', this.mouseUp.bind(this), this);
        EventHandler.add(this.element, 'touchstart mousedown', this.mouseDown.bind(this), this);
        EventHandler.add(this.element, 'click', this.click.bind(this), this);
        EventHandler.add(this.element, 'dblclick', this.doubleClick.bind(this), this);
        EventHandler.add(this.element, 'contextmenu', this.rightClick.bind(this), this);
        window.addEventListener('resize', this.reSize.bind(this));
    }
    private rightClick(event): void {
        let id:string = event.target['id'];
        let clientValue: any = this.getMousePosition(event.pageX, event.pageY);
        this.dotNetRef.invokeMethodAsync('TriggerMouseClick', clientValue.x, clientValue.y, document.getElementById(id));
    }
    private reSize(): void {
        let width: number;
        let height: number;
        if (this.element !== null) {
            width = this.element.getBoundingClientRect().width;
            height = this.element.getBoundingClientRect().height;
        }
        if (this.previousHeight != height || this.previousWidth != width) {
            this.previousHeight = height;
            this.previousWidth = width;
            this.dotNetRef.invokeMethodAsync('TriggerResize', width, height);
        }
    }
    /* tslint:disable:no-string-literal */
    // tslint:disable-next-line:max-line-length
    private doubleClick(event: MouseEvent): void {
        if (event.detail === 2 && this.options.doubleClickZoom) {
            let parentElement: ClientRect = document.getElementById(this.id).getBoundingClientRect();
            let factor: number = this.scaleFactor + 1;
            if (factor >= 1) {
                this.scaleFactor = factor;
                this.removeCluster();
                this.dotNetRef.invokeMethodAsync('MouseWheelZoom', event.pageX - parentElement['x'], event.pageY - parentElement['y'],
                    event.detail, event.which, 'doubleClick');
            }
        }
        let id: string = event.target['id'];
        let clientValue: MapLocation = this.getMousePosition(event.pageX, event.pageY);
        if (this.options.tooltipDisplayMode === 'DoubleClick') {
            let layerIndex: number = parseInt(id.split('_LayerIndex_')[1].split('_')[0], 10);
            if (id.indexOf('shapeIndex') > -1) {
                let shapeIndex: number = parseInt(id.split('_shapeIndex_')[1].split('_')[0], 10);
                this.dotNetRef.invokeMethodAsync('TriggerShapeTooltip', id, clientValue.x, clientValue.y, layerIndex, shapeIndex,
                    'Shape', 0);
            } else if (id.indexOf('_MarkerIndex_') > -1 && id.indexOf('_cluster_') === -1) {
                let markerIndex: number = parseInt(id.split('_MarkerIndex_')[1].split('_')[0], 10);
                let dataIndex: number = parseInt(id.split('_dataIndex_')[1].split('_')[0], 10);
                this.dotNetRef.invokeMethodAsync('TriggerShapeTooltip', id, clientValue.x, clientValue.y, layerIndex, dataIndex,
                    'Marker', markerIndex);
            } else if (id.indexOf('_BubbleIndex_') > -1) {
                let markerIndex: number = parseInt(id.split('_BubbleIndex_')[1].split('_')[0], 10);
                let dataIndex: number = parseInt(id.split('_dataIndex_')[1].split('_')[0], 10);
                this.dotNetRef.invokeMethodAsync('TriggerShapeTooltip', id, clientValue.x, clientValue.y, layerIndex, dataIndex,
                    'Bubble', markerIndex);
            } else if (id.indexOf('_shapeIndex_') === -1 && id.indexOf('_MarkerIndex_') === -1 && id.indexOf('_BubbleIndex_') === -1) {
                this.dotNetRef.invokeMethodAsync('TriggerShapeTooltip', '', clientValue.x, clientValue.y, 0, 0, '', 0);
            }
        }
        this.dotNetRef.invokeMethodAsync('TriggerDoubleClick', clientValue.x, clientValue.y, document.getElementById(id));
    }
    private mapMouseWheel(event: MouseEvent): void {
        event.preventDefault();
        let parentElement: ClientRect = document.getElementById(this.element.id).getBoundingClientRect();
        let direction: string = (event['wheelDelta'] / 120) > 0 ? 'ZoomIn' : 'ZoomOut';
        let factor: number = direction === 'ZoomIn' ? this.scaleFactor + 1 : this.scaleFactor - 1;
        if (factor >= 1) {
            this.scaleFactor = factor;
            this.removeCluster();
            this.dotNetRef.invokeMethodAsync('MouseWheelZoom', event.pageX - parentElement['x'], event.pageY - parentElement['y'],
                event.detail, event['wheelDelta'], 'wheelZoom');
        }
    }
    //tslint:disable:max-func-body-length
    // tslint:disable-next-line:max-line-length
    private mouseUp(event: MouseEvent): void {
        let id: string = event.target['id'];
        let layerX: number; let layerY: number;
        let translatePoint : MapLocation = this.isTileMap ? this.tileTranslatePoint : this.shapeTranslatePoint;
        this.lastScale = 1;
        if (event.type === 'touchend') {
            event.preventDefault();
            layerX = 0;
            layerY = 0;
            this.isTouch = false;
            this.touchMoveList = [];
            this.touchStartList = [];
        } else {
            this.moveClientX = event.pageX;
            this.moveClientY = event.pageY;
            layerX = event['layerX'];
            layerY = event['layerY'];
        }
        let clientValue: MapLocation = this.getMousePosition(this.moveClientX, this.moveClientY);
        this.moveClientX = clientValue.x;
        this.moveClientY = clientValue.y;
        let parentId: string = id.split('_')[0];
        if (!(id.indexOf('_Zooming_') > -1) && this.options.zoomOnClick && !this.isPanning) {
            let factor: number = this.scaleFactor + 1;
            if (factor >= 1) {
                this.scaleFactor = factor;
                this.removeCluster();
                let eventValues: MapLocation = this.getMousePosition(event.pageX, event.pageY);
                this.dotNetRef.invokeMethodAsync('MouseWheelZoom', eventValues.x, eventValues.y, event.detail, event.which, 'click');
            }
        }
        if (this.allowPanning && this.isPanning && this.options['enablePanning']) {
            if (this.isTileMap) {
                for (let i: number = 0; i < this.newTiles.length; i++) {
                    let divElement: HTMLElement = document.getElementById(this.element.id + 'tile' + this.newTiles[i]);
                    divElement.parentNode.removeChild(divElement);
                }
            }
            this.newTiles = [];
            // tslint:disable:max-line-length 
            this.dotNetRef.invokeMethodAsync('UpdateTranslatePoint', this.shapeTranslatePoint, this.tileTranslatePoint, this.scaleFactor, false);
            if (this.panComplete) {
                this.dotNetRef.invokeMethodAsync('TriggerPanningComplete', this.previousPoint.x, this.previousPoint.y, translatePoint.x, translatePoint.y, this.scaleFactor);
            }
        }
        if (this.isPinchZoomed) {
            this.isPinchZoomed = false;
            // tslint:disable:max-line-length 
            this.dotNetRef.invokeMethodAsync('UpdateTranslatePoint', this.shapeTranslatePoint, this.tileTranslatePoint, this.scaleFactor, true);
            if (this.pinchComplete) {
                this.dotNetRef.invokeMethodAsync('TriggerOnZoomComplete', translatePoint.x, translatePoint.y, this.scaleFactor);
            }
        }
        this.isPanning = false;
        this.allowPanning = false;
        if (this.options.enableZoom && this.options.enableSelectionZooming && (this.mouseClick && this.zoomClick)) {
            this.svgCreated = false;
            this.mouseClick = false;
            let rectElement: HTMLElement = document.getElementById(this.element.id + 'drawRect');
            if (rectElement) {
                rectElement.remove();
                this.removeCluster();
                let zoomFactor: number = 0;
                if (this.height > 0 && this.width > 0) {
                    let size: ClientRect = this.element.getBoundingClientRect();
                    if (!this.isTileMap) {
                        zoomFactor = this.scaleFactor + Math.round(((size.width / this.width) + (size.height / this.height)) / 2);
                    } else {
                        zoomFactor = this.scaleFactor + Math.round(this.scaleFactor + (((size.width / this.width) +
                            (size.height / this.height)) / 2));
                        zoomFactor -= 2;
                    }
                    this.scaleFactor = zoomFactor;
                }
                if (zoomFactor >= 1) {
                    this.dotNetRef.invokeMethodAsync('TriggerZoomSelection', this.position.x, this.position.y, this.height, this.width);
                }
            }
        }
        if (id.indexOf('_LayerIndex_') > -1) {
            let layerIndex: number;
            let shapeIndex: number;
            let dataIndex: number;
            let bubbleIndex: number;
            let navigationIndex: number;
            layerIndex = parseInt(id.split('_LayerIndex_')[1].split('_')[0], 10);
            if (id.indexOf('shapeIndex') > -1) {
                shapeIndex = parseInt(id.split('_shapeIndex_')[1].split('_')[0], 10);
                dataIndex = id.indexOf('_dataIndex_') !== -1 ? parseInt(id.split('_dataIndex_')[1].split('_')[0], 10) : null;
                if (this.options.selectionSettings && this.options.selectionSettings[layerIndex] &&
                    this.options.selectionSettings[layerIndex]['Enable']) {
                    this.removeAllHighlight();
                }
                this.dotNetRef.invokeMethodAsync('SelectMap', id, layerIndex, shapeIndex, 'Shape', dataIndex);
            }
            if (id.indexOf('_BubbleIndex_') > -1) {
                bubbleIndex = parseInt(id.split('_BubbleIndex_')[1].split('_')[0], 10);
                dataIndex = id.indexOf('_dataIndex_') !== -1 ? parseInt(id.split('_dataIndex_')[1].split('_')[0], 10) : null;
                this.removeAllHighlight();
                this.dotNetRef.invokeMethodAsync('SelectMap', id, layerIndex, dataIndex, 'Bubble', bubbleIndex);
            }
            if (id.indexOf('_NavigationIndex_') > -1) {
                navigationIndex = parseInt(id.split('_NavigationIndex_')[1].split('_')[0], 10);
                dataIndex = id.indexOf('_Line_') !== -1 ? parseInt(id.split('_Line_')[1].split('_')[0], 10) : null;
                this.removeAllHighlight();
                this.dotNetRef.invokeMethodAsync('SelectMap', id, layerIndex, dataIndex, 'NavigationLine', navigationIndex);
            }
        }
        this.dotNetRef.invokeMethodAsync('TriggerClickEventArgs', false, clientValue.x, clientValue.y, document.getElementById(id));
    }
    private targetTouches(touches: any): any[] {
        let targetTouches: any[] = [];
        for (let i: number = 0; i < touches.length; i++) {
            targetTouches.push({ pageX: touches[i].pageX, pageY: touches[i].pageY });
        }
        return targetTouches;
    }
    //tslint:disable:max-func-body-length
    private mouseMove(event: MouseEvent): void {
        let id: string = event.target['id'];
        this.moveClientX = event.pageX;
        this.moveClientY = event.pageY;
        let layerX: number; let layerY: number;
        let translatePoint : MapLocation = this.isTileMap ? this.tileTranslatePoint : this.shapeTranslatePoint;
        let x: number; let y: number;
        if (event.type === 'touchmove') {
            this.moveClientX = x = event['touches'][0].clientX;
            this.moveClientY = y = event['touches'][0].clientY;
            if (event['touches'].length === 2) {
                this.touchMoveList = this.targetTouches(event['touches']);
            }
            event.preventDefault();
            layerX = 0;
            layerY = 0;
        } else {
            this.moveClientX = event.pageX;
            this.moveClientY = event.pageY;
            x = event.clientX;
            y = event.clientY;
            layerX = event['layerX'];
            layerY = event['layerY'];
        }
        if (this.options.legendSettings === '1' && id.indexOf('_MapAreaBorder') > -1) {
            let legendElement: HTMLElement = document.getElementById(this.element.id + '_Interactive_Legend');
            if (legendElement !== null) {
                this.dotNetRef.invokeMethodAsync('MapsAreaInteractive');
            }
        }
        if (this.options.legendSettings === '1' && id.indexOf('_LayerIndex') > -1) {
            let elementId: HTMLElement = document.getElementById(event.target['id']);
            let fill: string = elementId.getAttribute('fill');
            this.dotNetRef.invokeMethodAsync('RenderInteractive', event.target['id'], fill);
        }
        let clientValue: MapLocation = this.getMousePosition(this.moveClientX, this.moveClientY);
        this.moveClientX = clientValue.x;
        this.moveClientY = clientValue.y;
        let parentId: string = id.split('_')[0];
        this.highlightMap(event);
        if (this.options.enableZoom && this.options.enableSelectionZooming && (this.mouseClick && this.zoomClick)) {
            event.preventDefault();
            if (!this.svgCreated) {
                this.startValue = this.svgPoint(this.svg, x, y);
                this.svgCreated = true;
            }
            this.position = this.svgPoint(this.svg, x, y);
            let svgElement: ClientRect = document.getElementById(this.element.id).getBoundingClientRect();
            this.width = Math.abs(this.position.x - this.startValue.x);
            this.height = Math.abs(this.position.y - this.startValue.y);
            if (this.position.x > this.startValue.x) {
                this.position.x = this.startValue.x;
            }
            if (this.position.y > this.startValue.y) {
                this.position.y = this.startValue.y;
            }
            this.position.x = this.position.x - svgElement['x'];
            this.position.y = this.position.y - svgElement['y'];
            rect.setAttributeNS(null, 'x', this.position.x.toString());
            rect.setAttributeNS(null, 'y', this.position.y.toString());
            rect.setAttributeNS(null, 'id', this.element.id + 'drawRect');
            rect.setAttributeNS(null, 'width', this.width.toString());
            rect.setAttributeNS(null, 'height', this.height.toString());
            rect.setAttributeNS(null, 'fill', '#d3d3d3');
            rect.setAttributeNS(null, 'stroke-dasharray', '3');
            rect.setAttributeNS(null, 'opacity', '0.5');
            rect.setAttributeNS(null, 'stroke', '#009900');
            if (document.getElementById(this.element.id + '_tile_parent') !== null) {
                (document.getElementById(this.element.id + '_LayerCollections').parentNode as HTMLElement).appendChild(rect);
            } else {
                document.getElementById(this.element.id + '_svg').appendChild(rect);
            }
        }
        if (this.allowPanning && this.options.enablePanning && (this.clientX !== this.moveClientX || this.clientY !== this.moveClientY)) {
            this.isPanning = true;
            if (!this.isTileMap) {
                let element: HTMLElement = document.getElementById(this.element.id + '_LayerCollections');
                for (let i: number = 0; i < element.children.length; i++) {
                    for (let j: number = 0; j < element.children[i].childElementCount; j++) {
                        if (element.children[i].children[j].id.indexOf('Polygon_Group') > -1) {
                            this.scaleFactor = element.children[i].children[j]['transform']['baseVal'][0]['matrix']['a'];
                            break;
                        }
                    }
                }
                if (this.clientX !== this.moveClientX && this.clientY !== this.moveClientY) {
                    let xDifference: number = this.clientX - this.moveClientX;
                    let yDifference: number = this.clientY - this.moveClientY;
                    let x : number =  translatePoint.x - xDifference / this.scaleFactor;
                    let y : number =  translatePoint.y - yDifference / this.scaleFactor;
                    if (!this.panComplete && !this.pinchComplete) {
                        this.previousPoint = this.isTileMap ? this.tileTranslatePoint : this.shapeTranslatePoint;
                        this.dotNetRef.invokeMethodAsync('TriggerPanning', translatePoint.x, translatePoint.y, x, y, this.scaleFactor);
                    }
                    this.panning(xDifference, yDifference, layerX, layerY, this.scaleFactor);
                    this.panComplete = this.isTouch && this.touchMoveList.length === 2 && this.touchStartList.length === 2 ?
                    false : true;
                    this.clientX = this.moveClientX;
                    this.clientY = this.moveClientY;
                }
            }
            if ((id.indexOf(parentId) > -1)) {
                let element: HTMLElement = document.getElementById(event.currentTarget['id'] + '_animated_tiles');
                if (element !== null) {
                    this.isTileMap = true;
                    this.scaleFactor = parseInt(element['className'], 10);
                    let xDifference: number = this.clientX - this.moveClientX;
                    let yDifference: number = this.clientY - this.moveClientY;
                    let location : LatLog = this.getTileGeoLocation(layerX, layerY);
                    if (!this.panComplete && this.touchMoveList.length !== 2 && this.touchStartList.length !== 2) {
                        this.previousPoint = this.isTileMap ? this.tileTranslatePoint : this.shapeTranslatePoint;
                        this.dotNetRef.invokeMethodAsync('TriggerTilePanning', this.previousPoint.x, this.previousPoint.y, translatePoint.x, translatePoint.y, this.scaleFactor, location.latitude, location.longitude);
                    }
                    this.panning(xDifference, yDifference, layerX, layerY, this.scaleFactor);
                    this.panComplete = this.isTouch && this.touchMoveList.length === 2 && this.touchStartList.length === 2 
                    ? false : true;
                    this.clientX = this.moveClientX;
                    this.clientY = this.moveClientY;
                }
            }
        }
        if (this.options.enablePinchZooming && this.touchMoveList.length === 2 && this.touchStartList.length === 2) {
            this.isPinchZoomed = true;
            if (!this.pinchComplete && !this.panComplete) {
                this.dotNetRef.invokeMethodAsync('TriggerOnZoom', translatePoint.x, translatePoint.y, this.scaleFactor);
            }   
            this.pinchZooming(event);
            this.pinchComplete = true;
        }
        if (!this.allowPanning && !(this.mouseClick && this.zoomClick)) {
            if (id.indexOf('shapeIndex') > -1 && this.options.tooltipDisplayMode === 'MouseMove') {
                let layerIndex: number = parseInt(id.split('_LayerIndex_')[1].split('_')[0], 10);
                let shapeIndex: number = parseInt(id.split('_shapeIndex_')[1].split('_')[0], 10);
                this.dotNetRef.invokeMethodAsync('TriggerShapeTooltip', id, clientValue.x, clientValue.y, layerIndex, shapeIndex,
                    'Shape', 0);
            }
        }
        if (id.indexOf('_shapeIndex_') === -1 && id.indexOf('_MarkerIndex_') === -1 && id.indexOf('_BubbleIndex_') === -1 &&
            this.options.tooltipDisplayMode === 'MouseMove' ||
            (this.isToolbarTooltip && id.indexOf('_Zooming_ToolBar_') === -1 && this.options.tooltipDisplayMode !== 'MouseMove')) {
            this.dotNetRef.invokeMethodAsync('TriggerShapeTooltip', '', clientValue.x, clientValue.y, 0, 0, '', 0);
        }
        this.isToolbarTooltip = false;
        if (id.indexOf('_Zooming_ToolBar_') > -1) {
            this.isToolbarTooltip = true;
            let text: string = id.split('_Zooming_ToolBar_')[1].split('_')[0];
            this.dotNetRef.invokeMethodAsync('TriggerShapeTooltip', id, clientValue.x, clientValue.y, 0, 0, text, 0);
        }
        if (id.indexOf('_LayerIndex_') > -1 && id.indexOf('_MarkerIndex_') > -1) {
            let layerIndex: number = parseInt(id.split('_LayerIndex_')[1].split('_')[0], 10);
            let markerIndex: number = parseInt(id.split('_MarkerIndex_')[1].split('_')[0], 10);
            let dataIndex: number = parseInt(id.split('_dataIndex_')[1].split('_')[0], 10);
            this.dotNetRef.invokeMethodAsync('TriggerMouseMove', layerIndex, markerIndex, dataIndex, id, clientValue.x,
                clientValue.y, id.indexOf('cluster') > -1 ? 'cluster' : 'marker');
        }
        if (id.indexOf('_LayerIndex_') > -1 && id.indexOf('_BubbleIndex_') > -1) {
            let layerIndex: number = parseInt(id.split('_LayerIndex_')[1].split('_')[0], 10);
            let markerIndex: number = parseInt(id.split('_BubbleIndex_')[1].split('_')[0], 10);
            let dataIndex: number = parseInt(id.split('_dataIndex_')[1].split('_')[0], 10);
            this.dotNetRef.invokeMethodAsync('TriggerBubbleMouseMove', layerIndex, markerIndex, dataIndex, id, clientValue.x,
                clientValue.y);
        }
    }
    private mouseDown(event: MouseEvent): void {
        let id: string = event.target['id'];
        this.isPinchZoomed = false;
        this.isTouch = false;
        this.panComplete = false; this.pinchComplete = false;
        if (event.type === 'touchstart') {
            event.preventDefault();
            this.clientX = event['touches'][0].clientX;
            this.clientY = event['touches'][0].clientY;
            if (event['touches'].length === 2) {
                this.touchStartList = this.targetTouches(event['touches']);
            }
            this.isTouch = true;
        } else {
            this.clientX = event.pageX;
            this.clientY = event.pageY;
        }
        let clientValue: MapLocation = this.getMousePosition(this.clientX, this.clientY);
        this.clientX = clientValue.x;
        this.clientY = clientValue.y;
        if (this.options.enableZoom && this.options.enableSelectionZooming && this.zoomClick) {
            this.mouseClick = true;
            event.preventDefault();
        }
        if (!this.mouseClick && id.indexOf('ToolBar_Pan') === -1) {
            if (id.indexOf('_MapAreaBorder') > -1 && this.options.enablePanning) {
                this.allowPanning = true;
            }
            if (id.indexOf('') > -1 && !(id.indexOf('Zooming') > -1) && this.options.enablePanning) {
                this.allowPanning = true;
            }
        }
    }
    private pinchZooming(event: MouseEvent): void {
        // tslint:disable
        this.pinchFactor = this.scaleFactor;
        let prevLevel: number = this.scaleFactor;
        let availSize: AreaRect = this.areaRect;
        this.previousScale = this.scaleFactor;
        this.previousPoint = this.shapeTranslatePoint;
        let prevTilePoint: MapLocation = this.tileTranslatePoint;
        let scale: number = this.calculateScale(this.touchStartList, this.touchMoveList);
        let touchCenter: MapLocation = this.getTouchCenter(this.touchMoveList);
        let newScale: number = scale / this.lastScale;
        this.lastScale = scale;
        this.pinchFactor *= newScale;
        this.pinchFactor = Math.min(this.options.maxZoom, Math.max(this.options.minZoom, this.pinchFactor));
        if (!this.isTileMap) {
            let mapTotalWidth: number = Math.abs(this.baseMapBounds.minBounds.x - this.baseMapBounds.maxBounds.x);
            let mapTotalHeight: number = Math.abs(this.baseMapBounds.minBounds.y - this.baseMapBounds.maxBounds.y);
            let currentHeight: number = Math.abs(this.baseMapBounds.maxBounds.y - this.baseMapBounds.minBounds.y) * this.pinchFactor;
            let translatePointX: number = this.shapeTranslatePoint.x - (((availSize.width / this.scaleFactor) - (availSize.width / this.pinchFactor)) / (availSize.width / touchCenter.x));
            let translatePointY: number = this.shapeTranslatePoint.y - (((availSize.height / this.scaleFactor) - (availSize.height / this.pinchFactor)) / (availSize.height / touchCenter.y));
            translatePointX = (currentHeight < this.areaRect.height) ? (availSize.x + ((-(this.baseMapBounds.minBounds.x)) + ((availSize.width / 2) - (mapTotalWidth / 2)))) : translatePointX;
            translatePointY = (currentHeight < this.areaRect.height) ? (availSize.y + ((-(this.baseMapBounds.minBounds.y)) + ((availSize.height / 2) - (mapTotalHeight / 2)))) : translatePointY;
            this.scaleFactor = this.pinchFactor;
            this.shapeTranslatePoint = { x: translatePointX, y: translatePointY };
            this.applyTransform();
        } else {
            this.getTileTranslatePosition(prevLevel, this.pinchFactor, { x: touchCenter.x, y: touchCenter.y }, null);
            this.tileZoomLevel = this.pinchFactor;
            this.scaleFactor = this.pinchFactor;
            this.translatePoint.x = (this.tileTranslatePoint.x - (0.01 * this.scaleFactor)) / Math.pow(2, this.scaleFactor - 1);
            this.translatePoint.y = (this.tileTranslatePoint.y - (0.01 * this.scaleFactor)) / Math.pow(2, this.scaleFactor - 1);
            this.generateTiles();
            this.renderMarkers();
        }
    }
    private getTileTranslatePosition(prevLevel: number, currentLevel: number, position: any, type: string): void {
        let tileDefaultSize: number = 256;
        let padding: number = type === 'ZoomOut' ? 10 : (type === 'Reset' && currentLevel > 1) ? 0 : 10;
        let prevSize: number = Math.pow(2, prevLevel) * 256;
        let totalSize: number = Math.pow(2, currentLevel) * 256;
        let x: number = ((position.x - this.tileTranslatePoint.x) / prevSize) * 100;
        let y: number = ((position.y - this.tileTranslatePoint.y) / prevSize) * 100;
        let bounds: AreaRect = this.baseMapBounds.availableSize;
        this.tileTranslatePoint.x = (currentLevel === 1) ? (bounds.width / 2) - ((tileDefaultSize * 2) / 2) :
            position.x - ((x * totalSize) / 100);
        this.tileTranslatePoint.y = (currentLevel === 1) ? ((bounds.height / 2) - ((tileDefaultSize * 2) / 2) + (padding * 2)) :
            position.y - ((y * totalSize) / 100);
    }
    private calculateScale(startTouches: any, endTouches: any): number {
        let startDistance: number = this.getDistance(startTouches[0], startTouches[1]);
        let endDistance: number = this.getDistance(endTouches[0], endTouches[1]);
        return (endDistance / startDistance);
    }
    private getDistance(a: any, b: any): number {
        let x: number = a.pageX - b.pageX;
        let y: number = a.pageY - b.pageY;
        return Math.sqrt(x * x + y * y);
    }
    private sum(a: number, b: number): number {
        return a + b;
    }
    private getTouchCenter(touches: any): MapLocation {
        return {
            x: touches.map((e: any) => { return e['pageX']; }).reduce(this.sum) / touches.length,
            y: touches.map((e: any) => { return e['pageY']; }).reduce(this.sum) / touches.length
        };
    }
    private highlightMap(event: MouseEvent): void {
        let targetElement: HTMLElement = <HTMLElement>event.target;
        let id: string = targetElement['id'];
        this.removeAllHighlight();
        if (id.indexOf('_LayerIndex_') > -1) {
            let layerIndex: number = parseInt(id.split('_LayerIndex_')[1].split('_')[0], 10);
            let dataIndex: number = id.indexOf('_dataIndex_') > -1 ? parseInt(id.split('_dataIndex_')[1].split('_')[0], 10) : 0;
            if (id.indexOf('shapeIndex') > -1 && this.options.layerHighlightSettings[layerIndex] &&
                this.options.layerHighlightSettings[layerIndex].Enable) {
                if (!targetElement.classList.contains('mapShapeSelection')) {
                    let shapeIndex: number = parseInt(id.split('_shapeIndex_')[1].split('_')[0], 10);
                    this.handleHighlight(targetElement, 'Shape', this.options.layerHighlightSettings[layerIndex]);
                    this.dotNetRef.invokeMethodAsync('TriggerShapeHighlight', layerIndex, shapeIndex, id);
                }
            } else if (id.indexOf('_BubbleIndex_') > -1) {
                let bubbleIndex: number = parseInt(id.split('_BubbleIndex_')[1].split('_')[0], 10);
                if (this.options.bubbleHighlightSettings[layerIndex][bubbleIndex] &&
                    this.options.bubbleHighlightSettings[layerIndex][bubbleIndex].Enable
                    && !targetElement.classList.contains('mapBubbleSelection')) {
                    this.handleHighlight(targetElement, 'Bubble', this.options.bubbleHighlightSettings[layerIndex][bubbleIndex]);
                    this.dotNetRef.invokeMethodAsync('TriggerItemHighlight', "Bubble", layerIndex, bubbleIndex, dataIndex, id);
                }
            } else if (id.indexOf('_NavigationIndex_') > -1) {
                let navigationIndex: number = parseInt(id.split('_NavigationIndex_')[1].split('_')[0], 10);
                if (this.options.navigationHighlightSettings[layerIndex][navigationIndex] &&
                    this.options.navigationHighlightSettings[layerIndex][navigationIndex].Enable
                    && !targetElement.classList.contains('mapNavigationSelection')) {
                    this.handleHighlight(targetElement, 'Navigation',
                        this.options.navigationHighlightSettings[layerIndex][navigationIndex]);
                    if (targetElement.getAttribute('marker-end') !== '' || targetElement.getAttribute('marker-end') !== '') {
                        let highlightNavigate: HTMLElement = document.getElementById(this.id + '_triangle_' + id.lastIndexOf(id));
                        highlightNavigate.setAttribute('class', 'highlightNavigation');
                    }
                    this.dotNetRef.invokeMethodAsync('TriggerItemHighlight', "Navigation", layerIndex, navigationIndex, 0, id);
                }
            } else if (id.indexOf('_MarkerIndex_') > -1 && id.indexOf('_cluster_') === -1) {
                let markerIndex: number = parseInt(id.split('_MarkerIndex_')[1].split('_')[0], 10);
                if (this.options.markerHighlightSettings[layerIndex][markerIndex] &&
                    this.options.markerHighlightSettings[layerIndex][markerIndex].Enable
                    && !targetElement.classList.contains('mapMarkerSelection')) {
                    this.handleHighlight(targetElement, 'Marker', this.options.markerHighlightSettings[layerIndex][markerIndex]);
                    this.dotNetRef.invokeMethodAsync('TriggerItemHighlight', "Marker", layerIndex, markerIndex, dataIndex, id);
                }
            }
        } else if (id.indexOf('_Legend_Shape_') > -1 && this.options.layerHighlightSettings[0] &&
            this.options.layerHighlightSettings[0].Enable) {
            if (!targetElement.classList.contains('mapShapeSelection')) {
                targetElement.classList.add('highlightShape');
                let elements: NodeListOf<Element> = document.querySelectorAll('path[fill*="" + targetElement.getAttribute("fill") + ""]');
                if (elements && elements.length > 0) {
                    for (let k: number = 0; k < elements.length; k++) {
                        this.handleHighlight(elements[k], 'Shape', this.options.layerHighlightSettings[0]);
                    }
                }
            }
        }
    }
    private removeAllHighlight(): void {
        this.removeHighlight('Shape');
        this.removeHighlight('Marker');
        this.removeHighlight('Bubble');
        this.removeHighlight('Navigation');
    }
    private handleHighlight(element: HTMLElement | Element, type: string, settings: any): void {
        if (type === 'Shape') {
            let elements: NodeListOf<Element> = document.querySelectorAll('rect[id*="' + this.element.id + '_Legend_Shape_Index"]');
            if (elements && elements.length > 0) {
                for (let k: number = 0; k < elements.length; k++) {
                    if (elements[k].getAttribute('fill') === element.getAttribute('fill')) {
                        elements[k].classList.add('highlight' + type);
                    }
                }
            }
        }
        element.classList.add('highlight' + type);
        if (document.querySelector('#highlight' + type + 'Style') !== null &&
            document.querySelector('#highlight' + type + 'Style')['length'] !== 0) {
            this.customizeStyle('highlight' + type + 'Style', 'highlight' + type, settings);
        } else {
            this.createStyle('highlight' + type + 'Style', 'highlight' + type, settings);
        }
    }
    private removeHighlight(type: string): void {
        let highlights: NodeListOf<Element> = document.querySelectorAll('.highlight' + type);
        if (highlights && highlights.length > 0) {
            for (let i: number = 0; i < highlights.length; i++) {
                highlights[i].classList.remove('highlight' + type);
            }
        }
    }
    private createStyle(id: string, className: string, setting: any): void {
        let style: HTMLElement = document.createElement('style');
        style.id = id;
        style.innerHTML = '.' + className + ' {fill:' + setting['Fill'] + ';opacity:' +
            setting['Opacity'] + ';stroke:' + setting['BorderColor']
            + ';stroke-width:' + setting['BorderWidth'];
        document.body.appendChild(style);
    }
    private customizeStyle(id: string, className: string, setting: any): void {
        let style: HTMLElement = document.getElementById(id);
        style.innerHTML = '.' + className + ' {fill:' + setting['Fill'] + ';opacity:' + setting['Opacity'] +
            ';stroke:' + setting['BorderColor'] + ';stroke-width:' + setting['BorderWidth'];
    }
    private renderMarkers(): void {
        let layerCollection: HTMLElement = document.getElementById(this.element.id + '_LayerCollections');
        for (let i: number = 0; i < layerCollection.childElementCount; i++) {
            let layerElement: SVGAElement = layerCollection.childNodes[i] as SVGAElement;
            if (layerElement.tagName === 'g') {
                let index: number = layerElement.id.indexOf('_LayerIndex_') > -1 &&
                    parseFloat(layerElement.id.split('_LayerIndex_')[1].split('_')[0]);
                for (let j: number = 0; j < layerElement.childNodes.length; j++) {
                    let currentEle: SVGAElement = layerElement.childNodes[j] as SVGAElement;
                    if (currentEle.COMMENT_NODE === currentEle.nodeType) {
                        continue;
                    }
                    if (currentEle.id.indexOf('Polygon') > -1) {
                        currentEle.setAttribute('transform', 'scale(' + Math.pow(2, this.scaleFactor - 1) + ') translate( ' +
                            this.translatePoint.x + ' ' + this.translatePoint.y + ' )');
                    } else if (currentEle.id.indexOf('_MarkerGroup') > -1) {
                        for (let k: number = 0; k < currentEle.childElementCount; k++) {
                            this.markerTranslate(<Element>currentEle.childNodes[k], 0, this.translatePoint.x,
                                this.translatePoint.y, this.scaleFactor);
                        }
                    } else if (currentEle.id.indexOf('_line_Group') > -1) {
                        if (!this.isTileMap) {
                            currentEle.setAttribute('transform', 'scale(' + (this.scaleFactor) + ') translate( ' +
                                this.translatePoint.x + ' ' + this.translatePoint.y + ' )');
                        } else {
                            for (let m: number = 0; m < currentEle.childElementCount; m++) {
                                let currentGroup: HTMLElement = document.getElementById(currentEle.children[m]['id']);
                                for (let k: number = 1; k < currentGroup.childElementCount; k++) {
                                    let layerIndex: number = parseInt((<Element>currentGroup.childNodes[0]).id.split('_LayerIndex_')[1].split('_')[0], 10);
                                    let lineIndex: number = parseInt((<Element>currentGroup.childNodes[0]).id.split('_NavigationIndex_')[1].split('_')[0], 10);
                                    this.navigationTranslate(<Element>currentGroup.children[k], 0, layerIndex, lineIndex);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    private markerTranslate(element: Element, factor: number, x: number, y: number, scale: number): void {
        let layerIndex: number = parseInt(element.id.split('_LayerIndex_')[1].split('_')[0], 10);
        let markerIndex: number = parseInt(element.id.split('_MarkerIndex_')[1].split('_')[0], 10);
        let dataIndex: number = parseInt(element.id.split('_dataIndex_')[1].split('_')[0], 10);
        let longitude: number = (this.dataSource[layerIndex]['length'] !== 0 ?
            (this.dataSource[layerIndex][markerIndex].length !== 0 ?
                this.dataSource[layerIndex][markerIndex][dataIndex]['Longitude'] : null) : null);
        let latitude: number = (this.dataSource[layerIndex]['length'] !== 0 ? (this.dataSource[layerIndex][markerIndex].length !== 0 ?
            this.dataSource[layerIndex][markerIndex][dataIndex]['Latitude'] : null) : null);
        if (latitude && longitude) {
            if (this.isTileMap) {
                let point: MapLocation = this.convertTileLatLongToPoint({ x: longitude, y: latitude },
                    this.tileZoomLevel, this.tileTranslatePoint, true);
                element.setAttribute('transform', 'translate( ' + point.x + ' ' + point.y + ' )');
            } else {
                let location: MapLocation = this.convertGeoToPoint(latitude, longitude, factor);
                location.x = (location.x + x) * scale;
                location.y = (location.y + y) * scale;
                element.setAttribute('transform', 'translate( ' + location.x + ' ' + location.y + ' )');
            }
        }
    }
    // tslint:disable:max-line-length 
    private navigationTranslate(element: Element, factor: number, layerIndex: number, lineIndex: number): void {
        if (!isNullOrUndefined(this.navigation[layerIndex])) {
            let angle: number = this.navigation[layerIndex][lineIndex].Angle;
            let direction: number;
            let d: string;
            let point: MapLocation[] = [];
            if (this.navigation[layerIndex][lineIndex].Latitude.length === this.navigation[layerIndex][lineIndex].Longitude.length) {
                for (let i: number = 0; i < this.navigation[layerIndex][lineIndex].Latitude.length; i++) {
                    let location: MapLocation = this.isTileMap ? this.convertTileLatLongToPoint({ x: this.navigation[layerIndex][lineIndex].Longitude[i], y: this.navigation[layerIndex][lineIndex].Latitude[i] }, this.tileZoomLevel, this.tileTranslatePoint, true) :
                        this.convertGeoToPoint(this.navigation[layerIndex][lineIndex].Latitude[i],
                            this.navigation[layerIndex][lineIndex].Longitude[i], factor);
                    point.push(location);
                }
            }
            for (let j: number = 0; j < point['length'] - 1; j++) {
                angle = (-1 > angle) ? -1 : angle;
                angle = (1 < angle) ? 1 : angle;
                let radius1: number = this.convertRadius(point[j], point[j + 1]);
                if (angle <= 1 && angle > 0) {
                    direction = 0;
                    if (point[j]['x'] > point[j + 1]['x']) {
                        direction = 1;
                    }
                }
                if (angle >= -1 && angle < 0) {
                    direction = 1;
                    if (point[j]['x'] > point[j + 1]['x']) {
                        direction = 0;
                    }
                }
                if (point[j]['x'] !== point[j + 1]['x']) {
                    angle = Math.abs(angle);
                    d = (angle === 0) ? 'M ' + point[j]['x'] + ',' + point[j]['y'] + 'L ' + point[j + 1]['x']
                        + ',' + point[j + 1]['y'] + ' ' :
                        'M ' + point[j]['x'] + ',' + point[j]['y'] + ' A ' + (radius1 / 2 + (1 - angle) * radius1 / (angle * 10)) +
                        ' ' + (radius1 / 2 + (1 - angle) * radius1 / (angle * 10)) + ' ' + 0 + ',' + 0 + ','
                        + direction + ' , ' + point[j + 1]['x'] + ',' + point[j + 1]['y'] + ' ';
                }
                element.setAttribute('d', d);
            }
        }
    }
    private dataLabelTranslate(element: Element, factor: number, x: number, y: number, scale: number, type: string): void {
        let layerIndex: number = parseInt(element.id.split('_LayerIndex_')[1].split('_')[0], 10);
        let labelIndex: number = parseFloat(element.id.split('_LabelIndex_')[1].split('_')[0]);
        let currentLabel: number = this.labelCollection[layerIndex][labelIndex];
        let labelX: number = currentLabel['LocationX'];
        let labelY: number = currentLabel['LocationY'];
        if (type !== 'Template') {
            labelX = ((labelX + x) * scale);
            labelY = ((labelY + y) * scale);
            element.setAttribute('transform', 'translate( ' + labelX + ' ' + labelY + ' )');
        }
    }
    private convertTileLatLongToPoint(center: MapLocation, zoomLevel: number, tileTranslatePoint: MapLocation,
        isMapCoordinates: boolean): MapLocation {
        let size: number = Math.pow(2, zoomLevel) * 256;
        let x: number = (center.x + 180) / 360;
        let sinLatitude: number = Math.sin(center.y * Math.PI / 180);
        let y: number = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
        let pixelX: number = center.x;
        let pixelY: number = center.y;
        if (isMapCoordinates) {
            pixelX = (x * size + 0.5) + tileTranslatePoint.x;
            pixelY = (y * size + 0.5) + tileTranslatePoint.y;
        }
        return { x: pixelX, y: pixelY };
    }
    public panning(xDifference: number, yDifference: number, layerX: number, layerY: number, scaleFactor: number): void {
        if (!this.isTileMap) {
            let previousPoint: MapLocation = this.shapeTranslatePoint;
            let x: number = this.shapeTranslatePoint.x - xDifference / scaleFactor;
            let y: number = this.shapeTranslatePoint.y - yDifference / scaleFactor;
            let layerRect: ClientRect = document.getElementById(this.element.id + '_LayerCollections').getBoundingClientRect();
            let elementRect: ClientRect = document.getElementById(this.element.id + '_svg').getBoundingClientRect();
            let panningXDirection: boolean = ((xDifference < 0 ? layerRect.left <= (elementRect.left + this.areaRect.x) :
                ((layerRect.left + layerRect.width) >= (elementRect.left + elementRect.width) + this.areaRect.x + this.marginLeft)));
            let panningYDirection: boolean = ((yDifference < 0 ? layerRect.top <= (elementRect.top + this.areaRect.y) :
                ((layerRect.top + layerRect.height + this.marginTop) >= (elementRect.top + elementRect.height))));
            if (panningXDirection && panningYDirection) {
                this.shapeTranslatePoint = { x: x, y: y };
                this.applyTransform();
            } else if (panningXDirection) {
                this.shapeTranslatePoint = { x: x, y: this.shapeTranslatePoint.y };
                this.applyTransform();
            } else if (panningYDirection) {
                this.shapeTranslatePoint = { x: this.shapeTranslatePoint.x, y: y };
                this.applyTransform();
            }
        } else {
            let x: number = this.tileTranslatePoint.x - xDifference;
            let y: number = this.tileTranslatePoint.y - yDifference;
            this.tileTranslatePoint.x = x;
            this.tileTranslatePoint.y = y;
            if ((this.tileTranslatePoint.y > -10 && yDifference < 0) ||
                ((this.tileTranslatePoint.y < -((Math.pow(2, scaleFactor) - 2) * 256) && yDifference > 0))) {
                this.tileTranslatePoint.x = x + xDifference;
                this.tileTranslatePoint.y = y + yDifference;
            }
            this.translatePoint.x = (this.tileTranslatePoint.x - xDifference) / Math.pow(2, scaleFactor - 1);
            this.translatePoint.y = (this.tileTranslatePoint.y - yDifference) / Math.pow(2, scaleFactor - 1);
            this.generateTiles();
            this.renderMarkers();
        }
    }
    private applyTransform(): void {
        let x: number = !this.isTileMap ? this.shapeTranslatePoint.x : this.translatePoint.x;
        let y: number = !this.isTileMap ? this.shapeTranslatePoint.y : this.translatePoint.y;
        let layerCollection: HTMLElement = document.getElementById(this.element.id + '_LayerCollections');
        for (let i: number = 0; i < layerCollection.childNodes.length; i++) {
            let layerElement: Element = <Element>layerCollection.childNodes[i];
            if (layerElement.COMMENT_NODE === layerElement.nodeType) {
                continue;
            }
            if (layerElement.tagName === 'g') {
                let index: number = layerElement.id.indexOf('_LayerIndex_') > -1 &&
                    parseFloat(layerElement.id.split('_LayerIndex_')[1].split('_')[0]);
                let factor: number = this.calculateFactor();
                for (let j: number = 0; j < layerElement.childNodes.length; j++) {
                    let currentEle: Element = <Element>layerElement.childNodes[j];
                    if (currentEle.COMMENT_NODE === currentEle.nodeType) {
                        continue;
                    }
                    if (currentEle.id.indexOf('Polygon') > -1 || currentEle.id.indexOf('_line_Group') > -1) {
                        currentEle.setAttribute('transform', 'scale(' + this.scaleFactor + ') translate( ' + x + ' ' + y + ' )');
                    } else if (currentEle.id.indexOf('_MarkerGroup') > -1) {
                        for (let k: number = 0; k < currentEle.childNodes.length; k++) {
                            this.markerTranslate(<Element>currentEle.childNodes[k], factor, x, y, this.scaleFactor);
                        }
                    } else if (currentEle.id.indexOf('_bubble_Group_') > -1) {
                        for (let k: number = 0; k < currentEle.childNodes.length; k++) {
                            let childElement: Element = <Element>currentEle.childNodes[k];
                            let layerIndex: number = parseFloat(childElement.id.split('_LayerIndex_')[1].split('_')[0]);
                            let bubleIndex: number = parseFloat(childElement.id.split('_BubbleIndex_')[1].split('_')[0]);
                            let dataIndex: number = parseFloat(childElement.id.split('_BubbleIndex_')[1].split('_')[2]);
                            if (this.bubbleCollection[layerIndex] && this.bubbleCollection[layerIndex][bubleIndex]) {
                                let currentBubble: object = this.bubbleCollection[layerIndex][bubleIndex][dataIndex];
                                let centerX: number = currentBubble['ZoomTranslatePoint']['X'];
                                let centerY: number = currentBubble['ZoomTranslatePoint']['Y'];
                                let currentX: number = ((centerX + x) * this.scaleFactor);
                                let currentY: number = ((centerY + y) * this.scaleFactor);
                                childElement.setAttribute('transform', 'translate( ' + currentX + ' ' + currentY + ' )');
                            }
                        }
                    } else if (currentEle.id.indexOf('_dataLableIndex_Group') > -1) {
                        for (let k: number = 0; k < currentEle.childNodes.length; k++) {
                            this.dataLabelTranslate(<Element>currentEle.childNodes[k], factor, x, y, this.scaleFactor, 'DataLabel');
                        }
                    }
                }
            }
        }
    }
    private calculateFactor(): number {
        let horFactor: number;
        let verFactor: number = 1;
        let divide: number = 10;
        let exp: string = 'e+1';
        let bounds: BaseMapBound = this.baseMapBounds;
        let mapSize: Size = { width: this.areaRect.width, height: this.areaRect.height };
        let mapHeight: number;
        let mapWidth: number;
        if (bounds) {
            let start: MapLocation = this.convertGeoToPoint(bounds.latitudeMin, bounds.longitudeMin, null);
            let end: MapLocation = this.convertGeoToPoint(bounds.latitudeMax, bounds.longitudeMax, null);
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
    private convertRadius(point1: MapLocation, point2: MapLocation): number {
        let value1: number = point2['x'] - point1['x'];
        let value2: number = point2['y'] - point1['y'];
        let value: number = Math.sqrt((Math.pow(value1, 2) + Math.pow(value2, 2)));
        return value;
    }
    private convertGeoToPoint(latitude: number, longitude: number, factor: number): MapLocation {
        let mapSize: Size = { width: this.areaRect.width, height: this.areaRect.height };
        let x: number;
        let y: number;
        let value: MapLocation;
        let lat: number;
        let lng: number;
        let temp: number;
        let latRadian: number = this.degreesToRadians(latitude);
        let lngRadian: number = this.degreesToRadians(longitude);
        let size: number = factor === null || factor === undefined ? Math.min(mapSize.width, mapSize.height) :
            Math.min(mapSize.width, mapSize.height) * factor;
        let type: any = this.projectionType;
        switch (type) {
            case 'Mercator':
                let pixelOrigin: MapLocation = { x: size / 2, y: size / 2 };
                x = pixelOrigin.x + longitude * (size / 360);
                let sinY: number = this.calculateBound(Math.sin(this.degreesToRadians(latitude)), -0.9999, 0.9999);
                y = pixelOrigin.y + 0.5 * (Math.log((1 + sinY) / (1 - sinY))) * (-(size / (2 * Math.PI)));
                break;
            case 'Winkel3':
                value = this.aitoff(lngRadian, latRadian);
                lng = (value.x + lngRadian / (Math.PI / 2)) / 2;
                lat = (value.y + latRadian) / 2;
                break;
            case 'Miller':
                lng = lngRadian;
                lat = (1.25 * Math.log(Math.tan((Math.PI / 4) + (.4 * latRadian))));
                break;
            case 'Eckert3':
                temp = Math.sqrt(Math.PI * (4 + Math.PI));
                lng = 2 / temp * lngRadian * (1 + Math.sqrt(1 - 4 * latRadian * latRadian / (Math.PI * Math.PI)));
                lat = 4 / temp * latRadian;
                break;
            case 'AitOff':
                value = this.aitoff(lngRadian, latRadian);
                lng = value.x;
                lat = value.y;
                break;
            case 'Eckert5':
                lng = lngRadian * (1 + Math.cos(latRadian)) / Math.sqrt(2 + Math.PI);
                lat = 2 * latRadian / Math.sqrt(2 + Math.PI);
                break;
            case 'Equirectangular':
                lng = lngRadian;
                lat = latRadian;
                break;
            case 'Eckert6':
                let epsilon: number = 1e-6;
                temp = (1 + (Math.PI / 2)) * Math.sin(latRadian);
                let delta: number = Infinity;
                for (let i: number = 0; i < 10 && Math.abs(delta) > epsilon; i++) {
                    delta = (latRadian + (Math.sin(latRadian)) - temp) / (1 + Math.cos(latRadian));
                    latRadian = latRadian - delta;
                }
                temp = Math.sqrt(2 + Math.PI);
                lng = lngRadian * (1 + Math.cos(latRadian)) / temp;
                lat = 2 * latRadian / temp;
                break;
        }
        return { x: x, y: y };
    }
    private aitoff(x: number, y: number): MapLocation {
        let cosy: number = Math.cos(y);
        let sincia: number = Math.sin(Math.cos(cosy * Math.cos(x /= 2)));
        return { x: 2 * cosy * Math.sin(x) * sincia, y: Math.sin(y) * sincia };
    }
    private degreesToRadians(deg: number): number {
        return deg * (Math.PI / 180);
    }
    private calculateBound(value: number, min: number, max: number): number {
        if (!isNullOrUndefined(min)) {
            value = Math.max(value, min);
        }
        if (!isNullOrUndefined(max)) {
            value = Math.min(value, max);
        }
        return value;
    }
    private getTileGeoLocation(layerX: number, layerY: number): LatLog {
        let container: MapLocation = this.getBound(this.element.id);
        let element: MapLocation = this.getBound(this.element.id + '_tile_parent');
        return this.pointToLatLong(layerX + this.areaRect.x - (element.x - container.x), layerY +
            this.areaRect.y - (element.y - container.y));
    }
    private pointToLatLong(pageX: number, pageY: number): LatLog {
        let mapSize: number = 256 * Math.pow(2, this.scaleFactor);
        let x1: number = (this.clip(pageX - (this.translatePoint.x * this.scaleFactor), 0, mapSize - 1) / mapSize) - 0.5;
        let y1: number = 0.5 - (this.clip(pageY - (this.translatePoint.y * this.scaleFactor), 0, mapSize - 1) / mapSize);
        let lat: number = 90 - 360 * Math.atan(Math.exp(-y1 * 2 * Math.PI)) / Math.PI;
        let lng: number = 360 * x1;
        return { latitude: lat, longitude: lng };
    }
    // tslint:disable:max-line-length
    private generateTiles(): void {
        let size: Size = { width: 1536, height: 450 };
        let xCount: number = 0;
        let yCount: number = 0;
        let xLeft: number = 0;
        let xRight: number = 0;
        xCount = yCount = Math.pow(2, this.tileZoomLevel);
        let tiles: TileAttribute[] = [];
        if ((this.tileTranslatePoint.x + (xCount * 256)) < size.width) {
            xLeft = this.tileTranslatePoint.x > 0 ? Math.ceil(this.tileTranslatePoint.x / 256) : 0;
            xRight = ((this.tileTranslatePoint.x + xCount * 256) < size.width) ?
                Math.ceil((size.width - (this.tileTranslatePoint.x + xCount * 256)) / 256) : 0;
        }
        xCount += xLeft + xRight;
        xCount = (this.horizontalPanXCount >= xCount) ? this.horizontalPanXCount : xCount;
        this.horizontalPan = false;
        let endY: number = Math.min(yCount, ((-this.tileTranslatePoint.y + size.height) / 256) + 1);
        let endX: number = Math.min(xCount, ((-this.tileTranslatePoint.x + size.width + (xRight * 256)) / 256) + 1);
        let startX: number = (-((this.tileTranslatePoint.x + (xLeft * 256)) + 256) / 256);
        let startY: number = (-(this.tileTranslatePoint.y + 256) / 256);
        for (let i: number = Math.round(startX); i < Math.round(endX); i++) {
            for (let j: number = Math.round(startY); j < Math.round(endY); j++) {
                let x: number = 256 * i + this.tileTranslatePoint.x;
                let y: number = 256 * j + this.tileTranslatePoint.y;
                if (x > -256 && x <= size.width && y > -256 && y < size.height) {
                    if (j >= 0) {
                        let tileI: number = i;
                        if (i < 0) {
                            tileI = (tileI % yCount) + yCount;
                        }
                        let tile: TileAttribute = { x: tileI % yCount, y: j, left: x, top: y, height: 256, width: 256, src: null };
                        if (this.urlTemplate.indexOf('virtualearth') === -1) {
                            tile.src = this.urlTemplate.replace('level', this.scaleFactor.toString()).replace('tileX', tile.x.toString()).replace('tileY', tile.y.toString());
                        } else {
                            tile.src = this.getBingMap(tile, this.urlTemplate);
                        }
                        tiles.push(tile);
                    }
                }
            }
        }
        let animatedElement: HTMLElement = document.getElementById(this.element.id + '_animated_tiles');
        for (let j: number = 0; j < tiles.length; j++) {
            let tileElement: HTMLElement = document.getElementById(this.element.id + 'tile' + j);
            let imgElement: HTMLImageElement = null;
            let isNewTile: boolean = false;
            if (!tileElement) {
                tileElement = <HTMLDivElement>document.createElement('div');
                tileElement.id = this.element.id + 'tile' + j;
                tileElement.style.userSelect = 'none';
                imgElement = document.createElement('img');
                if (this.newTiles.indexOf(j) === -1) {
                    this.newTiles.push(j);
                }
                isNewTile = true;
            } else {
                imgElement = <HTMLImageElement>tileElement.childNodes[0];
            }
            if (imgElement.src !== tiles[j].src) {
                imgElement.setAttribute('src', tiles[j].src);
            }
            tileElement.style.position = 'absolute';
            tileElement.style.left = tiles[j].left + 'px';
            tileElement.style.top = tiles[j].top + 'px';
            tileElement.style.height = tiles[j].height + 'px';
            tileElement.style.width = tiles[j].width + 'px';
            if (isNewTile) {
                tileElement.appendChild(imgElement);
                animatedElement.appendChild(tileElement);
            }
        }
    }
    private getBingMap(tile: any, imageUrl: string): string {
        let quadKey: string = '';
        let subDomain: string;
        let subDomains: string[] = ['t0', 't1', 't2', 't3'];
        let maxZoom: number = Math.min(this.tileZoomLevel, this.options.maxZoom);
        for (let i: number = maxZoom; i > 0; i--) {
            let digit: number = 0;
            let mask: number = 1 << (i - 1);
            if ((tile.x & mask) !== 0) {
                digit++;
            }
            if ((tile.y & mask) !== 0) {
                digit += 2;
            }
            quadKey = quadKey + '' + digit;
        }
        subDomain = subDomains[Math.min(parseInt(quadKey.substr(quadKey.length - 1, 1), 10), subDomains.length)];
        imageUrl = imageUrl.replace('{quadkey}', quadKey).replace('{subdomain}', subDomain);
        return imageUrl += '&mkt=' + 'en-US' + '&ur=IN&Key=' + this.key;
    }
    private clip(value: number, minValue: number, maxValue: number): number {
        return Math.min(Math.max(value, minValue), maxValue);
    }
    private svgPoint(elem: any, x: number, y: number): MapLocation {
        let p: DOMPoint = this.svg.createSVGPoint();
        p.x = x;
        p.y = y;
        return p.matrixTransform(elem.getScreenCTM().inverse());
    }
    public clusterExpand(target: any, options: any, dotnetRef: BlazorDotnetObject): void {
        let datasource: any = JSON.parse(options.dataSource);
		let layerIndex: number = parseInt(target[0].split('_LayerIndex_')[1].split("_")[0], 10);
        let clusterSettingList: any[] = JSON.parse(this.options.markerCluster);
        let connectingLine: any = JSON.parse(options.connectingLine);
        let clusterSetting: any = clusterSettingList[layerIndex];
        let data: any;
        let id: string = target[0].split('_LayerIndex_');
        let index: number = parseInt(id[1].split('_')[0], 10);
        let markCollection: any[] = [];
        let clusterCollection: any[] = [];
        if (target[0].indexOf('_MarkerIndex_') > -1) {
            let markerIndex: number = parseInt(id[1].split('_MarkerIndex_')[1].split('_')[0], 10);
            let dataIndex: number = parseInt(id[1].split('_dataIndex_')[1].split('_')[0], 10);
            if (!isNaN(markerIndex)) {
                data = datasource[dataIndex];
                let collection1: any[] = [];
                if (target[0].indexOf('_cluster_') > -1 && clusterSetting.AllowClustering) {
                    for (let i: number = 0; i < datasource.length; i++) {
                        if (datasource[i]['Latitude'] === data['Latitude'] && datasource[i]['Longitude'] === data['Longitude']) {
                            collection1.push({ data: data, index: index });
                        }
                    }
                }
                if ((target[0].indexOf('_cluster_') > -1)) {
                    let isClusterSame: boolean = false;
                    let clusterElement: HTMLElement = document.getElementById(target[0].indexOf('_datalabel_') > -1 ?
                        target[0].split('_datalabel_')[0] : target[0]);
                    let indexes: number[] = clusterElement.innerHTML.split(',').map(Number);
                    collection1 = [];
                    for (let k: number = 0, collectionIndex: number[] = indexes; k < collectionIndex.length; k++) {
                        let i: number = collectionIndex[k];
                        collection1.push({ data: datasource[i], index: i });
                        datasource[i]['text'] = '';
                        markCollection.push(datasource[i]);
                    }
                    isClusterSame = false;
                    clusterCollection.push({
                        data: collection1, layerIndex: index, markerIndex: markerIndex, dataIndex: dataIndex,
                        targetClusterIndex: +(target[0].split('_cluster_')[1].indexOf('_datalabel_') > -1 ?
                            target[0].split('_cluster_')[1].split('_datalabel_')[0] : target[0].split('_cluster_')[1]),
                        isClusterSame: isClusterSame
                    });
                }
            }
        }
        if (clusterCollection.length > 0) {
            this.sameMarkerData = clusterCollection;
            let markerGroup: HTMLElement = document.getElementById(id[0] + '_MarkerGroup');
            if (this.markerClusterExpandCheck) {
                this.mergeSeparateCluster(this.sameMarkerData, id[0]);
                this.markerClusterExpandCheck = false;
            } else {
                this.clusterSeparate(this.sameMarkerData, markerGroup, true, id[0], connectingLine);
                this.markerClusterExpandCheck = true;
            }
        }
    }
    private mergeSeparateCluster(sameMarkerData: MarkerClusterData[], id: string): void {
        let layerIndex: number = sameMarkerData[0].layerIndex;
        let clusterIndex: number = sameMarkerData[0].targetClusterIndex;
        let markerIndex: number = sameMarkerData[0].markerIndex;
        let dataIndex: number = sameMarkerData[0].dataIndex;
        let markerId: string = id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex;
        let clusterId: string = markerId + '_dataIndex_' + dataIndex + '_cluster_' + clusterIndex;
        let clusterEle: HTMLElement = this.getElementId(clusterId);
        let clusterEleLabel: HTMLElement = this.getElementId(clusterId + '_datalabel_' + clusterIndex);
        clusterEle.setAttribute('visibility', 'visible');
        clusterEleLabel['style']['visibility'] = 'visible';
        let markerEle: HTMLElement;
        let markerDataLength: number = sameMarkerData[0].data.length;
        for (let i: number = 0; i < markerDataLength; i++) {
            markerEle = this.getElementId(markerId + '_dataIndex_' + sameMarkerData[0].data[i]['index']);
            markerEle['style']['visibility'] = 'hidden';
        }
        this.removeElement(id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_markerClusterConnectorLine');
    }
    private removeElement(id: string): void {
        let element: HTMLElement = document.getElementById(id);
        if (!isNullOrUndefined(element)) {
            element.remove();
        }
    }
    private drawPath(options: PathOption): Element {
        let path: HTMLElement | SVGPathElement = document.getElementById(options.id);
        if (isNullOrUndefined(path)) {
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        }
        path.setAttribute('id', options.id);
        path.setAttribute('d', options.d);
        path.setAttribute('opacity', options.opacity.toString());
        path.setAttribute('stroke', options.stroke);
        path.setAttribute('stroke-width', options.strokeWidth.toString());
        return path;
    }
    private clusterSeparate(sameMarkerData: MarkerClusterData[], markerElement: Element | HTMLElement, isDom: boolean, id: string,
        connectorLine: any): void {
        let layerIndex: number = sameMarkerData[0].layerIndex;
        let markerIndex: number = sameMarkerData[0].markerIndex;
        let clusterIndex: number = sameMarkerData[0].targetClusterIndex;
        let dataIndex: number = sameMarkerData[0].dataIndex;
        let getElementFunction: Function = isDom ? this.getElementId : markerElement.querySelector.bind(markerElement);
        let getQueryConnect: string = isDom ? '' : '#';
        let markerId: string = id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex;
        let clusterId: string = markerId + '_dataIndex_' + dataIndex + '_cluster_' + clusterIndex;
        let clusterEle: Element = getElementFunction(getQueryConnect + '' + clusterId);
        let clusterEleLabel: Element = getElementFunction(getQueryConnect + '' + clusterId + '_datalabel_' + clusterIndex);
        clusterEle.setAttribute('visibility', 'hidden');
        clusterEleLabel.setAttribute('visibility', 'hidden');
        let markerEle: Element = getElementFunction(getQueryConnect + '' + markerId + '_dataIndex_' + dataIndex);
        let height: number = 25;
        let width: number = 25;
        let centerX: number = +clusterEle.getAttribute('transform').split('translate(')[1].trim().split(' ')[0];
        let centerY: number = +clusterEle.getAttribute('transform').split('translate(')[1].trim().split(' ')[1].split(')')[0].trim();
        let radius: number = width + 5;
        let area: number = 2 * 3.14 * radius;
        let totalMarker: number = 0;
        let numberOfMarker: number = Math.round(area / width);
        totalMarker += numberOfMarker;
        let markerDataLength: number = sameMarkerData[0].data.length;
        let percent: number = Math.round((height / area) * 100);
        percent = markerDataLength < numberOfMarker ? 100 / markerDataLength : percent;
        let angle: number = (percent / 100) * 360;
        let newAngle: number = markerDataLength < numberOfMarker ? 45 : 0;
        let count: number = 1;
        let start: string = 'M ' + centerX + ' ' + centerY + ' ';
        let path: string = '';
        for (let i: number = 0; i < markerDataLength; i++) {
            if (totalMarker === i || Math.round(newAngle) >= 360) {
                count++;
                radius = (width + 5) * count;
                newAngle = 0;
                area = 2 * 3.14 * radius;
                numberOfMarker = Math.round(area / height);
                percent = Math.round((height / area) * 100);
                while (percent * numberOfMarker < 100) {
                    numberOfMarker++;
                }
                angle = ((percent / 100) * 360);
                totalMarker += numberOfMarker;
            }
            let x1: number = centerX + radius * Math.sin((Math.PI * 2 * newAngle) / 360);
            let y1: number = centerY + radius * Math.cos((Math.PI * 2 * newAngle) / 360);
            path += start + 'L ' + (x1) + ' ' + y1 + ' ';
            markerEle = getElementFunction(getQueryConnect + '' + markerId + '_dataIndex_' + sameMarkerData[0].data[i]['index']);
            markerEle.setAttribute('transform', 'translate( ' + x1 + ' ' + y1 + ')');
            markerEle['style']['visibility'] = 'visible';
            clusterEleLabel['style']['visibility'] = 'hidden';
            newAngle += angle;
        }
        let options: PathOption = {
            d: path, id: id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_dataIndex_' +
                dataIndex + '_markerClusterConnectorLine', stroke: isNullOrUndefined(connectorLine.color) ? "#000000" :
                connectorLine.color, opacity: connectorLine.Opacity, strokeWidth: connectorLine.Width
        };
        markerElement = isDom ? getElementFunction(id + '_MarkerGroup') : markerElement;
        let groupEle: Element = createGroup(id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex +
            '_markerClusterConnectorLine');
        groupEle.appendChild(this.drawPath(options));
        markerElement.insertBefore(groupEle, markerElement.querySelector('#' + markerId + '_dataIndex_0'));
    }
    private getElementId(id: string): HTMLElement {
        return document.getElementById(id);
    }
    //tslint:disable:max-func-body-length     
    public clusterMarkers(layerIndex: number, id: string, clusterTemplate: boolean): void {
        this.removeCluster();
        let bounds1: ClientRect;
        let bounds2: ClientRect;
        let indexCollection: number[] = [];
        let colloideBounds: ClientRect[] = [];
        let tempX: number = 0;
        let tempY: number = 0;
        let markerClusterList: any[] = JSON.parse(this.options.markerCluster);
        let markerCluster: any = markerClusterList[layerIndex]
        let labelStyleList: any[] = JSON.parse(this.options.markerClusterLabel);
        let labelStyle: any = labelStyleList[layerIndex];
        let clusterGroup: Element = createGroup(id + '_LayerIndex_' + layerIndex + '_cluster');
        let postionY: number = (15 / 4);
        let m: number = 0;
        let markerCollection: any;
        let tempElement: Element;
        let balloonGroup: any;
        let clusterColloideBounds: any[] = [];
        let containerBound: HTMLElement = document.getElementById(id);
        let markerTemplate: HTMLElement = document.getElementById(id + '_MarkerGroup');
        let isTemplate: boolean = clusterTemplate;
        if (!isNullOrUndefined(markerTemplate) && markerTemplate.childElementCount <= 0) {
            if (markerTemplate.childElementCount <= 0) {
                markerTemplate = document.getElementById(id + '_LayerIndex_' + layerIndex + '_Markers_Template_Group');
            }
        }
        markerTemplate = !isNullOrUndefined(markerTemplate) ? markerTemplate : document.getElementById(id + '_LayerIndex_' +
            layerIndex + '_Markers_Template_Group');
        if (markerTemplate) {
            for (let o: number = 0; o < markerTemplate.childElementCount; o++) {
                indexCollection = [];
                if (markerTemplate.children[o]['style']['visibility'] !== 'hidden') {
                    tempElement = <Element>markerTemplate.children[o];
                    let bounds1: ClientRect = tempElement.getBoundingClientRect();
                    indexCollection.push(o);
                    if (bounds1 !== null) {
                        for (let p: number = o + 1; p < markerTemplate.childElementCount; p++) {
                            if (markerTemplate.children[p]['style']['visibility'] !== 'hidden') {
                                tempElement = markerTemplate.children[p];
                                let bounds2: ClientRect = tempElement.getBoundingClientRect();
                                if (bounds2 !== null) {
                                    if (!(bounds1.left > bounds2.right || bounds1.right < bounds2.left
                                        || bounds1.top > bounds2.bottom || bounds1.bottom < bounds2.top)) {
                                        colloideBounds.push(bounds2);
                                        markerTemplate.children[p]['style']['visibility'] = 'hidden';
                                        indexCollection.push(p);
                                    }
                                }
                            }
                        }
                        tempX = bounds1.left + bounds1.width / 2;
                        tempY = bounds1.top + bounds1.height;
                        if (colloideBounds.length > 0) {
                            let container: ClientRect = containerBound.getBoundingClientRect();
                            tempX = tempX - container['left'];
                            tempY = tempY - container['top'];
                            let dataIndex: number = parseInt(markerTemplate.children[o]['id'].split('_dataIndex_')[1].split('_')[0], 10);
                            let markerIndex: number =
                                parseInt(markerTemplate.children[o]['id'].split('_MarkerIndex_')[1].split('_')[0], 10);
                            let layerIndex: number = parseInt(markerTemplate.children[o]['id'].split('_LayerIndex_')[1].split('_')[0], 10);
                            let transform: string = markerTemplate.children[o].getAttribute("transform");
                            let transformString: string = transform.replace(/[^ .\d]/g, '');
                            var translateValue: string[] = transformString.split(" ");
                            tempX = parseFloat(translateValue[1]);
                            tempY = parseFloat(translateValue[2]);
                            let clusterID: string = id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex +
                                '_dataIndex_' + dataIndex + '_cluster_' + (m);
                            let labelID: string = id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex +
                                '_dataIndex_' + dataIndex + '_cluster_' + (m) + '_datalabel_' + m;
                            m++;
                            let shape: any;
                            switch (markerCluster.Shape) {
                                case 'Circle':
                                    shape = this.createClusterShape('circle', clusterID, markerCluster.Fill, markerCluster.Opacity,
                                        'translate( ' + tempX + ' ' + tempY + ' )', true, indexCollection);
                                    shape.setAttribute('r', (markerCluster.Height));
                                    break;
                                case 'Rectangle':
                                    shape = this.createClusterShape('rect', clusterID, markerCluster.Fill, markerCluster.Opacity,
                                        'translate( ' + tempX + ' ' + tempY + ' )', true, indexCollection);
                                    shape.setAttribute('x', -(markerCluster.Width / 2));
                                    shape.setAttribute('y', -(markerCluster.Height / 2));
                                    shape.setAttribute('height', (markerCluster.Height));
                                    shape.setAttribute('width', (markerCluster.Width));
                                    break;
                                case 'Balloon':
                                    balloonGroup = createGroup(clusterID);
                                    /* tslint:disable-next-line:max-func-body-length */
                                    let balloonPath: string = 'M15,0C8.8,0,3.8,5,3.8,11.2C3.8,17.5,9.4,24.4,15,30c5.6-5.6,11.2-12.5,11.2-18.8C26.2,5,21.2,0,15,0z M15,16' +
                                        'c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S17.8,16,15,16z';
                                    shape = this.createClusterShape('path', clusterID, markerCluster.Fill, markerCluster.Opacity,
                                        'translate( ' + (-(markerCluster.Width / 2)) + ', ' + (-(markerCluster.Height)) +
                                        ' ) scale( ' + (markerCluster.Width / 30) + ', ' + (markerCluster.Height / 30) + ' )', true, indexCollection);
                                    shape.setAttribute('d', balloonPath);
                                    shape.setAttribute('stroke', 'transparent');
                                    shape.setAttribute('stroke-width', 1);
                                    balloonGroup.appendChild(shape);
                                    balloonGroup.setAttribute('style', 'visibility:visible');
                                    balloonGroup.setAttribute('style', 'cursor: pointer');
                                    balloonGroup.setAttribute('class', 'clusterGroup');
                                    balloonGroup.setAttribute('transform', 'translate( ' + tempX + ' ' + tempY + ' )');
                                    break;
                                case 'Image':
                                    let locationX: number = 0;
                                    let locationY: number = 0;
                                    let x: number = -(locationX + (markerCluster.Width / 2));
                                    let y: number = -(locationY + (markerCluster.Height / 2));
                                    shape = this.createClusterShape('image', clusterID, null, null,
                                        'translate( ' + tempX + ' ' + tempY + ' )', true, indexCollection);
                                    shape.setAttributeNS(null, 'height', markerCluster.Height);
                                    shape.setAttributeNS(null, 'width', markerCluster.Width);
                                    shape.setAttributeNS('http://www.w3.org/1999/xlink', 'href', markerCluster.ImageUrl);
                                    shape.setAttributeNS(null, 'x', x);
                                    shape.setAttributeNS(null, 'y', y);
                                    break;
                                case 'Cross':
                                case 'Diamond':
                                case 'Star':
                                case 'Triangle':
                                case 'HorizontalLine':
                                case 'VerticalLine':
                                case 'InvertedTriangle':
                                case 'Pentagon':
                                    let path: string = '';
                                    path = calculateShape(markerCluster.Shape, { height: markerCluster.Height, width: markerCluster.Width }, { x: 0, y: 0 });
                                    shape = this.createClusterShape('path', clusterID, markerCluster.Fill, markerCluster.Opacity,
                                        'translate( ' + tempX + ' ' + tempY + ' )', false, indexCollection);
                                    shape.setAttribute('d', path);
                                    shape.setAttribute('stroke', 'transparent');
                                    shape.setAttribute('stroke-width', 1);
                                    break;
                            }
                            let textElement: any = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                            textElement.setAttribute('id', labelID);
                            textElement.setAttribute('x', '0');
                            textElement.setAttribute('y', postionY.toString());
                            textElement.setAttribute('fill', labelStyle.Color);
                            textElement.setAttribute('font-size', labelStyle.Size);
                            textElement.setAttribute('font-style', labelStyle.FontStyle);
                            textElement.setAttribute('font-family', labelStyle.FontFamily);
                            textElement.setAttribute('font-weight', labelStyle.FontWeight);
                            textElement.setAttribute('text-anchor', 'middle');
                            textElement.setAttribute('transform', 'translate( ' + tempX + ' ' + tempY + ' )');
                            textElement.setAttribute('opacity', '1');
                            textElement.setAttribute('style', 'cursor: pointer');
                            textElement.setAttribute('style', 'visibility: visible');
                            textElement.setAttribute('class', 'clusterGroup');
                            textElement.innerHTML = (colloideBounds.length + 1).toString();
                            clusterGroup.appendChild(textElement);
                            clusterGroup.setAttribute('class', 'clusterGroup');
                            if (markerCluster.Shape !== 'Balloon') {
                                clusterGroup.appendChild(shape);
                            } else {
                                clusterGroup.appendChild(balloonGroup);
                            }
                            markerTemplate.children[o]['style']['visibility'] = 'hidden';
                        }
                        colloideBounds = [];
                    }
                }
            }
        }
        if (clusterGroup.childElementCount > 0) {
            if (!isTemplate) {
                let layerElement: HTMLElement = document.getElementById(id + '_LayerIndex_' + layerIndex);
                layerElement.appendChild(clusterGroup);
                markerCollection = document.getElementById(id + '_MarkerGroup');
            } else {
                markerTemplate.appendChild(clusterGroup);
            }
            for (let o: number = 0; o < clusterGroup.childElementCount; o++) {
                if (clusterGroup.childNodes[o]['style']['visibility'] !== 'hidden') {
                    tempElement = <Element>clusterGroup.childNodes[o];
                    bounds1 = tempElement.getBoundingClientRect();
                    if (bounds1 !== null && !(tempElement.id.indexOf('_datalabel_') > -1)) {
                        for (let p: number = o + 1; p < clusterGroup.childElementCount; p++) {
                            if (clusterGroup.childNodes[p]['style']['visibility'] !== 'hidden') {
                                let tempElement1: Element = <Element>clusterGroup.children[p];
                                bounds2 = tempElement1.getBoundingClientRect();
                                if (bounds2 !== null && !(tempElement1.id.indexOf('_datalabel_') > -1)) {
                                    if (!(bounds1.left > bounds2.right || bounds1.right < bounds2.left
                                        || bounds1.top > bounds2.bottom || bounds1.bottom < bounds2.top)) {
                                        clusterColloideBounds.push(tempElement1);
                                        clusterColloideBounds.push(clusterGroup.childNodes[p - 1]);
                                        clusterGroup.childNodes[p]['style']['visibility'] = 'hidden';
                                        clusterGroup.childNodes[p - 1]['style']['visibility'] = 'hidden';
                                        indexCollection.push(p);
                                    }
                                }
                            }
                        }
                        if (clusterColloideBounds.length > 0) {
                            tempElement = <Element>clusterGroup.childNodes[o];
                            for (let i: number = 0; i < clusterColloideBounds.length; i++) {
                                if (tempElement.tagName === 'g') {
                                    tempElement.childNodes[0].textContent = tempElement.childNodes[0].textContent + ',' +
                                        clusterColloideBounds[i].textContent;
                                } else {
                                    tempElement.textContent = tempElement.textContent + ',' + clusterColloideBounds[i].textContent;
                                }
                                clusterGroup.childNodes[o - 1].textContent = ((+(clusterGroup.childNodes[o - 1].textContent)) +
                                    (+(clusterColloideBounds[i + 1].textContent))).toString();

                                i++;
                            }
                        }
                        clusterColloideBounds = [];
                    }
                }
            }
            while (0 < clusterGroup.childNodes.length) {
                if (!isTemplate) {
                    markerCollection.insertBefore(clusterGroup.childNodes[0], markerCollection.firstChild);
                } else {
                    markerTemplate.insertBefore(clusterGroup.childNodes[0], markerTemplate.firstChild);
                }
            }
            if (!isTemplate) {
                let layerElement: HTMLElement = document.getElementById(id + '_LayerIndex_' + layerIndex);
                layerElement.appendChild(markerCollection);
                layerElement.removeChild(clusterGroup);
            } else {
                markerTemplate.removeChild(clusterGroup);
            }
        }
    }
    private createClusterShape(shapeType: string, id: string, fill: string, opacity: number,
        transform: string, isClass: boolean, indexCollection: number[]): any {
        let shape: any = document.createElementNS('http://www.w3.org/2000/svg', shapeType);
        shape.setAttribute('id', id);
        shape.setAttribute('fill', fill);
        shape.setAttribute('opacity', opacity);
        shape.setAttribute('transform', transform);
        shape.setAttribute('style', 'visibility:visible');
        shape.setAttribute('style', 'cursor: pointer');
        if (!isClass) {
            shape.setAttribute(null, 'class', 'clusterGroup');
        } else {
            shape.setAttribute('class', 'clusterGroup');
        }
        shape.innerHTML = indexCollection.toString();
        return shape;
    }
    private click(event: MouseEvent): void {
        let id: string = event.target['id'];
        let clientValue: MapLocation = this.getMousePosition(event.pageX, event.pageY);
        let parentId: string = id.split('_')[0];
        if (id.indexOf('_Left_Page_Rect') > -1 || id.indexOf('_Right_Page_Rect') > -1) {
            this.dotNetRef.invokeMethodAsync('TriggerLegendPaging', id.indexOf('_Left_Page_Rect') > -1 ? 1 : 0,
                id.indexOf('_Right_Page_Rect') > -1 ? 1 : 0);
        }
        if (id.indexOf('shapeIndex') > -1 || id.indexOf('Tile') > -1 || this.markerClusterExpandCheck) {
            this.mergeSeparateCluster(this.sameMarkerData, this.id);
            this.markerClusterExpandCheck = false;
        }
        if (id.indexOf('_Zooming_') > -1 && this.options.enableZoom) {
            let layerCollection: string = parentId + '_LayerCollections';
            let factor: number = 1;
            if (id.indexOf('_ZoomIn_') > -1) {
                let zoomType: string = id.split('_Zooming_ToolBar_')[1].split('_')[0];
                let eventType: string = event.type;
                factor = this.factorCount === 0 ? this.options.factor + 1 : this.scaleFactor + 1;
                this.factorCount++;
                if (factor >= 1) {
                    this.scaleFactor = factor;
                    this.removeCluster();
                    this.dotNetRef.invokeMethodAsync('TriggerZoom', id, 1, zoomType, eventType);
                }
            }
            if (id.indexOf('_ZoomOut_') > -1) {
                let zoomType: string = id.split('_Zooming_ToolBar_')[1].split('_')[0];
                let eventType: string = event.type;
                factor = this.factorCount === 0 ? this.options.factor - 1 : this.scaleFactor - 1;
                this.factorCount++;
                if (factor >= 1) {
                    this.scaleFactor = factor;
                    this.removeCluster();
                    this.dotNetRef.invokeMethodAsync('TriggerZoom', id, 1, zoomType, eventType);
                }
            }
            if (id.indexOf('_Reset_') > -1) {
                let zoomType: string = id.split('_Zooming_ToolBar_')[1].split('_')[0];
                let eventType: string = event.type;
                this.removeCluster();
                this.dotNetRef.invokeMethodAsync('TriggerZoom', id, 1, zoomType, eventType);
            }
            if (id.indexOf('_Zoom_') > -1) {
                this.zoomClick = true;
                this.allowPanning = false;
            }
            if (id.indexOf('_Pan_') > -1) {
                this.zoomClick = false;
                this.allowPanning = false;
            }
        }
        if (id.indexOf('_LayerIndex_') > -1 && id.indexOf('_MarkerIndex_') > -1) {
            let layerIndex: number = parseInt(id.split('_LayerIndex_')[1].split('_')[0], 10);
            let markerIndex: number = parseInt(id.split('_MarkerIndex_')[1].split('_')[0], 10);
            let dataIndex: number = parseInt(id.split('_dataIndex_')[1].split('_')[0], 10);
            let element: HTMLElement = document.getElementById(id);
            let dataElement: string[];
            if (element.innerHTML.length > 0) {
                dataElement = element.innerHTML.split(',');
            }
            this.removeAllHighlight();
            this.dotNetRef.invokeMethodAsync('TriggerMarkerClick', layerIndex, markerIndex, dataIndex, id,
                clientValue.x, clientValue.y, dataElement, id.indexOf('cluster') > -1 ? 'cluster' : 'marker');
        }
        if (id.indexOf('shapeIndex') > -1 && this.options.tooltipDisplayMode === 'Click') {
            let layerIndex: number = parseInt(id.split('_LayerIndex_')[1].split('_')[0], 10);
            let shapeIndex: number = parseInt(id.split('_shapeIndex_')[1].split('_')[0], 10);
            this.dotNetRef.invokeMethodAsync('TriggerShapeTooltip', id, clientValue.x, clientValue.y, layerIndex, shapeIndex, 'Shape', 0);
        }
        if (id.indexOf('_LayerIndex_') > -1 && id.indexOf('BubbleIndex') > -1) {
            let layerIndex: number = parseInt(id.split('_LayerIndex_')[1].split('_')[0], 10);
            let markerIndex: number = parseInt(id.split('_BubbleIndex_')[1].split('_')[0], 10);
            let dataIndex: number = parseInt(id.split('_dataIndex_')[1].split('_')[0], 10);
            let element: HTMLElement = document.getElementById(id);
            this.dotNetRef.invokeMethodAsync('TriggerBubbleClick', layerIndex, markerIndex, dataIndex, id, clientValue.x, clientValue.y);
        }
        if (id.indexOf('_Legend_') > -1) {
            this.removeAllHighlight();
            this.dotNetRef.invokeMethodAsync('TriggerLegendClick', parseInt(id.split('_Index_')[1].split('_')[0], 10));
        }
        if (id.indexOf('_shapeIndex_') === -1 && id.indexOf('_MarkerIndex_') === -1 && id.indexOf('_BubbleIndex_') === -1 &&
            this.options.tooltipDisplayMode === 'Click') {
            this.dotNetRef.invokeMethodAsync('TriggerShapeTooltip', '', clientValue.x, clientValue.y, 0, 0, '', 0);
        }
    }
    private removeCluster(): void {
        let samecluster: NodeListOf<Element> = document.querySelectorAll('[class="clusterGroup"]');
        if (samecluster.length > 0) {
            for (let i: number = 0; i < samecluster.length; i++) {
                document.getElementById(samecluster[i].id).remove();
            }
        }
        let visibleMarker: NodeListOf<Element> = document.querySelectorAll('[style="visibility: hidden;"]');
        for (let i: number = 0; i < visibleMarker.length; i++) {
            let visibilityChange: HTMLElement = document.getElementById(visibleMarker[i].id);
            visibilityChange.setAttribute('style', 'visibility: visible;');
        }
    }
    private createImageUrl(element: HTMLElement, type: string): string {
        let svgData: string = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            element.outerHTML + '</svg>';
        return window.URL.createObjectURL(new Blob(type === 'SVG' ? [svgData] : [(new XMLSerializer()).serializeToString(element)], { type: 'image/svg+xml' }));
    }
    public async imageExport(type: string, fileName: string, allowDownload: boolean): Promise<any> {
        let proxy: any = this;
        return new Promise((resolve: any, reject: any) => {
            let imageCanvasElement: HTMLCanvasElement = document.createElement('canvas');
            let elementBound: ClientRect = proxy.element.getBoundingClientRect();
            imageCanvasElement.width = elementBound.width;
            imageCanvasElement.height = elementBound.height;
            let element: HTMLElement = document.getElementById(proxy.element.id + '_svg');
            let url: string = proxy.createImageUrl(element, type);
            let tileElementCount: number = document.getElementById(proxy.element.id + '_animated_tiles').childNodes.length;
            let context: CanvasRenderingContext2D = imageCanvasElement.getContext('2d');
            let titleElement: HTMLElement = document.getElementById(proxy.element.id + '_Map_title');
            context.fillStyle = document.getElementById(proxy.element.id + '_MapBorder').getAttribute('fill');
            context.fillStyle = context.fillStyle === 'transparent' ? '#ffffff' : context.fillStyle;
            context.fillStyle = proxy.options.background ? proxy.options.background : '#ffffff';
            context.font = titleElement.getAttribute('font-size') + ' Arial';
            context.fillStyle = titleElement.getAttribute('fill');
            context.fillText(titleElement.textContent, parseFloat(titleElement.getAttribute('x')), parseFloat(titleElement.getAttribute('y')));
            context.save();
            let svgParent: HTMLElement = document.getElementById(proxy.element.id + '_Tile_SVG_Parent');
            context.rect(parseFloat(svgParent.style.left), parseFloat(svgParent.style.top), parseFloat(svgParent.style.width), parseFloat(svgParent.style.height));
            context.clip();
            context.fillRect(0, 0, elementBound.width, elementBound.height);
            proxy.exportedCount = 0;
            let promises: Promise<any>[] = [];
            for (let i: number = 0; i < tileElementCount; i++) {
                let tile: HTMLElement = document.getElementById(proxy.element.id + 'tile' + i);
                let exportTileImg: any = new Image();
                exportTileImg.crossOrigin = 'Anonymous';
                promises.push(proxy.renderImages(imageCanvasElement, tile, context, exportTileImg, tileElementCount, type, fileName, url, proxy, allowDownload));
                exportTileImg.src = tile.children[0].getAttribute('src');
            }
            Promise.all(promises).then((values: string[]) => {
                for (let i: number = 0; i < values.length; i++) {
                    if (values[i] != null) {
                        resolve(values[i]);
                        break;
                    }
                }
            });
        });
    };
    private renderImages(canvasElement: any, tile: any, context: any, exportTileImg: any, tileElementCount: number,
        type: string, fileName: string, url: string, proxy: SfMaps, allowDownload: boolean): Promise<any> {
        return new Promise(function (resolve, reject) {
            (exportTileImg as HTMLImageElement).onload = function () {
                proxy.exportedCount++;
                context.setTransform(1, 0, 0, 1, parseFloat(tile.style.left) + 10, parseFloat(tile.style.top) +
                    (parseFloat(document.getElementById(proxy.element.id + '_tile_parent').style.top)));
                context.drawImage(exportTileImg, 0, 0);
                if (proxy.exportedCount === tileElementCount) {
                    let svgParent: HTMLElement = document.getElementById(proxy.element.id + '_Tile_SVG_Parent');
                    url = proxy.createImageUrl((svgParent.childNodes[0] as HTMLElement), type);
                    var image = new Image();
                    image.onload = function () {
                        context.setTransform(1, 0, 0, 1, parseFloat(svgParent.style.left), parseFloat(svgParent.style.top));
                        context.drawImage(image, 0, 0);
                        if (allowDownload) {
                            proxy.triggerDownload(type, fileName, canvasElement.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
                            resolve(null);
                        } else {
                            let base64String: string = (type === 'JPEG') ? canvasElement.toDataURL('image/jpeg') : (type === 'PNG') ? canvasElement.toDataURL('image/png') : '';
                            resolve(base64String);
                        }
                    };
                    image.src = url;
                } else {
                    resolve(null);
                }
            };
        });
    }
    private triggerDownload(type: any, fileName: string, url: string): void {
        let anchorElement: HTMLAnchorElement = document.createElement('a');
        anchorElement.download = fileName + '.' + type.toLocaleLowerCase();
        anchorElement.href = url;
        anchorElement.click();
    }
    private getMousePosition(pageX: number, pageY: number): MapLocation {
        let elementRect: ClientRect = this.element.getBoundingClientRect();
        let pageXOffset: number = this.element.ownerDocument.defaultView.pageXOffset;
        let pageYOffset: number = this.element.ownerDocument.defaultView.pageYOffset;
        let clientTop: number = this.element.ownerDocument.documentElement.clientTop;
        let clientLeft: number = this.element.ownerDocument.documentElement.clientLeft;
        let positionX: number = elementRect.left + pageXOffset - clientLeft;
        let positionY: number = elementRect.top + pageYOffset - clientTop;
        return new MapLocation((pageX - positionX), (pageY - positionY));
    }
    private getBound(id: string): MapLocation {
        let element: HTMLElement = document.getElementById(id);
        return { x: element.offsetLeft, y: element.offsetTop };
    }
    public render(): void {
        this.wireEvents();
    }
}
let Maps: object = {
    // tslint:disable
    getMarker(target: any, options: any, dotnetRef: BlazorDotnetObject, element: BlazorMapsElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.clusterExpand(target, options, dotnetRef);
        }
    },
    markerCluster(id: string, options: any, dotnetRef: BlazorDotnetObject, layerIndex: number, element: BlazorMapsElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.clusterMarkers(layerIndex, id, options.clusterTemplate);
        }
    },
    panDirection(xDiff: number, yDiff: number, x: number, y: number, scale: number, element: BlazorMapsElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.panning(xDiff, yDiff, x, y, scale);
        }
    },
    initialize(element: BlazorMapsElement, options: IMapsOptions, dotnetRef: BlazorDotnetObject): any {
        let instance: SfMaps = new SfMaps(element.id, element, options, dotnetRef);
        instance.render();
        return this.getElementSize(element);
    },
    getElementSize(element: HTMLElement): any {
        let elementWidth: number;
        let elementHeight: number;
        let x: number;
        let y: number;
        if (element !== null) {
            let elementRect: ClientRect = element.getBoundingClientRect();
            elementWidth = elementRect.width;
            elementHeight = elementRect.height;
            x = elementRect['x'];
            y = elementRect['y'];
        }
        return { width: elementWidth, height: elementHeight, isIE: Browser.isIE, x: x, y: y };
    },
    getElementBounds(id: string): object {
        let htmlElement: HTMLElement = document.getElementById(id);
        if (htmlElement) {
            let bounds: ClientRect = htmlElement.getBoundingClientRect();
            return {
                width: bounds.width, height: bounds.height, top: bounds.top, bottom: bounds.bottom,
                left: bounds.left, right: bounds.right
            };
        }
        return null;
    },
    getBound(id: string, dotNetRef: BlazorDotnetObject): object {
        let element: HTMLElement = document.getElementById(id);
        return { x: element.offsetLeft, y: element.offsetTop };
    },
    getBoundData(id: string): object {
        let element: HTMLElement = document.getElementById(id);
        return { x: element.getBoundingClientRect()['x'], y: element.getBoundingClientRect()['y'] };
    },
    async getTileZoom(id: string, left: number, top: number, url: string, height: number, width: number, index: number, dotNetRef: BlazorDotnetObject): Promise<any> {
        let element: HTMLElement = document.getElementById(id + '_animated_tiles');
        let scale: number = parseInt(element['className'], 10);
        element.children[index].setAttribute('style', 'top:' + '' + top + '; height:' + '' + height + ';width:' + '' + width + '; left:' + '' + left + '; position:absolute;');
        element.children[index].innerHTML = '';
        let image: any = document.createElement('img');
        image.src = url;
        element.children[index].appendChild(image);
        let layerElement: HTMLElement = document.getElementById(id + '_LayerCollections');
        for (let i: number = 0; i < layerElement.children.length; i++) {
            for (let j: number = 0; j < layerElement.children[i].childElementCount; j++) {
                if (layerElement.children[i].children[j].id.indexOf('MarkerGroup') > -1) {
                    for (let k: number = 0; k < layerElement.children[i].children[j].childElementCount; k++) {
                        let layerIndex: number =
                            parseInt(layerElement.children[i].children[j].children[k].id.split('_LayerIndex_')[1].split('_')[0], 10);
                        let markerIndex: number =
                            parseInt(layerElement.children[i].children[j].children[k].id.split('_MarkerIndex_')[1].split('_')[0], 10);
                        let dataIndex: number =
                            parseInt(layerElement.children[i].children[j].children[k].id.split('_dataIndex_')[1].split('_')[0], 10);
                        let point: any = await dotNetRef.invokeMethodAsync('ZoomMarker', layerIndex, markerIndex, dataIndex, 0, 0, scale, dotNetRef);
                        layerElement.children[i].children[j].children[k].setAttribute('transform',
                            'translate(' + point[0] + ',' + point[1] + ')');
                    }
                }
            }
        }
        return index;
    },
    getLayer(id: string, dotNetRef: BlazorDotnetObject): object {
        let element: HTMLElement = document.getElementById(id + '_LayerCollections');
        let bound: ClientRect = element.getBoundingClientRect();
        return { Bottom: bound.bottom, Height: bound.height, Left: bound.left, Right: bound.right, Top: bound.top, Width: bound.width, X: bound['x'], Y: bound['y'] };
    },
    getElement(id: string, dotNetRef: BlazorDotnetObject): object {
        let element: HTMLElement = document.getElementById(id);
        let bound: ClientRect = element.getBoundingClientRect();
        return { Bottom: bound.bottom, Height: bound.height, Left: bound.left, Right: bound.right, Top: bound.top, Width: bound.width, X: bound['x'], Y: bound['y'] };
    },
    getSvg(id: string, dotNetRef: BlazorDotnetObject): object {
        let element: HTMLElement = document.getElementById(id + '_svg');
        let bound: ClientRect = element.getBoundingClientRect();
        return { Bottom: bound.bottom, Height: bound.height, Left: bound.left, Right: bound.right, Top: bound.top, Width: bound.width, X: bound['x'], Y: bound['y'] };
    },
    updateTileTranslatePoint(tileTranslatePoint: MapLocation, translatePoint: MapLocation, areaRectX: number, areaRectY: number, areaRectWidth: number, areaRectHeight: number, tileZoomLevel: number, element: BlazorMapsElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.tileTranslatePoint = { x: tileTranslatePoint.x, y: tileTranslatePoint.y };
            element.blazor__instance.translatePoint = { x: translatePoint.x, y: translatePoint.y };
            element.blazor__instance.areaRect = { x: areaRectX, y: areaRectY, width: areaRectWidth, height: areaRectHeight };
            element.blazor__instance.tileZoomLevel = tileZoomLevel;
        }
    },
    updateTranslatePoint(translatePoint: MapLocation, areaRectX: number, areaRectY: number, areaRectWidth: number, areaRectHeight: number, marginLeft: number, marginTop: number, element: BlazorMapsElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.shapeTranslatePoint = translatePoint;
            element.blazor__instance.areaRect = { x: areaRectX, y: areaRectY, width: areaRectWidth, height: areaRectHeight };
            element.blazor__instance.marginLeft = marginLeft;
            element.blazor__instance.marginTop = marginTop;
        }
    },
    updateMapBound(element: BlazorMapsElement, mapBound: BaseMapBound): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.baseMapBounds = mapBound;
        }
    },
    setZoomOnClick(element: BlazorMapsElement, zoomOnClick: boolean): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.options.zoomOnClick = zoomOnClick;
        }
    },
    setDoubleClickZoom(element: BlazorMapsElement, doubleClickZoom: boolean): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.options.doubleClickZoom = doubleClickZoom;
        }
    },
    setPanningStatus(element: BlazorMapsElement, enablePanning: boolean): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.options.enablePanning = enablePanning;
        }
    },
    setPinchingStatus(element: BlazorMapsElement, pinchZooming: boolean): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.options.enablePinchZooming = pinchZooming;
        }
    },
    updateCollection(element: BlazorMapsElement, collection: any): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.bubbleCollection = JSON.parse(collection.bubble);
            element.blazor__instance.labelCollection = JSON.parse(collection.dataLabel);
            element.blazor__instance.baseMapBounds = {
                latitudeMax: collection.latitudeMax, latitudeMin: collection.latitudeMin, longitudeMax: collection.longitudeMax, longitudeMin: collection.longitudeMin,
                minBounds: collection.minBounds, maxBounds: collection.maxBounds, availableSize: collection.availableSize
            };
            element.blazor__instance.isTileMap = collection.isTileMap;
            element.blazor__instance.urlTemplate = collection.urlTemplate;
            element.blazor__instance.key = collection.key;
        }
    },
    updateLayerHighlight(index: number, setting: any, isBorder: boolean, element: BlazorMapsElement): void {
        if (element && element.blazor__instance) {
            if (!isBorder) {
                element.blazor__instance.options.layerHighlightSettings[index].Fill = setting.fill;
                element.blazor__instance.options.layerHighlightSettings[index].Opacity = setting.opacity;
                element.blazor__instance.options.layerHighlightSettings[index].Enable = setting.enable;
            } else {
                element.blazor__instance.options.layerHighlightSettings[index].BorderColor = setting.borderColor;
                element.blazor__instance.options.layerHighlightSettings[index].BorderWidth = setting.borderWidth;
            }
        }
    },
    updateMarkerHighlight(layerIndex: number, index: number, setting: any, isBorder: boolean, element: BlazorMapsElement): void {
        if (element && element.blazor__instance) {
            if (!isBorder) {
                element.blazor__instance.options.markerHighlightSettings[layerIndex][index].Fill = setting.fill;
                element.blazor__instance.options.markerHighlightSettings[layerIndex][index].Opacity = setting.opacity;
                element.blazor__instance.options.markerHighlightSettings[layerIndex][index].Enable = setting.enable;
            } else {
                element.blazor__instance.options.markerHighlightSettings[layerIndex][index].BorderColor = setting.borderColor;
                element.blazor__instance.options.markerHighlightSettings[layerIndex][index].BorderWidth = setting.borderWidth;
            }
        }
    },
    updateBubbleHighlight(layerIndex: number, index: number, setting: any, isBorder: boolean, element: BlazorMapsElement): void {
        if (element && element.blazor__instance) {
            if (!isBorder) {
                element.blazor__instance.options.bubbleHighlightSettings[layerIndex][index].Fill = setting.fill;
                element.blazor__instance.options.bubbleHighlightSettings[layerIndex][index].Opacity = setting.opacity;
                element.blazor__instance.options.bubbleHighlightSettings[layerIndex][index].Enable = setting.enable;
            } else {
                element.blazor__instance.options.bubbleHighlightSettings[layerIndex][index].BorderColor = setting.borderColor;
                element.blazor__instance.options.bubbleHighlightSettings[layerIndex][index].BorderWidth = setting.borderWidth;
            }
        }
    },
    updateTooltipDisplayMode(element: BlazorMapsElement, displayMode: any): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.options.tooltipDisplayMode = displayMode;
        }
    },
    updateNavigationHighlight(layerIndex: number, index: number, setting: any, isBorder: boolean, element: BlazorMapsElement): void {
        if (element && element.blazor__instance) {
            if (!isBorder) {
                element.blazor__instance.options.navigationHighlightSettings[layerIndex][index].Fill = setting.fill;
                element.blazor__instance.options.navigationHighlightSettings[layerIndex][index].Opacity = setting.opacity;
                element.blazor__instance.options.navigationHighlightSettings[layerIndex][index].Enable = setting.enable;
            } else {
                element.blazor__instance.options.navigationHighlightSettings[layerIndex][index].BorderColor = setting.borderColor;
                element.blazor__instance.options.navigationHighlightSettings[layerIndex][index].BorderWidth = setting.borderWidth;
            }
        }
    },
    async exportToImage(type: any, fileName: string, allowDownload: any, element: any) {
        let returnValue: any;
        if (element && element.blazor__instance) {
            returnValue = await element.blazor__instance.imageExport(type, fileName, allowDownload);
        }
        if (returnValue instanceof Promise) {
            await returnValue.then(async (data: string) => {
                return data;
            });
        } else {
            return returnValue;
        }
    },
    getLegendRect(id: string, top: number): object {
        let legendId: HTMLElement = document.getElementById(id);
        let legendRect: ClientRect = legendId.getBoundingClientRect();
        let mapId: string = id.split('_Legend_')[0];
        let svgId: HTMLElement = document.getElementById(mapId);
        let svgRect: ClientRect = svgId.getBoundingClientRect();
        return { x: legendRect.left - svgRect.left, y: legendRect.top - svgRect.top, width: legendRect.width, height: legendRect.height };
    },
    markerAnimation: function (id: string, marker: any, dotNetRef: any): void {
        let markers: any = JSON.parse(marker.markerData);
        for (let i: number = 0; i < markers.length; i++) {
            for (let j: number = 0; j < markers[i].MarkerAnimation.length; j++) {
                for (let k: number = 0; k < markers[i].MarkerAnimation[j].DataSourceLength; k++) {
                    let markerChild: HTMLElement = document.getElementById(id + '_LayerIndex_' + i + '_MarkerIndex_' + j + '_dataIndex_' + k);
                    this.elementAnimate(markerChild, markers[i].MarkerAnimation[j].AnimationDelay, markers[i].MarkerAnimation[j].AnimationDuration, markerChild['transform']['baseVal'][0]['matrix']['e'],
                        markerChild['transform']['baseVal'][0]['matrix']['f'], null, 0, dotNetRef);
                }
            }
        }
    },
    layerAnimation(id: string, point: MapLocation, scale: number, currentPoint: MapLocation, currentScale: number, dotNetRef: any): void {
        let layerGroup: HTMLElement = document.getElementById(id + '_LayerIndex_0');
        for (let i: number = 0; i < layerGroup.children.length; i++) {
            if (layerGroup.children[i].getAttribute('transform') !== null) {
                this.zoomAnimation(layerGroup.children[i], 0, 1000, currentPoint, currentScale, point, scale, dotNetRef);
            }
        }
    },
    slop(previousLocation: MapLocation, point: MapLocation): number {
        if (previousLocation.x === point.x) {
            return null;
        }
        return (point.y - previousLocation.y) / (point.x - previousLocation.x);
    },
    interception(point: MapLocation, slopeValue: number): number {
        if (slopeValue === null) {
            return point.x;
        }
        return point.y - slopeValue * point.x;
    },
    zoomAnimation(element: HTMLElement, delay: number, duration: number, currentPoint: MapLocation, scale: number, previousLocation: MapLocation, preScale: number, dotNetRef: any): void {
        let proxy: any = this;
        let delta: number = 0;
        let point: MapLocation = { x: currentPoint.x, y: currentPoint.y };
        let diffScale: number = scale - preScale;
        let currentLocation: MapLocation = { x: 0, y: 0 };
        let currentScale: number = 1;
        if (scale === preScale) {
            element.setAttribute('transform', 'scale( ' + (scale) + ' ) translate( ' + point.x + ' ' + point.y + ' )');
            return;
        }
        let slopeFactor: number = this.slope(previousLocation, point);
        let slopeIntersection: number = this.intercept(previousLocation, slopeFactor);
        let horizontalDifference: number = point.x - previousLocation.x;
        let verticalDifference: number = point.y - previousLocation.y;
        new Animation({}).animate(<HTMLElement>element, {
            duration: duration,
            delay: delay,
            progress: (args: AnimationOptions) => {
                if (args.timeStamp > args.delay) {
                    element.style.visibility = 'visible';
                    delta = ((args.timeStamp - args.delay) / args.duration);
                    currentScale = preScale + (delta * diffScale);
                    currentLocation.x = previousLocation.x + (delta * horizontalDifference) / (currentScale / scale);
                    if (!isNullOrUndefined(slopeFactor)) {
                        currentLocation.y = previousLocation.y + (delta * verticalDifference);
                    } else {
                        currentLocation.y = ((slopeFactor * currentLocation.x) + slopeIntersection);
                    }
                    element.setAttribute('transform', 'scale( ' + currentScale + ' ) ' +
                        'translate( ' + currentLocation.x + ' ' + currentLocation.y + ' )');
                }
            },
            end: (model: AnimationOptions) => {
                element.setAttribute('transform', 'scale( ' + (scale) + ' ) translate( ' + point.x + ' ' + point.y + ' )');
                this.dotNetRef.invokeMethodAsync('TriggerAnimation', element);
            }
        });
    },
    bubbleAnimation(id: string, bubble: any, dotNetRef: any): void {
        let bubbles: any = JSON.parse(bubble.bubbleData);
        for (let i: number = 0; i < bubbles.length; i++) {
            for (let j: number = 0; j < bubbles[i].MarkerAnimation.length; j++) {
                for (let k: number = 0; k < bubbles[i].MarkerAnimation[j].DataSourceLength; k++) {
                    let bubbleChild: HTMLElement = document.getElementById(id + '_LayerIndex_' + i + '_BubbleIndex_' + j + '_dataIndex_' + k);
                    this.elementAnimate(bubbleChild, bubbles[i].MarkerAnimation[j].AnimationDelay, bubbles[i].MarkerAnimation[j].AnimationDuration, bubbleChild['transform']['baseVal'][0]['matrix']['e'],
                        bubbleChild['transform']['baseVal'][0]['matrix']['f'], null, 0, dotNetRef);
                }
            }
        }
    },
    elementAnimate(element: HTMLElement, delay: number, duration: number, x: number, y: number, ele: any, radius: number, dotNetRef: any): void {
        if (isNullOrUndefined(radius)) { radius = 0; }
        let centerX: number = x;
        let centerY: number = y;
        let height: number = 0;
        new Animation({}).animate(<HTMLElement>element, {
            duration: duration,
            delay: delay,
            progress: (args: AnimationOptions) => {
                if (args.timeStamp > args.delay) {
                    height = ((args.timeStamp - args.delay) / args.duration);
                    element.style.visibility = 'visible';
                    element.setAttribute('transform', 'translate( ' + (centerX - (radius * height)) + ' ' + (centerY - (radius * height)) +
                        ' ) scale(' + height + ')');
                }
            },
            end: (model: AnimationOptions) => {
                element.setAttribute('transform', '');
                element.setAttribute('transform', 'translate( ' + x + ' ' + y + '  )');
                this.dotNetRef.invokeMethodAsync('TriggerAnimation', element.id);
                if (!ele) {
                    return;
                }
            }
        });
    },
    getToolbarAlign(id: string, data: any): void {
        let verticalAlignment: any = data.verticalAlignment;
        let horizontalAlignment: any = data.horizontalAlignment;
        let zoomToolbar: HTMLElement = document.getElementById(id + '_Zooming_KitCollection');
        let toolBarSize: ClientRect = zoomToolbar.getBoundingClientRect();
        let padding: number = 10;
        let x: number = 0;
        let y: number = 0;
        switch (verticalAlignment) {
            case 0:
                y = data.y;
                break;
            case 1:
                y = (data.height / 2) - (toolBarSize.height / 2);
                break;
            case 2:
                y = (data.height - toolBarSize.height) - padding;
                break;
        }
        switch (horizontalAlignment) {
            case 0:
                x = data.x;
                break;
            case 1:
                x = (data.width / 2) - (toolBarSize.width / 2);
                break;
            case 2:
                x = (data.width - toolBarSize.width) - padding;
                break;
        }
        let parentToolbar: HTMLElement = document.getElementById(id + '_ToolBar');
        parentToolbar.style.left = x + 'px';
        parentToolbar.style.top = y + 'px';
        parentToolbar.style.visibility = 'visible';
        let color: string = data.color;
        let css: string = ' .e-maps-toolbar:hover > circle { stroke:' + color + '; } .e-maps-toolbar:hover > path { fill: ' + color + ' ;  stroke: ' + color + '; }' +
            '.e-maps-toolbar:hover { cursor: pointer; } .e-maps-cursor-disable:hover { cursor: not-allowed; } .e-maps-panning:hover { cursor: pointer; } ' +
            '.e-maps-popup-close { display: block; opacity: 0; }';
        let style: HTMLStyleElement = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        parentToolbar.appendChild(style);
    },
    getTemplate(data: any[], template: string, top: number, left: number, id: string, index: number, templateCheck: boolean, parentId: string): string {
        let dataValue: any = data[0];
        let properties: string[] = Object.keys(dataValue);
        let templateHtml: string = template;
        for (let i: number = 0; i < properties.length; i++) {
            if (properties[i].toLowerCase() !== 'latitude' && properties[i].toLowerCase() !== 'longitude') {
                templateHtml = templateHtml.replace(new RegExp('{{:' + properties[i] + '}}', 'g'), dataValue[properties[i].toString()]);
            }
        }
        let templateGroup: string | HTMLElement = 'markertemp_LayerIndex_' + index + '_Markers_Template_Group';
        let markerTemplate: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'div');
        markerTemplate.setAttribute('id', id);
        markerTemplate.style.position = 'absolute';
        markerTemplate.style.transform = 'translate(-50 %, -50 %)';
        markerTemplate.style.left = left.toString();
        markerTemplate.style.top = top.toString();
        markerTemplate.innerHTML = templateHtml.toString();
        let secondTemplateGroup: HTMLElement = document.getElementById(parentId + '_LayerIndex_0_Markers_Template_Group');
        secondTemplateGroup.appendChild(markerTemplate);
        let markerTemplateGroup: HTMLElement = document.getElementById(parentId + '_Secondary_Element');
        markerTemplateGroup.appendChild(secondTemplateGroup);
        let templateId: HTMLElement = document.getElementById(parentId);
        templateId.appendChild(markerTemplateGroup);
        return templateHtml;
    }
};
export default Maps;