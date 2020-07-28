window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Chart = (function () {
'use strict';

/**
 * Chart native blazor source file
 */
//tslint:disable
var Chart = {
    getElementBoundsById: function (id) {
        var element = document.getElementById(id);
        return { width: element.clientWidth || element.offsetWidth, height: element.clientHeight || element.offsetHeight };
    },
    wireEvents: function (id, dotnetref) {
        var element = document.getElementById(id);
        if (!element) {
            return;
        }
        /*! Find the Events type */
        var cancelEvent = sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        sf.base.EventHandler.add(element, sf.base.Browser.touchStartEvent, this.chartOnMouseDown, { this: this, dotnetref: dotnetref });
        sf.base.EventHandler.add(element, sf.base.Browser.touchMoveEvent, this.mouseMove, { this: this, dotnetref: dotnetref });
        sf.base.EventHandler.add(element, sf.base.Browser.touchEndEvent, this.mouseEnd, { this: this, dotnetref: dotnetref });
        sf.base.EventHandler.add(element, 'click', this.chartOnMouseClick, { this: this, dotnetref: dotnetref });
        sf.base.EventHandler.add(element, 'contextmenu', this.chartRightClick, { this: this, dotnetref: dotnetref });
        sf.base.EventHandler.add(element, cancelEvent, this.mouseLeave, { this: this, dotnetref: dotnetref });
        this.resizeBound = this.chartResize.bind({ this: this, dotnetref: dotnetref });
        window.addEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.resizeBound);
        this.longPressBound = this.longPress.bind({ this: this, dotnetref: dotnetref });
        this.touchObject = new sf.base.Touch(element, { tapHold: this.longPressBound, tapHoldThreshold: 500 });
        /*! Apply the style for chart */
    },
    getEventArgs: function (e) {
        return {
            type: e.type,
            clientX: e.clientX,
            clientY: e.clientY,
            pointerType: e.pointerType,
            target: e.target,
            changedTouches: e.changedTouches
        };
    },
    chartOnMouseDown: function (e) {
        this.dotnetref.invokeMethodAsync("OnChartMouseDown", this.getEventArgs(e));
        return false;
    },
    mouseMove: function (e) {
        this.dotnetref.invokeMethodAsync("OnChartMouseMove", this.getEventArgs(e));
        return false;
    },
    mouseEnd: function (e) {
        this.dotnetref.invokeMethodAsync("OnChartMouseEnd", this.getEventArgs(e));
        return false;
    },
    chartOnMouseClick: function (e) {
        this.dotnetref.invokeMethodAsync("OnChartMouseClick", this.getEventArgs(e));
        return false;
    },
    chartRightClick: function (e) {
        this.dotnetref.invokeMethodAsync("OnChartRightClick", this.getEventArgs(e));
        return false;
    },
    mouseLeave: function (e) {
        this.dotnetref.invokeMethodAsync("OnChartMouseLeave", this.getEventArgs(e));
        return false;
    },
    chartResize: function (e) {
        this.dotnetref.invokeMethodAsync("OnChartResize");
        return false;
    },
    longPress: function (e) {
        this.dotnetref.invokeMethodAsync("OnChartLongPress");
        return false;
    }
};

return Chart;

}());
