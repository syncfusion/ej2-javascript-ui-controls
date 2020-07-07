window.sf = window.sf || {};
var sfsidebar = (function (exports) {
'use strict';

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
var CONTROL = 'e-control';
var ROOT = 'e-sidebar';
var DOCKER = 'e-dock';
var CLOSE = 'e-close';
var OPEN = 'e-open';
var TRASITION = 'e-transition';
var DEFAULTBACKDROP = 'e-sidebar-overlay';
var CONTEXTBACKDROP = 'e-backdrop';
var RTL = 'e-rtl';
var RIGHT = 'e-right';
var LEFT = 'e-left';
var OVER = 'e-over';
var PUSH = 'e-push';
var SLIDE = 'e-slide';
var VISIBILITY = 'e-visibility';
var MAINCONTENTANIMATION = 'e-content-animation';
var DISABLEANIMATION = 'e-disable-animation';
var CONTEXT = 'e-sidebar-context';
var SIDEBARABSOLUTE = 'e-sidebar-absolute';
/**
 * Sidebar is an expandable or collapsible
 * component that typically act as a side container to place the primary or secondary content alongside of the main content.
 * ```html
 * <aside id="sidebar">
 * </aside>
 * ```
 * ```typescript
 * <script>
 *   let sidebarObject: Sidebar = new Sidebar();
 *   sidebarObject.appendTo("#sidebar");
 * </script>
 * ```
 */
var Sidebar = /** @class */ (function (_super) {
    __extends(Sidebar, _super);
    function Sidebar(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isBlazor = false;
        return _this;
    }
    Sidebar.prototype.preRender = function () {
        this.isBlazor = (sf.base.isBlazor() && this.isServerRendered);
        if (!this.isBlazor) {
            this.setWidth();
        }
    };
    Sidebar.prototype.render = function () {
        this.initialize();
        this.wireEvents();
        this.renderComplete();
    };
    Sidebar.prototype.initialize = function () {
        this.setTarget();
        this.addClass();
        if (!this.isBlazor) {
            this.setZindex();
        }
        if (this.enableDock) {
            this.setDock();
        }
        if (this.isOpen) {
            this.show();
        }
        else {
            this.setMediaQuery();
        }
        this.checkType(true);
        this.setType(this.type);
        this.setCloseOnDocumentClick();
        if (!this.isBlazor) {
            this.setEnableRTL();
        }
        if (sf.base.Browser.isDevice) {
            this.windowWidth = window.innerWidth;
        }
    };
    Sidebar.prototype.setEnableRTL = function () {
        this.enableRtl ? (sf.base.addClass([this.element], RTL)) :
            (sf.base.removeClass([this.element], RTL));
    };
    Sidebar.prototype.setTarget = function () {
        this.targetEle = this.element.nextElementSibling;
        this.sidebarEleCopy = this.element.cloneNode(true);
        if (typeof (this.target) === 'string') {
            this.setProperties({ target: document.querySelector(this.target) }, true);
        }
        if (this.target) {
            this.target.insertBefore(this.element, this.target.children[0]);
            sf.base.addClass([this.element], SIDEBARABSOLUTE);
            sf.base.addClass([this.target], CONTEXT);
            this.targetEle = this.getTargetElement();
        }
    };
    Sidebar.prototype.getTargetElement = function () {
        var siblingElement = this.element.nextElementSibling;
        while (!sf.base.isNullOrUndefined(siblingElement)) {
            if (!siblingElement.classList.contains(ROOT)) {
                break;
            }
            siblingElement = siblingElement.nextElementSibling;
        }
        return siblingElement;
    };
    Sidebar.prototype.setCloseOnDocumentClick = function () {
        if (this.closeOnDocumentClick) {
            sf.base.EventHandler.add(document, 'mousedown touchstart', this.documentclickHandler, this);
        }
        else {
            sf.base.EventHandler.remove(document, 'mousedown touchstart', this.documentclickHandler);
        }
    };
    Sidebar.prototype.setWidth = function () {
        if (this.enableDock && this.position === 'Left') {
            sf.base.setStyleAttribute(this.element, { 'width': this.setDimension(this.dockSize) });
        }
        else if (this.enableDock && this.position === 'Right') {
            sf.base.setStyleAttribute(this.element, { 'width': this.setDimension(this.dockSize) });
        }
        else if (!this.enableDock) {
            sf.base.setStyleAttribute(this.element, { 'width': this.setDimension(this.width) });
        }
    };
    Sidebar.prototype.setDimension = function (width) {
        if (typeof width === 'number') {
            width = sf.base.formatUnit(width);
        }
        else if (typeof width === 'string') {
            width = (width.match(/px|%|em/)) ? width : sf.base.formatUnit(width);
        }
        else {
            width = '100%';
        }
        return width;
    };
    Sidebar.prototype.setZindex = function () {
        sf.base.setStyleAttribute(this.element, { 'z-index': '' + this.zIndex });
    };
    Sidebar.prototype.addClass = function () {
        var classELement = document.querySelector('.e-main-content');
        if (!sf.base.isNullOrUndefined(classELement || this.targetEle)) {
            sf.base.addClass([classELement || this.targetEle], [MAINCONTENTANIMATION]);
        }
        this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
        if (!this.isBlazor) {
            if (!this.enableDock && this.type !== 'Auto') {
                sf.base.addClass([this.element], [VISIBILITY]);
            }
            sf.base.removeClass([this.element], [OPEN, CLOSE, RIGHT, LEFT, SLIDE, PUSH, OVER]);
            this.element.classList.add(ROOT);
            sf.base.addClass([this.element], (this.position === 'Right') ? RIGHT : LEFT);
            if (this.enableDock) {
                sf.base.addClass([this.element], DOCKER);
            }
            this.element.setAttribute('tabindex', this.tabIndex);
        }
        if (this.type === 'Auto' && !sf.base.Browser.isDevice) {
            this.show();
        }
        else if (!this.isOpen) {
            sf.base.addClass([this.element], CLOSE);
        }
    };
    Sidebar.prototype.checkType = function (val) {
        if (!(this.type === 'Push' || this.type === 'Over' || this.type === 'Slide')) {
            this.type = 'Auto';
        }
        else {
            if (!this.element.classList.contains(CLOSE) && !val) {
                this.hide();
            }
        }
    };
    Sidebar.prototype.transitionEnd = function (e) {
        this.setDock();
        if (!sf.base.isNullOrUndefined(e) && e.target === this.element) {
            this.triggerChange();
        }
        sf.base.EventHandler.remove(this.element, 'transitionend', this.transitionEnd);
    };
    Sidebar.prototype.destroyBackDrop = function () {
        var sibling = document.querySelector('.e-main-content') || this.targetEle;
        if (this.target && this.showBackdrop && sibling) {
            sf.base.removeClass([sibling], CONTEXTBACKDROP);
        }
        else if (this.showBackdrop && this.modal) {
            this.modal.style.display = 'none';
            this.modal.outerHTML = '';
            this.modal = null;
        }
    };
    /**
     * Hide the Sidebar component, if it is in an open state.
     * @returns void
     */
    Sidebar.prototype.hide = function (e) {
        var _this = this;
        var closeArguments = {
            model: this,
            element: this.element,
            cancel: false,
            isInteracted: !sf.base.isNullOrUndefined(e),
            event: (e || null)
        };
        if (sf.base.isBlazor()) {
            delete closeArguments.model;
        }
        this.trigger('close', closeArguments, function (observedcloseArgs) {
            if (!observedcloseArgs.cancel) {
                if (_this.element.classList.contains(CLOSE)) {
                    return;
                }
                if (_this.element.classList.contains(OPEN) && !_this.animate) {
                    _this.triggerChange();
                }
                sf.base.addClass([_this.element], CLOSE);
                sf.base.removeClass([_this.element], OPEN);
                _this.enableDock ? sf.base.setStyleAttribute(_this.element, { 'width': sf.base.formatUnit(_this.dockSize) }) :
                    sf.base.setStyleAttribute(_this.element, { 'width': sf.base.formatUnit(_this.width) });
                _this.setType(_this.type);
                var sibling = document.querySelector('.e-main-content') || _this.targetEle;
                if (!_this.enableDock && sibling) {
                    sibling.style.transform = 'translateX(' + 0 + 'px)';
                    _this.position === 'Left' ? sibling.style.marginLeft = '0px' : sibling.style.marginRight = '0px';
                }
                _this.destroyBackDrop();
                _this.setAnimation();
                if (_this.type === 'Slide') {
                    document.body.classList.remove('e-sidebar-overflow');
                }
                _this.setProperties({ isOpen: false }, true);
                if (_this.enableDock) {
                    setTimeout(function () { return _this.setTimeOut(); }, 50);
                }
                sf.base.EventHandler.add(_this.element, 'transitionend', _this.transitionEnd, _this);
            }
        });
    };
    Sidebar.prototype.setTimeOut = function () {
        var sibling = document.querySelector('.e-main-content') || this.targetEle;
        if (this.element.classList.contains(OPEN) && sibling) {
            if (this.position === 'Left') {
                this.width === 'auto' ? sibling.style.marginLeft = this.setDimension(this.element.getBoundingClientRect().width)
                    : sibling.style.marginLeft = this.setDimension(this.width);
            }
            else {
                this.width === 'auto' ? sibling.style.marginRight = this.setDimension(this.element.getBoundingClientRect().width)
                    : sibling.style.marginRight = this.setDimension(this.width);
            }
        }
        else if (this.element.classList.contains(CLOSE) && sibling) {
            if (this.position === 'Left') {
                this.dockSize === 'auto' ? sibling.style.marginLeft = this.setDimension(this.element.getBoundingClientRect().width)
                    : sibling.style.marginLeft = this.setDimension(this.dockSize);
            }
            else {
                this.dockSize === 'auto' ? sibling.style.marginRight = this.setDimension(this.element.getBoundingClientRect().width)
                    : sibling.style.marginRight = this.setDimension(this.dockSize);
            }
        }
    };
    
    /**
     * Shows the Sidebar component, if it is in closed state.
     * @returns void
     */
    Sidebar.prototype.show = function (e) {
        var _this = this;
        var openArguments = {
            model: this,
            element: this.element,
            cancel: false,
            isInteracted: !sf.base.isNullOrUndefined(e),
            event: (e || null)
        };
        if (sf.base.isBlazor()) {
            delete openArguments.model;
        }
        this.trigger('open', openArguments, function (observedopenArgs) {
            if (!observedopenArgs.cancel) {
                sf.base.removeClass([_this.element], VISIBILITY);
                if (_this.element.classList.contains(OPEN)) {
                    return;
                }
                if (_this.element.classList.contains(CLOSE) && !_this.animate) {
                    _this.triggerChange();
                }
                sf.base.addClass([_this.element], [OPEN, TRASITION]);
                sf.base.setStyleAttribute(_this.element, { 'transform': '' });
                sf.base.removeClass([_this.element], CLOSE);
                sf.base.setStyleAttribute(_this.element, { 'width': sf.base.formatUnit(_this.width) });
                _this.setType(_this.type);
                _this.createBackDrop();
                _this.setAnimation();
                if (_this.type === 'Slide') {
                    document.body.classList.add('e-sidebar-overflow');
                }
                _this.setProperties({ isOpen: true }, true);
                sf.base.EventHandler.add(_this.element, 'transitionend', _this.transitionEnd, _this);
            }
        });
    };
    Sidebar.prototype.setAnimation = function () {
        if (this.animate) {
            sf.base.removeClass([this.element], DISABLEANIMATION);
        }
        else {
            sf.base.addClass([this.element], DISABLEANIMATION);
        }
    };
    Sidebar.prototype.triggerChange = function () {
        var changeArguments = { name: 'change', element: this.element };
        this.trigger('change', changeArguments);
    };
    Sidebar.prototype.setDock = function () {
        if (this.enableDock && this.position === 'Left' && !this.getState()) {
            sf.base.setStyleAttribute(this.element, { 'transform': 'translateX(' + -100 + '%) translateX(' + this.setDimension(this.dockSize) + ')' });
        }
        else if (this.enableDock && this.position === 'Right' && !this.getState()) {
            sf.base.setStyleAttribute(this.element, { 'transform': 'translateX(' + 100 + '%) translateX(' + '-' + this.setDimension(this.dockSize) + ')' });
        }
        if (this.element.classList.contains(CLOSE) && this.enableDock) {
            sf.base.setStyleAttribute(this.element, { 'width': this.setDimension(this.dockSize) });
        }
    };
    Sidebar.prototype.createBackDrop = function () {
        if (this.target && this.showBackdrop && this.getState()) {
            var sibling = document.querySelector('.e-main-content') || this.targetEle;
            sf.base.addClass([sibling], CONTEXTBACKDROP);
        }
        else if (this.showBackdrop && !this.modal && this.getState()) {
            this.modal = this.createElement('div');
            this.modal.className = DEFAULTBACKDROP;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
    };
    Sidebar.prototype.getPersistData = function () {
        return this.addOnPersist(['type', 'position', 'isOpen']);
    };
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    Sidebar.prototype.getModuleName = function () {
        return 'sidebar';
    };
    /**
     * Shows or hides the Sidebar based on the current state.
     * @returns void
     */
    Sidebar.prototype.toggle = function (e) {
        this.element.classList.contains(OPEN) ? this.hide() : this.show();
    };
    Sidebar.prototype.getState = function () {
        return this.element.classList.contains(OPEN) ? true : false;
    };
    Sidebar.prototype.setMediaQuery = function () {
        if (this.mediaQuery) {
            var media = false;
            if (typeof (this.mediaQuery) === 'string') {
                media = window.matchMedia(this.mediaQuery).matches;
            }
            else {
                media = (this.mediaQuery).matches;
            }
            if (media && this.windowWidth !== window.innerWidth) {
                this.show();
            }
            else if (this.getState() && this.windowWidth !== window.innerWidth) {
                this.hide();
            }
        }
    };
    Sidebar.prototype.resize = function (e) {
        if (this.type === 'Auto') {
            if (sf.base.Browser.isDevice) {
                sf.base.addClass([this.element], OVER);
            }
            else {
                sf.base.addClass([this.element], PUSH);
            }
        }
        this.setMediaQuery();
        if (sf.base.Browser.isDevice) {
            this.windowWidth = window.innerWidth;
        }
    };
    Sidebar.prototype.documentclickHandler = function (e) {
        if (sf.base.closest(e.target, '.' + CONTROL + '' + '.' + ROOT)) {
            return;
        }
        this.hide(e);
    };
    Sidebar.prototype.enableGestureHandler = function (args) {
        if (!this.isOpen && this.position === 'Left' && args.swipeDirection === 'Right' &&
            (args.startX <= 20 && args.distanceX >= 50 && args.velocity >= 0.5)) {
            this.show();
        }
        else if (this.isOpen && this.position === 'Left' && args.swipeDirection === 'Left') {
            this.hide();
        }
        else if (this.isOpen && this.position === 'Right' && args.swipeDirection === 'Right') {
            this.hide();
        }
        else if (!this.isOpen && this.position === 'Right' && args.swipeDirection === 'Left'
            && (window.innerWidth - args.startX <= 20 && args.distanceX >= 50 && args.velocity >= 0.5)) {
            this.show();
        }
    };
    Sidebar.prototype.setEnableGestures = function () {
        if (this.enableGestures) {
            this.mainContentEle = new sf.base.Touch(document.body, { swipe: this.enableGestureHandler.bind(this) });
            this.sidebarEle = new sf.base.Touch(this.element, { swipe: this.enableGestureHandler.bind(this) });
        }
        else {
            if (this.mainContentEle && this.sidebarEle) {
                this.mainContentEle.destroy();
                this.sidebarEle.destroy();
            }
        }
    };
    Sidebar.prototype.wireEvents = function () {
        this.setEnableGestures();
        window.addEventListener('resize', this.resize.bind(this));
    };
    Sidebar.prototype.unWireEvents = function () {
        window.removeEventListener('resize', this.resize.bind(this));
        sf.base.EventHandler.remove(document, 'mousedown touchstart', this.documentclickHandler);
        if (this.mainContentEle) {
            this.mainContentEle.destroy();
        }
        if (this.sidebarEle) {
            this.sidebarEle.destroy();
        }
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    Sidebar.prototype.onPropertyChanged = function (newProp, oldProp) {
        var sibling = document.querySelector('.e-main-content') || this.targetEle;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'isOpen':
                    this.isOpen ? this.show() : this.hide();
                    break;
                case 'width':
                    this.setWidth();
                    if (!this.getState()) {
                        this.setDock();
                    }
                    break;
                case 'animate':
                    this.setAnimation();
                    break;
                case 'type':
                    this.checkType(false);
                    sf.base.removeClass([this.element], [VISIBILITY]);
                    this.addClass();
                    sf.base.addClass([this.element], this.type === 'Auto' ? (sf.base.Browser.isDevice ? ['e-over'] :
                        ['e-push']) : ['e-' + this.type.toLowerCase()]);
                    break;
                case 'position':
                    this.element.style.transform = '';
                    this.setDock();
                    if (sibling) {
                        this.position === 'Left' ? sibling.style.marginRight = '0px' : sibling.style.marginLeft = '0px';
                    }
                    if (this.position === 'Right') {
                        sf.base.removeClass([this.element], LEFT);
                        sf.base.addClass([this.element], RIGHT);
                    }
                    else {
                        sf.base.removeClass([this.element], RIGHT);
                        sf.base.addClass([this.element], LEFT);
                    }
                    this.setType(this.type);
                    break;
                case 'showBackdrop':
                    if (this.showBackdrop) {
                        this.createBackDrop();
                    }
                    else {
                        if (this.modal) {
                            this.modal.style.display = 'none';
                            this.modal.outerHTML = '';
                            this.modal = null;
                        }
                    }
                    break;
                case 'target':
                    if (typeof (this.target) === 'string') {
                        this.setProperties({ target: document.querySelector(this.target) }, true);
                    }
                    if (sf.base.isNullOrUndefined(this.target)) {
                        sf.base.removeClass([this.element], SIDEBARABSOLUTE);
                        sf.base.removeClass([oldProp.target], CONTEXT);
                        sf.base.setStyleAttribute(sibling, { 'margin-left': 0, 'margin-right': 0 });
                        document.body.insertAdjacentElement('afterbegin', this.element);
                    }
                    var isRendered = this.isServerRendered;
                    this.isServerRendered = false;
                    _super.prototype.refresh.call(this);
                    this.isServerRendered = isRendered;
                    break;
                case 'closeOnDocumentClick':
                    this.setCloseOnDocumentClick();
                    break;
                case 'enableDock':
                    if (!this.getState()) {
                        this.setDock();
                    }
                    break;
                case 'zIndex':
                    this.setZindex();
                    break;
                case 'mediaQuery':
                    this.setMediaQuery();
                    break;
                case 'enableGestures':
                    this.setEnableGestures();
                    break;
                case 'enableRtl':
                    this.setEnableRTL();
                    break;
            }
        }
    };
    Sidebar.prototype.setType = function (type) {
        var elementWidth = this.element.getBoundingClientRect().width;
        this.setZindex();
        var sibling = document.querySelector('.e-main-content') || this.targetEle;
        if (sibling) {
            sibling.style.transform = 'translateX(' + 0 + 'px)';
            if (!sf.base.Browser.isDevice && this.type !== 'Auto') {
                this.position === 'Left' ? sibling.style.marginLeft = '0px' : sibling.style.marginRight = '0px';
            }
        }
        var margin = this.position === 'Left' ? elementWidth + 'px' : elementWidth + 'px';
        var eleWidth = this.position === 'Left' ? elementWidth : -(elementWidth);
        sf.base.removeClass([this.element], [PUSH, OVER, SLIDE]);
        switch (type) {
            case 'Push':
                sf.base.addClass([this.element], [PUSH]);
                if (sibling && (this.enableDock || this.element.classList.contains(OPEN))) {
                    this.position === 'Left' ? sibling.style.marginLeft = margin : sibling.style.marginRight = margin;
                }
                break;
            case 'Slide':
                sf.base.addClass([this.element], [SLIDE]);
                if (sibling && (this.enableDock || this.element.classList.contains(OPEN))) {
                    sibling.style.transform = 'translateX(' + eleWidth + 'px)';
                }
                break;
            case 'Over':
                sf.base.addClass([this.element], [OVER]);
                if (this.enableDock && this.element.classList.contains(CLOSE)) {
                    if (sibling) {
                        this.position === 'Left' ? sibling.style.marginLeft = margin : sibling.style.marginRight = margin;
                    }
                }
                break;
            case 'Auto':
                sf.base.addClass([this.element], [TRASITION]);
                if (sf.base.Browser.isDevice) {
                    if (sibling && (this.enableDock) && !this.getState()) {
                        this.position === 'Left' ? sibling.style.marginLeft = margin : sibling.style.marginRight = margin;
                        sf.base.addClass([this.element], PUSH);
                    }
                    else {
                        sf.base.addClass([this.element], OVER);
                    }
                }
                else {
                    sf.base.addClass([this.element], PUSH);
                    if (sibling && (this.enableDock || this.element.classList.contains(OPEN))) {
                        this.position === 'Left' ? sibling.style.marginLeft = margin : sibling.style.marginRight = margin;
                    }
                }
                this.createBackDrop();
        }
    };
    /**
     * Removes the control from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @returns void
     */
    Sidebar.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        sf.base.removeClass([this.element], [OPEN, CLOSE, PUSH, SLIDE, OVER, LEFT, RIGHT, TRASITION]);
        if (this.target) {
            sf.base.removeClass([this.element], SIDEBARABSOLUTE);
            sf.base.removeClass([this.target], CONTEXT);
        }
        this.destroyBackDrop();
        this.element.style.width = '';
        this.element.style.zIndex = '';
        this.element.style.transform = '';
        this.windowWidth = null;
        (!sf.base.isNullOrUndefined(this.sidebarEleCopy.getAttribute('tabindex'))) ?
            this.element.setAttribute('tabindex', this.tabIndex) : this.element.removeAttribute('tabindex');
        var sibling = document.querySelector('.e-main-content') || this.targetEle;
        if (!sf.base.isNullOrUndefined(sibling)) {
            sibling.style.margin = '';
            sibling.style.transform = '';
        }
        this.unWireEvents();
    };
    __decorate([
        sf.base.Property('auto')
    ], Sidebar.prototype, "dockSize", void 0);
    __decorate([
        sf.base.Property(null)
    ], Sidebar.prototype, "mediaQuery", void 0);
    __decorate([
        sf.base.Property(false)
    ], Sidebar.prototype, "enableDock", void 0);
    __decorate([
        sf.base.Property('en-US')
    ], Sidebar.prototype, "locale", void 0);
    __decorate([
        sf.base.Property(false)
    ], Sidebar.prototype, "enablePersistence", void 0);
    __decorate([
        sf.base.Property(true)
    ], Sidebar.prototype, "enableGestures", void 0);
    __decorate([
        sf.base.Property(false)
    ], Sidebar.prototype, "isOpen", void 0);
    __decorate([
        sf.base.Property(false)
    ], Sidebar.prototype, "enableRtl", void 0);
    __decorate([
        sf.base.Property(true)
    ], Sidebar.prototype, "animate", void 0);
    __decorate([
        sf.base.Property('auto')
    ], Sidebar.prototype, "height", void 0);
    __decorate([
        sf.base.Property(false)
    ], Sidebar.prototype, "closeOnDocumentClick", void 0);
    __decorate([
        sf.base.Property('Left')
    ], Sidebar.prototype, "position", void 0);
    __decorate([
        sf.base.Property(null)
    ], Sidebar.prototype, "target", void 0);
    __decorate([
        sf.base.Property(false)
    ], Sidebar.prototype, "showBackdrop", void 0);
    __decorate([
        sf.base.Property('Auto')
    ], Sidebar.prototype, "type", void 0);
    __decorate([
        sf.base.Property('auto')
    ], Sidebar.prototype, "width", void 0);
    __decorate([
        sf.base.Property(1000)
    ], Sidebar.prototype, "zIndex", void 0);
    __decorate([
        sf.base.Event()
    ], Sidebar.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], Sidebar.prototype, "close", void 0);
    __decorate([
        sf.base.Event()
    ], Sidebar.prototype, "open", void 0);
    __decorate([
        sf.base.Event()
    ], Sidebar.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], Sidebar.prototype, "destroyed", void 0);
    Sidebar = __decorate([
        sf.base.NotifyPropertyChanges
    ], Sidebar);
    return Sidebar;
}(sf.base.Component));

/**
 * Sidebar modules
 */

exports.Sidebar = Sidebar;

return exports;

});
sfBlazor.modules["sidebar"] = "navigations.Sidebar";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.sidebar, () => {
    sf.navigations = sf.base.extend({}, sf.navigations, sfsidebar({}));
});