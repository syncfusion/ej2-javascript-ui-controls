window.sf = window.sf || {};
var sfsmithchart = (function (exports) {
'use strict';

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
var SmithchartFont = /** @class */ (function (_super) {
    __extends$2(SmithchartFont, _super);
    function SmithchartFont() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property('Segoe UI')
    ], SmithchartFont.prototype, "fontFamily", void 0);
    __decorate$1([
        sf.base.Property('Normal')
    ], SmithchartFont.prototype, "fontStyle", void 0);
    __decorate$1([
        sf.base.Property('Regular')
    ], SmithchartFont.prototype, "fontWeight", void 0);
    __decorate$1([
        sf.base.Property('')
    ], SmithchartFont.prototype, "color", void 0);
    __decorate$1([
        sf.base.Property('12px')
    ], SmithchartFont.prototype, "size", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], SmithchartFont.prototype, "opacity", void 0);
    return SmithchartFont;
}(sf.base.ChildProperty));
var SmithchartMargin = /** @class */ (function (_super) {
    __extends$2(SmithchartMargin, _super);
    function SmithchartMargin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(10)
    ], SmithchartMargin.prototype, "top", void 0);
    __decorate$1([
        sf.base.Property(10)
    ], SmithchartMargin.prototype, "bottom", void 0);
    __decorate$1([
        sf.base.Property(10)
    ], SmithchartMargin.prototype, "right", void 0);
    __decorate$1([
        sf.base.Property(10)
    ], SmithchartMargin.prototype, "left", void 0);
    return SmithchartMargin;
}(sf.base.ChildProperty));
var SmithchartBorder = /** @class */ (function (_super) {
    __extends$2(SmithchartBorder, _super);
    function SmithchartBorder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(0)
    ], SmithchartBorder.prototype, "width", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], SmithchartBorder.prototype, "opacity", void 0);
    __decorate$1([
        sf.base.Property('transparent')
    ], SmithchartBorder.prototype, "color", void 0);
    return SmithchartBorder;
}(sf.base.ChildProperty));
/**
 * Internal use of type rect
 */
var SmithchartRect = /** @class */ (function () {
    function SmithchartRect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return SmithchartRect;
}());
var LabelCollection = /** @class */ (function () {
    function LabelCollection() {
    }
    return LabelCollection;
}());
var LegendSeries = /** @class */ (function () {
    function LegendSeries() {
    }
    return LegendSeries;
}());
var LabelRegion = /** @class */ (function () {
    function LabelRegion() {
    }
    return LabelRegion;
}());
var HorizontalLabelCollection = /** @class */ (function (_super) {
    __extends$2(HorizontalLabelCollection, _super);
    function HorizontalLabelCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HorizontalLabelCollection;
}(LabelCollection));
var RadialLabelCollections = /** @class */ (function (_super) {
    __extends$2(RadialLabelCollections, _super);
    function RadialLabelCollections() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RadialLabelCollections;
}(HorizontalLabelCollection));
var LineSegment = /** @class */ (function () {
    function LineSegment() {
    }
    return LineSegment;
}());
var PointRegion = /** @class */ (function () {
    function PointRegion() {
    }
    return PointRegion;
}());
/**
 * Smithchart internal class for point
 */
var Point = /** @class */ (function () {
    function Point() {
    }
    return Point;
}());
var ClosestPoint = /** @class */ (function () {
    function ClosestPoint() {
    }
    return ClosestPoint;
}());
var MarkerOptions = /** @class */ (function () {
    function MarkerOptions(id, fill, borderColor, borderWidth, opacity) {
        this.id = id;
        this.fill = fill;
        this.borderColor = borderColor;
        this.borderWidth = borderWidth;
        this.opacity = opacity;
    }
    return MarkerOptions;
}());
var SmithchartLabelPosition = /** @class */ (function () {
    function SmithchartLabelPosition() {
    }
    return SmithchartLabelPosition;
}());
var Direction = /** @class */ (function () {
    function Direction() {
        this.counterclockwise = 0;
        this.clockwise = 1;
    }
    return Direction;
}());
var DataLabelTextOptions = /** @class */ (function () {
    function DataLabelTextOptions() {
    }
    return DataLabelTextOptions;
}());
var LabelOption = /** @class */ (function () {
    function LabelOption() {
    }
    return LabelOption;
}());
/** @private */
var SmithchartSize = /** @class */ (function () {
    function SmithchartSize(width, height) {
        this.width = width;
        this.height = height;
    }
    return SmithchartSize;
}());
var GridArcPoints = /** @class */ (function () {
    function GridArcPoints() {
    }
    return GridArcPoints;
}());

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
function createSvg(smithchart) {
    smithchart.renderer = new sf.svgbase.SvgRenderer(smithchart.element.id);
    calculateSize(smithchart);
    smithchart.svgObject = smithchart.renderer.createSvg({
        id: smithchart.element.id + '_svg',
        width: smithchart.availableSize.width,
        height: smithchart.availableSize.height
    });
}
function getElement(id) {
    return document.getElementById(id);
}
/**
 * @private
 * Trim the title text
 */
function textTrim(maxwidth, text, font) {
    var label = text;
    var size = measureText(text, font).width;
    if (size > maxwidth) {
        var textLength = text.length;
        for (var i = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i) + '...';
            size = measureText(label, font).width;
            if (size <= maxwidth || label.length < 4) {
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
 * Function     to compile the template function for maps.
 * @returns Function
 * @private
 */
function getTemplateFunction(templateString) {
    var templateFn = null;
    try {
        if (document.querySelectorAll(templateString).length) {
            templateFn = sf.base.compile(document.querySelector(templateString).innerHTML.trim());
        }
    }
    catch (e) {
        templateFn = sf.base.compile(templateString);
    }
    return templateFn;
}
function convertElementFromLabel(element, labelId, data, index, smithchart) {
    var labelEle = element[0];
    var templateHtml = labelEle.outerHTML;
    var properties = Object.keys(data);
    for (var i = 0; i < properties.length; i++) {
        templateHtml = templateHtml.replace(new RegExp('{{:' + properties[i] + '}}', 'g'), data[properties[i].toString()]);
    }
    return sf.base.createElement('div', {
        id: labelId,
        innerHTML: templateHtml,
        styles: 'position: absolute'
    });
}
function _getEpsilonValue() {
    var e = 1.0;
    while ((1.0 + 0.5 * e) !== 1.0) {
        e *= 0.5;
    }
    return e;
}
/**
 * Method to calculate the width and height of the smithchart
 */
function calculateSize(smithchart) {
    var containerWidth = smithchart.element.clientWidth;
    var containerHeight = smithchart.element.clientHeight;
    smithchart.availableSize = new SmithchartSize(stringToNumber(smithchart.width, containerWidth) || containerWidth || 600, stringToNumber(smithchart.height, containerHeight) || containerHeight || 450);
}
/**
 * Animation for template
 * @private
 */
function templateAnimate(smithchart, element, delay, duration, name) {
    var opacity = 0;
    var delta;
    var value;
    new sf.base.Animation({}).animate(element, {
        duration: duration,
        delay: delay,
        name: name,
        progress: function (args) {
            delta = ((args.timeStamp - args.delay) / args.duration);
            value = opacity + (delta * 1);
            args.element.style.opacity = value.toString();
        },
        end: function (args) {
            var opacity = 1;
            args.element.style.opacity = opacity.toString();
            smithchart.trigger('animationComplete', event);
        },
    });
}
/** @private */
function stringToNumber(value, containerSize) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/**
 * Internal use of path options
 * @private
 */
var PathOption = /** @class */ (function () {
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
/**
 * Internal use of rectangle options
 * @private
 */
var RectOption = /** @class */ (function (_super) {
    __extends$1(RectOption, _super);
    function RectOption(id, fill, border, opacity, rect) {
        var _this = _super.call(this, id, fill, border.width, border.color, opacity) || this;
        _this.y = rect.y;
        _this.x = rect.x;
        _this.height = rect.height;
        _this.width = rect.width;
        return _this;
    }
    return RectOption;
}(PathOption));
/**
 * Internal use of circle options
 * @private
 */
var CircleOption = /** @class */ (function (_super) {
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
function measureText(text, font) {
    var htmlObject = document.getElementById('smithchartmeasuretext');
    if (htmlObject === null) {
        htmlObject = sf.base.createElement('text', { id: 'smithchartmeasuretext' });
        document.body.appendChild(htmlObject);
    }
    htmlObject.innerHTML = text;
    htmlObject.style.position = 'absolute';
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.left = '0';
    htmlObject.style.top = '-100';
    htmlObject.style.whiteSpace = 'nowrap';
    htmlObject.style.fontSize = font.size;
    htmlObject.style.fontWeight = font.fontWeight;
    htmlObject.style.fontStyle = font.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily;
    // For bootstrap line height issue
    htmlObject.style.lineHeight = 'normal';
    return new SmithchartSize(htmlObject.clientWidth, htmlObject.clientHeight);
}
/**
 * Internal use of text options
 * @private
 */
var TextOption = /** @class */ (function () {
    function TextOption(id, x, y, anchor, text) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.text = text;
    }
    return TextOption;
}());
/**
 * To remove element by id
 */
function removeElement(id) {
    var element = document.getElementById(id);
    return element ? sf.base.remove(element) : null;
}
/**
 * Animation Effect Calculation Started Here
 * @param currentTime
 * @param startValue
 * @param endValue
 * @param duration
 * @private
 */
function linear(currentTime, startValue, endValue, duration) {
    return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
}
function reverselinear(currentTime, startValue, endValue, duration) {
    return -startValue * Math.sin(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
}
/** @private */
function getAnimationFunction(effect) {
    var functionName;
    switch (effect) {
        case 'Linear':
            functionName = linear;
            break;
        case 'Reverse':
            functionName = reverselinear;
            break;
    }
    return functionName;
}
/**
 * Internal rendering of text
 * @private
 */
function renderTextElement(options, font, color, parent) {
    var renderOptions = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'fill': color,
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'text-anchor': options.anchor,
        'opacity': font.opacity
    };
    var text = options.text;
    var renderer = new sf.svgbase.SvgRenderer('');
    var htmlObject = renderer.createText(renderOptions, text);
    parent.appendChild(htmlObject);
    return htmlObject;
}

var Theme;
(function (Theme) {
    /** @private */
    Theme.axisLabelFont = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
    /** @private */
    Theme.smithchartTitleFont = {
        size: '15px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
    /** @private */
    Theme.smithchartSubtitleFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
    /** @private */
    Theme.dataLabelFont = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
    /** @private */
    Theme.legendLabelFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif'
    };
})(Theme || (Theme = {}));
/** @private */
function getSeriesColor(theme) {
    var palette;
    switch (theme.toLowerCase()) {
        case 'highcontrastlight':
            palette = ['#79ECE4', '#E98272', '#DFE6B6', '#C6E773', '#BA98FF',
                '#FA83C3', '#00C27A', '#43ACEF', '#D681EF', '#D8BC6E'];
            break;
        case 'fabric':
            palette = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
                '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300'];
            break;
        case 'bootstrap':
            palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
                '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
            break;
        default:
            palette = ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883',
                '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb', '#ea7a57'];
            break;
    }
    return palette;
}
/** @private */
function getThemeColor(theme) {
    var style;
    var themes = theme.toLowerCase();
    switch (themes) {
        case 'highcontrast':
            style = {
                axisLabel: '#ffffff',
                axisLine: '#ffffff',
                majorGridLine: '#BFBFBF',
                minorGridLine: '#969696',
                chartTitle: '#ffffff',
                legendLabel: '#ffffff',
                background: '#000000',
                areaBorder: '#ffffff',
                tooltipFill: '#ffffff',
                dataLabel: '#ffffff',
                tooltipBoldLabel: '#000000',
                tooltipLightLabel: '#000000',
                tooltipHeaderLine: '#969696',
            };
            break;
        case 'materialdark':
        case 'bootstrapdark':
        case 'fabricdark':
            style = {
                axisLabel: '#DADADA',
                axisLine: ' #6F6C6C',
                majorGridLine: '#414040',
                minorGridLine: '#514F4F',
                chartTitle: '#ffffff',
                legendLabel: '#DADADA',
                background: '#000000',
                areaBorder: ' #9A9A9A',
                tooltipFill: '#F4F4F4',
                dataLabel: '#DADADA',
                tooltipBoldLabel: '#282727',
                tooltipLightLabel: '#333232',
                tooltipHeaderLine: '#9A9A9A'
            };
            break;
        case 'bootstrap4':
            style = {
                axisLabel: '#212529',
                axisLine: '#ADB5BD',
                majorGridLine: '#CED4DA',
                minorGridLine: '#DEE2E6',
                chartTitle: '#212529',
                legendLabel: '#212529',
                background: '#FFFFFF',
                areaBorder: '#DEE2E6',
                tooltipFill: '#000000',
                dataLabel: '#212529',
                tooltipBoldLabel: '#FFFFFF',
                tooltipLightLabel: '#FFFFFF',
                tooltipHeaderLine: '#FFFFFF',
                fontFamily: 'HelveticaNeue-Medium',
                fontSize: '16px',
                labelFontFamily: 'HelveticaNeue',
                tooltipFillOpacity: 1,
                tooltipTextOpacity: 0.9
            };
            break;
        default:
            style = {
                axisLabel: '#686868',
                axisLine: '#b5b5b5',
                majorGridLine: '#dbdbdb',
                minorGridLine: '#eaeaea',
                chartTitle: '#424242',
                legendLabel: '#353535',
                background: '#FFFFFF',
                areaBorder: 'Gray',
                tooltipFill: 'rgba(0, 8, 22, 0.75)',
                dataLabel: '#424242',
                tooltipBoldLabel: '#ffffff',
                tooltipLightLabel: '#dbdbdb',
                tooltipHeaderLine: '#ffffff'
            };
            break;
    }
    return style;
}

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
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LegendTitle = /** @class */ (function (_super) {
    __extends$3(LegendTitle, _super);
    function LegendTitle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(true)
    ], LegendTitle.prototype, "visible", void 0);
    __decorate$2([
        sf.base.Property('')
    ], LegendTitle.prototype, "text", void 0);
    __decorate$2([
        sf.base.Property('')
    ], LegendTitle.prototype, "description", void 0);
    __decorate$2([
        sf.base.Property('Center')
    ], LegendTitle.prototype, "textAlignment", void 0);
    __decorate$2([
        sf.base.Complex(Theme.legendLabelFont, SmithchartFont)
    ], LegendTitle.prototype, "textStyle", void 0);
    return LegendTitle;
}(sf.base.ChildProperty));
var LegendLocation = /** @class */ (function (_super) {
    __extends$3(LegendLocation, _super);
    function LegendLocation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(0)
    ], LegendLocation.prototype, "x", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], LegendLocation.prototype, "y", void 0);
    return LegendLocation;
}(sf.base.ChildProperty));
var LegendItemStyleBorder = /** @class */ (function (_super) {
    __extends$3(LegendItemStyleBorder, _super);
    function LegendItemStyleBorder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(1)
    ], LegendItemStyleBorder.prototype, "width", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], LegendItemStyleBorder.prototype, "color", void 0);
    return LegendItemStyleBorder;
}(sf.base.ChildProperty));
var LegendItemStyle = /** @class */ (function (_super) {
    __extends$3(LegendItemStyle, _super);
    function LegendItemStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(10)
    ], LegendItemStyle.prototype, "width", void 0);
    __decorate$2([
        sf.base.Property(10)
    ], LegendItemStyle.prototype, "height", void 0);
    __decorate$2([
        sf.base.Complex({}, LegendItemStyleBorder)
    ], LegendItemStyle.prototype, "border", void 0);
    return LegendItemStyle;
}(sf.base.ChildProperty));
var LegendBorder = /** @class */ (function (_super) {
    __extends$3(LegendBorder, _super);
    function LegendBorder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(1)
    ], LegendBorder.prototype, "width", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], LegendBorder.prototype, "color", void 0);
    return LegendBorder;
}(sf.base.ChildProperty));
var SmithchartLegendSettings = /** @class */ (function (_super) {
    __extends$3(SmithchartLegendSettings, _super);
    function SmithchartLegendSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(false)
    ], SmithchartLegendSettings.prototype, "visible", void 0);
    __decorate$2([
        sf.base.Property('bottom')
    ], SmithchartLegendSettings.prototype, "position", void 0);
    __decorate$2([
        sf.base.Property('Center')
    ], SmithchartLegendSettings.prototype, "alignment", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], SmithchartLegendSettings.prototype, "width", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], SmithchartLegendSettings.prototype, "height", void 0);
    __decorate$2([
        sf.base.Property('circle')
    ], SmithchartLegendSettings.prototype, "shape", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], SmithchartLegendSettings.prototype, "rowCount", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], SmithchartLegendSettings.prototype, "columnCount", void 0);
    __decorate$2([
        sf.base.Property(8)
    ], SmithchartLegendSettings.prototype, "itemPadding", void 0);
    __decorate$2([
        sf.base.Property(5)
    ], SmithchartLegendSettings.prototype, "shapePadding", void 0);
    __decorate$2([
        sf.base.Property('')
    ], SmithchartLegendSettings.prototype, "description", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], SmithchartLegendSettings.prototype, "toggleVisibility", void 0);
    __decorate$2([
        sf.base.Complex({}, LegendTitle)
    ], SmithchartLegendSettings.prototype, "title", void 0);
    __decorate$2([
        sf.base.Complex({}, LegendLocation)
    ], SmithchartLegendSettings.prototype, "location", void 0);
    __decorate$2([
        sf.base.Complex({}, LegendItemStyle)
    ], SmithchartLegendSettings.prototype, "itemStyle", void 0);
    __decorate$2([
        sf.base.Complex({}, LegendBorder)
    ], SmithchartLegendSettings.prototype, "border", void 0);
    __decorate$2([
        sf.base.Complex(Theme.legendLabelFont, SmithchartFont)
    ], SmithchartLegendSettings.prototype, "textStyle", void 0);
    return SmithchartLegendSettings;
}(sf.base.ChildProperty));

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
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the major Grid lines in the `axis`.
 */
var SmithchartMajorGridLines = /** @class */ (function (_super) {
    __extends$4(SmithchartMajorGridLines, _super);
    function SmithchartMajorGridLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(1)
    ], SmithchartMajorGridLines.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property('')
    ], SmithchartMajorGridLines.prototype, "dashArray", void 0);
    __decorate$3([
        sf.base.Property(true)
    ], SmithchartMajorGridLines.prototype, "visible", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], SmithchartMajorGridLines.prototype, "color", void 0);
    __decorate$3([
        sf.base.Property(1)
    ], SmithchartMajorGridLines.prototype, "opacity", void 0);
    return SmithchartMajorGridLines;
}(sf.base.ChildProperty));
/**
 * Configures the major grid lines in the `axis`.
 */
var SmithchartMinorGridLines = /** @class */ (function (_super) {
    __extends$4(SmithchartMinorGridLines, _super);
    function SmithchartMinorGridLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(1)
    ], SmithchartMinorGridLines.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property('')
    ], SmithchartMinorGridLines.prototype, "dashArray", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], SmithchartMinorGridLines.prototype, "visible", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], SmithchartMinorGridLines.prototype, "color", void 0);
    __decorate$3([
        sf.base.Property(8)
    ], SmithchartMinorGridLines.prototype, "count", void 0);
    return SmithchartMinorGridLines;
}(sf.base.ChildProperty));
/**
 * Configures the axis lines in the `axis`.
 */
