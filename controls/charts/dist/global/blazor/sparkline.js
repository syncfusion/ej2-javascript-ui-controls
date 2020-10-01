window.sf = window.sf || {};
var sfsparkline = (function (exports) {
'use strict';

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
 * Sparkline base API Class declarations.
 */
/**
 * Configures the borders in the Sparkline.
 */
var SparklineBorder = /** @class */ (function (_super) {
    __extends$1(SparklineBorder, _super);
    function SparklineBorder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property('')
    ], SparklineBorder.prototype, "color", void 0);
    __decorate$1([
        sf.base.Property(0)
    ], SparklineBorder.prototype, "width", void 0);
    return SparklineBorder;
}(sf.base.ChildProperty));
/**
 * Configures the fonts in sparklines.
 */
var SparklineFont = /** @class */ (function (_super) {
    __extends$1(SparklineFont, _super);
    function SparklineFont() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(null)
    ], SparklineFont.prototype, "size", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], SparklineFont.prototype, "color", void 0);
    __decorate$1([
        sf.base.Property('Roboto, Segoe UI, Noto, Sans-serif')
    ], SparklineFont.prototype, "fontFamily", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], SparklineFont.prototype, "fontWeight", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], SparklineFont.prototype, "fontStyle", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], SparklineFont.prototype, "opacity", void 0);
    return SparklineFont;
}(sf.base.ChildProperty));
/**
 * To configure the tracker line settings.
 */
var TrackLineSettings = /** @class */ (function (_super) {
    __extends$1(TrackLineSettings, _super);
    function TrackLineSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(false)
    ], TrackLineSettings.prototype, "visible", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], TrackLineSettings.prototype, "color", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], TrackLineSettings.prototype, "width", void 0);
    return TrackLineSettings;
}(sf.base.ChildProperty));
/**
 * To configure the tooltip settings for sparkline.
 */
var SparklineTooltipSettings = /** @class */ (function (_super) {
    __extends$1(SparklineTooltipSettings, _super);
    function SparklineTooltipSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(false)
    ], SparklineTooltipSettings.prototype, "visible", void 0);
    __decorate$1([
        sf.base.Property('')
    ], SparklineTooltipSettings.prototype, "fill", void 0);
    __decorate$1([
        sf.base.Property('')
    ], SparklineTooltipSettings.prototype, "template", void 0);
    __decorate$1([
        sf.base.Property('')
    ], SparklineTooltipSettings.prototype, "format", void 0);
    __decorate$1([
        sf.base.Complex({ color: '#cccccc', width: 0.5 }, SparklineBorder)
    ], SparklineTooltipSettings.prototype, "border", void 0);
    __decorate$1([
        sf.base.Complex({ size: '13px', fontWeight: 'Normal', fontStyle: 'Normal', fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif' }, SparklineFont)
    ], SparklineTooltipSettings.prototype, "textStyle", void 0);
    __decorate$1([
        sf.base.Complex({}, TrackLineSettings)
    ], SparklineTooltipSettings.prototype, "trackLineSettings", void 0);
    return SparklineTooltipSettings;
}(sf.base.ChildProperty));
/**
 * To configure the sparkline container area customization
 */
var ContainerArea = /** @class */ (function (_super) {
    __extends$1(ContainerArea, _super);
    function ContainerArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property('transparent')
    ], ContainerArea.prototype, "background", void 0);
    __decorate$1([
        sf.base.Complex({}, SparklineBorder)
    ], ContainerArea.prototype, "border", void 0);
    return ContainerArea;
}(sf.base.ChildProperty));
/**
 * To configure axis line settings
 */
var LineSettings = /** @class */ (function (_super) {
    __extends$1(LineSettings, _super);
    function LineSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(false)
    ], LineSettings.prototype, "visible", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], LineSettings.prototype, "color", void 0);
    __decorate$1([
        sf.base.Property('')
    ], LineSettings.prototype, "dashArray", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], LineSettings.prototype, "width", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], LineSettings.prototype, "opacity", void 0);
    return LineSettings;
}(sf.base.ChildProperty));
/**
 * To configure the sparkline rangeband
 */
var RangeBandSettings = /** @class */ (function (_super) {
    __extends$1(RangeBandSettings, _super);
    function RangeBandSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(null)
    ], RangeBandSettings.prototype, "startRange", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], RangeBandSettings.prototype, "endRange", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], RangeBandSettings.prototype, "color", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], RangeBandSettings.prototype, "opacity", void 0);
    return RangeBandSettings;
}(sf.base.ChildProperty));
/**
 * To configure the sparkline axis
 */
var AxisSettings = /** @class */ (function (_super) {
    __extends$1(AxisSettings, _super);
    function AxisSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(null)
    ], AxisSettings.prototype, "minX", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], AxisSettings.prototype, "maxX", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], AxisSettings.prototype, "minY", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], AxisSettings.prototype, "maxY", void 0);
    __decorate$1([
        sf.base.Property(0)
    ], AxisSettings.prototype, "value", void 0);
    __decorate$1([
        sf.base.Complex({}, LineSettings)
    ], AxisSettings.prototype, "lineSettings", void 0);
    return AxisSettings;
}(sf.base.ChildProperty));
/**
 * To configure the sparkline padding.
 */
var Padding = /** @class */ (function (_super) {
    __extends$1(Padding, _super);
    function Padding() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(5)
    ], Padding.prototype, "left", void 0);
    __decorate$1([
        sf.base.Property(5)
    ], Padding.prototype, "right", void 0);
    __decorate$1([
        sf.base.Property(5)
    ], Padding.prototype, "bottom", void 0);
    __decorate$1([
        sf.base.Property(5)
    ], Padding.prototype, "top", void 0);
    return Padding;
}(sf.base.ChildProperty));
/**
 * To configure the sparkline marker options.
 */
var SparklineMarkerSettings = /** @class */ (function (_super) {
    __extends$1(SparklineMarkerSettings, _super);
    function SparklineMarkerSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property([])
    ], SparklineMarkerSettings.prototype, "visible", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], SparklineMarkerSettings.prototype, "opacity", void 0);
    __decorate$1([
        sf.base.Property(5)
    ], SparklineMarkerSettings.prototype, "size", void 0);
    __decorate$1([
        sf.base.Property('#00bdae')
    ], SparklineMarkerSettings.prototype, "fill", void 0);
    __decorate$1([
        sf.base.Complex({ width: 1 }, SparklineBorder)
    ], SparklineMarkerSettings.prototype, "border", void 0);
    return SparklineMarkerSettings;
}(sf.base.ChildProperty));
/**
 * To configure the datalabel offset
 */
var LabelOffset = /** @class */ (function (_super) {
    __extends$1(LabelOffset, _super);
    function LabelOffset() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(0)
    ], LabelOffset.prototype, "x", void 0);
    __decorate$1([
        sf.base.Property(0)
    ], LabelOffset.prototype, "y", void 0);
    return LabelOffset;
}(sf.base.ChildProperty));
/**
 * To configure the sparkline dataLabel options.
 */
var SparklineDataLabelSettings = /** @class */ (function (_super) {
    __extends$1(SparklineDataLabelSettings, _super);
    function SparklineDataLabelSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property([])
    ], SparklineDataLabelSettings.prototype, "visible", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], SparklineDataLabelSettings.prototype, "opacity", void 0);
    __decorate$1([
        sf.base.Property('transparent')
    ], SparklineDataLabelSettings.prototype, "fill", void 0);
    __decorate$1([
        sf.base.Property('')
    ], SparklineDataLabelSettings.prototype, "format", void 0);
    __decorate$1([
        sf.base.Complex({ color: 'transparent', width: 0 }, SparklineBorder)
    ], SparklineDataLabelSettings.prototype, "border", void 0);
    __decorate$1([
        sf.base.Complex({ size: '14px', fontWeight: 'Medium', fontStyle: 'Medium', fontFamily: 'Roboto, Segoe UI, Noto, Sans-serif' }, SparklineFont)
    ], SparklineDataLabelSettings.prototype, "textStyle", void 0);
    __decorate$1([
        sf.base.Complex({}, LabelOffset)
    ], SparklineDataLabelSettings.prototype, "offset", void 0);
    __decorate$1([
        sf.base.Property('None')
    ], SparklineDataLabelSettings.prototype, "edgeLabelMode", void 0);
    return SparklineDataLabelSettings;
}(sf.base.ChildProperty));

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
/**
 * Sparkline control helper file
 */
/**
 * sparkline internal use of `Size` type
 */
var Size$1 = /** @class */ (function () {
    function Size$$1(width, height) {
        this.width = width;
        this.height = height;
    }
    return Size$$1;
}());
/**
 * To find the default colors based on theme.
 * @private
 */
function getThemeColor(theme) {
    var themeColors;
    switch (theme.toLowerCase()) {
        case 'bootstrapdark':
        case 'fabricdark':
        case 'materialdark':
        case 'highcontrast':
            themeColors = {
                axisLineColor: '#ffffff',
                dataLabelColor: '#ffffff',
                rangeBandColor: '#ffffff',
                tooltipFill: '#ffffff',
                background: '#000000',
                tooltipFontColor: '#363F4C',
                trackerLineColor: '#ffffff'
            };
            break;
        case 'bootstrap4':
            themeColors = {
                axisLineColor: '#6C757D',
                dataLabelColor: '#212529',
                rangeBandColor: '#212529',
                tooltipFill: '#000000',
                background: '#FFFFFF',
                tooltipFontColor: '#FFFFFF',
                trackerLineColor: '#212529',
                fontFamily: 'HelveticaNeue-Medium',
                tooltipFillOpacity: 1,
                tooltipTextOpacity: 0.9,
                labelFontFamily: 'HelveticaNeue'
            };
            break;
        default: {
            themeColors = {
                axisLineColor: '#000000',
                dataLabelColor: '#424242',
                rangeBandColor: '#000000',
                background: '#FFFFFF',
                tooltipFill: '#363F4C',
                tooltipFontColor: '#ffffff',
                trackerLineColor: '#000000'
            };
            break;
        }
    }
    return themeColors;
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
 * Method to calculate the width and height of the sparkline
 */
function calculateSize(sparkline) {
    var containerWidth;
    var containerHeight;
    containerWidth = !sparkline.element.clientWidth ? (!sparkline.element.parentElement ? 100 :
        sparkline.element.parentElement.clientWidth) : sparkline.element.clientWidth;
    containerHeight = !sparkline.element.clientHeight ? (!sparkline.element.parentElement ? 50 :
        sparkline.element.parentElement.clientHeight) : sparkline.element.clientHeight;
    sparkline.availableSize = new Size$1(stringToNumber(sparkline.width, containerWidth) || containerWidth, stringToNumber(sparkline.height, containerHeight) || containerHeight || (sparkline.isDevice ?
        Math.min(window.innerWidth, window.innerHeight) : containerHeight));
}
/**
 * Method to create svg for sparkline.
 */
function createSvg(sparkline) {
    sparkline.renderer = new sf.svgbase.SvgRenderer(sparkline.element.id);
    calculateSize(sparkline);
    sparkline.svgObject = sparkline.renderer.createSvg({
        id: sparkline.element.id + '_svg',
        width: sparkline.availableSize.width,
        height: sparkline.availableSize.height
    });
}
/**
 * Internal use of type rect
 * @private
 */
var Rect$1 = /** @class */ (function () {
    function Rect$$1(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return Rect$$1;
}());
/**
 * Internal use of path options
 * @private
 */
var PathOption$1 = /** @class */ (function () {
    function PathOption$$1(id, fill, width, color, opacity, dashArray, d) {
        this.id = id;
        this.fill = fill;
        this.opacity = opacity;
        this['stroke-width'] = width;
        this.stroke = color;
        this.d = d;
        this['stroke-dasharray'] = dashArray;
    }
    return PathOption$$1;
}());
/**
 * Internal use of rectangle options
 * @private
 */
var RectOption = /** @class */ (function (_super) {
    __extends$2(RectOption, _super);
    function RectOption(id, fill, border, opacity, rect, tl, tr, bl, br) {
        if (tl === void 0) { tl = 0; }
        if (tr === void 0) { tr = 0; }
        if (bl === void 0) { bl = 0; }
        if (br === void 0) { br = 0; }
        var _this = _super.call(this, id, fill, border.width, border.color, opacity) || this;
        _this.rect = rect;
        _this.topLeft = tl;
        _this.topRight = tr;
        _this.bottomLeft = bl;
        _this.bottomRight = br;
        return _this;
    }
    return RectOption;
}(PathOption$1));
/**
 * Internal use of circle options
 * @private
 */
var CircleOption = /** @class */ (function (_super) {
    __extends$2(CircleOption, _super);
    function CircleOption(id, fill, border, opacity, cx, cy, r, dashArray) {
        var _this = _super.call(this, id, fill, border.width, border.color, opacity) || this;
        _this.cy = cy;
        _this.cx = cx;
        _this.r = r;
        _this['stroke-dasharray'] = dashArray;
        return _this;
    }
    return CircleOption;
}(PathOption$1));
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
function drawCircle(sparkline, options, element) {
    return appendShape(sparkline.renderer.drawCircle(options), element);
}
/**
 * To get rounded rect path direction
 */
function calculateRoundedRectPath(r, topLeft, topRight, bottomLeft, bottomRight) {
    return 'M' + ' ' + r.x + ' ' + (topLeft + r.y) +
        ' Q ' + r.x + ' ' + r.y + ' ' + (r.x + topLeft) + ' ' +
        r.y + ' ' + 'L' + ' ' + (r.x + r.width - topRight) + ' ' + r.y +
        ' Q ' + (r.x + r.width) + ' ' + r.y + ' ' +
        (r.x + r.width) + ' ' + (r.y + topRight) + ' ' + 'L ' +
        (r.x + r.width) + ' ' + (r.y + r.height - bottomRight)
        + ' Q ' + (r.x + r.width) + ' ' + (r.y + r.height) + ' ' + (r.x + r.width - bottomRight) + ' ' +
        (r.y + r.height) + ' ' + 'L ' + (r.x + bottomLeft) + ' ' + (r.y + r.height) + ' Q ' + r.x + ' ' +
        (r.y + r.height) + ' ' + r.x + ' ' + (r.y + r.height - bottomLeft) + ' ' + 'L' + ' ' + r.x + ' ' +
        (topLeft + r.y) + ' ' + 'Z';
}
/**
 * Internal rendering of Rectangle
 * @private
 */
function drawRectangle(sparkline, options, element) {
    options.d = calculateRoundedRectPath(options.rect, options.topLeft, options.topRight, options.bottomLeft, options.bottomRight);
    return appendShape(sparkline.renderer.drawPath(options), element);
}
/**
 * Internal rendering of Path
 * @private
 */
function drawPath(sparkline, options, element) {
    return appendShape(sparkline.renderer.drawPath(options), element);
}
/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {SparklineFontModel} font
 * @param  {string} id
 * @returns no
 * @private
 */
function measureText$1(text, font) {
    var htmlObject = document.getElementById('sparklinesmeasuretext');
    if (htmlObject === null) {
        htmlObject = sf.base.createElement('text', { id: 'sparklinesmeasuretext' });
        document.body.appendChild(htmlObject);
    }
    htmlObject.innerHTML = text;
    htmlObject.style.fontStyle = font.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily;
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.top = '-100';
    htmlObject.style.left = '0';
    htmlObject.style.position = 'absolute';
    htmlObject.style.fontSize = font.size;
    htmlObject.style.fontWeight = font.fontWeight;
    htmlObject.style.whiteSpace = 'nowrap';
    // For bootstrap line height issue
    htmlObject.style.lineHeight = 'normal';
    return new Size$1(htmlObject.clientWidth, htmlObject.clientHeight);
}
/**
 * Internal use of text options
 * @private
 */
var TextOption$1 = /** @class */ (function () {
    function TextOption$$1(id, x, y, anchor, text, baseLine, transform) {
        if (transform === void 0) { transform = ''; }
        this.transform = '';
        this.baseLine = 'auto';
        this.id = id;
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.text = text;
        this.transform = transform;
        this.baseLine = baseLine;
    }
    return TextOption$$1;
}());
/**
 * Internal rendering of text
 * @private
 */
function renderTextElement(options, font, color, parent) {
    var textOptions = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'transform': options.transform,
        'opacity': font.opacity,
        'fill': color,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'font-size': font.size,
        'font-style': font.fontStyle,
        'text-anchor': options.anchor,
        'dominant-baseline': options.baseLine
    };
    var renderer = new sf.svgbase.SvgRenderer('');
    var htmlObject = renderer.createText(textOptions, options.text);
    htmlObject.style['user-select'] = 'none';
    htmlObject.style['-moz-user-select'] = 'none';
    htmlObject.style['-webkit-touch-callout'] = 'none';
    htmlObject.style['-webkit-user-select'] = 'none';
    htmlObject.style['-khtml-user-select'] = 'none';
    htmlObject.style['-ms-user-select'] = 'none';
    htmlObject.style['-o-user-select'] = 'none';
    parent.appendChild(htmlObject);
    return htmlObject;
}
/**
 * To remove element by id
 */
function removeElement(id) {
    var element = document.getElementById(id);
    return element ? sf.base.remove(element) : null;
}
/**
 * To find the element by id
 */
function getIdElement(id) {
    return document.getElementById(id);
}
/**
 * To find point within the bounds.
 */
function withInBounds(x, y, bounds) {
    return (x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height);
}

/**
 * Specifies Chart Themes
 */
var Theme;
(function (Theme) {
    /** @private */
    Theme.axisLabelFont = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.axisTitleFont = {
        size: '14px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.chartTitleFont = {
        size: '15px',
        fontWeight: '500',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.chartSubTitleFont = {
        size: '11px',
        fontWeight: '500',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.crosshairLabelFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.tooltipLabelFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.legendLabelFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.legendTitleFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.stripLineLabelFont = {
        size: '12px',
        fontWeight: 'Regular',
        color: '#353535',
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.stockEventFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
})(Theme || (Theme = {}));
/** @private */

/** @private */

/** @private */

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
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines the appearance of the connectors
 */
var Connector = /** @class */ (function (_super) {
    __extends$4(Connector, _super);
    function Connector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property('Line')
    ], Connector.prototype, "type", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Connector.prototype, "color", void 0);
    __decorate$2([
        sf.base.Property(1)
    ], Connector.prototype, "width", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Connector.prototype, "length", void 0);
    __decorate$2([
        sf.base.Property('')
    ], Connector.prototype, "dashArray", void 0);
    return Connector;
}(sf.base.ChildProperty));
/**
 * Configures the fonts in charts.
 */
var Font = /** @class */ (function (_super) {
    __extends$4(Font, _super);
    function Font() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property('Normal')
    ], Font.prototype, "fontStyle", void 0);
    __decorate$2([
        sf.base.Property('16px')
    ], Font.prototype, "size", void 0);
    __decorate$2([
        sf.base.Property('Normal')
    ], Font.prototype, "fontWeight", void 0);
    __decorate$2([
        sf.base.Property('')
    ], Font.prototype, "color", void 0);
    __decorate$2([
        sf.base.Property('Center')
    ], Font.prototype, "textAlignment", void 0);
    __decorate$2([
        sf.base.Property('Segoe UI')
    ], Font.prototype, "fontFamily", void 0);
    __decorate$2([
        sf.base.Property(1)
    ], Font.prototype, "opacity", void 0);
    __decorate$2([
        sf.base.Property('Trim')
    ], Font.prototype, "textOverflow", void 0);
    return Font;
}(sf.base.ChildProperty));
/**
 * Configures the borders in the chart.
 */
