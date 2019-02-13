import { Animation, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, NotifyPropertyChanges, Property, Touch, attributes, classList, closest, compile, detach, extend, formatUnit, getUniqueID, isNullOrUndefined, isUndefined, setStyleAttribute } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { getZindexPartial } from '@syncfusion/ej2-popups';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ROOT = 'e-toast';
var CONTAINER = 'e-toast-container';
var TITLE = 'e-toast-title';
var WIDTHFULL = 'e-toast-full-width';
var CONTENT = 'e-toast-content';
var MESSAGE = 'e-toast-message';
var ICON = 'e-toast-icon';
var PROGRESS = 'e-toast-progress';
var ACTIOBUTTONS = 'e-toast-actions';
var CLOSEBTN = 'e-toast-close-icon';
var RTL = 'e-rtl';
/**
 * An object that is used to configure the Toast X Y positions.
 */
var ToastPosition = /** @__PURE__ @class */ (function (_super) {
    __extends(ToastPosition, _super);
    function ToastPosition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('Left')
    ], ToastPosition.prototype, "X", void 0);
    __decorate([
        Property('Top')
    ], ToastPosition.prototype, "Y", void 0);
    return ToastPosition;
}(ChildProperty));
/**
 * An object that is used to configure the action button model properties and event.
 */
var ButtonModelProps = /** @__PURE__ @class */ (function (_super) {
    __extends(ButtonModelProps, _super);
    function ButtonModelProps() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(null)
    ], ButtonModelProps.prototype, "model", void 0);
    __decorate([
        Property(null)
    ], ButtonModelProps.prototype, "click", void 0);
    return ButtonModelProps;
}(ChildProperty));
/**
 * An object that is used to configure the animation object of Toast.
 */
var ToastAnimations = /** @__PURE__ @class */ (function (_super) {
    __extends(ToastAnimations, _super);
    function ToastAnimations() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('FadeIn')
    ], ToastAnimations.prototype, "effect", void 0);
    __decorate([
        Property(600)
    ], ToastAnimations.prototype, "duration", void 0);
    __decorate([
        Property('ease')
    ], ToastAnimations.prototype, "easing", void 0);
    return ToastAnimations;
}(ChildProperty));
/**
 * An object that is used to configure the show/hide animation settings of Toast.
 */
var ToastAnimationSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(ToastAnimationSettings, _super);
    function ToastAnimationSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Complex({ effect: 'FadeIn', duration: 600, easing: 'ease' }, ToastAnimations)
    ], ToastAnimationSettings.prototype, "show", void 0);
    __decorate([
        Complex({ effect: 'FadeOut', duration: 600, easing: 'ease' }, ToastAnimations)
    ], ToastAnimationSettings.prototype, "hide", void 0);
    return ToastAnimationSettings;
}(ChildProperty));
/**
 * The Toast is a notification pop-up that showing on desired position which can provide an information to the user.
 *  * ```html
 * <div id="toast"/>
 * <script>
 *   var toastObj = new Toast();
 *   toastObj.appendTo("#toast");
 * </script>
 * ```
 */