var SmithchartAxisLine = /** @class */ (function (_super) {
    __extends$4(SmithchartAxisLine, _super);
    function SmithchartAxisLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(true)
    ], SmithchartAxisLine.prototype, "visible", void 0);
    __decorate$3([
        sf.base.Property(1)
    ], SmithchartAxisLine.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], SmithchartAxisLine.prototype, "color", void 0);
    __decorate$3([
        sf.base.Property('')
    ], SmithchartAxisLine.prototype, "dashArray", void 0);
    return SmithchartAxisLine;
}(sf.base.ChildProperty));
var SmithchartAxis = /** @class */ (function (_super) {
    __extends$4(SmithchartAxis, _super);
    function SmithchartAxis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(true)
    ], SmithchartAxis.prototype, "visible", void 0);
    __decorate$3([
        sf.base.Property('Outside')
    ], SmithchartAxis.prototype, "labelPosition", void 0);
    __decorate$3([
        sf.base.Property('Hide')
    ], SmithchartAxis.prototype, "labelIntersectAction", void 0);
    __decorate$3([
        sf.base.Complex({}, SmithchartMajorGridLines)
    ], SmithchartAxis.prototype, "majorGridLines", void 0);
    __decorate$3([
        sf.base.Complex({}, SmithchartMinorGridLines)
    ], SmithchartAxis.prototype, "minorGridLines", void 0);
    __decorate$3([
        sf.base.Complex({}, SmithchartAxisLine)
    ], SmithchartAxis.prototype, "axisLine", void 0);
    __decorate$3([
        sf.base.Complex(Theme.axisLabelFont, SmithchartFont)
    ], SmithchartAxis.prototype, "labelStyle", void 0);
    return SmithchartAxis;
}(sf.base.ChildProperty));

var __extends$5 = (undefined && undefined.__extends) || (function () {
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
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Subtitle = /** @class */ (function (_super) {
    __extends$5(Subtitle, _super);
    function Subtitle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(true)
    ], Subtitle.prototype, "visible", void 0);
    __decorate$4([
        sf.base.Property('')
    ], Subtitle.prototype, "text", void 0);
    __decorate$4([
        sf.base.Property('')
    ], Subtitle.prototype, "description", void 0);
    __decorate$4([
        sf.base.Property('Far')
    ], Subtitle.prototype, "textAlignment", void 0);
    __decorate$4([
        sf.base.Property(true)
    ], Subtitle.prototype, "enableTrim", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], Subtitle.prototype, "maximumWidth", void 0);
    __decorate$4([
        sf.base.Complex(Theme.smithchartSubtitleFont, SmithchartFont)
    ], Subtitle.prototype, "textStyle", void 0);
    return Subtitle;
}(sf.base.ChildProperty));
var Title = /** @class */ (function (_super) {
    __extends$5(Title, _super);
    function Title() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(true)
    ], Title.prototype, "visible", void 0);
    __decorate$4([
        sf.base.Property('')
    ], Title.prototype, "text", void 0);
    __decorate$4([
        sf.base.Property('')
    ], Title.prototype, "description", void 0);
    __decorate$4([
        sf.base.Property('Center')
    ], Title.prototype, "textAlignment", void 0);
    __decorate$4([
        sf.base.Property(true)
    ], Title.prototype, "enableTrim", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], Title.prototype, "maximumWidth", void 0);
    __decorate$4([
        sf.base.Complex({}, Subtitle)
    ], Title.prototype, "subtitle", void 0);
    __decorate$4([
        sf.base.Complex(Theme.smithchartTitleFont, SmithchartFont)
    ], Title.prototype, "font", void 0);
    __decorate$4([
        sf.base.Complex(Theme.smithchartTitleFont, SmithchartFont)
    ], Title.prototype, "textStyle", void 0);
    return Title;
}(sf.base.ChildProperty));

var __extends$6 = (undefined && undefined.__extends) || (function () {
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
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SeriesTooltipBorder = /** @class */ (function (_super) {
    __extends$6(SeriesTooltipBorder, _super);
    function SeriesTooltipBorder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        sf.base.Property(1)
    ], SeriesTooltipBorder.prototype, "width", void 0);
    __decorate$5([
        sf.base.Property(null)
    ], SeriesTooltipBorder.prototype, "color", void 0);
    return SeriesTooltipBorder;
}(sf.base.ChildProperty));
var SeriesTooltip = /** @class */ (function (_super) {
    __extends$6(SeriesTooltip, _super);
    function SeriesTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        sf.base.Property(false)
    ], SeriesTooltip.prototype, "visible", void 0);
    __decorate$5([
        sf.base.Property(null)
    ], SeriesTooltip.prototype, "fill", void 0);
    __decorate$5([
        sf.base.Property(0.95)
    ], SeriesTooltip.prototype, "opacity", void 0);
    __decorate$5([
        sf.base.Property('')
    ], SeriesTooltip.prototype, "template", void 0);
    __decorate$5([
        sf.base.Complex({}, SeriesTooltipBorder)
    ], SeriesTooltip.prototype, "border", void 0);
    return SeriesTooltip;
}(sf.base.ChildProperty));
var SeriesMarkerBorder = /** @class */ (function (_super) {
    __extends$6(SeriesMarkerBorder, _super);
    function SeriesMarkerBorder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        sf.base.Property(3)
    ], SeriesMarkerBorder.prototype, "width", void 0);
    __decorate$5([
        sf.base.Property('white')
    ], SeriesMarkerBorder.prototype, "color", void 0);
    return SeriesMarkerBorder;
}(sf.base.ChildProperty));
var SeriesMarkerDataLabelBorder = /** @class */ (function (_super) {
    __extends$6(SeriesMarkerDataLabelBorder, _super);
    function SeriesMarkerDataLabelBorder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        sf.base.Property(0.1)
    ], SeriesMarkerDataLabelBorder.prototype, "width", void 0);
    __decorate$5([
        sf.base.Property('white')
    ], SeriesMarkerDataLabelBorder.prototype, "color", void 0);
    return SeriesMarkerDataLabelBorder;
}(sf.base.ChildProperty));
var SeriesMarkerDataLabelConnectorLine = /** @class */ (function (_super) {
    __extends$6(SeriesMarkerDataLabelConnectorLine, _super);
    function SeriesMarkerDataLabelConnectorLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        sf.base.Property(1)
    ], SeriesMarkerDataLabelConnectorLine.prototype, "width", void 0);
    __decorate$5([
        sf.base.Property(null)
    ], SeriesMarkerDataLabelConnectorLine.prototype, "color", void 0);
    return SeriesMarkerDataLabelConnectorLine;
}(sf.base.ChildProperty));
var SeriesMarkerDataLabel = /** @class */ (function (_super) {
    __extends$6(SeriesMarkerDataLabel, _super);
    function SeriesMarkerDataLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        sf.base.Property(false)
    ], SeriesMarkerDataLabel.prototype, "visible", void 0);
    __decorate$5([
        sf.base.Property('')
    ], SeriesMarkerDataLabel.prototype, "template", void 0);
    __decorate$5([
        sf.base.Property(null)
    ], SeriesMarkerDataLabel.prototype, "fill", void 0);
    __decorate$5([
        sf.base.Property(1)
    ], SeriesMarkerDataLabel.prototype, "opacity", void 0);
    __decorate$5([
        sf.base.Complex({}, SeriesMarkerDataLabelBorder)
    ], SeriesMarkerDataLabel.prototype, "border", void 0);
    __decorate$5([
        sf.base.Complex({}, SeriesMarkerDataLabelConnectorLine)
    ], SeriesMarkerDataLabel.prototype, "connectorLine", void 0);
    __decorate$5([
        sf.base.Complex(Theme.dataLabelFont, SmithchartFont)
    ], SeriesMarkerDataLabel.prototype, "textStyle", void 0);
    return SeriesMarkerDataLabel;
}(sf.base.ChildProperty));
var SeriesMarker = /** @class */ (function (_super) {
    __extends$6(SeriesMarker, _super);
    function SeriesMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        sf.base.Property(false)
    ], SeriesMarker.prototype, "visible", void 0);
    __decorate$5([
        sf.base.Property('circle')
    ], SeriesMarker.prototype, "shape", void 0);
    __decorate$5([
        sf.base.Property(6)
    ], SeriesMarker.prototype, "width", void 0);
    __decorate$5([
        sf.base.Property(6)
    ], SeriesMarker.prototype, "height", void 0);
    __decorate$5([
        sf.base.Property('')
    ], SeriesMarker.prototype, "imageUrl", void 0);
    __decorate$5([
        sf.base.Property('')
    ], SeriesMarker.prototype, "fill", void 0);
    __decorate$5([
        sf.base.Property(1)
    ], SeriesMarker.prototype, "opacity", void 0);
    __decorate$5([
        sf.base.Complex({}, SeriesMarkerBorder)
    ], SeriesMarker.prototype, "border", void 0);
    __decorate$5([
        sf.base.Complex({}, SeriesMarkerDataLabel)
    ], SeriesMarker.prototype, "dataLabel", void 0);
    return SeriesMarker;
}(sf.base.ChildProperty));
var SmithchartSeries = /** @class */ (function (_super) {
    __extends$6(SmithchartSeries, _super);
    function SmithchartSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        sf.base.Property('visible')
    ], SmithchartSeries.prototype, "visibility", void 0);
    __decorate$5([
        sf.base.Property([])
    ], SmithchartSeries.prototype, "points", void 0);
    __decorate$5([
        sf.base.Property('')
    ], SmithchartSeries.prototype, "resistance", void 0);
    __decorate$5([
        sf.base.Property('')
    ], SmithchartSeries.prototype, "reactance", void 0);
    __decorate$5([
        sf.base.Property('')
    ], SmithchartSeries.prototype, "tooltipMappingName", void 0);
    __decorate$5([
        sf.base.Property(null)
    ], SmithchartSeries.prototype, "dataSource", void 0);
    __decorate$5([
        sf.base.Property('')
    ], SmithchartSeries.prototype, "name", void 0);
    __decorate$5([
        sf.base.Property(null)
    ], SmithchartSeries.prototype, "fill", void 0);
    __decorate$5([
        sf.base.Property(false)
    ], SmithchartSeries.prototype, "enableAnimation", void 0);
    __decorate$5([
        sf.base.Property('2000ms')
    ], SmithchartSeries.prototype, "animationDuration", void 0);
    __decorate$5([
        sf.base.Property(false)
    ], SmithchartSeries.prototype, "enableSmartLabels", void 0);
    __decorate$5([
        sf.base.Property(1)
    ], SmithchartSeries.prototype, "width", void 0);
    __decorate$5([
        sf.base.Property(1)
    ], SmithchartSeries.prototype, "opacity", void 0);
    __decorate$5([
        sf.base.Complex({}, SeriesMarker)
    ], SmithchartSeries.prototype, "marker", void 0);
    __decorate$5([
        sf.base.Complex({}, SeriesTooltip)
    ], SmithchartSeries.prototype, "tooltip", void 0);
    return SmithchartSeries;
}(sf.base.ChildProperty));

/* tslint:disable:no-string-literal */
var AreaBounds = /** @class */ (function () {
    function AreaBounds() {
    }
    AreaBounds.prototype.calculateAreaBounds = function (smithchart, title, bounds) {
        var x;
        var y;
        var width;
        var height;
        var rightSpace;
        var margin = smithchart.margin;
        var border = smithchart.border;
        var spaceValue = this.getLegendSpace(smithchart, bounds);
        x = spaceValue['leftLegendWidth'] + margin.left + border.width;
        rightSpace = spaceValue['rightLegendWidth'] + margin.left + margin.right + (2 * border.width);
        width = smithchart.availableSize['width'] - (x + rightSpace);
        y = margin['top'] + (2 * smithchart.elementSpacing) + spaceValue['modelTitleHeight'] +
            spaceValue['modelsubTitleHeight'] + spaceValue['topLegendHeight'] + border.width;
        height = smithchart.availableSize['height'] - (spaceValue['modelTitleHeight'] +
            (2 * smithchart.elementSpacing) + spaceValue['modelsubTitleHeight'] + margin['top'] +
            spaceValue['topLegendHeight'] + spaceValue['bottomLegendHeight']);
        return { x: x, y: y, width: width, height: height };
    };
    AreaBounds.prototype.getLegendSpace = function (smithchart, bounds) {
        var title = smithchart.title;
        var legend = smithchart.legendSettings;
        var position = legend.position.toLowerCase();
        var subtitleHeight = 0;
        var modelsubTitleHeight = 0;
        var titleHeight = 0;
        var font = smithchart.font;
        var modelTitleHeight = 0;
        var itemPadding = 10;
        var legendBorder = legend.border.width;
        var leftLegendWidth = 0;
        var rightLegendWidth = 0;
        var topLegendHeight = 0;
        var bottomLegendHeight = 0;
        var ltheight = 0;
        var space;
        if (legend['visible']) {
            space = (bounds.width + (itemPadding / 2) + smithchart.elementSpacing + (2 * legendBorder));
            leftLegendWidth = position === 'left' ? space : 0;
            rightLegendWidth = position === 'right' ? space : 0;
            ltheight = legend['title'].visible ? measureText(legend['title'].text, font)['height'] : 0;
            topLegendHeight = position === 'top' ? smithchart.elementSpacing + bounds.height + ltheight : 0;
            bottomLegendHeight = position === 'bottom' ? smithchart.elementSpacing + bounds.height + ltheight : 0;
        }
        subtitleHeight = measureText(title.subtitle.text, font)['height'];
        modelTitleHeight = (title.text === '' || !title['visible']) ? 0 : (titleHeight);
        modelsubTitleHeight = (title['subtitle'].text === '' || !title['subtitle'].visible) ? 0 : (subtitleHeight);
        return {
            leftLegendWidth: leftLegendWidth, rightLegendWidth: rightLegendWidth,
            topLegendHeight: topLegendHeight, bottomLegendHeight: bottomLegendHeight,
            modelTitleHeight: modelTitleHeight, modelsubTitleHeight: modelsubTitleHeight
        };
    };
    return AreaBounds;
}());

/**
 * Specifies smithchart animationComplete event name.
 * @private
 */
var animationComplete = 'animationComplete';
/**
 * Specifies smithchart legendRender event name.
 * @private
 */
var legendRender = 'legendRender';
/**
 * Specifies smithchart titleRender event name.
 * @private
 */
var titleRender = 'titleRender';
/**
 * Specifies smithchart subtitleRender event name.
 * @private
 */
var subtitleRender = 'subtitleRender';
/**
 * Specifies smithchart textRender event name.
 * @private
 */
var textRender = 'textRender';
/**
 * Specifies smithchart seriesRender event name.
 * @private
 */
var seriesRender = 'seriesRender';
/**
 * Specifies smithchart load event name.
 * @private
 */
var load = 'load';
/**
 * Specifies smithchart loaded event name.
 * @private
 */
var loaded = 'loaded';
/**
 * Specifies smithchart axisLabelRender event name.
 * @private
 */
var axisLabelRender = 'axisLabelRender';

