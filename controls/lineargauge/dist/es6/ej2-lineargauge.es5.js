import { Animation, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, NotifyPropertyChanges, Property, compile, createElement, isBlazor, isNullOrUndefined, merge, print, remove, resetBlazorTemplate, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { SvgRenderer, Tooltip } from '@syncfusion/ej2-svg-base';
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
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Options for customizing the fonts.
 */
var Font = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Font, _super);
    function Font() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property('16px')
    ], Font.prototype, "size", void 0);
    __decorate$1([
        Property('')
    ], Font.prototype, "color", void 0);
    __decorate$1([
        Property('Segoe UI')
    ], Font.prototype, "fontFamily", void 0);
    __decorate$1([
        Property('Regular')
    ], Font.prototype, "fontWeight", void 0);
    __decorate$1([
        Property('Normal')
    ], Font.prototype, "fontStyle", void 0);
    __decorate$1([
        Property(1)
    ], Font.prototype, "opacity", void 0);
    return Font;
}(ChildProperty));
/**
 * Configures the margin of linear gauge.
 */
var Margin = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Margin, _super);
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
/**
 * Configures the border in linear gauge.
 */
var Border = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Border, _super);
    function Border() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(null)
    ], Border.prototype, "color", void 0);
    __decorate$1([
        Property(0)
    ], Border.prototype, "width", void 0);
    return Border;
}(ChildProperty));
/**
 * Options for customizing the annotation.
 */
var Annotation = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Annotation, _super);
    function Annotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property('')
    ], Annotation.prototype, "content", void 0);
    __decorate$1([
        Property(0)
    ], Annotation.prototype, "x", void 0);
    __decorate$1([
        Property(0)
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
    __decorate$1([
        Complex({ size: '12px', color: null }, Font)
    ], Annotation.prototype, "font", void 0);
    __decorate$1([
        Property(null)
    ], Annotation.prototype, "axisIndex", void 0);
    __decorate$1([
        Property(null)
    ], Annotation.prototype, "axisValue", void 0);
    return Annotation;
}(ChildProperty));
/**
 * Options for customizing the container of linear gauge.
 */
var Container = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Container, _super);
    function Container() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property('Normal')
    ], Container.prototype, "type", void 0);
    __decorate$1([
        Property(0)
    ], Container.prototype, "height", void 0);
    __decorate$1([
        Property(0)
    ], Container.prototype, "width", void 0);
    __decorate$1([
        Property(10)
    ], Container.prototype, "roundedCornerRadius", void 0);
    __decorate$1([
        Property('transparent')
    ], Container.prototype, "backgroundColor", void 0);
    __decorate$1([
        Complex({ width: 1, color: '#bfbfbf' }, Border)
    ], Container.prototype, "border", void 0);
    __decorate$1([
        Property(0)
    ], Container.prototype, "offset", void 0);
    return Container;
}(ChildProperty));
/**
 * Options for customizing the tooltip in linear gauge.
 */
var TooltipSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(TooltipSettings, _super);
    function TooltipSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(false)
    ], TooltipSettings.prototype, "enable", void 0);
    __decorate$1([
        Property('')
    ], TooltipSettings.prototype, "fill", void 0);
    __decorate$1([
        Complex({ color: '', size: '13px' }, Font)
    ], TooltipSettings.prototype, "textStyle", void 0);
    __decorate$1([
        Property(null)
    ], TooltipSettings.prototype, "format", void 0);
    __decorate$1([
        Property(null)
    ], TooltipSettings.prototype, "template", void 0);
    __decorate$1([
        Property(true)
    ], TooltipSettings.prototype, "enableAnimation", void 0);
    __decorate$1([
        Complex({}, Border)
    ], TooltipSettings.prototype, "border", void 0);
    return TooltipSettings;
}(ChildProperty));

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
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/** Options for customizing the axis line. */
var Line = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Line, _super);
    function Line() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Property('')
    ], Line.prototype, "dashArray", void 0);
    __decorate$2([
        Property(null)
    ], Line.prototype, "height", void 0);
    __decorate$2([
        Property(2)
    ], Line.prototype, "width", void 0);
    __decorate$2([
        Property(null)
    ], Line.prototype, "color", void 0);
    __decorate$2([
        Property(0)
    ], Line.prototype, "offset", void 0);
    return Line;
}(ChildProperty));
/**
 * Options for customizing the axis labels appearance.
 */
var Label = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Label, _super);
    function Label() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Complex({ size: '12px', color: null }, Font)
    ], Label.prototype, "font", void 0);
    __decorate$2([
        Property(false)
    ], Label.prototype, "useRangeColor", void 0);
    __decorate$2([
        Property('')
    ], Label.prototype, "format", void 0);
    __decorate$2([
        Property(0)
    ], Label.prototype, "offset", void 0);
    __decorate$2([
        Property('Auto')
    ], Label.prototype, "position", void 0);
    return Label;
}(ChildProperty));
/**
 * Options for customizing the ranges of an axis.
 */
var Range = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Range, _super);
    function Range() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Property(0)
    ], Range.prototype, "start", void 0);
    __decorate$2([
        Property(0)
    ], Range.prototype, "end", void 0);
    __decorate$2([
        Property('Outside')
    ], Range.prototype, "position", void 0);
    __decorate$2([
        Property('')
    ], Range.prototype, "color", void 0);
    __decorate$2([
        Property(10)
    ], Range.prototype, "startWidth", void 0);
    __decorate$2([
        Property(10)
    ], Range.prototype, "endWidth", void 0);
    __decorate$2([
        Property(0)
    ], Range.prototype, "offset", void 0);
    __decorate$2([
        Complex({ color: '#000000', width: 0 }, Border)
    ], Range.prototype, "border", void 0);
    return Range;
}(ChildProperty));
/**
 * Options for customizing the minor tick lines.
 */
var Tick = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Tick, _super);
    function Tick() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Property(20)
    ], Tick.prototype, "height", void 0);
    __decorate$2([
        Property(2)
    ], Tick.prototype, "width", void 0);
    __decorate$2([
        Property(null)
    ], Tick.prototype, "interval", void 0);
    __decorate$2([
        Property(null)
    ], Tick.prototype, "color", void 0);
    __decorate$2([
        Property(null)
    ], Tick.prototype, "offset", void 0);
    __decorate$2([
        Property('Auto')
    ], Tick.prototype, "position", void 0);
    return Tick;
}(ChildProperty));
/**
 * Options for customizing the pointers of an axis.
 */
var Pointer = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Pointer, _super);
    function Pointer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.animationComplete = true;
        /** @private */
        _this.currentValue = null;
        return _this;
    }
    __decorate$2([
        Property('Marker')
    ], Pointer.prototype, "type", void 0);
    __decorate$2([
        Property(null)
    ], Pointer.prototype, "value", void 0);
    __decorate$2([
        Property('InvertedTriangle')
    ], Pointer.prototype, "markerType", void 0);
    __decorate$2([
        Property(null)
    ], Pointer.prototype, "imageUrl", void 0);
    __decorate$2([
        Complex({ color: '#808080' }, Border)
    ], Pointer.prototype, "border", void 0);
    __decorate$2([
        Property(10)
    ], Pointer.prototype, "roundedCornerRadius", void 0);
    __decorate$2([
        Property('Far')
    ], Pointer.prototype, "placement", void 0);
    __decorate$2([
        Property(20)
    ], Pointer.prototype, "height", void 0);
    __decorate$2([
        Property(20)
    ], Pointer.prototype, "width", void 0);
    __decorate$2([
        Property(null)
    ], Pointer.prototype, "color", void 0);
    __decorate$2([
        Property(1)
    ], Pointer.prototype, "opacity", void 0);
    __decorate$2([
        Property(0)
    ], Pointer.prototype, "animationDuration", void 0);
    __decorate$2([
        Property(false)
    ], Pointer.prototype, "enableDrag", void 0);
    __decorate$2([
        Property(0)
    ], Pointer.prototype, "offset", void 0);
    __decorate$2([
        Property('Auto')
    ], Pointer.prototype, "position", void 0);
    __decorate$2([
        Property(null)
    ], Pointer.prototype, "description", void 0);
    return Pointer;
}(ChildProperty));
/**
 * Options for customizing the axis of a gauge.
 */
var Axis = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Axis, _super);
    function Axis() {
        /**
         * Specifies the minimum value of an axis.
         * @default 0
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.visibleLabels = [];
        return _this;
    }
    __decorate$2([
        Property(0)
    ], Axis.prototype, "minimum", void 0);
    __decorate$2([
        Property(100)
    ], Axis.prototype, "maximum", void 0);
    __decorate$2([
        Property(false)
    ], Axis.prototype, "isInversed", void 0);
    __decorate$2([
        Property(false)
    ], Axis.prototype, "showLastLabel", void 0);
    __decorate$2([
        Property(false)
    ], Axis.prototype, "opposedPosition", void 0);
    __decorate$2([
        Complex({}, Line)
    ], Axis.prototype, "line", void 0);
    __decorate$2([
        Collection([{}], Range)
    ], Axis.prototype, "ranges", void 0);
    __decorate$2([
        Collection([{}], Pointer)
    ], Axis.prototype, "pointers", void 0);
    __decorate$2([
        Complex({ width: 2, height: 20 }, Tick)
    ], Axis.prototype, "majorTicks", void 0);
    __decorate$2([
        Complex({ width: 1, height: 10 }, Tick)
    ], Axis.prototype, "minorTicks", void 0);
    __decorate$2([
        Complex({}, Label)
    ], Axis.prototype, "labelStyle", void 0);
    return Axis;
}(ChildProperty));

/**
 * Specifies the linear gauge constant value
 */
/** @private */
var loaded = 'loaded';
/** @private */
var load = 'load';
/** @private */
var animationComplete = 'animationComplete';
/** @private */
var axisLabelRender = 'axisLabelRender';
/** @private */
var tooltipRender = 'tooltipRender';
/** @private */
var annotationRender = 'annotationRender';
/** @private */
var gaugeMouseMove = 'gaugeMouseMove';
/** @private */
var gaugeMouseLeave = 'gaugeMouseLeave';
/** @private */
var gaugeMouseDown = 'gaugeMouseDown';
/** @private */
var gaugeMouseUp = 'gaugeMouseUp';
/** @private */
var valueChange = 'valueChange';
/** @private */
var resized = 'resized';
/** @private */
var beforePrint = 'beforePrint';

var __extends$3 = (undefined && undefined.__extends) || (function () {
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
/**
 * Specifies Linear-Gauge Helper methods
 */
/** @private */
function stringToNumber(value, containerSize) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
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
    var htmlObject = document.getElementById('gauge-measuretext');
    var size;
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'gauge-measuretext' });
        document.body.appendChild(htmlObject);
    }
    htmlObject.innerHTML = text;
    htmlObject.style.position = 'absolute';
    htmlObject.style.fontSize = font.size;
    htmlObject.style.fontWeight = font.fontWeight;
    htmlObject.style.fontStyle = font.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily;
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.top = '-100';
    htmlObject.style.left = '0';
    htmlObject.style.whiteSpace = 'nowrap';
    size = new Size(htmlObject.clientWidth, htmlObject.clientHeight);
    //remove(htmlObject);
    return size;
}
/** @private */
function withInRange(value, start, end, max, min, type) {
    var withIn;
    if (type === 'pointer') {
        withIn = (((value <= max) && (value >= min)));
    }
    else {
        withIn = (start != null && (start <= max) && (start >= min)) && (end != null && (end <= max) && (end >= min));
    }
    return withIn;
}
function convertPixelToValue(parentElement, pointerElement, orientation, axis, type, location) {
    var elementRect = parentElement.getBoundingClientRect();
    var pointerRect = pointerElement.getBoundingClientRect();
    var height = (pointerElement.id.indexOf('MarkerPointer') > -1) ? (pointerRect.height / 2) :
        (!axis.isInversed) ? 0 : pointerRect.height;
    var width = (pointerElement.id.indexOf('MarkerPointer') > -1) ? (pointerRect.width / 2) :
        (!axis.isInversed) ? pointerRect.width : 0;
    var size = new Size(axis.lineBounds.width, axis.lineBounds.height);
    var y = (type === 'drag') ? (location.y - axis.lineBounds.y) :
        ((pointerRect.top + height) - elementRect.top - axis.lineBounds.y);
    var x = (type === 'drag') ? (location.x - axis.lineBounds.x) :
        ((pointerRect.left + width) - elementRect.left - axis.lineBounds.x);
    var newSize = (orientation === 'Vertical') ? size.height : size.width;
    var divideVal = (orientation === 'Vertical') ? y : x;
    var value = (orientation === 'Vertical') ? (axis.isInversed) ? (divideVal / newSize) :
        (1 - (divideVal / newSize)) : (axis.isInversed) ? (1 - (divideVal / newSize)) : (divideVal / newSize);
    value = value * (axis.visibleRange.delta) + axis.visibleRange.min;
    return value;
}
function getPathToRect(path, size, parentElement) {
    var tempDiv = document.getElementById('gauge_path');
    if (tempDiv === null) {
        tempDiv = createElement('text', { id: 'gauge_path' });
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '0px';
        tempDiv.style.left = '0px';
        parentElement.appendChild(tempDiv);
    }
    var render = new SvgRenderer('id');
    var svg = render.createSvg({ id: 'box_path', width: size.width, height: size.height });
    svg.appendChild(path);
    tempDiv.appendChild(svg);
    var svgRect = path.getBBox();
    remove(tempDiv);
    return svgRect;
}
/** @private */
function getElement(id) {
    return document.getElementById(id);
}
/** @private */
function removeElement(id) {
    var element = getElement(id);
    if (element) {
        remove(element);
    }
}
/** @private */
function isPointerDrag(axes) {
    var pointerEnable = false;
    axes.map(function (axis, index) {
        axis.pointers.map(function (pointer, index) {
            if (pointer.enableDrag) {
                pointerEnable = true;
            }
        });
    });
    return pointerEnable;
}
/** @private */
function valueToCoefficient(value, axis, orientation, range) {
    var result = (value - range.min) / range.delta;
    result = (orientation === 'Vertical') ? (!axis.isInversed) ? (1 - result) : result : (!axis.isInversed) ? result : (1 - result);
    return result;
}
function getFontStyle(font) {
    var style = '';
    style = 'font-size:' + font.size +
        '; font-style:' + font.fontStyle + '; font-weight:' + font.fontWeight +
        '; font-family:' + font.fontFamily + ';opacity:' + font.opacity +
        '; color:' + font.color + ';';
    return style;
}
function textFormatter(format, data, gauge) {
    if (isNullOrUndefined(format)) {
        return null;
    }
    var keys = Object.keys(data);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        format = format.split('{' + key + '}').join(formatValue(data[key], gauge).toString());
    }
    return format;
}
function formatValue(value, gauge) {
    var formatValue;
    var formatFunction;
    if (gauge.format && !isNaN(Number(value))) {
        formatFunction = gauge.intl.getNumberFormat({ format: gauge.format, useGrouping: gauge.useGroupingSeparator });
        formatValue = formatFunction(Number(value));
    }
    else {
        formatValue = value;
    }
    return formatValue !== null ? formatValue : '';
}
/** @private */
function getLabelFormat(format) {
    var customLabelFormat = format && format.match('{value}') !== null;
    var skeleton = customLabelFormat ? '' : format;
    return skeleton;
}
/** @private */
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
var VisibleRange = /** @__PURE__ @class */ (function () {
    function VisibleRange(min, max, interval, delta) {
        this.min = min;
        this.max = max;
        this.interval = interval;
        this.delta = delta;
    }
    return VisibleRange;
}());
/**
 * Internal use of gauge location
 */
