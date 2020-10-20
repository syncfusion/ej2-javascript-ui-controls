window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.LinearGauge = (function () {
'use strict';

/**
 * LinearGauge Blazor introp module
 */
var SfLinearGauge = /** @class */ (function () {
    // tslint:disable-next-line:max-line-length
    function SfLinearGauge(id, element, options, dotnetRef, individualId) {
        this.id = id;
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.options = options;
        this.element.blazor__instance = this;
        this.individualId = individualId;
    }
    SfLinearGauge.prototype.render = function () {
        this.wireEvents();
    };
    SfLinearGauge.prototype.wireEvents = function () {
        /*! Bind the Event handler */
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchStartEvent, this.gaugeOnMouseDown, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchMoveEvent, this.gaugeOnMouseMove, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchEndEvent, this.gaugeOnMouseEnd, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchCancelEvent, this.gaugeOnMouseEnd, this);
        sf.base.EventHandler.add(this.element, 'click', this.gaugeOnMouseClick, this);
        sf.base.EventHandler.add(this.element, 'mouseleave', this.gaugeOnMouseLeave, this);
        window.addEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.gaugeOnResize.bind(this));
    };
    SfLinearGauge.prototype.gaugeOnResize = function () {
        var elementBounds = document.getElementById(this.element.id);
        if (elementBounds != null) {
            elementBounds = elementBounds.parentElement;
            var width = elementBounds.clientWidth || elementBounds.offsetWidth;
            var height = elementBounds.clientHeight || elementBounds.offsetHeight;
            this.dotNetRef.invokeMethodAsync('TriggerResizeEvent', width, height);
        }
    };
    SfLinearGauge.prototype.gaugeOnMouseClick = function (element) {
        var targetId = element.target.id;
        if (targetId.indexOf('Bar') > -1 || targetId.indexOf('Marker') > -1) {
            this.pointerCheck = false;
        }
    };
    SfLinearGauge.prototype.gaugeOnMouseLeave = function (element) {
        this.dotNetRef.invokeMethodAsync('TriggerMouseLeaveEvent', element.x, element.y);
    };
    SfLinearGauge.prototype.gaugeOnMouseDown = function (element) {
        var targetId = element.target.id;
        if (targetId.indexOf('Bar') > -1 || targetId.indexOf('Marker') > -1) {
            this.pointerCheck = true;
            var axisIndex = parseInt(targetId.split('_AxisIndex_')[1].split('_')[0], 10);
            var pointerIndex = parseInt(targetId.split('_AxisIndex_')[1].split('_')[2], 10);
            this.dotNetRef.invokeMethodAsync('TriggerDragStart', axisIndex, pointerIndex);
        }
        else {
            this.dotNetRef.invokeMethodAsync('TriggerMouseDownEvent', element.x, element.y);
        }
    };
    /* tslint:disable:no-string-literal */
    SfLinearGauge.prototype.gaugeOnMouseMove = function (element) {
        var targetId = element.target.id;
        if ((targetId.indexOf('Bar') > -1 && this.pointerCheck) || (targetId.indexOf('Marker') > -1 && this.pointerCheck)) {
            var svgBounds = this.svgClient(targetId);
            var axisIndex = parseInt(targetId.split('_AxisIndex_')[1].split('_')[0], 10);
            var pointerIndex = parseInt(targetId.split('_AxisIndex_')[1].split('_')[2], 10);
            this.dotNetRef.invokeMethodAsync('TriggerDragMove', targetId, axisIndex, pointerIndex, (element.clientX - svgBounds.left), (element.clientY - svgBounds.top));
        }
        if (targetId.indexOf('Bar') > -1 || targetId.indexOf('Marker') > -1 || targetId.indexOf('Range') > -1) {
            var svgBounds = this.svgClient(targetId);
            var axisIndex = parseInt(targetId.split('_AxisIndex_')[1].split('_')[0], 10);
            var pointerIndex = parseInt(targetId.split('_AxisIndex_')[1].split('_')[2], 10);
            var parentId = targetId.split('_')[0];
            var parentElement = document.getElementById(parentId).getBoundingClientRect();
            var parentEle = {
                Bottom: parentElement['bottom'],
                Height: parentElement['height'],
                Left: parentElement['left'],
                Right: parentElement['right'],
                Top: parentElement['top'],
                Width: parentElement['width'],
                X: parentElement['x'],
                Y: parentElement['y']
            };
            var lineElement = document.getElementById(parentId + '_AxisLine_' + axisIndex).getBoundingClientRect();
            var lineEle = {
                Bottom: lineElement['bottom'],
                Height: lineElement['height'],
                Left: lineElement['left'],
                Right: lineElement['right'],
                Top: lineElement['top'],
                Width: lineElement['width'],
                X: lineElement['x'],
                Y: lineElement['y']
            };
            var tickElement = document.getElementById(parentId + '_MajorTicksLine_' + axisIndex).getBoundingClientRect();
            var tickEle = {
                Bottom: tickElement['bottom'],
                Height: tickElement['height'],
                Left: tickElement['left'],
                Right: tickElement['right'],
                Top: tickElement['top'],
                Width: tickElement['width'],
                X: tickElement['x'],
                Y: tickElement['y']
            };
            var pointElement = document.getElementById(targetId).getBoundingClientRect();
            var pointEle = {
                Bottom: pointElement['bottom'],
                Height: pointElement['height'],
                Left: pointElement['left'],
                Right: pointElement['right'],
                Top: pointElement['top'],
                Width: pointElement['width'],
                X: pointElement['x'],
                Y: pointElement['y']
            };
            var elementId = targetId.split('_')[0];
            var tooltipElement = document.getElementById(elementId + '_Tooltip');
            if (tooltipElement != null) {
                tooltipElement.style.visibility = 'visible';
            }
            this.dotNetRef.invokeMethodAsync('TriggerTooltip', targetId, axisIndex, pointerIndex, (element.clientX - svgBounds.left), (element.clientY - svgBounds.top), parentEle, lineEle, tickEle, pointEle);
        }
        else {
            var elementId = targetId.split('_')[0];
            var tooltipElement = document.getElementById(elementId + '_Tooltip');
            if (tooltipElement != null) {
                tooltipElement.style.visibility = 'hidden';
            }
        }
    };
    SfLinearGauge.prototype.gaugeOnMouseEnd = function (element) {
        var targetId = element.target.id;
        this.pointerCheck = false;
        if (targetId.indexOf('Bar') > -1 || targetId.indexOf('Marker') > -1) {
            this.pointerCheck = false;
            var svgBounds = this.svgClient(targetId);
            var parentId = targetId.split('_AxisIndex_')[0].split('_')[0];
            var axisIndex = parseInt(targetId.split('_AxisIndex_')[1].split('_')[0], 10);
            var pointerIndex = parseInt(targetId.split('_AxisIndex_')[1].split('_')[2], 10);
            this.dotNetRef.invokeMethodAsync('TriggerDragEnd', axisIndex, pointerIndex, parentId, targetId, (element.clientX - svgBounds.left), (element.clientY - svgBounds.top));
        }
        else {
            this.dotNetRef.invokeMethodAsync('TriggerMouseUpEvent', element.x, element.y);
        }
    };
    SfLinearGauge.prototype.svgClient = function (targetId) {
        var svg = document.getElementById(targetId.split('_AxisIndex_')[0] + '_svg');
        return svg.getBoundingClientRect();
    };
    return SfLinearGauge;
}());
// tslint:disable
var LinearGauge = {
    initialize: function (element, options, dotnetRef, individualId) {
        var instance = new SfLinearGauge(element.id, element, options, dotnetRef, individualId);
        instance.render();
        return this.getElementSize(element);
    },
    getElementSize: function (element) {
        var elementWidth;
        var elementHeight;
        if (element != null) {
            var elementRect = element.getBoundingClientRect();
            elementWidth = elementRect.width;
            elementHeight = elementRect.height;
        }
        return { width: elementWidth, height: elementHeight, isIE: sf.base.Browser.isIE };
    },
    setPathAttribute: function (id, type, path, x, y) {
        var pathElement = document.getElementById(id);
        if (type === '') {
            pathElement.setAttribute('d', path);
        }
        else {
            pathElement.setAttribute('x', x.toString());
            pathElement.setAttribute('y', y.toString());
        }
    },
    getElementBounds: function (id) {
        var htmlElement = document.getElementById(id);
        if (htmlElement) {
            var bounds = htmlElement.getBoundingClientRect();
            return {
                width: bounds.width, height: bounds.height, top: bounds.top, bottom: bounds.bottom,
                left: bounds.left, right: bounds.right
            };
        }
        return null;
    },
};

return LinearGauge;

}());
