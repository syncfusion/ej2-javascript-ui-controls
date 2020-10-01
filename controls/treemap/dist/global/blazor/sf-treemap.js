window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Treemap = (function () {
'use strict';

var SELECTION = 'Selection';
var HIGHLIGHT = 'Highlight';
var TREEMAPHIGHLIGHT = 'treeMapHighlight';
var TREEMAPSELECTION = 'treeMapSelection';
var RECTPATH = '_RectPath';
var LEGENDHIGHLIGHT = 'LegendHighlight';
var TEXT = '_Text';
var SfTreemap = /** @class */ (function () {
    function SfTreemap(element, dotNetRef) {
        this.element = element;
        this.dotNetRef = dotNetRef;
        this.element.blazor__instance = this;
    }
    SfTreemap.prototype.initializeEvents = function () {
        sf.base.EventHandler.add(this.element, 'mouseup', this.mouseUp.bind(this), this);
        sf.base.EventHandler.add(this.element, 'mousemove', this.mouseMove.bind(this), this);
        sf.base.EventHandler.add(this.element, 'mousedown', this.mouseDown.bind(this), this);
        sf.base.EventHandler.add(this.element, 'mouseleave', this.mouseLeave.bind(this), this);
        sf.base.EventHandler.add(this.element, 'contextmenu', this.contextMenuEvent.bind(this), this);
        window.addEventListener('resize', this.reSize.bind(this));
    };
    SfTreemap.prototype.contextMenuEvent = function () {
        this.dotNetRef.invokeMethodAsync('TriggerRightClick');
    };
    SfTreemap.prototype.reSize = function () {
        var width;
        var height;
        if (this.element != null) {
            width = this.element.getBoundingClientRect().width;
            height = this.element.getBoundingClientRect().height;
        }
        this.dotNetRef.invokeMethodAsync('TriggerReSize', width, height);
    };
    SfTreemap.prototype.mouseDown = function (event) {
        event.preventDefault();
        var contentText = this.getElementId(event.target.id);
        this.dotNetRef.invokeMethodAsync('TriggerMouseDown', event.target.id, contentText);
    };
    SfTreemap.prototype.mouseUp = function (event) {
        var contentText = this.getElementId(event.target.id);
        this.dotNetRef.invokeMethodAsync('TriggerMouseUp', event.target.id, contentText, event.which === 3);
    };
    SfTreemap.prototype.mouseMove = function (event) {
        var mouseX;
        var mouseY;
        if (this.element != null) {
            var element = this.element.children[1];
            var elementRect = element.getBoundingClientRect();
            var pageXOffset_1 = element.ownerDocument.defaultView.pageXOffset;
            var pageYOffset_1 = element.ownerDocument.defaultView.pageYOffset;
            var clientTop = element.ownerDocument.documentElement.clientTop;
            var clientLeft = element.ownerDocument.documentElement.clientLeft;
            var positionX = elementRect.left + pageXOffset_1 - clientLeft;
            var positionY = elementRect.top + pageYOffset_1 - clientTop;
            mouseX = event.pageX - positionX;
            mouseY = event.pageY - positionY;
        }
        this.dotNetRef.invokeMethodAsync('TriggerMouseMove', event.target.id, mouseX, mouseY);
    };
    SfTreemap.prototype.mouseLeave = function (event) {
        this.dotNetRef.invokeMethodAsync('TriggerMouseLeave');
    };
    SfTreemap.prototype.getElementId = function (id) {
        var contentText;
        if (!sf.base.isNullOrUndefined(id) && id !== '') {
            contentText = document.getElementById(id).textContent;
        }
        else {
            contentText = '';
        }
        return contentText;
    };
    return SfTreemap;
}());
// tslint:disable
var Treemap = {
    initialize: function (element, dotNetRef) {
        var layout = new SfTreemap(element, dotNetRef);
        layout.initializeEvents();
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
        return { width: elementWidth, height: elementHeight };
    },
    setElementAttribute: function (dotNetRef, legendItems, items, fill, opacity, borderColor, borderWidth, type, blazorElement) {
        for (var j = 0; j < items.length; j++) {
            var element = document.getElementById(items[j] + RECTPATH);
            if (element != null) {
                if (type === SELECTION && element.classList.contains(TREEMAPHIGHLIGHT)) {
                    element.classList.remove(TREEMAPHIGHLIGHT);
                }
                if (!element.classList.contains(TREEMAPSELECTION)) {
                    for (var i = 0; i < legendItems.length; i++) {
                        var legendElement = document.getElementById(legendItems[i]);
                        if (legendElement != null) {
                            legendElement.setAttribute('fill', fill);
                            legendElement.setAttribute('opacity', opacity);
                            legendElement.setAttribute('stroke', borderColor);
                            legendElement.setAttribute('stroke-width', borderWidth);
                        }
                    }
                    element.setAttribute('fill', fill);
                    element.setAttribute('opacity', opacity);
                    element.setAttribute('stroke', borderColor);
                    element.setAttribute('stroke-width', borderWidth);
                    if (type === HIGHLIGHT || type === LEGENDHIGHLIGHT) {
                        element.classList.add(TREEMAPHIGHLIGHT);
                    }
                    else {
                        element.classList.add(TREEMAPSELECTION);
                    }
                    var contentText = blazorElement.blazor__instance.getElementId(items[j] + TEXT);
                    if (type === SELECTION) {
                        dotNetRef.invokeMethodAsync('TriggerItemSelect', contentText);
                    }
                    else if (type === HIGHLIGHT) {
                        dotNetRef.invokeMethodAsync('TriggerItemHighlight');
                    }
                }
            }
        }
    },
    removeElementAttribute: function (legendItems, legendFill, legendOpacity, legendBorderColor, legendBorderWidth, items, fill, opacity, borderColor, borderWidth, type) {
        for (var j = 0; j < items.length; j++) {
            var element = document.getElementById(items[j] + RECTPATH);
            if (element != null) {
                if (type === HIGHLIGHT && !element.classList.contains(TREEMAPSELECTION) ||
                    type === SELECTION && element.classList.contains(TREEMAPSELECTION)) {
                    for (var i = 0; i < legendItems.length; i++) {
                        var legendElement = document.getElementById(legendItems[i]);
                        if (legendElement != null) {
                            legendElement.setAttribute('fill', legendFill);
                            legendElement.setAttribute('opacity', legendOpacity);
                            legendElement.setAttribute('stroke', legendBorderColor);
                            legendElement.setAttribute('stroke-width', legendBorderWidth);
                        }
                    }
                    element.setAttribute('fill', fill[j]);
                    element.setAttribute('opacity', opacity[j]);
                    element.setAttribute('stroke', borderColor[j]);
                    element.setAttribute('stroke-width', borderWidth[j]);
                    if (type === HIGHLIGHT) {
                        element.classList.remove(TREEMAPHIGHLIGHT);
                    }
                    else {
                        element.classList.remove(TREEMAPSELECTION);
                    }
                }
            }
        }
    },
    templateElementSize: function (id, position) {
        var templateElement = document.getElementById(id);
        var width = templateElement.clientWidth;
        var height = templateElement.clientHeight;
        var textSizeWidth;
        var textSizeHeight;
        var styleProp = templateElement.getAttribute('style').split(';');
        var stylePropChanged;
        var stylePropJoin;
        for (var i = 0; i < styleProp.length; i++) {
            if (styleProp[i].indexOf('left') !== -1) {
                var itemLeftSplit = styleProp[i].split(':');
                var leftValue = parseFloat(itemLeftSplit[(itemLeftSplit.length - 1)]);
                textSizeWidth = position.indexOf('Left') != -1 ? leftValue : position.indexOf('Right') === -1 ? leftValue - (width / 2) : leftValue - width;
                styleProp[i] = 'left:' + textSizeWidth + 'px';
            }
            else if (styleProp[i].indexOf('top') !== -1) {
                var itemTopSplit = styleProp[i].split(':');
                var topValue = parseFloat(itemTopSplit[(itemTopSplit.length - 1)]);
                textSizeHeight = position.indexOf('Top') !== -1 ? topValue : position.indexOf('Bottom') === -1 ?
                    (topValue) - (height / 2) : topValue - height;
                styleProp[i] = 'top:' + textSizeHeight + 'px';
            }
            stylePropJoin = styleProp[i] + ';';
            if (i === 0) {
                stylePropChanged = stylePropJoin;
            }
            else {
                stylePropChanged = stylePropChanged.concat(stylePropJoin);
            }
        }
        templateElement.setAttribute('style', stylePropChanged);
    }
};

return Treemap;

}());