var GaugeLocation = /** @__PURE__ @class */ (function () {
    function GaugeLocation(x, y) {
        this.x = x;
        this.y = y;
    }
    return GaugeLocation;
}());
/**
 * Internal class size for height and width
 */
var Size = /** @__PURE__ @class */ (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    return Size;
}());
/** @private */
var Rect = /** @__PURE__ @class */ (function () {
    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return Rect;
}());
/** @private */
var CustomizeOption = /** @__PURE__ @class */ (function () {
    function CustomizeOption(id) {
        this.id = id;
    }
    return CustomizeOption;
}());
/** @private */
var PathOption = /** @__PURE__ @class */ (function (_super) {
    __extends$3(PathOption, _super);
    function PathOption(id, fill, width, color, opacity, dashArray, d, transform) {
        if (transform === void 0) { transform = ''; }
        var _this = _super.call(this, id) || this;
        _this.opacity = opacity;
        _this.fill = fill;
        _this.stroke = color;
        _this['stroke-width'] = width;
        _this['stroke-dasharray'] = dashArray;
        _this.d = d;
        _this.transform = transform;
        return _this;
    }
    return PathOption;
}(CustomizeOption));
/** @private */
var RectOption = /** @__PURE__ @class */ (function () {
    function RectOption(id, fill, border, opacity, rect, transform, dashArray) {
        this.opacity = opacity;
        this.id = id;
        this.y = rect.y;
        this.x = rect.x;
        this.fill = fill;
        this.stroke = border.color;
        this['stroke-width'] = border.width;
        this.height = rect.height;
        this.width = rect.width;
    }
    return RectOption;
}());
/** @private */
var TextOption = /** @__PURE__ @class */ (function (_super) {
    __extends$3(TextOption, _super);
    function TextOption(id, x, y, anchor, text, transform, baseLine) {
        if (transform === void 0) { transform = ''; }
        var _this = _super.call(this, id) || this;
        _this.transform = '';
        _this.baseLine = 'auto';
        _this.x = x;
        _this.y = y;
        _this.anchor = anchor;
        _this.text = text;
        _this.transform = transform;
        _this.baseLine = baseLine;
        return _this;
    }
    return TextOption;
}(CustomizeOption));
/** @private */
var VisibleLabels = /** @__PURE__ @class */ (function () {
    function VisibleLabels(text, value, size) {
        this.text = text;
        this.value = value;
        this.size = size;
    }
    return VisibleLabels;
}());
/** @private */
var Align = /** @__PURE__ @class */ (function () {
    function Align(axisIndex, align) {
        this.align = align;
        this.axisIndex = axisIndex;
    }
    return Align;
}());
/** @private */
function textElement(options, font, color, parent) {
    var renderOptions = {};
    var htmlObject;
    var renderer = new SvgRenderer('');
    var style = 'fill:' + color + '; font-size:' + font.size +
        '; font-style:' + font.fontStyle + ' ; font-weight:' + font.fontWeight + '; font-family:' +
        font.fontFamily + '; text-anchor:' + options.anchor + '; transform:' + options.transform +
        '; opacity:' + font.opacity + '; dominant-baseline:' + options.baseLine + ';';
    renderOptions = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'style': style
    };
    htmlObject = renderer.createText(renderOptions, options.text);
    parent.appendChild(htmlObject);
    return htmlObject;
}
function calculateNiceInterval(min, max, size, orientation) {
    var delta = max - min;
    var currentInterval;
    var intervalDivs = [10, 5, 2, 1];
    var desiredIntervalsCount = getActualDesiredIntervalsCount(size, orientation);
    var niceInterval = delta / desiredIntervalsCount;
    var minInterval = Math.pow(10, Math.floor(Math.log(niceInterval) / Math.log(10)));
    for (var _i = 0, intervalDivs_1 = intervalDivs; _i < intervalDivs_1.length; _i++) {
        var interval = intervalDivs_1[_i];
        currentInterval = minInterval * interval;
        if (desiredIntervalsCount < (delta / currentInterval)) {
            break;
        }
        niceInterval = currentInterval;
    }
    return niceInterval;
}
function getActualDesiredIntervalsCount(size, orientation) {
    var maximumLabels = 5;
    var desiredIntervalsCount = (orientation === 'Horizontal' ? 0.533 : 1) * maximumLabels;
    desiredIntervalsCount = Math.max((size * (desiredIntervalsCount / 100)), 1);
    return desiredIntervalsCount;
}
/** @private */
function getPointer(target, gauge) {
    var split = [];
    var axisIndex;
    var radix = 10;
    var pointIndex;
    var axis;
    var pointer;
    split = target.id.replace(gauge.element.id, '').split('_');
    axisIndex = parseInt(split[2], radix);
    pointIndex = parseInt(split[4], radix);
    axis = gauge.axes[axisIndex];
    pointer = gauge.axes[axisIndex].pointers[pointIndex];
    return { axis: axis, axisIndex: axisIndex, pointer: pointer, pointerIndex: pointIndex };
}
/** @private */
function getRangeColor(value, ranges) {
    var rangeColor = null;
    ranges.forEach(function (range, index) {
        if (value >= range.start && range.end >= value) {
            rangeColor = range.interior;
        }
    });
    return rangeColor;
}
/** @private */
function getRangePalette() {
    var palette = ['#ff5985', '#ffb133', '#fcde0b', '#27d5ff', '#50c917'];
    return palette;
}
/** @private */
function calculateShapes(location, shape, size, url, options, orientation, axis, pointer) {
    var path;
    var width = size.width;
    var height = size.height;
    var locX = location.x;
    var locY = location.y;
    var radius;
    switch (shape) {
        case 'Circle':
            radius = ((width + height) / 4);
            locX = (orientation === 'Vertical') ? (!axis.opposedPosition) ? (pointer.placement !== 'Far') ? locX - radius : locX + radius :
                pointer.placement === 'Near' ? locX - radius : locX + radius : locX;
            locY = (orientation === 'Vertical') ? locY : (!axis.opposedPosition) ? (pointer.placement === 'Far') ?
                locY + radius : locY - radius : (pointer.placement === 'Near') ? locY - radius : locY + radius;
            merge(options, { 'r': radius, 'cx': locX, 'cy': locY });
            break;
        case 'Diamond':
        case 'Rectangle':
            locX = (orientation === 'Horizontal') ? ((locX - (width / 2))) : ((!axis.opposedPosition && pointer.placement !== 'Far') ||
                (axis.opposedPosition && pointer.placement === 'Near')) ? locX - width : locX;
            locY = (orientation === 'Vertical') ? locY : (!axis.opposedPosition) ?
                (pointer.placement === 'Far') ? locY + (height / 2) : locY - (height / 2) :
                (pointer.placement === 'Near') ? locY - (height / 2) : locY + (height / 2);
            if (shape === 'Diamond') {
                path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + ' ' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                    'L' + ' ' + (locX + width) + ' ' + locY + ' ' +
                    'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + locX + ' ' + locY + ' z';
            }
            else {
                path = 'M' + ' ' + locX + ' ' + (locY - (height / 2)) + ' ' +
                    'L' + ' ' + (locX + width) + ' ' + (locY - (height / 2)) + ' ' +
                    'L' + ' ' + (locX + width) + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + locX + ' ' + (locY - (height / 2)) + ' z';
            }
            merge(options, { 'd': path });
            break;
        case 'Triangle':
            if (orientation === 'Vertical') {
                path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + (locX - width) + ' ' + (locY - (height / 2)) +
                    'L' + (locX - width) + ' ' + (locY + (height / 2)) + ' Z';
            }
            else {
                path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + (locX + (width / 2)) + ' ' + (locY - height) +
                    'L' + (locX - (width / 2)) + ' ' + (locY - height) + ' Z';
            }
            merge(options, { 'd': path });
            break;
        case 'InvertedTriangle':
            if (orientation === 'Vertical') {
                path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + (locX + width) + ' ' + (locY - (height / 2)) +
                    'L' + (locX + width) + ' ' + (locY + (height / 2)) + ' Z';
            }
            else {
                path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + (locX + (width / 2)) + ' ' + (locY + height) +
                    'L' + (locX - (width / 2)) + ' ' + (locY + height) + ' Z';
            }
            merge(options, { 'd': path });
            break;
        case 'Arrow':
            if (orientation === 'Vertical') {
                path = 'M' + ' ' + locX + ' ' + locY + ' ' + 'L' + (locX - (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                    'L' + (locX - (width / 2)) + ' ' + ((locY - (height / 2)) + (height / 4)) + ' ' + 'L' + (locX - width) + ' '
                    + ((locY - (height / 2)) + (height / 4)) + ' ' + 'L' + (locX - width) + ' ' + ((locY + (height / 2)) -
                    (height / 4)) + ' ' + 'L' + (locX - (width / 2)) + ' ' + ((locY + (height / 2)) - (height / 4)) + ' ' +
                    'L' + (locX - (width / 2)) + ' ' + (locY + height / 2) + 'z';
            }
            else {
                path = 'M' + ' ' + locX + ' ' + locY + ' ' + 'L' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                    'L' + ((locX + (width / 2)) - (width / 4)) + ' ' + (locY - (height / 2)) + ' ' + 'L' + ((locX + (width / 2)) -
                    (width / 4)) + ' ' + (locY - height) + ' ' + 'L' + ((locX - (width / 2)) + (width / 4)) + ' ' + (locY - height) +
                    ' ' + 'L' + ((locX - (width / 2)) + (width / 4)) + ' ' + (locY - (height / 2)) + ' ' + 'L' + (locX - (width / 2))
                    + ' ' + (locY - (height / 2)) + 'z';
            }
            merge(options, { 'd': path });
            break;
        case 'InvertedArrow':
            if (orientation === 'Vertical') {
                path = 'M' + ' ' + locX + ' ' + locY + 'L' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                    'L' + (locX + (width / 2)) + ' ' + ((locY - (height / 2)) + (height / 4)) + ' ' + 'L' + (locX + width) + ' '
                    + ((locY - (height / 2)) + (height / 4)) + ' ' + 'L' + (locX + width) + ' ' + ((locY + (height / 2)) - (height / 4))
                    + ' ' + 'L' + (locX + (width / 2)) + ' ' + ((locY + (height / 2)) - (height / 4)) + ' ' +
                    'L' + (locX + (width / 2)) + ' ' + (locY + height / 2) + 'z';
            }
            else {
                path = 'M' + ' ' + locX + ' ' + locY + ' ' + 'L' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ((locX + (width / 2)) - (width / 4)) + ' ' + (locY + (height / 2)) + ' ' + 'L' + ((locX + (width / 2)) -
                    (width / 4)) + ' ' + (locY + height) + ' ' + 'L' + ((locX - (width / 2)) + (width / 4)) + ' ' + (locY + height)
                    + ' ' + 'L' + ((locX - (width / 2)) + (width / 4)) + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + (locX - (width / 2)) + ' ' + (locY + (height / 2)) + 'z';
            }
            merge(options, { 'd': path });
            break;
        case 'Image':
            merge(options, { 'href': url, 'height': height, 'width': width, x: locX - (width / 2), y: locY - (height / 2) });
            break;
    }
    return options;
}
/** @private */
function getBox(location, boxName, orientation, size, type, containerWidth, axis, cornerRadius) {
    var path = ' ';
    var radius = cornerRadius;
    var x1;
    var y1;
    var rectWidth;
    var rectHeight;
    var bottomRadius;
    var topRadius;
    switch (boxName) {
        case 'RoundedRectangle':
            x1 = location.x;
            y1 = location.y;
            rectWidth = location.width;
            rectHeight = location.height;
            path = 'M' + ' ' + x1 + ' ' + (radius + y1) + ' Q ' + x1 + ' ' + y1 + ' ' + (x1 + radius) + ' ' + y1 + ' ';
            path += 'L' + ' ' + (x1 + rectWidth - radius) + ' ' + y1 + ' Q ' + (x1 + rectWidth) + ' ' + y1 + ' '
                + (x1 + rectWidth) + ' ' + (y1 + radius) + ' ';
            path += 'L ' + (x1 + rectWidth) + ' ' + (y1 + rectHeight - radius) + ' Q ' + (x1 + rectWidth) + ' ' + (y1 + rectHeight)
                + ' ' + (x1 + rectWidth - radius) + ' ' + (y1 + rectHeight) + ' ';
            path += ' L ' + (x1 + radius) + ' ' + (y1 + rectHeight) + ' Q ' + x1 + ' ' + (y1 + rectHeight)
                + ' ' + x1 + ' ' + (y1 + rectHeight - radius) + ' ';
            path += 'L' + ' ' + x1 + ' ' + (radius + y1) + ' ' + 'z';
            break;
        case 'Thermometer':
            var width = (orientation === 'Vertical') ? location.width : location.height;
            bottomRadius = width + ((width / 2) / Math.PI);
            topRadius = width / 2;
            if (orientation === 'Vertical') {
                var addValue = ((containerWidth + ((containerWidth / 2) / Math.PI)) - bottomRadius);
                var y1_1 = (type === 'bar') ? location.y + addValue : location.y;
                var locY = (type === 'bar') ? location.y + (topRadius - (topRadius / Math.PI)) : location.y;
                var locHeight = location.height;
                path = 'M' + location.x + ' ' + (y1_1 + locHeight) +
                    ' A ' + bottomRadius + ' ' + bottomRadius + ', 0, 1, 0, ' + (location.x + location.width) + ' ' + (y1_1 + locHeight) +
                    ' L ' + (location.x + location.width) + ' ' + locY +
                    ' A ' + topRadius + ' ' + topRadius + ', 0, 1, 0, ' + location.x + ' ' + locY + ' z ';
            }
            else {
                var x1_1 = (type === 'bar' && !axis.isInversed) ?
                    location.x - ((containerWidth + ((containerWidth / 2) / Math.PI)) - bottomRadius) : location.x;
                var locWidth = (type === 'bar') ? (location.width - (topRadius - ((topRadius / Math.PI)))) : location.width;
                path = 'M' + x1_1 + ' ' + (location.y) +
                    ' A ' + bottomRadius + ' ' + bottomRadius + ', 0, 1, 0, ' + x1_1 + ' ' + (location.y + location.height) +
                    ' L ' + ((type === 'bar' ? location.x : x1_1) + locWidth) + ' ' + (location.y + location.height) +
                    ' A ' + topRadius + ' ' + topRadius + ', 0, 1, 0, ' +
                    ((type === 'bar' ? location.x : x1_1) + locWidth) + ' ' + (location.y) + ' z ';
            }
            break;
    }
    return path;
}

/**
 * @private
 * To calculate the overall axis bounds for gauge.
 */
var AxisLayoutPanel = /** @__PURE__ @class */ (function () {
    function AxisLayoutPanel(gauge) {
        this.gauge = gauge;
    }
    /**
     * To calculate the axis bounds
     */
    AxisLayoutPanel.prototype.calculateAxesBounds = function () {
        var axis;
        var bounds;
        this.gauge.nearSizes = [];
        this.gauge.farSizes = [];
        var x;
        var y;
        var width;
        var height;
        var axisPadding = 8;
        var containerRect = this.gauge.containerBounds;
        this.checkThermometer();
        for (var i = 0; i < this.gauge.axes.length; i++) {
            axis = this.gauge.axes[i];
            axis.checkAlign = new Align(i, ((!axis.opposedPosition) ? 'Near' : 'Far'));
            (!axis.opposedPosition) ? this.gauge.nearSizes.push(1) : this.gauge.farSizes.push(1);
            this.calculateLineBounds(axis, i);
            this.calculateTickBounds(axis, i);
            this.calculateLabelBounds(axis, i);
            if (axis.pointers.length > 0) {
                this.calculatePointerBounds(axis, i);
            }
            if (axis.ranges.length > 0) {
                this.calculateRangesBounds(axis, i);
            }
            bounds = axis.labelBounds;
            if (this.gauge.orientation === 'Vertical') {
                x = (!axis.opposedPosition) ? bounds.x - axisPadding : axis.lineBounds.x;
                y = axis.lineBounds.y;
                height = axis.lineBounds.height;
                width = Math.abs((!axis.opposedPosition) ? (axis.lineBounds.x - x) : ((bounds.x + bounds.width + axisPadding) - x));
            }
            else {
                y = (!axis.opposedPosition) ? bounds.y - bounds.height - axisPadding : axis.lineBounds.y;
                x = axis.lineBounds.x;
                width = axis.lineBounds.width;
                height = Math.abs((!axis.opposedPosition) ? Math.abs(axis.lineBounds.y - y) : (bounds.y + axisPadding) - y);
            }
            axis.bounds = new Rect(x, y, width, height);
        }
    };
    /**
     * Calculate axis line bounds
     * @param axis
     * @param axisIndex
     */
    AxisLayoutPanel.prototype.calculateLineBounds = function (axis, axisIndex) {
        var x;
        var y;
        var width;
        var height;
        var index;
        var prevAxis;
        var lineHeight = axis.line.height;
        var orientation = this.gauge.orientation;
        var containerRect = this.gauge.containerBounds;
        lineHeight = (axis.line.width > 0) ? lineHeight : null;
        if (orientation === 'Vertical') {
            y = (isNullOrUndefined(lineHeight)) ? containerRect.y :
                containerRect.y + ((containerRect.height / 2) - (lineHeight / 2));
            width = axis.line.width;
            height = (isNullOrUndefined(lineHeight)) ? containerRect.height : lineHeight;
        }
        else {
            x = (isNullOrUndefined(lineHeight)) ? containerRect.x :
                containerRect.x + ((containerRect.width / 2) - (lineHeight / 2));
            height = axis.line.width;
            width = (isNullOrUndefined(lineHeight)) ? containerRect.width : lineHeight;
        }
        index = this.checkPreviousAxes(axis, axisIndex);
        if (isNullOrUndefined(index)) {
            if (orientation === 'Vertical') {
                x = (!axis.opposedPosition ? containerRect.x : containerRect.x + containerRect.width) + axis.line.offset;
            }
            else {
                y = (!axis.opposedPosition ? containerRect.y : containerRect.y + containerRect.height) + axis.line.offset;
            }
        }
        else {
            prevAxis = this.gauge.axes[index];
            if (orientation === 'Vertical') {
                x = ((!axis.opposedPosition) ? prevAxis.bounds.x : (prevAxis.bounds.x + prevAxis.bounds.width)) + axis.line.offset;
            }
            else {
                y = ((!axis.opposedPosition) ? prevAxis.bounds.y : (prevAxis.bounds.y + prevAxis.bounds.height)) + axis.line.offset;
            }
        }
        axis.lineBounds = new Rect(x, y, width, height);
    };
    /**
     * Calculate axis tick bounds
     * @param axis
     * @param axisIndex
     */
    AxisLayoutPanel.prototype.calculateTickBounds = function (axis, axisIndex) {
        var x;
        var y;
        var major;
        var minor;
        var min = Math.min(axis.minimum, axis.maximum);
        var max = Math.max(axis.minimum, axis.maximum);
        min = (min === max) ? max - 1 : min;
        var interval = axis.majorTicks.interval;
        var bounds = axis.lineBounds;
        major = axis.majorTicks;
        minor = axis.minorTicks;
        axis.majorInterval = major.interval;
        axis.minorInterval = minor.interval;
        var size = (this.gauge.orientation === 'Vertical' ? bounds.height : bounds.width);
        var lineSize = (this.gauge.orientation === 'Vertical' ? bounds.width : bounds.height) / 2;
        axis.majorInterval = isNullOrUndefined(axis.majorInterval) ? calculateNiceInterval(min, max, size, this.gauge.orientation)
            : major.interval;
        axis.visibleRange = new VisibleRange(min, max, axis.majorInterval, (max - min));
        axis.minorInterval = (isNullOrUndefined(axis.minorInterval)) ? axis.majorInterval / 2 : axis.minorInterval;
        if (this.gauge.orientation === 'Vertical') {
            x = axis.majorTicks.position === 'Auto' ? ((!axis.opposedPosition ? (bounds.x - lineSize - major.height) : bounds.x + lineSize)
                + major.offset) : x;
            x = axis.majorTicks.position !== 'Auto' ? (axis.majorTicks.position === 'Cross' ? bounds.x - major.height / 2 - major.offset :
                ((axis.majorTicks.position === 'Inside' && !axis.opposedPosition) ||
                    (axis.majorTicks.position === 'Outside' && axis.opposedPosition)) ? (bounds.x - lineSize - major.height - major.offset)
                    : (bounds.x + lineSize + major.offset)) : x;
            axis.majorTickBounds = new Rect(x, bounds.y, major.height, bounds.height);
            x = axis.minorTicks.position === 'Auto' ? ((!axis.opposedPosition ? (bounds.x - lineSize - minor.height) : bounds.x + lineSize)
                + minor.offset) : x;
            x = axis.minorTicks.position !== 'Auto' ? (axis.minorTicks.position === 'Cross' ? bounds.x - minor.height / 2 - minor.offset :
                ((axis.minorTicks.position === 'Inside' && !axis.opposedPosition) ||
                    (axis.minorTicks.position === 'Outside' && axis.opposedPosition)) ? (bounds.x - lineSize - minor.height - minor.offset)
                    : (bounds.x + lineSize + minor.offset)) : x;
            axis.minorTickBounds = new Rect(x, bounds.y, minor.height, bounds.height);
        }
        else {
            y = axis.majorTicks.position === 'Auto' ? ((!axis.opposedPosition ? (bounds.y - lineSize - major.height) : bounds.y + lineSize)
                + major.offset) : y;
            y = axis.majorTicks.position !== 'Auto' ? ((axis.majorTicks.position === 'Cross' ? bounds.y - major.height / 2 - major.offset :
                ((axis.majorTicks.position === 'Inside' && !axis.opposedPosition) ||
                    (axis.majorTicks.position === 'Outside' && axis.opposedPosition)) ?
                    (bounds.y - lineSize - major.height) - major.offset : bounds.y + lineSize + major.offset)) : y;
            axis.majorTickBounds = new Rect(bounds.x, y, bounds.width, major.height);
            y = axis.minorTicks.position === 'Auto' ? ((!axis.opposedPosition ? (bounds.y - lineSize - minor.height) : bounds.y + lineSize)
                + minor.offset) : y;
            y = axis.minorTicks.position !== 'Auto' ? ((axis.minorTicks.position === 'Cross' ? bounds.y - minor.height / 2 - major.offset :
                ((axis.minorTicks.position === 'Inside' && !axis.opposedPosition) ||
                    (axis.minorTicks.position === 'Outside' && axis.opposedPosition)) ?
                    (bounds.y - lineSize - minor.height) - minor.offset : bounds.y + lineSize + minor.offset)) : y;
            axis.minorTickBounds = new Rect(bounds.x, y, bounds.width, minor.height);
        }
    };
    /**
     * To Calculate axis label bounds
     * @param axis
     * @param axisIndex
     */
    AxisLayoutPanel.prototype.calculateLabelBounds = function (axis, axisIndex) {
        var x;
        var y;
        var width;
        var height;
        var padding = 5;
        var applyPositionBounds = (axis.labelStyle.position !== 'Auto' && axis.majorTicks.position !== 'Auto' &&
            axis.minorTicks.position !== 'Auto');
        var bounds = applyPositionBounds ? (axis.labelStyle.position === axis.minorTicks.position &&
            axis.minorTicks.position !== axis.majorTicks.position ? axis.minorTickBounds : axis.majorTickBounds) :
            axis.majorTickBounds;
        var offset = axis.labelStyle.offset;
        this.calculateVisibleLabels(axis);
        width = axis.maxLabelSize.width;
        height = axis.maxLabelSize.height / 2;
        if (this.gauge.orientation === 'Vertical') {
            x = axis.labelStyle.position === 'Auto' ? ((!axis.opposedPosition ? (bounds.x - width - padding) :
                (bounds.x + bounds.width + padding)) + offset) : x;
            var boundx = bounds.x;
            boundx = applyPositionBounds ? ((axis.labelStyle.position !== axis.minorTicks.position &&
                axis.labelStyle.position !== axis.majorTicks.position) ?
                (axis.labelStyle.position === 'Inside' ? bounds.x - axis.lineBounds.width : axis.labelStyle.position === 'Outside' ?
                    bounds.x + axis.lineBounds.width : bounds.x) : bounds.x) : bounds.x;
            x = axis.labelStyle.position !== 'Auto' ? (axis.labelStyle.position === 'Cross' ? axis.lineBounds.x -
                axis.maxLabelSize.width / 4 - offset : ((axis.labelStyle.position === 'Inside' && !axis.opposedPosition) ||
                (axis.labelStyle.position === 'Outside' && axis.opposedPosition)) ?
                ((boundx - width - padding) - offset) : ((boundx + bounds.width + padding) + offset)) : x;
            y = axis.lineBounds.y;
        }
        else {
            y = axis.labelStyle.position === 'Auto' ? ((!axis.opposedPosition ?
                (bounds.y - padding) : ((bounds.y + bounds.height + padding) + height)) + offset) : y;
            var boundy = bounds.y;
            boundy = applyPositionBounds ? ((axis.labelStyle.position !== axis.minorTicks.position &&
                axis.labelStyle.position !== axis.majorTicks.position) ?
                (axis.labelStyle.position === 'Inside' ? bounds.y - axis.lineBounds.height : axis.labelStyle.position === 'Outside' ?
                    bounds.y + axis.lineBounds.height : bounds.y) : bounds.y) : bounds.y;
            y = axis.labelStyle.position !== 'Auto' ? (axis.labelStyle.position === 'Cross' ? axis.lineBounds.y +
                axis.maxLabelSize.height / 4 - offset : ((axis.labelStyle.position === 'Inside' && !axis.opposedPosition) ||
                (axis.labelStyle.position === 'Outside' && axis.opposedPosition)) ?
                (boundy - padding) - offset : ((boundy + bounds.height + padding) + height) + offset) : y;
            x = axis.lineBounds.x;
        }
        axis.labelBounds = new Rect(x, y, width, height);
    };
    /**
     * Calculate pointer bounds
     * @param axis
     * @param axisIndex
     */
    AxisLayoutPanel.prototype.calculatePointerBounds = function (axis, axisIndex) {
        var pointer;
        var range = axis.visibleRange;
        var orientation = this.gauge.orientation;
        var line = axis.lineBounds;
        var label = axis.labelBounds;
        var minimumValue = Math.min(range.min, range.max);
        var maximumValue = Math.max(range.min, range.max);
        for (var i = 0; i < axis.pointers.length; i++) {
            pointer = axis.pointers[i];
            if (pointer.offset.length > 0) {
                pointer.currentOffset = stringToNumber(pointer.offset, (this.gauge.orientation === 'Horizontal' ?
                    this.gauge.availableSize.height / 2 : this.gauge.availableSize.width / 2));
            }
            else {
                pointer.currentOffset = pointer.offset;
            }
            pointer.currentValue = pointer.value !== null ?
                pointer.value < minimumValue ? minimumValue : pointer.value > maximumValue ? maximumValue : pointer.value
                : minimumValue;
            if (pointer.width > 0 && withInRange(pointer.currentValue, null, null, range.max, range.min, 'pointer')) {
                this['calculate' + pointer.type + 'Bounds'](axisIndex, axis, i, pointer);
            }
        }
    };
    /**
     * Calculate marker pointer bounds
     * @param axisIndex
     * @param axis
     * @param pointerIndex
     * @param pointer
     */
    AxisLayoutPanel.prototype.calculateMarkerBounds = function (axisIndex, axis, pointerIndex, pointer) {
        var x;
        var y;
        var line = axis.lineBounds;
        var offset = pointer.currentOffset;
        var range = axis.visibleRange;
        var placement = pointer.placement;
        var tick = axis.majorTickBounds;
        var label = axis.labelBounds;
        var border = pointer.border.width;
        if (this.gauge.orientation === 'Vertical') {
            if (pointer.position === 'Auto') {
                x = (!axis.opposedPosition) ? (placement === 'Near') ? label.x : (placement === 'Center') ? tick.x : line.x :
                    placement === 'Far' ? label.x + label.width : (placement === 'Center' ? tick.x + tick.width : line.x);
                x = !axis.opposedPosition ? ((pointer.placement === 'Far' ? x + border : x - border) + (offset)) :
                    ((pointer.placement === 'Near' ? x - border : x + border) + (offset));
            }
            else {
                x = (pointer.position === 'Cross' ? line.x - pointer.width / 2 - offset :
                    ((pointer.position === 'Inside' && !axis.opposedPosition) ||
                        (pointer.position === 'Outside' && axis.opposedPosition)) ?
                        (line.x - line.width / 2 - (pointer.markerType !== 'InvertedTriangle' && pointer.markerType !== 'Triangle' ?
                            pointer.width : 0)) - offset : ((line.x + line.width / 2) + offset));
            }
            y = ((valueToCoefficient(pointer.currentValue, axis, this.gauge.orientation, range) * line.height) + line.y);
        }
        else {
            if (pointer.position === 'Auto') {
                y = (!axis.opposedPosition) ? (placement === 'Near') ? label.y - label.height : (placement === 'Center') ? tick.y :
                    line.y : (placement === 'Far') ? label.y : (placement === 'Center') ? tick.y + tick.height : line.y;
                y = !axis.opposedPosition ? ((pointer.placement === 'Far' ? y + border : y - border) + (offset)) :
                    ((pointer.placement === 'Near' ? y - border : y + border) + (offset));
            }
            else {
                y = (pointer.position === 'Cross' ? line.y - pointer.height / 2 - offset :
                    ((pointer.position === 'Inside' && !axis.opposedPosition) ||
                        (pointer.position === 'Outside' && axis.opposedPosition)) ?
                        (line.y - line.height / 2 - (pointer.markerType !== 'InvertedTriangle' && pointer.markerType !== 'Triangle' ?
                            pointer.height : 0)) - offset : ((line.y + line.height / 2) + offset));
            }
            x = ((valueToCoefficient(pointer.currentValue, axis, this.gauge.orientation, range) * line.width) + line.x);
        }
        pointer.bounds = new Rect(x, y, pointer.width, pointer.height);
    };
    /**
     * Calculate bar pointer bounds
     * @param axisIndex
     * @param axis
     * @param pointerIndex
     * @param pointer
     */
    AxisLayoutPanel.prototype.calculateBarBounds = function (axisIndex, axis, pointerIndex, pointer) {
        var x1;
        var x2;
        var y1;
        var y2;
        var height;
        var width;
        var line = axis.lineBounds;
        var padding = 10;
        var range = axis.visibleRange;
        var orientation = this.gauge.orientation;
        var offset = pointer.currentOffset;
        var container = this.gauge.containerBounds;
        if (orientation === 'Vertical') {
            if (pointer.position === 'Auto') {
                x1 = (container.width > 0) ? container.x + ((container.width / 2) - (pointer.width / 2)) :
                    (!axis.opposedPosition) ? (line.x + padding) : (line.x - pointer.width - padding);
                x1 += (offset);
            }
            else {
                x1 = (pointer.position === 'Cross' ? line.x - pointer.width / 2 - offset :
                    ((pointer.position === 'Inside' && !axis.opposedPosition) ||
                        (pointer.position === 'Outside' && axis.opposedPosition)) ?
                        (line.x - line.width / 2 - pointer.width) - offset : ((line.x + line.width / 2) + offset));
            }
            y1 = ((valueToCoefficient(pointer.currentValue, axis, orientation, range) * line.height) + line.y);
            y2 = ((valueToCoefficient(range.min, axis, orientation, range) * line.height) + line.y);
            height = Math.abs(y2 - y1);
            y1 = (!axis.isInversed) ? y1 : y2;
            width = pointer.width;
        }
        else {
            if (pointer.position === 'Auto') {
                y1 = (container.height > 0) ? (container.y + (container.height / 2) - (pointer.height) / 2) :
                    (!axis.opposedPosition) ? (line.y + padding) : (line.y - pointer.height - padding);
                y1 += (offset);
            }
            else {
                y1 = (pointer.position === 'Cross' ? line.y - pointer.height / 2 - offset :
                    ((pointer.position === 'Inside' && !axis.opposedPosition) ||
                        (pointer.position === 'Outside' && axis.opposedPosition)) ?
                        (line.y - line.height / 2 - pointer.height) - offset : ((line.y + line.height / 2) + offset));
            }
            height = pointer.height;
            x1 = ((valueToCoefficient(range.min, axis, orientation, range) * line.width) + line.x);
            x2 = ((valueToCoefficient(pointer.currentValue, axis, orientation, range) * line.width) + line.x);
            width = Math.abs(x2 - x1);
            x1 = (!axis.isInversed) ? x1 : x2;
        }
        pointer.bounds = new Rect(x1, y1, width, height);
    };
    /**
     * Calculate ranges bounds
     * @param axis
     * @param axisIndex
     */
    AxisLayoutPanel.prototype.calculateRangesBounds = function (axis, axisIndex) {
        var range;
        var start;
        var end;
        var line = axis.lineBounds;
        var visibleRange = axis.visibleRange;
        var orientation = this.gauge.orientation;
        var startVal;
        var endVal;
        var pointX;
        var pointY;
        var width;
        var height;
        var position;
        var startWidth;
        var endWidth;
        var colors;
        for (var i = 0; i < axis.ranges.length; i++) {
            range = axis.ranges[i];
            if (range.offset.length > 0) {
                range.currentOffset = stringToNumber(range.offset, (this.gauge.orientation === 'Horizontal' ?
                    this.gauge.availableSize.height / 2 : this.gauge.availableSize.width / 2));
            }
            else {
                range.currentOffset = range.offset;
            }
            start = Math.max(range.start, visibleRange.min);
            end = Math.min(range.end, visibleRange.max);
            if (withInRange(null, start, end, visibleRange.max, visibleRange.min, 'range')) {
                start = Math.min(start, range.end);
                end = Math.max(start, end);
                position = range.position;
                startWidth = range.startWidth;
                endWidth = range.endWidth;
                colors = this.gauge.rangePalettes.length ? this.gauge.rangePalettes : getRangePalette();
                range.interior = range.color ? range.color : colors[i % colors.length];
                if (this.gauge.orientation === 'Vertical') {
                    pointX = line.x + (range.currentOffset) + (position === 'Cross' ? startWidth / 2 : position === 'Outside' ?
                        -(line.width / 2) : position === 'Inside' ? line.width / 2 : 0);
                    pointY = (valueToCoefficient(end, axis, orientation, visibleRange) * line.height) + line.y;
                    height = (valueToCoefficient(start, axis, orientation, visibleRange) * line.height) + line.y;
                    height -= pointY;
                    startVal = !axis.opposedPosition ? (position === 'Inside' ? (pointX + startWidth) : position === 'Cross' ?
                        (pointX - startWidth) : (pointX - startWidth)) : (position === 'Inside' ? (pointX - startWidth) :
                        position === 'Cross' ? (pointX - startWidth) : (pointX + startWidth));
                    endVal = !axis.opposedPosition ? position === 'Inside' ? (pointX + endWidth) : position === 'Cross' ?
                        (pointX - endWidth) : (pointX - endWidth) : position === 'Inside' ? (pointX - endWidth) :
                        position === 'Cross' ? (pointX - endWidth) : (pointX + endWidth);
                    range.path = 'M' + pointX + ' ' + pointY + ' L ' + pointX + ' ' + (pointY + height) +
                        ' L ' + startVal + ' ' + (pointY + height) + ' L ' + endVal + ' ' + pointY +
                        ' L ' + pointX + ' ' + pointY + ' z ';
                }
                else {
                    pointX = (valueToCoefficient(end, axis, orientation, visibleRange) * line.width) + line.x;
                    pointY = axis.lineBounds.y + (range.currentOffset) + (position === 'Cross' ? startWidth / 2 :
                        position === 'Outside' ? -(line.height / 2) : position === 'Inside' ? line.height / 2 : 0);
                    width = (valueToCoefficient(start, axis, orientation, visibleRange) * line.width) + line.x;
                    width = pointX - width;
                    startVal = !axis.opposedPosition ? position === 'Inside' ? (pointY + startWidth) : position === 'Cross' ?
                        (pointY - startWidth) : (pointY - startWidth) : (position === 'Inside') ? (pointY - startWidth) :
                        position === 'Cross' ? (pointY - startWidth) : (pointY + startWidth);
                    endVal = !axis.opposedPosition ? position === 'Inside' ? (pointY + endWidth) : position === 'Cross' ?
                        (pointY - endWidth) : (pointY - endWidth) : (position === 'Inside') ? (pointY - endWidth) :
                        position === 'Cross' ? (pointY - endWidth) : (pointY + endWidth);
                    range.path = 'M' + pointX + ' ' + pointY + ' L ' + (pointX - width) + ' ' + pointY +
                        ' L ' + (pointX - width) + ' ' + startVal + ' L ' + pointX + ' ' + endVal +
                        ' L ' + pointX + ' ' + pointY + ' z ';
                }
            }
        }
    };
    AxisLayoutPanel.prototype.checkPreviousAxes = function (currentAxis, axisIndex) {
        var index = axisIndex - 1;
        var prevAxis;
        var isPositive = (index >= 0) ? true : false;
        if (isPositive) {
            prevAxis = this.gauge.axes[index];
            index = (prevAxis.checkAlign.align === currentAxis.checkAlign.align) ? index : this.checkPreviousAxes(currentAxis, index);
        }
        else {
            index = null;
        }
        return index;
    };
    /**
     *
     * @param axis To calculate the visible labels
     */
    AxisLayoutPanel.prototype.calculateVisibleLabels = function (axis) {
        axis.visibleLabels = [];
        var min = axis.visibleRange.min;
        var max = axis.visibleRange.max;
        var interval = axis.visibleRange.interval;
        var format;
        var argsData;
        var style = axis.labelStyle;
        var labelSize;
        var customLabelFormat = style.format && style.format.match('{value}') !== null;
        format = this.gauge.intl.getNumberFormat({
            format: getLabelFormat(style.format), useGrouping: this.gauge.useGroupingSeparator
        });
        var _loop_1 = function (i) {
            argsData = {
                cancel: false, name: axisLabelRender, axis: axis,
                text: customLabelFormat ? textFormatter(style.format, { value: i }, this_1.gauge) :
                    formatValue(i, this_1.gauge).toString(),
                value: i
            };
            var axisLabelRenderSuccess = function (argsData) {
                if (!argsData.cancel) {
                    axis.visibleLabels.push(new VisibleLabels(argsData.text, i, labelSize));
                }
            };
            axisLabelRenderSuccess.bind(this_1);
            this_1.gauge.trigger(axisLabelRender, argsData, axisLabelRenderSuccess);
        };
        var this_1 = this;
        for (var i = min; (i <= max && interval > 0); i += interval) {
            _loop_1(i);
        }
        var lastLabel = axis.visibleLabels.length ? axis.visibleLabels[axis.visibleLabels.length - 1].value : null;
        var maxVal = axis.visibleRange.max;
        if (lastLabel !== maxVal && axis.showLastLabel === true) {
            argsData = {
                cancel: false, name: axisLabelRender, axis: axis,
                text: customLabelFormat ? style.format.replace(new RegExp('{value}', 'g'), format(maxVal)) :
                    format(maxVal),
                value: maxVal
            };
            // if (this.gauge.isBlazor) {
            //     const { axis, ...blazorArgsData } : IAxisLabelRenderEventArgs = argsData;
            //     argsData = blazorArgsData;
            // }
            var axisLabelRenderSuccess = function (argsData) {
                labelSize = measureText(argsData.text, axis.labelStyle.font);
                if (!argsData.cancel) {
                    axis.visibleLabels.push(new VisibleLabels(argsData.text, maxVal, labelSize));
                }
            };
            axisLabelRenderSuccess.bind(this);
            this.gauge.trigger(axisLabelRender, argsData, axisLabelRenderSuccess);
        }
        this.getMaxLabelWidth(this.gauge, axis);
    };
    /**
     * Calculate maximum label width for the axis.
     * @return {void}
     * @private
     */
    AxisLayoutPanel.prototype.getMaxLabelWidth = function (gauge, axis) {
        axis.maxLabelSize = new Size(0, 0);
        var label;
        for (var i = 0; i < axis.visibleLabels.length; i++) {
            label = axis.visibleLabels[i];
            label.size = measureText(label.text, axis.labelStyle.font);
            if (label.size.width > axis.maxLabelSize.width) {
                axis.maxLabelSize.width = label.size.width;
            }
            if (label.size.height > axis.maxLabelSize.height) {
                axis.maxLabelSize.height = label.size.height;
            }
        }
    };
    AxisLayoutPanel.prototype.checkThermometer = function () {
        if (this.gauge.container.type === 'Thermometer') {
            this.gauge.axes.map(function (axis, index) {
                if (axis.isInversed) {
                    axis.pointers.map(function (pointer, index) {
                        if (pointer.type === 'Bar') {
                            axis.isInversed = false;
                        }
                    });
                }
            });
        }
    };
    return AxisLayoutPanel;
}());

/**
 * @private
 * To handle the animation for gauge
 */
var Animations = /** @__PURE__ @class */ (function () {
    function Animations(gauge) {
        this.gauge = gauge;
    }
    /**
     * To do the marker pointer animation.
     * @return {void}
     * @private
     */
    Animations.prototype.performMarkerAnimation = function (element, axis, pointer) {
        var _this = this;
        var markerElement = element;
        var options;
        var timeStamp;
        var range = axis.visibleRange;
        var rectHeight = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.height : axis.lineBounds.width;
        var rectY = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.y : axis.lineBounds.x;
        if (this.gauge.orientation === 'Vertical') {
            pointer.bounds.y = (valueToCoefficient(pointer.currentValue, axis, this.gauge.orientation, range) * rectHeight) + rectY;
        }
        else {
            pointer.bounds.x = (valueToCoefficient(pointer.currentValue, axis, this.gauge.orientation, range) * rectHeight) + rectY;
        }
        options = new PathOption(markerElement.id, null, null, null);
        options = calculateShapes(pointer.bounds, pointer.markerType, new Size(pointer.width, pointer.height), pointer.imageUrl, options, this.gauge.orientation, axis, pointer);
        var currentValue;
        var start = pointer.startValue;
        var end = pointer.currentValue;
        start = (start === end) ? range.min : start;
        var val = Math.abs(start - end);
        var currentPath = options.d;
        new Animation({}).animate(markerElement, {
            duration: pointer.animationDuration,
            progress: function (args) {
                if (args.timeStamp >= args.delay) {
                    timeStamp = ((args.timeStamp - args.delay) / args.duration);
                    currentValue = (start < end) ? start + (timeStamp * val) : start - (timeStamp * val);
                    if (_this.gauge.orientation === 'Vertical') {
                        pointer.bounds.y = (valueToCoefficient(currentValue, axis, _this.gauge.orientation, range) *
                            rectHeight) + rectY;
                    }
                    else {
                        pointer.bounds.x = (valueToCoefficient(currentValue, axis, _this.gauge.orientation, range) *
                            rectHeight) + rectY;
                    }
                    options = calculateShapes(pointer.bounds, pointer.markerType, new Size(pointer.width, pointer.height), pointer.imageUrl, options, _this.gauge.orientation, axis, pointer);
                    markerElement.setAttribute('d', options.d);
                }
            },
            end: function (model) {
                markerElement.setAttribute('d', currentPath);
                pointer.startValue = pointer.currentValue;
                pointer.animationComplete = true;
                _this.gauge.trigger(animationComplete, { axis: !_this.gauge.isBlazor ? axis : null, pointer: pointer });
            }
        });
    };
    /**
     * Perform the bar pointer animation
     * @param element
     * @param axis
     * @param pointer
     */
    Animations.prototype.performBarAnimation = function (element, axis, pointer) {
        var _this = this;
        var val;
        var radix = 10;
        var timeStamp;
        var value2;
        var value1;
        var currentValue;
        var clipHeight;
        var clipY;
        var clipX;
        var clipVal;
        var rectHeight;
        var rectY;
        var clipWidth;
        var currentHeight;
        var clipElement;
        var range = axis.visibleRange;
        var pointerElement = element;
        var lineHeight = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.height : axis.lineBounds.width;
        var lineY = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.y : axis.lineBounds.x;
        var size = new Size(this.gauge.availableSize.width, this.gauge.availableSize.height);
        var start = pointer.startValue;
        var end = pointer.currentValue;
        start = (start === end) ? range.min : start;
        var path = '';
        var currentPath = '';
        var tagName = pointerElement.tagName;
        val = Math.abs(start - end);
        var pointerValue = (valueToCoefficient(end, axis, this.gauge.orientation, range) * lineHeight) + lineY;
        var startPointerVal = (valueToCoefficient(range.min, axis, this.gauge.orientation, range) *
            lineHeight) + lineY;
        rectY = (this.gauge.orientation === 'Vertical') ? !axis.isInversed ? pointerValue : startPointerVal :
            axis.isInversed ? pointerValue : startPointerVal;
        rectHeight = Math.abs(startPointerVal - pointerValue);
        if (this.gauge.container.type === 'Thermometer' && start === 0) {
            clipElement = pointerElement.parentElement.childNodes[1].childNodes[0].childNodes[0];
            if (this.gauge.orientation === 'Vertical') {
                clipY = clipElement.getAttribute('y');
                clipHeight = clipElement.getAttribute('height');
                clipVal = parseInt(clipY, radix) + parseInt(clipHeight, radix);
                clipElement.setAttribute('y', clipVal.toString());
            }
            else {
                clipX = clipElement.getAttribute('x');
                clipWidth = clipElement.getAttribute('width');
                clipVal = parseInt(clipX, radix) + parseInt(clipWidth, radix);
                clipElement.setAttribute('width', '0');
            }
        }
        path = getBox(pointer.bounds, this.gauge.container.type, this.gauge.orientation, new Size(pointer.bounds.width, pointer.bounds.height), 'bar', this.gauge.container.width, axis, pointer.roundedCornerRadius);
        new Animation({}).animate(pointerElement, {
            duration: pointer.animationDuration,
            progress: function (animate) {
                if (animate.timeStamp >= animate.delay) {
                    timeStamp = ((animate.timeStamp - animate.delay) / animate.duration);
                    currentValue = (start < end) ? start + (timeStamp * val) : start - (timeStamp * val);
                    value2 = (valueToCoefficient(currentValue, axis, _this.gauge.orientation, range) * lineHeight) + lineY;
                    value1 = (valueToCoefficient(range.min, axis, _this.gauge.orientation, range) * lineHeight) + lineY;
                    currentHeight = Math.abs(value2 - value1);
                    if (_this.gauge.orientation === 'Vertical') {
                        pointer.bounds.y = (!axis.isInversed) ? value2 : value1;
                        pointer.bounds.height = currentHeight;
                    }
                    else {
                        pointer.bounds.x = (axis.isInversed) ? value2 : value1;
                        pointer.bounds.width = currentHeight;
                    }
                    if (tagName === 'path') {
                        if (start === 0 && _this.gauge.container.type === 'Thermometer') {
                            (_this.gauge.orientation === 'Vertical') ?
                                clipElement.setAttribute('y', (clipVal - (timeStamp * parseInt(clipHeight, radix))).toString()) :
                                clipElement.setAttribute('width', (timeStamp * parseInt(clipWidth, radix)).toString());
                        }
                        currentPath = getBox(pointer.bounds, _this.gauge.container.type, _this.gauge.orientation, new Size(pointer.bounds.width, pointer.bounds.height), 'bar', _this.gauge.container.width, axis, pointer.roundedCornerRadius);
                        pointerElement.setAttribute('d', currentPath);
                    }
                    else {
                        if (_this.gauge.orientation === 'Vertical') {
                            pointerElement.setAttribute('y', pointer.bounds.y.toString());
                            pointerElement.setAttribute('height', pointer.bounds.height.toString());
                        }
                        else {
                            pointerElement.setAttribute('x', pointer.bounds.x.toString());
                            pointerElement.setAttribute('width', pointer.bounds.width.toString());
                        }
                    }
                }
            },
            end: function (model) {
                if (tagName === 'path') {
                    if (start === 0 && _this.gauge.container.type === 'Thermometer') {
                        pointerElement.parentElement.children[1].remove();
                    }
                    else {
                        pointerElement.setAttribute('d', path);
                    }
                }
                else {
                    if (_this.gauge.orientation === 'Vertical') {
                        pointerElement.setAttribute('y', rectY.toString());
                        pointerElement.setAttribute('height', rectHeight.toString());
                    }
                    else {
                        pointerElement.setAttribute('x', rectY.toString());
                        pointerElement.setAttribute('width', rectHeight.toString());
                    }
                }
                pointer.startValue = pointer.currentValue;
                _this.gauge.trigger(animationComplete, { axis: !_this.gauge.isBlazor ? axis : null, pointer: pointer });
            }
        });
    };
    return Animations;
}());

var __extends$4 = (undefined && undefined.__extends) || (function () {
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
/**
 * @private
 * To render the axis elements
 */
var AxisRenderer = /** @__PURE__ @class */ (function (_super) {
    __extends$4(AxisRenderer, _super);
    function AxisRenderer(gauge) {
        return _super.call(this, gauge) || this;
    }
    AxisRenderer.prototype.renderAxes = function () {
        var _this = this;
        var axis;
        var major;
        var minor;
        this.axisElements = [];
        var gaugeAxesG = this.gauge.svgObject.querySelector('#' + this.gauge.element.id + '_Axis_Collections');
        if (gaugeAxesG) {
            remove(gaugeAxesG);
        }
        this.axisObject = this.gauge.renderer.createGroup({
            id: this.gauge.element.id + '_Axis_Collections',
            transform: 'translate( 0, 0 )'
        });
        for (var i = 0; i < this.gauge.axes.length; i++) {
            axis = this.gauge.axes[i];
            major = axis.majorTicks;
            minor = axis.minorTicks;
            this.htmlObject = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_Axis_Group_' + i });
            this.drawAxisLine(axis, this.htmlObject, i);
            this.drawRanges(axis, this.htmlObject, i);
            this.drawTicks(axis, major, this.htmlObject, 'MajorTicks', axis.majorTickBounds);
            this.drawTicks(axis, minor, this.htmlObject, 'MinorTicks', axis.minorTickBounds);
            this.drawAxisLabels(axis, this.htmlObject);
            this.drawPointers(axis, this.htmlObject, i);
            this.axisElements.push(this.htmlObject);
        }
        this.axisElements.forEach(function (axisElement) {
            _this.axisObject.appendChild(axisElement);
        });
        this.gauge.svgObject.appendChild(this.axisObject);
        if (this.gauge.nearSizes.length !== this.gauge.farSizes.length && this.gauge.axes.length > 1) {
            this.axisAlign(this.gauge.axes);
        }
    };
    AxisRenderer.prototype.axisAlign = function (axes) {
        var nearAxisWidth = 0;
        var farAxisWidth = 0;
        var tranX;
        var transY;
        if (this.gauge.orientation === 'Vertical') {
            axes.forEach(function (axis, axisIndex) {
                if (!axis.opposedPosition) {
                    nearAxisWidth += axis.bounds.width;
                }
                else {
                    farAxisWidth += axis.bounds.width;
                }
            });
            nearAxisWidth += this.gauge.containerBounds.width / 2;
            farAxisWidth += this.gauge.containerBounds.width / 2;
            tranX = (nearAxisWidth / 2) - (farAxisWidth / 2);
            this.axisObject.setAttribute('transform', 'translate(' + tranX + ',0)');
            if (!(isNullOrUndefined(this.gauge.containerObject))) {
                this.gauge.containerObject.setAttribute('transform', 'translate(' + tranX + ',0)');
            }
        }
        else {
            axes.forEach(function (axis, axisIndex) {
                if (!axis.opposedPosition) {
                    nearAxisWidth += axis.bounds.height;
                }
                else {
                    farAxisWidth += axis.bounds.height;
                }
            });
            nearAxisWidth += (this.gauge.containerBounds.height / 2);
            farAxisWidth += (this.gauge.containerBounds.height / 2);
            transY = (nearAxisWidth / 2) - (farAxisWidth / 2);
            this.axisObject.setAttribute('transform', 'translate(0,' + transY + ')');
            if (!(isNullOrUndefined(this.gauge.containerObject))) {
                this.gauge.containerObject.setAttribute('transform', 'translate(0,' + transY + ')');
            }
        }
    };
    AxisRenderer.prototype.drawAxisLine = function (axis, axisObject, axisIndex) {
        var options;
        var rect = axis.lineBounds;
        var path = '';
        var color = axis.line.color || this.gauge.themeStyle.lineColor;
        if (axis.line.width > 0) {
            path = 'M' + rect.x + ' ' + rect.y + ' L ' + (this.gauge.orientation === 'Vertical' ? rect.x : rect.x + rect.width) +
                ' ' + (this.gauge.orientation === 'Vertical' ? rect.y + rect.height : rect.y) + 'z';
            options = new PathOption(this.gauge.element.id + '_AxisLine_' + axisIndex, color, axis.line.width, color, 1, axis.line.dashArray, path);
            axisObject.appendChild(this.gauge.renderer.drawPath(options));
        }
    };
    AxisRenderer.prototype.drawTicks = function (axis, ticks, axisObject, tickID, tickBounds) {
        var tickPath = '';
        var pointY;
        var pointX;
        var options;
        var range = axis.visibleRange;
        var line = axis.lineBounds;
        var majorTickColor = axis.majorTicks.color || this.gauge.themeStyle.majorTickColor;
        var minorTickColor = axis.minorTicks.color || this.gauge.themeStyle.minorTickColor;
        var tickColor = (tickID === 'MajorTicks') ? majorTickColor : minorTickColor;
        var interval = ((tickID === 'MajorTicks') ? axis.majorInterval : axis.minorInterval);
        // let position: string = (tickID === 'MajorTicks') ? axis.majorTicks.position : axis.minorTicks.position;
        for (var i = range.min; (i <= range.max && interval > 0); i += interval) {
            if ((tickID === 'MajorTicks') || (tickID === 'MinorTicks')) {
                if (this.gauge.orientation === 'Vertical') {
                    // pointX =  position === "Inside" ? tickBounds.x : tickBounds.x + ticks.height;
                    pointX = tickBounds.x;
                    pointY = (valueToCoefficient(i, axis, this.gauge.orientation, range) * line.height) + line.y;
                    tickPath = tickPath.concat('M' + pointX + ' ' + pointY + ' ' + 'L' + (pointX + ticks.height) + ' ' + pointY + ' ');
                }
                else {
                    pointX = (valueToCoefficient(i, axis, this.gauge.orientation, range) * line.width) + line.x;
                    // pointY = position === "Inside" ? tickBounds.y : (tickBounds.y + ticks.height);
                    pointY = tickBounds.y;
                    tickPath = tickPath.concat('M' + pointX + ' ' + pointY + ' ' + 'L' + pointX + ' ' + (pointY + ticks.height) + ' ');
                }
            }
        }
        options = new PathOption(this.gauge.element.id + '_' + tickID + 'Line_' + 0, tickColor, ticks.width, tickColor, 1, null, tickPath);
        axisObject.appendChild(this.gauge.renderer.drawPath(options));
    };
    AxisRenderer.prototype.drawAxisLabels = function (axis, axisObject) {
        var options;
        var pointX;
        var pointY;
        var rect = axis.lineBounds;
        var bounds = axis.labelBounds;
        var tick = axis.majorTickBounds;
        // let tick: Rect = axis.labelStyle.position === axis.minorTicks.position && axis.minorTicks.position !== axis.majorTicks.position ?
        //     axis.minorTickBounds : axis.majorTickBounds;
        var labelSize;
        var range = axis.visibleRange;
        var anchor;
        var baseline;
        var padding = 5;
        var fontColor = this.gauge.themeStyle.labelColor;
        var labelColor;
        var offset = axis.labelStyle.offset;
        var labelElement = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_AxisLabelsGroup' });
        for (var i = 0; i < axis.visibleLabels.length; i++) {
            labelSize = axis.visibleLabels[i].size;
            labelColor = axis.labelStyle.useRangeColor ? getRangeColor(axis.visibleLabels[i].value, axis.ranges) :
                null;
            labelColor = isNullOrUndefined(labelColor) ? (axis.labelStyle.font.color || fontColor) : labelColor;
            if (this.gauge.orientation === 'Vertical') {
                pointY = (valueToCoefficient(axis.visibleLabels[i].value, axis, this.gauge.orientation, range) *
                    rect.height) + rect.y;
                pointX = axis.labelStyle.position === 'Auto' ?
                    (!axis.opposedPosition ? (tick.x - labelSize.width - padding) + offset : bounds.x) : bounds.x;
                pointY += (labelSize.height / 4);
            }
            else {
                pointX = (valueToCoefficient(axis.visibleLabels[i].value, axis, this.gauge.orientation, range) *
                    rect.width) + rect.x;
                pointY = bounds.y;
                anchor = 'middle';
                baseline = '';
            }
            axis.labelStyle.font.fontFamily = this.gauge.themeStyle.labelFontFamily || axis.labelStyle.font.fontFamily;
            options = new TextOption(this.gauge.element.id + '_AxisLabel_' + i, pointX, pointY, anchor, axis.visibleLabels[i].text, null, baseline);
            textElement(options, axis.labelStyle.font, labelColor, labelElement);
        }
        axisObject.appendChild(labelElement);
    };
    AxisRenderer.prototype.drawPointers = function (axis, axisObject, axisIndex) {
        var pointer;
        var clipId;
        var pointesGroup;
        var pointerClipRectGroup;
        pointesGroup = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_PointersGroup' });
        for (var i = 0; i < axis.pointers.length; i++) {
            pointer = axis.pointers[i];
            clipId = 'url(#' + this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + '_' + pointer.type + 'ClipRect_' + i + ')';
            if (!(isNullOrUndefined(pointer.bounds))) {
                pointerClipRectGroup = this.gauge.renderer.createGroup({
                    'id': this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer_' + i,
                    'clip-path': clipId
                });
                if (isNullOrUndefined(pointer.startValue)) {
                    pointer.startValue = axis.visibleRange.min;
                }
                this['draw' + pointer.type + 'Pointer'](axis, axisIndex, pointer, i, pointerClipRectGroup);
                pointesGroup.appendChild(pointerClipRectGroup);
            }
        }
        axisObject.appendChild(pointesGroup);
    };
    AxisRenderer.prototype.drawMarkerPointer = function (axis, axisIndex, pointer, pointerIndex, parentElement) {
        var options;
        var pointerID = this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer' + '_' + pointerIndex;
        var transform = 'translate( 0, 0 )';
        var pointerElement;
        if (getElement(pointerID) && getElement(pointerID).childElementCount > 0) {
            remove(getElement(pointerID));
        }
        var pointerColor = pointer.color || this.gauge.themeStyle.pointerColor;
        var shapeBasedOnPosition = pointer.markerType;
        if (!isNullOrUndefined(pointer.position) && (pointer.markerType === 'InvertedTriangle' ||
            pointer.markerType === 'Triangle')) {
            shapeBasedOnPosition = (((pointer.position === 'Outside' && !axis.opposedPosition) ||
                (pointer.position === 'Inside' && axis.opposedPosition) || pointer.position === 'Cross')
                && pointer.markerType === 'Triangle' ? 'InvertedTriangle' :
                (((pointer.position === 'Inside' && !axis.opposedPosition) || (pointer.position === 'Outside' && axis.opposedPosition)) &&
                    pointer.markerType === 'InvertedTriangle' ? 'Triangle' : pointer.markerType));
        }
        options = new PathOption(pointerID, pointerColor, pointer.border.width, pointer.border.color, pointer.opacity, null, null, transform);
        options = calculateShapes(pointer.bounds, shapeBasedOnPosition, new Size(pointer.width, pointer.height), pointer.imageUrl, options, this.gauge.orientation, axis, pointer);
        pointerElement = ((pointer.markerType === 'Circle' ? this.gauge.renderer.drawCircle(options)
            : (pointer.markerType === 'Image') ? this.gauge.renderer.drawImage(options) :
                this.gauge.renderer.drawPath(options)));
        parentElement.appendChild(pointerElement);
        if (pointer.animationDuration > 0 && !this.gauge.gaugeResized) {
            pointer.animationComplete = false;
            this.performMarkerAnimation(pointerElement, axis, pointer);
        }
        pointerElement.setAttribute('aria-label', pointer.description || 'Pointer:' + Number(pointer.currentValue).toString());
    };
    AxisRenderer.prototype.drawBarPointer = function (axis, axisIndex, pointer, pointerIndex, parentElement) {
        var rectOptions;
        var clipRectElement;
        var pointerElement;
        var path = '';
        var options;
        var box;
        var size = new Size(this.gauge.availableSize.width, this.gauge.availableSize.height);
        var pointerID = this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer' + '_' + pointerIndex;
        if (getElement(pointerID) && getElement(pointerID).childElementCount > 0) {
            remove(getElement(pointerID));
        }
        if (this.gauge.container.type === 'Normal') {
            rectOptions = new RectOption(pointerID, pointer.color || this.gauge.themeStyle.pointerColor, pointer.border, pointer.opacity, pointer.bounds, null, null);
            box = pointer.bounds;
            pointerElement = this.gauge.renderer.drawRectangle(rectOptions);
        }
        else {
            path = getBox(pointer.bounds, this.gauge.container.type, this.gauge.orientation, new Size(pointer.bounds.width, pointer.bounds.height), 'bar', this.gauge.container.width, axis, pointer.roundedCornerRadius);
            options = new PathOption(pointerID, pointer.color || this.gauge.themeStyle.pointerColor, pointer.border.width, pointer.border.color, pointer.opacity, null, path);
            pointerElement = this.gauge.renderer.drawPath(options);
            box = getPathToRect(pointerElement.cloneNode(true), size, this.gauge.element);
        }
        if (getElement(pointerID) && getElement(pointerID).childElementCount > 0) {
            var element = getElement(pointerID).firstElementChild;
            if (this.gauge.container.type === 'Normal') {
                element.setAttribute('x', rectOptions.x + '');
                element.setAttribute('y', rectOptions.y + '');
                element.setAttribute('width', rectOptions.width + '');
                element.setAttribute('height', rectOptions.height + '');
            }
            else {
                element.setAttribute('d', options.d);
            }
        }
        else {
            parentElement.appendChild(pointerElement);
        }
        pointerElement.setAttribute('aria-label', pointer.description || 'Pointer:' + Number(pointer.currentValue).toString());
        if (pointer.animationDuration > 0 && !this.gauge.gaugeResized) {
            if (this.gauge.container.type === 'Thermometer' && pointer.startValue === 0) {
                clipRectElement = this.gauge.renderer.drawClipPath(new RectOption(this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + '_' + pointer.type + 'ClipRect_' + pointerIndex, 'transparent', { width: 1, color: 'Gray' }, 1, box));
                parentElement.appendChild(clipRectElement);
            }
            this.performBarAnimation(pointerElement, axis, pointer);
        }
    };
    AxisRenderer.prototype.drawRanges = function (axis, axisObject, axisIndex) {
        var range;
        var options;
        var rangeElement = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_RangesGroup' });
        for (var j = 0; j < axis.ranges.length; j++) {
            range = axis.ranges[j];
            if (!(isNullOrUndefined(range.path))) {
                options = new PathOption(this.gauge.element.id + '_AxisIndex_' + axisIndex + '_Range_' + j, range.interior, range.border.width, range.border.color, 1, null, range.path);
                rangeElement.appendChild(this.gauge.renderer.drawPath(options));
            }
        }
        axisObject.appendChild(rangeElement);
    };
    return AxisRenderer;
}(Animations));

/**
 * Represent the Annotation rendering for gauge
 */
var Annotations = /** @__PURE__ @class */ (function () {
    function Annotations(gauge) {
        this.gauge = gauge;
    }
    /**
     * To render annotation elements
     */
    Annotations.prototype.renderAnnotationElements = function () {
        var _this = this;
        var secondaryID = this.gauge.element.id + '_Secondary_Element';
        var annotationGroup = createElement('div', { id: this.gauge.element.id + '_AnnotationsGroup' });
        annotationGroup.style.position = 'absolute';
        annotationGroup.style.top = '0px';
        annotationGroup.style.left = '0px';
        this.gauge.annotations.map(function (annotation, index) {
            if (annotation.content !== null) {
                _this.createAnnotationTemplate(annotationGroup, index);
            }
        });
        if (annotationGroup.childElementCount > 0 && !(isNullOrUndefined(getElement(secondaryID)))) {
            getElement(secondaryID).appendChild(annotationGroup);
            for (var i = 0; i < this.gauge.annotations.length; i++) {
                updateBlazorTemplate(this.gauge.element.id + '_ContentTemplate' + i, 'ContentTemplate', this.gauge.annotations[i]);
            }
        }
    };
    /**
     * To create annotation elements
     */
    //tslint:disable
    Annotations.prototype.createAnnotationTemplate = function (element, annotationIndex) {
        var _this = this;
        var left;
        var top;
        var templateFn;
        var renderAnnotation = false;
        var templateElement;
        var axis;
        var axisIndex;
        var id = this.gauge.element.id + '_Annotation_' + annotationIndex;
        var annotation = this.gauge.annotations[annotationIndex];
        var childElement;
        childElement = createElement('div', {
            id: this.gauge.element.id + '_Annotation_' + annotationIndex, styles: 'position: absolute; z-index:' + annotation.zIndex + ';'
        });
        var argsData = {
            cancel: false, name: annotationRender, content: annotation.content,
            annotation: annotation, textStyle: annotation.font
        };
        argsData.textStyle.color = annotation.font.color || this.gauge.themeStyle.labelColor;
        if (this.gauge.isBlazor) {
            var cancel = argsData.cancel, name_1 = argsData.name, content = argsData.content, annotation_1 = argsData.annotation, textStyle = argsData.textStyle;
            argsData = { cancel: cancel, name: name_1, content: content, annotation: annotation_1, textStyle: textStyle };
        }
        this.gauge.trigger(annotationRender, argsData, function (observerArgs) {
            if (!argsData.cancel) {
                templateFn = getTemplateFunction(argsData.content);
                if (templateFn && (!_this.gauge.isBlazor ? templateFn(_this.gauge, null, null, _this.gauge.element.id + '_ContentTemplate' + annotationIndex).length : {})) {
                    templateElement = Array.prototype.slice.call(templateFn(!_this.gauge.isBlazor ? _this.gauge : {}, null, null, _this.gauge.element.id + '_ContentTemplate' + annotationIndex));
                    var length_1 = templateElement.length;
                    for (var i = 0; i < length_1; i++) {
                        childElement.appendChild(templateElement[i]);
                    }
                }
                else {
                    childElement.appendChild(createElement('div', {
                        innerHTML: argsData.content,
                        styles: getFontStyle(argsData.textStyle)
                    }));
                }
                var offset = getElementOffset(childElement.cloneNode(true), _this.gauge.element);
                if (!(isNullOrUndefined(annotation.axisValue))) {
                    axisIndex = isNullOrUndefined(annotation.axisIndex) ? 0 : annotation.axisIndex;
                    axis = _this.gauge.axes[axisIndex];
                    var range = axis.visibleRange;
                    renderAnnotation = (annotation.axisValue >= range.min && annotation.axisValue <= range.max) ? true : false;
                    var line = axis.lineBounds;
                    if (_this.gauge.orientation === 'Vertical') {
                        left = line.x + annotation.x;
                        top = ((valueToCoefficient(annotation.axisValue, axis, _this.gauge.orientation, range) * line.height) + line.y);
                        top += annotation.y;
                    }
                    else {
                        left = ((valueToCoefficient(annotation.axisValue, axis, _this.gauge.orientation, range) * line.width) + line.x);
                        left += annotation.x;
                        top = line.y + annotation.y;
                    }
                    left -= (offset.width / 2);
                    top -= (offset.height / 2);
                }
                else {
                    var elementRect = _this.gauge.element.getBoundingClientRect();
                    var bounds = _this.gauge.svgObject.getBoundingClientRect();
                    renderAnnotation = true;
                    left = Math.abs(bounds.left - elementRect.left);
                    top = Math.abs(bounds.top - elementRect.top);
                    left = (annotation.horizontalAlignment === 'None') ? (left + annotation.x) : left;
                    top = (annotation.verticalAlignment === 'None') ? top + annotation.y : top;
                    switch (annotation.verticalAlignment) {
                        case 'Near':
                            top = top + annotation.y;
                            break;
                        case 'Center':
                            top = top + annotation.y + ((bounds.height / 2) - (offset.height / 2));
                            break;
                        case 'Far':
                            top = (top + bounds.height) + annotation.y - offset.height;
                            break;
                    }
                    switch (annotation.horizontalAlignment) {
                        case 'Near':
                            left = left + annotation.x;
                            break;
                        case 'Center':
                            left = left + annotation.x + ((bounds.width / 2) - (offset.width / 2));
                            break;
                        case 'Far':
                            left = (left + bounds.width) + annotation.x - offset.width;
                            break;
                    }
                }
                childElement.style.left = left + 'px';
                childElement.style.top = top + 'px';
                if (renderAnnotation) {
                    element.appendChild(childElement);
                }
            }
        });
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
    Annotations.prototype.destroy = function (gauge) {
        // Destroy method performed here
    };
    return Annotations;
}());

/**
 * Represent the tooltip rendering for gauge
 */
var GaugeTooltip = /** @__PURE__ @class */ (function () {
    function GaugeTooltip(gauge) {
        this.gauge = gauge;
        this.element = gauge.element;
        this.tooltip = gauge.tooltip;
        this.textStyle = this.tooltip.textStyle;
        this.borderStyle = this.tooltip.border;
        this.tooltipId = this.gauge.element.id + '_LinearGauge_Tooltip';
        this.addEventListener();
    }
    /**
     * Internal use for tooltip rendering
     * @param pointerElement
     */
    /* tslint:disable:no-string-literal */
    GaugeTooltip.prototype.renderTooltip = function (e) {
        var _this = this;
        var pageX;
        var pageY;
        var target;
        var touchArg;
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
        var tooltipEle;
        var tooltipContent;
        if (target.id.indexOf('Pointer') > -1) {
            this.pointerElement = target;
            var areaRect_1 = this.gauge.element.getBoundingClientRect();
            var current = getPointer(this.pointerElement, this.gauge);
            this.currentAxis = current.axis;
            this.axisIndex = current.axisIndex;
            this.currentPointer = current.pointer;
            var customTooltipFormat = this.tooltip.format && this.tooltip.format.match('{value}') !== null;
            this.tooltip.textStyle.fontFamily = this.gauge.themeStyle.fontFamily || this.tooltip.textStyle.fontFamily;
            this.tooltip.textStyle.opacity = this.gauge.themeStyle.tooltipTextOpacity || this.tooltip.textStyle.opacity;
            tooltipContent = customTooltipFormat ? textFormatter(this.tooltip.format, { value: this.currentPointer.currentValue }, this.gauge) :
                formatValue(this.currentPointer.currentValue, this.gauge).toString();
            if (document.getElementById(this.tooltipId)) {
                tooltipEle = document.getElementById(this.tooltipId);
            }
            else {
                tooltipEle = createElement('div', {
                    id: this.tooltipId,
                    className: 'EJ2-LinearGauge-Tooltip',
                    styles: 'position: absolute;pointer-events:none;'
                });
                document.getElementById(this.gauge.element.id + '_Secondary_Element').appendChild(tooltipEle);
            }
            if (tooltipEle.childElementCount !== 0 && !this.gauge.pointerDrag) {
                return null;
            }
            var location_1 = this.getTooltipLocation();
            var args_1 = {
                name: tooltipRender,
                cancel: false,
                gauge: this.gauge,
                event: e,
                location: location_1,
                content: tooltipContent,
                tooltip: this.tooltip,
                axis: this.currentAxis,
                pointer: this.currentPointer
            };
            var tooltipPos_1 = this.getTooltipPosition();
            location_1.y += (this.tooltip.template && tooltipPos_1 === 'Top') ? 20 : 0;
            location_1.x += (this.tooltip.template && tooltipPos_1 === 'Right') ? 20 : 0;
            this.gauge.trigger(tooltipRender, args_1, function (observedArgs) {
                var template = args_1.tooltip.template;
                if (template !== null && Object.keys(template).length === 1) {
                    template = template[Object.keys(template)[0]];
                }
                var themes = _this.gauge.theme.toLowerCase();
                if (!args_1.cancel) {
                    args_1['tooltip']['properties']['textStyle']['color'] = _this.tooltip.textStyle.color ||
                        _this.gauge.themeStyle.tooltipFontColor;
                    _this.svgTooltip = new Tooltip({
                        enable: true,
                        header: '',
                        data: { value: args_1.pointer.currentValue },
                        template: template,
                        content: [args_1.content],
                        shapes: [],
                        location: args_1.location,
                        palette: [],
                        inverted: !(args_1.gauge.orientation === 'Horizontal'),
                        enableAnimation: args_1.tooltip.enableAnimation,
                        fill: _this.tooltip.fill || _this.gauge.themeStyle.tooltipFillColor,
                        availableSize: _this.gauge.availableSize,
                        areaBounds: new Rect(areaRect_1.left, tooltipPos_1 === 'Bottom' ? location_1.y : areaRect_1.top, tooltipPos_1 === 'Right' ? Math.abs(areaRect_1.left - location_1.x) : areaRect_1.width, areaRect_1.height),
                        textStyle: args_1.tooltip.textStyle,
                        border: args_1.tooltip.border,
                        theme: args_1.gauge.theme,
                        blazorTemplate: { name: 'TooltipTemplate', parent: _this.gauge.tooltip }
                    });
                    _this.svgTooltip.opacity = _this.gauge.themeStyle.tooltipFillOpacity || _this.svgTooltip.opacity;
                    _this.svgTooltip.appendTo(tooltipEle);
                }
            });
        }
        else {
            this.removeTooltip();
        }
    };
    GaugeTooltip.prototype.getTooltipPosition = function () {
        var position;
        if (this.gauge.orientation === 'Vertical') {
            position = (!this.currentAxis.opposedPosition) ? 'Left' : 'Right';
        }
        else {
            position = (this.currentAxis.opposedPosition) ? 'Top' : 'Bottom';
        }
        return position;
    };
    GaugeTooltip.prototype.getTooltipLocation = function () {
        var location;
        var bounds;
        var lineX;
        var lineY;
        var size = new Size(this.gauge.availableSize.width, this.gauge.availableSize.height);
        var x;
        var y;
        var height;
        var width;
        var lineId = this.gauge.element.id + '_AxisLine_' + this.axisIndex;
        var tickID = this.gauge.element.id + '_MajorTicksLine_' + this.axisIndex;
        var lineBounds;
        if (getElement(lineId)) {
            lineBounds = getElement(lineId).getBoundingClientRect();
            lineX = lineBounds.left;
            lineY = lineBounds.top;
        }
        else {
            lineBounds = getElement(tickID).getBoundingClientRect();
            lineX = (!this.currentAxis.opposedPosition) ? (lineBounds.left + lineBounds.width) : lineBounds.left;
            lineY = (!this.currentAxis.opposedPosition) ? (lineBounds.top + lineBounds.height) : lineBounds.top;
        }
        bounds = this.pointerElement.getBoundingClientRect();
        var elementRect = this.gauge.element.getBoundingClientRect();
        x = bounds.left - elementRect.left;
        y = bounds.top - elementRect.top;
        height = bounds.height;
        width = bounds.width;
        if (this.gauge.orientation === 'Vertical') {
            x = (lineX - elementRect.left);
            y = (this.currentPointer.type === 'Marker') ? y + (height / 2) : (!this.currentAxis.isInversed) ? y : y + height;
        }
        else {
            y = (lineY - elementRect.top);
            x = (this.currentPointer.type === 'Marker') ? (x + width / 2) : (!this.currentAxis.isInversed) ? x + width : x;
        }
        location = new GaugeLocation(x, y);
        return location;
    };
    GaugeTooltip.prototype.removeTooltip = function () {
        if (document.getElementsByClassName('EJ2-LinearGauge-Tooltip').length > 0) {
            document.getElementsByClassName('EJ2-LinearGauge-Tooltip')[0].remove();
        }
    };
    GaugeTooltip.prototype.mouseUpHandler = function (e) {
        this.renderTooltip(e);
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
    };
    /**
     * To bind events for tooltip module
     */
    GaugeTooltip.prototype.addEventListener = function () {
        if (this.gauge.isDestroyed) {
            return;
        }
        this.gauge.on(Browser.touchMoveEvent, this.renderTooltip, this);
        this.gauge.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    };
    /**
     * To unbind events for tooltip module
     */
    GaugeTooltip.prototype.removeEventListener = function () {
        if (this.gauge.isDestroyed) {
            return;
        }
        this.gauge.off(Browser.touchMoveEvent, this.renderTooltip);
        this.gauge.off(Browser.touchEndEvent, this.mouseUpHandler);
    };
    /*
     * Get module name.
     */
    GaugeTooltip.prototype.getModuleName = function () {
        return 'Tooltip';
    };
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    GaugeTooltip.prototype.destroy = function (gauge) {
        // Destroy method performed here
        this.removeEventListener();
    };
    return GaugeTooltip;
}());

/** @private */
function getThemeStyle(theme) {
    var style;
    switch (theme.toLowerCase()) {
        case 'materialdark':
        case 'fabricdark':
        case 'bootstrapdark':
            style = {
                backgroundColor: '#333232',
                titleFontColor: '#ffffff',
                tooltipFillColor: '#FFFFFF',
                tooltipFontColor: '#000000',
                labelColor: '#DADADA',
                lineColor: '#C8C8C8',
                majorTickColor: '#C8C8C8',
                minorTickColor: '#9A9A9A',
                pointerColor: '#9A9A9A'
            };
            break;
        case 'highcontrast':
            style = {
                backgroundColor: '#000000',
                titleFontColor: '#FFFFFF',
                tooltipFillColor: '#ffffff',
                tooltipFontColor: '#000000',
                labelColor: '#FFFFFF',
                lineColor: '#FFFFFF',
                majorTickColor: '#FFFFFF',
                minorTickColor: '#FFFFFF',
                pointerColor: '#FFFFFF'
            };
            break;
        case 'bootstrap4':
            style = {
                backgroundColor: '#FFFFFF',
                titleFontColor: '#212529',
                tooltipFillColor: '#000000',
                tooltipFontColor: '#FFFFFF',
                labelColor: '#212529',
                lineColor: '#ADB5BD',
                majorTickColor: '#ADB5BD',
                minorTickColor: '#CED4DA',
                pointerColor: '#6C757D',
                fontFamily: 'HelveticaNeue-Medium',
                fontSize: '16px',
                labelFontFamily: 'HelveticaNeue',
                tooltipFillOpacity: 1,
                tooltipTextOpacity: 0.9,
                containerBackground: '#F8F9FA'
            };
            break;
        default:
            style = {
                backgroundColor: '#FFFFFF',
                titleFontColor: '#424242',
                tooltipFillColor: '#FFFFF',
                tooltipFontColor: '#FFFFFF',
                labelColor: '#686868',
                lineColor: '#a6a6a6',
                majorTickColor: '#a6a6a6',
                minorTickColor: '#a6a6a6',
                pointerColor: '#a6a6a6',
                containerBackground: '#e0e0e0'
            };
            break;
    }
    return style;
}

/**
 * Represent the print and export for gauge
 */
var ExportUtils = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for gauge
     * @param control
     */
    function ExportUtils(control) {
        this.control = control;
    }
    /**
     * To print the gauge
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
     * To get the html string of the gauge
     * @param elements
     * @private
     */
    ExportUtils.prototype.getHTMLContent = function (elements) {
        var div = createElement('div');
        if (elements) {
            if (elements instanceof Array) {
                elements.forEach(function (value) {
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
 * Represents the EJ2 Linear gauge control.
 * ```html
 * <div id="container"/>
 * <script>
 *   var gaugeObj = new LinearGauge({ });
 *   gaugeObj.appendTo("#container");
 * </script>
 * ```
 */
var LinearGauge = /** @__PURE__ @class */ (function (_super) {
    __extends(LinearGauge, _super);
    /**
     * @private
     * Constructor for creating the widget
     * @hidden
     */
    function LinearGauge(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @private */
        _this.pointerDrag = false;
        /** @private */
        _this.mouseX = 0;
        /** @private */
        _this.mouseY = 0;
        /** @private */
        _this.gaugeResized = false;
        return _this;
    }
    /**
     * Initialize the preRender method.
     */
    LinearGauge.prototype.preRender = function () {
        this.isBlazor = isBlazor();
        this.unWireEvents();
        this.trigger(load, { gauge: !this.isBlazor ? this : null });
        this.initPrivateVariable();
        this.setCulture();
        this.createSvg();
        this.wireEvents();
    };
    LinearGauge.prototype.setTheme = function () {
        this.themeStyle = getThemeStyle(this.theme);
    };
    LinearGauge.prototype.initPrivateVariable = function () {
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-lineargauge').length;
            this.element.id = 'lineargauge_' + 'control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);
        this.gaugeAxisLayoutPanel = new AxisLayoutPanel(this);
        this.axisRenderer = new AxisRenderer(this);
    };
    /**
     * Method to set culture for chart
     */
    LinearGauge.prototype.setCulture = function () {
        this.intl = new Internationalization();
    };
    /**
     * Methods to create svg element
     */
    LinearGauge.prototype.createSvg = function () {
        this.removeSvg();
        this.calculateSize();
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + '_svg',
            width: this.availableSize.width,
            height: this.availableSize.height
        });
    };
    /**
     * To Remove the SVG.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.removeSvg = function () {
        for (var i = 0; i < this.annotations.length; i++) {
            resetBlazorTemplate(this.element.id + '_ContentTemplate' + i, 'ContentTemplate');
        }
        removeElement(this.element.id + '_Secondary_Element');
        if (!(isNullOrUndefined(this.svgObject)) && !isNullOrUndefined(this.svgObject.parentNode)) {
            remove(this.svgObject);
        }
    };
    /**
     * Method to calculate the size of the gauge
     */
    LinearGauge.prototype.calculateSize = function () {
        var width = stringToNumber(this.width, this.element.offsetWidth) || this.element.offsetWidth || 600;
        var height = stringToNumber(this.height, this.element.offsetHeight) || this.element.offsetHeight || 450;
        this.availableSize = new Size(width, height);
    };
    /**
     * To Initialize the control rendering
     */
    LinearGauge.prototype.render = function () {
        this.setTheme();
        this.renderGaugeElements();
        this.calculateBounds();
        this.renderAxisElements();
        this.renderComplete();
    };
    /**
     * @private
     * To render the gauge elements
     */
    LinearGauge.prototype.renderGaugeElements = function () {
        this.appendSecondaryElement();
        this.renderBorder();
        this.renderTitle();
        this.renderContainer();
    };
    LinearGauge.prototype.appendSecondaryElement = function () {
        if (isNullOrUndefined(getElement(this.element.id + '_Secondary_Element'))) {
            var secondaryElement = createElement('div');
            secondaryElement.id = this.element.id + '_Secondary_Element';
            secondaryElement.setAttribute('style', 'position: relative');
            this.element.appendChild(secondaryElement);
        }
    };
    /**
     * Render the map area border
     */
    LinearGauge.prototype.renderArea = function () {
        var size = measureText(this.title, this.titleStyle);
        var rectSize = new Rect(this.actualRect.x, this.actualRect.y - (size.height / 2), this.actualRect.width, this.actualRect.height);
        var rect = new RectOption(this.element.id + 'LinearGaugeBorder', this.background || this.themeStyle.backgroundColor, this.border, 1, rectSize);
        this.svgObject.appendChild(this.renderer.drawRectangle(rect));
    };
    /**
     * @private
     * To calculate axes bounds
     */
    LinearGauge.prototype.calculateBounds = function () {
        this.gaugeAxisLayoutPanel.calculateAxesBounds();
    };
    /**
     * @private
     * To render axis elements
     */
    LinearGauge.prototype.renderAxisElements = function () {
        this.axisRenderer.renderAxes();
        this.element.appendChild(this.svgObject);
        if (this.annotationsModule) {
            this.annotationsModule.renderAnnotationElements();
        }
        this.trigger(loaded, { gauge: !this.isBlazor ? this : null });
    };
    LinearGauge.prototype.renderBorder = function () {
        var width = this.border.width;
        if (width > 0) {
            var rect = new RectOption(this.element.id + '_LinearGaugeBorder', this.background || this.themeStyle.backgroundColor, this.border, 1, new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width), null, null);
            this.svgObject.appendChild(this.renderer.drawRectangle(rect));
        }
    };
    LinearGauge.prototype.renderTitle = function () {
        var x;
        var y;
        var height;
        var width;
        var titleBounds;
        var size = measureText(this.title, this.titleStyle);
        var options = new TextOption(this.element.id + '_LinearGaugeTitle', this.availableSize.width / 2, this.margin.top + (size.height / 2), 'middle', this.title);
        titleBounds = {
            x: options.x - (size.width / 2),
            y: options.y,
            width: size.width,
            height: size.height
        };
        x = this.margin.left;
        y = (isNullOrUndefined(titleBounds)) ? this.margin.top : titleBounds.y;
        height = (this.availableSize.height - y - this.margin.bottom);
        width = (this.availableSize.width - this.margin.left - this.margin.right);
        this.actualRect = { x: x, y: y, width: width, height: height };
        if (this.title) {
            this.titleStyle.fontFamily = this.themeStyle.fontFamily || this.titleStyle.fontFamily;
            this.titleStyle.size = this.themeStyle.fontSize || this.titleStyle.size;
            var element = textElement(options, this.titleStyle, this.titleStyle.color || this.themeStyle.titleFontColor, this.svgObject);
            element.setAttribute('aria-label', this.description || this.title);
            element.setAttribute('tabindex', this.tabIndex.toString());
        }
    };
    /*
     * Method to unbind the gauge events
     */
    LinearGauge.prototype.unWireEvents = function () {
        EventHandler.remove(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMove);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'contextmenu', this.gaugeRightClick);
        EventHandler.remove(this.element, (Browser.isPointer ? 'pointerleave' : 'mouseleave'), this.mouseLeave);
        EventHandler.remove(window, (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.gaugeResize.bind(this));
    };
    /*
     * Method to bind the gauge events
     */
    LinearGauge.prototype.wireEvents = function () {
        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'contextmenu', this.gaugeRightClick, this);
        EventHandler.add(this.element, (Browser.isPointer ? 'pointerleave' : 'mouseleave'), this.mouseLeave, this);
        EventHandler.add(window, (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.gaugeResize, this);
        this.setStyle(this.element);
    };
    LinearGauge.prototype.setStyle = function (element) {
        element.style.touchAction = isPointerDrag(this.axes) ? 'none' : 'element';
        element.style.msTouchAction = isPointerDrag(this.axes) ? 'none' : 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
    };
    /**
     * Handles the gauge resize.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.gaugeResize = function (e) {
        var _this = this;
        var args = {
            gauge: !this.isBlazor ? this : null,
            previousSize: new Size(this.availableSize.width, this.availableSize.height),
            name: resized,
            currentSize: new Size(0, 0)
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        if (this.element.classList.contains('e-lineargauge')) {
            this.resizeTo = window.setTimeout(function () {
                _this.createSvg();
                _this.renderGaugeElements();
                _this.calculateBounds();
                _this.renderAxisElements();
                args.currentSize = new Size(_this.availableSize.width, _this.availableSize.height);
                _this.trigger(resized, args);
                _this.render();
            }, 500);
        }
        return false;
    };
    /**
     * To destroy the gauge element from the DOM.
     */
    LinearGauge.prototype.destroy = function () {
        this.unWireEvents();
        this.removeSvg();
        _super.prototype.destroy.call(this);
    };
    /**
     * @private
     * To render the gauge container
     */
    LinearGauge.prototype.renderContainer = function () {
        var width;
        var height;
        var x;
        var y;
        var options;
        var path = '';
        var topRadius;
        var bottomRadius;
        var fill = (this.container.backgroundColor !== 'transparent'
            || (this.theme !== 'Bootstrap4' && this.theme !== 'Material'))
            ? this.container.backgroundColor : this.themeStyle.containerBackground;
        var rect;
        var radius = this.container.width;
        bottomRadius = radius + ((radius / 2) / Math.PI);
        topRadius = radius / 2;
        if (this.orientation === 'Vertical') {
            height = this.actualRect.height;
            height = (this.container.height > 0 ? this.container.height : ((height / 2) - ((height / 2) / 4)) * 2);
            width = this.container.width;
            height = (this.container.type === 'Thermometer') ? height - (bottomRadius * 2) - topRadius : height;
            x = (this.actualRect.x + ((this.actualRect.width / 2) - (this.container.width / 2))) + this.container.offset;
            y = this.actualRect.y + ((this.actualRect.height / 2) - ((this.container.type === 'Thermometer') ?
                ((height + (bottomRadius * 2) - topRadius)) / 2 : height / 2));
            height = height;
        }
        else {
            width = (this.container.height > 0) ? this.container.height :
                ((this.actualRect.width / 2) - ((this.actualRect.width / 2) / 4)) * 2;
            width = (this.container.type === 'Thermometer') ? width - (bottomRadius * 2) - topRadius : width;
            x = this.actualRect.x + ((this.actualRect.width / 2) - ((this.container.type === 'Thermometer') ?
                (width - (bottomRadius * 2) + topRadius) / 2 : width / 2));
            y = (this.actualRect.y + ((this.actualRect.height / 2) - (this.container.width / 2))) + this.container.offset;
            height = this.container.width;
        }
        this.containerBounds = { x: x, y: y, width: width, height: height };
        if (this.containerBounds.width > 0) {
            this.containerObject = this.renderer.createGroup({ id: this.element.id + '_Container_Group', transform: 'translate( 0, 0)' });
            if (this.container.type === 'Normal') {
                rect = new RectOption(this.element.id + '_' + this.container.type + '_Layout', fill, this.container.border, 1, new Rect(x, y, width, height));
                this.containerObject.appendChild(this.renderer.drawRectangle(rect));
            }
            else {
                path = getBox(this.containerBounds, this.container.type, this.orientation, new Size(this.container.height, this.container.width), 'container', null, null, this.container.roundedCornerRadius);
                options = new PathOption(this.element.id + '_' + this.container.type + '_Layout', fill, this.container.border.width, this.container.border.color, 1, '', path);
                this.containerObject.appendChild(this.renderer.drawPath(options));
            }
            this.svgObject.appendChild(this.containerObject);
        }
    };
    /**
     * Handles the mouse down on gauge.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.gaugeOnMouseDown = function (e) {
        var _this = this;
        var element = e.target;
        var clientRect = this.element.getBoundingClientRect();
        var current;
        var args = this.getMouseArgs(e, 'touchstart', gaugeMouseDown);
        this.trigger(gaugeMouseDown, args, function (mouseArgs) {
            _this.mouseX = args.x;
            _this.mouseY = args.y;
            if (args.target) {
                if (!args.cancel && ((args.target.id.indexOf('MarkerPointer') > -1) || (args.target.id.indexOf('BarPointer') > -1))) {
                    current = _this.moveOnPointer(args.target);
                    if (!(isNullOrUndefined(current)) && current.pointer) {
                        _this.pointerDrag = true;
                        _this.mouseElement = args.target;
                    }
                }
            }
        });
        return true;
    };
    /**
     * Handles the mouse move.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.mouseMove = function (e) {
        var _this = this;
        var current;
        var args = this.getMouseArgs(e, 'touchmove', gaugeMouseMove);
        this.trigger(gaugeMouseMove, args, function (mouseArgs) {
            _this.mouseX = args.x;
            _this.mouseY = args.y;
            if (args.target && !args.cancel) {
                if ((args.target.id.indexOf('MarkerPointer') > -1) || (args.target.id.indexOf('BarPointer') > -1)) {
                    current = _this.moveOnPointer(args.target);
                    if (!(isNullOrUndefined(current)) && current.pointer) {
                        _this.element.style.cursor = current.style;
                    }
                }
                else {
                    _this.element.style.cursor = (_this.pointerDrag) ? _this.element.style.cursor : 'auto';
                }
                _this.gaugeOnMouseMove(e);
            }
        });
        this.notify(Browser.touchMoveEvent, e);
        return false;
    };
    /**
     * To find the mouse move on pointer.
     * @param element
     */
    LinearGauge.prototype.moveOnPointer = function (element) {
        var current;
        var clientRect = this.element.getBoundingClientRect();
        var axis;
        var isPointer = false;
        var pointer;
        var top;
        var left;
        var pointerElement = getElement(element.id);
        var svgPath = pointerElement;
        var cursorStyle;
        var process;
        current = getPointer(element, this);
        axis = current.axis;
        pointer = current.pointer;
        if (pointer.enableDrag) {
            if (pointer.type === 'Bar') {
                if (this.orientation === 'Vertical') {
                    top = pointerElement.getBoundingClientRect().top - clientRect.top;
                    top = (!axis.isInversed) ? top : top + svgPath.getBBox().height;
                    isPointer = !axis.isInversed ? (this.mouseY < (top + 10) && this.mouseY >= top) :
                        (this.mouseY <= top && this.mouseY > (top - 10));
                    cursorStyle = 'n-resize';
                }
                else {
                    left = pointerElement.getBoundingClientRect().left - clientRect.left;
                    left = (!axis.isInversed) ? left + svgPath.getBBox().width : left;
                    isPointer = !axis.isInversed ? (this.mouseX > (left - 10) && this.mouseX <= left) :
                        (this.mouseX >= left && this.mouseX < (left + 10));
                    cursorStyle = 'e-resize';
                }
            }
            else {
                isPointer = true;
                cursorStyle = 'pointer';
            }
        }
        if (isPointer) {
            process = { pointer: isPointer, style: cursorStyle };
        }
        return process;
    };
    /**
     * @private
     * Handle the right click
     * @param event
     */
    LinearGauge.prototype.gaugeRightClick = function (event) {
        if (event.buttons === 2 || event.pointerType === 'touch') {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        return true;
    };
    /**
     * Handles the mouse leave.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.mouseLeave = function (e) {
        var parentNode;
        var args = this.getMouseArgs(e, 'touchmove', gaugeMouseLeave);
        if (!isNullOrUndefined(this.mouseElement)) {
            parentNode = this.element;
            parentNode.style.cursor = '';
            this.mouseElement = null;
            this.pointerDrag = false;
        }
        return false;
    };
    /**
     * Handles the mouse move on gauge.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.gaugeOnMouseMove = function (e) {
        var current;
        if (this.pointerDrag) {
            current = getPointer(this.mouseElement, this);
            if (current.pointer.enableDrag && current.pointer.animationComplete) {
                this[current.pointer.type.toLowerCase() + 'Drag'](current.axis, current.pointer);
            }
        }
        return true;
    };
    /**
     * Handles the mouse up.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.mouseEnd = function (e) {
        var parentNode;
        var isTouch = e.pointerType === 'touch' || e.pointerType === '2' || e.type === 'touchend';
        var args = this.getMouseArgs(e, 'touchend', gaugeMouseUp);
        this.trigger(gaugeMouseUp, args);
        if (!isNullOrUndefined(this.mouseElement)) {
            parentNode = this.element;
            parentNode.style.cursor = '';
            this.mouseElement = null;
            this.pointerDrag = false;
        }
        this.notify(Browser.touchEndEvent, e);
        return true;
    };
    /**
     * Handles the print method for gauge control.
     */
    LinearGauge.prototype.print = function (id) {
        var exportChart = new ExportUtils(this);
        exportChart.print(id);
    };
    /**
     * Handles the export method for gauge control.
     * @param type
     * @param fileName
     */
    LinearGauge.prototype.export = function (type, fileName, orientation) {
        var exportMap = new ExportUtils(this);
        exportMap.export(type, fileName, orientation);
    };
    /**
     * Handles the mouse event arguments.
     * @return {IMouseEventArgs}
     * @private
     */
    LinearGauge.prototype.getMouseArgs = function (e, type, name) {
        var rect = this.element.getBoundingClientRect();
        var location = new GaugeLocation(-rect.left, -rect.top);
        var isTouch = (e.type === type);
        location.x += isTouch ? e.changedTouches[0].clientX : e.clientX;
        location.y += isTouch ? e.changedTouches[0].clientY : e.clientY;
        return {
            cancel: false, name: name,
            model: !this.isBlazor ? this : null,
            x: location.x, y: location.y,
            target: isTouch ? e.target : e.target
        };
    };
    /**
     * @private
     * @param axis
     * @param pointer
     */
    LinearGauge.prototype.markerDrag = function (axis, pointer) {
        var options;
        var value = convertPixelToValue(this.element, this.mouseElement, this.orientation, axis, 'drag', new GaugeLocation(this.mouseX, this.mouseY));
        var process = withInRange(value, null, null, axis.visibleRange.max, axis.visibleRange.min, 'pointer');
        if (withInRange(value, null, null, axis.visibleRange.max, axis.visibleRange.min, 'pointer')) {
            this.triggerDragEvent(this.mouseElement);
            options = new PathOption('pointerID', pointer.color || this.themeStyle.pointerColor, pointer.border.width, pointer.border.color, pointer.opacity, null, null, '');
            if (this.orientation === 'Vertical') {
                pointer.bounds.y = this.mouseY;
            }
            else {
                pointer.bounds.x = this.mouseX;
            }
            pointer.currentValue = value;
            options = calculateShapes(pointer.bounds, pointer.markerType, new Size(pointer.width, pointer.height), pointer.imageUrl, options, this.orientation, axis, pointer);
            if (pointer.markerType === 'Image') {
                this.mouseElement.setAttribute('x', (pointer.bounds.x - (pointer.bounds.width / 2)).toString());
                this.mouseElement.setAttribute('y', (pointer.bounds.y - (pointer.bounds.height / 2)).toString());
            }
            else {
                this.mouseElement.setAttribute('d', options.d);
            }
        }
    };
    /**
     * @private
     * @param axis
     * @param pointer
     */
    LinearGauge.prototype.barDrag = function (axis, pointer) {
        var line = axis.lineBounds;
        var range = axis.visibleRange;
        var value1;
        var value2;
        var isDrag;
        var lineHeight = (this.orientation === 'Vertical') ? line.height : line.width;
        var lineY = (this.orientation === 'Vertical') ? line.y : line.x;
        var path;
        value1 = ((valueToCoefficient(range.min, axis, this.orientation, range) * lineHeight) + lineY);
        value2 = ((valueToCoefficient(range.max, axis, this.orientation, range) * lineHeight) + lineY);
        if (this.orientation === 'Vertical') {
            isDrag = (!axis.isInversed) ? (this.mouseY > value2 && this.mouseY < value1) : (this.mouseY > value1 && this.mouseY < value2);
            if (isDrag) {
                if (this.container.type === 'Normal') {
                    if (!axis.isInversed) {
                        this.mouseElement.setAttribute('y', this.mouseY.toString());
                    }
                    this.mouseElement.setAttribute('height', Math.abs(value1 - this.mouseY).toString());
                }
                else {
                    if (!axis.isInversed) {
                        pointer.bounds.y = this.mouseY;
                    }
                    pointer.bounds.height = Math.abs(value1 - this.mouseY);
                }
            }
        }
        else {
            isDrag = (!axis.isInversed) ? (this.mouseX > value1 && this.mouseX < value2) : (this.mouseX > value2 && this.mouseX < value1);
            if (isDrag) {
                if (this.container.type === 'Normal') {
                    if (axis.isInversed) {
                        this.mouseElement.setAttribute('x', this.mouseX.toString());
                    }
                    this.mouseElement.setAttribute('width', Math.abs(value1 - this.mouseX).toString());
                }
                else {
                    if (axis.isInversed) {
                        pointer.bounds.x = this.mouseX;
                    }
                    pointer.bounds.width = Math.abs(value1 - this.mouseX);
                }
            }
        }
        if (isDrag && this.mouseElement.tagName === 'path') {
            this.triggerDragEvent(this.mouseElement);
            path = getBox(pointer.bounds, this.container.type, this.orientation, new Size(pointer.bounds.width, pointer.bounds.height), 'bar', this.container.width, axis, pointer.roundedCornerRadius);
            this.mouseElement.setAttribute('d', path);
        }
    };
    /**
     * Triggers when drag the pointer
     * @param activeElement
     */
    LinearGauge.prototype.triggerDragEvent = function (activeElement) {
        var active = getPointer(this.mouseElement, this);
        var value = convertPixelToValue(this.element, this.mouseElement, this.orientation, active.axis, 'tooltip', null);
        var dragArgs = {
            name: 'valueChange',
            gauge: !this.isBlazor ? this : null,
            element: this.mouseElement,
            axisIndex: active.axisIndex,
            axis: active.axis,
            pointerIndex: active.pointerIndex,
            pointer: active.pointer,
            value: value
        };
        this.trigger(valueChange, dragArgs);
    };
    /**
     * To set the pointer value using this method
     * @param axisIndex
     * @param pointerIndex
     * @param value
     */
    LinearGauge.prototype.setPointerValue = function (axisIndex, pointerIndex, value) {
        var axis = this.axes[axisIndex];
        var pointer = axis.pointers[pointerIndex];
        var id = this.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer_' + pointerIndex;
        var pointerElement = getElement(id);
        pointer.currentValue = value;
        if ((pointerElement !== null) && withInRange(pointer.currentValue, null, null, axis.visibleRange.max, axis.visibleRange.min, 'pointer')) {
            this.gaugeAxisLayoutPanel['calculate' + pointer.type + 'Bounds'](axisIndex, axis, pointerIndex, pointer);
            this.axisRenderer['draw' + pointer.type + 'Pointer'](axis, axisIndex, pointer, pointerIndex, pointerElement.parentElement);
        }
    };
    /**
     * To set the annotation value using this method.
     * @param annotationIndex
     * @param content
     */
    LinearGauge.prototype.setAnnotationValue = function (annotationIndex, content, axisValue) {
        var elementExist = getElement(this.element.id + '_Annotation_' + annotationIndex) === null;
        var element = getElement(this.element.id + '_AnnotationsGroup') ||
            createElement('div', {
                id: this.element.id + '_AnnotationsGroup'
            });
        var annotation = this.annotations[annotationIndex];
        if (content !== null) {
            removeElement(this.element.id + '_Annotation_' + annotationIndex);
            annotation.content = content;
            annotation.axisValue = axisValue ? axisValue : annotation.axisValue;
            this.annotationsModule.createAnnotationTemplate(element, annotationIndex);
            if (!elementExist) {
                element.appendChild(getElement(this.element.id + '_Annotation_' + annotationIndex));
            }
        }
    };
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    LinearGauge.prototype.requiredModules = function () {
        var modules = [];
        var annotationEnable = false;
        this.annotations.map(function (annotation, index) {
            annotationEnable = annotation.content != null;
        });
        if (annotationEnable) {
            modules.push({
                member: 'Annotations',
                args: [this, Annotations]
            });
        }
        if (this.tooltip.enable) {
            modules.push({
                member: 'Tooltip',
                args: [this, GaugeTooltip]
            });
        }
        return modules;
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    LinearGauge.prototype.getPersistData = function () {
        var keyEntity = ['loaded'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Get component name
     */
    LinearGauge.prototype.getModuleName = function () {
        return 'lineargauge';
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    LinearGauge.prototype.onPropertyChanged = function (newProp, oldProp) {
        var renderer = false;
        var refreshBounds = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'height':
                case 'width':
                case 'margin':
                    this.createSvg();
                    refreshBounds = true;
                    break;
                case 'title':
                    refreshBounds = (newProp.title === '' || oldProp.title === '');
                    renderer = !(newProp.title === '' || oldProp.title === '');
                    break;
                case 'titleStyle':
                    if (newProp.titleStyle && newProp.titleStyle.size) {
                        refreshBounds = true;
                    }
                    else {
                        renderer = true;
                    }
                    break;
                case 'border':
                    renderer = true;
                    break;
                case 'background':
                    renderer = true;
                    break;
                case 'container':
                case 'axes':
                case 'orientation':
                    refreshBounds = true;
                    break;
            }
        }
        if (!refreshBounds && renderer) {
            this.removeSvg();
            this.renderGaugeElements();
            this.renderAxisElements();
        }
        if (refreshBounds) {
            this.createSvg();
            this.renderGaugeElements();
            this.calculateBounds();
            this.renderAxisElements();
        }
    };
    __decorate([
        Property(null)
    ], LinearGauge.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], LinearGauge.prototype, "height", void 0);
    __decorate([
        Property('Vertical')
    ], LinearGauge.prototype, "orientation", void 0);
    __decorate([
        Complex({}, Margin)
    ], LinearGauge.prototype, "margin", void 0);
    __decorate([
        Complex({ color: '', width: 0 }, Border)
    ], LinearGauge.prototype, "border", void 0);
    __decorate([
        Property(null)
    ], LinearGauge.prototype, "background", void 0);
    __decorate([
        Property('')
    ], LinearGauge.prototype, "title", void 0);
    __decorate([
        Complex({ size: '15px', color: null }, Font)
    ], LinearGauge.prototype, "titleStyle", void 0);
    __decorate([
        Complex({}, Container)
    ], LinearGauge.prototype, "container", void 0);
    __decorate([
        Collection([{}], Axis)
    ], LinearGauge.prototype, "axes", void 0);
    __decorate([
        Complex({}, TooltipSettings)
    ], LinearGauge.prototype, "tooltip", void 0);
    __decorate([
        Collection([{}], Annotation)
    ], LinearGauge.prototype, "annotations", void 0);
    __decorate([
        Property([])
    ], LinearGauge.prototype, "rangePalettes", void 0);
    __decorate([
        Property(false)
    ], LinearGauge.prototype, "useGroupingSeparator", void 0);
    __decorate([
        Property(null)
    ], LinearGauge.prototype, "description", void 0);
    __decorate([
        Property(1)
    ], LinearGauge.prototype, "tabIndex", void 0);
    __decorate([
        Property(null)
    ], LinearGauge.prototype, "format", void 0);
    __decorate([
        Property('Material')
    ], LinearGauge.prototype, "theme", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "loaded", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "load", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "animationComplete", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "axisLabelRender", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "annotationRender", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "tooltipRender", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "gaugeMouseMove", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "gaugeMouseLeave", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "gaugeMouseDown", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "gaugeMouseUp", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "valueChange", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "resized", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "beforePrint", void 0);
    LinearGauge = __decorate([
        NotifyPropertyChanges
    ], LinearGauge);
    return LinearGauge;
}(Component));

/**
 * Linear gauge component exported items
 */

/**
 * LinearGauge component exported.
 */

export { LinearGauge, Font, Margin, Border, Annotation, Container, TooltipSettings, Line, Label, Range, Tick, Pointer, Axis, stringToNumber, measureText, withInRange, convertPixelToValue, getPathToRect, getElement, removeElement, isPointerDrag, valueToCoefficient, getFontStyle, textFormatter, formatValue, getLabelFormat, getTemplateFunction, getElementOffset, VisibleRange, GaugeLocation, Size, Rect, CustomizeOption, PathOption, RectOption, TextOption, VisibleLabels, Align, textElement, calculateNiceInterval, getActualDesiredIntervalsCount, getPointer, getRangeColor, getRangePalette, calculateShapes, getBox, Annotations, GaugeTooltip };
//# sourceMappingURL=ej2-lineargauge.es5.js.map
