window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Sidebar = (function () {
'use strict';

var LEFT = 'Left';
var RIGHT = 'Right';
var PUSH = 'Push';
var OVER = 'Over';
var SLIDE = 'Slide';
var AUTO = 'Auto';
var CLOSE = 'e-close';
var ROOT = 'e-sidebar';
var CONTROL = 'e-control';
var CONTEXT = 'e-sidebar-context';
var DEFAULTBACKDROP = 'e-sidebar-overlay';
var SIDEBARABSOLUTE = 'e-sidebar-absolute';
var MAINCONTENTANIMATION = 'e-content-animation';
var SfSidebar = /** @class */ (function () {
    function SfSidebar(element, dotnetRef, property) {
        this.enableGestures = true;
        this.isOpen = false;
        this.closeOnDocumentClick = false;
        this.isPositionChange = false;
        this.dockSize = 'auto';
        this.width = 'auto';
        this.isSwipChange = false;
        this.element = element;
        this.element.blazor__instance = this;
        this.dotnetRef = dotnetRef;
        this.type = property.Type;
        this.position = property.Position;
        this.enableDock = property.EnableDock;
        this.showBackdrop = property.ShowBackdrop;
        this.target = property.Target;
        this.enableGestures = property.EnableGestures;
        this.closeOnDocumentClick = property.CloseOnDocumentClick;
        this.mediaQuery = property.MediaQuery;
        this.dockSize = property.DockSize;
        this.width = property.Width;
    }
    SfSidebar.prototype.initialize = function () {
        this.setTarget();
        this.addClass();
        this.setType();
        this.setCloseOnDocumentClick();
        this.setMediaQuery();
        if (sf.base.Browser.isDevice) {
            this.windowWidth = window.innerWidth;
        }
        this.wireEvents();
    };
    SfSidebar.prototype.addClass = function () {
        var mainElement = document.querySelector('.e-main-content');
        if (!sf.base.isNullOrUndefined(mainElement || this.targetElement)) {
            sf.base.addClass([mainElement || this.targetElement], [MAINCONTENTANIMATION]);
        }
    };
    SfSidebar.prototype.setTarget = function () {
        this.targetElement = this.element.nextElementSibling;
        if (typeof (this.target) === 'string') {
            this.target = document.querySelector(this.target);
        }
        if (this.target) {
            this.target.insertBefore(this.element, this.target.children[0]);
            sf.base.addClass([this.element], SIDEBARABSOLUTE);
            sf.base.addClass([this.target], CONTEXT);
            this.targetElement = this.getTargetElement();
        }
    };
    SfSidebar.prototype.getTargetElement = function () {
        var siblingElement = this.element.nextElementSibling;
        while (!sf.base.isNullOrUndefined(siblingElement)) {
            if (!siblingElement.classList.contains(ROOT)) {
                break;
            }
            siblingElement = siblingElement.nextElementSibling;
        }
        return siblingElement;
    };
    SfSidebar.prototype.hide = function () {
        var _this = this;
        var sibling = document.querySelector('.e-main-content') || this.targetElement;
        if (!this.enableDock && sibling) {
            sibling.style.transform = 'translateX(' + 0 + 'px)';
            this.position === LEFT ? sibling.style.marginLeft = '0px' : sibling.style.marginRight = '0px';
        }
        this.destroyBackDrop();
        this.isOpen = false;
        if (this.enableDock) {
            setTimeout(function () { return _this.sidebarTimeout(); }, 50);
        }
        sf.base.EventHandler.add(this.element, 'transitionend', this.transitionEnd, this);
    };
    SfSidebar.prototype.show = function (isServercall) {
        var _this = this;
        if (isServercall) {
            setTimeout(function () { return _this.setType(); }, 50);
        }
        this.isOpen = true;
        sf.base.EventHandler.add(this.element, 'transitionend', this.transitionEnd, this);
    };
    SfSidebar.prototype.transitionEnd = function (value) {
        if (this.enableDock && !this.isOpen) {
            var dimension = this.position === LEFT ? '-100' : '100';
            var transform = this.position === LEFT ? this.setDimension(this.dockSize) : '-' + this.setDimension(this.dockSize);
            var widthValue = 'z-index: ' + this.element.style.zIndex + ';' + ' width: ' + this.element.style.width + ';';
            var dockStyle = widthValue + ' transform: translateX(' + dimension + '%) translateX(' + transform + ')';
            this.element.setAttribute('style', dockStyle);
        }
        this.dotnetRef.invokeMethodAsync('SetDock');
        if (!sf.base.isNullOrUndefined(value) && value.target === this.element) {
            this.dotnetRef.invokeMethodAsync('TriggerChange', this.isOpen, value);
        }
        sf.base.EventHandler.remove(this.element, 'transitionend', this.transitionEnd);
    };
    SfSidebar.prototype.createBackDrop = function (property) {
        this.resetProperty(property);
        if (this.showBackdrop && this.isOpen) {
            this.modal = sf.base.createElement('div');
            this.modal.className = DEFAULTBACKDROP;
            this.modal.style.display = 'block';
            if (this.target) {
                var sibling = document.querySelector('.e-main-content') || this.targetElement;
                sibling.appendChild(this.modal);
            }
            else {
                document.body.appendChild(this.modal);
            }
        }
    };
    SfSidebar.prototype.destroyBackDrop = function () {
        if (this.showBackdrop) {
            if (this.modal) {
                this.modal.style.display = 'none';
                this.modal.outerHTML = '';
                this.modal = null;
            }
        }
    };
    SfSidebar.prototype.enableGestureHandler = function (args) {
        if (!this.isOpen && ((this.position === LEFT && args.swipeDirection === RIGHT &&
            (args.startX <= 20 && args.distanceX >= 50 && args.velocity >= 0.5)) || (this.position === RIGHT && args.swipeDirection === LEFT
            && (window.innerWidth - args.startX <= 20 && args.distanceX >= 50 && args.velocity >= 0.5)))) {
            this.dotnetRef.invokeMethodAsync('Show', args);
            this.show();
            this.isSwipChange = true;
        }
        else if (this.isOpen && (this.position === LEFT && args.swipeDirection === LEFT) || (this.position === RIGHT &&
            args.swipeDirection === RIGHT)) {
            this.dotnetRef.invokeMethodAsync('Hide', args);
            this.hide();
            this.isSwipChange = false;
        }
    };
    SfSidebar.prototype.resize = function () {
        this.setMediaQuery();
        if (sf.base.Browser.isDevice) {
            this.windowWidth = window.innerWidth;
        }
    };
    SfSidebar.prototype.setEnableGestures = function (property) {
        this.resetProperty(property);
        if (this.enableGestures) {
            this.mainContentElement = new sf.base.Touch(document.body, { swipe: this.enableGestureHandler.bind(this) });
            this.sidebarElement = new sf.base.Touch(this.element, { swipe: this.enableGestureHandler.bind(this) });
        }
        else if (this.mainContentElement && this.sidebarElement) {
            this.mainContentElement.destroy();
            this.sidebarElement.destroy();
        }
    };
    SfSidebar.prototype.wireEvents = function () {
        this.setEnableGestures();
        window.addEventListener('resize', this.resize.bind(this));
    };
    SfSidebar.prototype.unWireEvents = function () {
        window.removeEventListener('resize', this.resize.bind(this));
        sf.base.EventHandler.remove(document, 'mousedown touchstart', this.documentclickHandler);
        if (this.mainContentElement) {
            this.mainContentElement.destroy();
        }
        if (this.sidebarElement) {
            this.sidebarElement.destroy();
        }
    };
    SfSidebar.prototype.documentclickHandler = function (e) {
        if (!(sf.base.closest(e.target, '.' + CONTROL + '' + '.' + ROOT))) {
            this.dotnetRef.invokeMethodAsync('TriggerHide', e);
            this.hide();
        }
    };
    SfSidebar.prototype.setCloseOnDocumentClick = function (property) {
        this.resetProperty(property);
        if (this.closeOnDocumentClick) {
            sf.base.EventHandler.add(document, 'mousedown touchstart', this.documentclickHandler, this);
        }
        else {
            sf.base.EventHandler.remove(document, 'mousedown touchstart', this.documentclickHandler);
        }
    };
    SfSidebar.prototype.setMediaQuery = function () {
        if (this.mediaQuery && this.windowWidth !== window.innerWidth) {
            if (window.matchMedia(this.mediaQuery).matches) {
                this.dotnetRef.invokeMethodAsync('TriggerShow', null);
            }
            else if (this.isOpen) {
                this.dotnetRef.invokeMethodAsync('TriggerHide', null);
            }
        }
    };
    SfSidebar.prototype.setDimension = function (width) {
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
    SfSidebar.prototype.sidebarTimeout = function () {
        var sibling = document.querySelector('.e-main-content') || this.targetElement;
        var leftMargin = this.isOpen ? this.setDimension(this.width) : this.setDimension(this.dockSize);
        var rightMargin = this.setDimension(this.element.getBoundingClientRect().width);
        if (sibling) {
            if (this.isOpen) {
                this.positionStyles(this.width, sibling, rightMargin, leftMargin);
            }
            else if (this.element.classList.contains(CLOSE)) {
                this.positionStyles(this.dockSize, sibling, rightMargin, leftMargin);
            }
        }
    };
    
    SfSidebar.prototype.positionStyles = function (size, sibling, rightMargin, leftMargin) {
        if (this.position === LEFT) {
            sibling.style.marginLeft = size === 'auto' ? rightMargin : leftMargin;
        }
        else {
            sibling.style.marginRight = size === 'auto' ? rightMargin : leftMargin;
        }
    };
    SfSidebar.prototype.siblingStyle = function (sibling, margin) {
        this.position === LEFT ? sibling.style.marginLeft = margin : sibling.style.marginRight = margin;
    };
    SfSidebar.prototype.resetProperty = function (property) {
        if (!sf.base.isNullOrUndefined(property)) {
            this.isOpen = property.IsOpen;
            this.enableGestures = property.EnableGestures;
            this.showBackdrop = property.ShowBackdrop;
            this.closeOnDocumentClick = property.CloseOnDocumentClick;
            this.isPositionChange = this.position !== property.Position;
            this.position = property.Position;
            this.type = property.Type;
        }
    };
    SfSidebar.prototype.setType = function (property) {
        var elementWidth = this.element.getBoundingClientRect().width;
        elementWidth = this.enableDock && !this.isOpen ? this.dockSize : elementWidth;
        var sibling = document.querySelector('.e-main-content') || this.targetElement;
        this.isPositionChange = false;
        this.resetProperty(property);
        if (sibling) {
            if (this.isPositionChange) {
                this.position === LEFT ? sibling.style.marginRight = '0px' : sibling.style.marginLeft = '0px';
            }
            sibling.style.transform = 'translateX(' + 0 + 'px)';
            if (!sf.base.Browser.isDevice && this.type !== AUTO) {
                this.position === LEFT ? sibling.style.marginLeft = '0px' : sibling.style.marginRight = '0px';
            }
            var margin = typeof (elementWidth) === 'string' ? elementWidth : elementWidth + 'px';
            var translate = this.position === LEFT ? elementWidth : -(elementWidth);
            var value = sibling && (this.enableDock || this.isOpen || this.isSwipChange);
            switch (this.type) {
                case PUSH:
                    if (value) {
                        this.siblingStyle(sibling, margin);
                    }
                    break;
                case SLIDE:
                    if (value) {
                        sibling.style.transform = 'translateX(' + translate + 'px)';
                    }
                    break;
                case OVER:
                    if (this.enableDock && this.element.classList.contains(CLOSE)) {
                        this.siblingStyle(sibling, margin);
                    }
                    break;
                case AUTO:
                    if (sf.base.Browser.isDevice) {
                        if ((this.enableDock) && !this.isOpen) {
                            this.siblingStyle(sibling, margin);
                        }
                    }
                    else if ((this.enableDock || this.isOpen || this.isSwipChange)) {
                        this.siblingStyle(sibling, margin);
                    }
                    this.isSwipChange = false;
            }
        }
    };
    SfSidebar.prototype.destroy = function () {
        this.destroyBackDrop();
        this.element.style.width = this.element.style.zIndex = this.element.style.transform = '';
        this.windowWidth = null;
        var sibling = document.querySelector('.e-main-content') || this.targetElement;
        if (!sf.base.isNullOrUndefined(sibling)) {
            sibling.style.margin = sibling.style.transform = '';
        }
        this.unWireEvents();
    };
    return SfSidebar;
}());
// tslint:disable
var Sidebar = {
    initialize: function (element, dotnetRef, property) {
        new SfSidebar(element, dotnetRef, property);
        if (this.isValid(element)) {
            element.blazor__instance.initialize();
        }
        return !sf.base.Browser.isDevice && window.matchMedia(property.MediaQuery) ? true : false;
    },
    setType: function (element, property) {
        if (this.isValid(element)) {
            element.blazor__instance.setType(property);
        }
    },
    hide: function (element, property) {
        if (this.isValid(element)) {
            element.blazor__instance.setType(property);
            element.blazor__instance.hide();
        }
    },
    show: function (element, property, isServerCall) {
        if (this.isValid(element)) {
            element.blazor__instance.setType(property);
            element.blazor__instance.createBackDrop(property);
            element.blazor__instance.show(isServerCall);
        }
    },
    onPropertyChange: function (element, property) {
        if (this.isValid(element)) {
            if (property.CloseOnDocumentClick !== undefined) {
                element.blazor__instance.setCloseOnDocumentClick(property);
            }
            if (property.ShowBackdrop !== undefined) {
                element.blazor__instance.createBackDrop(property);
            }
        }
    },
    destroy: function (element) {
        if (this.isValid(element)) {
            if (element) {
                element.blazor__instance.destroy();
            }
        }
    },
    isValid: function (element) {
        return (element && element.blazor__instance) ? true : false;
    }
};

return Sidebar;

}());
