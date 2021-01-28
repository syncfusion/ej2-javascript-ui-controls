window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Toast = (function () {
'use strict';

var CREATED_EVENT = 'CreatedEvent';
var CLOSE_EVENT = 'CloseEvent';
var OPEN_EVENT = 'OpenEvent';
var DESTROY_TIMER = 'DestroyTimer';
var MOUSEOVER_EVENT = 'MouseoverEvent';
var CLOSEBTN = 'e-toast-close-icon';
var ROOT = 'e-toast';
var TOAST_BLAZOR_HIDDEN = 'e-blazor-toast-hidden';
var PROGRESS = 'e-toast-progress';
var HUN_PERCENT = '100%';
var DEFAULT_WIDTH = '300px';
var FULL_WIDTH = 'e-toast-full-width';
var STRING = 'string';
var RELATIVE = 'relative';
var BODY = 'BODY';
var RIGHT = 'Right';
var LEFT = 'Left';
var ELEMENT = 'element';
var ALL = 'All';
var ENTER_KEY = 13;
var SPACE_KEY = 32;
var TOAST_PRE = 'e-toast';
var TOAST_CONTAINER = 'e-toast-container';
var KEYDOWN = 'keydown';
var FIXED = 'fixed';
var ABSOLUTE = 'absolute';
var MOUSE_OVER = 'mouseover';
var MOUSE_LEAVE = 'mouseleave';
var TOAST_ID = 'toast_';
var MIN_SCREEN_WIDTH = 768;
var TOAST_REF_ELEMENT = 'e-toast-ref-element';
var SfToast = /** @class */ (function () {
    function SfToast(element, options, dotnetRef) {
        this.progressObj = [];
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.updateContext(options);
        this.element.blazor__instance = this;
    }
    SfToast.prototype.initialize = function (element) {
        this.refElement = sf.base.createElement('div', { className: TOAST_REF_ELEMENT });
        this.toastContainer = element;
        var parentEle = element.parentElement;
        parentEle.insertBefore(this.refElement, element);
        this.isDevice = sf.base.Browser.isDevice;
        if (this.width === DEFAULT_WIDTH) {
            this.width = (this.isDevice && screen.width < MIN_SCREEN_WIDTH) ? HUN_PERCENT : DEFAULT_WIDTH;
            this.toastContainer.classList.add(FULL_WIDTH);
        }
        if (this.isDevice && screen.width < MIN_SCREEN_WIDTH) {
            new sf.base.Touch(this.element, { swipe: this.swipeHandler.bind(this) });
        }
        this.dotNetRef.invokeMethodAsync(CREATED_EVENT, null);
    };
    SfToast.prototype.show = function (options) {
        this.setAnimation(options);
        var target = typeof (this.target) === STRING ? document.querySelector(this.target) :
            document.body;
        options.rootElement.style.zIndex = sf.popups.getZindexPartial(options.rootElement) + '';
        if (sf.base.isNullOrUndefined(target)) {
            return;
        }
        if (target.tagName === BODY) {
            this.toastContainer.style.position = FIXED;
        }
        else {
            this.toastContainer.style.position = ABSOLUTE;
            target.style.position = RELATIVE;
        }
        target.appendChild(this.toastContainer);
        this.appendToast(options.element);
        var id = parseInt(options.element.id.split(TOAST_ID)[1], 10);
        this.progressObj[id] = { hideEta: null, intervalId: null, maxHideTime: null, element: null, timeOutId: null, progressEle: null };
        this.progressObj[id].element = options.element;
        if (this.extendedTimeout > 0) {
            sf.base.EventHandler.add(options.element, MOUSE_OVER, this.toastHoverAction.bind(this, id));
            sf.base.EventHandler.add(options.element, MOUSE_LEAVE, this.delayedToastProgress.bind(this, id));
        }
        if (options.showProgressBar) {
            this.progressObj[id].progressEle = options.element.querySelector('.' + PROGRESS);
        }
        sf.base.EventHandler.add(options.element, KEYDOWN, this.keyDownHandler, this);
    };
    SfToast.prototype.getDomObject = function (value, element) {
        if (element != null) {
            // tslint:disable-next-line
            return window.sfBlazor.getDomObject(value, element);
        }
        else {
            return null;
        }
    };
    SfToast.prototype.swipeHandler = function (e) {
        var toastEle = sf.base.closest(e.originalEvent.target, '.' + TOAST_PRE + ':not(.' + TOAST_CONTAINER + ')');
        var animation = this.hideAnimation.effect;
        if (!sf.base.isNullOrUndefined(toastEle)) {
            if (e.swipeDirection === RIGHT) {
                this.hideAnimation.effect = 'SlideRightOut';
                this.hide(toastEle);
            }
            else if (e.swipeDirection === LEFT) {
                this.hideAnimation.effect = 'SlideLeftOut';
                this.hide(toastEle);
            }
            this.hideAnimation.effect = animation;
        }
    };
    SfToast.prototype.delayedToastProgress = function (id) {
        var progress = this.progressObj[id];
        var toastEle = progress.element;
        progress.timeOutId = window.setTimeout(this.destroyToast.bind(this, toastEle), this.extendedTimeout);
        progress.maxHideTime = parseFloat(this.extendedTimeout + '');
        progress.hideEta = new Date().getTime() + progress.maxHideTime;
        if (!sf.base.isNullOrUndefined(toastEle.querySelector('.' + PROGRESS))) {
            progress.intervalId = setInterval(this.updateProgressBar.bind(this, progress), 10);
        }
    };
    SfToast.prototype.toastHoverAction = function (id) {
        this.dotNetRef.invokeMethodAsync('ClearTimeout', id);
        clearTimeout(this.progressObj[id].timeOutId);
        clearInterval(this.progressObj[id].intervalId);
        this.progressObj[id].hideEta = 0;
        var toastEle = this.progressObj[id].element;
        if (!sf.base.isNullOrUndefined(toastEle.querySelector('.' + PROGRESS))) {
            this.progressObj[id].progressEle.style.width = '0%';
        }
        this.dotNetRef.invokeMethodAsync(MOUSEOVER_EVENT, id);
    };
    SfToast.prototype.updateProgressBar = function (progressObj) {
        var percentage = ((progressObj.hideEta - (new Date().getTime())) / progressObj.maxHideTime) * 100;
        percentage = this.progressDirection === 'LTR' ? 100 - percentage : percentage;
        progressObj.progressEle.style.width = percentage + '%';
    };
    SfToast.prototype.appendToast = function (toastElement) {
        if (this.newestOnTop && this.toastContainer.childElementCount !== 0) {
            this.toastContainer.insertBefore(toastElement, this.toastContainer.children[0]);
        }
        sf.base.removeClass([toastElement], TOAST_BLAZOR_HIDDEN);
    };
    SfToast.prototype.setAnimation = function (toastObj) {
        var _this = this;
        var proxy = this;
        var showAnimate = this.showAnimation;
        var animate = { duration: showAnimate.duration, name: showAnimate.effect, timingFunction: showAnimate.easing };
        animate.begin = function () { toastObj.element.style.display = ''; };
        animate.end = function () {
            proxy.dotNetRef.invokeMethodAsync(OPEN_EVENT, toastObj.index, _this.getDomObject(ELEMENT, toastObj.element));
        };
        new sf.base.Animation(animate).animate(toastObj.element);
    };
    SfToast.prototype.hide = function (element) {
        if (sf.base.isNullOrUndefined(this.toastContainer) || this.toastContainer.childElementCount === 0) {
            return;
        }
        if (typeof element === STRING && element === ALL) {
            for (var i = 0; i < this.toastContainer.childElementCount; i++) {
                this.destroyToast(this.toastContainer.children[i]);
            }
            return;
        }
        else if (typeof element === STRING && element !== ALL) {
            var ele = this.toastContainer.querySelector('#toast_' + element);
            if (ele) {
                this.destroyToast(ele);
                this.dotNetRef.invokeMethodAsync(DESTROY_TIMER, parseInt(element, 10));
            }
        }
        if (sf.base.isNullOrUndefined(element)) {
            element = (this.newestOnTop ? this.toastContainer.lastElementChild : this.toastContainer.firstElementChild);
        }
        this.destroyToast(element);
        var id = parseInt(element.id.split('toast_')[1], 10);
        this.dotNetRef.invokeMethodAsync(DESTROY_TIMER, id);
    };
    SfToast.prototype.destroyToast = function (element) {
        var proxy = this;
        var hideAnimate = this.hideAnimation;
        var animate = {
            duration: hideAnimate.duration, name: hideAnimate.effect, timingFunction: hideAnimate.easing
        };
        animate.end = function () {
            var id = parseInt(element.id.split('toast_')[1], 10);
            sf.base.detach(element);
            proxy.dotNetRef.invokeMethodAsync(CLOSE_EVENT, id);
        };
        new sf.base.Animation({}).animate(element, animate);
    };
    SfToast.prototype.destroy = function () {
        while (this.toastContainer.attributes.length > 0) {
            this.toastContainer.removeAttribute(this.toastContainer.attributes[0].name);
        }
        var splitNodes = this.toastContainer.children;
        for (var i = splitNodes.length - 1; i >= 0; i--) {
            sf.base.detach(splitNodes[i]);
        }
        if (!sf.base.isNullOrUndefined(this.refElement) && !sf.base.isNullOrUndefined(this.refElement.parentElement)) {
            this.refElement.parentElement.insertBefore(this.toastContainer, this.refElement);
            sf.base.detach(this.refElement);
            this.refElement = undefined;
        }
    };
    SfToast.prototype.keyDownHandler = function (e) {
        if (e.target.classList.contains(CLOSEBTN) &&
            (e.keyCode === ENTER_KEY || e.keyCode === SPACE_KEY)) {
            var target = e.target;
            var toastEle = sf.base.closest(target, '.' + ROOT);
            this.destroyToast(toastEle);
        }
    };
    SfToast.prototype.updateContext = function (toastObj) {
        sf.base.extend(this, this, toastObj);
    };
    return SfToast;
}());
// tslint:disable-next-line
var Toast = {
    initialize: function (element, options, dotnetRef) {
        if (!sf.base.isNullOrUndefined(element)) {
            new SfToast(element, options, dotnetRef);
            element.blazor__instance.initialize(element);
        }
    },
    show: function (toastObj) {
        if (!sf.base.isNullOrUndefined(toastObj.rootElement)) {
            toastObj.rootElement.blazor__instance.updateContext(toastObj);
            toastObj.rootElement.blazor__instance.show(toastObj);
        }
    },
    hide: function (element, toastElement, toastObj) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.updateContext(toastObj);
            element.blazor__instance.hide(toastElement);
        }
    },
    appendToast: function (element, toastElement) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.appendToast(toastElement);
        }
    },
    destroy: function (element) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.destroy();
        }
    }
};

return Toast;

}());
