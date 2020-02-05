import { Ajax, Animation, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, L10n, NotifyPropertyChanges, Property, compile, createElement, extend, isBlazor, isNullOrUndefined, merge, print, remove, resetBlazorTemplate, setValue, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { SvgRenderer, Tooltip } from '@syncfusion/ej2-svg-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { PdfBitmap, PdfDocument, PdfPageOrientation } from '@syncfusion/ej2-pdf-export';

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Size = /** @__PURE__ @class */ (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    return Size;
}());
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
    var containerWidth = maps.element.clientWidth;
    var containerHeight = maps.element.clientHeight;
    var parentHeight = maps.element.parentElement.clientHeight;
    var parentWidth = maps.element.parentElement.clientWidth;
    if (maps.isBlazor) {
        parentHeight = (maps.element.parentElement.style.height) ? maps.element.parentElement.clientHeight : 450;
        containerHeight = parentHeight !== 0 ? parentHeight : containerHeight !== 0 ?
            containerHeight : 450;
        containerWidth = parentWidth !== 0 ?
            parentWidth : containerWidth !== 0 ?
            containerWidth : 600;
    }
    maps.availableSize = new Size(stringToNumber(maps.width, containerWidth) || containerWidth || 600, stringToNumber(maps.height, containerHeight) || containerHeight || (maps.isDevice ?
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
    var elementRect = element.getBoundingClientRect();
    var pageXOffset = element.ownerDocument.defaultView.pageXOffset;
    var pageYOffset = element.ownerDocument.defaultView.pageYOffset;
    var clientTop = element.ownerDocument.documentElement.clientTop;
    var clientLeft = element.ownerDocument.documentElement.clientLeft;
    var positionX = elementRect.left + pageXOffset - clientLeft;
    var positionY = elementRect.top + pageYOffset - clientTop;
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
    var mapSize = new Size(mapModel.mapAreaRect.width, mapModel.mapAreaRect.height);
    var x;
    var y;
    var value;
    var lat;
    var lng;
    var temp;
    var longitudeMinMax = mapModel.baseMapBounds.longitude;
    var latitudeMinMax = mapModel.baseMapBounds.latitude;
    var latRadian = degreesToRadians(latitude);
    var lngRadian = degreesToRadians(longitude);
    var type = mapModel.projectionType;
    var size = (mapModel.isTileMap) ? Math.pow(2, 1) * 256 : (isNullOrUndefined(factor)) ? Math.min(mapSize.width, mapSize.height) :
        (Math.min(mapSize.width, mapSize.height) * factor);
    if (layer.geometryType === 'Normal') {
        x = isNullOrUndefined(factor) ? longitude : Math.abs((longitude - longitudeMinMax.min) * factor);
        y = isNullOrUndefined(factor) ? latitude : Math.abs((latitudeMinMax.max - latitude) * factor);
    }
    else if (layer.geometryType === 'Geographic') {
        switch (type) {
            case 'Mercator':
                var pixelOrigin = new Point(size / 2, size / 2);
                x = pixelOrigin.x + longitude * (size / 360);
                var sinY = calculateBound(Math.sin(degreesToRadians(latitude)), -0.9999, 0.9999);
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
                var epsilon = 1e-6;
                temp = (1 + (Math.PI / 2)) * Math.sin(latRadian);
                var delta = Infinity;
                for (var i = 0; i < 10 && Math.abs(delta) > epsilon; i++) {
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
    var size = Math.pow(2, zoomLevel) * 256;
    var x = (center.x + 180) / 360;
    var sinLatitude = Math.sin(center.y * Math.PI / 180);
    var y = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);
    var pixelX = center.x;
    var pixelY = center.y;
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
    var longitudeMinMax = mapObject.baseMapBounds.longitude;
    var totalSize = isNullOrUndefined(mapObject.baseSize) ? mapObject.mapAreaRect.width : mapObject.mapAreaRect.width +
        (Math.abs(mapObject.baseSize.width - mapObject.mapAreaRect.width) / 2);
    return Math.round(totalSize * (val - longitudeMinMax.min) / (longitudeMinMax.max - longitudeMinMax.min) * 100) / 100;
}
/**
 * Method for calculate y point
 */
function yToCoordinate(mapObject, val) {
    var latitudeMinMax = mapObject.baseMapBounds.latitude;
    return Math.round(mapObject.mapAreaRect.height * (val - latitudeMinMax.min) / (latitudeMinMax.max - latitudeMinMax.min) * 100) / 100;
}
/**
 * Method for calculate aitoff projection
 */
function aitoff(x, y) {
    var cosy = Math.cos(y);
    var sincia = sinci(acos(cosy * Math.cos(x /= 2)));
    return new Point(2 * cosy * Math.sin(x) * sincia, Math.sin(y) * sincia);
}
/**
 * Method to round the number
 */
function roundTo(a, b) {
    var c = Math.pow(10, b);
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
var Point = /** @__PURE__ @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
/**
 * Map internal class for min and max
 *
 */
var MinMax = /** @__PURE__ @class */ (function () {
    function MinMax(min, max) {
        this.min = min;
        this.max = max;
    }
    return MinMax;
}());
/**
 * Map internal class locations
 */
var GeoLocation = /** @__PURE__ @class */ (function () {
    function GeoLocation(latitude, longitude) {
        this.latitude = new MinMax(latitude.min, latitude.max);
        this.longitude = new MinMax(longitude.min, longitude.max);
    }
    return GeoLocation;
}());
/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {FontModel} font
 * @param  {string} id
 * @returns no
 * @private
 */
function measureText(text, font) {
    var measureObject = document.getElementById('mapsmeasuretext');
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
var TextOption = /** @__PURE__ @class */ (function () {
    function TextOption(id, x, y, anchor, text, transform, baseLine) {
        if (transform === void 0) { transform = ''; }
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
    return TextOption;
}());
/**
 * Internal use of path options
 * @private
 */
var PathOption = /** @__PURE__ @class */ (function () {
    function PathOption(id, fill, width, color, opacity, dashArray, d) {
        this.id = id;
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
    }
    return PathOption;
}());
/** @private */
var ColorValue = /** @__PURE__ @class */ (function () {
    function ColorValue(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    return ColorValue;
}());
/**
 * Internal use of rectangle options
 * @private
 */
var RectOption = /** @__PURE__ @class */ (function (_super) {
    __extends$1(RectOption, _super);
    function RectOption(id, fill, border, opacity, rect, rx, ry, transform, dashArray) {
        var _this = _super.call(this, id, fill, border.width, border.color, opacity, dashArray) || this;
        _this.y = rect.y;
        _this.x = rect.x;
        _this.height = rect.height;
        _this.width = rect.width;
        _this.rx = rx ? rx : 0;
        _this.ry = ry ? ry : 0;
        _this.transform = transform ? transform : '';
        _this['stroke-dasharray'] = dashArray;
        return _this;
    }
    return RectOption;
}(PathOption));
/**
 * Internal use of circle options
 * @private
 */
var CircleOption = /** @__PURE__ @class */ (function (_super) {
    __extends$1(CircleOption, _super);
    function CircleOption(id, fill, border, opacity, cx, cy, r, dashArray) {
        var _this = _super.call(this, id, fill, border.width, border.color, opacity) || this;
        _this.cy = cy;
        _this.cx = cx;
        _this.r = r;
        _this['stroke-dasharray'] = dashArray;
        return _this;
    }
    return CircleOption;
}(PathOption));
/**
 * Internal use of polygon options
 * @private
 */
var PolygonOption = /** @__PURE__ @class */ (function (_super) {
    __extends$1(PolygonOption, _super);
    function PolygonOption(id, points, fill, width, color, opacity, dashArray) {
        if (opacity === void 0) { opacity = 1; }
        if (dashArray === void 0) { dashArray = ''; }
        var _this = _super.call(this, id, fill, width, color, opacity, dashArray) || this;
        _this.points = points;
        return _this;
    }
    return PolygonOption;
}(PathOption));
/**
 * Internal use of polyline options
 * @private
 */
var PolylineOption = /** @__PURE__ @class */ (function (_super) {
    __extends$1(PolylineOption, _super);
    function PolylineOption(id, points, fill, width, color, opacity, dashArray) {
        if (opacity === void 0) { opacity = 1; }
        if (dashArray === void 0) { dashArray = ''; }
        return _super.call(this, id, points, fill, width, color, opacity, dashArray) || this;
    }
    return PolylineOption;
}(PolygonOption));
/**
 * Internal use of line options
 * @private
 */
var LineOption = /** @__PURE__ @class */ (function (_super) {
    __extends$1(LineOption, _super);
    function LineOption(id, line, fill, width, color, opacity, dashArray) {
        if (opacity === void 0) { opacity = 1; }
        if (dashArray === void 0) { dashArray = ''; }
        var _this = _super.call(this, id, fill, width, color, opacity, dashArray) || this;
        _this.x1 = line.x1;
        _this.y1 = line.y1;
        _this.x2 = line.x2;
        _this.y2 = line.y2;
        return _this;
    }
    return LineOption;
}(PathOption));
/**
 * Internal use of line
 * @property
 */
var Line = /** @__PURE__ @class */ (function () {
    function Line(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    return Line;
}());
/**
 * Internal use of map location type
 */
var MapLocation = /** @__PURE__ @class */ (function () {
    function MapLocation(x, y) {
        this.x = x;
        this.y = y;
    }
    return MapLocation;
}());
/**
 * Internal use of type rect
 * @private
 */
var Rect = /** @__PURE__ @class */ (function () {
    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return Rect;
}());
/**
 * Internal use for pattern creation.
 * @property
 */
var PatternOptions = /** @__PURE__ @class */ (function () {
    function PatternOptions(id, x, y, width, height, patternUnits, patternContentUnits, patternTransform, href) {
        if (patternUnits === void 0) { patternUnits = 'userSpaceOnUse'; }
        if (patternContentUnits === void 0) { patternContentUnits = 'userSpaceOnUse'; }
        if (patternTransform === void 0) { patternTransform = ''; }
        if (href === void 0) { href = ''; }
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
    return PatternOptions;
}());
/**
 * Internal rendering of text
 * @private
 */
function renderTextElement(option, style, color, parent, isMinus) {
    if (isMinus === void 0) { isMinus = false; }
    var renderOptions = {
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
    var text = typeof option.text === 'string' ? option.text : isMinus ? option.text[option.text.length - 1] : option.text[0];
    var tspanElement;
    var renderer = new SvgRenderer('');
    var height;
    var htmlObject = renderer.createText(renderOptions, text);
    htmlObject.style['user-select'] = 'none';
    htmlObject.style['-moz-user-select'] = 'none';
    htmlObject.style['-webkit-touch-callout'] = 'none';
    htmlObject.style['-webkit-user-select'] = 'none';
    htmlObject.style['-khtml-user-select'] = 'none';
    htmlObject.style['-ms-user-select'] = 'none';
    htmlObject.style['-o-user-select'] = 'none';
    if (typeof option.text !== 'string' && option.text.length > 1) {
        for (var i = 1, len = option.text.length; i < len; i++) {
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
    var childElement = createElement('div', {
        id: markerId,
        styles: 'position: absolute;pointer-events: auto;'
    });
    var elementLength = element.length;
    while (elementLength > 0) {
        childElement.appendChild(element[0]);
        elementLength--;
    }
    var templateHtml = childElement.innerHTML;
    var properties = Object.keys(data);
    for (var i = 0; i < properties.length; i++) {
        if (properties[i].toLowerCase() !== 'latitude' && properties[i].toLowerCase() !== 'longitude') {
            templateHtml = templateHtml.replace(new RegExp('{{:' + properties[i] + '}}', 'g'), data[properties[i].toString()]);
        }
    }
    childElement.innerHTML = templateHtml;
    return childElement;
}
function convertElementFromLabel(element, labelId, data, index, mapObj) {
    var labelEle = isNullOrUndefined(element.childElementCount) ? element[0] : element;
    var templateHtml = labelEle.outerHTML;
    var properties = Object.keys(data);
    for (var i = 0; i < properties.length; i++) {
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
    var markerEle;
    var x;
    var y;
    var size = shapeCustom['size'];
    var borderColor = shapeCustom['borderColor'];
    var borderWidth = parseFloat(shapeCustom['borderWidth']);
    var fill = shapeCustom['fill'];
    var dashArray = shapeCustom['dashArray'];
    var border = { color: borderColor, width: borderWidth };
    var opacity = shapeCustom['opacity'];
    var circleOptions;
    var pathOptions;
    var rectOptions;
    pathOptions = new PathOption(markerID, fill, borderWidth, borderColor, opacity, dashArray, '');
    if (shape === 'Circle') {
        var radius = (size.width + size.height) / 4;
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
function markerColorChoose(eventArgs, data) {
    eventArgs.fill = (!isNullOrUndefined(eventArgs.colorValuePath) &&
        !isNullOrUndefined(data[eventArgs.colorValuePath])) ?
        data[eventArgs.colorValuePath] : eventArgs.fill;
    return eventArgs;
}
function markerShapeChoose(eventArgs, data) {
    if (!isNullOrUndefined(eventArgs.shapeValuePath) && !isNullOrUndefined(data[eventArgs.shapeValuePath])) {
        eventArgs.shape = data[eventArgs.shapeValuePath];
        if (data[eventArgs.shapeValuePath] == 'Image') {
            eventArgs.imageUrl = (!isNullOrUndefined(eventArgs.imageUrlValuePath) &&
                !isNullOrUndefined(data[eventArgs.imageUrlValuePath])) ?
                data[eventArgs.imageUrlValuePath] : eventArgs.imageUrl;
        }
    }
    else {
        eventArgs.shape = eventArgs.shape;
        eventArgs.imageUrl = eventArgs.imageUrl;
    }
    return eventArgs;
}
//tslint:disable
function clusterTemplate(currentLayer, markerTemplate, maps, layerIndex, markerCollection, layerElement, check) {
    var bounds = [];
    var colloideBounds = [];
    var tempX = 0;
    var tempY = 0;
    var data;
    var style = currentLayer.markerClusterSettings.labelStyle;
    var options;
    var textElement;
    var postionY = (15 / 4);
    var m = 0;
    var indexCollection = [];
    var clusters = currentLayer.markerClusterSettings;
    var clusterGroup = maps.renderer.createGroup({ id: maps.element.id + '_LayerIndex_' + layerIndex + '_markerCluster' });
    for (var n = 0; n < markerTemplate.childElementCount; n++) {
        var tempElement = markerTemplate.childNodes[n];
        bounds.push(tempElement.getBoundingClientRect());
    }
    var eventArg = {
        cancel: false, name: markerClusterRendering, fill: clusters.fill, height: clusters.height,
        width: clusters.width, imageUrl: clusters.imageUrl, shape: clusters.shape,
        data: data, maps: maps, cluster: clusters, border: clusters.border
    };
    if (isBlazor()) {
        var data_1 = eventArg.data, maps_1 = eventArg.maps, cluster = eventArg.cluster, blazorEventArgs = __rest(eventArg, ["data", "maps", "cluster"]);
        eventArg = blazorEventArgs;
    }
    maps.trigger('markerClusterRendering', eventArg, function (clusterargs) {
        for (var o = 0; o < bounds.length; o++) {
            if (!isNullOrUndefined(bounds[o])) {
                for (var p = o + 1; p < bounds.length; p++) {
                    if (!isNullOrUndefined(bounds[p])) {
                        if (bounds[o].left > bounds[p].right || bounds[o].right < bounds[p].left
                            || bounds[o].top > bounds[p].bottom || bounds[o].bottom < bounds[p].top) {
                        }
                        else {
                            colloideBounds.push(bounds[p]);
                        }
                    }
                }
                tempX = bounds[o].left + bounds[o].width / 2;
                tempY = bounds[o].top + bounds[o].height;
                indexCollection = [];
                for (var q = 0; q < colloideBounds.length; q++) {
                    for (var k = 0; k < bounds.length; k++) {
                        if (!isNullOrUndefined(bounds[k])) {
                            if (colloideBounds[q]['left'] === bounds[k]['left']) {
                                delete bounds[k];
                                for (var r = 0; r < markerTemplate.childElementCount; r++) {
                                    var tempElement = markerTemplate.childNodes[r];
                                    if (colloideBounds[q]['left'] === tempElement.getBoundingClientRect()['left']) {
                                        markerTemplate.childNodes[r]['style']['visibility'] = "hidden";
                                        markerTemplate.childNodes[o]['style']['visibility'] = "hidden";
                                        indexCollection.push(o);
                                        indexCollection.push(r);
                                    }
                                }
                            }
                        }
                    }
                }
                if (colloideBounds.length > 0) {
                    indexCollection = indexCollection.filter(function (item, index, value) { return value.indexOf(item) === index; });
                    var container = maps.element.getBoundingClientRect();
                    tempX = Math.abs(container['left'] - tempX);
                    tempY = Math.abs(container['top'] - tempY);
                    var translate = (maps.isTileMap) ? new Object() : getTranslate(maps, currentLayer, false);
                    var transPoint = (maps.isTileMap) ? { x: 0, y: 0 } : (maps.translatePoint.x !== 0) ?
                        maps.translatePoint : translate['location'];
                    var dataIndex = parseInt(markerTemplate.childNodes[o]['id'].split('_dataIndex_')[1].split('_')[0], 10);
                    var markerIndex = parseInt(markerTemplate.childNodes[o]['id'].split('_MarkerIndex_')[1].split('_')[0], 10);
                    var clusters_1 = currentLayer.markerClusterSettings;
                    var shapeCustom = {
                        size: new Size(clusters_1.width, clusters_1.height),
                        fill: clusters_1.fill, borderColor: clusters_1.border.color,
                        borderWidth: clusters_1.border.width, opacity: clusters_1.opacity,
                        dashArray: clusters_1.dashArray
                    };
                    shapeCustom['fill'] = eventArg.fill;
                    shapeCustom['size']['width'] = eventArg.width;
                    shapeCustom['size']['height'] = eventArg.height;
                    shapeCustom['imageUrl'] = eventArg.imageUrl;
                    shapeCustom['shape'] = eventArg.shape;
                    shapeCustom['borderColor'] = eventArg.border.color;
                    shapeCustom['borderWidth'] = eventArg.border.width;
                    tempX = (maps.isTileMap) ? tempX : (markerTemplate.id.indexOf('_Markers_Group') > -1) ? tempX : ((tempX + transPoint.x) * maps.mapScaleValue);
                    tempY = (maps.isTileMap) ? tempY : (markerTemplate.id.indexOf('_Markers_Group') > -1) ? tempY : ((tempY + transPoint.y) * maps.mapScaleValue);
                    var clusterID = maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_dataIndex_' + dataIndex + '_cluster_' + (m);
                    var labelID = maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_dataIndex_' + dataIndex + '_cluster_' + (m) + '_datalabel_' + m;
                    m++;
                    var imageShapeY = eventArg.shape === 'Image' ? eventArg.height / 2 : 0;
                    var ele = drawSymbols(eventArg.shape, eventArg.imageUrl, { x: 0, y: imageShapeY }, clusterID, shapeCustom, markerCollection, maps);
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
    });
}
function mergeSeparateCluster(sameMarkerData, maps, markerElement) {
    var layerIndex = sameMarkerData[0].layerIndex;
    var clusterIndex = sameMarkerData[0].targetClusterIndex;
    var markerIndex = sameMarkerData[0].markerIndex;
    var markerId = maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex;
    var clusterId = markerId + '_dataIndex_' + sameMarkerData[0].data[0]['index'] + '_cluster_' + clusterIndex;
    var clusterEle = getElement(clusterId);
    var clusterEleLabel = getElement(clusterId + '_datalabel_' + clusterIndex);
    clusterEle.setAttribute('visibility', 'visible');
    clusterEleLabel.setAttribute('visibility', 'visible');
    var markerEle;
    var markerDataLength = sameMarkerData[0].data.length;
    for (var i = 0; i < markerDataLength; i++) {
        markerEle = getElement(markerId + '_dataIndex_' + sameMarkerData[0].data[i]['index']);
        markerEle['style']['visibility'] = "hidden";
    }
    removeElement(maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_markerClusterConnectorLine');
}
function clusterSeparate(sameMarkerData, maps, markerElement, isDom) {
    var layerIndex = sameMarkerData[0].layerIndex;
    var markerIndex = sameMarkerData[0].markerIndex;
    var clusterIndex = sameMarkerData[0].targetClusterIndex;
    var dataIndex = sameMarkerData[0].data[0]['index'];
    var getElementFunction = isDom ? getElement : markerElement.querySelector.bind(markerElement);
    var getQueryConnect = isDom ? '' : '#';
    var markerId = maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex;
    var clusterId = markerId + '_dataIndex_' + dataIndex + '_cluster_' + clusterIndex;
    var clusterEle = getElementFunction(getQueryConnect + '' + clusterId);
    var clusterEleLabel = getElementFunction(getQueryConnect + '' + clusterId + '_datalabel_' + clusterIndex);
    clusterEle.setAttribute('visibility', 'hidden');
    clusterEleLabel.setAttribute('visibility', 'hidden');
    var marker = maps.layers[layerIndex].markerSettings[markerIndex];
    var markerEle = getElementFunction(getQueryConnect + '' + markerId + '_dataIndex_' + dataIndex);
    var height = marker.height;
    var width = marker.width;
    var centerX = +clusterEle.getAttribute('transform').split('translate(')[1].trim().split(' ')[0];
    var centerY = +clusterEle.getAttribute('transform').split('translate(')[1].trim().split(' ')[1].split(')')[0].trim();
    var radius = width + 5;
    var area = 2 * 3.14 * radius;
    var totalMarker = 0;
    var numberOfMarker = Math.round(area / width);
    totalMarker += numberOfMarker;
    var markerDataLength = sameMarkerData[0].data.length;
    var percent = Math.round((height / area) * 100);
    percent = markerDataLength < numberOfMarker ? 100 / markerDataLength : percent;
    var angle = (percent / 100) * 360;
    var newAngle = markerDataLength < numberOfMarker ? 45 : 0;
    var count = 1;
    var start = 'M ' + centerX + ' ' + centerY + ' ';
    var path = '';
    for (var i = 0; i < markerDataLength; i++) {
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
        var x1 = centerX + radius * Math.sin((Math.PI * 2 * newAngle) / 360);
        var y1 = centerY + radius * Math.cos((Math.PI * 2 * newAngle) / 360);
        path += start + 'L ' + (x1) + ' ' + y1 + ' ';
        markerEle = getElementFunction(getQueryConnect + '' + markerId + '_dataIndex_' + sameMarkerData[0].data[i]['index']);
        markerEle.setAttribute('transform', 'translate( ' + x1 + ' ' + y1 + ')');
        markerEle['style']['visibility'] = "visible";
        newAngle += angle;
    }
    var options;
    var connectorLine = maps.layers[layerIndex].markerClusterSettings.connectorLineSettings;
    options = {
        d: path, id: maps.element.id + '_markerClusterConnectorLine', stroke: connectorLine.color,
        opacity: connectorLine.opacity, 'stroke-width': connectorLine.width
    };
    markerElement = isDom ? getElementFunction(maps.element.id + '_Markers_Group') : markerElement;
    var groupEle = maps.renderer.createGroup({ id: maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex + '_markerClusterConnectorLine' });
    groupEle.appendChild(maps.renderer.drawPath(options));
    markerElement.insertBefore(groupEle, markerElement.querySelector('#' + markerId + '_dataIndex_0'));
}
function marker(eventArgs, markerSettings, markerData, dataIndex, location, transPoint, markerID, offset, scale, maps, markerCollection) {
    var shapeCustom = {
        size: new Size(eventArgs.width, eventArgs.height),
        fill: eventArgs.fill, borderColor: eventArgs.border.color,
        borderWidth: eventArgs.border.width, opacity: markerSettings.opacity,
        dashArray: markerSettings.dashArray
    };
    var ele = drawSymbols(eventArgs.shape, eventArgs.imageUrl, { x: 0, y: 0 }, markerID, shapeCustom, markerCollection, maps);
    var x = (maps.isTileMap ? location.x : (location.x + transPoint.x) * scale) + offset.x;
    var y = (maps.isTileMap ? location.y : (location.y + transPoint.y) * scale) + offset.y;
    ele.setAttribute('transform', 'translate( ' + x + ' ' + y + ' )');
    maintainSelection(maps.selectedMarkerElementId, maps.markerSelectionClass, ele, 'MarkerselectionMapStyle');
    markerCollection.appendChild(ele);
    var element = (markerData.length - 1) === dataIndex ? 'marker' : null;
    var markerPoint = new Point(x, y);
    if (markerSettings.animationDuration > 0) {
        elementAnimate(ele, markerSettings.animationDelay, markerSettings.animationDuration, markerPoint, maps, element);
    }
    return markerCollection;
}
function markerTemplate(eventArgs, templateFn, markerID, data, markerIndex, markerTemplate, location, scale, offset, maps) {
    templateFn = getTemplateFunction(eventArgs.template);
    if (templateFn && (!maps.isBlazor ? templateFn(data, null, null, maps.element.id + '_MarkerTemplate' + markerIndex, false).length : {})) {
        var templateElement = templateFn(data, null, null, maps.element.id + '_MarkerTemplate' + markerIndex, false);
        var markerElement = convertElement(templateElement, markerID, data, markerIndex, maps);
        for (var i = 0; i < markerElement.children.length; i++) {
            markerElement.children[i].style.pointerEvents = 'none';
        }
        markerElement.style.left = ((maps.isTileMap ? location.x :
            ((Math.abs(maps.baseMapRectBounds['min']['x'] - location.x)) * scale)) + offset.x) + 'px';
        markerElement.style.top = ((maps.isTileMap ? location.y :
            ((Math.abs(maps.baseMapRectBounds['min']['y'] - location.y)) * scale)) + offset.y) + 'px';
        markerTemplate.appendChild(markerElement);
        if (maps.layers[maps.baseLayerIndex].layerType === 'GoogleStaticMap') {
            var staticMapOffset = getElementByID(maps.element.id + '_StaticGoogleMap').getBoundingClientRect();
            var markerElementOffset = markerElement.getBoundingClientRect();
            var staticMapOffsetWidth = 640;
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
        for (var index = 0; index < elementId.length; index++) {
            if (element.getAttribute('id') === elementId[index]) {
                if (isNullOrUndefined(getElement(elementClass.id)) || index === 0) {
                    document.body.appendChild(elementClass);
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
        var styleClass = void 0;
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
    var tempGroup;
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
            var eq = 72;
            var xValue = void 0;
            var yValue = void 0;
            for (var i = 0; i < 5; i++) {
                xValue = (size.width / 2) * Math.cos((Math.PI / 180) * (i * eq));
                yValue = (size.height / 2) * Math.sin((Math.PI / 180) * (i * eq));
                options.d += (i == 0 ? 'M ' : 'L ') + (location.x + xValue) + ' ' + (location.y + yValue);
            }
            options.d += ' Z';
            break;
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
    var width = size.width;
    var height = size.height;
    location.x -= width / 2;
    location.y -= height;
    options.d = 'M15,0C8.8,0,3.8,5,3.8,11.2C3.8,17.5,9.4,24.4,15,30c5.6-5.6,11.2-12.5,11.2-18.8C26.2,5,21.2,0,15,0z M15,16' +
        'c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S17.8,16,15,16z';
    var balloon = maps.renderer.drawPath(options);
    var x = size.width / 30;
    var y = size.height / 30;
    balloon.setAttribute('transform', 'translate(' + location.x + ', ' + location.y + ') scale(' + x + ', ' + y + ')');
    var g = maps.renderer.createGroup({ id: options.id });
    appendShape(balloon, g);
    return appendShape(g, element);
}
/**
 * Internal rendering of Pattern
 * @private
 */
function drawPattern(maps, options, elements, element) {
    var pattern = maps.renderer.createPattern(options, 'pattern');
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var ele = elements_1[_i];
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
    var newData = [];
    var data;
    for (var _i = 0, dataSource_1 = dataSource; _i < dataSource_1.length; _i++) {
        var temp = dataSource_1[_i];
        data = {};
        for (var _a = 0, fields_1 = fields; _a < fields_1.length; _a++) {
            var field = fields_1[_a];
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
function checkShapeDataFields(dataSource, properties, dataPath, propertyPath) {
    if (!(isNullOrUndefined(properties))) {
        for (var i = 0; i < dataSource.length; i++) {
            var shapePath = checkPropertyPath(dataSource[i][dataPath], propertyPath, properties);
            if (dataSource[i][dataPath] === properties[shapePath]) {
                return i;
            }
        }
    }
    return null;
}
function checkPropertyPath(shapeData, shapePropertyPath, shape) {
    if (!isNullOrUndefined(shapeData) && !isNullOrUndefined(shape)) {
        if (!isNullOrUndefined(shapePropertyPath)) {
            var properties = (Object.prototype.toString.call(shapePropertyPath) === '[object Array]' ?
                shapePropertyPath : [shapePropertyPath]);
            for (var i = 0; i < properties.length; i++) {
                if (shapeData === shape[properties[i]]) {
                    return properties[i];
                }
            }
        }
    }
    return null;
}
function filter(points, start, end) {
    var pointObject = [];
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (start <= point.y && end >= point.y) {
            pointObject.push(point);
        }
    }
    return pointObject;
}
function getRatioOfBubble(min, max, value, minValue, maxValue) {
    var percent = (100 / (maxValue - minValue)) * (value - minValue);
    var bubbleRadius = (((max - min) / 100) * percent) + min;
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
    var min = 0;
    var max = points.length;
    var startX;
    var startY;
    var startX1;
    var startY1;
    var sum = 0;
    var xSum = 0;
    var ySum = 0;
    for (var i = min; i <= max - 1; i++) {
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
    var rightMinPoint = { x: 0, y: 0 };
    var rightMaxPoint = { x: 0, y: 0 };
    var leftMinPoint = { x: 0, y: 0 };
    var leftMaxPoint = { x: 0, y: 0 };
    var bottomMinPoint = { x: 0, y: 0 };
    var bottomMaxPoint = { x: 0, y: 0 };
    var topMinPoint = { x: 0, y: 0 };
    var topMaxPoint = { x: 0, y: 0 };
    var height = 0;
    for (var i = min; i <= max - 1; i++) {
        var point = points[i];
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
    var customPath = false;
    if (Object.prototype.toString.call(layerData) === '[object Array]') {
        Array.prototype.forEach.call(layerData, function (layer, index) {
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
    var label = text;
    var size = measureText(text, font).width;
    if (size > maxWidth) {
        var textLength = text.length;
        for (var i = textLength - 1; i >= 0; --i) {
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
    var x;
    var y;
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
    var element = document.getElementById(id);
    return element ? remove(element) : null;
}
/**
 * @private
 */
function getTranslate(mapObject, layer, animate) {
    var zoomFactorValue = mapObject.zoomSettings.zoomFactor;
    var scaleFactor;
    var center = mapObject.centerPosition;
    var centerLatitude = center.latitude;
    var centerLongitude = center.longitude;
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
    if (!isNullOrUndefined(mapObject.centerLatOfGivenLocation) && !isNullOrUndefined(mapObject.centerLongOfGivenLocation) && mapObject.zoomNotApplied) {
        centerLatitude = mapObject.centerLatOfGivenLocation;
        centerLongitude = mapObject.centerLongOfGivenLocation;
        mapObject.mapScaleValue = scaleFactor = zoomFactorValue = mapObject.scaleOfGivenLocation;
    }
    var min = mapObject.baseMapRectBounds['min'];
    var max = mapObject.baseMapRectBounds['max'];
    var zoomFactor = animate ? 1 : mapObject.mapScaleValue;
    if (isNullOrUndefined(mapObject.currentShapeDataLength)) {
        mapObject.currentShapeDataLength = !isNullOrUndefined(layer.shapeData["features"])
            ? layer.shapeData["features"].length : layer.shapeData["geometries"].length;
    }
    var size = (mapObject.totalRect) ? mapObject.totalRect : mapObject.mapAreaRect;
    var availSize = mapObject.availableSize;
    var x;
    var y;
    var mapWidth = Math.abs(max['x'] - min['x']);
    var mapHeight = Math.abs(min['y'] - max['y']);
    var factor = animate ? 1 : mapObject.markerZoomFactor === 1 ? mapObject.mapScaleValue : zoomFactorValue;
    var titleTextSize = measureText(mapObject.titleSettings.text, mapObject.titleSettings.textStyle);
    if (!isNullOrUndefined(centerLongitude) && !isNullOrUndefined(centerLatitude)) {
        var leftPosition = ((mapWidth + Math.abs(mapObject.mapAreaRect.width - mapWidth)) / 2) / factor;
        var topPosition = ((mapHeight + Math.abs(mapObject.mapAreaRect.height - mapHeight)) / 2) / factor;
        var point = convertGeoToPoint(centerLatitude, centerLongitude, mapObject.mapLayerPanel.calculateFactor(layer), layer, mapObject);
        if (isNullOrUndefined(mapObject.previousProjection) || mapObject.previousProjection !== mapObject.projectionType) {
            x = -point.x + leftPosition;
            y = -point.y + topPosition + (titleTextSize['height'] / 2);
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
            x = size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2)));
            y = size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2)));
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
                    var scale = parseFloat(Math.min(size.height / mapHeight, size.width / mapWidth).toFixed(2));
                    mapHeight *= scale;
                    mapWidth *= scale;
                    y = size.y + ((-(min['y'])) + ((size.height / 2)
                        - (mapHeight / 2)));
                    scaleFactor = scale;
                    x = size.x + ((-(min['x']))
                        + ((size.width / 2) - (mapWidth / 2)));
                }
                else {
                    if (!isNullOrUndefined(mapObject.previousProjection) && mapObject.mapScaleValue === 1) {
                        scaleFactor = parseFloat(Math.min(size.width / mapWidth, size.height / mapHeight).toFixed(2));
                        mapWidth *= scaleFactor;
                        x = size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2)));
                        mapHeight *= scaleFactor;
                        y = size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2)));
                    }
                    else {
                        x = mapObject.zoomTranslatePoint.x;
                        y = mapObject.zoomTranslatePoint.y;
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
    return { scale: scaleFactor, location: new Point(x, y) };
}
/**
 * @private
 */
function getZoomTranslate(mapObject, layer, animate) {
    var zoomFactorValue = mapObject.zoomSettings.zoomFactor;
    var scaleFactor;
    var center = mapObject.centerPosition;
    var latitude = center.latitude;
    var longitude = center.longitude;
    if (isNullOrUndefined(mapObject.mapScaleValue) || (zoomFactorValue > mapObject.mapScaleValue)) {
        mapObject.mapScaleValue = zoomFactorValue;
    }
    if (mapObject.zoomSettings.shouldZoomInitially) {
        mapObject.mapScaleValue = zoomFactorValue = scaleFactor = ((mapObject.enablePersistence || mapObject.zoomSettings.shouldZoomInitially) && mapObject.scale == 1)
            ? mapObject.scale : (isNullOrUndefined(mapObject.markerZoomFactor)) ? mapObject.mapScaleValue : mapObject.markerZoomFactor;
        zoomFactorValue = mapObject.mapScaleValue;
        if (!isNullOrUndefined(mapObject.markerCenterLatitude) && !isNullOrUndefined(mapObject.markerCenterLongitude)) {
            latitude = mapObject.markerCenterLatitude;
            longitude = mapObject.markerCenterLongitude;
        }
    }
    if (!isNullOrUndefined(mapObject.centerLatOfGivenLocation) && !isNullOrUndefined(mapObject.centerLongOfGivenLocation) && mapObject.zoomNotApplied) {
        latitude = mapObject.centerLatOfGivenLocation;
        longitude = mapObject.centerLongOfGivenLocation;
        mapObject.mapScaleValue = scaleFactor = zoomFactorValue = mapObject.scaleOfGivenLocation;
    }
    var zoomFactor = animate ? 1 : mapObject.mapScaleValue;
    var size = mapObject.mapAreaRect;
    var x;
    var y;
    var min = mapObject.baseMapRectBounds['min'];
    var max = mapObject.baseMapRectBounds['max'];
    var factor = animate ? 1 : mapObject.mapScaleValue;
    var mapWidth = Math.abs(max['x'] - min['x']);
    var mapHeight = Math.abs(min['y'] - max['y']);
    if (!isNullOrUndefined(longitude) && !isNullOrUndefined(latitude)) {
        var topPosition = ((mapHeight + Math.abs(mapObject.mapAreaRect.height - mapHeight)) / 2) / factor;
        var leftPosition = ((mapWidth + Math.abs(mapObject.mapAreaRect.width - mapWidth)) / 2) / factor;
        var point = convertGeoToPoint(latitude, longitude, mapObject.mapLayerPanel.calculateFactor(layer), layer, mapObject);
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
            x = -point.x + leftPosition;
            y = -point.y + topPosition;
        }
        if (!isNullOrUndefined(mapObject.translatePoint)) {
            y = (mapObject.enablePersistence && mapObject.translatePoint.y != 0 && !mapObject.zoomNotApplied) ? mapObject.translatePoint.y : y;
            x = (mapObject.enablePersistence && mapObject.translatePoint.x != 0 && !mapObject.zoomNotApplied) ? mapObject.translatePoint.x : x;
        }
        scaleFactor = zoomFactorValue !== 0 ? zoomFactorValue : 1;
    }
    else {
        var zoomFact = mapObject.zoomSettings.zoomFactor === 0 ? 1 : mapObject.zoomSettings.zoomFactor;
        var maxZoomFact = 10;
        zoomFact = zoomFact > maxZoomFact ? maxZoomFact : zoomFact;
        scaleFactor = zoomFact;
        var mapScale = mapObject.mapScaleValue === 0 ? 1 : mapObject.mapScaleValue > maxZoomFact
            ? maxZoomFact : mapObject.mapScaleValue;
        var leftPosition = (size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2))));
        var topPosition = (size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2))));
        if (!isNullOrUndefined(mapObject.zoomTranslatePoint) || !isNullOrUndefined(mapObject.previousProjection)) {
            if (mapObject.previousProjection !== mapObject.projectionType) {
                var previousPositions = [];
                var previousPoints = { x: leftPosition, y: topPosition };
                previousPositions.push(previousPoints);
                for (var i = 1; i < maxZoomFact; i++) {
                    var translatePointX = previousPositions[i - 1]['x'] - (((size.width / (i)) - (size.width / (i + 1))) / 2);
                    var translatePointY = previousPositions[i - 1]['y'] - (((size.height / (i)) - (size.height / (i + 1))) / 2);
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
    var templateFn = null;
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
    var layerIndex = parseInt(targetId.split('_LayerIndex_')[1].split('_')[0], 10);
    var shapeIndex = parseInt(targetId.split('_shapeIndex_')[1].split('_')[0], 10);
    var layer = map.layers[layerIndex];
    var shapeData = layer.layerData[shapeIndex]['property'];
    var data;
    if (layer.dataSource) {
        data = layer.dataSource[checkShapeDataFields(layer.dataSource, shapeData, layer.shapeDataPath, layer.shapePropertyPath)];
    }
    return { shapeData: shapeData, data: data };
}
/**
 * Function to trigger shapeSelected event
 * @private
 */
function triggerShapeEvent(targetId, selection, maps, eventName) {
    var shape = getShapeData(targetId, maps);
    var eventArgs = {
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
        var maps_2 = eventArgs.maps, shapeData = eventArgs.shapeData, blazorEventArgs = __rest(eventArgs, ["maps", "shapeData"]);
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
    var targetEle = null;
    if (document.getElementById(elementSelector)) {
        targetEle = document.getElementById(elementSelector).querySelector('#' + args);
    }
    return targetEle;
}
/**
 * Function to get the element for selection and highlight using public method
 */
function getTargetElement(layerIndex, name, enable, map) {
    var targetId;
    var targetEle;
    var shapeData = map.layers[layerIndex].shapeData['features'];
    for (var i = 0; i < shapeData.length; i++) {
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
    var styleEle = getElement(id);
    styleEle.innerHTML = '.' + className + '{fill:'
        + eventArgs.fill + ';' + 'opacity:' + eventArgs.opacity.toString() + ';' +
        'stroke-width:' + eventArgs.border.width.toString() + ';' +
        'stroke:' + eventArgs.border.color + '}';
}
/**
 * Function to trigger itemSelection event for legend selection and public method
 */
function triggerItemSelectionEvent(selectionSettings, map, targetElement, shapeData, data) {
    var border = {
        color: selectionSettings.border.color,
        width: selectionSettings.border.width / map.scale
    };
    var eventArgs = {
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
    map.trigger('itemSelection', eventArgs, function (observedArgs) {
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
function elementAnimate(element, delay, duration, point, maps, ele, radius) {
    if (radius === void 0) { radius = 0; }
    var centerX = point.x;
    var centerY = point.y;
    var height = 0;
    var transform = element.getAttribute('transform') || '';
    new Animation({}).animate(element, {
        duration: duration,
        delay: delay,
        progress: function (args) {
            if (args.timeStamp > args.delay) {
                height = ((args.timeStamp - args.delay) / args.duration);
                element.setAttribute('transform', 'translate( ' + (centerX - (radius * height)) + ' ' + (centerY - (radius * height)) +
                    ' ) scale(' + height + ')');
            }
        },
        end: function (model) {
            element.setAttribute('transform', transform);
            if (!ele) {
                return;
            }
            var event = {
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
    var tooltip = document.getElementById(id);
    var width = measureText(text, {
        fontFamily: 'Segoe UI', size: '8px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    }).width;
    var str = text.split(' ');
    var demo = str[0].length;
    for (var i = 1; i < str.length; i++) {
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
    var size1 = size.split('px');
    wordWrap(tooltip, text, x, y, size1, width, areaWidth, element);
    var height = tooltip.clientHeight;
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
    var tooltip = getElement(id);
    var style = 'top:' + top.toString() + 'px;' +
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
    var renderer = new SvgRenderer('');
    var temp = renderLegendShape(location, size, shape, options, url);
    var htmlObject = renderer['draw' + temp.functionName](temp.renderOption);
    return htmlObject;
}
/** @private */
function renderLegendShape(location, size, shape, options, url) {
    var renderPath;
    var functionName = 'Path';
    var shapeWidth = size.width;
    var shapeHeight = size.height;
    var shapeX = location.x;
    var shapeY = location.y;
    var x = location.x + (-shapeWidth / 2);
    var y = location.y + (-shapeHeight / 2);
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
            var eq = 72;
            var xValue = void 0;
            var yValue = void 0;
            for (var i = 0; i <= 5; i++) {
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
    var width;
    var height;
    parentElement.appendChild(childElement);
    width = childElement.offsetWidth;
    height = childElement.offsetHeight;
    parentElement.removeChild(childElement);
    return new Size(width, height);
}
/** @private */
function changeBorderWidth(element, index, scale, maps) {
    var childNode;
    for (var l = 0; l < element.childElementCount; l++) {
        childNode = element.childNodes[l];
        if (childNode.id.indexOf('_NavigationGroup') > -1) {
            changeNavaigationLineWidth(childNode, index, scale, maps);
        }
        else {
            var currentStroke = (maps.layersCollection[index].shapeSettings.border.width);
            childNode.setAttribute('stroke-width', (currentStroke / scale).toString());
        }
    }
}
/** @private */
function changeNavaigationLineWidth(element, index, scale, maps) {
    var node;
    for (var m = 0; m < element.childElementCount; m++) {
        node = element.childNodes[m];
        if (node.tagName === 'path') {
            var currentStroke = (maps.layersCollection[index]
                .navigationLineSettings[parseFloat(node.id.split('_NavigationIndex_')[1].split('_')[0])].width);
            node.setAttribute('stroke-width', (currentStroke / scale).toString());
        }
    }
}
// /** Pinch zoom helper methods */
/** @private */
function targetTouches(event) {
    var targetTouches = [];
    var touches = event.touches;
    for (var i = 0; i < touches.length; i++) {
        targetTouches.push({ pageX: touches[i].pageX, pageY: touches[i].pageY });
    }
    return targetTouches;
}
/** @private */
function calculateScale(startTouches, endTouches) {
    var startDistance = getDistance(startTouches[0], startTouches[1]);
    var endDistance = getDistance(endTouches[0], endTouches[1]);
    return (endDistance / startDistance);
}
/** @private */
function getDistance(a, b) {
    var x = a.pageX - b.pageX;
    var y = a.pageY - b.pageY;
    return Math.sqrt(x * x + y * y);
}
/** @private */
function getTouches(touches, maps) {
    var rect = maps.element.getBoundingClientRect();
    var posTop = rect.top + document.defaultView.pageXOffset;
    var posLeft = rect.left + document.defaultView.pageYOffset;
    return Array.prototype.slice.call(touches).map(function (touch) {
        return {
            x: touch.pageX - posLeft,
            y: touch.pageY - posTop,
        };
    });
}
/** @private */
function getTouchCenter(touches) {
    return {
        x: touches.map(function (e) { return e['x']; }).reduce(sum) / touches.length,
        y: touches.map(function (e) { return e['y']; }).reduce(sum) / touches.length
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
    var delta = 0;
    var previousLocation = maps.previousPoint;
    var preScale = maps.previousScale;
    var diffScale = scale - preScale;
    var currentLocation = new MapLocation(0, 0);
    var currentScale = 1;
    if (scale === preScale) {
        element.setAttribute('transform', 'scale( ' + (scale) + ' ) translate( ' + point.x + ' ' + point.y + ' )');
        return;
    }
    var slope = function (previousLocation, point) {
        if (previousLocation.x === point.x) {
            return null;
        }
        return (point.y - previousLocation.y) / (point.x - previousLocation.x);
    };
    var intercept = function (point, slopeValue) {
        if (slopeValue === null) {
            return point.x;
        }
        return point.y - slopeValue * point.x;
    };
    var slopeFactor = slope(previousLocation, point);
    var slopeIntersection = intercept(previousLocation, slopeFactor);
    var horizontalDifference = point.x - previousLocation.x;
    var verticalDifference = point.y - previousLocation.y;
    animate(element, delay, duration, function (args) {
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
    }, function () {
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
    var _this = this;
    var start = null;
    var clearAnimation;
    var markerStyle = 'visibility:visible';
    var startAnimation = function (timestamp) {
        if (!start) {
            start = timestamp;
        }
        var progress = timestamp - start;
        if (progress < duration) {
            process.call(_this, { element: element, delay: 0, timeStamp: progress, duration: duration });
            window.requestAnimationFrame(startAnimation);
        }
        else {
            window.cancelAnimationFrame(clearAnimation);
            end.call(_this, { element: element });
            element.setAttribute('style', markerStyle);
        }
    };
    clearAnimation = window.requestAnimationFrame(startAnimation);
}
/**
 * To get shape data file using Ajax.
 */
var MapAjax = /** @__PURE__ @class */ (function () {
    function MapAjax(options, type, async, contentType, sendData) {
        this.dataOptions = options;
        this.type = type || 'GET';
        this.async = async || true;
        this.contentType = contentType;
        this.sendData = sendData;
    }
    return MapAjax;
}());
/**
 * Animation Translate
 * @private
 */
function smoothTranslate(element, delay, duration, point) {
    var delta = 0;
    var transform = element.getAttribute('transform').split(' ');
    if (transform.length === 2) {
        transform[2] = transform[1].split(')')[0];
        transform[1] = transform[0].split('(')[1];
    }
    var previousLocation = new MapLocation(parseInt(transform[1], 10), parseInt(transform[2], 10));
    var diffx = point.x - previousLocation.x;
    var diffy = point.y - previousLocation.y;
    var currentLocation = new MapLocation(0, 0);
    animate(element, delay, duration, function (args) {
        if (args.timeStamp > args.delay) {
            delta = ((args.timeStamp - args.delay) / args.duration);
            currentLocation.x = previousLocation.x + (delta * diffx);
            currentLocation.y = previousLocation.y + (delta * diffy);
            args.element.setAttribute('transform', 'translate( ' + currentLocation.x + ' ' + currentLocation.y + ' )');
        }
    }, function () {
        element.setAttribute('transform', 'translate( ' + point.x + ' ' + point.y + ' )');
    });
}
/**
 * To find compare should zoom factor with previous factor and current factor
 */
function compareZoomFactor(scaleFactor, maps) {
    var previous = isNullOrUndefined(maps.shouldZoomPreviousFactor) ?
        null : maps.shouldZoomPreviousFactor;
    var current = isNullOrUndefined(maps.shouldZoomCurrentFactor) ?
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
    var latRatio;
    var lngRatio;
    var scaleFactor;
    var maxZoomFact = 10;
    var latZoom;
    var lngZoom;
    var result;
    var maxLatSin = Math.sin(maxLat * Math.PI / 180);
    var maxLatRad = Math.log((1 + maxLatSin) / (1 - maxLatSin)) / 2;
    var maxLatValue = Math.max(Math.min(maxLatRad, Math.PI), -Math.PI) / 2;
    var minLatSin = Math.sin(minLat * Math.PI / 180);
    var minLatRad = Math.log((1 + minLatSin) / (1 - minLatSin)) / 2;
    var minLatValue = Math.max(Math.min(minLatRad, Math.PI), -Math.PI) / 2;
    latRatio = (maxLatValue - minLatValue) / Math.PI;
    var lngDiff = maxLong - minLong;
    lngRatio = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;
    var WORLD_PX_HEIGHT = 256;
    var WORLD_PX_WIDTH = 256;
    latZoom = Math.floor(Math.log(mapHeight / WORLD_PX_HEIGHT / latRatio) / Math.LN2);
    lngZoom = Math.floor(Math.log(mapWidth / WORLD_PX_WIDTH / lngRatio) / Math.LN2);
    result = Math.min(latZoom, lngZoom);
    scaleFactor = Math.min(result, maxZoomFact - 1);
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
    var style;
    var color;
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

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
 * Options for customizing the annotation.
 */
var Annotation = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Annotation, _super);
    function Annotation() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return Annotation;
}(ChildProperty));
var Arrow = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Arrow, _super);
    function Arrow() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return Arrow;
}(ChildProperty));
/**
 * Configures the fonts in maps.
 */
var Font = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Font, _super);
    function Font() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return Font;
}(ChildProperty));
/**
 * Configures the borders in the maps.
 */
var Border = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Border, _super);
    function Border() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property('')
    ], Border.prototype, "color", void 0);
    __decorate$1([
        Property(0)
    ], Border.prototype, "width", void 0);
    return Border;
}(ChildProperty));
/**
 * Configures the center position in the maps.
 */
var CenterPosition = /** @__PURE__ @class */ (function (_super) {
    __extends$2(CenterPosition, _super);
    function CenterPosition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(null)
    ], CenterPosition.prototype, "latitude", void 0);
    __decorate$1([
        Property(null)
    ], CenterPosition.prototype, "longitude", void 0);
    return CenterPosition;
}(ChildProperty));
/**
 * To configure the tooltip settings of the maps.
 */
var TooltipSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(TooltipSettings, _super);
    function TooltipSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return TooltipSettings;
}(ChildProperty));
/**
 * Configures the maps margins.
 */
var Margin = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Margin, _super);
    function Margin() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return Margin;
}(ChildProperty));
/*
 * To configure cluster separate connector line style
 */
var ConnectorLineSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(ConnectorLineSettings, _super);
    function ConnectorLineSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return ConnectorLineSettings;
}(ChildProperty));
/**
 * To configure cluster in marker
 */
var MarkerClusterSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(MarkerClusterSettings, _super);
    function MarkerClusterSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return MarkerClusterSettings;
}(ChildProperty));
/**
 * To configure cluster separate collections.
 */
var MarkerClusterData = /** @__PURE__ @class */ (function (_super) {
    __extends$2(MarkerClusterData, _super);
    function MarkerClusterData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MarkerClusterData;
}(ChildProperty));
/**
 * To configure ColorMapping in Maps
 */
var ColorMappingSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(ColorMappingSettings, _super);
    function ColorMappingSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return ColorMappingSettings;
}(ChildProperty));
/**
 * To configure the initial shape selection settings
 */
var InitialShapeSelectionSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(InitialShapeSelectionSettings, _super);
    function InitialShapeSelectionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(null)
    ], InitialShapeSelectionSettings.prototype, "shapePath", void 0);
    __decorate$1([
        Property(null)
    ], InitialShapeSelectionSettings.prototype, "shapeValue", void 0);
    return InitialShapeSelectionSettings;
}(ChildProperty));
/**
 * To configure the selection settings
 */
var SelectionSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(SelectionSettings, _super);
    function SelectionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return SelectionSettings;
}(ChildProperty));
/**
 * To configure the highlight settings
 */
var HighlightSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(HighlightSettings, _super);
    function HighlightSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return HighlightSettings;
}(ChildProperty));
/**
 * NavigationSelectedLine
 */
var NavigationLineSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(NavigationLineSettings, _super);
    function NavigationLineSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return NavigationLineSettings;
}(ChildProperty));
/**
 * Bubble settings model class
 */
/*tslint:disable-next-line:max-line-length*/
var BubbleSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(BubbleSettings, _super);
    function BubbleSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return BubbleSettings;
}(ChildProperty));
/**
 * To configure title of the maps.
 */
var CommonTitleSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(CommonTitleSettings, _super);
    function CommonTitleSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property('')
    ], CommonTitleSettings.prototype, "text", void 0);
    __decorate$1([
        Property('')
    ], CommonTitleSettings.prototype, "description", void 0);
    return CommonTitleSettings;
}(ChildProperty));
/**
 * To configure subtitle of the maps.
 */
var SubTitleSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(SubTitleSettings, _super);
    function SubTitleSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Complex({ size: Theme.mapsSubTitleFont.size }, Font)
    ], SubTitleSettings.prototype, "textStyle", void 0);
    __decorate$1([
        Property('Center')
    ], SubTitleSettings.prototype, "alignment", void 0);
    return SubTitleSettings;
}(CommonTitleSettings));
/**
 * To configure title of the maps.
 */
var TitleSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(TitleSettings, _super);
    function TitleSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return TitleSettings;
}(CommonTitleSettings));
/**
 * Options to configure maps Zooming Settings.
 */
var ZoomSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(ZoomSettings, _super);
    function ZoomSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(false)
    ], ZoomSettings.prototype, "enable", void 0);
    __decorate$1([
        Property(true)
    ], ZoomSettings.prototype, "enablePanning", void 0);
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
    return ZoomSettings;
}(ChildProperty));
/**
 * To configure the toggle legend settings in the maps
 */
var ToggleLegendSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(ToggleLegendSettings, _super);
    function ToggleLegendSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return ToggleLegendSettings;
}(ChildProperty));
/**
 * Configures the legend settings.
 */
var LegendSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(LegendSettings, _super);
    function LegendSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return LegendSettings;
}(ChildProperty));
/**
 * Customization for Data label settings.
 */
var DataLabelSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(DataLabelSettings, _super);
    function DataLabelSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return DataLabelSettings;
}(ChildProperty));
/**
 * To configure the shapeSettings in the maps.
 */
var ShapeSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(ShapeSettings, _super);
    function ShapeSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return ShapeSettings;
}(ChildProperty));
/**
 * To configure the marker settings for the maps.
 */
var MarkerBase = /** @__PURE__ @class */ (function (_super) {
    __extends$2(MarkerBase, _super);
    function MarkerBase() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return MarkerBase;
}(ChildProperty));
var MarkerSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(MarkerSettings, _super);
    // tslint:disable-next-line:no-any
    function MarkerSettings(parent, propName, defaultValue, isArray) {
        return _super.call(this, parent, propName, defaultValue, isArray) || this;
    }
    return MarkerSettings;
}(MarkerBase));
/**
 * To configure the layers of the maps.
 */
var LayerSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(LayerSettings, _super);
    function LayerSettings() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * @private
         */
        _this.isBaseLayer = false;
        return _this;
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
    return LayerSettings;
}(ChildProperty));
/**
 * Internal use for bing type layer rendering
 */
var Tile = /** @__PURE__ @class */ (function () {
    function Tile(x, y, height, width, top, left, src) {
        if (height === void 0) { height = 256; }
        if (width === void 0) { width = 256; }
        if (top === void 0) { top = 0; }
        if (left === void 0) { left = 0; }
        if (src === void 0) { src = null; }
        this.x = x;
        this.y = y;
        this.top = top;
        this.left = left;
        this.height = height;
        this.width = width;
        this.src = src;
    }
    return Tile;
}());
/**
 * Maps area configuration
 */
var MapsAreaSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(MapsAreaSettings, _super);
    function MapsAreaSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(null)
    ], MapsAreaSettings.prototype, "background", void 0);
    __decorate$1([
        Complex({ color: 'transparent', width: 1 }, Border)
    ], MapsAreaSettings.prototype, "border", void 0);
    return MapsAreaSettings;
}(ChildProperty));

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
var Marker = /** @__PURE__ @class */ (function () {
    function Marker(maps) {
        this.maps = maps;
        this.trackElements = [];
        this.sameMarkerData = [];
    }
    /* tslint:disable:no-string-literal */
    Marker.prototype.markerRender = function (layerElement, layerIndex, factor, type) {
        var _this = this;
        var templateFn;
        var markerCount = 0;
        var markerTemplateCount = 0;
        var currentLayer = this.maps.layersCollection[layerIndex];
        this.markerSVGObject = this.maps.renderer.createGroup({
            id: this.maps.element.id + '_Markers_Group',
            style: 'pointer-events: auto;'
        });
        var markerTemplateEle = createElement('div', {
            id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_Markers_Template_Group',
            className: 'template',
            styles: 'overflow: hidden; position: absolute;pointer-events: none;' +
                'top:' + this.maps.mapAreaRect.y + 'px;' +
                'left:' + this.maps.mapAreaRect.x + 'px;' +
                'height:' + this.maps.mapAreaRect.height + 'px;' +
                'width:' + this.maps.mapAreaRect.width + 'px;'
        });
        //tslint:disable
        currentLayer.markerSettings.map(function (markerSettings, markerIndex) {
            var markerData = markerSettings.dataSource;
            Array.prototype.forEach.call(markerData, function (data, dataIndex) {
                _this.maps.markerNullCount = markerIndex > 0 && dataIndex === 0 ? 0 : _this.maps.markerNullCount;
                var eventArgs = {
                    cancel: false, name: markerRendering, fill: markerSettings.fill, height: markerSettings.height,
                    width: markerSettings.width, imageUrl: markerSettings.imageUrl, shape: markerSettings.shape,
                    template: markerSettings.template, data: data, maps: _this.maps, marker: markerSettings,
                    border: markerSettings.border, colorValuePath: markerSettings.colorValuePath,
                    shapeValuePath: markerSettings.shapeValuePath, imageUrlValuePath: markerSettings.imageUrlValuePath
                };
                eventArgs = markerColorChoose(eventArgs, data);
                eventArgs = markerShapeChoose(eventArgs, data);
                if (_this.maps.isBlazor) {
                    var maps = eventArgs.maps, marker_1 = eventArgs.marker, blazorEventArgs = __rest$1(eventArgs, ["maps", "marker"]);
                    eventArgs = blazorEventArgs;
                }
                _this.maps.trigger('markerRendering', eventArgs, function (MarkerArgs) {
                    if (markerSettings.colorValuePath !== eventArgs.colorValuePath) {
                        eventArgs = markerColorChoose(eventArgs, data);
                    }
                    if (markerSettings.shapeValuePath !== eventArgs.shapeValuePath) {
                        eventArgs = markerShapeChoose(eventArgs, data);
                    }
                    var lng = !isNullOrUndefined(data['longitude']) ? parseFloat(data['longitude']) : null;
                    var lat = !isNullOrUndefined(data['latitude']) ? parseFloat(data['latitude']) : null;
                    if (_this.maps.isBlazor) {
                        var data1 = {};
                        var text = [];
                        var j = 0;
                        for (var i = 0; i < Object.keys(data).length; i++) {
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
                    var offset = markerSettings.offset;
                    if (!eventArgs.cancel && markerSettings.visible && !isNullOrUndefined(lng) && !isNullOrUndefined(lat)) {
                        var markerID = _this.maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_'
                            + markerIndex + '_dataIndex_' + dataIndex;
                        var location_1 = (_this.maps.isTileMap) ? convertTileLatLongToPoint(new MapLocation(lng, lat), factor, _this.maps.tileTranslatePoint, true) : convertGeoToPoint(lat, lng, factor, currentLayer, _this.maps);
                        var animate$$1 = currentLayer.animationDuration !== 0 || isNullOrUndefined(_this.maps.zoomModule);
                        var translate = (_this.maps.isTileMap) ? new Object() :
                            !isNullOrUndefined(_this.maps.zoomModule) && _this.maps.zoomSettings.zoomFactor > 1 ?
                                getZoomTranslate(_this.maps, currentLayer, animate$$1) :
                                getTranslate(_this.maps, currentLayer, animate$$1);
                        var scale = type === 'AddMarker' ? _this.maps.scale : translate['scale'];
                        var transPoint = type === 'AddMarker' ? _this.maps.translatePoint : translate['location'];
                        if (eventArgs.template) {
                            markerTemplateCount++;
                            markerTemplate(eventArgs, templateFn, markerID, data, markerIndex, markerTemplateEle, location_1, scale, offset, _this.maps);
                        }
                        else {
                            markerCount++;
                            marker(eventArgs, markerSettings, markerData, dataIndex, location_1, transPoint, markerID, offset, scale, _this.maps, _this.markerSVGObject);
                        }
                    }
                    markerTemplateCount += (eventArgs.cancel) ? 1 : 0;
                    markerCount += (eventArgs.cancel) ? 1 : 0;
                    _this.maps.markerNullCount = (isNullOrUndefined(lng) || isNullOrUndefined(lat))
                        ? _this.maps.markerNullCount + 1 : _this.maps.markerNullCount;
                    var markerDataLength = markerData.length - _this.maps.markerNullCount;
                    if (_this.markerSVGObject.childElementCount === (markerDataLength - markerTemplateCount) && (type !== 'Template')) {
                        layerElement.appendChild(_this.markerSVGObject);
                        if (currentLayer.markerClusterSettings.allowClustering) {
                            _this.maps.svgObject.appendChild(_this.markerSVGObject);
                            _this.maps.element.appendChild(_this.maps.svgObject);
                            clusterTemplate(currentLayer, _this.markerSVGObject, _this.maps, layerIndex, _this.markerSVGObject, layerElement, true);
                        }
                    }
                    if (markerTemplateEle.childElementCount === (markerData.length - markerCount) && getElementByID(_this.maps.element.id + '_Secondary_Element')) {
                        getElementByID(_this.maps.element.id + '_Secondary_Element').appendChild(markerTemplateEle);
                        if (currentLayer.markerClusterSettings.allowClustering) {
                            clusterTemplate(currentLayer, markerTemplateEle, _this.maps, layerIndex, _this.markerSVGObject, layerElement, false);
                        }
                    }
                });
            });
        });
    };
    /**
     * To find zoom level for individual layers like India, USA.
     */
    Marker.prototype.calculateIndividualLayerMarkerZoomLevel = function (mapWidth, mapHeight, maxZoomFact) {
        var latZoom;
        var lngZoom;
        var result;
        var scaleFactor;
        var height = Math.abs(this.maps.baseMapBounds.latitude.max - this.maps.baseMapBounds.latitude.min);
        var width = Math.abs(this.maps.baseMapBounds.longitude.max - this.maps.baseMapBounds.longitude.min);
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
    };
    /**
     * To calculate center position and factor value dynamically
     */
    Marker.prototype.calculateZoomCenterPositionAndFactor = function (layersCollection) {
        if (this.maps.zoomSettings.shouldZoomInitially && this.maps.markerModule) {
            var minLong_1;
            var maxLat_1;
            var minLat_1;
            var maxLong_1;
            var zoomLevel = void 0;
            var centerLat = void 0;
            var centerLong = void 0;
            var maxZoomFact = 10;
            var mapWidth = this.maps.mapAreaRect.width;
            var mapHeight = this.maps.mapAreaRect.height;
            Array.prototype.forEach.call(layersCollection, function (currentLayer, layerIndex) {
                var isMarker = currentLayer.markerSettings.length !== 0;
                if (isMarker) {
                    Array.prototype.forEach.call(currentLayer.markerSettings, function (markerSetting, markerIndex) {
                        var markerData = markerSetting.dataSource;
                        Array.prototype.forEach.call(markerData, function (data, dataIndex) {
                            var latitude = !isNullOrUndefined(data['latitude']) ? parseFloat(data['latitude']) : null;
                            var longitude = !isNullOrUndefined(data['longitude']) ? parseFloat(data['longitude']) : null;
                            minLong_1 = isNullOrUndefined(minLong_1) && dataIndex === 0 ?
                                longitude : minLong_1;
                            maxLat_1 = isNullOrUndefined(maxLat_1) && dataIndex === 0 ?
                                latitude : maxLat_1;
                            minLat_1 = isNullOrUndefined(minLat_1) && dataIndex === 0 ?
                                latitude : minLat_1;
                            maxLong_1 = isNullOrUndefined(maxLong_1) && dataIndex === 0 ?
                                longitude : maxLong_1;
                            if (minLong_1 > longitude) {
                                minLong_1 = longitude;
                            }
                            if (minLat_1 > latitude) {
                                minLat_1 = latitude;
                            }
                            if (maxLong_1 < longitude) {
                                maxLong_1 = longitude;
                            }
                            if (maxLat_1 < latitude) {
                                maxLat_1 = latitude;
                            }
                        });
                    });
                }
            });
            if (!isNullOrUndefined(minLat_1) && !isNullOrUndefined(minLong_1) &&
                !isNullOrUndefined(maxLong_1) && !isNullOrUndefined(maxLat_1)) {
                // To find the center position
                centerLat = (minLat_1 + maxLat_1) / 2;
                centerLong = (minLong_1 + maxLong_1) / 2;
                this.maps.markerCenterLatitude = centerLat;
                this.maps.markerCenterLongitude = centerLong;
                var markerFactor = void 0;
                if (this.maps.isTileMap || this.maps.baseMapRectBounds['min']['x'] === 0) {
                    zoomLevel = calculateZoomLevel(minLat_1, maxLat_1, minLong_1, maxLong_1, mapWidth, mapHeight, this.maps);
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
    };
    /**
     * To check and trigger marker click event
     */
    Marker.prototype.markerClick = function (e) {
        var target = e.target.id;
        if (target.indexOf('_LayerIndex_') === -1 || target.indexOf('_cluster_') > 0) {
            return;
        }
        var options = this.getMarker(target);
        if (isNullOrUndefined(options)) {
            return;
        }
        var eventArgs = {
            cancel: false, name: markerClick, data: options.data, maps: this.maps,
            marker: options.marker, target: target, x: e.clientX, y: e.clientY,
            latitude: options.data["latitude"] || options.data["Latitude"],
            longitude: options.data["longitude"] || options.data["Longitude"],
            value: options.data["name"]
        };
        if (this.maps.isBlazor) {
            var maps = eventArgs.maps, marker_2 = eventArgs.marker, data = eventArgs.data, blazorEventArgs = __rest$1(eventArgs, ["maps", "marker", "data"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerClick, eventArgs);
    };
    /**
     * To check and trigger Cluster click event
     */
    Marker.prototype.markerClusterClick = function (e) {
        var target = e.target.id;
        if (target.indexOf('_LayerIndex_') === -1 || target.indexOf('_cluster_') === -1) {
            return;
        }
        var options = this.getMarker(target);
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
        var eventArgs = {
            cancel: false, name: markerClusterClick, data: options, maps: this.maps,
            target: target, x: e.clientX, y: e.clientY,
            latitude: options.data["latitude"] || options.data["Latitude"], longitude: options.data["longitude"] || options.data["Longitude"]
        };
        if (this.maps.isBlazor) {
            var maps = eventArgs.maps, data = eventArgs.data, blazorEventArgs = __rest$1(eventArgs, ["maps", "data"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerClusterClick, eventArgs);
    };
    /**
     * To get marker from target id
     */
    Marker.prototype.getMarker = function (target) {
        var id = target.split('_LayerIndex_');
        var index = parseInt(id[1].split('_')[0], 10);
        var layer = this.maps.layers[index];
        var data;
        var clusterCollection = [];
        var marker$$1;
        if (target.indexOf('_MarkerIndex_') > -1) {
            var markerIndex = parseInt(id[1].split('_MarkerIndex_')[1].split('_')[0], 10);
            var dataIndex = parseInt(id[1].split('_dataIndex_')[1].split('_')[0], 10);
            marker$$1 = layer.markerSettings[markerIndex];
            if (!isNaN(markerIndex)) {
                data = marker$$1.dataSource[dataIndex];
                var collection_1 = [];
                if (!marker$$1.template && (target.indexOf('_cluster_') > -1) && (this.maps.layers[index].markerClusterSettings.allowClusterExpand)) {
                    Array.prototype.forEach.call(marker$$1.dataSource, function (location, index) {
                        if (location['latitude'] === data['latitude'] && location['longitude'] === data['longitude']) {
                            collection_1.push({ data: data, index: index });
                        }
                    });
                }
                if ((target.indexOf('_cluster_') > -1)) {
                    var textElement = document.getElementById(target.indexOf('_datalabel_') > -1 ? target : target + '_datalabel_' + target.split('_cluster_')[1]);
                    var isClusterSame = false;
                    if (+textElement.textContent === collection_1.length) {
                        isClusterSame = true;
                    }
                    else {
                        var clusterElement = document.getElementById(target.indexOf('_datalabel_') > -1 ? target.split('_datalabel_')[0] : target);
                        var indexes = clusterElement.innerHTML.split(',').map(Number);
                        collection_1 = [];
                        for (var _i = 0, indexes_1 = indexes; _i < indexes_1.length; _i++) {
                            var i = indexes_1[_i];
                            collection_1.push({ data: marker$$1.dataSource[i], index: i });
                        }
                        isClusterSame = false;
                    }
                    clusterCollection.push({
                        data: collection_1, layerIndex: index, markerIndex: markerIndex,
                        targetClusterIndex: +(target.split('_cluster_')[1].indexOf('_datalabel_') > -1 ? target.split('_cluster_')[1].split('_datalabel_')[0] : target.split('_cluster_')[1]),
                        isClusterSame: isClusterSame
                    });
                }
                return { marker: marker$$1, data: data, clusterCollection: clusterCollection };
            }
        }
        return null;
    };
    /**
     * To check and trigger marker move event
     */
    Marker.prototype.markerMove = function (e) {
        var targetId = e.target.id;
        if (targetId.indexOf('_LayerIndex_') === -1 || targetId.indexOf('_cluster_') > 0) {
            return;
        }
        var options = this.getMarker(targetId);
        if (isNullOrUndefined(options)) {
            return;
        }
        var eventArgs = {
            cancel: false, name: markerMouseMove, data: options.data,
            maps: this.maps, target: targetId, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            var maps = eventArgs.maps, blazorEventArgs = __rest$1(eventArgs, ["maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerMouseMove, eventArgs);
    };
    /**
     * To check and trigger cluster move event
     */
    Marker.prototype.markerClusterMouseMove = function (e) {
        var targetId = e.target.id;
        if (targetId.indexOf('_LayerIndex_') === -1 || targetId.indexOf('_cluster_') === -1) {
            return;
        }
        var options = this.getMarker(targetId);
        if (options.clusterCollection[0].isClusterSame) {
            e.target.setAttribute('style', 'cursor: pointer');
        }
        if (isNullOrUndefined(options)) {
            return;
        }
        var eventArgs = {
            cancel: false, name: markerClusterMouseMove, data: options.data, maps: this.maps,
            target: targetId, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            var maps = eventArgs.maps, blazorEventArgs = __rest$1(eventArgs, ["maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerClusterMouseMove, eventArgs);
    };
    /**
     * Get module name.
     */
    Marker.prototype.getModuleName = function () {
        return 'Marker';
    };
    /**
     * To destroy the layers.
     * @return {void}
     * @private
     */
    Marker.prototype.destroy = function (maps) {
        /**
         * Destroy method performed here
         */
    };
    return Marker;
}());

/**
 * Maps constants doc
 */
/**
 * Specifies maps load event name.
 * @private
 */
var load = 'load';
/**
 * Specifies maps loaded event name.
 * @private
 */
var loaded = 'loaded';
/**
 * Specifies maps click event name.
 * @private
 */
var click = 'click';
/**
 * Specifies maps loaded event name.
 * @private
 */
var rightClick = 'rightClick';
/**
 * Specifies maps double click event name.
 * @private
 */
var doubleClick = 'doubleClick';
/**
 * Specifies maps resize event name.
 * @private
 */
var resize = 'resize';
/**
 * Specifies the map tooltip render event
 */
var tooltipRender = 'tooltipRender';
/**
 * Specifies the map shapeSelected event
 */
var shapeSelected = 'shapeSelected';
/**
 * Specifies the map shapeHighlight event
 */
var shapeHighlight = 'shapeHighlight';
/**
 * Specifies maps mousemove event name.
 * @private
 */
var mousemove = 'mousemove';
/**
 * Specifies maps mouseup event name.
 * @private
 */
var mouseup = 'mouseup';
/**
 * Specifies maps mousedown event name.
 * @private
 */
var mousedown = 'mousedown';
/**
 * Specifies maps layerRendering event name.
 * @private
 */
var layerRendering = 'layerRendering';
/**
 * Specifies maps shapeRendering event name.
 * @private
 */
var shapeRendering = 'shapeRendering';
/**
 * Specifies maps markerRendering event name.
 * @private
 */
var markerRendering = 'markerRendering';
/**
 * Specifies maps clusterRendering event name.
 * @private
 */
var markerClusterRendering = 'markerClusterRendering';
/**
 * Specifies maps markerClick event name.
 * @private
 */
var markerClick = 'markerClick';
/**
 * Specifies maps clusterClick event name.
 * @private
 */
var markerClusterClick = 'markerClusterClick';
/**
 * Specifies maps markerMouseMove event name.
 * @private
 */
var markerMouseMove = 'markerMouseMove';
/**
 * Specifies maps clusterMouseMove event name.
 * @private
 */
var markerClusterMouseMove = 'markerClusterMouseMove';
/**
 * Specifies maps dataLabelRendering event name.
 * @private
 */
var dataLabelRendering = 'dataLabelRendering';
/**
 * Specifies maps bubbleRendering event name.
 * @private
 */
var bubbleRendering = 'bubbleRendering';
/**
 * Specifies maps bubbleClick event name.
 * @private
 */
var bubbleClick = 'bubbleClick';
/**
 * Specifies maps bubbleMouseMove event name.
 * @private
 */
var bubbleMouseMove = 'bubbleMouseMove';
/**
 * Specifies maps animationComplete event name.
 * @private
 */
var animationComplete = 'animationComplete';
/**
 * Specifies maps legendRendering event name.
 * @private
 */
var legendRendering = 'legendRendering';
/**
 * Specifies maps annotationRendering event name.
 * @private
 */
var annotationRendering = 'annotationRendering';
/**
 * Specifies maps itemSelection event name
 * @private
 */
var itemSelection = 'itemSelection';
/**
 * Specifies maps itemHighlight event name
 */
var itemHighlight = 'itemHighlight';
/**
 * Specifies maps beforePrint event name
 */
var beforePrint = 'beforePrint';
/**
 * Specifies the map zoom in event name
 */
var zoomIn = 'zoomIn';
/**
 * Specifies the map zoom out event name
 */
var zoomOut = 'zoomOut';
/**
 * Specifies the map pan event name
 */
var pan = 'pan';

/**
 * Bing map src doc
 */
var BingMap = /** @__PURE__ @class */ (function () {
    function BingMap(maps) {
        this.maps = maps;
    }
    BingMap.prototype.getBingMap = function (tile, key, type, language, imageUrl, subDomains) {
        var quadKey = '';
        var subDomain;
        var maxZoom = Math.min(this.maps.tileZoomLevel, parseInt(this.maxZoom, 10));
        for (var i = maxZoom; i > 0; i--) {
            var digit = 0;
            var mask = 1 << (i - 1);
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
    };
    return BingMap;
}());

/**
 * ColorMapping class
 */
var ColorMapping = /** @__PURE__ @class */ (function () {
    function ColorMapping(maps) {
        this.maps = maps;
    }
    /**
     * To get color based on shape settings.
     * @private
     */
    ColorMapping.prototype.getShapeColorMapping = function (shapeSettings, layerData, color) {
        var colorValuePath = shapeSettings.colorValuePath ? shapeSettings.colorValuePath : shapeSettings.valuePath;
        var equalValue = layerData[colorValuePath];
        var colorValue = Number(equalValue);
        var shapeColor = this.getColorByValue(shapeSettings.colorMapping, colorValue, equalValue);
        return shapeColor ? shapeColor : color;
    };
    /**
     * To color by value and color mapping
     */
    ColorMapping.prototype.getColorByValue = function (colorMapping, colorValue, equalValue) {
        if (isNaN(colorValue) && isNullOrUndefined(equalValue)) {
            return null;
        }
        var fill = '';
        var opacity;
        var gradientFill;
        for (var _i = 0, colorMapping_1 = colorMapping; _i < colorMapping_1.length; _i++) {
            var colorMap = colorMapping_1[_i];
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
    };
    ColorMapping.prototype.deSaturationColor = function (colorMapping, color, rangeValue, equalValue) {
        var opacity = 1;
        if (((rangeValue >= colorMapping.from && rangeValue <= colorMapping.to) || colorMapping.value === equalValue)) {
            var ratio = !isNaN(rangeValue) ? (rangeValue - colorMapping.from) / (colorMapping.to - colorMapping.from) :
                colorMapping.from / (colorMapping.to - colorMapping.from);
            opacity = (ratio * (colorMapping.maxOpacity - colorMapping.minOpacity)) + colorMapping.minOpacity;
        }
        return opacity;
    };
    ColorMapping.prototype.rgbToHex = function (r, g, b) {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    };
    ColorMapping.prototype.componentToHex = function (value) {
        var hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    ColorMapping.prototype.getColor = function (colorMap, value) {
        var color = '';
        var rbg;
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
    };
    /* tslint:disable-next-line:max-func-body-length */
    /* tslint:disable:no-string-literal */
    ColorMapping.prototype.getGradientColor = function (value, colorMap) {
        var previousOffset = colorMap.from;
        var nextOffset = colorMap.to;
        var percent = 0;
        var full = nextOffset - previousOffset;
        var midColor;
        percent = (value - previousOffset) / full;
        var previousColor;
        var nextColor;
        if (colorMap.color.length <= 2) {
            previousColor = colorMap.color[0].charAt(0) === '#' ? colorMap.color[0] : this._colorNameToHex(colorMap.color[0]);
            nextColor = colorMap.color[colorMap.color.length - 1].charAt(0) === '#' ?
                colorMap.color[colorMap.color.length - 1] : this._colorNameToHex(colorMap.color[colorMap.color.length - 1]);
        }
        else {
            previousColor = colorMap.color[0].charAt(0) === '#' ? colorMap.color[0] : this._colorNameToHex(colorMap.color[0]);
            nextColor = colorMap.color[colorMap.color.length - 1].charAt(0) === '#' ?
                colorMap.color[colorMap.color.length - 1] : this._colorNameToHex(colorMap.color[colorMap.color.length - 1]);
            var a = full / (colorMap.color.length - 1);
            var b = void 0;
            var c = void 0;
            var length_1 = colorMap.color.length - 1;
            var splitColorValueOffset = [];
            var splitColor = {};
            for (var j = 1; j < length_1; j++) {
                c = j * a;
                b = previousOffset + c;
                splitColor = { b: b, color: colorMap.color[j] };
                splitColorValueOffset.push(splitColor);
            }
            for (var i = 0; i < splitColorValueOffset.length; i++) {
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
    };
    ColorMapping.prototype.getPercentageColor = function (percent, previous, next) {
        var nextColor = next.split('#')[1];
        var prevColor = previous.split('#')[1];
        var r = this.getPercentage(percent, parseInt(prevColor.substr(0, 2), 16), parseInt(nextColor.substr(0, 2), 16));
        var g = this.getPercentage(percent, parseInt(prevColor.substr(2, 2), 16), parseInt(nextColor.substr(2, 2), 16));
        var b = this.getPercentage(percent, parseInt(prevColor.substr(4, 2), 16), parseInt(nextColor.substr(4, 2), 16));
        return new ColorValue(r, g, b);
    };
    ColorMapping.prototype.getPercentage = function (percent, previous, next) {
        var full = next - previous;
        return Math.round((previous + (full * percent)));
    };
    ColorMapping.prototype._colorNameToHex = function (color) {
        var colors = {
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
    };
    return ColorMapping;
}());

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
var LayerPanel = /** @__PURE__ @class */ (function () {
    function LayerPanel(map) {
        this.tileTranslatePoint = new MapLocation(0, 0);
        this.isMapCoordinates = true;
        this.ajaxProcessCount = 0;
        this.mapObject = map;
        this.ajaxModule = new Ajax();
        this.ajaxResponse = [];
    }
    /* tslint:disable:no-string-literal */
    LayerPanel.prototype.measureLayerPanel = function () {
        var _this = this;
        var layerCollection = this.mapObject.layersCollection;
        var areaRect = this.mapObject.mapAreaRect;
        var secondaryEle = getElementByID(this.mapObject.element.id + '_Secondary_Element');
        if (this.mapObject.isTileMap && secondaryEle) {
            this.tileSvgObject = this.mapObject.renderer.createSvg({
                id: this.mapObject.element.id + '_Tile_SVG', width: areaRect.width,
                height: areaRect.height,
            });
            var parentElement = createElement('div', {
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
            var staticMapSize = 640;
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
        var layerCount = layerCollection.length - 1;
        Array.prototype.forEach.call(layerCollection, function (layer, index) {
            _this.currentLayer = layer;
            _this.processLayers(layer, index);
        });
    };
    /**
     * Tile rendering
     * @private
     */
    LayerPanel.prototype.renderTileLayer = function (panel, layer, layerIndex, bing) {
        panel.currentFactor = panel.calculateFactor(layer);
        var center = new Point(panel.mapObject.centerPosition.longitude, panel.mapObject.centerPosition.latitude);
        var centerTileMap = center;
        if ((this.mapObject.isTileMap && panel.mapObject.markerModule) && panel.mapObject.zoomSettings.enable) {
            panel.mapObject.markerModule.calculateZoomCenterPositionAndFactor(this.mapObject.layersCollection);
            if (!isNullOrUndefined(this.mapObject.markerCenterLatitude) && !isNullOrUndefined(this.mapObject.markerCenterLongitude)) {
                centerTileMap = new Point(panel.mapObject.markerCenterLongitude, panel.mapObject.markerCenterLatitude);
            }
        }
        var zoomFactorValue = panel.mapObject.zoomSettings.shouldZoomInitially &&
            panel.mapObject.zoomSettings.zoomFactor === 1 ? isNullOrUndefined(panel.mapObject.markerZoomFactor) ? 1 :
            panel.mapObject.markerZoomFactor : panel.mapObject.zoomSettings.zoomFactor;
        zoomFactorValue = (panel.mapObject.enablePersistence) ? ((isNullOrUndefined(panel.mapObject.mapScaleValue))
            ? (isNullOrUndefined(panel.mapObject.markerZoomFactor) ? panel.mapObject.zoomSettings.zoomFactor :
                panel.mapObject.markerZoomFactor) : panel.mapObject.mapScaleValue) : zoomFactorValue;
        zoomFactorValue = panel.mapObject.zoomSettings.enable ? zoomFactorValue : panel.mapObject.zoomSettings.zoomFactor;
        if (isNullOrUndefined(panel.mapObject.tileZoomLevel)) {
            panel.mapObject.tileZoomLevel = zoomFactorValue;
        }
        else if (panel.mapObject.zoomSettings.zoomFactor !== 1 || panel.mapObject.zoomSettings.shouldZoomInitially) {
            panel.mapObject.tileZoomLevel = zoomFactorValue;
            if (!isNullOrUndefined(panel.mapObject.tileTranslatePoint) &&
                panel.mapObject.markerZoomFactor !== panel.mapObject.mapScaleValue) {
                panel.mapObject.tileTranslatePoint.x = 0;
                panel.mapObject.tileTranslatePoint.y = 0;
            }
        }
        if (!isNullOrUndefined(panel.mapObject.centerLatOfGivenLocation) && !isNullOrUndefined(panel.mapObject.centerLongOfGivenLocation) &&
            panel.mapObject.zoomNotApplied) {
            centerTileMap.y = panel.mapObject.centerLatOfGivenLocation;
            centerTileMap.x = panel.mapObject.centerLongOfGivenLocation;
            panel.mapObject.tileZoomLevel = panel.mapObject.mapScaleValue = panel.mapObject.scaleOfGivenLocation;
        }
        panel.mapObject.tileTranslatePoint = panel.panTileMap(panel.mapObject.availableSize.width, panel.mapObject.availableSize.height, centerTileMap);
        panel.generateTiles(panel.mapObject.tileZoomLevel, panel.mapObject.tileTranslatePoint, bing);
        if (panel.mapObject.navigationLineModule) {
            panel.layerObject.appendChild(panel.mapObject.navigationLineModule.renderNavigation(panel.currentLayer, panel.mapObject.tileZoomLevel, layerIndex));
        }
        if (panel.mapObject.markerModule) {
            panel.mapObject.markerModule.markerRender(panel.layerObject, layerIndex, panel.mapObject.tileZoomLevel, null);
        }
        panel.translateLayerElements(panel.layerObject, layerIndex);
        panel.layerGroup.appendChild(panel.layerObject);
    };
    LayerPanel.prototype.processLayers = function (layer, layerIndex) {
        var _this = this;
        this.layerObject = (this.mapObject.renderer.createGroup({
            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex
        }));
        if (!this.mapObject.enablePersistence) {
            var itemName = this.mapObject.getModuleName() + this.mapObject.element.id;
            if (navigator.userAgent.indexOf('Edge') === -1) {
                if (!isNullOrUndefined(window.localStorage) && window.localStorage.getItem(itemName)) {
                    window.localStorage.removeItem(itemName);
                }
            }
        }
        var eventArgs = {
            cancel: false, name: layerRendering, index: layerIndex,
            layer: layer, maps: this.mapObject, visible: layer.visible
        };
        if (this.mapObject.isBlazor) {
            var maps = eventArgs.maps, layer_1 = eventArgs.layer, blazorEventArgs = __rest$2(eventArgs, ["maps", "layer"]);
            eventArgs = blazorEventArgs;
        }
        this.mapObject.trigger('layerRendering', eventArgs, function (observedArgs) {
            if (!eventArgs.cancel && eventArgs.visible) {
                if (layer.layerType !== 'Geometry') {
                    if (layer.layerType !== 'Bing' || _this.bing) {
                        _this.renderTileLayer(_this, layer, layerIndex);
                    }
                    else if (layer.key && layer.key.length > 1) {
                        var proxy_1 = _this;
                        var bing_1 = new BingMap(_this.mapObject);
                        var url = 'https://dev.virtualearth.net/REST/V1/Imagery/Metadata/' + layer.bingMapType;
                        var ajax = new Ajax({
                            url: url + '?output=json&include=ImageryProviders&key=' + layer.key
                        });
                        ajax.onSuccess = function (json) {
                            var jsonObject = JSON.parse(json);
                            var resource = jsonObject['resourceSets'][0]['resources'][0];
                            var imageUrl = resource['imageUrl'];
                            var subDomains = resource['imageUrlSubdomains'];
                            var maxZoom = resource['zoomMax'];
                            if (imageUrl !== null && imageUrl !== undefined && imageUrl !== bing_1.imageUrl) {
                                bing_1.imageUrl = imageUrl;
                            }
                            if (subDomains !== null && subDomains !== undefined && subDomains !== bing_1.subDomains) {
                                bing_1.subDomains = subDomains;
                            }
                            if (maxZoom !== null && maxZoom !== undefined && maxZoom !== bing_1.maxZoom) {
                                bing_1.maxZoom = maxZoom;
                            }
                            proxy_1.mapObject['bingMap'] = bing_1;
                            proxy_1.renderTileLayer(proxy_1, layer, layerIndex, bing_1);
                        };
                        ajax.send();
                    }
                }
                else {
                    if (!isNullOrUndefined(layer.shapeData) && (!isNullOrUndefined(layer.shapeData['geometries']) ||
                        !isNullOrUndefined(layer.shapeData['features']))) {
                        var featureData = (!isNullOrUndefined(layer.shapeData['geometries']) &&
                            layer.shapeData['geometries'].length > 0 ? layer.shapeData['geometries'] :
                            layer.shapeData['features']);
                        layer.layerData = [];
                        var bbox = layer.shapeData['bbox'];
                        if (!isNullOrUndefined(bbox) && layer.isBaseLayer) {
                            _this.mapObject.baseMapBounds = new GeoLocation({ min: bbox[0][1], max: bbox[1][1] }, { min: bbox[0][0], max: bbox[1][0] });
                        }
                        else if (isNullOrUndefined(_this.mapObject.baseMapBounds) && !isCustomPath(featureData)) {
                            _this.calculateRectBounds(featureData);
                            // if (isNullOrUndefined(this.mapObject.baseSize)) {
                            //     let minSize: Point = convertGeoToPoint(
                            //         this.mapObject.baseMapBounds.latitude.min,
                            //         this.mapObject.baseMapBounds.longitude.min, this.calculateFactor(layer), layer, this.mapObject
                            //     );
                            //     let maxSize: Point = convertGeoToPoint(
                            //         this.mapObject.baseMapBounds.latitude.max,
                            //         this.mapObject.baseMapBounds.longitude.max, this.calculateFactor(layer), layer, this.mapObject
                            //     );
                            //     this.mapObject.baseSize = new Size(Math.abs(minSize.x - maxSize.x), Math.abs(minSize.y - maxSize.y));
                            // }
                        }
                        _this.calculatePathCollection(layerIndex, featureData);
                    }
                }
            }
        });
        if (!this.mapObject.isTileMap) {
            this.mapObject.svgObject.appendChild(this.layerGroup);
        }
        else if (this.tileSvgObject) {
            this.tileSvgObject.appendChild(this.layerGroup);
        }
    };
    //tslint:disable:max-func-body-length
    LayerPanel.prototype.bubbleCalculation = function (bubbleSettings, range) {
        if (bubbleSettings.dataSource != null && bubbleSettings != null) {
            for (var i = 0; i < bubbleSettings.dataSource.length; i++) {
                var bubbledata = parseFloat(bubbleSettings.dataSource[i][bubbleSettings.valuePath]);
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
    };
    // tslint:disable-next-line:max-func-body-length
    LayerPanel.prototype.calculatePathCollection = function (layerIndex, renderData) {
        var _this = this;
        this.groupElements = [];
        if ((!isCustomPath(renderData))) {
            this.currentFactor = this.calculateFactor(this.currentLayer);
        }
        this.rectBounds = null;
        var shapeSettings = this.currentLayer.shapeSettings;
        var bubbleSettings = this.currentLayer.bubbleSettings;
        Array.prototype.forEach.call(renderData, function (geometryData, index) {
            if (!isNullOrUndefined(geometryData['geometry']) || !isNullOrUndefined(geometryData['coordinates'])) {
                var type = !isNullOrUndefined(geometryData['geometry']) ? geometryData['geometry']['type'] : geometryData['type'];
                var coords = !isNullOrUndefined(geometryData['geometry']) ? geometryData['geometry']['coordinates'] :
                    geometryData['coordinates'];
                var data = geometryData['geometry'];
                var properties = geometryData['properties'];
                _this.generatePoints(type, coords, data, properties);
            }
        });
        this.currentLayer.rectBounds = this.rectBounds;
        if (isNullOrUndefined(this.mapObject.baseMapRectBounds) && this.currentLayer.isBaseLayer) {
            this.mapObject.baseMapRectBounds = this.rectBounds;
        }
        var colors = shapeSettings.palette.length > 1 ? shapeSettings.palette : getShapeColor(this.mapObject.theme);
        var labelTemplateEle = createElement('div', {
            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_Label_Template_Group',
            className: 'template',
            styles: 'pointer-events: none; overflow: hidden; position: absolute;' +
                'top:' + this.mapObject.mapAreaRect.y + 'px;' +
                'left:' + this.mapObject.mapAreaRect.x + 'px;' +
                'height:' + this.mapObject.mapAreaRect.height + 'px;' +
                'width:' + this.mapObject.mapAreaRect.width + 'px;'
        });
        if (this.currentLayer.layerData.length !== 0) {
            var _loop_1 = function (i) {
                var k = void 0;
                var currentShapeData = this_1.currentLayer.layerData[i];
                var pathOptions;
                var polyLineOptions;
                var circleOptions;
                var groupElement;
                var path = '';
                var points = '';
                var getShapeColor_1 = void 0;
                var fill = (shapeSettings.autofill) ? colors[i % colors.length] : shapeSettings.fill;
                var opacity;
                if (shapeSettings.colorValuePath !== null && !isNullOrUndefined(currentShapeData['property'])) {
                    k = checkShapeDataFields(this_1.currentLayer.dataSource, currentShapeData['property'], this_1.currentLayer.shapeDataPath, this_1.currentLayer.shapePropertyPath);
                    if (k !== null && shapeSettings.colorMapping.length === 0) {
                        fill = this_1.currentLayer.dataSource[k][shapeSettings.colorValuePath];
                    }
                    else if (currentShapeData['property'][shapeSettings.colorValuePath] &&
                        this_1.currentLayer.dataSource.length === 0 && shapeSettings.colorMapping.length === 0) {
                        fill = currentShapeData['property'][shapeSettings.colorValuePath];
                    }
                }
                var shapeID = this_1.mapObject.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + i + '_dataIndex_' + k;
                getShapeColor_1 = this_1.getShapeColorMapping(this_1.currentLayer, currentShapeData['property'], fill);
                fill = Object.prototype.toString.call(getShapeColor_1) === '[object Object]' && !isNullOrUndefined(getShapeColor_1['fill'])
                    ? getShapeColor_1['fill'] : fill;
                opacity = (Object.prototype.toString.call(getShapeColor_1) === '[object Object]'
                    && !isNullOrUndefined(getShapeColor_1['opacity'])) ? getShapeColor_1['opacity'] : shapeSettings.opacity;
                var eventArgs = {
                    cancel: false, name: shapeRendering, index: i,
                    data: this_1.currentLayer.dataSource ? this_1.currentLayer.dataSource[k] : null,
                    maps: this_1.mapObject,
                    shape: shapeSettings, fill: fill,
                    border: { width: shapeSettings.border.width, color: shapeSettings.border.color }
                };
                if (this_1.mapObject.isBlazor) {
                    var maps = eventArgs.maps, blazorEventArgs = __rest$2(eventArgs, ["maps"]);
                    eventArgs = blazorEventArgs;
                }
                // tslint:disable-next-line:max-func-body-length
                var shapeRenderingSuccess = function (eventArgs) {
                    var drawingType = !isNullOrUndefined(currentShapeData['_isMultiPolygon'])
                        ? 'MultiPolygon' : isNullOrUndefined(currentShapeData['type']) ? currentShapeData[0]['type'] : currentShapeData['type'];
                    drawingType = (drawingType === 'Polygon' || drawingType === 'MultiPolygon') ? 'Polygon' : drawingType;
                    eventArgs.fill = eventArgs.fill === '#A6A6A6' ? eventArgs.shape.fill : eventArgs.fill;
                    eventArgs.border.color = eventArgs.border.color === '#000000' ? eventArgs.shape.border.color : eventArgs.border.color;
                    eventArgs.border.width = eventArgs.border.width === 0 ? eventArgs.shape.border.width : eventArgs.border.width;
                    _this.mapObject.layers[layerIndex].shapeSettings.border = eventArgs.border;
                    if (_this.groupElements.length < 1) {
                        groupElement = _this.mapObject.renderer.createGroup({
                            id: _this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_' + drawingType + '_Group', transform: ''
                        });
                        _this.groupElements.push(groupElement);
                    }
                    else {
                        for (var i_1 = 0; i_1 < _this.groupElements.length; i_1++) {
                            var ele = _this.groupElements[i_1];
                            if (ele.id.indexOf(drawingType) > -1) {
                                groupElement = ele;
                                break;
                            }
                            else if (i_1 >= _this.groupElements.length - 1) {
                                groupElement = _this.mapObject.renderer.createGroup({
                                    id: _this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_' + drawingType + '_Group'
                                });
                                _this.groupElements.push(groupElement);
                                break;
                            }
                        }
                    }
                    var pathEle;
                    switch (drawingType) {
                        case 'Polygon':
                            if (!currentShapeData['_isMultiPolygon']) {
                                path += 'M' + (currentShapeData[0]['point']['x']) + ' ' + (currentShapeData[0]['point']['y']);
                                currentShapeData.map(function (shapeData) {
                                    path += ' L ' + (shapeData['point']['x']) + ' ' + (shapeData['point']['y']);
                                });
                            }
                            else {
                                path = _this.generateMultiPolygonPath(currentShapeData);
                            }
                            path += ' z ';
                            if (path.length > 3) {
                                pathOptions = new PathOption(shapeID, eventArgs.fill, eventArgs.border.width, eventArgs.border.color, opacity, shapeSettings.dashArray, path);
                                pathEle = _this.mapObject.renderer.drawPath(pathOptions);
                            }
                            break;
                        case 'LineString':
                            currentShapeData.map(function (lineData) {
                                points += lineData['point']['x'] + ' , ' + lineData['point']['y'] + ' ';
                            });
                            polyLineOptions = new PolylineOption(shapeID, points, eventArgs.fill, eventArgs.border.width, eventArgs.border.color, opacity, shapeSettings.dashArray);
                            pathEle = _this.mapObject.renderer.drawPolyline(polyLineOptions);
                            break;
                        case 'Point':
                            var pointData = currentShapeData['point'];
                            circleOptions = new CircleOption(shapeID, eventArgs.fill, eventArgs.border, opacity, pointData['x'], pointData['y'], shapeSettings.circleRadius, null);
                            pathEle = _this.mapObject.renderer.drawCircle(circleOptions);
                            break;
                        case 'Path':
                            path = currentShapeData['point'];
                            pathOptions = new PathOption(shapeID, eventArgs.fill, eventArgs.border.width, eventArgs.border.color, opacity, shapeSettings.dashArray, path);
                            pathEle = _this.mapObject.renderer.drawPath(pathOptions);
                            break;
                    }
                    if (!isNullOrUndefined(pathEle)) {
                        var property = (Object.prototype.toString.call(_this.currentLayer.shapePropertyPath) === '[object Array]' ?
                            _this.currentLayer.shapePropertyPath : [_this.currentLayer.shapePropertyPath]);
                        // tslint:disable-next-line:align
                        var properties = void 0;
                        for (var j = 0; j < property.length; j++) {
                            if (!isNullOrUndefined(currentShapeData['property'])) {
                                properties = property[j];
                                break;
                            }
                        }
                        pathEle.setAttribute('aria-label', ((!isNullOrUndefined(currentShapeData['property'])) ?
                            (currentShapeData['property'][properties]) : ''));
                        pathEle.setAttribute('tabindex', (_this.mapObject.tabIndex + i + 2).toString());
                        maintainSelection(_this.mapObject.selectedElementId, _this.mapObject.shapeSelectionClass, pathEle, 'ShapeselectionMapStyle');
                        if (_this.mapObject.toggledShapeElementId) {
                            for (var j = 0; j < _this.mapObject.toggledShapeElementId.length; j++) {
                                var styleProperty = _this.mapObject.legendSettings.toggleLegendSettings.applyShapeSettings ?
                                    _this.currentLayer.shapeSettings : _this.mapObject.legendSettings.toggleLegendSettings;
                                if (_this.mapObject.toggledShapeElementId[j] === pathEle.id) {
                                    pathEle.setAttribute('fill', styleProperty.fill);
                                    pathEle.setAttribute('stroke', styleProperty.border.color);
                                    pathEle.setAttribute('opacity', (styleProperty.opacity).toString());
                                    pathEle.setAttribute('stroke-width', (styleProperty.border.width).toString());
                                }
                            }
                        }
                        groupElement.appendChild(pathEle);
                    }
                    if (i === _this.currentLayer.layerData.length - 1) {
                        _this.layerFeatures(layerIndex, colors, renderData, labelTemplateEle);
                    }
                };
                shapeRenderingSuccess.bind(this_1);
                this_1.mapObject.trigger('shapeRendering', eventArgs, shapeRenderingSuccess);
            };
            var this_1 = this;
            for (var i = 0; i < this.currentLayer.layerData.length; i++) {
                _loop_1(i);
            }
        }
        else {
            this.layerFeatures(layerIndex, colors, renderData, labelTemplateEle);
        }
    };
    /**
     *  layer features as bubble, marker, datalabel, navigation line.
     */
    LayerPanel.prototype.layerFeatures = function (layerIndex, colors, renderData, labelTemplateEle) {
        var _this = this;
        var bubbleG;
        if (this.currentLayer.bubbleSettings.length && this.mapObject.bubbleModule) {
            var length_1 = this.currentLayer.bubbleSettings.length;
            var bubble_1;
            var _loop_2 = function (j) {
                bubble_1 = this_2.currentLayer.bubbleSettings[j];
                bubbleG = this_2.mapObject.renderer.createGroup({
                    id: this_2.mapObject.element.id + '_LayerIndex_' + layerIndex + '_bubble_Group_' + j
                });
                var range = { min: 0, max: 0 };
                this_2.bubbleCalculation(bubble_1, range);
                bubble_1.dataSource.map(function (bubbleData, i) {
                    _this.renderBubble(_this.currentLayer, bubbleData, colors[i % colors.length], range, j, i, bubbleG, layerIndex, bubble_1);
                });
                this_2.groupElements.push(bubbleG);
            };
            var this_2 = this;
            for (var j = 0; j < length_1; j++) {
                _loop_2(j);
            }
        }
        if ((this.mapObject.markerModule && !this.mapObject.isTileMap) && this.mapObject.zoomSettings.enable) {
            this.mapObject.markerModule.calculateZoomCenterPositionAndFactor(this.mapObject.layersCollection);
        }
        var group = (this.mapObject.renderer.createGroup({
            id: this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_dataLableIndex_Group',
            style: 'pointer-events: none;'
        }));
        if (this.mapObject.dataLabelModule && this.currentLayer.dataLabelSettings.visible) {
            var intersect_1 = [];
            renderData.map(function (currentShapeData, i) {
                _this.renderLabel(_this.currentLayer, layerIndex, currentShapeData, group, i, labelTemplateEle, intersect_1);
            });
            this.groupElements.push(group);
        }
        if (this.mapObject.navigationLineModule) {
            this.groupElements.push(this.mapObject.navigationLineModule.renderNavigation(this.currentLayer, this.currentFactor, layerIndex));
        }
        this.groupElements.map(function (element) {
            _this.layerObject.appendChild(element);
        });
        if (this.mapObject.markerModule) {
            this.mapObject.markerModule.markerRender(this.layerObject, layerIndex, this.currentFactor, null);
        }
        this.translateLayerElements(this.layerObject, layerIndex);
        this.layerGroup.appendChild(this.layerObject);
    };
    /**
     *  render datalabel
     */
    LayerPanel.prototype.renderLabel = function (layer, layerIndex, shape, group, shapeIndex, labelTemplateEle, intersect) {
        this.mapObject.dataLabelModule.renderLabel(layer, layerIndex, shape, layer.layerData, group, labelTemplateEle, shapeIndex, intersect);
    };
    /**
     * To render path for multipolygon
     */
    LayerPanel.prototype.generateMultiPolygonPath = function (currentShapeData) {
        var path = '';
        var shape;
        for (var j = 0; j < currentShapeData.length; j++) {
            path += 'M' + (currentShapeData[j][0]['point']['x']) + ' ' + (currentShapeData[j][0]['point']['y']);
            shape = currentShapeData[j];
            shape.map(function (shapeData) {
                path += ' L ' + (shapeData['point']['x']) + ' ' + (shapeData['point']['y']);
            });
        }
        return path;
    };
    /**
     * To render bubble
     */
    LayerPanel.prototype.renderBubble = function (layer, bubbleData, color, range, bubbleIndex, dataIndex, group, layerIndex, bubbleSettings) {
        if (isNullOrUndefined(this.mapObject.bubbleModule) || !bubbleSettings.visible) {
            return null;
        }
        color = bubbleSettings.fill ? bubbleSettings.fill : color;
        this.mapObject.bubbleModule.id = this.mapObject.element.id + '_LayerIndex_' + layerIndex + '_BubbleIndex_' +
            bubbleIndex + '_dataIndex_' + dataIndex;
        this.mapObject.bubbleModule.renderBubble(bubbleSettings, bubbleData, color, range, bubbleIndex, dataIndex, layerIndex, layer, group, this.mapObject.bubbleModule.id);
    };
    /**
     * To get the shape color from color mapping module
     */
    LayerPanel.prototype.getShapeColorMapping = function (layer, shape, color) {
        color = color ? color : layer.shapeSettings.fill;
        if (layer.shapeSettings.colorMapping.length === 0 && isNullOrUndefined(layer.dataSource)) {
            return color;
        }
        var index = checkShapeDataFields(layer.dataSource, shape, layer.shapeDataPath, layer.shapePropertyPath);
        var colorMapping = new ColorMapping(this.mapObject);
        if (isNullOrUndefined(layer.dataSource[index])) {
            return color;
        }
        return colorMapping.getShapeColorMapping(layer.shapeSettings, layer.dataSource[index], color);
    };
    LayerPanel.prototype.generatePoints = function (type, coordinates, data, properties) {
        var _this = this;
        var latitude;
        var longitude;
        var newData = [];
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
                var multiPolygonDatas = [];
                for (var i = 0; i < coordinates.length; i++) {
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
                coordinates.map(function (points, index) {
                    latitude = points[1];
                    longitude = points[0];
                    var point = convertGeoToPoint(latitude, longitude, _this.currentFactor, _this.currentLayer, _this.mapObject);
                    newData.push({
                        point: point, lat: latitude, lng: longitude
                    });
                });
                newData['property'] = properties;
                newData['type'] = type;
                this.currentLayer.layerData.push(newData);
                break;
            case 'point':
                var arrayCollections_1 = false;
                coordinates.map(function (points, index) {
                    if (Object.prototype.toString.call(points) === '[object Array]') {
                        latitude = points[1];
                        longitude = points[0];
                        arrayCollections_1 = true;
                        var point = convertGeoToPoint(latitude, longitude, _this.currentFactor, _this.currentLayer, _this.mapObject);
                        _this.currentLayer.layerData.push({
                            point: point, type: type, lat: latitude, lng: longitude, property: properties
                        });
                    }
                });
                if (!arrayCollections_1) {
                    latitude = coordinates[1];
                    longitude = coordinates[0];
                    var point = convertGeoToPoint(latitude, longitude, this.currentFactor, this.currentLayer, this.mapObject);
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
    };
    LayerPanel.prototype.calculateFactor = function (layer) {
        var horFactor;
        var verFactor = 1;
        var divide = 10;
        var exp = 'e+1';
        var bounds = this.mapObject.baseMapBounds;
        var mapSize = new Size(this.mapObject.mapAreaRect.width, this.mapObject.mapAreaRect.height - 5);
        var mapHeight;
        var mapWidth;
        if (bounds) {
            var start = convertGeoToPoint(bounds.latitude.min, bounds.longitude.min, null, layer, this.mapObject);
            var end = convertGeoToPoint(bounds.latitude.max, bounds.longitude.max, null, layer, this.mapObject);
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
    };
    LayerPanel.prototype.translateLayerElements = function (layerElement, index) {
        var childNode;
        if (!isNullOrUndefined(this.mapObject.baseMapRectBounds)) {
            var duration = this.currentLayer.animationDuration;
            var animate$$1 = duration !== 0 || isNullOrUndefined(this.mapObject.zoomModule);
            this.mapObject.baseTranslatePoint = this.mapObject.zoomTranslatePoint;
            var translate = void 0;
            if (this.mapObject.zoomSettings.zoomFactor > 1 && !isNullOrUndefined(this.mapObject.zoomModule)) {
                translate = getZoomTranslate(this.mapObject, this.currentLayer, animate$$1);
            }
            else {
                translate = getTranslate(this.mapObject, this.currentLayer, animate$$1);
            }
            var scale = this.mapObject.previousScale = translate['scale'];
            var location_1 = this.mapObject.previousPoint = translate['location'];
            this.mapObject.baseTranslatePoint = this.mapObject.translatePoint = location_1;
            this.mapObject.baseScale = this.mapObject.scale = scale;
            for (var i = 0; i < layerElement.childElementCount; i++) {
                childNode = layerElement.childNodes[i];
                if (!(childNode.id.indexOf('_Markers_Group') > -1) &&
                    (!(childNode.id.indexOf('_bubble_Group') > -1)) &&
                    (!(childNode.id.indexOf('_dataLableIndex_Group') > -1))) {
                    var transform = 'scale( ' + scale + ' ) '
                        + 'translate( ' + location_1.x + ' ' + location_1.y + ' ) ';
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
            for (var j = 0; j < layerElement.childElementCount; j++) {
                childNode = layerElement.childNodes[j];
                if (!(childNode.id.indexOf('_Markers_Group') > -1) &&
                    (!(childNode.id.indexOf('_bubble_Group') > -1)) &&
                    (!(childNode.id.indexOf('_dataLableIndex_Group') > -1)) &&
                    (!(childNode.id.indexOf('_line_Group') > -1))) {
                    var transform = 'scale( ' + this.mapObject.scale + ' ) ' + 'translate( ' + this.mapObject.translatePoint.x
                        + ' ' + this.mapObject.translatePoint.y + ' ) ';
                    childNode.setAttribute('transform', transform);
                }
            }
        }
    };
    LayerPanel.prototype.calculateRectBounds = function (layerData) {
        var _this = this;
        Array.prototype.forEach.call(layerData, function (obj, index) {
            if (!isNullOrUndefined(obj['geometry']) || !isNullOrUndefined(obj['coordinates'])) {
                var type = !isNullOrUndefined(obj['geometry']) ? obj['geometry']['type'] : obj['type'];
                var coordinates = !isNullOrUndefined(obj['geometry']) ? obj['geometry']['coordinates'] : obj['coordinates'];
                switch (type.toLowerCase()) {
                    case 'polygon':
                        _this.calculateRectBox(coordinates[0]);
                        break;
                    case 'multipolygon':
                        coordinates.map(function (point, index) {
                            _this.calculateRectBox(point[0]);
                        });
                        break;
                }
            }
        });
    };
    LayerPanel.prototype.calculatePolygonBox = function (coordinates, data, properties) {
        var _this = this;
        var newData = [];
        var bounds = this.mapObject.baseMapBounds;
        coordinates.map(function (currentPoint, index) {
            var latitude = currentPoint[1];
            var longitude = currentPoint[0];
            if ((longitude >= bounds.longitude.min && longitude <= bounds.longitude.max)
                && (latitude >= bounds.latitude.min && latitude <= bounds.latitude.max)) {
                var point = convertGeoToPoint(latitude, longitude, _this.currentFactor, _this.currentLayer, _this.mapObject);
                if (isNullOrUndefined(_this.rectBounds)) {
                    _this.rectBounds = { min: { x: point.x, y: point.y }, max: { x: point.x, y: point.y } };
                }
                else {
                    _this.rectBounds['min']['x'] = Math.min(_this.rectBounds['min']['x'], point.x);
                    _this.rectBounds['min']['y'] = Math.min(_this.rectBounds['min']['y'], point.y);
                    _this.rectBounds['max']['x'] = Math.max(_this.rectBounds['max']['x'], point.x);
                    _this.rectBounds['max']['y'] = Math.max(_this.rectBounds['max']['y'], point.y);
                }
                newData.push({
                    point: point,
                    lat: latitude,
                    lng: longitude
                });
            }
        });
        return newData;
    };
    LayerPanel.prototype.calculateRectBox = function (coordinates) {
        var _this = this;
        Array.prototype.forEach.call(coordinates, function (currentCoords) {
            if (isNullOrUndefined(_this.mapObject.baseMapBounds)) {
                _this.mapObject.baseMapBounds = new GeoLocation({ min: currentCoords[1], max: currentCoords[1] }, { min: currentCoords[0], max: currentCoords[0] });
            }
            else {
                _this.mapObject.baseMapBounds.latitude.min = Math.min(_this.mapObject.baseMapBounds.latitude.min, currentCoords[1]);
                _this.mapObject.baseMapBounds.latitude.max = Math.max(_this.mapObject.baseMapBounds.latitude.max, currentCoords[1]);
                _this.mapObject.baseMapBounds.longitude.min = Math.min(_this.mapObject.baseMapBounds.longitude.min, currentCoords[0]);
                _this.mapObject.baseMapBounds.longitude.max = Math.max(_this.mapObject.baseMapBounds.longitude.max, currentCoords[0]);
            }
        });
    };
    LayerPanel.prototype.generateTiles = function (zoomLevel, tileTranslatePoint, bing) {
        var userLang = this.mapObject.locale;
        var size = this.mapObject.availableSize;
        this.tiles = [];
        var xcount;
        var ycount;
        xcount = ycount = Math.pow(2, zoomLevel);
        var width = size.width / 2;
        var height = size.height / 2;
        var baseLayer = this.mapObject.layers[this.mapObject.baseLayerIndex];
        this.urlTemplate = baseLayer.urlTemplate;
        var endY = Math.min(ycount, ((-tileTranslatePoint.y + size.height) / 256) + 1);
        var endX = Math.min(xcount, ((-tileTranslatePoint.x + size.width) / 256) + 1);
        var startX = (-(tileTranslatePoint.x + 256) / 256);
        var startY = (-(tileTranslatePoint.y + 256) / 256);
        bing = bing || this.bing || this.mapObject['bingMap'];
        for (var i = Math.round(startX); i < Math.round(endX); i++) {
            for (var j = Math.round(startY); j < Math.round(endY); j++) {
                var x = 256 * i + tileTranslatePoint.x;
                var y = 256 * j + tileTranslatePoint.y;
                if (x > -256 && x <= size.width && y > -256 && y < size.height) {
                    if (i >= 0 && j >= 0) {
                        var tile = new Tile(i, j);
                        tile.left = x;
                        tile.top = y;
                        if (baseLayer.layerType === 'Bing') {
                            var key = baseLayer.key;
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
        var proxTiles = extend([], this.tiles, [], true);
        for (var _i = 0, _a = this.mapObject.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            if (!(layer.type === 'SubLayer' && layer.visible)) {
                continue;
            }
            if (layer.layerType === 'OSM' || layer.layerType === 'Bing') {
                for (var _b = 0, proxTiles_1 = proxTiles; _b < proxTiles_1.length; _b++) {
                    var baseTile = proxTiles_1[_b];
                    var subtile = extend(baseTile, {}, {}, true);
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
        this.arrangeTiles();
    };
    LayerPanel.prototype.arrangeTiles = function () {
        if (this.mapObject.layers[this.mapObject.baseLayerIndex].layerType === 'GoogleStaticMap') {
            this.renderGoogleMap(this.mapObject.layers[0].key, this.mapObject.staticMapZoom);
        }
        else {
            var htmlString = this.templateCompiler(this.tiles);
            if (getElementByID(this.mapObject.element.id + '_tile_parent')) {
                document.getElementById(this.mapObject.element.id + '_tile_parent').innerHTML = htmlString;
            }
        }
    };
    LayerPanel.prototype.templateCompiler = function (tiles) {
        var tileElment = '';
        var id = 0;
        for (var _i = 0, tiles_1 = tiles; _i < tiles_1.length; _i++) {
            var tile = tiles_1[_i];
            tileElment += '<div><div id="tile' + id + '" style="position:absolute;left: ' + tile.left + 'px;top: ' + tile.top +
                'px;height: ' + tile.height + 'px;width: ' + tile.width + 'px;"><img src="' + tile.src + '"></img></div></div>';
            id++;
        }
        return tileElment;
    };
    /* tslint:disable:no-string-literal */
    /**
     * Static map rendering
     * @param apikey
     * @private
     */
    LayerPanel.prototype.renderGoogleMap = function (apikey, zoom) {
        var staticMapString;
        var map = this.mapObject;
        // zoom = this.mapObject.zoomSettings.shouldZoomInitially ? this.mapObject.markerZoomFactor : zoom;
        zoom = this.mapObject.tileZoomLevel;
        var x;
        var y;
        var totalSize = Math.pow(2, zoom) * 256;
        x = (map.mapAreaRect.width / 2) - (totalSize / 2);
        y = (map.mapAreaRect.height / 2) - (totalSize / 2);
        var centerPoint = new Point(null, null);
        var diffX = 0;
        var diffY = 0;
        var position = convertTileLatLongToPoint(centerPoint, zoom, { x: x, y: y }, this.isMapCoordinates);
        if (map.zoomModule && map.zoomSettings.enable) {
            diffX = map.zoomModule.mouseDownLatLong['x'] - map.zoomModule.mouseMoveLatLong['x'];
            diffY = map.zoomModule.mouseDownLatLong['y'] - map.zoomModule.mouseMoveLatLong['y'];
        }
        var panLatLng = map.pointToLatLong(position.x - diffX, position.y - diffY);
        map.centerPosition.latitude = panLatLng['latitude'];
        map.centerPosition.longitude = panLatLng['longitude'];
        var mapWidth;
        var mapHeight;
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
        var eleWidth = mapWidth > 640 ? (mapWidth - 640) / 2 : 0;
        var eleHeight = mapHeight > 640 ? (mapHeight - 640) / 2 : 0;
        var center;
        var mapType = (map.layers[map.layers.length - 1].staticMapType).toString().toLowerCase();
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
    };
    LayerPanel.prototype.panTileMap = function (factorX, factorY, centerPosition) {
        var level = this.mapObject.tileZoomLevel;
        var padding = this.mapObject.layers[this.mapObject.layers.length - 1].layerType !== 'GoogleStaticMap' ?
            20 : 0;
        var x;
        var y;
        var totalSize = Math.pow(2, level) * 256;
        x = (factorX / 2) - (totalSize / 2);
        y = (factorY / 2) - (totalSize / 2);
        var position = convertTileLatLongToPoint(centerPosition, level, { x: x, y: y }, this.isMapCoordinates);
        x -= position.x - (factorX / 2);
        y = (y - (position.y - (factorY / 2))) + padding;
        this.mapObject.scale = Math.pow(2, level - 1);
        if (!isNullOrUndefined(this.mapObject.tileTranslatePoint) && !this.mapObject.zoomNotApplied) {
            if (this.mapObject.tileTranslatePoint.x !== 0 && this.mapObject.tileTranslatePoint.x !== x) {
                x = this.mapObject.tileTranslatePoint.x;
            }
            if (this.mapObject.tileTranslatePoint.y !== 0 && this.mapObject.tileTranslatePoint.y !== y) {
                y = this.mapObject.tileTranslatePoint.y;
            }
        }
        this.mapObject.translatePoint = new Point((x - (0.01 * this.mapObject.scale)) / this.mapObject.scale, (y - (0.01 * this.mapObject.scale)) / this.mapObject.scale);
        return new Point(x, y);
    };
    return LayerPanel;
}());

/**
 * Represent the annotation rendering for map
 */
var Annotations = /** @__PURE__ @class */ (function () {
    function Annotations(map) {
        this.map = map;
    }
    Annotations.prototype.renderAnnotationElements = function () {
        var _this = this;
        var secondaryID = this.map.element.id + '_Secondary_Element';
        var annotationGroup = createElement('div', { id: this.map.element.id + '_Annotations_Group' });
        annotationGroup.style.position = 'absolute';
        annotationGroup.style.top = '0px';
        annotationGroup.style.left = '0px';
        this.map.annotations.map(function (annotation, index) {
            if (annotation.content !== null) {
                _this.createAnnotationTemplate(annotationGroup, annotation, index);
            }
        });
        if (annotationGroup.childElementCount > 0 && !(isNullOrUndefined(getElementByID(secondaryID)))) {
            getElementByID(secondaryID).appendChild(annotationGroup);
            for (var i = 0; i < this.map.annotations.length; i++) {
                updateBlazorTemplate(this.map.element.id + '_ContentTemplate_' + i, 'ContentTemplate', this.map.annotations[i]);
            }
        }
    };
    /**
     * To create annotation elements
     */
    Annotations.prototype.createAnnotationTemplate = function (parentElement, annotation, annotationIndex) {
        var _this = this;
        var left;
        var top;
        var templateFn;
        var map = this.map;
        var templateElement;
        var availSize = map.availableSize;
        var id = map.element.id + '_Annotation_' + annotationIndex;
        var childElement = createElement('div', {
            id: map.element.id + '_Annotation_' + annotationIndex, styles: 'position: absolute; z-index:' + annotation.zIndex + ';'
        });
        var argsData = {
            cancel: false, name: annotationRendering, content: annotation.content,
            annotation: annotation
        };
        this.map.trigger(annotationRendering, argsData, function (annotationArgs) {
            if (argsData.cancel) {
                return;
            }
            var blazor = 'Blazor';
            templateFn = getTemplateFunction(argsData.content);
            if (templateFn && (!window[blazor] ? templateFn(_this.map, null, null, _this.map.element.id + '_ContentTemplate_' + annotationIndex).length : {})) {
                templateElement = Array.prototype.slice.call(templateFn(!window[blazor] ? _this.map : {}, null, null, _this.map.element.id + '_ContentTemplate_' + annotationIndex));
                var length_1 = templateElement.length;
                for (var i = 0; i < length_1; i++) {
                    childElement.appendChild(templateElement[i]);
                }
            }
            else {
                childElement.appendChild(createElement('div', {
                    innerHTML: argsData.content
                }));
            }
        });
        var offset = getElementOffset(childElement.cloneNode(true), map.element);
        var elementRect = map.element.getBoundingClientRect();
        var bounds = map.svgObject.getBoundingClientRect();
        left = Math.abs(bounds.left - elementRect.left);
        top = Math.abs(bounds.top - elementRect.top);
        var annotationXValue = (annotation.x.indexOf('%') > -1) ? (availSize.width / 100) * parseFloat(annotation.x) :
            parseFloat(annotation.x);
        var annotationYValue = (annotation.y.indexOf('%') > -1) ? (availSize.height / 100) * parseFloat(annotation.y) :
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
    };
    /*
   * Get module name.
   */
    Annotations.prototype.getModuleName = function () {
        return 'Annotations';
    };
    /**
     * To destroy the annotation.
     * @return {void}
     * @private
     */
    Annotations.prototype.destroy = function (map) {
        // Destroy method performed here
    };
    return Annotations;
}());

/**
 * Annotation Module handles the Annotation for Maps
 */
var ExportUtils = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for Maps
     * @param control
     */
    function ExportUtils(control) {
        this.control = control;
    }
    /**
     * To print the Maps
     * @param elements
     */
    ExportUtils.prototype.print = function (elements) {
        var _this = this;
        this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWindow.moveTo(0, 0);
        this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
        var argsData = {
            cancel: false, htmlContent: this.getHTMLContent(elements), name: beforePrint
        };
        this.control.trigger('beforePrint', argsData, function (beforePrintArgs) {
            if (!argsData.cancel) {
                print(argsData.htmlContent, _this.printWindow);
            }
        });
    };
    /**
     * To get the html string of the Maps
     * @param elements
     * @private
     */
    ExportUtils.prototype.getHTMLContent = function (elements) {
        var div = createElement('div');
        if (elements) {
            if (elements instanceof Array) {
                Array.prototype.forEach.call(elements, function (value) {
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
    };
    /**
     * To export the file as image/svg format
     * @param type
     * @param fileName
     */
    ExportUtils.prototype.export = function (type, fileName, orientation) {
        var _this = this;
        var element = createElement('canvas', {
            id: 'ej2-canvas',
            attrs: {
                'width': this.control.availableSize.width.toString(),
                'height': this.control.availableSize.height.toString()
            }
        });
        var isDownload = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
        orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
        var svgData = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            this.control.svgObject.outerHTML +
            '</svg>';
        var url = window.URL.createObjectURL(new Blob(type === 'SVG' ? [svgData] :
            [(new XMLSerializer()).serializeToString(this.control.svgObject)], { type: 'image/svg+xml' }));
        if (type === 'SVG') {
            this.triggerDownload(fileName, type, url, isDownload);
        }
        else {
            var image_1 = new Image();
            var ctx_1 = element.getContext('2d');
            image_1.onload = (function () {
                ctx_1.drawImage(image_1, 0, 0);
                window.URL.revokeObjectURL(url);
                if (type === 'PDF') {
                    var document_1 = new PdfDocument();
                    var imageString = element.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                    document_1.pageSettings.orientation = orientation;
                    imageString = imageString.slice(imageString.indexOf(',') + 1);
                    document_1.pages.add().graphics.drawImage(new PdfBitmap(imageString), 0, 0, (_this.control.availableSize.width - 60), _this.control.availableSize.height);
                    if (isDownload) {
                        document_1.save(fileName + '.pdf');
                        document_1.destroy();
                    }
                }
                else {
                    _this.triggerDownload(fileName, type, element.toDataURL('image/png').replace('image/png', 'image/octet-stream'), isDownload);
                }
            });
            image_1.src = url;
        }
    };
    /**
     * To trigger the download element
     * @param fileName
     * @param type
     * @param url
     */
    ExportUtils.prototype.triggerDownload = function (fileName, type, url, isDownload) {
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
    };
    return ExportUtils;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Maps = /** @__PURE__ @class */ (function (_super) {
    __extends(Maps, _super);
    /**
     * Constructor for creating the widget
     */
    function Maps(options, element) {
        var _this = _super.call(this, options, element) || this;
        /**
         * Check layer whether is normal or tile
         * @private
         */
        _this.isTileMap = false;
        /** @private */
        _this.baseSize = new Size(0, 0);
        /** @public */
        _this.translatePoint = new Point(0, 0);
        /** @private */
        _this.baseTranslatePoint = new Point(0, 0);
        /** @public */
        _this.zoomTranslatePoint = new Point(0, 0);
        /** @private */
        _this.markerNullCount = 0;
        /** @private */
        _this.tileTranslatePoint = new Point(0, 0);
        /** @private */
        _this.baseTileTranslatePoint = new Point(0, 0);
        /** @private */
        _this.isDevice = false;
        /** @private */
        _this.staticMapZoom = _this.zoomSettings.enable ? _this.zoomSettings.zoomFactor : 0;
        /** @private */
        _this.zoomNotApplied = false;
        /** @public */
        _this.dataLabelShape = [];
        _this.zoomShapeCollection = [];
        _this.zoomLabelPositions = [];
        _this.mouseDownEvent = { x: null, y: null };
        _this.mouseClickEvent = { x: null, y: null };
        _this.selectedElementId = [];
        _this.selectedMarkerElementId = [];
        _this.selectedBubbleElementId = [];
        _this.selectedNavigationElementId = [];
        _this.selectedLegendElementId = [];
        _this.legendSelectionCollection = [];
        _this.shapeSelections = true;
        _this.legendSelection = true;
        _this.toggledLegendId = [];
        _this.toggledShapeElementId = [];
        _this.checkInitialRender = true;
        setValue('mergePersistData', _this.mergePersistMapsData, _this);
        return _this;
    }
    /**
     * To manage persist maps data
     */
    Maps.prototype.mergePersistMapsData = function () {
        var data;
        if (!isNullOrUndefined(window.localStorage)) {
            data = window.localStorage.getItem(this.getModuleName() + this.element.id);
        }
        if (!(isNullOrUndefined(data) || (data === ''))) {
            var dataObj = JSON.parse(data);
            var keys = Object.keys(dataObj);
            this.isProtectedOnChange = true;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if ((typeof this[key] === 'object') && !isNullOrUndefined(this[key])) {
                    extend(this[key], dataObj[key]);
                }
                else {
                    this[key] = dataObj[key];
                }
            }
            this.isProtectedOnChange = false;
        }
    };
    /**
     * Gets the localized label by locale keyword.
     * @param  {string} key
     * @return {string}
     */
    Maps.prototype.getLocalizedLabel = function (key) {
        return this.localeObject.getConstant(key);
    };
    /**
     * Initializing pre-required values.
     */
    Maps.prototype.preRender = function () {
        this.isDevice = Browser.isDevice;
        this.isBlazor = isBlazor();
        this.initPrivateVariable();
        this.allowServerDataBinding = false;
        this.unWireEVents();
        this.wireEVents();
        this.setCulture();
    };
    /**
     * To Initialize the control rendering.
     */
    Maps.prototype.render = function () {
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
    };
    /* tslint:disable:no-string-literal */
    Maps.prototype.processRequestJsonData = function () {
        var _this = this;
        var length = this.layersCollection.length - 1;
        this.serverProcess = { request: 0, response: 0 };
        var queryModule;
        var dataModule;
        Array.prototype.forEach.call(this.layersCollection, function (layer, layerIndex) {
            if (layer.shapeData instanceof DataManager) {
                _this.serverProcess['request']++;
                dataModule = layer.shapeData;
                queryModule = layer.query instanceof Query ? layer.query : new Query();
                var dataManager = dataModule.executeQuery(queryModule);
                dataManager.then(function (e) {
                    _this.processResponseJsonData('DataManager', e, layer, 'ShapeData');
                });
            }
            else if (layer.shapeData instanceof MapAjax || layer.shapeData) {
                if (!isNullOrUndefined(layer.shapeData['dataOptions'])) {
                    _this.processAjaxRequest(layer, layer.shapeData, 'ShapeData');
                }
            }
            if (layer.dataSource instanceof MapAjax || !isNullOrUndefined(layer.dataSource['dataOptions'])) {
                _this.processAjaxRequest(layer, layer.dataSource, 'DataSource');
            }
            if (_this.serverProcess['request'] === _this.serverProcess['response'] && length === layerIndex) {
                _this.processResponseJsonData(null);
            }
        });
    };
    // tslint:disable:no-any
    Maps.prototype.processAjaxRequest = function (layer, localAjax, type) {
        var _this = this;
        var ajaxModule;
        this.serverProcess['request']++;
        ajaxModule = new Ajax(localAjax.dataOptions, localAjax.type, localAjax.async, localAjax.contentType);
        ajaxModule.onSuccess = function (args) {
            _this.processResponseJsonData('Ajax', args, layer, type);
        };
        ajaxModule.send(localAjax.sendData);
    };
    /* tslint:disable:no-eval */
    Maps.prototype.processResponseJsonData = function (processType, data, layer, dataType) {
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
            var collection = this.layersCollection;
            this.layersCollection = [];
            for (var i = 0; i < collection.length; i++) {
                if (collection[i].isBaseLayer) {
                    this.layersCollection.push(collection[i]);
                }
            }
            for (var j = 0; j < collection.length; j++) {
                if (!collection[j].isBaseLayer) {
                    this.layersCollection.push(collection[j]);
                }
            }
            this.renderMap();
        }
        else if (isNullOrUndefined(processType)) {
            this.renderMap();
        }
    };
    Maps.prototype.renderMap = function () {
        if (!this.isTileMap && this.legendModule && this.legendSettings.visible) {
            this.legendModule.renderLegend();
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
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].selectionSettings && this.layers[i].selectionSettings.enable &&
                this.layers[i].initialShapeSelection.length > 0 && this.checkInitialRender) {
                var checkSelection = this.layers[i].selectionSettings.enableMultiSelect;
                this.layers[i].selectionSettings.enableMultiSelect = checkSelection ? checkSelection : true;
                var shapeSelection = this.layers[i].initialShapeSelection;
                for (var j = 0; j < this.layers[i].initialShapeSelection.length; j++) {
                    this.shapeSelection(i, shapeSelection[j].shapePath, shapeSelection[j].shapeValue, true);
                }
                this.layers[i].selectionSettings.enableMultiSelect = checkSelection;
                if (i === this.layers.length - 1) {
                    this.checkInitialRender = false;
                }
            }
        }
        if (!isNullOrUndefined(document.getElementById(this.element.id + '_tile_parent'))) {
            var svg = this.svgObject.getBoundingClientRect();
            var element = document.getElementById(this.element.id);
            var tileElement = document.getElementById(this.element.id + '_tile_parent');
            var tile = tileElement.getBoundingClientRect();
            var bottom = svg.bottom - tile.bottom - element.offsetTop;
            var left = parseFloat(tileElement.style.left) + element.offsetLeft;
            var top_1 = parseFloat(tileElement.style.top) + element.offsetTop;
            top_1 = (bottom <= 11) ? top_1 : (top_1 * 2);
            left = (bottom <= 11) ? left : (left * 2);
            tileElement.style.top = top_1 + 'px';
            tileElement.style.left = left + 'px';
        }
        this.arrangeTemplate();
        var blazor = this.isBlazor ? this.blazorTemplates() : null;
        if (this.annotationsModule) {
            this.annotationsModule.renderAnnotationElements();
        }
        this.zoomingChange();
        this.trigger(loaded, this.isBlazor ? {} : { maps: this });
    };
    /**
     * To append blazor templates
     */
    Maps.prototype.blazorTemplates = function () {
        var layerLength = this.layers.length - 1;
        var markerLength = this.layers[layerLength].markerSettings.length - 1;
        if (markerLength >= 0) {
            if (this.layers[layerLength].dataLabelSettings.visible || this.layers[layerLength].markerSettings[markerLength].template) {
                updateBlazorTemplate(this.element.id + '_LabelTemplate', 'LabelTemplate', this.layers[layerLength].dataLabelSettings);
                for (var i = 0; i < this.layers.length; i++) {
                    for (var j = 0; j < this.layers[i].markerSettings.length; j++) {
                        updateBlazorTemplate(this.element.id + '_MarkerTemplate' + j, 'MarkerTemplate', this.layers[i].markerSettings[j]);
                    }
                }
            }
        }
    };
    /**
     * Render the map area border
     */
    Maps.prototype.renderArea = function () {
        var width = this.mapsArea.border.width;
        var background = this.mapsArea.background;
        if (width > 0 || (background || this.themeStyle.areaBackgroundColor)) {
            var rect = new RectOption(this.element.id + '_MapAreaBorder', background || this.themeStyle.areaBackgroundColor, this.mapsArea.border, 1, this.mapAreaRect);
            this.svgObject.appendChild(this.renderer.drawRectangle(rect));
        }
    };
    /**
     * To add tab index for map element
     */
    Maps.prototype.addTabIndex = function () {
        this.element.setAttribute('aria-label', this.description || 'Maps Element');
        this.element.setAttribute('tabindex', this.tabIndex.toString());
    };
    // private setSecondaryElementPosition(): void {
    //     if (!this.isTileMap) {
    //         let element: HTMLDivElement = getElementByID(this.element.id + '_Secondary_Element') as HTMLDivElement;
    //         let rect: ClientRect = this.element.getBoundingClientRect();
    //         let svgRect: ClientRect = getElementByID(this.element.id + '_svg').getBoundingClientRect();
    //         element.style.marginLeft = Math.max(svgRect.left - rect.left, 0) + 'px';
    //         element.style.marginTop = Math.max(svgRect.top - rect.top, 0) + 'px';
    //     }
    // }
    Maps.prototype.zoomingChange = function () {
        var left;
        var top;
        if (getElementByID(this.element.id + '_Layer_Collections') && this.zoomModule) {
            this.zoomModule.layerCollectionEle = getElementByID(this.element.id + '_Layer_Collections');
        }
        if (this.isTileMap && getElementByID(this.element.id + '_Tile_SVG') && getElementByID(this.element.id + '_tile_parent')) {
            var tileRect = getElementByID(this.element.id + '_tile_parent').getBoundingClientRect();
            var tileSvgRect = getElementByID(this.element.id + '_Tile_SVG').getBoundingClientRect();
            left = (tileRect.left - tileSvgRect.left);
            top = (tileRect.top - tileSvgRect.top);
            getElementByID(this.element.id + '_Tile_SVG_Parent').style.left = left + 'px';
            getElementByID(this.element.id + '_Tile_SVG_Parent').style.top = top + 'px';
            var markerTemplateElements = document.getElementsByClassName('template');
            if (!isNullOrUndefined(markerTemplateElements) && markerTemplateElements.length > 0) {
                for (var i = 0; i < markerTemplateElements.length; i++) {
                    var templateGroupEle = markerTemplateElements[i];
                    templateGroupEle.style.left = left + 'px';
                    templateGroupEle.style.top = top + 'px';
                }
            }
        }
        if (this.zoomSettings.zoomFactor >= 1) {
            if (this.zoomModule && this.zoomModule.toolBarGroup && this.zoomSettings.enable) {
                this.zoomModule.alignToolBar();
            }
            var elements = document.getElementById(this.element.id + '_Layer_Collections');
            if (!isNullOrUndefined(elements) && elements.childElementCount > 0) {
                for (var i = 0; i < elements.childNodes.length; i++) {
                    var childElement = elements.childNodes[i];
                    if (childElement.tagName === 'g') {
                        var layerIndex = parseFloat(childElement.id.split('_LayerIndex_')[1].split('_')[0]);
                        for (var j = 0; j < childElement.childNodes.length; j++) {
                            var childNode = childElement.childNodes[j];
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
    };
    Maps.prototype.createSecondaryElement = function () {
        if (isNullOrUndefined(document.getElementById(this.element.id + '_Secondary_Element'))) {
            var secondaryElement = createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: absolute;z-index:1;'
            });
            this.element.appendChild(secondaryElement);
        }
    };
    Maps.prototype.arrangeTemplate = function () {
        var secondaryEle = getElementByID(this.element.id + '_Secondary_Element');
        if (document.getElementById(this.element.id + '_Legend_Border')) {
            document.getElementById(this.element.id + '_Legend_Border').style.pointerEvents = 'none';
        }
        var templateElements = document.getElementsByClassName('template');
        if (!isNullOrUndefined(templateElements) && templateElements.length > 0 && getElementByID(this.element.id + '_Layer_Collections')) {
            for (var i = 0; i < templateElements.length; i++) {
                var templateGroupEle = templateElements[i];
                if (!isNullOrUndefined(templateGroupEle) && templateGroupEle.childElementCount > 0) {
                    var layerOffset = getElementByID(this.element.id + '_Layer_Collections').getBoundingClientRect();
                    var elementOffset = getElementByID(templateGroupEle.id).getBoundingClientRect();
                    var offSetLetValue = this.isTileMap ? 0 : (layerOffset.left < elementOffset.left) ?
                        -(Math.abs(elementOffset.left - layerOffset.left)) : (Math.abs(elementOffset.left - layerOffset.left));
                    var offSetTopValue = this.isTileMap ? 0 : (layerOffset.top < elementOffset.top) ?
                        -(Math.abs(elementOffset.top - layerOffset.top)) : Math.abs(elementOffset.top - layerOffset.top);
                    for (var j = 0; j < templateGroupEle.childElementCount; j++) {
                        var currentTemplate = templateGroupEle.childNodes[j];
                        currentTemplate.style.left = parseFloat(currentTemplate.style.left) + offSetLetValue + 'px';
                        currentTemplate.style.top = parseFloat(currentTemplate.style.top) + offSetTopValue + 'px';
                        currentTemplate.style.transform = 'translate(-50%, -50%)';
                    }
                }
            }
        }
    };
    Maps.prototype.createTile = function () {
        var mainLayer = this.layersCollection[0];
        var padding = 0;
        if (mainLayer.isBaseLayer && (mainLayer.layerType === 'OSM' || mainLayer.layerType === 'Bing' ||
            mainLayer.layerType === 'GoogleStaticMap')) {
            removeElement(this.element.id + '_tile_parent');
            // let elementRect: ClientRect = this.element.getBoundingClientRect();
            // let parentRect: ClientRect = this.element.parentElement.getBoundingClientRect();
            // let left: number = Math.abs(elementRect.left - parentRect.left);
            // let top: number = Math.abs(elementRect.top - parentRect.top);
            var ele = createElement('div', {
                id: this.element.id + '_tile_parent', styles: 'position: absolute; left: ' +
                    (this.mapAreaRect.x) + 'px; top: ' + (this.mapAreaRect.y + padding) + 'px; height: ' +
                    (this.mapAreaRect.height) + 'px; width: '
                    + (this.mapAreaRect.width) + 'px; overflow: hidden;'
            });
            this.element.appendChild(ele);
        }
    };
    /**
     * To initilize the private varibales of maps.
     */
    Maps.prototype.initPrivateVariable = function () {
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-maps').length;
            this.element.id = 'maps_control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);
        this.mapLayerPanel = new LayerPanel(this);
    };
    Maps.prototype.findBaseAndSubLayers = function () {
        var _this = this;
        var baseIndex = this.baseLayerIndex;
        var mainLayers = [];
        var subLayers = [];
        this.layersCollection = [];
        Array.prototype.forEach.call(this.layers, function (layer) {
            (layer.type === 'Layer') ? mainLayers.push(layer) : subLayers.push(layer);
        });
        for (var i = 0; i < mainLayers.length; i++) {
            var baseLayer = mainLayers[i];
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
        subLayers.map(function (subLayer, subLayerIndex) {
            if (subLayer.visible) {
                _this.layersCollection.push(subLayer);
            }
        });
    };
    /**
     * @private
     * Render the map border
     */
    Maps.prototype.renderBorder = function () {
        var width = this.border.width;
        var borderElement = this.svgObject.querySelector('#' + this.element.id + '_MapBorder');
        if ((width > 0 || (this.background || this.themeStyle.backgroundColor)) && isNullOrUndefined(borderElement)) {
            var borderRect = new RectOption(this.element.id + '_MapBorder', this.background || this.themeStyle.backgroundColor, this.border, 1, new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(this.renderer.drawRectangle(borderRect));
        }
        else {
            borderElement.setAttribute('fill', this.background || this.themeStyle.backgroundColor);
        }
    };
    /**
     * @private
     * Render the title and subtitle
     */
    Maps.prototype.renderTitle = function (title, type, bounds, groupEle) {
        var style = title.textStyle;
        var height;
        var width = Math.abs((this.margin.left + this.margin.right) - this.availableSize.width);
        style.fontFamily = this.themeStyle.fontFamily || style.fontFamily;
        style.size = this.themeStyle.titleFontSize || style.size;
        if (title.text) {
            if (isNullOrUndefined(groupEle)) {
                groupEle = this.renderer.createGroup({ id: this.element.id + '_Title_Group' });
            }
            var trimmedTitle = textTrim(width, title.text, style);
            var elementSize = measureText(trimmedTitle, style);
            var rect = (isNullOrUndefined(bounds)) ? new Rect(this.margin.left, this.margin.top, this.availableSize.width, this.availableSize.height) : bounds;
            var location_1 = findPosition(rect, title.alignment, elementSize, type);
            var options = new TextOption(this.element.id + '_Map_' + type, location_1.x, location_1.y, 'start', trimmedTitle);
            var titleBounds = new Rect(location_1.x, location_1.y, elementSize.width, elementSize.height);
            var element = renderTextElement(options, style, style.color || (type === 'title' ? this.themeStyle.titleFontColor : this.themeStyle.subTitleFontColor), groupEle);
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
    };
    /**
     * To create svg element for maps
     */
    Maps.prototype.createSVG = function () {
        resetBlazorTemplate(this.element.id + '_LabelTemplate', 'LabelTemplate');
        for (var i = 0; i < this.layers.length; i++) {
            for (var j = 0; j < this.layers[i].markerSettings.length; j++) {
                resetBlazorTemplate(this.element.id + '_MarkerTemplate' + j, 'MarkerTemplate');
            }
        }
        this.removeSvg();
        createSvg(this);
    };
    /**
     * To Remove the SVG
     */
    Maps.prototype.removeSvg = function () {
        for (var i = 0; i < this.annotations.length; i++) {
            resetBlazorTemplate(this.element.id + '_ContentTemplate_' + i, 'ContentTemplate');
        }
        removeElement(this.element.id + '_Secondary_Element');
        removeElement(this.element.id + '_tile_parent');
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
    };
    /**
     * To bind event handlers for maps.
     */
    Maps.prototype.wireEVents = function () {
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
    };
    /**
     * To unbind event handlers from maps.
     */
    Maps.prototype.unWireEVents = function () {
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
    };
    Maps.prototype.mouseLeaveOnMap = function (e) {
        if (document.getElementsByClassName('highlightMapStyle').length > 0 && this.legendModule) {
            this.legendModule.removeShapeHighlightCollection();
            removeClass(document.getElementsByClassName('highlightMapStyle')[0]);
        }
    };
    /**
     * To handle the click event for the maps.
     * @blazorProperty 'PerformClick'
     */
    /* tslint:disable:no-string-literal */
    Maps.prototype.mapsOnClick = function (e) {
        var _this = this;
        var targetEle = e.target;
        var targetId = targetEle.id;
        var layerIndex = 0;
        var latLongValue;
        var latitude = null;
        var longitude = null;
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
            var eventArgs_1 = {
                cancel: false, name: click, target: targetId, x: e.clientX, y: e.clientY,
                latitude: latitude, longitude: longitude
            };
            this.trigger('click', eventArgs_1, function (mouseArgs) {
                if (targetEle.id.indexOf('shapeIndex') !== -1) {
                    var layerIndex_1 = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
                    triggerShapeEvent(targetId, _this.layers[layerIndex_1].selectionSettings, _this, shapeSelected);
                }
                if (targetEle.id.indexOf('shapeIndex') > -1 || targetEle.id.indexOf('Tile') > -1) {
                    if (_this.markerModule && _this.markerModule.sameMarkerData.length > 0 &&
                        (_this.zoomModule ? _this.zoomModule.isSingleClick : true)) {
                        mergeSeparateCluster(_this.markerModule.sameMarkerData, _this, getElement(_this.element.id + '_Markers_Group'));
                        _this.markerModule.sameMarkerData = [];
                    }
                    if (getElement(_this.element.id + '_mapsTooltip') &&
                        _this.mapsTooltipModule.tooltipTargetID.indexOf('_MarkerIndex_') > -1) {
                        removeElement(_this.element.id + '_mapsTooltip');
                    }
                }
                if (_this.markerModule) {
                    _this.markerModule.markerClick(e);
                    _this.markerModule.markerClusterClick(e);
                }
                if (_this.bubbleModule) {
                    _this.bubbleModule.bubbleClick(e);
                }
                if (!eventArgs_1.cancel) {
                    _this.notify(click, targetEle);
                }
            });
        }
    };
    /**
     *
     */
    Maps.prototype.mouseEndOnMap = function (e) {
        var targetEle = e.target;
        var targetId = targetEle.id;
        var pageX;
        var pageY;
        var target;
        var touchArg;
        var rect = this.element.getBoundingClientRect();
        var element = e.target;
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
    };
    /**
     *
     */
    Maps.prototype.mouseDownOnMap = function (e) {
        this.mouseDownEvent = { x: e.x, y: e.y };
        var rect = this.element.getBoundingClientRect();
        var element = e.target;
        if (element.id.indexOf('_ToolBar') === -1) {
            var markerModule = this.markerModule;
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
    };
    /**
     * To handle the double click event for the maps.
     * @blazorProperty 'PerformDoubleClick'
     */
    Maps.prototype.mapsOnDoubleClick = function (e) {
        this.notify('dblclick', e);
    };
    /**
     *
     */
    /* tslint:disable:no-string-literal */
    Maps.prototype.mouseMoveOnMap = function (e) {
        var target;
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
    };
    Maps.prototype.onMouseMove = function (e) {
        var element = e.target;
        if (!this.isTouch) {
            this.titleTooltip(e, e.pageX, e.pageY);
        }
        return false;
    };
    Maps.prototype.titleTooltip = function (event, x, y, isTouch) {
        var targetId = event.target.id;
        if ((targetId === (this.element.id + '_Map_title')) && (event.target.textContent.indexOf('...') > -1)) {
            showTooltip(this.titleSettings.text, this.titleSettings.textStyle.size, x, y, this.element.offsetWidth, this.element.offsetHeight, this.element.id + '_EJ2_Title_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch);
        }
        else {
            removeElement(this.element.id + '_EJ2_Title_Tooltip');
        }
    };
    /*

    /**
     * To handle the window resize event on maps.
     */
    Maps.prototype.mapsOnResize = function (e) {
        var _this = this;
        var args = {
            name: resize,
            previousSize: this.availableSize,
            currentSize: new Size(0, 0),
            maps: !this.isBlazor ? this : null
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        if (this.element.classList.contains('e-maps')) {
            this.resizeTo = setTimeout(function () {
                _this.unWireEVents();
                _this.createSVG();
                _this.refreshing = true;
                _this.wireEVents();
                args.currentSize = _this.availableSize;
                _this.trigger(resize, args);
                _this.render();
            }, 500);
        }
        return false;
    };
    /**
     * To zoom the map by specifies the center position
     * @param centerPosition
     * @param zoomFactor
     */
    Maps.prototype.zoomByPosition = function (centerPosition, zoomFactor) {
        var factor = this.mapLayerPanel.calculateFactor(this.layersCollection[0]);
        var position;
        var size = this.mapAreaRect;
        if (!this.isTileMap && this.zoomModule) {
            if (!isNullOrUndefined(centerPosition)) {
                position = convertGeoToPoint(centerPosition.latitude, centerPosition.longitude, factor, this.layersCollection[0], this);
                var mapRect = document.getElementById(this.element.id + '_Layer_Collections').getBoundingClientRect();
                var svgRect = this.svgObject.getBoundingClientRect();
                var xDiff = Math.abs(mapRect.left - svgRect.left) / this.scale;
                var yDiff = Math.abs(mapRect.top - svgRect.top) / this.scale;
                var x = this.translatePoint.x + xDiff;
                var y = this.translatePoint.y + yDiff;
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
            this.mapLayerPanel.generateTiles(zoomFactor, this.tileTranslatePoint, new BingMap(this));
        }
    };
    /**
     * To pan the map by specifies the direction
     * @param direction
     */
    Maps.prototype.panByDirection = function (direction) {
        var xDiff = 0;
        var yDiff = 0;
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
            this.zoomModule.panning(direction, xDiff, yDiff);
        }
    };
    /**
     * To add layer
     * @param layer
     */
    Maps.prototype.addLayer = function (layer) {
        this.layers.push(new LayerSettings(this.layers[0], 'layers', layer));
        this.refresh();
    };
    /**
     * To remove layer
     * @param index
     */
    Maps.prototype.removeLayer = function (index) {
        this.layers.splice(index, 1);
        this.refresh();
    };
    /**
     * To add marker
     * @param layerIndex
     * @param marker
     */
    Maps.prototype.addMarker = function (layerIndex, markerCollection) {
        var layerEle = document.getElementById(this.element.id + '_LayerIndex_' + layerIndex);
        if (markerCollection.length > 0 && layerEle) {
            for (var _i = 0, markerCollection_1 = markerCollection; _i < markerCollection_1.length; _i++) {
                var newMarker = markerCollection_1[_i];
                this.layersCollection[layerIndex].markerSettings.push(new MarkerSettings(this, 'markerSettings', newMarker));
            }
            var markerModule = new Marker(this);
            markerModule.markerRender(layerEle, layerIndex, this.mapLayerPanel['currentFactor'], 'AddMarker');
            this.arrangeTemplate();
        }
    };
    /**
     * Public method for selection
     * @param layerIndex
     * @param propertyName
     * @param name
     * @param enable
     */
    Maps.prototype.shapeSelection = function (layerIndex, propertyName, name, enable) {
        var targetEle;
        if (isNullOrUndefined(enable)) {
            enable = true;
        }
        var selectionsettings = this.layers[layerIndex].selectionSettings;
        if (!selectionsettings.enableMultiSelect && this.legendSelection && enable) {
            this.removeShapeSelection();
        }
        if (selectionsettings.enable) {
            var targetId = void 0;
            var dataIndex = void 0;
            var shapeIndex = void 0;
            var shapeDataValue = void 0;
            var data = void 0;
            var shapeData = this.layers[layerIndex].shapeData['features'];
            for (var i = 0; i < shapeData.length; i++) {
                if (shapeData[i]['properties'][propertyName] === name) {
                    var k = checkShapeDataFields(this.layers[layerIndex].dataSource, shapeData[i]['properties'], this.layers[layerIndex].shapeDataPath, this.layers[layerIndex].shapePropertyPath);
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
                        var shapeToggled = this.legendSettings.visible ? this.legendModule.shapeToggled : true;
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
                        var shapeToggled = this.legendSettings.visible ? this.legendModule.shapeToggled : true;
                        if (shapeToggled) {
                            removeClass(targetEle);
                            var selectedElementIdIndex = this.selectedElementId.indexOf(targetEle.getAttribute('id'));
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
    };
    /**
     * To add marker
     * @param minLatitude
     * @param maxLatitude
     * @param minLongitude
     * @param maxLongitude
     */
    Maps.prototype.zoomToCoordinates = function (minLatitude, minLongitude, maxLatitude, maxLongitude) {
        var _a, _b;
        var centerLatitude;
        var centerLongtitude;
        var isTwoCoordinates = false;
        if (isNullOrUndefined(maxLatitude) && isNullOrUndefined(maxLongitude)
            || isNullOrUndefined(minLatitude) && isNullOrUndefined(minLongitude)) {
            maxLatitude = isNullOrUndefined(maxLatitude) ? 0 : maxLatitude;
            maxLongitude = isNullOrUndefined(maxLongitude) ? 0 : maxLongitude;
            minLatitude = isNullOrUndefined(minLatitude) ? 0 : minLatitude;
            minLongitude = isNullOrUndefined(minLatitude) ? 0 : minLongitude;
            isTwoCoordinates = true;
        }
        if (minLatitude > maxLatitude) {
            _a = [maxLatitude, minLatitude], minLatitude = _a[0], maxLatitude = _a[1];
        }
        if (minLongitude > maxLongitude) {
            _b = [maxLongitude, minLongitude], minLongitude = _b[0], maxLongitude = _b[1];
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
        this.scaleOfGivenLocation = calculateZoomLevel(minLatitude, maxLatitude, minLongitude, maxLongitude, this.mapAreaRect.width, this.mapAreaRect.height, this);
        this.zoomNotApplied = true;
        this.refresh();
    };
    /**
     * Method to romove multiple selected shapes maps
     */
    Maps.prototype.removeShapeSelection = function () {
        var selectedElements = this.selectedElementId.length;
        for (var i = 0; i < selectedElements; i++) {
            removeClass(getElementByID(this.selectedElementId[0]));
            this.selectedElementId.splice(0, 1);
        }
    };
    /**
     * Method to set culture for maps
     */
    Maps.prototype.setCulture = function () {
        this.intl = new Internationalization();
        this.setLocaleConstants();
        this.localeObject = new L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    };
    /**
     * Method to set locale constants
     */
    Maps.prototype.setLocaleConstants = function () {
        // Need to modify after the api confirm
        this.defaultLocalConstants = {
            ZoomIn: 'Zoom In',
            Zoom: 'Zoom',
            ZoomOut: 'Zoom Out',
            Pan: 'Pan',
            Reset: 'Reset',
        };
    };
    /**
     * To destroy maps control.
     */
    Maps.prototype.destroy = function () {
        this.unWireEVents();
        _super.prototype.destroy.call(this);
    };
    /**
     * Get component name
     */
    Maps.prototype.getModuleName = function () {
        return 'maps';
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    Maps.prototype.getPersistData = function () {
        var keyEntity = ['translatePoint', 'zoomSettings', 'mapScaleValue', 'tileTranslatePoint', 'baseTranslatePoint', 'scale'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    Maps.prototype.onPropertyChanged = function (newProp, oldProp) {
        var render = false;
        var isMarker = false;
        var isStaticMapType = false;
        var newLayerLength = Object.keys(newProp).length;
        var layerEle = document.getElementById(this.element.id + '_LayerIndex_' + (newLayerLength - 1));
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
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
                        var layerPropLength = Object.keys(newProp.layers).length;
                        for (var x = 0; x < layerPropLength; x++) {
                            if (!isNullOrUndefined(newProp.layers[x])) {
                                var collection = Object.keys(newProp.layers[x]);
                                for (var _b = 0, collection_1 = collection; _b < collection_1.length; _b++) {
                                    var collectionProp = collection_1[_b];
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
                    _super.prototype.refresh.call(this);
                    break;
            }
        }
        if (render) {
            if (newProp.layers && isMarker) {
                removeElement(this.element.id + '_Markers_Group');
                if (this.isTileMap) {
                    this.mapLayerPanel.renderTileLayer(this.mapLayerPanel, this.layers['currentFactor'], (newLayerLength - 1));
                }
                else {
                    this.markerModule.markerRender(layerEle, (newLayerLength - 1), this.mapLayerPanel['currentFactor'], 'AddMarker');
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
    };
    /**
     * To provide the array of modules needed for maps rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    Maps.prototype.requiredModules = function () {
        var modules = [];
        var isVisible = this.findVisibleLayers(this.layers);
        var annotationEnable = false;
        this.annotations.map(function (annotation, index) {
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
    };
    /**
     * To find marker visibility
     */
    Maps.prototype.isMarkersVisible = function () {
        var isVisible = false;
        Array.prototype.forEach.call(this.layers, function (layer, layerIndex) {
            for (var i = 0; i < layer.markerSettings.length; i++) {
                if (layer.markerSettings[i].visible) {
                    isVisible = true;
                    break;
                }
            }
        });
        return isVisible;
    };
    /**
     * To find DataLabel visibility
     */
    Maps.prototype.isDataLabelVisible = function () {
        var isVisible = false;
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].dataLabelSettings.visible) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    };
    /**
     * To find navigation line visibility
     */
    Maps.prototype.isNavigationVisible = function () {
        var isVisible = false;
        Array.prototype.forEach.call(this.layers, function (layer, layerIndex) {
            for (var i = 0; i < layer.navigationLineSettings.length; i++) {
                if (layer.navigationLineSettings[i].visible) {
                    isVisible = true;
                    break;
                }
            }
        });
        return isVisible;
    };
    /**
     * To find marker visibility
     */
    Maps.prototype.isBubbleVisible = function () {
        var isVisible = false;
        for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            if (this.getBubbleVisible(layer)) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    };
    /**
     * To find the bubble visibility from layer
     * @private
     */
    Maps.prototype.getBubbleVisible = function (layer) {
        var isVisible = false;
        for (var _i = 0, _a = layer.bubbleSettings; _i < _a.length; _i++) {
            var bubble = _a[_i];
            if (bubble.visible) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    };
    /**
     * Handles the print method for chart control.
     */
    Maps.prototype.print = function (id) {
        var exportChart = new ExportUtils(this);
        exportChart.print(id);
    };
    /**
     * Handles the export method for chart control.
     * @param type
     * @param fileName
     */
    Maps.prototype.export = function (type, fileName, orientation) {
        var exportMap = new ExportUtils(this);
        exportMap.export(type, fileName, orientation);
    };
    /**
     * To find visibility of layers and markers for required modules load.
     */
    Maps.prototype.findVisibleLayers = function (layers, isLayerVisible, isBubblevisible, istooltipVisible, isSelection, isHighlight) {
        if (isLayerVisible === void 0) { isLayerVisible = false; }
        if (isBubblevisible === void 0) { isBubblevisible = false; }
        if (istooltipVisible === void 0) { istooltipVisible = false; }
        if (isSelection === void 0) { isSelection = false; }
        if (isHighlight === void 0) { isHighlight = false; }
        var bubbles;
        var markers;
        var navigationLine;
        for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
            var layer = layers_1[_i];
            isLayerVisible = layer.visible || isLayerVisible;
            if (layer.visible) {
                bubbles = layer.bubbleSettings;
                markers = layer.markerSettings;
                navigationLine = layer.navigationLineSettings;
                for (var _a = 0, navigationLine_1 = navigationLine; _a < navigationLine_1.length; _a++) {
                    var navigation = navigationLine_1[_a];
                    if (navigation.visible) {
                        isSelection = navigation.highlightSettings.enable || isSelection;
                        isHighlight = navigation.selectionSettings.enable || isHighlight;
                    }
                }
                for (var _b = 0, markers_1 = markers; _b < markers_1.length; _b++) {
                    var marker$$1 = markers_1[_b];
                    if (marker$$1.visible) {
                        istooltipVisible = marker$$1.tooltipSettings.visible || istooltipVisible;
                        isSelection = marker$$1.selectionSettings.enable || isSelection;
                        isHighlight = marker$$1.highlightSettings.enable || isHighlight;
                    }
                    if (istooltipVisible) {
                        break;
                    }
                }
                for (var _c = 0, bubbles_1 = bubbles; _c < bubbles_1.length; _c++) {
                    var bubble = bubbles_1[_c];
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
    };
    /**
     * To get the geo location
     * @param {number} layerIndex
     * @param {PointerEvent} location
     * @return GeoPosition
     */
    Maps.prototype.getGeoLocation = function (layerIndex, location) {
        var container = document.getElementById(this.element.id);
        var pageX = location.layerX - container.offsetLeft;
        var pageY = location.layerY - container.offsetTop;
        var currentLayer = this.layersCollection[layerIndex];
        var translate = getTranslate(this, currentLayer, false);
        var translatePoint = translate['location'];
        var translatePointX = translatePoint.x * this.scale;
        var translatePointY = translatePoint.y * this.scale;
        var mapSize = (Math.min(this.mapAreaRect.height, this.mapAreaRect.width)
            * this.mapLayerPanel['currentFactor']) * this.scale;
        var xx = (this.clip(pageX - translatePointX, 0, mapSize - 1) / mapSize) - 0.5;
        var yy = 0.5 - (this.clip(pageY - translatePointY, 0, mapSize - 1) / mapSize);
        var lat = 90 - 360 * Math.atan(Math.exp(-yy * 2 * Math.PI)) / Math.PI;
        var long = 360 * xx;
        return { latitude: lat, longitude: long };
    };
    Maps.prototype.clip = function (value, minVal, maxVal) {
        return Math.min(Math.max(value, minVal), maxVal);
    };
    /**
     * To get the geo location
     * @param {PointerEvent}
     * @return GeoPosition
     */
    Maps.prototype.getTileGeoLocation = function (location) {
        var container = document.getElementById(this.element.id);
        var latLong;
        var ele = document.getElementById(this.element.id + '_tile_parent');
        var lastTile = this.mapLayerPanel.tiles[this.mapLayerPanel.tiles.length - 1];
        var tile0 = this.mapLayerPanel.tiles[0];
        latLong = this.pointToLatLong(location.layerX + this.mapAreaRect.x - (ele.offsetLeft - container.offsetLeft), location.layerY + this.mapAreaRect.y - (ele.offsetTop - container.offsetTop));
        return { latitude: latLong['latitude'], longitude: latLong['longitude'] };
    };
    Maps.prototype.pointToLatLong = function (pageX, pageY) {
        var padding = this.layers[this.layers.length - 1].layerType === 'GoogleStaticMap' ? 0 : 10;
        pageY = (this.zoomSettings.enable) ? pageY + padding : pageY;
        var mapSize = 256 * Math.pow(2, this.tileZoomLevel);
        var x1 = (this.clip(pageX - (this.translatePoint.x * this.scale), 0, mapSize - 1) / mapSize) - 0.5;
        var y1 = 0.5 - (this.clip(pageY - (this.translatePoint.y * this.scale), 0, mapSize - 1) / mapSize);
        var lat = 90 - 360 * Math.atan(Math.exp(-y1 * 2 * Math.PI)) / Math.PI;
        var long = 360 * x1;
        return { latitude: lat, longitude: long };
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
    return Maps;
}(Component));

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
var Bubble = /** @__PURE__ @class */ (function () {
    function Bubble(maps) {
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
    Bubble.prototype.renderBubble = function (bubbleSettings, shapeData, color, range, bubbleIndex, dataIndex, layerIndex, layer, group, bubbleID) {
        var _this = this;
        var layerData = layer.layerData;
        var colorValuePath = bubbleSettings.colorValuePath;
        var equalValue = shapeData[colorValuePath];
        var colorValue = Number(shapeData[colorValuePath]);
        var bubbleValue = Number(shapeData[bubbleSettings.valuePath]);
        var opacity;
        var bubbleColor;
        if (isNaN(bubbleValue) && isNaN(colorValue) && isNullOrUndefined(equalValue)) {
            return null;
        }
        var radius = getRatioOfBubble(bubbleSettings.minRadius, bubbleSettings.maxRadius, bubbleValue, range.min, range.max);
        var colorMapping = new ColorMapping(this.maps);
        var shapeColor = colorMapping.getColorByValue(bubbleSettings.colorMapping, colorValue, equalValue);
        bubbleColor = (Object.prototype.toString.call(shapeColor) === '[object Object]' &&
            !isNullOrUndefined(shapeColor['fill'])) ? shapeColor['fill'] : color;
        opacity = (Object.prototype.toString.call(shapeColor) === '[object Object]' &&
            !isNullOrUndefined(shapeColor['opacity'])) ? shapeColor['opacity'] : bubbleSettings.opacity;
        var shapePoints = [[]];
        var midIndex = 0;
        var pointsLength = 0;
        var currentLength = 0;
        for (var i = 0, len = layerData.length; i < len; i++) {
            var shape = layerData[i];
            shape = shape['property'];
            var shapePath = checkPropertyPath(shapeData[layer.shapeDataPath], layer.shapePropertyPath, shape);
            if (shapeData[layer.shapeDataPath] === shape[shapePath]) {
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
                    var layer_1 = layerData[i];
                    for (var j = 0; j < layer_1.length; j++) {
                        shapePoints.push(this.getPoints(layer_1[j], []));
                        currentLength = shapePoints[shapePoints.length - 1].length;
                        if (pointsLength < currentLength) {
                            pointsLength = currentLength;
                            midIndex = shapePoints.length - 1;
                        }
                    }
                }
            }
        }
        var projectionType = this.maps.projectionType;
        var centerY;
        var eventArgs;
        var center = findMidPointOfPolygon(shapePoints[midIndex], projectionType);
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
                var shapePointsLength = shapePoints.length - 1;
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
                    var maps = eventArgs.maps, blazorEventArgs = __rest$3(eventArgs, ["maps"]);
                    eventArgs = blazorEventArgs;
                }
            }
            this.maps.trigger('bubbleRendering', eventArgs, function (bubbleArgs) {
                if (eventArgs.cancel) {
                    return;
                }
                var bubbleElement;
                if (bubbleSettings.bubbleType === 'Circle') {
                    var circle = new CircleOption(bubbleID, eventArgs.fill, eventArgs.border, opacity, 0, 0, eventArgs.radius, null);
                    bubbleElement = drawCircle(_this.maps, circle, group);
                }
                else {
                    var y = _this.maps.projectionType === 'Mercator' ? (eventArgs.cy - radius) : (eventArgs.cy + radius);
                    var rectangle = new RectOption(bubbleID, eventArgs.fill, eventArgs.border, opacity, new Rect(0, 0, radius * 2, radius * 2), 2, 2);
                    eventArgs.cx -= radius;
                    eventArgs.cy = y;
                    bubbleElement = drawRectangle(_this.maps, rectangle, group);
                }
                maintainSelection(_this.maps.selectedBubbleElementId, _this.maps.bubbleSelectionClass, bubbleElement, 'BubbleselectionMapStyle');
                _this.bubbleCollection.push({
                    LayerIndex: layerIndex,
                    BubbleIndex: bubbleIndex,
                    DataIndex: dataIndex,
                    element: bubbleElement,
                    center: { x: eventArgs.cx, y: eventArgs.cy }
                });
                var translate;
                var animate$$1 = layer.animationDuration !== 0 || isNullOrUndefined(_this.maps.zoomModule);
                if (_this.maps.zoomSettings.zoomFactor > 1 && !isNullOrUndefined(_this.maps.zoomModule)) {
                    translate = getZoomTranslate(_this.maps, layer, animate$$1);
                }
                else {
                    translate = getTranslate(_this.maps, layer, animate$$1);
                }
                var scale = translate['scale'];
                var transPoint = translate['location'];
                var position = new MapLocation((_this.maps.isTileMap ? (eventArgs.cx) : ((eventArgs.cx + transPoint.x) * scale)), (_this.maps.isTileMap ? (eventArgs.cy) : ((eventArgs.cy + transPoint.y) * scale)));
                bubbleElement.setAttribute('transform', 'translate( ' + (position.x) + ' ' + (position.y) + ' )');
                var bubble = (bubbleSettings.dataSource.length - 1) === dataIndex ? 'bubble' : null;
                if (bubbleSettings.bubbleType === 'Square') {
                    position.x += radius;
                    position.y += radius * (_this.maps.projectionType === 'Mercator' ? 1 : -1);
                }
                else {
                    radius = 0;
                }
                if (bubbleSettings.animationDuration > 0) {
                    elementAnimate(bubbleElement, bubbleSettings.animationDelay, bubbleSettings.animationDuration, position, _this.maps, bubble, radius);
                }
            });
        }
    };
    Bubble.prototype.getPoints = function (shape, points) {
        if (isNullOrUndefined(shape.map)) {
            points = shape['point'];
        }
        else {
            shape.map(function (current, index) {
                points.push(new Point(current['point']['x'], current['point']['y']));
            });
        }
        return points;
    };
    /**
     * To check and trigger bubble click event
     */
    Bubble.prototype.bubbleClick = function (e) {
        var target = e.target.id;
        if (target.indexOf('_LayerIndex_') === -1) {
            return;
        }
        var data = this.getbubble(target);
        if (isNullOrUndefined(data)) {
            return;
        }
        var eventArgs = {
            cancel: false, name: bubbleClick, data: data, maps: this.maps,
            target: target, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            var maps = eventArgs.maps, blazorEventArgs = __rest$3(eventArgs, ["maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(bubbleClick, eventArgs);
    };
    /**
     * To get bubble from target id
     */
    Bubble.prototype.getbubble = function (target) {
        var id = target.split('_LayerIndex_');
        var index = parseInt(id[1].split('_')[0], 10);
        var layer = this.maps.layers[index];
        var data;
        if (target.indexOf('_BubbleIndex_') > -1) {
            var bubbleIndex = parseInt(id[1].split('_BubbleIndex_')[1], 10);
            var dataIndex = parseInt(id[1].split('_BubbleIndex_')[1].split('_dataIndex_')[1], 10);
            if (!isNaN(bubbleIndex)) {
                data = layer.bubbleSettings[bubbleIndex].dataSource[dataIndex];
                return data;
            }
        }
        return null;
    };
    /**
     * To check and trigger bubble move event
     */
    Bubble.prototype.bubbleMove = function (e) {
        var target = e.target.id;
        if (target.indexOf('_LayerIndex_') === -1) {
            return;
        }
        var data = this.getbubble(target);
        if (isNullOrUndefined(data)) {
            return;
        }
        var eventArgs = {
            cancel: false, name: bubbleMouseMove, data: data, maps: this.maps,
            target: target, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            var maps = eventArgs.maps, blazorEventArgs = __rest$3(eventArgs, ["maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(bubbleMouseMove, eventArgs);
    };
    /**
     * Get module name.
     */
    Bubble.prototype.getModuleName = function () {
        return 'Bubble';
    };
    /**
     * To destroy the bubble.
     * @return {void}
     * @private
     */
    Bubble.prototype.destroy = function (maps) {
        /**
         * Destroy method performed here
         */
    };
    return Bubble;
}());

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
var DataLabel = /** @__PURE__ @class */ (function () {
    function DataLabel(maps) {
        this.value = { rightWidth: 0, leftWidth: 0, heightTop: 0, heightBottom: 0 };
        this.maps = maps;
        this.dataLabelCollections = [];
    }
    //tslint:disable:max-func-body-length
    DataLabel.prototype.getDataLabel = function (dataSource, labelPath, shapeName, shapeDataPath) {
        var text;
        for (var i = 0; i < dataSource.length; i++) {
            var data = dataSource[i];
            if ((data[shapeDataPath]) === shapeName) {
                text = data;
                break;
            }
        }
        return text;
    };
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
    DataLabel.prototype.renderLabel = function (layer, layerIndex, shape, layerData, group, labelTemplateElement, index, intersect) {
        var _this = this;
        var dataLabel = layer.dataLabelSettings;
        var style = layer.dataLabelSettings.textStyle;
        var templateFn;
        var options;
        var dataLabelSettings = layer.dataLabelSettings;
        var labelpath = layer.dataLabelSettings.labelPath;
        var shapePoint = [[]];
        var midIndex = 0;
        var pointsLength = 0;
        var shapeData = shape;
        var element;
        var text = '';
        var datasrcObj;
        var currentLength = 0;
        var oldIndex;
        var location;
        var sublayerIndexLabel = false;
        var shapeProperties = shape['properties'];
        var labelId = this.maps.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + index + '_LabelIndex_' + index;
        var textLocation = new Point(0, 0);
        /* tslint:disable:no-string-literal */
        var shapes = layerData[index];
        var locationX;
        var locationY;
        style.fontFamily = this.maps.themeStyle.labelFontFamily;
        shape = shapes['property'];
        var properties = (Object.prototype.toString.call(layer.shapePropertyPath) === '[object Array]' ?
            layer.shapePropertyPath : [layer.shapePropertyPath]);
        var propertyPath;
        var isPoint = false;
        var animate$$1 = layer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
        var translate = (this.maps.isTileMap) ? new Object() : getTranslate(this.maps, layer, animate$$1);
        var scale = (this.maps.isTileMap) ? this.maps.scale : translate['scale'];
        var transPoint = (this.maps.isTileMap) ? this.maps.translatePoint : translate['location'];
        var zoomTransPoint = this.maps.zoomTranslatePoint;
        var shapeWidth;
        var scaleZoomValue = !isNullOrUndefined(this.maps.scale) ? Math.floor(this.maps.scale) : 1;
        var zoomLabelsPosition = this.maps.zoomSettings.enable ? !isNullOrUndefined(this.maps.zoomShapeCollection) &&
            this.maps.zoomShapeCollection.length > 0 : this.maps.zoomSettings.enable;
        for (var j = 0; j < properties.length; j++) {
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
                var layer_1 = layerData[index];
                if (layer_1['type'] === 'Point') {
                    isPoint = true;
                    var layerPoints = [];
                    layerPoints.push(this.getPoint(layerData, []));
                    shapePoint = layerPoints;
                    currentLength = shapePoint[shapePoint.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoint.length - 1;
                    }
                }
                for (var j = 0; j < layer_1.length; j++) {
                    shapePoint.push(this.getPoint(layer_1[j], []));
                    currentLength = shapePoint[shapePoint.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoint.length - 1;
                    }
                }
            }
        }
        text = (!isNullOrUndefined(datasrcObj)) ? datasrcObj[labelpath].toString() : shapeData['properties'][labelpath];
        var dataLabelText = text;
        var projectionType = this.maps.projectionType;
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
        var firstLevelMapLocation = location;
        if (!isNullOrUndefined(text) && !isNullOrUndefined(location)) {
            if (zoomLabelsPosition && scaleZoomValue > 1) {
                if (layerIndex > 0) {
                    for (var k = 0; k < this.maps.zoomLabelPositions.length; k++) {
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
            var eventargs_1 = {
                name: dataLabelRendering, maps: this.maps, cancel: false, border: dataLabel.border, datalabel: dataLabel,
                fill: dataLabel.fill, template: dataLabel.template, text: text
            };
            if (this.maps.isBlazor) {
                var maps = eventargs_1.maps, blazorEventArgs = __rest$4(eventargs_1, ["maps"]);
                eventargs_1 = blazorEventArgs;
            }
            this.maps.trigger('dataLabelRendering', eventargs_1, function (labelArgs) {
                if (eventargs_1.cancel) {
                    return;
                }
                var position = [];
                var width = zoomLabelsPosition && scaleZoomValue > 1
                    ? _this.maps.zoomShapeCollection[index]['width'] :
                    location['rightMax']['x'] - location['leftMax']['x'];
                if (!isNullOrUndefined(_this.maps.dataLabelShape)) {
                    shapeWidth = firstLevelMapLocation['rightMax']['x'] - firstLevelMapLocation['leftMax']['x'];
                    _this.maps.dataLabelShape.push(shapeWidth);
                }
                if (eventargs_1.text !== text && !eventargs_1.cancel) {
                    text = eventargs_1.text;
                }
                var textSize = measureText(text, style);
                var trimmedLable = text;
                var elementSize = textSize;
                var startY = location['y'] - textSize['height'] / 4;
                var endY = location['y'] + textSize['height'] / 4;
                var start = location['y'] - textSize['height'] / 4;
                var end = location['y'] + textSize['height'] / 4;
                position = filter(shapePoint[midIndex], startY, endY);
                if (!isPoint && position.length > 5 && (shapeData['geometry']['type'] !== 'MultiPolygon') &&
                    (shapeData['type'] !== 'MultiPolygon')) {
                    var location1 = findMidPointOfPolygon(position, projectionType);
                    if (zoomLabelsPosition && scaleZoomValue > 1) {
                        location1['x'] = ((_this.maps.zoomLabelPositions[index]['location']['x'] + zoomTransPoint['x']) * scale);
                        location1['y'] = ((_this.maps.zoomLabelPositions[index]['location']['y'] + zoomTransPoint['y']) * scale);
                    }
                    locationX = location1['x'];
                    location['x'] = location1['x'];
                    width = zoomLabelsPosition && scaleZoomValue > 1 ?
                        _this.maps.zoomShapeCollection[index]['width'] :
                        location1['rightMax']['x'] - location1['leftMax']['x'];
                }
                var xpositionEnds = location['x'] + textSize['width'] / 2;
                var xpositionStart = location['x'] - textSize['width'] / 2;
                _this.value[index] = { rightWidth: xpositionEnds, leftWidth: xpositionStart, heightTop: start, heightBottom: end };
                var labelElement;
                if (eventargs_1.template !== '') {
                    templateFn = getTemplateFunction(eventargs_1.template);
                    var templateElement = templateFn ? templateFn(!isNullOrUndefined(datasrcObj) ?
                        datasrcObj : shapeData['properties'], null, null, _this.maps.element.id + '_LabelTemplate', false) : document.createElement('div');
                    templateElement.innerHTML = !templateFn ? eventargs_1.template : '';
                    labelElement = convertElementFromLabel(templateElement, labelId, !isNullOrUndefined(datasrcObj) ? datasrcObj : shapeData['properties'], index, _this.maps);
                    labelElement.style.left = ((Math.abs(_this.maps.baseMapRectBounds['min']['x'] - location['x'])) * scale) + 'px';
                    labelElement.style.top = ((Math.abs(_this.maps.baseMapRectBounds['min']['y'] - location['y'])) * scale) + 'px';
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
                        for (var i = 0; i < intersect.length; i++) {
                            if (!isNullOrUndefined(intersect[i])) {
                                if (_this.value[index]['leftWidth'] > intersect[i]['rightWidth']
                                    || _this.value[index]['rightWidth'] < intersect[i]['leftWidth']
                                    || _this.value[index]['heightTop'] > intersect[i]['heightBottom']
                                    || _this.value[index]['heightBottom'] < intersect[i]['heightTop']) {
                                    text = text;
                                }
                                else {
                                    text = '';
                                    break;
                                }
                            }
                        }
                        intersect.push(_this.value[index]);
                        options = new TextOption(labelId, textLocation.x, textLocation.y, 'middle', text, '', '');
                    }
                    var difference = void 0;
                    if (dataLabelSettings.intersectionAction === 'Trim') {
                        for (var j = 0; j < intersect.length; j++) {
                            if (!isNullOrUndefined(intersect[j])) {
                                if (intersect[j]['rightWidth'] < _this.value[index]['leftWidth']
                                    || intersect[j]['leftWidth'] > _this.value[index]['rightWidth']
                                    || intersect[j]['heightBottom'] < _this.value[index]['heightTop']
                                    || intersect[j]['heightTop'] > _this.value[index]['heightBottom']) {
                                    trimmedLable = text;
                                    difference = 0;
                                }
                                else {
                                    if (_this.value[index]['leftWidth'] > intersect[j]['leftWidth']) {
                                        width = intersect[j]['rightWidth'] - _this.value[index]['leftWidth'];
                                        difference = width - (_this.value[index]['rightWidth'] - _this.value[index]['leftWidth']);
                                        trimmedLable = textTrim(difference, text, style);
                                        break;
                                    }
                                    if (_this.value[index]['leftWidth'] < intersect[j]['leftWidth']) {
                                        width = _this.value[index]['rightWidth'] - intersect[j]['leftWidth'];
                                        difference = Math.abs(width - (_this.value[index]['rightWidth'] - _this.value[index]['leftWidth']));
                                        trimmedLable = textTrim(difference, text, style);
                                        break;
                                    }
                                }
                            }
                        }
                        elementSize = measureText(trimmedLable, style);
                        intersect.push(_this.value[index]);
                        options = new TextOption(labelId, textLocation.x, (textLocation.y), 'middle', trimmedLable, '', '');
                    }
                    if (dataLabelSettings.intersectionAction === 'None') {
                        options = new TextOption(labelId, (textLocation.x), (textLocation.y), 'middle', text, '', '');
                    }
                    if (trimmedLable.length > 1) {
                        var border_1 = eventargs_1.border;
                        if (border_1['width'] > 1) {
                            var fill = eventargs_1.fill;
                            var opacity = dataLabelSettings.opacity;
                            var rx = dataLabelSettings.rx;
                            var ry = dataLabelSettings.ry;
                            var x = void 0;
                            var y = void 0;
                            var padding = 5;
                            if (zoomLabelsPosition && scaleZoomValue > 1) {
                                x = ((location['x'])) - textSize['width'] / 2;
                                y = ((location['y'])) - textSize['height'] / 2 - padding;
                            }
                            else {
                                x = ((location['x'] + transPoint['x']) * scale) - textSize['width'] / 2;
                                y = ((location['y'] + transPoint['y']) * scale) - textSize['height'] / 2;
                            }
                            var rectOptions = new RectOption(_this.maps.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + index + '_rectIndex_' + index, fill, border_1, opacity, new Rect(x, y, textSize['width'], textSize['height']), rx, ry);
                            var rect = _this.maps.renderer.drawRectangle(rectOptions);
                            group.appendChild(rect);
                        }
                    }
                    element = renderTextElement(options, style, style.color || _this.maps.themeStyle.dataLabelFontColor, group);
                    if (zoomLabelsPosition && scaleZoomValue > 1) {
                        element.setAttribute('transform', 'translate( ' + ((location['x'])) + ' '
                            + (((location['y']))) + ' )');
                        location['x'] = locationX;
                        location['y'] = locationY;
                    }
                    else {
                        element.setAttribute('transform', 'translate( ' + ((location['x'] + transPoint.x) * scale) + ' '
                            + (((location['y'] + transPoint.y) * scale) + (elementSize.height / 4)) + ' )');
                        location['y'] = location['y'] + (elementSize.height / 4);
                    }
                    group.appendChild(element);
                }
                _this.dataLabelCollections.push({
                    location: { x: location['x'], y: location['y'] },
                    element: isNullOrUndefined(labelElement) ? element : labelElement,
                    layerIndex: layerIndex,
                    shapeIndex: sublayerIndexLabel ? oldIndex : index,
                    labelIndex: sublayerIndexLabel ? oldIndex : index,
                    dataLabelText: dataLabelText
                });
                if (labelTemplateElement.childElementCount > 0 && !_this.maps.element.contains(labelTemplateElement)) {
                    document.getElementById(_this.maps.element.id + '_Secondary_Element').appendChild(labelTemplateElement);
                }
            });
        }
    };
    DataLabel.prototype.getPoint = function (shapes, points) {
        shapes.map(function (current, index) {
            points.push(new Point(current['point']['x'], current['point']['y']));
        });
        return points;
    };
    /**
     * Get module name.
     */
    DataLabel.prototype.getModuleName = function () {
        return 'DataLabel';
    };
    /**
     * To destroy the layers.
     * @return {void}
     * @private
     */
    DataLabel.prototype.destroy = function (maps) {
        /**
         * Destroy method performed here
         */
    };
    return DataLabel;
}());

/**
 * navigation-selected-line
 */
var NavigationLine = /** @__PURE__ @class */ (function () {
    function NavigationLine(maps) {
        this.maps = maps;
    }
    /* tslint:disable:no-string-literal */
    //tslint:disable:max-func-body-length
    /**
     * To render navigation line for maps
     */
    NavigationLine.prototype.renderNavigation = function (layer, factor, layerIndex) {
        var navigationEle;
        var navigation;
        navigation = layer.navigationLineSettings;
        var longitude;
        var point = [];
        var latitude;
        var visible;
        var angle;
        var width;
        var color;
        var dashArray;
        var pathOption;
        var direction;
        var showArrow;
        var arrowColor;
        var arrowSize;
        var arrowSettings;
        var arrowPosition;
        var startArrow;
        var endArrow;
        var offSet;
        var offSetValue;
        var navigationGroup;
        var d;
        var group = (this.maps.renderer.createGroup({
            id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_line_Group'
        }));
        for (var i = 0; i < navigation.length; i++) {
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
                for (var i_1 = 0; i_1 < longitude['length']; i_1++) {
                    var location_1 = (this.maps.isTileMap) ? convertTileLatLongToPoint(new Point(longitude[i_1], latitude[i_1]), factor, this.maps.tileTranslatePoint, true) : convertGeoToPoint(latitude[i_1], longitude[i_1], factor, layer, this.maps);
                    point.push(location_1);
                }
            }
            navigationGroup = (this.maps.renderer.createGroup({
                id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_NavigationGroup' + i + ''
            }));
            for (var j = 0; j < point['length'] - 1; j++) {
                angle = (-1 > angle) ? -1 : angle;
                angle = (1 < angle) ? 1 : angle;
                var arcId_1 = this.maps.element.id + '_LayerIndex_' + layerIndex + '_NavigationIndex_' + i + '_Line' + j + '';
                var radius_1 = this.convertRadius(point[j], point[j + 1]);
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
                        var divide = (Math.round(arrowSize / 2));
                        arrowPosition = arrowSettings['properties']['position'];
                        startArrow = (arrowPosition === 'Start') ? 'url(#triangle' + i + ')' : null;
                        endArrow = (arrowPosition === 'End') ? 'url(#triangle' + i + ')' : null;
                        if (offSet !== 0 && angle === 0) {
                            offSet = (arrowPosition === 'Start') ? offSetValue : -(offSetValue);
                        }
                        offSet = (isNullOrUndefined(offSet)) ? 0 : offSet;
                        var triId = this.maps.element.id + '_triangle';
                        var defElement = this.maps.renderer.createDefs();
                        defElement.innerHTML += '<marker id="' + 'triangle' + i + '"></marker>';
                        var markerEle = defElement.querySelector('#' + 'triangle' + i);
                        markerEle.setAttribute('markerWidth', (arrowSize.toString()));
                        markerEle.setAttribute('markerHeight', (arrowSize.toString()));
                        markerEle.setAttribute('refX', (divide - offSet).toString());
                        markerEle.setAttribute('refY', divide.toString());
                        markerEle.setAttribute('orient', 'auto');
                        var d2 = 'M 0,0  L 0,' + arrowSize + ' L ' + divide + ', ' + divide + ' Z';
                        pathOption = new PathOption(triId, arrowColor, width, color, 1, dashArray, d2);
                        navigationEle = this.maps.renderer.drawPath(pathOption);
                        markerEle.appendChild(navigationEle);
                        defElement.appendChild(markerEle);
                        navigationGroup.appendChild(defElement);
                    }
                    angle = Math.abs(angle);
                    d = (angle === 0) ? 'M ' + point[j]['x'] + ',' + point[j]['y'] + 'L ' + point[j + 1]['x']
                        + ',' + point[j + 1]['y'] + ' ' :
                        'M ' + point[j]['x'] + ',' + point[j]['y'] + ' A ' + (radius_1 / 2 + (1 - angle) * radius_1 / (angle * 10)) +
                            ' ' + (radius_1 / 2 + (1 - angle) * radius_1 / (angle * 10)) + ' ' + 0 + ',' + 0 + ','
                            + direction + ' , ' + point[j + 1]['x'] + ',' + point[j + 1]['y'] + ' ';
                    pathOption = new PathOption(arcId_1, 'none', width, color, 1, dashArray, d);
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
    };
    NavigationLine.prototype.convertRadius = function (point1, point2) {
        var value1 = point2['x'] - point1['x'];
        var value2 = point2['y'] - point1['y'];
        var value = Math.sqrt((Math.pow(value1, 2) + Math.pow(value2, 2)));
        return value;
    };
    /**
     * Get module name.
     */
    NavigationLine.prototype.getModuleName = function () {
        return 'NavigationLine';
    };
    /**
     * To destroy the layers.
     * @return {void}
     * @private
     */
    NavigationLine.prototype.destroy = function (maps) {
        /**
         * Destroy method performed here
         */
    };
    return NavigationLine;
}());

/**
 * Legend module is used to render legend for the maps
 */
var Legend = /** @__PURE__ @class */ (function () {
    function Legend(maps) {
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
    Legend.prototype.renderLegend = function () {
        this.legendRenderingCollections = [];
        this.legendCollection = [];
        this.totalPages = [];
        this.widthIncrement = 0;
        this.heightIncrement = 0;
        this.defsElement = this.maps.renderer.createDefs();
        this.maps.svgObject.appendChild(this.defsElement);
        this.calculateLegendBounds();
        this.drawLegend();
    };
    /* tslint:disable-next-line:max-func-body-length */
    Legend.prototype.calculateLegendBounds = function () {
        var _this = this;
        var map = this.maps;
        var legend = map.legendSettings;
        this.legendCollection = [];
        var spacing = 10;
        var leftPadding = 10;
        var topPadding = map.mapAreaRect.y;
        this.legendRenderingCollections = [];
        Array.prototype.forEach.call(map.layersCollection, function (layer, layerIndex) {
            if (!isNullOrUndefined(layer.shapeData)) {
                var layerData = layer.shapeData['features'];
                var dataPath = layer.shapeDataPath;
                var propertyPath = layer.shapePropertyPath;
                var dataSource = layer.dataSource;
                var colorValuePath = void 0;
                var colorMapping = void 0;
                if (legend.type === 'Layers' && layer.visible) {
                    colorValuePath = layer.shapeSettings.colorValuePath;
                    colorMapping = layer.shapeSettings.colorMapping;
                    _this.getLegends(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
                }
                else if (legend.type === 'Bubbles') {
                    for (var _i = 0, _a = layer.bubbleSettings; _i < _a.length; _i++) {
                        var bubble = _a[_i];
                        if (bubble.visible) {
                            colorValuePath = bubble.colorValuePath;
                            colorMapping = bubble.colorMapping;
                            dataSource = bubble.dataSource;
                            _this.getLegends(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
                        }
                    }
                }
                else {
                    _this.getMarkersLegendCollections(layerIndex, layer.markerSettings);
                }
            }
        });
        if (this.legendCollection.length > 0) {
            for (var i = 0; i < this.legendCollection.length; i++) {
                var legendItem = this.legendCollection[i];
                var eventArgs = {
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
        var defaultSize = 25;
        var legendTitle = map.legendSettings.title.text;
        var titleTextStyle = map.legendSettings.titleStyle;
        if (this.legendCollection.length > 0) {
            var legendMode = legend.mode;
            var shapeX = 0;
            var shapeY = 0;
            var textX = 0;
            var textY = 0;
            var shapePadding = legend.shapePadding;
            var textPadding = 10;
            var shapeHeight = legend.shapeHeight;
            var shapeWidth = legend.shapeWidth;
            var shapeLocation = [];
            var textLocation = [];
            var position = legend.position;
            var labelAction = legend.labelDisplayMode;
            var arrangement = (legend.orientation === 'None') ? ((position === 'Top' || position === 'Bottom')
                ? 'Horizontal' : 'Vertical') : legend.orientation;
            var legendWidth = (legend.width.length > 1) ? (legend.width.indexOf('%') > -1) ? (map.availableSize.width / 100)
                * parseInt(legend.width, 10) : parseInt(legend.width, 10) : null;
            var legendHeight = (legend.height.length > 1) ? (legend.height.indexOf('%') > -1) ? (map.availableSize.height / 100) *
                parseInt(legend.height, 10) : parseInt(legend.height, 10) : null;
            var legendItemStartX_1;
            var legendItemStartY_1;
            var startX = 0;
            var startY = 0;
            var legendtitleSize = measureText(legendTitle, titleTextStyle);
            if (legendMode === 'Interactive') {
                var itemTextStyle = legend.textStyle;
                var rectWidth = void 0;
                var rectHeight = void 0;
                var legendLength = this.legendCollection.length;
                rectWidth = (arrangement === 'Horizontal') ? (isNullOrUndefined(legendWidth)) ? (map.mapAreaRect.width / legendLength) :
                    (legendWidth / legendLength) : (isNullOrUndefined(legendWidth)) ? defaultSize : legendWidth;
                rectHeight = (arrangement === 'Horizontal') ? (isNullOrUndefined(legendHeight)) ? defaultSize : legendHeight :
                    (isNullOrUndefined(legendHeight)) ? (map.mapAreaRect.height / legendLength) : (legendHeight / legendLength);
                startX = 0;
                startY = legendtitleSize.height + spacing;
                var position_1 = legend.labelPosition;
                var textX_1 = 0;
                var textY_1 = 0;
                var textPadding_1 = 10;
                var itemStartX = 0;
                var itemStartY = 0;
                var maxTextHeight = 0;
                var maxTextWidth = 0;
                for (var i = 0; i < this.legendCollection.length; i++) {
                    startX = (arrangement === 'Horizontal') ? (startX + rectWidth) : startX;
                    startY = (arrangement === 'Horizontal') ? startY : (startY + rectHeight);
                    var legendText = this.legendCollection[i]['text'];
                    var itemTextSize = new Size(0, 0);
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
                            textX_1 = startX + (rectWidth / 2);
                            textY_1 = (position_1 === 'After') ? (startY + rectHeight + (itemTextSize.height / 2)) + textPadding_1 :
                                (startY - textPadding_1);
                        }
                        else {
                            textX_1 = (position_1 === 'After') ? startX - (itemTextSize.width / 2) - textPadding_1
                                : (startX + rectWidth + itemTextSize.width / 2) + textPadding_1;
                            textY_1 = startY + (rectHeight / 2) + (itemTextSize.height / 4);
                        }
                    }
                    if (i === 0) {
                        itemStartX = (arrangement === 'Horizontal') ? startX : (position_1 === 'After') ?
                            textX_1 - (itemTextSize.width / 2) : startX;
                        itemStartY = (arrangement === 'Horizontal') ? (position_1 === 'After') ? startY :
                            textY_1 - (itemTextSize.height / 2) : startY;
                        if (this.legendCollection.length === 1) {
                            legendWidth = (arrangement === 'Horizontal') ? Math.abs((startX + rectWidth) - itemStartX) :
                                (rectWidth + maxTextWidth + textPadding_1);
                            legendHeight = (arrangement === 'Horizontal') ? (rectHeight + (maxTextHeight / 2) + textPadding_1) :
                                Math.abs((startY + rectHeight) - itemStartY);
                        }
                    }
                    else if (i === this.legendCollection.length - 1) {
                        legendWidth = (arrangement === 'Horizontal') ? Math.abs((startX + rectWidth) - itemStartX) :
                            (rectWidth + maxTextWidth + textPadding_1);
                        legendHeight = (arrangement === 'Horizontal') ? (rectHeight + (maxTextHeight / 2) + textPadding_1) :
                            Math.abs((startY + rectHeight) - itemStartY);
                    }
                    this.legendRenderingCollections.push({
                        fill: this.legendCollection[i]['fill'], x: startX, y: startY,
                        width: rectWidth, height: rectHeight,
                        text: legendText, textX: textX_1, textY: textY_1,
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
                var j = 0;
                this.page = 0;
                for (var i = 0; i < this.legendCollection.length; i++) {
                    var legendItem = this.legendCollection[i];
                    if (isNullOrUndefined(this.totalPages[this.page])) {
                        this.totalPages[this.page] = { Page: (this.page + 1), Collection: [] };
                    }
                    var legendTextSize = measureText(legendItem['text'], legend.textStyle);
                    this.textMaxWidth = Math.max(this.textMaxWidth, legendTextSize.width);
                    if (i === 0) {
                        startX = shapeX = (leftPadding + (shapeWidth / 2));
                        startY = shapeY = topPadding + legendtitleSize.height + (shapeHeight > legendTextSize.height ? shapeHeight / 2
                            : (legendTextSize.height / 4));
                    }
                    else {
                        var maxSize = (legendTextSize.height > shapeHeight) ? legendTextSize.height : shapeHeight;
                        if (arrangement === 'Horizontal') {
                            var prvePositionX = (textLocation[j - 1].x + textLocation[j - 1].width) + textPadding + shapeWidth;
                            if ((prvePositionX + shapePadding + legendTextSize.width) > legendWidth) {
                                var nextPositionY = (textLocation[j - 1].y > (shapeLocation[j - 1].y + (shapeHeight / 2)) ?
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
                            var prevPositionY = textLocation[j - 1].y > shapeLocation[j - 1].y + (shapeHeight / 2) ?
                                textLocation[j - 1].y : shapeLocation[j - 1].y + (shapeHeight / 2);
                            if ((prevPositionY + topPadding + maxSize) > legendHeight) {
                                var nextPositionX = (textLocation[j - 1].x + this.textMaxWidth + textPadding);
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
                var collection = this.totalPages[0]['Collection'];
                Array.prototype.forEach.call(collection, function (legendObj, index) {
                    var legendRect = new Rect(legendObj['Rect']['x'], legendObj['Rect']['y'], legendObj['Rect']['width'], legendObj['Rect']['height']);
                    if (index === 0) {
                        legendItemStartX_1 = legendRect.x;
                        legendItemStartY_1 = legendRect.y;
                    }
                    _this.widthIncrement = Math.max(_this.widthIncrement, Math.abs(legendItemStartX_1 - (legendRect.x + legendRect.width)));
                    _this.heightIncrement = Math.max(_this.heightIncrement, Math.abs(legendItemStartY_1 - (legendRect.y + legendRect.height)));
                });
                legendWidth = ((this.widthIncrement < legendWidth) ? this.widthIncrement : legendWidth);
                legendHeight = ((this.heightIncrement < legendHeight) ? this.heightIncrement : legendHeight);
                this.legendItemRect = {
                    x: collection[0]['Rect']['x'], y: collection[0]['Rect']['y'],
                    width: legendWidth, height: legendHeight
                };
            }
        }
    };
    /**
     *
     */
    Legend.prototype.getLegends = function (layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath) {
        this.getRangeLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
        this.getEqualLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
        this.getDataLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
    };
    Legend.prototype.getPageChanged = function () {
        this.page++;
        if (isNullOrUndefined(this.totalPages[this.page])) {
            this.totalPages[this.page] = { Page: (this.page + 1), Collection: [] };
        }
    };
    /**
     * To draw the legend shape and text.
     */
    Legend.prototype.drawLegend = function () {
        var map = this.maps;
        var legend = map.legendSettings;
        var render = map.renderer;
        var textOptions;
        var textFont = legend.textStyle;
        this.legendGroup = render.createGroup({ id: map.element.id + '_Legend_Group' });
        if (legend.mode === 'Interactive') {
            for (var i = 0; i < this.legendRenderingCollections.length; i++) {
                var itemId = map.element.id + '_Legend_Index_' + i;
                var textId = map.element.id + '_Legend_Index_' + i + '_Text';
                var item = this.legendRenderingCollections[i];
                var bounds = new Rect(item['x'], item['y'], item['width'], item['height']);
                var textLocation = new Point(item['textX'], item['textY']);
                textFont.color = (textFont.color !== null) ? textFont.color : this.maps.themeStyle.legendTextColor;
                var rectOptions = new RectOption(itemId, item['fill'], item['shapeBorder'], legend.opacity, bounds);
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'middle', item['text'], '', '');
                textFont.fontFamily = map.themeStyle.fontFamily || textFont.fontFamily;
                textFont.size = map.themeStyle.legendFontSize || textFont.size;
                renderTextElement(textOptions, textFont, textFont.color, this.legendGroup);
                this.legendGroup.appendChild(render.drawRectangle(rectOptions));
                if (i === this.legendRenderingCollections.length - 1) {
                    this.renderLegendBorder();
                }
            }
        }
        else {
            this.drawLegendItem(this.currentPage);
        }
    };
    // tslint:disable-next-line:max-func-body-length
    Legend.prototype.drawLegendItem = function (page) {
        var map = this.maps;
        var legend = map.legendSettings;
        var spacing = 10;
        var shapeSize = new Size(legend.shapeWidth, legend.shapeHeight);
        var textOptions;
        var render = map.renderer;
        if (page >= 0 && page < this.totalPages.length) {
            if (querySelector(this.legendGroup.id, this.maps.element.id)) {
                remove(querySelector(this.legendGroup.id, this.maps.element.id));
            }
            for (var i = 0; i < this.totalPages[page]['Collection'].length; i++) {
                var collection = this.totalPages[page]['Collection'][i];
                var shapeBorder = collection['shapeBorder'];
                var legendElement = render.createGroup({ id: map.element.id + '_Legend_Index_' + collection['idIndex'] });
                var legendText = collection['DisplayText'];
                var shape = ((legend.type === 'Markers') ? ((isNullOrUndefined(collection['ImageSrc'])) ?
                    legend.shape : 'Image') : collection['legendShape']);
                var strokeColor = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine'
                    || legend.shape === 'Cross') ? isNullOrUndefined(legend.fill) ? '#000000' : legend.fill : shapeBorder.color;
                var strokeWidth = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine'
                    || legend.shape === 'Cross') ? (shapeBorder.width === 0) ?
                    1 : shapeBorder.width : shapeBorder.width;
                var shapeId = map.element.id + '_Legend_Shape_Index_' + collection['idIndex'];
                var textId = map.element.id + '_Legend_Text_Index_' + collection['idIndex'];
                var shapeLocation = collection['Shape'];
                var textLocation = collection['Text'];
                var imageUrl = ((isNullOrUndefined(collection['ImageSrc'])) ? legend.shape : collection['ImageSrc']);
                var renderOptions_1 = new PathOption(shapeId, collection['Fill'], strokeWidth, strokeColor, legend.opacity, '');
                legend.textStyle.color = (legend.textStyle.color !== null) ? legend.textStyle.color :
                    this.maps.themeStyle.legendTextColor;
                legend.textStyle.fontFamily = map.themeStyle.fontFamily || legend.textStyle.fontFamily;
                legend.textStyle.size = map.themeStyle.legendFontSize || legend.textStyle.size;
                legendElement.appendChild(drawSymbol(shapeLocation, shape, shapeSize, collection['ImageSrc'], renderOptions_1));
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'start', legendText, '', '');
                renderTextElement(textOptions, legend.textStyle, legend.textStyle.color, legendElement);
                this.legendGroup.appendChild(legendElement);
                if (i === (this.totalPages[page]['Collection'].length - 1)) {
                    var pagingGroup = void 0;
                    var width = spacing;
                    var height = (spacing / 2);
                    if (this.page !== 0) {
                        var pagingText = (page + 1) + '/' + this.totalPages.length;
                        var pagingFont = legend.textStyle;
                        var pagingTextSize = measureText(pagingText, pagingFont);
                        var leftPageX = (this.legendItemRect.x + this.legendItemRect.width) - pagingTextSize.width -
                            (width * 2) - spacing;
                        var rightPageX = (this.legendItemRect.x + this.legendItemRect.width);
                        var locY = (this.legendItemRect.y + this.legendItemRect.height) + (height / 2) + spacing;
                        var pageTextX = rightPageX - width - (pagingTextSize.width / 2) - (spacing / 2);
                        pagingGroup = render.createGroup({ id: map.element.id + '_Legend_Paging_Group' });
                        var leftPageElement = render.createGroup({ id: map.element.id + '_Legend_Left_Paging_Group' });
                        var rightPageElement = render.createGroup({ id: map.element.id + '_Legend_Right_Paging_Group' });
                        var rightPath = ' M ' + rightPageX + ' ' + locY + ' L ' + (rightPageX - width) + ' ' + (locY - height) +
                            ' L ' + (rightPageX - width) + ' ' + (locY + height) + ' z ';
                        var leftPath = ' M ' + leftPageX + ' ' + locY + ' L ' + (leftPageX + width) + ' ' + (locY - height) +
                            ' L ' + (leftPageX + width) + ' ' + (locY + height) + ' z ';
                        var leftPageOptions = new PathOption(map.element.id + '_Left_Page', '#a6a6a6', 0, '#a6a6a6', 1, '', leftPath);
                        leftPageElement.appendChild(render.drawPath(leftPageOptions));
                        var leftRectPageOptions = new RectOption(map.element.id + '_Left_Page_Rect', 'transparent', {}, 1, new Rect(leftPageX - (width / 2), (locY - (height * 2)), width * 2, spacing * 2), null, null, '', '');
                        leftPageElement.appendChild(render.drawRectangle(leftRectPageOptions));
                        this.wireEvents(leftPageElement);
                        var rightPageOptions = new PathOption(map.element.id + '_Right_Page', '#a6a6a6', 0, '#a6a6a6', 1, '', rightPath);
                        rightPageElement.appendChild(render.drawPath(rightPageOptions));
                        var rightRectPageOptions = new RectOption(map.element.id + '_Right_Page_Rect', 'transparent', {}, 1, new Rect((rightPageX - width), (locY - height), width, spacing), null, null, '', '');
                        rightPageElement.appendChild(render.drawRectangle(rightRectPageOptions));
                        this.wireEvents(rightPageElement);
                        pagingGroup.appendChild(leftPageElement);
                        pagingGroup.appendChild(rightPageElement);
                        var pageTextOptions = {
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
                    this.renderLegendBorder();
                }
            }
        }
    };
    // tslint:disable-next-line:max-func-body-length
    Legend.prototype.legendHighLightAndSelection = function (targetElement, value) {
        var shapeIndex;
        var layerIndex;
        var dataIndex;
        var textEle;
        var legend = this.maps.legendSettings;
        textEle = legend.mode === 'Default' ? document.getElementById(targetElement.id.replace('Shape', 'Text')) :
            document.getElementById(targetElement.id + '_Text');
        var collection = this.maps.legendModule.legendCollection;
        var length;
        var selectLength = 0;
        var interactProcess = true;
        var idIndex = parseFloat(targetElement.id.charAt(targetElement.id.length - 1));
        this.updateLegendElement();
        var toggleLegendCheck = this.maps.toggledLegendId.indexOf(idIndex);
        if (this.maps.legendSettings.toggleLegendSettings.enable && value === 'highlight' && toggleLegendCheck !== -1) {
            var collectionIndex = this.getIndexofLegend(this.legendHighlightCollection, targetElement);
            if (collectionIndex !== -1) {
                this.legendHighlightCollection.splice(collectionIndex, 1);
            }
            this.removeLegendHighlightCollection();
            return null;
        }
        if (value === 'selection') {
            var multiSelectEnable = this.maps.layers[collection[0]['data'][0]['layerIndex']].selectionSettings.enableMultiSelect;
            this.shapeHighlightCollection = [];
            if (!this.maps.shapeSelections && !multiSelectEnable) {
                this.removeAllSelections();
                this.maps.shapeSelections = true;
            }
            if (this.maps.legendSelectionCollection.length > 0 && (!multiSelectEnable ? this.maps.shapeSelections : true)) {
                for (var k = 0; k < this.maps.legendSelectionCollection.length; k++) {
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
                for (var k = 0; k < this.maps.legendSelectionCollection.length; k++) {
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
            for (var i = 0; i < collection.length; i++) {
                if (textEle.textContent === collection[i]['text'] && collection[i]['data'].length > 0) {
                    var layer = this.maps.layers[collection[i]['data'][0]['layerIndex']];
                    var enable = void 0;
                    var module = void 0;
                    var data = void 0;
                    if (!isNullOrUndefined(layer)) {
                        enable = (value === 'selection') ? layer.selectionSettings.enable : layer.highlightSettings.enable;
                        module = void 0;
                        module = (value === 'selection') ? layer.selectionSettings : layer.highlightSettings;
                        data = collection[i]['data'];
                    }
                    if (enable) {
                        for (var j = 0; j < data.length; j++) {
                            shapeIndex = data[j]['shapeIndex'];
                            layerIndex = data[j]['layerIndex'];
                            dataIndex = data[j]['dataIndex'];
                            var shapeEle = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                                layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
                            if (shapeEle !== null) {
                                var shapeMatch = true;
                                if (this.maps.legendSelectionCollection !== null) {
                                    for (var i_1 = 0; i_1 < this.maps.legendSelectionCollection.length; i_1++) {
                                        if (this.maps.legendSelectionCollection[i_1]['legendElement'] === targetElement) {
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
                                    var legendHighlightColor = this.legendHighlightCollection[length - 1]['legendOldFill'];
                                    this.legendHighlightCollection[length - 1]['MapShapeCollection']['Elements'].push(shapeEle);
                                    var shapeItemCount = this.legendHighlightCollection[length - 1]['MapShapeCollection']['Elements'].length - 1;
                                    var shapeOldFillColor = shapeEle.getAttribute('fill');
                                    this.legendHighlightCollection[length - 1]['shapeOldFillColor'].push(shapeOldFillColor);
                                    var shapeOldColor = this.legendHighlightCollection[length - 1]['shapeOldFillColor'][shapeItemCount];
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
                                    var legendSelectionColor = void 0;
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
    };
    Legend.prototype.setColor = function (element, fill, opacity, borderColor, borderWidth, type) {
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
    };
    Legend.prototype.pushCollection = function (targetElement, collection, oldElement, shapeSettings) {
        collection.push({
            legendElement: targetElement, legendOldFill: oldElement['fill'], legendOldOpacity: oldElement['opacity'],
            legendOldBorderColor: oldElement['borderColor'], legendOldBorderWidth: oldElement['borderWidth'],
            shapeOpacity: shapeSettings.opacity, shapeOldBorderColor: shapeSettings.border.color,
            shapeOldBorderWidth: shapeSettings.border.width
        });
        length = collection.length;
        collection[length - 1]['MapShapeCollection'] = { Elements: [] };
        collection[length - 1]['shapeOldFillColor'] = [];
    };
    Legend.prototype.removeLegend = function (collection) {
        for (var i = 0; i < collection.length; i++) {
            var item = collection[i];
            this.setColor(item['legendElement'], item['legendOldFill'], item['legendOldOpacity'], item['legendOldBorderColor'], item['legendOldBorderWidth'], 'highlight');
            var dataCount = item['MapShapeCollection']['Elements'].length;
            for (var j = 0; j < dataCount; j++) {
                var shapeFillColor = item['legendOldFill'].indexOf('url') !== -1
                    ? item['shapeOldFillColor'][j] : item['legendOldFill'];
                this.setColor(item['MapShapeCollection']['Elements'][j], shapeFillColor, item['shapeOpacity'], item['shapeOldBorderColor'], item['shapeOldBorderWidth'], 'highlight');
            }
        }
    };
    Legend.prototype.removeLegendHighlightCollection = function () {
        if (this.legendHighlightCollection.length > 0) {
            this.removeLegend(this.legendHighlightCollection);
            this.legendHighlightCollection = [];
        }
    };
    Legend.prototype.removeLegendSelectionCollection = function (targetElement) {
        if (this.maps.legendSelectionCollection.length > 0) {
            removeClass(targetElement);
            var shapeElements = this.shapesOfLegend(targetElement);
            var dataCount = shapeElements.length;
            for (var j = 0; j < dataCount; j++) {
                var shapeElement = getElement(shapeElements[j]);
                if (shapeElement.getAttribute('class') === 'ShapeselectionMapStyle') {
                    removeClass(shapeElement);
                    var selectedElementIdIndex = void 0;
                    selectedElementIdIndex = this.maps.selectedElementId.indexOf(shapeElement.id);
                    if (selectedElementIdIndex !== -1) {
                        this.maps.selectedElementId.splice(selectedElementIdIndex, 1);
                    }
                }
            }
        }
    };
    Legend.prototype.removeShapeHighlightCollection = function () {
        if (this.shapeHighlightCollection.length > 0) {
            for (var i = 0; i < this.shapeHighlightCollection.length; i++) {
                var item = this.shapeHighlightCollection[i];
                var removeFill = true;
                for (var j = 0; j < this.maps.legendSelectionCollection.length; j++) {
                    if (this.maps.legendSelectionCollection[j]['legendElement'] === item['legendElement']) {
                        removeFill = false;
                    }
                }
                if (removeFill) {
                    this.setColor(item['legendElement'], item['legendOldFill'], item['legendOldOpacity'], item['legendOldBorderColor'], item['legendOldBorderWidth'], 'highlight');
                }
            }
        }
    };
    // tslint:disable-next-line:max-func-body-length
    Legend.prototype.shapeHighLightAndSelection = function (targetElement, data, module, getValue, layerIndex) {
        if (data !== undefined) {
            this.updateLegendElement();
            this.shapeToggled = true;
            var collection = this.maps.legendModule.legendCollection;
            var indexes = this.legendIndexOnShape(data, layerIndex);
            var shapeElement = this.shapeDataOnLegend(targetElement);
            var toggleLegendCheck = this.maps.toggledLegendId.indexOf(indexes['actualIndex']);
            if (this.maps.legendSettings.toggleLegendSettings.enable && toggleLegendCheck !== -1) {
                this.shapeToggled = false;
                this.legendHighlightCollection = [];
                var collectionIndex = this.getIndexofLegend(this.shapeHighlightCollection, shapeElement['LegendEle']);
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
                    var checkSelection = 0;
                    for (var i = 0; i < shapeElement['Elements'].length; i++) {
                        if (shapeElement['Elements'][i].getAttribute('class') === 'ShapeselectionMapStyle') {
                            checkSelection++;
                        }
                    }
                    var selectionIndex = this.maps.selectedLegendElementId.indexOf(indexes['actualIndex']);
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
            var text = collection[indexes['actualIndex']]['text'];
            var content = void 0;
            var legendShape = void 0;
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
            var length_1 = this.maps.legendSelectionCollection.length;
            if (text === content) {
                var shapeMatched = true;
                if (this.maps.legendSelectionCollection) {
                    for (var i = 0; i < this.maps.legendSelectionCollection.length; i++) {
                        if (this.maps.legendSelectionCollection[i]['legendElement'] === shapeElement['LegendEle']) {
                            shapeMatched = false;
                            break;
                        }
                    }
                }
                if (getValue === 'highlight' && shapeMatched) {
                    var selectionEle = this.isTargetSelected(shapeElement, this.shapeHighlightCollection);
                    if (selectionEle === undefined || (selectionEle && !selectionEle['IsSelected'])) {
                        this.pushCollection(legendShape, this.shapeHighlightCollection, collection[indexes['actualIndex']], this.maps.layers[layerIndex].shapeSettings);
                    }
                    for (var j = 0; j < this.shapeHighlightCollection.length; j++) {
                        if (shapeElement['LegendEle'].id === this.shapeHighlightCollection[j]['legendElement'].id) {
                            this.shapeHighlightCollection[j]['legendElement'] = shapeElement['LegendEle'];
                        }
                    }
                    if (length_1 > 0) {
                        for (var j = 0; j < length_1; j++) {
                            if (shapeElement['LegendEle'] === this.maps.legendSelectionCollection[j]['legendElement']) {
                                this.maps.legendSelectionCollection[j]['legendElement'] = shapeElement['LegendEle'];
                                this.removeShapeHighlightCollection();
                                break;
                            }
                            else if (j === length_1 - 1) {
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
                    var selectionEle = this.isTargetSelected(shapeElement, this.maps.legendSelectionCollection);
                    if (length_1 > 0) {
                        var j = 0;
                        while (j < this.maps.legendSelectionCollection.length) {
                            if (shapeElement['LegendEle'] !== this.maps.legendSelectionCollection[j]['legendElement'] &&
                                !module.enableMultiSelect) {
                                var element = this.maps.legendSelectionCollection[j];
                                var selectedLegendIndex = this.maps.selectedLegendElementId.indexOf(indexes['actualIndex']);
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
                        var element = this.maps.legendSelectionCollection[selectionEle['SelectionIndex']];
                        var multiSelection = 0;
                        if (module.enableMultiSelect) {
                            for (var i = 0; i < shapeElement['Elements'].length; i++) {
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
                            var legendSelectionIndex = this.getIndexofLegend(this.maps.legendSelectionCollection, legendShape);
                            if (legendSelectionIndex === -1) {
                                this.pushCollection(legendShape, this.maps.legendSelectionCollection, collection[indexes['actualIndex']], this.maps.layers[layerIndex].shapeSettings);
                            }
                        }
                        var addId = true;
                        for (var i = 0; i < this.maps.selectedLegendElementId.length; i++) {
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
                            var legendSelectionIndex = this.getIndexofLegend(this.maps.legendSelectionCollection, legendShape);
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
    };
    Legend.prototype.isTargetSelected = function (target, collection) {
        var selectEle;
        for (var i = 0; i < collection.length; i++) {
            if (!isNullOrUndefined(target['LegendEle'].getAttribute('id')) &&
                (target['LegendEle'].getAttribute('id') === collection[i]['legendElement'].getAttribute('id'))) {
                selectEle = { IsSelected: true, SelectionIndex: i };
            }
        }
        return selectEle;
    };
    Legend.prototype.updateLegendElement = function () {
        for (var i = 0; i < this.maps.legendSelectionCollection.length; i++) {
            if (document.getElementById(this.maps.legendSelectionCollection[i]['legendElement'].id)) {
                this.maps.legendSelectionCollection[i]['legendElement'] =
                    document.getElementById(this.maps.legendSelectionCollection[i]['legendElement'].id);
            }
        }
    };
    Legend.prototype.getIndexofLegend = function (targetCollection, targetElement) {
        var legendIndex = targetCollection.map(function (e) { return e['legendElement']; }).indexOf(targetElement);
        return legendIndex;
    };
    Legend.prototype.removeAllSelections = function () {
        for (var i = 0; i < this.maps.selectedElementId.length; i++) {
            var selectedElement = document.getElementById(this.maps.selectedElementId[i]);
            removeClass(selectedElement);
        }
        for (var j = 0; j < this.maps.selectedLegendElementId.length; j++) {
            var idIndex = this.maps.legendSettings.mode === 'Interactive' ?
                'container_Legend_Index_' : 'container_Legend_Shape_Index_';
            var selectedElement = idIndex + this.maps.selectedLegendElementId[j];
            var legendElement = document.getElementById(selectedElement);
            if (!isNullOrUndefined(legendElement)) {
                removeClass(document.getElementById(selectedElement));
            }
        }
        this.maps.legendSelectionCollection = [];
        this.maps.selectedLegendElementId = [];
        this.maps.selectedElementId = [];
    };
    Legend.prototype.legendIndexOnShape = function (data, index) {
        var legendIndex;
        var actualIndex;
        var path = this.maps.layers[index].shapeDataPath;
        var value = data[path];
        var legendType = this.maps.legendSettings.mode;
        var collection = this.maps.legendModule.legendCollection;
        var currentCollection;
        if (legendType === 'Default' && !isNullOrUndefined(this.maps.legendModule.totalPages)) {
            currentCollection = this.maps.legendModule.totalPages[this.maps.legendModule.currentPage]['Collection'];
        }
        var currentCollectionLength = legendType === 'Default' ? currentCollection['length'] : 1;
        for (var i = 0; i < collection.length; i++) {
            var dataValue = collection[i]['data'];
            for (var k = 0; k < currentCollectionLength; k++) {
                if (legendType !== 'Default' || collection[i]['text'] === currentCollection[k]['DisplayText']) {
                    for (var j = 0; j < dataValue.length; j++) {
                        if (value === dataValue[j]['name']) {
                            legendIndex = k;
                        }
                    }
                }
            }
            for (var j = 0; j < dataValue.length; j++) {
                if (value === dataValue[j]['name']) {
                    actualIndex = i;
                }
            }
        }
        return { currentIndex: legendIndex, actualIndex: actualIndex };
    };
    Legend.prototype.shapeDataOnLegend = function (targetElement) {
        var shapeIndex;
        var layerIndex;
        var dataIndex;
        var collection = this.maps.legendModule.legendCollection;
        var legend = this.maps.legendSettings;
        for (var i = 0; i < collection.length; i++) {
            var data = collection[i]['data'];
            var process = false;
            var elements = [];
            var currentElement = { Elements: [] };
            for (var j = 0; j < data.length; j++) {
                shapeIndex = data[j]['shapeIndex'];
                layerIndex = data[j]['layerIndex'];
                dataIndex = data[j]['dataIndex'];
                var shapeEle = document.getElementById(this.maps.element.id + '_LayerIndex_' +
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
    };
    Legend.prototype.shapesOfLegend = function (targetElement) {
        var shapeIndex;
        var layerIndex;
        var dataIndex;
        var idIndex = parseFloat(targetElement.id.charAt(targetElement.id.length - 1));
        var data = this.maps.legendModule.legendCollection[idIndex]['data'];
        var legendShapeElements = [];
        for (var i = 0; i < data.length; i++) {
            shapeIndex = data[i]['shapeIndex'];
            layerIndex = data[i]['layerIndex'];
            dataIndex = data[i]['dataIndex'];
            var shapeElement = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
            if (!isNullOrUndefined(shapeElement)) {
                legendShapeElements.push(shapeElement.id);
            }
        }
        return legendShapeElements;
    };
    //tslint:disable
    Legend.prototype.renderLegendBorder = function () {
        var map = this.maps;
        var legend = map.legendSettings;
        var legendTitle = legend.title.text;
        var textStyle = legend.titleStyle;
        var textOptions;
        var spacing = 10;
        var trimTitle = textTrim((this.legendItemRect.width + (spacing * 2)), legendTitle, textStyle);
        var textSize = measureText(trimTitle, textStyle);
        this.legendBorderRect = new Rect((this.legendItemRect.x - spacing), (this.legendItemRect.y - spacing - textSize.height), (this.legendItemRect.width) + (spacing * 2), (this.legendItemRect.height) + (spacing * 2) + textSize.height +
            (legend.mode === 'Interactive' ? 0 : (this.page !== 0) ? spacing : 0));
        if (legendTitle) {
            textStyle.color = (textStyle.color !== null) ? textStyle.color : this.maps.themeStyle.legendTextColor;
            textOptions = new TextOption(map.element.id + '_LegendTitle', (this.legendItemRect.x) + (this.legendItemRect.width / 2), this.legendItemRect.y - (textSize.height / 2) - spacing / 2, 'middle', trimTitle, '');
            renderTextElement(textOptions, textStyle, textStyle.color, this.legendGroup);
        }
        var renderOptions = new RectOption(map.element.id + '_Legend_Border', legend.background, legend.border, 1, this.legendBorderRect, null, null, '', '');
        this.legendGroup.appendChild(map.renderer.drawRectangle(renderOptions));
        this.getLegendAlignment(map, this.legendBorderRect.width, this.legendBorderRect.height, legend);
        this.legendGroup.setAttribute('transform', 'translate( ' + (this.translate.x + (-(this.legendBorderRect.x))) + ' ' +
            (this.translate.y + (-(this.legendBorderRect.y))) + ' )');
        map.svgObject.appendChild(this.legendGroup);
        if (this.maps.selectedLegendElementId) {
            // To maintain the state of legend selection during page resize.
            for (var j = 0; j < this.maps.selectedLegendElementId.length; j++) {
                var idIndex = legend.mode === 'Interactive' ? this.maps.element.id + '_Legend_Index_' : this.maps.element.id + '_Legend_Shape_Index_';
                var selectedElement = map.svgObject.querySelector('#' + idIndex + this.maps.selectedLegendElementId[j]);
                if (!isNullOrUndefined(selectedElement)) {
                    var fill = !isNullOrUndefined(this.maps.legendSelectionClass.fill) ?
                        this.maps.legendSelectionClass.fill : selectedElement.getAttribute('fill');
                    this.setColor(selectedElement, fill, this.maps.legendSelectionClass.opacity.toString(), this.maps.legendSelectionClass.border.color, this.maps.legendSelectionClass.border.width.toString(), 'selection');
                    for (var i = 0; i < this.maps.legendSelectionCollection.length; i++) {
                        if (this.maps.legendSelectionCollection[i]['legendElement'].id === selectedElement.id) {
                            this.maps.legendSelectionCollection[i]['legendElement'] = selectedElement;
                        }
                    }
                    var legendSelectionIndex = this.getIndexofLegend(this.maps.legendSelectionCollection, selectedElement);
                    if (legendSelectionIndex === -1) {
                        var layerIndex = this.maps.legendModule.legendCollection[this.maps.selectedLegendElementId[j]]['data'][j]['layerIndex'];
                        this.pushCollection(selectedElement, this.maps.legendSelectionCollection, this.maps.legendModule.legendCollection[this.maps.selectedLegendElementId[j]], this.maps.layers[layerIndex].shapeSettings);
                    }
                }
            }
            
        }
        if (this.maps.toggledLegendId) {
            for (var j = 0; j < this.maps.toggledLegendId.length; j++) {
                var legendTextId = legend.mode === 'Interactive' ? ('#' + this.maps.element.id + '_Legend_Index_' + this.maps.toggledLegendId[j] + '_Text') : ('#' + this.maps.element.id + '_Legend_Text_Index_' + this.maps.toggledLegendId[j]);
                var textElement = map.svgObject.querySelector(legendTextId);
                if (!isNullOrUndefined(textElement)) {
                    textElement.setAttribute("fill", "#E5E5E5");
                }
                var legendShapeId = legend.mode === 'Interactive' ? ('#' + this.maps.element.id + '_Legend_Index_' + this.maps.toggledLegendId[j]) : ('#' + this.maps.element.id + '_Legend_Shape_Index_' + this.maps.toggledLegendId[j]);
                var legendElement = map.svgObject.querySelector(legendShapeId);
                if (!isNullOrUndefined(legendElement)) {
                    legendElement.setAttribute("fill", "#E5E5E5");
                }
            }
        }
    };
    Legend.prototype.changeNextPage = function (e) {
        this.currentPage = (e.target.id.indexOf('_Left_Page_') > -1) ? (this.currentPage - 1) :
            (this.currentPage + 1);
        this.legendGroup = this.maps.renderer.createGroup({ id: this.maps.element.id + '_Legend_Group' });
        this.drawLegendItem(this.currentPage);
        if (querySelector(this.maps.element.id + '_Legend_Border', this.maps.element.id)) {
            querySelector(this.maps.element.id + '_Legend_Border', this.maps.element.id).style.pointerEvents = 'none';
        }
    };
    Legend.prototype.getLegendAlignment = function (map, width, height, legend) {
        var x;
        var y;
        var spacing = 10;
        var totalRect;
        totalRect = extend({}, map.mapAreaRect, totalRect, true);
        var areaX = totalRect.x;
        var areaY = totalRect.y;
        var areaHeight = totalRect.height;
        var areaWidth = totalRect.width;
        var totalWidth = map.availableSize.width;
        var totalHeight = map.availableSize.height;
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
            if (legend.height && legend.width && legend.mode !== 'Interactive') {
                map.totalRect = totalRect;
            }
            else {
                map.mapAreaRect = totalRect;
            }
            this.translate = new Point(x, y);
        }
    };
    Legend.prototype.getMarkersLegendCollections = function (layerIndex, markers) {
        var _this = this;
        Array.prototype.forEach.call(markers, function (marker$$1, markerIndex) {
            var dataSource = marker$$1.dataSource;
            var field = marker$$1.legendText;
            var templateFn;
            var isDuplicate;
            Array.prototype.forEach.call(dataSource, function (data, dataIndex) {
                var imageSrc = null;
                var showLegend = isNullOrUndefined(data[_this.maps.legendSettings.showLegendPath]) ? true :
                    data[_this.maps.legendSettings.showLegendPath];
                if (marker$$1.visible && showLegend && (!isNullOrUndefined(data['latitude'])) && (!isNullOrUndefined(data['longitude']))) {
                    if (marker$$1.template) {
                        templateFn = getTemplateFunction(marker$$1.template);
                        var templateElement = templateFn(_this.maps);
                        var markerEle = isNullOrUndefined(templateElement.childElementCount) ? templateElement[0] :
                            templateElement;
                        imageSrc = markerEle.querySelector('img').src;
                    }
                    var text = isNullOrUndefined(data[field]) ? '' : data[field];
                    isDuplicate = _this.maps.legendSettings.removeDuplicateLegend ?
                        _this.removeDuplicates(_this.legendCollection, text) : false;
                    if (!isDuplicate) {
                        _this.legendCollection.push({
                            layerIndex: layerIndex, markerIndex: markerIndex, dataIndex: dataIndex,
                            fill: marker$$1.fill, text: text, imageSrc: imageSrc
                        });
                    }
                }
            });
        });
    };
    Legend.prototype.getRangeLegendCollection = function (layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath) {
        var _this = this;
        var legendText;
        var legendIndex = 0;
        var fill = this.maps.legendSettings.fill;
        var rangeData = [];
        var _loop_1 = function (colorMap) {
            if (!isNullOrUndefined(colorMap.from) && !isNullOrUndefined(colorMap.to)) {
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.from + ' - ' + colorMap.to;
                rangeData = [];
                var colorMapProcess_1 = false;
                Array.prototype.forEach.call(dataSource, function (data, dataIndex) {
                    var colorValue = parseFloat(data[colorValuePath]);
                    if (colorValue >= colorMap.from && colorValue <= colorMap.to) {
                        colorMapProcess_1 = true;
                        rangeData.push(_this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, colorValue));
                    }
                });
                if (!colorMapProcess_1) {
                    rangeData.push({
                        layerIndex: layerIndex, shapeIndex: null, dataIndex: null,
                        name: null, value: null
                    });
                }
                var legendFill = (isNullOrUndefined(fill)) ? Object.prototype.toString.call(colorMap.color) === '[object Array]' ?
                    !isNullOrUndefined(colorMap.value) ? colorMap.color[0] : this_1.legendGradientColor(colorMap, legendIndex) :
                    colorMap.color : fill;
                legendIndex++;
                this_1.getOverallLegendItemsCollection(legendText, legendFill, rangeData, colorMap.showLegend);
            }
        };
        var this_1 = this;
        for (var _i = 0, colorMapping_1 = colorMapping; _i < colorMapping_1.length; _i++) {
            var colorMap = colorMapping_1[_i];
            _loop_1(colorMap);
        }
    };
    Legend.prototype.getOverallLegendItemsCollection = function (legendText, legendFill, legendData, showLegend) {
        var newColllection = [];
        var legend = this.maps.legendSettings;
        if (legendData.length > 0 && showLegend) {
            for (var i = 0; i < legendData.length; i++) {
                var collection = legendData[i];
                if (collection.length > 0) {
                    for (var j = 0; j < collection.length; j++) {
                        newColllection.push(collection[j]);
                    }
                }
                else {
                    newColllection.push(legendData[i]);
                }
                newColllection['_isVisible'] = true;
            }
            var isDuplicate = this.maps.legendSettings.removeDuplicateLegend ?
                this.removeDuplicates(this.legendCollection, legendText) : false;
            if (!isDuplicate) {
                this.legendCollection.push({
                    text: legendText, fill: legendFill, data: newColllection, opacity: legend.opacity,
                    borderColor: legend.shapeBorder.color, borderWidth: legend.shapeBorder.width
                });
            }
        }
    };
    Legend.prototype.removeDuplicates = function (legendCollection, text) {
        var isDuplicate = false;
        for (var i = 0; i < legendCollection.length; i++) {
            if (legendCollection[i]['text'] === text) {
                isDuplicate = true;
                break;
            }
            else {
                continue;
            }
        }
        return isDuplicate;
    };
    Legend.prototype.getEqualLegendCollection = function (layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath) {
        var _this = this;
        var fill = this.maps.legendSettings.fill;
        var equalValues = [];
        var legendText;
        var equalData = [];
        var outOfRangeValues = [];
        var outOfRange = [];
        var _loop_2 = function (colorMap) {
            if (!isNullOrUndefined(colorMap.value)) {
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.value;
                equalData = [];
                var eqaulColorProcess_1 = false;
                Array.prototype.forEach.call(dataSource, function (data, dataIndex) {
                    var equalValue = data[colorValuePath];
                    if (equalValue === colorMap.value) {
                        eqaulColorProcess_1 = true;
                        if (equalValues.indexOf(equalValue) === -1) {
                            equalValues.push(equalValue);
                        }
                        equalData.push(_this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, equalValue));
                    }
                    else {
                        if (outOfRangeValues.indexOf(equalValue) === -1) {
                            outOfRangeValues.push(equalValue);
                        }
                    }
                });
                for (var x = 0; x < equalValues.length; x++) {
                    for (var y = 0; y < outOfRangeValues.length; y++) {
                        if (equalValues[x] === outOfRangeValues[y]) {
                            var equalIndex = outOfRangeValues.indexOf(equalValues[x]);
                            outOfRangeValues.splice(equalIndex, 1);
                        }
                    }
                }
                if (!eqaulColorProcess_1) {
                    equalData.push({
                        layerIndex: layerIndex, shapeIndex: null, dataIndex: null,
                        name: null, value: null
                    });
                }
                var legendFill = (isNullOrUndefined(fill)) ? Object.prototype.toString.call(colorMap.color) === '[object Array]'
                    ? colorMap.color[0] : colorMap.color : fill;
                this_2.getOverallLegendItemsCollection(legendText, legendFill, equalData, colorMap.showLegend);
            }
            else if (isNullOrUndefined(colorMap.minOpacity) && isNullOrUndefined(colorMap.maxOpacity) && isNullOrUndefined(colorMap.value)
                && isNullOrUndefined(colorMap.from) && isNullOrUndefined(colorMap.to) && !isNullOrUndefined(colorMap.color)) {
                Array.prototype.forEach.call(dataSource, function (data, dataIndex) {
                    var equalValue = data[colorValuePath];
                    for (var k = 0; k < outOfRangeValues.length; k++) {
                        if (equalValue === outOfRangeValues[k]) {
                            outOfRange.push(_this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, equalValue));
                        }
                    }
                });
                if (outOfRangeValues.length === 0) {
                    var range_1 = false;
                    Array.prototype.forEach.call(dataSource, function (data, dataIndex) {
                        range_1 = false;
                        var rangeValue = data[colorValuePath];
                        for (var z = 0; z < colorMapping.length; z++) {
                            if (!isNullOrUndefined(rangeValue) && rangeValue !== 0) {
                                if (rangeValue >= colorMapping[z].from && rangeValue <= colorMapping[z].to) {
                                    range_1 = true;
                                }
                            }
                            else if (!range_1) {
                                range_1 = false;
                            }
                        }
                        if (!range_1) {
                            outOfRange.push(_this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, rangeValue));
                        }
                    });
                }
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : 'Others';
                var outfill = ((Object.prototype.toString.call(colorMap.color) === '[object Array]'))
                    ? colorMap.color[0] : colorMap.color;
                var legendOutFill = outfill;
                this_2.getOverallLegendItemsCollection(legendText, legendOutFill, outOfRange, colorMap.showLegend);
            }
        };
        var this_2 = this;
        for (var _i = 0, colorMapping_2 = colorMapping; _i < colorMapping_2.length; _i++) {
            var colorMap = colorMapping_2[_i];
            _loop_2(colorMap);
        }
    };
    Legend.prototype.getDataLegendCollection = function (layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath) {
        var _this = this;
        var legendText;
        var fill = this.maps.legendSettings.fill;
        var valuePath = this.maps.legendSettings.valuePath;
        if (!isNullOrUndefined(colorValuePath) && !isNullOrUndefined(dataSource)) {
            Array.prototype.forEach.call(dataSource, function (data, dataIndex) {
                var showLegend = isNullOrUndefined(_this.maps.legendSettings.showLegendPath) ?
                    true : isNullOrUndefined(data[_this.maps.legendSettings.showLegendPath]) ?
                    false : data[_this.maps.legendSettings.showLegendPath];
                var dataValue = data[colorValuePath];
                var newData = [];
                var legendFill = (isNullOrUndefined(fill)) ? dataValue : fill;
                if (!isNullOrUndefined(dataValue) && colorMapping.length === 0) {
                    legendText = !isNullOrUndefined(data[valuePath]) ? data[valuePath] : data[dataPath];
                    newData.push(_this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, dataValue));
                }
                _this.getOverallLegendItemsCollection(legendText, legendFill, newData, showLegend);
            });
        }
    };
    Legend.prototype.interactiveHandler = function (e) {
        var target = e.target;
        var legend = this.maps.legendSettings;
        var id = this.maps.element.id + '_Interactive_Legend';
        var hoverId = legend.type === 'Layers' ? '_shapeIndex_' : (legend.type === 'Markers') ? '_MarkerIndex_' :
            '_BubbleIndex_';
        if (target.id.indexOf(hoverId) > 1) {
            var layerIndex = parseFloat(target.id.split('_LayerIndex_')[1].split('_')[0]);
            var dataIndex = parseFloat(target.id.split(/_dataIndex_/i)[1].split('_')[0]);
            var fill = void 0;
            var stroke = void 0;
            var strokeWidth = void 0;
            if (!(isNullOrUndefined(querySelector(id, this.maps.element.id)))) {
                remove(querySelector(id, this.maps.element.id));
            }
            var layer = this.maps.layersCollection[layerIndex];
            var markerVisible = (legend.type === 'Layers' ? layer.visible :
                legend.type === 'Markers' ? layer.markerSettings[parseFloat(target.id.split('_MarkerIndex_')[1].split('_')[0])].visible :
                    (this.maps.getBubbleVisible(this.maps.layersCollection[layerIndex])));
            if (legend.visible && this.legendRenderingCollections.length > 0
                && legend.mode === 'Interactive' && markerVisible) {
                var svgRect = this.maps.svgObject.getBoundingClientRect();
                for (var i = 0; i < this.legendCollection.length; i++) {
                    var currentData = this.legendCollection[i];
                    var legendElement = querySelector(this.maps.element.id + '_Legend_Index_' + i, this.maps.element.id);
                    var legendRect = legendElement.getBoundingClientRect();
                    var rect = new Rect(Math.abs(legendRect.left - svgRect.left), Math.abs(legendRect.top - svgRect.top), legendRect.width, legendRect.height);
                    fill = legendElement.getAttribute('fill');
                    stroke = legend.shapeBorder.color;
                    strokeWidth = legend.shapeBorder.width;
                    if (!isNullOrUndefined(currentData['data'])) {
                        var data = currentData['data'];
                        for (var j = 0; j < data.length; j++) {
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
    };
    Legend.prototype.renderInteractivePointer = function (legend, fill, stroke, id, strokeWidth, rect) {
        var path;
        var pathOptions;
        var locX;
        var locY;
        var height = 10;
        var width = 10;
        var direction = (legend.orientation === 'None') ? (legend.position === 'Top' || legend.position === 'Bottom')
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
    };
    Legend.prototype.wireEvents = function (element) {
        EventHandler.add(element, Browser.touchStartEvent, this.changeNextPage, this);
    };
    Legend.prototype.addEventListener = function () {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.on(Browser.touchMoveEvent, this.interactiveHandler, this);
        this.maps.on(Browser.touchEndEvent, this.interactiveHandler, this);
        this.maps.on(click, this.legendClick, this);
    };
    Legend.prototype.legendClick = function (targetEle) {
        var legendShapeId;
        var legendTextId;
        var legendToggleFill = this.maps.legendSettings.toggleLegendSettings.fill;
        var legendToggleOpacity = this.maps.legendSettings.toggleLegendSettings.opacity;
        var legendToggleBorderColor = this.maps.legendSettings.toggleLegendSettings.border.color;
        var legendToggleBorderWidth = this.maps.legendSettings.toggleLegendSettings.border.width;
        if (targetEle.parentNode['id'].indexOf(this.maps.element.id + '_Legend_Index_') > -1) {
            var mapElement = void 0;
            var legendIndex = parseFloat(targetEle.parentElement.id.substr((this.maps.element.id + '_Legend_Index_').length));
            var selectedItem = this.legendCollection[legendIndex]['data'];
            var isVisible = selectedItem['_isVisible'];
            var shape = void 0;
            if (this.maps.legendSettings.toggleLegendSettings.enable && this.maps.legendSettings.type === "Bubbles") {
                for (var k = 0; k < this.maps.layers.length; k++) {
                    for (var j = 0; j < this.maps.layers[k].bubbleSettings.length; j++) {
                        for (var i = 0; i < selectedItem.length; i++) {
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
                var layerElement = void 0;
                this.removeCollections(targetEle, legendIndex);
                var toggledLegendIdIndex = this.maps.toggledLegendId.indexOf(legendIndex);
                if (toggledLegendIdIndex !== -1) {
                    isVisible = false;
                }
                
                for (var j = 0; j < this.maps.layers.length; j++) {
                    for (var i = 0; i < selectedItem.length; i++) {
                        shape = this.legendCollection[legendIndex]['data'][i];
                        layerElement = querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                            '_shapeIndex_' + shape['shapeIndex'] + '_dataIndex_' + shape['dataIndex'], this.maps.element.id);
                        if (layerElement !== null) {
                            var toggledShapeIdIndex = this.maps.toggledShapeElementId.indexOf(layerElement.id);
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
            var LegendInteractive = void 0;
            var legendIndex = parseFloat(targetEle.id.substr((this.maps.element.id + '_Legend_Index_').length));
            var mapdata = void 0;
            var selectedItem = this.legendCollection[legendIndex]['data'];
            var isVisible = selectedItem['_isVisible'];
            if (this.maps.legendSettings.type === "Bubbles" && this.maps.legendSettings.toggleLegendSettings.enable) {
                for (var k = 0; k < this.maps.layers.length; k++) {
                    for (var j = 0; j < this.maps.layers[k].bubbleSettings.length; j++) {
                        for (var i = 0; i < selectedItem.length; i++) {
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
                var mapLegendElement = void 0;
                this.removeCollections(targetEle, legendIndex);
                var toggleLegendIdIndex = this.maps.toggledLegendId.indexOf(legendIndex);
                if (toggleLegendIdIndex !== -1) {
                    isVisible = false;
                }
                
                for (var k = 0; k < this.maps.layers.length; k++) {
                    for (var i = 0; i < selectedItem.length; i++) {
                        mapdata = this.legendCollection[legendIndex]['data'][i];
                        mapLegendElement = querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                            '_shapeIndex_' + mapdata['shapeIndex'] + '_dataIndex_' + mapdata['dataIndex'], this.maps.element.id);
                        if (mapLegendElement !== null) {
                            var toggledShapeIdIndex = this.maps.toggledShapeElementId.indexOf(mapLegendElement.id);
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
    };
    Legend.prototype.removeCollections = function (targetEle, legendIndex) {
        this.removeLegendSelectionCollection(targetEle);
        var legendSelectionIndex = this.getIndexofLegend(this.maps.legendSelectionCollection, targetEle);
        if (legendSelectionIndex !== -1) {
            this.maps.legendSelectionCollection.splice(legendSelectionIndex, 1);
        }
        var legendHighlightIndex = this.getIndexofLegend(this.legendHighlightCollection, targetEle);
        if (legendHighlightIndex !== -1) {
            this.legendHighlightCollection.splice(legendSelectionIndex, 1);
        }
        var shapeHighlightIndex = this.getIndexofLegend(this.shapeHighlightCollection, targetEle);
        if (shapeHighlightIndex !== -1) {
            this.shapeHighlightCollection.splice(shapeHighlightIndex, 1);
        }
        var selectedIndex = this.maps.selectedLegendElementId.indexOf(legendIndex);
        if (selectedIndex !== -1) {
            this.maps.selectedLegendElementId.splice(selectedIndex, 1);
        }
    };
    Legend.prototype.removeEventListener = function () {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(Browser.touchMoveEvent, this.interactiveHandler);
        this.maps.off(Browser.touchEndEvent, this.interactiveHandler);
        this.maps.off(click, this.legendClick);
    };
    Legend.prototype.getLegendData = function (layerIndex, dataIndex, data, dataPath, layerData, shapePropertyPath, value) {
        var legendData = [];
        if (Object.prototype.toString.call(layerData) === '[object Array]') {
            for (var i = 0; i < layerData.length; i++) {
                var shapeData = layerData[i];
                var shapePath = checkPropertyPath(data[dataPath], shapePropertyPath, shapeData['properties']);
                if (shapeData['properties'][shapePath] === data[dataPath]) {
                    legendData.push({
                        layerIndex: layerIndex, shapeIndex: i, dataIndex: dataIndex,
                        name: data[dataPath], value: value
                    });
                }
            }
        }
        return legendData;
    };
    Legend.prototype.legendGradientColor = function (colorMap, legendIndex) {
        var legendFillColor;
        var xmlns = 'http://www.w3.org/2000/svg';
        if (!isNullOrUndefined(colorMap.color) && typeof (colorMap.color) === 'object') {
            var linerGradientEle = document.createElementNS(xmlns, 'linearGradient');
            var opacity = 1;
            var position = this.maps.legendSettings.position;
            var x2 = void 0;
            var y2 = void 0;
            x2 = position === 'Top' || position === 'Bottom' ? '100' : '0';
            y2 = position === 'Top' || position === 'Bottom' ? '0' : '100';
            linerGradientEle.setAttribute('id', 'linear_' + legendIndex + '_' + this.maps.element.id);
            linerGradientEle.setAttribute('x1', 0 + '%');
            linerGradientEle.setAttribute('y1', 0 + '%');
            linerGradientEle.setAttribute('x2', x2 + '%');
            linerGradientEle.setAttribute('y2', y2 + '%');
            for (var b = 0; b < colorMap.color.length; b++) {
                var offsetColor = 100 / (colorMap.color.length - 1);
                var stopEle = document.createElementNS(xmlns, 'stop');
                stopEle.setAttribute('offset', b * offsetColor + '%');
                stopEle.setAttribute('stop-color', colorMap.color[b]);
                stopEle.setAttribute('stop-opacity', opacity.toString());
                linerGradientEle.appendChild(stopEle);
            }
            this.legendLinearGradient = linerGradientEle;
            var color = 'url(' + '#linear_' + legendIndex + '_' + this.maps.element.id + ')';
            this.defsElement.appendChild(linerGradientEle);
            legendFillColor = color;
        }
        return legendFillColor;
    };
    /**
     * Get module name.
     */
    Legend.prototype.getModuleName = function () {
        return 'Legend';
    };
    /**
     * To destroy the legend.
     * @return {void}
     * @private
     */
    Legend.prototype.destroy = function (maps) {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    };
    return Legend;
}());

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
var Highlight = /** @__PURE__ @class */ (function () {
    function Highlight(maps) {
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * To bind events for highlight module
     */
    Highlight.prototype.addEventListener = function () {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.maps.on(Browser.touchStartEvent, this.mouseMove, this);
    };
    /**
     * To unbind events for highlight module
     */
    Highlight.prototype.removeEventListener = function () {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(Browser.touchMoveEvent, this.mouseMove);
        this.maps.off(Browser.touchStartEvent, this.mouseMove);
    };
    /**
     * Public method for highlight module
     */
    Highlight.prototype.addHighlight = function (layerIndex, name, enable) {
        var targetEle = getTargetElement(layerIndex, name, enable, this.maps);
        if (enable) {
            this.mapHighlight(targetEle, null, null);
        }
        else {
            removeClass(targetEle);
        }
    };
    Highlight.prototype.mouseMove = function (e) {
        var targetEle = e.target;
        var layerIndex;
        var isTouch = e.pointerType === 'touch' || e.pointerType === '2' || (e.type.indexOf('touch') > -1);
        if ((targetEle.id.indexOf('LayerIndex') !== -1 || targetEle.id.indexOf('NavigationIndex') > -1) &&
            targetEle.getAttribute('class') !== 'ShapeselectionMapStyle' && !isTouch &&
            targetEle.getAttribute('class') !== 'MarkerselectionMapStyle' &&
            targetEle.getAttribute('class') !== 'BubbleselectionMapStyle' &&
            targetEle.getAttribute('class') !== 'navigationlineselectionMapStyle') {
            layerIndex = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
            var shapeData = void 0;
            var data = void 0;
            var shapeIn = void 0;
            var dataIndex = void 0;
            if (targetEle.id.indexOf('shapeIndex') > -1) {
                shapeIn = parseInt(targetEle.id.split('_shapeIndex_')[1].split('_')[0], 10);
                shapeData = this.maps.layers[layerIndex].shapeData['features'] ?
                    this.maps.layers[layerIndex].shapeData['features'][shapeIn]['properties'] : null;
                dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = isNullOrUndefined(dataIndex) ? null : this.maps.layers[layerIndex].dataSource[dataIndex];
                this.highlightSettings = this.maps.layers[layerIndex].highlightSettings;
            }
            else if (targetEle.id.indexOf('BubbleIndex') > -1) {
                var bubble = parseInt(targetEle.id.split('_BubbleIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex].bubbleSettings[bubble].dataSource[dataIndex];
                this.highlightSettings = this.maps.layers[layerIndex].bubbleSettings[bubble].highlightSettings;
            }
            else if (targetEle.id.indexOf('MarkerIndex') > -1) {
                var marker$$1 = parseInt(targetEle.id.split('_MarkerIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex].markerSettings[marker$$1].dataSource[dataIndex];
                this.highlightSettings = this.maps.layers[layerIndex].markerSettings[marker$$1].highlightSettings;
            }
            else {
                var index = parseInt(targetEle.id.split('_NavigationIndex_')[1].split('_')[0], 10);
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
                var selectHighLight = targetEle.id.indexOf('shapeIndex') > -1 && this.maps.legendSettings.visible ?
                    this.maps.legendModule.shapeToggled : true;
                if (selectHighLight) {
                    this.mapHighlight(targetEle, shapeData, data);
                }
            }
            else {
                var element = document.getElementsByClassName('highlightMapStyle')[0];
                if (!isNullOrUndefined(element)) {
                    removeClass(element);
                    if (element.id.indexOf('NavigationIndex') > -1) {
                        var index = parseInt(element.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                        var layerIndex_1 = parseInt(element.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
                        element.setAttribute('stroke-width', this.maps.layers[layerIndex_1].navigationLineSettings[index].width.toString());
                        element.setAttribute('stroke', this.maps.layers[layerIndex_1].navigationLineSettings[index].color);
                    }
                }
            }
        }
        else if (getElementsByClassName('highlightMapStyle').length > 0) {
            targetEle = getElementsByClassName('highlightMapStyle')[0];
            if (targetEle.id.indexOf('NavigationIndex') > -1) {
                var index = parseInt(targetEle.id.split('_NavigationIndex_')[1].split('_')[0], 10);
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
    };
    Highlight.prototype.mapHighlight = function (targetEle, shapeData, data) {
        var _this = this;
        var layerIndex = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
        var isMarkerSelect = false;
        if (targetEle.id.indexOf('MarkerIndex') > -1) {
            var marker$$1 = parseInt(targetEle.id.split('_MarkerIndex_')[1].split('_')[0], 10);
            isMarkerSelect = this.maps.layers[layerIndex].markerSettings[marker$$1].highlightSettings.enable;
        }
        var border = {
            color: this.highlightSettings.border.color,
            width: this.highlightSettings.border.width / (isMarkerSelect ? 1 : this.maps.scale)
        };
        var eventArgs = {
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
            var shapeData_1 = eventArgs.shapeData, maps = eventArgs.maps, blazorEventArgs = __rest$5(eventArgs, ["shapeData", "maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(itemHighlight, eventArgs, function () {
            _this.highlightMap(targetEle, eventArgs);
        });
    };
    Highlight.prototype.highlightMap = function (targetEle, eventArgs) {
        if (targetEle.getAttribute('class') === 'highlightMapStyle') {
            return;
        }
        else {
            if (getElementsByClassName('highlightMapStyle').length > 0) {
                var elem = getElementsByClassName('highlightMapStyle')[0];
                removeClass(elem);
                if (elem.id.indexOf('NavigationIndex') > -1) {
                    var index = parseInt(elem.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                    var layerIndex = parseInt(elem.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
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
    };
    /**
     * Get module name.
     */
    Highlight.prototype.getModuleName = function () {
        return 'Highlight';
    };
    /**
     * To destroy the highlight.
     * @return {void}
     * @private
     */
    Highlight.prototype.destroy = function (maps) {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    };
    return Highlight;
}());

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
var Selection = /** @__PURE__ @class */ (function () {
    /* tslint:disable:no-string-literal */
    function Selection(maps) {
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * For binding events to selection module
     */
    Selection.prototype.addEventListener = function () {
        if (!this.maps.isDestroyed) {
            this.maps.on(click, this.mouseClick, this);
            this.maps.on(Browser.touchEndEvent, this.mouseClick, this);
        }
    };
    /**
     * For removing events from selection modue
     */
    Selection.prototype.removeEventListener = function () {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(click, this.mouseClick);
        this.maps.off(Browser.touchEndEvent, this.mouseClick);
    };
    Selection.prototype.mouseClick = function (targetElement) {
        if (!isNullOrUndefined(targetElement['type']) && targetElement['type'].indexOf('touch') !== -1 &&
            isNullOrUndefined(targetElement.id)) {
            targetElement = targetElement['target'];
        }
        if (!isNullOrUndefined(targetElement.id) && (targetElement.id.indexOf('LayerIndex') > -1 ||
            targetElement.id.indexOf('NavigationIndex') > -1)) {
            var layerIndex = void 0;
            var shapeData = void 0;
            var data = void 0;
            var shapeIndex = void 0;
            var dataIndex = void 0;
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
                var bubbleIndex = parseInt(targetElement.id.split('_BubbleIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetElement.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex].bubbleSettings[bubbleIndex].dataSource[dataIndex];
                this.selectionsettings = this.maps.layers[layerIndex].bubbleSettings[bubbleIndex].selectionSettings;
                this.selectionType = 'Bubble';
            }
            else if (targetElement.id.indexOf('MarkerIndex') > -1) {
                var markerIndex = parseInt(targetElement.id.split('_MarkerIndex_')[1].split('_')[0], 10);
                dataIndex = parseInt(targetElement.id.split('_dataIndex_')[1].split('_')[0], 10);
                data = this.maps.layers[layerIndex].markerSettings[markerIndex].dataSource[dataIndex];
                this.selectionsettings = this.maps.layers[layerIndex].markerSettings[markerIndex].selectionSettings;
                this.selectionType = 'Marker';
            }
            else {
                var index = parseInt(targetElement.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                shapeData = null;
                data = {
                    latitude: this.maps.layers[layerIndex].navigationLineSettings[index].latitude,
                    longitude: this.maps.layers[layerIndex].navigationLineSettings[index].longitude
                };
                this.selectionsettings = this.maps.layers[layerIndex].navigationLineSettings[index].selectionSettings;
                this.selectionType = 'navigationline';
            }
            if (this.selectionsettings.enable) {
                if (this.maps.legendSettings.visible && targetElement.id.indexOf('_MarkerIndex_') === -1) {
                    this.maps.legendModule.shapeHighLightAndSelection(targetElement, data, this.selectionsettings, 'selection', layerIndex);
                }
                var shapeToggled = (targetElement.id.indexOf('shapeIndex') > -1 && this.maps.legendSettings.visible) ?
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
    };
    /**
     * Public method for selection
     */
    Selection.prototype.addSelection = function (layerIndex, name, enable) {
        var targetElement = getTargetElement(layerIndex, name, enable, this.maps);
        if (enable) {
            this.selectMap(targetElement, null, null);
        }
        else {
            removeClass(targetElement);
        }
    };
    /**
     * Method for selection
     */
    Selection.prototype.selectMap = function (targetElement, shapeData, data) {
        var _this = this;
        var selectionsettings = this.selectionsettings;
        var border = {
            color: this.selectionsettings.border.color,
            width: this.selectionsettings.border.width / (this.selectionType === 'Marker' ? 1 : this.maps.scale)
        };
        var eventArgs = {
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
            var shapeData_1 = eventArgs.shapeData, maps = eventArgs.maps, blazorEventArgs = __rest$6(eventArgs, ["shapeData", "maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger('itemSelection', eventArgs, function (observedArgs) {
            if (targetElement.getAttribute('class') === _this.selectionType + 'selectionMapStyle') {
                removeClass(targetElement);
                _this.removedSelectionList(targetElement);
                if (targetElement.id.indexOf('NavigationIndex') > -1) {
                    var index = parseInt(targetElement.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                    var layerIndex = parseInt(targetElement.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
                    targetElement.setAttribute('stroke-width', _this.maps.layers[layerIndex].navigationLineSettings[index].width.toString());
                    targetElement.setAttribute('stroke', _this.maps.layers[layerIndex].navigationLineSettings[index].color);
                }
            }
            else {
                var layetElement = getElementByID(_this.maps.element.id + '_Layer_Collections');
                if (!_this.selectionsettings.enableMultiSelect &&
                    layetElement.getElementsByClassName(_this.selectionType + 'selectionMapStyle').length > 0) {
                    var ele = layetElement.getElementsByClassName(_this.selectionType + 'selectionMapStyle')[0];
                    removeClass(ele);
                    _this.removedSelectionList(ele);
                    if (_this.selectionType === 'Shape') {
                        var selectionLength = _this.maps.selectedElementId.length;
                        for (var i = 0; i < selectionLength; i++) {
                            ele = layetElement.getElementsByClassName(_this.selectionType + 'selectionMapStyle')[0];
                            removeClass(ele);
                            var selectedElementIdIndex = _this.maps.selectedElementId.indexOf(ele.getAttribute('id'));
                            _this.maps.selectedElementId.splice(selectedElementIdIndex, 1);
                        }
                    }
                    if (ele.id.indexOf('NavigationIndex') > -1) {
                        var index = parseInt(targetElement.id.split('_NavigationIndex_')[1].split('_')[0], 10);
                        var layerIndex = parseInt(targetElement.parentElement.id.split('_LayerIndex_')[1].split('_')[0], 10);
                        ele.setAttribute('stroke-width', _this.maps.layers[layerIndex].navigationLineSettings[index].width.toString());
                        ele.setAttribute('stroke', _this.maps.layers[layerIndex].navigationLineSettings[index].color);
                    }
                }
                if (!getElement(_this.selectionType + 'selectionMap')) {
                    document.body.appendChild(createStyle(_this.selectionType + 'selectionMap', _this.selectionType + 'selectionMapStyle', eventArgs));
                }
                else {
                    customizeStyle(_this.selectionType + 'selectionMap', _this.selectionType + 'selectionMapStyle', eventArgs);
                }
                targetElement.setAttribute('class', _this.selectionType + 'selectionMapStyle');
                if (targetElement.getAttribute('class') === 'ShapeselectionMapStyle') {
                    _this.maps.shapeSelectionClass = getElement(_this.selectionType + 'selectionMap');
                    _this.maps.selectedElementId.push(targetElement.getAttribute('id'));
                }
                if (targetElement.getAttribute('class') === 'MarkerselectionMapStyle') {
                    _this.maps.markerSelectionClass = getElement(_this.selectionType + 'selectionMap');
                    _this.maps.selectedMarkerElementId.push(targetElement.getAttribute('id'));
                }
                if (targetElement.getAttribute('class') === 'BubbleselectionMapStyle') {
                    _this.maps.bubbleSelectionClass = getElement(_this.selectionType + 'selectionMap');
                    _this.maps.selectedBubbleElementId.push(targetElement.getAttribute('id'));
                }
                if (targetElement.getAttribute('class') === 'navigationlineselectionMapStyle') {
                    _this.maps.navigationSelectionClass = getElement(_this.selectionType + 'selectionMap');
                    _this.maps.selectedNavigationElementId.push(targetElement.getAttribute('id'));
                }
            }
        });
    };
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
    Selection.prototype.removedSelectionList = function (targetElement) {
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
    };
    /**
     * Get module name.
     */
    Selection.prototype.getModuleName = function () {
        return 'Selection';
    };
    /**
     * To destroy the selection.
     * @return {void}
     * @private
     */
    Selection.prototype.destroy = function (maps) {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    };
    return Selection;
}());

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
 * Map Tooltip
 */
var MapsTooltip = /** @__PURE__ @class */ (function () {
    function MapsTooltip(maps) {
        this.maps = maps;
        this.tooltipId = this.maps.element.id + '_mapsTooltip';
        this.addEventListener();
    }
    /* tslint:disable:no-string-literal */
    //tslint:disable:max-func-body-length
    MapsTooltip.prototype.renderTooltip = function (e) {
        var _this = this;
        var pageX;
        var pageY;
        var target;
        var touchArg;
        var tooltipArgs;
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
        var option;
        var currentData = '';
        var targetId = target.id;
        var tooltipEle;
        var location;
        var templateData = [];
        var index = targetId.indexOf('_LayerIndex_') > -1 && parseFloat(targetId.split('_LayerIndex_')[1].split('_')[0]);
        var layer = this.maps.layersCollection[index];
        var tooltipContent = [];
        var markerFill;
        location = getMousePosition(pageX, pageY, this.maps.svgObject);
        this.tooltipTargetID = targetId;
        var istooltipRender = (targetId.indexOf('_shapeIndex_') > -1)
            || (targetId.indexOf('_MarkerIndex_') > -1) || (targetId.indexOf('_BubbleIndex_') > -1);
        if (istooltipRender) {
            if (targetId.indexOf('_shapeIndex_') > -1) {
                option = layer.tooltipSettings;
                option.textStyle.fontFamily = this.maps.themeStyle.fontFamily || option.textStyle.fontFamily;
                option.textStyle.opacity = this.maps.themeStyle.tooltipTextOpacity || option.textStyle.opacity;
                var shape = parseInt(targetId.split('_shapeIndex_')[1].split('_')[0], 10);
                if (isNullOrUndefined(layer.layerData) || isNullOrUndefined(layer.layerData[shape])) {
                    return;
                }
                var value_1 = layer.layerData[shape]['property'];
                var isShape = false;
                var properties = (Object.prototype.toString.call(layer.shapePropertyPath) === '[object Array]' ?
                    layer.shapePropertyPath : [layer.shapePropertyPath]);
                if (!isNullOrUndefined(properties)) {
                    for (var k = 0; k < properties.length; k++) {
                        for (var i = 0; i < layer['dataSource']['length']; i++) {
                            var data = layer.dataSource[i];
                            if ((data[layer.shapeDataPath]) === value_1[properties[k]]) {
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
                if (option.visible && ((!isNullOrUndefined(index) && !isNaN(index)) || (!isNullOrUndefined(value_1)))) {
                    if (layer.tooltipSettings.format) {
                        currentData = this.formatter(layer.tooltipSettings.format, layer.dataSource[index]);
                    }
                    else {
                        var shapePath = checkPropertyPath(layer.shapeDataPath, layer.shapePropertyPath, value_1);
                        currentData = ((!isNullOrUndefined(layer.dataSource)) && ((!isNullOrUndefined(index)))) ?
                            this.formatValue(layer.dataSource[index][option.valuePath], this.maps) : value_1[shapePath];
                        if (isNullOrUndefined(currentData)) {
                            currentData = value_1[option.valuePath];
                        }
                    }
                }
                //location.y = this.template(option, location);
            }
            else if (targetId.indexOf('_MarkerIndex_') > -1) {
                var markerIdex = parseInt(targetId.split('_MarkerIndex_')[1].split('_')[0], 10);
                var dataIndex = parseInt(targetId.split('_MarkerIndex_')[1].split('_')[2], 10);
                var marker$$1 = layer.markerSettings[markerIdex];
                option = marker$$1.tooltipSettings;
                templateData = marker$$1.dataSource[dataIndex];
                if (option.visible && !isNaN(markerIdex)) {
                    if (marker$$1.tooltipSettings.format) {
                        currentData = this.formatter(marker$$1.tooltipSettings.format, marker$$1.dataSource[dataIndex]);
                    }
                    else {
                        currentData = this.formatValue(marker$$1.dataSource[dataIndex][marker$$1.tooltipSettings.valuePath], this.maps);
                    }
                }
                //location.y = this.template(option, location);
            }
            else if (targetId.indexOf('_BubbleIndex_') > -1) {
                var bubbleIndex = parseInt(targetId.split('_BubbleIndex_')[1].split('_')[0], 10);
                var dataIndex = parseInt(targetId.split('_BubbleIndex_')[1].split('_')[2], 10);
                var bubble = layer.bubbleSettings[bubbleIndex];
                option = bubble.tooltipSettings;
                templateData = bubble.dataSource[dataIndex];
                if (option.visible && !isNaN(dataIndex)) {
                    if (bubble.tooltipSettings.format) {
                        currentData = this.formatter(bubble.tooltipSettings.format, bubble.dataSource[dataIndex]);
                    }
                    else {
                        currentData = this.formatValue(bubble.dataSource[dataIndex][bubble.tooltipSettings.valuePath], this.maps);
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
            var tooltipOption = {
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
                var maps = tooltipArgs.maps, eventArgs = tooltipArgs.eventArgs, blazorEventArgs = __rest$7(tooltipArgs, ["maps", "eventArgs"]);
                tooltipArgs = blazorEventArgs;
            }
            this.maps.trigger('tooltipRender', tooltipArgs, function (observedArgs) {
                if (!tooltipArgs.cancel && option.visible && !isNullOrUndefined(currentData) &&
                    (targetId.indexOf('_cluster_') === -1 && targetId.indexOf('_dataLabel_') === -1)) {
                    var blazTooltipName = void 0;
                    if (targetId.indexOf('MarkerIndex') > 0) {
                        blazTooltipName = 'MarkerTooltipTemplate';
                    }
                    else if (targetId.indexOf('BubbleIndex') > 0) {
                        blazTooltipName = 'BubbleTooltipTemplate';
                    }
                    else {
                        blazTooltipName = 'LayerTooltipTemplate';
                    }
                    _this.maps['isProtectedOnChange'] = true;
                    tooltipArgs.options['textStyle']['color'] = _this.maps.themeStyle.tooltipFontColor
                        || tooltipArgs.options['textStyle']['color'];
                    _this.svgTooltip = new Tooltip({
                        enable: true,
                        header: '',
                        data: tooltipArgs.options['data'],
                        template: tooltipArgs.options['template'],
                        content: [currentData.toString()],
                        shapes: [],
                        location: tooltipArgs.options['location'],
                        palette: [markerFill],
                        areaBounds: _this.maps.mapAreaRect,
                        textStyle: tooltipArgs.options['textStyle'],
                        availableSize: _this.maps.availableSize,
                        fill: tooltipArgs.fill || _this.maps.themeStyle.tooltipFillColor,
                        blazorTemplate: { name: blazTooltipName, parent: option }
                    });
                    _this.svgTooltip.opacity = _this.maps.themeStyle.tooltipFillOpacity || _this.svgTooltip.opacity;
                    _this.svgTooltip.appendTo(tooltipEle);
                }
                else {
                    _this.removeTooltip();
                }
            });
            if (this.svgTooltip) {
                this.maps.trigger('tooltipRenderComplete', {
                    cancel: false, name: 'tooltipRenderComplete', maps: this.maps, options: tooltipOption, element: this.svgTooltip.element
                });
            }
        }
        else {
            this.removeTooltip();
        }
    };
    /**
     * To get content for the current toolitp
     */
    MapsTooltip.prototype.setTooltipContent = function (options, templateData) {
        var localData = extend({}, templateData, null, true);
        if (this.maps.format && !isNaN(Number(localData[options.valuePath]))) {
            localData[options.valuePath] = Internalize(this.maps, Number(localData[options.valuePath]));
        }
        else {
            localData = Object.keys(localData).length ? localData : undefined;
        }
        return localData;
    };
    MapsTooltip.prototype.formatValue = function (value, maps) {
        var formatValue;
        var formatFunction;
        if (maps.format && !isNaN(Number(value))) {
            formatFunction = maps.intl.getNumberFormat({ format: maps.format, useGrouping: maps.useGroupingSeparator });
            formatValue = formatFunction(Number(value));
        }
        else {
            formatValue = value;
        }
        return formatValue;
    };
    /*private template(tooltip: TooltipSettingsModel, location: MapLocation): number {
        location.y = (tooltip.template) ? location.y + 10 : location.y;
        return location.y;
    }*/
    MapsTooltip.prototype.formatter = function (format, data) {
        if (data === void 0) { data = {}; }
        var keys = Object.keys(data);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            format = format.split('${' + key + '}').join(this.formatValue(data[key], this.maps));
        }
        return format;
    };
    MapsTooltip.prototype.mouseUpHandler = function (e) {
        this.renderTooltip(e);
        if (this.maps.tooltipDisplayMode === 'MouseMove') {
            clearTimeout(this.clearTimeout);
            this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
        }
    };
    MapsTooltip.prototype.removeTooltip = function () {
        if (document.getElementsByClassName('EJ2-maps-Tooltip').length > 0) {
            remove(document.getElementsByClassName('EJ2-maps-Tooltip')[0]);
        }
    };
    /**
     * To bind events for tooltip module
     */
    MapsTooltip.prototype.addEventListener = function () {
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
    };
    MapsTooltip.prototype.removeEventListener = function () {
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
    };
    /**
     * Get module name.
     */
    MapsTooltip.prototype.getModuleName = function () {
        return 'MapsTooltip';
    };
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    MapsTooltip.prototype.destroy = function (maps) {
        this.removeEventListener();
    };
    return MapsTooltip;
}());

var __rest$8 = (undefined && undefined.__rest) || function (s, e) {
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
var Zoom = /** @__PURE__ @class */ (function () {
    function Zoom(maps) {
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
    Zoom.prototype.performZooming = function (position, newZoomFactor, type) {
        var map = this.maps;
        map.previousProjection = map.projectionType;
        var prevLevel = map.tileZoomLevel;
        var scale = map.previousScale = map.scale;
        var maxZoom = map.zoomSettings.maxZoom;
        var minZoom = map.zoomSettings.minZoom;
        newZoomFactor = (minZoom > newZoomFactor && type === 'ZoomIn') ? minZoom + 1 : newZoomFactor;
        var translatePoint = map.previousPoint = map.translatePoint;
        var prevTilePoint = map.tileTranslatePoint;
        if ((!map.isTileMap) && (type === 'ZoomIn' ? newZoomFactor >= minZoom && newZoomFactor <= maxZoom : newZoomFactor >= minZoom)) {
            var availSize = map.mapAreaRect;
            var minBounds = map.baseMapRectBounds['min'];
            var maxBounds = map.baseMapRectBounds['max'];
            var mapTotalWidth = Math.abs(minBounds['x'] - maxBounds['x']);
            var mapTotalHeight = Math.abs(minBounds['y'] - maxBounds['y']);
            var point = map.translatePoint;
            var translatePointX = point.x - (((availSize.width / scale) - (availSize.width / newZoomFactor)) / (availSize.width / position.x));
            var translatePointY = point.y - (((availSize.height / scale) - (availSize.height / newZoomFactor)) / (availSize.height / position.y));
            var currentHeight = Math.abs(map.baseMapRectBounds['max']['y'] - map.baseMapRectBounds['min']['y']) * newZoomFactor;
            translatePointX = (currentHeight < map.mapAreaRect.height) ? (availSize.x + ((-(minBounds['x'])) + ((availSize.width / 2) - (mapTotalWidth / 2)))) : translatePointX;
            translatePointY = (currentHeight < map.mapAreaRect.height) ? (availSize.y + ((-(minBounds['y'])) + ((availSize.height / 2) - (mapTotalHeight / 2)))) : translatePointY;
            map.translatePoint = new Point(translatePointX, translatePointY);
            map.scale = newZoomFactor;
            this.triggerZoomEvent(prevTilePoint, prevLevel);
        }
        else if ((map.isTileMap) && (newZoomFactor >= minZoom && newZoomFactor <= maxZoom)) {
            this.getTileTranslatePosition(prevLevel, newZoomFactor, position);
            map.tileZoomLevel = newZoomFactor;
            map.scale = Math.pow(2, newZoomFactor - 1);
            map.translatePoint.x = (map.tileTranslatePoint.x - (0.01 * map.scale)) / map.scale;
            map.translatePoint.y = (map.tileTranslatePoint.y - (0.01 * map.scale)) / map.scale;
            this.triggerZoomEvent(prevTilePoint, prevLevel);
            map.mapLayerPanel.generateTiles(newZoomFactor, map.tileTranslatePoint);
        }
        this.applyTransform();
        this.maps.zoomNotApplied = false;
    };
    Zoom.prototype.triggerZoomEvent = function (prevTilePoint, prevLevel) {
        var map = this.maps;
        var zoomArgs;
        if (!map.isTileMap) {
            zoomArgs = {
                cancel: false, name: 'zoom', type: map.scale > map.previousScale ? zoomIn : zoomOut, maps: !map.isBlazor ? map : null,
                tileTranslatePoint: {}, translatePoint: { previous: map.previousPoint, current: map.translatePoint },
                tileZoomLevel: {}, scale: { previous: map.previousScale, current: map.scale }
            };
        }
        else {
            zoomArgs = {
                cancel: false, name: 'zoom', type: map.tileZoomLevel > prevLevel ? zoomIn : zoomOut, maps: !map.isBlazor ? map : null,
                tileTranslatePoint: { previous: prevTilePoint, current: map.tileTranslatePoint }, translatePoint: { previous: map.previousPoint, current: map.translatePoint },
                tileZoomLevel: { previous: prevLevel, current: map.tileZoomLevel }, scale: { previous: map.previousScale, current: map.scale }
            };
        }
        map.trigger('zoom', zoomArgs);
    };
    Zoom.prototype.getTileTranslatePosition = function (prevLevel, currentLevel, position) {
        var map = this.maps;
        var tileDefaultSize = 256;
        var bounds = getElementByID(this.maps.element.id).getBoundingClientRect();
        var prevSize = Math.pow(2, prevLevel) * 256;
        var totalSize = Math.pow(2, currentLevel) * 256;
        var x = ((position.x - map.tileTranslatePoint.x) / prevSize) * 100;
        var y = ((position.y - map.tileTranslatePoint.y) / prevSize) * 100;
        map.tileTranslatePoint.x = (currentLevel === 1) ? (bounds.width / 2) - ((tileDefaultSize * 2) / 2) :
            position.x - ((x * totalSize) / 100);
        map.tileTranslatePoint.y = (currentLevel === 1) ? (bounds.height / 2) - ((tileDefaultSize * 2) / 2) :
            position.y - ((y * totalSize) / 100);
    };
    Zoom.prototype.performRectZooming = function () {
        var map = this.maps;
        var size = map.availableSize;
        var prevLevel = map.tileZoomLevel;
        var zoomRect = this.zoomingRect;
        if (zoomRect.height > 0 && zoomRect.width > 0) {
            var x = this.zoomingRect.x + (this.zoomingRect.width / 2);
            var y = this.zoomingRect.y + (this.zoomingRect.height / 2);
            var zoomCalculationFactor = void 0;
            if (!map.isTileMap) {
                var scale = map.previousScale = map.scale;
                zoomCalculationFactor = scale + Math.round((((size.width / zoomRect.width) + (size.height / zoomRect.height)) / 2));
                var translatePoint = map.previousPoint = map.translatePoint;
                var translatePointX = translatePoint.x - (((size.width / scale) - (size.width / zoomCalculationFactor)) / (size.width / x));
                var translatePointY = translatePoint.y - (((size.height / scale) - (size.height / zoomCalculationFactor)) / (size.height / y));
                map.translatePoint = new Point(translatePointX, translatePointY);
                map.scale = zoomCalculationFactor;
            }
            else {
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
            this.maps.zoomNotApplied = false;
            this.zoomingRect = null;
        }
    };
    Zoom.prototype.setInteraction = function (newInteraction) {
        this.lastScale = 1;
        this.interaction = newInteraction;
    };
    Zoom.prototype.updateInteraction = function () {
        if (this.fingers === 2) {
            this.setInteraction('zoom');
        }
        else {
            this.setInteraction(null);
        }
    };
    Zoom.prototype.performPinchZooming = function (e) {
        var map = this.maps;
        var prevLevel = map.tileZoomLevel;
        var availSize = map.mapAreaRect;
        map.previousScale = map.scale;
        map.previousPoint = map.translatePoint;
        var prevTilePoint = map.tileTranslatePoint;
        var scale = calculateScale(this.touchStartList, this.touchMoveList);
        var touchCenter = getTouchCenter(getTouches(this.touchMoveList, this.maps));
        var newScale = scale / this.lastScale;
        this.lastScale = scale;
        this.pinchFactor *= newScale;
        this.pinchFactor = Math.min(this.maps.zoomSettings.maxZoom, Math.max(this.pinchFactor, this.maps.zoomSettings.minZoom));
        var zoomCalculationFactor = this.pinchFactor;
        if (!map.isTileMap) {
            var minBounds = map.baseMapRectBounds['min'];
            var maxBounds = map.baseMapRectBounds['max'];
            var mapTotalWidth = Math.abs(minBounds['x'] - maxBounds['x']);
            var mapTotalHeight = Math.abs(minBounds['y'] - maxBounds['y']);
            var translatePoint = map.translatePoint;
            var currentHeight = Math.abs(map.baseMapRectBounds['max']['y'] - map.baseMapRectBounds['min']['y']) * zoomCalculationFactor;
            var translatePointX = translatePoint.x - (((availSize.width / map.scale) - (availSize.width / zoomCalculationFactor)) / (availSize.width / touchCenter.x));
            var translatePointY = translatePoint.y - (((availSize.height / map.scale) - (availSize.height / zoomCalculationFactor)) / (availSize.height / touchCenter.y));
            translatePointX = (currentHeight < map.mapAreaRect.height) ? (availSize.x + ((-(minBounds['x'])) + ((availSize.width / 2) - (mapTotalWidth / 2)))) : translatePointX;
            translatePointY = (currentHeight < map.mapAreaRect.height) ? (availSize.y + ((-(minBounds['y'])) + ((availSize.height / 2) - (mapTotalHeight / 2)))) : translatePointY;
            map.translatePoint = new Point(translatePointX, translatePointY);
            map.scale = zoomCalculationFactor;
            this.triggerZoomEvent(prevTilePoint, prevLevel);
        }
        else {
            var newTileFactor = zoomCalculationFactor;
            this.getTileTranslatePosition(prevLevel, newTileFactor, { x: touchCenter.x, y: touchCenter.y });
            map.tileZoomLevel = newTileFactor;
            map.translatePoint.x = (map.tileTranslatePoint.x - (0.5 * Math.pow(2, newTileFactor))) /
                (Math.pow(2, newTileFactor));
            map.translatePoint.y = (map.tileTranslatePoint.y - (0.5 * Math.pow(2, newTileFactor))) /
                (Math.pow(2, newTileFactor));
            map.scale = (Math.pow(2, newTileFactor));
            this.triggerZoomEvent(prevTilePoint, prevLevel);
            map.mapLayerPanel.generateTiles(newTileFactor, map.tileTranslatePoint);
        }
        this.applyTransform();
    };
    Zoom.prototype.drawZoomRectangle = function () {
        var map = this.maps;
        var down = this.mouseDownPoints;
        var move = this.mouseMovePoints;
        var x;
        var y;
        var width;
        var height;
        var border = { width: 1, color: '#009900' };
        width = Math.abs(move.x - down.x);
        height = Math.abs(move.y - down.y);
        x = ((move.x > down.x) ? down.x : down.x - width);
        y = ((move.y > down.y) ? down.y : down.y - height);
        var elementRect = getElementByID(map.element.id).getBoundingClientRect();
        if ((x > map.mapAreaRect.x && x < (map.mapAreaRect.x + map.mapAreaRect.width)) &&
            (y > map.mapAreaRect.y) && (y < map.mapAreaRect.y + map.mapAreaRect.height)) {
            this.zoomingRect = new Rect(x, y, width, height);
            var rectSVGObject = map.renderer.createSvg({
                id: map.element.id + '_Selection_Rect_Zooming',
                width: map.availableSize.width,
                height: map.availableSize.height,
            });
            var rectOption = new RectOption(map.element.id + '_ZoomRect', '#d3d3d3', border, 0.5, this.zoomingRect, 0, 0, '', '3');
            rectSVGObject.appendChild(map.renderer.drawRectangle(rectOption));
            getElementByID(map.element.id + '_Secondary_Element').appendChild(rectSVGObject);
        }
    };
    /**
     * To animate the zooming process
     */
    Zoom.prototype.animateTransform = function (element, animate$$1, x, y, scale) {
        var duration = this.currentLayer.animationDuration;
        if (!animate$$1 || duration === 0) {
            element.setAttribute('transform', 'scale(' + (scale) + ') translate( ' + x + ' ' + y + ' )');
            return;
        }
        zoomAnimate(element, 0, duration, new MapLocation(x, y), scale, this.maps.mapAreaRect, this.maps);
    };
    //tslint:disable:max-func-body-length
    Zoom.prototype.applyTransform = function (animate$$1) {
        var layerIndex;
        this.templateCount = 0;
        var markerStyle;
        var scale = this.maps.scale;
        var x = this.maps.translatePoint.x;
        var y = this.maps.translatePoint.y;
        this.maps.zoomShapeCollection = [];
        if (this.layerCollectionEle) {
            for (var i_1 = 0; i_1 < this.layerCollectionEle.childElementCount; i_1++) {
                var layerElement = this.layerCollectionEle.childNodes[i_1];
                if (layerElement.tagName === 'g') {
                    this.templateCount++;
                    this.index = layerElement.id.indexOf('_LayerIndex_') > -1 && parseFloat(layerElement.id.split('_LayerIndex_')[1].split('_')[0]);
                    this.currentLayer = this.maps.layersCollection[this.index];
                    var factor = this.maps.mapLayerPanel.calculateFactor(this.currentLayer);
                    for (var j = 0; j < layerElement.childElementCount; j++) {
                        var currentEle = layerElement.childNodes[j];
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
                            this.markerTranslates(currentEle.childNodes[0], factor, x, y, scale, 'Marker', layerElement, animate$$1);
                            currentEle = layerElement.childNodes[j];
                            if (!isNullOrUndefined(currentEle)) {
                                for (var k = 0; k < currentEle.childElementCount; k++) {
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
                                if (document.getElementById(this.maps.element.id + '_mapsTooltip') && this.maps.mapsTooltipModule.tooltipTargetID.indexOf('_MarkerIndex_')) {
                                    var mapsTooltip = this.maps.mapsTooltipModule;
                                    var tooltipElement = currentEle.querySelector('#' + mapsTooltip.tooltipTargetID);
                                    if (!isNullOrUndefined(tooltipElement)) {
                                        if (tooltipElement['style']['visibility'] === 'hidden') {
                                            removeElement(this.maps.element.id + '_mapsTooltip');
                                        }
                                        else {
                                            var x_1 = parseFloat(tooltipElement.getAttribute('transform').split('(')[1].split(')')[0].split(' ')[1]);
                                            var y_1 = parseFloat(tooltipElement.getAttribute('transform').split('(')[1].split(')')[0].split(' ')[2]);
                                            if (this.maps.isTileMap) {
                                                x_1 += +getElement(this.maps.element.id + '_tile_parent')['style']['left'].split('px')[0];
                                                y_1 += +getElement(this.maps.element.id + '_tile_parent')['style']['top'].split('px')[0];
                                            }
                                            mapsTooltip.svgTooltip.location.x = x_1;
                                            mapsTooltip.svgTooltip.location.y = y_1;
                                            mapsTooltip.svgTooltip.enableAnimation = false;
                                        }
                                    }
                                }
                            }
                        }
                        else if (currentEle.id.indexOf('_bubble_Group') > -1) {
                            var childElement = void 0;
                            for (var k = 0; k < currentEle.childElementCount; k++) {
                                childElement = currentEle.childNodes[k];
                                var bubbleTransform = childElement.getAttribute('transform');
                                layerIndex = parseFloat(childElement.id.split('_LayerIndex_')[1].split('_')[0]);
                                var bubleIndex = parseFloat(childElement.id.split('_BubbleIndex_')[1].split('_')[0]);
                                var dataIndex = parseFloat(childElement.id.split('_BubbleIndex_')[1].split('_')[2]);
                                for (var l = 0; l < this.maps.bubbleModule.bubbleCollection.length; l++) {
                                    var bubbleCollection = this.maps.bubbleModule.bubbleCollection[l];
                                    if (bubbleCollection['LayerIndex'] === layerIndex && bubbleCollection['BubbleIndex'] === bubleIndex &&
                                        bubbleCollection['DataIndex'] === dataIndex) {
                                        var centerX = bubbleCollection['center']['x'];
                                        var centerY = bubbleCollection['center']['y'];
                                        var currentX = ((centerX + x) * scale);
                                        var currentY = ((centerY + y) * scale);
                                        var duration = this.currentLayer.animationDuration;
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
                            for (var k = 0; k < currentEle.childElementCount; k++) {
                                if (currentEle.childNodes[k]['id'].indexOf('_LabelIndex_') > -1) {
                                    var labelIndex = parseFloat(currentEle.childNodes[k]['id'].split('_LabelIndex_')[1].split('_')[0]);
                                    this.zoomshapewidth = this.shapeZoomLocation[labelIndex].getBoundingClientRect();
                                    this.maps.zoomShapeCollection.push(this.zoomshapewidth);
                                    this.dataLabelTranslate(currentEle.childNodes[k], factor, x, y, scale, 'DataLabel', animate$$1);
                                    var dataLabel = this.maps.layers[this.index].dataLabelSettings;
                                    var border = dataLabel.border;
                                    if (k > 0 && border['width'] > 1) {
                                        if (currentEle.childNodes[k - 1]['id'].indexOf('_rectIndex_') > -1) {
                                            var labelX = ((this.maps.zoomLabelPositions[labelIndex]['location']['x'] + x) * scale);
                                            var labelY = ((this.maps.zoomLabelPositions[labelIndex]['location']['y'] + y) * scale);
                                            var zoomtext = currentEle.childNodes[k]['innerHTML'];
                                            var style = this.maps.layers[this.index].dataLabelSettings.textStyle;
                                            var zoomtextSize = measureText(zoomtext, style);
                                            var padding = 5;
                                            var rectElement = currentEle.childNodes[k - 1];
                                            var rectX = labelX - zoomtextSize['width'] / 2;
                                            var rectY = labelY - zoomtextSize['height'] / 2 - padding;
                                            rectElement['setAttribute']('x', rectX);
                                            rectElement['setAttribute']('y', rectY);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!isNullOrUndefined(this.currentLayer)) {
                if (!animate$$1 || this.currentLayer.animationDuration === 0) {
                    this.processTemplate(x, y, scale, this.maps);
                }
            }
        }
    };
    //tslint:disable
    Zoom.prototype.markerTranslates = function (element, factor, x, y, scale, type, layerElement, animate$$1) {
        var _this = this;
        if (animate$$1 === void 0) { animate$$1 = false; }
        var markerSVGObject;
        var templateFn;
        var markerCounts = 0;
        var markerTemplateCounts = 0;
        var layerIndex = parseInt((element ? element : layerElement).id.split('_LayerIndex_')[1].split('_')[0], 10);
        markerSVGObject = this.maps.renderer.createGroup({
            id: this.maps.element.id + '_Markers_Group',
            style: 'pointer-events: auto;'
        });
        if (document.getElementById(markerSVGObject.id)) {
            removeElement(markerSVGObject.id);
        }
        var mapsAreaRect = this.maps.mapAreaRect;
        var markerTemplateElements = createElement('div', {
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
        var currentLayers = this.maps.layersCollection[layerIndex];
        currentLayers.markerSettings.map(function (markerSettings, markerIndex) {
            var markerDatas = markerSettings.dataSource;
            Array.prototype.forEach.call(markerDatas, function (data, dataIndex) {
                _this.maps.markerNullCount = markerIndex >= 0 && dataIndex === 0 ? 0 : _this.maps.markerNullCount;
                var eventArgs = {
                    template: markerSettings.template, data: data, maps: _this.maps, marker: markerSettings,
                    cancel: false, name: markerRendering, fill: markerSettings.fill, colorValuePath: markerSettings.colorValuePath,
                    shapeValuePath: markerSettings.shapeValuePath, height: markerSettings.height,
                    width: markerSettings.width, imageUrl: markerSettings.imageUrl, shape: markerSettings.shape,
                    border: markerSettings.border
                };
                eventArgs = markerShapeChoose(eventArgs, data);
                eventArgs = markerColorChoose(eventArgs, data);
                if (_this.maps.isBlazor) {
                    var maps = eventArgs.maps, marker_1 = eventArgs.marker, blazorEventArgs = __rest$8(eventArgs, ["maps", "marker"]);
                    eventArgs = blazorEventArgs;
                }
                _this.maps.trigger('markerRendering', eventArgs, function (MarkerArgs) {
                    if (markerSettings.shapeValuePath !== eventArgs.shapeValuePath) {
                        eventArgs = markerShapeChoose(eventArgs, data);
                    }
                    if (markerSettings.colorValuePath !== eventArgs.colorValuePath) {
                        eventArgs = markerColorChoose(eventArgs, data);
                    }
                    var lati = !isNullOrUndefined(data['latitude']) ? parseFloat(data['latitude']) : null;
                    var long = !isNullOrUndefined(data['longitude']) ? parseFloat(data['longitude']) : null;
                    var offset = markerSettings.offset;
                    if (!eventArgs.cancel && markerSettings.visible && !isNullOrUndefined(long) && !isNullOrUndefined(lati)) {
                        var markerID = _this.maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_'
                            + markerIndex + '_dataIndex_' + dataIndex;
                        var location_1 = (_this.maps.isTileMap) ? convertTileLatLongToPoint(new MapLocation(long, lati), _this.maps.tileZoomLevel, _this.maps.tileTranslatePoint, true) : convertGeoToPoint(lati, long, factor, currentLayers, _this.maps);
                        var animate_1 = currentLayers.animationDuration !== 0 || isNullOrUndefined(_this.maps.zoomModule);
                        var transPoint = { x: x, y: y };
                        if (eventArgs.template) {
                            markerTemplateCounts++;
                            markerTemplate(eventArgs, templateFn, markerID, data, markerIndex, markerTemplateElements, location_1, scale, offset, _this.maps);
                        }
                        else {
                            markerCounts++;
                            marker(eventArgs, markerSettings, markerDatas, dataIndex, location_1, transPoint, markerID, offset, scale, _this.maps, markerSVGObject);
                        }
                    }
                    markerTemplateCounts += (eventArgs.cancel) ? 1 : 0;
                    markerCounts += (eventArgs.cancel) ? 1 : 0;
                    _this.maps.markerNullCount = (!isNullOrUndefined(lati) || !isNullOrUndefined(long))
                        ? _this.maps.markerNullCount : _this.maps.markerNullCount + 1;
                    var markerDataLength = markerDatas.length - _this.maps.markerNullCount;
                    if (markerSVGObject.childElementCount === (markerDataLength - markerTemplateCounts) && (type !== 'Template')) {
                        layerElement.appendChild(markerSVGObject);
                        if (currentLayers.markerClusterSettings.allowClustering) {
                            _this.maps.svgObject.appendChild(markerSVGObject);
                            _this.maps.element.appendChild(_this.maps.svgObject);
                            clusterTemplate(currentLayers, markerSVGObject, _this.maps, layerIndex, markerSVGObject, layerElement, true);
                        }
                    }
                    if (markerTemplateElements.childElementCount === (markerDatas.length - markerCounts) && getElementByID(_this.maps.element.id + '_Secondary_Element')) {
                        getElementByID(_this.maps.element.id + '_Secondary_Element').appendChild(markerTemplateElements);
                        if (currentLayers.markerClusterSettings.allowClustering) {
                            clusterTemplate(currentLayers, markerTemplateElements, _this.maps, layerIndex, markerSVGObject, layerElement, false);
                        }
                    }
                });
            });
        });
    };
    
    /**
     * To translate the layer template elements
     * @private
     */
    Zoom.prototype.processTemplate = function (x, y, scale, maps) {
        for (var i = 0; i < this.templateCount; i++) {
            this.currentLayer = maps.layersCollection[i];
            var factor = maps.mapLayerPanel.calculateFactor(this.currentLayer);
            var markerTemplateElement = getElementByID(maps.element.id + '_LayerIndex_' +
                i + '_Markers_Template_Group');
            var datalabelTemplateElemement = getElementByID(maps.element.id + '_LayerIndex_'
                + i + '_Label_Template_Group');
            if ((!isNullOrUndefined(markerTemplateElement)) && markerTemplateElement.childElementCount > 0) {
                for (var k = 0; k < markerTemplateElement.childElementCount; k++) {
                    this.markerTranslate(markerTemplateElement.childNodes[k], factor, x, y, scale, 'Template');
                }
            }
            if ((!isNullOrUndefined(datalabelTemplateElemement)) && datalabelTemplateElemement.childElementCount > 0) {
                for (var k = 0; k < datalabelTemplateElemement.childElementCount; k++) {
                    this.dataLabelTranslate(datalabelTemplateElemement.childNodes[k], factor, x, y, scale, 'Template');
                }
            }
        }
    };
    //tslint:disable:max-func-body-length
    Zoom.prototype.dataLabelTranslate = function (element, factor, x, y, scale, type, animate$$1) {
        if (animate$$1 === void 0) { animate$$1 = false; }
        var labelCollection = this.maps.dataLabelModule.dataLabelCollections;
        var zoomelement = element.getBoundingClientRect();
        var text;
        var trimmedLable;
        var style = this.maps.layers[this.index].dataLabelSettings.textStyle;
        var zoomtext;
        var zoomtextSize;
        var zoomtrimLabel;
        var labelPath = this.maps.layers[this.index].dataLabelSettings.labelPath;
        var layerIndex = parseFloat(element.id.split('_LayerIndex_')[1].split('_')[0]);
        var shapeIndex = parseFloat(element.id.split('_shapeIndex_')[1].split('_')[0]);
        var labelIndex;
        if (element.id.indexOf('_LabelIndex_') > -1) {
            labelIndex = parseFloat(element.id.split('_LabelIndex_')[1].split('_')[0]);
        }
        var duration = this.currentLayer.animationDuration;
        for (var l = 0; l < labelCollection.length; l++) {
            var label = labelCollection[l];
            if (label['layerIndex'] === layerIndex && label['shapeIndex'] === shapeIndex
                && label['labelIndex'] === labelIndex) {
                var labelX = label['location']['x'];
                var labelY = label['location']['y'];
                if (type === 'Template') {
                    var layerEle = getElementByID(this.maps.element.id + '_Layer_Collections');
                    labelX = ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - labelX)) * scale);
                    labelY = ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - labelY)) * scale);
                    var templateOffset = element.getBoundingClientRect();
                    var layerOffset = layerEle.getBoundingClientRect();
                    var elementOffset = element.parentElement.getBoundingClientRect();
                    var x_2 = ((labelX) + (layerOffset.left - elementOffset.left) - (templateOffset.width / 2));
                    var y_2 = ((labelY) + (layerOffset.top - elementOffset.top) - (templateOffset.height / 2));
                    element.style.left = x_2 + 'px';
                    element.style.top = y_2 + 'px';
                }
                else {
                    labelX = ((labelX + x) * scale);
                    labelY = ((labelY + y) * scale);
                    zoomtext = label['dataLabelText'];
                    zoomtextSize = measureText(zoomtext, style);
                    var start = labelY - zoomtextSize['height'] / 4;
                    var end = labelY + zoomtextSize['height'] / 4;
                    var xpositionEnds = labelX + zoomtextSize['width'] / 2;
                    var xpositionStart = labelX - zoomtextSize['width'] / 2;
                    var textLocations = { rightWidth: xpositionEnds, leftWidth: xpositionStart, heightTop: start, heightBottom: end };
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
                        for (var m = 0; m < this.intersect.length; m++) {
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
                        for (var j = 0; j < this.intersect.length; j++) {
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
                                        var width = this.intersect[j]['rightWidth'] - textLocations['leftWidth'];
                                        var difference = width - (textLocations['rightWidth'] - textLocations['leftWidth']);
                                        text = !isNullOrUndefined(text) ? text : zoomtext;
                                        trimmedLable = textTrim(difference, text, style);
                                        element.innerHTML = trimmedLable;
                                        break;
                                    }
                                    if (textLocations['leftWidth'] < this.intersect[j]['leftWidth']) {
                                        var width = textLocations['rightWidth'] - this.intersect[j]['leftWidth'];
                                        var difference = Math.abs(width - (textLocations['rightWidth'] - textLocations['leftWidth']));
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
    };
    Zoom.prototype.markerTranslate = function (element, factor, x, y, scale, type, animate$$1) {
        if (animate$$1 === void 0) { animate$$1 = false; }
        var layerIndex = parseInt(element.id.split('_LayerIndex_')[1].split('_')[0], 10);
        var markerIndex = parseInt(element.id.split('_MarkerIndex_')[1].split('_')[0], 10);
        var dataIndex = parseInt(element.id.split('_dataIndex_')[1].split('_')[0], 10);
        var layer = this.maps.layersCollection[layerIndex];
        var marker$$1 = layer.markerSettings[markerIndex];
        if (!isNullOrUndefined(marker$$1) && !isNullOrUndefined(marker$$1.dataSource) && !isNullOrUndefined(marker$$1.dataSource[dataIndex])) {
            var lng = parseFloat(marker$$1.dataSource[dataIndex]['longitude']);
            var lat = parseFloat(marker$$1.dataSource[dataIndex]['latitude']);
            var duration = this.currentLayer.animationDuration;
            var location_2 = (this.maps.isTileMap) ? convertTileLatLongToPoint(new Point(lng, lat), this.maps.tileZoomLevel, this.maps.tileTranslatePoint, true) : convertGeoToPoint(lat, lng, factor, layer, this.maps);
            if (this.maps.isTileMap) {
                if (type === 'Template') {
                    var templateOffset = element.getBoundingClientRect();
                    element.style.left = ((location_2.x - (templateOffset.width / 2)) + marker$$1.offset.x) + 'px';
                    element.style.top = ((location_2.y - (templateOffset.height / 2)) + marker$$1.offset.y) + 'px';
                    if (this.maps.layers[this.maps.baseLayerIndex].layerType === 'GoogleStaticMap') {
                        var staticMapOffset = getElementByID(this.maps.element.id + '_StaticGoogleMap').getBoundingClientRect();
                        var staticMapOffsetWidth = 640;
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
                    location_2.x += marker$$1.offset.x;
                    location_2.y += marker$$1.offset.y;
                    element.setAttribute('transform', 'translate( ' + location_2.x + ' ' + location_2.y + ' )');
                }
            }
            else {
                if (type === 'Template') {
                    location_2.x = ((Math.abs(this.maps.baseMapRectBounds['min']['x'] - location_2.x)) * scale);
                    location_2.y = ((Math.abs(this.maps.baseMapRectBounds['min']['y'] - location_2.y)) * scale);
                    var layerOffset = getElementByID(this.maps.element.id + '_Layer_Collections').getBoundingClientRect();
                    var elementOffset = element.parentElement.getBoundingClientRect();
                    element.style.left = (((location_2.x) + (layerOffset.left - elementOffset.left)) + marker$$1.offset.x) + 'px';
                    element.style.top = (((location_2.y) + (layerOffset.top - elementOffset.top)) + marker$$1.offset.y) + 'px';
                    element.style.transform = 'translate(-50%, -50%)';
                }
                else {
                    location_2.x = (((location_2.x + x) * scale) + marker$$1.offset.x);
                    location_2.y = (((location_2.y + y) * scale) + marker$$1.offset.y);
                    if (!animate$$1 || duration === 0) {
                        element.setAttribute('transform', 'translate( ' + location_2.x + ' ' + location_2.y + ' )');
                    }
                    else {
                        smoothTranslate(element, 0, duration, location_2);
                    }
                }
            }
        }
    };
    Zoom.prototype.panning = function (direction, xDifference, yDifference) {
        var map = this.maps;
        var panArgs;
        var down = this.mouseDownPoints;
        var move = this.mouseMovePoints;
        var scale = map.scale;
        var translatePoint = map.translatePoint;
        var prevTilePoint = map.tileTranslatePoint;
        var x;
        var y;
        xDifference = !isNullOrUndefined(xDifference) ? xDifference : (down.x - move.x);
        yDifference = !isNullOrUndefined(yDifference) ? yDifference : (down.y - move.y);
        if (!map.isTileMap) {
            x = translatePoint.x - xDifference / scale;
            y = translatePoint.y - yDifference / scale;
            var layerRect = getElementByID(map.element.id + '_Layer_Collections').getBoundingClientRect();
            var elementRect = getElementByID(map.element.id + '_svg').getBoundingClientRect();
            var panningXDirection = ((xDifference < 0 ? layerRect.left <= (elementRect.left + map.mapAreaRect.x) :
                ((layerRect.left + layerRect.width) >= (elementRect.left + elementRect.width) + map.mapAreaRect.x + map.margin.left)));
            var panningYDirection = ((yDifference < 0 ? layerRect.top <= (elementRect.top + map.mapAreaRect.y) :
                ((layerRect.top + layerRect.height + map.margin.top) >= (elementRect.top + elementRect.height))));
            panArgs = {
                cancel: false, name: pan, maps: !map.isBlazor ? map : null,
                tileTranslatePoint: {}, translatePoint: { previous: translatePoint, current: new Point(x, y) },
                scale: map.scale, tileZoomLevel: map.tileZoomLevel
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
            map.translatePoint.x = (map.tileTranslatePoint.x - xDifference) / map.scale;
            map.translatePoint.y = (map.tileTranslatePoint.y - yDifference) / map.scale;
            panArgs = {
                cancel: false, name: pan, maps: !map.isBlazor ? map : null,
                tileTranslatePoint: { previous: prevTilePoint, current: map.tileTranslatePoint },
                translatePoint: { previous: translatePoint, current: map.translatePoint }, scale: map.scale,
                tileZoomLevel: map.tileZoomLevel
            };
            map.trigger(pan, panArgs);
            map.mapLayerPanel.generateTiles(map.tileZoomLevel, map.tileTranslatePoint);
            this.applyTransform();
        }
        map.zoomTranslatePoint = map.translatePoint;
        this.mouseDownPoints = this.mouseMovePoints;
        this.maps.zoomNotApplied = false;
        this.isSingleClick = false;
    };
    Zoom.prototype.toAlignSublayer = function () {
        this.maps.translatePoint.x = !isNullOrUndefined(this.distanceX) ? (this.maps.translatePoint.x -
            (this.distanceX / this.maps.scale)) : this.maps.translatePoint.x;
        this.maps.translatePoint.y = !isNullOrUndefined(this.distanceY) ? this.maps.translatePoint.y -
            (this.distanceY / this.maps.scale) : this.maps.translatePoint.y;
        this.applyTransform(false);
    };
    Zoom.prototype.toolBarZooming = function (zoomFactor, type) {
        var map = this.maps;
        var prevLevel = map.tileZoomLevel;
        var scale = map.previousScale = map.scale;
        map.mapScaleValue = zoomFactor;
        var maxZoom = map.zoomSettings.maxZoom;
        var minZoom = map.zoomSettings.minZoom;
        var size = map.mapAreaRect;
        var translatePoint = map.previousPoint = map.translatePoint;
        var prevTilePoint = map.tileTranslatePoint;
        map.previousProjection = map.projectionType;
        zoomFactor = (type === 'ZoomOut') ? (Math.round(zoomFactor) === 1 ? 1 : zoomFactor) : zoomFactor;
        zoomFactor = (minZoom > zoomFactor && type === 'ZoomIn') ? minZoom + 1 : zoomFactor;
        if ((!map.isTileMap) && (type === 'ZoomIn' ? zoomFactor >= minZoom && zoomFactor <= maxZoom : zoomFactor >= minZoom)) {
            var min = map.baseMapRectBounds['min'];
            var max = map.baseMapRectBounds['max'];
            var mapWidth = Math.abs(max['x'] - min['x']);
            var mapHeight = Math.abs(min['y'] - max['y']);
            var translatePointX = translatePoint.x - (((size.width / scale) - (size.width / zoomFactor)) / 2);
            var translatePointY = translatePoint.y - (((size.height / scale) - (size.height / zoomFactor)) / 2);
            var currentHeight = Math.abs(map.baseMapRectBounds['max']['y'] - map.baseMapRectBounds['min']['y']) * zoomFactor;
            translatePointX = (currentHeight < map.mapAreaRect.height) ? (size.x + ((-(min['x'])) + ((size.width / 2) - (mapWidth / 2))))
                : translatePointX;
            translatePointY = (currentHeight < map.mapAreaRect.height) ? (size.y + ((-(min['y'])) + ((size.height / 2) - (mapHeight / 2))))
                : translatePointY;
            map.translatePoint = new Point(translatePointX, translatePointY);
            map.zoomTranslatePoint = map.translatePoint;
            map.scale = zoomFactor;
            this.triggerZoomEvent(prevTilePoint, prevLevel);
        }
        else if ((map.isTileMap) && (zoomFactor >= minZoom && zoomFactor <= maxZoom)) {
            var tileZoomFactor = zoomFactor;
            map.scale = Math.pow(2, tileZoomFactor - 1);
            map.tileZoomLevel = tileZoomFactor;
            var position = { x: map.availableSize.width / 2, y: map.availableSize.height / 2 };
            this.getTileTranslatePosition(prevLevel, tileZoomFactor, position);
            map.translatePoint.x = (map.tileTranslatePoint.x - (0.01 * map.scale)) / map.scale;
            map.translatePoint.y = (map.tileTranslatePoint.y - (0.01 * map.scale)) / map.scale;
            this.triggerZoomEvent(prevTilePoint, prevLevel);
            map.mapLayerPanel.generateTiles(tileZoomFactor, map.tileTranslatePoint);
        }
        this.applyTransform(true);
        this.maps.zoomNotApplied = false;
    };
    /* tslint:disable:max-func-body-length */
    Zoom.prototype.createZoomingToolbars = function () {
        var map = this.maps;
        this.toolBarGroup = map.renderer.createGroup({
            id: map.element.id + '_Zooming_KitCollection',
            opacity: 0.3,
        });
        var kitHeight = 16;
        var kitWidth = 16;
        var xSpacing = 15;
        var ySpacing = 15;
        var padding = 20;
        var orientation = map.zoomSettings.toolBarOrientation;
        var toolbarsCollection = map.zoomSettings.toolbars;
        var shadowElement = '<filter id="chart_shadow" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/>';
        shadowElement += '<feOffset dx="-3" dy="4" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="1"/>';
        shadowElement += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        var toolBarLength = map.zoomSettings.toolbars.length;
        var toolWidth = (map.zoomSettings.toolBarOrientation === 'Horizontal') ? (toolBarLength * kitWidth) + (toolBarLength * padding) : (kitWidth * 2);
        var toolHeight = (map.zoomSettings.toolBarOrientation === 'Horizontal') ? (kitHeight * 2) : (toolBarLength * kitHeight) + (toolBarLength * padding);
        this.toolBarGroup.appendChild(map.renderer.drawRectangle(new RectOption(map.element.id + '_Zooming_Rect', 'transparent', { color: 'transparent', width: 1 }, 1, new Rect(0, 0, toolWidth, toolHeight), 0, 0)));
        var defElement = map.renderer.createDefs();
        defElement.innerHTML = shadowElement;
        this.toolBarGroup.appendChild(defElement);
        var outerElement = map.renderer.drawRectangle(new RectOption(map.element.id + '_Zooming_Rect', 'transparent', { color: 'transparent', width: 1 }, 0.1, new Rect(0, 0, toolWidth, toolHeight), 0, 0));
        outerElement.setAttribute('filter', 'url(#chart_shadow)');
        this.toolBarGroup.appendChild(outerElement);
        for (var i = 0; i < toolbarsCollection.length; i++) {
            var toolbar_1 = toolbarsCollection[i];
            this.currentToolbarEle = map.renderer.createGroup({
                id: map.element.id + '_Zooming_ToolBar_' + toolbar_1 + '_Group',
                transform: 'translate( ' + xSpacing + ' ' + ySpacing + ' ) '
            });
            this.currentToolbarEle.setAttribute('class', 'e-maps-toolbar');
            var fill = 'transparent';
            var direction = '';
            switch (toolbar_1.toLowerCase()) {
                case 'zoom':
                    var fillColor_1 = void 0;
                    var strokeColor = void 0;
                    direction = 'M0.001,14.629L1.372,16l4.571-4.571v-0.685l0.228-0.274c1.051,0.868,2.423,1.417,3.885,1.417c3.291,0,';
                    direction += '5.943-2.651,5.943-5.943S13.395,0,10.103,0S4.16,2.651,4.16,5.943c0,1.508,0.503,2.834,1.417,3.885l-0.274,0.228H4.571';
                    direction = direction + 'L0.001,14.629L0.001,14.629z M5.943,5.943c0-2.285,1.828-4.114,4.114-4.114s4.114,1.828,4.114,';
                    if (this.maps.zoomSettings.enablePanning) {
                        fillColor_1 = fill;
                        strokeColor = this.maps.themeStyle.zoomFillColor;
                    }
                    else {
                        fillColor_1 = this.selectionColor;
                        strokeColor = this.selectionColor;
                    }
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(map.element.id + '_Zooming_ToolBar_' + toolbar_1, fillColor_1, 1, strokeColor, 1, null, direction + '4.114s-1.828,4.114-4.114,4.114S5.943,8.229,5.943,5.943z')));
                    this.zoomElements = this.currentToolbarEle;
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
                case 'zoomin':
                    direction = 'M 8, 0 L 8, 16 M 0, 8 L 16, 8';
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(map.element.id + '_Zooming_ToolBar_' + toolbar_1 + '_Path', fill, 3, this.maps.themeStyle.zoomFillColor, 1, null, direction)));
                    this.zoomInElements = this.currentToolbarEle;
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
                case 'zoomout':
                    direction = 'M 0, 8 L 16, 8';
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(map.element.id + '_Zooming_ToolBar_' + toolbar_1, fill, 3, this.maps.themeStyle.zoomFillColor, 1, null, direction)));
                    this.zoomOutElements = this.currentToolbarEle;
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
                case 'pan':
                    var color = void 0;
                    direction = 'M5,3h2.3L7.275,5.875h1.4L8.65,3H11L8,0L5,3z M3,11V8.7l2.875,0.025v-1.4L3,7.35V5L0,8L3,';
                    direction += '11z M11,13H8.7l0.025-2.875h-1.4L7.35,13H5l3,3L11,13z M13,5v2.3l-2.875-0.025v1.4L13,8.65V11l3-3L13,5z';
                    if (!this.maps.zoomSettings.enablePanning) {
                        color = "#737373";
                        this.currentToolbarEle.setAttribute('class', '');
                    }
                    else {
                        color = this.selectionColor;
                    }
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(map.element.id + '_Zooming_ToolBar_' + toolbar_1, color, 1, color, 1, null, direction)));
                    this.panColor = color;
                    this.panElements = this.currentToolbarEle;
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
                case 'reset':
                    direction = 'M12.364,8h-2.182l2.909,3.25L16,8h-2.182c0-3.575-2.618-6.5-5.818-6.5c-1.128,0-2.218,0.366-3.091,';
                    direction += '1.016l1.055,1.178C6.581,3.328,7.272,3.125,8,3.125C10.4,3.125,12.363,5.319,12.364,8L12.364,8z M11.091,';
                    direction += '13.484l-1.055-1.178C9.419,12.672,8.728,12.875,8,12.875c-2.4,0-4.364-2.194-4.364-4.875h2.182L2.909,4.75L0,8h2.182c0,';
                    this.currentToolbarEle.appendChild(map.renderer.drawPath(new PathOption(map.element.id + '_Zooming_ToolBar_' + toolbar_1, this.fillColor, null, this.maps.themeStyle.zoomFillColor, 1, null, direction + '3.575,2.618,6.5,5.818,6.5C9.128,14.5,10.219,14.134,11.091,13.484L11.091,13.484z')));
                    this.wireEvents(this.currentToolbarEle, this.performToolBarAction);
                    break;
            }
            this.currentToolbarEle.appendChild(map.renderer.drawCircle(new CircleOption(map.element.id + '_Zooming_ToolBar_' + toolbar_1 + '_Rect', fill, { color: this.maps.themeStyle.zoomFillColor, width: 1 }, 1, 8, 8, 16, '')));
            xSpacing = (orientation === 'Horizontal') ? (xSpacing + (kitWidth + padding)) : xSpacing;
            ySpacing = (orientation === 'Horizontal') ? ySpacing : (ySpacing + (kitHeight + padding));
            this.toolBarGroup.appendChild(this.currentToolbarEle);
        }
    };
    Zoom.prototype.performToolBarAction = function (e) {
        var target = e.target;
        e.stopImmediatePropagation();
        var isTouch = e.pointerType === 'touch' || e.pointerType === '2' || (e.type.indexOf('touch') > -1);
        var toolbar = target.id.split('_Zooming_ToolBar_')[1].split('_')[0];
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
    };
    /**
     *
     * @private
     */
    Zoom.prototype.performZoomingByToolBar = function (type) {
        var map = this.maps;
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
                this.toolBarZooming(1, 'ZoomOut');
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
    };
    Zoom.prototype.panningStyle = function (toolbar) {
        var svg = getElementByID(this.maps.element.id + '_svg');
        if (toolbar === 'pan' || this.isPanning) {
            svg.setAttribute('class', 'e-maps-panning');
        }
        else {
            svg.setAttribute('class', '');
        }
    };
    Zoom.prototype.applySelection = function (elements, color) {
        if (!elements) {
            return;
        }
        var childElement;
        for (var i = 0; i < elements.childElementCount; i++) {
            childElement = elements.childNodes[i];
            if (childElement.tagName !== 'circle') {
                childElement.setAttribute('fill', color);
                childElement.setAttribute('stroke', color);
            }
        }
    };
    Zoom.prototype.showTooltip = function (e) {
        var text = e.target.id.split('_Zooming_ToolBar_')[1].split('_')[0];
        if (!this.isTouch) {
            createTooltip('EJ2_Map_Toolbar_Tip', this.maps.getLocalizedLabel(text), (e.pageY + 10), (e.pageX + 10), '10px');
        }
    };
    Zoom.prototype.removeTooltip = function () {
        if (getElementByID('EJ2_Map_Toolbar_Tip')) {
            remove(getElementByID('EJ2_Map_Toolbar_Tip'));
        }
    };
    Zoom.prototype.alignToolBar = function () {
        var map = this.maps;
        var padding = 10;
        var element = createElement('div', { id: map.element.id + '_ToolBar', styles: 'position:absolute;z-index:2' });
        var rectSVGObject = map.renderer.createSvg({
            id: map.element.id + '_Zooming_ToolBar', width: 10, height: 10,
        });
        rectSVGObject.appendChild(this.toolBarGroup);
        element.appendChild(rectSVGObject);
        if (getElementByID(map.element.id + '_Secondary_Element')) {
            getElementByID(map.element.id + '_Secondary_Element').appendChild(element);
        }
        var toolBarSize = this.toolBarGroup.getBoundingClientRect();
        rectSVGObject.setAttribute('height', (toolBarSize.height + padding / 2).toString());
        rectSVGObject.setAttribute('width', (toolBarSize.width + padding / 2).toString());
        var size = map.mapAreaRect;
        var x = 0;
        var y = 0;
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
        var color = this.maps.zoomSettings.highlightColor;
        var css = ' .e-maps-toolbar:hover > circle { stroke:' + color + '; } .e-maps-toolbar:hover > path { fill: ' + color + ' ;  stroke: ' + color + '; }' +
            '.e-maps-toolbar:hover { cursor: pointer; } .e-maps-cursor-disable:hover { cursor: not-allowed; } .e-maps-panning:hover { cursor: pointer; } ' +
            '.e-maps-popup-close { display: block; opacity: 0; }';
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        element.appendChild(style);
    };
    /**
     * To bind events.
     * @return {void}
     * @private
     */
    Zoom.prototype.wireEvents = function (element, process) {
        EventHandler.add(element, Browser.touchStartEvent, process, this);
        EventHandler.add(element, 'mouseover', this.showTooltip, this);
        EventHandler.add(element, 'mouseout', this.removeTooltip, this);
    };
    Zoom.prototype.mapMouseWheel = function (e) {
        if (this.maps.zoomSettings.enable && this.maps.zoomSettings.mouseWheelZoom) {
            var map = this.maps;
            var size = map.availableSize;
            var position = this.getMousePosition(e.pageX, e.pageY);
            var prevLevel = map.tileZoomLevel;
            var prevScale = map.scale;
            var delta = 1;
            var staticMaxZoomLevel = 22; // google map maximum zoom level value
            var value = (map.isTileMap) ? prevLevel : prevScale;
            if (((position.x > map.mapAreaRect.x) && (position.x < (map.mapAreaRect.x + map.mapAreaRect.width))) &&
                (position.y > map.mapAreaRect.y) && position.y < (map.mapAreaRect.y + map.mapAreaRect.height)) {
                e.preventDefault();
                var direction = (this.browserName === 'mozilla' && !this.isPointer) ?
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
    };
    Zoom.prototype.doubleClick = function (e) {
        var pageX = e.pageX;
        var pageY = e.pageY;
        var target = e.target;
        if (this.maps.zoomSettings.enable && this.maps.zoomSettings.doubleClickZoom
            && !(e.target['id'].indexOf('_Zooming_') > -1)) {
            var position = this.getMousePosition(pageX, pageY);
            var map = this.maps;
            var size = map.availableSize;
            var prevLevel = map.tileZoomLevel;
            var prevScale = map.scale;
            map.mapScaleValue = map.mapScaleValue + 1;
            var value = (map.isTileMap) ? prevLevel : prevScale;
            if (((position.x > map.mapAreaRect.x) && (position.x < (map.mapAreaRect.x + map.mapAreaRect.width))) &&
                (position.y > map.mapAreaRect.y) && position.y < (map.mapAreaRect.y + map.mapAreaRect.height)) {
                this.performZooming(position, (value + 1), 'ZoomIn');
            }
        }
    };
    Zoom.prototype.mouseDownHandler = function (e) {
        var pageX;
        var pageY;
        var target;
        var touches = null;
        var element = e.target;
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
    };
    Zoom.prototype.mouseMoveHandler = function (e) {
        var pageX;
        var pageY;
        var map = this.maps;
        var target;
        var touches = null;
        var zoom = this.maps.zoomSettings;
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
        var targetId = e.target['id'];
        var targetEle = e.target;
        if (zoom.enable && this.isPanning) {
            e.preventDefault();
            this.maps.element.style.cursor = 'pointer';
            this.mouseMoveLatLong = { x: pageX, y: pageY };
            if ((this.mouseDownLatLong['x'] !== this.mouseMoveLatLong['x']) && (this.mouseDownLatLong['y'] !== this.mouseMoveLatLong['y'])) {
                if (this.maps.zoomSettings.enablePanning) {
                    this.panning('None', null, null);
                }
                this.mouseDownLatLong['x'] = pageX;
                this.mouseDownLatLong['y'] = pageY;
            }
        }
        if (this.isTouch ? (touches.length === 1 && this.rectZoomingStart) : this.rectZoomingStart) {
            e.preventDefault();
            this.drawZoomRectangle();
        }
    };
    Zoom.prototype.mouseUpHandler = function (e) {
        var map = this.maps;
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
        var zoomRectElement = getElementByID(this.maps.element.id + '_Selection_Rect_Zooming');
        if (zoomRectElement && this.maps.zoomSettings.enable) {
            remove(zoomRectElement);
            this.performRectZooming();
        }
        this.mouseMoveLatLong = { x: 0, y: 0 };
        this.mouseDownLatLong = { x: 0, y: 0 };
    };
    Zoom.prototype.mouseCancelHandler = function (e) {
        this.isPanning = false;
        this.isTouch = false;
        this.rectZoomingStart = false;
        var zoomRectElement = getElementByID(this.maps.element.id + '_Selection_Rect_Zooming');
        if (zoomRectElement && this.maps.zoomSettings.enable) {
            remove(zoomRectElement);
            this.performRectZooming();
        }
    };
    /**
     * To handle the click event for maps.
     * @param e
     */
    Zoom.prototype.click = function (e) {
        var map = this.maps;
        if ((map.markerModule && map.markerModule.sameMarkerData.length > 0) ||
            (e.target['id'].indexOf('MarkerIndex') > -1 && e.target['id'].indexOf('cluster') == -1)) {
            return null;
        }
        if (this.isSingleClick && map.zoomSettings.zoomOnClick && !(e.target['id'].indexOf('_Zooming_') > -1) && !map.zoomSettings.doubleClickZoom
            && (this.zoomColor !== this.selectionColor)) {
            var pageX = e.pageX;
            var pageY = e.pageY;
            var position = this.getMousePosition(pageX, pageY);
            var prevLevel = map.tileZoomLevel;
            var prevScale = map.scale;
            map.mapScaleValue = map.mapScaleValue + 1;
            var value = (map.isTileMap) ? prevLevel : prevScale;
            if (((position.x > map.mapAreaRect.x) && (position.x < (map.mapAreaRect.x + map.mapAreaRect.width))) &&
                (position.y > map.mapAreaRect.y) && position.y < (map.mapAreaRect.y + map.mapAreaRect.height)) {
                this.performZooming(position, (value + 1), 'ZoomIn');
            }
        }
    };
    Zoom.prototype.getMousePosition = function (pageX, pageY) {
        var map = this.maps;
        var elementRect = map.element.getBoundingClientRect();
        var pageXOffset = map.element.ownerDocument.defaultView.pageXOffset;
        var pageYOffset = map.element.ownerDocument.defaultView.pageYOffset;
        var clientTop = map.element.ownerDocument.documentElement.clientTop;
        var clientLeft = map.element.ownerDocument.documentElement.clientLeft;
        var positionX = elementRect.left + pageXOffset - clientLeft;
        var positionY = elementRect.top + pageYOffset - clientTop;
        return new Point((pageX - positionX), (pageY - positionY));
    };
    Zoom.prototype.addEventListener = function () {
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
    };
    Zoom.prototype.removeEventListener = function () {
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
    };
    /**
     * Get module name.
     */
    Zoom.prototype.getModuleName = function () {
        return 'Zoom';
    };
    /**
     * To destroy the zoom.
     * @return {void}
     * @private
     */
    Zoom.prototype.destroy = function (maps) {
        this.removeEventListener();
        /**
         * Destroy method performed here
         */
    };
    return Zoom;
}());

/**
 * export all modules from maps component
 */

/**
 * exporting all modules from maps index
 */

export { Maps, load, loaded, click, rightClick, doubleClick, resize, tooltipRender, shapeSelected, shapeHighlight, mousemove, mouseup, mousedown, layerRendering, shapeRendering, markerRendering, markerClusterRendering, markerClick, markerClusterClick, markerMouseMove, markerClusterMouseMove, dataLabelRendering, bubbleRendering, bubbleClick, bubbleMouseMove, animationComplete, legendRendering, annotationRendering, itemSelection, itemHighlight, beforePrint, zoomIn, zoomOut, pan, Annotation, Arrow, Font, Border, CenterPosition, TooltipSettings, Margin, ConnectorLineSettings, MarkerClusterSettings, MarkerClusterData, ColorMappingSettings, InitialShapeSelectionSettings, SelectionSettings, HighlightSettings, NavigationLineSettings, BubbleSettings, CommonTitleSettings, SubTitleSettings, TitleSettings, ZoomSettings, ToggleLegendSettings, LegendSettings, DataLabelSettings, ShapeSettings, MarkerBase, MarkerSettings, LayerSettings, Tile, MapsAreaSettings, Size, stringToNumber, calculateSize, createSvg, getMousePosition, degreesToRadians, radiansToDegrees, convertGeoToPoint, convertTileLatLongToPoint, xToCoordinate, yToCoordinate, aitoff, roundTo, sinci, acos, calculateBound, Point, MinMax, GeoLocation, measureText, TextOption, PathOption, ColorValue, RectOption, CircleOption, PolygonOption, PolylineOption, LineOption, Line, MapLocation, Rect, PatternOptions, renderTextElement, convertElement, convertElementFromLabel, drawSymbols, markerColorChoose, markerShapeChoose, clusterTemplate, mergeSeparateCluster, clusterSeparate, marker, markerTemplate, maintainSelection, maintainStyleClass, appendShape, drawCircle, drawRectangle, drawPath, drawPolygon, drawPolyline, drawLine, calculateShapes, drawDiamond, drawTriangle, drawCross, drawHorizontalLine, drawVerticalLine, drawStar, drawBalloon, drawPattern, getFieldData, checkShapeDataFields, checkPropertyPath, filter, getRatioOfBubble, findMidPointOfPolygon, isCustomPath, textTrim, findPosition, removeElement, getTranslate, getZoomTranslate, getElementByID, Internalize, getTemplateFunction, getElement, getShapeData, triggerShapeEvent, getElementsByClassName, querySelector, getTargetElement, createStyle, customizeStyle, triggerItemSelectionEvent, removeClass, elementAnimate, timeout, showTooltip, wordWrap, createTooltip, drawSymbol, renderLegendShape, getElementOffset, changeBorderWidth, changeNavaigationLineWidth, targetTouches, calculateScale, getDistance, getTouches, getTouchCenter, sum, zoomAnimate, animate, MapAjax, smoothTranslate, compareZoomFactor, calculateZoomLevel, LayerPanel, Bubble, BingMap, Marker, ColorMapping, DataLabel, NavigationLine, Legend, Highlight, Selection, MapsTooltip, Zoom, Annotations };
//# sourceMappingURL=ej2-maps.es5.js.map
