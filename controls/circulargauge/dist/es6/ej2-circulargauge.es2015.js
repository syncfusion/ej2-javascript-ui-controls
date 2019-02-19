import { Animation, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, NotifyPropertyChanges, Property, SvgRenderer, compile, createElement, isNullOrUndefined, merge, remove, setStyleAttribute } from '@syncfusion/ej2-base';
import { Tooltip } from '@syncfusion/ej2-svg-base';

/**
 * Specifies Circular-Gauge Helper methods
 */
/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {FontModel} font
 * @param  {string} id
 * @returns Size
 * @private
 */
function measureText(text, font) {
    let htmlObject = document.getElementById('gauge-measuretext');
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'gauge-measuretext' });
        document.body.appendChild(htmlObject);
    }
    let style = 'position: absolute; visibility: hidden;' +
        ';left: 0; top: -100; white-space: nowrap;' + getFontStyle(font);
    htmlObject.innerHTML = text;
    htmlObject.setAttribute('style', style);
    return new Size(htmlObject.clientWidth, htmlObject.clientHeight);
}
/**
 * Function to find number from string
 * * @returns number
 * @private
 */
function toPixel(value, maxDimension) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (maxDimension / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/**
 * Function to get the style from FontModel.
 * @returns string
 * @private
 */
function getFontStyle(font) {
    let style = '';
    style = 'font-size:' + font.size +
        '; font-style:' + font.fontStyle + '; font-weight:' + font.fontWeight +
        '; font-family:' + font.fontFamily + ';opacity:' + font.opacity +
        '; color:' + font.color + ';';
    return style;
}
/**
 * Function to set style to the element.
 * @private
 */
function setStyles(element, fill, border) {
    setStyleAttribute(element, {
        'stroke': border.color, 'stroke-width': border.width,
        'fill': fill
    });
}
/**
 * Function to measure the element rect.
 * @returns ClientRect
 * @private
 */
function measureElementRect(element) {
    let bounds;
    document.body.appendChild(element);
    bounds = element.getBoundingClientRect();
    removeElement(element.id);
    return bounds;
}
/**
 * Function to convert the number from string.
 * @returns number
 * @private
 */
function stringToNumber(value, containerSize) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/**
 * Function to create the text element.
 * @returns Element
 * @private
 */
function textElement(options, font, color, parent, styles) {
    let renderOptions = {};
    let htmlObject;
    let renderer = new SvgRenderer('');
    let style = styles + ' font-size:' + font.size + '; font-style:' + font.fontStyle +
        ' ; font-weight:' + font.fontWeight + '; font-family:' + font.fontFamily + ';';
    renderOptions = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'fill': color,
        'text-anchor': options.anchor,
        'transform': options.transform,
        'opacity': font.opacity,
        'dominant-baseline': options.baseLine,
        'style': style
    };
    htmlObject = renderer.createText(renderOptions, options.text);
    parent.appendChild(htmlObject);
    return htmlObject;
}
/**
 * Function to append the path to the element.
 * @returns Element
 * @private
 */
function appendPath(options, element, gauge, functionName) {
    functionName = functionName ? functionName : 'Path';
    let htmlObject = gauge.renderer['draw' + functionName](options);
    htmlObject.setAttribute('transform', options.transform);
    htmlObject.setAttribute('style', options.style);
    element.appendChild(htmlObject);
    return htmlObject;
}
/**
 * Function to calculate the sum of array values.
 * @returns number
 * @private
 */
function calculateSum(from, to, values) {
    let sum = 0;
    let length = values.length;
    for (; from < length; from++) {
        sum += values[from];
    }
    return sum;
}
/**
 * Function to calculate the value for linear animation effect
 * @param currentTime
 * @param startValue
 * @param endValue
 * @param duration
 * @private
 */
function linear(currentTime, startValue, endValue, duration) {
    return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
}
/**
 * Function to get the angle from value for circular gauge.
 * @returns number
 * @private
 */
function getAngleFromValue(value, maximumValue, minimumValue, startAngle, endAngle, isClockWise) {
    let angle;
    endAngle -= isCompleteAngle(startAngle, endAngle) ? 0.0001 : 0;
    startAngle -= 90;
    endAngle -= 90;
    if (isClockWise) {
        angle = ((value - minimumValue) * (getDegree(startAngle, endAngle) / (maximumValue - minimumValue))) + startAngle;
    }
    else {
        angle = endAngle - ((value - minimumValue) * (getDegree(startAngle, endAngle) / (maximumValue - minimumValue)));
        angle = angle < 0 ? 360 + angle : angle;
    }
    angle = Math.round(angle) >= 360 ? (angle - 360) : Math.round(angle) < 0 ? (360 + angle) : angle;
    return angle;
}
/**
 * Function to get the degree for circular gauge.
 * @returns number
 * @private
 */
function getDegree(startAngle, endAngle) {
    let degree = endAngle - startAngle;
    return degree < 0 ? (degree + 360) : degree;
}
/**
 * Function to get the value from angle for circular gauge.
 * @returns number
 * @private
 */
function getValueFromAngle(angle, maximumValue, minimumValue, startAngle, endAngle, isClockWise) {
    endAngle -= isCompleteAngle(startAngle, endAngle) ? 0.0001 : 0;
    angle = angle < startAngle ? (angle + 360) : angle;
    if (isClockWise) {
        return (((angle - startAngle) / getDegree(startAngle, endAngle)) * (maximumValue - minimumValue)) + minimumValue;
    }
    else {
        return maximumValue - ((((angle - startAngle) / getDegree(startAngle, endAngle)) * (maximumValue - minimumValue)) + minimumValue);
    }
}
/**
 * Function to check whether it's a complete circle for circular gauge.
 * @returns boolean
 * @private
 */
function isCompleteAngle(startAngle, endAngle) {
    let totalAngle = endAngle - startAngle;
    totalAngle = totalAngle <= 0 ? (totalAngle + 360) : totalAngle;
    return Math.floor(totalAngle / 360) !== 0;
}
/**
 * Function to get angle from location for circular gauge.
 * @returns number
 * @private
 */
function getAngleFromLocation(center, point) {
    let angle = Math.atan2((point.y - center.y), (point.x - center.x));
    angle = Math.round((angle < 0 ? (6.283 + angle) : angle) * (180 / Math.PI)) - 270;
    angle += angle < 0 ? 360 : 0;
    return angle;
}
/**
 * Function to get the location from angle for circular gauge.
 * @returns GaugeLocation
 * @private
 */
function getLocationFromAngle(degree, radius, center) {
    let radian = (degree * Math.PI) / 180;
    return new GaugeLocation(Math.cos(radian) * radius + center.x, Math.sin(radian) * radius + center.y);
}
/**
 * Function to get the path direction of the circular gauge.
 * @returns string
 * @private
 */
function getPathArc(center, start, end, radius, startWidth, endWidth) {
    end -= isCompleteAngle(start, end) ? 0.0001 : 0;
    let degree = getDegree(start, end);
    let startRadius = radius - startWidth;
    let endRadius = radius - endWidth;
    let arcRadius = radius - ((startWidth + endWidth) / 2);
    if (startWidth !== undefined && endWidth !== undefined) {
        return getRangePath(getLocationFromAngle(start, radius, center), getLocationFromAngle(end, radius, center), getLocationFromAngle(start, startRadius, center), getLocationFromAngle(end, endRadius, center), radius, arcRadius, arcRadius, (degree < 180) ? 0 : 1);
    }
    else {
        return getCirclePath(getLocationFromAngle(start, radius, center), getLocationFromAngle(end, radius, center), radius, (degree < 180) ? 0 : 1);
    }
}
/**
 * Function to get the range path direction of the circular gauge.
 * @returns string
 * @private
 */
function getRangePath(start, end, innerStart, innerEnd, radius, startRadius, endRadius, clockWise) {
    return 'M ' + start.x + ' ' + start.y +
        ' A ' + radius + ' ' + radius + ' 0 ' +
        clockWise + ' 1 ' + end.x + ' ' + end.y +
        ' L ' + innerEnd.x + ' ' + innerEnd.y +
        ' A ' + endRadius + ' ' + startRadius + ' 0 ' +
        clockWise + ' 0 ' + innerStart.x + ' ' + innerStart.y + ' Z';
}
/**
 * Function to get the rounded path direction of the circular gauge.
 * @returns string
 * @private
 */
function getRoundedPathArc(center, actualStart, actualEnd, oldStart, oldEnd, radius, startWidth, endWidth) {
    actualEnd -= isCompleteAngle(actualStart, actualEnd) ? 0.0001 : 0;
    let degree = getDegree(actualStart, actualEnd);
    let startRadius = radius - startWidth;
    let endRadius = radius - endWidth;
    let arcRadius = radius - ((startWidth + endWidth) / 2);
    return getRoundedPath(getLocationFromAngle(actualStart, radius, center), getLocationFromAngle(actualEnd, radius, center), getLocationFromAngle(oldEnd, radius, center), getLocationFromAngle(oldEnd, endRadius, center), getLocationFromAngle(oldStart, radius, center), getLocationFromAngle(oldStart, startRadius, center), getLocationFromAngle(actualStart, startRadius, center), getLocationFromAngle(actualEnd, endRadius, center), radius, arcRadius, arcRadius, (degree < 180) ? 0 : 1);
}
/**
 * Function to get the rounded range path direction of the circular gauge.
 * @returns string
 * @private
 */
function getRoundedPath(start, end, outerOldEnd, innerOldEnd, outerOldStart, innerOldStart, innerStart, innerEnd, radius, startRadius, endRadius, clockWise) {
    return 'M ' + start.x + ' ' + start.y +
        ' A ' + radius + ' ' + radius + ' 0 ' +
        clockWise + ' 1 ' + end.x + ' ' + end.y +
        ' C ' + outerOldEnd.x + ' ' + outerOldEnd.y + ' ' + innerOldEnd.x + ' ' +
        innerOldEnd.y + ' ' + innerEnd.x + ' ' + innerEnd.y +
        ' A ' + endRadius + ' ' + startRadius + ' 0 ' +
        clockWise + ' 0 ' + innerStart.x + ' ' + innerStart.y +
        ' C ' + innerOldStart.x + ' ' + innerOldStart.y + ' ' + outerOldStart.x + ' ' +
        outerOldStart.y + ' ' + start.x + ' ' + start.y + ' Z';
}
/**
 * Function to calculate the complete path arc of the circular gauge.
 * @returns string
 * @private
 */
function getCompleteArc(center, start, end, radius, innerRadius) {
    end -= isCompleteAngle(start, end) ? 0.0001 : 0;
    let degree = getDegree(start, end);
    return getCompletePath(center, getLocationFromAngle(start, radius, center), getLocationFromAngle(end, radius, center), radius, getLocationFromAngle(start, innerRadius, center), getLocationFromAngle(end, innerRadius, center), innerRadius, (degree < 180) ? 0 : 1);
}
/**
 * Function to get the circular path direction of the circular gauge.
 * @returns string
 * @private
 */
function getCirclePath(start, end, radius, clockWise) {
    return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' +
        radius + ' 0 ' + clockWise + ' 1 ' + end.x + ' ' + end.y;
}
/**
 * Function to get the complete path direction of the circular gauge.
 * @returns string
 * @private
 */
