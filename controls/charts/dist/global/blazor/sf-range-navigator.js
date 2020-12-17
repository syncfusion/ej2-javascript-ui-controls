window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.RangeNavigator = (function () {
'use strict';

/**
 * RangeNavigator blazor script file.
 */
var SfRangeNavigator = /** @class */ (function () {
    function SfRangeNavigator(id, element, dotNetRef) {
        this.mouseY = 0;
        this.mouseX = 0;
        this.reSizeTo = 0;
        this.isTooltipHide = true;
        this.tooltip = [];
        this.id = id;
        this.element = element;
        this.dotNetRef = dotNetRef;
        this.element.blazor__instance = this;
    }
    SfRangeNavigator.prototype.unWireEvents = function () {
        var cancelEvent = sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave';
        sf.base.EventHandler.remove(this.element, sf.base.Browser.touchStartEvent, this.rangeOnMouseDown);
        sf.base.EventHandler.remove(this.element, sf.base.Browser.touchMoveEvent, this.mouseMove);
        sf.base.EventHandler.remove(this.element, sf.base.Browser.touchEndEvent, this.mouseEnd);
        sf.base.EventHandler.remove(this.element, 'click', this.rangeOnMouseClick);
        sf.base.EventHandler.remove(this.element, cancelEvent, this.mouseLeave);
        // tslint:disable-next-line:max-line-length
        window.removeEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.rangeResize.bind(this));
    };
    SfRangeNavigator.prototype.wireEvents = function () {
        var cancelEvent = sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave';
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchStartEvent, this.rangeOnMouseDown, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchMoveEvent, this.mouseMove, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchEndEvent, this.mouseEnd, this);
        sf.base.EventHandler.add(this.element, 'click', this.rangeOnMouseClick, this);
        sf.base.EventHandler.add(this.element, cancelEvent, this.mouseLeave, this);
        // tslint:disable-next-line:max-line-length
        window.addEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.rangeResize.bind(this));
    };
    SfRangeNavigator.prototype.rangeOnMouseDown = function (e) {
        this.setMouseX(this.getPageX(e));
        this.element.blazor__instance.isDrag = true;
        this.dotNetRef.invokeMethodAsync('OnRangeMouseDown', this.getEventArgs(e));
    };
    SfRangeNavigator.prototype.mouseMove = function (e) {
        if (document.getElementById(this.id + '_svg')) {
            this.setMouseX(this.getPageX(e));
            if (this.element.blazor__instance.isDrag && this.sliderChangeValue)
                this.element.blazor__instance.changeSlider();
        }
    };
    SfRangeNavigator.prototype.changeSlider = function () {
        var start;
        var end;
        if (this.sliderChangeValue.isDrag && this.mouseX >= this.sliderChangeValue.boundsX) {
            switch (this.sliderChangeValue.currentSlider) {
                case "Left":
                    this.sliderChangeValue.startValue = this.getRangeValue(Math.abs(this.mouseX - this.sliderChangeValue.boundsX));
                    break;
                case "Right":
                    this.sliderChangeValue.endValue = this.getRangeValue(Math.abs(this.mouseX - this.sliderChangeValue.boundsX));
                    break;
                case "Middle":
                    start = Math.max(this.getRangeValue(Math.abs(this.sliderChangeValue.startX - (this.sliderChangeValue.previousMoveX - this.mouseX) - this.sliderChangeValue.boundsX)), this.sliderChangeValue.rangeMin);
                    end = Math.min(this.getRangeValue(Math.abs(this.sliderChangeValue.endX - (this.sliderChangeValue.previousMoveX - this.mouseX) - this.sliderChangeValue.boundsX)), this.sliderChangeValue.rangeMax);
                    if (Math.floor(Math.abs(this.getXLocation(end) - this.getXLocation(start))) == Math.floor(this.sliderChangeValue.sliderWidth)) {
                        this.sliderChangeValue.startValue = start;
                        this.sliderChangeValue.endValue = end;
                    }
                    break;
            }
            this.setSlider(this.sliderChangeValue.startValue, this.sliderChangeValue.endValue, !this.sliderChangeValue.defferedUpdate, this.sliderChangeValue.enableTooltip);
            this.sliderChangeValue.previousMoveX = this.mouseX;
        }
    };
    SfRangeNavigator.prototype.setSlider = function (start, end, trigger, showTooltip) {
        var selectedElement = document.getElementById(this.element.blazor__instance.id + '_SelectedArea');
        var leftUnSelectedElement = document.getElementById(this.element.blazor__instance.id + '_leftUnSelectedArea');
        var rightUnSelectedElement = document.getElementById(this.element.blazor__instance.id + '_rightUnSelectedArea');
        var leftSlider = document.getElementById(this.element.blazor__instance.id + '_LeftSlider');
        var rightSlider = document.getElementById(this.element.blazor__instance.id + '_RightSlider');
        if (!(end >= start)) {
            start = [end, end = start][0];
        }
        var padding = this.sliderChangeValue.boundsX;
        start = end >= start ? start : [end, end = start][0];
        start = Math.max(start, this.sliderChangeValue.rangeMin);
        end = Math.min(end, this.sliderChangeValue.rangeMax);
        this.sliderChangeValue.startX = padding + this.getXLocation(start);
        this.sliderChangeValue.endX = padding + this.getXLocation(end);
        var selectedX = this.sliderChangeValue.enableRtl ? this.sliderChangeValue.endX : this.sliderChangeValue.startX;
        var rightPadding = this.sliderChangeValue.enableRtl ? this.sliderChangeValue.startX : this.sliderChangeValue.endX;
        this.sliderChangeValue.sliderWidth = Math.abs(this.sliderChangeValue.endX - this.sliderChangeValue.startX);
        selectedElement.setAttribute('x', (selectedX) + '');
        selectedElement.setAttribute('width', this.sliderChangeValue.sliderWidth + '');
        leftUnSelectedElement.setAttribute('width', (selectedX - padding) + '');
        rightUnSelectedElement.setAttribute('x', rightPadding + '');
        rightUnSelectedElement.setAttribute('width', (this.sliderChangeValue.boundsWidth - (rightPadding - padding)) + '');
        leftSlider.setAttribute('transform', 'translate(' + (this.sliderChangeValue.startX - this.sliderChangeValue.thumpPadding) + ', 0)');
        rightSlider.setAttribute('transform', 'translate(' + (this.sliderChangeValue.endX - this.sliderChangeValue.thumpPadding) + ', 0)');
        var left = 0;
        var leftX = this.sliderChangeValue.enableRtl ? this.sliderChangeValue.endX : this.sliderChangeValue.startX;
        var rightX = this.sliderChangeValue.enableRtl ? this.sliderChangeValue.startX : this.sliderChangeValue.endX;
        var leftRect = {
            x: this.sliderChangeValue.isLeightWeight ? left + padding : padding,
            y: this.sliderChangeValue.isLeightWeight ? 0 : this.sliderChangeValue.boundsY,
            width: this.sliderChangeValue.isLeightWeight ? leftX - padding : leftX,
            height: this.sliderChangeValue.isLeightWeight ? this.sliderChangeValue.thumpY : this.sliderChangeValue.boundsHeight
        };
        var rightRect = {
            x: this.sliderChangeValue.isLeightWeight ? left + rightX : rightX,
            y: this.sliderChangeValue.isLeightWeight ? 0 : this.sliderChangeValue.boundsY,
            width: (this.sliderChangeValue.boundsWidth - (rightPadding - padding)),
            height: this.sliderChangeValue.isLeightWeight ? this.sliderChangeValue.thumpY : this.sliderChangeValue.boundsHeight
        };
        var midRect = {
            x: this.sliderChangeValue.isLeightWeight ? leftX + left : 0,
            y: this.sliderChangeValue.isLeightWeight ? 0 : this.sliderChangeValue.boundsY,
            width: this.sliderChangeValue.isLeightWeight ? Math.abs(this.sliderChangeValue.endX - this.sliderChangeValue.startX) : rightX,
            height: this.sliderChangeValue.isLeightWeight ? this.sliderChangeValue.thumpY : this.sliderChangeValue.boundsHeight
        };
        if (this.element.blazor__instance.tooltip.length > 0)
            this.updateTooltip(leftRect, rightRect, midRect, this.sliderChangeValue.startX, this.sliderChangeValue.endX);
    };
    SfRangeNavigator.prototype.updateTooltip = function (leftRect, rightRect, midRect, start, end) {
        var content = this.getTooltipContent(this.sliderChangeValue.endValue);
        var rect = this.sliderChangeValue.enableRtl ? leftRect : rightRect;
        this.element.blazor__instance.tooltip[0].location.x = end;
        this.element.blazor__instance.tooltip[0].areaBounds = rect;
        this.element.blazor__instance.tooltip[0].content = [content];
        this.element.blazor__instance.tooltip[0].dataBind();
        content = this.getTooltipContent(this.sliderChangeValue.startValue);
        rect = this.sliderChangeValue.enableRtl ? rightRect : leftRect;
        this.element.blazor__instance.tooltip[1].location.x = start;
        this.element.blazor__instance.tooltip[1].content = [content];
        this.element.blazor__instance.tooltip[1].areaBounds = rect;
        this.element.blazor__instance.tooltip[1].dataBind();
    };
    SfRangeNavigator.prototype.getTooltipContent = function (point) {
        var format = this.sliderChangeValue.format;
        var isCustom = format.match('{value}') !== null;
        if (this.sliderChangeValue.valueType === 'DateTime') {
            return (new sf.base.Internationalization().getDateFormat({ format: format || 'MM/dd/yyyy' })(new Date(point)));
        }
        else {
            return new sf.base.Internationalization().getNumberFormat({
                format: isCustom ? '' : format,
            })(this.sliderChangeValue.valueType === 'Logarithmic' ? Math.pow(this.sliderChangeValue.logBase, point) : point);
        }
    };
    SfRangeNavigator.prototype.getRangeValue = function (x) {
        return (!this.sliderChangeValue.enableRtl ? x / this.sliderChangeValue.boundsWidth : (1 - (x / this.sliderChangeValue.boundsWidth))) * this.sliderChangeValue.rangeDelta + this.sliderChangeValue.rangeMin;
    };
    SfRangeNavigator.prototype.getXLocation = function (x) {
        var result = (x - this.sliderChangeValue.rangeMin) / this.sliderChangeValue.rangeDelta;
        return (this.sliderChangeValue.enableRtl ? (1 - result) : result) * this.sliderChangeValue.boundsWidth;
    };
    SfRangeNavigator.prototype.mouseEnd = function (e) {
        this.setMouseX(this.getPageX(e));
        if (this.element.blazor__instance.isDrag && this.sliderChangeValue) {
            this.dotNetRef.invokeMethodAsync("GetStartEndValue", this.sliderChangeValue.startValue, this.sliderChangeValue.endValue, true, this.sliderChangeValue.enableTooltip);
            this.element.blazor__instance.isDrag = false;
        }
        this.dotNetRef.invokeMethodAsync('OnRangeMouseEnd', this.getEventArgs(e));
    };
    SfRangeNavigator.prototype.rangeOnMouseClick = function (e) {
        this.dotNetRef.invokeMethodAsync('OnRangeMouseClick', this.getEventArgs(e));
    };
    SfRangeNavigator.prototype.mouseLeave = function (e) {
        this.setMouseX(this.getPageX(e));
        this.element.blazor__instance.isDrag = false;
        this.dotNetRef.invokeMethodAsync('OnRangeMouseLeave', this.getEventArgs(e));
        if (this.isTooltipHide) {
            this.fadeOutTooltip();
        }
    };
    SfRangeNavigator.prototype.fadeOutTooltip = function () {
        var _this = this;
        if (this.sliderChangeValue && this.sliderChangeValue.isTooltipHide) {
            window.clearInterval(this.toolTipInterval);
            if (this.element.blazor__instance.tooltip[1]) {
                this.toolTipInterval = window.setTimeout(function () {
                    _this.element.blazor__instance.tooltip[0].fadeOut();
                    _this.element.blazor__instance.tooltip[1].fadeOut();
                }, 1000);
            }
        }
    };
    SfRangeNavigator.prototype.getPageX = function (e) {
        if (e.type === 'touchmove') {
            return e.changedTouches[0].clientX;
        }
        else {
            return e.clientX;
        }
    };
    SfRangeNavigator.prototype.rangeResize = function (e) {
        var _this = this;
        this.element.blazor__instance.isDrag = false;
        if (this.reSizeTo) {
            clearTimeout(this.reSizeTo);
        }
        this.reSizeTo = window.setTimeout(function () {
            _this.dotNetRef.invokeMethodAsync('OnRangeResize', e);
        }, 500);
    };
    SfRangeNavigator.prototype.setMouseX = function (pageX) {
        var svgRect = document.getElementById(this.id + '_svg').getBoundingClientRect();
        var rect = document.getElementById(this.id).getBoundingClientRect();
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    };
    SfRangeNavigator.prototype.getEventArgs = function (e) {
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
    };
    return SfRangeNavigator;
}());
// tslint:disable
var RangeNavigator = {
    getElementBoundsById: function (id, dotNetRef, element) {
        if (element) {
            var navigator_1 = new SfRangeNavigator(id, element, dotNetRef);
            navigator_1.unWireEvents();
            navigator_1.wireEvents();
            return { width: element.clientWidth || element.offsetWidth, height: element.clientHeight || element.offsetHeight };
        }
        return { width: 0, height: 0 };
    },
    charCollection: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '"', '#', '$', '%', '&', '(', ')', '*', '+', ',', '-', '.', '/', ':',
        ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', '[', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
        'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', ' '
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
        var fontKeysLength = fontkeys.length;
        for (var i = 0; i < fontKeysLength; i++) {
            var fontValues = fontkeys[i].split('_');
            var fontWeight = fontValues[1];
            var fontStyle = fontValues[2];
            var fontFamily = fontValues[3];
            var charKey = '_' + fontWeight + fontStyle + fontFamily;
            for (var j = 0; j < charList.length; j++) {
                charSizeList[charList[j] + charKey] = this.measureText(charList[j], fontValues[0], fontWeight, fontStyle, fontFamily);
            }
        }
        return JSON.stringify(charSizeList);
    },
    getCharSizeByCharKey: function (charkey) {
        var fontValues = charkey.split('_');
        return this.measureText(fontValues[0], fontValues[1], fontValues[2], fontValues[3], fontValues[4]);
    },
    getValueForSliderChange: function (element, sliderChangeValue) {
        if (!sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.sliderChangeValue = sliderChangeValue;
            element.blazor__instance.isTooltipHide = sliderChangeValue.isTooltipHide;
            element.blazor__instance.isDrag = true;
        }
    },
    getElementRect: function (id) {
        var element = document.getElementById(id);
        var rect;
        if (element) {
            rect = element.getBoundingClientRect();
            sf.base.remove(element);
        }
        return {
            Left: rect.left,
            Right: rect.right,
            Top: rect.top,
            Bottom: rect.bottom,
            Width: rect.width,
            Height: rect.height
        };
    },
    tooltip: [],
    renderTooltip: function (leftTooltipOption, rightTooltipOption, leftElementId, rightElementId, element) {
        var svgElement;
        var firstRender;
        var idCollection = [leftElementId, rightElementId];
        var tooltipOptions = [leftTooltipOption, rightTooltipOption];
        var id;
        var options;
        for (var i = 1; i >= 0; i--) {
            id = idCollection[i];
            svgElement = document.getElementById(id + '_svg');
            firstRender = svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0 ? false : true;
            options = JSON.parse(tooltipOptions[i]);
            this.tooltip[id] = new sf.svgbase.Tooltip(options);
            this.tooltip[id].appendTo('#' + id);
            element.blazor__instance.tooltip[i] = this.tooltip[id];
            element.blazor__instance.tooltip[i] = this.tooltip[id];
        }
    },
    setAttribute: function (id, attribute, value) {
        var element = document.getElementById(id);
        if (element) {
            element.setAttribute(attribute, value);
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
    }
};

return RangeNavigator;

}());
