window.sf = window.sf || {};
var sftoolbar = (function (exports) {
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
var CLS_TBARBTN = 'e-tbar-btn';
var CLS_TBARNAV = 'e-hor-nav';
var CLS_TBARSCRLNAV = 'e-scroll-nav';
var CLS_TBARRIGHT = 'e-toolbar-right';
var CLS_TBARLEFT = 'e-toolbar-left';
var CLS_TBARCENTER = 'e-toolbar-center';
var CLS_TBARPOS = 'e-tbar-pos';
var CLS_HSCROLLCNT = 'e-hscroll-content';
var CLS_VSCROLLCNT = 'e-vscroll-content';
var CLS_HSCROLLBAR = 'e-hscroll-bar';
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
/**
 * An item object that is used to configure Toolbar commands.
 */
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property('')
    ], Item.prototype, "id", void 0);
    __decorate([
        sf.base.Property('')
    ], Item.prototype, "text", void 0);
    __decorate([
        sf.base.Property('auto')
    ], Item.prototype, "width", void 0);
    __decorate([
        sf.base.Property('')
    ], Item.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(false)
    ], Item.prototype, "showAlwaysInPopup", void 0);
    __decorate([
        sf.base.Property(false)
    ], Item.prototype, "disabled", void 0);
    __decorate([
        sf.base.Property('')
    ], Item.prototype, "prefixIcon", void 0);
    __decorate([
        sf.base.Property('')
    ], Item.prototype, "suffixIcon", void 0);
    __decorate([
        sf.base.Property(true)
    ], Item.prototype, "visible", void 0);
    __decorate([
        sf.base.Property('None')
    ], Item.prototype, "overflow", void 0);
    __decorate([
        sf.base.Property('')
    ], Item.prototype, "template", void 0);
    __decorate([
        sf.base.Property('Button')
    ], Item.prototype, "type", void 0);
    __decorate([
        sf.base.Property('Both')
    ], Item.prototype, "showTextOn", void 0);
    __decorate([
        sf.base.Property(null)
    ], Item.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Property('')
    ], Item.prototype, "tooltipText", void 0);
    __decorate([
        sf.base.Property('Left')
    ], Item.prototype, "align", void 0);
    __decorate([
        sf.base.Event()
    ], Item.prototype, "click", void 0);
    return Item;
}(sf.base.ChildProperty));
/**
 * The Toolbar control contains a group of commands that are aligned horizontally.
 * ```html
 * <div id="toolbar"/>
 * <script>
 *   var toolbarObj = new Toolbar();
 *   toolbarObj.appendTo("#toolbar");
 * </script>
 * ```
 */