function getCompletePath(center, start, end, radius, innerStart, innerEnd, innerRadius, clockWise) {
    return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' + radius + ' 0 ' + clockWise +
        ' 1 ' + end.x + ' ' + end.y + ' L ' + innerEnd.x + ' ' + innerEnd.y + ' A ' + innerRadius +
        ' ' + innerRadius + ' 0 ' + clockWise + ',0 ' + innerStart.x + ' ' + innerStart.y + ' Z';
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
 * Function to compile the template function for circular gauge.
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
 * Function to remove the element from id.
 * @private
 */
function removeElement(id) {
    let element = getElement(id);
    if (element) {
        remove(element);
    }
}
/**
 * Function to get current point for circular gauge using element id.
 * @returns IVisiblePointer
 * @private
 */
function getPointer(targetId, gauge) {
    let tempString;
    tempString = targetId.replace(gauge.element.id, '').split('_Axis_')[1];
    return {
        axisIndex: +tempString[0],
        pointerIndex: +tempString[tempString.length - 1]
    };
}
function getElementSize(template, gauge, parent) {
    let elementSize;
    let element;
    let templateFn = getTemplateFunction(template);
    if (templateFn && templateFn(gauge).length) {
        element = gauge.createElement('div', { id: gauge.element.id + '_Measure_Element' });
        gauge.element.appendChild(element);
        let templateElement = templateFn(gauge);
        while (templateElement.length > 0) {
            element.appendChild(templateElement[0]);
        }
        parent.appendChild(element);
        elementSize = new Size(parent.getBoundingClientRect().width, parent.getBoundingClientRect().height);
        remove(element);
    }
    return elementSize;
}
/**
 * Function to get the mouse position
 * @param pageX
 * @param pageY
 * @param element
 */
function getMousePosition(pageX, pageY, element) {
    let elementRect = element.getBoundingClientRect();
    let pageXOffset = element.ownerDocument.defaultView.pageXOffset;
    let pageYOffset = element.ownerDocument.defaultView.pageYOffset;
    let clientTop = element.ownerDocument.documentElement.clientTop;
    let clientLeft = element.ownerDocument.documentElement.clientLeft;
    let positionX = elementRect.left + pageXOffset - clientLeft;
    let positionY = elementRect.top + pageYOffset - clientTop;
    return new GaugeLocation((pageX - positionX), (pageY - positionY));
}
/**
 * Function to convert the label using formar for cirular gauge.
 * @returns string
 * @private
 */
function getLabelFormat(format) {
    let customLabelFormat = format && format.match('{value}') !== null;
    let skeleton = customLabelFormat ? '' : format;
    return skeleton;
}
/**
 * Function to calculate the marker shape for circular gauge.
 * @returns PathOption
 * @private
 */
function calculateShapes(location, shape, size, url, options) {
    let path;
    let width = size.width;
    let height = size.height;
    let locX = location.x;
    let locY = location.y;
    let x = location.x + (-width / 2);
    let y = location.y + (-height / 2);
    switch (shape) {
        case 'Circle':
            merge(options, { 'rx': width / 2, 'ry': height / 2, 'cx': locX, 'cy': locY });
            break;
        case 'Diamond':
            path = 'M' + ' ' + x + ' ' + locY + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + locY + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + locY + ' Z';
            merge(options, { 'd': path });
            break;
        case 'Rectangle':
            path = 'M' + ' ' + x + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (locY + (-height / 2)) + ' Z';
            merge(options, { 'd': path });
            break;
        case 'Triangle':
            path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                'L' + ' ' + (locX - height) + ' ' + (locY - (width / 2)) +
                'L' + ' ' + (locX - height) + ' ' + (locY + (width / 2)) + ' Z';
            merge(options, { 'd': path });
            break;
        case 'InvertedTriangle':
            path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                'L' + ' ' + (locX + height) + ' ' + (locY - (width / 2)) +
                'L' + ' ' + (locX + height) + ' ' + (locY + (width / 2)) + ' Z';
            merge(options, { 'd': path });
            break;
        case 'Image':
            merge(options, { 'href': url, 'height': height, 'width': width, x: x, y: y });
            break;
    }
    return options;
}
/**
 * Function to get range color from value for circular gauge.
 * @returns string
 * @private
 */
function getRangeColor(value, ranges, color) {
    let min = 0;
    let max = 0;
    let currentRange = ranges.filter((range) => {
        min = Math.min(range.start, range.end);
        max = Math.max(range.start, range.end);
        return (value >= min && max >= value);
    });
    return currentRange.length ? currentRange[0].rangeColor : color;
}
/** @private */
class CustomizeOption {
    constructor(id) {
        this.id = id;
    }
}
/** @private */
class PathOption extends CustomizeOption {
    constructor(id, fill, width, color, opacity, dashArray, d, transform = '', style = '') {
        super(id);
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
        this.transform = transform;
        this.style = style;
    }
}
/** @private */
class RectOption extends CustomizeOption {
    constructor(id, fill, border, opacity, rect) {
        super(id);
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height;
        this.width = rect.width;
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = border.color;
        this['stroke-width'] = border.width;
    }
}
/**
 * Internal class size
 */
class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}
/** @private */
class GaugeLocation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
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

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the borders in circular gauge.
 */
class Border extends ChildProperty {
}
__decorate$1([
    Property('')
], Border.prototype, "color", void 0);
__decorate$1([
    Property(1)
], Border.prototype, "width", void 0);
/**
 * Configures the fonts in circular gauge.
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
    Property('segoe UI')
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
/**
 * Configures the margin of circular gauge.
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
 * Configures the tooltip in circular gauge.
 */
class TooltipSettings extends ChildProperty {
}
__decorate$1([
    Property(false)
], TooltipSettings.prototype, "enable", void 0);
__decorate$1([
    Property('#000000')
], TooltipSettings.prototype, "fill", void 0);
__decorate$1([
    Complex({ color: '#ffffff', size: '13px' }, Font)
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
__decorate$1([
    Property(false)
], TooltipSettings.prototype, "showAtMousePosition", void 0);

/**
 * Specifies gauge Themes
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
    Theme.axisLineColor = null;
    /** @private */
    Theme.tickLineColor = null;
    /** @private */
    Theme.pointerColor = null;
})(Theme || (Theme = {}));
/** @private */
function getRangePalette(theme) {
    let palette = ['#50c917', '#27d5ff', '#fcde0b', '#ffb133', '#ff5985'];
    // switch (theme) {
    //     case 'Material':
    //         palette = ['#50c917', '#27d5ff', '#fcde0b', '#ffb133', '#ff5985'];
    //         break;
    //      case 'Fabric':
    //         palette = ['#50c917', '#27d5ff', '#fcde0b', '#ffb133', '#ff5985'];
    //         break;
    // }
    return palette;
}

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the axis line.
 */
class Line extends ChildProperty {
}
__decorate$2([
    Property(2)
], Line.prototype, "width", void 0);
__decorate$2([
    Property('')
], Line.prototype, "dashArray", void 0);
__decorate$2([
    Property(Theme.axisLineColor)
], Line.prototype, "color", void 0);
/**
 * Configures the axis label.
 */
class Label extends ChildProperty {
}
__decorate$2([
    Complex(Theme.axisLabelFont, Font)
], Label.prototype, "font", void 0);
__decorate$2([
    Property('')
], Label.prototype, "format", void 0);
__decorate$2([
    Property('Inside')
], Label.prototype, "position", void 0);
__decorate$2([
    Property('None')
], Label.prototype, "hiddenLabel", void 0);
__decorate$2([
    Property(false)
], Label.prototype, "autoAngle", void 0);
__decorate$2([
    Property(false)
], Label.prototype, "useRangeColor", void 0);
__decorate$2([
    Property(0)
], Label.prototype, "offset", void 0);
/**
 * Configures the ranges of an axis.
 */
class Range extends ChildProperty {
}
__decorate$2([
    Property(null)
], Range.prototype, "start", void 0);
__decorate$2([
    Property(null)
], Range.prototype, "end", void 0);
__decorate$2([
    Property(null)
], Range.prototype, "radius", void 0);
__decorate$2([
    Property(10)
], Range.prototype, "startWidth", void 0);
__decorate$2([
    Property(10)
], Range.prototype, "endWidth", void 0);
__decorate$2([
    Property(null)
], Range.prototype, "color", void 0);
__decorate$2([
    Property(0)
], Range.prototype, "roundedCornerRadius", void 0);
__decorate$2([
    Property(1)
], Range.prototype, "opacity", void 0);
/**
 * Configures the major and minor tick lines of an axis.
 */
class Tick extends ChildProperty {
}
__decorate$2([
    Property(null)
], Tick.prototype, "width", void 0);
__decorate$2([
    Property(null)
], Tick.prototype, "height", void 0);
__decorate$2([
    Property(null)
], Tick.prototype, "interval", void 0);
__decorate$2([
    Property(0)
], Tick.prototype, "offset", void 0);
__decorate$2([
    Property(Theme.tickLineColor)
], Tick.prototype, "color", void 0);
__decorate$2([
    Property('Inside')
], Tick.prototype, "position", void 0);
__decorate$2([
    Property(false)
], Tick.prototype, "useRangeColor", void 0);
/**
 * Configures the needle cap in pointer.
 */
class Cap extends ChildProperty {
}
__decorate$2([
    Property('#ffffff')
], Cap.prototype, "color", void 0);
__decorate$2([
    Complex({ color: Theme.pointerColor, width: 8 }, Border)
], Cap.prototype, "border", void 0);
__decorate$2([
    Property(8)
], Cap.prototype, "radius", void 0);
/**
 * Configures the back needle in pointers.
 */
class NeedleTail extends ChildProperty {
}
__decorate$2([
    Property(Theme.pointerColor)
], NeedleTail.prototype, "color", void 0);
__decorate$2([
    Complex({ color: Theme.pointerColor, width: 0 }, Border)
], NeedleTail.prototype, "border", void 0);
__decorate$2([
    Property('0%')
], NeedleTail.prototype, "length", void 0);
/**
 * Configures the animation of pointers.
 */
class Animation$1 extends ChildProperty {
}
__decorate$2([
    Property(true)
], Animation$1.prototype, "enable", void 0);
__decorate$2([
    Property(1000)
], Animation$1.prototype, "duration", void 0);
/**
 * ‘Annotation’ module is used to handle annotation action for an axis.
 */
class Annotation extends ChildProperty {
}
__decorate$2([
    Property(null)
], Annotation.prototype, "content", void 0);
__decorate$2([
    Property(90)
], Annotation.prototype, "angle", void 0);
__decorate$2([
    Property('50%')
], Annotation.prototype, "radius", void 0);
__decorate$2([
    Property('-1')
], Annotation.prototype, "zIndex", void 0);
__decorate$2([
    Property(false)
], Annotation.prototype, "autoAngle", void 0);
__decorate$2([
    Complex({ size: '12px', color: '#686868' }, Font)
], Annotation.prototype, "textStyle", void 0);
__decorate$2([
    Property(null)
], Annotation.prototype, "description", void 0);
/**
 * Configures the pointers of an axis.
 */
class Pointer extends ChildProperty {
}
__decorate$2([
    Property(null)
], Pointer.prototype, "value", void 0);
__decorate$2([
    Property('Needle')
], Pointer.prototype, "type", void 0);
__decorate$2([
    Property(0)
], Pointer.prototype, "roundedCornerRadius", void 0);
__decorate$2([
    Property(null)
], Pointer.prototype, "imageUrl", void 0);
__decorate$2([
    Property(null)
], Pointer.prototype, "radius", void 0);
__decorate$2([
    Property(20)
], Pointer.prototype, "pointerWidth", void 0);
__decorate$2([
    Complex({}, Cap)
], Pointer.prototype, "cap", void 0);
__decorate$2([
    Complex({}, NeedleTail)
], Pointer.prototype, "needleTail", void 0);
__decorate$2([
    Property(Theme.pointerColor)
], Pointer.prototype, "color", void 0);
__decorate$2([
    Complex({ color: '#DDDDDD', width: 0 }, Border)
], Pointer.prototype, "border", void 0);
__decorate$2([
    Complex(null, Animation$1)
], Pointer.prototype, "animation", void 0);
__decorate$2([
    Property('Circle')
], Pointer.prototype, "markerShape", void 0);
__decorate$2([
    Property(5)
], Pointer.prototype, "markerHeight", void 0);
__decorate$2([
    Property(null)
], Pointer.prototype, "description", void 0);
__decorate$2([
    Property(5)
], Pointer.prototype, "markerWidth", void 0);
/**
 * Configures an axis in a gauge.
 */
class Axis extends ChildProperty {
    constructor() {
        /**
         * Specifies the minimum value of an axis.
         * @aspDefaultValueIgnore
         * @default null
         */
        super(...arguments);
        /** @private */
        this.visibleLabels = [];
    }
}
__decorate$2([
    Property(null)
], Axis.prototype, "minimum", void 0);
__decorate$2([
    Property(null)
], Axis.prototype, "maximum", void 0);
__decorate$2([
    Property(false)
], Axis.prototype, "showLastLabel", void 0);
__decorate$2([
    Property(null)
], Axis.prototype, "roundingPlaces", void 0);
__decorate$2([
    Property(null)
], Axis.prototype, "radius", void 0);
__decorate$2([
    Complex({}, Line)
], Axis.prototype, "lineStyle", void 0);
__decorate$2([
    Collection([{}], Range)
], Axis.prototype, "ranges", void 0);
__decorate$2([
    Collection([{}], Pointer)
], Axis.prototype, "pointers", void 0);
__decorate$2([
    Collection([{}], Annotation)
], Axis.prototype, "annotations", void 0);
__decorate$2([
    Complex({ width: 2, height: 10 }, Tick)
], Axis.prototype, "majorTicks", void 0);
__decorate$2([
    Complex({ width: 2, height: 5 }, Tick)
], Axis.prototype, "minorTicks", void 0);
__decorate$2([
    Property(200)
], Axis.prototype, "startAngle", void 0);
__decorate$2([
    Property(160)
], Axis.prototype, "endAngle", void 0);
__decorate$2([
    Property('ClockWise')
], Axis.prototype, "direction", void 0);
__decorate$2([
    Property(null)
], Axis.prototype, "background", void 0);
__decorate$2([
    Property(null)
], Axis.prototype, "rangeGap", void 0);
__decorate$2([
    Property(false)
], Axis.prototype, "startAndEndRangeGap", void 0);
__decorate$2([
    Complex({}, Label)
], Axis.prototype, "labelStyle", void 0);

