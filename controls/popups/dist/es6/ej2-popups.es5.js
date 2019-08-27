import { Animation, Browser, ChildProperty, Collection, Complex, Component, Draggable, Event, EventHandler, L10n, NotifyPropertyChanges, Property, Touch, addClass, append, attributes, classList, closest, compile, createElement, detach, formatUnit, getUniqueID, isBlazor, isNullOrUndefined, prepend, remove, removeClass, resetBlazorTemplate, setStyleAttribute, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';

/**
 * Position library
 */
var elementRect;
var popupRect;
var element;
var parentDocument;
var fixedParent = false;
function calculateRelativeBasedPosition(anchor, element) {
    var fixedElement = false;
    var anchorPos = { left: 0, top: 0 };
    var tempAnchor = anchor;
    if (!anchor || !element) {
        return anchorPos;
    }
    if (isNullOrUndefined(element.offsetParent) && element.style.position === 'fixed') {
        fixedElement = true;
    }
    while ((element.offsetParent || fixedElement) && anchor && element.offsetParent !== anchor) {
        anchorPos.left += anchor.offsetLeft;
        anchorPos.top += anchor.offsetTop;
        anchor = anchor.offsetParent;
    }
    anchor = tempAnchor;
    while ((element.offsetParent || fixedElement) && anchor && element.offsetParent !== anchor) {
        anchorPos.left -= anchor.scrollLeft;
        anchorPos.top -= anchor.scrollTop;
        anchor = anchor.parentElement;
    }
    return anchorPos;
}
function calculatePosition(currentElement, positionX, positionY, parentElement, targetValues) {
    (positionY + positionX === 'topright') ? popupRect = undefined : popupRect = targetValues;
    popupRect = targetValues;
    fixedParent = parentElement ? true : false;
    if (!currentElement) {
        return { left: 0, top: 0 };
    }
    if (!positionX) {
        positionX = 'left';
    }
    if (!positionY) {
        positionY = 'top';
    }
    parentDocument = currentElement.ownerDocument;
    element = currentElement;
    var pos = { left: 0, top: 0 };
    return updatePosition(positionX.toLowerCase(), positionY.toLowerCase(), pos);
}
function setPosx(value, pos) {
    pos.left = value;
}
function setPosy(value, pos) {
    pos.top = value;
}
function updatePosition(posX, posY, pos) {
    elementRect = element.getBoundingClientRect();
    switch (posY + posX) {
        case 'topcenter':
            setPosx(getElementHCenter(), pos);
            setPosy(getElementTop(), pos);
            break;
        case 'topright':
            setPosx(getElementRight(), pos);
            setPosy(getElementTop(), pos);
            break;
        case 'centercenter':
            setPosx(getElementHCenter(), pos);
            setPosy(getElementVCenter(), pos);
            break;
        case 'centerright':
            setPosx(getElementRight(), pos);
            setPosy(getElementVCenter(), pos);
            break;
        case 'centerleft':
            setPosx(getElementLeft(), pos);
            setPosy(getElementVCenter(), pos);
            break;
        case 'bottomcenter':
            setPosx(getElementHCenter(), pos);
            setPosy(getElementBottom(), pos);
            break;
        case 'bottomright':
            setPosx(getElementRight(), pos);
            setPosy(getElementBottom(), pos);
            break;
        case 'bottomleft':
            setPosx(getElementLeft(), pos);
            setPosy(getElementBottom(), pos);
            break;
        default:
        case 'topleft':
            setPosx(getElementLeft(), pos);
            setPosy(getElementTop(), pos);
            break;
    }
    return pos;
}
function getBodyScrollTop() {
    return parentDocument.documentElement.scrollTop || parentDocument.body.scrollTop;
}
function getBodyScrollLeft() {
    return parentDocument.documentElement.scrollLeft || parentDocument.body.scrollLeft;
}
function getElementBottom() {
    return fixedParent ? elementRect.bottom : elementRect.bottom + getBodyScrollTop();
}
function getElementVCenter() {
    return getElementTop() + (elementRect.height / 2);
}
function getElementTop() {
    return fixedParent ? elementRect.top : elementRect.top + getBodyScrollTop();
}
function getElementLeft() {
    return elementRect.left + getBodyScrollLeft();
}
function getElementRight() {
    return elementRect.right + getBodyScrollLeft() - (popupRect ? popupRect.width : 0);
}
function getElementHCenter() {
    return getElementLeft() + (elementRect.width / 2);
}

/**
 * Collision module.
 */
var parentDocument$1;
var targetContainer;
function fit(element, viewPortElement, axis, position) {
    if (viewPortElement === void 0) { viewPortElement = null; }
    if (axis === void 0) { axis = { X: false, Y: false }; }
    if (!axis.Y && !axis.X) {
        return { left: 0, top: 0 };
    }
    var elemData = element.getBoundingClientRect();
    targetContainer = viewPortElement;
    parentDocument$1 = element.ownerDocument;
    if (!position) {
        position = calculatePosition(element, 'left', 'top');
    }
    if (axis.X) {
        var containerWidth = targetContainer ? getTargetContainerWidth() : getViewPortWidth();
        var containerLeft = ContainerLeft();
        var containerRight = ContainerRight();
        var overLeft = containerLeft - position.left;
        var overRight = position.left + elemData.width - containerRight;
        if (elemData.width > containerWidth) {
            if (overLeft > 0 && overRight <= 0) {
                position.left = containerRight - elemData.width;
            }
            else if (overRight > 0 && overLeft <= 0) {
                position.left = containerLeft;
            }
            else {
                position.left = overLeft > overRight ? (containerRight - elemData.width) : containerLeft;
            }
        }
        else if (overLeft > 0) {
            position.left += overLeft;
        }
        else if (overRight > 0) {
            position.left -= overRight;
        }
    }
    if (axis.Y) {
        var containerHeight = targetContainer ? getTargetContainerHeight() : getViewPortHeight();
        var containerTop = ContainerTop();
        var containerBottom = ContainerBottom();
        var overTop = containerTop - position.top;
        var overBottom = position.top + elemData.height - containerBottom;
        if (elemData.height > containerHeight) {
            if (overTop > 0 && overBottom <= 0) {
                position.top = containerBottom - elemData.height;
            }
            else if (overBottom > 0 && overTop <= 0) {
                position.top = containerTop;
            }
            else {
                position.top = overTop > overBottom ? (containerBottom - elemData.height) : containerTop;
            }
        }
        else if (overTop > 0) {
            position.top += overTop;
        }
        else if (overBottom > 0) {
            position.top -= overBottom;
        }
    }
    return position;
}
function isCollide(element, viewPortElement, x, y) {
    if (viewPortElement === void 0) { viewPortElement = null; }
    var elemOffset = calculatePosition(element, 'left', 'top');
    if (x) {
        elemOffset.left = x;
    }
    if (y) {
        elemOffset.top = y;
    }
    var data = [];
    targetContainer = viewPortElement;
    parentDocument$1 = element.ownerDocument;
    var elementRect = element.getBoundingClientRect();
    var top = elemOffset.top;
    var left = elemOffset.left;
    var right = elemOffset.left + elementRect.width;
    var bottom = elemOffset.top + elementRect.height;
    var yAxis = topCollideCheck(top, bottom);
    var xAxis = leftCollideCheck(left, right);
    if (yAxis.topSide) {
        data.push('top');
    }
    if (xAxis.rightSide) {
        data.push('right');
    }
    if (xAxis.leftSide) {
        data.push('left');
    }
    if (yAxis.bottomSide) {
        data.push('bottom');
    }
    return data;
}
function flip(element, target, offsetX, offsetY, positionX, positionY, viewPortElement, axis, fixedParent) {
    if (viewPortElement === void 0) { viewPortElement = null; }
    if (axis === void 0) { axis = { X: true, Y: true }; }
    if (!target || !element || !positionX || !positionY || (!axis.X && !axis.Y)) {
        return;
    }
    var tEdge = { TL: null,
        TR: null,
        BL: null,
        BR: null };
    var eEdge = {
        TL: null,
        TR: null,
        BL: null,
        BR: null
    };
    var elementRect = element.getBoundingClientRect();
    var pos = {
        posX: positionX, posY: positionY, offsetX: offsetX, offsetY: offsetY, position: { left: 0, top: 0 }
    };
    targetContainer = viewPortElement;
    parentDocument$1 = target.ownerDocument;
    updateElementData(target, tEdge, pos, fixedParent, elementRect);
    setPosition(eEdge, pos, elementRect);
    if (axis.X) {
        leftFlip(target, eEdge, tEdge, pos, elementRect, true);
    }
    if (axis.Y && tEdge.TL.top > -1) {
        topFlip(target, eEdge, tEdge, pos, elementRect, true);
    }
    setPopup(element, pos, elementRect);
}
function setPopup(element, pos, elementRect) {
    var left = 0;
    var top = 0;
    if (element.offsetParent != null
        && (getComputedStyle(element.offsetParent).position === 'absolute' ||
            getComputedStyle(element.offsetParent).position === 'relative')) {
        var data = calculatePosition(element.offsetParent, 'left', 'top', false, elementRect);
        left = data.left;
        top = data.top;
    }
    element.style.top = (pos.position.top + pos.offsetY - (top)) + 'px';
    element.style.left = (pos.position.left + pos.offsetX - (left)) + 'px';
}
function updateElementData(target, edge, pos, fixedParent, elementRect) {
    pos.position = calculatePosition(target, pos.posX, pos.posY, fixedParent, elementRect);
    edge.TL = calculatePosition(target, 'left', 'top', fixedParent, elementRect);
    edge.TR = calculatePosition(target, 'right', 'top', fixedParent, elementRect);
    edge.BR = calculatePosition(target, 'left', 'bottom', fixedParent, elementRect);
    edge.BL = calculatePosition(target, 'right', 'bottom', fixedParent, elementRect);
}
function setPosition(eStatus, pos, elementRect) {
    eStatus.TL = { top: pos.position.top + pos.offsetY, left: pos.position.left + pos.offsetX };
    eStatus.TR = { top: eStatus.TL.top, left: eStatus.TL.left + elementRect.width };
    eStatus.BL = { top: eStatus.TL.top + elementRect.height,
        left: eStatus.TL.left };
    eStatus.BR = { top: eStatus.TL.top + elementRect.height,
        left: eStatus.TL.left + elementRect.width };
}
function leftCollideCheck(left, right) {
    var leftSide = false;
    var rightSide = false;
    if (((left - getBodyScrollLeft$1()) < ContainerLeft())) {
        leftSide = true;
    }
    if (right > ContainerRight()) {
        rightSide = true;
    }
    return { leftSide: leftSide, rightSide: rightSide };
}
function leftFlip(target, edge, tEdge, pos, elementRect, deepCheck) {
    var collideSide = leftCollideCheck(edge.TL.left, edge.TR.left);
    if ((tEdge.TL.left - getBodyScrollLeft$1()) <= ContainerLeft()) {
        collideSide.leftSide = false;
    }
    if (tEdge.TR.left >= ContainerRight()) {
        collideSide.rightSide = false;
    }
    if ((collideSide.leftSide && !collideSide.rightSide) || (!collideSide.leftSide && collideSide.rightSide)) {
        if (pos.posX === 'right') {
            pos.posX = 'left';
        }
        else {
            pos.posX = 'right';
        }
        pos.offsetX = pos.offsetX + elementRect.width;
        pos.offsetX = -1 * pos.offsetX;
        pos.position = calculatePosition(target, pos.posX, pos.posY, false);
        setPosition(edge, pos, elementRect);
        if (deepCheck) {
            leftFlip(target, edge, tEdge, pos, elementRect, false);
        }
    }
}
function topFlip(target, edge, tEdge, pos, elementRect, deepCheck) {
    var collideSide = topCollideCheck(edge.TL.top, edge.BL.top);
    if ((tEdge.TL.top - getBodyScrollTop$1()) <= ContainerTop()) {
        collideSide.topSide = false;
    }
    if (tEdge.BL.top >= ContainerBottom()) {
        collideSide.bottomSide = false;
    }
    if ((collideSide.topSide && !collideSide.bottomSide) || (!collideSide.topSide && collideSide.bottomSide)) {
        if (pos.posY === 'top') {
            pos.posY = 'bottom';
        }
        else {
            pos.posY = 'top';
        }
        pos.offsetY = pos.offsetY + elementRect.height;
        pos.offsetY = -1 * pos.offsetY;
        pos.position = calculatePosition(target, pos.posX, pos.posY, false, elementRect);
        setPosition(edge, pos, elementRect);
        if (deepCheck) {
            topFlip(target, edge, tEdge, pos, elementRect, false);
        }
    }
}
function topCollideCheck(top, bottom) {
    var topSide = false;
    var bottomSide = false;
    if ((top - getBodyScrollTop$1()) < ContainerTop()) {
        topSide = true;
    }
    if (bottom > ContainerBottom()) {
        bottomSide = true;
    }
    return { topSide: topSide, bottomSide: bottomSide };
}
function getTargetContainerWidth() {
    return targetContainer.getBoundingClientRect().width;
}
function getTargetContainerHeight() {
    return targetContainer.getBoundingClientRect().height;
}
function getTargetContainerLeft() {
    return targetContainer.getBoundingClientRect().left;
}
function getTargetContainerTop() {
    return targetContainer.getBoundingClientRect().top;
}
function ContainerTop() {
    if (targetContainer) {
        return getTargetContainerTop();
    }
    return 0;
}
function ContainerLeft() {
    if (targetContainer) {
        return getTargetContainerLeft();
    }
    return 0;
}
function ContainerRight() {
    if (targetContainer) {
        return (getBodyScrollLeft$1() + getTargetContainerLeft() + getTargetContainerWidth());
    }
    return (getBodyScrollLeft$1() + getViewPortWidth());
}
function ContainerBottom() {
    if (targetContainer) {
        return (getBodyScrollTop$1() + getTargetContainerTop() + getTargetContainerHeight());
    }
    return (getBodyScrollTop$1() + getViewPortHeight());
}
function getBodyScrollTop$1() {
    // if(targetContainer)
    //     return targetContainer.scrollTop;
    return parentDocument$1.documentElement.scrollTop || parentDocument$1.body.scrollTop;
}
function getBodyScrollLeft$1() {
    // if(targetContainer)
    //     return targetContainer.scrollLeft;
    return parentDocument$1.documentElement.scrollLeft || parentDocument$1.body.scrollLeft;
}
function getViewPortHeight() {
    return window.innerHeight;
}
function getViewPortWidth() {
    var windowWidth = window.innerWidth;
    var offsetWidth = (isNullOrUndefined(document.documentElement)) ? 0 : document.documentElement.offsetWidth;
    return windowWidth - (windowWidth - offsetWidth);
}

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
/**
 * Specifies the offset position values.
 */
var PositionData = /** @__PURE__ @class */ (function (_super) {
    __extends(PositionData, _super);
    function PositionData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('left')
    ], PositionData.prototype, "X", void 0);
    __decorate([
        Property('top')
    ], PositionData.prototype, "Y", void 0);
    return PositionData;
}(ChildProperty));
// don't use space in classNames
var CLASSNAMES = {
    ROOT: 'e-popup',
    RTL: 'e-rtl',
    OPEN: 'e-popup-open',
    CLOSE: 'e-popup-close'
};
/**
 * Represents the Popup Component
 * ```html
 * <div id="popup" style="position:absolute;height:100px;width:100px;">
 * <div style="margin:35px 25px;">Popup Content</div></div>
 * ```
 * ```typescript
 * <script>
 *   var popupObj = new Popup();
 *   popupObj.appendTo("#popup");
 * </script>
 * ```
 */
