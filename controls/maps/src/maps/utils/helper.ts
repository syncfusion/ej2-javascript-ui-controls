/* eslint-disable max-len */
/**
 * Helper functions for maps control
 */
import { createElement, isNullOrUndefined, remove, compile as templateComplier, merge } from '@syncfusion/ej2-base';
import { AnimationOptions, Animation } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { Maps, FontModel, BorderModel, LayerSettings, ProjectionType, ISelectionEventArgs, itemSelection } from '../../index';
import { animationComplete, IAnimationCompleteEventArgs, Alignment, LayerSettingsModel } from '../index';
import {
    MarkerType, IShapeSelectedEventArgs, ITouches, IShapes, SelectionSettingsModel,
    MarkerClusterSettingsModel, IMarkerRenderingEventArgs, MarkerSettings, markerClusterRendering,
    IMarkerClusterRenderingEventArgs, MarkerClusterData
} from '../index';
import { CenterPositionModel, ConnectorLineSettingsModel, MarkerSettingsModel } from '../model/base-model';
import { ExportType } from '../utils/enum';

/**
 * Maps internal use of `Size` type
 */
export class Size {
    /**
     * height value for size
     */
    public height: number;
    /**
     * width value for size
     */
    public width: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}
/**
 * To find number from string
 *
 * @param {string} value Specifies the value
 * @param {number} containerSize Specifies the container size
 * @returns {number} Returns the number
 * @private
 */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/**
 * Method to calculate the width and height of the maps
 *
 * @param {Maps} maps Specifies the maps instance
 * @returns {void}
 */
export function calculateSize(maps: Maps): Size {
    maps.element.style.height = !isNullOrUndefined(maps.height) ? maps.height : 'auto';
    maps.element.style.width = !isNullOrUndefined(maps.width) ? maps.width : 'auto';
    const containerWidth: number = maps.element.clientWidth;
    const containerHeight: number = maps.element.clientHeight;
    const containerElementWidth: number = stringToNumber(maps.element.style.width, containerWidth);
    const containerElementHeight: number = stringToNumber(maps.element.style.height, containerHeight);
    let availableSize: Size = new Size(0, 0);
    if (maps.width === '0px' || maps.width === '0%' || maps.height === '0%' || maps.height === '0px') {
        availableSize = new Size(0, 0);
    } else {
        availableSize = new Size(
            stringToNumber(maps.width, containerWidth) || containerWidth || containerElementWidth || 600,
            stringToNumber(maps.height, containerHeight) || containerHeight || containerElementHeight || (maps.isDevice ?
                Math.min(window.innerWidth, window.innerHeight) : 450)
        );
    }
    return availableSize;
}
/**
 * Method to create svg for maps.
 *
 * @param {Maps} maps Specifies the map instance
 * @returns {void}
 */
export function createSvg(maps: Maps): void {
    maps.renderer = new SvgRenderer(maps.element.id);
    maps.availableSize = calculateSize(maps);
    maps.svgObject = maps.renderer.createSvg({
        id: maps.element.id + '_svg',
        width: maps.availableSize.width,
        height: maps.availableSize.height
    });
    if (maps.width === '0px' || maps.width === '0%' || maps.height === '0%' || maps.height === '0px') {
        maps.svgObject.setAttribute('height', '0');
        maps.svgObject.setAttribute('width', '0');
    }
}
/**
 * Method to get the mouse position
 *
 * @param {number} pageX - Specifies the pageX.
 * @param {number} pageY - Specifies the pageY.
 * @param {Element} element - Specifies the element.
 * @returns {MapLocation} - Returns the location.
 */
export function getMousePosition(pageX: number, pageY: number, element: Element): MapLocation {
    const elementRect: ClientRect = element.getBoundingClientRect();
    const pageXOffset: number = element.ownerDocument.defaultView.pageXOffset;
    const pageYOffset: number = element.ownerDocument.defaultView.pageYOffset;
    const clientTop: number = element.ownerDocument.documentElement.clientTop;
    const clientLeft: number = element.ownerDocument.documentElement.clientLeft;
    const positionX: number = elementRect.left + pageXOffset - clientLeft;
    const positionY: number = elementRect.top + pageYOffset - clientTop;
    return new MapLocation((pageX - positionX), (pageY - positionY));
}
/**
 * Method to convert degrees to radians
 *
 * @param {number} deg Specifies the degree value
 * @returns {number} Returns the number
 */
