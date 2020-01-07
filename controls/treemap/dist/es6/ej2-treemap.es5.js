import { Ajax, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, NotifyPropertyChanges, Property, compile, createElement, extend, isBlazor, isNullOrUndefined, merge, print, remove, resetBlazorTemplate, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { SvgRenderer, Tooltip } from '@syncfusion/ej2-svg-base';
import { PdfBitmap, PdfDocument, PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { DataManager, Query } from '@syncfusion/ej2-data';

/**
 * TreeMap constants doc
 */
/**
 * Specifies TreeMap load event name.
 * @private
 */
var load = 'load';
/**
 * Specifies TreeMap loaded event name.
 * @private
 */
var loaded = 'loaded';
/**
 * Specifies TreeMap beforePrint event name.
 * @private
 */
var beforePrint = 'beforePrint';
/**
 * Specifies the itemRendering event name.
 * @private
 */
var itemRendering = 'itemRendering';
/**
 * Specifies the drilldown start event name.
 * @private
 */
var drillStart = 'drillStart';
/**
 * Specifies the drilldown end event name.
 * @private
 */
var drillEnd = 'drillEnd';
/**
 * Specifies the item selected event name.
 * @private
 */
var itemSelected = 'itemSelected';
/**
 * Specifies the item highlight event name.
 * @private
 */
var itemHighlight = 'itemHighlight';
/**
 * Specifies the tooltip rendering event name.
 * @private
 */
var tooltipRendering = 'tooltipRendering';
/**
 * Specifies the item click event name.
 * @private
 */
var itemClick = 'itemClick';
/**
 * Specifies the item move event name.
 * @private
 */
var itemMove = 'itemMove';
/**
 * Specifies the mouse click event name.
 * @private
 */
var click = 'click';
/**
 * Specifies maps double click event name.
 * @private
 */
var doubleClick = 'doubleClick';
/**
 * Specifies maps right click event name.
 * @private
 */
var rightClick = 'rightClick';
/**
 * Specifies the mouse move event name.
 * @private
 */
var mouseMove = 'mouseMove';
/**
 * Specifies legend item rendering event name.
 * @private
 */
var legendItemRendering = 'legendItemRendering';
/**
 * Specifies legend rendering event name.
 * @private
 */
var legendRendering = 'legendRendering';
/**
 * Specifies treemap resize event name.
 * @private
 */
var resize = 'resize';
/**
 * Specifies the font family
 * @private
 */
var defaultFont = 'Roboto, Segoe UI, Noto, Sans-serif';

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
 * Maps base doc
 */
var Border = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Border, _super);
    function Border() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property('#808080')
    ], Border.prototype, "color", void 0);
    __decorate$1([
        Property(0)
    ], Border.prototype, "width", void 0);
    return Border;
}(ChildProperty));
/**
 * Configures the treemap margin.
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
 * Configures the fonts in treemap.
 */
var Font = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Font, _super);
    function Font() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(null)
    ], Font.prototype, "size", void 0);
    __decorate$1([
        Property(null)
    ], Font.prototype, "color", void 0);
    __decorate$1([
        Property(defaultFont)
    ], Font.prototype, "fontFamily", void 0);
    __decorate$1([
        Property('Normal')
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
 * To configure title of the maps.
 */
var CommonTitleSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(CommonTitleSettings, _super);
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
    __extends$1(SubTitleSettings, _super);
    function SubTitleSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Complex({ size: '14px' }, Font)
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
    __extends$1(TitleSettings, _super);
    function TitleSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Complex({ size: '15px' }, Font)
    ], TitleSettings.prototype, "textStyle", void 0);
    __decorate$1([
        Property('Center')
    ], TitleSettings.prototype, "alignment", void 0);
    __decorate$1([
        Complex({}, SubTitleSettings)
    ], TitleSettings.prototype, "subtitleSettings", void 0);
    return TitleSettings;
}(CommonTitleSettings));
var ColorMapping = /** @__PURE__ @class */ (function (_super) {
    __extends$1(ColorMapping, _super);
    function ColorMapping() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(null)
    ], ColorMapping.prototype, "from", void 0);
    __decorate$1([
        Property(null)
    ], ColorMapping.prototype, "to", void 0);
    __decorate$1([
        Property(null)
    ], ColorMapping.prototype, "color", void 0);
    __decorate$1([
        Property(null)
    ], ColorMapping.prototype, "label", void 0);
    __decorate$1([
        Property(null)
    ], ColorMapping.prototype, "value", void 0);
    __decorate$1([
        Property(null)
    ], ColorMapping.prototype, "minOpacity", void 0);
    __decorate$1([
        Property(null)
    ], ColorMapping.prototype, "maxOpacity", void 0);
    __decorate$1([
        Property(true)
    ], ColorMapping.prototype, "showLegend", void 0);
    return ColorMapping;
}(ChildProperty));
/**
 * Configures the legend settings.
 */
var LegendSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(LegendSettings, _super);
    function LegendSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(false)
    ], LegendSettings.prototype, "visible", void 0);
    __decorate$1([
        Property('Default')
    ], LegendSettings.prototype, "mode", void 0);
    __decorate$1([
        Property('transparent')
    ], LegendSettings.prototype, "background", void 0);
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
        Complex({ size: '13px' }, Font)
    ], LegendSettings.prototype, "textStyle", void 0);
    __decorate$1([
        Property(null)
    ], LegendSettings.prototype, "fill", void 0);
    __decorate$1([
        Property(1)
    ], LegendSettings.prototype, "opacity", void 0);
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
        Property(null)
    ], LegendSettings.prototype, "imageUrl", void 0);
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
        Complex({ size: '14px' }, Font)
    ], LegendSettings.prototype, "titleStyle", void 0);
    __decorate$1([
        Property('Bottom')
    ], LegendSettings.prototype, "position", void 0);
    __decorate$1([
        Property('None')
    ], LegendSettings.prototype, "orientation", void 0);
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
        Property('Center')
    ], LegendSettings.prototype, "alignment", void 0);
    __decorate$1([
        Property({ x: 0, y: 0 })
    ], LegendSettings.prototype, "location", void 0);
    __decorate$1([
        Property(null)
    ], LegendSettings.prototype, "showLegendPath", void 0);
    __decorate$1([
        Property(null)
    ], LegendSettings.prototype, "valuePath", void 0);
    __decorate$1([
        Property(false)
    ], LegendSettings.prototype, "removeDuplicateLegend", void 0);
    return LegendSettings;
}(ChildProperty));
var InitialDrillSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(InitialDrillSettings, _super);
    function InitialDrillSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(null)
    ], InitialDrillSettings.prototype, "groupIndex", void 0);
    __decorate$1([
        Property(null)
    ], InitialDrillSettings.prototype, "groupName", void 0);
    return InitialDrillSettings;
}(ChildProperty));
var LeafItemSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(LeafItemSettings, _super);
    function LeafItemSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(null)
    ], LeafItemSettings.prototype, "fill", void 0);
    __decorate$1([
        Property(false)
    ], LeafItemSettings.prototype, "autoFill", void 0);
    __decorate$1([
        Complex({}, Border)
    ], LeafItemSettings.prototype, "border", void 0);
    __decorate$1([
        Property(0)
    ], LeafItemSettings.prototype, "gap", void 0);
    __decorate$1([
        Property(10)
    ], LeafItemSettings.prototype, "padding", void 0);
    __decorate$1([
        Property(1)
    ], LeafItemSettings.prototype, "opacity", void 0);
    __decorate$1([
        Property(true)
    ], LeafItemSettings.prototype, "showLabels", void 0);
    __decorate$1([
        Property(null)
    ], LeafItemSettings.prototype, "labelPath", void 0);
    __decorate$1([
        Property(null)
    ], LeafItemSettings.prototype, "labelFormat", void 0);
    __decorate$1([
        Property('TopLeft')
    ], LeafItemSettings.prototype, "labelPosition", void 0);
    __decorate$1([
        Complex({ color: null, size: '12px' }, Font)
    ], LeafItemSettings.prototype, "labelStyle", void 0);
    __decorate$1([
        Property(null)
    ], LeafItemSettings.prototype, "labelTemplate", void 0);
    __decorate$1([
        Property('Center')
    ], LeafItemSettings.prototype, "templatePosition", void 0);
    __decorate$1([
        Property('Trim')
    ], LeafItemSettings.prototype, "interSectAction", void 0);
    __decorate$1([
        Collection([], ColorMapping)
    ], LeafItemSettings.prototype, "colorMapping", void 0);
    return LeafItemSettings;
}(ChildProperty));
var TooltipSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(TooltipSettings, _super);
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
        Property(null)
    ], TooltipSettings.prototype, "format", void 0);
    __decorate$1([
        Property('#000816')
    ], TooltipSettings.prototype, "fill", void 0);
    __decorate$1([
        Property(0.75)
    ], TooltipSettings.prototype, "opacity", void 0);
    __decorate$1([
        Property(['Circle'])
    ], TooltipSettings.prototype, "markerShapes", void 0);
    __decorate$1([
        Complex({}, Border)
    ], TooltipSettings.prototype, "border", void 0);
    __decorate$1([
        Complex({ fontFamily: defaultFont, size: '13px' }, Font)
    ], TooltipSettings.prototype, "textStyle", void 0);
    return TooltipSettings;
}(ChildProperty));
var SelectionSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(SelectionSettings, _super);
    function SelectionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(false)
    ], SelectionSettings.prototype, "enable", void 0);
    __decorate$1([
        Property('#808080')
    ], SelectionSettings.prototype, "fill", void 0);
    __decorate$1([
        Property('0.5')
    ], SelectionSettings.prototype, "opacity", void 0);
    __decorate$1([
        Complex({}, Border)
    ], SelectionSettings.prototype, "border", void 0);
    __decorate$1([
        Property('Item')
    ], SelectionSettings.prototype, "mode", void 0);
    return SelectionSettings;
}(ChildProperty));
var HighlightSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(HighlightSettings, _super);
    function HighlightSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(false)
    ], HighlightSettings.prototype, "enable", void 0);
    __decorate$1([
        Property('#808080')
    ], HighlightSettings.prototype, "fill", void 0);
    __decorate$1([
        Property('0.5')
    ], HighlightSettings.prototype, "opacity", void 0);
    __decorate$1([
        Complex({}, Border)
    ], HighlightSettings.prototype, "border", void 0);
    __decorate$1([
        Property('Item')
    ], HighlightSettings.prototype, "mode", void 0);
    return HighlightSettings;
}(ChildProperty));
/**
 * Options for customizing the tree map levels.
 */
var LevelSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(LevelSettings, _super);
    function LevelSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property(null)
    ], LevelSettings.prototype, "groupPath", void 0);
    __decorate$1([
        Property(0)
    ], LevelSettings.prototype, "groupGap", void 0);
    __decorate$1([
        Property(10)
    ], LevelSettings.prototype, "groupPadding", void 0);
    __decorate$1([
        Complex({}, Border)
    ], LevelSettings.prototype, "border", void 0);
    __decorate$1([
        Property(null)
    ], LevelSettings.prototype, "fill", void 0);
    __decorate$1([
        Property(false)
    ], LevelSettings.prototype, "autoFill", void 0);
    __decorate$1([
        Property(1)
    ], LevelSettings.prototype, "opacity", void 0);
    __decorate$1([
        Property(true)
    ], LevelSettings.prototype, "showHeader", void 0);
    __decorate$1([
        Property(20)
    ], LevelSettings.prototype, "headerHeight", void 0);
    __decorate$1([
        Property(null)
    ], LevelSettings.prototype, "headerTemplate", void 0);
    __decorate$1([
        Property(null)
    ], LevelSettings.prototype, "headerFormat", void 0);
    __decorate$1([
        Property('Near')
    ], LevelSettings.prototype, "headerAlignment", void 0);
    __decorate$1([
        Complex({ color: null, size: '13px' }, Font)
    ], LevelSettings.prototype, "headerStyle", void 0);
    __decorate$1([
        Property('TopLeft')
    ], LevelSettings.prototype, "templatePosition", void 0);
    __decorate$1([
        Collection([], ColorMapping)
    ], LevelSettings.prototype, "colorMapping", void 0);
    return LevelSettings;
}(ChildProperty));

/**
 * Create the class for size
 */
var Size = /** @__PURE__ @class */ (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    return Size;
}());
function stringToNumber(value, containerSize) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
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
 * Internal use of rectangle options
 * @private
 */
var RectOption = /** @__PURE__ @class */ (function () {
    function RectOption(id, fill, border, opacity, rect, dashArray) {
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height;
        this.width = rect.width;
        this.id = id;
        this.fill = fill;
        this.opacity = opacity;
        this.stroke = border.color;
        this['stroke-width'] = border.width;
        this['stroke-dasharray'] = dashArray;
    }
    return RectOption;
}());
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
/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {FontModel} font
 * @param  {string} id
 * @returns no
 * @private
 */
function measureText(text, font) {
    var measureObject = document.getElementById('treeMapMeasureText');
    if (measureObject === null) {
        measureObject = createElement('text', { id: 'treeMapMeasureText' });
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
    function TextOption(id, x, y, anchor, text, transform, baseLine, connectorText) {
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
        this.connectorText = connectorText;
    }
    return TextOption;
}());
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
 * Map internal class for Point
 */
var Location = /** @__PURE__ @class */ (function () {
    function Location(x, y) {
        this.x = x;
        this.y = y;
    }
    return Location;
}());
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
    return new Location(x, y);
}
function createTextStyle(renderer, renderOptions, text) {
    var htmlObject;
    htmlObject = renderer.createText(renderOptions, text);
    htmlObject.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
    htmlObject.style['user-select'] = 'none';
    htmlObject.style['-moz-user-select'] = 'none';
    htmlObject.style['-webkit-touch-callout'] = 'none';
    htmlObject.style['-webkit-user-select'] = 'none';
    htmlObject.style['-khtml-user-select'] = 'none';
    htmlObject.style['-ms-user-select'] = 'none';
    htmlObject.style['-o-user-select'] = 'none';
    return htmlObject;
}
/**
 * Internal rendering of text
 * @private
 */
/* tslint:disable:no-string-literal */
function renderTextElement(options, font, color, parent, isMinus) {
    if (isMinus === void 0) { isMinus = false; }
    var renderOptions = {
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'text-anchor': options.anchor,
        'transform': options.transform,
        'opacity': font.opacity,
        'dominant-baseline': options.baseLine,
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'fill': color
    };
    var text = typeof options.text === 'string' ? options.text : isMinus ? options.text[options.text.length - 1] : options.text[0];
    var tspanElement;
    var renderer = new SvgRenderer('');
    var height;
    var htmlObject;
    var breadCrumbText = !isNullOrUndefined(text) && !isNullOrUndefined(options.connectorText) ?
        (text.search(options.connectorText[1]) >= 0) : false;
    if (breadCrumbText) {
        var drilledLabel = text;
        var drillLevelText = void 0;
        var spacing = 5;
        drillLevelText = drilledLabel.split('#');
        for (var z = 0; z < drillLevelText.length; z++) {
            var drillText = (drillLevelText[z].search(options.connectorText) !== -1 && !isNullOrUndefined(options.connectorText)) ?
                options.connectorText : drillLevelText[z];
            renderOptions['id'] = options.id + '_' + z;
            htmlObject = createTextStyle(renderer, renderOptions, drillText);
            if (z % 2 === 0 && z !== 0) {
                var re = /\s+/g;
                drillText = drillText.replace(re, '&nbsp');
            }
            var size = measureText(drillText, font);
            renderOptions['x'] = z !== 0 ? renderOptions['x'] + size.width : renderOptions['x'] + size.width + spacing;
            parent.appendChild(htmlObject);
        }
    }
    else {
        htmlObject = createTextStyle(renderer, renderOptions, text);
        parent.appendChild(htmlObject);
    }
    if (typeof options.text !== 'string' && options.text.length > 1) {
        for (var i = 1, len = options.text.length; i < len; i++) {
            height = (measureText(options.text[i], font).height);
            tspanElement = renderer.createTSpan({
                'x': options.x, 'id': options.id,
                'y': (options.y) + (i * height)
            }, options.text[i]);
            htmlObject.appendChild(tspanElement);
        }
        parent.appendChild(htmlObject);
    }
    return htmlObject;
}
function getElement(id) {
    return document.getElementById(id);
}
/* tslint:disable:no-string-literal */
function itemsToOrder(a, b) {
    return a['weight'] === b['weight'] ? 0 : a['weight'] < b['weight'] ? 1 : -1;
}
function isContainsData(source, pathName, processData, treemap) {
    var isExist = false;
    var name = '';
    var path;
    var leaf = treemap.leafItemSettings;
    for (var i = 0; i < source.length; i++) {
        path = treemap.levels[i] ? treemap.levels[i].groupPath : leaf.labelPath ? leaf.labelPath : treemap.weightValuePath;
        if (source[i] === processData[path]) {
            name += (processData[path]) + (i === source.length - 1 ? '' : '#');
            if (name === pathName) {
                isExist = true;
                break;
            }
        }
    }
    return isExist;
}
function findChildren(data) {
    var children;
    if (data) {
        var keys = Object.keys(data);
        children = new Object();
        for (var i = 0; i < keys.length; i++) {
            if (data[keys[i]] instanceof Array) {
                children['values'] = data[keys[i]];
                children['key'] = keys[i];
                break;
            }
        }
    }
    return children;
}
function findHightLightItems(data, items, mode, treeMap) {
    if (mode === 'Child') {
        items.push(data['levelOrderName']);
        var children = findChildren(data)['values'];
        if (children && children.length > 0) {
            for (var i = 0; i < children.length; i++) {
                if (items.indexOf(children[i]['levelOrderName']) === -1) {
                    items.push(children[i]['levelOrderName']);
                }
            }
            for (var j = 0; j < children.length; j++) {
                findHightLightItems(children[j], items, mode, treeMap);
            }
        }
    }
    else if (mode === 'Parent') {
        if (typeof data['levelOrderName'] === 'string' && items.indexOf(data['levelOrderName']) === -1) {
            items.push(data['levelOrderName']);
            findHightLightItems(data['parent'], items, mode, treeMap);
        }
    }
    else if (mode === 'All') {
        var parentName = data['levelOrderName'].split('#')[0];
        var currentItem = void 0;
        for (var i = 0; i < treeMap.layout.renderItems.length; i++) {
            currentItem = treeMap.layout.renderItems[i];
            if ((currentItem['levelOrderName']).indexOf(parentName) > -1 && items.indexOf(currentItem['levelOrderName']) === -1) {
                items.push(currentItem['levelOrderName']);
            }
        }
    }
    else {
        items.push(data['levelOrderName']);
    }
    return items;
}
/**
 * Function to compile the template function for maps.
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
 * @private
 */