var Border = /** @class */ (function (_super) {
    __extends$4(Border, _super);
    function Border() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property('')
    ], Border.prototype, "color", void 0);
    __decorate$2([
        sf.base.Property(1)
    ], Border.prototype, "width", void 0);
    return Border;
}(sf.base.ChildProperty));
/**
 * Configures the marker position in the chart.
 */
var Offset = /** @class */ (function (_super) {
    __extends$4(Offset, _super);
    function Offset() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(0)
    ], Offset.prototype, "x", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], Offset.prototype, "y", void 0);
    return Offset;
}(sf.base.ChildProperty));
/**
 * Configures the chart area.
 */
var ChartArea = /** @class */ (function (_super) {
    __extends$4(ChartArea, _super);
    function ChartArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Complex({}, Border)
    ], ChartArea.prototype, "border", void 0);
    __decorate$2([
        sf.base.Property('transparent')
    ], ChartArea.prototype, "background", void 0);
    __decorate$2([
        sf.base.Property(1)
    ], ChartArea.prototype, "opacity", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], ChartArea.prototype, "backgroundImage", void 0);
    return ChartArea;
}(sf.base.ChildProperty));
/**
 * Configures the chart margins.
 */
var Margin = /** @class */ (function (_super) {
    __extends$4(Margin, _super);
    function Margin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(10)
    ], Margin.prototype, "left", void 0);
    __decorate$2([
        sf.base.Property(10)
    ], Margin.prototype, "right", void 0);
    __decorate$2([
        sf.base.Property(10)
    ], Margin.prototype, "top", void 0);
    __decorate$2([
        sf.base.Property(10)
    ], Margin.prototype, "bottom", void 0);
    return Margin;
}(sf.base.ChildProperty));
/**
 * Configures the animation behavior for chart series.
 */
var Animation$1 = /** @class */ (function (_super) {
    __extends$4(Animation$$1, _super);
    function Animation$$1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(true)
    ], Animation$$1.prototype, "enable", void 0);
    __decorate$2([
        sf.base.Property(1000)
    ], Animation$$1.prototype, "duration", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], Animation$$1.prototype, "delay", void 0);
    return Animation$$1;
}(sf.base.ChildProperty));
/**
 * Series and point index
 * @public
 */
var Indexes = /** @class */ (function (_super) {
    __extends$4(Indexes, _super);
    function Indexes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(0)
    ], Indexes.prototype, "series", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], Indexes.prototype, "point", void 0);
    return Indexes;
}(sf.base.ChildProperty));
/**
 * Column series rounded corner options
 */
var CornerRadius = /** @class */ (function (_super) {
    __extends$4(CornerRadius, _super);
    function CornerRadius() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(0)
    ], CornerRadius.prototype, "topLeft", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], CornerRadius.prototype, "topRight", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], CornerRadius.prototype, "bottomLeft", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], CornerRadius.prototype, "bottomRight", void 0);
    return CornerRadius;
}(sf.base.ChildProperty));
/**
 * Configures the Empty Points of series
 */
var EmptyPointSettings = /** @class */ (function (_super) {
    __extends$4(EmptyPointSettings, _super);
    function EmptyPointSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(null)
    ], EmptyPointSettings.prototype, "fill", void 0);
    __decorate$2([
        sf.base.Complex({ color: 'transparent', width: 0 }, Border)
    ], EmptyPointSettings.prototype, "border", void 0);
    __decorate$2([
        sf.base.Property('Gap')
    ], EmptyPointSettings.prototype, "mode", void 0);
    return EmptyPointSettings;
}(sf.base.ChildProperty));
/**
 * Configures the drag settings of series
 */
var DragSettings = /** @class */ (function (_super) {
    __extends$4(DragSettings, _super);
    function DragSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(false)
    ], DragSettings.prototype, "enable", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], DragSettings.prototype, "minY", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], DragSettings.prototype, "maxY", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], DragSettings.prototype, "fill", void 0);
    return DragSettings;
}(sf.base.ChildProperty));
/**
 * Configures the ToolTips in the chart.
 * @public
 */
var TooltipSettings = /** @class */ (function (_super) {
    __extends$4(TooltipSettings, _super);
    function TooltipSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(false)
    ], TooltipSettings.prototype, "enable", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], TooltipSettings.prototype, "enableMarker", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], TooltipSettings.prototype, "shared", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], TooltipSettings.prototype, "fill", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], TooltipSettings.prototype, "header", void 0);
    __decorate$2([
        sf.base.Property(0.75)
    ], TooltipSettings.prototype, "opacity", void 0);
    __decorate$2([
        sf.base.Complex(Theme.tooltipLabelFont, Font)
    ], TooltipSettings.prototype, "textStyle", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], TooltipSettings.prototype, "format", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], TooltipSettings.prototype, "template", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], TooltipSettings.prototype, "enableAnimation", void 0);
    __decorate$2([
        sf.base.Property(300)
    ], TooltipSettings.prototype, "duration", void 0);
    __decorate$2([
        sf.base.Property(1000)
    ], TooltipSettings.prototype, "fadeOutDuration", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], TooltipSettings.prototype, "enableTextWrap", void 0);
    __decorate$2([
        sf.base.Complex({ color: '#cccccc', width: 0.5 }, Border)
    ], TooltipSettings.prototype, "border", void 0);
    return TooltipSettings;
}(sf.base.ChildProperty));
/**
 * button settings in period selector
 */
var Periods = /** @class */ (function (_super) {
    __extends$4(Periods, _super);
    function Periods() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property('Years')
    ], Periods.prototype, "intervalType", void 0);
    __decorate$2([
        sf.base.Property(1)
    ], Periods.prototype, "interval", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Periods.prototype, "text", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Periods.prototype, "selected", void 0);
    return Periods;
}(sf.base.ChildProperty));
/**
 * Period Selector Settings
 */
var PeriodSelectorSettings = /** @class */ (function (_super) {
    __extends$4(PeriodSelectorSettings, _super);
    function PeriodSelectorSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(43)
    ], PeriodSelectorSettings.prototype, "height", void 0);
    __decorate$2([
        sf.base.Property('Bottom')
    ], PeriodSelectorSettings.prototype, "position", void 0);
    __decorate$2([
        sf.base.Collection([], Periods)
    ], PeriodSelectorSettings.prototype, "periods", void 0);
    return PeriodSelectorSettings;
}(sf.base.ChildProperty));

/**
 * Numeric Range.
 * @private
 */
var DoubleRange = /** @class */ (function () {
    function DoubleRange(start, end) {
        /*
          if (!isNaN(start) && !isNaN(end)) {
           this.mIsEmpty = true;
          } else {
              this.mIsEmpty = false;
          }*/
        if (start < end) {
            this.mStart = start;
            this.mEnd = end;
        }
        else {
            this.mStart = end;
            this.mEnd = start;
        }
    }
    Object.defineProperty(DoubleRange.prototype, "start", {
        //private mIsEmpty: boolean;
        /** @private */
        get: function () {
            return this.mStart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DoubleRange.prototype, "end", {
        /** @private */
        get: function () {
            return this.mEnd;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DoubleRange.prototype, "delta", {
        /*
          get isEmpty(): boolean {
             return this.mIsEmpty;
         }*/
        /** @private */
        get: function () {
            return (this.mEnd - this.mStart);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DoubleRange.prototype, "median", {
        /** @private */
        get: function () {
            return this.mStart + (this.mEnd - this.mStart) / 2;
        },
        enumerable: true,
        configurable: true
    });
    return DoubleRange;
}());

/**
 * Numeric module is used to render numeric axis.
 */
var Double = /** @class */ (function () {
    /**
     * Constructor for the dateTime module.
     * @private
     */
    function Double(chart) {
        this.isColumn = 0;
        this.chart = chart;
    }
    /**
     * Numeric Nice Interval for the axis.
     * @private
     */
    Double.prototype.calculateNumericNiceInterval = function (axis, delta, size) {
        var actualDesiredIntervalsCount = getActualDesiredIntervalsCount(size, axis);
        var niceInterval = delta / actualDesiredIntervalsCount;
        if (!sf.base.isNullOrUndefined(axis.desiredIntervals)) {
            return niceInterval;
        }
        var minInterval = Math.pow(10, Math.floor(logBase(niceInterval, 10)));
        for (var _i = 0, _a = axis.intervalDivs; _i < _a.length; _i++) {
            var interval = _a[_i];
            var currentInterval = minInterval * interval;
            if (actualDesiredIntervalsCount < (delta / currentInterval)) {
                break;
            }
            niceInterval = currentInterval;
        }
        return niceInterval;
    };
    /**
     * Actual Range for the axis.
     * @private
     */
    Double.prototype.getActualRange = function (axis, size) {
        this.initializeDoubleRange(axis);
        if ((!axis.startFromZero) && (this.isColumn > 0)) {
            axis.actualRange.interval = axis.interval || this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size);
            axis.actualRange.max = axis.doubleRange.end + axis.actualRange.interval;
            if ((axis.doubleRange.start - axis.actualRange.interval < 0 && axis.doubleRange.start > 0)) {
                axis.actualRange.min = 0;
            }
            else {
                axis.actualRange.min = axis.doubleRange.start - axis.actualRange.interval;
            }
        }
        else {
            axis.actualRange.interval = axis.interval || this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size);
            axis.actualRange.min = axis.doubleRange.start;
            axis.actualRange.max = axis.doubleRange.end;
        }
    };
    /**
     * Range for the axis.
     * @private
     */
    Double.prototype.initializeDoubleRange = function (axis) {
        //Axis Min
        if (axis.minimum !== null) {
            this.min = axis.minimum;
        }
        else if (this.min === null || this.min === Number.POSITIVE_INFINITY) {
            this.min = 0;
        }
        // Axis Max
        if (axis.maximum !== null) {
            this.max = axis.maximum;
        }
        else if (this.max === null || this.max === Number.NEGATIVE_INFINITY) {
            this.max = 5;
        }
        if (this.min === this.max) {
            this.max = axis.valueType.indexOf('Category') > -1 ? this.max : this.min + 1;
        }
        axis.doubleRange = new DoubleRange(this.min, this.max);
        axis.actualRange = {};
    };
    /**
     * The function to calculate the range and labels for the axis.
     * @return {void}
     * @private
     */
    Double.prototype.calculateRangeAndInterval = function (size, axis) {
        this.calculateRange(axis, size);
        this.getActualRange(axis, size);
        this.applyRangePadding(axis, size);
        this.calculateVisibleLabels(axis, this.chart);
    };
    /**
     * Calculate Range for the axis.
     * @private
     */
    Double.prototype.calculateRange = function (axis, size) {
        /*! Generate axis range */
        this.min = null;
        this.max = null;
        if (!setRange(axis)) {
            for (var _i = 0, _a = axis.series; _i < _a.length; _i++) {
                var series_1 = _a[_i];
                if (!series_1.visible) {
                    continue;
                }
                this.paddingInterval = 0;
                axis.maxPointLength = series_1.points.length;
                if (((series_1.type.indexOf('Column') > -1 || series_1.type.indexOf('Histogram') > -1) && axis.orientation === 'Horizontal')
                    || (series_1.type.indexOf('Bar') > -1 && axis.orientation === 'Vertical')) {
                    if ((series_1.xAxis.valueType === 'Double' || series_1.xAxis.valueType === 'DateTime')
                        && series_1.xAxis.rangePadding === 'Auto') {
                        this.paddingInterval = getMinPointsDelta(series_1.xAxis, axis.series) * 0.5;
                    }
                }
                //For xRange
                if (axis.orientation === 'Horizontal') {
                    if (this.chart.requireInvertedAxis) {
                        this.yAxisRange(axis, series_1);
                    }
                    else {
                        this.findMinMax(series_1.xMin - this.paddingInterval, series_1.xMax + this.paddingInterval);
                    }
                }
                // For yRange
                if (axis.orientation === 'Vertical') {
                    this.isColumn += (series_1.type === 'Column' || series_1.type === 'Bar' || series_1.drawType === 'Column') ? 1 : 0;
                    if (this.chart.requireInvertedAxis) {
                        this.findMinMax(series_1.xMin - this.paddingInterval, series_1.xMax + this.paddingInterval);
                    }
                    else {
                        this.yAxisRange(axis, series_1);
                    }
                }
            }
        }
    };
    Double.prototype.yAxisRange = function (axis, series) {
        if (series.dragSettings.enable && this.chart.dragY) {
            if (this.chart.dragY >= axis.visibleRange.max) {
                series.yMax = this.chart.dragY + axis.visibleRange.interval;
            }
            if (this.chart.dragY <= axis.visibleRange.min) {
                series.yMin = this.chart.dragY - axis.visibleRange.interval;
            }
        }
        this.findMinMax(series.yMin, series.yMax);
    };
    Double.prototype.findMinMax = function (min, max) {
        if (this.min === null || this.min > min) {
            this.min = min;
        }
        if (this.max === null || this.max < max) {
            this.max = max;
        }
        if ((this.max === this.min) && this.max < 0 && this.min < 0) { // max == min
            this.max = 0;
        }
    };
    /**
     * Apply padding for the range.
     * @private
     */
    Double.prototype.applyRangePadding = function (axis, size) {
        var start = axis.actualRange.min;
        var end = axis.actualRange.max;
        if (!setRange(axis)) {
            var interval = axis.actualRange.interval;
            var padding = axis.getRangePadding(this.chart);
            if (padding === 'Additional' || padding === 'Round') {
                this.findAdditional(axis, start, end, interval);
            }
            else if (padding === 'Normal') {
                this.findNormal(axis, start, end, interval, size);
            }
            else {
                this.updateActualRange(axis, start, end, interval);
            }
        }
        axis.actualRange.delta = axis.actualRange.max - axis.actualRange.min;
        this.calculateVisibleRange(size, axis);
    };
    Double.prototype.updateActualRange = function (axis, minimum, maximum, interval) {
        axis.actualRange = {
            min: axis.minimum != null ? axis.minimum : minimum,
            max: axis.maximum != null ? axis.maximum : maximum,
            interval: axis.interval != null ? axis.interval : interval,
            delta: axis.actualRange.delta
        };
    };
    Double.prototype.findAdditional = function (axis, start, end, interval) {
        var minimum;
        var maximum;
        minimum = Math.floor(start / interval) * interval;
        maximum = Math.ceil(end / interval) * interval;
        if (axis.rangePadding === 'Additional') {
            minimum -= interval;
            maximum += interval;
        }
        this.updateActualRange(axis, minimum, maximum, interval);
    };
    Double.prototype.findNormal = function (axis, start, end, interval, size) {
        var remaining;
        var minimum;
        var maximum;
        var startValue = start;
        if (start < 0) {
            startValue = 0;
            minimum = start + (start * 0.05);
            remaining = interval + (minimum % interval);
            if ((0.365 * interval) >= remaining) {
                minimum -= interval;
            }
            if (minimum % interval < 0) {
                minimum = (minimum - interval) - (minimum % interval);
            }
        }
        else {
            minimum = start < ((5.0 / 6.0) * end) ? 0 : (start - (end - start) * 0.5);
            if (minimum % interval > 0) {
                minimum -= (minimum % interval);
            }
        }
        maximum = (end > 0) ? (end + (end - startValue) * 0.05) : (end - (end - startValue) * 0.05);
        remaining = interval - (maximum % interval);
        if ((0.365 * interval) >= remaining) {
            maximum += interval;
        }
        if (maximum % interval > 0) {
            maximum = (maximum + interval) - (maximum % interval);
        }
        axis.doubleRange = new DoubleRange(minimum, maximum);
        if (minimum === 0) {
            interval = this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size);
            maximum = Math.ceil(maximum / interval) * interval;
        }
        this.updateActualRange(axis, minimum, maximum, interval);
    };
    /**
     * Calculate visible range for axis.
     * @private
     */
    Double.prototype.calculateVisibleRange = function (size, axis) {
        axis.visibleRange = {
            max: axis.actualRange.max, min: axis.actualRange.min,
            delta: axis.actualRange.delta, interval: axis.actualRange.interval
        };
        if (this.chart.chartAreaType === 'Cartesian') {
            var isLazyLoad = sf.base.isNullOrUndefined(axis.zoomingScrollBar) ? false : axis.zoomingScrollBar.isLazyLoad;
            if ((axis.zoomFactor < 1 || axis.zoomPosition > 0) && !isLazyLoad) {
                axis.calculateVisibleRange(size);
                axis.calculateAxisRange(size, this.chart);
                axis.visibleRange.interval = (axis.enableAutoIntervalOnZooming && axis.valueType !== 'Category') ?
                    this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size)
                    : axis.visibleRange.interval;
            }
        }
        axis.triggerRangeRender(this.chart, axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.interval);
    };
    /**
     * Calculate label for the axis.
     * @private
     */
    Double.prototype.calculateVisibleLabels = function (axis, chart) {
        /*! Generate axis labels */
        axis.visibleLabels = [];
        var tempInterval = axis.visibleRange.min;
        var labelStyle;
        var controlName = chart.getModuleName();
        var isPolarRadar = controlName === 'chart' && chart.chartAreaType === 'PolarRadar';
        if (!isPolarRadar && (axis.zoomFactor < 1 || axis.zoomPosition > 0 || this.paddingInterval)) {
            tempInterval = axis.visibleRange.min - (axis.visibleRange.min % axis.visibleRange.interval);
        }
        var format = this.getFormat(axis);
        var isCustom = format.match('{value}') !== null;
        var intervalDigits = 0;
        var formatDigits = 0;
        if (axis.labelFormat && axis.labelFormat.indexOf('n') > -1) {
            formatDigits = parseInt(axis.labelFormat.substring(1, axis.labelFormat.length), 10);
        }
        axis.format = chart.intl.getNumberFormat({
            format: isCustom ? '' : format,
            useGrouping: chart.useGroupingSeparator
        });
        axis.startLabel = axis.format(axis.visibleRange.min);
        axis.endLabel = axis.format(axis.visibleRange.max);
        if (axis.visibleRange.interval && (axis.visibleRange.interval + '').indexOf('.') >= 0) {
            intervalDigits = (axis.visibleRange.interval + '').split('.')[1].length;
        }
        for (; tempInterval <= axis.visibleRange.max; tempInterval += axis.visibleRange.interval) {
            labelStyle = (sf.base.extend({}, sf.base.getValue('properties', axis.labelStyle), null, true));
            if (withIn(tempInterval, axis.visibleRange)) {
                triggerLabelRender(chart, tempInterval, this.formatValue(axis, isCustom, format, tempInterval), labelStyle, axis);
            }
        }
        if (tempInterval && (tempInterval + '').indexOf('.') >= 0 && (tempInterval + '').split('.')[1].length > 10) {
            tempInterval = (tempInterval + '').split('.')[1].length > (formatDigits || intervalDigits) ?
                +tempInterval.toFixed(formatDigits || intervalDigits) : tempInterval;
            if (tempInterval <= axis.visibleRange.max) {
                triggerLabelRender(chart, tempInterval, this.formatValue(axis, isCustom, format, tempInterval), labelStyle, axis);
            }
        }
        if (axis.getMaxLabelWidth) {
            axis.getMaxLabelWidth(this.chart);
        }
    };
    /**
     * Format of the axis label.
     * @private
     */
    Double.prototype.getFormat = function (axis) {
        if (axis.labelFormat) {
            if (axis.labelFormat.indexOf('p') === 0 && axis.labelFormat.indexOf('{value}') === -1 && axis.isStack100) {
                return '{value}%';
            }
            return axis.labelFormat;
        }
        return axis.isStack100 ? '{value}%' : '';
    };
    /**
     * Formatted the axis label.
     * @private
     */
    Double.prototype.formatValue = function (axis, isCustom, format, tempInterval) {
        return isCustom ? format.replace('{value}', axis.format(tempInterval))
            : axis.format(tempInterval);
    };
    return Double;
}());

/**
 * Specifies the chart constant value
 */
/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */
var axisLabelRender = 'axisLabelRender';
/** @private */

/** @private */
var axisRangeCalculated = 'axisRangeCalculated';
/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/*** @private*/

/*** @private*/

/** @private */

/** @private */

/** @private */

/** @private */

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
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the Annotation for chart.
 */
var ChartAnnotationSettings = /** @class */ (function (_super) {
    __extends$6(ChartAnnotationSettings, _super);
    function ChartAnnotationSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property('0')
    ], ChartAnnotationSettings.prototype, "x", void 0);
    __decorate$4([
        sf.base.Property('0')
    ], ChartAnnotationSettings.prototype, "y", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ChartAnnotationSettings.prototype, "content", void 0);
    __decorate$4([
        sf.base.Property('Center')
    ], ChartAnnotationSettings.prototype, "horizontalAlignment", void 0);
    __decorate$4([
        sf.base.Property('Pixel')
    ], ChartAnnotationSettings.prototype, "coordinateUnits", void 0);
    __decorate$4([
        sf.base.Property('Chart')
    ], ChartAnnotationSettings.prototype, "region", void 0);
    __decorate$4([
        sf.base.Property('Middle')
    ], ChartAnnotationSettings.prototype, "verticalAlignment", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ChartAnnotationSettings.prototype, "xAxisName", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ChartAnnotationSettings.prototype, "yAxisName", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ChartAnnotationSettings.prototype, "description", void 0);
    return ChartAnnotationSettings;
}(sf.base.ChildProperty));
/**
 * label border properties.
 */
