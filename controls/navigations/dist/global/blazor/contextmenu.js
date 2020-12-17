window.sf = window.sf || {};
var sfcontextmenu = (function (exports) {
'use strict';

var __extends$2 = (undefined && undefined.__extends) || (function () {
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
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CLS_ROOT = 'e-hscroll';
var CLS_RTL = 'e-rtl';
var CLS_DISABLE = 'e-overlay';
var CLS_HSCROLLBAR = 'e-hscroll-bar';
var CLS_HSCROLLCON = 'e-hscroll-content';
var CLS_NAVARROW = 'e-nav-arrow';
var CLS_NAVRIGHTARROW = 'e-nav-right-arrow';
var CLS_NAVLEFTARROW = 'e-nav-left-arrow';
var CLS_HSCROLLNAV = 'e-scroll-nav';
var CLS_HSCROLLNAVRIGHT = 'e-scroll-right-nav';
var CLS_HSCROLLNAVLEFT = 'e-scroll-left-nav';
var CLS_DEVICE = 'e-scroll-device';
var CLS_OVERLAY = 'e-scroll-overlay';
var CLS_RIGHTOVERLAY = 'e-scroll-right-overlay';
var CLS_LEFTOVERLAY = 'e-scroll-left-overlay';
var OVERLAY_MAXWID = 40;
/**
 * HScroll module is introduces horizontal scroller when content exceeds the current viewing area.
 * It can be useful for the components like Toolbar, Tab which needs horizontal scrolling alone.
 * Hidden content can be view by touch moving or icon click.
 * ```html
 * <div id="scroll"/>
 * <script>
 *   var scrollObj = new HScroll();
 *   scrollObj.appendTo("#scroll");
 * </script>
 * ```
 */
var HScroll = /** @class */ (function (_super) {
    __extends$2(HScroll, _super);
    /**
     * Initializes a new instance of the HScroll class.
     * @param options  - Specifies HScroll model properties as options.
     * @param element  - Specifies the element for which horizontal scrolling applies.
     */
    function HScroll(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Initialize the event handler
     * @private
     */
    HScroll.prototype.preRender = function () {
        this.browser = sf.base.Browser.info.name;
        this.browserCheck = this.browser === 'mozilla';
        this.isDevice = sf.base.Browser.isDevice;
        this.customStep = true;
        var element = this.element;
        this.ieCheck = this.browser === 'edge' || this.browser === 'msie';
        this.initialize();
        if (element.id === '') {
            element.id = sf.base.getUniqueID('hscroll');
            this.uniqueId = true;
        }
        element.style.display = 'block';
        if (this.enableRtl) {
            element.classList.add(CLS_RTL);
        }
    };
    /**
     * To Initialize the horizontal scroll  rendering
     * @private
     */
    HScroll.prototype.render = function () {
        this.touchModule = new sf.base.Touch(this.element, { scroll: this.touchHandler.bind(this), swipe: this.swipeHandler.bind(this) });
        sf.base.EventHandler.add(this.scrollEle, 'scroll', this.scrollHandler, this);
        if (!this.isDevice) {
            this.createNavIcon(this.element);
        }
        else {
            this.element.classList.add(CLS_DEVICE);
            this.createOverlay(this.element);
        }
        this.setScrollState();
    };
    HScroll.prototype.setScrollState = function () {
        if (sf.base.isNullOrUndefined(this.scrollStep) || this.scrollStep < 0) {
            this.scrollStep = this.scrollEle.offsetWidth;
            this.customStep = false;
        }
        else {
            this.customStep = true;
        }
    };
    HScroll.prototype.initialize = function () {
        var scrollEle = this.createElement('div', { className: CLS_HSCROLLCON });
        var scrollDiv = this.createElement('div', { className: CLS_HSCROLLBAR });
        scrollDiv.setAttribute('tabindex', '-1');
        var ele = this.element;
        var innerEle = [].slice.call(ele.children);
        for (var _i = 0, innerEle_1 = innerEle; _i < innerEle_1.length; _i++) {
            var ele_1 = innerEle_1[_i];
            scrollEle.appendChild(ele_1);
        }
        scrollDiv.appendChild(scrollEle);
        ele.appendChild(scrollDiv);
        scrollDiv.style.overflowX = 'hidden';
        this.scrollEle = scrollDiv;
        this.scrollItems = scrollEle;
    };
    HScroll.prototype.getPersistData = function () {
        var keyEntity = ['scrollStep'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    HScroll.prototype.getModuleName = function () {
        return 'hScroll';
    };
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    HScroll.prototype.destroy = function () {
        var ele = this.element;
        ele.style.display = '';
        ele.classList.remove(CLS_ROOT);
        ele.classList.remove(CLS_DEVICE);
        var nav = sf.base.selectAll('.e-' + ele.id + '_nav.' + CLS_HSCROLLNAV, ele);
        var overlay = sf.base.selectAll('.' + CLS_OVERLAY, ele);
        [].slice.call(overlay).forEach(function (ele) {
            sf.base.detach(ele);
        });
        for (var _i = 0, _a = [].slice.call(this.scrollItems.children); _i < _a.length; _i++) {
            var elem = _a[_i];
            ele.appendChild(elem);
        }
        if (this.uniqueId) {
            this.element.removeAttribute('id');
        }
        sf.base.detach(this.scrollEle);
        if (nav.length > 0) {
            sf.base.detach(nav[0]);
            if (!sf.base.isNullOrUndefined(nav[1])) {
                sf.base.detach(nav[1]);
            }
        }
        sf.base.EventHandler.remove(this.scrollEle, 'scroll', this.scrollHandler);
        this.touchModule.destroy();
        this.touchModule = null;
        _super.prototype.destroy.call(this);
    };
    /**
     * Specifies the value to disable/enable the HScroll component.
     * When set to `true` , the component will be disabled.
     * @param  {boolean} value - Based on this Boolean value, HScroll will be enabled (false) or disabled (true).
     * @returns void.
     */
    HScroll.prototype.disable = function (value) {
        var navEles = sf.base.selectAll('.e-scroll-nav:not(.' + CLS_DISABLE + ')', this.element);
        value ? this.element.classList.add(CLS_DISABLE) : this.element.classList.remove(CLS_DISABLE);
        [].slice.call(navEles).forEach(function (el) {
            el.setAttribute('tabindex', !value ? '0' : '-1');
        });
    };
    HScroll.prototype.createOverlay = function (element) {
        var id = element.id.concat('_nav');
        var rightOverlayEle = this.createElement('div', { className: CLS_OVERLAY + ' ' + CLS_RIGHTOVERLAY });
        var clsRight = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVRIGHT);
        var rightEle = this.createElement('div', { id: id.concat('_right'), className: clsRight });
        var navItem = this.createElement('div', { className: CLS_NAVRIGHTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        rightEle.appendChild(navItem);
        var leftEle = this.createElement('div', { className: CLS_OVERLAY + ' ' + CLS_LEFTOVERLAY });
        if (this.ieCheck) {
            rightEle.classList.add('e-ie-align');
        }
        element.appendChild(rightOverlayEle);
        element.appendChild(rightEle);
        element.insertBefore(leftEle, element.firstChild);
        this.eventBinding([rightEle]);
    };
    HScroll.prototype.createNavIcon = function (element) {
        var id = element.id.concat('_nav');
        var clsRight = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVRIGHT);
        var nav = this.createElement('div', { id: id.concat('_right'), className: clsRight });
        nav.setAttribute('aria-disabled', 'false');
        var navItem = this.createElement('div', { className: CLS_NAVRIGHTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        var clsLeft = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVLEFT);
        var navEle = this.createElement('div', { id: id.concat('_left'), className: clsLeft + ' ' + CLS_DISABLE });
        navEle.setAttribute('aria-disabled', 'true');
        var navLeftItem = this.createElement('div', { className: CLS_NAVLEFTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        navEle.appendChild(navLeftItem);
        nav.appendChild(navItem);
        element.appendChild(nav);
        element.insertBefore(navEle, element.firstChild);
        if (this.ieCheck) {
            nav.classList.add('e-ie-align');
            navEle.classList.add('e-ie-align');
        }
        this.eventBinding([nav, navEle]);
    };
    HScroll.prototype.onKeyPress = function (e) {
        var _this = this;
        if (e.key === 'Enter') {
            var timeoutFun_1 = function () {
                _this.keyTimeout = true;
                _this.eleScrolling(10, e.target, true);
            };
            this.keyTimer = window.setTimeout(function () {
                timeoutFun_1();
            }, 100);
        }
    };
    HScroll.prototype.onKeyUp = function (e) {
        if (e.key !== 'Enter') {
            return;
        }
        if (this.keyTimeout) {
            this.keyTimeout = false;
        }
        else {
            e.target.click();
        }
        clearTimeout(this.keyTimer);
    };
    HScroll.prototype.eventBinding = function (ele) {
        var _this = this;
        [].slice.call(ele).forEach(function (el) {
            new sf.base.Touch(el, { tapHold: _this.tabHoldHandler.bind(_this), tapHoldThreshold: 500 });
            el.addEventListener('keydown', _this.onKeyPress.bind(_this));
            el.addEventListener('keyup', _this.onKeyUp.bind(_this));
            el.addEventListener('mouseup', _this.repeatScroll.bind(_this));
            el.addEventListener('touchend', _this.repeatScroll.bind(_this));
            el.addEventListener('contextmenu', function (e) {
                e.preventDefault();
            });
            sf.base.EventHandler.add(el, 'click', _this.clickEventHandler, _this);
        });
    };
    HScroll.prototype.repeatScroll = function () {
        clearInterval(this.timeout);
    };
    HScroll.prototype.tabHoldHandler = function (e) {
        var _this = this;
        var trgt = e.originalEvent.target;
        trgt = this.contains(trgt, CLS_HSCROLLNAV) ? trgt.firstElementChild : trgt;
        var scrollDis = 10;
        var timeoutFun = function () {
            _this.eleScrolling(scrollDis, trgt, true);
        };
        this.timeout = window.setInterval(function () {
            timeoutFun();
        }, 50);
    };
    HScroll.prototype.contains = function (ele, className) {
        return ele.classList.contains(className);
    };
    HScroll.prototype.eleScrolling = function (scrollDis, trgt, isContinuous) {
        var element = this.scrollEle;
        var rootEle = this.element;
        var classList$$1 = trgt.classList;
        if (classList$$1.contains(CLS_HSCROLLNAV)) {
            classList$$1 = trgt.querySelector('.' + CLS_NAVARROW).classList;
        }
        if (this.contains(rootEle, CLS_RTL) && this.browserCheck) {
            scrollDis = -scrollDis;
        }
        var scrlLeft = element.scrollLeft;
        if ((!this.contains(rootEle, CLS_RTL) || this.browserCheck) || this.ieCheck) {
            if (classList$$1.contains(CLS_NAVRIGHTARROW)) {
                this.frameScrollRequest(scrollDis, 'add', isContinuous);
            }
            else {
                this.frameScrollRequest(scrollDis, '', isContinuous);
            }
        }
        else {
            if (classList$$1.contains(CLS_NAVLEFTARROW)) {
                this.frameScrollRequest(scrollDis, 'add', isContinuous);
            }
            else {
                this.frameScrollRequest(scrollDis, '', isContinuous);
            }
        }
    };
    HScroll.prototype.clickEventHandler = function (e) {
        this.eleScrolling(this.scrollStep, e.target, false);
    };
    HScroll.prototype.swipeHandler = function (e) {
        var swipeEle = this.scrollEle;
        var distance;
        if (e.velocity <= 1) {
            distance = e.distanceX / (e.velocity * 10);
        }
        else {
            distance = e.distanceX / e.velocity;
        }
        var start = 0.5;
        var animate = function () {
            var step = Math.sin(start);
            if (step <= 0) {
                window.cancelAnimationFrame(step);
            }
            else {
                if (e.swipeDirection === 'Left') {
                    swipeEle.scrollLeft += distance * step;
                }
                else if (e.swipeDirection === 'Right') {
                    swipeEle.scrollLeft -= distance * step;
                }
                start -= 0.5;
                window.requestAnimationFrame(animate);
            }
        };
        animate();
    };
    HScroll.prototype.scrollUpdating = function (scrollVal, action) {
        if (action === 'add') {
            this.scrollEle.scrollLeft += scrollVal;
        }
        else {
            this.scrollEle.scrollLeft -= scrollVal;
        }
    };
    HScroll.prototype.frameScrollRequest = function (scrollVal, action, isContinuous) {
        var _this = this;
        var step = 10;
        if (isContinuous) {
            this.scrollUpdating(scrollVal, action);
            return;
        }
        if (!this.customStep) {
            [].slice.call(sf.base.selectAll('.' + CLS_OVERLAY, this.element)).forEach(function (el) {
                scrollVal -= el.offsetWidth;
            });
        }
        var animate = function () {
            var scrollValue;
            var scrollStep;
            if (_this.contains(_this.element, CLS_RTL) && _this.browserCheck) {
                scrollValue = -scrollVal;
                scrollStep = -step;
            }
            else {
                scrollValue = scrollVal;
                scrollStep = step;
            }
            if (scrollValue < step) {
                window.cancelAnimationFrame(scrollStep);
            }
            else {
                _this.scrollUpdating(scrollStep, action);
                scrollVal -= scrollStep;
                window.requestAnimationFrame(animate);
            }
        };
        animate();
    };
    HScroll.prototype.touchHandler = function (e) {
        var ele = this.scrollEle;
        var distance;
        distance = e.distanceX;
        if ((this.ieCheck) && this.contains(this.element, CLS_RTL)) {
            distance = -distance;
        }
        if (e.scrollDirection === 'Left') {
            ele.scrollLeft = ele.scrollLeft + distance;
        }
        else if (e.scrollDirection === 'Right') {
            ele.scrollLeft = ele.scrollLeft - distance;
        }
    };
    HScroll.prototype.arrowDisabling = function (addDisable, removeDisable) {
        if (this.isDevice) {
            var arrowEle = sf.base.isNullOrUndefined(addDisable) ? removeDisable : addDisable;
            var arrowIcon = arrowEle.querySelector('.' + CLS_NAVARROW);
            if (sf.base.isNullOrUndefined(addDisable)) {
                sf.base.classList(arrowIcon, [CLS_NAVRIGHTARROW], [CLS_NAVLEFTARROW]);
            }
            else {
                sf.base.classList(arrowIcon, [CLS_NAVLEFTARROW], [CLS_NAVRIGHTARROW]);
            }
        }
        else {
            addDisable.classList.add(CLS_DISABLE);
            addDisable.setAttribute('aria-disabled', 'true');
            addDisable.removeAttribute('tabindex');
            removeDisable.classList.remove(CLS_DISABLE);
            removeDisable.setAttribute('aria-disabled', 'false');
            removeDisable.setAttribute('tabindex', '0');
        }
        this.repeatScroll();
    };
    HScroll.prototype.scrollHandler = function (e) {
        var target = e.target;
        var width = target.offsetWidth;
        var rootEle = this.element;
        var navLeftEle = this.element.querySelector('.' + CLS_HSCROLLNAVLEFT);
        var navRightEle = this.element.querySelector('.' + CLS_HSCROLLNAVRIGHT);
        var leftOverlay = this.element.querySelector('.' + CLS_LEFTOVERLAY);
        var rightOverlay = this.element.querySelector('.' + CLS_RIGHTOVERLAY);
        var scrollLeft = target.scrollLeft;
        if (scrollLeft <= 0) {
            scrollLeft = -scrollLeft;
        }
        if (this.isDevice) {
            if (this.enableRtl && !(this.browserCheck || this.ieCheck)) {
                leftOverlay = this.element.querySelector('.' + CLS_RIGHTOVERLAY);
                rightOverlay = this.element.querySelector('.' + CLS_LEFTOVERLAY);
            }
            if (scrollLeft < OVERLAY_MAXWID) {
                leftOverlay.style.width = scrollLeft + 'px';
            }
            else {
                leftOverlay.style.width = '40px';
            }
            if ((target.scrollWidth - Math.ceil(width + scrollLeft)) < OVERLAY_MAXWID) {
                rightOverlay.style.width = (target.scrollWidth - Math.ceil(width + scrollLeft)) + 'px';
            }
            else {
                rightOverlay.style.width = '40px';
            }
        }
        if (scrollLeft === 0) {
            if ((!this.contains(rootEle, CLS_RTL) || this.browserCheck) || this.ieCheck) {
                this.arrowDisabling(navLeftEle, navRightEle);
            }
            else {
                this.arrowDisabling(navRightEle, navLeftEle);
            }
        }
        else if (Math.ceil(width + scrollLeft + .1) >= target.scrollWidth) {
            if ((!this.contains(rootEle, CLS_RTL) || this.browserCheck) || this.ieCheck) {
                this.arrowDisabling(navRightEle, navLeftEle);
            }
            else {
                this.arrowDisabling(navLeftEle, navRightEle);
            }
        }
        else {
            var disEle = this.element.querySelector('.' + CLS_HSCROLLNAV + '.' + CLS_DISABLE);
            if (disEle) {
                disEle.classList.remove(CLS_DISABLE);
                disEle.setAttribute('aria-disabled', 'false');
                disEle.setAttribute('tabindex', '0');
            }
        }
    };
    /**
     * Gets called when the model property changes.The data that describes the old and new values of property that changed.
     * @param  {HScrollModel} newProp
     * @param  {HScrollModel} oldProp
     * @returns void
     * @private
     */
    HScroll.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'scrollStep':
                    this.setScrollState();
                    break;
                case 'enableRtl':
                    newProp.enableRtl ? this.element.classList.add(CLS_RTL) : this.element.classList.remove(CLS_RTL);
                    break;
            }
        }
    };
    __decorate$2([
        sf.base.Property(null)
    ], HScroll.prototype, "scrollStep", void 0);
    HScroll = __decorate$2([
        sf.base.NotifyPropertyChanges
    ], HScroll);
    return HScroll;
}(sf.base.Component));

var __extends$3 = (undefined && undefined.__extends) || (function () {
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
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CLS_ROOT$1 = 'e-vscroll';
var CLS_RTL$1 = 'e-rtl';
var CLS_DISABLE$1 = 'e-overlay';
var CLS_VSCROLLBAR = 'e-vscroll-bar';
var CLS_VSCROLLCON = 'e-vscroll-content';
var CLS_NAVARROW$1 = 'e-nav-arrow';
var CLS_NAVUPARROW = 'e-nav-up-arrow';
var CLS_NAVDOWNARROW = 'e-nav-down-arrow';
var CLS_VSCROLLNAV = 'e-scroll-nav';
var CLS_VSCROLLNAVUP = 'e-scroll-up-nav';
var CLS_VSCROLLNAVDOWN = 'e-scroll-down-nav';
var CLS_DEVICE$1 = 'e-scroll-device';
var CLS_OVERLAY$1 = 'e-scroll-overlay';
var CLS_UPOVERLAY = 'e-scroll-up-overlay';
var CLS_DOWNOVERLAY = 'e-scroll-down-overlay';
var OVERLAY_MAXWID$1 = 40;
/**
 * VScroll module is introduces vertical scroller when content exceeds the current viewing area.
 * It can be useful for the components like Toolbar, Tab which needs vertical scrolling alone.
 * Hidden content can be view by touch moving or icon click.
 * ```html
 * <div id="scroll"/>
 * <script>
 *   var scrollObj = new VScroll();
 *   scrollObj.appendTo("#scroll");
 * </script>
 * ```
 */
var VScroll = /** @class */ (function (_super) {
    __extends$3(VScroll, _super);
    /**
     * Initializes a new instance of the VScroll class.
     * @param options  - Specifies VScroll model properties as options.
     * @param element  - Specifies the element for which vertical scrolling applies.
     */
    function VScroll(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Initialize the event handler
     * @private
     */
    VScroll.prototype.preRender = function () {
        this.browser = sf.base.Browser.info.name;
        this.browserCheck = this.browser === 'mozilla';
        this.isDevice = sf.base.Browser.isDevice;
        this.customStep = true;
        var ele = this.element;
        this.ieCheck = this.browser === 'edge' || this.browser === 'msie';
        this.initialize();
        if (ele.id === '') {
            ele.id = sf.base.getUniqueID('vscroll');
            this.uniqueId = true;
        }
        ele.style.display = 'block';
        if (this.enableRtl) {
            ele.classList.add(CLS_RTL$1);
        }
    };
    /**
     * To Initialize the vertical scroll rendering
     * @private
     */
    VScroll.prototype.render = function () {
        this.touchModule = new sf.base.Touch(this.element, { scroll: this.touchHandler.bind(this), swipe: this.swipeHandler.bind(this) });
        sf.base.EventHandler.add(this.scrollEle, 'scroll', this.scrollEventHandler, this);
        if (!this.isDevice) {
            this.createNavIcon(this.element);
        }
        else {
            this.element.classList.add(CLS_DEVICE$1);
            this.createOverlayElement(this.element);
        }
        this.setScrollState();
        sf.base.EventHandler.add(this.element, 'wheel', this.wheelEventHandler, this);
    };
    VScroll.prototype.setScrollState = function () {
        if (sf.base.isNullOrUndefined(this.scrollStep) || this.scrollStep < 0) {
            this.scrollStep = this.scrollEle.offsetHeight;
            this.customStep = false;
        }
        else {
            this.customStep = true;
        }
    };
    VScroll.prototype.initialize = function () {
        var scrollCnt = sf.base.createElement('div', { className: CLS_VSCROLLCON });
        var scrollBar = sf.base.createElement('div', { className: CLS_VSCROLLBAR });
        scrollBar.setAttribute('tabindex', '-1');
        var ele = this.element;
        var innerEle = [].slice.call(ele.children);
        for (var _i = 0, innerEle_1 = innerEle; _i < innerEle_1.length; _i++) {
            var ele_1 = innerEle_1[_i];
            scrollCnt.appendChild(ele_1);
        }
        scrollBar.appendChild(scrollCnt);
        ele.appendChild(scrollBar);
        scrollBar.style.overflowY = 'hidden';
        this.scrollEle = scrollBar;
        this.scrollItems = scrollCnt;
    };
    VScroll.prototype.getPersistData = function () {
        var keyEntity = ['scrollStep'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    VScroll.prototype.getModuleName = function () {
        return 'vScroll';
    };
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    VScroll.prototype.destroy = function () {
        var el = this.element;
        el.style.display = '';
        sf.base.removeClass([this.element], [CLS_ROOT$1, CLS_DEVICE$1]);
        var navs = sf.base.selectAll('.e-' + el.id + '_nav.' + CLS_VSCROLLNAV, el);
        var overlays = sf.base.selectAll('.' + CLS_OVERLAY$1, el);
        [].slice.call(overlays).forEach(function (ele) {
            sf.base.detach(ele);
        });
        for (var _i = 0, _a = [].slice.call(this.scrollItems.children); _i < _a.length; _i++) {
            var elem = _a[_i];
            el.appendChild(elem);
        }
        if (this.uniqueId) {
            this.element.removeAttribute('id');
        }
        sf.base.detach(this.scrollEle);
        if (navs.length > 0) {
            sf.base.detach(navs[0]);
            if (!sf.base.isNullOrUndefined(navs[1])) {
                sf.base.detach(navs[1]);
            }
        }
        sf.base.EventHandler.remove(this.scrollEle, 'scroll', this.scrollEventHandler);
        this.touchModule.destroy();
        this.touchModule = null;
        _super.prototype.destroy.call(this);
    };
    /**
     * Specifies the value to disable/enable the VScroll component.
     * When set to `true` , the component will be disabled.
     * @param  {boolean} value - Based on this Boolean value, VScroll will be enabled (false) or disabled (true).
     * @returns void.
     */
    VScroll.prototype.disable = function (value) {
        var navEle = sf.base.selectAll('.e-scroll-nav:not(.' + CLS_DISABLE$1 + ')', this.element);
        value ? this.element.classList.add(CLS_DISABLE$1) : this.element.classList.remove(CLS_DISABLE$1);
        [].slice.call(navEle).forEach(function (el) {
            el.setAttribute('tabindex', !value ? '0' : '-1');
        });
    };
    VScroll.prototype.createOverlayElement = function (element) {
        var id = element.id.concat('_nav');
        var downOverlayEle = sf.base.createElement('div', { className: CLS_OVERLAY$1 + ' ' + CLS_DOWNOVERLAY });
        var clsDown = 'e-' + element.id.concat('_nav ' + CLS_VSCROLLNAV + ' ' + CLS_VSCROLLNAVDOWN);
        var downEle = sf.base.createElement('div', { id: id.concat('down'), className: clsDown });
        var navItem = sf.base.createElement('div', { className: CLS_NAVDOWNARROW + ' ' + CLS_NAVARROW$1 + ' e-icons' });
        downEle.appendChild(navItem);
        var upEle = sf.base.createElement('div', { className: CLS_OVERLAY$1 + ' ' + CLS_UPOVERLAY });
        if (this.ieCheck) {
            downEle.classList.add('e-ie-align');
        }
        element.appendChild(downOverlayEle);
        element.appendChild(downEle);
        element.insertBefore(upEle, element.firstChild);
        this.eventBinding([downEle]);
    };
    VScroll.prototype.createNavIcon = function (element) {
        var id = element.id.concat('_nav');
        var clsDown = 'e-' + element.id.concat('_nav ' + CLS_VSCROLLNAV + ' ' + CLS_VSCROLLNAVDOWN);
        var nav = sf.base.createElement('div', { id: id.concat('_down'), className: clsDown });
        nav.setAttribute('aria-disabled', 'false');
        var navItem = sf.base.createElement('div', { className: CLS_NAVDOWNARROW + ' ' + CLS_NAVARROW$1 + ' e-icons' });
        var clsUp = 'e-' + element.id.concat('_nav ' + CLS_VSCROLLNAV + ' ' + CLS_VSCROLLNAVUP);
        var navElement = sf.base.createElement('div', { id: id.concat('_up'), className: clsUp + ' ' + CLS_DISABLE$1 });
        navElement.setAttribute('aria-disabled', 'true');
        var navUpItem = sf.base.createElement('div', { className: CLS_NAVUPARROW + ' ' + CLS_NAVARROW$1 + ' e-icons' });
        navElement.appendChild(navUpItem);
        nav.appendChild(navItem);
        nav.setAttribute('tabindex', '0');
        element.appendChild(nav);
        element.insertBefore(navElement, element.firstChild);
        if (this.ieCheck) {
            nav.classList.add('e-ie-align');
            navElement.classList.add('e-ie-align');
        }
        this.eventBinding([nav, navElement]);
    };
    VScroll.prototype.onKeyPress = function (ev) {
        var _this = this;
        if (ev.key === 'Enter') {
            var timeoutFun_1 = function () {
                _this.keyTimeout = true;
                _this.eleScrolling(10, ev.target, true);
            };
            this.keyTimer = window.setTimeout(function () { timeoutFun_1(); }, 100);
        }
    };
    VScroll.prototype.onKeyUp = function (ev) {
        if (ev.key !== 'Enter') {
            return;
        }
        if (this.keyTimeout) {
            this.keyTimeout = false;
        }
        else {
            ev.target.click();
        }
        clearTimeout(this.keyTimer);
    };
    VScroll.prototype.eventBinding = function (element) {
        var _this = this;
        [].slice.call(element).forEach(function (ele) {
            new sf.base.Touch(ele, { tapHold: _this.tabHoldHandler.bind(_this), tapHoldThreshold: 500 });
            ele.addEventListener('keydown', _this.onKeyPress.bind(_this));
            ele.addEventListener('keyup', _this.onKeyUp.bind(_this));
            ele.addEventListener('mouseup', _this.repeatScroll.bind(_this));
            ele.addEventListener('touchend', _this.repeatScroll.bind(_this));
            ele.addEventListener('contextmenu', function (e) {
                e.preventDefault();
            });
            sf.base.EventHandler.add(ele, 'click', _this.clickEventHandler, _this);
        });
    };
    VScroll.prototype.repeatScroll = function () {
        clearInterval(this.timeout);
    };
    VScroll.prototype.tabHoldHandler = function (ev) {
        var _this = this;
        var trgt = ev.originalEvent.target;
        trgt = this.contains(trgt, CLS_VSCROLLNAV) ? trgt.firstElementChild : trgt;
        var scrollDistance = 10;
        var timeoutFun = function () {
            _this.eleScrolling(scrollDistance, trgt, true);
        };
        this.timeout = window.setInterval(function () { timeoutFun(); }, 50);
    };
    VScroll.prototype.contains = function (element, className) {
        return element.classList.contains(className);
    };
    VScroll.prototype.eleScrolling = function (scrollDis, trgt, isContinuous) {
        var rootElement = this.element;
        var classList$$1 = trgt.classList;
        if (classList$$1.contains(CLS_VSCROLLNAV)) {
            classList$$1 = trgt.querySelector('.' + CLS_NAVARROW$1).classList;
        }
        if (classList$$1.contains(CLS_NAVDOWNARROW)) {
            this.frameScrollRequest(scrollDis, 'add', isContinuous);
        }
        else if (classList$$1.contains(CLS_NAVUPARROW)) {
            this.frameScrollRequest(scrollDis, '', isContinuous);
        }
    };
    VScroll.prototype.clickEventHandler = function (event) {
        this.eleScrolling(this.scrollStep, event.target, false);
    };
    VScroll.prototype.wheelEventHandler = function (e) {
        e.preventDefault();
        this.frameScrollRequest(this.scrollStep, (e.deltaY > 0 ? 'add' : ''), false);
    };
    VScroll.prototype.swipeHandler = function (e) {
        var swipeElement = this.scrollEle;
        var distance;
        if (e.velocity <= 1) {
            distance = e.distanceY / (e.velocity * 10);
        }
        else {
            distance = e.distanceY / e.velocity;
        }
        var start = 0.5;
        var animate = function () {
            var step = Math.sin(start);
            if (step <= 0) {
                window.cancelAnimationFrame(step);
            }
            else {
                if (e.swipeDirection === 'Up') {
                    swipeElement.scrollTop += distance * step;
                }
                else if (e.swipeDirection === 'Down') {
                    swipeElement.scrollTop -= distance * step;
                }
                start -= 0.02;
                window.requestAnimationFrame(animate);
            }
        };
        animate();
    };
    VScroll.prototype.scrollUpdating = function (scrollVal, action) {
        if (action === 'add') {
            this.scrollEle.scrollTop += scrollVal;
        }
        else {
            this.scrollEle.scrollTop -= scrollVal;
        }
    };
    VScroll.prototype.frameScrollRequest = function (scrollValue, action, isContinuous) {
        var _this = this;
        var step = 10;
        if (isContinuous) {
            this.scrollUpdating(scrollValue, action);
            return;
        }
        if (!this.customStep) {
            [].slice.call(sf.base.selectAll('.' + CLS_OVERLAY$1, this.element)).forEach(function (el) {
                scrollValue -= el.offsetHeight;
            });
        }
        var animate = function () {
            if (scrollValue < step) {
                window.cancelAnimationFrame(step);
            }
            else {
                _this.scrollUpdating(step, action);
                scrollValue -= step;
                window.requestAnimationFrame(animate);
            }
        };
        animate();
    };
    VScroll.prototype.touchHandler = function (e) {
        var el = this.scrollEle;
        var distance;
        distance = e.distanceY;
        if (e.scrollDirection === 'Up') {
            el.scrollTop = el.scrollTop + distance;
        }
        else if (e.scrollDirection === 'Down') {
            el.scrollTop = el.scrollTop - distance;
        }
    };
    VScroll.prototype.arrowDisabling = function (addDisableCls, removeDisableCls) {
        if (this.isDevice) {
            var arrowEle = sf.base.isNullOrUndefined(addDisableCls) ? removeDisableCls : addDisableCls;
            var arrowIcon = arrowEle.querySelector('.' + CLS_NAVARROW$1);
            if (sf.base.isNullOrUndefined(addDisableCls)) {
                sf.base.classList(arrowIcon, [CLS_NAVDOWNARROW], [CLS_NAVUPARROW]);
            }
            else {
                sf.base.classList(arrowIcon, [CLS_NAVUPARROW], [CLS_NAVDOWNARROW]);
            }
        }
        else {
            addDisableCls.classList.add(CLS_DISABLE$1);
            addDisableCls.setAttribute('aria-disabled', 'true');
            addDisableCls.removeAttribute('tabindex');
            removeDisableCls.classList.remove(CLS_DISABLE$1);
            removeDisableCls.setAttribute('aria-disabled', 'false');
            removeDisableCls.setAttribute('tabindex', '0');
        }
        this.repeatScroll();
    };
    VScroll.prototype.scrollEventHandler = function (e) {
        var target = e.target;
        var height = target.offsetHeight;
        var rootEle = this.element;
        var navUpEle = this.element.querySelector('.' + CLS_VSCROLLNAVUP);
        var navDownEle = this.element.querySelector('.' + CLS_VSCROLLNAVDOWN);
        var upOverlay = this.element.querySelector('.' + CLS_UPOVERLAY);
        var downOverlay = this.element.querySelector('.' + CLS_DOWNOVERLAY);
        var scrollTop = target.scrollTop;
        if (scrollTop <= 0) {
            scrollTop = -scrollTop;
        }
        if (this.isDevice) {
            if (scrollTop < OVERLAY_MAXWID$1) {
                upOverlay.style.height = scrollTop + 'px';
            }
            else {
                upOverlay.style.height = '40px';
            }
            if ((target.scrollHeight - Math.ceil(height + scrollTop)) < OVERLAY_MAXWID$1) {
                downOverlay.style.height = (target.scrollHeight - Math.ceil(height + scrollTop)) + 'px';
            }
            else {
                downOverlay.style.height = '40px';
            }
        }
        if (scrollTop === 0) {
            this.arrowDisabling(navUpEle, navDownEle);
        }
        else if (Math.ceil(height + scrollTop + .1) >= target.scrollHeight) {
            this.arrowDisabling(navDownEle, navUpEle);
        }
        else {
            var disEle = this.element.querySelector('.' + CLS_VSCROLLNAV + '.' + CLS_DISABLE$1);
            if (disEle) {
                disEle.classList.remove(CLS_DISABLE$1);
                disEle.setAttribute('aria-disabled', 'false');
                disEle.setAttribute('tabindex', '0');
            }
        }
    };
    /**
     * Gets called when the model property changes.The data that describes the old and new values of property that changed.
     * @param  {VScrollModel} newProp
     * @param  {VScrollModel} oldProp
     * @returns void
     * @private
     */
    VScroll.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'scrollStep':
                    this.setScrollState();
                    break;
                case 'enableRtl':
                    newProp.enableRtl ? this.element.classList.add(CLS_RTL$1) : this.element.classList.remove(CLS_RTL$1);
                    break;
            }
        }
    };
    __decorate$3([
        sf.base.Property(null)
    ], VScroll.prototype, "scrollStep", void 0);
    VScroll = __decorate$3([
        sf.base.NotifyPropertyChanges
    ], VScroll);
    return VScroll;
}(sf.base.Component));

/**
 * Used to add scroll in menu.
 * @hidden
 */
function addScrolling(createElement$$1, container, content, scrollType, enableRtl, offset) {
    var containerOffset;
    var contentOffset;
    if (scrollType === 'vscroll') {
        containerOffset = offset || container.offsetHeight;
        contentOffset = content.offsetHeight;
    }
    else {
        containerOffset = container.offsetWidth;
        contentOffset = content.offsetWidth;
    }
    if (containerOffset < contentOffset) {
        var scrollEle = createElement$$1('div', { className: 'e-menu-' + scrollType });
        container.appendChild(scrollEle);
        scrollEle.appendChild(content);
        if (offset) {
            scrollEle.style.overflow = 'hidden';
            scrollEle.style.height = offset + 'px';
        }
        else {
            scrollEle.style.maxHeight = container.style.maxHeight;
            container.style.overflow = 'hidden';
        }
        var scrollObj = void 0;
        if (scrollType === 'vscroll') {
            scrollObj = new VScroll({ enableRtl: enableRtl }, scrollEle);
            scrollObj.scrollStep = sf.base.select('.e-' + scrollType + '-bar', container).offsetHeight / 2;
        }
        else {
            scrollObj = new HScroll({ enableRtl: enableRtl }, scrollEle);
            scrollObj.scrollStep = sf.base.select('.e-' + scrollType + '-bar', container).offsetWidth;
        }
        return scrollEle;
    }
    else {
        return content;
    }
}
/**
 * Used to destroy the scroll option.
 * @hidden
 */
function destroyScroll(scrollObj, element, skipEle) {
    if (scrollObj) {
        var menu = sf.base.select('.e-menu-parent', element);
        if (menu) {
            if (!skipEle || skipEle === menu) {
                scrollObj.destroy();
                element.parentElement.appendChild(menu);
                sf.base.detach(element);
            }
        }
        else {
            scrollObj.destroy();
            sf.base.detach(element);
        }
    }
}

var __extends$1 = (undefined && undefined.__extends) || (function () {
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
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ENTER = 'enter';
var ESCAPE = 'escape';
var FOCUSED = 'e-focused';
var HEADER = 'e-menu-header';
var SELECTED = 'e-selected';
var SEPARATOR = 'e-separator';
var UPARROW = 'uparrow';
var DOWNARROW = 'downarrow';
var LEFTARROW = 'leftarrow';
var RIGHTARROW = 'rightarrow';
var HOME = 'home';
var END = 'end';
var CARET = 'e-caret';
var ITEM = 'e-menu-item';
var DISABLED = 'e-disabled';
var HIDE = 'e-menu-hide';
var ICONS = 'e-icons';
var RTL = 'e-rtl';
var POPUP = 'e-menu-popup';
var TEMPLATE_PROPERTY = 'Template';
/**
 * Configures the field options of the Menu.
 */
var FieldSettings = /** @class */ (function (_super) {
    __extends$1(FieldSettings, _super);
    function FieldSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property('id')
    ], FieldSettings.prototype, "itemId", void 0);
    __decorate$1([
        sf.base.Property('parentId')
    ], FieldSettings.prototype, "parentId", void 0);
    __decorate$1([
        sf.base.Property('text')
    ], FieldSettings.prototype, "text", void 0);
    __decorate$1([
        sf.base.Property('iconCss')
    ], FieldSettings.prototype, "iconCss", void 0);
    __decorate$1([
        sf.base.Property('url')
    ], FieldSettings.prototype, "url", void 0);
    __decorate$1([
        sf.base.Property('separator')
    ], FieldSettings.prototype, "separator", void 0);
    __decorate$1([
        sf.base.Property('items')
    ], FieldSettings.prototype, "children", void 0);
    return FieldSettings;
}(sf.base.ChildProperty));
/**
 * Specifies menu items.
 */
var MenuItem = /** @class */ (function (_super) {
    __extends$1(MenuItem, _super);
    function MenuItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(null)
    ], MenuItem.prototype, "iconCss", void 0);
    __decorate$1([
        sf.base.Property('')
    ], MenuItem.prototype, "id", void 0);
    __decorate$1([
        sf.base.Property(false)
    ], MenuItem.prototype, "separator", void 0);
    __decorate$1([
        sf.base.Collection([], MenuItem)
    ], MenuItem.prototype, "items", void 0);
    __decorate$1([
        sf.base.Property('')
    ], MenuItem.prototype, "text", void 0);
    __decorate$1([
        sf.base.Property('')
    ], MenuItem.prototype, "url", void 0);
    return MenuItem;
}(sf.base.ChildProperty));
/**
 * Animation configuration settings.
 */
var MenuAnimationSettings = /** @class */ (function (_super) {
    __extends$1(MenuAnimationSettings, _super);
    function MenuAnimationSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property('SlideDown')
    ], MenuAnimationSettings.prototype, "effect", void 0);
    __decorate$1([
        sf.base.Property(400)
    ], MenuAnimationSettings.prototype, "duration", void 0);
    __decorate$1([
        sf.base.Property('ease')
    ], MenuAnimationSettings.prototype, "easing", void 0);
    return MenuAnimationSettings;
}(sf.base.ChildProperty));
/**
 * @private
 * Base class for Menu and ContextMenu components.
 */
var MenuBase = /** @class */ (function (_super) {
    __extends$1(MenuBase, _super);
    /**
     * Constructor for creating the widget.
     * @private
     */
    function MenuBase(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.navIdx = [];
        _this.animation = new sf.base.Animation({});
        _this.isTapHold = false;
        _this.tempItem = [];
        return _this;
    }
    /**
     * Initialized third party configuration settings.
     * @private
     */
    MenuBase.prototype.preRender = function () {
        if (!this.isMenu) {
            var ul = void 0;
            if (this.element.tagName === 'EJS-CONTEXTMENU') {
                ul = this.createElement('ul', {
                    id: sf.base.getUniqueID(this.getModuleName()), className: 'e-control e-lib e-' + this.getModuleName()
                });
                var ejInst = sf.base.getValue('ej2_instances', this.element);
                sf.base.removeClass([this.element], ['e-control', 'e-lib', 'e-' + this.getModuleName()]);
                this.clonedElement = this.element;
                this.element = ul;
                sf.base.setValue('ej2_instances', ejInst, this.element);
            }
            else {
                ul = this.createElement('ul', { id: sf.base.getUniqueID(this.getModuleName()) });
                sf.base.append([].slice.call(this.element.cloneNode(true).children), ul);
                var refEle = this.element.nextElementSibling;
                refEle ? this.element.parentElement.insertBefore(ul, refEle) : this.element.parentElement.appendChild(ul);
                this.clonedElement = ul;
            }
            this.clonedElement.style.display = 'none';
        }
        if (this.element.tagName === 'EJS-MENU') {
            var ele = this.element;
            var ejInstance = sf.base.getValue('ej2_instances', ele);
            var ul = this.createElement('ul');
            var wrapper = this.createElement('EJS-MENU', { className: 'e-' + this.getModuleName() + '-wrapper' });
            for (var idx = 0, len = ele.attributes.length; idx < len; idx++) {
                ul.setAttribute(ele.attributes[idx].nodeName, ele.attributes[idx].nodeValue);
            }
            ele.parentNode.insertBefore(wrapper, ele);
            sf.base.detach(ele);
            ele = ul;
            wrapper.appendChild(ele);
            sf.base.setValue('ej2_instances', ejInstance, ele);
            this.clonedElement = wrapper;
            this.element = ele;
            if (!this.element.id) {
                this.element.id = sf.base.getUniqueID(this.getModuleName());
            }
        }
    };
    /**
     * Initialize the control rendering
     * @private
     */
    MenuBase.prototype.render = function () {
        this.initialize();
        this.renderItems();
        if (this.isMenu && this.template && sf.base.isBlazor()) {
            var menuTemplateId = this.element.id + TEMPLATE_PROPERTY;
            sf.base.resetBlazorTemplate(menuTemplateId, TEMPLATE_PROPERTY);
            if (Object.keys(sf.base.blazorTemplates).length) {
                sf.base.extend(this.tempItem, sf.base.blazorTemplates[menuTemplateId], [], true);
            }
            sf.base.updateBlazorTemplate(menuTemplateId, TEMPLATE_PROPERTY, this);
        }
        this.wireEvents();
        this.renderComplete();
    };
    MenuBase.prototype.initialize = function () {
        var wrapper = this.getWrapper();
        if (!wrapper) {
            wrapper = this.createElement('div', { className: 'e-' + this.getModuleName() + '-wrapper' });
            if (this.isMenu) {
                this.element.parentElement.insertBefore(wrapper, this.element);
            }
            else {
                document.body.appendChild(wrapper);
            }
        }
        if (this.cssClass) {
            sf.base.addClass([wrapper], this.cssClass.split(' '));
        }
        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        wrapper.appendChild(this.element);
        if (this.isMenu && this.hamburgerMode) {
            if (!this.target) {
                this.createHeaderContainer(wrapper);
            }
        }
    };
    MenuBase.prototype.renderItems = function () {
        if (!this.items.length) {
            var items = sf.lists.ListBase.createJsonFromElement(this.element, { fields: { child: 'items' } });
            this.setProperties({ items: items }, true);
            if (sf.base.isBlazor()) {
                this.element = this.removeChildElement(this.element);
            }
            else {
                this.element.innerHTML = '';
            }
        }
        var ul = this.createItems(this.items);
        sf.base.append(Array.prototype.slice.call(ul.children), this.element);
        this.element.classList.add('e-menu-parent');
        if (this.isMenu) {
            if (!this.hamburgerMode && this.element.classList.contains('e-vertical')) {
                this.setBlankIconStyle(this.element);
            }
            if (this.enableScrolling) {
                var wrapper = this.getWrapper();
                this.element.classList.contains('e-vertical') ?
                    addScrolling(this.createElement, wrapper, this.element, 'vscroll', this.enableRtl)
                    : addScrolling(this.createElement, wrapper, this.element, 'hscroll', this.enableRtl);
            }
        }
    };
    MenuBase.prototype.wireEvents = function () {
        var wrapper = this.getWrapper();
        if (this.target) {
            var target = void 0;
            var targetElems = sf.base.selectAll(this.target);
            for (var i = 0, len = targetElems.length; i < len; i++) {
                target = targetElems[i];
                if (this.isMenu) {
                    sf.base.EventHandler.add(target, 'click', this.menuHeaderClickHandler, this);
                }
                else {
                    if (sf.base.Browser.isIos) {
                        new sf.base.Touch(target, { tapHold: this.touchHandler.bind(this) });
                    }
                    else {
                        sf.base.EventHandler.add(target, 'contextmenu', this.cmenuHandler, this);
                    }
                }
            }
            this.targetElement = target;
            if (!this.isMenu) {
                sf.base.EventHandler.add(this.targetElement, 'scroll', this.scrollHandler, this);
                for (var _i = 0, _a = sf.popups.getScrollableParent(this.targetElement); _i < _a.length; _i++) {
                    var parent_1 = _a[_i];
                    sf.base.EventHandler.add(parent_1, 'scroll', this.scrollHandler, this);
                }
            }
        }
        if (!sf.base.Browser.isDevice) {
            this.delegateMoverHandler = this.moverHandler.bind(this);
            this.delegateMouseDownHandler = this.mouseDownHandler.bind(this);
            sf.base.EventHandler.add(this.isMenu ? document : wrapper, 'mouseover', this.delegateMoverHandler, this);
            sf.base.EventHandler.add(document, 'mousedown', this.delegateMouseDownHandler, this);
        }
        this.delegateClickHandler = this.clickHandler.bind(this);
        sf.base.EventHandler.add(document, 'click', this.delegateClickHandler, this);
        this.wireKeyboardEvent(wrapper);
        this.rippleFn = sf.base.rippleEffect(wrapper, { selector: '.' + ITEM });
    };
    MenuBase.prototype.wireKeyboardEvent = function (element) {
        var keyConfigs = {
            downarrow: DOWNARROW,
            uparrow: UPARROW,
            enter: ENTER,
            leftarrow: LEFTARROW,
            rightarrow: RIGHTARROW,
            escape: ESCAPE
        };
        if (this.isMenu) {
            keyConfigs.home = HOME;
            keyConfigs.end = END;
        }
        new sf.base.KeyboardEvents(element, {
            keyAction: this.keyBoardHandler.bind(this),
            keyConfigs: keyConfigs
        });
    };
    MenuBase.prototype.mouseDownHandler = function (e) {
        if (sf.base.closest(e.target, '.e-' + this.getModuleName() + '-wrapper') !== this.getWrapper()
            && (!sf.base.closest(e.target, '.e-' + this.getModuleName() + '-popup'))) {
            this.closeMenu(this.isMenu ? null : this.navIdx.length, e);
        }
    };
    MenuBase.prototype.keyBoardHandler = function (e) {
        var actionName = '';
        var trgt = e.target;
        var actionNeeded = this.isMenu && !this.hamburgerMode && !this.element.classList.contains('e-vertical')
            && this.navIdx.length < 1;
        e.preventDefault();
        if (this.enableScrolling && e.keyCode === 13 && trgt.classList.contains('e-scroll-nav')) {
            this.removeLIStateByClass([FOCUSED, SELECTED], [sf.base.closest(trgt, '.e-' + this.getModuleName() + '-wrapper')]);
        }
        if (actionNeeded) {
            switch (e.action) {
                case RIGHTARROW:
                    actionName = RIGHTARROW;
                    e.action = DOWNARROW;
                    break;
                case LEFTARROW:
                    actionName = LEFTARROW;
                    e.action = UPARROW;
                    break;
                case DOWNARROW:
                    actionName = DOWNARROW;
                    e.action = RIGHTARROW;
                    break;
                case UPARROW:
                    actionName = UPARROW;
                    e.action = '';
                    break;
            }
        }
        else if (this.enableRtl) {
            switch (e.action) {
                case LEFTARROW:
                    actionNeeded = true;
                    actionName = LEFTARROW;
                    e.action = RIGHTARROW;
                    break;
                case RIGHTARROW:
                    actionNeeded = true;
                    actionName = RIGHTARROW;
                    e.action = LEFTARROW;
                    break;
            }
        }
        switch (e.action) {
            case DOWNARROW:
            case UPARROW:
            case END:
            case HOME:
                this.upDownKeyHandler(e);
                break;
            case RIGHTARROW:
                this.rightEnterKeyHandler(e);
                break;
            case LEFTARROW:
                this.leftEscKeyHandler(e);
                break;
            case ENTER:
                if (this.hamburgerMode && trgt.tagName === 'SPAN' && trgt.classList.contains('e-menu-icon')) {
                    this.menuHeaderClickHandler(e);
                }
                else {
                    this.rightEnterKeyHandler(e);
                }
                break;
            case ESCAPE:
                this.leftEscKeyHandler(e);
                break;
        }
        if (actionNeeded) {
            e.action = actionName;
        }
    };
    MenuBase.prototype.upDownKeyHandler = function (e) {
        var cul = this.getUlByNavIdx();
        var defaultIdx = (e.action === DOWNARROW || e.action === HOME) ? 0 : cul.childElementCount - 1;
        var fliIdx = defaultIdx;
        var fli = this.getLIByClass(cul, FOCUSED);
        if (fli) {
            if (e.action !== END && e.action !== HOME) {
                fliIdx = this.getIdx(cul, fli);
            }
            fli.classList.remove(FOCUSED);
            if (e.action !== END && e.action !== HOME) {
                e.action === DOWNARROW ? fliIdx++ : fliIdx--;
                if (fliIdx === (e.action === DOWNARROW ? cul.childElementCount : -1)) {
                    fliIdx = defaultIdx;
                }
            }
        }
        var cli = cul.children[fliIdx];
        fliIdx = this.isValidLI(cli, fliIdx, e.action);
        cul.children[fliIdx].classList.add(FOCUSED);
        cul.children[fliIdx].focus();
    };
    MenuBase.prototype.isValidLI = function (cli, index, action) {
        var wrapper = this.getWrapper();
        var cul = this.getUlByNavIdx();
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            ((action === DOWNARROW) || (action === RIGHTARROW)) ? index++ : index--;
        }
        cli = cul.children[index];
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            index = this.isValidLI(cli, index, action);
        }
        return index;
    };
    MenuBase.prototype.getUlByNavIdx = function (navIdxLen) {
        if (navIdxLen === void 0) { navIdxLen = this.navIdx.length; }
        if (this.isMenu) {
            var popup = [this.getWrapper()].concat([].slice.call(sf.base.selectAll('.' + POPUP)))[navIdxLen];
            return sf.base.isNullOrUndefined(popup) ? null : sf.base.select('.e-menu-parent', popup);
        }
        else {
            return this.getWrapper().children[navIdxLen];
        }
    };
    MenuBase.prototype.rightEnterKeyHandler = function (e) {
        var eventArgs;
        var cul = this.getUlByNavIdx();
        var fli = this.getLIByClass(cul, FOCUSED);
        if (fli) {
            var fliIdx = this.getIdx(cul, fli);
            var navIdx = this.navIdx.concat(fliIdx);
            var item = this.getItem(navIdx);
            if (item.items.length) {
                this.navIdx.push(fliIdx);
                this.keyType = 'right';
                this.action = e.action;
                this.openMenu(fli, item, -1, -1, e);
            }
            else {
                if (e.action === ENTER) {
                    if (this.isMenu && this.navIdx.length === 0) {
                        this.removeLIStateByClass([SELECTED], [this.getWrapper()]);
                    }
                    else {
                        fli.classList.remove(FOCUSED);
                    }
                    fli.classList.add(SELECTED);
                    eventArgs = { element: fli, item: item, event: e };
                    this.trigger('select', eventArgs);
                    this.closeMenu(null, e);
                }
            }
        }
    };
    MenuBase.prototype.leftEscKeyHandler = function (e) {
        if (this.navIdx.length) {
            this.keyType = 'left';
            this.closeMenu(this.navIdx.length, e);
        }
        else {
            if (e.action === ESCAPE) {
                this.closeMenu(null, e);
            }
        }
    };
    MenuBase.prototype.scrollHandler = function (e) {
        this.closeMenu(null, e);
    };
    MenuBase.prototype.touchHandler = function (e) {
        this.isTapHold = true;
        this.cmenuHandler(e.originalEvent);
    };
    MenuBase.prototype.cmenuHandler = function (e) {
        e.preventDefault();
        this.isCMenu = true;
        this.pageX = e.changedTouches ? e.changedTouches[0].pageX + 1 : e.pageX + 1;
        this.pageY = e.changedTouches ? e.changedTouches[0].pageY + 1 : e.pageY + 1;
        this.closeMenu(null, e);
        if (this.isCMenu) {
            if (this.canOpen(e.target)) {
                this.openMenu(null, null, this.pageY, this.pageX, e);
            }
            this.isCMenu = false;
        }
    };
    // tslint:disable-next-line:max-func-body-length
    MenuBase.prototype.closeMenu = function (ulIndex, e, isIterated) {
        var _this = this;
        if (ulIndex === void 0) { ulIndex = 0; }
        if (e === void 0) { e = null; }
        if (this.isMenuVisible()) {
            var sli = void 0;
            var ul_1;
            var item_1;
            var wrapper = this.getWrapper();
            var beforeCloseArgs = void 0;
            var items_1;
            var popups = this.getPopups();
            var isClose = false;
            var cnt = this.isMenu ? popups.length + 1 : wrapper.childElementCount;
            ul_1 = this.isMenu && cnt !== 1 ? sf.base.select('.e-ul', popups[cnt - 2])
                : sf.base.selectAll('.e-menu-parent', wrapper)[cnt - 1];
            if (this.isMenu && ul_1.classList.contains('e-menu')) {
                sli = this.getLIByClass(ul_1, SELECTED);
                if (sli) {
                    sli.classList.remove(SELECTED);
                }
                isClose = true;
            }
            if (!isClose) {
                var liElem_1 = e && e.target && this.getLI(e.target);
                item_1 = this.navIdx.length ? this.getItem(this.navIdx) : null;
                items_1 = item_1 ? item_1.items : this.items;
                beforeCloseArgs = { element: ul_1, parentItem: this.isMenu && sf.base.isBlazor() ? this.getMenuItemModel(item_1, ulIndex) : item_1,
                    items: items_1, event: e, cancel: false, liElement: liElem_1 };
                this.trigger('beforeClose', beforeCloseArgs, function (observedCloseArgs) {
                    var popupEle;
                    var closeArgs;
                    var popupId = '';
                    var popupObj;
                    var isOpen = !observedCloseArgs.cancel;
                    if (isOpen || _this.isCMenu) {
                        if (_this.isMenu) {
                            popupEle = sf.base.closest(ul_1, '.' + POPUP);
                            if (_this.hamburgerMode) {
                                popupEle.parentElement.style.minHeight = '';
                                sf.base.closest(ul_1, '.e-menu-item').setAttribute('aria-expanded', 'false');
                            }
                            _this.unWireKeyboardEvent(popupEle);
                            destroyScroll(sf.base.getInstance(popupEle.children[0], VScroll), popupEle.children[0]);
                            popupObj = sf.base.getInstance(popupEle, sf.popups.Popup);
                            popupObj.hide();
                            popupId = popupEle.id;
                            popupObj.destroy();
                            sf.base.detach(popupEle);
                        }
                        else {
                            _this.toggleAnimation(ul_1, false);
                        }
                        closeArgs = { element: ul_1, parentItem: item_1, items: items_1 };
                        _this.trigger('onClose', closeArgs);
                        _this.navIdx.pop();
                    }
                    _this.updateReactTemplate();
                    var trgtliId;
                    var closedLi;
                    var trgtLi;
                    var trgtpopUp = _this.getWrapper() && _this.getUlByNavIdx();
                    if (_this.isCMenu) {
                        if (_this.canOpen(e.target)) {
                            _this.openMenu(null, null, _this.pageY, _this.pageX, e);
                        }
                        _this.isCMenu = false;
                    }
                    if (_this.isMenu && trgtpopUp && popupId.length) {
                        trgtliId = new RegExp('(.*)-ej2menu-' + _this.element.id + '-popup').exec(popupId)[1];
                        closedLi = trgtpopUp.querySelector('[id="' + trgtliId + '"]');
                        trgtLi = (liElem_1 && trgtpopUp.querySelector('[id="' + liElem_1.id + '"]'));
                    }
                    var submenus = liElem_1 && liElem_1.querySelectorAll('.e-menu-item');
                    if (isOpen && _this.hamburgerMode && ulIndex && !(submenus.length)) {
                        _this.afterCloseMenu(e);
                    }
                    else if (isOpen && !_this.hamburgerMode && _this.navIdx.length && closedLi && !trgtLi) {
                        var ele = e ? sf.base.closest(e.target, '.e-menu-wrapper') : null;
                        if (ele) {
                            ele = ele.querySelector('.e-menu-item');
                            if (ele && _this.getIndex(ele.id, true).length <= _this.navIdx.length) {
                                _this.closeMenu(_this.navIdx[_this.navIdx.length - 1], e, true);
                            }
                        }
                        else {
                            _this.closeMenu(_this.navIdx[_this.navIdx.length - 1], e);
                        }
                    }
                    else if (isOpen && !isIterated && !ulIndex && ((_this.hamburgerMode && _this.navIdx.length) ||
                        _this.navIdx.length === 1)) {
                        _this.closeMenu(null, e);
                    }
                    else if (isOpen && sf.base.isNullOrUndefined(ulIndex) && _this.navIdx.length) {
                        _this.closeMenu(null, e);
                    }
                    else if (isOpen && !_this.isMenu && !ulIndex && _this.navIdx.length === 0 && !_this.isMenusClosed) {
                        _this.isMenusClosed = true;
                        _this.closeMenu(0, e);
                    }
                    else if (isOpen && _this.isMenu && e && e.target &&
                        _this.navIdx.length !== 0 && sf.base.closest(e.target, '.e-menu-parent.e-control')) {
                        _this.closeMenu(0, e);
                    }
                    else {
                        if (isOpen && (_this.keyType === 'right' || _this.keyType === 'click')) {
                            _this.afterCloseMenu(e);
                        }
                        else {
                            var cul = _this.getUlByNavIdx();
                            var sli_1 = _this.getLIByClass(cul, SELECTED);
                            if (sli_1) {
                                sli_1.setAttribute('aria-expanded', 'false');
                                sli_1.classList.remove(SELECTED);
                                if (observedCloseArgs.liElement) {
                                    sli_1.classList.add(FOCUSED);
                                    sli_1.focus();
                                }
                            }
                            if (!isOpen && _this.hamburgerMode && liElem_1 && liElem_1.getAttribute('aria-expanded') === 'false' &&
                                liElem_1.getAttribute('aria-haspopup') === 'true') {
                                if (sf.base.closest(liElem_1, '.e-menu-parent.e-control')) {
                                    _this.navIdx = [];
                                }
                                else {
                                    _this.navIdx.pop();
                                }
                                _this.navIdx.push(_this.cliIdx);
                                var item_2 = _this.getItem(_this.navIdx);
                                liElem_1.setAttribute('aria-expanded', 'true');
                                _this.openMenu(liElem_1, item_2, -1, -1, e);
                            }
                        }
                    }
                    _this.removeStateWrapper();
                });
            }
        }
    };
    MenuBase.prototype.updateReactTemplate = function () {
        // tslint:disable
        if (this.isReact && this.template && this.navIdx.length === 0) {
            // tslint:disable
            var portals = this.portals.splice(0, this.items.length);
            this.clearTemplate(['template']);
            // tslint:disable
            this.portals = portals;
            this.renderReactTemplates();
        }
    };
    MenuBase.prototype.getMenuItemModel = function (item, level) {
        if (sf.base.isNullOrUndefined(item)) {
            return null;
        }
        if (sf.base.isNullOrUndefined(level)) {
            level = 0;
        }
        var fields = this.getFields(level);
        return { text: item[fields.text], id: item[fields.id], items: item[fields.child], separator: item[fields.separator],
            iconCss: item[fields.iconCss], url: item[fields.url] };
    };
    MenuBase.prototype.getPopups = function () {
        var _this = this;
        var popups = [];
        [].slice.call(document.querySelectorAll('.' + POPUP)).forEach(function (elem) {
            if (_this.getIndex(elem.querySelector('.' + ITEM).id, true).length) {
                popups.push(elem);
            }
        });
        return popups;
    };
    MenuBase.prototype.isMenuVisible = function () {
        return (this.navIdx.length > 0 || (this.element.classList.contains('e-contextmenu') && sf.base.isVisible(this.element).valueOf()));
    };
    MenuBase.prototype.canOpen = function (target) {
        var canOpen = true;
        if (this.filter) {
            canOpen = false;
            var filter = this.filter.split(' ');
            for (var i = 0, len = filter.length; i < len; i++) {
                if (sf.base.closest(target, '.' + filter[i])) {
                    canOpen = true;
                    break;
                }
            }
        }
        return canOpen;
    };
    MenuBase.prototype.openMenu = function (li, item, top, left, e, target) {
        if (top === void 0) { top = 0; }
        if (left === void 0) { left = 0; }
        if (e === void 0) { e = null; }
        if (target === void 0) { target = this.targetElement; }
        var wrapper = this.getWrapper();
        this.lItem = li;
        var elemId = this.element.id !== '' ? this.element.id : 'menu';
        this.isMenusClosed = false;
        if (sf.base.isNullOrUndefined(top)) {
            top = -1;
        }
        if (sf.base.isNullOrUndefined(left)) {
            left = -1;
        }
        if (li) {
            this.uList = this.createItems(item[this.getField('children', this.navIdx.length - 1)]);
            if (!this.isMenu && sf.base.Browser.isDevice) {
                wrapper.lastChild.style.display = 'none';
                var data = {
                    text: item[this.getField('text')].toString(), iconCss: ICONS + ' e-previous'
                };
                var hdata = new MenuItem(this.items[0], 'items', data, true);
                var hli = this.createItems([hdata]).children[0];
                hli.classList.add(HEADER);
                this.uList.insertBefore(hli, this.uList.children[0]);
            }
            if (this.isMenu) {
                this.popupWrapper = this.createElement('div', {
                    className: 'e-' + this.getModuleName() + '-wrapper ' + POPUP, id: li.id + '-ej2menu-' + elemId + '-popup'
                });
                if (this.hamburgerMode) {
                    top = li.offsetHeight;
                    li.appendChild(this.popupWrapper);
                }
                else {
                    document.body.appendChild(this.popupWrapper);
                }
                this.isNestedOrVertical = this.element.classList.contains('e-vertical') || this.navIdx.length !== 1;
                this.popupObj = this.generatePopup(this.popupWrapper, this.uList, li, this.isNestedOrVertical);
                if (this.template) {
                    this.renderReactTemplates();
                }
                if (this.hamburgerMode) {
                    this.calculateIndentSize(this.uList, li);
                }
                else {
                    if (this.cssClass) {
                        sf.base.addClass([this.popupWrapper], this.cssClass.split(' '));
                    }
                    this.popupObj.hide();
                }
                this.triggerBeforeOpen(li, this.uList, item, e, 0, 0, 'menu');
            }
            else {
                this.uList.style.zIndex = this.element.style.zIndex;
                wrapper.appendChild(this.uList);
                this.triggerBeforeOpen(li, this.uList, item, e, top, left, 'none');
            }
        }
        else {
            this.uList = this.element;
            this.uList.style.zIndex = sf.popups.getZindexPartial(target ? target : this.element).toString();
            this.triggerBeforeOpen(li, this.uList, item, e, top, left, 'none');
        }
        if (this.isMenu && this.template && sf.base.isBlazor()) {
            var menuTemplateId = this.element.id + TEMPLATE_PROPERTY;
            if (Object.keys(sf.base.blazorTemplates).length) {
                var itemFromBlazorTemplate = sf.base.blazorTemplates[menuTemplateId];
                this.tempItem = this.tempItem.concat(itemFromBlazorTemplate);
                sf.base.blazorTemplates[menuTemplateId] = this.tempItem;
            }
            sf.base.updateBlazorTemplate(menuTemplateId, TEMPLATE_PROPERTY, this);
        }
    };
    MenuBase.prototype.calculateIndentSize = function (ul, li) {
        var liStyle = getComputedStyle(li);
        var liIndent = parseInt(liStyle.textIndent, 10);
        if (this.navIdx.length < 2 && !li.classList.contains('e-blankicon')) {
            liIndent *= 2;
        }
        else {
            liIndent += (liIndent / 4);
        }
        ul.style.textIndent = liIndent + 'px';
        var blankIconElem = ul.querySelectorAll('.e-blankicon');
        if (blankIconElem && blankIconElem.length) {
            var menuIconElem = ul.querySelector('.e-menu-icon');
            var menuIconElemStyle = getComputedStyle(menuIconElem);
            var blankIconIndent = (parseInt(menuIconElemStyle.marginRight, 10) + menuIconElem.offsetWidth + liIndent);
            for (var i = 0; i < blankIconElem.length; i++) {
                blankIconElem[i].style.textIndent = blankIconIndent + 'px';
            }
        }
    };
    MenuBase.prototype.generatePopup = function (popupWrapper, ul, li, isNestedOrVertical) {
        var _this = this;
        var popupObj = new sf.popups.Popup(popupWrapper, {
            actionOnScroll: this.hamburgerMode ? 'none' : 'reposition',
            relateTo: li,
            collision: this.hamburgerMode ? { X: 'none', Y: 'none' } : { X: isNestedOrVertical ||
                    this.enableRtl ? 'none' : 'flip', Y: 'fit' },
            position: (isNestedOrVertical && !this.hamburgerMode) ? { X: 'right', Y: 'top' } : { X: 'left', Y: 'bottom' },
            targetType: 'relative',
            enableRtl: this.enableRtl,
            content: ul,
            open: function () {
                var scrollEle = sf.base.select('.e-menu-vscroll', popupObj.element);
                if (scrollEle) {
                    scrollEle.style.height = 'inherit';
                    scrollEle.style.maxHeight = '';
                }
                var ul = sf.base.select('.e-ul', popupObj.element);
                popupObj.element.style.maxHeight = '';
                ul.focus();
                _this.triggerOpen(ul);
            }
        });
        return popupObj;
    };
    MenuBase.prototype.createHeaderContainer = function (wrapper) {
        wrapper = wrapper || this.getWrapper();
        var spanElem = this.createElement('span', { className: 'e-' + this.getModuleName() + '-header' });
        var tempTitle = (this.enableHtmlSanitizer) ? sf.base.SanitizeHtmlHelper.sanitize(this.title) : this.title;
        var spanTitle = this.createElement('span', {
            className: 'e-' + this.getModuleName() + '-title', innerHTML: tempTitle
        });
        var spanIcon = this.createElement('span', {
            className: 'e-icons e-' + this.getModuleName() + '-icon', attrs: { 'tabindex': '0' }
        });
        spanElem.appendChild(spanTitle);
        spanElem.appendChild(spanIcon);
        wrapper.insertBefore(spanElem, this.element);
    };
    MenuBase.prototype.openHamburgerMenu = function (e) {
        if (this.hamburgerMode) {
            this.triggerBeforeOpen(null, this.element, null, e, 0, 0, 'hamburger');
        }
    };
    MenuBase.prototype.closeHamburgerMenu = function (e) {
        var _this = this;
        if (this.hamburgerMode) {
            var beforeCloseArgs = void 0;
            beforeCloseArgs = { element: this.element, parentItem: null, event: e, items: this.items, cancel: false };
            this.trigger('beforeClose', beforeCloseArgs, function (observedHamburgerCloseArgs) {
                if (!observedHamburgerCloseArgs.cancel) {
                    _this.closeMenu(null, e);
                    _this.element.classList.add('e-hide-menu');
                    _this.trigger('onClose', { element: _this.element, parentItem: null, items: _this.items });
                }
            });
        }
    };
    MenuBase.prototype.callFit = function (element, x, y, top, left) {
        return sf.popups.fit(element, null, { X: x, Y: y }, { top: top, left: left });
    };
    MenuBase.prototype.triggerBeforeOpen = function (li, ul, item, e, top, left, type) {
        var _this = this;
        var navIdx = this.getIndex(li ? li.id : null, true);
        var items = li ? item[this.getField('children', this.navIdx.length - 1)] : this.items;
        var eventArgs = {
            element: ul, items: items, parentItem: this.isMenu && sf.base.isBlazor() ? this.getMenuItemModel(item, this.navIdx.length - 1) :
                item, event: e, cancel: false, top: top, left: left
        };
        var menuType = type;
        var collide;
        this.trigger('beforeOpen', eventArgs, function (observedOpenArgs) {
            switch (menuType) {
                case 'menu':
                    if (!_this.hamburgerMode) {
                        _this.top = observedOpenArgs.top;
                        _this.left = observedOpenArgs.left;
                    }
                    _this.popupWrapper.style.display = 'block';
                    if (!_this.hamburgerMode) {
                        _this.popupWrapper.style.maxHeight = _this.popupWrapper.getBoundingClientRect().height + 'px';
                        if (_this.enableScrolling) {
                            addScrolling(_this.createElement, _this.popupWrapper, _this.uList, 'vscroll', _this.enableRtl);
                        }
                        _this.checkScrollOffset(e);
                    }
                    if (!_this.hamburgerMode && !_this.left && !_this.top) {
                        _this.popupObj.refreshPosition(_this.lItem, true);
                        _this.left = parseInt(_this.popupWrapper.style.left, 10);
                        _this.top = parseInt(_this.popupWrapper.style.top, 10);
                        if (_this.enableRtl) {
                            _this.left =
                                _this.isNestedOrVertical ? _this.left - _this.popupWrapper.offsetWidth - _this.lItem.parentElement.offsetWidth + 2
                                    : _this.left - _this.popupWrapper.offsetWidth + _this.lItem.offsetWidth;
                        }
                        collide = sf.popups.isCollide(_this.popupWrapper, null, _this.left, _this.top);
                        if ((_this.isNestedOrVertical || _this.enableRtl) && (collide.indexOf('right') > -1
                            || collide.indexOf('left') > -1)) {
                            _this.popupObj.collision.X = 'none';
                            var offWidth = sf.base.closest(_this.lItem, '.e-' + _this.getModuleName() + '-wrapper').offsetWidth;
                            _this.left =
                                _this.enableRtl ? sf.popups.calculatePosition(_this.lItem, _this.isNestedOrVertical ? 'right' : 'left', 'top').left
                                    : _this.left - _this.popupWrapper.offsetWidth - offWidth + 2;
                        }
                        collide = sf.popups.isCollide(_this.popupWrapper, null, _this.left, _this.top);
                        if (collide.indexOf('left') > -1 || collide.indexOf('right') > -1) {
                            _this.left = _this.callFit(_this.popupWrapper, true, false, _this.top, _this.left).left;
                        }
                        _this.popupWrapper.style.left = _this.left + 'px';
                    }
                    else {
                        _this.popupObj.collision = { X: 'none', Y: 'none' };
                    }
                    _this.popupWrapper.style.display = '';
                    break;
                case 'none':
                    _this.top = observedOpenArgs.top;
                    _this.left = observedOpenArgs.left;
                    break;
                case 'hamburger':
                    if (!observedOpenArgs.cancel) {
                        _this.element.classList.remove('e-hide-menu');
                        _this.triggerOpen(_this.element);
                    }
                    break;
            }
            if (menuType !== 'hamburger') {
                if (observedOpenArgs.cancel) {
                    if (_this.isMenu) {
                        _this.popupObj.destroy();
                        sf.base.detach(_this.popupWrapper);
                    }
                    else if (ul.className.indexOf('e-ul') > -1) {
                        sf.base.detach(ul);
                    }
                    _this.navIdx.pop();
                }
                else {
                    if (_this.isMenu) {
                        if (_this.hamburgerMode) {
                            _this.popupWrapper.style.top = _this.top + 'px';
                            _this.popupWrapper.style.left = 0 + 'px';
                            _this.toggleAnimation(_this.popupWrapper);
                        }
                        else {
                            _this.setBlankIconStyle(_this.popupWrapper);
                            _this.wireKeyboardEvent(_this.popupWrapper);
                            sf.base.rippleEffect(_this.popupWrapper, { selector: '.' + ITEM });
                            _this.popupWrapper.style.left = _this.left + 'px';
                            _this.popupWrapper.style.top = _this.top + 'px';
                            var animationOptions = _this.animationSettings.effect !== 'None' ? {
                                name: _this.animationSettings.effect, duration: _this.animationSettings.duration,
                                timingFunction: _this.animationSettings.easing
                            } : null;
                            _this.popupObj.show(animationOptions, _this.lItem);
                        }
                    }
                    else {
                        _this.setBlankIconStyle(_this.uList);
                        _this.setPosition(_this.lItem, _this.uList, _this.top, _this.left);
                        _this.toggleAnimation(_this.uList);
                    }
                }
            }
            if (_this.keyType === 'right') {
                var cul = _this.getUlByNavIdx();
                li.classList.remove(FOCUSED);
                var index = void 0;
                if (_this.isMenu && _this.navIdx.length === 1) {
                    _this.removeLIStateByClass([SELECTED], [_this.getWrapper()]);
                }
                li.classList.add(SELECTED);
                if (_this.action === ENTER) {
                    var eventArgs_1 = { element: li, item: item, event: e };
                    _this.trigger('select', eventArgs_1);
                }
                li.focus();
                cul = _this.getUlByNavIdx();
                index = _this.isValidLI(cul.children[0], 0, _this.action);
                cul.children[index].classList.add(FOCUSED);
                cul.children[index].focus();
            }
        });
    };
    MenuBase.prototype.setBlankIconStyle = function (menu) {
        var blankIconList = [].slice.call(menu.getElementsByClassName('e-blankicon'));
        if (!blankIconList.length) {
            return;
        }
        var iconLi = menu.querySelector('.e-menu-item:not(.e-blankicon):not(.e-separator)');
        var icon = iconLi.querySelector('.e-menu-icon');
        if (!icon) {
            return;
        }
        var cssProp = this.enableRtl ? { padding: 'paddingRight', margin: 'marginLeft' } :
            { padding: 'paddingLeft', margin: 'marginRight' };
        var iconCssProps = getComputedStyle(icon);
        var iconSize = parseInt(iconCssProps.fontSize, 10);
        if (!!parseInt(iconCssProps.width, 10) && parseInt(iconCssProps.width, 10) > iconSize) {
            iconSize = parseInt(iconCssProps.width, 10);
        }
        // tslint:disable
        var size = iconSize + parseInt(iconCssProps[cssProp.margin], 10) + parseInt(getComputedStyle(iconLi)[cssProp.padding], 10) + "px";
        blankIconList.forEach(function (li) {
            li.style[cssProp.padding] = size;
        });
        // tslint:enable
    };
    MenuBase.prototype.checkScrollOffset = function (e) {
        var wrapper = this.getWrapper();
        if (wrapper.children[0].classList.contains('e-menu-hscroll') && this.navIdx.length === 1) {
            var trgt = sf.base.isNullOrUndefined(e) ? this.element : sf.base.closest(e.target, '.' + ITEM);
            var offsetEle = sf.base.select('.e-hscroll-bar', wrapper);
            var offsetLeft = void 0;
            var offsetRight = void 0;
            if (offsetEle.scrollLeft > trgt.offsetLeft) {
                offsetEle.scrollLeft -= (offsetEle.scrollLeft - trgt.offsetLeft);
            }
            offsetLeft = offsetEle.scrollLeft + offsetEle.offsetWidth;
            offsetRight = trgt.offsetLeft + trgt.offsetWidth;
            if (offsetLeft < offsetRight) {
                offsetEle.scrollLeft += (offsetRight - offsetLeft);
            }
        }
    };
    MenuBase.prototype.setPosition = function (li, ul, top, left) {
        var px = 'px';
        this.toggleVisiblity(ul);
        if (ul === this.element || (left > -1 && top > -1)) {
            var collide = sf.popups.isCollide(ul, null, left, top);
            if (collide.indexOf('right') > -1) {
                left = left - ul.offsetWidth;
            }
            if (collide.indexOf('bottom') > -1) {
                var offset = this.callFit(ul, false, true, top, left);
                top = offset.top - 20;
                if (top < 0) {
                    var newTop = (pageYOffset + document.documentElement.clientHeight) - ul.getBoundingClientRect().height;
                    if (newTop > -1) {
                        top = newTop;
                    }
                }
            }
            collide = sf.popups.isCollide(ul, null, left, top);
            if (collide.indexOf('left') > -1) {
                var offset = this.callFit(ul, true, false, top, left);
                left = offset.left;
            }
        }
        else {
            if (sf.base.Browser.isDevice) {
                top = Number(this.element.style.top.replace(px, ''));
                left = Number(this.element.style.left.replace(px, ''));
            }
            else {
                var x = this.enableRtl ? 'left' : 'right';
                var offset = sf.popups.calculatePosition(li, x, 'top');
                top = offset.top;
                left = offset.left;
                var collide = sf.popups.isCollide(ul, null, this.enableRtl ? left - ul.offsetWidth : left, top);
                var xCollision = collide.indexOf('left') > -1 || collide.indexOf('right') > -1;
                if (xCollision) {
                    offset = sf.popups.calculatePosition(li, this.enableRtl ? 'right' : 'left', 'top');
                    left = offset.left;
                }
                if (this.enableRtl || xCollision) {
                    left = (this.enableRtl && xCollision) ? left : left - ul.offsetWidth;
                }
                if (collide.indexOf('bottom') > -1) {
                    offset = this.callFit(ul, false, true, top, left);
                    top = offset.top;
                }
            }
        }
        this.toggleVisiblity(ul, false);
        ul.style.top = top + px;
        ul.style.left = left + px;
    };
    MenuBase.prototype.toggleVisiblity = function (ul, isVisible$$1) {
        if (isVisible$$1 === void 0) { isVisible$$1 = true; }
        ul.style.visibility = isVisible$$1 ? 'hidden' : '';
        ul.style.display = isVisible$$1 ? 'block' : 'none';
    };
    MenuBase.prototype.createItems = function (items) {
        var _this = this;
        var level = this.navIdx ? this.navIdx.length : 0;
        var fields = this.getFields(level);
        // tslint:disable-next-line:no-any
        if (sf.base.isBlazor() && this.template && items.length && items[0].properties) {
            var itemsObj_1 = [];
            items.forEach(function (item, index) {
                itemsObj_1.push({});
                itemsObj_1[index][fields.text] = item[fields.text];
                if (!item[fields.id]) {
                    item[fields.id] = sf.base.getUniqueID('menuitem');
                }
                itemsObj_1[index][fields.id] = item[fields.id];
                itemsObj_1[index][fields.iconCss] = item[fields.iconCss];
                itemsObj_1[index][fields.url] = item[fields.url];
                itemsObj_1[index][fields.child] = item[fields.child];
                itemsObj_1[index][fields.separator] = item[fields.separator];
            });
            items = itemsObj_1;
        }
        var showIcon = this.hasField(items, this.getField('iconCss', level));
        var listBaseOptions = {
            showIcon: showIcon,
            moduleName: 'menu',
            fields: fields,
            template: this.template,
            itemNavigable: true,
            itemCreating: function (args) {
                if (!args.curData[args.fields[fields.id]]) {
                    args.curData[args.fields[fields.id]] = sf.base.getUniqueID('menuitem');
                }
                args.curData.htmlAttributes = {
                    role: 'menuitem',
                    tabindex: '-1'
                };
                if (_this.isMenu && !args.curData[_this.getField('separator', level)]) {
                    args.curData.htmlAttributes['aria-label'] = args.curData[args.fields.text];
                }
                if (args.curData[args.fields[fields.iconCss]] === '') {
                    args.curData[args.fields[fields.iconCss]] = null;
                }
            },
            itemCreated: function (args) {
                if (args.curData[_this.getField('separator', level)]) {
                    args.item.classList.add(SEPARATOR);
                    args.item.removeAttribute('role');
                }
                if (showIcon && !args.curData[args.fields.iconCss]
                    && !args.curData[_this.getField('separator', level)]) {
                    args.item.classList.add('e-blankicon');
                }
                if (args.curData[args.fields.child]
                    && args.curData[args.fields.child].length) {
                    var span = _this.createElement('span', { className: ICONS + ' ' + CARET });
                    args.item.appendChild(span);
                    args.item.setAttribute('aria-haspopup', 'true');
                    args.item.setAttribute('aria-expanded', 'false');
                    if (!_this.isMenu) {
                        args.item.removeAttribute('role');
                    }
                    args.item.classList.add('e-menu-caret-icon');
                }
                if (_this.isMenu && _this.template) {
                    args.item.setAttribute('id', args.curData[args.fields.id].toString());
                    args.item.removeAttribute('data-uid');
                    if (args.item.classList.contains('e-level-1')) {
                        args.item.classList.remove('e-level-1');
                    }
                    if (args.item.classList.contains('e-has-child')) {
                        args.item.classList.remove('e-has-child');
                    }
                }
                var eventArgs = { item: args.curData, element: args.item };
                _this.trigger('beforeItemRender', eventArgs);
            }
        };
        this.setProperties({ 'items': this.items }, true);
        if (this.isMenu) {
            listBaseOptions.templateID = this.element.id + TEMPLATE_PROPERTY;
        }
        var ul = sf.lists.ListBase.createList(this.createElement, items, listBaseOptions, !this.template, this);
        ul.setAttribute('tabindex', '0');
        if (this.isMenu) {
            ul.setAttribute('role', 'menu');
        }
        return ul;
    };
    MenuBase.prototype.moverHandler = function (e) {
        var trgt = e.target;
        this.liTrgt = trgt;
        var cli = this.getLI(trgt);
        var wrapper = cli ? sf.base.closest(cli, '.e-' + this.getModuleName() + '-wrapper') : this.getWrapper();
        var hdrWrapper = this.getWrapper();
        var regex = new RegExp('-ej2menu-(.*)-popup');
        var ulId;
        var isDifferentElem = false;
        if (!wrapper) {
            return;
        }
        if (wrapper.id !== '') {
            ulId = regex.exec(wrapper.id)[1];
        }
        else {
            ulId = wrapper.querySelector('ul').id;
        }
        if (ulId !== this.element.id) {
            this.removeLIStateByClass([FOCUSED, SELECTED], [this.getWrapper()]);
            if (this.navIdx.length) {
                isDifferentElem = true;
            }
            else {
                return;
            }
        }
        if (cli && sf.base.closest(cli, '.e-' + this.getModuleName() + '-wrapper') && !isDifferentElem) {
            this.removeLIStateByClass([FOCUSED], this.isMenu ? [wrapper].concat(this.getPopups()) : [wrapper]);
            this.removeLIStateByClass([FOCUSED], this.isMenu ? [hdrWrapper].concat(this.getPopups()) : [hdrWrapper]);
            cli.classList.add(FOCUSED);
            if (!this.showItemOnClick) {
                this.clickHandler(e);
            }
        }
        else if (this.isMenu && this.showItemOnClick && !isDifferentElem) {
            this.removeLIStateByClass([FOCUSED], [wrapper].concat(this.getPopups()));
        }
        if (this.isMenu) {
            if (!this.showItemOnClick && (trgt.parentElement !== wrapper && !sf.base.closest(trgt, '.e-' + this.getModuleName() + '-popup'))
                && (!cli || (cli && !this.getIndex(cli.id, true).length))) {
                this.removeLIStateByClass([FOCUSED], [wrapper]);
                if (this.navIdx.length) {
                    this.isClosed = true;
                    this.closeMenu(null, e);
                }
            }
            else if (isDifferentElem && !this.showItemOnClick) {
                if (this.navIdx.length) {
                    this.isClosed = true;
                    this.closeMenu(null, e);
                }
            }
            if (!this.isClosed) {
                this.removeStateWrapper();
            }
            this.isClosed = false;
        }
    };
    MenuBase.prototype.removeStateWrapper = function () {
        if (this.liTrgt) {
            var wrapper = sf.base.closest(this.liTrgt, '.e-menu-vscroll');
            if (this.liTrgt.tagName === 'DIV' && wrapper) {
                this.removeLIStateByClass([FOCUSED, SELECTED], [wrapper]);
            }
        }
    };
    MenuBase.prototype.removeLIStateByClass = function (classList$$1, element) {
        var li;
        var _loop_1 = function (i) {
            classList$$1.forEach(function (className) {
                li = sf.base.select('.' + className, element[i]);
                if (li) {
                    li.classList.remove(className);
                }
            });
        };
        for (var i = 0; i < element.length; i++) {
            _loop_1(i);
        }
    };
    MenuBase.prototype.getField = function (propName, level) {
        if (level === void 0) { level = 0; }
        var fieldName = this.fields[propName];
        return typeof fieldName === 'string' ? fieldName :
            (!fieldName[level] ? fieldName[fieldName.length - 1].toString()
                : fieldName[level].toString());
    };
    MenuBase.prototype.getFields = function (level) {
        if (level === void 0) { level = 0; }
        return {
            id: this.getField('itemId', level),
            iconCss: this.getField('iconCss', level),
            text: this.getField('text', level),
            url: this.getField('url', level),
            child: this.getField('children', level),
            separator: this.getField('separator', level)
        };
    };
    MenuBase.prototype.hasField = function (items, field) {
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i][field]) {
                return true;
            }
        }
        return false;
    };
    MenuBase.prototype.menuHeaderClickHandler = function (e) {
        if (sf.base.closest(e.target, '.e-menu-wrapper').querySelector('ul.e-menu-parent').id !== this.element.id) {
            return;
        }
        this.element.classList.contains('e-hide-menu') ? this.openHamburgerMenu(e) : this.closeHamburgerMenu(e);
    };
    MenuBase.prototype.clickHandler = function (e) {
        if (this.isTapHold) {
            this.isTapHold = false;
        }
        else {
            var wrapper = this.getWrapper();
            var trgt = e.target;
            var cli = this.cli = this.getLI(trgt);
            var regex = new RegExp('-ej2menu-(.*)-popup');
            var cliWrapper = cli ? sf.base.closest(cli, '.e-' + this.getModuleName() + '-wrapper') : null;
            var isInstLI = cli && cliWrapper && (this.isMenu ? this.getIndex(cli.id, true).length > 0
                : wrapper.firstElementChild.id === cliWrapper.firstElementChild.id);
            if (sf.base.Browser.isDevice && this.isMenu) {
                this.removeLIStateByClass([FOCUSED], [wrapper].concat(this.getPopups()));
                this.mouseDownHandler(e);
            }
            if (cli && cliWrapper && this.isMenu) {
                var cliWrapperId = cliWrapper.id ? regex.exec(cliWrapper.id)[1] : cliWrapper.querySelector('.e-menu-parent').id;
                if (this.element.id !== cliWrapperId) {
                    return;
                }
            }
            if (isInstLI && e.type === 'click' && !cli.classList.contains(HEADER)) {
                this.setLISelected(cli);
                var navIdx = this.getIndex(cli.id, true);
                var item = this.getItem(navIdx);
                var eventArgs = { element: cli, item: item, event: e };
                this.trigger('select', eventArgs);
            }
            if (isInstLI && (e.type === 'mouseover' || sf.base.Browser.isDevice || this.showItemOnClick)) {
                var ul = void 0;
                if (cli.classList.contains(HEADER)) {
                    ul = wrapper.children[this.navIdx.length - 1];
                    this.toggleAnimation(ul);
                    var sli = this.getLIByClass(ul, SELECTED);
                    if (sli) {
                        sli.classList.remove(SELECTED);
                    }
                    sf.base.detach(cli.parentNode);
                    this.navIdx.pop();
                }
                else {
                    if (!cli.classList.contains(SEPARATOR)) {
                        this.showSubMenu = true;
                        var cul = cli.parentNode;
                        this.cliIdx = this.getIdx(cul, cli);
                        if (this.isMenu || !sf.base.Browser.isDevice) {
                            var culIdx = this.isMenu ? Array.prototype.indexOf.call([wrapper].concat(this.getPopups()), sf.base.closest(cul, '.' + 'e-' + this.getModuleName() + '-wrapper'))
                                : this.getIdx(wrapper, cul);
                            if (this.navIdx[culIdx] === this.cliIdx) {
                                this.showSubMenu = false;
                            }
                            if (culIdx !== this.navIdx.length && (e.type !== 'mouseover' || this.showSubMenu)) {
                                var sli = this.getLIByClass(cul, SELECTED);
                                if (sli) {
                                    sli.classList.remove(SELECTED);
                                }
                                this.isClosed = true;
                                this.keyType = 'click';
                                if (this.showItemOnClick) {
                                    this.setLISelected(cli);
                                }
                                this.closeMenu(culIdx + 1, e);
                                if (this.showItemOnClick) {
                                    this.setLISelected(cli);
                                }
                            }
                        }
                        if (!this.isClosed) {
                            this.afterCloseMenu(e);
                        }
                        this.isClosed = false;
                    }
                }
            }
            else {
                if (this.isMenu && trgt.tagName === 'DIV' && this.navIdx.length && sf.base.closest(trgt, '.e-menu-vscroll')) {
                    var popupEle = sf.base.closest(trgt, '.' + POPUP);
                    var cIdx = Array.prototype.indexOf.call(this.getPopups(), popupEle) + 1;
                    if (cIdx < this.navIdx.length) {
                        this.closeMenu(cIdx + 1, e);
                        if (popupEle) {
                            this.removeLIStateByClass([FOCUSED, SELECTED], [popupEle]);
                        }
                    }
                }
                else if (this.isMenu && this.hamburgerMode && trgt.tagName === 'SPAN'
                    && trgt.classList.contains('e-menu-icon')) {
                    this.menuHeaderClickHandler(e);
                }
                else {
                    if (trgt.tagName !== 'UL' || (this.isMenu ? trgt.parentElement.classList.contains('e-menu-wrapper') &&
                        !this.getIndex(trgt.querySelector('.' + ITEM).id, true).length : trgt.parentElement !== wrapper)) {
                        if (!cli) {
                            this.removeLIStateByClass([SELECTED], [wrapper]);
                        }
                        if (!cli || !cli.querySelector('.' + CARET)) {
                            this.closeMenu(null, e);
                        }
                    }
                }
            }
        }
    };
    MenuBase.prototype.afterCloseMenu = function (e) {
        var isHeader;
        if (this.showSubMenu) {
            if (this.showItemOnClick && this.navIdx.length === 0) {
                isHeader = sf.base.closest(e.target, '.e-menu-parent.e-control');
            }
            else {
                isHeader = sf.base.closest(this.element, '.e-menu-parent.e-control');
            }
            var idx = this.navIdx.concat(this.cliIdx);
            var item = this.getItem(idx);
            if (item && item[this.getField('children', idx.length - 1)] &&
                item[this.getField('children', idx.length - 1)].length) {
                if (e.type === 'mouseover' || (sf.base.Browser.isDevice && this.isMenu)) {
                    this.setLISelected(this.cli);
                }
                if ((!this.hamburgerMode && isHeader) || (this.hamburgerMode && this.cli.getAttribute('aria-expanded') === 'false')) {
                    this.cli.setAttribute('aria-expanded', 'true');
                    this.navIdx.push(this.cliIdx);
                    this.openMenu(this.cli, item, null, null, e);
                }
            }
            else {
                if (e.type !== 'mouseover') {
                    this.closeMenu(null, e);
                }
            }
            if (!isHeader) {
                var cul = this.getUlByNavIdx();
                var sli = this.getLIByClass(cul, SELECTED);
                if (sli) {
                    sli.setAttribute('aria-expanded', 'false');
                    sli.classList.remove(SELECTED);
                }
            }
        }
        this.keyType = '';
    };
    MenuBase.prototype.setLISelected = function (li) {
        var sli = this.getLIByClass(li.parentElement, SELECTED);
        if (sli) {
            sli.classList.remove(SELECTED);
        }
        if (!this.isMenu) {
            li.classList.remove(FOCUSED);
        }
        li.classList.add(SELECTED);
    };
    MenuBase.prototype.getLIByClass = function (ul, classname) {
        for (var i = 0, len = ul.children.length; i < len; i++) {
            if (ul.children[i].classList.contains(classname)) {
                return ul.children[i];
            }
        }
        return null;
    };
    /**
     * This method is used to get the index of the menu item in the Menu based on the argument.
     * @param item - item be passed to get the index | id to be passed to get the item index.
     * @param isUniqueId - Set `true` if it is a unique id.
     * @returns void
     */
    MenuBase.prototype.getItemIndex = function (item, isUniqueId) {
        var idx;
        if (typeof item === 'string') {
            idx = item;
        }
        else {
            idx = item.id;
        }
        var isText = (isUniqueId === false) ? false : true;
        var navIdx = this.getIndex(idx, isText);
        return navIdx;
    };
    /**
     * This method is used to set the menu item in the Menu based on the argument.
     * @param item - item need to be updated.
     * @param id - id to be passed to update the item.
     * @param isUniqueId - Set `true` if it is a unique id.
     * @returns void
     */
    MenuBase.prototype.setItem = function (item, id, isUniqueId) {
        var idx = id ? id : item.id;
        var isText = (isUniqueId === false) ? false : true;
        var navIdx = this.getIndex(idx, isText);
        var newItem = this.getItem(navIdx);
        newItem.iconCss = item.iconCss;
        newItem.id = item.id;
        newItem.text = item.text;
        newItem.url = item.url;
        newItem.separator = item.separator;
        newItem.items = item.items;
    };
    MenuBase.prototype.getItem = function (navIdx) {
        navIdx = navIdx.slice();
        var idx = navIdx.pop();
        var items = this.getItems(navIdx);
        return items[idx];
    };
    MenuBase.prototype.getItems = function (navIdx) {
        var items = this.items;
        for (var i = 0; i < navIdx.length; i++) {
            items = items[navIdx[i]][this.getField('children', i)];
        }
        return items;
    };
    MenuBase.prototype.setItems = function (newItems, navIdx) {
        var items = this.getItems(navIdx);
        items.splice(0, items.length);
        for (var i = 0; i < newItems.length; i++) {
            items.splice(i, 0, newItems[i]);
        }
    };
    MenuBase.prototype.getIdx = function (ul, li, skipHdr) {
        if (skipHdr === void 0) { skipHdr = true; }
        var idx = Array.prototype.indexOf.call(ul.querySelectorAll('li'), li);
        if (this.isMenu && this.template && sf.base.isBlazor()) {
            idx = Array.prototype.indexOf.call(ul.querySelectorAll(li.tagName), li);
        }
        else {
            idx = Array.prototype.indexOf.call(ul.children, li);
        }
        if (skipHdr && ul.children[0].classList.contains(HEADER)) {
            idx--;
        }
        return idx;
    };
    MenuBase.prototype.getLI = function (elem) {
        if (elem.tagName === 'LI' && elem.classList.contains('e-menu-item')) {
            return elem;
        }
        return sf.base.closest(elem, 'li.e-menu-item');
    };
    MenuBase.prototype.updateItemsByNavIdx = function () {
        var items = this.items;
        var count = 0;
        for (var index = 0; index < this.navIdx.length; index++) {
            items = items[index].items;
            if (!items) {
                break;
            }
            count++;
            var ul = this.getUlByNavIdx(count);
            if (!ul) {
                break;
            }
            this.updateItem(ul, items);
        }
    };
    MenuBase.prototype.removeChildElement = function (elem) {
        while (elem.firstElementChild) {
            elem.removeChild(elem.firstElementChild);
        }
        return elem;
    };
    /**
     * Called internally if any of the property value changed
     * @private
     * @param {MenuBaseModel} newProp
     * @param {MenuBaseModel} oldProp
     * @returns void
     */
    MenuBase.prototype.onPropertyChanged = function (newProp, oldProp) {
        var _this = this;
        var wrapper = this.getWrapper();
        var _loop_2 = function (prop) {
            switch (prop) {
                case 'cssClass':
                    if (oldProp.cssClass) {
                        sf.base.removeClass([wrapper], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        sf.base.addClass([wrapper], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    wrapper.classList.toggle(RTL);
                    break;
                case 'showItemOnClick':
                    this_1.unWireEvents();
                    this_1.showItemOnClick = newProp.showItemOnClick;
                    this_1.wireEvents();
                    break;
                case 'enableScrolling':
                    if (newProp.enableScrolling) {
                        var ul_2;
                        this_1.element.classList.contains('e-vertical') ?
                            addScrolling(this_1.createElement, wrapper, this_1.element, 'vscroll', this_1.enableRtl)
                            : addScrolling(this_1.createElement, wrapper, this_1.element, 'hscroll', this_1.enableRtl);
                        this_1.getPopups().forEach(function (wrapper) {
                            ul_2 = sf.base.select('.e-ul', wrapper);
                            addScrolling(_this.createElement, wrapper, ul_2, 'vscroll', _this.enableRtl);
                        });
                    }
                    else {
                        var ul_3 = wrapper.children[0];
                        this_1.element.classList.contains('e-vertical') ? destroyScroll(sf.base.getInstance(ul_3, VScroll), ul_3)
                            : destroyScroll(sf.base.getInstance(ul_3, HScroll), ul_3);
                        wrapper.style.overflow = '';
                        wrapper.appendChild(this_1.element);
                        this_1.getPopups().forEach(function (wrapper) {
                            ul_3 = wrapper.children[0];
                            destroyScroll(sf.base.getInstance(ul_3, VScroll), ul_3);
                            wrapper.style.overflow = '';
                        });
                    }
                    break;
                case 'items':
                    var idx = void 0;
                    var navIdx = void 0;
                    var item = void 0;
                    if (!Object.keys(oldProp.items).length) {
                        this_1.updateItem(this_1.element, this_1.items);
                        for (var i = 1, count = wrapper.childElementCount; i < count; i++) {
                            sf.base.detach(wrapper.lastElementChild);
                        }
                        if (this_1.isMenu && sf.base.isBlazor()) {
                            this_1.updateItemsByNavIdx();
                        }
                        else {
                            this_1.navIdx = [];
                        }
                    }
                    else {
                        var keys = Object.keys(newProp.items);
                        for (var i = 0; i < keys.length; i++) {
                            navIdx = this_1.getChangedItemIndex(newProp, [], Number(keys[i]));
                            if (navIdx.length <= this_1.getWrapper().children.length) {
                                idx = navIdx.pop();
                                item = this_1.getItems(navIdx);
                                this_1.insertAfter([item[idx]], item[idx].text);
                                this_1.removeItem(item, navIdx, idx);
                                this_1.setItems(item, navIdx);
                            }
                            navIdx.length = 0;
                        }
                    }
                    break;
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            _loop_2(prop);
        }
    };
    MenuBase.prototype.updateItem = function (ul, items) {
        if (sf.base.isBlazor()) {
            ul = this.removeChildElement(ul);
        }
        else {
            ul.innerHTML = '';
        }
        var lis = [].slice.call(this.createItems(items).children);
        lis.forEach(function (li) {
            ul.appendChild(li);
        });
    };
    MenuBase.prototype.getChangedItemIndex = function (newProp, index, idx) {
        index.push(idx);
        var key = Object.keys(newProp.items[idx]).pop();
        if (key === 'items') {
            var item = newProp.items[idx];
            var popStr = Object.keys(item.items).pop();
            if (popStr) {
                this.getChangedItemIndex(item, index, Number(popStr));
            }
        }
        else {
            if (key === 'isParentArray' && index.length > 1) {
                index.pop();
            }
        }
        return index;
    };
    MenuBase.prototype.removeItem = function (item, navIdx, idx) {
        item.splice(idx, 1);
        var uls = this.getWrapper().children;
        if (navIdx.length < uls.length) {
            sf.base.detach(uls[navIdx.length].children[idx]);
        }
    };
    /**
     * Used to unwire the bind events.
     * @private
     */
    MenuBase.prototype.unWireEvents = function (targetSelctor) {
        if (targetSelctor === void 0) { targetSelctor = this.target; }
        var wrapper = this.getWrapper();
        if (targetSelctor) {
            var target = void 0;
            var touchModule = void 0;
            var targetElems = sf.base.selectAll(targetSelctor);
            for (var i = 0, len = targetElems.length; i < len; i++) {
                target = targetElems[i];
                if (this.isMenu) {
                    sf.base.EventHandler.remove(target, 'click', this.menuHeaderClickHandler);
                }
                else {
                    if (sf.base.Browser.isIos) {
                        touchModule = sf.base.getInstance(target, sf.base.Touch);
                        if (touchModule) {
                            touchModule.destroy();
                        }
                    }
                    else {
                        sf.base.EventHandler.remove(target, 'contextmenu', this.cmenuHandler);
                    }
                }
            }
            if (!this.isMenu) {
                sf.base.EventHandler.remove(this.targetElement, 'scroll', this.scrollHandler);
                for (var _i = 0, _a = sf.popups.getScrollableParent(this.targetElement); _i < _a.length; _i++) {
                    var parent_2 = _a[_i];
                    sf.base.EventHandler.remove(parent_2, 'scroll', this.scrollHandler);
                }
            }
        }
        if (!sf.base.Browser.isDevice) {
            sf.base.EventHandler.remove(this.isMenu ? document : wrapper, 'mouseover', this.delegateMoverHandler);
            sf.base.EventHandler.remove(document, 'mousedown', this.delegateMouseDownHandler);
        }
        sf.base.EventHandler.remove(document, 'click', this.delegateClickHandler);
        this.unWireKeyboardEvent(wrapper);
        this.rippleFn();
    };
    MenuBase.prototype.unWireKeyboardEvent = function (element) {
        var keyboardModule = sf.base.getInstance(element, sf.base.KeyboardEvents);
        if (keyboardModule) {
            keyboardModule.destroy();
        }
    };
    MenuBase.prototype.toggleAnimation = function (ul, isMenuOpen) {
        var _this = this;
        if (isMenuOpen === void 0) { isMenuOpen = true; }
        var pUlHeight;
        var pElement;
        if (this.animationSettings.effect === 'None' || !isMenuOpen) {
            this.end(ul, isMenuOpen);
        }
        else {
            this.animation.animate(ul, {
                name: this.animationSettings.effect,
                duration: this.animationSettings.duration,
                timingFunction: this.animationSettings.easing,
                begin: function (options) {
                    if (_this.hamburgerMode) {
                        pElement = options.element.parentElement;
                        options.element.style.position = 'absolute';
                        pUlHeight = pElement.offsetHeight;
                        options.element.style.maxHeight = options.element.offsetHeight + 'px';
                        pElement.style.maxHeight = '';
                    }
                    else {
                        options.element.style.display = 'block';
                        options.element.style.maxHeight = options.element.getBoundingClientRect().height + 'px';
                    }
                },
                progress: function (options) {
                    if (_this.hamburgerMode) {
                        pElement.style.minHeight = (pUlHeight + options.element.offsetHeight) + 'px';
                    }
                },
                end: function (options) {
                    if (_this.hamburgerMode) {
                        options.element.style.position = '';
                        options.element.style.maxHeight = '';
                        pElement.style.minHeight = '';
                        options.element.style.top = 0 + 'px';
                        options.element.children[0].focus();
                        _this.triggerOpen(options.element.children[0]);
                    }
                    else {
                        _this.end(options.element, isMenuOpen);
                    }
                }
            });
        }
    };
    MenuBase.prototype.triggerOpen = function (ul) {
        var item = this.navIdx.length ? this.getItem(this.navIdx) : null;
        var eventArgs = {
            element: ul, parentItem: item, items: item ? item.items : this.items
        };
        this.trigger('onOpen', eventArgs);
    };
    MenuBase.prototype.end = function (ul, isMenuOpen) {
        if (isMenuOpen) {
            ul.style.display = 'block';
            ul.style.maxHeight = '';
            this.triggerOpen(ul);
            if (ul.querySelector('.' + FOCUSED)) {
                ul.querySelector('.' + FOCUSED).focus();
            }
            else {
                var ele = void 0;
                ele = this.getWrapper().children[this.getIdx(this.getWrapper(), ul) - 1];
                if (ele) {
                    ele.querySelector('.' + SELECTED).focus();
                }
                else {
                    this.element.focus();
                }
            }
        }
        else {
            if (ul === this.element) {
                var fli = this.getLIByClass(this.element, FOCUSED);
                if (fli) {
                    fli.classList.remove(FOCUSED);
                }
                var sli = this.getLIByClass(this.element, SELECTED);
                if (sli) {
                    sli.classList.remove(SELECTED);
                }
                ul.style.display = 'none';
            }
            else {
                sf.base.detach(ul);
            }
        }
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    MenuBase.prototype.getPersistData = function () {
        return '';
    };
    /**
     * Get wrapper element.
     * @returns Element
     * @private
     */
    MenuBase.prototype.getWrapper = function () {
        return sf.base.closest(this.element, '.e-' + this.getModuleName() + '-wrapper');
    };
    MenuBase.prototype.getIndex = function (data, isUniqueId, items, nIndex, isCallBack, level) {
        if (items === void 0) { items = this.items; }
        if (nIndex === void 0) { nIndex = []; }
        if (isCallBack === void 0) { isCallBack = false; }
        if (level === void 0) { level = 0; }
        var item;
        level = isCallBack ? level + 1 : 0;
        for (var i = 0, len = items.length; i < len; i++) {
            item = items[i];
            if ((isUniqueId ? item[this.getField('itemId', level)] : item[this.getField('text', level)]) === data) {
                nIndex.push(i);
                break;
            }
            else if (item[this.getField('children', level)]
                && item[this.getField('children', level)].length) {
                nIndex = this.getIndex(data, isUniqueId, item[this.getField('children', level)], nIndex, true, level);
                if (nIndex[nIndex.length - 1] === -1) {
                    if (i !== len - 1) {
                        nIndex.pop();
                    }
                }
                else {
                    nIndex.unshift(i);
                    break;
                }
            }
            else {
                if (i === len - 1) {
                    nIndex.push(-1);
                }
            }
        }
        return (!isCallBack && nIndex[0] === -1) ? [] : nIndex;
    };
    /**
     * This method is used to enable or disable the menu items in the Menu based on the items and enable argument.
     * @param items Text items that needs to be enabled/disabled.
     * @param enable Set `true`/`false` to enable/disable the list items.
     * @param isUniqueId - Set `true` if it is a unique id.
     * @returns void
     */
    MenuBase.prototype.enableItems = function (items, enable, isUniqueId) {
        if (enable === void 0) { enable = true; }
        var ul;
        var idx;
        var navIdx;
        var disabled = DISABLED;
        var skipItem;
        for (var i = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i], isUniqueId);
            if (this.navIdx.length) {
                if (navIdx.length !== 1) {
                    skipItem = false;
                    for (var i_1 = 0, len = navIdx.length - 1; i_1 < len; i_1++) {
                        if (navIdx[i_1] !== this.navIdx[i_1]) {
                            skipItem = true;
                            break;
                        }
                    }
                    if (skipItem) {
                        continue;
                    }
                }
            }
            else {
                if (navIdx.length !== 1) {
                    continue;
                }
            }
            idx = navIdx.pop();
            ul = this.getUlByNavIdx(navIdx.length);
            if (ul) {
                if (enable) {
                    if (this.isMenu) {
                        ul.children[idx].classList.remove(disabled);
                        ul.children[idx].removeAttribute('aria-disabled');
                    }
                    else {
                        if (sf.base.Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                            ul.children[idx + 1].classList.remove(disabled);
                        }
                        else {
                            ul.children[idx].classList.remove(disabled);
                        }
                    }
                }
                else {
                    if (this.isMenu) {
                        ul.children[idx].classList.add(disabled);
                        ul.children[idx].setAttribute('aria-disabled', 'true');
                    }
                    else {
                        if (sf.base.Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                            ul.children[idx + 1].classList.add(disabled);
                        }
                        else {
                            ul.children[idx].classList.add(disabled);
                        }
                    }
                }
            }
        }
    };
    /**
     * This method is used to show the menu items in the Menu based on the items text.
     * @param items Text items that needs to be shown.
     * @param isUniqueId - Set `true` if it is a unique id.
     * @returns void
     */
    MenuBase.prototype.showItems = function (items, isUniqueId) {
        this.showHideItems(items, false, isUniqueId);
    };
    /**
     * This method is used to hide the menu items in the Menu based on the items text.
     * @param items Text items that needs to be hidden.
     * @returns void
     */
    MenuBase.prototype.hideItems = function (items, isUniqueId) {
        this.showHideItems(items, true, isUniqueId);
    };
    MenuBase.prototype.showHideItems = function (items, ishide, isUniqueId) {
        var ul;
        var index;
        var navIdx;
        for (var i = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i], isUniqueId);
            index = navIdx.pop();
            ul = this.getUlByNavIdx(navIdx.length);
            if (ul) {
                if (ishide) {
                    if (sf.base.Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                        ul.children[index + 1].classList.add(HIDE);
                    }
                    else {
                        ul.children[index].classList.add(HIDE);
                    }
                }
                else {
                    if (sf.base.Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                        ul.children[index + 1].classList.remove(HIDE);
                    }
                    else {
                        ul.children[index].classList.remove(HIDE);
                    }
                }
            }
        }
    };
    /**
     * It is used to remove the menu items from the Menu based on the items text.
     * @param items Text items that needs to be removed.
     * @returns void
     */
    MenuBase.prototype.removeItems = function (items, isUniqueId) {
        var idx;
        var navIdx;
        var iitems;
        for (var i = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i], isUniqueId);
            idx = navIdx.pop();
            iitems = this.getItems(navIdx);
            this.removeItem(iitems, navIdx, idx);
        }
    };
    /**
     * It is used to insert the menu items after the specified menu item text.
     * @param items Items that needs to be inserted.
     * @param text Text item after that the element to be inserted.
     * @returns void
     */
    MenuBase.prototype.insertAfter = function (items, text, isUniqueId) {
        this.insertItems(items, text, isUniqueId);
    };
    /**
     * It is used to insert the menu items before the specified menu item text.
     * @param items Items that needs to be inserted.
     * @param text Text item before that the element to be inserted.
     * @param isUniqueId - Set `true` if it is a unique id.
     * @returns void
     */
    MenuBase.prototype.insertBefore = function (items, text, isUniqueId) {
        this.insertItems(items, text, isUniqueId, false);
    };
    MenuBase.prototype.insertItems = function (items, text, isUniqueId, isAfter) {
        if (isAfter === void 0) { isAfter = true; }
        var li;
        var idx;
        var navIdx;
        var iitems;
        var menuitem;
        var showIcon;
        for (var i = 0; i < items.length; i++) {
            navIdx = this.getIndex(text, isUniqueId);
            idx = navIdx.pop();
            iitems = this.getItems(navIdx);
            menuitem = new MenuItem(iitems[0], 'items', items[i], true);
            iitems.splice(isAfter ? idx + 1 : idx, 0, menuitem);
            var uls = this.isMenu ? [this.getWrapper()].concat(this.getPopups()) : [].slice.call(this.getWrapper().children);
            if (navIdx.length < uls.length) {
                idx = isAfter ? idx + 1 : idx;
                showIcon = this.hasField(iitems, this.getField('iconCss', navIdx.length - 1));
                li = this.createItems(iitems).children[idx];
                var ul = this.isMenu ? sf.base.select('.e-menu-parent', uls[navIdx.length]) : uls[navIdx.length];
                ul.insertBefore(li, ul.children[idx]);
            }
        }
    };
    MenuBase.prototype.removeAttributes = function () {
        var _this = this;
        ['top', 'left', 'display', 'z-index'].forEach(function (key) {
            _this.element.style.removeProperty(key);
        });
        ['role', 'tabindex', 'class', 'style'].forEach(function (key) {
            if (key === 'class' && _this.element.classList.contains('e-menu-parent')) {
                _this.element.classList.remove('e-menu-parent');
            }
            if (['class', 'style'].indexOf(key) === -1 || !_this.element.getAttribute(key)) {
                _this.element.removeAttribute(key);
            }
            if (_this.isMenu && key === 'class' && _this.element.classList.contains('e-vertical')) {
                _this.element.classList.remove('e-vertical');
            }
        });
    };
    /**
     * Destroys the widget.
     * @returns void
     */
    MenuBase.prototype.destroy = function () {
        var wrapper = this.getWrapper();
        if (wrapper) {
            this.unWireEvents();
            if (!this.isMenu) {
                this.clonedElement.style.display = '';
                if (this.clonedElement.tagName === 'EJS-CONTEXTMENU') {
                    sf.base.addClass([this.clonedElement], ['e-control', 'e-lib', 'e-' + this.getModuleName()]);
                    this.element = this.clonedElement;
                }
                else {
                    if (this.refreshing && this.clonedElement.childElementCount && this.clonedElement.children[0].tagName === 'LI') {
                        this.setProperties({ 'items': [] }, true);
                    }
                    if (document.getElementById(this.clonedElement.id)) {
                        var refEle = this.clonedElement.nextElementSibling;
                        refEle && refEle !== wrapper ? this.clonedElement.parentElement.insertBefore(this.element, refEle) :
                            this.clonedElement.parentElement.appendChild(this.element);
                        if (sf.base.isBlazor()) {
                            this.element = this.removeChildElement(this.element);
                        }
                        else {
                            this.element.innerHTML = '';
                        }
                        sf.base.append([].slice.call(this.clonedElement.children), this.element);
                        sf.base.detach(this.clonedElement);
                        this.removeAttributes();
                    }
                }
                this.clonedElement = null;
            }
            else {
                this.closeMenu();
                if (sf.base.isBlazor()) {
                    this.element = this.removeChildElement(this.element);
                }
                else {
                    this.element.innerHTML = '';
                }
                this.removeAttributes();
                wrapper.parentNode.insertBefore(this.element, wrapper);
            }
            if (this.isMenu && this.clonedElement) {
                sf.base.detach(this.element);
                wrapper.style.display = '';
                wrapper.classList.remove('e-' + this.getModuleName() + '-wrapper');
                wrapper.removeAttribute('data-ripple');
            }
            else {
                sf.base.detach(wrapper);
            }
            _super.prototype.destroy.call(this);
            if (this.template) {
                this.clearTemplate(['template']);
            }
        }
    };
    __decorate$1([
        sf.base.Event()
    ], MenuBase.prototype, "beforeItemRender", void 0);
    __decorate$1([
        sf.base.Event()
    ], MenuBase.prototype, "beforeOpen", void 0);
    __decorate$1([
        sf.base.Event()
    ], MenuBase.prototype, "onOpen", void 0);
    __decorate$1([
        sf.base.Event()
    ], MenuBase.prototype, "beforeClose", void 0);
    __decorate$1([
        sf.base.Event()
    ], MenuBase.prototype, "onClose", void 0);
    __decorate$1([
        sf.base.Event()
    ], MenuBase.prototype, "select", void 0);
    __decorate$1([
        sf.base.Event()
    ], MenuBase.prototype, "created", void 0);
    __decorate$1([
        sf.base.Property('')
    ], MenuBase.prototype, "cssClass", void 0);
    __decorate$1([
        sf.base.Property(false)
    ], MenuBase.prototype, "showItemOnClick", void 0);
    __decorate$1([
        sf.base.Property('')
    ], MenuBase.prototype, "target", void 0);
    __decorate$1([
        sf.base.Property('')
    ], MenuBase.prototype, "filter", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], MenuBase.prototype, "template", void 0);
    __decorate$1([
        sf.base.Property(false)
    ], MenuBase.prototype, "enableScrolling", void 0);
    __decorate$1([
        sf.base.Property(false)
    ], MenuBase.prototype, "enableHtmlSanitizer", void 0);
    __decorate$1([
        sf.base.Complex({ itemId: "id", text: "text", parentId: "parentId", iconCss: "iconCss", url: "url", separator: "separator", children: "items" }, FieldSettings)
    ], MenuBase.prototype, "fields", void 0);
    __decorate$1([
        sf.base.Collection([], MenuItem)
    ], MenuBase.prototype, "items", void 0);
    __decorate$1([
        sf.base.Complex({ duration: 400, easing: 'ease', effect: 'SlideDown' }, MenuAnimationSettings)
    ], MenuBase.prototype, "animationSettings", void 0);
    MenuBase = __decorate$1([
        sf.base.NotifyPropertyChanges
    ], MenuBase);
    return MenuBase;
}(sf.base.Component));

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
/// <reference path='../common/menu-base-model.d.ts'/>
/**
 * The ContextMenu is a graphical user interface that appears on the user right click/touch hold operation.
 * ```html
 * <div id = 'target'></div>
 * <ul id = 'contextmenu'></ul>
 * ```
 * ```typescript
 * <script>
 * var contextMenuObj = new ContextMenu({items: [{ text: 'Cut' }, { text: 'Copy' },{ text: 'Paste' }], target: '#target'});
 * </script>
 * ```
 */
