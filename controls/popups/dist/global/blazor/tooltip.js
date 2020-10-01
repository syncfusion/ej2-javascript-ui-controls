window.sf = window.sf || {};
var sftooltip = (function (exports) {
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
var TOUCHEND_HIDE_DELAY = 1500;
var TAPHOLD_THRESHOLD = 500;
var SHOW_POINTER_TIP_GAP = 0;
var HIDE_POINTER_TIP_GAP = 8;
var MOUSE_TRAIL_GAP = 2;
var POINTER_ADJUST = 2;
var ROOT = 'e-tooltip';
var RTL = 'e-rtl';
var DEVICE = 'e-bigger';
var ICON = 'e-icons';
var CLOSE = 'e-tooltip-close';
var TOOLTIP_WRAP = 'e-tooltip-wrap';
var CONTENT = 'e-tip-content';
var ARROW_TIP = 'e-arrow-tip';
var ARROW_TIP_OUTER = 'e-arrow-tip-outer';
var ARROW_TIP_INNER = 'e-arrow-tip-inner';
var TIP_BOTTOM = 'e-tip-bottom';
var TIP_TOP = 'e-tip-top';
var TIP_LEFT = 'e-tip-left';
var TIP_RIGHT = 'e-tip-right';
var POPUP_ROOT = 'e-popup';
var POPUP_OPEN = 'e-popup-open';
var POPUP_CLOSE = 'e-popup-close';
var POPUP_LIB = 'e-lib';
var HIDE_POPUP = 'e-hidden';
var Animation$1 = /** @class */ (function (_super) {
    __extends(Animation$$1, _super);
    function Animation$$1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property({ effect: 'FadeIn', duration: 150, delay: 0 })
    ], Animation$$1.prototype, "open", void 0);
    __decorate([
        sf.base.Property({ effect: 'FadeOut', duration: 150, delay: 0 })
    ], Animation$$1.prototype, "close", void 0);
    return Animation$$1;
}(sf.base.ChildProperty));
/**
 * Represents the Tooltip component that displays a piece of information about the target element on mouse hover.
 * ```html
 * <div id="tooltip">Show Tooltip</div>
 * ```
 * ```typescript
 * <script>
 *   var tooltipObj = new Tooltip({ content: 'Tooltip text' });
 *   tooltipObj.appendTo("#tooltip");
 * </script>
 * ```
 */