var Popup = /** @__PURE__ @class */ (function (_super) {
    __extends(Popup, _super);
    function Popup(element, options) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    Popup.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'width':
                    setStyleAttribute(this.element, { 'width': formatUnit(newProp.width) });
                    break;
                case 'height':
                    setStyleAttribute(this.element, { 'height': formatUnit(newProp.height) });
                    break;
                case 'zIndex':
                    setStyleAttribute(this.element, { 'zIndex': newProp.zIndex });
                    break;
                case 'enableRtl':
                    this.setEnableRtl();
                    break;
                case 'position':
                case 'relateTo':
                    this.refreshPosition();
                    break;
                case 'offsetX':
                    var x = newProp.offsetX - oldProp.offsetX;
                    this.element.style.left = (parseInt(this.element.style.left, 10) + (x)).toString() + 'px';
                    break;
                case 'offsetY':
                    var y = newProp.offsetY - oldProp.offsetY;
                    this.element.style.top = (parseInt(this.element.style.top, 10) + (y)).toString() + 'px';
                    break;
                case 'content':
                    this.setContent();
                    break;
                case 'actionOnScroll':
                    if (newProp.actionOnScroll !== 'none') {
                        this.wireScrollEvents();
                    }
                    else {
                        this.unwireScrollEvents();
                    }
                    break;
            }
        }
    };
    /**
     * gets the Component module name.
     * @private
     */
    Popup.prototype.getModuleName = function () {
        return 'popup';
    };
    /**
     * gets the persisted state properties of the Component.
     */
    Popup.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * To destroy the control.
     */
    Popup.prototype.destroy = function () {
        this.element.classList.remove(CLASSNAMES.ROOT, CLASSNAMES.RTL);
        this.unwireEvents();
        _super.prototype.destroy.call(this);
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    Popup.prototype.render = function () {
        this.element.classList.add(CLASSNAMES.ROOT);
        var styles = {};
        if (this.zIndex !== 1000) {
            styles.zIndex = this.zIndex;
        }
        if (this.width !== 'auto') {
            styles.width = formatUnit(this.width);
        }
        if (this.height !== 'auto') {
            styles.height = formatUnit(this.height);
        }
        setStyleAttribute(this.element, styles);
        this.fixedParent = false;
        this.setEnableRtl();
        this.setContent();
        this.wireEvents();
    };
    Popup.prototype.wireEvents = function () {
        if (Browser.isDevice) {
            EventHandler.add(window, 'orientationchange', this.orientationOnChange, this);
        }
        if (this.actionOnScroll !== 'none') {
            this.wireScrollEvents();
        }
    };
    Popup.prototype.wireScrollEvents = function () {
        if (this.getRelateToElement()) {
            for (var _i = 0, _a = this.getScrollableParent(this.getRelateToElement()); _i < _a.length; _i++) {
                var parent_1 = _a[_i];
                EventHandler.add(parent_1, 'scroll', this.scrollRefresh, this);
            }
        }
    };
    Popup.prototype.unwireEvents = function () {
        if (Browser.isDevice) {
            EventHandler.remove(window, 'orientationchange', this.orientationOnChange);
        }
        if (this.actionOnScroll !== 'none') {
            this.unwireScrollEvents();
        }
    };
    Popup.prototype.unwireScrollEvents = function () {
        if (this.getRelateToElement()) {
            for (var _i = 0, _a = this.getScrollableParent(this.getRelateToElement()); _i < _a.length; _i++) {
                var parent_2 = _a[_i];
                EventHandler.remove(parent_2, 'scroll', this.scrollRefresh);
            }
        }
    };
    Popup.prototype.getRelateToElement = function () {
        var relateToElement = this.relateTo === '' || isNullOrUndefined(this.relateTo) ?
            document.body : this.relateTo;
        this.setProperties({ relateTo: relateToElement }, true);
        return ((typeof this.relateTo) === 'string') ?
            document.querySelector(this.relateTo) : this.relateTo;
    };
    Popup.prototype.scrollRefresh = function (e) {
        if (this.actionOnScroll === 'reposition') {
            if (!(this.element.offsetParent === e.target ||
                (this.element.offsetParent && this.element.offsetParent.tagName === 'BODY' &&
                    e.target.parentElement == null))) {
                this.refreshPosition();
            }
        }
        else if (this.actionOnScroll === 'hide') {
            this.hide();
        }
        if (this.actionOnScroll !== 'none') {
            if (this.getRelateToElement()) {
                var targetVisible = this.isElementOnViewport(this.getRelateToElement(), e.target);
                if (!targetVisible && !this.targetInvisibleStatus) {
                    this.trigger('targetExitViewport');
                    this.targetInvisibleStatus = true;
                }
                else if (targetVisible) {
                    this.targetInvisibleStatus = false;
                }
            }
        }
    };
    /**
     * This method is to get the element visibility on viewport when scroll
     * the page. This method will returns true even though 1 px of element
     * part is in visible.
     */
    Popup.prototype.isElementOnViewport = function (relateToElement, scrollElement) {
        var scrollParents = this.getScrollableParent(relateToElement);
        for (var parent_3 = 0; parent_3 < scrollParents.length; parent_3++) {
            if (this.isElementVisible(relateToElement, scrollParents[parent_3])) {
                continue;
            }
            else {
                return false;
            }
        }
        return true;
    };
    Popup.prototype.isElementVisible = function (relateToElement, scrollElement) {
        var rect = this.checkGetBoundingClientRect(relateToElement);
        if (!rect.height || !rect.width) {
            return false;
        }
        if (!isNullOrUndefined(this.checkGetBoundingClientRect(scrollElement))) {
            var parent_4 = scrollElement.getBoundingClientRect();
            return !(rect.bottom < parent_4.top) &&
                (!(rect.bottom > parent_4.bottom) &&
                    (!(rect.right > parent_4.right) &&
                        !(rect.left < parent_4.left)));
        }
        else {
            var win = window;
            var windowView = {
                top: win.scrollY,
                left: win.scrollX,
                right: win.scrollX + win.outerWidth,
                bottom: win.scrollY + win.outerHeight
            };
            var off = calculatePosition(relateToElement);
            var ele = {
                top: off.top,
                left: off.left,
                right: off.left + rect.width,
                bottom: off.top + rect.height
            };
            var elementView = {
                top: windowView.bottom - ele.top,
                left: windowView.right - ele.left,
                bottom: ele.bottom - windowView.top,
                right: ele.right - windowView.left
            };
            return elementView.top > 0
                && elementView.left > 0
                && elementView.right > 0
                && elementView.bottom > 0;
        }
    };
    /**
     * Initialize the event handler
     * @private
     */
    Popup.prototype.preRender = function () {
        //There is no event handler
    };
    Popup.prototype.setEnableRtl = function () {
        this.reposition();
        this.enableRtl ? this.element.classList.add(CLASSNAMES.RTL) : this.element.classList.remove(CLASSNAMES.RTL);
    };
    Popup.prototype.setContent = function () {
        if (!isNullOrUndefined(this.content)) {
            this.element.innerHTML = '';
            if (typeof (this.content) === 'string') {
                this.element.textContent = this.content;
            }
            else {
                this.element.appendChild(this.content);
            }
        }
    };
    Popup.prototype.orientationOnChange = function () {
        var _this = this;
        setTimeout(function () {
            _this.refreshPosition();
        }, 200);
    };
    /**
     * Based on the `relative` element and `offset` values, `Popup` element position will refreshed.
     */
    Popup.prototype.refreshPosition = function (target, collision) {
        if (!isNullOrUndefined(target)) {
            this.checkFixedParent(target);
        }
        this.reposition();
        if (!collision) {
            this.checkCollision();
        }
    };
    Popup.prototype.reposition = function () {
        var pos;
        var position;
        var relateToElement = this.getRelateToElement();
        if (typeof this.position.X === 'number' && typeof this.position.Y === 'number') {
            pos = { left: this.position.X, top: this.position.Y };
        }
        else if ((typeof this.position.X === 'string' && typeof this.position.Y === 'number') ||
            (typeof this.position.X === 'number' && typeof this.position.Y === 'string')) {
            var display = this.element.style.display;
            var parentDisplay = void 0;
            this.element.style.display = 'block';
            if (this.element.classList.contains('e-dlg-modal')) {
                parentDisplay = this.element.parentElement.style.display;
                this.element.parentElement.style.display = 'block';
            }
            position = this.getAnchorPosition(relateToElement, this.element, this.position, this.offsetX, this.offsetY);
            if (typeof this.position.X === 'string') {
                pos = { left: position.left, top: this.position.Y };
            }
            else {
                pos = { left: this.position.X, top: position.top };
            }
            this.element.style.display = display;
            if (this.element.classList.contains('e-dlg-modal')) {
                this.element.parentElement.style.display = parentDisplay;
            }
        }
        else if (relateToElement) {
            var display = this.element.style.display;
            this.element.style.display = 'block';
            pos = this.getAnchorPosition(relateToElement, this.element, this.position, this.offsetX, this.offsetY);
            this.element.style.display = display;
        }
        else {
            pos = { left: 0, top: 0 };
        }
        if (!isNullOrUndefined(pos)) {
            this.element.style.left = pos.left + 'px';
            this.element.style.top = pos.top + 'px';
        }
    };
    Popup.prototype.checkGetBoundingClientRect = function (ele) {
        var eleRect;
        try {
            eleRect = ele.getBoundingClientRect();
            return eleRect;
        }
        catch (error) {
            return null;
        }
    };
    Popup.prototype.getAnchorPosition = function (anchorEle, ele, position, offsetX, offsetY) {
        var eleRect = this.checkGetBoundingClientRect(ele);
        var anchorRect = this.checkGetBoundingClientRect(anchorEle);
        if (isNullOrUndefined(eleRect) || isNullOrUndefined(anchorRect)) {
            return null;
        }
        var anchor = anchorEle;
        var anchorPos = { left: 0, top: 0 };
        if (ele.offsetParent && ele.offsetParent.tagName === 'BODY' && anchorEle.tagName === 'BODY') {
            anchorPos = calculatePosition(anchorEle);
        }
        else {
            if ((ele.classList.contains('e-dlg-modal') && anchor.tagName !== 'BODY')) {
                ele = ele.parentElement;
            }
            anchorPos = calculateRelativeBasedPosition(anchor, ele);
        }
        switch (position.X) {
            default:
            case 'left':
                break;
            case 'center':
                if ((ele.classList.contains('e-dlg-modal') && anchor.tagName === 'BODY' && this.targetType === 'container')) {
                    anchorPos.left += (window.innerWidth / 2 - eleRect.width / 2);
                }
                else if (this.targetType === 'container') {
                    anchorPos.left += (anchorRect.width / 2 - eleRect.width / 2);
                }
                else {
                    anchorPos.left += (anchorRect.width / 2);
                }
                break;
            case 'right':
                if ((ele.classList.contains('e-dlg-modal') && anchor.tagName === 'BODY' && this.targetType === 'container')) {
                    anchorPos.left += (window.innerWidth - eleRect.width);
                }
                else if (this.targetType === 'container') {
                    anchorPos.left += (anchorRect.width - eleRect.width);
                }
                else {
                    anchorPos.left += (anchorRect.width);
                }
                break;
        }
        switch (position.Y) {
            default:
            case 'top':
                break;
            case 'center':
                if ((ele.classList.contains('e-dlg-modal') && anchor.tagName === 'BODY' && this.targetType === 'container')) {
                    anchorPos.top += (window.innerHeight / 2 - eleRect.height / 2);
                }
                else if (this.targetType === 'container') {
                    anchorPos.top += (anchorRect.height / 2 - eleRect.height / 2);
                }
                else {
                    anchorPos.top += (anchorRect.height / 2);
                }
                break;
            case 'bottom':
                if ((ele.classList.contains('e-dlg-modal') && anchor.tagName === 'BODY' && this.targetType === 'container')) {
                    anchorPos.top += (window.innerHeight - eleRect.height);
                }
                else if (this.targetType === 'container') {
                    anchorPos.top += (anchorRect.height - eleRect.height);
                }
                else {
                    anchorPos.top += (anchorRect.height);
                }
                break;
        }
        anchorPos.left += offsetX;
        anchorPos.top += offsetY;
        return anchorPos;
    };
    Popup.prototype.callFlip = function (param) {
        var relateToElement = this.getRelateToElement();
        flip(this.element, relateToElement, this.offsetX, this.offsetY, this.position.X, this.position.Y, this.viewPortElement, param, this.fixedParent);
    };
    Popup.prototype.callFit = function (param) {
        if (isCollide(this.element, this.viewPortElement).length !== 0) {
            if (isNullOrUndefined(this.viewPortElement)) {
                var data = fit(this.element, this.viewPortElement, param);
                if (param.X) {
                    this.element.style.left = data.left + 'px';
                }
                if (param.Y) {
                    this.element.style.top = data.top + 'px';
                }
            }
            else {
                var elementRect = this.checkGetBoundingClientRect(this.element);
                var viewPortRect = this.checkGetBoundingClientRect(this.viewPortElement);
                if (isNullOrUndefined(elementRect) || isNullOrUndefined(viewPortRect)) {
                    return null;
                }
                if (param && param.Y === true) {
                    if (viewPortRect.top > elementRect.top) {
                        this.element.style.top = '0px';
                    }
                    else if (viewPortRect.bottom < elementRect.bottom) {
                        this.element.style.top = parseInt(this.element.style.top, 10) - (elementRect.bottom - viewPortRect.bottom) + 'px';
                    }
                }
                if (param && param.X === true) {
                    if (viewPortRect.right < elementRect.right) {
                        this.element.style.left = parseInt(this.element.style.left, 10) - (elementRect.right - viewPortRect.right) + 'px';
                    }
                    else if (viewPortRect.left > elementRect.left) {
                        this.element.style.left = parseInt(this.element.style.left, 10) + (viewPortRect.left - elementRect.left) + 'px';
                    }
                }
            }
        }
    };
    Popup.prototype.checkCollision = function () {
        var horz = this.collision.X;
        var vert = this.collision.Y;
        if (horz === 'none' && vert === 'none') {
            return;
        }
        if (horz === 'flip' && vert === 'flip') {
            this.callFlip({ X: true, Y: true });
        }
        else if (horz === 'fit' && vert === 'fit') {
            this.callFit({ X: true, Y: true });
        }
        else {
            if (horz === 'flip') {
                this.callFlip({ X: true, Y: false });
            }
            else if (vert === 'flip') {
                this.callFlip({ Y: true, X: false });
            }
            if (horz === 'fit') {
                this.callFit({ X: true, Y: false });
            }
            else if (vert === 'fit') {
                this.callFit({ X: false, Y: true });
            }
        }
    };
    /**
     * Shows the popup element from screen.
     * @param { AnimationModel | Function } collisionOrAnimationOptions? - To pass animation options or collision function.
     * @param { Function } collision? - To pass the collision function.
     * @param { HTMLElement } relativeElement? - To calculate the zIndex value dynamically.
     */
    Popup.prototype.show = function (animationOptions, relativeElement) {
        var _this = this;
        if (this.zIndex === 1000 || !isNullOrUndefined(relativeElement)) {
            var zIndexElement = (isNullOrUndefined(relativeElement)) ? this.element : relativeElement;
            this.zIndex = getZindexPartial(zIndexElement);
            setStyleAttribute(this.element, { 'zIndex': this.zIndex });
        }
        animationOptions = (!isNullOrUndefined(animationOptions) && typeof animationOptions === 'object') ?
            animationOptions : this.showAnimation;
        if (this.collision.X !== 'none' || this.collision.Y !== 'none') {
            removeClass([this.element], CLASSNAMES.CLOSE);
            addClass([this.element], CLASSNAMES.OPEN);
            this.checkCollision();
            removeClass([this.element], CLASSNAMES.OPEN);
            addClass([this.element], CLASSNAMES.CLOSE);
        }
        if (!isNullOrUndefined(animationOptions)) {
            animationOptions.begin = function () {
                if (!_this.isDestroyed) {
                    removeClass([_this.element], CLASSNAMES.CLOSE);
                    addClass([_this.element], CLASSNAMES.OPEN);
                }
            };
            animationOptions.end = function () {
                if (!_this.isDestroyed) {
                    _this.trigger('open');
                }
            };
            new Animation(animationOptions).animate(this.element);
        }
        else {
            removeClass([this.element], CLASSNAMES.CLOSE);
            addClass([this.element], CLASSNAMES.OPEN);
            this.trigger('open');
        }
    };
    /**
     * Hides the popup element from screen.
     * @param { AnimationModel } animationOptions? - To give the animation options.
     */
    Popup.prototype.hide = function (animationOptions) {
        var _this = this;
        animationOptions = (!isNullOrUndefined(animationOptions) && typeof animationOptions === 'object') ?
            animationOptions : this.hideAnimation;
        if (!isNullOrUndefined(animationOptions)) {
            animationOptions.end = function () {
                if (!_this.isDestroyed) {
                    removeClass([_this.element], CLASSNAMES.OPEN);
                    addClass([_this.element], CLASSNAMES.CLOSE);
                    _this.trigger('close');
                }
            };
            new Animation(animationOptions).animate(this.element);
        }
        else {
            removeClass([this.element], CLASSNAMES.OPEN);
            addClass([this.element], CLASSNAMES.CLOSE);
            this.trigger('close');
        }
    };
    /**
     * Gets scrollable parent elements for the given element.
     * @param { HTMLElement } element - Specify the element to get the scrollable parents of it.
     */
    Popup.prototype.getScrollableParent = function (element) {
        this.checkFixedParent(element);
        return getScrollableParent(element, this.fixedParent);
    };
    Popup.prototype.checkFixedParent = function (element) {
        var parent = element.parentElement;
        while (parent && parent.tagName !== 'HTML') {
            var parentStyle = getComputedStyle(parent);
            if (parentStyle.position === 'fixed' && this.element.offsetParent && this.element.offsetParent.tagName === 'BODY') {
                this.element.style.position = 'fixed';
                this.fixedParent = true;
            }
            parent = parent.parentElement;
            if (isNullOrUndefined(this.element.offsetParent) && parentStyle.position === 'fixed'
                && this.element.style.position === 'fixed') {
                this.fixedParent = true;
            }
        }
    };
    __decorate([
        Property('auto')
    ], Popup.prototype, "height", void 0);
    __decorate([
        Property('auto')
    ], Popup.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], Popup.prototype, "content", void 0);
    __decorate([
        Property('container')
    ], Popup.prototype, "targetType", void 0);
    __decorate([
        Property(null)
    ], Popup.prototype, "viewPortElement", void 0);
    __decorate([
        Property({ X: 'none', Y: 'none' })
    ], Popup.prototype, "collision", void 0);
    __decorate([
        Property('')
    ], Popup.prototype, "relateTo", void 0);
    __decorate([
        Complex({}, PositionData)
    ], Popup.prototype, "position", void 0);
    __decorate([
        Property(0)
    ], Popup.prototype, "offsetX", void 0);
    __decorate([
        Property(0)
    ], Popup.prototype, "offsetY", void 0);
    __decorate([
        Property(1000)
    ], Popup.prototype, "zIndex", void 0);
    __decorate([
        Property(false)
    ], Popup.prototype, "enableRtl", void 0);
    __decorate([
        Property('reposition')
    ], Popup.prototype, "actionOnScroll", void 0);
    __decorate([
        Property(null)
    ], Popup.prototype, "showAnimation", void 0);
    __decorate([
        Property(null)
    ], Popup.prototype, "hideAnimation", void 0);
    __decorate([
        Event()
    ], Popup.prototype, "open", void 0);
    __decorate([
        Event()
    ], Popup.prototype, "close", void 0);
    __decorate([
        Event()
    ], Popup.prototype, "targetExitViewport", void 0);
    Popup = __decorate([
        NotifyPropertyChanges
    ], Popup);
    return Popup;
}(Component));
/**
 * Gets scrollable parent elements for the given element.
 * @param { HTMLElement } element - Specify the element to get the scrollable parents of it.
 * @private
 */
function getScrollableParent(element, fixedParent) {
    var eleStyle = getComputedStyle(element);
    var scrollParents = [];
    var overflowRegex = /(auto|scroll)/;
    var parent = element.parentElement;
    while (parent && parent.tagName !== 'HTML') {
        var parentStyle = getComputedStyle(parent);
        if (!(eleStyle.position === 'absolute' && parentStyle.position === 'static')
            && overflowRegex.test(parentStyle.overflow + parentStyle.overflowY + parentStyle.overflowX)) {
            scrollParents.push(parent);
        }
        parent = parent.parentElement;
    }
    if (!fixedParent) {
        scrollParents.push(document);
    }
    return scrollParents;
}
/**
 * Gets the maximum z-index of the given element.
 * @param { HTMLElement } element - Specify the element to get the maximum z-index of it.
 * @private
 */