export function degreesToRadians(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Convert radians to degrees method
 *
 * @param {number} radian Specifies the radian value
 * @returns {number} Returns the number
 */
export function radiansToDegrees(radian: number): number {
    return radian * (180 / Math.PI);
}


/**
 * Method for converting from latitude and longitude values to points
 *
 * @param {number} latitude - Specifies the latitude.
 * @param {number} longitude - Specifies the longitude.
 * @param {number} factor - Specifies the factor.
 * @param {LayerSettings} layer - Specifies the layer settings.
 * @param {Maps} mapModel - Specifies the maps.
 * @returns {Point} - Returns the point values.
 */
export function convertGeoToPoint(latitude: number, longitude: number, factor: number, layer: LayerSettings, mapModel: Maps): Point {
    const mapSize: Size = new Size(mapModel.mapAreaRect.width, mapModel.mapAreaRect.height);
    let x: number; let y: number; let value: Point;
    let lat: number; let lng: number; let temp: number;
    const longitudeMinMax: MinMax = mapModel.baseMapBounds.longitude;
    const latitudeMinMax: MinMax = mapModel.baseMapBounds.latitude;
    let latRadian: number = degreesToRadians(latitude);
    const lngRadian: number = degreesToRadians(longitude);
    const type: ProjectionType = mapModel.projectionType;
    const size: number = (mapModel.isTileMap) ? Math.pow(2, 1) * 256 : (isNullOrUndefined(factor)) ?
        Math.min(mapSize.width, mapSize.height) : (Math.min(mapSize.width, mapSize.height) * factor);
    if (layer.geometryType === 'Normal') {
        x = isNullOrUndefined(factor) ? longitude : Math.abs((longitude - longitudeMinMax.min) * factor);
        y = isNullOrUndefined(factor) ? latitude : Math.abs((latitudeMinMax.max - latitude) * factor);
    } else if (layer.geometryType === 'Geographic') {
        switch (type) {
        case 'Mercator': {
            const pixelOrigin: Point = new Point(size / 2, size / 2);
            x = pixelOrigin.x + longitude * (size / 360);
            const sinY: number = calculateBound(Math.sin(degreesToRadians(latitude)), -0.9999, 0.9999);
            y = pixelOrigin.y + 0.5 * (Math.log((1 + sinY) / (1 - sinY))) * (-(size / (2 * Math.PI)));
            break;
        }
        case 'Winkel3':
            value = aitoff(lngRadian, latRadian);
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
            value = aitoff(lngRadian, latRadian);
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
        case 'Eckert6': {
            const epsilon: number = 1e-6;
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
        }
        x = (type === 'Mercator') ? x : roundTo(xToCoordinate(mapModel, radiansToDegrees(lng)), 3);
        y = (type === 'Mercator') ? y : (-(roundTo(yToCoordinate(mapModel, radiansToDegrees(lat)), 3)));
    }
    return new Point(x, y);
}
/**
 * Converting tile latitude and longitude to point
 *
 * @param {MapLocation} center Specifies the map center location
 * @param {number} zoomLevel Specifies the zoom level
 * @param {MapLocation} tileTranslatePoint Specifies the tile translate point
 * @param {boolean} isMapCoordinates Specifies the boolean value
 * @returns {MapLocation} Returns the location value
 */
export function convertTileLatLongToPoint(
    center: MapLocation, zoomLevel: number, tileTranslatePoint: MapLocation, isMapCoordinates: boolean): MapLocation {
    const size: number = Math.pow(2, zoomLevel) * 256;
    const x: number = (center.x + 180) / 360;
    const sinLatitude: number = Math.sin(center.y * Math.PI / 180);
    const y: number = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
    let pixelX: number = center.x;
    let pixelY: number = center.y;
    if (isMapCoordinates) {
        pixelX = (x * size + 0.5) + tileTranslatePoint.x;
        pixelY = (y * size + 0.5) + tileTranslatePoint.y;
    }
    return { x: pixelX, y: pixelY };
}
/**
 * Method for calculate x point
 *
 * @param {Maps} mapObject - Specifies the maps.
 * @param {number} val - Specifies the value.
 * @returns {number} - Returns the number.
 */
export function xToCoordinate(mapObject: Maps, val: number): number {
    const longitudeMinMax: MinMax = mapObject.baseMapBounds.longitude;
    const totalSize: number = isNullOrUndefined(mapObject.baseSize) ? mapObject.mapAreaRect.width : mapObject.mapAreaRect.width +
        (Math.abs(mapObject.baseSize.width - mapObject.mapAreaRect.width) / 2);
    return Math.round(totalSize * (val - longitudeMinMax.min) / (longitudeMinMax.max - longitudeMinMax.min) * 100) / 100;
}

/**
 * Method for calculate y point
 *
 * @param {Maps} mapObject - Specifies the maps.
 * @param {number} val - Specifies the value.
 * @returns {number} - Returns the number.
 */
export function yToCoordinate(mapObject: Maps, val: number): number {
    const latitudeMinMax: MinMax = mapObject.baseMapBounds.latitude;
    return Math.round(mapObject.mapAreaRect.height * (val - latitudeMinMax.min) / (latitudeMinMax.max - latitudeMinMax.min) * 100) / 100;
}

/**
 * Method for calculate aitoff projection
 *
 * @param {number} x - Specifies the x value.
 * @param {number} y - Specifies the y value.
 * @returns {Point} - Returns the point value.
 */
export function aitoff(x: number, y: number): Point {
    const cosy: number = Math.cos(y);
    const sincia: number = sinci(acos(cosy * Math.cos(x /= 2)));
    return new Point(2 * cosy * Math.sin(x) * sincia, Math.sin(y) * sincia);
}


/**
 * Method to round the number
 *
 * @param {number} a - Specifies the a value
 * @param {number} b - Specifies the b value
 * @returns {number} - Returns the number
 */
export function roundTo(a: number, b: number): number {
    const c: number = Math.pow(10, b);
    return (Math.round(a * c) / c);
}

/**
 *
 * @param {number} x - Specifies the x value
 * @returns {number} - Returns the number
 */
export function sinci(x: number): number {
    return x / Math.sin(x);
}

/**
 *
 * @param {number} a - Specifies the a value
 * @returns {number} - Returns the number
 */
export function acos(a: number): number {
    return Math.acos(a);
}

/**
 * Method to calculate bound
 *
 * @param {number} value Specifies the value
 * @param {number} min Specifies the minimum value
 * @param {number} max Specifies the maximum value
 * @returns {number} Returns the value
 */
export function calculateBound(value: number, min: number, max: number): number {
    if (!isNullOrUndefined(min)) {
        value = Math.max(value, min);
    }
    if (!(isNullOrUndefined(max))) {
        value = Math.min(value, max);
    }
    return value;
}

/**
 * To trigger the download element
 *
 * @param {string} fileName Specifies the file name
 * @param {ExportType} type Specifies the type
 * @param {string} url Specifies the url
 * @param {boolean} isDownload Specifies whether download a file.
 * @returns {void}
 */
export function triggerDownload(fileName: string, type: ExportType, url: string, isDownload: boolean): void {
    createElement('a', {
        attrs: {
            'download': fileName + '.' + (type as string).toLocaleLowerCase(),
            'href': url
        }
    }).dispatchEvent(new MouseEvent(isDownload ? 'click' : 'move', {
        view: window,
        bubbles: false,
        cancelable: true
    }));
}
/**
 * Map internal class for point
 */

export class Point {
    /**
     * Point x value
     */
    public x: number;
    /**
     * Point Y value
     */
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Map internal class for min and max
 *
 */

export class MinMax {
    public min: number;
    public max: number;
    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }
}

/**
 * Map internal class locations
 */

export class GeoLocation {
    public latitude: MinMax;
    public longitude: MinMax;
    constructor(latitude: MinMax, longitude: MinMax) {
        this.latitude = new MinMax(latitude.min, latitude.max);
        this.longitude = new MinMax(longitude.min, longitude.max);
    }
}

/**
 * Function to measure the height and width of the text.
 *
 * @param  {string} text Specifies the text
 * @param  {FontModel} font Specifies the font
 * @returns {Size} Returns the size
 * @private
 */
export function measureText(text: string, font: FontModel): Size {
    let measureObject: HTMLElement = document.getElementById('mapsmeasuretext');

    if (measureObject === null) {
        measureObject = createElement('text', { id: 'mapsmeasuretext' });
        document.body.appendChild(measureObject);
    }
    measureObject.innerHTML = text;
    measureObject.style.position = 'absolute';
    if (typeof (font.size) === 'number') {
        measureObject.style.fontSize = (font.size) + 'px';
    } else {
        measureObject.style.fontSize = font.size;
    }
    measureObject.style.fontWeight = font.fontWeight;
    measureObject.style.fontStyle = font.fontStyle;
    measureObject.style.fontFamily = font.fontFamily;
    measureObject.style.visibility = 'hidden';
    measureObject.style.top = '-100';
    measureObject.style.left = '0';
    measureObject.style.whiteSpace = 'nowrap';
    // For bootstrap line height issue
    measureObject.style.lineHeight = 'normal';
    return new Size(measureObject.clientWidth, measureObject.clientHeight);
}

/**
 * Internal use of text options
 *
 * @private
 */
export class TextOption {
    public anchor: string;
    public id: string;
    public transform: string = '';
    public x: number;
    public y: number;
    public text: string | string[];
    public baseLine: string = 'auto';

    constructor(id?: string, x?: number, y?: number, anchor?: string, text?: string | string[], transform: string = '', baseLine?: string) {
        this.id = id;
        this.text = text;
        this.transform = transform;
        this.anchor = anchor;
        this.x = x;
        this.y = y;
        this.baseLine = baseLine;
    }
}
/**
 * Internal use of path options
 *
 * @private
 */
export class PathOption {
    public id: string;
    public fill: string;
    public stroke: string;
    public ['stroke-width']: number;
    public ['stroke-dasharray']: string;
    public ['stroke-opacity']: number;
    public ['fill-opacity']: number;
    public d: string;
    constructor(
        id: string, fill: string, width: number, color: string, fillOpacity?: number, strokeOpacity?: number,
        dashArray?: string, d?: string
    ) {
        this.id = id;
        this['fill-opacity'] = fillOpacity;
        this['stroke-opacity'] = strokeOpacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
    }
}
/** @private */
export class ColorValue {
    public r: number;
    public g: number;
    public b: number;
    constructor(r?: number, g?: number, b?: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}
/**
 * Internal use of rectangle options
 *
 * @private
 */
export class RectOption extends PathOption {

    public x: number;
    public y: number;
    public height: number;
    public width: number;
    public rx: number;
    public ry: number;
    public transform: string;
    public ['stroke-dasharray']: string;
    constructor(
        id: string, fill: string, border: BorderModel, fillOpacity: number,
        rect: Rect, rx?: number, ry?: number, transform?: string, dashArray?: string
    ) {
        super(id, fill, border.width, border.color, fillOpacity, border.opacity);
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height;
        this.width = rect.width;
        this.rx = rx ? rx : 0;
        this.ry = ry ? ry : 0;
        this.transform = transform ? transform : '';
        this['stroke-dasharray'] = dashArray;
        this['fill-opacity'] = fillOpacity;
        this['stroke-opacity'] = border.opacity;
    }
}
/**
 * Internal use of circle options
 *
 * @private
 */
export class CircleOption extends PathOption {
    public cy: number;
    public cx: number;
    public r: number;
    public ['stroke-dasharray']: string;
    constructor(id: string, fill: string, border: BorderModel, fillOpacity: number,
                cx: number, cy: number, r: number, dashArray: string) {
        super(id, fill, border.width, border.color, fillOpacity, border.opacity, dashArray);
        this.cy = cy;
        this.cx = cx;
        this.r = r;
        this['stroke-dasharray'] = dashArray;
        this['fill-opacity'] = fillOpacity;
        this['stroke-opacity'] = border.opacity;
    }
}

/**
 * Internal use of polygon options
 *
 * @private
 */
export class PolygonOption extends PathOption {
    public points: string;
    constructor(id: string, points: string, fill: string, width: number, color: string, fillOpacity: number = 1,
                strokeOpacity: number = 1, dashArray: string = ''
    ) {
        super(id, fill, width, color, fillOpacity, strokeOpacity, dashArray);
        this.points = points;
    }
}
/**
 * Internal use of polyline options
 *
 * @private
 */
export class PolylineOption extends PolygonOption {
    constructor(id: string, points: string, fill: string, width: number, color: string,
                fillOpacity: number = 1, strokeOpacity: number = 1, dashArray: string = '') {
        super(id, points, fill, width, color, fillOpacity, strokeOpacity, dashArray);
    }
}
/**
 * Internal use of line options
 *
 * @private
 */
export class LineOption extends PathOption {
    public x1: number;
    public y1: number;
    public x2: number;
    public y2: number;
    constructor(id: string, line: Line, fill: string, width: number, color: string,
                fillOpacity: number = 1, strokeOpacity: number = 1, dashArray: string = ''
    ) {
        super(id, fill, width, color, fillOpacity, strokeOpacity, dashArray);
        this.x1 = line.x1;
        this.y1 = line.y1;
        this.x2 = line.x2;
        this.y2 = line.y2;
    }
}
/**
 * Internal use of line
 *
 * @property {number} Line - Specifies the line class
 */
export class Line {
    public x1: number;
    public y1: number;
    public x2: number;
    public y2: number;
    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}
/**
 * Internal use of map location type
 *
 */
export class MapLocation {
    /**
     * To specify x value
     */
    public x: number;
    /**
     * To specify y value
     */
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
/**
 * Internal use of type rect
 *
 * @private
 */
export class Rect {

    public x: number;
    public y: number;
    public height: number;
    public width: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
/**
 * Defines the pattern unit types for drawing the patterns in maps.
 */
export type patternUnits =
    /** Specifies the user space for maps. */
    'userSpaceOnUse' |
    /** Specifies the bounding box for the object. */
    'objectBoundingBox';
/**
 * Internal use for pattern creation.
 *
 * @property {PatternOptions} PatternOptions - Specifies the pattern option class.
 */
export class PatternOptions {
    public id: string;
    public patternUnits: patternUnits;
    public patternContentUnits: patternUnits;
    public patternTransform: string;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public href: string;
    constructor(
        id: string, x: number, y: number, width: number, height: number, patternUnits: patternUnits = 'userSpaceOnUse',
        patternContentUnits: patternUnits = 'userSpaceOnUse', patternTransform: string = '', href: string = '') {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.patternUnits = patternUnits;
        this.patternContentUnits = patternContentUnits;
        this.patternTransform = patternTransform;
        this.href = href;
    }
}
/**
 * Internal rendering of text
 *
 * @param {TextOption} option Specifies the text option
 * @param {FontModel} style Specifies the style
 * @param {string} color Specifies the color
 * @param {HTMLElement | Element} parent Specifies the parent element
 * @param {boolean} isMinus Specifies the boolean value
 * @returns {Element} Returns the html object
 * @private
 */
export function renderTextElement(
    option: TextOption, style: FontModel, color: string, parent: HTMLElement | Element, isMinus: boolean = false
): Element {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderOptions: any = {
        'id': option.id,
        'x': option.x,
        'y': option.y,
        'fill': color,
        'font-size': style.size,
        'font-style': style.fontStyle,
        'font-family': style.fontFamily,
        'font-weight': style.fontWeight,
        'text-anchor': option.anchor,
        'transform': option.transform,
        'opacity': style.opacity,
        'dominant-baseline': option.baseLine
    };
    const text: string = typeof option.text === 'string' || typeof option.text === 'number' ? option.text : isMinus ? option.text[option.text.length - 1] : option.text[0];
    let tspanElement: Element;
    const renderer: SvgRenderer = new SvgRenderer('');
    let height: number;
    const htmlObject: HTMLElement = <HTMLElement>renderer.createText(renderOptions, text);
    htmlObject.style['user-select'] = 'none';
    htmlObject.style['font-family'] = style.fontFamily;
    htmlObject.style['font-size'] = style.size;
    htmlObject.style['font-weight'] = style.fontWeight;
    htmlObject.style['font-color'] = style.color;
    htmlObject.style['-moz-user-select'] = 'none';
    htmlObject.style['-webkit-touch-callout'] = 'none';
    htmlObject.style['-webkit-user-select'] = 'none';
    htmlObject.style['-khtml-user-select'] = 'none';
    htmlObject.style['-ms-user-select'] = 'none';
    htmlObject.style['-o-user-select'] = 'none';
    if (typeof option.text !== 'string' && option.text.length > 1) {
        for (let i: number = 1, len: number = option.text.length; i < len; i++) {
            height = (measureText(option.text[i as number], style).height);
            tspanElement = renderer.createTSpan(
                {
                    'x': option.x, 'id': option.id,
                    'y': (option.y) + ((isMinus) ? -(i * height) : (i * height))
                },
                isMinus ? option.text[option.text.length - (i + 1)] : option.text[i as number]
            );
            htmlObject.appendChild(tspanElement);
        }
    }
    parent.appendChild(htmlObject);
    return htmlObject;
}

/**
 * @param {HTMLCollection} element Specifies the html collection
 * @param {string} markerId Specifies the marker id
 * @param {any} data Specifies the data
 * @param {number} index Specifies the index
 * @param {Maps} mapObj Specifies the map object
 * @returns {HTMLCollection} Returns the html collection
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertElement(element: HTMLCollection, markerId: string, data: any, index: number, mapObj: Maps): HTMLElement {
    const childElement: HTMLElement = createElement('div', {
        id: markerId
    });
    childElement.style.cssText = 'position: absolute;pointer-events: auto;';
    let elementLength: number = element.length;
    while (elementLength > 0) {
        childElement.appendChild(element[0]);
        elementLength--;
    }
    let templateHtml: string = childElement.innerHTML;
    const properties: string[] = Object.keys(data);
    const regExp: RegExpConstructor = RegExp;
    for (let i: number = 0; i < properties.length; i++) {
        if (typeof data[properties[i as number]] === 'object') {
            templateHtml = convertStringToValue(templateHtml, '', data, mapObj);
            // eslint-disable-next-line @typescript-eslint/ban-types
        } else if ((<String>properties[i as number]).toLowerCase() !== 'latitude' && (<string>properties[i as number]).toLowerCase() !== 'longitude') {
            templateHtml = templateHtml.replace(new regExp('{{:' + <string>properties[i as number] + '}}', 'g'), data[properties[i as number].toString()]);
        }
    }
    childElement.innerHTML = templateHtml;
    return childElement;
}

/**
 *
 * @param {string} value - Specifies the value
 * @param {Maps} maps - Specifies the instance of the maps
 * @returns {string} - Returns the string value
 */
export function formatValue(value: string, maps: Maps): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let formatValue: string; let formatFunction: any;
    if (maps.format && !isNaN(Number(value))) {
        formatFunction = maps.intl.getNumberFormat(
            { format: maps.format, useGrouping: maps.useGroupingSeparator });
        formatValue = formatFunction(Number(value));
    } else {
        formatValue = value;
    }
    return formatValue;
}

/**
 *
 * @param {string} stringTemplate - Specifies the template
 * @param {string} format - Specifies the format
 * @param {any} data - Specifies the data
 * @param {Maps} maps - Specifies the instance of the maps
 * @returns {string} - Returns the string value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertStringToValue(stringTemplate: string, format: string, data: any, maps: Maps): string {
    let templateHtml: string = (stringTemplate === '') ? format : stringTemplate;
    const templateValue: string[] = (stringTemplate === '') ? templateHtml.split('${') : templateHtml.split('{{:');
    const regExp: RegExpConstructor = RegExp;
    for (let i: number = 0; i < templateValue.length; i++) {
        if ((templateValue[i as number].indexOf('}}') > -1 && templateValue[i as number].indexOf('.') > -1) ||
            (templateValue[i as number].indexOf('}') > -1 && templateValue[i as number].search('.') > -1)) {
            const split: string[] = (stringTemplate === '') ? templateValue[i as number].split('}') : templateValue[i as number].split('}}');
            for (let j: number = 0; j < split.length; j++) {
                if (split[j as number].indexOf('.') > -1) {
                    const templateSplitValue: string = (getValueFromObject(data, split[j as number])).toString();

                    templateHtml = (stringTemplate === '') ?
                        templateHtml.split('${' + split[j as number] + '}').join(formatValue(templateSplitValue, maps)) :
                        templateHtml.replace(new regExp('{{:' + split[j as number] + '}}', 'g'), templateSplitValue);
                }
            }
        }
    }
    return templateHtml;
}

/**
 *
 * @param {Element} element - Specifies the element
 * @param {string} labelId - Specifies the label id
 * @param {any} data - Specifies the data
 * @param {number} index - Specifies the index
 * @param {Maps} mapObj - Specifies the map object
 * @returns {HTMLElement} - Returns the html element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertElementFromLabel(element: Element, labelId: string, data: any, index: number, mapObj: Maps): HTMLElement {
    const labelEle: Element = isNullOrUndefined(element.childElementCount) ? element[0] : element;
    let templateHtml: string = labelEle.outerHTML;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const properties: any[] = Object.keys(data);
    const regExp: RegExpConstructor = RegExp;
    for (let i: number = 0; i < properties.length; i++) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        templateHtml = templateHtml.replace(new regExp('{{:' + <String>properties[i as number] + '}}', 'g'), data[properties[i as number].toString()]);
    }
    const templateEle: HTMLElement = createElement('div', {
        id: labelId,
        innerHTML: templateHtml
    });
    templateEle.style.position = 'absolute';
    return templateEle;
}

/**
 *
 * @param {MarkerType} shape - Specifies the shape
 * @param {string} imageUrl - Specifies the image url
 * @param {Point} location - Specifies the location
 * @param {string} markerID - Specifies the marker id
 * @param {any} shapeCustom - Specifies the shape custom
 * @param {Element} markerCollection - Specifies the marker collection
 * @param {Maps} maps - Specifies the instance of the maps
 * @returns {Element} - Returns the element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function drawSymbols(shape: MarkerType, imageUrl: string, location: Point, markerID: string, shapeCustom: any,
                            markerCollection: Element, maps: Maps): Element {
    let markerEle: Element; let x: number; let y: number;
    const size: Size = <Size>shapeCustom['size'];
    const borderColor: string = shapeCustom['borderColor'];
    const borderWidth: number = parseFloat(shapeCustom['borderWidth']);
    const borderOpacity: number = parseFloat(shapeCustom['borderOpacity']);
    const fill: string = shapeCustom['fill'];
    const dashArray: string = shapeCustom['dashArray'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const border: any = { color: borderColor, width: borderWidth, opacity: borderOpacity };
    const opacity: number = shapeCustom['opacity']; const padding: number = 5;
    let rectOptions: RectOption;
    const pathOptions: PathOption = new PathOption(markerID, fill, borderWidth, borderColor, opacity, borderOpacity, dashArray, '');
    size.width = typeof(size.width) === 'string' ? parseInt(size.width, 10) : size.width;
    size.height = typeof(size.height) === 'string' ? parseInt(size.height, 10) : size.height;
    if (shape === 'Circle') {
        const radius: number = (size.width + size.height) / 4;
        const circleOptions: CircleOption = new CircleOption(markerID, fill, border, opacity,
                                                             location.x, location.y, radius, dashArray);
        markerEle = maps.renderer.drawCircle(circleOptions) as SVGCircleElement;
    } else if (shape === 'Rectangle') {
        x = location.x - (size.width / 2);
        y = location.y - (size.height / 2);
        rectOptions = new RectOption(
            markerID, fill, border, opacity, new Rect(x, y, size.width, size.height), null, null, '', dashArray
        );
        markerEle = maps.renderer.drawRectangle(rectOptions) as SVGRectElement;
    } else if (shape === 'Image') {
        x = location.x - (size.width / 2);
        y = location.y - size.height;
        merge(pathOptions, { 'href': imageUrl, 'height': size.height, 'width': size.width, x: x, y: y });
        markerEle = maps.renderer.drawImage(pathOptions) as SVGImageElement;
    } else {
        markerEle = calculateShapes(maps, shape, pathOptions, size, location, markerCollection);
    }
    return markerEle;
}

/**
 *
 * @param {any} data - Specifies the data
 * @param {string} value - Specifies the value
 * @returns {any} - Returns the data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getValueFromObject(data: any, value: string): any {
    if (!isNullOrUndefined(data) && !isNullOrUndefined(value)) {
        const splits: string[] = value.replace(/\[/g, '.').replace(/\]/g, '').split('.');
        if (splits.length === 1) {
            data = data[splits[0]];
        }
        else {
            for (let i: number = 0; i < splits.length && !isNullOrUndefined(data); i++) {
                data = data[splits[i as number]];
            }
        }
    }
    return data;
}

/**
 *
 * @param {IMarkerRenderingEventArgs} eventArgs - Specifies the event arguments
 * @param {any} data - Specifies the data
 * @returns {IMarkerRenderingEventArgs} - Returns the arguments
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function markerColorChoose(eventArgs: IMarkerRenderingEventArgs, data: any): IMarkerRenderingEventArgs {
    const color: string = (!isNullOrUndefined(eventArgs.colorValuePath)) ? ((eventArgs.colorValuePath.indexOf('.') > -1) ? (getValueFromObject(data, eventArgs.colorValuePath)).toString() :
        data[eventArgs.colorValuePath]) : data[eventArgs.colorValuePath];
    eventArgs.fill = (!isNullOrUndefined(eventArgs.colorValuePath) &&
        !isNullOrUndefined(color)) ?
        ((eventArgs.colorValuePath.indexOf('.') > -1) ? (getValueFromObject(data, eventArgs.colorValuePath)).toString() :
            data[eventArgs.colorValuePath]) : eventArgs.fill;
    return eventArgs;
}

/**
 *
 * @param {IMarkerRenderingEventArgs} eventArgs - Specifies the event arguments
 * @param {any} data - Specifies the data
 * @returns {IMarkerRenderingEventArgs} - Returns the arguments
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function markerShapeChoose(eventArgs: IMarkerRenderingEventArgs, data: any): IMarkerRenderingEventArgs {
    if (!isNullOrUndefined(eventArgs.shapeValuePath) && !isNullOrUndefined(data[eventArgs.shapeValuePath])) {
        const shape: MarkerType = ((eventArgs.shapeValuePath.indexOf('.') > -1) ?
            (getValueFromObject(data, eventArgs.shapeValuePath).toString()) as MarkerType :
            data[eventArgs.shapeValuePath]);
        eventArgs.shape = (shape.toString() !== '') ? shape : eventArgs.shape;
        if (data[eventArgs.shapeValuePath] === 'Image') {
            eventArgs.imageUrl = (!isNullOrUndefined(eventArgs.imageUrlValuePath)) ?
                ((eventArgs.imageUrlValuePath.indexOf('.') > -1) ? getValueFromObject(data, eventArgs.imageUrlValuePath).toString() : (!isNullOrUndefined(data[eventArgs.imageUrlValuePath]) ?
                    data[eventArgs.imageUrlValuePath] : eventArgs.imageUrl)) : eventArgs.imageUrl;
        }
    }
    else {
        const shapes: MarkerType = (!isNullOrUndefined(eventArgs.shapeValuePath)) ? ((eventArgs.shapeValuePath.indexOf('.') > -1) ? (getValueFromObject(data, eventArgs.shapeValuePath).toString() as MarkerType) : eventArgs.shape) : eventArgs.shape;
        eventArgs.shape = (shapes.toString() !== '') ? shapes : eventArgs.shape;
        const shapeImage: string = (!isNullOrUndefined(eventArgs.imageUrlValuePath)) ?
            ((eventArgs.imageUrlValuePath.indexOf('.') > -1) ? getValueFromObject(data, eventArgs.imageUrlValuePath).toString() as MarkerType : (!isNullOrUndefined(data[eventArgs.imageUrlValuePath]) ?
                data[eventArgs.imageUrlValuePath] : eventArgs.imageUrl)) : eventArgs.imageUrl;
        eventArgs.imageUrl = shapeImage;
    }
    return eventArgs;
}

/**
 *
 * @param {LayerSettings} currentLayer - Specifies the current layer
 * @param {HTMLElement | Element} markerTemplate - Specifies the marker template
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {number} layerIndex - Specifies the layer index
 * @param {Element} markerCollection - Specifies the marker collection
 * @param {Element} layerElement - Specifies the layer element
 * @param {boolean} check - Specifies the boolean value
 * @param {boolean} zoomCheck - Specifies the boolean value
 * @returns {void}
 */
export function clusterTemplate(currentLayer: LayerSettings, markerTemplate: HTMLElement | Element, maps: Maps,
                                layerIndex: number, markerCollection: Element,
                                layerElement: Element, check: boolean, zoomCheck: boolean): void {
    let bounds1: DOMRect;
    let bounds2: DOMRect;
    let colloideBounds: DOMRect[] = [];
    let clusterColloideBounds: Element[] = [];
    let tempX: number = 0;
    let tempY: number = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any;
    const style: FontModel = currentLayer.markerClusterSettings.labelStyle;
    let options: TextOption;
    let textElement: Element;
    let tempElement1: Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let shapeCustom: any;
    let tempElement: Element;
    const postionY: number = (15 / 4);
    let m: number = 0;
    let indexCollection: number[] = [];
    const clusters: MarkerClusterSettingsModel = currentLayer.markerClusterSettings;
    const clusterGroup: Element = maps.renderer.createGroup({ id: maps.element.id + '_LayerIndex_' + layerIndex + '_markerCluster' });
    const eventArg: IMarkerClusterRenderingEventArgs = {
        cancel: false, name: markerClusterRendering, fill: clusters.fill, height: clusters.height,
        width: clusters.width, imageUrl: clusters.imageUrl, shape: clusters.shape,
        data: data, maps: maps, cluster: clusters, border: clusters.border
    };
    maps.trigger('markerClusterRendering', eventArg, (clusterargs: IMarkerClusterRenderingEventArgs) => {
        for (let o: number = 0; o < markerTemplate.childElementCount; o++) {
            indexCollection = [];
            if (markerTemplate.childNodes[o as number]['style']['visibility'] !== 'hidden') {
                tempElement = markerTemplate.childNodes[o as number] as Element;
                bounds1 = tempElement.getBoundingClientRect() as DOMRect;
                indexCollection.push(o as number);
                if (!isNullOrUndefined(bounds1)) {
                    for (let p: number = o + 1; p < markerTemplate.childElementCount; p++) {
                        if (markerTemplate.childNodes[p as number]['style']['visibility'] !== 'hidden') {
                            tempElement = markerTemplate.childNodes[p as number] as Element;
                            bounds2 = tempElement.getBoundingClientRect() as DOMRect;
                            if (!isNullOrUndefined(bounds2)) {
                                if (!(bounds1.left > bounds2.right || bounds1.right < bounds2.left
                                    || bounds1.top > bounds2.bottom || bounds1.bottom < bounds2.top)) {
                                    colloideBounds.push(bounds2);
                                    markerTemplate.childNodes[p as number]['style']['visibility'] = 'hidden';
                                    indexCollection.push(p as number);
                                }
                            }
                        }
                    }
                    tempX = bounds1.left + bounds1.width / 2;
                    tempY = bounds1.top + bounds1.height;
                    if (colloideBounds.length > 0) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        indexCollection = indexCollection.filter((item: any, index: any, value: any) => value.indexOf(item) === index);
                        const container: ClientRect = maps.element.getBoundingClientRect();
                        tempX = tempX - container['left'];
                        tempY = (tempY - ((maps.availableSize.height <= container['height']) ?
                            container['top'] : (container['bottom'] - container['top'])));
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const translate: any = (maps.isTileMap) ? new Object() : getTranslate(maps, currentLayer, false);
                        const dataIndex: number = parseInt(markerTemplate.childNodes[o as number]['id'].split('_dataIndex_')[1].split('_')[0], 10);
                        const markerIndex: number = parseInt(markerTemplate.childNodes[o as number]['id'].split('_MarkerIndex_')[1].split('_')[0], 10);
                        const markerSetting: MarkerSettingsModel = currentLayer.markerSettings[markerIndex as number];
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const markerData: any = markerSetting.dataSource[dataIndex as number];
                        let factor: number; let location: Point;
                        const longitude: number = (!isNullOrUndefined(markerSetting.longitudeValuePath)) ?
                            Number(getValueFromObject(markerData, markerSetting.longitudeValuePath)) :
                            !isNullOrUndefined(markerData['longitude']) ? parseFloat(markerData['longitude']) :
                                !isNullOrUndefined(markerData['Latitude']) ? parseFloat(markerData['Latitude']) : 0;
                        const latitude: number = (!isNullOrUndefined(markerSetting.latitudeValuePath)) ?
                            Number(getValueFromObject(markerData, markerSetting.latitudeValuePath)) :
                            !isNullOrUndefined(markerData['latitude']) ? parseFloat(markerData['latitude']) :
                                !isNullOrUndefined(markerData['Latitude']) ? parseFloat(markerData['Latitude']) : 0;
                        if (!maps.isTileMap) {
                            factor = maps.mapLayerPanel.calculateFactor(currentLayer);
                            location = convertGeoToPoint(latitude, longitude, factor, currentLayer, maps);
                        } else if (maps.isTileMap && !maps.zoomSettings.enable) {
                            location = convertTileLatLongToPoint(new Point(longitude, latitude), maps.tileZoomLevel,
                                                                 maps.tileTranslatePoint, true);
                        }
                        markerTemplate.childNodes[o as number]['style']['visibility'] = 'hidden';
                        const clusters: MarkerClusterSettingsModel = currentLayer.markerClusterSettings;
                        if (eventArg.cancel) {
                            shapeCustom = {
                                size: new Size(clusters.width, clusters.height),
                                fill: clusters.fill, borderColor: clusters.border.color,
                                borderWidth: clusters.border.width, opacity: clusters.opacity,
                                dashArray: clusters.dashArray
                            };
                            shapeCustom['fill'] = clusters.fill;
                            shapeCustom['size']['width'] = clusters.width;
                            shapeCustom['size']['height'] = clusters.height;
                            shapeCustom['imageUrl'] = clusters.imageUrl;
                            shapeCustom['shape'] = clusters.shape;
                            shapeCustom['borderColor'] = clusters.border.color;
                            shapeCustom['borderWidth'] = clusters.border.width;
                            shapeCustom['borderOpacity'] = isNullOrUndefined(clusters.border.opacity) ? clusters.opacity : clusters.border.opacity;
                        } else {
                            shapeCustom = {
                                size: new Size(clusters.width, clusters.height),
                                fill: clusters.fill, borderColor: clusters.border.color,
                                borderWidth: clusters.border.width, opacity: clusters.opacity,
                                dashArray: clusters.dashArray
                            };
                            shapeCustom['fill'] = eventArg.fill;
                            shapeCustom['size']['width'] = eventArg.width;
                            shapeCustom['size']['height'] = eventArg.height;
                            shapeCustom['imageUrl'] = eventArg.imageUrl;
                            shapeCustom['shape'] = eventArg.shape;
                            shapeCustom['borderColor'] = eventArg.border.color;
                            shapeCustom['borderWidth'] = eventArg.border.width;
                            shapeCustom['borderOpacity'] = isNullOrUndefined(eventArg.border.opacity) ? clusters.opacity : eventArg.border.opacity;
                        }
                        tempX = (maps.isTileMap) ? tempX : (markerTemplate.id.indexOf('_Markers_Group') > -1) ? tempX : tempX + postionY - (eventArg.width / 2);
                        tempY = (maps.isTileMap) ? tempY : (markerTemplate.id.indexOf('_Markers_Group') > -1) ? tempY : tempY - (eventArg.height / 2);
                        if (maps.isTileMap && !maps.zoomSettings.enable) {
                            tempX = location.x;
                            tempY = location.y;
                        }
                        const clusterID: string = maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_dataIndex_' + dataIndex + '_cluster_' + (m);
                        const labelID: string = maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_dataIndex_' + dataIndex + '_cluster_' + (m) + '_datalabel_' + m;
                        m++;
                        const imageShapeY: number = shapeCustom['shape'] === 'Image' ? shapeCustom['size']['height'] / 2 : 0;
                        const ele: Element = drawSymbols(
                            shapeCustom['shape'], shapeCustom['imageUrl'], { x: 0, y: imageShapeY },
                            clusterID, shapeCustom, markerCollection, maps
                        );
                        ele.setAttribute('transform', 'translate( ' + tempX + ' ' + tempY + ' )');
                        if (eventArg.shape === 'Balloon') {
                            ele.children[0].innerHTML = indexCollection.toString();
                        } else {
                            ele.innerHTML = indexCollection.toString();
                        }
                        options = new TextOption(labelID, (0), postionY, 'middle', (colloideBounds.length + 1).toString(), '', '');
                        textElement = renderTextElement(options, style, style.color, markerCollection);
                        textElement.setAttribute('transform', 'translate( ' + tempX + ' ' + tempY + ' )');
                        clusterGroup.appendChild(textElement);
                        clusterGroup.appendChild(ele);
                    }
                }
                colloideBounds = [];
            }
        }
        layerElement.appendChild(clusterGroup);
        maps.svgObject.appendChild(layerElement) as Element;
        maps.element.appendChild(maps.svgObject) as Element;
        for (let o: number = 0; o < clusterGroup.childElementCount; o++) {
            if (clusterGroup.childNodes[o as number]['style']['visibility'] !== 'hidden') {
                tempElement = clusterGroup.childNodes[o as number] as Element;
                bounds1 = tempElement.getBoundingClientRect() as DOMRect;
                if (!isNullOrUndefined(bounds1) && !(tempElement.id.indexOf('_datalabel_') > -1)) {
                    for (let p: number = o + 1; p < clusterGroup.childElementCount; p++) {
                        if (clusterGroup.childNodes[p as number]['style']['visibility'] !== 'hidden') {
                            tempElement1 = clusterGroup.childNodes[p as number] as Element;
                            bounds2 = tempElement1.getBoundingClientRect() as DOMRect;
                            if (!isNullOrUndefined(bounds2) && !(tempElement1.id.indexOf('_datalabel_') > -1)) {
                                if (!(bounds1.left > bounds2.right || bounds1.right < bounds2.left
                                    || bounds1.top > bounds2.bottom || bounds1.bottom < bounds2.top)) {
                                    clusterColloideBounds.push(tempElement1);
                                    clusterColloideBounds.push(clusterGroup.childNodes[p - 1] as Element);
                                    clusterGroup.childNodes[p as number]['style']['visibility'] = 'hidden';
                                    clusterGroup.childNodes[p - 1]['style']['visibility'] = 'hidden';
                                    indexCollection.push(p);
                                }
                            }
                        }
                    }
                    if (clusterColloideBounds.length > 0) {
                        tempElement = clusterGroup.childNodes[o as number] as Element;
                        for (let i: number = 0; i < clusterColloideBounds.length; i++) {
                            if (tempElement.tagName === 'g') {
                                tempElement.childNodes[0].textContent = tempElement.childNodes[0].textContent + ',' +
                                    clusterColloideBounds[i as number].textContent;
                            } else {
                                tempElement.textContent = tempElement.textContent + ',' + clusterColloideBounds[i as number].textContent;
                            }
                            clusterGroup.childNodes[o - 1].textContent = ((+(clusterGroup.childNodes[o - 1].textContent)) + (+(clusterColloideBounds[i + 1].textContent))).toString();
                            i++;
                        }
                    }
                    clusterColloideBounds = [];
                }
            }
        }
        while (0 < clusterGroup.childNodes.length) {
            markerCollection.insertBefore(clusterGroup.childNodes[0], markerCollection.firstChild);
        }
        if (check) {
            layerElement.appendChild(markerCollection);
        } else {
            getElementByID(maps.element.id + '_Secondary_Element').appendChild(markerCollection);
            layerElement.appendChild(markerCollection);
        }
        const markerCluster: HTMLElement = document.getElementById(maps.element.id + '_LayerIndex_' + layerIndex + '_markerCluster');
        if (!isNullOrUndefined(markerCluster)) {
            markerCluster.remove();
        }
        if (zoomCheck) {
            const layerGroupElement: HTMLElement = document.getElementById(maps.element.id + '_Layer_Collections');
            if (!isNullOrUndefined(layerGroupElement)) {
                layerGroupElement.appendChild(layerElement);
            }
        }
    });
}

/**
 *
 * @param {MarkerClusterData[]} sameMarkerData - Specifies the marker data
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {Element | HTMLElement} markerElement - Specifies the marker element
 * @returns {void}
 */
export function mergeSeparateCluster(sameMarkerData: MarkerClusterData[], maps: Maps, markerElement: Element | HTMLElement): void {
    const layerIndex: number = sameMarkerData[0].layerIndex;
    const clusterIndex: number = sameMarkerData[0].targetClusterIndex;
    const markerIndex: number = sameMarkerData[0].markerIndex;
    const dataIndex: number = sameMarkerData[0].dataIndex;
    const markerId: string = maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex;
    const marker: MarkerSettingsModel = maps.layers[layerIndex as number].markerSettings[markerIndex as number];
    const clusterId: string = markerId + '_dataIndex_' + dataIndex + '_cluster_' + clusterIndex;
    const clusterEle: Element = maps.layers[layerIndex as number].markerClusterSettings.shape === 'Balloon' ? getElement(clusterId + '_Group') : getElement(clusterId);
    const clusterEleLabel: Element = getElement(clusterId + '_datalabel_' + clusterIndex);
    clusterEle.setAttribute('visibility', 'visible');
    clusterEleLabel.setAttribute('visibility', 'visible');
    let markerEle: Element;
    const markerDataLength: number = sameMarkerData[0].data.length;
    for (let i: number = 0; i < markerDataLength; i++) {
        markerEle = marker.shape === 'Balloon' ? getElement(markerId + '_dataIndex_' + sameMarkerData[0].data[i as number]['index'] + '_Group') : getElement(markerId + '_dataIndex_' + sameMarkerData[0].data[i as number]['index']);
        markerEle['style']['visibility'] = 'hidden';
    }
    removeElement(maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_markerClusterConnectorLine');
}

/**
 *
 * @param {MarkerClusterData[]} sameMarkerData - Specifies the marker data
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {Element | HTMLElement} markerElement - Specifies the marker element
 * @param {boolean} isDom - Specifies the boolean value
 * @returns {void}
 */
export function clusterSeparate(sameMarkerData: MarkerClusterData[], maps: Maps, markerElement: Element | HTMLElement, isDom?: boolean): void {
    const layerIndex: number = sameMarkerData[0].layerIndex;
    const markerIndex: number = sameMarkerData[0].markerIndex;
    const clusterIndex: number = sameMarkerData[0].targetClusterIndex;
    const dataIndex: number = sameMarkerData[0].dataIndex;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getElementFunction: any = isDom ? getElement : markerElement.querySelector.bind(markerElement);
    const getQueryConnect: string = isDom ? '' : '#';
    const markerId: string = maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex;
    const marker: MarkerSettingsModel = maps.layers[layerIndex as number].markerSettings[markerIndex as number];
    const clusterId: string = markerId + '_dataIndex_' + dataIndex + '_cluster_' + clusterIndex;
    const clusterEle: Element = maps.layers[layerIndex as number].markerClusterSettings.shape === 'Balloon' ? getElementFunction(getQueryConnect + '' + clusterId + '_Group') : getElementFunction(getQueryConnect + '' + clusterId);
    const clusterEleLabel: Element = getElementFunction(getQueryConnect + '' + clusterId + '_datalabel_' + clusterIndex);
    clusterEle.setAttribute('visibility', 'hidden');
    clusterEleLabel.setAttribute('visibility', 'hidden');
    let markerEle: Element = marker.shape === 'Balloon' ? getElementFunction(getQueryConnect + '' + markerId + '_dataIndex_' + dataIndex + '_Group') : getElementFunction(getQueryConnect + '' + markerId + '_dataIndex_' + dataIndex);
    const height: number = markerEle.parentElement.id.indexOf('Template_Group') > -1 ? markerEle.getBoundingClientRect().height : marker.height;
    const width: number = markerEle.parentElement.id.indexOf('Template_Group') > -1 ? markerEle.getBoundingClientRect().width : marker.width;
    const centerX: number = +clusterEle.getAttribute('transform').split('translate(')[1].trim().split(' ')[0];
    const centerY: number = +clusterEle.getAttribute('transform').split('translate(')[1].trim().split(' ')[1].split(')')[0].trim();

    let radius: number = width + 5;
    let area: number = 2 * 3.14 * radius;
    let totalMarker: number = 0;
    let numberOfMarker: number = Math.round(area / width);
    totalMarker += numberOfMarker;
    const markerDataLength: number = sameMarkerData[0].data.length;
    let percent: number = Math.round((height / area) * 100);
    percent = markerDataLength < numberOfMarker ? 100 / markerDataLength : percent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let angle: any = (percent / 100) * 360;
    let newAngle: number = markerDataLength < numberOfMarker ? 45 : 0;
    let count: number = 1;
    const start: string = 'M ' + centerX + ' ' + centerY + ' ';
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
        const x1: number = centerX + radius * Math.sin((Math.PI * 2 * newAngle) / 360);
        const y1: number = centerY + radius * Math.cos((Math.PI * 2 * newAngle) / 360);
        path += start + 'L ' + (x1) + ' ' + y1 + ' ';
        markerEle = marker.shape === 'Balloon' ? getElementFunction(getQueryConnect + '' + markerId + '_dataIndex_' + sameMarkerData[0].data[i as number]['index'] + '_Group') : getElementFunction(getQueryConnect + '' + markerId + '_dataIndex_' + sameMarkerData[0].data[i as number]['index']);
        if (markerEle.parentElement.id.indexOf('Template_Group') > -1) {
            markerEle['style']['transform'] = '';
            markerEle['style']['left'] = maps.isTileMap ? x1 - (width / 2) + 'px' : (x1 - (width / 2) - 10) + 'px';
            markerEle['style']['top'] = maps.isTileMap ? y1 - (height / 2) + 'px' : (y1 - (height / 2) - 10) + 'px';
            markerEle.setAttribute('transform', 'translate( ' + x1 + ' ' + y1 + ')');
        } else {
            markerEle.setAttribute('transform', 'translate( ' + x1 + ' ' + y1 + ')');
        }
        markerEle['style']['visibility'] = 'visible';
        newAngle += angle;
    }
    const connectorLine: ConnectorLineSettingsModel = maps.layers[layerIndex as number].markerClusterSettings.connectorLineSettings;
    const options: PathOption = {
        d: path, id: maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_dataIndex_' + dataIndex + '_markerClusterConnectorLine', stroke: connectorLine.color,
        'fill-opacity': connectorLine.opacity, 'stroke-opacity': connectorLine.opacity, 'stroke-width': connectorLine.width
    } as PathOption;
    markerElement = isDom ? getElementFunction(maps.element.id + '_Markers_Group') : markerElement;
    const groupEle: Element = maps.renderer.createGroup({ id: maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_markerClusterConnectorLine' });
    groupEle.appendChild(maps.renderer.drawPath(options));
    if (marker.shape === 'Balloon') {
        markerElement.insertBefore(groupEle, markerElement.querySelector('#' + markerId + '_dataIndex_0_Group'));
    } else {
        markerElement.insertBefore(groupEle, markerElement.querySelector('#' + markerId + '_dataIndex_0'));
    }
}

/**
 *
 * @param {IMarkerRenderingEventArgs} eventArgs - Specifies the arguments
 * @param {MarkerSettings} markerSettings - Specifies the marker settings
 * @param {any[]} markerData - Specifies the marker data
 * @param {number} dataIndex - Specifies the data index
 * @param {Point} location - Specifies the location
 * @param {Point} transPoint - Specifies the translate point
 * @param {string} markerID - Specifies the marker id
 * @param {Point} offset - Specifies the offset value
 * @param {number} scale - Specifies the scale value
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {Element} markerCollection - Specifies the marker collection
 * @returns {Element} - Returns the element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function marker(eventArgs: IMarkerRenderingEventArgs, markerSettings: MarkerSettings, markerData: any[], dataIndex: number,
                       location: Point, transPoint: Point, markerID: string, offset: Point, scale: number, maps: Maps,
                       markerCollection: Element): Element {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shapeCustom: any = {
        size: new Size(eventArgs.width, eventArgs.height),
        fill: eventArgs.fill, borderColor: eventArgs.border.color,
        borderWidth: eventArgs.border.width, opacity: markerSettings.opacity,
        dashArray: markerSettings.dashArray, borderOpacity: isNullOrUndefined(eventArgs.border.opacity) ? markerSettings.opacity :
            eventArgs.border.opacity
    };
    removeElement(markerID);
    const ele: Element = drawSymbols(eventArgs.shape, eventArgs.imageUrl, { x: 0, y: 0 }, markerID, shapeCustom, markerCollection, maps);
    const x: number = (maps.isTileMap ? location.x : (location.x + transPoint.x) * scale) + offset.x;
    const y: number = (maps.isTileMap ? location.y : (location.y + transPoint.y) * scale) + offset.y;
    ele.setAttribute('transform', 'translate( ' + x + ' ' + y + ' )');
    maintainSelection(maps.selectedMarkerElementId, maps.markerSelectionClass, ele, 'MarkerselectionMapStyle');
    markerCollection.appendChild(ele);
    const element: string = (markerData.length - 1) === dataIndex ? 'marker' : null;
    const markerPoint: Point = new Point(x, y);
    if (markerSettings.animationDuration > 0) {
        elementAnimate(
            ele, markerSettings.animationDelay, markerSettings.animationDuration, markerPoint, maps, element
        );
    }
    return markerCollection;
}

/**
 *
 * @param {IMarkerRenderingEventArgs} eventArgs - Specifies the arguments
 * @param {any} templateFn - Specifies the template function
 * @param {string} markerID - Specifies the marker id
 * @param {any} data - Specifies the data
 * @param {number} markerIndex - Specifies the marker index
 * @param {HTMLElement} markerTemplate - Specifies the marker template element
 * @param {Point} location - Specifies the location
 * @param {Point} transPoint - Specifies the translate point.
 * @param {number} scale - Specifies the scale value
 * @param {Point} offset - Specifies the offset value
 * @param {Maps} maps - Specifies the instance of the maps
 * @returns {HTMLElement} - Returns the html element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function markerTemplate(eventArgs: IMarkerRenderingEventArgs, templateFn: any, markerID: string, data: any,
                               markerIndex: number, markerTemplate: HTMLElement, location: Point, transPoint: Point, scale: number, offset: Point, maps: Maps): HTMLElement {
    templateFn = getTemplateFunction(eventArgs.template, maps);
    if (templateFn && (templateFn(data, maps, eventArgs.template, maps.element.id + '_MarkerTemplate' + markerIndex, false).length)) {
        const templateElement: HTMLCollection = templateFn(data, maps, eventArgs.template, maps.element.id + '_MarkerTemplate' + markerIndex, false);
        const markerElement: HTMLElement = <HTMLElement>convertElement(
            templateElement, markerID, data, markerIndex, maps
        );
        for (let i: number = 0; i < markerElement.children.length; i++) {
            (<HTMLElement>markerElement.children[i as number]).style.pointerEvents = 'none';
        }
        markerElement.style.left = (maps.isTileMap ? location.x : (location.x + transPoint.x) * scale) + offset.x -  maps.mapAreaRect.x + 'px';
        markerElement.style.top = (maps.isTileMap ? location.y : (location.y + transPoint.y) * scale) + offset.y - maps.mapAreaRect.y + 'px';
        markerTemplate.appendChild(markerElement);
        if (maps.layers[maps.baseLayerIndex].layerType === 'GoogleStaticMap') {
            const staticMapOffset: ClientRect = getElementByID(maps.element.id + '_StaticGoogleMap').getBoundingClientRect();
            const markerElementOffset: ClientRect = markerElement.getBoundingClientRect();
            const staticMapOffsetWidth: number = 640;
            if ((staticMapOffset['x'] > markerElementOffset['x'] || staticMapOffset['x'] + staticMapOffsetWidth < markerElementOffset['x'] + markerElementOffset['width'])
                && (staticMapOffset['y'] > markerElementOffset['y'] || staticMapOffset['y'] + staticMapOffset['height'] < markerElementOffset['y'] + markerElementOffset['height'])
            ) {
                markerElement.style.display = 'none';
            }
        }

    }
    return markerTemplate;
}

/**
 * To maintain selection during page resize
 *
 * @param {string[]} elementId - Specifies the element id
 * @param {Element} elementClass - Specifies the element class
 * @param {Element} element - Specifies the element
 * @param {string} className - Specifies the class name
 * @returns {void}
 * @private
 */
export function maintainSelection(elementId: string[], elementClass: Element, element: Element, className: string): void {
    if (elementId) {
        for (let index: number = 0; index < elementId.length; index++) {
            if (element.getAttribute('id') === elementId[index as number]) {
                if (index === 0 || element.tagName === 'g') {
                    if (!isNullOrUndefined(elementClass) && !isNullOrUndefined(elementClass.id)) {
                        document.body.appendChild(elementClass);
                    }
                    if (element.id.indexOf('_MarkerIndex_') > -1 && element.childElementCount > 0) {
                        element.children[0].setAttribute('class', className);
                    }
                }
                element.setAttribute('class', className);
            }
        }
    }
}

/**
 * To maintain selection style class
 *
 * @param {string} id - Specifies the id
 * @param {string} idClass - Specifies the class id
 * @param {string} fill - Specifies the fill
 * @param {string} opacity - Specifies the opactiy
 * @param {string} borderColor - Specifies the border color
 * @param {string} borderWidth - Specifies the border width
 * @param {Maps} maps - Specifies the maps
 * @returns {void}
 * @private
 */
export function maintainStyleClass(id: string, idClass: string, fill: string, opacity: string, borderColor: string,
                                   borderWidth: string, maps: Maps): void {
    if (!getElement(id)) {
        const styleClass: Element = createElement('style', {
            id: id, innerHTML: '.' + idClass + '{fill:'
                + fill + ';' + 'opacity:' + opacity + ';' +
                'stroke-width:' + borderWidth + ';' +
                'stroke:' + borderColor + ';' + '}'
        });
        maps.shapeSelectionClass = styleClass;
        document.body.appendChild(styleClass);
    }
}

/**
 * Internal use of append shape element
 *
 * @param {Element} shape - Specifies the shape
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function appendShape(shape: Element, element: Element): Element {
    if (element) { element.appendChild(shape); }
    return shape;
}
/**
 * Internal rendering of Circle
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {CircleOption} options - Specifies the circle options
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawCircle(maps: Maps, options: CircleOption, element?: Element): Element {
    return appendShape(maps.renderer.drawCircle(options), element);
}
/**
 * Internal rendering of Rectangle
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {RectOption} options - Specifies the rect options
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawRectangle(maps: Maps, options: RectOption, element?: Element): Element {
    return appendShape(maps.renderer.drawRectangle(options), element);
}
/**
 * Internal rendering of Path
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {PathOption} options - Specifies the polygon options
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawPath(maps: Maps, options: PathOption, element?: Element): Element {
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Polygon
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {PolygonOption} options - Specifies the polygon options
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawPolygon(maps: Maps, options: PolygonOption, element?: Element): Element {
    return appendShape(maps.renderer.drawPolygon(options), element);
}
/**
 * Internal rendering of Polyline
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {PolylineOption} options - Specifies the poly line options
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawPolyline(maps: Maps, options: PolylineOption, element?: Element): Element {
    return appendShape(maps.renderer.drawPolyline(options), element);
}
/**
 * Internal rendering of Line
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {LineOption} options - Specifies the line options
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawLine(maps: Maps, options: LineOption, element?: Element): Element {
    return appendShape(maps.renderer.drawLine(options), element);
}

/**
 * Calculate marker shapes
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {MarkerType} shape - Specifies the marker type
 * @param {PathOption} options - Specifies the path options
 * @param {Size} size - Specifies the size
 * @param {MapLocation} location - Specifies the map location
 * @param {Element} markerEle - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function calculateShapes(
    maps: Maps, shape: MarkerType, options: PathOption, size: Size, location: MapLocation, markerEle: Element
): Element {
    let tempGroup: Element;
    switch (shape) {
    case 'Balloon':
        tempGroup = drawBalloon(maps, options, size, location, 'Marker', markerEle);
        break;
    case 'Cross':
        options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' + (location.y + size.height
            / 2) + ' M ' + (location.x - size.width / 2) + ' ' + location.y + ' L ' + (location.x + size.width / 2) + ' ' + location.y;
        break;
    case 'Diamond':
        options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + (location.x + size.width / 2) + ' '
            + location.y + ' L ' + location.x + ' ' + (location.y + size.height / 2) + ' L ' + (location.x - size.width / 2)
            + ' ' + location.y + ' Z';
        break;
    case 'Star':
        options.d = 'M ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + (location.x - size.width / 2)
            + ' ' + (location.y + size.height / 6) + ' L ' + (location.x + size.width / 2) + ' ' + (location.y + size.height / 6)
            + ' L ' + (location.x - size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' +
            (location.y + size.height / 2) + ' L ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' Z';
        break;
    case 'Triangle':
        options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + (location.x + size.width / 2) + ' ' +
            (location.y + size.height / 2) + ' L ' + (location.x - size.width / 2) + ' ' + (location.y + size.height / 2) + ' Z';
        break;
    case 'HorizontalLine':
        options.d = ' M ' + (location.x - size.width / 2) + ' ' + location.y + ' L ' + (location.x + size.width / 2) + ' '
            + location.y;
        break;
    case 'VerticalLine':
        options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' +
            (location.y + size.height / 2);
        break;
    case 'InvertedTriangle':
        options.d = 'M ' + (location.x - size.width / 2) + ' ' + (location.y - size.height / 2) + ' L ' + (location.x + size.width / 2) + ' ' +
            (location.y - size.height / 2) + ' L ' + (location.x) + ' ' + (location.y + size.height / 2) + ' Z';
        break;
    case 'Pentagon':
        // eslint-disable-next-line no-case-declarations
        const eq: number = 72; let xValue: number; let yValue: number;
        for (let i: number = 0; i < 5; i++) {
            xValue = (size.width / 2) * Math.cos((Math.PI / 180) * (i * eq));
            yValue = (size.height / 2) * Math.sin((Math.PI / 180) * (i * eq));
            options.d += (i === 0 ? 'M ' : 'L ') + (location.x + xValue) + ' ' + (location.y + yValue);
        }
        options.d += ' Z';
        break;
    }
    if (shape === 'Cross' || shape === 'HorizontalLine' || shape === 'VerticalLine') {
        options['stroke'] = (options['stroke'] === 'transparent') ? options['fill'] : options['stroke'];
    }
    return shape === 'Balloon' ? tempGroup : maps.renderer.drawPath(options);
}


/**
 * Internal rendering of Diamond
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {PathOption} options - Specifies the path options
 * @param {Size} size - Specifies the size
 * @param {MapLocation} location - Specifies the map location
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawDiamond(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element {
    options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + (location.x + size.width / 2) + ' ' + location.y +
        ' L ' + location.x + ' ' + (location.y + size.height / 2) + ' L ' + (location.x - size.width / 2) + ' ' + location.y + ' Z';
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Triangle
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {PathOption} options - Specifies the path options
 * @param {Size} size - Specifies the size
 * @param {MapLocation} location - Specifies the map location
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawTriangle(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element {
    options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + (location.x + size.width / 2) + ' ' +
        (location.y + size.height / 2) + ' L ' + (location.x - size.width / 2) + ' ' + (location.y + size.height / 2) + ' Z';
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Cross
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {PathOption} options - Specifies the path options
 * @param {Size} size - Specifies the size
 * @param {MapLocation} location - Specifies the map location
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawCross(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element {
    options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' + (location.y + size.height / 2) +
        ' M ' + (location.x - size.width / 2) + ' ' + location.y + ' L ' + (location.x + size.width / 2) + ' ' + location.y;
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of HorizontalLine
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {PathOption} options - Specifies the path options
 * @param {Size} size - Specifies the size
 * @param {MapLocation} location - Specifies the map location
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawHorizontalLine(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element {
    options.d = ' M ' + (location.x - size.width / 2) + ' ' + location.y + ' L ' + (location.x + size.width / 2) + ' ' + location.y;
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of VerticalLine
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {PathOption} options - Specifies the path options
 * @param {Size} size - Specifies the size
 * @param {MapLocation} location - Specifies the map location
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawVerticalLine(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element {
    options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' + (location.y + size.height / 2);
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Star
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {PathOption} options - Specifies the path options
 * @param {Size} size - Specifies the size
 * @param {MapLocation} location - Specifies the map location
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawStar(maps: Maps, options: PathOption, size: Size, location: MapLocation, element?: Element): Element {
    options.d = 'M ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + (location.x - size.width / 2)
        + ' ' + (location.y + size.height / 6) + ' L ' + (location.x + size.width / 2) + ' ' + (location.y + size.height / 6) + ' L '
        + (location.x - size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' + (location.y + size.height / 2)
        + ' L ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' Z';
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Balloon
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {PathOption} options - Specifies the path options
 * @param {Size} size - Specifies the size
 * @param {MapLocation} location - Specifies the map location
 * @param {string} type - Specifies the type.
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawBalloon(maps: Maps, options: PathOption, size: Size, location: MapLocation, type: string, element?: Element): Element {
    const width: number = size.width;
    const height: number = size.height;
    let pathElement: Element;
    location.x -= width / 2;
    location.y -= height;
    options.d = 'M15,0C8.8,0,3.8,5,3.8,11.2C3.8,17.5,9.4,24.4,15,30c5.6-5.6,11.2-12.5,11.2-18.8C26.2,5,21.2,0,15,0z M15,16' +
        'c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S17.8,16,15,16z';
    const balloon: Element = maps.renderer.drawPath(options);
    const x: number = size.width / 30;
    const y: number = size.height / 30;
    balloon.setAttribute('transform', 'translate(' + location.x + ', ' + location.y + ') scale(' + x + ', ' + y + ')');
    if (type === 'Marker') {
        const g: Element = maps.renderer.createGroup({ id: options.id + '_Group' });
        appendShape(balloon, g);
        pathElement = appendShape(g, element);
    }
    else {
        pathElement = balloon;
    }
    return pathElement;
}
/**
 * Internal rendering of Pattern
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {PatternOptions} options - Specifies the pattern options
 * @param {Element[]} elements - Specifies the elements
 * @param {Element} element - Specifies the element
 * @returns {Element} - Returns the element
 * @private
 */
export function drawPattern(maps: Maps, options: PatternOptions, elements: Element[], element?: Element): Element {
    const pattern: Element = maps.renderer.createPattern(options, 'pattern');
    for (const ele of elements) {
        appendShape(ele, pattern);
    }
    return appendShape(pattern, element);
}
/**
 * Method to get specific field and vaues from data.
 *
 * @param {any[]} dataSource - Specifies the data source
 * @param {string[]} fields - Specifies the fields
 * @returns {any[]} - Returns the object
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFieldData(dataSource: any[], fields: string[]): any[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newData: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: { [key: string]: any };
    for (const temp of dataSource) {
        data = {};
        for (const field of fields) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((<any>temp)[field as string]) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data[field as string] = (<any>temp)[field as string];
            }
        }
        newData.push(data);
    }
    return newData;
}
/**
 * To find the index of dataSource from shape properties
 *
 * @param {any[]} dataSource - Specifies the data source
 * @param {any} properties - Specifies the properties
 * @param {string} dataPath - Specifies the data path
 * @param {string | string[]} propertyPath - Specifies the property path
 * @param {LayerSettingsModel} layer - Specifies the layer settings
 * @returns {number} - Returns the number
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkShapeDataFields(dataSource: any[], properties: any, dataPath: string, propertyPath: string | string[],
                                     layer: LayerSettingsModel): number {
    if (!(isNullOrUndefined(properties))) {
        for (let i: number = 0; i < dataSource.length; i++) {
            const shapeDataPath: string = ((dataPath.indexOf('.') > -1) ? getValueFromObject(dataSource[i as number], dataPath) :
                dataSource[i as number][dataPath as string]);
            const shapePath: string = checkPropertyPath(shapeDataPath, propertyPath, properties);
            const shapeDataPathValue: string = !isNullOrUndefined(shapeDataPath) && isNaN(properties[shapePath as string])
                ? (typeof shapeDataPath === 'string' ? shapeDataPath.toLowerCase() : shapeDataPath) : shapeDataPath;
            const propertiesShapePathValue: string = !isNullOrUndefined(properties[shapePath as string]) && isNaN(properties[shapePath as string])
                ? properties[shapePath as string].toLowerCase() : properties[shapePath as string];
            if (shapeDataPathValue === propertiesShapePathValue) {
                return i;
            }
        }
    }
    return null;
}
/**
 *
 * @param {string} shapeData - Specifies the shape data
 * @param {string | string[]} shapePropertyPath -  Specifies the shape property path
 * @param {any} shape -  Specifies the shape
 * @returns {string} - Returns the string value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkPropertyPath(shapeData: string, shapePropertyPath: string | string[], shape: any): string {
    if (!isNullOrUndefined(shapeData) && !isNullOrUndefined(shape)) {
        if (!isNullOrUndefined(shapePropertyPath)) {
            const properties: string[] = (Object.prototype.toString.call(shapePropertyPath) === '[object Array]' ?
                shapePropertyPath : [shapePropertyPath]) as string[];
            for (let i: number = 0; i < properties.length; i++) {
                const shapeDataValue: string = !isNullOrUndefined(shapeData) && typeof shapeData === 'string' ?
                    shapeData.toLowerCase() : shapeData;
                const shapePropertiesValue: string = !isNullOrUndefined(shape[properties[i as number]])
                    && isNaN(shape[properties[i as number]])
                    ? shape[properties[i as number]].toLowerCase() : shape[properties[i as number]];
                if (shapeDataValue === shapePropertiesValue) {
                    return properties[i as number];
                }
            }
        }
    }
    return null;
}

/**
 *
 * @param {MapLocation[]} points - Specifies the location
 * @param {number} start - Specifies the start value
 * @param {number} end - Specifies the end value
 * @returns {MapLocation[]} - Returns the location
 */
export function filter(points: MapLocation[], start: number, end: number): MapLocation[] {
    const pointObject: MapLocation[] = [];
    for (let i: number = 0; i < points.length; i++) {
        const point: MapLocation = points[i as number];
        if (start <= point.y && end >= point.y) {
            pointObject.push(point);
        }
    }
    return pointObject;
}

/**
 *
 * @param {number} min - Specifies the min value
 * @param {number} max - Specifies the max value
 * @param {number} value - Specifies the value
 * @param {number} minValue - Specifies the minValue
 * @param {number} maxValue -Specifies the maxValue
 * @returns {number} - Returns the number
 */
export function getRatioOfBubble(min: number, max: number, value: number, minValue: number, maxValue: number): number {
    const percent: number = (100 / (maxValue - minValue)) * (value - minValue);
    let bubbleRadius: number = (((max - min) / 100) * percent) + min;
    if (maxValue === minValue) {
        bubbleRadius = (((max - min) / 100)) + min;
    }
    return bubbleRadius;
}
/**
 * To find the midpoint of the polygon from points
 *
 * @param {MapLocation[]} points - Specifies the points
 * @param {string} type - Specifies the type
 * @param {string} geometryType - Specified the type of the geometry
 * @returns {any} - Specifies the object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findMidPointOfPolygon(points: MapLocation[], type: string, geometryType?: string): any {
    if (!points.length) {
        return null;
    }
    const min: number = 0;
    const max: number = points.length;
    let startX: number;
    let startY: number;
    let startX1: number;
    let startY1: number;
    let sum: number = 0;
    let xSum: number = 0;
    let ySum: number = 0;

    for (let i: number = min; i <= max - 1; i++) {
        startX = points[i as number].x;
        startY = type === 'Mercator' || geometryType === 'Normal' ? points[i as number].y : -(points[i as number].y);
        if (i === max - 1) {
            startX1 = points[0].x;
            startY1 = type === 'Mercator' || geometryType === 'Normal' ? points[0].y : -(points[0].y);
        } else {
            startX1 = points[i + 1].x;
            startY1 = type === 'Mercator' || geometryType === 'Normal' ? points[i + 1].y : -(points[i + 1].y);
        }
        sum = sum + Math.abs(((startX * startY1)) - (startX1 * startY));
        xSum = xSum + Math.abs(((startX + startX1) * (((startX * startY1) - (startX1 * startY)))));
        ySum = ySum + Math.abs(((startY + startY1) * (((startX * startY1) - (startX1 * startY)))));
    }
    sum = 0.5 * sum;
    xSum = (1 / (4 * sum)) * xSum;
    ySum = (1 / (4 * sum)) * ySum;

    /* Code for finding nearest points in polygon related to midPoint*/
    let rightMinPoint: MapLocation = { x: 0, y: 0 };
    let rightMaxPoint: MapLocation = { x: 0, y: 0 };
    let leftMinPoint: MapLocation = { x: 0, y: 0 };
    let leftMaxPoint: MapLocation = { x: 0, y: 0 };
    let bottomMinPoint: MapLocation = { x: 0, y: 0 };
    let bottomMaxPoint: MapLocation = { x: 0, y: 0 };
    let topMinPoint: MapLocation = { x: 0, y: 0 };
    let topMaxPoint: MapLocation = { x: 0, y: 0 };
    let height: number = 0;
    for (let i: number = min; i <= max - 1; i++) {
        const point: MapLocation = points[i as number];
        point.y = type === 'Mercator' || geometryType === 'Normal' ? point.y : -(point.y);
        if (point.y > ySum) {
            if (point.x < xSum && xSum - point.x < xSum - bottomMinPoint.x) {
                bottomMinPoint = { x: point.x, y: point.y };
            } else if (point.x > xSum && (bottomMaxPoint.x === 0 || point.x - xSum < bottomMaxPoint.x - xSum)) {
                bottomMaxPoint = { x: point.x, y: point.y };
            }
        } else {
            if (point.x < xSum && xSum - point.x < xSum - topMinPoint.x) {
                topMinPoint = { x: point.x, y: point.y };
            } else if (point.x > xSum && (topMaxPoint.x === 0 || point.x - xSum < topMaxPoint.x - xSum)) {
                topMaxPoint = { x: point.x, y: point.y };
            }
        }
        height = (bottomMaxPoint.y - topMaxPoint.y) + ((bottomMaxPoint.y - topMaxPoint.y) / 4);
        if (point.x > xSum) {
            if (point.y < ySum && ySum - point.y < ySum - rightMinPoint.y) {
                rightMinPoint = { x: point.x, y: point.y };
            } else if (point.y > ySum && (rightMaxPoint.y === 0 || point.y - ySum < rightMaxPoint.y - ySum)) {
                rightMaxPoint = { x: point.x, y: point.y };
            }
        } else {
            if (point.y < ySum && ySum - point.y < ySum - leftMinPoint.y) {
                leftMinPoint = { x: point.x, y: point.y };
            } else if (point.y > ySum && (leftMaxPoint.y === 0 || point.y - ySum < leftMaxPoint.y - ySum)) {
                leftMaxPoint = { x: point.x, y: point.y };
            }
        }
    }

    return {
        x: xSum, y: ySum, rightMin: rightMinPoint, rightMax: rightMaxPoint,
        leftMin: leftMinPoint, leftMax: leftMaxPoint, points: points, topMax: topMaxPoint, topMin: topMinPoint,
        bottomMax: bottomMaxPoint, bottomMin: bottomMinPoint, height: height
    };
}
/**
 * Check custom path
 *
 * @param {any[]} layerData - Specifies the layer data
 * @returns {boolean} - Returns the boolean vlue
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isCustomPath(layerData: any[]): boolean {
    let customPath: boolean = false;
    if (Object.prototype.toString.call(layerData) === '[object Array]') {
        Array.prototype.forEach.call(layerData, (layer: LayerSettings, index: number) => {
            if (!isNullOrUndefined(layer['geometry']) && layer['geometry']['type'] === 'Path') {
                customPath = true;
            }
        });
    }
    return customPath;
}

/**
 * Trim the title text
 *
 * @param {number} maxWidth - Specifies the maximum width
 * @param {string} text - Specifies the text
 * @param {FontModel} font - Specifies the font
 * @returns {string} - Returns the string
 * @private
 */
export function textTrim(maxWidth: number, text: string, font: FontModel): string {
    let label: string = text;
    let size: number = measureText(text, font).width;
    if (size > maxWidth) {
        const textLength: number = text.length;
        for (let i: number = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i) + '...';
            size = measureText(label, font).width;
            if (size <= maxWidth || label.length < 4) {
                if (label.length < 4) {
                    label = ' ';
                }
                return label;
            }
        }
    }
    return label;
}

/**
 * Method to calculate x position of title
 *
 * @param {Rect} location - Specifies the location
 * @param {Alignment} alignment - Specifies the alignment
 * @param {Size} textSize - Specifies the text size
 * @param {string} type - Specifies the type
 * @returns {Point} - Returns the point values
 */
export function findPosition(location: Rect, alignment: Alignment, textSize: Size, type: string): Point {
    let x: number;
    switch (alignment) {
    case 'Near':
        x = location.x;
        break;
    case 'Center':
        x = (type === 'title') ? (location.width / 2 - textSize.width / 2) :
            ((location.x + (location.width / 2)) - textSize.width / 2);
        break;
    case 'Far':
        x = (type === 'title') ? (location.width - location.y - textSize.width) :
            ((location.x + location.width) - textSize.width);
        break;
    }
    const y: number = (type === 'title') ? location.y + (textSize.height / 2) : ((location.y + location.height / 2) + textSize.height / 2);
    return new Point(x, y);
}
/**
 * To remove element by id
 *
 * @param {string} id - Specifies the id
 * @returns {void}
 */
export function removeElement(id: string): void {
    const element: Element = document.getElementById(id);
    return element ? remove(element) : null;
}

/**
 * To calculate map center position from pixel values
 *
 * @param {Maps} mapObject - Specifies the map object
 * @param {LayerSettings} layer - Specifies the layer settings
 * @returns {Point} - Returns the x and y points
 */
export function calculateCenterFromPixel(mapObject: Maps, layer: LayerSettings): Point {
    const point1: Point = convertGeoToPoint(
        mapObject.minLatOfGivenLocation, mapObject.minLongOfGivenLocation, mapObject.mapLayerPanel.calculateFactor(layer), layer, mapObject);
    const point2: Point = convertGeoToPoint(
        mapObject.maxLatOfGivenLocation, mapObject.maxLongOfGivenLocation, mapObject.mapLayerPanel.calculateFactor(layer), layer, mapObject);
    const x: number = (point1.x + point2.x) / 2;
    const y: number = (point1.y + point2.y) / 2;
    return new Point(x, y);
}

/**
 * @param {Maps} mapObject - Specifies the map object
 * @param {LayerSettings} layer - Specifies the layer settings
 * @param {boolean} animate - Specifies the boolean value
 * @returns {any} - Returns the object
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTranslate(mapObject: Maps, layer: LayerSettings, animate?: boolean): any {
    let zoomFactorValue: number = mapObject.zoomSettings.zoomFactor; let scaleFactor: number;
    let center: CenterPositionModel = mapObject.centerPosition;
    let centerLatitude: number = center.latitude;
    let centerLongitude: number = center.longitude;
    const checkMethodeZoom: boolean = !isNullOrUndefined(mapObject.centerLatOfGivenLocation) &&
        !isNullOrUndefined(mapObject.centerLongOfGivenLocation) && mapObject.zoomNotApplied;
    if (isNullOrUndefined(mapObject.mapScaleValue)) {
        mapObject.mapScaleValue = zoomFactorValue;
    }
    if (mapObject.zoomSettings.shouldZoomInitially && mapObject.zoomSettings.enable) {
        mapObject.mapScaleValue = scaleFactor = zoomFactorValue = ((mapObject.zoomSettings.shouldZoomInitially || mapObject.enablePersistence) && mapObject.scale === 1)
            ? mapObject.scale : (isNullOrUndefined(mapObject.markerZoomFactor)) ? 1 : mapObject.markerZoomFactor;
        if (mapObject.mapScaleValue !== mapObject.markerZoomFactor && !mapObject.enablePersistence) {
            mapObject.mapScaleValue = zoomFactorValue = mapObject.markerZoomFactor;
        }
        if (!isNullOrUndefined(mapObject.markerCenterLatitude) && !isNullOrUndefined(mapObject.markerCenterLongitude)) {
            centerLatitude = mapObject.markerCenterLatitude;
            centerLongitude = mapObject.markerCenterLongitude;
        }
    }
    if (checkMethodeZoom) {
        mapObject.mapScaleValue = scaleFactor = zoomFactorValue = mapObject.scaleOfGivenLocation;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const min: any = !isNullOrUndefined(mapObject.baseMapRectBounds) ? mapObject.baseMapRectBounds['min'] as any : null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const max: any = !isNullOrUndefined(mapObject.baseMapRectBounds) ? mapObject.baseMapRectBounds['max'] as any : null;
    const zoomFactor: number = animate ? 1 : mapObject.mapScaleValue;
    if (isNullOrUndefined(mapObject.currentShapeDataLength)) {
        mapObject.currentShapeDataLength = !isNullOrUndefined(layer.shapeData['features'])
            ? layer.shapeData['features'].length : layer.shapeData['geometries'].length;
    }
    const size: Rect = (mapObject.totalRect && mapObject.legendSettings.visible) ? mapObject.totalRect : mapObject.mapAreaRect;
    const availSize: Size = mapObject.availableSize;
    let x: number; let y: number;
    if (!isNullOrUndefined(min) && !isNullOrUndefined(max)) {
        let mapWidth: number = Math.abs(max['x'] - min['x']);
        let mapHeight: number = Math.abs(min['y'] - max['y']);
        const factor: number = animate ? 1 : mapObject.markerZoomFactor === 1 ? mapObject.mapScaleValue : zoomFactorValue;
        center = mapObject.zoomSettings.shouldZoomInitially
            && mapObject.markerZoomedState && !mapObject.zoomPersistence ? mapObject.markerZoomCenterPoint :
            mapObject.centerPosition;
        if (((!isNullOrUndefined(centerLongitude) && centerLongitude !== 0) && (!isNullOrUndefined(centerLatitude) && centerLatitude !== 0)) || checkMethodeZoom) {
            const leftPosition: number = (((mapWidth + Math.abs(mapObject.mapAreaRect.width - mapWidth)) / 2) + mapObject.mapAreaRect.x) / factor;
            const topPosition: number = (((mapHeight + Math.abs(mapObject.mapAreaRect.height - mapHeight)) / 2) + mapObject.mapAreaRect.y) / factor;
            const point: Point = checkMethodeZoom ? calculateCenterFromPixel(mapObject, layer) :
                convertGeoToPoint(
                    centerLatitude, centerLongitude, mapObject.mapLayerPanel.calculateFactor(layer), layer, mapObject);
            if (isNullOrUndefined(mapObject.previousProjection) || mapObject.previousProjection !== mapObject.projectionType) {
                x = -point.x + leftPosition;
                y = -point.y + topPosition;
                scaleFactor = zoomFactor;
            } else {
                if (Math.floor(mapObject.scale) !== 1 && mapObject.zoomSettings.shouldZoomInitially || (mapObject.zoomNotApplied)) {
                    x = -point.x + leftPosition;
                    y = -point.y + topPosition;
                } else {
                    if (mapObject.zoomSettings.shouldZoomInitially || mapObject.zoomNotApplied) {
                        x = -point.x + leftPosition;
                        y = -point.y + topPosition;
                        scaleFactor = zoomFactor;
                    } else {
                        x = mapObject.zoomTranslatePoint.x;
                        y = mapObject.zoomTranslatePoint.y;
                    }
                }
                scaleFactor = mapObject.mapScaleValue;
            }
        } else {
            if (isNullOrUndefined(mapObject.previousProjection) || mapObject.previousProjection !== mapObject.projectionType) {
                if (mapHeight === 0 || mapWidth === 0 || mapHeight === mapWidth) {
                    mapWidth = size.width / 2;
                    mapHeight = size.height;
                }
                scaleFactor = parseFloat(Math.min(size.width / mapWidth, size.height / mapHeight).toFixed(2));
                scaleFactor = scaleFactor > 1.05 ? 1 : scaleFactor;
                mapWidth *= scaleFactor;
                mapHeight *= scaleFactor;
                const widthDiff: number = min['x'] !== 0 && mapObject.translateType === 'layers' ? availSize.width - size.width : 0;
                x = size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2))) - widthDiff;
                y = size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2)));
                mapObject.previousTranslate = new Point(x, y);
            } else {
                if (!mapObject.zoomSettings.shouldZoomInitially && mapObject.markerZoomFactor === 1 && mapObject.mapScaleValue === 1) {
                    scaleFactor = parseFloat(Math.min(size.width / mapWidth, size.height / mapHeight).toFixed(2));
                    mapHeight *= scaleFactor; mapWidth *= scaleFactor;
                    y = size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2)));
                    x = size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2)));
                } else {
                    scaleFactor = mapObject.mapScaleValue < 1 ? mapObject.mapScaleValue + 1 : mapObject.mapScaleValue;
                    mapObject.mapScaleValue = mapObject.zoomSettings.enable && mapObject.mapScaleValue !== 1 ? mapObject.mapScaleValue : 1;
                    if ((mapObject.currentShapeDataLength !== (!isNullOrUndefined(layer.shapeData['features'])
                        ? layer.shapeData['features'].length : layer.shapeData['geometries'].length)) && layer.type !== 'SubLayer') {
                        const scale: number = parseFloat(Math.min(size.height / mapHeight, size.width / mapWidth).toFixed(2));
                        mapHeight *= scale; mapWidth *= scale;
                        y = size.y + ((-(min['y'])) + ((size.height / 2)
                            - (mapHeight / 2)));
                        scaleFactor = scale;
                        x = size.x + ((-(min['x']))
                            + ((size.width / 2) - (mapWidth / 2)));
                    } else if (mapObject.availableSize.height !== mapObject.heightBeforeRefresh || mapObject.widthBeforeRefresh !== mapObject.availableSize.width) {
                        const cscaleFactor: number = parseFloat(Math.min(size.width / mapWidth, size.height / mapHeight).toFixed(2));
                        let cmapWidth: number = mapWidth; cmapWidth *= cscaleFactor;
                        let cmapHeight: number = mapHeight; cmapHeight *= cscaleFactor;
                        const x1: number = size.x + ((-(min['x'])) + ((size.width / 2) - (cmapWidth / 2)));
                        const y1: number = size.y + ((-(min['y'])) + ((size.height / 2) - (cmapHeight / 2)));
                        const xdiff: number = (mapObject.translatePoint.x - mapObject.previousTranslate.x) / (mapObject.widthBeforeRefresh);
                        const ydiff: number = (mapObject.translatePoint.y - mapObject.previousTranslate.y) / (mapObject.heightBeforeRefresh);
                        const actxdiff: number = xdiff * (mapObject.availableSize.width);
                        const actydiff: number = ydiff * (mapObject.availableSize.height);
                        x = x1 + actxdiff;
                        y = y1 + actydiff;
                        mapObject.previousTranslate = new Point(x1, y1);
                        mapObject.zoomTranslatePoint.x = x;
                        mapObject.zoomTranslatePoint.y = y;
                    } else {
                        if (!isNullOrUndefined(mapObject.previousProjection) && (mapObject.mapScaleValue === 1
                            || mapObject.mapScaleValue <= 1.05) && !mapObject.zoomModule.isDragZoom) {
                            scaleFactor = parseFloat(Math.min(size.width / mapWidth, size.height / mapHeight).toFixed(2));
                            scaleFactor = scaleFactor > 1.05 ? 1 : scaleFactor;
                            mapWidth *= scaleFactor;
                            x = size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2)));
                            mapHeight *= scaleFactor;
                            y = size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2)));
                        } else {
                            x = mapObject.zoomTranslatePoint.x;
                            y = mapObject.zoomTranslatePoint.y;
                            scaleFactor = mapObject.scale;
                        }
                    }
                }
            }
        }
        if (!isNullOrUndefined(mapObject.translatePoint)) {
            x = (mapObject.enablePersistence && mapObject.translatePoint.x !== 0 && !mapObject.zoomNotApplied) ?
                mapObject.translatePoint.x : x;
            y = (mapObject.enablePersistence && mapObject.translatePoint.y !== 0 && !mapObject.zoomNotApplied) ?
                mapObject.translatePoint.y : y;
        }
    }
    scaleFactor = (mapObject.enablePersistence) ? ((mapObject.mapScaleValue >= 1) ? mapObject.mapScaleValue : 1) : scaleFactor;
    mapObject.widthBeforeRefresh = mapObject.availableSize.width;
    mapObject.heightBeforeRefresh = mapObject.availableSize.height;
    return { scale: scaleFactor, location: new Point(x, y) };
}

/**
 * @param {Maps} mapObject - Specifies the map object
 * @param {LayerSettings} layer - Specifies the layer
 * @param {boolean} animate - Specifies the boolean value
 * @returns {any} - Returns the object.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getZoomTranslate(mapObject: Maps, layer: LayerSettings, animate?: boolean): any {
    let zoomFactorValue: number = mapObject.zoomSettings.zoomFactor;
    let scaleFactor: number;
    const center: CenterPositionModel = mapObject.centerPosition;
    let latitude: number = center.latitude;
    let longitude: number = center.longitude;
    const checkZoomMethod: boolean = !isNullOrUndefined(mapObject.centerLongOfGivenLocation) &&
        !isNullOrUndefined(mapObject.centerLatOfGivenLocation) && mapObject.zoomNotApplied;
    if (isNullOrUndefined(mapObject.previousCenterLatitude) &&
        isNullOrUndefined(mapObject.previousCenterLongitude)) {
        mapObject.previousCenterLatitude = mapObject.centerPosition.latitude;
        mapObject.previousCenterLongitude = mapObject.centerPosition.longitude;
    }
    else if (mapObject.previousCenterLatitude !==
        mapObject.centerPosition.latitude && mapObject.previousCenterLongitude !==
        mapObject.centerPosition.longitude) {
        mapObject.centerPositionChanged = true;
        mapObject.previousCenterLatitude = mapObject.centerPosition.latitude;
        mapObject.previousCenterLongitude = mapObject.centerPosition.longitude;
    }
    else {
        mapObject.centerPositionChanged = false;
    }
    if (isNullOrUndefined(mapObject.mapScaleValue) || (zoomFactorValue > mapObject.mapScaleValue)) {
        if (mapObject.isReset && mapObject.mapScaleValue === 1) {
            // eslint-disable-next-line no-self-assign
            mapObject.mapScaleValue = mapObject.mapScaleValue;
        } else {
            mapObject.mapScaleValue = zoomFactorValue;
        }
    }
    mapObject.mapScaleValue = mapObject.zoomSettings.zoomFactor !== 1 &&
        mapObject.zoomSettings.zoomFactor ===
        mapObject.mapScaleValue ? mapObject.zoomSettings.zoomFactor :
        mapObject.zoomSettings.zoomFactor !== mapObject.mapScaleValue && !mapObject.centerPositionChanged ?
            mapObject.mapScaleValue : mapObject.zoomSettings.zoomFactor;
    if (mapObject.zoomSettings.shouldZoomInitially && !mapObject.isZoomByPosition) {
        mapObject.mapScaleValue = zoomFactorValue = scaleFactor = ((mapObject.enablePersistence
                                                                    || mapObject.zoomSettings.shouldZoomInitially) && mapObject.scale === 1)
            ? mapObject.scale : (isNullOrUndefined(mapObject.markerZoomFactor)) ? mapObject.mapScaleValue : mapObject.markerZoomFactor;
        zoomFactorValue = mapObject.mapScaleValue;
        if (!isNullOrUndefined(mapObject.markerCenterLatitude) && !isNullOrUndefined(mapObject.markerCenterLongitude)) {
            latitude = mapObject.markerCenterLatitude;
            longitude = mapObject.markerCenterLongitude;
        }
    }
    if (checkZoomMethod) {
        mapObject.mapScaleValue = scaleFactor = zoomFactorValue = mapObject.scaleOfGivenLocation;
    }
    const zoomFactor: number = animate ? 1 : mapObject.mapScaleValue;
    const size: Rect = mapObject.mapAreaRect; let x: number; let y: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const min: any = mapObject.baseMapRectBounds['min'] as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const max: any = mapObject.baseMapRectBounds['max'] as any;
    const factor: number = animate ? 1 : mapObject.mapScaleValue;
    const mapWidth: number = Math.abs(max['x'] - min['x']); const mapHeight: number = Math.abs(min['y'] - max['y']);
    if (((!isNullOrUndefined(longitude) && longitude !== 0) && (!isNullOrUndefined(latitude) && latitude !== 0)) || checkZoomMethod) {
        const topPosition: number = ((mapHeight + Math.abs(mapObject.mapAreaRect.height - mapHeight)) / 2) / factor;
        const leftPosition: number = ((mapWidth + Math.abs(mapObject.mapAreaRect.width - mapWidth)) / 2) / factor;
        const point: Point = checkZoomMethod ? calculateCenterFromPixel(mapObject, layer) :
            convertGeoToPoint(
                latitude, longitude, mapObject.mapLayerPanel.calculateFactor(layer), layer, mapObject);
        if ((!isNullOrUndefined(mapObject.zoomTranslatePoint) || !isNullOrUndefined(mapObject.previousProjection)) &&
             !mapObject.zoomNotApplied) {
            if (mapObject.previousProjection !== mapObject.projectionType) {
                x = -point.x + leftPosition;
                y = -point.y + topPosition;
            } else {
                if (mapObject.isZoomByPosition) {
                    mapObject.zoomTranslatePoint.x = -point.x + leftPosition;
                    mapObject.zoomTranslatePoint.y = -point.y + topPosition;
                }
                x = mapObject.zoomTranslatePoint.x;
                y = mapObject.zoomTranslatePoint.y;
                zoomFactorValue = zoomFactor;
            }
        } else {
            x = -point.x + leftPosition + mapObject.mapAreaRect.x / zoomFactor;
            y = -point.y + topPosition + mapObject.mapAreaRect.y / zoomFactor;
        }
        if (!isNullOrUndefined(mapObject.translatePoint)) {
            y = (mapObject.enablePersistence && mapObject.translatePoint.y !== 0 && !mapObject.zoomNotApplied) ?
                mapObject.translatePoint.y : y;
            x = (mapObject.enablePersistence && mapObject.translatePoint.x !== 0 && !mapObject.zoomNotApplied) ?
                mapObject.translatePoint.x : x;
        }
        scaleFactor = zoomFactorValue !== 0 ? zoomFactorValue : 1;
    } else {
        let zoomFact: number = mapObject.zoomSettings.zoomFactor === 0 ? 1 : mapObject.zoomSettings.zoomFactor;
        const maxZoomFact: number = mapObject.zoomSettings.maxZoom;
        zoomFact = zoomFact > maxZoomFact ? maxZoomFact : zoomFact;
        scaleFactor = zoomFact;
        const mapScale: number = mapObject.mapScaleValue === 0 ? 1 : mapObject.mapScaleValue > maxZoomFact
            ? maxZoomFact : mapObject.mapScaleValue;
        let leftPosition: number = (size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2))));
        let topPosition: number = (size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2))));
        if (!isNullOrUndefined(mapObject.zoomTranslatePoint) || !isNullOrUndefined(mapObject.previousProjection)) {
            if (mapObject.previousProjection !== mapObject.projectionType) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const previousPositions: any[] = [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let previousPoints: any = { x: leftPosition, y: topPosition };
                previousPositions.push(previousPoints);
                for (let i: number = 1; i < maxZoomFact; i++) {
                    const translatePointX: number = previousPositions[i - 1]['x'] - (((size.width / (i)) - (size.width / (i + 1))) / 2);
                    const translatePointY: number = previousPositions[i - 1]['y'] - (((size.height / (i)) - (size.height / (i + 1))) / 2);
                    previousPoints = { x: translatePointX, y: translatePointY };
                    previousPositions.push(previousPoints);
                }
                leftPosition = previousPositions[zoomFact - 1]['x'];
                topPosition = previousPositions[zoomFact - 1]['y'];
            } else {
                leftPosition = mapObject.zoomTranslatePoint.x;
                topPosition = mapObject.zoomTranslatePoint.y;
                if (zoomFact !== mapScale) {
                    scaleFactor = mapScale;
                }
            }
        }
        if (!isNullOrUndefined(mapObject.translatePoint)) {
            x = (mapObject.enablePersistence && mapObject.translatePoint.x !== 0 && !mapObject.zoomNotApplied) ?
                mapObject.translatePoint.x : leftPosition;
            y = (mapObject.enablePersistence && mapObject.translatePoint.y !== 0 && !mapObject.zoomNotApplied) ?
                mapObject.translatePoint.y : topPosition;
        }
    }
    scaleFactor = (mapObject.enablePersistence) ? (mapObject.mapScaleValue === 0 ? 1 : mapObject.mapScaleValue) : scaleFactor;
    mapObject.widthBeforeRefresh = mapObject.availableSize.width;
    mapObject.heightBeforeRefresh = mapObject.availableSize.height;
    return { scale: animate ? 1 : scaleFactor, location: new Point(x, y) };
}

/**
 * To get the html element by specified id
 *
 * @param {Maps} map - Specifies the instance of the maps
 * @returns {void}
 */
export function fixInitialScaleForTile(map: Maps): void {
    map.tileZoomScale = map.tileZoomLevel = Math.floor(map.availableSize.height / 512) + 1;
    const padding: number = map.layers[map.baseLayerIndex].layerType !== 'GoogleStaticMap' ?
        20 : 0;
    const totalSize: number = Math.pow(2, map.tileZoomLevel) * 256;
    map.tileTranslatePoint.x = (map.availableSize.width / 2) - (totalSize / 2);
    map.tileTranslatePoint.y = (map.availableSize.height / 2) - (totalSize / 2) + padding;
    map.previousTileWidth = map.availableSize.width;
    map.previousTileHeight = map.availableSize.height;
}

/**
 * To get the html element by specified id
 *
 * @param {string} id - Specifies the id
 * @returns {Element} - Returns the element
 */
export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
/**
 * Function to get clientElement from id.
 *
 * @param {string} id - Specifies the id
 * @returns {Element} - Returns the element
 * @private
 */
export function getClientElement(id: string): ClientRect {
    const element: HTMLElement = document.getElementById(id);
    if (!isNullOrUndefined(element)) {
        return element.getClientRects()[0];
    } else {
        return null;
    }
}
/**
 * To apply internalization
 *
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {number} value - Specifies the value
 * @returns {string} - Returns the string
 */
export function Internalize(maps: Maps, value: number): string {
    maps.formatFunction =
        maps.intl.getNumberFormat({ format: maps.format, useGrouping: maps.useGroupingSeparator });
    return maps.formatFunction(value);
}

/**
 * Function to compile the template function for maps.
 *
 * @param {string} template - Specifies the template
 * @param {Maps} maps - Specifies the Maps instance.
 * @returns {Function} - Returns the function
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTemplateFunction(template: string, maps: Maps): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let templateFn: any = null;
    try {
        if (document.querySelectorAll(template).length) {
            templateFn = templateComplier(document.querySelector(template).innerHTML.trim());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((maps as any).isVue || (maps as any).isVue3) {
            templateFn = templateComplier(template);
        }
    } catch (e) {
        templateFn = templateComplier(template);
    }
    return templateFn;
}
/**
 * Function to get element from id.
 *
 * @param {string} id - Specifies the id
 * @returns {Element} - Returns the element
 * @private
 */
export function getElement(id: string): Element {
    return document.getElementById(id);
}

/**
 * Function to get shape data using target id
 *
 * @param {string} targetId - Specifies the target id
 * @param {Maps} map - Specifies the instance of the maps
 * @returns {any} - Returns the object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getShapeData(targetId: string, map: Maps): { shapeData: any, data: any } {
    const layerIndex: number = parseInt(targetId.split('_LayerIndex_')[1].split('_')[0], 10);
    const shapeIndex: number = parseInt(targetId.split('_shapeIndex_')[1].split('_')[0], 10);
    const layer: LayerSettings = map.layersCollection[layerIndex as number] as LayerSettings;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shapeData: any = layer.layerData[shapeIndex as number]['property'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any;
    if (layer.dataSource) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data = layer.dataSource[checkShapeDataFields(<any[]>layer.dataSource, shapeData, layer.shapeDataPath, layer.shapePropertyPath,
                                                     layer)];
    }
    return { shapeData: shapeData, data: data };
}
/**
 * Function to trigger shapeSelected event
 *
 * @param {string} targetId - Specifies the target id
 * @param {SelectionSettingsModel} selection - Specifies the selection
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {string} eventName - Specifies the event name
 * @returns {IShapeSelectedEventArgs} - Returns the event args
 * @private
 */
export function triggerShapeEvent(
    targetId: string, selection: SelectionSettingsModel, maps: Maps, eventName: string
): IShapeSelectedEventArgs {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shape: { shapeData: any, data: any } = getShapeData(targetId, maps);
    const border: BorderModel = {
        color: selection.border.color, opacity: selection.border.opacity,
        width: selection.border.width
    };
    const eventArgs: IShapeSelectedEventArgs = (selection.enableMultiSelect) ? {
        cancel: false,
        name: eventName,
        fill: selection.fill,
        opacity: selection.opacity,
        border: border,
        shapeData: shape.shapeData,
        data: shape.data,
        target: targetId,
        maps: maps,
        shapeDataCollection: maps.shapeSelectionItem
    } : {
        cancel: false,
        name: eventName,
        fill: selection.fill,
        opacity: selection.opacity,
        border: border,
        shapeData: shape.shapeData,
        data: shape.data,
        target: targetId,
        maps: maps
    };
    maps.trigger(eventName, eventArgs, () => {
        eventArgs.border.opacity = isNullOrUndefined(eventArgs.border.opacity) ? eventArgs.opacity : eventArgs.border.opacity;
    });
    return eventArgs;
}

/**
 * Function to get elements using class name
 *
 * @param {string} className - Specifies the class name
 * @returns {HTMLCollectionOf<Element>} - Returns the collection
 */
export function getElementsByClassName(className: string): HTMLCollectionOf<Element> {
    return document.getElementsByClassName(className);
}
/**
 * Function to get elements using querySelectorAll
 */
// export function querySelectorAll(args: string, element: Element): ArrayOf<Element> {
//     return element.querySelectorAll('.' + args);
// }
/**
 * Function to get elements using querySelector
 *
 * @param {string} args - Specifies the args
 * @param {string} elementSelector - Specifies the element selector
 * @returns {Element} - Returns the element
 */
export function querySelector(args: string, elementSelector: string): Element {
    let targetEle: Element = null;
    if (document.getElementById(elementSelector)) {
        targetEle = document.getElementById(elementSelector).querySelector('#' + args);
    }
    return targetEle;
}
/**
 * Function to get the element for selection and highlight using public method
 *
 * @param {number} layerIndex - Specifies the layer index
 * @param {string} name - Specifies the layer name
 * @param {boolean} enable - Specifies the boolean value
 * @param {Maps} map - Specifies the instance of the maps
 * @returns {Element} - Returns the element
 */
export function getTargetElement(layerIndex: number, name: string, enable: boolean, map: Maps): Element {
    let targetId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shapeData: any[] = <any[]>map.layers[layerIndex as number].shapeData['features'];
    for (let i: number = 0; i < shapeData.length; i++) {
        if (shapeData[i as number]['properties'].name === name) {
            targetId = map.element.id + '_' + 'LayerIndex_' + layerIndex + '_shapeIndex_' + i + '_dataIndex_undefined';
            break;
        }
    }
    const targetEle: Element = getElement(targetId);
    return targetEle;
}
/**
 * Function to create style element for highlight and selection
 *
 * @param {string} id - Specifies the id
 * @param {string} className - Specifies the class name
 * @param {IShapeSelectedEventArgs | any} eventArgs - Specifies the event args
 * @returns {Element} - Returns the element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createStyle(id: string, className: string, eventArgs: IShapeSelectedEventArgs | any): Element {
    return createElement('style', {
        id: id, innerHTML: '.' + className + '{fill:'
            + eventArgs['fill'] + ';' + 'fill-opacity:' + (eventArgs['opacity']).toString() + ';' +
            'stroke-opacity:' + (eventArgs['border']['opacity']).toString() + ';' +
            'stroke-width:' + (eventArgs['border']['width']).toString() + ';' +
            'stroke:' + eventArgs['border']['color'] + ';' + '}'
    });
}
/**
 * Function to customize the style for highlight and selection
 *
 * @param {string} id - Specifies the id
 * @param {string} className - Specifies the class name
 * @param {IShapeSelectedEventArgs | any} eventArgs - Specifies the event args
 * @returns {void}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function customizeStyle(id: string, className: string, eventArgs: IShapeSelectedEventArgs | any): void {
    const styleEle: Element = getElement(id);
    if (!isNullOrUndefined(styleEle)) {
        styleEle.innerHTML = '.' + className + '{fill:'
            + eventArgs['fill'] + ';' + 'fill-opacity:' + (eventArgs['opacity']).toString() + ';' +
            'stroke-width:' + (eventArgs['border']['width']).toString() + ';' +
            'stroke-opacity:' + (eventArgs['border']['opacity']).toString() + ';' +
            'stroke:' + eventArgs['border']['color'] + '}';
    }
}

/**
 * Function to trigger itemSelection event for legend selection and public method
 *
 * @param {SelectionSettingsModel} selectionSettings - Specifies the selection settings
 * @param {Maps} map - Specifies the instance of the maps
 * @param {Element} targetElement - Specifies the target element
 * @param {any} shapeData - Specifies the shape data
 * @param {any} data - Specifies the data
 * @returns {void}
 */
export function triggerItemSelectionEvent(selectionSettings: SelectionSettingsModel, map: Maps, targetElement: Element,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                          shapeData: any, data: any): void {
    const border: BorderModel = {
        color: selectionSettings.border.color,
        width: selectionSettings.border.width / map.scale,
        opacity: selectionSettings.border.opacity
    };
    const eventArgs: ISelectionEventArgs = {
        opacity: selectionSettings.opacity,
        fill: selectionSettings.fill,
        border: border,
        name: itemSelection,
        target: targetElement.id,
        cancel: false,
        shapeData: shapeData,
        data: data,
        maps: map
    };
    map.trigger('itemSelection', eventArgs, (observedArgs: ISelectionEventArgs) => {
        eventArgs.border.opacity = isNullOrUndefined(selectionSettings.border.opacity) ? selectionSettings.opacity :
            selectionSettings.border.opacity;
        map.shapeSelectionItem.push(eventArgs.shapeData);
        if (!getElement('ShapeselectionMap')) {
            document.body.appendChild(createStyle('ShapeselectionMap',
                                                  'ShapeselectionMapStyle', eventArgs));
        } else {
            customizeStyle('ShapeselectionMap', 'ShapeselectionMapStyle', eventArgs);
        }
    });
}

/**
 * Function to remove class from element
 *
 * @param {Element} element - Specifies the element
 * @returns {void}
 */
export function removeClass(element: Element): void {
    element.removeAttribute('class');
}
/**
 * Animation Effect Calculation End
 *
 * @param {Element} element - Specifies the element
 * @param {number} delay - Specifies the delay
 * @param {number} duration - Specifies the duration
 * @param {MapLocation} point - Specifies the location
 * @param {Maps} maps - Specifies the instance of the maps
 * @param {string} ele - Specifies the element
 * @param {number} radius - Specifies the radius
 * @returns {void}
 * @private
 */
export function elementAnimate(
    element: Element, delay: number, duration: number, point: MapLocation, maps: Maps,
    ele?: string, radius: number = 0
): void {
    const centerX: number = point.x;
    const centerY: number = point.y;
    let height: number = 0;
    const transform: string = element.getAttribute('transform') || '';
    new Animation({}).animate(<HTMLElement>element, {
        duration: duration,
        delay: delay,
        progress: (args: AnimationOptions): void => {
            if (args.timeStamp > args.delay) {
                if (maps.isTileMap && height === 0) {
                    const layerGroupElement: HTMLElement = document.querySelector('.GroupElement') as HTMLElement;
                    if (!isNullOrUndefined(layerGroupElement)) {
                        layerGroupElement.style.display = 'block';
                    }
                }
                height = ((args.timeStamp - args.delay) / args.duration);
                element.setAttribute('transform', 'translate( ' + (centerX - (radius * height)) + ' ' + (centerY - (radius * height)) +
                    ' ) scale(' + height + ')');
            }
        },
        end: (model: AnimationOptions) => {

            element.setAttribute('transform', transform);
            if (!ele) {
                return;
            }
            const event: IAnimationCompleteEventArgs = {
                cancel: false, name: animationComplete, element: ele, maps: maps
            };
            maps.trigger(animationComplete, event);
        }
    });
}

/**
 * @param {string} id - Specifies the id
 * @returns {void}
 */
export function timeout(id: string): void {
    removeElement(id);
}

/**
 * @param {string} text - Specifies the text
 * @param {string} size - Specifies the size
 * @param {number} x - Specifies the x value
 * @param {number} y - Specifies the y value
 * @param {number} areaWidth - Specifies the area width
 * @param {number} areaHeight - Specifies the area height
 * @param {string} id - Specifies the id
 * @param {Element} element - Specifies the element
 * @param {boolean} isTouch - Specifies the boolean value
 * @returns {void}
 */
export function showTooltip(
    text: string, size: string, x: number, y: number, areaWidth: number, areaHeight: number, id: string, element: Element,
    isTouch?: boolean
): void {
    const location: MapLocation = getMousePosition(x, y, element);
    if (!isNullOrUndefined(location)) {
        x = location.x;
        y = location.y;
    }
    let tooltip: HTMLElement = document.getElementById(id);
    let width: number = measureText(text, {
        fontFamily: 'Segoe UI', size: '8px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    }).width;
    const str: string[] = text.split(' ');
    let demo: number = str[0].length;
    for (let i: number = 1; i < str.length; i++) {
        if (demo < str[i as number].length) {
            demo = (str[i as number]).length;
        }
    }
    if (!tooltip) {
        tooltip = createElement('div', {
            id: id
        });
        tooltip.style.cssText = 'background-color: rgb(255, 255, 255) !important; color:black !important; ' +
                                'position:absolute;border:1px solid rgb(0, 0, 0); padding-left:5px;' +
                                'font-size:12px; font-family: "Segoe UI"; text-align:center';
    }
    if (x < (areaWidth - width)) {
        // eslint-disable-next-line no-self-assign
        x = x;
    } else if (x > (areaWidth - width) && x < areaWidth - (demo * 8)) {
        width = (areaWidth - x);
    } else if (x >= areaWidth - demo * 8) {
        if (x > width) {
            x = x - width;
        } else {
            width = x;
            x = 0;
        }
    }
    const size1: string[] = size.split('px');
    wordWrap(tooltip, text, x, y, size1, width, areaWidth, element);
    const height: number = tooltip.clientHeight;
    if ((height + parseInt(size1[0], 10) * 2) > areaHeight) {
        width = x;
        x = 0;
    }
    wordWrap(tooltip, text, x, y, size1, width, areaWidth, element);
    if (isTouch) {
        setTimeout(timeout, 5000, id);
    }
}

/**
 * @param {HTMLElement} tooltip - Specifies the tooltip element
 * @param {string} text - Specifies the text
 * @param {number} x - Specifies the x value
 * @param {number} y - Specifies the y value
 * @param {string[]} size1 - Specifies the size
 * @param {number} width - Specifies the width
 * @param {number} areaWidth - Specifies the area width
 * @param {Element} element - Specifies the element
 * @returns {void}
 */
export function wordWrap(
    tooltip: HTMLElement, text: string, x: number, y: number, size1: string[], width: number,
    areaWidth: number, element: Element
): void {
    tooltip.innerHTML = text;
    tooltip.style.top = tooltip.id.indexOf('_Legend') !== -1 ?
        (parseInt(size1[0], 10) + y).toString() + 'px' : (parseInt(size1[0], 10) * 2).toString() + 'px';
    tooltip.style.left = (x).toString() + 'px';
    tooltip.style.width = width.toString() + 'px';
    tooltip.style.maxWidth = (areaWidth).toString() + 'px';
    tooltip.style.wordWrap = 'break-word';
    element.appendChild(tooltip);
}
// /**
//  *
//  * @param touchList
//  * @param e
//  * @param touches
//  */
// export function addTouchPointer(touchList: ITouches[], e: PointerEvent, touches: TouchList): ITouches[] {
//     if (touches) {
//         touchList = [];
//         for (let i: number = 0, length: number = touches.length; i < length; i++) {
//             touchList.push({ pageX: touches[i as number].clientX, pageY: touches[i as number].clientY, pointerId: null });
//         }
//     } else {
//         touchList = touchList ? touchList : [];
//         if (touchList.length === 0) {
//             touchList.push({ pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId });
//         } else {
//             for (let i: number = 0, length: number = touchList.length; i < length; i++) {
//                 if (touchList[i as number].pointerId === e.pointerId) {
//                     touchList[i as number] = { pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId };
//                 } else {
//                     touchList.push({ pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId });
//                 }
//             }
//         }
//     }
//     return touchList;
// }

/**
 * @param {string} id - Specifies the id
 * @param {string} text - Specifies the text
 * @param {string} top - Specifies the top
 * @param {string} left - Specifies the left
 * @param {string} fontSize - Specifies the fontSize
 * @returns {void}
 * @private
 */
export function createTooltip(id: string, text: string, top: number, left: number, fontSize: string): void {
    let tooltip: HTMLElement = getElement(id) as HTMLElement;
    const style: string = 'top:' + top.toString() + 'px;' +
        'left:' + left.toString() + 'px;' +
        'color: #000000; ' +
        'background:' + '#FFFFFF' + ';' +
        'z-index: 2;' +
        'position:absolute;border:1px solid #707070;font-size:' + fontSize + ';border-radius:2px;';
    if (!tooltip) {
        tooltip = createElement('div', {
            id: id, innerHTML: '&nbsp;' + text + '&nbsp;'
        });
        tooltip.style.cssText = style;
        document.body.appendChild(tooltip);
    } else {
        tooltip.innerHTML = '&nbsp;' + text + '&nbsp;';
        tooltip.style.cssText = style;
    }
}

/**
 * @param {Point} location - Specifies the location
 * @param {string} shape - Specifies the shape
 * @param {Size} size - Specifies the size
 * @param {string} url - Specifies the url
 * @param {PathOption} options - Specifies the options
 * @returns {Element} - Returns the element
 * @private
 */
export function drawSymbol(location: Point, shape: string, size: Size, url: string, options: PathOption): Element {
    const renderer: SvgRenderer = new SvgRenderer('');
    const temp: IShapes = renderLegendShape(location, size, shape, options, url);
    const htmlObject: Element = renderer['draw' + temp.functionName](temp.renderOption);
    return htmlObject;
}


/**
 * @param {MapLocation} location - Specifies the location
 * @param {Size} size - Specifies the size
 * @param {string} shape - Specifies the shape
 * @param {PathOption} options - Specifies the path options
 * @param {string} url - Specifies the url
 * @returns {IShapes} - Returns the shapes
 * @private
 */
export function renderLegendShape(location: MapLocation, size: Size, shape: string, options: PathOption, url: string): IShapes {
    let renderPath: string;
    let functionName: string = 'Path';
    const shapeWidth: number = size.width;
    const shapeHeight: number = size.height;
    const shapeX: number = location.x;
    const shapeY: number = location.y;
    const x: number = location.x + (-shapeWidth / 2);
    const y: number = location.y + (-shapeHeight / 2);
    options['stroke'] = (shape === 'HorizontalLine' || shape === 'VerticalLine' || shape === 'Cross') ? options['fill'] : options['stroke'];
    options['stroke-width'] = (options['stroke-width'] === 0 && (shape === 'HorizontalLine' || shape === 'VerticalLine' || shape === 'Cross')) ? 1 : options['stroke-width'];
    switch (shape) {
    case 'Circle':
    case 'Bubble':
        functionName = 'Ellipse';
        merge(options, { 'rx': shapeWidth / 2, 'ry': shapeHeight / 2, 'cx': shapeX, 'cy': shapeY });
        break;
    case 'VerticalLine':
        renderPath = 'M' + ' ' + shapeX + ' ' + (shapeY + (shapeHeight / 2)) + ' ' + 'L' + ' ' + shapeX + ' '
            + (shapeY + (-shapeHeight / 2));
        merge(options, { 'd': renderPath });
        break;
    case 'HorizontalLine':
        renderPath = 'M' + ' ' + shapeX + ' ' + shapeY + ' ' + 'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' '
            + shapeY;
        merge(options, { 'd': renderPath });
        break;
    case 'Diamond':
        renderPath = 'M' + ' ' + x + ' ' + shapeY + ' ' +
            'L' + ' ' + shapeX + ' ' + (shapeY + (-shapeHeight / 2)) + ' ' +
            'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + shapeY + ' ' +
            'L' + ' ' + shapeX + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
            'L' + ' ' + x + ' ' + shapeY + ' z';
        merge(options, { 'd': renderPath });
        break;
    case 'Rectangle':
        renderPath = 'M' + ' ' + x + ' ' + (shapeY + (-shapeHeight / 2)) + ' ' +
            'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY + (-shapeHeight / 2)) + ' ' +
            'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
            'L' + ' ' + x + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
            'L' + ' ' + x + ' ' + (shapeY + (-shapeHeight / 2)) + ' z';
        merge(options, { 'd': renderPath });
        break;
    case 'Triangle':
        renderPath = 'M' + ' ' + x + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
            'L' + ' ' + shapeX + ' ' + (shapeY + (-shapeHeight / 2)) + ' ' +
            'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
            'L' + ' ' + x + ' ' + (shapeY + (shapeHeight / 2)) + ' z';
        merge(options, { 'd': renderPath });
        break;
    case 'InvertedTriangle':
        renderPath = 'M' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY - (shapeHeight / 2)) + ' ' +
            'L' + ' ' + shapeX + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
            'L' + ' ' + (shapeX - (shapeWidth / 2)) + ' ' + (shapeY - (shapeHeight / 2)) + ' ' +
            'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY - (shapeHeight / 2)) + ' z';
        merge(options, { 'd': renderPath });
        break;
    case 'Pentagon':
        // eslint-disable-next-line no-case-declarations
        const eq: number = 72; let xValue: number; let yValue: number;
        for (let i: number = 0; i <= 5; i++) {
            xValue = (shapeWidth / 2) * Math.cos((Math.PI / 180) * (i * eq));
            yValue = (shapeWidth / 2) * Math.sin((Math.PI / 180) * (i * eq));
            if (i === 0) {
                renderPath = 'M' + ' ' + (shapeX + xValue) + ' ' + (shapeY + yValue) + ' ';
            } else {
                renderPath = renderPath.concat('L' + ' ' + (shapeX + xValue) + ' ' + (shapeY + yValue) + ' ');
            }
        }
        renderPath = renderPath.concat('Z');
        merge(options, { 'd': renderPath });
        break;
    case 'Star':
        renderPath = 'M ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + (location.x - size.width / 2)
            + ' ' + (location.y + size.height / 6) + ' L ' + (location.x + size.width / 2) + ' ' + (location.y + size.height / 6)
            + ' L ' + (location.x - size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' +
            (location.y + size.height / 2) + ' L ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' Z';
        merge(options, { 'd': renderPath });
        break;
    case 'Cross':
        renderPath = 'M' + ' ' + x + ' ' + shapeY + ' ' + 'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + shapeY + ' ' +
            'M' + ' ' + shapeX + ' ' + (shapeY + (shapeHeight / 2)) + ' ' + 'L' + ' ' + shapeX + ' ' +
            (shapeY + (-shapeHeight / 2));
        merge(options, { 'd': renderPath });
        break;
    case 'Image':
        functionName = 'Image';
        merge(options, { 'href': url, 'height': shapeHeight, 'width': shapeWidth, x: x, y: y });
        break;
    }
    return { renderOption: options, functionName: functionName };
}
/**
 * Animation Effect Calculation End
 *
 * @private
 */

// export function markerTemplateAnimate(element: Element, delay: number, duration: number, point: MapLocation): void {
//     let delta: number = 0;
//     let top: string = (element as HTMLElement).style.top;
//     let y: number = parseInt(top, 10);
//     new Animation({}).animate(<HTMLElement>element, {
//         duration: duration,
//         delay: delay,
//         progress: (args: AnimationOptions): void => {
//             if (args.timeStamp > args.delay) {
//                 delta = ((args.timeStamp - args.delay) / args.duration);
//                 (element as HTMLElement).style.top = y - 100 + (delta * 100) + 'px';
//             }
//         },
//         end: (model: AnimationOptions) => {
//             (element as HTMLElement).style.top = top;
//         }
//     });
// }

/**
 * @param {HTMLElement} childElement - Specifies the child element
 * @param {HTMLElement} parentElement - Specifies the parent element
 * @returns {Size} - Returns the size
 * @private
 */
export function getElementOffset(childElement: HTMLElement, parentElement: HTMLElement): Size {
    parentElement.appendChild(childElement);
    const width: number = childElement.offsetWidth;
    const height: number = childElement.offsetHeight;
    parentElement.removeChild(childElement);
    return new Size(width, height);
}

/**
 * @param {Element} element - Specifies the element
 * @param {number} index - Specifies the element
 * @param {number} scale - Specifies the scale
 * @param {Maps} maps - Specifies the instance of the maps
 * @returns {void}
 * @private
 */
export function changeBorderWidth(element: Element, index: number, scale: number, maps: Maps): void {
    let childNode: HTMLElement;
    for (let l: number = 0; l < element.childElementCount; l++) {
        childNode = element.childNodes[l as number] as HTMLElement;
        if (childNode.id.indexOf('_NavigationGroup') > -1) {
            changeNavaigationLineWidth(childNode, index, scale, maps);
        } else {
            let currentStroke: number;
            let value: number = 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const borderWidthValue: string = maps.layersCollection[index as number].shapeSettings.borderWidthValuePath;
            const borderWidth: number = (<LayerSettingsModel>maps.layersCollection[index as number]).shapeSettings.border.width;
            const circleRadius: number = (<LayerSettingsModel>maps.layersCollection[index as number]).shapeSettings.circleRadius;
            if (maps.layersCollection[index as number].shapeSettings.borderWidthValuePath) {
                value = checkShapeDataFields(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <any[]>maps.layersCollection[index as number].dataSource, maps.layersCollection[index as number].layerData[l as number]['property'],
                    maps.layersCollection[index as number].shapeDataPath, maps.layersCollection[index as number].shapePropertyPath, maps.layersCollection[index as number]
                );
                if (value !== null) {
                    if (maps.layersCollection[index as number].dataSource[value as number][borderWidthValue as string]) {
                        currentStroke = maps.layersCollection[index as number].dataSource[value as number][borderWidthValue as string];
                    } else {
                        currentStroke = (isNullOrUndefined(borderWidth) ? 0 : borderWidth);
                    }
                } else {
                    currentStroke = (isNullOrUndefined(borderWidth) ? 0 : borderWidth);
                }
            } else {
                currentStroke = (isNullOrUndefined(borderWidth) ? 0 : borderWidth);
            }
            childNode.setAttribute('stroke-width', (currentStroke / scale).toString());
            if (element.id.indexOf('_Point') > -1 || element.id.indexOf('_MultiPoint') > -1) {
                childNode.setAttribute('r', (circleRadius / scale).toString());
            }
        }
    }
}

/**
 * @param {Element} element - Specifies the element
 * @param {number} index - Specifies the element
 * @param {number} scale - Specifies the scale
 * @param {Maps} maps - Specifies the instance of the maps
 * @returns {void}
 * @private
 */
export function changeNavaigationLineWidth(element: Element, index: number, scale: number, maps: Maps): void {
    let node: HTMLElement;
    for (let m: number = 0; m < element.childElementCount; m++) {
        node = element.childNodes[m as number] as HTMLElement;
        if (node.tagName === 'path') {
            const currentStroke: number = ((<LayerSettingsModel>maps.layersCollection[index as number])
                .navigationLineSettings[parseFloat(node.id.split('_NavigationIndex_')[1].split('_')[0])].width);
            node.setAttribute('stroke-width', (currentStroke / scale).toString());
        }
    }
}

// /** Pinch zoom helper methods */

/**
 * @param {PointerEvent | TouchEvent} event - Specifies the pointer or touch event
 * @returns {ITouches[]} - Returns the target
 * @private */
export function targetTouches(event: PointerEvent | TouchEvent): ITouches[] {
    const targetTouches: ITouches[] = [];
    const touches: TouchList = (<TouchEvent & PointerEvent>event).touches;
    for (let i: number = 0; i < touches.length; i++) {
        targetTouches.push({ pageX: touches[i as number].pageX, pageY: touches[i as number].pageY });
    }
    return targetTouches;
}

/**
 * @param {ITouches[]} startTouches - Specifies the start touches
 * @param {ITouches[]} endTouches - Specifies the end touches
 * @returns {number} - Returns the number
 * @private
 */
export function calculateScale(startTouches: ITouches[], endTouches: ITouches[]): number {
    const startDistance: number = getDistance(startTouches[0], startTouches[1]);
    const endDistance: number = getDistance(endTouches[0], endTouches[1]);
    return (endDistance / startDistance);
}

/**
 * @param {ITouches} a - Specifies the a value
 * @param {ITouches} b - Specifies the b value
 * @returns {number} - Returns the number
 * @private */
export function getDistance(a: ITouches, b: ITouches): number {
    const x: number = a.pageX - b.pageX;
    const y: number = a.pageY - b.pageY;
    return Math.sqrt(x * x + y * y);
}

/**
 * @param {ITouches[]} touches - Specifies the touches
 * @param {Maps} maps - Specifies the instance of the maps
 * @returns {any[]} - Returns the object
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTouches(touches: ITouches[], maps: Maps): any[] {
    const rect: ClientRect = maps.element.getBoundingClientRect();
    const posTop: number = rect.top + document.defaultView.pageXOffset;
    const posLeft: number = rect.left + document.defaultView.pageYOffset;
    return Array.prototype.slice.call(touches).map((touch: ITouches) => {
        return {
            x: touch.pageX - posLeft,
            y: touch.pageY - posTop
        };
    });
}

/**
 * @param {any[]} touches - Specifies the touches
 * @returns {Point} - Returns the point
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTouchCenter(touches: any[]): Point {
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        x: touches.map((e: any) => { return e['x']; }).reduce(sum) / touches.length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        y: touches.map((e: any) => { return e['y']; }).reduce(sum) / touches.length
    };
}

/**
 * @param {number} a - Specifies a value
 * @param {number} b - Specifies b value
 * @returns {number} - Returns the sum of a and b
 * @private
 */
export function sum(a: number, b: number): number {
    return a + b;
}

/**
 * Animation Effect Calculation End
 *
 * @param {Element} element - Specifies the element.
 * @param {number} delay - Specifies the delay.
 * @param {number} duration - Specifies the duration.
 * @param {MapLocation} point - Specifies the location.
 * @param {number} scale - Specifies the scale value.
 * @param {Size} size - Specifies the size.
 * @param {Maps} maps - Specifies the maps.
 * @returns {void}
 * @private
 */
export function zoomAnimate(
    element: Element, delay: number, duration: number, point: MapLocation, scale: number, size: Size,
    maps: Maps
): void {
    let delta: number = 0;
    const previousLocation: MapLocation = maps.previousPoint;
    const preScale: number = maps.previousScale;
    const diffScale: number = scale - preScale;
    const currentLocation: MapLocation = new MapLocation(0, 0);
    let currentScale: number = 1;
    if (scale === preScale) {
        element.setAttribute('transform', 'scale( ' + (scale) + ' ) translate( ' + point.x + ' ' + point.y + ' )');
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const slope: any = (previousLocation: MapLocation, point: MapLocation): number => {
        if (previousLocation.x === point.x) {
            return null;
        }
        return (point.y - previousLocation.y) / (point.x - previousLocation.x);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const intercept: any = (point: MapLocation, slopeValue: number): number => {
        if (slopeValue === null) {
            return point.x;
        }
        return point.y - slopeValue * point.x;
    };
    const slopeFactor: number = slope(previousLocation, point);
    const slopeIntersection: number = intercept(previousLocation, slopeFactor);
    const horizontalDifference: number = point.x - previousLocation.x;
    const verticalDifference: number = point.y - previousLocation.y;
    animate(
        <HTMLElement>element, delay, duration,
        (args: AnimationOptions): void => {
            if (args.timeStamp > args.delay) {
                delta = ((args.timeStamp - args.delay) / args.duration);
                currentScale = preScale + (delta * diffScale);
                currentLocation.x = previousLocation.x + (delta * horizontalDifference) / (currentScale / scale);
                if (slopeFactor == null) {
                    currentLocation.y = previousLocation.y + (delta * verticalDifference);
                } else {
                    currentLocation.y = ((slopeFactor * currentLocation.x) + slopeIntersection);
                }
                args.element.setAttribute('transform', 'scale( ' + currentScale + ' ) ' +
                    'translate( ' + currentLocation.x + ' ' + currentLocation.y + ' )');
                maps.translatePoint = currentLocation;
                maps.scale = currentScale;
                maps.zoomModule.processTemplate(point.x, point.y, currentScale, maps);
            }
        },
        () => {
            maps.translatePoint = point;
            maps.scale = scale;
            element.setAttribute('transform', 'scale( ' + (scale) + ' ) translate( ' + point.x + ' ' + point.y + ' )');
            maps.zoomModule.processTemplate(point.x, point.y, scale, maps);
        }
    );
}
/**
 * To process custom animation
 *
 * @param {Element} element - Specifies the element
 * @param {number} delay - Specifies the delay
 * @param {number} duration - Specifies the duration
 * @param {Function} process - Specifies the process
 * @param {Function} end - Specifies the end
 * @returns {void}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function animate(element: Element, delay: number, duration: number, process: any, end: any): void {
    let start: number = null;
    // eslint-disable-next-line prefer-const
    let clearAnimation: number;
    const markerStyle: string = 'visibility:visible';
    const startAnimation: FrameRequestCallback = (timestamp: number) => {
        if (!start) { start = timestamp; }
        const progress: number = timestamp - start;
        if (progress < duration) {
            process.call(this, { element: element, delay: 0, timeStamp: progress, duration: duration });
            window.requestAnimationFrame(startAnimation);
        } else {
            window.cancelAnimationFrame(clearAnimation);
            end.call(this, { element: element });
            if (element.id.indexOf('Marker') > -1) {
                const markerElement: Element = getElementByID(element.id.split('_Layer')[0] + '_Markers_Group');
                (markerElement as HTMLElement).style.cssText = markerStyle;
            }
        }
    };
    clearAnimation = window.requestAnimationFrame(startAnimation);
}
/**
 * To get shape data file using Ajax.
 */
export class MapAjax {
    /**
     * MapAjax data options
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public dataOptions: string | any;
    /**
     * MapAjax type value
     */
    public type: string;
    /**
     * MapAjax async value
     */
    public async: boolean;
    /**
     * MapAjax contentType value
     */
    public contentType: string;
    /**
     * MapAjax sendData value
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public sendData: string | any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(options: string | any, type?: string, async?: boolean, contentType?: string, sendData?: string | any) {
        this.dataOptions = options;
        this.type = type || 'GET';
        this.async = async || true;
        this.contentType = contentType;
        this.sendData = sendData;
    }
}

/**
 * Animation Translate
 *
 * @param {Element} element - Specifies the element
 * @param {number} delay - Specifies the delay
 * @param {number} duration - Specifies the duration
 * @param {MapLocation} point - Specifies the location
 * @returns {void}
 * @private
 */
export function smoothTranslate(element: Element, delay: number, duration: number, point: MapLocation): void {
    let delta: number = 0;
    const transform: string[] = element.getAttribute('transform').split(' ');
    if (transform.length === 2) { transform[2] = transform[1].split(')')[0]; transform[1] = transform[0].split('(')[1]; }
    const previousLocation: MapLocation = new MapLocation(parseInt(transform[1], 10), parseInt(transform[2], 10));
    const diffx: number = point.x - previousLocation.x;
    const diffy: number = point.y - previousLocation.y;
    const currentLocation: MapLocation = new MapLocation(0, 0);
    animate(
        <HTMLElement>element, delay, duration, (args: AnimationOptions): void => {
            if (args.timeStamp > args.delay) {
                delta = ((args.timeStamp - args.delay) / args.duration);
                currentLocation.x = previousLocation.x + (delta * diffx);
                currentLocation.y = previousLocation.y + (delta * diffy);
                args.element.setAttribute('transform', 'translate( ' + currentLocation.x + ' ' + currentLocation.y + ' )');
            }
        },
        () => {
            element.setAttribute('transform', 'translate( ' + point.x + ' ' + point.y + ' )');
        }
    );
}
/**
 * To find compare should zoom factor with previous factor and current factor
 *
 * @param {number} scaleFactor - Specifies the scale factor
 * @param {Maps} maps - Specifies the instance of the maps
 * @returns {void}
 */
export function compareZoomFactor(scaleFactor: number, maps: Maps): void {
    const previous: number = isNullOrUndefined(maps.shouldZoomPreviousFactor) ?
        null : maps.shouldZoomPreviousFactor;
    const current: number = isNullOrUndefined(maps.shouldZoomCurrentFactor) ?
        null : maps.shouldZoomCurrentFactor;
    if (!isNullOrUndefined(current)) {
        maps.shouldZoomCurrentFactor = null;
        maps.shouldZoomPreviousFactor = null;
    } else if (!isNullOrUndefined(previous)
        && isNullOrUndefined(current)
        && maps.shouldZoomPreviousFactor !== scaleFactor) {
        maps.shouldZoomCurrentFactor = scaleFactor;
    } else {
        maps.shouldZoomPreviousFactor = scaleFactor;
    }
}
/**
 * To find zoom level for the min and max latitude values
 *
 * @param {number} minLat - Specifies the minimum latitude
 * @param {number} maxLat - Specifies the maximum latitude
 * @param {number} minLong - Specifies the minimum longitude
 * @param {number} maxLong - Specifies the maximum longitude
 * @param {number} mapWidth - Specifies the width of the maps
 * @param {number} mapHeight - Specifies the height of the maps
 * @param {Maps} maps - Specifies the instance of the maps
 * @returns {number} - Returns the scale factor
 */
export function calculateZoomLevel(minLat: number, maxLat: number, minLong: number, maxLong: number,
                                   mapWidth: number, mapHeight: number, maps: Maps, isZoomToCoordinates: boolean): number {
    let scaleFactor: number;
    const maxZoomFact: number = maps.zoomSettings.maxZoom;
    let applyMethodeZoom: number;
    const maxLatSin: number = Math.sin(maxLat * Math.PI / 180);
    const maxLatRad: number = Math.log((1 + maxLatSin) / (1 - maxLatSin)) / 2;
    const maxLatValue: number = Math.max(Math.min(maxLatRad, Math.PI), -Math.PI) / 2;
    const minLatSin: number = Math.sin(minLat * Math.PI / 180);
    const minLatRad: number = Math.log((1 + minLatSin) / (1 - minLatSin)) / 2;
    const minLatValue: number = Math.max(Math.min(minLatRad, Math.PI), -Math.PI) / 2;

    if (maps.zoomNotApplied && !maps.isTileMap) {
        const latiRatio: number = Math.abs((maps.baseMapBounds.latitude.max - maps.baseMapBounds.latitude.min) / (maxLat - minLat));
        const longiRatio: number = Math.abs((maps.baseMapBounds.longitude.max - maps.baseMapBounds.longitude.min) / (maxLong - minLong));
        applyMethodeZoom = isZoomToCoordinates ? (latiRatio + longiRatio) / 2 : Math.min(latiRatio, longiRatio);
    }

    const latRatio: number = (maxLatValue - minLatValue) / Math.PI;
    const lngDiff: number = maxLong - minLong;
    const lngRatio: number = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;
    const WORLD_PX_HEIGHT: number = 256;
    const WORLD_PX_WIDTH: number = 256;
    const latZoom: number = (Math.log(mapHeight / WORLD_PX_HEIGHT / latRatio) / Math.LN2);
    const lngZoom: number = (Math.log(mapWidth / WORLD_PX_WIDTH / lngRatio) / Math.LN2);
    const result: number = (maps.zoomNotApplied && !maps.isTileMap) ? applyMethodeZoom :
        isZoomToCoordinates && !maps.isTileMap ? (latZoom + lngZoom) / 2 : Math.min(latZoom, lngZoom);
    scaleFactor = Math.min(result, maxZoomFact);
    scaleFactor = maps.isTileMap || !maps.zoomNotApplied ? Math.floor(scaleFactor) : scaleFactor;
    if (!maps.isTileMap) {
        compareZoomFactor(scaleFactor, maps);
    }
    return scaleFactor;
}

/**
 * Method to get the result
 *
 * @param {any} e - Specifies the any type value
 * @returns {any} - Returns the data value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function processResult(e: any): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dataValue: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultValue: any = !isNullOrUndefined(e['result']) ? e['result'] : e['actual'];
    if (isNullOrUndefined(resultValue.length)) {
        if (!isNullOrUndefined(resultValue['Items'])) {
            dataValue = resultValue['Items'];
        }
    }
    else {
        dataValue = resultValue;
    }
    return dataValue;
}