var Tooltip = /** @class */ (function (_super) {
    __extends(Tooltip, _super);
    /**
     * Constructor for creating the Tooltip Component
     */
    function Tooltip(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isBlazorTooltip = false;
        _this.contentTargetValue = null;
        _this.contentEvent = null;
        _this.contentAnimation = null;
        return _this;
    }
    Tooltip.prototype.initialize = function () {
        this.formatPosition();
        if (!(this.isServerRender())) {
            sf.base.addClass([this.element], ROOT);
        }
    };
    Tooltip.prototype.isServerRender = function () {
        return sf.base.isBlazor() && this.isServerRendered;
    };
    Tooltip.prototype.formatPosition = function () {
        var _a, _b;
        if (this.position.indexOf('Top') === 0 || this.position.indexOf('Bottom') === 0) {
            _a = this.position.split(/(?=[A-Z])/), this.tooltipPositionY = _a[0], this.tooltipPositionX = _a[1];
        }
        else {
            _b = this.position.split(/(?=[A-Z])/), this.tooltipPositionX = _b[0], this.tooltipPositionY = _b[1];
        }
    };
    Tooltip.prototype.renderArrow = function () {
        this.setTipClass(this.position);
        if (!(this.isServerRender())) {
            var tip = this.createElement('div', { className: ARROW_TIP + ' ' + this.tipClass });
            tip.appendChild(this.createElement('div', { className: ARROW_TIP_OUTER + ' ' + this.tipClass }));
            tip.appendChild(this.createElement('div', { className: ARROW_TIP_INNER + ' ' + this.tipClass }));
            this.tooltipEle.appendChild(tip);
        }
        else {
            var tip = this.tooltipEle.querySelector('.' + ARROW_TIP);
            sf.base.addClass([tip.querySelector('.' + ARROW_TIP_OUTER)], this.tipClass);
            sf.base.addClass([tip.querySelector('.' + ARROW_TIP_INNER)], this.tipClass);
            this.tooltipEle.appendChild(tip);
        }
    };
    Tooltip.prototype.setTipClass = function (position) {
        if (position.indexOf('Right') === 0) {
            this.tipClass = TIP_LEFT;
        }
        else if (position.indexOf('Bottom') === 0) {
            this.tipClass = TIP_TOP;
        }
        else if (position.indexOf('Left') === 0) {
            this.tipClass = TIP_RIGHT;
        }
        else {
            this.tipClass = TIP_BOTTOM;
        }
    };
    Tooltip.prototype.renderPopup = function (target) {
        var elePos = this.mouseTrail ? { top: 0, left: 0 } : this.getTooltipPosition(target);
        this.tooltipEle.classList.remove(POPUP_LIB);
        this.popupObj = new sf.popups.Popup(this.tooltipEle, {
            height: this.height,
            width: this.width,
            position: { X: elePos.left, Y: elePos.top },
            enableRtl: this.enableRtl,
            open: this.openPopupHandler.bind(this),
            close: this.closePopupHandler.bind(this)
        });
    };
    Tooltip.prototype.getTooltipPosition = function (target) {
        this.tooltipEle.style.display = 'block';
        var pos = sf.popups.calculatePosition(target, this.tooltipPositionX, this.tooltipPositionY);
        var offsetPos = this.calculateTooltipOffset(this.position);
        var elePos = this.collisionFlipFit(target, pos.left + offsetPos.left, pos.top + offsetPos.top);
        this.tooltipEle.style.display = '';
        return elePos;
    };
    Tooltip.prototype.reposition = function (target) {
        var elePos = this.getTooltipPosition(target);
        this.popupObj.position = { X: elePos.left, Y: elePos.top };
        this.popupObj.dataBind();
    };
    Tooltip.prototype.openPopupHandler = function () {
        if (!this.mouseTrail && this.needTemplateReposition()) {
            this.reposition(this.findTarget());
        }
        this.trigger('afterOpen', this.tooltipEventArgs);
    };
    Tooltip.prototype.closePopupHandler = function () {
        sf.base.resetBlazorTemplate(this.element.id + 'content', 'Content');
        this.clearTemplate(['content']);
        this.clear();
        this.trigger('afterClose', this.tooltipEventArgs);
    };
    Tooltip.prototype.calculateTooltipOffset = function (position) {
        var pos = { top: 0, left: 0 };
        var tooltipEleWidth = this.tooltipEle.offsetWidth;
        var tooltipEleHeight = this.tooltipEle.offsetHeight;
        var arrowEle = this.tooltipEle.querySelector('.' + ARROW_TIP);
        var tipWidth = arrowEle ? arrowEle.offsetWidth : 0;
        var tipHeight = arrowEle ? arrowEle.offsetHeight : 0;
        var tipAdjust = (this.showTipPointer ? SHOW_POINTER_TIP_GAP : HIDE_POINTER_TIP_GAP);
        var tipHeightAdjust = (tipHeight / 2) + POINTER_ADJUST + (this.tooltipEle.offsetHeight - this.tooltipEle.clientHeight);
        var tipWidthAdjust = (tipWidth / 2) + POINTER_ADJUST + (this.tooltipEle.offsetWidth - this.tooltipEle.clientWidth);
        if (this.mouseTrail) {
            tipAdjust += MOUSE_TRAIL_GAP;
        }
        switch (position) {
            case 'RightTop':
                pos.left += tipWidth + tipAdjust;
                pos.top -= tooltipEleHeight - tipHeightAdjust;
                break;
            case 'RightCenter':
                pos.left += tipWidth + tipAdjust;
                pos.top -= (tooltipEleHeight / 2);
                break;
            case 'RightBottom':
                pos.left += tipWidth + tipAdjust;
                pos.top -= (tipHeightAdjust);
                break;
            case 'BottomRight':
                pos.top += (tipHeight + tipAdjust);
                pos.left -= (tipWidthAdjust);
                break;
            case 'BottomCenter':
                pos.top += (tipHeight + tipAdjust);
                pos.left -= (tooltipEleWidth / 2);
                break;
            case 'BottomLeft':
                pos.top += (tipHeight + tipAdjust);
                pos.left -= (tooltipEleWidth - tipWidthAdjust);
                break;
            case 'LeftBottom':
                pos.left -= (tipWidth + tooltipEleWidth + tipAdjust);
                pos.top -= (tipHeightAdjust);
                break;
            case 'LeftCenter':
                pos.left -= (tipWidth + tooltipEleWidth + tipAdjust);
                pos.top -= (tooltipEleHeight / 2);
                break;
            case 'LeftTop':
                pos.left -= (tipWidth + tooltipEleWidth + tipAdjust);
                pos.top -= (tooltipEleHeight - tipHeightAdjust);
                break;
            case 'TopLeft':
                pos.top -= (tooltipEleHeight + tipHeight + tipAdjust);
                pos.left -= (tooltipEleWidth - tipWidthAdjust);
                break;
            case 'TopRight':
                pos.top -= (tooltipEleHeight + tipHeight + tipAdjust);
                pos.left -= (tipWidthAdjust);
                break;
            default:
                pos.top -= (tooltipEleHeight + tipHeight + tipAdjust);
                pos.left -= (tooltipEleWidth / 2);
                break;
        }
        pos.left += this.offsetX;
        pos.top += this.offsetY;
        return pos;
    };
    Tooltip.prototype.updateTipPosition = function (position) {
        var selEle = this.tooltipEle.querySelectorAll('.' + ARROW_TIP + ',.' + ARROW_TIP_OUTER + ',.' + ARROW_TIP_INNER);
        var removeList = [TIP_BOTTOM, TIP_TOP, TIP_LEFT, TIP_RIGHT];
        sf.base.removeClass(selEle, removeList);
        this.setTipClass(position);
        sf.base.addClass(selEle, this.tipClass);
    };
    Tooltip.prototype.adjustArrow = function (target, position, tooltipPositionX, tooltipPositionY) {
        if (this.showTipPointer === false) {
            return;
        }
        this.updateTipPosition(position);
        var leftValue;
        var topValue;
        this.tooltipEle.style.display = 'block';
        var tooltipWidth = this.tooltipEle.clientWidth;
        var tooltipHeight = this.tooltipEle.clientHeight;
        var arrowEle = this.tooltipEle.querySelector('.' + ARROW_TIP);
        var arrowInnerELe = this.tooltipEle.querySelector('.' + ARROW_TIP_INNER);
        var tipWidth = arrowEle.offsetWidth;
        var tipHeight = arrowEle.offsetHeight;
        this.tooltipEle.style.display = '';
        if (this.tipClass === TIP_BOTTOM || this.tipClass === TIP_TOP) {
            if (this.tipClass === TIP_BOTTOM) {
                topValue = '99.9%';
                // Arrow icon aligned -2px height from ArrowOuterTip div
                arrowInnerELe.style.top = '-' + (tipHeight - 2) + 'px';
            }
            else {
                topValue = -(tipHeight - 1) + 'px';
                // Arrow icon aligned -6px height from ArrowOuterTip div
                arrowInnerELe.style.top = '-' + (tipHeight - 6) + 'px';
            }
            if (target) {
                var tipPosExclude = tooltipPositionX !== 'Center' || (tooltipWidth > target.offsetWidth) || this.mouseTrail;
                if ((tipPosExclude && tooltipPositionX === 'Left') || (!tipPosExclude && this.tipPointerPosition === 'End')) {
                    leftValue = (tooltipWidth - tipWidth - POINTER_ADJUST) + 'px';
                }
                else if ((tipPosExclude && tooltipPositionX === 'Right') || (!tipPosExclude && this.tipPointerPosition === 'Start')) {
                    leftValue = POINTER_ADJUST + 'px';
                }
                else {
                    leftValue = ((tooltipWidth / 2) - (tipWidth / 2)) + 'px';
                }
            }
        }
        else {
            if (this.tipClass === TIP_RIGHT) {
                leftValue = '99.9%';
                // Arrow icon aligned -2px left from ArrowOuterTip div
                arrowInnerELe.style.left = '-' + (tipWidth - 2) + 'px';
            }
            else {
                leftValue = -(tipWidth - 1) + 'px';
                // Arrow icon aligned -2px from ArrowOuterTip width
                arrowInnerELe.style.left = (-(tipWidth) + (tipWidth - 2)) + 'px';
            }
            var tipPosExclude = tooltipPositionY !== 'Center' || (tooltipHeight > target.offsetHeight) || this.mouseTrail;
            if ((tipPosExclude && tooltipPositionY === 'Top') || (!tipPosExclude && this.tipPointerPosition === 'End')) {
                topValue = (tooltipHeight - tipHeight - POINTER_ADJUST) + 'px';
            }
            else if ((tipPosExclude && tooltipPositionY === 'Bottom') || (!tipPosExclude && this.tipPointerPosition === 'Start')) {
                topValue = POINTER_ADJUST + 'px';
            }
            else {
                topValue = ((tooltipHeight / 2) - (tipHeight / 2)) + 'px';
            }
        }
        arrowEle.style.top = topValue;
        arrowEle.style.left = leftValue;
    };
    Tooltip.prototype.renderContent = function (target) {
        var tooltipContent = this.tooltipEle.querySelector('.' + CONTENT);
        if (this.cssClass) {
            sf.base.addClass([this.tooltipEle], this.cssClass.split(' '));
        }
        if (target && !sf.base.isNullOrUndefined(target.getAttribute('title'))) {
            target.setAttribute('data-content', target.getAttribute('title'));
            target.removeAttribute('title');
        }
        if (!sf.base.isNullOrUndefined(this.content)) {
            if (this.isBlazorTooltip || !(this.isServerRender())) {
                tooltipContent.innerHTML = '';
                if (this.content instanceof HTMLElement) {
                    tooltipContent.appendChild(this.content);
                }
                else if (typeof this.content === 'string' && this.content.indexOf('<div>Blazor') < 0) {
                    if (this.enableHtmlSanitizer) {
                        this.setProperties({ content: sf.base.SanitizeHtmlHelper.sanitize(this.content) }, true);
                    }
                    tooltipContent.innerHTML = this.content;
                }
                else {
                    var templateFunction = sf.base.compile(this.content);
                    var tempArr = templateFunction({}, this, 'content', this.element.id + 'content', undefined, undefined, tooltipContent);
                    if (tempArr) {
                        sf.base.append(tempArr, tooltipContent);
                    }
                    this.renderReactTemplates();
                    if (typeof this.content === 'string' && this.content.indexOf('<div>Blazor') >= 0) {
                        this.isBlazorTemplate = true;
                        sf.base.updateBlazorTemplate(this.element.id + 'content', 'Content', this);
                    }
                }
            }
        }
        else {
            if (target && !sf.base.isNullOrUndefined(target.getAttribute('data-content'))) {
                tooltipContent.innerHTML = target.getAttribute('data-content');
            }
        }
    };
    Tooltip.prototype.renderCloseIcon = function () {
        if (!this.isSticky) {
            return;
        }
        var tipClose = this.createElement('div', { className: ICON + ' ' + CLOSE });
        this.tooltipEle.appendChild(tipClose);
        sf.base.EventHandler.add(tipClose, sf.base.Browser.touchStartEvent, this.onStickyClose, this);
    };
    Tooltip.prototype.addDescribedBy = function (target, id) {
        var describedby = (target.getAttribute('aria-describedby') || '').split(/\s+/);
        if (describedby.indexOf(id) < 0) {
            describedby.push(id);
        }
        sf.base.attributes(target, { 'aria-describedby': describedby.join(' ').trim(), 'data-tooltip-id': id });
    };
    Tooltip.prototype.removeDescribedBy = function (target) {
        var id = target.getAttribute('data-tooltip-id');
        var describedby = (target.getAttribute('aria-describedby') || '').split(/\s+/);
        var index = describedby.indexOf(id);
        if (index !== -1) {
            describedby.splice(index, 1);
        }
        target.removeAttribute('data-tooltip-id');
        var orgdescribedby = describedby.join(' ').trim();
        if (orgdescribedby) {
            target.setAttribute('aria-describedby', orgdescribedby);
        }
        else {
            target.removeAttribute('aria-describedby');
        }
    };
    Tooltip.prototype.tapHoldHandler = function (evt) {
        clearTimeout(this.autoCloseTimer);
        this.targetHover(evt.originalEvent);
    };
    Tooltip.prototype.touchEndHandler = function (e) {
        var _this = this;
        if (this.isSticky) {
            return;
        }
        var close = function () {
            _this.close();
        };
        this.autoCloseTimer = setTimeout(close, TOUCHEND_HIDE_DELAY);
    };
    Tooltip.prototype.targetClick = function (e) {
        var target;
        if (this.target) {
            target = sf.base.closest(e.target, this.target);
        }
        else {
            target = this.element;
        }
        if (sf.base.isNullOrUndefined(target)) {
            return;
        }
        if (target.getAttribute('data-tooltip-id') === null) {
            this.targetHover(e);
        }
        else if (!this.isSticky) {
            this.hideTooltip(this.animation.close, e, target);
        }
    };
    Tooltip.prototype.targetHover = function (e) {
        var target;
        if (this.target) {
            target = sf.base.closest(e.target, this.target);
        }
        else {
            target = this.element;
        }
        if (sf.base.isNullOrUndefined(target) || target.getAttribute('data-tooltip-id') !== null) {
            return;
        }
        var targetList = [].slice.call(document.querySelectorAll('[data-tooltip-id= ' + this.ctrlId + '_content]'));
        for (var _i = 0, targetList_1 = targetList; _i < targetList_1.length; _i++) {
            var target_1 = targetList_1[_i];
            this.restoreElement(target_1);
        }
        this.showTooltip(target, this.animation.open, e);
    };
    Tooltip.prototype.showTooltip = function (target, showAnimation, e) {
        var _this = this;
        clearTimeout(this.showTimer);
        clearTimeout(this.hideTimer);
        this.tooltipEventArgs = {
            type: e ? e.type : null, cancel: false, target: target, event: e ? e : null,
            element: this.tooltipEle, isInteracted: !sf.base.isNullOrUndefined(e)
        };
        var observeCallback = function (beforeRenderArgs) {
            _this.beforeRenderCallback(beforeRenderArgs, target, e, showAnimation);
        };
        this.trigger('beforeRender', this.tooltipEventArgs, observeCallback.bind(this));
    };
    Tooltip.prototype.beforeRenderCallback = function (beforeRenderArgs, target, e, showAnimation) {
        var isBlazorTooltipRendered = false;
        if (beforeRenderArgs.cancel) {
            this.isHidden = true;
            this.clear();
        }
        else {
            this.isHidden = false;
            if (sf.base.isNullOrUndefined(this.tooltipEle)) {
                if (this.isServerRender()) {
                    this.contentTargetValue = target;
                    this.contentEvent = e;
                    this.contentAnimation = showAnimation;
                    var args = { 'enableTooltip': 'true' };
                    // tslint:disable
                    this.interopAdaptor.invokeMethodAsync('OnTooltipServerCall', args);
                    // tslint:enable
                    isBlazorTooltipRendered = true;
                }
                else {
                    this.ctrlId = this.element.getAttribute('id') ?
                        sf.base.getUniqueID(this.element.getAttribute('id')) : sf.base.getUniqueID('tooltip');
                    this.tooltipEle = this.createElement('div', {
                        className: TOOLTIP_WRAP + ' ' + POPUP_ROOT + ' ' + POPUP_LIB, attrs: {
                            role: 'tooltip', 'aria-hidden': 'false', 'id': this.ctrlId + '_content'
                        }, styles: 'width:' +
                            sf.base.formatUnit(this.width) + ';height:' + sf.base.formatUnit(this.height) + ';position:absolute;'
                    });
                    this.beforeRenderBlazor(target, this);
                }
                if (!isBlazorTooltipRendered) {
                    this.afterRenderBlazor(target, e, showAnimation, this);
                }
            }
            else {
                if (this.isServerRender()) {
                    sf.base.addClass([this.tooltipEle], POPUP_OPEN);
                    document.body.appendChild(this.tooltipEle);
                    this.renderCloseIcon();
                    this.renderPopup(target);
                }
                if (target) {
                    this.adjustArrow(target, this.position, this.tooltipPositionX, this.tooltipPositionY);
                    this.addDescribedBy(target, this.ctrlId + '_content');
                    this.renderContent(target);
                    sf.base.Animation.stop(this.tooltipEle);
                    this.reposition(target);
                    this.afterRenderBlazor(target, e, showAnimation, this);
                }
            }
        }
    };
    
    Tooltip.prototype.contentUpdated = function (args) {
        if (sf.base.isNullOrUndefined(this.tooltipEle)) {
            if (this.isServerRender()) {
                this.ctrlId = this.element.id;
                this.tooltipEle = document.querySelector('#' + this.ctrlId + '_content');
                if (this.tooltipEle) {
                    this.tooltipEle.setAttribute('style', 'width:' + sf.base.formatUnit(this.width) +
                        ';height:' + sf.base.formatUnit(this.height) + ';position:absolute;');
                    this.beforeRenderBlazor(this.contentTargetValue, this);
                    this.afterRenderBlazor(this.contentTargetValue, this.contentEvent, this.contentAnimation, this);
                    this.contentTargetValue = this.contentEvent = this.contentAnimation = null;
                }
            }
        }
    };
    
    Tooltip.prototype.beforeRenderBlazor = function (target, ctrlObj) {
        if (target) {
            if (sf.base.Browser.isDevice) {
                sf.base.addClass([ctrlObj.tooltipEle], DEVICE);
            }
            if (ctrlObj.width !== 'auto') {
                ctrlObj.tooltipEle.style.maxWidth = sf.base.formatUnit(ctrlObj.width);
            }
            if (!(this.isServerRender())) {
                ctrlObj.tooltipEle.appendChild(ctrlObj.createElement('div', { className: CONTENT }));
            }
            document.body.appendChild(ctrlObj.tooltipEle);
            sf.base.removeClass([ctrlObj.tooltipEle], HIDE_POPUP);
            ctrlObj.addDescribedBy(target, ctrlObj.ctrlId + '_content');
            ctrlObj.renderContent(target);
            sf.base.addClass([ctrlObj.tooltipEle], POPUP_OPEN);
            if (ctrlObj.showTipPointer) {
                ctrlObj.renderArrow();
            }
            ctrlObj.renderCloseIcon();
            ctrlObj.renderPopup(target);
            ctrlObj.adjustArrow(target, ctrlObj.position, ctrlObj.tooltipPositionX, ctrlObj.tooltipPositionY);
            sf.base.Animation.stop(ctrlObj.tooltipEle);
            ctrlObj.reposition(target);
        }
    };
    Tooltip.prototype.afterRenderBlazor = function (target, e, showAnimation, ctrlObj) {
        if (target) {
            sf.base.removeClass([ctrlObj.tooltipEle], POPUP_OPEN);
            sf.base.addClass([ctrlObj.tooltipEle], POPUP_CLOSE);
            ctrlObj.tooltipEventArgs = {
                type: e ? e.type : null, cancel: false, target: target, event: e ? e : null,
                element: ctrlObj.tooltipEle, isInteracted: !sf.base.isNullOrUndefined(e)
            };
            if (ctrlObj.needTemplateReposition() && !ctrlObj.mouseTrail) {
                ctrlObj.tooltipEle.style.display = 'none';
            }
            var observeCallback = function (observedArgs) {
                ctrlObj.beforeOpenCallback(observedArgs, target, showAnimation, e);
            };
            ctrlObj.trigger('beforeOpen', ctrlObj.tooltipEventArgs, observeCallback.bind(ctrlObj));
        }
    };
    Tooltip.prototype.beforeOpenCallback = function (observedArgs, target, showAnimation, e) {
        var _this = this;
        if (observedArgs.cancel) {
            this.isHidden = true;
            this.clear();
            this.restoreElement(target);
        }
        else {
            var openAnimation_1 = {
                name: showAnimation.effect,
                duration: showAnimation.duration,
                delay: showAnimation.delay,
                timingFunction: 'easeOut'
            };
            if (showAnimation.effect === 'None') {
                openAnimation_1 = undefined;
            }
            if (this.openDelay > 0) {
                var show = function () {
                    if (_this.popupObj) {
                        _this.popupObj.show(openAnimation_1, target);
                    }
                };
                this.showTimer = setTimeout(show, this.openDelay);
            }
            else {
                if (this.popupObj) {
                    this.popupObj.show(openAnimation_1, target);
                }
            }
        }
        if (e) {
            this.wireMouseEvents(e, target);
        }
    };
    Tooltip.prototype.needTemplateReposition = function () {
        // tslint:disable-next-line:no-any
        var tooltip = this;
        return !sf.base.isNullOrUndefined(tooltip.viewContainerRef)
            && typeof tooltip.viewContainerRef !== 'string'
            || (this.isServerRender()) && this.isBlazorTemplate;
    };
    Tooltip.prototype.checkCollision = function (target, x, y) {
        var elePos = {
            left: x, top: y, position: this.position,
            horizontal: this.tooltipPositionX, vertical: this.tooltipPositionY
        };
        var affectedPos = sf.popups.isCollide(this.tooltipEle, (this.target ? this.element : null), x, y);
        if (affectedPos.length > 0) {
            elePos.horizontal = affectedPos.indexOf('left') >= 0 ? 'Right' : affectedPos.indexOf('right') >= 0 ? 'Left' :
                this.tooltipPositionX;
            elePos.vertical = affectedPos.indexOf('top') >= 0 ? 'Bottom' : affectedPos.indexOf('bottom') >= 0 ? 'Top' :
                this.tooltipPositionY;
        }
        return elePos;
    };
    Tooltip.prototype.collisionFlipFit = function (target, x, y) {
        var elePos = this.checkCollision(target, x, y);
        var newpos = elePos.position;
        if (this.tooltipPositionY !== elePos.vertical) {
            newpos = ((this.position.indexOf('Bottom') === 0 || this.position.indexOf('Top') === 0) ?
                elePos.vertical + this.tooltipPositionX : this.tooltipPositionX + elePos.vertical);
        }
        if (this.tooltipPositionX !== elePos.horizontal) {
            if (newpos.indexOf('Left') === 0) {
                elePos.vertical = (newpos === 'LeftTop' || newpos === 'LeftCenter') ? 'Top' : 'Bottom';
                newpos = (elePos.vertical + 'Left');
            }
            if (newpos.indexOf('Right') === 0) {
                elePos.vertical = (newpos === 'RightTop' || newpos === 'RightCenter') ? 'Top' : 'Bottom';
                newpos = (elePos.vertical + 'Right');
            }
            elePos.horizontal = this.tooltipPositionX;
        }
        this.tooltipEventArgs = {
            type: null, cancel: false, target: target, event: null,
            element: this.tooltipEle, collidedPosition: newpos
        };
        this.trigger('beforeCollision', this.tooltipEventArgs);
        if (elePos.position !== newpos) {
            var pos = sf.popups.calculatePosition(target, elePos.horizontal, elePos.vertical);
            this.adjustArrow(target, newpos, elePos.horizontal, elePos.vertical);
            var offsetPos = this.calculateTooltipOffset(newpos);
            offsetPos.top -= (('TopBottom'.indexOf(this.position.split(/(?=[A-Z])/)[0]) !== -1) &&
                ('TopBottom'.indexOf(newpos.split(/(?=[A-Z])/)[0]) !== -1)) ? (2 * this.offsetY) : 0;
            offsetPos.left -= (('RightLeft'.indexOf(this.position.split(/(?=[A-Z])/)[0]) !== -1) &&
                ('RightLeft'.indexOf(newpos.split(/(?=[A-Z])/)[0]) !== -1)) ? (2 * this.offsetX) : 0;
            elePos.position = newpos;
            elePos.left = pos.left + offsetPos.left;
            elePos.top = pos.top + offsetPos.top;
        }
        else {
            this.adjustArrow(target, newpos, elePos.horizontal, elePos.vertical);
        }
        var eleOffset = { left: elePos.left, top: elePos.top };
        var left = sf.popups.fit(this.tooltipEle, (this.target ? this.element : null), { X: true, Y: false }, eleOffset).left;
        this.tooltipEle.style.display = 'block';
        if (this.showTipPointer && (newpos.indexOf('Bottom') === 0 || newpos.indexOf('Top') === 0)) {
            var arrowEle = this.tooltipEle.querySelector('.' + ARROW_TIP);
            var arrowleft = parseInt(arrowEle.style.left, 10) - (left - elePos.left);
            if (arrowleft < 0) {
                arrowleft = 0;
            }
            else if ((arrowleft + arrowEle.offsetWidth) > this.tooltipEle.clientWidth) {
                arrowleft = this.tooltipEle.clientWidth - arrowEle.offsetWidth;
            }
            arrowEle.style.left = arrowleft.toString() + 'px';
        }
        this.tooltipEle.style.display = '';
        eleOffset.left = left;
        return eleOffset;
    };
    Tooltip.prototype.hideTooltip = function (hideAnimation, e, targetElement) {
        var _this = this;
        var target;
        if (e) {
            target = this.target ? (targetElement || e.target) : this.element;
        }
        else {
            target = document.querySelector('[data-tooltip-id= ' + this.ctrlId + '_content]');
        }
        this.tooltipEventArgs = {
            type: e ? e.type : null, cancel: false, target: target, event: e ? e : null,
            element: this.tooltipEle, isInteracted: !sf.base.isNullOrUndefined(e)
        };
        // this line commented for close the tooltip popup element even the target element destroyed in a page.
        //if (isNullOrUndefined(target)) { return; }
        this.trigger('beforeClose', this.tooltipEventArgs, function (observedArgs) {
            if (!observedArgs.cancel) {
                if (_this.isServerRender()) {
                    _this.blazorHide(hideAnimation, target);
                }
                else {
                    _this.popupHide(hideAnimation, target);
                }
            }
            else {
                _this.isHidden = false;
            }
        });
    };
    /* istanbul ignore next */
    Tooltip.prototype.blazorHide = function (hideAnimation, target) {
        var proxy = this;
        var hide = function () {
            proxy.popupHide(hideAnimation, target);
        };
        if (this.popupObj) {
            this.popupHide(hideAnimation, target);
        }
        else {
            setTimeout(hide, 200);
        }
    };
    Tooltip.prototype.popupHide = function (hideAnimation, target) {
        var _this = this;
        if (target) {
            this.restoreElement(target);
        }
        this.isHidden = true;
        var closeAnimation = {
            name: hideAnimation.effect,
            duration: hideAnimation.duration,
            delay: hideAnimation.delay,
            timingFunction: 'easeIn'
        };
        if (hideAnimation.effect === 'None') {
            closeAnimation = undefined;
        }
        if (this.closeDelay > 0) {
            var hide = function () {
                if (_this.popupObj) {
                    _this.popupObj.hide(closeAnimation);
                }
            };
            this.hideTimer = setTimeout(hide, this.closeDelay);
        }
        else {
            if (this.popupObj) {
                this.popupObj.hide(closeAnimation);
            }
        }
    };
    Tooltip.prototype.restoreElement = function (target) {
        this.unwireMouseEvents(target);
        if (!sf.base.isNullOrUndefined(target.getAttribute('data-content'))) {
            target.setAttribute('title', target.getAttribute('data-content'));
            target.removeAttribute('data-content');
        }
        this.removeDescribedBy(target);
    };
    Tooltip.prototype.clear = function () {
        if (this.tooltipEle) {
            sf.base.removeClass([this.tooltipEle], POPUP_CLOSE);
            sf.base.addClass([this.tooltipEle], POPUP_OPEN);
        }
        if (this.isHidden) {
            if (this.popupObj) {
                this.popupObj.destroy();
            }
            if (this.isServerRender() && this.tooltipEle) {
                this.tooltipEle.style.display = 'none';
                var args = { 'enableTooltip': 'false' };
                // tslint:disable
                this.interopAdaptor.invokeMethodAsync('OnTooltipServerCall', args);
                // tslint:enable
                sf.base.remove(this.tooltipEle);
            }
            else if (this.tooltipEle) {
                sf.base.remove(this.tooltipEle);
            }
            this.tooltipEle = null;
            this.popupObj = null;
        }
    };
    Tooltip.prototype.onMouseOut = function (e) {
        var enteredElement = e.relatedTarget;
        // don't close the tooltip only if it is tooltip content element
        if (enteredElement && !this.mouseTrail) {
            var checkForTooltipElement = sf.base.closest(enteredElement, "." + TOOLTIP_WRAP + "." + POPUP_LIB + "." + POPUP_ROOT);
            if (checkForTooltipElement) {
                sf.base.EventHandler.add(checkForTooltipElement, 'mouseleave', this.tooltipElementMouseOut, this);
                this.unwireMouseEvents(e.target);
            }
            else {
                this.hideTooltip(this.animation.close, e, this.findTarget());
                if (this.closeDelay === 0) {
                    this.clear();
                }
            }
        }
        else {
            this.hideTooltip(this.animation.close, e, this.findTarget());
            this.clear();
        }
    };
    Tooltip.prototype.tooltipElementMouseOut = function (e) {
        this.hideTooltip(this.animation.close, e, this.findTarget());
        sf.base.EventHandler.remove(this.element, 'mouseleave', this.tooltipElementMouseOut);
        this.clear();
    };
    Tooltip.prototype.onStickyClose = function (e) {
        this.close();
    };
    Tooltip.prototype.onMouseMove = function (event) {
        var eventPageX = 0;
        var eventPageY = 0;
        if (event.type.indexOf('touch') > -1) {
            event.preventDefault();
            eventPageX = event.touches[0].pageX;
            eventPageY = event.touches[0].pageY;
        }
        else {
            eventPageX = event.pageX;
            eventPageY = event.pageY;
        }
        sf.base.Animation.stop(this.tooltipEle);
        sf.base.removeClass([this.tooltipEle], POPUP_CLOSE);
        sf.base.addClass([this.tooltipEle], POPUP_OPEN);
        this.adjustArrow(event.target, this.position, this.tooltipPositionX, this.tooltipPositionY);
        var pos = this.calculateTooltipOffset(this.position);
        var x = eventPageX + pos.left + this.offsetX;
        var y = eventPageY + pos.top + this.offsetY;
        var elePos = this.checkCollision(event.target, x, y);
        if (this.tooltipPositionX !== elePos.horizontal || this.tooltipPositionY !== elePos.vertical) {
            var newpos = (this.position.indexOf('Bottom') === 0 || this.position.indexOf('Top') === 0) ?
                elePos.vertical + elePos.horizontal : elePos.horizontal + elePos.vertical;
            elePos.position = newpos;
            this.adjustArrow(event.target, elePos.position, elePos.horizontal, elePos.vertical);
            var colpos = this.calculateTooltipOffset(elePos.position);
            elePos.left = eventPageX + colpos.left - this.offsetX;
            elePos.top = eventPageY + colpos.top - this.offsetY;
        }
        this.tooltipEle.style.left = elePos.left + 'px';
        this.tooltipEle.style.top = elePos.top + 'px';
    };
    Tooltip.prototype.keyDown = function (event) {
        if (this.tooltipEle && event.keyCode === 27) {
            this.close();
        }
    };
    Tooltip.prototype.touchEnd = function (e) {
        if (this.tooltipEle && sf.base.closest(e.target, '.' + ROOT) === null) {
            this.close();
        }
    };
    Tooltip.prototype.scrollHandler = function (e) {
        if (this.tooltipEle) {
            if (!(sf.base.closest(e.target, "." + TOOLTIP_WRAP + "." + POPUP_LIB + "." + POPUP_ROOT))) {
                this.close();
            }
        }
    };
    /**
     * Core method that initializes the control rendering.
     * @private
     */
    Tooltip.prototype.render = function () {
        this.initialize();
        this.wireEvents(this.opensOn);
        this.renderComplete();
    };
    /**
     * Initializes the values of private members.
     * @private
     */
    Tooltip.prototype.preRender = function () {
        this.tipClass = TIP_BOTTOM;
        this.tooltipPositionX = 'Center';
        this.tooltipPositionY = 'Top';
        this.isHidden = true;
    };
    /**
     * Binding events to the Tooltip element.
     * @hidden
     */
    Tooltip.prototype.wireEvents = function (trigger) {
        var triggerList = this.getTriggerList(trigger);
        for (var _i = 0, triggerList_1 = triggerList; _i < triggerList_1.length; _i++) {
            var opensOn = triggerList_1[_i];
            if (opensOn === 'Custom') {
                return;
            }
            if (opensOn === 'Focus') {
                this.wireFocusEvents();
            }
            if (opensOn === 'Click') {
                sf.base.EventHandler.add(this.element, sf.base.Browser.touchStartEvent, this.targetClick, this);
            }
            if (opensOn === 'Hover') {
                if (sf.base.Browser.isDevice) {
                    this.touchModule = new sf.base.Touch(this.element, {
                        tapHoldThreshold: TAPHOLD_THRESHOLD,
                        tapHold: this.tapHoldHandler.bind(this)
                    });
                    sf.base.EventHandler.add(this.element, sf.base.Browser.touchEndEvent, this.touchEndHandler, this);
                }
                else {
                    sf.base.EventHandler.add(this.element, 'mouseover', this.targetHover, this);
                    if (this.isServerRender() && !this.isSticky) {
                        sf.base.EventHandler.add(this.element, 'mouseleave', this.onMouseOut, this);
                    }
                }
            }
        }
        sf.base.EventHandler.add(document, 'touchend', this.touchEnd, this);
        sf.base.EventHandler.add(document, 'scroll wheel', this.scrollHandler, this);
        sf.base.EventHandler.add(document, 'keydown', this.keyDown, this);
    };
    Tooltip.prototype.getTriggerList = function (trigger) {
        if (trigger === 'Auto') {
            trigger = (sf.base.Browser.isDevice) ? 'Hover' : 'Hover Focus';
        }
        return trigger.split(' ');
    };
    Tooltip.prototype.wireFocusEvents = function () {
        if (!sf.base.isNullOrUndefined(this.target)) {
            var targetList = [].slice.call(this.element.querySelectorAll(this.target));
            for (var _i = 0, targetList_2 = targetList; _i < targetList_2.length; _i++) {
                var target = targetList_2[_i];
                sf.base.EventHandler.add(target, 'focus', this.targetHover, this);
            }
        }
        else {
            sf.base.EventHandler.add(this.element, 'focus', this.targetHover, this);
        }
    };
    Tooltip.prototype.wireMouseEvents = function (e, target) {
        if (this.tooltipEle) {
            if (!this.isSticky) {
                if (e.type === 'focus') {
                    sf.base.EventHandler.add(target, 'blur', this.onMouseOut, this);
                }
                if (e.type === 'mouseover') {
                    if (!this.isServerRender()) {
                        sf.base.EventHandler.add(target, 'mouseleave', this.onMouseOut, this);
                    }
                }
            }
            if (this.mouseTrail) {
                sf.base.EventHandler.add(target, 'mousemove touchstart mouseenter', this.onMouseMove, this);
            }
        }
    };
    /**
     * Unbinding events from the element on widget destroy.
     * @hidden
     */
    Tooltip.prototype.unwireEvents = function (trigger) {
        var triggerList = this.getTriggerList(trigger);
        for (var _i = 0, triggerList_2 = triggerList; _i < triggerList_2.length; _i++) {
            var opensOn = triggerList_2[_i];
            if (opensOn === 'Custom') {
                return;
            }
            if (opensOn === 'Focus') {
                this.unwireFocusEvents();
            }
            if (opensOn === 'Click') {
                sf.base.EventHandler.remove(this.element, sf.base.Browser.touchStartEvent, this.targetClick);
            }
            if (opensOn === 'Hover') {
                if (sf.base.Browser.isDevice) {
                    if (this.touchModule) {
                        this.touchModule.destroy();
                    }
                    sf.base.EventHandler.remove(this.element, sf.base.Browser.touchEndEvent, this.touchEndHandler);
                }
                else {
                    sf.base.EventHandler.remove(this.element, 'mouseover', this.targetHover);
                    if (this.isServerRender() && !this.isSticky) {
                        sf.base.EventHandler.remove(this.element, 'mouseleave', this.onMouseOut);
                    }
                }
            }
        }
        sf.base.EventHandler.remove(document, 'touchend', this.touchEnd);
        sf.base.EventHandler.remove(document, 'scroll wheel', this.scrollHandler);
        sf.base.EventHandler.remove(document, 'keydown', this.keyDown);
    };
    Tooltip.prototype.unwireFocusEvents = function () {
        if (!sf.base.isNullOrUndefined(this.target)) {
            var targetList = [].slice.call(this.element.querySelectorAll(this.target));
            for (var _i = 0, targetList_3 = targetList; _i < targetList_3.length; _i++) {
                var target = targetList_3[_i];
                sf.base.EventHandler.remove(target, 'focus', this.targetHover);
            }
        }
        else {
            sf.base.EventHandler.remove(this.element, 'focus', this.targetHover);
        }
    };
    Tooltip.prototype.unwireMouseEvents = function (target) {
        if (!this.isSticky) {
            var triggerList = this.getTriggerList(this.opensOn);
            for (var _i = 0, triggerList_3 = triggerList; _i < triggerList_3.length; _i++) {
                var opensOn = triggerList_3[_i];
                if (opensOn === 'Focus') {
                    sf.base.EventHandler.remove(target, 'blur', this.onMouseOut);
                }
                if (opensOn === 'Hover' && !sf.base.Browser.isDevice) {
                    if (!this.isServerRender()) {
                        sf.base.EventHandler.remove(target, 'mouseleave', this.onMouseOut);
                    }
                }
            }
        }
        if (this.mouseTrail) {
            sf.base.EventHandler.remove(target, 'mousemove touchstart mouseenter', this.onMouseMove);
        }
    };
    Tooltip.prototype.findTarget = function () {
        var target = document.querySelector('[data-tooltip-id= ' + this.ctrlId + '_content]');
        return target;
    };
    /**
     * Core method to return the component name.
     * @private
     */
    Tooltip.prototype.getModuleName = function () {
        return 'tooltip';
    };
    /**
     * Returns the properties to be maintained in the persisted state.
     * @private
     */
    Tooltip.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    Tooltip.prototype.onPropertyChanged = function (newProp, oldProp) {
        var targetElement = this.findTarget();
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'width':
                    if (this.tooltipEle && targetElement) {
                        this.tooltipEle.style.width = this.tooltipEle.style.maxWidth = sf.base.formatUnit(newProp.width);
                        this.reposition(targetElement);
                    }
                    break;
                case 'height':
                    if (this.tooltipEle && targetElement) {
                        this.tooltipEle.style.height = sf.base.formatUnit(newProp.height);
                        this.reposition(targetElement);
                    }
                    break;
                case 'content':
                    if (this.tooltipEle) {
                        if (this.isServerRender()) {
                            this.isBlazorTooltip = true;
                        }
                        this.renderContent();
                    }
                    else if (this.isServerRender()) {
                        var args = { 'content': newProp.content };
                        // tslint:disable
                        this.interopAdaptor.invokeMethodAsync('OnTooltipServerCall', args);
                        // tslint:enable
                    }
                    break;
                case 'opensOn':
                    this.unwireEvents(oldProp.opensOn);
                    this.wireEvents(newProp.opensOn);
                    break;
                case 'position':
                    this.formatPosition();
                    if (this.tooltipEle && targetElement) {
                        var arrowInnerELe = this.tooltipEle.querySelector('.' + ARROW_TIP_INNER);
                        arrowInnerELe.style.top = arrowInnerELe.style.left = null;
                        this.reposition(targetElement);
                    }
                    break;
                case 'tipPointerPosition':
                    if (this.tooltipEle && targetElement) {
                        this.reposition(targetElement);
                    }
                    break;
                case 'offsetX':
                    if (this.tooltipEle) {
                        var x = newProp.offsetX - oldProp.offsetX;
                        this.tooltipEle.style.left = (parseInt(this.tooltipEle.style.left, 10) + (x)).toString() + 'px';
                    }
                    break;
                case 'offsetY':
                    if (this.tooltipEle) {
                        var y = newProp.offsetY - oldProp.offsetY;
                        this.tooltipEle.style.top = (parseInt(this.tooltipEle.style.top, 10) + (y)).toString() + 'px';
                    }
                    break;
                case 'cssClass':
                    if (this.tooltipEle) {
                        if (oldProp.cssClass) {
                            sf.base.removeClass([this.tooltipEle], oldProp.cssClass.split(' '));
                        }
                        if (newProp.cssClass) {
                            sf.base.addClass([this.tooltipEle], newProp.cssClass.split(' '));
                        }
                    }
                    break;
                case 'enableRtl':
                    if (this.tooltipEle) {
                        if (this.enableRtl) {
                            sf.base.addClass([this.tooltipEle], RTL);
                        }
                        else {
                            sf.base.removeClass([this.tooltipEle], RTL);
                        }
                    }
                    break;
            }
        }
    };
    /**
     * It is used to show the Tooltip on the specified target with specific animation settings.
     * @param element Target element where the Tooltip is to be displayed. (It is an optional parameter)
     * @param animation Sets the specific animation, while showing the Tooltip on the screen. (It is an optional parameter)
     * @return {void}
     */
    Tooltip.prototype.open = function (element, animation) {
        if (sf.base.isNullOrUndefined(animation)) {
            animation = this.animation.open;
        }
        if (sf.base.isNullOrUndefined(element)) {
            element = this.element;
        }
        if (element.style.display === 'none') {
            return;
        }
        this.showTooltip(element, animation);
    };
    /**
     * It is used to hide the Tooltip with specific animation effect.
     * @param animation Sets the specific animation when hiding Tooltip from the screen. (It is an optional parameter)
     * @return {void}
     */
    Tooltip.prototype.close = function (animation) {
        if (!animation) {
            animation = this.animation.close;
        }
        this.hideTooltip(animation);
    };
    /**
     * It is used to refresh the Tooltip content and its position.
     * @param target Target element where the Tooltip content or position needs to be refreshed.
     * @return {void}
     */
    Tooltip.prototype.refresh = function (target) {
        if (this.tooltipEle) {
            this.renderContent(target);
        }
        if (this.popupObj && target) {
            this.reposition(target);
        }
    };
    /**
     * It is used to destroy the Tooltip component.
     * @method destroy
     * @return {void}
     * @memberof Tooltip
     */
    Tooltip.prototype.destroy = function () {
        if (!this.isServerRender()) {
            _super.prototype.destroy.call(this);
            if (this.tooltipEle) {
                sf.base.remove(this.tooltipEle);
            }
        }
        if (this.isServerRender() && this.tooltipEle) {
            var placeholder = document.querySelector('#' + this.ctrlId + '_content_placeholder');
            if (placeholder) {
                placeholder.appendChild(this.tooltipEle);
            }
        }
        if (this.popupObj) {
            this.popupObj.destroy();
        }
        sf.base.removeClass([this.element], ROOT);
        this.unwireEvents(this.opensOn);
        this.unwireMouseEvents(this.element);
        this.tooltipEle = null;
        this.popupObj = null;
    };
    __decorate([
        sf.base.Property('auto')
    ], Tooltip.prototype, "width", void 0);
    __decorate([
        sf.base.Property('auto')
    ], Tooltip.prototype, "height", void 0);
    __decorate([
        sf.base.Property()
    ], Tooltip.prototype, "content", void 0);
    __decorate([
        sf.base.Property()
    ], Tooltip.prototype, "target", void 0);
    __decorate([
        sf.base.Property('TopCenter')
    ], Tooltip.prototype, "position", void 0);
    __decorate([
        sf.base.Property(0)
    ], Tooltip.prototype, "offsetX", void 0);
    __decorate([
        sf.base.Property(0)
    ], Tooltip.prototype, "offsetY", void 0);
    __decorate([
        sf.base.Property(true)
    ], Tooltip.prototype, "showTipPointer", void 0);
    __decorate([
        sf.base.Property('Auto')
    ], Tooltip.prototype, "tipPointerPosition", void 0);
    __decorate([
        sf.base.Property('Auto')
    ], Tooltip.prototype, "opensOn", void 0);
    __decorate([
        sf.base.Property(false)
    ], Tooltip.prototype, "mouseTrail", void 0);
    __decorate([
        sf.base.Property(false)
    ], Tooltip.prototype, "isSticky", void 0);
    __decorate([
        sf.base.Complex({}, Animation$1)
    ], Tooltip.prototype, "animation", void 0);
    __decorate([
        sf.base.Property(0)
    ], Tooltip.prototype, "openDelay", void 0);
    __decorate([
        sf.base.Property(0)
    ], Tooltip.prototype, "closeDelay", void 0);
    __decorate([
        sf.base.Property()
    ], Tooltip.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(false)
    ], Tooltip.prototype, "enableHtmlSanitizer", void 0);
    __decorate([
        sf.base.Event()
    ], Tooltip.prototype, "beforeRender", void 0);
    __decorate([
        sf.base.Event()
    ], Tooltip.prototype, "beforeOpen", void 0);
    __decorate([
        sf.base.Event()
    ], Tooltip.prototype, "afterOpen", void 0);
    __decorate([
        sf.base.Event()
    ], Tooltip.prototype, "beforeClose", void 0);
    __decorate([
        sf.base.Event()
    ], Tooltip.prototype, "afterClose", void 0);
    __decorate([
        sf.base.Event()
    ], Tooltip.prototype, "beforeCollision", void 0);
    __decorate([
        sf.base.Event()
    ], Tooltip.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], Tooltip.prototype, "destroyed", void 0);
    Tooltip = __decorate([
        sf.base.NotifyPropertyChanges
    ], Tooltip);
    return Tooltip;
}(sf.base.Component));

/**
 * Tooltip modules
 */

exports.Animation = Animation$1;
exports.Tooltip = Tooltip;

return exports;

});

    sf.popups = sf.base.extend({}, sf.popups, sftooltip({}));