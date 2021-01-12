window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Chart = (function () {
'use strict';

/**
 * Chart native blazor source file
 */
var throttle = window['_'].throttle;
var SfChart = /** @class */ (function () {
    // tslint:disable-next-line:max-line-length
    function SfChart(id, element, dotnetRef, isZooming, isScrollbar) {
        if (isZooming === void 0) { isZooming = false; }
        if (isScrollbar === void 0) { isScrollbar = false; }
        this.mouseY = 0;
        this.mouseX = 0;
        this.eventInterval = 80;
        this.chartOnMouseDownRef = null;
        this.mouseMoveRef = null;
        this.mouseEndRef = null;
        this.chartOnMouseClickRef = null;
        this.chartRightClickRef = null;
        this.mouseLeaveRef = null;
        this.chartMouseWheelRef = null;
        this.domMouseMoveRef = null;
        this.domMouseUpRef = null;
        this.resizeBound = [];
        this.longPressBound = null;
        this.touchObject = null;
        this.resizeTo = {};
        // tslint:disable-next-line:max-line-length
        this.pinchStyle = 'opacity: 0; position: absolute; display: block; width: 100px; height: 100px; background: transparent; border: 2px solid blue;';
        this.pinchtarget = null;
        this.id = id;
        this.element = element;
        this.dotnetref = dotnetRef;
        this.isZooming = isZooming;
        this.isScrollbar = isScrollbar;
        this.element.blazor__instance = this;
    }
    SfChart.prototype.render = function () {
        this.unWireEvents(this.id, this.dotnetref);
        this.wireEvents(this.id, this.dotnetref);
    };
    SfChart.prototype.destroy = function () {
        this.unWireEvents(this.id, this.dotnetref);
    };
    SfChart.prototype.unWireEvents = function (id, dotnetref) {
        var element = document.getElementById(id);
        if (!element) {
            return;
        }
        this.dotnetref = dotnetref;
        Chart.dotnetrefCollection = Chart.dotnetrefCollection.filter(function (item) {
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
        if (this.isZooming) {
            var wheelEvent = sf.base.Browser.info.name === 'mozilla' ? (sf.base.Browser.isPointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';
            element.removeEventListener(wheelEvent, this.chartMouseWheelRef);
        }
        if (this.isScrollbar) {
            window.removeEventListener('mousemove', this.domMouseMoveRef);
            window.removeEventListener('mouseup', this.domMouseUpRef, false);
        }
        var resize = sf.base.Browser.isTouch && 'orientation' in window && 'onorientationchange' in window ? 'orientationchange' : 'resize';
        sf.base.EventHandler.remove(window, resize, this.resizeBound[id]);
        if (this.touchObject) {
            this.touchObject.destroy();
            this.touchObject = null;
        }
        /*! Apply the style for chart */
    };
    SfChart.prototype.wireEvents = function (id, dotnetref) {
        var _this = this;
        var element = document.getElementById(id);
        if (!element) {
            return;
        }
        this.dotnetref = dotnetref;
        Chart.dotnetrefCollection.push({ id: id, dotnetref: dotnetref });
        /*! Find the Events type */
        var cancelEvent = sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chartOnMouseDownRef = this.chartOnMouseDown.bind(this, dotnetref, id);
        this.mouseMoveRef = this.mouseMove.bind(this, dotnetref, id);
        this.mouseEndRef = this.mouseEnd.bind(this, dotnetref, id);
        this.chartOnMouseClickRef = this.chartOnMouseClick.bind(this, dotnetref, id);
        this.chartRightClickRef = this.chartRightClick.bind(this, dotnetref, id);
        this.mouseLeaveRef = this.mouseLeave.bind(this, dotnetref, id);
        /*! Bind the Event handler */
        sf.base.EventHandler.add(element, sf.base.Browser.touchStartEvent, this.chartOnMouseDownRef);
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
        if (this.isZooming) {
            this.chartMouseWheelRef = this.chartMouseWheel.bind(this, dotnetref, id);
            var wheelEvent = sf.base.Browser.info.name === 'mozilla' ? (sf.base.Browser.isPointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';
            element.addEventListener(wheelEvent, throttle(function (e) {
                _this.chartMouseWheelRef(e);
            }, this.eventInterval));
        }
        if (this.isScrollbar) {
            this.domMouseMoveRef = this.domMouseMove.bind(this, dotnetref, id);
            this.domMouseUpRef = this.domMouseUp.bind(this, dotnetref, id);
            window.addEventListener('mousemove', throttle(function (e) {
                _this.domMouseMoveRef(e);
            }, this.eventInterval));
            window.addEventListener('mouseup', this.domMouseUpRef, false);
        }
        this.resizeBound[id] = this.chartResize.bind(this, dotnetref, id);
        var resize = sf.base.Browser.isTouch && 'orientation' in window && 'onorientationchange' in window ? 'orientationchange' : 'resize';
        sf.base.EventHandler.add(window, resize, this.resizeBound[id]);
        this.longPressBound = this.longPress.bind(this, dotnetref, id);
        this.touchObject = new sf.base.Touch(element, { tapHold: this.longPressBound, tapHoldThreshold: 500 });
        /*! Apply the style for chart */
    };
    SfChart.prototype.getEventArgs = function (e, id) {
        var clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        var clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        this.setMouseXY(clientX, clientY, id);
        var touches = e.touches; //pointerId
        var touchList = [];
        if (e.type.indexOf('touch') > -1) {
            for (var i = 0, length_1 = touches.length; i < length_1; i++) {
                touchList.push({ pageX: touches[i].clientX, pageY: touches[i].clientY, pointerId: e.pointerId || 0 });
            }
        }
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
            },
            touches: touchList,
            pointerId: e.pointerId
        };
    };
    SfChart.prototype.getWheelArgs = function (e, id) {
        this.setMouseXY(e.clientX, e.clientY, id);
        return {
            detail: e.detail,
            wheelDelta: e['wheelDelta'],
            target: e.currentTarget ? e.currentTarget['id'] : e.srcElement ? e.srcElement['id'] : e.target ? e.target['id'] : '',
            clientX: e.clientX,
            clientY: e.clientY,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            browserName: sf.base.Browser.info.name,
            isPointer: sf.base.Browser.isPointer
        };
    };
    SfChart.prototype.setMouseXY = function (pageX, pageY, id) {
        var svgRect = document.getElementById(id + '_svg').getBoundingClientRect();
        var rect = document.getElementById(id).getBoundingClientRect();
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    };
    SfChart.prototype.chartOnMouseDown = function (dotnetref, id, e) {
        this.dotnetref = dotnetref;
        if (e.type.indexOf('touch') > -1) {
            var clientX = e.changedTouches ? e.changedTouches[0].clientX :
                e.clientX;
            var clientY = e.changedTouches ? e.changedTouches[0].clientY :
                e.clientY;
            this.pinchtarget = document.getElementById('pinchtarget');
            this.pinchtarget.setAttribute('style', this.pinchStyle + ' top: ' + (clientY - 50) + 'px; left: ' + (clientX - 50) + 'px;');
        }
        dotnetref.invokeMethodAsync('OnChartMouseDown', this.getEventArgs(e, id));
        return false;
    };
    SfChart.prototype.chartMouseWheel = function (dotnetref, id, e) {
        this.dotnetref = dotnetref;
        dotnetref.invokeMethodAsync('OnChartMouseWheel', this.getWheelArgs(e, id));
        e.preventDefault();
        return false;
    };
    SfChart.prototype.mouseMove = function (dotnetref, id, e) {
        var pageX;
        var pageY;
        var touchArg;
        if (e.type === 'touchmove') {
            this.isTouch = true;
            touchArg = e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
            if (this.pinchtarget) {
                this.pinchtarget.setAttribute('style', this.pinchStyle + ' top: ' + (pageY - 50) + 'px; left: ' + (pageX - 50) + 'px;');
            }
            e.preventDefault();
        }
        else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2' || this.isTouch;
            pageX = e.clientX;
            pageY = e.clientY;
        }
        this.dotnetref = dotnetref;
        if (document.getElementById(id + '_svg')) {
            this.setMouseXY(pageX, pageY, id);
            dotnetref.invokeMethodAsync('OnChartMouseMove', this.getEventArgs(e, id));
        }
        return false;
    };
    SfChart.prototype.mouseEnd = function (dotnetref, id, e) {
        this.dotnetref = dotnetref;
        if (this.pinchtarget) {
            this.pinchtarget.setAttribute('style', this.pinchStyle + ' top: -100px; left: -100px;');
        }
        dotnetref.invokeMethodAsync('OnChartMouseEnd', this.getEventArgs(e, id));
        return false;
    };
    SfChart.prototype.chartOnMouseClick = function (dotnetref, id, e) {
        this.dotnetref = dotnetref;
        dotnetref.invokeMethodAsync('OnChartMouseClick', this.getEventArgs(e, id));
        return false;
    };
    SfChart.prototype.chartRightClick = function (dotnetref, id, event) {
        this.dotnetref = dotnetref;
        event.preventDefault();
        event.stopPropagation();
        return false;
    };
    SfChart.prototype.mouseLeave = function (dotnetref, id, e) {
        this.dotnetref = dotnetref;
        dotnetref.invokeMethodAsync('OnChartMouseLeave', this.getEventArgs(e, id));
        return false;
    };
    SfChart.prototype.chartResize = function (dotnetref, id, e) {
        if (this.resizeTo[id]) {
            clearTimeout(this.resizeTo[id]);
        }
        this.resizeTo[id] = setTimeout(function () {
            var count = Chart.dotnetrefCollection.length;
            var tempDotnetref;
            for (var i = 0; i < count; i++) {
                tempDotnetref = Chart.dotnetrefCollection[i].dotnetref;
                tempDotnetref.invokeMethodAsync('RemoveElements');
            }
            dotnetref.invokeMethodAsync('OnChartResize', e);
        }, 500);
        return false;
    };
    SfChart.prototype.longPress = function (dotnetref, id, e) {
        this.dotnetref = dotnetref;
        var clientX = e && e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].clientX : 0;
        var clientY = e && e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].clientY : 0;
        this.setMouseXY(clientX, clientY, id);
        var args = {
            type: 'TapHold',
            clientX: clientX,
            clientY: clientY,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            pointerType: '',
            target: '',
            changedTouches: {
                clientX: clientX,
                clientY: clientY
            },
            touches: [],
            pointerId: 0
        };
        dotnetref.invokeMethodAsync('OnChartLongPress', args);
        return false;
    };
    SfChart.prototype.domMouseMove = function (dotnetref, id, event) {
        if (!sf.base.isNullOrUndefined(Chart.svgId) && Chart.svgId.indexOf(id) > -1) {
            var evtArgs = Chart.getScrollEventArgs(event, true);
            dotnetref.invokeMethodAsync('ScrollMouseMove', evtArgs);
        }
        return false;
    };
    SfChart.prototype.domMouseUp = function (dotnetref, id, event) {
        if (!sf.base.isNullOrUndefined(Chart.svgId) && Chart.svgId.indexOf(id) > -1) {
            var evtArgs = Chart.getScrollEventArgs(event, true);
            dotnetref.invokeMethodAsync('ScrollMouseUp', evtArgs);
            Chart.svgId = null;
        }
        return false;
    };
    return SfChart;
}());
var Chart = {
    initialize: function (element, dotnetRef, isZooming, isScrollbar) {
        var instance = new SfChart(element.id, element, dotnetRef, isZooming, isScrollbar);
        instance.render();
    },
    destroy: function (element) {
        var currentInstance = element.blazor__instance;
        if (!sf.base.isNullOrUndefined(currentInstance)) {
            currentInstance.destroy();
        }
    },
    eventInterval: 80,
    dotnetref: {},
    getScrollEventArgs: function (e, lastScrollbar) {
        if (lastScrollbar === void 0) { lastScrollbar = false; }
        var clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        var clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        var mouseXY = this.setScrollMouseXY(clientX, clientY, e.target['id'], lastScrollbar);
        var touches = e.touches; //pointerId
        var touchList = [];
        if (e.type.indexOf('touch') > -1) {
            for (var i = 0, length_2 = touches.length; i < length_2; i++) {
                touchList.push({ pageX: touches[i].clientX, pageY: touches[i].clientY, pointerId: e.pointerId || 0 });
            }
        }
        var id = e.target.id;
        id = id.indexOf('scrollBar') > -1 ? id : this.svgId;
        return {
            type: e.type,
            clientX: e.clientX,
            clientY: e.clientY,
            mouseX: mouseXY.mouseX,
            mouseY: mouseXY.mouseY,
            pointerType: e.pointerType,
            target: id,
            changedTouches: {
                clientX: e.changedTouches ? e.changedTouches[0].clientX : 0,
                clientY: e.changedTouches ? e.changedTouches[0].clientY : 0
            },
            touches: touchList,
            pointerId: e.pointerId
        };
    },
    getScrollWheelArgs: function (e) {
        var mouseXY = this.setScrollMouseXY(e.clientX, e.clientY, e.currentTarget['id']);
        return {
            detail: e.detail,
            wheelDelta: e['wheelDelta'],
            target: e.currentTarget ? e.currentTarget['id'] : e.srcElement ? e.srcElement['id'] : e.target ? e.target['id'] : '',
            clientX: e.clientX,
            clientY: e.clientY,
            mouseX: mouseXY.mouseX,
            mouseY: mouseXY.mouseY,
            browserName: sf.base.Browser.info.name,
            isPointer: sf.base.Browser.isPointer
        };
    },
    svgId: null,
    setScrollMouseXY: function (pageX, pageY, id, lastScrollbar) {
        if (lastScrollbar === void 0) { lastScrollbar = false; }
        this.svgId = !lastScrollbar ? id : this.svgId;
        if (!lastScrollbar && id.indexOf('_scrollBar_svg') === -1) {
            var chartId_1 = id.split('_scrollBar')[0];
            var splitId = id.split('_');
            this.svgId = chartId_1 + '_scrollBar_svg' + splitId[splitId.length - 1];
            this.dotnetref = this.dotnetrefCollection.find(function (item) { return chartId_1 === item.id; }).dotnetref;
        }
        var svgRect = this.getElement(this.svgId).getBoundingClientRect();
        var mouseX = pageX - Math.max(svgRect.left, 0);
        var mouseY = pageY - Math.max(svgRect.top, 0);
        return { mouseX: mouseX, mouseY: mouseY };
    },
    scrollMouseDown: function (event) {
        var evtArgs = this.getScrollEventArgs(event);
        this.dotnetref.invokeMethodAsync('ScrollMouseDown', evtArgs);
        return false;
    },
    scrollMouseMove: function (event) {
        var _this = this;
        throttle(function () {
            var evtArgs = _this.getScrollEventArgs(event);
            _this.dotnetref.invokeMethodAsync('ScrollMouseMove', evtArgs);
        }, this.eventInterval);
        return false;
    },
    scrollMouseUp: function (event) {
        var evtArgs = this.getScrollEventArgs(event);
        this.dotnetref.invokeMethodAsync('ScrollMouseUp', evtArgs);
        this.svgId = null;
        return false;
    },
    scrollMouseWheel: function (event) {
        var _this = this;
        throttle(function () {
            var evtArgs = _this.getScrollWheelArgs(event);
            _this.dotnetref.invokeMethodAsync('ScrollMouseWheel', evtArgs);
        }, this.eventInterval);
        return false;
    },
    dotnetrefCollection: [],
    renderTooltip: function (tooltipOptions, elementId, tooltipModule, element) {
        var svgElement = document.getElementById(elementId + '_svg');
        var firstRender = svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0 ? false : true;
        var options = JSON.parse(tooltipOptions);
        var currentInstance = element.blazor__instance;
        if (firstRender && !sf.base.isNullOrUndefined(currentInstance)) {
            currentInstance.tooltip = new sf.svgbase.Tooltip(options);
            currentInstance.tooltip.appendTo('#' + elementId);
            currentInstance.tooltip.tooltipRender = function () {
                tooltipModule.invokeMethodAsync('TooltipRender');
            };
            currentInstance.tooltip.animationComplete = function (args) {
                if (args.tooltip.fadeOuted) {
                    tooltipModule.invokeMethodAsync('TooltipAnimationComplete');
                }
            };
        }
        else if (!sf.base.isNullOrUndefined(currentInstance.tooltip)) {
            currentInstance.tooltip.location = new sf.svgbase.TooltipLocation(options.location.x, options.location.y);
            currentInstance.tooltip.content = options.content;
            currentInstance.tooltip.header = options.header;
            currentInstance.tooltip.offset = options.offset;
            currentInstance.tooltip.palette = options.palette;
            currentInstance.tooltip.shapes = options.shapes;
            currentInstance.tooltip.data = options.data;
            currentInstance.tooltip.template = options.template;
            currentInstance.tooltip.textStyle.color = options.textStyle.color || currentInstance.tooltip.textStyle.color;
            currentInstance.tooltip.textStyle.fontFamily = options.textStyle.fontFamily || currentInstance.tooltip.textStyle.fontFamily;
            currentInstance.tooltip.textStyle.fontStyle = options.textStyle.fontStyle || currentInstance.tooltip.textStyle.fontStyle;
            currentInstance.tooltip.textStyle.fontWeight = options.textStyle.fontWeight || currentInstance.tooltip.textStyle.fontWeight;
            currentInstance.tooltip.textStyle.opacity = options.textStyle.opacity || currentInstance.tooltip.textStyle.opacity;
            currentInstance.tooltip.textStyle.size = options.textStyle.size || currentInstance.tooltip.textStyle.size;
            currentInstance.tooltip.isNegative = options.isNegative;
            currentInstance.tooltip.clipBounds = new sf.svgbase.TooltipLocation(options.clipBounds.x, options.clipBounds.y);
            currentInstance.tooltip.arrowPadding = options.arrowPadding;
            currentInstance.tooltip.dataBind();
        }
    },
    fadeOut: function (element) {
        if (sf.base.isNullOrUndefined(element.blazor__instance) ||
            (!sf.base.isNullOrUndefined(element.blazor__instance) && sf.base.isNullOrUndefined(element.blazor__instance.tooltip))) {
            return;
        }
        element.blazor__instance.tooltip.fadeOut();
    },
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
    getBrowserDeviceInfo: function () {
        return {
            browserName: sf.base.Browser.info.name,
            isPointer: sf.base.Browser.isPointer,
            isDevice: sf.base.Browser.isDevice,
            isTouch: sf.base.Browser.isTouch,
            isIos: sf.base.Browser.isIos || sf.base.Browser.isIos7
        };
    },
    setZoomingCipPath: function (seriesCollection, indicator, clipUrl) {
        var seriesEle = document.getElementById(seriesCollection);
        var indicatorEle = document.getElementById(indicator);
        if (seriesEle) {
            seriesEle.setAttribute('clip-path', clipUrl);
        }
        if (indicatorEle) {
            seriesEle.setAttribute('clip-path', clipUrl);
        }
    },
    setZoomingElementAttributes: function (translate, category, seriesG, errorbarG, symbolG, textG, shapeG, element) {
        if (category === 'Indicator' && seriesG && seriesG.parentElement) {
            seriesG.parentElement.setAttribute('transform', translate);
        }
        if (seriesG) {
            seriesG.setAttribute('transform', translate);
        }
        if (errorbarG) {
            errorbarG.setAttribute('transform', translate);
        }
        if (symbolG) {
            symbolG.setAttribute('transform', translate);
        }
        if (textG) {
            textG.setAttribute('visibility', 'hidden');
        }
        if (shapeG) {
            shapeG.setAttribute('visibility', 'hidden');
        }
        if (element) {
            element.style.visibility = 'hidden';
        }
    },
    measureBreakText: function (text, size, color, fontFamily, fontWeight, fontStyle, opacity) {
        var font = {
            color: color, size: size, fontFamily: fontFamily,
            fontWeight: fontWeight, fontStyle: fontStyle, opacity: parseInt(opacity, 10)
        };
        return sf.svgbase.measureText(text, font);
    },
    charCollection: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '"', '#', '$', '%', '&', '\\', '(', ')', '*', '+', ',', '-', '.', '/', ':',
        ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', '[', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
        'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', ' ',
    ],
    measureText: function (text, size, fontWeight, fontStyle, fontFamily) {
        var textObject = document.getElementById('sfchartmeasuretext');
        if (textObject === null) {
            textObject = sf.base.createElement('text', { id: 'sfchartmeasuretext' });
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
    getElementRect: function (id) {
        var element = document.getElementById(id);
        var rect = element.getBoundingClientRect();
        sf.base.remove(element);
        return {
            Left: rect.left,
            Right: rect.right,
            Top: rect.top,
            Bottom: rect.bottom,
            Width: rect.width,
            Height: rect.height
        };
    },
    getElement: function (id) {
        return document.getElementById(id);
    },
    drawTrackBall: function (svgId, option, tagName, className, clipPath, transform) {
        var parentElement = this.getElement(svgId);
        if (parentElement) {
            var childElement = document.createElementNS('http://www.w3.org/2000/svg', tagName);
            var keys = Object.keys(option);
            var key = '';
            for (var i = 0; i < keys.length; i++) {
                key = (keys[i] === 'strokeWidth') ? 'stroke-width' : (keys[i] === 'strokeDashArray') ?
                    'stroke-dashArray' : (keys[i] === 'direction') ? 'd' : keys[i];
                childElement.setAttribute(key, option[keys[i]]);
            }
            childElement.setAttribute('class', className);
            childElement.setAttribute('clip-path', clipPath);
            childElement.setAttribute('transform', transform);
            parentElement.appendChild(childElement);
        }
    },
    removeHighLightedMarker: function (className) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0, len = elements.length; i < len; i++) {
            sf.base.remove(elements[0]);
        }
    },
    setAttribute: function (id, attribute, value) {
        var element = this.getElement(id);
        if (element) {
            element.setAttribute(attribute, value);
        }
    },
    createTooltip: function (id, text, top, left, fontSize) {
        var tooltip = document.getElementById(id);
        var style = 'top:' + top.toString() + 'px;' +
            'left:' + left.toString() + 'px;' +
            'color:black !important; ' +
            'background:#FFFFFF !important; ' +
            'position:absolute;border:1px solid #707070;font-size:' + fontSize + ';border-radius:2px; z-index:1';
        if (!tooltip) {
            tooltip = sf.base.createElement('div', {
                id: id, innerHTML: '&nbsp;' + text + '&nbsp;', styles: style
            });
            document.body.appendChild(tooltip);
        }
        else {
            tooltip.setAttribute('innerHTML', '&nbsp;' + text + '&nbsp;');
            tooltip.setAttribute('styles', style);
        }
    },
    removeElement: function (id) {
        var element = this.getElement(id);
        if (element) {
            sf.base.remove(element);
        }
    },
    applySelection: function (id, color) {
        var elements = document.getElementById(id);
        var childNodes;
        if (elements && elements.childNodes) {
            childNodes = elements.childNodes;
            for (var i = 1, length_3 = childNodes.length; i < length_3; i++) {
                if (childNodes[i] && childNodes[i].tagName !== 'rect' && childNodes[i].setAttribute) {
                    childNodes[i].setAttribute('fill', color);
                }
            }
        }
    },
    getAndSetTextContent: function (id, get, value) {
        var element = document.getElementById(id);
        if (element) {
            if (get) {
                return element.textContent;
            }
            else {
                element.textContent = value;
            }
        }
        return null;
    },
    doProgressiveAnimation: function (id, clipId, duration, delay) {
        var clipElement = this.getElement(clipId);
        var path = this.getElement(id);
        var animation = new sf.base.Animation({});
        var strokeDashArray = path.getAttribute('stroke-dasharray');
        var pathLength = path.getTotalLength();
        var currentTime;
        path.setAttribute('visibility', 'hidden');
        animation.animate(path, {
            duration: duration,
            delay: delay,
            progress: function (args) {
                clipElement.setAttribute('visibility', 'visible');
                if (args.timeStamp >= args.delay) {
                    path.setAttribute('visibility', 'visible');
                    currentTime = Math.abs(Math.round(((args.timeStamp - args.delay) * pathLength) / args.duration));
                    path.setAttribute('stroke-dasharray', currentTime + ',' + pathLength);
                }
            },
            end: function (model) {
                path.setAttribute('stroke-dasharray', strokeDashArray);
            }
        });
    },
    linear: function (currentTime, startValue, endValue, duration) {
        return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
    },
    doLinearAnimation: function (id, duration, delay, isInverted) {
        var clipRect = this.getElement(id);
        var animation = new sf.base.Animation({});
        var effect = this.linear;
        var elementHeight = +clipRect.getAttribute('height');
        var elementWidth = +clipRect.getAttribute('width');
        var xCenter = +clipRect.getAttribute('x');
        var yCenter = isInverted ? +clipRect.getAttribute('height') + +clipRect.getAttribute('y') :
            +clipRect.getAttribute('y');
        var value;
        animation.animate(clipRect, {
            duration: duration,
            delay: delay,
            progress: function (args) {
                if (args.timeStamp >= args.delay) {
                    clipRect.setAttribute('visibility', 'visible');
                    if (isInverted) {
                        value = effect(args.timeStamp - args.delay, 0, elementHeight, args.duration);
                        clipRect.setAttribute('transform', 'translate(' + xCenter + ' ' + yCenter +
                            ') scale(1,' + (value / elementHeight) + ') translate(' + (-xCenter) + ' ' + (-yCenter) + ')');
                    }
                    else {
                        value = effect(args.timeStamp - args.delay, 0, elementWidth, args.duration);
                        clipRect.setAttribute('transform', 'translate(' + xCenter + ' ' + yCenter +
                            ') scale(' + (value / elementWidth) + ', 1) translate(' + (-xCenter) + ' ' + (-yCenter) + ')');
                    }
                }
            },
            end: function (model) {
                clipRect.setAttribute('transform', 'translate(0,0)');
            }
        });
    },
    doRectAnimation: function (id, clipId, duration, delay, index, centerX, centerY, elementWidth, elementHeight, isInverted) {
        var clipElement = this.getElement(clipId);
        var element = this.getElement(id).children[index];
        var effect = this.linear;
        var value;
        if (!sf.base.isNullOrUndefined(element)) {
            element.setAttribute('visibility', 'hidden');
            new sf.base.Animation({}).animate(element, {
                duration: duration,
                delay: delay,
                progress: function (args) {
                    clipElement.setAttribute('visibility', 'visible');
                    if (args.timeStamp >= args.delay) {
                        element.setAttribute('visibility', 'visible');
                        if (!isInverted) {
                            elementHeight = elementHeight ? elementHeight : 1;
                            value = effect(args.timeStamp - args.delay, 0, elementHeight, args.duration);
                            element.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                                ') scale(1,' + (value / elementHeight) + ') translate(' + (-centerX) + ' ' + (-centerY) + ')');
                        }
                        else {
                            elementWidth = elementWidth ? elementWidth : 1;
                            value = effect(args.timeStamp - args.delay, 0, elementWidth, args.duration);
                            element.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                                ') scale(' + (value / elementWidth) + ', 1) translate(' + (-centerX) + ' ' + (-centerY) + ')');
                        }
                    }
                },
                end: function (model) {
                    element.setAttribute('transform', 'translate(0,0)');
                }
            });
        }
    },
    doMarkerAnimate: function (id, clipId, duration, delay, index, centerX, centerY) {
        var clipElement = this.getElement(clipId);
        var element = this.getElement(id).children[index];
        var height = 0;
        element.setAttribute('visibility', 'hidden');
        new sf.base.Animation({}).animate(element, {
            duration: duration,
            delay: delay,
            progress: function (args) {
                clipElement.setAttribute('visibility', 'visible');
                if (args.timeStamp > args.delay) {
                    element.setAttribute('visibility', 'visible');
                    height = ((args.timeStamp - args.delay) / args.duration);
                    element.setAttribute('transform', 'translate(' + centerX
                        + ' ' + centerY + ') scale(' + height + ') translate(' + (-centerX) + ' ' + (-centerY) + ')');
                }
            },
            end: function (model) {
                element.setAttribute('visibility', '');
            }
        });
    },
    doPolarRadarAnimation: function (id, clipId, duration, delay, chartcenterX, chartcenterY) {
        var clipElement = this.getElement(clipId);
        var length = this.getElement(id).children.length;
        var _loop_1 = function (count) {
            var element = document.getElementById(id).children[count];
            var elementHeight = 0;
            element.setAttribute('visibility', 'hidden');
            new sf.base.Animation({}).animate(element, {
                duration: duration,
                delay: delay,
                progress: function (args) {
                    clipElement.setAttribute('visibility', 'visible');
                    if (args.timeStamp > args.delay) {
                        element.setAttribute('visibility', 'visible');
                        elementHeight = ((args.timeStamp - args.delay) / args.duration);
                        element.setAttribute('transform', 'translate(' + chartcenterX + ' ' + chartcenterY +
                            ') scale(' + elementHeight + ') translate(' + (-chartcenterX) + ' ' + (-chartcenterY) + ')');
                    }
                },
                end: function (model) {
                    element.setAttribute('visibility', 'visible');
                    element.removeAttribute('transform');
                }
            });
        };
        for (var count = 1; count < length; count++) {
            _loop_1(count);
        }
    },
    templateAnimate: function (element, delay, duration, name, isRemove, clipElement) {
        new sf.base.Animation({}).animate(element, {
            duration: duration,
            delay: delay,
            name: name,
            progress: function (args) {
                if (clipElement) {
                    clipElement.setAttribute('visibility', 'visible');
                }
                args.element.style.visibility = 'visible';
            },
            end: function (args) {
                if (isRemove) {
                    sf.base.remove(args.element);
                }
                else {
                    args.element.style.visibility = 'visible';
                }
            },
        });
    },
    doDataLabelAnimation: function (shapeId, textId, tempId, clipId, duration, delay) {
        var shapeElements = this.getElement(shapeId);
        var textElements = this.getElement(textId);
        var tempElement = this.getElement(tempId);
        var centerX;
        var centerY;
        var length = tempElement ? 1 : textElements.children.length;
        var element;
        for (var i = 0; i < length; i++) {
            if (tempElement) {
                tempElement.style.visibility = 'hidden';
                this.templateAnimate(tempElement, delay, duration, 'ZoomIn');
            }
            else {
                element = textElements.children[i];
                centerX = (+element.getAttribute('x')) + ((+element.getAttribute('width')) / 2);
                centerY = (+element.getAttribute('y')) + ((+element.getAttribute('height')) / 2);
                this.doMarkerAnimate(textId, clipId, duration, delay, i, centerX, centerY);
                if (shapeElements.children[i]) {
                    element = shapeElements.children[i];
                    centerX = (+element.getAttribute('x')) + ((+element.getAttribute('width')) / 2);
                    centerY = (+element.getAttribute('y')) + ((+element.getAttribute('height')) / 2);
                    this.doMarkerAnimate(shapeId, clipId, duration, delay, i, centerX, centerY);
                }
            }
        }
    },
    pathAnimation: function (id, direction, redraw, previousDirection, animateDuration) {
        var _this = this;
        var element = this.getElement(id);
        if (!redraw || element == null) {
            return null;
        }
        var duration = 300;
        if (animateDuration) {
            duration = animateDuration;
        }
        var startDirections = previousDirection || element.getAttribute('d');
        var splitDirections = startDirections.split(/(?=[LMCZAQ])/);
        var endDirections = direction.split(/(?=[LMCZAQ])/);
        var currentDireciton;
        var startPath = [];
        var endPath = [];
        var c;
        var end;
        element.setAttribute('d', startDirections);
        new sf.base.Animation({}).animate(sf.base.createElement('div'), {
            duration: duration,
            progress: function (args) {
                currentDireciton = '';
                splitDirections.map(function (directions, index) {
                    startPath = directions.split(' ');
                    endPath = endDirections[index] ? endDirections[index].split(' ') : startPath;
                    if (startPath[0] === 'Z') {
                        currentDireciton += 'Z' + ' ';
                    }
                    else {
                        currentDireciton += startPath[0] + ' ' +
                            _this.linear(args.timeStamp, +startPath[1], (+endPath[1] - +startPath[1]), args.duration) + ' ' +
                            _this.linear(args.timeStamp, +startPath[2], (+endPath[2] - +startPath[2]), args.duration) + ' ';
                    }
                    if (startPath[0] === 'C' || startPath[0] === 'Q') {
                        c = 3;
                        end = startPath[0] === 'Q' ? 4 : 6;
                        while (c < end) {
                            currentDireciton += _this.linear(args.timeStamp, +startPath[c], (+endPath[c] - +startPath[c]), args.duration)
                                + ' ' + _this.linear(args.timeStamp, +startPath[++c], (+endPath[c] - +startPath[c]), args.duration) + ' ';
                            ++c;
                        }
                    }
                    if (startPath[0] === 'A') {
                        currentDireciton += 0 + ' ' + 0 + ' ' + 1 + ' ' +
                            _this.linear(args.timeStamp, +startPath[6], (+endPath[6] - +startPath[6]), args.duration) + ' ' +
                            _this.linear(args.timeStamp, +startPath[7], (+endPath[7] - +startPath[7]), args.duration) + ' ';
                    }
                });
                element.setAttribute('d', currentDireciton);
            },
            end: function () {
                element.setAttribute('d', direction);
            }
        });
    },
    getPreviousDirection: function (id) {
        var element = this.getElement(id);
        var previousDirection = element ? element.getAttribute('d') : null;
        return previousDirection;
    },
    getPreviousLocation: function (id, circlePath) {
        var element = this.getElement(id);
        var x = element ? +element.getAttribute(circlePath + 'x') : 0;
        var y = element ? +element.getAttribute(circlePath + 'y') : 0;
        return { X: x, Y: y };
    },
    animateRectElement: function (element, delay, duration, currentRect, previousRect) {
        var _this = this;
        var setStyle = function (rect) {
            element.setAttribute('x', rect.x + '');
            element.setAttribute('y', rect.y + '');
            element.setAttribute('width', rect.width + '');
            element.setAttribute('height', rect.height + '');
        };
        new sf.base.Animation({}).animate(sf.base.createElement('div'), {
            duration: duration,
            delay: delay,
            progress: function (args) {
                setStyle(new sf.svgbase.Rect(_this.linear(args.timeStamp, previousRect.x, currentRect.x - previousRect.x, args.duration), _this.linear(args.timeStamp, previousRect.y, currentRect.y - previousRect.y, args.duration), _this.linear(args.timeStamp, previousRect.width, currentRect.width - previousRect.width, args.duration), _this.linear(args.timeStamp, previousRect.height, currentRect.height - previousRect.height, args.duration)));
            },
            end: function () {
                setStyle(currentRect);
            },
        });
    },
    animateRedrawElement: function (elementId, duration, startX, startY, endX, endY, x, y) {
        var _this = this;
        if (x === void 0) { x = 'x'; }
        if (y === void 0) { y = 'y'; }
        var element = this.getElement(elementId);
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
    appendChildElement: function (parent, childElement, redraw, isAnimate, x, y, start, direction, forceAnimate, isRect, previousRect, animateDuration) {
        if (isAnimate === void 0) { isAnimate = false; }
        if (x === void 0) { x = 'x'; }
        if (y === void 0) { y = 'y'; }
        if (forceAnimate === void 0) { forceAnimate = false; }
        if (isRect === void 0) { isRect = false; }
        if (previousRect === void 0) { previousRect = null; }
        var existChild = parent.querySelector('#' + childElement.id);
        var element = existChild || this.getElement(childElement.id);
        var child = childElement;
        var duration = animateDuration ? animateDuration : 300;
        if (redraw && isAnimate && element) {
            start = start || (element.tagName === 'DIV' ?
                new sf.svgbase.TooltipLocation(+(element.style[x].split('px')[0]), +(element.style[y].split('px')[0])) :
                new sf.svgbase.TooltipLocation(+element.getAttribute(x), +element.getAttribute(y)));
            if (direction !== '' && direction !== null) {
                this.pathAnimation(childElement, childElement.getAttribute('d'), redraw, direction, duration);
            }
            else if (isRect && previousRect) {
                this.animateRectElement(child, 0, duration, new sf.svgbase.Rect(+element.getAttribute('x'), +element.getAttribute('y'), +element.getAttribute('width'), +element.getAttribute('height')), previousRect);
            }
            else {
                var end = child.tagName === 'DIV' ?
                    new sf.svgbase.TooltipLocation(+(child.style[x].split('px')[0]), +(child.style[y].split('px')[0])) :
                    new sf.svgbase.TooltipLocation(+child.getAttribute(x), +child.getAttribute(y));
                this.animateRedrawElement(child, duration, start, end, x, y);
            }
        }
        else if (redraw && isAnimate && !element && forceAnimate) {
            this.templateAnimate(child, 0, 600, 'FadeIn');
        }
    },
    processAppendChild: function (parentId, childId, locationX, locationY, rectX, rectY, rectWidth, rectHeight, redraw, isAnimate, x, y, direction, forceAnimate, isRect, animateDuration) {
        if (isAnimate === void 0) { isAnimate = false; }
        if (x === void 0) { x = 'x'; }
        if (y === void 0) { y = 'y'; }
        if (forceAnimate === void 0) { forceAnimate = false; }
        if (isRect === void 0) { isRect = false; }
        var parentElement = this.getElement(parentId);
        var childElement = this.getElement(childId);
        var start = new sf.svgbase.TooltipLocation(locationX, locationY);
        var rect = new sf.svgbase.Rect(rectX, rectY, rectWidth, rectHeight);
        this.appendChildElement(parentElement, childElement, redraw, isAnimate, x, y, start, direction, forceAnimate, isRect, rect, animateDuration);
    },
    createStyleElement: function (styleId, styleInnerHTML) {
        document.body.appendChild(sf.base.createElement('style', {
            id: styleId,
            innerHTML: styleInnerHTML
        }));
    },
    isLassoId: function (x, y) {
        var lassoEle = document.elementFromPoint(x, y);
        return lassoEle ? lassoEle.id : '';
    },
    doErrorBarAnimation: function (id, clipId, delay, isInverted) {
        var errorBarElements = this.getElement(id);
        var clipElement = this.getElement(clipId);
        if (!errorBarElements) {
            return null;
        }
        var j = 1;
        while (j < errorBarElements.children.length) {
            errorBarElements.children[j].style.visibility = 'hidden';
            this.templateAnimate(errorBarElements.children[j], delay, 350, isInverted ? 'SlideLeftIn' : 'SlideBottomIn', false, clipElement);
            j++;
        }
    },
    getTemplateSize: function (id) {
        var element = this.getElement(id);
        if (element) {
            return {
                width: element.offsetWidth,
                height: element.offsetHeight
            };
        }
        return null;
    }
};

return Chart;

}());