function getZindexPartial(element) {
    // upto body traversal
    var parent = element.parentElement;
    var parentZindex = [];
    while (parent) {
        if (parent.tagName !== 'BODY') {
            var index = document.defaultView.getComputedStyle(parent, null).getPropertyValue('z-index');
            var position = document.defaultView.getComputedStyle(parent, null).getPropertyValue('position');
            if (index !== 'auto' && position !== 'static') {
                parentZindex.push(index);
            }
            parent = parent.parentElement;
        }
        else {
            break;
        }
    }
    //Body direct children element traversal
    var childrenZindex = [];
    for (var i = 0; i < document.body.children.length; i++) {
        if (!element.isEqualNode(document.body.children[i])) {
            var index = document.defaultView.getComputedStyle(document.body.children[i], null).getPropertyValue('z-index');
            var position = document.defaultView.getComputedStyle(document.body.children[i], null).getPropertyValue('position');
            if (index !== 'auto' && position !== 'static') {
                childrenZindex.push(index);
            }
        }
    }
    childrenZindex.push('999');
    var siblingsZindex = [];
    if (!isNullOrUndefined(element.parentElement) && element.parentElement.tagName !== 'BODY') {
        var childNodes = [].slice.call(element.parentElement.children);
        for (var i = 0; i < childNodes.length; i++) {
            var index = document.defaultView.getComputedStyle(childNodes[i], null).getPropertyValue('z-index');
            var position = document.defaultView.getComputedStyle(childNodes[i], null).getPropertyValue('position');
            if (index !== 'auto' && position !== 'static') {
                siblingsZindex.push(index);
            }
        }
    }
    var finalValue = parentZindex.concat(childrenZindex, siblingsZindex);
    var currentZindexValue = Math.max.apply(Math, finalValue) + 1;
    // Checking the max-zindex value
    return currentZindexValue > 2147483647 ? 2147483647 : currentZindexValue;
}
/**
 * Gets the maximum z-index of the page.
 * @param { HTMLElement } tagName - Specify the tagName to get the maximum z-index of it.
 * @private
 */
function getMaxZindex(tagName) {
    if (tagName === void 0) { tagName = ['*']; }
    var maxZindex = [];
    for (var i = 0; i < tagName.length; i++) {
        var elements = document.getElementsByTagName(tagName[i]);
        for (var i_1 = 0; i_1 < elements.length; i_1++) {
            var index = document.defaultView.getComputedStyle(elements[i_1], null).getPropertyValue('z-index');
            var position = document.defaultView.getComputedStyle(elements[i_1], null).getPropertyValue('position');
            if (index !== 'auto' && position !== 'static') {
                maxZindex.push(index);
            }
        }
    }
    var currentZindexValue = Math.max.apply(Math, maxZindex) + 1;
    return currentZindexValue > 2147483647 ? 2147483647 : currentZindexValue;
}

/**
 * Popup Components
 */

/**
 * Popup Components
 */

/**
 * Resize library
 */
var elementClass = ['north-west', 'north', 'north-east', 'west', 'east', 'south-west', 'south', 'south-east'];
var targetElement;
var selectedHandler;
var originalWidth = 0;
var originalHeight = 0;
var originalX = 0;
var originalY = 0;
var originalMouseX = 0;
var originalMouseY = 0;
var RESIZE_HANDLER = 'e-resize-handle';
var FOCUSED_HANDLER = 'e-focused-handle';
var RESTRICT_LEFT = ['e-restrict-left'];
var RESIZE_WITHIN_VIEWPORT = 'e-resize-viewport';
var minHeight;
var maxHeight;
var minWidth;
var maxWidth;
var containerElement;
var resizeStart = null;
var resize = null;
var resizeEnd = null;
var resizeWestWidth;
var setLeft = true;
var previousWidth = 0;
var setWidth = true;
function createResize(args) {
    resizeStart = args.resizeBegin;
    resize = args.resizing;
    resizeEnd = args.resizeComplete;
    targetElement = getDOMElement(args.element);
    containerElement = getDOMElement(args.boundary);
    var directions = args.direction.split(' ');
    for (var i = 0; i < directions.length; i++) {
        var resizeHandler = createElement('div', { className: 'e-icons ' + RESIZE_HANDLER + ' ' + 'e-' + directions[i] });
        targetElement.appendChild(resizeHandler);
    }
    minHeight = args.minHeight;
    minWidth = args.minWidth;
    maxWidth = args.maxWidth;
    maxHeight = args.maxHeight;
    wireEvents();
}
function getDOMElement(element) {
    var domElement;
    if (!isNullOrUndefined(element)) {
        if (typeof (element) === 'string') {
            domElement = document.querySelector(element);
        }
        else {
            domElement = element;
        }
    }
    return domElement;
}
function wireEvents() {
    var resizers = targetElement.querySelectorAll('.' + RESIZE_HANDLER);
    for (var i = 0; i < resizers.length; i++) {
        selectedHandler = resizers[i];
        EventHandler.add(selectedHandler, 'mousedown', onMouseDown, this);
        var eventName = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
        EventHandler.add(selectedHandler, eventName, onTouchStart, this);
    }
}
/* istanbul ignore next */
function getEventType(e) {
    return (e.indexOf('mouse') > -1) ? 'mouse' : 'touch';
}
/* istanbul ignore next */
function onMouseDown(e) {
    e.preventDefault();
    targetElement = e.target.parentElement;
    calculateValues();
    originalMouseX = e.pageX;
    originalMouseY = e.pageY;
    e.target.classList.add(FOCUSED_HANDLER);
    if (!isNullOrUndefined(resizeStart)) {
        if (resizeStart(e) === true) {
            return;
        }
    }
    var target = (isNullOrUndefined(containerElement)) ? document : containerElement;
    EventHandler.add(target, 'mousemove', onMouseMove, this);
    EventHandler.add(document, 'mouseup', onMouseUp, this);
    for (var i = 0; i < RESTRICT_LEFT.length; i++) {
        if (targetElement.classList.contains(RESTRICT_LEFT[i])) {
            setLeft = false;
        }
        else {
            setLeft = true;
        }
    }
}
/* istanbul ignore next */
function onMouseUp(e) {
    var touchMoveEvent = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
    var touchEndEvent = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
    var target = (isNullOrUndefined(containerElement)) ? document : containerElement;
    EventHandler.remove(target, 'mousemove', onMouseMove);
    EventHandler.remove(target, touchMoveEvent, onMouseMove);
    var eventName = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
    EventHandler.remove(target, eventName, onMouseMove);
    if (!isNullOrUndefined(document.body.querySelector('.' + FOCUSED_HANDLER))) {
        document.body.querySelector('.' + FOCUSED_HANDLER).classList.remove(FOCUSED_HANDLER);
    }
    if (!isNullOrUndefined(resizeEnd)) {
        resizeEnd(e);
    }
    EventHandler.remove(document, 'mouseup', onMouseUp);
    EventHandler.remove(document, touchEndEvent, onMouseUp);
}
/* istanbul ignore next */
function calculateValues() {
    originalWidth = parseFloat(getComputedStyle(targetElement, null).getPropertyValue('width').replace('px', ''));
    originalHeight = parseFloat(getComputedStyle(targetElement, null).getPropertyValue('height').replace('px', ''));
    originalX = targetElement.getBoundingClientRect().left;
    originalY = targetElement.getBoundingClientRect().top;
}
/* istanbul ignore next */
function onTouchStart(e) {
    targetElement = e.target.parentElement;
    calculateValues();
    originalMouseX = e.touches[0].pageX;
    originalMouseY = e.touches[0].pageY;
    if (!isNullOrUndefined(resizeStart)) {
        if (resizeStart(e) === true) {
            return;
        }
    }
    var touchMoveEvent = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
    var touchEndEvent = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
    var target = (isNullOrUndefined(containerElement)) ? document : containerElement;
    EventHandler.add(target, touchMoveEvent, onMouseMove, this);
    EventHandler.add(document, touchEndEvent, onMouseUp);
}
/* istanbul ignore next */
function onMouseMove(e) {
    if (e.target.classList.contains(RESIZE_HANDLER) && e.target.classList.contains(FOCUSED_HANDLER)) {
        selectedHandler = e.target;
    }
    else if (!isNullOrUndefined(document.body.querySelector('.' + FOCUSED_HANDLER))) {
        selectedHandler = document.body.querySelector('.' + FOCUSED_HANDLER);
    }
    if (!isNullOrUndefined(selectedHandler)) {
        var resizeTowards = '';
        for (var i = 0; i < elementClass.length; i++) {
            if (selectedHandler.classList.contains('e-' + elementClass[i])) {
                resizeTowards = elementClass[i];
            }
        }
        if (!isNullOrUndefined(resize)) {
            resize(e);
        }
        switch (resizeTowards) {
            case 'south':
                resizeSouth(e);
                break;
            case 'north':
                resizeNorth(e);
                break;
            case 'west':
                resizeWest(e);
                break;
            case 'east':
                resizeEast(e);
                break;
            case 'south-east':
                resizeSouth(e);
                resizeEast(e);
                break;
            case 'south-west':
                resizeSouth(e);
                resizeWest(e);
                break;
            case 'north-east':
                resizeNorth(e);
                resizeEast(e);
                break;
            case 'north-west':
                resizeNorth(e);
                resizeWest(e);
                break;
            default: break;
        }
    }
}
/* istanbul ignore next */
function getClientRectValues(element) {
    return element.getBoundingClientRect();
}
/* istanbul ignore next */
// tslint:disable-next-line
function resizeSouth(e) {
    var documentHeight = document.documentElement.clientHeight;
    var calculateValue = false;
    var containerRectValues;
    var currentpageY = (getEventType(e.type) === 'mouse') ? e.pageY : e.touches[0].pageY;
    var targetRectValues = getClientRectValues(targetElement);
    if (!isNullOrUndefined(containerElement)) {
        containerRectValues = getClientRectValues(containerElement);
    }
    if (!isNullOrUndefined(containerElement)) {
        calculateValue = true;
    }
    else if (isNullOrUndefined(containerElement) && ((documentHeight - currentpageY) >= 0 || (targetRectValues.top < 0))) {
        calculateValue = true;
    }
    var calculatedHeight = originalHeight + (currentpageY - originalMouseY);
    calculatedHeight = (calculatedHeight > minHeight) ? calculatedHeight : minHeight;
    var containerTop = 0;
    if (!isNullOrUndefined(containerElement)) {
        containerTop = containerRectValues.top;
    }
    var borderValue = isNullOrUndefined(containerElement) ? 0 : containerElement.offsetHeight - containerElement.clientHeight;
    var topWithoutborder = (targetRectValues.top - containerTop) - (borderValue / 2);
    topWithoutborder = (topWithoutborder < 0) ? 0 : topWithoutborder;
    if (targetRectValues.top > 0 && (topWithoutborder + calculatedHeight) > maxHeight) {
        calculateValue = false;
        if (targetElement.classList.contains(RESIZE_WITHIN_VIEWPORT)) {
            return;
        }
        targetElement.style.height = (maxHeight - parseInt(topWithoutborder.toString(), 10)) + 'px';
        return;
    }
    var targetTop = 0;
    if (calculateValue) {
        if (targetRectValues.top < 0 && (documentHeight + (targetRectValues.height + targetRectValues.top) > 0)) {
            targetTop = targetRectValues.top;
            if ((calculatedHeight + targetTop) <= 30) {
                calculatedHeight = (targetRectValues.height - (targetRectValues.height + targetRectValues.top)) + 30;
            }
        }
        if (((calculatedHeight + targetRectValues.top) >= maxHeight)) {
            targetElement.style.height = targetRectValues.height +
                (documentHeight - (targetRectValues.height + targetRectValues.top)) + 'px';
        }
        var calculatedTop = (isNullOrUndefined(containerElement)) ? targetTop : topWithoutborder;
        if (calculatedHeight >= minHeight && ((calculatedHeight + calculatedTop) <= maxHeight)) {
            targetElement.style.height = calculatedHeight + 'px';
        }
    }
}
/* istanbul ignore next */
// tslint:disable-next-line
function resizeNorth(e) {
    var calculateValue = false;
    var boundaryRectValues;
    var pageY = (getEventType(e.type) === 'mouse') ? e.pageY : e.touches[0].pageY;
    var targetRectValues = getClientRectValues(targetElement);
    if (!isNullOrUndefined(containerElement)) {
        boundaryRectValues = getClientRectValues(containerElement);
    }
    if (!isNullOrUndefined(containerElement) && (targetRectValues.top - boundaryRectValues.top) > 0) {
        calculateValue = true;
    }
    else if (isNullOrUndefined(containerElement) && pageY > 0) {
        calculateValue = true;
    }
    var currentHeight = originalHeight - (pageY - originalMouseY);
    if ((getClientRectValues(targetElement).bottom + currentHeight) > maxHeight) {
        calculateValue = false;
        targetElement.style.height = maxHeight - getClientRectValues(targetElement).bottom + 'px';
    }
    if (calculateValue) {
        if (currentHeight >= minHeight && currentHeight <= maxHeight) {
            var containerTop = 0;
            if (!isNullOrUndefined(containerElement)) {
                containerTop = boundaryRectValues.top;
            }
            var top_1 = (originalY - containerTop) + (pageY - originalMouseY);
            top_1 = top_1 > 0 ? top_1 : 1;
            targetElement.style.height = currentHeight + 'px';
            targetElement.style.top = top_1 + 'px';
        }
    }
}
/* istanbul ignore next */
// tslint:disable-next-line
function resizeWest(e) {
    var documentWidth = document.documentElement.clientWidth;
    var calculateValue = false;
    var rectValues;
    if (!isNullOrUndefined(containerElement)) {
        rectValues = getClientRectValues(containerElement);
    }
    var pageX = (getEventType(e.type) === 'mouse') ? e.pageX : e.touches[0].pageX;
    var targetRectValues = getClientRectValues(targetElement);
    var borderValue = isNullOrUndefined(containerElement) ? 0 : containerElement.offsetWidth - containerElement.clientWidth;
    var left = isNullOrUndefined(containerElement) ? 0 : rectValues.left;
    var containerWidth = isNullOrUndefined(containerElement) ? 0 : rectValues.width;
    if (isNullOrUndefined(resizeWestWidth)) {
        if (!isNullOrUndefined(containerElement)) {
            resizeWestWidth = (((targetRectValues.left - left) - borderValue / 2)) + targetRectValues.width;
            resizeWestWidth = resizeWestWidth + (containerWidth - borderValue - resizeWestWidth);
        }
        else {
            resizeWestWidth = documentWidth;
        }
    }
    if (!isNullOrUndefined(containerElement) &&
        (((targetRectValues.left - rectValues.left) + targetRectValues.width +
            (rectValues.right - targetRectValues.right)) - borderValue) <= maxWidth) {
        calculateValue = true;
    }
    else if (isNullOrUndefined(containerElement) && pageX >= 0) {
        calculateValue = true;
    }
    var calculatedWidth = originalWidth - (pageX - originalMouseX);
    if (setLeft) {
        calculatedWidth = (calculatedWidth > resizeWestWidth) ? resizeWestWidth : calculatedWidth;
    }
    if (calculateValue) {
        if (calculatedWidth >= minWidth && calculatedWidth <= maxWidth) {
            var containerLeft = 0;
            if (!isNullOrUndefined(containerElement)) {
                containerLeft = rectValues.left;
            }
            var left_1 = (originalX - containerLeft) + (pageX - originalMouseX);
            left_1 = (left_1 > 0) ? left_1 : 1;
            if (calculatedWidth !== previousWidth && setWidth) {
                targetElement.style.width = calculatedWidth + 'px';
            }
            if (setLeft) {
                targetElement.style.left = left_1 + 'px';
                if (left_1 === 1) {
                    setWidth = false;
                }
                else {
                    setWidth = true;
                }
            }
        }
    }
    previousWidth = calculatedWidth;
}
/* istanbul ignore next */
// tslint:disable-next-line
function resizeEast(e) {
    var documentWidth = document.documentElement.clientWidth;
    var calculateValue = false;
    var containerRectValues;
    if (!isNullOrUndefined(containerElement)) {
        containerRectValues = getClientRectValues(containerElement);
    }
    var pageX = (getEventType(e.type) === 'mouse') ? e.pageX : e.touches[0].pageX;
    var targetRectValues = getClientRectValues(targetElement);
    if (!isNullOrUndefined(containerElement) && (((targetRectValues.left - containerRectValues.left) + targetRectValues.width) < maxWidth
        || (targetRectValues.right - containerRectValues.left) > targetRectValues.width)) {
        calculateValue = true;
    }
    else if (isNullOrUndefined(containerElement) && (documentWidth - pageX) > 0) {
        calculateValue = true;
    }
    var calculatedWidth = originalWidth + (pageX - originalMouseX);
    var containerLeft = 0;
    if (!isNullOrUndefined(containerElement)) {
        containerLeft = containerRectValues.left;
    }
    if (((targetRectValues.left - containerLeft) + calculatedWidth) > maxWidth) {
        calculateValue = false;
        if (targetElement.classList.contains(RESIZE_WITHIN_VIEWPORT)) {
            return;
        }
        targetElement.style.width = maxWidth - (targetRectValues.left - containerLeft) + 'px';
    }
    if (calculateValue) {
        if (calculatedWidth >= minWidth && calculatedWidth <= maxWidth) {
            targetElement.style.width = calculatedWidth + 'px';
        }
    }
}
/* istanbul ignore next */
function setMinHeight(minimumHeight) {
    minHeight = minimumHeight;
}
function removeResize() {
    var handlers = targetElement.querySelectorAll('.' + RESIZE_HANDLER);
    for (var i = 0; i < handlers.length; i++) {
        detach(handlers[i]);
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
var ButtonProps = /** @__PURE__ @class */ (function (_super) {
    __extends$1(ButtonProps, _super);
    function ButtonProps() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property()
    ], ButtonProps.prototype, "buttonModel", void 0);
    __decorate$1([
        Property('Button')
    ], ButtonProps.prototype, "type", void 0);
    __decorate$1([
        Event()
    ], ButtonProps.prototype, "click", void 0);
    return ButtonProps;
}(ChildProperty));
/**
 * Configures the animation properties for both open and close the dialog.
 */
var AnimationSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(AnimationSettings, _super);
    function AnimationSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property('Fade')
    ], AnimationSettings.prototype, "effect", void 0);
    __decorate$1([
        Property(400)
    ], AnimationSettings.prototype, "duration", void 0);
    __decorate$1([
        Property(0)
    ], AnimationSettings.prototype, "delay", void 0);
    return AnimationSettings;
}(ChildProperty));
var ROOT = 'e-dialog';
var RTL = 'e-rtl';
var DLG_HEADER_CONTENT = 'e-dlg-header-content';
var DLG_HEADER = 'e-dlg-header';
var DLG_FOOTER_CONTENT = 'e-footer-content';
var MODAL_DLG = 'e-dlg-modal';
var DLG_CONTENT = 'e-dlg-content';
var DLG_CLOSE_ICON = 'e-icon-dlg-close';
var DLG_OVERLAY = 'e-dlg-overlay';
var DLG_CONTAINER = 'e-dlg-container';
var SCROLL_DISABLED = 'e-scroll-disabled';
var DLG_PRIMARY_BUTTON = 'e-primary';
var ICON = 'e-icons';
var POPUP_ROOT = 'e-popup';
var DEVICE = 'e-device';
var FULLSCREEN = 'e-dlg-fullscreen';
var DLG_CLOSE_ICON_BTN = 'e-dlg-closeicon-btn';
var DLG_HIDE = 'e-popup-close';
var DLG_SHOW = 'e-popup-open';
var DLG_UTIL_DEFAULT_TITLE = 'Information';
var DLG_UTIL_ROOT = 'e-scroll-disabled';
var DLG_UTIL_ALERT = 'e-alert-dialog';
var DLG_UTIL_CONFIRM = 'e-confirm-dialog';
var DLG_RESIZABLE = 'e-dlg-resizable';
var DLG_RESTRICT_LEFT_VALUE = 'e-restrict-left';
var DLG_RESTRICT_WIDTH_VALUE = 'e-resize-viewport';
/**
 * Represents the dialog component that displays the information and get input from the user.
 * Two types of dialog components are `Modal and Modeless (non-modal)` depending on its interaction with parent application.
 * ```html
 * <div id="dialog"></div>
 * ```
 * ```typescript
 * <script>
 *   var dialogObj = new Dialog({ header: 'Dialog' });
 *   dialogObj.appendTo("#dialog");
 * </script>
 * ```
 */
