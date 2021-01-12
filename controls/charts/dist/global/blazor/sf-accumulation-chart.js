window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.AccumulationChart = (function () {
'use strict';

/**
 * AccumulationChart blazor source file
 */
// tslint:disable
var throttle = window['_'].throttle;
var ChartLocation = /** @class */ (function () {
    function ChartLocation(x, y) {
        this.x = x;
        this.y = y;
    }
    return ChartLocation;
}());
var AccumulationChart = {
    id: '',
    mouseY: 0,
    mouseX: 0,
    eventInterval: 80,
    getElementBoundsById: function (id, isSetId) {
        if (isSetId === void 0) { isSetId = true; }
        if (isSetId) {
            this.id = id;
        }
        var element = document.getElementById(id);
        if (element) {
            var elementRect = element.getBoundingClientRect();
            return {
                width: element.clientWidth || element.offsetWidth,
                height: element.clientHeight || element.offsetHeight,
                left: elementRect.left,
                top: elementRect.top,
                right: elementRect.right,
                bottom: elementRect.bottom
            };
        }
        return { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 };
    },
    charCollection: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '"', '#', '$', '%', '&', '\\', '(', ')', '*', '+', ',', '-', '.', '/', ':',
        ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', '[', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
        'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', ' ',
    ],
    measureText: function (text, size, fontWeight, fontStyle, fontFamily) {
        var textObject = document.getElementById('chartmeasuretext');
        if (textObject === null) {
            textObject = sf.base.createElement('text', { id: 'chartmeasuretext' });
            document.body.appendChild(textObject);
        }
        if (text === ' ') {
            text = '&nbsp;';
        }
        textObject.innerHTML = text;
        textObject.style.position = 'fixed';
        textObject.style.fontSize = '100px';
        textObject.style.fontWeight = fontWeight;
        textObject.style.fontStyle = fontStyle;
        textObject.style.fontFamily = fontFamily;
        textObject.style.visibility = 'hidden';
        textObject.style.top = '-100';
        textObject.style.left = '0';
        textObject.style.whiteSpace = 'nowrap';
        textObject.style.lineHeight = 'normal';
        return {
            Width: textObject.clientWidth,
            Height: textObject.clientHeight
        };
    },
    getCharSizeByFontKeys: function (fontkeys) {
        var charSizeList = {};
        var charList = this.charCollection;
        var charLength = charList.length;
        var fontKeysLength = fontkeys.length;
        for (var i = 0; i < fontKeysLength; i++) {
            var fontValues = fontkeys[i].split('_');
            var size = fontValues[0];
            var fontWeight = fontValues[1];
            var fontStyle = fontValues[2];
            var fontFamily = fontValues[3];
            var charKey = '_' + fontWeight + fontStyle + fontFamily;
            for (var j = 0; j < charLength; j++) {
                charSizeList[charList[j] + charKey] = this.measureText(charList[j], size, fontWeight, fontStyle, fontFamily);
            }
        }
        var result = JSON.stringify(charSizeList);
        return result;
    },
    getCharSizeByCharKey: function (charkey) {
        var fontValues = charkey.split('_');
        var char = fontValues[0];
        var size = fontValues[1];
        var fontWeight = fontValues[2];
        var fontStyle = fontValues[3];
        var fontFamily = fontValues[4];
        return this.measureText(char, size, fontWeight, fontStyle, fontFamily);
    },
    resizeTo: {},
    resizeBound: [],
    dotnetref: {},
    dotnetrefCollection: [],
    wireEvents: function (id, dotnetref) {
        var _this = this;
        var element = document.getElementById(id);
        if (!element) {
            return;
        }
        this.dotnetref = dotnetref;
        this.dotnetrefCollection.push({ id: id, dotnetref: dotnetref });
        /*! Find the Events type */
        var cancelEvent = sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chartOnMouseDownRef = this.chartOnMouseDown.bind(this, dotnetref, id);
        this.mouseMoveRef = this.mouseMove.bind(this, dotnetref, id);
        this.mouseEndRef = this.mouseEnd.bind(this, dotnetref, id);
        this.chartOnMouseClickRef = this.chartOnMouseClick.bind(this, dotnetref, id);
        this.chartRightClickRef = this.chartRightClick.bind(this, dotnetref, id);
        this.mouseLeaveRef = this.mouseLeave.bind(this, dotnetref, id);
        /*! Bind the Event handler */
        element.addEventListener('mousemove', throttle(function (e) {
            _this.mouseMoveRef(e);
        }, this.eventInterval));
        element.addEventListener('touchmove', throttle(function (e) {
            _this.mouseMoveRef(e);
        }, this.eventInterval));
        sf.base.EventHandler.add(element, sf.base.Browser.touchEndEvent, this.mouseEndRef);
        sf.base.EventHandler.add(element, 'click', this.chartOnMouseClickRef);
        sf.base.EventHandler.add(element, 'contextmenu', this.chartRightClickRef);
        sf.base.EventHandler.add(element, cancelEvent, this.mouseLeaveRef);
        this.resizeBound[id] = this.chartResize.bind(this, dotnetref, id);
        var resize = (sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' :
            'resize';
        sf.base.EventHandler.add(window, resize, this.resizeBound[id]);
        this.longPressBound = this.longPress.bind(this, dotnetref, id);
        this.touchObject = new sf.base.Touch(element, { tapHold: this.longPressBound, tapHoldThreshold: 500 });
        /*! Apply the style for chart */
    },
    unWireEvents: function (id, dotnetref) {
        var element = document.getElementById(id);
        if (!element) {
            return;
        }
        this.dotnetref = dotnetref;
        this.dotnetrefCollection = this.dotnetrefCollection.filter(function (item) {
            return item.id !== id;
        });
        /*! Find the Events type */
        var cancelEvent = sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        sf.base.EventHandler.remove(element, sf.base.Browser.touchStartEvent, this.chartOnMouseDownRef);
        element.removeEventListener('mousemove', this.mouseMoveRef);
        element.removeEventListener('touchmove', this.mouseMoveRef);
        sf.base.EventHandler.remove(element, sf.base.Browser.touchEndEvent, this.mouseEndRef);
        sf.base.EventHandler.remove(element, 'click', this.chartOnMouseClickRef);
        sf.base.EventHandler.remove(element, 'contextmenu', this.chartRightClickRef);
        sf.base.EventHandler.remove(element, cancelEvent, this.mouseLeaveRef);
        var resize = sf.base.Browser.isTouch && 'orientation' in window && 'onorientationchange' in window ? 'orientationchange' : 'resize';
        sf.base.EventHandler.remove(window, resize, this.resizeBound[id]);
        if (this.touchObject) {
            this.touchObject.destroy();
            this.touchObject = null;
        }
        /*! Apply the style for chart */
    },
    getEventArgs: function (e, id) {
        return {
            type: e.type,
            clientX: e.clientX,
            clientY: e.clientY,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            pointerType: e.pointerType,
            target: e.target.id,
            changedTouches: {
                clientX: e.changedTouches ? e.changedTouches[0].clientX : 0,
                clientY: e.changedTouches ? e.changedTouches[0].clientY : 0
            }
        };
    },
    setMouseXY: function (pageX, pageY) {
        var svgRect = document.getElementById(this.id + '_svg').getBoundingClientRect();
        var rect = document.getElementById(this.id).getBoundingClientRect();
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    },
    chartOnMouseDown: function (dotnetref, id, e) {
        this.dotnetref = dotnetref;
        this.id = id;
        this.dotnetref.invokeMethodAsync('OnChartMouseDown', this.getEventArgs(e));
        return false;
    },
    mouseMove: function (dotnetref, id, e) {
        this.dotnetref = dotnetref;
        this.id = id;
        var pageX;
        var pageY;
        var touchArg;
        if (e.type === 'touchmove') {
            this.isTouch = true;
            touchArg = e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
        }
        else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2' || this.isTouch;
            pageX = e.clientX;
            pageY = e.clientY;
        }
        if (document.getElementById(this.id + '_svg')) {
            this.setMouseXY(pageX, pageY);
            this.dotnetref.invokeMethodAsync('OnChartMouseMove', this.getEventArgs(e));
        }
        return false;
    },
    mouseEnd: function (dotnetref, id, e) {
        this.dotnetref = dotnetref;
        this.id = id;
        this.dotnetref.invokeMethodAsync('OnChartMouseEnd', this.getEventArgs(e));
        return false;
    },
    chartOnMouseClick: function (dotnetref, id, e) {
        this.dotnetref = dotnetref;
        this.id = id;
        this.dotnetref.invokeMethodAsync('OnChartMouseClick', this.getEventArgs(e));
        return false;
    },
    chartRightClick: function (dotnetref, id, event) {
        this.dotnetref = dotnetref;
        this.id = id;
        this.dotnetref.invokeMethodAsync('OnChartRightClick', this.getEventArgs(event));
        return false;
    },
    mouseLeave: function (dotnetref, id, e) {
        this.dotnetref = dotnetref;
        this.id = id;
        this.dotnetref.invokeMethodAsync('OnChartMouseLeave', this.getEventArgs(e));
        return false;
    },
    chartResize: function (dotnetref, id, e) {
        if (this.resizeTo[id]) {
            clearTimeout(this.resizeTo[id]);
        }
        this.resizeTo[id] = setTimeout(function () {
            dotnetref.invokeMethodAsync('OnChartResize', e);
        }, 500);
        return false;
    },
    longPress: function (dotnetref, id, e) {
        this.dotnetref = dotnetref;
        this.id = id;
        this.dotnetref.invokeMethodAsync('OnChartLongPress', e);
        return false;
    },
    performAnimation: function (index, sliceId, startX, startY, endX, endY, duration, transform, isReverse) {
        var _this = this;
        var result = /translate\((-?\d+\.?\d*),?\s*(-?\d+[.]?\d*)?\)/.exec(transform);
        if (!sf.base.isNullOrUndefined(transform) && transform !== '') {
            endX = +result[1];
            endY = +result[2];
        }
        if (duration <= 0) {
            this.setElementTransform(sliceId, index, 'transform', 'translate(' + (endX) + ', ' + (endY) + ')');
            return null;
        }
        var xValue;
        var yValue;
        new sf.base.Animation({}).animate(sf.base.createElement('div'), {
            duration: duration,
            progress: function (args) {
                xValue = _this.linear(args.timeStamp, startX, endX, args.duration);
                yValue = _this.linear(args.timeStamp, startY, endY, args.duration);
                _this.setElementTransform(sliceId, index, 'transform', 'translate(' + (isReverse ? endX - xValue : xValue) + ', ' + (isReverse ? endY - yValue : yValue) + ')');
            },
            end: function (model) {
                _this.setElementTransform(sliceId, index, 'transform', 'translate(' + (isReverse ? startX : endX) + ', ' + (isReverse ? startX : endY) + ')');
            }
        });
    },
    setElementTransform: function (sliceId, index, attribute, value) {
        var chartID = sliceId.replace('Series_0', 'datalabel').replace('Point', 'Series_0');
        this.setElementAttribute(sliceId + index, 'transform', value);
        this.setElementAttribute(chartID + 'shape_' + index, 'transform', value);
        this.setElementAttribute(chartID + 'text_' + index, 'transform', value);
        this.setElementAttribute(chartID + 'connector_' + index, 'transform', value);
    },
    linear: function (currentTime, startValue, endValue, duration) {
        return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
    },
    setElementAttribute: function (id, attribute, value) {
        var element = document.getElementById(id);
        if (element) {
            element.setAttribute(attribute, value);
        }
    },
    getElementAttribute: function (id, attribute) {
        var element = document.getElementById(id);
        if (element) {
            return (element.getAttribute(attribute));
        }
        return '';
    },
    createStyleElement: function (styleId, styleInnerHTML) {
        document.body.appendChild(sf.base.createElement('style', { id: styleId, innerHTML: styleInnerHTML }));
    },
    tooltip: {},
    renderTooltip: function (tooltipOptions, elementId, tooltipModule) {
        var svgElement = document.getElementById(elementId + '_svg');
        var firstRender = (svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0) ? false : true;
        var options = JSON.parse(tooltipOptions);
        if (firstRender) {
            this.tooltip = new sf.svgbase.Tooltip(options);
            this.tooltip.tooltipRender = function () {
                tooltipModule.invokeMethodAsync('TooltipRender');
            };
            this.tooltip.animationComplete = function (args) {
                if (args.tooltip.fadeOuted) {
                    tooltipModule.invokeMethodAsync('TooltipAnimationComplete');
                }
            };
            this.tooltip.appendTo('#' + elementId);
        }
        else {
            this.tooltip.location = new sf.svgbase.TooltipLocation(options.location.x, options.location.y);
            this.tooltip.content = options.content;
            this.tooltip.header = options.header;
            this.tooltip.offset = options.offset;
            this.tooltip.palette = options.palette;
            this.tooltip.shapes = options.shapes;
            this.tooltip.data = options.data;
            this.tooltip.template = options.template;
            this.tooltip.textStyle.color = options.textStyle.color || this.tooltip.textStyle.color;
            this.tooltip.textStyle.fontFamily = options.textStyle.fontFamily || this.tooltip.textStyle.fontFamily;
            this.tooltip.textStyle.fontStyle = options.textStyle.fontStyle || this.tooltip.textStyle.fontStyle;
            this.tooltip.textStyle.fontWeight = options.textStyle.fontWeight || this.tooltip.textStyle.fontWeight;
            this.tooltip.textStyle.opacity = options.textStyle.opacity || this.tooltip.textStyle.opacity;
            this.tooltip.textStyle.size = options.textStyle.size || this.tooltip.textStyle.size;
            this.tooltip.isNegative = options.isNegative;
            this.tooltip.clipBounds = new sf.svgbase.TooltipLocation(options.clipBounds.x, options.clipBounds.y);
            this.tooltip.arrowPadding = options.arrowPadding;
            this.tooltip.dataBind();
        }
    },
    animateRedrawElement: function (elementId, duration, startX, startY, endX, endY, x, y) {
        var _this = this;
        if (x === void 0) { x = 'x'; }
        if (y === void 0) { y = 'y'; }
        var element = document.getElementById(elementId);
        if (!element) {
            return null;
        }
        var isDiv = element.tagName === 'DIV';
        var setStyle = function (xValue, yValue) {
            if (isDiv) {
                element.style[x] = xValue + 'px';
                element.style[y] = yValue + 'px';
            }
            else {
                element.setAttribute(x, xValue + '');
                element.setAttribute(y, yValue + '');
            }
        };
        setStyle(startX, startY);
        new sf.base.Animation({}).animate(sf.base.createElement('div'), {
            duration: duration,
            progress: function (args) {
                setStyle(_this.linear(args.timeStamp, startX, endX - startX, args.duration), _this.linear(args.timeStamp, startY, endY - startY, args.duration));
            },
            end: function () {
                setStyle(endX, endY);
            }
        });
    },
    //Pie Animation starts here
    doAnimation: function (sliceId, startAngle, totalAngle, animationDuration, animationDelay, legendDuration, radius, center) {
        var _this = this;
        var slice = document.getElementById(sliceId);
        startAngle -= 90;
        var duration = legendDuration ? legendDuration : animationDuration;
        var value;
        center['x'] += 1;
        radius += radius * (0.414); // formula r + r / 2 * (1.414 -1)
        // need to check animation type
        new sf.base.Animation({}).animate(slice, {
            duration: duration,
            delay: animationDelay,
            progress: function (args) {
                value = _this.linear(args.timeStamp, startAngle, totalAngle, args.duration);
                slice.setAttribute('d', _this.getPathArc(center, startAngle, value, radius, 0));
            },
            end: function (args) {
                center.x -= 1;
                slice.setAttribute('d', _this.getPathArc(center, startAngle, startAngle - 0.00009, radius, 0));
                var datalabels = document.getElementById(slice.id.split('_')[0] + '_datalabel_Series_0');
                if (datalabels) {
                    datalabels.setAttribute('style', 'visibility: visible');
                }
            }
        });
    },
    getPathArc: function (center, start, end, radius, innerRadius) {
        var degree = end - start;
        degree = degree < 0 ? (degree + 360) : degree;
        var flag = (degree < 180) ? 0 : 1;
        if (!innerRadius && innerRadius === 0) {
            return this.getPiePath(center, this.degreeToLocation(start, radius, center), this.degreeToLocation(end, radius, center), radius, flag);
        }
        else {
            return this.getDoughnutPath(center, this.degreeToLocation(start, radius, center), this.degreeToLocation(end, radius, center), radius, this.degreeToLocation(start, innerRadius, center), this.degreeToLocation(end, innerRadius, center), innerRadius, flag);
        }
    },
    getPiePath: function (center, start, end, radius, clockWise) {
        return 'M ' + center.x + ' ' + center.y + ' L ' + start.x + ' ' + start.y + ' A ' + radius + ' ' +
            radius + ' 0 ' + clockWise + ' 1 ' + end.x + ' ' + end.y + ' Z';
    },
    getDoughnutPath: function (center, start, end, radius, innerStart, innerEnd, innerRadius, clockWise) {
        return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' + radius + ' 0 ' + clockWise +
            ' 1 ' + end.x + ' ' + end.y + ' L ' + innerEnd.x + ' ' + innerEnd.y + ' A ' + innerRadius +
            ' ' + innerRadius + ' 0 ' + clockWise + ',0 ' + innerStart.x + ' ' + innerStart.y + ' Z';
    },
    degreeToLocation: function (degree, radius, center) {
        var radian = (degree * Math.PI) / 180;
        return new ChartLocation(Math.cos(radian) * radius + center.x, Math.sin(radian) * radius + center.y);
    },
    //Pie Animation end here
    /**
     * Pie Series Legend Click Animation
     */
    ChangePiePath: function (pointOptions, center, duration) {
        for (var _i = 0, pointOptions_1 = pointOptions; _i < pointOptions_1.length; _i++) {
            var point = pointOptions_1[_i];
            this.ChangePointPath(point.point, point.degree, point.start, point.pathOption, duration, center, point.radius, point.innerRadius);
        }
    },
    GetPathOption: function (center, degree, startAngle, radius, innerRadius) {
        if (!degree) {
            return '';
        }
        return this.getPathArc(center, startAngle, (startAngle + degree) % 360, radius, innerRadius);
    },
    ChangePointPath: function (point, degree, start, option, duration, center, radius, innerRadius) {
        var _this = this;
        var seriesElement = document.getElementById(option.id);
        var currentStartAngle;
        var curentDegree;
        new sf.base.Animation({}).animate(sf.base.createElement('div'), {
            duration: duration,
            delay: 0,
            progress: function (args) {
                curentDegree = _this.linear(args.timeStamp, point.degree, (degree - point.degree), args.duration);
                currentStartAngle = _this.linear(args.timeStamp, point.start, start - point.start, args.duration);
                currentStartAngle = ((currentStartAngle / (Math.PI / 180)) + 360) % 360;
                seriesElement.setAttribute('d', _this.GetPathOption(center, curentDegree, currentStartAngle, radius, innerRadius));
                if (point.isExplode) {
                    //chart.accBaseModule.explodePoints(point.index, chart, true);
                }
                seriesElement.style.visibility = 'visible';
            },
            end: function (args) {
                seriesElement.style.visibility = point.visible ? 'visible' : 'hidden';
                seriesElement.setAttribute('d', option.direction);
                point.degree = degree;
                point.start = start;
            }
        });
    }
};

return AccumulationChart;

}());