/* tslint:disable:no-string-literal */
var AxisRender = /** @class */ (function () {
    function AxisRender() {
        this.radialLabels = [-50, -20, -10, -5, -4, -3, -2, -1.5, -1, -0.8, -0.6, -0.4, -0.2,
            0, 0.2, 0.4, 0.6, 0.8, 1, 1.5, 2, 3, 4, 5, 10, 20, 50];
        this.radialLabelCollections = [];
        this.horizontalLabelCollections = [];
        this.labelCollections = [];
        this.direction = new Direction();
    }
    AxisRender.prototype.renderArea = function (smithchart, bounds) {
        this.calculateChartArea(smithchart, bounds);
        this.calculateCircleMargin(smithchart, bounds);
        this.calculateXAxisRange(smithchart);
        this.calculateRAxisRange(smithchart);
        this.measureHorizontalAxis(smithchart);
        this.measureRadialAxis(smithchart);
        if (smithchart.horizontalAxis.visible) {
            this.updateHAxis(smithchart);
        }
        if (smithchart.radialAxis.visible) {
            this.updateRAxis(smithchart);
        }
        if (smithchart.horizontalAxis.visible) {
            this.drawHAxisLabels(smithchart);
        }
        if (smithchart.radialAxis.visible) {
            this.drawRAxisLabels(smithchart);
        }
    };
    AxisRender.prototype.updateHAxis = function (smithchart) {
        var majorGridLines = smithchart.horizontalAxis.majorGridLines;
        var minorGridLines = smithchart.horizontalAxis.minorGridLines;
        var axisLine = smithchart.horizontalAxis.axisLine;
        if (majorGridLines.visible) {
            this.updateHMajorGridLines(smithchart);
        }
        if (minorGridLines.visible) {
            this.updateHMinorGridLines(smithchart);
        }
        if (axisLine.visible) {
            this.updateHAxisLine(smithchart);
        }
    };
    AxisRender.prototype.updateRAxis = function (smithchart) {
        var majorGridLines = smithchart.radialAxis.majorGridLines;
        var minorGridLines = smithchart.radialAxis.minorGridLines;
        var axisLine = smithchart.radialAxis.axisLine;
        if (majorGridLines.visible) {
            this.updateRMajorGridLines(smithchart);
        }
        if (minorGridLines.visible) {
            this.updateRMinorGridLines(smithchart);
        }
        if (axisLine.visible) {
            this.updateRAxisLine(smithchart);
        }
    };
    AxisRender.prototype.measureHorizontalAxis = function (smithchart) {
        var majorGridLines = smithchart.horizontalAxis.majorGridLines;
        var minorGridLines = smithchart.horizontalAxis.minorGridLines;
        this.measureHMajorGridLines(smithchart);
        if (minorGridLines.visible) {
            this.measureHMinorGridLines(smithchart);
        }
    };
    AxisRender.prototype.measureRadialAxis = function (smithchart) {
        var majorGridLines = smithchart.radialAxis.majorGridLines;
        var minorGridLines = smithchart.radialAxis.minorGridLines;
        this.measureRMajorGridLines(smithchart);
        if (minorGridLines.visible) {
            this.measureRMinorGridLines(smithchart);
        }
    };
    AxisRender.prototype.calculateChartArea = function (smithchart, bounds) {
        var chartAreaWidth;
        var chartAreaHeight;
        var width = smithchart.availableSize.width;
        var height = smithchart.availableSize.height;
        var x;
        var y;
        width = bounds.width;
        height = bounds.height;
        chartAreaWidth = Math.min(width, height);
        chartAreaHeight = Math.min(width, height);
        x = bounds.x + (bounds.width / 2 - chartAreaWidth / 2);
        y = bounds.y + ((height - chartAreaHeight) / 2 > 0 ? (height - chartAreaHeight) / 2 : 0);
        smithchart.chartArea = { x: x, y: y, width: chartAreaWidth, height: chartAreaHeight };
    };
    AxisRender.prototype.calculateCircleMargin = function (smithchart, bounds) {
        var padding = 10;
        var maxLabelWidth = 0;
        var width = smithchart.chartArea.width;
        var radius = smithchart.radius;
        maxLabelWidth = this.maximumLabelLength(smithchart);
        var labelMargin = (smithchart.radialAxis.labelPosition === 'Outside') ? (maxLabelWidth + padding) : padding;
        var diameter = width - labelMargin * 2 > 0 ? width - labelMargin * 2 : 0;
        var actualRadius = diameter / 2;
        var circleCoefficient = radius > 1 ? 1 : (radius < 0.1 ? 0.1 : radius);
        this.areaRadius = actualRadius * circleCoefficient;
        this.circleLeftX = smithchart.chartArea.x + labelMargin + (actualRadius * (1 - circleCoefficient));
        this.circleTopY = smithchart.chartArea.y + labelMargin + (actualRadius * (1 - circleCoefficient));
        this.circleCenterX = this.circleLeftX + this.areaRadius;
        this.circleCenterY = bounds.y + bounds.height / 2;
    };
    AxisRender.prototype.maximumLabelLength = function (smithchart) {
        var maximumLabelLength = 0;
        var font = smithchart.horizontalAxis.labelStyle;
        var label;
        var textSize;
        for (var i = 0; i < this.radialLabels.length; i++) {
            label = this.radialLabels[i].toString();
            textSize = measureText(label, font);
            if (maximumLabelLength < textSize.width) {
                maximumLabelLength = textSize.width;
            }
        }
        return maximumLabelLength;
    };
    AxisRender.prototype.calculateAxisLabels = function () {
        var spacingBetweenGridLines = 30;
        var previousR = 0;
        var j = 0;
        var labels = [];
        var diameter = this.areaRadius * 2;
        for (var i = 0; i < 2; i = i + 0.1) {
            i = Math.round(i * 10) / 10;
            var coeff = 1 / (i + 1);
            var isOverlap1 = false;
            var isOverlap2 = false;
            var radius = ((diameter * coeff) / 2) * 2;
            if (previousR === 0.0 || i === 1) {
                previousR = radius;
                labels[j] = i;
                j++;
                continue;
            }
            if (i < 1) {
                isOverlap1 = this.isOverlap(1, diameter, radius, spacingBetweenGridLines);
            }
            if (i > 1) {
                isOverlap2 = this.isOverlap(2, diameter, radius, spacingBetweenGridLines);
            }
            if (isOverlap1 || isOverlap2) {
                continue;
            }
            if (previousR - radius >= spacingBetweenGridLines) {
                labels[j] = i;
                j++;
                previousR = radius;
            }
        }
        var staticlabels = [2, 3, 4, 5, 10, 20, 50];
        for (var k = 0; k < staticlabels.length; k++) {
            labels[j] = staticlabels[k];
            j++;
        }
        return labels;
    };
    AxisRender.prototype.isOverlap = function (x, d, previousR, spacingBetweenGridLines) {
        var coeff;
        var radius;
        coeff = 1 / (x + 1); // (1 / 1+r) find the radius for the x value
        radius = ((d * coeff) / 2) * 2;
        return previousR - radius < spacingBetweenGridLines;
    };
    AxisRender.prototype.calculateXAxisRange = function (smithchart) {
        var x;
        var coeff;
        var radius;
        var cx;
        var diameter = this.areaRadius * 2;
        var horizontalAxisLabels = this.calculateAxisLabels();
        var cy = this.circleCenterY;
        var circleStartX = this.circleLeftX;
        var leftX = this.circleLeftX;
        for (var i = 0; i < horizontalAxisLabels.length; i++) {
            x = horizontalAxisLabels[i];
            coeff = 1 / (x + 1);
            radius = (diameter * coeff) / 2;
            if (smithchart.renderType === 'Impedance') {
                leftX = circleStartX + diameter - (radius * 2);
            }
            cx = leftX + radius;
            this.horizontalLabelCollections.push({
                centerX: cx, centerY: cy, radius: radius, value: x, region: null
            });
        }
    };
    AxisRender.prototype.calculateRAxisRange = function (smithchart) {
        var arcCy;
        var arcRadius;
        var diameter = this.areaRadius * 2;
        var y;
        var point = new Point();
        if (smithchart.renderType === 'Impedance') {
            point.x = this.circleLeftX + diameter;
            point.y = this.circleTopY + this.areaRadius;
        }
        else {
            point.x = this.circleLeftX;
            point.y = this.circleTopY + this.areaRadius;
        }
        for (var i = 0; i < this.radialLabels.length; i++) {
            y = this.radialLabels[i];
            arcRadius = Math.abs(((1 / y) * diameter) / 2);
            if (smithchart.renderType === 'Impedance') {
                arcCy = y > 0 ? point.y - arcRadius : point.y + arcRadius;
            }
            else {
                arcCy = y < 0 ? point.y - arcRadius : point.y + arcRadius;
            }
            this.radialLabelCollections.push({
                centerX: point.x, centerY: arcCy, radius: arcRadius, value: y
            });
        }
    };
    AxisRender.prototype.measureHMajorGridLines = function (smithchart) {
        var arcPoints = [];
        var startPoint;
        var endPoint;
        var radialPoint1;
        var radialPoint2;
        var size;
        this.majorHGridArcPoints = [];
        for (var i = 0; i < this.horizontalLabelCollections.length; i++) {
            var circlePoint = new HorizontalLabelCollection();
            circlePoint = this.horizontalLabelCollections[i];
            arcPoints = this.calculateHMajorArcStartEndPoints(circlePoint.value);
            if (smithchart.renderType === 'Impedance') {
                radialPoint1 = arcPoints[0];
                radialPoint2 = arcPoints[1];
            }
            else {
                radialPoint1 = arcPoints[1];
                radialPoint2 = arcPoints[0];
            }
            size = { width: circlePoint.radius, height: circlePoint.radius };
            if (circlePoint.value !== 0.0 && circlePoint.value !== 50.0) {
                startPoint = this.intersectingCirclePoints(radialPoint1[0].centerX, radialPoint1[0].centerY, radialPoint1[0].radius, circlePoint.centerX, circlePoint.centerY, circlePoint.radius, smithchart.renderType);
                endPoint = this.intersectingCirclePoints(radialPoint2[0].centerX, radialPoint2[0].centerY, radialPoint2[0].radius, circlePoint.centerX, circlePoint.centerY, circlePoint.radius, smithchart.renderType);
                this.majorHGridArcPoints.push({
                    startPoint: startPoint,
                    endPoint: endPoint,
                    rotationAngle: 2 * Math.PI,
                    sweepDirection: (smithchart.renderType === 'Impedance') ?
                        this.direction['counterclockwise'] : this.direction['clockwise'],
                    isLargeArc: true,
                    size: size
                });
            }
            else {
                startPoint = { x: circlePoint.centerX + circlePoint.radius, y: circlePoint.centerY };
                endPoint = { x: circlePoint.centerX + circlePoint.radius, y: circlePoint.centerY - 0.05 };
                this.majorHGridArcPoints.push({
                    startPoint: startPoint,
                    endPoint: endPoint,
                    rotationAngle: 2 * Math.PI,
                    sweepDirection: this.direction['clockwise'],
                    isLargeArc: true,
                    size: size
                });
            }
        }
    };
    AxisRender.prototype.measureRMajorGridLines = function (smithchart) {
        var epsilon;
        var radialPoint;
        var y;
        var arcPoints = [];
        var innerInterSectPoint;
        var outerInterSectPoint;
        var outterInterSectRadian;
        var outterInterSectAngle;
        var startPoint;
        var endPoint;
        var size;
        var sweepDirection;
        this.majorRGridArcPoints = [];
        this.labelCollections = [];
        epsilon = _getEpsilonValue();
        for (var i = 0; i < this.radialLabelCollections.length; i++) {
            radialPoint = this.radialLabelCollections[i];
            if (radialPoint.radius <= epsilon) {
                continue;
            }
            y = radialPoint.value;
            arcPoints = this.calculateMajorArcStartEndPoints(radialPoint, Math.abs(y), smithchart);
            innerInterSectPoint = arcPoints[0];
            outerInterSectPoint = arcPoints[1];
            outterInterSectRadian = this.circleXYRadianValue(this.circleCenterX, this.circleCenterY, outerInterSectPoint.x, outerInterSectPoint.y);
            outterInterSectAngle = outterInterSectRadian * (180 / Math.PI);
            if (y !== 0.0) {
                startPoint = { x: innerInterSectPoint.x, y: innerInterSectPoint.y };
                endPoint = { x: outerInterSectPoint.x, y: outerInterSectPoint.y };
                size = { width: radialPoint.radius, height: radialPoint.radius };
                sweepDirection = y > 0 ? this.direction['clockwise'] : this.direction['counterclockwise'];
                this.majorRGridArcPoints.push({
                    startPoint: startPoint,
                    endPoint: endPoint,
                    size: size,
                    rotationAngle: 2 * Math.PI,
                    isLargeArc: false,
                    sweepDirection: sweepDirection
                });
                this.labelCollections.push({
                    centerX: outerInterSectPoint.x,
                    centerY: outerInterSectPoint.y,
                    angle: outterInterSectAngle,
                    value: y,
                    radius: this.areaRadius,
                    region: null
                });
            }
            else {
                startPoint = { x: this.circleLeftX, y: this.circleCenterY };
                endPoint = { x: this.circleCenterX + this.areaRadius, y: this.circleCenterY };
                this.majorRGridArcPoints.push({
                    startPoint: startPoint,
                    endPoint: endPoint,
                    size: null,
                    rotationAngle: null,
                    isLargeArc: null,
                    sweepDirection: null
                });
                this.labelCollections.push({
                    centerX: (smithchart.renderType === 'Impedance') ?
                        (this.circleCenterX - this.areaRadius) : (this.circleCenterX + this.areaRadius),
                    centerY: this.circleCenterY,
                    angle: (smithchart.renderType === 'Impedance') ?
                        180 : 360,
                    value: y,
                    radius: this.areaRadius,
                    region: null
                });
            }
        }
    };
    AxisRender.prototype.circleXYRadianValue = function (centerX, centerY, outterX, outterY) {
        var radian;
        radian = Math.atan2(outterY - centerY, outterX - centerX);
        radian = radian < 0 ? (radian + (360 * Math.PI / 180)) : radian;
        return radian;
    };
    AxisRender.prototype.calculateMajorArcStartEndPoints = function (radialPoint, value, smithchart) {
        var arcPoints = [];
        var circlePoint = [];
        var cx;
        var cy;
        cx = this.circleCenterX;
        cy = this.circleCenterY;
        if (value >= 10) {
            arcPoints[0] = (smithchart.renderType === 'Impedance') ?
                { x: cx + this.areaRadius, y: cy } : { x: cx - this.areaRadius, y: cy };
        }
        else if (value >= 3) {
            circlePoint = this.horizontalLabelCollections.filter(function (c) { return c.value === 10; });
        }
        else if (value >= 1) {
            circlePoint = this.horizontalLabelCollections.filter(function (c) { return c.value === 5; });
        }
        else {
            circlePoint = this.horizontalLabelCollections.filter(function (c) { return c.value === 3; });
        }
        if (circlePoint.length > 0) {
            arcPoints[0] = this.intersectingCirclePoints(radialPoint.centerX, radialPoint.centerY, radialPoint.radius, circlePoint[0].centerX, circlePoint[0].centerY, circlePoint[0].radius, smithchart.renderType);
        }
        arcPoints[1] = this.intersectingCirclePoints(radialPoint.centerX, radialPoint.centerY, radialPoint.radius, cx, cy, this.areaRadius, smithchart.renderType);
        return arcPoints;
    };
    AxisRender.prototype.calculateHMajorArcStartEndPoints = function (value) {
        var arcHPoints = [];
        var calValue1;
        var calValue2;
        if (value <= 0.3) {
            calValue1 = 2.0;
            calValue2 = -2.0;
        }
        else if (value <= 1.0) {
            calValue1 = 3.0;
            calValue2 = -3.0;
        }
        else if (value <= 2.0) {
            calValue1 = 5.0;
            calValue2 = -5.0;
        }
        else if (value <= 5.0) {
            calValue1 = 10.0;
            calValue2 = -10.0;
        }
        else {
            calValue1 = 50.0;
            calValue2 = -50.0;
        }
        arcHPoints[0] = this.radialLabelCollections.filter(function (c) { return c.value === calValue1; });
        arcHPoints[1] = this.radialLabelCollections.filter(function (c) { return c.value === calValue2; });
        return arcHPoints;
    };
    AxisRender.prototype.calculateMinorArcStartEndPoints = function (value) {
        var calValue1;
        var calValue2;
        var marcHPoints = [];
        if (value <= 0.1) {
            calValue1 = 1.0;
            calValue2 = -1.0;
        }
        else if (value <= 0.2) {
            calValue1 = 0.8;
            calValue2 = -0.8;
        }
        else if (value <= 0.3) {
            calValue1 = 0.4;
            calValue2 = -0.4;
        }
        else if (value <= 0.6) {
            calValue1 = 1.0;
            calValue2 = -1.0;
        }
        else if (value <= 1.0) {
            calValue1 = 1.5;
            calValue2 = -1.5;
        }
        else if (value <= 1.5) {
            calValue1 = 2.0;
            calValue2 = -2.0;
        }
        else if (value <= 2.0) {
            calValue1 = 1.0;
            calValue2 = -1.0;
        }
        else if (value <= 5.0) {
            calValue1 = 3.0;
            calValue2 = -3.0;
        }
        else {
            calValue1 = 10.0;
            calValue2 = -10.0;
        }
        marcHPoints[0] = this.radialLabelCollections.filter(function (c) { return c['value'] === calValue1; });
        marcHPoints[1] = this.radialLabelCollections.filter(function (c) { return c['value'] === calValue2; });
        return marcHPoints;
    };
    AxisRender.prototype.intersectingCirclePoints = function (x1, y1, r1, x2, y2, r2, renderType) {
        var cx;
        var cy;
        var midRadius;
        var radiusSquare;
        var a;
        var radiusSquare2;
        var c;
        var fx;
        var gx;
        var ix1;
        var ix2;
        var fy;
        var gy;
        var iy1;
        var iy2;
        var point = { x: 0, y: 0 };
        cx = x1 - x2;
        cy = y1 - y2;
        midRadius = Math.sqrt(cx * cx + cy * cy);
        radiusSquare = midRadius * midRadius;
        a = (r1 * r1 - r2 * r2) / (2 * radiusSquare);
        radiusSquare2 = (r1 * r1 - r2 * r2);
        c = Math.sqrt(2 * (r1 * r1 + r2 * r2) / radiusSquare - (radiusSquare2 * radiusSquare2) / (radiusSquare * radiusSquare) - 1);
        fx = (x1 + x2) / 2 + a * (x2 - x1);
        gx = c * (y2 - y1) / 2;
        ix1 = fx + gx;
        ix2 = fx - gx;
        fy = (y1 + y2) / 2 + a * (y2 - y1);
        gy = c * (x1 - x2) / 2;
        iy1 = fy + gy;
        iy2 = fy - gy;
        if (renderType === 'Impedance') {
            if (ix2 < ix1) {
                point.x = ix2;
                point.y = iy2;
            }
            else {
                point.x = ix1;
                point.y = iy1;
            }
        }
        else {
            if (ix1 > ix2) {
                point.x = ix1;
                point.y = iy1;
            }
            else {
                point.x = ix2;
                point.y = iy2;
            }
        }
        return { x: point.x, y: point.y };
    };
    AxisRender.prototype.updateHMajorGridLines = function (smithchart) {
        var majorGridLine = smithchart.horizontalAxis.majorGridLines;
        var groupElement;
        var element;
        var path;
        groupElement = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_horizontalAxisMajorGridLines' });
        path = this.calculateGridLinesPath(this.majorHGridArcPoints);
        var haxismgoptions = new PathOption(smithchart.element.id + '_horizontalAxisMajorGridLines', 'none', majorGridLine['width'], majorGridLine.color ? majorGridLine.color : smithchart.themeStyle.majorGridLine, majorGridLine['opacity'], majorGridLine['dashArray'], path);
        element = smithchart.renderer.drawPath(haxismgoptions);
        groupElement.appendChild(element);
        smithchart.svgObject.appendChild(groupElement);
    };
    AxisRender.prototype.updateRMajorGridLines = function (smithchart) {
        var majorGridLine = smithchart.radialAxis.majorGridLines;
        var groupElement;
        var element;
        var path;
        groupElement = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_radialAxisMajorGridLines' });
        path = this.calculateGridLinesPath(this.majorRGridArcPoints);
        var raxismgoptions = new PathOption(smithchart.element.id + '_radialAxisMajorGridLines', 'none', majorGridLine['width'], majorGridLine.color ? majorGridLine.color : smithchart.themeStyle.majorGridLine, majorGridLine['opacity'], majorGridLine['dashArray'], path);
        element = smithchart.renderer.drawPath(raxismgoptions);
        groupElement.appendChild(element);
        smithchart.svgObject.appendChild(groupElement);
    };
    AxisRender.prototype.updateHAxisLine = function (smithchart) {
        var radius = this.areaRadius;
        var point1;
        var point2;
        var size;
        var sweep;
        var isLargeArc;
        var angle;
        var axisLine = smithchart.horizontalAxis.axisLine;
        var direction;
        var groupElement = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_hAxisLine' });
        point1 = { x: this.circleCenterX + radius, y: this.circleCenterY };
        point2 = { x: this.circleCenterX + radius, y: (this.circleCenterY - 0.05) };
        size = { width: radius, height: radius };
        sweep = this.direction['clockwise'];
        isLargeArc = 1;
        angle = Math.PI * 2;
        direction = 'M' + '' + point1.x + ' ' + point1.y + ' ' + 'A' + ' ' + size.width +
            ' ' + size.height + ' ' + angle + ' ' + isLargeArc + ' ' + sweep + ' ' + point2.x + ' ' + point2.y + '';
        var options = new PathOption(smithchart.element.id + '_horizontalAxisLine', 'none', axisLine.width, axisLine.color ? axisLine.color : smithchart.themeStyle.axisLine, 1, axisLine.dashArray, direction);
        var element = smithchart.renderer.drawPath(options);
        groupElement.appendChild(element);
        smithchart.svgObject.appendChild(groupElement);
    };
    AxisRender.prototype.updateRAxisLine = function (smithchart) {
        var radius = this.areaRadius;
        var point1;
        var point2;
        var size;
        var sweep;
        var isLargeArc;
        var angle;
        var axisLine = smithchart.radialAxis.axisLine;
        var direction;
        point1 = { x: this.circleCenterX - radius, y: this.circleCenterY };
        point2 = { x: this.circleCenterX + radius, y: this.circleCenterY };
        size = { width: 0, height: 0 };
        sweep = this.direction['counterclockwise'];
        isLargeArc = 0;
        angle = 0;
        direction = 'M' + ' ' + point1.x + ' ' + point1.y + ' ' + 'A' + ' ' +
            size.width + ' ' + size.height + ' ' + angle + ' ' + isLargeArc + ' ' + sweep + ' ' +
            point2.x + ' ' + point2.y + '';
        var options = new PathOption(smithchart.element.id + '_radialAxisLine', 'none', axisLine.width, axisLine.color ? axisLine.color : smithchart.themeStyle.axisLine, 1, axisLine.dashArray, direction);
        var groupElement = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_rAxisLine' });
        var element = smithchart.renderer.drawPath(options);
        groupElement.appendChild(element);
        smithchart.svgObject.appendChild(groupElement);
    };
    AxisRender.prototype.drawHAxisLabels = function (smithchart) {
        var hAxis = smithchart.horizontalAxis;
        smithchart.radialAxis.labelStyle.fontFamily = smithchart.themeStyle.fontFamily || smithchart.radialAxis.labelStyle.fontFamily;
        var font = smithchart.horizontalAxis.labelStyle;
        var circleAxis;
        var label;
        var x;
        var y;
        var textSize;
        var curLabel;
        var curLabelBounds;
        var curWidth;
        var curX;
        var preLabel;
        var preLabelBounds;
        var preWidth;
        var preX;
        var groupEle = smithchart.renderer.createGroup({ id: smithchart.element.id + '_HAxisLabels' });
        var _loop_1 = function (i) {
            circleAxis = this_1.horizontalLabelCollections[i];
            label = this_1.horizontalLabelCollections[i].value.toString();
            if (circleAxis.value !== 0.0) {
                x = (smithchart.renderType === 'Impedance') ?
                    circleAxis.centerX - circleAxis.radius : circleAxis.centerX + circleAxis.radius;
                y = circleAxis.centerY;
                textSize = measureText(label, font);
                x = (smithchart.renderType === 'Impedance') ? x - textSize.width : x;
                if (hAxis.labelPosition === 'Outside') {
                    y -= textSize.height / 4;
                }
                else {
                    y += textSize.height;
                }
                this_1.horizontalLabelCollections[i].region = this_1.calculateRegion(label, textSize, x, y);
                if (hAxis.labelIntersectAction === 'Hide') {
                    curLabel = this_1.horizontalLabelCollections[i];
                    curLabelBounds = curLabel.region.bounds;
                    curWidth = curLabelBounds.width;
                    curX = curLabelBounds.x;
                    for (var j = 1; j < i; j++) {
                        preLabel = this_1.horizontalLabelCollections[j];
                        preLabelBounds = preLabel.region.bounds;
                        preWidth = preLabelBounds.width;
                        preX = preLabelBounds.x;
                        if ((smithchart.renderType === 'Impedance') &&
                            (preX + preWidth) > (curX)) {
                            label = '';
                        }
                        if ((smithchart.renderType === 'Admittance') &&
                            (preX) < curX + curWidth) {
                            label = '';
                        }
                    }
                }
                var axisLabelRenderEventArgs_1 = {
                    text: label.toString(),
                    x: x,
                    y: y,
                    name: axisLabelRender,
                    cancel: false
                };
                var axisLabelRenderSuccess = function (args) {
                    if (!args.cancel) {
                        var options = new TextOption(smithchart.element.id + '_HLabel_' + i, axisLabelRenderEventArgs_1.x, axisLabelRenderEventArgs_1.y, 'none', axisLabelRenderEventArgs_1.text);
                        var color = font.color ? font.color : smithchart.themeStyle.axisLabel;
                        font.fontFamily = font.fontFamily || smithchart.themeStyle.labelFontFamily;
                        var element = renderTextElement(options, font, color, groupEle);
                        groupEle.appendChild(element);
                    }
                };
                axisLabelRenderSuccess.bind(this_1);
                smithchart.trigger(axisLabelRender, axisLabelRenderEventArgs_1, axisLabelRenderSuccess);
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.horizontalLabelCollections.length; i++) {
            _loop_1(i);
        }
        smithchart.svgObject.appendChild(groupEle);
    };
    AxisRender.prototype.drawRAxisLabels = function (smithchart) {
        var paddingRadius = 2;
        smithchart.radialAxis.labelStyle.fontFamily = smithchart.themeStyle.fontFamily || smithchart.radialAxis.labelStyle.fontFamily;
        var font = smithchart.radialAxis.labelStyle;
        var interSectPoint = new RadialLabelCollections();
        var label;
        var textSize;
        var angle;
        var position;
        var textPosition;
        var curX;
        var curY;
        var curWidth;
        var curHeight;
        var curLabel;
        var curLabelBounds;
        var preX;
        var preY;
        var preWidth;
        var preHeight;
        var preLabel;
        var preLabelBounds;
        var rAxis = smithchart.radialAxis;
        var groupEle = smithchart.renderer.createGroup({ id: smithchart.element.id + '_RAxisLabels' });
        var _loop_2 = function (i) {
            interSectPoint = this_2.labelCollections[i];
            label = interSectPoint.value.toString();
            textSize = measureText(label, font);
            angle = Math.round(interSectPoint.angle * 100) / 100;
            if (rAxis.labelPosition === 'Outside') {
                position = this_2.circlePointPosition(this_2.circleCenterX, this_2.circleCenterY, interSectPoint['angle'], this_2.areaRadius + paddingRadius);
                textPosition = this_2.setLabelsOutsidePosition(angle, position.x, position.y, textSize);
            }
            else {
                position = this_2.circlePointPosition(this_2.circleCenterX, this_2.circleCenterY, interSectPoint['angle'], this_2.areaRadius - paddingRadius);
                textPosition = this_2.setLabelsInsidePosition(angle, position.x, position.y, textSize);
            }
            this_2.labelCollections[i]['region'] = this_2.calculateRegion(label, textSize, textPosition.x, textPosition.y);
            if (rAxis.labelIntersectAction === 'Hide') {
                curLabel = this_2.labelCollections[i];
                curLabelBounds = curLabel['region']['bounds'];
                curWidth = curLabelBounds['width'];
                curHeight = curLabelBounds['height'];
                curX = curLabelBounds['x'];
                curY = curLabelBounds['y'];
                for (var j = 0; j < i; j++) {
                    preLabel = this_2.labelCollections[j];
                    preLabelBounds = preLabel['region']['bounds'];
                    preWidth = preLabelBounds['width'];
                    preHeight = preLabelBounds['height'];
                    preX = preLabelBounds['x'];
                    preY = preLabelBounds['y'];
                    if ((preX <= curX + curWidth) && (curX <= preX + preWidth) && (preY <= curY + curHeight)
                        && (curY <= preY + preHeight)) {
                        label = ' ';
                    }
                }
            }
            var axisLabelRenderEventArgs = {
                text: label.toString(),
                x: textPosition.x,
                y: textPosition.y,
                name: axisLabelRender,
                cancel: false
            };
            var axisLabelRenderSuccess = function (args) {
                if (!args.cancel) {
                    var options = new TextOption(smithchart.element.id + '_RLabel_' + i, axisLabelRenderEventArgs.x, axisLabelRenderEventArgs.y, 'none', axisLabelRenderEventArgs.text);
                    var color = font.color ? font.color : smithchart.themeStyle.axisLabel;
                    font.fontFamily = smithchart.themeStyle.labelFontFamily ? smithchart.themeStyle.labelFontFamily : font.fontFamily;
                    var element = renderTextElement(options, font, color, groupEle);
                    groupEle.appendChild(element);
                }
            };
            axisLabelRenderSuccess.bind(this_2);
            smithchart.trigger(axisLabelRender, axisLabelRenderEventArgs, axisLabelRenderSuccess);
        };
        var this_2 = this;
        for (var i = 0; i < this.labelCollections.length; i++) {
            _loop_2(i);
        }
        smithchart.svgObject.appendChild(groupEle);
    };
    AxisRender.prototype.calculateRegion = function (label, textSize, textPositionX, textPositionY) {
        var xAxisLabelRegions = new LabelRegion();
        var bounds = { x: textPositionX, y: textPositionY, width: textSize.width, height: textSize.height };
        xAxisLabelRegions = { bounds: bounds, labelText: label };
        return xAxisLabelRegions;
    };
    AxisRender.prototype.updateHMinorGridLines = function (smithchart) {
        var minorGridLine = smithchart.horizontalAxis.minorGridLines;
        var groupElement;
        var element;
        var path;
        groupElement = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_horizontalAxisMinorGridLines' });
        path = this.calculateGridLinesPath(this.minorHGridArcPoints);
        var haxismioptions = new PathOption(smithchart.element.id + '_horizontalAxisMinorGridLines', 'none', minorGridLine['width'], minorGridLine.color ? minorGridLine.color : smithchart.themeStyle.minorGridLine, minorGridLine['opacity'], minorGridLine['dashArray'], path);
        element = smithchart.renderer.drawPath(haxismioptions);
        groupElement.appendChild(element);
        smithchart.svgObject.appendChild(groupElement);
    };
    AxisRender.prototype.updateRMinorGridLines = function (smithchart) {
        var minorGridLine = smithchart.radialAxis.minorGridLines;
        var groupElement;
        var element;
        var path;
        groupElement = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_radialAxisMinorGridLines' });
        path = this.calculateGridLinesPath(this.minorGridArcPoints);
        var raxismioptions = new PathOption(smithchart.element.id + '_radialAxisMinorGridLines', 'none', minorGridLine['width'], minorGridLine.color ? minorGridLine.color : smithchart.themeStyle.minorGridLine, minorGridLine['opacity'], minorGridLine['dashArray'], path);
        element = smithchart.renderer.drawPath(raxismioptions);
        groupElement.appendChild(element);
        smithchart.svgObject.appendChild(groupElement);
    };
    AxisRender.prototype.calculateGridLinesPath = function (points) {
        var x1;
        var y1;
        var x2;
        var y2;
        var r1;
        var r2;
        var pathSegment = new GridArcPoints();
        var angle;
        var isLargeArc;
        var sweep;
        var sb = '';
        var path;
        for (var i = 0; i < points.length; i++) {
            pathSegment = points[i];
            x1 = pathSegment.startPoint.x;
            y1 = pathSegment.startPoint.y;
            x2 = pathSegment.endPoint.x;
            y2 = pathSegment.endPoint.y;
            r1 = pathSegment.size ? pathSegment.size.width : 0;
            r2 = pathSegment.size ? pathSegment.size.height : 0;
            angle = pathSegment.rotationAngle ? pathSegment.rotationAngle : 0;
            isLargeArc = pathSegment.isLargeArc ? 1 : 0;
            sweep = pathSegment.sweepDirection ? pathSegment.sweepDirection : 0;
            sb = sb + ('M' + ' ' + x1 + ' ' + y1 + ' ' + 'A' + ' ' + r1 + ' ' + r2 + ' ' +
                angle + ' ' + isLargeArc + ' ' + sweep + ' ' + x2 + ' ' + y2 + ' ');
        }
        path = sb.toString();
        return path;
    };
    AxisRender.prototype.measureHMinorGridLines = function (smithchart) {
        var radialPoint1;
        var radialPoint2;
        var arcPoints = [];
        var isLargeArc;
        var startPoint;
        var endPoint;
        var size;
        var cx;
        var maxCount = smithchart.horizontalAxis.minorGridLines.count;
        var diameter;
        var previous;
        var next;
        var space;
        var count;
        var interval;
        var radius;
        var leftX;
        this.minorHGridArcPoints = [];
        diameter = this.areaRadius * 2;
        for (var i = 0; i < this.horizontalLabelCollections.length - 3; i++) {
            previous = this.horizontalLabelCollections[i];
            next = this.horizontalLabelCollections[i + 1];
            space = (previous['radius'] - next['radius']) * 2;
            count = Math.floor((maxCount / 100) * space);
            interval = space / count;
            for (var j = 0; j < count; j++) {
                radius = next['radius'] + (j * interval) / 2;
                leftX = (smithchart.renderType === 'Impedance') ?
                    (this.circleLeftX + diameter) - (radius * 2) : this.circleLeftX;
                cx = leftX + radius;
                isLargeArc = next['value'] > 5;
                arcPoints = this.calculateMinorArcStartEndPoints(next['value']);
                if (smithchart.renderType === 'Impedance') {
                    radialPoint1 = arcPoints[0];
                    radialPoint2 = arcPoints[1];
                }
                else {
                    radialPoint1 = arcPoints[1];
                    radialPoint2 = arcPoints[0];
                }
                startPoint = this.intersectingCirclePoints(radialPoint1[0].centerX, radialPoint1[0].centerY, radialPoint1[0].radius, cx, previous['centerY'], radius, smithchart.renderType);
                endPoint = this.intersectingCirclePoints(radialPoint2[0].centerX, radialPoint2[0].centerY, radialPoint2[0].radius, cx, previous['centerY'], radius, smithchart.renderType);
                size = { width: radius, height: radius };
                this.minorHGridArcPoints.push({
                    startPoint: startPoint,
                    endPoint: endPoint,
                    rotationAngle: 2 * Math.PI,
                    sweepDirection: (smithchart.renderType === 'Impedance') ?
                        this.direction['counterclockwise'] : this.direction['clockwise'],
                    isLargeArc: isLargeArc,
                    size: size
                });
                
            }
        }
    };
    AxisRender.prototype.measureRMinorGridLines = function (smithchart) {
        var maxCount = smithchart.radialAxis.minorGridLines.count;
        var arcCx;
        var nextAngle;
        var betweenAngle;
        var circlePoint;
        var circumference;
        var arcStartX;
        var arcStartY;
        var arcStartPoint;
        var previous;
        var next;
        var size;
        var distance;
        var count;
        var interval;
        var centerValue;
        circumference = Math.PI * (this.areaRadius * 2);
        arcStartX = arcCx = (smithchart.renderType === 'Impedance') ?
            this.circleCenterX + this.areaRadius : this.circleCenterX - this.areaRadius;
        arcStartY = this.circleCenterY;
        this.minorGridArcPoints = [];
        arcStartPoint = { x: arcStartX, y: arcStartY };
        for (var i = 2; i < this.labelCollections.length - 3; i++) {
            previous = this.labelCollections[i];
            next = this.labelCollections[i + 1];
            if (smithchart.renderType === 'Impedance') {
                nextAngle = next['angle'] === 360 ? 0 : next['angle'];
                betweenAngle = Math.abs(nextAngle - previous['angle']);
            }
            else {
                nextAngle = previous['angle'] === 360 ? 0 : previous['angle'];
                betweenAngle = Math.abs(nextAngle - next['angle']);
            }
            distance = (circumference / 360) * betweenAngle;
            count = Math.floor((maxCount / 100) * distance);
            interval = betweenAngle / count;
            centerValue = next['value'] > 0 ? next['value'] : previous['value'];
            circlePoint = this.minorGridLineArcIntersectCircle(Math.abs(centerValue));
            for (var j = 1; j < count; j++) {
                var outterInterSectAngle = (interval * j) + (previous['angle'] === 360 ? nextAngle : previous['angle']);
                var outerInterSectPoint = this.circlePointPosition(this.circleCenterX, this.circleCenterY, outterInterSectAngle, this.areaRadius);
                var radius = this.arcRadius(arcStartPoint, outerInterSectPoint, outterInterSectAngle);
                var arcCy = outterInterSectAngle > 180 ? this.circleCenterY - radius : this.circleCenterY + radius;
                var innerInterSectPoint = this.intersectingCirclePoints(arcCx, arcCy, radius, circlePoint[0].centerX, circlePoint[0].centerY, circlePoint[0].radius, smithchart.renderType);
                var startPoint = { x: innerInterSectPoint.x, y: innerInterSectPoint.y };
                var endPoint = { x: outerInterSectPoint.x, y: outerInterSectPoint.y };
                size = { width: radius, height: radius };
                var sweepDirection = previous['value'] >= 0 ? this.direction['clockwise'] : this.direction['counterclockwise'];
                this.minorGridArcPoints.push({
                    startPoint: startPoint,
                    endPoint: endPoint,
                    rotationAngle: 2 * Math.PI,
                    sweepDirection: sweepDirection,
                    isLargeArc: false,
                    size: size
                });
                
            }
        }
    };
    AxisRender.prototype.minorGridLineArcIntersectCircle = function (centerValue) {
        var circlePoint;
        var calValue;
        if (centerValue >= 3) {
            calValue = 20;
        }
        else if (centerValue >= 1.5) {
            calValue = 10;
        }
        else if (centerValue >= 0.6) {
            calValue = 3;
        }
        else {
            calValue = 2;
        }
        circlePoint = this.horizontalLabelCollections.filter(function (c) { return c['value'] === calValue; });
        return circlePoint;
    };
    AxisRender.prototype.circlePointPosition = function (cx, cy, angle, r) {
        var pointX;
        var pointY;
        var radian;
        radian = angle * (Math.PI / 180);
        pointX = cx + r * Math.cos(radian);
        pointY = cy + r * Math.sin(radian);
        return { x: pointX, y: pointY };
    };
    AxisRender.prototype.setLabelsInsidePosition = function (angle, px, py, textSize) {
        var x = px;
        var y = py;
        if (angle === 0 || angle === 360) {
            x -= textSize.width;
            y -= textSize.height / 2;
        }
        else if (angle === 90) {
            x -= textSize.width;
            y += textSize.height / 8;
        }
        else if (angle === 180) {
            y += textSize.height;
        }
        else if (angle === 270) {
            y += textSize.height / 2;
        }
        else if (angle > 0 && angle <= 20) {
            x -= (textSize.width);
        }
        else if (angle > 20 && angle <= 60) {
            x -= (textSize.width + textSize.width / 2);
            y += textSize.height / 2;
        }
        else if (angle > 60 && angle < 90) {
            x -= (textSize.width + textSize.width / 4);
            y += textSize.height / 4;
        }
        else if (angle > 90 && angle <= 135) {
            x -= (textSize.width / 2);
            y += (textSize.height) / 16;
        }
        else if (angle > 135 && angle <= 150) {
            x += (textSize.width / 2);
            y += (textSize.height / 2);
        }
        else if (angle > 150 && angle < 180) {
            x += (textSize.width / 2);
            y += (textSize.height);
        }
        else if (angle > 180 && angle <= 210) {
            x += (textSize.width / 6);
            y += (textSize.height / 6);
        }
        else if (angle > 210 && angle < 240) {
            y += (textSize.height / 4);
        }
        else if (angle > 225 && angle < 270) {
            y += (textSize.height / 3);
        }
        else if (angle > 270 && angle <= 300) {
            x -= (textSize.width + textSize.width / 4);
            y += (textSize.height / 4);
        }
        else if (angle > 300 && angle <= 330) {
            x -= (textSize.width + textSize.width / 3);
            y += (textSize.height / 4);
        }
        else if (angle > 330 && angle <= 340) {
            x -= (textSize.width + textSize.width / 2);
            y += textSize.height / 4;
        }
        else if (angle > 340) {
            x -= textSize.width;
            y += textSize.height / 8;
        }
        return { x: x, y: y };
    };
    AxisRender.prototype.setLabelsOutsidePosition = function (angle, px, py, textSize) {
        var x = px;
        var y = py;
        if (angle === 90) {
            x -= textSize.width / 2;
            y += textSize.height;
        }
        else if (angle === 180) {
            x -= (textSize.width + 5);
            y -= textSize.height / 4;
        }
        else if (angle === 270) {
            x -= textSize.width / 2;
            y -= textSize.height / 4;
        }
        else if (angle === 360) {
            x += 5;
            y -= textSize.height / 2;
        }
        else if (angle > 0 && angle <= 30) {
            x += textSize.width / 4;
            y += textSize.height / 8;
        }
        else if (angle > 30 && angle <= 60) {
            x += textSize.width / 2;
            y += textSize.height / 4;
        }
        else if (angle > 60 && angle <= 90) {
            x -= textSize.width / 2;
            y += textSize.height;
        }
        else if (angle > 90 && angle <= 135) {
            x -= textSize.width;
            y += textSize.height;
        }
        else if (angle > 135 && angle <= 180) {
            x -= (textSize.width + textSize.width / 4);
            y += textSize.height / 4;
        }
        else if (angle > 180 && angle <= 210) {
            x -= textSize.width + textSize.width / 4;
            y -= textSize.height / 4;
        }
        else if (angle > 210 && angle <= 270) {
            x -= textSize.width;
            y -= textSize.height / 4;
        }
        else if (angle > 270 && angle <= 340) {
            y -= textSize.height / 4;
        }
        else if (angle > 340) {
            y += textSize.height / 4;
            x += textSize.width / 6;
        }
        return { x: x, y: y };
    };
    AxisRender.prototype.arcRadius = function (startPoint, endPoint, angle) {
        var mx;
        var my;
        var u;
        var t;
        var cy;
        var radius;
        var radian;
        radian = angle > 180 ? (90 * Math.PI / 180) : (270 * Math.PI / 180); // Angle 90 and 270 used for calculating upper and lower circle
        mx = (endPoint.x - startPoint.x) / 2;
        my = (endPoint.y - startPoint.y) / 2;
        u = (Math.cos(radian) * my - Math.sin(radian) * mx) / (Math.cos(radian) * mx + Math.sin(radian) * my);
        t = (my - mx * u) / Math.sin(radian);
        cy = startPoint.y + Math.sin(radian) * t;
        radius = Math.abs(startPoint.y - cy);
        return radius;
    };
    return AxisRender;
}());

/* tslint:disable:no-string-literal */
var Marker = /** @class */ (function () {
    function Marker() {
    }
    Marker.prototype.drawMarker = function (smithchart, seriesindex, groupElement, pointsRegion) {
        if (smithchart.series[seriesindex].marker.visible) {
            var marker = smithchart.series[seriesindex].marker;
            var count = smithchart.series[seriesindex].points.length - 1;
            var width = marker.width;
            var height = marker.height;
            var symbolName = marker.shape;
            var gmEle = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' +
                    '_series' + seriesindex + '_Marker' });
            groupElement.appendChild(gmEle);
            var borderWidth = marker.border.width;
            var borderColor = marker.border.color;
            var opacity = marker.opacity;
            var fill = marker.fill ? marker.fill : (smithchart.series[seriesindex].fill ||
                smithchart.seriesColors[seriesindex % smithchart.seriesColors.length]);
            for (var i = 0; i < count + 1; i++) {
                var location_1 = pointsRegion[i]['point'];
                var pointIndex = i;
                var options = new MarkerOptions(smithchart.element.id + '_Series' + seriesindex + '_Points' + pointIndex + '_Marker' + pointIndex, fill, borderColor, borderWidth, opacity);
                gmEle.appendChild(this.drawSymbol(symbolName, marker.imageUrl, location_1, new SmithchartSize(width, height), options, smithchart));
            }
        }
    };
    Marker.prototype.drawSymbol = function (symbolName, url, location, size, options, smithchart) {
        var markerEle;
        var shape = symbolName.toLowerCase();
        var circleOptions;
        var pathOptions;
        var path;
        var border = { color: options['borderColor'], width: options['borderWidth'] };
        var opacity = options.opacity;
        var startX = location.x;
        var startY = location.y;
        var radius = Math.sqrt(size.height * size.height + size.width * size.width) / 2;
        switch (shape) {
            case 'circle':
                circleOptions = new CircleOption(options['id'], options['fill'], border, opacity, location.x, location.y, radius, null);
                markerEle = smithchart.renderer.drawCircle(circleOptions);
                break;
            case 'rectangle':
                path = 'M' + ' ' + (startX + (-size.width / 2)) + ' ' + (startY + (-size.height / 2)) +
                    ' ' + 'L' + ' ' + (startX + (size.width / 2)) + ' ' + (startY + (-size.height / 2)) + ' ' +
                    'L' + ' ' + (startX + (size.width / 2)) + ' ' + (startY + (size.height / 2)) +
                    ' ' + 'L' + ' ' + (startX + (-size.width / 2)) +
                    ' ' + (startY + (size.height / 2)) + ' ' + 'L' + ' ' +
                    (startX + (-size.width / 2)) + ' ' + (startY + (-size.height / 2)) + 'z';
                pathOptions = new PathOption(options['id'], options['fill'], border.width, border.color, opacity, '', path);
                markerEle = smithchart.renderer.drawPath(pathOptions);
                break;
            case 'triangle':
                path = 'M' + ' ' + (startX + (-size.width / 2)) + ' ' + (startY + (size.height / 2)) + ' ' + 'L' + ' ' + (startX) + ' ' +
                    (startY + (-size.height / 2)) + ' ' + 'L' + ' ' + (startX + (size.width / 2)) + ' ' +
                    (startY + (size.height / 2)) + ' ' + 'L' + ' ' +
                    (startX + (-size.width / 2)) + ' ' + (startY + (size.height / 2)) + 'z';
                pathOptions = new PathOption(options['id'], options['fill'], border.width, border.color, opacity, '', path);
                markerEle = smithchart.renderer.drawPath(pathOptions);
                break;
            case 'diamond':
                path = 'M' + ' ' + (startX + (-size.width / 2)) + ' ' + (startY) + ' ' + 'L' + ' ' +
                    (startX) + ' ' + (startY + (-size.height / 2)) + ' ' + 'L' + ' ' + (startX + (size.width / 2)) + ' ' +
                    (startY) + ' ' + 'L' + ' ' + (startX) + ' ' + (startY + (size.height / 2)) + ' ' + 'L' + ' ' +
                    (startX + (-size.width / 2)) + ' ' + (startY) + 'z';
                pathOptions = new PathOption(options['id'], options['fill'], border.width, border.color, opacity, '', path);
                markerEle = smithchart.renderer.drawPath(pathOptions);
                break;
            case 'pentagon':
                var eq = 72;
                for (var i = 0; i <= 5; i++) {
                    var xValue = radius * Math.cos((Math.PI / 180) * (i * eq));
                    var yValue = radius * Math.sin((Math.PI / 180) * (i * eq));
                    if (i === 0) {
                        path = 'M' + ' ' + (startX + xValue) + ' ' + (startY + yValue) + ' ';
                    }
                    else {
                        path = path.concat('L' + ' ' + (startX + xValue) + ' ' + (startY + yValue) + ' ');
                    }
                }
                path = path.concat('Z');
                pathOptions = new PathOption(options['id'], options['fill'], border.width, border.color, opacity, '', path);
                markerEle = smithchart.renderer.drawPath(pathOptions);
                break;
        }
        return markerEle;
    };
    return Marker;
}());