var Dialog = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Dialog, _super);
    /**
     * Constructor for creating the widget
     * @hidden
     */
    function Dialog(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Initialize the control rendering
     * @private
     */
    Dialog.prototype.render = function () {
        this.initialize();
        this.initRender();
        this.wireEvents();
        if (this.width === '100%') {
            this.element.style.width = '';
        }
        if (this.enableResize) {
            this.setResize();
            if (this.animationSettings.effect === 'None') {
                this.getMinHeight();
            }
        }
        this.renderComplete();
    };
    /**
     * Initialize the event handler
     * @private
     */
    Dialog.prototype.preRender = function () {
        var _this = this;
        this.headerContent = null;
        this.allowMaxHeight = true;
        var classArray = [];
        for (var j = 0; j < this.element.classList.length; j++) {
            if (!isNullOrUndefined(this.element.classList[j].match('e-control')) ||
                !isNullOrUndefined(this.element.classList[j].match(ROOT))) {
                classArray.push(this.element.classList[j]);
            }
        }
        removeClass([this.element], classArray);
        this.clonedEle = this.element.cloneNode(true);
        this.closeIconClickEventHandler = function (event) {
            _this.hide(event);
        };
        this.dlgOverlayClickEventHandler = function (event) {
            _this.trigger('overlayClick', event);
            _this.focusContent();
        };
        var localeText = { close: 'Close' };
        this.l10n = new L10n('dialog', localeText, this.locale);
        this.checkPositionData();
        if (isNullOrUndefined(this.target)) {
            var prevOnChange = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.target = document.body;
            this.isProtectedOnChange = prevOnChange;
        }
    };
    
    Dialog.prototype.isNumberValue = function (value) {
        var isNumber = /^[-+]?\d*\.?\d+$/.test(value);
        return isNumber;
    };
    Dialog.prototype.checkPositionData = function () {
        if (!isNullOrUndefined(this.position)) {
            if (!isNullOrUndefined(this.position.X) && (typeof (this.position.X) !== 'number')) {
                var isNumber = this.isNumberValue(this.position.X);
                if (isNumber) {
                    var prevOnChange = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    this.position.X = parseFloat(this.position.X);
                    this.isProtectedOnChange = prevOnChange;
                }
            }
            if (!isNullOrUndefined(this.position.Y) && (typeof (this.position.Y) !== 'number')) {
                var isNumber = this.isNumberValue(this.position.Y);
                if (isNumber) {
                    var prevOnChange = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    this.position.Y = parseFloat(this.position.Y);
                    this.isProtectedOnChange = prevOnChange;
                }
            }
        }
    };
    Dialog.prototype.getEle = function (list, selector) {
        var element = undefined;
        for (var i = 0; i < list.length; i++) {
            if (list[i].classList.contains(selector)) {
                element = list[i];
                break;
            }
        }
        return element;
    };
    /* istanbul ignore next */
    Dialog.prototype.getMinHeight = function () {
        var computedHeaderHeight = '0px';
        var computedFooterHeight = '0px';
        if (!isNullOrUndefined(this.element.querySelector('.' + DLG_HEADER_CONTENT))) {
            computedHeaderHeight = getComputedStyle(this.headerContent).height;
        }
        var footerEle = this.getEle(this.element.children, DLG_FOOTER_CONTENT);
        if (!isNullOrUndefined(footerEle)) {
            computedFooterHeight = getComputedStyle(footerEle).height;
        }
        var headerHeight = parseInt(computedHeaderHeight.slice(0, computedHeaderHeight.indexOf('p')), 10);
        var footerHeight = parseInt(computedFooterHeight.slice(0, computedFooterHeight.indexOf('p')), 10);
        setMinHeight(headerHeight + 30 + footerHeight);
    };
    Dialog.prototype.onResizeStart = function (args) {
        this.trigger('resizeStart', args);
        return args.cancel;
    };
    Dialog.prototype.onResizing = function (args) {
        this.trigger('resizing', args);
    };
    Dialog.prototype.onResizeComplete = function (args) {
        this.trigger('resizeStop', args);
    };
    Dialog.prototype.setResize = function () {
        if (this.enableResize) {
            this.element.classList.add(DLG_RESIZABLE);
            var computedHeight = getComputedStyle(this.element).minHeight;
            var computedWidth = getComputedStyle(this.element).minWidth;
            var direction = this.enableRtl ? 'south-west' : 'south-east';
            if (this.isModal && this.enableRtl) {
                this.element.classList.add(DLG_RESTRICT_LEFT_VALUE);
            }
            else if (this.isModal && this.target === document.body) {
                this.element.classList.add(DLG_RESTRICT_WIDTH_VALUE);
            }
            createResize({
                element: this.element,
                direction: direction,
                minHeight: parseInt(computedHeight.slice(0, computedWidth.indexOf('p')), 10),
                maxHeight: this.targetEle.clientHeight,
                minWidth: parseInt(computedWidth.slice(0, computedWidth.indexOf('p')), 10),
                maxWidth: this.targetEle.clientWidth,
                boundary: this.target === document.body ? null : this.targetEle,
                resizeBegin: this.onResizeStart.bind(this),
                resizeComplete: this.onResizeComplete.bind(this),
                resizing: this.onResizing.bind(this)
            });
        }
        else {
            removeResize();
            if (this.isModal) {
                this.element.classList.remove(DLG_RESTRICT_LEFT_VALUE);
            }
            else {
                this.element.classList.remove(DLG_RESTRICT_WIDTH_VALUE);
            }
            this.element.classList.remove(DLG_RESIZABLE);
        }
    };
    /* istanbul ignore next */
    Dialog.prototype.keyDown = function (event) {
        var _this = this;
        if (event.keyCode === 9) {
            if (this.isModal) {
                var buttonObj = void 0;
                if (!isNullOrUndefined(this.btnObj)) {
                    buttonObj = this.btnObj[this.btnObj.length - 1];
                }
                if (!isNullOrUndefined(buttonObj) && document.activeElement === buttonObj.element && !event.shiftKey) {
                    event.preventDefault();
                    this.focusableElements(this.element).focus();
                }
                if (document.activeElement === this.focusableElements(this.element) && event.shiftKey) {
                    event.preventDefault();
                    if (!isNullOrUndefined(buttonObj)) {
                        buttonObj.element.focus();
                    }
                }
            }
        }
        var element = document.activeElement;
        var isTagName = (['input', 'textarea'].indexOf(element.tagName.toLowerCase()) > -1);
        var isContentEdit = false;
        if (!isTagName) {
            isContentEdit = element.hasAttribute('contenteditable') && element.getAttribute('contenteditable') === 'true';
        }
        if (event.keyCode === 27 && this.closeOnEscape) {
            this.hide(event);
        }
        if ((event.keyCode === 13 && !event.ctrlKey && element.tagName.toLowerCase() !== 'textarea' &&
            isTagName && !isNullOrUndefined(this.primaryButtonEle)) ||
            (event.keyCode === 13 && event.ctrlKey && (element.tagName.toLowerCase() === 'textarea' ||
                isContentEdit)) && !isNullOrUndefined(this.primaryButtonEle)) {
            var buttonIndex_1;
            var firstPrimary = this.buttons.some(function (data, index) {
                buttonIndex_1 = index;
                var buttonModel = data.buttonModel;
                return !isNullOrUndefined(buttonModel) && buttonModel.isPrimary === true;
            });
            if (firstPrimary && typeof (this.buttons[buttonIndex_1].click) === 'function') {
                setTimeout(function () {
                    _this.buttons[buttonIndex_1].click.call(_this, event);
                });
            }
        }
    };
    /**
     * Initialize the control rendering
     * @private
     */
    Dialog.prototype.initialize = function () {
        if (!isNullOrUndefined(this.target)) {
            this.targetEle = ((typeof this.target) === 'string') ?
                document.querySelector(this.target) : this.target;
        }
        addClass([this.element], ROOT);
        if (Browser.isDevice) {
            addClass([this.element], DEVICE);
        }
        this.setCSSClass();
        this.setMaxHeight();
    };
    /**
     * Initialize the rendering
     * @private
     */
    Dialog.prototype.initRender = function () {
        var _this = this;
        this.initialRender = true;
        attributes(this.element, { role: 'dialog' });
        if (this.zIndex === 1000) {
            this.setzIndex(this.element, false);
            this.calculatezIndex = true;
        }
        else {
            this.calculatezIndex = false;
        }
        this.setTargetContent();
        if (this.header !== '' && !isNullOrUndefined(this.header)) {
            this.setHeader();
        }
        if (this.showCloseIcon) {
            this.renderCloseIcon();
        }
        this.setContent();
        if (this.footerTemplate !== '' && !isNullOrUndefined(this.footerTemplate)) {
            this.setFooterTemplate();
        }
        else if (!isNullOrUndefined(this.buttons[0].buttonModel)) {
            this.setButton();
        }
        if (this.allowDragging && (!isNullOrUndefined(this.headerContent))) {
            this.setAllowDragging();
        }
        attributes(this.element, { 'aria-modal': (this.isModal ? 'true' : 'false') });
        if (this.isModal) {
            this.setIsModal();
        }
        if (!isNullOrUndefined(this.targetEle)) {
            this.isModal ? this.targetEle.appendChild(this.dlgContainer) : this.targetEle.appendChild(this.element);
        }
        this.popupObj = new Popup(this.element, {
            height: this.height,
            width: this.width,
            zIndex: this.zIndex,
            relateTo: this.target,
            actionOnScroll: 'none',
            open: function (event) {
                _this.focusContent();
                var eventArgs = {
                    container: _this.isModal ? _this.dlgContainer : _this.element,
                    element: _this.element,
                    target: _this.target
                };
                if (_this.enableResize) {
                    _this.getMinHeight();
                }
                _this.trigger('open', eventArgs);
            },
            close: function (event) {
                if (_this.isModal) {
                    addClass([_this.dlgOverlay], 'e-fade');
                }
                _this.unBindEvent(_this.element);
                if (_this.isModal) {
                    _this.dlgContainer.style.display = 'none';
                }
                _this.trigger('close', _this.closeArgs);
                var activeEle = document.activeElement;
                if (!isNullOrUndefined(activeEle) && !isNullOrUndefined((activeEle).blur)) {
                    activeEle.blur();
                }
                if (!isNullOrUndefined(_this.storeActiveElement)) {
                    _this.storeActiveElement.focus();
                }
            }
        });
        this.positionChange();
        this.setEnableRTL();
        addClass([this.element], DLG_HIDE);
        if (this.isModal) {
            this.setOverlayZindex();
        }
        if (this.visible) {
            this.show();
        }
        else {
            if (this.isModal) {
                this.dlgOverlay.style.display = 'none';
            }
        }
        this.initialRender = false;
    };
    Dialog.prototype.setOverlayZindex = function (zIndexValue) {
        var zIndex;
        if (isNullOrUndefined(zIndexValue)) {
            zIndex = parseInt(this.element.style.zIndex, 10) ? parseInt(this.element.style.zIndex, 10) : this.zIndex;
        }
        else {
            zIndex = zIndexValue;
        }
        this.dlgOverlay.style.zIndex = (zIndex - 1).toString();
        this.dlgContainer.style.zIndex = zIndex.toString();
    };
    Dialog.prototype.positionChange = function () {
        if (this.isModal) {
            if (!isNaN(parseFloat(this.position.X)) && !isNaN(parseFloat(this.position.Y))) {
                this.setPopupPosition();
            }
            else if ((!isNaN(parseFloat(this.position.X)) && isNaN(parseFloat(this.position.Y)))
                || (isNaN(parseFloat(this.position.X)) && !isNaN(parseFloat(this.position.Y)))) {
                this.setPopupPosition();
            }
            else {
                this.element.style.top = '0px';
                this.element.style.left = '0px';
                this.dlgContainer.classList.add('e-dlg-' + this.position.X + '-' + this.position.Y);
            }
        }
        else {
            this.setPopupPosition();
        }
    };
    Dialog.prototype.setPopupPosition = function () {
        this.popupObj.setProperties({
            position: {
                X: this.position.X, Y: this.position.Y
            }
        });
    };
    Dialog.prototype.setAllowDragging = function () {
        var _this = this;
        var handleContent = '.' + DLG_HEADER_CONTENT;
        this.dragObj = new Draggable(this.element, {
            clone: false,
            abort: '.e-dlg-closeicon-btn',
            handle: handleContent,
            dragStart: function (event) {
                _this.trigger('dragStart', event);
            },
            dragStop: function (event) {
                if (_this.isModal) {
                    if (!isNullOrUndefined(_this.position)) {
                        _this.dlgContainer.classList.remove('e-dlg-' + _this.position.X + '-' + _this.position.Y);
                    }
                    // Reset the dialog position after drag completion.
                    _this.element.style.position = 'relative';
                }
                _this.trigger('dragStop', event);
                _this.element.classList.remove(DLG_RESTRICT_LEFT_VALUE);
            },
            drag: function (event) {
                _this.trigger('drag', event);
            }
        });
        if (!isNullOrUndefined(this.targetEle)) {
            this.dragObj.dragArea = this.targetEle;
        }
    };
    Dialog.prototype.setButton = function () {
        this.buttonContent = [];
        this.btnObj = [];
        for (var i = 0; i < this.buttons.length; i++) {
            var buttonType = !isNullOrUndefined(this.buttons[i].type) ? this.buttons[i].type.toLowerCase() : 'button';
            var btn = this.createElement('button', { attrs: { type: buttonType } });
            this.buttonContent.push(btn.outerHTML);
        }
        this.setFooterTemplate();
        for (var i = 0; i < this.buttons.length; i++) {
            this.btnObj[i] = new Button(this.buttons[i].buttonModel);
            if (typeof (this.buttons[i].click) === 'function') {
                EventHandler.add(this.ftrTemplateContent.children[i], 'click', this.buttons[i].click, this);
            }
            this.btnObj[i].appendTo(this.ftrTemplateContent.children[i]);
            this.btnObj[i].element.classList.add('e-flat');
            this.primaryButtonEle = this.element.getElementsByClassName('e-primary')[0];
        }
    };
    Dialog.prototype.setContent = function () {
        attributes(this.element, { 'aria-describedby': this.element.id + '_dialog-content' });
        this.contentEle = this.createElement('div', { className: DLG_CONTENT, id: this.element.id + '_dialog-content' });
        if (this.innerContentElement) {
            this.contentEle.appendChild(this.innerContentElement);
        }
        else if (!isNullOrUndefined(this.content) && this.content !== '' || !this.initialRender) {
            var blazorContain = Object.keys(window);
            if (typeof (this.content) === 'string' && blazorContain.indexOf('ejsInterop') === -1) {
                this.contentEle.innerHTML = this.content;
            }
            else if (this.content instanceof HTMLElement) {
                this.contentEle.appendChild(this.content);
            }
            else {
                this.setTemplate(this.content, this.contentEle);
            }
        }
        if (!isNullOrUndefined(this.headerContent)) {
            this.element.insertBefore(this.contentEle, this.element.children[1]);
        }
        else {
            this.element.insertBefore(this.contentEle, this.element.children[0]);
        }
        if (this.height === 'auto') {
            this.setMaxHeight();
        }
    };
    Dialog.prototype.setTemplate = function (template, toElement) {
        var templateFn;
        var templateProps;
        var blazorContain = Object.keys(window);
        if (toElement.classList.contains(DLG_HEADER)) {
            templateProps = this.element.id + 'header';
        }
        else if (toElement.classList.contains(DLG_FOOTER_CONTENT)) {
            templateProps = this.element.id + 'footerTemplate';
        }
        else {
            templateProps = this.element.id + 'content';
        }
        var templateValue;
        if (!isNullOrUndefined(template.outerHTML)) {
            templateFn = compile(template.outerHTML);
            templateValue = template.outerHTML;
        }
        else {
            templateFn = compile(template);
            templateValue = template;
        }
        var fromElements = [];
        if (!isNullOrUndefined(templateFn)) {
            var isString = (blazorContain.indexOf('ejsInterop') !== -1 &&
                !this.isStringTemplate && (templateValue).indexOf('<div>Blazor') === 0) ?
                this.isStringTemplate : true;
            for (var _i = 0, _a = templateFn({}, null, null, templateProps, isString); _i < _a.length; _i++) {
                var item = _a[_i];
                fromElements.push(item);
            }
            append([].slice.call(fromElements), toElement);
            if (blazorContain.indexOf('ejsInterop') !== -1 && !this.isStringTemplate && templateValue.indexOf('<div>Blazor') === 0) {
                this.blazorTemplate(templateProps);
            }
        }
    };
    Dialog.prototype.blazorTemplate = function (templateProps) {
        if (templateProps === this.element.id + 'header') {
            updateBlazorTemplate(templateProps, 'Header', this);
        }
        else if (templateProps === this.element.id + 'footerTemplate') {
            updateBlazorTemplate(templateProps, 'FooterTemplate', this);
        }
        else {
            updateBlazorTemplate(templateProps, 'Content', this);
        }
    };
    Dialog.prototype.setMaxHeight = function () {
        if (!this.allowMaxHeight) {
            return;
        }
        var display = this.element.style.display;
        this.element.style.display = 'none';
        this.element.style.maxHeight = (!isNullOrUndefined(this.target)) && (this.targetEle.offsetHeight < window.innerHeight) ?
            (this.targetEle.offsetHeight - 20) + 'px' : (window.innerHeight - 20) + 'px';
        this.element.style.display = display;
    };
    Dialog.prototype.setEnableRTL = function () {
        this.enableRtl ? addClass([this.element], RTL) : removeClass([this.element], RTL);
        if (!isNullOrUndefined(this.element.querySelector('.e-resize-handle'))) {
            removeResize();
            this.setResize();
        }
    };
    Dialog.prototype.setTargetContent = function () {
        var _this = this;
        if (isNullOrUndefined(this.content) || this.content === '') {
            var isContent = this.element.innerHTML.replace(/\s|<(\/?|\!?)(!--!--)>/g, '') !== '';
            if (this.element.children.length > 0 || isContent) {
                this.innerContentElement = document.createDocumentFragment();
                [].slice.call(this.element.childNodes).forEach(function (el) {
                    if (el.nodeType !== 8) {
                        _this.innerContentElement.appendChild(el);
                    }
                });
            }
        }
    };
    Dialog.prototype.setHeader = function () {
        if (this.headerEle) {
            this.headerEle.innerHTML = '';
        }
        else {
            this.headerEle = this.createElement('div', { id: this.element.id + '_title', className: DLG_HEADER });
        }
        this.createHeaderContent();
        this.headerContent.appendChild(this.headerEle);
        this.setTemplate(this.header, this.headerEle);
        attributes(this.element, { 'aria-labelledby': this.element.id + '_title' });
        this.element.insertBefore(this.headerContent, this.element.children[0]);
    };
    Dialog.prototype.setFooterTemplate = function () {
        if (this.ftrTemplateContent) {
            this.ftrTemplateContent.innerHTML = '';
        }
        else {
            this.ftrTemplateContent = this.createElement('div', {
                className: DLG_FOOTER_CONTENT
            });
        }
        if (this.footerTemplate !== '' && !isNullOrUndefined(this.footerTemplate)) {
            this.setTemplate(this.footerTemplate, this.ftrTemplateContent);
        }
        else {
            this.ftrTemplateContent.innerHTML = this.buttonContent.join('');
        }
        this.element.appendChild(this.ftrTemplateContent);
    };
    Dialog.prototype.createHeaderContent = function () {
        if (isNullOrUndefined(this.headerContent)) {
            this.headerContent = this.createElement('div', { className: DLG_HEADER_CONTENT });
        }
    };
    Dialog.prototype.renderCloseIcon = function () {
        this.closeIcon = this.createElement('button', { className: DLG_CLOSE_ICON_BTN, attrs: { type: 'button' } });
        this.closeIconBtnObj = new Button({ cssClass: 'e-flat', iconCss: DLG_CLOSE_ICON + ' ' + ICON });
        this.closeIconTitle();
        if (!isNullOrUndefined(this.headerContent)) {
            prepend([this.closeIcon], this.headerContent);
        }
        else {
            this.createHeaderContent();
            prepend([this.closeIcon], this.headerContent);
            this.element.insertBefore(this.headerContent, this.element.children[0]);
        }
        this.closeIconBtnObj.appendTo(this.closeIcon);
    };
    Dialog.prototype.closeIconTitle = function () {
        this.l10n.setLocale(this.locale);
        var closeIconTitle = this.l10n.getConstant('close');
        this.closeIcon.setAttribute('title', closeIconTitle);
    };
    Dialog.prototype.setCSSClass = function (oldCSSClass) {
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
        if (oldCSSClass) {
            removeClass([this.element], oldCSSClass.split(' '));
        }
    };
    Dialog.prototype.setIsModal = function () {
        this.dlgContainer = this.createElement('div', { className: DLG_CONTAINER });
        this.element.classList.remove(DLG_SHOW);
        this.element.parentNode.insertBefore(this.dlgContainer, this.element);
        this.dlgContainer.appendChild(this.element);
        addClass([this.element], MODAL_DLG);
        this.dlgOverlay = this.createElement('div', { className: DLG_OVERLAY });
        this.dlgOverlay.style.zIndex = (this.zIndex - 1).toString();
        this.dlgContainer.appendChild(this.dlgOverlay);
    };
    Dialog.prototype.getValidFocusNode = function (items) {
        var node;
        for (var u = 0; u < items.length; u++) {
            node = items[u];
            if ((node.clientHeight > 0 || (node.tagName.toLowerCase() === 'a' && node.hasAttribute('href'))) && node.tabIndex > -1 &&
                !node.disabled && !this.disableElement(node, '[disabled],[aria-disabled="true"],[type="hidden"]')) {
                return node;
            }
        }
        return node;
    };
    Dialog.prototype.focusableElements = function (content) {
        if (!isNullOrUndefined(content)) {
            var value = 'input,select,textarea,button,a,[contenteditable="true"],[tabindex]';
            var items = content.querySelectorAll(value);
            return this.getValidFocusNode(items);
        }
        return null;
    };
    Dialog.prototype.getAutoFocusNode = function (container) {
        var node = container.querySelector('.' + DLG_CLOSE_ICON_BTN);
        var value = '[autofocus]';
        var items = container.querySelectorAll(value);
        var validNode = this.getValidFocusNode(items);
        if (!isNullOrUndefined(validNode)) {
            node = validNode;
        }
        else {
            validNode = this.focusableElements(this.contentEle);
            if (!isNullOrUndefined(validNode)) {
                return node = validNode;
            }
            else if (!isNullOrUndefined(this.primaryButtonEle)) {
                return this.element.querySelector('.' + DLG_PRIMARY_BUTTON);
            }
        }
        return node;
    };
    Dialog.prototype.disableElement = function (element, t) {
        var elementMatch = element ? element.matches || element.webkitMatchesSelector || element.msMatchesSelector : null;
        if (elementMatch) {
            for (; element; element = element.parentNode) {
                if (element instanceof Element && elementMatch.call(element, t)) {
                    /* istanbul ignore next */
                    return element;
                }
            }
        }
        return null;
    };
    Dialog.prototype.focusContent = function () {
        var element = this.getAutoFocusNode(this.element);
        var node = !isNullOrUndefined(element) ? element : this.element;
        node.focus();
        this.bindEvent(this.element);
    };
    Dialog.prototype.bindEvent = function (element) {
        EventHandler.add(element, 'keydown', this.keyDown, this);
    };
    Dialog.prototype.unBindEvent = function (element) {
        EventHandler.remove(element, 'keydown', this.keyDown);
    };
    /**
     * Module required function
     * @private
     */
    Dialog.prototype.getModuleName = function () {
        return 'dialog';
    };
    /**
     * Called internally if any of the property value changed
     * @private
     */
    Dialog.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'content':
                    if (!isNullOrUndefined(this.content) && this.content !== '') {
                        if (!isNullOrUndefined(this.contentEle) && this.contentEle.getAttribute('role') !== 'dialog') {
                            this.contentEle.innerHTML = '';
                            typeof (this.content) === 'string' ?
                                this.contentEle.innerHTML = this.content : this.contentEle.appendChild(this.content);
                            this.setMaxHeight();
                        }
                        else {
                            this.setContent();
                        }
                    }
                    else if (!isNullOrUndefined(this.contentEle)) {
                        detach(this.contentEle);
                        this.contentEle = null;
                    }
                    break;
                case 'header':
                    if (this.header === '' || isNullOrUndefined(this.header)) {
                        if (this.headerEle) {
                            detach(this.headerEle);
                            this.headerEle = null;
                        }
                    }
                    else {
                        this.setHeader();
                    }
                    break;
                case 'footerTemplate':
                    if (this.footerTemplate === '' || isNullOrUndefined(this.footerTemplate)) {
                        if (!this.ftrTemplateContent) {
                            return;
                        }
                        detach(this.ftrTemplateContent);
                        this.ftrTemplateContent = null;
                        this.buttons = [{}];
                    }
                    else {
                        this.setFooterTemplate();
                        this.buttons = [{}];
                    }
                    break;
                case 'showCloseIcon':
                    if (this.element.getElementsByClassName(DLG_CLOSE_ICON).length > 0) {
                        if (!this.showCloseIcon && (this.header === '' || isNullOrUndefined(this.header))) {
                            detach(this.headerContent);
                            this.headerContent = null;
                        }
                        else if (!this.showCloseIcon) {
                            detach(this.closeIcon);
                        }
                    }
                    else {
                        this.renderCloseIcon();
                        this.wireEvents();
                    }
                    break;
                case 'locale':
                    if (this.showCloseIcon) {
                        this.closeIconTitle();
                    }
                    break;
                case 'visible':
                    this.visible ? this.show() : this.hide();
                    break;
                case 'isModal':
                    this.updateIsModal();
                    break;
                case 'height':
                    setStyleAttribute(this.element, { 'height': formatUnit(newProp.height) });
                    break;
                case 'width':
                    setStyleAttribute(this.element, { 'width': formatUnit(newProp.width) });
                    break;
                case 'zIndex':
                    this.popupObj.zIndex = this.zIndex;
                    if (this.isModal) {
                        this.setOverlayZindex(this.zIndex);
                    }
                    this.calculatezIndex = false;
                    break;
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
                case 'buttons':
                    var buttonCount = this.buttons.length;
                    if (!isNullOrUndefined(this.ftrTemplateContent)) {
                        detach(this.ftrTemplateContent);
                        this.ftrTemplateContent = null;
                    }
                    for (var i = 0; i < buttonCount; i++) {
                        if (!isNullOrUndefined(this.buttons[i].buttonModel)) {
                            this.footerTemplate = '';
                            this.setButton();
                        }
                    }
                    break;
                case 'allowDragging':
                    if (this.allowDragging && (!isNullOrUndefined(this.headerContent))) {
                        this.setAllowDragging();
                    }
                    else {
                        this.dragObj.destroy();
                    }
                    break;
                case 'target':
                    this.popupObj.relateTo = newProp.target;
                    break;
                case 'position':
                    this.checkPositionData();
                    if (this.isModal) {
                        var positionX = isNullOrUndefined(oldProp.position.X) ? this.position.X : oldProp.position.X;
                        var positionY = isNullOrUndefined(oldProp.position.Y) ? this.position.Y : oldProp.position.Y;
                        if (this.dlgContainer.classList.contains('e-dlg-' + positionX + '-' + positionY)) {
                            this.dlgContainer.classList.remove('e-dlg-' + positionX + '-' + positionY);
                        }
                    }
                    this.positionChange();
                    break;
                case 'enableRtl':
                    this.setEnableRTL();
                    break;
                case 'enableResize':
                    this.setResize();
                    break;
            }
        }
    };
    Dialog.prototype.updateIsModal = function () {
        this.element.setAttribute('aria-modal', this.isModal ? 'true' : 'false');
        if (this.isModal) {
            this.setIsModal();
            this.element.style.top = '0px';
            this.element.style.left = '0px';
            if (!isNullOrUndefined(this.targetEle)) {
                this.targetEle.appendChild(this.dlgContainer);
            }
        }
        else {
            removeClass([this.element], MODAL_DLG);
            removeClass([document.body], SCROLL_DISABLED);
            detach(this.dlgOverlay);
            while (this.dlgContainer.firstChild) {
                this.dlgContainer.parentElement.insertBefore(this.dlgContainer.firstChild, this.dlgContainer);
            }
            this.dlgContainer.parentElement.removeChild(this.dlgContainer);
        }
        if (this.visible) {
            this.show();
        }
        this.positionChange();
        if (this.isModal && this.dlgOverlay) {
            EventHandler.add(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler, this);
        }
    };
    Dialog.prototype.setzIndex = function (zIndexElement, setPopupZindex) {
        var prevOnChange = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.zIndex = getZindexPartial(zIndexElement);
        this.isProtectedOnChange = prevOnChange;
        if (setPopupZindex) {
            this.popupObj.zIndex = this.zIndex;
        }
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    Dialog.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}
     * @memberof dialog
     */
    Dialog.prototype.destroy = function () {
        if (this.element.classList.contains(ROOT)) {
            this.unWireEvents();
            _super.prototype.destroy.call(this);
            var classArray = [
                ROOT, RTL, MODAL_DLG
            ];
            removeClass([this.element, this.element], classArray);
            if (this.popupObj.element.classList.contains(POPUP_ROOT)) {
                this.popupObj.destroy();
            }
            /* istanbul ignore next */
            if (!isNullOrUndefined(this.btnObj)) {
                for (var i = void 0; i < this.btnObj.length; i++) {
                    this.btnObj[i].destroy();
                }
            }
            if (this.isModal) {
                detach(this.dlgOverlay);
                this.dlgContainer.parentNode.insertBefore(this.element, this.dlgContainer);
                detach(this.dlgContainer);
            }
            this.element.innerHTML = '';
            while (this.element.attributes.length > 0) {
                this.element.removeAttribute(this.element.attributes[0].name);
            }
            for (var k = 0; k < this.clonedEle.attributes.length; k++) {
                this.element.setAttribute(this.clonedEle.attributes[k].name, this.clonedEle.attributes[k].value);
            }
        }
    };
    /**
     * Binding event to the element while widget creation
     * @hidden
     */
    Dialog.prototype.wireEvents = function () {
        if (this.showCloseIcon) {
            EventHandler.add(this.closeIcon, 'click', this.closeIconClickEventHandler, this);
        }
        if (this.isModal && this.dlgOverlay) {
            EventHandler.add(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler, this);
        }
    };
    /**
     * Unbinding event to the element while widget destroy
     * @hidden
     */
    Dialog.prototype.unWireEvents = function () {
        if (this.showCloseIcon) {
            EventHandler.remove(this.closeIcon, 'click', this.closeIconClickEventHandler);
        }
        if (this.isModal) {
            EventHandler.remove(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler);
        }
        if (!isNullOrUndefined(this.buttons[0].buttonModel)) {
            for (var i = 0; i < this.buttons.length; i++) {
                if (typeof (this.buttons[i].click) === 'function') {
                    EventHandler.remove(this.ftrTemplateContent.children[i], 'click', this.buttons[i].click);
                }
            }
        }
    };
    /**
     * Refreshes the dialog's position when the user changes its header and footer height/width dynamically.
     * @return {void}
     */
    Dialog.prototype.refreshPosition = function () {
        this.popupObj.refreshPosition();
    };
    /**
     * Opens the dialog if it is in hidden state.
     * To open the dialog with full screen width, set the parameter to true.
     * @param { boolean } isFullScreen - Enable the fullScreen Dialog.
     * @return {void}
     */
    Dialog.prototype.show = function (isFullScreen) {
        var _this = this;
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        if (!this.element.classList.contains(DLG_SHOW) || (!isNullOrUndefined(isFullScreen))) {
            if (!isNullOrUndefined(isFullScreen)) {
                this.fullScreen(isFullScreen);
            }
            var eventArgs_1 = isBlazor() ? {
                cancel: false,
                element: this.element,
                container: this.isModal ? this.dlgContainer : this.element,
                maxHeight: this.element.style.maxHeight
            } : {
                cancel: false,
                element: this.element,
                container: this.isModal ? this.dlgContainer : this.element,
                target: this.target,
                maxHeight: this.element.style.maxHeight
            };
            this.trigger('beforeOpen', eventArgs_1, function (beforeOpenArgs) {
                if (!beforeOpenArgs.cancel) {
                    if (_this.element.style.maxHeight !== eventArgs_1.maxHeight) {
                        _this.allowMaxHeight = false;
                        _this.element.style.maxHeight = eventArgs_1.maxHeight;
                    }
                    _this.storeActiveElement = document.activeElement;
                    _this.element.tabIndex = -1;
                    if (_this.isModal && (!isNullOrUndefined(_this.dlgOverlay))) {
                        _this.dlgOverlay.style.display = 'block';
                        _this.dlgContainer.style.display = 'flex';
                        removeClass([_this.dlgOverlay], 'e-fade');
                        if (!isNullOrUndefined(_this.targetEle)) {
                            if (_this.targetEle === document.body) {
                                _this.dlgContainer.style.position = 'fixed';
                            }
                            else {
                                _this.dlgContainer.style.position = 'absolute';
                            }
                            _this.dlgOverlay.style.position = 'absolute';
                            _this.element.style.position = 'relative';
                            addClass([_this.targetEle], SCROLL_DISABLED);
                        }
                        else {
                            addClass([document.body], SCROLL_DISABLED);
                        }
                    }
                    var openAnimation = {
                        name: _this.animationSettings.effect + 'In',
                        duration: _this.animationSettings.duration,
                        delay: _this.animationSettings.delay
                    };
                    var zIndexElement = (_this.isModal) ? _this.element.parentElement : _this.element;
                    if (_this.calculatezIndex) {
                        _this.setzIndex(zIndexElement, true);
                        setStyleAttribute(_this.element, { 'zIndex': _this.zIndex });
                        if (_this.isModal) {
                            _this.setOverlayZindex(_this.zIndex);
                        }
                    }
                    _this.animationSettings.effect === 'None' ? _this.popupObj.show() : _this.popupObj.show(openAnimation);
                    _this.dialogOpen = true;
                    var prevOnChange = _this.isProtectedOnChange;
                    _this.isProtectedOnChange = true;
                    _this.visible = true;
                    _this.isProtectedOnChange = prevOnChange;
                }
            });
        }
    };
    /**
     * Closes the dialog if it is in visible state.
     * @return {void}
     */
    Dialog.prototype.hide = function (event) {
        var _this = this;
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        if (this.visible) {
            var eventArgs = isBlazor() ? {
                cancel: false,
                isInteraction: event ? true : false,
                isInteracted: event ? true : false,
                element: this.element,
                container: this.isModal ? this.dlgContainer : this.element,
                event: event
            } : {
                cancel: false,
                isInteraction: event ? true : false,
                isInteracted: event ? true : false,
                element: this.element,
                target: this.target,
                container: this.isModal ? this.dlgContainer : this.element,
                event: event
            };
            this.closeArgs = eventArgs;
            this.trigger('beforeClose', eventArgs, function (beforeCloseArgs) {
                if (!beforeCloseArgs.cancel) {
                    if (_this.isModal) {
                        !isNullOrUndefined(_this.targetEle) ? removeClass([_this.targetEle], SCROLL_DISABLED) :
                            removeClass([document.body], SCROLL_DISABLED);
                    }
                    var closeAnimation = {
                        name: _this.animationSettings.effect + 'Out',
                        duration: _this.animationSettings.duration,
                        delay: _this.animationSettings.delay
                    };
                    _this.animationSettings.effect === 'None' ? _this.popupObj.hide() : _this.popupObj.hide(closeAnimation);
                    _this.dialogOpen = false;
                    var prevOnChange = _this.isProtectedOnChange;
                    _this.isProtectedOnChange = true;
                    _this.visible = false;
                    _this.isProtectedOnChange = prevOnChange;
                }
            });
        }
    };
    /**
     * Specifies to view the Full screen Dialog.
     * @private
     */
    Dialog.prototype.fullScreen = function (args) {
        var top = this.element.offsetTop;
        var left = this.element.offsetLeft;
        if (args) {
            addClass([this.element], FULLSCREEN);
            var display = this.element.style.display;
            this.element.style.display = 'none';
            this.element.style.maxHeight = (!isNullOrUndefined(this.target)) ?
                (this.targetEle.offsetHeight) + 'px' : (window.innerHeight) + 'px';
            this.element.style.display = display;
            addClass([document.body], SCROLL_DISABLED);
            if (this.allowDragging && !isNullOrUndefined(this.dragObj)) {
                this.dragObj.destroy();
            }
        }
        else {
            removeClass([this.element], FULLSCREEN);
            removeClass([document.body], SCROLL_DISABLED);
            if (this.allowDragging && (!isNullOrUndefined(this.headerContent))) {
                this.setAllowDragging();
            }
        }
        return args;
    };
    /**
     * Returns the dialog button instances.
     * Based on that, you can dynamically change the button states.
     * @param { number } index - Index of the button.
     * @return {Button}
     */
    Dialog.prototype.getButtons = function (index) {
        if (!isNullOrUndefined(index)) {
            return this.btnObj[index];
        }
        return this.btnObj;
    };
    __decorate$1([
        Property('')
    ], Dialog.prototype, "content", void 0);
    __decorate$1([
        Property(false)
    ], Dialog.prototype, "showCloseIcon", void 0);
    __decorate$1([
        Property(false)
    ], Dialog.prototype, "isModal", void 0);
    __decorate$1([
        Property('')
    ], Dialog.prototype, "header", void 0);
    __decorate$1([
        Property(true)
    ], Dialog.prototype, "visible", void 0);
    __decorate$1([
        Property(false)
    ], Dialog.prototype, "enableResize", void 0);
    __decorate$1([
        Property('auto')
    ], Dialog.prototype, "height", void 0);
    __decorate$1([
        Property('100%')
    ], Dialog.prototype, "width", void 0);
    __decorate$1([
        Property('')
    ], Dialog.prototype, "cssClass", void 0);
    __decorate$1([
        Property(1000)
    ], Dialog.prototype, "zIndex", void 0);
    __decorate$1([
        Property(null)
    ], Dialog.prototype, "target", void 0);
    __decorate$1([
        Property('')
    ], Dialog.prototype, "footerTemplate", void 0);
    __decorate$1([
        Property(false)
    ], Dialog.prototype, "allowDragging", void 0);
    __decorate$1([
        Collection([{}], ButtonProps)
    ], Dialog.prototype, "buttons", void 0);
    __decorate$1([
        Property(true)
    ], Dialog.prototype, "closeOnEscape", void 0);
    __decorate$1([
        Complex({}, AnimationSettings)
    ], Dialog.prototype, "animationSettings", void 0);
    __decorate$1([
        Complex({ X: 'center', Y: 'center' }, PositionData)
    ], Dialog.prototype, "position", void 0);
    __decorate$1([
        Event()
    ], Dialog.prototype, "created", void 0);
    __decorate$1([
        Event()
    ], Dialog.prototype, "open", void 0);
    __decorate$1([
        Event()
    ], Dialog.prototype, "beforeOpen", void 0);
    __decorate$1([
        Event()
    ], Dialog.prototype, "close", void 0);
    __decorate$1([
        Event()
    ], Dialog.prototype, "beforeClose", void 0);
    __decorate$1([
        Event()
    ], Dialog.prototype, "dragStart", void 0);
    __decorate$1([
        Event()
    ], Dialog.prototype, "dragStop", void 0);
    __decorate$1([
        Event()
    ], Dialog.prototype, "drag", void 0);
    __decorate$1([
        Event()
    ], Dialog.prototype, "overlayClick", void 0);
    __decorate$1([
        Event()
    ], Dialog.prototype, "resizeStart", void 0);
    __decorate$1([
        Event()
    ], Dialog.prototype, "resizing", void 0);
    __decorate$1([
        Event()
    ], Dialog.prototype, "resizeStop", void 0);
    Dialog = __decorate$1([
        NotifyPropertyChanges
    ], Dialog);
    return Dialog;
}(Component));
/**
 * Base for creating Alert and Confirmation Dialog through util method.
 */