var LabelBorder = /** @class */ (function (_super) {
    __extends$6(LabelBorder, _super);
    function LabelBorder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property('')
    ], LabelBorder.prototype, "color", void 0);
    __decorate$4([
        sf.base.Property(1)
    ], LabelBorder.prototype, "width", void 0);
    __decorate$4([
        sf.base.Property('Rectangle')
    ], LabelBorder.prototype, "type", void 0);
    return LabelBorder;
}(sf.base.ChildProperty));
/**
 * categories for multi level labels
 */
var MultiLevelCategories = /** @class */ (function (_super) {
    __extends$6(MultiLevelCategories, _super);
    function MultiLevelCategories() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(null)
    ], MultiLevelCategories.prototype, "start", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], MultiLevelCategories.prototype, "end", void 0);
    __decorate$4([
        sf.base.Property('')
    ], MultiLevelCategories.prototype, "text", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], MultiLevelCategories.prototype, "maximumTextWidth", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], MultiLevelCategories.prototype, "customAttributes", void 0);
    __decorate$4([
        sf.base.Property('')
    ], MultiLevelCategories.prototype, "type", void 0);
    return MultiLevelCategories;
}(sf.base.ChildProperty));
/**
 * Strip line properties
 */
var StripLineSettings = /** @class */ (function (_super) {
    __extends$6(StripLineSettings, _super);
    function StripLineSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(true)
    ], StripLineSettings.prototype, "visible", void 0);
    __decorate$4([
        sf.base.Property(false)
    ], StripLineSettings.prototype, "startFromAxis", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "start", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "end", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "size", void 0);
    __decorate$4([
        sf.base.Property('#808080')
    ], StripLineSettings.prototype, "color", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "dashArray", void 0);
    __decorate$4([
        sf.base.Property('Auto')
    ], StripLineSettings.prototype, "sizeType", void 0);
    __decorate$4([
        sf.base.Property(false)
    ], StripLineSettings.prototype, "isRepeat", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "repeatEvery", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "repeatUntil", void 0);
    __decorate$4([
        sf.base.Property(false)
    ], StripLineSettings.prototype, "isSegmented", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "segmentStart", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "segmentEnd", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "segmentAxisName", void 0);
    __decorate$4([
        sf.base.Complex({ color: 'transparent', width: 1 }, Border)
    ], StripLineSettings.prototype, "border", void 0);
    __decorate$4([
        sf.base.Property('')
    ], StripLineSettings.prototype, "text", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "rotation", void 0);
    __decorate$4([
        sf.base.Property('Middle')
    ], StripLineSettings.prototype, "horizontalAlignment", void 0);
    __decorate$4([
        sf.base.Property('Middle')
    ], StripLineSettings.prototype, "verticalAlignment", void 0);
    __decorate$4([
        sf.base.Complex(Theme.stripLineLabelFont, Font)
    ], StripLineSettings.prototype, "textStyle", void 0);
    __decorate$4([
        sf.base.Property('Behind')
    ], StripLineSettings.prototype, "zIndex", void 0);
    __decorate$4([
        sf.base.Property(1)
    ], StripLineSettings.prototype, "opacity", void 0);
    return StripLineSettings;
}(sf.base.ChildProperty));
/**
 * MultiLevelLabels properties
 */
var MultiLevelLabels = /** @class */ (function (_super) {
    __extends$6(MultiLevelLabels, _super);
    function MultiLevelLabels() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property('Center')
    ], MultiLevelLabels.prototype, "alignment", void 0);
    __decorate$4([
        sf.base.Property('Wrap')
    ], MultiLevelLabels.prototype, "overflow", void 0);
    __decorate$4([
        sf.base.Complex(Theme.axisLabelFont, Font)
    ], MultiLevelLabels.prototype, "textStyle", void 0);
    __decorate$4([
        sf.base.Complex({ color: null, width: 1, type: 'Rectangle' }, LabelBorder)
    ], MultiLevelLabels.prototype, "border", void 0);
    __decorate$4([
        sf.base.Collection([], MultiLevelCategories)
    ], MultiLevelLabels.prototype, "categories", void 0);
    return MultiLevelLabels;
}(sf.base.ChildProperty));
/**
 * Specifies range for scrollbarSettings property
 * @public
 */
var ScrollbarSettingsRange = /** @class */ (function (_super) {
    __extends$6(ScrollbarSettingsRange, _super);
    function ScrollbarSettingsRange() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(null)
    ], ScrollbarSettingsRange.prototype, "minimum", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ScrollbarSettingsRange.prototype, "maximum", void 0);
    return ScrollbarSettingsRange;
}(sf.base.ChildProperty));
/**
 * Scrollbar Settings Properties for Lazy Loading
 */
var ScrollbarSettings = /** @class */ (function (_super) {
    __extends$6(ScrollbarSettings, _super);
    function ScrollbarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(false)
    ], ScrollbarSettings.prototype, "enable", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ScrollbarSettings.prototype, "pointsLength", void 0);
    __decorate$4([
        sf.base.Complex({}, ScrollbarSettingsRange)
    ], ScrollbarSettings.prototype, "range", void 0);
    return ScrollbarSettings;
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
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var axisPadding = 10;
/**
 * Configures the `rows` of the chart.
 */
var Row = /** @class */ (function (_super) {
    __extends$5(Row, _super);
    function Row() {
        /**
         * The height of the row as a string accept input both as '100px' and '100%'.
         * If specified as '100%, row renders to the full height of its chart.
         * @default '100%'
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.axes = [];
        /** @private */
        _this.nearSizes = [];
        /** @private */
        _this.farSizes = [];
        return _this;
    }
    /**
     * Measure the row size
     * @return {void}
     * @private
     */
    Row.prototype.computeSize = function (axis, clipRect, scrollBarHeight) {
        var width = 0;
        var innerPadding = 5;
        if (axis.visible && axis.internalVisibility) {
            width += (axis.findTickSize(axis.crossInAxis) + scrollBarHeight +
                axis.findLabelSize(axis.crossInAxis, innerPadding) + axis.lineStyle.width * 0.5);
        }
        if (axis.opposedPosition) {
            this.farSizes.push(width);
        }
        else {
            this.nearSizes.push(width);
        }
    };
    __decorate$3([
        sf.base.Property('100%')
    ], Row.prototype, "height", void 0);
    __decorate$3([
        sf.base.Complex({}, Border)
    ], Row.prototype, "border", void 0);
    return Row;
}(sf.base.ChildProperty));
/**
 * Configures the `columns` of the chart.
 */
var Column = /** @class */ (function (_super) {
    __extends$5(Column, _super);
    function Column() {
        /**
         * The width of the column as a string accepts input both as like '100px' or '100%'.
         * If specified as '100%, column renders to the full width of its chart.
         * @default '100%'
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.axes = [];
        /** @private */
        _this.nearSizes = [];
        /** @private */
        _this.farSizes = [];
        /** @private */
        _this.padding = 0;
        return _this;
    }
    /**
     * Measure the column size
     * @return {void}
     * @private
     */
    Column.prototype.computeSize = function (axis, clipRect, scrollBarHeight) {
        var height = 0;
        var innerPadding = 5;
        if (axis.visible && axis.internalVisibility) {
            height += (axis.findTickSize(axis.crossInAxis) + scrollBarHeight +
                axis.findLabelSize(axis.crossInAxis, innerPadding) + axis.lineStyle.width * 0.5);
        }
        if (axis.opposedPosition) {
            this.farSizes.push(height);
        }
        else {
            this.nearSizes.push(height);
        }
    };
    __decorate$3([
        sf.base.Property('100%')
    ], Column.prototype, "width", void 0);
    __decorate$3([
        sf.base.Complex({}, Border)
    ], Column.prototype, "border", void 0);
    return Column;
}(sf.base.ChildProperty));
/**
 * Configures the major grid lines in the `axis`.
 */
var MajorGridLines = /** @class */ (function (_super) {
    __extends$5(MajorGridLines, _super);
    function MajorGridLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(1)
    ], MajorGridLines.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property('')
    ], MajorGridLines.prototype, "dashArray", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], MajorGridLines.prototype, "color", void 0);
    return MajorGridLines;
}(sf.base.ChildProperty));
/**
 * Configures the minor grid lines in the `axis`.
 */
var MinorGridLines = /** @class */ (function (_super) {
    __extends$5(MinorGridLines, _super);
    function MinorGridLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(0.7)
    ], MinorGridLines.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property('')
    ], MinorGridLines.prototype, "dashArray", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], MinorGridLines.prototype, "color", void 0);
    return MinorGridLines;
}(sf.base.ChildProperty));
/**
 * Configures the axis line of a chart.
 */
var AxisLine = /** @class */ (function (_super) {
    __extends$5(AxisLine, _super);
    function AxisLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(1)
    ], AxisLine.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property('')
    ], AxisLine.prototype, "dashArray", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], AxisLine.prototype, "color", void 0);
    return AxisLine;
}(sf.base.ChildProperty));
/**
 * Configures the major tick lines.
 */
var MajorTickLines = /** @class */ (function (_super) {
    __extends$5(MajorTickLines, _super);
    function MajorTickLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(1)
    ], MajorTickLines.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property(5)
    ], MajorTickLines.prototype, "height", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], MajorTickLines.prototype, "color", void 0);
    return MajorTickLines;
}(sf.base.ChildProperty));
/**
 * Configures the minor tick lines.
 */
var MinorTickLines = /** @class */ (function (_super) {
    __extends$5(MinorTickLines, _super);
    function MinorTickLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(0.7)
    ], MinorTickLines.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property(5)
    ], MinorTickLines.prototype, "height", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], MinorTickLines.prototype, "color", void 0);
    return MinorTickLines;
}(sf.base.ChildProperty));
/**
 * Configures the crosshair ToolTip.
 */
var CrosshairTooltip = /** @class */ (function (_super) {
    __extends$5(CrosshairTooltip, _super);
    function CrosshairTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(false)
    ], CrosshairTooltip.prototype, "enable", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], CrosshairTooltip.prototype, "fill", void 0);
    __decorate$3([
        sf.base.Complex(Theme.crosshairLabelFont, Font)
    ], CrosshairTooltip.prototype, "textStyle", void 0);
    return CrosshairTooltip;
}(sf.base.ChildProperty));
/**
 * Configures the axes in the chart.
 * @public
 */
