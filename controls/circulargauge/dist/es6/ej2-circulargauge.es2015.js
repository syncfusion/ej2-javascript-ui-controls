import { Animation, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, NotifyPropertyChanges, Property, compile, createElement, isBlazor, isNullOrUndefined, merge, print, remove, resetBlazorTemplate, setStyleAttribute, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { SvgRenderer, Tooltip } from '@syncfusion/ej2-svg-base';
import { PdfBitmap, PdfDocument, PdfPageOrientation } from '@syncfusion/ej2-pdf-export';

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
        ';left: 0px; top: -100px; white-space: nowrap;' + getFontStyle(font);
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
function getPathArc(center, start, end, radius, startWidth, endWidth, range, axis) {
    end -= isCompleteAngle(start, end) ? 0.0001 : 0;
    let degree = getDegree(start, end);
    let startRadius = !isNullOrUndefined(range) ? (range.position === 'Outside' ? radius + startWidth : range.position === 'Cross'
        && axis.direction === 'AntiClockWise' ? radius - (endWidth + startWidth) / 2 : radius - startWidth) : radius - startWidth;
    let endRadius = !isNullOrUndefined(range) ? (range.position === 'Outside' ? radius + endWidth : range.position === 'Cross' &&
        axis.direction === 'ClockWise' ? radius - (endWidth + startWidth) / 2 : radius - endWidth) : radius - endWidth;
    let arcRadius = !isNullOrUndefined(range) ? (range.position === 'Outside' ? radius + ((startWidth + endWidth) / 2) :
        range.position === 'Cross' ? (radius - ((startWidth + endWidth) / 4) - (axis.direction === 'ClockWise' ? startWidth : endWidth)
            / 2) : radius - ((startWidth + endWidth) / 2)) : radius - ((startWidth + endWidth) / 2);
    let insideArcRadius = !isNullOrUndefined(range) && range.position === 'Cross' ?
        radius + ((startWidth + endWidth) / 4) - (axis.direction === 'ClockWise' ? startWidth : endWidth) / 2 : radius;
    let insideEndRadius = !isNullOrUndefined(range) && range.position === 'Cross' && axis.direction === 'ClockWise' ?
        radius - ((startWidth - endWidth) / 2) : radius;
    let insideStartRadius = !isNullOrUndefined(range) && range.position === 'Cross' && axis.direction === 'AntiClockWise' ?
        radius + ((startWidth - endWidth) / 2) : radius;
    if (startWidth !== undefined && endWidth !== undefined) {
        endRadius = start === Math.round(end) ? startRadius : endRadius;
        insideEndRadius = start === Math.round(end) && range.position === 'Cross' ? insideStartRadius : insideEndRadius;
        return getRangePath(getLocationFromAngle(start, insideStartRadius, center), getLocationFromAngle(end, insideEndRadius, center), getLocationFromAngle(start, startRadius, center), getLocationFromAngle(end, endRadius, center), insideArcRadius, arcRadius, arcRadius, (degree < 180) ? 0 : 1);
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
function getCompleteArc(center, start, end, radius, innerRadius, checkMinValue) {
    end -= isCompleteAngle(start, end) && !checkMinValue ? 0.0001 : 0;
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
function getTemplateFunction(template, gauge) {
    let templateFn = null;
    try {
        if (gauge.isBlazor) {
            let numb = template.match(/\d+/g).toString();
            template = numb ? template.replace(numb, '') : template;
            template = template.indexOf('/') !== -1 ? template.replace('/', '') : template;
        }
        if (document.querySelectorAll(template).length) {
            if ((template.charAt(0) !== 'a' || template.charAt(0) !== 'A') && template.length !== 1) {
                templateFn = compile(document.querySelector(template).innerHTML.trim());
            }
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
/**
 * Function to get current point for circular gauge using element id.
 * @returns IVisibleRange
 * @private
 */
function getRange(targetId, gauge) {
    let tempString;
    tempString = targetId.replace(gauge.element.id, '').split('_Axis_')[1];
    return {
        axisIndex: +tempString[0],
        rangeIndex: +tempString[tempString.length - 1]
    };
}
function getElementSize(template, gauge, parent) {
    let elementSize;
    let element;
    let templateFn = getTemplateFunction(template, gauge);
    let tooltipData = templateFn ? templateFn({}, null, null, gauge.element.id + 'Template') : [];
    if (templateFn && tooltipData.length) {
        element = gauge.createElement('div', { id: gauge.element.id + '_Measure_Element' });
        gauge.element.appendChild(element);
        let templateElement = templateFn({}, null, null, gauge.element.id + 'Template');
        let templateLength = templateElement.length;
        while (templateLength > 0) {
            element.appendChild(templateElement[0]);
            templateLength--;
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
 * Function to convert the label using format for cirular gauge.
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
    let isLegend = options.id.indexOf('Shape') > -1;
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
            if (isLegend) {
                path = 'M' + ' ' + (x + (width / 2)) + ' ' + y + ' ' + 'L' + ' ' + (x + width) + ' ' +
                    (y + height) + 'L' + ' ' + x + ' ' + (y + height) + ' Z';
            }
            else {
                path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + ' ' + (locX - height) + ' ' + (locY - (width / 2)) +
                    'L' + ' ' + (locX - height) + ' ' + (locY + (width / 2)) + ' Z';
            }
            merge(options, { 'd': path });
            break;
        case 'InvertedTriangle':
            if (isLegend) {
                path = 'M' + ' ' + (x + width) + ' ' + y + ' ' + 'L' + ' ' + (x + (width / 2)) + ' ' + (y + height) +
                    'L' + ' ' + x + ' ' + (y) + ' Z';
            }
            else {
                path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                    'L' + ' ' + (locX + height) + ' ' + (locY - (width / 2)) +
                    'L' + ' ' + (locX + height) + ' ' + (locY + (width / 2)) + ' Z';
            }
            merge(options, { 'd': path });
            break;
        case 'Image':
            merge(options, { 'href': url, 'height': height, 'width': width, x: x, y: y });
            break;
        case 'RightArrow':
            let space = 2;
            path = 'M' + ' ' + (locX + (-width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY) + ' ' + 'L' + ' ' +
                (locX + (-width / 2)) + ' ' + (locY + (height / 2)) + ' L' + ' ' + (locX + (-width / 2)) + ' ' +
                (locY + (height / 2) - space) + ' ' + 'L' + ' ' + (locX + (width / 2) - (2 * space)) + ' ' + (locY) +
                ' L' + (locX + (-width / 2)) + ' ' + (locY - (height / 2) + space) + ' Z';
            merge(options, { 'd': path });
            break;
        case 'LeftArrow':
            options.fill = options.stroke;
            options.stroke = 'transparent';
            space = 2;
            path = 'M' + ' ' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                'L' + ' ' + (locX + (-width / 2)) + ' ' + (locY) + ' ' + 'L' + ' ' +
                (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' +
                (locX + (width / 2)) + ' ' + (locY + (height / 2) - space) + ' L' + ' ' + (locX + (-width / 2) + (2 * space))
                + ' ' + (locY) + ' L' + (locX + (width / 2)) + ' ' + (locY - (height / 2) + space) + ' Z';
            merge(options, { 'd': path });
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
/**
 * Internal use of circular gauge location
 */
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
function textTrim(maxWidth, text, font) {
    let label = text;
    let size = measureText(text, font).width;
    if (size > maxWidth) {
        let textLength = text.length;
        for (let i = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i) + '...';
            size = measureText(label, font).width;
            if (size <= maxWidth) {
                return label;
            }
        }
    }
    return label;
}
/** @private */
function showTooltip(text, x, y, areaWidth, id, element) {
    //let id1: string = 'EJ2_legend_tooltip';
    let tooltip = document.getElementById(id);
    let width = measureText(text, {
        fontFamily: 'Segoe UI', size: '12px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    }).width + 5;
    x = (x + width > areaWidth) ? x - width : x;
    if (!tooltip) {
        tooltip = createElement('div', {
            innerHTML: text,
            id: id,
            styles: 'top:' + (y + 15).toString() + 'px;left:' + (x + 15).toString() +
                'px;background-color: rgb(255, 255, 255) !important; color:black !important; ' +
                'position:absolute;border:1px solid rgb(112, 112, 112); padding-left : 3px; padding-right : 2px;' +
                'padding-bottom : 2px; padding-top : 2px; font-size:12px; font-family: "Segoe UI"'
        });
        element.appendChild(tooltip);
    }
    else {
        tooltip.innerHTML = text;
        tooltip.style.top = (y + 15).toString() + 'px';
        tooltip.style.left = (x + 15).toString() + 'px';
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
/**
 * To trigger the download element
 * @param fileName
 * @param type
 * @param url
 */
function triggerDownload(fileName, type, url, isDownload) {
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

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Sets and gets the options to customize the color and width of the borders in circular gauge.
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
 * Sets and gets the font style for the circular gauge.
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
 * Sets and gets the options to customize the tooltip properties for range tooltip.
 */
class RangeTooltip extends ChildProperty {
}
__decorate$1([
    Property(null)
], RangeTooltip.prototype, "fill", void 0);
__decorate$1([
    Complex({ size: '13px' }, Font)
], RangeTooltip.prototype, "textStyle", void 0);
__decorate$1([
    Property(null)
], RangeTooltip.prototype, "format", void 0);
__decorate$1([
    Property(null)
], RangeTooltip.prototype, "template", void 0);
__decorate$1([
    Property(true)
], RangeTooltip.prototype, "enableAnimation", void 0);
__decorate$1([
    Complex({}, Border)
], RangeTooltip.prototype, "border", void 0);
__decorate$1([
    Property(false)
], RangeTooltip.prototype, "showAtMousePosition", void 0);
/**
 * Sets and gets the options to customize the tooltip for annotation in circular gauge.
 */
class AnnotationTooltip extends ChildProperty {
}
__decorate$1([
    Property(null)
], AnnotationTooltip.prototype, "fill", void 0);
__decorate$1([
    Complex({ size: '13px' }, Font)
], AnnotationTooltip.prototype, "textStyle", void 0);
__decorate$1([
    Property(null)
], AnnotationTooltip.prototype, "format", void 0);
__decorate$1([
    Property(null)
], AnnotationTooltip.prototype, "template", void 0);
__decorate$1([
    Property(true)
], AnnotationTooltip.prototype, "enableAnimation", void 0);
__decorate$1([
    Complex({}, Border)
], AnnotationTooltip.prototype, "border", void 0);
/**
 * Sets and gets the margin of circular gauge.
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
 * Sets and gets the options to customize the tooltip of the circular gauge.
 */
class TooltipSettings extends ChildProperty {
}
__decorate$1([
    Property(false)
], TooltipSettings.prototype, "enable", void 0);
__decorate$1([
    Property(null)
], TooltipSettings.prototype, "fill", void 0);
__decorate$1([
    Complex({ size: '13px' }, Font)
], TooltipSettings.prototype, "textStyle", void 0);
__decorate$1([
    Complex({}, RangeTooltip)
], TooltipSettings.prototype, "rangeSettings", void 0);
__decorate$1([
    Complex({}, AnnotationTooltip)
], TooltipSettings.prototype, "annotationSettings", void 0);
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
__decorate$1([
    Property('Pointer')
], TooltipSettings.prototype, "type", void 0);

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
    Theme.legendLabelFont = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
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
                pointerColor: '#9A9A9A',
                capColor: '#9A9A9A',
                needleColor: '#9A9A9A',
                needleTailColor: '#9A9A9A'
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
                pointerColor: '#FFFFFF',
                capColor: '#FFFFFF',
                needleColor: '#FFFFFF',
                needleTailColor: '#FFFFFF'
            };
            break;
        case 'bootstrap4':
            style = {
                backgroundColor: '#FFFFFF',
                titleFontColor: '#212529',
                tooltipFillColor: '#000000',
                tooltipFontColor: '#FFFFFF',
                labelColor: '#212529',
                lineColor: '#DEE2E6',
                majorTickColor: '#ADB5BD',
                minorTickColor: '#CED4DA',
                pointerColor: '#6C757D',
                capColor: '#6C757D',
                needleColor: '#6C757D',
                needleTailColor: '#6C757D',
                fontFamily: 'HelveticaNeue-Medium',
                fontSize: '16px',
                labelFontFamily: 'HelveticaNeue',
                tooltipFillOpacity: 1,
                tooltipTextOpacity: 0.9
            };
            break;
        default:
            style = {
                backgroundColor: '#FFFFFF',
                titleFontColor: '#424242',
                tooltipFillColor: '#363F4C',
                tooltipFontColor: '#ffffff',
                labelColor: '#212121',
                lineColor: '#E0E0E0',
                majorTickColor: '#9E9E9E',
                minorTickColor: '#9E9E9E',
                pointerColor: '#757575',
                capColor: '#757575',
                needleColor: '#757575',
                needleTailColor: '#757575'
            };
            break;
    }
    return style;
}

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Sets and gets the axis line in circular gauge component.
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
    Property(null)
], Line.prototype, "color", void 0);
/**
 * Sets and gets the axis label in circular gauge component.
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
__decorate$2([
    Property(true)
], Label.prototype, "shouldMaintainPadding", void 0);
/**
 * Sets and gets the option to customize the ranges of an axis in circular gauge component.
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
__decorate$2([
    Property('')
], Range.prototype, "legendText", void 0);
__decorate$2([
    Property('Auto')
], Range.prototype, "position", void 0);
__decorate$2([
    Property(0)
], Range.prototype, "offset", void 0);
__decorate$2([
    Property(null)
], Range.prototype, "linearGradient", void 0);
__decorate$2([
    Property(null)
], Range.prototype, "radialGradient", void 0);
/**
 * Sets and gets the major and minor tick lines of an axis in circular gauge component.
 */
class Tick extends ChildProperty {
}
__decorate$2([
    Property(2)
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
    Property(null)
], Tick.prototype, "color", void 0);
__decorate$2([
    Property('Inside')
], Tick.prototype, "position", void 0);
__decorate$2([
    Property(false)
], Tick.prototype, "useRangeColor", void 0);
__decorate$2([
    Property('0')
], Tick.prototype, "dashArray", void 0);
/**
 * Sets and gets the needle cap of pointer in circular gauge component.
 */
class Cap extends ChildProperty {
}
__decorate$2([
    Property(null)
], Cap.prototype, "color", void 0);
__decorate$2([
    Property(null)
], Cap.prototype, "linearGradient", void 0);
__decorate$2([
    Property(null)
], Cap.prototype, "radialGradient", void 0);
__decorate$2([
    Complex({ color: null, width: 8 }, Border)
], Cap.prototype, "border", void 0);
__decorate$2([
    Property(8)
], Cap.prototype, "radius", void 0);
/**
 * Sets and gets the pointer needle in the circular gauge component.
 */
class NeedleTail extends ChildProperty {
}
__decorate$2([
    Property(null)
], NeedleTail.prototype, "color", void 0);
__decorate$2([
    Complex({ color: null, width: 0 }, Border)
], NeedleTail.prototype, "border", void 0);
__decorate$2([
    Property('0%')
], NeedleTail.prototype, "length", void 0);
__decorate$2([
    Property(null)
], NeedleTail.prototype, "linearGradient", void 0);
__decorate$2([
    Property(null)
], NeedleTail.prototype, "radialGradient", void 0);
/**
 * Sets and gets the animation of pointers in circular gauge component.
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
 * Sets and gets the annotation element for an axis in circular gauge component.
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
 * Sets and gets the pointers of an axis in circular gauge component.
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
    Property('Auto')
], Pointer.prototype, "position", void 0);
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
    Complex({}, Font)
], Pointer.prototype, "textStyle", void 0);
__decorate$2([
    Complex({}, NeedleTail)
], Pointer.prototype, "needleTail", void 0);
__decorate$2([
    Property(null)
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
    Property('')
], Pointer.prototype, "text", void 0);
__decorate$2([
    Property(null)
], Pointer.prototype, "description", void 0);
__decorate$2([
    Property(5)
], Pointer.prototype, "markerWidth", void 0);
__decorate$2([
    Property(0)
], Pointer.prototype, "offset", void 0);
__decorate$2([
    Property(null)
], Pointer.prototype, "needleStartWidth", void 0);
__decorate$2([
    Property(null)
], Pointer.prototype, "needleEndWidth", void 0);
__decorate$2([
    Property(null)
], Pointer.prototype, "linearGradient", void 0);
__decorate$2([
    Property(null)
], Pointer.prototype, "radialGradient", void 0);
/**
 * Sets and gets the options to customize the axis for the circular gauge component.
 */
class Axis extends ChildProperty {
    constructor() {
        /**
         * Sets and gets the minimum value of an axis in the circular gauge component.
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
    Property(false)
], Axis.prototype, "hideIntersectingLabel", void 0);
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
/**
 * Sets and gets loaded event name in the circular gauge component.
 *  @private
 */
const loaded = 'loaded';
/**
 * Sets and gets load event name in the circular gauge component.
 * @private
 */
const load = 'load';
/**
 * Sets and gets animation complete event name in the circular gauge component.
 * @private
 */
const animationComplete = 'animationComplete';
/**
 * Sets and gets axis label render event name in the circular gauge component.
 * @private
 */
const axisLabelRender = 'axisLabelRender';
/**
 * Sets and gets radius calculate event name in the circular gauge component.
 *  @private
 */
const radiusCalculate = 'radiusCalculate';
/**
 * Sets and gets tooltip render event name in the circular gauge component.
 * @private
 */
const tooltipRender = 'tooltipRender';
/**
 * Sets and gets annotation render event name in the circular gauge component.
 * @private
 */
const annotationRender = 'annotationRender';
/**
 * Sets and gets gauge mouse move event name in the circular gauge component.
 * @private
 */
const gaugeMouseMove = 'gaugeMouseMove';
/**
 * Sets and gets gauge mouse leave event name in the circular gauge component.
 * @private
 */
const gaugeMouseLeave = 'gaugeMouseLeave';
/**
 * Sets and gets gauge mouse down event name in the circular gauge component.
 * @private
 */
const gaugeMouseDown = 'gaugeMouseDown';
/**
 * Sets and gets gauge mouse up event name in circular gauge component.
 * @private
 */
const gaugeMouseUp = 'gaugeMouseUp';
/**
 * Sets and gets drag start event name in the circular gauge component.
 * @private
 */
const dragStart = 'dragStart';
/**
 * Sets and gets drag move event name in the circular gauge component.
 * @private
 */
const dragMove = 'dragMove';
/**
 * Sets and gets drag end event name in the circular gauge component.
 * @private
 */
const dragEnd = 'dragEnd';
/**
 * Sets and gets resize event name in the circular gauge component.
 * @private
 */
const resized = 'resized';
/**
 * Sets and gets before print event name in the circular gauge component.
 * @private
 */
const beforePrint = 'beforePrint';
/**
 * Sets and gets pointer start event name in the circular gauge component.
 * @private
 */
const pointerStart = 'pointerStart';
/**
 * Sets and gets pointer move event name in the circular gauge component.
 * @private
 */
const pointerMove = 'pointerMove';
/**
 * Sets and gets pointer end event name in the circular gauge component.
 * @private
 */
const pointerEnd = 'pointerEnd';
/**
 * Sets and gets range start event name in the circular gauge component.
 * @private
 */
const rangeStart = 'rangeStart';
/**
 * Sets and gets range move event name in the circular gauge component.
 * @private
 */
const rangeMove = 'rangeMove';
/**
 * Sets and gets range end event name in the circular gauge component.
 * @private
 */
const rangeEnd = 'rangeEnd';

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
    //tslint:disable
    renderAnnotation(axis, index) {
        let width = this.gauge.availableSize.width;
        let element = createElement('div', {
            id: this.elementId + '_Annotations_' + index
        });
        let parentElement = getElement(this.elementId + '_Secondary_Element');
        if (!isNullOrUndefined(document.getElementById(this.elementId + '_Secondary_Element'))) {
            document.getElementById(this.elementId + '_Secondary_Element').style.width = width + 'px';
        }
        axis.annotations.map((annotation, annotationIndex) => {
            if (annotation.content !== null) {
                this.createTemplate(element, annotationIndex, index);
            }
        });
        if (parentElement && element.childElementCount && !this.gauge.isBlazor) {
            parentElement.appendChild(element);
        }
        this.gauge.renderReactTemplates();
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
        if (this.gauge.isBlazor) {
            let { cancel, name, content, textStyle } = argsData;
            argsData = { cancel, name, content, annotation, textStyle };
        }
        this.gauge.trigger('annotationRender', argsData, (observedArgs) => {
            let templateFn;
            let templateElement;
            if (!argsData.cancel) {
                templateFn = getTemplateFunction(argsData.content, this.gauge);
                if (templateFn && (!this.gauge.isBlazor ? templateFn(axis, this.gauge, argsData.content, this.gauge.element.id + '_Axis' + axisIndex + '_ContentTemplate' + annotationIndex).length : {})) {
                    templateElement = Array.prototype.slice.call(templateFn(!this.gauge.isBlazor ? axis : {}, this.gauge, argsData.content, this.gauge.element.id + '_Axis' + axisIndex + '_ContentTemplate' + annotationIndex));
                    let length = templateElement.length;
                    for (let i = 0; i < length; i++) {
                        childElement.appendChild(templateElement[i]);
                    }
                }
                else {
                    childElement.appendChild(createElement('div', {
                        innerHTML: argsData.content,
                        id: 'StringTemplate',
                        styles: getFontStyle(argsData.textStyle)
                    }));
                }
                this.updateLocation(childElement, axis, annotation);
                element.appendChild(childElement);
                let parentElement = document.getElementById(this.elementId + '_Secondary_Element');
                if (this.gauge.isBlazor && annotationIndex === (this.gauge.axes[axisIndex].annotations.length - 1) &&
                    element && parentElement) {
                    parentElement.appendChild(element);
                    for (let i = 0; i < this.gauge.axes[axisIndex].annotations.length; i++) {
                        updateBlazorTemplate(this.gauge.element.id + '_Axis' + axisIndex + '_ContentTemplate' + i, 'ContentTemplate', this.gauge.axes[axisIndex].annotations[i]);
                    }
                }
            }
        });
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
 * Sets and gets the module that handles the tooltip of the circular gauge
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
    /* tslint:disable */
    renderTooltip(e) {
        this.gaugeId = this.gauge.element.getAttribute('id');
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
        if ((this.tooltip.type.indexOf('Pointer') > -1) && (target.id.indexOf('_Pointer_') >= 0) &&
            (target.id.indexOf(this.gaugeId) >= 0)) {
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
            this.tooltipElement();
            if (this.tooltipEle.childElementCount !== 0 && !this.gauge.enablePointerDrag && !this.gauge.tooltip.showAtMousePosition) {
                return null;
            }
            let roundValue = this.roundedValue(this.currentPointer.currentValue);
            let pointerContent = customLabelFormat ?
                tooltipFormat.replace(new RegExp('{value}', 'g'), format(roundValue)) :
                format(roundValue);
            location = getLocationFromAngle(angle, this.currentAxis.currentRadius, this.gauge.midPoint);
            location.x = (this.tooltip.template && ((angle >= 150 && angle <= 250) || (angle >= 330 && angle <= 360) ||
                (angle >= 0 && angle <= 45))) ? (location.x + 10) : location.x;
            let tooltipArgs = {
                name: tooltipRender, cancel: false, content: pointerContent, location: location, axis: this.currentAxis,
                tooltip: this.tooltip, pointer: this.currentPointer, event: e, gauge: this.gauge, appendInBodyTag: false, type: 'Pointer'
            };
            if (this.gauge.isBlazor) {
                const { name, cancel, content, location, tooltip, event, appendInBodyTag, type } = tooltipArgs;
                tooltipArgs = { name, cancel, content, location, tooltip, event, appendInBodyTag, type };
            }
            let pointerTooltip = (tooltipArgs) => {
                let template = tooltipArgs.tooltip.template;
                if (template !== null && template.length === 1) {
                    template = template[template[0]];
                }
                if (!tooltipArgs.tooltip.showAtMousePosition) {
                    if (template) {
                        let elementSize = getElementSize(template, this.gauge, this.tooltipEle);
                        this.tooltipRect = Math.abs(axisRect.left - svgRect.left) > elementSize.width ?
                            this.findPosition(rect, angle, pointerContent, tooltipArgs.location) : rect;
                    }
                    else {
                        this.findPosition(rect, angle, pointerContent, tooltipArgs.location);
                    }
                }
                else {
                    tooltipArgs.location = getMousePosition(pageX, pageY, this.gauge.svgObject);
                    this.tooltipRect = rect;
                }
                if (!tooltipArgs.cancel && !samePointerEle) {
                    tooltipArgs.tooltip.textStyle.color = tooltipArgs.tooltip.textStyle.color || this.gauge.themeStyle.tooltipFontColor;
                    tooltipArgs.tooltip.textStyle.fontFamily = this.gauge.themeStyle.fontFamily || tooltipArgs.tooltip.textStyle.fontFamily;
                    tooltipArgs.tooltip.textStyle.opacity = this.gauge.themeStyle.tooltipTextOpacity ||
                        tooltipArgs.tooltip.textStyle.opacity;
                    this.svgTooltip = this.svgTooltipCreate(this.svgTooltip, tooltipArgs, template, this.arrowInverted, this.tooltipRect, this.gauge, tooltipArgs.tooltip.fill, tooltipArgs.tooltip.textStyle, tooltipArgs.tooltip.border);
                    this.svgTooltip.opacity = this.gauge.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
                    this.svgTooltip.appendTo(this.tooltipEle);
                    if (template && Math.abs(pageY - this.tooltipEle.getBoundingClientRect().top) <= 0) {
                        this.tooltipEle.style.top = (parseFloat(this.tooltipEle.style.top) + 20) + 'px';
                    }
                }
            };
            this.gauge.trigger(tooltipRender, tooltipArgs, pointerTooltip);
            this.gauge.renderReactTemplates();
        }
        else if ((this.tooltip.type.indexOf('Range') > -1) && (target.id.indexOf('_Range_') >= 0) && (!this.gauge.isDrag) &&
            (target.id.indexOf(this.gaugeId) >= 0)) {
            let rangeSvgRect = this.gauge.svgObject.getBoundingClientRect();
            let rangeElementRect = this.gauge.element.getBoundingClientRect();
            let rangeAxisRect = document.getElementById(this.gauge.element.id + '_AxesCollection').getBoundingClientRect();
            let rect = new Rect(Math.abs(rangeElementRect.left - rangeSvgRect.left), Math.abs(rangeElementRect.top - rangeSvgRect.top), rangeSvgRect.width, rangeSvgRect.height);
            let currentRange = getPointer(target.id, this.gauge);
            this.currentAxis = this.gauge.axes[currentRange.axisIndex];
            this.currentRange = (this.currentAxis.ranges)[currentRange.pointerIndex];
            let rangeAngle = getAngleFromValue((this.currentRange.end - Math.abs((this.currentRange.end - this.currentRange.start) / 2)), this.currentAxis.visibleRange.max, this.currentAxis.visibleRange.min, this.currentAxis.startAngle, this.currentAxis.endAngle, this.currentAxis.direction === 'ClockWise') % 360;
            let rangeTooltipFormat = this.gauge.tooltip.rangeSettings.format || this.currentAxis.labelStyle.format;
            let customLabelFormat = rangeTooltipFormat && (rangeTooltipFormat.match('{end}') !== null ||
                rangeTooltipFormat.match('{start}') !== null);
            let rangeFormat = this.gauge.intl.getNumberFormat({
                format: getLabelFormat(rangeTooltipFormat), useGrouping: this.gauge.useGroupingSeparator
            });
            this.tooltipElement();
            let roundStartValue = this.roundedValue(this.currentRange.start);
            let roundEndValue = this.roundedValue(this.currentRange.end);
            let startData = (this.currentRange.start).toString();
            let endData = (this.currentRange.end).toString();
            let rangeContent = customLabelFormat ?
                rangeTooltipFormat.replace(/{start}/g, startData).replace(/{end}/g, endData) :
                'Start : ' + rangeFormat(roundStartValue) + '<br>' + 'End : ' + rangeFormat(roundEndValue);
            location = getLocationFromAngle(rangeAngle, this.currentRange.currentRadius, this.gauge.midPoint);
            location.x = (this.tooltip.rangeSettings.template && ((rangeAngle >= 150 && rangeAngle <= 250) ||
                (rangeAngle >= 330 && rangeAngle <= 360) ||
                (rangeAngle >= 0 && rangeAngle <= 45))) ? (location.x + 10) : location.x;
            let rangeTooltipArgs = {
                name: tooltipRender, cancel: false, content: rangeContent, location: location, axis: this.currentAxis,
                tooltip: this.tooltip, range: this.currentRange, event: e, gauge: this.gauge, appendInBodyTag: false, type: 'Range'
            };
            if (this.gauge.isBlazor) {
                const { name, cancel, content, location, tooltip, event, appendInBodyTag, type } = rangeTooltipArgs;
                rangeTooltipArgs = { name, cancel, content, location, tooltip, event, appendInBodyTag, type };
            }
            let rangeTooltip = (rangeTooltipArgs) => {
                let rangeTemplate = rangeTooltipArgs.tooltip.rangeSettings.template;
                if (rangeTemplate !== null && rangeTemplate.length === 1) {
                    rangeTemplate = rangeTemplate[rangeTemplate[0]];
                }
                if (rangeTemplate) {
                    rangeTemplate = rangeTemplate.replace(/[$]{start}/g, startData);
                    rangeTemplate = rangeTemplate.replace(/[$]{end}/g, endData);
                }
                if (!this.tooltip.rangeSettings.showAtMousePosition) {
                    if (rangeTemplate) {
                        let elementSize = getElementSize(rangeTemplate, this.gauge, this.tooltipEle);
                        this.tooltipRect = Math.abs(rangeAxisRect.left - rangeSvgRect.left) > elementSize.width ?
                            this.findPosition(rect, rangeAngle, rangeContent, rangeTooltipArgs.location) : rect;
                    }
                    else {
                        this.findPosition(rect, rangeAngle, rangeContent, rangeTooltipArgs.location);
                    }
                }
                else {
                    rangeTooltipArgs.location = getMousePosition(pageX, pageY, this.gauge.svgObject);
                    this.tooltipRect = rect;
                }
                if (!rangeTooltipArgs.cancel) {
                    rangeTooltipArgs.tooltip.rangeSettings.textStyle.color = rangeTooltipArgs.tooltip.rangeSettings.textStyle.color ||
                        this.gauge.themeStyle.tooltipFontColor;
                    rangeTooltipArgs.tooltip.rangeSettings.textStyle.fontFamily = this.gauge.themeStyle.fontFamily ||
                        rangeTooltipArgs.tooltip.rangeSettings.textStyle.fontFamily;
                    rangeTooltipArgs.tooltip.rangeSettings.textStyle.opacity = this.gauge.themeStyle.tooltipTextOpacity ||
                        rangeTooltipArgs.tooltip.rangeSettings.textStyle.opacity;
                    this.svgTooltip = this.svgTooltipCreate(this.svgTooltip, rangeTooltipArgs, rangeTemplate, this.arrowInverted, this.tooltipRect, this.gauge, rangeTooltipArgs.tooltip.rangeSettings.fill, rangeTooltipArgs.tooltip.rangeSettings.textStyle, rangeTooltipArgs.tooltip.rangeSettings.border);
                    this.svgTooltip.opacity = this.gauge.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
                    this.svgTooltip.appendTo(this.tooltipEle);
                    if (rangeTemplate && Math.abs(pageY - this.tooltipEle.getBoundingClientRect().top) <= 0) {
                        this.tooltipEle.style.top = (parseFloat(this.tooltipEle.style.top) + 20) + 'px';
                    }
                }
            };
            this.gauge.trigger(tooltipRender, rangeTooltipArgs, rangeTooltip);
            this.gauge.renderReactTemplates();
        }
        else if ((this.tooltip.type.indexOf('Annotation') > -1) && this.checkParentAnnotationId(target) && ((!this.gauge.isDrag)) &&
            (this.annotationTargetElement.id.indexOf(this.gaugeId) >= 0)) {
            let annotationSvgRect = this.gauge.svgObject.getBoundingClientRect();
            let annotationElementRect = this.gauge.element.getBoundingClientRect();
            let annotationAxisRect = document.getElementById(this.gauge.element.id + '_AxesCollection').getBoundingClientRect();
            let rect = new Rect(Math.abs(annotationElementRect.left - annotationSvgRect.left), Math.abs(annotationElementRect.top - annotationSvgRect.top), annotationSvgRect.width, annotationSvgRect.height);
            let currentAnnotation = getPointer(this.annotationTargetElement.id, this.gauge);
            this.currentAxis = this.gauge.axes[currentAnnotation.axisIndex];
            this.currentAnnotation = (this.currentAxis.annotations)[currentAnnotation.pointerIndex];
            let annotationAngle = (this.currentAnnotation.angle - 90);
            this.tooltipElement();
            document.getElementById(this.gauge.element.id + '_Secondary_Element').appendChild(this.tooltipEle);
            let annotationContent = (this.gauge.tooltip.annotationSettings.format !== null) ?
                this.gauge.tooltip.annotationSettings.format : '';
            location = getLocationFromAngle(annotationAngle, stringToNumber(this.currentAnnotation.radius, this.currentAxis.currentRadius), this.gauge.midPoint);
            location.x = (this.tooltip.annotationSettings.template && ((annotationAngle >= 150 && annotationAngle <= 250) ||
                (annotationAngle >= 330 && annotationAngle <= 360) || (annotationAngle >= 0 && annotationAngle <= 45))) ?
                (location.x + 10) : location.x;
            let annotationTooltipArgs = {
                name: tooltipRender, cancel: false, content: annotationContent, location: location, axis: this.currentAxis,
                tooltip: this.tooltip, annotation: this.currentAnnotation, event: e, gauge: this.gauge, appendInBodyTag: false,
                type: 'Annotation'
            };
            if (this.gauge.isBlazor) {
                const { name, cancel, content, location, tooltip, event, appendInBodyTag, type } = annotationTooltipArgs;
                annotationTooltipArgs = { name, cancel, content, location, tooltip, event, appendInBodyTag, type };
            }
            let annotationTooltip = (annotationTooltipArgs) => {
                let annotationTemplate = annotationTooltipArgs.tooltip.annotationSettings.template;
                if (annotationTemplate !== null && annotationTemplate.length === 1) {
                    annotationTemplate = annotationTemplate[annotationTemplate[0]];
                }
                let elementSizeAn = this.annotationTargetElement.getBoundingClientRect();
                this.tooltipPosition = 'RightTop';
                this.arrowInverted = true;
                annotationTooltipArgs.location.x = annotationTooltipArgs.location.x + (elementSizeAn.width / 2);
                this.tooltipRect = new Rect(rect.x, rect.y, rect.width, rect.height);
                if (!annotationTooltipArgs.cancel && (this.gauge.tooltip.annotationSettings.format !== null ||
                    this.gauge.tooltip.annotationSettings.template !== null)) {
                    annotationTooltipArgs.tooltip.annotationSettings.textStyle.color = annotationTooltipArgs.tooltip.textStyle.color ||
                        this.gauge.themeStyle.tooltipFontColor;
                    annotationTooltipArgs.tooltip.annotationSettings.textStyle.fontFamily = this.gauge.themeStyle.fontFamily ||
                        annotationTooltipArgs.tooltip.textStyle.fontFamily;
                    annotationTooltipArgs.tooltip.annotationSettings.textStyle.opacity = this.gauge.themeStyle.tooltipTextOpacity ||
                        annotationTooltipArgs.tooltip.textStyle.opacity;
                    this.svgTooltip = this.svgTooltipCreate(this.svgTooltip, annotationTooltipArgs, annotationTemplate, this.arrowInverted, this.tooltipRect, this.gauge, annotationTooltipArgs.tooltip.annotationSettings.fill, annotationTooltipArgs.tooltip.annotationSettings.textStyle, annotationTooltipArgs.tooltip.annotationSettings.border);
                    this.svgTooltip.opacity = this.gauge.themeStyle.tooltipFillOpacity || this.svgTooltip.opacity;
                    this.svgTooltip.appendTo(this.tooltipEle);
                    if (annotationTemplate && Math.abs(pageY - this.tooltipEle.getBoundingClientRect().top) <= 0) {
                        this.tooltipEle.style.top = (parseFloat(this.tooltipEle.style.top) + 20) + 'px';
                    }
                }
            };
            this.gauge.trigger(tooltipRender, annotationTooltipArgs, annotationTooltip);
            this.gauge.renderReactTemplates();
        }
        else {
            this.removeTooltip();
            this.gauge.clearTemplate();
        }
    }
    ;
    /**
     * Method to create tooltip svg element.
     */
    svgTooltipCreate(svgTooltip, tooltipArg, template, arrowInverted, tooltipRect, gauge, fill, textStyle, border) {
        svgTooltip = new Tooltip({
            enable: true,
            data: { value: tooltipArg.content },
            template: template,
            enableAnimation: tooltipArg.tooltip.enableAnimation,
            content: [tooltipArg.content],
            location: tooltipArg.location,
            inverted: arrowInverted,
            areaBounds: tooltipRect,
            fill: fill || gauge.themeStyle.tooltipFillColor,
            textStyle: textStyle,
            availableSize: gauge.availableSize,
            border: border,
            blazorTemplate: { name: 'TooltipTemplate', parent: gauge.tooltip }
        });
        return svgTooltip;
    }
    /**
     * Method to create or modify tolltip element.
     */
    tooltipElement() {
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
    }
    ;
    /**
     * Method to get parent annotation element.
     */
    checkParentAnnotationId(child) {
        this.annotationTargetElement = child.parentElement;
        while (this.annotationTargetElement != null) {
            if ((this.annotationTargetElement.id.indexOf('_Annotation_') >= 0)) {
                child = this.annotationTargetElement;
                return true;
            }
            this.annotationTargetElement = this.annotationTargetElement.parentElement;
        }
        return false;
    }
    /**
     * Method to apply label rounding places.
     */
    roundedValue(currentValue) {
        let roundNumber;
        roundNumber = this.currentAxis.roundingPlaces ?
            parseFloat(currentValue.toFixed(this.currentAxis.roundingPlaces)) :
            currentValue;
        return roundNumber;
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
            let tooltip = document.getElementsByClassName('EJ2-CircularGauge-Tooltip')[0];
            if (tooltip) {
                remove(tooltip);
            }
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
        this.gauge.element.addEventListener('contextmenu', this.removeTooltip);
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
        let color = axis.lineStyle.color || this.gauge.themeStyle.lineColor;
        if (axis.lineStyle.width > 0) {
            startAngle = !isCompleteAngle(startAngle, endAngle) ? startAngle : [0, endAngle = 360][0];
            appendPath(new PathOption(gauge.element.id + '_AxisLine_' + index, 'transparent', axis.lineStyle.width, color, null, axis.lineStyle.dashArray, getPathArc(gauge.midPoint, startAngle - 90, endAngle - 90, axis.currentRadius), '', 'pointer-events:none;'), element, gauge);
        }
    }
    /**
     * Method to render the axis labels of the circular gauge.
     * @return {void}
     * @private
     */
    /* tslint:disable:no-string-literal */
    /* tslint:disable:max-func-body-length */
    drawAxisLabels(axis, index, element, gauge) {
        let labelElement = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_Labels_' + index
        });
        let min = axis.visibleRange.min;
        let max = axis.visibleRange.max;
        let labelCollection = axis.visibleLabels;
        let location;
        let textWidth;
        let textHeight;
        let labelsVisible = true;
        let currentTextWidth;
        let currentTextHeight;
        let previousLocation;
        let currentLocation;
        let lastLabelLocation;
        let lastLabelAngle;
        let lastLabelAnchor;
        let lastTextWidth;
        let lastTextHeight;
        let style = axis.labelStyle;
        let anchor;
        let angle;
        let label;
        let radius = axis.currentRadius;
        let checkLabelOpposed = 0;
        checkLabelOpposed = (style.position === 'Inside' && axis.majorTicks.position === 'Outside' &&
            axis.minorTicks.position === 'Outside') || (style.position === 'Outside' &&
            axis.minorTicks.position === 'Inside' && axis.majorTicks.position === 'Inside') ?
            axis.lineStyle.width + axis.currentRadius / 20 :
            (style.position === axis.majorTicks.position ? axis.currentRadius / 20 : axis.currentRadius / 40);
        let labelPadding = axis.labelStyle.shouldMaintainPadding ? 10 : checkLabelOpposed;
        let color = style.font.color || this.gauge.themeStyle.labelColor;
        if (style.position === 'Outside') {
            radius += (axis.nearSize - (axis.maxLabelSize.height + axis.lineStyle.width / 2)) + (labelPadding / 2);
        }
        else if (style.position === 'Cross') {
            radius = radius - (axis.maxLabelSize.height / 4) - axis.labelStyle.offset;
        }
        else {
            radius -= (axis.farSize - (axis.maxLabelSize.height + axis.lineStyle.width / 2) + (style.autoAngle ? labelPadding : 0));
        }
        //To get and store lastlabelposition
        if (axis.hideIntersectingLabel) {
            lastLabelAngle = Math.round(getAngleFromValue(labelCollection[labelCollection.length - 1].value, max, min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise'));
            lastLabelLocation = getLocationFromAngle(lastLabelAngle, radius, gauge.midPoint);
            lastLabelAnchor = this.findAnchor(lastLabelLocation, style, lastLabelAngle, labelCollection[labelCollection.length - 1]);
            lastTextWidth = (!axis.showLastLabel && (isCompleteAngle(axis.startAngle, axis.endAngle)) && (style.hiddenLabel !== 'First')) ?
                labelCollection[0].size.width : labelCollection[labelCollection.length - 1].size.width;
            lastTextHeight = (!axis.showLastLabel && (isCompleteAngle(axis.startAngle, axis.endAngle)) && (style.hiddenLabel !== 'First')) ?
                (!style.autoAngle ? labelCollection[0].size.height : labelCollection[0].size.width) :
                (!style.autoAngle ? labelCollection[labelCollection.length - 1].size.height :
                    labelCollection[labelCollection.length - 1].size.width);
            lastTextHeight = lastTextHeight - this.offsetAxisLabelsize(lastLabelAngle, lastTextHeight);
            lastLabelLocation = this.getAxisLabelStartPosition(lastLabelLocation, lastTextWidth, style, lastTextHeight, lastLabelAnchor, lastLabelAngle);
        }
        for (let i = 0, length = labelCollection.length; i < length; i++) {
            label = labelCollection[i];
            angle = Math.round(getAngleFromValue(label.value, max, min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise'));
            location = getLocationFromAngle(angle, radius, gauge.midPoint);
            anchor = this.findAnchor(location, style, angle, label);
            //To get the current label and previous label position for initial stage
            if (axis.hideIntersectingLabel) {
                currentLocation = getLocationFromAngle(angle, radius, gauge.midPoint);
                currentTextWidth = label.size.width;
                currentTextHeight = !style.autoAngle ? label.size.height : currentTextWidth;
                currentTextHeight = currentTextHeight - this.offsetAxisLabelsize(angle, currentTextHeight);
                currentLocation = this.getAxisLabelStartPosition(currentLocation, currentTextWidth, style, currentTextHeight, anchor, angle);
                if (i === 0) {
                    previousLocation = getLocationFromAngle(angle, radius, gauge.midPoint);
                    textWidth = label.size.width;
                    textHeight = !style.autoAngle ? label.size.height : textWidth;
                    textHeight = textHeight - this.offsetAxisLabelsize(angle, textHeight);
                    previousLocation = this.getAxisLabelStartPosition(previousLocation, textWidth, style, textHeight, anchor, angle);
                }
            }
            if ((i === 0 && style.hiddenLabel === 'First') || (i === (length - 1) && style.hiddenLabel === 'Last')) {
                continue;
            }
            style.font.fontFamily = this.gauge.themeStyle.labelFontFamily || style.font.fontFamily;
            if (axis.hideIntersectingLabel && (i !== 0)) {
                //To remove the labels which is intersecting with last label.
                let lastlabel = ((i !== (labelCollection.length - 1)) && ((isCompleteAngle(axis.startAngle, axis.endAngle) ||
                    axis.showLastLabel))) ? this.FindAxisLabelCollision(lastLabelLocation, lastTextWidth, lastTextHeight, currentLocation, currentTextWidth, currentTextHeight) : true;
                //Checking wether the axis label is intersecting with previous label or not.
                labelsVisible = (this.FindAxisLabelCollision(previousLocation, textWidth, textHeight, currentLocation, currentTextWidth, currentTextHeight) && lastlabel);
            }
            else {
                labelsVisible = true;
            }
            if (labelsVisible || (i === labelCollection.length - 1)) {
                //To hide first and last label based on requirement
                label.text = (!axis.showLastLabel && ((isCompleteAngle(axis.startAngle, axis.endAngle) && style.hiddenLabel !== 'First') ||
                    !labelsVisible)
                    && axis.hideIntersectingLabel && (i === (length - 1))) ? '' : label.text;
                label.text = (axis.showLastLabel && axis.hideIntersectingLabel && isCompleteAngle(axis.startAngle, axis.endAngle)
                    && (i === 0)) ? '' : label.text;
                textElement(new TextOption(gauge.element.id + '_Axis_' + index + '_Label_' + i, location.x, location.y, anchor, label.text, style.autoAngle ? 'rotate(' + (angle + 90) + ',' + (location.x) + ',' + location.y + ')' : '', 'auto'), style.font, style.useRangeColor ? getRangeColor(label.value, axis.ranges, color) : color, labelElement, 'pointer-events:none;');
                if (axis.hideIntersectingLabel) {
                    textWidth = label.size.width;
                    textHeight = !style.autoAngle ? label.size.height : textWidth;
                    textHeight = textHeight - this.offsetAxisLabelsize(angle, textHeight);
                    previousLocation.x = currentLocation.x;
                    previousLocation.y = currentLocation.y;
                }
            }
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
     * Methode to check whether the labels are intersecting or not.
     * @private
     */
    FindAxisLabelCollision(previousLocation, previousWidth, previousHeight, currentLocation, currentWidth, currentHeight) {
        let labelVisisble = ((previousLocation.x > (currentLocation.x + (currentWidth))) ||
            ((previousLocation.x + (previousWidth)) < (currentLocation.x)) ||
            ((previousLocation.y + (previousHeight)) < (currentLocation.y)) ||
            ((previousLocation.y) > (currentLocation.y + (currentHeight))));
        return labelVisisble;
    }
    /**
     * Methode to get anchor position of label as start.
     * @private
     */
    getAxisLabelStartPosition(actualLocation, textWidth, style, textHeight, anchorPosition, angle) {
        if (anchorPosition === 'end') {
            actualLocation.x = actualLocation.x - textWidth;
        }
        else if (anchorPosition === 'middle') {
            actualLocation.x = actualLocation.x - (textWidth / 2);
        }
        else {
            actualLocation.x = actualLocation.x;
        }
        return actualLocation;
    }
    /**
     * Methode to offset label height and width based on angle.
     * @private
     */
    offsetAxisLabelsize(angle, size) {
        let finalSize = ((angle >= 20 && angle <= 60) || (angle >= 120 && angle <= 160) || (angle >= 200 && angle <= 240) ||
            (angle >= 300 && angle <= 340)) ? size / 5 : 0;
        return finalSize;
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
        let color = minorLineStyle.color || this.gauge.themeStyle.minorTickColor;
        if (minorLineStyle.width && minorLineStyle.height && minorInterval) {
            for (let i = axis.visibleRange.min, max = axis.visibleRange.max; i <= max; i += minorInterval) {
                if (this.majorValues.indexOf(+i.toFixed(3)) < 0) {
                    appendPath(new PathOption(gauge.element.id + '_Axis_Minor_TickLine_' + index + '_' + i, 'transparent', minorLineStyle.width, isRangeColor ? getRangeColor(i, axis.ranges, color) : color, null, minorLineStyle.dashArray, this.calculateTicks(i, minorLineStyle, axis), '', 'pointer-events:none;'), minorTickElements, gauge);
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
        let color = majorLineStyle.color || this.gauge.themeStyle.majorTickColor;
        if (majorLineStyle.width && majorLineStyle.height && axis.visibleRange.interval) {
            for (let i = axis.visibleRange.min, max = axis.visibleRange.max, interval = axis.visibleRange.interval; i <= max; i += interval) {
                this.majorValues.push(+i.toFixed(3));
                appendPath(new PathOption(gauge.element.id + '_Axis_Major_TickLine_' + index + '_' + i, 'transparent', majorLineStyle.width, isRangeColor ? getRangeColor(i, axis.ranges, color) : color, null, majorLineStyle.dashArray, this.calculateTicks(i, majorLineStyle, axis), '', 'pointer-events:none;'), majorTickElements, gauge);
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
        let angle = getAngleFromValue(value, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise');
        let start = getLocationFromAngle(angle, axis.currentRadius +
            (options.position === 'Outside' ? axisLineWidth : options.position === 'Cross' ?
                options.height / 2 - options.offset : -axisLineWidth), this.gauge.midPoint);
        let end = getLocationFromAngle(angle, axis.currentRadius +
            (options.position === 'Outside' ? axisLineWidth : options.position === 'Cross' ?
                options.height / 2 - options.offset : -axisLineWidth) +
            (options.position === 'Outside' ? options.height : -options.height), this.gauge.midPoint);
        return 'M ' + start.x + ' ' + start.y + ' L ' + end.x + ' ' + end.y + ' ';
    }
    /**
     * Method to render the axis range of the circular gauge.
     * @return {void}
     * @private
     */
    drawAxisRange(axis, index, element, gauge) {
        let startValue;
        let endValue;
        let rangeElement;
        let ele;
        ele = (document.getElementById(gauge.element.id + '_Axis_Ranges_ ' + index));
        rangeElement = (ele) ? document.getElementById(gauge.element.id + '_Axis_Ranges_ ' + index) :
            gauge.renderer.createGroup({ id: gauge.element.id + '_Axis_Ranges_' + index });
        let location = this.gauge.midPoint;
        let startAngle;
        let endAngle;
        let isClockWise = axis.direction === 'ClockWise';
        let min = axis.visibleRange.min;
        let max = axis.visibleRange.max;
        let startWidth;
        let endWidth;
        let roundedStartAngle;
        let roundedEndAngle;
        let oldStart;
        let oldEnd;
        let gradientRangeColor;
        axis.ranges.map((range, rangeIndex) => {
            rangeIndex = rangeIndex;
            range.pathElement = [];
            if (!isNullOrUndefined(range.offset) && range.offset.length > 0) {
                range.currentDistanceFromScale = stringToNumber(range.offset, axis.currentRadius);
            }
            else {
                range.currentDistanceFromScale = range.offset;
            }
            this.calculateRangeRadius(axis, range);
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
            range.currentRadius = this.calculateRangeRadiusWithPosition(axis, range, startWidth);
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
                if (gauge.gradientModule) {
                    gradientRangeColor = gauge.gradientModule.getGradientColorString(range);
                }
                range.rangeColor = gradientRangeColor ? gradientRangeColor : range.rangeColor;
                if (range.roundedCornerRadius) {
                    range.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + index + '_Range_' + rangeIndex, range.rangeColor, 0, range.rangeColor, range.opacity, '0', getRoundedPathArc(location, Math.floor(roundedStartAngle), Math.ceil(roundedEndAngle), oldStart, oldEnd, range.currentRadius, startWidth, endWidth), '', ''), rangeElement, gauge));
                }
                else {
                    range.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + index + '_Range_' +
                        rangeIndex, range.rangeColor, 0, range.rangeColor, range.opacity, '0', getPathArc(gauge.midPoint, Math.floor(startAngle), Math.ceil(endAngle), range.currentRadius, startWidth, endWidth, range, axis), '', ''), rangeElement, gauge));
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
    calculateRangeRadiusWithPosition(axis, range, startWidth) {
        let actualRadius;
        actualRadius = !isNullOrUndefined(range.position) && range.position !== 'Auto' && isNullOrUndefined(range.radius) ?
            (range.position === 'Outside' ? (range.currentRadius + axis.lineStyle.width / 2 + range.currentDistanceFromScale) :
                range.position === 'Inside' ? (range.currentRadius - axis.lineStyle.width / 2 - range.currentDistanceFromScale) :
                    (range.currentRadius + startWidth / 2 - range.currentDistanceFromScale)) : range.currentRadius;
        return actualRadius;
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
            if (!isNullOrUndefined(pointer.offset) && pointer.offset.length > 0) {
                pointer.currentDistanceFromScale = stringToNumber(pointer.offset, axis.currentRadius);
            }
            else {
                pointer.currentDistanceFromScale = pointer.offset;
            }
            range = axis.visibleRange;
            pointer.pathElement = [];
            this.calculatePointerRadius(axis, pointer);
            childElement = gauge.renderer.createGroup({
                id: gauge.element.id + '_Axis_' + axisIndex + '_Pointer_' + pointerIndex
            });
            this['draw' + pointer.type + 'Pointer'](axis, axisIndex, pointerIndex, childElement, gauge);
            this.setPointerValue(axis, pointer, pointer.currentValue);
            pointerElement.appendChild(childElement);
            if (animate || pointer.animation.enable) {
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
        pointer.currentRadius = !isNullOrUndefined(pointer.radius) ?
            stringToNumber(pointer.radius, axis.currentRadius) : pointer.position !== 'Auto' ?
            this.pointerRadiusForPosition(axis, pointer) : (axis.currentRadius - (axis.farSize + padding));
    }
    /**
     * Measure the pointer length of the circular gauge based on pointer position.
     * @return {number}
     */
    pointerRadiusForPosition(axis, pointer) {
        if (pointer.markerShape === 'Text') {
            let pointerRadius;
            let pointerSize = parseInt(pointer.textStyle.size, 10);
            let markerOffset = pointer.position === 'Cross' ? pointerSize / 5 : 0;
            pointerRadius = pointer.position === 'Inside' ?
                (axis.currentRadius - pointerSize / 1.2 - axis.lineStyle.width / 2 - markerOffset - pointer.currentDistanceFromScale) :
                pointer.position === 'Outside' ?
                    (axis.currentRadius + axis.lineStyle.width / 2 + pointerSize / 4 + markerOffset + pointer.currentDistanceFromScale) :
                    (axis.currentRadius - pointerSize / 6 - markerOffset - pointer.currentDistanceFromScale);
            return pointerRadius;
        }
        else {
            let pointerRadius;
            let rangeBarOffset = pointer.type === 'RangeBar' ? pointer.pointerWidth : 0;
            let markerOffset = pointer.type === 'Marker' ? ((pointer.markerShape === 'InvertedTriangle' ||
                pointer.markerShape === 'Triangle') ? (pointer.position === 'Cross' ? pointer.markerWidth / 2 : 0) :
                pointer.markerWidth / 2) : 0;
            pointerRadius = pointer.position === 'Inside' ?
                (axis.currentRadius - axis.lineStyle.width / 2 - markerOffset - pointer.currentDistanceFromScale) :
                pointer.position === 'Outside' ?
                    (axis.currentRadius + rangeBarOffset + axis.lineStyle.width / 2 + markerOffset + pointer.currentDistanceFromScale) :
                    (axis.currentRadius + rangeBarOffset / 2 - pointer.currentDistanceFromScale -
                        ((pointer.markerShape === 'InvertedTriangle' || pointer.markerShape === 'Triangle') ? markerOffset : 0));
            return pointerRadius;
        }
    }
    /**
     * Method to render the needle pointer of the ciruclar gauge.
     * @return {void}
     */
    drawNeedlePointer(axis, axisIndex, index, parentElement, gauge) {
        let pointer = axis.pointers[index];
        let needle = pointer.needleTail;
        let cap = pointer.cap;
        let pointerRadius;
        let location;
        let direction;
        let needleStartWidth = pointer.needleStartWidth;
        let needleEndWidth = pointer.needleEndWidth;
        let mid = gauge.midPoint;
        let width = pointer.pointerWidth / 2;
        let rectDirection;
        let gradientColor;
        let gradientTailColor;
        let gradientCapColor;
        // To render the needle
        location = getLocationFromAngle(0, pointer.currentRadius, mid);
        if ((needleStartWidth === 0) && (needleEndWidth === 0) && width) {
            direction = 'M ' + mid.x + ' ' + (mid.y) + ' L ' + (location.x) + ' ' + mid.y +
                ' L ' + (mid.x) + ' ' + (mid.y) + ' Z';
        }
        else {
            direction = 'M ' + mid.x + ' ' + (mid.y - width - needleEndWidth) + ' L ' + (location.x) + ' ' + mid.y +
                ' L ' + location.x + ' ' + (mid.y + needleStartWidth) + ' L ' + mid.x + ' ' + (mid.y + width + needleEndWidth) + ' Z';
        }
        if (gauge.gradientModule) {
            gradientColor = gauge.gradientModule.getGradientColorString(pointer);
        }
        pointer.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Needle_' + index, gradientColor ? gradientColor :
            pointer.color || this.gauge.themeStyle.needleColor, pointer.border.width, pointer.border.color, null, '0', direction), parentElement, gauge));
        pointerRadius = stringToNumber(pointer.needleTail.length, pointer.currentRadius);
        // To render the rect element for touch
        rectDirection = 'M ' + mid.x + ' ' + (mid.y - width) + ' L ' + (location.x) + ' ' + (mid.y - width) +
            ' L ' + location.x + ' ' + (mid.y + width) + ' L ' + mid.x + ' ' + (mid.y + width);
        // To render the needle tail
        if (gauge.gradientModule) {
            gradientTailColor = gauge.gradientModule.getGradientColorString(needle);
        }
        if (pointerRadius) {
            location = getLocationFromAngle(180, pointerRadius, gauge.midPoint);
            direction = 'M ' + mid.x + ' ' + (mid.y - width) +
                ' L ' + (location.x) + ' ' + (mid.y - width) +
                ' L ' + (location.x) + ' ' + (mid.y + width) +
                ' L ' + (mid.x) + ' ' + (mid.y + width) + ' Z';
            pointer.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleTail_' + index, gradientTailColor ? gradientTailColor : pointer.needleTail.color || this.gauge.themeStyle.needleTailColor, pointer.needleTail.border.width, pointer.needleTail.border.color, null, '0', direction), parentElement, gauge));
            rectDirection += ' L ' + location.x + ' ' + (mid.y + width) + ' L ' + location.x + ' ' + (mid.y - width);
        }
        // To render the cap
        if (gauge.gradientModule) {
            gradientCapColor = gauge.gradientModule.getGradientColorString(cap);
        }
        if (pointer.cap.radius) {
            pointer.pathElement.push(appendPath(calculateShapes(mid, 'Circle', new Size(pointer.cap.radius * 2, pointer.cap.radius * 2), '', new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleCap_' + index, gradientCapColor ? gradientCapColor : pointer.cap.color || this.gauge.themeStyle.capColor, pointer.cap.border.width, pointer.cap.border.color, null, '0', '', '')), parentElement, gauge, 'Ellipse'));
        }
        pointer.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleRect_' + index, 'transparent', 0, 'transpanret', null, '0', rectDirection + ' Z'), parentElement, gauge));
    }
    /**
     * Method to set the pointer value of the circular gauge.
     * @return {void}
     * @private
     */
    setPointerValue(axis, pointer, value) {
        let checkMinValue = value === axis.visibleRange.min && pointer.type === 'RangeBar';
        let location = this.gauge.midPoint;
        let isClockWise = axis.direction === 'ClockWise';
        let startAngle = getAngleFromValue(axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        let endAngle = getAngleFromValue(value, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
        if (isClockWise) {
            endAngle = startAngle === endAngle && !checkMinValue ? endAngle + 1 : endAngle;
        }
        else {
            endAngle = startAngle === endAngle && !checkMinValue ? [startAngle, startAngle = endAngle - 1][0]
                : [startAngle, startAngle = endAngle][0];
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
                if (pointer.roundedCornerRadius && value && !checkMinValue) {
                    element.setAttribute('d', getRoundedPathArc(location, Math.floor(roundStartAngle), Math.ceil(roundEndAngle), oldStartValue, oldEndValue, pointer.currentRadius, pointer.pointerWidth, pointer.pointerWidth));
                    radius = 0;
                }
                else {
                    element.setAttribute('d', getCompleteArc(location, startAngle, endAngle, pointer.currentRadius, (pointer.currentRadius - pointer.pointerWidth), checkMinValue));
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
        let min = axis.visibleRange.min;
        let max = axis.visibleRange.max;
        let angle;
        let gradientMarkerColor;
        angle = Math.round(getAngleFromValue(pointer.value, max, min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise'));
        let shapeBasedOnPosition = pointer.markerShape;
        if (gauge.gradientModule) {
            gradientMarkerColor = gauge.gradientModule.getGradientColorString(pointer);
        }
        if (isNullOrUndefined(pointer.radius) && !isNullOrUndefined(pointer.position) && (pointer.markerShape === 'InvertedTriangle' ||
            pointer.markerShape === 'Triangle')) {
            shapeBasedOnPosition = ((pointer.position === 'Outside' || pointer.position === 'Cross') && pointer.markerShape === 'Triangle' ?
                'InvertedTriangle' : (pointer.position === 'Inside' &&
                pointer.markerShape === 'InvertedTriangle' ? 'Triangle' : pointer.markerShape));
        }
        let location = getLocationFromAngle((pointer.markerShape === 'Text') ? angle : 0, pointer.currentRadius, gauge.midPoint);
        if (pointer.markerShape === 'Text') {
            let textOption = new TextOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Marker_' + index, location.x, location.y, 'middle', pointer.text, 'rotate(' + (angle + 90) + ',' +
                (location.x) + ',' + location.y + ')', 'auto');
            textElement(textOption, pointer.textStyle, pointer.textStyle.color, parentElement, 'pointer-events : auto; ');
        }
        else {
            pointer.pathElement.push(appendPath(calculateShapes(location, shapeBasedOnPosition, new Size(pointer.markerWidth, pointer.markerHeight), pointer.imageUrl, new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Marker_' + index, gradientMarkerColor ? gradientMarkerColor : pointer.color || this.gauge.themeStyle.pointerColor, pointer.border.width, pointer.border.color, null, '0', '', '')), parentElement, gauge, pointer.markerShape === 'Circle' ? 'Ellipse' : (pointer.markerShape === 'Image' ? 'Image' : 'Path')));
        }
    }
    /**
     * Method to render the range bar pointer of the ciruclar gauge.
     * @return {void}
     */
    drawRangeBarPointer(axis, axisIndex, index, parentElement, gauge) {
        let pointer = axis.pointers[index];
        let gradientBarColor;
        if (gauge.gradientModule) {
            gradientBarColor = gauge.gradientModule.getGradientColorString(pointer);
        }
        pointer.pathElement.push(appendPath(new PathOption(gauge.element.id + '_Axis_' + axisIndex + '_Pointer_RangeBar_' + index, gradientBarColor ? gradientBarColor :
            pointer.color || this.gauge.themeStyle.pointerColor, pointer.border.width, pointer.border.color, 1, '0', ''), parentElement, gauge));
    }
    /**
     * Method to perform the animation of the pointer in circular gauge.
     * @return {void}
     */
    doPointerAnimation(pointer, axis) {
        let startValue = !isNullOrUndefined(pointer.previousValue) ? pointer.previousValue : axis.visibleRange.min;
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
                if (start !== end) {
                    element.setAttribute('transform', 'rotate(' + linear(args.timeStamp, startAngle, sweepAngle, args.duration) + ',' +
                        this.gauge.midPoint.x.toString() + ',' + this.gauge.midPoint.y.toString() + ')');
                }
            },
            end: (model) => {
                this.setPointerValue(axis, pointer, end);
                if (pointer.type === 'Marker' || (element.id.indexOf('_Pointer_NeedleCap') >= 0)) {
                    this.gauge.trigger(animationComplete, this.gauge.isBlazor ? {} : { axis: axis, pointer: pointer });
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
        let roundRadius = pointer.roundedCornerRadius;
        let sweepAngle;
        let endAngle;
        let oldStart;
        let minRadius = (radius * 0.25);
        if (roundRadius) {
            minAngle = ((((pointer.currentRadius) * ((minAngle * Math.PI) / 180) +
                roundRadius) / (pointer.currentRadius)) * 180) / Math.PI;
            pointAngle = ((((pointer.currentRadius) * ((pointAngle * Math.PI) / 180) -
                roundRadius) / (pointer.currentRadius)) * 180) / Math.PI;
            oldStart = ((((pointer.currentRadius - (pointer.pointerWidth / 2)) * ((startAngle * Math.PI) / 180) -
                (radius / minRadius)) / (pointer.currentRadius - (pointer.pointerWidth / 2))) * 180) / Math.PI;
        }
        endAngle = startAngle > pointAngle ? (pointAngle + 360) : pointAngle;
        new Animation({}).animate(element, {
            duration: pointer.animation.duration,
            progress: (arg) => {
                element.style.animation = 'None';
                sweepAngle = (start < end || Math.round(startAngle) === Math.round(endAngle)) ?
                    isClockWise ? (endAngle - startAngle) : (endAngle - startAngle - 360) :
                    isClockWise ? (endAngle - startAngle - 360) : (endAngle - startAngle);
                if (isClockWise) {
                    if (!roundRadius) {
                        element.setAttribute('d', getCompleteArc(this.gauge.midPoint, minAngle, linear(arg.timeStamp, startAngle, sweepAngle, arg.duration) + 0.0001, radius, innerRadius));
                    }
                    else {
                        element.setAttribute('d', getRoundedPathArc(this.gauge.midPoint, Math.floor(minAngle), linear(arg.timeStamp, Math.floor(minAngle), sweepAngle, arg.duration) + 0.0001, oldStart, linear(arg.timeStamp, Math.floor(minAngle + (roundRadius / 2)), sweepAngle, arg.duration) + 0.0001, radius, pointer.pointerWidth, pointer.pointerWidth));
                    }
                }
                else {
                    if (!roundRadius) {
                        element.setAttribute('d', getCompleteArc(this.gauge.midPoint, linear(arg.timeStamp, startAngle, sweepAngle, arg.duration), minAngle + 0.0001, radius, innerRadius));
                    }
                    else {
                        sweepAngle += roundRadius;
                        element.setAttribute('d', getRoundedPathArc(this.gauge.midPoint, linear(arg.timeStamp, Math.floor(oldStart), sweepAngle, arg.duration), Math.floor(oldStart) + 0.0001, linear(arg.timeStamp, Math.floor(minAngle - roundRadius - (roundRadius / 2)), sweepAngle, arg.duration), Math.floor(oldStart + (roundRadius / 2)) + 0.0001, radius, pointer.pointerWidth, pointer.pointerWidth));
                    }
                }
            },
            end: (model) => {
                this.setPointerValue(axis, pointer, end);
                this.gauge.trigger(animationComplete, this.gauge.isBlazor ? {} : { axis: axis, pointer: pointer });
            }
        });
    }
}

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
 * Specifies the CircularGauge Axis Layout
 */
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
    /* tslint:disable:max-func-body-length */
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
            let args = {
                cancel: false, name: radiusCalculate, currentRadius: axis.currentRadius, gauge: this.gauge,
                midPoint: this.gauge.midPoint, axis: axis
            };
            if (this.gauge.isBlazor) {
                const { cancel, name, currentRadius, midPoint } = args;
                args = { cancel, name, currentRadius, midPoint };
            }
            this.gauge.trigger('radiusCalculate', args, () => {
                axis.currentRadius = args.currentRadius;
                this.gauge.midPoint = args.midPoint;
                if (!this.gauge.isBlazor) {
                    this.calculateVisibleLabels(axis);
                }
            });
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
        let interval = axis.visibleRange.interval;
        let max = axis.visibleRange.max;
        for (let i = axis.visibleRange.min; (i <= max && interval); i += interval) {
            roundValue = axis.roundingPlaces ? parseFloat(i.toFixed(axis.roundingPlaces)) : i;
            argsData = {
                cancel: false, name: axisLabelRender, axis: axis,
                text: customLabelFormat ? style.format.replace(new RegExp('{value}', 'g'), format(roundValue)) :
                    format(roundValue),
                value: roundValue
            };
            if (this.gauge.isBlazor) {
                const { axis } = argsData, blazorArgsData = __rest(argsData, ["axis"]);
                argsData = blazorArgsData;
            }
            let axisLabelRenderSuccess = (argsData) => {
                if (!argsData.cancel) {
                    axis.visibleLabels.push(new VisibleLabels(argsData.text, i));
                    if (i === max && this.gauge.isBlazor && document.getElementById(this.gauge.element.id + '_AxesCollection')) {
                        let currentLast = axis.visibleLabels.length ? axis.visibleLabels[axis.visibleLabels.length - 1].value
                            : null;
                        if (currentLast === axis.visibleRange.max || axis.showLastLabel !== true) {
                            this.getMaxLabelWidth(this.gauge, axis);
                            axis.nearSize = axis.nearSize + axis.maxLabelSize.height;
                            axis.farSize = axis.farSize + axis.maxLabelSize.height;
                            this.axisRenderer.drawAxisLabels(axis, this.gauge.axes.length - 1, (document.getElementById(this.gauge.element.id + '_Axis_Group_' + (this.gauge.axes.length - 1))), this.gauge);
                        }
                    }
                }
            };
            axisLabelRenderSuccess.bind(this);
            this.gauge.trigger(axisLabelRender, argsData, axisLabelRenderSuccess);
        }
        let lastLabel = axis.visibleLabels.length ? axis.visibleLabels[axis.visibleLabels.length - 1].value : null;
        let maxVal = axis.visibleRange.max;
        if (!isNullOrUndefined(lastLabel) && lastLabel !== maxVal && axis.showLastLabel === true) {
            argsData = {
                cancel: false, name: axisLabelRender, axis: axis,
                text: customLabelFormat ? style.format.replace(new RegExp('{value}', 'g'), format(maxVal)) :
                    format(maxVal),
                value: maxVal
            };
            if (this.gauge.isBlazor) {
                const { axis } = argsData, blazorArgsData = __rest(argsData, ["axis"]);
                argsData = blazorArgsData;
            }
            let axisLabelRenderSuccess = (argsData) => {
                if (!argsData.cancel) {
                    axis.visibleLabels.push(new VisibleLabels(argsData.text, maxVal));
                    if (this.gauge.isBlazor && document.getElementById(this.gauge.element.id + '_AxesCollection')) {
                        this.getMaxLabelWidth(this.gauge, axis);
                        axis.farSize = axis.farSize + axis.maxLabelSize.height;
                        axis.nearSize = axis.nearSize + axis.maxLabelSize.height;
                        this.axisRenderer.drawAxisLabels(axis, this.gauge.axes.length - 1, (document.getElementById(this.gauge.element.id + '_Axis_Group_' + (this.gauge.axes.length - 1))), this.gauge);
                    }
                }
            };
            axisLabelRenderSuccess.bind(this);
            this.gauge.trigger(axisLabelRender, argsData, axisLabelRenderSuccess);
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
        let heightForCross;
        let axisPadding = 5;
        let majorTickOffset = 0;
        let minorTickOffset = 0;
        let labelOffset = 0;
        let labelPadding = 10;
        this.farSizes = [];
        this.calculateAxisValues(rect);
        for (let axis of axes) {
            lineSize = (axis.lineStyle.width / 2);
            outerHeight = 0;
            innerHeight = 0;
            heightForCross = axis.majorTicks.position === 'Cross' ? axis.majorTicks.height / 2 : heightForCross;
            heightForCross = (axis.minorTicks.position === 'Cross' && heightForCross < axis.minorTicks.height / 2) ?
                axis.minorTicks.height / 2 : heightForCross;
            heightForCross = (axis.labelStyle.position === 'Cross' && heightForCross < axis.maxLabelSize.height / 2) ?
                axis.maxLabelSize.height / 2 : heightForCross;
            lineSize = lineSize < heightForCross ? heightForCross : lineSize;
            majorTickOffset = axis.majorTicks.offset;
            minorTickOffset = axis.minorTicks.offset;
            labelOffset = axis.labelStyle.offset;
            labelPadding = axis.labelStyle.shouldMaintainPadding ? 10 : 0;
            // Calculating the outer space of the axis
            outerHeight += !(axis.majorTicks.position === 'Outside' && axis.minorTicks.position === 'Outside' &&
                axis.labelStyle.position === 'Outside') ? axisPadding : 0;
            outerHeight += (axis.majorTicks.position === 'Outside' ? (axis.majorTicks.height + lineSize) : 0) +
                (axis.labelStyle.position === 'Outside' ? (axis.maxLabelSize.height + labelOffset + labelPadding) : 0) +
                ((axis.minorTicks.position === 'Outside' && !(axis.majorTicks.position === 'Outside')) ?
                    (axis.minorTicks.height + lineSize) : 0) + lineSize;
            outerHeight += (axis.majorTicks.position === 'Outside' && axis.minorTicks.position === 'Outside') ?
                Math.max(majorTickOffset, minorTickOffset) : (axis.majorTicks.position === 'Outside' ?
                majorTickOffset : axis.minorTicks.position === 'Outside' ? minorTickOffset : 0);
            // Calculating the inner space of the axis
            innerHeight += ((axis.majorTicks.position === 'Inside') ? (axis.majorTicks.height + lineSize) : 0) +
                ((axis.labelStyle.position === 'Inside') ? (axis.maxLabelSize.height + labelOffset + labelPadding) : 0) +
                ((axis.minorTicks.position === 'Inside' && axis.majorTicks.position === 'Outside') ?
                    (axis.minorTicks.height + lineSize) : 0) + lineSize;
            innerHeight += ((axis.majorTicks.position === 'Inside') && (axis.minorTicks.position === 'Inside')) ?
                Math.max(majorTickOffset, minorTickOffset) : ((axis.majorTicks.position === 'Inside') ?
                majorTickOffset : (axis.minorTicks.position === 'Inside') ? minorTickOffset : 0);
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

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Sets and gets the location of the legend in circular gauge.
 */
class Location extends ChildProperty {
}
__decorate$3([
    Property(0)
], Location.prototype, "x", void 0);
__decorate$3([
    Property(0)
], Location.prototype, "y", void 0);
/**
 * Sets and gets the options to customize the legend for the ranges in the circular gauge.
 */
class LegendSettings extends ChildProperty {
}
__decorate$3([
    Property(false)
], LegendSettings.prototype, "visible", void 0);
__decorate$3([
    Property(true)
], LegendSettings.prototype, "toggleVisibility", void 0);
__decorate$3([
    Property('Center')
], LegendSettings.prototype, "alignment", void 0);
__decorate$3([
    Complex({}, Border)
], LegendSettings.prototype, "border", void 0);
__decorate$3([
    Complex({}, Border)
], LegendSettings.prototype, "shapeBorder", void 0);
__decorate$3([
    Property(8)
], LegendSettings.prototype, "padding", void 0);
__decorate$3([
    Property(1)
], LegendSettings.prototype, "opacity", void 0);
__decorate$3([
    Property('Auto')
], LegendSettings.prototype, "position", void 0);
__decorate$3([
    Property('Circle')
], LegendSettings.prototype, "shape", void 0);
__decorate$3([
    Property(null)
], LegendSettings.prototype, "height", void 0);
__decorate$3([
    Property(null)
], LegendSettings.prototype, "width", void 0);
__decorate$3([
    Complex(Theme.legendLabelFont, Font)
], LegendSettings.prototype, "textStyle", void 0);
__decorate$3([
    Property(10)
], LegendSettings.prototype, "shapeHeight", void 0);
__decorate$3([
    Property(10)
], LegendSettings.prototype, "shapeWidth", void 0);
__decorate$3([
    Property(5)
], LegendSettings.prototype, "shapePadding", void 0);
__decorate$3([
    Complex({ x: 0, y: 0 }, Location)
], LegendSettings.prototype, "location", void 0);
__decorate$3([
    Property('transparent')
], LegendSettings.prototype, "background", void 0);
__decorate$3([
    Complex({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
], LegendSettings.prototype, "margin", void 0);
/*
 * Sets and gets the module to add the legend in the circular gauge.
 */
class Legend {
    constructor(gauge) {
        this.legendRegions = [];
        this.rowCount = 0; // legend row counts per page
        this.pageButtonSize = 8;
        this.pageXCollections = []; // pages of x locations
        this.maxColumns = 0;
        this.maxWidth = 0;
        this.currentPage = 1;
        this.pagingRegions = [];
        /**  @private */
        this.position = 'Auto';
        this.gauge = gauge;
        this.toggledIndexes = [];
        this.legend = this.gauge.legendSettings;
        this.legendID = this.gauge.element.id + '_gauge_legend';
        this.addEventListener();
    }
    /**
     * Binding events for legend module.
     */
    addEventListener() {
        if (this.gauge.isDestroyed) {
            return;
        }
        //   this.gauge.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.gauge.on('click', this.click, this);
        // this.gauge.on(Browser.touchEndEvent, this.mouseEnd, this);
    }
    /**
     * UnBinding events for legend module.
     */
    removeEventListener() {
        if (this.gauge.isDestroyed) {
            return;
        }
        //  this.gauge.off(Browser.touchMoveEvent, this.mouseMove);
        this.gauge.off('click', this.click);
        //  this.gauge.off(Browser.touchEndEvent, this.mouseEnd);
    }
    /**
     * Get the legend options.
     * @return {void}
     * @private
     */
    getLegendOptions(axes) {
        this.legendCollection = [];
        let range;
        let text = '';
        for (let i = 0; i < axes.length; i++) {
            for (let j = 0; j < axes[i].ranges.length; j++) {
                range = axes[i].ranges[j];
                if (!isNullOrUndefined(range.start) && !isNullOrUndefined(range.end) && (range.start !== range.end)) {
                    text = range.legendText ? range.legendText : range.start + ' - ' + range.end;
                    this.legendCollection.push(new LegendOptions(text, text, range.color, this.legend.shape, this.legend.visible, this.legend.border, this.legend.shapeBorder, this.legend.shapeWidth, this.legend.shapeHeight, j, i));
                }
            }
        }
    }
    /* tslint:disable-next-line:max-func-body-length */
    calculateLegendBounds(rect, availableSize) {
        let legend = this.legend;
        this.position = (legend.position !== 'Auto') ? legend.position :
            (availableSize.width > availableSize.height ? 'Right' : 'Bottom');
        this.legendBounds = new Rect(rect.x, rect.y, 0, 0);
        this.isVertical = (this.position === 'Left' || this.position === 'Right');
        if (this.isVertical) {
            this.legendBounds.height = stringToNumber(legend.height, availableSize.height - (rect.y - this.gauge.margin.top)) || rect.height;
            this.legendBounds.width = stringToNumber(legend.width || '20%', availableSize.width);
        }
        else {
            this.legendBounds.width = stringToNumber(legend.width, availableSize.width) || rect.width;
            this.legendBounds.height = stringToNumber(legend.height || '20%', availableSize.height);
        }
        this.getLegendBounds(availableSize, this.legendBounds, legend);
        this.getLocation(this.position, legend.alignment, this.legendBounds, rect, availableSize);
    }
    /**
     * To find legend alignment for chart and accumulation chart
     */
    alignLegend(start, size, legendSize, alignment) {
        switch (alignment) {
            case 'Far':
                start = (size - legendSize) - start;
                break;
            case 'Center':
                start = ((size - legendSize) / 2);
                break;
        }
        return start;
    }
    /**
     * To find legend location based on position, alignment for chart and accumulation chart
     */
    getLocation(position, alignment, legendBounds, rect, availableSize) {
        let padding = this.legend.border.width;
        let legendHeight = legendBounds.height + padding + this.legend.margin.top + this.legend.margin.bottom;
        let legendWidth = legendBounds.width + padding + this.legend.margin.left + this.legend.margin.right;
        let marginBottom = this.gauge.margin.bottom;
        if (position === 'Bottom') {
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            legendBounds.y = rect.y + (rect.height - legendHeight) + padding + this.legend.margin.top;
            this.subtractThickness(rect, 0, 0, 0, legendHeight);
        }
        else if (position === 'Top') {
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            legendBounds.y = rect.y + padding + this.legend.margin.top;
            this.subtractThickness(rect, 0, 0, legendHeight, 0);
        }
        else if (position === 'Right') {
            legendBounds.x = rect.x + (rect.width - legendBounds.width) + this.legend.margin.right;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom), legendBounds.height, alignment);
            this.subtractThickness(rect, 0, legendWidth, 0, 0);
        }
        else {
            legendBounds.x = legendBounds.x + this.legend.margin.left;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom), legendBounds.height, alignment);
            this.subtractThickness(rect, legendWidth, 0, 0, 0);
        }
    }
    /**
     * Renders the legend.
     * @return {void}
     * @private
     */
    renderLegend(legend, legendBounds, redraw) {
        let firstLegend = this.findFirstLegendPosition(this.legendCollection);
        let padding = legend.padding;
        this.legendRegions = [];
        this.maxItemHeight = Math.max(this.legendCollection[0].textSize.height, legend.shapeHeight);
        let legendGroup = this.gauge.renderer.createGroup({ id: this.legendID + '_g' });
        let legendTranslateGroup = this.createLegendElements(legendBounds, legendGroup, legend, this.legendID, redraw);
        if (firstLegend !== this.legendCollection.length) {
            this.totalPages = 0;
            let legendAxisGroup; // legendItem group for each series group element
            let start; // starting shape center x,y position && to resolve lint error used new line for declaration
            start = new GaugeLocation(legendBounds.x + padding + (legend.shapeWidth / 2), legendBounds.y + padding + this.maxItemHeight / 2);
            let textOptions = new TextOption('', start.x, start.y, 'start');
            let textPadding = (2 * legend.shapePadding) + (2 * padding) + legend.shapeWidth;
            let count = 0;
            this.pageXCollections = [];
            this.legendCollection[firstLegend].location = start;
            let previousLegend = this.legendCollection[firstLegend];
            for (let legendOption of this.legendCollection) {
                if (legendOption.render && legendOption.text !== '') {
                    legendAxisGroup = this.gauge.renderer.createGroup({
                        id: this.legendID + '_g_' + count
                    });
                    this.getRenderPoint(legendOption, start, textPadding, previousLegend, legendBounds, count, firstLegend);
                    this.renderSymbol(legendOption, legendAxisGroup, legendOption.axisIndex, legendOption.rangeIndex);
                    this.renderText(legendOption, legendAxisGroup, textOptions, legendOption.axisIndex, legendOption.rangeIndex);
                    if (legendAxisGroup) {
                        legendAxisGroup.setAttribute('style', 'cursor: ' + ((!legend.toggleVisibility) ? 'auto' : 'pointer'));
                    }
                    if (legendTranslateGroup) {
                        legendTranslateGroup.appendChild(legendAxisGroup);
                    }
                    previousLegend = legendOption;
                }
                count++;
            }
            if (this.isPaging) {
                this.renderPagingElements(legendBounds, textOptions, legendGroup);
            }
            else {
                this.totalPages = 1;
            }
        }
        this.appendChildElement(this.gauge.svgObject, legendGroup, redraw);
        this.setStyles(this.toggledIndexes);
    }
    /**
     * To render legend paging elements for chart and accumulation chart
     */
    renderPagingElements(bounds, textOption, legendGroup) {
        let paginggroup = this.gauge.renderer.createGroup({ id: this.legendID + '_navigation' });
        this.pagingRegions = [];
        legendGroup.appendChild(paginggroup);
        let grayColor = '#545454';
        let legend = this.gauge.legendSettings; // to solve parameter lint error, legend declaration is here
        let padding = 8; // const padding for paging elements
        if (!this.isVertical) {
            this.totalPages = Math.ceil(this.totalPages / Math.max(1, this.rowCount - 1));
        }
        else {
            this.totalPages = Math.ceil(this.totalPages / this.maxColumns);
        }
        let symbolOption = new PathOption(this.legendID + '_pageup', 'transparent', 5, grayColor, 1, '', '');
        let iconSize = this.pageButtonSize;
        if (paginggroup) {
            paginggroup.setAttribute('style', 'cursor: pointer');
        }
        // Page left arrow drawing calculation started here
        this.clipPathHeight = (this.rowCount - 1) * (this.maxItemHeight + legend.padding);
        this.clipRect.setAttribute('height', this.clipPathHeight.toString());
        let x = bounds.x + iconSize / 2;
        let y = bounds.y + this.clipPathHeight + ((bounds.height - this.clipPathHeight) / 2);
        let size = measureText(this.totalPages + '/' + this.totalPages, legend.textStyle);
        appendPath(calculateShapes({ x: x, y: y }, 'LeftArrow', new Size(iconSize, iconSize), '', symbolOption), paginggroup, this.gauge, 'Path');
        this.pagingRegions.push(new Rect(x + bounds.width - (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5, y - iconSize * 0.5, iconSize, iconSize));
        // Page numbering rendering calculation started here
        textOption.x = x + (iconSize / 2) + padding;
        textOption.y = y + (size.height / 4);
        textOption.id = this.legendID + '_pagenumber';
        textOption.text = '1/' + this.totalPages;
        let pageTextElement = textElement(textOption, legend.textStyle, legend.textStyle.color || this.gauge.themeStyle.labelColor, paginggroup);
        x = (textOption.x + padding + (iconSize / 2) + size.width);
        symbolOption.id = this.legendID + '_pagedown';
        appendPath(calculateShapes({ x: x, y: y }, 'RightArrow', new Size(iconSize, iconSize), '', symbolOption), paginggroup, this.gauge, 'Path');
        this.pagingRegions.push(new Rect(x + (bounds.width - (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5), y - iconSize * 0.5, iconSize, iconSize));
        //placing the navigation buttons and page numbering in legend right corner
        paginggroup.setAttribute('transform', 'translate(' + (bounds.width - (2 * (iconSize + padding) +
            padding + size.width)) + ', ' + 0 + ')');
        this.translatePage(pageTextElement, this.currentPage - 1, this.currentPage);
    }
    /**
     * To translate legend pages for chart and accumulation chart
     */
    translatePage(pagingText, page, pageNumber) {
        let size = (this.clipPathHeight) * page;
        let translate = 'translate(0,-' + size + ')';
        if (this.isVertical) {
            let pageLength = page * this.maxColumns;
            size = this.pageXCollections[page * this.maxColumns] - this.legendBounds.x;
            size = size < 0 ? 0 : size; // to avoid small pixel variation
            translate = 'translate(-' + size + ',0)';
        }
        this.legendTranslateGroup.setAttribute('transform', translate);
        pagingText.textContent = (pageNumber) + '/' + this.totalPages;
        this.currentPage = pageNumber;
        return size;
    }
    /**
     * To render legend text for chart and accumulation chart
     */
    renderText(legendOption, group, textOptions, axisIndex, rangeIndex) {
        let legend = this.gauge.legendSettings;
        let hiddenColor = '#D3D3D3';
        textOptions.id = this.legendID + '_Axis_' + axisIndex + '_text_' + rangeIndex;
        let fontcolor = legendOption.visible ? legend.textStyle.color || this.gauge.themeStyle.labelColor : hiddenColor;
        textOptions.text = legendOption.text;
        textOptions.x = legendOption.location.x + (legend.shapeWidth / 2) + legend.shapePadding;
        textOptions.y = legendOption.location.y + this.maxItemHeight / 4;
        let element = textElement(textOptions, legend.textStyle, fontcolor, group, '');
    }
    /**
     * To render legend symbols for chart and accumulation chart
     */
    renderSymbol(legendOption, group, axisIndex, rangeIndex) {
        legendOption.fill = legendOption.fill ? legendOption.fill : this.gauge.axes[axisIndex].ranges[rangeIndex].rangeColor;
        appendPath(calculateShapes(legendOption.location, legendOption.shape, new Size(legendOption.shapeWidth, legendOption.shapeHeight), '', new PathOption(this.legendID + '_Axis_' + axisIndex + '_Shape_' + rangeIndex, legendOption.fill, legendOption.shapeBorder.width, legendOption.shapeBorder.color, null, '0', '', '')), group, this.gauge, legendOption.shape === 'Circle' ? 'Ellipse' : 'Path');
    }
    /**
     * To find legend rendering locations from legend options.
     * @private
     */
    getRenderPoint(legendOption, start, textPadding, prevLegend, rect, count, firstLegend) {
        let padding = this.legend.padding;
        if (this.isVertical) {
            if (count === firstLegend || (prevLegend.location.y + (this.maxItemHeight * 1.5) + (padding * 2) > rect.y + rect.height)) {
                legendOption.location.x = prevLegend.location.x + ((count === firstLegend) ? 0 : this.maxColumnWidth);
                legendOption.location.y = start.y;
                this.pageXCollections.push(legendOption.location.x - (this.legend.shapeWidth / 2) - padding);
                this.totalPages++;
            }
            else {
                legendOption.location.x = prevLegend.location.x;
                legendOption.location.y = prevLegend.location.y + this.maxItemHeight + padding;
            }
        }
        else {
            let previousBound = (prevLegend.location.x + textPadding + prevLegend.textSize.width);
            if ((previousBound + (legendOption.textSize.width + textPadding)) > (rect.x + rect.width + this.legend.shapeWidth / 2)) {
                legendOption.location.y = (count === firstLegend) ? prevLegend.location.y :
                    prevLegend.location.y + this.maxItemHeight + padding;
                legendOption.location.x = start.x;
            }
            else {
                legendOption.location.y = prevLegend.location.y;
                legendOption.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            }
            this.totalPages = this.totalRowCount;
        }
        let availablewidth = this.getAvailWidth(legendOption.location.x, this.legendBounds.width, this.legendBounds.x);
        legendOption.text = textTrim(+availablewidth.toFixed(4), legendOption.text, this.legend.textStyle);
    }
    /**
     * To show or hide the legend on clicking the legend.
     * @return {void}
     */
    click(event) {
        let targetId = event.target.id;
        let legendItemsId = ['_text_', '_Shape_'];
        let index;
        let toggledIndex = -1;
        if (targetId.indexOf(this.legendID) > -1) {
            for (let id of legendItemsId) {
                if (targetId.indexOf(id) > -1) {
                    let axisIndex = parseInt(targetId.split(this.legendID + '_Axis_')[1].split(id)[0], 10);
                    let rangeIndex = parseInt(targetId.split(this.legendID + '_Axis_')[1].split(id)[1], 10);
                    if (this.gauge.legendSettings.toggleVisibility && !isNaN(rangeIndex)) {
                        let legendOption = this.legendByIndex(axisIndex, rangeIndex, this.legendCollection);
                        index = new Index(axisIndex, rangeIndex, !legendOption.render);
                        if (this.toggledIndexes.length === 0) {
                            this.toggledIndexes.push(index);
                        }
                        else {
                            for (let i = 0; i < this.toggledIndexes.length; i++) {
                                if (this.toggledIndexes[i].axisIndex === index.axisIndex &&
                                    this.toggledIndexes[i].rangeIndex === index.rangeIndex) {
                                    toggledIndex = i;
                                    break;
                                }
                                else {
                                    toggledIndex = -1;
                                }
                            }
                            if (toggledIndex === -1) {
                                this.toggledIndexes.push(index);
                            }
                            else {
                                this.toggledIndexes[toggledIndex].isToggled = !this.toggledIndexes[toggledIndex].isToggled;
                            }
                        }
                        this.setStyles(this.toggledIndexes);
                    }
                }
            }
        }
        if (targetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        }
        else if (targetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        }
    }
    /**
     * Set toggled legend styles.
     */
    setStyles(toggledIndexes) {
        for (let i = 0; i < toggledIndexes.length; i++) {
            let rangeID = this.gauge.element.id + '_Axis_' + toggledIndexes[i].axisIndex + '_Range_' + toggledIndexes[i].rangeIndex;
            let shapeID = this.legendID + '_Axis_' + toggledIndexes[i].axisIndex + '_Shape_' + toggledIndexes[i].rangeIndex;
            let textID = this.legendID + '_Axis_' + toggledIndexes[i].axisIndex + '_text_' + toggledIndexes[i].rangeIndex;
            let rangeElement = this.gauge.svgObject.querySelector('#' + rangeID);
            let shapeElement = this.gauge.svgObject.querySelector('#' + shapeID);
            let textElement$$1 = this.gauge.svgObject.querySelector('#' + textID);
            if (toggledIndexes[i].isToggled) {
                rangeElement.style.visibility = 'visible';
                shapeElement.setAttribute('fill', this.legendCollection[toggledIndexes[i].rangeIndex].fill);
                textElement$$1.setAttribute('fill', this.legend.textStyle.color || this.gauge.themeStyle.labelColor);
            }
            else {
                let hiddenColor = '#D3D3D3';
                rangeElement.style.visibility = 'hidden';
                shapeElement.setAttribute('fill', hiddenColor);
                textElement$$1.setAttribute('fill', hiddenColor);
            }
        }
    }
    /**
     * To get legend by index
     */
    legendByIndex(axisIndex, rangeIndex, legendCollections) {
        for (let legend of legendCollections) {
            if (legend.axisIndex === axisIndex && legend.rangeIndex === rangeIndex) {
                return legend;
            }
        }
        return null;
    }
    /**
     * To change legend pages for chart and accumulation chart
     */
    changePage(event, pageUp) {
        let pageText = document.getElementById(this.legendID + '_pagenumber');
        let page = parseInt(pageText.textContent.split('/')[0], 10);
        if (pageUp && page > 1) {
            this.translatePage(pageText, (page - 2), (page - 1));
        }
        else if (!pageUp && page < this.totalPages) {
            this.translatePage(pageText, page, (page + 1));
        }
    }
    /**
     * To find available width from legend x position.
     */
    getAvailWidth(tx, width, legendX) {
        if (this.isVertical) {
            width = this.maxWidth;
        }
        return width - ((this.legend.padding * 2) + this.legend.shapeWidth + this.legend.shapePadding);
    }
    /**
     * To create legend rendering elements for chart and accumulation chart
     */
    createLegendElements(legendBounds, legendGroup, legend, id, redraw) {
        let padding = legend.padding;
        let options = new RectOption(id + '_element', legend.background, legend.border, legend.opacity, legendBounds);
        options.width = this.isVertical ? this.maxWidth : legendBounds.width;
        legendGroup ? legendGroup.appendChild(this.gauge.renderer.drawRectangle(options)) : this.gauge.renderer.drawRectangle(options);
        let legendItemsGroup = this.gauge.renderer.createGroup({ id: id + '_collections' });
        legendGroup.appendChild(legendItemsGroup);
        this.legendTranslateGroup = this.gauge.renderer.createGroup({ id: id + '_translate_g' });
        legendItemsGroup.appendChild(this.legendTranslateGroup);
        let clippath = this.gauge.renderer.createClipPath({ id: id + '_clipPath' });
        options.id += '_clipPath_rect';
        options.width = this.isVertical ? options.width - padding : options.width;
        this.clipRect = this.gauge.renderer.drawRectangle(options);
        clippath.appendChild(this.clipRect);
        this.appendChildElement(this.gauge.svgObject, clippath, redraw);
        legendItemsGroup.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
        return this.legendTranslateGroup;
    }
    /**
     * Method to append child element
     */
    appendChildElement(parent, childElement, redraw, isAnimate = false, x = 'x', y = 'y', start, direction, forceAnimate = false, isRect = false, previousRect = null, animateDuration) {
        let existChild = parent.querySelector('#' + childElement.id);
        let element = (existChild || getElement(childElement.id));
        let child = childElement;
        if (existChild) {
            parent.replaceChild(child, element);
        }
        else {
            parent.appendChild(child);
        }
    }
    /**
     * To find first valid legend text index for chart and accumulation chart
     */
    findFirstLegendPosition(legendCollection) {
        let count = 0;
        for (let legend of legendCollection) {
            if (legend.render && legend.text !== '') {
                break;
            }
            count++;
        }
        return count;
    }
    /**
     * To find legend bounds for accumulation chart.
     * @private
     */
    getLegendBounds(availableSize, legendBounds, legend) {
        let extraWidth = 0;
        let extraHeight = 0;
        let padding = legend.padding;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        }
        else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }
        legendBounds.width += extraWidth;
        legendBounds.height += extraHeight;
        let maximumWidth = 0;
        let rowWidth = 0;
        let rowCount = 0;
        let columnWidth = [];
        let columnHeight = 0;
        let legendWidth = 0;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle).height, legend.shapeHeight);
        let legendEventArgs;
        let render = false;
        for (let legendOption of this.legendCollection) {
            legendEventArgs = {
                fill: legendOption.fill, text: legendOption.text, shape: legendOption.shape,
                name: 'legendRender', cancel: false
            };
            this.gauge.trigger('legendRender', legendEventArgs);
            legendOption.render = !legendEventArgs.cancel;
            legendOption.text = legendEventArgs.text;
            legendOption.fill = legendEventArgs.fill;
            legendOption.shape = legendEventArgs.shape;
            legendOption.textSize = measureText(legendOption.text, legend.textStyle);
            if (legendOption.render && legendOption.text !== '') {
                render = true;
                legendWidth = legend.shapeWidth + (2 * legend.shapePadding) + legendOption.textSize.width + (2 * padding);
                if (this.isVertical) {
                    ++rowCount;
                    columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding;
                    if ((rowCount * (this.maxItemHeight + padding)) + padding > legendBounds.height) {
                        columnHeight = Math.max(columnHeight, (rowCount * (this.maxItemHeight + padding)) + padding);
                        rowWidth = rowWidth + maximumWidth;
                        columnWidth.push(maximumWidth);
                        this.totalPages = Math.max(rowCount, this.totalPages || 1);
                        maximumWidth = 0;
                        rowCount = 1;
                    }
                    maximumWidth = Math.max(legendWidth, maximumWidth);
                }
                else {
                    rowWidth = rowWidth + legendWidth;
                    if (legendBounds.width < (padding + rowWidth)) {
                        maximumWidth = Math.max(maximumWidth, (rowWidth + padding - legendWidth));
                        if (rowCount === 0 && (legendWidth !== rowWidth)) {
                            rowCount = 1;
                        }
                        rowWidth = legendWidth;
                        rowCount++;
                        columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding;
                    }
                }
            }
        }
        if (this.isVertical) {
            rowWidth = rowWidth + maximumWidth;
            this.isPaging = legendBounds.width < (rowWidth + padding);
            columnHeight = Math.max(columnHeight, ((this.totalPages || 1) * (this.maxItemHeight + padding)) + padding);
            this.isPaging = this.isPaging && (this.totalPages > 1);
            if (columnWidth[columnWidth.length - 1] !== maximumWidth) {
                columnWidth.push(maximumWidth);
            }
        }
        else {
            this.isPaging = legendBounds.height < columnHeight;
            this.totalPages = this.totalRowCount = rowCount;
            columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding);
        }
        this.maxColumns = 0; // initialization for max columns
        let width = this.isVertical ? this.getMaxColumn(columnWidth, legendBounds.width, padding, rowWidth + padding) :
            Math.max(rowWidth + padding, maximumWidth);
        if (render) { // if any legends not skipped in event check
            this.setBounds(width, columnHeight, legend, legendBounds);
        }
        else {
            this.setBounds(0, 0, legend, legendBounds);
        }
    }
    /** @private */
    subtractThickness(rect, left, right, top, bottom) {
        rect.x += left;
        rect.y += top;
        rect.width -= left + right;
        rect.height -= top + bottom;
        return rect;
    }
    /**
     * To set bounds for chart and accumulation chart
     */
    setBounds(computedWidth, computedHeight, legend, legendBounds) {
        computedWidth = computedWidth < legendBounds.width ? computedWidth : legendBounds.width;
        computedHeight = computedHeight < legendBounds.height ? computedHeight : legendBounds.height;
        legendBounds.width = !legend.width ? computedWidth : legendBounds.width;
        legendBounds.height = !legend.height ? computedHeight : legendBounds.height;
        this.rowCount = Math.max(1, Math.ceil((legendBounds.height - legend.padding) / (this.maxItemHeight + legend.padding)));
    }
    /**
     * To find maximum column size for legend
     */
    getMaxColumn(columns, width, padding, rowWidth) {
        let maxPageColumn = padding;
        this.maxColumnWidth = Math.max.apply(null, columns);
        for (let column of columns) {
            maxPageColumn += this.maxColumnWidth;
            this.maxColumns++;
            if (maxPageColumn + padding > width) {
                maxPageColumn -= this.maxColumnWidth;
                this.maxColumns--;
                break;
            }
        }
        this.isPaging = (maxPageColumn < rowWidth) && (this.totalPages > 1);
        if (maxPageColumn === padding) {
            maxPageColumn = width;
        }
        this.maxColumns = Math.max(1, this.maxColumns);
        this.maxWidth = maxPageColumn;
        return maxPageColumn;
    }
    /**
     * To show or hide trimmed text tooltip for legend.
     * @return {void}
     * @private
     */
    move(event) {
        let x = this.gauge.mouseX;
        let y = this.gauge.mouseY;
        let targetId = event.target.id;
        if (event.target.textContent.indexOf('...') > -1 && targetId.indexOf('_gauge_legend_') > -1) {
            let axisIndex = parseInt(targetId.split(this.gauge.element.id + '_gauge_legend_Axis_')[1].split('_text_')[0], 10);
            let rangeIndex = parseInt(targetId.split(this.gauge.element.id + '_gauge_legend_Axis_')[1].split('_text_')[1], 10);
            let text = '';
            for (let legends of this.legendCollection) {
                if (legends.rangeIndex === rangeIndex && legends.axisIndex === axisIndex) {
                    text = legends.originalText;
                }
            }
            showTooltip(text, x, y, this.gauge.element.offsetWidth, this.gauge.element.id + '_EJ2_Legend_Tooltip', getElement(this.gauge.element.id + '_Secondary_Element'));
        }
        else {
            removeElement(this.gauge.element.id + '_EJ2_Legend_Tooltip');
        }
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
    destroy(circulargauge) {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    }
}
/**
 * @private
 */
class Index {
    constructor(axisIndex, rangeIndex, isToggled) {
        this.axisIndex = axisIndex;
        this.rangeIndex = rangeIndex;
        this.isToggled = isToggled;
    }
}
/**
 * Class for legend options
 * @private
 */
class LegendOptions {
    constructor(text, originalText, fill, shape, visible, border, shapeBorder, shapeWidth, shapeHeight, rangeIndex, axisIndex) {
        this.location = { x: 0, y: 0 };
        this.text = text;
        this.originalText = originalText;
        this.fill = fill;
        this.shape = shape;
        this.visible = visible;
        this.border = border;
        this.shapeBorder = shapeBorder;
        this.shapeWidth = shapeWidth;
        this.shapeHeight = shapeHeight;
        this.rangeIndex = rangeIndex;
        this.axisIndex = axisIndex;
    }
}

/**
 * Represent the Pdf export for gauge
 * @hidden
 */
class PdfExport {
    /**
     * Constructor for gauge
     * @param control
     */
    constructor(control) {
        this.control = control;
    }
    /**
     * To export the file as image/svg format
     * @param type
     * @param fileName
     * @param orientation
     * @param allowDownload
     * @private
     */
    export(type, fileName, orientation, allowDownload) {
        let promise = new Promise((resolve, reject) => {
            let element = createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': this.control.availableSize.width.toString(),
                    'height': this.control.availableSize.height.toString()
                }
            });
            let isDownload = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            orientation = isNullOrUndefined(orientation) ? PdfPageOrientation.Landscape : orientation;
            let url = window.URL.createObjectURL(new Blob([(new XMLSerializer()).serializeToString(this.control.svgObject)], { type: 'image/svg+xml' }));
            let image = new Image();
            let context = element.getContext('2d');
            image.onload = (() => {
                context.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                let document = new PdfDocument();
                let imageString = element.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
                document.pageSettings.orientation = orientation;
                imageString = imageString.slice(imageString.indexOf(',') + 1);
                document.pages.add().graphics.
                    drawImage(new PdfBitmap(imageString), 0, 0, this.control.availableSize.width, this.control.availableSize.height);
                if (allowDownload) {
                    document.save(fileName + '.pdf');
                    document.destroy();
                }
                else {
                    resolve(null);
                }
            });
            image.src = url;
        });
        return promise;
    }
    getModuleName() {
        // Returns te module name
        return 'PdfExport';
    }
    /**
     * To destroy the PdfExport.
     * @return {void}
     * @private
     */
    destroy(gauge) {
        // Destroy method performed here
    }
}

/**
 * Represent the Image Export for gauge
 * @hidden
 */
class ImageExport {
    /**
     * Constructor for gauge
     * @param control
     */
    constructor(control) {
        this.control = control;
    }
    /**
     * To export the file as image/svg format
     * @param type
     * @param fileName
     * @param allowDownload
     * @private
     */
    export(type, fileName, allowDownload) {
        let promise = new Promise((resolve, reject) => {
            let isDownload = !(Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
            let element = createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': this.control.availableSize.width.toString(),
                    'height': this.control.availableSize.height.toString()
                }
            });
            let svgData = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                this.control.svgObject.outerHTML +
                '</svg>';
            let url = window.URL.createObjectURL(new Blob(type === 'SVG' ? [svgData] :
                [(new XMLSerializer()).serializeToString(this.control.svgObject)], { type: 'image/svg+xml' }));
            if (type === 'SVG') {
                if (allowDownload) {
                    triggerDownload(fileName, type, url, isDownload);
                }
                else {
                    resolve(null);
                }
            }
            else {
                let image = new Image();
                let context = element.getContext('2d');
                image.onload = (() => {
                    context.drawImage(image, 0, 0);
                    window.URL.revokeObjectURL(url);
                    if (allowDownload) {
                        triggerDownload(fileName, type, element.toDataURL('image/png').replace('image/png', 'image/octet-stream'), isDownload);
                    }
                    else {
                        if (type === 'JPEG') {
                            resolve(element.toDataURL('image/jpeg'));
                        }
                        else if (type === 'PNG') {
                            resolve(element.toDataURL('image/png'));
                        }
                    }
                });
                image.src = url;
            }
        });
        return promise;
    }
    getModuleName() {
        // Returns te module name
        return 'ImageExport';
    }
    /**
     * To destroy the ImageExport.
     * @return {void}
     * @private
     */
    destroy(gauge) {
        // Destroy method performed here
    }
}

/**
 * Represent the print for gauge
 * @hidden
 */
class Print {
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
     * @private
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
    getModuleName() {
        // Returns te module name
        return 'Print';
    }
    /**
     * To destroy the Print.
     * @return {void}
     * @private
     */
    destroy(gauge) {
        // Destroy method performed here
    }
}

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Specifies the color information for the gradient in the circular gauge.
 */
class ColorStop extends ChildProperty {
}
__decorate$4([
    Property('#000000')
], ColorStop.prototype, "color", void 0);
__decorate$4([
    Property(1)
], ColorStop.prototype, "opacity", void 0);
__decorate$4([
    Property('0%')
], ColorStop.prototype, "offset", void 0);
__decorate$4([
    Property('')
], ColorStop.prototype, "style", void 0);
/**
 * Specifies the position in percentage from which the radial gradient must be applied.
 */
class GradientPosition extends ChildProperty {
}
__decorate$4([
    Property('0%')
], GradientPosition.prototype, "x", void 0);
__decorate$4([
    Property('0%')
], GradientPosition.prototype, "y", void 0);
/**
 * This specifies the properties of the linear gradient colors for the circular gauge.
 */
class LinearGradient extends ChildProperty {
}
__decorate$4([
    Property('0%')
], LinearGradient.prototype, "startValue", void 0);
__decorate$4([
    Property('100%')
], LinearGradient.prototype, "endValue", void 0);
__decorate$4([
    Collection([{ color: '#000000', opacity: 1, offset: '0%', style: '' }], ColorStop)
], LinearGradient.prototype, "colorStop", void 0);
/**
 * This specifies the properties of the radial gradient colors for the circular gauge.
 */
class RadialGradient extends ChildProperty {
}
__decorate$4([
    Property('0%')
], RadialGradient.prototype, "radius", void 0);
__decorate$4([
    Complex({ x: '0%', y: '0%' }, GradientPosition)
], RadialGradient.prototype, "outerPosition", void 0);
__decorate$4([
    Complex({ x: '0%', y: '0%' }, GradientPosition)
], RadialGradient.prototype, "innerPosition", void 0);
__decorate$4([
    Collection([{ color: '#000000', opacity: 1, offset: '0%', style: '' }], ColorStop)
], RadialGradient.prototype, "colorStop", void 0);
/**
 * Sets and gets the module that enables the gradient option for pointers and ranges.
 * @hidden
 */
class Gradient {
    /**
     * Constructor for gauge
     * @param gauge
     */
    constructor(gauge) {
        this.gauge = gauge;
    }
    /**
     * To get linear gradient string for pointers and ranges
     * @private
     */
    getLinearGradientColor(element) {
        let render = new SvgRenderer('');
        let colors = this.getGradientColor(element.linearGradient.colorStop);
        let name = '_' + this.gauge.svgObject.id + '_' + this.gauge.gradientCount + '_' + 'linearGradient';
        let gradientPosition = {
            id: name,
            x1: (element.linearGradient.startValue.indexOf('%') === -1 ?
                element.linearGradient.startValue :
                parseFloat(element.linearGradient.startValue).toString()) + '%',
            x2: (element.linearGradient.endValue.indexOf('%') === -1 ?
                element.linearGradient.endValue :
                parseFloat(element.linearGradient.endValue).toString()) + '%',
            y1: '0' + '%',
            y2: '0' + '%'
        };
        let def = render.drawGradient('linearGradient', gradientPosition, colors);
        this.gauge.svgObject.appendChild(def);
        return 'url(#' + name + ')';
    }
    /**
     * To get the radial gradient string.
     * @private
     */
    getRadialGradientColor(element) {
        let render = new SvgRenderer('');
        let colors = this.getGradientColor(element.radialGradient.colorStop);
        let name = '_' + this.gauge.svgObject.id + '_' + this.gauge.gradientCount + '_' + 'radialGradient';
        let gradientPosition = {
            id: name,
            r: (element.radialGradient.radius.indexOf('%') === -1 ?
                element.radialGradient.radius :
                parseFloat(element.radialGradient.radius).toString()) + '%',
            cx: (element.radialGradient.outerPosition.x.indexOf('%') === -1 ?
                element.radialGradient.outerPosition.x :
                parseFloat(element.radialGradient.outerPosition.x).toString()) + '%',
            cy: (element.radialGradient.outerPosition.y.indexOf('%') === -1 ?
                element.radialGradient.outerPosition.y :
                parseFloat(element.radialGradient.outerPosition.y).toString()) + '%',
            fx: (element.radialGradient.innerPosition.x.indexOf('%') === -1 ?
                element.radialGradient.innerPosition.x :
                parseFloat(element.radialGradient.innerPosition.x).toString()) + '%',
            fy: (element.radialGradient.innerPosition.y.indexOf('%') === -1 ?
                element.radialGradient.innerPosition.y :
                parseFloat(element.radialGradient.innerPosition.y).toString()) + '%'
        };
        let def = render.drawGradient('radialGradient', gradientPosition, colors);
        this.gauge.svgObject.appendChild(def);
        return 'url(#' + name + ')';
    }
    /**
     * To get color, opacity, offset and style.
     * @private
     */
    getGradientColor(colorStop) {
        let colors = [];
        for (let j = 0; j < colorStop.length; j++) {
            let color = {
                color: colorStop[j].color,
                colorStop: colorStop[j].offset,
                opacity: colorStop[j].opacity ? colorStop[j].opacity.toString() : '1',
                style: colorStop[j].style,
            };
            colors.push(color);
        }
        return colors;
    }
    /**
     * To get a gradient color string
     * @private
     */
    getGradientColorString(element) {
        let gradientColor;
        if (element.linearGradient || element.radialGradient) {
            if (element.linearGradient) {
                gradientColor = this.getLinearGradientColor(element);
            }
            else {
                gradientColor = this.getRadialGradientColor(element);
            }
            this.gauge.gradientCount = this.gauge.gradientCount + 1;
        }
        else {
            return null;
        }
        return gradientColor;
    }
    getModuleName() {
        // Returns te module name
        return 'Gradient';
    }
    /**
     * To destroy the Gradient.
     * @return {void}
     * @private
     */
    destroy(gauge) {
        // Destroy method performed here
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
 * Represents the circular gauge control.
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
        /** @private */
        this.isDrag = false;
        /**
         * @private
         */
        this.gradientCount = 0;
    }
    /**
     *  To create svg object, renderer and binding events for the container.
     */
    //tslint:disable
    preRender() {
        this.isBlazor = isBlazor();
        this.unWireEvents();
        this.trigger(load, this.isBlazor ? null : { gauge: this });
        this.initPrivateVariable();
        this.setCulture();
        this.createSvg();
        this.wireEvents();
    }
    /**
     * To render the circular gauge elements
     */
    render() {
        this.setTheme();
        this.calculateBounds();
        this.renderElements();
        this.renderComplete();
    }
    setTheme() {
        this.themeStyle = getThemeStyle(this.theme);
    }
    /**
     * Method to unbind events for circular gauge
     */
    unWireEvents() {
        EventHandler.remove(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMove);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'click', this.gaugeOnMouseClick);
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
        EventHandler.add(this.element, 'click', this.gaugeOnMouseClick, this);
        EventHandler.add(this.element, 'contextmenu', this.gaugeRightClick, this);
        EventHandler.add(this.element, (Browser.isPointer ? 'pointerleave' : 'mouseleave'), this.mouseLeave, this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.gaugeResize.bind(this));
        /*! Apply the style for circular gauge */
        this.setGaugeStyle(this.element);
    }
    /**
     * Handles the mouse click on accumulation chart.
     * @return {boolean}
     * @private
     */
    gaugeOnMouseClick(e) {
        this.setMouseXY(e);
        if (this.legendModule && this.legendSettings.visible) {
            this.legendModule.click(e);
        }
        return false;
    }
    /**
     * Handles the mouse move.
     * @return {boolean}
     * @private
     */
    mouseMove(e) {
        this.setMouseXY(e);
        let args = this.getMouseArgs(e, 'touchmove', gaugeMouseMove);
        this.trigger('gaugeMouseMove', args, (observedArgs) => {
            let dragArgs;
            let dragBlazorArgs;
            let tooltip = this.tooltipModule;
            if (!args.cancel) {
                if ((this.enablePointerDrag || this.enableRangeDrag) && this.svgObject.getAttribute('cursor') !== 'grabbing') {
                    if ((args.target.id.indexOf('_Pointer_') !== -1 && this.enablePointerDrag) || (this.enableRangeDrag && args.target.id.indexOf('_Range_') !== -1)) {
                        this.svgObject.setAttribute('cursor', 'pointer');
                    }
                    else {
                        this.svgObject.setAttribute('cursor', 'auto');
                    }
                }
                if (this.enablePointerDrag && this.activePointer) {
                    this.isDrag = true;
                    let dragPointInd = parseInt(this.activePointer.pathElement[0].id.slice(-1), 10);
                    let dragAxisInd = parseInt(this.activePointer.pathElement[0].id.split('_Axis_')[1], 10);
                    dragArgs = {
                        axis: this.activeAxis,
                        pointer: this.activePointer,
                        previousValue: this.activePointer.currentValue,
                        name: dragMove,
                        type: pointerMove,
                        currentValue: null,
                        axisIndex: dragAxisInd,
                        pointerIndex: dragPointInd,
                    };
                    dragBlazorArgs = {
                        previousValue: this.activePointer.currentValue,
                        name: dragMove,
                        type: pointerMove,
                        currentValue: null,
                        pointerIndex: dragPointInd,
                        axisIndex: dragAxisInd,
                    };
                    this.pointerDrag(new GaugeLocation(args.x, args.y), dragAxisInd, dragPointInd);
                    dragArgs.currentValue = dragBlazorArgs.currentValue = this.activePointer.currentValue;
                    this.trigger(dragMove, this.isBlazor ? dragBlazorArgs : dragArgs);
                    this.activeRange = null;
                }
                else if (this.enableRangeDrag && this.activeRange) {
                    this.isDrag = true;
                    let dragAxisInd = parseInt(this.activeRange.pathElement[0].id.split('_Axis_')[1], 10);
                    let dragRangeInd = parseInt(this.activeRange.pathElement[0].id.slice(-1), 10);
                    dragArgs = {
                        axis: this.activeAxis,
                        name: dragMove,
                        type: rangeMove,
                        range: this.activeRange,
                        axisIndex: dragAxisInd,
                        rangeIndex: dragRangeInd,
                    };
                    dragBlazorArgs = {
                        name: dragMove,
                        type: rangeMove,
                        axisIndex: dragAxisInd,
                        rangeIndex: dragRangeInd,
                    };
                    this.rangeDrag(new GaugeLocation(args.x, args.y), dragAxisInd, dragRangeInd);
                    this.trigger(dragMove, this.isBlazor ? dragBlazorArgs : dragArgs);
                }
            }
        });
        if (!this.isTouch) {
            if (this.legendModule && this.legendSettings.visible) {
                this.legendModule.move(e);
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
        this.setMouseXY(e);
        this.activeAxis = null;
        this.activePointer = null;
        this.activeRange = null;
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
    pointerDrag(location, axisIndex, pointerIndex) {
        let axis = this.activeAxis;
        let range = axis.visibleRange;
        let value = getValueFromAngle(getAngleFromLocation(this.midPoint, location), range.max, range.min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise');
        if (value >= range.min && value <= range.max) {
            this.axes[axisIndex].pointers[pointerIndex].value = value;
            this.activePointer.currentValue = value;
            this.gaugeAxisLayoutPanel.pointerRenderer.setPointerValue(axis, this.activePointer, value);
        }
    }
    /**
     * Handles the range draf while mouse move on gauge.
     * @private
     */
    rangeDrag(location, axisIndex, rangeIndex) {
        if (this.activeAxis) {
            let axis = this.activeAxis;
            let range = axis.visibleRange;
            let value;
            value = getValueFromAngle(getAngleFromLocation(this.midPoint, location), range.max, range.min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise');
            if (value >= range.min && value <= range.max) {
                {
                    let previousValue1 = this.activeRange.currentValue;
                    this.activeRange.currentValue = value;
                    let avg;
                    let add = (this.activeRange.end - this.activeRange.start);
                    let div = add / 2;
                    avg = parseFloat(this.activeRange.start.toString()) + div;
                    this.startValue = (value < avg) ? value : ((previousValue1 < avg) ? previousValue1 : this.activeRange.start);
                    this.endValue = (value < avg) ? ((previousValue1 > avg) ? previousValue1 : this.activeRange.end) : value;
                    this.axes[axisIndex].ranges[rangeIndex].start = this.startValue;
                    this.axes[axisIndex].ranges[rangeIndex].end = this.endValue;
                }
            }
        }
    }
    /**
     * Handles the mouse down on gauge.
     * @return {boolean}
     * @private
     */
    gaugeOnMouseDown(e) {
        this.setMouseXY(e);
        let currentPointer;
        let currentRange;
        let args = this.getMouseArgs(e, 'touchstart', gaugeMouseDown);
        this.trigger('gaugeMouseDown', args, (observedArgs) => {
            if (!args.cancel &&
                args.target.id.indexOf(this.element.id + '_Axis_') >= 0 &&
                args.target.id.indexOf('_Pointer_') >= 0) {
                currentPointer = getPointer(args.target.id, this);
                this.activeAxis = this.axes[currentPointer.axisIndex];
                this.activePointer = this.activeAxis.pointers[currentPointer.pointerIndex];
                if (isNullOrUndefined(this.activePointer.pathElement)) {
                    this.activePointer.pathElement = [e.target];
                }
                let pointInd = parseInt(this.activePointer.pathElement[0].id.slice(-1), 10);
                let axisInd = parseInt(this.activePointer.pathElement[0].id.split('_Axis_')[1], 10);
                this.trigger(dragStart, this.isBlazor ? {
                    name: dragStart,
                    type: pointerStart,
                    currentValue: this.activePointer.currentValue,
                    pointerIndex: pointInd,
                    axisIndex: axisInd,
                } : {
                    axis: this.activeAxis,
                    name: dragStart,
                    type: pointerStart,
                    pointer: this.activePointer,
                    currentValue: this.activePointer.currentValue,
                    pointerIndex: pointInd,
                    axisIndex: axisInd,
                });
                if (this.enablePointerDrag) {
                    this.svgObject.setAttribute('cursor', 'grabbing');
                }
            }
            else if (!args.cancel &&
                args.target.id.indexOf(this.element.id + '_Axis_') >= 0 &&
                args.target.id.indexOf('_Range_') >= 0) {
                currentRange = getRange(args.target.id, this);
                this.activeAxis = this.axes[currentRange.axisIndex];
                this.activeRange = this.activeAxis.ranges[currentRange.rangeIndex];
                if (isNullOrUndefined(this.activeRange.pathElement)) {
                    this.activeRange.pathElement = [e.target];
                }
                let rangeInd = parseInt(this.activeRange.pathElement[0].id.slice(-1), 0);
                let axisInd = parseInt(this.activeRange.pathElement[0].id.split('_Axis_')[1], 10);
                this.trigger(dragStart, this.isBlazor ? {
                    name: dragStart,
                    type: rangeStart,
                    axisIndex: axisInd,
                    rangeIndex: rangeInd,
                } : {
                    axis: this.activeAxis,
                    name: dragStart,
                    type: rangeStart,
                    range: this.activeRange,
                    axisIndex: axisInd,
                    rangeIndex: rangeInd,
                });
                if (this.enableRangeDrag) {
                    this.svgObject.setAttribute('cursor', 'grabbing');
                }
            }
        });
        return false;
    }
    /**
     * Handles the mouse end.
     * @return {boolean}
     * @private
     */
    mouseEnd(e) {
        this.setMouseXY(e);
        let args = this.getMouseArgs(e, 'touchend', gaugeMouseUp);
        let blazorArgs = {
            cancel: args.cancel, target: args.target, name: args.name, x: args.x, y: args.y
        };
        this.isTouch = e.pointerType === 'touch' || e.pointerType === '2' || e.type === 'touchend';
        let tooltip = this.tooltipModule;
        this.trigger(gaugeMouseUp, this.isBlazor ? blazorArgs : args);
        if (this.activeAxis && this.activePointer && this.enablePointerDrag) {
            this.svgObject.setAttribute('cursor', 'auto');
            let pointerInd = parseInt(this.activePointer.pathElement[0].id.slice(-1), 10);
            let axisInd = parseInt(this.activePointer.pathElement[0].id.split('_Axis_')[1], 10);
            this.trigger(dragEnd, this.isBlazor ? {
                name: dragEnd,
                type: pointerEnd,
                currentValue: this.activePointer.currentValue,
                pointerIndex: pointerInd,
                axisIndex: axisInd
            } : {
                name: dragEnd,
                type: pointerEnd,
                axis: this.activeAxis,
                pointer: this.activePointer,
                currentValue: this.activePointer.currentValue,
                axisIndex: axisInd,
                pointerIndex: pointerInd
            });
            this.activeAxis = null;
            this.activePointer = null;
            this.isDrag = false;
        }
        else if (this.activeAxis && this.activeRange && this.enableRangeDrag) {
            this.svgObject.setAttribute('cursor', 'auto');
            let rangeInd = parseInt(this.activeRange.pathElement[0].id.slice(-1), 10);
            let axisInd = parseInt(this.activeRange.pathElement[0].id.split('_Axis_')[1], 10);
            this.trigger(dragEnd, this.isBlazor ? {
                name: dragEnd,
                type: rangeEnd,
                rangeIndex: rangeInd,
                axisIndex: axisInd
            } : {
                name: dragEnd,
                type: rangeEnd,
                axis: this.activeAxis,
                range: this.activeRange,
                axisIndex: axisInd,
                rangeIndex: rangeInd
            });
            this.activeAxis = null;
            this.activeRange = null;
            this.isDrag = false;
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
            gauge: !this.isBlazor ? this : null,
            previousSize: new Size(this.availableSize.width, this.availableSize.height),
            name: resized,
            currentSize: new Size(0, 0)
        };
        if (!isNullOrUndefined(document.getElementById(this.element.id + '_svg'))) {
            this.createSvg();
            this.calculateBounds();
            this.renderElements();
        }
        args.currentSize = this.availableSize;
        this.animatePointer = false;
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        else if (this.element.classList.contains('e-circulargauge')) {
            this.resizeTo = window.setTimeout(() => {
                this.createSvg();
                this.calculateBounds();
                this.renderElements();
                args.currentSize = this.availableSize;
                if (this.isBlazor) {
                    const { previousSize, name, currentSize } = args;
                    args = { previousSize, name, currentSize };
                }
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
        for (let i = 0; i < this.axes.length; i++) {
            for (let j = 0; j < this.axes[i].annotations.length; j++) {
                resetBlazorTemplate(this.element.id + '_Axis' + i + '_ContentTemplate' + j, '_ContentTemplate');
            }
        }
        removeElement(this.element.id + '_Secondary_Element');
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
        removeElement(this.element.id + '_svg');
        this.clearTemplate();
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
        let borderWidth = parseInt(this.element.style.borderWidth.split('px').join(''), 10) * 2;
        let width = stringToNumber(this.width, containerWidth) || containerWidth || 600;
        let height = stringToNumber(this.height, containerHeight) || containerHeight || 450;
        width = !isNaN(borderWidth) ? (width - borderWidth) : width;
        height = !isNaN(borderWidth) ? (height - borderWidth) : height;
        this.availableSize = new Size(width, height);
    }
    /**
     * To calculate the spacing of the circular gauge element.
     */
    radiusAndCenterCalculation(top, left, width, height, radius, titleHeight, isUpperAngle, isLowerAngle, isFullPercent, radiusPercent, isUpper, isLower) {
        let rect;
        let bottom = this.margin.bottom + this.border.width;
        let minRadius;
        let widthRadius;
        let centerX;
        let centerY;
        if (this.moveToCenter && this.axes.length === 1 &&
            isNullOrUndefined(this.centerX) && isNullOrUndefined(this.centerY)) {
            rect = new Rect(left, top, width, height);
        }
        else {
            if (!this.allowMargin) {
                if (!isNullOrUndefined(this.legendModule) && (width > height) && (this.legendSettings.position === 'Top' || this.legendSettings.position === 'Bottom')) {
                    minRadius = Math.min(width, height) / 2;
                    rect = new Rect((left + (width / 2) - minRadius), (top + (height / 2) - minRadius), minRadius * 2, minRadius * 2);
                }
                else {
                    if (width > height && (isLowerAngle && isLower || isUpperAngle && isUpper)) {
                        widthRadius = ((width) / 2);
                        let heightValue = isUpper && isLower ? (height / 2) : (height * (3 / 4));
                        if (widthRadius > heightValue) {
                            widthRadius = heightValue;
                        }
                        rect = new Rect((left + (width / 2) - widthRadius), (top + (height / 2) - widthRadius), widthRadius * 2, widthRadius * 2);
                    }
                    else {
                        if (height > width) {
                            let heightRadius = height / 2;
                            rect = new Rect((left + (width / 2) - radius), (top + (height / 2) - heightRadius), radius * 2, heightRadius * 2);
                        }
                        else {
                            rect = new Rect((left + (width / 2) - radius), (top + (height / 2) - radius), radius * 2, radius * 2);
                        }
                    }
                }
            }
            else {
                rect = new Rect((left + (width / 2) - radius), (top + (height / 2) - radius), radius * 2, radius * 2);
            }
        }
        this.gaugeRect = rect;
        if (this.legendModule && this.legendSettings.visible) {
            this.legendModule.getLegendOptions(this.axes);
            this.legendModule.calculateLegendBounds(this.gaugeRect, this.availableSize);
        }
        if (!this.allowMargin) {
            if (!isNullOrUndefined(this.legendModule) && (isUpperAngle || isLowerAngle) && (width > height) && (this.legendSettings.position === 'Top' || this.legendSettings.position === 'Bottom')) {
                let difference = height - this.gaugeRect.height;
                this.gaugeRect.width = width - ((this.availableSize.width - this.gaugeRect.width) / 2);
                this.gaugeRect.y = this.gaugeRect.y - difference;
                this.gaugeRect.height = this.gaugeRect.height + difference + ((this.availableSize.height - this.gaugeRect.height) / 2);
            }
            else if (!isNullOrUndefined(this.legendModule) && (isUpperAngle || isLowerAngle) && (width > height) && (this.legendSettings.position === 'Left' || this.legendSettings.position === 'Right')) {
                let difference = this.gaugeRect.height - this.gaugeRect.width;
                this.gaugeRect.x = this.legendSettings.position === 'Right'
                    ? this.gaugeRect.x + this.margin.right : this.gaugeRect.x;
                this.gaugeRect.width = this.legendSettings.position === 'Left' ?
                    Math.abs(width - ((this.availableSize.width - this.gaugeRect.width + difference) / 2))
                    : Math.abs(width - ((this.availableSize.width - this.gaugeRect.width) / 2) - 10);
            }
            centerX = this.centerX !== null ?
                stringToNumber(this.centerX, this.availableSize.width) : this.gaugeRect.x + (this.gaugeRect.width / 2);
            if ((isUpperAngle || isLowerAngle) && !isNullOrUndefined(this.legendModule)) {
                centerX = (this.legendSettings.position === 'Top' || this.legendSettings.position === 'Bottom')
                    ? this.availableSize.width / 2 : this.legendSettings.position === 'Right' ? (this.gaugeRect.width / 2) + this.margin.right :
                    centerX;
            }
            centerY = ((isUpperAngle || isLowerAngle) ? (isUpperAngle ?
                (((this.gaugeRect.height * (3 / 4) + this.gaugeRect.y) - bottom))
                : (((this.gaugeRect.height * (1 / 4)) + (this.gaugeRect.y)))) : this.gaugeRect.y + (this.gaugeRect.height / 2));
            centerY = !isFullPercent && (isUpperAngle || isLowerAngle) ? (this.gaugeRect.height / 2) + this.gaugeRect.y + (radiusPercent * (3 / 4) * (1 / 2)) : centerY;
            if (!isNullOrUndefined(this.axes) && this.axes.length > 1 && !isNullOrUndefined(this.midPoint)) {
                isUpper = isUpperAngle ? isUpperAngle : isUpper;
                isLower = isLowerAngle ? isLowerAngle : isLower;
                if (isUpper && isLower) {
                    centerY = (this.availableSize.height / 2) - bottom;
                }
            }
        }
        else {
            centerX = this.centerX !== null ?
                stringToNumber(this.centerX, this.availableSize.width) : this.gaugeRect.x + (this.gaugeRect.width / 2);
            centerY = this.centerY !== null ?
                stringToNumber(this.centerY, this.availableSize.height) : this.gaugeRect.y + (this.gaugeRect.height / 2);
        }
        this.midPoint = new GaugeLocation(centerX, centerY);
    }
    /**
     * Method to calculate the availble size for circular gauge.
     */
    calculateBounds() {
        let padding = 5;
        let margin = this.margin;
        let titleHeight = 0;
        if (this.title) {
            titleHeight = measureText(this.title, this.titleStyle).height + padding;
        }
        let top = margin.top + titleHeight + this.border.width;
        let bottom = margin.bottom + this.border.width;
        let left = margin.left + this.border.width;
        let isUpper = false;
        let isLower = false;
        let width = this.availableSize.width - left - margin.right - this.border.width;
        let height = this.availableSize.height - top - this.border.width - margin.bottom;
        let radius = Math.min(width, height) / 2;
        if (this.moveToCenter && this.axes.length === 1 &&
            isNullOrUndefined(this.centerX) && isNullOrUndefined(this.centerY)) {
            
        }
        if (!this.allowMargin) {
            for (var j = 0; j < this.axes.length; j++) {
                let isUpperAngle = 270 <= this.axes[j].startAngle && this.axes[j].startAngle <= 360 &&
                    0 <= this.axes[j].endAngle && this.axes[j].endAngle <= 90;
                let isLowerAngle = 90 >= this.axes[j].startAngle && this.axes[j].startAngle <= 180 &&
                    180 <= this.axes[j].endAngle && 270 <= this.axes[j].endAngle && 0 !== this.axes[j].startAngle &&
                    360 !== this.axes[j].endAngle;
                isUpper = isUpperAngle ? isUpperAngle : isUpper;
                isLower = isLowerAngle ? isLowerAngle : isLower;
                let isFullPercent = this.axes[j].radius !== null ? parseInt(this.axes[0].radius.split('%')[0]) >= 100 : true;
                let radiusPercent = this.axes[j].radius !== null ? radius * (parseInt(this.axes[0].radius.split('%')[0]) / 100) : radius;
                this.radiusAndCenterCalculation(top, left, width, height, radius, titleHeight, isUpperAngle, isLowerAngle, isFullPercent, radiusPercent, isUpper, isLower);
            }
        }
        else {
            this.radiusAndCenterCalculation(top, left, width, height, radius, titleHeight, false, false, null, null, false, false);
        }
        this.gaugeAxisLayoutPanel.measureAxis(this.gaugeRect);
    }
    /**
     * To render elements for circular gauge
     */
    renderElements(animate = true) {
        this.renderBorder();
        this.renderTitle();
        this.gaugeAxisLayoutPanel.renderAxes(animate);
        this.renderLegend();
        this.element.appendChild(this.svgObject);
        this.trigger(loaded, this.isBlazor ? {} : { gauge: this });
        removeElement("gauge-measuretext");
    }
    /**
     * Method to render legend for accumulation chart
     */
    renderLegend() {
        if (!this.legendModule || !this.legendSettings.visible) {
            return null;
        }
        if (this.legendModule.legendCollection.length) {
            this.legendModule.renderLegend(this.legendSettings, this.legendModule.legendBounds, true);
        }
    }
    /**
     * Method to render the title for circular gauge.
     */
    renderTitle() {
        if (this.title) {
            this.titleStyle.fontFamily = this.themeStyle.fontFamily || this.titleStyle.fontFamily;
            this.titleStyle.size = this.themeStyle.fontSize || this.titleStyle.size;
            let size = measureText(this.title, this.titleStyle);
            let options = new TextOption(this.element.id + '_CircularGaugeTitle', this.availableSize.width / 2, this.margin.top + 3 * (size.height / 4), 'middle', this.title);
            let element = textElement(options, this.titleStyle, this.titleStyle.color || this.themeStyle.titleFontColor, this.svgObject, '');
            element.setAttribute('aria-label', this.description || this.title);
            element.setAttribute('tabindex', this.tabIndex.toString());
        }
    }
    /**
     * Method to render the border for circular gauge.
     */
    renderBorder() {
        let borderWidth = this.border.width;
        if (borderWidth > 0 || (this.background || this.themeStyle.backgroundColor)) {
            this.svgObject.appendChild(this.renderer.drawRectangle(new RectOption(this.element.id + '_CircularGaugeBorder', this.background || this.themeStyle.backgroundColor, this.border, null, new Rect(borderWidth / 2, borderWidth / 2, this.availableSize.width - borderWidth, this.availableSize.height - borderWidth))));
        }
    }
    /**
     * This method is used to set the pointer value dynamically for circular gauge.
     * @param axisIndex - Specifies the index value for the axis in circular gauge.
     * @param pointerIndex - Specifies the index value for the pointer in circular gauge.
     * @param value - Specifies the value for the pointer in circular gauge.
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
        this.isProtectedOnChange = true;
        pointer.previousValue = pointer.currentValue;
        pointer.currentValue = value;
        pointer.value = value;
        this.isProtectedOnChange = false;
    }
    /**
     * This method is used to set the annotation content dynamically for circular gauge.
     * @param axisIndex - Specifies the index value for the axis in circular gauge.
     * @param annotationIndex - Specifies the index value for the annotation in circular gauge.
     * @param conetent - Specifies the content for the annotation in circular gauge.
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
     * This method is used to print the rendered circular gauge.
     * @param id - Specifies the element to print the circular gauge.
     */
    print(id) {
        if (this.allowPrint && this.printModule) {
            this.printModule.print(id);
        }
    }
    /**
     * This method is used to perform the export functionality for the circular gauge.
     * @param type - Specifies the type of the export.
     * @param fileName - Specifies the file name for the exported file.
     * @param orientation - Specified the orientation for the exported pdf document.
     * @param allowDownload - Specifies whether to download as a file.
     */
    export(type, fileName, orientation, allowDownload) {
        if (isNullOrUndefined(allowDownload)) {
            allowDownload = true;
        }
        if (type == 'PDF' && this.allowPdfExport && this.pdfExportModule) {
            return new Promise((resolve, reject) => {
                resolve(this.pdfExportModule.export(type, fileName, orientation, allowDownload));
            });
        }
        else if (this.allowImageExport && (type !== 'PDF') && this.imageExportModule) {
            return new Promise((resolve, reject) => {
                resolve(this.imageExportModule.export(type, fileName, allowDownload));
            });
        }
        return null;
    }
    /**
     * Method to set mouse x, y from events
     */
    setMouseXY(e) {
        let pageX;
        let pageY;
        let svgRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        let rect = this.element.getBoundingClientRect();
        if (e.type.indexOf('touch') > -1) {
            this.isTouch = true;
            let touchArg = e;
            pageY = touchArg.changedTouches[0].clientY;
            pageX = touchArg.changedTouches[0].clientX;
        }
        else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
            pageX = e.clientX;
            pageY = e.clientY;
        }
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    }
    /**
     * This method is used to set the range values dynamically for circular gauge.
     * @param axisIndex - Specifies the index value for the axis in circular gauge.
     * @param rangeIndex - Specifies the index value for the range in circular gauge.
     * @param start - Specifies the start value for the current range in circular gauge.
     * @param end - Specifies the end value for the current range i circular gauge.
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
        element.setAttribute('d', getPathArc(this.midPoint, Math.round(startAngle), Math.round(endAngle), range.currentRadius, startWidth, endWidth, range, axis));
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
        if (this.allowPrint) {
            modules.push({
                member: 'Print',
                args: [this, Print]
            });
        }
        if (this.allowImageExport) {
            modules.push({
                member: 'ImageExport',
                args: [this, ImageExport]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this, PdfExport]
            });
        }
        if (this.legendSettings.visible) {
            modules.push({
                member: 'Legend',
                args: [this, Legend]
            });
        }
        modules.push({
            member: 'Gradient',
            args: [this, Gradient]
        });
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
                case 'legendSettings':
                    refreshWithoutAnimation = true;
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
    Property(null)
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
    Property(false)
], CircularGauge.prototype, "enableRangeDrag", void 0);
__decorate([
    Property(false)
], CircularGauge.prototype, "allowPrint", void 0);
__decorate([
    Property(false)
], CircularGauge.prototype, "allowImageExport", void 0);
__decorate([
    Property(false)
], CircularGauge.prototype, "allowPdfExport", void 0);
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
    Property(true)
], CircularGauge.prototype, "allowMargin", void 0);
__decorate([
    Complex({}, LegendSettings)
], CircularGauge.prototype, "legendSettings", void 0);
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
], CircularGauge.prototype, "legendRender", void 0);
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
__decorate([
    Event()
], CircularGauge.prototype, "beforePrint", void 0);
CircularGauge = __decorate([
    NotifyPropertyChanges
], CircularGauge);

/**
 * Circular Gauge component exported items
 */

/**
 * Circular Gauge component exported.
 */

export { CircularGauge, Annotations, Line, Label, Range, Tick, Cap, NeedleTail, Animation$1 as Animation, Annotation, Pointer, Axis, Border, Font, RangeTooltip, AnnotationTooltip, Margin, TooltipSettings, GaugeTooltip, measureText, toPixel, getFontStyle, setStyles, measureElementRect, stringToNumber, textElement, appendPath, calculateSum, linear, getAngleFromValue, getDegree, getValueFromAngle, isCompleteAngle, getAngleFromLocation, getLocationFromAngle, getPathArc, getRangePath, getRoundedPathArc, getRoundedPath, getCompleteArc, getCirclePath, getCompletePath, getElement, getTemplateFunction, removeElement, getPointer, getRange, getElementSize, getMousePosition, getLabelFormat, calculateShapes, getRangeColor, CustomizeOption, PathOption, RectOption, Size, GaugeLocation, Rect, textTrim, showTooltip, TextOption, VisibleLabels, triggerDownload, Location, LegendSettings, Legend, Index, LegendOptions, ImageExport, PdfExport, Print, ColorStop, GradientPosition, LinearGradient, RadialGradient, Gradient };
//# sourceMappingURL=ej2-circulargauge.es2015.js.map