var DialogUtility;
(function (DialogUtility) {
    /**
     * An alert dialog box is used to display warning like messages to the users.
     * ```
     * Eg : DialogUtility.alert('Alert message');
     *
     * ```
     */
    /* istanbul ignore next */
    function alert(args) {
        var dialogElement = createElement('div', { 'className': DLG_UTIL_ALERT });
        document.body.appendChild(dialogElement);
        var alertDialogObj;
        var okButtonModel = [{
                buttonModel: { isPrimary: true, content: 'OK' },
                click: function () {
                    this.hide();
                }
            }];
        if (typeof (args) === 'string') {
            alertDialogObj = createDialog({ content: args,
                position: { X: 'center', Y: 'top' },
                isModal: true, header: DLG_UTIL_DEFAULT_TITLE,
                buttons: okButtonModel }, dialogElement);
        }
        else {
            alertDialogObj = createDialog(alertOptions(args), dialogElement);
        }
        alertDialogObj.close = function () {
            if (args && args.close) {
                args.close.apply(alertDialogObj);
            }
            alertDialogObj.destroy();
            if (alertDialogObj.element.classList.contains('e-dlg-modal')) {
                alertDialogObj.element.parentElement.remove();
                alertDialogObj.target.classList.remove(DLG_UTIL_ROOT);
            }
            else {
                alertDialogObj.element.remove();
            }
        };
        return alertDialogObj;
    }
    DialogUtility.alert = alert;
    /**
     * A confirm dialog displays a specified message along with ‘OK’ and ‘Cancel’ button.
     * ```
     * Eg : DialogUtility.confirm('Confirm dialog message');
     *
     * ```
     */
    /* istanbul ignore next */
    function confirm(args) {
        var dialogElement = createElement('div', { 'className': DLG_UTIL_CONFIRM });
        document.body.appendChild(dialogElement);
        var confirmDialogObj;
        var okCancelButtonModel = [{
                buttonModel: { isPrimary: true, content: 'OK' },
                click: function () {
                    this.hide();
                }
            }, {
                buttonModel: { content: 'Cancel' },
                click: function () {
                    this.hide();
                }
            }];
        if (typeof (args) === 'string') {
            confirmDialogObj = createDialog({ position: { X: 'center', Y: 'top' }, content: args, isModal: true,
                header: DLG_UTIL_DEFAULT_TITLE, buttons: okCancelButtonModel
            }, dialogElement);
        }
        else {
            confirmDialogObj = createDialog(confirmOptions(args), dialogElement);
        }
        confirmDialogObj.close = function () {
            if (args && args.close) {
                args.close.apply(confirmDialogObj);
            }
            confirmDialogObj.destroy();
            if (confirmDialogObj.element.classList.contains('e-dlg-modal')) {
                confirmDialogObj.element.parentElement.remove();
                confirmDialogObj.target.classList.remove(DLG_UTIL_ROOT);
            }
            else {
                confirmDialogObj.element.remove();
            }
        };
        return confirmDialogObj;
    }
    DialogUtility.confirm = confirm;
    function createDialog(options, element) {
        var dialogObject = new Dialog(options);
        dialogObject.appendTo(element);
        return dialogObject;
    }
    function alertOptions(option) {
        var options = {};
        options.buttons = [];
        options = formOptions(options, option);
        options = setAlertButtonModel(options, option);
        return options;
    }
    function confirmOptions(option) {
        var options = {};
        options.buttons = [];
        options = formOptions(options, option);
        options = setConfirmButtonModel(options, option);
        return options;
    }
    function formOptions(options, option) {
        options.header = !isNullOrUndefined(option.title) ? option.title : DLG_UTIL_DEFAULT_TITLE;
        options.content = !isNullOrUndefined(option.content) ? option.content : '';
        options.isModal = !isNullOrUndefined(option.isModal) ? option.isModal : true;
        options.showCloseIcon = !isNullOrUndefined(option.showCloseIcon) ? option.showCloseIcon : false;
        options.allowDragging = !isNullOrUndefined(option.isDraggable) ? option.isDraggable : false;
        options.closeOnEscape = !isNullOrUndefined(option.closeOnEscape) ? option.closeOnEscape : false;
        options.position = !isNullOrUndefined(option.position) ? option.position : { X: 'center', Y: 'top' };
        options.animationSettings = !isNullOrUndefined(option.animationSettings) ? option.animationSettings :
            { effect: 'Fade', duration: 400, delay: 0 };
        options.cssClass = !isNullOrUndefined(option.cssClass) ? option.cssClass : '';
        options.zIndex = !isNullOrUndefined(option.zIndex) ? option.zIndex : 1000;
        options.open = !isNullOrUndefined(option.open) ? option.open : null;
        return options;
    }
    function setAlertButtonModel(options, option) {
        var alertButtonModel = [{
                buttonModel: { isPrimary: true, content: 'OK' },
                click: function () {
                    this.hide();
                }
            }];
        if (!isNullOrUndefined(option.okButton)) {
            options.buttons[0] = formButtonModel(options.buttons[0], option.okButton, alertButtonModel[0]);
        }
        else {
            options.buttons = alertButtonModel;
        }
        return options;
    }
    function setConfirmButtonModel(options, option) {
        var okButtonModel = {
            buttonModel: { isPrimary: true, content: 'OK' },
            click: function () {
                this.hide();
            }
        };
        var cancelButtonModel = {
            buttonModel: { content: 'Cancel' },
            click: function () {
                this.hide();
            }
        };
        if (!isNullOrUndefined(option.okButton)) {
            options.buttons[0] = formButtonModel(options.buttons[0], option.okButton, okButtonModel);
        }
        else {
            options.buttons[0] = okButtonModel;
        }
        if (!isNullOrUndefined(option.cancelButton)) {
            options.buttons[1] = formButtonModel(options.buttons[1], option.cancelButton, cancelButtonModel);
        }
        else {
            options.buttons[1] = cancelButtonModel;
        }
        return options;
    }
    function formButtonModel(buttonModel, option, buttonPropModel) {
        var buttonProps = buttonPropModel;
        if (!isNullOrUndefined(option.text)) {
            buttonProps.buttonModel.content = option.text;
        }
        if (!isNullOrUndefined(option.icon)) {
            buttonProps.buttonModel.iconCss = option.icon;
        }
        if (!isNullOrUndefined(option.cssClass)) {
            buttonProps.buttonModel.cssClass = option.cssClass;
        }
        if (!isNullOrUndefined(option.click)) {
            buttonProps.click = option.click;
        }
        return buttonProps;
    }
})(DialogUtility || (DialogUtility = {}));

