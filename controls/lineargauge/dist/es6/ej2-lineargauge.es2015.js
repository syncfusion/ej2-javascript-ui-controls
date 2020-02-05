import { Animation, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, NotifyPropertyChanges, Property, compile, createElement, isBlazor, isNullOrUndefined, merge, print, remove, resetBlazorTemplate, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { SvgRenderer, Tooltip } from '@syncfusion/ej2-svg-base';
import { PdfBitmap, PdfDocument, PdfPageOrientation } from '@syncfusion/ej2-pdf-export';

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Options for customizing the fonts.
 */
class Font extends ChildProperty {
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
/**
 * Configures the margin of linear gauge.
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
/**
 * Configures the border in linear gauge.
 */
class Border extends ChildProperty {
}
__decorate$1([
    Property(null)
], Border.prototype, "color", void 0);
__decorate$1([
    Property(0)
], Border.prototype, "width", void 0);
/**
 * Options for customizing the annotation.
 */
class Annotation extends ChildProperty {
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
/**
 * Options for customizing the container of linear gauge.
 */
class Container extends ChildProperty {
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
/**
 * Options for customizing the tooltip in linear gauge.
 */
class TooltipSettings extends ChildProperty {
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

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/** Options for customizing the axis line. */
class Line extends ChildProperty {
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
/**
 * Options for customizing the axis labels appearance.
 */
class Label extends ChildProperty {
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
/**
 * Options for customizing the ranges of an axis.
 */
class Range extends ChildProperty {
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
/**
 * Options for customizing the minor tick lines.
 */
class Tick extends ChildProperty {
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
/**
 * Options for customizing the pointers of an axis.
 */
class Pointer extends ChildProperty {
    constructor() {
        super(...arguments);
        /** @private */
        this.animationComplete = true;
        /** @private */
        this.currentValue = null;
    }
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
/**
 * Options for customizing the axis of a gauge.
 */
class Axis extends ChildProperty {
    constructor() {
        /**
         * Specifies the minimum value of an axis.
         * @default 0
         */
        super(...arguments);
        /** @private */
        this.visibleLabels = [];
    }
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

/**
 * Specifies the linear gauge constant value
 */
/** @private */
const loaded = 'loaded';
/** @private */
const load = 'load';
/** @private */
const animationComplete = 'animationComplete';
/** @private */
const axisLabelRender = 'axisLabelRender';
/** @private */
const tooltipRender = 'tooltipRender';
/** @private */
const annotationRender = 'annotationRender';
/** @private */
const gaugeMouseMove = 'gaugeMouseMove';
/** @private */
const gaugeMouseLeave = 'gaugeMouseLeave';
/** @private */
const gaugeMouseDown = 'gaugeMouseDown';
/** @private */
const gaugeMouseUp = 'gaugeMouseUp';
/** @private */
const valueChange = 'valueChange';
/** @private */
const resized = 'resized';
/** @private */
const beforePrint = 'beforePrint';

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
    let htmlObject = document.getElementById('gauge-measuretext');
    let size;
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
    let withIn;
    if (type === 'pointer') {
        withIn = (((value <= max) && (value >= min)));
    }
    else {
        withIn = (start != null && (start <= max) && (start >= min)) && (end != null && (end <= max) && (end >= min));
    }
    return withIn;
}
function convertPixelToValue(parentElement, pointerElement, orientation, axis, type, location) {
    let elementRect = parentElement.getBoundingClientRect();
    let pointerRect = pointerElement.getBoundingClientRect();
    let height = (pointerElement.id.indexOf('MarkerPointer') > -1) ? (pointerRect.height / 2) :
        (!axis.isInversed) ? 0 : pointerRect.height;
    let width = (pointerElement.id.indexOf('MarkerPointer') > -1) ? (pointerRect.width / 2) :
        (!axis.isInversed) ? pointerRect.width : 0;
    let size = new Size(axis.lineBounds.width, axis.lineBounds.height);
    let y = (type === 'drag') ? (location.y - axis.lineBounds.y) :
        ((pointerRect.top + height) - elementRect.top - axis.lineBounds.y);
    let x = (type === 'drag') ? (location.x - axis.lineBounds.x) :
        ((pointerRect.left + width) - elementRect.left - axis.lineBounds.x);
    let newSize = (orientation === 'Vertical') ? size.height : size.width;
    let divideVal = (orientation === 'Vertical') ? y : x;
    let value = (orientation === 'Vertical') ? (axis.isInversed) ? (divideVal / newSize) :
        (1 - (divideVal / newSize)) : (axis.isInversed) ? (1 - (divideVal / newSize)) : (divideVal / newSize);
    value = value * (axis.visibleRange.delta) + axis.visibleRange.min;
    return value;
}
function getPathToRect(path, size, parentElement) {
    let tempDiv = document.getElementById('gauge_path');
    if (tempDiv === null) {
        tempDiv = createElement('text', { id: 'gauge_path' });
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '0px';
        tempDiv.style.left = '0px';
        parentElement.appendChild(tempDiv);
    }
    let render = new SvgRenderer('id');
    let svg = render.createSvg({ id: 'box_path', width: size.width, height: size.height });
    svg.appendChild(path);
    tempDiv.appendChild(svg);
    let svgRect = path.getBBox();
    remove(tempDiv);
    return svgRect;
}
/** @private */
function getElement(id) {
    return document.getElementById(id);
}
/** @private */
function removeElement(id) {
    let element = getElement(id);
    if (element) {
        remove(element);
    }
}
/** @private */
function isPointerDrag(axes) {
    let pointerEnable = false;
    axes.map((axis, index) => {
        axis.pointers.map((pointer, index) => {
            if (pointer.enableDrag) {
                pointerEnable = true;
            }
        });
    });
    return pointerEnable;
}
/** @private */
function valueToCoefficient(value, axis, orientation, range) {
    let result = (value - range.min) / range.delta;
    result = (orientation === 'Vertical') ? (!axis.isInversed) ? (1 - result) : result : (!axis.isInversed) ? result : (1 - result);
    return result;
}
function getFontStyle(font) {
    let style = '';
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
    let keys = Object.keys(data);
    for (let key of keys) {
        format = format.split('{' + key + '}').join(formatValue(data[key], gauge).toString());
    }
    return format;
}
function formatValue(value, gauge) {
    let formatValue;
    let formatFunction;
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
    let customLabelFormat = format && format.match('{value}') !== null;
    let skeleton = customLabelFormat ? '' : format;
    return skeleton;
}
/** @private */
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
class VisibleRange {
    constructor(min, max, interval, delta) {
        this.min = min;
        this.max = max;
        this.interval = interval;
        this.delta = delta;
    }
}
/**
 * Internal use of gauge location
 */
class GaugeLocation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
/**
 * Internal class size for height and width
 */
class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}
/** @private */
class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
/** @private */
class CustomizeOption {
    constructor(id) {
        this.id = id;
    }
}
/** @private */
class PathOption extends CustomizeOption {
    constructor(id, fill, width, color, opacity, dashArray, d, transform = '') {
        super(id);
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
        this.transform = transform;
    }
}
/** @private */
class RectOption {
    constructor(id, fill, border, opacity, rect, transform, dashArray) {
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
}
/** @private */
class TextOption extends CustomizeOption {
    constructor(id, x, y, anchor, text, transform = '', baseLine) {
        super(id);
        this.transform = '';
        this.baseLine = 'auto';
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.text = text;
        this.transform = transform;
        this.baseLine = baseLine;
    }
}
/** @private */
class VisibleLabels {
    constructor(text, value, size) {
        this.text = text;
        this.value = value;
        this.size = size;
    }
}
/** @private */
class Align {
    constructor(axisIndex, align) {
        this.align = align;
        this.axisIndex = axisIndex;
    }
}
/** @private */
function textElement(options, font, color, parent) {
    let renderOptions = {};
    let htmlObject;
    let renderer = new SvgRenderer('');
    let style = 'fill:' + color + '; font-size:' + font.size +
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
    let delta = max - min;
    let currentInterval;
    let intervalDivs = [10, 5, 2, 1];
    let desiredIntervalsCount = getActualDesiredIntervalsCount(size, orientation);
    let niceInterval = delta / desiredIntervalsCount;
    let minInterval = Math.pow(10, Math.floor(Math.log(niceInterval) / Math.log(10)));
    for (let interval of intervalDivs) {
        currentInterval = minInterval * interval;
        if (desiredIntervalsCount < (delta / currentInterval)) {
            break;
        }
        niceInterval = currentInterval;
    }
    return niceInterval;
}
function getActualDesiredIntervalsCount(size, orientation) {
    let maximumLabels = 5;
    let desiredIntervalsCount = (orientation === 'Horizontal' ? 0.533 : 1) * maximumLabels;
    desiredIntervalsCount = Math.max((size * (desiredIntervalsCount / 100)), 1);
    return desiredIntervalsCount;
}
/** @private */
function getPointer(target, gauge) {
    let split = [];
    let axisIndex;
    let radix = 10;
    let pointIndex;
    let axis;
    let pointer;
    split = target.id.replace(gauge.element.id, '').split('_');
    axisIndex = parseInt(split[2], radix);
    pointIndex = parseInt(split[4], radix);
    axis = gauge.axes[axisIndex];
    pointer = gauge.axes[axisIndex].pointers[pointIndex];
    return { axis: axis, axisIndex: axisIndex, pointer: pointer, pointerIndex: pointIndex };
}
/** @private */
function getRangeColor(value, ranges) {
    let rangeColor = null;
    ranges.forEach((range, index) => {
        if (value >= range.start && range.end >= value) {
            rangeColor = range.interior;
        }
    });
    return rangeColor;
}
/** @private */
function getRangePalette() {
    let palette = ['#ff5985', '#ffb133', '#fcde0b', '#27d5ff', '#50c917'];
    return palette;
}
/** @private */
function calculateShapes(location, shape, size, url, options, orientation, axis, pointer) {
    let path;
    let width = size.width;
    let height = size.height;
    let locX = location.x;
    let locY = location.y;
    let radius;
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
    let path = ' ';
    let radius = cornerRadius;
    let x1;
    let y1;
    let rectWidth;
    let rectHeight;
    let bottomRadius;
    let topRadius;
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
            let width = (orientation === 'Vertical') ? location.width : location.height;
            bottomRadius = width + ((width / 2) / Math.PI);
            topRadius = width / 2;
            if (orientation === 'Vertical') {
                let addValue = ((containerWidth + ((containerWidth / 2) / Math.PI)) - bottomRadius);
                let y1 = (type === 'bar') ? location.y + addValue : location.y;
                let locY = (type === 'bar') ? location.y + (topRadius - (topRadius / Math.PI)) : location.y;
                let locHeight = location.height;
                path = 'M' + location.x + ' ' + (y1 + locHeight) +
                    ' A ' + bottomRadius + ' ' + bottomRadius + ', 0, 1, 0, ' + (location.x + location.width) + ' ' + (y1 + locHeight) +
                    ' L ' + (location.x + location.width) + ' ' + locY +
                    ' A ' + topRadius + ' ' + topRadius + ', 0, 1, 0, ' + location.x + ' ' + locY + ' z ';
            }
            else {
                let x1 = (type === 'bar' && !axis.isInversed) ?
                    location.x - ((containerWidth + ((containerWidth / 2) / Math.PI)) - bottomRadius) : location.x;
                let locWidth = (type === 'bar') ? (location.width - (topRadius - ((topRadius / Math.PI)))) : location.width;
                path = 'M' + x1 + ' ' + (location.y) +
                    ' A ' + bottomRadius + ' ' + bottomRadius + ', 0, 1, 0, ' + x1 + ' ' + (location.y + location.height) +
                    ' L ' + ((type === 'bar' ? location.x : x1) + locWidth) + ' ' + (location.y + location.height) +
                    ' A ' + topRadius + ' ' + topRadius + ', 0, 1, 0, ' +
                    ((type === 'bar' ? location.x : x1) + locWidth) + ' ' + (location.y) + ' z ';
            }
            break;
    }
    return path;
}

/**
 * @private
 * To calculate the overall axis bounds for gauge.
 */
class AxisLayoutPanel {
    constructor(gauge) {
        this.gauge = gauge;
    }
    /**
     * To calculate the axis bounds
     */
    calculateAxesBounds() {
        let axis;
        let bounds;
        this.gauge.nearSizes = [];
        this.gauge.farSizes = [];
        let x;
        let y;
        let width;
        let height;
        let axisPadding = 8;
        let containerRect = this.gauge.containerBounds;
        this.checkThermometer();
        for (let i = 0; i < this.gauge.axes.length; i++) {
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
    }
    /**
     * Calculate axis line bounds
     * @param axis
     * @param axisIndex
     */
    calculateLineBounds(axis, axisIndex) {
        let x;
        let y;
        let width;
        let height;
        let index;
        let prevAxis;
        let lineHeight = axis.line.height;
        let orientation = this.gauge.orientation;
        let containerRect = this.gauge.containerBounds;
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
    }
    /**
     * Calculate axis tick bounds
     * @param axis
     * @param axisIndex
     */
    calculateTickBounds(axis, axisIndex) {
        let x;
        let y;
        let major;
        let minor;
        let min = Math.min(axis.minimum, axis.maximum);
        let max = Math.max(axis.minimum, axis.maximum);
        min = (min === max) ? max - 1 : min;
        let interval = axis.majorTicks.interval;
        let bounds = axis.lineBounds;
        major = axis.majorTicks;
        minor = axis.minorTicks;
        axis.majorInterval = major.interval;
        axis.minorInterval = minor.interval;
        let size = (this.gauge.orientation === 'Vertical' ? bounds.height : bounds.width);
        let lineSize = (this.gauge.orientation === 'Vertical' ? bounds.width : bounds.height) / 2;
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
    }
    /**
     * To Calculate axis label bounds
     * @param axis
     * @param axisIndex
     */
    calculateLabelBounds(axis, axisIndex) {
        let x;
        let y;
        let width;
        let height;
        let padding = 5;
        let applyPositionBounds = (axis.labelStyle.position !== 'Auto' && axis.majorTicks.position !== 'Auto' &&
            axis.minorTicks.position !== 'Auto');
        let bounds = applyPositionBounds ? (axis.labelStyle.position === axis.minorTicks.position &&
            axis.minorTicks.position !== axis.majorTicks.position ? axis.minorTickBounds : axis.majorTickBounds) :
            axis.majorTickBounds;
        let offset = axis.labelStyle.offset;
        this.calculateVisibleLabels(axis);
        width = axis.maxLabelSize.width;
        height = axis.maxLabelSize.height / 2;
        if (this.gauge.orientation === 'Vertical') {
            x = axis.labelStyle.position === 'Auto' ? ((!axis.opposedPosition ? (bounds.x - width - padding) :
                (bounds.x + bounds.width + padding)) + offset) : x;
            let boundx = bounds.x;
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
            let boundy = bounds.y;
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
    }
    /**
     * Calculate pointer bounds
     * @param axis
     * @param axisIndex
     */
    calculatePointerBounds(axis, axisIndex) {
        let pointer;
        let range = axis.visibleRange;
        let orientation = this.gauge.orientation;
        let line = axis.lineBounds;
        let label = axis.labelBounds;
        let minimumValue = Math.min(range.min, range.max);
        let maximumValue = Math.max(range.min, range.max);
        for (let i = 0; i < axis.pointers.length; i++) {
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
    }
    /**
     * Calculate marker pointer bounds
     * @param axisIndex
     * @param axis
     * @param pointerIndex
     * @param pointer
     */
    calculateMarkerBounds(axisIndex, axis, pointerIndex, pointer) {
        let x;
        let y;
        let line = axis.lineBounds;
        let offset = pointer.currentOffset;
        let range = axis.visibleRange;
        let placement = pointer.placement;
        let tick = axis.majorTickBounds;
        let label = axis.labelBounds;
        let border = pointer.border.width;
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
    }
    /**
     * Calculate bar pointer bounds
     * @param axisIndex
     * @param axis
     * @param pointerIndex
     * @param pointer
     */
    calculateBarBounds(axisIndex, axis, pointerIndex, pointer) {
        let x1;
        let x2;
        let y1;
        let y2;
        let height;
        let width;
        let line = axis.lineBounds;
        let padding = 10;
        let range = axis.visibleRange;
        let orientation = this.gauge.orientation;
        let offset = pointer.currentOffset;
        let container = this.gauge.containerBounds;
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
    }
    /**
     * Calculate ranges bounds
     * @param axis
     * @param axisIndex
     */
    calculateRangesBounds(axis, axisIndex) {
        let range;
        let start;
        let end;
        let line = axis.lineBounds;
        let visibleRange = axis.visibleRange;
        let orientation = this.gauge.orientation;
        let startVal;
        let endVal;
        let pointX;
        let pointY;
        let width;
        let height;
        let position;
        let startWidth;
        let endWidth;
        let colors;
        for (let i = 0; i < axis.ranges.length; i++) {
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
    }
    checkPreviousAxes(currentAxis, axisIndex) {
        let index = axisIndex - 1;
        let prevAxis;
        let isPositive = (index >= 0) ? true : false;
        if (isPositive) {
            prevAxis = this.gauge.axes[index];
            index = (prevAxis.checkAlign.align === currentAxis.checkAlign.align) ? index : this.checkPreviousAxes(currentAxis, index);
        }
        else {
            index = null;
        }
        return index;
    }
    /**
     *
     * @param axis To calculate the visible labels
     */
    calculateVisibleLabels(axis) {
        axis.visibleLabels = [];
        let min = axis.visibleRange.min;
        let max = axis.visibleRange.max;
        let interval = axis.visibleRange.interval;
        let format;
        let argsData;
        let style = axis.labelStyle;
        let labelSize;
        let customLabelFormat = style.format && style.format.match('{value}') !== null;
        format = this.gauge.intl.getNumberFormat({
            format: getLabelFormat(style.format), useGrouping: this.gauge.useGroupingSeparator
        });
        for (let i = min; (i <= max && interval > 0); i += interval) {
            argsData = {
                cancel: false, name: axisLabelRender, axis: axis,
                text: customLabelFormat ? textFormatter(style.format, { value: i }, this.gauge) :
                    formatValue(i, this.gauge).toString(),
                value: i
            };
            let axisLabelRenderSuccess = (argsData) => {
                if (!argsData.cancel) {
                    axis.visibleLabels.push(new VisibleLabels(argsData.text, i, labelSize));
                }
            };
            axisLabelRenderSuccess.bind(this);
            this.gauge.trigger(axisLabelRender, argsData, axisLabelRenderSuccess);
        }
        let lastLabel = axis.visibleLabels.length ? axis.visibleLabels[axis.visibleLabels.length - 1].value : null;
        let maxVal = axis.visibleRange.max;
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
            let axisLabelRenderSuccess = (argsData) => {
                labelSize = measureText(argsData.text, axis.labelStyle.font);
                if (!argsData.cancel) {
                    axis.visibleLabels.push(new VisibleLabels(argsData.text, maxVal, labelSize));
                }
            };
            axisLabelRenderSuccess.bind(this);
            this.gauge.trigger(axisLabelRender, argsData, axisLabelRenderSuccess);
        }
        this.getMaxLabelWidth(this.gauge, axis);
    }
    /**
     * Calculate maximum label width for the axis.
     * @return {void}
     * @private
     */
    getMaxLabelWidth(gauge, axis) {
        axis.maxLabelSize = new Size(0, 0);
        let label;
        for (let i = 0; i < axis.visibleLabels.length; i++) {
            label = axis.visibleLabels[i];
            label.size = measureText(label.text, axis.labelStyle.font);
            if (label.size.width > axis.maxLabelSize.width) {
                axis.maxLabelSize.width = label.size.width;
            }
            if (label.size.height > axis.maxLabelSize.height) {
                axis.maxLabelSize.height = label.size.height;
            }
        }
    }
    checkThermometer() {
        if (this.gauge.container.type === 'Thermometer') {
            this.gauge.axes.map((axis, index) => {
                if (axis.isInversed) {
                    axis.pointers.map((pointer, index) => {
                        if (pointer.type === 'Bar') {
                            axis.isInversed = false;
                        }
                    });
                }
            });
        }
    }
}

/**
 * @private
 * To handle the animation for gauge
 */
class Animations {
    constructor(gauge) {
        this.gauge = gauge;
    }
    /**
     * To do the marker pointer animation.
     * @return {void}
     * @private
     */
    performMarkerAnimation(element, axis, pointer) {
        let markerElement = element;
        let options;
        let timeStamp;
        let range = axis.visibleRange;
        let rectHeight = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.height : axis.lineBounds.width;
        let rectY = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.y : axis.lineBounds.x;
        if (this.gauge.orientation === 'Vertical') {
            pointer.bounds.y = (valueToCoefficient(pointer.currentValue, axis, this.gauge.orientation, range) * rectHeight) + rectY;
        }
        else {
            pointer.bounds.x = (valueToCoefficient(pointer.currentValue, axis, this.gauge.orientation, range) * rectHeight) + rectY;
        }
        options = new PathOption(markerElement.id, null, null, null);
        options = calculateShapes(pointer.bounds, pointer.markerType, new Size(pointer.width, pointer.height), pointer.imageUrl, options, this.gauge.orientation, axis, pointer);
        let currentValue;
        let start = pointer.startValue;
        let end = pointer.currentValue;
        start = (start === end) ? range.min : start;
        let val = Math.abs(start - end);
        let currentPath = options.d;
        new Animation({}).animate(markerElement, {
            duration: pointer.animationDuration,
            progress: (args) => {
                if (args.timeStamp >= args.delay) {
                    timeStamp = ((args.timeStamp - args.delay) / args.duration);
                    currentValue = (start < end) ? start + (timeStamp * val) : start - (timeStamp * val);
                    if (this.gauge.orientation === 'Vertical') {
                        pointer.bounds.y = (valueToCoefficient(currentValue, axis, this.gauge.orientation, range) *
                            rectHeight) + rectY;
                    }
                    else {
                        pointer.bounds.x = (valueToCoefficient(currentValue, axis, this.gauge.orientation, range) *
                            rectHeight) + rectY;
                    }
                    options = calculateShapes(pointer.bounds, pointer.markerType, new Size(pointer.width, pointer.height), pointer.imageUrl, options, this.gauge.orientation, axis, pointer);
                    markerElement.setAttribute('d', options.d);
                }
            },
            end: (model) => {
                markerElement.setAttribute('d', currentPath);
                pointer.startValue = pointer.currentValue;
                pointer.animationComplete = true;
                this.gauge.trigger(animationComplete, { axis: !this.gauge.isBlazor ? axis : null, pointer: pointer });
            }
        });
    }
    /**
     * Perform the bar pointer animation
     * @param element
     * @param axis
     * @param pointer
     */
    performBarAnimation(element, axis, pointer) {
        let val;
        let radix = 10;
        let timeStamp;
        let value2;
        let value1;
        let currentValue;
        let clipHeight;
        let clipY;
        let clipX;
        let clipVal;
        let rectHeight;
        let rectY;
        let clipWidth;
        let currentHeight;
        let clipElement;
        let range = axis.visibleRange;
        let pointerElement = element;
        let lineHeight = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.height : axis.lineBounds.width;
        let lineY = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.y : axis.lineBounds.x;
        let size = new Size(this.gauge.availableSize.width, this.gauge.availableSize.height);
        let start = pointer.startValue;
        let end = pointer.currentValue;
        start = (start === end) ? range.min : start;
        let path = '';
        let currentPath = '';
        let tagName = pointerElement.tagName;
        val = Math.abs(start - end);
        let pointerValue = (valueToCoefficient(end, axis, this.gauge.orientation, range) * lineHeight) + lineY;
        let startPointerVal = (valueToCoefficient(range.min, axis, this.gauge.orientation, range) *
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
            progress: (animate) => {
                if (animate.timeStamp >= animate.delay) {
                    timeStamp = ((animate.timeStamp - animate.delay) / animate.duration);
                    currentValue = (start < end) ? start + (timeStamp * val) : start - (timeStamp * val);
                    value2 = (valueToCoefficient(currentValue, axis, this.gauge.orientation, range) * lineHeight) + lineY;
                    value1 = (valueToCoefficient(range.min, axis, this.gauge.orientation, range) * lineHeight) + lineY;
                    currentHeight = Math.abs(value2 - value1);
                    if (this.gauge.orientation === 'Vertical') {
                        pointer.bounds.y = (!axis.isInversed) ? value2 : value1;
                        pointer.bounds.height = currentHeight;
                    }
                    else {
                        pointer.bounds.x = (axis.isInversed) ? value2 : value1;
                        pointer.bounds.width = currentHeight;
                    }
                    if (tagName === 'path') {
                        if (start === 0 && this.gauge.container.type === 'Thermometer') {
                            (this.gauge.orientation === 'Vertical') ?
                                clipElement.setAttribute('y', (clipVal - (timeStamp * parseInt(clipHeight, radix))).toString()) :
                                clipElement.setAttribute('width', (timeStamp * parseInt(clipWidth, radix)).toString());
                        }
                        currentPath = getBox(pointer.bounds, this.gauge.container.type, this.gauge.orientation, new Size(pointer.bounds.width, pointer.bounds.height), 'bar', this.gauge.container.width, axis, pointer.roundedCornerRadius);
                        pointerElement.setAttribute('d', currentPath);
                    }
                    else {
                        if (this.gauge.orientation === 'Vertical') {
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
            end: (model) => {
                if (tagName === 'path') {
                    if (start === 0 && this.gauge.container.type === 'Thermometer') {
                        pointerElement.parentElement.children[1].remove();
                    }
                    else {
                        pointerElement.setAttribute('d', path);
                    }
                }
                else {
                    if (this.gauge.orientation === 'Vertical') {
                        pointerElement.setAttribute('y', rectY.toString());
                        pointerElement.setAttribute('height', rectHeight.toString());
                    }
                    else {
                        pointerElement.setAttribute('x', rectY.toString());
                        pointerElement.setAttribute('width', rectHeight.toString());
                    }
                }
                pointer.startValue = pointer.currentValue;
                this.gauge.trigger(animationComplete, { axis: !this.gauge.isBlazor ? axis : null, pointer: pointer });
            }
        });
    }
}

/**
 * @private
 * To render the axis elements
 */
class AxisRenderer extends Animations {
    constructor(gauge) {
        super(gauge);
    }
    renderAxes() {
        let axis;
        let major;
        let minor;
        this.axisElements = [];
        let gaugeAxesG = this.gauge.svgObject.querySelector('#' + this.gauge.element.id + '_Axis_Collections');
        if (gaugeAxesG) {
            remove(gaugeAxesG);
        }
        this.axisObject = this.gauge.renderer.createGroup({
            id: this.gauge.element.id + '_Axis_Collections',
            transform: 'translate( 0, 0 )'
        });
        for (let i = 0; i < this.gauge.axes.length; i++) {
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
        this.axisElements.forEach((axisElement) => {
            this.axisObject.appendChild(axisElement);
        });
        this.gauge.svgObject.appendChild(this.axisObject);
        if (this.gauge.nearSizes.length !== this.gauge.farSizes.length && this.gauge.axes.length > 1) {
            this.axisAlign(this.gauge.axes);
        }
    }
    axisAlign(axes) {
        let nearAxisWidth = 0;
        let farAxisWidth = 0;
        let tranX;
        let transY;
        if (this.gauge.orientation === 'Vertical') {
            axes.forEach((axis, axisIndex) => {
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
            axes.forEach((axis, axisIndex) => {
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
    }
    drawAxisLine(axis, axisObject, axisIndex) {
        let options;
        let rect = axis.lineBounds;
        let path = '';
        let color = axis.line.color || this.gauge.themeStyle.lineColor;
        if (axis.line.width > 0) {
            path = 'M' + rect.x + ' ' + rect.y + ' L ' + (this.gauge.orientation === 'Vertical' ? rect.x : rect.x + rect.width) +
                ' ' + (this.gauge.orientation === 'Vertical' ? rect.y + rect.height : rect.y) + 'z';
            options = new PathOption(this.gauge.element.id + '_AxisLine_' + axisIndex, color, axis.line.width, color, 1, axis.line.dashArray, path);
            axisObject.appendChild(this.gauge.renderer.drawPath(options));
        }
    }
    drawTicks(axis, ticks, axisObject, tickID, tickBounds) {
        let tickPath = '';
        let pointY;
        let pointX;
        let options;
        let range = axis.visibleRange;
        let line = axis.lineBounds;
        let majorTickColor = axis.majorTicks.color || this.gauge.themeStyle.majorTickColor;
        let minorTickColor = axis.minorTicks.color || this.gauge.themeStyle.minorTickColor;
        let tickColor = (tickID === 'MajorTicks') ? majorTickColor : minorTickColor;
        let interval = ((tickID === 'MajorTicks') ? axis.majorInterval : axis.minorInterval);
        // let position: string = (tickID === 'MajorTicks') ? axis.majorTicks.position : axis.minorTicks.position;
        for (let i = range.min; (i <= range.max && interval > 0); i += interval) {
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
    }
    drawAxisLabels(axis, axisObject) {
        let options;
        let pointX;
        let pointY;
        let rect = axis.lineBounds;
        let bounds = axis.labelBounds;
        let tick = axis.majorTickBounds;
        // let tick: Rect = axis.labelStyle.position === axis.minorTicks.position && axis.minorTicks.position !== axis.majorTicks.position ?
        //     axis.minorTickBounds : axis.majorTickBounds;
        let labelSize;
        let range = axis.visibleRange;
        let anchor;
        let baseline;
        let padding = 5;
        let fontColor = this.gauge.themeStyle.labelColor;
        let labelColor;
        let offset = axis.labelStyle.offset;
        let labelElement = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_AxisLabelsGroup' });
        for (let i = 0; i < axis.visibleLabels.length; i++) {
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
    }
    drawPointers(axis, axisObject, axisIndex) {
        let pointer;
        let clipId;
        let pointesGroup;
        let pointerClipRectGroup;
        pointesGroup = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_PointersGroup' });
        for (let i = 0; i < axis.pointers.length; i++) {
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
    }
    drawMarkerPointer(axis, axisIndex, pointer, pointerIndex, parentElement) {
        let options;
        let pointerID = this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer' + '_' + pointerIndex;
        let transform = 'translate( 0, 0 )';
        let pointerElement;
        if (getElement(pointerID) && getElement(pointerID).childElementCount > 0) {
            remove(getElement(pointerID));
        }
        let pointerColor = pointer.color || this.gauge.themeStyle.pointerColor;
        let shapeBasedOnPosition = pointer.markerType;
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
    }
    drawBarPointer(axis, axisIndex, pointer, pointerIndex, parentElement) {
        let rectOptions;
        let clipRectElement;
        let pointerElement;
        let path = '';
        let options;
        let box;
        let size = new Size(this.gauge.availableSize.width, this.gauge.availableSize.height);
        let pointerID = this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer' + '_' + pointerIndex;
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
            let element = getElement(pointerID).firstElementChild;
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
    }
    drawRanges(axis, axisObject, axisIndex) {
        let range;
        let options;
        let rangeElement = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_RangesGroup' });
        for (let j = 0; j < axis.ranges.length; j++) {
            range = axis.ranges[j];
            if (!(isNullOrUndefined(range.path))) {
                options = new PathOption(this.gauge.element.id + '_AxisIndex_' + axisIndex + '_Range_' + j, range.interior, range.border.width, range.border.color, 1, null, range.path);
                rangeElement.appendChild(this.gauge.renderer.drawPath(options));
            }
        }
        axisObject.appendChild(rangeElement);
    }
}

/**
 * Represent the Annotation rendering for gauge
 */
class Annotations {
    constructor(gauge) {
        this.gauge = gauge;
    }
    /**
     * To render annotation elements
     */
    renderAnnotationElements() {
        let secondaryID = this.gauge.element.id + '_Secondary_Element';
        let annotationGroup = createElement('div', { id: this.gauge.element.id + '_AnnotationsGroup' });
        annotationGroup.style.position = 'absolute';
        annotationGroup.style.top = '0px';
        annotationGroup.style.left = '0px';
        this.gauge.annotations.map((annotation, index) => {
            if (annotation.content !== null) {
                this.createAnnotationTemplate(annotationGroup, index);
            }
        });
        if (annotationGroup.childElementCount > 0 && !(isNullOrUndefined(getElement(secondaryID)))) {
            getElement(secondaryID).appendChild(annotationGroup);
            for (let i = 0; i < this.gauge.annotations.length; i++) {
                updateBlazorTemplate(this.gauge.element.id + '_ContentTemplate' + i, 'ContentTemplate', this.gauge.annotations[i]);
            }
        }
    }
    /**
     * To create annotation elements
     */
    //tslint:disable
    createAnnotationTemplate(element, annotationIndex) {
        let left;
        let top;
        let templateFn;
        let renderAnnotation = false;
        let templateElement;
        let axis;
        let axisIndex;
        let id = this.gauge.element.id + '_Annotation_' + annotationIndex;
        let annotation = this.gauge.annotations[annotationIndex];
        let childElement;
        childElement = createElement('div', {
            id: this.gauge.element.id + '_Annotation_' + annotationIndex, styles: 'position: absolute; z-index:' + annotation.zIndex + ';'
        });
        let argsData = {
            cancel: false, name: annotationRender, content: annotation.content,
            annotation: annotation, textStyle: annotation.font
        };
        argsData.textStyle.color = annotation.font.color || this.gauge.themeStyle.labelColor;
        if (this.gauge.isBlazor) {
            let { cancel, name, content, annotation, textStyle } = argsData;
            argsData = { cancel, name, content, annotation, textStyle };
        }
        this.gauge.trigger(annotationRender, argsData, (observerArgs) => {
            if (!argsData.cancel) {
                templateFn = getTemplateFunction(argsData.content);
                if (templateFn && (!this.gauge.isBlazor ? templateFn(this.gauge, null, null, this.gauge.element.id + '_ContentTemplate' + annotationIndex).length : {})) {
                    templateElement = Array.prototype.slice.call(templateFn(!this.gauge.isBlazor ? this.gauge : {}, null, null, this.gauge.element.id + '_ContentTemplate' + annotationIndex));
                    let length = templateElement.length;
                    for (let i = 0; i < length; i++) {
                        childElement.appendChild(templateElement[i]);
                    }
                }
                else {
                    childElement.appendChild(createElement('div', {
                        innerHTML: argsData.content,
                        styles: getFontStyle(argsData.textStyle)
                    }));
                }
                let offset = getElementOffset(childElement.cloneNode(true), this.gauge.element);
                if (!(isNullOrUndefined(annotation.axisValue))) {
                    axisIndex = isNullOrUndefined(annotation.axisIndex) ? 0 : annotation.axisIndex;
                    axis = this.gauge.axes[axisIndex];
                    let range = axis.visibleRange;
                    renderAnnotation = (annotation.axisValue >= range.min && annotation.axisValue <= range.max) ? true : false;
                    let line = axis.lineBounds;
                    if (this.gauge.orientation === 'Vertical') {
                        left = line.x + annotation.x;
                        top = ((valueToCoefficient(annotation.axisValue, axis, this.gauge.orientation, range) * line.height) + line.y);
                        top += annotation.y;
                    }
                    else {
                        left = ((valueToCoefficient(annotation.axisValue, axis, this.gauge.orientation, range) * line.width) + line.x);
                        left += annotation.x;
                        top = line.y + annotation.y;
                    }
                    left -= (offset.width / 2);
                    top -= (offset.height / 2);
                }
                else {
                    let elementRect = this.gauge.element.getBoundingClientRect();
                    let bounds = this.gauge.svgObject.getBoundingClientRect();
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
    destroy(gauge) {
        // Destroy method performed here
    }
}

/**
 * Represent the tooltip rendering for gauge
 */
class GaugeTooltip {
    constructor(gauge) {
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
    renderTooltip(e) {
        let pageX;
        let pageY;
        let target;
        let touchArg;
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
        let tooltipEle;
        let tooltipContent;
        if (target.id.indexOf('Pointer') > -1) {
            this.pointerElement = target;
            let areaRect = this.gauge.element.getBoundingClientRect();
            let current = getPointer(this.pointerElement, this.gauge);
            this.currentAxis = current.axis;
            this.axisIndex = current.axisIndex;
            this.currentPointer = current.pointer;
            let customTooltipFormat = this.tooltip.format && this.tooltip.format.match('{value}') !== null;
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
            let location = this.getTooltipLocation();
            let args = {
                name: tooltipRender,
                cancel: false,
                gauge: this.gauge,
                event: e,
                location: location,
                content: tooltipContent,
                tooltip: this.tooltip,
                axis: this.currentAxis,
                pointer: this.currentPointer
            };
            let tooltipPos = this.getTooltipPosition();
            location.y += (this.tooltip.template && tooltipPos === 'Top') ? 20 : 0;
            location.x += (this.tooltip.template && tooltipPos === 'Right') ? 20 : 0;
            this.gauge.trigger(tooltipRender, args, (observedArgs) => {
                let template = args.tooltip.template;
                if (template !== null && Object.keys(template).length === 1) {
                    template = template[Object.keys(template)[0]];
                }
                let themes = this.gauge.theme.toLowerCase();
                if (!args.cancel) {
                    args['tooltip']['properties']['textStyle']['color'] = this.tooltip.textStyle.color ||
                        this.gauge.themeStyle.tooltipFontColor;
                    this.svgTooltip = new Tooltip({
                        enable: true,
                        header: '',
                        data: { value: args.pointer.currentValue },
                        template: template,
                        content: [args.content],
                        shapes: [],
                        location: args.location,
                        palette: [],
                        inverted: !(args.gauge.orientation === 'Horizontal'),
                        enableAnimation: args.tooltip.enableAnimation,
                        fill: this.tooltip.fill || this.gauge.themeStyle.tooltipFillColor,
                        availableSize: this.gauge.availableSize,
                        areaBounds: new Rect(areaRect.left, tooltipPos === 'Bottom' ? location.y : areaRect.top, tooltipPos === 'Right' ? Math.abs(areaRect.left - location.x) : areaRect.width, areaRect.height),
                        textStyle: args.tooltip.textStyle,
                        border: args.tooltip.border,
                        theme: args.gauge.theme,
                        blazorTemplate: { name: 'TooltipTemplate', parent: this.gauge.tooltip }
                    });
                    this.svgTooltip.opacity = this.gauge.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
                    this.svgTooltip.appendTo(tooltipEle);
                }
            });
        }
        else {
            this.removeTooltip();
        }
    }
    getTooltipPosition() {
        let position;
        if (this.gauge.orientation === 'Vertical') {
            position = (!this.currentAxis.opposedPosition) ? 'Left' : 'Right';
        }
        else {
            position = (this.currentAxis.opposedPosition) ? 'Top' : 'Bottom';
        }
        return position;
    }
    getTooltipLocation() {
        let location;
        let bounds;
        let lineX;
        let lineY;
        let size = new Size(this.gauge.availableSize.width, this.gauge.availableSize.height);
        let x;
        let y;
        let height;
        let width;
        let lineId = this.gauge.element.id + '_AxisLine_' + this.axisIndex;
        let tickID = this.gauge.element.id + '_MajorTicksLine_' + this.axisIndex;
        let lineBounds;
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
        let elementRect = this.gauge.element.getBoundingClientRect();
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
    }
    removeTooltip() {
        if (document.getElementsByClassName('EJ2-LinearGauge-Tooltip').length > 0) {
            document.getElementsByClassName('EJ2-LinearGauge-Tooltip')[0].remove();
        }
    }
    mouseUpHandler(e) {
        this.renderTooltip(e);
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
    }
    /**
     * To bind events for tooltip module
     */
    addEventListener() {
        if (this.gauge.isDestroyed) {
            return;
        }
        this.gauge.on(Browser.touchMoveEvent, this.renderTooltip, this);
        this.gauge.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    }
    /**
     * To unbind events for tooltip module
     */
    removeEventListener() {
        if (this.gauge.isDestroyed) {
            return;
        }
        this.gauge.off(Browser.touchMoveEvent, this.renderTooltip);
        this.gauge.off(Browser.touchEndEvent, this.mouseUpHandler);
    }
    /*
     * Get module name.
     */
    getModuleName() {
        return 'Tooltip';
    }
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    destroy(gauge) {
        // Destroy method performed here
        this.removeEventListener();
    }
}

/** @private */
function getThemeStyle(theme) {
    let style;
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
class ExportUtils {
    /**
     * Constructor for gauge
     * @param control
     */
    constructor(control) {
        this.control = control;
    }
    /**
     * To print the gauge
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
     * To get the html string of the gauge
     * @param elements
     * @private
     */
    getHTMLContent(elements) {
        let div = createElement('div');
        if (elements) {
            if (elements instanceof Array) {
                elements.forEach((value) => {
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
    export(type, fileName, orientation) {
        let element = createElement('canvas', {
            id: 'ej2-canvas',
            attrs: {
                'width': this.control.availableSize.width.toString(),
                'height': this.control.availableSize.height.toString()
            }
        });
        let isDownload = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
        orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
        let svgData = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            this.control.svgObject.outerHTML +
            '</svg>';
        let url = window.URL.createObjectURL(new Blob(type === 'SVG' ? [svgData] :
            [(new XMLSerializer()).serializeToString(this.control.svgObject)], { type: 'image/svg+xml' }));
        if (type === 'SVG') {
            this.triggerDownload(fileName, type, url, isDownload);
        }
        else {
            let image = new Image();
            let ctx = element.getContext('2d');
            image.onload = (() => {
                ctx.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                if (type === 'PDF') {
                    let document = new PdfDocument();
                    let imageString = element.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                    document.pageSettings.orientation = orientation;
                    imageString = imageString.slice(imageString.indexOf(',') + 1);
                    document.pages.add().graphics.drawImage(new PdfBitmap(imageString), 0, 0, (this.control.availableSize.width - 60), this.control.availableSize.height);
                    if (isDownload) {
                        document.save(fileName + '.pdf');
                        document.destroy();
                    }
                }
                else {
                    this.triggerDownload(fileName, type, element.toDataURL('image/png').replace('image/png', 'image/octet-stream'), isDownload);
                }
            });
            image.src = url;
        }
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
 * Represents the EJ2 Linear gauge control.
 * ```html
 * <div id="container"/>
 * <script>
 *   var gaugeObj = new LinearGauge({ });
 *   gaugeObj.appendTo("#container");
 * </script>
 * ```
 */
let LinearGauge = class LinearGauge extends Component {
    /**
     * @private
     * Constructor for creating the widget
     * @hidden
     */
    constructor(options, element) {
        super(options, element);
        /** @private */
        this.pointerDrag = false;
        /** @private */
        this.mouseX = 0;
        /** @private */
        this.mouseY = 0;
        /** @private */
        this.gaugeResized = false;
    }
    /**
     * Initialize the preRender method.
     */
    preRender() {
        this.isBlazor = isBlazor();
        this.unWireEvents();
        this.trigger(load, { gauge: !this.isBlazor ? this : null });
        this.initPrivateVariable();
        this.setCulture();
        this.createSvg();
        this.wireEvents();
    }
    setTheme() {
        this.themeStyle = getThemeStyle(this.theme);
    }
    initPrivateVariable() {
        if (this.element.id === '') {
            let collection = document.getElementsByClassName('e-lineargauge').length;
            this.element.id = 'lineargauge_' + 'control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);
        this.gaugeAxisLayoutPanel = new AxisLayoutPanel(this);
        this.axisRenderer = new AxisRenderer(this);
    }
    /**
     * Method to set culture for chart
     */
    setCulture() {
        this.intl = new Internationalization();
    }
    /**
     * Methods to create svg element
     */
    createSvg() {
        this.removeSvg();
        this.calculateSize();
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + '_svg',
            width: this.availableSize.width,
            height: this.availableSize.height
        });
    }
    /**
     * To Remove the SVG.
     * @return {boolean}
     * @private
     */
    removeSvg() {
        for (let i = 0; i < this.annotations.length; i++) {
            resetBlazorTemplate(this.element.id + '_ContentTemplate' + i, 'ContentTemplate');
        }
        removeElement(this.element.id + '_Secondary_Element');
        if (!(isNullOrUndefined(this.svgObject)) && !isNullOrUndefined(this.svgObject.parentNode)) {
            remove(this.svgObject);
        }
    }
    /**
     * Method to calculate the size of the gauge
     */
    calculateSize() {
        let width = stringToNumber(this.width, this.element.offsetWidth) || this.element.offsetWidth || 600;
        let height = stringToNumber(this.height, this.element.offsetHeight) || this.element.offsetHeight || 450;
        this.availableSize = new Size(width, height);
    }
    /**
     * To Initialize the control rendering
     */
    render() {
        this.setTheme();
        this.renderGaugeElements();
        this.calculateBounds();
        this.renderAxisElements();
        this.renderComplete();
    }
    /**
     * @private
     * To render the gauge elements
     */
    renderGaugeElements() {
        this.appendSecondaryElement();
        this.renderBorder();
        this.renderTitle();
        this.renderContainer();
    }
    appendSecondaryElement() {
        if (isNullOrUndefined(getElement(this.element.id + '_Secondary_Element'))) {
            let secondaryElement = createElement('div');
            secondaryElement.id = this.element.id + '_Secondary_Element';
            secondaryElement.setAttribute('style', 'position: relative');
            this.element.appendChild(secondaryElement);
        }
    }
    /**
     * Render the map area border
     */
    renderArea() {
        let size = measureText(this.title, this.titleStyle);
        let rectSize = new Rect(this.actualRect.x, this.actualRect.y - (size.height / 2), this.actualRect.width, this.actualRect.height);
        let rect = new RectOption(this.element.id + 'LinearGaugeBorder', this.background || this.themeStyle.backgroundColor, this.border, 1, rectSize);
        this.svgObject.appendChild(this.renderer.drawRectangle(rect));
    }
    /**
     * @private
     * To calculate axes bounds
     */
    calculateBounds() {
        this.gaugeAxisLayoutPanel.calculateAxesBounds();
    }
    /**
     * @private
     * To render axis elements
     */
    renderAxisElements() {
        this.axisRenderer.renderAxes();
        this.element.appendChild(this.svgObject);
        if (this.annotationsModule) {
            this.annotationsModule.renderAnnotationElements();
        }
        this.trigger(loaded, { gauge: !this.isBlazor ? this : null });
    }
    renderBorder() {
        let width = this.border.width;
        if (width > 0) {
            let rect = new RectOption(this.element.id + '_LinearGaugeBorder', this.background || this.themeStyle.backgroundColor, this.border, 1, new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width), null, null);
            this.svgObject.appendChild(this.renderer.drawRectangle(rect));
        }
    }
    renderTitle() {
        let x;
        let y;
        let height;
        let width;
        let titleBounds;
        let size = measureText(this.title, this.titleStyle);
        let options = new TextOption(this.element.id + '_LinearGaugeTitle', this.availableSize.width / 2, this.margin.top + (size.height / 2), 'middle', this.title);
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
            let element = textElement(options, this.titleStyle, this.titleStyle.color || this.themeStyle.titleFontColor, this.svgObject);
            element.setAttribute('aria-label', this.description || this.title);
            element.setAttribute('tabindex', this.tabIndex.toString());
        }
    }
    /*
     * Method to unbind the gauge events
     */
    unWireEvents() {
        EventHandler.remove(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMove);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'contextmenu', this.gaugeRightClick);
        EventHandler.remove(this.element, (Browser.isPointer ? 'pointerleave' : 'mouseleave'), this.mouseLeave);
        EventHandler.remove(window, (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.gaugeResize.bind(this));
    }
    /*
     * Method to bind the gauge events
     */
    wireEvents() {
        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'contextmenu', this.gaugeRightClick, this);
        EventHandler.add(this.element, (Browser.isPointer ? 'pointerleave' : 'mouseleave'), this.mouseLeave, this);
        EventHandler.add(window, (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.gaugeResize, this);
        this.setStyle(this.element);
    }
    setStyle(element) {
        element.style.touchAction = isPointerDrag(this.axes) ? 'none' : 'element';
        element.style.msTouchAction = isPointerDrag(this.axes) ? 'none' : 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
    }
    /**
     * Handles the gauge resize.
     * @return {boolean}
     * @private
     */
    gaugeResize(e) {
        let args = {
            gauge: !this.isBlazor ? this : null,
            previousSize: new Size(this.availableSize.width, this.availableSize.height),
            name: resized,
            currentSize: new Size(0, 0)
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        if (this.element.classList.contains('e-lineargauge')) {
            this.resizeTo = window.setTimeout(() => {
                this.createSvg();
                this.renderGaugeElements();
                this.calculateBounds();
                this.renderAxisElements();
                args.currentSize = new Size(this.availableSize.width, this.availableSize.height);
                this.trigger(resized, args);
                this.render();
            }, 500);
        }
        return false;
    }
    /**
     * To destroy the gauge element from the DOM.
     */
    destroy() {
        this.unWireEvents();
        this.removeSvg();
        super.destroy();
    }
    /**
     * @private
     * To render the gauge container
     */
    renderContainer() {
        let width;
        let height;
        let x;
        let y;
        let options;
        let path = '';
        let topRadius;
        let bottomRadius;
        let fill = (this.container.backgroundColor !== 'transparent'
            || (this.theme !== 'Bootstrap4' && this.theme !== 'Material'))
            ? this.container.backgroundColor : this.themeStyle.containerBackground;
        let rect;
        let radius = this.container.width;
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
    }
    /**
     * Handles the mouse down on gauge.
     * @return {boolean}
     * @private
     */
    gaugeOnMouseDown(e) {
        let element = e.target;
        let clientRect = this.element.getBoundingClientRect();
        let current;
        let args = this.getMouseArgs(e, 'touchstart', gaugeMouseDown);
        this.trigger(gaugeMouseDown, args, (mouseArgs) => {
            this.mouseX = args.x;
            this.mouseY = args.y;
            if (args.target) {
                if (!args.cancel && ((args.target.id.indexOf('MarkerPointer') > -1) || (args.target.id.indexOf('BarPointer') > -1))) {
                    current = this.moveOnPointer(args.target);
                    if (!(isNullOrUndefined(current)) && current.pointer) {
                        this.pointerDrag = true;
                        this.mouseElement = args.target;
                    }
                }
            }
        });
        return true;
    }
    /**
     * Handles the mouse move.
     * @return {boolean}
     * @private
     */
    mouseMove(e) {
        let current;
        let args = this.getMouseArgs(e, 'touchmove', gaugeMouseMove);
        this.trigger(gaugeMouseMove, args, (mouseArgs) => {
            this.mouseX = args.x;
            this.mouseY = args.y;
            if (args.target && !args.cancel) {
                if ((args.target.id.indexOf('MarkerPointer') > -1) || (args.target.id.indexOf('BarPointer') > -1)) {
                    current = this.moveOnPointer(args.target);
                    if (!(isNullOrUndefined(current)) && current.pointer) {
                        this.element.style.cursor = current.style;
                    }
                }
                else {
                    this.element.style.cursor = (this.pointerDrag) ? this.element.style.cursor : 'auto';
                }
                this.gaugeOnMouseMove(e);
            }
        });
        this.notify(Browser.touchMoveEvent, e);
        return false;
    }
    /**
     * To find the mouse move on pointer.
     * @param element
     */
    moveOnPointer(element) {
        let current;
        let clientRect = this.element.getBoundingClientRect();
        let axis;
        let isPointer = false;
        let pointer;
        let top;
        let left;
        let pointerElement = getElement(element.id);
        let svgPath = pointerElement;
        let cursorStyle;
        let process;
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
    }
    /**
     * @private
     * Handle the right click
     * @param event
     */
    gaugeRightClick(event) {
        if (event.buttons === 2 || event.pointerType === 'touch') {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        return true;
    }
    /**
     * Handles the mouse leave.
     * @return {boolean}
     * @private
     */
    mouseLeave(e) {
        let parentNode;
        let args = this.getMouseArgs(e, 'touchmove', gaugeMouseLeave);
        if (!isNullOrUndefined(this.mouseElement)) {
            parentNode = this.element;
            parentNode.style.cursor = '';
            this.mouseElement = null;
            this.pointerDrag = false;
        }
        return false;
    }
    /**
     * Handles the mouse move on gauge.
     * @return {boolean}
     * @private
     */
    gaugeOnMouseMove(e) {
        let current;
        if (this.pointerDrag) {
            current = getPointer(this.mouseElement, this);
            if (current.pointer.enableDrag && current.pointer.animationComplete) {
                this[current.pointer.type.toLowerCase() + 'Drag'](current.axis, current.pointer);
            }
        }
        return true;
    }
    /**
     * Handles the mouse up.
     * @return {boolean}
     * @private
     */
    mouseEnd(e) {
        let parentNode;
        let isTouch = e.pointerType === 'touch' || e.pointerType === '2' || e.type === 'touchend';
        let args = this.getMouseArgs(e, 'touchend', gaugeMouseUp);
        this.trigger(gaugeMouseUp, args);
        if (!isNullOrUndefined(this.mouseElement)) {
            parentNode = this.element;
            parentNode.style.cursor = '';
            this.mouseElement = null;
            this.pointerDrag = false;
        }
        this.notify(Browser.touchEndEvent, e);
        return true;
    }
    /**
     * Handles the print method for gauge control.
     */
    print(id) {
        let exportChart = new ExportUtils(this);
        exportChart.print(id);
    }
    /**
     * Handles the export method for gauge control.
     * @param type
     * @param fileName
     */
    export(type, fileName, orientation) {
        let exportMap = new ExportUtils(this);
        exportMap.export(type, fileName, orientation);
    }
    /**
     * Handles the mouse event arguments.
     * @return {IMouseEventArgs}
     * @private
     */
    getMouseArgs(e, type, name) {
        let rect = this.element.getBoundingClientRect();
        let location = new GaugeLocation(-rect.left, -rect.top);
        let isTouch = (e.type === type);
        location.x += isTouch ? e.changedTouches[0].clientX : e.clientX;
        location.y += isTouch ? e.changedTouches[0].clientY : e.clientY;
        return {
            cancel: false, name: name,
            model: !this.isBlazor ? this : null,
            x: location.x, y: location.y,
            target: isTouch ? e.target : e.target
        };
    }
    /**
     * @private
     * @param axis
     * @param pointer
     */
    markerDrag(axis, pointer) {
        let options;
        let value = convertPixelToValue(this.element, this.mouseElement, this.orientation, axis, 'drag', new GaugeLocation(this.mouseX, this.mouseY));
        let process = withInRange(value, null, null, axis.visibleRange.max, axis.visibleRange.min, 'pointer');
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
    }
    /**
     * @private
     * @param axis
     * @param pointer
     */
    barDrag(axis, pointer) {
        let line = axis.lineBounds;
        let range = axis.visibleRange;
        let value1;
        let value2;
        let isDrag;
        let lineHeight = (this.orientation === 'Vertical') ? line.height : line.width;
        let lineY = (this.orientation === 'Vertical') ? line.y : line.x;
        let path;
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
    }
    /**
     * Triggers when drag the pointer
     * @param activeElement
     */
    triggerDragEvent(activeElement) {
        let active = getPointer(this.mouseElement, this);
        let value = convertPixelToValue(this.element, this.mouseElement, this.orientation, active.axis, 'tooltip', null);
        let dragArgs = {
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
    }
    /**
     * To set the pointer value using this method
     * @param axisIndex
     * @param pointerIndex
     * @param value
     */
    setPointerValue(axisIndex, pointerIndex, value) {
        let axis = this.axes[axisIndex];
        let pointer = axis.pointers[pointerIndex];
        let id = this.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer_' + pointerIndex;
        let pointerElement = getElement(id);
        pointer.currentValue = value;
        if ((pointerElement !== null) && withInRange(pointer.currentValue, null, null, axis.visibleRange.max, axis.visibleRange.min, 'pointer')) {
            this.gaugeAxisLayoutPanel['calculate' + pointer.type + 'Bounds'](axisIndex, axis, pointerIndex, pointer);
            this.axisRenderer['draw' + pointer.type + 'Pointer'](axis, axisIndex, pointer, pointerIndex, pointerElement.parentElement);
        }
    }
    /**
     * To set the annotation value using this method.
     * @param annotationIndex
     * @param content
     */
    setAnnotationValue(annotationIndex, content, axisValue) {
        let elementExist = getElement(this.element.id + '_Annotation_' + annotationIndex) === null;
        let element = getElement(this.element.id + '_AnnotationsGroup') ||
            createElement('div', {
                id: this.element.id + '_AnnotationsGroup'
            });
        let annotation = this.annotations[annotationIndex];
        if (content !== null) {
            removeElement(this.element.id + '_Annotation_' + annotationIndex);
            annotation.content = content;
            annotation.axisValue = axisValue ? axisValue : annotation.axisValue;
            this.annotationsModule.createAnnotationTemplate(element, annotationIndex);
            if (!elementExist) {
                element.appendChild(getElement(this.element.id + '_Annotation_' + annotationIndex));
            }
        }
    }
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    requiredModules() {
        let modules = [];
        let annotationEnable = false;
        this.annotations.map((annotation, index) => {
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
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData() {
        let keyEntity = ['loaded'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Get component name
     */
    getModuleName() {
        return 'lineargauge';
    }
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        let renderer = false;
        let refreshBounds = false;
        for (let prop of Object.keys(newProp)) {
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

/**
 * Linear gauge component exported items
 */

/**
 * LinearGauge component exported.
 */

export { LinearGauge, Font, Margin, Border, Annotation, Container, TooltipSettings, Line, Label, Range, Tick, Pointer, Axis, stringToNumber, measureText, withInRange, convertPixelToValue, getPathToRect, getElement, removeElement, isPointerDrag, valueToCoefficient, getFontStyle, textFormatter, formatValue, getLabelFormat, getTemplateFunction, getElementOffset, VisibleRange, GaugeLocation, Size, Rect, CustomizeOption, PathOption, RectOption, TextOption, VisibleLabels, Align, textElement, calculateNiceInterval, getActualDesiredIntervalsCount, getPointer, getRangeColor, getRangePalette, calculateShapes, getBox, Annotations, GaugeTooltip };
//# sourceMappingURL=ej2-lineargauge.es2015.js.map
