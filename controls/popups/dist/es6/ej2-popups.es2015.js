import { Animation, Browser, ChildProperty, Collection, Complex, Component, Draggable, Event, EventHandler, L10n, NotifyPropertyChanges, Property, SanitizeHtmlHelper, Touch, addClass, append, attributes, classList, closest, compile, createElement, detach, extend, formatUnit, getUniqueID, isBlazor, isNullOrUndefined, prepend, remove, removeClass, resetBlazorTemplate, setStyleAttribute, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';

/**
 * Position library
 */
let elementRect;
let popupRect;
let element;
let parentDocument;
let fixedParent = false;
function calculateRelativeBasedPosition(anchor, element) {
    let fixedElement = false;
    let anchorPos = { left: 0, top: 0 };
    let tempAnchor = anchor;
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
    let pos = { left: 0, top: 0 };
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
let parentDocument$1;
let targetContainer;
function fit(element, viewPortElement = null, axis = { X: false, Y: false }, position) {
    if (!axis.Y && !axis.X) {
        return { left: 0, top: 0 };
    }
    let elemData = element.getBoundingClientRect();
    targetContainer = viewPortElement;
    parentDocument$1 = element.ownerDocument;
    if (!position) {
        position = calculatePosition(element, 'left', 'top');
    }
    if (axis.X) {
        let containerWidth = targetContainer ? getTargetContainerWidth() : getViewPortWidth();
        let containerLeft = ContainerLeft();
        let containerRight = ContainerRight();
        let overLeft = containerLeft - position.left;
        let overRight = position.left + elemData.width - containerRight;
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
        let containerHeight = targetContainer ? getTargetContainerHeight() : getViewPortHeight();
        let containerTop = ContainerTop();
        let containerBottom = ContainerBottom();
        let overTop = containerTop - position.top;
        let overBottom = position.top + elemData.height - containerBottom;
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
function isCollide(element, viewPortElement = null, x, y) {
    let elemOffset = calculatePosition(element, 'left', 'top');
    if (x) {
        elemOffset.left = x;
    }
    if (y) {
        elemOffset.top = y;
    }
    let data = [];
    targetContainer = viewPortElement;
    parentDocument$1 = element.ownerDocument;
    let elementRect = element.getBoundingClientRect();
    let top = elemOffset.top;
    let left = elemOffset.left;
    let right = elemOffset.left + elementRect.width;
    let bottom = elemOffset.top + elementRect.height;
    let yAxis = topCollideCheck(top, bottom);
    let xAxis = leftCollideCheck(left, right);
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
function flip(element, target, offsetX, offsetY, positionX, positionY, viewPortElement = null, axis = { X: true, Y: true }, fixedParent) {
    if (!target || !element || !positionX || !positionY || (!axis.X && !axis.Y)) {
        return;
    }
    let tEdge = { TL: null,
        TR: null,
        BL: null,
        BR: null };
    let eEdge = {
        TL: null,
        TR: null,
        BL: null,
        BR: null
    };
    let elementRect = element.getBoundingClientRect();
    let pos = {
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
    let left = 0;
    let top = 0;
    if (element.offsetParent != null
        && (getComputedStyle(element.offsetParent).position === 'absolute' ||
            getComputedStyle(element.offsetParent).position === 'relative')) {
        let data = calculatePosition(element.offsetParent, 'left', 'top', false, elementRect);
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
    let leftSide = false;
    let rightSide = false;
    if (((left - getBodyScrollLeft$1()) < ContainerLeft())) {
        leftSide = true;
    }
    if (right > ContainerRight()) {
        rightSide = true;
    }
    return { leftSide: leftSide, rightSide: rightSide };
}
function leftFlip(target, edge, tEdge, pos, elementRect, deepCheck) {
    let collideSide = leftCollideCheck(edge.TL.left, edge.TR.left);
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
    let collideSide = topCollideCheck(edge.TL.top, edge.BL.top);
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
    let topSide = false;
    let bottomSide = false;
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
    let windowWidth = window.innerWidth;
    let offsetWidth = (isNullOrUndefined(document.documentElement)) ? 0 : document.documentElement.offsetWidth;
    return windowWidth - (windowWidth - offsetWidth);
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Specifies the offset position values.
 */
class PositionData extends ChildProperty {
}
__decorate([
    Property('left')
], PositionData.prototype, "X", void 0);
__decorate([
    Property('top')
], PositionData.prototype, "Y", void 0);
// don't use space in classNames
const CLASSNAMES = {
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
let Popup = class Popup extends Component {
    constructor(element, options) {
        super(options, element);
    }
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
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
                    let x = newProp.offsetX - oldProp.offsetX;
                    this.element.style.left = (parseInt(this.element.style.left, 10) + (x)).toString() + 'px';
                    break;
                case 'offsetY':
                    let y = newProp.offsetY - oldProp.offsetY;
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
    }
    /**
     * gets the Component module name.
     * @private
     */
    getModuleName() {
        return 'popup';
    }
    /**
     * To resolve if any collision occurs.
     */
    resolveCollision() {
        this.checkCollision();
    }
    /**
     * gets the persisted state properties of the Component.
     */
    getPersistData() {
        return this.addOnPersist([]);
    }
    /**
     * To destroy the control.
     */
    destroy() {
        this.element.classList.remove(CLASSNAMES.ROOT, CLASSNAMES.RTL, CLASSNAMES.OPEN, CLASSNAMES.CLOSE);
        this.unwireEvents();
        super.destroy();
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    render() {
        this.element.classList.add(CLASSNAMES.ROOT);
        let styles = {};
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
    }
    wireEvents() {
        if (Browser.isDevice) {
            EventHandler.add(window, 'orientationchange', this.orientationOnChange, this);
        }
        if (this.actionOnScroll !== 'none') {
            this.wireScrollEvents();
        }
    }
    wireScrollEvents() {
        if (this.getRelateToElement()) {
            for (let parent of this.getScrollableParent(this.getRelateToElement())) {
                EventHandler.add(parent, 'scroll', this.scrollRefresh, this);
            }
        }
    }
    unwireEvents() {
        if (Browser.isDevice) {
            EventHandler.remove(window, 'orientationchange', this.orientationOnChange);
        }
        if (this.actionOnScroll !== 'none') {
            this.unwireScrollEvents();
        }
    }
    unwireScrollEvents() {
        if (this.getRelateToElement()) {
            for (let parent of this.getScrollableParent(this.getRelateToElement())) {
                EventHandler.remove(parent, 'scroll', this.scrollRefresh);
            }
        }
    }
    getRelateToElement() {
        let relateToElement = this.relateTo === '' || isNullOrUndefined(this.relateTo) ?
            document.body : this.relateTo;
        this.setProperties({ relateTo: relateToElement }, true);
        return ((typeof this.relateTo) === 'string') ?
            document.querySelector(this.relateTo) : this.relateTo;
    }
    scrollRefresh(e) {
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
                let targetVisible = this.isElementOnViewport(this.getRelateToElement(), e.target);
                if (!targetVisible && !this.targetInvisibleStatus) {
                    this.trigger('targetExitViewport');
                    this.targetInvisibleStatus = true;
                }
                else if (targetVisible) {
                    this.targetInvisibleStatus = false;
                }
            }
        }
    }
    /**
     * This method is to get the element visibility on viewport when scroll
     * the page. This method will returns true even though 1 px of element
     * part is in visible.
     */
    isElementOnViewport(relateToElement, scrollElement) {
        let scrollParents = this.getScrollableParent(relateToElement);
        for (let parent = 0; parent < scrollParents.length; parent++) {
            if (this.isElementVisible(relateToElement, scrollParents[parent])) {
                continue;
            }
            else {
                return false;
            }
        }
        return true;
    }
    isElementVisible(relateToElement, scrollElement) {
        let rect = this.checkGetBoundingClientRect(relateToElement);
        if (!rect.height || !rect.width) {
            return false;
        }
        if (!isNullOrUndefined(this.checkGetBoundingClientRect(scrollElement))) {
            let parent = scrollElement.getBoundingClientRect();
            return !(rect.bottom < parent.top) &&
                (!(rect.bottom > parent.bottom) &&
                    (!(rect.right > parent.right) &&
                        !(rect.left < parent.left)));
        }
        else {
            let win = window;
            let windowView = {
                top: win.scrollY,
                left: win.scrollX,
                right: win.scrollX + win.outerWidth,
                bottom: win.scrollY + win.outerHeight
            };
            let off = calculatePosition(relateToElement);
            let ele = {
                top: off.top,
                left: off.left,
                right: off.left + rect.width,
                bottom: off.top + rect.height
            };
            let elementView = {
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
    }
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        //There is no event handler
    }
    setEnableRtl() {
        this.reposition();
        this.enableRtl ? this.element.classList.add(CLASSNAMES.RTL) : this.element.classList.remove(CLASSNAMES.RTL);
    }
    setContent() {
        if (!isNullOrUndefined(this.content)) {
            this.element.innerHTML = '';
            if (typeof (this.content) === 'string') {
                this.element.textContent = this.content;
            }
            else {
                this.element.appendChild(this.content);
            }
        }
    }
    orientationOnChange() {
        setTimeout(() => {
            this.refreshPosition();
        }, 200);
    }
    /**
     * Based on the `relative` element and `offset` values, `Popup` element position will refreshed.
     */
    refreshPosition(target, collision) {
        if (!isNullOrUndefined(target)) {
            this.checkFixedParent(target);
        }
        this.reposition();
        if (!collision) {
            this.checkCollision();
        }
    }
    reposition() {
        let pos;
        let position;
        let relateToElement = this.getRelateToElement();
        if (typeof this.position.X === 'number' && typeof this.position.Y === 'number') {
            pos = { left: this.position.X, top: this.position.Y };
        }
        else if ((typeof this.position.X === 'string' && typeof this.position.Y === 'number') ||
            (typeof this.position.X === 'number' && typeof this.position.Y === 'string')) {
            let display = this.element.style.display;
            let parentDisplay;
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
            let display = this.element.style.display;
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
    }
    checkGetBoundingClientRect(ele) {
        let eleRect;
        try {
            eleRect = ele.getBoundingClientRect();
            return eleRect;
        }
        catch (error) {
            return null;
        }
    }
    getAnchorPosition(anchorEle, ele, position, offsetX, offsetY) {
        let eleRect = this.checkGetBoundingClientRect(ele);
        let anchorRect = this.checkGetBoundingClientRect(anchorEle);
        if (isNullOrUndefined(eleRect) || isNullOrUndefined(anchorRect)) {
            return null;
        }
        let anchor = anchorEle;
        let anchorPos = { left: 0, top: 0 };
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
    }
    callFlip(param) {
        let relateToElement = this.getRelateToElement();
        flip(this.element, relateToElement, this.offsetX, this.offsetY, this.position.X, this.position.Y, this.viewPortElement, param, this.fixedParent);
    }
    callFit(param) {
        if (isCollide(this.element, this.viewPortElement).length !== 0) {
            if (isNullOrUndefined(this.viewPortElement)) {
                let data = fit(this.element, this.viewPortElement, param);
                if (param.X) {
                    this.element.style.left = data.left + 'px';
                }
                if (param.Y) {
                    this.element.style.top = data.top + 'px';
                }
            }
            else {
                let elementRect = this.checkGetBoundingClientRect(this.element);
                let viewPortRect = this.checkGetBoundingClientRect(this.viewPortElement);
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
    }
    checkCollision() {
        let horz = this.collision.X;
        let vert = this.collision.Y;
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
    }
    /**
     * Shows the popup element from screen.
     * @param { AnimationModel | Function } collisionOrAnimationOptions? - To pass animation options or collision function.
     * @param { Function } collision? - To pass the collision function.
     * @param { HTMLElement } relativeElement? - To calculate the zIndex value dynamically.
     */
    show(animationOptions, relativeElement) {
        this.wireEvents();
        if (this.zIndex === 1000 || !isNullOrUndefined(relativeElement)) {
            let zIndexElement = (isNullOrUndefined(relativeElement)) ? this.element : relativeElement;
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
            animationOptions.begin = () => {
                if (!this.isDestroyed) {
                    removeClass([this.element], CLASSNAMES.CLOSE);
                    addClass([this.element], CLASSNAMES.OPEN);
                }
            };
            animationOptions.end = () => {
                if (!this.isDestroyed) {
                    this.trigger('open');
                }
            };
            new Animation(animationOptions).animate(this.element);
        }
        else {
            removeClass([this.element], CLASSNAMES.CLOSE);
            addClass([this.element], CLASSNAMES.OPEN);
            this.trigger('open');
        }
    }
    /**
     * Hides the popup element from screen.
     * @param { AnimationModel } animationOptions? - To give the animation options.
     */
    hide(animationOptions) {
        animationOptions = (!isNullOrUndefined(animationOptions) && typeof animationOptions === 'object') ?
            animationOptions : this.hideAnimation;
        if (!isNullOrUndefined(animationOptions)) {
            animationOptions.end = () => {
                if (!this.isDestroyed) {
                    removeClass([this.element], CLASSNAMES.OPEN);
                    addClass([this.element], CLASSNAMES.CLOSE);
                    this.trigger('close');
                }
            };
            new Animation(animationOptions).animate(this.element);
        }
        else {
            removeClass([this.element], CLASSNAMES.OPEN);
            addClass([this.element], CLASSNAMES.CLOSE);
            this.trigger('close');
        }
        this.unwireEvents();
    }
    /**
     * Gets scrollable parent elements for the given element.
     * @param { HTMLElement } element - Specify the element to get the scrollable parents of it.
     */
    getScrollableParent(element) {
        this.checkFixedParent(element);
        return getScrollableParent(element, this.fixedParent);
    }
    checkFixedParent(element) {
        let parent = element.parentElement;
        while (parent && parent.tagName !== 'HTML') {
            let parentStyle = getComputedStyle(parent);
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
/**
 * Gets scrollable parent elements for the given element.
 * @param { HTMLElement } element - Specify the element to get the scrollable parents of it.
 * @private
 */
function getScrollableParent(element, fixedParent) {
    let eleStyle = getComputedStyle(element);
    let scrollParents = [];
    let overflowRegex = /(auto|scroll)/;
    let parent = element.parentElement;
    while (parent && parent.tagName !== 'HTML') {
        let parentStyle = getComputedStyle(parent);
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
    let parent = element.parentElement;
    let parentZindex = [];
    while (parent) {
        if (parent.tagName !== 'BODY') {
            let index = document.defaultView.getComputedStyle(parent, null).getPropertyValue('z-index');
            let position = document.defaultView.getComputedStyle(parent, null).getPropertyValue('position');
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
    let childrenZindex = [];
    for (let i = 0; i < document.body.children.length; i++) {
        if (!element.isEqualNode(document.body.children[i])) {
            let index = document.defaultView.getComputedStyle(document.body.children[i], null).getPropertyValue('z-index');
            let position = document.defaultView.getComputedStyle(document.body.children[i], null).getPropertyValue('position');
            if (index !== 'auto' && position !== 'static') {
                childrenZindex.push(index);
            }
        }
    }
    childrenZindex.push('999');
    let siblingsZindex = [];
    if (!isNullOrUndefined(element.parentElement) && element.parentElement.tagName !== 'BODY') {
        let childNodes = [].slice.call(element.parentElement.children);
        for (let i = 0; i < childNodes.length; i++) {
            let index = document.defaultView.getComputedStyle(childNodes[i], null).getPropertyValue('z-index');
            let position = document.defaultView.getComputedStyle(childNodes[i], null).getPropertyValue('position');
            if (index !== 'auto' && position !== 'static') {
                siblingsZindex.push(index);
            }
        }
    }
    let finalValue = parentZindex.concat(childrenZindex, siblingsZindex);
    let currentZindexValue = Math.max.apply(Math, finalValue) + 1;
    // Checking the max-zindex value
    return currentZindexValue > 2147483647 ? 2147483647 : currentZindexValue;
}
/**
 * Gets the maximum z-index of the page.
 * @param { HTMLElement } tagName - Specify the tagName to get the maximum z-index of it.
 * @private
 */
function getMaxZindex(tagName = ['*']) {
    let maxZindex = [];
    for (let i = 0; i < tagName.length; i++) {
        let elements = document.getElementsByTagName(tagName[i]);
        for (let i = 0; i < elements.length; i++) {
            let index = document.defaultView.getComputedStyle(elements[i], null).getPropertyValue('z-index');
            let position = document.defaultView.getComputedStyle(elements[i], null).getPropertyValue('position');
            if (index !== 'auto' && position !== 'static') {
                maxZindex.push(index);
            }
        }
    }
    let currentZindexValue = Math.max.apply(Math, maxZindex) + 1;
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
let elementClass = ['north-west', 'north', 'north-east', 'west', 'east', 'south-west', 'south', 'south-east'];
let targetElement;
let selectedHandler;
let originalWidth = 0;
let originalHeight = 0;
let originalX = 0;
let originalY = 0;
let originalMouseX = 0;
let originalMouseY = 0;
const RESIZE_HANDLER = 'e-resize-handle';
const FOCUSED_HANDLER = 'e-focused-handle';
let RESTRICT_LEFT = ['e-restrict-left'];
const RESIZE_WITHIN_VIEWPORT = 'e-resize-viewport';
let minHeight;
let maxHeight;
let minWidth;
let maxWidth;
let containerElement;
let resizeStart = null;
let resize = null;
let resizeEnd = null;
let resizeWestWidth;
let setLeft = true;
let previousWidth = 0;
let setWidth = true;
// tslint:disable-next-line
let proxy;
let dialogBorderResize = ['north', 'west', 'east', 'south'];
function createResize(args) {
    resizeStart = args.resizeBegin;
    resize = args.resizing;
    resizeEnd = args.resizeComplete;
    targetElement = getDOMElement(args.element);
    containerElement = getDOMElement(args.boundary);
    let directions = args.direction.split(' ');
    for (let i = 0; i < directions.length; i++) {
        if (dialogBorderResize.indexOf(directions[i]) >= 0 && directions[i]) {
            setBorderResizeElm(directions[i]);
        }
        else if (directions[i].trim() !== '') {
            let resizeHandler = createElement('div', { className: 'e-icons ' + RESIZE_HANDLER + ' ' + 'e-' + directions[i] });
            targetElement.appendChild(resizeHandler);
        }
    }
    minHeight = args.minHeight;
    minWidth = args.minWidth;
    maxWidth = args.maxWidth;
    maxHeight = args.maxHeight;
    if (args.proxy && args.proxy.element && args.proxy.element.classList.contains('e-dialog')) {
        wireEvents(args.proxy);
    }
    else {
        wireEvents();
    }
}
function setBorderResizeElm(direction) {
    calculateValues();
    let borderBottom = createElement('span', {
        attrs: {
            'unselectable': 'on', 'contenteditable': 'false'
        }
    });
    borderBottom.setAttribute('class', 'e-dialog-border-resize e-' + direction);
    if (direction === 'south') {
        borderBottom.style.height = '2px';
        borderBottom.style.width = '100%';
        borderBottom.style.bottom = '0px';
        borderBottom.style.left = '0px';
    }
    if (direction === 'north') {
        borderBottom.style.height = '2px';
        borderBottom.style.width = '100%';
        borderBottom.style.top = '0px';
        borderBottom.style.left = '0px';
    }
    if (direction === 'east') {
        borderBottom.style.height = '100%';
        borderBottom.style.width = '2px';
        borderBottom.style.right = '0px';
        borderBottom.style.top = '0px';
    }
    if (direction === 'west') {
        borderBottom.style.height = '100%';
        borderBottom.style.width = '2px';
        borderBottom.style.left = '0px';
        borderBottom.style.top = '0px';
    }
    targetElement.appendChild(borderBottom);
}
function getDOMElement(element) {
    let domElement;
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
// tslint:disable-next-line
function wireEvents(args) {
    if (isNullOrUndefined(args)) {
        args = this;
    }
    let resizers = targetElement.querySelectorAll('.' + RESIZE_HANDLER);
    for (let i = 0; i < resizers.length; i++) {
        selectedHandler = resizers[i];
        EventHandler.add(selectedHandler, 'mousedown', onMouseDown, args);
        let eventName = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
        EventHandler.add(selectedHandler, eventName, onTouchStart, args);
    }
    let borderResizers = targetElement.querySelectorAll('.e-dialog-border-resize');
    if (!isNullOrUndefined(borderResizers)) {
        for (let i = 0; i < borderResizers.length; i++) {
            selectedHandler = borderResizers[i];
            EventHandler.add(selectedHandler, 'mousedown', onMouseDown, args);
            let eventName = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
            EventHandler.add(selectedHandler, eventName, onTouchStart, args);
        }
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
        proxy = this;
        if (resizeStart(e, proxy) === true) {
            return;
        }
    }
    let target = (isNullOrUndefined(containerElement)) ? document : containerElement;
    EventHandler.add(target, 'mousemove', onMouseMove, this);
    EventHandler.add(document, 'mouseup', onMouseUp, this);
    for (let i = 0; i < RESTRICT_LEFT.length; i++) {
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
    let touchMoveEvent = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
    let touchEndEvent = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
    let target = (isNullOrUndefined(containerElement)) ? document : containerElement;
    EventHandler.remove(target, 'mousemove', onMouseMove);
    EventHandler.remove(target, touchMoveEvent, onMouseMove);
    let eventName = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
    EventHandler.remove(target, eventName, onMouseMove);
    if (!isNullOrUndefined(document.body.querySelector('.' + FOCUSED_HANDLER))) {
        document.body.querySelector('.' + FOCUSED_HANDLER).classList.remove(FOCUSED_HANDLER);
    }
    if (!isNullOrUndefined(resizeEnd)) {
        proxy = this;
        resizeEnd(e, proxy);
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
    let coordinates = e.touches ? e.changedTouches[0] : e;
    originalMouseX = coordinates.pageX;
    originalMouseY = coordinates.pageY;
    if (!isNullOrUndefined(resizeStart)) {
        proxy = this;
        if (resizeStart(e, proxy) === true) {
            return;
        }
    }
    let touchMoveEvent = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
    let touchEndEvent = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
    let target = (isNullOrUndefined(containerElement)) ? document : containerElement;
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
        let resizeTowards = '';
        for (let i = 0; i < elementClass.length; i++) {
            if (selectedHandler.classList.contains('e-' + elementClass[i])) {
                resizeTowards = elementClass[i];
            }
        }
        if (!isNullOrUndefined(resize)) {
            proxy = this;
            resize(e, proxy);
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
    let documentHeight = document.documentElement.clientHeight;
    let calculateValue = false;
    let containerRectValues;
    let coordinates = e.touches ? e.changedTouches[0] : e;
    let currentpageY = coordinates.pageY;
    let targetRectValues = getClientRectValues(targetElement);
    if (!isNullOrUndefined(containerElement)) {
        containerRectValues = getClientRectValues(containerElement);
    }
    if (!isNullOrUndefined(containerElement)) {
        calculateValue = true;
    }
    else if (isNullOrUndefined(containerElement) && ((documentHeight - currentpageY) >= 0 || (targetRectValues.top < 0))) {
        calculateValue = true;
    }
    let calculatedHeight = originalHeight + (currentpageY - originalMouseY);
    calculatedHeight = (calculatedHeight > minHeight) ? calculatedHeight : minHeight;
    let containerTop = 0;
    if (!isNullOrUndefined(containerElement)) {
        containerTop = containerRectValues.top;
    }
    let borderValue = isNullOrUndefined(containerElement) ? 0 : containerElement.offsetHeight - containerElement.clientHeight;
    let topWithoutborder = (targetRectValues.top - containerTop) - (borderValue / 2);
    topWithoutborder = (topWithoutborder < 0) ? 0 : topWithoutborder;
    if (targetRectValues.top > 0 && (topWithoutborder + calculatedHeight) > maxHeight) {
        calculateValue = false;
        if (targetElement.classList.contains(RESIZE_WITHIN_VIEWPORT)) {
            return;
        }
        targetElement.style.height = (maxHeight - parseInt(topWithoutborder.toString(), 10)) + 'px';
        return;
    }
    let targetTop = 0;
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
        let calculatedTop = (isNullOrUndefined(containerElement)) ? targetTop : topWithoutborder;
        if (calculatedHeight >= minHeight && ((calculatedHeight + calculatedTop) <= maxHeight)) {
            targetElement.style.height = calculatedHeight + 'px';
        }
    }
}
/* istanbul ignore next */
// tslint:disable-next-line
function resizeNorth(e) {
    let calculateValue = false;
    let boundaryRectValues;
    let pageY = (getEventType(e.type) === 'mouse') ? e.pageY : e.touches[0].pageY;
    let targetRectValues = getClientRectValues(targetElement);
    if (!isNullOrUndefined(containerElement)) {
        boundaryRectValues = getClientRectValues(containerElement);
    }
    if (!isNullOrUndefined(containerElement) && (targetRectValues.top - boundaryRectValues.top) > 0) {
        calculateValue = true;
    }
    else if (isNullOrUndefined(containerElement) && pageY > 0) {
        calculateValue = true;
    }
    let currentHeight = originalHeight - (pageY - originalMouseY);
    if (calculateValue) {
        if (currentHeight >= minHeight && currentHeight <= maxHeight) {
            let containerTop = 0;
            if (!isNullOrUndefined(containerElement)) {
                containerTop = boundaryRectValues.top;
            }
            let top = (originalY - containerTop) + (pageY - originalMouseY);
            top = top > 0 ? top : 1;
            targetElement.style.height = currentHeight + 'px';
            targetElement.style.top = top + 'px';
        }
    }
}
/* istanbul ignore next */
// tslint:disable-next-line
function resizeWest(e) {
    let documentWidth = document.documentElement.clientWidth;
    let calculateValue = false;
    let rectValues;
    if (!isNullOrUndefined(containerElement)) {
        rectValues = getClientRectValues(containerElement);
    }
    let pageX = (getEventType(e.type) === 'mouse') ? e.pageX : e.touches[0].pageX;
    let targetRectValues = getClientRectValues(targetElement);
    let borderValue = isNullOrUndefined(containerElement) ? 0 : containerElement.offsetWidth - containerElement.clientWidth;
    let left = isNullOrUndefined(containerElement) ? 0 : rectValues.left;
    let containerWidth = isNullOrUndefined(containerElement) ? 0 : rectValues.width;
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
        (Math.floor((targetRectValues.left - rectValues.left) + targetRectValues.width +
            (rectValues.right - targetRectValues.right)) - borderValue) <= maxWidth) {
        calculateValue = true;
    }
    else if (isNullOrUndefined(containerElement) && pageX >= 0) {
        calculateValue = true;
    }
    let calculatedWidth = originalWidth - (pageX - originalMouseX);
    if (setLeft) {
        calculatedWidth = (calculatedWidth > resizeWestWidth) ? resizeWestWidth : calculatedWidth;
    }
    if (calculateValue) {
        if (calculatedWidth >= minWidth && calculatedWidth <= maxWidth) {
            let containerLeft = 0;
            if (!isNullOrUndefined(containerElement)) {
                containerLeft = rectValues.left;
            }
            let left = (originalX - containerLeft) + (pageX - originalMouseX);
            left = (left > 0) ? left : 1;
            if (calculatedWidth !== previousWidth && setWidth) {
                targetElement.style.width = calculatedWidth + 'px';
            }
            if (setLeft) {
                targetElement.style.left = left + 'px';
                if (left === 1) {
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
    let documentWidth = document.documentElement.clientWidth;
    let calculateValue = false;
    let containerRectValues;
    if (!isNullOrUndefined(containerElement)) {
        containerRectValues = getClientRectValues(containerElement);
    }
    let coordinates = e.touches ? e.changedTouches[0] : e;
    let pageX = coordinates.pageX;
    let targetRectValues = getClientRectValues(targetElement);
    if (!isNullOrUndefined(containerElement) && (((targetRectValues.left - containerRectValues.left) + targetRectValues.width) < maxWidth
        || (targetRectValues.right - containerRectValues.left) > targetRectValues.width)) {
        calculateValue = true;
    }
    else if (isNullOrUndefined(containerElement) && (documentWidth - pageX) > 0) {
        calculateValue = true;
    }
    let calculatedWidth = originalWidth + (pageX - originalMouseX);
    let containerLeft = 0;
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
function setMaxWidth(value) {
    maxWidth = value;
}
function setMaxHeight(value) {
    maxHeight = value;
}
function removeResize() {
    let handlers = targetElement.querySelectorAll('.' + RESIZE_HANDLER);
    for (let i = 0; i < handlers.length; i++) {
        detach(handlers[i]);
    }
    let borderResizers = targetElement.querySelectorAll('.e-dialog-border-resize');
    if (!isNullOrUndefined(borderResizers)) {
        for (let i = 0; i < borderResizers.length; i++) {
            detach(borderResizers[i]);
        }
    }
}

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class ButtonProps extends ChildProperty {
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
/**
 * Configures the animation properties for both open and close the dialog.
 */
class AnimationSettings extends ChildProperty {
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
const ROOT = 'e-dialog';
const RTL = 'e-rtl';
const DLG_HEADER_CONTENT = 'e-dlg-header-content';
const DLG_HEADER = 'e-dlg-header';
const DLG_FOOTER_CONTENT = 'e-footer-content';
const MODAL_DLG = 'e-dlg-modal';
const DLG_CONTENT = 'e-dlg-content';
const DLG_CLOSE_ICON = 'e-icon-dlg-close';
const DLG_OVERLAY = 'e-dlg-overlay';
const DLG_TARGET = 'e-dlg-target';
const DLG_CONTAINER = 'e-dlg-container';
const SCROLL_DISABLED = 'e-scroll-disabled';
const DLG_PRIMARY_BUTTON = 'e-primary';
const ICON = 'e-icons';
const POPUP_ROOT = 'e-popup';
const DEVICE = 'e-device';
const FULLSCREEN = 'e-dlg-fullscreen';
const DLG_CLOSE_ICON_BTN = 'e-dlg-closeicon-btn';
const DLG_HIDE = 'e-popup-close';
const DLG_SHOW = 'e-popup-open';
const DLG_UTIL_DEFAULT_TITLE = 'Information';
const DLG_UTIL_ROOT = 'e-scroll-disabled';
const DLG_UTIL_ALERT = 'e-alert-dialog';
const DLG_UTIL_CONFIRM = 'e-confirm-dialog';
const DLG_RESIZABLE = 'e-dlg-resizable';
const DLG_RESTRICT_LEFT_VALUE = 'e-restrict-left';
const DLG_RESTRICT_WIDTH_VALUE = 'e-resize-viewport';
const DLG_REF_ELEMENT = 'e-dlg-ref-element';
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
let Dialog = class Dialog extends Component {
    /**
     * Constructor for creating the widget
     * @hidden
     */
    constructor(options, element) {
        super(options, element);
    }
    /**
     * Initialize the control rendering
     * @private
     */
    render() {
        this.initialize();
        this.initRender();
        this.wireEvents();
        if (this.width === '100%') {
            this.element.style.width = '';
        }
        if (this.minHeight !== '') {
            this.element.style.minHeight = this.minHeight.toString();
        }
        if (this.enableResize) {
            this.setResize();
            if (this.animationSettings.effect === 'None') {
                this.getMinHeight();
            }
        }
        this.renderComplete();
    }
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        this.headerContent = null;
        this.allowMaxHeight = true;
        this.preventVisibility = true;
        this.clonedEle = this.element.cloneNode(true);
        this.closeIconClickEventHandler = (event) => {
            this.hide(event);
        };
        this.dlgOverlayClickEventHandler = (event) => {
            this.trigger('overlayClick', event);
            this.focusContent();
        };
        let localeText = { close: 'Close' };
        this.l10n = new L10n('dialog', localeText, this.locale);
        this.checkPositionData();
        if (isNullOrUndefined(this.target)) {
            let prevOnChange = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            this.target = document.body;
            this.isProtectedOnChange = prevOnChange;
        }
    }
    ;
    isNumberValue(value) {
        let isNumber = /^[-+]?\d*\.?\d+$/.test(value);
        return isNumber;
    }
    checkPositionData() {
        if (!isNullOrUndefined(this.position)) {
            if (!isNullOrUndefined(this.position.X) && (typeof (this.position.X) !== 'number')) {
                let isNumber = this.isNumberValue(this.position.X);
                if (isNumber) {
                    let prevOnChange = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    this.position.X = parseFloat(this.position.X);
                    this.isProtectedOnChange = prevOnChange;
                }
            }
            if (!isNullOrUndefined(this.position.Y) && (typeof (this.position.Y) !== 'number')) {
                let isNumber = this.isNumberValue(this.position.Y);
                if (isNumber) {
                    let prevOnChange = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    this.position.Y = parseFloat(this.position.Y);
                    this.isProtectedOnChange = prevOnChange;
                }
            }
        }
    }
    getEle(list, selector) {
        let element = undefined;
        for (let i = 0; i < list.length; i++) {
            if (list[i].classList.contains(selector)) {
                element = list[i];
                break;
            }
        }
        return element;
    }
    /* istanbul ignore next */
    getMinHeight() {
        let computedHeaderHeight = '0px';
        let computedFooterHeight = '0px';
        if (!isNullOrUndefined(this.element.querySelector('.' + DLG_HEADER_CONTENT))) {
            computedHeaderHeight = getComputedStyle(this.headerContent).height;
        }
        let footerEle = this.getEle(this.element.children, DLG_FOOTER_CONTENT);
        if (!isNullOrUndefined(footerEle)) {
            computedFooterHeight = getComputedStyle(footerEle).height;
        }
        let headerHeight = parseInt(computedHeaderHeight.slice(0, computedHeaderHeight.indexOf('p')), 10);
        let footerHeight = parseInt(computedFooterHeight.slice(0, computedFooterHeight.indexOf('p')), 10);
        setMinHeight(headerHeight + 30 + (isNaN(footerHeight) ? 0 : footerHeight));
        return (headerHeight + 30 + footerHeight);
    }
    onResizeStart(args, dialogObj) {
        dialogObj.trigger('resizeStart', args);
        return args.cancel;
    }
    onResizing(args, dialogObj) {
        dialogObj.trigger('resizing', args);
    }
    onResizeComplete(args, dialogObj) {
        dialogObj.trigger('resizeStop', args);
    }
    setResize() {
        if (this.enableResize) {
            if (this.isBlazorServerRender() && !isNullOrUndefined(this.element.querySelector('.e-icons.e-resize-handle'))) {
                return;
            }
            this.element.classList.add(DLG_RESIZABLE);
            let computedHeight = getComputedStyle(this.element).minHeight;
            let computedWidth = getComputedStyle(this.element).minWidth;
            let direction = '';
            for (let i = 0; i < this.resizeHandles.length; i++) {
                if (this.resizeHandles[i] === 'All') {
                    direction = 'south north east west north-east north-west south-east south-west';
                    break;
                }
                else {
                    let directionValue = '';
                    switch (this.resizeHandles[i].toString()) {
                        case 'SouthEast':
                            directionValue = 'south-east';
                            break;
                        case 'SouthWest':
                            directionValue = 'south-west';
                            break;
                        case 'NorthEast':
                            directionValue = 'north-east';
                            break;
                        case 'NorthWest':
                            directionValue = 'north-west';
                            break;
                        default:
                            directionValue = this.resizeHandles[i].toString();
                            break;
                    }
                    direction += directionValue.toLocaleLowerCase() + ' ';
                }
            }
            if (this.enableRtl && direction.trim() === 'south-east') {
                direction = 'south-west';
            }
            else if (this.enableRtl && direction.trim() === 'south-west') {
                direction = 'south-east';
            }
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
                resizing: this.onResizing.bind(this),
                proxy: this
            });
            this.wireWindowResizeEvent();
        }
        else {
            removeResize();
            this.unWireWindowResizeEvent();
            if (this.isModal) {
                this.element.classList.remove(DLG_RESTRICT_LEFT_VALUE);
            }
            else {
                this.element.classList.remove(DLG_RESTRICT_WIDTH_VALUE);
            }
            this.element.classList.remove(DLG_RESIZABLE);
        }
    }
    /* istanbul ignore next */
    keyDown(event) {
        if (event.keyCode === 9) {
            if (this.isModal) {
                let buttonObj;
                if (!isNullOrUndefined(this.btnObj)) {
                    buttonObj = this.btnObj[this.btnObj.length - 1];
                }
                if ((isNullOrUndefined(this.btnObj)) && (!isNullOrUndefined(this.ftrTemplateContent))) {
                    let value = 'input,select,textarea,button,a,[contenteditable="true"],[tabindex]';
                    let items = this.ftrTemplateContent.querySelectorAll(value);
                    buttonObj = { element: items[items.length - 1] };
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
        let element = document.activeElement;
        let isTagName = (['input', 'textarea'].indexOf(element.tagName.toLowerCase()) > -1);
        let isContentEdit = false;
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
            let buttonIndex;
            let firstPrimary = this.buttons.some((data, index) => {
                buttonIndex = index;
                let buttonModel = data.buttonModel;
                return !isNullOrUndefined(buttonModel) && buttonModel.isPrimary === true;
            });
            if (firstPrimary && typeof (this.buttons[buttonIndex].click) === 'function') {
                setTimeout(() => {
                    this.buttons[buttonIndex].click.call(this, event);
                });
            }
        }
    }
    /**
     * Initialize the control rendering
     * @private
     */
    initialize() {
        if (!isNullOrUndefined(this.target)) {
            this.targetEle = ((typeof this.target) === 'string') ?
                document.querySelector(this.target) : this.target;
        }
        if (!this.isBlazorServerRender()) {
            addClass([this.element], ROOT);
        }
        if (Browser.isDevice) {
            addClass([this.element], DEVICE);
        }
        if (!this.isBlazorServerRender()) {
            this.setCSSClass();
        }
        this.setMaxHeight();
    }
    /**
     * Initialize the rendering
     * @private
     */
    initRender() {
        this.initialRender = true;
        if (!this.isBlazorServerRender()) {
            attributes(this.element, { role: 'dialog' });
        }
        if (this.zIndex === 1000) {
            this.setzIndex(this.element, false);
            this.calculatezIndex = true;
        }
        else {
            this.calculatezIndex = false;
        }
        if (this.isBlazorServerRender() && isNullOrUndefined(this.headerContent)) {
            this.headerContent = this.element.getElementsByClassName('e-dlg-header-content')[0];
        }
        if (this.isBlazorServerRender() && isNullOrUndefined(this.contentEle)) {
            this.contentEle = this.element.querySelector('#' + this.element.id + '_dialog-content');
        }
        if (!this.isBlazorServerRender()) {
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
        }
        if (this.isBlazorServerRender()) {
            if (!isNullOrUndefined(this.buttons[0].buttonModel) && this.footerTemplate === '') {
                this.setButton();
            }
        }
        if (this.allowDragging && (!isNullOrUndefined(this.headerContent))) {
            this.setAllowDragging();
        }
        if (!this.isBlazorServerRender()) {
            attributes(this.element, { 'aria-modal': (this.isModal ? 'true' : 'false') });
            if (this.isModal) {
                this.setIsModal();
            }
        }
        if (this.isBlazorServerRender() && isNullOrUndefined(this.dlgContainer)) {
            this.dlgContainer = this.element.parentElement;
            for (let i = 0, childNodes = this.dlgContainer.children; i < childNodes.length; i++) {
                if (childNodes[i].classList.contains('e-dlg-overlay')) {
                    this.dlgOverlay = childNodes[i];
                }
            }
        }
        if (this.element.classList.contains(DLG_UTIL_ALERT) !== true && this.element.classList.contains(DLG_UTIL_CONFIRM) !== true
            && !isNullOrUndefined(this.element.parentElement)) {
            let parentEle = this.isModal ? this.dlgContainer.parentElement : this.element.parentElement;
            this.refElement = this.createElement('div', { className: DLG_REF_ELEMENT });
            parentEle.insertBefore(this.refElement, (this.isModal ? this.dlgContainer : this.element));
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
            enableRtl: this.enableRtl,
            open: (event) => {
                let eventArgs = {
                    container: this.isModal ? this.dlgContainer : this.element,
                    element: this.element,
                    target: this.target,
                    preventFocus: false
                };
                if (this.enableResize) {
                    this.resetResizeIcon();
                }
                this.trigger('open', eventArgs, (openEventArgs) => {
                    if (!openEventArgs.preventFocus) {
                        this.focusContent();
                    }
                });
            },
            close: (event) => {
                if (this.isModal) {
                    addClass([this.dlgOverlay], 'e-fade');
                }
                this.unBindEvent(this.element);
                if (this.isModal) {
                    this.dlgContainer.style.display = 'none';
                }
                this.trigger('close', this.closeArgs);
                let activeEle = document.activeElement;
                if (!isNullOrUndefined(activeEle) && !isNullOrUndefined((activeEle).blur)) {
                    activeEle.blur();
                }
                if (!isNullOrUndefined(this.storeActiveElement) && !isNullOrUndefined(this.storeActiveElement.focus)) {
                    this.storeActiveElement.focus();
                }
            }
        });
        this.positionChange();
        this.setEnableRTL();
        if (!this.isBlazorServerRender()) {
            addClass([this.element], DLG_HIDE);
            if (this.isModal) {
                this.setOverlayZindex();
            }
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
    }
    resetResizeIcon() {
        let dialogConHeight = this.getMinHeight();
        if (this.targetEle.offsetHeight < dialogConHeight) {
            let className = this.enableRtl ? 'e-south-west' : 'e-south-east';
            let resizeIcon = this.element.querySelector('.' + className);
            if (!isNullOrUndefined(resizeIcon)) {
                resizeIcon.style.bottom = '-' + dialogConHeight.toString() + 'px';
            }
        }
    }
    setOverlayZindex(zIndexValue) {
        let zIndex;
        if (isNullOrUndefined(zIndexValue)) {
            zIndex = parseInt(this.element.style.zIndex, 10) ? parseInt(this.element.style.zIndex, 10) : this.zIndex;
        }
        else {
            zIndex = zIndexValue;
        }
        this.dlgOverlay.style.zIndex = (zIndex - 1).toString();
        this.dlgContainer.style.zIndex = zIndex.toString();
    }
    positionChange() {
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
    }
    setPopupPosition() {
        this.popupObj.setProperties({
            position: {
                X: this.position.X, Y: this.position.Y
            }
        });
    }
    setAllowDragging() {
        let handleContent = '.' + DLG_HEADER_CONTENT;
        this.dragObj = new Draggable(this.element, {
            clone: false,
            isDragScroll: true,
            abort: '.e-dlg-closeicon-btn',
            handle: handleContent,
            dragStart: (event) => {
                this.trigger('dragStart', event, (dragEventArgs) => {
                    if (isBlazor()) {
                        dragEventArgs.bindEvents(event.dragElement);
                    }
                });
            },
            dragStop: (event) => {
                if (this.isModal) {
                    if (!isNullOrUndefined(this.position)) {
                        this.dlgContainer.classList.remove('e-dlg-' + this.position.X + '-' + this.position.Y);
                    }
                    // Reset the dialog position after drag completion.
                    this.element.style.position = 'relative';
                }
                this.trigger('dragStop', event);
                this.element.classList.remove(DLG_RESTRICT_LEFT_VALUE);
            },
            drag: (event) => {
                this.trigger('drag', event);
            }
        });
        if (!isNullOrUndefined(this.targetEle)) {
            this.dragObj.dragArea = this.targetEle;
        }
    }
    setButton() {
        if (!this.isBlazorServerRender()) {
            this.buttonContent = [];
            this.btnObj = [];
            for (let i = 0; i < this.buttons.length; i++) {
                let buttonType = !isNullOrUndefined(this.buttons[i].type) ? this.buttons[i].type.toLowerCase() : 'button';
                let btn = this.createElement('button', { attrs: { type: buttonType } });
                this.buttonContent.push(btn.outerHTML);
            }
            this.setFooterTemplate();
        }
        let footerBtn;
        for (let i = 0, childNodes = this.element.children; i < childNodes.length; i++) {
            if (childNodes[i].classList.contains(DLG_FOOTER_CONTENT)) {
                footerBtn = childNodes[i].querySelectorAll('button');
            }
        }
        for (let i = 0; i < this.buttons.length; i++) {
            if (!this.isBlazorServerRender()) {
                this.btnObj[i] = new Button(this.buttons[i].buttonModel);
            }
            if (this.isBlazorServerRender()) {
                this.ftrTemplateContent = this.element.querySelector('.' + DLG_FOOTER_CONTENT);
            }
            if (!isNullOrUndefined(this.ftrTemplateContent) && typeof (this.buttons[i].click) === 'function' && footerBtn.length > 0) {
                EventHandler.add(footerBtn[i], 'click', this.buttons[i].click, this);
            }
            if (!this.isBlazorServerRender() && !isNullOrUndefined(this.ftrTemplateContent)) {
                this.btnObj[i].appendTo(this.ftrTemplateContent.children[i]);
                this.btnObj[i].element.classList.add('e-flat');
                this.primaryButtonEle = this.element.getElementsByClassName('e-primary')[0];
            }
        }
    }
    setContent() {
        attributes(this.element, { 'aria-describedby': this.element.id + '_dialog-content' });
        this.contentEle = this.createElement('div', { className: DLG_CONTENT, id: this.element.id + '_dialog-content' });
        if (this.innerContentElement) {
            this.contentEle.appendChild(this.innerContentElement);
        }
        else if (!isNullOrUndefined(this.content) && this.content !== '' || !this.initialRender) {
            if (typeof (this.content) === 'string' && !isBlazor()) {
                this.contentEle.innerHTML = this.sanitizeHelper(this.content);
            }
            else if (this.content instanceof HTMLElement) {
                this.contentEle.appendChild(this.content);
            }
            else {
                this.setTemplate(this.content, this.contentEle, 'content');
            }
        }
        if (!isNullOrUndefined(this.headerContent)) {
            this.element.insertBefore(this.contentEle, this.element.children[1]);
        }
        else {
            this.element.insertBefore(this.contentEle, this.element.children[0]);
        }
        if (this.height === 'auto') {
            if (!this.isBlazorServerRender() && Browser.isIE && this.element.style.width === '' && !isNullOrUndefined(this.width)) {
                this.element.style.width = formatUnit(this.width);
            }
            this.setMaxHeight();
        }
    }
    setTemplate(template, toElement, prop) {
        let templateFn;
        let templateProps;
        if (toElement.classList.contains(DLG_HEADER)) {
            templateProps = this.element.id + 'header';
        }
        else if (toElement.classList.contains(DLG_FOOTER_CONTENT)) {
            templateProps = this.element.id + 'footerTemplate';
        }
        else {
            templateProps = this.element.id + 'content';
        }
        let templateValue;
        if (!isNullOrUndefined(template.outerHTML)) {
            toElement.appendChild(template);
        }
        else if ((typeof template !== 'string') || (isBlazor() && !this.isStringTemplate)) {
            templateFn = compile(template);
            templateValue = template;
        }
        else {
            toElement.innerHTML = this.sanitizeHelper(template);
        }
        let fromElements = [];
        if (!isNullOrUndefined(templateFn)) {
            let isString = (isBlazor() &&
                !this.isStringTemplate && (templateValue).indexOf('<div>Blazor') === 0) ?
                this.isStringTemplate : true;
            for (let item of templateFn({}, this, prop, templateProps, isString)) {
                fromElements.push(item);
            }
            append([].slice.call(fromElements), toElement);
        }
    }
    /**
     * @hidden
     */
    sanitizeHelper(value) {
        if (this.enableHtmlSanitizer) {
            let dialogItem = SanitizeHtmlHelper.beforeSanitize();
            let beforeEvent = {
                cancel: false,
                helper: null
            };
            extend(dialogItem, dialogItem, beforeEvent);
            this.trigger('beforeSanitizeHtml', dialogItem);
            if (dialogItem.cancel && !isNullOrUndefined(dialogItem.helper)) {
                value = dialogItem.helper(value);
            }
            else if (!dialogItem.cancel) {
                value = SanitizeHtmlHelper.serializeValue(dialogItem, value);
            }
        }
        return value;
    }
    setMaxHeight() {
        if (!this.allowMaxHeight) {
            return;
        }
        let display = this.element.style.display;
        this.element.style.display = 'none';
        this.element.style.maxHeight = (!isNullOrUndefined(this.target)) && (this.targetEle.offsetHeight < window.innerHeight) ?
            (this.targetEle.offsetHeight - 20) + 'px' : (window.innerHeight - 20) + 'px';
        this.element.style.display = display;
        if (Browser.isIE && this.height === 'auto' && !isNullOrUndefined(this.contentEle)
            && this.element.offsetHeight < this.contentEle.offsetHeight) {
            this.element.style.height = 'inherit';
        }
    }
    setEnableRTL() {
        if (!this.isBlazorServerRender()) {
            this.enableRtl ? addClass([this.element], RTL) : removeClass([this.element], RTL);
        }
        if (!isNullOrUndefined(this.element.querySelector('.e-resize-handle'))) {
            removeResize();
            this.setResize();
        }
    }
    setTargetContent() {
        if (isNullOrUndefined(this.content) || this.content === '') {
            let isContent = this.element.innerHTML.replace(/\s|<(\/?|\!?)(!--!--)>/g, '') !== '';
            if (this.element.children.length > 0 || isContent) {
                this.innerContentElement = document.createDocumentFragment();
                [].slice.call(this.element.childNodes).forEach((el) => {
                    if (el.nodeType !== 8) {
                        this.innerContentElement.appendChild(el);
                    }
                });
            }
        }
    }
    setHeader() {
        if (this.headerEle) {
            this.headerEle.innerHTML = '';
        }
        else {
            this.headerEle = this.createElement('div', { id: this.element.id + '_title', className: DLG_HEADER });
        }
        this.createHeaderContent();
        this.headerContent.appendChild(this.headerEle);
        this.setTemplate(this.header, this.headerEle, 'header');
        attributes(this.element, { 'aria-labelledby': this.element.id + '_title' });
        this.element.insertBefore(this.headerContent, this.element.children[0]);
    }
    setFooterTemplate() {
        if (this.ftrTemplateContent) {
            this.ftrTemplateContent.innerHTML = '';
        }
        else {
            this.ftrTemplateContent = this.createElement('div', {
                className: DLG_FOOTER_CONTENT
            });
        }
        if (this.footerTemplate !== '' && !isNullOrUndefined(this.footerTemplate)) {
            this.setTemplate(this.footerTemplate, this.ftrTemplateContent, 'footerTemplate');
        }
        else {
            this.ftrTemplateContent.innerHTML = this.buttonContent.join('');
        }
        this.element.appendChild(this.ftrTemplateContent);
    }
    createHeaderContent() {
        if (isNullOrUndefined(this.headerContent)) {
            this.headerContent = this.createElement('div', { id: this.element.id + '_dialog-header', className: DLG_HEADER_CONTENT });
        }
    }
    renderCloseIcon() {
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
    }
    closeIconTitle() {
        this.l10n.setLocale(this.locale);
        let closeIconTitle = this.l10n.getConstant('close');
        this.closeIcon.setAttribute('title', closeIconTitle);
        this.closeIcon.setAttribute('aria-label', closeIconTitle);
    }
    setCSSClass(oldCSSClass) {
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
        if (oldCSSClass) {
            removeClass([this.element], oldCSSClass.split(' '));
        }
    }
    setIsModal() {
        this.dlgContainer = this.createElement('div', { className: DLG_CONTAINER });
        this.element.classList.remove(DLG_SHOW);
        this.element.parentNode.insertBefore(this.dlgContainer, this.element);
        this.dlgContainer.appendChild(this.element);
        addClass([this.element], MODAL_DLG);
        this.dlgOverlay = this.createElement('div', { className: DLG_OVERLAY });
        this.dlgOverlay.style.zIndex = (this.zIndex - 1).toString();
        this.dlgContainer.appendChild(this.dlgOverlay);
    }
    getValidFocusNode(items) {
        let node;
        for (let u = 0; u < items.length; u++) {
            node = items[u];
            if ((node.clientHeight > 0 || (node.tagName.toLowerCase() === 'a' && node.hasAttribute('href'))) && node.tabIndex > -1 &&
                !node.disabled && !this.disableElement(node, '[disabled],[aria-disabled="true"],[type="hidden"]')) {
                return node;
            }
            else {
                node = null;
            }
        }
        return node;
    }
    focusableElements(content) {
        if (!isNullOrUndefined(content)) {
            let value = 'input,select,textarea,button,a,[contenteditable="true"],[tabindex]';
            let items = content.querySelectorAll(value);
            return this.getValidFocusNode(items);
        }
        return null;
    }
    getAutoFocusNode(container) {
        let node = container.querySelector('.' + DLG_CLOSE_ICON_BTN);
        let value = '[autofocus]';
        let items = container.querySelectorAll(value);
        let validNode = this.getValidFocusNode(items);
        if (isBlazor()) {
            this.primaryButtonEle = this.element.getElementsByClassName('e-primary')[0];
        }
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
    }
    disableElement(element, t) {
        let elementMatch = element ? element.matches || element.webkitMatchesSelector || element.msMatchesSelector : null;
        if (elementMatch) {
            for (; element; element = element.parentNode) {
                if (element instanceof Element && elementMatch.call(element, t)) {
                    /* istanbul ignore next */
                    return element;
                }
            }
        }
        return null;
    }
    focusContent() {
        let element = this.getAutoFocusNode(this.element);
        let node = !isNullOrUndefined(element) ? element : this.element;
        let userAgent = Browser.userAgent;
        if (userAgent.indexOf('MSIE ') > 0 || userAgent.indexOf('Trident/') > 0) {
            this.element.focus();
        }
        node.focus();
        this.bindEvent(this.element);
    }
    bindEvent(element) {
        EventHandler.add(element, 'keydown', this.keyDown, this);
    }
    unBindEvent(element) {
        EventHandler.remove(element, 'keydown', this.keyDown);
    }
    updateSanitizeContent() {
        if (!this.isBlazorServerRender()) {
            this.contentEle.innerHTML = this.sanitizeHelper(this.content);
        }
    }
    isBlazorServerRender() {
        return isBlazor() && this.isServerRendered;
    }
    /**
     * Module required function
     * @private
     */
    getModuleName() {
        return 'dialog';
    }
    /**
     * Called internally if any of the property value changed
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'content':
                    if (!isNullOrUndefined(this.content) && this.content !== '') {
                        if (this.isBlazorServerRender()) {
                            this.contentEle = this.element.querySelector('.e-dlg-content');
                        }
                        if (!isNullOrUndefined(this.contentEle) && this.contentEle.getAttribute('role') !== 'dialog') {
                            if (!this.isBlazorServerRender()) {
                                this.contentEle.innerHTML = '';
                            }
                            typeof (this.content) === 'string' ? (this.isBlazorServerRender()
                                && (this.contentEle.innerText === '')) ?
                                this.contentEle.insertAdjacentHTML('beforeend', this.sanitizeHelper(this.content)) :
                                this.updateSanitizeContent() :
                                this.contentEle.appendChild(this.content);
                            this.setMaxHeight();
                        }
                        else {
                            if (!this.isBlazorServerRender() ||
                                isNullOrUndefined(this.element.querySelector('.e-dlg-content'))) {
                                this.setContent();
                            }
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
                        if (!this.isBlazorServerRender() ||
                            isNullOrUndefined(this.element.querySelector('.e-dlg-header-content'))) {
                            this.setHeader();
                        }
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
                        if (!this.isBlazorServerRender() ||
                            isNullOrUndefined(this.element.querySelector('.e-footer-content'))) {
                            this.setFooterTemplate();
                        }
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
                        else {
                            if (this.isBlazorServerRender()) {
                                this.wireEvents();
                            }
                        }
                    }
                    else {
                        if (!this.isBlazorServerRender()) {
                            this.renderCloseIcon();
                        }
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
                    if (this.element.style.zIndex !== this.zIndex.toString()) {
                        this.calculatezIndex = false;
                    }
                    break;
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
                case 'buttons':
                    let buttonCount = this.buttons.length;
                    if (!isNullOrUndefined(this.ftrTemplateContent) && !this.isBlazorServerRender()) {
                        detach(this.ftrTemplateContent);
                        this.ftrTemplateContent = null;
                    }
                    for (let i = 0; i < buttonCount; i++) {
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
                    this.setTarget(newProp.target);
                    break;
                case 'position':
                    this.checkPositionData();
                    if (this.isModal) {
                        let positionX = isNullOrUndefined(oldProp.position.X) ? this.position.X : oldProp.position.X;
                        let positionY = isNullOrUndefined(oldProp.position.Y) ? this.position.Y : oldProp.position.Y;
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
    }
    setTarget(target) {
        this.popupObj.relateTo = target;
        this.target = target;
        this.targetEle = ((typeof this.target) === 'string') ?
            document.querySelector(this.target) : this.target;
        if (this.dragObj) {
            this.dragObj.dragArea = this.targetEle;
        }
        this.setMaxHeight();
        if (this.isModal) {
            this.updateIsModal();
        }
        if (this.enableResize) {
            this.setResize();
        }
    }
    updateIsModal() {
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
            removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
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
    }
    setzIndex(zIndexElement, setPopupZindex) {
        let prevOnChange = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.zIndex = getZindexPartial(zIndexElement);
        this.isProtectedOnChange = prevOnChange;
        if (setPopupZindex) {
            this.popupObj.zIndex = this.zIndex;
        }
    }
    windowResizeHandler() {
        setMaxWidth(this.targetEle.clientWidth);
        setMaxHeight(this.targetEle.clientHeight);
        this.setMaxHeight();
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData() {
        return this.addOnPersist([]);
    }
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}
     * @memberof dialog
     */
    destroy() {
        if (this.isDestroyed) {
            return;
        }
        let classArray = [RTL, MODAL_DLG, DLG_RESIZABLE, DLG_RESTRICT_LEFT_VALUE, FULLSCREEN, DEVICE];
        let attrs = ['role', 'aria-modal', 'aria-labelledby', 'aria-describedby', 'aria-grabbed', 'tabindex', 'style'];
        removeClass([this.targetEle], [DLG_TARGET, SCROLL_DISABLED]);
        if (this.element.classList.contains(FULLSCREEN)) {
            removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
        }
        if (this.isModal) {
            removeClass([(!isNullOrUndefined(this.targetEle) ? this.targetEle : document.body)], SCROLL_DISABLED);
        }
        this.unWireEvents();
        if (!isNullOrUndefined(this.btnObj)) {
            for (let i = 0; i < this.btnObj.length; i++) {
                this.btnObj[i].destroy();
            }
        }
        if (!isNullOrUndefined(this.dragObj)) {
            this.dragObj.destroy();
        }
        if (this.popupObj.element.classList.contains(POPUP_ROOT)) {
            this.popupObj.destroy();
        }
        removeClass([this.element], classArray);
        if (!isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            removeClass([this.element], this.cssClass.split(' '));
        }
        if (!isNullOrUndefined(this.refElement) && !isNullOrUndefined(this.refElement.parentElement)) {
            this.refElement.parentElement.insertBefore((this.isModal ? this.dlgContainer : this.element), this.refElement);
            detach(this.refElement);
            this.refElement = undefined;
        }
        if (this.isModal && !this.isBlazorServerRender()) {
            detach(this.dlgOverlay);
            this.dlgContainer.parentNode.insertBefore(this.element, this.dlgContainer);
            detach(this.dlgContainer);
        }
        if (!this.isBlazorServerRender()) {
            this.element.innerHTML = this.clonedEle.innerHTML;
        }
        if (this.isBlazorServerRender()) {
            if (!isNullOrUndefined(this.element.children)) {
                for (let i = 0; i <= this.element.children.length; i++) {
                    i = i - i;
                    detach(this.element.children[i]);
                }
            }
        }
        for (let i = 0; i < attrs.length; i++) {
            this.element.removeAttribute(attrs[i]);
        }
        if (!this.isBlazorServerRender()) {
            super.destroy();
        }
        else {
            this.isDestroyed = true;
        }
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.clearTemplate();
        }
    }
    wireWindowResizeEvent() {
        window.addEventListener('resize', this.windowResizeHandler.bind(this));
    }
    unWireWindowResizeEvent() {
        window.removeEventListener('resize', this.windowResizeHandler.bind(this));
    }
    /**
     * Binding event to the element while widget creation
     * @hidden
     */
    wireEvents() {
        if (this.isBlazorServerRender() && this.showCloseIcon) {
            this.closeIcon = this.element.getElementsByClassName('e-dlg-closeicon-btn')[0];
        }
        if (this.showCloseIcon) {
            EventHandler.add(this.closeIcon, 'click', this.closeIconClickEventHandler, this);
        }
        if (this.isModal && this.dlgOverlay) {
            EventHandler.add(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler, this);
        }
    }
    /**
     * Unbinding event to the element while widget destroy
     * @hidden
     */
    unWireEvents() {
        if (this.showCloseIcon) {
            EventHandler.remove(this.closeIcon, 'click', this.closeIconClickEventHandler);
        }
        if (this.isModal) {
            EventHandler.remove(this.dlgOverlay, 'click', this.dlgOverlayClickEventHandler);
        }
        if (this.buttons.length > 0 && !isNullOrUndefined(this.buttons[0].buttonModel) && this.footerTemplate === '') {
            for (let i = 0; i < this.buttons.length; i++) {
                if (typeof (this.buttons[i].click) === 'function') {
                    EventHandler.remove(this.ftrTemplateContent.children[i], 'click', this.buttons[i].click);
                }
            }
        }
    }
    /**
     * Refreshes the dialog's position when the user changes its header and footer height/width dynamically.
     * @return {void}
     */
    refreshPosition() {
        this.popupObj.refreshPosition();
    }
    /**
     * Opens the dialog if it is in hidden state.
     * To open the dialog with full screen width, set the parameter to true.
     * @param { boolean } isFullScreen - Enable the fullScreen Dialog.
     * @return {void}
     */
    show(isFullScreen) {
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        if (!this.element.classList.contains(DLG_SHOW) || (!isNullOrUndefined(isFullScreen))) {
            if (!isNullOrUndefined(isFullScreen)) {
                this.fullScreen(isFullScreen);
            }
            let eventArgs = isBlazor() ? {
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
            this.trigger('beforeOpen', eventArgs, (beforeOpenArgs) => {
                if (!beforeOpenArgs.cancel) {
                    if (this.element.style.maxHeight !== eventArgs.maxHeight) {
                        this.allowMaxHeight = false;
                        this.element.style.maxHeight = eventArgs.maxHeight;
                    }
                    this.storeActiveElement = document.activeElement;
                    this.element.tabIndex = -1;
                    if (this.isModal && (!isNullOrUndefined(this.dlgOverlay))) {
                        this.dlgOverlay.style.display = 'block';
                        this.dlgContainer.style.display = 'flex';
                        removeClass([this.dlgOverlay], 'e-fade');
                        if (!isNullOrUndefined(this.targetEle)) {
                            if (this.targetEle === document.body) {
                                this.dlgContainer.style.position = 'fixed';
                            }
                            else {
                                this.dlgContainer.style.position = 'absolute';
                            }
                            this.dlgOverlay.style.position = 'absolute';
                            this.element.style.position = 'relative';
                            addClass([this.targetEle], [DLG_TARGET, SCROLL_DISABLED]);
                        }
                        else {
                            addClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
                        }
                    }
                    let openAnimation = {
                        name: this.animationSettings.effect + 'In',
                        duration: this.animationSettings.duration,
                        delay: this.animationSettings.delay
                    };
                    let zIndexElement = (this.isModal) ? this.element.parentElement : this.element;
                    if (this.calculatezIndex) {
                        this.setzIndex(zIndexElement, true);
                        setStyleAttribute(this.element, { 'zIndex': this.zIndex });
                        if (this.isModal) {
                            this.setOverlayZindex(this.zIndex);
                        }
                    }
                    this.animationSettings.effect === 'None' ? this.popupObj.show() : this.popupObj.show(openAnimation);
                    this.dialogOpen = true;
                    let prevOnChange = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    this.visible = true;
                    this.preventVisibility = true;
                    this.isProtectedOnChange = prevOnChange;
                }
            });
        }
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    /**
     * Closes the dialog if it is in visible state.
     * @return {void}
     */
    hide(event) {
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        if (this.preventVisibility) {
            let eventArgs = isBlazor() ? {
                cancel: false,
                isInteracted: event ? true : false,
                element: this.element,
                container: this.isModal ? this.dlgContainer : this.element,
                event: event
            } : {
                cancel: false,
                isInteracted: event ? true : false,
                element: this.element,
                target: this.target,
                container: this.isModal ? this.dlgContainer : this.element,
                event: event
            };
            this.closeArgs = eventArgs;
            this.trigger('beforeClose', eventArgs, (beforeCloseArgs) => {
                if (!beforeCloseArgs.cancel) {
                    if (this.isModal) {
                        !isNullOrUndefined(this.targetEle) ? removeClass([this.targetEle], [DLG_TARGET, SCROLL_DISABLED]) :
                            removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
                    }
                    let closeAnimation = {
                        name: this.animationSettings.effect + 'Out',
                        duration: this.animationSettings.duration,
                        delay: this.animationSettings.delay
                    };
                    this.animationSettings.effect === 'None' ? this.popupObj.hide() : this.popupObj.hide(closeAnimation);
                    this.dialogOpen = false;
                    let prevOnChange = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    this.visible = false;
                    this.preventVisibility = false;
                    this.isProtectedOnChange = prevOnChange;
                }
            });
        }
    }
    /**
     * Specifies to view the Full screen Dialog.
     * @private
     */
    fullScreen(args) {
        let top = this.element.offsetTop;
        let left = this.element.offsetLeft;
        if (args) {
            addClass([this.element], FULLSCREEN);
            let display = this.element.style.display;
            this.element.style.display = 'none';
            this.element.style.maxHeight = (!isNullOrUndefined(this.target)) ?
                (this.targetEle.offsetHeight) + 'px' : (window.innerHeight) + 'px';
            this.element.style.display = display;
            addClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
            if (this.allowDragging && !isNullOrUndefined(this.dragObj)) {
                this.dragObj.destroy();
            }
        }
        else {
            removeClass([this.element], FULLSCREEN);
            removeClass([document.body], [DLG_TARGET, SCROLL_DISABLED]);
            if (this.allowDragging && (!isNullOrUndefined(this.headerContent))) {
                this.setAllowDragging();
            }
        }
        return args;
    }
    /**
     * Returns the dialog button instances.
     * Based on that, you can dynamically change the button states.
     * @param { number } index - Index of the button.
     * @return {Button}
     */
    getButtons(index) {
        if (!isNullOrUndefined(index)) {
            return this.btnObj[index];
        }
        return this.btnObj;
    }
};
__decorate$1([
    Property('')
], Dialog.prototype, "content", void 0);
__decorate$1([
    Property(true)
], Dialog.prototype, "enableHtmlSanitizer", void 0);
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
    Property(['South-East'])
], Dialog.prototype, "resizeHandles", void 0);
__decorate$1([
    Property('auto')
], Dialog.prototype, "height", void 0);
__decorate$1([
    Property('')
], Dialog.prototype, "minHeight", void 0);
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
], Dialog.prototype, "beforeSanitizeHtml", void 0);
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
__decorate$1([
    Event()
], Dialog.prototype, "destroyed", void 0);
Dialog = __decorate$1([
    NotifyPropertyChanges
], Dialog);
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
        let dialogElement = createElement('div', { 'className': DLG_UTIL_ALERT });
        document.body.appendChild(dialogElement);
        let alertDialogObj;
        let okButtonModel = [{
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
        alertDialogObj.close = () => {
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
        let dialogElement = createElement('div', { 'className': DLG_UTIL_CONFIRM });
        document.body.appendChild(dialogElement);
        let confirmDialogObj;
        let okCancelButtonModel = [{
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
        confirmDialogObj.close = () => {
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
        let dialogObject = new Dialog(options);
        dialogObject.appendTo(element);
        return dialogObject;
    }
    function alertOptions(option) {
        let options = {};
        options.buttons = [];
        options = formOptions(options, option);
        options = setAlertButtonModel(options, option);
        return options;
    }
    function confirmOptions(option) {
        let options = {};
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
        let alertButtonModel = [{
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
        let okButtonModel = {
            buttonModel: { isPrimary: true, content: 'OK' },
            click: function () {
                this.hide();
            }
        };
        let cancelButtonModel = {
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
        let buttonProps = buttonPropModel;
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

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const TOUCHEND_HIDE_DELAY = 1500;
const TAPHOLD_THRESHOLD = 500;
const SHOW_POINTER_TIP_GAP = 0;
const HIDE_POINTER_TIP_GAP = 8;
const MOUSE_TRAIL_GAP = 2;
const POINTER_ADJUST = 2;
const ROOT$1 = 'e-tooltip';
const RTL$1 = 'e-rtl';
const DEVICE$1 = 'e-bigger';
const ICON$1 = 'e-icons';
const CLOSE = 'e-tooltip-close';
const TOOLTIP_WRAP = 'e-tooltip-wrap';
const CONTENT = 'e-tip-content';
const ARROW_TIP = 'e-arrow-tip';
const ARROW_TIP_OUTER = 'e-arrow-tip-outer';
const ARROW_TIP_INNER = 'e-arrow-tip-inner';
const TIP_BOTTOM = 'e-tip-bottom';
const TIP_TOP = 'e-tip-top';
const TIP_LEFT = 'e-tip-left';
const TIP_RIGHT = 'e-tip-right';
const POPUP_ROOT$1 = 'e-popup';
const POPUP_OPEN = 'e-popup-open';
const POPUP_CLOSE = 'e-popup-close';
const POPUP_LIB = 'e-lib';
const HIDE_POPUP = 'e-hidden';
class Animation$1 extends ChildProperty {
}
__decorate$2([
    Property({ effect: 'FadeIn', duration: 150, delay: 0 })
], Animation$1.prototype, "open", void 0);
__decorate$2([
    Property({ effect: 'FadeOut', duration: 150, delay: 0 })
], Animation$1.prototype, "close", void 0);
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
let Tooltip = class Tooltip extends Component {
    /**
     * Constructor for creating the Tooltip Component
     */
    constructor(options, element) {
        super(options, element);
        this.isBlazorTooltip = false;
        this.contentTargetValue = null;
        this.contentEvent = null;
        this.contentAnimation = null;
    }
    initialize() {
        this.formatPosition();
        if (!(this.isServerRender())) {
            addClass([this.element], ROOT$1);
        }
    }
    isServerRender() {
        return isBlazor() && this.isServerRendered;
    }
    formatPosition() {
        if (this.position.indexOf('Top') === 0 || this.position.indexOf('Bottom') === 0) {
            [this.tooltipPositionY, this.tooltipPositionX] = this.position.split(/(?=[A-Z])/);
        }
        else {
            [this.tooltipPositionX, this.tooltipPositionY] = this.position.split(/(?=[A-Z])/);
        }
    }
    renderArrow() {
        this.setTipClass(this.position);
        if (!(this.isServerRender())) {
            let tip = this.createElement('div', { className: ARROW_TIP + ' ' + this.tipClass });
            tip.appendChild(this.createElement('div', { className: ARROW_TIP_OUTER + ' ' + this.tipClass }));
            tip.appendChild(this.createElement('div', { className: ARROW_TIP_INNER + ' ' + this.tipClass }));
            this.tooltipEle.appendChild(tip);
        }
        else {
            let tip = this.tooltipEle.querySelector('.' + ARROW_TIP);
            addClass([tip.querySelector('.' + ARROW_TIP_OUTER)], this.tipClass);
            addClass([tip.querySelector('.' + ARROW_TIP_INNER)], this.tipClass);
            this.tooltipEle.appendChild(tip);
        }
    }
    setTipClass(position) {
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
    }
    renderPopup(target) {
        let elePos = this.mouseTrail ? { top: 0, left: 0 } : this.getTooltipPosition(target);
        this.tooltipEle.classList.remove(POPUP_LIB);
        this.popupObj = new Popup(this.tooltipEle, {
            height: this.height,
            width: this.width,
            position: { X: elePos.left, Y: elePos.top },
            enableRtl: this.enableRtl,
            open: this.openPopupHandler.bind(this),
            close: this.closePopupHandler.bind(this)
        });
    }
    getTooltipPosition(target) {
        this.tooltipEle.style.display = 'block';
        let pos = calculatePosition(target, this.tooltipPositionX, this.tooltipPositionY);
        let offsetPos = this.calculateTooltipOffset(this.position);
        let elePos = this.collisionFlipFit(target, pos.left + offsetPos.left, pos.top + offsetPos.top);
        this.tooltipEle.style.display = '';
        return elePos;
    }
    reposition(target) {
        let elePos = this.getTooltipPosition(target);
        this.popupObj.position = { X: elePos.left, Y: elePos.top };
        this.popupObj.dataBind();
    }
    openPopupHandler() {
        if (!this.mouseTrail && this.needTemplateReposition()) {
            this.reposition(this.findTarget());
        }
        this.trigger('afterOpen', this.tooltipEventArgs);
    }
    closePopupHandler() {
        resetBlazorTemplate(this.element.id + 'content', 'Content');
        this.clearTemplate(['content']);
        this.clear();
        this.trigger('afterClose', this.tooltipEventArgs);
    }
    calculateTooltipOffset(position) {
        let pos = { top: 0, left: 0 };
        let tooltipEleWidth = this.tooltipEle.offsetWidth;
        let tooltipEleHeight = this.tooltipEle.offsetHeight;
        let arrowEle = this.tooltipEle.querySelector('.' + ARROW_TIP);
        let tipWidth = arrowEle ? arrowEle.offsetWidth : 0;
        let tipHeight = arrowEle ? arrowEle.offsetHeight : 0;
        let tipAdjust = (this.showTipPointer ? SHOW_POINTER_TIP_GAP : HIDE_POINTER_TIP_GAP);
        let tipHeightAdjust = (tipHeight / 2) + POINTER_ADJUST + (this.tooltipEle.offsetHeight - this.tooltipEle.clientHeight);
        let tipWidthAdjust = (tipWidth / 2) + POINTER_ADJUST + (this.tooltipEle.offsetWidth - this.tooltipEle.clientWidth);
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
    }
    updateTipPosition(position) {
        let selEle = this.tooltipEle.querySelectorAll('.' + ARROW_TIP + ',.' + ARROW_TIP_OUTER + ',.' + ARROW_TIP_INNER);
        let removeList = [TIP_BOTTOM, TIP_TOP, TIP_LEFT, TIP_RIGHT];
        removeClass(selEle, removeList);
        this.setTipClass(position);
        addClass(selEle, this.tipClass);
    }
    adjustArrow(target, position, tooltipPositionX, tooltipPositionY) {
        if (this.showTipPointer === false) {
            return;
        }
        this.updateTipPosition(position);
        let leftValue;
        let topValue;
        this.tooltipEle.style.display = 'block';
        let tooltipWidth = this.tooltipEle.clientWidth;
        let tooltipHeight = this.tooltipEle.clientHeight;
        let arrowEle = this.tooltipEle.querySelector('.' + ARROW_TIP);
        let arrowInnerELe = this.tooltipEle.querySelector('.' + ARROW_TIP_INNER);
        let tipWidth = arrowEle.offsetWidth;
        let tipHeight = arrowEle.offsetHeight;
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
                let tipPosExclude = tooltipPositionX !== 'Center' || (tooltipWidth > target.offsetWidth) || this.mouseTrail;
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
            let tipPosExclude = tooltipPositionY !== 'Center' || (tooltipHeight > target.offsetHeight) || this.mouseTrail;
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
    }
    renderContent(target) {
        let tooltipContent = this.tooltipEle.querySelector('.' + CONTENT);
        if (this.cssClass) {
            addClass([this.tooltipEle], this.cssClass.split(' '));
        }
        if (target && !isNullOrUndefined(target.getAttribute('title'))) {
            target.setAttribute('data-content', target.getAttribute('title'));
            target.removeAttribute('title');
        }
        if (!isNullOrUndefined(this.content)) {
            if (this.isBlazorTooltip || !(this.isServerRender())) {
                tooltipContent.innerHTML = '';
                if (this.content instanceof HTMLElement) {
                    tooltipContent.appendChild(this.content);
                }
                else if (typeof this.content === 'string' && this.content.indexOf('<div>Blazor') < 0) {
                    if (this.enableHtmlSanitizer) {
                        this.setProperties({ content: SanitizeHtmlHelper.sanitize(this.content) }, true);
                    }
                    tooltipContent.innerHTML = this.content;
                }
                else {
                    let templateFunction = compile(this.content);
                    let tempArr = templateFunction({}, this, 'content', this.element.id + 'content', undefined, undefined, tooltipContent);
                    if (tempArr) {
                        append(tempArr, tooltipContent);
                    }
                    this.renderReactTemplates();
                    if (typeof this.content === 'string' && this.content.indexOf('<div>Blazor') >= 0) {
                        this.isBlazorTemplate = true;
                        updateBlazorTemplate(this.element.id + 'content', 'Content', this);
                    }
                }
            }
        }
        else {
            if (target && !isNullOrUndefined(target.getAttribute('data-content'))) {
                tooltipContent.innerHTML = target.getAttribute('data-content');
            }
        }
    }
    renderCloseIcon() {
        if (!this.isSticky) {
            return;
        }
        let tipClose = this.createElement('div', { className: ICON$1 + ' ' + CLOSE });
        this.tooltipEle.appendChild(tipClose);
        EventHandler.add(tipClose, Browser.touchStartEvent, this.onStickyClose, this);
    }
    addDescribedBy(target, id) {
        let describedby = (target.getAttribute('aria-describedby') || '').split(/\s+/);
        if (describedby.indexOf(id) < 0) {
            describedby.push(id);
        }
        attributes(target, { 'aria-describedby': describedby.join(' ').trim(), 'data-tooltip-id': id });
    }
    removeDescribedBy(target) {
        let id = target.getAttribute('data-tooltip-id');
        let describedby = (target.getAttribute('aria-describedby') || '').split(/\s+/);
        let index = describedby.indexOf(id);
        if (index !== -1) {
            describedby.splice(index, 1);
        }
        target.removeAttribute('data-tooltip-id');
        let orgdescribedby = describedby.join(' ').trim();
        if (orgdescribedby) {
            target.setAttribute('aria-describedby', orgdescribedby);
        }
        else {
            target.removeAttribute('aria-describedby');
        }
    }
    tapHoldHandler(evt) {
        clearTimeout(this.autoCloseTimer);
        this.targetHover(evt.originalEvent);
    }
    touchEndHandler(e) {
        if (this.isSticky) {
            return;
        }
        let close = () => {
            this.close();
        };
        this.autoCloseTimer = setTimeout(close, TOUCHEND_HIDE_DELAY);
    }
    targetClick(e) {
        let target;
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
    }
    targetHover(e) {
        let target;
        if (this.target) {
            target = closest(e.target, this.target);
        }
        else {
            target = this.element;
        }
        if (isNullOrUndefined(target) || (target.getAttribute('data-tooltip-id') !== null && this.closeDelay === 0)) {
            return;
        }
        let targetList = [].slice.call(document.querySelectorAll('[data-tooltip-id= ' + this.ctrlId + '_content]'));
        for (let target of targetList) {
            this.restoreElement(target);
        }
        this.showTooltip(target, this.animation.open, e);
    }
    showTooltip(target, showAnimation, e) {
        clearTimeout(this.showTimer);
        clearTimeout(this.hideTimer);
        this.tooltipEventArgs = {
            type: e ? e.type : null, cancel: false, target: target, event: e ? e : null,
            element: this.tooltipEle, isInteracted: !isNullOrUndefined(e)
        };
        const observeCallback = (beforeRenderArgs) => {
            this.beforeRenderCallback(beforeRenderArgs, target, e, showAnimation);
        };
        this.trigger('beforeRender', this.tooltipEventArgs, observeCallback.bind(this));
    }
    beforeRenderCallback(beforeRenderArgs, target, e, showAnimation) {
        let isBlazorTooltipRendered = false;
        if (beforeRenderArgs.cancel) {
            this.isHidden = true;
            this.clear();
        }
        else {
            this.isHidden = false;
            if (isNullOrUndefined(this.tooltipEle)) {
                if (this.isServerRender()) {
                    this.contentTargetValue = target;
                    this.contentEvent = e;
                    this.contentAnimation = showAnimation;
                    let args = { 'enableTooltip': 'true' };
                    // tslint:disable
                    this.interopAdaptor.invokeMethodAsync('OnTooltipServerCall', args);
                    // tslint:enable
                    isBlazorTooltipRendered = true;
                }
                else {
                    this.ctrlId = this.element.getAttribute('id') ?
                        getUniqueID(this.element.getAttribute('id')) : getUniqueID('tooltip');
                    this.tooltipEle = this.createElement('div', {
                        className: TOOLTIP_WRAP + ' ' + POPUP_ROOT$1 + ' ' + POPUP_LIB, attrs: {
                            role: 'tooltip', 'aria-hidden': 'false', 'id': this.ctrlId + '_content'
                        }, styles: 'width:' +
                            formatUnit(this.width) + ';height:' + formatUnit(this.height) + ';position:absolute;'
                    });
                    this.beforeRenderBlazor(target, this);
                }
                if (!isBlazorTooltipRendered) {
                    this.afterRenderBlazor(target, e, showAnimation, this);
                }
            }
            else {
                if (this.isServerRender()) {
                    addClass([this.tooltipEle], POPUP_OPEN);
                    document.body.appendChild(this.tooltipEle);
                    this.renderCloseIcon();
                    this.renderPopup(target);
                }
                if (target) {
                    this.adjustArrow(target, this.position, this.tooltipPositionX, this.tooltipPositionY);
                    this.addDescribedBy(target, this.ctrlId + '_content');
                    this.renderContent(target);
                    Animation.stop(this.tooltipEle);
                    this.reposition(target);
                    this.afterRenderBlazor(target, e, showAnimation, this);
                }
            }
        }
    }
    ;
    contentUpdated(args) {
        if (isNullOrUndefined(this.tooltipEle)) {
            if (this.isServerRender()) {
                this.ctrlId = this.element.id;
                this.tooltipEle = document.querySelector('#' + this.ctrlId + '_content');
                if (this.tooltipEle) {
                    this.tooltipEle.setAttribute('style', 'width:' + formatUnit(this.width) +
                        ';height:' + formatUnit(this.height) + ';position:absolute;');
                    this.beforeRenderBlazor(this.contentTargetValue, this);
                    this.afterRenderBlazor(this.contentTargetValue, this.contentEvent, this.contentAnimation, this);
                    this.contentTargetValue = this.contentEvent = this.contentAnimation = null;
                }
            }
        }
    }
    ;
    beforeRenderBlazor(target, ctrlObj) {
        if (target) {
            if (Browser.isDevice) {
                addClass([ctrlObj.tooltipEle], DEVICE$1);
            }
            if (ctrlObj.width !== 'auto') {
                ctrlObj.tooltipEle.style.maxWidth = formatUnit(ctrlObj.width);
            }
            if (!(this.isServerRender())) {
                ctrlObj.tooltipEle.appendChild(ctrlObj.createElement('div', { className: CONTENT }));
            }
            document.body.appendChild(ctrlObj.tooltipEle);
            removeClass([ctrlObj.tooltipEle], HIDE_POPUP);
            ctrlObj.addDescribedBy(target, ctrlObj.ctrlId + '_content');
            ctrlObj.renderContent(target);
            addClass([ctrlObj.tooltipEle], POPUP_OPEN);
            if (ctrlObj.showTipPointer) {
                ctrlObj.renderArrow();
            }
            ctrlObj.renderCloseIcon();
            ctrlObj.renderPopup(target);
            ctrlObj.adjustArrow(target, ctrlObj.position, ctrlObj.tooltipPositionX, ctrlObj.tooltipPositionY);
            Animation.stop(ctrlObj.tooltipEle);
            ctrlObj.reposition(target);
        }
    }
    afterRenderBlazor(target, e, showAnimation, ctrlObj) {
        if (target) {
            removeClass([ctrlObj.tooltipEle], POPUP_OPEN);
            addClass([ctrlObj.tooltipEle], POPUP_CLOSE);
            ctrlObj.tooltipEventArgs = {
                type: e ? e.type : null, cancel: false, target: target, event: e ? e : null,
                element: ctrlObj.tooltipEle, isInteracted: !isNullOrUndefined(e)
            };
            if (ctrlObj.needTemplateReposition() && !ctrlObj.mouseTrail) {
                ctrlObj.tooltipEle.style.display = 'none';
            }
            const observeCallback = (observedArgs) => {
                ctrlObj.beforeOpenCallback(observedArgs, target, showAnimation, e);
            };
            ctrlObj.trigger('beforeOpen', ctrlObj.tooltipEventArgs, observeCallback.bind(ctrlObj));
        }
    }
    beforeOpenCallback(observedArgs, target, showAnimation, e) {
        if (observedArgs.cancel) {
            this.isHidden = true;
            this.clear();
            this.restoreElement(target);
        }
        else {
            let openAnimation = {
                name: showAnimation.effect,
                duration: showAnimation.duration,
                delay: showAnimation.delay,
                timingFunction: 'easeOut'
            };
            if (showAnimation.effect === 'None') {
                openAnimation = undefined;
            }
            if (this.openDelay > 0) {
                let show = () => {
                    if (this.popupObj) {
                        this.popupObj.show(openAnimation, target);
                    }
                };
                this.showTimer = setTimeout(show, this.openDelay);
            }
            else {
                if (this.popupObj) {
                    this.popupObj.show(openAnimation, target);
                }
            }
        }
        if (e) {
            this.wireMouseEvents(e, target);
        }
    }
    needTemplateReposition() {
        // tslint:disable-next-line:no-any
        const tooltip = this;
        return !isNullOrUndefined(tooltip.viewContainerRef)
            && typeof tooltip.viewContainerRef !== 'string'
            || (this.isServerRender()) && this.isBlazorTemplate;
    }
    checkCollision(target, x, y) {
        let elePos = {
            left: x, top: y, position: this.position,
            horizontal: this.tooltipPositionX, vertical: this.tooltipPositionY
        };
        let affectedPos = isCollide(this.tooltipEle, (this.target ? this.element : null), x, y);
        if (affectedPos.length > 0) {
            elePos.horizontal = affectedPos.indexOf('left') >= 0 ? 'Right' : affectedPos.indexOf('right') >= 0 ? 'Left' :
                this.tooltipPositionX;
            elePos.vertical = affectedPos.indexOf('top') >= 0 ? 'Bottom' : affectedPos.indexOf('bottom') >= 0 ? 'Top' :
                this.tooltipPositionY;
        }
        return elePos;
    }
    collisionFlipFit(target, x, y) {
        let elePos = this.checkCollision(target, x, y);
        let newpos = elePos.position;
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
            let pos = calculatePosition(target, elePos.horizontal, elePos.vertical);
            this.adjustArrow(target, newpos, elePos.horizontal, elePos.vertical);
            let offsetPos = this.calculateTooltipOffset(newpos);
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
        let eleOffset = { left: elePos.left, top: elePos.top };
        let left = fit(this.tooltipEle, (this.target ? this.element : null), { X: true, Y: false }, eleOffset).left;
        this.tooltipEle.style.display = 'block';
        if (this.showTipPointer && (newpos.indexOf('Bottom') === 0 || newpos.indexOf('Top') === 0)) {
            let arrowEle = this.tooltipEle.querySelector('.' + ARROW_TIP);
            let arrowleft = parseInt(arrowEle.style.left, 10) - (left - elePos.left);
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
    }
    hideTooltip(hideAnimation, e, targetElement) {
        if (this.closeDelay > 0) {
            clearTimeout(this.hideTimer);
            clearTimeout(this.showTimer);
            let hide = () => {
                if (this.closeDelay && this.tooltipEle && this.isTooltipOpen) {
                    return;
                }
                this.tooltipHide(hideAnimation, e, targetElement);
            };
            this.hideTimer = setTimeout(hide, this.closeDelay);
        }
        else {
            this.tooltipHide(hideAnimation, e, targetElement);
        }
    }
    tooltipHide(hideAnimation, e, targetElement) {
        let target;
        if (e) {
            target = this.target ? (targetElement || e.target) : this.element;
        }
        else {
            target = document.querySelector('[data-tooltip-id= ' + this.ctrlId + '_content]');
        }
        this.tooltipEventArgs = {
            type: e ? e.type : null, cancel: false, target: target, event: e ? e : null,
            element: this.tooltipEle, isInteracted: !isNullOrUndefined(e)
        };
        // this line commented for close the tooltip popup element even the target element destroyed in a page.
        //if (isNullOrUndefined(target)) { return; }
        this.trigger('beforeClose', this.tooltipEventArgs, (observedArgs) => {
            if (!observedArgs.cancel) {
                if (this.isServerRender()) {
                    this.blazorHide(hideAnimation, target);
                }
                else {
                    this.popupHide(hideAnimation, target);
                }
            }
            else {
                this.isHidden = false;
            }
        });
    }
    /* istanbul ignore next */
    blazorHide(hideAnimation, target) {
        let proxy = this;
        let hide = () => {
            proxy.popupHide(hideAnimation, target);
        };
        if (this.popupObj) {
            this.popupHide(hideAnimation, target);
        }
        else {
            setTimeout(hide, 200);
        }
    }
    popupHide(hideAnimation, target) {
        if (target) {
            this.restoreElement(target);
        }
        this.isHidden = true;
        let closeAnimation = {
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
    }
    restoreElement(target) {
        this.unwireMouseEvents(target);
        if (!isNullOrUndefined(target.getAttribute('data-content'))) {
            target.setAttribute('title', target.getAttribute('data-content'));
            target.removeAttribute('data-content');
        }
        this.removeDescribedBy(target);
    }
    clear() {
        if (this.tooltipEle) {
            removeClass([this.tooltipEle], POPUP_CLOSE);
            addClass([this.tooltipEle], POPUP_OPEN);
        }
        if (this.isHidden) {
            if (this.popupObj) {
                this.popupObj.destroy();
            }
            if (this.isServerRender() && this.tooltipEle) {
                this.tooltipEle.style.display = 'none';
                let args = { 'enableTooltip': 'false' };
                // tslint:disable
                this.interopAdaptor.invokeMethodAsync('OnTooltipServerCall', args);
                // tslint:enable
                remove(this.tooltipEle);
            }
            else if (this.tooltipEle) {
                remove(this.tooltipEle);
            }
            this.tooltipEle = null;
            this.popupObj = null;
        }
    }
    tooltipHover(e) {
        if (this.tooltipEle) {
            this.isTooltipOpen = true;
        }
    }
    tooltipMouseOut(e) {
        this.isTooltipOpen = false;
        this.hideTooltip(this.animation.close, e, this.findTarget());
    }
    onMouseOut(e) {
        const enteredElement = e.relatedTarget;
        // don't close the tooltip only if it is tooltip content element
        if (enteredElement && !this.mouseTrail) {
            const checkForTooltipElement = closest(enteredElement, `.${TOOLTIP_WRAP}.${POPUP_LIB}.${POPUP_ROOT$1}`);
            if (checkForTooltipElement) {
                EventHandler.add(checkForTooltipElement, 'mouseleave', this.tooltipElementMouseOut, this);
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
    }
    tooltipElementMouseOut(e) {
        this.hideTooltip(this.animation.close, e, this.findTarget());
        EventHandler.remove(this.element, 'mouseleave', this.tooltipElementMouseOut);
        this.clear();
    }
    onStickyClose(e) {
        this.close();
    }
    onMouseMove(event) {
        let eventPageX = 0;
        let eventPageY = 0;
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
        let pos = this.calculateTooltipOffset(this.position);
        let x = eventPageX + pos.left + this.offsetX;
        let y = eventPageY + pos.top + this.offsetY;
        let elePos = this.checkCollision(event.target, x, y);
        if (this.tooltipPositionX !== elePos.horizontal || this.tooltipPositionY !== elePos.vertical) {
            let newpos = (this.position.indexOf('Bottom') === 0 || this.position.indexOf('Top') === 0) ?
                elePos.vertical + elePos.horizontal : elePos.horizontal + elePos.vertical;
            elePos.position = newpos;
            this.adjustArrow(event.target, elePos.position, elePos.horizontal, elePos.vertical);
            let colpos = this.calculateTooltipOffset(elePos.position);
            elePos.left = eventPageX + colpos.left - this.offsetX;
            elePos.top = eventPageY + colpos.top - this.offsetY;
        }
        this.tooltipEle.style.left = elePos.left + 'px';
        this.tooltipEle.style.top = elePos.top + 'px';
    }
    keyDown(event) {
        if (this.tooltipEle && event.keyCode === 27) {
            this.close();
        }
    }
    touchEnd(e) {
        if (this.tooltipEle && closest(e.target, '.' + ROOT$1) === null && !this.isSticky) {
            this.close();
        }
    }
    scrollHandler(e) {
        if (this.tooltipEle) {
            if (!(closest(e.target, `.${TOOLTIP_WRAP}.${POPUP_LIB}.${POPUP_ROOT$1}`))) {
                this.close();
            }
        }
    }
    /**
     * Core method that initializes the control rendering.
     * @private
     */
    render() {
        this.initialize();
        this.wireEvents(this.opensOn);
        this.renderComplete();
    }
    /**
     * Initializes the values of private members.
     * @private
     */
    preRender() {
        this.tipClass = TIP_BOTTOM;
        this.tooltipPositionX = 'Center';
        this.tooltipPositionY = 'Top';
        this.isHidden = true;
    }
    /**
     * Binding events to the Tooltip element.
     * @hidden
     */
    wireEvents(trigger) {
        let triggerList = this.getTriggerList(trigger);
        for (let opensOn of triggerList) {
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
                    if (this.isServerRender() && !this.isSticky) {
                        EventHandler.add(this.element, 'mouseleave', this.onMouseOut, this);
                    }
                }
            }
        }
        EventHandler.add(document, 'touchend', this.touchEnd, this);
        EventHandler.add(document, 'scroll wheel', this.scrollHandler, this);
        EventHandler.add(document, 'keydown', this.keyDown, this);
    }
    getTriggerList(trigger) {
        if (trigger === 'Auto') {
            trigger = (Browser.isDevice) ? 'Hover' : 'Hover Focus';
        }
        return trigger.split(' ');
    }
    wireFocusEvents() {
        if (!isNullOrUndefined(this.target)) {
            let targetList = [].slice.call(this.element.querySelectorAll(this.target));
            for (let target of targetList) {
                EventHandler.add(target, 'focus', this.targetHover, this);
            }
        }
        else {
            EventHandler.add(this.element, 'focus', this.targetHover, this);
        }
    }
    wireMouseEvents(e, target) {
        if (this.tooltipEle) {
            if (!this.isSticky) {
                if (e.type === 'focus') {
                    EventHandler.add(target, 'blur', this.onMouseOut, this);
                }
                if (e.type === 'mouseover') {
                    if (!this.isServerRender()) {
                        EventHandler.add(target, 'mouseleave', this.onMouseOut, this);
                    }
                }
                if (this.closeDelay) {
                    EventHandler.add(this.tooltipEle, 'mouseenter', this.tooltipHover, this);
                    EventHandler.add(this.tooltipEle, 'mouseleave', this.tooltipMouseOut, this);
                }
            }
            if (this.mouseTrail) {
                EventHandler.add(target, 'mousemove touchstart mouseenter', this.onMouseMove, this);
            }
        }
    }
    /**
     * Unbinding events from the element on widget destroy.
     * @hidden
     */
    unwireEvents(trigger) {
        let triggerList = this.getTriggerList(trigger);
        for (let opensOn of triggerList) {
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
                    if (this.isServerRender() && !this.isSticky) {
                        EventHandler.remove(this.element, 'mouseleave', this.onMouseOut);
                    }
                }
            }
        }
        EventHandler.remove(document, 'touchend', this.touchEnd);
        EventHandler.remove(document, 'scroll wheel', this.scrollHandler);
        EventHandler.remove(document, 'keydown', this.keyDown);
    }
    unwireFocusEvents() {
        if (!isNullOrUndefined(this.target)) {
            let targetList = [].slice.call(this.element.querySelectorAll(this.target));
            for (let target of targetList) {
                EventHandler.remove(target, 'focus', this.targetHover);
            }
        }
        else {
            EventHandler.remove(this.element, 'focus', this.targetHover);
        }
    }
    unwireMouseEvents(target) {
        if (!this.isSticky) {
            let triggerList = this.getTriggerList(this.opensOn);
            for (let opensOn of triggerList) {
                if (opensOn === 'Focus') {
                    EventHandler.remove(target, 'blur', this.onMouseOut);
                }
                if (opensOn === 'Hover' && !Browser.isDevice) {
                    if (!this.isServerRender()) {
                        EventHandler.remove(target, 'mouseleave', this.onMouseOut);
                    }
                }
            }
            if (this.closeDelay) {
                EventHandler.remove(target, 'mouseenter', this.tooltipHover);
                EventHandler.remove(target, 'mouseleave', this.tooltipMouseOut);
            }
        }
        if (this.mouseTrail) {
            EventHandler.remove(target, 'mousemove touchstart mouseenter', this.onMouseMove);
        }
    }
    findTarget() {
        let target = document.querySelector('[data-tooltip-id= ' + this.ctrlId + '_content]');
        return target;
    }
    /**
     * Core method to return the component name.
     * @private
     */
    getModuleName() {
        return 'tooltip';
    }
    /**
     * Returns the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData() {
        return this.addOnPersist([]);
    }
    /**
     * Called internally, if any of the property value changed.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        let targetElement = this.findTarget();
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                    if (this.tooltipEle && targetElement) {
                        this.tooltipEle.style.width = this.tooltipEle.style.maxWidth = formatUnit(newProp.width);
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
                        if (this.isServerRender()) {
                            this.isBlazorTooltip = true;
                        }
                        this.renderContent();
                    }
                    else if (this.isServerRender()) {
                        let args = { 'content': newProp.content };
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
                        let arrowInnerELe = this.tooltipEle.querySelector('.' + ARROW_TIP_INNER);
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
                        let x = newProp.offsetX - oldProp.offsetX;
                        this.tooltipEle.style.left = (parseInt(this.tooltipEle.style.left, 10) + (x)).toString() + 'px';
                    }
                    break;
                case 'offsetY':
                    if (this.tooltipEle) {
                        let y = newProp.offsetY - oldProp.offsetY;
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
    }
    /**
     * It is used to show the Tooltip on the specified target with specific animation settings.
     * @param element Target element where the Tooltip is to be displayed. (It is an optional parameter)
     * @param animation Sets the specific animation, while showing the Tooltip on the screen. (It is an optional parameter)
     * @return {void}
     */
    open(element, animation) {
        if (isNullOrUndefined(animation)) {
            animation = this.animation.open;
        }
        if (isNullOrUndefined(element)) {
            element = this.element;
        }
        if (element.style.display === 'none') {
            return;
        }
        this.showTooltip(element, animation);
    }
    /**
     * It is used to hide the Tooltip with specific animation effect.
     * @param animation Sets the specific animation when hiding Tooltip from the screen. (It is an optional parameter)
     * @return {void}
     */
    close(animation) {
        if (!animation) {
            animation = this.animation.close;
        }
        this.hideTooltip(animation);
    }
    /**
     * It is used to refresh the Tooltip content and its position.
     * @param target Target element where the Tooltip content or position needs to be refreshed.
     * @return {void}
     */
    refresh(target) {
        if (this.tooltipEle) {
            this.renderContent(target);
        }
        if (this.popupObj && target) {
            this.reposition(target);
        }
    }
    /**
     * It is used to destroy the Tooltip component.
     * @method destroy
     * @return {void}
     * @memberof Tooltip
     */
    destroy() {
        if (!this.isServerRender()) {
            super.destroy();
            if (this.tooltipEle) {
                remove(this.tooltipEle);
            }
        }
        if (this.isServerRender() && this.tooltipEle) {
            let placeholder = document.querySelector('#' + this.ctrlId + '_content_placeholder');
            if (placeholder) {
                placeholder.appendChild(this.tooltipEle);
            }
        }
        if (this.popupObj) {
            this.popupObj.destroy();
        }
        removeClass([this.element], ROOT$1);
        this.unwireEvents(this.opensOn);
        this.unwireMouseEvents(this.element);
        this.tooltipEle = null;
        this.popupObj = null;
    }
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
    Property(false)
], Tooltip.prototype, "enableHtmlSanitizer", void 0);
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

/**
 * Tooltip modules
 */

let globalTimeOut = {};
let spinTemplate = null;
let spinCSSClass = null;
const DEFT_MAT_WIDTH = 30;
const DEFT_FAB_WIDTH = 30;
const DEFT_BOOT_WIDTH = 30;
const DEFT_BOOT4_WIDTH = 36;
const CLS_SHOWSPIN = 'e-spin-show';
const CLS_HIDESPIN = 'e-spin-hide';
const CLS_MATERIALSPIN = 'e-spin-material';
const CLS_FABRICSPIN = 'e-spin-fabric';
const CLS_BOOTSPIN = 'e-spin-bootstrap';
const CLS_BOOT4SPIN = 'e-spin-bootstrap4';
const CLS_HIGHCONTRASTSPIN = 'e-spin-high-contrast';
const CLS_SPINWRAP = 'e-spinner-pane';
const CLS_SPININWRAP = 'e-spinner-inner';
const CLS_SPINCIRCLE = 'e-path-circle';
const CLS_SPINARC = 'e-path-arc';
const CLS_SPINLABEL = 'e-spin-label';
const CLS_SPINTEMPLATE = 'e-spin-template';
/**
 * Function to change the Spinners in a page globally from application end.
 * ```
 * E.g : blazorSpinner({ action: "Create", options: {target: targetElement}, type: "" });
 * ```
 * @param args
 * @private
 */
function Spinner(action, options, target, type) {
    switch (action) {
        case 'Create':
            let element = document.querySelector(options.target);
            let args = { type: type, target: element, cssClass: options.cssClass,
                label: options.label, width: options.width };
            createSpinner(args);
            break;
        case 'Show':
            showSpinner(document.querySelector(target));
            break;
        case 'Hide':
            hideSpinner(document.querySelector(target));
            break;
        case 'Set':
            let setArgs = { cssClass: options.cssClass, type: type };
            setSpinner(setArgs);
            break;
    }
}
/**
 * Create a spinner for the specified target element.
 * ```
 * E.g : createSpinner({ target: targetElement, width: '34px', label: 'Loading..' });
 * ```
 * @param args
 * @private
 */
function createSpinner(args, internalCreateElement) {
    if (!args.target) {
        return;
    }
    let radius;
    let makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
    let container = create_spinner_container(args.target, makeElement);
    if (!isNullOrUndefined(args.cssClass)) {
        container.wrap.classList.add(args.cssClass);
    }
    if (!isNullOrUndefined(args.template) || !isNullOrUndefined(spinTemplate)) {
        let template = !isNullOrUndefined(args.template) ? args.template : spinTemplate;
        container.wrap.classList.add(CLS_SPINTEMPLATE);
        replaceContent(container.wrap, template, spinCSSClass);
    }
    else {
        let theme = !isNullOrUndefined(args.type) ? args.type : getTheme(container.wrap);
        let width = !isNullOrUndefined(args.width) ? args.width : undefined;
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
    let labelEle = makeElement('div', {});
    labelEle.classList.add(CLS_SPINLABEL);
    labelEle.textContent = label;
    container.appendChild(labelEle);
    return labelEle;
}
function createMaterialSpinner(container, radius, makeElement) {
    let uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Material', radius: radius };
    create_material_element(container, uniqueID, makeElement, CLS_MATERIALSPIN);
    mat_calculate_attributes(radius, container, 'Material', CLS_MATERIALSPIN);
}
function createBootstrap4Spinner(container, radius, makeElement) {
    let uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Bootstrap4', radius: radius };
    create_material_element(container, uniqueID, makeElement, CLS_BOOT4SPIN);
    mat_calculate_attributes(radius, container, 'Bootstrap4', CLS_BOOT4SPIN);
}
function startMatAnimate(container, uniqueID, radius) {
    let globalObject = {};
    let timeOutVar = 0;
    globalTimeOut[uniqueID].timeOut = 0;
    globalObject[uniqueID] = globalVariables(uniqueID, radius, 0, 0);
    let spinnerInfo = { uniqueID: uniqueID, container: container, globalInfo: globalObject, timeOutVar: timeOutVar };
    animateMaterial(spinnerInfo);
}
function createFabricSpinner(container, radius, makeElement) {
    let uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Fabric', radius: radius };
    create_fabric_element(container, uniqueID, CLS_FABRICSPIN, makeElement);
    fb_calculate_attributes(radius, container, CLS_FABRICSPIN);
}
function createHighContrastSpinner(container, radius, makeElement) {
    let uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'HighContrast', radius: radius };
    create_fabric_element(container, uniqueID, CLS_HIGHCONTRASTSPIN, makeElement);
    fb_calculate_attributes(radius, container, CLS_HIGHCONTRASTSPIN);
}
function getTheme(container) {
    let theme = window.getComputedStyle(container, ':after').getPropertyValue('content');
    return theme.replace(/['"]+/g, '');
}
function setTheme(theme, container, radius, makeElement) {
    let innerContainer = container.querySelector('.' + CLS_SPININWRAP);
    let svg = innerContainer.querySelector('svg');
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
    let uniqueID = random_generator();
    globalTimeOut[uniqueID] = { timeOut: 0, type: 'Bootstrap', radius: radius };
    create_bootstrap_element(innerContainer, uniqueID, makeElement);
    boot_calculate_attributes(innerContainer, radius);
}
function create_bootstrap_element(innerContainer, uniqueID, makeElement) {
    let svgBoot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let viewBoxValue = 64;
    let trans = 32;
    let defaultRadius = 2;
    svgBoot.setAttribute('id', uniqueID);
    svgBoot.setAttribute('class', CLS_BOOTSPIN);
    svgBoot.setAttribute('viewBox', '0 0 ' + viewBoxValue + ' ' + viewBoxValue);
    innerContainer.insertBefore(svgBoot, innerContainer.firstChild);
    for (let item = 0; item <= 7; item++) {
        let bootCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bootCircle.setAttribute('class', CLS_SPINCIRCLE + '_' + item);
        bootCircle.setAttribute('r', defaultRadius + '');
        bootCircle.setAttribute('transform', 'translate(' + trans + ',' + trans + ')');
        svgBoot.appendChild(bootCircle);
    }
}
function boot_calculate_attributes(innerContainer, radius) {
    let svg = innerContainer.querySelector('svg.e-spin-bootstrap');
    svg.style.width = svg.style.height = radius + 'px';
    let x = 0;
    let y = 0;
    let rad = 24;
    let startArc = 90;
    for (let item = 0; item <= 7; item++) {
        let start = defineArcPoints(x, y, rad, startArc);
        let circleEle = svg.querySelector('.' + CLS_SPINCIRCLE + '_' + item);
        circleEle.setAttribute('cx', start.x + '');
        circleEle.setAttribute('cy', start.y + '');
        startArc = startArc >= 360 ? 0 : startArc;
        startArc = startArc + 45;
    }
}
function generateSeries(begin, stop) {
    let series = [];
    let start = begin;
    let end = stop;
    let increment = false;
    let count = 1;
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
    let svg = innerContainer.querySelector('svg.e-spin-bootstrap');
    let id = svg.getAttribute('id');
    for (let i = 1; i <= 8; i++) {
        let circleEle = (innerContainer.getElementsByClassName('e-path-circle_' +
            (i === 8 ? 0 : i))[0]);
        rotation(circleEle, i, i, generateSeries(i, i), id);
    }
    function rotation(circle, start, end, series, id) {
        let count = 0;
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
    let inner = container.querySelector('.e-spinner-inner');
    inner.innerHTML = template;
}
function calculateRadius(width, theme) {
    let defaultSize;
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
    let random = '';
    let combine = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        random += combine.charAt(Math.floor(Math.random() * combine.length));
    }
    return random;
}
function create_fabric_element(innerCon, uniqueID, themeClass, makeElement) {
    let svgFabric = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgFabric.setAttribute('id', uniqueID);
    svgFabric.setAttribute('class', themeClass);
    let fabricCirclePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fabricCirclePath.setAttribute('class', CLS_SPINCIRCLE);
    let fabricCircleArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fabricCircleArc.setAttribute('class', CLS_SPINARC);
    innerCon.insertBefore(svgFabric, innerCon.firstChild);
    svgFabric.appendChild(fabricCirclePath);
    svgFabric.appendChild(fabricCircleArc);
}
function create_material_element(innerContainer, uniqueID, makeElement, cls) {
    let svgMaterial = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgMaterial.setAttribute('class', cls);
    svgMaterial.setAttribute('id', uniqueID);
    let matCirclePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    matCirclePath.setAttribute('class', CLS_SPINCIRCLE);
    innerContainer.insertBefore(svgMaterial, innerContainer.firstChild);
    svgMaterial.appendChild(matCirclePath);
}
function create_spinner_container(target, makeElement) {
    let spinnerContainer = makeElement('div', {});
    spinnerContainer.classList.add(CLS_SPINWRAP);
    let spinnerInnerContainer = makeElement('div', {});
    spinnerInnerContainer.classList.add(CLS_SPININWRAP);
    target.appendChild(spinnerContainer);
    spinnerContainer.appendChild(spinnerInnerContainer);
    return { wrap: spinnerContainer, inner_wrap: spinnerInnerContainer };
}
function animateMaterial(spinnerInfo) {
    let start = 1;
    let end = 149;
    let duration = 1333;
    let max = 75;
    createCircle(start, end, easeAnimation, duration, spinnerInfo.globalInfo[spinnerInfo.uniqueID].count, max, spinnerInfo);
    spinnerInfo.globalInfo[spinnerInfo.uniqueID].count = ++spinnerInfo.globalInfo[spinnerInfo.uniqueID].count % 4;
}
function createCircle(start, end, easing, duration, count, max, spinnerInfo) {
    let id = ++spinnerInfo.globalInfo[spinnerInfo.uniqueID].previousId;
    let startTime = new Date().getTime();
    let change = end - start;
    let diameter = getSize((spinnerInfo.globalInfo[spinnerInfo.uniqueID].radius * 2) + '');
    let strokeSize = getStrokeSize(diameter);
    let rotate = -90 * (spinnerInfo.globalInfo[spinnerInfo.uniqueID].count || 0);
    mat_animation(spinnerInfo);
    function mat_animation(spinnerInfo) {
        let currentTime = Math.max(0, Math.min(new Date().getTime() - startTime, duration));
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
            let svg = container.querySelector('svg.e-spin-material');
            let path = svg.querySelector('path.e-path-circle');
            path.setAttribute('stroke-dashoffset', getDashOffset(diameter, strokeSize, value, max) + '');
            path.setAttribute('transform', 'rotate(' + (rotate) + ' ' + diameter / 2 + ' ' + diameter / 2 + ')');
        }
    }
}
function mat_calculate_attributes(radius, container, type, cls) {
    let diameter = radius * 2;
    let svg = container.querySelector('svg.' + cls);
    let path = svg.querySelector('path.e-path-circle');
    let strokeSize = getStrokeSize(diameter);
    let transformOrigin = (diameter / 2) + 'px';
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
    let parsed = parseFloat(value);
    return parsed;
}
function drawArc(diameter, strokeSize) {
    let radius = diameter / 2;
    let offset = strokeSize / 2;
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
    let timestamp = (current /= duration) * current;
    let timecount = timestamp * current;
    return start + change * (6 * timecount * timestamp + -15 * timestamp * timestamp + 10 * timecount);
}
function fb_calculate_attributes(radius, innerConainer, trgClass) {
    let centerX = radius;
    let centerY = radius;
    let diameter = radius * 2;
    let startArc = 315;
    let endArc = 45;
    let svg = innerConainer.querySelector('.' + trgClass);
    let circle = svg.querySelector('.e-path-circle');
    let path = svg.querySelector('.e-path-arc');
    let transformOrigin = (diameter / 2) + 'px';
    circle.setAttribute('d', defineCircle(centerX, centerY, radius));
    path.setAttribute('d', defineArc(centerX, centerY, radius, startArc, endArc));
    svg.setAttribute('viewBox', '0 0 ' + diameter + ' ' + diameter);
    svg.style.transformOrigin = transformOrigin + ' ' + transformOrigin + ' ' + transformOrigin;
    svg.style.width = svg.style.height = diameter + 'px';
}
function defineArcPoints(centerX, centerY, radius, angle) {
    let radians = (angle - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(radians)),
        y: centerY + (radius * Math.sin(radians))
    };
}
function defineArc(x, y, radius, startArc, endArc) {
    let start = defineArcPoints(x, y, radius, endArc);
    let end = defineArcPoints(x, y, radius, startArc);
    let d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, 0, 0, end.x, end.y
    ].join(' ');
    return d;
}
function defineCircle(x, y, radius) {
    let d = [
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
    let spinnerWrap;
    if (container) {
        spinnerWrap = container.classList.contains(CLS_SPINWRAP) ? container :
            container.querySelector('.' + CLS_SPINWRAP);
    }
    if (container && spinnerWrap) {
        let inner = spinnerWrap.querySelector('.' + CLS_SPININWRAP);
        let spinCheck;
        spinCheck = isHide ? !spinnerWrap.classList.contains(CLS_SPINTEMPLATE) && !spinnerWrap.classList.contains(CLS_HIDESPIN) :
            !spinnerWrap.classList.contains(CLS_SPINTEMPLATE) && !spinnerWrap.classList.contains(CLS_SHOWSPIN);
        if (spinCheck) {
            let svgEle = spinnerWrap.querySelector('svg');
            if (isNullOrUndefined(svgEle)) {
                return;
            }
            let id = svgEle.getAttribute('id');
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
    let makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
    if (args.template !== undefined) {
        spinTemplate = args.template;
        if (args.template !== undefined) {
            spinCSSClass = args.cssClass;
        }
    }
    let container = document.querySelectorAll('.' + CLS_SPINWRAP);
    for (let index = 0; index < container.length; index++) {
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
    let svgElement = container.querySelector('svg');
    let radius = theme === 'Bootstrap' ? parseFloat(svgElement.style.height) : parseFloat(svgElement.style.height) / 2;
    let classNames = svgElement.getAttribute('class');
    let svgClassList = classNames.split(/\s/);
    if (svgClassList.indexOf('e-spin-material') >= 0) {
        let id = svgElement.getAttribute('id');
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

export { PositionData, Popup, getScrollableParent, getZindexPartial, getMaxZindex, calculateRelativeBasedPosition, calculatePosition, fit, isCollide, flip, ButtonProps, AnimationSettings, Dialog, DialogUtility, Animation$1 as Animation, Tooltip, Spinner, createSpinner, showSpinner, hideSpinner, setSpinner };
//# sourceMappingURL=ej2-popups.es2015.js.map