var Toolbar = /** @class */ (function (_super) {
    __extends(Toolbar, _super);
    /**
     * Initializes a new instance of the Toolbar class.
     * @param options  - Specifies Toolbar model properties as options.
     * @param element  - Specifies the element that is rendered as a Toolbar.
     */
    function Toolbar(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.resizeContext = _this.resize.bind(_this);
        /**
         * Contains the keyboard configuration of the Toolbar.
         */
        _this.keyConfigs = {
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
        return _this;
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void.
     */
    Toolbar.prototype.destroy = function () {
        var _this = this;
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.clearTemplate();
        }
        _super.prototype.destroy.call(this);
        this.unwireEvents();
        this.tempId.forEach(function (ele) {
            if (!sf.base.isNullOrUndefined(_this.element.querySelector(ele))) {
                document.body.appendChild(_this.element.querySelector(ele)).style.display = 'none';
            }
        });
        if (sf.base.isBlazor() && this.isServerRendered) {
            this.resetServerItems();
        }
        while (this.element.lastElementChild && !this.element.lastElementChild.classList.contains(BZ_ITEMS)) {
            this.element.removeChild(this.element.lastElementChild);
        }
        if (this.trgtEle) {
            this.element.appendChild(this.ctrlTem);
        }
        this.clearProperty();
        this.popObj = null;
        this.tbarAlign = null;
        this.remove(this.element, 'e-toolpop');
        if (this.cssClass) {
            sf.base.removeClass([this.element], this.cssClass.split(' '));
        }
        this.element.removeAttribute('style');
        ['aria-disabled', 'aria-orientation', 'aria-haspopup', 'role'].forEach(function (attrb) {
            return _this.element.removeAttribute(attrb);
        });
    };
    /**
     * Initialize the event handler
     * @private
     */
    Toolbar.prototype.preRender = function () {
        var eventArgs = { enableCollision: this.enableCollision, scrollStep: this.scrollStep };
        this.trigger('beforeCreate', eventArgs);
        this.enableCollision = eventArgs.enableCollision;
        this.scrollStep = eventArgs.scrollStep;
        this.scrollModule = null;
        this.popObj = null;
        this.tempId = [];
        this.tbarItemsCol = this.items;
        this.isVertical = this.element.classList.contains(CLS_VERTICAL) ? true : false;
        this.isExtendedOpen = false;
        this.popupPriCount = 0;
        if (this.enableRtl) {
            this.add(this.element, CLS_RTL);
        }
    };
    Toolbar.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.element, 'click', this.clickHandler, this);
        window.addEventListener('resize', this.resizeContext);
        if (this.allowKeyboard) {
            this.wireKeyboardEvent();
        }
    };
    Toolbar.prototype.wireKeyboardEvent = function () {
        this.keyModule = new sf.base.KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs
        });
        sf.base.EventHandler.add(this.element, 'keydown', this.docKeyDown, this);
        this.element.setAttribute('tabIndex', '0');
    };
    Toolbar.prototype.unwireKeyboardEvent = function () {
        if (this.keyModule) {
            sf.base.EventHandler.remove(this.element, 'keydown', this.docKeyDown);
            this.keyModule.destroy();
            this.keyModule = null;
        }
    };
    Toolbar.prototype.docKeyDown = function (e) {
        if (e.target.tagName === 'INPUT') {
            return;
        }
        var popCheck = !sf.base.isNullOrUndefined(this.popObj) && sf.base.isVisible(this.popObj.element) && this.overflowMode !== 'Extended';
        if (e.keyCode === 9 && e.target.classList.contains('e-hor-nav') === true && popCheck) {
            this.popObj.hide({ name: 'FadeOut', duration: 100 });
        }
        var keyCheck = (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 35 || e.keyCode === 36);
        if (keyCheck) {
            e.preventDefault();
        }
    };
    Toolbar.prototype.unwireEvents = function () {
        sf.base.EventHandler.remove(this.element, 'click', this.clickHandler);
        this.destroyScroll();
        this.unwireKeyboardEvent();
        window.removeEventListener('resize', this.resizeContext);
        sf.base.EventHandler.remove(document, 'scroll', this.docEvent);
        sf.base.EventHandler.remove(document, 'click', this.docEvent);
    };
    Toolbar.prototype.clearProperty = function () {
        this.tbarEle = [];
        this.tbarAlgEle = { lefts: [], centers: [], rights: [] };
    };
    Toolbar.prototype.docEvent = function (e) {
        var popEle = sf.base.closest(e.target, '.e-popup');
        if (this.popObj && sf.base.isVisible(this.popObj.element) && !popEle && this.overflowMode === 'Popup') {
            this.popObj.hide({ name: 'FadeOut', duration: 100 });
        }
    };
    Toolbar.prototype.destroyScroll = function () {
        if (this.scrollModule) {
            if (this.tbarAlign) {
                this.add(this.scrollModule.element, CLS_TBARPOS);
            }
            this.scrollModule.destroy();
            this.scrollModule = null;
        }
    };
    Toolbar.prototype.destroyItems = function () {
        [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM)).forEach(function (el) {
            sf.base.detach(el);
        });
        var tbarItems = this.element.querySelector('.' + CLS_ITEMS);
        if (this.tbarAlign) {
            [].slice.call(tbarItems.children).forEach(function (el) {
                sf.base.detach(el);
            });
            this.tbarAlign = false;
            this.remove(tbarItems, CLS_TBARPOS);
        }
        this.clearProperty();
    };
    Toolbar.prototype.destroyMode = function () {
        if (this.scrollModule) {
            this.remove(this.scrollModule.element, CLS_RTL);
            this.destroyScroll();
        }
        this.remove(this.element, CLS_EXTENDEDPOPOPEN);
        this.remove(this.element, CLS_EXTEANDABLE_TOOLBAR);
        var tempEle = this.element.querySelector('.e-toolbar-multirow');
        if (tempEle) {
            this.remove(tempEle, CLS_MULTIROW);
        }
        if (this.popObj) {
            this.popupRefresh(this.popObj.element, true);
        }
    };
    Toolbar.prototype.add = function (ele, val) {
        ele.classList.add(val);
    };
    Toolbar.prototype.remove = function (ele, val) {
        ele.classList.remove(val);
    };
    Toolbar.prototype.elementFocus = function (ele) {
        var fChild = ele.firstElementChild;
        if (fChild) {
            fChild.focus();
            this.activeEleSwitch(ele);
        }
        else {
            ele.focus();
        }
    };
    Toolbar.prototype.clstElement = function (tbrNavChk, trgt) {
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
    Toolbar.prototype.keyHandling = function (clst, e, trgt, navChk, scrollChk) {
        var popObj = this.popObj;
        var rootEle = this.element;
        var popAnimate = { name: 'FadeOut', duration: 100 };
        switch (e.action) {
            case 'moveRight':
                if (this.isVertical) {
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
                if (this.isVertical) {
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
                if (!this.isVertical) {
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
                if (popObj && this.overflowMode !== 'Extended') {
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
    Toolbar.prototype.keyActionHandler = function (e) {
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
    /**
     * Specifies the value to disable/enable the Toolbar component.
     * When set to `true`, the component will be disabled.
     * @param  {boolean} value - Based on this Boolean value, Toolbar will be enabled (false) or disabled (true).
     * @returns void.
     */
    Toolbar.prototype.disable = function (value) {
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
            if (sf.base.isVisible(this.popObj.element) && this.overflowMode !== 'Extended') {
                this.popObj.hide();
            }
            rootEle.querySelector('#' + rootEle.id + '_nav').setAttribute('tabindex', !value ? '0' : '-1');
        }
    };
    Toolbar.prototype.eleContains = function (el) {
        // tslint:disable-next-line:max-line-length
        return el.classList.contains(CLS_SEPARATOR) || el.classList.contains(CLS_DISABLE) || el.getAttribute('disabled') || el.classList.contains(CLS_HIDDEN) || !sf.base.isVisible(el);
        // tslint:enable-next-line:max-line-length
    };
    Toolbar.prototype.eleFocus = function (closest$$1, pos) {
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
    Toolbar.prototype.clickHandler = function (e) {
        var _this = this;
        var trgt = e.target;
        var clsList = trgt.classList;
        var ele = this.element;
        var isPopupElement = !sf.base.isNullOrUndefined(sf.base.closest(trgt, '.' + CLS_POPUPCLASS));
        var popupNav = sf.base.closest(trgt, ('.' + CLS_TBARNAV));
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
        var itemObj;
        var clst = sf.base.closest(e.target, '.' + CLS_ITEM);
        if ((sf.base.isNullOrUndefined(clst) || clst.classList.contains(CLS_DISABLE)) && !popupNav.classList.contains(CLS_TBARNAV)) {
            return;
        }
        if (clst) {
            var tempItem = this.items[this.tbarEle.indexOf(clst)];
            if (tempItem && sf.base.isBlazor() && this.isServerRendered) {
                itemObj = {
                    id: tempItem.id,
                    text: tempItem.text,
                    width: tempItem.width,
                    cssClass: tempItem.cssClass,
                    showAlwaysInPopup: tempItem.showAlwaysInPopup,
                    disabled: tempItem.disabled,
                    prefixIcon: tempItem.prefixIcon,
                    suffixIcon: tempItem.suffixIcon,
                    visible: tempItem.visible,
                    overflow: tempItem.overflow,
                    template: tempItem.template,
                    type: tempItem.type,
                    showTextOn: tempItem.showTextOn,
                    htmlAttributes: tempItem.htmlAttributes,
                    tooltipText: tempItem.tooltipText,
                    align: tempItem.align,
                    click: tempItem.click
                };
            }
            else {
                itemObj = tempItem;
            }
        }
        var eventArgs = { originalEvent: e, item: itemObj };
        if (itemObj && !sf.base.isNullOrUndefined(itemObj.click)) {
            this.trigger('items[' + this.tbarEle.indexOf(clst) + '].click', eventArgs);
        }
        if (!eventArgs.cancel) {
            this.trigger('clicked', eventArgs, function (clickedArgs) {
                if (!sf.base.isNullOrUndefined(_this.popObj) && isPopupElement && !clickedArgs.cancel && _this.overflowMode === 'Popup' &&
                    clickedArgs.item && clickedArgs.item.type !== 'Input') {
                    _this.popObj.hide({ name: 'FadeOut', duration: 100 });
                }
            });
        }
    };
    
    Toolbar.prototype.popupClickHandler = function (ele, popupNav, CLS_RTL) {
        var popObj = this.popObj;
        if (sf.base.isVisible(popObj.element)) {
            popupNav.classList.remove(CLS_TBARNAVACT);
            popObj.hide({ name: 'FadeOut', duration: 100 });
        }
        else {
            if (ele.classList.contains(CLS_RTL)) {
                popObj.enableRtl = true;
                popObj.position = { X: 'left', Y: 'top' };
            }
            if (popObj.offsetX === 0 && !ele.classList.contains(CLS_RTL)) {
                popObj.enableRtl = false;
                popObj.position = { X: 'right', Y: 'top' };
            }
            popObj.dataBind();
            popObj.refreshPosition();
            popObj.element.style.top = this.getElementOffsetY() + 'px';
            if (this.overflowMode === 'Extended') {
                popObj.element.style.minHeight = '0px';
            }
            popupNav.classList.add(CLS_TBARNAVACT);
            popObj.show({ name: 'FadeIn', duration: 100 });
        }
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    Toolbar.prototype.render = function () {
        this.initialize();
        this.renderControl();
        this.wireEvents();
        this.renderComplete();
    };
    Toolbar.prototype.initialize = function () {
        var width = sf.base.formatUnit(this.width);
        var height = sf.base.formatUnit(this.height);
        if (sf.base.Browser.info.name !== 'msie' || this.height !== 'auto' || this.overflowMode === 'MultiRow') {
            sf.base.setStyleAttribute(this.element, { 'height': height });
        }
        sf.base.setStyleAttribute(this.element, { 'width': width });
        var ariaAttr = {
            'role': 'toolbar', 'aria-disabled': 'false', 'aria-haspopup': 'false',
            'aria-orientation': !this.isVertical ? 'horizontal' : 'vertical',
        };
        sf.base.attributes(this.element, ariaAttr);
        if (this.cssClass) {
            sf.base.addClass([this.element], this.cssClass.split(' '));
        }
    };
    Toolbar.prototype.renderControl = function () {
        var ele = this.element;
        this.trgtEle = (ele.children.length > 0 && (!sf.base.isBlazor() && !this.isServerRendered)) ? ele.querySelector('div') : null;
        this.tbarAlgEle = { lefts: [], centers: [], rights: [] };
        this.renderItems();
        this.renderLayout();
    };
    Toolbar.prototype.renderLayout = function () {
        this.renderOverflowMode();
        if (this.tbarAlign) {
            this.itemPositioning();
        }
        if (this.popObj && this.popObj.element.childElementCount > 1 && this.checkPopupRefresh(this.element, this.popObj.element)) {
            this.popupRefresh(this.popObj.element, false);
        }
        this.separator();
    };
    Toolbar.prototype.itemsAlign = function (items, itemEleDom) {
        var innerItem;
        var innerPos;
        if (!this.tbarEle) {
            this.tbarEle = [];
        }
        for (var i = 0; i < items.length; i++) {
            if (sf.base.isBlazor() && this.isServerRendered) {
                this.isVertical = this.element.classList.contains(CLS_VERTICAL) ? true : false;
                var itemEleBlaDom = this.element.querySelector('.' + BZ_ITEMS);
                innerItem = itemEleBlaDom.querySelector('.' + CLS_ITEM + '[data-index="' + i + '"]');
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
            }
            else {
                innerItem = this.renderSubComponent(items[i], i);
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
            // tslint:disable-next-line:no-any
            if (this.isReact) {
                this.renderReactTemplates();
            }
        }
    };
    Toolbar.prototype.serverItemsRerender = function () {
        this.destroyMode();
        this.resetServerItems();
        this.serverItemsRefresh();
    };
    Toolbar.prototype.serverItemsRefresh = function () {
        var wrapBlaEleDom = this.element.querySelector('.' + BZ_ITEMS);
        if (wrapBlaEleDom.children.length > 0) {
            this.itemsAlign(this.items, this.element.querySelector('.' + CLS_ITEMS));
            this.renderLayout();
            this.refreshOverflow();
        }
    };
    Toolbar.prototype.resetServerItems = function () {
        var wrapBlaEleDom = this.element.querySelector('.' + BZ_ITEMS);
        var itemEles = [].slice.call(sf.base.selectAll('.' + CLS_ITEMS + ' .' + CLS_ITEM, this.element));
        sf.base.append(itemEles, wrapBlaEleDom);
        this.clearProperty();
    };
    /** @hidden */
    Toolbar.prototype.changeOrientation = function () {
        var ele = this.element;
        if (this.isVertical) {
            ele.classList.remove(CLS_VERTICAL);
            this.isVertical = false;
            if (this.height === 'auto' || this.height === '100%') {
                ele.style.height = this.height;
            }
            ele.setAttribute('aria-orientation', 'horizontal');
        }
        else {
            ele.classList.add(CLS_VERTICAL);
            this.isVertical = true;
            ele.setAttribute('aria-orientation', 'vertical');
            sf.base.setStyleAttribute(this.element, { 'height': sf.base.formatUnit(this.height), 'width': sf.base.formatUnit(this.width) });
        }
        this.destroyMode();
        this.refreshOverflow();
    };
    Toolbar.prototype.initScroll = function (element, innerItems) {
        if (!this.scrollModule && this.checkOverflow(element, innerItems[0])) {
            if (this.tbarAlign) {
                this.element.querySelector('.' + CLS_ITEMS + ' .' + CLS_TBARCENTER).removeAttribute('style');
            }
            if (this.isVertical) {
                this.scrollModule = new sf.navigations.VScroll({ scrollStep: this.scrollStep, enableRtl: this.enableRtl }, innerItems[0]);
            }
            else {
                this.scrollModule = new sf.navigations.HScroll({ scrollStep: this.scrollStep, enableRtl: this.enableRtl }, innerItems[0]);
            }
            this.remove(this.scrollModule.element, CLS_TBARPOS);
            sf.base.setStyleAttribute(this.element, { overflow: 'hidden' });
        }
    };
    Toolbar.prototype.itemWidthCal = function (items) {
        var _this = this;
        var width = 0;
        var style;
        [].slice.call(sf.base.selectAll('.' + CLS_ITEM, items)).forEach(function (el) {
            if (sf.base.isVisible(el)) {
                style = window.getComputedStyle(el);
                width += _this.isVertical ? el.offsetHeight : el.offsetWidth;
                width += parseFloat(_this.isVertical ? style.marginTop : style.marginRight);
                width += parseFloat(_this.isVertical ? style.marginBottom : style.marginLeft);
            }
        });
        return width;
    };
    Toolbar.prototype.getScrollCntEle = function (innerItem) {
        var trgClass = (this.isVertical) ? '.e-vscroll-content' : '.e-hscroll-content';
        return innerItem.querySelector(trgClass);
    };
    Toolbar.prototype.checkOverflow = function (element, innerItem) {
        if (sf.base.isNullOrUndefined(element) || sf.base.isNullOrUndefined(innerItem) || !sf.base.isVisible(element)) {
            return false;
        }
        var eleWidth = this.isVertical ? element.offsetHeight : element.offsetWidth;
        var itemWidth = this.isVertical ? innerItem.offsetHeight : innerItem.offsetWidth;
        if (this.tbarAlign || this.scrollModule || (eleWidth === itemWidth)) {
            itemWidth = this.itemWidthCal(this.scrollModule ? this.getScrollCntEle(innerItem) : innerItem);
        }
        var popNav = element.querySelector('.' + CLS_TBARNAV);
        var scrollNav = element.querySelector('.' + CLS_TBARSCRLNAV);
        var navEleWidth = 0;
        if (popNav) {
            navEleWidth = this.isVertical ? popNav.offsetHeight : popNav.offsetWidth;
        }
        else if (scrollNav) {
            navEleWidth = this.isVertical ? (scrollNav.offsetHeight * (2)) : (scrollNav.offsetWidth * 2);
        }
        if (itemWidth > eleWidth - navEleWidth) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Refresh the whole Toolbar component without re-rendering.
     * - It is used to manually refresh the Toolbar overflow modes such as scrollable, popup, multi row, and extended.
     * - It will refresh the Toolbar component after loading items dynamically.
     * @returns void.
     */
    Toolbar.prototype.refreshOverflow = function () {
        this.resize();
    };
    Toolbar.prototype.toolbarAlign = function (innerItems) {
        if (this.tbarAlign) {
            this.add(innerItems, CLS_TBARPOS);
            this.itemPositioning();
        }
    };
    Toolbar.prototype.renderOverflowMode = function () {
        var ele = this.element;
        var innerItems = ele.querySelector('.' + CLS_ITEMS);
        var priorityCheck = this.popupPriCount > 0;
        if (ele && ele.children.length > 0) {
            this.offsetWid = ele.offsetWidth;
            this.remove(this.element, 'e-toolpop');
            if (sf.base.Browser.info.name === 'msie' && this.height === 'auto') {
                ele.style.height = '';
            }
            switch (this.overflowMode) {
                case 'Scrollable':
                    if (sf.base.isNullOrUndefined(this.scrollModule)) {
                        this.initScroll(ele, [].slice.call(ele.getElementsByClassName(CLS_ITEMS)));
                    }
                    break;
                case 'Popup':
                    this.add(this.element, 'e-toolpop');
                    if (this.tbarAlign) {
                        this.removePositioning();
                    }
                    if (this.checkOverflow(ele, innerItems) || priorityCheck) {
                        this.setOverflowAttributes(ele);
                    }
                    this.toolbarAlign(innerItems);
                    break;
                case 'MultiRow':
                    this.add(innerItems, CLS_MULTIROW);
                    if (this.checkOverflow(ele, innerItems) && this.tbarAlign) {
                        this.removePositioning();
                        this.add(innerItems, CLS_MULTIROWPOS);
                    }
                    if (ele.style.overflow === 'hidden') {
                        ele.style.overflow = '';
                    }
                    if (sf.base.Browser.info.name === 'msie' || ele.style.height !== 'auto') {
                        ele.style.height = 'auto';
                    }
                    break;
                case 'Extended':
                    this.add(this.element, CLS_EXTEANDABLE_TOOLBAR);
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
    Toolbar.prototype.setOverflowAttributes = function (ele) {
        this.createPopupEle(ele, [].slice.call(sf.base.selectAll('.' + CLS_ITEMS + ' .' + CLS_ITEM, ele)));
        this.element.querySelector('.' + CLS_TBARNAV).setAttribute('tabIndex', '0');
        this.element.querySelector('.' + CLS_TBARNAV).setAttribute('role', 'list');
    };
    Toolbar.prototype.separator = function () {
        var element = this.element;
        var eleItem = [].slice.call(element.querySelectorAll('.' + CLS_SEPARATOR));
        var eleInlineItem;
        var multiVar = element.querySelector('.' + CLS_MULTIROW_SEPARATOR);
        var extendVar = element.querySelector('.' + CLS_EXTENDABLE_SEPARATOR);
        eleInlineItem = this.overflowMode === 'MultiRow' ? multiVar : extendVar;
        if (eleInlineItem !== null) {
            if (this.overflowMode === 'MultiRow') {
                eleInlineItem.classList.remove(CLS_MULTIROW_SEPARATOR);
            }
            else if (this.overflowMode === 'Extended') {
                eleInlineItem.classList.remove(CLS_EXTENDABLE_SEPARATOR);
            }
        }
        for (var i = 0; i <= eleItem.length - 1; i++) {
            if (eleItem[i].offsetLeft < 30 && eleItem[i].offsetLeft !== 0) {
                if (this.overflowMode === 'MultiRow') {
                    eleItem[i].classList.add(CLS_MULTIROW_SEPARATOR);
                }
                else if (this.overflowMode === 'Extended') {
                    eleItem[i].classList.add(CLS_EXTENDABLE_SEPARATOR);
                }
            }
        }
    };
    Toolbar.prototype.createPopupEle = function (ele, innerEle) {
        var innerNav = ele.querySelector('.' + CLS_TBARNAV);
        var vertical = this.isVertical;
        if (!innerNav) {
            this.createPopupIcon(ele);
        }
        innerNav = ele.querySelector('.' + CLS_TBARNAV);
        var innerNavDom = (vertical ? innerNav.offsetHeight : innerNav.offsetWidth);
        var eleWidth = ((vertical ? ele.offsetHeight : ele.offsetWidth) - (innerNavDom));
        this.element.classList.remove('e-rtl');
        sf.base.setStyleAttribute(this.element, { direction: 'initial' });
        this.checkPriority(ele, innerEle, eleWidth, true);
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        }
        this.element.style.removeProperty('direction');
        this.createPopup();
    };
    Toolbar.prototype.pushingPoppedEle = function (tbarObj, popupPri, ele, eleHeight, sepHeight) {
        var element = tbarObj.element;
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
            if (tbarElement.classList.contains(CLS_SEPARATOR) && this.overflowMode !== 'Extended') {
                sf.base.setStyleAttribute(tbarElement, { display: 'none' });
            }
            else {
                break;
            }
        }
    };
    Toolbar.prototype.createPopup = function () {
        var element = this.element;
        var eleHeight;
        var eleItem;
        var sepHeight;
        var sepItem;
        if (this.overflowMode === 'Extended') {
            sepItem = element.querySelector('.' + CLS_SEPARATOR + ':not(.' + CLS_POPUP + ')');
            sepHeight = (element.style.height === 'auto' || element.style.height === '') ? null : sepItem.offsetHeight;
        }
        eleItem = element.querySelector('.' + CLS_ITEM + ':not(.' + CLS_SEPARATOR + '):not(.' + CLS_POPUP + ')');
        eleHeight = (element.style.height === 'auto' || element.style.height === '') ? null : (eleItem && eleItem.offsetHeight);
        var ele;
        var popupPri = [];
        if (element.querySelector('#' + element.id + '_popup.' + CLS_POPUPCLASS)) {
            ele = element.querySelector('#' + element.id + '_popup.' + CLS_POPUPCLASS);
        }
        else {
            var extendEle = this.createElement('div', {
                id: element.id + '_popup', className: CLS_POPUPCLASS + ' ' + CLS_EXTENDABLECLASS
            });
            var popupEle = this.createElement('div', { id: element.id + '_popup', className: CLS_POPUPCLASS });
            ele = this.overflowMode === 'Extended' ? extendEle : popupEle;
        }
        this.pushingPoppedEle(this, popupPri, ele, eleHeight, sepHeight);
        this.popupInit(element, ele);
    };
    Toolbar.prototype.getElementOffsetY = function () {
        return (this.overflowMode === 'Extended' && window.getComputedStyle(this.element).getPropertyValue('box-sizing') === 'border-box' ?
            this.element.clientHeight : this.element.offsetHeight);
    };
    Toolbar.prototype.popupInit = function (element, ele) {
        if (!this.popObj) {
            element.appendChild(ele);
            sf.base.setStyleAttribute(this.element, { overflow: '' });
            var eleStyles = window.getComputedStyle(this.element);
            var popup = new sf.popups.Popup(null, {
                relateTo: this.element,
                offsetY: (this.isVertical) ? 0 : this.getElementOffsetY(),
                enableRtl: this.enableRtl,
                open: this.popupOpen.bind(this),
                close: this.popupClose.bind(this),
                collision: { Y: this.enableCollision ? 'flip' : 'none' },
                position: this.enableRtl ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }
            });
            popup.appendTo(ele);
            if (this.overflowMode === 'Extended') {
                popup.width = parseFloat(eleStyles.width) + ((parseFloat(eleStyles.borderRightWidth)) * 2);
                popup.offsetX = 0;
            }
            sf.base.EventHandler.add(document, 'scroll', this.docEvent.bind(this));
            sf.base.EventHandler.add(document, 'click ', this.docEvent.bind(this));
            popup.element.style.maxHeight = popup.element.offsetHeight + 'px';
            if (this.isVertical) {
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
    Toolbar.prototype.tbarPopupHandler = function (isOpen) {
        if (this.overflowMode === 'Extended') {
            isOpen ? this.add(this.element, CLS_EXTENDEDPOPOPEN) : this.remove(this.element, CLS_EXTENDEDPOPOPEN);
        }
    };
    Toolbar.prototype.popupOpen = function (e) {
        var popObj = this.popObj;
        if (!this.isVertical) {
            popObj.offsetY = this.getElementOffsetY();
            popObj.dataBind();
        }
        var popupEle = this.popObj.element;
        var toolEle = this.popObj.element.parentElement;
        var popupNav = toolEle.querySelector('.' + CLS_TBARNAV);
        sf.base.setStyleAttribute(popObj.element, { height: 'auto', maxHeight: '' });
        popObj.element.style.maxHeight = popObj.element.offsetHeight + 'px';
        if (this.overflowMode === 'Extended') {
            popObj.element.style.minHeight = '';
        }
        var popupElePos = popupEle.offsetTop + popupEle.offsetHeight + sf.popups.calculatePosition(toolEle).top;
        var popIcon = popupNav.firstElementChild;
        popupNav.classList.add(CLS_TBARNAVACT);
        sf.base.classList(popIcon, [CLS_POPUPICON], [CLS_POPUPDOWN]);
        this.tbarPopupHandler(true);
        var scrollVal = sf.base.isNullOrUndefined(window.scrollY) ? 0 : window.scrollY;
        if (!this.isVertical && ((window.innerHeight + scrollVal) < popupElePos) && (this.element.offsetTop < popupEle.offsetHeight)) {
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
        else if (this.isVertical) {
            var tbEleData = this.element.getBoundingClientRect();
            sf.base.setStyleAttribute(popObj.element, { maxHeight: (tbEleData.top + this.element.offsetHeight) + 'px', bottom: 0, visibility: '' });
        }
        if (popObj) {
            popObj.refreshPosition();
        }
    };
    Toolbar.prototype.popupClose = function (e) {
        var element = this.element;
        var popupNav = element.querySelector('.' + CLS_TBARNAV);
        var popIcon = popupNav.firstElementChild;
        popupNav.classList.remove(CLS_TBARNAVACT);
        sf.base.classList(popIcon, [CLS_POPUPDOWN], [CLS_POPUPICON]);
        this.tbarPopupHandler(false);
    };
    Toolbar.prototype.checkPriority = function (ele, inEle, eleWidth, pre) {
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
            if (this.isVertical) {
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
            eleOffset = this.isVertical ? inEle[i].offsetHeight : inEle[i].offsetWidth;
            var eleWid_1 = fstEleCheck ? (eleOffset + mrgn) : eleOffset;
            if (checkClass(inEle[i], [CLS_POPPRI]) && popPriority) {
                inEle[i].classList.add(CLS_POPUP);
                if (this.isVertical) {
                    sf.base.setStyleAttribute(inEle[i], { display: 'none', minHeight: eleWid_1 + 'px' });
                }
                else {
                    sf.base.setStyleAttribute(inEle[i], { display: 'none', minWidth: eleWid_1 + 'px' });
                }
                itemPopCount++;
            }
            if (this.isVertical) {
                checkoffset = (inEle[i].offsetTop + inEle[i].offsetHeight + mrgn) > eleWidth;
            }
            else {
                checkoffset = (inEle[i].offsetLeft + inEle[i].offsetWidth + mrgn) > eleWidth;
            }
            if (checkoffset) {
                if (inEle[i].classList.contains(CLS_SEPARATOR)) {
                    if (this.overflowMode === 'Extended') {
                        if (itemCount === itemPopCount) {
                            var sepEle = inEle[i];
                            if (checkClass(sepEle, [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                                inEle[i].classList.add(CLS_POPUP);
                                itemPopCount++;
                            }
                        }
                        itemCount++;
                    }
                    else if (this.overflowMode === 'Popup') {
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
                    eleWidth -= ((this.isVertical ? inEle[i].offsetHeight : inEle[i].offsetWidth) + (mrgn));
                }
                else if (!checkClass(inEle[i], [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                    inEle[i].classList.add(CLS_POPUP);
                    if (this.isVertical) {
                        sf.base.setStyleAttribute(inEle[i], { display: 'none', minHeight: eleWid_1 + 'px' });
                    }
                    else {
                        sf.base.setStyleAttribute(inEle[i], { display: 'none', minWidth: eleWid_1 + 'px' });
                    }
                    itemPopCount++;
                }
                else {
                    eleWidth -= ((this.isVertical ? inEle[i].offsetHeight : inEle[i].offsetWidth) + (mrgn));
                }
            }
        }
        if (pre) {
            var popedEle = sf.base.selectAll('.' + CLS_ITEM + ':not(.' + CLS_POPUP + ')', this.element);
            this.checkPriority(ele, popedEle, eleWid, false);
        }
    };
    Toolbar.prototype.createPopupIcon = function (element) {
        var id = element.id.concat('_nav');
        var className = 'e-' + element.id.concat('_nav ' + CLS_POPUPNAV);
        className = this.overflowMode === 'Extended' ? className + ' ' + CLS_EXTENDPOPUP : className;
        var nav = this.createElement('div', { id: id, className: className });
        if (sf.base.Browser.info.name === 'msie' || sf.base.Browser.info.name === 'edge') {
            nav.classList.add('e-ie-align');
        }
        var navItem = this.createElement('div', { className: CLS_POPUPDOWN + ' e-icons' });
        nav.appendChild(navItem);
        nav.setAttribute('tabindex', '0');
        nav.setAttribute('role', 'list');
        element.appendChild(nav);
    };
    Toolbar.prototype.tbarPriRef = function (inEle, indx, sepPri, el, des, elWid, wid, ig) {
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
    Toolbar.prototype.popupRefresh = function (popupEle, destroy) {
        var _this = this;
        var ele = this.element;
        var isVer = this.isVertical;
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
    Toolbar.prototype.ignoreEleFetch = function (index, innerEle) {
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
    Toolbar.prototype.checkPopupRefresh = function (root, popEle) {
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
    Toolbar.prototype.popupEleWidth = function (el) {
        el.style.position = 'absolute';
        var elWidth = this.isVertical ? el.offsetHeight : el.offsetWidth;
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
            elWidth = parseFloat(!this.isVertical ? el.style.minWidth : el.style.minHeight);
            btn.style.minWidth = '';
            btn.style.minHeight = '';
            if (!sf.base.isNullOrUndefined(btnText)) {
                btnText.style.display = '';
            }
        }
        return elWidth;
    };
    Toolbar.prototype.popupEleRefresh = function (width, popupEle, destroy) {
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
                    var pos = this_1.items[index].align;
                    index = this_1.tbarAlgEle[(pos + 's').toLowerCase()].indexOf(el);
                    eleSplice = this_1.tbarAlgEle[(pos + 's').toLowerCase()];
                    innerEle = this_1.element.querySelector('.' + CLS_ITEMS + ' .' + 'e-toolbar-' + pos.toLowerCase());
                }
                var sepBeforePri_1 = 0;
                if (this_1.overflowMode !== 'Extended') {
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
    Toolbar.prototype.removePositioning = function () {
        var item = this.element.querySelector('.' + CLS_ITEMS);
        if (sf.base.isNullOrUndefined(item) || !item.classList.contains(CLS_TBARPOS)) {
            return;
        }
        this.remove(item, CLS_TBARPOS);
        var innerItem = [].slice.call(item.childNodes);
        innerItem[1].removeAttribute('style');
        innerItem[2].removeAttribute('style');
    };
    Toolbar.prototype.refreshPositioning = function () {
        var item = this.element.querySelector('.' + CLS_ITEMS);
        this.add(item, CLS_TBARPOS);
        this.itemPositioning();
    };
    Toolbar.prototype.itemPositioning = function () {
        var item = this.element.querySelector('.' + CLS_ITEMS);
        var margin;
        if (sf.base.isNullOrUndefined(item) || !item.classList.contains(CLS_TBARPOS)) {
            return;
        }
        var popupNav = this.element.querySelector('.' + CLS_TBARNAV);
        var innerItem;
        if (this.scrollModule) {
            var trgClass = (this.isVertical) ? CLS_VSCROLLCNT : CLS_HSCROLLCNT;
            innerItem = [].slice.call(item.querySelector('.' + trgClass).children);
        }
        else {
            innerItem = [].slice.call(item.childNodes);
        }
        if (this.isVertical) {
            margin = innerItem[0].offsetHeight + innerItem[2].offsetHeight;
        }
        else {
            margin = innerItem[0].offsetWidth + innerItem[2].offsetWidth;
        }
        var tbarWid = this.isVertical ? this.element.offsetHeight : this.element.offsetWidth;
        if (popupNav) {
            tbarWid -= (this.isVertical ? popupNav.offsetHeight : popupNav.offsetWidth);
            var popWid = (this.isVertical ? popupNav.offsetHeight : popupNav.offsetWidth) + 'px';
            innerItem[2].removeAttribute('style');
            if (this.isVertical) {
                this.enableRtl ? innerItem[2].style.top = popWid : innerItem[2].style.bottom = popWid;
            }
            else {
                this.enableRtl ? innerItem[2].style.left = popWid : innerItem[2].style.right = popWid;
            }
        }
        if (tbarWid <= margin) {
            return;
        }
        var value = (((tbarWid - margin)) - (!this.isVertical ? innerItem[1].offsetWidth : innerItem[1].offsetHeight)) / 2;
        innerItem[1].removeAttribute('style');
        var mrgn = ((!this.isVertical ? innerItem[0].offsetWidth : innerItem[0].offsetHeight) + value) + 'px';
        if (this.isVertical) {
            this.enableRtl ? innerItem[1].style.marginBottom = mrgn : innerItem[1].style.marginTop = mrgn;
        }
        else {
            this.enableRtl ? innerItem[1].style.marginRight = mrgn : innerItem[1].style.marginLeft = mrgn;
        }
    };
    Toolbar.prototype.tbarItemAlign = function (item, itemEle, pos) {
        var _this = this;
        if (item.showAlwaysInPopup && item.overflow !== 'Show') {
            return;
        }
        var alignDiv = [];
        alignDiv.push(this.createElement('div', { className: CLS_TBARLEFT }));
        alignDiv.push(this.createElement('div', { className: CLS_TBARCENTER }));
        alignDiv.push(this.createElement('div', { className: CLS_TBARRIGHT }));
        if (pos === 0 && item.align !== 'Left') {
            alignDiv.forEach(function (ele) {
                itemEle.appendChild(ele);
            });
            this.tbarAlign = true;
            this.add(itemEle, CLS_TBARPOS);
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
            this.add(itemEle, CLS_TBARPOS);
        }
    };
    Toolbar.prototype.ctrlTemplate = function () {
        var _this = this;
        this.ctrlTem = this.trgtEle.cloneNode(true);
        this.add(this.trgtEle, CLS_ITEMS);
        this.tbarEle = [];
        var innerEle = [].slice.call(this.trgtEle.children);
        innerEle.forEach(function (ele) {
            if (ele.tagName === 'DIV') {
                _this.tbarEle.push(ele);
                ele.setAttribute('aria-disabled', 'false');
                _this.add(ele, CLS_ITEM);
            }
        });
    };
    Toolbar.prototype.renderItems = function () {
        var ele = this.element;
        var items = this.items;
        if (this.trgtEle != null) {
            this.ctrlTemplate();
        }
        else if (ele && items.length > 0) {
            var itemEleDom = void 0;
            if (ele && ele.children.length > 0) {
                itemEleDom = ele.querySelector('.' + CLS_ITEMS);
            }
            if (!itemEleDom) {
                itemEleDom = this.createElement('div', { className: CLS_ITEMS });
            }
            this.itemsAlign(items, itemEleDom);
            ele.appendChild(itemEleDom);
        }
    };
    Toolbar.prototype.setAttr = function (attr, element) {
        var key = Object.keys(attr);
        var keyVal;
        for (var i = 0; i < key.length; i++) {
            keyVal = key[i];
            keyVal === 'class' ? this.add(element, attr[keyVal]) : element.setAttribute(keyVal, attr[keyVal]);
        }
    };
    /**
     * Enables or disables the specified Toolbar item.
     * @param  {number|HTMLElement|NodeList} items - DOM element or an array of items to be enabled or disabled.
     * @param  {boolean} isEnable  - Boolean value that determines whether the command should be enabled or disabled.
     * By default, `isEnable` is set to true.
     * @returns void.
     */
    Toolbar.prototype.enableItems = function (items, isEnable) {
        var elements = items;
        var len = elements.length;
        var ele;
        if (sf.base.isNullOrUndefined(isEnable)) {
            isEnable = true;
        }
        var enable = function (isEnable, ele) {
            if (isEnable) {
                ele.classList.remove(CLS_DISABLE);
                ele.setAttribute('aria-disabled', 'false');
            }
            else {
                ele.classList.add(CLS_DISABLE);
                ele.setAttribute('aria-disabled', 'true');
            }
        };
        if (!sf.base.isNullOrUndefined(len) && len >= 1) {
            for (var a = 0, element = [].slice.call(elements); a < len; a++) {
                var itemElement = element[a];
                if (typeof (itemElement) === 'number') {
                    ele = this.getElementByIndex(itemElement);
                    if (sf.base.isNullOrUndefined(ele)) {
                        return;
                    }
                    else {
                        elements[a] = ele;
                    }
                }
                else {
                    ele = itemElement;
                }
                enable(isEnable, ele);
            }
            isEnable ? sf.base.removeClass(elements, CLS_DISABLE) : sf.base.addClass(elements, CLS_DISABLE);
        }
        else {
            if (typeof (elements) === 'number') {
                ele = this.getElementByIndex(elements);
                if (sf.base.isNullOrUndefined(ele)) {
                    return;
                }
            }
            else {
                ele = items;
            }
            enable(isEnable, ele);
        }
    };
    Toolbar.prototype.getElementByIndex = function (index) {
        if (this.tbarEle[index]) {
            return this.tbarEle[index];
        }
        return null;
    };
    /**
     * Adds new items to the Toolbar that accepts an array as Toolbar items.
     * @param  {ItemsModel[]} items - DOM element or an array of items to be added to the Toolbar.
     * @param  {number} index - Number value that determines where the command is to be added. By default, index is 0.
     * @returns void.
     * @deprecated
     */
    Toolbar.prototype.addItems = function (items, index) {
        var innerItems;
        this.extendedOpen();
        var itemsDiv = this.element.querySelector('.' + CLS_ITEMS);
        if (sf.base.isNullOrUndefined(itemsDiv)) {
            this.itemsRerender(items);
            return;
        }
        var innerEle;
        var itemAgn = 'Left';
        if (sf.base.isNullOrUndefined(index)) {
            index = 0;
        }
        items.forEach(function (e) {
            if (!sf.base.isNullOrUndefined(e.align) && e.align !== 'Left' && itemAgn === 'Left') {
                itemAgn = e.align;
            }
        });
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (sf.base.isNullOrUndefined(item.type)) {
                item.type = 'Button';
            }
            innerItems = sf.base.selectAll('.' + CLS_ITEM, this.element);
            item.align = itemAgn;
            innerEle = this.renderSubComponent(item, index);
            if (this.tbarEle.length >= index && innerItems.length >= 0) {
                if (sf.base.isNullOrUndefined(this.scrollModule)) {
                    this.destroyMode();
                }
                var algIndex = item.align[0] === 'L' ? 0 : item.align[0] === 'C' ? 1 : 2;
                var ele = void 0;
                if (!this.tbarAlign && itemAgn !== 'Left') {
                    this.tbarItemAlign(item, itemsDiv, 1);
                    this.tbarAlign = true;
                    ele = sf.base.closest(innerItems[0], '.' + CLS_ITEMS).children[algIndex];
                    ele.appendChild(innerEle);
                    this.tbarAlgEle[(item.align + 's').toLowerCase()].push(innerEle);
                    this.refreshPositioning();
                }
                else if (this.tbarAlign) {
                    ele = sf.base.closest(innerItems[0], '.' + CLS_ITEMS).children[algIndex];
                    ele.insertBefore(innerEle, ele.children[index]);
                    this.tbarAlgEle[(item.align + 's').toLowerCase()].splice(index, 0, innerEle);
                    this.refreshPositioning();
                }
                else if (innerItems.length === 0) {
                    innerItems = sf.base.selectAll('.' + CLS_ITEMS, this.element);
                    innerItems[0].appendChild(innerEle);
                }
                else {
                    innerItems[0].parentNode.insertBefore(innerEle, innerItems[index]);
                }
                this.items.splice(index, 0, item);
                this.tbarEle.splice(index, 0, innerEle);
                index++;
                this.offsetWid = itemsDiv.offsetWidth;
            }
        }
        itemsDiv.style.width = '';
        this.renderOverflowMode();
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    };
    /**
     * Removes the items from the Toolbar. Acceptable arguments are index of item/HTMLElement/node list.
     * @param  {number|HTMLElement|NodeList|HTMLElement[]} args
     * Index or DOM element or an Array of item which is to be removed from the Toolbar.
     * @returns void.
     * @deprecated
     */
    Toolbar.prototype.removeItems = function (args) {
        var elements = args;
        var index;
        var innerItems = [].slice.call(sf.base.selectAll('.' + CLS_ITEM, this.element));
        if (typeof (elements) === 'number') {
            index = parseInt(args.toString(), 10);
            this.removeItemByIndex(index, innerItems);
        }
        else {
            if (elements && elements.length > 1) {
                for (var _i = 0, _a = [].slice.call(elements); _i < _a.length; _i++) {
                    var ele = _a[_i];
                    index = this.tbarEle.indexOf(ele);
                    this.removeItemByIndex(index, innerItems);
                    innerItems = sf.base.selectAll('.' + CLS_ITEM, this.element);
                }
            }
            else {
                var ele = (elements && elements.length && elements.length === 1) ? elements[0] : args;
                index = innerItems.indexOf(ele);
                this.removeItemByIndex(index, innerItems);
            }
        }
        this.resize();
    };
    Toolbar.prototype.removeItemByIndex = function (index, innerItems) {
        if (this.tbarEle[index] && innerItems[index]) {
            var eleIdx = this.tbarEle.indexOf(innerItems[index]);
            if (this.tbarAlign) {
                var indexAgn = void 0;
                indexAgn = this.tbarAlgEle[(this.items[eleIdx].align + 's').toLowerCase()].indexOf(this.tbarEle[eleIdx]);
                this.tbarAlgEle[(this.items[eleIdx].align + 's').toLowerCase()].splice(indexAgn, 1);
            }
            // tslint:disable-next-line:no-any
            if (this.isReact) {
                this.clearTemplate();
            }
            sf.base.detach(innerItems[index]);
            this.items.splice(eleIdx, 1);
            this.tbarEle.splice(eleIdx, 1);
        }
    };
    Toolbar.prototype.templateRender = function (templateProp, innerEle, item, index) {
        var itemType = item.type;
        var eleObj = templateProp;
        var isComponent;
        if (typeof (templateProp) === 'object') {
            isComponent = typeof (eleObj.appendTo) === 'function';
        }
        if (typeof (templateProp) === 'string' || !isComponent) {
            var templateFn = void 0;
            var val = templateProp;
            val = (typeof (templateProp) === 'string') ? templateProp.trim() : templateProp;
            try {
                if (typeof (templateProp) === 'object' && !sf.base.isNullOrUndefined(templateProp.tagName)) {
                    innerEle.appendChild(templateProp);
                }
                else if (document.querySelectorAll(val).length) {
                    var ele = document.querySelector(val);
                    var tempStr = ele.outerHTML.trim();
                    innerEle.appendChild(ele);
                    ele.style.display = '';
                    if (!sf.base.isNullOrUndefined(tempStr)) {
                        this.tempId.push(val);
                    }
                }
            }
            catch (e) {
                templateFn = sf.base.compile(val);
            }
            var tempArray = void 0;
            if (!sf.base.isNullOrUndefined(templateFn)) {
                var toolbarTemplateID = this.element.id + index + '_template';
                tempArray = templateFn({}, this, 'template', toolbarTemplateID, this.isStringTemplate);
            }
            if (!sf.base.isNullOrUndefined(tempArray) && tempArray.length > 0) {
                [].slice.call(tempArray).forEach(function (ele) {
                    if (!sf.base.isNullOrUndefined(ele.tagName)) {
                        ele.style.display = '';
                    }
                    innerEle.appendChild(ele);
                });
            }
        }
        else if (itemType === 'Input') {
            var ele = this.createElement('input');
            item.id ? (ele.id = item.id) : (ele.id = sf.base.getUniqueID('tbr-ipt'));
            innerEle.appendChild(ele);
            eleObj.appendTo(ele);
        }
        this.add(innerEle, CLS_TEMPLATE);
        this.tbarEle.push(innerEle);
    };
    Toolbar.prototype.buttonRendering = function (item, innerEle) {
        var dom = this.createElement('button', { className: CLS_TBARBTN });
        dom.setAttribute('type', 'button');
        var textStr = item.text;
        var iconCss;
        var iconPos;
        item.id ? (dom.id = item.id) : dom.id = sf.base.getUniqueID('e-tbr-btn');
        var btnTxt = this.createElement('span', { className: 'e-tbar-btn-text' });
        if (textStr) {
            btnTxt.innerHTML = this.enableHtmlSanitizer ? sf.base.SanitizeHtmlHelper.sanitize(textStr) : textStr;
            dom.appendChild(btnTxt);
            dom.classList.add('e-tbtn-txt');
        }
        else {
            this.add(innerEle, 'e-tbtn-align');
        }
        if (item.prefixIcon || item.suffixIcon) {
            if ((item.prefixIcon && item.suffixIcon) || item.prefixIcon) {
                iconCss = item.prefixIcon + ' e-icons';
                iconPos = 'Left';
            }
            else {
                iconCss = item.suffixIcon + ' e-icons';
                iconPos = 'Right';
            }
        }
        var btnObj = new sf.buttons.Button({ iconCss: iconCss, iconPosition: iconPos });
        btnObj.createElement = this.createElement;
        btnObj.appendTo(dom);
        if (item.width) {
            sf.base.setStyleAttribute(dom, { 'width': sf.base.formatUnit(item.width) });
        }
        return dom;
    };
    Toolbar.prototype.renderSubComponent = function (item, index) {
        var innerEle;
        var dom;
        innerEle = this.createElement('div', { className: CLS_ITEM });
        innerEle.setAttribute('aria-disabled', 'false');
        var tempDom = this.createElement('div', {
            innerHTML: this.enableHtmlSanitizer ? sf.base.SanitizeHtmlHelper.sanitize(item.tooltipText) : item.tooltipText
        });
        if (!this.tbarEle) {
            this.tbarEle = [];
        }
        if (item.htmlAttributes) {
            this.setAttr(item.htmlAttributes, innerEle);
        }
        if (item.tooltipText) {
            innerEle.setAttribute('title', tempDom.textContent);
        }
        if (item.cssClass) {
            innerEle.className = innerEle.className + ' ' + item.cssClass;
        }
        if (item.template) {
            this.templateRender(item.template, innerEle, item, index);
        }
        else {
            switch (item.type) {
                case 'Button':
                    dom = this.buttonRendering(item, innerEle);
                    dom.setAttribute('tabindex', '-1');
                    dom.setAttribute('aria-label', (item.text || item.tooltipText));
                    innerEle.appendChild(dom);
                    innerEle.addEventListener('click', this.itemClick.bind(this));
                    break;
                case 'Separator':
                    this.add(innerEle, CLS_SEPARATOR);
                    break;
            }
        }
        if (item.showTextOn) {
            var sTxt = item.showTextOn;
            if (sTxt === 'Toolbar') {
                this.add(innerEle, CLS_POPUPTEXT);
                this.add(innerEle, 'e-tbtn-align');
            }
            else if (sTxt === 'Overflow') {
                this.add(innerEle, CLS_TBARTEXT);
            }
        }
        if (item.overflow) {
            var overflow = item.overflow;
            if (overflow === 'Show') {
                this.add(innerEle, CLS_TBAROVERFLOW);
            }
            else if (overflow === 'Hide') {
                if (!innerEle.classList.contains(CLS_SEPARATOR)) {
                    this.add(innerEle, CLS_POPOVERFLOW);
                }
            }
        }
        if (item.overflow !== 'Show' && item.showAlwaysInPopup && !innerEle.classList.contains(CLS_SEPARATOR)) {
            this.add(innerEle, CLS_POPPRI);
            this.popupPriCount++;
        }
        if (item.disabled) {
            this.add(innerEle, CLS_DISABLE);
        }
        if (item.visible === false) {
            this.add(innerEle, CLS_HIDDEN);
        }
        return innerEle;
    };
    Toolbar.prototype.itemClick = function (e) {
        this.activeEleSwitch(e.currentTarget);
    };
    Toolbar.prototype.activeEleSwitch = function (ele) {
        this.activeEleRemove(ele.firstElementChild);
        this.activeEle.focus();
    };
    Toolbar.prototype.activeEleRemove = function (curEle) {
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
    Toolbar.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    Toolbar.prototype.getModuleName = function () {
        return 'toolbar';
    };
    Toolbar.prototype.itemsRerender = function (newProp) {
        this.items = this.tbarItemsCol;
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.clearTemplate();
        }
        this.destroyMode();
        this.destroyItems();
        this.items = newProp;
        this.tbarItemsCol = this.items;
        this.renderItems();
        this.renderOverflowMode();
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    };
    Toolbar.prototype.resize = function () {
        var ele = this.element;
        this.tbResize = true;
        if (this.tbarAlign) {
            this.itemPositioning();
        }
        if (this.popObj && this.overflowMode === 'Popup') {
            this.popObj.hide();
        }
        var checkOverflow = this.checkOverflow(ele, ele.getElementsByClassName(CLS_ITEMS)[0]);
        if (!checkOverflow) {
            this.destroyScroll();
            var multirowele = ele.querySelector('.' + CLS_ITEMS);
            if (!sf.base.isNullOrUndefined(multirowele)) {
                this.remove(multirowele, CLS_MULTIROWPOS);
                if (this.tbarAlign) {
                    this.add(multirowele, CLS_TBARPOS);
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
            if (this.overflowMode === 'Extended') {
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
        if (this.element.querySelector('.' + CLS_HSCROLLBAR)) {
            this.scrollStep = this.element.querySelector('.' + CLS_HSCROLLBAR).offsetWidth;
        }
        this.offsetWid = ele.offsetWidth;
        this.tbResize = false;
        this.separator();
    };
    Toolbar.prototype.extendedOpen = function () {
        var sib = this.element.querySelector('.' + CLS_EXTENDABLECLASS);
        if (this.overflowMode === 'Extended' && sib) {
            this.isExtendedOpen = sib.classList.contains(CLS_POPUPOPEN);
        }
    };
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     * @param  {ToolbarModel} newProp
     * @param  {ToolbarModel} oldProp
     * @returns void
     * @private
     */
    Toolbar.prototype.onPropertyChanged = function (newProp, oldProp) {
        var tEle = this.element;
        this.extendedOpen();
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'items':
                    if (!(newProp.items instanceof Array && oldProp.items instanceof Array) && !this.isServerRendered) {
                        var changedProb = Object.keys(newProp.items);
                        for (var i = 0; i < changedProb.length; i++) {
                            var index = parseInt(Object.keys(newProp.items)[i], 10);
                            var property = Object.keys(newProp.items[index])[0];
                            var newProperty = Object(newProp.items[index])[property];
                            if (this.tbarAlign || property === 'align') {
                                this.refresh();
                                this.trigger('created');
                                break;
                            }
                            var popupPriCheck = property === 'showAlwaysInPopup' && !newProperty;
                            var booleanCheck = property === 'overflow' && this.popupPriCount !== 0;
                            if ((popupPriCheck) || (this.items[index].showAlwaysInPopup) && booleanCheck) {
                                --this.popupPriCount;
                            }
                            if (sf.base.isNullOrUndefined(this.scrollModule)) {
                                this.destroyMode();
                            }
                            var itemCol = [].slice.call(sf.base.selectAll('.' + CLS_ITEMS + ' .' + CLS_ITEM, tEle));
                            // tslint:disable-next-line:no-any
                            if (this.isReact) {
                                this.clearTemplate();
                            }
                            sf.base.detach(itemCol[index]);
                            this.tbarEle.splice(index, 1);
                            this.addItems([this.items[index]], index);
                            this.items.splice(index, 1);
                            if (this.items[index].template) {
                                this.tbarEle.splice(this.items.length, 1);
                            }
                        }
                    }
                    else if (sf.base.isBlazor() && this.isServerRendered) {
                        this.serverItemsRerender();
                        this.notify('onItemsChanged', {});
                    }
                    else {
                        this.itemsRerender(newProp.items);
                    }
                    break;
                case 'width':
                    var wid = tEle.offsetWidth;
                    sf.base.setStyleAttribute(tEle, { 'width': sf.base.formatUnit(newProp.width) });
                    this.renderOverflowMode();
                    if (this.popObj && wid < tEle.offsetWidth) {
                        this.popupRefresh(this.popObj.element, false);
                    }
                    break;
                case 'height':
                    sf.base.setStyleAttribute(this.element, { 'height': sf.base.formatUnit(newProp.height) });
                    break;
                case 'overflowMode':
                    this.destroyMode();
                    this.renderOverflowMode();
                    if (this.enableRtl) {
                        this.add(tEle, CLS_RTL);
                    }
                    this.refreshOverflow();
                    break;
                case 'enableRtl':
                    newProp.enableRtl ? this.add(tEle, CLS_RTL) : this.remove(tEle, CLS_RTL);
                    if (!sf.base.isNullOrUndefined(this.scrollModule)) {
                        newProp.enableRtl ? this.add(this.scrollModule.element, CLS_RTL) : this.remove(this.scrollModule.element, CLS_RTL);
                    }
                    if (!sf.base.isNullOrUndefined(this.popObj)) {
                        newProp.enableRtl ? this.add(this.popObj.element, CLS_RTL) : this.remove(this.popObj.element, CLS_RTL);
                    }
                    if (this.tbarAlign) {
                        this.itemPositioning();
                    }
                    break;
                case 'scrollStep':
                    if (this.scrollModule) {
                        this.scrollModule.scrollStep = this.scrollStep;
                    }
                    break;
                case 'enableCollision':
                    if (this.popObj) {
                        this.popObj.collision = { Y: this.enableCollision ? 'flip' : 'none' };
                    }
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        sf.base.removeClass([this.element], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        sf.base.addClass([this.element], newProp.cssClass.split(' '));
                    }
                    break;
                case 'allowKeyboard':
                    this.unwireKeyboardEvent();
                    if (newProp.allowKeyboard) {
                        this.wireKeyboardEvent();
                    }
                    break;
            }
        }
    };
    /**
     * Shows or hides the Toolbar item that is in the specified index.
     * @param  {number | HTMLElement} index - Index value of target item or DOM element  of items to be hidden or shown.
     * @param  {boolean} value - Based on this Boolean value, item will be hide (true) or show (false). By default, value is false.
     * @returns void.
     */
    Toolbar.prototype.hideItem = function (index, value) {
        var isElement = (typeof (index) === 'object') ? true : false;
        var eleIndex = index;
        var initIndex;
        var ele;
        var innerItems = [].slice.call(sf.base.selectAll('.' + CLS_ITEM, this.element));
        if (isElement) {
            ele = index;
        }
        else if (this.tbarEle[eleIndex]) {
            var innerItems_1 = [].slice.call(sf.base.selectAll('.' + CLS_ITEM, this.element));
            ele = innerItems_1[eleIndex];
        }
        if (ele) {
            value ? ele.classList.add(CLS_HIDDEN) : ele.classList.remove(CLS_HIDDEN);
            if (value && sf.base.isNullOrUndefined(this.element.getAttribute('tabindex')) && !ele.classList.contains(CLS_SEPARATOR)) {
                if (sf.base.isNullOrUndefined(ele.firstElementChild.getAttribute('tabindex'))) {
                    ele.firstElementChild.setAttribute('tabindex', '-1');
                    var innerItems_2 = [].slice.call(sf.base.selectAll('.' + CLS_ITEM, this.element));
                    if (isElement) {
                        eleIndex = innerItems_2.indexOf(ele);
                    }
                    var nextEle = innerItems_2[++eleIndex];
                    while (nextEle) {
                        var skipEle = this.eleContains(nextEle);
                        if (!skipEle) {
                            nextEle.firstElementChild.removeAttribute('tabindex');
                            break;
                        }
                        nextEle = innerItems_2[++eleIndex];
                    }
                }
            }
            else if (sf.base.isNullOrUndefined(this.element.getAttribute('tabindex')) && !ele.classList.contains(CLS_SEPARATOR)) {
                initIndex = 0;
                var setFlag = false;
                var removeFlag = false;
                var initELe = innerItems[initIndex];
                while (initELe) {
                    if (!initELe.classList.contains(CLS_SEPARATOR)) {
                        if (sf.base.isNullOrUndefined(initELe.firstElementChild.getAttribute('tabindex'))) {
                            initELe.firstElementChild.setAttribute('tabindex', '-1');
                            setFlag = true;
                        }
                        else {
                            if (setFlag && removeFlag) {
                                break;
                            }
                            var skipEle = this.eleContains(initELe);
                            if (!skipEle) {
                                initELe.firstElementChild.removeAttribute('tabindex');
                                removeFlag = true;
                            }
                            initELe = innerItems[++initIndex];
                        }
                    }
                    else {
                        initELe = innerItems[++initIndex];
                    }
                }
            }
            this.refreshOverflow();
        }
    };
    __decorate([
        sf.base.Collection([], Item)
    ], Toolbar.prototype, "items", void 0);
    __decorate([
        sf.base.Property('auto')
    ], Toolbar.prototype, "width", void 0);
    __decorate([
        sf.base.Property('auto')
    ], Toolbar.prototype, "height", void 0);
    __decorate([
        sf.base.Property('')
    ], Toolbar.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property('Scrollable')
    ], Toolbar.prototype, "overflowMode", void 0);
    __decorate([
        sf.base.Property()
    ], Toolbar.prototype, "scrollStep", void 0);
    __decorate([
        sf.base.Property(true)
    ], Toolbar.prototype, "enableCollision", void 0);
    __decorate([
        sf.base.Property(true)
    ], Toolbar.prototype, "enableHtmlSanitizer", void 0);
    __decorate([
        sf.base.Property(true)
    ], Toolbar.prototype, "allowKeyboard", void 0);
    __decorate([
        sf.base.Event()
    ], Toolbar.prototype, "clicked", void 0);
    __decorate([
        sf.base.Event()
    ], Toolbar.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], Toolbar.prototype, "destroyed", void 0);
    __decorate([
        sf.base.Event()
    ], Toolbar.prototype, "beforeCreate", void 0);
    Toolbar = __decorate([
        sf.base.NotifyPropertyChanges
    ], Toolbar);
    return Toolbar;
}(sf.base.Component));

/**
 * Toolbar modules
 */

exports.Item = Item;
exports.Toolbar = Toolbar;

return exports;

});

    sf.navigations = sf.base.extend({}, sf.navigations, sftoolbar({}));