var Axis = /** @class */ (function (_super) {
    __extends$5(Axis, _super);
    // tslint:disable-next-line:no-any
    function Axis(parent, propName, defaultValue, isArray) {
        var _this = _super.call(this, parent, propName, defaultValue, isArray) || this;
        /** @private */
        _this.visibleLabels = [];
        /** @private */
        _this.series = [];
        /** @private */
        _this.rect = new sf.svgbase.Rect(undefined, undefined, 0, 0);
        /** @private */
        _this.axisBottomLine = null;
        /** @private */
        _this.intervalDivs = [10, 5, 2, 1];
        /** @private */
        _this.angle = _this.labelRotation;
        /** @private */
        _this.isStack100 = false;
        /** @private */
        _this.crossAt = null;
        /** @private */
        _this.updatedRect = null;
        /** @private */
        _this.multiLevelLabelHeight = 0;
        /** @private */
        _this.isChart = true;
        /** @private */
        _this.isIntervalInDecimal = true;
        /**
         * @private
         * Task: BLAZ-2044
         * This property used to hide the axis when series hide from legend click
         */
        _this.internalVisibility = true;
        return _this;
    }
    /**
     * The function used to find tick size.
     * @return {number}
     * @private
     */
    Axis.prototype.findTickSize = function (crossAxis) {
        if (this.tickPosition === 'Inside') {
            return 0;
        }
        if (crossAxis && (!crossAxis.visibleRange || this.isInside(crossAxis.visibleRange))) {
            return 0;
        }
        return this.majorTickLines.height;
    };
    /**
     * The function used to find axis position.
     * @return {number}
     * @private
     */
    Axis.prototype.isInside = function (range) {
        return (inside(this.crossAt, range) ||
            (!this.opposedPosition && this.crossAt >= range.max) || (this.opposedPosition && this.crossAt <= range.min));
    };
    /**
     * The function used to find label Size.
     * @return {number}
     * @private
     */
    Axis.prototype.findLabelSize = function (crossAxis, innerPadding) {
        var titleSize = 0;
        if (this.title) {
            titleSize = sf.svgbase.measureText(this.title, this.titleStyle).height + innerPadding;
        }
        if (this.labelPosition === 'Inside') {
            return titleSize + innerPadding;
        }
        var diff;
        var value;
        var labelSize = titleSize + innerPadding + axisPadding +
            ((this.orientation === 'Vertical') ? this.maxLabelSize.width : this.maxLabelSize.height) + this.multiLevelLabelHeight;
        if (crossAxis && this.placeNextToAxisLine) {
            var range = crossAxis.visibleRange;
            var size = (crossAxis.orientation === 'Horizontal') ? crossAxis.rect.width : crossAxis.rect.height;
            if (!range || !size) {
                return 0;
            }
            else if (this.isInside(range)) {
                value = this.findDifference(crossAxis);
                diff = (value) * (size / range.delta);
                diff = (value) * ((size - (diff < labelSize ? (labelSize - diff) : 0)) / range.delta);
                labelSize = (diff < labelSize) ? (labelSize - diff) : 0;
            }
        }
        return labelSize;
    };
    /**
     * The function used to find axis position.
     * @return {number}
     * @private
     */
    Axis.prototype.updateCrossValue = function (chart) {
        var value = this.crossAt;
        if (value === null || !this.isInside(this.crossInAxis.visibleRange)) {
            this.updatedRect = this.rect;
            return null;
        }
        var range = this.crossInAxis.visibleRange;
        if (!this.opposedPosition) {
            if (this.crossAt > range.max) {
                value = range.max;
            }
        }
        else {
            if (this.crossAt < range.min) {
                value = range.min;
            }
        }
        this.updatedRect = sf.base.extend({}, this.rect, null, true);
        if (this.orientation === 'Horizontal') {
            value = this.crossInAxis.rect.height - (valueToCoefficient(value, this.crossInAxis) * this.crossInAxis.rect.height);
            this.updatedRect.y = this.crossInAxis.rect.y + value;
        }
        else {
            value = valueToCoefficient(value, this.crossInAxis) * this.crossInAxis.rect.width;
            this.updatedRect.x = this.crossInAxis.rect.x + value;
        }
    };
    Axis.prototype.findDifference = function (crossAxis) {
        var value = 0;
        if (this.opposedPosition) {
            value = crossAxis.isInversed ? crossAxis.visibleRange.min : crossAxis.visibleRange.max;
        }
        else {
            value = crossAxis.isInversed ? crossAxis.visibleRange.max : crossAxis.visibleRange.min;
        }
        return Math.abs(this.crossAt - value);
    };
    /**
     * Calculate visible range for axis.
     * @return {void}
     * @private
     */
    Axis.prototype.calculateVisibleRange = function (size) {
        if (this.zoomFactor < 1 || this.zoomPosition > 0) {
            var baseRange = this.actualRange;
            var start = void 0;
            var end = void 0;
            if (!this.isInversed) {
                start = this.actualRange.min + this.zoomPosition * this.actualRange.delta;
                end = start + this.zoomFactor * this.actualRange.delta;
            }
            else {
                start = this.actualRange.max - (this.zoomPosition * this.actualRange.delta);
                end = start - (this.zoomFactor * this.actualRange.delta);
            }
            if (start < baseRange.min) {
                end = end + (baseRange.min - start);
                start = baseRange.min;
            }
            if (end > baseRange.max) {
                start = start - (end - baseRange.max);
                end = baseRange.max;
            }
            this.doubleRange = new DoubleRange(start, end);
            this.visibleRange = { min: this.doubleRange.start, max: this.doubleRange.end,
                delta: this.doubleRange.delta, interval: this.visibleRange.interval };
        }
    };
    /**
     * Calculate range for x and y axis after zoom.
     * @return {void}
     * @private
     */
    Axis.prototype.calculateAxisRange = function (size, chart) {
        if (chart.enableAutoIntervalOnBothAxis) {
            if (this.orientation === 'Horizontal' && chart.zoomSettings.mode === 'X') {
                for (var i = 0; i < this.series.length; i++) {
                    var yValue = [];
                    for (var _i = 0, _a = this.series[i].visiblePoints; _i < _a.length; _i++) {
                        var points = _a[_i];
                        if ((points.xValue > this.visibleRange.min) && (points.xValue < this.visibleRange.max)) {
                            yValue.push(points.yValue);
                        }
                    }
                    for (var _b = 0, _c = chart.axisCollections; _b < _c.length; _b++) {
                        var axis = _c[_b];
                        if (axis.orientation === 'Vertical' && !sf.base.isNullOrUndefined(axis.series[i])) {
                            axis.series[i].yMin = Math.min.apply(Math, yValue);
                            axis.series[i].yMax = Math.max.apply(Math, yValue);
                            axis.baseModule.calculateRangeAndInterval(size, axis);
                        }
                    }
                }
            }
            if (this.orientation === 'Vertical' && chart.zoomSettings.mode === 'Y') {
                for (var i = 0; i < this.series.length; i++) {
                    var xValue = [];
                    for (var _d = 0, _e = this.series[i].visiblePoints; _d < _e.length; _d++) {
                        var points = _e[_d];
                        if ((points.yValue > this.visibleRange.min) && (points.yValue < this.visibleRange.max)) {
                            xValue.push(points.xValue);
                        }
                    }
                    for (var _f = 0, _g = chart.axisCollections; _f < _g.length; _f++) {
                        var axis = _g[_f];
                        if (axis.orientation === 'Horizontal' && !sf.base.isNullOrUndefined(axis.series[i])) {
                            axis.series[i].xMin = Math.min.apply(Math, xValue);
                            axis.series[i].xMax = Math.max.apply(Math, xValue);
                            axis.baseModule.calculateRangeAndInterval(size, axis);
                        }
                    }
                }
            }
        }
    };
    /**
     * Triggers the event.
     * @return {void}
     * @private
     */
    Axis.prototype.triggerRangeRender = function (chart, minimum, maximum, interval) {
        var argsData;
        argsData = {
            cancel: false, name: axisRangeCalculated, axis: this,
            minimum: minimum, maximum: maximum, interval: interval
        };
        chart.trigger(axisRangeCalculated, argsData);
        if (!argsData.cancel) {
            this.visibleRange = { min: argsData.minimum, max: argsData.maximum, interval: argsData.interval,
                delta: argsData.maximum - argsData.minimum };
        }
    };
    /**
     * Calculate padding for the axis.
     * @return {string}
     * @private
     */
    Axis.prototype.getRangePadding = function (chart) {
        var padding = this.rangePadding;
        if (padding !== 'Auto') {
            return padding;
        }
        switch (this.orientation) {
            case 'Horizontal':
                if (chart.requireInvertedAxis) {
                    padding = (this.isStack100 || this.baseModule.chart.stockChart ? 'Round' : 'Normal');
                }
                else {
                    padding = 'None';
                }
                break;
            case 'Vertical':
                if (!chart.requireInvertedAxis) {
                    padding = (this.isStack100 || this.baseModule.chart.stockChart ? 'Round' : 'Normal');
                }
                else {
                    padding = 'None';
                }
                break;
        }
        return padding;
    };
    /**
     * Calculate maximum label width for the axis.
     * @return {void}
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    Axis.prototype.getMaxLabelWidth = function (chart) {
        var pointX;
        var previousEnd = 0;
        var isIntersect = false;
        var isAxisLabelBreak;
        this.angle = this.labelRotation;
        this.maxLabelSize = new sf.svgbase.Size(0, 0);
        var action = this.labelIntersectAction;
        var label;
        for (var i = 0, len = this.visibleLabels.length; i < len; i++) {
            label = this.visibleLabels[i];
            isAxisLabelBreak = isBreakLabel(label.originalText);
            if (isAxisLabelBreak) {
                label.size = sf.svgbase.measureText(label.originalText.replace(/<br>/g, ' '), this.labelStyle);
                label.breakLabelSize = sf.svgbase.measureText(this.enableTrim ? label.text.join('<br>') : label.originalText, this.labelStyle);
            }
            else {
                label.size = sf.svgbase.measureText(label.text, this.labelStyle);
            }
            var width = isAxisLabelBreak ? label.breakLabelSize.width : label.size.width;
            if (width > this.maxLabelSize.width) {
                this.maxLabelSize.width = width;
                this.rotatedLabel = label.text;
            }
            var height = isAxisLabelBreak ? label.breakLabelSize.height : label.size.height;
            if (height > this.maxLabelSize.height) {
                this.maxLabelSize.height = height;
            }
            if (isAxisLabelBreak) {
                label.text = this.enableTrim ? label.text : label.originalText.split('<br>');
            }
            if (action === 'None' || action === 'Hide' || action === 'Trim') {
                continue;
            }
            if ((action !== 'None' || this.angle % 360 === 0) && this.orientation === 'Horizontal' &&
                this.rect.width > 0 && !isIntersect) {
                var width1 = isAxisLabelBreak ? label.breakLabelSize.width : label.size.width;
                var height1 = isAxisLabelBreak ? label.breakLabelSize.height : label.size.height;
                pointX = (valueToCoefficient(label.value, this) * this.rect.width) + this.rect.x;
                pointX -= width1 / 2;
                if (this.edgeLabelPlacement === 'Shift') {
                    if (i === 0 && pointX < this.rect.x) {
                        pointX = this.rect.x;
                    }
                    if (i === this.visibleLabels.length - 1 && ((pointX + width1) > (this.rect.x + this.rect.width))) {
                        pointX = this.rect.x + this.rect.width - width1;
                    }
                }
                switch (action) {
                    case 'MultipleRows':
                        if (i > 0) {
                            this.findMultiRows(i, pointX, label, isAxisLabelBreak);
                        }
                        break;
                    case 'Rotate45':
                    case 'Rotate90':
                        if (i > 0 && (!this.isInversed ? pointX <= previousEnd : pointX + width1 >= previousEnd)) {
                            this.angle = (action === 'Rotate45') ? 45 : 90;
                            isIntersect = true;
                        }
                        break;
                    default:
                        if (isAxisLabelBreak) {
                            var result = void 0;
                            var result1 = [];
                            var str = void 0;
                            for (var index = 0; index < label.text.length; index++) {
                                result = textWrap(label.text[index], this.rect.width / this.visibleLabels.length, this.labelStyle);
                                if (result.length > 1) {
                                    for (var j = 0; j < result.length; j++) {
                                        str = result[j];
                                        result1.push(str);
                                    }
                                }
                                else {
                                    result1.push(result[0]);
                                }
                            }
                            label.text = result1;
                        }
                        else {
                            label.text = textWrap(label.text, this.rect.width / this.visibleLabels.length, this.labelStyle);
                        }
                        var height_1 = (height1 * label.text.length);
                        if (height_1 > this.maxLabelSize.height) {
                            this.maxLabelSize.height = height_1;
                        }
                        break;
                }
                previousEnd = this.isInversed ? pointX : pointX + width1;
            }
        }
        if (this.angle !== 0 && this.orientation === 'Horizontal') {
            //I264474: Fix for datasource bind im mounted console error ocurred
            this.rotatedLabel = sf.base.isNullOrUndefined(this.rotatedLabel) ? '' : this.rotatedLabel;
            if (isBreakLabel(this.rotatedLabel)) {
                this.maxLabelSize = sf.svgbase.measureText(this.rotatedLabel, this.labelStyle);
            }
            else {
                this.maxLabelSize = rotateTextSize(this.labelStyle, this.rotatedLabel, this.angle, chart);
            }
        }
        if (chart.multiLevelLabelModule && this.multiLevelLabels.length > 0) {
            chart.multiLevelLabelModule.getMultilevelLabelsHeight(this);
        }
    };
    /**
     * Finds the multiple rows for axis.
     * @return {void}
     */
    Axis.prototype.findMultiRows = function (length, currentX, currentLabel, isBreakLabels) {
        var label;
        var pointX;
        var width2;
        var store = [];
        var isMultiRows;
        for (var i = length - 1; i >= 0; i--) {
            label = this.visibleLabels[i];
            width2 = isBreakLabels ? label.breakLabelSize.width : label.size.width;
            pointX = (valueToCoefficient(label.value, this) * this.rect.width) + this.rect.x;
            isMultiRows = !this.isInversed ? currentX < (pointX + width2 * 0.5) :
                currentX + currentLabel.size.width > (pointX - width2 * 0.5);
            if (isMultiRows) {
                store.push(label.index);
                currentLabel.index = (currentLabel.index > label.index) ? currentLabel.index : label.index + 1;
            }
            else {
                currentLabel.index = store.indexOf(label.index) > -1 ? currentLabel.index : label.index;
            }
        }
        var height = ((isBreakLabels ? currentLabel.breakLabelSize.height : currentLabel.size.height) * currentLabel.index) +
            (5 * (currentLabel.index - 1));
        if (height > this.maxLabelSize.height) {
            this.maxLabelSize.height = height;
        }
    };
    /**
     * Finds the default module for axis.
     * @return {void}
     * @private
     */
    Axis.prototype.getModule = function (chart) {
        if (this.valueType === 'Double') {
            this.baseModule = new Double(chart);
        }
        else {
            this.baseModule = chart[firstToLowerCase(this.valueType) + 'Module'];
        }
    };
    __decorate$3([
        sf.base.Complex(Theme.axisLabelFont, Font)
    ], Axis.prototype, "labelStyle", void 0);
    __decorate$3([
        sf.base.Complex({}, CrosshairTooltip)
    ], Axis.prototype, "crosshairTooltip", void 0);
    __decorate$3([
        sf.base.Property('')
    ], Axis.prototype, "title", void 0);
    __decorate$3([
        sf.base.Complex(Theme.axisTitleFont, Font)
    ], Axis.prototype, "titleStyle", void 0);
    __decorate$3([
        sf.base.Property('')
    ], Axis.prototype, "labelFormat", void 0);
    __decorate$3([
        sf.base.Property('')
    ], Axis.prototype, "skeleton", void 0);
    __decorate$3([
        sf.base.Property('DateTime')
    ], Axis.prototype, "skeletonType", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "plotOffset", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "plotOffsetLeft", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "plotOffsetTop", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "plotOffsetRight", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "plotOffsetBottom", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], Axis.prototype, "isIndexed", void 0);
    __decorate$3([
        sf.base.Property(10)
    ], Axis.prototype, "logBase", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "columnIndex", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "rowIndex", void 0);
    __decorate$3([
        sf.base.Property(1)
    ], Axis.prototype, "span", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "desiredIntervals", void 0);
    __decorate$3([
        sf.base.Property(3)
    ], Axis.prototype, "maximumLabels", void 0);
    __decorate$3([
        sf.base.Property(1)
    ], Axis.prototype, "zoomFactor", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "zoomPosition", void 0);
    __decorate$3([
        sf.base.Property(true)
    ], Axis.prototype, "enableScrollbarOnZooming", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], Axis.prototype, "opposedPosition", void 0);
    __decorate$3([
        sf.base.Property(true)
    ], Axis.prototype, "enableAutoIntervalOnZooming", void 0);
    __decorate$3([
        sf.base.Property('Auto')
    ], Axis.prototype, "rangePadding", void 0);
    __decorate$3([
        sf.base.Property('Double')
    ], Axis.prototype, "valueType", void 0);
    __decorate$3([
        sf.base.Property('None')
    ], Axis.prototype, "edgeLabelPlacement", void 0);
    __decorate$3([
        sf.base.Property('Auto')
    ], Axis.prototype, "intervalType", void 0);
    __decorate$3([
        sf.base.Property('BetweenTicks')
    ], Axis.prototype, "labelPlacement", void 0);
    __decorate$3([
        sf.base.Property('Outside')
    ], Axis.prototype, "tickPosition", void 0);
    __decorate$3([
        sf.base.Property('Outside')
    ], Axis.prototype, "labelPosition", void 0);
    __decorate$3([
        sf.base.Property('')
    ], Axis.prototype, "name", void 0);
    __decorate$3([
        sf.base.Property(true)
    ], Axis.prototype, "visible", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "minorTicksPerInterval", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "labelRotation", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "crossesAt", void 0);
    __decorate$3([
        sf.base.Property(true)
    ], Axis.prototype, "placeNextToAxisLine", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "crossesInAxis", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "minimum", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "maximum", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "interval", void 0);
    __decorate$3([
        sf.base.Property(34)
    ], Axis.prototype, "maximumLabelWidth", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], Axis.prototype, "enableTrim", void 0);
    __decorate$3([
        sf.base.Property(5)
    ], Axis.prototype, "labelPadding", void 0);
    __decorate$3([
        sf.base.Complex({}, MajorTickLines)
    ], Axis.prototype, "majorTickLines", void 0);
    __decorate$3([
        sf.base.Complex({}, MinorTickLines)
    ], Axis.prototype, "minorTickLines", void 0);
    __decorate$3([
        sf.base.Complex({}, MajorGridLines)
    ], Axis.prototype, "majorGridLines", void 0);
    __decorate$3([
        sf.base.Complex({}, MinorGridLines)
    ], Axis.prototype, "minorGridLines", void 0);
    __decorate$3([
        sf.base.Complex({}, AxisLine)
    ], Axis.prototype, "lineStyle", void 0);
    __decorate$3([
        sf.base.Property('Trim')
    ], Axis.prototype, "labelIntersectAction", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], Axis.prototype, "isInversed", void 0);
    __decorate$3([
        sf.base.Property(100)
    ], Axis.prototype, "coefficient", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "startAngle", void 0);
    __decorate$3([
        sf.base.Property(true)
    ], Axis.prototype, "startFromZero", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "description", void 0);
    __decorate$3([
        sf.base.Property(2)
    ], Axis.prototype, "tabIndex", void 0);
    __decorate$3([
        sf.base.Collection([], StripLineSettings)
    ], Axis.prototype, "stripLines", void 0);
    __decorate$3([
        sf.base.Collection([], MultiLevelLabels)
    ], Axis.prototype, "multiLevelLabels", void 0);
    __decorate$3([
        sf.base.Complex({ color: null, width: 0, type: 'Rectangle' }, LabelBorder)
    ], Axis.prototype, "border", void 0);
    __decorate$3([
        sf.base.Complex({}, ScrollbarSettings)
    ], Axis.prototype, "scrollbarSettings", void 0);
    return Axis;
}(sf.base.ChildProperty));
/** @private */
var VisibleLabels = /** @class */ (function () {
    function VisibleLabels(text, value, labelStyle, originalText, size, breakLabelSize, index) {
        if (size === void 0) { size = new sf.svgbase.Size(0, 0); }
        if (breakLabelSize === void 0) { breakLabelSize = new sf.svgbase.Size(0, 0); }
        if (index === void 0) { index = 1; }
        this.text = text;
        this.originalText = originalText;
        this.value = value;
        this.labelStyle = labelStyle;
        this.size = size;
        this.breakLabelSize = breakLabelSize;
        this.index = 1;
    }
    return VisibleLabels;
}());

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
 * Function to sort the dataSource, by default it sort the data in ascending order.
 * @param  {Object} data
 * @param  {string} fields
 * @param  {boolean} isDescending
 * @returns Object
 */

/** @private */
function isBreakLabel(label) {
    return label.indexOf('<br>') !== -1;
}

/** @private */
function rotateTextSize(font, text, angle, chart) {
    var renderer = new sf.svgbase.SvgRenderer(chart.element.id);
    var box;
    var options;
    var htmlObject;
    options = {
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'transform': 'rotate(' + angle + ', 0, 0)',
        'text-anchor': 'middle'
    };
    htmlObject = renderer.createText(options, text);
    if (!chart.delayRedraw && !chart.redraw) {
        chart.element.appendChild(chart.svgObject);
    }
    chart.svgObject.appendChild(htmlObject);
    box = htmlObject.getBoundingClientRect();
    sf.base.remove(htmlObject);
    if (!chart.delayRedraw && !chart.redraw) {
        sf.base.remove(chart.svgObject);
    }
    return new sf.svgbase.Size((box.right - box.left), (box.bottom - box.top));
}
/** @private */

/** @private */
function logBase(value, base) {
    return Math.log(value) / Math.log(base);
}
/** @private */

/** @private */
function inside(value, range) {
    return (value < range.max) && (value > range.min);
}
/** @private */
function withIn(value, range) {
    return (value <= range.max) && (value >= range.min);
}
/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/**
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem
 *
 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @return true if there is any intersection between the 2 polygons, false otherwise
 */

/** @private */

/** @private */

/** @private */
function valueToCoefficient(value, axis) {
    var range = axis.visibleRange;
    var result = (value - range.min) / (range.delta);
    return axis.isInversed ? (1 - result) : result;
}
/** @private */

/**
 * method to find series, point index by element id
 * @private
 */

/** @private */

/** @private */

/** @private */

/** @private */

//Within bounds
/** @private */