var Toast = /** @__PURE__ @class */ (function (_super) {
    __extends(Toast, _super);
    /**
     * Initializes a new instance of the Toast class.
     * @param options  - Specifies Toast model properties as options.
     * @param element  - Specifies the element that is rendered as a Toast.
     */
    function Toast(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Gets the Component module name.
     * @private
     */
    Toast.prototype.getModuleName = function () {
        return 'toast';
    };
    /**
     * Gets the persisted state properties of the Component.
     */
    Toast.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers, attributes and classes.
     */
    Toast.prototype.destroy = function () {
        this.hide('All');
        this.element.classList.remove(CONTAINER);
        setStyleAttribute(this.element, { 'position': '', 'z-index': '' });
        _super.prototype.destroy.call(this);
    };
    /**
     * Initialize the event handler
     * @private
     */
    Toast.prototype.preRender = function () {
        //There is no event handler
        this.isDevice = Browser.isDevice;
        if (this.width === '300px') {
            this.width = (this.isDevice && screen.width < 768) ? '100%' : '300px';
        }
        if (isNullOrUndefined(this.target)) {
            this.target = document.body;
        }
        if (this.enableRtl) {
            this.element.classList.add(RTL);
        }
    };
    /**
     * Initialize the component rendering
     * @private
     */
    Toast.prototype.render = function () {
        this.progressObj = [];
        this.intervalId = [];
        this.titleTemplate = null;
        this.contentTemplate = null;
        this.toastTemplate = null;
        if (this.isDevice && screen.width < 768) {
            new Touch(this.element, { swipe: this.swipeHandler.bind(this) });
        }
    };
    /**
     * To show Toast element on a document with the relative position.
     * @param  {ToastModel} toastObj? - To show Toast element on screen.
     * @returns void
     */
    Toast.prototype.show = function (toastObj) {
        if (!isNullOrUndefined(toastObj)) {
            this.templateChanges(toastObj);
            extend(this, this, toastObj);
        }
        if (isNullOrUndefined(this.toastContainer)) {
            this.toastContainer = this.getContainer();
            var target = typeof (this.target) === 'string' ? document.querySelector(this.target) : this.target;
            if (isNullOrUndefined(target)) {
                return;
            }
            if (target.tagName === 'BODY') {
                this.toastContainer.style.position = 'fixed';
            }
            else {
                this.toastContainer.style.position = 'absolute';
                target.style.position = 'relative';
            }
            this.setPositioning(this.position);
            target.appendChild(this.toastContainer);
        }
        this.toastEle = this.createElement('div', { className: ROOT, id: getUniqueID('toast') });
        this.setWidthHeight();
        this.setCSSClass(this.cssClass);
        (isNullOrUndefined(this.template) || this.template === '') ? this.personalizeToast() : this.templateRendering();
        this.setProgress();
        this.setCloseButton();
        this.setAria();
        this.appendToTarget();
    };
    Toast.prototype.swipeHandler = function (e) {
        var toastEle = closest(e.originalEvent.target, '.' + ROOT + ':not(.' + CONTAINER + ')');
        var hideAnimation = this.animation.hide.effect;
        if (!isNullOrUndefined(toastEle)) {
            if (e.swipeDirection === 'Right') {
                this.animation.hide.effect = 'SlideRightOut';
                this.hide(toastEle);
            }
            else if (e.swipeDirection === 'Left') {
                this.animation.hide.effect = 'SlideLeftOut';
                this.hide(toastEle);
            }
            this.animation.hide.effect = hideAnimation;
        }
    };
    Toast.prototype.templateChanges = function (toastObj) {
        if (!isUndefined(toastObj.content) && !isNullOrUndefined(this.contentTemplate) && this.content !== toastObj.content) {
            this.clearContentTemplate();
        }
        if (!isUndefined(toastObj.title) && !isNullOrUndefined(this.titleTemplate) && this.title !== toastObj.title) {
            this.clearTitleTemplate();
        }
        if (!isUndefined(toastObj.template) && !isNullOrUndefined(this.toastTemplate) && this.template !== toastObj.template) {
            this.clearToastTemplate();
        }
    };
    Toast.prototype.setCSSClass = function (cssClass) {
        if (!isNullOrUndefined(cssClass)) {
            var split = cssClass.indexOf(',') !== -1 ? ',' : ' ';
            classList(this.toastEle, cssClass.split(split), []);
        }
    };
    Toast.prototype.setWidthHeight = function () {
        if (this.width === '300px') {
            this.toastEle.style.width = formatUnit(this.width);
        }
        else if (this.width === '100%') {
            this.toastContainer.classList.add(WIDTHFULL);
        }
        else {
            this.toastEle.style.width = formatUnit(this.width);
            this.toastContainer.classList.remove(WIDTHFULL);
        }
        this.toastEle.style.height = formatUnit(this.height);
    };
    Toast.prototype.templateRendering = function () {
        this.fetchEle(this.toastEle, this.template, 'template');
    };
    /**
     * To Hide Toast element on a document.
     * To Hide all toast element when passing 'All'.
     * @param  {HTMLElement| Element| string} element? - To Hide Toast element on screen.
     * @returns void
     */
    Toast.prototype.hide = function (element) {
        if (isNullOrUndefined(this.toastContainer) || this.toastContainer.childElementCount === 0) {
            return;
        }
        if (typeof element === 'string' && element === 'All') {
            for (var i = 0; i < this.toastContainer.childElementCount; i++) {
                this.destroyToast(this.toastContainer.children[i]);
            }
            return;
        }
        if (isNullOrUndefined(element)) {
            element = (this.newestOnTop ? this.toastContainer.lastElementChild : this.toastContainer.firstElementChild);
        }
        this.destroyToast(element);
    };
    Toast.prototype.fetchEle = function (ele, value, prob) {
        var templateFn;
        var tempVar;
        var tmpArray;
        prob === 'title' ? tempVar = this.titleTemplate : prob === 'content' ? tempVar = this.contentTemplate : tempVar = this.toastTemplate;
        if (!isNullOrUndefined(tempVar)) {
            ele.appendChild(tempVar.cloneNode(true));
            return ele;
        }
        try {
            if (document.querySelectorAll(value).length > 0) {
                var elem = document.querySelector(value);
                ele.appendChild(elem);
                elem.style.display = '';
                var clo = elem.cloneNode(true);
                prob === 'title' ? this.titleTemplate = clo : prob === 'content' ? this.contentTemplate = clo : this.toastTemplate = clo;
            }
        }
        catch (e) {
            templateFn = compile(value);
        }
        if (!isNullOrUndefined(templateFn)) {
            tmpArray = templateFn({}, this, prob);
        }
        if (!isNullOrUndefined(tmpArray) && tmpArray.length > 0 && !(isNullOrUndefined(tmpArray[0].tagName) && tmpArray.length === 1)) {
            [].slice.call(tmpArray).forEach(function (el) {
                if (!isNullOrUndefined(el.tagName)) {
                    el.style.display = '';
                }
                ele.appendChild(el);
            });
        }
        else if (ele.childElementCount === 0) {
            ele.innerHTML = value;
        }
        return ele;
    };
    Toast.prototype.clearProgress = function (intervalId) {
        if (!isNullOrUndefined(this.intervalId[intervalId])) {
            clearInterval(this.intervalId[intervalId]);
            delete this.intervalId[intervalId];
        }
        if (!isNullOrUndefined(this.progressObj[intervalId])) {
            clearInterval(this.progressObj[intervalId].intervalId);
            delete this.progressObj[intervalId];
        }
    };
    Toast.prototype.clearContainerPos = function () {
        var _this = this;
        if (this.customPosition) {
            setStyleAttribute(this.toastContainer, { 'left': '', 'top': '' });
            this.toastContainer = null;
            this.customPosition = false;
        }
        else {
            [ROOT + '-top-left',
                ROOT + '-top-right',
                ROOT + '-bottom-left',
                ROOT + '-bottom-right',
                ROOT + '-bottom-center',
                ROOT + '-top-center',
                ROOT + '-full-width'].forEach(function (pos) {
                if (!isNullOrUndefined(_this.toastContainer) && _this.toastContainer.classList.contains(pos)) {
                    _this.toastContainer.classList.remove(pos);
                }
            });
            this.toastContainer = null;
        }
        if (!isNullOrUndefined(this.titleTemplate)) {
            this.clearTitleTemplate();
        }
        if (!isNullOrUndefined(this.contentTemplate)) {
            this.clearContentTemplate();
        }
        if (!isNullOrUndefined(this.toastTemplate)) {
            this.clearToastTemplate();
        }
    };
    Toast.prototype.clearTitleTemplate = function () {
        this.titleTemplate.style.display = 'none';
        document.body.appendChild(this.titleTemplate);
        this.titleTemplate = null;
    };
    Toast.prototype.clearContentTemplate = function () {
        this.contentTemplate.style.display = 'none';
        document.body.appendChild(this.contentTemplate);
        this.contentTemplate = null;
    };
    Toast.prototype.clearToastTemplate = function () {
        this.toastTemplate.style.display = 'none';
        document.body.appendChild(this.toastTemplate);
        this.toastTemplate = null;
    };
    Toast.prototype.destroyToast = function (toastEle) {
        var _this = this;
        var hideAnimate = this.animation.hide;
        var animate = {
            duration: hideAnimate.duration, name: hideAnimate.effect, timingFunction: hideAnimate.easing
        };
        var intervalId = parseInt(toastEle.id.split('toast_')[1], 10);
        var toastClose = {
            toastContainer: this.toastContainer,
            toastObj: this,
        };
        if (!isNullOrUndefined(this.progressObj[intervalId]) && !isNullOrUndefined(toastEle.querySelector('.' + PROGRESS))) {
            this.progressObj[intervalId].progressEle.style.width = '0%';
        }
        animate.end = function () {
            _this.clearProgress(intervalId);
            detach(toastEle);
            _this.trigger('close', toastClose);
            if (_this.toastContainer.childElementCount === 0) {
                _this.clearContainerPos();
            }
        };
        new Animation({}).animate(toastEle, animate);
    };
    Toast.prototype.personalizeToast = function () {
        this.setIcon();
        this.setTitle();
        this.setContent();
        this.actionButtons();
    };
    Toast.prototype.setAria = function () {
        attributes(this.toastEle, { 'role': 'alert' });
    };
    Toast.prototype.setPositioning = function (pos) {
        if (typeof (pos.X) === 'number' || typeof (pos.Y) === 'number' || pos.X.indexOf('%') !== -1 || pos.Y.indexOf('%') !== -1) {
            setStyleAttribute(this.toastContainer, { 'left': formatUnit(pos.X), 'top': formatUnit(pos.Y) });
            this.customPosition = true;
        }
        else {
            this.toastContainer.classList.add(ROOT + '-' + pos.Y.toString().toLowerCase() + '-' + pos.X.toString().toLowerCase());
        }
    };
    Toast.prototype.setCloseButton = function () {
        if (!this.showCloseButton) {
            return;
        }
        var closeBtn = this.createElement('div', { className: CLOSEBTN + ' e-icons ' });
        this.toastEle.appendChild(closeBtn);
    };
    Toast.prototype.setProgress = function () {
        if (this.timeOut > 0) {
            var id = parseInt(this.toastEle.id.split('toast_')[1], 10);
            this.intervalId[id] = window.setTimeout(this.destroyToast.bind(this, this.toastEle), this.timeOut);
            this.progressObj[id] = { hideEta: null, intervalId: null, maxHideTime: null, element: null, timeOutId: null, progressEle: null };
            this.progressObj[id].maxHideTime = parseFloat(this.timeOut + '');
            this.progressObj[id].hideEta = new Date().getTime() + this.progressObj[id].maxHideTime;
            this.progressObj[id].element = this.toastEle;
            if (this.extendedTimeout > 0) {
                EventHandler.add(this.toastEle, 'mouseover', this.toastHoverAction.bind(this, id));
                EventHandler.add(this.toastEle, 'mouseleave', this.delayedToastProgress.bind(this, id));
                this.progressObj[id].timeOutId = this.intervalId[id];
            }
            if (this.showProgressBar) {
                this.progressBarEle = this.createElement('div', { className: PROGRESS });
                this.toastEle.insertBefore(this.progressBarEle, this.toastEle.children[0]);
                this.progressObj[id].intervalId = setInterval(this.updateProgressBar.bind(this, this.progressObj[id]), 10);
                this.progressObj[id].progressEle = this.progressBarEle;
            }
        }
    };
    Toast.prototype.toastHoverAction = function (id) {
        clearTimeout(this.progressObj[id].timeOutId);
        clearInterval(this.progressObj[id].intervalId);
        this.progressObj[id].hideEta = 0;
        var toastEle = this.progressObj[id].element;
        if (!isNullOrUndefined(toastEle.querySelector('.' + PROGRESS))) {
            this.progressObj[id].progressEle.style.width = '0%';
        }
    };
    Toast.prototype.delayedToastProgress = function (id) {
        var progress = this.progressObj[id];
        var toastEle = progress.element;
        progress.timeOutId = window.setTimeout(this.destroyToast.bind(this, toastEle), this.extendedTimeout);
        progress.maxHideTime = parseFloat(this.extendedTimeout + '');
        progress.hideEta = new Date().getTime() + progress.maxHideTime;
        if (!isNullOrUndefined(toastEle.querySelector('.' + PROGRESS))) {
            progress.intervalId = setInterval(this.updateProgressBar.bind(this, progress), 10);
        }
    };
    Toast.prototype.updateProgressBar = function (progressObj) {
        var percentage = ((progressObj.hideEta - (new Date().getTime())) / progressObj.maxHideTime) * 100;
        progressObj.progressEle.style.width = percentage + '%';
    };
    Toast.prototype.setIcon = function () {
        if (isNullOrUndefined(this.icon) || this.icon.length === 0) {
            return;
        }
        var iconEle = this.createElement('div', { className: ICON + ' e-icons ' + this.icon });
        this.toastEle.appendChild(iconEle);
    };
    Toast.prototype.setTitle = function () {
        if (isNullOrUndefined(this.title)) {
            return;
        }
        var titleEle = this.createElement('div', { className: TITLE });
        titleEle = this.fetchEle(titleEle, this.title, 'title');
        var msgContainer = this.createElement('div', { className: MESSAGE });
        msgContainer.appendChild(titleEle);
        this.toastEle.appendChild(msgContainer);
    };
    Toast.prototype.setContent = function () {
        var contentEle = this.createElement('div', { className: CONTENT });
        var ele = this.element;
        if (isNullOrUndefined(this.content) || this.content === '') {
            var isContent = this.element.innerHTML.replace(/\s/g, '') !== '';
            if ((ele.children.length > 0 || isContent) && !ele.firstElementChild.classList.contains(ROOT)) {
                this.innerEle = document.createDocumentFragment();
                var tempEle_1 = this.createElement('div');
                while (ele.childNodes.length !== 0) {
                    this.innerEle.appendChild(this.element.childNodes[0]);
                }
                contentEle.appendChild(this.innerEle);
                [].slice.call(contentEle.children).forEach(function (ele) {
                    tempEle_1.appendChild(ele.cloneNode(true));
                });
                this.content = tempEle_1;
                this.appendMessageContainer(contentEle);
            }
        }
        else {
            if (typeof (this.content) === 'object' && !isNullOrUndefined(this.content.tagName)) {
                contentEle.appendChild(this.content);
                this.content = this.content.cloneNode(true);
                this.appendMessageContainer(contentEle);
            }
            else {
                contentEle = this.fetchEle(contentEle, this.content, 'content');
                this.appendMessageContainer(contentEle);
            }
        }
    };
    Toast.prototype.appendMessageContainer = function (element) {
        if (this.toastEle.querySelectorAll('.' + MESSAGE).length > 0) {
            this.toastEle.querySelector('.' + MESSAGE).appendChild(element);
        }
        else {
            var msgContainer = this.createElement('div', { className: MESSAGE });
            msgContainer.appendChild(element);
            this.toastEle.appendChild(msgContainer);
        }
    };
    Toast.prototype.actionButtons = function () {
        var _this = this;
        var actionBtnContainer = this.createElement('div', { className: ACTIOBUTTONS });
        [].slice.call(this.buttons).forEach(function (actionBtn) {
            if (isNullOrUndefined(actionBtn.model)) {
                return;
            }
            var btnDom = _this.createElement('button');
            btnDom.setAttribute('type', 'button');
            if (isNullOrUndefined(actionBtn.model.cssClass) || actionBtn.model.cssClass.length === 0) {
                actionBtn.model.cssClass = 'e-primary';
            }
            btnDom.classList.add('e-small');
            new Button(actionBtn.model, btnDom);
            if (!isNullOrUndefined(actionBtn.click) && typeof (actionBtn.click) === 'function') {
                EventHandler.add(btnDom, 'click', actionBtn.click);
            }
            actionBtnContainer.appendChild(btnDom);
        });
        if (actionBtnContainer.childElementCount > 0) {
            this.appendMessageContainer(actionBtnContainer);
        }
    };
    Toast.prototype.appendToTarget = function () {
        var toastBeforeOpen = {
            toastObj: this,
            element: this.toastEle,
            cancel: false
        };
        this.trigger('beforeOpen', toastBeforeOpen);
        if (toastBeforeOpen.cancel) {
            return;
        }
        this.toastEle.style.display = 'none';
        if (this.newestOnTop && this.toastContainer.childElementCount !== 0) {
            this.toastContainer.insertBefore(this.toastEle, this.toastContainer.children[0]);
        }
        else {
            this.toastContainer.appendChild(this.toastEle);
        }
        EventHandler.add(this.toastEle, 'click', this.clickHandler, this);
        this.toastContainer.style.zIndex = getZindexPartial(this.toastContainer) + '';
        this.displayToast(this.toastEle);
    };
    Toast.prototype.clickHandler = function (e) {
        e.stopPropagation();
        var target = e.target;
        var toastEle = closest(target, '.' + ROOT);
        var clickArgs = {
            element: toastEle, cancel: false, clickToClose: false, originalEvent: e, toastObj: this
        };
        var isCloseIcon = target.classList.contains(CLOSEBTN);
        this.trigger('click', clickArgs);
        if ((isCloseIcon && !clickArgs.cancel) || clickArgs.clickToClose) {
            this.destroyToast(toastEle);
        }
    };
    Toast.prototype.displayToast = function (toastEle) {
        var _this = this;
        var showAnimate = this.animation.show;
        var animate = {
            duration: showAnimate.duration, name: showAnimate.effect, timingFunction: showAnimate.easing
        };
        var toastOpen = {
            toastObj: this,
            element: this.toastEle,
        };
        animate.begin = function () {
            toastEle.style.display = '';
        };
        animate.end = function () {
            _this.trigger('open', toastOpen);
        };
        new Animation(animate).animate(toastEle);
    };
    Toast.prototype.getContainer = function () {
        this.element.classList.add(CONTAINER);
        return this.element;
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    Toast.prototype.onPropertyChanged = function (newProp, oldProp) {
        var container = this.element;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'enableRtl':
                    newProp.enableRtl ? container.classList.add(RTL) : container.classList.remove(RTL);
                    break;
            }
        }
    };
    __decorate([
        Property('300px')
    ], Toast.prototype, "width", void 0);
    __decorate([
        Property('auto')
    ], Toast.prototype, "height", void 0);
    __decorate([
        Property(null)
    ], Toast.prototype, "title", void 0);
    __decorate([
        Property(null)
    ], Toast.prototype, "content", void 0);
    __decorate([
        Property(null)
    ], Toast.prototype, "icon", void 0);
    __decorate([
        Property(null)
    ], Toast.prototype, "cssClass", void 0);
    __decorate([
        Property(null)
    ], Toast.prototype, "template", void 0);
    __decorate([
        Property(true)
    ], Toast.prototype, "newestOnTop", void 0);
    __decorate([
        Property(false)
    ], Toast.prototype, "showCloseButton", void 0);
    __decorate([
        Property(false)
    ], Toast.prototype, "showProgressBar", void 0);
    __decorate([
        Property(5000)
    ], Toast.prototype, "timeOut", void 0);
    __decorate([
        Property(1000)
    ], Toast.prototype, "extendedTimeout", void 0);
    __decorate([
        Complex({}, ToastAnimationSettings)
    ], Toast.prototype, "animation", void 0);
    __decorate([
        Complex({}, ToastPosition)
    ], Toast.prototype, "position", void 0);
    __decorate([
        Collection([{}], ButtonModelProps)
    ], Toast.prototype, "buttons", void 0);
    __decorate([
        Property(null)
    ], Toast.prototype, "target", void 0);
    __decorate([
        Event()
    ], Toast.prototype, "created", void 0);
    __decorate([
        Event()
    ], Toast.prototype, "destroyed", void 0);
    __decorate([
        Event()
    ], Toast.prototype, "open", void 0);
    __decorate([
        Event()
    ], Toast.prototype, "beforeOpen", void 0);
    __decorate([
        Event()
    ], Toast.prototype, "close", void 0);
    __decorate([
        Event()
    ], Toast.prototype, "click", void 0);
    Toast = __decorate([
        NotifyPropertyChanges
    ], Toast);
    return Toast;
}(Component));

/**
 * Toast modules
 */

/**
 * Notification Components
 */

export { ToastPosition, ButtonModelProps, ToastAnimations, ToastAnimationSettings, Toast };
//# sourceMappingURL=ej2-notifications.es5.js.map
