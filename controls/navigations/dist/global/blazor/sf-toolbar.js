window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Toolbar = (function () {
'use strict';

var CLS_TOOLBAR = 'e-toolbar';
var CLS_VERTICAL = 'e-vertical';
var CLS_ITEMS = 'e-toolbar-items';
var BZ_ITEMS = 'e-blazor-toolbar-items';
var CLS_ITEM = 'e-toolbar-item';
var CLS_RTL = 'e-rtl';
var CLS_SEPARATOR = 'e-separator';
var CLS_POPUPICON = 'e-popup-up-icon';
var CLS_POPUPDOWN = 'e-popup-down-icon';
var CLS_POPUPOPEN = 'e-popup-open';
var CLS_TEMPLATE = 'e-template';
var CLS_DISABLE = 'e-overlay';
var CLS_POPUPTEXT = 'e-toolbar-text';
var CLS_TBARTEXT = 'e-popup-text';
var CLS_TBAROVERFLOW = 'e-overflow-show';
var CLS_POPOVERFLOW = 'e-overflow-hide';
var CLS_TBARNAV = 'e-hor-nav';
var CLS_TBARSCRLNAV = 'e-scroll-nav';
var CLS_TBARRIGHT = 'e-toolbar-right';
var CLS_TBARLEFT = 'e-toolbar-left';
var CLS_TBARCENTER = 'e-toolbar-center';
var CLS_TBARPOS = 'e-tbar-pos';
var CLS_HSCROLLCNT = 'e-hscroll-content';
var CLS_VSCROLLCNT = 'e-vscroll-content';
var CLS_POPUPNAV = 'e-hor-nav';
var CLS_POPUPCLASS = 'e-toolbar-pop';
var CLS_POPUP = 'e-toolbar-popup';
var CLS_TBARBTNTEXT = 'e-tbar-btn-text';
var CLS_TBARNAVACT = 'e-nav-active';
var CLS_TBARIGNORE = 'e-ignore';
var CLS_POPPRI = 'e-popup-alone';
var CLS_HIDDEN = 'e-hidden';
var CLS_MULTIROW = 'e-toolbar-multirow';
var CLS_MULTIROWPOS = 'e-multirow-pos';
var CLS_MULTIROW_SEPARATOR = 'e-multirow-separator';
var CLS_EXTENDABLE_SEPARATOR = 'e-extended-separator';
var CLS_EXTEANDABLE_TOOLBAR = 'e-extended-toolbar';
var CLS_EXTENDABLECLASS = 'e-toolbar-extended';
var CLS_EXTENDPOPUP = 'e-expended-nav';
var CLS_EXTENDEDPOPOPEN = 'e-tbar-extended';
var CLS_ICON_CLOSE = 'e-close-icon';
var TAB = 9;
var DOWNARROW = 40;
var UPARROW = 38;
var END = 35;
var HOME = 36;
var SfToolbar = /** @class */ (function () {
    function SfToolbar(element, options, dotnetRef) {
        this.resizeContext = this.resize.bind(this);
        this.keyConfigs = {
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            moveDown: 'downarrow',
            popupOpen: 'enter',
            popupClose: 'escape',
            tab: 'tab',
            home: 'home',
            end: 'end',
        };
        this.element = element;
        if (!sf.base.isNullOrUndefined(element)) {
            this.element.blazor__instance = this;
        }
        this.dotNetRef = dotnetRef;
        this.options = options;
    }
    SfToolbar.prototype.destroy = function () {
        this.unwireEvents();
        this.clearProperty();
        this.popObj = null;
        this.tbarAlign = null;
    };
    SfToolbar.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.element, 'click', this.clickHandler, this);
        window.addEventListener('resize', this.resizeContext);
        if (this.options.allowKeyboard) {
            this.wireKeyboardEvent();
        }
    };
    SfToolbar.prototype.wireKeyboardEvent = function () {
        this.keyModule = new sf.base.KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs
        });
        sf.base.EventHandler.add(this.element, 'keydown', this.docKeyDown, this);
        this.element.setAttribute('tabIndex', '0');
    };
    SfToolbar.prototype.unwireKeyboardEvent = function () {
        if (this.keyModule) {
            sf.base.EventHandler.remove(this.element, 'keydown', this.docKeyDown);
            this.keyModule.destroy();
            this.keyModule = null;
        }
    };
    SfToolbar.prototype.docKeyDown = function (e) {
        if (e.target.tagName === 'INPUT') {
            return;
        }
        var popCheck = !sf.base.isNullOrUndefined(this.popObj) && sf.base.isVisible(this.popObj.element) && this.options.overflowMode !== 'Extended';
        if (e.keyCode === TAB && e.target.classList.contains('e-hor-nav') === true && popCheck) {
            this.popObj.hide({ name: 'FadeOut', duration: 100 });
        }
        var keyCheck = (e.keyCode === DOWNARROW || e.keyCode === UPARROW || e.keyCode === END || e.keyCode === HOME);
        if (keyCheck) {
            e.preventDefault();
        }
    };
    SfToolbar.prototype.unwireEvents = function () {
        sf.base.EventHandler.remove(this.element, 'click', this.clickHandler);
        this.destroyScroll();
        this.unwireKeyboardEvent();
        window.removeEventListener('resize', this.resizeContext);
        sf.base.EventHandler.remove(document, 'scroll', this.docEvent);
        sf.base.EventHandler.remove(document, 'click', this.docEvent);
    };
    SfToolbar.prototype.clearProperty = function () {
        this.tbarEle = [];
        this.tbarAlgEle = { lefts: [], centers: [], rights: [] };
    };
    SfToolbar.prototype.docEvent = function (e) {
        var popEle = sf.base.closest(e.target, '.e-popup');
        if (this.popObj && sf.base.isVisible(this.popObj.element) && !popEle && this.options.overflowMode === 'Popup') {
            this.popObj.hide({ name: 'FadeOut', duration: 100 });
        }
    };
    SfToolbar.prototype.destroyScroll = function () {
        if (this.scrollModule) {
            if (this.tbarAlign) {
                sf.base.addClass([this.scrollModule.element], CLS_TBARPOS);
            }
            this.scrollModule.destroy();
            this.scrollModule = null;
        }
    };
    SfToolbar.prototype.destroyMode = function () {
        if (this.scrollModule) {
            sf.base.removeClass([this.scrollModule.element], CLS_RTL);
            this.destroyScroll();
        }
        sf.base.removeClass([this.element], CLS_EXTENDEDPOPOPEN);
        sf.base.removeClass([this.element], CLS_EXTEANDABLE_TOOLBAR);
        var tempEle = this.element.querySelector('.e-toolbar-multirow');
        if (tempEle) {
            sf.base.removeClass([tempEle], CLS_MULTIROW);
        }
        if (this.popObj) {
            this.popupRefresh(this.popObj.element, true);
        }
    };
    SfToolbar.prototype.elementFocus = function (ele) {
        var fChild = ele.firstElementChild;
        if (fChild) {
            fChild.focus();
            this.activeEleSwitch(ele);
        }
        else {
            ele.focus();
        }
    };
    SfToolbar.prototype.clstElement = function (tbrNavChk, trgt) {
        var clst;
        if (tbrNavChk && this.popObj && sf.base.isVisible(this.popObj.element)) {
            clst = this.popObj.element.querySelector('.' + CLS_ITEM);
        }
        else if (this.element === trgt || tbrNavChk) {
            // tslint:disable-next-line:max-line-length
            clst = this.element.querySelector('.' + CLS_ITEM + ':not(.' + CLS_DISABLE + ' ):not(.' + CLS_SEPARATOR + ' ):not(.' + CLS_HIDDEN + ' )');
        }
        else {
            clst = sf.base.closest(trgt, '.' + CLS_ITEM);
        }
        return clst;
    };
    SfToolbar.prototype.keyHandling = function (clst, e, trgt, navChk, scrollChk) {
        var popObj = this.popObj;
        var rootEle = this.element;
        var popAnimate = { name: 'FadeOut', duration: 100 };
        switch (e.action) {
            case 'moveRight':
                if (this.options.isVertical) {
                    return;
                }
                if (rootEle === trgt) {
                    this.elementFocus(clst);
                }
                else if (!navChk) {
                    this.eleFocus(clst, 'next');
                }
                break;
            case 'moveLeft':
                if (this.options.isVertical) {
                    return;
                }
                if (!navChk) {
                    this.eleFocus(clst, 'previous');
                }
                break;
            case 'home':
            case 'end':
                var ele = void 0;
                var nodes = void 0;
                if (clst) {
                    var popupCheck = sf.base.closest(clst, '.e-popup');
                    if (popupCheck) {
                        if (sf.base.isVisible(this.popObj.element)) {
                            nodes = [].slice.call(popupCheck.children);
                            if (e.action === 'home') {
                                ele = nodes[0];
                            }
                            else {
                                ele = nodes[nodes.length - 1];
                            }
                        }
                    }
                    else {
                        nodes = this.element.querySelectorAll('.' + CLS_ITEMS + ' .' + CLS_ITEM);
                        if (e.action === 'home') {
                            ele = nodes[0];
                        }
                        else {
                            ele = nodes[nodes.length - 1];
                        }
                    }
                    if (ele) {
                        this.elementFocus(ele);
                    }
                }
                break;
            case 'moveUp':
            case 'moveDown':
                var value = e.action === 'moveUp' ? 'previous' : 'next';
                if (!this.options.isVertical) {
                    if (popObj && sf.base.closest(trgt, '.e-popup')) {
                        var popEle = popObj.element;
                        var popFrstEle = popEle.firstElementChild;
                        if ((value === 'previous' && popFrstEle === clst) || (value === 'next' && popEle.lastElementChild === clst)) {
                            return;
                        }
                        else {
                            this.eleFocus(clst, value);
                        }
                    }
                    else if (e.action === 'moveDown' && popObj && sf.base.isVisible(popObj.element)) {
                        this.elementFocus(clst);
                    }
                }
                else {
                    if (e.action === 'moveUp') {
                        this.eleFocus(clst, 'previous');
                    }
                    else {
                        this.eleFocus(clst, 'next');
                    }
                }
                break;
            case 'tab':
                if (!scrollChk && !navChk) {
                    var ele_1 = clst.firstElementChild;
                    if (rootEle === trgt) {
                        if (this.activeEle) {
                            this.activeEle.focus();
                        }
                        else {
                            this.activeEleRemove(ele_1);
                            ele_1.focus();
                        }
                        this.element.removeAttribute('tabindex');
                    }
                }
                break;
            case 'popupClose':
                if (popObj && this.options.overflowMode !== 'Extended') {
                    popObj.hide(popAnimate);
                }
                break;
            case 'popupOpen':
                if (!navChk) {
                    return;
                }
                if (popObj && !sf.base.isVisible(popObj.element)) {
                    popObj.element.style.top = rootEle.offsetHeight + 'px';
                    popObj.show({ name: 'FadeIn', duration: 100 });
                }
                else {
                    popObj.hide(popAnimate);
                }
                break;
        }
    };
    SfToolbar.prototype.keyActionHandler = function (e) {
        var trgt = e.target;
        if (trgt.tagName === 'INPUT' || trgt.tagName === 'TEXTAREA' || this.element.classList.contains(CLS_DISABLE)) {
            return;
        }
        e.preventDefault();
        var clst;
        var tbrNavChk = trgt.classList.contains(CLS_TBARNAV);
        var tbarScrollChk = trgt.classList.contains(CLS_TBARSCRLNAV);
        clst = this.clstElement(tbrNavChk, trgt);
        if (clst || tbarScrollChk) {
            this.keyHandling(clst, e, trgt, tbrNavChk, tbarScrollChk);
        }
    };
    SfToolbar.prototype.eleContains = function (el) {
        // tslint:disable-next-line:max-line-length
        return el.classList.contains(CLS_SEPARATOR) || el.classList.contains(CLS_DISABLE) || el.getAttribute('disabled') || el.classList.contains(CLS_HIDDEN) || !sf.base.isVisible(el);
        // tslint:enable-next-line:max-line-length
    };
    SfToolbar.prototype.eleFocus = function (closest$$1, pos) {
        var sib = Object(closest$$1)[pos + 'ElementSibling'];
        if (sib) {
            var skipEle = this.eleContains(sib);
            if (skipEle) {
                this.eleFocus(sib, pos);
                return;
            }
            this.elementFocus(sib);
        }
        else if (this.tbarAlign) {
            var elem = Object(closest$$1.parentElement)[pos + 'ElementSibling'];
            if (!sf.base.isNullOrUndefined(elem) && elem.children.length === 0) {
                elem = Object(elem)[pos + 'ElementSibling'];
            }
            if (!sf.base.isNullOrUndefined(elem) && elem.children.length > 0) {
                if (pos === 'next') {
                    var el = elem.querySelector('.' + CLS_ITEM);
                    if (this.eleContains(el)) {
                        this.eleFocus(el, pos);
                    }
                    else {
                        el.firstElementChild.focus();
                        this.activeEleSwitch(el);
                    }
                }
                else {
                    var el = elem.lastElementChild;
                    if (this.eleContains(el)) {
                        this.eleFocus(el, pos);
                    }
                    else {
                        this.elementFocus(el);
                    }
                }
            }
        }
    };
    SfToolbar.prototype.clickHandler = function (e) {
        var trgt = e.target;
        var clsList = trgt.classList;
        var ele = this.element;
        var isPopupElement = !sf.base.isNullOrUndefined(sf.base.closest(trgt, '.' + CLS_POPUPCLASS));
        var isCloseIcon = clsList.contains(CLS_ICON_CLOSE);
        var popupNav = sf.base.closest(trgt, ('.' + CLS_TBARNAV));
        var trgParentDataIndex;
        var id;
        if (!popupNav) {
            popupNav = trgt;
        }
        if (!ele.children[0].classList.contains('e-hscroll') && !ele.children[0].classList.contains('e-vscroll')
            && (clsList.contains(CLS_TBARNAV))) {
            clsList = trgt.querySelector('.e-icons').classList;
        }
        if (clsList.contains(CLS_POPUPICON) || clsList.contains(CLS_POPUPDOWN)) {
            this.popupClickHandler(ele, popupNav, CLS_RTL);
        }
        var clst = sf.base.closest(e.target, '.' + CLS_ITEM);
        if ((sf.base.isNullOrUndefined(clst) || clst.classList.contains(CLS_DISABLE)) && !popupNav.classList.contains(CLS_TBARNAV)) {
            return;
        }
        if (!sf.base.isNullOrUndefined(clst)) {
            trgParentDataIndex = parseInt(clst.getAttribute('data-index'), 10);
            id = clst.id;
        }
        this.dotNetRef.invokeMethodAsync('TriggerClickEvent', e, isPopupElement, isCloseIcon, trgParentDataIndex, id);
    };
    SfToolbar.prototype.popupClickHandler = function (ele, popupNav, CLS_RTL) {
        var popObj = this.popObj;
        if (sf.base.isVisible(popObj.element)) {
            popupNav.classList.remove(CLS_TBARNAVACT);
            popObj.hide({ name: 'FadeOut', duration: 100 });
        }
        else {
            if (ele.classList.contains(CLS_RTL) || this.options.isVerticalLeft) {
                if (ele.classList.contains(CLS_RTL)) {
                    popObj.enableRtl = true;
                }
                popObj.position = { X: 'left', Y: 'top' };
            }
            if (popObj.offsetX === 0 && (!ele.classList.contains(CLS_RTL) && !this.options.isVerticalLeft)) {
                popObj.enableRtl = false;
                popObj.position = { X: 'right', Y: 'top' };
            }
            popObj.dataBind();
            popObj.refreshPosition();
            popObj.element.style.top = this.getElementOffsetY() + 'px';
            if (this.options.overflowMode === 'Extended') {
                popObj.element.style.minHeight = '0px';
            }
            popupNav.classList.add(CLS_TBARNAVACT);
            popObj.show({ name: 'FadeIn', duration: 100 });
        }
    };
    SfToolbar.prototype.render = function () {
        this.scrollModule = null;
        this.popObj = null;
        this.isExtendedOpen = false;
        this.popupPriCount = 0;
        var width = sf.base.formatUnit(this.options.width);
        var height = sf.base.formatUnit(this.options.height);
        if (this.element) {
            if (sf.base.Browser.info.name !== 'msie' || this.options.height !== 'auto') {
                sf.base.setStyleAttribute(this.element, { 'height': height });
            }
            sf.base.setStyleAttribute(this.element, { 'width': width });
            this.element.setAttribute('aria-haspopup', 'false');
            this.renderControl();
            this.wireEvents();
        }
    };
    SfToolbar.prototype.renderControl = function () {
        this.tbarAlgEle = { lefts: [], centers: [], rights: [] };
        this.renderItems();
        this.renderLayout();
    };
    SfToolbar.prototype.renderLayout = function () {
        this.renderOverflowMode();
        if (this.tbarAlign) {
            this.itemPositioning();
        }
        if (this.popObj && this.popObj.element.childElementCount > 1 && this.checkPopupRefresh(this.element, this.popObj.element)) {
            this.popupRefresh(this.popObj.element, false);
        }
        this.separator();
    };
    SfToolbar.prototype.itemsAlign = function (items, itemEleDom) {
        var innerItem;
        var innerPos;
        if (!this.tbarEle) {
            this.tbarEle = [];
        }
        for (var i = 0; i < items.length; i++) {
            var itemEleBlaDom = this.element.querySelector('.' + BZ_ITEMS);
            innerItem = itemEleBlaDom.querySelector('.' + CLS_ITEM + '[id="' + items[i].id + '"]');
            if (!innerItem) {
                continue;
            }
            if (items[i].overflow !== 'Show' && items[i].showAlwaysInPopup && !innerItem.classList.contains(CLS_SEPARATOR)) {
                this.popupPriCount++;
            }
            if (items[i].htmlAttributes) {
                this.setAttr(items[i].htmlAttributes, innerItem);
            }
            if (items[i].type === 'Button') {
                sf.base.EventHandler.clearEvents(innerItem);
                sf.base.EventHandler.add(innerItem, 'click', this.itemClick, this);
            }
            if (this.tbarEle.indexOf(innerItem) === -1) {
                this.tbarEle.push(innerItem);
            }
            if (!this.tbarAlign) {
                this.tbarItemAlign(items[i], itemEleDom, i);
            }
            innerPos = itemEleDom.querySelector('.e-toolbar-' + items[i].align.toLowerCase());
            if (innerPos) {
                if (!(items[i].showAlwaysInPopup && items[i].overflow !== 'Show')) {
                    this.tbarAlgEle[(items[i].align + 's').toLowerCase()].push(innerItem);
                }
                innerPos.appendChild(innerItem);
            }
            else {
                itemEleDom.appendChild(innerItem);
            }
        }
    };
    SfToolbar.prototype.serverItemsRefresh = function () {
        var ele = this.element;
        var wrapBlaEleDom = ele.querySelector('.' + BZ_ITEMS);
        if (wrapBlaEleDom.children.length > 0) {
            var itemEleDom = ele.querySelector('.' + CLS_ITEMS);
            if (!itemEleDom && ele && ele.classList.contains(CLS_TOOLBAR) && ele.firstElementChild) {
                itemEleDom = sf.base.createElement('div', { className: CLS_ITEMS });
                ele.insertBefore(itemEleDom, ele.firstElementChild);
            }
            this.itemsAlign(this.options.items, itemEleDom);
            this.renderLayout();
            this.refreshOverflow();
        }
    };
    SfToolbar.prototype.resetServerItems = function () {
        var wrapBlaEleDom = this.element.querySelector('.' + BZ_ITEMS);
        var itemEles = [].slice.call(sf.base.selectAll('.' + CLS_ITEMS + ' .' + CLS_ITEM, this.element));
        sf.base.append(itemEles, wrapBlaEleDom);
        this.clearProperty();
    };
    SfToolbar.prototype.changeOrientation = function () {
        if (!this.options.isVertical) {
            this.element.classList.remove(CLS_VERTICAL);
            this.element.setAttribute('aria-orientation', 'horizontal');
            if (this.options.height === 'auto' || this.options.height === '100%') {
                this.element.style.height = this.options.height;
            }
        }
        else {
            this.element.classList.add(CLS_VERTICAL);
            this.element.setAttribute('aria-orientation', 'vertical');
            sf.base.setStyleAttribute(this.element, { 'height': sf.base.formatUnit(this.options.height), 'width': sf.base.formatUnit(this.options.width) });
        }
        this.destroyMode();
        this.refreshOverflow();
    };
    SfToolbar.prototype.initScroll = function (element, innerItems) {
        if (!this.scrollModule && this.checkOverflow(element, innerItems[0])) {
            if (this.tbarAlign) {
                this.element.querySelector('.' + CLS_ITEMS + ' .' + CLS_TBARCENTER).removeAttribute('style');
            }
            if (this.options.isVertical) {
                this.scrollModule = new sf.navigations.VScroll({ scrollStep: this.options.scrollStep, enableRtl: this.options.enableRtl }, innerItems[0]);
            }
            else {
                this.scrollModule = new sf.navigations.HScroll({ scrollStep: this.options.scrollStep, enableRtl: this.options.enableRtl }, innerItems[0]);
            }
            sf.base.removeClass([this.scrollModule.element], CLS_TBARPOS);
            sf.base.setStyleAttribute(this.element, { overflow: 'hidden' });
        }
    };
    SfToolbar.prototype.itemWidthCal = function (items) {
        var _this = this;
        var width = 0;
        var style;
        [].slice.call(sf.base.selectAll('.' + CLS_ITEM, items)).forEach(function (el) {
            if (sf.base.isVisible(el)) {
                style = window.getComputedStyle(el);
                width += _this.options.isVertical ? el.offsetHeight : el.offsetWidth;
                width += parseFloat(_this.options.isVertical ? style.marginTop : style.marginRight);
                width += parseFloat(_this.options.isVertical ? style.marginBottom : style.marginLeft);
            }
        });
        return width;
    };
    SfToolbar.prototype.getScrollCntEle = function (innerItem) {
        var trgClass = (this.options.isVertical) ? '.e-vscroll-content' : '.e-hscroll-content';
        return innerItem.querySelector(trgClass);
    };
    SfToolbar.prototype.checkOverflow = function (element, innerItem) {
        if (sf.base.isNullOrUndefined(element) || sf.base.isNullOrUndefined(innerItem) || !sf.base.isVisible(element)) {
            return false;
        }
        var eleWidth = this.options.isVertical ? element.offsetHeight : element.offsetWidth;
        var itemWidth = this.options.isVertical ? innerItem.offsetHeight : innerItem.offsetWidth;
        if (this.tbarAlign || this.scrollModule || (eleWidth === itemWidth)) {
            itemWidth = this.itemWidthCal(this.scrollModule ? this.getScrollCntEle(innerItem) : innerItem);
        }
        var popNav = element.querySelector('.' + CLS_TBARNAV);
        var scrollNav = element.querySelector('.' + CLS_TBARSCRLNAV);
        var navEleWidth = 0;
        if (popNav) {
            navEleWidth = this.options.isVertical ? popNav.offsetHeight : popNav.offsetWidth;
        }
        else if (scrollNav) {
            navEleWidth = this.options.isVertical ? (scrollNav.offsetHeight * (2)) : (scrollNav.offsetWidth * 2);
        }
        if (itemWidth > eleWidth - navEleWidth) {
            return true;
        }
        else {
            return false;
        }
    };
    SfToolbar.prototype.refreshOverflow = function () {
        this.resize();
    };
    SfToolbar.prototype.toolbarAlign = function (innerItems) {
        if (this.tbarAlign) {
            sf.base.addClass([innerItems], CLS_TBARPOS);
            this.itemPositioning();
        }
    };
    SfToolbar.prototype.renderOverflowMode = function () {
        var ele = this.element;
        var innerItems = ele.querySelector('.' + CLS_ITEMS);
        var priorityCheck = this.popupPriCount > 0;
        if (ele && ele.children.length > 0) {
            this.offsetWid = ele.offsetWidth;
            sf.base.removeClass([this.element], 'e-toolpop');
            if (sf.base.Browser.info.name === 'msie' && this.options.height === 'auto') {
                ele.style.height = '';
            }
            switch (this.options.overflowMode) {
                case 'Scrollable':
                    if (sf.base.isNullOrUndefined(this.scrollModule)) {
                        this.initScroll(ele, [].slice.call(ele.getElementsByClassName(CLS_ITEMS)));
                    }
                    break;
                case 'Popup':
                    sf.base.addClass([this.element], 'e-toolpop');
                    if (this.tbarAlign) {
                        this.removePositioning();
                    }
                    if (this.checkOverflow(ele, innerItems) || priorityCheck) {
                        this.setOverflowAttributes(ele);
                    }
                    this.toolbarAlign(innerItems);
                    break;
                case 'MultiRow':
                    sf.base.addClass([innerItems], CLS_MULTIROW);
                    if (this.checkOverflow(ele, innerItems) && this.tbarAlign) {
                        this.removePositioning();
                        sf.base.addClass([innerItems], CLS_MULTIROWPOS);
                    }
                    if (ele.style.overflow === 'hidden') {
                        ele.style.overflow = '';
                    }
                    if (sf.base.Browser.info.name === 'msie' || ele.style.height !== 'auto') {
                        ele.style.height = 'auto';
                    }
                    break;
                case 'Extended':
                    sf.base.addClass([this.element], CLS_EXTEANDABLE_TOOLBAR);
                    if (this.checkOverflow(ele, innerItems) || priorityCheck) {
                        if (this.tbarAlign) {
                            this.removePositioning();
                        }
                        this.setOverflowAttributes(ele);
                    }
                    this.toolbarAlign(innerItems);
            }
        }
    };
    SfToolbar.prototype.setOverflowAttributes = function (ele) {
        this.createPopupEle(ele, [].slice.call(sf.base.selectAll('.' + CLS_ITEMS + ' .' + CLS_ITEM, ele)));
        this.element.querySelector('.' + CLS_TBARNAV).setAttribute('tabIndex', '0');
        this.element.querySelector('.' + CLS_TBARNAV).setAttribute('role', 'list');
    };
    SfToolbar.prototype.separator = function () {
        var element = this.element;
        var eleItem = [].slice.call(element.querySelectorAll('.' + CLS_SEPARATOR));
        var eleInlineItem;
        var multiVar = element.querySelector('.' + CLS_MULTIROW_SEPARATOR);
        var extendVar = element.querySelector('.' + CLS_EXTENDABLE_SEPARATOR);
        eleInlineItem = this.options.overflowMode === 'MultiRow' ? multiVar : extendVar;
        if (eleInlineItem !== null) {
            if (this.options.overflowMode === 'MultiRow') {
                eleInlineItem.classList.remove(CLS_MULTIROW_SEPARATOR);
            }
            else if (this.options.overflowMode === 'Extended') {
                eleInlineItem.classList.remove(CLS_EXTENDABLE_SEPARATOR);
            }
        }
        for (var i = 0; i <= eleItem.length - 1; i++) {
            if (eleItem[i].offsetLeft < 30 && eleItem[i].offsetLeft !== 0) {
                if (this.options.overflowMode === 'MultiRow') {
                    eleItem[i].classList.add(CLS_MULTIROW_SEPARATOR);
                }
                else if (this.options.overflowMode === 'Extended') {
                    eleItem[i].classList.add(CLS_EXTENDABLE_SEPARATOR);
                }
            }
        }
    };
    SfToolbar.prototype.createPopupEle = function (ele, innerEle) {
        var innerNav = ele.querySelector('.' + CLS_TBARNAV);
        var vertical = this.options.isVertical;
        if (!innerNav) {
            this.createPopupIcon(ele);
        }
        innerNav = ele.querySelector('.' + CLS_TBARNAV);
        var innerNavDom = (vertical ? innerNav.offsetHeight : innerNav.offsetWidth);
        var eleWidth = ((vertical ? ele.offsetHeight : ele.offsetWidth) - (innerNavDom));
        this.element.classList.remove('e-rtl');
        sf.base.setStyleAttribute(this.element, { direction: 'initial' });
        this.checkPriority(ele, innerEle, eleWidth, true);
        if (this.options.enableRtl) {
            this.element.classList.add('e-rtl');
        }
        this.element.style.removeProperty('direction');
        this.createPopup();
    };
    SfToolbar.prototype.pushingPoppedEle = function (tbarObj, popupPri, ele, eleHeight, sepHeight) {
        var element = this.element;
        var nodes = sf.base.selectAll('.' + CLS_TBAROVERFLOW, ele);
        var nodeIndex = 0;
        var poppedEle = [].slice.call(sf.base.selectAll('.' + CLS_POPUP, element.querySelector('.' + CLS_ITEMS)));
        var nodePri = 0;
        poppedEle.forEach(function (el, index) {
            nodes = sf.base.selectAll('.' + CLS_TBAROVERFLOW, ele);
            if (el.classList.contains(CLS_TBAROVERFLOW) && nodes.length > 0) {
                if (tbarObj.tbResize && nodes.length > index) {
                    ele.insertBefore(el, nodes[index]);
                    ++nodePri;
                }
                else {
                    ele.insertBefore(el, ele.children[nodes.length]);
                    ++nodePri;
                }
            }
            else if (el.classList.contains(CLS_TBAROVERFLOW)) {
                ele.insertBefore(el, ele.firstChild);
                ++nodePri;
            }
            else if (tbarObj.tbResize && el.classList.contains(CLS_POPOVERFLOW) && ele.children.length > 0 && nodes.length === 0) {
                ele.insertBefore(el, ele.firstChild);
                ++nodePri;
            }
            else if (el.classList.contains(CLS_POPOVERFLOW)) {
                popupPri.push(el);
            }
            else if (tbarObj.tbResize) {
                ele.insertBefore(el, ele.childNodes[nodeIndex + nodePri]);
                ++nodeIndex;
            }
            else {
                ele.appendChild(el);
            }
            if (el.classList.contains(CLS_SEPARATOR)) {
                sf.base.setStyleAttribute(el, { display: '', height: sepHeight + 'px' });
            }
            else {
                sf.base.setStyleAttribute(el, { display: '', height: eleHeight + 'px' });
            }
        });
        popupPri.forEach(function (el) {
            ele.appendChild(el);
        });
        var tbarEle = sf.base.selectAll('.' + CLS_ITEM, element.querySelector('.' + CLS_ITEMS));
        for (var i = tbarEle.length - 1; i >= 0; i--) {
            var tbarElement = tbarEle[i];
            if (tbarElement.classList.contains(CLS_SEPARATOR) && this.options.overflowMode !== 'Extended') {
                sf.base.setStyleAttribute(tbarElement, { display: 'none' });
            }
            else {
                break;
            }
        }
    };
    SfToolbar.prototype.createPopup = function () {
        var element = this.element;
        var eleHeight;
        var eleItem;
        var sepHeight;
        var sepItem;
        if (this.options.overflowMode === 'Extended') {
            sepItem = element.querySelector('.' + CLS_SEPARATOR + ':not(.' + CLS_POPUP + ')');
            sepHeight = (element.style.height === 'auto' || element.style.height === '') ? null : (sepItem && sepItem.offsetHeight);
        }
        eleItem = element.querySelector('.' + CLS_ITEM + ':not(.' + CLS_SEPARATOR + '):not(.' + CLS_POPUP + ')');
        eleHeight = (element.style.height === 'auto' || element.style.height === '') ? null : (eleItem && eleItem.offsetHeight);
        var ele;
        var popupPri = [];
        if (element.querySelector('#' + element.id + '_popup.' + CLS_POPUPCLASS)) {
            ele = element.querySelector('#' + element.id + '_popup.' + CLS_POPUPCLASS);
        }
        else {
            var extendEle = sf.base.createElement('div', {
                id: element.id + '_popup', className: CLS_POPUPCLASS + ' ' + CLS_EXTENDABLECLASS
            });
            var popupEle = sf.base.createElement('div', { id: element.id + '_popup', className: CLS_POPUPCLASS });
            ele = this.options.overflowMode === 'Extended' ? extendEle : popupEle;
        }
        this.pushingPoppedEle(this, popupPri, ele, eleHeight, sepHeight);
        this.popupInit(element, ele);
    };
    SfToolbar.prototype.getElementOffsetY = function () {
        return (this.options.overflowMode === 'Extended' && window.getComputedStyle(this.element).getPropertyValue('box-sizing') === 'border-box' ?
            this.element.clientHeight : this.element.offsetHeight);
    };
    SfToolbar.prototype.popupInit = function (element, ele) {
        if (!this.popObj) {
            element.appendChild(ele);
            sf.base.setStyleAttribute(this.element, { overflow: '' });
            var eleStyles = window.getComputedStyle(this.element);
            var popup = new sf.popups.Popup(null, {
                relateTo: this.element,
                offsetY: (this.options.isVertical) ? 0 : this.getElementOffsetY(),
                enableRtl: this.options.enableRtl,
                open: this.popupOpen.bind(this),
                close: this.popupClose.bind(this),
                collision: { Y: this.options.enableCollision ? 'flip' : 'none' },
                position: this.options.enableRtl ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }
            });
            popup.appendTo(ele);
            if (this.options.overflowMode === 'Extended') {
                popup.width = parseFloat(eleStyles.width) + ((parseFloat(eleStyles.borderRightWidth)) * 2);
                popup.offsetX = 0;
            }
            sf.base.EventHandler.add(document, 'scroll', this.docEvent.bind(this));
            sf.base.EventHandler.add(document, 'click ', this.docEvent.bind(this));
            popup.element.style.maxHeight = popup.element.offsetHeight + 'px';
            if (this.options.isVertical) {
                popup.element.style.visibility = 'hidden';
            }
            if (this.isExtendedOpen) {
                var popupNav = this.element.querySelector('.' + CLS_TBARNAV);
                popupNav.classList.add(CLS_TBARNAVACT);
                sf.base.classList(popupNav.firstElementChild, [CLS_POPUPICON], [CLS_POPUPDOWN]);
                this.element.querySelector('.' + CLS_EXTENDABLECLASS).classList.add(CLS_POPUPOPEN);
            }
            else {
                popup.hide();
            }
            this.popObj = popup;
            this.element.setAttribute('aria-haspopup', 'true');
        }
        else {
            var popupEle = this.popObj.element;
            sf.base.setStyleAttribute(popupEle, { maxHeight: '', display: 'block' });
            sf.base.setStyleAttribute(popupEle, { maxHeight: popupEle.offsetHeight + 'px', display: '' });
        }
    };
    SfToolbar.prototype.tbarPopupHandler = function (isOpen) {
        if (this.options.overflowMode === 'Extended') {
            isOpen ? sf.base.addClass([this.element], CLS_EXTENDEDPOPOPEN) : sf.base.removeClass([this.element], CLS_EXTENDEDPOPOPEN);
        }
    };
    SfToolbar.prototype.popupOpen = function (e) {
        var popObj = this.popObj;
        if (!this.options.isVertical) {
            popObj.offsetY = this.getElementOffsetY();
            popObj.dataBind();
        }
        var popupEle = this.popObj.element;
        var toolEle = this.popObj.element.parentElement;
        var popupNav = toolEle.querySelector('.' + CLS_TBARNAV);
        sf.base.setStyleAttribute(popObj.element, { height: 'auto', maxHeight: '' });
        popObj.element.style.maxHeight = popObj.element.offsetHeight + 'px';
        if (this.options.overflowMode === 'Extended') {
            popObj.element.style.minHeight = '';
        }
        var popupElePos = popupEle.offsetTop + popupEle.offsetHeight + sf.popups.calculatePosition(toolEle).top;
        var popIcon = popupNav.firstElementChild;
        popupNav.classList.add(CLS_TBARNAVACT);
        sf.base.classList(popIcon, [CLS_POPUPICON], [CLS_POPUPDOWN]);
        this.tbarPopupHandler(true);
        var scrollVal = sf.base.isNullOrUndefined(window.scrollY) ? 0 : window.scrollY;
        if (!this.options.isVertical && ((window.innerHeight + scrollVal) < popupElePos) && (this.element.offsetTop < popupEle.offsetHeight)) {
            var overflowHeight = (popupEle.offsetHeight - ((popupElePos - window.innerHeight - scrollVal) + 5));
            popObj.height = overflowHeight + 'px';
            for (var i = 0; i <= popupEle.childElementCount; i++) {
                var ele = popupEle.children[i];
                if (ele.offsetTop + ele.offsetHeight > overflowHeight) {
                    overflowHeight = ele.offsetTop;
                    break;
                }
            }
            sf.base.setStyleAttribute(popObj.element, { maxHeight: overflowHeight + 'px' });
        }
        else if (this.options.isVertical) {
            var tbEleData = this.element.getBoundingClientRect();
            sf.base.setStyleAttribute(popObj.element, { maxHeight: (tbEleData.top + this.element.offsetHeight) + 'px', bottom: 0, visibility: '' });
        }
        if (popObj) {
            popObj.refreshPosition();
        }
    };
    SfToolbar.prototype.popupClose = function (e) {
        var element = this.element;
        var popupNav = element.querySelector('.' + CLS_TBARNAV);
        var popIcon = popupNav.firstElementChild;
        popupNav.classList.remove(CLS_TBARNAVACT);
        sf.base.classList(popIcon, [CLS_POPUPDOWN], [CLS_POPUPICON]);
        this.tbarPopupHandler(false);
    };
    SfToolbar.prototype.checkPriority = function (ele, inEle, eleWidth, pre) {
        var popPriority = this.popupPriCount > 0;
        var len = inEle.length;
        var eleWid = eleWidth;
        var eleOffset;
        var checkoffset;
        var sepCheck = 0;
        var itemCount = 0;
        var itemPopCount = 0;
        var checkClass = function (ele, val) {
            var rVal = false;
            val.forEach(function (cls) {
                if (ele.classList.contains(cls)) {
                    rVal = true;
                }
            });
            return rVal;
        };
        for (var i = len - 1; i >= 0; i--) {
            var mrgn = void 0;
            var compuStyle = window.getComputedStyle(inEle[i]);
            if (this.options.isVertical) {
                mrgn = parseFloat((compuStyle).marginTop);
                mrgn += parseFloat((compuStyle).marginBottom);
            }
            else {
                mrgn = parseFloat((compuStyle).marginRight);
                mrgn += parseFloat((compuStyle).marginLeft);
            }
            var fstEleCheck = inEle[i] === this.tbarEle[0];
            if (fstEleCheck) {
                this.tbarEleMrgn = mrgn;
            }
            eleOffset = this.options.isVertical ? inEle[i].offsetHeight : inEle[i].offsetWidth;
            var eleWid_1 = fstEleCheck ? (eleOffset + mrgn) : eleOffset;
            if (checkClass(inEle[i], [CLS_POPPRI]) && popPriority) {
                inEle[i].classList.add(CLS_POPUP);
                if (this.options.isVertical) {
                    sf.base.setStyleAttribute(inEle[i], { display: 'none', minHeight: eleWid_1 + 'px' });
                }
                else {
                    sf.base.setStyleAttribute(inEle[i], { display: 'none', minWidth: eleWid_1 + 'px' });
                }
                itemPopCount++;
            }
            if (this.options.isVertical) {
                checkoffset = (inEle[i].offsetTop + inEle[i].offsetHeight + mrgn) > eleWidth;
            }
            else {
                checkoffset = (inEle[i].offsetLeft + inEle[i].offsetWidth + mrgn) > eleWidth;
            }
            if (checkoffset) {
                if (inEle[i].classList.contains(CLS_SEPARATOR)) {
                    if (this.options.overflowMode === 'Extended') {
                        if (itemCount === itemPopCount) {
                            var sepEle = inEle[i];
                            if (checkClass(sepEle, [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                                inEle[i].classList.add(CLS_POPUP);
                                itemPopCount++;
                            }
                        }
                        itemCount++;
                    }
                    else if (this.options.overflowMode === 'Popup') {
                        if (sepCheck > 0 && itemCount === itemPopCount) {
                            var sepEle = inEle[i + itemCount + (sepCheck - 1)];
                            if (checkClass(sepEle, [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                                sf.base.setStyleAttribute(sepEle, { display: 'none' });
                            }
                        }
                        sepCheck++;
                        itemCount = 0;
                        itemPopCount = 0;
                    }
                }
                else {
                    itemCount++;
                }
                if (inEle[i].classList.contains(CLS_TBAROVERFLOW) && pre) {
                    eleWidth -= ((this.options.isVertical ? inEle[i].offsetHeight : inEle[i].offsetWidth) + (mrgn));
                }
                else if (!checkClass(inEle[i], [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                    inEle[i].classList.add(CLS_POPUP);
                    if (this.options.isVertical) {
                        sf.base.setStyleAttribute(inEle[i], { display: 'none', minHeight: eleWid_1 + 'px' });
                    }
                    else {
                        sf.base.setStyleAttribute(inEle[i], { display: 'none', minWidth: eleWid_1 + 'px' });
                    }
                    itemPopCount++;
                }
                else {
                    eleWidth -= ((this.options.isVertical ? inEle[i].offsetHeight : inEle[i].offsetWidth) + (mrgn));
                }
            }
        }
        if (pre) {
            var popedEle = sf.base.selectAll('.' + CLS_ITEM + ':not(.' + CLS_POPUP + ')', this.element);
            this.checkPriority(ele, popedEle, eleWid, false);
        }
    };
    SfToolbar.prototype.createPopupIcon = function (element) {
        var id = element.id.concat('_nav');
        var className = 'e-' + element.id.concat('_nav ' + CLS_POPUPNAV);
        className = this.options.overflowMode === 'Extended' ? className + ' ' + CLS_EXTENDPOPUP : className;
        var nav = sf.base.createElement('div', { id: id, className: className });
        if (sf.base.Browser.info.name === 'msie' || sf.base.Browser.info.name === 'edge') {
            nav.classList.add('e-ie-align');
        }
        var navItem = sf.base.createElement('div', { className: CLS_POPUPDOWN + ' e-icons' });
        nav.appendChild(navItem);
        nav.setAttribute('tabindex', '0');
        nav.setAttribute('role', 'list');
        element.appendChild(nav);
    };
    SfToolbar.prototype.tbarPriRef = function (inEle, indx, sepPri, el, des, elWid, wid, ig) {
        var ignoreCount = ig;
        var popEle = this.popObj.element;
        var query = '.' + CLS_ITEM + ':not(.' + CLS_SEPARATOR + '):not(.' + CLS_TBAROVERFLOW + ')';
        var priEleCnt = sf.base.selectAll('.' + CLS_POPUP + ':not(.' + CLS_TBAROVERFLOW + ')', popEle).length;
        var checkClass = function (ele, val) {
            return ele.classList.contains(val);
        };
        if (sf.base.selectAll(query, inEle).length === 0) {
            var eleSep = inEle.children[indx - (indx - sepPri) - 1];
            var ignoreCheck = (!sf.base.isNullOrUndefined(eleSep) && checkClass(eleSep, CLS_TBARIGNORE));
            if ((!sf.base.isNullOrUndefined(eleSep) && checkClass(eleSep, CLS_SEPARATOR) && !sf.base.isVisible(eleSep)) || ignoreCheck) {
                var sepDisplay = 'none';
                eleSep.style.display = 'inherit';
                var eleSepWidth = eleSep.offsetWidth + (parseFloat(window.getComputedStyle(eleSep).marginRight) * 2);
                var prevSep = eleSep.previousElementSibling;
                if ((elWid + eleSepWidth) < wid || des) {
                    inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - (indx - sepPri)]);
                    if (!sf.base.isNullOrUndefined(prevSep)) {
                        prevSep.style.display = '';
                    }
                }
                else {
                    if (prevSep.classList.contains(CLS_SEPARATOR)) {
                        prevSep.style.display = sepDisplay;
                    }
                }
                eleSep.style.display = '';
            }
            else {
                inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - (indx - sepPri)]);
            }
        }
        else {
            inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - priEleCnt]);
        }
    };
    SfToolbar.prototype.popupRefresh = function (popupEle, destroy) {
        var _this = this;
        var ele = this.element;
        var isVer = this.options.isVertical;
        var popNav = ele.querySelector('.' + CLS_TBARNAV);
        var innerEle = ele.querySelector('.' + CLS_ITEMS);
        if (sf.base.isNullOrUndefined(popNav)) {
            return;
        }
        innerEle.removeAttribute('style');
        popupEle.style.display = 'block';
        var dimension;
        if (isVer) {
            dimension = ele.offsetHeight - (popNav.offsetHeight + innerEle.offsetHeight);
        }
        else {
            dimension = ele.offsetWidth - (popNav.offsetWidth + innerEle.offsetWidth);
        }
        var popupEleWidth = 0;
        [].slice.call(popupEle.children).forEach(function (el) {
            popupEleWidth += _this.popupEleWidth(el);
            sf.base.setStyleAttribute(el, { 'position': '' });
        });
        if ((dimension + (isVer ? popNav.offsetHeight : popNav.offsetWidth)) > (popupEleWidth) && this.popupPriCount === 0) {
            destroy = true;
        }
        this.popupEleRefresh(dimension, popupEle, destroy);
        popupEle.style.display = '';
        if (popupEle.children.length === 0 && popNav && this.popObj) {
            sf.base.detach(popNav);
            popNav = null;
            this.popObj.destroy();
            sf.base.detach(this.popObj.element);
            this.popObj = null;
            ele.setAttribute('aria-haspopup', 'false');
        }
    };
    SfToolbar.prototype.ignoreEleFetch = function (index, innerEle) {
        var ignoreEle = [].slice.call(innerEle.querySelectorAll('.' + CLS_TBARIGNORE));
        var ignoreInx = [];
        var count = 0;
        if (ignoreEle.length > 0) {
            ignoreEle.forEach(function (ele) {
                ignoreInx.push([].slice.call(innerEle.children).indexOf(ele));
            });
        }
        else {
            return 0;
        }
        ignoreInx.forEach(function (val) {
            if (val <= index) {
                count++;
            }
        });
        return count;
    };
    SfToolbar.prototype.checkPopupRefresh = function (root, popEle) {
        popEle.style.display = 'block';
        var elWid = this.popupEleWidth(popEle.firstElementChild);
        popEle.firstElementChild.style.removeProperty('Position');
        var tbarWidth = root.offsetWidth - root.querySelector('.' + CLS_TBARNAV).offsetWidth;
        var tbarItemsWid = root.querySelector('.' + CLS_ITEMS).offsetWidth;
        popEle.style.removeProperty('display');
        if (tbarWidth > (elWid + tbarItemsWid)) {
            return true;
        }
        return false;
    };
    SfToolbar.prototype.popupEleWidth = function (el) {
        el.style.position = 'absolute';
        var elWidth = this.options.isVertical ? el.offsetHeight : el.offsetWidth;
        var btnText = el.querySelector('.' + CLS_TBARBTNTEXT);
        if (el.classList.contains('e-tbtn-align') || el.classList.contains(CLS_TBARTEXT)) {
            var btn = el.children[0];
            if (!sf.base.isNullOrUndefined(btnText) && el.classList.contains(CLS_TBARTEXT)) {
                btnText.style.display = 'none';
            }
            else if (!sf.base.isNullOrUndefined(btnText) && el.classList.contains(CLS_POPUPTEXT)) {
                btnText.style.display = 'block';
            }
            btn.style.minWidth = '0%';
            elWidth = parseFloat(!this.options.isVertical ? el.style.minWidth : el.style.minHeight);
            btn.style.minWidth = '';
            btn.style.minHeight = '';
            if (!sf.base.isNullOrUndefined(btnText)) {
                btnText.style.display = '';
            }
        }
        return elWidth;
    };
    SfToolbar.prototype.popupEleRefresh = function (width, popupEle, destroy) {
        var popPriority = this.popupPriCount > 0;
        var eleSplice = this.tbarEle;
        var priEleCnt;
        var index;
        var checkOverflow;
        var innerEle = this.element.querySelector('.' + CLS_ITEMS);
        var ignoreCount = 0;
        var _loop_1 = function (el) {
            if (el.classList.contains(CLS_POPPRI) && popPriority && !destroy) {
                return "continue";
            }
            var elWidth = this_1.popupEleWidth(el);
            if (el === this_1.tbarEle[0]) {
                elWidth += this_1.tbarEleMrgn;
            }
            el.style.position = '';
            if (elWidth < width || destroy) {
                sf.base.setStyleAttribute(el, { minWidth: '', height: '', minHeight: '' });
                if (!el.classList.contains(CLS_POPOVERFLOW)) {
                    el.classList.remove(CLS_POPUP);
                }
                index = this_1.tbarEle.indexOf(el);
                if (this_1.tbarAlign) {
                    var pos = this_1.options.items[index].align;
                    index = this_1.tbarAlgEle[(pos + 's').toLowerCase()].indexOf(el);
                    eleSplice = this_1.tbarAlgEle[(pos + 's').toLowerCase()];
                    innerEle = this_1.element.querySelector('.' + CLS_ITEMS + ' .' + 'e-toolbar-' + pos.toLowerCase());
                }
                var sepBeforePri_1 = 0;
                if (this_1.options.overflowMode !== 'Extended') {
                    eleSplice.slice(0, index).forEach(function (el) {
                        if (el.classList.contains(CLS_TBAROVERFLOW) || el.classList.contains(CLS_SEPARATOR)) {
                            if (el.classList.contains(CLS_SEPARATOR)) {
                                el.style.display = '';
                                width -= el.offsetWidth;
                            }
                            sepBeforePri_1++;
                        }
                    });
                }
                ignoreCount = this_1.ignoreEleFetch(index, innerEle);
                if (el.classList.contains(CLS_TBAROVERFLOW)) {
                    this_1.tbarPriRef(innerEle, index, sepBeforePri_1, el, destroy, elWidth, width, ignoreCount);
                    width -= el.offsetWidth;
                }
                else if (index === 0) {
                    innerEle.insertBefore(el, innerEle.firstChild);
                    width -= el.offsetWidth;
                }
                else {
                    priEleCnt = sf.base.selectAll('.' + CLS_TBAROVERFLOW, this_1.popObj.element).length;
                    innerEle.insertBefore(el, innerEle.children[(index + ignoreCount) - priEleCnt]);
                    width -= el.offsetWidth;
                }
                el.style.height = '';
            }
            else {
                return "break";
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = [].slice.call(popupEle.children); _i < _a.length; _i++) {
            var el = _a[_i];
            var state_1 = _loop_1(el);
            if (state_1 === "break")
                break;
        }
        checkOverflow = this.checkOverflow(this.element, this.element.getElementsByClassName(CLS_ITEMS)[0]);
        if (checkOverflow && !destroy) {
            this.renderOverflowMode();
        }
    };
    SfToolbar.prototype.removePositioning = function () {
        var item = this.element.querySelector('.' + CLS_ITEMS);
        if (sf.base.isNullOrUndefined(item) || !item.classList.contains(CLS_TBARPOS)) {
            return;
        }
        sf.base.removeClass([item], CLS_TBARPOS);
        var innerItem = [].slice.call(item.childNodes);
        innerItem[1].removeAttribute('style');
        innerItem[2].removeAttribute('style');
    };
    SfToolbar.prototype.refreshPositioning = function () {
        var item = this.element.querySelector('.' + CLS_ITEMS);
        sf.base.addClass([item], CLS_TBARPOS);
        this.itemPositioning();
    };
    SfToolbar.prototype.itemPositioning = function () {
        var item = this.element.querySelector('.' + CLS_ITEMS);
        var margin;
        if (sf.base.isNullOrUndefined(item) || !item.classList.contains(CLS_TBARPOS)) {
            return;
        }
        var popupNav = this.element.querySelector('.' + CLS_TBARNAV);
        var innerItem;
        if (this.scrollModule) {
            var trgClass = (this.options.isVertical) ? CLS_VSCROLLCNT : CLS_HSCROLLCNT;
            innerItem = [].slice.call(item.querySelector('.' + trgClass).children);
        }
        else {
            innerItem = [].slice.call(item.childNodes);
        }
        if (this.options.isVertical) {
            margin = innerItem[0].offsetHeight + innerItem[2].offsetHeight;
        }
        else {
            margin = innerItem[0].offsetWidth + innerItem[2].offsetWidth;
        }
        var tbarWid = this.options.isVertical ? this.element.offsetHeight : this.element.offsetWidth;
        if (popupNav) {
            tbarWid -= (this.options.isVertical ? popupNav.offsetHeight : popupNav.offsetWidth);
            var popWid = (this.options.isVertical ? popupNav.offsetHeight : popupNav.offsetWidth) + 'px';
            innerItem[2].removeAttribute('style');
            if (this.options.isVertical) {
                this.options.enableRtl ? innerItem[2].style.top = popWid : innerItem[2].style.bottom = popWid;
            }
            else {
                this.options.enableRtl ? innerItem[2].style.left = popWid : innerItem[2].style.right = popWid;
            }
        }
        if (tbarWid <= margin) {
            return;
        }
        var value = (((tbarWid - margin)) - (!this.options.isVertical ? innerItem[1].offsetWidth : innerItem[1].offsetHeight)) / 2;
        innerItem[1].removeAttribute('style');
        var mrgn = ((!this.options.isVertical ? innerItem[0].offsetWidth : innerItem[0].offsetHeight) + value) + 'px';
        if (this.options.isVertical) {
            this.options.enableRtl ? innerItem[1].style.marginBottom = mrgn : innerItem[1].style.marginTop = mrgn;
        }
        else {
            this.options.enableRtl ? innerItem[1].style.marginRight = mrgn : innerItem[1].style.marginLeft = mrgn;
        }
    };
    SfToolbar.prototype.tbarItemAlign = function (item, itemEle, pos) {
        var _this = this;
        if (item.showAlwaysInPopup && item.overflow !== 'Show') {
            return;
        }
        var alignDiv = [];
        alignDiv.push(sf.base.createElement('div', { className: CLS_TBARLEFT }));
        alignDiv.push(sf.base.createElement('div', { className: CLS_TBARCENTER }));
        alignDiv.push(sf.base.createElement('div', { className: CLS_TBARRIGHT }));
        if (pos === 0 && item.align !== 'Left') {
            alignDiv.forEach(function (ele) {
                itemEle.appendChild(ele);
            });
            this.tbarAlign = true;
            sf.base.addClass([itemEle], CLS_TBARPOS);
        }
        else if (item.align !== 'Left') {
            var alignEle = itemEle.childNodes;
            var leftAlign_1 = alignDiv[0];
            [].slice.call(alignEle).forEach(function (el) {
                _this.tbarAlgEle.lefts.push(el);
                leftAlign_1.appendChild(el);
            });
            itemEle.appendChild(leftAlign_1);
            itemEle.appendChild(alignDiv[1]);
            itemEle.appendChild(alignDiv[2]);
            this.tbarAlign = true;
            sf.base.addClass([itemEle], CLS_TBARPOS);
        }
    };
    SfToolbar.prototype.renderItems = function () {
        var ele = this.element;
        var items = this.options.items;
        if (ele && items.length > 0) {
            var itemEleDom = ele.querySelector('.' + CLS_ITEMS);
            if (!itemEleDom) {
                itemEleDom = sf.base.createElement('div', { className: CLS_ITEMS });
            }
            this.itemsAlign(items, itemEleDom);
            if (!sf.base.isNullOrUndefined(ele.firstElementChild)) {
                ele.insertBefore(itemEleDom, ele.firstElementChild);
            }
            else {
                ele.appendChild(itemEleDom);
            }
        }
    };
    SfToolbar.prototype.setAttr = function (attr, element) {
        var key = Object.keys(attr);
        var keyVal;
        for (var i = 0; i < key.length; i++) {
            keyVal = key[i];
            keyVal === 'class' ? sf.base.addClass([element], attr[keyVal]) : element.setAttribute(keyVal, attr[keyVal]);
        }
    };
    SfToolbar.prototype.itemClick = function (e) {
        this.activeEleSwitch(e.currentTarget);
    };
    SfToolbar.prototype.activeEleSwitch = function (ele) {
        this.activeEleRemove(ele.firstElementChild);
        this.activeEle.focus();
    };
    SfToolbar.prototype.activeEleRemove = function (curEle) {
        if (!sf.base.isNullOrUndefined(this.activeEle)) {
            this.activeEle.setAttribute('tabindex', '-1');
        }
        this.activeEle = curEle;
        if (sf.base.isNullOrUndefined(this.trgtEle) && !curEle.parentElement.classList.contains(CLS_TEMPLATE)) {
            curEle.removeAttribute('tabindex');
        }
        else {
            this.activeEle.setAttribute('tabindex', '0');
        }
    };
    SfToolbar.prototype.resize = function () {
        var ele = this.element;
        this.tbResize = true;
        if (this.tbarAlign) {
            this.itemPositioning();
        }
        if (this.popObj && this.options.overflowMode === 'Popup') {
            this.popObj.hide();
        }
        var checkOverflow = this.checkOverflow(ele, ele.getElementsByClassName(CLS_ITEMS)[0]);
        if (!checkOverflow) {
            this.destroyScroll();
            var multirowele = ele.querySelector('.' + CLS_ITEMS);
            if (!sf.base.isNullOrUndefined(multirowele)) {
                sf.base.removeClass([multirowele], CLS_MULTIROWPOS);
                if (this.tbarAlign) {
                    sf.base.addClass([multirowele], CLS_TBARPOS);
                }
            }
        }
        if (checkOverflow && this.scrollModule && (this.offsetWid === ele.offsetWidth)) {
            return;
        }
        if (this.offsetWid > ele.offsetWidth || checkOverflow) {
            this.renderOverflowMode();
        }
        if (this.popObj) {
            if (this.options.overflowMode === 'Extended') {
                var eleStyles = window.getComputedStyle(this.element);
                this.popObj.width = parseFloat(eleStyles.width) + ((parseFloat(eleStyles.borderRightWidth)) * 2);
            }
            if (this.tbarAlign) {
                this.removePositioning();
            }
            this.popupRefresh(this.popObj.element, false);
            if (this.tbarAlign) {
                this.refreshPositioning();
            }
        }
        this.offsetWid = ele.offsetWidth;
        this.tbResize = false;
        this.separator();
    };
    SfToolbar.prototype.extendedOpen = function () {
        var sib = this.element.querySelector('.' + CLS_EXTENDABLECLASS);
        if (this.options.overflowMode === 'Extended' && sib) {
            this.isExtendedOpen = sib.classList.contains(CLS_POPUPOPEN);
        }
    };
    SfToolbar.prototype.disable = function (value) {
        var rootEle = this.element;
        value ? rootEle.classList.add(CLS_DISABLE) : rootEle.classList.remove(CLS_DISABLE);
        rootEle.setAttribute('tabindex', !value ? '0' : '-1');
        if (this.activeEle) {
            this.activeEle.setAttribute('tabindex', !value ? '0' : '-1');
        }
        if (this.scrollModule) {
            this.scrollModule.disable(value);
        }
        if (this.popObj) {
            if (sf.base.isVisible(this.popObj.element) && this.options.overflowMode !== 'Extended') {
                this.popObj.hide();
            }
            rootEle.querySelector('#' + rootEle.id + '_nav').setAttribute('tabindex', !value ? '0' : '-1');
        }
    };
    SfToolbar.prototype.setCssClass = function (cssClass) {
        this.extendedOpen();
        if (this.options.cssClass) {
            sf.base.removeClass([this.element], this.options.cssClass.split(' '));
        }
        if (cssClass) {
            sf.base.addClass([this.element], cssClass.split(' '));
        }
        this.options.cssClass = cssClass;
    };
    return SfToolbar;
}());
// tslint:disable
var Toolbar = {
    initialize: function (element, options, dotnetRef) {
        if (options.scrollStep === 0) {
            options.scrollStep = null;
        }
        var instance = new SfToolbar(element, options, dotnetRef);
        instance.render();
        instance.dotNetRef.invokeMethodAsync("CreatedEvent", null);
    },
    hidePopup: function (element) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance) && !sf.base.isNullOrUndefined(element.blazor__instance.popObj)) {
            element.blazor__instance.popObj.hide({ name: 'FadeOut', duration: 100 });
        }
    },
    setCssClass: function (element, cssClass) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.setCssClass(cssClass);
        }
    },
    setWidth: function (element, width) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.width = width;
            element.blazor__instance.extendedOpen();
            var wid = element.offsetWidth;
            sf.base.setStyleAttribute(element, { 'width': sf.base.formatUnit(width) });
            element.blazor__instance.renderOverflowMode();
            if (element.blazor__instance.popObj && wid < element.offsetWidth) {
                element.blazor__instance.popupRefresh(element.blazor__instance.popObj.element, false);
            }
        }
    },
    setHeight: function (element, height) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.height = height;
            element.blazor__instance.extendedOpen();
            sf.base.setStyleAttribute(element, { 'height': sf.base.formatUnit(height) });
        }
    },
    setOverflowMode: function (element, overflowMode) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.overflowMode = overflowMode;
            element.blazor__instance.extendedOpen();
            element.blazor__instance.destroyMode();
            element.blazor__instance.renderOverflowMode();
            if (element.blazor__instance.options.enableRtl) {
                sf.base.addClass([element], CLS_RTL);
            }
            element.blazor__instance.refreshOverflow();
        }
    },
    setEnableRTL: function (element, enableRtl) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.enableRtl = enableRtl;
            element.blazor__instance.extendedOpen();
            enableRtl ? sf.base.addClass([element], CLS_RTL) : sf.base.removeClass([element], CLS_RTL);
            if (!sf.base.isNullOrUndefined(element.blazor__instance.scrollModule)) {
                enableRtl ? sf.base.addClass([element.blazor__instance.scrollModule.element], CLS_RTL) : sf.base.removeClass([element.blazor__instance.scrollModule.element], CLS_RTL);
            }
            if (!sf.base.isNullOrUndefined(element.blazor__instance.popObj)) {
                enableRtl ? sf.base.addClass([element.blazor__instance.popObj.element], CLS_RTL) : sf.base.removeClass([element.blazor__instance.popObj.element], CLS_RTL);
            }
            if (element.blazor__instance.tbarAlign) {
                element.blazor__instance.itemPositioning();
            }
        }
    },
    setScrollStep: function (element, scrollStep) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.scrollStep = scrollStep;
            element.blazor__instance.extendedOpen();
            if (element.blazor__instance.scrollModule) {
                element.blazor__instance.scrollModule.scrollStep = scrollStep;
            }
        }
    },
    setEnableCollision: function (element, enableCollision) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.enableCollision = enableCollision;
            element.blazor__instance.extendedOpen();
            if (element.blazor__instance.popObj) {
                element.blazor__instance.popObj.collision = { Y: enableCollision ? 'flip' : 'none' };
            }
        }
    },
    setAllowKeyboard: function (element, allowKeyboard) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.allowKeyboard = allowKeyboard;
            element.blazor__instance.extendedOpen();
            element.blazor__instance.unwireKeyboardEvent();
            if (allowKeyboard) {
                element.blazor__instance.wireKeyboardEvent();
            }
        }
    },
    serverItemsRerender: function (element, items) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.items = items;
            element.blazor__instance.extendedOpen();
            element.blazor__instance.destroyMode();
            element.blazor__instance.resetServerItems();
            element.blazor__instance.serverItemsRefresh();
        }
    },
    hideItem: function (element, items) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options.items = items;
            element.blazor__instance.refreshOverflow();
        }
    },
    disable: function (element, value) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.disable(value);
        }
    },
    refreshOverflow: function (element) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.refreshOverflow();
        }
    },
    destroy: function (element) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.destroy();
        }
    },
    refresh: function (element, options) {
        if (options.scrollStep === 0) {
            options.scrollStep = null;
        }
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.options = options;
            element.blazor__instance.destroyMode();
            element.blazor__instance.resetServerItems();
            element.blazor__instance.serverItemsRefresh();
        }
    }
};

return Toolbar;

}());
