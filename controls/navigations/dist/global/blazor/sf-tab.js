window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Tab = (function () {
'use strict';

var CLS_TAB = 'e-tab';
var CLS_HEADER = 'e-tab-header';
var CLS_BLA_TEM = 'blazor-template';
var CLS_CONTENT = 'e-content';
var CLS_NEST = 'e-nested';
var CLS_ITEM = 'e-item';
var CLS_RTL = 'e-rtl';
var CLS_ACTIVE = 'e-active';
var CLS_DISABLE = 'e-disable';
var CLS_HIDDEN = 'e-hidden';
var CLS_FOCUS = 'e-focused';
var CLS_INDICATOR = 'e-indicator';
var CLS_WRAP = 'e-tab-wrap';
var CLS_TB_ITEMS = 'e-toolbar-items';
var CLS_TB_ITEM = 'e-toolbar-item';
var CLS_TB_POP = 'e-toolbar-pop';
var CLS_TB_POPUP = 'e-toolbar-popup';
var CLS_POPUP_OPEN = 'e-popup-open';
var CLS_POPUP_CLOSE = 'e-popup-close';
var CLS_PROGRESS = 'e-progress';
var CLS_IGNORE = 'e-ignore';
var CLS_OVERLAY = 'e-overlay';
var CLS_HSCRCNT = 'e-hscroll-content';
var CLS_VSCRCNT = 'e-vscroll-content';
var CLS_VTAB = 'e-vertical-tab';
var CLS_HBOTTOM = 'e-horizontal-bottom';
var CLS_VERTICAL_ICON = 'e-vertical-icon';
var CLS_VLEFT = 'e-vertical-left';
var CLS_VRIGHT = 'e-vertical-right';
var SPACEBAR = 32;
var END = 35;
var SfTab = /** @class */ (function () {
    function SfTab(element, options, dotnetRef) {
        this.show = {};
        this.hide = {};
        this.resizeContext = this.refreshActElePosition.bind(this);
        this.keyConfigs = {
            tab: 'tab',
            home: 'home',
            end: 'end',
            enter: 'enter',
            space: 'space',
            delete: 'delete',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            moveDown: 'downarrow'
        };
        this.element = element;
        if (!sf.base.isNullOrUndefined(element)) {
            this.element.blazor__instance = this;
        }
        this.dotNetRef = dotnetRef;
        this.options = options;
    }
    SfTab.prototype.render = function () {
        var nested = sf.base.closest(this.element, '.' + CLS_CONTENT);
        this.prevIndex = 0;
        this.isPopup = false;
        this.initRender = true;
        this.isSwipeed = false;
        if (!sf.base.isNullOrUndefined(nested)) {
            nested.parentElement.classList.add(CLS_NEST);
        }
        var name = sf.base.Browser.info.name;
        var css = (name === 'msie') ? 'e-ie' : (name === 'edge') ? 'e-edge' : (name === 'safari') ? 'e-safari' : '';
        sf.base.setStyleAttribute(this.element, { 'width': sf.base.formatUnit(this.options.width), 'height': sf.base.formatUnit(this.options.height) });
        sf.base.attributes(this.element, { 'aria-disabled': 'false', 'aria-activedescendant': '' });
        this.setCssClass(this.element, css, true);
        this.updatePopAnimationConfig();
        this.tabId = this.element.id.length > 0 ? ('-' + this.element.id) : sf.base.getRandomId();
        this.wireEvents();
        this.initRender = false;
    };
    SfTab.prototype.serverItemsChanged = function () {
        this.enableAnimation = false;
        this.setActive(this.options.selectedItem);
        if (this.options.loadOn !== 'Dynamic' && !sf.base.isNullOrUndefined(this.cntEle)) {
            var itemCollection = [].slice.call(this.cntEle.children);
            var content_1 = CLS_CONTENT + this.tabId + '_' + this.options.selectedItem;
            itemCollection.forEach(function (item) {
                if (item.classList.contains(CLS_ACTIVE) && item.id !== content_1) {
                    item.classList.remove(CLS_ACTIVE);
                }
                if (item.id === content_1) {
                    item.classList.add(CLS_ACTIVE);
                }
            });
            this.prevIndex = this.options.selectedItem;
            this.triggerAnimation(CLS_ITEM + this.tabId + '_' + this.options.selectedItem, false);
        }
        this.enableAnimation = true;
    };
    SfTab.prototype.headerReady = function () {
        this.initRender = true;
        this.hdrEle = this.getTabHeader();
        this.setOrientation(this.options.headerPlacement, this.hdrEle);
        this.tbItems = sf.base.select('.' + CLS_HEADER + ' .' + CLS_TB_ITEMS, this.element);
        if (!sf.base.isNullOrUndefined(this.tbItems)) {
            sf.base.rippleEffect(this.tbItems, { selector: '.e-tab-wrap' });
        }
        if (sf.base.selectAll('.' + CLS_TB_ITEM, this.element).length > 0) {
            var scrollCnt = void 0;
            this.bdrLine = sf.base.select('.' + CLS_INDICATOR + '.' + CLS_IGNORE, this.element);
            scrollCnt = sf.base.select('.' + this.scrCntClass, this.tbItems);
            if (!sf.base.isNullOrUndefined(scrollCnt)) {
                scrollCnt.insertBefore(this.bdrLine, scrollCnt.firstElementChild);
            }
            else {
                this.tbItems.insertBefore(this.bdrLine, this.tbItems.firstElementChild);
            }
            this.select(this.options.selectedItem);
        }
        this.cntEle = sf.base.select('.' + CLS_TAB + ' > .' + CLS_CONTENT, this.element);
        if (!sf.base.isNullOrUndefined(this.cntEle)) {
            this.touchModule = new sf.base.Touch(this.cntEle, { swipe: this.swipeHandler.bind(this) });
            if (this.options.height !== 'auto' && !this.isVertical()) {
                this.cntEle.style.height = 'calc(100% - ' + this.hdrEle.offsetHeight + 'px)';
            }
        }
        if (this.options.loadOn === 'Demand') {
            var id = this.setActiveContent();
            this.triggerAnimation(id, false);
        }
        this.initRender = false;
    };
    SfTab.prototype.setActiveContent = function () {
        var id = CLS_ITEM + this.tabId + '_' + this.options.selectedItem;
        var item = this.getTrgContent(this.cntEle, this.extIndex(id));
        if (!sf.base.isNullOrUndefined(item)) {
            item.classList.add(CLS_ACTIVE);
        }
        return id;
    };
    SfTab.prototype.removeActiveClass = function () {
        var tabHeader = this.getTabHeader();
        if (tabHeader) {
            var tabItems = sf.base.selectAll('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE, tabHeader);
            sf.base.removeClass(tabItems, CLS_ACTIVE);
        }
    };
    SfTab.prototype.checkPopupOverflow = function (ele) {
        this.tbPop = sf.base.select('.' + CLS_TB_POP, this.element);
        var popIcon = sf.base.select('.e-hor-nav', this.element);
        var tbrItems = sf.base.select('.' + CLS_TB_ITEMS, this.element);
        var lastChild = tbrItems.lastChild;
        if ((!this.isVertical() && ((this.options.enableRtl && ((popIcon.offsetLeft + popIcon.offsetWidth) > tbrItems.offsetLeft))
            || (!this.options.enableRtl && popIcon.offsetLeft < tbrItems.offsetWidth))) ||
            (this.isVertical() && (popIcon.offsetTop < lastChild.offsetTop + lastChild.offsetHeight))) {
            ele.classList.add(CLS_TB_POPUP);
            this.tbPop.insertBefore(ele, sf.base.selectAll('.' + CLS_TB_POPUP, this.tbPop)[0]);
        }
        return true;
    };
    SfTab.prototype.popupHandler = function (target) {
        var ripEle = target.querySelector('.e-ripple-element');
        if (!sf.base.isNullOrUndefined(ripEle)) {
            ripEle.outerHTML = '';
            target.querySelector('.' + CLS_WRAP).classList.remove('e-ripple');
        }
        this.tbItem = sf.base.selectAll('.' + CLS_TB_ITEMS + ' .' + CLS_TB_ITEM, this.hdrEle);
        var lastChild = this.tbItem[this.tbItem.length - 1];
        if (this.tbItem.length !== 0) {
            target.classList.remove(CLS_TB_POPUP);
            target.removeAttribute('style');
            this.tbItems.appendChild(target);
            if (this.checkPopupOverflow(lastChild)) {
                var prevEle = this.tbItems.lastChild.previousElementSibling;
                this.checkPopupOverflow(prevEle);
            }
            this.isPopup = true;
        }
        return sf.base.selectAll('.' + CLS_TB_ITEM, this.tbItems).length - 1;
    };
    SfTab.prototype.previousContentAnimation = function (prev, current) {
        var animation;
        if (this.isPopup || prev <= current) {
            if (this.options.animation.previous.effect === 'SlideLeftIn') {
                animation = {
                    name: 'SlideLeftOut',
                    duration: this.options.animation.previous.duration, timingFunction: this.options.animation.previous.easing
                };
            }
            else {
                animation = null;
            }
        }
        else {
            if (this.options.animation.next.effect === 'SlideRightIn') {
                animation = {
                    name: 'SlideRightOut',
                    duration: this.options.animation.next.duration, timingFunction: this.options.animation.next.easing
                };
            }
            else {
                animation = null;
            }
        }
        return animation;
    };
    SfTab.prototype.triggerPreviousAnimation = function (oldCnt, prevIndex) {
        var animateObj = this.previousContentAnimation(prevIndex, this.options.selectedItem);
        if (!sf.base.isNullOrUndefined(animateObj)) {
            animateObj.begin = function () {
                sf.base.setStyleAttribute(oldCnt, { 'position': 'absolute' });
                sf.base.addClass([oldCnt], [CLS_PROGRESS, 'e-view']);
            };
            animateObj.end = function () {
                oldCnt.style.display = 'none';
                sf.base.removeClass([oldCnt], [CLS_ACTIVE, CLS_PROGRESS, 'e-view']);
                sf.base.setStyleAttribute(oldCnt, { 'display': '', 'position': '' });
                if (oldCnt.childNodes.length === 0) {
                    sf.base.detach(oldCnt);
                }
            };
            new sf.base.Animation(animateObj).animate(oldCnt);
        }
        else {
            oldCnt.classList.remove(CLS_ACTIVE);
        }
    };
    SfTab.prototype.triggerAnimation = function (id, value) {
        var _this = this;
        var prevIndex = this.prevIndex;
        var oldCnt;
        var newCnt;
        if (this.options.loadOn !== 'Dynamic') {
            var itemCollection = [].slice.call(this.element.querySelector('.' + CLS_CONTENT).children);
            itemCollection.forEach(function (item) {
                if (item.id === _this.prevActiveEle) {
                    oldCnt = item;
                }
            });
            var prevEle = this.tbItem[prevIndex];
            newCnt = this.getTrgContent(this.cntEle, this.extIndex(id));
            if (sf.base.isNullOrUndefined(oldCnt) && !sf.base.isNullOrUndefined(prevEle)) {
                var idNo = this.extIndex(prevEle.id);
                oldCnt = this.getTrgContent(this.cntEle, idNo);
            }
        }
        else {
            newCnt = this.cntEle.firstElementChild;
        }
        if (!sf.base.isNullOrUndefined(newCnt)) {
            this.prevActiveEle = newCnt.id;
        }
        if (this.initRender || value === false || this.options.animation === {} || sf.base.isNullOrUndefined(this.options.animation)) {
            if (oldCnt && oldCnt !== newCnt) {
                oldCnt.classList.remove(CLS_ACTIVE);
            }
            return;
        }
        var cnt = sf.base.select('.' + CLS_CONTENT, this.element);
        var animateObj;
        if (this.prevIndex > this.options.selectedItem && !this.isPopup) {
            var openEff = this.options.animation.previous.effect;
            animateObj = {
                name: ((openEff === 'None') ? '' : ((openEff !== 'SlideLeftIn') ? openEff : 'SlideLeftIn')),
                duration: this.options.animation.previous.duration,
                timingFunction: this.options.animation.previous.easing
            };
        }
        else if (this.isPopup || this.prevIndex < this.options.selectedItem || this.prevIndex === this.options.selectedItem) {
            var clsEff = this.options.animation.next.effect;
            animateObj = {
                name: ((clsEff === 'None') ? '' : ((clsEff !== 'SlideRightIn') ? clsEff : 'SlideRightIn')),
                duration: this.options.animation.next.duration,
                timingFunction: this.options.animation.next.easing
            };
        }
        animateObj.progress = function () {
            cnt.classList.add(CLS_PROGRESS);
            _this.setActiveBorder();
        };
        animateObj.end = function () {
            cnt.classList.remove(CLS_PROGRESS);
            newCnt.classList.add(CLS_ACTIVE);
        };
        if (!this.initRender && !sf.base.isNullOrUndefined(oldCnt)) {
            this.triggerPreviousAnimation(oldCnt, prevIndex);
        }
        this.isPopup = false;
        if (animateObj.name === '') {
            newCnt.classList.add(CLS_ACTIVE);
        }
        else {
            new sf.base.Animation(animateObj).animate(newCnt);
        }
    };
    SfTab.prototype.keyPressed = function (trg) {
        var trgParent = sf.base.closest(trg, '.' + CLS_HEADER + ' .' + CLS_TB_ITEM);
        var trgIndex = this.getEleIndex(trgParent);
        if (!sf.base.isNullOrUndefined(this.popEle) && trg.classList.contains('e-hor-nav')) {
            (this.popEle.classList.contains(CLS_POPUP_OPEN)) ? this.popObj.hide(this.hide) : this.popObj.show(this.show);
        }
        else if (trg.classList.contains('e-scroll-nav')) {
            trg.click();
        }
        else {
            if (!sf.base.isNullOrUndefined(trgParent) && trgParent.classList.contains(CLS_ACTIVE) === false) {
                this.select(trgIndex);
                if (!sf.base.isNullOrUndefined(this.popEle)) {
                    this.popObj.hide(this.hide);
                }
            }
        }
    };
    SfTab.prototype.getTabHeader = function () {
        var headers = [].slice.call(this.element.children).filter(function (e) { return e.classList.contains(CLS_HEADER); });
        if (headers.length > 0) {
            return headers[0];
        }
        else {
            var wrap = [].slice.call(this.element.children).filter(function (e) { return !e.classList.contains(CLS_BLA_TEM); })[0];
            if (!wrap) {
                return undefined;
            }
            return [].slice.call(wrap.children).filter(function (e) { return e.classList.contains(CLS_HEADER); })[0];
        }
    };
    SfTab.prototype.getEleIndex = function (item) {
        return Array.prototype.indexOf.call(sf.base.selectAll('.' + CLS_TB_ITEM, this.getTabHeader()), item);
    };
    SfTab.prototype.extIndex = function (id) {
        return id.replace(CLS_ITEM + this.tabId + '_', '');
    };
    SfTab.prototype.getTrgContent = function (cntEle, no) {
        var ele;
        if (this.element.classList.contains(CLS_NEST)) {
            ele = sf.base.select('.' + CLS_NEST + '> .' + CLS_CONTENT + ' > #' + CLS_CONTENT + this.tabId + '_' + no, this.element);
        }
        else {
            ele = this.findEle(cntEle.children, CLS_CONTENT + this.tabId + '_' + no);
        }
        return ele;
    };
    SfTab.prototype.findEle = function (items, key) {
        var ele;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === key) {
                ele = items[i];
                break;
            }
        }
        return ele;
    };
    SfTab.prototype.isVertical = function () {
        var isVertical = (this.options.headerPlacement === 'Left' || this.options.headerPlacement === 'Right') ? true : false;
        this.scrCntClass = (isVertical) ? CLS_VSCRCNT : CLS_HSCRCNT;
        return isVertical;
    };
    SfTab.prototype.updatePopAnimationConfig = function () {
        this.show = { name: (this.isVertical() ? 'FadeIn' : 'SlideDown'), duration: 100 };
        this.hide = { name: (this.isVertical() ? 'FadeOut' : 'SlideUp'), duration: 100 };
    };
    SfTab.prototype.focusItem = function () {
        var curActItem = sf.base.select(' #' + CLS_ITEM + this.tabId + '_' + this.options.selectedItem, this.hdrEle);
        if (!sf.base.isNullOrUndefined(curActItem)) {
            curActItem.firstElementChild.focus();
        }
    };
    SfTab.prototype.serverChangeOrientation = function (newProp, tbarEle, isVertical, isChange) {
        this.setOrientation(newProp, this.hdrEle);
        sf.base.removeClass([this.element], [CLS_VTAB, CLS_VLEFT, CLS_VRIGHT]);
        if (isChange) {
            this.changeToolbarOrientation(tbarEle, isVertical);
        }
        if (this.isVertical()) {
            var tbPos = (this.options.headerPlacement === 'Left') ? CLS_VLEFT : CLS_VRIGHT;
            if (!this.element.classList.contains(CLS_NEST)) {
                sf.base.addClass([this.element], [CLS_VTAB, tbPos]);
            }
            else {
                sf.base.addClass([this.hdrEle], [CLS_VTAB, tbPos]);
            }
        }
        this.setActiveBorder();
        this.focusItem();
    };
    SfTab.prototype.changeToolbarOrientation = function (toolbarEle, isVertical) {
        if (!sf.base.isNullOrUndefined(toolbarEle) && !sf.base.isNullOrUndefined(toolbarEle.blazor__instance)) {
            // tslint:disable:no-any
            toolbarEle.blazor__instance.options.width = (isVertical ? 'auto' : '100%');
            toolbarEle.blazor__instance.options.height = (isVertical ? '100%' : 'auto');
            toolbarEle.blazor__instance.options.isVertical = isVertical;
            toolbarEle.blazor__instance.changeOrientation();
            // tslint:enable:no-any
        }
        this.updatePopAnimationConfig();
    };
    SfTab.prototype.setOrientation = function (place, ele) {
        var headerPos = Array.prototype.indexOf.call(this.element.children, ele);
        var contentPos = Array.prototype.indexOf.call(this.element.children, this.element.querySelector('.' + CLS_CONTENT));
        if (place === 'Bottom' && (contentPos > headerPos)) {
            this.element.appendChild(ele);
        }
        else {
            sf.base.removeClass([ele], [CLS_HBOTTOM]);
            this.element.insertBefore(ele, sf.base.select('.' + CLS_CONTENT, this.element));
        }
    };
    SfTab.prototype.setCssClass = function (ele, cls, val) {
        if (cls === '') {
            return;
        }
        if (val) {
            sf.base.addClass([ele], cls.split(' '));
        }
        else {
            sf.base.removeClass([ele], cls.split(' '));
        }
    };
    SfTab.prototype.setActiveBorder = function () {
        var bar;
        var scrollCnt;
        var trgHdrEle = this.getTabHeader();
        var trg = sf.base.select('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE, trgHdrEle);
        if (trg === null) {
            return;
        }
        if (trg.classList.contains(CLS_TB_POPUP)) {
            this.popupHandler(trg);
        }
        var root = sf.base.closest(trg, '.' + CLS_TAB);
        if (this.element !== root) {
            return;
        }
        this.tbItems = sf.base.select('.' + CLS_TB_ITEMS, trgHdrEle);
        bar = sf.base.select('.' + CLS_INDICATOR, trgHdrEle);
        scrollCnt = sf.base.select('.' + CLS_TB_ITEMS + ' .' + this.scrCntClass, trgHdrEle);
        if (this.isVertical()) {
            sf.base.setStyleAttribute(bar, { 'left': '', 'right': '' });
            var tbHeight = (sf.base.isNullOrUndefined(scrollCnt)) ? this.tbItems.offsetHeight : scrollCnt.offsetHeight;
            if (tbHeight !== 0) {
                sf.base.setStyleAttribute(bar, { 'top': trg.offsetTop + 'px', 'height': trg.offsetHeight + 'px' });
            }
            else {
                sf.base.setStyleAttribute(bar, { 'top': 0, 'height': 0 });
            }
        }
        else {
            sf.base.setStyleAttribute(bar, { 'top': '', 'height': '' });
            var tbWidth = (sf.base.isNullOrUndefined(scrollCnt)) ? this.tbItems.offsetWidth : scrollCnt.offsetWidth;
            if (tbWidth !== 0) {
                sf.base.setStyleAttribute(bar, { 'left': trg.offsetLeft + 'px', 'right': tbWidth - (trg.offsetLeft + trg.offsetWidth) + 'px' });
            }
            else {
                sf.base.setStyleAttribute(bar, { 'left': 'auto', 'right': 'auto' });
            }
        }
        if (!sf.base.isNullOrUndefined(this.bdrLine)) {
            this.bdrLine.classList.remove(CLS_HIDDEN);
        }
    };
    SfTab.prototype.setActive = function (value) {
        this.tbItem = sf.base.selectAll('.' + CLS_TB_ITEM, this.getTabHeader());
        var trg = this.hdrEle.querySelector('.' + CLS_TB_ITEM + '[data-index="' + value + '"]');
        if (!trg || value < 0 || isNaN(value) || this.tbItem.length === 0) {
            return;
        }
        this.options.selectedItem = value;
        if (trg.classList.contains(CLS_ACTIVE)) {
            this.setActiveBorder();
            return;
        }
        var prev = this.tbItem[this.prevIndex];
        if (!sf.base.isNullOrUndefined(prev)) {
            prev.removeAttribute('aria-controls');
        }
        sf.base.attributes(trg, { 'aria-controls': CLS_CONTENT + this.tabId + '_' + value });
        var id = trg.id;
        this.removeActiveClass();
        trg.classList.add(CLS_ACTIVE);
        trg.setAttribute('aria-selected', 'true');
        var no = Number(this.extIndex(id));
        if (sf.base.isNullOrUndefined(this.prevActiveEle)) {
            this.prevActiveEle = CLS_CONTENT + this.tabId + '_' + no;
        }
        sf.base.attributes(this.element, { 'aria-activedescendant': id });
        if (this.options.loadOn === 'Init') {
            this.cntEle = sf.base.select('.' + CLS_TAB + ' > .' + CLS_CONTENT, this.element);
            var item = this.getTrgContent(this.cntEle, this.extIndex(id));
            if (!sf.base.isNullOrUndefined(item)) {
                item.classList.add(CLS_ACTIVE);
            }
            this.triggerAnimation(id, this.enableAnimation);
        }
        this.setActiveBorder();
        this.refreshItemVisibility(trg);
        if (!this.initRender) {
            trg.firstElementChild.focus();
        }
    };
    SfTab.prototype.contentReady = function () {
        var id = this.setActiveContent();
        this.triggerAnimation(id, this.enableAnimation);
    };
    SfTab.prototype.setRTL = function (value) {
        this.setCssClass(this.element, CLS_RTL, value);
        this.refreshActiveBorder();
    };
    SfTab.prototype.refreshActiveBorder = function () {
        if (!sf.base.isNullOrUndefined(this.bdrLine)) {
            this.bdrLine.classList.add(CLS_HIDDEN);
        }
        this.setActiveBorder();
    };
    SfTab.prototype.showPopup = function (config) {
        var tbPop = sf.base.select('.e-popup.e-toolbar-pop', this.hdrEle);
        if (tbPop.classList.contains('e-popup-close')) {
            var tbPopObj = (tbPop && tbPop.ej2_instances[0]);
            tbPopObj.position.X = (this.options.headerPlacement === 'Left') ? 'left' : 'right';
            tbPopObj.dataBind();
            tbPopObj.show(config);
        }
    };
    SfTab.prototype.wireEvents = function () {
        window.addEventListener('resize', this.resizeContext);
        sf.base.EventHandler.add(this.element, 'keydown', this.spaceKeyDown, this);
        if (!sf.base.isNullOrUndefined(this.cntEle)) {
            this.touchModule = new sf.base.Touch(this.cntEle, { swipe: this.swipeHandler.bind(this) });
        }
        this.keyModule = new sf.base.KeyboardEvents(this.element, { keyAction: this.keyHandler.bind(this), keyConfigs: this.keyConfigs });
        this.tabKeyModule = new sf.base.KeyboardEvents(this.element, {
            keyAction: this.keyHandler.bind(this),
            keyConfigs: { openPopup: 'shift+f10', tab: 'tab', shiftTab: 'shift+tab' },
            eventName: 'keydown'
        });
    };
    SfTab.prototype.unWireEvents = function () {
        this.keyModule.destroy();
        this.tabKeyModule.destroy();
        if (!sf.base.isNullOrUndefined(this.cntEle)) {
            this.touchModule.destroy();
        }
        window.removeEventListener('resize', this.resizeContext);
        sf.base.EventHandler.remove(this.element, 'keydown', this.spaceKeyDown);
        sf.base.removeClass([this.element], [CLS_RTL, CLS_FOCUS]);
    };
    SfTab.prototype.swipeHandler = function (e) {
        if (e.velocity < 3 && sf.base.isNullOrUndefined(e.originalEvent.changedTouches)) {
            return;
        }
        if (e.originalEvent) {
            e.originalEvent.stopPropagation();
        }
        this.isSwipeed = true;
        if (e.swipeDirection === 'Right' && this.options.selectedItem !== 0) {
            for (var k = this.options.selectedItem - 1; k >= 0; k--) {
                if (!this.tbItem[k].classList.contains(CLS_HIDDEN) && !this.tbItem[k].classList.contains(CLS_DISABLE)) {
                    this.select(k);
                    break;
                }
            }
        }
        else if (e.swipeDirection === 'Left' && (this.options.selectedItem !== sf.base.selectAll('.' + CLS_TB_ITEM, this.element).length - 1)) {
            for (var i = this.options.selectedItem + 1; i < this.tbItem.length; i++) {
                if (!this.tbItem[i].classList.contains(CLS_HIDDEN) && !this.tbItem[i].classList.contains(CLS_DISABLE)) {
                    this.select(i);
                    break;
                }
            }
        }
        this.isSwipeed = false;
    };
    SfTab.prototype.spaceKeyDown = function (e) {
        if ((e.keyCode === SPACEBAR && e.which === SPACEBAR) || (e.keyCode === END && e.which === END)) {
            var clstHead = sf.base.closest(e.target, '.' + CLS_HEADER);
            if (!sf.base.isNullOrUndefined(clstHead)) {
                e.preventDefault();
            }
        }
    };
    SfTab.prototype.keyHandler = function (e) {
        if (this.element.classList.contains(CLS_DISABLE)) {
            return;
        }
        this.element.classList.add(CLS_FOCUS);
        var trg = e.target;
        var tabHeader = this.getTabHeader();
        var actEle = sf.base.select('.' + CLS_ACTIVE, tabHeader);
        this.popEle = sf.base.select('.' + CLS_TB_POP, tabHeader);
        if (!sf.base.isNullOrUndefined(this.popEle)) {
            this.popObj = this.popEle.ej2_instances[0];
        }
        switch (e.action) {
            case 'space':
            case 'enter':
                if (trg.parentElement.classList.contains(CLS_DISABLE)) {
                    return;
                }
                if (e.action === 'enter' && trg.classList.contains('e-hor-nav')) {
                    this.showPopup(this.show);
                    break;
                }
                this.keyPressed(trg);
                break;
            case 'tab':
            case 'shiftTab':
                if (trg.classList.contains(CLS_WRAP)
                    && sf.base.closest(trg, '.' + CLS_TB_ITEM).classList.contains(CLS_ACTIVE) === false) {
                    trg.setAttribute('tabindex', '-1');
                }
                if (this.popObj && sf.base.isVisible(this.popObj.element)) {
                    this.popObj.hide(this.hide);
                }
                actEle.children.item(0).setAttribute('tabindex', '0');
                break;
            case 'moveLeft':
            case 'moveRight':
                var item = sf.base.closest(document.activeElement, '.' + CLS_TB_ITEM);
                if (!sf.base.isNullOrUndefined(item)) {
                    this.refreshItemVisibility(item);
                }
                break;
            case 'openPopup':
                e.preventDefault();
                if (!sf.base.isNullOrUndefined(this.popEle) && this.popEle.classList.contains(CLS_POPUP_CLOSE)) {
                    this.popObj.show(this.show);
                }
                break;
            case 'delete':
                var trgParent = sf.base.closest(trg, '.' + CLS_TB_ITEM);
                if (this.options.showCloseButton === true && !sf.base.isNullOrUndefined(trgParent)) {
                    var nxtSib = trgParent.nextSibling;
                    if (!sf.base.isNullOrUndefined(nxtSib) && nxtSib.classList.contains(CLS_TB_ITEM)) {
                        nxtSib.firstElementChild.focus();
                    }
                    this.dotNetRef.invokeMethodAsync('RemoveTab', parseInt(trgParent.getAttribute('data-index'), 10));
                }
                this.setActiveBorder();
                break;
        }
    };
    SfTab.prototype.refreshActElePosition = function () {
        var activeEle = sf.base.select('.' + CLS_TB_ITEM + '.' + CLS_TB_POPUP + '.' + CLS_ACTIVE, this.element);
        if (!sf.base.isNullOrUndefined(activeEle)) {
            this.select(this.getEleIndex(activeEle));
        }
        this.refreshActiveBorder();
    };
    SfTab.prototype.refreshItemVisibility = function (target) {
        var scrCnt = sf.base.select('.' + this.scrCntClass, this.tbItems);
        if (!this.isVertical() && !sf.base.isNullOrUndefined(scrCnt)) {
            var scrBar = sf.base.select('.e-hscroll-bar', this.tbItems);
            var scrStart = scrBar.scrollLeft;
            var scrEnd = scrStart + scrBar.offsetWidth;
            var eleStart = target.offsetLeft;
            var eleWidth = target.offsetWidth;
            var eleEnd = target.offsetLeft + target.offsetWidth;
            if ((scrStart < eleStart) && (scrEnd < eleEnd)) {
                var eleViewRange = scrEnd - eleStart;
                scrBar.scrollLeft = scrStart + (eleWidth - eleViewRange);
            }
            else {
                if ((scrStart > eleStart) && (scrEnd > eleEnd)) {
                    var eleViewRange = eleEnd - scrStart;
                    scrBar.scrollLeft = scrStart - (eleWidth - eleViewRange);
                }
            }
        }
        else {
            return;
        }
    };
    SfTab.prototype.enableTab = function (index, value) {
        var tbItems = sf.base.selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (sf.base.isNullOrUndefined(tbItems)) {
            return;
        }
        if (value === true) {
            tbItems.classList.remove(CLS_DISABLE, CLS_OVERLAY);
            tbItems.firstElementChild.setAttribute('tabindex', '-1');
        }
        else {
            tbItems.classList.add(CLS_DISABLE, CLS_OVERLAY);
            tbItems.firstElementChild.removeAttribute('tabindex');
            if (tbItems.classList.contains(CLS_ACTIVE)) {
                this.select(index + 1);
            }
        }
        tbItems.setAttribute('aria-disabled', (value === true) ? 'false' : 'true');
    };
    SfTab.prototype.hideTab = function (index, value) {
        if (value === void 0) { value = true; }
        var items;
        var item = sf.base.selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (sf.base.isNullOrUndefined(item)) {
            return;
        }
        this.bdrLine.classList.add(CLS_HIDDEN);
        if (value) {
            item.classList.add(CLS_HIDDEN);
            items = sf.base.selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_HIDDEN + ')', this.tbItems);
            if (items.length !== 0 && item.classList.contains(CLS_ACTIVE)) {
                if (index !== 0) {
                    for (var i = index - 1; i >= 0; i--) {
                        if (!this.tbItem[i].classList.contains(CLS_HIDDEN)) {
                            this.select(i);
                            break;
                        }
                        else if (i === 0) {
                            for (var k = index + 1; k < this.tbItem.length; k++) {
                                if (!this.tbItem[k].classList.contains(CLS_HIDDEN)) {
                                    this.select(k);
                                    break;
                                }
                            }
                        }
                    }
                }
                else {
                    for (var k = index + 1; k < this.tbItem.length; k++) {
                        if (!this.tbItem[k].classList.contains(CLS_HIDDEN)) {
                            this.select(k);
                            break;
                        }
                    }
                }
            }
            else if (items.length === 0) {
                this.element.classList.add(CLS_HIDDEN);
            }
        }
        else {
            this.element.classList.remove(CLS_HIDDEN);
            items = sf.base.selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_HIDDEN + ')', this.tbItems);
            item.classList.remove(CLS_HIDDEN);
            if (items.length === 0) {
                this.select(index);
            }
        }
        this.setActiveBorder();
        item.setAttribute('aria-hidden', '' + value);
    };
    SfTab.prototype.select = function (args) {
        var tabHeader = this.getTabHeader();
        this.tbItems = sf.base.select('.' + CLS_TB_ITEMS, tabHeader);
        this.tbItem = sf.base.selectAll('.' + CLS_TB_ITEM, tabHeader);
        this.prevItem = this.tbItem[this.prevIndex];
        var value;
        var selectedItem = this.options.selectedItem;
        if (sf.base.isNullOrUndefined(selectedItem) || (selectedItem < 0) || (this.tbItem.length <= selectedItem) || isNaN(selectedItem)) {
            this.options.selectedItem = 0;
        }
        var trg = this.tbItem[args];
        if (!sf.base.isNullOrUndefined(this.prevItem) && !this.prevItem.classList.contains(CLS_DISABLE)) {
            this.prevItem.children.item(0).setAttribute('tabindex', '-1');
        }
        if (!this.initRender) {
            if (trg) {
                value = parseInt(trg.getAttribute('data-index'), 10);
            }
            var eventArg = {
                previousItem: this.prevItem,
                previousIndex: this.prevIndex,
                selectedItem: this.tbItem[this.options.selectedItem],
                selectedIndex: this.options.selectedItem,
                selectedContent: null,
                selectingItem: trg,
                selectingIndex: value,
                selectingContent: null,
                isSwiped: this.isSwipeed,
                cancel: false
            };
            this.dotNetRef.invokeMethodAsync('SelectingEvent', eventArg, value);
        }
        else {
            this.selectingContent(args);
        }
    };
    SfTab.prototype.selectingContent = function (args) {
        this.tbItem = sf.base.selectAll('.' + CLS_TB_ITEM, this.hdrEle);
        if (this.tbItem.length > args && args >= 0 && !isNaN(args)) {
            this.prevIndex = this.options.selectedItem;
            var item = this.hdrEle.querySelector('.' + CLS_TB_ITEM + '[data-index="' + args + '"]');
            if (item && item.classList.contains(CLS_TB_POPUP)) {
                this.popupHandler(item);
            }
            this.setActive(args);
        }
        else {
            this.setActive(0);
        }
    };
    SfTab.prototype.disable = function (value) {
        this.setCssClass(this.element, CLS_DISABLE, value);
        this.element.setAttribute('aria-disabled', '' + value);
    };
    SfTab.prototype.headerItemsUpdate = function (args) {
        var tabHeader = this.getTabHeader();
        this.tbItems = sf.base.select('.' + CLS_TB_ITEMS, tabHeader);
        this.tbItem = sf.base.selectAll('.' + CLS_TB_ITEM, tabHeader);
        this.prevItem = this.tbItem[this.prevIndex];
        if (!sf.base.isNullOrUndefined(this.prevItem) && !this.prevItem.classList.contains(CLS_DISABLE)) {
            this.prevItem.children.item(0).setAttribute('tabindex', '-1');
        }
        this.selectingContent(args);
    };
    SfTab.prototype.destroy = function () {
        var _this = this;
        this.unWireEvents();
        ['aria-disabled', 'aria-activedescendant', 'tabindex'].forEach(function (val) {
            _this.element.removeAttribute(val);
        });
    };
    SfTab.prototype.getContentElement = function (index) {
        return sf.base.select('.' + CLS_CONTENT + ' #' + CLS_CONTENT + this.tabId + '_' + index, this.element);
    };
    return SfTab;
}());
// tslint:disable
var Tab = {
    initialize: function (element, options, dotnetRef) {
        var instance = new SfTab(element, options, dotnetRef);
        instance.render();
    },
    headerReady: function (element, isCreatedEvent) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.headerReady();
            if (!isCreatedEvent) {
                element.blazor__instance.dotNetRef.invokeMethodAsync("CreatedEvent", null);
            }
        }
    },
    contentReady: function (element, selectingIndex, isPopup) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.classList.remove(CLS_FOCUS);
            element.blazor__instance.isPopup = isPopup;
            element.blazor__instance.headerItemsUpdate(selectingIndex);
            if (element.blazor__instance.options.loadOn !== 'Init') {
                element.blazor__instance.contentReady();
            }
        }
    },
    selectingContent: function (element, selectingIndex) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.selectingContent(selectingIndex);
            if (element.blazor__instance.options.loadOn !== 'Init') {
                element.blazor__instance.contentReady();
            }
        }
    },
    serverItemsChanged: function (element, selectedItem, animation, isVerticalIcon) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.selectedItem = selectedItem;
            element.blazor__instance.options.animation = animation;
            if (isVerticalIcon) {
                sf.base.addClass([element], CLS_VERTICAL_ICON);
            }
            else {
                sf.base.removeClass([element], CLS_VERTICAL_ICON);
            }
            element.blazor__instance.serverItemsChanged();
        }
    },
    enableTab: function (element, index, value) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.enableTab(index, value);
        }
    },
    hideTab: function (element, index, value) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.hideTab(index, value);
        }
    },
    select: function (element, index) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.select(index);
        }
    },
    disable: function (element, value) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.disable(value);
        }
    },
    setCssClass: function (element, cssClass) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            if (element.blazor__instance.options.cssClass !== '') {
                element.blazor__instance.setCssClass(element, element.blazor__instance.options.cssClass, false);
            }
            element.blazor__instance.setCssClass(element, cssClass, true);
            element.blazor__instance.options.cssClass = cssClass;
        }
    },
    showCloseButton: function (element, showCloseButton) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.showCloseButton = showCloseButton;
            element.blazor__instance.refreshActElePosition();
        }
    },
    headerPlacement: function (element, headerPlacement, selectedItem, toolbarEle, toolbarCssClass, isVertical, isOrientationChange) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.headerPlacement = headerPlacement;
            element.blazor__instance.options.selectedItem = selectedItem;
            if (!sf.base.isNullOrUndefined(toolbarEle) && !sf.base.isNullOrUndefined(toolbarEle.blazor__instance)) {
                // tslint:disable-next-line:no-any
                toolbarEle.blazor__instance.setCssClass(toolbarCssClass);
            }
            element.blazor__instance.serverChangeOrientation(headerPlacement, toolbarEle, isVertical, isOrientationChange);
        }
    },
    enableRtl: function (element, enableRtl) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.enableRtl = enableRtl;
            element.blazor__instance.setRTL(enableRtl);
        }
    },
    overflowMode: function (element) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.refreshActElePosition();
        }
    },
    refresh: function (element) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.refreshActiveBorder();
        }
    },
    destroy: function (element, elementId, selectedItem) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            if (element.blazor__instance.options.enablePersistence) {
                window.localStorage.setItem(elementId, selectedItem);
            }
            element.blazor__instance.destroy();
        }
    },
    getTabItem: function (element, index) {
        if (!sf.base.isNullOrUndefined(element)) {
            var dom = element.querySelector('.' + CLS_TB_ITEM + '[data-index="' + index + '"]');
            if (dom) {
                // tslint:disable-next-line:no-any
                return JSON.stringify(window.sfBlazor.getDomObject("tabitem", dom));
            }
        }
        return null;
    },
    getTabContent: function (element, index) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            var dom = element.blazor__instance.getContentElement(index);
            if (dom) {
                // tslint:disable-next-line:no-any
                return JSON.stringify(window.sfBlazor.getDomObject("tabcontent", dom));
            }
        }
        return null;
    }
};

return Tab;

}());