/** @private */

/** @private */

/** @private */

/** @private */
function firstToLowerCase(str) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
}
/** @private */

/** @private */
function getMinPointsDelta(axis, seriesCollection) {
    var minDelta = Number.MAX_VALUE;
    var xValues;
    var minVal;
    var seriesMin;
    for (var index = 0; index < seriesCollection.length; index++) {
        var series = seriesCollection[index];
        xValues = [];
        if (series.visible &&
            (axis.name === series.xAxisName || (axis.name === 'primaryXAxis' && series.xAxisName === null)
                || (axis.name === series.chart.primaryXAxis.name && !series.xAxisName))) {
            xValues = series.points.map(function (point, index) {
                return point.xValue;
            });
            xValues.sort(function (first, second) { return first - second; });
            if (xValues.length === 1) {
                seriesMin = (axis.valueType === 'DateTime' && series.xMin === series.xMax) ? (series.xMin - 2592000000) : series.xMin;
                minVal = xValues[0] - (!sf.base.isNullOrUndefined(seriesMin) ?
                    seriesMin : axis.visibleRange.min);
                if (minVal !== 0) {
                    minDelta = Math.min(minDelta, minVal);
                }
            }
            else {
                for (var index_1 = 0; index_1 < xValues.length; index_1++) {
                    var value = xValues[index_1];
                    if (index_1 > 0 && value) {
                        minVal = value - xValues[index_1 - 1];
                        if (minVal !== 0) {
                            minDelta = Math.min(minDelta, minVal);
                        }
                    }
                }
            }
        }
    }
    if (minDelta === Number.MAX_VALUE) {
        minDelta = 1;
    }
    return minDelta;
}
/** @private */

/**
 * Animation Effect Calculation Started Here
 * @param currentTime
 * @param startValue
 * @param endValue
 * @param duration
 * @private
 */

/**
 * Animation Effect Calculation End
 * @private
 */

/**
 * Animate the rect element
 */

/**
 * Animation after legend click a path
 * @param element element to be animated
 * @param direction current direction of the path
 * @param previousDirection previous direction of the path
 */

/**
 * To append the clip rect element
 * @param redraw
 * @param options
 * @param renderer
 * @param clipPath
 */

/**
 * Triggers the event.
 * @return {void}
 * @private
 */
function triggerLabelRender(chart, tempInterval, text, labelStyle, axis) {
    var argsData;
    argsData = {
        cancel: false, name: axisLabelRender, axis: axis,
        text: text, value: tempInterval, labelStyle: labelStyle
    };
    chart.trigger(axisLabelRender, argsData);
    if (!argsData.cancel) {
        var isLineBreakLabels = argsData.text.indexOf('<br>') !== -1;
        var text_1 = (axis.enableTrim) ? (isLineBreakLabels ?
            lineBreakLabelTrim(axis.maximumLabelWidth, argsData.text, axis.labelStyle) :
            textTrim(axis.maximumLabelWidth, argsData.text, axis.labelStyle)) : argsData.text;
        axis.visibleLabels.push(new VisibleLabels(text_1, argsData.value, argsData.labelStyle, argsData.text));
    }
}
/**
 * The function used to find whether the range is set.
 * @return {boolean}
 * @private
 */
function setRange(axis) {
    return (axis.minimum != null && axis.maximum != null);
}
/**
 * Calculate desired interval for the axis.
 * @return {void}
 * @private
 */
function getActualDesiredIntervalsCount(availableSize, axis) {
    var size = axis.orientation === 'Horizontal' ? availableSize.width : availableSize.height;
    if (sf.base.isNullOrUndefined(axis.desiredIntervals)) {
        var desiredIntervalsCount = (axis.orientation === 'Horizontal' ? 0.533 : 1) * axis.maximumLabels;
        desiredIntervalsCount = Math.max((size * (desiredIntervalsCount / 100)), 1);
        return desiredIntervalsCount;
    }
    else {
        return axis.desiredIntervals;
    }
}
/**
 * Animation for template
 * @private
 */

/** @private */

/** @private */
// tslint:disable-next-line:max-func-body-length

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/**
 * Method to append child element
 * @param parent
 * @param childElement
 * @param isReplace
 */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */
// tslint:disable-next-line:max-func-body-length

/** @private */
function textTrim(maxWidth, text, font) {
    var label = text;
    var size = sf.svgbase.measureText(text, font).width;
    if (size > maxWidth) {
        var textLength = text.length;
        for (var i = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i) + '...';
            size = sf.svgbase.measureText(label, font).width;
            if (size <= maxWidth) {
                return label;
            }
        }
    }
    return label;
}
/**
 * To trim the line break label
 * @param maxWidth
 * @param text
 * @param font
 */
function lineBreakLabelTrim(maxWidth, text, font) {
    var labelCollection = [];
    var breakLabels = text.split('<br>');
    for (var i = 0; i < breakLabels.length; i++) {
        text = breakLabels[i];
        var size = sf.svgbase.measureText(text, font).width;
        if (size > maxWidth) {
            var textLength = text.length;
            for (var i_1 = textLength - 1; i_1 >= 0; --i_1) {
                text = text.substring(0, i_1) + '...';
                size = sf.svgbase.measureText(text, font).width;
                if (size <= maxWidth) {
                    labelCollection.push(text);
                    break;
                }
            }
        }
        else {
            labelCollection.push(text);
        }
    }
    return labelCollection;
}
/** @private */

/** @private */

/** @private */

/** @private */

/**
 * Method to calculate the width and height of the chart
 */


/**
 * To calculate chart title and height
 * @param title
 * @param style
 * @param width
 */

/**
 * Method to calculate x position of title
 */

/**
 * Method to find new text and element size based on textOverflow
 */
function textWrap(currentLabel, maximumWidth, font) {
    var textCollection = currentLabel.split(' ');
    var label = '';
    var labelCollection = [];
    var text;
    for (var i = 0, len = textCollection.length; i < len; i++) {
        text = textCollection[i];
        if (sf.svgbase.measureText(label.concat(text), font).width < maximumWidth) {
            label = label.concat((label === '' ? '' : ' ') + text);
        }
        else {
            if (label !== '') {
                labelCollection.push(textTrim(maximumWidth, label, font));
                label = text;
            }
            else {
                labelCollection.push(textTrim(maximumWidth, text, font));
                text = '';
            }
        }
        if (label && i === len - 1) {
            labelCollection.push(textTrim(maximumWidth, label, font));
        }
    }
    return labelCollection;
}
/**
 * Method to support the subscript and superscript value to text
 */

/**
 * Method to reset the blazor templates
 */

/** @private */
var RectOption$1 = /** @class */ (function (_super) {
    __extends$3(RectOption, _super);
    function RectOption(id, fill, border, opacity, rect, rx, ry, transform, dashArray) {
        var _this = _super.call(this, id, fill, border.width, border.color, opacity, dashArray) || this;
        _this.y = rect.y;
        _this.x = rect.x;
        _this.height = rect.height;
        _this.width = rect.width;
        _this.rx = rx ? rx : 0;
        _this.ry = ry ? ry : 0;
        _this.transform = transform ? transform : '';
        _this.stroke = (border.width !== 0 && _this.stroke !== '') ? border.color : 'transparent';
        return _this;
    }
    return RectOption;
}(sf.svgbase.PathOption));
/** @private */
var CircleOption$1 = /** @class */ (function (_super) {
    __extends$3(CircleOption, _super);
    function CircleOption(id, fill, border, opacity, cx, cy, r) {
        var _this = _super.call(this, id, fill, border.width, border.color, opacity) || this;
        _this.cy = cy;
        _this.cx = cx;
        _this.r = r;
        return _this;
    }
    return CircleOption;
}(sf.svgbase.PathOption));

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
 * Sparkline rendering calculation file
 */