function convertElement(element, labelId, data) {
    var childElement = createElement('div', {
        id: labelId,
        styles: 'position: absolute;pointer-events: auto;'
    });
    var elementLength = element.length;
    while (elementLength > 0) {
        childElement.appendChild(element[0]);
        elementLength--;
    }
    var templateHtml = childElement.innerHTML;
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        templateHtml = templateHtml.replace(new RegExp('{{:' + keys[i] + '}}', 'g'), data[keys[i].toString()]);
    }
    childElement.innerHTML = templateHtml;
    return childElement;
}
function findLabelLocation(rect, position, labelSize, type, treemap) {
    var location = new Location(0, 0);
    var padding = 5;
    var paddings = 2;
    var elementRect = treemap.element.getBoundingClientRect();
    var x = (type === 'Template') ? treemap.areaRect.x : 0;
    var y = (type === 'Template') ? treemap.areaRect.y : 0;
    location.x = (Math.abs(x - ((position.indexOf('Left') > -1) ? rect.x + padding : !(position.indexOf('Right') > -1) ?
        rect.x + ((rect.width / 2) - (labelSize.width / 2)) : (rect.x + rect.width) - labelSize.width))) - paddings;
    if (treemap.enableDrillDown && (treemap.renderDirection === 'BottomLeftTopRight'
        || treemap.renderDirection === 'BottomRightTopLeft')) {
        location.y = Math.abs((rect.y + rect.height) - labelSize.height + padding);
    }
    else {
        location.y = Math.abs(y - ((position.indexOf('Top') > -1) ? (type === 'Template' ? rect.y : rect.y + labelSize.height) :
            !(position.indexOf('Bottom') > -1) ? type === 'Template' ? (rect.y + ((rect.height / 2) - (labelSize.height / 2))) :
                (rect.y + (rect.height / 2) + labelSize.height / 4) : (rect.y + rect.height) - labelSize.height));
    }
    return location;
}
function measureElement(element, parentElement) {
    var size = new Size(0, 0);
    parentElement.appendChild(element);
    size.height = element.offsetHeight;
    size.width = element.offsetWidth;
    var measureElementId = document.getElementById(element.id);
    measureElementId.parentNode.removeChild(measureElementId);
    return size;
}
function getArea(rect) {
    return (rect.width - rect.x) * (rect.height - rect.y);
}
function getShortestEdge(input) {
    var container = convertToContainer(input);
    var width = container.width;
    var height = container.height;
    var result = Math.min(width, height);
    return result;
}
function convertToContainer(rect) {
    var x = rect.x;
    var y = rect.y;
    var width = rect.width;
    var height = rect.height;
    return {
        x: x,
        y: y,
        width: width - x,
        height: height - y
    };
}
function convertToRect(container) {
    var xOffset = container.x;
    var yOffset = container.y;
    var width = container.width;
    var height = container.height;
    return {
        x: xOffset,
        y: yOffset,
        width: xOffset + width,
        height: yOffset + height,
    };
}
function getMousePosition(pageX, pageY, element) {
    var elementRect = element.getBoundingClientRect();
    var pageXOffset = element.ownerDocument.defaultView.pageXOffset;
    var pageYOffset = element.ownerDocument.defaultView.pageYOffset;
    var clientTop = element.ownerDocument.documentElement.clientTop;
    var clientLeft = element.ownerDocument.documentElement.clientLeft;
    var positionX = elementRect.left + pageXOffset - clientLeft;
    var positionY = elementRect.top + pageYOffset - clientTop;
    return new Location((pageX - positionX), (pageY - positionY));
}
function colorMap(colorMapping, equalValue, value, weightValuePath) {
    var fill;
    var paths = [];
    var opacity;
    if (isNullOrUndefined(equalValue) && (isNullOrUndefined(value) && isNaN(value))) {
        return null;
    }
    for (var i = 0; i < colorMapping.length; i++) {
        var isEqualColor = false;
        var dataValue = value;
        if (!isNullOrUndefined(colorMapping[i].from) && !isNullOrUndefined(colorMapping[i].to)
            && !isNullOrUndefined(colorMapping[i].value)) {
            if ((value >= colorMapping[i].from && colorMapping[i].to >= value) && (colorMapping[i].value === equalValue)) {
                isEqualColor = true;
                if (Object.prototype.toString.call(colorMapping[i].color) === '[object Array]') {
                    fill = !isEqualColor ? colorCollections(colorMapping[i], dataValue) : colorMapping[i].color[0];
                }
                else {
                    fill = colorMapping[i].color;
                }
            }
        }
        else if ((!isNullOrUndefined(colorMapping[i].from) && !isNullOrUndefined(colorMapping[i].to))
            || !isNullOrUndefined((colorMapping[i].value))) {
            if ((value >= colorMapping[i].from && colorMapping[i].to >= value) || (colorMapping[i].value === equalValue)) {
                if (colorMapping[i].value === equalValue) {
                    isEqualColor = true;
                }
                if (Object.prototype.toString.call(colorMapping[i].color) === '[object Array]') {
                    fill = !isEqualColor ? colorCollections(colorMapping[i], dataValue) : colorMapping[i].color[0];
                }
                else {
                    fill = colorMapping[i].color;
                }
            }
        }
        if (((value >= colorMapping[i].from && value <= colorMapping[i].to) || (colorMapping[i].value === equalValue))
            && !isNullOrUndefined(colorMapping[i].minOpacity) && !isNullOrUndefined(colorMapping[i].maxOpacity) && fill) {
            opacity = deSaturationColor(weightValuePath, colorMapping[i], fill, value);
        }
        if ((fill === '' || isNullOrUndefined(fill))
            && isNullOrUndefined(colorMapping[i].from) && isNullOrUndefined(colorMapping[i].to)
            && isNullOrUndefined(colorMapping[i].minOpacity) && isNullOrUndefined(colorMapping[i].maxOpacity)
            && isNullOrUndefined(colorMapping[i].value)) {
            fill = (Object.prototype.toString.call(colorMapping[i].color) === '[object Array]') ?
                colorMapping[i].color[0] : colorMapping[i].color;
        }
        opacity = !isNullOrUndefined(opacity) ? opacity : '1';
        paths.push(fill);
    }
    for (var j = paths.length - 1; j >= 0; j--) {
        fill = paths[j];
        j = (fill) ? -1 : j;
    }
    return { fill: fill, opacity: opacity };
}
function deSaturationColor(weightValuePath, colorMapping, color, rangeValue) {
    var opacity = 1;
    if ((rangeValue >= colorMapping.from && rangeValue <= colorMapping.to)) {
        var ratio = (rangeValue - colorMapping.from) / (colorMapping.to - colorMapping.from);
        opacity = (ratio * (colorMapping.maxOpacity - colorMapping.minOpacity)) + colorMapping.minOpacity;
    }
    return opacity.toString();
}
function colorCollections(colorMap, value) {
    var gradientFill = getColorByValue(colorMap, value);
    return gradientFill;
}
function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function getColorByValue(colorMap, value) {
    var color = '';
    var rbg;
    if (Number(value) === colorMap.from) {
        color = colorMap.color[0];
    }
    else if (Number(value) === colorMap.to) {
        color = colorMap.color[colorMap.color.length - 1];
    }
    else {
        rbg = getGradientColor(Number(value), colorMap);
        color = rgbToHex(rbg.r, rbg.g, rbg.b);
    }
    return color;
}
/* tslint:disable-next-line:max-func-body-length */
function getGradientColor(value, colorMap) {
    var previousOffset = colorMap.from;
    var nextOffset = colorMap.to;
    var percent = 0;
    var full = nextOffset - previousOffset;
    var midColor;
    percent = (value - previousOffset) / full;
    var previousColor;
    var nextColor;
    if (colorMap.color.length <= 2) {
        previousColor = colorMap.color[0].charAt(0) === '#' ? colorMap.color[0] : colorNameToHex(colorMap.color[0]);
        nextColor = colorMap.color[colorMap.color.length - 1].charAt(0) === '#' ?
            colorMap.color[colorMap.color.length - 1] : colorNameToHex(colorMap.color[colorMap.color.length - 1]);
    }
    else {
        previousColor = colorMap.color[0].charAt(0) === '#' ? colorMap.color[0] : colorNameToHex(colorMap.color[0]);
        nextColor = colorMap.color[colorMap.color.length - 1].charAt(0) === '#' ?
            colorMap.color[colorMap.color.length - 1] : colorNameToHex(colorMap.color[colorMap.color.length - 1]);
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
                    splitColorValueOffset[i]['color'] : colorNameToHex(splitColorValueOffset[i]['color']);
                nextColor = midColor;
                percent = value < splitColorValueOffset[i]['b'] ? 1 - Math.abs((value - splitColorValueOffset[i]['b']) / a)
                    : (value - splitColorValueOffset[i]['b']) / a;
            }
            else if (splitColorValueOffset[i]['b'] <= value && value <= nextOffset && i === (splitColorValueOffset.length - 1)) {
                midColor = splitColorValueOffset[i]['color'].charAt(0) === '#' ?
                    splitColorValueOffset[i]['color'] : colorNameToHex(splitColorValueOffset[i]['color']);
                previousColor = midColor;
                percent = value < splitColorValueOffset[i]['b'] ?
                    1 - Math.abs((value - splitColorValueOffset[i]['b']) / a) : (value - splitColorValueOffset[i]['b']) / a;
            }
            if (i !== splitColorValueOffset.length - 1 && i < splitColorValueOffset.length) {
                if (splitColorValueOffset[i]['b'] <= value && value <= splitColorValueOffset[i + 1]['b']) {
                    midColor = splitColorValueOffset[i]['color'].charAt(0) === '#' ?
                        splitColorValueOffset[i]['color'] : colorNameToHex(splitColorValueOffset[i]['color']);
                    previousColor = midColor;
                    nextColor = splitColorValueOffset[i + 1]['color'].charAt(0) === '#' ?
                        splitColorValueOffset[i + 1]['color'] : colorNameToHex(splitColorValueOffset[i + 1]['color']);
                    percent = Math.abs((value - splitColorValueOffset[i + 1]['b'])) / a;
                }
            }
        }
    }
    return getPercentageColor(percent, previousColor, nextColor);
}
function getPercentageColor(percent, previous, next) {
    var nextColor = next.split('#')[1];
    var prevColor = previous.split('#')[1];
    var r = getPercentage(percent, parseInt(prevColor.substr(0, 2), 16), parseInt(nextColor.substr(0, 2), 16));
    var g = getPercentage(percent, parseInt(prevColor.substr(2, 2), 16), parseInt(nextColor.substr(2, 2), 16));
    var b = getPercentage(percent, parseInt(prevColor.substr(4, 2), 16), parseInt(nextColor.substr(4, 2), 16));
    return new ColorValue(r, g, b);
}
function getPercentage(percent, previous, next) {
    var full = next - previous;
    return Math.round((previous + (full * percent)));
}
function wordWrap(maximumWidth, dataLabel, font) {
    var textCollection = dataLabel.split(' ');
    var label = '';
    var labelCollection = [];
    var text;
    for (var i = 0, len = textCollection.length; i < len; i++) {
        text = textCollection[i];
        if (measureText(label.concat(text), font).width < maximumWidth) {
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
function textWrap(maxWidth, label, font) {
    var resultText = [];
    var currentLength = 0;
    var totalWidth = measureText(label, font).width;
    var totalLength = label.length;
    if (maxWidth >= totalWidth) {
        resultText.push(label);
        return resultText;
    }
    else {
        for (var i = label.length; i > currentLength; i--) {
            var sliceString = label.slice(currentLength, i);
            totalWidth = measureText(sliceString, font).width;
            if (totalWidth <= maxWidth) {
                resultText.push(sliceString);
                currentLength += sliceString.length;
                if (totalLength === currentLength) {
                    return resultText;
                }
                i = totalLength + 1;
            }
        }
    }
    return resultText;
}
/**
 * hide function
 */
function hide(maxWidth, maxHeight, text, font) {
    var hideText = text;
    var textSize = measureText(text, font);
    hideText = (textSize.width > maxWidth || textSize.height > maxHeight) ? ' ' : text;
    return hideText;
}
function orderByArea(a, b) {
    if (a['itemArea'] === b['itemArea']) {
        return 0;
    }
    else if (a['itemArea'] < b['itemArea']) {
        return 1;
    }
    return -1;
}
function removeClassNames(elements, type, treemap) {
    var element;
    var options = {};
    for (var j = 0; j < elements.length; j++) {
        element = elements[j].childNodes[0];
        options = treemap.layout.renderItems[element.id.split('_')[6]]['options'];
        applyOptions(element, options);
        elements[j].classList.remove(type);
        j -= 1;
    }
}
function applyOptions(element, options) {
    element.setAttribute('opacity', options['opacity']);
    element.setAttribute('fill', options['fill']);
    element.setAttribute('stroke', options['border']['color']);
    element.setAttribute('stroke-width', options['border']['width']);
}
function textFormatter(format, data, treemap) {
    if (isNullOrUndefined(format)) {
        return null;
    }
    var keys = Object.keys(data);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        format = format.split('${' + key + '}').join(formatValue(data[key], treemap).toString());
    }
    return format;
}
function formatValue(value, treemap) {
    var formatValue;
    var formatFunction;
    if (treemap.format && !isNaN(Number(value))) {
        formatFunction = treemap.intl.getNumberFormat({ format: treemap.format, useGrouping: treemap.useGroupingSeparator });
        formatValue = formatFunction(Number(value));
    }
    else {
        formatValue = value;
    }
    return formatValue ? formatValue : '';
}
/** @private */
var ColorValue = /** @__PURE__ @class */ (function () {
    function ColorValue(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    return ColorValue;
}());
/** @private */
function convertToHexCode(value) {
    return '#' + componentToHex(value.r) + componentToHex(value.g) + componentToHex(value.b);
}
/** @private */
function componentToHex(value) {
    var hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
/** @private */
function convertHexToColor(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new ColorValue(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) :
        new ColorValue(255, 255, 255);
}
/** @private */
function colorNameToHex(color) {
    var element;
    color = color === 'transparent' ? 'white' : color;
    element = document.getElementById('treeMapMeasureText');
    element.style.color = color;
    color = window.getComputedStyle(element).color;
    var exp = /^(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/;
    var isRGBValue = exp.exec(color);
    return convertToHexCode(new ColorValue(parseInt(isRGBValue[3], 10), parseInt(isRGBValue[4], 10), parseInt(isRGBValue[5], 10)));
}
/** @private */
function drawSymbol(location, shape, size, url, options, label) {
    var svgRenderer = new SvgRenderer('');
    var temp = renderLegendShape(location, size, shape, options, url);
    var htmlElement = svgRenderer['draw' + temp.functionName](temp.renderOption);
    htmlElement.setAttribute('aria-label', label);
    return htmlElement;
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
function isParentItem(data, item) {
    var isParentItem = false;
    for (var j = 0; j < data.length; j++) {
        if (item['levelOrderName'] === data[j]['levelOrderName']) {
            isParentItem = true;
            break;
        }
    }
    return isParentItem;
}
/**
 * Ajax support for treemap
 */
var TreeMapAjax = /** @__PURE__ @class */ (function () {
    function TreeMapAjax(options, type, async, contentType, sendData) {
        this.dataOptions = options;
        this.type = type || 'GET';
        this.async = async || true;
        this.contentType = contentType;
        this.sendData = sendData;
    }
    return TreeMapAjax;
}());
function removeShape(collection, value) {
    if (collection.length > 0) {
        for (var i = 0; i < collection.length; i++) {
            var item = collection[i];
            setColor(item['legendEle'], item['oldFill'], item['oldOpacity'], item['oldBorderColor'], item['oldBorderWidth']);
        }
    }
}
function removeLegend(collection, value) {
    if (collection.length > 0) {
        for (var j = 0; j < collection.length; j++) {
            var item = collection[j];
            setColor(item['legendEle'], item['oldFill'], item['oldOpacity'], item['oldBorderColor'], item['oldBorderWidth']);
            var dataCount = item['ShapeCollection']['Elements'].length;
            for (var k = 0; k < dataCount; k++) {
                setColor(item['ShapeCollection']['Elements'][k], item['shapeOldFill'], item['shapeOldOpacity'], item['shapeOldBorderColor'], item['shapeOldBorderWidth']);
            }
        }
    }
}
function setColor(element, fill, opacity, borderColor, borderWidth) {
    element.setAttribute('fill', fill);
    element.setAttribute('opacity', opacity);
    element.setAttribute('stroke', borderColor);
    element.setAttribute('stroke-width', borderWidth);
}
function removeSelectionWithHighlight(collection, element, treemap) {
    removeShape(collection, 'highlight');
    element = [];
    removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', treemap);
}
function getLegendIndex(length, item, treemap) {
    var index;
    for (var i = 0; i < length; i++) {
        var dataLength = treemap.treeMapLegendModule.legendCollections[i]['legendData'].length;
        for (var j = 0; j < dataLength; j++) {
            if (treemap.treeMapLegendModule.legendCollections[i]['legendData'][j]['levelOrderName'] === item['levelOrderName']) {
                index = i;
                break;
            }
        }
    }
    return index;
}
function pushCollection(collection, index, number, legendElement, shapeElement, renderItems, legendCollection) {
    collection.push({
        legendEle: legendElement, oldFill: legendCollection[index]['legendFill'],
        oldOpacity: legendCollection[index]['opacity'], oldBorderColor: legendCollection[index]['borderColor'],
        oldBorderWidth: legendCollection[index]['borderWidth'],
        shapeElement: shapeElement, shapeOldFill: renderItems[number]['options']['fill'],
        shapeOldOpacity: renderItems[number]['options']['opacity'],
        shapeOldBorderColor: renderItems[number]['options']['border']['color'],
        shapeOldBorderWidth: renderItems[number]['options']['border']['width']
    });
}

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
 * To calculate and render the shape layer
 */
var LayoutPanel = /** @__PURE__ @class */ (function () {
    function LayoutPanel(treemap) {
        this.treemap = treemap;
    }
    /* tslint:disable:no-string-literal */
    LayoutPanel.prototype.processLayoutPanel = function () {
        var data;
        var totalRect;
        if (LevelsData.levelsData && LevelsData.levelsData.length > 0) {
            data = (!isNullOrUndefined(this.treemap.initialDrillDown.groupIndex) &&
                !isNullOrUndefined(this.treemap.initialDrillDown.groupName)) &&
                (isNullOrUndefined(this.treemap.drilledItems) ? isNullOrUndefined(this.treemap.drilledItems)
                    : this.treemap.drilledItems.length === 0) ?
                this.getDrilldownData(LevelsData.levelsData[0], [])[0] : LevelsData.levelsData[0];
            totalRect = extend({}, this.treemap.areaRect, totalRect, false);
            if (!isNullOrUndefined(this.treemap.treeMapLegendModule) && !isNullOrUndefined(this.treemap.totalRect)) {
                if (this.treemap.legendSettings.position !== 'Float') {
                    totalRect = this.treemap.totalRect;
                }
            }
            if (!isNullOrUndefined(this.treemap.currentLevel) &&
                (isNullOrUndefined(this.treemap.drilledItems) ? !isNullOrUndefined(this.treemap.drilledItems)
                    : this.treemap.drilledItems.length !== 0)) {
                var count = this.treemap.drilledItems.length - 1;
                var x = this.treemap.drilledItems[count]['data'];
                var y = new Object();
                y[this.treemap.drilledItems[count]['data']['groupName']] = [x];
                if (!isNullOrUndefined(this.treemap.initialDrillDown.groupIndex) && !this.treemap.enableBreadcrumb) {
                    this.treemap.currentLevel = this.treemap.drilledItems[count]['data']['groupIndex'];
                }
                this.calculateLayoutItems(y || LevelsData.levelsData[0], totalRect);
                this.renderLayoutItems(y || LevelsData.levelsData[0]);
            }
            else {
                if (!isNullOrUndefined(this.treemap.initialDrillDown.groupIndex) &&
                    (isNullOrUndefined(this.treemap.drilledItems) ? isNullOrUndefined(this.treemap.drilledItems)
                        : this.treemap.drilledItems.length === 0)) {
                    this.treemap.currentLevel = this.treemap.initialDrillDown.groupIndex;
                }
                this.calculateLayoutItems(data || LevelsData.levelsData[0], totalRect);
                this.renderLayoutItems(data || LevelsData.levelsData[0]);
            }
        }
    };
    LayoutPanel.prototype.getDrilldownData = function (data, drillData) {
        var treemap = this.treemap;
        var newData = {};
        var child = findChildren(data)['values'];
        if (child && child.length > 0 && drillData.length === 0) {
            for (var i = 0; i < child.length; i++) {
                if (child[i]['groupIndex'] === treemap.initialDrillDown.groupIndex &&
                    child[i]['name'] === treemap.initialDrillDown.groupName) {
                    child[i]['isDrilled'] = true;
                    newData[child[i]['groupName']] = [child[i]];
                    drillData.push(newData);
                }
            }
            for (var j = 0; j < child.length; j++) {
                this.getDrilldownData(child[j], drillData);
            }
        }
        return drillData;
    };
    LayoutPanel.prototype.calculateLayoutItems = function (data, rect) {
        this.renderItems = [];
        this.parentData = [];
        if (!isNullOrUndefined(this.treemap.weightValuePath)) {
            if (this.treemap.layoutType.indexOf('SliceAndDice') > -1) {
                this.computeSliceAndDiceDimensional(data, rect);
            }
            else {
                rect.height = rect.height + rect.y;
                rect.width = rect.width + rect.x;
                this.computeSquarifyDimensional(data, rect);
            }
        }
    };
    LayoutPanel.prototype.computeSliceAndDiceDimensional = function (data, coords) {
        var leafItem = this.treemap.leafItemSettings;
        var rect;
        var groups = this.treemap.levels;
        var groupIndex;
        var isLeafItem = false;
        var children = findChildren(data)['values'];
        var gap;
        var headerHeight;
        if (children && children.length > 0) {
            this.sliceAndDiceProcess(children, coords);
            if (this.treemap.levels.length > 0) {
                for (var i = 0; i < children.length; i++) {
                    groupIndex = children[i]['groupIndex'];
                    isLeafItem = (groups.length === 0 || groupIndex === groups.length);
                    gap = isLeafItem ? leafItem.gap : groups[groupIndex].groupGap;
                    headerHeight = groups.length === 0 ? 0 : groups[groupIndex] ? groups[groupIndex].showHeader ?
                        groups[groupIndex].headerHeight : 0 : groups[groupIndex - 1].showHeader ? groups[groupIndex - 1].headerHeight : 0;
                    rect = children[i]['rect'];
                    rect = new Rect(rect.x + (gap / 2), rect.y + (headerHeight + (gap / 2)), rect.width - gap, Math.abs(rect.height - (gap + headerHeight)));
                    this.computeSliceAndDiceDimensional(children[i], rect);
                }
            }
        }
        return data;
    };
    LayoutPanel.prototype.sliceAndDiceProcess = function (processData, rect) {
        var parentArea = rect.height * rect.width;
        var levels = this.treemap.levels;
        var childValue;
        var alottedValue = 0;
        var totalWeight = 0;
        processData.forEach(function (data) { totalWeight += data['weight']; });
        processData.forEach(function (child) {
            child['weightArea'] = parentArea * child['weight'] / totalWeight;
        });
        var isHorizontal = (this.treemap.layoutType === 'SliceAndDiceAuto') ? (rect.width > rect.height) :
            (this.treemap.layoutType === 'SliceAndDiceHorizontal');
        processData.sort(itemsToOrder);
        for (var i = 0; i < processData.length; i++) {
            var item = processData[i];
            item['isLeafItem'] = (levels.length === 0) || ((this.treemap.isHierarchicalData ||
                isNullOrUndefined(this.treemap.leafItemSettings.labelPath)) ?
                item['groupIndex'] === levels.length - 1 : item['groupIndex'] === this.treemap.levels.length);
            if (isHorizontal) {
                childValue = ((parentArea / totalWeight) * processData[i]['weight']) / rect.height;
                if (alottedValue <= rect.width) {
                    processData[i]['rect'] = new Rect(alottedValue + rect.x, rect.y, childValue, rect.height);
                }
            }
            else {
                childValue = ((parentArea / totalWeight) * processData[i]['weight']) / rect.width;
                if (alottedValue <= rect.height) {
                    processData[i]['rect'] = new Rect(rect.x, alottedValue + rect.y, rect.width, childValue);
                }
            }
            alottedValue += childValue;
            this.renderItems.push(processData[i]);
        }
    };
    LayoutPanel.prototype.computeSquarifyDimensional = function (data, coords) {
        var leaf = this.treemap.leafItemSettings;
        var rect;
        var levels = this.treemap.levels;
        var item;
        var child = findChildren(data)['values'];
        var index;
        var gap;
        var padding;
        var headerHeight;
        if (child && child.length > 0) {
            if (this.parentData.length === 0) {
                this.parentData = [];
                this.parentData.push(child);
            }
            this.calculateChildrenLayout(data, child, coords);
            if (this.treemap.levels.length > 0) {
                for (var i = 0; i < child.length; i++) {
                    item = child[i];
                    index = item['groupIndex'];
                    rect = item['rect'];
                    gap = (item['isLeafItem'] ? leaf.gap : levels[index].groupGap) / 2;
                    padding = (item['isLeafItem'] ? leaf.padding : levels[index].groupPadding) / 2;
                    headerHeight = this.treemap.isHierarchicalData ? index === 0 && item['isLeafItem'] ? 0 : levels[index] ?
                        levels[index].showHeader ? levels[index].headerHeight : 0 : 0 : (levels.length === 0) ? 0 : levels[index] ?
                        levels[index].showHeader ? levels[index].headerHeight : 0 : 0;
                    rect = new Rect(rect.x + padding, rect.y + (headerHeight + padding), rect.width - padding, rect.height - padding);
                    if (!item['isLeafItem'] && item['weight'] > 0) {
                        this.computeSquarifyDimensional(child[i], rect);
                    }
                }
            }
        }
    };
    LayoutPanel.prototype.calculateChildrenLayout = function (parent, children, coords) {
        this.computeTotalArea(children, getArea(coords));
        children.sort(orderByArea);
        this.performRowsLayout(children, [], coords, []);
    };
    LayoutPanel.prototype.performRowsLayout = function (data, currentRow, rect, stack) {
        var dataLength = data.length;
        if (dataLength === 0) {
            var newCoordinates = this.getCoordinates(currentRow, rect);
            var newStack = stack.concat(newCoordinates);
            return newStack;
        }
        var width = getShortestEdge(rect);
        var nextDatum = data[0];
        var restData = data.slice(1, dataLength);
        if (this.aspectRatio(currentRow, nextDatum, width)) {
            var newRow = currentRow.concat(nextDatum);
            return this.performRowsLayout(restData, newRow, rect, stack);
        }
        else {
            var currentRowLength = currentRow.length;
            var valueSum = 0;
            for (var i = 0; i < currentRowLength; i += 1) {
                valueSum += currentRow[i]['itemArea'];
            }
            var newContainer = this.cutArea(rect, valueSum);
            var newCoordinates = this.getCoordinates(currentRow, rect);
            var newStack = stack.concat(newCoordinates);
            return this.performRowsLayout(data, [], newContainer, newStack);
        }
    };
    LayoutPanel.prototype.aspectRatio = function (currentRow, nextDatum, length) {
        if (currentRow.length === 0) {
            return true;
        }
        else {
            var newRow = currentRow.concat(nextDatum);
            var currentMaxAspectRatio = this.findMaxAspectRatio(currentRow, length);
            var newMaxAspectRatio = this.findMaxAspectRatio(newRow, length);
            return (currentMaxAspectRatio >= newMaxAspectRatio);
        }
    };
    LayoutPanel.prototype.findMaxAspectRatio = function (row, length) {
        var rowLength = row.length;
        var minArea = Infinity;
        var maxArea = -Infinity;
        var sumArea = 0;
        for (var i = 0; i < rowLength; i += 1) {
            var area = row[i]['itemArea'];
            if (area < minArea) {
                minArea = area;
            }
            if (area > maxArea) {
                maxArea = area;
            }
            sumArea += area;
        }
        var result = Math.max((Math.pow(length, 2)) * maxArea / (Math.pow(sumArea, 2)), (Math.pow(sumArea, 2)) /
            ((Math.pow(length, 2)) * minArea));
        return result;
    };
    LayoutPanel.prototype.cutArea = function (rect, area) {
        var newContainer = convertToContainer(rect);
        var width = newContainer.width;
        var height = newContainer.height;
        var xOffset = newContainer.x;
        var yOffset = newContainer.y;
        if (width >= height) {
            var areaWidth = area / height;
            var newWidth = width - areaWidth;
            var container = {
                x: xOffset + areaWidth,
                y: yOffset,
                width: newWidth,
                height: height,
            };
            return convertToRect(container);
        }
        else {
            var areaHeight = area / width;
            var newHeight = height - areaHeight;
            var container = {
                x: xOffset,
                y: yOffset + areaHeight,
                width: width,
                height: newHeight,
            };
            return convertToRect(container);
        }
    };
    LayoutPanel.prototype.getCoordinates = function (row, rect) {
        var container = convertToContainer(rect);
        var width = container.width;
        var height = container.height;
        var xOffset = container.x;
        var yOffset = container.y;
        var rowLength = row.length;
        var levels = this.treemap.levels;
        var leaf = this.treemap.leafItemSettings;
        var index;
        var valueSum = 0;
        for (var i = 0; i < rowLength; i += 1) {
            valueSum += row[i]['itemArea'];
        }
        var areaWidth = valueSum / height;
        var areaHeight = valueSum / width;
        var subXOffset = xOffset;
        var subYOffset = yOffset;
        var padding;
        var coordinates = [];
        var isParent;
        var parentRect;
        for (var i = 0; i < rowLength; i += 1) {
            var item = row[i];
            index = item['groupIndex'];
            item['isLeafItem'] = (levels.length === 0) || (this.treemap.isHierarchicalData ? index === levels.length :
                isNullOrUndefined(leaf.labelPath) ? false : index === levels.length);
            isParent = isParentItem(this.parentData[0], item);
            parentRect = isParent ? this.treemap.areaRect : item['parent'].rect;
            padding = item['isLeafItem'] ? leaf.padding : levels[index].groupPadding;
            if (width >= height) {
                var y1 = subYOffset + item['itemArea'] / areaWidth;
                item['rect'] = {
                    x: subXOffset,
                    y: subYOffset,
                    width: subXOffset + areaWidth,
                    height: y1,
                };
                subYOffset = y1;
            }
            else {
                var x1 = subXOffset + item['itemArea'] / areaHeight;
                item['rect'] = {
                    x: subXOffset,
                    y: subYOffset,
                    width: x1,
                    height: subYOffset + areaHeight,
                };
                subXOffset = x1;
            }
            if (item['weight'] > 0 && (isParent || (Math.round(rect.y + (padding / 2)) <=
                Math.round(parentRect.y + (parentRect.height - parentRect.y)) && Math.round(rect.x + (padding / 2)) <=
                Math.round(parentRect.x + (parentRect.width - parentRect.x))))) {
                this.renderItems.push(item);
                coordinates.push(item);
            }
        }
        return coordinates;
    };
    LayoutPanel.prototype.computeTotalArea = function (data, area) {
        var dataLength = data.length;
        var result = [];
        for (var i = 0; i < dataLength; i += 1) {
            var dataLength_1 = data.length;
            var dataSum_1 = 0;
            for (var i_1 = 0; i_1 < dataLength_1; i_1 += 1) {
                dataSum_1 += data[i_1]['weight'];
            }
            var multiplier = area / dataSum_1;
            var datum = void 0;
            for (var j = 0; j < dataLength_1; j++) {
                datum = data[j];
                datum['itemArea'] = datum['weight'] * multiplier;
                result.push(datum);
            }
        }
        return result;
    };
    LayoutPanel.prototype.onDemandProcess = function (childItems) {
        var parentItem = new Object();
        var totalRect;
        parentItem = childItems[0]['parent'];
        this.treemap.currentLevel = parentItem['isDrilled'] ? parentItem['groupIndex'] : null;
        var parentItemGroupname = new Object();
        if (isNullOrUndefined(parentItem['groupName'])) {
            parentItemGroupname = parentItem;
        }
        else {
            parentItemGroupname[parentItem['groupName']] = [parentItem];
        }
        totalRect = extend({}, this.treemap.areaRect, totalRect, false);
        if (!isNullOrUndefined(this.treemap.treeMapLegendModule) && !isNullOrUndefined(this.treemap.totalRect)) {
            totalRect = this.treemap.totalRect;
        }
        var count = this.treemap.levels.length;
        for (var i = 0; i < count; i++) {
            var levelCount = childItems[0]['groupIndex'];
            if (count === levelCount) {
                this.treemap.levels[count] = this.treemap.levels[i];
            }
            else {
                this.treemap.levels.splice(count - 1, 1);
            }
        }
        this.calculateLayoutItems(parentItemGroupname, totalRect);
        this.renderLayoutItems(parentItemGroupname);
    };
    /* tslint:disable-next-line:max-func-body-length */
    LayoutPanel.prototype.renderLayoutItems = function (renderData) {
        var _this = this;
        var position;
        var treeMap = this.treemap;
        var colorMapping;
        var txtVisible;
        var getItemColor;
        var eventArgs;
        this.renderer = treeMap.renderer;
        var pathOptions;
        var elementID = treeMap.element.id;
        var index;
        var templatePosition;
        var mode = treeMap.layoutType;
        var rect;
        var format;
        var interSectAction = this.treemap.leafItemSettings.interSectAction;
        var fill;
        var item;
        var renderText;
        var opacity;
        var rectPath = '';
        var secondaryEle = document.getElementById(treeMap.element.id + '_Secondary_Element');
        var groupId;
        var templateEle;
        var gap;
        var textStyle;
        var levels = treeMap.levels;
        this.layoutGroup = this.renderer.createGroup({ id: elementID + '_TreeMap_' + mode + '_Layout' });
        var itemGroup;
        var template;
        var border;
        var templateGroup = createElement('div', {
            id: treeMap.element.id + '_Label_Template_Group',
            className: 'template',
            styles: 'overflow: hidden; position: absolute;pointer-events: none;' +
                'top:' + treeMap.areaRect.y + 'px;' +
                'left:' + treeMap.areaRect.x + 'px;' +
                'height:' + treeMap.areaRect.height + 'px;' +
                'width:' + treeMap.areaRect.width + 'px;'
        });
        var isLeafItem = false;
        var leaf = treeMap.leafItemSettings;
        var childItems;
        var connectorText;
        var _loop_1 = function (i) {
            item = this_1.renderItems[i];
            index = item['groupIndex'];
            if (this_1.treemap.drillDownView && isNullOrUndefined(this_1.treemap.currentLevel)
                && index > 0 || this_1.treemap.drillDownView
                && index > (this_1.treemap.currentLevel + 1)) {
                return "continue";
            }
            rect = item['rect'];
            isLeafItem = item['isLeafItem'];
            groupId = elementID + '_Level_Index_' + index + '_Item_Index_' + i;
            itemGroup = this_1.renderer.createGroup({ id: groupId + '_Group' });
            gap = (isLeafItem ? leaf.gap : levels[index].groupGap) / 2;
            var treemapItemRect = this_1.treemap.totalRect ? convertToContainer(this_1.treemap.totalRect) : this_1.treemap.areaRect;
            if (treeMap.layoutType === 'Squarified') {
                rect.width = Math.abs(rect.x - rect.width) - gap;
                rect.height = Math.abs(rect.y - rect.height) - gap;
            }
            if (treeMap.renderDirection === 'TopRightBottomLeft') {
                rect.x = (treemapItemRect.x + treemapItemRect.width) - rect.width - Math.abs(treemapItemRect.x - rect.x);
            }
            else if (treeMap.renderDirection === 'BottomLeftTopRight') {
                rect.y = (treemapItemRect.y + treemapItemRect.height) - rect.height - Math.abs(treemapItemRect.y - rect.y);
            }
            else if (treeMap.renderDirection === 'BottomRightTopLeft') {
                rect.x = (treemapItemRect.x + treemapItemRect.width) - rect.width - Math.abs(treemapItemRect.x - rect.x);
                rect.y = (treemapItemRect.y + treemapItemRect.height) - rect.height - Math.abs(treemapItemRect.y - rect.y);
            }
            colorMapping = isLeafItem ? leaf.colorMapping : levels[index].colorMapping;
            getItemColor = this_1.getItemColor(isLeafItem, item);
            fill = getItemColor['fill'];
            opacity = getItemColor['opacity'];
            format = isLeafItem ? leaf.labelFormat : (levels[index]).headerFormat;
            var levelName = void 0;
            txtVisible = isLeafItem ? leaf.showLabels : (levels[index]).showHeader;
            if (index === this_1.treemap.currentLevel) {
                if (this_1.treemap.enableBreadcrumb) {
                    var re = /#/gi;
                    connectorText = '#' + this_1.treemap.breadcrumbConnector + '#';
                    levelName = item['levelOrderName'].replace(re, connectorText);
                    levelName = index !== 0 ? '#' + levelName : levelName;
                }
                else {
                    levelName = item['name'];
                }
            }
            else {
                if (this_1.treemap.enableBreadcrumb) {
                    item['isDrilled'] = false;
                }
                levelName = item['name'];
            }
            renderText = textFormatter(format, item['data'], this_1.treemap) || levelName;
            childItems = findChildren(item)['values'];
            renderText = !isLeafItem && childItems && childItems.length > 0 && this_1.treemap.enableDrillDown ?
                !item['isDrilled'] ? treeMap.enableRtl ? renderText + ' [+]' : '[+] ' + renderText :
                    treeMap.enableRtl ? renderText + ' [-]' : '[-] ' + renderText : renderText;
            textStyle = (isLeafItem ? leaf.labelStyle : levels[index].headerStyle);
            textStyle.fontFamily = this_1.treemap.themeStyle.labelFontFamily || textStyle.fontFamily;
            border = isLeafItem ? leaf.border : levels[index].border;
            position = !isLeafItem ? (levels[index].headerAlignment) === 'Near' ? 'TopLeft' : (levels[index].headerAlignment) === 'Center' ?
                'TopCenter' : 'TopRight' : leaf.labelPosition;
            templatePosition = isLeafItem ? leaf.templatePosition : levels[index].templatePosition;
            template = isLeafItem ? leaf.labelTemplate : levels[index].headerTemplate;
            item['options'] = { border: border, opacity: opacity, fill: fill };
            eventArgs = {
                cancel: false, name: itemRendering, treemap: this_1.treemap,
                currentItem: item, RenderItems: this_1.renderItems, options: item['options']
            };
            if (this_1.treemap.isBlazor) {
                var treemap = eventArgs.treemap, RenderItems = eventArgs.RenderItems, blazorEventArgs = __rest$1(eventArgs, ["treemap", "RenderItems"]);
                eventArgs = blazorEventArgs;
            }
            this_1.treemap.trigger(itemRendering, eventArgs, function (observedArgs) {
                if (!observedArgs.cancel) {
                    rectPath = ' M ' + rect.x + ' ' + rect.y + ' L ' + (rect.x + rect.width) + ' ' + rect.y +
                        ' L ' + (rect.x + rect.width) + ' ' + (rect.y + rect.height) + ' L ' + rect.x + ' ' + (rect.y + rect.height) + 'z';
                    pathOptions = new PathOption(groupId + '_RectPath', fill, border.width, border.color, opacity, null, rectPath);
                    var path = _this.renderer.drawPath(pathOptions);
                    itemGroup.appendChild(path);
                    if (txtVisible) {
                        _this.renderItemText(renderText.toString(), itemGroup, textStyle, rect, interSectAction, groupId, fill, position, connectorText);
                    }
                    if (template) {
                        templateEle = _this.renderTemplate(secondaryEle, groupId, rect, templatePosition, template, item, isLeafItem);
                        templateGroup.appendChild(templateEle);
                    }
                    itemGroup.setAttribute('aria-label', item['name']);
                    itemGroup.setAttribute('tabindex', (_this.treemap.tabIndex + i + 2).toString());
                    _this.layoutGroup.appendChild(itemGroup);
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < this.renderItems.length; i++) {
            _loop_1(i);
        }
        if (templateGroup.childNodes.length > 0) {
            secondaryEle.appendChild(templateGroup);
            updateBlazorTemplate(this.treemap.element.id + '_HeaderTemplate', 'HeaderTemplate', levels[levels.length - 1]);
            updateBlazorTemplate(this.treemap.element.id + '_LabelTemplate', 'LabelTemplate', leaf);
        }
        this.treemap.svgObject.appendChild(this.layoutGroup);
    };
    LayoutPanel.prototype.renderItemText = function (text, parentElement, textStyle, rect, interSectAction, groupId, fill, position, connectorText) {
        var textOptions;
        var secondaryEle = document.getElementById(this.treemap.element.id + '_Secondary_Element');
        var leaf = this.treemap.leafItemSettings;
        var padding = 5;
        var textSize;
        var textLocation;
        var textCollection = [];
        var customText;
        var tspanText = [];
        var height = 0;
        var textName;
        textCollection = ((text.indexOf('<br>')) !== -1) ? text.split('<br>') : null;
        customText = this.labelInterSectAction(rect, text, textStyle, interSectAction);
        textSize = measureText(textCollection && textCollection[0] || customText[0], textStyle);
        if (this.treemap.enableRtl) {
            var labelSize = measureText(text, textStyle);
            var drillSymbolCount = text.search('[+]') || text.search('[-]');
            if (rect.width < labelSize.width && drillSymbolCount > 0) {
                var label = text.substring(drillSymbolCount - 1, text.length);
                var drillSymbol = '[+]';
                var drillSymbolSize = measureText(drillSymbol, textStyle);
                customText['0'] = textTrim(rect.width - drillSymbolSize.width - padding, customText[0], textStyle) + label;
            }
        }
        textLocation = findLabelLocation(rect, position, textSize, 'Text', this.treemap);
        if (!isNullOrUndefined(textCollection)) {
            var collection = [];
            var texts = null;
            var maxNumber = [];
            for (var i = 0; i < textCollection.length; i++) {
                texts = textTrim((rect.width - 5), textCollection[i], textStyle);
                textSize = measureText(texts, textStyle);
                height += textSize.height;
                maxNumber.push(textSize.width);
                collection.push(texts);
            }
            customText = collection;
            textSize.width = Math.max.apply(null, maxNumber);
            textSize.height = height;
        }
        if (interSectAction === 'WrapByWord' || interSectAction === 'Wrap' || interSectAction === 'Trim') {
            for (var j = 0; j < customText.length; j++) {
                textSize = measureText(customText[j], textStyle);
                height += textSize.height;
                if ((rect.height - padding) > height) {
                    tspanText.push(customText[j]);
                }
            }
            if (interSectAction === 'Wrap' && customText.length !== tspanText.length && tspanText.length) {
                var collectionLength = tspanText.length - 1;
                var stringText = tspanText[collectionLength];
                stringText = stringText.substring(0, (stringText.length - 1)) + '...';
                tspanText.splice(collectionLength);
                if (stringText !== '...') {
                    tspanText.push(stringText);
                }
            }
        }
        else {
            textName = customText;
            tspanText.push(textName);
        }
        textOptions = new TextOption(groupId + '_Text', textLocation.x, textLocation.y, 'start', tspanText, '', '', connectorText);
        renderTextElement(textOptions, textStyle, textStyle.color || this.getSaturatedColor(fill), parentElement);
    };
    LayoutPanel.prototype.getItemColor = function (isLeafItem, item) {
        var treemap = this.treemap;
        var itemFill = isLeafItem ? treemap.leafItemSettings.fill : treemap.levels[item['groupIndex']].fill;
        var itemOpacity = isLeafItem ? treemap.leafItemSettings.opacity : treemap.levels[item['groupIndex']].opacity;
        if (!isNullOrUndefined(LevelsData.defaultLevelsData)) {
            if (LevelsData.defaultLevelsData.length > 0) {
                LevelsData.levelsData = LevelsData.defaultLevelsData;
            }
        }
        var parentData = findChildren(LevelsData.levelsData[0])['values'];
        var colorMapping = isLeafItem ? treemap.leafItemSettings.colorMapping :
            treemap.levels[item['groupIndex']].colorMapping;
        if (colorMapping.length > 0) {
            var option = colorMap(colorMapping, item['data'][this.treemap.equalColorValuePath], item['data'][this.treemap.rangeColorValuePath], item['data'][this.treemap.weightValuePath]);
            itemFill = !isNullOrUndefined(option['fill']) ? option['fill'] : treemap.leafItemSettings.fill;
            itemOpacity = option['opacity'];
        }
        else {
            for (var i = 0; i < parentData.length; i++) {
                if (parentData[i]['levelOrderName'] === item['levelOrderName'].split('#')[0]) {
                    itemFill = !isNullOrUndefined(itemFill) ? itemFill : !isNullOrUndefined(treemap.colorValuePath) ?
                        parentData[i]['data'][treemap.colorValuePath] : treemap.palette.length > 0 ?
                        treemap.palette[i % treemap.palette.length] : '#808080';
                }
            }
        }
        return { fill: itemFill, opacity: itemOpacity };
    };
    /**
     * To find saturated color for datalabel
     */
    LayoutPanel.prototype.getSaturatedColor = function (color) {
        var saturatedColor = color;
        saturatedColor = (saturatedColor === 'transparent') ? window.getComputedStyle(document.body, null).backgroundColor : saturatedColor;
        var rgbValue = convertHexToColor(colorNameToHex(saturatedColor));
        var contrast = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
        return contrast >= 128 ? 'black' : 'white';
    };
    LayoutPanel.prototype.renderTemplate = function (secondaryEle, groupId, rect, position, template, item, isLeafItem) {
        var templateElement;
        var labelEle;
        var templateSize;
        var templateFn;
        var templateLocation;
        var templateId = isLeafItem ? groupId + '_LabelTemplate' : groupId + '_HeaderTemplate';
        var baseTemplateId = isLeafItem ? '_LabelTemplate' : '_HeaderTemplate';
        if (isNullOrUndefined(template['prototype'])) {
            var keys = Object.keys(item['data']);
            for (var i = 0; i < keys.length; i++) {
                template = template.replace(new RegExp('{{:' + keys[i] + '}}', 'g'), item['data'][keys[i].toString()]);
            }
        }
        templateFn = getTemplateFunction(template);
        templateElement = templateFn(item['data'], null, null, this.treemap.element.id + baseTemplateId, false);
        labelEle = convertElement(templateElement, templateId, item['data']);
        templateSize = measureElement(labelEle, secondaryEle);
        templateLocation = findLabelLocation(rect, position, templateSize, 'Template', this.treemap);
        labelEle.style.left = templateLocation.x + 'px';
        labelEle.style.top = templateLocation.y + 'px';
        return labelEle;
    };
    LayoutPanel.prototype.labelInterSectAction = function (rect, text, textStyle, alignment) {
        var textValue;
        var maxWidth = rect.width - 10;
        switch (alignment) {
            case 'Hide':
                textValue = [hide(maxWidth, rect.height, text, textStyle)];
                break;
            case 'Trim':
                textValue = [textTrim((maxWidth + 3), text, textStyle)];
                break;
            case 'WrapByWord':
                textValue = wordWrap(maxWidth, text, textStyle);
                break;
            case 'Wrap':
                textValue = textWrap(maxWidth, text, textStyle);
                break;
        }
        return textValue;
    };
    return LayoutPanel;
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
        this.control.trigger(beforePrint, argsData, function () {
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

/**
 * Maps Themes doc
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
})(Theme || (Theme = {}));
/**
 * @private
 * To get the theme style based on treemap theme.
 */
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
        case 'bootstrapdark':
        case 'fabricdark':
        case 'materialdark':
            style = {
                backgroundColor: color,
                titleFontColor: '#FFFFFF',
                subTitleFontColor: '#FFFFFF',
                tooltipFillColor: '#363F4C',
                tooltipFontColor: '#ffffff',
                legendTitleColor: '#DADADA',
                legendTextColor: '#DADADA',
                fontFamily: 'Roboto, Noto, Sans-serif'
            };
            break;
        case 'highcontrast':
            style = {
                backgroundColor: '#000000',
                titleFontColor: '#FFFFFF',
                subTitleFontColor: '#FFFFFF',
                tooltipFillColor: '#363F4C',
                tooltipFontColor: '#ffffff',
                legendTitleColor: '#FFFFFF',
                legendTextColor: '#FFFFFF',
                fontFamily: 'Roboto, Noto, Sans-serif'
            };
            break;
        case 'bootstrap4':
            style = {
                backgroundColor: '#FFFFFF',
                titleFontColor: '#212529',
                subTitleFontColor: '#212529',
                tooltipFillColor: '#000000',
                tooltipFontColor: '#FFFFFF',
                tooltipFillOpacity: 1,
                tooltipTextOpacity: 0.9,
                legendTitleColor: '#212529',
                legendTextColor: '#212529',
                fontFamily: 'HelveticaNeue-Medium',
                fontSize: '16px',
                legendFontSize: '14px',
                labelFontFamily: 'HelveticaNeue'
            };
            break;
        default:
            style = {
                backgroundColor: '#FFFFFF',
                titleFontColor: '#424242',
                subTitleFontColor: '#424242',
                tooltipFillColor: '#363F4C',
                tooltipFontColor: '#ffffff',
                legendTitleColor: '#353535',
                legendTextColor: '#353535',
                fontFamily: 'Roboto, Noto, Sans-serif'
            };
            break;
    }
    return style;
}

/**
 * Tree Map Components
 */
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
 * Represents the TreeMap control.
 * ```html
 * <div id="container"/>
 * <script>
 *   var treemap = new TreeMap();
 *   treemap.appendTo("#container");
 * </script>
 * ```
 */
var TreeMap = /** @__PURE__ @class */ (function (_super) {
    __extends(TreeMap, _super);
    /**s
     * Constructor for TreeMap component.
     */
    function TreeMap(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @private */
        _this.orientation = 'Horizontal';
        /** @private */
        _this.drilledItems = [];
        /** @private */
        _this.isHierarchicalData = false;
        return _this;
    }
    TreeMap.prototype.preRender = function () {
        var _this = this;
        this.isBlazor = isBlazor();
        this.trigger(load, { treemap: this.isBlazor ? null : this }, function () {
            _this.initPrivateVariable();
            _this.unWireEVents();
            _this.createSvg();
            _this.wireEVents();
            _this.setCulture();
        });
    };
    TreeMap.prototype.render = function () {
        LevelsData.levelsData = null;
        LevelsData.defaultLevelsData = null;
        LevelsData.hierarchyData = null;
        this.createSecondaryElement();
        this.addTabIndex();
        this.themeStyle = getThemeStyle(this.theme);
        this.renderBorder();
        this.renderTitle(this.titleSettings, 'title', null, null);
        if (!isNullOrUndefined(LevelsData.levelsData)) {
            LevelsData.defaultLevelsData = LevelsData.levelsData;
        }
        this.processDataManager();
    };
    /* tslint:disable:no-string-literal */
    /* tslint:disable:no-eval */
    TreeMap.prototype.processDataManager = function () {
        var _this = this;
        var dataModule;
        var queryModule;
        var ajaxModule;
        var localAjax;
        if (this.dataSource instanceof DataManager) {
            dataModule = this.dataSource;
            queryModule = this.query instanceof Query ? this.query : new Query();
            var dataManager = dataModule.executeQuery(queryModule);
            dataManager.then(function (e) {
                _this.dataSource = e['result'];
                _this.renderTreeMapElements();
            });
        }
        else if (this.dataSource instanceof TreeMapAjax) {
            localAjax = this.dataSource;
            ajaxModule = new Ajax(localAjax.dataOptions, localAjax.type, localAjax.async, localAjax.contentType);
            ajaxModule.onSuccess = function (args) {
                _this.dataSource = JSON.parse('[' + args + ']')[0];
                _this.renderTreeMapElements();
            };
            ajaxModule.send(localAjax.sendData);
        }
        else {
            this.renderTreeMapElements();
        }
    };
    TreeMap.prototype.renderTreeMapElements = function () {
        this.processingData();
        if (this.treeMapLegendModule && this.legendSettings.visible) {
            this.treeMapLegendModule.renderLegend();
        }
        this.layout.processLayoutPanel();
        this.element.appendChild(this.svgObject);
        this.elementChange();
        this.trigger(loaded, { treemap: this.isBlazor ? null : this });
        this.renderComplete();
    };
    TreeMap.prototype.createSvg = function () {
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
        if (this.leafItemSettings.labelTemplate) {
            resetBlazorTemplate(this.element.id + '_LabelTemplate', 'LabelTemplate');
        }
        for (var i = 0; i < this.levels.length; i++) {
            if (this.levels[i].headerTemplate) {
                resetBlazorTemplate(this.element.id + '_HeaderTemplate', 'HeaderTemplate');
            }
        }
        var containerWidth = this.element.clientWidth;
        var containerHeight = this.element.clientHeight;
        this.availableSize = new Size(stringToNumber(this.width, containerWidth) || containerWidth || 600, stringToNumber(this.height, containerHeight) || containerHeight || 450);
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + '_svg',
            width: this.availableSize.width,
            height: this.availableSize.height
        });
    };
    /**
     * To initilize the private varibales of treemap.
     */
    TreeMap.prototype.initPrivateVariable = function () {
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-treemap').length;
            this.element.id = 'treemap_control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);
        this.layout = new LayoutPanel(this);
    };
    TreeMap.prototype.createSecondaryElement = function () {
        var secondaryEle = document.getElementById(this.element.id + '_Secondary_Element');
        if (secondaryEle && secondaryEle.childElementCount > 0) {
            secondaryEle.parentNode.removeChild(secondaryEle);
        }
        if (isNullOrUndefined(document.getElementById(this.element.id + '_Secondary_Element'))) {
            var secondaryElement = createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: absolute;z-index:1;'
            });
            this.element.appendChild(secondaryElement);
        }
    };
    TreeMap.prototype.elementChange = function () {
        if (this.treeMapLegendModule && this.legendSettings.visible && this.treeMapLegendModule.legendGroup && this.layout.layoutGroup) {
            this.svgObject.insertBefore(this.layout.layoutGroup, this.treeMapLegendModule.legendGroup);
        }
    };
    /**
     * @private
     * Render the treemap border
     */
    TreeMap.prototype.renderBorder = function () {
        var width = this.border.width;
        var borderElement = this.svgObject.querySelector('#' + this.element.id + '_TreeMap_Border');
        if ((this.border.width > 0 || (this.background || this.themeStyle.backgroundColor)) && isNullOrUndefined(borderElement)) {
            var borderRect = new RectOption(this.element.id + '_TreeMap_Border', this.background || this.themeStyle.backgroundColor, this.border, 1, new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(this.renderer.drawRectangle(borderRect));
        }
        else if (borderElement) {
            borderElement.setAttribute('fill', this.background || this.themeStyle.backgroundColor);
        }
    };
    TreeMap.prototype.renderTitle = function (title, type, bounds, groupEle) {
        var style = title.textStyle;
        var height;
        var titlePadding = 10;
        var width = (this.availableSize.width - this.margin.right - this.margin.left);
        title.textStyle.fontFamily = this.themeStyle.fontFamily || title.textStyle.fontFamily;
        title.textStyle.size = this.themeStyle.fontSize || title.textStyle.size;
        if (title.text) {
            if (isNullOrUndefined(groupEle)) {
                groupEle = this.renderer.createGroup({ id: this.element.id + '_Title_Group' });
            }
            var trimmedTitle = textTrim(width, title.text, style);
            var elementSize = measureText(trimmedTitle, style);
            var rect = (isNullOrUndefined(bounds)) ? new Rect(this.margin.left, this.margin.top, this.availableSize.width, this.availableSize.height) : bounds;
            var location_1 = findPosition(rect, title.alignment, elementSize, type);
            var options = new TextOption(this.element.id + '_TreeMap_' + type, location_1.x, location_1.y, 'start', trimmedTitle);
            var titleBounds = new Rect(location_1.x, location_1.y, elementSize.width, elementSize.height);
            var element = renderTextElement(options, style, style.color || (type === 'title' ? this.themeStyle.titleFontColor : this.themeStyle.subTitleFontColor), groupEle);
            element.setAttribute('aria-label', title.description || title.text);
            element.setAttribute('tabindex', (this.tabIndex + (type === 'title' ? 1 : 2)).toString());
            if ((type === 'title' && !title.subtitleSettings.text) || (type === 'subtitle')) {
                height = (this.availableSize.height - titleBounds.y - titlePadding - this.margin.bottom);
                this.areaRect = new Rect(this.margin.left, titleBounds.y + titlePadding, width, height);
            }
            if (type !== 'subtitle' && title.subtitleSettings.text) {
                this.renderTitle(title.subtitleSettings, 'subtitle', titleBounds, groupEle);
            }
            else {
                this.svgObject.appendChild(groupEle);
            }
        }
        else {
            height = (this.availableSize.height - this.margin.top - this.margin.bottom);
            this.areaRect = new Rect(this.margin.left, this.margin.top, width, height);
        }
    };
    TreeMap.prototype.processingData = function () {
        var _this = this;
        var path;
        this.dataSource = this.dataSource;
        if (!isNullOrUndefined(this.dataSource) && this.dataSource.length > 0 && this.weightValuePath) {
            LevelsData.levelsData = [];
            this.dataSource.map(function (data) {
                data[_this.weightValuePath] = (data[_this.weightValuePath]) ? data[_this.weightValuePath].toString() :
                    data[_this.weightValuePath];
            });
            this.leafItemSettings.labelPath = this.leafItemSettings.labelPath || this.weightValuePath;
            this.checkIsHierarchicalData();
            if (this.levels.length === 0) {
                var data_1 = new Object();
                data_1['level'] = 0;
                path = this.leafItemSettings.labelPath;
                data_1[path] = [];
                for (var i = 0; i < this.dataSource.length; i++) {
                    var child = findChildren(this.dataSource[i])['values'];
                    if (this.isHierarchicalData && child && child.length > 0) {
                        child.forEach(function (currentData, dataIndex) {
                            if (currentData[path]) {
                                data_1[path].push({
                                    groupIndex: 0, name: currentData[path], levelOrderName: currentData[path].toString(),
                                    data: currentData, weight: currentData[_this.weightValuePath]
                                });
                            }
                        });
                    }
                    else {
                        if (this.dataSource[i][path]) {
                            data_1[path].push({
                                groupIndex: 0, name: this.dataSource[i][path], levelOrderName: this.dataSource[i][path].toString(), data: this.dataSource[i],
                                weight: this.dataSource[i][this.weightValuePath]
                            });
                        }
                    }
                }
                LevelsData.levelsData.push(data_1);
            }
            else {
                if (this.isHierarchicalData) {
                    LevelsData.hierarchyData = [];
                    LevelsData.hierarchyData = extend([], this.dataSource, LevelsData.hierarchyData, true);
                    for (var i = 0; i < LevelsData.hierarchyData.length; i++) {
                        this.processHierarchicalData(LevelsData.hierarchyData[i], i);
                    }
                    LevelsData.levelsData = LevelsData.hierarchyData;
                }
                else {
                    this.processFlatJsonData();
                    if (LevelsData.levelsData.length > 1) {
                        this.reOrderLevelData(LevelsData.levelsData.length - 1);
                    }
                }
                path = this.levels[0].groupPath;
            }
            if (!this.isHierarchicalData) {
                this.findTotalWeight(LevelsData.levelsData[0][path], 'Parent');
            }
        }
    };
    TreeMap.prototype.checkIsHierarchicalData = function () {
        var child;
        this.dataSource = this.dataSource;
        for (var i = 0; i < this.dataSource.length; i++) {
            child = findChildren(this.dataSource[i])['values'];
            if (child && child.length) {
                this.isHierarchicalData = true;
                break;
            }
            else if (i === this.dataSource.length - 1) {
                this.isHierarchicalData = false;
            }
        }
    };
    TreeMap.prototype.processHierarchicalData = function (data, dataCount) {
        var _this = this;
        var childData;
        var newData = new Object();
        var levelIndex;
        var path = this.leafItemSettings.labelPath ? this.leafItemSettings.labelPath : this.weightValuePath;
        var level;
        var key;
        newData = findChildren(data);
        childData = newData ? newData['values'] : null;
        if (childData && childData.length > 0) {
            key = newData['key'];
            for (var i = 0; i < this.levels.length; i++) {
                if (key === this.levels[i].groupPath) {
                    level = this.levels[i];
                    levelIndex = i;
                }
            }
            for (var j = 0; j < childData.length; j++) {
                childData[j]['name'] = childData[j][path];
                childData[j]['levelOrderName'] = (levelIndex === 0 ? childData[j]['name'] :
                    data['levelOrderName'] + '#' + childData[j]['name']) + '';
                var childItemLevel = childData[j]['levelOrderName'];
                var childLevel = void 0;
                if (childItemLevel.search('#') > 0) {
                    childLevel = childItemLevel.split('#').length - 1;
                }
                childData[j]['groupIndex'] = isNullOrUndefined(levelIndex) ? childLevel === this.levels.length
                    ? this.levels.length : childLevel : levelIndex;
                if (levelIndex !== 0) {
                    childData[j]['parent'] = data;
                }
                childData[j]['groupName'] = key;
                childData[j]['data'] = childData[j];
                childData[j]['isDrilled'] = false;
                childData[j]['weight'] = childData[j][this.weightValuePath];
            }
            childData.forEach(function (currentData) {
                _this.processHierarchicalData(currentData, dataCount);
            });
        }
        if (dataCount === LevelsData.hierarchyData.length - 1) {
            var mainData_1 = LevelsData.hierarchyData[0][this.levels[0].groupPath];
            for (var k = 0; k < LevelsData.hierarchyData.length; k++) {
                childData = findChildren(LevelsData.hierarchyData[k])['values'];
                if (k !== 0 && childData) {
                    childData.forEach(function (currentData) { mainData_1.push(currentData); });
                    LevelsData.hierarchyData.splice(k, 1);
                    k -= 1;
                }
            }
            mainData_1 = LevelsData.hierarchyData[0][this.levels[0].groupPath];
            for (var l = 0; l < mainData_1.length; l++) {
                newData[this.levels[0].groupPath] = mainData_1;
                mainData_1[l]['parent'] = newData;
            }
        }
    };
    /**
     * Handles the print method for chart control.
     */
    TreeMap.prototype.print = function (id) {
        var exportChart = new ExportUtils(this);
        exportChart.print(id);
    };
    /**
     * Handles the export method for chart control.
     * @param type
     * @param fileName
     */
    TreeMap.prototype.export = function (type, fileName, orientation) {
        var exportMap = new ExportUtils(this);
        exportMap.export(type, fileName, orientation);
    };
    /* tslint:disable:no-string-literal */
    TreeMap.prototype.processFlatJsonData = function () {
        this.dataSource = this.dataSource;
        var groupPath;
        var orderNames = [];
        for (var i = 0; i < this.levels.length + 1; i++) {
            groupPath = this.levels[i] ? this.levels[i].groupPath : this.leafItemSettings.labelPath;
            var level = new Object();
            level['level'] = i;
            level[groupPath] = [];
            LevelsData.levelsData.push(level);
            for (var j = 0; j < this.dataSource.length; j++) {
                var currentData = {};
                var childName = '';
                if (this.dataSource[j][groupPath]) {
                    var name_1 = this.dataSource[j][groupPath];
                    if (i !== 0) {
                        for (var k = 0; k <= i; k++) {
                            var childGroupPath_1 = this.levels[k] ? this.levels[k].groupPath : groupPath;
                            childName += (this.dataSource[j][childGroupPath_1]) + ((k === i) ? '' : '#');
                        }
                    }
                    if (!(orderNames.length > 0 ? orderNames.indexOf(childName ?
                        childName : name_1) !== -1 : false)) {
                        currentData['name'] = name_1;
                        currentData['levelOrderName'] = ((childName) ? childName : name_1) + '';
                        currentData['groupIndex'] = i;
                        currentData['isDrilled'] = false;
                        currentData['groupName'] = groupPath;
                        currentData['data'] = this.dataSource[j];
                        LevelsData.levelsData[LevelsData.levelsData.length - 1][groupPath].push(currentData);
                        orderNames.push((childName) ? childName : name_1);
                    }
                }
            }
        }
    };
    TreeMap.prototype.reOrderLevelData = function (start) {
        var currentName;
        var currentPath = this.levels[start] ? this.levels[start].groupPath : this.leafItemSettings.labelPath;
        var prevPath = this.levels[start - 1].groupPath;
        var currentData = LevelsData.levelsData[start][currentPath];
        var previousData = LevelsData.levelsData[start - 1][prevPath];
        for (var i = 0; i < currentData.length; i++) {
            currentName = currentData[i]['levelOrderName'];
            for (var j = 0; j < previousData.length; j++) {
                previousData[j][currentPath] = isNullOrUndefined(previousData[j][currentPath]) ? [] : previousData[j][currentPath];
                if (currentName.indexOf(previousData[j]['levelOrderName']) !== -1) {
                    if (isNullOrUndefined(currentData[i]['parent'])) {
                        currentData[i]['parent'] = previousData[j];
                    }
                    previousData[j][currentPath].push(currentData[i]);
                    break;
                }
            }
        }
        this.findTotalWeight(LevelsData.levelsData[LevelsData.levelsData.length - 1][currentPath], 'Child');
        LevelsData.levelsData.splice(start, 1);
        if ((start - 1) > 0) {
            this.reOrderLevelData(start - 1);
        }
    };
    TreeMap.prototype.findTotalWeight = function (processData, type) {
        var _this = this;
        var totalWeight;
        var split;
        var groupName;
        var groupObj = new Object();
        var _loop_1 = function (i) {
            totalWeight = 0;
            groupName = processData[i]['groupName'];
            split = processData[i]['levelOrderName'].split('#');
            this_1.dataSource.forEach(function (data) {
                if (isContainsData(split, processData[i]['levelOrderName'], data, _this)) {
                    totalWeight += parseFloat(data[_this.weightValuePath]);
                }
            });
            if (type === 'Parent') {
                groupObj[groupName] = processData;
                processData[i]['parent'] = groupObj;
            }
            processData[i]['weight'] = totalWeight;
        };
        var this_1 = this;
        for (var i = 0; i < processData.length; i++) {
            _loop_1(i);
        }
    };
    /**
     * To unbind event handlers for treemap.
     */
    TreeMap.prototype.unWireEVents = function () {
        EventHandler.remove(this.element, 'click', this.clickOnTreeMap);
        EventHandler.remove(this.element, 'dblclick', this.doubleClickOnTreeMap);
        EventHandler.remove(this.element, 'contextmenu', this.rightClickOnTreeMap);
        EventHandler.remove(this.element, Browser.touchStartEvent, this.mouseDownOnTreeMap);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMoveOnTreeMap);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEndOnTreeMap);
        EventHandler.remove(this.element, 'pointerleave mouseleave', this.mouseLeaveOnTreeMap);
        window.removeEventListener('resize', this.resizeOnTreeMap);
    };
    /**
     * To bind event handlers for treemap.
     */
    TreeMap.prototype.wireEVents = function () {
        EventHandler.add(this.element, 'click', this.clickOnTreeMap, this);
        EventHandler.add(this.element, 'dblclick', this.doubleClickOnTreeMap, this);
        EventHandler.add(this.element, 'contextmenu', this.rightClickOnTreeMap, this);
        EventHandler.add(this.element, Browser.touchStartEvent, this.mouseDownOnTreeMap, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMoveOnTreeMap, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEndOnTreeMap, this);
        EventHandler.add(this.element, 'pointerleave mouseleave', this.mouseLeaveOnTreeMap, this);
        window.addEventListener('resize', this.resizeOnTreeMap.bind(this));
    };
    /**
     * Method to set culture for maps
     */
    TreeMap.prototype.setCulture = function () {
        this.intl = new Internationalization();
    };
    /**
     * To add tab index for treemap element
     */
    TreeMap.prototype.addTabIndex = function () {
        this.element.setAttribute('aria-label', this.description || 'TreeMap Element');
        this.element.setAttribute('tabindex', this.tabIndex.toString());
    };
    /**
     * To handle the window resize event on treemap.
     */
    TreeMap.prototype.resizeOnTreeMap = function (e) {
        var _this = this;
        var args = {
            name: resize,
            cancel: false,
            previousSize: this.availableSize,
            currentSize: new Size(0, 0),
            treemap: this.isBlazor ? null : this
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        if (this.element.classList.contains('e-treemap')) {
            this.resizeTo = setTimeout(function () {
                _this.unWireEVents();
                _this.createSvg();
                _this.refreshing = true;
                _this.wireEVents();
                args.currentSize = _this.availableSize;
                _this.trigger(resize, args, function () {
                    _this.render();
                });
            }, 500);
        }
    };
    TreeMap.prototype.clickOnTreeMap = function (e) {
        var targetEle = e.target;
        var targetId = targetEle.id;
        var eventArgs;
        var itemIndex;
        var clickArgs = { cancel: false, name: click, treemap: this, mouseEvent: e };
        var clickBlazorArgs = { cancel: false, name: click, mouseEvent: e };
        this.trigger(click, this.isBlazor ? clickBlazorArgs : clickArgs);
        if (targetId.indexOf('_Item_Index') > -1) {
            e.preventDefault();
            itemIndex = parseFloat(targetId.split('_')[6]);
            eventArgs = {
                cancel: false, name: itemClick, treemap: this, item: this.layout.renderItems[itemIndex], mouseEvent: e,
                groupIndex: this.layout.renderItems[itemIndex]['groupIndex'], groupName: this.layout.renderItems[itemIndex]['name']
            };
            if (this.isBlazor) {
                var data = {
                    groupIndex: eventArgs.item['groupIndex'],
                    groupName: eventArgs.item['groupName'],
                    isDrilled: eventArgs.item['isDrilled'],
                    isLeafItem: eventArgs.item['isLeafItem'],
                    itemArea: eventArgs.item['itemArea'],
                    levelOrderName: eventArgs.item['levelOrderName'],
                    name: eventArgs.item['name'],
                    options: eventArgs.item['options'],
                    rect: eventArgs.item['rect']
                };
                eventArgs.item = data;
                var treemap = eventArgs.treemap, blazorEventArgs = __rest(eventArgs, ["treemap"]);
                eventArgs = blazorEventArgs;
            }
            this.trigger(itemClick, eventArgs);
        }
        var end = new Date().getMilliseconds();
        var doubleTapTimer1;
        if (!isNullOrUndefined(this.doubleClick)) {
            if (!isNullOrUndefined(doubleTapTimer1) && end - doubleTapTimer1 < 500) {
                this.doubleClickOnTreeMap(e);
            }
            doubleTapTimer1 = end;
        }
    };
    TreeMap.prototype.doubleClickOnTreeMap = function (e) {
        var doubleClickArgs = { cancel: false, name: doubleClick, treemap: this, mouseEvent: e };
        var doubleClickBlazorArgs = { cancel: false, name: doubleClick, mouseEvent: e };
        this.trigger(doubleClick, this.isBlazor ? doubleClickBlazorArgs : doubleClickArgs);
        //this.notify('dblclick', e);
    };
    TreeMap.prototype.rightClickOnTreeMap = function (e) {
        var rightClickArgs = { cancel: false, name: rightClick, treemap: this, mouseEvent: e };
        var rightClickBlazorArgs = { cancel: false, name: rightClick, mouseEvent: e };
        this.trigger(rightClick, this.isBlazor ? rightClickBlazorArgs : rightClickArgs);
    };
    /* tslint:disable-next-line:max-func-body-length */
    TreeMap.prototype.mouseDownOnTreeMap = function (e) {
        if (e.target.id.indexOf('_Item_Index') > -1) {
            this.mouseDown = true;
        }
        this.notify(Browser.touchStartEvent, e);
    };
    TreeMap.prototype.mouseMoveOnTreeMap = function (e) {
        var targetEle = e.target;
        var targetId = targetEle.id;
        var eventArgs;
        var item;
        var moveArgs = { cancel: false, name: mouseMove, treemap: this, mouseEvent: e };
        var moveBlazorArgs = { cancel: false, name: mouseMove, mouseEvent: e };
        this.trigger(mouseMove, this.isBlazor ? moveBlazorArgs : moveArgs);
        var childItems;
        if (targetId.indexOf('_Item_Index') > -1) {
            item = this.layout.renderItems[parseFloat(targetId.split('_')[6])];
            childItems = findChildren(item)['values'];
            this.element.style.cursor = (!item['isLeafItem'] && childItems && childItems.length > 0 && this.enableDrillDown) ?
                'pointer' : 'auto';
            eventArgs = { cancel: false, name: itemMove, treemap: this, item: item, mouseEvent: e };
            if (this.isBlazor) {
                var data = {
                    isLeafItem: eventArgs.item['isLeafItem'],
                    groupIndex: eventArgs.item['groupIndex'],
                    groupName: eventArgs.item['groupName'],
                    isDrilled: eventArgs.item['isDrilled'],
                    itemArea: eventArgs.item['itemArea'],
                    levelOrderName: eventArgs.item['levelOrderName'],
                    name: eventArgs.item['name'],
                    rect: eventArgs.item['rect'],
                    options: eventArgs.item['options']
                };
                eventArgs.item = data;
                var treemap = eventArgs.treemap, blazorEventArgs = __rest(eventArgs, ["treemap"]);
                eventArgs = blazorEventArgs;
            }
            this.trigger(itemMove, eventArgs);
        }
        this.notify(Browser.touchMoveEvent, e);
    };
    TreeMap.prototype.calculateSelectedTextLevels = function (labelText, item) {
        //to find the levels by clicking the particular text both for drillDownView as true / false.
        var drillLevel;
        var k;
        var text;
        var levelLabels = item['levelOrderName'];
        var levelText = levelLabels.split('#');
        for (var _i = 0, _a = Object.keys(levelText); _i < _a.length; _i++) {
            k = _a[_i];
            if (levelText[k] === labelText) {
                drillLevel = parseInt(k, 10);
                text = labelText;
            }
        }
        return { drillLevel: drillLevel, currentLevelLabel: text, levelText: levelText };
    };
    TreeMap.prototype.calculatePreviousLevelChildItems = function (labelText, drillLevelValues, item, directLevel) {
        //By clicking any child items drilldown to the particular level.
        //At the time store all the previous drilled level items in drilledItems
        // This condition satisfies while drilldown View is set as false and the text contains '[+]'
        var text;
        var p = 0;
        var levelItems;
        var text1;
        var drillTextLevel = this.layout.renderItems[0]['levelOrderName'].split('#').length;
        for (var h = 0; h < drillTextLevel; h++) {
            text1 = h === 0 ? drillLevelValues['levelText'][h] : text1 + '#' + drillLevelValues['levelText'][h];
        }
        p = drillTextLevel > 1 ? drillTextLevel : p;
        for (var _i = 0, _a = Object['values'](this.layout.renderItems); _i < _a.length; _i++) {
            levelItems = _a[_i];
            var drillLevelText = levelItems['levelOrderName'].split('#');
            if (drillLevelText[0] === drillLevelValues['levelText'][0]) {
                text = p === 0 ? isNullOrUndefined(text1) ? text1 : drillLevelValues['levelText'][p] :
                    directLevel ? text1 : text1 + '#' + drillLevelValues['levelText'][p];
                if (text === levelItems['levelOrderName']) {
                    this.drilledItems.push({ name: levelItems['levelOrderName'], data: levelItems });
                    p++;
                    directLevel = true;
                    if (p <= item['groupIndex']) {
                        text = text + '#' + drillLevelValues['levelText'][p];
                        text1 = text;
                    }
                }
            }
        }
        return directLevel;
    };
    TreeMap.prototype.compareSelectedLabelWithDrillDownItems = function (drillLevelValues, item, i) {
        var drillLevelChild;
        var newDrillItem = new Object();
        var b = drillLevelValues['drillLevel'] + 1;
        if (b === this.drilledItems[i]['data']['groupIndex']) {
            drillLevelChild = this.drilledItems[i]['data']['parent'];
            drillLevelChild['isDrilled'] = true;
            newDrillItem[drillLevelChild[this.drilledItems[i]['data']['groupName']]]
                = [drillLevelChild];
            // to remove all the items after matched drilled items
            this.drilledItems.splice(i, this.drilledItems.length);
        }
        else if (drillLevelValues['drillLevel'] === (this.drilledItems.length - 1)
            || drillLevelValues['drillLevel'] === item['groupIndex']) {
            newDrillItem[item['groupName']] = [item];
        }
        return newDrillItem;
    };
    /* tslint:disable-next-line:max-func-body-length */
    TreeMap.prototype.mouseEndOnTreeMap = function (e) {
        var _this = this;
        var targetEle = e.target;
        var targetId = targetEle.id;
        var totalRect;
        var startEvent;
        var endEvent;
        var directLevel = false;
        var index;
        var newDrillItem = new Object();
        var item;
        var process = true;
        var layoutID = this.element.id + '_TreeMap_' + this.layoutType + '_Layout';
        var drillLevel;
        var templateID = this.element.id + '_Label_Template_Group';
        var drillLevelValues;
        var endBlazorEvent;
        if (targetId.indexOf('_Item_Index') > -1 && this.enableDrillDown && !this.drillMouseMove) {
            e.preventDefault();
            index = parseFloat(targetId.split('_')[6]);
            item = this.layout.renderItems[index];
            var labelText = targetEle.innerHTML;
            if (this.enableBreadcrumb) {
                drillLevelValues = this.calculateSelectedTextLevels(labelText, item);
                drillLevel = drillLevelValues['drillLevel'];
                if (!this.drillDownView && labelText.search('[+]') !== -1) {
                    directLevel = this.calculatePreviousLevelChildItems(labelText, drillLevelValues, item, directLevel);
                }
            }
            if (this.levels.length !== 0 && !item['isLeafItem'] && findChildren(item)['values'] &&
                findChildren(item)['values'].length > 0) {
                if (this.drilledItems.length > 0) {
                    item = directLevel ? this.drilledItems[this.drilledItems.length - 1]['data'] : item;
                    for (var i = 0; i < this.drilledItems.length; i++) {
                        if (!isNullOrUndefined(drillLevel)) { //Compare the selected text level with drilled items
                            var drillLength = this.drilledItems.length;
                            newDrillItem = this.compareSelectedLabelWithDrillDownItems(drillLevelValues, item, i);
                            if (drillLength !== this.drilledItems.length) {
                                i -= 1;
                                break;
                            }
                        } //when clicking the levels drill back to the previous level process takes place
                        if (item['levelOrderName'] === this.drilledItems[i]['name'] && !directLevel && isNullOrUndefined(drillLevel)) {
                            if (item['groupIndex'] === 0 && item['parent'][item['groupName']] instanceof Array) {
                                item['isDrilled'] = !(item['isDrilled']);
                                if (!item['isDrilled']) {
                                    newDrillItem = item['parent'];
                                }
                                else {
                                    newDrillItem[item['groupName']] = [item];
                                }
                            }
                            else {
                                item['isDrilled'] = false;
                                item['parent']['isDrilled'] = true;
                                item = item['parent'];
                                newDrillItem[item['groupName']] = [item];
                            }
                            this.drilledItems.splice(i, 1);
                            i -= 1;
                            break;
                        }
                        else if (i === this.drilledItems.length - 1 && isNullOrUndefined(drillLevel)) {
                            item['isDrilled'] = true; // click the items move to next level.
                            newDrillItem[item['groupName']] = [item];
                        }
                    }
                }
                else {
                    item['isDrilled'] = true;
                    newDrillItem[item['groupName']] = [item];
                }
                startEvent = {
                    cancel: false, name: drillStart, treemap: this, item: newDrillItem, element: targetEle,
                    groupIndex: this.enableBreadcrumb && this.drilledItems.length !== 0 && !isNullOrUndefined(drillLevel) ?
                        this.drilledItems[this.drilledItems.length - 1]['data']['groupIndex'] : item['groupIndex'],
                    groupName: this.enableBreadcrumb && this.drilledItems.length !== 0 && !isNullOrUndefined(drillLevel) ?
                        this.drilledItems[this.drilledItems.length - 1]['data']['name'] : item['name'],
                    rightClick: e.which === 3 ? true : false, childItems: null
                };
                if (this.isBlazor) {
                    var treemap = startEvent.treemap, blazorEventArgs = __rest(startEvent, ["treemap"]);
                    startEvent = blazorEventArgs;
                }
                this.trigger(drillStart, startEvent, function (observedArgs) {
                    _this.currentLevel = item['isDrilled'] && isNullOrUndefined(drillLevel) ? item['groupIndex'] :
                        (!isNullOrUndefined(drillLevel) && _this.enableBreadcrumb && item['isDrilled']) ? drillLevel : null;
                    if (!observedArgs.cancel) {
                        if (document.getElementById(layoutID)) {
                            var layerElementId = document.getElementById(layoutID);
                            layerElementId.parentNode.removeChild(layerElementId);
                        }
                        totalRect = extend({}, _this.areaRect, totalRect, true);
                        if (_this.legendSettings.visible && !isNullOrUndefined(_this.treeMapLegendModule)) {
                            if (!isNullOrUndefined(newDrillItem)) {
                                _this.treeMapLegendModule.legendGroup.textContent = '';
                                _this.treeMapLegendModule.legendGroup = null;
                                _this.treeMapLegendModule.widthIncrement = 0;
                                _this.treeMapLegendModule.heightIncrement = 0;
                                if (_this.enableBreadcrumb && !isNullOrUndefined(drillLevel)) {
                                    _this.drilledLegendItems = {
                                        name: _this.drilledItems[_this.drilledItems.length - 1]['data']['levelOrderName'],
                                        data: _this.drilledItems[_this.drilledItems.length - 1]['data']
                                    };
                                }
                                else {
                                    _this.drilledLegendItems = { name: item['levelOrderName'], data: item };
                                }
                                _this.treeMapLegendModule.renderLegend();
                            }
                            totalRect = !isNullOrUndefined(_this.totalRect) ? _this.totalRect : totalRect;
                        }
                        if (document.getElementById(templateID)) {
                            var drillElementId = document.getElementById(templateID);
                            drillElementId.parentNode.removeChild(drillElementId);
                        }
                        if (!isNullOrUndefined(observedArgs.childItems) && !observedArgs.cancel) {
                            _this.layout.onDemandProcess(observedArgs.childItems);
                        }
                        else {
                            _this.layout.calculateLayoutItems(newDrillItem, totalRect);
                            _this.layout.renderLayoutItems(newDrillItem);
                        }
                    }
                });
                endEvent = { cancel: false, name: drillEnd, treemap: this, renderItems: this.layout.renderItems };
                endBlazorEvent = { cancel: false, name: drillEnd, renderItems: this.layout.renderItems };
                this.trigger(drillEnd, this.isBlazor ? endBlazorEvent : endEvent);
                if (process) {
                    if (!directLevel && isNullOrUndefined(drillLevel)) {
                        this.drilledItems.push({ name: item['levelOrderName'], data: item });
                    }
                }
            }
        }
        this.mouseDown = false;
        this.notify(Browser.touchEndEvent, e);
    };
    TreeMap.prototype.mouseLeaveOnTreeMap = function (e) {
        if (this.treeMapTooltipModule) {
            this.treeMapTooltipModule.removeTooltip();
        }
        if (this.treeMapLegendModule) {
            this.treeMapLegendModule.removeInteractivePointer();
        }
        removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', this);
        if (this.treeMapHighlightModule) {
            removeShape(this.treeMapHighlightModule.shapeHighlightCollection, 'highlight');
            this.treeMapHighlightModule.highLightId = '';
        }
    };
    /**
     * To provide the array of modules needed for maps rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    TreeMap.prototype.requiredModules = function () {
        var modules = [];
        if (this.tooltipSettings.visible) {
            modules.push({
                member: 'treeMapTooltip',
                args: [this]
            });
        }
        if (this.highlightSettings.enable) {
            modules.push({
                member: 'treeMapHighlight',
                args: [this]
            });
        }
        if (this.selectionSettings.enable) {
            modules.push({
                member: 'treeMapSelection',
                args: [this]
            });
        }
        if (this.legendSettings.visible) {
            modules.push({
                member: 'treeMapLegend',
                args: [this]
            });
        }
        return modules;
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    TreeMap.prototype.onPropertyChanged = function (newProp, oldProp) {
        var render = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'background':
                    this.renderBorder();
                    break;
                case 'height':
                case 'width':
                case 'layoutType':
                case 'levels':
                case 'drillDownView':
                case 'renderDirection':
                case 'leafItemSettings':
                case 'legendSettings':
                case 'dataSource':
                    render = true;
                    break;
            }
        }
        if (render) {
            this.createSvg();
            this.render();
        }
    };
    /**
     * Get component name
     */
    TreeMap.prototype.getModuleName = function () {
        return 'treemap';
    };
    /**
     * To destroy the treemap control.
     */
    TreeMap.prototype.destroy = function () {
        this.unWireEVents();
        _super.prototype.destroy.call(this);
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    TreeMap.prototype.getPersistData = function () {
        return '';
    };
    __decorate([
        Property(null)
    ], TreeMap.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "height", void 0);
    __decorate([
        Complex({}, Border)
    ], TreeMap.prototype, "border", void 0);
    __decorate([
        Complex({}, Margin)
    ], TreeMap.prototype, "margin", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "background", void 0);
    __decorate([
        Property('Material')
    ], TreeMap.prototype, "theme", void 0);
    __decorate([
        Complex({}, TitleSettings)
    ], TreeMap.prototype, "titleSettings", void 0);
    __decorate([
        Property('Squarified')
    ], TreeMap.prototype, "layoutType", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "dataSource", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "query", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "weightValuePath", void 0);
    __decorate([
        Property('')
    ], TreeMap.prototype, "rangeColorValuePath", void 0);
    __decorate([
        Property('')
    ], TreeMap.prototype, "equalColorValuePath", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "colorValuePath", void 0);
    __decorate([
        Property([])
    ], TreeMap.prototype, "palette", void 0);
    __decorate([
        Property('TopLeftBottomRight')
    ], TreeMap.prototype, "renderDirection", void 0);
    __decorate([
        Property(false)
    ], TreeMap.prototype, "enableDrillDown", void 0);
    __decorate([
        Property(false)
    ], TreeMap.prototype, "enableBreadcrumb", void 0);
    __decorate([
        Property(' - ')
    ], TreeMap.prototype, "breadcrumbConnector", void 0);
    __decorate([
        Property(false)
    ], TreeMap.prototype, "drillDownView", void 0);
    __decorate([
        Complex({}, InitialDrillSettings)
    ], TreeMap.prototype, "initialDrillDown", void 0);
    __decorate([
        Complex({}, LeafItemSettings)
    ], TreeMap.prototype, "leafItemSettings", void 0);
    __decorate([
        Collection([], LevelSettings)
    ], TreeMap.prototype, "levels", void 0);
    __decorate([
        Complex({}, HighlightSettings)
    ], TreeMap.prototype, "highlightSettings", void 0);
    __decorate([
        Complex({}, SelectionSettings)
    ], TreeMap.prototype, "selectionSettings", void 0);
    __decorate([
        Complex({}, TooltipSettings)
    ], TreeMap.prototype, "tooltipSettings", void 0);
    __decorate([
        Complex({}, LegendSettings)
    ], TreeMap.prototype, "legendSettings", void 0);
    __decorate([
        Property(false)
    ], TreeMap.prototype, "useGroupingSeparator", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "description", void 0);
    __decorate([
        Property(1)
    ], TreeMap.prototype, "tabIndex", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "format", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "load", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "beforePrint", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "loaded", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "itemRendering", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "drillStart", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "drillEnd", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "itemSelected", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "itemHighlight", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "tooltipRendering", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "itemClick", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "itemMove", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "click", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "doubleClick", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "rightClick", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "mouseMove", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "resize", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "legendItemRendering", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "legendRendering", void 0);
    TreeMap = __decorate([
        NotifyPropertyChanges
    ], TreeMap);
    return TreeMap;
}(Component));
/**
 * @private
 */
var LevelsData = /** @__PURE__ @class */ (function () {
    function LevelsData() {
    }
    return LevelsData;
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
 * Legend module class
 */
var TreeMapLegend = /** @__PURE__ @class */ (function () {
    function TreeMapLegend(treemap) {
        this.page = 0;
        this.legendBorderRect = new Rect(0, 0, 0, 0);
        this.currentPage = 0;
        this.heightIncrement = 0;
        this.widthIncrement = 0;
        this.textMaxWidth = 0;
        this.legendInteractiveGradient = [];
        this.legendItemRect = new Rect(0, 0, 0, 0);
        this.treemap = treemap;
        this.addEventListener();
    }
    /**
     * method for legend
     */
    TreeMapLegend.prototype.renderLegend = function () {
        var _this = this;
        this.legendRenderingCollections = [];
        this.legendCollections = [];
        this.legendNames = [];
        this.totalPages = [];
        this.gradientCount = 1;
        this.widthIncrement = 0;
        this.heightIncrement = 0;
        this.defsElement = this.treemap.renderer.createDefs();
        this.treemap.svgObject.appendChild(this.defsElement);
        var eventArgs;
        eventArgs = {
            cancel: false, name: legendRendering, treemap: this.treemap, _changePosition: this.treemap.legendSettings.position,
            position: this.treemap.legendSettings.position
        };
        if (this.treemap.isBlazor) {
            var treemap = eventArgs.treemap, blazorEventArgs = __rest$2(eventArgs, ["treemap"]);
            eventArgs = blazorEventArgs;
        }
        this.treemap.trigger(legendRendering, eventArgs, function (observedArgs) {
            if (!observedArgs.cancel && observedArgs._changePosition !== _this.treemap.legendSettings.position) {
                _this.treemap.legendSettings.position = observedArgs._changePosition;
            }
            _this.calculateLegendBounds();
            if (_this.legendCollections.length > 0) {
                _this.drawLegend();
            }
        });
    };
    /* tslint:disable:no-string-literal */
    /* tslint:disable-next-line:max-func-body-length */
    TreeMapLegend.prototype.calculateLegendBounds = function () {
        var _this = this;
        var treemap = this.treemap;
        var legend = treemap.legendSettings;
        this.findColorMappingLegendItems(LevelsData.levelsData[0]);
        if ((this.treemap.palette.length > 0 || !isNullOrUndefined(this.treemap.colorValuePath))
            && this.legendCollections.length === 0) {
            this.findPaletteLegendItems(LevelsData.levelsData[0], 'Parent');
        }
        if (this.legendCollections.length > 0) {
            var defaultSize = 25;
            var textPadding = 10;
            var position = legend.position;
            var legendTitle = legend.title.text;
            var titleTextStyle = legend.titleStyle;
            var legendMode = legend.mode;
            var shapeX = 0;
            var shapeY = 0;
            var textX = 0;
            var textY = 0;
            var shapeHeight = legend.shapeHeight;
            var shapeWidth = legend.shapeWidth;
            var shapeLocation = [];
            var textLocation = [];
            var orientation_1 = (legend.orientation === 'None') ? ((position === 'Top' || position === 'Bottom'
                || (position === 'Auto' && treemap.availableSize.width <= treemap.availableSize.height))
                ? 'Horizontal' : 'Vertical') : legend.orientation;
            var leftPadding = 10;
            var topPadding = 10;
            var spacing = 10;
            var legendWidth = (legend.width.length > 1) ? (legend.width.indexOf('%') > -1) ? (treemap.availableSize.width / 100)
                * parseFloat(legend.width) : parseFloat(legend.width) : null;
            var legendHeight = (legend.height.length > 1) ? (legend.height.indexOf('%') > -1) ?
                (treemap.availableSize.height / 100) * parseFloat(legend.height) : parseFloat(legend.height) : null;
            titleTextStyle.fontFamily = treemap.themeStyle.fontFamily || titleTextStyle.fontFamily;
            titleTextStyle.size = treemap.themeStyle.legendFontSize || titleTextStyle.size;
            var legendTitleSize = measureText(legendTitle, titleTextStyle);
            var startX_1 = 0;
            var startY_1 = 0;
            var shapePadding = legend.shapePadding;
            var itemTextStyle = legend.textStyle;
            var legendLength = this.legendCollections.length;
            legend.textStyle.size = treemap.themeStyle.legendFontSize || legend.textStyle.size;
            legend.textStyle.fontFamily = treemap.themeStyle.fontFamily || legend.textStyle.fontFamily;
            if (legendMode === 'Default') {
                legendWidth = (isNullOrUndefined(legendWidth)) ? treemap.areaRect.width : legendWidth;
                legendHeight = (isNullOrUndefined(legendHeight)) ? treemap.areaRect.height : legendHeight;
                var j = 0;
                for (var i = 0; i < this.legendCollections.length; i++) {
                    var legendItem = this.legendCollections[i];
                    if (isNullOrUndefined(this.totalPages[this.page])) {
                        this.totalPages[this.page] = { Page: (this.page + 1), Collection: [] };
                    }
                    var legendTextSize = measureText(legendItem['legendName'], legend.textStyle);
                    this.textMaxWidth = Math.max(this.textMaxWidth, legendTextSize.width);
                    if (i === 0) {
                        startX_1 = shapeX = (leftPadding + (shapeWidth / 2));
                        startY_1 = shapeY = topPadding + legendTitleSize.height + (shapeHeight > legendTextSize.height ? shapeHeight / 2
                            : (legendTextSize.height / 4));
                    }
                    else {
                        var maxSize = (legendTextSize.height > shapeHeight) ? legendTextSize.height : shapeHeight;
                        if (orientation_1 === 'Horizontal') {
                            var prvePositionX = (textLocation[j - 1].x + textLocation[j - 1].width) + textPadding + shapeWidth;
                            if ((prvePositionX + shapePadding + legendTextSize.width) > legendWidth) {
                                var nextPositionY = (textLocation[j - 1].y > (shapeLocation[j - 1].y + (shapeHeight / 2)) ?
                                    textLocation[j - 1].y : (shapeLocation[j - 1].y + (shapeHeight / 2))) + topPadding;
                                if ((nextPositionY + maxSize) > legendHeight) {
                                    this.getPageChanged();
                                    j = 0;
                                    shapeLocation = [];
                                    textLocation = [];
                                    shapeX = startX_1;
                                    shapeY = startY_1;
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
                                    shapeX = startX_1;
                                    shapeY = startY_1;
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
                        DisplayText: legendItem['legendName'], element: legendItem['gradientElement'],
                        Shape: { x: shapeX, y: shapeY },
                        Text: { x: textX, y: textY },
                        Fill: legendItem['legendFill'],
                        Data: legendItem['legendData'],
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
                collection.forEach(function (legendObj, index) {
                    var legendRect = new Rect(legendObj['Rect']['x'], legendObj['Rect']['y'], legendObj['Rect']['width'], legendObj['Rect']['height']);
                    if (index === 0) {
                        startX_1 = legendRect.x;
                        startY_1 = legendRect.y;
                    }
                    _this.widthIncrement = Math.max(_this.widthIncrement, Math.abs(startX_1 - (legendRect.x + legendRect.width)));
                    _this.heightIncrement = Math.max(_this.heightIncrement, Math.abs(startY_1 - (legendRect.y + legendRect.height)));
                });
                legendWidth = ((this.widthIncrement < legendWidth) ? this.widthIncrement : legendWidth);
                legendHeight = ((this.heightIncrement < legendHeight) ? this.heightIncrement : legendHeight);
                this.legendItemRect = {
                    x: collection[0]['Rect']['x'], y: collection[0]['Rect']['y'],
                    width: legendWidth, height: legendHeight
                };
            }
            else {
                var itemTextStyle_1 = legend.textStyle;
                var rectWidth_1;
                var rectHeight_1;
                var legendLength_1 = this.legendCollections.length;
                rectWidth_1 = (orientation_1 === 'Horizontal') ? (isNullOrUndefined(legendWidth)) ? (treemap.areaRect.width / legendLength_1) :
                    (legendWidth / legendLength_1) : (isNullOrUndefined(legendWidth)) ? defaultSize : legendWidth;
                rectHeight_1 = (orientation_1 === 'Horizontal') ? (isNullOrUndefined(legendHeight)) ? defaultSize : legendHeight :
                    (isNullOrUndefined(legendHeight)) ? (treemap.areaRect.height / legendLength_1) : (legendHeight / legendLength_1);
                startX_1 = 0;
                startY_1 = legendTitleSize.height + spacing;
                var textPadding_1 = 10;
                var placement = legend.labelPosition;
                var itemStartX = 0;
                var itemStartY = 0;
                var labelAction = legend.labelDisplayMode;
                var maxTextHeight = 0;
                var maxTextWidth = 0;
                for (var i = 0; i < this.legendCollections.length; i++) {
                    startX_1 = (orientation_1 === 'Horizontal') ? (startX_1 + rectWidth_1) : startX_1;
                    startY_1 = (orientation_1 === 'Horizontal') ? startY_1 : (startY_1 + rectHeight_1);
                    var legendText = this.legendCollections[i]['legendName'];
                    var itemTextSize = new Size(0, 0);
                    if (labelAction === 'None') {
                        itemTextSize = measureText(legendText, itemTextStyle_1);
                    }
                    else if (labelAction === 'Trim') {
                        legendText = textTrim((orientation_1 === 'Horizontal' ? rectWidth_1 : rectHeight_1), legendText, itemTextStyle_1);
                        itemTextSize = measureText(legendText, itemTextStyle_1);
                    }
                    else {
                        legendText = '';
                    }
                    maxTextHeight = Math.max(maxTextHeight, itemTextSize.height);
                    maxTextWidth = Math.max(maxTextWidth, itemTextSize.width);
                    if (itemTextSize.width > 0 && itemTextSize.height > 0) {
                        if (orientation_1 === 'Horizontal') {
                            textX = startX_1 + (rectWidth_1 / 2);
                            textY = (placement === 'After') ? (startY_1 + rectHeight_1 + (itemTextSize.height / 2)) + textPadding_1 :
                                (startY_1 - textPadding_1);
                        }
                        else {
                            textX = (placement === 'After') ? startX_1 - (itemTextSize.width / 2) - textPadding_1
                                : (startX_1 + rectWidth_1 + itemTextSize.width / 2) + textPadding_1;
                            textY = startY_1 + (rectHeight_1 / 2) + (itemTextSize.height / 4);
                        }
                    }
                    if (i === 0) {
                        itemStartX = (orientation_1 === 'Horizontal') ? startX_1 : (placement === 'After') ?
                            textX - (itemTextSize.width / 2) : startX_1;
                        itemStartY = (orientation_1 === 'Horizontal') ? (placement === 'After') ? startY_1 :
                            textY - (itemTextSize.height / 2) : startY_1;
                    }
                    if (i === legendLength_1 - 1) {
                        legendWidth = (orientation_1 === 'Horizontal') ? Math.abs((startX_1 + rectWidth_1) - itemStartX) :
                            (rectWidth_1 + maxTextWidth + textPadding_1);
                        legendHeight = (orientation_1 === 'Horizontal') ? (rectHeight_1 + (maxTextHeight / 2) + textPadding_1) :
                            Math.abs((startY_1 + rectHeight_1) - itemStartY);
                    }
                    this.legendRenderingCollections.push({
                        fill: this.legendCollections[i]['legendFill'], x: startX_1, y: startY_1,
                        width: rectWidth_1, height: rectHeight_1, element: this.legendCollections[i]['gradientElement'],
                        text: legendText, textX: textX, textY: textY,
                        textWidth: itemTextSize.width, textHeight: itemTextSize.height,
                        data: this.legendCollections[i]['legendData']
                    });
                }
                this.legendItemRect = { x: itemStartX, y: itemStartY, width: legendWidth, height: legendHeight };
            }
        }
    };
    TreeMapLegend.prototype.getPageChanged = function () {
        this.page++;
        if (isNullOrUndefined(this.totalPages[this.page])) {
            this.totalPages[this.page] = { Page: (this.page + 1), Collection: [] };
        }
    };
    TreeMapLegend.prototype.findColorMappingLegendItems = function (data) {
        var child = findChildren(data)['values'];
        if (child && child.length > 0) {
            this.calculateLegendItems(child);
            if (this.treemap.levels.length > 0) {
                for (var i = 0; i < child.length; i++) {
                    this.findColorMappingLegendItems(child[i]);
                }
            }
        }
    };
    TreeMapLegend.prototype.findPaletteLegendItems = function (data, type) {
        var child;
        var legendFillColor;
        if (!isNullOrUndefined(this.treemap.drilledItems)) {
            if (this.treemap.drilledItems.length === 0 && !isNullOrUndefined(this.treemap.initialDrillDown.groupName)
                && isNullOrUndefined(this.treemap.drilledLegendItems)) {
                var items = findChildren(data)['values'];
                for (var k = 0; k < items.length; k++) {
                    if (items[k]['Name'] === this.treemap.initialDrillDown.groupName) {
                        items[k]['isDrilled'] = !items[k]['isDrilled'];
                        data = items[k];
                        this.treemap.currentLevel = this.treemap.initialDrillDown.groupIndex;
                        legendFillColor = this.treemap.palette.length > 0 ? this.treemap.palette[k % this.treemap.palette.length] :
                            items[k]['data'][this.treemap.colorValuePath];
                        break;
                    }
                }
            }
        }
        if (this.treemap.enableDrillDown && !isNullOrUndefined(this.treemap.drilledLegendItems)) {
            var childElement = this.treemap.drilledLegendItems;
            legendFillColor = childElement['data']['options']['fill'];
            if (childElement['data']['isDrilled']) {
                child = findChildren(childElement['data'])['values'];
            }
            else {
                var parentElement = childElement['data']['parent'];
                child = findChildren(parentElement)['values'];
            }
        }
        else {
            child = findChildren(data)['values'];
        }
        var isDuplicate;
        var legendName;
        if (child && child.length > 0) {
            for (var i = 0; i < child.length; i++) {
                if (isNullOrUndefined(child[i]['data'][this.treemap.legendSettings.showLegendPath]) ||
                    child[i]['data'][this.treemap.legendSettings.showLegendPath]) {
                    legendName = child[i]['data'][this.treemap.legendSettings.valuePath] ?
                        child[i]['data'][this.treemap.legendSettings.valuePath] : child[i]['name'];
                    isDuplicate = this.treemap.legendSettings.removeDuplicateLegend ?
                        this.removeDuplicates(this.legendCollections, legendName) : false;
                    if (!isDuplicate) {
                        this.legendCollections.push({
                            legendName: legendName,
                            legendFill: this.treemap.palette.length > 0 ? !isNullOrUndefined(this.treemap.currentLevel)
                                ? legendFillColor : this.treemap.palette[i % this.treemap.palette.length] :
                                child[i]['data'][this.treemap.colorValuePath],
                            legendData: [],
                            itemArea: child[i]['weight']
                        });
                    }
                }
            }
            this.legendCollections.sort(orderByArea);
            if (this.treemap.palette.length > 0) {
                for (var j = 0; j < this.legendCollections.length; j++) {
                    this.legendCollections[j]['legendFill'] = !isNullOrUndefined(this.treemap.currentLevel)
                        ? legendFillColor : this.treemap.palette[j % this.treemap.palette.length];
                }
            }
        }
    };
    /* tslint:disable-next-line:max-func-body-length */
    TreeMapLegend.prototype.calculateLegendItems = function (data) {
        var isAddData;
        var fill;
        var rangeValue;
        var currentData;
        var legendText;
        var isLeafItem;
        var colorMapProcess = false;
        var colorMapping;
        var groupIndex;
        var leaf = this.treemap.leafItemSettings;
        var levels = this.treemap.levels;
        var equalValue;
        var position = this.treemap.legendSettings.position;
        var gradientElement;
        var x2;
        var y2;
        var actualValue;
        var isDuplicate;
        var isEqualColor;
        var isRange;
        var isDesaturation = false;
        var legendIndex = 0;
        var outfill;
        var labelLegend;
        var otherIndex;
        this.outOfRangeLegend = null;
        for (var i = 0; i < data.length; i++) {
            fill = '';
            isEqualColor = false;
            isRange = false;
            isDesaturation = false;
            currentData = data[i]['data'];
            groupIndex = data[i]['groupIndex'];
            isLeafItem = (this.treemap.levels.length === 0 || groupIndex === this.treemap.levels.length);
            colorMapping = isLeafItem ? leaf.colorMapping : levels[groupIndex].colorMapping;
            for (var _i = 0, colorMapping_1 = colorMapping; _i < colorMapping_1.length; _i++) {
                var colorMap$$1 = colorMapping_1[_i];
                gradientElement = null;
                rangeValue = Number(currentData[this.treemap.rangeColorValuePath]);
                equalValue = currentData[this.treemap.equalColorValuePath];
                colorMap$$1.value = !isNullOrUndefined(colorMap$$1.value) ? colorMap$$1.value.toString() : colorMap$$1.value;
                if (!isNullOrUndefined(colorMap$$1.from) && !isNullOrUndefined(colorMap$$1.to) &&
                    rangeValue >= colorMap$$1.from && rangeValue <= colorMap$$1.to && colorMap$$1.showLegend) {
                    colorMapProcess = true;
                    isRange = true;
                    actualValue = colorMap$$1.from + ' - ' + colorMap$$1.to;
                    legendText = !isNullOrUndefined(colorMap$$1.label) ? colorMap$$1.label : colorMap$$1.from + ' - ' + colorMap$$1.to;
                    fill = isNullOrUndefined(colorMap$$1.color) ? fill : colorMap$$1.color;
                    isAddData = this.isAddNewLegendData(actualValue);
                }
                else if (!isNullOrUndefined(colorMap$$1.value) && equalValue === colorMap$$1.value && colorMap$$1.showLegend) {
                    colorMapProcess = true;
                    isEqualColor = true;
                    actualValue = colorMap$$1.value.toString();
                    legendText = !isNullOrUndefined(colorMap$$1.label) ? colorMap$$1.label : colorMap$$1.value.toString();
                    fill = isNullOrUndefined(colorMap$$1.color) ? fill :
                        Object.prototype.toString.call(colorMap$$1.color) === '[object Array]' ? colorMap$$1.color[0] : colorMap$$1.color;
                    isAddData = this.isAddNewLegendData(actualValue);
                }
                if (colorMapProcess && isNullOrUndefined(colorMap$$1.value) && colorMap$$1.maxOpacity && colorMap$$1.minOpacity
                    && this.treemap.legendSettings.mode === 'Interactive') {
                    var colors = [];
                    var gradient = void 0;
                    isDesaturation = true;
                    if (Object.prototype.toString.call(colorMap$$1.color) === '[object Array]') {
                        for (var q = 0; q < colorMap$$1.color.length; q++) {
                            var offsetColor = 100 / (colorMap$$1.color.length - 1);
                            var offsetValue = q * offsetColor + '%';
                            var stop1Color = { colorStop: offsetValue.toString(), color: colorMap$$1.color[q] };
                            colors.push(stop1Color);
                        }
                    }
                    else {
                        var stop1Color = { colorStop: '0%', color: fill };
                        var stop2Color = { colorStop: '100%', color: fill };
                        colors.push(stop1Color);
                        colors.push(stop2Color);
                    }
                    x2 = position === 'Top' || position === 'Bottom' ? '100%' : '0%';
                    y2 = position === 'Top' || position === 'Bottom' ? '0%' : '100%';
                    gradient = {
                        id: 'groupIndex_' + groupIndex + '_colorIndex_' + this.gradientCount, x1: '0%', y1: '0%', x2: x2, y2: y2
                    };
                    gradientElement = this.treemap.renderer.drawGradient('linearGradient', gradient, colors).childNodes[0];
                    if (Object.prototype.toString.call(colorMap$$1.color) !== '[object Array]') {
                        gradientElement.childNodes[0].setAttribute('stop-opacity', colorMap$$1.minOpacity.toString());
                        gradientElement.childNodes[1].setAttribute('stop-opacity', colorMap$$1.maxOpacity.toString());
                    }
                    this.defsElement.appendChild(gradientElement);
                    this.gradientCount++;
                }
                isDuplicate = this.treemap.legendSettings.removeDuplicateLegend ?
                    this.removeDuplicates(this.legendCollections, legendText) : false;
                if (isAddData && isAddData['process'] && colorMapProcess && !isDuplicate) {
                    colorMapProcess = false;
                    fill = ((Object.prototype.toString.call(colorMap$$1.color) === '[object Array]')) && isNullOrUndefined(gradientElement)
                        && isNullOrUndefined(colorMap$$1.value) ? this.legendGradientColor(colorMap$$1, legendIndex) : fill;
                    this.legendCollections.push({
                        actualValue: actualValue,
                        legendName: legendText, legendFill: fill, legendData: [],
                        gradientElement: !isNullOrUndefined(gradientElement) ? gradientElement : isNullOrUndefined(colorMap$$1.value)
                            ? this.legendLinearGradient : null, name: data[i]['name'],
                        opacity: this.treemap.legendSettings.opacity, borderColor: this.treemap.legendSettings.border.color,
                        borderWidth: this.treemap.legendSettings.border.width
                    });
                    this.legendCollections[this.legendCollections.length - 1]['legendData'].push(data[i]);
                    legendIndex++;
                }
                else if (colorMapProcess && !isDuplicate) {
                    colorMapProcess = false;
                    this.legendCollections[isAddData['value']]['legendData'].push(data[i]);
                }
                if (!isRange && !isDesaturation && !isEqualColor) {
                    if (isNullOrUndefined(colorMap$$1.from) && isNullOrUndefined(colorMap$$1.to)
                        && isNullOrUndefined(colorMap$$1.minOpacity) &&
                        isNullOrUndefined(colorMap$$1.maxOpacity) && isNullOrUndefined(colorMap$$1.value) &&
                        !isNullOrUndefined(colorMap$$1.color)) {
                        outfill = ((Object.prototype.toString.call(colorMap$$1.color) === '[object Array]'))
                            ? colorMap$$1.color[0] : colorMap$$1.color;
                        labelLegend = !isNullOrUndefined(colorMap$$1.label) ? colorMap$$1.label : 'Others';
                        if (isNullOrUndefined(this.outOfRangeLegend)) {
                            this.legendCollections.push({
                                actualValue: labelLegend, legendData: [],
                                legendName: labelLegend, legendFill: outfill
                            });
                            otherIndex = this.legendCollections.length;
                            this.outOfRangeLegend = this.legendCollections[otherIndex - 1];
                            legendIndex++;
                        }
                        this.legendCollections[otherIndex - 1]['legendData'].push(data[i]);
                    }
                }
            }
        }
    };
    TreeMapLegend.prototype.removeDuplicates = function (legendCollection, text) {
        var isDuplicate = false;
        for (var i = 0; i < legendCollection.length; i++) {
            if (legendCollection[i]['legendName'] === text) {
                isDuplicate = true;
                break;
            }
            else {
                continue;
            }
        }
        return isDuplicate;
    };
    TreeMapLegend.prototype.isAddNewLegendData = function (legendText) {
        var newDataProcess;
        var itemValue;
        if (this.legendCollections.length === 0) {
            newDataProcess = true;
        }
        else {
            for (var j = 0; j < this.legendCollections.length; j++) {
                if (legendText === this.legendCollections[j]['actualValue']) {
                    newDataProcess = false;
                    itemValue = j;
                    break;
                }
                else if (j === this.legendCollections.length - 1) {
                    newDataProcess = true;
                }
            }
        }
        return { process: newDataProcess, value: itemValue };
    };
    /* tslint:disable-next-line:max-func-body-length */
    /**
     * To draw the legend
     */
    TreeMapLegend.prototype.drawLegend = function () {
        var treemap = this.treemap;
        var legend = treemap.legendSettings;
        var render = treemap.renderer;
        var fill;
        var textOptions;
        var gradientElement;
        var textFont = legend.textStyle;
        this.legendGroup = render.createGroup({ id: treemap.element.id + '_Legend_Group' });
        this.renderLegendBorder();
        this.renderLegendTitle();
        if (legend.mode === 'Default') {
            this.drawLegendItem(this.currentPage);
        }
        else {
            for (var i = 0; i < this.legendRenderingCollections.length; i++) {
                var itemId = treemap.element.id + '_Legend_Index_' + i;
                var textId = treemap.element.id + '_Legend_Index_' + i + '_Text';
                var item = this.legendRenderingCollections[i];
                gradientElement = item['element'];
                fill = gradientElement ? 'url(#' + gradientElement.id + ')' : item['fill'];
                var bounds = new Rect(item['x'], item['y'], item['width'], item['height']);
                var textLocation = new Location(item['textX'], item['textY']);
                var rectOptions = new RectOption(itemId, fill, legend.shapeBorder, legend.opacity, bounds);
                if (this.treemap.enableRtl) {
                    if (treemap.legendSettings.position === 'Left' || treemap.legendSettings.position === 'Right'
                        || (treemap.legendSettings.position === 'Auto'
                            && this.treemap.availableSize.width >= this.treemap.availableSize.height)) {
                        rectOptions.y = (this.translate.y + this.legendBorderRect.y + this.legendBorderRect.height)
                            - (this.translate.y + rectOptions.height) - Math.abs(this.legendBorderRect.y - rectOptions.y);
                        textLocation.y = (this.translate.y + this.legendBorderRect.y + this.legendBorderRect.height)
                            - (this.translate.y) + (item['textHeight'] / 2)
                            - Math.abs(this.legendBorderRect.y - textLocation.y);
                    }
                    else {
                        rectOptions.x = (this.translate.x + this.legendBorderRect.x + this.legendBorderRect.width)
                            - (this.translate.x + rectOptions.width)
                            - Math.abs(this.legendBorderRect.x - rectOptions.x);
                        textLocation.x = (this.translate.x + this.legendBorderRect.x + this.legendBorderRect.width)
                            - this.translate.x - Math.abs(this.legendBorderRect.x - textLocation.x);
                    }
                }
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'middle', item['text'], '', '');
                renderTextElement(textOptions, textFont, textFont.color || this.treemap.themeStyle.legendTextColor, this.legendGroup);
                this.legendGroup.appendChild(render.drawRectangle(rectOptions));
            }
        }
    };
    TreeMapLegend.prototype.defaultLegendRtlLocation = function (collection, spacing, treemap, legend) {
        var shapeLocation = collection['Shape'];
        var textLocation = collection['Text'];
        var legendText = collection['DisplayText'];
        var textSize = measureText(legendText, legend.textStyle);
        shapeLocation.x = (this.translate.x + this.legendBorderRect.x + this.legendBorderRect.width)
            - (this.translate.x + spacing) - Math.abs(this.legendBorderRect.x - shapeLocation.x);
        textLocation.x = (this.translate.x + this.legendBorderRect.x + this.legendBorderRect.width)
            - (this.translate.x + textSize.width + spacing) - Math.abs(this.legendBorderRect.x - textLocation.x);
        if (treemap.legendSettings.position === 'Left' || treemap.legendSettings.position === 'Right'
            || (treemap.legendSettings.position === 'Auto'
                && this.treemap.availableSize.width >= this.treemap.availableSize.height)) {
            shapeLocation.y = (this.translate.y + this.legendBorderRect.y + this.legendBorderRect.height)
                - this.translate.y - Math.abs(Math.abs(this.legendBorderRect.y) - shapeLocation.y) - (legend.shapeHeight / 2);
            textLocation.y = (this.translate.y + this.legendBorderRect.y + this.legendBorderRect.height)
                - this.translate.y - Math.abs(Math.abs(this.legendBorderRect.y) - textLocation.y);
        }
        return { shapeLocation: shapeLocation, textLocation: textLocation };
    };
    /* tslint:disable-next-line:max-func-body-length */
    TreeMapLegend.prototype.drawLegendItem = function (page) {
        var _this = this;
        var treemap = this.treemap;
        var spacing = 10;
        var legend = treemap.legendSettings;
        var shapeSize = new Size(legend.shapeWidth, legend.shapeHeight);
        var textOptions;
        var legendRtlLocation;
        var render = treemap.renderer;
        var shapeBorder = legend.shapeBorder;
        var eventArgs;
        if (page >= 0 && page < this.totalPages.length) {
            if (document.getElementById(this.legendGroup.id)) {
                document.getElementById(this.legendGroup.id).remove();
            }
            var isLineShape_1 = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine' || legend.shape === 'Cross');
            var strokeColor_1 = isLineShape_1 ? isNullOrUndefined(legend.fill) ? '#000000' : legend.fill : shapeBorder.color;
            var strokeWidth_1 = isLineShape_1 ? (shapeBorder.width === 0) ? 1 : shapeBorder.width : shapeBorder.width;
            var _loop_1 = function (i) {
                var collection = this_1.totalPages[page]['Collection'][i];
                var legendElement = render.createGroup({ id: treemap.element.id + '_Legend_Index_' + i });
                var legendText = collection['DisplayText'];
                var shapeId = treemap.element.id + '_Legend_Shape_Index_' + i;
                var textId = treemap.element.id + '_Legend_Text_Index_' + i;
                var shapeLocation = collection['Shape'];
                var textLocation = collection['Text'];
                if (treemap.enableRtl) {
                    legendRtlLocation = this_1.defaultLegendRtlLocation(collection, spacing, treemap, legend);
                    shapeLocation = legendRtlLocation['shapeLocation'];
                    textLocation = legendRtlLocation['textLocation'];
                }
                eventArgs = {
                    cancel: false, name: legendItemRendering, treemap: treemap, fill: collection['Fill'],
                    shape: legend.shape, imageUrl: legend.imageUrl
                };
                if (this_1.treemap.isBlazor) {
                    var treemap_1 = eventArgs.treemap, blazorEventArgs = __rest$2(eventArgs, ["treemap"]);
                    eventArgs = blazorEventArgs;
                }
                this_1.treemap.trigger(legendItemRendering, eventArgs, function (observedArgs) {
                    var renderOptions = new PathOption(shapeId, observedArgs.fill, strokeWidth_1, isLineShape_1 ? collection['Fill'] : strokeColor_1, legend.opacity, '');
                    legendElement.appendChild(drawSymbol(shapeLocation, observedArgs.shape, shapeSize, observedArgs.imageUrl, renderOptions, legendText));
                    textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'start', legendText, '', '');
                    renderTextElement(textOptions, legend.textStyle, legend.textStyle.color || _this.treemap.themeStyle.legendTextColor, legendElement);
                    _this.legendGroup.appendChild(legendElement);
                });
            };
            var this_1 = this;
            for (var i = 0; i < this.totalPages[page]['Collection'].length; i++) {
                _loop_1(i);
            }
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
                pagingGroup = render.createGroup({ id: treemap.element.id + '_Legend_Paging_Group' });
                var leftPageElement = render.createGroup({ id: treemap.element.id + '_Legend_Left_Paging_Group' });
                var rightPageElement = render.createGroup({ id: treemap.element.id + '_Legend_Right_Paging_Group' });
                var rightPath = ' M ' + rightPageX + ' ' + locY + ' L ' + (rightPageX - width) + ' ' + (locY - height) +
                    ' L ' + (rightPageX - width) + ' ' + (locY + height) + ' z ';
                var leftPath = ' M ' + leftPageX + ' ' + locY + ' L ' + (leftPageX + width) + ' ' + (locY - height) +
                    ' L ' + (leftPageX + width) + ' ' + (locY + height) + ' z ';
                var leftPageOptions = new PathOption(treemap.element.id + '_Left_Page', '#a6a6a6', 0, '#a6a6a6', 1, '', leftPath);
                leftPageElement.appendChild(render.drawPath(leftPageOptions));
                var leftRectPageOptions = new RectOption(treemap.element.id + '_Left_Page_Rect', 'transparent', {}, 1, new Rect(leftPageX - (width / 2), (locY - (height * 2)), width * 2, spacing * 2), '');
                leftPageElement.appendChild(render.drawRectangle(leftRectPageOptions));
                this.wireEvents(leftPageElement);
                var rightPageOptions = new PathOption(treemap.element.id + '_Right_Page', '#a6a6a6', 0, '#a6a6a6', 1, '', rightPath);
                rightPageElement.appendChild(render.drawPath(rightPageOptions));
                var rightRectPageOptions = new RectOption(treemap.element.id + '_Right_Page_Rect', 'transparent', {}, 1, new Rect((rightPageX - width), (locY - height), width, spacing), '');
                rightPageElement.appendChild(render.drawRectangle(rightRectPageOptions));
                this.wireEvents(rightPageElement);
                pagingGroup.appendChild(leftPageElement);
                pagingGroup.appendChild(rightPageElement);
                var pageTextOptions = {
                    'id': treemap.element.id + '_Paging_Text',
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
        }
    };
    TreeMapLegend.prototype.renderLegendBorder = function () {
        var treemap = this.treemap;
        var legend = treemap.legendSettings;
        var legendTitle = legend.title.text;
        var spacing = 10;
        var textStyle = legend.titleStyle;
        var title = textTrim((this.legendItemRect.width + (spacing * 2)), legendTitle, textStyle);
        var textSize = measureText(title, textStyle);
        this.legendBorderRect = new Rect((this.legendItemRect.x - spacing), (this.legendItemRect.y - spacing - textSize.height), (this.legendItemRect.width) + (spacing * 2), (this.legendItemRect.height) + (spacing * 2) + textSize.height +
            (legend.mode === 'Interactive' ? 0 : (this.page !== 0) ? spacing : 0));
        var renderOptions = new RectOption(treemap.element.id + '_Legend_Border', legend.background, legend.border, 1, this.legendBorderRect, '');
        var legendBorder = treemap.renderer.drawRectangle(renderOptions);
        legendBorder.style.pointerEvents = 'none';
        this.legendGroup.appendChild(legendBorder);
        this.getLegendAlignment(treemap, this.legendBorderRect.width, this.legendBorderRect.height, legend);
        this.legendGroup.setAttribute('transform', 'translate( ' + (this.translate.x + (-(this.legendBorderRect.x))) + ' ' +
            (this.translate.y + (-(this.legendBorderRect.y))) + ' )');
        treemap.svgObject.appendChild(this.legendGroup);
    };
    TreeMapLegend.prototype.renderLegendTitle = function () {
        var treemap = this.treemap;
        var legend = treemap.legendSettings;
        var textStyle = legend.titleStyle;
        var legendTitle = legend.title.text;
        var textOptions;
        var spacing = 10;
        var trimTitle = textTrim((this.legendItemRect.width + (spacing * 2)), legendTitle, textStyle);
        var textSize = measureText(trimTitle, textStyle);
        if (legendTitle) {
            textOptions = new TextOption(treemap.element.id + '_LegendTitle', (this.legendItemRect.x) + (this.legendItemRect.width / 2), this.legendItemRect.y - (textSize.height / 2) - (spacing / 2), 'middle', trimTitle, '');
            renderTextElement(textOptions, textStyle, textStyle.color || this.treemap.themeStyle.legendTitleColor, this.legendGroup);
        }
    };
    /**
     * To rendered the interactive pointer
     */
    TreeMapLegend.prototype.renderInteractivePointer = function (e) {
        var treemap = this.treemap;
        var target = e.target;
        var interactiveId = treemap.element.id + '_Interactive_Legend';
        target = !(e.type.indexOf('touch') > -1) ? target :
            document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        var targetItem;
        var legend = treemap.legendSettings;
        if (target.id.indexOf('_Item_Index') > -1 && legend.visible && this.legendRenderingCollections.length > 0) {
            var currentData = void 0;
            var legendRect = void 0;
            var data = void 0;
            var fill = void 0;
            var stroke = void 0;
            var strokeWidth = void 0;
            var legendElement = void 0;
            targetItem = treemap.layout.renderItems[parseFloat(target.id.split('_')[6])];
            var svgRect = treemap.svgObject.getBoundingClientRect();
            for (var i = 0; i < this.legendCollections.length; i++) {
                currentData = this.legendCollections[i];
                legendElement = document.getElementById(treemap.element.id + '_Legend_Index_' + i);
                legendRect = legendElement.getBoundingClientRect();
                var rect_1 = new Rect(Math.abs(legendRect.left - svgRect.left), Math.abs(legendRect.top - svgRect.top), legendRect.width, legendRect.height);
                fill = legendElement.getAttribute('fill');
                stroke = legend.shapeBorder.color;
                strokeWidth = legend.shapeBorder.width;
                if (!isNullOrUndefined(currentData['legendData'])) {
                    data = currentData['legendData'];
                    for (var j = 0; j < data.length; j++) {
                        if (data[j]['levelOrderName'] === targetItem['levelOrderName']) {
                            this.drawInteractivePointer(legend, fill, stroke, interactiveId, strokeWidth, rect_1);
                            break;
                        }
                    }
                }
            }
        }
        else {
            this.removeInteractivePointer();
        }
    };
    TreeMapLegend.prototype.drawInteractivePointer = function (legend, fill, stroke, id, strokeWidth, rect) {
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
        this.treemap.svgObject.appendChild(this.treemap.renderer.drawPath(pathOptions));
    };
    TreeMapLegend.prototype.getLegendAlignment = function (treemap, width, height, legend) {
        var x;
        var y;
        var spacing = 10;
        var totalRect;
        totalRect = extend({}, treemap.areaRect, totalRect, true);
        var areaX = totalRect.x;
        var areaY = totalRect.y;
        var areaHeight = totalRect.height;
        var areaWidth = totalRect.width;
        var totalWidth = treemap.availableSize.width;
        var totalHeight = treemap.availableSize.height;
        var position = legend.position === 'Auto' ? (totalWidth > totalHeight) ? 'Right' : 'Bottom' : legend.position;
        if (legend.position === 'Float') {
            this.translate = legend.location;
        }
        else {
            switch (position) {
                case 'Top':
                case 'Bottom':
                    totalRect.height = (areaHeight - height);
                    x = (totalWidth / 2) - (width / 2);
                    y = (position === 'Top') ? areaY : (areaY + totalRect.height) + spacing;
                    totalRect.y = (position === 'Top') ? areaY + height + spacing : areaY;
                    break;
                case 'Left':
                case 'Right':
                    totalRect.width = (areaWidth - width);
                    x = (position === 'Left') ? areaX : areaX + totalRect.width;
                    y = (totalHeight / 2) - (height / 2);
                    totalRect.x = (position === 'Left') ? areaX + width : areaX;
                    break;
            }
            switch (legend.alignment) {
                case 'Near':
                    if (position === 'Top' || position === 'Bottom') {
                        x = totalRect.x;
                    }
                    else {
                        y = totalRect.y;
                    }
                    break;
                case 'Far':
                    if (position === 'Top' || position === 'Bottom') {
                        x = totalWidth - width;
                    }
                    else {
                        y = totalHeight - height;
                    }
                    break;
            }
            this.treemap.totalRect = totalRect;
            this.translate = new Location(x, y);
        }
    };
    TreeMapLegend.prototype.mouseUpHandler = function (e) {
        this.renderInteractivePointer(e);
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(this.removeInteractivePointer.bind(this), 3000);
    };
    /**
     * To remove the interactive pointer
     */
    TreeMapLegend.prototype.removeInteractivePointer = function () {
        if (document.getElementById(this.treemap.element.id + '_Interactive_Legend')) {
            var legendElementId = document.getElementById(this.treemap.element.id + '_Interactive_Legend');
            legendElementId.parentNode.removeChild(legendElementId);
        }
    };
    /**
     * To change the next page
     */
    TreeMapLegend.prototype.changeNextPage = function (e) {
        this.currentPage = (e.target.id.indexOf('_Left_Page_') > -1) ? (this.currentPage - 1) :
            (this.currentPage + 1);
        this.drawLegend();
    };
    /**
     * Wire events for event handler
     */
    TreeMapLegend.prototype.wireEvents = function (element) {
        EventHandler.add(element, Browser.touchStartEvent, this.changeNextPage, this);
    };
    /**
     * To add the event listener
     */
    TreeMapLegend.prototype.addEventListener = function () {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.on(Browser.touchMoveEvent, this.renderInteractivePointer, this);
        this.treemap.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    };
    /**
     * To remove the event listener
     */
    TreeMapLegend.prototype.removeEventListener = function () {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.off(Browser.touchMoveEvent, this.renderInteractivePointer);
        this.treemap.off(Browser.touchEndEvent, this.mouseUpHandler);
    };
    /**
     * Get module name.
     */
    TreeMapLegend.prototype.getModuleName = function () {
        return 'treeMapLegend';
    };
    /**
     * To destroy the legend.
     * @return {void}
     * @private
     */
    TreeMapLegend.prototype.destroy = function (treemap) {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    };
    /**
     * Get the gradient color for interactive legend.
     */
    TreeMapLegend.prototype.legendGradientColor = function (colorMap$$1, legendIndex) {
        var legendFillColor;
        var xmlns = 'http://www.w3.org/2000/svg';
        if (!isNullOrUndefined(colorMap$$1.color) && Object.prototype.toString.call(colorMap$$1.color) === '[object Array]') {
            var defElement = this.treemap.renderer.createDefs();
            var linerGradientEle = document.createElementNS(xmlns, 'linearGradient');
            var opacity = 1;
            var position = this.treemap.legendSettings.position;
            var x2 = void 0;
            var y2 = void 0;
            x2 = position === 'Top' || position === 'Bottom' ? '100' : '0';
            y2 = position === 'Top' || position === 'Bottom' ? '0' : '100';
            linerGradientEle.setAttribute('id', 'linear_' + legendIndex);
            linerGradientEle.setAttribute('x1', 0 + '%');
            linerGradientEle.setAttribute('y1', 0 + '%');
            linerGradientEle.setAttribute('x2', x2 + '%');
            linerGradientEle.setAttribute('y2', y2 + '%');
            for (var b = 0; b < colorMap$$1.color.length; b++) {
                var offsetColor = 100 / (colorMap$$1.color.length - 1);
                var stopEle = document.createElementNS(xmlns, 'stop');
                stopEle.setAttribute('offset', b * offsetColor + '%');
                stopEle.setAttribute('stop-color', colorMap$$1.color[b]);
                stopEle.setAttribute('stop-opacity', opacity.toString());
                linerGradientEle.appendChild(stopEle);
            }
            defElement.appendChild(linerGradientEle);
            this.legendLinearGradient = linerGradientEle;
            var color = 'url(' + '#linear_' + legendIndex + ')';
            this.defsElement.appendChild(linerGradientEle);
            legendFillColor = color;
        }
        return legendFillColor;
    };
    return TreeMapLegend;
}());

/**
 * Performing treemap highlight
 */
var TreeMapHighlight = /** @__PURE__ @class */ (function () {
    function TreeMapHighlight(treeMap) {
        this.target = 'highlight';
        this.shapeTarget = 'highlight';
        this.shapeHighlightCollection = [];
        this.legendHighlightCollection = [];
        this.currentElement = [];
        this.treemap = treeMap;
        this.addEventListener();
    }
    /* tslint:disable:no-string-literal */
    //tslint:disable:max-func-body-length
    /* tslint:disable:max-line-length */
    /**
     * Mouse down event in highlight
     */
    TreeMapHighlight.prototype.mouseMove = function (e) {
        var treemap = this.treemap;
        var processHighlight;
        var targetId = e.target.id;
        var eventArgs;
        var items = [];
        var eventBlazorArgs;
        var highlight = this.treemap.highlightSettings;
        var item;
        var highLightElements = [];
        var process;
        var treeMapElement;
        var element;
        var orders;
        var selectionModule = this.treemap.treeMapSelectionModule;
        if (targetId.indexOf('_Item_Index') > -1 && (selectionModule ? selectionModule.selectionId !== targetId : true)) {
            if (this.highLightId !== targetId) {
                treeMapElement = document.getElementById(treemap.element.id + '_TreeMap_' + treemap.layoutType + '_Layout');
                var selectionElements = document.getElementsByClassName('treeMapSelection');
                item = this.treemap.layout.renderItems[parseFloat(targetId.split('_')[6])];
                var index = void 0;
                if (this.treemap.legendSettings.visible) {
                    var collection = this.treemap.treeMapLegendModule.legendCollections;
                    var length_1 = this.treemap.treeMapLegendModule.legendCollections.length;
                    index = getLegendIndex(length_1, item, treemap);
                    this.shapeElement = this.treemap.legendSettings.mode === 'Default' ? document.getElementById('container_Legend_Shape_Index_' + index) : document.getElementById('container_Legend_Index_' + index);
                    if (this.shapeElement !== null && (selectionModule ? this.shapeElement.getAttribute('id') !== selectionModule.legendSelectId : true)) {
                        if (selectionModule ? this.shapeElement !== selectionModule.shapeElement : true) {
                            this.currentElement.push({ currentElement: this.shapeElement });
                            removeShape(this.shapeHighlightCollection, 'highlight');
                            this.shapeHighlightCollection.push({ legendEle: this.shapeElement, oldFill: collection[index]['legendFill'],
                                oldOpacity: collection[index]['opacity'], oldBorderColor: collection[index]['borderColor'],
                                oldBorderWidth: collection[index]['borderWidth']
                            });
                            setColor(this.shapeElement, highlight.fill, highlight.opacity, highlight.border.color, highlight.border.width.toString());
                            this.target = 'highlight';
                        }
                        else if (this.currentElement.length > 0 && this.currentElement[this.currentElement.length - 1]['currentElement'] !== this.shapeElement) {
                            removeSelectionWithHighlight(this.shapeHighlightCollection, this.currentElement, treemap);
                            this.highLightId = '';
                        }
                    }
                    else if (this.currentElement.length > 0 && this.currentElement[this.currentElement.length - 1]['currentElement'] !== this.shapeElement) {
                        removeSelectionWithHighlight(this.shapeHighlightCollection, this.currentElement, treemap);
                        this.highLightId = '';
                    }
                }
                orders = findHightLightItems(item, [], highlight.mode, treemap);
                if (this.treemap.legendSettings.visible ? selectionModule ? this.shapeElement ? this.shapeElement.getAttribute('id') !== selectionModule.legendSelectId : true : true : true) {
                    if (this.treemap.legendSettings.visible ? selectionModule ? this.shapeElement !== selectionModule.shapeElement : true : true) {
                        for (var i = 0; i < treeMapElement.childElementCount; i++) {
                            element = treeMapElement.childNodes[i];
                            process = true;
                            item = treemap.layout.renderItems[element.id.split('_')[6]];
                            for (var j = 0; j < selectionElements.length; j++) {
                                if (element.id === selectionElements[j].id) {
                                    process = false;
                                    break;
                                }
                            }
                            if (orders.indexOf(item['levelOrderName']) > -1 && process) {
                                highLightElements.push(element);
                                items.push(item);
                            }
                        }
                        removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', treemap);
                        for (var k = 0; k < highLightElements.length; k++) {
                            element = highLightElements[k];
                            applyOptions(element.childNodes[0], { border: highlight.border, fill: highlight.fill, opacity: highlight.opacity });
                            element.classList.add('treeMapHighLight');
                            this.highLightId = targetId;
                        }
                        eventArgs = { cancel: false, name: itemHighlight, treemap: treemap, items: items, elements: highLightElements };
                        eventBlazorArgs = { cancel: false, name: itemHighlight, items: items, elements: highLightElements };
                        treemap.trigger(itemHighlight, treemap.isBlazor ? eventBlazorArgs : eventArgs);
                    }
                    else {
                        processHighlight = false;
                    }
                }
            }
        }
        else if (targetId.indexOf('_Legend_Shape') > -1 || targetId.indexOf('_Legend_Index') > -1) {
            if (this.treemap.legendSettings.visible && (selectionModule ? selectionModule.legendSelectId !== targetId : true) && (selectionModule ? selectionModule.shapeSelectId !== targetId : true)) {
                var index = void 0;
                var itemIndex = void 0;
                var groupIndex = void 0;
                var length_2;
                var targetEle = document.getElementById(targetId);
                if (this.shapeTarget === 'highlight') {
                    removeLegend(this.legendHighlightCollection, 'highlight');
                }
                this.shapeTarget = 'highlight';
                index = this.treemap.legendSettings.mode === 'Default' ? parseFloat(targetId.split('_')[4]) : parseFloat(targetId.split('_')[3]);
                var dataLength = this.treemap.treeMapLegendModule.legendCollections[index]['legendData'].length;
                var collection = this.treemap.treeMapLegendModule.legendCollections;
                var legendIndex = parseInt(targetId[targetId.length - 1], 10);
                for (var i = 0; i < dataLength; i++) {
                    for (var j = 0; j < this.treemap.layout.renderItems.length; j++) {
                        if (this.treemap.treeMapLegendModule.legendCollections[index]['legendData'][i]['levelOrderName'] === this.treemap.layout.renderItems[j]['levelOrderName']) {
                            itemIndex = j;
                            groupIndex = this.treemap.layout.renderItems[j]['groupIndex'];
                            var nodeEle = document.getElementById('container_Level_Index_' + groupIndex + '_Item_Index_' + itemIndex + '_RectPath');
                            if (i === 0) {
                                this.legendHighlightCollection = [];
                                pushCollection(this.legendHighlightCollection, legendIndex, j, targetEle, nodeEle, this.treemap.layout.renderItems, collection);
                                length_2 = this.legendHighlightCollection.length;
                                this.legendHighlightCollection[length_2 - 1]['ShapeCollection'] = { Elements: [] };
                            }
                            setColor(targetEle, highlight.fill, highlight.opacity, highlight.border.color, highlight.border.width.toString());
                            setColor(nodeEle, highlight.fill, highlight.opacity, highlight.border.color, highlight.border.width.toString());
                            length_2 = this.legendHighlightCollection.length;
                            this.legendHighlightCollection[length_2 - 1]['ShapeCollection']['Elements'].push(nodeEle);
                        }
                    }
                }
            }
        }
        else {
            if (selectionModule ? this.shapeElement ? this.shapeElement.getAttribute('id') !== selectionModule.legendSelectId : true : true) {
                if (selectionModule ? this.shapeElement !== selectionModule.shapeElement : true && this.treemap.legendSettings.visible) {
                    removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', treemap);
                }
            }
            if ((this.shapeTarget === 'highlight' || this.target === 'highlight') && this.treemap.legendSettings.visible) {
                if (selectionModule ? this.shapeElement ? this.shapeElement.getAttribute('id') !== selectionModule.legendSelectId : true : true) {
                    if (selectionModule ? this.shapeElement !== selectionModule.shapeElement : true && selectionModule ? selectionModule.legendSelect : true) {
                        removeShape(this.shapeHighlightCollection, 'highlight');
                        this.shapeHighlightCollection = [];
                    }
                }
            }
            if (this.shapeTarget === 'highlight' && this.treemap.legendSettings.visible) {
                removeLegend(this.legendHighlightCollection, 'highlight');
            }
            this.highLightId = '';
            processHighlight = false;
        }
        return processHighlight;
    };
    /**
     * To bind events for highlight
     */
    TreeMapHighlight.prototype.addEventListener = function () {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.on(Browser.touchMoveEvent, this.mouseMove, this);
    };
    /**
     * To unbind events for highlight
     */
    TreeMapHighlight.prototype.removeEventListener = function () {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.off(Browser.touchMoveEvent, this.mouseMove);
    };
    /**
     * Get module name.
     */
    TreeMapHighlight.prototype.getModuleName = function () {
        return 'treeMapHighlight';
    };
    /**
     * To destroy the hightlight.
     * @return {void}
     * @private
     */
    TreeMapHighlight.prototype.destroy = function (treeMap) {
        this.removeEventListener();
    };
    return TreeMapHighlight;
}());
/**
 * Performing treemap selection
 */
var TreeMapSelection = /** @__PURE__ @class */ (function () {
    function TreeMapSelection(treeMap) {
        this.shapeSelectionCollection = [];
        this.legendSelectionCollection = [];
        this.shapeSelect = true;
        this.legendSelect = true;
        this.treemap = treeMap;
        this.addEventListener();
    }
    /* tslint:disable:no-string-literal */
    /**
     * Mouse down event in selection
     */
    TreeMapSelection.prototype.mouseDown = function (e) {
        var targetEle = e.target;
        var eventArgs;
        var eventBlazorArgs;
        var treemap = this.treemap;
        var items = [];
        var targetId = targetEle.id;
        var item;
        var selectionElements = [];
        var treeMapElement;
        var element;
        var orders;
        var selection = treemap.selectionSettings;
        var highlightModule = this.treemap.treeMapHighlightModule;
        var layoutID = treemap.element.id + '_TreeMap_' + treemap.layoutType + '_Layout';
        if (targetId.indexOf('_Item_Index') > -1) {
            e.preventDefault();
            if (this.selectionId !== targetId && this.legendSelect) {
                treeMapElement = document.getElementById(layoutID);
                item = treemap.layout.renderItems[parseFloat(targetId.split('_')[6])];
                var index = void 0;
                if (this.treemap.legendSettings.visible) {
                    this.shapeSelect = false;
                    var length_3 = this.treemap.treeMapLegendModule.legendCollections.length;
                    var collection = this.treemap.treeMapLegendModule.legendCollections;
                    this.shapeElement = undefined;
                    removeShape(this.shapeSelectionCollection, 'selection');
                    if (highlightModule) {
                        highlightModule.shapeTarget = 'selection';
                        highlightModule.shapeHighlightCollection = [];
                    }
                    index = getLegendIndex(length_3, item, treemap);
                    this.shapeElement = this.treemap.legendSettings.mode === 'Default' ? document.getElementById('container_Legend_Shape_Index_' + index) : document.getElementById('container_Legend_Index_' + index);
                    if (this.shapeElement !== null) {
                        this.shapeSelectId = this.shapeElement.getAttribute('id');
                        this.shapeSelectionCollection.push({ legendEle: this.shapeElement, oldFill: collection[index]['legendFill'],
                            oldOpacity: collection[index]['opacity'], oldBorderColor: collection[index]['borderColor'],
                            oldBorderWidth: collection[index]['borderWidth']
                        });
                        setColor(this.shapeElement, selection.fill, selection.opacity, selection.border.color, selection.border.width.toString());
                    }
                }
                orders = findHightLightItems(item, [], selection.mode, treemap);
                for (var i = 0; i < treeMapElement.childElementCount; i++) {
                    element = treeMapElement.childNodes[i];
                    item = treemap.layout.renderItems[element.id.split('_')[6]];
                    if (orders.indexOf(item['levelOrderName']) > -1) {
                        selectionElements.push(element);
                        items.push(item);
                    }
                }
                removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', treemap);
                this.selectionId = targetId;
                var highLightElements = document.getElementsByClassName('treeMapHighLight');
                for (var k = 0; k < selectionElements.length; k++) {
                    element = selectionElements[k];
                    if (highLightElements.length > 0) {
                        for (var j = 0; j < highLightElements.length; j++) {
                            if (highLightElements[j].id === element.id) {
                                highLightElements[j].classList.remove('treeMapHighLight');
                            }
                            applyOptions(element.childNodes[0], { border: selection.border, fill: selection.fill, opacity: selection.opacity });
                            element.classList.add('treeMapSelection');
                        }
                    }
                    else {
                        applyOptions(element.childNodes[0], { border: selection.border, fill: selection.fill, opacity: selection.opacity });
                        element.classList.add('treeMapSelection');
                    }
                    eventArgs = { cancel: false, name: itemSelected, treemap: treemap, items: items, elements: selectionElements };
                    eventBlazorArgs = { cancel: false, name: itemSelected, items: items, elements: selectionElements };
                    treemap.trigger(itemSelected, treemap.isBlazor ? eventBlazorArgs : eventArgs);
                }
            }
            else {
                removeShape(this.shapeSelectionCollection, 'selection');
                this.shapeElement = undefined;
                this.shapeSelect = true;
                this.shapeSelectId = '';
                removeClassNames(document.getElementsByClassName('treeMapSelection'), 'treeMapSelection', treemap);
                this.selectionId = '';
            }
        }
        else if (targetId.indexOf('_Legend_Shape') > -1 || targetId.indexOf('_Legend_Index') > -1) {
            var collection = this.treemap.treeMapLegendModule.legendCollections;
            if (this.treemap.legendSettings.visible && this.legendSelectId !== targetId && this.shapeSelect) {
                var index = void 0;
                var itemIndex = void 0;
                var groupIndex = void 0;
                var length_4;
                this.legendSelectId = targetId;
                this.legendSelect = false;
                var legendIndex = parseInt(targetId[targetId.length - 1], 10);
                var targetEle_1 = document.getElementById(targetId);
                removeLegend(this.legendSelectionCollection, 'selection');
                if (highlightModule) {
                    highlightModule.shapeTarget = 'selection';
                }
                index = this.treemap.legendSettings.mode === 'Default' ? parseFloat(targetId.split('_')[4]) : parseFloat(targetId.split('_')[3]);
                var dataLength = this.treemap.treeMapLegendModule.legendCollections[index]['legendData'].length;
                for (var k = 0; k < dataLength; k++) {
                    for (var l = 0; l < this.treemap.layout.renderItems.length; l++) {
                        if (this.treemap.treeMapLegendModule.legendCollections[index]['legendData'][k]['levelOrderName'] === this.treemap.layout.renderItems[l]['levelOrderName']) {
                            itemIndex = l;
                            groupIndex = this.treemap.layout.renderItems[l]['groupIndex'];
                            var nodeEle = document.getElementById('container_Level_Index_' + groupIndex + '_Item_Index_' + itemIndex + '_RectPath');
                            if (k === 0) {
                                pushCollection(this.legendSelectionCollection, legendIndex, l, targetEle_1, nodeEle, this.treemap.layout.renderItems, collection);
                                length_4 = this.legendSelectionCollection.length;
                                this.legendSelectionCollection[length_4 - 1]['ShapeCollection'] = { Elements: [] };
                            }
                            setColor(targetEle_1, selection.fill, selection.opacity, selection.border.color, selection.border.width.toString());
                            setColor(nodeEle, selection.fill, selection.opacity, selection.border.color, selection.border.width.toString());
                            length_4 = this.legendSelectionCollection.length;
                            this.legendSelectionCollection[length_4 - 1]['ShapeCollection']['Elements'].push(nodeEle);
                        }
                    }
                }
            }
            else {
                removeLegend(this.legendSelectionCollection, 'Selection');
                if (highlightModule) {
                    highlightModule.shapeTarget = 'highlight';
                }
                this.legendSelect = true;
                this.legendSelectId = '';
            }
        }
    };
    /**
     * To bind events for selection
     */
    TreeMapSelection.prototype.addEventListener = function () {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.on(Browser.touchStartEvent, this.mouseDown, this);
    };
    /**
     * To unbind events for selection
     */
    TreeMapSelection.prototype.removeEventListener = function () {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.off(Browser.touchStartEvent, this.mouseDown);
    };
    /**
     * Get module name.
     */
    TreeMapSelection.prototype.getModuleName = function () {
        return 'treeMapSelection';
    };
    /**
     * To destroy the selection.
     * @return {void}
     * @private
     */
    TreeMapSelection.prototype.destroy = function (treeMap) {
        this.removeEventListener();
    };
    return TreeMapSelection;
}());

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
 * Render Tooltip
 */
var TreeMapTooltip = /** @__PURE__ @class */ (function () {
    function TreeMapTooltip(treeMap) {
        this.treemap = treeMap;
        this.tooltipSettings = this.treemap.tooltipSettings;
        this.tooltipId = this.treemap.element.id + '_TreeMapTooltip';
        this.addEventListener();
    }
    /* tslint:disable:no-string-literal */
    TreeMapTooltip.prototype.renderTooltip = function (e) {
        var _this = this;
        var pageX;
        var pageY;
        var target;
        var touchArg;
        var tootipArgs;
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
        var value;
        var targetId = target.id;
        var item = {};
        var tooltipEle;
        var location;
        var toolTipHeader;
        var toolTipData = {};
        var tooltipContent = [];
        var markerFill;
        if (targetId.indexOf('_Item_Index') > -1) {
            item = this.treemap.layout.renderItems[parseFloat(targetId.split('_')[6])];
            if (!isNullOrUndefined(item)) {
                toolTipHeader = item['name'];
                value = item['weight'];
                toolTipData = item['data'];
                markerFill = item['options']['fill'];
                if (this.treemap.enableRtl) {
                    tooltipContent = [textFormatter(this.tooltipSettings.format, toolTipData, this.treemap) ||
                            formatValue(value, this.treemap) + ' : ' + this.treemap.weightValuePath.toString()];
                }
                else {
                    tooltipContent = [textFormatter(this.tooltipSettings.format, toolTipData, this.treemap) ||
                            this.treemap.weightValuePath.toString() + ' : ' + formatValue(value, this.treemap)];
                }
                if (document.getElementById(this.tooltipId)) {
                    tooltipEle = document.getElementById(this.tooltipId);
                }
                else {
                    tooltipEle = createElement('div', {
                        id: this.treemap.element.id + '_TreeMapTooltip',
                        className: 'EJ2-TreeMap-Tooltip',
                        styles: 'position: absolute;pointer-events:none;'
                    });
                    document.getElementById(this.treemap.element.id + '_Secondary_Element').appendChild(tooltipEle);
                }
                location = getMousePosition(pageX, pageY, this.treemap.svgObject);
                location.y = (this.tooltipSettings.template) ? location.y + 10 : location.y;
                this.tooltipSettings.textStyle.fontFamily = this.treemap.themeStyle.fontFamily;
                this.tooltipSettings.textStyle.color = this.treemap.themeStyle.tooltipFontColor
                    || this.tooltipSettings.textStyle.color;
                this.tooltipSettings.textStyle.opacity = this.treemap.themeStyle.tooltipTextOpacity
                    || this.tooltipSettings.textStyle.opacity;
                tootipArgs = {
                    cancel: false, name: tooltipRendering, item: item,
                    options: {
                        location: location, text: tooltipContent, data: toolTipData,
                        textStyle: this.tooltipSettings.textStyle, template: this.tooltipSettings.template
                    },
                    treemap: this.treemap,
                    element: target, eventArgs: e
                };
                if (this.treemap.isBlazor) {
                    var tooltipArgs_1 = {
                        cancel: false,
                        location: tootipArgs.options['location'],
                        text: tootipArgs.options['text'],
                        textStyle: tootipArgs.options['textStyle'],
                        data: tootipArgs.options['data'],
                        template: tootipArgs.options['template'],
                        name: tooltipRendering
                    };
                    this.treemap.trigger(tooltipRendering, tooltipArgs_1, function (args) {
                        _this.addTooltip(null, markerFill, tooltipEle, tooltipArgs_1);
                    });
                }
                else {
                    this.treemap.trigger(tooltipRendering, tootipArgs, function (args) {
                        _this.addTooltip(tootipArgs, markerFill, tooltipEle);
                    });
                }
            }
        }
        else {
            this.removeTooltip();
        }
    };
    TreeMapTooltip.prototype.addTooltip = function (tootipArgs, markerFill, tooltipEle, eventArgs) {
        var cancel;
        var args;
        if (!isNullOrUndefined(tootipArgs)) {
            var c = tootipArgs.cancel, otherArgs = __rest$3(tootipArgs, ["cancel"]);
            cancel = c;
            args = otherArgs.options;
        }
        else {
            cancel = eventArgs.cancel;
            args = eventArgs;
        }
        if (!cancel) {
            this.svgTooltip = new Tooltip({
                enable: true,
                header: '',
                data: args['data'],
                template: args['template'],
                content: args['text'],
                shapes: [],
                location: args['location'],
                palette: [markerFill],
                areaBounds: this.treemap.areaRect,
                textStyle: args['textStyle'],
                blazorTemplate: { name: 'TooltipTemplate', parent: this.treemap.tooltipSettings }
            });
            this.svgTooltip.opacity = this.treemap.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
            this.svgTooltip.appendTo(tooltipEle);
        }
        else {
            this.removeTooltip();
        }
    };
    TreeMapTooltip.prototype.mouseUpHandler = function (e) {
        this.renderTooltip(e);
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
    };
    TreeMapTooltip.prototype.removeTooltip = function () {
        if (document.getElementsByClassName('EJ2-TreeMap-Tooltip').length > 0) {
            var tooltipElementId = document.getElementsByClassName('EJ2-TreeMap-Tooltip')[0];
            tooltipElementId.parentNode.removeChild(tooltipElementId);
        }
    };
    /**
     * To bind events for tooltip module
     */
    TreeMapTooltip.prototype.addEventListener = function () {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.on(Browser.touchMoveEvent, this.renderTooltip, this);
        this.treemap.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    };
    /**
     * To unbind events for tooltip module
     */
    TreeMapTooltip.prototype.removeEventListener = function () {
        if (this.treemap.isDestroyed) {
            return;
        }
        this.treemap.off(Browser.touchMoveEvent, this.renderTooltip);
        this.treemap.off(Browser.touchEndEvent, this.mouseUpHandler);
    };
    /**
     * Get module name.
     */
    TreeMapTooltip.prototype.getModuleName = function () {
        return 'treeMapTooltip';
    };
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    TreeMapTooltip.prototype.destroy = function (treeMap) {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    };
    return TreeMapTooltip;
}());

/**
 * export all modules from treemap component
 */

/**
 * exporting all modules from tree map index
 */

export { TreeMap, LevelsData, Border, Margin, Font, CommonTitleSettings, SubTitleSettings, TitleSettings, ColorMapping, LegendSettings, InitialDrillSettings, LeafItemSettings, TooltipSettings, SelectionSettings, HighlightSettings, LevelSettings, load, loaded, beforePrint, itemRendering, drillStart, drillEnd, itemSelected, itemHighlight, tooltipRendering, itemClick, itemMove, click, doubleClick, rightClick, mouseMove, legendItemRendering, legendRendering, resize, defaultFont, Theme, getThemeStyle, Size, stringToNumber, Rect, RectOption, PathOption, measureText, TextOption, textTrim, Location, findPosition, createTextStyle, renderTextElement, getElement, itemsToOrder, isContainsData, findChildren, findHightLightItems, getTemplateFunction, convertElement, findLabelLocation, measureElement, getArea, getShortestEdge, convertToContainer, convertToRect, getMousePosition, colorMap, deSaturationColor, colorCollections, rgbToHex, getColorByValue, getGradientColor, getPercentageColor, getPercentage, wordWrap, textWrap, hide, orderByArea, removeClassNames, applyOptions, textFormatter, formatValue, ColorValue, convertToHexCode, componentToHex, convertHexToColor, colorNameToHex, drawSymbol, renderLegendShape, isParentItem, TreeMapAjax, removeShape, removeLegend, setColor, removeSelectionWithHighlight, getLegendIndex, pushCollection, ExportUtils, TreeMapLegend, LayoutPanel, TreeMapHighlight, TreeMapSelection, TreeMapTooltip };
//# sourceMappingURL=ej2-treemap.es5.js.map