/**
 *
 */
/* tslint:disable:no-string-literal */
var DataLabel = /** @class */ (function () {
    function DataLabel() {
        this.textOptions = [];
        this.labelOptions = [];
        this.allPoints = [];
    }
    DataLabel.prototype.drawDataLabel = function (smithchart, seriesindex, groupElement, pointsRegion, bounds) {
        this.textOptions = [];
        this.allPoints = [];
        var margin = smithchart.margin;
        var pointIndex;
        var marker = smithchart.series[seriesindex].marker;
        var region;
        var labelPosition;
        var labelText;
        var textSize;
        var dataLabel = marker.dataLabel;
        var font = dataLabel.textStyle;
        var count = pointsRegion.length;
        for (var i = 0; i < count; i++) {
            labelText = smithchart.series[seriesindex].points[i].reactance.toString();
            textSize = measureText(labelText, font);
            region = pointsRegion[i]['point'];
            var xPos = region.x - textSize.width / 2;
            var yPos = region.y - (textSize.height + marker['height'] + (margin.top));
            var width = textSize.width + (margin.left / 2) + (margin.right / 2);
            var height = textSize.height + (margin.top / 2) + (margin.bottom / 2);
            pointIndex = i;
            labelPosition = new SmithchartLabelPosition();
            labelPosition = { textX: xPos + (margin.left / 2), textY: yPos + (height / 2) + margin.top / 2, x: xPos, y: yPos };
            this.textOptions[i] = {
                id: smithchart.element.id + '_Series' + seriesindex + '_Points' + pointIndex + '_dataLabel' + '_displayText' + i,
                x: labelPosition['textX'],
                y: labelPosition['textY'],
                fill: 'black',
                text: labelText,
                font: font,
                xPosition: xPos,
                yPosition: yPos,
                width: width,
                height: height,
                location: region,
                labelOptions: labelPosition,
                visible: true,
                connectorFlag: null
            };
        }
        var labelOption = new LabelOption();
        labelOption.textOptions = this.textOptions;
        this.labelOptions.push(labelOption);
        this.drawDatalabelSymbol(smithchart, seriesindex, dataLabel, groupElement, bounds, pointsRegion);
    };
    DataLabel.prototype.calculateSmartLabels = function (points, seriesIndex) {
        var length = points['textOptions'].length;
        var count = 0;
        for (var k = 0; k < length; k++) {
            this.allPoints[this.allPoints.length] = points['textOptions'][k];
            this.connectorFlag = false;
            this.compareDataLabels(k, points, count, seriesIndex);
            this.labelOptions[seriesIndex]['textOptions'][k] = points['textOptions'][k];
            this.labelOptions[seriesIndex]['textOptions'][k].connectorFlag = this.connectorFlag;
        }
    };
    DataLabel.prototype.compareDataLabels = function (i, points, count, m) {
        var length = this.allPoints.length;
        var padding = 10;
        var collide;
        var currentLabel;
        var prevLabel;
        for (var j = 0; j < length; j++) {
            prevLabel = this.allPoints[j];
            currentLabel = this.allPoints[length - 1];
            collide = this.isCollide(prevLabel, currentLabel);
            if (collide) {
                this.connectorFlag = true;
                switch (count) {
                    case 0:
                        // Right
                        this.resetValues(currentLabel);
                        this.prevLabel = prevLabel;
                        currentLabel['xPosition'] = this.prevLabel['xPosition'] + (this.prevLabel['width'] / 2 +
                            currentLabel['width'] / 2 + padding);
                        currentLabel['x'] = currentLabel['xPosition'] + padding / 2;
                        count += 1;
                        this.compareDataLabels(i, points, count, m);
                        break;
                    case 1:
                        // Right Bottom
                        this.resetValues(currentLabel);
                        currentLabel['xPosition'] = this.prevLabel['xPosition'] + this.prevLabel['width'] / 2 +
                            currentLabel['width'] / 2 + padding;
                        currentLabel['x'] = currentLabel['xPosition'] + padding / 2;
                        currentLabel['yPosition'] = currentLabel['location'].y + currentLabel['height'] / 2 + padding / 2;
                        currentLabel['y'] = currentLabel['yPosition'] + ((currentLabel['height'] / 2)) + padding / 2;
                        count += 1;
                        this.compareDataLabels(i, points, count, m);
                        break;
                    case 2:
                        // Bottom
                        this.resetValues(currentLabel);
                        currentLabel['yPosition'] = currentLabel['location'].y + currentLabel['height'] / 2 + padding / 2;
                        currentLabel['y'] = currentLabel['yPosition'] + (currentLabel['height'] / 2) + padding / 2;
                        count += 1;
                        this.compareDataLabels(i, points, count, m);
                        break;
                    case 3:
                        // Left Bottom
                        this.resetValues(currentLabel);
                        currentLabel['xPosition'] = this.prevLabel['xPosition'] - this.prevLabel['width'] / 2
                            - currentLabel['width'] / 2 - padding;
                        currentLabel['x'] = currentLabel['xPosition'] + padding / 2;
                        currentLabel['yPosition'] = currentLabel['height'] / 2 + currentLabel['location'].y + padding / 2;
                        currentLabel['y'] = currentLabel['yPosition'] + ((currentLabel['height'] / 2)) + padding / 2;
                        count += 1;
                        this.compareDataLabels(i, points, count, m);
                        break;
                    case 4:
                        // Left
                        this.resetValues(currentLabel);
                        currentLabel['xPosition'] = (this.prevLabel['xPosition'] - this.prevLabel['width'] / 2 -
                            currentLabel['width'] / 2 - padding);
                        currentLabel['x'] = currentLabel['xPosition'] + padding / 2;
                        count += 1;
                        this.compareDataLabels(i, points, count, m);
                        break;
                    case 5:
                        //Left Top
                        this.resetValues(currentLabel);
                        currentLabel['xPosition'] = this.prevLabel['xPosition'] - this.prevLabel['width'] / 2 -
                            currentLabel['width'] / 2 - padding;
                        currentLabel['x'] = currentLabel['xPosition'] + padding / 2;
                        currentLabel['yPosition'] = this.prevLabel['yPosition'] - currentLabel['height'] - padding;
                        currentLabel['y'] = currentLabel['yPosition'] + currentLabel['height'] / 2 + padding / 2;
                        count += 1;
                        this.compareDataLabels(i, points, count, m);
                        break;
                    case 6:
                        // Top
                        this.resetValues(currentLabel);
                        currentLabel['yPosition'] = (this.prevLabel['yPosition']) - (currentLabel['height'] + padding);
                        currentLabel['y'] = currentLabel['yPosition'] + (currentLabel['height'] / 2) + padding / 2;
                        count += 1;
                        this.compareDataLabels(i, points, count, m);
                        break;
                    case 7:
                        // Right Top
                        this.resetValues(currentLabel);
                        currentLabel['xPosition'] = this.prevLabel['xPosition'] + this.prevLabel['width'] / 2 +
                            currentLabel['width'] / 2 + padding;
                        currentLabel['x'] = currentLabel['xPosition'] + padding / 2;
                        currentLabel['yPosition'] = this.prevLabel['yPosition'] - currentLabel['height'] - padding;
                        currentLabel['y'] = currentLabel['yPosition'] + (currentLabel['height'] / 2) + padding / 2;
                        count += 1;
                        this.compareDataLabels(i, points, count, m);
                        break;
                    case 8:
                        count = 0;
                        this.compareDataLabels(i, points, count, m);
                        break;
                }
            }
        }
    };
    DataLabel.prototype.isCollide = function (dataLabel1, dataLabel2) {
        var state = false;
        if (dataLabel1 !== dataLabel2) {
            state = !( // to compare data labels
            ((dataLabel1['y'] + dataLabel1['height']) < (dataLabel2['y'])) ||
                (dataLabel1['y'] > (dataLabel2['y'] + dataLabel2['height'])) ||
                ((dataLabel1['x'] + dataLabel1['width'] / 2) < dataLabel2['x'] - dataLabel2['width'] / 2) ||
                (dataLabel1['x'] - dataLabel1['width'] / 2 > (dataLabel2['x'] + dataLabel2['width'] / 2)));
        }
        return state;
    };
    DataLabel.prototype.resetValues = function (currentPoint) {
        currentPoint['xPosition'] = currentPoint['labelOptions']['x'];
        currentPoint['yPosition'] = currentPoint['labelOptions']['y'];
        currentPoint['x'] = currentPoint['labelOptions']['textX'];
        currentPoint['y'] = currentPoint['labelOptions']['textY'];
    };
    DataLabel.prototype.drawConnectorLines = function (smithchart, seriesIndex, index, currentPoint, groupElement) {
        var xPos = currentPoint['xPosition'];
        var yPos = currentPoint['yPosition'];
        var location = currentPoint['location'];
        var endY;
        if (location.y > currentPoint['y']) {
            endY = (currentPoint['y']);
        }
        else {
            endY = (currentPoint['y'] - currentPoint['height'] / 2); // bottom
        }
        var connectorDirection = 'M' + ' ' + (location.x) + ' ' + (location.y) + ' ' + 'L' + ' ' +
            (currentPoint['x']) + ' ' + (endY);
        var connectorLineValues = smithchart.series[seriesIndex].marker.dataLabel.connectorLine;
        var stroke = connectorLineValues.color ? connectorLineValues.color :
            (smithchart.series[seriesIndex].fill ||
                smithchart.seriesColors[seriesIndex % smithchart.seriesColors.length]);
        var options = new PathOption(smithchart.element.id + '_dataLabelConnectorLine' + '_series' + seriesIndex + '_point' + index, 'none', connectorLineValues.width, stroke, 1, 'none', connectorDirection);
        var element = smithchart.renderer.drawPath(options);
        groupElement.appendChild(element);
    };
    DataLabel.prototype.drawDatalabelSymbol = function (smithchart, seriesindex, dataLabel, groupElement, bounds, pointsRegion) {
        for (var i = 0; i < smithchart.series[seriesindex].points.length; i++) {
            if (dataLabel.template) {
                var labelTemplateElement = sf.base.createElement('div', {
                    id: smithchart.element.id + '_seriesIndex_' + seriesindex + '_Label_Template_Group',
                    className: 'template',
                    styles: 'position: absolute;'
                    /* 'top:' + bounds['x'] + 'px;' +
                     'left:' + bounds['y'] + 'px;' +
                     'height:' + smithchart.availableSize.height + 'px;' +
                     'width:' + smithchart.availableSize.width + 'px;'*/
                });
                document.getElementById(smithchart.element.id + '_Secondary_Element').appendChild(labelTemplateElement);
                var templateFn = void 0;
                var labelElement = void 0;
                var id = dataLabel.template + '_seriesIndex' + seriesindex + '_pointIndex' + i + smithchart.element.id;
                var data = { point: smithchart.series[seriesindex].points[i].reactance };
                templateFn = getTemplateFunction(dataLabel.template);
                var templateElement = templateFn(smithchart);
                labelElement = convertElementFromLabel(templateElement, id, data, seriesindex, smithchart);
                labelTemplateElement.appendChild(labelElement);
                labelElement.style.left = pointsRegion[i].point.x - labelElement.offsetWidth / 2 + 'px';
                labelElement.style.top = pointsRegion[i].point.y - labelElement.offsetHeight -
                    smithchart.series[seriesindex].marker.height / 2 + 'px';
                var blazorId = '_seriesIndex' + seriesindex + '_pointIndex' + i + smithchart.element.id;
                sf.base.updateBlazorTemplate(blazorId + 'Template', 'Template');
                var left = parseInt(labelElement.style.left, 10);
                var top_1 = parseInt(labelElement.style.top, 10);
                var width = labelElement.offsetWidth;
                var height = labelElement.offsetHeight;
                var region = pointsRegion[i]['point'];
                var labelPosition = { textX: left, textY: top_1,
                    x: left, y: top_1 };
                this.labelOptions[seriesindex]['textOptions'][i] = {
                    id: id,
                    x: left,
                    y: top_1,
                    fill: 'black',
                    text: '',
                    font: dataLabel.textStyle,
                    xPosition: left,
                    yPosition: top_1,
                    width: width,
                    height: height,
                    location: region,
                    labelOptions: labelPosition,
                    visible: true,
                    connectorFlag: null
                };
            }
        }
    };
    return DataLabel;
}());