/**
 * Dialog Component
 */

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
var TOUCHEND_HIDE_DELAY = 1500;
var TAPHOLD_THRESHOLD = 500;
var SHOW_POINTER_TIP_GAP = 0;
var HIDE_POINTER_TIP_GAP = 8;
var MOUSE_TRAIL_GAP = 2;
var POINTER_ADJUST = 2;
var ROOT$1 = 'e-tooltip';
var RTL$1 = 'e-rtl';
var DEVICE$1 = 'e-bigger';
var ICON$1 = 'e-icons';
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
var POPUP_ROOT$1 = 'e-popup';
var POPUP_OPEN = 'e-popup-open';
var POPUP_CLOSE = 'e-popup-close';
var POPUP_LIB = 'e-lib';
var Animation$1 = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Animation$$1, _super);
    function Animation$$1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Property({ effect: 'FadeIn', duration: 150, delay: 0 })
    ], Animation$$1.prototype, "open", void 0);
    __decorate$2([
        Property({ effect: 'FadeOut', duration: 150, delay: 0 })
    ], Animation$$1.prototype, "close", void 0);
    return Animation$$1;
}(ChildProperty));
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
var Tooltip = /** @__PURE__ @class */ (function (_super) {
    __extends$2(Tooltip, _super);
    /**
     * Constructor for creating the Tooltip Component
     */
    function Tooltip(options, element) {
        return _super.call(this, options, element) || this;
    }
    Tooltip.prototype.initialize = function () {
        this.formatPosition();
        addClass([this.element], ROOT$1);
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
        var tip = this.createElement('div', { className: ARROW_TIP + ' ' + this.tipClass });
        tip.appendChild(this.createElement('div', { className: ARROW_TIP_OUTER + ' ' + this.tipClass }));
        tip.appendChild(this.createElement('div', { className: ARROW_TIP_INNER + ' ' + this.tipClass }));
        this.tooltipEle.appendChild(tip);
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
        this.popupObj = new Popup(this.tooltipEle, {
            height: this.height,
            width: this.width,
            position: {
                X: elePos.left,
                Y: elePos.top
            },
            enableRtl: this.enableRtl,
            open: this.openPopupHandler.bind(this),
            close: this.closePopupHandler.bind(this)
        });
    };
    Tooltip.prototype.getTooltipPosition = function (target) {
        this.tooltipEle.style.display = 'none';
        var pos = calculatePosition(target, this.tooltipPositionX, this.tooltipPositionY);
        this.tooltipEle.style.display = '';
        var offsetPos = this.calculateTooltipOffset(this.position);
        var elePos = this.collisionFlipFit(target, pos.left + offsetPos.left, pos.top + offsetPos.top);
        return elePos;
    };
    Tooltip.prototype.reposition = function (target) {
        var elePos = this.getTooltipPosition(target);
        this.popupObj.position = { X: elePos.left, Y: elePos.top };
        this.popupObj.dataBind();
    };
    Tooltip.prototype.openPopupHandler = function () {
        if (this.needTemplateReposition() && !this.mouseTrail) {
            this.reposition(this.findTarget());
        }
        this.trigger('afterOpen', this.tooltipEventArgs);
    };
    Tooltip.prototype.closePopupHandler = function () {
        resetBlazorTemplate(this.element.id + 'content', 'Content');
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
        removeClass(selEle, removeList);
        this.setTipClass(position);
        addClass(selEle, this.tipClass);
    };
    Tooltip.prototype.adjustArrow = function (target, position, tooltipPositionX, tooltipPositionY) {
        if (this.showTipPointer === false) {
            return;
        }
        this.updateTipPosition(position);
        var leftValue;
        var topValue;
        var tooltipWidth = this.tooltipEle.clientWidth;
        var tooltipHeight = this.tooltipEle.clientHeight;
        var arrowEle = this.tooltipEle.querySelector('.' + ARROW_TIP);
        var arrowInnerELe = this.tooltipEle.querySelector('.' + ARROW_TIP_INNER);
        var tipWidth = arrowEle.offsetWidth;
        var tipHeight = arrowEle.offsetHeight;
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
        if (target && !isNullOrUndefined(target.getAttribute('title'))) {
            target.setAttribute('data-content', target.getAttribute('title'));
            target.removeAttribute('title');
        }
        if (!isNullOrUndefined(this.content)) {
            tooltipContent.innerHTML = '';
            if (this.content instanceof HTMLElement) {
                tooltipContent.appendChild(this.content);
            }
            else if (typeof this.content === 'string' && this.content.indexOf('<div>Blazor') < 0) {
                tooltipContent.innerHTML = this.content;
            }
            else {
                var templateFunction = compile(this.content);
                append(templateFunction({}, null, null, this.element.id + 'content'), tooltipContent);
                if (typeof this.content === 'string' && this.content.indexOf('<div>Blazor') >= 0) {
                    this.isBlazorTemplate = true;
                    updateBlazorTemplate(this.element.id + 'content', 'Content', this);
                }
            }
        }
        else {
            if (target && !isNullOrUndefined(target.getAttribute('data-content'))) {
                tooltipContent.innerHTML = target.getAttribute('data-content');
            }
        }
    };
    Tooltip.prototype.renderCloseIcon = function () {
        if (!this.isSticky) {
            return;
        }
        var tipClose = this.createElement('div', { className: ICON$1 + ' ' + CLOSE });
        this.tooltipEle.appendChild(tipClose);
        EventHandler.add(tipClose, Browser.touchStartEvent, this.onStickyClose, this);
    };
    Tooltip.prototype.addDescribedBy = function (target, id) {
        var describedby = (target.getAttribute('aria-describedby') || '').split(/\s+/);
        if (describedby.indexOf(id) < 0) {
            describedby.push(id);
        }
        attributes(target, { 'aria-describedby': describedby.join(' ').trim(), 'data-tooltip-id': id });
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
            target = closest(e.target, this.target);
        }
        else {
            target = this.element;
        }
        if (isNullOrUndefined(target)) {
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
            target = closest(e.target, this.target);
        }
        else {
            target = this.element;
        }
        if (isNullOrUndefined(target) || target.getAttribute('data-tooltip-id') !== null) {
            return;
        }
        var targetList = [].slice.call(document.querySelectorAll('[data-tooltip-id= ' + this.ctrlId + '_content]'));
        for (var _i = 0, targetList_1 = targetList; _i < targetList_1.length; _i++) {
            var target_1 = targetList_1[_i];
            this.restoreElement(target_1);
        }
        this.showTooltip(target, this.animation.open, e);
        this.wireMouseEvents(e, target);
    };
    Tooltip.prototype.showTooltip = function (target, showAnimation, e) {
        var _this = this;
        clearTimeout(this.showTimer);
        clearTimeout(this.hideTimer);
        this.tooltipEventArgs = e ? { type: e.type, cancel: false, target: target, event: e, element: this.tooltipEle } :
            { type: null, cancel: false, target: target, event: null, element: this.tooltipEle };
        this.trigger('beforeRender', this.tooltipEventArgs, function (beforeRenderArgs) {
            if (beforeRenderArgs.cancel) {
                _this.isHidden = true;
                _this.clear();
            }
            else {
                _this.isHidden = false;
                if (isNullOrUndefined(_this.tooltipEle)) {
                    _this.ctrlId = _this.element.getAttribute('id') ?
                        getUniqueID(_this.element.getAttribute('id')) : getUniqueID('tooltip');
                    _this.tooltipEle = _this.createElement('div', {
                        className: TOOLTIP_WRAP + ' ' + POPUP_ROOT$1 + ' ' + POPUP_LIB, attrs: {
                            role: 'tooltip', 'aria-hidden': 'false', 'id': _this.ctrlId + '_content'
                        }, styles: 'width:' +
                            formatUnit(_this.width) + ';height:' + formatUnit(_this.height) + ';position:absolute;'
                    });
                    if (_this.cssClass) {
                        addClass([_this.tooltipEle], _this.cssClass.split(' '));
                    }
                    if (Browser.isDevice) {
                        addClass([_this.tooltipEle], DEVICE$1);
                    }
                    if (_this.width !== 'auto') {
                        _this.tooltipEle.style.maxWidth = formatUnit(_this.width);
                    }
                    _this.tooltipEle.appendChild(_this.createElement('div', { className: CONTENT }));
                    document.body.appendChild(_this.tooltipEle);
                    _this.addDescribedBy(target, _this.ctrlId + '_content');
                    _this.renderContent(target);
                    addClass([_this.tooltipEle], POPUP_OPEN);
                    if (_this.showTipPointer) {
                        _this.renderArrow();
                    }
                    _this.renderCloseIcon();
                    _this.renderPopup(target);
                }
                else {
                    _this.adjustArrow(target, _this.position, _this.tooltipPositionX, _this.tooltipPositionY);
                    _this.addDescribedBy(target, _this.ctrlId + '_content');
                    _this.renderContent(target);
                    Animation.stop(_this.tooltipEle);
                    _this.reposition(target);
                }
                removeClass([_this.tooltipEle], POPUP_OPEN);
                addClass([_this.tooltipEle], POPUP_CLOSE);
                _this.tooltipEventArgs = e ? { type: e.type, cancel: false, target: target, event: e, element: _this.tooltipEle } :
                    { type: null, cancel: false, target: target, event: null, element: _this.tooltipEle };
                var this$_1 = _this;
                if (_this.needTemplateReposition() && !_this.mouseTrail) {
                    _this.tooltipEle.style.display = 'none';
                }
                _this.trigger('beforeOpen', _this.tooltipEventArgs, function (observedArgs) {
                    if (observedArgs.cancel) {
                        this$_1.isHidden = true;
                        this$_1.clear();
                        this$_1.restoreElement(target);
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
                        if (this$_1.openDelay > 0) {
                            var show = function () {
                                if (this$_1.popupObj) {
                                    this$_1.popupObj.show(openAnimation_1, target);
                                }
                            };
                            this$_1.showTimer = setTimeout(show, this$_1.openDelay);
                        }
                        else {
                            this$_1.popupObj.show(openAnimation_1, target);
                        }
                    }
                });
            }
        });
    };
    Tooltip.prototype.needTemplateReposition = function () {
        // tslint:disable-next-line:no-any
        var tooltip = this;
        return !isNullOrUndefined(tooltip.viewContainerRef)
            && typeof tooltip.viewContainerRef !== 'string'
            || isBlazor() && this.isBlazorTemplate;
    };
    Tooltip.prototype.checkCollision = function (target, x, y) {
        var elePos = {
            left: x, top: y, position: this.position,
            horizontal: this.tooltipPositionX, vertical: this.tooltipPositionY
        };
        var affectedPos = isCollide(this.tooltipEle, (this.target ? this.element : null), x, y);
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
            var pos = calculatePosition(target, elePos.horizontal, elePos.vertical);
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
        var left = fit(this.tooltipEle, (this.target ? this.element : null), { X: true, Y: false }, eleOffset).left;
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
        eleOffset.left = left;
        return eleOffset;
    };
    Tooltip.prototype.hideTooltip = function (hideAnimation, e, targetElement) {
        var _this = this;
        var target;
        if (e) {
            target = this.target ? (targetElement || e.target) : this.element;
            this.tooltipEventArgs = {
                type: e.type, cancel: false, target: target, event: e, element: this.tooltipEle
            };
        }
        else {
            target = document.querySelector('[data-tooltip-id= ' + this.ctrlId + '_content]');
            this.tooltipEventArgs = {
                type: null, cancel: false, target: target, event: null, element: this.tooltipEle
            };
        }
        if (isNullOrUndefined(target)) {
            return;
        }
        this.trigger('beforeClose', this.tooltipEventArgs, function (observedArgs) {
            if (!observedArgs.cancel) {
                _this.restoreElement(target);
                _this.isHidden = true;
                var closeAnimation_1 = {
                    name: hideAnimation.effect,
                    duration: hideAnimation.duration,
                    delay: hideAnimation.delay,
                    timingFunction: 'easeIn'
                };
                if (hideAnimation.effect === 'None') {
                    closeAnimation_1 = undefined;
                }
                if (_this.closeDelay > 0) {
                    var hide = function () {
                        if (_this.popupObj) {
                            _this.popupObj.hide(closeAnimation_1);
                        }
                    };
                    _this.hideTimer = setTimeout(hide, _this.closeDelay);
                }
                else {
                    _this.popupObj.hide(closeAnimation_1);
                }
            }
            else {
                _this.isHidden = false;
            }
        });
    };
    Tooltip.prototype.restoreElement = function (target) {
        this.unwireMouseEvents(target);
        if (!isNullOrUndefined(target.getAttribute('data-content'))) {
            target.setAttribute('title', target.getAttribute('data-content'));
            target.removeAttribute('data-content');
        }
        this.removeDescribedBy(target);
    };
    Tooltip.prototype.clear = function () {
        if (this.tooltipEle) {
            removeClass([this.tooltipEle], POPUP_CLOSE);
            addClass([this.tooltipEle], POPUP_OPEN);
        }
        if (this.isHidden) {
            if (this.popupObj) {
                this.popupObj.destroy();
            }
            if (this.tooltipEle) {
                remove(this.tooltipEle);
            }
            this.tooltipEle = null;
            this.popupObj = null;
        }
    };
    Tooltip.prototype.onMouseOut = function (e) {
        var enteredElement = e.relatedTarget;
        // don't close the tooltip only if it is tooltip content element
        if (enteredElement && !this.mouseTrail) {
            var checkForTooltipElement = closest(enteredElement, "." + TOOLTIP_WRAP + "." + POPUP_LIB + "." + POPUP_ROOT$1);
            if (checkForTooltipElement) {
                EventHandler.add(checkForTooltipElement, 'mouseleave', this.tooltipElementMouseOut, this);
                this.unwireMouseEvents(e.target);
            }
            else {
                this.hideTooltip(this.animation.close, e);
            }
        }
        else {
            this.hideTooltip(this.animation.close, e);
        }
    };
    Tooltip.prototype.tooltipElementMouseOut = function (e) {
        this.hideTooltip(this.animation.close, e, this.findTarget());
        EventHandler.remove(this.element, 'mouseleave', this.tooltipElementMouseOut);
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
        Animation.stop(this.tooltipEle);
        removeClass([this.tooltipEle], POPUP_CLOSE);
        addClass([this.tooltipEle], POPUP_OPEN);
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
        if (this.tooltipEle && closest(e.target, '.' + ROOT$1) === null) {
            this.close();
        }
    };
    Tooltip.prototype.scrollHandler = function (e) {
        if (this.tooltipEle) {
            this.close();
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
                EventHandler.add(this.element, Browser.touchStartEvent, this.targetClick, this);
            }
            if (opensOn === 'Hover') {
                if (Browser.isDevice) {
                    this.touchModule = new Touch(this.element, {
                        tapHoldThreshold: TAPHOLD_THRESHOLD,
                        tapHold: this.tapHoldHandler.bind(this)
                    });
                    EventHandler.add(this.element, Browser.touchEndEvent, this.touchEndHandler, this);
                }
                else {
                    EventHandler.add(this.element, 'mouseover', this.targetHover, this);
                }
            }
        }
        EventHandler.add(document, 'touchend', this.touchEnd, this);
        EventHandler.add(document, 'scroll', this.scrollHandler, this);
        EventHandler.add(document, 'keydown', this.keyDown, this);
    };
    Tooltip.prototype.getTriggerList = function (trigger) {
        if (trigger === 'Auto') {
            trigger = (Browser.isDevice) ? 'Hover' : 'Hover Focus';
        }
        return trigger.split(' ');
    };
    Tooltip.prototype.wireFocusEvents = function () {
        if (!isNullOrUndefined(this.target)) {
            var targetList = [].slice.call(this.element.querySelectorAll(this.target));
            for (var _i = 0, targetList_2 = targetList; _i < targetList_2.length; _i++) {
                var target = targetList_2[_i];
                EventHandler.add(target, 'focus', this.targetHover, this);
            }
        }
        else {
            EventHandler.add(this.element, 'focus', this.targetHover, this);
        }
    };
    Tooltip.prototype.wireMouseEvents = function (e, target) {
        if (this.tooltipEle) {
            if (!this.isSticky) {
                if (e.type === 'focus') {
                    EventHandler.add(target, 'blur', this.onMouseOut, this);
                }
                if (e.type === 'mouseover') {
                    EventHandler.add(target, 'mouseleave', this.onMouseOut, this);
                }
            }
            if (this.mouseTrail) {
                EventHandler.add(target, 'mousemove touchstart mouseenter', this.onMouseMove, this);
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
                EventHandler.remove(this.element, Browser.touchStartEvent, this.targetClick);
            }
            if (opensOn === 'Hover') {
                if (Browser.isDevice) {
                    if (this.touchModule) {
                        this.touchModule.destroy();
                    }
                    EventHandler.remove(this.element, Browser.touchEndEvent, this.touchEndHandler);
                }
                else {
                    EventHandler.remove(this.element, 'mouseover', this.targetHover);
                }
            }
        }
        EventHandler.remove(document, 'touchend', this.touchEnd);
        EventHandler.remove(document, 'scroll', this.scrollHandler);
        EventHandler.remove(document, 'keydown', this.keyDown);
    };
    Tooltip.prototype.unwireFocusEvents = function () {
        if (!isNullOrUndefined(this.target)) {
            var targetList = [].slice.call(this.element.querySelectorAll(this.target));
            for (var _i = 0, targetList_3 = targetList; _i < targetList_3.length; _i++) {
                var target = targetList_3[_i];
                EventHandler.remove(target, 'focus', this.targetHover);
            }
        }
        else {
            EventHandler.remove(this.element, 'focus', this.targetHover);
        }
    };
    Tooltip.prototype.unwireMouseEvents = function (target) {
        if (!this.isSticky) {
            var triggerList = this.getTriggerList(this.opensOn);
            for (var _i = 0, triggerList_3 = triggerList; _i < triggerList_3.length; _i++) {
                var opensOn = triggerList_3[_i];
                if (opensOn === 'Focus') {
                    EventHandler.remove(target, 'blur', this.onMouseOut);
                }
                if (opensOn === 'Hover' && !Browser.isDevice) {
                    EventHandler.remove(target, 'mouseleave', this.onMouseOut);
                }
            }
        }
        if (this.mouseTrail) {
            EventHandler.remove(target, 'mousemove touchstart mouseenter', this.onMouseMove);
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
                        this.tooltipEle.style.width = formatUnit(newProp.width);
                        this.reposition(targetElement);
                    }
                    break;
                case 'height':
                    if (this.tooltipEle && targetElement) {
                        this.tooltipEle.style.height = formatUnit(newProp.height);
                        this.reposition(targetElement);
                    }
                    break;
                case 'content':
                    if (this.tooltipEle) {
                        this.renderContent();
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
                            removeClass([this.tooltipEle], oldProp.cssClass.split(' '));
                        }
                        if (newProp.cssClass) {
                            addClass([this.tooltipEle], newProp.cssClass.split(' '));
                        }
                    }
                    break;
                case 'enableRtl':
                    if (this.tooltipEle) {
                        if (this.enableRtl) {
                            addClass([this.tooltipEle], RTL$1);
                        }
                        else {
                            removeClass([this.tooltipEle], RTL$1);
                        }
                    }
                    break;
            }
        }
    };
    /**
     * It is used to show the Tooltip on the specified target with specific animation settings.
     * @param element Target element where the Tooltip is to be displayed.
     * @param animation Sets the specific animation, while showing the Tooltip on the screen.
     * @return {void}
     */
    Tooltip.prototype.open = function (element, animation) {
        if (animation === void 0) { animation = this.animation.open; }
        if (element.style.display === 'none') {
            return;
        }
        this.showTooltip(element, animation);
    };
    /**
     * It is used to hide the Tooltip with specific animation effect.
     * @param animation Sets the specific animation when hiding Tooltip from the screen.
     * @return {void}
     */
    Tooltip.prototype.close = function (animation) {
        if (animation === void 0) { animation = this.animation.close; }
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
        _super.prototype.destroy.call(this);
        removeClass([this.element], ROOT$1);
        this.unwireEvents(this.opensOn);
        this.unwireMouseEvents(this.element);
        if (this.popupObj) {
            this.popupObj.destroy();
        }
        if (this.tooltipEle) {
            remove(this.tooltipEle);
        }
        this.tooltipEle = null;
        this.popupObj = null;
    };
    __decorate$2([
        Property('auto')
    ], Tooltip.prototype, "width", void 0);
    __decorate$2([
        Property('auto')
    ], Tooltip.prototype, "height", void 0);
    __decorate$2([
        Property()
    ], Tooltip.prototype, "content", void 0);
    __decorate$2([
        Property()
    ], Tooltip.prototype, "target", void 0);
    __decorate$2([
        Property('TopCenter')
    ], Tooltip.prototype, "position", void 0);
    __decorate$2([
        Property(0)
    ], Tooltip.prototype, "offsetX", void 0);
    __decorate$2([
        Property(0)
    ], Tooltip.prototype, "offsetY", void 0);
    __decorate$2([
        Property(true)
    ], Tooltip.prototype, "showTipPointer", void 0);
    __decorate$2([
        Property('Auto')
    ], Tooltip.prototype, "tipPointerPosition", void 0);
    __decorate$2([
        Property('Auto')
    ], Tooltip.prototype, "opensOn", void 0);
    __decorate$2([
        Property(false)
    ], Tooltip.prototype, "mouseTrail", void 0);
    __decorate$2([
        Property(false)
    ], Tooltip.prototype, "isSticky", void 0);
    __decorate$2([
        Complex({}, Animation$1)
    ], Tooltip.prototype, "animation", void 0);
    __decorate$2([
        Property(0)
    ], Tooltip.prototype, "openDelay", void 0);
    __decorate$2([
        Property(0)
    ], Tooltip.prototype, "closeDelay", void 0);
    __decorate$2([
        Property()
    ], Tooltip.prototype, "cssClass", void 0);
    __decorate$2([
        Event()
    ], Tooltip.prototype, "beforeRender", void 0);
    __decorate$2([
        Event()
    ], Tooltip.prototype, "beforeOpen", void 0);
    __decorate$2([
        Event()
    ], Tooltip.prototype, "afterOpen", void 0);
    __decorate$2([
        Event()
    ], Tooltip.prototype, "beforeClose", void 0);
    __decorate$2([
        Event()
    ], Tooltip.prototype, "afterClose", void 0);
    __decorate$2([
        Event()
    ], Tooltip.prototype, "beforeCollision", void 0);
    __decorate$2([
        Event()
    ], Tooltip.prototype, "created", void 0);
    __decorate$2([
        Event()
    ], Tooltip.prototype, "destroyed", void 0);
    Tooltip = __decorate$2([
        NotifyPropertyChanges
    ], Tooltip);
    return Tooltip;
}(Component));

/**
 * Tooltip modules
 */

var globalTimeOut = {};
var spinTemplate = null;
var spinCSSClass = null;
var DEFT_MAT_WIDTH = 30;
var DEFT_FAB_WIDTH = 30;
var DEFT_BOOT_WIDTH = 30;
var DEFT_BOOT4_WIDTH = 36;
var CLS_SHOWSPIN = 'e-spin-show';
var CLS_HIDESPIN = 'e-spin-hide';
var CLS_MATERIALSPIN = 'e-spin-material';
var CLS_FABRICSPIN = 'e-spin-fabric';
var CLS_BOOTSPIN = 'e-spin-bootstrap';
var CLS_BOOT4SPIN = 'e-spin-bootstrap4';
var CLS_HIGHCONTRASTSPIN = 'e-spin-high-contrast';
var CLS_SPINWRAP = 'e-spinner-pane';
var CLS_SPININWRAP = 'e-spinner-inner';
var CLS_SPINCIRCLE = 'e-path-circle';
var CLS_SPINARC = 'e-path-arc';
var CLS_SPINLABEL = 'e-spin-label';
var CLS_SPINTEMPLATE = 'e-spin-template';
/**
 * Create a spinner for the specified target element.
 * ```
 * E.g : createSpinner({ target: targetElement, width: '34px', label: 'Loading..' });
 * ```
 * @param args
 * @private
 */
