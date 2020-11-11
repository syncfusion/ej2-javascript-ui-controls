window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Tooltip = (function () {
'use strict';

var TAPHOLD_THRESHOLD = 500;
var SHOW_POINTER_TIP_GAP = 0;
var HIDE_POINTER_TIP_GAP = 8;
var MOUSE_TRAIL_GAP = 2;
var POINTER_ADJUST = 2;
var ROOT = 'e-tooltip';
var TOOLTIP_WRAP = 'e-tooltip-wrap';
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
var HIDDDEN = 'e-hidden';
var BIGGER = 'e-bigger';
var RIGHT = 'Right';
var BOTTOM = 'Bottom';
var TOP = 'Top';
var LEFT = 'Left';
var CENTER = 'Center';
var END = 'End';
var START = 'Start';
var TOPLEFT = 'TopLeft';
var TOPRIGHT = 'TopRight';
var BOTTOMLEFT = 'BottomLeft';
var BOTTOMCENTER = 'BottomCenter';
var BOTTOMRIGHT = 'BottomRight';
var LEFTTOP = 'LeftTop';
var LEFTCENTER = 'LeftCenter';
var LEFTBOTTOM = 'LeftBottom';
var RIGHTTOP = 'RightTop';
var RIGHTCENTER = 'RightCenter';
var RIGHTBOTTOM = 'RightBottom';
var PLACEHOLDER = '_content_placeholder';
var CONTENT = '_content';
var TIPCONTENT = 'e-tip-content';
var SfTooltip = /** @class */ (function () {
    function SfTooltip(element, ref, properties, eventList) {
        this.popupObj = null;
        this.isPositionUpdate = false;
        this.isOffsetXUpdate = false;
        this.isOffsetYUpdate = false;
        this.tipClass = TIP_BOTTOM;
        this.tooltipPositionX = 'Center';
        this.tooltipPositionY = 'Top';
        this.isContiniousOpen = false;
        this.isRestrictUpdate = false;
        this.showTimer = 0;
        this.hideTimer = 0;
        this.contentTargetValue = null;
        this.contentEvent = null;
        this.contentAnimation = null;
        this.beforeCloseAnimation = null;
        this.isPopupHidden = true;
        this.element = element;
        this.properties = properties;
        this.dotnetRef = ref;
        if (!sf.base.isNullOrUndefined(this.element)) {
            this.ctrlId = this.element.id;
            this.element.blazor__instance = this;
            this.element.eventList = eventList;
        }
    }
    SfTooltip.prototype.getTriggerList = function (trigger) {
        if (trigger === 'Auto') {
            trigger = (sf.base.Browser.isDevice) ? 'Hover' : 'Hover Focus';
        }
        return trigger.split(' ');
    };
    SfTooltip.prototype.formatPosition = function () {
        var _a, _b;
        if (this.properties.position.indexOf('Top') === 0 || this.properties.position.indexOf('Bottom') === 0) {
            _a = this.properties.position.split(/(?=[A-Z])/), this.tooltipPositionY = _a[0], this.tooltipPositionX = _a[1];
        }
        else {
            _b = this.properties.position.split(/(?=[A-Z])/), this.tooltipPositionX = _b[0], this.tooltipPositionY = _b[1];
        }
    };
    SfTooltip.prototype.getTargetList = function (target) {
        var targetElements = [];
        if (target === null || target === '') {
            targetElements.push(this.element);
        }
        else {
            targetElements = [].slice.call(this.element.querySelectorAll(target));
            if (targetElements && targetElements.length === 0) {
                targetElements = [].slice.call(document.querySelectorAll(target));
            }
        }
        return targetElements;
    };
    SfTooltip.prototype.wireEvents = function (trigger) {
        var triggerList = this.getTriggerList(trigger);
        var targetList = this.getTargetList(this.properties.target);
        for (var _i = 0, triggerList_1 = triggerList; _i < triggerList_1.length; _i++) {
            var opensOn = triggerList_1[_i];
            for (var _a = 0, targetList_1 = targetList; _a < targetList_1.length; _a++) {
                var target = targetList_1[_a];
                if (opensOn === 'Custom') {
                    return;
                }
                if (opensOn === 'Focus') {
                    this.wireFocusEvents();
                }
                if (opensOn === 'Click') {
                    sf.base.EventHandler.add(target, sf.base.Browser.touchStartEvent, this.targetClick, this);
                }
                if (opensOn === 'Hover') {
                    if (sf.base.Browser.isDevice) {
                        this.touchModule = new sf.base.Touch(target, {
                            tapHoldThreshold: TAPHOLD_THRESHOLD,
                            tapHold: this.tapHoldHandler.bind(this)
                        });
                        sf.base.EventHandler.add(target, sf.base.Browser.touchEndEvent, this.touchEndHandler, this);
                    }
                    else {
                        sf.base.EventHandler.add(target, 'mouseover', this.targetHover, this);
                        if (!this.properties.isSticky) {
                            sf.base.EventHandler.add(target, 'mouseleave', this.onMouseOut, this);
                        }
                    }
                }
            }
        }
        sf.base.EventHandler.add(document, 'touchend', this.touchEnd, this);
        sf.base.EventHandler.add(document, 'scroll wheel', this.scrollHandler, this);
        sf.base.EventHandler.add(document, 'keydown', this.keyDown, this);
        window.addEventListener('resize', this.onWindowResize.bind(this));
    };
    SfTooltip.prototype.onWindowResize = function () {
        if (!this.isHidden()) {
            this.reposition(this.findTarget());
        }
    };
    SfTooltip.prototype.wireFocusEvents = function () {
        if (!sf.base.isNullOrUndefined(this.properties.target)) {
            var targetList = [].slice.call(this.element.querySelectorAll(this.properties.target));
            for (var _i = 0, targetList_2 = targetList; _i < targetList_2.length; _i++) {
                var target = targetList_2[_i];
                sf.base.EventHandler.add(target, 'focus', this.targetHover, this);
            }
        }
        else {
            sf.base.EventHandler.add(this.element, 'focus', this.targetHover, this);
        }
    };
    SfTooltip.prototype.wireMouseEvents = function (e, target) {
        if (this.tooltipEle) {
            if (!this.properties.isSticky) {
                if (e.type === 'focus') {
                    sf.base.EventHandler.add(target, 'blur', this.onMouseOut, this);
                }
            }
            if (this.properties.mouseTrail) {
                sf.base.EventHandler.add(target, 'mousemove touchstart mouseenter', this.onMouseMove, this);
            }
        }
    };
    SfTooltip.prototype.unwireEvents = function (trigger) {
        var triggerList = this.getTriggerList(trigger);
        var targetList = this.getTargetList(this.properties.target);
        for (var _i = 0, triggerList_2 = triggerList; _i < triggerList_2.length; _i++) {
            var opensOn = triggerList_2[_i];
            for (var _a = 0, targetList_3 = targetList; _a < targetList_3.length; _a++) {
                var target = targetList_3[_a];
                if (opensOn === 'Custom') {
                    return;
                }
                if (opensOn === 'Focus') {
                    this.unwireFocusEvents();
                }
                if (opensOn === 'Click') {
                    sf.base.EventHandler.remove(target, sf.base.Browser.touchStartEvent, this.targetClick);
                }
                if (opensOn === 'Hover') {
                    if (sf.base.Browser.isDevice) {
                        if (this.touchModule) {
                            this.touchModule.destroy();
                        }
                        sf.base.EventHandler.remove(target, sf.base.Browser.touchEndEvent, this.touchEndHandler);
                    }
                    else {
                        sf.base.EventHandler.remove(target, 'mouseover', this.targetHover);
                        if (!this.properties.isSticky) {
                            sf.base.EventHandler.remove(target, 'mouseleave', this.onMouseOut);
                        }
                    }
                }
            }
        }
        sf.base.EventHandler.remove(document, 'touchend', this.touchEnd);
        sf.base.EventHandler.remove(document, 'scroll wheel', this.scrollHandler);
        sf.base.EventHandler.remove(document, 'keydown', this.keyDown);
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    };
    SfTooltip.prototype.unwireFocusEvents = function () {
        if (!sf.base.isNullOrUndefined(this.properties.target)) {
            var targetList = [].slice.call(this.element.querySelectorAll(this.properties.target));
            for (var _i = 0, targetList_4 = targetList; _i < targetList_4.length; _i++) {
                var target = targetList_4[_i];
                sf.base.EventHandler.remove(target, 'focus', this.targetHover);
            }
        }
        else {
            sf.base.EventHandler.remove(this.element, 'focus', this.targetHover);
        }
    };
    SfTooltip.prototype.unwireMouseEvents = function (target) {
        if (!this.properties.isSticky) {
            var triggerList = this.getTriggerList(this.properties.opensOn);
            for (var _i = 0, triggerList_3 = triggerList; _i < triggerList_3.length; _i++) {
                var opensOn = triggerList_3[_i];
                if (opensOn === 'Focus') {
                    sf.base.EventHandler.remove(target, 'blur', this.onMouseOut);
                }
            }
        }
        if (this.properties.mouseTrail) {
            sf.base.EventHandler.remove(target, 'mousemove touchstart mouseenter', this.onMouseMove);
        }
    };
    SfTooltip.prototype.findTarget = function () {
        return document.querySelector('[data-tooltip-id= ' + this.ctrlId + '_content]');
    };
    SfTooltip.prototype.addDescribedBy = function (target, id) {
        var describedby = (sf.base.getAttributeOrDefault(target, 'aria-describedby', null) || '').split(/\s+/);
        if (describedby.indexOf(id) < 0) {
            describedby.push(id);
        }
        sf.base.attributes(target, { 'aria-describedby': describedby.join(' ').trim(), 'data-tooltip-id': id });
    };
    SfTooltip.prototype.removeDescribedBy = function (target) {
        var id = sf.base.getAttributeOrDefault(target, 'data-tooltip-id', null);
        var describedby = (sf.base.getAttributeOrDefault(target, 'aria-describedby', null) || '').split(/\s+/);
        var index = describedby.indexOf(id);
        if (index !== -1) {
            describedby.splice(index, 1);
        }
        target.removeAttribute('data-tooltip-id');
        var orgdescribedby = describedby.join(' ').trim();
        orgdescribedby ? sf.base.attributes(target, { 'aria-describedby': orgdescribedby }) : target.removeAttribute('aria-describedby');
    };
    SfTooltip.prototype.clear = function () {
        if (this.tooltipEle && this.isPopupHidden) {
            sf.base.removeClass([this.tooltipEle], POPUP_CLOSE);
            sf.base.addClass([this.tooltipEle], POPUP_OPEN);
        }
        if (this.isPopupHidden) {
            if (this.popupObj) {
                this.popupObj.destroy();
            }
            if (this.tooltipEle) {
                sf.base.setStyleAttribute(this.tooltipEle, { 'display': 'none' });
                var contentElement = document.getElementById(this.ctrlId + PLACEHOLDER);
                if (contentElement) {
                    contentElement.appendChild(this.tooltipEle);
                }
                this.dotnetRef.invokeMethodAsync('CreateTooltip', JSON.stringify(false));
            }
            this.tooltipEle = null;
            this.popupObj = null;
        }
    };
    SfTooltip.prototype.tapHoldHandler = function (evt) {
        this.targetHover(evt.originalEvent);
    };
    SfTooltip.prototype.touchEndHandler = function (e) {
        if (!this.properties.isSticky) {
            this.hideTooltip(this.properties.animation.close);
        }
    };
    SfTooltip.prototype.targetClick = function (e) {
        var target = this.properties.target ? sf.base.closest(e.target, this.properties.target) :
            this.element;
        if (!sf.base.isNullOrUndefined(target)) {
            if (sf.base.getAttributeOrDefault(target, 'data-tooltip-id', null) === null) {
                this.targetHover(e);
            }
            else if (!this.properties.isSticky) {
                this.hideTooltip(this.properties.animation.close, e, target);
            }
        }
    };
    SfTooltip.prototype.restoreElement = function (target) {
        this.unwireMouseEvents(target);
        if (!sf.base.isNullOrUndefined(sf.base.getAttributeOrDefault(target, 'data-content', null))) {
            if (this.hasTitle) {
                sf.base.attributes(target, { 'title': sf.base.getAttributeOrDefault(target, 'data-content', null) });
            }
            target.removeAttribute('data-content');
        }
        this.removeDescribedBy(target);
    };
    SfTooltip.prototype.checkForOpen = function (opensOn, element, e) {
        if (element == null || sf.base.isNullOrUndefined(e)) {
            return false;
        }
        var target = this.properties.target ? sf.base.closest(e.target, this.properties.target) : this.element;
        if (target == null) {
            return false;
        }
        var isOpenable = true;
        if (opensOn === 'Hover') {
            isOpenable = target.matches(':hover');
        }
        else if (opensOn === 'Auto') {
            isOpenable = (target.matches(':hover') || target.matches(':focus'));
        }
        else if (opensOn === 'Focus') {
            isOpenable = target.matches(':focus');
        }
        else if (opensOn === 'Click') {
            if (element === sf.base.closest(e.target, '.' + ROOT) &&
                sf.base.getAttributeOrDefault(target, 'data-tooltip-id', null) === null) {
                isOpenable = true;
            }
            else {
                isOpenable = false;
            }
        }
        else if (opensOn === 'Custom') {
            if (sf.base.getAttributeOrDefault(target, 'data-tooltip-id', null) === null) {
                isOpenable = true;
            }
            else {
                isOpenable = false;
            }
        }
        return isOpenable;
    };
    SfTooltip.prototype.targetHover = function (e) {
        if (!this.checkForOpen(this.properties.opensOn, this.element, e)) {
            return;
        }
        var target = this.properties.target ? sf.base.closest(e.target, this.properties.target) :
            this.element;
        if (sf.base.isNullOrUndefined(target) || sf.base.getAttributeOrDefault(target, 'data-tooltip-id', null) !== null) {
            return;
        }
        var targetList = [].slice.call(document.querySelectorAll('[data-tooltip-id= ' + this.ctrlId + '_content]'));
        for (var _i = 0, targetList_5 = targetList; _i < targetList_5.length; _i++) {
            var target_1 = targetList_5[_i];
            this.restoreElement(target_1);
        }
        this.showTooltip(target, this.properties.animation.open, e);
    };
    SfTooltip.prototype.isHidden = function () {
        return this.tooltipEle ? !this.tooltipEle.classList.contains(POPUP_OPEN) : true;
    };
    SfTooltip.prototype.showTooltip = function (target, showAnimation, e) {
        var _this = this;
        clearTimeout(this.showTimer);
        clearTimeout(this.hideTimer);
        var show = function () {
            _this.isContiniousOpen = !sf.base.isNullOrUndefined(_this.tooltipEle);
            _this.tooltipEventArgs = {
                type: e ? e.type.toString() : null, cancel: false, target: _this.getDomObject('target', target), event: e ? e : null,
                hasText: _this.hasText(), element: _this.getDomObject('tooltipElement', _this.tooltipEle),
                isInteracted: !sf.base.isNullOrUndefined(e), name: 'beforeRender',
                left: e ? _this.getXYValue(e, 'x') : null,
                top: e ? _this.getXYValue(e, 'y') : null
            };
            _this.contentTargetValue = target;
            _this.contentEvent = e;
            _this.contentAnimation = showAnimation;
            _this.isRestrictUpdate = _this.element.eventList.beforeRender && !_this.isHidden();
            _this.element.eventList.beforeRender ? _this.triggerEvent('TriggerBeforeRenderEvent', _this.tooltipEventArgs) :
                _this.beforeRenderCallBack(false);
        };
        this.showTimer = setTimeout(show, this.properties.openDelay);
    };
    SfTooltip.prototype.triggerEvent = function (eventName, args) {
        this.dotnetRef.invokeMethodAsync(eventName, JSON.stringify(args));
    };
    SfTooltip.prototype.beforeRenderCallBack = function (cancel) {
        if (cancel) {
            this.isPopupHidden = true;
            this.clear();
        }
        else {
            this.isPopupHidden = false;
            if (sf.base.isNullOrUndefined(this.tooltipEle)) {
                this.dotnetRef.invokeMethodAsync('CreateTooltip', JSON.stringify(true));
            }
            else if (this.isContiniousOpen && !this.isRestrictUpdate) {
                this.contentUpdated();
            }
            else {
                this.isRestrictUpdate = false;
            }
        }
    };
    SfTooltip.prototype.checkCollision = function (target, x, y) {
        var elePos = {
            left: x, top: y, position: this.properties.position,
            horizontal: this.tooltipPositionX, vertical: this.tooltipPositionY
        };
        var affectedPos = sf.popups.isCollide(this.tooltipEle, (this.properties.target ? this.element : null), x, y);
        if (affectedPos.length > 0) {
            elePos.horizontal = affectedPos.indexOf('left') >= 0 ? RIGHT : affectedPos.indexOf('right') >= 0 ? LEFT :
                this.tooltipPositionX;
            elePos.vertical = affectedPos.indexOf('top') >= 0 ? BOTTOM : affectedPos.indexOf('bottom') >= 0 ? TOP :
                this.tooltipPositionY;
        }
        return elePos;
    };
    SfTooltip.prototype.collisionFlipFit = function (target, x, y) {
        var elePos = this.checkCollision(target, x, y);
        var newpos = elePos.position;
        if (this.tooltipPositionY !== elePos.vertical) {
            newpos = ((this.properties.position.indexOf(BOTTOM) === 0 || this.properties.position.indexOf('Top') === 0) ?
                elePos.vertical + this.tooltipPositionX : this.tooltipPositionX + elePos.vertical);
        }
        if (this.tooltipPositionX !== elePos.horizontal) {
            if (newpos.indexOf(LEFT) === 0) {
                elePos.vertical = (newpos === LEFTTOP || newpos === LEFTCENTER) ? TOP : BOTTOM;
                newpos = (elePos.vertical + LEFT);
            }
            if (newpos.indexOf(RIGHT) === 0) {
                elePos.vertical = (newpos === RIGHTTOP || newpos === RIGHTCENTER) ? TOP : BOTTOM;
                newpos = (elePos.vertical + RIGHT);
            }
            elePos.horizontal = this.tooltipPositionX;
        }
        this.tooltipEventArgs = {
            type: null, cancel: false, target: this.getDomObject('target', target), event: null, isInteracted: false,
            hasText: this.hasText(), element: this.getDomObject('tooltipElement', this.tooltipEle),
            collidedPosition: newpos, name: 'beforeCollision', left: null, top: null
        };
        this.isRestrictUpdate = this.element.eventList.beforeCollision && !this.isHidden();
        if (this.element.eventList.beforeCollision) {
            this.triggerEvent('TriggerBeforeCollisionEvent', this.tooltipEventArgs);
        }
        if (elePos.position !== newpos) {
            var pos = sf.popups.calculatePosition(target, elePos.horizontal, elePos.vertical);
            this.adjustArrow(target, newpos, elePos.horizontal, elePos.vertical);
            var offsetPos = this.calculateTooltipOffset(newpos);
            offsetPos.top -= (('TopBottom'.indexOf(this.properties.position.split(/(?=[A-Z])/)[0]) !== -1) &&
                ('TopBottom'.indexOf(newpos.split(/(?=[A-Z])/)[0]) !== -1)) ? (2 * this.properties.offsetY) : 0;
            offsetPos.left -= (('RightLeft'.indexOf(this.properties.position.split(/(?=[A-Z])/)[0]) !== -1) &&
                ('RightLeft'.indexOf(newpos.split(/(?=[A-Z])/)[0]) !== -1)) ? (2 * this.properties.offsetX) : 0;
            elePos.position = newpos;
            elePos.left = pos.left + offsetPos.left;
            elePos.top = pos.top + offsetPos.top;
        }
        else {
            this.adjustArrow(target, newpos, elePos.horizontal, elePos.vertical);
        }
        var eleOffset = { left: elePos.left, top: elePos.top };
        var left = sf.popups.fit(this.tooltipEle, (this.properties.target ? this.element : null), { X: true, Y: false }, eleOffset).left;
        sf.base.setStyleAttribute(this.tooltipEle, { 'display': 'block' });
        if (this.properties.showTipPointer && (newpos.indexOf('Bottom') === 0 || newpos.indexOf('Top') === 0)) {
            var arrowEle = this.tooltipEle.querySelector('.' + ARROW_TIP);
            var arrowleft = parseInt(arrowEle.style.left, 10) - (left - elePos.left);
            if (arrowleft < 0) {
                arrowleft = 0;
            }
            else if ((arrowleft + arrowEle.offsetWidth) > this.tooltipEle.clientWidth) {
                arrowleft = this.tooltipEle.clientWidth - arrowEle.offsetWidth;
            }
            sf.base.setStyleAttribute(arrowEle, { 'left': (arrowleft.toString() + 'px') });
        }
        sf.base.setStyleAttribute(this.tooltipEle, { 'display': '' });
        eleOffset.left = left;
        return eleOffset;
    };
    SfTooltip.prototype.hideTooltip = function (hideAnimation, e, targetElement) {
        var _this = this;
        clearTimeout(this.hideTimer);
        clearTimeout(this.showTimer);
        var hide = function () {
            if (_this.checkForOpen(_this.properties.opensOn, _this.element, e)) {
                return;
            }
            var target;
            if (e) {
                target = _this.properties.target ? (targetElement || e.target) : _this.element;
            }
            else {
                target = document.querySelector('[data-tooltip-id= ' + _this.ctrlId + '_content]');
            }
            _this.tooltipEventArgs = {
                type: e ? e.type.toString() : null, cancel: false, target: _this.getDomObject('target', target), event: e ? e : null,
                element: _this.getDomObject('tooltipElement', _this.tooltipEle), hasText: _this.hasText(),
                isInteracted: !sf.base.isNullOrUndefined(e), name: 'beforeClose', collidedPosition: null,
                left: e ? _this.getXYValue(e, 'x') : null,
                top: e ? _this.getXYValue(e, 'y') : null
            };
            _this.beforeCloseTarget = target;
            _this.beforeCloseAnimation = hideAnimation;
            _this.isRestrictUpdate = _this.element.eventList.beforeClose && !_this.isHidden();
            _this.element.eventList.beforeClose ? _this.triggerEvent('TriggerBeforeCloseEvent', _this.tooltipEventArgs) :
                _this.beforeCloseCallBack(false);
        };
        this.hideTimer = setTimeout(hide, this.properties.closeDelay);
    };
    SfTooltip.prototype.beforeCloseCallBack = function (cancel) {
        if (!cancel) {
            var proxy_1 = this;
            var hide = function () {
                proxy_1.popupHide(proxy_1.beforeCloseAnimation, proxy_1.beforeCloseTarget);
            };
            if (this.popupObj) {
                this.popupHide(this.beforeCloseAnimation, this.beforeCloseTarget);
            }
            else {
                setTimeout(hide, 200);
            }
        }
        else {
            this.isPopupHidden = false;
        }
    };
    SfTooltip.prototype.popupHide = function (hideAnimation, target) {
        if (target) {
            this.restoreElement(target);
        }
        this.isPopupHidden = true;
        var closeAnimation = {
            name: hideAnimation.effect,
            duration: hideAnimation.duration,
            delay: hideAnimation.delay,
            timingFunction: 'easeIn'
        };
        if (hideAnimation.effect === 'None') {
            closeAnimation = undefined;
        }
        if (this.popupObj) {
            this.popupObj.hide(closeAnimation);
        }
    };
    SfTooltip.prototype.calculateTooltipOffset = function (position) {
        var pos = { top: 0, left: 0 };
        var tooltipEleWidth = this.tooltipEle.offsetWidth;
        var tooltipEleHeight = this.tooltipEle.offsetHeight;
        var arrowEle = this.tooltipEle.querySelector('.' + ARROW_TIP);
        var tipWidth = arrowEle ? arrowEle.offsetWidth : 0;
        var tipHeight = arrowEle ? arrowEle.offsetHeight : 0;
        var tipAdjust = (this.properties.showTipPointer ? SHOW_POINTER_TIP_GAP : HIDE_POINTER_TIP_GAP);
        var tipHeightAdjust = (tipHeight / 2) + POINTER_ADJUST + (this.tooltipEle.offsetHeight - this.tooltipEle.clientHeight);
        var tipWidthAdjust = (tipWidth / 2) + POINTER_ADJUST + (this.tooltipEle.offsetWidth - this.tooltipEle.clientWidth);
        if (this.properties.mouseTrail) {
            tipAdjust += MOUSE_TRAIL_GAP;
        }
        switch (position) {
            case RIGHTTOP:
                pos.left += tipWidth + tipAdjust;
                pos.top -= tooltipEleHeight - tipHeightAdjust;
                break;
            case RIGHTCENTER:
                pos.left += tipWidth + tipAdjust;
                pos.top -= (tooltipEleHeight / 2);
                break;
            case RIGHTBOTTOM:
                pos.left += tipWidth + tipAdjust;
                pos.top -= (tipHeightAdjust);
                break;
            case BOTTOMRIGHT:
                pos.top += (tipHeight + tipAdjust);
                pos.left -= (tipWidthAdjust);
                break;
            case BOTTOMCENTER:
                pos.top += (tipHeight + tipAdjust);
                pos.left -= (tooltipEleWidth / 2);
                break;
            case BOTTOMLEFT:
                pos.top += (tipHeight + tipAdjust);
                pos.left -= (tooltipEleWidth - tipWidthAdjust);
                break;
            case LEFTBOTTOM:
                pos.left -= (tipWidth + tooltipEleWidth + tipAdjust);
                pos.top -= (tipHeightAdjust);
                break;
            case LEFTCENTER:
                pos.left -= (tipWidth + tooltipEleWidth + tipAdjust);
                pos.top -= (tooltipEleHeight / 2);
                break;
            case LEFTTOP:
                pos.left -= (tipWidth + tooltipEleWidth + tipAdjust);
                pos.top -= (tooltipEleHeight - tipHeightAdjust);
                break;
            case TOPLEFT:
                pos.top -= (tooltipEleHeight + tipHeight + tipAdjust);
                pos.left -= (tooltipEleWidth - tipWidthAdjust);
                break;
            case TOPRIGHT:
                pos.top -= (tooltipEleHeight + tipHeight + tipAdjust);
                pos.left -= (tipWidthAdjust);
                break;
            default:
                pos.top -= (tooltipEleHeight + tipHeight + tipAdjust);
                pos.left -= (tooltipEleWidth / 2);
                break;
        }
        pos.left += this.properties.offsetX;
        pos.top += this.properties.offsetY;
        return pos;
    };
    SfTooltip.prototype.setTipClass = function (position) {
        if (position.indexOf(RIGHT) === 0) {
            this.tipClass = TIP_LEFT;
        }
        else if (position.indexOf(BOTTOM) === 0) {
            this.tipClass = TIP_TOP;
        }
        else if (position.indexOf(LEFT) === 0) {
            this.tipClass = TIP_RIGHT;
        }
        else {
            this.tipClass = TIP_BOTTOM;
        }
    };
    SfTooltip.prototype.updateTipPosition = function (position) {
        var selEle = this.tooltipEle.querySelectorAll('.' + ARROW_TIP + ',.' + ARROW_TIP_OUTER + ',.' + ARROW_TIP_INNER);
        var removeList = [TIP_BOTTOM, TIP_TOP, TIP_LEFT, TIP_RIGHT];
        sf.base.removeClass(selEle, removeList);
        this.setTipClass(position);
        sf.base.addClass(selEle, this.tipClass);
    };
    SfTooltip.prototype.adjustArrow = function (target, position, tooltipPositionX, tooltipPositionY) {
        if (this.properties.showTipPointer === false) {
            return;
        }
        this.updateTipPosition(position);
        var leftValue;
        var topValue;
        sf.base.setStyleAttribute(this.tooltipEle, { 'display': 'block' });
        var tooltipWidth = this.tooltipEle.clientWidth;
        var tooltipHeight = this.tooltipEle.clientHeight;
        var arrowEle = this.tooltipEle.querySelector('.' + ARROW_TIP);
        var arrowInnerELe = this.tooltipEle.querySelector('.' + ARROW_TIP_INNER);
        var tipWidth = arrowEle.offsetWidth;
        var tipHeight = arrowEle.offsetHeight;
        sf.base.setStyleAttribute(this.tooltipEle, { 'display': '' });
        if (this.tipClass === TIP_BOTTOM || this.tipClass === TIP_TOP) {
            if (this.tipClass === TIP_BOTTOM) {
                topValue = '99.9%';
                sf.base.setStyleAttribute(arrowInnerELe, { 'top': ('-' + (tipHeight - 2) + 'px') });
            }
            else {
                topValue = -(tipHeight - 1) + 'px';
                sf.base.setStyleAttribute(arrowInnerELe, { 'top': ('-' + (tipHeight - 6) + 'px') });
            }
            if (target) {
                var tipPosExclude = tooltipPositionX !== 'Center' || (tooltipWidth > target.offsetWidth) ||
                    this.properties.mouseTrail;
                if ((tipPosExclude && tooltipPositionX === 'Left') || (!tipPosExclude && this.properties.tipPointerPosition === END)) {
                    leftValue = (tooltipWidth - tipWidth - POINTER_ADJUST) + 'px';
                }
                else if ((tipPosExclude && tooltipPositionX === 'Right') ||
                    (!tipPosExclude && this.properties.tipPointerPosition === START)) {
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
                sf.base.setStyleAttribute(arrowInnerELe, { 'left': ('-' + (tipWidth - 2) + 'px') });
            }
            else {
                leftValue = -(tipWidth - 1) + 'px';
                sf.base.setStyleAttribute(arrowInnerELe, { 'left': ((-(tipWidth) + (tipWidth - 2)) + 'px') });
            }
            var tipPosExclude = tooltipPositionY !== CENTER || (tooltipHeight > target.offsetHeight) || this.properties.mouseTrail;
            if ((tipPosExclude && tooltipPositionY === TOP) || (!tipPosExclude && this.properties.tipPointerPosition === END)) {
                topValue = (tooltipHeight - tipHeight - POINTER_ADJUST) + 'px';
            }
            else if ((tipPosExclude && tooltipPositionY === BOTTOM) || (!tipPosExclude && this.properties.tipPointerPosition === START)) {
                topValue = POINTER_ADJUST + 'px';
            }
            else {
                topValue = ((tooltipHeight / 2) - (tipHeight / 2)) + 'px';
            }
        }
        sf.base.setStyleAttribute(arrowEle, { 'top': topValue, 'left': leftValue });
    };
    SfTooltip.prototype.onMouseOut = function (e) {
        var enteredElement = e.relatedTarget;
        if (enteredElement && !this.properties.mouseTrail) {
            var checkForTooltipElement = sf.base.closest(enteredElement, "." + TOOLTIP_WRAP + "." + POPUP_LIB + "." + POPUP_ROOT);
            if (checkForTooltipElement) {
                sf.base.EventHandler.add(checkForTooltipElement, 'mouseleave', this.tooltipElementMouseOut, this);
                this.unwireMouseEvents(e.target);
            }
            else {
                this.hideTooltip(this.properties.animation.close, e, this.findTarget());
                if (this.properties.closeDelay === 0) {
                    this.clear();
                }
            }
        }
        else {
            this.hideTooltip(this.properties.animation.close, e, this.findTarget());
            this.clear();
        }
    };
    SfTooltip.prototype.tooltipElementMouseOut = function (e) {
        this.hideTooltip(this.properties.animation.close, e, this.findTarget());
        sf.base.EventHandler.remove(this.element, 'mouseleave', this.tooltipElementMouseOut);
        this.clear();
    };
    SfTooltip.prototype.onMouseMove = function (event) {
        if (!this.tooltipEle) {
            return;
        }
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
        this.adjustArrow(event.target, this.properties.position, this.tooltipPositionX, this.tooltipPositionY);
        var pos = this.calculateTooltipOffset(this.properties.position);
        var x = eventPageX + pos.left + this.properties.offsetX;
        var y = eventPageY + pos.top + this.properties.offsetY;
        var elePos = this.checkCollision(event.target, x, y);
        if (this.tooltipPositionX !== elePos.horizontal || this.tooltipPositionY !== elePos.vertical) {
            var newpos = (this.properties.position.indexOf(BOTTOM) === 0 || this.properties.position.indexOf(TOP) === 0) ?
                elePos.vertical + elePos.horizontal : elePos.horizontal + elePos.vertical;
            elePos.position = newpos;
            this.adjustArrow(event.target, elePos.position, elePos.horizontal, elePos.vertical);
            var colpos = this.calculateTooltipOffset(elePos.position);
            elePos.left = eventPageX + colpos.left - this.properties.offsetX;
            elePos.top = eventPageY + colpos.top - this.properties.offsetY;
        }
        sf.base.setStyleAttribute(this.tooltipEle, { 'left': (elePos.left + 'px'), 'top': (elePos.top + 'px') });
    };
    SfTooltip.prototype.keyDown = function (event) {
        if (this.tooltipEle && event.keyCode === 27) {
            this.hideTooltip(this.properties.animation.close);
        }
    };
    SfTooltip.prototype.touchEnd = function (e) {
        if (this.tooltipEle && sf.base.closest(e.target, '.' + ROOT) === null) {
            this.hideTooltip(this.properties.animation.close);
        }
    };
    SfTooltip.prototype.scrollHandler = function (e) {
        if (this.tooltipEle) {
            if (!(sf.base.closest(e.target, "." + TOOLTIP_WRAP + "." + POPUP_LIB + "." + POPUP_ROOT))) {
                this.hideTooltip(this.properties.animation.close);
            }
        }
    };
    SfTooltip.prototype.renderContent = function (target) {
        var title = sf.base.getAttributeOrDefault(target, 'title', null);
        var dataTitle = sf.base.getAttributeOrDefault(target, 'data-title', null);
        if (!sf.base.isNullOrUndefined(title) && target) {
            sf.base.attributes(target, { 'data-content': title });
            this.hasTitle = true;
            target.removeAttribute('title');
        }
        else if (!sf.base.isNullOrUndefined(dataTitle) && target) {
            sf.base.attributes(target, { 'data-content': dataTitle });
        }
        if (!this.properties.content) {
            var tooltipContent = this.tooltipEle.querySelector('.' + TIPCONTENT);
            tooltipContent.innerText = target.getAttribute('data-content');
        }
    };
    SfTooltip.prototype.setHeigthWidth = function (widthValue, heightValue, target) {
        if (this.tooltipEle) {
            sf.base.setStyleAttribute(this.tooltipEle, { 'height': heightValue, 'width': widthValue });
        }
        if (target && this.tooltipEle.style.width !== 'auto') {
            this.tooltipEle.style.maxWidth = widthValue;
        }
    };
    SfTooltip.prototype.contentUpdated = function () {
        if (sf.base.isNullOrUndefined(this.tooltipEle)) {
            this.ctrlId = this.element.id;
            this.tooltipEle = document.querySelector('#' + this.ctrlId + CONTENT);
            if (this.tooltipEle) {
                sf.base.setStyleAttribute(this.tooltipEle, { 'position': 'absolute' });
                this.setHeigthWidth(sf.base.formatUnit(this.properties.width), sf.base.formatUnit(this.properties.height), this.contentTargetValue);
                if (this.contentTargetValue) {
                    if (sf.base.Browser.isDevice) {
                        sf.base.addClass([this.tooltipEle], BIGGER);
                    }
                    document.body.appendChild(this.tooltipEle);
                    sf.base.removeClass([this.tooltipEle], HIDDDEN);
                    this.addDescribedBy(this.contentTargetValue, this.ctrlId + CONTENT);
                    this.renderContent(this.contentTargetValue);
                    sf.base.addClass([this.tooltipEle], POPUP_OPEN);
                    this.renderPopup(this.contentTargetValue);
                    var pos = this.properties.position;
                    this.adjustArrow(this.contentTargetValue, pos, this.tooltipPositionX, this.tooltipPositionY);
                    sf.base.Animation.stop(this.tooltipEle);
                    this.reposition(this.contentTargetValue);
                    this.afterContentRender();
                }
            }
        }
        else {
            if (!this.isContiniousOpen || this.isRestrictUpdate) {
                return;
            }
            sf.base.addClass([this.tooltipEle], POPUP_OPEN);
            document.body.appendChild(this.tooltipEle);
            if (this.contentTargetValue) {
                this.renderPopup(this.contentTargetValue);
                var pos = this.properties.position;
                this.adjustArrow(this.contentTargetValue, pos, this.tooltipPositionX, this.tooltipPositionY);
                this.addDescribedBy(this.contentTargetValue, this.ctrlId + '_content');
                this.renderContent(this.contentTargetValue);
                sf.base.Animation.stop(this.tooltipEle);
                this.reposition(this.contentTargetValue);
                this.afterContentRender();
            }
        }
    };
    SfTooltip.prototype.afterContentRender = function () {
        sf.base.removeClass([this.tooltipEle], POPUP_OPEN);
        sf.base.addClass([this.tooltipEle], POPUP_CLOSE);
        this.tooltipEventArgs = {
            type: this.contentEvent ? this.contentEvent.type.toString() : null, isInteracted: !sf.base.isNullOrUndefined(this.contentEvent),
            hasText: this.hasText(), target: this.getDomObject('target', this.contentTargetValue), name: 'beforeOpen', cancel: false,
            event: this.contentEvent ? this.contentEvent : null, element: this.getDomObject('tooltipElement', this.tooltipEle),
            left: this.contentEvent ? this.getXYValue(this.contentEvent, 'x') : null, top: this.contentEvent ?
                this.getXYValue(this.contentEvent, 'y') : null
        };
        this.isRestrictUpdate = this.element.eventList.beforeOpen && !this.isHidden();
        this.element.eventList.beforeOpen ? this.triggerEvent('TriggerBeforeOpenEvent', this.tooltipEventArgs) :
            this.beforeOpenCallBack(false);
    };
    SfTooltip.prototype.beforeOpenCallBack = function (cancel) {
        if (cancel) {
            this.isPopupHidden = true;
            if (this.contentTargetValue) {
                this.popupHide(this.properties.animation.close, this.contentTargetValue);
            }
        }
        else {
            var openAnimation = {
                name: this.contentAnimation.effect,
                duration: this.contentAnimation.duration,
                delay: this.contentAnimation.delay,
                timingFunction: 'easeOut'
            };
            if (this.contentAnimation.effect === 'None') {
                openAnimation = undefined;
            }
            if (this.popupObj) {
                this.popupObj.show(openAnimation, this.contentTargetValue);
            }
        }
        if (this.contentEvent) {
            this.wireMouseEvents(this.contentEvent, this.contentTargetValue);
        }
        this.contentTargetValue = this.contentEvent = this.contentAnimation = null;
    };
    SfTooltip.prototype.reposition = function (target) {
        if (!this.tooltipEle) {
            return;
        }
        var elePos = this.getTooltipPosition(target);
        this.popupObj.position = { X: elePos.left, Y: elePos.top };
        this.popupObj.dataBind();
    };
    SfTooltip.prototype.renderPopup = function (target) {
        var elePos = this.properties.mouseTrail ? { top: 0, left: 0 } : this.getTooltipPosition(target);
        this.tooltipEle.classList.remove(POPUP_LIB);
        this.popupObj = new sf.popups.Popup(this.tooltipEle, {
            height: this.properties.height,
            width: this.properties.width,
            position: { X: elePos.left, Y: elePos.top },
            enableRtl: this.properties.enableRtl,
            open: this.openPopupHandler.bind(this),
            close: this.closePopupHandler.bind(this)
        });
    };
    SfTooltip.prototype.openPopupHandler = function () {
        if (!this.properties.mouseTrail) {
            this.reposition(this.findTarget());
        }
        this.tooltipEventArgs.name = 'Opened';
        this.isRestrictUpdate = this.element.eventList.opened && !this.isHidden();
        if (this.element.eventList.opened) {
            this.triggerEvent('TriggerOpenedEvent', this.tooltipEventArgs);
        }
    };
    SfTooltip.prototype.closePopupHandler = function () {
        this.clear();
        this.tooltipEventArgs.name = 'Closed';
        this.isRestrictUpdate = this.element.eventList.closed && !this.isHidden();
        if (this.element.eventList.closed) {
            this.triggerEvent('TriggerClosedEvent', this.tooltipEventArgs);
        }
    };
    SfTooltip.prototype.getTooltipPosition = function (target) {
        sf.base.setStyleAttribute(this.tooltipEle, { 'display': 'block' });
        var pos = sf.popups.calculatePosition(target, this.tooltipPositionX, this.tooltipPositionY);
        var offsetPos = this.calculateTooltipOffset(this.properties.position);
        var elePos = this.collisionFlipFit(target, pos.left + offsetPos.left, pos.top + offsetPos.top);
        sf.base.setStyleAttribute(this.tooltipEle, { 'display': '' });
        return elePos;
    };
    SfTooltip.prototype.getDomObject = function (value, element) {
        // tslint:disable-next-line
        return element ? window.sfBlazor.getDomObject(value, element) : null;
    };
    SfTooltip.prototype.hasText = function () {
        return this.tooltipEle ? (this.tooltipEle.innerText.trim() === '' ? false : true) : false;
    };
    SfTooltip.prototype.getXYValue = function (e, direction) {
        var touchList = e.changedTouches;
        var value;
        if (direction === 'x') {
            value = touchList ? touchList[0].clientX : e.clientX;
        }
        else {
            value = touchList ? touchList[0].clientY : e.clientY;
        }
        if (!value && e.type === 'focus' && e.target) {
            var rect = e.target.getBoundingClientRect();
            value = rect ? (direction === 'x' ? rect.left : rect.top) : null;
        }
        return Math.ceil(value);
    };
    SfTooltip.prototype.destroy = function () {
        if (this.tooltipEle) {
            var placeholder = document.querySelector('#' + this.ctrlId + PLACEHOLDER);
            if (placeholder) {
                placeholder.appendChild(this.tooltipEle);
            }
        }
        if (this.popupObj) {
            this.popupObj.destroy();
        }
        sf.base.removeClass([this.element], ROOT);
        this.unwireEvents(this.properties.opensOn);
        this.unwireMouseEvents(this.element);
        this.tooltipEle = null;
        this.popupObj = null;
    };
    return SfTooltip;
}());
// tslint:disable-next-line
var Tooltip = {
    wireEvents: function (element, dotnetRef, properties, eventList) {
        this.updateAnimation(properties.animation);
        new SfTooltip(element, dotnetRef, properties, eventList);
        if (this.isValid(element)) {
            element.blazor__instance.formatPosition();
            element.blazor__instance.wireEvents(properties.opensOn);
        }
        // tslint:disable-next-line
        window.sfBlazor.renderComplete(element);
    },
    contentUpdated: function (element) {
        if (this.isValid(element)) {
            element.blazor__instance.contentUpdated();
        }
    },
    updateAnimation: function (animation) {
        animation.open.duration = animation.open.duration ? animation.open.duration : undefined;
        animation.close.duration = animation.close.duration ? animation.close.duration : undefined;
    },
    beforeRenderCallBack: function (element, cancel) {
        if (this.isValid(element)) {
            element.blazor__instance.beforeRenderCallBack(cancel);
        }
    },
    beforeOpenCallBack: function (element, cancel) {
        if (this.isValid(element)) {
            element.blazor__instance.beforeOpenCallBack(cancel);
        }
    },
    beforeCloseCallBack: function (element, cancel) {
        if (this.isValid(element)) {
            element.blazor__instance.beforeCloseCallBack(cancel);
        }
    },
    showTooltip: function (element, target, animation, targetProp) {
        if (!this.isValid(element)) {
            return;
        }
        if (targetProp !== null && targetProp !== '' && element.blazor__instance.element.querySelector(targetProp)) {
            target = element.blazor__instance.element.querySelector(targetProp);
        }
        element.blazor__instance.showTooltip(target, animation, null);
    },
    hideTooltip: function (element, animation) {
        if (this.isValid(element)) {
            element.blazor__instance.hideTooltip(animation);
        }
    },
    destroy: function (element) {
        if (this.isValid(element)) {
            element.blazor__instance.destroy();
        }
    },
    refresh: function (element) {
        if (!this.isValid(element)) {
            return;
        }
        var blazInstance = element.blazor__instance;
        if (!blazInstance.isPopupHidden) {
            blazInstance.hideTooltip(blazInstance.properties.animation.close);
        }
        blazInstance.unwireEvents(blazInstance.properties.opensOn);
        blazInstance.wireEvents(blazInstance.properties.opensOn);
    },
    refreshPosition: function (element, targetEle, targetProp) {
        if (!this.isValid(element)) {
            return;
        }
        var instance = element.blazor__instance;
        if (targetEle === null) {
            targetEle = targetProp !== null && targetProp !== '' ? instance.element.querySelector(targetProp) : instance.element;
        }
        instance.reposition(targetEle);
    },
    updateProperties: function (element, completeProps, props) {
        if (!this.isValid(element)) {
            return;
        }
        var blazInstance = element.blazor__instance;
        var prevBlazProp = element.blazor__instance.properties;
        blazInstance.isRestrictUpdate = true;
        if (props.animation) {
            this.updateAnimation(props.animation);
        }
        this.updateAnimation(completeProps.animation);
        if (props.opensOn || !sf.base.isNullOrUndefined(props.isSticky)) {
            blazInstance.unwireEvents(blazInstance.properties.opensOn);
            blazInstance.properties = completeProps;
            blazInstance.wireEvents(blazInstance.properties.opensOn);
        }
        else {
            var target = blazInstance.findTarget();
            if (props.height || props.width) {
                blazInstance.setHeigthWidth(sf.base.formatUnit(props.width), sf.base.formatUnit(props.height), target);
            }
            else if (props.position) {
                blazInstance.isPositionUpdate = true;
            }
            else if (props.offsetX) {
                blazInstance.isOffsetXUpdate = true;
            }
            else if (props.offsetX) {
                blazInstance.isOffsetYUpdate = true;
            }
            if (blazInstance.tooltipEle) {
                if (blazInstance.isPositionUpdate) {
                    var arrowInnerELe = blazInstance.tooltipEle.querySelector('.' + ARROW_TIP_INNER);
                    var arrowEle = blazInstance.tooltipEle.querySelector('.' + ARROW_TIP);
                    sf.base.removeClass([arrowEle], [blazInstance.tipClass]);
                    blazInstance.properties = completeProps;
                    blazInstance.formatPosition();
                    blazInstance.setTipClass(props.position);
                    sf.base.addClass([arrowEle], [blazInstance.tipClass]);
                    sf.base.setStyleAttribute(arrowInnerELe, { 'top': null, 'left': null });
                }
                if (blazInstance.isOffsetXUpdate) {
                    var value = ((parseInt(blazInstance.tooltipEle.style.left, 10) + (props.offsetX - prevBlazProp.offsetX)));
                    sf.base.setStyleAttribute(blazInstance.tooltipEle, { 'left': value.toString() + 'px' });
                }
                if (blazInstance.isOffsetYUpdate) {
                    var value = ((parseInt(blazInstance.tooltipEle.style.top, 10) + (props.offsetY - prevBlazProp.offsetY)));
                    sf.base.setStyleAttribute(blazInstance.tooltipEle, { 'top': value.toString() + 'px' });
                }
                blazInstance.properties = completeProps;
                blazInstance.reposition(target);
            }
            else {
                blazInstance.properties = completeProps;
                if (blazInstance.isPositionUpdate) {
                    blazInstance.formatPosition();
                }
            }
            blazInstance.isOffsetYUpdate = false;
            blazInstance.isOffsetXUpdate = false;
            blazInstance.isPositionUpdate = false;
            blazInstance.isRestrictUpdate = false;
        }
    },
    isValid: function (element) {
        return (element && element.blazor__instance) ? true : false;
    }
};

return Tooltip;

}());