/* tslint:disable:no-string-literal */
var SeriesRender = /** @class */ (function () {
    function SeriesRender() {
        this.xValues = [];
        this.yValues = [];
        this.pointsRegion = [];
        this.lineSegments = [];
        this.location = [];
        this.dataLabel = new DataLabel();
    }
    SeriesRender.prototype.processData = function (series) {
        var dataArray = series.dataSource;
        var resistance = series.resistance;
        var reactance = series.reactance;
        var tooltip = series.tooltipMappingName;
        series.points = [];
        for (var i = 0; i < dataArray.length; i++) {
            series.points.push({
                resistance: dataArray[i][resistance],
                reactance: dataArray[i][reactance],
                tooltip: dataArray[i][tooltip]
            });
        }
    };
    // tslint:disable:max-func-body-length
    SeriesRender.prototype.draw = function (smithchart, axisRender, bounds) {
        var groupElement = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + '_seriesCollections' });
        var resistantCx;
        var reactanceCy;
        var series = smithchart.series;
        var seriesLength = series.length;
        var chartAreaRadius = axisRender.areaRadius;
        var interSectPoint;
        var index;
        for (var m = 0; m < seriesLength; m++) {
            var seriesIndex = m;
            if (series[m].dataSource && series[m].resistance && series[m].reactance) {
                this.processData(series[m]);
            }
            this.pointsRegion[m] = [];
            this.location[m] = [];
            for (var j = 0; j < series[m].points.length; j++) {
                this.xValues[j] = series[m].points[j]['resistance'];
                this.yValues[j] = series[m].points[j]['reactance'];
            }
            var chartAreaCx = axisRender.circleCenterX;
            var chartAreaCy = axisRender.circleCenterY;
            var diameter = axisRender.areaRadius * 2;
            var reactanceStartPoint = {
                x: chartAreaCx + ((smithchart.renderType === 'Impedance') ?
                    chartAreaRadius : -chartAreaRadius), y: chartAreaCy
            };
            var resistantCy = chartAreaCy;
            var reactanceCx = reactanceStartPoint.x;
            for (var k = 0; k < series[m].points.length; k++) {
                var resistance = this.xValues[k];
                var resistantR = (diameter * (1 / (resistance + 1))) / 2;
                var reactance = this.yValues[k];
                var reactanceR = Math.abs(((1 / reactance) * diameter) / 2);
                if (smithchart.renderType === 'Impedance') {
                    reactanceCy = reactance > 0 ? chartAreaCy - reactanceR : chartAreaCy + reactanceR;
                    resistantCx = (axisRender.circleLeftX + diameter - resistantR);
                }
                else {
                    reactanceCy = reactance < 0 ? chartAreaCy - reactanceR : chartAreaCy + reactanceR;
                    resistantCx = (axisRender.circleLeftX + resistantR);
                }
                interSectPoint = axisRender.intersectingCirclePoints(reactanceCx, reactanceCy, reactanceR, resistantCx, resistantCy, resistantR, smithchart.renderType);
                var epsilon = _getEpsilonValue();
                if (Math.abs(reactance) < epsilon) {
                    interSectPoint.x = (smithchart.renderType === 'Impedance') ?
                        resistantCx - resistantR : resistantCx + resistantR;
                    interSectPoint.y = chartAreaCy;
                }
                this.pointsRegion[m][k] = new PointRegion();
                this.pointsRegion[m][k] = { point: interSectPoint, x: resistance, y: reactance };
                this.location[m][k] = { x: interSectPoint.x, y: interSectPoint.y };
            }
            for (var i = 0; i < series[m].points.length - 1; i++) {
                index = i + 1;
                this.lineSegments[i] = new LineSegment();
                this.lineSegments[i] = { x1: this.xValues[i], y1: this.yValues[i], x2: this.xValues[index], y2: this.yValues[index] };
            }
            smithchart.svgObject.appendChild(groupElement);
            this.drawSeries(smithchart, seriesIndex, groupElement, bounds);
        }
        for (var j = 0; j < smithchart.series.length; j++) {
            if (smithchart.series[j].enableSmartLabels && smithchart.series[j].marker.dataLabel.visible) {
                var gdlcEle = smithchart.renderer.createGroup({
                    'id': smithchart.element.id + '_svg'
                        + '_series' + j + '_Datalabel' + '_connectorLines'
                });
                var element = document.getElementById(smithchart.element.id + '_svg' + '_seriesCollection' + j);
                if (element) {
                    element.appendChild(gdlcEle);
                }
                this.dataLabel.calculateSmartLabels(this.dataLabel.labelOptions[j], j);
                for (var k = 0; k < smithchart.series[j].points.length; k++) {
                    var currentPoint = this.dataLabel.labelOptions[j]['textOptions'][k];
                    if ((currentPoint.xPosition + currentPoint.width) > (smithchart.chartArea.x + smithchart.chartArea.width)
                        || currentPoint.xPosition < smithchart.chartArea.x || currentPoint.yPosition < smithchart.chartArea.y ||
                        currentPoint.yPosition + currentPoint.height > smithchart.chartArea.y + smithchart.chartArea.height) {
                        this.dataLabel.labelOptions[j].textOptions[k].connectorFlag = false;
                        this.dataLabel.labelOptions[j].textOptions[k].visible = false;
                    }
                    if (currentPoint['connectorFlag']) {
                        this.dataLabel.drawConnectorLines(smithchart, j, k, currentPoint, gdlcEle);
                    }
                }
            }
        }
        var _loop_1 = function (j) {
            var dataLabel = smithchart.series[j].marker.dataLabel;
            if (smithchart.series[j].marker.dataLabel.visible) {
                var element = document.getElementById(smithchart.element.id + '_svg' + '_seriesCollection' + j);
                var gdEle_1 = smithchart.renderer.createGroup({
                    'id': smithchart.element.id + '_svg'
                        + '_series' + j + '_Datalabel'
                });
                if (element) {
                    element.appendChild(gdEle_1);
                }
                var _loop_2 = function (k) {
                    var currentPoint = this_1.dataLabel.labelOptions[j]['textOptions'][k];
                    if (!dataLabel.template && currentPoint.visible) {
                        var options_1 = new DataLabelTextOptions();
                        options_1 = this_1.dataLabel.labelOptions[j]['textOptions'][k];
                        var font_1 = dataLabel.textStyle;
                        var x = options_1['xPosition'];
                        var y = options_1['yPosition'];
                        var id = smithchart.element.id + '_Series' + j + '_Points' + k + '_dataLabel' + '_symbol' + k;
                        var fill = dataLabel['fill'] ? dataLabel['fill'] : (smithchart.series[j].fill ||
                            smithchart.seriesColors[j % smithchart.seriesColors.length]);
                        var border = smithchart.series[j].marker.dataLabel.border;
                        var rectOptions = new RectOption(id, fill, border, options_1['opacity'], new SmithchartRect(x, y, options_1['width'], options_1['height']));
                        var dataEle = smithchart.renderer.drawRectangle(rectOptions);
                        gdEle_1.appendChild(dataEle);
                        var textRenderEventArgs = {
                            text: options_1['text'],
                            x: options_1['x'],
                            y: options_1['y'],
                            seriesIndex: j,
                            pointIndex: k,
                            name: textRender,
                            cancel: false
                        };
                        var textRenderSuccess = function (args) {
                            if (!args.cancel) {
                                var textoptions = new TextOption(options_1['id'], args.x, args.y, 'start', args.text);
                                var color = font_1.color ? font_1.color : smithchart.themeStyle.dataLabel;
                                var element_1 = renderTextElement(textoptions, font_1, color, gdEle_1);
                                gdEle_1.appendChild(element_1);
                            }
                        };
                        textRenderSuccess.bind(this_1);
                        smithchart.trigger(textRender, textRenderEventArgs, textRenderSuccess);
                    }
                    else if (dataLabel.template) {
                        var element_2 = document.getElementById(dataLabel.template + '_seriesIndex' + j + '_pointIndex' +
                            k + smithchart.element.id);
                        element_2.style.left = this_1.dataLabel.labelOptions[j]['textOptions'][k].xPosition + 'px';
                        element_2.style.top = this_1.dataLabel.labelOptions[j]['textOptions'][k].yPosition + 'px';
                    }
                };
                for (var k = 0; k < smithchart.series[j].points.length; k++) {
                    _loop_2(k);
                }
            }
        };
        var this_1 = this;
        for (var j = 0; j < smithchart.series.length; j++) {
            _loop_1(j);
        }
        for (var i = 0; i < smithchart.series.length; i++) {
            if (smithchart.series[i].enableAnimation && smithchart.animateSeries) {
                if (smithchart.series[i].marker.dataLabel.template) {
                    this.animateDataLabelTemplate(i, smithchart);
                }
                var element = document.getElementById(smithchart.element.id + '_svg' + '_seriesCollection' + i);
                this.performAnimation(smithchart, element, i);
            }
        }
    };
    SeriesRender.prototype.drawSeries = function (smithchart, seriesindex, groupElement, bounds) {
        var _this = this;
        var gsEle = smithchart.renderer.createGroup({
            'id': smithchart.element.id + '_svg' + '_seriesCollection' + seriesindex,
            'clip-path': 'url(#' + smithchart.element.id + '_ChartSeriesClipRect_' +
                seriesindex + ')'
        });
        gsEle.setAttribute('visibility', smithchart.series[seriesindex].visibility);
        groupElement.appendChild(gsEle);
        var sb = '';
        var path;
        var marker = smithchart.series[seriesindex].marker;
        var element;
        var count = smithchart.series[seriesindex].points.length - 1;
        for (var i = 0; i < count; i++) {
            var point1 = this.pointsRegion[seriesindex][i]['point'];
            var point2 = this.pointsRegion[seriesindex][i + 1]['point'];
            sb = sb + ('M' + ' ' + (point1.x) + ' ' + (point1.y) + ' ' + 'L' +
                ' ' + (point2.x) + ' ' + (point2.y) + ' ');
        }
        path = sb.toString();
        var fill = smithchart.series[seriesindex].fill || smithchart.seriesColors[seriesindex % smithchart.seriesColors.length];
        var seriesEventArgs = {
            text: smithchart.series[seriesindex].name,
            fill: fill,
            name: seriesRender,
            cancel: false
        };
        var seriesRenderSuccess = function (args) {
            if (!args.cancel) {
                var options = new PathOption(smithchart.element.id + '_series' + seriesindex + '_points', 'none', smithchart.series[seriesindex].width, seriesEventArgs.fill, smithchart.series[seriesindex].opacity, 'none', path);
                _this.clipRectElement = smithchart.renderer.drawClipPath(new RectOption(smithchart.element.id + '_ChartSeriesClipRect_' + seriesindex, 'transparent', { width: 1, color: 'Gray' }, 1, {
                    x: bounds.x, y: bounds.y,
                    width: smithchart.availableSize.width,
                    height: smithchart.availableSize.height
                }));
                gsEle.appendChild(_this.clipRectElement);
                var gspEle = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_svg' + seriesindex });
                element = smithchart.renderer.drawPath(options);
                gspEle.appendChild(element);
                gsEle.appendChild(gspEle);
            }
        };
        seriesRenderSuccess.bind(this);
        smithchart.trigger(seriesRender, seriesEventArgs, seriesRenderSuccess);
        var markerrender = new Marker();
        markerrender.drawMarker(smithchart, seriesindex, gsEle, this.pointsRegion[seriesindex]);
        this.dataLabel.drawDataLabel(smithchart, seriesindex, gsEle, this.pointsRegion[seriesindex], bounds);
    };
    SeriesRender.prototype.animateDataLabelTemplate = function (seriesindex, smithchart) {
        var length = smithchart.series[seriesindex].points.length;
        var delay = 0;
        var duration = parseFloat(smithchart.series[seriesindex].animationDuration);
        for (var i = 0; i < length; i++) {
            var element = document.getElementById(smithchart.series[seriesindex].marker.dataLabel.template +
                '_seriesIndex' + seriesindex + '_pointIndex' + i + smithchart.element.id);
            element.style.visibility = 'hidden';
            templateAnimate(smithchart, element, delay, duration, 'FadeIn');
            // this.fadein(element);
        }
    };
    /*private fadein(element: HTMLElement): void {
      let op: number = 0.1;
      element.style.display = 'block';
      let timer: number = setInterval( (): void => {
            if (op >= 1) {
                clearInterval(timer);
            }
            element.style.opacity = op.toString();
            element.style.filter = 'alpha(opacity=' + op * 100 + ')';
            op += op * 0.1;
    }, 50);
    
    }*/
    SeriesRender.prototype.performAnimation = function (smithchart, gsEle, seriesIndex) {
        var animation = new sf.base.Animation({});
        var element = document.getElementById('container_svg_seriesCollections');
        var clipRect = gsEle.childNodes[0].childNodes[0].childNodes[0];
        var effect = getAnimationFunction('Linear');
        var reveffect = getAnimationFunction('Reverse');
        var width = +clipRect.getAttribute('width');
        var x = +clipRect.getAttribute('x');
        var value;
        animation.animate(clipRect, {
            duration: parseFloat(smithchart.series[seriesIndex].animationDuration),
            progress: function (args) {
                if (smithchart.renderType === 'Impedance') {
                    value = effect(args.timeStamp - args.delay, 0, width, args.duration);
                    clipRect.setAttribute('width', value.toString());
                }
                else {
                    value = reveffect(args.timeStamp - args.delay, width, 0, args.duration);
                    clipRect.setAttribute('x', value.toString());
                }
            },
            end: function (model) {
                if (smithchart.renderType === 'Impedance') {
                    clipRect.setAttribute('width', width.toString());
                }
                else {
                    clipRect.setAttribute('x', x.toString());
                }
                var event = {
                    cancel: false,
                    name: animationComplete,
                    smithchart: !smithchart.isBlazor ? smithchart : null
                };
                smithchart.trigger(animationComplete, event);
            }
        });
    };
    SeriesRender.prototype.getLocation = function (seriesindex, pointIndex) {
        var x;
        var y;
        x = this.location[seriesindex][pointIndex].x;
        y = this.location[seriesindex][pointIndex].y;
        return { x: x, y: y };
    };
    return SeriesRender;
}());

