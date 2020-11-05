window.sf = window.sf || {};
var sfsplitbutton = (function (exports) {
'use strict';

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
var classNames = {
    DISABLED: 'e-disabled',
    FOCUS: 'e-focused',
    ICON: 'e-menu-icon',
    ITEM: 'e-item',
    POPUP: 'e-dropdown-popup',
    RTL: 'e-rtl',
    SEPARATOR: 'e-separator',
    VERTICAL: 'e-vertical'
};
/**
 * DropDownButton component is used to toggle contextual overlays for displaying list of action items.
 * It can contain both text and images.
 * ```html
 * <button id="element">DropDownButton</button>
 * ```
 * ```typescript
 * <script>
 * var dropDownButtonObj = new DropDownButton({items: [{ text: 'Action1' }, { text: 'Action2' },{ text: 'Action3' }]);
 * dropDownButtonObj.appendTo("#element");
 * </script>
 * ```
 */
var DropDownButton = /** @class */ (function (_super) {
    __extends$1(DropDownButton, _super);
    /**
     * Constructor for creating the widget
     * @param  {DropDownButtonModel} options?
     * @param  {string|HTMLButtonElement} element?
     */
    function DropDownButton(options, element) {
        return _super.call(this, options, element) || this;
    }
    DropDownButton.prototype.preRender = function () {
        /** */
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    DropDownButton.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * To open/close DropDownButton popup based on current state of the DropDownButton.
     * @returns void
     */
    DropDownButton.prototype.toggle = function () {
        this.canOpen() ? this.openPopUp() : this.closePopup();
    };
    /**
     * Initialize the Component rendering
     * @returns void
     * @private
     */
    DropDownButton.prototype.render = function () {
        this.initialize();
        if (!this.disabled) {
            this.wireEvents();
        }
        this.renderComplete();
    };
    /**
     * Adds a new item to the menu. By default, new item appends to the list as the last item,
     * but you can insert based on the text parameter.
     * @param  { ItemModel[] } items - Specifies an array of JSON data.
     * @param { string } text - Specifies the text to insert the newly added item in the menu.
     * @returns {void}.
     */
    DropDownButton.prototype.addItems = function (items, text) {
        var newItem;
        var idx = this.items.length;
        for (var j = 0, len = this.items.length; j < len; j++) {
            if (text === this.items[j].text) {
                idx = j;
                break;
            }
        }
        for (var i = items.length - 1; i >= 0; i--) {
            // tslint:disable-next-line
            newItem = new sf.splitbuttons.Item(this, 'items', items[i], true);
            this.items.splice(idx, 0, newItem);
        }
        if (!this.canOpen()) {
            this.createItems();
        }
    };
    /**
     * Removes the items from the menu.
     * @param  { string[] } items - Specifies an array of string to remove the items.
     * @param { string } isUniqueId - Set `true` if specified items is a collection of unique id.
     * @returns {void}.
     */
    DropDownButton.prototype.removeItems = function (items, isUniqueId) {
        var refresh = false;
        for (var i = 0, len = items.length; i < len; i++) {
            for (var j = 0, len_1 = this.items.length; j < len_1; j++) {
                if (items[i] === (isUniqueId ? this.items[j].id : this.items[j].text)) {
                    this.items.splice(j, 1);
                    refresh = true;
                    break;
                }
            }
        }
        if (refresh && this.getULElement()) {
            this.createItems();
        }
    };
    DropDownButton.prototype.createPopup = function () {
        var _a;
        var div = this.createElement('div', {
            className: classNames.POPUP,
            id: this.element.id + '-popup'
        });
        document.body.appendChild(div);
        this.dropDown = new sf.popups.Popup(div, {
            relateTo: this.element,
            collision: { X: 'fit', Y: 'flip' },
            position: { X: 'left', Y: 'bottom' },
            targetType: 'relative',
            content: this.target ? this.getTargetElement() : '',
            enableRtl: this.enableRtl
        });
        if (this.dropDown.element.style.position === 'fixed') {
            this.dropDown.refreshPosition(this.element);
        }
        this.dropDown.hide();
        sf.base.attributes(this.element, (_a = {}, _a['aria-haspopup'] = this.items.length || this.target ? 'true' : 'false', _a['aria-expanded'] = 'false', _a['aria-owns'] = this.getPopUpElement().id, _a['type'] = 'button', _a['aria-label'] = this.element.textContent + ' dropdownbutton', _a));
        if (this.cssClass) {
            sf.base.addClass([div], this.cssClass.split(' '));
        }
    };
    DropDownButton.prototype.getTargetElement = function () {
        return typeof (this.target) === 'string' ? sf.base.select(this.target) : this.target;
    };
    DropDownButton.prototype.createItems = function (appendItems) {
        var items = this.items;
        var showIcon = this.hasIcon(this.items, 'iconCss');
        var span;
        var item;
        var li;
        var eventArgs;
        var ul = this.getULElement();
        if (ul) {
            ul.innerHTML = '';
        }
        else {
            ul = this.createElement('ul', {
                attrs: { 'role': 'menu', 'tabindex': '0' }
            });
        }
        for (var i = 0; i < items.length; i++) {
            item = items[i];
            var tempItem = (this.enableHtmlSanitizer) ? sf.base.SanitizeHtmlHelper.sanitize(item.text) : item.text;
            li = this.createElement('li', {
                innerHTML: item.url ? '' : tempItem,
                className: item.separator ? classNames.ITEM + ' ' + classNames.SEPARATOR : classNames.ITEM,
                attrs: { 'role': 'menuItem', 'tabindex': '-1' },
                id: item.id ? item.id : sf.base.getUniqueID('e-' + this.getModuleName() + '-item')
            });
            if (item.url) {
                li.appendChild(this.createAnchor(item));
                li.classList.add('e-url');
            }
            if (item.iconCss) {
                span = this.createElement('span', { className: classNames.ICON + ' ' + item.iconCss });
                (item.url) ? li.childNodes[0].appendChild(span) : li.insertBefore(span, li.childNodes[0]);
            }
            else {
                if (showIcon && !item.separator) {
                    li.classList.add('e-blank-icon');
                }
            }
            eventArgs = { item: item, element: li };
            this.trigger('beforeItemRender', eventArgs);
            ul.appendChild(li);
        }
        if (appendItems) {
            this.getPopUpElement().appendChild(ul);
        }
        if (showIcon) {
            sf.splitbuttons.setBlankIconStyle(this.getPopUpElement());
        }
    };
    DropDownButton.prototype.hasIcon = function (items, field) {
        for (var i = 0, len = items.length; i < len; i++) {
            if (items[i][field]) {
                return true;
            }
        }
        return false;
    };
    DropDownButton.prototype.createAnchor = function (item) {
        var tempItem = (this.enableHtmlSanitizer) ? sf.base.SanitizeHtmlHelper.sanitize(item.text) : item.text;
        return this.createElement('a', { className: 'e-menu-text e-menu-url', innerHTML: tempItem, attrs: { 'href': item.url } });
    };
    DropDownButton.prototype.initialize = function () {
        this.button = new sf.buttons.Button({
            iconCss: this.iconCss, iconPosition: this.iconPosition, cssClass: this.cssClass, content: this.content,
            disabled: this.disabled, enableRtl: this.enableRtl, enablePersistence: this.enablePersistence
        });
        this.button.createElement = this.createElement;
        this.button.appendTo(this.element);
        if (!this.element.id) {
            this.element.id = sf.base.getUniqueID('e-' + this.getModuleName());
        }
        this.appendArrowSpan();
        this.createPopup();
        this.setActiveElem([this.element]);
    };
    DropDownButton.prototype.appendArrowSpan = function () {
        this.element.appendChild(this.createElement('span', {
            className: 'e-btn-icon e-icons ' + 'e-icon-' + (this.cssClass.indexOf(classNames.VERTICAL) > -1
                ? 'bottom' : 'right') + ' e-caret'
        }));
    };
    DropDownButton.prototype.setActiveElem = function (elem) {
        this.activeElem = elem;
    };
    /**
     * Get component name.
     * @returns string
     * @private
     */
    DropDownButton.prototype.getModuleName = function () {
        return 'dropdown-btn';
    };
    DropDownButton.prototype.canOpen = function () {
        return this.getPopUpElement().classList.contains('e-popup-close');
    };
    /**
     * Destroys the widget.
     * @returns void
     */
    DropDownButton.prototype.destroy = function () {
        var _this = this;
        _super.prototype.destroy.call(this);
        if (this.getModuleName() === 'dropdown-btn') {
            var attrList = void 0;
            var classList_1;
            if (this.element.querySelector('span.e-caret')) {
                sf.base.detach(this.element.querySelector('span.e-caret'));
            }
            if (this.cssClass) {
                classList_1 = this.cssClass.split(' ');
            }
            this.button.destroy();
            if (classList_1) {
                sf.base.removeClass([this.element], classList_1);
            }
            sf.base.removeClass(this.activeElem, ['e-active']);
            attrList = this.element.getAttribute('class') ? ['aria-haspopup', 'aria-expanded', 'aria-owns', 'type']
                : ['aria-haspopup', 'aria-expanded', 'aria-owns', 'type', 'class'];
            attrList.forEach(function (key) {
                _this.element.removeAttribute(key);
            });
            this.dropDown.destroy();
            var popupEle = document.getElementById(this.getPopUpElement().id);
            if (popupEle) {
                sf.base.removeClass([popupEle], ['e-popup-open', 'e-popup-close']);
                sf.base.detach(popupEle);
            }
            if (!this.disabled) {
                this.unWireEvents();
            }
        }
    };
    DropDownButton.prototype.getPopUpElement = function () {
        return this.dropDown.element;
    };
    DropDownButton.prototype.getULElement = function () {
        return this.getPopUpElement().children[0];
    };
    DropDownButton.prototype.wireEvents = function () {
        var popupElement = this.getPopUpElement();
        this.delegateMousedownHandler = this.mousedownHandler.bind(this);
        sf.base.EventHandler.add(document, 'mousedown touchstart', this.delegateMousedownHandler, this);
        sf.base.EventHandler.add(this.element, 'click', this.clickHandler, this);
        sf.base.EventHandler.add(popupElement, 'click', this.clickHandler, this);
        sf.base.EventHandler.add(this.element, 'keydown', this.keyBoardHandler, this);
        sf.base.EventHandler.add(popupElement, 'keydown', this.keyBoardHandler, this);
        this.rippleFn = sf.base.rippleEffect(popupElement, { selector: '.' + classNames.ITEM });
    };
    /** @hidden */
    DropDownButton.prototype.keyBoardHandler = function (e) {
        if (e.target === this.element && (e.keyCode === 9 || (!e.altKey && e.keyCode === 40) || e.keyCode === 38)) {
            return;
        }
        switch (e.keyCode) {
            case 38:
            case 40:
                if (e.altKey && (e.keyCode === 38 || e.keyCode === 40)) {
                    this.keyEventHandler(e);
                }
                else {
                    this.upDownKeyHandler(e);
                }
                break;
            case 9:
            case 13:
            case 27:
            case 32:
                this.keyEventHandler(e);
                break;
        }
    };
    DropDownButton.prototype.upDownKeyHandler = function (e) {
        if (this.target && (e.keyCode === 38 || e.keyCode === 40)) {
            return;
        }
        e.preventDefault();
        sf.splitbuttons.upDownKeyHandler(this.getULElement(), e.keyCode);
    };
    DropDownButton.prototype.keyEventHandler = function (e) {
        if (this.target && (e.keyCode === 13 || e.keyCode === 9)) {
            return;
        }
        if (e.keyCode !== 9) {
            e.preventDefault();
        }
        if (e.keyCode === 27 || e.keyCode === 38 || e.keyCode === 9) {
            if (!this.canOpen()) {
                this.closePopup(e, this.element);
            }
        }
        else {
            this.clickHandler(e);
        }
    };
    DropDownButton.prototype.getLI = function (elem) {
        return elem.tagName === 'LI' ? elem : sf.base.closest(elem, 'li');
    };
    DropDownButton.prototype.mousedownHandler = function (e) {
        var trgt = e.target;
        if (!this.canOpen() && !(sf.base.closest(trgt, '#' + this.getPopUpElement().id) || sf.base.closest(trgt, '#' + this.element.id))) {
            this.closePopup(e);
        }
    };
    DropDownButton.prototype.clickHandler = function (e) {
        var trgt = e.target;
        var canOpen = this.canOpen();
        if (sf.base.closest(trgt, '#' + this.element.id)) {
            if (canOpen) {
                this.openPopUp(e);
            }
            else {
                this.closePopup(e, this.activeElem[0]);
            }
        }
        else {
            if (sf.base.closest(trgt, '#' + this.getPopUpElement().id)) {
                var eventArgs = void 0;
                var liIdx = void 0;
                var item = void 0;
                var li = this.getLI(trgt);
                if (li) {
                    liIdx = Array.prototype.indexOf.call(this.getULElement().children, li);
                    item = this.items[liIdx];
                    if (item) {
                        eventArgs = { element: li, item: item };
                        this.trigger('select', eventArgs);
                    }
                    this.closePopup(e, this.activeElem[0]);
                }
            }
        }
    };
    DropDownButton.prototype.openPopUp = function (e) {
        var _this = this;
        if (e === void 0) { e = null; }
        if (!this.target) {
            this.createItems(true);
        }
        var ul = this.getULElement();
        var beforeOpenArgs = { element: ul, items: this.items, event: e, cancel: false };
        this.trigger('beforeOpen', beforeOpenArgs, function (observedArgs) {
            if (!observedArgs.cancel) {
                var ul_1 = _this.getULElement();
                _this.dropDown.show(null, _this.element);
                sf.base.addClass([_this.element], 'e-active');
                _this.element.setAttribute('aria-expanded', 'true');
                ul_1.focus();
                var openArgs = { element: ul_1, items: _this.items };
                _this.trigger('open', openArgs);
            }
        });
    };
    DropDownButton.prototype.closePopup = function (e, focusEle) {
        var _this = this;
        if (e === void 0) { e = null; }
        var ul = this.getULElement();
        var beforeCloseArgs = { element: ul, items: this.items, event: e, cancel: false };
        this.trigger('beforeClose', beforeCloseArgs, function (observedArgs) {
            if (!observedArgs.cancel) {
                var ul_2 = _this.getULElement();
                var selectedLi = ul_2.querySelector('.e-selected');
                if (selectedLi) {
                    selectedLi.classList.remove('e-selected');
                }
                _this.dropDown.hide();
                sf.base.removeClass(_this.activeElem, 'e-active');
                _this.element.setAttribute('aria-expanded', 'false');
                if (focusEle) {
                    focusEle.focus();
                }
                var closeArgs = { element: ul_2, items: _this.items };
                _this.trigger('close', closeArgs);
                if (!_this.target && ul_2) {
                    sf.base.detach(ul_2);
                }
            }
        });
    };
    DropDownButton.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(document, 'mousedown touchstart', this.delegateMousedownHandler);
        sf.base.EventHandler.remove(this.element, 'click', this.clickHandler);
        sf.base.EventHandler.remove(this.getPopUpElement(), 'click', this.clickHandler);
        sf.base.EventHandler.remove(this.element, 'keydown', this.keyBoardHandler);
        sf.base.EventHandler.remove(this.getPopUpElement(), 'keydown', this.keyBoardHandler);
        this.rippleFn();
    };
    /**
     * Called internally if any of the property value changed.
     * @param  {DropDownButtonModel} newProp
     * @param  {DropDownButtonModel} oldProp
     * @returns void
     * @private
     */
    DropDownButton.prototype.onPropertyChanged = function (newProp, oldProp) {
        var btnModel = ['content', 'cssClass', 'iconCss', 'iconPosition', 'disabled', 'enableRtl'];
        this.button.setProperties(sf.splitbuttons.getModel(newProp, btnModel));
        this.dropDown.setProperties(sf.splitbuttons.getModel(newProp, ['enableRtl']));
        var popupElement = this.getPopUpElement();
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'content':
                    if (!this.element.querySelector('span.e-caret')) {
                        this.appendArrowSpan();
                    }
                    break;
                case 'disabled':
                    if (newProp.disabled) {
                        this.unWireEvents();
                        if (!this.canOpen()) {
                            this.closePopup();
                        }
                    }
                    else {
                        this.wireEvents();
                    }
                    break;
                case 'cssClass':
                    if (newProp.cssClass.indexOf(classNames.VERTICAL) > -1) {
                        var arrowSpan = this.element.querySelector('span.e-caret');
                        sf.base.classList(arrowSpan, ['e-icon-bottom'], ['e-icon-right']);
                    }
                    if (oldProp.cssClass) {
                        sf.base.removeClass([popupElement], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        sf.base.addClass([popupElement], newProp.cssClass.split(' '));
                    }
                    break;
                case 'target':
                    this.dropDown.content = this.getTargetElement();
                    this.dropDown.dataBind();
                    break;
                case 'items':
                    if (this.getULElement()) {
                        this.createItems();
                    }
                    break;
            }
        }
    };
    /**
     * Sets the focus to DropDownButton
     * its native method
     * @public
     */
    DropDownButton.prototype.focusIn = function () {
        this.element.focus();
    };
    __decorate$1([
        sf.base.Property('')
    ], DropDownButton.prototype, "content", void 0);
    __decorate$1([
        sf.base.Property('')
    ], DropDownButton.prototype, "cssClass", void 0);
    __decorate$1([
        sf.base.Property(false)
    ], DropDownButton.prototype, "disabled", void 0);
    __decorate$1([
        sf.base.Property('')
    ], DropDownButton.prototype, "iconCss", void 0);
    __decorate$1([
        sf.base.Property('Left')
    ], DropDownButton.prototype, "iconPosition", void 0);
    __decorate$1([
        sf.base.Property(false)
    ], DropDownButton.prototype, "enableHtmlSanitizer", void 0);
    __decorate$1([
        sf.base.Collection([], sf.splitbuttons.Item)
    ], DropDownButton.prototype, "items", void 0);
    __decorate$1([
        sf.base.Property('')
    ], DropDownButton.prototype, "target", void 0);
    __decorate$1([
        sf.base.Event()
    ], DropDownButton.prototype, "beforeItemRender", void 0);
    __decorate$1([
        sf.base.Event()
    ], DropDownButton.prototype, "beforeOpen", void 0);
    __decorate$1([
        sf.base.Event()
    ], DropDownButton.prototype, "beforeClose", void 0);
    __decorate$1([
        sf.base.Event()
    ], DropDownButton.prototype, "close", void 0);
    __decorate$1([
        sf.base.Event()
    ], DropDownButton.prototype, "open", void 0);
    __decorate$1([
        sf.base.Event()
    ], DropDownButton.prototype, "select", void 0);
    __decorate$1([
        sf.base.Event()
    ], DropDownButton.prototype, "created", void 0);
    DropDownButton = __decorate$1([
        sf.base.NotifyPropertyChanges
    ], DropDownButton);
    return DropDownButton;
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
/// <reference path='../drop-down-button/drop-down-button-model.d.ts'/>
var RTL = 'e-rtl';
var TAGNAME = 'EJS-SPLITBUTTON';
/**
 * SplitButton component has primary and secondary button. Primary button is used to select
 * default action and secondary button is used to toggle contextual overlays for displaying list of
 * action items. It can contain both text and images.
 * ```html
 * <button id="element"></button>
 * ```
 * ```typescript
 * <script>
 * var splitBtnObj = new SplitButton({content: 'SplitButton'});
 * splitBtnObj.appendTo("#element");
 * </script>
 * ```
 */
var SplitButton = /** @class */ (function (_super) {
    __extends(SplitButton, _super);
    /**
     * Constructor for creating the widget
     * @param  {SplitButtonModel} options?
     * @param  {string|HTMLButtonElement} element?
     */
    function SplitButton(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Initialize Angular support.
     * @private
     */
    SplitButton.prototype.preRender = function () {
        var ele = this.element;
        if (ele.tagName === TAGNAME) {
            var ejInstance = sf.base.getValue('ej2_instances', ele);
            var btn = this.createElement('button', { attrs: { 'type': 'button' } });
            var wrapper = this.createElement(TAGNAME, { className: 'e-' + this.getModuleName() + '-wrapper' });
            for (var idx = 0, len = ele.attributes.length; idx < len; idx++) {
                btn.setAttribute(ele.attributes[idx].nodeName, ele.attributes[idx].nodeValue);
            }
            ele.parentNode.insertBefore(wrapper, ele);
            sf.base.detach(ele);
            ele = btn;
            wrapper.appendChild(ele);
            sf.base.setValue('ej2_instances', ejInstance, ele);
            this.wrapper = wrapper;
            this.element = ele;
        }
        if (!this.element.id) {
            this.element.id = sf.base.getUniqueID('e-' + this.getModuleName());
        }
    };
    /**
     * Initialize the Component rendering
     * @returns void
     * @private
     */
    SplitButton.prototype.render = function () {
        this.initWrapper();
        this.createPrimaryButton();
        this.renderControl();
    };
    SplitButton.prototype.renderControl = function () {
        this.createSecondaryButton();
        this.setActiveElem([this.element, this.secondaryBtnObj.element]);
        this.setAria();
        this.wireEvents();
        this.renderComplete();
    };
    /**
     * Adds a new item to the menu. By default, new item appends to the list as the last item,
     * but you can insert based on the text parameter.
     * @param  { ItemModel[] } items - Specifies an array of JSON data.
     * @param { string } text - Specifies the text to insert the newly added item in the menu.
     * @returns {void}.
     */
    SplitButton.prototype.addItems = function (items, text) {
        _super.prototype.addItems.call(this, items, text);
        this.secondaryBtnObj.items = this.items;
    };
    /**
     * Removes the items from the menu.
     * @param  { string[] } items - Specifies an array of string to remove the items.
     * @param { string } isUniqueId - Set `true` if specified items is a collection of unique id.
     * @returns {void}.
     */
    SplitButton.prototype.removeItems = function (items, isUniqueId) {
        _super.prototype.removeItems.call(this, items, isUniqueId);
        this.secondaryBtnObj.items = this.items;
    };
    SplitButton.prototype.initWrapper = function () {
        if (!this.wrapper) {
            this.wrapper = this.createElement('div', { className: 'e-' + this.getModuleName() + '-wrapper' });
            this.element.parentNode.insertBefore(this.wrapper, this.element);
        }
        this.element.classList.remove('e-' + this.getModuleName());
        if (this.enableRtl) {
            this.wrapper.classList.add(RTL);
        }
        if (this.cssClass) {
            sf.base.addClass([this.wrapper], this.cssClass.split(' '));
        }
    };
    SplitButton.prototype.createPrimaryButton = function () {
        var btnModel = {
            cssClass: this.cssClass,
            enableRtl: this.enableRtl,
            iconCss: this.iconCss,
            iconPosition: this.iconPosition,
            content: this.content,
            disabled: this.disabled
        };
        this.primaryBtnObj = new sf.buttons.Button(btnModel);
        this.primaryBtnObj.createElement = this.createElement;
        this.primaryBtnObj.appendTo(this.element);
        this.element.classList.add('e-' + this.getModuleName());
        this.element.type = 'button';
        this.wrapper.appendChild(this.element);
    };
    SplitButton.prototype.createSecondaryButton = function () {
        var _this = this;
        var dropDownBtnModel;
        var btnElem;
        btnElem = this.createElement('button', {
            className: 'e-icon-btn',
            attrs: { 'tabindex': '-1' },
            id: this.element.id + '_dropdownbtn'
        });
        this.wrapper.appendChild(btnElem);
        dropDownBtnModel = {
            cssClass: this.cssClass,
            disabled: this.disabled,
            enableRtl: this.enableRtl,
            items: this.items,
            target: this.target,
        };
        dropDownBtnModel.beforeItemRender = function (args) {
            _this.trigger('beforeItemRender', args);
        };
        dropDownBtnModel.open = function (args) {
            _this.trigger('open', args);
        };
        dropDownBtnModel.close = function (args) {
            _this.trigger('close', args);
        };
        dropDownBtnModel.select = function (args) {
            _this.trigger('select', args);
        };
        dropDownBtnModel.beforeOpen = function (args) {
            var callBackPromise = new Deferred();
            _this.trigger('beforeOpen', args, function (observedArgs) {
                callBackPromise.resolve(observedArgs);
            });
            return callBackPromise;
        };
        dropDownBtnModel.beforeClose = function (args) {
            var callBackPromise = new Deferred();
            _this.trigger('beforeClose', args, function (observedArgs) {
                callBackPromise.resolve(observedArgs);
            });
            return callBackPromise;
        };
        this.secondaryBtnObj = new DropDownButton(dropDownBtnModel);
        this.secondaryBtnObj.createElement = this.createElement;
        this.secondaryBtnObj.appendTo(btnElem);
        this.secondaryBtnObj.dropDown.relateTo = this.wrapper;
        this.dropDown = this.secondaryBtnObj.dropDown;
        this.secondaryBtnObj.activeElem = [this.element, this.secondaryBtnObj.element];
        sf.base.EventHandler.remove(this.getPopUpElement(), 'keydown', this.secondaryBtnObj.keyBoardHandler);
        this.secondaryBtnObj.element.querySelector('.e-btn-icon').classList.remove('e-icon-right');
    };
    SplitButton.prototype.setAria = function () {
        sf.base.attributes(this.element, {
            'aria-expanded': 'false', 'aria-haspopup': 'true',
            'aria-label': this.element.textContent + ' splitbutton', 'aria-owns': this.secondaryBtnObj.dropDown.element.id
        });
    };
    /**
     * Get component name.
     * @returns string
     * @private
     */
    SplitButton.prototype.getModuleName = function () {
        return 'split-btn';
    };
    /**
     * To open/close SplitButton popup based on current state of the SplitButton.
     * @returns void
     */
    SplitButton.prototype.toggle = function () {
        this.secondaryBtnObj.toggle();
    };
    SplitButton.prototype.destroy = function () {
        var _this = this;
        var classList$$1 = [RTL];
        var element = document.getElementById(this.element.id);
        if (this.cssClass) {
            classList$$1 = classList$$1.concat(this.cssClass.split(' '));
        }
        if (element && element.parentElement === this.wrapper) {
            if (this.wrapper.tagName === TAGNAME) {
                this.wrapper.innerHTML = '';
                sf.base.removeClass([this.wrapper], ['e-rtl', 'e-' + this.getModuleName() + '-wrapper']);
                sf.base.removeClass([this.wrapper], this.cssClass.split(' '));
            }
            else {
                sf.base.removeClass([this.element], classList$$1);
                ['aria-label', 'aria-haspopup', 'aria-expanded',
                    'aria-owns', 'type'].forEach(function (key) {
                    _this.element.removeAttribute(key);
                });
                this.wrapper.parentNode.insertBefore(this.element, this.wrapper);
                sf.base.remove(this.wrapper);
            }
            this.unWireEvents();
        }
        this.primaryBtnObj.destroy();
        this.secondaryBtnObj.destroy();
        _super.prototype.destroy.call(this);
        if (!this.element.getAttribute('class')) {
            this.element.removeAttribute('class');
        }
    };
    SplitButton.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.element, 'click', this.primaryBtnClickHandler, this);
        sf.base.EventHandler.add(this.getPopUpElement(), 'keydown', this.keyBoardHandler, this);
        new sf.base.KeyboardEvents(this.element, {
            keyAction: this.btnKeyBoardHandler.bind(this),
            keyConfigs: {
                altdownarrow: 'alt+downarrow'
            }
        });
    };
    SplitButton.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(this.element, 'click', this.primaryBtnClickHandler);
        sf.base.getInstance(this.element, sf.base.KeyboardEvents).destroy();
    };
    SplitButton.prototype.primaryBtnClickHandler = function () {
        this.trigger('click', { element: this.element });
    };
    SplitButton.prototype.btnKeyBoardHandler = function (e) {
        switch (e.action) {
            case 'altdownarrow':
                this.clickHandler(e);
                break;
        }
    };
    /**
     * Called internally if any of the property value changed.
     * @param  {SplitButtonModel} newProp
     * @param  {SplitButtonModel} oldProp
     * @returns void
     */
    SplitButton.prototype.onPropertyChanged = function (newProp, oldProp) {
        var model = ['content', 'iconCss', 'iconPosition', 'cssClass', 'disabled', 'enableRtl'];
        this.primaryBtnObj.setProperties(sf.splitbuttons.getModel(newProp, model));
        model = ['beforeOpen', 'beforeItemRender', 'select', 'open',
            'close', 'cssClass', 'disabled', 'enableRtl'];
        if (Object.keys(newProp).indexOf('items') > -1) {
            this.secondaryBtnObj.items = newProp.items;
            this.secondaryBtnObj.dataBind();
        }
        this.secondaryBtnObj.setProperties(sf.splitbuttons.getModel(newProp, model));
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'cssClass':
                    if (oldProp.cssClass) {
                        sf.base.removeClass([this.wrapper], oldProp.cssClass.split(' '));
                    }
                    sf.base.addClass([this.wrapper], newProp.cssClass.split(' '));
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        sf.base.addClass([this.wrapper], RTL);
                    }
                    else {
                        sf.base.removeClass([this.wrapper], RTL);
                    }
                    break;
            }
        }
    };
    /**
     * Sets the focus to SplitButton
     * its native method
     * @public
     */
    SplitButton.prototype.focusIn = function () {
        this.element.focus();
    };
    __decorate([
        sf.base.Property('')
    ], SplitButton.prototype, "content", void 0);
    __decorate([
        sf.base.Property('')
    ], SplitButton.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(false)
    ], SplitButton.prototype, "disabled", void 0);
    __decorate([
        sf.base.Property('')
    ], SplitButton.prototype, "iconCss", void 0);
    __decorate([
        sf.base.Property('Left')
    ], SplitButton.prototype, "iconPosition", void 0);
    __decorate([
        sf.base.Collection([], sf.splitbuttons.Item)
    ], SplitButton.prototype, "items", void 0);
    __decorate([
        sf.base.Property('')
    ], SplitButton.prototype, "target", void 0);
    __decorate([
        sf.base.Event()
    ], SplitButton.prototype, "beforeItemRender", void 0);
    __decorate([
        sf.base.Event()
    ], SplitButton.prototype, "beforeOpen", void 0);
    __decorate([
        sf.base.Event()
    ], SplitButton.prototype, "beforeClose", void 0);
    __decorate([
        sf.base.Event()
    ], SplitButton.prototype, "click", void 0);
    __decorate([
        sf.base.Event()
    ], SplitButton.prototype, "close", void 0);
    __decorate([
        sf.base.Event()
    ], SplitButton.prototype, "open", void 0);
    __decorate([
        sf.base.Event()
    ], SplitButton.prototype, "select", void 0);
    __decorate([
        sf.base.Event()
    ], SplitButton.prototype, "created", void 0);
    SplitButton = __decorate([
        sf.base.NotifyPropertyChanges
    ], SplitButton);
    return SplitButton;
}(DropDownButton));
/**
 * Deferred is used to handle asynchronous operation.
 */
var Deferred = /** @class */ (function () {
    function Deferred() {
        var _this = this;
        /**
         * Promise is an object that represents a value that may not be available yet, but will be resolved at some point in the future.
         */
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
        /**
         * Defines the callback function triggers when the Deferred object is rejected.
         */
        this.catch = this.promise.catch.bind(this.promise);
        /**
         * Defines the callback function triggers when the Deferred object is resolved.
         */
        this.then = this.promise.then.bind(this.promise);
    }
    return Deferred;
}());

/**
 * Split Button modules
 */

exports.SplitButton = SplitButton;
exports.Deferred = Deferred;

return exports;

});

    sf.splitbuttons = sf.base.extend({}, sf.splitbuttons, sfsplitbutton({}));