var SparklineRenderer = /** @class */ (function () {
    /**
     * Sparkline data calculations
     * @param sparkline
     */
    function SparklineRenderer(sparkline) {
        this.sparkline = sparkline;
    }
    /**
     * To process the sparkline data
     */
    SparklineRenderer.prototype.processData = function () {
        var data = this.sparkline.dataSource;
        if (sf.base.isNullOrUndefined(data) || !data.length) {
            return;
        }
        else if (!isNaN(this.sparkline.dataSource[0]) || this.sparkline.valueType === 'Numeric') {
            data = (this.sparkline.enableRtl) ? data.reverse() : data;
            this.sparkline.sparklineData = data; // extend([], data) as Object[];
        }
        else {
            this['process' + this.sparkline.valueType]();
        }
        this.axisCalculation();
    };
    /* tslint:disable:no-string-literal */
    /* tslint:disable:no-eval */
    SparklineRenderer.prototype.processDataManager = function () {
        var _this = this;
        var dataModule;
        var queryModule;
        if (this.sparkline.dataSource instanceof sf.data.DataManager) {
            dataModule = this.sparkline.dataSource;
            queryModule = this.sparkline.query instanceof sf.data.Query ? this.sparkline.query : new sf.data.Query();
            var dataManager = dataModule.executeQuery(queryModule);
            dataManager.then(function (e) {
                _this.sparkline.setProperties({ dataSource: e['result'] }, true);
                _this.sparkline.sparklineData = _this.sparkline.dataSource;
                _this.sparkline.processSparklineData();
            });
        }
        else {
            this.sparkline.processSparklineData();
        }
    };
    /**
     * To process sparkline category data.
     */
    SparklineRenderer.prototype.processCategory = function (data, x, y) {
        var _this = this;
        if (data === void 0) { data = this.sparkline.dataSource; }
        if (x === void 0) { x = this.sparkline.xName; }
        if (y === void 0) { y = this.sparkline.yName; }
        var temp = [];
        var xValues = [];
        data.forEach(function (value, index) {
            if (xValues.indexOf(value[x]) === -1) {
                xValues.push(value[x]);
            }
            var currentData = {};
            currentData[_this.sparkline.xName] = xValues.indexOf(value[x]);
            currentData[_this.sparkline.yName] = value[y];
            temp.push(currentData);
        });
        this.sparkline.sparklineData = temp;
    };
    /**
     * To process sparkline DateTime data.
     */
    SparklineRenderer.prototype.processDateTime = function (data, x, y) {
        if (data === void 0) { data = this.sparkline.dataSource; }
        if (x === void 0) { x = this.sparkline.xName; }
        if (y === void 0) { y = this.sparkline.yName; }
        var temp = [];
        data.forEach(function (value, index) {
            var currentData = {};
            currentData[x] = value[x].getTime();
            currentData[y] = value[y];
            temp.push(currentData);
        });
        this.sparkline.sparklineData = temp;
    };
    /**
     * To render sparkline series.
     * @private
     */
    SparklineRenderer.prototype.renderSeries = function () {
        var _this = this;
        var spark = this.sparkline;
        this.clipId = spark.element.id + '_sparkline_clip_path';
        this.drawAxis();
        var argsData = {
            name: 'seriesRendering',
            cancel: false,
            lineWidth: spark.lineWidth,
            border: spark.border,
            fill: spark.fill,
            sparkline: !this.sparkline.isBlazor ? spark : null
        };
        var seriesRenderingSuccess = function (args) {
            if (!_this.visiblePoints || args.cancel) {
                return;
            }
            if (spark.type !== 'Pie' && spark.type !== 'WinLoss' && spark.rangeBandSettings.length) {
                var group = _this.sparkline.renderer.createGroup({ id: _this.sparkline.element.id + '_sparkline_rangeband_g' });
                for (var i = 0; i < spark.rangeBandSettings.length; i++) {
                    if ((spark.axisSettings.minY <= spark.rangeBandSettings[i].startRange) ||
                        (spark.axisSettings.maxY >= spark.rangeBandSettings[i].endRange)) {
                        _this.rangeBand(spark.rangeBandSettings[i], group, i);
                    }
                }
                _this.sparkline.svgObject.appendChild(group);
            }
            _this['render' + spark.type](_this.visiblePoints, args);
            _this.renderMarker(_this.visiblePoints);
            _this.renderLabel(_this.visiblePoints);
        };
        seriesRenderingSuccess.bind(this);
        spark.trigger('seriesRendering', argsData, seriesRenderingSuccess);
    };
    /**
     * To render a range band
     */
    SparklineRenderer.prototype.rangeBand = function (rangeBandSettings, group, index) {
        var model = this.sparkline;
        var height = (model.availableSize.height) - model.padding.top * 2;
        var width = (model.availableSize.width) - model.padding.left * 2;
        var stValue = rangeBandSettings.startRange;
        var edValue = rangeBandSettings.endRange;
        var stHeight = (height - ((height / this.unitY) * (stValue - this.min))) + model.padding.top;
        var edHeight = (height - ((height / this.unitY) * (edValue - this.min))) + model.padding.top;
        var color = rangeBandSettings.color || this.sparkline.sparkTheme.rangeBandColor;
        if (edHeight > (height + model.padding.top)) {
            edHeight = (height + model.padding.top);
        }
        else if (edHeight < (0 + model.padding.top)) {
            edHeight = (0 + model.padding.top);
        }
        if (stHeight > (height + model.padding.top)) {
            stHeight = (height + model.padding.top);
        }
        else if (stHeight < (0 + model.padding.top)) {
            stHeight = (0 + model.padding.top);
        }
        var path = 'M ' + (model.padding.left) + ' ' + stHeight + ' L ' + (width + (model.padding.left)) + ' ' + stHeight +
            ' L ' + (width + (model.padding.left)) + ' ' + edHeight + ' L ' + (model.padding.left) + ' ' + edHeight + ' Z ';
        var pathOption = {
            'id': model.element.id + '_rangeBand_' + index,
            'fill': color,
            'opacity': rangeBandSettings.opacity,
            'stroke': 'transparent',
            'stroke-width': model.lineWidth,
            'd': path,
            'stroke-dasharray': ''
        };
        drawPath(this.sparkline, pathOption, group);
    };
    /**
     * To render line series
     */
    SparklineRenderer.prototype.renderLine = function (points, args) {
        var spark = this.sparkline;
        var g = this.sparkline.renderer.createGroup({
            id: spark.element.id + '_sparkline_g',
            'clip-path': 'url(#' + this.clipId + ')'
        });
        var color = this.sparkline.fill;
        color = (this.sparkline.fill === '#00bdae' && this.sparkline.theme === 'Bootstrap4')
            ? this.sparkline.sparkTheme.axisLineColor : color;
        var pathOption = new PathOption$1(spark.element.id + '_sparkline_line', 'transparent', args.lineWidth, color, spark.opacity);
        var d = '';
        for (var i = 0, len = points.length; i < len; i++) {
            if (i === 0) {
                d = 'M ' + points[0].x + ' ' + points[i].y + ' ';
            }
            d += 'L ' + points[i].x + ' ' + points[i].y + ' ';
        }
        pathOption.d = d;
        drawPath(this.sparkline, pathOption, g);
        this.sparkline.svgObject.appendChild(g);
    };
    /**
     * To render pie series
     */
    /* tslint:disable:no-string-literal */
    SparklineRenderer.prototype.renderPie = function (points, args) {
        var spark = this.sparkline;
        var height = spark.availableSize.height - (spark.padding.top + spark.padding.bottom);
        var width = spark.availableSize.width - (spark.padding.left + spark.padding.right);
        var area = (height <= width) ? height / 2 : width / 2;
        var X = spark.availableSize.width / 2; // center position of x
        var Y = spark.availableSize.height / 2; // center position of y
        var deg = 0;
        var stRad;
        var edRad;
        var stroke = args.border.color;
        var opacity = spark.opacity;
        var strokeWidth = args.border.width;
        var colors = (spark.palette.length) ? spark.palette : ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883',
            '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb', '#ea7a57'];
        var group = this.sparkline.renderer.createGroup({ id: spark.element.id + '_sparkline_g' });
        var low;
        var high;
        var locations = sf.base.extend([], [], points);
        if (spark.highPointColor || spark.lowPointColor) {
            var pointsYvalues = locations.map(function (a) { return a.yVal; });
            low = Math.min.apply(null, pointsYvalues);
            high = Math.max.apply(null, pointsYvalues);
        }
        this.negativePointIndexes = [];
        for (var i = 0, stDeg = 90, edDeg = void 0, flag = void 0; i < points.length; i++) {
            stDeg += deg;
            deg = points[i]['degree'];
            edDeg = stDeg + deg;
            stRad = (stDeg - 90) * Math.PI / 180.0;
            edRad = (edDeg - 90) * Math.PI / 180.0;
            points[i]['stAng'] = stRad;
            points[i]['endAng'] = edRad;
            flag = (deg < 180) ? '0' : '1';
            var temp = points[i]['coordinates'] = {
                sX: X + (area * Math.cos(stRad)), sY: Y +
                    (area * Math.sin(stRad)), eX: X + (area * Math.cos(edRad)), eY: Y + (area * Math.sin(edRad))
            };
            var pathArc = 'M ' + X + ' ' + Y + ' L ' + temp['eX'] + ' ' + temp['eY'] + ' A ' + area + ' ' +
                area + ' 0 ' + flag + ',0 ' + temp['sX'] + ' ' + temp['sY'] + ' Z';
            var pathOption = {
                'id': spark.element.id + '_sparkline_pie_' + i,
                'opacity': opacity,
                'fill': colors[i % colors.length],
                'stroke': stroke,
                'stroke-width': strokeWidth,
                'd': pathArc,
                'stroke-dasharray': ''
            };
            this.getPieSpecialPoint(points[i], spark, pathOption, i, high, low, points.length);
            var pointArgs = this.triggerPointRender('pointRendering', i, pathOption.fill, { color: stroke, width: strokeWidth });
            pathOption.fill = pointArgs.fill;
            pathOption.stroke = pointArgs.border.color;
            pathOption['stroke-width'] = pointArgs.border.width;
            if (!pointArgs.cancel) {
                var element = drawPath(this.sparkline, pathOption, group);
                element.setAttribute('aria-label', spark.dataSource[i][spark.xName] + ' : ' + points[i].yVal);
            }
            var diffRadian = edRad - stRad;
            var mid = {
                x: X + ((area / 2) * Math.cos(stRad + (diffRadian / 2))),
                y: Y + ((area / 2) * Math.sin(stRad + (diffRadian / 2)))
            };
            points[i].location.x = mid.x;
            points[i].location.y = mid.y;
        }
        this.sparkline.svgObject.appendChild(group);
    };
    /**
     * To get special point color and option for Pie series.
     */
    SparklineRenderer.prototype.getPieSpecialPoint = function (temp, spark, option, i, high, low, length) {
        if (temp.yVal < 0 && spark.negativePointColor) {
            option.fill = spark.negativePointColor;
            this.negativePointIndexes.push(i);
        }
        if (i === 0 && spark.startPointColor) {
            option.fill = spark.startPointColor;
            this.startPointIndex = i;
        }
        else if ((i === (length - 1)) && spark.endPointColor) {
            option.fill = spark.endPointColor;
            this.endPointIndex = i;
        }
        if (temp.yVal === high && spark.highPointColor) {
            option.fill = spark.highPointColor;
            this.highPointIndex = i;
        }
        else if (temp.yVal === low && spark.lowPointColor) {
            option.fill = spark.lowPointColor;
            this.lowPointIndex = i;
        }
    };
    /**
     * To render area series
     */
    SparklineRenderer.prototype.renderArea = function (points, args) {
        var spark = this.sparkline;
        var group = this.sparkline.renderer.createGroup({
            id: spark.element.id + '_sparkline_g',
            'clip-path': 'url(#' + this.clipId + ')'
        });
        var pathOption = new PathOption$1(spark.element.id + '_sparkline_area', args.fill, 0, 'transparent', spark.opacity);
        var d = '';
        var str = '';
        for (var i = 0, len = points.length; i < len; i++) {
            if (i !== 0) {
                str += 'L ' + points[i].x + ' ' + points[i].y + ' ';
            }
            else {
                d = 'M ' + points[i].x + ' ' + this.axisHeight + ' ';
                str = 'M ' + points[i].x + ' ' + points[i].y + ' ';
            }
            d += 'L ' + points[i].x + ' ' + points[i].y + ' ';
            if (i === (len - 1)) {
                d += 'L ' + points[i].x + ' ' + this.axisHeight + ' Z';
            }
        }
        pathOption.d = d;
        drawPath(this.sparkline, pathOption, group);
        pathOption = new PathOption$1(spark.element.id + '_sparkline_area_str', 'transparent', args.border.width, args.border.color, spark.opacity, '', str);
        drawPath(this.sparkline, pathOption, group);
        this.sparkline.svgObject.appendChild(group);
    };
    /**
     * To render column series
     */
    SparklineRenderer.prototype.renderColumn = function (points, args) {
        var _this = this;
        var spark = this.sparkline;
        var locations = sf.base.extend([], [], points);
        var group = this.sparkline.renderer.createGroup({
            id: spark.element.id + '_sparkline_g',
            'clip-path': 'url(#' + this.clipId + ')'
        });
        var lowPos;
        var highPos;
        if (this.sparkline.highPointColor || this.sparkline.lowPointColor) {
            var pointsYPos = locations.map(function (a) { return a.markerPosition; });
            highPos = Math.min.apply(null, pointsYPos);
            lowPos = Math.max.apply(null, pointsYPos);
        }
        var id = spark.element.id + '_sparkline_column_';
        var rectOptions = new RectOption(id, '', args.border, spark.opacity, null);
        var paletteLength = spark.palette.length;
        var temp;
        var len = points.length;
        this.negativePointIndexes = [];
        var _loop_1 = function (i) {
            temp = points[i];
            rectOptions.id = id + i;
            rectOptions.fill = (paletteLength) ? spark.palette[i % paletteLength] : args.fill;
            rectOptions.rect = new Rect$1(temp.x, temp.y, temp.width, temp.height);
            this_1.getSpecialPoint(true, temp, spark, rectOptions, i, highPos, lowPos, len);
            temp.location.y = (temp.markerPosition <= this_1.axisHeight) ? temp.y : (temp.y + temp.height);
            temp.location.x = temp.x + (temp.width / 2);
            rectOptions.stroke = args.border.color ? (args.border.color) : rectOptions.fill;
            var pointArgs = {
                name: 'pointRendering', cancel: false, pointIndex: i, fill: rectOptions.fill,
                border: { color: rectOptions.stroke, width: args.border.width }
            };
            if (this_1.sparkline.isBlazor) {
                var blazorpointArgs = __rest(pointArgs, []);
                pointArgs = blazorpointArgs;
            }
            this_1.sparkline.trigger('pointRendering', pointArgs, function (eventArgs) {
                temp = points[i];
                rectOptions.id = id + i;
                rectOptions.rect = new Rect$1(temp.x, temp.y, temp.width, temp.height);
                _this.getSpecialPoint(true, temp, spark, rectOptions, i, highPos, lowPos, len);
                rectOptions.fill = pointArgs.fill;
                rectOptions.stroke = pointArgs.border.color;
                temp.location.y = (temp.markerPosition <= _this.axisHeight) ? temp.y : (temp.y + temp.height);
                rectOptions['stroke-width'] = pointArgs.border.width;
                temp.location.x = temp.x + (temp.width / 2);
                if (!pointArgs.cancel) {
                    var element = drawRectangle(spark, rectOptions, group);
                    element.setAttribute('aria-label', spark.dataSource[i][spark.xName] + ' : ' + points[i].yVal);
                    group.appendChild(element);
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < len; i++) {
            _loop_1(i);
        }
        this.sparkline.svgObject.appendChild(group);
    };
    /**
     * To render WinLoss series
     */
    SparklineRenderer.prototype.renderWinLoss = function (points, args) {
        var spark = this.sparkline;
        var group = this.sparkline.renderer.createGroup({
            id: spark.element.id + '_sparkline_g',
            'clip-path': 'url(#' + this.clipId + ')'
        });
        var id = spark.element.id + '_sparkline_winloss_';
        var options = new RectOption(id, '', args.border, spark.opacity, null);
        var temp;
        var len = points.length;
        var paletteLength = spark.palette.length;
        for (var i = 0; i < len; i++) {
            temp = points[i];
            options.id = id + i;
            options.fill = (paletteLength) ? spark.palette[i % paletteLength] : ((temp.yVal === this.axisValue) ?
                (this.sparkline.tiePointColor || '#a216f3') : ((temp.yVal > this.axisValue) ? args.fill :
                (spark.negativePointColor || '#e20f07')));
            options.stroke = (args.border.color) ? (args.border.color) : options.fill;
            options.rect = new Rect$1(temp.x, temp.y, temp.width, temp.height);
            temp.location.x = temp.x + (temp.width / 2);
            temp.location.y = (temp.yVal >= this.axisValue) ? (temp.y) : (temp.y + temp.height);
            var pointArgs = this.triggerPointRender('pointRendering', i, options.fill, { color: options.stroke, width: args.border.width });
            options.fill = pointArgs.fill;
            options.stroke = pointArgs.border.color;
            options['stroke-width'] = pointArgs.border.width;
            if (!pointArgs.cancel) {
                var element = drawRectangle(spark, options, group);
                element.setAttribute('aria-label', spark.dataSource[i][spark.xName] + ' : ' + points[i].yVal);
            }
        }
        this.sparkline.svgObject.appendChild(group);
    };
    SparklineRenderer.prototype.renderMarker = function (points) {
        var spark = this.sparkline;
        var marker = spark.markerSettings;
        if ((spark.type === 'Pie' || spark.type === 'WinLoss' || !marker.visible.length)) {
            return;
        }
        var locations = sf.base.extend([], [], points);
        var group = this.sparkline.renderer.createGroup({
            id: spark.element.id + '_sparkline_marker_g',
            'clip-path': 'url(#' + this.clipId + ')'
        });
        var temp;
        var id = spark.element.id + '_sparkline_marker_';
        var option = new CircleOption('', marker.fill, marker.border, marker.opacity, 0, 0, marker.size / 2, '');
        var highPos;
        var lowPos;
        var visible = marker.visible.join();
        if ((visible.toLowerCase().indexOf('high') > -1) || (visible.toLowerCase().indexOf('low') > -1)) {
            var pointsYPos = locations.map(function (a) { return a.markerPosition; });
            highPos = Math.min.apply(null, pointsYPos);
            lowPos = Math.max.apply(null, pointsYPos);
        }
        this.negativePointIndexes = [];
        var _loop_2 = function (i, length_1) {
            temp = points[i];
            option.id = id + i;
            option.cx = temp.location.x;
            option.cy = temp.location.y;
            option.fill = marker.fill;
            var render = (visible.toLowerCase().indexOf('all') > -1);
            render = this_2.getSpecialPoint(render, temp, spark, option, i, highPos, lowPos, length_1, visible.toLowerCase());
            option.stroke = marker.border.color || option.fill;
            var markerArgs = {
                name: 'markerRendering', cancel: false,
                border: { color: option.stroke, width: marker.border.width },
                fill: option.fill, pointIndex: i,
                sparkline: !this_2.sparkline.isBlazor ? this_2.sparkline : null,
                x: option.cx, y: option.cy, size: marker.size
            };
            if (this_2.sparkline.isBlazor) {
                var blazormarkerArgs = __rest(markerArgs, []);
                markerArgs = blazormarkerArgs;
            }
            this_2.sparkline.trigger('markerRendering', markerArgs, function (args) {
                if (render && !markerArgs.cancel) {
                    option.id = id + i;
                    option.cx = markerArgs.x;
                    option.cy = markerArgs.y;
                    option.fill = markerArgs.fill;
                    option.stroke = markerArgs.border.color;
                    option['stroke-width'] = markerArgs.border.width;
                    option.r = markerArgs.size / 2;
                    var element = drawCircle(spark, option, group);
                    element.setAttribute('aria-label', spark.dataSource[i][spark.xName] + ' : ' + points[i].yVal);
                    group.appendChild(element);
                }
            });
        };
        var this_2 = this;
        for (var i = 0, length_1 = points.length; i < length_1; i++) {
            _loop_2(i, length_1);
        }
        this.sparkline.svgObject.appendChild(group);
    };
    /**
     * To get special point color and option.
     */
    SparklineRenderer.prototype.getSpecialPoint = function (render, temp, spark, option, i, highPos, lowPos, length, visible) {
        if (visible === void 0) { visible = ''; }
        if (temp.markerPosition > this.axisHeight) {
            option.fill = spark.negativePointColor || option.fill;
            this.negativePointIndexes.push(i);
            render = render || (visible.indexOf('negative') > -1);
        }
        if (i === 0) {
            option.fill = spark.startPointColor || option.fill;
            this.startPointIndex = i;
            render = render || (visible.indexOf('start') > -1);
        }
        else if ((i === (length - 1))) {
            option.fill = spark.endPointColor || option.fill;
            this.endPointIndex = i;
            render = render || (visible.indexOf('end') > -1);
        }
        if (temp.markerPosition === highPos) {
            option.fill = spark.highPointColor || option.fill;
            this.highPointIndex = i;
            render = render || (visible.indexOf('high') > -1);
        }
        else if (temp.markerPosition === lowPos) {
            option.fill = spark.lowPointColor || option.fill;
            this.lowPointIndex = i;
            render = render || (visible.indexOf('low') > -1);
        }
        if (visible.indexOf('none') > -1) {
            render = false;
        }
        return render;
    };
    /**
     * To render data label for sparkline.
     */
    SparklineRenderer.prototype.renderLabel = function (points) {
        var _this = this;
        var spark = this.sparkline;
        var dataLabel = spark.dataLabelSettings;
        var color = dataLabel.textStyle.color || spark.sparkTheme.dataLabelColor;
        if ((spark.type === 'WinLoss' || !dataLabel.visible.length)) {
            return;
        }
        var locations = sf.base.extend([], [], points);
        var id = spark.element.id + '_sparkline_label_';
        var group = this.sparkline.renderer.createGroup({
            id: spark.element.id + '_sparkline_label_g',
            style: 'pointer-events: none;'
        });
        var g;
        var temp;
        var textId = id + 'text_';
        var rectId = id + 'rect_';
        var option = new TextOption$1('', 0, 0, 'middle', '', 'middle');
        var labelStyle = dataLabel.textStyle;
        var pointsYPos = locations.map(function (a) { return a.markerPosition; });
        var highPos = Math.min.apply(null, pointsYPos);
        var lowPos = Math.max.apply(null, pointsYPos);
        var space = 1;
        var padding = (dataLabel.fill !== 'transparent' || dataLabel.border.width) ? 2 : 0;
        var size = measureText$1('sparkline_measure_text', labelStyle);
        var rectOptions = new RectOption('', dataLabel.fill, dataLabel.border, dataLabel.opacity, null);
        var edgeLabelOption;
        labelStyle.fontFamily = spark.sparkTheme.labelFontFamily || labelStyle.fontFamily;
        var _loop_3 = function (i, length_2) {
            temp = points[i];
            option.id = textId + i;
            option.x = temp.location.x + dataLabel.offset.x;
            option.y = ((spark.type === 'Pie') ? temp.location.y : ((temp.markerPosition > this_3.axisHeight) ? (temp.location.y +
                (size.height / 2) + space + 2 + padding) : (temp.location.y - (size.height / 2) - space - padding))) + dataLabel.offset.y;
            option.text = (dataLabel.format !== '') ? this_3.formatter(dataLabel.format, this_3.sparkline.dataSource[i]) :
                temp.yVal.toString();
            var labelArgs = {
                name: 'dataLabelRendering', cancel: false,
                border: dataLabel.border, fill: dataLabel.fill, pointIndex: i,
                sparkline: !this_3.sparkline.isBlazor ? this_3.sparkline : null,
                x: option.x, y: option.y, text: option.text, color: color
            };
            if (this_3.sparkline.isBlazor) {
                var blazordataLabelArgs = __rest(labelArgs, []);
                labelArgs = blazordataLabelArgs;
            }
            this_3.sparkline.trigger('dataLabelRendering', labelArgs, function (args) {
                size = measureText$1(labelArgs.text, labelStyle);
                option.text = labelArgs.text;
                var renderLabel = (dataLabel.visible.join().toLowerCase().indexOf('all') > -1);
                renderLabel = _this.getLabelVisible(renderLabel, temp, i, dataLabel, length_2, highPos, lowPos);
                edgeLabelOption = _this.arrangeLabelPosition(dataLabel.edgeLabelMode, renderLabel, labelArgs.x, i, length_2, size, padding);
                if (renderLabel && !labelArgs.cancel && edgeLabelOption.render) {
                    rectOptions.id = rectId + i;
                    rectOptions.fill = labelArgs.fill;
                    rectOptions.stroke = labelArgs.border.color;
                    rectOptions['stroke-width'] = labelArgs.border.width;
                    option.y = labelArgs.y;
                    option.x = edgeLabelOption.x;
                    rectOptions.rect = new Rect$1(option.x - ((size.width / 2) + padding), (option.y - padding - (size.height / 1.75)), size.width + (padding * 2), size.height + (padding * 2));
                    g = _this.sparkline.renderer.createGroup({ id: id + 'g' + i });
                    drawRectangle(spark, rectOptions, g);
                    renderTextElement(option, labelStyle, labelArgs.color, g);
                    group.appendChild(g);
                }
            });
        };
        var this_3 = this;
        for (var i = 0, length_2 = points.length; i < length_2; i++) {
            _loop_3(i, length_2);
        }
        this.sparkline.svgObject.appendChild(group);
    };
    SparklineRenderer.prototype.arrangeLabelPosition = function (edgeLabel, render, x, index, length, size, padding) {
        if (edgeLabel === 'None') {
            return { x: x, render: render };
        }
        if (index === 0 && ((x - (size.width / 2) - padding) <= 0)) {
            if (edgeLabel === 'Hide') {
                render = false;
            }
            else {
                x = this.sparkline.padding.left + padding + (size.width / 2);
            }
        }
        else if (index === length - 1 && ((x + (size.width / 2) + padding) >= this.sparkline.availableSize.width)) {
            if (edgeLabel === 'Hide') {
                render = false;
            }
            else {
                x -= (size.width / 2 + padding);
            }
        }
        return { x: x, render: render };
    };
    /**
     * To get special point color and option.
     */
    SparklineRenderer.prototype.getLabelVisible = function (render, temp, i, label, length, highPos, lowPos) {
        var labelVisible = label.visible.join().toLowerCase();
        if (temp.markerPosition > this.axisHeight) {
            render = render || (labelVisible.indexOf('negative') > -1);
        }
        if (i === 0) {
            render = render || (labelVisible.indexOf('start') > -1);
        }
        else if ((i === (length - 1))) {
            render = render || (labelVisible.indexOf('end') > -1);
        }
        if (temp.markerPosition === highPos) {
            render = render || (labelVisible.indexOf('high') > -1);
        }
        else if (temp.markerPosition === lowPos) {
            render = render || (labelVisible.indexOf('low') > -1);
        }
        if (label.visible.join().toLowerCase().indexOf('none') > -1) {
            render = false;
        }
        return render;
    };
    /**
     * To format text
     */
    SparklineRenderer.prototype.formatter = function (format, data) {
        if (sf.base.isNullOrUndefined(format)) {
            return null;
        }
        var keys = Object.keys(data);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            format = format.split('${' + key + '}').join(data[key]);
        }
        return format;
    };
    /**
     * To calculate min max for x and y axis
     */
    SparklineRenderer.prototype.axisCalculation = function () {
        this.findRanges(this.sparkline.sparklineData);
    };
    /**
     * To find x axis interval.
     */
    SparklineRenderer.prototype.getInterval = function (data, x, type) {
        var interval = 1;
        var x1 = data[0][x];
        var x2 = sf.base.isNullOrUndefined(data[1]) ? undefined : data[1][x];
        if (!sf.base.isNullOrUndefined(x1) && !sf.base.isNullOrUndefined(x2)) {
            var temp = sf.base.extend([], data);
            var validData_1 = [];
            temp.forEach(function (value) {
                if (!sf.base.isNullOrUndefined(value[x])) {
                    validData_1.push(value);
                }
            });
            validData_1.sort(function (a, b) {
                if (sf.base.isNullOrUndefined(a[x]) || sf.base.isNullOrUndefined(b[x])) {
                    return 0;
                }
                return a[x] - b[x];
            });
            validData_1 = (this.sparkline.enableRtl) ? validData_1.reverse() : validData_1;
            interval = validData_1[1][x] - validData_1[0][x];
        }
        return interval;
    };
    /**
     * To find x axis interval.
     */
    SparklineRenderer.prototype.getPaddingInterval = function (data, x, type, delta) {
        var interval = 1;
        var size = this.sparkline.availableSize.height;
        var intervalCount = interval * data.length;
        intervalCount = Math.max((size * (intervalCount / 100)), 1);
        var niceInterval = delta / intervalCount;
        for (var _i = 0, _a = this.sparkline.intervalDivs; _i < _a.length; _i++) {
            var intervalVal = _a[_i];
            var currentInterval = interval * intervalVal;
            if (intervalCount < (delta / currentInterval)) {
                break;
            }
            niceInterval = currentInterval;
        }
        return niceInterval;
    };
    /**
     * To calculate axis ranges internally.
     */
    // tslint:disable-next-line:max-func-body-length
    SparklineRenderer.prototype.findRanges = function (data) {
        var model = this.sparkline;
        var max;
        var min;
        var minX;
        var maxX;
        var maxPointsLength = data.length;
        var temp;
        var sumofValues = 0;
        var isNumericArray = Array.isArray(data) && typeof data[0] !== 'object';
        if (isNumericArray) {
            if (model.type === 'Pie') {
                for (var i = 0; i < maxPointsLength; i++) {
                    sumofValues += Math.abs(data[i]);
                }
            }
            else {
                max = Math.max.apply(null, data);
                min = Math.min.apply(null, data);
                minX = 0;
                maxX = maxPointsLength - 1;
            }
        }
        else {
            if (model.type === 'Pie') {
                for (var i = 0; i < maxPointsLength; i++) {
                    sumofValues += Math.abs(data[i][model.yName]);
                }
            }
            else {
                if (sf.base.isNullOrUndefined(data[0][model.xName])) {
                    var x_1 = data.map(function (z) { return z[model.yName]; });
                    max = Math.max.apply(null, x_1);
                    min = Math.min.apply(null, x_1);
                }
                else {
                    temp = sf.base.extend([], data);
                    temp = temp.sort(function (a, b) { return a[model.yName] - b[model.yName]; });
                    max = temp[temp.length - 1][model.yName];
                    min = temp[0][model.yName];
                }
                if (!sf.base.isNullOrUndefined(data[0][model.xName])) {
                    temp = temp.sort(function (a, b) { return a[model.xName] - b[model.xName]; });
                    temp = (this.sparkline.enableRtl) ? temp.reverse() : temp;
                    maxX = temp[temp.length - 1][model.xName];
                    minX = temp[0][model.xName];
                }
                else {
                    minX = 0;
                    maxX = maxPointsLength - 1;
                }
            }
        }
        var y2;
        var height;
        var width;
        var x1 = 0;
        var y1;
        var padding = model.padding;
        var point;
        var axis = model.axisSettings;
        var value = axis.value;
        var theme = model.theme.toLowerCase();
        if (model.type !== 'Pie') {
            this.maxLength = maxPointsLength;
            height = model.availableSize.height - (padding.bottom + padding.top);
            width = model.availableSize.width - (padding.left + padding.right);
            maxX = sf.base.isNullOrUndefined(axis.maxX) ? maxX : axis.maxX;
            minX = sf.base.isNullOrUndefined(axis.minX) ? minX : axis.minX;
            max = sf.base.isNullOrUndefined(axis.maxY) ? max : axis.maxY;
            min = sf.base.isNullOrUndefined(axis.minY) ? min : axis.minY;
            var color = axis.lineSettings.color || this.sparkline.sparkTheme.axisLineColor;
            var eventArgs = {
                name: 'axisRendering', cancel: false, sparkline: !this.sparkline.isBlazor ? model : null,
                maxX: maxX, minX: minX, maxY: max, minY: min, value: axis.value,
                lineColor: color, lineWidth: axis.lineSettings.width
            };
            model.trigger('axisRendering', eventArgs);
            if (eventArgs.cancel) {
                this.visiblePoints = [];
                return;
            }
            maxX = eventArgs.maxX;
            minX = eventArgs.minX;
            max = eventArgs.maxY;
            min = eventArgs.minY;
            value = this.axisValue = eventArgs.value;
            this.axisColor = eventArgs.lineColor;
            this.axisWidth = eventArgs.lineWidth;
        }
        var unitX = maxX - minX;
        var unitY = max - min;
        unitX = (unitX === 0) ? 1 : unitX;
        unitY = (unitY === 0) ? 1 : unitY;
        this.unitX = unitX;
        this.unitY = unitY;
        this.min = min;
        x1 = 0;
        y1 = height - ((height / unitY) * (-min));
        y1 = (min < 0 && max <= 0) ? 0 : (min < 0 && max > 0) ? y1 : height;
        if (value >= min && value <= max) {
            y1 = height - Math.round(height * ((value - min) / this.unitY));
        }
        this.axisHeight = y1 + padding.top;
        var percent;
        var x;
        var y;
        var visiblePoints = [];
        var delta = max - min;
        var interval = this.getInterval(data, model.xName, model.valueType);
        var interVal = this.getPaddingInterval(data, model.xName, model.valueType, delta);
        for (var i = 0; i < maxPointsLength; i++) {
            if (sf.base.isNullOrUndefined(data[i][model.xName]) && sf.base.isNullOrUndefined(data[i][model.yName]) && ((data[i][model.yName]) !== 0)
                && isNumericArray) {
                x = i;
                y = data[i];
            }
            else if (sf.base.isNullOrUndefined(data[i][model.xName])) {
                x = i;
                y = data[i][model.yName];
            }
            else {
                x = data[i][model.xName];
                y = data[i][model.yName];
            }
            if (sf.base.isNullOrUndefined(x) || sf.base.isNullOrUndefined(y)) {
                continue;
            }
            if (model.type === 'Line' || model.type === 'Area') {
                y2 = (min !== max && maxPointsLength !== 1) ? height - Math.round(height * ((y - min) / this.unitY)) : padding.top;
                point = { x: (minX !== maxX) ? Math.round(width * ((x - minX) / this.unitX)) : width / 2, y: y2, markerPosition: y2 };
            }
            else if (model.type === 'Column' || model.type === 'WinLoss') {
                var colWidth = width / (((maxX - minX) / interval) + 1);
                var calSpace = 0.5;
                var space = (calSpace * 2); //calspace is default space for column and winloss
                colWidth -= (space);
                x1 = (((x - minX) / interval) * (colWidth + space)) + (space / 2);
                if (model.type === 'WinLoss') {
                    // win or gain column height half of the height , draw(zero) height factor
                    var winLossFactor = 0.5;
                    var drawHeightFactor = 40;
                    y2 = (y > value) ? (height / 4) : (y < value) ? (height * winLossFactor) :
                        ((height * winLossFactor) - (height / drawHeightFactor));
                    point = {
                        x: x1, y: y2, height: (y !== value) ? (height / 4) : height / 20, width: colWidth,
                        markerPosition: (y2 > y1) ? (y1 + Math.abs(y2 - y1)) : y2
                    };
                }
                else {
                    if (y === min && model.rangePadding === 'Additional' || y === max && model.rangePadding === 'Additional') {
                        min -= interVal + padding.top;
                        max += interVal + padding.top;
                        unitX = maxX - minX;
                        unitY = max - min;
                        unitX = (unitX === 0) ? 1 : unitX;
                        unitY = (unitY === 0) ? 1 : unitY;
                        this.unitX = unitX;
                        this.unitY = unitY;
                        this.min = min;
                    }
                    else if (y === min && model.rangePadding === 'Normal' || y === max && model.rangePadding === 'Normal') {
                        min -= interVal;
                        max += interVal;
                        unitX = maxX - minX;
                        unitY = max - min;
                        unitX = (unitX === 0) ? 1 : unitX;
                        unitY = (unitY === 0) ? 1 : unitY;
                        this.unitX = unitX;
                        this.unitY = unitY;
                        this.min = min;
                    }
                    var z = ((height / this.unitY) * (y - min));
                    var z1 = (y === min && y > value) ? ((maxPointsLength !== 1 && this.unitY !== 1) ?
                        (height / this.unitY) * (min / 2) : (z | 1)) :
                        (y === max && y < value && maxPointsLength !== 1 && this.unitY !== 1) ? (height / this.unitY) * (-max / 2) : z;
                    y2 = Math.abs(height - z1);
                    point = {
                        x: x1, y: (y2 > y1) ? y1 : y2, height: Math.abs(y2 - y1),
                        width: colWidth, markerPosition: (y2 > y1) ? (y1 + Math.abs(y2 - y1)) : y2
                    };
                }
            }
            else if (model.type === 'Pie') {
                percent = (Math.abs(y) / sumofValues) * 100;
                point = {
                    percent: percent, degree: ((Math.abs(y) / sumofValues) * 360)
                };
            }
            if (model.type !== 'Pie') {
                point.x += padding.left;
                point.y += padding.top;
            }
            if (model.type !== 'WinLoss') {
                point.markerPosition += padding.top;
            }
            point.location = { x: point.x, y: point.y };
            point.xVal = x;
            point.yVal = y;
            visiblePoints.push(point);
        }
        visiblePoints.sort(function (a, b) {
            return a.x - b.x;
        });
        this.visiblePoints = visiblePoints;
    };
    /**
     * To render the sparkline axis
     */
    SparklineRenderer.prototype.drawAxis = function () {
        var spark = this.sparkline;
        var height = this.axisHeight;
        if ((spark.type !== 'WinLoss') && (spark.type !== 'Pie') && spark.axisSettings.lineSettings.visible) {
            var xAxis = {
                'id': spark.element.id + '_Sparkline_XAxis',
                'x1': spark.padding.left, 'y1': height,
                'x2': spark.availableSize.width - spark.padding.right, 'y2': height,
                'stroke': this.axisColor,
                'opacity': spark.axisSettings.lineSettings.opacity,
                'stroke-dasharray': spark.axisSettings.lineSettings.dashArray,
                'stroke-width': this.axisWidth,
                'clip-path': 'url(#' + this.clipId + ')'
            };
            spark.svgObject.appendChild(spark.renderer.drawLine(xAxis));
        }
    };
    /**
     * To trigger point render event
     */
    SparklineRenderer.prototype.triggerPointRender = function (name, i, fill, border) {
        var args = {
            name: name, cancel: false,
            border: border, fill: fill,
            sparkline: !this.sparkline.isBlazor ? this.sparkline : null,
            pointIndex: i
        };
        this.sparkline.trigger(name, args);
        return args;
    };
    return SparklineRenderer;
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
//tslint:disable: no-duplicate-lines
/**
 * Represents the Sparkline control.
 * ```html
 * <div id="sparkline"/>
 * <script>
 *   var sparkline = new Sparkline();
 *   sparkline.appendTo("#sparkline");
 * </script>
 * ```
 */
var Sparkline = /** @class */ (function (_super) {
    __extends(Sparkline, _super);
    // Sparkline rendering starts from here.
    /**
     * Constructor for creating the Sparkline widget
     */
    function Sparkline(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @private */
        _this.isDevice = sf.base.Browser.isDevice;
        /** @private */
        _this.intervalDivs = [10, 5, 2, 1];
        return _this;
    }
    /**
     * Initializing pre-required values for sparkline.
     */
    Sparkline.prototype.preRender = function () {
        this.isBlazor = sf.base.isBlazor();
        this.allowServerDataBinding = false;
        this.unWireEvents();
        this.trigger('load', { sparkline: !this.isBlazor ? this : null });
        this.sparkTheme = getThemeColor(this.theme);
        this.sparklineRenderer = new SparklineRenderer(this);
        this.createSVG();
        this.wireEvents();
        this.setCulture();
    };
    /**
     * Sparkline Elements rendering starting.
     */
    Sparkline.prototype.render = function () {
        // Sparkline rendering splitted into rendering and calculations
        this.sparklineRenderer.processDataManager();
        this.renderComplete();
        this.allowServerDataBinding = true;
    };
    /**
     * @private
     */
    Sparkline.prototype.processSparklineData = function () {
        this.sparklineRenderer.processData();
        this.renderSparkline();
        this.element.appendChild(this.svgObject);
        this.setSecondaryElementPosition();
        this.trigger('loaded', { sparkline: !this.isBlazor ? this : null });
    };
    /**
     * To render sparkline elements
     */
    Sparkline.prototype.renderSparkline = function () {
        // To render the sparkline elements
        this.renderBorder();
        this.createDiv();
        this.sparklineRenderer.renderSeries();
    };
    /**
     * Create secondary element for the tooltip
     */
    Sparkline.prototype.createDiv = function () {
        var tooltipDiv = document.createElement('div');
        tooltipDiv.id = this.element.id + '_Secondary_Element';
        tooltipDiv.setAttribute('style', 'position: relative');
        this.element.appendChild(tooltipDiv);
        this.element.style.display = 'block';
        this.element.style.position = 'relative';
    };
    /**
     * To set the left and top position for data label template for sparkline
     */
    Sparkline.prototype.setSecondaryElementPosition = function () {
        var element = getIdElement(this.element.id + '_Secondary_Element');
        if (!element) {
            return;
        }
        var rect = this.element.getBoundingClientRect();
        var svgRect = getIdElement(this.element.id + '_svg').getBoundingClientRect();
        element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    };
    /**
     * @private
     * Render the sparkline border
     */
    Sparkline.prototype.renderBorder = function () {
        var width = this.containerArea.border.width;
        var borderRect;
        if (width > 0 || this.containerArea.background !== 'transparent') {
            borderRect = new RectOption(this.element.id + '_SparklineBorder', this.sparkTheme.background, this.containerArea.border, 1, new Rect$1(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(drawRectangle(this, borderRect));
        }
        // Used to create clip path sparkline
        var padding = this.padding;
        if (this.markerSettings.visible.length) {
            padding.left = 0;
            padding.right = 0;
            padding.bottom = 0;
            padding.top = 0;
        }
        borderRect = new RectOption(this.element.id + '_sparkline_clip_rect', 'transparent', { color: 'transparent', width: 0 }, 1, new Rect$1(padding.left, padding.top, this.availableSize.width - (padding.left + padding.right), this.availableSize.height - (padding.top + padding.bottom)));
        var clipPath = this.renderer.createClipPath({ id: this.element.id + '_sparkline_clip_path' });
        drawRectangle(this, borderRect, clipPath);
        this.svgObject.appendChild(clipPath);
    };
    /**
     * To create svg element for sparkline
     */
    Sparkline.prototype.createSVG = function () {
        this.removeSvg();
        createSvg(this);
    };
    /**
     * To Remove the Sparkline SVG object
     */
    Sparkline.prototype.removeSvg = function () {
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                sf.base.remove(this.svgObject);
            }
        }
        removeElement(this.element.id + '_Secondary_Element');
        if (this.sparklineTooltipModule) {
            this.sparklineTooltipModule.removeTooltipElements();
        }
    };
    /**
     * Method to set culture for sparkline
     */
    Sparkline.prototype.setCulture = function () {
        this.intl = new sf.base.Internationalization();
        this.localeObject = new sf.base.L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    };
    /**
     * To provide the array of modules needed for sparkline rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    Sparkline.prototype.requiredModules = function () {
        var modules = [];
        if (this.tooltipSettings.visible || this.tooltipSettings.trackLineSettings.visible) {
            modules.push({
                member: 'SparklineTooltip',
                args: [this]
            });
        }
        return modules;
    };
    /**
     * Method to unbind events for sparkline chart
     */
    Sparkline.prototype.unWireEvents = function () {
        var move = sf.base.Browser.touchMoveEvent;
        var cancel = sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */
        sf.base.EventHandler.remove(this.element, sf.base.Browser.touchMoveEvent, this.sparklineMove);
        sf.base.EventHandler.remove(this.element, cancel, this.sparklineMouseLeave);
        sf.base.EventHandler.remove(this.element, sf.base.Browser.touchEndEvent, this.sparklineMouseEnd);
        window.removeEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.sparklineResize);
    };
    /**
     * Method to bind events for the sparkline
     */
    Sparkline.prototype.wireEvents = function () {
        var cancel = sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchMoveEvent, this.sparklineMove, this);
        sf.base.EventHandler.add(this.element, 'click', this.sparklineClick, this);
        sf.base.EventHandler.add(this.element, cancel, this.sparklineMouseLeave, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchEndEvent, this.sparklineMouseEnd, this);
        window.addEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.sparklineResize.bind(this));
        new sf.base.Touch(this.element);
    };
    /**
     * Sparkline resize event.
     * @private
     */
    Sparkline.prototype.sparklineResize = function (e) {
        var _this = this;
        var args = {
            name: 'resize',
            previousSize: this.availableSize,
            sparkline: !this.isBlazor ? this : null,
            currentSize: new Size$1(0, 0)
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(function () {
            if (_this.isDestroyed) {
                clearTimeout(_this.resizeTo);
                return;
            }
            _this.unWireEvents();
            _this.createSVG();
            _this.refreshing = true;
            _this.wireEvents();
            args.currentSize = _this.availableSize;
            _this.trigger('resize', args);
            _this.render();
        }, 500);
        return false;
    };
    /**
     * Handles the mouse move on sparkline.
     * @return {boolean}
     * @private
     */
    Sparkline.prototype.sparklineMove = function (e) {
        this.setSparklineMouseXY(e);
        this.notify(sf.base.Browser.touchMoveEvent, e);
        var args = {
            name: 'sparklineMouseMove', cancel: false,
            sparkline: !this.isBlazor ? this : null, event: e
        };
        this.trigger(args.name, args);
        var pointClick = this.isPointRegion(e);
        if (pointClick.isPointRegion) {
            var pointArgs = {
                name: 'pointRegionMouseMove', cancel: false,
                event: e, sparkline: !this.isBlazor ? this : null,
                pointIndex: pointClick.pointIndex
            };
            this.trigger(pointArgs.name, pointArgs);
        }
        return false;
    };
    /**
     * Handles the mouse click on sparkline.
     * @return {boolean}
     * @private
     */
    Sparkline.prototype.sparklineClick = function (e) {
        this.setSparklineMouseXY(e);
        var args = {
            name: 'sparklineMouseClick', cancel: false,
            sparkline: !this.isBlazor ? this : null, event: e
        };
        this.trigger(args.name, args);
        var pointClick = this.isPointRegion(e);
        if (pointClick.isPointRegion) {
            var pointArgs = {
                name: 'pointRegionMouseClick', cancel: false,
                event: e, sparkline: !this.isBlazor ? this : null,
                pointIndex: pointClick.pointIndex
            };
            this.trigger(pointArgs.name, pointArgs);
        }
        return false;
    };
    /**
     * To check mouse event target is point region or not.
     */
    Sparkline.prototype.isPointRegion = function (e) {
        var _this = this;
        var startId = this.element.id + '_';
        var id = e.target.id.replace(startId, '').split('_');
        if (id[1] === this.type.toLowerCase()) {
            var index_1 = parseInt(id[2], 10);
            if ((sf.base.isNullOrUndefined(index_1) || isNaN(index_1)) && (this.type === 'Line' || this.type === 'Area')) {
                this.sparklineRenderer.visiblePoints.forEach(function (point, i) {
                    if (withInBounds(_this.mouseX, _this.mouseY, new Rect$1(point.x - 5, point.y - 5, 10, 10))) {
                        index_1 = i;
                        return;
                    }
                });
            }
            return { isPointRegion: true, pointIndex: index_1 };
        }
        return { isPointRegion: false, pointIndex: null };
    };
    /**
     * Handles the mouse end.
     * @return {boolean}
     * @private
     */
    Sparkline.prototype.sparklineMouseEnd = function (e) {
        this.setSparklineMouseXY(e);
        this.notify(sf.base.Browser.touchEndEvent, e);
        return false;
    };
    /**
     * Handles the mouse leave on sparkline.
     * @return {boolean}
     * @private
     */
    Sparkline.prototype.sparklineMouseLeave = function (e) {
        this.setSparklineMouseXY(e);
        this.notify(sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave', e);
        return false;
    };
    /**
     * Method to set mouse x, y from events
     */
    Sparkline.prototype.setSparklineMouseXY = function (e) {
        var pageY;
        var pageX;
        if (e.type.indexOf('touch') > -1) {
            this.isTouch = true;
            var touchArg = e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
        }
        else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
            pageY = e.clientY;
            pageX = e.clientX;
        }
        var rect = this.element.getBoundingClientRect();
        var svgRect = getIdElement(this.element.id + '_svg').getBoundingClientRect();
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    };
    /**
     * To change rendering while property value modified.
     * @private
     */
    Sparkline.prototype.onPropertyChanged = function (newProp, oldProp) {
        var render = false;
        var refresh = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'xName':
                case 'yName':
                case 'axisSettings':
                case 'rangeBandSettings':
                case 'type':
                case 'valueType':
                case 'enableRtl':
                    refresh = true;
                    break;
                case 'dataSource':
                    if (this.isBlazor) {
                        this.sparklineRenderer.processDataManager();
                        this.createSVG();
                        break;
                    }
                    refresh = true;
                    break;
                case 'border':
                case 'markerSettings':
                case 'dataLabelSettings':
                case 'tooltipSettings':
                case 'startPointColor':
                case 'highPointColor':
                case 'lowPointColor':
                case 'endPointColor':
                case 'negativePointColor':
                case 'theme':
                    render = true;
                    break;
            }
        }
        if (refresh) {
            this.createSVG();
            this.sparklineRenderer.processData();
            this.refreshSparkline();
        }
        else if (render) {
            this.createSVG();
            this.refreshSparkline();
        }
    };
    /**
     * To render sparkline series and appending.
     */
    Sparkline.prototype.refreshSparkline = function () {
        // Issue fix. React had native render method. So OnProperty change used render method won't wrok. 
        this.renderSparkline();
        this.element.appendChild(this.svgObject);
        this.setSecondaryElementPosition();
    };
    /**
     * Get component name
     */
    Sparkline.prototype.getModuleName = function () {
        return 'sparkline';
    };
    /**
     * Destroy the component
     */
    Sparkline.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    Sparkline.prototype.getPersistData = function () {
        return '';
    };
    __decorate([
        sf.base.Property(null)
    ], Sparkline.prototype, "width", void 0);
    __decorate([
        sf.base.Property(null)
    ], Sparkline.prototype, "height", void 0);
    __decorate([
        sf.base.Complex({}, SparklineBorder)
    ], Sparkline.prototype, "border", void 0);
    __decorate([
        sf.base.Property('Line')
    ], Sparkline.prototype, "type", void 0);
    __decorate([
        sf.base.Property('None')
    ], Sparkline.prototype, "rangePadding", void 0);
    __decorate([
        sf.base.Property(null)
    ], Sparkline.prototype, "dataSource", void 0);
    __decorate([
        sf.base.Property(null)
    ], Sparkline.prototype, "query", void 0);
    __decorate([
        sf.base.Property('Numeric')
    ], Sparkline.prototype, "valueType", void 0);
    __decorate([
        sf.base.Property(null)
    ], Sparkline.prototype, "xName", void 0);
    __decorate([
        sf.base.Property(null)
    ], Sparkline.prototype, "yName", void 0);
    __decorate([
        sf.base.Property('#00bdae')
    ], Sparkline.prototype, "fill", void 0);
    __decorate([
        sf.base.Property('')
    ], Sparkline.prototype, "highPointColor", void 0);
    __decorate([
        sf.base.Property('')
    ], Sparkline.prototype, "lowPointColor", void 0);
    __decorate([
        sf.base.Property('')
    ], Sparkline.prototype, "startPointColor", void 0);
    __decorate([
        sf.base.Property('')
    ], Sparkline.prototype, "endPointColor", void 0);
    __decorate([
        sf.base.Property('')
    ], Sparkline.prototype, "negativePointColor", void 0);
    __decorate([
        sf.base.Property('')
    ], Sparkline.prototype, "tiePointColor", void 0);
    __decorate([
        sf.base.Property([])
    ], Sparkline.prototype, "palette", void 0);
    __decorate([
        sf.base.Property(1)
    ], Sparkline.prototype, "lineWidth", void 0);
    __decorate([
        sf.base.Property(1)
    ], Sparkline.prototype, "opacity", void 0);
    __decorate([
        sf.base.Property(null)
    ], Sparkline.prototype, "format", void 0);
    __decorate([
        sf.base.Property(false)
    ], Sparkline.prototype, "useGroupingSeparator", void 0);
    __decorate([
        sf.base.Complex({}, SparklineTooltipSettings)
    ], Sparkline.prototype, "tooltipSettings", void 0);
    __decorate([
        sf.base.Complex({}, ContainerArea)
    ], Sparkline.prototype, "containerArea", void 0);
    __decorate([
        sf.base.Collection([], RangeBandSettings)
    ], Sparkline.prototype, "rangeBandSettings", void 0);
    __decorate([
        sf.base.Complex({}, AxisSettings)
    ], Sparkline.prototype, "axisSettings", void 0);
    __decorate([
        sf.base.Complex({}, SparklineMarkerSettings)
    ], Sparkline.prototype, "markerSettings", void 0);
    __decorate([
        sf.base.Complex({}, SparklineDataLabelSettings)
    ], Sparkline.prototype, "dataLabelSettings", void 0);
    __decorate([
        sf.base.Complex({}, Padding)
    ], Sparkline.prototype, "padding", void 0);
    __decorate([
        sf.base.Property('Material')
    ], Sparkline.prototype, "theme", void 0);
    __decorate([
        sf.base.Event()
    ], Sparkline.prototype, "loaded", void 0);
    __decorate([
        sf.base.Event()
    ], Sparkline.prototype, "load", void 0);
    __decorate([
        sf.base.Event()
    ], Sparkline.prototype, "tooltipInitialize", void 0);
    __decorate([
        sf.base.Event()
    ], Sparkline.prototype, "seriesRendering", void 0);
    __decorate([
        sf.base.Event()
    ], Sparkline.prototype, "axisRendering", void 0);
    __decorate([
        sf.base.Event()
    ], Sparkline.prototype, "pointRendering", void 0);
    __decorate([
        sf.base.Event()
    ], Sparkline.prototype, "pointRegionMouseMove", void 0);
    __decorate([
        sf.base.Event()
    ], Sparkline.prototype, "pointRegionMouseClick", void 0);
    __decorate([
        sf.base.Event()
    ], Sparkline.prototype, "sparklineMouseMove", void 0);
    __decorate([
        sf.base.Event()
    ], Sparkline.prototype, "sparklineMouseClick", void 0);
    __decorate([
        sf.base.Event()
    ], Sparkline.prototype, "dataLabelRendering", void 0);
    __decorate([
        sf.base.Event()
    ], Sparkline.prototype, "markerRendering", void 0);
    __decorate([
        sf.base.Event()
    ], Sparkline.prototype, "resize", void 0);
    Sparkline = __decorate([
        sf.base.NotifyPropertyChanges
    ], Sparkline);
    return Sparkline;
}(sf.base.Component));

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
 * Sparkline Tooltip Module
 */
