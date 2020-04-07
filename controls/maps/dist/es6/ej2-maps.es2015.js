import { Ajax, Animation, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, L10n, NotifyPropertyChanges, Property, compile, createElement, extend, isBlazor, isNullOrUndefined, merge, print, remove, resetBlazorTemplate, setValue, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { SvgRenderer, Tooltip } from '@syncfusion/ej2-svg-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { PdfBitmap, PdfDocument, PdfPageOrientation } from '@syncfusion/ej2-pdf-export';

var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
/**
 * Helper functions for maps control
 */
/**
 * Maps internal use of `Size` type
 */
class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}
/**
 * To find number from string
 * @private
 */
function stringToNumber(value, containerSize) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/**
 * Method to calculate the width and height of the maps
 */
function calculateSize(maps) {
    let containerWidth = maps.element.clientWidth;
    let containerHeight = maps.element.clientHeight;
    let parentHeight = maps.element.parentElement.clientHeight;
    let parentWidth = maps.element.parentElement.clientWidth;
    let containerElementWidth = stringToNumber(maps.element.style.width, containerWidth);
    let containerElementHeight = stringToNumber(maps.element.style.height, containerWidth);
    maps.availableSize = new Size(stringToNumber(maps.width, containerWidth) || containerWidth || containerElementWidth || 600, stringToNumber(maps.height, containerHeight) || containerHeight || containerElementHeight || (maps.isDevice ?
        Math.min(window.innerWidth, window.innerHeight) : 450));
}
/**
 * Method to create svg for maps.
 */
function createSvg(maps) {
    maps.renderer = new SvgRenderer(maps.element.id);
    calculateSize(maps);
    maps.svgObject = maps.renderer.createSvg({
        id: maps.element.id + '_svg',
        width: maps.availableSize.width,
        height: maps.availableSize.height
    });
}
function getMousePosition(pageX, pageY, element) {
    let elementRect = element.getBoundingClientRect();
    let pageXOffset = element.ownerDocument.defaultView.pageXOffset;
    let pageYOffset = element.ownerDocument.defaultView.pageYOffset;
    let clientTop = element.ownerDocument.documentElement.clientTop;
    let clientLeft = element.ownerDocument.documentElement.clientLeft;
    let positionX = elementRect.left + pageXOffset - clientLeft;
    let positionY = elementRect.top + pageYOffset - clientTop;
    return new MapLocation((pageX - positionX), (pageY - positionY));
}
/**
 * Method to convert degrees to radians
 */
function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}
/**
 * Convert radians to degrees method
 */
function radiansToDegrees(radian) {
    return radian * (180 / Math.PI);
}
/**
 * Method for converting from latitude and longitude values to points
 */
function convertGeoToPoint(latitude, longitude, factor, layer, mapModel) {
    let mapSize = new Size(mapModel.mapAreaRect.width, mapModel.mapAreaRect.height);
    let x;
    let y;
    let value;
    let lat;
    let lng;
    let temp;
    let longitudeMinMax = mapModel.baseMapBounds.longitude;
    let latitudeMinMax = mapModel.baseMapBounds.latitude;
    let latRadian = degreesToRadians(latitude);
    let lngRadian = degreesToRadians(longitude);
    let type = mapModel.projectionType;
    let size = (mapModel.isTileMap) ? Math.pow(2, 1) * 256 : (isNullOrUndefined(factor)) ? Math.min(mapSize.width, mapSize.height) :
        (Math.min(mapSize.width, mapSize.height) * factor);
    if (layer.geometryType === 'Normal') {
        x = isNullOrUndefined(factor) ? longitude : Math.abs((longitude - longitudeMinMax.min) * factor);
        y = isNullOrUndefined(factor) ? latitude : Math.abs((latitudeMinMax.max - latitude) * factor);
    }
    else if (layer.geometryType === 'Geographic') {
        switch (type) {
            case 'Mercator':
                let pixelOrigin = new Point(size / 2, size / 2);
                x = pixelOrigin.x + longitude * (size / 360);
                let sinY = calculateBound(Math.sin(degreesToRadians(latitude)), -0.9999, 0.9999);
                y = pixelOrigin.y + 0.5 * (Math.log((1 + sinY) / (1 - sinY))) * (-(size / (2 * Math.PI)));
                break;
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
            case 'Eckert6':
                let epsilon = 1e-6;
                temp = (1 + (Math.PI / 2)) * Math.sin(latRadian);
                let delta = Infinity;
                for (let i = 0; i < 10 && Math.abs(delta) > epsilon; i++) {
                    delta = (latRadian + (Math.sin(latRadian)) - temp) / (1 + Math.cos(latRadian));
                    latRadian = latRadian - delta;
                }
                temp = Math.sqrt(2 + Math.PI);
                lng = lngRadian * (1 + Math.cos(latRadian)) / temp;
                lat = 2 * latRadian / temp;
                break;
        }
        x = (type === 'Mercator') ? x : roundTo(xToCoordinate(mapModel, radiansToDegrees(lng)), 3);
        y = (type === 'Mercator') ? y : (-(roundTo(yToCoordinate(mapModel, radiansToDegrees(lat)), 3)));
    }
    return new Point(x, y);
}
/**
 * Converting tile latitude and longitude to point
 */
function convertTileLatLongToPoint(center, zoomLevel, tileTranslatePoint, isMapCoordinates) {
    let size = Math.pow(2, zoomLevel) * 256;
    let x = (center.x + 180) / 360;
    let sinLatitude = Math.sin(center.y * Math.PI / 180);
    let y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
    let pixelX = center.x;
    let pixelY = center.y;
    if (isMapCoordinates) {
        pixelX = (x * size + 0.5) + tileTranslatePoint.x;
        pixelY = (y * size + 0.5) + tileTranslatePoint.y;
    }
    return { x: pixelX, y: pixelY };
}
/**
 * Method for calculate x point
 */
function xToCoordinate(mapObject, val) {
    let longitudeMinMax = mapObject.baseMapBounds.longitude;
    let totalSize = isNullOrUndefined(mapObject.baseSize) ? mapObject.mapAreaRect.width : mapObject.mapAreaRect.width +
        (Math.abs(mapObject.baseSize.width - mapObject.mapAreaRect.width) / 2);
    return Math.round(totalSize * (val - longitudeMinMax.min) / (longitudeMinMax.max - longitudeMinMax.min) * 100) / 100;
}
/**
 * Method for calculate y point
 */
function yToCoordinate(mapObject, val) {
    let latitudeMinMax = mapObject.baseMapBounds.latitude;
    return Math.round(mapObject.mapAreaRect.height * (val - latitudeMinMax.min) / (latitudeMinMax.max - latitudeMinMax.min) * 100) / 100;
}
/**
 * Method for calculate aitoff projection
 */
function aitoff(x, y) {
    let cosy = Math.cos(y);
    let sincia = sinci(acos(cosy * Math.cos(x /= 2)));
    return new Point(2 * cosy * Math.sin(x) * sincia, Math.sin(y) * sincia);
}
/**
 * Method to round the number
 */
function roundTo(a, b) {
    let c = Math.pow(10, b);
    return (Math.round(a * c) / c);
}
function sinci(x) {
    return x / Math.sin(x);
}
function acos(a) {
    return Math.acos(a);
}
/**
 * Method to calculate bound
 */
function calculateBound(value, min, max) {
    if (!isNullOrUndefined(min)) {
        value = Math.max(value, min);
    }
    if (!(isNullOrUndefined(max))) {
        value = Math.min(value, max);
    }
    return value;
}
/**
 * Map internal class for point
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
/**
 * Map internal class for min and max
 *
 */
class MinMax {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
}
/**
 * Map internal class locations
 */
class GeoLocation {
    constructor(latitude, longitude) {
        this.latitude = new MinMax(latitude.min, latitude.max);
        this.longitude = new MinMax(longitude.min, longitude.max);
    }
}
/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {FontModel} font
 * @param  {string} id
 * @returns no
 * @private
 */
function measureText(text, font) {
    let measureObject = document.getElementById('mapsmeasuretext');
    if (measureObject === null) {
        measureObject = createElement('text', { id: 'mapsmeasuretext' });
        document.body.appendChild(measureObject);
    }
    measureObject.innerHTML = text;
    measureObject.style.position = 'absolute';
    measureObject.style.fontSize = font.size;
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
 * @private
 */
class TextOption {
    constructor(id, x, y, anchor, text, transform = '', baseLine) {
        this.transform = '';
        this.baseLine = 'auto';
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
 * @private
 */
class PathOption {
    constructor(id, fill, width, color, opacity, dashArray, d) {
        this.id = id;
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
    }
}
/** @private */
class ColorValue {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}
/**
 * Internal use of rectangle options
 * @private
 */
class RectOption extends PathOption {
    constructor(id, fill, border, opacity, rect, rx, ry, transform, dashArray) {
        super(id, fill, border.width, border.color, opacity, dashArray);
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height;
        this.width = rect.width;
        this.rx = rx ? rx : 0;
        this.ry = ry ? ry : 0;
        this.transform = transform ? transform : '';
        this['stroke-dasharray'] = dashArray;
    }
}
/**
 * Internal use of circle options
 * @private
 */
class CircleOption extends PathOption {
    constructor(id, fill, border, opacity, cx, cy, r, dashArray) {
        super(id, fill, border.width, border.color, opacity);
        this.cy = cy;
        this.cx = cx;
        this.r = r;
        this['stroke-dasharray'] = dashArray;
    }
}
/**
 * Internal use of polygon options
 * @private
 */
class PolygonOption extends PathOption {
    constructor(id, points, fill, width, color, opacity = 1, dashArray = '') {
        super(id, fill, width, color, opacity, dashArray);
        this.points = points;
    }
}
/**
 * Internal use of polyline options
 * @private
 */
class PolylineOption extends PolygonOption {
    constructor(id, points, fill, width, color, opacity = 1, dashArray = '') {
        super(id, points, fill, width, color, opacity, dashArray);
    }
}
/**
 * Internal use of line options
 * @private
 */
class LineOption extends PathOption {
    constructor(id, line, fill, width, color, opacity = 1, dashArray = '') {
        super(id, fill, width, color, opacity, dashArray);
        this.x1 = line.x1;
        this.y1 = line.y1;
        this.x2 = line.x2;
        this.y2 = line.y2;
    }
}
/**
 * Internal use of line
 * @property
 */
class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}
/**
 * Internal use of map location type
 */
class MapLocation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
/**
 * Internal use of type rect
 * @private
 */
class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
/**
 * Internal use for pattern creation.
 * @property
 */
class PatternOptions {
    constructor(id, x, y, width, height, patternUnits = 'userSpaceOnUse', patternContentUnits = 'userSpaceOnUse', patternTransform = '', href = '') {
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
 * @private
 */
function renderTextElement(option, style, color, parent, isMinus = false) {
    let renderOptions = {
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
    let text = typeof option.text === 'string' ? option.text : isMinus ? option.text[option.text.length - 1] : option.text[0];
    let tspanElement;
    let renderer = new SvgRenderer('');
    let height;
    let htmlObject = renderer.createText(renderOptions, text);
    htmlObject.style['user-select'] = 'none';
    htmlObject.style['-moz-user-select'] = 'none';
    htmlObject.style['-webkit-touch-callout'] = 'none';
    htmlObject.style['-webkit-user-select'] = 'none';
    htmlObject.style['-khtml-user-select'] = 'none';
    htmlObject.style['-ms-user-select'] = 'none';
    htmlObject.style['-o-user-select'] = 'none';
    if (typeof option.text !== 'string' && option.text.length > 1) {
        for (let i = 1, len = option.text.length; i < len; i++) {
            height = (measureText(option.text[i], style).height);
            tspanElement = renderer.createTSpan({
                'x': option.x, 'id': option.id,
                'y': (option.y) + ((isMinus) ? -(i * height) : (i * height))
            }, isMinus ? option.text[option.text.length - (i + 1)] : option.text[i]);
            htmlObject.appendChild(tspanElement);
        }
    }
    parent.appendChild(htmlObject);
    return htmlObject;
}
/**
 * @private
 */
function convertElement(element, markerId, data, index, mapObj) {
    let childElement = createElement('div', {
        id: markerId,
        styles: 'position: absolute;pointer-events: auto;'
    });
    let elementLength = element.length;
    while (elementLength > 0) {
        childElement.appendChild(element[0]);
        elementLength--;
    }
    let templateHtml = childElement.innerHTML;
    let properties = Object.keys(data);
    for (let i = 0; i < properties.length; i++) {
        if (typeof data[properties[i]] === 'object') {
            templateHtml = convertStringToValue(templateHtml, '', data, mapObj);
        }
        else if (properties[i].toLowerCase() !== 'latitude' && properties[i].toLowerCase() !== 'longitude') {
            templateHtml = templateHtml.replace(new RegExp('{{:' + properties[i] + '}}', 'g'), data[properties[i].toString()]);
        }
    }
    childElement.innerHTML = templateHtml;
    return childElement;
}
function formatValue(value, maps) {
    let formatValue;
    let formatFunction;
    if (maps.format && !isNaN(Number(value))) {
        formatFunction = maps.intl.getNumberFormat({ format: maps.format, useGrouping: maps.useGroupingSeparator });
        formatValue = formatFunction(Number(value));
    }
    else {
        formatValue = value;
    }
    return formatValue;
}
function convertStringToValue(stringTemplate, format, data, maps) {
    let templateHtml = (stringTemplate === '') ? format : stringTemplate;
    let templateValue = (stringTemplate === '') ? templateHtml.split('${') : templateHtml.split('{{:');
    for (let i = 0; i < templateValue.length; i++) {
        if ((templateValue[i].indexOf('}}') > -1 && templateValue[i].indexOf('.') > -1) ||
            (templateValue[i].indexOf('}') > -1 && templateValue[i].search('.') > -1)) {
            let split = (stringTemplate === '') ? templateValue[i].split('}') : templateValue[i].split('}}');
            for (let j = 0; j < split.length; j++) {
                if (split[j].indexOf('.') > -1) {
                    let templateSplitValue = (getValueFromObject(data, split[j])).toString();
                    templateHtml = (stringTemplate === '') ?
                        templateHtml.split('${' + split[j] + '}').join(formatValue(templateSplitValue, maps)) :
                        templateHtml.replace(new RegExp('{{:' + split[j] + '}}', 'g'), templateSplitValue);
                }
            }
        }
    }
    return templateHtml;
}
function convertElementFromLabel(element, labelId, data, index, mapObj) {
    let labelEle = isNullOrUndefined(element.childElementCount) ? element[0] : element;
    let templateHtml = labelEle.outerHTML;
    let properties = Object.keys(data);
    for (let i = 0; i < properties.length; i++) {
        templateHtml = templateHtml.replace(new RegExp('{{:' + properties[i] + '}}', 'g'), data[properties[i].toString()]);
    }
    return createElement('div', {
        id: labelId,
        innerHTML: templateHtml,
        styles: 'position: absolute'
    });
}
/* tslint:disable:no-string-literal */
//tslint:disable
function drawSymbols(shape, imageUrl, location, markerID, shapeCustom, markerCollection, maps) {
    let markerEle;
    let x;
    let y;
    let size = shapeCustom['size'];
    let borderColor = shapeCustom['borderColor'];
    let borderWidth = parseFloat(shapeCustom['borderWidth']);
    let fill = shapeCustom['fill'];
    let dashArray = shapeCustom['dashArray'];
    let border = { color: borderColor, width: borderWidth };
    let opacity = shapeCustom['opacity'];
    let circleOptions;
    let pathOptions;
    let rectOptions;
    pathOptions = new PathOption(markerID, fill, borderWidth, borderColor, opacity, dashArray, '');
    if (shape === 'Circle') {
        let radius = (size.width + size.height) / 4;
        circleOptions = new CircleOption(markerID, fill, border, opacity, location.x, location.y, radius, dashArray);
        markerEle = maps.renderer.drawCircle(circleOptions);
    }
    else if (shape === 'Rectangle') {
        x = location.x - (size.width / 2);
        y = location.y - (size.height / 2);
        rectOptions = new RectOption(markerID, fill, border, opacity, new Rect(x, y, size.width, size.height), null, null, '', dashArray);
        markerEle = maps.renderer.drawRectangle(rectOptions);
    }
    else if (shape === 'Image') {
        x = location.x - (size.width / 2);
        y = location.y - size.height;
        merge(pathOptions, { 'href': imageUrl, 'height': size.height, 'width': size.width, x: x, y: y });
        markerEle = maps.renderer.drawImage(pathOptions);
    }
    else {
        markerEle = calculateShapes(maps, shape, pathOptions, size, location, markerCollection);
    }
    return markerEle;
}
function getValueFromObject(data, value) {
    if (!isNullOrUndefined(data) && !isNullOrUndefined(value)) {
        var splits = value.replace(/\[/g, '.').replace(/\]/g, '').split('.');
        if (splits.length === 1) {
            data = data[splits[0]];
        }
        else {
            for (var i = 0; i < splits.length && !isNullOrUndefined(data); i++) {
                data = data[splits[i]];
            }
        }
    }
    return data;
}
function markerColorChoose(eventArgs, data) {
    let color = (!isNullOrUndefined(eventArgs.colorValuePath)) ? ((eventArgs.colorValuePath.indexOf('.') > -1) ? (getValueFromObject(data, eventArgs.colorValuePath)).toString() :
        data[eventArgs.colorValuePath]) : data[eventArgs.colorValuePath];
    eventArgs.fill = (!isNullOrUndefined(eventArgs.colorValuePath) &&
        !isNullOrUndefined(color)) ?
        ((eventArgs.colorValuePath.indexOf('.') > -1) ? (getValueFromObject(data, eventArgs.colorValuePath)).toString() :
            data[eventArgs.colorValuePath]) : eventArgs.fill;
    return eventArgs;
}
function markerShapeChoose(eventArgs, data) {
    if (!isNullOrUndefined(eventArgs.shapeValuePath) && !isNullOrUndefined(data[eventArgs.shapeValuePath])) {
        let shape = ((eventArgs.shapeValuePath.indexOf('.') > -1) ?
            (getValueFromObject(data, eventArgs.shapeValuePath).toString()) :
            data[eventArgs.shapeValuePath]);
        eventArgs.shape = shape;
        if (data[eventArgs.shapeValuePath] == 'Image') {
            eventArgs.imageUrl = (!isNullOrUndefined(eventArgs.imageUrlValuePath) &&
                !isNullOrUndefined(data[eventArgs.imageUrlValuePath])) ?
                ((eventArgs.imageUrlValuePath.indexOf('.') > -1) ? getValueFromObject(data, eventArgs.imageUrlValuePath).toString() : data[eventArgs.imageUrlValuePath]) : eventArgs.imageUrl;
        }
    }
    else {
        let shapes = (!isNullOrUndefined(eventArgs.shapeValuePath)) ? ((eventArgs.shapeValuePath.indexOf('.') > -1) ? getValueFromObject(data, eventArgs.shapeValuePath).toString() : eventArgs.shape) : eventArgs.shape;
        eventArgs.shape = shapes;
        let shapeImage = (!isNullOrUndefined(eventArgs.imageUrlValuePath)) ? ((eventArgs.imageUrlValuePath.indexOf('.') > -1) ? (getValueFromObject(data, eventArgs.imageUrlValuePath)).toString() : eventArgs.imageUrl) : eventArgs.imageUrl;
        eventArgs.imageUrl = shapeImage;
    }
    return eventArgs;
}
//tslint:disable
function clusterTemplate(currentLayer, markerTemplate, maps, layerIndex, markerCollection, layerElement, check, zoomCheck) {
    let bounds1;
    let bounds2;
    let colloideBounds = [];
    let clusterColloideBounds = [];
    let tempX = 0;
    let tempY = 0;
    let data;
    let style = currentLayer.markerClusterSettings.labelStyle;
    let options;
    let textElement;
    let tempElement1;
    let shapeCustom;
    let tempElement;
    let postionY = (15 / 4);
    let m = 0;
    let indexCollection = [];
    let clusters = currentLayer.markerClusterSettings;
    let clusterGroup = maps.renderer.createGroup({ id: maps.element.id + '_LayerIndex_' + layerIndex + '_markerCluster' });
    let eventArg = {
        cancel: false, name: markerClusterRendering, fill: clusters.fill, height: clusters.height,
        width: clusters.width, imageUrl: clusters.imageUrl, shape: clusters.shape,
        data: data, maps: maps, cluster: clusters, border: clusters.border
    };
    if (isBlazor()) {
        const { data, maps, cluster } = eventArg, blazorEventArgs = __rest(eventArg, ["data", "maps", "cluster"]);
        eventArg = blazorEventArgs;
    }
    maps.trigger('markerClusterRendering', eventArg, (clusterargs) => {
        for (let o = 0; o < markerTemplate.childElementCount; o++) {
            indexCollection = [];
            if (markerTemplate.childNodes[o]['style']['visibility'] !== 'hidden') {
                tempElement = markerTemplate.childNodes[o];
                bounds1 = tempElement.getBoundingClientRect();
                if (!isNullOrUndefined(bounds1)) {
                    for (let p = o + 1; p < markerTemplate.childElementCount; p++) {
                        if (markerTemplate.childNodes[p]['style']['visibility'] !== 'hidden') {
                            tempElement = markerTemplate.childNodes[p];
                            bounds2 = tempElement.getBoundingClientRect();
                            if (!isNullOrUndefined(bounds2)) {
                                if (bounds1.left > bounds2.right || bounds1.right < bounds2.left
                                    || bounds1.top > bounds2.bottom || bounds1.bottom < bounds2.top) {
                                }
                                else {
                                    colloideBounds.push(bounds2);
                                    markerTemplate.childNodes[p]['style']['visibility'] = "hidden";
                                    indexCollection.push(p);
                                }
                            }
                        }
                    }
                    tempX = bounds1.left + bounds1.width / 2;
                    tempY = bounds1.top + bounds1.height;
                    indexCollection.push(o);
                    if (colloideBounds.length > 0) {
                        indexCollection = indexCollection.filter((item, index, value) => value.indexOf(item) === index);
                        let container = maps.element.getBoundingClientRect();
                        tempX = tempX - container['left'];
                        tempY = tempY - container['top'];
                        let translate = (maps.isTileMap) ? new Object() : getTranslate(maps, currentLayer, false);
                        let transPoint = (maps.isTileMap) ? { x: 0, y: 0 } : (maps.translatePoint.x !== 0) ?
                            maps.translatePoint : translate['location'];
                        let dataIndex = parseInt(markerTemplate.childNodes[o]['id'].split('_dataIndex_')[1].split('_')[0], 10);
                        let markerIndex = parseInt(markerTemplate.childNodes[o]['id'].split('_MarkerIndex_')[1].split('_')[0], 10);
                        markerTemplate.childNodes[o]['style']['visibility'] = "hidden";
                        let clusters = currentLayer.markerClusterSettings;
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
                        }
                        else {
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
                        }
                        tempX = (maps.isTileMap) ? tempX : (markerTemplate.id.indexOf('_Markers_Group') > -1) ? tempX : ((tempX + transPoint.x) * maps.mapScaleValue);
                        tempY = (maps.isTileMap) ? tempY : (markerTemplate.id.indexOf('_Markers_Group') > -1) ? tempY : ((tempY + transPoint.y) * maps.mapScaleValue);
                        let clusterID = maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_dataIndex_' + dataIndex + '_cluster_' + (m);
                        let labelID = maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_dataIndex_' + dataIndex + '_cluster_' + (m) + '_datalabel_' + m;
                        m++;
                        let imageShapeY = shapeCustom['shape'] === 'Image' ? shapeCustom['size']['height'] / 2 : 0;
                        let ele = drawSymbols(shapeCustom['shape'], shapeCustom['imageUrl'], { x: 0, y: imageShapeY }, clusterID, shapeCustom, markerCollection, maps);
                        ele.setAttribute('transform', 'translate( ' + tempX + ' ' + tempY + ' )');
                        if (eventArg.shape === 'Balloon') {
                            ele.children[0].innerHTML = indexCollection.toString();
                        }
                        else {
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
        maps.svgObject.appendChild(layerElement);
        maps.element.appendChild(maps.svgObject);
        for (var o = 0; o < clusterGroup.childElementCount; o++) {
            if (clusterGroup.childNodes[o]['style']['visibility'] !== 'hidden') {
                tempElement = clusterGroup.childNodes[o];
                bounds1 = tempElement.getBoundingClientRect();
                if (!isNullOrUndefined(bounds1) && !(tempElement.id.indexOf('_datalabel_') > -1)) {
                    for (var p = o + 1; p < clusterGroup.childElementCount; p++) {
                        if (clusterGroup.childNodes[p]['style']['visibility'] !== 'hidden') {
                            tempElement1 = clusterGroup.childNodes[p];
                            bounds2 = tempElement1.getBoundingClientRect();
                            if (!isNullOrUndefined(bounds2) && !(tempElement1.id.indexOf('_datalabel_') > -1)) {
                                if (bounds1.left > bounds2.right || bounds1.right < bounds2.left
                                    || bounds1.top > bounds2.bottom || bounds1.bottom < bounds2.top) {
                                }
                                else {
                                    clusterColloideBounds.push(tempElement1);
                                    clusterColloideBounds.push(clusterGroup.childNodes[p - 1]);
                                    clusterGroup.childNodes[p]['style']['visibility'] = "hidden";
                                    clusterGroup.childNodes[p - 1]['style']['visibility'] = "hidden";
                                    indexCollection.push(p);
                                }
                            }
                        }
                    }
                    if (clusterColloideBounds.length > 0) {
                        tempElement = clusterGroup.childNodes[o];
                        for (var i = 0; i < clusterColloideBounds.length; i++) {
                            if (tempElement.tagName === 'g') {
                                tempElement.childNodes[0].textContent = tempElement.childNodes[0].textContent + ',' +
                                    clusterColloideBounds[i].textContent;
                            }
                            else {
                                tempElement.textContent = tempElement.textContent + ',' + clusterColloideBounds[i].textContent;
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
        }
        else {
            getElementByID(maps.element.id + '_Secondary_Element').appendChild(markerCollection);
            layerElement.appendChild(markerCollection);
        }
        document.getElementById(maps.element.id + '_LayerIndex_0_markerCluster').remove();
        if (zoomCheck) {
            document.getElementById(maps.element.id + '_Layer_Collections').appendChild(layerElement);
        }
    });
}
function mergeSeparateCluster(sameMarkerData, maps, markerElement) {
    let layerIndex = sameMarkerData[0].layerIndex;
    let clusterIndex = sameMarkerData[0].targetClusterIndex;
    let markerIndex = sameMarkerData[0].markerIndex;
    let markerId = maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex;
    let clusterId = markerId + '_dataIndex_' + sameMarkerData[0].data[0]['index'] + '_cluster_' + clusterIndex;
    let clusterEle = getElement(clusterId);
    let clusterEleLabel = getElement(clusterId + '_datalabel_' + clusterIndex);
    clusterEle.setAttribute('visibility', 'visible');
    clusterEleLabel.setAttribute('visibility', 'visible');
    let markerEle;
    let markerDataLength = sameMarkerData[0].data.length;
    for (let i = 0; i < markerDataLength; i++) {
        markerEle = getElement(markerId + '_dataIndex_' + sameMarkerData[0].data[i]['index']);
        markerEle['style']['visibility'] = "hidden";
    }
    removeElement(maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_markerClusterConnectorLine');
}
function clusterSeparate(sameMarkerData, maps, markerElement, isDom) {
    let layerIndex = sameMarkerData[0].layerIndex;
    let markerIndex = sameMarkerData[0].markerIndex;
    let clusterIndex = sameMarkerData[0].targetClusterIndex;
    let dataIndex = sameMarkerData[0].data[0]['index'];
    let getElementFunction = isDom ? getElement : markerElement.querySelector.bind(markerElement);
    let getQueryConnect = isDom ? '' : '#';
    let markerId = maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex;
    let clusterId = markerId + '_dataIndex_' + dataIndex + '_cluster_' + clusterIndex;
    let clusterEle = getElementFunction(getQueryConnect + '' + clusterId);
    let clusterEleLabel = getElementFunction(getQueryConnect + '' + clusterId + '_datalabel_' + clusterIndex);
    clusterEle.setAttribute('visibility', 'hidden');
    clusterEleLabel.setAttribute('visibility', 'hidden');
    let marker = maps.layers[layerIndex].markerSettings[markerIndex];
    let markerEle = getElementFunction(getQueryConnect + '' + markerId + '_dataIndex_' + dataIndex);
    let height = marker.height;
    let width = marker.width;
    let centerX = +clusterEle.getAttribute('transform').split('translate(')[1].trim().split(' ')[0];
    let centerY = +clusterEle.getAttribute('transform').split('translate(')[1].trim().split(' ')[1].split(')')[0].trim();
    let radius = width + 5;
    let area = 2 * 3.14 * radius;
    let totalMarker = 0;
    let numberOfMarker = Math.round(area / width);
    totalMarker += numberOfMarker;
    let markerDataLength = sameMarkerData[0].data.length;
    let percent = Math.round((height / area) * 100);
    percent = markerDataLength < numberOfMarker ? 100 / markerDataLength : percent;
    let angle = (percent / 100) * 360;
    let newAngle = markerDataLength < numberOfMarker ? 45 : 0;
    let count = 1;
    let start = 'M ' + centerX + ' ' + centerY + ' ';
    let path = '';
    for (let i = 0; i < markerDataLength; i++) {
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
        let x1 = centerX + radius * Math.sin((Math.PI * 2 * newAngle) / 360);
        let y1 = centerY + radius * Math.cos((Math.PI * 2 * newAngle) / 360);
        path += start + 'L ' + (x1) + ' ' + y1 + ' ';
        markerEle = getElementFunction(getQueryConnect + '' + markerId + '_dataIndex_' + sameMarkerData[0].data[i]['index']);
        markerEle.setAttribute('transform', 'translate( ' + x1 + ' ' + y1 + ')');
        markerEle['style']['visibility'] = "visible";
        newAngle += angle;
    }
    let options;
    let connectorLine = maps.layers[layerIndex].markerClusterSettings.connectorLineSettings;
    options = {
        d: path, id: maps.element.id + '_markerClusterConnectorLine', stroke: connectorLine.color,
        opacity: connectorLine.opacity, 'stroke-width': connectorLine.width
    };
    markerElement = isDom ? getElementFunction(maps.element.id + '_Markers_Group') : markerElement;
    let groupEle = maps.renderer.createGroup({ id: maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_markerClusterConnectorLine' });
    groupEle.appendChild(maps.renderer.drawPath(options));
    markerElement.insertBefore(groupEle, markerElement.querySelector('#' + markerId + '_dataIndex_0'));
}
function marker(eventArgs, markerSettings, markerData, dataIndex, location, transPoint, markerID, offset, scale, maps, markerCollection) {
    let shapeCustom = {
        size: new Size(eventArgs.width, eventArgs.height),
        fill: eventArgs.fill, borderColor: eventArgs.border.color,
        borderWidth: eventArgs.border.width, opacity: markerSettings.opacity,
        dashArray: markerSettings.dashArray
    };
    let ele = drawSymbols(eventArgs.shape, eventArgs.imageUrl, { x: 0, y: 0 }, markerID, shapeCustom, markerCollection, maps);
    let x = (maps.isTileMap ? location.x : (location.x + transPoint.x) * scale) + offset.x;
    let y = (maps.isTileMap ? location.y : (location.y + transPoint.y) * scale) + offset.y;
    ele.setAttribute('transform', 'translate( ' + x + ' ' + y + ' )');
    maintainSelection(maps.selectedMarkerElementId, maps.markerSelectionClass, ele, 'MarkerselectionMapStyle');
    markerCollection.appendChild(ele);
    let element = (markerData.length - 1) === dataIndex ? 'marker' : null;
    let markerPoint = new Point(x, y);
    if (markerSettings.animationDuration > 0) {
        elementAnimate(ele, markerSettings.animationDelay, markerSettings.animationDuration, markerPoint, maps, element);
    }
    return markerCollection;
}
function markerTemplate(eventArgs, templateFn, markerID, data, markerIndex, markerTemplate, location, scale, offset, maps) {
    templateFn = getTemplateFunction(eventArgs.template);
    if (templateFn && (!maps.isBlazor ? templateFn(data, null, null, maps.element.id + '_MarkerTemplate' + markerIndex, false).length : {})) {
        let templateElement = templateFn(data, null, null, maps.element.id + '_MarkerTemplate' + markerIndex, false);
        let markerElement = convertElement(templateElement, markerID, data, markerIndex, maps);
        for (let i = 0; i < markerElement.children.length; i++) {
            markerElement.children[i].style.pointerEvents = 'none';
        }
        markerElement.style.left = ((maps.isTileMap ? location.x :
            ((Math.abs(maps.baseMapRectBounds['min']['x'] - location.x)) * scale)) + offset.x) + 'px';
        markerElement.style.top = ((maps.isTileMap ? location.y :
            ((Math.abs(maps.baseMapRectBounds['min']['y'] - location.y)) * scale)) + offset.y) + 'px';
        markerTemplate.appendChild(markerElement);
        if (maps.layers[maps.baseLayerIndex].layerType === 'GoogleStaticMap') {
            let staticMapOffset = getElementByID(maps.element.id + '_StaticGoogleMap').getBoundingClientRect();
            let markerElementOffset = markerElement.getBoundingClientRect();
            let staticMapOffsetWidth = 640;
            if ((staticMapOffset['x'] > markerElementOffset['x'] || staticMapOffset['x'] + staticMapOffsetWidth < markerElementOffset['x'] + markerElementOffset['width'])
                && (staticMapOffset['y'] > markerElementOffset['y'] || staticMapOffset['y'] + staticMapOffset['height'] < markerElementOffset['y'] + markerElementOffset['height'])) {
                markerElement.style.display = 'none';
            }
        }
    }
    return markerTemplate;
}
/**
 * To maintain selection during page resize
 * @private
 */
function maintainSelection(elementId, elementClass, element, className) {
    if (elementId) {
        for (let index = 0; index < elementId.length; index++) {
            if (element.getAttribute('id') === elementId[index]) {
                if (isNullOrUndefined(getElement(elementClass.id)) || index === 0) {
                    document.body.appendChild(elementClass);
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
 * @private
 */
function maintainStyleClass(id, idClass, fill, opacity, borderColor, borderWidth, maps) {
    if (!getElement(id)) {
        let styleClass;
        styleClass = createElement('style', {
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
 * @private
 */
function appendShape(shape, element) {
    if (element) {
        element.appendChild(shape);
    }
    return shape;
}
/**
 * Internal rendering of Circle
 * @private
 */
function drawCircle(maps, options, element) {
    return appendShape(maps.renderer.drawCircle(options), element);
}
/**
 * Internal rendering of Rectangle
 * @private
 */
function drawRectangle(maps, options, element) {
    return appendShape(maps.renderer.drawRectangle(options), element);
}
/**
 * Internal rendering of Path
 * @private
 */
function drawPath(maps, options, element) {
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Polygon
 * @private
 */
function drawPolygon(maps, options, element) {
    return appendShape(maps.renderer.drawPolygon(options), element);
}
/**
 * Internal rendering of Polyline
 * @private
 */
function drawPolyline(maps, options, element) {
    return appendShape(maps.renderer.drawPolyline(options), element);
}
/**
 * Internal rendering of Line
 * @private
 */
function drawLine(maps, options, element) {
    return appendShape(maps.renderer.drawLine(options), element);
}
/**
 * @private
 * Calculate marker shapes
 */
function calculateShapes(maps, shape, options, size, location, markerEle) {
    let tempGroup;
    switch (shape) {
        case 'Balloon':
            tempGroup = drawBalloon(maps, options, size, location, markerEle);
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
            let eq = 72;
            let xValue;
            let yValue;
            for (let i = 0; i < 5; i++) {
                xValue = (size.width / 2) * Math.cos((Math.PI / 180) * (i * eq));
                yValue = (size.height / 2) * Math.sin((Math.PI / 180) * (i * eq));
                options.d += (i == 0 ? 'M ' : 'L ') + (location.x + xValue) + ' ' + (location.y + yValue);
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
 * @private
 */
function drawDiamond(maps, options, size, location, element) {
    options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + (location.x + size.width / 2) + ' ' + location.y +
        ' L ' + location.x + ' ' + (location.y + size.height / 2) + ' L ' + (location.x - size.width / 2) + ' ' + location.y + ' Z';
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Triangle
 * @private
 */
function drawTriangle(maps, options, size, location, element) {
    options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + (location.x + size.width / 2) + ' ' +
        (location.y + size.height / 2) + ' L ' + (location.x - size.width / 2) + ' ' + (location.y + size.height / 2) + ' Z';
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Cross
 * @private
 */
function drawCross(maps, options, size, location, element) {
    options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' + (location.y + size.height / 2) +
        ' M ' + (location.x - size.width / 2) + ' ' + location.y + ' L ' + (location.x + size.width / 2) + ' ' + location.y;
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of HorizontalLine
 * @private
 */
function drawHorizontalLine(maps, options, size, location, element) {
    options.d = ' M ' + (location.x - size.width / 2) + ' ' + location.y + ' L ' + (location.x + size.width / 2) + ' ' + location.y;
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of VerticalLine
 * @private
 */
function drawVerticalLine(maps, options, size, location, element) {
    options.d = 'M ' + location.x + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' + (location.y + size.height / 2);
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Star
 * @private
 */
function drawStar(maps, options, size, location, element) {
    options.d = 'M ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + (location.x - size.width / 2)
        + ' ' + (location.y + size.height / 6) + ' L ' + (location.x + size.width / 2) + ' ' + (location.y + size.height / 6) + ' L '
        + (location.x - size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' + (location.y + size.height / 2)
        + ' L ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' Z';
    return appendShape(maps.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Balloon
 * @private
 */
function drawBalloon(maps, options, size, location, element) {
    let width = size.width;
    let height = size.height;
    location.x -= width / 2;
    location.y -= height;
    options.d = 'M15,0C8.8,0,3.8,5,3.8,11.2C3.8,17.5,9.4,24.4,15,30c5.6-5.6,11.2-12.5,11.2-18.8C26.2,5,21.2,0,15,0z M15,16' +
        'c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S17.8,16,15,16z';
    let balloon = maps.renderer.drawPath(options);
    let x = size.width / 30;
    let y = size.height / 30;
    balloon.setAttribute('transform', 'translate(' + location.x + ', ' + location.y + ') scale(' + x + ', ' + y + ')');
    let g = maps.renderer.createGroup({ id: options.id });
    appendShape(balloon, g);
    return appendShape(g, element);
}
/**
 * Internal rendering of Pattern
 * @private
 */
function drawPattern(maps, options, elements, element) {
    let pattern = maps.renderer.createPattern(options, 'pattern');
    for (let ele of elements) {
        appendShape(ele, pattern);
    }
    return appendShape(pattern, element);
}
/**
 * Method to get specific field and vaues from data.
 * @private
 */
// tslint:disable:no-any
function getFieldData(dataSource, fields) {
    let newData = [];
    let data;
    for (let temp of dataSource) {
        data = {};
        for (let field of fields) {
            if (temp[field]) {
                data[field] = temp[field];
            }
        }
        newData.push(data);
    }
    return newData;
}
/**
 * To find the index of dataSource from shape properties
 */
// tslint:disable:no-string-literal
function checkShapeDataFields(dataSource, properties, dataPath, propertyPath, layer) {
    if (!(isNullOrUndefined(properties))) {
        for (let i = 0; i < dataSource.length; i++) {
            let shapeDataPath = ((dataPath.indexOf('.') > -1) ? getValueFromObject(dataSource[i], dataPath) :
                dataSource[i][dataPath]);
            let shapePath = checkPropertyPath(shapeDataPath, propertyPath, properties);
            let shapeDataPathValue = !isNullOrUndefined(shapeDataPath) && isNaN(properties[shapePath])
                ? shapeDataPath.toLowerCase() : shapeDataPath;
            let propertiesShapePathValue = !isNullOrUndefined(properties[shapePath]) && isNaN(properties[shapePath])
                ? properties[shapePath].toLowerCase() : properties[shapePath];
            if (shapeDataPathValue === propertiesShapePathValue) {
                return i;
            }
        }
    }
    return null;
}
function checkPropertyPath(shapeData, shapePropertyPath, shape) {
    if (!isNullOrUndefined(shapeData) && !isNullOrUndefined(shape)) {
        if (!isNullOrUndefined(shapePropertyPath)) {
            let properties = (Object.prototype.toString.call(shapePropertyPath) === '[object Array]' ?
                shapePropertyPath : [shapePropertyPath]);
            for (let i = 0; i < properties.length; i++) {
                let shapeDataValue = !isNullOrUndefined(shapeData) ? shapeData.toLowerCase() : shapeData;
                let shapePropertiesValue = !isNullOrUndefined(shape[properties[i]])
                    && isNaN(shape[properties[i]])
                    ? shape[properties[i]].toLowerCase() : shape[properties[i]];
                if (shapeDataValue === shapePropertiesValue) {
                    return properties[i];
                }
            }
        }
    }
    return null;
}
function filter(points, start, end) {
    let pointObject = [];
    for (let i = 0; i < points.length; i++) {
        let point = points[i];
        if (start <= point.y && end >= point.y) {
            pointObject.push(point);
        }
    }
    return pointObject;
}
function getRatioOfBubble(min, max, value, minValue, maxValue) {
    let percent = (100 / (maxValue - minValue)) * (value - minValue);
    let bubbleRadius = (((max - min) / 100) * percent) + min;
    if (maxValue === minValue) {
        bubbleRadius = (((max - min) / 100)) + min;
    }
    return bubbleRadius;
}
/**
 * To find the midpoint of the polygon from points
 */
function findMidPointOfPolygon(points, type) {
    if (!points.length) {
        return null;
    }
    let min = 0;
    let max = points.length;
    let startX;
    let startY;
    let startX1;
    let startY1;
    let sum = 0;
    let xSum = 0;
    let ySum = 0;
    for (let i = min; i <= max - 1; i++) {
        startX = points[i].x;
        startY = type === 'Mercator' ? points[i].y : -(points[i].y);
        if (i === max - 1) {
            startX1 = points[0].x;
            startY1 = type === 'Mercator' ? points[0].y : -(points[0].y);
        }
        else {
            startX1 = points[i + 1].x;
            startY1 = type === 'Mercator' ? points[i + 1].y : -(points[i + 1].y);
        }
        sum = sum + Math.abs(((startX * startY1)) - (startX1 * startY));
        xSum = xSum + Math.abs(((startX + startX1) * (((startX * startY1) - (startX1 * startY)))));
        ySum = ySum + Math.abs(((startY + startY1) * (((startX * startY1) - (startX1 * startY)))));
    }
    sum = 0.5 * sum;
    xSum = (1 / (4 * sum)) * xSum;
    ySum = (1 / (4 * sum)) * ySum;
    /* Code for finding nearest points in polygon related to midPoint*/
    let rightMinPoint = { x: 0, y: 0 };
    let rightMaxPoint = { x: 0, y: 0 };
    let leftMinPoint = { x: 0, y: 0 };
    let leftMaxPoint = { x: 0, y: 0 };
    let bottomMinPoint = { x: 0, y: 0 };
    let bottomMaxPoint = { x: 0, y: 0 };
    let topMinPoint = { x: 0, y: 0 };
    let topMaxPoint = { x: 0, y: 0 };
    let height = 0;
    for (let i = min; i <= max - 1; i++) {
        let point = points[i];
        point.y = type === 'Mercator' ? point.y : -(point.y);
        if (point.y > ySum) {
            if (point.x < xSum && xSum - point.x < xSum - bottomMinPoint.x) {
                bottomMinPoint = { x: point.x, y: point.y };
            }
            else if (point.x > xSum && (bottomMaxPoint.x === 0 || point.x - xSum < bottomMaxPoint.x - xSum)) {
                bottomMaxPoint = { x: point.x, y: point.y };
            }
        }
        else {
            if (point.x < xSum && xSum - point.x < xSum - topMinPoint.x) {
                topMinPoint = { x: point.x, y: point.y };
            }
            else if (point.x > xSum && (topMaxPoint.x === 0 || point.x - xSum < topMaxPoint.x - xSum)) {
                topMaxPoint = { x: point.x, y: point.y };
            }
        }
        height = (bottomMaxPoint.y - topMaxPoint.y) + ((bottomMaxPoint.y - topMaxPoint.y) / 4);
        if (point.x > xSum) {
            if (point.y < ySum && ySum - point.y < ySum - rightMinPoint.y) {
                rightMinPoint = { x: point.x, y: point.y };
            }
            else if (point.y > ySum && (rightMaxPoint.y === 0 || point.y - ySum < rightMaxPoint.y - ySum)) {
                rightMaxPoint = { x: point.x, y: point.y };
            }
        }
        else {
            if (point.y < ySum && ySum - point.y < ySum - leftMinPoint.y) {
                leftMinPoint = { x: point.x, y: point.y };
            }
            else if (point.y > ySum && (leftMaxPoint.y === 0 || point.y - ySum < leftMaxPoint.y - ySum)) {
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
 * @private
 * Check custom path
 */
/* tslint:disable:no-string-literal */
function isCustomPath(layerData) {
    let customPath = false;
    if (Object.prototype.toString.call(layerData) === '[object Array]') {
        Array.prototype.forEach.call(layerData, (layer, index) => {
            if (!isNullOrUndefined(layer['geometry']) && layer['geometry']['type'] === 'Path') {
                customPath = true;
            }
        });
    }
    return customPath;
}
/**
 * @private
 * Trim the title text
 */
function textTrim(maxWidth, text, font) {
    let label = text;
    let size = measureText(text, font).width;
    if (size > maxWidth) {
        let textLength = text.length;
        for (let i = textLength - 1; i >= 0; --i) {
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
 */
function findPosition(location, alignment, textSize, type) {
    let x;
    let y;
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
    y = (type === 'title') ? location.y + (textSize.height / 2) : ((location.y + location.height / 2) + textSize.height / 2);
    return new Point(x, y);
}
/**
 * To remove element by id
 */
function removeElement(id) {
    let element = document.getElementById(id);
    return element ? remove(element) : null;
}
/**
 *  To calculate map center position from pixel values
 */
function calculateCenterFromPixel(mapObject, layer) {
    let point1 = convertGeoToPoint(mapObject.minLatOfGivenLocation, mapObject.minLongOfGivenLocation, mapObject.mapLayerPanel.calculateFactor(layer), layer, mapObject);
    let point2 = convertGeoToPoint(mapObject.maxLatOfGivenLocation, mapObject.maxLongOfGivenLocation, mapObject.mapLayerPanel.calculateFactor(layer), layer, mapObject);
    let x = (point1.x + point2.x) / 2;
    let y = (point1.y + point2.y) / 2;
    return new Point(x, y);
}
/**
 * @private
 */
function getTranslate(mapObject, layer, animate) {
    let zoomFactorValue = mapObject.zoomSettings.zoomFactor;
    let scaleFactor;
    let center = mapObject.centerPosition;
    let centerLatitude = center.latitude;
    let centerLongitude = center.longitude;
    let checkMethodeZoom = !isNullOrUndefined(mapObject.centerLatOfGivenLocation) &&
        !isNullOrUndefined(mapObject.centerLongOfGivenLocation) && mapObject.zoomNotApplied;
    if (isNullOrUndefined(mapObject.mapScaleValue)) {
        mapObject.mapScaleValue = zoomFactorValue;
    }
    if (mapObject.zoomSettings.shouldZoomInitially && mapObject.zoomSettings.enable) {
        mapObject.mapScaleValue = scaleFactor = zoomFactorValue = ((mapObject.zoomSettings.shouldZoomInitially || mapObject.enablePersistence) && mapObject.scale == 1)
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
    let min = mapObject.baseMapRectBounds['min'];
    let max = mapObject.baseMapRectBounds['max'];
    let zoomFactor = animate ? 1 : mapObject.mapScaleValue;
    if (isNullOrUndefined(mapObject.currentShapeDataLength)) {
        mapObject.currentShapeDataLength = !isNullOrUndefined(layer.shapeData["features"])
            ? layer.shapeData["features"].length : layer.shapeData["geometries"].length;
    }
    let size = (mapObject.totalRect) ? mapObject.totalRect : mapObject.mapAreaRect;
    let availSize = mapObject.availableSize;
    let x;
    let y;
    let mapWidth = Math.abs(max['x'] - min['x']);
    let mapHeight = Math.abs(min['y'] - max['y']);
    let factor = animate ? 1 : mapObject.markerZoomFactor === 1 ? mapObject.mapScaleValue : zoomFactorValue;
    center = mapObject.zoomSettings.shouldZoomInitially
        && mapObject.markerZoomedState && !mapObject.zoomPersistence ? mapObject.markerZoomCenterPoint :
        mapObject.centerPosition;
    if ((!isNullOrUndefined(centerLongitude) && !isNullOrUndefined(centerLatitude)) || checkMethodeZoom) {
        let leftPosition = (((mapWidth + Math.abs(mapObject.mapAreaRect.width - mapWidth)) / 2) + mapObject.mapAreaRect.x) / factor;
        let topPosition = (((mapHeight + Math.abs(mapObject.mapAreaRect.height - mapHeight)) / 2) + mapObject.mapAreaRect.y) / factor;
        let point = checkMethodeZoom ? calculateCenterFromPixel(mapObject, layer) :
            convertGeoToPoint(centerLatitude, centerLongitude, mapObject.mapLayerPanel.calculateFactor(layer), layer, mapObject);
        if (isNullOrUndefined(mapObject.previousProjection) || mapObject.previousProjection !== mapObject.projectionType) {
            x = -point.x + leftPosition;
            y = -point.y + topPosition;
            scaleFactor = zoomFactor;
        }
        else {
            if (Math.floor(mapObject.scale) !== 1 && mapObject.zoomSettings.shouldZoomInitially || (mapObject.zoomNotApplied)) {
                x = -point.x + leftPosition;
                y = -point.y + topPosition;
            }
            else {
                if (mapObject.zoomSettings.shouldZoomInitially || mapObject.zoomNotApplied) {
                    x = -point.x + leftPosition;
                    y = -point.y + topPosition;
                    scaleFactor = zoomFactor;
                }
                else {
                    x = mapObject.zoomTranslatePoint.x;
                    y = mapObject.zoomTranslatePoint.y;
                }
            }
            scaleFactor = mapObject.mapScaleValue;
        }
    }
    else {
        if (isNullOrUndefined(mapObject.previousProjection) || mapObject.previousProjection !== mapObject.projectionType) {
            scaleFactor = parseFloat(Math.min(size.width / mapWidth, size.height / mapHeight).toFixed(2));
            mapWidth *= scaleFactor;
            mapHeight *= scaleFactor;
            let widthDiff = min['x'] !== 0 && mapObject.translateType === 'layers' ? availSize.width - size.width : 0;
            x = size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2))) - widthDiff;
            y = size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2)));
            mapObject.previousTranslate = new Point(x, y);
        }
        else {
            if (!mapObject.zoomSettings.shouldZoomInitially && mapObject.markerZoomFactor === 1 && mapObject.mapScaleValue === 1) {
                scaleFactor = parseFloat(Math.min(size.width / mapWidth, size.height / mapHeight).toFixed(2));
                mapHeight *= scaleFactor;
                mapWidth *= scaleFactor;
                y = size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2)));
                x = size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2)));
            }
            else {
                scaleFactor = mapObject.mapScaleValue < 1 ? mapObject.mapScaleValue + 1 : mapObject.mapScaleValue;
                mapObject.mapScaleValue = mapObject.zoomSettings.enable && mapObject.mapScaleValue !== 1 ? mapObject.mapScaleValue : 1;
                if ((mapObject.currentShapeDataLength !== (!isNullOrUndefined(layer.shapeData["features"])
                    ? layer.shapeData["features"].length : layer.shapeData["geometries"].length)) && layer.type !== 'SubLayer') {
                    let scale = parseFloat(Math.min(size.height / mapHeight, size.width / mapWidth).toFixed(2));
                    mapHeight *= scale;
                    mapWidth *= scale;
                    y = size.y + ((-(min['y'])) + ((size.height / 2)
                        - (mapHeight / 2)));
                    scaleFactor = scale;
                    x = size.x + ((-(min['x']))
                        + ((size.width / 2) - (mapWidth / 2)));
                }
                else if (mapObject.availableSize.height !== mapObject.heightBeforeRefresh || mapObject.widthBeforeRefresh !== mapObject.availableSize.width) {
                    let cscaleFactor = parseFloat(Math.min(size.width / mapWidth, size.height / mapHeight).toFixed(2));
                    let cmapWidth = mapWidth;
                    cmapWidth *= cscaleFactor;
                    let cmapHeight = mapHeight;
                    cmapHeight *= cscaleFactor;
                    let x1 = size.x + ((-(min['x'])) + ((size.width / 2) - (cmapWidth / 2)));
                    let y1 = size.y + ((-(min['y'])) + ((size.height / 2) - (cmapHeight / 2)));
                    let xdiff = (mapObject.translatePoint.x - mapObject.previousTranslate.x) / (mapObject.widthBeforeRefresh);
                    let ydiff = (mapObject.translatePoint.y - mapObject.previousTranslate.y) / (mapObject.heightBeforeRefresh);
                    let actxdiff = xdiff * (mapObject.availableSize.width);
                    let actydiff = ydiff * (mapObject.availableSize.height);
                    x = x1 + actxdiff;
                    y = y1 + actydiff;
                    mapObject.previousTranslate = new Point(x1, y1);
                    mapObject.zoomTranslatePoint.x = x;
                    mapObject.zoomTranslatePoint.y = y;
                }
                else {
                    if (!isNullOrUndefined(mapObject.previousProjection) && mapObject.mapScaleValue === 1 && !mapObject.zoomModule.isDragZoom) {
                        scaleFactor = parseFloat(Math.min(size.width / mapWidth, size.height / mapHeight).toFixed(2));
                        mapWidth *= scaleFactor;
                        x = size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2)));
                        mapHeight *= scaleFactor;
                        y = size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2)));
                    }
                    else {
                        x = mapObject.zoomTranslatePoint.x;
                        y = mapObject.zoomTranslatePoint.y;
                        scaleFactor = mapObject.scale;
                    }
                }
            }
        }
    }
    if (!isNullOrUndefined(mapObject.translatePoint)) {
        x = (mapObject.enablePersistence && mapObject.translatePoint.x != 0 && !mapObject.zoomNotApplied) ? mapObject.translatePoint.x : x;
        y = (mapObject.enablePersistence && mapObject.translatePoint.y != 0 && !mapObject.zoomNotApplied) ? mapObject.translatePoint.y : y;
    }
    scaleFactor = (mapObject.enablePersistence) ? ((mapObject.mapScaleValue >= 1) ? mapObject.mapScaleValue : 1) : scaleFactor;
    mapObject.widthBeforeRefresh = mapObject.availableSize.width;
    mapObject.heightBeforeRefresh = mapObject.availableSize.height;
    return { scale: scaleFactor, location: new Point(x, y) };
}
/**
 * @private
 */
function getZoomTranslate(mapObject, layer, animate) {
    let zoomFactorValue = mapObject.zoomSettings.zoomFactor;
    let scaleFactor;
    let center = mapObject.centerPosition;
    let latitude = center.latitude;
    let longitude = center.longitude;
    let checkZoomMethod = !isNullOrUndefined(mapObject.centerLongOfGivenLocation) &&
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
            mapObject.mapScaleValue = mapObject.mapScaleValue;
        }
        else {
            mapObject.mapScaleValue = zoomFactorValue;
        }
    }
    mapObject.mapScaleValue = mapObject.zoomSettings.zoomFactor !== 1 &&
        mapObject.zoomSettings.zoomFactor ===
            mapObject.mapScaleValue ? mapObject.zoomSettings.zoomFactor :
        mapObject.zoomSettings.zoomFactor !== mapObject.mapScaleValue && !mapObject.centerPositionChanged ? mapObject.mapScaleValue : mapObject.zoomSettings.zoomFactor;
    if (mapObject.zoomSettings.shouldZoomInitially) {
        mapObject.mapScaleValue = zoomFactorValue = scaleFactor = ((mapObject.enablePersistence || mapObject.zoomSettings.shouldZoomInitially) && mapObject.scale == 1)
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
    let zoomFactor = animate ? 1 : mapObject.mapScaleValue;
    let size = mapObject.mapAreaRect;
    let x;
    let y;
    let min = mapObject.baseMapRectBounds['min'];
    let max = mapObject.baseMapRectBounds['max'];
    let factor = animate ? 1 : mapObject.mapScaleValue;
    let mapWidth = Math.abs(max['x'] - min['x']);
    let mapHeight = Math.abs(min['y'] - max['y']);
    if ((!isNullOrUndefined(longitude) && !isNullOrUndefined(latitude)) || checkZoomMethod) {
        let topPosition = ((mapHeight + Math.abs(mapObject.mapAreaRect.height - mapHeight)) / 2) / factor;
        let leftPosition = ((mapWidth + Math.abs(mapObject.mapAreaRect.width - mapWidth)) / 2) / factor;
        let point = checkZoomMethod ? calculateCenterFromPixel(mapObject, layer) :
            convertGeoToPoint(latitude, longitude, mapObject.mapLayerPanel.calculateFactor(layer), layer, mapObject);
        if ((!isNullOrUndefined(mapObject.zoomTranslatePoint) || !isNullOrUndefined(mapObject.previousProjection)) && !mapObject.zoomNotApplied) {
            if (mapObject.previousProjection !== mapObject.projectionType) {
                x = -point.x + leftPosition;
                y = -point.y + topPosition;
            }
            else {
                x = mapObject.zoomTranslatePoint.x;
                y = mapObject.zoomTranslatePoint.y;
                zoomFactorValue = zoomFactor;
            }
        }
        else {
            x = -point.x + leftPosition + mapObject.mapAreaRect.x / zoomFactor;
            y = -point.y + topPosition + mapObject.mapAreaRect.y / zoomFactor;
        }
        if (!isNullOrUndefined(mapObject.translatePoint)) {
            y = (mapObject.enablePersistence && mapObject.translatePoint.y != 0 && !mapObject.zoomNotApplied) ? mapObject.translatePoint.y : y;
            x = (mapObject.enablePersistence && mapObject.translatePoint.x != 0 && !mapObject.zoomNotApplied) ? mapObject.translatePoint.x : x;
        }
        scaleFactor = zoomFactorValue !== 0 ? zoomFactorValue : 1;
    }
    else {
        let zoomFact = mapObject.zoomSettings.zoomFactor === 0 ? 1 : mapObject.zoomSettings.zoomFactor;
        let maxZoomFact = 10;
        zoomFact = zoomFact > maxZoomFact ? maxZoomFact : zoomFact;
        scaleFactor = zoomFact;
        let mapScale = mapObject.mapScaleValue === 0 ? 1 : mapObject.mapScaleValue > maxZoomFact
            ? maxZoomFact : mapObject.mapScaleValue;
        let leftPosition = (size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2))));
        let topPosition = (size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2))));
        if (!isNullOrUndefined(mapObject.zoomTranslatePoint) || !isNullOrUndefined(mapObject.previousProjection)) {
            if (mapObject.previousProjection !== mapObject.projectionType) {
                let previousPositions = [];
                let previousPoints = { x: leftPosition, y: topPosition };
                previousPositions.push(previousPoints);
                for (let i = 1; i < maxZoomFact; i++) {
                    let translatePointX = previousPositions[i - 1]['x'] - (((size.width / (i)) - (size.width / (i + 1))) / 2);
                    let translatePointY = previousPositions[i - 1]['y'] - (((size.height / (i)) - (size.height / (i + 1))) / 2);
                    previousPoints = { x: translatePointX, y: translatePointY };
                    previousPositions.push(previousPoints);
                }
                leftPosition = previousPositions[zoomFact - 1]['x'];
                topPosition = previousPositions[zoomFact - 1]['y'];
            }
            else {
                leftPosition = mapObject.zoomTranslatePoint.x;
                topPosition = mapObject.zoomTranslatePoint.y;
                if (zoomFact !== mapScale) {
                    scaleFactor = mapScale;
                }
            }
        }
        if (!isNullOrUndefined(mapObject.translatePoint)) {
            x = (mapObject.enablePersistence && mapObject.translatePoint.x != 0 && !mapObject.zoomNotApplied) ? mapObject.translatePoint.x : leftPosition;
            y = (mapObject.enablePersistence && mapObject.translatePoint.y != 0 && !mapObject.zoomNotApplied) ? mapObject.translatePoint.y : topPosition;
        }
    }
    scaleFactor = (mapObject.enablePersistence) ? (mapObject.mapScaleValue == 0 ? 1 : mapObject.mapScaleValue) : scaleFactor;
    return { scale: animate ? 1 : scaleFactor, location: new Point(x, y) };
}
/**
 * To get the html element by specified id
 */
function fixInitialScaleForTile(map) {
    map.tileZoomScale = map.tileZoomLevel = Math.floor(map.availableSize.height / 512) + 1;
    let padding = map.layers[map.baseLayerIndex].layerType !== 'GoogleStaticMap' ?
        20 : 0;
    let totalSize = Math.pow(2, map.tileZoomLevel) * 256;
    map.tileTranslatePoint.x = (map.availableSize.width / 2) - (totalSize / 2);
    map.tileTranslatePoint.y = (map.availableSize.height / 2) - (totalSize / 2) + padding;
    map.previousTileWidth = map.availableSize.width;
    map.previousTileHeight = map.availableSize.height;
}
/**
 * To get the html element by specified id
 */
function getElementByID(id) {
    return document.getElementById(id);
}
/**
 * To apply internalization
 */
function Internalize(maps, value) {
    maps.formatFunction =
        maps.intl.getNumberFormat({ format: maps.format, useGrouping: maps.useGroupingSeparator });
    return maps.formatFunction(value);
}
/**
 * Function     to compile the template function for maps.
 * @returns Function
 * @private
 */
function getTemplateFunction(template) {
    let templateFn = null;
    try {
        if (document.querySelectorAll(template).length) {
            templateFn = compile(document.querySelector(template).innerHTML.trim());
        }
    }
    catch (e) {
        templateFn = compile(template);
    }
    return templateFn;
}
/**
 * Function to get element from id.
 * @returns Element
 * @private
 */
function getElement(id) {
    return document.getElementById(id);
}
/**
 * Function to get shape data using target id
 */
function getShapeData(targetId, map) {
    let layerIndex = parseInt(targetId.split('_LayerIndex_')[1].split('_')[0], 10);
    let shapeIndex = parseInt(targetId.split('_shapeIndex_')[1].split('_')[0], 10);
    let layer = map.layers[layerIndex];
    let shapeData = layer.layerData[shapeIndex]['property'];
    let data;
    if (layer.dataSource) {
        data = layer.dataSource[checkShapeDataFields(layer.dataSource, shapeData, layer.shapeDataPath, layer.shapePropertyPath, layer)];
    }
    return { shapeData: shapeData, data: data };
}
/**
 * Function to trigger shapeSelected event
 * @private
 */
function triggerShapeEvent(targetId, selection, maps, eventName) {
    let shape = getShapeData(targetId, maps);
    let eventArgs = {
        cancel: false,
        name: eventName,
        fill: selection.fill,
        opacity: selection.opacity,
        border: selection.border,
        shapeData: shape.shapeData,
        data: shape.data,
        target: targetId,
        maps: maps
    };
    if (maps.isBlazor) {
        const { maps, shapeData } = eventArgs, blazorEventArgs = __rest(eventArgs, ["maps", "shapeData"]);
        eventArgs = blazorEventArgs;
    }
    maps.trigger(eventName, eventArgs);
    return eventArgs;
}
/**
 * Function to get elements using class name
 */
function getElementsByClassName(className) {
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
 */
function querySelector(args, elementSelector) {
    let targetEle = null;
    if (document.getElementById(elementSelector)) {
        targetEle = document.getElementById(elementSelector).querySelector('#' + args);
    }
    return targetEle;
}
/**
 * Function to get the element for selection and highlight using public method
 */
function getTargetElement(layerIndex, name, enable, map) {
    let targetId;
    let targetEle;
    let shapeData = map.layers[layerIndex].shapeData['features'];
    for (let i = 0; i < shapeData.length; i++) {
        if (shapeData[i]['properties'].name === name) {
            targetId = map.element.id + '_' + 'LayerIndex_' + layerIndex + '_shapeIndex_' + i + '_dataIndex_undefined';
            break;
        }
    }
    targetEle = getElement(targetId);
    return targetEle;
}
/**
 * Function to create style element for highlight and selection
 */
function createStyle(id, className, eventArgs) {
    return createElement('style', {
        id: id, innerHTML: '.' + className + '{fill:'
            + eventArgs.fill + ';' + 'opacity:' + eventArgs.opacity.toString() + ';' +
            'stroke-width:' + eventArgs.border.width.toString() + ';' +
            'stroke:' + eventArgs.border.color + ';' + '}'
    });
}
/**
 * Function to customize the style for highlight and selection
 */
function customizeStyle(id, className, eventArgs) {
    let styleEle = getElement(id);
    styleEle.innerHTML = '.' + className + '{fill:'
        + eventArgs.fill + ';' + 'opacity:' + eventArgs.opacity.toString() + ';' +
        'stroke-width:' + eventArgs.border.width.toString() + ';' +
        'stroke:' + eventArgs.border.color + '}';
}
/**
 * Function to trigger itemSelection event for legend selection and public method
 */
function triggerItemSelectionEvent(selectionSettings, map, targetElement, shapeData, data) {
    let border = {
        color: selectionSettings.border.color,
        width: selectionSettings.border.width / map.scale
    };
    let eventArgs = {
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
    map.trigger('itemSelection', eventArgs, (observedArgs) => {
        if (!getElement('ShapeselectionMap')) {
            document.body.appendChild(createStyle('ShapeselectionMap', 'ShapeselectionMapStyle', eventArgs));
        }
        else {
            customizeStyle('ShapeselectionMap', 'ShapeselectionMapStyle', eventArgs);
        }
    });
}
/**
 * Function to remove class from element
 */
function removeClass(element) {
    element.removeAttribute('class');
}
/**
 * Animation Effect Calculation End
 * @private
 */
function elementAnimate(element, delay, duration, point, maps, ele, radius = 0) {
    let centerX = point.x;
    let centerY = point.y;
    let height = 0;
    let transform = element.getAttribute('transform') || '';
    new Animation({}).animate(element, {
        duration: duration,
        delay: delay,
        progress: (args) => {
            if (args.timeStamp > args.delay) {
                height = ((args.timeStamp - args.delay) / args.duration);
                element.setAttribute('transform', 'translate( ' + (centerX - (radius * height)) + ' ' + (centerY - (radius * height)) +
                    ' ) scale(' + height + ')');
            }
        },
        end: (model) => {
            element.setAttribute('transform', transform);
            if (!ele) {
                return;
            }
            let event = {
                cancel: false, name: animationComplete, element: ele, maps: !maps.isBlazor ? maps : null
            };
            maps.trigger(animationComplete, event);
        }
    });
}
function timeout(id) {
    removeElement(id);
}
function showTooltip(text, size, x, y, areaWidth, areaHeight, id, element, isTouch) {
    let tooltip = document.getElementById(id);
    let width = measureText(text, {
        fontFamily: 'Segoe UI', size: '8px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    }).width;
    let str = text.split(' ');
    let demo = str[0].length;
    for (let i = 1; i < str.length; i++) {
        if (demo < str[i].length) {
            demo = str[i].length;
        }
    }
    if (!tooltip) {
        tooltip = createElement('div', {
            id: id,
            styles: 'background-color: rgb(255, 255, 255) !important; color:black !important; ' +
                'position:absolute;border:1px solid rgb(0, 0, 0); padding-left:5px;' +
                'font-size:12px; font-family: "Segoe UI"; text-align:center'
        });
    }
    if (x < (areaWidth - width)) {
        x = x;
    }
    else if (x > (areaWidth - width) && x < areaWidth - (demo * 8)) {
        width = (areaWidth - x);
    }
    else if (x >= areaWidth - demo * 8) {
        if (x > width) {
            x = x - width;
        }
        else {
            width = x;
            x = 0;
        }
    }
    let size1 = size.split('px');
    wordWrap(tooltip, text, x, y, size1, width, areaWidth, element);
    let height = tooltip.clientHeight;
    if ((height + parseInt(size1[0], 10) * 2) > areaHeight) {
        width = x;
        x = 0;
    }
    wordWrap(tooltip, text, x, y, size1, width, areaWidth, element);
    if (isTouch) {
        setTimeout(timeout, 5000, id);
    }
}
function wordWrap(tooltip, text, x, y, size1, width, areaWidth, element) {
    tooltip.innerHTML = text;
    tooltip.style.top = (parseInt(size1[0], 10) * 2).toString() + 'px';
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
//             touchList.push({ pageX: touches[i].clientX, pageY: touches[i].clientY, pointerId: null });
//         }
//     } else {
//         touchList = touchList ? touchList : [];
//         if (touchList.length === 0) {
//             touchList.push({ pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId });
//         } else {
//             for (let i: number = 0, length: number = touchList.length; i < length; i++) {
//                 if (touchList[i].pointerId === e.pointerId) {
//                     touchList[i] = { pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId };
//                 } else {
//                     touchList.push({ pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId });
//                 }
//             }
//         }
//     }
//     return touchList;
// }
/** @private */
function createTooltip(id, text, top, left, fontSize) {
    let tooltip = getElement(id);
    let style = 'top:' + top.toString() + 'px;' +
        'left:' + left.toString() + 'px;' +
        'color: #000000; ' +
        'background:' + '#FFFFFF' + ';' +
        'position:absolute;border:1px solid #707070;font-size:' + fontSize + ';border-radius:2px;';
    if (!tooltip) {
        tooltip = createElement('div', {
            id: id, innerHTML: '&nbsp;' + text + '&nbsp;', styles: style
        });
        document.body.appendChild(tooltip);
    }
    else {
        tooltip.setAttribute('innerHTML', '&nbsp;' + text + '&nbsp;');
        tooltip.setAttribute('styles', style);
    }
}
/** @private */
function drawSymbol(location, shape, size, url, options) {
    let renderer = new SvgRenderer('');
    let temp = renderLegendShape(location, size, shape, options, url);
    let htmlObject = renderer['draw' + temp.functionName](temp.renderOption);
    return htmlObject;
}
/** @private */
function renderLegendShape(location, size, shape, options, url) {
    let renderPath;
    let functionName = 'Path';
    let shapeWidth = size.width;
    let shapeHeight = size.height;
    let shapeX = location.x;
    let shapeY = location.y;
    let x = location.x + (-shapeWidth / 2);
    let y = location.y + (-shapeHeight / 2);
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
            let eq = 72;
            let xValue;
            let yValue;
            for (let i = 0; i <= 5; i++) {
                xValue = (shapeWidth / 2) * Math.cos((Math.PI / 180) * (i * eq));
                yValue = (shapeWidth / 2) * Math.sin((Math.PI / 180) * (i * eq));
                if (i === 0) {
                    renderPath = 'M' + ' ' + (shapeX + xValue) + ' ' + (shapeY + yValue) + ' ';
                }
                else {
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
/** @private */
function getElementOffset(childElement, parentElement) {
    let width;
    let height;
    parentElement.appendChild(childElement);
    width = childElement.offsetWidth;
    height = childElement.offsetHeight;
    parentElement.removeChild(childElement);
    return new Size(width, height);
}
/** @private */
function changeBorderWidth(element, index, scale, maps) {
    let childNode;
    for (let l = 0; l < element.childElementCount; l++) {
        childNode = element.childNodes[l];
        if (childNode.id.indexOf('_NavigationGroup') > -1) {
            changeNavaigationLineWidth(childNode, index, scale, maps);
        }
        else {
            let currentStroke = (maps.layersCollection[index].shapeSettings.border.width);
            childNode.setAttribute('stroke-width', (currentStroke / scale).toString());
        }
    }
}
/** @private */
function changeNavaigationLineWidth(element, index, scale, maps) {
    let node;
    for (let m = 0; m < element.childElementCount; m++) {
        node = element.childNodes[m];
        if (node.tagName === 'path') {
            let currentStroke = (maps.layersCollection[index]
                .navigationLineSettings[parseFloat(node.id.split('_NavigationIndex_')[1].split('_')[0])].width);
            node.setAttribute('stroke-width', (currentStroke / scale).toString());
        }
    }
}
// /** Pinch zoom helper methods */
/** @private */
function targetTouches(event) {
    let targetTouches = [];
    let touches = event.touches;
    for (let i = 0; i < touches.length; i++) {
        targetTouches.push({ pageX: touches[i].pageX, pageY: touches[i].pageY });
    }
    return targetTouches;
}
/** @private */
function calculateScale(startTouches, endTouches) {
    let startDistance = getDistance(startTouches[0], startTouches[1]);
    let endDistance = getDistance(endTouches[0], endTouches[1]);
    return (endDistance / startDistance);
}
/** @private */
function getDistance(a, b) {
    let x = a.pageX - b.pageX;
    let y = a.pageY - b.pageY;
    return Math.sqrt(x * x + y * y);
}
/** @private */
function getTouches(touches, maps) {
    let rect = maps.element.getBoundingClientRect();
    let posTop = rect.top + document.defaultView.pageXOffset;
    let posLeft = rect.left + document.defaultView.pageYOffset;
    return Array.prototype.slice.call(touches).map((touch) => {
        return {
            x: touch.pageX - posLeft,
            y: touch.pageY - posTop,
        };
    });
}
/** @private */
function getTouchCenter(touches) {
    return {
        x: touches.map((e) => { return e['x']; }).reduce(sum) / touches.length,
        y: touches.map((e) => { return e['y']; }).reduce(sum) / touches.length
    };
}
/** @private */
function sum(a, b) {
    return a + b;
}
/**
 * Animation Effect Calculation End
 * @private
 */
function zoomAnimate(element, delay, duration, point, scale, size, maps) {
    let delta = 0;
    let previousLocation = maps.previousPoint;
    let preScale = maps.previousScale;
    let diffScale = scale - preScale;
    let currentLocation = new MapLocation(0, 0);
    let currentScale = 1;
    if (scale === preScale) {
        element.setAttribute('transform', 'scale( ' + (scale) + ' ) translate( ' + point.x + ' ' + point.y + ' )');
        return;
    }
    let slope = (previousLocation, point) => {
        if (previousLocation.x === point.x) {
            return null;
        }
        return (point.y - previousLocation.y) / (point.x - previousLocation.x);
    };
    let intercept = (point, slopeValue) => {
        if (slopeValue === null) {
            return point.x;
        }
        return point.y - slopeValue * point.x;
    };
    let slopeFactor = slope(previousLocation, point);
    let slopeIntersection = intercept(previousLocation, slopeFactor);
    let horizontalDifference = point.x - previousLocation.x;
    let verticalDifference = point.y - previousLocation.y;
    animate(element, delay, duration, (args) => {
        if (args.timeStamp > args.delay) {
            delta = ((args.timeStamp - args.delay) / args.duration);
            currentScale = preScale + (delta * diffScale);
            currentLocation.x = previousLocation.x + (delta * horizontalDifference) / (currentScale / scale);
            if (slopeFactor == null) {
                currentLocation.y = previousLocation.y + (delta * verticalDifference);
            }
            else {
                currentLocation.y = ((slopeFactor * currentLocation.x) + slopeIntersection);
            }
            args.element.setAttribute('transform', 'scale( ' + currentScale + ' ) ' +
                'translate( ' + currentLocation.x + ' ' + currentLocation.y + ' )');
            maps.translatePoint = currentLocation;
            maps.scale = currentScale;
            maps.zoomModule.processTemplate(point.x, point.y, currentScale, maps);
        }
    }, () => {
        maps.translatePoint = point;
        maps.scale = scale;
        element.setAttribute('transform', 'scale( ' + (scale) + ' ) translate( ' + point.x + ' ' + point.y + ' )');
        maps.zoomModule.processTemplate(point.x, point.y, scale, maps);
    });
}
/**
 * To process custom animation
 */
function animate(element, delay, duration, process, end) {
    let start = null;
    let clearAnimation;
    let markerStyle = 'visibility:visible';
    let startAnimation = (timestamp) => {
        if (!start) {
            start = timestamp;
        }
        let progress = timestamp - start;
        if (progress < duration) {
            process.call(this, { element: element, delay: 0, timeStamp: progress, duration: duration });
            window.requestAnimationFrame(startAnimation);
        }
        else {
            window.cancelAnimationFrame(clearAnimation);
            end.call(this, { element: element });
            element.setAttribute('style', markerStyle);
        }
    };
    clearAnimation = window.requestAnimationFrame(startAnimation);
}
/**
 * To get shape data file using Ajax.
 */
class MapAjax {
    constructor(options, type, async, contentType, sendData) {
        this.dataOptions = options;
        this.type = type || 'GET';
        this.async = async || true;
        this.contentType = contentType;
        this.sendData = sendData;
    }
}
/**
 * Animation Translate
 * @private
 */
function smoothTranslate(element, delay, duration, point) {
    let delta = 0;
    let transform = element.getAttribute('transform').split(' ');
    if (transform.length === 2) {
        transform[2] = transform[1].split(')')[0];
        transform[1] = transform[0].split('(')[1];
    }
    let previousLocation = new MapLocation(parseInt(transform[1], 10), parseInt(transform[2], 10));
    let diffx = point.x - previousLocation.x;
    let diffy = point.y - previousLocation.y;
    let currentLocation = new MapLocation(0, 0);
    animate(element, delay, duration, (args) => {
        if (args.timeStamp > args.delay) {
            delta = ((args.timeStamp - args.delay) / args.duration);
            currentLocation.x = previousLocation.x + (delta * diffx);
            currentLocation.y = previousLocation.y + (delta * diffy);
            args.element.setAttribute('transform', 'translate( ' + currentLocation.x + ' ' + currentLocation.y + ' )');
        }
    }, () => {
        element.setAttribute('transform', 'translate( ' + point.x + ' ' + point.y + ' )');
    });
}
/**
 * To find compare should zoom factor with previous factor and current factor
 */
function compareZoomFactor(scaleFactor, maps) {
    let previous = isNullOrUndefined(maps.shouldZoomPreviousFactor) ?
        null : maps.shouldZoomPreviousFactor;
    let current = isNullOrUndefined(maps.shouldZoomCurrentFactor) ?
        null : maps.shouldZoomCurrentFactor;
    if (!isNullOrUndefined(current)) {
        maps.shouldZoomCurrentFactor = null;
        maps.shouldZoomPreviousFactor = null;
    }
    else if (!isNullOrUndefined(previous)
        && isNullOrUndefined(current)
        && maps.shouldZoomPreviousFactor !== scaleFactor) {
        maps.shouldZoomCurrentFactor = scaleFactor;
    }
    else {
        maps.shouldZoomPreviousFactor = scaleFactor;
    }
}
/**
 * To find zoom level for the min and max latitude values
 */
function calculateZoomLevel(minLat, maxLat, minLong, maxLong, mapWidth, mapHeight, maps) {
    let latRatio;
    let lngRatio;
    let scaleFactor;
    let maxZoomFact = 10;
    let applyMethodeZoom;
    let latZoom;
    let lngZoom;
    let result;
    let maxLatSin = Math.sin(maxLat * Math.PI / 180);
    let maxLatRad = Math.log((1 + maxLatSin) / (1 - maxLatSin)) / 2;
    let maxLatValue = Math.max(Math.min(maxLatRad, Math.PI), -Math.PI) / 2;
    let minLatSin = Math.sin(minLat * Math.PI / 180);
    let minLatRad = Math.log((1 + minLatSin) / (1 - minLatSin)) / 2;
    let minLatValue = Math.max(Math.min(minLatRad, Math.PI), -Math.PI) / 2;
    if (maps.zoomNotApplied && !maps.isTileMap) {
        let latiRatio = Math.abs((maps.baseMapBounds.latitude.max - maps.baseMapBounds.latitude.min) / (maxLat - minLat));
        let longiRatio = Math.abs((maps.baseMapBounds.longitude.max - maps.baseMapBounds.longitude.min) / (maxLong - minLong));
        applyMethodeZoom = Math.min(latiRatio, longiRatio);
        let minLocation = convertGeoToPoint(minLat, minLong, 1, maps.layersCollection[0], maps);
        let maxLocation = convertGeoToPoint(maxLat, maxLong, 1, maps.layersCollection[0], maps);
    }
    latRatio = (maxLatValue - minLatValue) / Math.PI;
    let lngDiff = maxLong - minLong;
    lngRatio = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;
    let WORLD_PX_HEIGHT = 256;
    let WORLD_PX_WIDTH = 256;
    latZoom = (Math.log(mapHeight / WORLD_PX_HEIGHT / latRatio) / Math.LN2);
    lngZoom = (Math.log(mapWidth / WORLD_PX_WIDTH / lngRatio) / Math.LN2);
    result = (maps.zoomNotApplied && !maps.isTileMap) ? applyMethodeZoom : Math.min(latZoom, lngZoom);
    scaleFactor = Math.min(result, maxZoomFact);
    scaleFactor = maps.isTileMap || !maps.zoomNotApplied ? Math.floor(scaleFactor) : scaleFactor;
    if (!maps.isTileMap) {
        compareZoomFactor(scaleFactor, maps);
    }
    return scaleFactor;
}

/**
 * Specifies Maps Themes
 */
var Theme;
(function (Theme) {
    /** @private */
    Theme.mapsTitleFont = {
        size: '14px',
        fontWeight: 'Medium',
        color: '#424242',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    Theme.mapsSubTitleFont = {
        size: '13px',
        fontWeight: 'Medium',
        color: '#424242',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    Theme.tooltipLabelFont = {
        size: '12px',
        fontWeight: 'Regular',
        color: '#FFFFFF',
        fontStyle: 'Regular',
        fontFamily: 'Roboto'
    };
    /** @private */
    Theme.legendTitleFont = {
        size: '14px',
        fontWeight: 'Regular',
        color: '#757575',
        fontStyle: 'Regular',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    Theme.legendLabelFont = {
        size: '13px',
        fontWeight: 'Medium',
        color: '#757575',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    Theme.dataLabelFont = {
        size: '12px',
        fontWeight: 'Medium',
        color: '#000000',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
})(Theme || (Theme = {}));
var FabricTheme;
(function (FabricTheme) {
    /** @private */
    FabricTheme.mapsTitleFont = {
        size: '14px',
        fontWeight: 'Semibold',
        color: '#424242',
        fontStyle: 'Semibold',
        fontFamily: 'SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    FabricTheme.mapsSubTitleFont = {
        size: '13px',
        fontWeight: 'Regular',
        color: '#424242',
        fontStyle: 'Regular',
        fontFamily: 'SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    FabricTheme.tooltipLabelFont = {
        size: '12px',
        fontWeight: 'Regular',
        color: '#FFFFFF',
        fontStyle: 'Regular',
        fontFamily: 'Roboto'
    };
    /** @private */
    FabricTheme.legendTitleFont = {
        size: '14px',
        fontWeight: 'Regular',
        color: '#757575',
        fontStyle: 'Regular',
        fontFamily: 'SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    FabricTheme.legendLabelFont = {
        size: '13px',
        fontWeight: 'Medium',
        color: '#757575',
        fontStyle: 'Medium',
        fontFamily: 'SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    FabricTheme.dataLabelFont = {
        size: '12px',
        fontWeight: 'Medium',
        color: '#000000',
        fontStyle: 'Medium',
        fontFamily: 'SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif'
    };
})(FabricTheme || (FabricTheme = {}));
var BootstrapTheme;
(function (BootstrapTheme) {
    /** @private */
    BootstrapTheme.mapsTitleFont = {
        size: '14px',
        fontWeight: 'Semibold',
        color: '#424242',
        fontStyle: 'Semibold',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    BootstrapTheme.mapsSubTitleFont = {
        size: '13px',
        fontWeight: 'Regular',
        color: '#424242',
        fontStyle: 'Regular',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    BootstrapTheme.tooltipLabelFont = {
        size: '12px',
        fontWeight: 'Regular',
        color: '#FFFFFF',
        fontStyle: 'Regular',
        fontFamily: 'Roboto'
    };
    /** @private */
    BootstrapTheme.legendTitleFont = {
        size: '14px',
        fontWeight: 'Regular',
        color: '#757575',
        fontStyle: 'Regular',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    BootstrapTheme.legendLabelFont = {
        size: '13px',
        fontWeight: 'Medium',
        color: '#757575',
        fontStyle: 'Medium',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    };
    /** @private */
    BootstrapTheme.dataLabelFont = {
        size: '12px',
        fontWeight: 'Medium',
        color: '#000000',
        fontStyle: 'Medium',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
    };
})(BootstrapTheme || (BootstrapTheme = {}));
/**
 * Internal use of Method to getting colors based on themes.
 * @private
 * @param theme
 */
function getShapeColor(theme) {
    return ['#B5E485', '#7BC1E8', '#DF819C', '#EC9B79', '#78D0D3',
        '#D6D572', '#9178E3', '#A1E5B4', '#87A4B4', '#E4C16C'];
}
/**
 * HighContrast Theme configuration
 */
var HighContrastTheme;
(function (HighContrastTheme) {
    /** @private */
    HighContrastTheme.mapsTitleFont = {
        size: '14px',
        fontWeight: 'Medium',
        color: '#FFFFFF',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    HighContrastTheme.mapsSubTitleFont = {
        size: '13px',
        fontWeight: 'Medium',
        color: '#FFFFFF',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    HighContrastTheme.tooltipLabelFont = {
        size: '12px',
        fontWeight: 'Regular',
        color: '#000000',
        fontStyle: 'Regular',
        fontFamily: 'Roboto'
    };
    /** @private */
    HighContrastTheme.legendTitleFont = {
        size: '14px',
        fontWeight: 'Regular',
        color: '#FFFFFF',
        fontStyle: 'Regular',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    HighContrastTheme.legendLabelFont = {
        size: '13px',
        fontWeight: 'Medium',
        color: '#FFFFFF',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    HighContrastTheme.dataLabelFont = {
        size: '12px',
        fontWeight: 'Medium',
        color: '#000000',
        fontStyle: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
})(HighContrastTheme || (HighContrastTheme = {}));
/**
 * Dark Theme configuration
 */
var DarkTheme;
(function (DarkTheme) {
    /** @private */
    DarkTheme.mapsTitleFont = {
        fontFamily: 'Roboto, Noto, Sans-serif',
        fontWeight: 'Medium',
        size: '14px',
        fontStyle: 'Medium',
        color: '#FFFFFF'
    };
    /** @private */
    DarkTheme.mapsSubTitleFont = {
        size: '13px',
        color: '#FFFFFF',
        fontWeight: 'Medium',
        fontFamily: 'Roboto, Noto, Sans-serif',
        fontStyle: 'Medium',
    };
    /** @private */
    DarkTheme.tooltipLabelFont = {
        size: '12px',
        color: '#282727',
        fontWeight: 'Regular',
        fontFamily: 'Roboto',
        fontStyle: 'Regular',
    };
    /** @private */
    DarkTheme.legendTitleFont = {
        size: '14px',
        fontWeight: 'Regular',
        color: '#FFFFFF',
        fontStyle: 'Regular',
        fontFamily: 'Roboto, Noto, Sans-serif'
    };
    /** @private */
    DarkTheme.legendLabelFont = {
        size: '13px',
        fontFamily: 'Roboto, Noto, Sans-serif',
        fontWeight: 'Medium',
        color: '#DADADA',
        fontStyle: 'Medium',
    };
})(DarkTheme || (DarkTheme = {}));
function getThemeStyle(theme) {
    let style;
    let color;
    switch (theme.toLowerCase()) {
        case 'materialdark':
            color = '#303030';
            break;
        case 'fabricdark':
            color = '#201F1F';
            break;
        case 'bootstrapdark':
            color = '#1A1A1A';
            break;
    }
    switch (theme.toLowerCase()) {
        case 'materialdark':
        case 'fabricdark':
        case 'bootstrapdark':
            style = {
                backgroundColor: color,
                areaBackgroundColor: color,
                titleFontColor: '#FFFFFF',
                subTitleFontColor: '#FFFFFF',
                legendTitleFontColor: '#DADADA',
                legendTextColor: '#DADADA',
                dataLabelFontColor: '#DADADA',
                tooltipFontColor: '#ffffff',
                tooltipFillColor: '#363F4C',
                zoomFillColor: '#FFFFFF',
                labelFontFamily: 'Roboto, Noto, Sans-serif'
            };
            break;
        case 'highcontrast':
            style = {
                backgroundColor: '#000000',
                areaBackgroundColor: '#000000',
                titleFontColor: '#FFFFFF',
                subTitleFontColor: '#FFFFFF',
                legendTitleFontColor: '#FFFFFF',
                legendTextColor: '#FFFFFF',
                dataLabelFontColor: '#000000',
                tooltipFontColor: '#000000',
                tooltipFillColor: '#ffffff',
                zoomFillColor: '#FFFFFF',
                labelFontFamily: 'Roboto, Noto, Sans-serif'
            };
            break;
        case 'bootstrap4':
            style = {
                backgroundColor: '#FFFFFF',
                areaBackgroundColor: '#FFFFFF',
                titleFontColor: '#212529',
                subTitleFontColor: '#212529',
                legendTitleFontColor: '#212529',
                legendTextColor: '#212529',
                dataLabelFontColor: '#212529',
                tooltipFontColor: '#FFFFFF',
                tooltipFillColor: '#000000',
                zoomFillColor: '#5B6269',
                fontFamily: 'HelveticaNeue-Medium',
                titleFontSize: '16px',
                legendFontSize: '14px',
                tooltipFillOpacity: 1,
                tooltipTextOpacity: 0.9,
                labelFontFamily: 'HelveticaNeue-Medium'
            };
            break;
        default:
            style = {
                backgroundColor: '#FFFFFF',
                areaBackgroundColor: '#FFFFFF',
                titleFontColor: '#424242',
                subTitleFontColor: '#424242',
                legendTitleFontColor: '#757575',
                legendTextColor: '#757575',
                dataLabelFontColor: '#000000',
                tooltipFontColor: '#ffffff',
                tooltipFillColor: '#000000',
                zoomFillColor: '#737373',
                labelFontFamily: 'Roboto, Noto, Sans-serif'
            };
            break;
    }
    return style;
}

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Maps base document
 */
/**
 * Sets and gets the options for customizing the annotation element in maps.
 */
class Annotation extends ChildProperty {
}
__decorate$1([
    Property('')
], Annotation.prototype, "content", void 0);
__decorate$1([
    Property('0px')
], Annotation.prototype, "x", void 0);
__decorate$1([
    Property('0px')
], Annotation.prototype, "y", void 0);
__decorate$1([
    Property('None')
], Annotation.prototype, "verticalAlignment", void 0);
__decorate$1([
    Property('None')
], Annotation.prototype, "horizontalAlignment", void 0);
__decorate$1([
    Property('-1')
], Annotation.prototype, "zIndex", void 0);
class Arrow extends ChildProperty {
}
__decorate$1([
    Property('Start')
], Arrow.prototype, "position", void 0);
__decorate$1([
    Property('false')
], Arrow.prototype, "showArrow", void 0);
__decorate$1([
    Property(2)
], Arrow.prototype, "size", void 0);
__decorate$1([
    Property('black')
], Arrow.prototype, "color", void 0);
__decorate$1([
    Property(0)
], Arrow.prototype, "offSet", void 0);
/**
 * Sets and gets the options to customize the style of the text in data label, legend and other texts.
 */
class Font extends ChildProperty {
}
__decorate$1([
    Property('12px')
], Font.prototype, "size", void 0);
__decorate$1([
    Property(null)
], Font.prototype, "color", void 0);
__decorate$1([
    Property('Roboto, Noto, Sans-serif')
], Font.prototype, "fontFamily", void 0);
__decorate$1([
    Property('Medium')
], Font.prototype, "fontWeight", void 0);
__decorate$1([
    Property('Medium')
], Font.prototype, "fontStyle", void 0);
__decorate$1([
    Property(1)
], Font.prototype, "opacity", void 0);
/**
 * Sets and gets the options to customize the border for the maps.
 */
class Border extends ChildProperty {
}
__decorate$1([
    Property('')
], Border.prototype, "color", void 0);
__decorate$1([
    Property(0)
], Border.prototype, "width", void 0);
/**
 * Sets and gets the center position in maps.
 */
class CenterPosition extends ChildProperty {
}
__decorate$1([
    Property(null)
], CenterPosition.prototype, "latitude", void 0);
__decorate$1([
    Property(null)
], CenterPosition.prototype, "longitude", void 0);
/**
 * Sets and gets the options to customize the tooltip for layers, markers, and bubble in maps.
 */
class TooltipSettings extends ChildProperty {
}
__decorate$1([
    Property(false)
], TooltipSettings.prototype, "visible", void 0);
__decorate$1([
    Property('')
], TooltipSettings.prototype, "template", void 0);
__decorate$1([
    Property('')
], TooltipSettings.prototype, "fill", void 0);
__decorate$1([
    Complex({ color: 'transparent', width: 1 }, Border)
], TooltipSettings.prototype, "border", void 0);
__decorate$1([
    Complex(Theme.tooltipLabelFont, Font)
], TooltipSettings.prototype, "textStyle", void 0);
__decorate$1([
    Property(null)
], TooltipSettings.prototype, "format", void 0);
__decorate$1([
    Property(null)
], TooltipSettings.prototype, "valuePath", void 0);
/**
 * Sets and gets the margin for the maps component.
 */
class Margin extends ChildProperty {
}
__decorate$1([
    Property(10)
], Margin.prototype, "left", void 0);
__decorate$1([
    Property(10)
], Margin.prototype, "right", void 0);
__decorate$1([
    Property(10)
], Margin.prototype, "top", void 0);
__decorate$1([
    Property(10)
], Margin.prototype, "bottom", void 0);
/*
 * Sets and gets the options to customize the line that connects the markers in marker cluster in maps.
 */
class ConnectorLineSettings extends ChildProperty {
}
__decorate$1([
    Property('#000000')
], ConnectorLineSettings.prototype, "color", void 0);
__decorate$1([
    Property(1)
], ConnectorLineSettings.prototype, "width", void 0);
__decorate$1([
    Property(1)
], ConnectorLineSettings.prototype, "opacity", void 0);
/**
 * Sets and gets the options to customize the cluster of markers in Maps.
 */
class MarkerClusterSettings extends ChildProperty {
}
__decorate$1([
    Property(false)
], MarkerClusterSettings.prototype, "allowClustering", void 0);
__decorate$1([
    Complex({ color: 'transparent', width: 1 }, Border)
], MarkerClusterSettings.prototype, "border", void 0);
__decorate$1([
    Property('#D2691E')
], MarkerClusterSettings.prototype, "fill", void 0);
__decorate$1([
    Property(1)
], MarkerClusterSettings.prototype, "opacity", void 0);
__decorate$1([
    Property('Rectangle')
], MarkerClusterSettings.prototype, "shape", void 0);
__decorate$1([
    Property(12)
], MarkerClusterSettings.prototype, "width", void 0);
__decorate$1([
    Property(12)
], MarkerClusterSettings.prototype, "height", void 0);
__decorate$1([
    Property(new Point(0, 0))
], MarkerClusterSettings.prototype, "offset", void 0);
__decorate$1([
    Property('')
], MarkerClusterSettings.prototype, "imageUrl", void 0);
__decorate$1([
    Property('')
], MarkerClusterSettings.prototype, "dashArray", void 0);
__decorate$1([
    Complex({}, Font)
], MarkerClusterSettings.prototype, "labelStyle", void 0);
__decorate$1([
    Property(false)
], MarkerClusterSettings.prototype, "allowClusterExpand", void 0);
__decorate$1([
    Complex({}, ConnectorLineSettings)
], MarkerClusterSettings.prototype, "connectorLineSettings", void 0);
/**
 * Sets and gets the data in the marker cluster.
 */
class MarkerClusterData extends ChildProperty {
}
/**
 * Sets and gets the options to customize the color-mapping in maps.
 */
class ColorMappingSettings extends ChildProperty {
}
__decorate$1([
    Property(null)
], ColorMappingSettings.prototype, "from", void 0);
__decorate$1([
    Property(null)
], ColorMappingSettings.prototype, "to", void 0);
__decorate$1([
    Property(null)
], ColorMappingSettings.prototype, "value", void 0);
__decorate$1([
    Property(null)
], ColorMappingSettings.prototype, "color", void 0);
__decorate$1([
    Property(null)
], ColorMappingSettings.prototype, "minOpacity", void 0);
__decorate$1([
    Property(null)
], ColorMappingSettings.prototype, "maxOpacity", void 0);
__decorate$1([
    Property(null)
], ColorMappingSettings.prototype, "label", void 0);
__decorate$1([
    Property(true)
], ColorMappingSettings.prototype, "showLegend", void 0);
/**
 * Sets and gets the shapes that is selected initially on rendering the maps.
 */
class InitialShapeSelectionSettings extends ChildProperty {
}
__decorate$1([
    Property(null)
], InitialShapeSelectionSettings.prototype, "shapePath", void 0);
__decorate$1([
    Property(null)
], InitialShapeSelectionSettings.prototype, "shapeValue", void 0);
/**
 * Sets and gets the options to customize the maps on selecting the shapes.
 */
class SelectionSettings extends ChildProperty {
}
__decorate$1([
    Property(false)
], SelectionSettings.prototype, "enable", void 0);
__decorate$1([
    Property(null)
], SelectionSettings.prototype, "fill", void 0);
__decorate$1([
    Property(1)
], SelectionSettings.prototype, "opacity", void 0);
__decorate$1([
    Property(false)
], SelectionSettings.prototype, "enableMultiSelect", void 0);
__decorate$1([
    Complex({ color: 'transparent', width: 0 }, Border)
], SelectionSettings.prototype, "border", void 0);
/**
 * Sets and gets the options to customize the shapes on which the mouse has hovered in maps.
 */
class HighlightSettings extends ChildProperty {
}
__decorate$1([
    Property(null)
], HighlightSettings.prototype, "fill", void 0);
__decorate$1([
    Property(false)
], HighlightSettings.prototype, "enable", void 0);
__decorate$1([
    Property(1)
], HighlightSettings.prototype, "opacity", void 0);
__decorate$1([
    Complex({ color: 'transparent', width: 0 }, Border)
], HighlightSettings.prototype, "border", void 0);
/**
 * Sets and gets the options to customize the navigation line in maps.
 */
class NavigationLineSettings extends ChildProperty {
}
__decorate$1([
    Property(false)
], NavigationLineSettings.prototype, "visible", void 0);
__decorate$1([
    Property(1)
], NavigationLineSettings.prototype, "width", void 0);
__decorate$1([
    Property(null)
], NavigationLineSettings.prototype, "longitude", void 0);
__decorate$1([
    Property(null)
], NavigationLineSettings.prototype, "latitude", void 0);
__decorate$1([
    Property('')
], NavigationLineSettings.prototype, "dashArray", void 0);
__decorate$1([
    Property('black')
], NavigationLineSettings.prototype, "color", void 0);
__decorate$1([
    Property(0)
], NavigationLineSettings.prototype, "angle", void 0);
__decorate$1([
    Complex({ showArrow: false, position: 'Start', size: 5, color: 'black' }, Arrow)
], NavigationLineSettings.prototype, "arrowSettings", void 0);
__decorate$1([
    Complex({}, SelectionSettings)
], NavigationLineSettings.prototype, "selectionSettings", void 0);
__decorate$1([
    Complex({}, HighlightSettings)
], NavigationLineSettings.prototype, "highlightSettings", void 0);
/**
 * Sets and gets the options to customize the bubble elements in maps.
 */
/*tslint:disable-next-line:max-line-length*/
class BubbleSettings extends ChildProperty {
}
__decorate$1([
    Complex({}, Border)
], BubbleSettings.prototype, "border", void 0);
__decorate$1([
    Property(false)
], BubbleSettings.prototype, "visible", void 0);
__decorate$1([
    Property([])
], BubbleSettings.prototype, "dataSource", void 0);
__decorate$1([
    Property(1000)
], BubbleSettings.prototype, "animationDuration", void 0);
__decorate$1([
    Property(0)
], BubbleSettings.prototype, "animationDelay", void 0);
__decorate$1([
    Property('')
], BubbleSettings.prototype, "fill", void 0);
__decorate$1([
    Property(10)
], BubbleSettings.prototype, "minRadius", void 0);
__decorate$1([
    Property(20)
], BubbleSettings.prototype, "maxRadius", void 0);
__decorate$1([
    Property(1)
], BubbleSettings.prototype, "opacity", void 0);
__decorate$1([
    Property(null)
], BubbleSettings.prototype, "valuePath", void 0);
__decorate$1([
    Property('Circle')
], BubbleSettings.prototype, "bubbleType", void 0);
__decorate$1([
    Property(null)
], BubbleSettings.prototype, "colorValuePath", void 0);
__decorate$1([
    Collection([], ColorMappingSettings)
], BubbleSettings.prototype, "colorMapping", void 0);
__decorate$1([
    Complex({}, TooltipSettings)
], BubbleSettings.prototype, "tooltipSettings", void 0);
__decorate$1([
    Complex({}, SelectionSettings)
], BubbleSettings.prototype, "selectionSettings", void 0);
__decorate$1([
    Complex({}, HighlightSettings)
], BubbleSettings.prototype, "highlightSettings", void 0);
/**
 * Sets and gets the title for the maps.
 */
class CommonTitleSettings extends ChildProperty {
}
__decorate$1([
    Property('')
], CommonTitleSettings.prototype, "text", void 0);
__decorate$1([
    Property('')
], CommonTitleSettings.prototype, "description", void 0);
/**
 * Sets and gets the subtitle for maps.
 */
class SubTitleSettings extends CommonTitleSettings {
}
__decorate$1([
    Complex({ size: Theme.mapsSubTitleFont.size }, Font)
], SubTitleSettings.prototype, "textStyle", void 0);
__decorate$1([
    Property('Center')
], SubTitleSettings.prototype, "alignment", void 0);
/**
 * Sets and gets the title for the maps.
 */
class TitleSettings extends CommonTitleSettings {
}
__decorate$1([
    Complex({ size: Theme.mapsTitleFont.size }, Font)
], TitleSettings.prototype, "textStyle", void 0);
__decorate$1([
    Property('Center')
], TitleSettings.prototype, "alignment", void 0);
__decorate$1([
    Complex({}, SubTitleSettings)
], TitleSettings.prototype, "subtitleSettings", void 0);
/**
 * Sets and gets the options to configure maps zooming operations.
 */
class ZoomSettings extends ChildProperty {
}
__decorate$1([
    Property(false)
], ZoomSettings.prototype, "enable", void 0);
__decorate$1([
    Property(true)
], ZoomSettings.prototype, "enablePanning", void 0);
__decorate$1([
    Property(true)
], ZoomSettings.prototype, "enableSelectionZooming", void 0);
__decorate$1([
    Property('Horizontal')
], ZoomSettings.prototype, "toolBarOrientation", void 0);
__decorate$1([
    Property(null)
], ZoomSettings.prototype, "color", void 0);
__decorate$1([
    Property('#e61576')
], ZoomSettings.prototype, "highlightColor", void 0);
__decorate$1([
    Property('#e61576')
], ZoomSettings.prototype, "selectionColor", void 0);
__decorate$1([
    Property('Far')
], ZoomSettings.prototype, "horizontalAlignment", void 0);
__decorate$1([
    Property('Near')
], ZoomSettings.prototype, "verticalAlignment", void 0);
__decorate$1([
    Property(['ZoomIn', 'ZoomOut', 'Reset'])
], ZoomSettings.prototype, "toolbars", void 0);
__decorate$1([
    Property(true)
], ZoomSettings.prototype, "mouseWheelZoom", void 0);
__decorate$1([
    Property(false)
], ZoomSettings.prototype, "doubleClickZoom", void 0);
__decorate$1([
    Property(false)
], ZoomSettings.prototype, "pinchZooming", void 0);
__decorate$1([
    Property(false)
], ZoomSettings.prototype, "zoomOnClick", void 0);
__decorate$1([
    Property(1)
], ZoomSettings.prototype, "zoomFactor", void 0);
__decorate$1([
    Property(10)
], ZoomSettings.prototype, "maxZoom", void 0);
__decorate$1([
    Property(1)
], ZoomSettings.prototype, "minZoom", void 0);
__decorate$1([
    Property(false)
], ZoomSettings.prototype, "shouldZoomInitially", void 0);
__decorate$1([
    Property(true)
], ZoomSettings.prototype, "resetToInitial", void 0);
/**
 * Sets and gets the settings to customize the color-mapping visibility based on the legend visibility.
 */
class ToggleLegendSettings extends ChildProperty {
}
__decorate$1([
    Property(false)
], ToggleLegendSettings.prototype, "enable", void 0);
__decorate$1([
    Property(true)
], ToggleLegendSettings.prototype, "applyShapeSettings", void 0);
__decorate$1([
    Property(1)
], ToggleLegendSettings.prototype, "opacity", void 0);
__decorate$1([
    Property('')
], ToggleLegendSettings.prototype, "fill", void 0);
__decorate$1([
    Complex({ color: '', width: 0 }, Border)
], ToggleLegendSettings.prototype, "border", void 0);
/**
 * Sets and gets the options to customize the legend of the maps.
 */
class LegendSettings extends ChildProperty {
}
__decorate$1([
    Property(false)
], LegendSettings.prototype, "toggleVisibility", void 0);
__decorate$1([
    Property(false)
], LegendSettings.prototype, "visible", void 0);
__decorate$1([
    Property('transparent')
], LegendSettings.prototype, "background", void 0);
__decorate$1([
    Property('Layers')
], LegendSettings.prototype, "type", void 0);
__decorate$1([
    Property(false)
], LegendSettings.prototype, "invertedPointer", void 0);
__decorate$1([
    Property('After')
], LegendSettings.prototype, "labelPosition", void 0);
__decorate$1([
    Property('None')
], LegendSettings.prototype, "labelDisplayMode", void 0);
__decorate$1([
    Property('Circle')
], LegendSettings.prototype, "shape", void 0);
__decorate$1([
    Property('')
], LegendSettings.prototype, "width", void 0);
__decorate$1([
    Property('')
], LegendSettings.prototype, "height", void 0);
__decorate$1([
    Complex({}, Font)
], LegendSettings.prototype, "textStyle", void 0);
__decorate$1([
    Property(15)
], LegendSettings.prototype, "shapeWidth", void 0);
__decorate$1([
    Property(15)
], LegendSettings.prototype, "shapeHeight", void 0);
__decorate$1([
    Property(10)
], LegendSettings.prototype, "shapePadding", void 0);
__decorate$1([
    Complex({ color: '#000000', width: 0 }, Border)
], LegendSettings.prototype, "border", void 0);
__decorate$1([
    Complex({ color: '#000000', width: 0 }, Border)
], LegendSettings.prototype, "shapeBorder", void 0);
__decorate$1([
    Complex({}, CommonTitleSettings)
], LegendSettings.prototype, "title", void 0);
__decorate$1([
    Complex({}, Font)
], LegendSettings.prototype, "titleStyle", void 0);
__decorate$1([
    Property('Bottom')
], LegendSettings.prototype, "position", void 0);
__decorate$1([
    Property('Center')
], LegendSettings.prototype, "alignment", void 0);
__decorate$1([
    Property('None')
], LegendSettings.prototype, "orientation", void 0);
__decorate$1([
    Property({ x: 0, y: 0 })
], LegendSettings.prototype, "location", void 0);
__decorate$1([
    Property(null)
], LegendSettings.prototype, "fill", void 0);
__decorate$1([
    Property(1)
], LegendSettings.prototype, "opacity", void 0);
__decorate$1([
    Property('Default')
], LegendSettings.prototype, "mode", void 0);
__decorate$1([
    Property(null)
], LegendSettings.prototype, "showLegendPath", void 0);
__decorate$1([
    Property(null)
], LegendSettings.prototype, "valuePath", void 0);
__decorate$1([
    Property(false)
], LegendSettings.prototype, "removeDuplicateLegend", void 0);
__decorate$1([
    Complex({}, ToggleLegendSettings)
], LegendSettings.prototype, "toggleLegendSettings", void 0);
/**
 * Sets and gets the options to customize the data-labels in maps.
 */
class DataLabelSettings extends ChildProperty {
}
__decorate$1([
    Property(false)
], DataLabelSettings.prototype, "visible", void 0);
__decorate$1([
    Complex({ width: 0, color: 'transparent' }, Border)
], DataLabelSettings.prototype, "border", void 0);
__decorate$1([
    Property('black')
], DataLabelSettings.prototype, "fill", void 0);
__decorate$1([
    Property(1)
], DataLabelSettings.prototype, "opacity", void 0);
__decorate$1([
    Property(5)
], DataLabelSettings.prototype, "rx", void 0);
__decorate$1([
    Property(5)
], DataLabelSettings.prototype, "ry", void 0);
__decorate$1([
    Complex({}, Font)
], DataLabelSettings.prototype, "textStyle", void 0);
__decorate$1([
    Property('')
], DataLabelSettings.prototype, "labelPath", void 0);
__decorate$1([
    Property('None')
], DataLabelSettings.prototype, "smartLabelMode", void 0);
__decorate$1([
    Property('None')
], DataLabelSettings.prototype, "intersectionAction", void 0);
__decorate$1([
    Property('')
], DataLabelSettings.prototype, "template", void 0);
/**
 * Sets and gets the options to customize the shapes in the maps.
 */
class ShapeSettings extends ChildProperty {
}
__decorate$1([
    Property('#A6A6A6')
], ShapeSettings.prototype, "fill", void 0);
__decorate$1([
    Property([])
], ShapeSettings.prototype, "palette", void 0);
__decorate$1([
    Property(5)
], ShapeSettings.prototype, "circleRadius", void 0);
__decorate$1([
    Complex({ width: 0, color: '#000000' }, Border)
], ShapeSettings.prototype, "border", void 0);
__decorate$1([
    Property('')
], ShapeSettings.prototype, "dashArray", void 0);
__decorate$1([
    Property(1)
], ShapeSettings.prototype, "opacity", void 0);
__decorate$1([
    Property(null)
], ShapeSettings.prototype, "colorValuePath", void 0);
__decorate$1([
    Property(null)
], ShapeSettings.prototype, "valuePath", void 0);
__decorate$1([
    Collection([], ColorMappingSettings)
], ShapeSettings.prototype, "colorMapping", void 0);
__decorate$1([
    Property(false)
], ShapeSettings.prototype, "autofill", void 0);
/**
 * Sets and gets the options to customize the marker in the maps.
 */
class MarkerBase extends ChildProperty {
}
__decorate$1([
    Complex({ color: 'transparent', width: 1 }, Border)
], MarkerBase.prototype, "border", void 0);
__decorate$1([
    Property(null)
], MarkerBase.prototype, "dashArray", void 0);
__decorate$1([
    Property(false)
], MarkerBase.prototype, "visible", void 0);
__decorate$1([
    Property('#FF471A')
], MarkerBase.prototype, "fill", void 0);
__decorate$1([
    Property(10)
], MarkerBase.prototype, "height", void 0);
__decorate$1([
    Property(10)
], MarkerBase.prototype, "width", void 0);
__decorate$1([
    Property(1)
], MarkerBase.prototype, "opacity", void 0);
__decorate$1([
    Property(null)
], MarkerBase.prototype, "colorValuePath", void 0);
__decorate$1([
    Property(null)
], MarkerBase.prototype, "shapeValuePath", void 0);
__decorate$1([
    Property(null)
], MarkerBase.prototype, "imageUrlValuePath", void 0);
__decorate$1([
    Property('Balloon')
], MarkerBase.prototype, "shape", void 0);
__decorate$1([
    Property('')
], MarkerBase.prototype, "legendText", void 0);
__decorate$1([
    Property(new Point(0, 0))
], MarkerBase.prototype, "offset", void 0);
__decorate$1([
    Property('')
], MarkerBase.prototype, "imageUrl", void 0);
__decorate$1([
    Property(null)
], MarkerBase.prototype, "template", void 0);
__decorate$1([
    Property([])
], MarkerBase.prototype, "dataSource", void 0);
__decorate$1([
    Complex({}, TooltipSettings)
], MarkerBase.prototype, "tooltipSettings", void 0);
__decorate$1([
    Property(1000)
], MarkerBase.prototype, "animationDuration", void 0);
__decorate$1([
    Property(0)
], MarkerBase.prototype, "animationDelay", void 0);
__decorate$1([
    Complex({}, SelectionSettings)
], MarkerBase.prototype, "selectionSettings", void 0);
__decorate$1([
    Complex({}, HighlightSettings)
], MarkerBase.prototype, "highlightSettings", void 0);
__decorate$1([
    Property(null)
], MarkerBase.prototype, "latitudeValuePath", void 0);
__decorate$1([
    Property(null)
], MarkerBase.prototype, "longitudeValuePath", void 0);
class MarkerSettings extends MarkerBase {
    // tslint:disable-next-line:no-any
    constructor(parent, propName, defaultValue, isArray) {
        super(parent, propName, defaultValue, isArray);
    }
}
/**
 * Sets and gets the options to customize the layers of the maps.
 */
class LayerSettings extends ChildProperty {
    constructor() {
        super(...arguments);
        /**
         * @private
         */
        this.isBaseLayer = false;
    }
}
__decorate$1([
    Property(null)
], LayerSettings.prototype, "shapeData", void 0);
__decorate$1([
    Property()
], LayerSettings.prototype, "query", void 0);
__decorate$1([
    Complex({}, ShapeSettings)
], LayerSettings.prototype, "shapeSettings", void 0);
__decorate$1([
    Property([])
], LayerSettings.prototype, "dataSource", void 0);
__decorate$1([
    Property('Layer')
], LayerSettings.prototype, "type", void 0);
__decorate$1([
    Property('Geographic')
], LayerSettings.prototype, "geometryType", void 0);
__decorate$1([
    Property('Aerial')
], LayerSettings.prototype, "bingMapType", void 0);
__decorate$1([
    Property('RoadMap')
], LayerSettings.prototype, "staticMapType", void 0);
__decorate$1([
    Property('')
], LayerSettings.prototype, "key", void 0);
__decorate$1([
    Property('Geometry')
], LayerSettings.prototype, "layerType", void 0);
__decorate$1([
    Property('https://a.tile.openstreetmap.org/level/tileX/tileY.png')
], LayerSettings.prototype, "urlTemplate", void 0);
__decorate$1([
    Property(true)
], LayerSettings.prototype, "visible", void 0);
__decorate$1([
    Property('name')
], LayerSettings.prototype, "shapeDataPath", void 0);
__decorate$1([
    Property('name')
], LayerSettings.prototype, "shapePropertyPath", void 0);
__decorate$1([
    Property(0)
], LayerSettings.prototype, "animationDuration", void 0);
__decorate$1([
    Collection([], MarkerSettings)
], LayerSettings.prototype, "markerSettings", void 0);
__decorate$1([
    Complex({}, MarkerClusterSettings)
], LayerSettings.prototype, "markerClusterSettings", void 0);
__decorate$1([
    Complex({}, DataLabelSettings)
], LayerSettings.prototype, "dataLabelSettings", void 0);
__decorate$1([
    Collection([], BubbleSettings)
], LayerSettings.prototype, "bubbleSettings", void 0);
__decorate$1([
    Collection([], NavigationLineSettings)
], LayerSettings.prototype, "navigationLineSettings", void 0);
__decorate$1([
    Complex({}, TooltipSettings)
], LayerSettings.prototype, "tooltipSettings", void 0);
__decorate$1([
    Complex({}, SelectionSettings)
], LayerSettings.prototype, "selectionSettings", void 0);
__decorate$1([
    Complex({}, HighlightSettings)
], LayerSettings.prototype, "highlightSettings", void 0);
__decorate$1([
    Complex({}, ToggleLegendSettings)
], LayerSettings.prototype, "toggleLegendSettings", void 0);
__decorate$1([
    Collection([], InitialShapeSelectionSettings)
], LayerSettings.prototype, "initialShapeSelection", void 0);
/**
 * Internal use for bing type layer rendering
 */
class Tile {
    constructor(x, y, height = 256, width = 256, top = 0, left = 0, src = null) {
        this.x = x;
        this.y = y;
        this.top = top;
        this.left = left;
        this.height = height;
        this.width = width;
        this.src = src;
    }
}
/**
 * Sets and gets the maps area settings
 */
class MapsAreaSettings extends ChildProperty {
}
__decorate$1([
    Property(null)
], MapsAreaSettings.prototype, "background", void 0);
__decorate$1([
    Complex({ color: 'transparent', width: 1 }, Border)
], MapsAreaSettings.prototype, "border", void 0);

var __rest$1 = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
/**
 * Marker class
 */
class Marker {
    constructor(maps) {
        this.maps = maps;
        this.trackElements = [];
        this.sameMarkerData = [];
    }
    /* tslint:disable:no-string-literal */
    markerRender(layerElement, layerIndex, factor, type) {
        let templateFn;
        let markerCount = 0;
        let nullCount = 0;
        let markerTemplateCount = 0;
        this.maps.translateType = 'marker';
        let currentLayer = this.maps.layersCollection[layerIndex];
        this.markerSVGObject = this.maps.renderer.createGroup({
            id: this.maps.element.id + '_Markers_Group',
            class: 'GroupElement',
            style: 'pointer-events: auto;'
        });
        let markerTemplateEle = createElement('div', {
            id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_Markers_Template_Group',
            className: 'template',
            styles: 'overflow: hidden; position: absolute;pointer-events: none;' +
                'top:' + this.maps.mapAreaRect.y + 'px;' +
                'left:' + this.maps.mapAreaRect.x + 'px;' +
                'height:' + this.maps.mapAreaRect.height + 'px;' +
                'width:' + this.maps.mapAreaRect.width + 'px;'
        });
        //tslint:disable
        currentLayer.markerSettings.map((markerSettings, markerIndex) => {
            let markerData = markerSettings.dataSource;
            Array.prototype.forEach.call(markerData, (data, dataIndex) => {
                this.maps.markerNullCount = markerIndex > 0 && dataIndex === 0 ? 0 : this.maps.markerNullCount;
                let eventArgs = {
                    cancel: false, name: markerRendering, fill: markerSettings.fill, height: markerSettings.height,
                    width: markerSettings.width, imageUrl: markerSettings.imageUrl, shape: markerSettings.shape,
                    template: markerSettings.template, data: data, maps: this.maps, marker: markerSettings,
                    border: markerSettings.border, colorValuePath: markerSettings.colorValuePath,
                    shapeValuePath: markerSettings.shapeValuePath, imageUrlValuePath: markerSettings.imageUrlValuePath
                };
                eventArgs = markerColorChoose(eventArgs, data);
                eventArgs = markerShapeChoose(eventArgs, data);
                if (this.maps.isBlazor) {
                    const { maps, marker: marker$$1 } = eventArgs, blazorEventArgs = __rest$1(eventArgs, ["maps", "marker"]);
                    eventArgs = blazorEventArgs;
                }
                this.maps.trigger('markerRendering', eventArgs, (MarkerArgs) => {
                    if (markerSettings.colorValuePath !== eventArgs.colorValuePath) {
                        eventArgs = markerColorChoose(eventArgs, data);
                    }
                    if (markerSettings.shapeValuePath !== eventArgs.shapeValuePath) {
                        eventArgs = markerShapeChoose(eventArgs, data);
                    }
                    let lng = (!isNullOrUndefined(data[markerSettings.longitudeValuePath])) ?
                        Number(getValueFromObject(data, markerSettings.longitudeValuePath)) : parseFloat(data['longitude']);
                    let lat = (!isNullOrUndefined(data[markerSettings.latitudeValuePath])) ?
                        Number(getValueFromObject(data, markerSettings.latitudeValuePath)) : parseFloat(data['latitude']);
                    if (this.maps.isBlazor) {
                        let data1 = {};
                        let text = [];
                        let j = 0;
                        if (data == {} || isNullOrUndefined(data['latitude']) || isNullOrUndefined(data['longitude'])) {
                            lat = (data['latitude'] && !isNullOrUndefined(data['latitude'])) ? data['latitude'] : 0;
                            lng = (data['longitude'] && !isNullOrUndefined(data['longitude'])) ? data['longitude'] : 0;
                        }
                        for (let i = 0; i < Object.keys(data).length; i++) {
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
                    let offset = markerSettings.offset;
                    if (!eventArgs.cancel && markerSettings.visible && !isNullOrUndefined(lng) && !isNullOrUndefined(lat)) {
                        let markerID = this.maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_'
                            + markerIndex + '_dataIndex_' + dataIndex;
                        let location = (this.maps.isTileMap) ? convertTileLatLongToPoint(new MapLocation(lng, lat), factor, this.maps.tileTranslatePoint, true) : convertGeoToPoint(lat, lng, factor, currentLayer, this.maps);
                        let animate$$1 = currentLayer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
                        let translate = (this.maps.isTileMap) ? (currentLayer.type === "SubLayer" && isNullOrUndefined(this.maps.zoomModule)) ? location = convertTileLatLongToPoint(new MapLocation(lng, lat), this.maps.tileZoomLevel, this.maps.tileTranslatePoint, true) : new Object() :
                            !isNullOrUndefined(this.maps.zoomModule) && this.maps.zoomSettings.zoomFactor > 1 ?
                                getZoomTranslate(this.maps, currentLayer, animate$$1) :
                                getTranslate(this.maps, currentLayer, animate$$1);
                        let scale = type === 'AddMarker' ? this.maps.scale : translate['scale'];
                        let transPoint = type === 'AddMarker' ? this.maps.translatePoint : translate['location'];
                        if (eventArgs.template && (!isNaN(location.x) && !isNaN(location.y))) {
                            markerTemplateCount++;
                            markerTemplate(eventArgs, templateFn, markerID, data, markerIndex, markerTemplateEle, location, scale, offset, this.maps);
                        }
                        else if (!eventArgs.template && (!isNaN(location.x) && !isNaN(location.y))) {
                            markerCount++;
                            marker(eventArgs, markerSettings, markerData, dataIndex, location, transPoint, markerID, offset, scale, this.maps, this.markerSVGObject);
                        }
                    }
                    nullCount += (!isNaN(lat) && !isNaN(lng)) ? 0 : 1;
                    markerTemplateCount += (eventArgs.cancel) ? 1 : 0;
                    markerCount += (eventArgs.cancel) ? 1 : 0;
                    this.maps.markerNullCount = (isNullOrUndefined(lng) || isNullOrUndefined(lat)) ? this.maps.markerNullCount + 1 : this.maps.markerNullCount;
                    let markerDataLength = markerData.length - this.maps.markerNullCount;
                    if (this.markerSVGObject.childElementCount === (markerDataLength - markerTemplateCount - nullCount) && (type !== 'Template')) {
                        layerElement.appendChild(this.markerSVGObject);
                        if (currentLayer.markerClusterSettings.allowClustering) {
                            this.maps.svgObject.appendChild(this.markerSVGObject);
                            this.maps.element.appendChild(this.maps.svgObject);
                            clusterTemplate(currentLayer, this.markerSVGObject, this.maps, layerIndex, this.markerSVGObject, layerElement, true, false);
                        }
                    }
                    if (markerTemplateEle.childElementCount === (markerData.length - markerCount - nullCount) && getElementByID(this.maps.element.id + '_Secondary_Element')) {
                        getElementByID(this.maps.element.id + '_Secondary_Element').appendChild(markerTemplateEle);
                        if (currentLayer.markerClusterSettings.allowClustering) {
                            clusterTemplate(currentLayer, markerTemplateEle, this.maps, layerIndex, this.markerSVGObject, layerElement, false, false);
                        }
                    }
                });
            });
        });
    }
    /**
     * To find zoom level for individual layers like India, USA.
     */
    calculateIndividualLayerMarkerZoomLevel(mapWidth, mapHeight, maxZoomFact) {
        let latZoom;
        let lngZoom;
        let result;
        let scaleFactor;
        let height = Math.abs(this.maps.baseMapBounds.latitude.max - this.maps.baseMapBounds.latitude.min);
        let width = Math.abs(this.maps.baseMapBounds.longitude.max - this.maps.baseMapBounds.longitude.min);
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
    calculateZoomCenterPositionAndFactor(layersCollection) {
        if (this.maps.zoomSettings.shouldZoomInitially && this.maps.markerModule) {
            let minLong;
            let maxLat;
            let minLat;
            let maxLong;
            let zoomLevel;
            let centerLat;
            let centerLong;
            let maxZoomFact = 10;
            let mapWidth = this.maps.mapAreaRect.width;
            let mapHeight = this.maps.mapAreaRect.height;
            this.maps.markerZoomedState = this.maps.markerZoomedState ? this.maps.markerZoomedState : isNullOrUndefined(this.maps.markerZoomFactor) ?
                !this.maps.markerZoomedState : this.maps.markerZoomFactor > 1 ? this.maps.markerZoomedState : !this.maps.markerZoomedState;
            this.maps.defaultState = this.maps.markerZoomedState ? !this.maps.markerZoomedState : this.maps.defaultState;
            Array.prototype.forEach.call(layersCollection, (currentLayer, layerIndex) => {
                let isMarker = currentLayer.markerSettings.length !== 0;
                if (isMarker) {
                    Array.prototype.forEach.call(currentLayer.markerSettings, (markerSetting, markerIndex) => {
                        let markerData = markerSetting.dataSource;
                        Array.prototype.forEach.call(markerData, (data, dataIndex) => {
                            let latitude = !isNullOrUndefined(data['latitude']) ? parseFloat(data['latitude']) : null;
                            let longitude = !isNullOrUndefined(data['longitude']) ? parseFloat(data['longitude']) : null;
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
                let markerFactor;
                if (this.maps.isTileMap || this.maps.baseMapRectBounds['min']['x'] === 0) {
                    zoomLevel = calculateZoomLevel(minLat, maxLat, minLong, maxLong, mapWidth, mapHeight, this.maps);
                    if (this.maps.isTileMap) {
                        markerFactor = isNullOrUndefined(this.maps.markerZoomFactor) ?
                            zoomLevel : isNullOrUndefined(this.maps.mapScaleValue) ?
                            zoomLevel : this.maps.mapScaleValue > 1 && this.maps.markerZoomFactor !== 1 ?
                            this.maps.mapScaleValue : zoomLevel;
                    }
                    else {
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
                }
                else {
                    zoomLevel = this.calculateIndividualLayerMarkerZoomLevel(mapWidth, mapHeight, maxZoomFact);
                    markerFactor = isNullOrUndefined(this.maps.mapScaleValue) ? zoomLevel :
                        (this.maps.mapScaleValue !== zoomLevel)
                            ? this.maps.mapScaleValue : zoomLevel;
                }
                this.maps.markerZoomFactor = markerFactor;
            }
        }
        else {
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
    markerClick(e) {
        let target = e.target.id;
        if (target.indexOf('_LayerIndex_') === -1 || target.indexOf('_cluster_') > 0) {
            return;
        }
        let options = this.getMarker(target);
        if (isNullOrUndefined(options)) {
            return;
        }
        let eventArgs = {
            cancel: false, name: markerClick, data: options.data, maps: this.maps,
            marker: options.marker, target: target, x: e.clientX, y: e.clientY,
            latitude: options.data["latitude"] || options.data["Latitude"],
            longitude: options.data["longitude"] || options.data["Longitude"],
            value: options.data["name"]
        };
        if (this.maps.isBlazor) {
            const { maps, marker: marker$$1, data } = eventArgs, blazorEventArgs = __rest$1(eventArgs, ["maps", "marker", "data"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerClick, eventArgs);
    }
    /**
     * To check and trigger Cluster click event
     */
    markerClusterClick(e) {
        let target = e.target.id;
        if (target.indexOf('_LayerIndex_') === -1 || target.indexOf('_cluster_') === -1) {
            return;
        }
        let options = this.getMarker(target);
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
        let eventArgs = {
            cancel: false, name: markerClusterClick, data: options, maps: this.maps,
            target: target, x: e.clientX, y: e.clientY,
            latitude: options.data["latitude"] || options.data["Latitude"], longitude: options.data["longitude"] || options.data["Longitude"],
            markerClusterCollection: options['markCollection']
        };
        if (this.maps.isBlazor) {
            const { maps, latitude, longitude } = eventArgs, blazorEventArgs = __rest$1(eventArgs, ["maps", "latitude", "longitude"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerClusterClick, eventArgs);
    }
    /**
     * To get marker from target id
     */
    getMarker(target) {
        let id = target.split('_LayerIndex_');
        let index = parseInt(id[1].split('_')[0], 10);
        let layer = this.maps.layers[index];
        let data;
        let markCollection = [];
        let clusterCollection = [];
        let marker$$1;
        if (target.indexOf('_MarkerIndex_') > -1) {
            let markerIndex = parseInt(id[1].split('_MarkerIndex_')[1].split('_')[0], 10);
            let dataIndex = parseInt(id[1].split('_dataIndex_')[1].split('_')[0], 10);
            marker$$1 = layer.markerSettings[markerIndex];
            if (!isNaN(markerIndex)) {
                data = marker$$1.dataSource[dataIndex];
                let collection = [];
                if (!marker$$1.template && (target.indexOf('_cluster_') > -1) && (this.maps.layers[index].markerClusterSettings.allowClusterExpand)) {
                    Array.prototype.forEach.call(marker$$1.dataSource, (location, index) => {
                        if (location['latitude'] === data['latitude'] && location['longitude'] === data['longitude']) {
                            collection.push({ data: data, index: index });
                        }
                    });
                }
                if ((target.indexOf('_cluster_') > -1)) {
                    let textElement = document.getElementById(target.indexOf('_datalabel_') > -1 ? target : target + '_datalabel_' + target.split('_cluster_')[1]);
                    let isClusterSame = false;
                    if (+textElement.textContent === collection.length) {
                        isClusterSame = true;
                    }
                    else {
                        let clusterElement = document.getElementById(target.indexOf('_datalabel_') > -1 ? target.split('_datalabel_')[0] : target);
                        let indexes = clusterElement.innerHTML.split(',').map(Number);
                        collection = [];
                        for (let i of indexes) {
                            collection.push({ data: marker$$1.dataSource[i], index: i });
                            if (this.maps.isBlazor) {
                                marker$$1.dataSource[i]["text"] = "";
                            }
                            markCollection.push(marker$$1.dataSource[i]);
                        }
                        isClusterSame = false;
                    }
                    clusterCollection.push({
                        data: collection, layerIndex: index, markerIndex: markerIndex,
                        targetClusterIndex: +(target.split('_cluster_')[1].indexOf('_datalabel_') > -1 ? target.split('_cluster_')[1].split('_datalabel_')[0] : target.split('_cluster_')[1]),
                        isClusterSame: isClusterSame
                    });
                }
                return { marker: marker$$1, data: data, clusterCollection: clusterCollection, markCollection: markCollection };
            }
        }
        return null;
    }
    /**
     * To check and trigger marker move event
     */
    markerMove(e) {
        let targetId = e.target.id;
        if (targetId.indexOf('_LayerIndex_') === -1 || targetId.indexOf('_cluster_') > 0) {
            return;
        }
        let options = this.getMarker(targetId);
        if (isNullOrUndefined(options)) {
            return;
        }
        let eventArgs = {
            cancel: false, name: markerMouseMove, data: options.data,
            maps: this.maps, target: targetId, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            const { maps } = eventArgs, blazorEventArgs = __rest$1(eventArgs, ["maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerMouseMove, eventArgs);
    }
    /**
     * To check and trigger cluster move event
     */
    markerClusterMouseMove(e) {
        let targetId = e.target.id;
        if (targetId.indexOf('_LayerIndex_') === -1 || targetId.indexOf('_cluster_') === -1) {
            return;
        }
        let options = this.getMarker(targetId);
        if (options.clusterCollection[0].isClusterSame) {
            e.target.setAttribute('style', 'cursor: pointer');
        }
        if (isNullOrUndefined(options)) {
            return;
        }
        let eventArgs = {
            cancel: false, name: markerClusterMouseMove, data: options.data, maps: this.maps,
            target: targetId, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            const { maps } = eventArgs, blazorEventArgs = __rest$1(eventArgs, ["maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerClusterMouseMove, eventArgs);
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'Marker';
    }
    /**
     * To destroy the layers.
     * @return {void}
     * @private
     */
    destroy(maps) {
        /**
         * Destroy method performed here
         */
    }
}

/**
 * Maps constants doc
 */
/**
 * Specifies the maps load event name.
 * @private
 */
const load = 'load';
/**
 * Specifies the maps loaded event name.
 * @private
 */
const loaded = 'loaded';
/**
 * Specifies the maps click event name.
 * @private
 */
const click = 'click';
/**
 * Specifies the maps right click event name.
 * @private
 */
const rightClick = 'rightClick';
/**
 * Specifies the maps double click event name.
 * @private
 */
const doubleClick = 'doubleClick';
/**
 * Specifies the maps resize event name.
 * @private
 */
const resize = 'resize';
/**
 * Specifies the maps tooltip event name.
 */
const tooltipRender = 'tooltipRender';
/**
 * Specifies the map shape selected event.
 */
const shapeSelected = 'shapeSelected';
/**
 * Specifies the maps shape highlight event.
 */
const shapeHighlight = 'shapeHighlight';
/**
 * Specifies the maps mouse move event name.
 * @private
 */
const mousemove = 'mousemove';
/**
 * Specifies the maps mouse up event name.
 * @private
 */
const mouseup = 'mouseup';
/**
 * Specifies the maps mouse down event name.
 * @private
 */
const mousedown = 'mousedown';
/**
 * Specifies the maps layer rendering event name.
 * @private
 */
const layerRendering = 'layerRendering';
/**
 * Specifies the maps shape rendering event name.
 * @private
 */
const shapeRendering = 'shapeRendering';
/**
 * Specifies the maps marker rendering event name.
 * @private
 */
const markerRendering = 'markerRendering';
/**
 * Specifies the maps cluster rendering event name.
 * @private
 */
const markerClusterRendering = 'markerClusterRendering';
/**
 * Specifies the maps marker click event name.
 * @private
 */
const markerClick = 'markerClick';
/**
 * Specifies the maps cluster click event name.
 * @private
 */
const markerClusterClick = 'markerClusterClick';
/**
 * Specifies the maps marker mouse move event name.
 * @private
 */
const markerMouseMove = 'markerMouseMove';
/**
 * Specifies the maps cluster mouse move event name.
 * @private
 */
const markerClusterMouseMove = 'markerClusterMouseMove';
/**
 * Specifies the maps data label rendering event name.
 * @private
 */
const dataLabelRendering = 'dataLabelRendering';
/**
 * Specifies the maps bubbleRendering event name.
 * @private
 */
const bubbleRendering = 'bubbleRendering';
/**
 * Specifies the maps bubble click event name.
 * @private
 */
const bubbleClick = 'bubbleClick';
/**
 * Specifies the maps bubble mouse move event name.
 * @private
 */
const bubbleMouseMove = 'bubbleMouseMove';
/**
 * Specifies the maps animation complete event name.
 * @private
 */
const animationComplete = 'animationComplete';
/**
 * Specifies the maps legend rendering event name.
 * @private
 */
const legendRendering = 'legendRendering';
/**
 * Specifies the maps annotation rendering event name.
 * @private
 */
const annotationRendering = 'annotationRendering';
/**
 * Specifies the maps item selection event name.
 * @private
 */
const itemSelection = 'itemSelection';
/**
 * Specifies the maps item highlight event name.
 */
const itemHighlight = 'itemHighlight';
/**
 * Specifies the maps before print event name.
 */
const beforePrint = 'beforePrint';
/**
 * Specifies the maps zoom in event name.
 */
const zoomIn = 'zoomIn';
/**
 * Specifies the maps zoom out event name.
 */
const zoomOut = 'zoomOut';
/**
 * Specifies the maps pan event name.
 */
const pan = 'pan';

/**
 * Bing map src doc
 */
class BingMap {
    constructor(maps) {
        this.maps = maps;
    }
    getBingMap(tile, key, type, language, imageUrl, subDomains) {
        let quadKey = '';
        let subDomain;
        let maxZoom = Math.min(this.maps.tileZoomLevel, parseInt(this.maxZoom, 10));
        for (let i = maxZoom; i > 0; i--) {
            let digit = 0;
            let mask = 1 << (i - 1);
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
        return imageUrl += '&mkt=' + language + '&ur=IN&Key=' + key;
    }
}

/**
 * ColorMapping class
 */
class ColorMapping {
    constructor(maps) {
        this.maps = maps;
    }
    /**
     * To get color based on shape settings.
     * @private
     */
    getShapeColorMapping(shapeSettings, layerData, color) {
        let colorValuePath = shapeSettings.colorValuePath ? shapeSettings.colorValuePath : shapeSettings.valuePath;
        let equalValue = (!isNullOrUndefined(colorValuePath)) ? ((colorValuePath.indexOf('.') > -1) ?
            getValueFromObject(layerData, colorValuePath) : layerData[colorValuePath]) : layerData[colorValuePath];
        let colorValue = Number(equalValue);
        let shapeColor = this.getColorByValue(shapeSettings.colorMapping, colorValue, equalValue);
        return shapeColor ? shapeColor : color;
    }
    /**
     * To color by value and color mapping
     */
    getColorByValue(colorMapping, colorValue, equalValue) {
        if (isNaN(colorValue) && isNullOrUndefined(equalValue)) {
            return null;
        }
        let fill = '';
        let opacity;
        let gradientFill;
        for (let colorMap of colorMapping) {
            if ((!isNullOrUndefined(colorMap.from) && !isNullOrUndefined(colorMap.to)
                && (colorValue >= colorMap.from && colorValue <= colorMap.to)) ||
                (colorMap.value === equalValue)) {
                if (Object.prototype.toString.call(colorMap.color) === '[object Array]') {
                    if (!isNullOrUndefined(colorMap.value)) {
                        fill = colorMap.color[0];
                    }
                    else {
                        gradientFill = this.getColor(colorMap, colorValue);
                        fill = gradientFill;
                    }
                }
                else {
                    fill = colorMap.color;
                }
            }
            if (((colorValue >= colorMap.from && colorValue <= colorMap.to) || (colorMap.value === equalValue))
                && (!isNullOrUndefined(colorMap.minOpacity) && !isNullOrUndefined(colorMap.maxOpacity) && fill)) {
                opacity = this.deSaturationColor(colorMap, fill, colorValue, equalValue);
            }
            if ((fill === '' || isNullOrUndefined(fill)) && isNullOrUndefined(colorMap.from) && isNullOrUndefined(colorMap.to)
                && isNullOrUndefined(colorMap.minOpacity) && isNullOrUndefined(colorMap.maxOpacity) && isNullOrUndefined(colorMap.value)) {
                fill = Object.prototype.toString.call(colorMap.color) === '[object Array]' ? colorMap.color[0] : colorMap.color;
            }
        }
        return { fill: fill || ((!colorMapping.length) ? equalValue : null), opacity: opacity };
    }
    deSaturationColor(colorMapping, color, rangeValue, equalValue) {
        let opacity = 1;
        if (((rangeValue >= colorMapping.from && rangeValue <= colorMapping.to) || colorMapping.value === equalValue)) {
            let ratio = !isNaN(rangeValue) ? (rangeValue - colorMapping.from) / (colorMapping.to - colorMapping.from) :
                colorMapping.from / (colorMapping.to - colorMapping.from);
            opacity = (ratio * (colorMapping.maxOpacity - colorMapping.minOpacity)) + colorMapping.minOpacity;
        }
        return opacity;
    }
    rgbToHex(r, g, b) {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
    componentToHex(value) {
        let hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
    getColor(colorMap, value) {
        let color = '';
        let rbg;
        if (Number(value) === colorMap.from) {
            color = colorMap.color[0];
        }
        else if (Number(value) === colorMap.to) {
            color = colorMap.color[colorMap.color.length - 1];
        }
        else {
            rbg = this.getGradientColor(Number(value), colorMap);
            color = this.rgbToHex(rbg.r, rbg.g, rbg.b);
        }
        return color;
    }
    /* tslint:disable-next-line:max-func-body-length */
    /* tslint:disable:no-string-literal */
    getGradientColor(value, colorMap) {
        let previousOffset = colorMap.from;
        let nextOffset = colorMap.to;
        let percent = 0;
        let full = nextOffset - previousOffset;
        let midColor;
        percent = (value - previousOffset) / full;
        let previousColor;
        let nextColor;
        if (colorMap.color.length <= 2) {
            previousColor = colorMap.color[0].charAt(0) === '#' ? colorMap.color[0] : this._colorNameToHex(colorMap.color[0]);
            nextColor = colorMap.color[colorMap.color.length - 1].charAt(0) === '#' ?
                colorMap.color[colorMap.color.length - 1] : this._colorNameToHex(colorMap.color[colorMap.color.length - 1]);
        }
        else {
            previousColor = colorMap.color[0].charAt(0) === '#' ? colorMap.color[0] : this._colorNameToHex(colorMap.color[0]);
            nextColor = colorMap.color[colorMap.color.length - 1].charAt(0) === '#' ?
                colorMap.color[colorMap.color.length - 1] : this._colorNameToHex(colorMap.color[colorMap.color.length - 1]);
            let a = full / (colorMap.color.length - 1);
            let b;
            let c;
            let length = colorMap.color.length - 1;
            let splitColorValueOffset = [];
            let splitColor = {};
            for (let j = 1; j < length; j++) {
                c = j * a;
                b = previousOffset + c;
                splitColor = { b: b, color: colorMap.color[j] };
                splitColorValueOffset.push(splitColor);
            }
            for (let i = 0; i < splitColorValueOffset.length; i++) {
                if (previousOffset <= value && value <= splitColorValueOffset[i]['b'] && i === 0) {
                    midColor = splitColorValueOffset[i]['color'].charAt(0) === '#' ?
                        splitColorValueOffset[i]['color'] : this._colorNameToHex(splitColorValueOffset[i]['color']);
                    nextColor = midColor;
                    percent = value < splitColorValueOffset[i]['b'] ? 1 - Math.abs((value - splitColorValueOffset[i]['b']) / a)
                        : (value - splitColorValueOffset[i]['b']) / a;
                }
                else if (splitColorValueOffset[i]['b'] <= value && value <= nextOffset && i === (splitColorValueOffset.length - 1)) {
                    midColor = splitColorValueOffset[i]['color'].charAt(0) === '#' ?
                        splitColorValueOffset[i]['color'] : this._colorNameToHex(splitColorValueOffset[i]['color']);
                    previousColor = midColor;
                    percent = value < splitColorValueOffset[i]['b'] ?
                        1 - Math.abs((value - splitColorValueOffset[i]['b']) / a) : (value - splitColorValueOffset[i]['b']) / a;
                }
                if (i !== splitColorValueOffset.length - 1 && i < splitColorValueOffset.length) {
                    if (splitColorValueOffset[i]['b'] <= value && value <= splitColorValueOffset[i + 1]['b']) {
                        midColor = splitColorValueOffset[i]['color'].charAt(0) === '#' ?
                            splitColorValueOffset[i]['color'] : this._colorNameToHex(splitColorValueOffset[i]['color']);
                        previousColor = midColor;
                        nextColor = splitColorValueOffset[i + 1]['color'].charAt(0) === '#' ?
                            splitColorValueOffset[i + 1]['color'] : this._colorNameToHex(splitColorValueOffset[i + 1]['color']);
                        percent = Math.abs((value - splitColorValueOffset[i + 1]['b'])) / a;
                    }
                }
            }
        }
        return this.getPercentageColor(percent, previousColor, nextColor);
    }
    getPercentageColor(percent, previous, next) {
        let nextColor = next.split('#')[1];
        let prevColor = previous.split('#')[1];
        let r = this.getPercentage(percent, parseInt(prevColor.substr(0, 2), 16), parseInt(nextColor.substr(0, 2), 16));
        let g = this.getPercentage(percent, parseInt(prevColor.substr(2, 2), 16), parseInt(nextColor.substr(2, 2), 16));
        let b = this.getPercentage(percent, parseInt(prevColor.substr(4, 2), 16), parseInt(nextColor.substr(4, 2), 16));
        return new ColorValue(r, g, b);
    }
    getPercentage(percent, previous, next) {
        let full = next - previous;
        return Math.round((previous + (full * percent)));
    }
    _colorNameToHex(color) {
        let colors = {
            'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff', 'aquamarine': '#7fffd4', 'azure': '#f0ffff',
            'beige': '#f5f5dc', 'bisque': '#ffe4c4', 'black': '#000000', 'blanchedalmond': '#ffebcd', 'blue': '#0000ff',
            'blueviolet': '#8a2be2', 'brown': '#a52a2a', 'burlywood': '#deb887',
            'cadetblue': '#5f9ea0', 'chartreuse': '#7fff00', 'chocolate': '#d2691e', 'coral': '#ff7f50',
            'cornflowerblue': '#6495ed', 'cornsilk': '#fff8dc', 'crimson': '#dc143c', 'cyan': '#00ffff',
            'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b', 'darkgray': '#a9a9a9', 'darkgreen': '#006400',
            'darkkhaki': '#bdb76b', 'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f',
            'darkorange': '#ff8c00', 'darkorchid': '#9932cc', 'darkred': '#8b0000', 'darksalmon': '#e9967a', 'darkseagreen': '#8fbc8f',
            'darkslateblue': '#483d8b', 'darkslategray': '#2f4f4f', 'darkturquoise': '#00ced1',
            'darkviolet': '#9400d3', 'deeppink': '#ff1493', 'deepskyblue': '#00bfff', 'dimgray': '#696969', 'dodgerblue': '#1e90ff',
            'firebrick': '#b22222', 'floralwhite': '#fffaf0', 'forestgreen': '#228b22', 'fuchsia': '#ff00ff',
            'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff', 'gold': '#ffd700', 'goldenrod': '#daa520', 'gray': '#808080',
            'green': '#008000', 'greenyellow': '#adff2f',
            'honeydew': '#f0fff0', 'hotpink': '#ff69b4',
            'indianred ': '#cd5c5c', 'indigo ': '#4b0082', 'ivory': '#fffff0', 'khaki': '#f0e68c',
            'lavender': '#e6e6fa', 'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00', 'lemonchiffon': '#fffacd', 'lightblue': '#add8e6',
            'lightcoral': '#f08080', 'lightcyan': '#e0ffff', 'lightgoldenrodyellow': '#fafad2',
            'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90', 'lightpink': '#ffb6c1', 'lightsalmon': '#ffa07a', 'lightseagreen': '#20b2aa',
            'lightskyblue': '#87cefa', 'lightslategray': '#778899', 'lightsteelblue': '#b0c4de',
            'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32', 'linen': '#faf0e6',
            'magenta': '#ff00ff', 'maroon': '#800000', 'mediumaquamarine': '#66cdaa', 'mediumblue': '#0000cd', 'mediumorchid': '#ba55d3',
            'mediumpurple': '#9370d8', 'mediumseagreen': '#3cb371', 'mediumslateblue': '#7b68ee',
            'mediumspringgreen': '#00fa9a', 'mediumturquoise': '#48d1cc', 'mediumvioletred': '#c71585', 'midnightblue': '#191970',
            'mintcream': '#f5fffa', 'mistyrose': '#ffe4e1', 'moccasin': '#ffe4b5',
            'navajowhite': '#ffdead', 'navy': '#000080', 'orchid': '#da70d6', 'papayawhip': '#ffefd5',
            'oldlace': '#fdf5e6', 'olive': '#808000', 'olivedrab': '#6b8e23', 'orange': '#ffa500', 'orangered': '#ff4500',
            'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee', 'palevioletred': '#d87093',
            'peachpuff': '#ffdab9', 'peru': '#cd853f', 'pink': '#ffc0cb', 'plum': '#dda0dd', 'powderblue': '#b0e0e6', 'purple': '#800080',
            'red': '#ff0000', 'rosybrown': '#bc8f8f', 'royalblue': '#4169e1',
            'saddlebrown': '#8b4513', 'salmon': '#fa8072', 'sandybrown': '#f4a460', 'seagreen': '#2e8b57', 'seashell': '#fff5ee',
            'sienna': '#a0522d', 'silver': '#c0c0c0', 'skyblue': '#87ceeb', 'slateblue': '#6a5acd',
            'slategray': '#708090', 'snow': '#fffafa', 'springgreen': '#00ff7f', 'steelblue': '#4682b4',
            'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 'turquoise': '#40e0d0',
            'violet': '#ee82ee',
            'wheat': '#f5deb3', 'white': '#ffffff', 'whitesmoke': '#f5f5f5',
            'yellow': '#ffff00', 'yellowgreen': '#9acd32'
        };
        if (Object.prototype.toString.call(color) === '[object Array]') {
            return color;
        }
        if (typeof colors[color.toLowerCase()] !== 'undefined') {
            return colors[color.toLowerCase()];
        }
        return color;
    }
}

var __rest$2 = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
/**
 * To calculate and render the shape layer
 */
class LayerPanel {
    constructor(map) {
        this.isMapCoordinates = true;
        this.horizontalPan = false;
        this.horizontalPanXCount = 0;
        this.mapObject = map;
        this.ajaxModule = new Ajax();
        this.ajaxResponse = [];
    }
    /* tslint:disable:no-string-literal */
    measureLayerPanel() {
        let layerCollection = this.mapObject.layersCollection;
        let areaRect = this.mapObject.mapAreaRect;
        let secondaryEle = getElementByID(this.mapObject.element.id + '_Secondary_Element');
        if (this.mapObject.isTileMap && secondaryEle) {
            this.tileSvgObject = this.mapObject.renderer.createSvg({
                id: this.mapObject.element.id + '_Tile_SVG', width: areaRect.width,
                height: areaRect.height,
            });
            let parentElement = createElement('div', {
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
            let staticMapSize = 640;
            this.clipRectElement = this.mapObject.renderer.drawClipPath(new RectOption(this.mapObject.element.id + '_MapArea_ClipRect', 'transparent', { width: 1, color: 'Gray' }, 1, {
                x: ((areaRect.width - staticMapSize) / 2), y: 0,
                width: staticMapSize, height: areaRect.height
            }));
        }
        else {
            this.clipRectElement = this.mapObject.renderer.drawClipPath(new RectOption(this.mapObject.element.id + '_MapArea_ClipRect', 'transparent', { width: 1, color: 'Gray' }, 1, {
                x: this.mapObject.isTileMap ? 0 : areaRect.x, y: this.mapObject.isTileMap ? 0 : areaRect.y,
                width: areaRect.width, height: areaRect.height
            }));
        }
        this.layerGroup.appendChild(this.clipRectElement);
        this.mapObject.baseMapBounds = null;
        this.mapObject.baseMapRectBounds = null;
        this.mapObject.baseSize = null;
        Array.prototype.forEach.call(layerCollection, (layer, index) => {
            this.currentLayer = layer;
            this.processLayers(layer, index);
        });
    }
    /**
     * Tile rendering
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    renderTileLayer(panel, layer, layerIndex, bing) {
        panel.currentFactor = panel.calculateFactor(layer);
        panel.mapObject.defaultState = ((panel.mapObject.zoomSettings.zoomFactor !== 1) &&
            (!isNullOrUndefined(panel.mapObject.tileZoomLevel) && panel.mapObject.tileZoomLevel !== 1)) ?
            false : true;
        if (isNullOrUndefined(panel.mapObject.previousCenterLatitude) &&
            isNullOrUndefined(panel.mapObject.previousCenterLongitude)) {
            panel.mapObject.previousCenterLatitude = panel.mapObject.centerPosition.latitude;
            panel.mapObject.previousCenterLongitude = panel.mapObject.centerPosition.longitude;
        }
        else if (panel.mapObject.previousCenterLatitude !==
            panel.mapObject.centerPosition.latitude && panel.mapObject.previousCenterLongitude !==
            panel.mapObject.centerPosition.longitude) {
            panel.mapObject.centerPositionChanged = true;
            panel.mapObject.previousCenterLatitude = panel.mapObject.centerPosition.latitude;
            panel.mapObject.previousCenterLongitude = panel.mapObject.centerPosition.longitude;
        }
        else {
            panel.mapObject.centerPositionChanged = false;
        }
        let center = new Point(panel.mapObject.centerPosition.longitude, panel.mapObject.centerPosition.latitude);
        let centerTileMap = center;
        if ((this.mapObject.isTileMap && panel.mapObject.markerModule) && panel.mapObject.zoomSettings.enable) {
            panel.mapObject.markerModule.calculateZoomCenterPositionAndFactor(this.mapObject.layersCollection);
            if (!isNullOrUndefined(this.mapObject.markerCenterLatitude) && !isNullOrUndefined(this.mapObject.markerCenterLongitude)) {
                centerTileMap = new Point(panel.mapObject.markerCenterLongitude, panel.mapObject.markerCenterLatitude);
            }
        }
        if (!panel.mapObject.zoomSettings.shouldZoomInitially && panel.mapObject.centerPosition.longitude
            && panel.mapObject.centerPosition.latitude && !panel.mapObject.zoomPersistence && panel.mapObject.defaultState) {
            center = new Point(panel.mapObject.centerPosition.longitude, panel.mapObject.centerPosition.latitude);
        }
        else if (panel.mapObject.zoomSettings.shouldZoomInitially
            && panel.mapObject.markerZoomedState && !panel.mapObject.zoomPersistence
            && !isNullOrUndefined(panel.mapObject.markerZoomCenterPoint)) {
            center = new Point(panel.mapObject.markerZoomCenterPoint.longitude, panel.mapObject.markerZoomCenterPoint.latitude);
        }
        else {
            center = { x: null, y: null };
        }
        let zoomFactorValue = panel.mapObject.zoomSettings.shouldZoomInitially ?
            isNullOrUndefined(panel.mapObject.markerZoomFactor) ? 1 :
                panel.mapObject.markerZoomFactor : panel.mapObject.zoomSettings.zoomFactor;
        zoomFactorValue = (panel.mapObject.enablePersistence) ? ((isNullOrUndefined(panel.mapObject.mapScaleValue))
            ? (isNullOrUndefined(panel.mapObject.markerZoomFactor) ? panel.mapObject.zoomSettings.zoomFactor :
                panel.mapObject.markerZoomFactor) : panel.mapObject.mapScaleValue) : zoomFactorValue;
        zoomFactorValue = panel.mapObject.zoomSettings.enable ? zoomFactorValue : panel.mapObject.zoomSettings.zoomFactor;
        if (isNullOrUndefined(panel.mapObject.tileZoomLevel)) {
            panel.mapObject.tileZoomLevel = zoomFactorValue;
            panel.mapObject.previousZoomFactor = zoomFactorValue;
        }
        else if (this.mapObject.isReset && panel.mapObject.tileZoomLevel === 1 && !panel.mapObject.zoomSettings.shouldZoomInitially) {
            panel.mapObject.tileZoomLevel = panel.mapObject.tileZoomLevel;
        }
        else if (panel.mapObject.zoomSettings.zoomFactor !== 1 || panel.mapObject.zoomSettings.shouldZoomInitially) {
            panel.mapObject.tileZoomLevel = panel.mapObject.defaultState && panel.mapObject.zoomSettings.enable ?
                panel.mapObject.tileZoomLevel : !panel.mapObject.zoomSettings.shouldZoomInitially
                && !panel.mapObject.centerPositionChanged ?
                panel.mapObject.previousZoomFactor !== panel.mapObject.zoomSettings.zoomFactor ?
                    panel.mapObject.zoomSettings.zoomFactor : panel.mapObject.tileZoomLevel : zoomFactorValue;
            if (!isNullOrUndefined(panel.mapObject.tileTranslatePoint) &&
                (panel.mapObject.markerZoomFactor !== panel.mapObject.mapScaleValue
                    || (isNullOrUndefined(panel.mapObject.markerZoomFactor)
                        && isNullOrUndefined(panel.mapObject.mapScaleValue)))
                && (panel.mapObject.zoomSettings.zoomFactor <= 1 || panel.mapObject.previousZoomFactor !==
                    panel.mapObject.zoomSettings.zoomFactor)) {
                panel.mapObject.tileTranslatePoint.x = 0;
                panel.mapObject.tileTranslatePoint.y = 0;
            }
        }
        if (zoomFactorValue <= 1 && !isNullOrUndefined(panel.mapObject.height) && !panel.mapObject.zoomSettings.shouldZoomInitially
            && (panel.mapObject.tileZoomLevel === panel.mapObject.tileZoomScale) && this.mapObject.initialCheck) {
            fixInitialScaleForTile(this.mapObject);
        }
        if (!isNullOrUndefined(panel.mapObject.centerLatOfGivenLocation) && !isNullOrUndefined(panel.mapObject.centerLongOfGivenLocation) &&
            panel.mapObject.zoomNotApplied) {
            centerTileMap.y = panel.mapObject.centerLatOfGivenLocation;
            centerTileMap.x = panel.mapObject.centerLongOfGivenLocation;
            panel.mapObject.tileZoomLevel = panel.mapObject.mapScaleValue = panel.mapObject.scaleOfGivenLocation;
        }
        panel.mapObject.tileTranslatePoint = panel.panTileMap(panel.mapObject.availableSize.width, panel.mapObject.availableSize.height, centerTileMap);
        if (this.mapObject.zoomSettings.resetToInitial && this.mapObject.initialCheck && !isNullOrUndefined(panel.mapObject.height)
            && this.mapObject.availableSize.height > 512) {
            this.mapObject.applyZoomReset = true;
            this.mapObject.initialZoomLevel = Math.floor(this.mapObject.availableSize.height / 512) + 1;
            let padding = this.mapObject.layers[this.mapObject.baseLayerIndex].layerType !== 'GoogleStaticMap' ?
                20 : 0;
            let totalSize = Math.pow(2, this.mapObject.initialZoomLevel) * 256;
            this.mapObject.initialTileTranslate.x = (this.mapObject.availableSize.width / 2) - (totalSize / 2);
            this.mapObject.initialTileTranslate.y = (this.mapObject.availableSize.height / 2) - (totalSize / 2) + padding;
        }
        panel.generateTiles(panel.mapObject.tileZoomLevel, panel.mapObject.tileTranslatePoint, null, bing);
        if (!isNullOrUndefined(panel.mapObject.previousZoomFactor)
            && panel.mapObject.previousZoomFactor !== panel.mapObject.zoomSettings.zoomFactor) {
            panel.mapObject.previousZoomFactor = panel.mapObject.zoomSettings.zoomFactor;
        }
        if (panel.mapObject.navigationLineModule) {
            panel.layerObject.appendChild(panel.mapObject.navigationLineModule.renderNavigation(panel.currentLayer, panel.mapObject.tileZoomLevel, layerIndex));
        }
        if (panel.mapObject.markerModule) {
            panel.mapObject.markerModule.markerRender(panel.layerObject, layerIndex, panel.mapObject.tileZoomLevel, null);
        }
        panel.translateLayerElements(panel.layerObject, layerIndex);
        panel.layerGroup.appendChild(panel.layerObject);
    }
    processLayers(layer, layerIndex) {
        this.layerObject = (this.mapObject.renderer.createGroup({
            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex
        }));
        if (!this.mapObject.enablePersistence) {
            let itemName = this.mapObject.getModuleName() + this.mapObject.element.id;
            if (navigator.userAgent.indexOf('Edge') === -1) {
                if (!isNullOrUndefined(window.localStorage) && window.localStorage.getItem(itemName)) {
                    window.localStorage.removeItem(itemName);
                }
            }
        }
        let eventArgs = {
            cancel: false, name: layerRendering, index: layerIndex,
            layer: layer, maps: this.mapObject, visible: layer.visible
        };
        if (this.mapObject.isBlazor) {
            const { maps, layer } = eventArgs, blazorEventArgs = __rest$2(eventArgs, ["maps", "layer"]);
            eventArgs = blazorEventArgs;
        }
        this.mapObject.trigger('layerRendering', eventArgs, (observedArgs) => {
            if (!eventArgs.cancel && eventArgs.visible) {
                if (layer.layerType !== 'Geometry') {
                    if (layer.layerType !== 'Bing' || this.bing) {
                        this.renderTileLayer(this, layer, layerIndex);
                    }
                    else if (layer.key && layer.key.length > 1) {
                        let proxy = this;
                        let bing = new BingMap(this.mapObject);
                        let bingType = layer.bingMapType === 'AerialWithLabel' ? 'AerialWithLabelsOnDemand' : layer.bingMapType;
                        let url = 'https://dev.virtualearth.net/REST/V1/Imagery/Metadata/' + bingType;
                        let ajax = new Ajax({
                            url: url + '?output=json&include=ImageryProviders&urischeme=https&key=' + layer.key
                        });
                        ajax.onSuccess = (json) => {
                            let jsonObject = JSON.parse(json);
                            let resource = jsonObject['resourceSets'][0]['resources'][0];
                            let imageUrl = resource['imageUrl'];
                            let subDomains = resource['imageUrlSubdomains'];
                            let maxZoom = resource['zoomMax'];
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
                }
                else {
                    if (!isNullOrUndefined(layer.shapeData) && (!isNullOrUndefined(layer.shapeData['geometries']) ||
                        !isNullOrUndefined(layer.shapeData['features']))) {
                        let featureData = (!isNullOrUndefined(layer.shapeData['geometries']) &&
                            layer.shapeData['geometries'].length > 0 ? layer.shapeData['geometries'] :
                            layer.shapeData['features']);
                        layer.layerData = [];
                        let bbox = layer.shapeData['bbox'];
                        if (!isNullOrUndefined(bbox) && layer.isBaseLayer) {
                            this.mapObject.baseMapBounds = new GeoLocation({ min: bbox[0][1], max: bbox[1][1] }, { min: bbox[0][0], max: bbox[1][0] });
                        }
                        else if (isNullOrUndefined(this.mapObject.baseMapBounds) && !isCustomPath(featureData)) {
                            this.calculateRectBounds(featureData);
                        }
                        this.calculatePathCollection(layerIndex, featureData);
                    }
                }
            }
        });
        if (!this.mapObject.isTileMap) {
            this.mapObject.svgObject.appendChild(this.layerGroup);
        }
        else if (this.tileSvgObject) {
            this.tileSvgObject.appendChild(this.layerGroup);
            this.mapObject.baseMapBounds = null;
        }
    }
    //tslint:disable:max-func-body-length
    bubbleCalculation(bubbleSettings, range) {
        if (bubbleSettings.dataSource != null && bubbleSettings != null) {
            for (let i = 0; i < bubbleSettings.dataSource.length; i++) {
                let bubbledata = (!isNullOrUndefined(bubbleSettings.valuePath)) ? ((bubbleSettings.valuePath.indexOf('.') > -1) ?
                    Number(getValueFromObject(bubbleSettings.dataSource[i], bubbleSettings.valuePath)) :
                    parseFloat(bubbleSettings.dataSource[i][bubbleSettings.valuePath])) :
                    parseFloat(bubbleSettings.dataSource[i][bubbleSettings.valuePath]);
                if (i !== 0) {
                    if (bubbledata > range.max) {
                        range.max = bubbledata;
                    }
                    else if (bubbledata < range.min) {
                        range.min = bubbledata;
                    }
                }
                else {
                    range.max = range.min = bubbledata;
                }
            }
        }
    }
    // tslint:disable-next-line:max-func-body-length
    calculatePathCollection(layerIndex, renderData) {
        this.groupElements = [];
        if ((!isCustomPath(renderData))) {
            this.currentFactor = this.calculateFactor(this.currentLayer);
        }
        this.rectBounds = null;
        let shapeSettings = this.currentLayer.shapeSettings;
        let bubbleSettings = this.currentLayer.bubbleSettings;
        Array.prototype.forEach.call(renderData, (geometryData, index) => {
            if (!isNullOrUndefined(geometryData['geometry']) || !isNullOrUndefined(geometryData['coordinates'])) {
                let type = !isNullOrUndefined(geometryData['geometry']) ? geometryData['geometry']['type'] : geometryData['type'];
                let coords = !isNullOrUndefined(geometryData['geometry']) ? geometryData['geometry']['coordinates'] :
                    geometryData['coordinates'];
                let data = geometryData['geometry'];
                let properties = geometryData['properties'];
                this.generatePoints(type, coords, data, properties);
            }
        });
        this.currentLayer.rectBounds = this.rectBounds;
        if (isNullOrUndefined(this.mapObject.baseMapRectBounds) && this.currentLayer.isBaseLayer) {
            this.mapObject.baseMapRectBounds = this.rectBounds;
        }
        let colors = shapeSettings.palette.length > 1 ? shapeSettings.palette : getShapeColor(this.mapObject.theme);
        let labelTemplateEle = createElement('div', {
            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_Label_Template_Group',
            className: 'template',
            styles: 'pointer-events: none; overflow: hidden; position: absolute;' +
                'top:' + this.mapObject.mapAreaRect.y + 'px;' +
                'left:' + this.mapObject.mapAreaRect.x + 'px;' +
                'height:' + this.mapObject.mapAreaRect.height + 'px;' +
                'width:' + this.mapObject.mapAreaRect.width + 'px;'
        });
        if (this.currentLayer.layerData.length !== 0) {
            for (let i = 0; i < this.currentLayer.layerData.length; i++) {
                let k;
                let currentShapeData = this.currentLayer.layerData[i];
                let pathOptions;
                let polyLineOptions;
                let circleOptions;
                let groupElement;
                let path = '';
                let points = '';
                let getShapeColor$$1;
                let fill = (shapeSettings.autofill) ? colors[i % colors.length] : shapeSettings.fill;
                let opacity;
                if (shapeSettings.colorValuePath !== null && !isNullOrUndefined(currentShapeData['property'])) {
                    k = checkShapeDataFields(this.currentLayer.dataSource, currentShapeData['property'], this.currentLayer.shapeDataPath, this.currentLayer.shapePropertyPath, this.currentLayer);
                    if (k !== null && shapeSettings.colorMapping.length === 0) {
                        fill = ((this.currentLayer.shapeSettings.colorValuePath.indexOf('.') > -1) ?
                            (getValueFromObject(this.currentLayer.dataSource[k], shapeSettings.colorValuePath)) :
                            this.currentLayer.dataSource[k][shapeSettings.colorValuePath]);
                    }
                    else if (currentShapeData['property'][shapeSettings.colorValuePath] &&
                        this.currentLayer.dataSource.length === 0 && shapeSettings.colorMapping.length === 0) {
                        fill = ((this.currentLayer.shapeSettings.colorValuePath.indexOf('.') > -1) ?
                            (getValueFromObject(currentShapeData['property'], shapeSettings.colorValuePath)) :
                            currentShapeData['property'][shapeSettings.colorValuePath]);
                    }
                }
                let shapeID = this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + i + '_dataIndex_' + k;
                getShapeColor$$1 = this.getShapeColorMapping(this.currentLayer, currentShapeData['property'], fill);
                fill = Object.prototype.toString.call(getShapeColor$$1) === '[object Object]' && !isNullOrUndefined(getShapeColor$$1['fill'])
                    ? getShapeColor$$1['fill'] : fill;
                opacity = (Object.prototype.toString.call(getShapeColor$$1) === '[object Object]'
                    && !isNullOrUndefined(getShapeColor$$1['opacity'])) ? getShapeColor$$1['opacity'] : shapeSettings.opacity;
                let eventArgs = {
                    cancel: false, name: shapeRendering, index: i,
                    data: this.currentLayer.dataSource ? this.currentLayer.dataSource[k] : null,
                    maps: this.mapObject,
                    shape: shapeSettings, fill: fill,
                    border: { width: shapeSettings.border.width, color: shapeSettings.border.color }
                };
                if (this.mapObject.isBlazor) {
                    const { maps } = eventArgs, blazorEventArgs = __rest$2(eventArgs, ["maps"]);
                    eventArgs = blazorEventArgs;
                }
                // tslint:disable-next-line:max-func-body-length
                let shapeRenderingSuccess = (eventArgs) => {
                    let drawingType = !isNullOrUndefined(currentShapeData['_isMultiPolygon'])
                        ? 'MultiPolygon' : isNullOrUndefined(currentShapeData['type']) ? currentShapeData[0]['type'] : currentShapeData['type'];
                    drawingType = (drawingType === 'Polygon' || drawingType === 'MultiPolygon') ? 'Polygon' : drawingType;
                    if (!eventArgs.cancel) {
                        eventArgs.fill = eventArgs.fill === '#A6A6A6' ? eventArgs.shape.fill : eventArgs.fill;
                        eventArgs.border.color = eventArgs.border.color === '#000000' ? eventArgs.shape.border.color
                            : eventArgs.border.color;
                        eventArgs.border.width = eventArgs.border.width === 0 ? eventArgs.shape.border.width : eventArgs.border.width;
                        this.mapObject.layers[layerIndex].shapeSettings.border = eventArgs.border;
                    }
                    else {
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
                    }
                    else {
                        for (let i = 0; i < this.groupElements.length; i++) {
                            let ele = this.groupElements[i];
                            if (ele.id.indexOf(drawingType) > -1) {
                                groupElement = ele;
                                break;
                            }
                            else if (i >= this.groupElements.length - 1) {
                                groupElement = this.mapObject.renderer.createGroup({
                                    id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_' + drawingType + '_Group'
                                });
                                this.groupElements.push(groupElement);
                                break;
                            }
                        }
                    }
                    let pathEle;
                    switch (drawingType) {
                        case 'Polygon':
                            if (!currentShapeData['_isMultiPolygon']) {
                                path += 'M' + (currentShapeData[0]['point']['x']) + ' ' + (currentShapeData[0]['point']['y']);
                                currentShapeData.map((shapeData) => {
                                    path += ' L ' + (shapeData['point']['x']) + ' ' + (shapeData['point']['y']);
                                });
                            }
                            else {
                                path = this.generateMultiPolygonPath(currentShapeData);
                            }
                            path += ' z ';
                            if (path.length > 3) {
                                pathOptions = new PathOption(shapeID, eventArgs.fill, eventArgs.border.width, eventArgs.border.color, opacity, shapeSettings.dashArray, path);
                                pathEle = this.mapObject.renderer.drawPath(pathOptions);
                            }
                            break;
                        case 'LineString':
                            currentShapeData.map((lineData) => {
                                points += lineData['point']['x'] + ' , ' + lineData['point']['y'] + ' ';
                            });
                            polyLineOptions = new PolylineOption(shapeID, points, eventArgs.fill, eventArgs.border.width, eventArgs.border.color, opacity, shapeSettings.dashArray);
                            pathEle = this.mapObject.renderer.drawPolyline(polyLineOptions);
                            break;
                        case 'Point':
                            let pointData = currentShapeData['point'];
                            circleOptions = new CircleOption(shapeID, eventArgs.fill, eventArgs.border, opacity, pointData['x'], pointData['y'], shapeSettings.circleRadius, null);
                            pathEle = this.mapObject.renderer.drawCircle(circleOptions);
                            break;
                        case 'Path':
                            path = currentShapeData['point'];
                            pathOptions = new PathOption(shapeID, eventArgs.fill, eventArgs.border.width, eventArgs.border.color, opacity, shapeSettings.dashArray, path);
                            pathEle = this.mapObject.renderer.drawPath(pathOptions);
                            break;
                    }
                    if (!isNullOrUndefined(pathEle)) {
                        let property = (Object.prototype.toString.call(this.currentLayer.shapePropertyPath) === '[object Array]' ?
                            this.currentLayer.shapePropertyPath : [this.currentLayer.shapePropertyPath]);
                        // tslint:disable-next-line:align
                        let properties;
                        for (let j = 0; j < property.length; j++) {
                            if (!isNullOrUndefined(currentShapeData['property'])) {
                                properties = property[j];
                                break;
                            }
                        }
                        pathEle.setAttribute('aria-label', ((!isNullOrUndefined(currentShapeData['property'])) ?
                            (currentShapeData['property'][properties]) : ''));
                        pathEle.setAttribute('tabindex', (this.mapObject.tabIndex + i + 2).toString());
                        maintainSelection(this.mapObject.selectedElementId, this.mapObject.shapeSelectionClass, pathEle, 'ShapeselectionMapStyle');
                        if (this.mapObject.toggledShapeElementId) {
                            for (let j = 0; j < this.mapObject.toggledShapeElementId.length; j++) {
                                let styleProperty = this.mapObject.legendSettings.toggleLegendSettings.applyShapeSettings ?
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
        }
        else {
            this.layerFeatures(layerIndex, colors, renderData, labelTemplateEle);
        }
    }
    /**
     *  layer features as bubble, marker, datalabel, navigation line.
     */
    layerFeatures(layerIndex, colors, renderData, labelTemplateEle) {
        let bubbleG;
        if (this.currentLayer.bubbleSettings.length && this.mapObject.bubbleModule) {
            let length = this.currentLayer.bubbleSettings.length;
            let bubble;
            for (let j = 0; j < length; j++) {
                bubble = this.currentLayer.bubbleSettings[j];
                bubbleG = this.mapObject.renderer.createGroup({
                    id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_bubble_Group_' + j
                });
                let range = { min: 0, max: 0 };
                this.bubbleCalculation(bubble, range);
                bubble.dataSource.map((bubbleData, i) => {
                    this.renderBubble(this.currentLayer, bubbleData, colors[i % colors.length], range, j, i, bubbleG, layerIndex, bubble);
                });
                this.groupElements.push(bubbleG);
            }
        }
        if ((this.mapObject.markerModule && !this.mapObject.isTileMap) && this.mapObject.zoomSettings.enable) {
            this.mapObject.markerModule.calculateZoomCenterPositionAndFactor(this.mapObject.layersCollection);
        }
        let group = (this.mapObject.renderer.createGroup({
            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_dataLableIndex_Group',
            style: 'pointer-events: none;'
        }));
        if (this.mapObject.dataLabelModule && this.currentLayer.dataLabelSettings.visible) {
            let intersect = [];
            renderData.map((currentShapeData, i) => {
                this.renderLabel(this.currentLayer, layerIndex, currentShapeData, group, i, labelTemplateEle, intersect);
            });
            this.groupElements.push(group);
        }
        if (this.mapObject.navigationLineModule) {
            this.groupElements.push(this.mapObject.navigationLineModule.renderNavigation(this.currentLayer, this.currentFactor, layerIndex));
        }
        this.groupElements.map((element) => {
            this.layerObject.appendChild(element);
        });
        if (this.mapObject.markerModule) {
            this.mapObject.markerModule.markerRender(this.layerObject, layerIndex, (this.mapObject.isTileMap ? Math.floor(this.currentFactor)
                : this.currentFactor), null);
        }
        this.translateLayerElements(this.layerObject, layerIndex);
        this.layerGroup.appendChild(this.layerObject);
    }
    /**
     *  render datalabel
     */
    renderLabel(layer, layerIndex, shape, group, shapeIndex, labelTemplateEle, intersect) {
        this.mapObject.dataLabelModule.renderLabel(layer, layerIndex, shape, layer.layerData, group, labelTemplateEle, shapeIndex, intersect);
    }
    /**
     * To render path for multipolygon
     */
    generateMultiPolygonPath(currentShapeData) {
        let path = '';
        let shape;
        for (let j = 0; j < currentShapeData.length; j++) {
            path += 'M' + (currentShapeData[j][0]['point']['x']) + ' ' + (currentShapeData[j][0]['point']['y']);
            shape = currentShapeData[j];
            shape.map((shapeData) => {
                path += ' L ' + (shapeData['point']['x']) + ' ' + (shapeData['point']['y']);
            });
        }
        return path;
    }
    /**
     * To render bubble
     */
    renderBubble(layer, bubbleData, color, range, bubbleIndex, dataIndex, group, layerIndex, bubbleSettings) {
        if (isNullOrUndefined(this.mapObject.bubbleModule) || !bubbleSettings.visible) {
            return null;
        }
        color = bubbleSettings.fill ? bubbleSettings.fill : color;
        this.mapObject.bubbleModule.id = this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_BubbleIndex_' +
            bubbleIndex + '_dataIndex_' + dataIndex;
        this.mapObject.bubbleModule.renderBubble(bubbleSettings, bubbleData, color, range, bubbleIndex, dataIndex, layerIndex, layer, group, this.mapObject.bubbleModule.id);
    }
    /**
     * To get the shape color from color mapping module
     */
    getShapeColorMapping(layer, shape, color) {
        color = color ? color : layer.shapeSettings.fill;
        if (layer.shapeSettings.colorMapping.length === 0 && isNullOrUndefined(layer.dataSource)) {
            return color;
        }
        let index = checkShapeDataFields(layer.dataSource, shape, layer.shapeDataPath, layer.shapePropertyPath, layer);
        let colorMapping = new ColorMapping(this.mapObject);
        if (isNullOrUndefined(layer.dataSource[index])) {
            return color;
        }
        return colorMapping.getShapeColorMapping(layer.shapeSettings, layer.dataSource[index], color);
    }
    generatePoints(type, coordinates, data, properties) {
        let latitude;
        let longitude;
        let newData = [];
        switch (type.toLowerCase()) {
            case 'polygon':
                newData = this.calculatePolygonBox(coordinates[0], data, properties);
                if (newData.length > 0) {
                    newData['property'] = properties;
                    newData['type'] = type;
                    newData['_isMultiPolygon'] = false;
                    this.currentLayer.layerData.push(newData);
                }
                break;
            case 'multipolygon':
                let multiPolygonDatas = [];
                for (let i = 0; i < coordinates.length; i++) {
                    newData = this.calculatePolygonBox(coordinates[i][0], data, properties);
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
                coordinates.map((points, index) => {
                    latitude = points[1];
                    longitude = points[0];
                    let point = convertGeoToPoint(latitude, longitude, this.currentFactor, this.currentLayer, this.mapObject);
                    newData.push({
                        point: point, lat: latitude, lng: longitude
                    });
                });
                newData['property'] = properties;
                newData['type'] = type;
                this.currentLayer.layerData.push(newData);
                break;
            case 'point':
                let arrayCollections = false;
                coordinates.map((points, index) => {
                    if (Object.prototype.toString.call(points) === '[object Array]') {
                        latitude = points[1];
                        longitude = points[0];
                        arrayCollections = true;
                        let point = convertGeoToPoint(latitude, longitude, this.currentFactor, this.currentLayer, this.mapObject);
                        this.currentLayer.layerData.push({
                            point: point, type: type, lat: latitude, lng: longitude, property: properties
                        });
                    }
                });
                if (!arrayCollections) {
                    latitude = coordinates[1];
                    longitude = coordinates[0];
                    let point = convertGeoToPoint(latitude, longitude, this.currentFactor, this.currentLayer, this.mapObject);
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
    calculateFactor(layer) {
        let horFactor;
        let verFactor = 1;
        let divide = 10;
        let exp = 'e+1';
        let bounds = this.mapObject.baseMapBounds;
        let mapSize = new Size(this.mapObject.mapAreaRect.width, this.mapObject.mapAreaRect.height - 5);
        let mapHeight;
        let mapWidth;
        if (bounds) {
            let start = convertGeoToPoint(bounds.latitude.min, bounds.longitude.min, null, layer, this.mapObject);
            let end = convertGeoToPoint(bounds.latitude.max, bounds.longitude.max, null, layer, this.mapObject);
            mapHeight = end.y - start.y;
            mapWidth = end.x - start.x;
        }
        else {
            mapHeight = mapWidth = 500;
        }
        if (mapHeight < mapSize.height) {
            horFactor = parseFloat(Math.abs(Number(mapSize.height / Number(mapHeight.toString() + exp)) * 100).toString().split('.')[0])
                / divide;
        }
        else {
            horFactor = mapSize.height / mapHeight;
        }
        if (mapWidth < mapSize.width) {
            verFactor = parseFloat(Math.abs(Number(mapSize.width / Number(mapWidth.toString() + exp)) * 100).toString().split('.')[0])
                / divide;
        }
        else {
            verFactor = mapSize.width / mapWidth;
        }
        return (Math.min(verFactor, horFactor));
    }
    translateLayerElements(layerElement, index) {
        let childNode;
        this.mapObject.translateType = 'layer';
        if (!isNullOrUndefined(this.mapObject.baseMapRectBounds)) {
            let duration = this.currentLayer.animationDuration;
            let animate$$1 = duration !== 0 || isNullOrUndefined(this.mapObject.zoomModule);
            this.mapObject.baseTranslatePoint = this.mapObject.zoomTranslatePoint;
            let translate;
            if (this.mapObject.zoomSettings.zoomFactor > 1 && !isNullOrUndefined(this.mapObject.zoomModule)) {
                translate = getZoomTranslate(this.mapObject, this.currentLayer, animate$$1);
            }
            else {
                translate = getTranslate(this.mapObject, this.currentLayer, animate$$1);
            }
            let scale = this.mapObject.previousScale = translate['scale'];
            let location = this.mapObject.previousPoint = translate['location'];
            this.mapObject.baseTranslatePoint = this.mapObject.translatePoint = location;
            this.mapObject.baseScale = this.mapObject.scale = scale;
            for (let i = 0; i < layerElement.childElementCount; i++) {
                childNode = layerElement.childNodes[i];
                if (!(childNode.id.indexOf('_Markers_Group') > -1) &&
                    (!(childNode.id.indexOf('_bubble_Group') > -1)) &&
                    (!(childNode.id.indexOf('_dataLableIndex_Group') > -1))) {
                    let transform = 'scale( ' + scale + ' ) '
                        + 'translate( ' + location.x + ' ' + location.y + ' ) ';
                    childNode.setAttribute('transform', transform);
                    if (duration > 0 && !isNullOrUndefined(this.mapObject.zoomModule)) {
                        if (this.mapObject.zoomSettings.zoomFactor > 1) {
                            translate = getZoomTranslate(this.mapObject, this.currentLayer);
                        }
                        else {
                            translate = getTranslate(this.mapObject, this.currentLayer);
                        }
                        this.mapObject.scale = translate['scale'];
                        this.mapObject.zoomTranslatePoint = this.mapObject.translatePoint = translate['location'];
                    }
                }
            }
        }
        else if (this.mapObject.isTileMap && !isNullOrUndefined(this.mapObject.scale)) {
            for (let j = 0; j < layerElement.childElementCount; j++) {
                childNode = layerElement.childNodes[j];
                if (!(childNode.id.indexOf('_Markers_Group') > -1) &&
                    (!(childNode.id.indexOf('_bubble_Group') > -1)) &&
                    (!(childNode.id.indexOf('_dataLableIndex_Group') > -1)) &&
                    (!(childNode.id.indexOf('_line_Group') > -1))) {
                    let transform = 'scale( ' + this.mapObject.scale + ' ) ' + 'translate( ' + this.mapObject.translatePoint.x
                        + ' ' + this.mapObject.translatePoint.y + ' ) ';
                    childNode.setAttribute('transform', transform);
                }
            }
        }
    }
    calculateRectBounds(layerData) {
        Array.prototype.forEach.call(layerData, (obj, index) => {
            if (!isNullOrUndefined(obj['geometry']) || !isNullOrUndefined(obj['coordinates'])) {
                let type = !isNullOrUndefined(obj['geometry']) ? obj['geometry']['type'] : obj['type'];
                let coordinates = !isNullOrUndefined(obj['geometry']) ? obj['geometry']['coordinates'] : obj['coordinates'];
                switch (type.toLowerCase()) {
                    case 'polygon':
                        this.calculateRectBox(coordinates[0]);
                        break;
                    case 'multipolygon':
                        coordinates.map((point, index) => {
                            this.calculateRectBox(point[0]);
                        });
                        break;
                }
            }
        });
    }
    calculatePolygonBox(coordinates, data, properties) {
        let newData = [];
        let bounds = this.mapObject.baseMapBounds;
        coordinates.map((currentPoint, index) => {
            let latitude = currentPoint[1];
            let longitude = currentPoint[0];
            if ((longitude >= bounds.longitude.min && longitude <= bounds.longitude.max)
                && (latitude >= bounds.latitude.min && latitude <= bounds.latitude.max)) {
                let point = convertGeoToPoint(latitude, longitude, this.currentFactor, this.currentLayer, this.mapObject);
                if (isNullOrUndefined(this.rectBounds)) {
                    this.rectBounds = { min: { x: point.x, y: point.y }, max: { x: point.x, y: point.y } };
                }
                else {
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
    calculateRectBox(coordinates) {
        Array.prototype.forEach.call(coordinates, (currentCoords) => {
            if (isNullOrUndefined(this.mapObject.baseMapBounds)) {
                this.mapObject.baseMapBounds = new GeoLocation({ min: currentCoords[1], max: currentCoords[1] }, { min: currentCoords[0], max: currentCoords[0] });
            }
            else {
                this.mapObject.baseMapBounds.latitude.min = Math.min(this.mapObject.baseMapBounds.latitude.min, currentCoords[1]);
                this.mapObject.baseMapBounds.latitude.max = Math.max(this.mapObject.baseMapBounds.latitude.max, currentCoords[1]);
                this.mapObject.baseMapBounds.longitude.min = Math.min(this.mapObject.baseMapBounds.longitude.min, currentCoords[0]);
                this.mapObject.baseMapBounds.longitude.max = Math.max(this.mapObject.baseMapBounds.longitude.max, currentCoords[0]);
            }
        });
    }
    generateTiles(zoomLevel, tileTranslatePoint, zoomType, bing, position) {
        let userLang = this.mapObject.locale;
        let size = this.mapObject.availableSize;
        this.tiles = [];
        let xcount;
        let ycount;
        xcount = ycount = Math.pow(2, zoomLevel);
        let xLeft = 0;
        let xRight = 0;
        if ((tileTranslatePoint.x + (xcount * 256)) < size.width) {
            xLeft = tileTranslatePoint.x > 0 ? Math.ceil(tileTranslatePoint.x / 256) : 0;
            xRight = ((tileTranslatePoint.x + xcount * 256) < size.width) ?
                Math.ceil((size.width - (tileTranslatePoint.x + xcount * 256)) / 256) : 0;
        }
        xcount += xLeft + xRight;
        if (zoomType === 'Pan') {
            xcount = (this.horizontalPanXCount >= xcount) ? this.horizontalPanXCount : xcount;
            this.horizontalPan = false;
        }
        else {
            this.horizontalPanXCount = xcount;
            this.horizontalPan = true;
        }
        let baseLayer = this.mapObject.layers[this.mapObject.baseLayerIndex];
        this.urlTemplate = baseLayer.urlTemplate;
        let endY = Math.min(ycount, ((-tileTranslatePoint.y + size.height) / 256) + 1);
        let endX = Math.min(xcount, ((-tileTranslatePoint.x + size.width + (xRight * 256)) / 256) + 1);
        let startX = (-((tileTranslatePoint.x + (xLeft * 256)) + 256) / 256);
        let startY = (-(tileTranslatePoint.y + 256) / 256);
        bing = bing || this.bing || this.mapObject['bingMap'];
        for (let i = Math.round(startX); i < Math.round(endX); i++) {
            for (let j = Math.round(startY); j < Math.round(endY); j++) {
                let x = 256 * i + tileTranslatePoint.x;
                let y = 256 * j + tileTranslatePoint.y;
                if (x > -256 && x <= size.width && y > -256 && y < size.height) {
                    if (j >= 0) {
                        let tileI = i;
                        if (i < 0) {
                            tileI = (tileI % ycount) + ycount;
                        }
                        let tile = new Tile(tileI % ycount, j);
                        tile.left = x;
                        tile.top = y;
                        if (baseLayer.layerType === 'Bing') {
                            let key = baseLayer.key;
                            tile.src = bing.getBingMap(tile, key, baseLayer.bingMapType, userLang, bing.imageUrl, bing.subDomains);
                        }
                        else {
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
            }
            else {
                this.animateToZoomX = -10;
                this.animateToZoomY = -(this.mapObject.availableSize.height / 2 + 11.5) + 10;
            }
        }
        let proxTiles = extend([], this.tiles, [], true);
        for (let layer of this.mapObject.layers) {
            if (!(layer.type === 'SubLayer' && layer.visible)) {
                continue;
            }
            if (layer.layerType === 'OSM' || layer.layerType === 'Bing') {
                for (let baseTile of proxTiles) {
                    let subtile = extend(baseTile, {}, {}, true);
                    if (layer.layerType === 'Bing') {
                        subtile.src = bing.getBingMap(subtile, layer.key, layer.bingMapType, userLang, bing.imageUrl, bing.subDomains);
                    }
                    else {
                        subtile.src = layer.urlTemplate.replace('level', zoomLevel.toString()).replace('tileX', baseTile.x.toString())
                            .replace('tileY', baseTile.y.toString());
                    }
                    this.tiles.push(subtile);
                }
            }
        }
        this.arrangeTiles(zoomType, this.animateToZoomX, this.animateToZoomY);
    }
    arrangeTiles(type, x, y) {
        let element = document.getElementById(this.mapObject.element.id + '_tile_parent');
        let element1 = document.getElementById(this.mapObject.element.id + '_tiles');
        let timeOut;
        if (!isNullOrUndefined(type) && type !== 'Pan' && type !== 'Reset' && type.indexOf('ZoomOut') === -1) {
            this.tileAnimation(type, x, y);
            timeOut = 250;
        }
        else {
            timeOut = 0;
        }
        if (this.mapObject.layers[this.mapObject.baseLayerIndex].layerType === 'GoogleStaticMap') {
            this.renderGoogleMap(this.mapObject.layers[0].key, this.mapObject.staticMapZoom);
        }
        else {
            setTimeout(() => {
                if (element) {
                    element.style.zIndex = '1';
                }
                if (element1) {
                    element1.style.zIndex = '0';
                    element1.style.visibility = 'hidden';
                }
                let animateElement;
                if (!document.getElementById('animated_tiles') && element) {
                    animateElement = createElement('div', { id: 'animated_tiles' });
                    element.appendChild(animateElement);
                }
                else {
                    if (type !== 'Pan' && element1 && element) {
                        element1.appendChild(element.children[0]);
                        animateElement = createElement('div', { id: 'animated_tiles' });
                        element.appendChild(animateElement);
                    }
                    else {
                        animateElement = element ? element.children[0] : null;
                    }
                }
                let id = 0;
                for (let tile of this.tiles) {
                    let imgElement = createElement('img');
                    imgElement.setAttribute('src', tile.src);
                    let child;
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
    tileAnimation(zoomType, translateX, translateY) {
        let element = document.getElementById(this.mapObject.element.id + '_tile_parent');
        let element1 = document.getElementById('animated_tiles');
        let ele = document.getElementById(this.mapObject.element.id + '_tiles');
        let scaleValue = '2';
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
        }
        else if (zoomType === 'Reset') {
            ele.style.zIndex = '1';
            element.style.zIndex = '0';
            while (!(ele.childElementCount === 1) && !(ele.childElementCount === 0)) {
                ele.removeChild(ele.children[1]);
            }
            element1 = ele.children[0];
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
    renderGoogleMap(apikey, zoom) {
        let staticMapString;
        let map = this.mapObject;
        // zoom = this.mapObject.zoomSettings.shouldZoomInitially ? this.mapObject.markerZoomFactor : zoom;
        zoom = this.mapObject.tileZoomLevel;
        let x;
        let y;
        let totalSize = Math.pow(2, zoom) * 256;
        x = (map.mapAreaRect.width / 2) - (totalSize / 2);
        y = (map.mapAreaRect.height / 2) - (totalSize / 2);
        let centerPoint = new Point(null, null);
        let diffX = 0;
        let diffY = 0;
        let position = convertTileLatLongToPoint(centerPoint, zoom, { x: x, y: y }, this.isMapCoordinates);
        if (map.zoomModule && map.zoomSettings.enable) {
            diffX = map.zoomModule.mouseDownLatLong['x'] - map.zoomModule.mouseMoveLatLong['x'];
            diffY = map.zoomModule.mouseDownLatLong['y'] - map.zoomModule.mouseMoveLatLong['y'];
        }
        let panLatLng = map.pointToLatLong(position.x - diffX, position.y - diffY);
        map.centerPosition.latitude = panLatLng['latitude'];
        map.centerPosition.longitude = panLatLng['longitude'];
        let mapWidth;
        let mapHeight;
        if (isNullOrUndefined(parseInt(map.width, 10))) {
            mapWidth = parseInt(map.width, 10) - 22;
        }
        else {
            mapWidth = Math.round(map.mapAreaRect.width);
        }
        if (isNullOrUndefined(parseInt(map.height, 10))) {
            mapHeight = parseInt(map.height, 10) - 22;
        }
        else {
            mapHeight = Math.round(map.mapAreaRect.height);
        }
        let eleWidth = mapWidth > 640 ? (mapWidth - 640) / 2 : 0;
        let eleHeight = mapHeight > 640 ? (mapHeight - 640) / 2 : 0;
        let center;
        let mapType = (map.layers[map.layers.length - 1].staticMapType).toString().toLowerCase();
        if (map.centerPosition.latitude && map.centerPosition.longitude) {
            center = map.centerPosition.latitude.toString() + ',' + map.centerPosition.longitude.toString();
        }
        else {
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
    panTileMap(factorX, factorY, centerPosition) {
        if (this.mapObject.tileZoomLevel <= this.mapObject.tileZoomScale && this.mapObject.initialCheck) {
            this.mapObject.tileZoomLevel = this.mapObject.tileZoomScale;
        }
        let level = this.mapObject.tileZoomLevel;
        let padding = this.mapObject.layers[this.mapObject.layers.length - 1].layerType !== 'GoogleStaticMap' ?
            20 : 0;
        let x;
        let y;
        let totalSize = Math.pow(2, level) * 256;
        x = (factorX / 2) - (totalSize / 2);
        y = (factorY / 2) - (totalSize / 2);
        let position = convertTileLatLongToPoint(centerPosition, level, { x: x, y: y }, this.isMapCoordinates);
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
        if (!isNullOrUndefined(this.mapObject.tileTranslatePoint) && (isNullOrUndefined(centerPosition.x)) &&
            (this.mapObject.zoomSettings.zoomFactor === 1 ||
                this.mapObject.zoomSettings.zoomFactor !== level || !this.mapObject.defaultState)) {
            if ((factorX !== this.mapObject.previousTileWidth || factorY !== this.mapObject.previousTileHeight)) {
                let xdiff = x - ((this.mapObject.previousTileWidth / 2) - (totalSize / 2));
                let ydiff = y - ((this.mapObject.previousTileHeight / 2) - (totalSize / 2) + padding);
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
        this.mapObject.translatePoint = new Point((x - (0.01 * this.mapObject.scale)) / this.mapObject.scale, (y - (0.01 * this.mapObject.scale)) / this.mapObject.scale);
        this.mapObject.previousTileWidth = factorX;
        this.mapObject.previousTileHeight = factorY;
        return new Point(x, y);
    }
}

/**
 * Represents the annotation elements for map.
 */
class Annotations {
    constructor(map) {
        this.map = map;
    }
    renderAnnotationElements() {
        let secondaryID = this.map.element.id + '_Secondary_Element';
        let annotationGroup = createElement('div', { id: this.map.element.id + '_Annotations_Group' });
        annotationGroup.style.position = 'absolute';
        annotationGroup.style.top = '0px';
        annotationGroup.style.left = '0px';
        this.map.annotations.map((annotation, index) => {
            if (annotation.content !== null) {
                this.createAnnotationTemplate(annotationGroup, annotation, index);
            }
        });
        if (annotationGroup.childElementCount > 0 && !(isNullOrUndefined(getElementByID(secondaryID)))) {
            getElementByID(secondaryID).appendChild(annotationGroup);
            for (let i = 0; i < this.map.annotations.length; i++) {
                updateBlazorTemplate(this.map.element.id + '_ContentTemplate_' + i, 'ContentTemplate', this.map.annotations[i]);
            }
        }
    }
    /**
     * To create annotation elements
     */
    createAnnotationTemplate(parentElement, annotation, annotationIndex) {
        let left;
        let top;
        let templateFn;
        let map = this.map;
        let templateElement;
        let availSize = map.availableSize;
        let id = map.element.id + '_Annotation_' + annotationIndex;
        let childElement = createElement('div', {
            id: map.element.id + '_Annotation_' + annotationIndex, styles: 'position: absolute; z-index:' + annotation.zIndex + ';'
        });
        let argsData = {
            cancel: false, name: annotationRendering, content: annotation.content,
            annotation: annotation
        };
        this.map.trigger(annotationRendering, argsData, (annotationArgs) => {
            if (argsData.cancel) {
                return;
            }
            let blazor = 'Blazor';
            templateFn = getTemplateFunction(argsData.content);
            if (templateFn && (!window[blazor] ? templateFn(this.map, null, null, this.map.element.id + '_ContentTemplate_' + annotationIndex).length : {})) {
                templateElement = Array.prototype.slice.call(templateFn(!window[blazor] ? this.map : {}, null, null, this.map.element.id + '_ContentTemplate_' + annotationIndex));
                let length = templateElement.length;
                for (let i = 0; i < length; i++) {
                    childElement.appendChild(templateElement[i]);
                }
            }
            else {
                childElement.appendChild(createElement('div', {
                    innerHTML: argsData.content
                }));
            }
        });
        let offset = getElementOffset(childElement.cloneNode(true), map.element);
        let elementRect = map.element.getBoundingClientRect();
        let bounds = map.svgObject.getBoundingClientRect();
        left = Math.abs(bounds.left - elementRect.left);
        top = Math.abs(bounds.top - elementRect.top);
        let annotationXValue = (annotation.x.indexOf('%') > -1) ? (availSize.width / 100) * parseFloat(annotation.x) :
            parseFloat(annotation.x);
        let annotationYValue = (annotation.y.indexOf('%') > -1) ? (availSize.height / 100) * parseFloat(annotation.y) :
            parseFloat(annotation.y);
        left = (annotation.horizontalAlignment === 'None') ? (left + annotationXValue) : left;
        top = (annotation.verticalAlignment === 'None') ? (top + annotationYValue) : top;
        switch (annotation.verticalAlignment) {
            case 'Near':
                top = (top + annotationYValue);
                break;
            case 'Center':
                top = (top + annotationYValue) + ((bounds.height / 2) - (offset.height / 2));
                break;
            case 'Far':
                top = (top + bounds.height + annotationYValue) - offset.height;
                break;
        }
        switch (annotation.horizontalAlignment) {
            case 'Near':
                left = (left + annotationXValue);
                break;
            case 'Center':
                left = (left + annotationXValue) + ((bounds.width / 2) - (offset.width / 2));
                break;
            case 'Far':
                left = (left + bounds.width + annotationXValue) - offset.width;
                break;
        }
        childElement.style.left = left + 'px';
        childElement.style.top = top + 'px';
        parentElement.appendChild(childElement);
    }
    /*
   * Get module name.
   */
    getModuleName() {
        return 'Annotations';
    }
    /**
     * To destroy the annotation.
     * @return {void}
     * @private
     */
    destroy(map) {
        // Destroy method performed here
    }
}

/**
 * Annotation Module handles the Annotation for Maps
 */
class ExportUtils {
    /**
     * Constructor for Maps
     * @param control
     */
    constructor(control) {
        this.control = control;
    }
    /**
     * To print the Maps
     * @param elements
     */
    print(elements) {
        this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWindow.moveTo(0, 0);
        this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
        let argsData = {
            cancel: false, htmlContent: this.getHTMLContent(elements), name: beforePrint
        };
        this.control.trigger('beforePrint', argsData, (beforePrintArgs) => {
            if (!argsData.cancel) {
                print(argsData.htmlContent, this.printWindow);
            }
        });
    }
    /**
     * To get the html string of the Maps
     * @param elements
     * @private
     */
    getHTMLContent(elements) {
        let div = createElement('div');
        if (elements) {
            if (elements instanceof Array) {
                Array.prototype.forEach.call(elements, (value) => {
                    div.appendChild(getElement(value).cloneNode(true));
                });
            }
            else if (elements instanceof Element) {
                div.appendChild(elements.cloneNode(true));
            }
            else {
                div.appendChild(getElement(elements).cloneNode(true));
            }
        }
        else {
            div.appendChild(this.control.element.cloneNode(true));
        }
        return div;
    }
    /**
     * To export the file as image/svg format
     * @param type
     * @param fileName
     */
    export(type, fileName, exportDownload, orientation) {
        // tslint:disable-next-line:max-func-body-length
        let promise = new Promise((resolve, reject) => {
            let canvasElement = createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': this.control.availableSize.width.toString(),
                    'height': this.control.availableSize.height.toString()
                }
            });
            let isDownload = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
            let toolbarEle = document.getElementById(this.control.element.id + '_ToolBar');
            let svgParent = document.getElementById(this.control.element.id + '_Tile_SVG_Parent');
            let svgData;
            if (!this.control.isTileMap) {
                svgData = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    this.control.svgObject.outerHTML + '</svg>';
            }
            else {
                let tileSvg = document.getElementById(this.control.element.id + '_Tile_SVG');
                svgData = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    this.control.svgObject.outerHTML + tileSvg.outerHTML + '</svg>';
            }
            let url = window.URL.createObjectURL(new Blob(type === 'SVG' ? [svgData] :
                [(new XMLSerializer()).serializeToString(this.control.svgObject)], { type: 'image/svg+xml' }));
            if (type === 'SVG') {
                if (exportDownload) {
                    this.triggerDownload(fileName, type, url, isDownload);
                }
                else {
                    resolve(null);
                }
            }
            else {
                let pdfDocument = new PdfDocument();
                let image = new Image();
                let ctx = canvasElement.getContext('2d');
                if (!this.control.isTileMap) {
                    image.onload = (() => {
                        ctx.drawImage(image, 0, 0);
                        window.URL.revokeObjectURL(url);
                        if (type === 'PDF') {
                            let imageString = canvasElement.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                            pdfDocument.pageSettings.orientation = orientation;
                            imageString = imageString.slice(imageString.indexOf(',') + 1);
                            pdfDocument.pages.add().graphics.drawImage(new PdfBitmap(imageString), 0, 0, (this.control.availableSize.width - 60), this.control.availableSize.height);
                            if (exportDownload) {
                                pdfDocument.save(fileName + '.pdf');
                                pdfDocument.destroy();
                            }
                            else {
                                resolve(null);
                            }
                        }
                        else {
                            if (exportDownload) {
                                this.triggerDownload(fileName, type, canvasElement.toDataURL('image/png').replace('image/png', 'image/octet-stream'), isDownload);
                            }
                            else {
                                resolve(canvasElement.toDataURL('image/png'));
                            }
                        }
                    });
                    image.src = url;
                }
                else {
                    let xHttp = new XMLHttpRequest();
                    let tileLength = this.control.mapLayerPanel.tiles.length;
                    for (let i = 0; i <= tileLength + 1; i++) {
                        let tile = document.getElementById('tile_' + (i - 1));
                        let tileImg = new Image();
                        tileImg.crossOrigin = 'Anonymous';
                        ctx.fillStyle = this.control.background ? this.control.background : '#FFFFFF';
                        ctx.fillRect(0, 0, this.control.availableSize.width, this.control.availableSize.height);
                        ctx.font = this.control.titleSettings.textStyle.size + ' Arial';
                        ctx.fillStyle = document.getElementById(this.control.element.id + '_Map_title').getAttribute('fill');
                        ctx.fillText(this.control.titleSettings.text, parseFloat(document.getElementById(this.control.element.id + '_Map_title').getAttribute('x')), parseFloat(document.getElementById(this.control.element.id + '_Map_title').getAttribute('y')));
                        tileImg.onload = (() => {
                            if (i === 0 || i === tileLength + 1) {
                                if (i === 0) {
                                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                                    ctx.rect(0, parseFloat(svgParent.style.top), parseFloat(svgParent.style.width), parseFloat(svgParent.style.height));
                                    ctx.clip();
                                }
                                else {
                                    ctx.setTransform(1, 0, 0, 1, parseFloat(svgParent.style.left), parseFloat(svgParent.style.top));
                                }
                            }
                            else {
                                ctx.setTransform(1, 0, 0, 1, parseFloat(tile.style.left) + 10, parseFloat(tile.style.top) +
                                    (parseFloat(document.getElementById(this.control.element.id + '_tile_parent').style.top)));
                            }
                            ctx.drawImage(tileImg, 0, 0);
                            if (i === tileLength + 1) {
                                if (type === 'PDF') {
                                    localStorage.setItem('saved-image-example', canvasElement.toDataURL('image/jpeg'));
                                    let x = localStorage.getItem('saved-image-example');
                                    pdfDocument.pageSettings.orientation = orientation;
                                    x = x.slice(x.indexOf(',') + 1);
                                    pdfDocument.pages.add().graphics.drawImage(new PdfBitmap(x), 0, 0, (this.control.availableSize.width - 60), this.control.availableSize.height);
                                    if (exportDownload) {
                                        pdfDocument.save(fileName + '.pdf');
                                        pdfDocument.destroy();
                                    }
                                    else {
                                        resolve(null);
                                    }
                                }
                                else {
                                    localStorage.setItem('local-canvasImage', canvasElement.toDataURL('image/png'));
                                    let localBase64 = localStorage.getItem('local-canvasImage');
                                    if (exportDownload) {
                                        this.triggerDownload(fileName, type, localBase64, isDownload);
                                        localStorage.removeItem('local-canvasImage');
                                    }
                                    else {
                                        resolve(localBase64);
                                    }
                                }
                            }
                        });
                        if (i === 0 || i === tileLength + 1) {
                            if (i === 0) {
                                tileImg.src = url;
                            }
                            else {
                                setTimeout(() => {
                                    tileImg.src = window.URL.createObjectURL(new Blob([(new XMLSerializer()).serializeToString(document.getElementById(this.control.element.id + '_Tile_SVG'))], { type: 'image/svg+xml' }));
                                    // tslint:disable-next-line:align
                                }, 300);
                            }
                        }
                        else {
                            xHttp.open('GET', tile.children[0].getAttribute('src'), true);
                            xHttp.send();
                            tileImg.src = tile.children[0].getAttribute('src');
                        }
                    }
                }
            }
        });
        return promise;
    }
    /**
     * To trigger the download element
     * @param fileName
     * @param type
     * @param url
     */
    triggerDownload(fileName, type, url, isDownload) {
        createElement('a', {
            attrs: {
                'download': fileName + '.' + type.toLocaleLowerCase(),
                'href': url
            }
        }).dispatchEvent(new MouseEvent(isDownload ? 'click' : 'move', {
            view: window,
            bubbles: false,
            cancelable: true
        }));
    }
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Maps Component file
 */
/**
 * Represents the Maps control.
 * ```html
 * <div id="maps"/>
 * <script>
 *   var maps = new Maps();
 *   maps.appendTo("#maps");
 * </script>
 * ```
 */
let Maps = class Maps extends Component {
    /**
     * Constructor for creating the widget
     */
    constructor(options, element) {
        super(options, element);
        /**
         * Check layer whether is geometry or tile
         * @private
         */
        this.isTileMap = false;
        /** @private */
        this.baseSize = new Size(0, 0);
        /** @public */
        this.translatePoint = new Point(0, 0);
        /** @private */
        this.baseTranslatePoint = new Point(0, 0);
        /** @public */
        this.zoomTranslatePoint = new Point(0, 0);
        /** @private */
        this.markerZoomedState = true;
        /** @private */
        this.zoomPersistence = false;
        /** @private */
        this.defaultState = true;
        /** @private */
        this.centerPositionChanged = false;
        /** @private */
        this.isTileMapSubLayer = false;
        /** @private */
        this.markerNullCount = 0;
        /** @private */
        this.tileTranslatePoint = new Point(0, 0);
        /** @private */
        this.baseTileTranslatePoint = new Point(0, 0);
        /** @private */
        this.isDevice = false;
        /** @private */
        this.staticMapZoom = this.zoomSettings.enable ? this.zoomSettings.zoomFactor : 0;
        /** @private */
        this.zoomNotApplied = false;
        /** @public */
        this.dataLabelShape = [];
        this.zoomShapeCollection = [];
        this.zoomLabelPositions = [];
        this.mouseDownEvent = { x: null, y: null };
        this.mouseClickEvent = { x: null, y: null };
        /** @private */
        this.selectedElementId = [];
        /** @private */
        this.selectedMarkerElementId = [];
        /** @private */
        this.selectedBubbleElementId = [];
        /** @private */
        this.selectedNavigationElementId = [];
        /** @private */
        this.selectedLegendElementId = [];
        /** @private */
        this.legendSelectionCollection = [];
        /** @private */
        this.shapeSelections = true;
        /** @private */
        this.legendSelection = true;
        /** @private */
        this.toggledLegendId = [];
        /** @private */
        this.toggledShapeElementId = [];
        /** @private */
        this.checkInitialRender = true;
        /** @private */
        this.initialTileTranslate = new Point(0, 0);
        /** @private */
        this.initialCheck = true;
        /** @private */
        this.applyZoomReset = false;
        setValue('mergePersistData', this.mergePersistMapsData, this);
    }
    /**
     * Specifies whether the shape is selected in the maps or not..
     */
    get isShapeSelected() {
        return this.mapSelect;
    }
    ;
    /**
     * To manage persist maps data
     */
    mergePersistMapsData() {
        let data;
        if (!isNullOrUndefined(window.localStorage)) {
            data = window.localStorage.getItem(this.getModuleName() + this.element.id);
        }
        if (!(isNullOrUndefined(data) || (data === ''))) {
            let dataObj = JSON.parse(data);
            let keys = Object.keys(dataObj);
            this.isProtectedOnChange = true;
            for (let key of keys) {
                if ((typeof this[key] === 'object') && !isNullOrUndefined(this[key])) {
                    extend(this[key], dataObj[key]);
                }
                else {
                    this[key] = dataObj[key];
                }
            }
            this.isProtectedOnChange = false;
        }
    }
    /**
     * Gets the localized label by locale keyword.
     * @param  {string} key
     * @return {string}
     */
    getLocalizedLabel(key) {
        return this.localeObject.getConstant(key);
    }
    /**
     * Initializing pre-required values.
     */
    preRender() {
        this.isDevice = Browser.isDevice;
        this.isBlazor = isBlazor();
        this.initPrivateVariable();
        this.allowServerDataBinding = false;
        this.unWireEVents();
        this.wireEVents();
        this.setCulture();
    }
    /**
     * To Initialize the control rendering.
     */
    render() {
        this.trigger(load, this.isBlazor ? {} : { maps: this });
        this.createSVG();
        this.findBaseAndSubLayers();
        this.createSecondaryElement();
        this.addTabIndex();
        this.themeStyle = getThemeStyle(this.theme);
        this.renderBorder();
        this.renderTitle(this.titleSettings, 'title', null, null);
        this.renderArea();
        this.processRequestJsonData();
        this.renderComplete();
    }
    /* tslint:disable:no-string-literal */
    processRequestJsonData() {
        let length = this.layersCollection.length - 1;
        this.serverProcess = { request: 0, response: 0 };
        let queryModule;
        let dataModule;
        Array.prototype.forEach.call(this.layersCollection, (layer, layerIndex) => {
            if (layer.shapeData instanceof DataManager) {
                this.serverProcess['request']++;
                dataModule = layer.shapeData;
                queryModule = layer.query instanceof Query ? layer.query : new Query();
                let dataManager = dataModule.executeQuery(queryModule);
                dataManager.then((e) => {
                    this.processResponseJsonData('DataManager', e, layer, 'ShapeData');
                });
            }
            else if (layer.shapeData instanceof MapAjax || layer.shapeData) {
                if (!isNullOrUndefined(layer.shapeData['dataOptions'])) {
                    this.processAjaxRequest(layer, layer.shapeData, 'ShapeData');
                }
            }
            if (layer.dataSource instanceof MapAjax || !isNullOrUndefined(layer.dataSource['dataOptions'])) {
                this.processAjaxRequest(layer, layer.dataSource, 'DataSource');
            }
            if (this.serverProcess['request'] === this.serverProcess['response'] && length === layerIndex) {
                this.processResponseJsonData(null);
            }
        });
    }
    // tslint:disable:no-any
    processAjaxRequest(layer, localAjax, type) {
        let ajaxModule;
        this.serverProcess['request']++;
        ajaxModule = new Ajax(localAjax.dataOptions, localAjax.type, localAjax.async, localAjax.contentType);
        ajaxModule.onSuccess = (args) => {
            this.processResponseJsonData('Ajax', args, layer, type);
        };
        ajaxModule.send(localAjax.sendData);
    }
    /**
     * This method is used to process the JSON data to render the maps.
     * @param processType - Specifies the process type in maps.
     * @param data - Specifies the data for maps.
     * @param layer - Specifies the layer for the maps.
     * @param dataType - Specifies the data type for maps.
     */
    /* tslint:disable:no-eval */
    processResponseJsonData(processType, data, layer, dataType) {
        this.serverProcess['response']++;
        if (processType) {
            if (dataType === 'ShapeData') {
                layer.shapeData = (processType === 'DataManager') ? !isNullOrUndefined(data['result']) ? data['result'] : data['actual'] :
                    JSON.parse(data);
            }
            else {
                layer.dataSource = (processType === 'DataManager') ? !isNullOrUndefined(data['result']) ? data['result'] : data['actual'] :
                    JSON.parse('[' + data + ']')[0];
            }
        }
        if (!isNullOrUndefined(processType) && this.serverProcess['request'] === this.serverProcess['response']) {
            let collection = this.layersCollection;
            this.layersCollection = [];
            for (let i = 0; i < collection.length; i++) {
                if (collection[i].isBaseLayer) {
                    this.layersCollection.push(collection[i]);
                }
            }
            for (let j = 0; j < collection.length; j++) {
                if (!collection[j].isBaseLayer) {
                    this.layersCollection.push(collection[j]);
                }
            }
            this.renderMap();
        }
        else if (isNullOrUndefined(processType)) {
            this.renderMap();
        }
    }
    renderMap() {
        if (this.legendModule && this.legendSettings.visible) {
            if (!this.isTileMap) {
                this.legendModule.renderLegend();
            }
            else {
                let layerCount = this.layersCollection.length - 1;
                if (!this.layersCollection[layerCount].isBaseLayer) {
                    this.isTileMapSubLayer = true;
                    this.legendModule.renderLegend();
                }
            }
        }
        this.createTile();
        if (this.zoomSettings.enable && this.zoomModule) {
            this.zoomModule.createZoomingToolbars();
        }
        if (!isNullOrUndefined(this.dataLabelModule)) {
            this.dataLabelModule.dataLabelCollections = [];
            this.dataLabelShape = [];
        }
        this.mapLayerPanel.measureLayerPanel();
        this.element.appendChild(this.svgObject);
        for (let i = 0; i < this.layers.length; i++) {
            if (this.layers[i].selectionSettings && this.layers[i].selectionSettings.enable &&
                this.layers[i].initialShapeSelection.length > 0 && this.checkInitialRender) {
                let checkSelection = this.layers[i].selectionSettings.enableMultiSelect;
                this.layers[i].selectionSettings.enableMultiSelect = checkSelection ? checkSelection : true;
                let shapeSelection = this.layers[i].initialShapeSelection;
                for (let j = 0; j < this.layers[i].initialShapeSelection.length; j++) {
                    this.shapeSelection(i, shapeSelection[j].shapePath, shapeSelection[j].shapeValue, true);
                }
                this.layers[i].selectionSettings.enableMultiSelect = checkSelection;
                if (i === this.layers.length - 1) {
                    this.checkInitialRender = false;
                }
            }
        }
        if (!isNullOrUndefined(document.getElementById(this.element.id + '_tile_parent'))) {
            let svg = this.svgObject.getBoundingClientRect();
            let element = document.getElementById(this.element.id);
            let tileElement = document.getElementById(this.element.id + '_tile_parent');
            let tileElement1 = document.getElementById(this.element.id + '_tiles');
            let tile = tileElement.getBoundingClientRect();
            let bottom;
            let top;
            let left;
            left = parseFloat(tileElement.style.left) + element.offsetLeft;
            let titleTextSize = measureText(this.titleSettings.text, this.titleSettings.textStyle);
            let subTitleTextSize = measureText(this.titleSettings.subtitleSettings.text, this.titleSettings.subtitleSettings.textStyle);
            if (this.isTileMap && this.isTileMapSubLayer && this.legendSettings.position === 'Bottom' && this.legendSettings.visible) {
                if (this.legendSettings.mode !== 'Default') {
                    if (titleTextSize.width !== 0 && titleTextSize.height !== 0) {
                        top = parseFloat(tileElement.style.top) + element.offsetTop + (subTitleTextSize.height / 2)
                            - (this.legendModule.legendBorderRect.height / 2);
                    }
                    else {
                        top = parseFloat(tileElement.style.top) + element.offsetTop - this.mapAreaRect.y;
                    }
                }
                else {
                    left = this.legendModule.legendBorderRect.x;
                    if (titleTextSize.width !== 0 && titleTextSize.height !== 0) {
                        top = parseFloat(tileElement.style.top) + element.offsetTop + (subTitleTextSize['height'] / 2)
                            - this.legendModule.legendBorderRect.y;
                    }
                    else {
                        top = parseFloat(tileElement.style.top) + element.offsetTop + (subTitleTextSize['height'] / 2);
                    }
                }
            }
            else {
                bottom = svg.bottom - tile.bottom - element.offsetTop;
                top = parseFloat(tileElement.style.top) + element.offsetTop;
            }
            top = (bottom <= 11) ? top : (top * 2);
            left = (bottom <= 11) ? left : (left * 2);
            tileElement.style.top = top + 'px';
            tileElement.style.left = left + 'px';
            tileElement1.style.top = top + 'px';
            tileElement1.style.left = left + 'px';
        }
        this.arrangeTemplate();
        let blazor = this.isBlazor ? this.blazorTemplates() : null;
        if (this.annotationsModule) {
            this.annotationsModule.renderAnnotationElements();
        }
        this.zoomingChange();
        this.trigger(loaded, this.isBlazor ? {} : { maps: this });
    }
    /**
     * To append blazor templates
     * @private
     */
    blazorTemplates() {
        for (let i = 0; i < this.layers.length; i++) {
            let markerLength = this.layers[i].markerSettings.length - 1;
            if (markerLength >= 0) {
                if (this.layers[i].dataLabelSettings.visible || this.layers[i].markerSettings[markerLength].template) {
                    updateBlazorTemplate(this.element.id + '_LabelTemplate', 'LabelTemplate', this.layers[i].dataLabelSettings);
                    for (let j = 0; j < this.layers[i].markerSettings.length; j++) {
                        updateBlazorTemplate(this.element.id + '_MarkerTemplate' + j, 'MarkerTemplate', this.layers[i].markerSettings[j]);
                    }
                }
            }
        }
    }
    /**
     * Render the map area border
     */
    renderArea() {
        let width = this.mapsArea.border.width;
        let background = this.mapsArea.background;
        if (width > 0 || (background || this.themeStyle.areaBackgroundColor)) {
            let rect = new RectOption(this.element.id + '_MapAreaBorder', background || this.themeStyle.areaBackgroundColor, this.mapsArea.border, 1, this.mapAreaRect);
            this.svgObject.appendChild(this.renderer.drawRectangle(rect));
        }
    }
    /**
     * To add tab index for map element
     */
    addTabIndex() {
        this.element.setAttribute('aria-label', this.description || 'Maps Element');
        this.element.setAttribute('tabindex', this.tabIndex.toString());
    }
    // private setSecondaryElementPosition(): void {
    //     if (!this.isTileMap) {
    //         let element: HTMLDivElement = getElementByID(this.element.id + '_Secondary_Element') as HTMLDivElement;
    //         let rect: ClientRect = this.element.getBoundingClientRect();
    //         let svgRect: ClientRect = getElementByID(this.element.id + '_svg').getBoundingClientRect();
    //         element.style.marginLeft = Math.max(svgRect.left - rect.left, 0) + 'px';
    //         element.style.marginTop = Math.max(svgRect.top - rect.top, 0) + 'px';
    //     }
    // }
    zoomingChange() {
        let left;
        let top;
        if (getElementByID(this.element.id + '_Layer_Collections') && this.zoomModule) {
            this.zoomModule.layerCollectionEle = getElementByID(this.element.id + '_Layer_Collections');
        }
        if (this.isTileMap && getElementByID(this.element.id + '_Tile_SVG') && getElementByID(this.element.id + '_tile_parent')) {
            let tileRect = getElementByID(this.element.id + '_tile_parent').getBoundingClientRect();
            let tileSvgRect = getElementByID(this.element.id + '_Tile_SVG').getBoundingClientRect();
            left = (tileRect.left - tileSvgRect.left);
            top = (tileRect.top - tileSvgRect.top);
            getElementByID(this.element.id + '_Tile_SVG_Parent').style.left = left + 'px';
            getElementByID(this.element.id + '_Tile_SVG_Parent').style.top = top + 'px';
            let markerTemplateElements = document.getElementsByClassName('template');
            if (!isNullOrUndefined(markerTemplateElements) && markerTemplateElements.length > 0) {
                for (let i = 0; i < markerTemplateElements.length; i++) {
                    let templateGroupEle = markerTemplateElements[i];
                    templateGroupEle.style.left = left + 'px';
                    templateGroupEle.style.top = top + 'px';
                }
            }
        }
        if (this.zoomSettings.zoomFactor >= 1) {
            if (this.zoomModule && this.zoomModule.toolBarGroup && this.zoomSettings.enable) {
                this.zoomModule.alignToolBar();
            }
            let elements = document.getElementById(this.element.id + '_Layer_Collections');
            if (!isNullOrUndefined(elements) && elements.childElementCount > 0) {
                for (let i = 0; i < elements.childNodes.length; i++) {
                    let childElement = elements.childNodes[i];
                    if (childElement.tagName === 'g') {
                        let layerIndex = parseFloat(childElement.id.split('_LayerIndex_')[1].split('_')[0]);
                        for (let j = 0; j < childElement.childNodes.length; j++) {
                            let childNode = childElement.childNodes[j];
                            if (!(childNode.id.indexOf('_Markers_Group') > -1) &&
                                (!(childNode.id.indexOf('_bubble_Group') > -1)) &&
                                (!(childNode.id.indexOf('_dataLableIndex_Group') > -1))) {
                                changeBorderWidth(childNode, layerIndex, this.scale, this);
                            }
                        }
                    }
                }
            }
            if (this.zoomModule && (this.previousScale !== this.scale)) {
                this.zoomModule.applyTransform(true);
            }
        }
    }
    createSecondaryElement() {
        if (isNullOrUndefined(document.getElementById(this.element.id + '_Secondary_Element'))) {
            let secondaryElement = createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: absolute;z-index:2;'
            });
            this.element.appendChild(secondaryElement);
        }
    }
    /**
     * @private
     */
    arrangeTemplate() {
        if (document.getElementById(this.element.id + '_Legend_Border')) {
            document.getElementById(this.element.id + '_Legend_Border').style.pointerEvents = 'none';
        }
        let templateElements = document.getElementsByClassName('template');
        if (!isNullOrUndefined(templateElements) && templateElements.length > 0 &&
            getElementByID(this.element.id + '_Layer_Collections') && this.layers[this.layers.length - 1].layerType !== 'OSM') {
            for (let i = 0; i < templateElements.length; i++) {
                let templateGroupEle = templateElements[i];
                if (!isNullOrUndefined(templateGroupEle) && templateGroupEle.childElementCount > 0) {
                    let layerOffset = getElementByID(this.element.id + '_Layer_Collections').getBoundingClientRect();
                    let elementOffset = getElementByID(templateGroupEle.id).getBoundingClientRect();
                    let offSetLetValue = this.isTileMap ? 0 : (layerOffset.left < elementOffset.left) ?
                        -(Math.abs(elementOffset.left - layerOffset.left)) : (Math.abs(elementOffset.left - layerOffset.left));
                    let offSetTopValue = this.isTileMap ? 0 : (layerOffset.top < elementOffset.top) ?
                        -(Math.abs(elementOffset.top - layerOffset.top)) : Math.abs(elementOffset.top - layerOffset.top);
                    for (let j = 0; j < templateGroupEle.childElementCount; j++) {
                        let currentTemplate = templateGroupEle.childNodes[j];
                        currentTemplate.style.left = parseFloat(currentTemplate.style.left) + offSetLetValue + 'px';
                        currentTemplate.style.top = parseFloat(currentTemplate.style.top) + offSetTopValue + 'px';
                        currentTemplate.style.transform = 'translate(-50%, -50%)';
                    }
                }
            }
        }
    }
    createTile() {
        let mainLayer = this.layersCollection[0];
        let padding = 0;
        if (mainLayer.isBaseLayer && (mainLayer.layerType === 'OSM' || mainLayer.layerType === 'Bing' ||
            mainLayer.layerType === 'GoogleStaticMap')) {
            removeElement(this.element.id + '_tile_parent');
            removeElement(this.element.id + '_tiles');
            removeElement('animated_tiles');
            let ele = createElement('div', {
                id: this.element.id + '_tile_parent', styles: 'position: absolute; left: ' +
                    (this.mapAreaRect.x) + 'px; top: ' + (this.mapAreaRect.y + padding) + 'px; height: ' +
                    (this.mapAreaRect.height) + 'px; width: '
                    + (this.mapAreaRect.width) + 'px; overflow: hidden;'
            });
            let ele1 = createElement('div', {
                id: this.element.id + '_tiles', styles: 'position: absolute; left: ' +
                    (this.mapAreaRect.x) + 'px; top: ' + (this.mapAreaRect.y + padding) + 'px; height: ' +
                    (this.mapAreaRect.height) + 'px; width: '
                    + (this.mapAreaRect.width) + 'px; overflow: hidden;'
            });
            this.element.appendChild(ele);
            this.element.appendChild(ele1);
        }
    }
    /**
     * To initilize the private varibales of maps.
     */
    initPrivateVariable() {
        if (this.element.id === '') {
            let collection = document.getElementsByClassName('e-maps').length;
            this.element.id = 'maps_control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);
        this.mapLayerPanel = new LayerPanel(this);
    }
    findBaseAndSubLayers() {
        let baseIndex = this.baseLayerIndex;
        let mainLayers = [];
        let subLayers = [];
        this.layersCollection = [];
        Array.prototype.forEach.call(this.layers, (layer) => {
            (layer.type === 'Layer') ? mainLayers.push(layer) : subLayers.push(layer);
        });
        for (let i = 0; i < mainLayers.length; i++) {
            let baseLayer = mainLayers[i];
            if (baseLayer.visible && baseIndex === i) {
                baseLayer.isBaseLayer = true;
                this.isTileMap = (baseLayer.layerType === 'Geometry') ? false : true;
                this.layersCollection.push(baseLayer);
                break;
            }
            else if (i === mainLayers.length - 1) {
                this.layersCollection.push(mainLayers[0]);
                break;
            }
        }
        subLayers.map((subLayer, subLayerIndex) => {
            if (subLayer.visible) {
                this.layersCollection.push(subLayer);
            }
        });
    }
    /**
     * @private
     * Render the map border
     */
    renderBorder() {
        let width = this.border.width;
        let borderElement = this.svgObject.querySelector('#' + this.element.id + '_MapBorder');
        if ((width > 0 || (this.background || this.themeStyle.backgroundColor)) && isNullOrUndefined(borderElement)) {
            let borderRect = new RectOption(this.element.id + '_MapBorder', this.background || this.themeStyle.backgroundColor, this.border, 1, new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(this.renderer.drawRectangle(borderRect));
        }
        else {
            borderElement.setAttribute('fill', this.background || this.themeStyle.backgroundColor);
        }
    }
    /**
     * @private
     * Render the title and subtitle
     */
    renderTitle(title, type, bounds, groupEle) {
        let style = title.textStyle;
        let height;
        let width = Math.abs((this.margin.left + this.margin.right) - this.availableSize.width);
        style.fontFamily = this.themeStyle.fontFamily || style.fontFamily;
        style.size = this.themeStyle.titleFontSize || style.size;
        if (title.text) {
            if (isNullOrUndefined(groupEle)) {
                groupEle = this.renderer.createGroup({ id: this.element.id + '_Title_Group' });
            }
            let trimmedTitle = textTrim(width, title.text, style);
            let elementSize = measureText(trimmedTitle, style);
            let rect = (isNullOrUndefined(bounds)) ? new Rect(this.margin.left, this.margin.top, this.availableSize.width, this.availableSize.height) : bounds;
            let location = findPosition(rect, title.alignment, elementSize, type);
            let options = new TextOption(this.element.id + '_Map_' + type, location.x, location.y, 'start', trimmedTitle);
            let titleBounds = new Rect(location.x, location.y, elementSize.width, elementSize.height);
            let element = renderTextElement(options, style, style.color || (type === 'title' ? this.themeStyle.titleFontColor : this.themeStyle.subTitleFontColor), groupEle);
            element.setAttribute('aria-label', this.description || title.text);
            element.setAttribute('tabindex', (this.tabIndex + (type === 'title' ? 1 : 2)).toString());
            if ((type === 'title' && !title.subtitleSettings.text) || (type === 'subtitle')) {
                height = Math.abs((titleBounds.y + this.margin.bottom) - this.availableSize.height);
                this.mapAreaRect = new Rect(this.margin.left, titleBounds.y + 10, width, height - 10);
            }
            if (type !== 'subtitle' && title.subtitleSettings.text) {
                this.renderTitle(title.subtitleSettings, 'subtitle', titleBounds, groupEle);
            }
            else {
                this.svgObject.appendChild(groupEle);
            }
        }
        else {
            height = Math.abs((this.margin.top + this.margin.bottom) - this.availableSize.height);
            this.mapAreaRect = new Rect(this.margin.left, this.margin.top, width, height);
        }
    }
    /**
     * To create svg element for maps
     */
    createSVG() {
        resetBlazorTemplate(this.element.id + '_LabelTemplate', 'LabelTemplate');
        for (let i = 0; i < this.layers.length; i++) {
            for (let j = 0; j < this.layers[i].markerSettings.length; j++) {
                resetBlazorTemplate(this.element.id + '_MarkerTemplate' + j, 'MarkerTemplate');
            }
        }
        this.removeSvg();
        createSvg(this);
    }
    /**
     * To Remove the SVG
     */
    removeSvg() {
        for (let i = 0; i < this.annotations.length; i++) {
            resetBlazorTemplate(this.element.id + '_ContentTemplate_' + i, 'ContentTemplate');
        }
        removeElement(this.element.id + '_Secondary_Element');
        removeElement(this.element.id + '_tile_parent');
        removeElement(this.element.id + '_tiles');
        if (document.getElementsByClassName('e-tooltip-wrap')[0]) {
            remove(document.getElementsByClassName('e-tooltip-wrap')[0]);
        }
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
    }
    /**
     * To bind event handlers for maps.
     */
    wireEVents() {
        //let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        EventHandler.add(this.element, 'click', this.mapsOnClick, this);
        // EventHandler.add(this.element, 'contextmenu', this.mapsOnRightClick, this);
        EventHandler.add(this.element, 'dblclick', this.mapsOnDoubleClick, this);
        EventHandler.add(this.element, Browser.touchStartEvent, this.mouseDownOnMap, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMoveOnMap, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEndOnMap, this);
        EventHandler.add(this.element, 'pointerleave mouseleave', this.mouseLeaveOnMap, this);
        //  EventHandler.add(this.element, cancelEvent, this.mouseLeaveOnMap, this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.mapsOnResize.bind(this));
    }
    /**
     * To unbind event handlers from maps.
     */
    unWireEVents() {
        //let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        EventHandler.remove(this.element, 'click', this.mapsOnClick);
        // EventHandler.remove(this.element, 'contextmenu', this.mapsOnRightClick);
        EventHandler.remove(this.element, 'dblclick', this.mapsOnDoubleClick);
        EventHandler.remove(this.element, Browser.touchStartEvent, this.mouseDownOnMap);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMoveOnMap);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEndOnMap);
        EventHandler.remove(this.element, 'pointerleave mouseleave', this.mouseLeaveOnMap);
        //EventHandler.remove(this.element, cancelEvent, this.mouseLeaveOnMap);
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.mapsOnResize);
    }
    /**
     * This method is used to perform operations when mouse pointer leave from maps.
     * @param e - Specifies the pointer event on maps.
     */
    mouseLeaveOnMap(e) {
        if (document.getElementsByClassName('highlightMapStyle').length > 0 && this.legendModule) {
            this.legendModule.removeShapeHighlightCollection();
            removeClass(document.getElementsByClassName('highlightMapStyle')[0]);
        }
    }
    /**
     * This method is used to perform the operations when a click operation is performed on maps.
     * @param e - Specifies the pointer event on maps.
     * @blazorProperty 'PerformClick'
     */
    /* tslint:disable:no-string-literal */
    mapsOnClick(e) {
        let targetEle = e.target;
        let targetId = targetEle.id;
        let layerIndex = 0;
        let latLongValue;
        let latitude = null;
        let longitude = null;
        this.mouseClickEvent = { x: e.x, y: e.y };
        if (targetEle.id.indexOf('_ToolBar') === -1) {
            if (targetEle.id.indexOf('_LayerIndex_') !== -1 && !this.isTileMap && (this.mouseDownEvent['x'] === this.mouseClickEvent['x'])
                && (this.mouseDownEvent['y'] === this.mouseClickEvent['y'])) {
                layerIndex = parseFloat(targetEle.id.split('_LayerIndex_')[1].split('_')[0]);
                latLongValue = this.getGeoLocation(layerIndex, e);
                latitude = latLongValue['latitude'];
                longitude = latLongValue['longitude'];
            }
            else if (this.isTileMap && (this.mouseDownEvent['x'] === this.mouseClickEvent['x'])
                && (this.mouseDownEvent['y'] === this.mouseClickEvent['y'])) {
                latLongValue = this.getTileGeoLocation(e);
                latitude = latLongValue['latitude'];
                longitude = latLongValue['longitude'];
            }
            let eventArgs = {
                cancel: false, name: click, target: targetId, x: e.clientX, y: e.clientY,
                latitude: latitude, longitude: longitude
            };
            this.trigger('click', eventArgs, (mouseArgs) => {
                if (targetEle.id.indexOf('shapeIndex') > -1 || targetEle.id.indexOf('Tile') > -1) {
                    if (this.markerModule && this.markerModule.sameMarkerData.length > 0 &&
                        (this.zoomModule ? this.zoomModule.isSingleClick : true)) {
                        mergeSeparateCluster(this.markerModule.sameMarkerData, this, getElement(this.element.id + '_Markers_Group'));
                        this.markerModule.sameMarkerData = [];
                    }
                    if (getElement(this.element.id + '_mapsTooltip') &&
                        this.mapsTooltipModule.tooltipTargetID.indexOf('_MarkerIndex_') > -1) {
                        removeElement(this.element.id + '_mapsTooltip');
                    }
                }
                if (this.markerModule) {
                    this.markerModule.markerClick(e);
                    this.markerModule.markerClusterClick(e);
                }
                if (this.bubbleModule) {
                    this.bubbleModule.bubbleClick(e);
                }
                if (!eventArgs.cancel) {
                    this.notify(click, targetEle);
                }
                if (!eventArgs.cancel && targetEle.id.indexOf('shapeIndex') !== -1) {
                    let layerIndex = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
                    let shapeSelectedEventArgs = triggerShapeEvent(targetId, this.layers[layerIndex].selectionSettings, this, shapeSelected);
                    if (!shapeSelectedEventArgs.cancel && this.selectionModule && !isNullOrUndefined(this.shapeSelected)) {
                        customizeStyle(this.selectionModule.selectionType + 'selectionMap', this.selectionModule.selectionType + 'selectionMapStyle', shapeSelectedEventArgs);
                    }
                }
            });
        }
    }
    /**
     * This method is used to perform operations when mouse click on maps.
     * @param e - Specifies the pointer event on maps.
     */
    mouseEndOnMap(e) {
        let targetEle = e.target;
        let targetId = targetEle.id;
        let pageX;
        let pageY;
        let target;
        let touchArg;
        let rect = this.element.getBoundingClientRect();
        let element = e.target;
        if (e.type.indexOf('touch') !== -1) {
            this.isTouch = true;
            touchArg = e;
            pageX = touchArg.changedTouches[0].pageX;
            pageY = touchArg.changedTouches[0].pageY;
            target = touchArg.target;
        }
        else {
            this.isTouch = e.pointerType === 'touch';
            pageX = e.pageX;
            pageY = e.pageY;
            target = e.target;
        }
        if (this.isTouch) {
            this.titleTooltip(e, pageX, pageY, true);
        }
        this.notify(Browser.touchEndEvent, e);
        e.preventDefault();
        return false;
    }
    /**
     * This method is used to perform operations when mouse is clicked down on maps.
     * @param e - Specifies the pointer event on maps.
     */
    mouseDownOnMap(e) {
        this.mouseDownEvent = { x: e.x, y: e.y };
        let rect = this.element.getBoundingClientRect();
        let element = e.target;
        if (element.id.indexOf('_ToolBar') === -1) {
            let markerModule = this.markerModule;
            if (element.id.indexOf('shapeIndex') > -1 || element.id.indexOf('Tile') > -1) {
                if (markerModule && (markerModule.sameMarkerData.length > 0) &&
                    (this.zoomModule ? this.zoomModule.isSingleClick : true)) {
                    mergeSeparateCluster(markerModule.sameMarkerData, this, getElement(this.element.id + '_Markers_Group'));
                    markerModule.sameMarkerData = [];
                }
            }
            if (markerModule) {
                markerModule.markerClick(e);
                markerModule.markerClusterClick(e);
            }
            if (this.bubbleModule) {
                this.bubbleModule.bubbleClick(e);
            }
        }
        this.notify(Browser.touchStartEvent, e);
    }
    /**
     * This method is used to perform operations when performing the double click operation on maps.
     * @param e - Specifies the pointer event.
     * @blazorProperty 'PerformDoubleClick'
     */
    mapsOnDoubleClick(e) {
        this.notify('dblclick', e);
    }
    /**
     * This method is used to perform operations while performing mouse over on maps.
     * @param e - Specifies the pointer event on maps.
     */
    /* tslint:disable:no-string-literal */
    mouseMoveOnMap(e) {
        let target;
        target = (e.type === 'touchmove') ? e.target :
            target = e.target;
        // if (target.id.indexOf('shapeIndex') !== -1 && !this.highlightSettings.enable) {
        //     triggerShapeEvent(target.id, this.highlightSettings, this, shapeHighlight);
        // }
        if (this.markerModule) {
            this.markerModule.markerMove(e);
            this.markerModule.markerClusterMouseMove(e);
        }
        if (this.bubbleModule) {
            this.bubbleModule.bubbleMove(e);
        }
        this.onMouseMove(e);
        this.notify(Browser.touchMoveEvent, e);
    }
    /**
     * This method is used to perform operations when mouse move event is performed on maps.
     * @param e - Specifies the pointer event on maps.
     */
    onMouseMove(e) {
        let element = e.target;
        if (!this.isTouch) {
            this.titleTooltip(e, e.pageX, e.pageY);
        }
        return false;
    }
    titleTooltip(event, x, y, isTouch) {
        let targetId = event.target.id;
        if ((targetId === (this.element.id + '_Map_title')) && (event.target.textContent.indexOf('...') > -1)) {
            showTooltip(this.titleSettings.text, this.titleSettings.textStyle.size, x, y, this.element.offsetWidth, this.element.offsetHeight, this.element.id + '_EJ2_Title_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch);
        }
        else {
            removeElement(this.element.id + '_EJ2_Title_Tooltip');
        }
    }
    /*

    /**
     * This method is used to perform operations while resizing the window.
     * @param e - Specifies the arguments of window resize event.
     */
    mapsOnResize(e) {
        let args = {
            name: resize,
            previousSize: this.availableSize,
            currentSize: new Size(0, 0),
            maps: !this.isBlazor ? this : null
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        if (this.element.classList.contains('e-maps')) {
            this.resizeTo = setTimeout(() => {
                this.unWireEVents();
                this.createSVG();
                this.refreshing = true;
                this.wireEVents();
                args.currentSize = this.availableSize;
                this.trigger(resize, args);
                this.render();
            }, 500);
        }
        return false;
    }
    /**
     * This method is used to zoom the map by specifying the center position.
     * @param centerPosition - Specifies the center position for maps.
     * @param zoomFactor - Specifies the zoom factor for maps.
     */
    zoomByPosition(centerPosition, zoomFactor) {
        let factor = this.mapLayerPanel.calculateFactor(this.layersCollection[0]);
        let position;
        let size = this.mapAreaRect;
        if (!this.isTileMap && this.zoomModule) {
            if (!isNullOrUndefined(centerPosition)) {
                position = convertGeoToPoint(centerPosition.latitude, centerPosition.longitude, factor, this.layersCollection[0], this);
                let mapRect = document.getElementById(this.element.id + '_Layer_Collections').getBoundingClientRect();
                let svgRect = this.svgObject.getBoundingClientRect();
                let xDiff = Math.abs(mapRect.left - svgRect.left) / this.scale;
                let yDiff = Math.abs(mapRect.top - svgRect.top) / this.scale;
                let x = this.translatePoint.x + xDiff;
                let y = this.translatePoint.y + yDiff;
                this.scale = zoomFactor;
                this.translatePoint.x = ((mapRect.left < svgRect.left ? x : 0) + (size.width / 2) - (position.x * zoomFactor)) / zoomFactor;
                this.translatePoint.y = ((mapRect.top < svgRect.top ? y : 0) + (size.height / 2) - (position.y * zoomFactor)) / zoomFactor;
                this.zoomModule.applyTransform();
            }
            else {
                position = { x: size.width / 2, y: size.height / 2 };
                this.zoomModule.performZooming(position, zoomFactor, zoomFactor > this.scale ? 'ZoomIn' : 'ZoomOut');
            }
        }
        else if (this.zoomModule) {
            this.tileZoomLevel = zoomFactor;
            this.tileTranslatePoint = this.mapLayerPanel['panTileMap'](this.availableSize.width, this.availableSize.height, { x: centerPosition.longitude, y: centerPosition.latitude });
            this.mapLayerPanel.generateTiles(zoomFactor, this.tileTranslatePoint, null, new BingMap(this));
        }
    }
    /**
     * This method is used to perform panning by specifying the direction.
     * @param direction - Specifies the direction in which the panning is performed.
     * @param mouseLocation - Specifies the location of the mouse pointer in maps.
     */
    panByDirection(direction, mouseLocation) {
        let xDiff = 0;
        let yDiff = 0;
        switch (direction) {
            case 'Left':
                xDiff = -(this.mapAreaRect.width / 7);
                break;
            case 'Right':
                xDiff = (this.mapAreaRect.width / 7);
                break;
            case 'Top':
                yDiff = -(this.mapAreaRect.height / 7);
                break;
            case 'Bottom':
                yDiff = (this.mapAreaRect.height / 7);
                break;
        }
        if (this.zoomModule) {
            this.zoomModule.panning(direction, xDiff, yDiff, mouseLocation);
        }
    }
    /**
     * This method is used to add the layers dynamically to the maps.
     * @param layer - Specifies the layer for the maps.
     */
    addLayer(layer) {
        this.layers.push(new LayerSettings(this.layers[0], 'layers', layer));
        this.refresh();
    }
    /**
     * This method is used to remove a layer from map.
     * @param index - Specifies the index number of the layer to be removed.
     */
    removeLayer(index) {
        this.layers.splice(index, 1);
        this.refresh();
    }
    /**
     * This method is used to add markers dynamically in the maps.
     * If we provide the index value of the layer in which the marker to be added and the coordinates
     * of the marker as parameters, the marker will be added in the location.
     * @param layerIndex - Specifies the index number of the layer.
     * @param marker - Specifes the settings of the marker to be added.
     */
    addMarker(layerIndex, markerCollection) {
        let layerEle = document.getElementById(this.element.id + '_LayerIndex_' + layerIndex);
        if (markerCollection.length > 0 && layerEle) {
            for (let newMarker of markerCollection) {
                this.layersCollection[layerIndex].markerSettings.push(new MarkerSettings(this, 'markerSettings', newMarker));
            }
            let markerModule = new Marker(this);
            markerModule.markerRender(layerEle, layerIndex, this.mapLayerPanel['currentFactor'], 'AddMarker');
            this.arrangeTemplate();
        }
    }
    /**
     * This method is used to select the geometric shape element in the maps component.
     * @param layerIndex - Specifies the index of the layer in maps.
     * @param propertyName - Specifies the property name from the data source.
     * @param name - Specifies the name of the shape that is selected.
     * @param enable - Specifies the shape selection to be enabled.
     */
    shapeSelection(layerIndex, propertyName, name, enable) {
        let targetEle;
        if (isNullOrUndefined(enable)) {
            enable = true;
        }
        let selectionsettings = this.layers[layerIndex].selectionSettings;
        if (!selectionsettings.enableMultiSelect && this.legendSelection && enable) {
            this.removeShapeSelection();
        }
        if (selectionsettings.enable) {
            let targetId;
            let dataIndex;
            let shapeIndex;
            let shapeDataValue;
            let data;
            let shapeData = this.layers[layerIndex].shapeData['features'];
            for (let i = 0; i < shapeData.length; i++) {
                if (shapeData[i]['properties'][propertyName] === name) {
                    let k = checkShapeDataFields(this.layers[layerIndex].dataSource, shapeData[i]['properties'], this.layers[layerIndex].shapeDataPath, this.layers[layerIndex].shapePropertyPath, this.layers[layerIndex]);
                    targetId = this.element.id + '_' + 'LayerIndex_' + layerIndex + '_shapeIndex_' + i + '_dataIndex_' +
                        (k ? k.toString() : 'undefined');
                    targetEle = getElement(targetId);
                    if (isNullOrUndefined(k) && isNullOrUndefined(targetEle)) {
                        targetId = this.element.id + '_' + 'LayerIndex_' + layerIndex + '_shapeIndex_' + i + '_dataIndex_null';
                        targetEle = getElement(targetId);
                    }
                    shapeIndex = parseInt(targetEle.id.split('_shapeIndex_')[1].split('_')[0], 10);
                    shapeDataValue = this.layers[layerIndex].shapeData['features']['length'] > shapeIndex ?
                        this.layers[layerIndex].shapeData['features'][shapeIndex]['properties'] : null;
                    dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                    data = isNullOrUndefined(dataIndex) ? null : this.layers[layerIndex].dataSource[dataIndex];
                    if (enable) {
                        triggerItemSelectionEvent(selectionsettings, this, targetEle, shapeDataValue, data);
                        this.shapeSelectionClass = getElement('ShapeselectionMap');
                        if (this.legendSettings.visible && targetEle.id.indexOf('_MarkerIndex_') === -1) {
                            this.legendModule.shapeHighLightAndSelection(targetEle, data, selectionsettings, 'selection', layerIndex);
                        }
                        let shapeToggled = this.legendSettings.visible ? this.legendModule.shapeToggled : true;
                        if (shapeToggled) {
                            targetEle.setAttribute('class', 'ShapeselectionMapStyle');
                            if (this.selectedElementId.indexOf(targetEle.getAttribute('id')) === -1) {
                                this.selectedElementId.push(targetEle.getAttribute('id'));
                            }
                            if (!selectionsettings.enableMultiSelect) {
                                return;
                            }
                        }
                    }
                    else {
                        this.legendSelection = (!selectionsettings.enableMultiSelect && !this.legendSelection) ?
                            true : this.legendSelection;
                        if (this.legendSettings.visible && targetEle.id.indexOf('_MarkerIndex_') === -1 &&
                            targetEle.getAttribute('class') === 'ShapeselectionMapStyle') {
                            this.legendModule.shapeHighLightAndSelection(targetEle, data, selectionsettings, 'selection', layerIndex);
                        }
                        let shapeToggled = this.legendSettings.visible ? this.legendModule.shapeToggled : true;
                        if (shapeToggled) {
                            removeClass(targetEle);
                            let selectedElementIdIndex = this.selectedElementId.indexOf(targetEle.getAttribute('id'));
                            if (selectedElementIdIndex !== -1) {
                                this.selectedElementId.splice(selectedElementIdIndex, 1);
                                if (!selectionsettings.enableMultiSelect && this.legendSelection && this.selectedElementId.length > 0) {
                                    this.removeShapeSelection();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     * This method is used to zoom the maps component based on the provided coordinates.
     * @param minLatitude - Specifies the minimum latitude to be zoomed.
     * @param minLongitude - Specifies the minimum latitude to be zoomed.
     * @param maxLatitude - Specifies the maximum latitude to be zoomed.
     * @param maxLongitude - Specifies the maximum longitude to be zoomed.
     */
    zoomToCoordinates(minLatitude, minLongitude, maxLatitude, maxLongitude) {
        let centerLatitude;
        let centerLongtitude;
        let isTwoCoordinates = false;
        if (isNullOrUndefined(maxLatitude) && isNullOrUndefined(maxLongitude)
            || isNullOrUndefined(minLatitude) && isNullOrUndefined(minLongitude)) {
            minLatitude = isNullOrUndefined(minLatitude) ? 0 : minLatitude;
            minLongitude = isNullOrUndefined(minLatitude) ? 0 : minLongitude;
            maxLatitude = isNullOrUndefined(maxLatitude) ? minLatitude : maxLatitude;
            maxLongitude = isNullOrUndefined(maxLongitude) ? minLongitude : maxLongitude;
            isTwoCoordinates = true;
        }
        if (minLatitude > maxLatitude) {
            [minLatitude, maxLatitude] = [maxLatitude, minLatitude];
        }
        if (minLongitude > maxLongitude) {
            [minLongitude, maxLongitude] = [maxLongitude, minLongitude];
        }
        if (!isTwoCoordinates) {
            centerLatitude = (minLatitude + maxLatitude) / 2;
            centerLongtitude = (minLongitude + maxLongitude) / 2;
        }
        else {
            centerLatitude = (minLatitude + maxLatitude);
            centerLongtitude = (minLongitude + maxLongitude);
        }
        this.centerLatOfGivenLocation = centerLatitude;
        this.centerLongOfGivenLocation = centerLongtitude;
        this.minLatOfGivenLocation = minLatitude;
        this.minLongOfGivenLocation = minLongitude;
        this.maxLatOfGivenLocation = maxLatitude;
        this.maxLongOfGivenLocation = maxLongitude;
        this.zoomNotApplied = true;
        this.scaleOfGivenLocation = calculateZoomLevel(minLatitude, maxLatitude, minLongitude, maxLongitude, this.mapAreaRect.width, this.mapAreaRect.height, this);
        let zoomArgs;
        zoomArgs = {
            cancel: false, name: 'zoom', type: zoomIn, maps: !this.isBlazor ? this : null,
            tileTranslatePoint: {}, translatePoint: {},
            tileZoomLevel: this.isTileMap ? { previous: this.tileZoomLevel, current: this.scaleOfGivenLocation } : {},
            scale: !this.isTileMap ? { previous: this.scale, current: this.scaleOfGivenLocation } :
                { previous: this.tileZoomLevel, current: this.scaleOfGivenLocation }
        };
        this.trigger('zoom', zoomArgs);
        this.refresh();
    }
    /**
     * This method is used to remove multiple selected shapes in the maps.
     */
    removeShapeSelection() {
        let selectedElements = this.selectedElementId.length;
        for (let i = 0; i < selectedElements; i++) {
            removeClass(getElementByID(this.selectedElementId[0]));
            this.selectedElementId.splice(0, 1);
        }
    }
    /**
     * This method is used to set culture for maps component.
     */
    setCulture() {
        this.intl = new Internationalization();
        this.setLocaleConstants();
        this.localeObject = new L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    }
    /**
     * This method to set locale constants to the maps component.
     */
    setLocaleConstants() {
        // Need to modify after the api confirm
        this.defaultLocalConstants = {
            ZoomIn: 'Zoom In',
            Zoom: 'Zoom',
            ZoomOut: 'Zoom Out',
            Pan: 'Pan',
            Reset: 'Reset',
        };
    }
    /**
     * This method disposes the maps component.
     */
    destroy() {
        this.unWireEVents();
        super.destroy();
    }
    /**
     * Gets component name
     */
    getModuleName() {
        return 'maps';
    }
    /**
     * Gets the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData() {
        let keyEntity = ['translatePoint', 'zoomSettings', 'mapScaleValue', 'tileTranslatePoint', 'baseTranslatePoint',
            'scale', 'zoomPersistence', 'defaultState', 'markerZoomedState', 'initialCheck', 'initialZoomLevel', 'initialTileTranslate',
            'applyZoomReset', 'markerZoomFactor'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        let render = false;
        let isMarker = false;
        let isStaticMapType = false;
        let layerEle;
        if (newProp['layers']) {
            let newLayerLength = Object.keys(newProp['layers']).length;
            layerEle = document.getElementById(this.element.id + '_LayerIndex_' + (newLayerLength - 1));
        }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'background':
                    this.renderBorder();
                    break;
                case 'height':
                case 'width':
                case 'layers':
                case 'projectionType':
                case 'centerPosition':
                case 'legendSettings':
                case 'zoomSettings':
                case 'baseLayerIndex':
                    if (prop === 'layers') {
                        let layerPropLength = Object.keys(newProp.layers).length;
                        for (let x = 0; x < layerPropLength; x++) {
                            if (!isNullOrUndefined(newProp.layers[x])) {
                                let collection = Object.keys(newProp.layers[x]);
                                for (let collectionProp of collection) {
                                    if (collectionProp === 'markerSettings') {
                                        isMarker = true;
                                    }
                                    else if (collectionProp === 'staticMapType') {
                                        isStaticMapType = true;
                                    }
                                }
                            }
                        }
                    }
                    render = true;
                    break;
                case 'locale':
                case 'currencyCode':
                    super.refresh();
                    break;
            }
        }
        if (render) {
            if (newProp.layers && isMarker) {
                removeElement(this.element.id + '_Markers_Group');
                if (this.isTileMap) {
                    this.mapLayerPanel.renderTileLayer(this.mapLayerPanel, this.layers['currentFactor'], (this.layers.length - 1));
                }
                else {
                    this.markerModule.markerRender(layerEle, (this.layers.length - 1), this.mapLayerPanel['currentFactor'], 'AddMarker');
                }
            }
            else if (newProp.layers && isStaticMapType) {
                this.mapLayerPanel.renderGoogleMap(this.layers[this.layers.length - 1].key, this.staticMapZoom);
            }
            else {
                this.createSVG();
                this.render();
            }
        }
    }
    /**
     * To provide the array of modules needed for maps rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    requiredModules() {
        let modules = [];
        let isVisible = this.findVisibleLayers(this.layers);
        let annotationEnable = false;
        this.annotations.map((annotation, index) => {
            annotationEnable = annotation.content != null;
        });
        if (this.isBubbleVisible()) {
            modules.push({
                member: 'Bubble',
                args: [this]
            });
        }
        if (isVisible.highlight) {
            modules.push({
                member: 'Highlight',
                args: [this]
            });
        }
        if (isVisible.selection) {
            modules.push({
                member: 'Selection',
                args: [this]
            });
        }
        if (this.legendSettings.visible) {
            modules.push({
                member: 'Legend',
                args: [this]
            });
        }
        if (this.zoomSettings.enable || this.zoomSettings.zoomFactor > this.zoomSettings.minZoom) {
            modules.push({
                member: 'Zoom',
                args: [this]
            });
        }
        if (this.isMarkersVisible()) {
            modules.push({
                member: 'Marker',
                args: [this]
            });
        }
        if (this.isDataLabelVisible()) {
            modules.push({
                member: 'DataLabel',
                args: [this]
            });
        }
        if (this.isNavigationVisible()) {
            modules.push({
                member: 'NavigationLine',
                args: [this]
            });
        }
        if (isVisible.tooltip) {
            modules.push({
                member: 'MapsTooltip',
                args: [this]
            });
        }
        if (annotationEnable) {
            modules.push({
                member: 'Annotations',
                args: [this, Annotations]
            });
        }
        return modules;
    }
    /**
     * To find marker visibility
     */
    isMarkersVisible() {
        let isVisible = false;
        Array.prototype.forEach.call(this.layers, (layer, layerIndex) => {
            for (let i = 0; i < layer.markerSettings.length; i++) {
                if (layer.markerSettings[i].visible) {
                    isVisible = true;
                    break;
                }
            }
        });
        return isVisible;
    }
    /**
     * To find DataLabel visibility
     */
    isDataLabelVisible() {
        let isVisible = false;
        for (let i = 0; i < this.layers.length; i++) {
            if (this.layers[i].dataLabelSettings.visible) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    }
    /**
     * To find navigation line visibility
     */
    isNavigationVisible() {
        let isVisible = false;
        Array.prototype.forEach.call(this.layers, (layer, layerIndex) => {
            for (let i = 0; i < layer.navigationLineSettings.length; i++) {
                if (layer.navigationLineSettings[i].visible) {
                    isVisible = true;
                    break;
                }
            }
        });
        return isVisible;
    }
    /**
     * To find marker visibility
     */
    isBubbleVisible() {
        let isVisible = false;
        for (let layer of this.layers) {
            if (this.getBubbleVisible(layer)) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    }
    /**
     * To find the bubble visibility from layer
     * @private
     */
    getBubbleVisible(layer) {
        let isVisible = false;
        for (let bubble of layer.bubbleSettings) {
            if (bubble.visible) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    }
    /**
     * This method handles the printing functionality for the maps component.
     * @param id - Specifies the element to be printed.
     */
    print(id) {
        let exportChart = new ExportUtils(this);
        exportChart.print(id);
    }
    /**
     * This method handles the export functionality for the maps component.
     * @param type - Specifies the type of the exported file.
     * @param fileName - Specifies the name of the file with which the rendered maps need to be exported.
     * @param orientation - Specifies the orientation of the pdf document in exporting.
     * @param isDownload - Specifies whether to download as a file or get as base64 string for the file
     */
    export(type, fileName, orientation, isDownload) {
        let exportMap = new ExportUtils(this);
        if (isNullOrUndefined(isDownload) || isDownload) {
            return new Promise((resolve, reject) => {
                resolve(exportMap.export(type, fileName, true, orientation));
            });
        }
        else {
            return new Promise((resolve, reject) => {
                resolve(exportMap.export(type, fileName, isDownload, orientation));
            });
        }
    }
    /**
     * To find visibility of layers and markers for required modules load.
     */
    findVisibleLayers(layers, isLayerVisible = false, isBubblevisible = false, istooltipVisible = false, isSelection = false, isHighlight = false) {
        let bubbles;
        let markers;
        let navigationLine;
        for (let layer of layers) {
            isLayerVisible = layer.visible || isLayerVisible;
            if (layer.visible) {
                bubbles = layer.bubbleSettings;
                markers = layer.markerSettings;
                navigationLine = layer.navigationLineSettings;
                for (let navigation of navigationLine) {
                    if (navigation.visible) {
                        isSelection = navigation.highlightSettings.enable || isSelection;
                        isHighlight = navigation.selectionSettings.enable || isHighlight;
                    }
                }
                for (let marker$$1 of markers) {
                    if (marker$$1.visible) {
                        istooltipVisible = marker$$1.tooltipSettings.visible || istooltipVisible;
                        isSelection = marker$$1.selectionSettings.enable || isSelection;
                        isHighlight = marker$$1.highlightSettings.enable || isHighlight;
                    }
                    if (istooltipVisible) {
                        break;
                    }
                }
                for (let bubble of bubbles) {
                    if (bubble.visible) {
                        istooltipVisible = bubble.tooltipSettings.visible || istooltipVisible;
                        isSelection = bubble.selectionSettings.enable || isSelection;
                        isHighlight = bubble.highlightSettings.enable || isHighlight;
                    }
                    if (istooltipVisible) {
                        break;
                    }
                }
                istooltipVisible = layer.tooltipSettings.visible || istooltipVisible;
                isSelection = layer.selectionSettings.enable || isSelection;
                isHighlight = layer.highlightSettings.enable || isHighlight;
            }
            if (isLayerVisible && isBubblevisible && istooltipVisible) {
                break;
            }
        }
        return {
            layer: isLayerVisible, bubble: isBubblevisible, tooltip: istooltipVisible,
            selection: isSelection, highlight: isHighlight
        };
    }
    /**
     * This method is used to get the geo location points.
     * @param {number} layerIndex - Specifies the index number of the layer of the map.
     * @param {PointerEvent} location - Specifies the location in point format.
     * @return GeoPosition
     */
    getGeoLocation(layerIndex, location) {
        let container = document.getElementById(this.element.id);
        let pageX = location['layerX'] - container.offsetLeft;
        let pageY = location['layerY'] - container.offsetTop;
        let currentLayer = this.layersCollection[layerIndex];
        let translate = getTranslate(this, currentLayer, false);
        let translatePoint = translate['location'];
        let translatePointX = translatePoint.x * this.scale;
        let translatePointY = translatePoint.y * this.scale;
        let mapSize = (Math.min(this.mapAreaRect.height, this.mapAreaRect.width)
            * this.mapLayerPanel['currentFactor']) * this.scale;
        let xx = (this.clip(pageX - translatePointX, 0, mapSize - 1) / mapSize) - 0.5;
        let yy = 0.5 - (this.clip(pageY - translatePointY, 0, mapSize - 1) / mapSize);
        let lat = 90 - 360 * Math.atan(Math.exp(-yy * 2 * Math.PI)) / Math.PI;
        let long = 360 * xx;
        return { latitude: lat, longitude: long };
    }
    clip(value, minVal, maxVal) {
        return Math.min(Math.max(value, minVal), maxVal);
    }
    /**
     * This method is used to get the geo location points when tile maps is rendered in the maps component.
     * @param {PointerEvent} - Specifies the location in point format.
     * @return GeoPosition
     */
    getTileGeoLocation(location) {
        let container = document.getElementById(this.element.id);
        let latLong;
        let ele = document.getElementById(this.element.id + '_tile_parent');
        latLong = this.pointToLatLong(location['layerX'] + this.mapAreaRect.x - (ele.offsetLeft - container.offsetLeft), location['layerY'] + this.mapAreaRect.y - (ele.offsetTop - container.offsetTop));
        return { latitude: latLong['latitude'], longitude: latLong['longitude'] };
    }
    /**
     * This method is used to convert the point to latitude and longitude in maps.
     * @param pageX - Specifies the x value for the page.
     * @param pageY - Specifies the y value for the page.
     */
    pointToLatLong(pageX, pageY) {
        let padding = this.layers[this.layers.length - 1].layerType === 'GoogleStaticMap' ? 0 : 10;
        pageY = (this.zoomSettings.enable) ? pageY + padding : pageY;
        let mapSize = 256 * Math.pow(2, this.tileZoomLevel);
        let x1 = (this.clip(pageX - (this.translatePoint.x * this.scale), 0, mapSize - 1) / mapSize) - 0.5;
        let y1 = 0.5 - (this.clip(pageY - (this.translatePoint.y * this.scale), 0, mapSize - 1) / mapSize);
        let lat = 90 - 360 * Math.atan(Math.exp(-y1 * 2 * Math.PI)) / Math.PI;
        let long = 360 * x1;
        return { latitude: lat, longitude: long };
    }
};
__decorate([
    Property(null)
], Maps.prototype, "background", void 0);
__decorate([
    Property(false)
], Maps.prototype, "useGroupingSeparator", void 0);
__decorate([
    Property(null)
], Maps.prototype, "format", void 0);
__decorate([
    Property(null)
], Maps.prototype, "width", void 0);
__decorate([
    Property(null)
], Maps.prototype, "height", void 0);
__decorate([
    Property('MouseMove')
], Maps.prototype, "tooltipDisplayMode", void 0);
__decorate([
    Complex({}, TitleSettings)
], Maps.prototype, "titleSettings", void 0);
__decorate([
    Complex({}, ZoomSettings)
], Maps.prototype, "zoomSettings", void 0);
__decorate([
    Complex({}, LegendSettings)
], Maps.prototype, "legendSettings", void 0);
__decorate([
    Collection([], LayerSettings)
], Maps.prototype, "layers", void 0);
__decorate([
    Collection([], Annotation)
], Maps.prototype, "annotations", void 0);
__decorate([
    Complex({}, Margin)
], Maps.prototype, "margin", void 0);
__decorate([
    Complex({ color: '#DDDDDD', width: 0 }, Border)
], Maps.prototype, "border", void 0);
__decorate([
    Property('Material')
], Maps.prototype, "theme", void 0);
__decorate([
    Property('Mercator')
], Maps.prototype, "projectionType", void 0);
__decorate([
    Property(0)
], Maps.prototype, "baseLayerIndex", void 0);
__decorate([
    Property(null)
], Maps.prototype, "description", void 0);
__decorate([
    Property(1)
], Maps.prototype, "tabIndex", void 0);
__decorate([
    Complex({ latitude: null, longitude: null }, CenterPosition)
], Maps.prototype, "centerPosition", void 0);
__decorate([
    Complex({}, MapsAreaSettings)
], Maps.prototype, "mapsArea", void 0);
__decorate([
    Event()
], Maps.prototype, "load", void 0);
__decorate([
    Event()
], Maps.prototype, "beforePrint", void 0);
__decorate([
    Event()
], Maps.prototype, "loaded", void 0);
__decorate([
    Event()
], Maps.prototype, "click", void 0);
__decorate([
    Event()
], Maps.prototype, "doubleClick", void 0);
__decorate([
    Event()
], Maps.prototype, "rightClick", void 0);
__decorate([
    Event()
], Maps.prototype, "resize", void 0);
__decorate([
    Event()
], Maps.prototype, "tooltipRender", void 0);
__decorate([
    Event()
], Maps.prototype, "legendRendering", void 0);
__decorate([
    Event()
], Maps.prototype, "tooltipRenderComplete", void 0);
__decorate([
    Event()
], Maps.prototype, "shapeSelected", void 0);
__decorate([
    Event()
], Maps.prototype, "itemSelection", void 0);
__decorate([
    Event()
], Maps.prototype, "itemHighlight", void 0);
__decorate([
    Event()
], Maps.prototype, "shapeHighlight", void 0);
__decorate([
    Event()
], Maps.prototype, "layerRendering", void 0);
__decorate([
    Event()
], Maps.prototype, "shapeRendering", void 0);
__decorate([
    Event()
], Maps.prototype, "markerRendering", void 0);
__decorate([
    Event()
], Maps.prototype, "markerClusterRendering", void 0);
__decorate([
    Event()
], Maps.prototype, "markerClick", void 0);
__decorate([
    Event()
], Maps.prototype, "markerClusterClick", void 0);
__decorate([
    Event()
], Maps.prototype, "markerClusterMouseMove", void 0);
__decorate([
    Event()
], Maps.prototype, "markerMouseMove", void 0);
__decorate([
    Event()
], Maps.prototype, "dataLabelRendering", void 0);
__decorate([
    Event()
], Maps.prototype, "bubbleRendering", void 0);
__decorate([
    Event()
], Maps.prototype, "bubbleClick", void 0);
__decorate([
    Event()
], Maps.prototype, "bubbleMouseMove", void 0);
__decorate([
    Event()
], Maps.prototype, "animationComplete", void 0);
__decorate([
    Event()
], Maps.prototype, "annotationRendering", void 0);
__decorate([
    Event()
], Maps.prototype, "zoom", void 0);
__decorate([
    Event()
], Maps.prototype, "pan", void 0);
Maps = __decorate([
    NotifyPropertyChanges
], Maps);

var __rest$3 = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
/**
 * Bubble module class
 */
class Bubble {
    constructor(maps) {
        /**
         * Bubble Id for current layer
         */
        this.id = '';
        this.maps = maps;
        this.bubbleCollection = [];
    }
    /**
     * To render bubble
     */
    /* tslint:disable:no-string-literal */
    /* tslint:disable-next-line:max-func-body-length */
    renderBubble(bubbleSettings, shapeData, color, range, bubbleIndex, dataIndex, layerIndex, layer, group, bubbleID) {
        let layerData = layer.layerData;
        let colorValuePath = bubbleSettings.colorValuePath;
        let equalValue = (!isNullOrUndefined(colorValuePath)) ? ((colorValuePath.indexOf('.') > -1) ?
            (getValueFromObject(shapeData, bubbleSettings.colorValuePath)) : shapeData[colorValuePath]) : shapeData[colorValuePath];
        let colorValue = (!isNullOrUndefined(colorValuePath)) ? ((colorValuePath.indexOf('.') > -1) ?
            Number(getValueFromObject(shapeData, bubbleSettings.colorValuePath)) : Number(shapeData[colorValuePath])) :
            Number(shapeData[colorValuePath]);
        let bubbleValue = (!isNullOrUndefined(bubbleSettings.valuePath)) ? ((bubbleSettings.valuePath.indexOf('.') > -1) ?
            Number(getValueFromObject(shapeData, bubbleSettings.valuePath)) : Number(shapeData[bubbleSettings.valuePath])) :
            Number(shapeData[bubbleSettings.valuePath]);
        let opacity;
        let bubbleColor;
        if (isNaN(bubbleValue) && isNaN(colorValue) && isNullOrUndefined(equalValue)) {
            return null;
        }
        let radius = getRatioOfBubble(bubbleSettings.minRadius, bubbleSettings.maxRadius, bubbleValue, range.min, range.max);
        let colorMapping = new ColorMapping(this.maps);
        let shapeColor = colorMapping.getColorByValue(bubbleSettings.colorMapping, colorValue, equalValue);
        bubbleColor = (Object.prototype.toString.call(shapeColor) === '[object Object]' &&
            !isNullOrUndefined(shapeColor['fill'])) ? shapeColor['fill'] : color;
        opacity = (Object.prototype.toString.call(shapeColor) === '[object Object]' &&
            !isNullOrUndefined(shapeColor['opacity'])) ? shapeColor['opacity'] : bubbleSettings.opacity;
        let shapePoints = [[]];
        this.maps.translateType = 'bubble';
        let midIndex = 0;
        let pointsLength = 0;
        let currentLength = 0;
        for (let i = 0, len = layerData.length; i < len; i++) {
            let shape = layerData[i];
            shape = shape['property'];
            let shapePath = checkPropertyPath(shapeData[layer.shapeDataPath], layer.shapePropertyPath, shape);
            let shapeDataLayerPathValue = !isNullOrUndefined(shapeData[layer.shapeDataPath]) &&
                isNaN(shapeData[layer.shapeDataPath]) ? shapeData[layer.shapeDataPath].toLowerCase() : shapeData[layer.shapeDataPath];
            let shapePathValue = !isNullOrUndefined(shape[shapePath]) && isNaN(shape[shapePath])
                ? shape[shapePath].toLowerCase() : shape[shapePath];
            if (shapeDataLayerPathValue === shapePathValue) {
                if (layerData[i]['type'] === 'Point') {
                    shapePoints.push(this.getPoints(layerData[i], []));
                }
                else if (!layerData[i]['_isMultiPolygon']) {
                    shapePoints.push(this.getPoints(layerData[i], []));
                    currentLength = shapePoints[shapePoints.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoints.length - 1;
                    }
                }
                else {
                    let layer = layerData[i];
                    for (let j = 0; j < layer.length; j++) {
                        shapePoints.push(this.getPoints(layer[j], []));
                        currentLength = shapePoints[shapePoints.length - 1].length;
                        if (pointsLength < currentLength) {
                            pointsLength = currentLength;
                            midIndex = shapePoints.length - 1;
                        }
                    }
                }
            }
        }
        let projectionType = this.maps.projectionType;
        let centerY;
        let eventArgs;
        let center = findMidPointOfPolygon(shapePoints[midIndex], projectionType);
        if (bubbleSettings.visible) {
            if (!isNullOrUndefined(center)) {
                centerY = this.maps.projectionType === 'Mercator' ? center['y'] : (-center['y']);
                eventArgs = {
                    cancel: false, name: bubbleRendering, border: bubbleSettings.border,
                    cx: center['x'], cy: centerY, data: shapeData, fill: bubbleColor,
                    maps: this.maps.isBlazor ? null : this.maps, radius: radius
                };
            }
            else {
                let shapePointsLength = shapePoints.length - 1;
                if (shapePoints[shapePointsLength]['x'] && shapePoints[shapePointsLength]['y']) {
                    eventArgs = {
                        cancel: false, name: bubbleRendering, border: bubbleSettings.border,
                        cx: shapePoints[shapePointsLength]['x'], cy: shapePoints[shapePointsLength]['y'],
                        data: shapeData, fill: bubbleColor, maps: this.maps.isBlazor ? null : this.maps,
                        radius: radius
                    };
                }
                else {
                    return;
                }
                if (this.maps.isBlazor) {
                    const { maps } = eventArgs, blazorEventArgs = __rest$3(eventArgs, ["maps"]);
                    eventArgs = blazorEventArgs;
                }
            }
            this.maps.trigger('bubbleRendering', eventArgs, (bubbleArgs) => {
                if (eventArgs.cancel) {
                    return;
                }
                let bubbleElement;
                if (bubbleSettings.bubbleType === 'Circle') {
                    let circle = new CircleOption(bubbleID, eventArgs.fill, eventArgs.border, opacity, 0, 0, eventArgs.radius, null);
                    bubbleElement = drawCircle(this.maps, circle, group);
                }
                else {
                    let y = this.maps.projectionType === 'Mercator' ? (eventArgs.cy - radius) : (eventArgs.cy + radius);
                    let rectangle = new RectOption(bubbleID, eventArgs.fill, eventArgs.border, opacity, new Rect(0, 0, radius * 2, radius * 2), 2, 2);
                    eventArgs.cx -= radius;
                    eventArgs.cy = y;
                    bubbleElement = drawRectangle(this.maps, rectangle, group);
                }
                maintainSelection(this.maps.selectedBubbleElementId, this.maps.bubbleSelectionClass, bubbleElement, 'BubbleselectionMapStyle');
                this.bubbleCollection.push({
                    LayerIndex: layerIndex,
                    BubbleIndex: bubbleIndex,
                    DataIndex: dataIndex,
                    element: bubbleElement,
                    center: { x: eventArgs.cx, y: eventArgs.cy }
                });
                let translate;
                let animate$$1 = layer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
                if (this.maps.zoomSettings.zoomFactor > 1 && !isNullOrUndefined(this.maps.zoomModule)) {
                    translate = getZoomTranslate(this.maps, layer, animate$$1);
                }
                else {
                    translate = getTranslate(this.maps, layer, animate$$1);
                }
                let scale = translate['scale'];
                let transPoint = translate['location'];
                let position = new MapLocation((this.maps.isTileMap ? (eventArgs.cx) : ((eventArgs.cx + transPoint.x) * scale)), (this.maps.isTileMap ? (eventArgs.cy) : ((eventArgs.cy + transPoint.y) * scale)));
                bubbleElement.setAttribute('transform', 'translate( ' + (position.x) + ' ' + (position.y) + ' )');
                let bubble = (bubbleSettings.dataSource.length - 1) === dataIndex ? 'bubble' : null;
                if (bubbleSettings.bubbleType === 'Square') {
                    position.x += radius;
                    position.y += radius * (this.maps.projectionType === 'Mercator' ? 1 : -1);
                }
                else {
                    radius = 0;
                }
                if (bubbleSettings.animationDuration > 0) {
                    elementAnimate(bubbleElement, bubbleSettings.animationDelay, bubbleSettings.animationDuration, position, this.maps, bubble, radius);
                }
            });
        }
    }
    getPoints(shape, points) {
        if (isNullOrUndefined(shape.map)) {
            points = shape['point'];
        }
        else {
            shape.map((current, index) => {
                points.push(new Point(current['point']['x'], current['point']['y']));
            });
        }
        return points;
    }
    /**
     * To check and trigger bubble click event
     */
    bubbleClick(e) {
        let target = e.target.id;
        if (target.indexOf('_LayerIndex_') === -1) {
            return;
        }
        let data = this.getbubble(target);
        if (isNullOrUndefined(data)) {
            return;
        }
        let eventArgs = {
            cancel: false, name: bubbleClick, data: data, maps: this.maps,
            target: target, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            const { maps } = eventArgs, blazorEventArgs = __rest$3(eventArgs, ["maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(bubbleClick, eventArgs);
    }
    /**
     * To get bubble from target id
     */
    getbubble(target) {
        let id = target.split('_LayerIndex_');
        let index = parseInt(id[1].split('_')[0], 10);
        let layer = this.maps.layers[index];
        let data;
        if (target.indexOf('_BubbleIndex_') > -1) {
            let bubbleIndex = parseInt(id[1].split('_BubbleIndex_')[1], 10);
            let dataIndex = parseInt(id[1].split('_BubbleIndex_')[1].split('_dataIndex_')[1], 10);
            if (!isNaN(bubbleIndex)) {
                data = layer.bubbleSettings[bubbleIndex].dataSource[dataIndex];
                return data;
            }
        }
        return null;
    }
    /**
     * To check and trigger bubble move event
     */
    bubbleMove(e) {
        let target = e.target.id;
        if (target.indexOf('_LayerIndex_') === -1) {
            return;
        }
        let data = this.getbubble(target);
        if (isNullOrUndefined(data)) {
            return;
        }
        let eventArgs = {
            cancel: false, name: bubbleMouseMove, data: data, maps: this.maps,
            target: target, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            const { maps } = eventArgs, blazorEventArgs = __rest$3(eventArgs, ["maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(bubbleMouseMove, eventArgs);
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'Bubble';
    }
    /**
     * To destroy the bubble.
     * @return {void}
     * @private
     */
    destroy(maps) {
        /**
         * Destroy method performed here
         */
    }
}

var __rest$4 = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
/**
 * DataLabel Module used to render the maps datalabel
 */
class DataLabel {
    constructor(maps) {
        this.value = { rightWidth: 0, leftWidth: 0, heightTop: 0, heightBottom: 0 };
        this.maps = maps;
        this.dataLabelCollections = [];
    }
    //tslint:disable:max-func-body-length
    getDataLabel(dataSource, labelPath, shapeName, shapeDataPath) {
        let text;
        let shapeNameValue;
        for (let i = 0; i < dataSource.length; i++) {
            let data = dataSource[i];
            let dataShapePathValue;
            dataShapePathValue = !isNullOrUndefined(data[shapeDataPath]) && isNaN(data[shapeDataPath]) ?
                data[shapeDataPath].toLowerCase() : data[shapeDataPath];
            shapeName = !isNullOrUndefined(shapeName) ? shapeName.toString() : shapeName;
            shapeNameValue = !isNullOrUndefined(shapeName) ? shapeName.toLowerCase() : shapeName;
            if ((dataShapePathValue) === shapeNameValue) {
                text = data;
                break;
            }
        }
        return text;
    }
    /**
     * To render label for maps
     * @param layer
     * @param layerIndex
     * @param shape
     * @param layerData
     * @param group
     * @param labelTemplateElement
     * @param index
     */
    renderLabel(layer, layerIndex, shape, layerData, group, labelTemplateElement, index, intersect) {
        let dataLabel = layer.dataLabelSettings;
        let style = layer.dataLabelSettings.textStyle;
        let templateFn;
        let options;
        let dataLabelSettings = layer.dataLabelSettings;
        let labelpath = layer.dataLabelSettings.labelPath;
        let shapePoint = [[]];
        let midIndex = 0;
        let pointsLength = 0;
        let shapeData = shape;
        let element;
        let text = '';
        let datasrcObj;
        let currentLength = 0;
        let oldIndex;
        let location;
        let sublayerIndexLabel = false;
        let shapeProperties = shape['properties'];
        let labelId = this.maps.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + index + '_LabelIndex_' + index;
        let textLocation = new Point(0, 0);
        /* tslint:disable:no-string-literal */
        let shapes = layerData[index];
        let locationX;
        let locationY;
        style.fontFamily = this.maps.themeStyle.labelFontFamily;
        shape = shapes['property'];
        let properties = (Object.prototype.toString.call(layer.shapePropertyPath) === '[object Array]' ?
            layer.shapePropertyPath : [layer.shapePropertyPath]);
        let propertyPath;
        let isPoint = false;
        let animate$$1 = layer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
        let translate = (this.maps.isTileMap) ? new Object() : ((this.maps.zoomSettings.zoomFactor > 1 &&
            !isNullOrUndefined(this.maps.zoomModule)) ? getZoomTranslate(this.maps, layer, animate$$1) :
            getTranslate(this.maps, layer, animate$$1));
        let scale = (this.maps.isTileMap) ? this.maps.scale : translate['scale'];
        let transPoint = (this.maps.isTileMap) ? this.maps.translatePoint : translate['location'];
        let zoomTransPoint = this.maps.zoomTranslatePoint;
        let shapeWidth;
        let scaleZoomValue = !isNullOrUndefined(this.maps.scale) ? Math.floor(this.maps.scale) : 1;
        let zoomLabelsPosition = this.maps.zoomSettings.enable ? !isNullOrUndefined(this.maps.zoomShapeCollection) &&
            this.maps.zoomShapeCollection.length > 0 : this.maps.zoomSettings.enable;
        this.maps.translateType = 'labels';
        for (let j = 0; j < properties.length; j++) {
            if (shapeProperties[properties[j]]) {
                propertyPath = properties[j];
                datasrcObj = this.getDataLabel(layer.dataSource, labelpath, shapeData['properties'][propertyPath], layer.shapeDataPath);
                if (datasrcObj) {
                    break;
                }
            }
        }
        datasrcObj = this.getDataLabel(layer.dataSource, labelpath, shapeData['properties'][propertyPath], layer.shapeDataPath);
        if (!isNullOrUndefined(shapes['property']) && ((shapeProperties[labelpath]) || datasrcObj)) {
            shapePoint = [[]];
            if (!layerData[index]['_isMultiPolygon'] && layerData[index]['type'] !== 'Point') {
                shapePoint.push(this.getPoint(layerData[index], []));
                currentLength = shapePoint[shapePoint.length - 1].length;
                if (pointsLength < currentLength) {
                    pointsLength = currentLength;
                    midIndex = shapePoint.length - 1;
                }
            }
            else {
                let layer = layerData[index];
                if (layer['type'] === 'Point') {
                    isPoint = true;
                    let layerPoints = [];
                    layerPoints.push(this.getPoint(layerData, []));
                    shapePoint = layerPoints;
                    currentLength = shapePoint[shapePoint.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoint.length - 1;
                    }
                }
                for (let j = 0; j < layer.length; j++) {
                    shapePoint.push(this.getPoint(layer[j], []));
                    currentLength = shapePoint[shapePoint.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoint.length - 1;
                    }
                }
            }
        }
        text = (!isNullOrUndefined(datasrcObj)) ? !isNullOrUndefined(datasrcObj[labelpath]) ?
            datasrcObj[labelpath].toString() : datasrcObj[labelpath] : shapeData['properties'][labelpath];
        let dataLabelText = text;
        let projectionType = this.maps.projectionType;
        if (isPoint) {
            location = {
                x: shapePoint[midIndex][index]['x'], y: shapePoint[midIndex][index]['y'],
                rightMin: 0, rightMax: 0, leftMin: 0, leftMax: 0,
                points: shapePoint[midIndex][index], topMax: 0, topMin: 0,
                bottomMax: 0, bottomMin: 0, height: 0
            };
        }
        else {
            location = findMidPointOfPolygon(shapePoint[midIndex], projectionType);
        }
        let firstLevelMapLocation = location;
        if (!isNullOrUndefined(text) && !isNullOrUndefined(location)) {
            if (zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied && dataLabel.template === '') {
                if (layerIndex > 0) {
                    for (let k = 0; k < this.maps.zoomLabelPositions.length; k++) {
                        if (this.maps.zoomLabelPositions[k]['dataLabelText'] === text) {
                            oldIndex = index;
                            index = k;
                            sublayerIndexLabel = true;
                            break;
                        }
                    }
                }
                locationX = location['x'];
                locationY = location['y'];
                location['x'] = ((location['x'] + zoomTransPoint['x']) * scale);
                location['y'] = ((location['y'] + zoomTransPoint['y']) * scale);
            }
            location['y'] = (this.maps.projectionType === 'Mercator') ? location['y'] : (-location['y']);
            if (!isNullOrUndefined(this.maps.format) && !isNaN(parseFloat(text))) {
                if (this.maps.useGroupingSeparator) {
                    text = Internalize(this.maps, parseFloat(text));
                    if (!isNullOrUndefined(datasrcObj)) {
                        datasrcObj[labelpath] = text;
                    }
                }
            }
            let eventargs = {
                name: dataLabelRendering, maps: this.maps, cancel: false, border: dataLabel.border, datalabel: dataLabel,
                fill: dataLabel.fill, template: dataLabel.template, text: text
            };
            if (this.maps.isBlazor) {
                const { maps, datalabel } = eventargs, blazorEventArgs = __rest$4(eventargs, ["maps", "datalabel"]);
                eventargs = blazorEventArgs;
            }
            this.maps.trigger('dataLabelRendering', eventargs, (labelArgs) => {
                if (eventargs.cancel) {
                    return;
                }
                let position = [];
                let width = zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied
                    && this.maps.zoomShapeCollection.length > index ? this.maps.zoomShapeCollection[index]['width'] :
                    (location['rightMax']['x'] - location['leftMax']['x']) * scale;
                if (!isNullOrUndefined(this.maps.dataLabelShape)) {
                    shapeWidth = firstLevelMapLocation['rightMax']['x'] - firstLevelMapLocation['leftMax']['x'];
                    this.maps.dataLabelShape.push(shapeWidth);
                }
                if (eventargs.text !== text && !eventargs.cancel) {
                    text = eventargs.text;
                }
                let textSize = measureText(text, style);
                let trimmedLable = text;
                let elementSize = textSize;
                let startY = location['y'] - textSize['height'] / 4;
                let endY = location['y'] + textSize['height'] / 4;
                let start = ((location['y'] + transPoint['y']) * scale) - textSize['height'] / 4;
                let end = ((location['y'] + transPoint['y']) * scale) + textSize['height'] / 4;
                position = filter(shapePoint[midIndex], startY, endY);
                if (!isPoint && position.length > 5 && (shapeData['geometry']['type'] !== 'MultiPolygon') &&
                    (shapeData['type'] !== 'MultiPolygon')) {
                    let location1 = findMidPointOfPolygon(position, projectionType);
                    if (zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied && eventargs.template === '') {
                        location1['x'] = ((this.maps.zoomLabelPositions[index]['location']['x'] + zoomTransPoint['x']) * scale);
                        location1['y'] = ((this.maps.zoomLabelPositions[index]['location']['y'] + zoomTransPoint['y']) * scale);
                    }
                    locationX = location1['x'];
                    location['x'] = location1['x'];
                    width = zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied
                        && this.maps.zoomShapeCollection.length > index ? this.maps.zoomShapeCollection[index]['width'] :
                        (location1['rightMax']['x'] - location1['leftMax']['x']) * scale;
                }
                let xpositionEnds = ((location['x'] + transPoint['x']) * scale) + textSize['width'] / 2;
                let xpositionStart = ((location['x'] + transPoint['x']) * scale) - textSize['width'] / 2;
                this.value[index] = { rightWidth: xpositionEnds, leftWidth: xpositionStart, heightTop: start, heightBottom: end };
                let labelElement;
                if (eventargs.template !== '') {
                    templateFn = getTemplateFunction(eventargs.template);
                    let templateElement = templateFn ? templateFn(!isNullOrUndefined(datasrcObj) ?
                        datasrcObj : shapeData['properties'], null, null, this.maps.element.id + '_LabelTemplate', false) : document.createElement('div');
                    templateElement.innerHTML = !templateFn ? eventargs.template : '';
                    labelElement = convertElementFromLabel(templateElement, labelId, !isNullOrUndefined(datasrcObj) ? datasrcObj : shapeData['properties'], index, this.maps);
                    labelElement.style.left = ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - location['x'])) * scale) + 'px';
                    labelElement.style.top = ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - location['y'])) * scale) + 'px';
                    labelTemplateElement.appendChild(labelElement);
                }
                else {
                    if (dataLabelSettings.smartLabelMode === 'Trim') {
                        trimmedLable = textTrim(width, text, style);
                        elementSize = measureText(trimmedLable, style);
                        options = new TextOption(labelId, textLocation.x, textLocation.y, 'middle', trimmedLable, '', '');
                    }
                    if (dataLabelSettings.smartLabelMode === 'None') {
                        options = new TextOption(labelId, (textLocation.x), textLocation.y, 'middle', text, '', '');
                    }
                    if (dataLabelSettings.smartLabelMode === 'Hide') {
                        text = (width >= textSize['width']) ? text : '';
                        options = new TextOption(labelId, (textLocation.x), (textLocation.y), 'middle', text, '', '');
                    }
                    text = options['text'];
                    if (dataLabelSettings.intersectionAction === 'Hide') {
                        for (let i = 0; i < intersect.length; i++) {
                            if (!isNullOrUndefined(intersect[i])) {
                                if (this.value[index]['leftWidth'] > intersect[i]['rightWidth']
                                    || this.value[index]['rightWidth'] < intersect[i]['leftWidth']
                                    || this.value[index]['heightTop'] > intersect[i]['heightBottom']
                                    || this.value[index]['heightBottom'] < intersect[i]['heightTop']) {
                                    text = text;
                                }
                                else {
                                    text = '';
                                    break;
                                }
                            }
                        }
                        intersect.push(this.value[index]);
                        options = new TextOption(labelId, textLocation.x, textLocation.y, 'middle', text, '', '');
                    }
                    let difference;
                    if (dataLabelSettings.intersectionAction === 'Trim') {
                        for (let j = 0; j < intersect.length; j++) {
                            if (!isNullOrUndefined(intersect[j])) {
                                if (intersect[j]['rightWidth'] < this.value[index]['leftWidth']
                                    || intersect[j]['leftWidth'] > this.value[index]['rightWidth']
                                    || intersect[j]['heightBottom'] < this.value[index]['heightTop']
                                    || intersect[j]['heightTop'] > this.value[index]['heightBottom']) {
                                    trimmedLable = text;
                                    difference = 0;
                                }
                                else {
                                    if (this.value[index]['leftWidth'] > intersect[j]['leftWidth']) {
                                        width = intersect[j]['rightWidth'] - this.value[index]['leftWidth'];
                                        difference = width - (this.value[index]['rightWidth'] - this.value[index]['leftWidth']);
                                        trimmedLable = textTrim(difference, text, style);
                                        break;
                                    }
                                    if (this.value[index]['leftWidth'] < intersect[j]['leftWidth']) {
                                        width = this.value[index]['rightWidth'] - intersect[j]['leftWidth'];
                                        difference = Math.abs(width - (this.value[index]['rightWidth'] - this.value[index]['leftWidth']));
                                        trimmedLable = textTrim(difference, text, style);
                                        break;
                                    }
                                }
                            }
                        }
                        elementSize = measureText(trimmedLable, style);
                        intersect.push(this.value[index]);
                        options = new TextOption(labelId, textLocation.x, (textLocation.y), 'middle', trimmedLable, '', '');
                    }
                    if (dataLabelSettings.intersectionAction === 'None') {
                        options = new TextOption(labelId, (textLocation.x), (textLocation.y), 'middle', text, '', '');
                    }
                    if (trimmedLable.length > 1) {
                        let border = eventargs.border;
                        if (border['width'] > 1) {
                            let fill = eventargs.fill;
                            let opacity = dataLabelSettings.opacity;
                            let rx = dataLabelSettings.rx;
                            let ry = dataLabelSettings.ry;
                            let x;
                            let y;
                            let padding = 5;
                            if (zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied) {
                                x = ((location['x'])) - textSize['width'] / 2;
                                y = ((location['y'])) - textSize['height'] / 2 - padding;
                            }
                            else {
                                x = ((location['x'] + transPoint['x']) * scale) - textSize['width'] / 2;
                                y = ((location['y'] + transPoint['y']) * scale) - textSize['height'] / 2;
                            }
                            let rectOptions = new RectOption(this.maps.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + index + '_rectIndex_' + index, fill, border, opacity, new Rect(x, y, textSize['width'], textSize['height']), rx, ry);
                            let rect = this.maps.renderer.drawRectangle(rectOptions);
                            group.appendChild(rect);
                        }
                    }
                    element = renderTextElement(options, style, style.color || this.maps.themeStyle.dataLabelFontColor, group);
                    if (zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied) {
                        element.setAttribute('transform', 'translate( ' + ((location['x'])) + ' '
                            + (((location['y']))) + ' )');
                        location['x'] = locationX;
                        location['y'] = locationY;
                    }
                    else {
                        element.setAttribute('transform', 'translate( ' + ((location['x'] + transPoint.x) * scale) + ' '
                            + (((location['y'] + transPoint.y) * scale) + (elementSize.height / 4)) + ' )');
                    }
                    group.appendChild(element);
                }
                this.dataLabelCollections.push({
                    location: { x: location['x'], y: location['y'] },
                    element: isNullOrUndefined(labelElement) ? element : labelElement,
                    layerIndex: layerIndex,
                    shapeIndex: sublayerIndexLabel ? oldIndex : index,
                    labelIndex: sublayerIndexLabel ? oldIndex : index,
                    dataLabelText: dataLabelText
                });
                if (labelTemplateElement.childElementCount > 0 && !this.maps.element.contains(labelTemplateElement)) {
                    document.getElementById(this.maps.element.id + '_Secondary_Element').appendChild(labelTemplateElement);
                }
            });
        }
    }
    getPoint(shapes, points) {
        shapes.map((current, index) => {
            points.push(new Point(current['point']['x'], current['point']['y']));
        });
        return points;
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'DataLabel';
    }
    /**
     * To destroy the layers.
     * @return {void}
     * @private
     */
    destroy(maps) {
        /**
         * Destroy method performed here
         */
    }
}

/**
 * navigation-selected-line
 */
class NavigationLine {
    constructor(maps) {
        this.maps = maps;
    }
    /* tslint:disable:no-string-literal */
    //tslint:disable:max-func-body-length
    /**
     * To render navigation line for maps
     */
    renderNavigation(layer, factor, layerIndex) {
        let navigationEle;
        let navigation;
        navigation = layer.navigationLineSettings;
        let longitude;
        let point = [];
        let latitude;
        let visible;
        let angle;
        let width;
        let color;
        let dashArray;
        let pathOption;
        let direction;
        let showArrow;
        let arrowColor;
        let arrowSize;
        let arrowSettings;
        let arrowPosition;
        let startArrow;
        let endArrow;
        let offSet;
        let offSetValue;
        let navigationGroup;
        let d;
        let group = (this.maps.renderer.createGroup({
            id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_line_Group'
        }));
        for (let i = 0; i < navigation.length; i++) {
            latitude = navigation[i]['properties']['latitude'];
            longitude = navigation[i]['properties']['longitude'];
            visible = navigation[i]['properties']['visible'];
            angle = navigation[i]['angle'];
            width = navigation[i]['width'] || 1;
            color = navigation[i]['color'];
            dashArray = navigation[i]['properties']['dashArray'];
            arrowSettings = navigation[i]['properties']['arrowSettings'];
            showArrow = (isNullOrUndefined(arrowSettings)) ? false : arrowSettings['properties']['showArrow'];
            if (longitude['length'] === latitude['length'] && visible) {
                for (let i = 0; i < longitude['length']; i++) {
                    let location = (this.maps.isTileMap) ? convertTileLatLongToPoint(new Point(longitude[i], latitude[i]), factor, this.maps.tileTranslatePoint, true) : convertGeoToPoint(latitude[i], longitude[i], factor, layer, this.maps);
                    point.push(location);
                }
            }
            navigationGroup = (this.maps.renderer.createGroup({
                id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_NavigationGroup' + i + ''
            }));
            for (let j = 0; j < point['length'] - 1; j++) {
                angle = (-1 > angle) ? -1 : angle;
                angle = (1 < angle) ? 1 : angle;
                let arcId = this.maps.element.id + '_LayerIndex_' + layerIndex + '_NavigationIndex_' + i + '_Line' + j + '';
                let radius = this.convertRadius(point[j], point[j + 1]);
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
                    if (showArrow) {
                        arrowColor = arrowSettings['properties']['color'];
                        arrowSize = arrowSettings['properties']['size'];
                        offSetValue = (arrowSettings['properties']['offSet'] === undefined) ? 0 : arrowSettings['properties']['offSet'];
                        let divide = (Math.round(arrowSize / 2));
                        arrowPosition = arrowSettings['properties']['position'];
                        startArrow = (arrowPosition === 'Start') ? 'url(#triangle' + i + ')' : null;
                        endArrow = (arrowPosition === 'End') ? 'url(#triangle' + i + ')' : null;
                        if (offSet !== 0 && angle === 0) {
                            offSet = (arrowPosition === 'Start') ? offSetValue : -(offSetValue);
                        }
                        offSet = (isNullOrUndefined(offSet)) ? 0 : offSet;
                        let triId = this.maps.element.id + '_triangle';
                        let defElement = this.maps.renderer.createDefs();
                        defElement.innerHTML += '<marker id="' + 'triangle' + i + '"></marker>';
                        let markerEle = defElement.querySelector('#' + 'triangle' + i);
                        markerEle.setAttribute('markerWidth', (arrowSize.toString()));
                        markerEle.setAttribute('markerHeight', (arrowSize.toString()));
                        markerEle.setAttribute('refX', (divide - offSet).toString());
                        markerEle.setAttribute('refY', divide.toString());
                        markerEle.setAttribute('orient', 'auto');
                        let d2 = 'M 0,0  L 0,' + arrowSize + ' L ' + divide + ', ' + divide + ' Z';
                        pathOption = new PathOption(triId, arrowColor, width, color, 1, dashArray, d2);
                        navigationEle = this.maps.renderer.drawPath(pathOption);
                        markerEle.appendChild(navigationEle);
                        defElement.appendChild(markerEle);
                        navigationGroup.appendChild(defElement);
                    }
                    angle = Math.abs(angle);
                    d = (angle === 0) ? 'M ' + point[j]['x'] + ',' + point[j]['y'] + 'L ' + point[j + 1]['x']
                        + ',' + point[j + 1]['y'] + ' ' :
                        'M ' + point[j]['x'] + ',' + point[j]['y'] + ' A ' + (radius / 2 + (1 - angle) * radius / (angle * 10)) +
                            ' ' + (radius / 2 + (1 - angle) * radius / (angle * 10)) + ' ' + 0 + ',' + 0 + ','
                            + direction + ' , ' + point[j + 1]['x'] + ',' + point[j + 1]['y'] + ' ';
                    pathOption = new PathOption(arcId, 'none', width, color, 1, dashArray, d);
                    navigationEle = this.maps.renderer.drawPath(pathOption);
                    if (!isNullOrUndefined(arrowPosition)) {
                        (arrowPosition === 'Start') ? navigationEle.setAttribute('marker-start', startArrow)
                            : navigationEle.setAttribute('marker-end', endArrow);
                    }
                    maintainSelection(this.maps.selectedNavigationElementId, this.maps.navigationSelectionClass, navigationEle, 'navigationlineselectionMapStyle');
                    navigationGroup.appendChild(navigationEle);
                    group.appendChild(navigationGroup);
                }
            }
            point = [];
        }
        return group;
    }
    convertRadius(point1, point2) {
        let value1 = point2['x'] - point1['x'];
        let value2 = point2['y'] - point1['y'];
        let value = Math.sqrt((Math.pow(value1, 2) + Math.pow(value2, 2)));
        return value;
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'NavigationLine';
    }
    /**
     * To destroy the layers.
     * @return {void}
     * @private
     */
    destroy(maps) {
        /**
         * Destroy method performed here
         */
    }
}

/**
 * Legend module is used to render legend for the maps
 */
class Legend {
    constructor(maps) {
        this.legendBorderRect = new Rect(0, 0, 0, 0);
        this.totalPages = [];
        this.page = 0;
        this.currentPage = 0;
        this.legendItemRect = new Rect(0, 0, 0, 0);
        this.heightIncrement = 0;
        this.widthIncrement = 0;
        this.textMaxWidth = 0;
        this.shapeHighlightCollection = [];
        this.legendHighlightCollection = [];
        this.shapePreviousColor = [];
        this.selectedNonLegendShapes = [];
        this.shapeToggled = true;
        this.legendElement = null;
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * To calculate legend bounds and draw the legend shape and text.
     */
    renderLegend() {
        this.legendRenderingCollections = [];
        this.legendCollection = [];
        this.totalPages = [];
        this.widthIncrement = 0;
        this.heightIncrement = 0;
        this.defsElement = this.maps.renderer.createDefs();
        this.maps.svgObject.appendChild(this.defsElement);
        this.calculateLegendBounds();
        this.drawLegend();
    }
    /* tslint:disable-next-line:max-func-body-length */
    calculateLegendBounds() {
        let map = this.maps;
        let legend = map.legendSettings;
        this.legendCollection = [];
        let spacing = 10;
        let leftPadding = 10;
        let topPadding = map.mapAreaRect.y;
        this.legendRenderingCollections = [];
        Array.prototype.forEach.call(map.layersCollection, (layer, layerIndex) => {
            if (!isNullOrUndefined(layer.shapeData)) {
                let layerData = layer.shapeData['features'];
                let dataPath = layer.shapeDataPath;
                let propertyPath = layer.shapePropertyPath;
                let dataSource = layer.dataSource;
                let colorValuePath;
                let colorMapping;
                if (legend.type === 'Layers' && layer.visible) {
                    colorValuePath = layer.shapeSettings.colorValuePath;
                    colorMapping = layer.shapeSettings.colorMapping;
                    this.getLegends(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
                }
                else if (legend.type === 'Bubbles') {
                    for (let bubble of layer.bubbleSettings) {
                        if (bubble.visible) {
                            colorValuePath = bubble.colorValuePath;
                            colorMapping = bubble.colorMapping;
                            dataSource = bubble.dataSource;
                            this.getLegends(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
                        }
                    }
                }
                else {
                    this.getMarkersLegendCollections(layerIndex, layer.markerSettings);
                }
            }
        });
        if (this.legendCollection.length > 0) {
            for (let i = 0; i < this.legendCollection.length; i++) {
                let legendItem = this.legendCollection[i];
                let eventArgs = {
                    name: legendRendering, cancel: false, fill: legendItem['fill'], shape: legend.shape,
                    shapeBorder: legend.shapeBorder,
                    text: typeof legendItem['text'] === 'number' ? legendItem['text'].toString() : legendItem['text']
                };
                map.trigger('legendRendering', eventArgs);
                legendItem['fill'] = eventArgs.fill;
                legendItem['shape'] = eventArgs.shape;
                legendItem['shapeBorder'] = eventArgs.shapeBorder;
                legendItem['text'] = eventArgs.text;
                if (eventArgs.cancel) {
                    this.legendCollection.splice(i, 1);
                    i--;
                }
            }
        }
        let defaultSize = 25;
        let legendTitle = map.legendSettings.title.text;
        let titleTextStyle = map.legendSettings.titleStyle;
        if (this.legendCollection.length > 0) {
            let legendMode = legend.mode;
            let shapeX = 0;
            let shapeY = 0;
            let textX = 0;
            let textY = 0;
            let shapePadding = legend.shapePadding;
            let textPadding = 10;
            let shapeHeight = legend.shapeHeight;
            let shapeWidth = legend.shapeWidth;
            let shapeLocation = [];
            let textLocation = [];
            let position = legend.position;
            let labelAction = legend.labelDisplayMode;
            let arrangement = (legend.orientation === 'None') ? ((position === 'Top' || position === 'Bottom')
                ? 'Horizontal' : 'Vertical') : legend.orientation;
            let legendWidth = (legend.width.length > 1) ? (legend.width.indexOf('%') > -1) ? (map.availableSize.width / 100)
                * parseInt(legend.width, 10) : parseInt(legend.width, 10) : null;
            let legendHeight = (legend.height.length > 1) ? (legend.height.indexOf('%') > -1) ? (map.availableSize.height / 100) *
                parseInt(legend.height, 10) : parseInt(legend.height, 10) : null;
            let legendItemStartX;
            let legendItemStartY;
            let startX = 0;
            let startY = 0;
            let legendtitleSize = measureText(legendTitle, titleTextStyle);
            if (legendMode === 'Interactive') {
                let itemTextStyle = legend.textStyle;
                let rectWidth;
                let rectHeight;
                let legendLength = this.legendCollection.length;
                rectWidth = (arrangement === 'Horizontal') ? (isNullOrUndefined(legendWidth)) ? (map.mapAreaRect.width / legendLength) :
                    (legendWidth / legendLength) : (isNullOrUndefined(legendWidth)) ? defaultSize : legendWidth;
                rectHeight = (arrangement === 'Horizontal') ? (isNullOrUndefined(legendHeight)) ? defaultSize : legendHeight :
                    (isNullOrUndefined(legendHeight)) ? (map.mapAreaRect.height / legendLength) : (legendHeight / legendLength);
                startX = 0;
                startY = legendtitleSize.height + spacing;
                let position = legend.labelPosition;
                let textX = 0;
                let textY = 0;
                let textPadding = 10;
                let itemStartX = 0;
                let itemStartY = 0;
                let maxTextHeight = 0;
                let maxTextWidth = 0;
                for (let i = 0; i < this.legendCollection.length; i++) {
                    startX = (arrangement === 'Horizontal') ? (startX + rectWidth) : startX;
                    startY = (arrangement === 'Horizontal') ? startY : (startY + rectHeight);
                    let legendText = this.legendCollection[i]['text'];
                    let itemTextSize = new Size(0, 0);
                    if (labelAction === 'None') {
                        itemTextSize = measureText(legendText, itemTextStyle);
                    }
                    else if (labelAction === 'Trim') {
                        legendText = textTrim((arrangement === 'Horizontal' ? rectWidth : rectHeight), legendText, itemTextStyle);
                        itemTextSize = measureText(legendText, itemTextStyle);
                    }
                    else {
                        legendText = '';
                    }
                    maxTextHeight = Math.max(maxTextHeight, itemTextSize.height);
                    maxTextWidth = Math.max(maxTextWidth, itemTextSize.width);
                    if (itemTextSize.width > 0 && itemTextSize.height > 0) {
                        if (arrangement === 'Horizontal') {
                            textX = startX + (rectWidth / 2);
                            textY = (position === 'After') ? (startY + rectHeight + (itemTextSize.height / 2)) + textPadding :
                                (startY - textPadding);
                        }
                        else {
                            textX = (position === 'After') ? startX - (itemTextSize.width / 2) - textPadding
                                : (startX + rectWidth + itemTextSize.width / 2) + textPadding;
                            textY = startY + (rectHeight / 2) + (itemTextSize.height / 4);
                        }
                    }
                    if (i === 0) {
                        itemStartX = (arrangement === 'Horizontal') ? startX : (position === 'After') ?
                            textX - (itemTextSize.width / 2) : startX;
                        itemStartY = (arrangement === 'Horizontal') ? (position === 'After') ? startY :
                            textY - (itemTextSize.height / 2) : startY;
                        if (this.legendCollection.length === 1) {
                            legendWidth = (arrangement === 'Horizontal') ? Math.abs((startX + rectWidth) - itemStartX) :
                                (rectWidth + maxTextWidth + textPadding);
                            legendHeight = (arrangement === 'Horizontal') ? (rectHeight + (maxTextHeight / 2) + textPadding) :
                                Math.abs((startY + rectHeight) - itemStartY);
                        }
                    }
                    else if (i === this.legendCollection.length - 1) {
                        legendWidth = (arrangement === 'Horizontal') ? Math.abs((startX + rectWidth) - itemStartX) :
                            (rectWidth + maxTextWidth + textPadding);
                        legendHeight = (arrangement === 'Horizontal') ? (rectHeight + (maxTextHeight / 2) + textPadding) :
                            Math.abs((startY + rectHeight) - itemStartY);
                    }
                    this.legendRenderingCollections.push({
                        fill: this.legendCollection[i]['fill'], x: startX, y: startY,
                        width: rectWidth, height: rectHeight,
                        text: legendText, textX: textX, textY: textY,
                        textWidth: itemTextSize.width, textHeight: itemTextSize.height,
                        shapeBorder: this.legendCollection[i]['shapeBorder']
                    });
                }
                if (this.legendCollection.length === 1) {
                    legendHeight = rectHeight;
                    legendWidth = rectWidth;
                }
                this.legendItemRect = { x: itemStartX, y: itemStartY, width: legendWidth, height: legendHeight };
            }
            else {
                legendWidth = (isNullOrUndefined(legendWidth)) ? map.mapAreaRect.width : legendWidth;
                legendHeight = (isNullOrUndefined(legendHeight)) ? map.mapAreaRect.height : legendHeight;
                let j = 0;
                this.page = 0;
                for (let i = 0; i < this.legendCollection.length; i++) {
                    let legendItem = this.legendCollection[i];
                    if (isNullOrUndefined(this.totalPages[this.page])) {
                        this.totalPages[this.page] = { Page: (this.page + 1), Collection: [] };
                    }
                    let legendTextSize = measureText(legendItem['text'], legend.textStyle);
                    this.textMaxWidth = Math.max(this.textMaxWidth, legendTextSize.width);
                    if (i === 0) {
                        startX = shapeX = (leftPadding + (shapeWidth / 2));
                        startY = shapeY = topPadding + legendtitleSize.height + (shapeHeight > legendTextSize.height ? shapeHeight / 2
                            : (legendTextSize.height / 4));
                    }
                    else {
                        let maxSize = (legendTextSize.height > shapeHeight) ? legendTextSize.height : shapeHeight;
                        if (arrangement === 'Horizontal') {
                            let prvePositionX = (textLocation[j - 1].x + textLocation[j - 1].width) + textPadding + shapeWidth;
                            if ((prvePositionX + shapePadding + legendTextSize.width) > legendWidth) {
                                let nextPositionY = (textLocation[j - 1].y > (shapeLocation[j - 1].y + (shapeHeight / 2)) ?
                                    textLocation[j - 1].y : (shapeLocation[j - 1].y + (shapeHeight / 2))) + topPadding;
                                if ((nextPositionY + maxSize) > legendHeight) {
                                    this.getPageChanged();
                                    j = 0;
                                    shapeLocation = [];
                                    textLocation = [];
                                    shapeX = startX;
                                    shapeY = startY;
                                }
                                else {
                                    shapeX = (shapeLocation[0].x);
                                    shapeY = (nextPositionY + (maxSize / 2));
                                }
                            }
                            else {
                                shapeX = (prvePositionX - (shapeWidth / 2));
                                shapeY = (shapeLocation[j - 1]).y;
                            }
                        }
                        else {
                            let prevPositionY = textLocation[j - 1].y > shapeLocation[j - 1].y + (shapeHeight / 2) ?
                                textLocation[j - 1].y : shapeLocation[j - 1].y + (shapeHeight / 2);
                            if ((prevPositionY + topPadding + maxSize) > legendHeight) {
                                let nextPositionX = (textLocation[j - 1].x + this.textMaxWidth + textPadding);
                                if ((nextPositionX + shapePadding + legendTextSize.width) > legendWidth) {
                                    shapeX = startX;
                                    shapeY = startY;
                                    textLocation = [];
                                    shapeLocation = [];
                                    this.getPageChanged();
                                    j = 0;
                                }
                                else {
                                    shapeX = nextPositionX + (shapeWidth / 2);
                                    shapeY = (shapeLocation[0].y);
                                }
                            }
                            else {
                                shapeX = shapeLocation[j - 1].x;
                                shapeY = prevPositionY + topPadding + (shapeHeight / 2);
                            }
                        }
                    }
                    textX = shapeX + (shapeWidth / 2) + shapePadding;
                    textY = shapeY + (legendTextSize.height / 4);
                    shapeLocation.push({ x: shapeX, y: shapeY });
                    textLocation.push({ x: textX, y: textY, width: legendTextSize.width, height: (legendTextSize.height / 2) });
                    this.totalPages[this.page]['Collection'].push({
                        DisplayText: legendItem['text'],
                        ImageSrc: legendItem['imageSrc'],
                        Shape: { x: shapeX, y: shapeY },
                        Text: { x: textX, y: textY },
                        Fill: legendItem['fill'],
                        legendShape: legendItem['shape'],
                        shapeBorder: legendItem['shapeBorder'],
                        idIndex: i,
                        Rect: {
                            x: shapeLocation[j].x - (shapeWidth / 2),
                            y: (shapeLocation[j].y - (shapeHeight / 2)) < (textY - legendTextSize.height) ?
                                (shapeLocation[j].y - (shapeHeight / 2)) : (textY - legendTextSize.height),
                            width: Math.abs((shapeLocation[j].x - (shapeWidth / 2)) - (textX + legendTextSize.width)),
                            height: ((shapeHeight > legendTextSize.height) ? shapeHeight : legendTextSize.height)
                        }
                    });
                    j++;
                }
                let collection = this.totalPages[0]['Collection'];
                Array.prototype.forEach.call(collection, (legendObj, index) => {
                    let legendRect = new Rect(legendObj['Rect']['x'], legendObj['Rect']['y'], legendObj['Rect']['width'], legendObj['Rect']['height']);
                    if (index === 0) {
                        legendItemStartX = legendRect.x;
                        legendItemStartY = legendRect.y;
                    }
                    this.widthIncrement = Math.max(this.widthIncrement, Math.abs(legendItemStartX - (legendRect.x + legendRect.width)));
                    this.heightIncrement = Math.max(this.heightIncrement, Math.abs(legendItemStartY - (legendRect.y + legendRect.height)));
                });
                legendWidth = ((this.widthIncrement < legendWidth) ? this.widthIncrement : legendWidth);
                legendHeight = ((this.heightIncrement < legendHeight) ? this.heightIncrement : legendHeight);
                this.legendItemRect = {
                    x: collection[0]['Rect']['x'], y: collection[0]['Rect']['y'],
                    width: legendWidth, height: legendHeight
                };
            }
        }
    }
    /**
     *
     */
    getLegends(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath) {
        this.getRangeLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
        this.getEqualLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
        this.getDataLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
    }
    getPageChanged() {
        this.page++;
        if (isNullOrUndefined(this.totalPages[this.page])) {
            this.totalPages[this.page] = { Page: (this.page + 1), Collection: [] };
        }
    }
    /**
     * To draw the legend shape and text.
     */
    drawLegend() {
        let map = this.maps;
        let legend = map.legendSettings;
        let render = map.renderer;
        let textOptions;
        let textFont = legend.textStyle;
        this.legendGroup = render.createGroup({ id: map.element.id + '_Legend_Group' });
        if (legend.mode === 'Interactive') {
            for (let i = 0; i < this.legendRenderingCollections.length; i++) {
                let itemId = map.element.id + '_Legend_Index_' + i;
                let textId = map.element.id + '_Legend_Index_' + i + '_Text';
                let item = this.legendRenderingCollections[i];
                let bounds = new Rect(item['x'], item['y'], item['width'], item['height']);
                if (i === 0) {
                    this.renderLegendBorder();
                }
                let textLocation = new Point(item['textX'], item['textY']);
                textFont.color = (textFont.color !== null) ? textFont.color : this.maps.themeStyle.legendTextColor;
                let rectOptions = new RectOption(itemId, item['fill'], item['shapeBorder'], legend.opacity, bounds);
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'middle', item['text'], '', '');
                textFont.fontFamily = map.themeStyle.fontFamily || textFont.fontFamily;
                textFont.size = map.themeStyle.legendFontSize || textFont.size;
                renderTextElement(textOptions, textFont, textFont.color, this.legendGroup);
                this.legendGroup.appendChild(render.drawRectangle(rectOptions));
                this.legendToggle();
            }
        }
        else {
            this.drawLegendItem(this.currentPage);
        }
    }
    // tslint:disable-next-line:max-func-body-length
    drawLegendItem(page) {
        let map = this.maps;
        let legend = map.legendSettings;
        let spacing = 10;
        let shapeSize = new Size(legend.shapeWidth, legend.shapeHeight);
        let textOptions;
        let render = map.renderer;
        if (page >= 0 && page < this.totalPages.length) {
            if (querySelector(this.legendGroup.id, this.maps.element.id)) {
                remove(querySelector(this.legendGroup.id, this.maps.element.id));
            }
            for (let i = 0; i < this.totalPages[page]['Collection'].length; i++) {
                let collection = this.totalPages[page]['Collection'][i];
                let shapeBorder = collection['shapeBorder'];
                let legendElement = render.createGroup({ id: map.element.id + '_Legend_Index_' + collection['idIndex'] });
                let legendText = collection['DisplayText'];
                let shape = ((legend.type === 'Markers') ? ((isNullOrUndefined(collection['ImageSrc'])) ?
                    legend.shape : 'Image') : collection['legendShape']);
                let strokeColor = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine'
                    || legend.shape === 'Cross') ? isNullOrUndefined(legend.fill) ? '#000000' : legend.fill : shapeBorder.color;
                let strokeWidth = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine'
                    || legend.shape === 'Cross') ? (shapeBorder.width === 0) ?
                    1 : shapeBorder.width : shapeBorder.width;
                let shapeId = map.element.id + '_Legend_Shape_Index_' + collection['idIndex'];
                let textId = map.element.id + '_Legend_Text_Index_' + collection['idIndex'];
                let shapeLocation = collection['Shape'];
                let textLocation = collection['Text'];
                let imageUrl = ((isNullOrUndefined(collection['ImageSrc'])) ? legend.shape : collection['ImageSrc']);
                let renderOptions = new PathOption(shapeId, collection['Fill'], strokeWidth, strokeColor, legend.opacity, '');
                legend.textStyle.color = (legend.textStyle.color !== null) ? legend.textStyle.color :
                    this.maps.themeStyle.legendTextColor;
                legend.textStyle.fontFamily = map.themeStyle.fontFamily || legend.textStyle.fontFamily;
                legend.textStyle.size = map.themeStyle.legendFontSize || legend.textStyle.size;
                if (i === 0) {
                    this.renderLegendBorder();
                }
                legendElement.appendChild(drawSymbol(shapeLocation, shape, shapeSize, collection['ImageSrc'], renderOptions));
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'start', legendText, '', '');
                renderTextElement(textOptions, legend.textStyle, legend.textStyle.color, legendElement);
                this.legendGroup.appendChild(legendElement);
                if (i === (this.totalPages[page]['Collection'].length - 1)) {
                    let pagingGroup;
                    let width = spacing;
                    let height = (spacing / 2);
                    if (this.page !== 0) {
                        let pagingText = (page + 1) + '/' + this.totalPages.length;
                        let pagingFont = legend.textStyle;
                        let pagingTextSize = measureText(pagingText, pagingFont);
                        let leftPageX = (this.legendItemRect.x + this.legendItemRect.width) - pagingTextSize.width -
                            (width * 2) - spacing;
                        let rightPageX = (this.legendItemRect.x + this.legendItemRect.width);
                        let locY = (this.legendItemRect.y + this.legendItemRect.height) + (height / 2) + spacing;
                        let pageTextX = rightPageX - width - (pagingTextSize.width / 2) - (spacing / 2);
                        pagingGroup = render.createGroup({ id: map.element.id + '_Legend_Paging_Group' });
                        let leftPageElement = render.createGroup({ id: map.element.id + '_Legend_Left_Paging_Group' });
                        let rightPageElement = render.createGroup({ id: map.element.id + '_Legend_Right_Paging_Group' });
                        let rightPath = ' M ' + rightPageX + ' ' + locY + ' L ' + (rightPageX - width) + ' ' + (locY - height) +
                            ' L ' + (rightPageX - width) + ' ' + (locY + height) + ' z ';
                        let leftPath = ' M ' + leftPageX + ' ' + locY + ' L ' + (leftPageX + width) + ' ' + (locY - height) +
                            ' L ' + (leftPageX + width) + ' ' + (locY + height) + ' z ';
                        let leftPageOptions = new PathOption(map.element.id + '_Left_Page', '#a6a6a6', 0, '#a6a6a6', 1, '', leftPath);
                        leftPageElement.appendChild(render.drawPath(leftPageOptions));
                        let leftRectPageOptions = new RectOption(map.element.id + '_Left_Page_Rect', 'transparent', {}, 1, new Rect(leftPageX - (width / 2), (locY - (height * 2)), width * 2, spacing * 2), null, null, '', '');
                        leftPageElement.appendChild(render.drawRectangle(leftRectPageOptions));
                        this.wireEvents(leftPageElement);
                        let rightPageOptions = new PathOption(map.element.id + '_Right_Page', '#a6a6a6', 0, '#a6a6a6', 1, '', rightPath);
                        rightPageElement.appendChild(render.drawPath(rightPageOptions));
                        let rightRectPageOptions = new RectOption(map.element.id + '_Right_Page_Rect', 'transparent', {}, 1, new Rect((rightPageX - width), (locY - height), width, spacing), null, null, '', '');
                        rightPageElement.appendChild(render.drawRectangle(rightRectPageOptions));
                        this.wireEvents(rightPageElement);
                        pagingGroup.appendChild(leftPageElement);
                        pagingGroup.appendChild(rightPageElement);
                        let pageTextOptions = {
                            'id': map.element.id + '_Paging_Text',
                            'x': pageTextX,
                            'y': locY + (pagingTextSize.height / 4),
                            'fill': '#a6a6a6',
                            'font-size': '14px',
                            'font-style': pagingFont.fontStyle,
                            'font-family': pagingFont.fontFamily,
                            'font-weight': pagingFont.fontWeight,
                            'text-anchor': 'middle',
                            'transform': '',
                            'opacity': 1,
                            'dominant-baseline': ''
                        };
                        pagingGroup.appendChild(render.createText(pageTextOptions, pagingText));
                        this.legendGroup.appendChild(pagingGroup);
                    }
                    this.legendToggle();
                }
            }
        }
    }
    // tslint:disable-next-line:max-func-body-length
    legendHighLightAndSelection(targetElement, value) {
        let shapeIndex;
        let layerIndex;
        let dataIndex;
        let textEle;
        let legend = this.maps.legendSettings;
        textEle = legend.mode === 'Default' ? document.getElementById(targetElement.id.replace('Shape', 'Text')) :
            document.getElementById(targetElement.id + '_Text');
        let collection = this.maps.legendModule.legendCollection;
        let length;
        let selectLength = 0;
        let interactProcess = true;
        let idIndex = parseFloat(targetElement.id.charAt(targetElement.id.length - 1));
        this.updateLegendElement();
        let toggleLegendCheck = this.maps.toggledLegendId.indexOf(idIndex);
        if (this.maps.legendSettings.toggleLegendSettings.enable && value === 'highlight' && toggleLegendCheck !== -1) {
            let collectionIndex = this.getIndexofLegend(this.legendHighlightCollection, targetElement);
            if (collectionIndex !== -1) {
                this.legendHighlightCollection.splice(collectionIndex, 1);
            }
            this.removeLegendHighlightCollection();
            return null;
        }
        if (value === 'selection') {
            let multiSelectEnable = this.maps.layers[collection[0]['data'][0]['layerIndex']].selectionSettings.enableMultiSelect;
            this.shapeHighlightCollection = [];
            if (!this.maps.shapeSelections && !multiSelectEnable) {
                this.removeAllSelections();
                this.maps.shapeSelections = true;
            }
            if (this.maps.legendSelectionCollection.length > 0 && (!multiSelectEnable ? this.maps.shapeSelections : true)) {
                for (let k = 0; k < this.maps.legendSelectionCollection.length; k++) {
                    if (targetElement === this.maps.legendSelectionCollection[k]['legendElement']) {
                        this.maps.legendSelectionCollection[k]['legendElement'] = targetElement;
                        interactProcess = false;
                        this.removeLegendSelectionCollection(this.maps.legendSelectionCollection[k]['legendElement']);
                        this.maps.selectedLegendElementId.splice(this.maps.selectedLegendElementId.indexOf(idIndex), 1);
                        this.maps.legendSelectionCollection.splice(k, 1);
                        this.maps.legendSelection = this.maps.legendSelectionCollection.length > 0 ? false : true;
                        break;
                    }
                }
            }
        }
        else {
            if (this.maps.legendSelectionCollection.length > 0) {
                for (let k = 0; k < this.maps.legendSelectionCollection.length; k++) {
                    if ((targetElement.id.indexOf('_Legend_Shape') > -1 || targetElement.id.indexOf('_Legend_Index')) &&
                        targetElement === this.maps.legendSelectionCollection[k]['legendElement']) {
                        interactProcess = false;
                        break;
                    }
                    else {
                        this.removeLegendHighlightCollection();
                    }
                }
            }
            this.removeLegendHighlightCollection();
        }
        if (interactProcess) {
            for (let i = 0; i < collection.length; i++) {
                let idIndex = this.maps.legendSettings.mode === 'Interactive' ?
                    parseFloat(targetElement.id.split('_Legend_Index_')[1]) :
                    parseFloat(targetElement.id.split('_Legend_Shape_Index_')[1]);
                if (textEle.textContent === collection[i]['text'] && collection[i]['data'].length > 0
                    && idIndex === i) {
                    let layer = this.maps.layers[collection[i]['data'][0]['layerIndex']];
                    let enable;
                    let module;
                    let data;
                    if (!isNullOrUndefined(layer)) {
                        enable = (value === 'selection') ? layer.selectionSettings.enable : layer.highlightSettings.enable;
                        module = void 0;
                        module = (value === 'selection') ? layer.selectionSettings : layer.highlightSettings;
                        data = collection[i]['data'];
                    }
                    if (enable) {
                        for (let j = 0; j < data.length; j++) {
                            shapeIndex = data[j]['shapeIndex'];
                            layerIndex = data[j]['layerIndex'];
                            dataIndex = data[j]['dataIndex'];
                            let shapeEle = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                                layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
                            if (shapeEle !== null) {
                                let shapeMatch = true;
                                if (this.maps.legendSelectionCollection !== null) {
                                    for (let i = 0; i < this.maps.legendSelectionCollection.length; i++) {
                                        if (this.maps.legendSelectionCollection[i]['legendElement'] === targetElement) {
                                            shapeMatch = false;
                                            break;
                                        }
                                    }
                                }
                                if (value === 'highlight' && shapeMatch) {
                                    if (j === 0) {
                                        this.legendHighlightCollection = [];
                                        this.pushCollection(targetElement, this.legendHighlightCollection, collection[i], layer.shapeSettings);
                                    }
                                    length = this.legendHighlightCollection.length;
                                    let legendHighlightColor = this.legendHighlightCollection[length - 1]['legendOldFill'];
                                    this.legendHighlightCollection[length - 1]['MapShapeCollection']['Elements'].push(shapeEle);
                                    let shapeItemCount = this.legendHighlightCollection[length - 1]['MapShapeCollection']['Elements'].length - 1;
                                    let shapeOldFillColor = shapeEle.getAttribute('fill');
                                    this.legendHighlightCollection[length - 1]['shapeOldFillColor'].push(shapeOldFillColor);
                                    let shapeOldColor = this.legendHighlightCollection[length - 1]['shapeOldFillColor'][shapeItemCount];
                                    this.shapePreviousColor = this.legendHighlightCollection[length - 1]['shapeOldFillColor'];
                                    this.setColor(shapeEle, !isNullOrUndefined(module.fill) ? module.fill : shapeOldColor, module.opacity.toString(), module.border.color, module.border.width.toString(), 'highlight');
                                    this.setColor(targetElement, !isNullOrUndefined(module.fill) ? module.fill : legendHighlightColor, module.opacity.toString(), module.border.color, module.border.width.toString(), 'highlight');
                                }
                                else if (value === 'selection') {
                                    this.legendHighlightCollection = [];
                                    this.maps.legendSelectionClass = module;
                                    if (j === 0) {
                                        this.pushCollection(targetElement, this.maps.legendSelectionCollection, collection[i], layer.shapeSettings);
                                        this.maps.selectedLegendElementId.push(i);
                                    }
                                    selectLength = this.maps.legendSelectionCollection.length;
                                    let legendSelectionColor;
                                    legendSelectionColor = this.maps.legendSelectionCollection[selectLength - 1]['legendOldFill'];
                                    this.maps.legendSelectionCollection[selectLength - 1]['MapShapeCollection']['Elements'].push(shapeEle);
                                    this.maps.legendSelectionCollection[selectLength - 1]['shapeOldFillColor'] = this.shapePreviousColor;
                                    this.setColor(targetElement, !isNullOrUndefined(module.fill) ? module.fill : legendSelectionColor, module.opacity.toString(), module.border.color, module.border.width.toString(), 'selection');
                                    this.setColor(shapeEle, !isNullOrUndefined(module.fill) ? module.fill : legendSelectionColor, module.opacity.toString(), module.border.color, module.border.width.toString(), 'selection');
                                    if (this.maps.selectedElementId.indexOf(shapeEle.getAttribute('id')) === -1) {
                                        this.maps.selectedElementId.push(shapeEle.getAttribute('id'));
                                    }
                                    if (j === data.length - 1) {
                                        this.maps.legendSelection = false;
                                        this.removeLegend(this.maps.legendSelectionCollection);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    setColor(element, fill, opacity, borderColor, borderWidth, type) {
        if (type === 'selection') {
            maintainStyleClass('ShapeselectionMap', 'ShapeselectionMapStyle', fill, opacity, borderColor, borderWidth, this.maps);
            element.setAttribute('class', 'ShapeselectionMapStyle');
        }
        else {
            element.setAttribute('fill', fill);
            element.setAttribute('opacity', opacity);
            element.setAttribute('stroke', borderColor);
            element.setAttribute('stroke-width', (Number(borderWidth) / this.maps.scale).toString());
        }
    }
    pushCollection(targetElement, collection, oldElement, shapeSettings) {
        collection.push({
            legendElement: targetElement, legendOldFill: oldElement['fill'], legendOldOpacity: oldElement['opacity'],
            legendOldBorderColor: oldElement['borderColor'], legendOldBorderWidth: oldElement['borderWidth'],
            shapeOpacity: shapeSettings.opacity, shapeOldBorderColor: shapeSettings.border.color,
            shapeOldBorderWidth: shapeSettings.border.width
        });
        length = collection.length;
        collection[length - 1]['MapShapeCollection'] = { Elements: [] };
        collection[length - 1]['shapeOldFillColor'] = [];
    }
    removeLegend(collection) {
        for (let i = 0; i < collection.length; i++) {
            let item = collection[i];
            this.setColor(item['legendElement'], item['legendOldFill'], item['legendOldOpacity'], item['legendOldBorderColor'], item['legendOldBorderWidth'], 'highlight');
            let dataCount = item['MapShapeCollection']['Elements'].length;
            for (let j = 0; j < dataCount; j++) {
                let shapeFillColor = item['legendOldFill'].indexOf('url') !== -1
                    ? item['shapeOldFillColor'][j] : item['legendOldFill'];
                this.setColor(item['MapShapeCollection']['Elements'][j], shapeFillColor, item['shapeOpacity'], item['shapeOldBorderColor'], item['shapeOldBorderWidth'], 'highlight');
            }
        }
    }
    removeLegendHighlightCollection() {
        if (this.legendHighlightCollection.length > 0) {
            this.removeLegend(this.legendHighlightCollection);
            this.legendHighlightCollection = [];
        }
    }
    removeLegendSelectionCollection(targetElement) {
        if (this.maps.legendSelectionCollection.length > 0) {
            removeClass(targetElement);
            let shapeElements = this.shapesOfLegend(targetElement);
            let dataCount = shapeElements.length;
            for (let j = 0; j < dataCount; j++) {
                let shapeElement = getElement(shapeElements[j]);
                if (shapeElement.getAttribute('class') === 'ShapeselectionMapStyle') {
                    removeClass(shapeElement);
                    let selectedElementIdIndex;
                    selectedElementIdIndex = this.maps.selectedElementId.indexOf(shapeElement.id);
                    if (selectedElementIdIndex !== -1) {
                        this.maps.selectedElementId.splice(selectedElementIdIndex, 1);
                    }
                }
            }
        }
    }
    removeShapeHighlightCollection() {
        if (this.shapeHighlightCollection.length > 0) {
            for (let i = 0; i < this.shapeHighlightCollection.length; i++) {
                let item = this.shapeHighlightCollection[i];
                let removeFill = true;
                for (let j = 0; j < this.maps.legendSelectionCollection.length; j++) {
                    if (this.maps.legendSelectionCollection[j]['legendElement'] === item['legendElement']) {
                        removeFill = false;
                    }
                }
                if (removeFill) {
                    this.setColor(item['legendElement'], item['legendOldFill'], item['legendOldOpacity'], item['legendOldBorderColor'], item['legendOldBorderWidth'], 'highlight');
                }
            }
        }
    }
    // tslint:disable-next-line:max-func-body-length
    shapeHighLightAndSelection(targetElement, data, module, getValue, layerIndex) {
        if (data !== undefined) {
            this.updateLegendElement();
            this.shapeToggled = true;
            let collection = this.maps.legendModule.legendCollection;
            let indexes = this.legendIndexOnShape(data, layerIndex);
            let shapeElement = this.shapeDataOnLegend(targetElement);
            let toggleLegendCheck = this.maps.toggledLegendId.indexOf(indexes['actualIndex']);
            if (this.maps.legendSettings.toggleLegendSettings.enable && toggleLegendCheck !== -1) {
                this.shapeToggled = false;
                this.legendHighlightCollection = [];
                let collectionIndex = this.getIndexofLegend(this.shapeHighlightCollection, shapeElement['LegendEle']);
                if (collectionIndex !== -1) {
                    this.shapeHighlightCollection.splice(collectionIndex, 1);
                }
                this.removeShapeHighlightCollection();
                return null;
            }
            if (indexes['currentIndex'] === undefined && indexes['actualIndex'] === undefined) {
                this.removeShapeHighlightCollection();
                return null;
            }
            if (indexes['currentIndex'] === undefined && getValue === 'selection'
                && !this.maps.layers[layerIndex].selectionSettings.enableMultiSelect &&
                targetElement.getAttribute('class') !== 'ShapeselectionMapStyle') {
                this.maps.legendSelection = false;
            }
            if (getValue === 'selection' && !this.maps.layers[layerIndex].selectionSettings.enableMultiSelect &&
                !this.maps.legendSelection) {
                this.removeAllSelections();
                this.maps.legendSelection = true;
            }
            if (indexes['currentIndex'] === undefined) {
                if (getValue === 'selection' && indexes['actualIndex'] !== undefined) {
                    let checkSelection = 0;
                    for (let i = 0; i < shapeElement['Elements'].length; i++) {
                        if (shapeElement['Elements'][i].getAttribute('class') === 'ShapeselectionMapStyle') {
                            checkSelection++;
                        }
                    }
                    let selectionIndex = this.maps.selectedLegendElementId.indexOf(indexes['actualIndex']);
                    if (selectionIndex === -1) {
                        this.maps.selectedLegendElementId.push(indexes['actualIndex']);
                        this.maps.legendSelectionClass = module;
                    }
                    else {
                        if ((checkSelection <= 1) && targetElement.getAttribute('class') === 'ShapeselectionMapStyle') {
                            if (!this.maps.layers[layerIndex].selectionSettings.enableMultiSelect) {
                                this.maps.selectedLegendElementId.splice(selectionIndex, 1);
                            }
                            else {
                                if (checkSelection <= 1 && targetElement.getAttribute('class') === 'ShapeselectionMapStyle') {
                                    this.maps.selectedLegendElementId.splice(selectionIndex, 1);
                                }
                            }
                        }
                    }
                }
                this.removeShapeHighlightCollection();
                return null;
            }
            let text = collection[indexes['actualIndex']]['text'];
            let content;
            let legendShape;
            if (this.maps.legendSettings.mode === 'Default') {
                if (indexes['currentIndex'] !== undefined) {
                    content = document.getElementById(this.maps.element.id + '_Legend_Text_Index_' + indexes['actualIndex']).textContent;
                    legendShape = document.getElementById(this.maps.element.id + '_Legend_Shape_Index_' + indexes['actualIndex']);
                }
            }
            else {
                content = document.getElementById(this.maps.element.id + '_Legend_Index_' + indexes['actualIndex']
                    + '_Text').textContent;
                legendShape = document.getElementById(this.maps.element.id + '_Legend_Index_' + indexes['actualIndex']);
            }
            this.oldShapeElement = shapeElement['LegendEle'];
            let length = this.maps.legendSelectionCollection.length;
            if (text === content) {
                let shapeMatched = true;
                if (this.maps.legendSelectionCollection) {
                    for (let i = 0; i < this.maps.legendSelectionCollection.length; i++) {
                        if (this.maps.legendSelectionCollection[i]['legendElement'] === shapeElement['LegendEle']) {
                            shapeMatched = false;
                            break;
                        }
                    }
                }
                if (getValue === 'highlight' && shapeMatched) {
                    let selectionEle = this.isTargetSelected(shapeElement, this.shapeHighlightCollection);
                    if (selectionEle === undefined || (selectionEle && !selectionEle['IsSelected'])) {
                        this.pushCollection(legendShape, this.shapeHighlightCollection, collection[indexes['actualIndex']], this.maps.layers[layerIndex].shapeSettings);
                    }
                    for (let j = 0; j < this.shapeHighlightCollection.length; j++) {
                        if (shapeElement['LegendEle'].id === this.shapeHighlightCollection[j]['legendElement'].id) {
                            this.shapeHighlightCollection[j]['legendElement'] = shapeElement['LegendEle'];
                        }
                    }
                    if (length > 0) {
                        for (let j = 0; j < length; j++) {
                            if (shapeElement['LegendEle'] === this.maps.legendSelectionCollection[j]['legendElement']) {
                                this.maps.legendSelectionCollection[j]['legendElement'] = shapeElement['LegendEle'];
                                this.removeShapeHighlightCollection();
                                break;
                            }
                            else if (j === length - 1) {
                                this.removeShapeHighlightCollection();
                                this.setColor(legendShape, !isNullOrUndefined(module.fill) ? module.fill : legendShape.getAttribute('fill'), module.opacity.toString(), module.border.color, module.border.width.toString(), 'highlight');
                            }
                        }
                    }
                    else {
                        this.removeShapeHighlightCollection();
                        this.setColor(legendShape, !isNullOrUndefined(module.fill) ? module.fill : legendShape.getAttribute('fill'), module.opacity.toString(), module.border.color, module.border.width.toString(), 'highlight');
                    }
                }
                else if (getValue === 'selection') {
                    let selectionEle = this.isTargetSelected(shapeElement, this.maps.legendSelectionCollection);
                    if (length > 0) {
                        let j = 0;
                        while (j < this.maps.legendSelectionCollection.length) {
                            if (shapeElement['LegendEle'] !== this.maps.legendSelectionCollection[j]['legendElement'] &&
                                !module.enableMultiSelect) {
                                let element = this.maps.legendSelectionCollection[j];
                                let selectedLegendIndex = this.maps.selectedLegendElementId.indexOf(indexes['actualIndex']);
                                this.maps.selectedLegendElementId.splice(selectedLegendIndex, 1);
                                this.maps.legendSelectionCollection.splice(j, 1);
                                removeClass(element['legendElement']);
                                this.maps.shapeSelections = true;
                                j = 0;
                            }
                            else {
                                j++;
                            }
                        }
                    }
                    if (selectionEle && (selectionEle['IsSelected'] && targetElement.getAttribute('class') === 'ShapeselectionMapStyle')) {
                        let element = this.maps.legendSelectionCollection[selectionEle['SelectionIndex']];
                        let multiSelection = 0;
                        if (module.enableMultiSelect) {
                            for (let i = 0; i < shapeElement['Elements'].length; i++) {
                                if (targetElement.getAttribute('class') === shapeElement['Elements'][i].getAttribute('class')) {
                                    multiSelection++;
                                }
                            }
                        }
                        if (multiSelection <= 1 && (!module.enableMultiSelect ?
                            this.maps.legendSelection : true)) {
                            this.maps.selectedLegendElementId.splice(this.maps.selectedLegendElementId.indexOf(indexes['actualIndex']), 1);
                            if (!isNullOrUndefined(shapeElement['LegendEle'])) {
                                removeClass(shapeElement['LegendEle']);
                            }
                            this.maps.legendSelectionCollection.splice(selectionEle['SelectionIndex'], 1);
                            this.maps.shapeSelections = true;
                        }
                    }
                    else {
                        if ((selectionEle === undefined || (selectionEle && !selectionEle['IsSelected'])) &&
                            !isNullOrUndefined(legendShape)) {
                            let legendSelectionIndex = this.getIndexofLegend(this.maps.legendSelectionCollection, legendShape);
                            if (legendSelectionIndex === -1) {
                                this.pushCollection(legendShape, this.maps.legendSelectionCollection, collection[indexes['actualIndex']], this.maps.layers[layerIndex].shapeSettings);
                            }
                        }
                        let addId = true;
                        for (let i = 0; i < this.maps.selectedLegendElementId.length; i++) {
                            if (indexes['actualIndex'] === this.maps.selectedLegendElementId[i]) {
                                addId = false;
                            }
                        }
                        if (addId) {
                            this.maps.selectedLegendElementId.push(indexes['actualIndex']);
                        }
                        this.maps.legendSelectionClass = module;
                        this.removeLegend(this.shapeHighlightCollection);
                        if (!isNullOrUndefined(legendShape)) {
                            this.setColor(legendShape, !isNullOrUndefined(module.fill) ? module.fill : legendShape.getAttribute('fill'), module.opacity.toString(), module.border.color, module.border.width.toString(), 'selection');
                            let legendSelectionIndex = this.getIndexofLegend(this.maps.legendSelectionCollection, legendShape);
                            this.maps.legendSelectionCollection[legendSelectionIndex]['MapShapeCollection']['Elements'].push(targetElement);
                        }
                        this.maps.shapeSelections = false;
                    }
                }
                else if (document.getElementsByClassName('highlightMapStyle').length > 0) {
                    this.removeShapeHighlightCollection();
                    removeClass(document.getElementsByClassName('highlightMapStyle')[0]);
                }
            }
        }
        else {
            this.removeShapeHighlightCollection();
        }
    }
    isTargetSelected(target, collection) {
        let selectEle;
        for (let i = 0; i < collection.length; i++) {
            if (!isNullOrUndefined(target['LegendEle'].getAttribute('id')) &&
                (target['LegendEle'].getAttribute('id') === collection[i]['legendElement'].getAttribute('id'))) {
                selectEle = { IsSelected: true, SelectionIndex: i };
            }
        }
        return selectEle;
    }
    updateLegendElement() {
        for (let i = 0; i < this.maps.legendSelectionCollection.length; i++) {
            if (document.getElementById(this.maps.legendSelectionCollection[i]['legendElement'].id)) {
                this.maps.legendSelectionCollection[i]['legendElement'] =
                    document.getElementById(this.maps.legendSelectionCollection[i]['legendElement'].id);
            }
        }
    }
    getIndexofLegend(targetCollection, targetElement) {
        let legendIndex = targetCollection.map((e) => { return e['legendElement']; }).indexOf(targetElement);
        return legendIndex;
    }
    removeAllSelections() {
        for (let i = 0; i < this.maps.selectedElementId.length; i++) {
            let selectedElement = document.getElementById(this.maps.selectedElementId[i]);
            removeClass(selectedElement);
        }
        for (let j = 0; j < this.maps.selectedLegendElementId.length; j++) {
            let idIndex = this.maps.legendSettings.mode === 'Interactive' ?
                'container_Legend_Index_' : 'container_Legend_Shape_Index_';
            let selectedElement = idIndex + this.maps.selectedLegendElementId[j];
            let legendElement = document.getElementById(selectedElement);
            if (!isNullOrUndefined(legendElement)) {
                removeClass(document.getElementById(selectedElement));
            }
        }
        this.maps.legendSelectionCollection = [];
        this.maps.selectedLegendElementId = [];
        this.maps.selectedElementId = [];
    }
    legendIndexOnShape(data, index) {
        let legendIndex;
        let actualIndex;
        let path = this.maps.layers[index].shapeDataPath;
        let value = data[path];
        let legendType = this.maps.legendSettings.mode;
        let collection = this.maps.legendModule.legendCollection;
        let currentCollection;
        if (legendType === 'Default' && !isNullOrUndefined(this.maps.legendModule.totalPages)) {
            currentCollection = this.maps.legendModule.totalPages[this.maps.legendModule.currentPage]['Collection'];
        }
        let currentCollectionLength = legendType === 'Default' ? currentCollection['length'] : 1;
        for (let i = 0; i < collection.length; i++) {
            let dataValue = collection[i]['data'];
            for (let k = 0; k < currentCollectionLength; k++) {
                if (legendType !== 'Default' || collection[i]['text'] === currentCollection[k]['DisplayText']) {
                    for (let j = 0; j < dataValue.length; j++) {
                        if (value === dataValue[j]['name']) {
                            legendIndex = k;
                        }
                    }
                }
            }
            for (let j = 0; j < dataValue.length; j++) {
                if (value === dataValue[j]['name']) {
                    actualIndex = i;
                }
            }
        }
        return { currentIndex: legendIndex, actualIndex: actualIndex };
    }
    shapeDataOnLegend(targetElement) {
        let shapeIndex;
        let layerIndex;
        let dataIndex;
        let collection = this.maps.legendModule.legendCollection;
        let legend = this.maps.legendSettings;
        for (let i = 0; i < collection.length; i++) {
            let data = collection[i]['data'];
            let process = false;
            let elements = [];
            let currentElement = { Elements: [] };
            for (let j = 0; j < data.length; j++) {
                shapeIndex = data[j]['shapeIndex'];
                layerIndex = data[j]['layerIndex'];
                dataIndex = data[j]['dataIndex'];
                let shapeEle = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                    layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
                if (targetElement === shapeEle) {
                    process = true;
                }
                elements.push(shapeEle);
            }
            if (process) {
                if (isNullOrUndefined(currentElement['LegendEle'])) {
                    currentElement['LegendEle'] = legend.mode === 'Default' ?
                        document.getElementById(this.maps.element.id + '_Legend_Shape_Index_' + i) :
                        document.getElementById(this.maps.element.id + '_Legend_Index_' + i);
                }
                currentElement['Elements'] = elements;
                return currentElement;
            }
        }
        return null;
    }
    shapesOfLegend(targetElement) {
        let shapeIndex;
        let layerIndex;
        let dataIndex;
        let idIndex = parseFloat(targetElement.id.charAt(targetElement.id.length - 1));
        let data = this.maps.legendModule.legendCollection[idIndex]['data'];
        let legendShapeElements = [];
        for (let i = 0; i < data.length; i++) {
            shapeIndex = data[i]['shapeIndex'];
            layerIndex = data[i]['layerIndex'];
            dataIndex = data[i]['dataIndex'];
            let shapeElement = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
            if (!isNullOrUndefined(shapeElement)) {
                legendShapeElements.push(shapeElement.id);
            }
        }
        return legendShapeElements;
    }
    //tslint:disable
    legendToggle() {
        let map = this.maps;
        let legend = map.legendSettings;
        if (this.maps.selectedLegendElementId) {
            // To maintain the state of legend selection during page resize.
            for (let j = 0; j < this.maps.selectedLegendElementId.length; j++) {
                let idIndex = legend.mode === 'Interactive' ? this.maps.element.id + '_Legend_Index_' : this.maps.element.id + '_Legend_Shape_Index_';
                let selectedElement = map.svgObject.querySelector('#' + idIndex + this.maps.selectedLegendElementId[j]);
                if (!isNullOrUndefined(selectedElement)) {
                    let fill = !isNullOrUndefined(this.maps.legendSelectionClass.fill) ?
                        this.maps.legendSelectionClass.fill : selectedElement.getAttribute('fill');
                    this.setColor(selectedElement, fill, this.maps.legendSelectionClass.opacity.toString(), this.maps.legendSelectionClass.border.color, this.maps.legendSelectionClass.border.width.toString(), 'selection');
                    for (let i = 0; i < this.maps.legendSelectionCollection.length; i++) {
                        if (this.maps.legendSelectionCollection[i]['legendElement'].id === selectedElement.id) {
                            this.maps.legendSelectionCollection[i]['legendElement'] = selectedElement;
                        }
                    }
                    let legendSelectionIndex = this.getIndexofLegend(this.maps.legendSelectionCollection, selectedElement);
                    if (legendSelectionIndex === -1) {
                        let layerIndex = this.maps.legendModule.legendCollection[this.maps.selectedLegendElementId[j]]['data'][j]['layerIndex'];
                        this.pushCollection(selectedElement, this.maps.legendSelectionCollection, this.maps.legendModule.legendCollection[this.maps.selectedLegendElementId[j]], this.maps.layers[layerIndex].shapeSettings);
                    }
                }
            }
            
        }
        if (this.maps.toggledLegendId) {
            for (let j = 0; j < this.maps.toggledLegendId.length; j++) {
                let legendTextId = legend.mode === 'Interactive' ? ('#' + this.maps.element.id + '_Legend_Index_' + this.maps.toggledLegendId[j] + '_Text') : ('#' + this.maps.element.id + '_Legend_Text_Index_' + this.maps.toggledLegendId[j]);
                let textElement = map.svgObject.querySelector(legendTextId);
                if (!isNullOrUndefined(textElement)) {
                    textElement.setAttribute("fill", "#E5E5E5");
                }
                let legendShapeId = legend.mode === 'Interactive' ? ('#' + this.maps.element.id + '_Legend_Index_' + this.maps.toggledLegendId[j]) : ('#' + this.maps.element.id + '_Legend_Shape_Index_' + this.maps.toggledLegendId[j]);
                let legendElement = map.svgObject.querySelector(legendShapeId);
                if (!isNullOrUndefined(legendElement)) {
                    legendElement.setAttribute("fill", "#E5E5E5");
                }
            }
        }
    }
    //tslint:disable
    renderLegendBorder() {
        let map = this.maps;
        let legend = map.legendSettings;
        let legendTitle = legend.title.text;
        let textStyle = legend.titleStyle;
        let textOptions;
        let spacing = 10;
        let trimTitle = textTrim((this.legendItemRect.width + (spacing * 2)), legendTitle, textStyle);
        let textSize = measureText(trimTitle, textStyle);
        this.legendBorderRect = new Rect((this.legendItemRect.x - spacing), (this.legendItemRect.y - spacing - textSize.height), (this.legendItemRect.width) + (spacing * 2), (this.legendItemRect.height) + (spacing * 2) + textSize.height +
            (legend.mode === 'Interactive' ? 0 : (this.page !== 0) ? spacing : 0));
        let renderOptions = new RectOption(map.element.id + '_Legend_Border', legend.background, legend.border, 1, this.legendBorderRect, null, null, '', '');
        this.legendGroup.appendChild(map.renderer.drawRectangle(renderOptions));
        this.getLegendAlignment(map, this.legendBorderRect.width, this.legendBorderRect.height, legend);
        this.legendGroup.setAttribute('transform', 'translate( ' + (this.translate.x + (-(this.legendBorderRect.x))) + ' ' +
            (this.translate.y + (-(this.legendBorderRect.y))) + ' )');
        map.svgObject.appendChild(this.legendGroup);
        if (legendTitle) {
            textStyle.color = (textStyle.color !== null) ? textStyle.color : this.maps.themeStyle.legendTextColor;
            textOptions = new TextOption(map.element.id + '_LegendTitle', (this.legendItemRect.x) + (this.legendItemRect.width / 2), this.legendItemRect.y - (textSize.height / 2) - spacing / 2, 'middle', trimTitle, '');
            renderTextElement(textOptions, textStyle, textStyle.color, this.legendGroup);
        }
    }
    changeNextPage(e) {
        this.currentPage = (e.target.id.indexOf('_Left_Page_') > -1) ? (this.currentPage - 1) :
            (this.currentPage + 1);
        this.legendGroup = this.maps.renderer.createGroup({ id: this.maps.element.id + '_Legend_Group' });
        this.drawLegendItem(this.currentPage);
        if (querySelector(this.maps.element.id + '_Legend_Border', this.maps.element.id)) {
            querySelector(this.maps.element.id + '_Legend_Border', this.maps.element.id).style.pointerEvents = 'none';
        }
    }
    getLegendAlignment(map, width, height, legend) {
        let x;
        let y;
        let spacing = 10;
        let totalRect;
        totalRect = extend({}, map.mapAreaRect, totalRect, true);
        let areaX = totalRect.x;
        let areaY = totalRect.y;
        let areaHeight = totalRect.height;
        let areaWidth = totalRect.width;
        let totalWidth = map.availableSize.width;
        let totalHeight = map.availableSize.height;
        if (legend.position === 'Float') {
            this.translate = legend.location;
        }
        else {
            switch (legend.position) {
                case 'Top':
                case 'Bottom':
                    totalRect.height = (areaHeight - height);
                    x = (totalWidth / 2) - (width / 2);
                    y = (legend.position === 'Top') ? areaY : (areaY + totalRect.height);
                    totalRect.y = (legend.position === 'Top') ? areaY + height + spacing : areaY;
                    break;
                case 'Left':
                case 'Right':
                    totalRect.width = (areaWidth - width);
                    x = (legend.position === 'Left') ? areaX : (areaX + totalRect.width) - spacing;
                    y = (totalHeight / 2) - (height / 2);
                    totalRect.x = (legend.position === 'Left') ? areaX + width : areaX;
                    break;
            }
            switch (legend.alignment) {
                case 'Near':
                    if (legend.position === 'Top' || legend.position === 'Bottom') {
                        x = totalRect.x;
                    }
                    else {
                        y = totalRect.y;
                    }
                    break;
                case 'Far':
                    if (legend.position === 'Top' || legend.position === 'Bottom') {
                        x = (totalWidth - width) - spacing;
                    }
                    else {
                        y = totalHeight - height;
                    }
                    break;
            }
            if ((legend.height || legend.width) && legend.mode !== 'Interactive') {
                map.totalRect = totalRect;
            }
            else {
                map.mapAreaRect = totalRect;
            }
            this.translate = new Point(x, y);
        }
    }
    getMarkersLegendCollections(layerIndex, markers) {
        Array.prototype.forEach.call(markers, (marker$$1, markerIndex) => {
            let dataSource = marker$$1.dataSource;
            let field = marker$$1.legendText;
            let templateFn;
            let isDuplicate;
            Array.prototype.forEach.call(dataSource, (data, dataIndex) => {
                let imageSrc = null;
                let showLegend = isNullOrUndefined(data[this.maps.legendSettings.showLegendPath]) ? true :
                    data[this.maps.legendSettings.showLegendPath];
                if (marker$$1.visible && showLegend && (!isNullOrUndefined(data['latitude'])) && (!isNullOrUndefined(data['longitude']))) {
                    if (marker$$1.template) {
                        templateFn = getTemplateFunction(marker$$1.template);
                        let templateElement = templateFn(this.maps);
                        let markerEle = isNullOrUndefined(templateElement.childElementCount) ? templateElement[0] :
                            templateElement;
                        imageSrc = markerEle.querySelector('img').src;
                    }
                    let text = isNullOrUndefined(data[field]) ? '' : data[field];
                    isDuplicate = this.maps.legendSettings.removeDuplicateLegend ?
                        this.removeDuplicates(this.legendCollection, text) : false;
                    if (!isDuplicate) {
                        this.legendCollection.push({
                            layerIndex: layerIndex, markerIndex: markerIndex, dataIndex: dataIndex,
                            fill: marker$$1.fill, text: text, imageSrc: imageSrc
                        });
                    }
                }
            });
        });
    }
    getRangeLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath) {
        let legendText;
        let legendIndex = 0;
        let fill = this.maps.legendSettings.fill;
        let rangeData = [];
        for (let colorMap of colorMapping) {
            if (!isNullOrUndefined(colorMap.from) && !isNullOrUndefined(colorMap.to)) {
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.from + ' - ' + colorMap.to;
                rangeData = [];
                let colorMapProcess = false;
                Array.prototype.forEach.call(dataSource, (data, dataIndex) => {
                    let colorValue = (colorValuePath.indexOf(".") > -1) ? Number(getValueFromObject(data, colorValuePath)) :
                        parseFloat(data[colorValuePath]);
                    if (colorValue >= colorMap.from && colorValue <= colorMap.to) {
                        colorMapProcess = true;
                        rangeData.push(this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, colorValue));
                    }
                });
                if (!colorMapProcess) {
                    rangeData.push({
                        layerIndex: layerIndex, shapeIndex: null, dataIndex: null,
                        name: null, value: null
                    });
                }
                let legendFill = (isNullOrUndefined(fill)) ? Object.prototype.toString.call(colorMap.color) === '[object Array]' ?
                    !isNullOrUndefined(colorMap.value) ? colorMap.color[0] : this.legendGradientColor(colorMap, legendIndex) :
                    colorMap.color : fill;
                legendIndex++;
                this.getOverallLegendItemsCollection(legendText, legendFill, rangeData, colorMap.showLegend);
            }
        }
    }
    getOverallLegendItemsCollection(legendText, legendFill, legendData, showLegend) {
        let newColllection = [];
        let legend = this.maps.legendSettings;
        if (legendData.length > 0 && showLegend) {
            for (let i = 0; i < legendData.length; i++) {
                let collection = legendData[i];
                if (collection.length > 0) {
                    for (let j = 0; j < collection.length; j++) {
                        newColllection.push(collection[j]);
                    }
                }
                else {
                    newColllection.push(legendData[i]);
                }
                newColllection['_isVisible'] = true;
            }
            let isDuplicate = this.maps.legendSettings.removeDuplicateLegend ?
                this.removeDuplicates(this.legendCollection, legendText) : false;
            if (!isDuplicate) {
                this.legendCollection.push({
                    text: legendText, fill: legendFill, data: newColllection, opacity: legend.opacity,
                    borderColor: legend.shapeBorder.color, borderWidth: legend.shapeBorder.width
                });
            }
        }
    }
    removeDuplicates(legendCollection, text) {
        let isDuplicate = false;
        for (let i = 0; i < legendCollection.length; i++) {
            if (legendCollection[i]['text'] === text) {
                isDuplicate = true;
                break;
            }
            else {
                continue;
            }
        }
        return isDuplicate;
    }
    getEqualLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath) {
        let fill = this.maps.legendSettings.fill;
        let equalValues = [];
        let legendText;
        let equalData = [];
        let outOfRangeValues = [];
        let outOfRange = [];
        for (let colorMap of colorMapping) {
            if (!isNullOrUndefined(colorMap.value)) {
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.value;
                equalData = [];
                let eqaulColorProcess = false;
                Array.prototype.forEach.call(dataSource, (data, dataIndex) => {
                    let equalValue = ((colorValuePath.indexOf(".") > -1) ? (getValueFromObject(data, colorValuePath)) :
                        (data[colorValuePath]));
                    if (equalValue === colorMap.value) {
                        eqaulColorProcess = true;
                        if (equalValues.indexOf(equalValue) === -1) {
                            equalValues.push(equalValue);
                        }
                        equalData.push(this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, equalValue));
                    }
                    else {
                        if (outOfRangeValues.indexOf(equalValue) === -1) {
                            outOfRangeValues.push(equalValue);
                        }
                    }
                });
                for (let x = 0; x < equalValues.length; x++) {
                    for (let y = 0; y < outOfRangeValues.length; y++) {
                        if (equalValues[x] === outOfRangeValues[y]) {
                            let equalIndex = outOfRangeValues.indexOf(equalValues[x]);
                            outOfRangeValues.splice(equalIndex, 1);
                        }
                    }
                }
                if (!eqaulColorProcess) {
                    equalData.push({
                        layerIndex: layerIndex, shapeIndex: null, dataIndex: null,
                        name: null, value: null
                    });
                }
                let legendFill = (isNullOrUndefined(fill)) ? Object.prototype.toString.call(colorMap.color) === '[object Array]'
                    ? colorMap.color[0] : colorMap.color : fill;
                this.getOverallLegendItemsCollection(legendText, legendFill, equalData, colorMap.showLegend);
            }
            else if (isNullOrUndefined(colorMap.minOpacity) && isNullOrUndefined(colorMap.maxOpacity) && isNullOrUndefined(colorMap.value)
                && isNullOrUndefined(colorMap.from) && isNullOrUndefined(colorMap.to) && !isNullOrUndefined(colorMap.color)) {
                Array.prototype.forEach.call(dataSource, (data, dataIndex) => {
                    let equalValue = ((colorValuePath.indexOf(".") > -1) ? (getValueFromObject(data, colorValuePath)) :
                        (data[colorValuePath]));
                    for (let k = 0; k < outOfRangeValues.length; k++) {
                        if (equalValue === outOfRangeValues[k]) {
                            outOfRange.push(this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, equalValue));
                        }
                    }
                });
                if (outOfRangeValues.length === 0) {
                    let range = false;
                    Array.prototype.forEach.call(dataSource, (data, dataIndex) => {
                        range = false;
                        let rangeValue = data[colorValuePath];
                        for (let z = 0; z < colorMapping.length; z++) {
                            if (!isNullOrUndefined(rangeValue) && rangeValue !== 0) {
                                if (rangeValue >= colorMapping[z].from && rangeValue <= colorMapping[z].to) {
                                    range = true;
                                }
                            }
                            else if (!range) {
                                range = false;
                            }
                        }
                        if (!range) {
                            outOfRange.push(this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, rangeValue));
                        }
                    });
                }
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : 'Others';
                let outfill = ((Object.prototype.toString.call(colorMap.color) === '[object Array]'))
                    ? colorMap.color[0] : colorMap.color;
                let legendOutFill = outfill;
                this.getOverallLegendItemsCollection(legendText, legendOutFill, outOfRange, colorMap.showLegend);
            }
        }
    }
    getDataLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath) {
        let legendText;
        let fill = this.maps.legendSettings.fill;
        let valuePath = this.maps.legendSettings.valuePath;
        if (!isNullOrUndefined(colorValuePath) && !isNullOrUndefined(dataSource)) {
            Array.prototype.forEach.call(dataSource, (data, dataIndex) => {
                let showLegend = isNullOrUndefined(this.maps.legendSettings.showLegendPath) ?
                    true : isNullOrUndefined(data[this.maps.legendSettings.showLegendPath]) ?
                    false : data[this.maps.legendSettings.showLegendPath];
                let dataValue = ((colorValuePath.indexOf(".") > -1) ? (getValueFromObject(data, colorValuePath)) :
                    (data[colorValuePath]));
                let newData = [];
                let legendFill = (isNullOrUndefined(fill)) ? dataValue : fill;
                if (!isNullOrUndefined(dataValue) && colorMapping.length === 0) {
                    legendText = !isNullOrUndefined(data[valuePath]) ? ((valuePath.indexOf(".") > -1) ?
                        getValueFromObject(data, valuePath) : data[valuePath]) : ((dataPath.indexOf(".") > -1) ?
                        getValueFromObject(data, dataPath) : data[dataPath]);
                    newData.push(this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, dataValue));
                }
                this.getOverallLegendItemsCollection(legendText, legendFill, newData, showLegend);
            });
        }
    }
    interactiveHandler(e) {
        let target = e.target;
        let legend = this.maps.legendSettings;
        let id = this.maps.element.id + '_Interactive_Legend';
        let hoverId = legend.type === 'Layers' ? '_shapeIndex_' : (legend.type === 'Markers') ? '_MarkerIndex_' :
            '_BubbleIndex_';
        if (target.id.indexOf(hoverId) > 1) {
            let layerIndex = parseFloat(target.id.split('_LayerIndex_')[1].split('_')[0]);
            let dataIndex = parseFloat(target.id.split(/_dataIndex_/i)[1].split('_')[0]);
            let fill;
            let stroke;
            let strokeWidth;
            if (!(isNullOrUndefined(querySelector(id, this.maps.element.id)))) {
                remove(querySelector(id, this.maps.element.id));
            }
            let layer = this.maps.layersCollection[layerIndex];
            let markerVisible = (legend.type === 'Layers' ? layer.visible :
                legend.type === 'Markers' ? layer.markerSettings[parseFloat(target.id.split('_MarkerIndex_')[1].split('_')[0])].visible :
                    (this.maps.getBubbleVisible(this.maps.layersCollection[layerIndex])));
            if (legend.visible && this.legendRenderingCollections.length > 0
                && legend.mode === 'Interactive' && markerVisible) {
                let svgRect = this.maps.svgObject.getBoundingClientRect();
                for (let i = 0; i < this.legendCollection.length; i++) {
                    let currentData = this.legendCollection[i];
                    let legendElement = querySelector(this.maps.element.id + '_Legend_Index_' + i, this.maps.element.id);
                    let legendRect = legendElement.getBoundingClientRect();
                    let rect = new Rect(Math.abs(legendRect.left - svgRect.left), Math.abs(legendRect.top - svgRect.top), legendRect.width, legendRect.height);
                    fill = legendElement.getAttribute('fill');
                    stroke = legend.shapeBorder.color;
                    strokeWidth = legend.shapeBorder.width;
                    if (!isNullOrUndefined(currentData['data'])) {
                        let data = currentData['data'];
                        for (let j = 0; j < data.length; j++) {
                            if (dataIndex === data[j]['dataIndex'] && layerIndex === data[j]['layerIndex']) {
                                this.renderInteractivePointer(legend, fill, stroke, id, strokeWidth, rect);
                                break;
                            }
                        }
                    }
                }
            }
        }
        else {
            if (!(isNullOrUndefined(querySelector(id, this.maps.element.id)))) {
                remove(querySelector(id, this.maps.element.id));
            }
        }
    }
    renderInteractivePointer(legend, fill, stroke, id, strokeWidth, rect) {
        let path;
        let pathOptions;
        let locX;
        let locY;
        let height = 10;
        let width = 10;
        let direction = (legend.orientation === 'None') ? (legend.position === 'Top' || legend.position === 'Bottom')
            ? 'Horizontal' : 'Vertical' : legend.orientation;
        if (direction === 'Horizontal') {
            if (!legend.invertedPointer) {
                locX = rect.x + (rect.width / 2);
                locY = rect.y;
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY - height) +
                    ' L ' + (locX + width) + ' ' + (locY - height) + ' Z ';
            }
            else {
                locX = rect.x + (rect.width / 2);
                locY = rect.y + (rect.height);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY + height) +
                    ' L ' + (locX + width) + ' ' + (locY + height) + ' Z ';
            }
        }
        else {
            if (!legend.invertedPointer) {
                locX = rect.x + (rect.width);
                locY = rect.y + (rect.height / 2);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX + width) + ' ' + (locY - height) +
                    ' L ' + (locX + width) + ' ' + (locY + height) + ' z ';
            }
            else {
                locX = rect.x;
                locY = rect.y + (rect.height / 2);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY - height) +
                    ' L ' + (locX - width) + ' ' + (locY + height) + ' z ';
            }
        }
        pathOptions = new PathOption(id, fill, strokeWidth, stroke, 1, '', path);
        this.maps.svgObject.appendChild(this.maps.renderer.drawPath(pathOptions));
    }
    wireEvents(element) {
        EventHandler.add(element, Browser.touchStartEvent, this.changeNextPage, this);
    }
    addEventListener() {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.on(Browser.touchMoveEvent, this.interactiveHandler, this);
        this.maps.on(Browser.touchEndEvent, this.interactiveHandler, this);
        this.maps.on(click, this.legendClick, this);
    }
    legendClick(targetEle) {
        let legendShapeId;
        let legendTextId;
        let legendToggleFill = this.maps.legendSettings.toggleLegendSettings.fill;
        let legendToggleOpacity = this.maps.legendSettings.toggleLegendSettings.opacity;
        let legendToggleBorderColor = this.maps.legendSettings.toggleLegendSettings.border.color;
        let legendToggleBorderWidth = this.maps.legendSettings.toggleLegendSettings.border.width;
        if (targetEle.parentNode['id'].indexOf(this.maps.element.id + '_Legend_Index_') > -1) {
            let mapElement;
            let legendIndex = parseFloat(targetEle.parentElement.id.substr((this.maps.element.id + '_Legend_Index_').length));
            let selectedItem = this.legendCollection[legendIndex]['data'];
            let isVisible = selectedItem['_isVisible'];
            let shape;
            if (this.maps.legendSettings.toggleLegendSettings.enable && this.maps.legendSettings.type === "Bubbles") {
                for (let k = 0; k < this.maps.layers.length; k++) {
                    for (let j = 0; j < this.maps.layers[k].bubbleSettings.length; j++) {
                        for (let i = 0; i < selectedItem.length; i++) {
                            shape = this.legendCollection[legendIndex]['data'][i];
                            mapElement = querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                                '_BubbleIndex_' + j + '_dataIndex_' + shape['dataIndex'], this.maps.element.id);
                            if (isVisible && mapElement !== null) {
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    mapElement.setAttribute('fill', this.maps.layers[k].shapeSettings.fill);
                                    mapElement.setAttribute('stroke', this.maps.layers[k].shapeSettings.border.color);
                                    mapElement.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                    mapElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                }
                                else {
                                    mapElement.setAttribute("fill", legendToggleFill);
                                    mapElement.setAttribute("opacity", (legendToggleOpacity).toString());
                                    mapElement.setAttribute('stroke', legendToggleBorderColor);
                                    mapElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                }
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", "#E5E5E5");
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#E5E5E5");
                                }
                            }
                            else {
                                mapElement.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                mapElement.setAttribute('stroke', this.maps.layers[k].bubbleSettings[j].border.color);
                                mapElement.setAttribute('opacity', (this.maps.layers[k].bubbleSettings[j].opacity).toString());
                                mapElement.setAttribute('stroke-width', (this.maps.layers[k].bubbleSettings[j].border.width).toString());
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", this.legendCollection[legendIndex]['fill']);
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#757575");
                                }
                            }
                        }
                        selectedItem['_isVisible'] = isVisible ? false : true;
                    }
                }
            }
            if (this.maps.legendSettings.type === "Layers" && this.maps.legendSettings.toggleLegendSettings.enable) {
                let layerElement;
                this.removeCollections(targetEle, legendIndex);
                let toggledLegendIdIndex = this.maps.toggledLegendId.indexOf(legendIndex);
                if (toggledLegendIdIndex !== -1) {
                    isVisible = false;
                }
                
                for (let j = 0; j < this.maps.layers.length; j++) {
                    for (let i = 0; i < selectedItem.length; i++) {
                        shape = this.legendCollection[legendIndex]['data'][i];
                        layerElement = querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                            '_shapeIndex_' + shape['shapeIndex'] + '_dataIndex_' + shape['dataIndex'], this.maps.element.id);
                        if (layerElement !== null) {
                            let toggledShapeIdIndex = this.maps.toggledShapeElementId.indexOf(layerElement.id);
                            if (isVisible) {
                                if (i === 0) {
                                    this.maps.toggledLegendId.push(legendIndex);
                                }
                                if (toggledShapeIdIndex === -1) {
                                    this.maps.toggledShapeElementId.push(layerElement.id);
                                }
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    layerElement.setAttribute('fill', this.maps.layers[j].shapeSettings.fill);
                                    layerElement.setAttribute('opacity', (this.maps.layers[j].shapeSettings.opacity).toString());
                                    layerElement.setAttribute('stroke', this.maps.layers[j].shapeSettings.border.color);
                                    layerElement.setAttribute('stroke-width', (this.maps.layers[j].shapeSettings.border.width).toString());
                                }
                                else {
                                    layerElement.setAttribute("fill", legendToggleFill);
                                    layerElement.setAttribute("opacity", (legendToggleOpacity).toString());
                                    layerElement.setAttribute('stroke', legendToggleBorderColor);
                                    layerElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                }
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#E5E5E5");
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", "#E5E5E5");
                                }
                            }
                            else {
                                if (toggledLegendIdIndex !== -1 && i === 0) {
                                    this.maps.toggledLegendId.splice(toggledLegendIdIndex, 1);
                                }
                                if (toggledShapeIdIndex !== -1) {
                                    this.maps.toggledShapeElementId.splice(toggledShapeIdIndex, 1);
                                }
                                layerElement.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                layerElement.setAttribute('opacity', (this.maps.layers[j].shapeSettings.opacity).toString());
                                layerElement.setAttribute('stroke', this.maps.layers[j].shapeSettings.border.color);
                                layerElement.setAttribute('stroke-width', (this.maps.layers[j].shapeSettings.border.width).toString());
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#757575");
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", this.legendCollection[legendIndex]['fill']);
                                }
                            }
                        }
                    }
                }
                selectedItem['_isVisible'] = isVisible ? false : true;
            }
        }
        else if (!isNullOrUndefined(targetEle.id) && (targetEle.id.indexOf(this.maps.element.id + '_Legend_Shape_Index') > -1 ||
            targetEle.id.indexOf(this.maps.element.id + '_Legend_Index') !== -1) && this.maps.legendSettings.visible &&
            targetEle.id.indexOf('_Text') === -1) {
            let LegendInteractive;
            let legendIndex = parseFloat(targetEle.id.substr((this.maps.element.id + '_Legend_Index_').length));
            let mapdata;
            let selectedItem = this.legendCollection[legendIndex]['data'];
            let isVisible = selectedItem['_isVisible'];
            if (this.maps.legendSettings.type === "Bubbles" && this.maps.legendSettings.toggleLegendSettings.enable) {
                for (let k = 0; k < this.maps.layers.length; k++) {
                    for (let j = 0; j < this.maps.layers[k].bubbleSettings.length; j++) {
                        for (let i = 0; i < selectedItem.length; i++) {
                            mapdata = this.legendCollection[legendIndex]['data'][i];
                            LegendInteractive = querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                                '_BubbleIndex_' + j + '_dataIndex_' + mapdata['dataIndex'], this.maps.element.id);
                            if (isVisible && LegendInteractive !== null) {
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    LegendInteractive.setAttribute('fill', this.maps.layers[k].shapeSettings.fill);
                                    LegendInteractive.setAttribute('stroke', this.maps.layers[k].shapeSettings.border.color);
                                    LegendInteractive.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                    LegendInteractive.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                }
                                else {
                                    LegendInteractive.setAttribute("fill", legendToggleFill);
                                    LegendInteractive.setAttribute("opacity", (legendToggleOpacity).toString());
                                    LegendInteractive.setAttribute('stroke', legendToggleBorderColor);
                                    LegendInteractive.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                }
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#E5E5E5");
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", "#E5E5E5");
                                }
                            }
                            else {
                                LegendInteractive.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                LegendInteractive.setAttribute('stroke', this.maps.layers[k].bubbleSettings[j].border.color);
                                LegendInteractive.setAttribute('stroke-width', (this.maps.layers[k].bubbleSettings[j].border.width).toString());
                                LegendInteractive.setAttribute('opacity', (this.maps.layers[k].bubbleSettings[j].opacity).toString());
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", this.legendCollection[legendIndex]['fill']);
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#757575");
                                }
                            }
                        }
                        selectedItem['_isVisible'] = isVisible ? false : true;
                    }
                }
            }
            if (this.maps.legendSettings.type === "Layers" && this.maps.legendSettings.toggleLegendSettings.enable) {
                let mapLegendElement;
                this.removeCollections(targetEle, legendIndex);
                let toggleLegendIdIndex = this.maps.toggledLegendId.indexOf(legendIndex);
                if (toggleLegendIdIndex !== -1) {
                    isVisible = false;
                }
                
                for (let k = 0; k < this.maps.layers.length; k++) {
                    for (let i = 0; i < selectedItem.length; i++) {
                        mapdata = this.legendCollection[legendIndex]['data'][i];
                        mapLegendElement = querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                            '_shapeIndex_' + mapdata['shapeIndex'] + '_dataIndex_' + mapdata['dataIndex'], this.maps.element.id);
                        if (mapLegendElement !== null) {
                            let toggledShapeIdIndex = this.maps.toggledShapeElementId.indexOf(mapLegendElement.id);
                            if (isVisible) {
                                if (i === 0) {
                                    this.maps.toggledLegendId.push(legendIndex);
                                }
                                if (toggledShapeIdIndex === -1) {
                                    this.maps.toggledShapeElementId.push(mapLegendElement.id);
                                }
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    mapLegendElement.setAttribute('fill', this.maps.layers[0].shapeSettings.fill);
                                    mapLegendElement.setAttribute('stroke', this.maps.layers[0].shapeSettings.border.color);
                                    mapLegendElement.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                    mapLegendElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                }
                                else {
                                    mapLegendElement.setAttribute("fill", legendToggleFill);
                                    mapLegendElement.setAttribute("opacity", (legendToggleOpacity).toString());
                                    mapLegendElement.setAttribute('stroke', legendToggleBorderColor);
                                    mapLegendElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                }
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", "#E5E5E5");
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#E5E5E5");
                                }
                            }
                            else {
                                if (toggleLegendIdIndex !== -1 && i === 0) {
                                    this.maps.toggledLegendId.splice(toggleLegendIdIndex, 1);
                                }
                                if (toggledShapeIdIndex !== -1) {
                                    this.maps.toggledShapeElementId.splice(toggledShapeIdIndex, 1);
                                }
                                mapLegendElement.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                mapLegendElement.setAttribute('stroke', this.maps.layers[0].shapeSettings.border.color);
                                mapLegendElement.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                mapLegendElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#757575");
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", this.legendCollection[legendIndex]['fill']);
                                }
                            }
                        }
                    }
                }
                selectedItem['_isVisible'] = isVisible ? false : true;
            }
        }
    }
    removeCollections(targetEle, legendIndex) {
        this.removeLegendSelectionCollection(targetEle);
        let legendSelectionIndex = this.getIndexofLegend(this.maps.legendSelectionCollection, targetEle);
        if (legendSelectionIndex !== -1) {
            this.maps.legendSelectionCollection.splice(legendSelectionIndex, 1);
        }
        let legendHighlightIndex = this.getIndexofLegend(this.legendHighlightCollection, targetEle);
        if (legendHighlightIndex !== -1) {
            this.legendHighlightCollection.splice(legendSelectionIndex, 1);
        }
        let shapeHighlightIndex = this.getIndexofLegend(this.shapeHighlightCollection, targetEle);
        if (shapeHighlightIndex !== -1) {
            this.shapeHighlightCollection.splice(shapeHighlightIndex, 1);
        }
        let selectedIndex = this.maps.selectedLegendElementId.indexOf(legendIndex);
        if (selectedIndex !== -1) {
            this.maps.selectedLegendElementId.splice(selectedIndex, 1);
        }
    }
    removeEventListener() {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(Browser.touchMoveEvent, this.interactiveHandler);
        this.maps.off(Browser.touchEndEvent, this.interactiveHandler);
        this.maps.off(click, this.legendClick);
    }
    getLegendData(layerIndex, dataIndex, data, dataPath, layerData, shapePropertyPath, value) {
        let legendData = [];
        if (Object.prototype.toString.call(layerData) === '[object Array]') {
            for (let i = 0; i < layerData.length; i++) {
                let shapeData = layerData[i];
                let dataPathValue = (dataPath.indexOf(".") > -1) ? getValueFromObject(data, dataPath) : data[dataPath];
                let shapePath = checkPropertyPath(data[dataPath], shapePropertyPath, shapeData['properties']);
                if (shapeData['properties'][shapePath] === dataPathValue) {
                    legendData.push({
                        layerIndex: layerIndex, shapeIndex: i, dataIndex: dataIndex,
                        name: data[dataPath], value: value
                    });
                }
            }
        }
        return legendData;
    }
    legendGradientColor(colorMap, legendIndex) {
        let legendFillColor;
        let xmlns = 'http://www.w3.org/2000/svg';
        if (!isNullOrUndefined(colorMap.color) && typeof (colorMap.color) === 'object') {
            let linerGradientEle = document.createElementNS(xmlns, 'linearGradient');
            let opacity = 1;
            let position = this.maps.legendSettings.position;
            let x2;
            let y2;
            x2 = position === 'Top' || position === 'Bottom' ? '100' : '0';
            y2 = position === 'Top' || position === 'Bottom' ? '0' : '100';
            linerGradientEle.setAttribute('id', 'linear_' + legendIndex + '_' + this.maps.element.id);
            linerGradientEle.setAttribute('x1', 0 + '%');
            linerGradientEle.setAttribute('y1', 0 + '%');
            linerGradientEle.setAttribute('x2', x2 + '%');
            linerGradientEle.setAttribute('y2', y2 + '%');
            for (let b = 0; b < colorMap.color.length; b++) {
                let offsetColor = 100 / (colorMap.color.length - 1);
                let stopEle = document.createElementNS(xmlns, 'stop');
                stopEle.setAttribute('offset', b * offsetColor + '%');
                stopEle.setAttribute('stop-color', colorMap.color[b]);
                stopEle.setAttribute('stop-opacity', opacity.toString());
                linerGradientEle.appendChild(stopEle);
            }
            this.legendLinearGradient = linerGradientEle;
            let color = 'url(' + '#linear_' + legendIndex + '_' + this.maps.element.id + ')';
            this.defsElement.appendChild(linerGradientEle);
            legendFillColor = color;
        }
        return legendFillColor;
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'Legend';
    }
    /**
     * To destroy the legend.
     * @return {void}
     * @private
     */
    destroy(maps) {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    }
}

var __rest$5 = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
/**
 * Highlight module class
 */
/* tslint:disable:no-string-literal */
class Highlight {
    constructor(maps) {
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * To bind events for highlight module
     */
    addEventListener() {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.maps.on(Browser.touchStartEvent, this.mouseMove, this);
    }
    /**
     * To unbind events for highlight module
     */
    removeEventListener() {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(Browser.touchMoveEvent, this.mouseMove);
        this.maps.off(Browser.touchStartEvent, this.mouseMove);
    }
    /**
     * Public method for highlight module
     */
    addHighlight(layerIndex, name, enable) {
        let targetEle = getTargetElement(layerIndex, name, enable, this.maps);
        if (enable) {
            this.mapHighlight(targetEle, null, null);
        }
        else {
            removeClass(targetEle);
        }
    }
    mouseMove(e) {
        let targetEle = e.target;
        let layerIndex;
        let isTouch = e.pointerType === 'touch' || e.pointerType === '2' || (e.type.indexOf('touch') > -1);
        if ((targetEle.id.indexOf('LayerIndex') !== -1 || targetEle.id.indexOf('NavigationIndex') > -1) &&
            targetEle.getAttribute('class') !== 'ShapeselectionMapStyle' && !isTouch &&
            targetEle.getAttribute('class') !== 'MarkerselectionMapStyle' &&
            targetEle.getAttribute('class') !== 'BubbleselectionMapStyle' &&
            targetEle.getAttribute('class') !== 'navigationlineselectionMapStyle') {
            layerIndex = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
            let shapeData;
            let data;
            let shapeIn;
            let dataIndex;
            if (targetEle.id.indexOf('shapeIndex') > -1) {
                shapeIn = parseInt(targetEle.id.split('_shapeIndex_')[1].split('_')[0], 10);
                shapeData = this.maps.layers[layerIndex].shapeData['features'] ?
                    this.maps.layers[layerIndex].shapeData['features'][shapeIn]['properties'] : null;
                dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = isNullOrUndefined(dataIndex) ? null : this.maps.layers[layerIndex].dataSource[dataIndex];
                this.highlightSettings = this.maps.layers[layerIndex].highlightSettings;
            }
            else if (targetEle.id.indexOf('BubbleIndex') > -1) {
                let bubble = parseInt(targetEle.id.split('_BubbleIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex].bubbleSettings[bubble].dataSource[dataIndex];
                this.highlightSettings = this.maps.layers[layerIndex].bubbleSettings[bubble].highlightSettings;
            }
            else if (targetEle.id.indexOf('MarkerIndex') > -1) {
                let marker$$1 = parseInt(targetEle.id.split('_MarkerIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex].markerSettings[marker$$1].dataSource[dataIndex];
                this.highlightSettings = this.maps.layers[layerIndex].markerSettings[marker$$1].highlightSettings;
            }
            else {
                let index = parseInt(targetEle.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                layerIndex = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
                shapeData = null;
                data = {
                    latitude: this.maps.layers[layerIndex].navigationLineSettings[index].latitude,
                    longitude: this.maps.layers[layerIndex].navigationLineSettings[index].longitude
                };
                this.highlightSettings = this.maps.layers[layerIndex].navigationLineSettings[index].highlightSettings;
            }
            if (this.highlightSettings.enable) {
                if (this.maps.legendSettings.visible && targetEle.id.indexOf('_MarkerIndex_') === -1) {
                    this.maps.legendModule.shapeHighLightAndSelection(targetEle, data, this.highlightSettings, 'highlight', layerIndex);
                }
                let selectHighLight = targetEle.id.indexOf('shapeIndex') > -1 && this.maps.legendSettings.visible ?
                    this.maps.legendModule.shapeToggled : true;
                if (selectHighLight) {
                    this.mapHighlight(targetEle, shapeData, data);
                }
            }
            else {
                let element = document.getElementsByClassName('highlightMapStyle')[0];
                if (!isNullOrUndefined(element)) {
                    removeClass(element);
                    if (element.id.indexOf('NavigationIndex') > -1) {
                        let index = parseInt(element.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                        let layerIndex = parseInt(element.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
                        element.setAttribute('stroke-width', this.maps.layers[layerIndex].navigationLineSettings[index].width.toString());
                        element.setAttribute('stroke', this.maps.layers[layerIndex].navigationLineSettings[index].color);
                    }
                }
            }
        }
        else if (getElementsByClassName('highlightMapStyle').length > 0) {
            targetEle = getElementsByClassName('highlightMapStyle')[0];
            if (targetEle.id.indexOf('NavigationIndex') > -1) {
                let index = parseInt(targetEle.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                layerIndex = parseInt(targetEle.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
                targetEle.setAttribute('stroke-width', this.maps.layers[layerIndex].navigationLineSettings[index].width.toString());
                targetEle.setAttribute('stroke', this.maps.layers[layerIndex].navigationLineSettings[index].color);
            }
            removeClass(targetEle);
            if (this.maps.legendSettings.visible) {
                this.maps.legendModule.removeShapeHighlightCollection();
            }
        }
        else if ((targetEle.id.indexOf(this.maps.element.id + '_Legend_Shape_Index') !== -1 ||
            targetEle.id.indexOf(this.maps.element.id + '_Legend_Index') !== -1) &&
            this.maps.legendSettings.visible && targetEle.id.indexOf('_Text') === -1) {
            this.maps.legendModule.legendHighLightAndSelection(targetEle, 'highlight');
        }
        else {
            if (this.maps.legendSettings.visible) {
                this.maps.legendModule.removeLegendHighlightCollection();
            }
        }
    }
    mapHighlight(targetEle, shapeData, data) {
        let layerIndex = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
        let isMarkerSelect = false;
        if (targetEle.id.indexOf('MarkerIndex') > -1) {
            let marker$$1 = parseInt(targetEle.id.split('_MarkerIndex_')[1].split('_')[0], 10);
            isMarkerSelect = this.maps.layers[layerIndex].markerSettings[marker$$1].highlightSettings.enable;
        }
        let border = {
            color: this.highlightSettings.border.color,
            width: this.highlightSettings.border.width / (isMarkerSelect ? 1 : this.maps.scale)
        };
        let eventArgs = {
            opacity: this.highlightSettings.opacity,
            fill: targetEle.id.indexOf('NavigationIndex') === -1 ? !isNullOrUndefined(this.highlightSettings.fill)
                ? this.highlightSettings.fill : targetEle.getAttribute('fill') : 'none',
            border: border,
            name: itemHighlight,
            target: targetEle.id,
            cancel: false,
            shapeData: shapeData,
            data: data,
            maps: this.maps
        };
        if (this.maps.isBlazor) {
            const { shapeData, maps } = eventArgs, blazorEventArgs = __rest$5(eventArgs, ["shapeData", "maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(itemHighlight, eventArgs, () => {
            this.highlightMap(targetEle, eventArgs);
        });
    }
    highlightMap(targetEle, eventArgs) {
        if (targetEle.getAttribute('class') === 'highlightMapStyle') {
            return;
        }
        else {
            if (getElementsByClassName('highlightMapStyle').length > 0) {
                let elem = getElementsByClassName('highlightMapStyle')[0];
                removeClass(elem);
                if (elem.id.indexOf('NavigationIndex') > -1) {
                    let index = parseInt(elem.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                    let layerIndex = parseInt(elem.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
                    elem.setAttribute('stroke-width', this.maps.layers[layerIndex].navigationLineSettings[index].width.toString());
                    elem.setAttribute('stroke', this.maps.layers[layerIndex].navigationLineSettings[index].color);
                }
            }
            if (!getElement('highlightMap')) {
                document.body.appendChild(createStyle('highlightMap', 'highlightMapStyle', eventArgs));
            }
            else {
                customizeStyle('highlightMap', 'highlightMapStyle', eventArgs);
            }
            targetEle.setAttribute('class', 'highlightMapStyle');
        }
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'Highlight';
    }
    /**
     * To destroy the highlight.
     * @return {void}
     * @private
     */
    destroy(maps) {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    }
}

var __rest$6 = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
/**
 * Selection module class
 */
class Selection {
    /* tslint:disable:no-string-literal */
    constructor(maps) {
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * For binding events to selection module
     */
    addEventListener() {
        if (!this.maps.isDestroyed) {
            this.maps.on(click, this.mouseClick, this);
            this.maps.on(Browser.touchEndEvent, this.mouseClick, this);
        }
    }
    /**
     * For removing events from selection modue
     */
    removeEventListener() {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(click, this.mouseClick);
        this.maps.off(Browser.touchEndEvent, this.mouseClick);
    }
    mouseClick(targetElement) {
        if (!isNullOrUndefined(targetElement['type']) && targetElement['type'].indexOf('touch') !== -1 &&
            isNullOrUndefined(targetElement.id)) {
            targetElement = targetElement['target'];
        }
        if (!isNullOrUndefined(targetElement.id) && (targetElement.id.indexOf('LayerIndex') > -1 ||
            targetElement.id.indexOf('NavigationIndex') > -1)) {
            let layerIndex;
            let shapeData;
            let data;
            let shapeIndex;
            let dataIndex;
            layerIndex = parseInt(targetElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
            if (targetElement.id.indexOf('shapeIndex') > -1) {
                shapeIndex = parseInt(targetElement.id.split('_shapeIndex_')[1].split('_')[0], 10);
                shapeData = this.maps.layers[layerIndex].shapeData['features']['length'] > shapeIndex ?
                    this.maps.layers[layerIndex].shapeData['features'][shapeIndex]['properties'] : null;
                dataIndex = parseInt(targetElement.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = isNullOrUndefined(dataIndex) ? null : this.maps.layers[layerIndex].dataSource[dataIndex];
                this.selectionsettings = this.maps.layers[layerIndex].selectionSettings;
                this.selectionType = 'Shape';
            }
            else if (targetElement.id.indexOf('BubbleIndex') > -1) {
                let bubbleIndex = parseInt(targetElement.id.split('_BubbleIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetElement.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex].bubbleSettings[bubbleIndex].dataSource[dataIndex];
                this.selectionsettings = this.maps.layers[layerIndex].bubbleSettings[bubbleIndex].selectionSettings;
                this.selectionType = 'Bubble';
            }
            else if (targetElement.id.indexOf('MarkerIndex') > -1) {
                let markerIndex = parseInt(targetElement.id.split('_MarkerIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetElement.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex].markerSettings[markerIndex].dataSource[dataIndex];
                this.selectionsettings = this.maps.layers[layerIndex].markerSettings[markerIndex].selectionSettings;
                this.selectionType = 'Marker';
            }
            else {
                let index = parseInt(targetElement.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                shapeData = null;
                data = {
                    latitude: this.maps.layers[layerIndex].navigationLineSettings[index].latitude,
                    longitude: this.maps.layers[layerIndex].navigationLineSettings[index].longitude
                };
                this.selectionsettings = this.maps.layers[layerIndex].navigationLineSettings[index].selectionSettings;
                this.selectionType = 'navigationline';
            }
            if (this.selectionsettings.enable) {
                this.maps.mapSelect = targetElement ? true : false;
                if (this.maps.legendSettings.visible && targetElement.id.indexOf('_MarkerIndex_') === -1) {
                    this.maps.legendModule.shapeHighLightAndSelection(targetElement, data, this.selectionsettings, 'selection', layerIndex);
                }
                let shapeToggled = (targetElement.id.indexOf('shapeIndex') > -1 && this.maps.legendSettings.visible) ?
                    this.maps.legendModule.shapeToggled : true;
                if (shapeToggled) {
                    this.selectMap(targetElement, shapeData, data);
                }
            }
        }
        else if (this.maps.legendSettings.visible && !this.maps.legendSettings.toggleLegendSettings.enable &&
            !isNullOrUndefined(targetElement.id) && targetElement.id.indexOf('_Text') === -1 &&
            (targetElement.id.indexOf(this.maps.element.id + '_Legend_Shape_Index') > -1 ||
                targetElement.id.indexOf(this.maps.element.id + '_Legend_Index') !== -1)) {
            this.maps.legendModule.legendHighLightAndSelection(targetElement, 'selection');
        }
    }
    /**
     * Public method for selection
     */
    addSelection(layerIndex, name, enable) {
        let targetElement = getTargetElement(layerIndex, name, enable, this.maps);
        if (enable) {
            this.selectMap(targetElement, null, null);
        }
        else {
            removeClass(targetElement);
        }
    }
    /**
     * Method for selection
     */
    selectMap(targetElement, shapeData, data) {
        let selectionsettings = this.selectionsettings;
        let border = {
            color: this.selectionsettings.border.color,
            width: this.selectionsettings.border.width / (this.selectionType === 'Marker' ? 1 : this.maps.scale)
        };
        let eventArgs = {
            opacity: this.selectionsettings.opacity,
            fill: this.selectionType !== 'navigationline' ? this.selectionsettings.fill : 'none',
            border: border,
            name: itemSelection,
            target: targetElement.id,
            cancel: false,
            shapeData: shapeData,
            data: data,
            maps: this.maps
        };
        if (this.maps.isBlazor) {
            const { shapeData, maps } = eventArgs, blazorEventArgs = __rest$6(eventArgs, ["shapeData", "maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger('itemSelection', eventArgs, (observedArgs) => {
            if (!eventArgs.cancel) {
                if (targetElement.getAttribute('class') === this.selectionType + 'selectionMapStyle') {
                    removeClass(targetElement);
                    this.removedSelectionList(targetElement);
                    if (targetElement.id.indexOf('NavigationIndex') > -1) {
                        let index = parseInt(targetElement.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                        let layerIndex = parseInt(targetElement.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
                        targetElement.setAttribute('stroke-width', this.maps.layers[layerIndex].navigationLineSettings[index].width.toString());
                        targetElement.setAttribute('stroke', this.maps.layers[layerIndex].navigationLineSettings[index].color);
                    }
                }
                else {
                    let layetElement = getElementByID(this.maps.element.id + '_Layer_Collections');
                    if (!this.selectionsettings.enableMultiSelect &&
                        layetElement.getElementsByClassName(this.selectionType + 'selectionMapStyle').length > 0) {
                        let ele = layetElement.getElementsByClassName(this.selectionType + 'selectionMapStyle')[0];
                        removeClass(ele);
                        this.removedSelectionList(ele);
                        if (this.selectionType === 'Shape') {
                            let selectionLength = this.maps.selectedElementId.length;
                            for (let i = 0; i < selectionLength; i++) {
                                ele = layetElement.getElementsByClassName(this.selectionType + 'selectionMapStyle')[0];
                                removeClass(ele);
                                let selectedElementIdIndex = this.maps.selectedElementId.indexOf(ele.getAttribute('id'));
                                this.maps.selectedElementId.splice(selectedElementIdIndex, 1);
                            }
                        }
                        if (ele.id.indexOf('NavigationIndex') > -1) {
                            let index = parseInt(targetElement.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                            let layerIndex = parseInt(targetElement.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
                            ele.setAttribute('stroke-width', this.maps.layers[layerIndex].navigationLineSettings[index].width.toString());
                            ele.setAttribute('stroke', this.maps.layers[layerIndex].navigationLineSettings[index].color);
                        }
                    }
                    if (!getElement(this.selectionType + 'selectionMap')) {
                        document.body.appendChild(createStyle(this.selectionType + 'selectionMap', this.selectionType + 'selectionMapStyle', eventArgs));
                    }
                    else {
                        customizeStyle(this.selectionType + 'selectionMap', this.selectionType + 'selectionMapStyle', eventArgs);
                    }
                    targetElement.setAttribute('class', this.selectionType + 'selectionMapStyle');
                    if (targetElement.getAttribute('class') === 'ShapeselectionMapStyle') {
                        this.maps.shapeSelectionClass = getElement(this.selectionType + 'selectionMap');
                        this.maps.selectedElementId.push(targetElement.getAttribute('id'));
                    }
                    if (targetElement.getAttribute('class') === 'MarkerselectionMapStyle') {
                        this.maps.markerSelectionClass = getElement(this.selectionType + 'selectionMap');
                        this.maps.selectedMarkerElementId.push(targetElement.getAttribute('id'));
                    }
                    if (targetElement.getAttribute('class') === 'BubbleselectionMapStyle') {
                        this.maps.bubbleSelectionClass = getElement(this.selectionType + 'selectionMap');
                        this.maps.selectedBubbleElementId.push(targetElement.getAttribute('id'));
                    }
                    if (targetElement.getAttribute('class') === 'navigationlineselectionMapStyle') {
                        this.maps.navigationSelectionClass = getElement(this.selectionType + 'selectionMap');
                        this.maps.selectedNavigationElementId.push(targetElement.getAttribute('id'));
                    }
                }
            }
        });
    }
    /**
     * Remove legend selection
     */
    // private removeLegendSelection(legendCollection: Object[], targetElement: Element): void {
    //     let shape: Element;
    //     if (!this.selectionsettings.enableMultiSelect) {
    //        for (let i: number = 0; i < legendCollection.length; i++) {
    //             for (let data of legendCollection[i]['data']) {
    //                 shape = getElement(this.maps.element.id + '_LayerIndex_' + data['layerIndex'] +
    //                            '_shapeIndex_' + data['shapeIndex'] + '_dataIndex_' + data['dataIndex']);
    //                 removeClass(shape);
    //             }
    //         }
    //     }
    // }
    /**
     * Get module name.
     */
    removedSelectionList(targetElement) {
        if (this.selectionType === 'Shape') {
            this.maps.selectedElementId.splice(this.maps.selectedElementId.indexOf(targetElement.getAttribute('id')), 1);
        }
        if (this.selectionType === 'Bubble') {
            this.maps.selectedBubbleElementId.splice(this.maps.selectedBubbleElementId.indexOf(targetElement.getAttribute('id')), 1);
        }
        if (this.selectionType === 'Marker') {
            this.maps.selectedMarkerElementId.splice(this.maps.selectedMarkerElementId.indexOf(targetElement.getAttribute('id')), 1);
        }
        if (this.selectionType === 'navigationline') {
            this.maps.selectedBubbleElementId.splice(this.maps.selectedBubbleElementId.indexOf(targetElement.getAttribute('id')), 1);
        }
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'Selection';
    }
    /**
     * To destroy the selection.
     * @return {void}
     * @private
     */
    destroy(maps) {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    }
}

/**
 * Map Tooltip
 */
class MapsTooltip {
    constructor(maps) {
        this.maps = maps;
        this.tooltipId = this.maps.element.id + '_mapsTooltip';
        this.addEventListener();
    }
    /* tslint:disable:no-string-literal */
    //tslint:disable:max-func-body-length
    renderTooltip(e) {
        let pageX;
        let pageY;
        let target;
        let touchArg;
        let tooltipArgs;
        if (e.type.indexOf('touch') !== -1) {
            this.isTouch = true;
            touchArg = e;
            pageX = touchArg.changedTouches[0].pageX;
            pageY = touchArg.changedTouches[0].pageY;
            target = touchArg.target;
        }
        else {
            this.isTouch = e.pointerType === 'touch';
            pageX = e.pageX;
            pageY = e.pageY;
            target = e.target;
        }
        let option;
        let currentData = '';
        let targetId = target.id;
        let tooltipEle;
        let location;
        let templateData = [];
        let index = targetId.indexOf('_LayerIndex_') > -1 && parseFloat(targetId.split('_LayerIndex_')[1].split('_')[0]);
        let layer = this.maps.layersCollection[index];
        let tooltipContent = [];
        let markerFill;
        location = getMousePosition(pageX, pageY, this.maps.svgObject);
        this.tooltipTargetID = targetId;
        let istooltipRender = (targetId.indexOf('_shapeIndex_') > -1)
            || (targetId.indexOf('_MarkerIndex_') > -1) || (targetId.indexOf('_BubbleIndex_') > -1);
        if (istooltipRender) {
            if (targetId.indexOf('_shapeIndex_') > -1) {
                option = layer.tooltipSettings;
                option.textStyle.fontFamily = this.maps.themeStyle.fontFamily || option.textStyle.fontFamily;
                option.textStyle.opacity = this.maps.themeStyle.tooltipTextOpacity || option.textStyle.opacity;
                let shape = parseInt(targetId.split('_shapeIndex_')[1].split('_')[0], 10);
                if (isNullOrUndefined(layer.layerData) || isNullOrUndefined(layer.layerData[shape])) {
                    return;
                }
                let value = layer.layerData[shape]['property'];
                let isShape = false;
                let properties = (Object.prototype.toString.call(layer.shapePropertyPath) === '[object Array]' ?
                    layer.shapePropertyPath : [layer.shapePropertyPath]);
                if (!isNullOrUndefined(properties)) {
                    for (let k = 0; k < properties.length; k++) {
                        for (let i = 0; i < layer['dataSource']['length']; i++) {
                            let data = layer.dataSource[i];
                            let dataPath = (layer.shapeDataPath.indexOf('.') > -1) ?
                                (getValueFromObject(data, layer.shapeDataPath)) : data[layer.shapeDataPath];
                            let dataPathValue = isNullOrUndefined(dataPath) && isNaN(data[layer.shapeDataPath])
                                ? dataPath.toLowerCase() : dataPath;
                            let propertyValue = isNullOrUndefined(value[properties[k]])
                                && isNaN(value[properties[k]]) ? value[properties[k]].toLowerCase() :
                                value[properties[k]];
                            if (dataPathValue === propertyValue) {
                                isShape = true;
                                index = i;
                                k = properties.length;
                                break;
                            }
                        }
                    }
                    index = isShape ? index : null;
                    templateData = layer.dataSource[index];
                }
                if (option.visible && ((!isNullOrUndefined(index) && !isNaN(index)) || (!isNullOrUndefined(value)))) {
                    if (layer.tooltipSettings.format) {
                        currentData = this.formatter(layer.tooltipSettings.format, layer.dataSource[index]);
                    }
                    else {
                        let shapePath = checkPropertyPath(layer.shapeDataPath, layer.shapePropertyPath, value);
                        currentData = (!isNullOrUndefined(layer.dataSource) && !isNullOrUndefined(index)) ?
                            formatValue(((option.valuePath.indexOf('.') > -1) ?
                                (getValueFromObject(layer.dataSource[index], option.valuePath)) :
                                layer.dataSource[index][option.valuePath]), this.maps) : value[shapePath];
                        if (isNullOrUndefined(currentData)) {
                            currentData = (option.valuePath.indexOf('.') > -1) ?
                                (getValueFromObject(value, option.valuePath)) : value[option.valuePath];
                        }
                    }
                }
                //location.y = this.template(option, location);
            }
            else if (targetId.indexOf('_MarkerIndex_') > -1) {
                let markerIdex = parseInt(targetId.split('_MarkerIndex_')[1].split('_')[0], 10);
                let dataIndex = parseInt(targetId.split('_MarkerIndex_')[1].split('_')[2], 10);
                let marker$$1 = layer.markerSettings[markerIdex];
                option = marker$$1.tooltipSettings;
                templateData = marker$$1.dataSource[dataIndex];
                if (option.visible && !isNaN(markerIdex)) {
                    if (marker$$1.tooltipSettings.format) {
                        currentData = this.formatter(marker$$1.tooltipSettings.format, marker$$1.dataSource[dataIndex]);
                    }
                    else {
                        if (marker$$1.template && !marker$$1.tooltipSettings.valuePath) {
                            currentData = marker$$1.template.split('>')[1].split('<')[0];
                        }
                        else {
                            currentData =
                                formatValue(((marker$$1.tooltipSettings.valuePath.indexOf('.') > -1) ?
                                    (getValueFromObject(marker$$1.dataSource[dataIndex], marker$$1.tooltipSettings.valuePath)) :
                                    marker$$1.dataSource[dataIndex][marker$$1.tooltipSettings.valuePath]), this.maps);
                        }
                    }
                }
                //location.y = this.template(option, location);
            }
            else if (targetId.indexOf('_BubbleIndex_') > -1) {
                let bubbleIndex = parseInt(targetId.split('_BubbleIndex_')[1].split('_')[0], 10);
                let dataIndex = parseInt(targetId.split('_BubbleIndex_')[1].split('_')[2], 10);
                let bubble = layer.bubbleSettings[bubbleIndex];
                option = bubble.tooltipSettings;
                templateData = bubble.dataSource[dataIndex];
                if (option.visible && !isNaN(dataIndex)) {
                    if (bubble.tooltipSettings.format) {
                        currentData = this.formatter(bubble.tooltipSettings.format, bubble.dataSource[dataIndex]);
                    }
                    else {
                        currentData =
                            formatValue(((bubble.tooltipSettings.valuePath.indexOf('.') > -1) ?
                                (getValueFromObject(bubble.dataSource[dataIndex], bubble.tooltipSettings.valuePath)) :
                                bubble.dataSource[dataIndex][bubble.tooltipSettings.valuePath]), this.maps);
                    }
                }
                //location.y = this.template(option, location);
            }
            if (document.getElementById(this.tooltipId)) {
                tooltipEle = document.getElementById(this.tooltipId);
            }
            else {
                tooltipEle = createElement('div', {
                    id: this.maps.element.id + '_mapsTooltip',
                    className: 'EJ2-maps-Tooltip',
                    styles: 'position: absolute;pointer-events:none;'
                });
                document.getElementById(this.maps.element.id + '_Secondary_Element').appendChild(tooltipEle);
            }
            if (option.template !== null && Object.keys(typeof option.template === 'object' ? option.template : {}).length === 1) {
                option.template = option.template[Object.keys(option.template)[0]];
            }
            templateData = this.setTooltipContent(option, templateData);
            let tooltipOption = {
                location: location, text: tooltipContent, data: templateData,
                textStyle: option.textStyle,
                template: option.template
            };
            tooltipArgs = {
                cancel: false, name: tooltipRender,
                options: tooltipOption,
                fill: option.fill,
                maps: this.maps,
                element: target, eventArgs: e
            };
            if (this.maps.isBlazor) {
                let tootipOption = {
                    location: location
                };
                const blazorArgs = {
                    name: tooltipRender,
                    cancel: false,
                    options: tootipOption,
                    data: templateData,
                    textStyle: tooltipArgs.options['textStyle'],
                    fill: tooltipArgs.fill,
                    element: target, eventArgs: e
                };
                this.maps.trigger(tooltipRender, blazorArgs, (args) => {
                    if (!blazorArgs.cancel && option.visible && !isNullOrUndefined(currentData) &&
                        (targetId.indexOf('_cluster_') === -1 && targetId.indexOf('_dataLabel_') === -1)) {
                        if (targetId.indexOf('MarkerIndex') > 0) {
                            
                        }
                        else if (targetId.indexOf('BubbleIndex') > 0) {
                            
                        }
                        else {
                            
                        }
                        this.maps['isProtectedOnChange'] = true;
                        if (blazorArgs.cancel) {
                            this.svgTooltip = new Tooltip({
                                enable: true,
                                header: '',
                                content: [currentData.toString()],
                                shapes: [],
                                location: tootipOption.location,
                                palette: [markerFill],
                                areaBounds: this.maps.mapAreaRect,
                                textStyle: tooltipArgs.options['textStyle'],
                                availableSize: this.maps.availableSize,
                                fill: tooltipArgs.fill,
                            });
                        }
                        else {
                            this.svgTooltip = new Tooltip({
                                enable: true,
                                header: '',
                                content: [currentData.toString()],
                                shapes: [],
                                location: tootipOption.location,
                                palette: [markerFill],
                                areaBounds: this.maps.mapAreaRect,
                                textStyle: blazorArgs.textStyle,
                                availableSize: this.maps.availableSize,
                                fill: blazorArgs.fill
                            });
                        }
                        this.svgTooltip.opacity = this.maps.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
                        this.svgTooltip.appendTo(tooltipEle);
                    }
                    else {
                        this.removeTooltip();
                    }
                });
            }
            else {
                this.maps.trigger(tooltipRender, tooltipArgs, (args) => {
                    if (!tooltipArgs.cancel && option.visible && !isNullOrUndefined(currentData) &&
                        (targetId.indexOf('_cluster_') === -1 && targetId.indexOf('_dataLabel_') === -1)) {
                        this.maps['isProtectedOnChange'] = true;
                        tooltipArgs.options['textStyle']['color'] = this.maps.themeStyle.tooltipFontColor
                            || tooltipArgs.options['textStyle']['color'];
                        if (tooltipArgs.cancel) {
                            this.svgTooltip = new Tooltip({
                                enable: true,
                                header: '',
                                data: option['data'],
                                template: option['template'],
                                content: [currentData.toString()],
                                shapes: [],
                                location: option['location'],
                                palette: [markerFill],
                                areaBounds: this.maps.mapAreaRect,
                                textStyle: option['textStyle'],
                                availableSize: this.maps.availableSize,
                                fill: option.fill || this.maps.themeStyle.tooltipFillColor,
                            });
                        }
                        else {
                            this.svgTooltip = new Tooltip({
                                enable: true,
                                header: '',
                                data: tooltipArgs.options['data'],
                                template: tooltipArgs.options['template'],
                                content: [currentData.toString()],
                                shapes: [],
                                location: tooltipArgs.options['location'],
                                palette: [markerFill],
                                areaBounds: this.maps.mapAreaRect,
                                textStyle: tooltipArgs.options['textStyle'],
                                availableSize: this.maps.availableSize,
                                fill: tooltipArgs.fill || this.maps.themeStyle.tooltipFillColor,
                            });
                        }
                        this.svgTooltip.opacity = this.maps.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
                        this.svgTooltip.appendTo(tooltipEle);
                    }
                    else {
                        this.removeTooltip();
                    }
                });
            }
            if (this.svgTooltip) {
                this.maps.trigger('tooltipRenderComplete', {
                    cancel: false, name: 'tooltipRenderComplete', maps: this.maps, options: tooltipOption,
                    element: this.svgTooltip.element
                });
            }
            if (this.svgTooltip) {
                this.maps.trigger('tooltipRenderComplete', {
                    cancel: false, name: 'tooltipRenderComplete', maps: this.maps, options: tooltipOption, element: this.svgTooltip.element
                });
            }
            else {
                this.removeTooltip();
            }
        }
        else {
            this.removeTooltip();
        }
    }
    /**
     * To get content for the current toolitp
     */
    setTooltipContent(options, templateData) {
        let localData = extend({}, templateData, null, true);
        if (this.maps.format && !isNaN(Number(localData[options.valuePath]))) {
            localData[options.valuePath] = Internalize(this.maps, Number(localData[options.valuePath]));
        }
        else {
            localData = Object.keys(localData).length ? localData : undefined;
        }
        return localData;
    }
    /*private template(tooltip: TooltipSettingsModel, location: MapLocation): number {
        location.y = (tooltip.template) ? location.y + 10 : location.y;
        return location.y;
    }*/
    formatter(format, data = {}) {
        let keys = Object.keys(data);
        for (let key of keys) {
            format = (typeof data[key] === 'object') ? convertStringToValue('', format, data, this.maps) :
                format.split('${' + key + '}').join(formatValue(data[key], this.maps));
        }
        return format;
    }
    mouseUpHandler(e) {
        this.renderTooltip(e);
        if (this.maps.tooltipDisplayMode === 'MouseMove') {
            clearTimeout(this.clearTimeout);
            this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
        }
    }
    removeTooltip() {
        if (document.getElementsByClassName('EJ2-maps-Tooltip').length > 0) {
            remove(document.getElementsByClassName('EJ2-maps-Tooltip')[0]);
        }
    }
    /**
     * To bind events for tooltip module
     */
    addEventListener() {
        if (this.maps.isDestroyed) {
            return;
        }
        if (this.maps.tooltipDisplayMode === 'DoubleClick') {
            this.maps.on('dblclick', this.renderTooltip, this);
        }
        else if (this.maps.tooltipDisplayMode === 'Click') {
            this.maps.on(Browser.touchEndEvent, this.mouseUpHandler, this);
        }
        else {
            this.maps.on(Browser.touchMoveEvent, this.renderTooltip, this);
        }
        this.maps.on(Browser.touchCancelEvent, this.removeTooltip, this);
    }
    removeEventListener() {
        if (this.maps.isDestroyed) {
            return;
        }
        if (this.maps.tooltipDisplayMode === 'DoubleClick') {
            this.maps.off('dblclick', this.removeTooltip);
        }
        else if (this.maps.tooltipDisplayMode === 'Click') {
            this.maps.off(Browser.touchEndEvent, this.mouseUpHandler);
        }
        else {
            this.maps.off(Browser.touchMoveEvent, this.renderTooltip);
        }
        this.maps.off(Browser.touchCancelEvent, this.removeTooltip);
    }
    /**
     * Get module name.
     */
    getModuleName() {
        return 'MapsTooltip';
    }
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    destroy(maps) {
        this.removeEventListener();
    }
}

var __rest$7 = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
/**
 * Zoom module used to process the zoom for maps
 */
/* tslint:disable:max-line-length */
class Zoom {
    constructor(maps) {
        this.isPanning = false;
        this.mouseEnter = false;
        this.isTouch = false;
        this.rectZoomingStart = false;
        this.pinchRect = new Rect(0, 0, 0, 0);
        this.browserName = Browser.info.name;
        this.isPointer = Browser.isPointer;
        this.handled = false;
        this.pinchFactor = 1;
        this.startTouches = [];
        this.shapeZoomLocation = [];
        this.intersect = [];
        this.mouseDownLatLong = { x: 0, y: 0 };
        this.mouseMoveLatLong = { x: 0, y: 0 };
        /**
         * @private
         */
        this.isSingleClick = false;
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
    performZooming(position, newZoomFactor, type) {
        let map = this.maps;
        map.previousProjection = map.projectionType;
        map.defaultState = false;
        map.initialCheck = false;
        map.markerZoomedState = false;
        map.zoomPersistence = map.enablePersistence;
        let prevLevel = map.tileZoomLevel;
        let scale = map.previousScale = map.scale;
        let maxZoom = map.zoomSettings.maxZoom;
        let minZoom = map.zoomSettings.minZoom;
        newZoomFactor = (minZoom > newZoomFactor && type === 'ZoomIn') ? minZoom + 1 : newZoomFactor;
        let prevTilePoint = map.tileTranslatePoint;
        if ((!map.isTileMap) && (type === 'ZoomIn' ? newZoomFactor >= minZoom && newZoomFactor <= maxZoom : newZoomFactor >= minZoom)) {
            let availSize = map.mapAreaRect;
            let minBounds = map.baseMapRectBounds['min'];
            let maxBounds = map.baseMapRectBounds['max'];
            let mapTotalWidth = Math.abs(minBounds['x'] - maxBounds['x']);
            let mapTotalHeight = Math.abs(minBounds['y'] - maxBounds['y']);
            let point = map.translatePoint;
            let translatePointX = point.x - (((availSize.width / scale) - (availSize.width / newZoomFactor)) / (availSize.width / position.x));
            let translatePointY = point.y - (((availSize.height / scale) - (availSize.height / newZoomFactor)) / (availSize.height / position.y));
            let currentHeight = Math.abs(map.baseMapRectBounds['max']['y'] - map.baseMapRectBounds['min']['y']) * newZoomFactor;
            translatePointX = (currentHeight < map.mapAreaRect.height) ? (availSize.x + ((-(minBounds['x'])) + ((availSize.width / 2) - (mapTotalWidth / 2)))) : translatePointX;
            translatePointY = (currentHeight < map.mapAreaRect.height) ? (availSize.y + ((-(minBounds['y'])) + ((availSize.height / 2) - (mapTotalHeight / 2)))) : translatePointY;
            map.translatePoint = new Point(translatePointX, translatePointY);
            map.scale = newZoomFactor;
            this.triggerZoomEvent(prevTilePoint, prevLevel, type);
            this.applyTransform();
        }
        else if ((map.isTileMap) && (newZoomFactor >= minZoom && newZoomFactor <= maxZoom)) {
            this.getTileTranslatePosition(prevLevel, newZoomFactor, position, type);
            map.tileZoomLevel = newZoomFactor;
            map.scale = Math.pow(2, newZoomFactor - 1);
            if (type === 'ZoomOut' && map.zoomSettings.resetToInitial && map.applyZoomReset && newZoomFactor <= map.initialZoomLevel) {
                map.initialCheck = true;
                map.zoomPersistence = false;
                map.tileTranslatePoint.x = map.initialTileTranslate.x;
                map.tileTranslatePoint.y = map.initialTileTranslate.y;
                newZoomFactor = map.tileZoomLevel = map.mapScaleValue = map.initialZoomLevel;
                map.scale = Math.pow(2, newZoomFactor - 1);
            }
            map.translatePoint.y = (map.tileTranslatePoint.y - (0.01 * map.scale)) / map.scale;
            map.translatePoint.x = (map.tileTranslatePoint.x - (0.01 * map.scale)) / map.scale;
            this.triggerZoomEvent(prevTilePoint, prevLevel, type);
            if (document.querySelector('.GroupElement')) {
                document.querySelector('.GroupElement').style.display = 'none';
            }
            if (document.getElementById(this.maps.element.id + '_LayerIndex_1')) {
                document.getElementById(this.maps.element.id + '_LayerIndex_1').style.display = 'none';
            }
            map.mapLayerPanel.generateTiles(newZoomFactor, map.tileTranslatePoint, type + 'wheel', null, position);
            let element1 = document.getElementById(this.maps.element.id + '_tiles');
            setTimeout(() => {
                // if (type === 'ZoomOut') {
                //     element1.removeChild(element1.children[element1.childElementCount - 1]);
                //     if (element1.childElementCount) {
                //         element1.removeChild(element1.children[element1.childElementCount - 1]);
                //     } else {
                //         element1 = element1;
                //     }
                // }
                this.applyTransform();
                if (document.getElementById(this.maps.element.id + '_LayerIndex_1')) {
                    document.getElementById(this.maps.element.id + '_LayerIndex_1').style.display = 'block';
                }
                // tslint:disable-next-line:align
            }, 250);
        }
        this.maps.zoomNotApplied = false;
    }
    triggerZoomEvent(prevTilePoint, prevLevel, type) {
        let map = this.maps;
        let zoomArgs;
        if (!map.isTileMap) {
            zoomArgs = {
                cancel: false, name: 'zoom', type: type, maps: !map.isBlazor ? map : null,
                tileTranslatePoint: {}, translatePoint: { previous: map.previousPoint, current: map.translatePoint },
                tileZoomLevel: {}, scale: { previous: map.previousScale, current: map.scale }
            };
        }
        else {
            zoomArgs = {
                cancel: false, name: 'zoom', type: type, maps: !map.isBlazor ? map : null,
                tileTranslatePoint: { previous: prevTilePoint, current: map.tileTranslatePoint }, translatePoint: { previous: map.previousPoint, current: map.translatePoint },
                tileZoomLevel: { previous: prevLevel, current: map.tileZoomLevel }, scale: { previous: map.previousScale, current: map.scale }
            };
        }
        map.trigger('zoom', zoomArgs);
    }
    getTileTranslatePosition(prevLevel, currentLevel, position, type) {
        let map = this.maps;
        let tileDefaultSize = 256;
        let padding = type === 'ZoomOut' ? 10 : (type === 'Reset' && currentLevel > 1) ? 0 : 10;
        let bounds = map.availableSize;
        let prevSize = Math.pow(2, prevLevel) * 256;
        let totalSize = Math.pow(2, currentLevel) * 256;
        let x = ((position.x - map.tileTranslatePoint.x) / prevSize) * 100;
        let y = ((position.y - map.tileTranslatePoint.y) / prevSize) * 100;
        map.tileTranslatePoint.x = (currentLevel === 1) ? (bounds.width / 2) - ((tileDefaultSize * 2) / 2) :
            position.x - ((x * totalSize) / 100);
        map.tileTranslatePoint.y = (currentLevel === 1) ? ((bounds.height / 2) - ((tileDefaultSize * 2) / 2) + (padding * 2)) :
            position.y - ((y * totalSize) / 100);
    }
    performRectZooming() {
        this.isDragZoom = true;
        let map = this.maps;
        let size = map.availableSize;
        map.previousProjection = map.projectionType;
        let prevLevel = map.tileZoomLevel;
        let prevTilePoint = map.tileTranslatePoint;
        let zoomRect = this.zoomingRect;
        let maxZoom = map.zoomSettings.maxZoom;
        let minZoom = map.zoomSettings.minZoom;
        if (zoomRect.height > 0 && zoomRect.width > 0) {
            let x = this.zoomingRect.x + (this.zoomingRect.width / 2);
            let y = this.zoomingRect.y + (this.zoomingRect.height / 2);
            let zoomCalculationFactor;
            if (!map.isTileMap) {
                let scale = map.previousScale = map.scale;
                zoomCalculationFactor = scale + Math.round((((size.width / zoomRect.width) + (size.height / zoomRect.height)) / 2));
                let translatePoint = map.previousPoint = map.translatePoint;
                let translatePointX = translatePoint.x - (((size.width / scale) - (size.width / zoomCalculationFactor)) / (size.width / x));
                let translatePointY = translatePoint.y - (((size.height / scale) - (size.height / zoomCalculationFactor)) / (size.height / y));
                map.translatePoint = new Point(translatePointX, translatePointY);
                map.scale = zoomCalculationFactor;
                this.triggerZoomEvent(prevTilePoint, prevLevel, '');
            }
            else {
                zoomCalculationFactor = prevLevel + (Math.round(prevLevel + (((size.width / zoomRect.width) + (size.height / zoomRect.height)) / 2)));
                zoomCalculationFactor = (zoomCalculationFactor >= minZoom && zoomCalculationFactor <= maxZoom) ? zoomCalculationFactor : maxZoom;
                this.getTileTranslatePosition(prevLevel, zoomCalculationFactor, { x: x, y: y });
                map.tileZoomLevel = zoomCalculationFactor;
                map.translatePoint.x = (map.tileTranslatePoint.x - (0.5 * Math.pow(2, zoomCalculationFactor))) /
                    (Math.pow(2, zoomCalculationFactor));
                map.translatePoint.y = (map.tileTranslatePoint.y - (0.5 * Math.pow(2, zoomCalculationFactor))) /
                    (Math.pow(2, zoomCalculationFactor));
                map.scale = (Math.pow(2, zoomCalculationFactor));
                this.triggerZoomEvent(prevTilePoint, prevLevel, '');
                map.mapLayerPanel.generateTiles(zoomCalculationFactor, map.tileTranslatePoint);
            }
            map.mapScaleValue = zoomCalculationFactor;
            this.applyTransform(true);
            this.maps.zoomNotApplied = false;
            this.zoomingRect = null;
        }
    }
    setInteraction(newInteraction) {
        this.lastScale = 1;
        this.interaction = newInteraction;
    }
    updateInteraction() {
        if (this.fingers === 2) {
            this.setInteraction('zoom');
        }
        else {
            this.setInteraction(null);
        }
    }
    performPinchZooming(e) {
        let map = this.maps;
        let prevLevel = map.tileZoomLevel;
        let availSize = map.mapAreaRect;
        map.previousScale = map.scale;
        map.previousPoint = map.translatePoint;
        let prevTilePoint = map.tileTranslatePoint;
        let scale = calculateScale(this.touchStartList, this.touchMoveList);
        let touchCenter = getTouchCenter(getTouches(this.touchMoveList, this.maps));
        let newScale = scale / this.lastScale;
        this.lastScale = scale;
        this.pinchFactor *= newScale;
        this.pinchFactor = Math.min(this.maps.zoomSettings.maxZoom, Math.max(this.pinchFactor, this.maps.zoomSettings.minZoom));
        let zoomCalculationFactor = this.pinchFactor;
        if (!map.isTileMap) {
            let minBounds = map.baseMapRectBounds['min'];
            let maxBounds = map.baseMapRectBounds['max'];
            let mapTotalWidth = Math.abs(minBounds['x'] - maxBounds['x']);
            let mapTotalHeight = Math.abs(minBounds['y'] - maxBounds['y']);
            let translatePoint = map.translatePoint;
            let currentHeight = Math.abs(map.baseMapRectBounds['max']['y'] - map.baseMapRectBounds['min']['y']) * zoomCalculationFactor;
            let translatePointX = translatePoint.x - (((availSize.width / map.scale) - (availSize.width / zoomCalculationFactor)) / (availSize.width / touchCenter.x));
            let translatePointY = translatePoint.y - (((availSize.height / map.scale) - (availSize.height / zoomCalculationFactor)) / (availSize.height / touchCenter.y));
            translatePointX = (currentHeight < map.mapAreaRect.height) ? (availSize.x + ((-(minBounds['x'])) + ((availSize.width / 2) - (mapTotalWidth / 2)))) : translatePointX;
            translatePointY = (currentHeight < map.mapAreaRect.height) ? (availSize.y + ((-(minBounds['y'])) + ((availSize.height / 2) - (mapTotalHeight / 2)))) : translatePointY;
            map.translatePoint = new Point(translatePointX, translatePointY);
            map.scale = zoomCalculationFactor;
            this.triggerZoomEvent(prevTilePoint, prevLevel, '');
        }
        else {
            let newTileFactor = zoomCalculationFactor;
            this.getTileTranslatePosition(prevLevel, newTileFactor, { x: touchCenter.x, y: touchCenter.y });
            map.tileZoomLevel = newTileFactor;
            map.translatePoint.x = (map.tileTranslatePoint.x - (0.5 * Math.pow(2, newTileFactor))) /
                (Math.pow(2, newTileFactor));
            map.translatePoint.y = (map.tileTranslatePoint.y - (0.5 * Math.pow(2, newTileFactor))) /
                (Math.pow(2, newTileFactor));
            map.scale = (Math.pow(2, newTileFactor));
            this.triggerZoomEvent(prevTilePoint, prevLevel, '');
            map.mapLayerPanel.generateTiles(newTileFactor, map.tileTranslatePoint);
        }
        this.applyTransform();
    }
    drawZoomRectangle() {
        let map = this.maps;
        let down = this.mouseDownPoints;
        let move = this.mouseMovePoints;
        let x;
        let y;
        let width;
        let height;
        let border = { width: 1, color: '#009900' };
        width = Math.abs(move.x - down.x);
        height = Math.abs(move.y - down.y);
        x = ((move.x > down.x) ? down.x : down.x - width);
        y = ((move.y > down.y) ? down.y : down.y - height);
        let elementRect = getElementByID(map.element.id).getBoundingClientRect();
        if ((x > map.mapAreaRect.x && x < (map.mapAreaRect.x + map.mapAreaRect.width)) &&
            (y > map.mapAreaRect.y) && (y < map.mapAreaRect.y + map.mapAreaRect.height)) {
            this.zoomingRect = new Rect(x, y, width, height);
            let rectSVGObject = map.renderer.createSvg({
                id: map.element.id + '_Selection_Rect_Zooming',
                width: map.availableSize.width,
                height: map.availableSize.height,
            });
            let rectOption = new RectOption(map.element.id + '_ZoomRect', '#d3d3d3', border, 0.5, this.zoomingRect, 0, 0, '', '3');
            rectSVGObject.appendChild(map.renderer.drawRectangle(rectOption));
            getElementByID(map.element.id + '_Secondary_Element').appendChild(rectSVGObject);
        }
    }
    /**
     * To animate the zooming process
     */
    animateTransform(element, animate$$1, x, y, scale) {
        let duration = this.currentLayer.animationDuration;
        if (!animate$$1 || duration === 0) {
            element.setAttribute('transform', 'scale(' + (scale) + ') translate( ' + x + ' ' + y + ' )');
            return;
        }
        zoomAnimate(element, 0, duration, new MapLocation(x, y), scale, this.maps.mapAreaRect, this.maps);
    }
    //tslint:disable:max-func-body-length
    applyTransform(animate$$1) {
        let layerIndex;
        this.templateCount = 0;
        let markerStyle;
        let scale = this.maps.scale;
        let x = this.maps.translatePoint.x;
        let y = this.maps.translatePoint.y;
        this.maps.zoomShapeCollection = [];
        if (document.getElementById(this.maps.element.id + '_mapsTooltip')) {
            removeElement(this.maps.element.id + '_mapsTooltip');
        }
        if (this.layerCollectionEle) {
            for (let i = 0; i < this.layerCollectionEle.childElementCount; i++) {
                let layerElement = this.layerCollectionEle.childNodes[i];
                if (layerElement.tagName === 'g') {
                    this.templateCount++;
                    this.index = layerElement.id.indexOf('_LayerIndex_') > -1 && parseFloat(layerElement.id.split('_LayerIndex_')[1].split('_')[0]);
                    this.currentLayer = this.maps.layersCollection[this.index];
                    let factor = this.maps.mapLayerPanel.calculateFactor(this.currentLayer);
                    for (let j = 0; j < layerElement.childElementCount; j++) {
                        let currentEle = layerElement.childNodes[j];
                        if (!(currentEle.id.indexOf('_Markers_Group') > -1) && (!(currentEle.id.indexOf('_bubble_Group') > -1))
                            && (!(currentEle.id.indexOf('_dataLableIndex_Group') > -1))) {
                            if (this.maps.isTileMap && (currentEle.id.indexOf('_line_Group') > -1)) {
                                currentEle.remove();
                                if (layerElement.children.length > 0 && layerElement.children[0]) {
                                    layerElement.insertBefore(this.maps.navigationLineModule.renderNavigation(this.currentLayer, this.maps.tileZoomLevel, this.index), layerElement.children[0]);
                                }
                                else {
                                    layerElement.appendChild(this.maps.navigationLineModule.renderNavigation(this.currentLayer, this.maps.tileZoomLevel, this.index));
                                }
                            }
                            else {
                                changeBorderWidth(currentEle, this.index, scale, this.maps);
                                this.maps.zoomTranslatePoint = this.maps.translatePoint;
                                this.animateTransform(currentEle, animate$$1, x, y, scale);
                                this.shapeZoomLocation = currentEle.childNodes;
                            }
                        }
                        else if (currentEle.id.indexOf('_Markers_Group') > -1) {
                            if (!this.isPanning) {
                                this.markerTranslates(currentEle.childNodes[0], factor, x, y, scale, 'Marker', layerElement, animate$$1);
                            }
                            currentEle = layerElement.childNodes[j];
                            if (!isNullOrUndefined(currentEle)) {
                                for (let k = 0; k < currentEle.childElementCount; k++) {
                                    this.markerTranslate(currentEle.childNodes[k], factor, x, y, scale, 'Marker', animate$$1);
                                    if (!this.maps.isTileMap && this.currentLayer.animationDuration > 0) {
                                        markerStyle = 'visibility:hidden';
                                        currentEle.setAttribute('style', markerStyle);
                                    }
                                }
                                if (this.isPanning && this.maps.markerModule.sameMarkerData.length > 0) {
                                    clusterSeparate(this.maps.markerModule.sameMarkerData, this.maps, currentEle, true);
                                }
                                else if (this.maps.markerModule.sameMarkerData.length > 0) {
                                    this.maps.markerModule.sameMarkerData = [];
                                    if (document.getElementById(this.maps.element.id + '_mapsTooltip')) {
                                        removeElement(this.maps.element.id + '_mapsTooltip');
                                    }
                                }
                                if (document.getElementById(this.maps.element.id + '_mapsTooltip') && this.maps.mapsTooltipModule.tooltipTargetID.indexOf('_MarkerIndex_')
                                    && !this.isPanning) {
                                    let mapsTooltip = this.maps.mapsTooltipModule;
                                    let tooltipElement = currentEle.querySelector('#' + mapsTooltip.tooltipTargetID);
                                    if (!isNullOrUndefined(tooltipElement)) {
                                        if (tooltipElement['style']['visibility'] === 'hidden') {
                                            removeElement(this.maps.element.id + '_mapsTooltip');
                                        }
                                        else {
                                            let x = parseFloat(tooltipElement.getAttribute('transform').split('(')[1].split(')')[0].split(' ')[1]);
                                            let y = parseFloat(tooltipElement.getAttribute('transform').split('(')[1].split(')')[0].split(' ')[2]);
                                            if (this.maps.isTileMap) {
                                                x += +getElement(this.maps.element.id + '_tile_parent')['style']['left'].split('px')[0];
                                                y += +getElement(this.maps.element.id + '_tile_parent')['style']['top'].split('px')[0];
                                            }
                                            mapsTooltip.svgTooltip.location.x = x;
                                            mapsTooltip.svgTooltip.location.y = y;
                                            mapsTooltip.svgTooltip.enableAnimation = false;
                                        }
                                    }
                                }
                            }
                        }
                        else if (currentEle.id.indexOf('_bubble_Group') > -1) {
                            let childElement;
                            for (let k = 0; k < currentEle.childElementCount; k++) {
                                childElement = currentEle.childNodes[k];
                                let bubbleTransform = childElement.getAttribute('transform');
                                layerIndex = parseFloat(childElement.id.split('_LayerIndex_')[1].split('_')[0]);
                                let bubleIndex = parseFloat(childElement.id.split('_BubbleIndex_')[1].split('_')[0]);
                                let dataIndex = parseFloat(childElement.id.split('_BubbleIndex_')[1].split('_')[2]);
                                for (let l = 0; l < this.maps.bubbleModule.bubbleCollection.length; l++) {
                                    let bubbleCollection = this.maps.bubbleModule.bubbleCollection[l];
                                    if (bubbleCollection['LayerIndex'] === layerIndex && bubbleCollection['BubbleIndex'] === bubleIndex &&
                                        bubbleCollection['DataIndex'] === dataIndex) {
                                        let centerX = bubbleCollection['center']['x'];
                                        let centerY = bubbleCollection['center']['y'];
                                        let currentX = ((centerX + x) * scale);
                                        let currentY = ((centerY + y) * scale);
                                        let duration = this.currentLayer.animationDuration;
                                        if (!animate$$1 || duration === 0) {
                                            childElement.setAttribute('transform', 'translate( ' + currentX + ' ' + currentY + ' )');
                                        }
                                        else {
                                            smoothTranslate(childElement, 0, duration, new MapLocation(currentX, currentY));
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        else if (currentEle.id.indexOf('_dataLableIndex_Group') > -1) {
                            this.intersect = [];
                            this.maps.zoomLabelPositions = [];
                            this.maps.zoomLabelPositions = this.maps.dataLabelModule.dataLabelCollections;
                            for (let k = 0; k < currentEle.childElementCount; k++) {
                                if (currentEle.childNodes[k]['id'].indexOf('_LabelIndex_') > -1) {
                                    let labelIndex = parseFloat(currentEle.childNodes[k]['id'].split('_LabelIndex_')[1].split('_')[0]);
                                    this.zoomshapewidth = this.shapeZoomLocation[labelIndex].getBoundingClientRect();
                                    this.maps.zoomShapeCollection.push(this.zoomshapewidth);
                                    this.dataLabelTranslate(currentEle.childNodes[k], factor, x, y, scale, 'DataLabel', animate$$1);
                                    let dataLabel = this.maps.layers[this.index].dataLabelSettings;
                                    let border = dataLabel.border;
                                    if (k > 0 && border['width'] > 1) {
                                        if (currentEle.childNodes[k - 1]['id'].indexOf('_rectIndex_') > -1) {
                                            let labelX = ((this.maps.zoomLabelPositions[labelIndex]['location']['x'] + x) * scale);
                                            let labelY = ((this.maps.zoomLabelPositions[labelIndex]['location']['y'] + y) * scale);
                                            let zoomtext = currentEle.childNodes[k]['innerHTML'];
                                            let style = this.maps.layers[this.index].dataLabelSettings.textStyle;
                                            let zoomtextSize = measureText(zoomtext, style);
                                            let padding = 5;
                                            let rectElement = currentEle.childNodes[k - 1];
                                            let rectX = labelX - zoomtextSize['width'] / 2;
                                            let rectY = labelY - zoomtextSize['height'] / 2 - padding;
                                            rectElement['setAttribute']('x', rectX);
                                            rectElement['setAttribute']('y', rectY);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                this.maps.arrangeTemplate();
                let blazor = this.maps.isBlazor ? this.maps.blazorTemplates() : null;
            }
            if (!isNullOrUndefined(this.currentLayer)) {
                if (!animate$$1 || this.currentLayer.animationDuration === 0) {
                    this.processTemplate(x, y, scale, this.maps);
                }
            }
        }
    }
    //tslint:disable
    markerTranslates(element, factor, x, y, scale, type, layerElement, animate$$1 = false) {
        let markerSVGObject;
        let templateFn;
        let nullCount = 0;
        let markerCounts = 0;
        let markerTemplateCounts = 0;
        let layerIndex = parseInt((element ? element : layerElement).id.split('_LayerIndex_')[1].split('_')[0], 10);
        markerSVGObject = this.maps.renderer.createGroup({
            id: this.maps.element.id + '_Markers_Group',
            class: 'GroupElement',
            style: 'pointer-events: auto;'
        });
        if (document.getElementById(markerSVGObject.id)) {
            removeElement(markerSVGObject.id);
        }
        let mapsAreaRect = this.maps.mapAreaRect;
        let markerTemplateElements = createElement('div', {
            id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_Markers_Template_Group',
            className: 'template',
            styles: 'overflow: hidden; position: absolute;pointer-events: none;' +
                'top:' + mapsAreaRect.y + 'px;' +
                'left:' + mapsAreaRect.x + 'px;' +
                'height:' + mapsAreaRect.height + 'px;' +
                'width:' + mapsAreaRect.width + 'px;'
        });
        if (document.getElementById(markerTemplateElements.id)) {
            removeElement(markerTemplateElements.id);
        }
        let currentLayers = this.maps.layersCollection[layerIndex];
        currentLayers.markerSettings.map((markerSettings, markerIndex) => {
            let markerDatas = markerSettings.dataSource;
            Array.prototype.forEach.call(markerDatas, (data, dataIndex) => {
                this.maps.markerNullCount = markerIndex >= 0 && dataIndex === 0 ? 0 : this.maps.markerNullCount;
                let eventArgs = {
                    template: markerSettings.template, data: data, maps: this.maps, marker: markerSettings,
                    cancel: false, name: markerRendering, fill: markerSettings.fill, colorValuePath: markerSettings.colorValuePath,
                    shapeValuePath: markerSettings.shapeValuePath, height: markerSettings.height,
                    width: markerSettings.width, imageUrl: markerSettings.imageUrl, shape: markerSettings.shape,
                    border: markerSettings.border
                };
                eventArgs = markerShapeChoose(eventArgs, data);
                eventArgs = markerColorChoose(eventArgs, data);
                if (this.maps.isBlazor) {
                    const { maps, marker: marker$$1 } = eventArgs, blazorEventArgs = __rest$7(eventArgs, ["maps", "marker"]);
                    eventArgs = blazorEventArgs;
                }
                this.maps.trigger('markerRendering', eventArgs, (MarkerArgs) => {
                    if (markerSettings.shapeValuePath !== eventArgs.shapeValuePath) {
                        eventArgs = markerShapeChoose(eventArgs, data);
                    }
                    if (markerSettings.colorValuePath !== eventArgs.colorValuePath) {
                        eventArgs = markerColorChoose(eventArgs, data);
                    }
                    let lati = (!isNullOrUndefined(markerSettings.latitudeValuePath)) ?
                        Number(getValueFromObject(data, markerSettings.latitudeValuePath)) : parseFloat(data['latitude']);
                    let long = (!isNullOrUndefined(markerSettings.longitudeValuePath)) ?
                        Number(getValueFromObject(data, markerSettings.longitudeValuePath)) : parseFloat(data['longitude']);
                    if (this.maps.isBlazor) {
                        let data1 = {};
                        let j = 0;
                        let text = [];
                        for (let i = 0; i < Object.keys(data).length; i++) {
                            if (Object.keys(data)[i].toLowerCase() !== 'text' && Object.keys(data)[i].toLowerCase() !== 'latitude'
                                && Object.keys(data)[i].toLowerCase() !== 'blazortemplateid' && Object.keys(data)[i].toLowerCase() !== 'longitude'
                                && Object.keys(data)[i].toLowerCase() !== 'name') {
                                data1['text'] = text;
                                text[j] = data[Object.keys(data)[i].toLowerCase()];
                                j++;
                            }
                        }
                        data['text'] = data1['text'];
                        if (data == {} || isNullOrUndefined(data['latitude']) || isNullOrUndefined(data['longitude'])) {
                            lati = (data['latitude'] && !isNullOrUndefined(data['latitude'])) ? data['latitude'] : 0;
                            long = (data['longitude'] && !isNullOrUndefined(data['longitude'])) ? data['longitude'] : 0;
                        }
                    }
                    let offset = markerSettings.offset;
                    if (!eventArgs.cancel && markerSettings.visible && !isNullOrUndefined(long) && !isNullOrUndefined(lati)) {
                        let markerID = this.maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_'
                            + markerIndex + '_dataIndex_' + dataIndex;
                        let location = (this.maps.isTileMap) ? convertTileLatLongToPoint(new MapLocation(long, lati), this.maps.tileZoomLevel, this.maps.tileTranslatePoint, true) : convertGeoToPoint(lati, long, factor, currentLayers, this.maps);
                        let animate$$1 = currentLayers.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
                        let transPoint = { x: x, y: y };
                        if (eventArgs.template && (!isNaN(location.x) && !isNaN(location.y))) {
                            markerTemplateCounts++;
                            markerTemplate(eventArgs, templateFn, markerID, data, markerIndex, markerTemplateElements, location, scale, offset, this.maps);
                        }
                        else if (!eventArgs.template && (!isNaN(location.x) && !isNaN(location.y))) {
                            markerCounts++;
                            marker(eventArgs, markerSettings, markerDatas, dataIndex, location, transPoint, markerID, offset, scale, this.maps, markerSVGObject);
                        }
                    }
                    nullCount += (!isNaN(lati) && !isNaN(long)) ? 0 : 1;
                    markerTemplateCounts += (eventArgs.cancel) ? 1 : 0;
                    markerCounts += (eventArgs.cancel) ? 1 : 0;
                    this.maps.markerNullCount = (!isNullOrUndefined(lati) || !isNullOrUndefined(long))
                        ? this.maps.markerNullCount : this.maps.markerNullCount + 1;
                    let markerDataLength = markerDatas.length - this.maps.markerNullCount;
                    if (markerSVGObject.childElementCount === (markerDatas.length - markerTemplateCounts - nullCount) && (type !== 'Template')) {
                        layerElement.appendChild(markerSVGObject);
                        if (currentLayers.markerClusterSettings.allowClustering) {
                            this.maps.svgObject.appendChild(markerSVGObject);
                            this.maps.element.appendChild(this.maps.svgObject);
                            clusterTemplate(currentLayers, markerSVGObject, this.maps, layerIndex, markerSVGObject, layerElement, true, true);
                        }
                    }
                    if (markerTemplateElements.childElementCount === (markerDatas.length - markerCounts - nullCount) && getElementByID(this.maps.element.id + '_Secondary_Element')) {
                        getElementByID(this.maps.element.id + '_Secondary_Element').appendChild(markerTemplateElements);
                        if (currentLayers.markerClusterSettings.allowClustering) {
                            clusterTemplate(currentLayers, markerTemplateElements, this.maps, layerIndex, markerSVGObject, layerElement, false, true);
                        }
                    }
                });
            });
        });
    }
    ;
    /**
     * To translate the layer template elements
     * @private
     */
    processTemplate(x, y, scale, maps) {
        for (let i = 0; i < this.templateCount; i++) {
            this.currentLayer = maps.layersCollection[i];
            let factor = maps.mapLayerPanel.calculateFactor(this.currentLayer);
            let markerTemplateElement = getElementByID(maps.element.id + '_LayerIndex_' +
                i + '_Markers_Template_Group');
            let datalabelTemplateElemement = getElementByID(maps.element.id + '_LayerIndex_'
                + i + '_Label_Template_Group');
            if ((!isNullOrUndefined(markerTemplateElement)) && markerTemplateElement.childElementCount > 0) {
                for (let k = 0; k < markerTemplateElement.childElementCount; k++) {
                    this.markerTranslate(markerTemplateElement.childNodes[k], factor, x, y, scale, 'Template');
                }
            }
            if ((!isNullOrUndefined(datalabelTemplateElemement)) && datalabelTemplateElemement.childElementCount > 0) {
                for (let k = 0; k < datalabelTemplateElemement.childElementCount; k++) {
                    this.dataLabelTranslate(datalabelTemplateElemement.childNodes[k], factor, x, y, scale, 'Template');
                }
            }
        }
    }
    //tslint:disable:max-func-body-length
    dataLabelTranslate(element, factor, x, y, scale, type, animate$$1 = false) {
        let labelCollection = this.maps.dataLabelModule.dataLabelCollections;
        let zoomelement = element.getBoundingClientRect();
        let text;
        let trimmedLable;
        let style = this.maps.layers[this.index].dataLabelSettings.textStyle;
        let zoomtext;
        let zoomtextSize;
        let zoomtrimLabel;
        let labelPath = this.maps.layers[this.index].dataLabelSettings.labelPath;
        let layerIndex = parseFloat(element.id.split('_LayerIndex_')[1].split('_')[0]);
        let shapeIndex = parseFloat(element.id.split('_shapeIndex_')[1].split('_')[0]);
        let labelIndex;
        if (element.id.indexOf('_LabelIndex_') > -1) {
            labelIndex = parseFloat(element.id.split('_LabelIndex_')[1].split('_')[0]);
        }
        let duration = this.currentLayer.animationDuration;
        for (let l = 0; l < labelCollection.length; l++) {
            let label = labelCollection[l];
            if (label['layerIndex'] === layerIndex && label['shapeIndex'] === shapeIndex
                && label['labelIndex'] === labelIndex) {
                let labelX = label['location']['x'];
                let labelY = label['location']['y'];
                if (type === 'Template') {
                    let layerEle = getElementByID(this.maps.element.id + '_Layer_Collections');
                    labelX = ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - labelX)) * scale);
                    labelY = ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - labelY)) * scale);
                    let templateOffset = element.getBoundingClientRect();
                    let layerOffset = layerEle.getBoundingClientRect();
                    let elementOffset = element.parentElement.getBoundingClientRect();
                    let x = ((labelX) + (layerOffset.left - elementOffset.left) - (templateOffset.width / 2));
                    let y = ((labelY) + (layerOffset.top - elementOffset.top) - (templateOffset.height / 2));
                    element.style.left = x + 'px';
                    element.style.top = y + 'px';
                }
                else {
                    labelX = ((labelX + x) * scale);
                    labelY = ((labelY + y) * scale);
                    zoomtext = label['dataLabelText'];
                    zoomtextSize = measureText(zoomtext, style);
                    let start = labelY - zoomtextSize['height'] / 4;
                    let end = labelY + zoomtextSize['height'] / 4;
                    let xpositionEnds = labelX + zoomtextSize['width'] / 2;
                    let xpositionStart = labelX - zoomtextSize['width'] / 2;
                    let textLocations = { rightWidth: xpositionEnds, leftWidth: xpositionStart, heightTop: start, heightBottom: end };
                    if (!animate$$1 || duration === 0) {
                        element.setAttribute('transform', 'translate( ' + labelX + ' ' + labelY + ' )');
                    }
                    if (this.maps.layers[this.index].dataLabelSettings.smartLabelMode === 'Hide') {
                        if (scale > 1) {
                            text = (this.zoomshapewidth['width'] >= zoomtextSize['width']) ? zoomtext : '';
                            element.innerHTML = text;
                        }
                        else {
                            text = (this.maps.dataLabelShape[l] >= zoomtextSize['width']) ? zoomtext : '';
                            element.innerHTML = text;
                        }
                    }
                    if (this.maps.layers[this.index].dataLabelSettings.smartLabelMode === 'Trim') {
                        if (scale > 1) {
                            zoomtrimLabel = textTrim(this.zoomshapewidth['width'], zoomtext, style);
                            text = zoomtrimLabel;
                            element.innerHTML = text;
                        }
                        else {
                            zoomtrimLabel = textTrim(this.maps.dataLabelShape[l], zoomtext, style);
                            text = zoomtrimLabel;
                            element.innerHTML = text;
                        }
                    }
                    if (this.maps.layers[this.index].dataLabelSettings.intersectionAction === 'Hide') {
                        for (let m = 0; m < this.intersect.length; m++) {
                            if (!isNullOrUndefined(this.intersect[m])) {
                                if (textLocations['leftWidth'] > this.intersect[m]['rightWidth']
                                    || textLocations['rightWidth'] < this.intersect[m]['leftWidth']
                                    || textLocations['heightTop'] > this.intersect[m]['heightBottom']
                                    || textLocations['heightBottom'] < this.intersect[m]['heightTop']) {
                                    text = !isNullOrUndefined(text) ? text : zoomtext;
                                    element.innerHTML = text;
                                }
                                else {
                                    text = '';
                                    element.innerHTML = text;
                                    break;
                                }
                            }
                        }
                        this.intersect.push(textLocations);
                    }
                    if (this.maps.layers[this.index].dataLabelSettings.intersectionAction === 'Trim') {
                        for (let j = 0; j < this.intersect.length; j++) {
                            if (!isNullOrUndefined(this.intersect[j])) {
                                if (textLocations['rightWidth'] < this.intersect[j]['leftWidth']
                                    || textLocations['leftWidth'] > this.intersect[j]['rightWidth']
                                    || textLocations['heightBottom'] < this.intersect[j]['heightTop']
                                    || textLocations['heightTop'] > this.intersect[j]['heightBottom']) {
                                    trimmedLable = !isNullOrUndefined(text) ? text : zoomtext;
                                    if (scale > 1) {
                                        trimmedLable = textTrim(this.zoomshapewidth['width'], trimmedLable, style);
                                    }
                                    element.innerHTML = trimmedLable;
                                }
                                else {
                                    if (textLocations['leftWidth'] > this.intersect[j]['leftWidth']) {
                                        let width = this.intersect[j]['rightWidth'] - textLocations['leftWidth'];
                                        let difference = width - (textLocations['rightWidth'] - textLocations['leftWidth']);
                                        text = !isNullOrUndefined(text) ? text : zoomtext;
                                        trimmedLable = textTrim(difference, text, style);
                                        element.innerHTML = trimmedLable;
                                        break;
                                    }
                                    if (textLocations['leftWidth'] < this.intersect[j]['leftWidth']) {
                                        let width = textLocations['rightWidth'] - this.intersect[j]['leftWidth'];
                                        let difference = Math.abs(width - (textLocations['rightWidth'] - textLocations['leftWidth']));
                                        text = !isNullOrUndefined(text) ? text : zoomtext;
                                        trimmedLable = textTrim(difference, text, style);
                                        element.innerHTML = trimmedLable;
                                        break;
                                    }
                                }
                            }
                        }
                        this.intersect.push(textLocations);
                        if (isNullOrUndefined(trimmedLable)) {
                            trimmedLable = textTrim(this.zoomshapewidth['width'], zoomtext, style);
                            element.innerHTML = trimmedLable;
                        }
                    }
                    else {
                        smoothTranslate(element, 0, duration, new MapLocation(labelX, labelY));
                    }
                }
            }
        }
    }
    markerTranslate(element, factor, x, y, scale, type, animate$$1 = false) {
        let layerIndex = parseInt(element.id.split('_LayerIndex_')[1].split('_')[0], 10);
        let markerIndex = parseInt(element.id.split('_MarkerIndex_')[1].split('_')[0], 10);
        let dataIndex = parseInt(element.id.split('_dataIndex_')[1].split('_')[0], 10);
        let layer = this.maps.layersCollection[layerIndex];
        let marker$$1 = layer.markerSettings[markerIndex];
        if (!isNullOrUndefined(marker$$1) && !isNullOrUndefined(marker$$1.dataSource) && !isNullOrUndefined(marker$$1.dataSource[dataIndex])) {
            let lng = (!isNullOrUndefined(marker$$1.longitudeValuePath)) ?
                Number(getValueFromObject(marker$$1.dataSource[dataIndex], marker$$1.longitudeValuePath)) :
                parseFloat(marker$$1.dataSource[dataIndex]['longitude']);
            let lat = (!isNullOrUndefined(marker$$1.latitudeValuePath)) ?
                Number(getValueFromObject(marker$$1.dataSource[dataIndex], marker$$1.latitudeValuePath)) :
                parseFloat(marker$$1.dataSource[dataIndex]['latitude']);
            if (this.maps.isBlazor) {
                let data1 = {};
                let j = 0;
                let text = [];
                if (isNullOrUndefined(marker$$1.dataSource[dataIndex]['latitude']) || isNullOrUndefined(marker$$1.dataSource[dataIndex]['longitude'])) {
                    lat = (marker$$1.dataSource[dataIndex]['latitude'] && !isNullOrUndefined(marker$$1.dataSource[dataIndex]['latitude'])) ? marker$$1.dataSource[dataIndex]['latitude'] : 0;
                    lng = (marker$$1.dataSource[dataIndex]['longitude'] && !isNullOrUndefined(marker$$1.dataSource[dataIndex]['longitude'])) ? marker$$1.dataSource[dataIndex]['longitude'] : 0;
                }
                for (let i = 0; i < Object.keys(marker$$1.dataSource[dataIndex]).length; i++) {
                    if (Object.keys(marker$$1.dataSource[dataIndex])[i].toLowerCase() !== 'text' && Object.keys(marker$$1.dataSource[dataIndex])[i].toLowerCase() !== 'longitude'
                        && Object.keys(marker$$1.dataSource[dataIndex])[i].toLowerCase() !== 'latitude' && Object.keys(marker$$1.dataSource[dataIndex])[i].toLowerCase() !== 'blazortemplateid'
                        && Object.keys(marker$$1.dataSource[dataIndex])[i].toLowerCase() !== 'name') {
                        data1['text'] = text;
                        text[j] = marker$$1.dataSource[dataIndex][Object.keys(marker$$1.dataSource[dataIndex])[i].toLowerCase()];
                        j++;
                    }
                }
                marker$$1.dataSource[dataIndex]['text'] = data1['text'];
            }
            let duration = this.currentLayer.animationDuration;
            let location = (this.maps.isTileMap) ? convertTileLatLongToPoint(new Point(lng, lat), this.maps.tileZoomLevel, this.maps.tileTranslatePoint, true) : convertGeoToPoint(lat, lng, factor, layer, this.maps);
            if (this.maps.isTileMap) {
                if (type === 'Template') {
                    let templateOffset = element.getBoundingClientRect();
                    element.style.left = ((location.x - (templateOffset.width / 2)) + marker$$1.offset.x) + 'px';
                    element.style.top = ((location.y - (templateOffset.height / 2)) + marker$$1.offset.y) + 'px';
                    if (this.maps.layers[this.maps.baseLayerIndex].layerType === 'GoogleStaticMap') {
                        let staticMapOffset = getElementByID(this.maps.element.id + '_StaticGoogleMap').getBoundingClientRect();
                        let staticMapOffsetWidth = 640;
                        if (element['style']['display'] !== 'none') {
                            if ((staticMapOffset['x'] > templateOffset['x'] || staticMapOffset['x'] + staticMapOffsetWidth < templateOffset['x'] + templateOffset['width'])
                                && (staticMapOffset['y'] > templateOffset['y'] || staticMapOffset['y'] + staticMapOffset['height'] < templateOffset['y'] + templateOffset['height'])) {
                                element['style']['display'] = 'none';
                            }
                            else if ((staticMapOffset['x'] > templateOffset['x'] || staticMapOffset['x'] + staticMapOffsetWidth < templateOffset['x'] + templateOffset['width'])) {
                                element['style']['display'] = 'none';
                            }
                        }
                    }
                }
                else {
                    location.x += marker$$1.offset.x;
                    location.y += marker$$1.offset.y;
                    element.setAttribute('transform', 'translate( ' + location.x + ' ' + location.y + ' )');
                }
            }
            else {
                if (type === 'Template') {
                    location.x = ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - location.x)) * scale);
                    location.y = ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - location.y)) * scale);
                    let layerOffset = getElementByID(this.maps.element.id + '_Layer_Collections').getBoundingClientRect();
                    let elementOffset = element.parentElement.getBoundingClientRect();
                    element.style.left = (((location.x) + (layerOffset.left - elementOffset.left)) + marker$$1.offset.x) + 'px';
                    element.style.top = (((location.y) + (layerOffset.top - elementOffset.top)) + marker$$1.offset.y) + 'px';
                    element.style.transform = 'translate(-50%, -50%)';
                }
                else {
                    location.x = (((location.x + x) * scale) + marker$$1.offset.x);
                    location.y = (((location.y + y) * scale) + marker$$1.offset.y);
                    if (!animate$$1 || duration === 0) {
                        element.setAttribute('transform', 'translate( ' + location.x + ' ' + location.y + ' )');
                    }
                    else {
                        smoothTranslate(element, 0, duration, location);
                    }
                }
            }
        }
    }
    panning(direction, xDifference, yDifference, mouseLocation) {
        let map = this.maps;
        let panArgs;
        let down = this.mouseDownPoints;
        let move = this.mouseMovePoints;
        let scale = map.scale;
        map.markerZoomedState = false;
        map.zoomPersistence = map.enablePersistence;
        map.defaultState = false;
        map.initialCheck = false;
        let translatePoint = map.translatePoint;
        let prevTilePoint = map.tileTranslatePoint;
        let x;
        let y;
        xDifference = !isNullOrUndefined(xDifference) ? xDifference : (down.x - move.x);
        yDifference = !isNullOrUndefined(yDifference) ? yDifference : (down.y - move.y);
        if (!map.isTileMap) {
            x = translatePoint.x - xDifference / scale;
            y = translatePoint.y - yDifference / scale;
            let layerRect = getElementByID(map.element.id + '_Layer_Collections').getBoundingClientRect();
            let elementRect = getElementByID(map.element.id + '_svg').getBoundingClientRect();
            let panningXDirection = ((xDifference < 0 ? layerRect.left <= (elementRect.left + map.mapAreaRect.x) :
                ((layerRect.left + layerRect.width) >= (elementRect.left + elementRect.width) + map.mapAreaRect.x + map.margin.left)));
            let panningYDirection = ((yDifference < 0 ? layerRect.top <= (elementRect.top + map.mapAreaRect.y) :
                ((layerRect.top + layerRect.height + map.margin.top) >= (elementRect.top + elementRect.height))));
            let location = this.maps.getGeoLocation(this.maps.layersCollection.length - 1, mouseLocation);
            panArgs = {
                cancel: false, name: pan, maps: !map.isBlazor ? map : null,
                tileTranslatePoint: {}, translatePoint: { previous: translatePoint, current: new Point(x, y) },
                scale: map.scale, tileZoomLevel: map.tileZoomLevel, latitude: location['latitude'], longitude: location['longitude']
            };
            map.trigger(pan, panArgs);
            if (panningXDirection && panningYDirection) {
                map.translatePoint = new Point(x, y);
                this.applyTransform();
            }
            else if (panningXDirection) {
                map.translatePoint = new Point(x, map.translatePoint.y);
                this.applyTransform();
            }
            else if (panningYDirection) {
                map.translatePoint = new Point(map.translatePoint.x, y);
                this.applyTransform();
            }
            this.maps.zoomNotApplied = false;
        }
        else if (this.maps.tileZoomLevel > 1) {
            x = map.tileTranslatePoint.x - xDifference;
            y = map.tileTranslatePoint.y - yDifference;
            this.distanceX = x - map.tileTranslatePoint.x;
            this.distanceY = y - map.tileTranslatePoint.y;
            map.tileTranslatePoint.x = x;
            map.tileTranslatePoint.y = y;
            if ((map.tileTranslatePoint.y > -10 && yDifference < 0) || ((map.tileTranslatePoint.y < -((Math.pow(2, this.maps.tileZoomLevel) - 2) * 256) && yDifference > 0))) {
                map.tileTranslatePoint.x = x + xDifference;
                map.tileTranslatePoint.y = y + yDifference;
            }
            map.translatePoint.x = (map.tileTranslatePoint.x - xDifference) / map.scale;
            map.translatePoint.y = (map.tileTranslatePoint.y - yDifference) / map.scale;
            let location = this.maps.getTileGeoLocation(mouseLocation);
            panArgs = {
                cancel: false, name: pan, maps: !map.isBlazor ? map : null,
                tileTranslatePoint: { previous: prevTilePoint, current: map.tileTranslatePoint },
                translatePoint: { previous: translatePoint, current: map.translatePoint }, scale: map.scale,
                tileZoomLevel: map.tileZoomLevel, latitude: location['latitude'], longitude: location['longitude']
            };
            map.trigger(pan, panArgs);
            map.mapLayerPanel.generateTiles(map.tileZoomLevel, map.tileTranslatePoint, 'Pan');
            this.applyTransform();
        }
        map.zoomTranslatePoint = map.translatePoint;
        this.mouseDownPoints = this.mouseMovePoints;
        this.maps.zoomNotApplied = false;
        this.isSingleClick = false;
    }
    toAlignSublayer() {
        this.maps.translatePoint.x = !isNullOrUndefined(this.distanceX) ? (this.maps.translatePoint.x -
            (this.distanceX / this.maps.scale)) : this.maps.translatePoint.x;
        this.maps.translatePoint.y = !isNullOrUndefined(this.distanceY) ? this.maps.translatePoint.y -
            (this.distanceY / this.maps.scale) : this.maps.translatePoint.y;
        this.applyTransform(false);
    }
    toolBarZooming(zoomFactor, type) {
        let map = this.maps;
        map.initialCheck = false;
        map.defaultState = ((type === 'Reset' && zoomFactor === 1 && !(map.zoomSettings.resetToInitial && map.applyZoomReset))
            || (type === 'ZoomOut' && zoomFactor === 1));
        let prevLevel = map.tileZoomLevel;
        let scale = map.previousScale = map.scale;
        map.markerZoomedState = false;
        map.zoomPersistence = map.enablePersistence;
        map.mapScaleValue = zoomFactor;
        let maxZoom = map.zoomSettings.maxZoom;
        let minZoom = map.zoomSettings.minZoom;
        let size = map.mapAreaRect;
        let translatePoint = map.previousPoint = map.translatePoint;
        let prevTilePoint = map.tileTranslatePoint;
        map.previousProjection = map.projectionType;
        zoomFactor = (type === 'ZoomOut') ? (Math.round(zoomFactor) === 1 ? 1 : zoomFactor) : zoomFactor;
        zoomFactor = (type === 'Reset') ? 1 : (Math.round(zoomFactor) === 0) ? 1 : zoomFactor;
        zoomFactor = (minZoom > zoomFactor && type === 'ZoomIn') ? minZoom + 1 : zoomFactor;
        if ((!map.isTileMap) && (type === 'ZoomIn' ? zoomFactor >= minZoom && zoomFactor <= maxZoom : zoomFactor >= minZoom)) {
            let min = map.baseMapRectBounds['min'];
            let max = map.baseMapRectBounds['max'];
            let mapWidth = Math.abs(max['x'] - min['x']);
            let mapHeight = Math.abs(min['y'] - max['y']);
            let translatePointX = translatePoint.x - (((size.width / scale) - (size.width / zoomFactor)) / 2);
            let translatePointY = translatePoint.y - (((size.height / scale) - (size.height / zoomFactor)) / 2);
            let currentHeight = Math.abs(map.baseMapRectBounds['max']['y'] - map.baseMapRectBounds['min']['y']) * zoomFactor;
            translatePointX = (currentHeight < map.mapAreaRect.height) ? (size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2))))
                : translatePointX;
            translatePointY = (currentHeight < map.mapAreaRect.height) ? (size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2))))
                : translatePointY;
            map.translatePoint = new Point(translatePointX, translatePointY);
            map.zoomTranslatePoint = map.translatePoint;
            map.scale = zoomFactor;
            this.triggerZoomEvent(prevTilePoint, prevLevel, type);
            this.applyTransform(true);
        }
        else if ((map.isTileMap) && (zoomFactor >= minZoom && zoomFactor <= maxZoom)) {
            let tileZoomFactor = zoomFactor;
            map.scale = Math.pow(2, tileZoomFactor - 1);
            map.tileZoomLevel = tileZoomFactor;
            let position = { x: map.availableSize.width / 2, y: map.availableSize.height / 2 };
            this.getTileTranslatePosition(prevLevel, tileZoomFactor, position, type);
            if (map.zoomSettings.resetToInitial && map.applyZoomReset && type === 'Reset' || (type === 'ZoomOut' && map.zoomSettings.resetToInitial && map.applyZoomReset && tileZoomFactor <= map.initialZoomLevel)) {
                map.initialCheck = true;
                map.zoomPersistence = false;
                map.tileTranslatePoint.x = map.initialTileTranslate.x;
                map.tileTranslatePoint.y = map.initialTileTranslate.y;
                tileZoomFactor = map.tileZoomLevel = map.mapScaleValue = map.initialZoomLevel;
            }
            this.triggerZoomEvent(prevTilePoint, prevLevel, type);
            map.translatePoint.y = (map.tileTranslatePoint.y - (0.01 * map.scale)) / map.scale;
            map.translatePoint.x = (map.tileTranslatePoint.x - (0.01 * map.scale)) / map.scale;
            if (document.getElementById(this.maps.element.id + '_LayerIndex_1')) {
                document.getElementById(this.maps.element.id + '_LayerIndex_1').style.display = 'none';
            }
            if (document.querySelector('.GroupElement')) {
                document.querySelector('.GroupElement').style.display = 'none';
            }
            map.mapLayerPanel.generateTiles(tileZoomFactor, map.tileTranslatePoint, type);
            let element1 = document.getElementById(this.maps.element.id + '_tiles');
            setTimeout(() => {
                this.applyTransform(true);
                if (document.getElementById(this.maps.element.id + '_LayerIndex_1')) {
                    document.getElementById(this.maps.element.id + '_LayerIndex_1').style.display = 'block';
                }
            }, 250);
        }
        this.maps.zoomNotApplied = false;
    }
    /* tslint:disable:max-func-body-length */
    createZoomingToolbars() {
        let map = this.maps;
        this.toolBarGroup = map.renderer.createGroup({
            id: map.element.id + '_Zooming_KitCollection',
            opacity: 0.3,
        });
        let kitHeight = 16;
        let kitWidth = 16;
        let xSpacing = 15;
        let ySpacing = 15;
        let padding = 20;
        let orientation = map.zoomSettings.toolBarOrientation;
        let toolbarsCollection = map.zoomSettings.toolbars;
        let shadowElement = '<filter id="chart_shadow" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/>';
        shadowElement += '<feOffset dx="-3" dy="4" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="1"/>';
        shadowElement += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        let toolBarLength = map.zoomSettings.toolbars.length;
        let toolWidth = (map.zoomSettings.toolBarOrientation === 'Horizontal') ? (toolBarLength * kitWidth) + (toolBarLength * padding) : (kitWidth * 2);
        let toolHeight = (map.zoomSettings.toolBarOrientation === 'Horizontal') ? (kitHeight * 2) : (toolBarLength * kitHeight) + (toolBarLength * padding);
        this.toolBarGroup.appendChild(map.renderer.drawRectangle(new RectOption(map.element.id + '_Zooming_Rect', 'transparent', { color: 'transparent', width: 1 }, 1, new Rect(0, 0, toolWidth, toolHeight), 0, 0)));
        let defElement = map.renderer.createDefs();
        defElement.innerHTML = shadowElement;
        this.toolBarGroup.appendChild(defElement);
        let outerElement = map.renderer.drawRectangle(new RectOption(map.element.id + '_Zooming_Rect', 'transparent', { color: 'transparent', width: 1 }, 0.1, new Rect(0, 0, toolWidth, toolHeight), 0, 0));
        outerElement.setAttribute('filter', 'url(#chart_shadow)');
        this.toolBarGroup.appendChild(outerElement);
        for (let i = 0; i < toolbarsCollection.length; i++) {
            let toolbar = toolbarsCollection[i];
            this.currentToolbarEle = map.renderer.createGroup({
                id: map.element.id + '_Zooming_ToolBar_' + toolbar + '_Group',
                transform: 'translate( ' + xSpacing + ' ' + ySpacing + ' ) '
            });
            this.currentToolbarEle.setAttribute('class', 'e-maps-toolbar');
            let fill = 'transparent';
            let direction = '';
            switch (toolbar.toLowerCase()) {
                case 'zoom':
                    let fillColor;
                    let strokeColor;
                    direction = 'M0.001,14.629L1.372,16l4.571-4.571v-0.685l0.228-0.274c1.051,0.868,2.423,1.417,3.885,1.417c3.291,0,';
                    direction += '5.943-2.651,5.943-5.943S13.395,0,10.103,0S4.16,2.651,4.16,5.943c0,1.508,0.503,2.834,1.417,3.885l-0.274,0.228H4.571';
                    direction = direction + 'L0.001,14.629L0.001,14.629z M5.943,5.943c0-2.285,1.828-4.114,4.114-4.114s4.114,1.828,4.114,';
                    if (this.maps.zoomSettings.enablePanning && !this.maps.zoomSettings.enableSelectionZooming) {
                        fillColor = fill;
                        strokeColor = this.maps.themeStyle.zoomFillColor;
                    }
                    else if (this.maps.zoomSettings.enablePanning && this.maps.zoomSettings.enableSelectionZooming) {
                        fillColor = fill;
                        strokeColor = this.maps.themeStyle.zoomFillColor;
                    }
                    else if (!this.maps.zoomSettings.enablePanning && !this.maps.zoomSettings.enableSelectionZooming) {
                        fillColor = fill;
                        strokeColor = this.maps.themeStyle.zoomFillColor;
                    }
                    else {
                        fillColor = this.selectionColor;
                        strokeColor = this.selectionColor;
                    }
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(map.element.id + '_Zooming_ToolBar_' + toolbar, fillColor, 1, strokeColor, 1, null, direction + '4.114s-1.828,4.114-4.114,4.114S5.943,8.229,5.943,5.943z')));
                    this.zoomElements = this.currentToolbarEle;
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
                case 'zoomin':
                    direction = 'M 8, 0 L 8, 16 M 0, 8 L 16, 8';
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(map.element.id + '_Zooming_ToolBar_' + toolbar + '_Path', fill, 3, this.maps.themeStyle.zoomFillColor, 1, null, direction)));
                    this.zoomInElements = this.currentToolbarEle;
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
                case 'zoomout':
                    direction = 'M 0, 8 L 16, 8';
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(map.element.id + '_Zooming_ToolBar_' + toolbar, fill, 3, this.maps.themeStyle.zoomFillColor, 1, null, direction)));
                    this.zoomOutElements = this.currentToolbarEle;
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
                case 'pan':
                    let color;
                    direction = 'M5,3h2.3L7.275,5.875h1.4L8.65,3H11L8,0L5,3z M3,11V8.7l2.875,0.025v-1.4L3,7.35V5L0,8L3,';
                    direction += '11z M11,13H8.7l0.025-2.875h-1.4L7.35,13H5l3,3L11,13z M13,5v2.3l-2.875-0.025v1.4L13,8.65V11l3-3L13,5z';
                    if (this.maps.zoomSettings.enablePanning && this.maps.zoomModule.isDragZoom) {
                        color = "#737373";
                    }
                    else if (!this.maps.zoomSettings.enablePanning) {
                        color = "#737373";
                        this.currentToolbarEle.setAttribute('class', '');
                    }
                    else {
                        color = this.selectionColor;
                    }
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(map.element.id + '_Zooming_ToolBar_' + toolbar, color, 1, color, 1, null, direction)));
                    this.panColor = color;
                    this.panElements = this.currentToolbarEle;
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
                case 'reset':
                    direction = 'M12.364,8h-2.182l2.909,3.25L16,8h-2.182c0-3.575-2.618-6.5-5.818-6.5c-1.128,0-2.218,0.366-3.091,';
                    direction += '1.016l1.055,1.178C6.581,3.328,7.272,3.125,8,3.125C10.4,3.125,12.363,5.319,12.364,8L12.364,8z M11.091,';
                    direction += '13.484l-1.055-1.178C9.419,12.672,8.728,12.875,8,12.875c-2.4,0-4.364-2.194-4.364-4.875h2.182L2.909,4.75L0,8h2.182c0,';
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(map.element.id + '_Zooming_ToolBar_' + toolbar, this.fillColor, null, this.maps.themeStyle.zoomFillColor, 1, null, direction + '3.575,2.618,6.5,5.818,6.5C9.128,14.5,10.219,14.134,11.091,13.484L11.091,13.484z')));
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
            }
            this.currentToolbarEle.appendChild(map.renderer.drawCircle(new CircleOption(map.element.id + '_Zooming_ToolBar_' + toolbar + '_Rect', fill, { color: this.maps.themeStyle.zoomFillColor, width: 1 }, 1, 8, 8, 16, '')));
            xSpacing = (orientation === 'Horizontal') ? (xSpacing + (kitWidth + padding)) : xSpacing;
            ySpacing = (orientation === 'Horizontal') ? ySpacing : (ySpacing + (kitHeight + padding));
            this.toolBarGroup.appendChild(this.currentToolbarEle);
        }
    }
    performToolBarAction(e) {
        let target = e.target;
        e.stopImmediatePropagation();
        let isTouch = e.pointerType === 'touch' || e.pointerType === '2' || (e.type.indexOf('touch') > -1);
        let toolbar = target.id.split('_Zooming_ToolBar_')[1].split('_')[0];
        if (isTouch) {
            this.handled = true;
            this.performZoomingByToolBar(toolbar);
        }
        else if ((e.type === 'mousedown' || e.type === 'pointerdown') && !this.handled) {
            this.handled = false;
            this.performZoomingByToolBar(toolbar);
        }
        else {
            this.handled = false;
        }
    }
    /**
     *
     * @private
     */
    performZoomingByToolBar(type) {
        let map = this.maps;
        switch (type.toLowerCase()) {
            case 'zoom':
                this.panColor = this.fillColor;
                this.zoomColor = this.selectionColor;
                this.applySelection(this.zoomElements, this.selectionColor);
                this.applySelection(this.panElements, this.fillColor);
                break;
            case 'pan':
                if (!this.maps.zoomSettings.enablePanning) {
                    this.panColor = '#737373';
                }
                else {
                    this.panColor = this.selectionColor;
                }
                this.zoomColor = this.fillColor;
                if (!this.maps.zoomSettings.enablePanning) {
                    this.applySelection(this.zoomElements, this.selectionColor);
                    this.applySelection(this.panElements, this.panColor);
                }
                else {
                    this.applySelection(this.zoomElements, this.fillColor);
                    this.applySelection(this.panElements, this.panColor);
                }
                break;
            case 'zoomin':
                map.staticMapZoom = map.tileZoomLevel;
                if (map.staticMapZoom > 0 && map.staticMapZoom < 22) {
                    map.staticMapZoom += 1;
                }
                this.toolBarZooming((map.isTileMap ? map.tileZoomLevel : map.scale) + 1, 'ZoomIn');
                break;
            case 'zoomout':
                map.staticMapZoom = map.tileZoomLevel;
                map.markerCenterLatitude = null;
                map.markerCenterLongitude = null;
                this.toolBarZooming((map.isTileMap ? map.tileZoomLevel : map.scale) - 1, 'ZoomOut');
                break;
            case 'reset':
                map.staticMapZoom = map.zoomSettings.enable ? map.zoomSettings.zoomFactor : 0;
                map.markerCenterLatitude = null;
                map.markerCenterLongitude = null;
                this.toolBarZooming(1, 'Reset');
                if (!this.maps.zoomSettings.enablePanning) {
                    this.applySelection(this.zoomElements, this.selectionColor);
                    this.applySelection(this.panElements, '#737373');
                }
                else {
                    this.applySelection(this.zoomElements, this.fillColor);
                    this.applySelection(this.panElements, this.selectionColor);
                }
        }
        this.panningStyle(type.toLowerCase());
    }
    panningStyle(toolbar) {
        let svg = getElementByID(this.maps.element.id + '_svg');
        if (toolbar === 'pan' || this.isPanning) {
            svg.setAttribute('class', 'e-maps-panning');
        }
        else {
            svg.setAttribute('class', '');
        }
    }
    applySelection(elements, color) {
        if (!elements) {
            return;
        }
        let childElement;
        for (let i = 0; i < elements.childElementCount; i++) {
            childElement = elements.childNodes[i];
            if (childElement.tagName !== 'circle') {
                childElement.setAttribute('fill', color);
                childElement.setAttribute('stroke', color);
            }
        }
    }
    showTooltip(e) {
        let text = e.target.id.split('_Zooming_ToolBar_')[1].split('_')[0];
        if (!this.isTouch) {
            createTooltip('EJ2_Map_Toolbar_Tip', this.maps.getLocalizedLabel(text), (e.pageY + 10), (e.pageX + 10), '10px');
        }
    }
    removeTooltip() {
        if (getElementByID('EJ2_Map_Toolbar_Tip')) {
            remove(getElementByID('EJ2_Map_Toolbar_Tip'));
        }
    }
    alignToolBar() {
        let map = this.maps;
        let padding = 10;
        let element = createElement('div', { id: map.element.id + '_ToolBar', styles: 'position:absolute;z-index:2' });
        let rectSVGObject = map.renderer.createSvg({
            id: map.element.id + '_Zooming_ToolBar', width: 10, height: 10,
        });
        rectSVGObject.appendChild(this.toolBarGroup);
        element.appendChild(rectSVGObject);
        if (getElementByID(map.element.id + '_Secondary_Element')) {
            getElementByID(map.element.id + '_Secondary_Element').appendChild(element);
        }
        let toolBarSize = this.toolBarGroup.getBoundingClientRect();
        rectSVGObject.setAttribute('height', (toolBarSize.height + padding / 2).toString());
        rectSVGObject.setAttribute('width', (toolBarSize.width + padding / 2).toString());
        let size = map.mapAreaRect;
        let x = 0;
        let y = 0;
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
        let color = this.maps.zoomSettings.highlightColor;
        let css = ' .e-maps-toolbar:hover > circle { stroke:' + color + '; } .e-maps-toolbar:hover > path { fill: ' + color + ' ;  stroke: ' + color + '; }' +
            '.e-maps-toolbar:hover { cursor: pointer; } .e-maps-cursor-disable:hover { cursor: not-allowed; } .e-maps-panning:hover { cursor: pointer; } ' +
            '.e-maps-popup-close { display: block; opacity: 0; }';
        let style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        element.appendChild(style);
    }
    /**
     * To bind events.
     * @return {void}
     * @private
     */
    wireEvents(element, process) {
        EventHandler.add(element, Browser.touchStartEvent, process, this);
        EventHandler.add(element, 'mouseover', this.showTooltip, this);
        EventHandler.add(element, 'mouseout', this.removeTooltip, this);
    }
    mapMouseWheel(e) {
        if (this.maps.zoomSettings.enable && this.maps.zoomSettings.mouseWheelZoom) {
            let map = this.maps;
            let size = map.availableSize;
            map.markerZoomedState = false;
            map.zoomPersistence = map.enablePersistence;
            let position = this.getMousePosition(e.pageX, e.pageY);
            let prevLevel = map.tileZoomLevel;
            let prevScale = map.scale;
            let delta = 1;
            let staticMaxZoomLevel = 22; // google map maximum zoom level value
            let value = (map.isTileMap) ? prevLevel : prevScale;
            if (((position.x > map.mapAreaRect.x) && (position.x < (map.mapAreaRect.x + map.mapAreaRect.width))) &&
                (position.y > map.mapAreaRect.y) && position.y < (map.mapAreaRect.y + map.mapAreaRect.height)) {
                e.preventDefault();
                let direction = (this.browserName === 'mozilla' && !this.isPointer) ?
                    -(e.detail) / 3 > 0 ? 'ZoomIn' : 'ZoomOut' : (e.wheelDelta / 120) > 0 ? 'ZoomIn' : 'ZoomOut';
                if (direction === 'ZoomIn') {
                    map.mapScaleValue = value + delta;
                    map.staticMapZoom = map.tileZoomLevel;
                    if (map.staticMapZoom > 0 && map.staticMapZoom < staticMaxZoomLevel) {
                        map.staticMapZoom += 1;
                    }
                    this.performZooming(position, (value + delta), direction);
                }
                else {
                    map.mapScaleValue = value - delta;
                    map.staticMapZoom = map.tileZoomLevel;
                    if (map.mapScaleValue === 1) {
                        map.markerCenterLatitude = null;
                        map.markerCenterLongitude = null;
                    }
                    if (map.staticMapZoom > 1 && map.staticMapZoom < staticMaxZoomLevel) {
                        map.staticMapZoom -= 1;
                    }
                    this.performZooming(position, (value - delta), direction);
                }
            }
        }
    }
    doubleClick(e) {
        let pageX = e.pageX;
        let pageY = e.pageY;
        let target = e.target;
        if (this.maps.zoomSettings.enable && this.maps.zoomSettings.doubleClickZoom
            && !(e.target['id'].indexOf('_Zooming_') > -1)) {
            let position = this.getMousePosition(pageX, pageY);
            let map = this.maps;
            let size = map.availableSize;
            let prevLevel = map.tileZoomLevel;
            let prevScale = map.scale;
            map.mapScaleValue = map.mapScaleValue + 1;
            let value = (map.isTileMap) ? prevLevel : prevScale;
            if (((position.x > map.mapAreaRect.x) && (position.x < (map.mapAreaRect.x + map.mapAreaRect.width))) &&
                (position.y > map.mapAreaRect.y) && position.y < (map.mapAreaRect.y + map.mapAreaRect.height)) {
                this.performZooming(position, (value + 1), 'ZoomIn');
            }
        }
    }
    mouseDownHandler(e) {
        let pageX;
        let pageY;
        let target;
        let touches = null;
        let element = e.target;
        if (e.type === 'touchstart') {
            this.isTouch = true;
            touches = e.touches;
            target = e.target;
            pageX = touches[0].clientX;
            pageY = touches[0].clientY;
        }
        else {
            pageX = e.pageX;
            pageY = e.pageY;
            target = e.target;
        }
        if (!this.maps.zoomSettings.enablePanning) {
            this.isPanning = this.panColor !== this.selectionColor ? this.maps.zoomSettings.enablePanning
                : this.zoomColor === this.selectionColor;
        }
        else {
            this.isPanning = this.panColor === this.selectionColor ? this.maps.zoomSettings.enablePanning
                : this.zoomColor !== this.selectionColor;
        }
        this.mouseDownLatLong = { x: pageX, y: pageY };
        this.rectZoomingStart = ((!this.isPanning) && this.maps.zoomSettings.enable);
        this.mouseDownPoints = this.getMousePosition(pageX, pageY);
        if (this.isTouch) {
            this.firstMove = true;
            this.pinchFactor = this.maps.scale;
            this.fingers = touches.length;
        }
        this.isSingleClick = true;
    }
    mouseMoveHandler(e) {
        let pageX;
        let pageY;
        let map = this.maps;
        let target;
        let touches = null;
        let zoom = this.maps.zoomSettings;
        if (e.type === 'touchmove') {
            this.isTouch = true;
            target = e.target;
            touches = e.touches;
            pageX = touches[0].clientX;
            pageY = touches[0].clientY;
        }
        else {
            pageX = e.pageX;
            pageY = e.pageY;
            target = e.target;
        }
        if (getElementByID(map.element.id + '_Zooming_KitCollection')) {
            if (target.id.indexOf('_Zooming_') > -1) {
                getElementByID(map.element.id + '_Zooming_KitCollection').setAttribute('opacity', '1');
                if (document.getElementById(map.element.id + '_Zooming_ToolBar_Pan_Group')) {
                    if (!this.maps.zoomSettings.enablePanning) {
                        if (target.id.indexOf('_Zooming_ToolBar') > -1 || target.id.indexOf('_Zooming_Rect') > -1) {
                            getElementByID(map.element.id + '_Zooming_ToolBar_Pan_Rect').setAttribute('opacity', '0.3');
                            getElementByID(map.element.id + '_Zooming_ToolBar_Pan').setAttribute('opacity', '0.3');
                        }
                    }
                }
            }
            else {
                getElementByID(map.element.id + '_Zooming_KitCollection').setAttribute('opacity', '0.3');
                if (!this.maps.zoomSettings.enablePanning && document.getElementById(map.element.id + '_Zooming_ToolBar_Pan_Group')) {
                    getElementByID(map.element.id + '_Zooming_ToolBar_Pan_Rect').setAttribute('opacity', '1');
                    getElementByID(map.element.id + '_Zooming_ToolBar_Pan').setAttribute('opacity', '1');
                }
            }
        }
        if (this.isTouch) {
            if (this.maps.zoomSettings.pinchZooming) {
                if (this.firstMove && touches.length === 2) {
                    this.rectZoomingStart = false;
                    this.updateInteraction();
                    this.touchStartList = targetTouches(e);
                }
                else if (this.touchStartList.length === 2 && touches.length === 2) {
                    this.touchMoveList = targetTouches(e);
                    e.preventDefault();
                    this.rectZoomingStart = false;
                    this.performPinchZooming(e);
                }
                this.firstMove = false;
            }
        }
        this.mouseMovePoints = this.getMousePosition(pageX, pageY);
        let targetId = e.target['id'];
        let targetEle = e.target;
        if (zoom.enable && this.isPanning && ((Browser.isDevice && touches.length > 1) || !Browser.isDevice)) {
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
        if (this.isTouch ? (touches.length === 1 && this.rectZoomingStart) : this.rectZoomingStart) {
            e.preventDefault();
            if (this.maps.zoomSettings.enableSelectionZooming) {
                this.drawZoomRectangle();
            }
        }
    }
    mouseUpHandler(e) {
        let map = this.maps;
        this.rectZoomingStart = false;
        this.isPanning = false;
        this.isSingleClick = this.isSingleClick ? true : false;
        this.isTouch = false;
        this.touchStartList = [];
        this.touchMoveList = [];
        this.lastScale = 1;
        this.maps.element.style.cursor = 'auto';
        if ((!isNullOrUndefined(this.distanceX) || !isNullOrUndefined(this.distanceY)) && (!isNullOrUndefined(this.currentLayer) && this.currentLayer.type === 'SubLayer')) {
            this.toAlignSublayer();
            this.distanceX = this.distanceY = null;
        }
        let zoomRectElement = getElementByID(this.maps.element.id + '_Selection_Rect_Zooming');
        if (zoomRectElement && this.maps.zoomSettings.enable && this.maps.zoomSettings.enableSelectionZooming) {
            remove(zoomRectElement);
            this.performRectZooming();
        }
        this.mouseMoveLatLong = { x: 0, y: 0 };
        this.mouseDownLatLong = { x: 0, y: 0 };
    }
    mouseCancelHandler(e) {
        this.isPanning = false;
        this.isTouch = false;
        this.rectZoomingStart = false;
        let zoomRectElement = getElementByID(this.maps.element.id + '_Selection_Rect_Zooming');
        if (zoomRectElement && this.maps.zoomSettings.enable) {
            remove(zoomRectElement);
            this.performRectZooming();
        }
    }
    /**
     * To handle the click event for maps.
     * @param e
     */
    click(e) {
        let map = this.maps;
        if ((map.markerModule && map.markerModule.sameMarkerData.length > 0) ||
            (e.target['id'].indexOf('MarkerIndex') > -1 && e.target['id'].indexOf('cluster') == -1)) {
            return null;
        }
        if (this.isSingleClick && map.zoomSettings.zoomOnClick && !(e.target['id'].indexOf('_Zooming_') > -1) && !map.zoomSettings.doubleClickZoom
            && (this.zoomColor !== this.selectionColor)) {
            let pageX = e.pageX;
            let pageY = e.pageY;
            let position = this.getMousePosition(pageX, pageY);
            let prevLevel = map.tileZoomLevel;
            let prevScale = map.scale;
            map.mapScaleValue = map.mapScaleValue + 1;
            let value = (map.isTileMap) ? prevLevel : prevScale;
            if (((position.x > map.mapAreaRect.x) && (position.x < (map.mapAreaRect.x + map.mapAreaRect.width))) &&
                (position.y > map.mapAreaRect.y) && position.y < (map.mapAreaRect.y + map.mapAreaRect.height)) {
                this.performZooming(position, (value + 1), 'ZoomIn');
            }
        }
    }
    getMousePosition(pageX, pageY) {
        let map = this.maps;
        let elementRect = map.element.getBoundingClientRect();
        let pageXOffset = map.element.ownerDocument.defaultView.pageXOffset;
        let pageYOffset = map.element.ownerDocument.defaultView.pageYOffset;
        let clientTop = map.element.ownerDocument.documentElement.clientTop;
        let clientLeft = map.element.ownerDocument.documentElement.clientLeft;
        let positionX = elementRect.left + pageXOffset - clientLeft;
        let positionY = elementRect.top + pageYOffset - clientTop;
        return new Point(Math.abs(pageX - positionX), Math.abs(pageY - positionY));
    }
    addEventListener() {
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
    removeEventListener() {
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
    getModuleName() {
        return 'Zoom';
    }
    /**
     * To destroy the zoom.
     * @return {void}
     * @private
     */
    destroy(maps) {
        this.removeEventListener();
        /**
         * Destroy method performed here
         */
    }
}

/**
 * export all modules from maps component
 */

/**
 * exporting all modules from maps index
 */

export { Maps, load, loaded, click, rightClick, doubleClick, resize, tooltipRender, shapeSelected, shapeHighlight, mousemove, mouseup, mousedown, layerRendering, shapeRendering, markerRendering, markerClusterRendering, markerClick, markerClusterClick, markerMouseMove, markerClusterMouseMove, dataLabelRendering, bubbleRendering, bubbleClick, bubbleMouseMove, animationComplete, legendRendering, annotationRendering, itemSelection, itemHighlight, beforePrint, zoomIn, zoomOut, pan, Annotation, Arrow, Font, Border, CenterPosition, TooltipSettings, Margin, ConnectorLineSettings, MarkerClusterSettings, MarkerClusterData, ColorMappingSettings, InitialShapeSelectionSettings, SelectionSettings, HighlightSettings, NavigationLineSettings, BubbleSettings, CommonTitleSettings, SubTitleSettings, TitleSettings, ZoomSettings, ToggleLegendSettings, LegendSettings, DataLabelSettings, ShapeSettings, MarkerBase, MarkerSettings, LayerSettings, Tile, MapsAreaSettings, Size, stringToNumber, calculateSize, createSvg, getMousePosition, degreesToRadians, radiansToDegrees, convertGeoToPoint, convertTileLatLongToPoint, xToCoordinate, yToCoordinate, aitoff, roundTo, sinci, acos, calculateBound, Point, MinMax, GeoLocation, measureText, TextOption, PathOption, ColorValue, RectOption, CircleOption, PolygonOption, PolylineOption, LineOption, Line, MapLocation, Rect, PatternOptions, renderTextElement, convertElement, formatValue, convertStringToValue, convertElementFromLabel, drawSymbols, getValueFromObject, markerColorChoose, markerShapeChoose, clusterTemplate, mergeSeparateCluster, clusterSeparate, marker, markerTemplate, maintainSelection, maintainStyleClass, appendShape, drawCircle, drawRectangle, drawPath, drawPolygon, drawPolyline, drawLine, calculateShapes, drawDiamond, drawTriangle, drawCross, drawHorizontalLine, drawVerticalLine, drawStar, drawBalloon, drawPattern, getFieldData, checkShapeDataFields, checkPropertyPath, filter, getRatioOfBubble, findMidPointOfPolygon, isCustomPath, textTrim, findPosition, removeElement, calculateCenterFromPixel, getTranslate, getZoomTranslate, fixInitialScaleForTile, getElementByID, Internalize, getTemplateFunction, getElement, getShapeData, triggerShapeEvent, getElementsByClassName, querySelector, getTargetElement, createStyle, customizeStyle, triggerItemSelectionEvent, removeClass, elementAnimate, timeout, showTooltip, wordWrap, createTooltip, drawSymbol, renderLegendShape, getElementOffset, changeBorderWidth, changeNavaigationLineWidth, targetTouches, calculateScale, getDistance, getTouches, getTouchCenter, sum, zoomAnimate, animate, MapAjax, smoothTranslate, compareZoomFactor, calculateZoomLevel, LayerPanel, Bubble, BingMap, Marker, ColorMapping, DataLabel, NavigationLine, Legend, Highlight, Selection, MapsTooltip, Zoom, Annotations };
//# sourceMappingURL=ej2-maps.es2015.js.map