function createSpinner(args, internalCreateElement) {
    var radius;
    var makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
    var container = create_spinner_container(args.target, makeElement);
    if (!isNullOrUndefined(args.cssClass)) {
        container.wrap.classList.add(args.cssClass);
    }
    if (!isNullOrUndefined(args.template) || !isNullOrUndefined(spinTemplate)) {
        var template = !isNullOrUndefined(args.template) ? args.template : spinTemplate;
        container.wrap.classList.add(CLS_SPINTEMPLATE);
        replaceContent(container.wrap, template, spinCSSClass);
    }
    else {
        var theme = !isNullOrUndefined(args.type) ? args.type : getTheme(container.wrap);
        var width = !isNullOrUndefined(args.width) ? args.width : undefined;
        radius = calculateRadius(width, theme);
        setTheme(theme, container.wrap, radius, makeElement);
        if (!isNullOrUndefined(args.label)) {
            createLabel(container.inner_wrap, args.label, makeElement);
        }
    }
    container.wrap.classList.add(CLS_HIDESPIN);
    container = null;
}
function createLabel(container, label, makeElement) {
    var labelEle = makeElement('div', {});
    labelEle.classList.add(CLS_SPINLABEL);
    labelEle.textContent = label;
    container.appendChild(labelEle);
    return labelEle;
}
function createMaterialSpinner(container, radius, makeElement) {
    var uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Material', radius: radius };
    create_material_element(container, uniqueID, makeElement, CLS_MATERIALSPIN);
    mat_calculate_attributes(radius, container, 'Material', CLS_MATERIALSPIN);
}
function createBootstrap4Spinner(container, radius, makeElement) {
    var uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Bootstrap4', radius: radius };
    create_material_element(container, uniqueID, makeElement, CLS_BOOT4SPIN);
    mat_calculate_attributes(radius, container, 'Bootstrap4', CLS_BOOT4SPIN);
}
function startMatAnimate(container, uniqueID, radius) {
    var globalObject = {};
    var timeOutVar = 0;
    globalTimeOut[uniqueID].timeOut = 0;
    globalObject[uniqueID] = globalVariables(uniqueID, radius, 0, 0);
    var spinnerInfo = { uniqueID: uniqueID, container: container, globalInfo: globalObject, timeOutVar: timeOutVar };
    animateMaterial(spinnerInfo);
}
function createFabricSpinner(container, radius, makeElement) {
    var uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Fabric', radius: radius };
    create_fabric_element(container, uniqueID, CLS_FABRICSPIN, makeElement);
    fb_calculate_attributes(radius, container, CLS_FABRICSPIN);
}
function createHighContrastSpinner(container, radius, makeElement) {
    var uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'HighContrast', radius: radius };
    create_fabric_element(container, uniqueID, CLS_HIGHCONTRASTSPIN, makeElement);
    fb_calculate_attributes(radius, container, CLS_HIGHCONTRASTSPIN);
}
function getTheme(container) {
    var theme = window.getComputedStyle(container, ':after').getPropertyValue('content');
    return theme.replace(/['"]+/g, '');
}
function setTheme(theme, container, radius, makeElement) {
    var innerContainer = container.querySelector('.' + CLS_SPININWRAP);
    var svg = innerContainer.querySelector('svg');
    if (!isNullOrUndefined(svg)) {
        innerContainer.removeChild(svg);
    }
    switch (theme) {
        case 'Material':
            createMaterialSpinner(innerContainer, radius, makeElement);
            break;
        case 'Fabric':
            createFabricSpinner(innerContainer, radius, makeElement);
            break;
        case 'Bootstrap':
            createBootstrapSpinner(innerContainer, radius, makeElement);
            break;
        case 'HighContrast':
            createHighContrastSpinner(innerContainer, radius, makeElement);
            break;
        case 'Bootstrap4':
            createBootstrap4Spinner(innerContainer, radius, makeElement);
            break;
    }
}
function createBootstrapSpinner(innerContainer, radius, makeElement) {
    var uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Bootstrap', radius: radius };
    create_bootstrap_element(innerContainer, uniqueID, makeElement);
    boot_calculate_attributes(innerContainer, radius);
}
function create_bootstrap_element(innerContainer, uniqueID, makeElement) {
    var svgBoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var viewBoxValue = 64;
    var trans = 32;
    var defaultRadius = 2;
    svgBoot.setAttribute('id', uniqueID);
    svgBoot.setAttribute('class', CLS_BOOTSPIN);
    svgBoot.setAttribute('viewBox', '0 0 ' + viewBoxValue + ' ' + viewBoxValue);
    innerContainer.insertBefore(svgBoot, innerContainer.firstChild);
    for (var item = 0; item <= 7; item++) {
        var bootCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bootCircle.setAttribute('class', CLS_SPINCIRCLE + '_' + item);
        bootCircle.setAttribute('r', defaultRadius + '');
        bootCircle.setAttribute('transform', 'translate(' + trans + ',' + trans + ')');
        svgBoot.appendChild(bootCircle);
    }
}
function boot_calculate_attributes(innerContainer, radius) {
    var svg = innerContainer.querySelector('svg.e-spin-bootstrap');
    svg.style.width = svg.style.height = radius + 'px';
    var x = 0;
    var y = 0;
    var rad = 24;
    var startArc = 90;
    for (var item = 0; item <= 7; item++) {
        var start = defineArcPoints(x, y, rad, startArc);
        var circleEle = svg.querySelector('.' + CLS_SPINCIRCLE + '_' + item);
        circleEle.setAttribute('cx', start.x + '');
        circleEle.setAttribute('cy', start.y + '');
        startArc = startArc >= 360 ? 0 : startArc;
        startArc = startArc + 45;
    }
}
function generateSeries(begin, stop) {
    var series = [];
    var start = begin;
    var end = stop;
    var increment = false;
    var count = 1;
    formSeries(start);
    function formSeries(i) {
        series.push(i);
        if (i !== end || count === 1) {
            if (i <= start && i > 1 && !increment) {
                i = parseFloat((i - 0.2).toFixed(2));
            }
            else if (i === 1) {
                i = 7;
                i = parseFloat((i + 0.2).toFixed(2));
                increment = true;
            }
            else if (i < 8 && increment) {
                i = parseFloat((i + 0.2).toFixed(2));
                if (i === 8) {
                    increment = false;
                }
            }
            else if (i <= 8 && !increment) {
                i = parseFloat((i - 0.2).toFixed(2));
            }
            ++count;
            formSeries(i);
        }
    }
    return series;
}
function animateBootstrap(innerContainer) {
    var svg = innerContainer.querySelector('svg.e-spin-bootstrap');
    var id = svg.getAttribute('id');
    for (var i = 1; i <= 8; i++) {
        var circleEle = (innerContainer.getElementsByClassName('e-path-circle_' +
            (i === 8 ? 0 : i))[0]);
        rotation(circleEle, i, i, generateSeries(i, i), id);
    }
    function rotation(circle, start, end, series, id) {
        var count = 0;
        boot_animate(start);
        function boot_animate(radius) {
            if (globalTimeOut[id].isAnimate) {
                ++count;
                circle.setAttribute('r', radius + '');
                if (count >= series.length) {
                    count = 0;
                }
                globalTimeOut[id].timeOut = setTimeout(boot_animate.bind(null, series[count]), 18);
            }
        }
    }
}
function replaceContent(container, template, cssClass) {
    if (!isNullOrUndefined(cssClass)) {
        container.classList.add(cssClass);
    }
    var inner = container.querySelector('.e-spinner-inner');
    inner.innerHTML = template;
}
function calculateRadius(width, theme) {
    var defaultSize;
    switch (theme) {
        case 'Material':
            defaultSize = DEFT_MAT_WIDTH;
            break;
        case 'Fabric':
            defaultSize = DEFT_FAB_WIDTH;
            break;
        case 'Bootstrap4':
            defaultSize = DEFT_BOOT4_WIDTH;
            break;
        default:
            defaultSize = DEFT_BOOT_WIDTH;
    }
    width = width ? parseFloat(width + '') : defaultSize;
    return theme === 'Bootstrap' ? width : width / 2;
}
function globalVariables(id, radius, count, previousId) {
    return {
        radius: radius,
        count: count,
        previousId: previousId
    };
}
function random_generator() {
    var random = '';
    var combine = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        random += combine.charAt(Math.floor(Math.random() * combine.length));
    }
    return random;
}
function create_fabric_element(innerCon, uniqueID, themeClass, makeElement) {
    var svgFabric = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgFabric.setAttribute('id', uniqueID);
    svgFabric.setAttribute('class', themeClass);
    var fabricCirclePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fabricCirclePath.setAttribute('class', CLS_SPINCIRCLE);
    var fabricCircleArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fabricCircleArc.setAttribute('class', CLS_SPINARC);
    innerCon.insertBefore(svgFabric, innerCon.firstChild);
    svgFabric.appendChild(fabricCirclePath);
    svgFabric.appendChild(fabricCircleArc);
}
function create_material_element(innerContainer, uniqueID, makeElement, cls) {
    var svgMaterial = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgMaterial.setAttribute('class', cls);
    svgMaterial.setAttribute('id', uniqueID);
    var matCirclePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    matCirclePath.setAttribute('class', CLS_SPINCIRCLE);
    innerContainer.insertBefore(svgMaterial, innerContainer.firstChild);
    svgMaterial.appendChild(matCirclePath);
}
function create_spinner_container(target, makeElement) {
    var spinnerContainer = makeElement('div', {});
    spinnerContainer.classList.add(CLS_SPINWRAP);
    var spinnerInnerContainer = makeElement('div', {});
    spinnerInnerContainer.classList.add(CLS_SPININWRAP);
    target.appendChild(spinnerContainer);
    spinnerContainer.appendChild(spinnerInnerContainer);
    return { wrap: spinnerContainer, inner_wrap: spinnerInnerContainer };
}
function animateMaterial(spinnerInfo) {
    var start = 1;
    var end = 149;
    var duration = 1333;
    var max = 75;
    createCircle(start, end, easeAnimation, duration, spinnerInfo.globalInfo[spinnerInfo.uniqueID].count, max, spinnerInfo);
    spinnerInfo.globalInfo[spinnerInfo.uniqueID].count = ++spinnerInfo.globalInfo[spinnerInfo.uniqueID].count % 4;
}
function createCircle(start, end, easing, duration, count, max, spinnerInfo) {
    var id = ++spinnerInfo.globalInfo[spinnerInfo.uniqueID].previousId;
    var startTime = new Date().getTime();
    var change = end - start;
    var diameter = getSize((spinnerInfo.globalInfo[spinnerInfo.uniqueID].radius * 2) + '');
    var strokeSize = getStrokeSize(diameter);
    var rotate = -90 * (spinnerInfo.globalInfo[spinnerInfo.uniqueID].count || 0);
    mat_animation(spinnerInfo);
    function mat_animation(spinnerInfo) {
        var currentTime = Math.max(0, Math.min(new Date().getTime() - startTime, duration));
        updatePath(easing(currentTime, start, change, duration), spinnerInfo.container);
        if (id === spinnerInfo.globalInfo[spinnerInfo.uniqueID].previousId && currentTime < duration) {
            globalTimeOut[spinnerInfo.uniqueID].timeOut = setTimeout(mat_animation.bind(null, spinnerInfo), 1);
        }
        else {
            animateMaterial(spinnerInfo);
        }
    }
    function updatePath(value, container) {
        if ((!isNullOrUndefined(container.querySelector('svg.e-spin-material')))
            && (!isNullOrUndefined(container.querySelector('svg.e-spin-material').querySelector('path.e-path-circle')))) {
            var svg = container.querySelector('svg.e-spin-material');
            var path = svg.querySelector('path.e-path-circle');
            path.setAttribute('stroke-dashoffset', getDashOffset(diameter, strokeSize, value, max) + '');
            path.setAttribute('transform', 'rotate(' + (rotate) + ' ' + diameter / 2 + ' ' + diameter / 2 + ')');
        }
    }
}
function mat_calculate_attributes(radius, container, type, cls) {
    var diameter = radius * 2;
    var svg = container.querySelector('svg.' + cls);
    var path = svg.querySelector('path.e-path-circle');
    var strokeSize = getStrokeSize(diameter);
    var transformOrigin = (diameter / 2) + 'px';
    svg.setAttribute('viewBox', '0 0 ' + diameter + ' ' + diameter);
    svg.style.width = svg.style.height = diameter + 'px';
    svg.style.transformOrigin = transformOrigin + ' ' + transformOrigin + ' ' + transformOrigin;
    path.setAttribute('d', drawArc(diameter, strokeSize));
    if (type === 'Material') {
        path.setAttribute('stroke-width', strokeSize + '');
        path.setAttribute('stroke-dasharray', ((diameter - strokeSize) * Math.PI * 0.75) + '');
        path.setAttribute('stroke-dashoffset', getDashOffset(diameter, strokeSize, 1, 75) + '');
    }
}
function getSize(value) {
    var parsed = parseFloat(value);
    return parsed;
}
function drawArc(diameter, strokeSize) {
    var radius = diameter / 2;
    var offset = strokeSize / 2;
    return 'M' + radius + ',' + offset
        + 'A' + (radius - offset) + ',' + (radius - offset) + ' 0 1 1 ' + offset + ',' + radius;
}
function getStrokeSize(diameter) {
    return 10 / 100 * diameter;
}
function getDashOffset(diameter, strokeSize, value, max) {
    return (diameter - strokeSize) * Math.PI * ((3 * (max) / 100) - (value / 100));
}
function easeAnimation(current, start, change, duration) {
    var timestamp = (current /= duration) * current;
    var timecount = timestamp * current;
    return start + change * (6 * timecount * timestamp + -15 * timestamp * timestamp + 10 * timecount);
}
function fb_calculate_attributes(radius, innerConainer, trgClass) {
    var centerX = radius;
    var centerY = radius;
    var diameter = radius * 2;
    var startArc = 315;
    var endArc = 45;
    var svg = innerConainer.querySelector('.' + trgClass);
    var circle = svg.querySelector('.e-path-circle');
    var path = svg.querySelector('.e-path-arc');
    var transformOrigin = (diameter / 2) + 'px';
    circle.setAttribute('d', defineCircle(centerX, centerY, radius));
    path.setAttribute('d', defineArc(centerX, centerY, radius, startArc, endArc));
    svg.setAttribute('viewBox', '0 0 ' + diameter + ' ' + diameter);
    svg.style.transformOrigin = transformOrigin + ' ' + transformOrigin + ' ' + transformOrigin;
    svg.style.width = svg.style.height = diameter + 'px';
}
function defineArcPoints(centerX, centerY, radius, angle) {
    var radians = (angle - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(radians)),
        y: centerY + (radius * Math.sin(radians))
    };
}
function defineArc(x, y, radius, startArc, endArc) {
    var start = defineArcPoints(x, y, radius, endArc);
    var end = defineArcPoints(x, y, radius, startArc);
    var d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, 0, 0, end.x, end.y
    ].join(' ');
    return d;
}
function defineCircle(x, y, radius) {
    var d = [
        'M', x, y,
        'm', -radius, 0,
        'a', radius, radius, 0, 1, 0, radius * 2, 0,
        'a', radius, radius, 0, 1, 0, -radius * 2, 0,
    ].join(' ');
    return d;
}
/**
 * Function to show the Spinner.
 * @param container - Specify the target of the Spinner.
 * @private
 */
function showSpinner(container) {
    showHideSpinner(container, false);
    container = null;
}
function showHideSpinner(container, isHide) {
    var spinnerWrap = container.classList.contains(CLS_SPINWRAP) ? container :
        container.querySelector('.' + CLS_SPINWRAP);
    var inner = spinnerWrap.querySelector('.' + CLS_SPININWRAP);
    var spinCheck;
    spinCheck = isHide ? !spinnerWrap.classList.contains(CLS_SPINTEMPLATE) && !spinnerWrap.classList.contains(CLS_HIDESPIN) :
        !spinnerWrap.classList.contains(CLS_SPINTEMPLATE) && !spinnerWrap.classList.contains(CLS_SHOWSPIN);
    if (spinCheck) {
        var svgEle = spinnerWrap.querySelector('svg');
        if (isNullOrUndefined(svgEle)) {
            return;
        }
        var id = svgEle.getAttribute('id');
        globalTimeOut[id].isAnimate = !isHide;
        switch (globalTimeOut[id].type) {
            case 'Material':
                isHide ? clearTimeout(globalTimeOut[id].timeOut) : startMatAnimate(inner, id, globalTimeOut[id].radius);
                break;
            case 'Bootstrap':
                isHide ? clearTimeout(globalTimeOut[id].timeOut) : animateBootstrap(inner);
                break;
        }
    }
    isHide ? classList(spinnerWrap, [CLS_HIDESPIN], [CLS_SHOWSPIN]) : classList(spinnerWrap, [CLS_SHOWSPIN], [CLS_HIDESPIN]);
    container = null;
}
/**
 * Function to hide the Spinner.
 * @param container - Specify the target of the Spinner.
 * @private
 */
function hideSpinner(container) {
    showHideSpinner(container, true);
    container = null;
}
/**
 * Function to change the Spinners in a page globally from application end.
 * ```
 * E.g : setSpinner({ cssClass: 'custom-css'; type: 'Material' });
 * ```
 * @param args
 * @private
 */
function setSpinner(args, internalCreateElement) {
    var makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
    if (args.template !== undefined) {
        spinTemplate = args.template;
        if (args.template !== undefined) {
            spinCSSClass = args.cssClass;
        }
    }
    var container = document.querySelectorAll('.' + CLS_SPINWRAP);
    for (var index = 0; index < container.length; index++) {
        ensureTemplate(args.template, container[index], args.type, args.cssClass, makeElement);
    }
}
function ensureTemplate(template, container, theme, cssClass, makeEle) {
    if (isNullOrUndefined(template) && !container.classList.contains(CLS_SPINTEMPLATE)) {
        replaceTheme(container, theme, cssClass, makeEle);
        if (container.classList.contains(CLS_SHOWSPIN)) {
            container.classList.remove(CLS_SHOWSPIN);
            showSpinner(container);
        }
        else {
            container.classList.remove(CLS_HIDESPIN);
            hideSpinner(container);
        }
    }
    else {
        spinTemplate = template;
        if (!isNullOrUndefined(cssClass)) {
            spinCSSClass = cssClass;
        }
    }
}
function replaceTheme(container, theme, cssClass, makeEle) {
    if (!isNullOrUndefined(cssClass)) {
        container.classList.add(cssClass);
    }
    var svgElement = container.querySelector('svg');
    var radius = theme === 'Bootstrap' ? parseFloat(svgElement.style.height) : parseFloat(svgElement.style.height) / 2;
    var classNames = svgElement.getAttribute('class');
    var svgClassList = classNames.split(/\s/);
    if (svgClassList.indexOf('e-spin-material') >= 0) {
        var id = svgElement.getAttribute('id');
        clearTimeout(globalTimeOut[id].timeOut);
    }
    setTheme(theme, container, radius, makeEle);
}

/**
 * spinner modules
 */

/**
 * Popup Components
 */

export { PositionData, Popup, getScrollableParent, getZindexPartial, getMaxZindex, calculateRelativeBasedPosition, calculatePosition, fit, isCollide, flip, ButtonProps, AnimationSettings, Dialog, DialogUtility, Animation$1 as Animation, Tooltip, createSpinner, showSpinner, hideSpinner, setSpinner };
//# sourceMappingURL=ej2-popups.es5.js.map