var SparklineTooltip = /** @class */ (function () {
    function SparklineTooltip(sparkline) {
        this.sparkline = sparkline;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    SparklineTooltip.prototype.addEventListener = function () {
        if (this.sparkline.isDestroyed) {
            return;
        }
        // this.sparkline.on('mouseleave', this.mouseLeaveHandler, this);
        this.sparkline.on(sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave', this.mouseLeaveHandler, this);
        this.sparkline.on(sf.base.Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.sparkline.on(sf.base.Browser.touchEndEvent, this.mouseUpHandler, this);
    };
    SparklineTooltip.prototype.mouseLeaveHandler = function (e) {
        this.removeTooltipElements();
    };
    SparklineTooltip.prototype.mouseUpHandler = function (e) {
        if (!this.sparkline.isTouch) {
            return;
        }
        this.processTooltip(e);
        this.fadeOut();
    };
    SparklineTooltip.prototype.fadeOut = function () {
        clearTimeout(this.clearTooltip);
        this.clearTooltip = setTimeout(this.removeTooltipElements.bind(this), 5000);
    };
    /**
     * To remove tooltip and tracker elements.
     * @private
     */
    SparklineTooltip.prototype.removeTooltipElements = function () {
        this.removeTooltip();
        this.removeTracker();
    };
    SparklineTooltip.prototype.mouseMoveHandler = function (e) {
        this.processTooltip(e);
    };
    SparklineTooltip.prototype.processTooltip = function (e) {
        var pointIndex;
        var spark = this.sparkline;
        var visiblePoints = spark.sparklineRenderer.visiblePoints;
        var mouseX = spark.mouseX;
        var mouseY = spark.mouseY;
        if (spark.type !== 'Pie') {
            var locations = sf.base.extend([], [], visiblePoints);
            var trackerPositions = locations.map(function (point) { return point.location.x; });
            var temp = Infinity;
            var mousePosition = void 0;
            for (var i = 0, diff = void 0, len = trackerPositions.length; i < len; i++) {
                diff = Math.abs(mouseX - trackerPositions[i]);
                if (temp > diff) {
                    temp = diff;
                    mousePosition = trackerPositions[i];
                    pointIndex = i;
                }
            }
        }
        else {
            var target = e.target.id;
            pointIndex = parseInt(target.split('_pie_')[1], 10);
        }
        if (isNaN(pointIndex) || !withInBounds(mouseX, mouseY, new Rect$1(0, 0, spark.availableSize.width, spark.availableSize.height))) {
            this.removeTracker();
            this.removeTooltip();
            return;
        }
        if (this.pointIndex === pointIndex) {
            return;
        }
        this.pointIndex = pointIndex;
        this.renderTrackerLine(visiblePoints[pointIndex]);
        this.renderTooltip(visiblePoints[pointIndex]);
    };
    /**
     * To render tracker line
     */
    SparklineTooltip.prototype.renderTrackerLine = function (points) {
        var spark = this.sparkline;
        var theme = spark.theme.toLowerCase();
        var tracker = spark.tooltipSettings.trackLineSettings;
        var color = spark.sparkTheme.trackerLineColor ? spark.sparkTheme.trackerLineColor : tracker.color;
        if (!tracker.visible || spark.type === 'Pie') {
            return;
        }
        var group = getIdElement(spark.element.id + '_sparkline_tracker_g');
        if (sf.base.isNullOrUndefined(group)) {
            group = spark.renderer.createGroup({ id: spark.element.id + '_sparkline_tracker_g' });
            spark.svgObject.appendChild(group);
        }
        var pathEle = getIdElement(spark.element.id + '_sparkline_tracker');
        var d = 'M ' + points.location.x + ' ' + spark.padding.top + ' L ' + points.location.x + ' ' +
            (spark.availableSize.height - spark.padding.bottom);
        if (sf.base.isNullOrUndefined(pathEle)) {
            var pathOption = new PathOption$1(spark.element.id + '_sparkline_tracker', 'transparent', tracker.width, color, 1);
            pathOption.d = d;
            drawPath(spark, pathOption, group);
        }
        else {
            pathEle.setAttribute('d', d);
            pathEle.setAttribute('stroke-width', tracker.width.toString());
            pathEle.setAttribute('stroke', color);
        }
    };
    /**
     * To render line series
     */
    //ts-lint: disable
    SparklineTooltip.prototype.renderTooltip = function (points) {
        var _this = this;
        var spark = this.sparkline;
        var tooltip = spark.tooltipSettings;
        if (!tooltip.visible) {
            return;
        }
        var div = getIdElement(spark.element.id + '_sparkline_tooltip_div');
        if (sf.base.isNullOrUndefined(div)) {
            div = sf.base.createElement('div', {
                id: spark.element.id + '_sparkline_tooltip_div',
                styles: 'pointer-events: none; position: absolute;z-index:1;'
            });
            getIdElement(spark.element.id + '_Secondary_Element').appendChild(div);
        }
        var size = (spark.markerSettings.visible.length) ? spark.markerSettings.size : 0;
        var x = points.xVal.toString();
        if (spark.valueType === 'Category') {
            x = spark.dataSource[points.xVal][spark.xName];
        }
        else if (spark.valueType === 'DateTime') {
            x = new Date(points.xVal).toDateString();
        }
        var y = points.yVal.toString();
        var text = this.getFormat(spark.tooltipSettings.format, spark, x, this.formatValue(points.yVal, spark).toString());
        var location = { x: points.location.x, y: points.location.y };
        location = spark.type === 'Pie' ? { x: points.location.x, y: points.location.y } : location;
        var textColor = tooltip.textStyle.color || spark.sparkTheme.tooltipFontColor;
        var backgroundColor = tooltip.fill === '' ? spark.sparkTheme.tooltipFill : tooltip.fill;
        var tooltipEvent = {
            name: 'tooltipInitialize', cancel: false, text: text,
            textStyle: {
                size: tooltip.textStyle.size,
                opacity: spark.sparkTheme.tooltipTextOpacity || tooltip.textStyle.opacity,
                fontWeight: tooltip.textStyle.fontWeight,
                fontStyle: tooltip.textStyle.fontStyle,
                fontFamily: spark.sparkTheme.fontFamily || tooltip.textStyle.fontFamily,
                color: textColor
            }
        };
        if (spark.isBlazor) {
            var blazorTooltipArgs = __rest$1(tooltipEvent, []);
            tooltipEvent = blazorTooltipArgs;
        }
        spark.trigger('tooltipInitialize', tooltipEvent, function (eventArgs) {
            _this.addTooltip(tooltipEvent, spark, backgroundColor, tooltip, location, div);
        });
    };
    SparklineTooltip.prototype.addTooltip = function (tooltipEvent, spark, backgroundColor, tooltip, location, div, eventArgs) {
        var cancel;
        var tootipArgs;
        if (!sf.base.isNullOrUndefined(tooltipEvent)) {
            var c = tooltipEvent.cancel, otherArgs = __rest$1(tooltipEvent, ["cancel"]);
            cancel = c;
            tootipArgs = tooltipEvent;
        }
        else {
            cancel = eventArgs.cancel;
            tootipArgs = eventArgs;
        }
        if (tooltipEvent.cancel) {
            return;
        }
        var element = new sf.svgbase.Tooltip({
            content: tootipArgs.text,
            border: tooltip.border,
            template: tooltip.template,
            data: spark.dataSource[this.pointIndex],
            fill: backgroundColor,
            textStyle: tootipArgs.textStyle,
            enableAnimation: false,
            location: { x: location.x, y: location.y },
            shared: false,
            availableSize: this.sparkline.availableSize,
            areaBounds: new Rect$1(0, 0, spark.availableSize.width, spark.availableSize.height),
            theme: spark.theme,
            blazorTemplate: { name: 'TooltipTemplate', parent: spark.tooltipSettings }
        });
        element.opacity = spark.sparkTheme.tooltipFillOpacity || element.opacity;
        element.appendTo(div);
    };
    /**
     * To get tooltip format.
     */
    SparklineTooltip.prototype.getFormat = function (format, spark, x, y) {
        if (sf.base.isNullOrUndefined(format) || format === '') {
            return [y];
        }
        var text = format;
        text = text.split('${' + spark.xName + '}').join(x).split('${' + spark.yName + '}').join(y);
        return [text];
    };
    SparklineTooltip.prototype.formatValue = function (value, sparkline) {
        var formatValue;
        var formatFunction;
        if (sparkline.format && !isNaN(Number(value))) {
            formatFunction = sparkline.intl.getNumberFormat({ format: sparkline.format, useGrouping: sparkline.useGroupingSeparator });
            formatValue = formatFunction(value);
        }
        else {
            formatValue = value;
        }
        return formatValue;
    };
    /**
     * To remove tracker line.
     */
    SparklineTooltip.prototype.removeTracker = function () {
        var tracker = this.sparkline.element.querySelector('#' + this.sparkline.element.id + '_sparkline_tracker_g');
        return tracker ? sf.base.remove(tracker) : null;
    };
    /**
     * To remove tooltip element.
     */
    SparklineTooltip.prototype.removeTooltip = function () {
        this.pointIndex = null;
        var tooltip = this.sparkline.element.querySelector('#' + this.sparkline.element.id + '_sparkline_tooltip_div');
        return tooltip ? sf.base.remove(tooltip) : null;
    };
    /**
     * Get module name.
     */
    SparklineTooltip.prototype.getModuleName = function () {
        return 'SparklineTooltip';
    };
    /**
     * To destroy the tooltip.
     */
    SparklineTooltip.prototype.destroy = function (sparkline) {
        // To remove tooltip module
    };
    return SparklineTooltip;
}());

/**
 * Exporting all modules from Sparkline Component
 */

Sparkline.Inject(SparklineTooltip);

exports.Sparkline = Sparkline;
exports.SparklineTooltip = SparklineTooltip;
exports.SparklineBorder = SparklineBorder;
exports.SparklineFont = SparklineFont;
exports.TrackLineSettings = TrackLineSettings;
exports.SparklineTooltipSettings = SparklineTooltipSettings;
exports.ContainerArea = ContainerArea;
exports.LineSettings = LineSettings;
exports.RangeBandSettings = RangeBandSettings;
exports.AxisSettings = AxisSettings;
exports.Padding = Padding;
exports.SparklineMarkerSettings = SparklineMarkerSettings;
exports.LabelOffset = LabelOffset;
exports.SparklineDataLabelSettings = SparklineDataLabelSettings;

return exports;

});

    sf.charts = sf.base.extend({}, sf.charts, sfsparkline({}));