var ContextMenu = /** @class */ (function (_super) {
    __extends(ContextMenu, _super);
    /**
     * Constructor for creating the widget.
     * @private
     */
    function ContextMenu(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * For internal use only - prerender processing.
     * @private
     */
    ContextMenu.prototype.preRender = function () {
        this.isMenu = false;
        this.element.id = this.element.id || sf.base.getUniqueID('ej2-contextmenu');
        _super.prototype.preRender.call(this);
    };
    ContextMenu.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        sf.base.attributes(this.element, { 'role': 'context menu', 'tabindex': '0' });
        this.element.style.zIndex = sf.popups.getZindexPartial(this.element).toString();
    };
    /**
     * This method is used to open the ContextMenu in specified position.
     * @param top - To specify ContextMenu vertical positioning.
     * @param left - To specify ContextMenu horizontal positioning.
     * @param target - To calculate z-index for ContextMenu based upon the specified target.
     * @method open
     * @returns void
     */
    ContextMenu.prototype.open = function (top, left, target) {
        _super.prototype.openMenu.call(this, null, null, top, left, null, target);
    };
    /**
     * Closes the ContextMenu if it is opened.
     */
    ContextMenu.prototype.close = function () {
        _super.prototype.closeMenu.call(this);
    };
    /**
     * Called internally if any of the property value changed
     * @private
     * @param {ContextMenuModel} newProp
     * @param {ContextMenuModel} oldProp
     * @returns void
     */
    ContextMenu.prototype.onPropertyChanged = function (newProp, oldProp) {
        _super.prototype.onPropertyChanged.call(this, newProp, oldProp);
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'filter':
                    this.close();
                    this.filter = newProp.filter;
                    break;
                case 'target':
                    this.unWireEvents(oldProp.target);
                    this.wireEvents();
                    break;
            }
        }
    };
    /**
     * Get module name.
     * @returns string
     * @private
     */
    ContextMenu.prototype.getModuleName = function () {
        return 'contextmenu';
    };
    __decorate([
        sf.base.Property('')
    ], ContextMenu.prototype, "target", void 0);
    __decorate([
        sf.base.Property('')
    ], ContextMenu.prototype, "filter", void 0);
    __decorate([
        sf.base.Collection([], MenuItem)
    ], ContextMenu.prototype, "items", void 0);
    ContextMenu = __decorate([
        sf.base.NotifyPropertyChanges
    ], ContextMenu);
    return ContextMenu;
}(MenuBase));

/**
 * ContextMenu modules
 */

exports.ContextMenu = ContextMenu;

return exports;

});

    sf.navigations = sf.base.extend({}, sf.navigations, sfcontextmenu({}));