/**
 * Specifies TreeMap beforePrint event name.
 * @private
 */
var smithchartBeforePrint = 'beforePrint';

/**
 * Annotation Module handles the Annotation for Maps
 */
var ExportUtils = /** @class */ (function () {
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
        this.smithchartPrint = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.smithchartPrint.moveTo(0, 0);
        this.smithchartPrint.resizeTo(screen.availWidth, screen.availHeight);
        var argsData = {
            cancel: false,
            htmlContent: this.getHTMLContent(elements),
            name: smithchartBeforePrint
        };
        this.control.trigger(smithchartBeforePrint, argsData);
        if (!argsData.cancel) {
            sf.base.print(argsData.htmlContent, this.smithchartPrint);
        }
    };
    /**
     * To get the html string of the Maps
     * @param svgElements
     * @private
     */
    ExportUtils.prototype.getHTMLContent = function (svgElements) {
        var div = sf.base.createElement('div');
        if (svgElements) {
            if (svgElements instanceof Array) {
                svgElements.forEach(function (value) {
                    div.appendChild(getElement(value).cloneNode(true));
                });
            }
            else if (svgElements instanceof Element) {
                div.appendChild(svgElements.cloneNode(true));
            }
            else {
                div.appendChild(getElement(svgElements).cloneNode(true));
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
    ExportUtils.prototype.export = function (exportType, fileName, orientation) {
        var _this = this;
        var canvas = sf.base.createElement('canvas', {
            id: 'ej2-canvas',
            attrs: {
                'width': this.control.availableSize.width.toString(),
                'height': this.control.availableSize.height.toString()
            }
        });
        var isDownload = !(sf.base.Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
        orientation = sf.base.isNullOrUndefined(orientation) ? sf.pdfexport.PdfPageOrientation.Landscape : orientation;
        var svgData = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            this.control.svgObject.outerHTML +
            '</svg>';
        var url = window.URL.createObjectURL(new Blob(exportType === 'SVG' ? [svgData] :
            [(new XMLSerializer()).serializeToString(this.control.svgObject)], { type: 'image/svg+xml' }));
        if (exportType === 'SVG') {
            this.triggerDownload(fileName, exportType, url, isDownload);
        }
        else {
            var image_1 = new Image();
            var ctx_1 = canvas.getContext('2d');
            image_1.onload = (function () {
                ctx_1.drawImage(image_1, 0, 0);
                window.URL.revokeObjectURL(url);
                if (exportType === 'PDF') {
                    var document_1 = new sf.pdfexport.PdfDocument();
                    var imageString = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                    document_1.pageSettings.orientation = orientation;
                    imageString = imageString.slice(imageString.indexOf(',') + 1);
                    document_1.pages.add().graphics.drawImage(new sf.pdfexport.PdfBitmap(imageString), 0, 0, (_this.control.availableSize.width - 60), _this.control.availableSize.height);
                    if (isDownload) {
                        document_1.save(fileName + '.pdf');
                        document_1.destroy();
                    }
                }
                else {
                    _this.triggerDownload(fileName, exportType, canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'), isDownload);
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
    ExportUtils.prototype.triggerDownload = function (fileName, exportType, url, isDownload) {
        sf.base.createElement('a', {
            attrs: {
                'download': fileName + '.' + exportType.toLocaleLowerCase(),
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
/* tslint:disable:no-string-literal */
/**
 * Represents the Smithchart control.
 * ```html
 * <div id="smithchart"/>
 * <script>
 *   var chartObj = new Smithchart({ isResponsive : true });
 *   chartObj.appendTo("#smithchart");
 * </script>
 * ```
 */
var Smithchart = /** @class */ (function (_super) {
    __extends(Smithchart, _super);
    /**
     * Constructor for creating the Smithchart widget
     */
    function Smithchart(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Get component name
     */
    Smithchart.prototype.getModuleName = function () {
        return 'smithchart';
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    Smithchart.prototype.getPersistData = function () {
        return '';
    };
    /**
     * Method to create SVG element.
     */
    Smithchart.prototype.createChartSvg = function () {
        this.removeSvg();
        createSvg(this);
    };
    Smithchart.prototype.renderTitle = function (title, type, groupEle) {
        var _this = this;
        var font = title.font ? title.font : title.textStyle;
        var textSize = measureText(title.text, font);
        var x;
        var y;
        var textAlignment = title.textAlignment;
        var titleText = title.text;
        var maxTitleWidth = (sf.base.isNullOrUndefined(title.maximumWidth)) ?
            Math.abs(this.margin.left + this.margin.right - (this.availableSize.width)) :
            title.maximumWidth;
        var titleWidthEnable = textSize.width > maxTitleWidth ? true : false;
        if (textSize.width > this.availableSize.width) {
            x = this.margin.left + this.border.width;
        }
        else {
            x = textAlignment === 'Center' ? (this.availableSize.width / 2 - textSize['width'] / 2) :
                (textAlignment === 'Near' ? (this.margin.left + this.elementSpacing + this.border.width) : (this.availableSize.width
                    - textSize['width'] - (this.margin.right + this.elementSpacing + this.border.width)));
        }
        y = this.margin.top + textSize['height'] / 2 + this.elementSpacing;
        if (title.enableTrim && titleWidthEnable) {
            titleText = textTrim(maxTitleWidth, title.text, font);
            textSize = measureText(titleText, font);
        }
        groupEle = this.renderer.createGroup({ id: this.element.id + '_Title_Group' });
        var titleEventArgs = {
            text: titleText,
            x: x,
            y: y,
            name: titleRender,
            cancel: false
        };
        var options;
        var titleRenderSuccess = function (args) {
            if (!args.cancel) {
                options = new TextOption(_this.element.id + '_Smithchart_' + type, args.x, args.y, 'start', args.text);
                font.fontFamily = _this.themeStyle.fontFamily || title.textStyle.fontFamily;
                font.size = _this.themeStyle.fontSize || title.textStyle.size;
                var element = renderTextElement(options, font, _this.themeStyle.chartTitle, groupEle);
                element.setAttribute('aria-label', title.description || args.text);
                var titleLocation = { x: args.x, y: args.y, textSize: textSize };
                _this.svgObject.appendChild(groupEle);
                if (title.subtitle.text !== '' && title.subtitle.visible) {
                    _this.renderSubtitle(title, type, textSize, _this.availableSize, titleLocation, groupEle);
                }
            }
        };
        titleRenderSuccess.bind(this);
        this.trigger(titleRender, titleEventArgs, titleRenderSuccess);
    };
    Smithchart.prototype.renderSubtitle = function (title, type, textSize, size, titleLocation, groupEle) {
        var _this = this;
        var x;
        var y;
        var font = title.subtitle.textStyle;
        var subTitle = title.subtitle;
        var subTitleSize = measureText(subTitle.text, font);
        var textAnchor;
        var subTitleText = subTitle.text;
        var maxSubTitleWidth = sf.base.isNullOrUndefined(subTitle.maximumWidth) ?
            (this.bounds.width * 0.75) : subTitle.maximumWidth;
        if (subTitle.enableTrim && subTitleSize.width > maxSubTitleWidth) {
            subTitleText = textTrim(maxSubTitleWidth, subTitle.text, font);
        }
        x = title['subtitle'].textAlignment === 'Far' ? (titleLocation.x + (titleLocation.textSize.width)) :
            (title['subtitle'].textAlignment === 'Near') ? titleLocation.x :
                (titleLocation.x + (titleLocation.textSize.width / 2));
        y = titleLocation.y + (2 * this.elementSpacing);
        textAnchor = title['subtitle'].textAlignment === 'Far' ? 'end' :
            (title['subtitle'].textAlignment === 'Near') ? 'start' : 'middle';
        var subtitleEventArgs = {
            text: subTitleText,
            x: x,
            y: y,
            name: subtitleRender,
            cancel: false
        };
        var subtitleRenderSuccess = function (args) {
            if (!args.cancel) {
                var options = new TextOption(_this.element.id + '_Smithchart_' + type, args.x, args.y, textAnchor, args.text);
                var element = renderTextElement(options, font, _this.themeStyle.chartTitle, groupEle);
                element.setAttribute('aria-label', subTitle.description || args.text);
                groupEle.appendChild(element);
            }
        };
        subtitleRenderSuccess.bind(this);
        this.trigger(subtitleRender, subtitleEventArgs, subtitleRenderSuccess);
    };
    /**
     * @private
     * Render the smithchart border
     */
    Smithchart.prototype.renderBorder = function () {
        var border = this.border;
        var color = this.theme.toLowerCase() === 'highcontrast' ? '#000000' : '#FFFFFF';
        this.background = this.background ? this.background : this.themeStyle.background;
        var borderRect = new RectOption(this.element.id + '_SmithchartBorder', this.background, border, 1, new SmithchartRect(border.width / 2, border.width / 2, this.availableSize.width - border.width, this.availableSize.height - border.width));
        this.svgObject.appendChild(this.renderer.drawRectangle(borderRect));
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    Smithchart.prototype.onPropertyChanged = function (newProp, oldProp) {
        var renderer = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'background':
                case 'border':
                case 'series':
                case 'legendSettings':
                case 'radius':
                    renderer = true;
                    break;
                case 'size':
                    this.createChartSvg();
                    renderer = true;
                    break;
                case 'theme':
                case 'renderType':
                    this.animateSeries = true;
                    renderer = true;
                    break;
            }
        }
        if (renderer) {
            this.render();
        }
    };
    /**
     * Initialize the event handler.
     */
    Smithchart.prototype.preRender = function () {
        this.isBlazor = sf.base.isBlazor();
        this.allowServerDataBinding = false;
        this.trigger(load, { smithchart: !this.isBlazor ? this : null });
        this.unWireEVents();
        this.initPrivateVariable();
        this.wireEVents();
    };
    Smithchart.prototype.initPrivateVariable = function () {
        this.animateSeries = true;
    };
    /**
     * To Initialize the control rendering.
     */
    Smithchart.prototype.setTheme = function () {
        /*! Set theme */
        this.themeStyle = getThemeColor(this.theme);
        this.seriesColors = getSeriesColor(this.theme);
        // let count: number = colors.length;
        // for (let i: number = 0; i < this.series.length; i++) {
        //     this.series[i].fill = this.series[i].fill ? this.series[i].fill : colors[i % count];
        // }
    };
    Smithchart.prototype.render = function () {
        this.createChartSvg();
        this.element.appendChild(this.svgObject);
        this.setTheme();
        this.createSecondaryElement();
        this.renderBorder();
        if (this.smithchartLegendModule && this.legendSettings.visible) {
            this.legendBounds = this.smithchartLegendModule.renderLegend(this);
        }
        this.legendBounds = this.legendBounds ? this.legendBounds : { x: 0, y: 0, width: 0, height: 0 };
        var areaBounds = new AreaBounds();
        this.bounds = areaBounds.calculateAreaBounds(this, this.title, this.legendBounds);
        if (this.title.text !== '' && this.title.visible) {
            this.renderTitle(this.title, 'title', null);
        }
        var axisRender = new AxisRender();
        axisRender.renderArea(this, this.bounds);
        this.seriesrender = new SeriesRender();
        this.seriesrender.draw(this, axisRender, this.bounds);
        this.renderComplete();
        this.allowServerDataBinding = true;
        this.trigger(loaded, { smithchart: !this.isBlazor ? this : null });
    };
    Smithchart.prototype.createSecondaryElement = function () {
        if (sf.base.isNullOrUndefined(document.getElementById(this.element.id + '_Secondary_Element'))) {
            var secondaryElement = sf.base.createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: absolute;z-index:1;'
            });
            this.element.appendChild(secondaryElement);
            var rect = this.element.getBoundingClientRect();
            var svgRect = document.getElementById(this.element.id + '_svg');
            if (svgRect) {
                var svgClientRect = svgRect.getBoundingClientRect();
                secondaryElement.style.left = Math.max(svgClientRect.left - rect.left, 0) + 'px';
                secondaryElement.style.top = Math.max(svgClientRect.top - rect.top, 0) + 'px';
            }
        }
        else {
            removeElement(this.element.id + '_Secondary_Element');
        }
    };
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of smithChart
     */
    Smithchart.prototype.destroy = function () {
        this.unWireEVents();
        _super.prototype.destroy.call(this);
        this.element.classList.remove('e-smithchart');
    };
    /**
     * To bind event handlers for smithchart.
     */
    Smithchart.prototype.wireEVents = function () {
        sf.base.EventHandler.add(this.element, 'click', this.smithchartOnClick, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchMoveEvent, this.mouseMove, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchEndEvent, this.mouseEnd, this);
        window.addEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.smithchartOnResize.bind(this));
    };
    Smithchart.prototype.mouseMove = function (e) {
        if (e.type === 'touchmove') {
            this.isTouch = true;
        }
        else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2' || this.isTouch;
        }
        if (this.tooltipRenderModule && !this.isTouch) {
            this.tooltipRenderModule.smithchartMouseMove(this, e);
        }
    };
    Smithchart.prototype.mouseEnd = function (e) {
        if (e.type === 'touchend') {
            this.isTouch = true;
        }
        else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
        }
        if (this.tooltipRenderModule && this.isTouch) {
            var tooltipElement_1 = this.tooltipRenderModule.smithchartMouseMove(this, e);
            if (tooltipElement_1) {
                this.fadeoutTo = setTimeout(function () {
                    tooltipElement_1.fadeOut();
                }, 2000);
            }
        }
    };
    /**
     * To handle the click event for the smithchart.
     */
    /* tslint:disable:no-string-literal */
    Smithchart.prototype.smithchartOnClick = function (e) {
        var targetEle = e.target;
        var targetId = targetEle.id;
        var parentElement = document.getElementById(targetId).parentElement;
        var grpElement = document.getElementById(parentElement.id).parentElement;
        if (grpElement.id === 'containerlegendItem_Group' && this.legendSettings.toggleVisibility) {
            var childElement = parentElement.childNodes[1];
            var circleElement = parentElement.childNodes[0];
            var legendText = childElement.textContent;
            var seriesIndex = void 0;
            var fill = void 0;
            for (var i = 0; i < this.smithchartLegendModule.legendSeries.length; i++) {
                if (legendText === this.smithchartLegendModule.legendSeries[i]['text']) {
                    seriesIndex = this.smithchartLegendModule.legendSeries[i].seriesIndex;
                    fill = this.smithchartLegendModule.legendSeries[i].fill;
                }
            }
            var seriesElement = document.getElementById(this.element.id + '_svg' + '_seriesCollection' + seriesIndex);
            if (seriesElement.getAttribute('visibility') === 'visible') {
                circleElement.setAttribute('fill', 'gray');
                seriesElement.setAttribute('visibility', 'hidden');
                this.series[seriesIndex].visibility = 'hidden';
            }
            else {
                circleElement.setAttribute('fill', fill);
                seriesElement.setAttribute('visibility', 'visible');
                this.series[seriesIndex].visibility = 'visible';
            }
        }
    };
    /**
     * To unbind event handlers from smithchart.
     */
    Smithchart.prototype.unWireEVents = function () {
        sf.base.EventHandler.remove(this.element, 'click', this.smithchartOnClick);
        sf.base.EventHandler.remove(this.element, sf.base.Browser.touchMoveEvent, this.mouseMove);
        sf.base.EventHandler.remove(this.element, sf.base.Browser.touchEndEvent, this.mouseEnd);
        window.removeEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.smithchartOnResize);
    };
    Smithchart.prototype.print = function (id) {
        var exportChart = new ExportUtils(this);
        exportChart.print(id);
    };
    /**
     * Handles the export method for chart control.
     * @param type
     * @param fileName
     */
    Smithchart.prototype.export = function (type, fileName, orientation) {
        var exportMap = new ExportUtils(this);
        exportMap.export(type, fileName, orientation);
    };
    /**
     * To handle the window resize event on smithchart.
     */
    Smithchart.prototype.smithchartOnResize = function (e) {
        var _this = this;
        this.animateSeries = false;
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(function () {
            _this.render();
        }, 500);
        return false;
    };
    /**
     * To provide the array of modules needed for smithchart rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    Smithchart.prototype.requiredModules = function () {
        var modules = [];
        if (this.legendSettings.visible) {
            modules.push({
                member: 'SmithchartLegend',
                args: [this]
            });
        }
        for (var i = 0; i < this.series.length; i++) {
            if (this.series[i].tooltip.visible) {
                modules.push({
                    member: 'TooltipRender',
                    args: [this]
                });
                break;
            }
        }
        return modules;
    };
    /**
     * To Remove the SVG.
     * @return {boolean}
     * @private
     */
    Smithchart.prototype.removeSvg = function () {
        removeElement(this.element.id + '_Secondary_Element');
        var removeLength = 0;
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > removeLength) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                sf.base.remove(this.svgObject);
            }
        }
    };
    __decorate([
        sf.base.Property('Impedance')
    ], Smithchart.prototype, "renderType", void 0);
    __decorate([
        sf.base.Property('')
    ], Smithchart.prototype, "width", void 0);
    __decorate([
        sf.base.Property('')
    ], Smithchart.prototype, "height", void 0);
    __decorate([
        sf.base.Property('Material')
    ], Smithchart.prototype, "theme", void 0);
    __decorate([
        sf.base.Complex({}, SmithchartMargin)
    ], Smithchart.prototype, "margin", void 0);
    __decorate([
        sf.base.Complex({}, SmithchartFont)
    ], Smithchart.prototype, "font", void 0);
    __decorate([
        sf.base.Complex({}, SmithchartBorder)
    ], Smithchart.prototype, "border", void 0);
    __decorate([
        sf.base.Complex({}, Title)
    ], Smithchart.prototype, "title", void 0);
    __decorate([
        sf.base.Collection([{}], SmithchartSeries)
    ], Smithchart.prototype, "series", void 0);
    __decorate([
        sf.base.Complex({}, SmithchartLegendSettings)
    ], Smithchart.prototype, "legendSettings", void 0);
    __decorate([
        sf.base.Complex({}, SmithchartAxis)
    ], Smithchart.prototype, "horizontalAxis", void 0);
    __decorate([
        sf.base.Complex({}, SmithchartAxis)
    ], Smithchart.prototype, "radialAxis", void 0);
    __decorate([
        sf.base.Property(null)
    ], Smithchart.prototype, "background", void 0);
    __decorate([
        sf.base.Property(10)
    ], Smithchart.prototype, "elementSpacing", void 0);
    __decorate([
        sf.base.Property(1)
    ], Smithchart.prototype, "radius", void 0);
    __decorate([
        sf.base.Event()
    ], Smithchart.prototype, "beforePrint", void 0);
    __decorate([
        sf.base.Event()
    ], Smithchart.prototype, "animationComplete", void 0);
    __decorate([
        sf.base.Event()
    ], Smithchart.prototype, "load", void 0);
    __decorate([
        sf.base.Event()
    ], Smithchart.prototype, "loaded", void 0);
    __decorate([
        sf.base.Event()
    ], Smithchart.prototype, "legendRender", void 0);
    __decorate([
        sf.base.Event()
    ], Smithchart.prototype, "titleRender", void 0);
    __decorate([
        sf.base.Event()
    ], Smithchart.prototype, "subtitleRender", void 0);
    __decorate([
        sf.base.Event()
    ], Smithchart.prototype, "textRender", void 0);
    __decorate([
        sf.base.Event()
    ], Smithchart.prototype, "axisLabelRender", void 0);
    __decorate([
        sf.base.Event()
    ], Smithchart.prototype, "seriesRender", void 0);
    __decorate([
        sf.base.Event()
    ], Smithchart.prototype, "tooltipRender", void 0);
    Smithchart = __decorate([
        sf.base.NotifyPropertyChanges
    ], Smithchart);
    return Smithchart;
}(sf.base.Component));

/**
 * To render tooltip
 */
var TooltipRender = /** @class */ (function () {
    function TooltipRender() {
    }
    TooltipRender.prototype.smithchartMouseMove = function (smithchart, e) {
        var touchArg;
        var pageX;
        var pageY;
        if (e.type === 'touchend' || e.type === 'touchmove') {
            touchArg = e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
            this.tooltipElement = undefined;
        }
        else {
            pageY = e.clientY;
            pageX = e.clientX;
        }
        this.setMouseXY(smithchart, pageX, pageY);
        for (var i = 0; i < smithchart.series.length; i++) {
            var series = smithchart.series[i];
            var seriesIndex = i;
            var closestPoint = new ClosestPoint();
            closestPoint = this.closestPointXY(smithchart, this.mouseX, this.mouseY, series, seriesIndex);
            if (closestPoint.location && series.tooltip.visible && series.visibility === 'visible') {
                this.createTooltip(smithchart, e, closestPoint.index, seriesIndex, series);
                break;
            }
            else if (this.tooltipElement) {
                if (this.tooltipElement.enable && !series.tooltip.template) {
                    this.tooltipElement.enable = false;
                }
                this.tooltipElement.fadeOut();
            }
        }
        return this.tooltipElement;
    };
    TooltipRender.prototype.setMouseXY = function (smithchart, pageX, pageY) {
        var svgRectElement = document.getElementById(smithchart.element.id + '_svg');
        if (smithchart.element && svgRectElement) {
            var rect = smithchart.element.getBoundingClientRect();
            var svgRect = svgRectElement.getBoundingClientRect();
            this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
            this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        }
    };
    TooltipRender.prototype.createTooltip = function (smithchart, e, pointindex, seriesindex, series) {
        var _this = this;
        var currentPoint = series.points[pointindex];
        var pointX = currentPoint.resistance;
        var pointY = currentPoint.reactance;
        var tooltip = currentPoint.tooltip ? [currentPoint.tooltip] : null;
        var tooltipText = [pointX + ' ' + ':' + ' ' + '<b>' + pointY + '</b>'];
        var argsData = {
            cancel: false, name: 'tooltipRender',
            text: tooltip || tooltipText,
            headerText: '<b>' + series.name + '</b>',
            template: series.tooltip.template,
            point: currentPoint
        };
        var smithChartTooltipSuccess = function (argsData) {
            var markerHeight = smithchart.series[seriesindex].marker.height / 2;
            var div = document.getElementById(smithchart.element.id + '_smithchart_tooltip_div');
            if (sf.base.isNullOrUndefined(div)) {
                div = sf.base.createElement('div', {
                    id: smithchart.element.id + '_smithchart_tooltip_div',
                    styles: 'pointer-events: none; position: absolute;z-index:1;'
                });
                document.getElementById(smithchart.element.id + '_Secondary_Element').appendChild(div);
            }
            _this.tooltipElement = new sf.svgbase.Tooltip({
                enable: true,
                header: argsData.headerText,
                content: argsData.text,
                border: series.tooltip.border,
                fill: smithchart.themeStyle.tooltipFill,
                data: currentPoint,
                template: argsData.template,
                location: {
                    x: _this.locationX + smithchart.element.offsetLeft,
                    y: _this.locationY - markerHeight + smithchart.element.offsetTop
                },
                shared: false,
                areaBounds: new SmithchartRect(smithchart.bounds.x, smithchart.bounds.y, smithchart.bounds.width, smithchart.bounds.height),
                palette: [series.fill || smithchart.seriesColors[seriesindex % smithchart.seriesColors.length]],
                shapes: ['Circle'],
                availableSize: smithchart.availableSize,
                theme: smithchart.theme,
                blazorTemplate: { name: 'TooltipTemplate', parent: smithchart.series[seriesindex].tooltip }
            });
            _this.tooltipElement.opacity = smithchart.themeStyle.tooltipFillOpacity || _this.tooltipElement.opacity;
            _this.tooltipElement.textStyle.fontFamily = smithchart.themeStyle.fontFamily || 'Roboto, Segoe UI, Noto, Sans-serif';
            _this.tooltipElement.textStyle.opacity = smithchart.themeStyle.tooltipTextOpacity || _this.tooltipElement.textStyle.opacity;
            _this.tooltipElement.appendTo(div);
        };
        smithChartTooltipSuccess.bind(this, smithchart);
        smithchart.trigger('tooltipRender', argsData, smithChartTooltipSuccess);
    };
    TooltipRender.prototype.closestPointXY = function (smithchart, x, y, series, seriesindex) {
        var pointIndex;
        var chartPoint;
        var closePoint;
        for (var j = 0; j < series.points.length; j++) {
            chartPoint = smithchart.seriesrender.getLocation(seriesindex, j);
            this.locationX = chartPoint.x;
            this.locationY = chartPoint.y;
            pointIndex = j;
            var a = x - chartPoint.x;
            var b = y - chartPoint.y;
            var distance = Math.abs(Math.sqrt((a * a) + (b * b)));
            if (distance < series.marker.width) {
                closePoint = chartPoint;
                pointIndex = j;
                break;
            }
        }
        return { location: closePoint, index: pointIndex };
    };
    /**
     * Get module name.
     */
    TooltipRender.prototype.getModuleName = function () {
        return 'TooltipRender';
    };
    /**
     * To destroy the legend.
     * @return {void}
     * @private
     */
    TooltipRender.prototype.destroy = function (smithchart) {
        /**
         * Destroy method performed here
         */
    };
    return TooltipRender;
}());

/* tslint:disable:no-string-literal */
var SmithchartLegend = /** @class */ (function () {
    function SmithchartLegend() {
        this.legendSeries = [];
    }
    SmithchartLegend.prototype.renderLegend = function (smithchart) {
        this.calculateLegendBounds(smithchart);
        this._drawLegend(smithchart);
        return this.legendActualBounds;
    };
    SmithchartLegend.prototype.calculateLegendBounds = function (smithchart) {
        this.legendSeries = [];
        var padding = 10;
        var legend = smithchart.legendSettings;
        var legendSizeHeight = legend.height;
        var legendSizeWidth = legend.width;
        var itemPadding = legend.itemPadding > 0 ? legend.itemPadding : 0;
        var position = legend.position.toLowerCase();
        var font = legend.title.textStyle;
        var width = 0;
        var height = 0;
        var legendItemWidth = 0;
        var legendItemHeight = 0;
        var legendHeight = 0;
        var svgObjectWidth = smithchart.availableSize.width - ((smithchart.elementSpacing * 4) - (legend.border.width * 2)
            + (smithchart.border.width * 2));
        var svgObjectHeight = smithchart.availableSize.height - ((smithchart.elementSpacing * 4) - (legend.border.width * 2)
            + (smithchart.border.width * 2));
        var rowCount = legend.rowCount;
        var columnCount = legend.columnCount;
        var titleSize = measureText(smithchart.legendSettings['title']['text'], font);
        var maxRowWidth = 0;
        var totalRowHeight = 0;
        var curRowWidth = 0;
        var curRowHeight = 0;
        var allowItems;
        var itemsCountRow = 0;
        var length = smithchart.series.length;
        var legendBounds;
        if (smithchart.legendSettings.visible && length !== 0) {
            if (position === 'bottom' || position === 'top' || position === 'custom') {
                if ((rowCount && columnCount) && (rowCount <= columnCount)) {
                    rowCount = length / columnCount;
                }
                else if (rowCount == null && columnCount != null) {
                    rowCount = length / columnCount;
                }
                else if (rowCount == null && columnCount == null) {
                    rowCount = 1;
                }
                if (rowCount) {
                    allowItems = Math.ceil(length / rowCount);
                }
            }
            else {
                if ((rowCount && columnCount) && (rowCount <= columnCount)) {
                    columnCount = length / rowCount;
                }
                else if (rowCount != null && columnCount == null) {
                    columnCount = length / rowCount;
                }
                else if (rowCount == null && columnCount == null) {
                    columnCount = 1;
                }
                if (columnCount) {
                    allowItems = columnCount;
                }
            }
            for (var i = 0; i < length; i++) {
                this.legendSeries.push({
                    text: smithchart.series[i]['name'] ? smithchart.series[i]['name'] : 'series' + i,
                    seriesIndex: i,
                    shape: smithchart.legendSettings.shape,
                    fill: smithchart.series[i].fill || smithchart.seriesColors[i % smithchart.seriesColors.length],
                    bounds: null
                });
                var legendsize = this._getLegendSize(smithchart, this.legendSeries[i]);
                legendItemWidth = Math.max(legendsize['width'], legendItemWidth);
                legendItemHeight = Math.max(legendsize['height'], legendItemHeight);
                this.legendSeries[i]['bounds'] = { width: legendItemWidth, height: legendItemHeight };
                itemsCountRow = itemsCountRow + 1;
                curRowWidth = curRowWidth + legendItemWidth + itemPadding;
                curRowHeight = Math.max(legendItemHeight, curRowHeight);
                if (position === 'top' || position === 'bottom' || position === 'custom') {
                    if (curRowWidth > svgObjectWidth) {
                        curRowWidth -= legendsize.width + itemPadding;
                        maxRowWidth = Math.max(maxRowWidth, curRowWidth);
                        curRowWidth = legendsize.width + itemPadding;
                        totalRowHeight = totalRowHeight + curRowHeight + itemPadding;
                    }
                }
                if (itemsCountRow === allowItems || i === length - 1) {
                    maxRowWidth = Math.max(maxRowWidth, curRowWidth);
                    totalRowHeight = totalRowHeight + curRowHeight + itemPadding;
                    legendHeight = totalRowHeight;
                    itemsCountRow = 0;
                    curRowHeight = 0;
                    curRowWidth = 0;
                }
            }
            width = (titleSize.width) > maxRowWidth - itemPadding ? (titleSize.width + padding * 2 + itemPadding) :
                maxRowWidth + padding * 2 - (smithchart.border.width * 2);
            height = legendHeight + smithchart.elementSpacing;
            legendBounds = { x: 0, y: 0, width: width, height: height };
        }
        this.legendActualBounds = legendBounds;
        if (legendSizeWidth != null) {
            this.legendActualBounds.width = legendSizeWidth;
        }
        if (legendSizeHeight != null) {
            this.legendActualBounds.height = legendSizeHeight;
        }
    };
    SmithchartLegend.prototype._getLegendSize = function (smithchart, series) {
        var legend = smithchart.legendSettings;
        var symbolWidth = legend.itemStyle.width;
        var symbolHeight = legend.itemStyle.height;
        var textSize = measureText(series.text, legend.textStyle);
        var width = symbolWidth + textSize.width + legend.shapePadding;
        var height = Math.max(symbolHeight, textSize.height);
        return { width: width, height: height };
    };
    // tslint:disable:max-func-body-length
    SmithchartLegend.prototype._drawLegend = function (smithchart) {
        var legend = smithchart.legendSettings;
        var legendPosition = legend.position.toLowerCase();
        var alignment = legend.alignment;
        var legendBounds = this.legendActualBounds;
        var maxWidth = 0;
        var startX;
        var startY;
        var titleFont = smithchart.title.font ? smithchart.title.font : smithchart.title.textStyle;
        var smithchartTitleHeight = measureText(smithchart.title.text, titleFont).height;
        var smithchartSubtitleHeight = measureText(smithchart.title.subtitle.text, smithchart.title.subtitle.textStyle).height;
        var elementSpacing = smithchart.elementSpacing;
        var offset = smithchartTitleHeight + smithchartSubtitleHeight + elementSpacing + smithchart.margin.top;
        var itemPadding = legend.itemPadding > 0 ? legend.itemPadding : 0;
        var svgObjectWidth = smithchart.availableSize.width;
        var svgObjectHeight = smithchart.availableSize.height;
        var legendBorder = legend.border.width;
        var legendWidth = 0;
        var titleSize = measureText(legend['title']['text'], legend.title.textStyle);
        var legendTitleHeight = titleSize.height;
        var borderSize = smithchart.border.width;
        var svgWidth = svgObjectWidth - ((borderSize * 2));
        var svgHeight = svgObjectHeight - ((borderSize * 2));
        legendBounds.height += legendTitleHeight;
        if (legendPosition !== 'custom') {
            switch (legendPosition) {
                case 'bottom':
                    legendBounds.y = svgHeight - (legendBounds.height + (legendBorder) + elementSpacing);
                    break;
                case 'top':
                    legendBounds.y = borderSize + offset;
                    break;
                case 'right':
                    legendBounds.x = svgWidth - legendBounds.width - (elementSpacing * 2);
                    break;
                case 'left':
                    legendBounds.x = borderSize + (elementSpacing * 2);
                    break;
            }
            if (legendPosition === 'left' || legendPosition === 'right') {
                switch (alignment) {
                    case 'Center':
                        legendBounds.y = (svgHeight / 2) - ((legendBounds.height + legendBorder * 2) / 2) + (elementSpacing / 2);
                        break;
                    case 'Near':
                        legendBounds.y = borderSize + (elementSpacing * 2) + offset;
                        break;
                    case 'Far':
                        legendBounds.y = svgHeight - (legendBounds.height + (legendBorder)) - (elementSpacing * 2);
                        break;
                }
            }
            else {
                switch (alignment) {
                    case 'Center':
                        legendBounds.x = (svgWidth / 2) - ((legendBounds.width + legendBorder * 2) / 2) + (elementSpacing / 2);
                        break;
                    case 'Near':
                        legendBounds.x = borderSize + (elementSpacing * 2);
                        break;
                    case 'Far':
                        legendBounds.x = svgWidth - (legendBounds.width + (legendBorder)) - (elementSpacing * 2);
                        break;
                }
            }
        }
        else {
            legendBounds.y = (legend.location.y < svgHeight) ? legend.location.y : 0;
            legendBounds.x = (legend.location.x < svgWidth) ? legend.location.x : 0;
        }
        if (legendPosition === 'bottom' || legendPosition === 'top') {
            for (var i = 0; i < this.legendSeries.length; i++) {
                legendWidth += this.legendSeries[i].bounds.width + itemPadding;
                if (legendWidth > svgWidth) {
                    legendBounds.x = (svgWidth / 2) - ((legendBounds.width + legendBorder * 2) / 2) + (elementSpacing / 2);
                    break;
                }
            }
        }
        var gLegendEle = smithchart.renderer.createGroup({ 'id': smithchart.element.id + '_legend_group' });
        smithchart.svgObject.appendChild(gLegendEle);
        this.legendItemGroup = smithchart.renderer.createGroup({ 'id': smithchart.element.id + 'legendItem_Group' });
        var currentX = startX = elementSpacing;
        var currentY = startY = elementSpacing;
        if (legend.title.text !== '' && legend.title.visible) {
            gLegendEle.appendChild(this.drawLegendTitle(smithchart, legend, legendBounds, gLegendEle));
            currentY = startY = elementSpacing + legendTitleHeight;
        }
        for (var k = 0; k < this.legendSeries.length; k++) {
            if ((legend.rowCount < legend.columnCount || legend.rowCount === legend.columnCount) &&
                (legendPosition === 'top' || legendPosition === 'bottom' || legendPosition === 'custom')) {
                if ((currentX + this.legendSeries[k]['bounds'].width) > legendBounds.width + startX) {
                    currentX = elementSpacing;
                    currentY += this.legendSeries[k]['bounds'].height + itemPadding;
                }
                this.legendGroup = this.drawLegendItem(smithchart, legend, this.legendSeries[k], k, currentX, (currentY), legendBounds);
                gLegendEle.appendChild(this.legendGroup);
                currentX += this.legendSeries[k]['bounds'].width + itemPadding;
            }
            else {
                if (((currentY + this.legendSeries[k]['bounds'].height + itemPadding) +
                    legendTitleHeight + borderSize > legendBounds.height + startY)) {
                    currentY = startY;
                    currentX += maxWidth + (itemPadding);
                }
                this.legendGroup = this.drawLegendItem(smithchart, legend, this.legendSeries[k], k, (currentX), (currentY), legendBounds);
                gLegendEle.appendChild(this.legendGroup);
                currentY += this.legendSeries[k]['bounds'].height + itemPadding;
                maxWidth = Math.max(maxWidth, this.legendSeries[k]['bounds'].width);
            }
        }
        gLegendEle.setAttribute('transform', 'translate(' + legendBounds.x.toString() + ',' + legendBounds.y.toString() + ')');
        this.drawLegendBorder(gLegendEle, smithchart, legend, legendBounds);
    };
    SmithchartLegend.prototype.drawLegendBorder = function (gLegendEle, smithchart, legend, legendBounds) {
        var borderRect = new RectOption(smithchart.element.id + '_svg' + '_legendRect', 'none', legend.border, 1, new SmithchartRect(0, 0, legendBounds.width, legendBounds.height));
        gLegendEle.appendChild(smithchart.renderer.drawRectangle(borderRect));
    };
    SmithchartLegend.prototype.drawLegendTitle = function (smithchart, legend, legendBounds, gLegendEle) {
        var elementSpacing = smithchart.elementSpacing;
        var titleSize = measureText(legend.title.text, legend.title.textStyle);
        var titleWidth = titleSize.width;
        var titleHeight = titleSize.height;
        var textAlignment = legend.title.textAlignment;
        var startX = 0;
        var legendBoundsWidth = legendBounds.width;
        var startY = elementSpacing + (titleHeight / 2);
        switch (textAlignment) {
            case 'Far':
                startX = legendBoundsWidth - titleWidth - startX;
                break;
            case 'Center':
                startX = legendBoundsWidth / 2 - (titleWidth) / 2;
                break;
        }
        if (startX < 0) {
            startX = 0;
            legendBoundsWidth = titleWidth;
        }
        if (legendBoundsWidth < titleWidth + startX) {
            legendBoundsWidth = titleWidth + startX;
        }
        var options = new TextOption(smithchart.element.id + '_LegendTitleText', startX, startY, 'start', legend.title.text);
        var element = renderTextElement(options, legend.title.textStyle, smithchart.themeStyle.legendLabel, gLegendEle);
        element.setAttribute('aria-label', legend.title.description || legend.title.text);
        return element;
    };
    SmithchartLegend.prototype.drawLegendItem = function (smithchart, legend, legendSeries, k, x, y, legendBounds) {
        var _this = this;
        var location;
        var radius;
        var symbol = legend.itemStyle;
        var itemPadding = legend.itemPadding;
        var textHeight;
        radius = Math.sqrt(symbol['width'] * symbol['width'] + symbol['height'] * symbol['height']) / 2;
        textHeight = measureText(legendSeries['text'], legend.textStyle).height;
        location = {
            x: x + symbol['width'] / 2,
            y: (y + (textHeight > symbol['height'] ? textHeight : symbol['height']) / 2)
        };
        var legendGroup = smithchart.renderer.createGroup({ id: smithchart.element.id + '_svg' + '_Legend' + k.toString() });
        legendGroup['style']['cursor'] = legend.toggleVisibility ? 'pointer' : 'default';
        var legendEventArgs = {
            text: legendSeries['text'],
            fill: legendSeries['fill'],
            shape: legendSeries['shape'],
            name: legendRender,
            cancel: false
        };
        var legendRenderSuccess = function (args) {
            if (!args.cancel) {
                var shape = _this.drawLegendShape(smithchart, legendSeries, location.x, location.y, k, legend, args);
                legendGroup.appendChild(shape);
                var options = new TextOption(smithchart.element.id + '_LegendItemText' + k.toString(), location.x + symbol['width'] / 2 + legend.shapePadding, location.y + textHeight / 4, 'start', args.text);
                legend.textStyle.fontFamily = smithchart.themeStyle.fontFamily || legend.textStyle.fontFamily;
                legend.textStyle.size = smithchart.themeStyle.fontSize || legend.textStyle.size;
                var element = renderTextElement(options, legend.textStyle, smithchart.themeStyle.legendLabel, legendGroup);
                element.setAttribute('aria-label', legend.description || 'Click to show or hide the ' + options.text + ' series');
                legendGroup.appendChild(element);
                _this.legendItemGroup.appendChild(legendGroup);
            }
        };
        legendRenderSuccess.bind(this);
        smithchart.trigger(legendRender, legendEventArgs, legendRenderSuccess);
        return this.legendItemGroup;
    };
    SmithchartLegend.prototype.drawLegendShape = function (smithchart, legendSeries, locX, locY, index, legend, legendEventArgs) {
        var element;
        var circleOptions;
        var pathOptions;
        var path;
        var symbol = legend.itemStyle;
        var width = symbol['width'];
        var height = symbol['height'];
        var x = locX + (-width / 2);
        var border = { color: symbol.border.color, width: symbol.border.width };
        var opacity = 1;
        var fill = (smithchart.series[index].visibility === 'visible') ? legendEventArgs.fill : 'grey';
        var shape = legendEventArgs.shape.toLowerCase();
        var radius = Math.sqrt(height * height + width * width) / 2;
        switch (shape) {
            case 'circle':
                circleOptions = new CircleOption(smithchart.element.id + '_svg' + '_LegendItemShape' + index.toString(), fill, border, opacity, locX, locY, radius, null);
                element = smithchart.renderer.drawCircle(circleOptions);
                break;
            case 'rectangle':
                path = 'M' + ' ' + x + ' ' + (locY + (-height / 2)) + ' ' +
                    'L' + ' ' + ((width / 2) + locX) + ' ' + (locY + (-height / 2)) + ' ' +
                    'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + x + ' ' + (locY + (-height / 2)) + ' z';
                pathOptions = new PathOption(smithchart.element.id + '_svg' + '_LegendItemShape' + index.toString(), fill, border.width, border.color, 1, '', path);
                element = smithchart.renderer.drawPath(pathOptions);
                break;
            case 'diamond':
                path = 'M' + ' ' + x + ' ' + locY + ' ' +
                    'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
                    'L' + ' ' + ((width / 2) + locX) + ' ' + locY + ' ' +
                    'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + x + ' ' + locY + ' z';
                pathOptions = new PathOption(smithchart.element.id + '_svg' + '_LegendItemShape' + index.toString(), fill, border.width, border.color, 1, '', path);
                element = smithchart.renderer.drawPath(pathOptions);
                break;
            case 'pentagon':
                var eq = 72;
                for (var j = 0; j <= 5; j++) {
                    var xValue = radius * Math.cos((Math.PI / 180) * (j * eq));
                    var yValue = radius * Math.sin((Math.PI / 180) * (j * eq));
                    if (j === 0) {
                        path = 'M' + ' ' + (xValue + locX) + ' ' + (locY + yValue) + ' ';
                    }
                    else {
                        path = path.concat('L' + ' ' + (locX + xValue) + ' ' + (locY + yValue) + ' ');
                    }
                }
                path = path.concat('Z');
                pathOptions = new PathOption(smithchart.element.id + '_svg' + '_LegendItemShape' + index.toString(), fill, border.width, border.color, 1, '', path);
                element = smithchart.renderer.drawPath(pathOptions);
                break;
            case 'triangle':
                path = 'M' + ' ' + x + ' ' + ((height / 2) + locY) + ' ' +
                    'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
                    'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                    'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' Z';
                pathOptions = new PathOption(smithchart.element.id + '_svg' + '_LegendItemShape' + index.toString(), fill, border.width, border.color, 1, '', path);
                element = smithchart.renderer.drawPath(pathOptions);
                break;
        }
        return element;
    };
    /**
     * Get module name.
     */
    SmithchartLegend.prototype.getModuleName = function () {
        return 'SmithchartLegend';
    };
    /**
     * To destroy the legend.
     * @return {void}
     * @private
     */
    SmithchartLegend.prototype.destroy = function (smithchart) {
        /**
         * Destroy method performed here
         */
    };
    return SmithchartLegend;
}());

/**
 *
 */

Smithchart.Inject(SmithchartLegend, TooltipRender);

exports.Smithchart = Smithchart;
exports.SmithchartMajorGridLines = SmithchartMajorGridLines;
exports.SmithchartMinorGridLines = SmithchartMinorGridLines;
exports.SmithchartAxisLine = SmithchartAxisLine;
exports.SmithchartAxis = SmithchartAxis;
exports.LegendTitle = LegendTitle;
exports.LegendLocation = LegendLocation;
exports.LegendItemStyleBorder = LegendItemStyleBorder;
exports.LegendItemStyle = LegendItemStyle;
exports.LegendBorder = LegendBorder;
exports.SmithchartLegendSettings = SmithchartLegendSettings;
exports.SeriesTooltipBorder = SeriesTooltipBorder;
exports.SeriesTooltip = SeriesTooltip;
exports.SeriesMarkerBorder = SeriesMarkerBorder;
exports.SeriesMarkerDataLabelBorder = SeriesMarkerDataLabelBorder;
exports.SeriesMarkerDataLabelConnectorLine = SeriesMarkerDataLabelConnectorLine;
exports.SeriesMarkerDataLabel = SeriesMarkerDataLabel;
exports.SeriesMarker = SeriesMarker;
exports.SmithchartSeries = SmithchartSeries;
exports.TooltipRender = TooltipRender;
exports.Subtitle = Subtitle;
exports.Title = Title;
exports.SmithchartFont = SmithchartFont;
exports.SmithchartMargin = SmithchartMargin;
exports.SmithchartBorder = SmithchartBorder;
exports.SmithchartRect = SmithchartRect;
exports.LabelCollection = LabelCollection;
exports.LegendSeries = LegendSeries;
exports.LabelRegion = LabelRegion;
exports.HorizontalLabelCollection = HorizontalLabelCollection;
exports.RadialLabelCollections = RadialLabelCollections;
exports.LineSegment = LineSegment;
exports.PointRegion = PointRegion;
exports.Point = Point;
exports.ClosestPoint = ClosestPoint;
exports.MarkerOptions = MarkerOptions;
exports.SmithchartLabelPosition = SmithchartLabelPosition;
exports.Direction = Direction;
exports.DataLabelTextOptions = DataLabelTextOptions;
exports.LabelOption = LabelOption;
exports.SmithchartSize = SmithchartSize;
exports.GridArcPoints = GridArcPoints;
exports.smithchartBeforePrint = smithchartBeforePrint;
exports.SmithchartLegend = SmithchartLegend;

return exports;

});

    sf.charts = sf.base.extend({}, sf.charts, sfsmithchart({}));