/**
 * Specifies the gauge constant value
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
const radiusCalculate = 'radiusCalculate';
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
const dragStart = 'dragStart';
/** @private */
const dragMove = 'dragMove';
/** @private */
const dragEnd = 'dragEnd';
/** @private */
const resized = 'resized';

/**
 * Annotation Module handles the Annotation of the axis.
 */
class Annotations {
    /**
     * Constructor for Annotation module.
     * @private.
     */
    constructor(gauge) {
        this.gauge = gauge;
        this.elementId = gauge.element.id;
    }
    /**
     * Method to render the annotation for circular gauge.
     */
    renderAnnotation(axis, index) {
        let width = parseInt(this.gauge.width, 10);
        let element = createElement('div', {
            id: this.elementId + '_Annotations_' + index
        });
        let parentElement = getElement(this.elementId + '_Secondary_Element');
        document.getElementById(this.elementId + '_Secondary_Element').style.width = width + 'px';
        axis.annotations.map((annotation, annotationIndex) => {
            if (annotation.content !== null) {
                this.createTemplate(element, annotationIndex, index);
            }
        });
        if (parentElement && element.childElementCount) {
            parentElement.appendChild(element);
        }
    }
    /**
     * Method to create annotation template for circular gauge.
     */
    createTemplate(element, annotationIndex, axisIndex) {
        let axis = this.gauge.axes[axisIndex];
        let annotation = axis.annotations[annotationIndex];
        let childElement = createElement('div', {
            id: this.elementId + '_Axis_' + axisIndex + '_Annotation_' + annotationIndex,
            styles: 'position: absolute; z-index:' + annotation.zIndex + ';transform:' +
                (annotation.autoAngle ? 'rotate(' + (annotation.angle - 90) + 'deg)' : 'rotate(0deg)') + ';'
        });
        let argsData = {
            cancel: false, name: annotationRender, content: annotation.content,
            axis: axis, annotation: annotation, textStyle: annotation.textStyle
        };
        this.gauge.trigger(annotationRender, argsData);
        let templateFn;
        let templateElement;
        if (!argsData.cancel) {
            templateFn = getTemplateFunction(argsData.content);
            if (templateFn && templateFn(axis).length) {
                templateElement = Array.prototype.slice.call(templateFn(axis));
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
            this.updateLocation(childElement, axis, annotation);
            element.appendChild(childElement);
        }
    }
    /**
     * Method to update the annotation location for circular gauge.
     */
    updateLocation(element, axis, annotation) {
        let location = getLocationFromAngle(annotation.angle - 90, stringToNumber(annotation.radius, axis.currentRadius), this.gauge.midPoint);
        let elementRect = measureElementRect(element);
        element.style.left = (location.x - (elementRect.width / 2)) + 'px';
        element.style.top = (location.y - (elementRect.height / 2)) + 'px';
        element.setAttribute('aria-label', annotation.description || 'Annotation');
    }
    /**
     * Get module name.
     */
    getModuleName() {
        // Returns te module name
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
 * Tooltip Module handles the tooltip of the circular gauge
 */
class GaugeTooltip {
    /**
     * Constructor for Tooltip module.
     * @private.
     */
    constructor(gauge) {
        this.gauge = gauge;
        this.tooltipId = this.gauge.element.id + '_CircularGauge_Tooltip';
        this.tooltip = gauge.tooltip;
        this.textStyle = this.tooltip.textStyle;
        this.borderStyle = this.tooltip.border;
        this.addEventListener();
    }
    /**
     * Method to render the tooltip for circular gauge.
     */
    /* tslint:disable:no-string-literal */
    /* tslint:disable:max-func-body-length */
    renderTooltip(e) {
        let pageX;
        let pageY;
        let target;
        let touchArg;
        let location;
        let samePointerEle = false;
        if (e.type.indexOf('touch') !== -1) {
            touchArg = e;
            target = touchArg.target;
            pageX = touchArg.changedTouches[0].pageX;
            pageY = touchArg.changedTouches[0].pageY;
        }
        else {
            target = e.target;
            pageX = e.pageX;
            pageY = e.pageY;
        }
        if (target.id.indexOf('_Pointer_') >= 0) {
            if (this.pointerEle !== null) {
                samePointerEle = (this.pointerEle === target);
            }
            let svgRect = this.gauge.svgObject.getBoundingClientRect();
            let elementRect = this.gauge.element.getBoundingClientRect();
            let axisRect = document.getElementById(this.gauge.element.id + '_AxesCollection').getBoundingClientRect();
            let rect = new Rect(Math.abs(elementRect.left - svgRect.left), Math.abs(elementRect.top - svgRect.top), svgRect.width, svgRect.height);
            let currentPointer = getPointer(target.id, this.gauge);
            this.currentAxis = this.gauge.axes[currentPointer.axisIndex];
            this.currentPointer = (this.currentAxis.pointers)[currentPointer.pointerIndex];
            let angle = getAngleFromValue(this.currentPointer.currentValue, this.currentAxis.visibleRange.max, this.currentAxis.visibleRange.min, this.currentAxis.startAngle, this.currentAxis.endAngle, this.currentAxis.direction === 'ClockWise') % 360;
            let tooltipFormat = this.gauge.tooltip.format || this.currentAxis.labelStyle.format;
            let customLabelFormat = tooltipFormat && tooltipFormat.match('{value}') !== null;
            let format = this.gauge.intl.getNumberFormat({
                format: getLabelFormat(tooltipFormat), useGrouping: this.gauge.useGroupingSeparator
            });
            if (document.getElementById(this.tooltipId)) {
                this.tooltipEle = document.getElementById(this.tooltipId);
            }
            else {
                this.tooltipEle = createElement('div', {
                    id: this.tooltipId,
                    className: 'EJ2-CircularGauge-Tooltip',
                    styles: 'position: absolute;pointer-events:none;'
                });
                document.getElementById(this.gauge.element.id + '_Secondary_Element').appendChild(this.tooltipEle);
            }
            let roundValue;
            roundValue = this.currentAxis.roundingPlaces ?
                parseFloat(this.currentPointer.currentValue.toFixed(this.currentAxis.roundingPlaces)) :
                this.currentPointer.currentValue;
            let content = customLabelFormat ?
                tooltipFormat.replace(new RegExp('{value}', 'g'), format(roundValue)) :
                format(roundValue);
            location = getLocationFromAngle(angle, this.currentAxis.currentRadius, this.gauge.midPoint);
            location.x = (this.tooltip.template && ((angle >= 150 && angle <= 250) || (angle >= 330 && angle <= 360) ||
                (angle >= 0 && angle <= 45))) ? (location.x + 10) : location.x;
            let tooltipArgs = {
                name: tooltipRender, cancel: false, content: content, location: location, axis: this.currentAxis,
                tooltip: this.tooltip, pointer: this.currentPointer, event: e, gauge: this.gauge
            };
            this.gauge.trigger(tooltipRender, tooltipArgs);
            let template = tooltipArgs.tooltip.template;
            if (template !== null && Object.keys(template).length === 1) {
                template = template[Object.keys(template)[0]];
            }
            if (!this.tooltip.showAtMousePosition) {
                if (template) {
                    let elementSize = getElementSize(template, this.gauge, this.tooltipEle);
                    this.tooltipRect = Math.abs(axisRect.left - svgRect.left) > elementSize.width ?
                        this.findPosition(rect, angle, content, tooltipArgs.location) : rect;
                }
                else {
                    this.findPosition(rect, angle, content, tooltipArgs.location);
                }
            }
            else {
                tooltipArgs.location = getMousePosition(pageX, pageY, this.gauge.svgObject);
                this.tooltipRect = rect;
            }
            if (!tooltipArgs.cancel && !samePointerEle) {
                let themes = this.gauge.theme.toLowerCase();
                let tooltipColor = (themes.indexOf('dark') > -1 || themes === 'highcontrast') ? '#00000' : '#FFFFFF';
                tooltipArgs['tooltip']['properties']['textStyle']['color'] = tooltipColor;
                this.svgTooltip = new Tooltip({
                    enable: true,
                    data: { value: tooltipArgs.content },
                    template: template,
                    enableAnimation: tooltipArgs.tooltip.enableAnimation,
                    content: [tooltipArgs.content],
                    location: tooltipArgs.location,
                    inverted: this.arrowInverted,
                    areaBounds: this.tooltipRect,
                    fill: (themes.indexOf('dark') > -1 || themes === 'highcontrast') ? '#FFFFFF' : tooltipArgs.tooltip.fill,
                    textStyle: tooltipArgs.tooltip.textStyle,
                    border: tooltipArgs.tooltip.border
                });
                this.svgTooltip.appendTo(this.tooltipEle);
                if (template && Math.abs(pageY - this.tooltipEle.getBoundingClientRect().top) <= 0) {
                    this.tooltipEle.style.top = (parseFloat(this.tooltipEle.style.top) + 20) + 'px';
                }
            }
        }
        else {
            this.removeTooltip();
        }
    }
    /**
     * Method to find the position of the tooltip anchor for circular gauge.
     */
    findPosition(rect, angle, text, location) {
        let addLeft;
        let addTop;
        let addHeight;
        let addWidth;
        switch (true) {
            case (angle >= 0 && angle < 45):
                this.arrowInverted = true;
                addLeft = (angle >= 15 && angle <= 30) ? location.y : 0;
                this.tooltipRect = new Rect(rect.x, rect.y + addTop, rect.width, rect.height);
                this.tooltipPosition = 'RightBottom';
                break;
            case (angle >= 45 && angle < 90):
                this.arrowInverted = false;
                this.tooltipRect = new Rect(rect.x, rect.y + location.y, rect.width, rect.height);
                this.tooltipPosition = 'BottomRight';
                break;
            case (angle >= 90 && angle < 135):
                this.arrowInverted = false;
                this.tooltipRect = new Rect(rect.x, rect.y + location.y, rect.width, rect.height);
                this.tooltipPosition = 'BottomLeft';
                break;
            case (angle >= 135 && angle < 180):
                this.arrowInverted = true;
                addTop = (angle >= 150 && angle <= 160) ? location.y : 0;
                this.tooltipRect = new Rect(rect.x - rect.width, rect.y + addTop, rect.width, rect.height);
                this.tooltipPosition = 'LeftBottom';
                break;
            case (angle >= 180 && angle < 225):
                this.arrowInverted = true;
                addHeight = (angle >= 200 && angle <= 225) ? Math.abs(rect.y - location.y) : rect.height;
                this.tooltipRect = new Rect(rect.x - rect.width, rect.y, rect.width, addHeight);
                this.tooltipPosition = 'LeftTop';
                break;
            case (angle >= 225 && angle < 270):
                this.arrowInverted = false;
                addWidth = (angle >= 250 && angle <= 290) ? rect.width : Math.abs(rect.x - location.x);
                this.tooltipRect = new Rect(rect.x, rect.y, addWidth, rect.height);
                this.tooltipPosition = 'TopLeft';
                break;
            case (angle >= 270 && angle < 315):
                this.arrowInverted = false;
                addLeft = (angle >= 270 && angle > 290) ? location.x : 0;
                this.tooltipRect = new Rect(rect.x + addLeft, rect.y, rect.width, rect.height);
                this.tooltipPosition = 'TopRight';
                break;
            case (angle >= 315 && angle <= 360):
                this.arrowInverted = true;
                addHeight = (angle >= 315 && angle <= 340) ? Math.abs(rect.y - location.y) : rect.height;
                this.tooltipRect = new Rect(rect.x, rect.y, rect.width, addHeight);
                this.tooltipPosition = 'RightTop';
                break;
        }
        return this.tooltipRect;
    }
    removeTooltip() {
        if (document.getElementsByClassName('EJ2-CircularGauge-Tooltip').length > 0) {
            document.getElementsByClassName('EJ2-CircularGauge-Tooltip')[0].remove();
            this.pointerEle = null;
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
    /**
     * Get module name.
     */
    getModuleName() {
        // Returns te module name
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

/**
 * Specifies the Axis rendering for circular gauge
 */
class AxisRenderer {
    /**
     * Constructor for axis renderer.
     * @private.
     */
    constructor(gauge) {
        this.gauge = gauge;
    }
    /**
     * Method to render the axis element of the circular gauge.
     * @return {void}
     * @private
     */
    drawAxisOuterLine(axis, index, element, gauge) {
        let background = axis.background;
        this.setRangeColor(axis);
        if (background !== null) {
            appendPath(new PathOption(gauge.element.id + '_AxisOuterLine_' + index, background, 0, 'transparent', null, '0', getPathArc(gauge.midPoint, 0, 360, (Math.min(axis.rect.width, axis.rect.height) / 2)), '', 'pointer-events:none;'), element, gauge);
        }
    }
    /**
     * Method to render the axis line of the circular gauge.
     * @return {void}
     * @private
     */
    drawAxisLine(axis, index, element, gauge) {
        let startAngle = axis.startAngle;
        let endAngle = axis.endAngle;
        if (axis.lineStyle.width > 0) {
            startAngle = !isCompleteAngle(startAngle, endAngle) ? startAngle : [0, endAngle = 360][0];
            appendPath(new PathOption(gauge.element.id + '_AxisLine_' + index, 'transparent', axis.lineStyle.width, axis.lineStyle.color, null, axis.lineStyle.dashArray, getPathArc(gauge.midPoint, startAngle - 90, endAngle - 90, axis.currentRadius), '', 'pointer-events:none;'), element, gauge);
        }
    }
    /**
     * Method to render the axis labels of the circular gauge.
     * @return {void}
     * @private
     */
    drawAxisLabels(axis, index, element, gauge) {
        let labelElement = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_Labels_' + index
        });
        let min = axis.visibleRange.min;
        let max = axis.visibleRange.max;
        let labelCollection = axis.visibleLabels;
        let location;
        let style = axis.labelStyle;
        let anchor;
        let angle;
        let label;
        let radius = axis.currentRadius;
        let labelPadding = 10;
        if (style.position === 'Outside') {
            radius += (axis.nearSize - (axis.maxLabelSize.height + axis.lineStyle.width / 2)) +
                (labelPadding / 2);
        }
        else {
            radius -= (axis.farSize - (axis.maxLabelSize.height + axis.lineStyle.width / 2) +
                (style.autoAngle ? labelPadding : 0));
        }
        for (let i = 0, length = labelCollection.length; i < length; i++) {
            if ((i === 0 && style.hiddenLabel === 'First') ||
                (i === (length - 1) && style.hiddenLabel === 'Last')) {
                continue;
            }
            label = labelCollection[i];
            angle = Math.round(getAngleFromValue(label.value, max, min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise'));
            location = getLocationFromAngle(angle, radius, gauge.midPoint);
            anchor = this.findAnchor(location, style, angle, label);
            textElement(new TextOption(gauge.element.id + '_Axis_' + index + '_Label_' + i, location.x, location.y, anchor, label.text, style.autoAngle ? 'rotate(' + (angle + 90) + ',' + (location.x) + ',' + location.y + ')' : '', 'auto'), style.font, style.useRangeColor ? getRangeColor(label.value, axis.ranges, style.font.color) : style.font.color, labelElement, 'pointer-events:none;');
        }
        element.appendChild(labelElement);
    }
    /**
     * Method to find the anchor of the axis label.
     * @private
     */
    findAnchor(location, style, angle, label) {
        if (style.autoAngle) {
            return 'middle';
        }
        let anchor = style.position === 'Inside' ?
            ((angle > 120 && angle < 240) ? 'start' : ((300 < angle || angle < 60) ? 'end' : 'middle')) :
            ((angle > 120 && angle < 240) ? 'end' : ((300 < angle || angle < 60) ? 'start' : 'middle'));
        location.y += style.position === 'Inside' ?
            ((angle >= 240 && angle <= 300) ? (label.size.height / 2) :
                (angle >= 60 && angle <= 120) ? 0 : label.size.height / 4) :
            ((angle >= 240 && angle <= 300) ? 0 :
                (angle >= 60 && angle <= 120) ? label.size.height / 2 : label.size.height / 4);
        return anchor;
    }
    /**
     * Method to render the axis minor tick lines of the circular gauge.
     * @return {void}
     * @private
     */
    drawMinorTickLines(axis, index, element, gauge) {
        let minorTickElements = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_MinorTickLines_' + index
        });
        let minorLineStyle = axis.minorTicks;
        let minorInterval = minorLineStyle.interval !== null ?
            minorLineStyle.interval : (axis.visibleRange.interval / 2);
        let isRangeColor = minorLineStyle.useRangeColor;
        if (minorLineStyle.width && minorLineStyle.height && minorInterval) {
            for (let i = axis.visibleRange.min, max = axis.visibleRange.max; i <= max; i += minorInterval) {
                if (this.majorValues.indexOf(+i.toFixed(3)) < 0) {
                    appendPath(new PathOption(gauge.element.id + '_Axis_Minor_TickLine_' + index + '_' + i, 'transparent', minorLineStyle.width, isRangeColor ? getRangeColor(i, axis.ranges, minorLineStyle.color) : minorLineStyle.color, null, '0', this.calculateTicks(i, minorLineStyle, axis), '', 'pointer-events:none;'), minorTickElements, gauge);
                }
            }
            element.appendChild(minorTickElements);
        }
    }
    /**
     * Method to render the axis major tick lines of the circular gauge.
     * @return {void}
     * @private
     */
    drawMajorTickLines(axis, index, element, gauge) {
        let majorTickElements = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_MajorTickLines_' + index
        });
        let majorLineStyle = axis.majorTicks;
        let isRangeColor = majorLineStyle.useRangeColor;
        this.majorValues = [];
        if (majorLineStyle.width && majorLineStyle.height && axis.visibleRange.interval) {
            for (let i = axis.visibleRange.min, max = axis.visibleRange.max, interval = axis.visibleRange.interval; i <= max; i += interval) {
                this.majorValues.push(+i.toFixed(3));
                appendPath(new PathOption(gauge.element.id + '_Axis_Major_TickLine_' + index + '_' + i, 'transparent', majorLineStyle.width, isRangeColor ? getRangeColor(i, axis.ranges, majorLineStyle.color) : majorLineStyle.color, null, '0', this.calculateTicks(i, majorLineStyle, axis), '', 'pointer-events:none;'), majorTickElements, gauge);
            }
            element.appendChild(majorTickElements);
        }
    }
    /**
     * Method to calcualte the tick elements for the circular gauge.
     * @return {void}
     * @private
     */
    calculateTicks(value, options, axis) {
        let axisLineWidth = (axis.lineStyle.width / 2) + options.offset;
        let isOutside = options.position === 'Outside';
        let angle = getAngleFromValue(value, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise');
        let start = getLocationFromAngle(angle, axis.currentRadius +
            (isOutside ? axisLineWidth : -axisLineWidth), this.gauge.midPoint);
        let end = getLocationFromAngle(angle, axis.currentRadius +
            (isOutside ? axisLineWidth : -axisLineWidth) +
            (isOutside ? options.height : -options.height), this.gauge.midPoint);
        return 'M ' + start.x + ' ' + start.y + ' L ' + end.x + ' ' + end.y + ' ';
    }
    /**
     * Method to render the axis range of the circular gauge.
     * @return {void}
     * @private
     */
    drawAxisRange(axis, index, element, gauge) {
        let rangeElement = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_Ranges_' + index
        });
        let location = this.gauge.midPoint;
        let startAngle;
        let endAngle;
        let isClockWise = axis.direction === 'ClockWise';
        let startValue;
        let endValue;
        let min = axis.visibleRange.min;
        let max = axis.visibleRange.max;
        let startWidth;
        let endWidth;
        let roundedStartAngle;
        let roundedEndAngle;
        let oldStart;
        let oldEnd;
        axis.ranges.map((range, rangeIndex) => {
            this.calculateRangeRadius(axis, range);
            startValue = Math.min(Math.max(range.start, min), range.end);
            endValue = Math.min(Math.max(range.start, range.end), max);
            startAngle = getAngleFromValue(startValue, max, min, axis.startAngle, axis.endAngle, isClockWise);
            endAngle = getAngleFromValue(endValue, max, min, axis.startAngle, axis.endAngle, isClockWise);
            let isAngleCross360 = (startAngle > endAngle);
            if (axis.rangeGap != null && axis.rangeGap > 0) {
                startAngle = (rangeIndex === 0 && !axis.startAndEndRangeGap) ? startAngle : startAngle + (axis.rangeGap / Math.PI);
                endAngle = (rangeIndex === axis.ranges.length - 1 && !axis.startAndEndRangeGap) ? endAngle : endAngle -
                    (axis.rangeGap / Math.PI);
            }
            if ((startValue !== endValue) && (isAngleCross360 ? startAngle < (endAngle + 360) : (startAngle < endAngle))) {
                if (range.startWidth.length > 0) {
                    startWidth = toPixel(range.startWidth, range.currentRadius);
                }
                else {
                    startWidth = range.startWidth;
                }
                if (range.endWidth.length > 0) {
                    endWidth = toPixel(range.endWidth, range.currentRadius);
                }
                else {
                    endWidth = range.endWidth;
                }
                endAngle = isClockWise ? endAngle : [startAngle, startAngle = endAngle][0];
                endWidth = isClockWise ? endWidth : [startWidth, startWidth = endWidth][0];
                let radius = range.roundedCornerRadius;
                let process = (radius * 0.25);
                oldStart = ((((range.currentRadius - (startWidth / 2)) * ((startAngle * Math.PI) / 180) -
                    (radius / process)) / (range.currentRadius - (startWidth / 2))) * 180) / Math.PI;
                oldEnd = ((((range.currentRadius - (endWidth / 2)) * ((endAngle * Math.PI) / 180) +
                    (radius / process)) / (range.currentRadius - (endWidth / 2))) * 180) / Math.PI;
                roundedStartAngle = ((((range.currentRadius) * ((startAngle * Math.PI) / 180) +
                    radius) / (range.currentRadius)) * 180) / Math.PI;
                roundedEndAngle = ((((range.currentRadius) * ((endAngle * Math.PI) / 180) -
                    radius) / (range.currentRadius)) * 180) / Math.PI;
                if (range.roundedCornerRadius) {
                    appendPath(new PathOption(gauge.element.id + '_Axis_' + index + '_Range_' + rangeIndex, range.rangeColor, 0, range.rangeColor, range.opacity, '0', getRoundedPathArc(location, Math.floor(roundedStartAngle), Math.ceil(roundedEndAngle), oldStart, oldEnd, range.currentRadius, startWidth, endWidth), '', 'pointer-events:none;'), rangeElement, gauge);
                }
                else {
                    appendPath(new PathOption(gauge.element.id + '_Axis_' + index + '_Range_' + rangeIndex, range.rangeColor, 0, range.rangeColor, range.opacity, '0', getPathArc(gauge.midPoint, Math.floor(startAngle), Math.ceil(endAngle), range.currentRadius, startWidth, endWidth), '', 'pointer-events:none;'), rangeElement, gauge);
                }
            }
        });
        element.appendChild(rangeElement);
    }
    /**
     * Method to calculate the radius of the axis range.
     * @return {void}
     */
    calculateRangeRadius(axis, range) {
        let radius = range.radius !== null ? range.radius : '100%';
        range.currentRadius = stringToNumber(radius, axis.currentRadius);
    }
    /**
     * Method to get the range color of the circular gauge.
     * @return {void}
     * @private
     */
    setRangeColor(axis) {
        let rangeColors = getRangePalette(this.gauge.theme);
        axis.ranges.map((range, index) => {
            range.rangeColor = range.color ? range.color : rangeColors[index % rangeColors.length];
        });
    }
}

/**
 * Specifies the Axis rendering for circular gauge
 */
class PointerRenderer {
    /**
     * Constructor for pointer renderer.
     * @private.
     */
    constructor(gauge) {
        this.gauge = gauge;
    }
    /**
     * Method to render the axis pointers of the circular gauge.
     * @return {void}
     * @private
     */
    drawPointers(axis, axisIndex, element, gauge, animate = true) {
        let pointerElement = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_Pointers_' + axisIndex
        });
        let childElement;
        let range;
        axis.pointers.map((pointer, pointerIndex) => {
            range = axis.visibleRange;
            pointer.pathElement = [];
            this.calculatePointerRadius(axis, pointer);
            childElement = gauge.renderer.createGroup({
                id: gauge.element.id + '_Axis_' + axisIndex + '_Pointer_' + pointerIndex
            });
            this['draw' + pointer.type + 'Pointer'](axis, axisIndex, pointerIndex, childElement, gauge);
            this.setPointerValue(axis, pointer, pointer.currentValue);
            pointerElement.appendChild(childElement);
            if (animate) {
                this.doPointerAnimation(pointer, axis);
            }
        });
        element.appendChild(pointerElement);
    }
    /**
     * Measure the pointer length of the circular gauge.
     * @return {void}
     */
    calculatePointerRadius(axis, pointer) {
        let padding = 5;
        pointer.currentRadius = pointer.radius === null ?
            (axis.currentRadius - (axis.farSize + padding)) :
            stringToNumber(pointer.radius, axis.currentRadius);
    }
    /**
     * Method to render the needle pointer of the ciruclar gauge.
     * @return {void}
     */
    drawNeedlePointer(axis, axisIndex, index, parentElement, gauge) {
        let pointer = axis.pointers[index];
        let pointerRadius;
        let location;
        let direction;
        let mid = gauge.midPoint;
        let width = pointer.pointerWidth / 2;
        let rectDirection;
        // To render the needle
        location = getLocationFromAngle(0, pointer.currentRadius, mid);
        direction = 'M ' + mid.x + ' ' + (mid.y - width) + ' L ' + (location.x) + ' ' + mid.y +
            ' L ' + (mid.x) + ' ' + (mid.y + width) + ' Z';
        pointer.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Needle_' + index, pointer.color, pointer.border.width, pointer.border.color, null, '0', direction), parentElement, gauge));
        pointerRadius = stringToNumber(pointer.needleTail.length, pointer.currentRadius);
        // To render the rect element for touch
        rectDirection = 'M ' + mid.x + ' ' + (mid.y - width) + ' L ' + (location.x) + ' ' + (mid.y - width) +
            ' L ' + location.x + ' ' + (mid.y + width) + ' L ' + mid.x + ' ' + (mid.y + width);
        // To render the needle tail
        if (pointerRadius) {
            location = getLocationFromAngle(180, pointerRadius, gauge.midPoint);
            direction = 'M ' + mid.x + ' ' + (mid.y - width) +
                ' L ' + (location.x) + ' ' + (mid.y - width) +
                ' L ' + (location.x) + ' ' + (mid.y + width) +
                ' L ' + (mid.x) + ' ' + (mid.y + width) + ' Z';
            pointer.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleTail_' + index, pointer.needleTail.color, pointer.needleTail.border.width, pointer.needleTail.border.color, null, '0', direction), parentElement, gauge));
            rectDirection += ' L ' + location.x + ' ' + (mid.y + width) + ' L ' + location.x + ' ' + (mid.y - width);
        }
        // To render the cap
        if (pointer.cap.radius) {
            pointer.pathElement.push(appendPath(calculateShapes(mid, 'Circle', new Size(pointer.cap.radius * 2, pointer.cap.radius * 2), '', new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleCap_' + index, pointer.cap.color, pointer.cap.border.width, pointer.cap.border.color, null, '0', '', '')), parentElement, gauge, 'Ellipse'));
        }
        pointer.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleRect_' + index, 'transparent', 0, 'transpanret', null, '0', rectDirection + ' Z'), parentElement, gauge));
    }
    /**
     * Method to set the pointer value of the circular gauge.
     * @return {void}
     * @private
     */
    setPointerValue(axis, pointer, value) {
        let location = this.gauge.midPoint;
        let isClockWise = axis.direction === 'ClockWise';
        let startAngle = getAngleFromValue(axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        let endAngle = getAngleFromValue(value, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        if (isClockWise) {
            endAngle = startAngle === endAngle ? endAngle + 1 : endAngle;
        }
        else {
            endAngle = startAngle === endAngle ? [startAngle, startAngle = endAngle - 1][0] : [startAngle, startAngle = endAngle][0];
        }
        let roundStartAngle;
        let roundEndAngle;
        let oldStartValue;
        let oldEndValue;
        let radius = pointer.roundedCornerRadius;
        let minRadius = (radius * 0.25);
        if (value <= minRadius) {
            radius = value === 1 || 2 ? 8 : radius;
            radius /= 2;
            minRadius = radius * 0.25;
        }
        oldStartValue = ((((pointer.currentRadius - (pointer.pointerWidth / 2)) * ((startAngle * Math.PI) / 180) -
            (radius / minRadius)) / (pointer.currentRadius - (pointer.pointerWidth / 2))) * 180) / Math.PI;
        oldEndValue = ((((pointer.currentRadius - (pointer.pointerWidth / 2)) * ((endAngle * Math.PI) / 180) +
            (radius / minRadius)) / (pointer.currentRadius - (pointer.pointerWidth / 2))) * 180) / Math.PI;
        roundStartAngle = ((((pointer.currentRadius) * ((startAngle * Math.PI) / 180) +
            radius) / (pointer.currentRadius)) * 180) / Math.PI;
        roundEndAngle = ((((pointer.currentRadius) * ((endAngle * Math.PI) / 180) -
            radius) / (pointer.currentRadius)) * 180) / Math.PI;
        if (isNullOrUndefined(pointer.currentRadius)) {
            this.calculatePointerRadius(axis, pointer);
        }
        pointer.pathElement.map((element) => {
            if (pointer.type === 'RangeBar') {
                if (pointer.roundedCornerRadius && value) {
                    element.setAttribute('d', getRoundedPathArc(location, Math.floor(roundStartAngle), Math.ceil(roundEndAngle), oldStartValue, oldEndValue, pointer.currentRadius, pointer.pointerWidth, pointer.pointerWidth));
                    radius = 0;
                }
                else {
                    element.setAttribute('d', getCompleteArc(location, startAngle, endAngle, pointer.currentRadius, (pointer.currentRadius - pointer.pointerWidth)));
                }
            }
            else {
                element.setAttribute('transform', 'rotate(' + getAngleFromValue(value, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise) + ',' + location.x + ',' + location.y + ')');
            }
            element.setAttribute('aria-label', pointer.description || 'Pointer:' + value.toString());
        });
    }
    /**
     * Method to render the marker pointer of the ciruclar gauge.
     * @return {void}
     */
    drawMarkerPointer(axis, axisIndex, index, parentElement, gauge) {
        let pointer = axis.pointers[index];
        let location = getLocationFromAngle(0, pointer.currentRadius, gauge.midPoint);
        pointer.pathElement.push(appendPath(calculateShapes(location, pointer.markerShape, new Size(pointer.markerWidth, pointer.markerHeight), pointer.imageUrl, new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Marker_' + index, pointer.color, pointer.border.width, pointer.border.color, null, '0', '', '')), parentElement, gauge, pointer.markerShape === 'Circle' ? 'Ellipse' : (pointer.markerShape === 'Image' ? 'Image' : 'Path')));
    }
    /**
     * Method to render the range bar pointer of the ciruclar gauge.
     * @return {void}
     */
    drawRangeBarPointer(axis, axisIndex, index, parentElement, gauge) {
        let pointer = axis.pointers[index];
        pointer.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_RangeBar_' + index, pointer.color, pointer.border.width, pointer.border.color, 1, '0', ''), parentElement, gauge));
    }
    /**
     * Method to perform the animation of the pointer in circular gauge.
     * @return {void}
     */
    doPointerAnimation(pointer, axis) {
        let startValue = axis.visibleRange.min;
        let endValue = pointer.currentValue;
        if (pointer.animation.enable && startValue !== endValue && this.gauge.animatePointer) {
            pointer.pathElement.map((element) => {
                if (pointer.type === 'RangeBar') {
                    this.performRangeBarAnimation(element, startValue, endValue, axis, pointer, pointer.currentRadius, (pointer.currentRadius - pointer.pointerWidth));
                }
                else {
                    this.performNeedleAnimation(element, startValue, endValue, axis, pointer, pointer.currentRadius, (pointer.currentRadius - pointer.pointerWidth));
                }
            });
        }
    }
    /**
     * Perform the needle and marker pointer animation for circular gauge.
     * @return {void}
     * @private
     */
    performNeedleAnimation(element, start, end, axis, pointer, radius, innerRadius) {
        let isClockWise = axis.direction === 'ClockWise';
        let startAngle = getAngleFromValue(start, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        let pointAngle = getAngleFromValue(end, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        let endAngle = startAngle > pointAngle ? (pointAngle + 360) : pointAngle;
        let sweepAngle;
        new Animation({}).animate(element, {
            duration: pointer.animation.duration,
            progress: (args) => {
                sweepAngle = (start < end || Math.round(startAngle) === Math.round(endAngle)) ?
                    isClockWise ? (endAngle - startAngle) : (endAngle - startAngle - 360) :
                    isClockWise ? (endAngle - startAngle - 360) : (endAngle - startAngle);
                element.style.animation = 'None';
                element.setAttribute('transform', 'rotate(' + linear(args.timeStamp, startAngle, sweepAngle, args.duration) + ',' +
                    this.gauge.midPoint.x.toString() + ',' + this.gauge.midPoint.y.toString() + ')');
            },
            end: (model) => {
                this.setPointerValue(axis, pointer, end);
                if (pointer.type === 'Marker' || (element.id.indexOf('_Pointer_NeedleCap') >= 0)) {
                    this.gauge.trigger(animationComplete, { axis: axis, pointer: pointer });
                }
            }
        });
    }
    /**
     * Perform the range bar pointer animation for circular gauge.
     * @return {void}
     * @private
     */
    performRangeBarAnimation(element, start, end, axis, pointer, radius, innerRadius) {
        let isClockWise = axis.direction === 'ClockWise';
        let startAngle = getAngleFromValue(start, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        let minAngle = getAngleFromValue(axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        let pointAngle = getAngleFromValue(end, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        let sweepAngle;
        let endAngle = startAngle > pointAngle ? (pointAngle + 360) : pointAngle;
        new Animation({}).animate(element, {
            duration: pointer.animation.duration,
            progress: (arg) => {
                element.style.animation = 'None';
                sweepAngle = (start < end || Math.round(startAngle) === Math.round(endAngle)) ?
                    isClockWise ? (endAngle - startAngle) : (endAngle - startAngle - 360) :
                    isClockWise ? (endAngle - startAngle - 360) : (endAngle - startAngle);
                if (isClockWise) {
                    element.setAttribute('d', getCompleteArc(this.gauge.midPoint, minAngle, linear(arg.timeStamp, startAngle, sweepAngle, arg.duration) + 0.0001, radius, innerRadius));
                }
                else {
                    element.setAttribute('d', getCompleteArc(this.gauge.midPoint, linear(arg.timeStamp, startAngle, sweepAngle, arg.duration), minAngle + 0.0001, radius, innerRadius));
                }
            },
            end: (model) => {
                this.setPointerValue(axis, pointer, end);
                this.gauge.trigger(animationComplete, { axis: axis, pointer: pointer });
            }
        });
    }
}

/**
 * Specifies the CircularGauge Axis Layout
 */
const labelPadding = 10;
class AxisLayoutPanel {
    constructor(gauge) {
        this.gauge = gauge;
        this.axisRenderer = new AxisRenderer(gauge);
        this.pointerRenderer = new PointerRenderer(gauge);
    }
    /**
     * Measure the calculate the axis size and radius.
     * @return {void}
     * @private
     */
    measureAxis(rect) {
        this.measureAxisSize(this.gauge, rect);
        this.calculateAxesRadius();
    }
    /**
     * Measure to calculate the axis radius of the circular gauge.
     * @return {void}
     * @private
     */
    calculateAxesRadius() {
        let totalRadius;
        let currentRadius;
        let rangeMaximumRadius = 0;
        let xMarginDiff = this.gauge.margin.left + this.gauge.margin.right;
        let yMarginDiff = this.gauge.margin.top + this.gauge.margin.bottom;
        for (let axis of this.gauge.axes) {
            totalRadius = (Math.min(axis.rect.width, axis.rect.height) / 2);
            currentRadius = axis.radius != null ? stringToNumber(axis.radius, totalRadius) : totalRadius;
            rangeMaximumRadius = Math.max.apply(Math, axis.ranges.map((value) => {
                return value.radius ?
                    (value.radius.indexOf('%') < 0 ? 100 : parseInt(value.radius, 10)) : 0;
            }));
            currentRadius = (rangeMaximumRadius > 100 && axis.radius == null) ?
                (currentRadius * 100) / rangeMaximumRadius : currentRadius;
            axis.currentRadius = currentRadius - axis.nearSize;
            if (this.gauge.moveToCenter && this.gauge.axes.length === 1 &&
                isNullOrUndefined(this.gauge.centerX) && isNullOrUndefined(this.gauge.centerY)) {
                let startAngle;
                let endAngle;
                startAngle = axis.startAngle;
                startAngle = !isCompleteAngle(startAngle, axis.endAngle) ? startAngle : [0, endAngle = 360][0];
                let startPoint = getLocationFromAngle(startAngle - 90, currentRadius, this.gauge.midPoint);
                endAngle = axis.endAngle;
                endAngle -= isCompleteAngle(startAngle, endAngle) ? 0.0001 : 0;
                let endPoint = getLocationFromAngle(endAngle - 90, currentRadius, this.gauge.midPoint);
                let xDiff;
                let yDiff;
                let startXDiff;
                let endXDiff;
                let startYDiff;
                let endYDiff;
                let newPoint;
                if (startAngle > endAngle ? Math.abs(startAngle - endAngle) > 90 ? true : false : true) {
                    if ((startAngle >= 270 && startAngle <= 360) && ((endAngle > 270 && endAngle <= 360) ||
                        (endAngle >= 0 && endAngle <= 180))) {
                        startXDiff = Math.abs(this.gauge.gaugeRect.x - Math.abs(startPoint.x - this.gauge.gaugeRect.x));
                        newPoint = (endAngle <= 360 && endAngle >= 270) ? this.gauge.midPoint : (endAngle <= 90) ? endPoint :
                            getLocationFromAngle(90 - 90, currentRadius, this.gauge.midPoint);
                        endXDiff = Math.abs(newPoint.x - this.gauge.gaugeRect.width);
                        startPoint = (endAngle <= 360 && endAngle >= 270) ? endPoint :
                            getLocationFromAngle(360 - 90, currentRadius, this.gauge.midPoint);
                        startYDiff = Math.abs(startPoint.y - this.gauge.gaugeRect.y);
                        endPoint = (endAngle <= 360 && endAngle >= 270 || (endAngle >= 0 && endAngle < 90)) ?
                            this.gauge.midPoint : (endAngle >= 90 && endAngle <= 180) ? endPoint :
                            getLocationFromAngle(180 - 90, currentRadius, this.gauge.midPoint);
                        endYDiff = Math.abs(endPoint.y - (this.gauge.gaugeRect.y + this.gauge.gaugeRect.height));
                    }
                    else if ((startAngle >= 0 && startAngle < 90) && (endAngle >= 0 && endAngle <= 270)) {
                        startYDiff = Math.abs(startPoint.y - this.gauge.gaugeRect.y);
                        newPoint = (endAngle >= 180) ? getLocationFromAngle(180 - 90, currentRadius, this.gauge.midPoint) :
                            endPoint;
                        endYDiff = Math.abs(newPoint.y - (this.gauge.gaugeRect.y + this.gauge.gaugeRect.height));
                        startPoint = (endAngle >= 180) ? endPoint : this.gauge.midPoint;
                        startXDiff = Math.abs(this.gauge.gaugeRect.x - Math.abs(startPoint.x - this.gauge.gaugeRect.x));
                        endPoint = (endAngle >= 90) ? getLocationFromAngle(90 - 90, currentRadius, this.gauge.midPoint) : endPoint;
                        endXDiff = Math.abs(endPoint.x - this.gauge.gaugeRect.width);
                    }
                    else if ((startAngle >= 90 && startAngle < 180) && (endAngle > 90 && endAngle <= 360)) {
                        newPoint = (endAngle <= 180) ? this.gauge.midPoint : (endAngle >= 270) ?
                            getLocationFromAngle(270 - 90, currentRadius, this.gauge.midPoint) : endPoint;
                        startXDiff = Math.abs(newPoint.x - this.gauge.gaugeRect.x);
                        endXDiff = Math.abs(startPoint.x - this.gauge.gaugeRect.width);
                        startPoint = (endAngle > 270) ? getLocationFromAngle(endAngle - 90, currentRadius, this.gauge.midPoint) :
                            this.gauge.midPoint;
                        startYDiff = Math.abs(this.gauge.gaugeRect.y - startPoint.y);
                        endPoint = (endAngle >= 180) ? getLocationFromAngle(180 - 90, currentRadius, this.gauge.midPoint) : endPoint;
                        endYDiff = Math.abs(endPoint.y - (this.gauge.gaugeRect.y + this.gauge.gaugeRect.height));
                    }
                    else if ((startAngle >= 180 && startAngle <= 270) && ((endAngle <= 360 && endAngle >= 270) ||
                        (endAngle <= 180 && endAngle >= 0))) {
                        newPoint = (endAngle > 180 && endAngle < 270) ? endPoint :
                            getLocationFromAngle(270 - 90, currentRadius, this.gauge.midPoint);
                        startXDiff = Math.abs(this.gauge.gaugeRect.x - Math.abs(newPoint.x - this.gauge.gaugeRect.x));
                        newPoint = (endAngle >= 180 && endAngle <= 360) ? this.gauge.midPoint : endPoint;
                        endXDiff = Math.abs(newPoint.x - this.gauge.gaugeRect.width);
                        newPoint = (endAngle > 180 && endAngle < 270) ? this.gauge.midPoint : (endAngle >= 270 && endAngle <= 360) ?
                            endPoint : getLocationFromAngle(360 - 90, currentRadius, this.gauge.midPoint);
                        startYDiff = Math.abs(newPoint.y - this.gauge.gaugeRect.y);
                        endYDiff = Math.abs(startPoint.y - (this.gauge.gaugeRect.y + this.gauge.gaugeRect.height));
                    }
                    if ((!isNullOrUndefined(startXDiff) && !isNullOrUndefined(endXDiff) && !isNullOrUndefined(startYDiff) &&
                        !isNullOrUndefined(endYDiff)) && ((startXDiff > 0 || endXDiff > 0) && (startYDiff > 0 || endYDiff > 0))) {
                        xDiff = Math.abs((startXDiff + endXDiff) - xMarginDiff);
                        yDiff = Math.abs((startYDiff + endYDiff) - yMarginDiff);
                        this.gauge.midPoint.x = this.gauge.midPoint.x - (startXDiff / 2) + (endXDiff / 2);
                        this.gauge.midPoint.y = this.gauge.midPoint.y - (startYDiff / 2) + (endYDiff / 2);
                        totalRadius = (Math.min(this.gauge.gaugeRect.width, this.gauge.gaugeRect.height) / 2) +
                            (Math.min(xDiff, yDiff) / 2);
                        axis.currentRadius = (axis.radius != null ? stringToNumber(axis.radius, totalRadius) : totalRadius) - axis.nearSize;
                    }
                }
            }
            axis.visibleRange.interval = this.calculateNumericInterval(axis, axis.rect);
            let args;
            args = {
                cancel: false, name: radiusCalculate, currentRadius: axis.currentRadius, gauge: this.gauge,
                midPoint: this.gauge.midPoint, axis: axis
            };
            this.gauge.trigger(radiusCalculate, args);
            axis.currentRadius = args.currentRadius;
            this.gauge.midPoint = args.midPoint;
            this.calculateVisibleLabels(axis);
        }
    }
    /**
     * Measure to calculate the axis size.
     * @return {void}
     * @private
     */
    measureAxisSize(gauge, rect) {
        let sum;
        this.computeSize(gauge.axes, rect);
        gauge.axes.map((axis, index) => {
            sum = calculateSum(index, this.farSizes.length - 1, this.farSizes);
            axis.rect = new Rect(rect.x + sum, rect.y + sum, rect.width - (sum * 2), rect.height - (sum * 2));
        });
    }
    /**
     * Calculate the axis values of the circular gauge.
     * @return {void}
     * @private
     */
    calculateAxisValues(rect) {
        for (let axis of this.gauge.axes) {
            this.calculateVisibleRange(axis, rect);
            this.calculateVisibleLabels(axis);
        }
    }
    /**
     * Calculate the visible range of an axis.
     * @return {void}
     * @private
     */
    calculateVisibleRange(axis, rect) {
        let interval = axis.majorTicks.interval;
        let minimumValue = Math.min(axis.minimum === null ? 0 : axis.minimum, axis.maximum);
        let maximumValue = Math.max(axis.minimum, axis.maximum === null ? 100 : axis.maximum);
        axis.pointers.map((pointer) => {
            pointer.currentValue = pointer.value !== null ?
                pointer.value < minimumValue ? minimumValue : pointer.value > maximumValue ? maximumValue : pointer.value
                : minimumValue;
            minimumValue = axis.minimum === null ? Math.min(pointer.currentValue, minimumValue) : minimumValue;
            maximumValue = axis.maximum === null ? Math.max(pointer.currentValue, maximumValue) : maximumValue;
        });
        minimumValue = (minimumValue === maximumValue) ?
            (interval !== null ? minimumValue - interval : minimumValue - 1) : minimumValue;
        axis.visibleRange = { min: minimumValue, max: maximumValue, interval: interval };
        axis.visibleRange.interval = this.calculateNumericInterval(axis, rect);
    }
    /**
     * Calculate the numeric intervals of an axis range.
     * @return {void}
     * @private
     */
    calculateNumericInterval(axis, rect) {
        if (axis.majorTicks.interval !== null) {
            return axis.majorTicks.interval;
        }
        let totalAngle = axis.endAngle - axis.startAngle;
        totalAngle = totalAngle <= 0 ? (totalAngle + 360) : totalAngle;
        return this.calculateNiceInterval(axis.visibleRange.max, axis.visibleRange.min, axis.currentRadius ? axis.currentRadius : (rect.width / 2), totalAngle);
    }
    /**
     * Calculate the nice interval of an axis range.
     * @return {void}
     * @private
     */
    calculateNiceInterval(maxValue, minValue, radius, degree) {
        let delta = maxValue - minValue;
        let circumference = 2 * Math.PI * radius * (degree / 360);
        let desiredIntervalsCount = Math.max((circumference * ((0.533 * 3) / 100)), 1);
        let niceInterval = delta / desiredIntervalsCount;
        let minInterval = Math.pow(10, Math.floor(Math.log(niceInterval) / Math.log(10)));
        for (let interval of [10, 5, 2, 1]) {
            let currentInterval = minInterval * interval;
            if (desiredIntervalsCount < (delta / currentInterval)) {
                break;
            }
            niceInterval = currentInterval;
        }
        return niceInterval;
    }
    /**
     * Calculate the visible labels of an axis.
     * @return {void}
     * @private
     */
    calculateVisibleLabels(axis) {
        let style = axis.labelStyle;
        let customLabelFormat = style.format && style.format.match('{value}') !== null;
        let format = this.gauge.intl.getNumberFormat({
            format: getLabelFormat(style.format), useGrouping: this.gauge.useGroupingSeparator
        });
        let argsData;
        axis.visibleLabels = [];
        let roundValue;
        let roundingPlaces = ((axis.visibleRange.interval + '').indexOf('.') > -1) ?
            ((axis.visibleRange.interval + '').split('.')[1]).length : 0;
        for (let i = axis.visibleRange.min, interval = axis.visibleRange.interval, max = axis.visibleRange.max; (i <= max && interval); i += interval) {
            roundValue = axis.roundingPlaces ? parseFloat(i.toFixed(axis.roundingPlaces)) : parseFloat(i.toFixed(roundingPlaces));
            argsData = {
                cancel: false, name: axisLabelRender, axis: axis,
                text: customLabelFormat ? style.format.replace(new RegExp('{value}', 'g'), format(roundValue)) :
                    format(roundValue),
                value: roundValue
            };
            this.gauge.trigger(axisLabelRender, argsData);
            if (!argsData.cancel) {
                axis.visibleLabels.push(new VisibleLabels(argsData.text, i));
            }
        }
        let lastLabel = axis.visibleLabels[axis.visibleLabels.length - 1].value;
        let maxVal = axis.visibleRange.max;
        if (lastLabel !== maxVal && axis.showLastLabel === true) {
            argsData = {
                cancel: false, name: axisLabelRender, axis: axis,
                text: customLabelFormat ? style.format.replace(new RegExp('{value}', 'g'), format(maxVal)) :
                    format(maxVal),
                value: maxVal
            };
            this.gauge.trigger(axisLabelRender, argsData);
            if (!argsData.cancel) {
                axis.visibleLabels.push(new VisibleLabels(argsData.text, maxVal));
            }
        }
        this.getMaxLabelWidth(this.gauge, axis);
    }
    /**
     * Measure the axes available size.
     * @return {void}
     * @private
     */
    computeSize(axes, rect) {
        let lineSize;
        let outerHeight;
        let innerHeight;
        let isMajorTickOutside;
        let isMinorTickOutside;
        let isLabelOutside;
        let axisPadding = 5;
        let majorTickOffset = 0;
        let minorTickOffset = 0;
        let labelOffset = 0;
        this.farSizes = [];
        this.calculateAxisValues(rect);
        for (let axis of axes) {
            lineSize = (axis.lineStyle.width / 2);
            outerHeight = 0;
            innerHeight = 0;
            isMajorTickOutside = axis.majorTicks.position === 'Outside';
            majorTickOffset = axis.majorTicks.offset;
            isMinorTickOutside = axis.minorTicks.position === 'Outside';
            minorTickOffset = axis.minorTicks.offset;
            isLabelOutside = axis.labelStyle.position === 'Outside';
            labelOffset = axis.labelStyle.offset;
            // Calculating the outer space of the axis
            outerHeight += !(isMajorTickOutside && isMinorTickOutside && isLabelOutside) ? axisPadding : 0;
            outerHeight += (isMajorTickOutside ? (axis.majorTicks.height + lineSize) : 0) +
                (isLabelOutside ? (axis.maxLabelSize.height + labelPadding + labelOffset) : 0) +
                ((isMinorTickOutside && !isMajorTickOutside) ? (axis.minorTicks.height + lineSize) : 0) + lineSize;
            outerHeight += (isMajorTickOutside && isMinorTickOutside) ? Math.max(majorTickOffset, minorTickOffset) :
                (isMajorTickOutside ? majorTickOffset : isMinorTickOutside ? minorTickOffset : 0);
            // Calculating the inner space of the axis
            innerHeight += (!isMajorTickOutside ? (axis.majorTicks.height + lineSize) : 0) +
                (!isLabelOutside ? (axis.maxLabelSize.height + labelPadding + labelOffset) : 0) +
                ((!isMinorTickOutside && isMajorTickOutside) ? (axis.minorTicks.height + lineSize) : 0) + lineSize;
            innerHeight += (!isMajorTickOutside && !isMinorTickOutside) ? Math.max(majorTickOffset, minorTickOffset) :
                (!isMajorTickOutside ? majorTickOffset : !isMinorTickOutside ? minorTickOffset : 0);
            if (this.farSizes[this.farSizes.length - 1]) {
                this.farSizes[this.farSizes.length - 1] += (innerHeight + outerHeight);
            }
            axis.nearSize = outerHeight - axisPadding;
            axis.farSize = innerHeight;
            outerHeight = (this.gauge.axes.length === (this.farSizes.length + 1)) ? 0 : outerHeight;
            this.farSizes.push(outerHeight);
        }
    }
    /**
     * To render the Axis element of the circular gauge.
     * @return {void}
     * @private
     */
    renderAxes(animate = true) {
        let gauge = this.gauge;
        let renderer = this.axisRenderer;
        let element;
        let axesElements = gauge.renderer.createGroup({
            'id': gauge.element.id + '_AxesCollection',
            'clip-path': 'url(#' + gauge.element.id + '_GaugeAreaClipRect_' + ')'
        });
        // To append the secondary element for annotation and tooltip
        gauge.element.appendChild(createElement('div', {
            id: gauge.element.id + '_Secondary_Element',
            styles: 'position: relative'
        }));
        gauge.axes.map((axis, index) => {
            element = gauge.renderer.createGroup({
                id: gauge.element.id + '_Axis_Group_' + index
            });
            renderer.drawAxisOuterLine(axis, index, element, gauge);
            renderer.drawAxisRange(axis, index, element, gauge);
            renderer.drawAxisLine(axis, index, element, gauge);
            renderer.drawMajorTickLines(axis, index, element, gauge);
            renderer.drawMinorTickLines(axis, index, element, gauge);
            renderer.drawAxisLabels(axis, index, element, gauge);
            this.pointerRenderer.drawPointers(axis, index, element, gauge, animate);
            if (gauge.annotationsModule) {
                gauge.annotationsModule.renderAnnotation(axis, index);
            }
            axesElements.appendChild(element);
        });
        // For append clip rect for axes
        gauge.svgObject.appendChild(gauge.renderer.drawClipPath({
            'id': gauge.element.id + '_GaugeAreaClipRect_',
            'x': 0, 'y': 0,
            'width': gauge.availableSize.width,
            'height': gauge.availableSize.height,
            'fill': 'transparent', 'stroke': 'transparent'
        }));
        gauge.svgObject.appendChild(axesElements);
    }
    /**
     * Calculate maximum label width for the axis.
     * @return {void}
     */
    getMaxLabelWidth(gauge, axis) {
        axis.maxLabelSize = new Size(0, 0);
        for (let label of axis.visibleLabels) {
            label.size = measureText(label.text, axis.labelStyle.font);
            axis.maxLabelSize.width = label.size.width > axis.maxLabelSize.width ?
                label.size.width : axis.maxLabelSize.width;
            axis.maxLabelSize.height = label.size.height > axis.maxLabelSize.height ?
                label.size.height : axis.maxLabelSize.height;
        }
    }
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Circular Gauge
 */
/**
 * Represents the Circular gauge control.
 * ```html
 * <div id="gauge"/>
 * <script>
 *   var gaugeObj = new CircularGauge();
 *   gaugeObj.appendTo("#gauge");
 * </script>
 * ```
 */
let CircularGauge = class CircularGauge extends Component {
    /**
     * Constructor for creating the widget
     * @hidden
     */
    constructor(options, element) {
        super(options, element);
    }
    /**
     *  To create svg object, renderer and binding events for the container.
     */
    preRender() {
        this.unWireEvents();
        this.trigger(load, { gauge: this });
        this.themeEffect();
        this.initPrivateVariable();
        this.setCulture();
        this.createSvg();
        this.wireEvents();
    }
    themeEffect() {
        let themes = this.theme.toLowerCase();
        if (themes === 'highcontrast') {
            this.titleStyle.color = this.titleStyle.color || '#FFFFFF';
            this.setThemeColors('#FFFFFF', '#FFFFFF');
        }
        else if (themes.indexOf('dark') > -1) {
            for (let axis of this.axes) {
                axis.labelStyle.font.color = axis.labelStyle.font.color || '#DADADA ';
                axis.majorTicks.color = axis.majorTicks.color || '#C8C8C8';
                axis.minorTicks.color = axis.minorTicks.color || '#9A9A9A';
                for (let pointer of axis.pointers) {
                    pointer.color = pointer.color || '#DADADA';
                    pointer.needleTail.color = pointer.needleTail.color || '#9A9A9A';
                    pointer.needleTail.border.color = pointer.needleTail.border.color || '#9A9A9A';
                    pointer.cap.color = pointer.cap.color || '#9A9A9A';
                    pointer.cap.border.color = pointer.cap.border.color || '#9A9A9A';
                }
            }
        }
        else {
            this.titleStyle.color = this.titleStyle.color || '#424242';
            this.setThemeColors('#212121', '#757575');
        }
    }
    setThemeColors(labelcolor, others) {
        for (let axis of this.axes) {
            axis.lineStyle.color = axis.lineStyle.color || others;
            axis.labelStyle.font.color = axis.labelStyle.font.color || labelcolor;
            axis.majorTicks.color = axis.majorTicks.color || others;
            axis.minorTicks.color = axis.minorTicks.color || others;
            for (let pointer of axis.pointers) {
                pointer.color = pointer.color || others;
                pointer.needleTail.color = pointer.needleTail.color || others;
                pointer.needleTail.border.color = pointer.needleTail.border.color || others;
                pointer.cap.color = pointer.cap.color || others;
                pointer.cap.border.color = pointer.cap.border.color || others;
            }
        }
    }
    /**
     * To render the circular gauge elements
     */
    render() {
        this.calculateBounds();
        this.renderElements();
    }
    /**
     * Method to unbind events for circular gauge
     */
    unWireEvents() {
        EventHandler.remove(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMove);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'contextmenu', this.gaugeRightClick);
        EventHandler.remove(this.element, (Browser.isPointer ? 'pointerleave' : 'mouseleave'), this.mouseLeave);
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.gaugeResize);
    }
    /**
     * Method to bind events for circular gauge
     */
    wireEvents() {
        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'contextmenu', this.gaugeRightClick, this);
        EventHandler.add(this.element, (Browser.isPointer ? 'pointerleave' : 'mouseleave'), this.mouseLeave, this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.gaugeResize.bind(this));
        /*! Apply the style for circular gauge */
        this.setGaugeStyle(this.element);
    }
    /**
     * Handles the mouse move.
     * @return {boolean}
     * @private
     */
    mouseMove(e) {
        let args = this.getMouseArgs(e, 'touchmove', gaugeMouseMove);
        this.trigger(gaugeMouseMove, args);
        let dragArgs;
        let tooltip = this.tooltipModule;
        if (!args.cancel) {
            if (this.enablePointerDrag && this.activePointer) {
                dragArgs = {
                    axis: this.activeAxis,
                    pointer: this.activePointer,
                    previousValue: this.activePointer.currentValue,
                    name: dragMove,
                    currentValue: null
                };
                this.pointerDrag(new GaugeLocation(args.x, args.y));
                dragArgs.currentValue = this.activePointer.currentValue;
                this.trigger(dragMove, dragArgs);
            }
        }
        this.notify(Browser.touchMoveEvent, e);
        return false;
    }
    /**
     * Handles the mouse leave.
     * @return {boolean}
     * @private
     */
    mouseLeave(e) {
        this.activeAxis = null;
        this.activePointer = null;
        this.svgObject.setAttribute('cursor', 'auto');
        let args = this.getMouseArgs(e, 'touchmove', gaugeMouseLeave);
        this.trigger(gaugeMouseLeave, args);
        return false;
    }
    /**
     * Handles the mouse right click.
     * @return {boolean}
     * @private
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
     * Handles the pointer draf while mouse move on gauge.
     * @private
     */
    pointerDrag(location) {
        let axis = this.activeAxis;
        let range = axis.visibleRange;
        let value = getValueFromAngle(getAngleFromLocation(this.midPoint, location), range.max, range.min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise');
        if (value >= range.min && value <= range.max) {
            this.activePointer.currentValue = value;
            this.activePointer.value = value;
            this.gaugeAxisLayoutPanel.pointerRenderer.setPointerValue(axis, this.activePointer, value);
        }
    }
    /**
     * Handles the mouse down on gauge.
     * @return {boolean}
     * @private
     */
    gaugeOnMouseDown(e) {
        let currentPointer;
        let args = this.getMouseArgs(e, 'touchstart', gaugeMouseDown);
        this.trigger(gaugeMouseDown, args);
        if (!args.cancel && args.target.id.indexOf('_Pointer_') >= 0 &&
            args.target.id.indexOf(this.element.id + '_Axis_') >= 0) {
            currentPointer = getPointer(args.target.id, this);
            this.activeAxis = this.axes[currentPointer.axisIndex];
            this.activePointer = this.activeAxis.pointers[currentPointer.pointerIndex];
            if (isNullOrUndefined(this.activePointer.pathElement)) {
                this.activePointer.pathElement = [e.target];
            }
            this.trigger(dragStart, {
                axis: this.activeAxis,
                name: dragStart,
                pointer: this.activePointer,
                currentValue: this.activePointer.currentValue
            });
            this.svgObject.setAttribute('cursor', 'pointer');
        }
        return false;
    }
    /**
     * Handles the mouse end.
     * @return {boolean}
     * @private
     */
    mouseEnd(e) {
        let args = this.getMouseArgs(e, 'touchend', gaugeMouseUp);
        let isTouch = e.pointerType === 'touch' || e.pointerType === '2' || e.type === 'touchend';
        let tooltip = this.tooltipModule;
        this.trigger(gaugeMouseUp, args);
        if (this.activeAxis && this.activePointer) {
            this.trigger(dragEnd, {
                name: dragEnd,
                axis: this.activeAxis,
                pointer: this.activePointer,
                currentValue: this.activePointer.currentValue
            });
            this.activeAxis = null;
            this.activePointer = null;
        }
        this.svgObject.setAttribute('cursor', 'auto');
        this.notify(Browser.touchEndEvent, e);
        return false;
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
            x: location.x, y: location.y,
            target: isTouch ? e.target : e.target
        };
    }
    /**
     * Handles the gauge resize.
     * @return {boolean}
     * @private
     */
    gaugeResize(e) {
        let args = {
            gauge: this,
            previousSize: new Size(this.availableSize.width, this.availableSize.height),
            name: resized,
            currentSize: new Size(0, 0)
        };
        this.animatePointer = false;
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        if (this.element.classList.contains('e-circulargauge')) {
            this.resizeTo = window.setTimeout(() => {
                this.createSvg();
                this.calculateBounds();
                this.renderElements();
                args.currentSize = this.availableSize;
                this.trigger(resized, args);
            }, 500);
        }
        return false;
    }
    /**
     * Applying styles for circular gauge elements
     */
    setGaugeStyle(element) {
        element.style.touchAction = this.enablePointerDrag ? 'none' : 'element';
        element.style.msTouchAction = this.enablePointerDrag ? 'none' : 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
    }
    /**
     * Method to set culture for gauge
     */
    setCulture() {
        this.intl = new Internationalization();
    }
    /**
     * Methods to create svg element for circular gauge.
     */
    createSvg() {
        this.removeSvg();
        this.calculateSvgSize();
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + '_svg',
            width: this.availableSize.width,
            height: this.availableSize.height
        });
    }
    /**
     * To Remove the SVG from circular gauge.
     * @return {boolean}
     * @private
     */
    removeSvg() {
        removeElement(this.element.id + '_Secondary_Element');
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
     * To initialize the circular gauge private variable.
     * @private
     */
    initPrivateVariable() {
        if (this.element.id === '') {
            let collection = document.getElementsByClassName('e-circulargauge').length;
            this.element.id = 'circulargauge_control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);
        this.gaugeAxisLayoutPanel = new AxisLayoutPanel(this);
        this.animatePointer = true;
    }
    /**
     * To calculate the size of the circular gauge element.
     */
    calculateSvgSize() {
        let containerWidth = this.element.offsetWidth;
        let containerHeight = this.element.offsetHeight;
        let width = stringToNumber(this.width, containerWidth) || containerWidth || 600;
        let height = stringToNumber(this.height, containerHeight) || containerHeight || 450;
        this.availableSize = new Size(width, height);
    }
    /**
     * Method to calculate the availble size for circular gauge.
     */
    calculateBounds() {
        let padding = 5;
        let rect;
        let margin = this.margin;
        let titleHeight = 0;
        if (this.title) {
            titleHeight = measureText(this.title, this.titleStyle).height + padding;
        }
        let top = margin.top + titleHeight + this.border.width;
        let left = margin.left + this.border.width;
        let width = this.availableSize.width - left - margin.right - this.border.width;
        let height = this.availableSize.height - top - this.border.width - margin.bottom;
        let radius = Math.min(width, height) / 2;
        if (this.moveToCenter && this.axes.length === 1 &&
            isNullOrUndefined(this.centerX) && isNullOrUndefined(this.centerY)) {
            rect = new Rect(left, top, width, height);
        }
        else {
            rect = new Rect((left + (width / 2) - radius), (top + (height / 2) - radius), radius * 2, radius * 2);
        }
        this.gaugeRect = rect;
        let centerX = this.centerX !== null ?
            stringToNumber(this.centerX, this.availableSize.width) : rect.x + (rect.width / 2);
        let centerY = this.centerY !== null ?
            stringToNumber(this.centerY, this.availableSize.height) : rect.y + (rect.height / 2);
        this.midPoint = new GaugeLocation(centerX, centerY);
        this.gaugeAxisLayoutPanel.measureAxis(rect);
    }
    /**
     * To render elements for circular gauge
     */
    renderElements(animate = true) {
        this.renderBorder();
        this.renderTitle();
        this.gaugeAxisLayoutPanel.renderAxes(animate);
        this.element.appendChild(this.svgObject);
        this.trigger(loaded, { gauge: this });
    }
    /**
     * Method to render the title for circular gauge.
     */
    renderTitle() {
        if (this.title) {
            let size = measureText(this.title, this.titleStyle);
            let options = new TextOption(this.element.id + '_CircularGaugeTitle', this.availableSize.width / 2, this.margin.top + 3 * (size.height / 4), 'middle', this.title);
            let element = textElement(options, this.titleStyle, this.titleStyle.color, this.svgObject, '');
            element.setAttribute('aria-label', this.description || this.title);
            element.setAttribute('tabindex', this.tabIndex.toString());
        }
    }
    /**
     * Method to render the border for circular gauge.
     */
    renderBorder() {
        let borderWidth = this.border.width;
        if (borderWidth > 0 || (this.background !== null && this.background !== 'transparent')) {
            this.svgObject.appendChild(this.renderer.drawRectangle(new RectOption(this.element.id + '_CircularGaugeBorder', this.background, this.border, null, new Rect(borderWidth / 2, borderWidth / 2, this.availableSize.width - borderWidth, this.availableSize.height - borderWidth))));
        }
    }
    /**
     * Method to set the pointer value dynamically for circular gauge.
     */
    setPointerValue(axisIndex, pointerIndex, value) {
        let axis = this.axes[axisIndex];
        let pointer = axis.pointers[pointerIndex];
        let pointerRadius = pointer.currentRadius;
        let enableAnimation = pointer.animation.enable;
        value = value < axis.visibleRange.min ? axis.visibleRange.min : value;
        value = value > axis.visibleRange.max ? axis.visibleRange.max : value;
        pointer.pathElement.map((element) => {
            if (pointer.type === 'RangeBar') {
                setStyles(element, pointer.color, pointer.border);
                if (enableAnimation) {
                    this.gaugeAxisLayoutPanel.pointerRenderer.performRangeBarAnimation(element, pointer.currentValue, value, axis, pointer, pointerRadius, (pointerRadius - pointer.pointerWidth));
                }
                else {
                    this.gaugeAxisLayoutPanel.pointerRenderer.setPointerValue(axis, pointer, value);
                }
            }
            else {
                if (element.id.indexOf('_Pointer_NeedleCap_') >= 0) {
                    setStyles(element, pointer.cap.color, pointer.cap.border);
                }
                else if (element.id.indexOf('_Pointer_NeedleTail_') >= 0) {
                    setStyles(element, pointer.needleTail.color, pointer.needleTail.border);
                }
                else if (element.id.indexOf('_Pointer_NeedleRect_') >= 0) {
                    setStyles(element, 'transparent', { color: 'transparent', width: 0 });
                }
                else {
                    setStyles(element, pointer.color, pointer.border);
                }
                if (enableAnimation) {
                    this.gaugeAxisLayoutPanel.pointerRenderer.performNeedleAnimation(element, pointer.currentValue, value, axis, pointer, pointerRadius, (pointerRadius - pointer.pointerWidth));
                }
                else {
                    this.gaugeAxisLayoutPanel.pointerRenderer.setPointerValue(axis, pointer, value);
                }
            }
        });
        pointer.currentValue = value;
        pointer.value = value;
    }
    /**
     * Method to set the annotation content dynamically for circular gauge.
     */
    setAnnotationValue(axisIndex, annotationIndex, content) {
        let isElementExist = getElement(this.element.id + '_Annotations_' + axisIndex) !== null;
        let element = getElement(this.element.id + '_Annotations_' + axisIndex) ||
            createElement('div', {
                id: this.element.id + '_Annotations_' + axisIndex
            });
        let annotation = this.axes[axisIndex].annotations[annotationIndex];
        if (content !== null) {
            removeElement(this.element.id + '_Axis_' + axisIndex + '_Annotation_' + annotationIndex);
            annotation.content = content;
            this.annotationsModule.createTemplate(element, annotationIndex, axisIndex);
            if (!isElementExist) {
                getElement(this.element.id + '_Secondary_Element').appendChild(element);
            }
        }
    }
    /**
     * Method to set the range values dynamically for circular gauge.
     */
    setRangeValue(axisIndex, rangeIndex, start, end) {
        let element = getElement(this.element.id + '_Axis_' + axisIndex + '_Range_' + rangeIndex);
        let axis = this.axes[axisIndex];
        let range = axis.ranges[rangeIndex];
        let axisRange = axis.visibleRange;
        let isClockWise = axis.direction === 'ClockWise';
        let startValue = Math.min(Math.max(start, axisRange.min), end);
        let endValue = Math.min(Math.max(start, end), axisRange.max);
        let startAngle = getAngleFromValue(startValue, axisRange.max, axisRange.min, axis.startAngle, axis.endAngle, isClockWise);
        let endAngle = getAngleFromValue(endValue, axisRange.max, axisRange.min, axis.startAngle, axis.endAngle, isClockWise);
        let startWidth;
        if (range.startWidth.length > 0) {
            startWidth = toPixel(range.startWidth, range.currentRadius);
        }
        else {
            startWidth = range.startWidth;
        }
        let endWidth;
        if (range.endWidth.length > 0) {
            endWidth = toPixel(range.endWidth, range.currentRadius);
        }
        else {
            endWidth = range.endWidth;
        }
        endAngle = isClockWise ? endAngle : [startAngle, startAngle = endAngle][0];
        endWidth = isClockWise ? endWidth : [startWidth, startWidth = endWidth][0];
        element.setAttribute('d', getPathArc(this.midPoint, Math.round(startAngle), Math.round(endAngle), range.currentRadius, startWidth, endWidth));
        setStyles(element, (range.color ? range.color : range.rangeColor), {
            color: (range.color ? range.color : range.rangeColor),
            width: 0
        });
    }
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}
     * @member of Circular-Gauge
     */
    destroy() {
        this.unWireEvents();
        this.removeSvg();
        super.destroy();
    }
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    requiredModules() {
        let modules = [];
        let annotationEnable = false;
        let axes = this.axes;
        axes.map((axis) => {
            axis.annotations.map((annotation) => {
                annotationEnable = annotationEnable || annotation.content !== null;
            });
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
        return this.addOnPersist([]);
    }
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        // property method calculated
        let renderer = false;
        let refreshBounds = false;
        let refreshWithoutAnimation = false;
        let isPointerValueSame = (Object.keys(newProp).length === 1 && newProp instanceof Object &&
            !isNullOrUndefined(this.activePointer));
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'height':
                case 'width':
                case 'centerX':
                case 'centerY':
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
                case 'axes':
                    refreshWithoutAnimation = true;
                    break;
            }
        }
        if (!isPointerValueSame) {
            if (!refreshBounds && renderer) {
                this.removeSvg();
                this.renderElements();
            }
            if (refreshBounds) {
                this.removeSvg();
                this.calculateBounds();
                this.renderElements();
            }
            if (refreshWithoutAnimation && !renderer && !refreshBounds) {
                this.removeSvg();
                this.calculateBounds();
                this.renderElements(false);
            }
        }
    }
    /**
     * Get component name for circular gauge
     * @private
     */
    getModuleName() {
        return 'circulargauge';
    }
};
__decorate([
    Property(null)
], CircularGauge.prototype, "width", void 0);
__decorate([
    Property(null)
], CircularGauge.prototype, "height", void 0);
__decorate([
    Complex({ color: 'transparent', width: 0 }, Border)
], CircularGauge.prototype, "border", void 0);
__decorate([
    Property('transparent')
], CircularGauge.prototype, "background", void 0);
__decorate([
    Property('')
], CircularGauge.prototype, "title", void 0);
__decorate([
    Complex({ size: '15px', color: null }, Font)
], CircularGauge.prototype, "titleStyle", void 0);
__decorate([
    Complex({}, Margin)
], CircularGauge.prototype, "margin", void 0);
__decorate([
    Collection([{}], Axis)
], CircularGauge.prototype, "axes", void 0);
__decorate([
    Complex({}, TooltipSettings)
], CircularGauge.prototype, "tooltip", void 0);
__decorate([
    Property(false)
], CircularGauge.prototype, "enablePointerDrag", void 0);
__decorate([
    Property(null)
], CircularGauge.prototype, "centerX", void 0);
__decorate([
    Property(null)
], CircularGauge.prototype, "centerY", void 0);
__decorate([
    Property(false)
], CircularGauge.prototype, "moveToCenter", void 0);
__decorate([
    Property('Material')
], CircularGauge.prototype, "theme", void 0);
__decorate([
    Property(false)
], CircularGauge.prototype, "useGroupingSeparator", void 0);
__decorate([
    Property(null)
], CircularGauge.prototype, "description", void 0);
__decorate([
    Property(1)
], CircularGauge.prototype, "tabIndex", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "loaded", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "load", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "animationComplete", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "axisLabelRender", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "radiusCalculate", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "annotationRender", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "tooltipRender", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "dragStart", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "dragMove", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "dragEnd", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "gaugeMouseMove", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "gaugeMouseLeave", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "gaugeMouseDown", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "gaugeMouseUp", void 0);
__decorate([
    Event()
], CircularGauge.prototype, "resized", void 0);
CircularGauge = __decorate([
    NotifyPropertyChanges
], CircularGauge);

/**
 * Circular Gauge component exported items
 */

/**
 * Circular Gauge component exported.
 */

export { CircularGauge, Annotations, Line, Label, Range, Tick, Cap, NeedleTail, Animation$1 as Animation, Annotation, Pointer, Axis, Border, Font, Margin, TooltipSettings, GaugeTooltip, measureText, toPixel, getFontStyle, setStyles, measureElementRect, stringToNumber, textElement, appendPath, calculateSum, linear, getAngleFromValue, getDegree, getValueFromAngle, isCompleteAngle, getAngleFromLocation, getLocationFromAngle, getPathArc, getRangePath, getRoundedPathArc, getRoundedPath, getCompleteArc, getCirclePath, getCompletePath, getElement, getTemplateFunction, removeElement, getPointer, getElementSize, getMousePosition, getLabelFormat, calculateShapes, getRangeColor, CustomizeOption, PathOption, RectOption, Size, GaugeLocation, Rect, TextOption, VisibleLabels };
//# sourceMappingURL=ej2-circulargauge.es2015.js.map
