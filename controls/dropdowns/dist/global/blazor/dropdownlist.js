window.sf = window.sf || {};
var sfdropdownlist = (function (exports) {
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
/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
/* tslint:disable */
// don't use space in classnames 
var dropDownListClasses = {
    root: 'e-dropdownlist',
    hover: sf.dropdowns.dropDownBaseClasses.hover,
    selected: sf.dropdowns.dropDownBaseClasses.selected,
    rtl: sf.dropdowns.dropDownBaseClasses.rtl,
    li: sf.dropdowns.dropDownBaseClasses.li,
    disable: sf.dropdowns.dropDownBaseClasses.disabled,
    base: sf.dropdowns.dropDownBaseClasses.root,
    focus: sf.dropdowns.dropDownBaseClasses.focus,
    input: 'e-input-group',
    inputFocus: 'e-input-focus',
    icon: 'e-input-group-icon e-ddl-icon',
    iconAnimation: 'e-icon-anim',
    value: 'e-input-value',
    device: 'e-ddl-device',
    backIcon: 'e-input-group-icon e-back-icon e-icons',
    filterBarClearIcon: 'e-input-group-icon e-clear-icon e-icons',
    filterInput: 'e-input-filter',
    filterParent: 'e-filter-parent',
    mobileFilter: 'e-ddl-device-filter',
    footer: 'e-ddl-footer',
    header: 'e-ddl-header',
    clearIcon: 'e-clear-icon',
    clearIconHide: 'e-clear-icon-hide',
    popupFullScreen: 'e-popup-full-page',
    disableIcon: 'e-ddl-disable-icon',
    hiddenElement: 'e-ddl-hidden'
};
var inputObject = {
    container: null,
    buttons: []
};
/**
 * The DropDownList component contains a list of predefined values from which you can
 * choose a single value.
 * ```html
 * <input type="text" tabindex="1" id="list"> </input>
 * ```
 * ```typescript
 *   let dropDownListObj:DropDownList = new DropDownList();
 *   dropDownListObj.appendTo("#list");
 * ```
 */
var DropDownList = /** @class */ (function (_super) {
    __extends(DropDownList, _super);
    /**
     * * Constructor for creating the DropDownList component.
     */
    function DropDownList(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.previousValue = null;
        return _this;
    }
    
    /**
     * Initialize the event handler.
     * @private
     */
    DropDownList.prototype.preRender = function () {
        var checkBlazor = sf.base.isBlazor() && this.isServerRendered;
        this.isServerBlazor = (checkBlazor) ? true : false;
        if (this.isServerBlazor) {
            this.initializeData();
        }
        else {
            this.element.style.opacity = '0';
            this.initializeData();
            _super.prototype.preRender.call(this);
        }
        this.activeIndex = this.index;
        this.queryString = '';
    };
    DropDownList.prototype.initializeData = function () {
        this.isPopupOpen = false;
        this.isDocumentClick = false;
        this.isInteracted = false;
        this.isFilterFocus = false;
        this.beforePopupOpen = false;
        this.initial = true;
        this.initRemoteRender = false;
        this.isNotSearchList = false;
        this.isTyped = false;
        this.isSelected = false;
        this.preventFocus = false;
        this.preventAutoFill = false;
        this.isValidKey = false;
        this.typedString = '';
        this.isEscapeKey = false;
        this.isPreventBlur = false;
        this.isTabKey = false;
        this.actionCompleteData = { isUpdated: false };
        this.prevSelectPoints = {};
        this.isSelectCustom = false;
        this.isDropDownClick = false;
        this.preventAltUp = false;
        this.isCustomFilter = false;
        this.isSecondClick = false;
        this.keyConfigure = {
            tab: 'tab',
            enter: '13',
            escape: '27',
            end: '35',
            home: '36',
            down: '40',
            up: '38',
            pageUp: '33',
            pageDown: '34',
            open: 'alt+40',
            close: 'shift+tab',
            hide: 'alt+38',
            space: '32'
        };
    };
    DropDownList.prototype.setZIndex = function () {
        if (this.popupObj) {
            this.popupObj.setProperties({ 'zIndex': this.zIndex });
        }
    };
    DropDownList.prototype.renderList = function (isEmptyData) {
        if (!this.isServerBlazor) {
            _super.prototype.render.call(this, isEmptyData);
            this.wireListEvents();
        }
        else {
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('OnServerRenderList', this.beforePopupOpen, false);
        }
    };
    DropDownList.prototype.floatLabelChange = function () {
        if (this.getModuleName() === 'dropdownlist' && this.floatLabelType === 'Auto') {
            var floatElement = this.inputWrapper.container.querySelector('.e-float-text');
            if (this.inputElement.value !== '' || this.isInteracted) {
                sf.base.classList(floatElement, ['e-label-top'], ['e-label-bottom']);
            }
            else {
                sf.base.classList(floatElement, ['e-label-bottom'], ['e-label-top']);
            }
        }
    };
    DropDownList.prototype.resetHandler = function (e) {
        e.preventDefault();
        this.clearAll(e);
    };
    DropDownList.prototype.resetFocusElement = function () {
        this.removeHover();
        this.removeSelection();
        this.removeFocus();
        this.list.scrollTop = 0;
        if (this.getModuleName() !== 'autocomplete' && !sf.base.isNullOrUndefined(this.ulElement)) {
            var li = this.ulElement.querySelector('.' + dropDownListClasses.li);
            if (li) {
                li.classList.add(dropDownListClasses.focus);
            }
        }
    };
    DropDownList.prototype.clearAll = function (e, properties) {
        if (sf.base.isNullOrUndefined(properties) || (!sf.base.isNullOrUndefined(properties) &&
            (sf.base.isNullOrUndefined(properties.dataSource) ||
                (!(properties.dataSource instanceof sf.data.DataManager) && properties.dataSource.length === 0)))) {
            this.isActive = true;
            this.resetSelection(properties);
        }
        var dataItem = this.getItemData();
        if (this.previousValue === dataItem.value) {
            return;
        }
        this.onChangeEvent(e);
    };
    DropDownList.prototype.resetSelection = function (properties) {
        if (this.list) {
            if ((!sf.base.isNullOrUndefined(properties) &&
                (sf.base.isNullOrUndefined(properties.dataSource) ||
                    (!(properties.dataSource instanceof sf.data.DataManager) && properties.dataSource.length === 0)))) {
                this.selectedLI = null;
                this.actionCompleteData.isUpdated = false;
                this.actionCompleteData.ulElement = null;
                this.actionCompleteData.list = null;
                this.resetList(properties.dataSource);
            }
            else {
                if (this.allowFiltering && this.getModuleName() !== 'autocomplete'
                    && !sf.base.isNullOrUndefined(this.actionCompleteData.ulElement) && !sf.base.isNullOrUndefined(this.actionCompleteData.list)) {
                    var actionList = this.actionCompleteData.ulElement.querySelector('li');
                    var ulElement = this.ulElement && this.ulElement.querySelector('li');
                    if (this.element.tagName === 'EJS-COMBOBOX' && actionList && ulElement &&
                        actionList.childElementCount > 0 && ulElement.childElementCount > 0 &&
                        actionList.textContent !== ulElement.textContent && this.itemTemplate) {
                        this.cloneElements();
                    }
                    this.onActionComplete(this.actionCompleteData.ulElement.cloneNode(true), this.actionCompleteData.list);
                }
                this.resetFocusElement();
            }
        }
        if (!this.isServerBlazor) {
            this.hiddenElement.innerHTML = '';
        }
        this.inputElement.value = '';
        this.value = null;
        this.itemData = null;
        this.text = null;
        this.index = null;
        this.activeIndex = null;
        this.item = null;
        this.queryString = '';
        if (this.valueTempElement) {
            sf.base.detach(this.valueTempElement);
            this.inputElement.style.display = 'block';
            this.valueTempElement = null;
        }
        this.setSelection(null, null);
        this.isSelectCustom = false;
        this.updateIconState();
        this.cloneElements();
    };
    DropDownList.prototype.setHTMLAttributes = function () {
        if (Object.keys(this.htmlAttributes).length) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var htmlAttr = _a[_i];
                if (htmlAttr === 'class') {
                    var updatedClassValue = (this.htmlAttributes[htmlAttr].replace(/\s+/g, ' ')).trim();
                    if (updatedClassValue !== '') {
                        sf.base.addClass([this.inputWrapper.container], updatedClassValue.split(' '));
                    }
                }
                else if (htmlAttr === 'disabled' && this.htmlAttributes[htmlAttr] === 'disabled') {
                    this.enabled = false;
                    this.setEnable();
                }
                else if (htmlAttr === 'readonly' && !sf.base.isNullOrUndefined(this.htmlAttributes[htmlAttr])) {
                    this.readonly = true;
                    this.dataBind();
                }
                else if (htmlAttr === 'style') {
                    this.inputWrapper.container.setAttribute('style', this.htmlAttributes[htmlAttr]);
                }
                else {
                    var defaultAttr = ['title', 'id', 'placeholder', 'aria-placeholder',
                        'role', 'autocorrect', 'autocomplete', 'autocapitalize', 'spellcheck', 'minlength', 'maxlength'];
                    var validateAttr = ['name', 'required'];
                    if (this.getModuleName() === 'autocomplete' || this.getModuleName() === 'combobox') {
                        defaultAttr.push('tabindex');
                    }
                    if (htmlAttr.indexOf('data') === 0 || validateAttr.indexOf(htmlAttr) > -1) {
                        this.hiddenElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                    else if (defaultAttr.indexOf(htmlAttr) > -1) {
                        htmlAttr === 'placeholder' ? sf.inputs.Input.setPlaceholder(this.htmlAttributes[htmlAttr], this.inputElement) :
                            this.inputElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                    else {
                        this.inputWrapper.container.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                }
            }
        }
        if (this.getModuleName() === 'autocomplete' || this.getModuleName() === 'combobox') {
            this.inputWrapper.container.removeAttribute('tabindex');
        }
    };
    DropDownList.prototype.getAriaAttributes = function () {
        return {
            'aria-disabled': 'false',
            'aria-owns': this.element.id + '_options',
            'role': 'listbox',
            'aria-haspopup': 'true',
            'aria-expanded': 'false',
            'aria-activedescendant': 'null',
            'aria-live': 'polite',
            'aria-labelledby': this.hiddenElement.id
        };
    };
    DropDownList.prototype.setEnableRtl = function () {
        sf.inputs.Input.setEnableRtl(this.enableRtl, [this.inputElement.parentElement]);
        if (this.popupObj) {
            this.popupObj.enableRtl = this.enableRtl;
            this.popupObj.dataBind();
        }
    };
    DropDownList.prototype.setEnable = function () {
        sf.inputs.Input.setEnabled(this.enabled, this.inputElement);
        if (this.enabled) {
            sf.base.removeClass([this.inputWrapper.container], dropDownListClasses.disable);
            this.inputElement.setAttribute('aria-disabled', 'false');
            this.targetElement().setAttribute('tabindex', this.tabIndex);
        }
        else {
            this.hidePopup();
            sf.base.addClass([this.inputWrapper.container], dropDownListClasses.disable);
            this.inputElement.setAttribute('aria-disabled', 'true');
            this.targetElement().tabIndex = -1;
        }
    };
    /**
     * Get the properties to be maintained in the persisted state.
     */
    DropDownList.prototype.getPersistData = function () {
        return this.addOnPersist(['value']);
    };
    
    DropDownList.prototype.getLocaleName = function () {
        return 'drop-down-list';
    };
    
    DropDownList.prototype.preventTabIndex = function (element) {
        if (this.getModuleName() === 'dropdownlist') {
            element.tabIndex = -1;
        }
    };
    DropDownList.prototype.targetElement = function () {
        return this.inputWrapper.container;
    };
    DropDownList.prototype.getNgDirective = function () {
        return 'EJS-DROPDOWNLIST';
    };
    DropDownList.prototype.getElementByText = function (text) {
        return this.getElementByValue(this.getValueByText(text));
    };
    DropDownList.prototype.getElementByValue = function (value) {
        var item;
        var listItems = this.getItems();
        for (var _i = 0, listItems_1 = listItems; _i < listItems_1.length; _i++) {
            var liItem = listItems_1[_i];
            if (this.getFormattedValue(liItem.getAttribute('data-value')) === value) {
                item = liItem;
                break;
            }
        }
        return item;
    };
    
    DropDownList.prototype.initValue = function () {
        this.renderList();
        if (this.dataSource instanceof sf.data.DataManager) {
            this.initRemoteRender = true;
        }
        else {
            this.updateValues();
        }
    };
    DropDownList.prototype.updateValues = function () {
        if (!sf.base.isNullOrUndefined(this.value)) {
            this.setSelection(this.getElementByValue(this.value), null);
        }
        else if (this.text && sf.base.isNullOrUndefined(this.value)) {
            var element = this.getElementByText(this.text);
            if (sf.base.isNullOrUndefined(element)) {
                this.setProperties({ text: null });
                return;
            }
            else {
                this.setSelection(element, null);
            }
        }
        else {
            this.setSelection(this.liCollections[this.activeIndex], null);
        }
        this.setHiddenValue();
        sf.inputs.Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
    };
    DropDownList.prototype.onBlur = function (e) {
        if (!this.enabled) {
            return;
        }
        var target = e.relatedTarget;
        var currentTarget = e.target;
        var isPreventBlur = this.isPreventBlur;
        this.isPreventBlur = false;
        //IE 11 - issue
        if (isPreventBlur && !this.isDocumentClick && this.isPopupOpen && (!sf.base.isNullOrUndefined(currentTarget) ||
            !this.isFilterLayout() && sf.base.isNullOrUndefined(target))) {
            if (this.getModuleName() === 'dropdownlist' && this.allowFiltering && this.isPopupOpen) {
                this.filterInput.focus();
            }
            else {
                this.targetElement().focus();
            }
            return;
        }
        if (this.isDocumentClick || (!sf.base.isNullOrUndefined(this.popupObj)
            && document.body.contains(this.popupObj.element) &&
            this.popupObj.element.classList.contains(dropDownListClasses.mobileFilter))) {
            if (!this.beforePopupOpen) {
                this.isDocumentClick = false;
            }
            return;
        }
        if (((this.getModuleName() === 'dropdownlist' && !this.isFilterFocus && target !== this.inputElement)
            && (document.activeElement !== target || (document.activeElement === target &&
                currentTarget.classList.contains(dropDownListClasses.inputFocus)))) ||
            (sf.base.isNullOrUndefined(target) && this.getModuleName() === 'dropdownlist' && this.allowFiltering &&
                currentTarget !== this.inputWrapper.container) || this.getModuleName() !== 'dropdownlist' &&
            !this.inputWrapper.container.contains(target) || this.isTabKey) {
            this.isDocumentClick = this.isPopupOpen ? true : false;
            this.focusOutAction(e);
            this.isTabKey = false;
        }
        if (this.isRequested && !this.isPopupOpen && !this.isPreventBlur) {
            this.isActive = false;
            this.beforePopupOpen = false;
        }
    };
    DropDownList.prototype.focusOutAction = function (e) {
        this.isInteracted = false;
        this.focusOut(e);
        this.onFocusOut();
    };
    DropDownList.prototype.onFocusOut = function () {
        if (!this.enabled) {
            return;
        }
        if (this.isSelected) {
            this.isSelectCustom = false;
            this.onChangeEvent(null);
        }
        this.floatLabelChange();
        this.dispatchEvent(this.hiddenElement, 'change');
        if (this.getModuleName() === 'dropdownlist' && this.element.tagName !== 'INPUT') {
            this.dispatchEvent(this.inputElement, 'blur');
        }
        if (this.inputWrapper.clearButton) {
            sf.base.addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
        }
        this.trigger('blur');
    };
    DropDownList.prototype.onFocus = function (e) {
        if (!this.isInteracted) {
            this.isInteracted = true;
            var args = { isInteracted: e ? true : false, event: e };
            this.trigger('focus', args);
        }
        this.updateIconState();
    };
    DropDownList.prototype.resetValueHandler = function (e) {
        var formElement = sf.base.closest(this.inputElement, 'form');
        if (formElement && e.target === formElement) {
            var val = (this.element.tagName === this.getNgDirective()) ? null : this.inputElement.getAttribute('value');
            this.text = val;
        }
    };
    DropDownList.prototype.wireEvent = function () {
        sf.base.EventHandler.add(this.inputWrapper.container, 'mousedown', this.dropDownClick, this);
        sf.base.EventHandler.add(this.inputWrapper.container, 'focus', this.focusIn, this);
        sf.base.EventHandler.add(this.inputWrapper.container, 'keypress', this.onSearch, this);
        this.bindCommonEvent();
    };
    DropDownList.prototype.bindCommonEvent = function () {
        sf.base.EventHandler.add(this.targetElement(), 'blur', this.onBlur, this);
        var formElement = sf.base.closest(this.inputElement, 'form');
        if (formElement) {
            sf.base.EventHandler.add(formElement, 'reset', this.resetValueHandler, this);
        }
        if (!sf.base.Browser.isDevice) {
            this.keyboardModule = new sf.base.KeyboardEvents(this.targetElement(), {
                keyAction: this.keyActionHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
            });
        }
        else {
            this.keyboardModule = new sf.base.KeyboardEvents(this.targetElement(), {
                keyAction: this.mobileKeyActionHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
            });
        }
        this.bindClearEvent();
    };
    DropDownList.prototype.bindClearEvent = function () {
        if (this.showClearButton) {
            sf.base.EventHandler.add(this.inputWrapper.clearButton, 'mousedown', this.resetHandler, this);
        }
    };
    DropDownList.prototype.unBindCommonEvent = function () {
        sf.base.EventHandler.remove(this.targetElement(), 'blur', this.onBlur);
        var formElement = sf.base.closest(this.inputElement, 'form');
        if (formElement) {
            sf.base.EventHandler.remove(formElement, 'reset', this.resetValueHandler);
        }
        if (!sf.base.Browser.isDevice) {
            this.keyboardModule.destroy();
        }
        if (this.showClearButton) {
            sf.base.EventHandler.remove(this.inputWrapper.clearButton, 'mousedown', this.resetHandler);
        }
    };
    DropDownList.prototype.updateIconState = function () {
        if (this.showClearButton) {
            if (this.inputElement.value !== '' && !this.readonly) {
                sf.base.removeClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
            else {
                sf.base.addClass([this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
            }
        }
    };
    /**
     * Event binding for list
     */
    DropDownList.prototype.wireListEvents = function () {
        sf.base.EventHandler.add(this.list, 'click', this.onMouseClick, this);
        sf.base.EventHandler.add(this.list, 'mouseover', this.onMouseOver, this);
        sf.base.EventHandler.add(this.list, 'mouseout', this.onMouseLeave, this);
    };
    
    DropDownList.prototype.onSearch = function (e) {
        if (e.charCode !== 32 && e.charCode !== 13) {
            if (this.list === undefined) {
                if (!this.isServerBlazor) {
                    this.renderList();
                }
                else {
                    this.isServerIncrementalSearch = true;
                    // tslint:disable-next-line
                    this.interopAdaptor.invokeMethodAsync('OnServerRenderList', true, false);
                }
            }
            this.searchKeyEvent = e;
            this.onServerIncrementalSearch(e);
        }
    };
    DropDownList.prototype.onServerIncrementalSearch = function (e) {
        if (!this.isRequested && !sf.base.isNullOrUndefined(this.list) &&
            !sf.base.isNullOrUndefined(this.list.querySelector('li')) && this.enabled && !this.readonly) {
            this.incrementalSearch(e);
        }
    };
    DropDownList.prototype.onMouseClick = function (e) {
        var target = e.target;
        var classList$$1 = target.classList;
        var li = sf.base.closest(target, '.' + sf.dropdowns.dropDownBaseClasses.li);
        if (!this.isValidLI(li)) {
            return;
        }
        this.setSelection(li, e);
        if (sf.base.Browser.isDevice && this.isFilterLayout()) {
            history.back();
        }
        else {
            var delay = 100;
            this.closePopup(delay);
        }
    };
    DropDownList.prototype.onMouseOver = function (e) {
        var currentLi = sf.base.closest(e.target, '.' + sf.dropdowns.dropDownBaseClasses.li);
        this.setHover(currentLi);
    };
    
    DropDownList.prototype.setHover = function (li) {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(sf.dropdowns.dropDownBaseClasses.hover)) {
            this.removeHover();
            sf.base.addClass([li], sf.dropdowns.dropDownBaseClasses.hover);
        }
    };
    
    DropDownList.prototype.onMouseLeave = function (e) {
        this.removeHover();
    };
    
    DropDownList.prototype.removeHover = function () {
        if (this.list) {
            var hoveredItem = (this.isServerBlazor && this.popupObj && this.popupObj.element) ?
                this.popupObj.element.querySelectorAll('.' + sf.dropdowns.dropDownBaseClasses.hover) :
                this.list.querySelectorAll('.' + sf.dropdowns.dropDownBaseClasses.hover);
            if (hoveredItem && hoveredItem.length) {
                sf.base.removeClass(hoveredItem, sf.dropdowns.dropDownBaseClasses.hover);
            }
        }
    };
    
    DropDownList.prototype.isValidLI = function (li) {
        return (li && li.hasAttribute('role') && li.getAttribute('role') === 'option');
    };
    
    DropDownList.prototype.incrementalSearch = function (e) {
        if (this.liCollections.length > 0) {
            var li = sf.dropdowns.incrementalSearch(e.charCode, this.liCollections, this.activeIndex, true, this.element.id, this.isServerBlazor);
            if (!sf.base.isNullOrUndefined(li)) {
                this.setSelection(li, e);
                this.setScrollPosition();
            }
        }
    };
    
    /**
     * Hides the spinner loader.
     * @returns void.
     */
    DropDownList.prototype.hideSpinner = function () {
        if (!sf.base.isNullOrUndefined(this.spinnerElement)) {
            sf.popups.hideSpinner(this.spinnerElement);
            sf.base.removeClass([this.spinnerElement], dropDownListClasses.disableIcon);
            this.spinnerElement.innerHTML = '';
            this.spinnerElement = null;
        }
    };
    /**
     * Shows the spinner loader.
     * @returns void.
     */
    DropDownList.prototype.showSpinner = function () {
        if (sf.base.isNullOrUndefined(this.spinnerElement)) {
            this.spinnerElement = sf.base.Browser.isDevice && !sf.base.isNullOrUndefined(this.filterInputObj) && this.filterInputObj.buttons[1] ||
                !sf.base.isNullOrUndefined(this.filterInputObj) && this.filterInputObj.buttons[0] || this.inputWrapper.buttons[0];
            sf.base.addClass([this.spinnerElement], dropDownListClasses.disableIcon);
            sf.popups.createSpinner({
                target: this.spinnerElement,
                width: sf.base.Browser.isDevice ? '16px' : '14px'
            }, this.createElement);
            sf.popups.showSpinner(this.spinnerElement);
        }
    };
    DropDownList.prototype.keyActionHandler = function (e) {
        if (!this.enabled) {
            return;
        }
        var preventAction = e.action === 'pageUp' || e.action === 'pageDown';
        var preventHomeEnd = this.getModuleName() !== 'dropdownlist' && (e.action === 'home' || e.action === 'end');
        this.isEscapeKey = e.action === 'escape';
        this.isTabKey = !this.isPopupOpen && e.action === 'tab';
        var isNavAction = e.action === 'down' || e.action === 'up' || e.action === 'home' || e.action === 'end';
        var isNavigation = (e.action === 'down' || e.action === 'up' || e.action === 'pageUp' || e.action === 'pageDown'
            || e.action === 'home' || e.action === 'end');
        if ((this.isEditTextBox() || preventAction || preventHomeEnd) && !this.isPopupOpen) {
            return;
        }
        if (!this.readonly) {
            var isTabAction = e.action === 'tab' || e.action === 'close';
            if (this.list === undefined && !this.isRequested && !isTabAction && e.action !== 'escape') {
                this.searchKeyEvent = e;
                this.renderList();
            }
            if (!(this.isServerBlazor && (e.action === 'open' || e.action === 'space')) && sf.base.isNullOrUndefined(this.list) ||
                (!sf.base.isNullOrUndefined(this.liCollections) && isNavigation && this.liCollections.length === 0) || this.isRequested) {
                if (!(this.isServerBlazor && isNavAction)) {
                    return;
                }
            }
            if ((isTabAction && this.getModuleName() !== 'autocomplete') && this.isPopupOpen
                || e.action === 'escape') {
                e.preventDefault();
            }
            this.isSelected = e.action === 'escape' ? false : this.isSelected;
            this.isTyped = (isNavigation || e.action === 'escape') ? false : this.isTyped;
            switch (e.action) {
                case 'down':
                case 'up':
                    this.updateUpDownAction(e);
                    break;
                case 'pageUp':
                    this.pageUpSelection(this.activeIndex - this.getPageCount(), e);
                    e.preventDefault();
                    break;
                case 'pageDown':
                    this.pageDownSelection(this.activeIndex + this.getPageCount(), e);
                    e.preventDefault();
                    break;
                case 'home':
                    this.updateHomeEndAction(e);
                    break;
                case 'end':
                    this.updateHomeEndAction(e);
                    break;
                case 'space':
                    if (this.getModuleName() === 'dropdownlist') {
                        if (!this.beforePopupOpen) {
                            this.showPopup();
                        }
                    }
                    break;
                case 'open':
                    this.showPopup();
                    break;
                case 'hide':
                    this.preventAltUp = this.isPopupOpen;
                    this.hidePopup(e);
                    this.focusDropDown(e);
                    break;
                case 'enter':
                    this.selectCurrentItem(e);
                    break;
                case 'tab':
                    this.selectCurrentValueOnTab(e);
                    break;
                case 'escape':
                case 'close':
                    if (this.isPopupOpen) {
                        this.hidePopup(e);
                        this.focusDropDown(e);
                    }
                    break;
            }
        }
    };
    DropDownList.prototype.updateUpDownAction = function (e) {
        if (this.isServerBlazor && sf.base.isNullOrUndefined(this.list)) {
            this.isServerNavigation = true;
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('OnServerRenderList', true, false);
        }
        else {
            this.isServerNavigation = false;
            var focusEle = this.list.querySelector('.' + dropDownListClasses.focus);
            if (this.isSelectFocusItem(focusEle)) {
                this.setSelection(focusEle, e);
            }
            else {
                var nextItem = void 0;
                var index = e.action === 'down' ? this.activeIndex + 1 : this.activeIndex - 1;
                var startIndex = 0;
                if (this.getModuleName() === 'autocomplete') {
                    startIndex = e.action === 'down' && sf.base.isNullOrUndefined(this.activeIndex) ? 0 : this.liCollections.length - 1;
                    index = index < 0 ? this.liCollections.length - 1 : index === this.liCollections.length ? 0 : index;
                }
                nextItem = sf.base.isNullOrUndefined(this.activeIndex) ? this.liCollections[startIndex] : this.liCollections[index];
                if (!sf.base.isNullOrUndefined(nextItem)) {
                    this.setSelection(nextItem, e);
                }
            }
            e.preventDefault();
        }
    };
    DropDownList.prototype.updateHomeEndAction = function (e) {
        if (this.getModuleName() === 'dropdownlist') {
            if (this.isServerBlazor && sf.base.isNullOrUndefined(this.list)) {
                this.isServerNavigation = true;
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('OnServerRenderList', true, false);
            }
            else {
                this.isServerNavigation = false;
                var findLi = 0;
                if (e.action === 'home') {
                    findLi = 0;
                }
                else {
                    findLi = this.getItems().length - 1;
                }
                e.preventDefault();
                if (this.activeIndex === findLi) {
                    return;
                }
                this.setSelection(this.liCollections[findLi], e);
            }
        }
    };
    DropDownList.prototype.selectCurrentValueOnTab = function (e) {
        if (this.getModuleName() === 'autocomplete') {
            this.selectCurrentItem(e);
        }
        else {
            if (this.isPopupOpen) {
                this.hidePopup(e);
                this.focusDropDown(e);
            }
        }
    };
    DropDownList.prototype.mobileKeyActionHandler = function (e) {
        if (!this.enabled) {
            return;
        }
        if ((this.isEditTextBox()) && !this.isPopupOpen) {
            return;
        }
        if (!this.readonly) {
            if (this.list === undefined && !this.isRequested) {
                this.searchKeyEvent = e;
                this.renderList();
            }
            if (sf.base.isNullOrUndefined(this.list) || (!sf.base.isNullOrUndefined(this.liCollections) &&
                this.liCollections.length === 0) || this.isRequested) {
                return;
            }
            if (e.action === 'enter') {
                this.selectCurrentItem(e);
            }
        }
    };
    DropDownList.prototype.selectCurrentItem = function (e) {
        if (this.isPopupOpen) {
            var li = this.list.querySelector('.' + dropDownListClasses.focus);
            if (li) {
                this.setSelection(li, e);
                this.isTyped = false;
            }
            if (this.isSelected) {
                this.isSelectCustom = false;
                this.onChangeEvent(e);
            }
            this.hidePopup();
            this.focusDropDown(e);
        }
        else {
            this.showPopup();
        }
    };
    DropDownList.prototype.isSelectFocusItem = function (element) {
        return !sf.base.isNullOrUndefined(element);
    };
    DropDownList.prototype.getPageCount = function () {
        var liHeight = this.list.classList.contains(sf.dropdowns.dropDownBaseClasses.noData) ? null :
            getComputedStyle(this.getItems()[0], null).getPropertyValue('height');
        return Math.round(this.list.getBoundingClientRect().height / parseInt(liHeight, 10));
    };
    DropDownList.prototype.pageUpSelection = function (steps, event) {
        var previousItem = steps >= 0 ? this.liCollections[steps + 1] : this.liCollections[0];
        this.setSelection(previousItem, event);
    };
    
    DropDownList.prototype.pageDownSelection = function (steps, event) {
        var list = this.getItems();
        var previousItem = steps <= list.length ? this.liCollections[steps - 1] : this.liCollections[list.length - 1];
        this.setSelection(previousItem, event);
    };
    
    DropDownList.prototype.unWireEvent = function () {
        sf.base.EventHandler.remove(this.inputWrapper.container, 'mousedown', this.dropDownClick);
        sf.base.EventHandler.remove(this.inputWrapper.container, 'keypress', this.onSearch);
        sf.base.EventHandler.remove(this.inputWrapper.container, 'focus', this.focusIn);
        this.unBindCommonEvent();
    };
    /**
     * Event un binding for list items.
     */
    DropDownList.prototype.unWireListEvents = function () {
        sf.base.EventHandler.remove(this.list, 'click', this.onMouseClick);
        sf.base.EventHandler.remove(this.list, 'mouseover', this.onMouseOver);
        sf.base.EventHandler.remove(this.list, 'mouseout', this.onMouseLeave);
    };
    
    DropDownList.prototype.checkSelector = function (id) {
        return '#' + id.replace(/(:|\.|\[|\]|,|=|@|\\|\/|#)/g, '\\$1');
    };
    DropDownList.prototype.onDocumentClick = function (e) {
        var target = e.target;
        if (!(!sf.base.isNullOrUndefined(this.popupObj) && sf.base.closest(target, this.checkSelector(this.popupObj.element.id))) &&
            !this.inputWrapper.container.contains(e.target)) {
            if (this.inputWrapper.container.classList.contains(dropDownListClasses.inputFocus) || this.isPopupOpen) {
                this.isDocumentClick = true;
                var isActive = this.isRequested;
                this.isInteracted = false;
                this.hidePopup(e);
                if (!isActive) {
                    this.onFocusOut();
                    this.inputWrapper.container.classList.remove(dropDownListClasses.inputFocus);
                }
            }
        }
        else if (target !== this.inputElement && !(this.allowFiltering && target === this.filterInput)
            && !(this.getModuleName() === 'combobox' &&
                !this.allowFiltering && sf.base.Browser.isDevice && target === this.inputWrapper.buttons[0])) {
            this.isPreventBlur = (sf.base.Browser.isIE || sf.base.Browser.info.name === 'edge') && (document.activeElement === this.targetElement() ||
                document.activeElement === this.filterInput);
            e.preventDefault();
        }
    };
    DropDownList.prototype.activeStateChange = function () {
        if (this.isDocumentClick) {
            this.hidePopup();
            this.onFocusOut();
            this.inputWrapper.container.classList.remove(dropDownListClasses.inputFocus);
        }
    };
    DropDownList.prototype.focusDropDown = function (e) {
        if (!this.initial && this.isFilterLayout()) {
            this.focusIn(e);
        }
    };
    DropDownList.prototype.dropDownClick = function (e) {
        if (e.which === 3 || e.button === 2) {
            return;
        }
        if (this.targetElement().classList.contains(dropDownListClasses.disable) || this.inputWrapper.clearButton === e.target) {
            return;
        }
        var target = e.target;
        if (target !== this.inputElement && !(this.allowFiltering && target === this.filterInput) && this.getModuleName() !== 'combobox') {
            e.preventDefault();
        }
        if (!this.readonly) {
            if (this.isPopupOpen) {
                this.hidePopup();
                if (this.isFilterLayout()) {
                    this.focusDropDown(e);
                }
            }
            else {
                this.focusIn(e);
                this.floatLabelChange();
                this.queryString = this.inputElement.value.trim() === '' ? null : this.inputElement.value;
                this.isDropDownClick = true;
                this.showPopup();
            }
            var proxy_1 = this;
            var duration = (sf.base.isBlazor()) ? 1000 : (this.element.tagName === this.getNgDirective() && this.itemTemplate) ? 500 : 100;
            if (!this.isSecondClick) {
                setTimeout(function () { proxy_1.cloneElements(); proxy_1.isSecondClick = true; }, duration);
            }
        }
        else {
            this.focusIn(e);
        }
    };
    DropDownList.prototype.cloneElements = function () {
        if (this.list) {
            var ulElement = this.list.querySelector('ul');
            if (ulElement) {
                ulElement = ulElement.cloneNode ? ulElement.cloneNode(true) : ulElement;
                this.actionCompleteData.ulElement = ulElement;
            }
        }
    };
    DropDownList.prototype.updateSelectedItem = function (li, e, preventSelect, isSelection) {
        var _this = this;
        this.removeSelection();
        li.classList.add(sf.dropdowns.dropDownBaseClasses.selected);
        this.removeHover();
        var value = this.getFormattedValue(li.getAttribute('data-value'));
        var selectedData = this.getDataByValue(value);
        if (!this.initial && !preventSelect && !sf.base.isNullOrUndefined(e)) {
            var items = this.detachChanges(selectedData);
            this.isSelected = true;
            var eventArgs = {
                e: e,
                item: li,
                itemData: items,
                isInteracted: e ? true : false,
                cancel: false
            };
            this.trigger('select', eventArgs, function (eventArgs) {
                if (eventArgs.cancel) {
                    li.classList.remove(sf.dropdowns.dropDownBaseClasses.selected);
                }
                else {
                    _this.selectEventCallback(li, e, preventSelect, selectedData, value);
                    if (_this.isServerBlazor) {
                        // tslint:disable-next-line
                        _this.interopAdaptor.invokeMethodAsync('OnServerItemData', _this.itemData);
                    }
                    if (isSelection) {
                        _this.setSelectOptions(li, e);
                    }
                }
            });
        }
        else {
            this.selectEventCallback(li, e, preventSelect, selectedData, value);
            if (this.isServerBlazor) {
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('OnServerItemData', this.itemData);
            }
            if (isSelection) {
                this.setSelectOptions(li, e);
            }
        }
    };
    DropDownList.prototype.selectEventCallback = function (li, e, preventSelect, selectedData, value) {
        this.previousItemData = (!sf.base.isNullOrUndefined(this.itemData)) ? this.itemData : null;
        this.item = li;
        this.itemData = selectedData;
        var focusedItem = this.list.querySelector('.' + sf.dropdowns.dropDownBaseClasses.focus);
        if (focusedItem) {
            sf.base.removeClass([focusedItem], sf.dropdowns.dropDownBaseClasses.focus);
        }
        li.setAttribute('aria-selected', 'true');
        this.activeIndex = this.getIndexByValue(value);
    };
    DropDownList.prototype.activeItem = function (li) {
        if (this.isValidLI(li) && !li.classList.contains(sf.dropdowns.dropDownBaseClasses.selected)) {
            this.removeSelection();
            li.classList.add(sf.dropdowns.dropDownBaseClasses.selected);
            this.removeHover();
            li.setAttribute('aria-selected', 'true');
        }
    };
    DropDownList.prototype.setValue = function (e) {
        var dataItem = this.getItemData();
        if (dataItem.value === null) {
            if (sf.base.isBlazor() && dataItem.text !== null || dataItem.text !== '') {
                sf.inputs.Input.setValue(dataItem.text, this.inputElement, this.floatLabelType, this.showClearButton);
            }
            else {
                sf.inputs.Input.setValue(null, this.inputElement, this.floatLabelType, this.showClearButton);
            }
        }
        else {
            sf.inputs.Input.setValue(dataItem.text, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        if (this.isServerBlazor) {
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('OnServerValueTemplate', dataItem);
        }
        if (this.valueTemplate && this.itemData !== null && !this.isServerBlazor) {
            this.DropDownBaseresetBlazorTemplates(false, false, false, false, true);
            this.setValueTemplate();
        }
        else if (this.inputElement.previousSibling === this.valueTempElement) {
            sf.base.detach(this.valueTempElement);
            this.inputElement.style.display = 'block';
        }
        if (this.previousValue === dataItem.value) {
            this.isSelected = false;
            return true;
        }
        else {
            this.isSelected = !this.initial ? true : false;
            this.isSelectCustom = false;
            if (this.getModuleName() === 'dropdownlist') {
                this.updateIconState();
            }
            return false;
        }
    };
    DropDownList.prototype.setSelection = function (li, e) {
        if (this.isValidLI(li) && (!li.classList.contains(sf.dropdowns.dropDownBaseClasses.selected) || (this.isPopupOpen && this.isSelected
            && li.classList.contains(sf.dropdowns.dropDownBaseClasses.selected)))) {
            this.updateSelectedItem(li, e, false, true);
        }
        else {
            this.setSelectOptions(li, e);
        }
    };
    DropDownList.prototype.setSelectOptions = function (li, e) {
        if (this.list) {
            this.removeHover();
        }
        this.previousSelectedLI = (!sf.base.isNullOrUndefined(this.selectedLI)) ? this.selectedLI : null;
        this.selectedLI = li;
        if (this.setValue(e)) {
            return;
        }
        if (this.isPopupOpen) {
            sf.base.attributes(this.targetElement(), { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
            if (this.isFilterLayout() && this.filterInput) {
                sf.base.attributes(this.filterInput, { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
            }
        }
        if ((!this.isPopupOpen && !sf.base.isNullOrUndefined(li)) || (this.isPopupOpen && !sf.base.isNullOrUndefined(e) &&
            (e.type !== 'keydown' || e.type === 'keydown' && e.action === 'enter'))) {
            this.isSelectCustom = false;
            this.onChangeEvent(e);
        }
        if (this.isPopupOpen && !sf.base.isNullOrUndefined(this.selectedLI) && this.itemData !== null && (!e || e.type !== 'click')) {
            this.setScrollPosition(e);
        }
        if (sf.base.Browser.info.name !== 'mozilla') {
            sf.base.attributes(this.inputElement, { 'aria-label': this.inputElement.value });
            sf.base.attributes(this.targetElement(), { 'aria-describedby': this.inputElement.id });
            this.targetElement().removeAttribute('aria-live');
        }
    };
    DropDownList.prototype.dropdownCompiler = function (dropdownTemplate) {
        var checkTemplate = false;
        if (dropdownTemplate) {
            try {
                checkTemplate = (document.querySelectorAll(dropdownTemplate).length) ? true : false;
            }
            catch (exception) {
                checkTemplate = false;
            }
        }
        return checkTemplate;
    };
    DropDownList.prototype.setValueTemplate = function () {
        var compiledString;
        if (!this.valueTempElement) {
            this.valueTempElement = this.createElement('span', { className: dropDownListClasses.value });
            this.inputElement.parentElement.insertBefore(this.valueTempElement, this.inputElement);
            this.inputElement.style.display = 'none';
        }
        this.valueTempElement.innerHTML = '';
        var templateData = (sf.base.isBlazor()) ? JSON.parse(JSON.stringify(this.itemData)) : this.itemData;
        var valuecheck = this.dropdownCompiler(this.valueTemplate);
        if (valuecheck) {
            compiledString = sf.base.compile(document.querySelector(this.valueTemplate).innerHTML.trim());
        }
        else {
            compiledString = sf.base.compile(this.valueTemplate);
        }
        for (var _i = 0, _a = compiledString(templateData, null, null, this.valueTemplateId, this.isStringTemplate); _i < _a.length; _i++) {
            var item = _a[_i];
            this.valueTempElement.appendChild(item);
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, true, true, true);
    };
    DropDownList.prototype.removeSelection = function () {
        if (this.list) {
            var selectedItems = this.list.querySelectorAll('.' + sf.dropdowns.dropDownBaseClasses.selected);
            if (selectedItems.length) {
                sf.base.removeClass(selectedItems, sf.dropdowns.dropDownBaseClasses.selected);
                selectedItems[0].removeAttribute('aria-selected');
            }
        }
    };
    
    DropDownList.prototype.getItemData = function () {
        var fields = this.fields;
        var dataItem = null;
        dataItem = this.itemData;
        var dataValue;
        var dataText;
        if (!sf.base.isNullOrUndefined(dataItem)) {
            dataValue = sf.base.getValue(fields.value, dataItem);
            dataText = sf.base.getValue(fields.text, dataItem);
        }
        var value = (!sf.base.isNullOrUndefined(dataItem) &&
            !sf.base.isUndefined(dataValue) ? dataValue : dataItem);
        var text = (!sf.base.isNullOrUndefined(dataItem) &&
            !sf.base.isUndefined(dataValue) ? dataText : dataItem);
        return { value: value, text: text };
    };
    /**
     * To trigger the change event for list.
     */
    DropDownList.prototype.onChangeEvent = function (eve) {
        var dataItem = this.getItemData();
        var index = this.isSelectCustom ? null : this.activeIndex;
        this.setProperties({ 'index': index, 'text': dataItem.text, 'value': dataItem.value }, true);
        this.detachChangeEvent(eve);
    };
    
    DropDownList.prototype.detachChanges = function (value) {
        var items;
        if (typeof value === 'string' ||
            typeof value === 'boolean' ||
            typeof value === 'number') {
            items = Object.defineProperties({}, {
                value: {
                    value: value,
                    enumerable: true
                },
                text: {
                    value: value,
                    enumerable: true
                }
            });
        }
        else {
            items = value;
        }
        return items;
    };
    DropDownList.prototype.detachChangeEvent = function (eve) {
        this.isSelected = false;
        this.previousValue = this.value;
        this.activeIndex = this.index;
        this.typedString = !sf.base.isNullOrUndefined(this.text) ? this.text : '';
        if (!this.initial) {
            var items = this.detachChanges(this.itemData);
            var preItems = void 0;
            if (typeof this.previousItemData === 'string' ||
                typeof this.previousItemData === 'boolean' ||
                typeof this.previousItemData === 'number') {
                preItems = Object.defineProperties({}, {
                    value: {
                        value: this.previousItemData,
                        enumerable: true
                    },
                    text: {
                        value: this.previousItemData,
                        enumerable: true
                    }
                });
            }
            else {
                preItems = this.previousItemData;
            }
            this.setHiddenValue();
            var eventArgs = {
                e: eve,
                item: this.item,
                itemData: items,
                previousItem: this.previousSelectedLI,
                previousItemData: preItems,
                isInteracted: eve ? true : false,
                value: this.value,
                element: this.element
            };
            this.trigger('change', eventArgs);
            if (this.isServerBlazor && this.enablePersistence) {
                // tslint:disable-next-line
                this.interopAdaptor.invokeMethodAsync('ServerChange');
            }
        }
        if ((sf.base.isNullOrUndefined(this.value) || this.value === '') && this.floatLabelType !== 'Always') {
            sf.base.removeClass([this.inputWrapper.container], 'e-valid-input');
        }
    };
    DropDownList.prototype.setHiddenValue = function () {
        if (!sf.base.isNullOrUndefined(this.value)) {
            if (this.isServerBlazor && this.hiddenElement.querySelector('option')) {
                var selectedElement = this.hiddenElement.querySelector('option');
                selectedElement.textContent = this.text;
                selectedElement.setAttribute('value', this.value.toString());
            }
            else if (!this.isServerBlazor) {
                this.hiddenElement.innerHTML = '<option selected>' + this.text + '</option>';
                var selectedElement = this.hiddenElement.querySelector('option');
                selectedElement.setAttribute('value', this.value.toString());
            }
        }
        else if (!this.isServerBlazor) {
            this.hiddenElement.innerHTML = '';
        }
    };
    /**
     * Filter bar implementation
     */
    DropDownList.prototype.onFilterUp = function (e) {
        if (!(e.ctrlKey && e.keyCode === 86) && (this.isValidKey || e.keyCode === 40 || e.keyCode === 38)) {
            this.isValidKey = false;
            switch (e.keyCode) {
                case 38: //up arrow 
                case 40: //down arrow 
                    if (this.getModuleName() === 'autocomplete' && !this.isPopupOpen && !this.preventAltUp && !this.isRequested) {
                        this.preventAutoFill = true;
                        this.searchLists(e);
                    }
                    else {
                        this.preventAutoFill = false;
                    }
                    this.preventAltUp = false;
                    e.preventDefault();
                    break;
                case 46: //delete
                case 8: //backspace
                    this.typedString = this.filterInput.value;
                    if (!this.isPopupOpen && this.typedString !== '' || this.isPopupOpen && this.queryString.length > 0) {
                        this.preventAutoFill = true;
                        this.searchLists(e);
                    }
                    else if (this.typedString === '' && this.queryString === '' && this.getModuleName() !== 'autocomplete') {
                        this.preventAutoFill = true;
                        this.searchLists(e);
                    }
                    else if (this.typedString === '') {
                        if (this.list) {
                            this.resetFocusElement();
                        }
                        this.activeIndex = null;
                        if (this.getModuleName() === 'autocomplete') {
                            this.hidePopup();
                        }
                    }
                    e.preventDefault();
                    break;
                default:
                    this.typedString = this.filterInput.value;
                    this.preventAutoFill = false;
                    this.searchLists(e);
                    break;
            }
        }
        else {
            this.isValidKey = false;
        }
    };
    DropDownList.prototype.onFilterDown = function (e) {
        switch (e.keyCode) {
            case 13: //enter
                break;
            case 40: //down arrow
            case 38: //up arrow 
                this.queryString = this.filterInput.value;
                e.preventDefault();
                break;
            case 9: //tab 
                if (this.isPopupOpen && this.getModuleName() !== 'autocomplete') {
                    e.preventDefault();
                }
                break;
            default:
                this.prevSelectPoints = this.getSelectionPoints();
                this.queryString = this.filterInput.value;
                break;
        }
    };
    DropDownList.prototype.removeFillSelection = function () {
        if (this.isInteracted) {
            var selection = this.getSelectionPoints();
            this.inputElement.setSelectionRange(selection.end, selection.end);
        }
    };
    DropDownList.prototype.getQuery = function (query) {
        var filterQuery;
        if (!this.isCustomFilter && this.allowFiltering && this.filterInput) {
            filterQuery = query ? query.clone() : this.query ? this.query.clone() : new sf.data.Query();
            var filterType = this.typedString === '' ? 'contains' : this.filterType;
            var dataType = this.typeOfData(this.dataSource).typeof;
            if (!(this.dataSource instanceof sf.data.DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, this.typedString, this.ignoreCase, this.ignoreAccent);
            }
            else {
                var fields = (this.fields.text) ? this.fields.text : '';
                filterQuery.where(fields, filterType, this.typedString, this.ignoreCase, this.ignoreAccent);
            }
        }
        else {
            filterQuery = query ? query : this.query ? this.query : new sf.data.Query();
        }
        return filterQuery;
    };
    DropDownList.prototype.getSelectionPoints = function () {
        var input = this.inputElement;
        return { start: Math.abs(input.selectionStart), end: Math.abs(input.selectionEnd) };
    };
    DropDownList.prototype.searchLists = function (e) {
        var _this = this;
        this.isTyped = true;
        this.activeIndex = null;
        if (this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon)) {
            var clearElement = this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
            clearElement.style.visibility = this.filterInput.value === '' ? 'hidden' : 'visible';
        }
        this.isDataFetched = false;
        if (this.isFiltering()) {
            if (this.isServerBlazor) {
                this.beforePopupOpen = (this.getModuleName() === 'combobox' && this.isFiltering() && !this.beforePopupOpen)
                    ? !this.beforePopupOpen : this.beforePopupOpen;
                if (this.filterInput.value === '' && this.getModuleName() !== 'dropdownlist') {
                    // tslint:disable-next-line
                    this.interopAdaptor.invokeMethodAsync('OnServerRenderList', this.beforePopupOpen, false);
                }
                else {
                    // tslint:disable-next-line
                    this.interopAdaptor.invokeMethodAsync('OnServerFilter', this.filterInput.value);
                }
            }
            else {
                var eventArgs_1 = {
                    preventDefaultAction: false,
                    text: this.filterInput.value,
                    updateData: function (dataSource, query, fields) {
                        if (eventArgs_1.cancel) {
                            return;
                        }
                        _this.isCustomFilter = true;
                        _this.filteringAction(dataSource, query, fields);
                    },
                    baseEventArgs: e,
                    cancel: false
                };
                this.trigger('filtering', eventArgs_1, function (eventArgs) {
                    if (!eventArgs.cancel && !_this.isCustomFilter && !eventArgs.preventDefaultAction) {
                        _this.filteringAction(_this.dataSource, null, _this.fields);
                    }
                });
            }
        }
    };
    /**
     * To filter the data from given data source by using query
     * @param  {Object[] | DataManager } dataSource - Set the data source to filter.
     * @param  {Query} query - Specify the query to filter the data.
     * @param  {FieldSettingsModel} fields - Specify the fields to map the column in the data table.
     * @return {void}.
     * @deprecated
     */
    DropDownList.prototype.filter = function (dataSource, query, fields) {
        this.isCustomFilter = true;
        this.filteringAction(dataSource, query, fields);
    };
    DropDownList.prototype.filteringAction = function (dataSource, query, fields) {
        if (!sf.base.isNullOrUndefined(this.filterInput)) {
            this.beforePopupOpen = true;
            if (this.filterInput.value.trim() === '' && !this.itemTemplate) {
                this.actionCompleteData.isUpdated = false;
                this.isTyped = false;
                if (!sf.base.isNullOrUndefined(this.actionCompleteData.ulElement) && !sf.base.isNullOrUndefined(this.actionCompleteData.list)) {
                    this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list);
                }
                this.isTyped = true;
                if (!sf.base.isNullOrUndefined(this.itemData) && this.getModuleName() === 'dropdownlist') {
                    this.focusIndexItem();
                    this.setScrollPosition();
                }
                this.isNotSearchList = true;
            }
            else {
                this.isNotSearchList = false;
                query = (this.filterInput.value.trim() === '') ? null : query;
                this.resetList(dataSource, fields, query);
            }
        }
    };
    DropDownList.prototype.setSearchBox = function (popupElement) {
        if (this.isFiltering()) {
            var parentElement = popupElement.querySelector('.' + dropDownListClasses.filterParent) ?
                popupElement.querySelector('.' + dropDownListClasses.filterParent) : this.createElement('span', {
                className: dropDownListClasses.filterParent
            });
            if (this.isServerBlazor) {
                parentElement.innerHTML = '';
            }
            this.filterInput = this.createElement('input', {
                attrs: { type: 'text' },
                className: dropDownListClasses.filterInput
            });
            this.element.parentNode.insertBefore(this.filterInput, this.element);
            var backIcon = false;
            if (sf.base.Browser.isDevice) {
                backIcon = true;
            }
            this.filterInputObj = sf.inputs.Input.createInput({
                element: this.filterInput,
                buttons: backIcon ?
                    [dropDownListClasses.backIcon, dropDownListClasses.filterBarClearIcon] : [dropDownListClasses.filterBarClearIcon],
                properties: { placeholder: this.filterBarPlaceholder }
            }, this.createElement);
            if (!sf.base.isNullOrUndefined(this.cssClass)) {
                if (this.cssClass.split(' ').indexOf('e-outline') !== -1) {
                    sf.base.addClass([this.filterInputObj.container], 'e-outline');
                }
                else if (this.cssClass.split(' ').indexOf('e-filled') !== -1) {
                    sf.base.addClass([this.filterInputObj.container], 'e-filled');
                }
            }
            sf.base.append([this.filterInputObj.container], parentElement);
            sf.base.prepend([parentElement], popupElement);
            sf.base.attributes(this.filterInput, {
                'aria-disabled': 'false',
                'aria-owns': this.element.id + '_options',
                'role': 'listbox',
                'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null,
                'autocomplete': 'off',
                'autocorrect': 'off',
                'autocapitalize': 'off',
                'spellcheck': 'false'
            });
            this.clearIconElement = this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
            if (!sf.base.Browser.isDevice && this.clearIconElement) {
                sf.base.EventHandler.add(this.clearIconElement, 'click', this.clearText, this);
                this.clearIconElement.style.visibility = 'hidden';
            }
            if (!sf.base.Browser.isDevice) {
                this.searchKeyModule = new sf.base.KeyboardEvents(this.filterInput, {
                    keyAction: this.keyActionHandler.bind(this),
                    keyConfigs: this.keyConfigure,
                    eventName: 'keydown'
                });
            }
            else {
                this.searchKeyModule = new sf.base.KeyboardEvents(this.filterInput, {
                    keyAction: this.mobileKeyActionHandler.bind(this),
                    keyConfigs: this.keyConfigure,
                    eventName: 'keydown'
                });
            }
            sf.base.EventHandler.add(this.filterInput, 'input', this.onInput, this);
            sf.base.EventHandler.add(this.filterInput, 'keyup', this.onFilterUp, this);
            sf.base.EventHandler.add(this.filterInput, 'keydown', this.onFilterDown, this);
            sf.base.EventHandler.add(this.filterInput, 'blur', this.onBlur, this);
            sf.base.EventHandler.add(this.filterInput, 'paste', this.pasteHandler, this);
            return this.filterInputObj;
        }
        else {
            return inputObject;
        }
    };
    
    DropDownList.prototype.onInput = function (e) {
        this.isValidKey = true;
        // For filtering works in mobile firefox.
        if (sf.base.Browser.isDevice && sf.base.Browser.info.name === 'mozilla') {
            this.typedString = this.filterInput.value;
            this.preventAutoFill = true;
            this.searchLists(e);
        }
    };
    DropDownList.prototype.pasteHandler = function (e) {
        var _this = this;
        setTimeout(function () {
            _this.typedString = _this.filterInput.value;
            _this.searchLists(e);
        });
    };
    DropDownList.prototype.onActionFailure = function (e) {
        _super.prototype.onActionFailure.call(this, e);
        if (this.beforePopupOpen) {
            this.renderPopup();
        }
    };
    DropDownList.prototype.onActionComplete = function (ulElement, list, e, isUpdated) {
        var _this = this;
        if (this.isNotSearchList) {
            this.isNotSearchList = false;
            return;
        }
        if (this.isActive) {
            var selectedItem = this.selectedLI ? this.selectedLI.cloneNode(true) : null;
            _super.prototype.onActionComplete.call(this, ulElement, list, e);
            this.updateSelectElementData(this.allowFiltering);
            if (this.isRequested && !sf.base.isNullOrUndefined(this.searchKeyEvent) && this.searchKeyEvent.type === 'keydown') {
                this.isRequested = false;
                this.keyActionHandler(this.searchKeyEvent);
                this.searchKeyEvent = null;
            }
            if (this.isRequested && !sf.base.isNullOrUndefined(this.searchKeyEvent)) {
                this.incrementalSearch(this.searchKeyEvent);
                this.searchKeyEvent = null;
            }
            this.list.scrollTop = 0;
            if (!sf.base.isNullOrUndefined(ulElement)) {
                sf.base.attributes(ulElement, { 'id': this.element.id + '_options', 'role': 'listbox', 'aria-hidden': 'false' });
            }
            if (this.initRemoteRender) {
                this.initial = true;
                this.activeIndex = this.index;
                this.updateValues();
                this.initRemoteRender = false;
                this.initial = false;
                if (this.value && this.dataSource instanceof sf.data.DataManager) {
                    var checkField_1 = sf.base.isNullOrUndefined(this.fields.value) ? this.fields.text : this.fields.value;
                    var checkVal = list.some(function (x) { return x[checkField_1] === _this.value; });
                    if (!checkVal) {
                        this.dataSource.executeQuery(this.getQuery(this.query).where(new sf.data.Predicate(checkField_1, 'equal', this.value)))
                            .then(function (e) {
                            if (e.result.length > 0) {
                                _this.addItem(e.result, list.length);
                                _this.updateValues();
                            }
                        });
                    }
                }
            }
            if (this.getModuleName() !== 'autocomplete' && this.isFiltering() && !this.isTyped) {
                if (!this.actionCompleteData.isUpdated || ((!this.isCustomFilter
                    && !this.isFilterFocus)
                    && ((this.dataSource instanceof sf.data.DataManager)
                        || (!sf.base.isNullOrUndefined(this.dataSource) && !sf.base.isNullOrUndefined(this.dataSource.length) &&
                            this.dataSource.length !== 0)))) {
                    this.actionCompleteData = { ulElement: ulElement.cloneNode(true), list: list, isUpdated: true };
                }
                this.addNewItem(list, selectedItem);
                if (!sf.base.isNullOrUndefined(this.itemData)) {
                    this.focusIndexItem();
                }
            }
            if (this.beforePopupOpen) {
                this.renderPopup();
            }
        }
    };
    DropDownList.prototype.addNewItem = function (listData, newElement) {
        var _this = this;
        if (!sf.base.isNullOrUndefined(this.itemData) && !sf.base.isNullOrUndefined(newElement)) {
            var value_1 = this.getItemData().value;
            var isExist = listData.some(function (data) {
                return (((typeof data === 'string' || typeof data === 'number') && data === value_1) ||
                    (sf.base.getValue(_this.fields.value, data) === value_1));
            });
            if (!isExist) {
                this.addItem(this.itemData);
            }
        }
    };
    DropDownList.prototype.updateActionCompleteData = function (li, item) {
        if (this.getModuleName() !== 'autocomplete' && this.actionCompleteData.ulElement) {
            this.actionCompleteData.ulElement.appendChild(li.cloneNode(true));
            if (this.isFiltering() && this.actionCompleteData.list.indexOf(item) < 0) {
                this.actionCompleteData.list.push(item);
            }
        }
    };
    DropDownList.prototype.focusIndexItem = function () {
        var value = this.getItemData().value;
        this.activeIndex = this.getIndexByValue(value);
        var element = this.findListElement(this.list, 'li', 'data-value', value);
        this.selectedLI = element;
        this.activeItem(element);
        this.removeFocus();
    };
    DropDownList.prototype.updateSelection = function () {
        var selectedItem = this.list.querySelector('.' + sf.dropdowns.dropDownBaseClasses.selected);
        if (selectedItem) {
            this.setProperties({ 'index': this.getIndexByValue(selectedItem.getAttribute('data-value')) });
            this.activeIndex = this.index;
        }
        else {
            this.removeFocus();
            this.list.querySelector('.' + sf.dropdowns.dropDownBaseClasses.li).classList.add(dropDownListClasses.focus);
        }
    };
    DropDownList.prototype.removeFocus = function () {
        var highlightedItem = this.list.querySelectorAll('.' + dropDownListClasses.focus);
        if (highlightedItem && highlightedItem.length) {
            sf.base.removeClass(highlightedItem, dropDownListClasses.focus);
        }
    };
    
    DropDownList.prototype.renderPopup = function () {
        var _this = this;
        if (this.popupObj && document.body.contains(this.popupObj.element)) {
            this.refreshPopup();
            return;
        }
        var args = { cancel: false };
        this.trigger('beforeOpen', args, function (args) {
            if (!args.cancel) {
                var popupEle = (_this.serverPopupEle) ? _this.serverPopupEle : _this.createElement('div', {
                    id: _this.element.id + '_popup', className: 'e-ddl e-popup ' + (_this.cssClass != null ? _this.cssClass : '')
                });
                var searchBox = _this.setSearchBox(popupEle);
                _this.listHeight = sf.base.formatUnit(_this.popupHeight);
                if (_this.headerTemplate && !_this.isServerBlazor) {
                    _this.setHeaderTemplate(popupEle);
                }
                sf.base.append([_this.list], popupEle);
                if (_this.footerTemplate && !_this.isServerBlazor) {
                    _this.setFooterTemplate(popupEle);
                }
                if (_this.isServerRendered && popupEle && popupEle.querySelector('.e-ddl-footer')) {
                    popupEle.appendChild(popupEle.querySelector('.e-ddl-footer'));
                }
                document.body.appendChild(popupEle);
                _this.updateServerPopup(popupEle);
                popupEle.style.visibility = 'hidden';
                if (_this.popupHeight !== 'auto') {
                    _this.searchBoxHeight = 0;
                    if (!sf.base.isNullOrUndefined(searchBox.container)) {
                        _this.searchBoxHeight = (searchBox.container.parentElement).getBoundingClientRect().height;
                        _this.listHeight = (parseInt(_this.listHeight, 10) - (_this.searchBoxHeight)).toString() + 'px';
                    }
                    if (_this.headerTemplate || (_this.isServerRendered && popupEle && popupEle.querySelector('.e-ddl-header'))) {
                        _this.header = _this.header ? _this.header : popupEle.querySelector('.e-ddl-header');
                        var height = Math.round(_this.header.getBoundingClientRect().height);
                        _this.listHeight = (parseInt(_this.listHeight, 10) - (height + _this.searchBoxHeight)).toString() + 'px';
                    }
                    if (_this.footerTemplate || (_this.isServerRendered && popupEle && popupEle.querySelector('.e-ddl-footer'))) {
                        _this.footer = _this.footer ? _this.footer : popupEle.querySelector('.e-ddl-footer');
                        var height = Math.round(_this.footer.getBoundingClientRect().height);
                        _this.listHeight = (parseInt(_this.listHeight, 10) - (height + _this.searchBoxHeight)).toString() + 'px';
                    }
                    _this.list.style.maxHeight = (parseInt(_this.listHeight, 10) - 2).toString() + 'px'; // due to box-sizing property
                    popupEle.style.maxHeight = sf.base.formatUnit(_this.popupHeight);
                }
                else {
                    popupEle.style.height = 'auto';
                }
                var offsetValue = 0;
                var left = void 0;
                if (!sf.base.isNullOrUndefined(_this.selectedLI) && (!sf.base.isNullOrUndefined(_this.activeIndex) && _this.activeIndex >= 0)) {
                    _this.setScrollPosition();
                }
                else {
                    _this.list.scrollTop = 0;
                }
                if (sf.base.Browser.isDevice && (!_this.allowFiltering && (_this.getModuleName() === 'dropdownlist' ||
                    (_this.isDropDownClick && _this.getModuleName() === 'combobox')))) {
                    offsetValue = _this.getOffsetValue(popupEle);
                    var firstItem = _this.isEmptyList() ? _this.list : _this.liCollections[0];
                    left = -(parseInt(getComputedStyle(firstItem).textIndent, 10) -
                        parseInt(getComputedStyle(_this.inputElement).paddingLeft, 10) +
                        parseInt(getComputedStyle(_this.inputElement.parentElement).borderLeftWidth, 10));
                }
                _this.getFocusElement();
                _this.createPopup(popupEle, offsetValue, left);
                _this.checkCollision(popupEle);
                if (sf.base.Browser.isDevice) {
                    _this.popupObj.element.classList.add(dropDownListClasses.device);
                    if (_this.getModuleName() === 'dropdownlist' || (_this.getModuleName() === 'combobox'
                        && !_this.allowFiltering && _this.isDropDownClick)) {
                        _this.popupObj.collision = { X: 'fit', Y: 'fit' };
                    }
                    if (_this.isFilterLayout()) {
                        _this.popupObj.element.classList.add(dropDownListClasses.mobileFilter);
                        _this.popupObj.position = { X: 0, Y: 0 };
                        _this.popupObj.dataBind();
                        sf.base.attributes(_this.popupObj.element, { style: 'left:0px;right:0px;top:0px;bottom:0px;' });
                        sf.base.addClass([document.body, _this.popupObj.element], dropDownListClasses.popupFullScreen);
                        _this.setSearchBoxPosition();
                        _this.backIconElement = searchBox.container.querySelector('.e-back-icon');
                        _this.clearIconElement = searchBox.container.querySelector('.' + dropDownListClasses.clearIcon);
                        sf.base.EventHandler.add(_this.backIconElement, 'click', _this.clickOnBackIcon, _this);
                        sf.base.EventHandler.add(_this.clearIconElement, 'click', _this.clearText, _this);
                    }
                }
                popupEle.style.visibility = 'visible';
                sf.base.addClass([popupEle], 'e-popup-close');
                var scrollParentElements = _this.popupObj.getScrollableParent(_this.inputWrapper.container);
                for (var _i = 0, scrollParentElements_1 = scrollParentElements; _i < scrollParentElements_1.length; _i++) {
                    var element = scrollParentElements_1[_i];
                    sf.base.EventHandler.add(element, 'scroll', _this.scrollHandler, _this);
                }
                if (sf.base.Browser.isDevice && _this.isFilterLayout()) {
                    sf.base.EventHandler.add(_this.list, 'scroll', _this.listScroll, _this);
                }
                sf.base.attributes(_this.targetElement(), { 'aria-expanded': 'true' });
                var inputParent = _this.isFiltering() ? _this.filterInput.parentElement : _this.inputWrapper.container;
                sf.base.addClass([inputParent], [dropDownListClasses.inputFocus]);
                var animModel = { name: 'FadeIn', duration: 100 };
                _this.beforePopupOpen = true;
                var popupInstance = (sf.base.isBlazor() && _this.isServerRendered) ? null : _this.popupObj;
                var eventArgs = { popup: popupInstance, cancel: false, animation: animModel };
                _this.trigger('open', eventArgs, function (eventArgs) {
                    if (!eventArgs.cancel) {
                        _this.serverBlazorUpdateSelection();
                        _this.bindServerScrollEvent();
                        sf.base.addClass([_this.inputWrapper.container], [dropDownListClasses.iconAnimation]);
                        _this.popupObj.show(new sf.base.Animation(eventArgs.animation), (_this.zIndex === 1000) ? _this.element : null);
                    }
                    else {
                        _this.beforePopupOpen = false;
                        _this.destroyPopup();
                    }
                });
            }
            else {
                _this.beforePopupOpen = false;
            }
        });
    };
    DropDownList.prototype.checkCollision = function (popupEle) {
        if (!sf.base.Browser.isDevice || (sf.base.Browser.isDevice && !(this.getModuleName() === 'dropdownlist' || this.isDropDownClick))) {
            var collision = sf.popups.isCollide(popupEle);
            if (collision.length > 0) {
                popupEle.style.marginTop = -parseInt(getComputedStyle(popupEle).marginTop, 10) + 'px';
            }
            this.popupObj.resolveCollision();
        }
    };
    DropDownList.prototype.serverBlazorUpdateSelection = function () {
        if (this.isServerBlazor && (this.value !== null || this.index !== null || this.text !== null) ||
            (this.getModuleName() !== 'dropdownlist' && !this.isTyped)) {
            if (this.getModuleName() === 'dropdownlist') {
                this.removeSelection();
                this.removeFocus();
                this.removeHover();
                this.updateValues();
            }
            if (this.getModuleName() === 'combobox' && this.ulElement &&
                this.findListElement(this.ulElement, 'li', 'data-value', this.value) && !this.isTyped) {
                this.updateValues();
            }
            if (this.isServerBlazor && this.getModuleName() !== 'dropdownlist' &&
                (this.text === '' || this.text === null) && this.ulElement) {
                if (!this.ulElement.querySelector('li').classList.contains(sf.dropdowns.dropDownBaseClasses.hover)) {
                    sf.base.addClass([this.ulElement.querySelector('li')], sf.dropdowns.dropDownBaseClasses.hover);
                }
            }
        }
    };
    DropDownList.prototype.bindServerScrollEvent = function () {
        if (this.isServerBlazor && this.list) {
            if ((this.fields.groupBy) && !this.isGroupChecking) {
                sf.base.EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
                sf.base.EventHandler.add(this.list, 'scroll', this.setFloatingHeader, this);
            }
        }
    };
    DropDownList.prototype.updateServerPopup = function (popupEle) {
        if (this.isServerBlazor) {
            if (popupEle && popupEle.querySelector('li')) {
                sf.base.removeClass([popupEle.querySelector('.e-content')], ['e-nodata']);
            }
            this.initial = false;
            popupEle.removeAttribute('style');
        }
    };
    DropDownList.prototype.getOffsetValue = function (popupEle) {
        var popupStyles = getComputedStyle(popupEle);
        var borderTop = parseInt(popupStyles.borderTopWidth, 10);
        var borderBottom = parseInt(popupStyles.borderBottomWidth, 10);
        return this.setPopupPosition(borderTop + borderBottom);
    };
    DropDownList.prototype.createPopup = function (element, offsetValue, left) {
        var _this = this;
        this.popupObj = new sf.popups.Popup(element, {
            width: this.setWidth(), targetType: 'relative',
            relateTo: this.inputWrapper.container, collision: { X: 'flip', Y: 'flip' }, offsetY: offsetValue,
            enableRtl: this.enableRtl, offsetX: left, position: { X: 'left', Y: 'bottom' },
            zIndex: this.zIndex,
            close: function () {
                if (!_this.isDocumentClick) {
                    _this.focusDropDown();
                }
                var isResetItem = (_this.getModuleName() === 'autocomplete') ? true : false;
                _this.DropDownBaseresetBlazorTemplates(isResetItem, isResetItem, true, true, false, true, true);
                _this.isNotSearchList = false;
                _this.isDocumentClick = false;
                _this.destroyPopup();
                var formElement = sf.base.closest(_this.inputElement, 'form');
                if (_this.isFiltering() && formElement && _this.actionCompleteData.list && _this.actionCompleteData.list[0]) {
                    _this.isActive = true;
                    _this.onActionComplete(_this.actionCompleteData.ulElement, _this.actionCompleteData.list, null, true);
                }
            },
            open: function () {
                sf.base.EventHandler.add(document, 'mousedown', _this.onDocumentClick, _this);
                _this.isPopupOpen = true;
                var actionList = _this.actionCompleteData && _this.actionCompleteData.ulElement &&
                    _this.actionCompleteData.ulElement.querySelector('li');
                var ulElement = _this.list.querySelector('ul li');
                if (_this.isFiltering() && _this.itemTemplate && (_this.element.tagName === _this.getNgDirective()) &&
                    (actionList && ulElement && actionList.textContent !== ulElement.textContent)) {
                    _this.cloneElements();
                }
                if (_this.isFilterLayout()) {
                    sf.base.removeClass([_this.inputWrapper.container], [dropDownListClasses.inputFocus]);
                    _this.isFilterFocus = true;
                    _this.filterInput.focus();
                    if (_this.inputWrapper.clearButton) {
                        sf.base.addClass([_this.inputWrapper.clearButton], dropDownListClasses.clearIconHide);
                    }
                }
                _this.activeStateChange();
            },
            targetExitViewport: function () {
                if (!sf.base.Browser.isDevice) {
                    _this.hidePopup();
                }
            }
        });
    };
    DropDownList.prototype.isEmptyList = function () {
        return !sf.base.isNullOrUndefined(this.liCollections) && this.liCollections.length === 0;
    };
    DropDownList.prototype.getFocusElement = function () {
        // combo-box used this method
    };
    DropDownList.prototype.isFilterLayout = function () {
        return this.getModuleName() === 'dropdownlist' && this.allowFiltering;
    };
    DropDownList.prototype.scrollHandler = function () {
        if (sf.base.Browser.isDevice && ((this.getModuleName() === 'dropdownlist' &&
            !this.isFilterLayout()) || (this.getModuleName() === 'combobox' && !this.allowFiltering && this.isDropDownClick))) {
            this.hidePopup();
        }
    };
    DropDownList.prototype.setSearchBoxPosition = function () {
        var searchBoxHeight = this.filterInput.parentElement.getBoundingClientRect().height;
        this.popupObj.element.style.maxHeight = '100%';
        this.popupObj.element.style.width = '100%';
        this.list.style.maxHeight = (window.innerHeight - searchBoxHeight) + 'px';
        this.list.style.height = (window.innerHeight - searchBoxHeight) + 'px';
        var clearElement = this.filterInput.parentElement.querySelector('.' + dropDownListClasses.clearIcon);
        sf.base.detach(this.filterInput);
        clearElement.parentElement.insertBefore(this.filterInput, clearElement);
    };
    DropDownList.prototype.setPopupPosition = function (border) {
        var offsetValue;
        var popupOffset = border;
        var selectedLI = this.list.querySelector('.' + dropDownListClasses.focus) || this.selectedLI;
        var firstItem = this.isEmptyList() ? this.list : this.liCollections[0];
        var lastItem = this.isEmptyList() ? this.list : this.liCollections[this.getItems().length - 1];
        var liHeight = firstItem.getBoundingClientRect().height;
        var listHeight = this.list.offsetHeight / 2;
        var height = sf.base.isNullOrUndefined(selectedLI) ? firstItem.offsetTop : selectedLI.offsetTop;
        var lastItemOffsetValue = lastItem.offsetTop;
        if (lastItemOffsetValue - listHeight < height && !sf.base.isNullOrUndefined(this.liCollections) &&
            this.liCollections.length > 0 && !sf.base.isNullOrUndefined(selectedLI)) {
            var count = this.list.offsetHeight / liHeight;
            var paddingBottom = parseInt(getComputedStyle(this.list).paddingBottom, 10);
            offsetValue = (count - (this.liCollections.length - this.activeIndex)) * liHeight - popupOffset + paddingBottom;
            this.list.scrollTop = selectedLI.offsetTop;
        }
        else if (height > listHeight) {
            offsetValue = listHeight - liHeight / 2;
            this.list.scrollTop = height - listHeight + liHeight / 2;
        }
        else {
            offsetValue = height;
        }
        var inputHeight = this.inputWrapper.container.offsetHeight;
        offsetValue = offsetValue + liHeight + popupOffset - ((liHeight - inputHeight) / 2);
        return -offsetValue;
    };
    DropDownList.prototype.setWidth = function () {
        var width = sf.base.formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            var inputWidth = this.inputWrapper.container.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        if (sf.base.Browser.isDevice && (!this.allowFiltering && (this.getModuleName() === 'dropdownlist' ||
            (this.isDropDownClick && this.getModuleName() === 'combobox')))) {
            var firstItem = this.isEmptyList() ? this.list : this.liCollections[0];
            width = (parseInt(width, 10) + (parseInt(getComputedStyle(firstItem).textIndent, 10) -
                parseInt(getComputedStyle(this.inputElement).paddingLeft, 10) +
                parseInt(getComputedStyle(this.inputElement.parentElement).borderLeftWidth, 10)) * 2) + 'px';
        }
        return width;
    };
    DropDownList.prototype.scrollBottom = function (isInitial) {
        if (!sf.base.isNullOrUndefined(this.selectedLI)) {
            var currentOffset = this.list.offsetHeight;
            var nextBottom = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            var nextOffset = this.list.scrollTop + nextBottom - currentOffset;
            nextOffset = isInitial ? nextOffset + parseInt(getComputedStyle(this.list).paddingTop, 10) * 2 : nextOffset;
            var boxRange = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            boxRange = this.fields.groupBy && !sf.base.isNullOrUndefined(this.fixedHeaderElement) ?
                boxRange - this.fixedHeaderElement.offsetHeight : boxRange;
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            }
            else if (nextBottom > currentOffset || !(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = nextOffset;
            }
        }
    };
    DropDownList.prototype.scrollTop = function () {
        if (!sf.base.isNullOrUndefined(this.selectedLI)) {
            var nextOffset = this.selectedLI.offsetTop - this.list.scrollTop;
            var nextBottom = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            nextOffset = this.fields.groupBy && !sf.base.isNullOrUndefined(this.fixedHeaderElement) ?
                nextOffset - this.fixedHeaderElement.offsetHeight : nextOffset;
            var boxRange = (this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop);
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            }
            else if (nextOffset < 0) {
                this.list.scrollTop = this.list.scrollTop + nextOffset;
            }
            else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = this.selectedLI.offsetTop - (this.fields.groupBy && !sf.base.isNullOrUndefined(this.fixedHeaderElement) ?
                    this.fixedHeaderElement.offsetHeight : 0);
            }
        }
    };
    DropDownList.prototype.isEditTextBox = function () {
        return false;
    };
    DropDownList.prototype.isFiltering = function () {
        return this.allowFiltering;
    };
    DropDownList.prototype.isPopupButton = function () {
        return true;
    };
    DropDownList.prototype.setScrollPosition = function (e) {
        if (!sf.base.isNullOrUndefined(e)) {
            switch (e.action) {
                case 'pageDown':
                case 'down':
                case 'end':
                    this.scrollBottom();
                    break;
                default:
                    this.scrollTop();
                    break;
            }
        }
        else {
            this.scrollBottom(true);
        }
    };
    DropDownList.prototype.clearText = function () {
        this.filterInput.value = '';
        this.searchLists(null);
    };
    DropDownList.prototype.listScroll = function () {
        this.filterInput.blur();
    };
    DropDownList.prototype.setEleWidth = function (width) {
        if (!sf.base.isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.inputWrapper.container.style.width = sf.base.formatUnit(width);
            }
            else if (typeof width === 'string') {
                this.inputWrapper.container.style.width = (width.match(/px|%|em/)) ? (width) : (sf.base.formatUnit(width));
            }
        }
    };
    DropDownList.prototype.closePopup = function (delay) {
        var _this = this;
        this.isTyped = false;
        if (!(this.popupObj && document.body.contains(this.popupObj.element) && this.beforePopupOpen)) {
            return;
        }
        sf.base.EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        this.isActive = false;
        this.filterInputObj = null;
        this.isDropDownClick = false;
        this.preventAutoFill = false;
        var scrollableParentElements = this.popupObj.getScrollableParent(this.inputWrapper.container);
        for (var _i = 0, scrollableParentElements_1 = scrollableParentElements; _i < scrollableParentElements_1.length; _i++) {
            var element = scrollableParentElements_1[_i];
            sf.base.EventHandler.remove(element, 'scroll', this.scrollHandler);
        }
        if (sf.base.Browser.isDevice && this.isFilterLayout()) {
            sf.base.removeClass([document.body, this.popupObj.element], dropDownListClasses.popupFullScreen);
            sf.base.EventHandler.remove(this.list, 'scroll', this.listScroll);
        }
        if (this.isFilterLayout()) {
            if (!sf.base.Browser.isDevice) {
                this.searchKeyModule.destroy();
                if (this.clearIconElement) {
                    sf.base.EventHandler.remove(this.clearIconElement, 'click', this.clearText);
                }
            }
            if (this.backIconElement) {
                sf.base.EventHandler.remove(this.backIconElement, 'click', this.clickOnBackIcon);
                sf.base.EventHandler.remove(this.clearIconElement, 'click', this.clearText);
            }
            sf.base.EventHandler.remove(this.filterInput, 'input', this.onInput);
            sf.base.EventHandler.remove(this.filterInput, 'keyup', this.onFilterUp);
            sf.base.EventHandler.remove(this.filterInput, 'keydown', this.onFilterDown);
            sf.base.EventHandler.remove(this.filterInput, 'blur', this.onBlur);
            sf.base.EventHandler.remove(this.filterInput, 'paste', this.pasteHandler);
            this.filterInput = null;
        }
        sf.base.attributes(this.targetElement(), { 'aria-expanded': 'false', 'aria-activedescendant': null });
        this.inputWrapper.container.classList.remove(dropDownListClasses.iconAnimation);
        if (this.isFiltering()) {
            this.actionCompleteData.isUpdated = false;
        }
        this.beforePopupOpen = false;
        var animModel = {
            name: 'FadeOut',
            duration: 100,
            delay: delay ? delay : 0
        };
        var popupInstance = (sf.base.isBlazor() && this.isServerRendered) ? null : this.popupObj;
        var eventArgs = { popup: popupInstance, cancel: false, animation: animModel };
        this.trigger('close', eventArgs, function (eventArgs) {
            if (!sf.base.isNullOrUndefined(_this.popupObj) &&
                !sf.base.isNullOrUndefined(_this.popupObj.element.querySelector('.e-fixed-head'))) {
                var fixedHeader = _this.popupObj.element.querySelector('.e-fixed-head');
                fixedHeader.parentNode.removeChild(fixedHeader);
                _this.fixedHeaderElement = null;
            }
            if (!eventArgs.cancel) {
                if (_this.getModuleName() === 'autocomplete' && !_this.isServerBlazor) {
                    _this.rippleFun();
                }
                if (_this.isPopupOpen) {
                    _this.popupObj.hide(new sf.base.Animation(eventArgs.animation));
                }
                else {
                    _this.destroyPopup();
                }
            }
        });
    };
    DropDownList.prototype.destroyPopup = function () {
        var popupHolderEle = document.querySelector('#' + this.element.id + '_popup_holder');
        if (this.isServerBlazor && this.serverPopupEle && popupHolderEle) {
            popupHolderEle.appendChild(this.serverPopupEle);
        }
        if (this.isServerBlazor) {
            // tslint:disable-next-line
            this.interopAdaptor.invokeMethodAsync('OnServerClosePopup');
        }
        this.isPopupOpen = false;
        this.isFilterFocus = false;
        this.popupObj.destroy();
        sf.base.detach(this.popupObj.element);
    };
    DropDownList.prototype.clickOnBackIcon = function () {
        this.hidePopup();
        this.focusIn();
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    // tslint:disable-next-line
    DropDownList.prototype.render = function () {
        if (this.isServerBlazor) {
            this.inputElement = this.element;
            this.inputWrapper = { container: this.element.parentElement };
            this.hiddenElement = this.inputWrapper.container.querySelector('select');
            this.inputWrapper.buttons = [this.inputWrapper.container.querySelector('.e-input-group-icon.e-ddl-icon')];
            if (this.showClearButton) {
                this.inputWrapper.clearButton = this.inputWrapper.container.querySelector('.e-clear-icon');
                sf.inputs.Input.wireClearBtnEvents(this.element, this.inputWrapper.clearButton, this.inputWrapper.container);
            }
            if (this.floatLabelType === 'Auto') {
                sf.inputs.Input.wireFloatingEvents(this.element);
            }
            sf.inputs.Input.bindInitialEvent({
                element: this.element,
                buttons: null, customTag: null,
                floatLabelType: this.floatLabelType,
                properties: this.properties
            });
            this.setFields();
            this.wireEvent();
            this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
            if (!this.enabled) {
                this.targetElement().tabIndex = -1;
            }
            if (this.element.hasAttribute('autofocus')) {
                this.focusIn();
            }
        }
        else {
            if (this.element.tagName === 'INPUT') {
                this.inputElement = this.element;
                if (sf.base.isNullOrUndefined(this.inputElement.getAttribute('role'))) {
                    this.inputElement.setAttribute('role', 'textbox');
                }
                if (sf.base.isNullOrUndefined(this.inputElement.getAttribute('type'))) {
                    this.inputElement.setAttribute('type', 'text');
                }
            }
            else {
                this.inputElement = this.createElement('input', { attrs: { role: 'textbox', type: 'text' } });
                if (this.element.tagName !== this.getNgDirective()) {
                    this.element.style.display = 'none';
                }
                this.element.parentElement.insertBefore(this.inputElement, this.element);
                this.preventTabIndex(this.inputElement);
            }
            var updatedCssClassValues = this.cssClass;
            if (!sf.base.isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
                updatedCssClassValues = (this.cssClass.replace(/\s+/g, ' ')).trim();
            }
            this.inputWrapper = sf.inputs.Input.createInput({
                element: this.inputElement,
                buttons: this.isPopupButton() ? [dropDownListClasses.icon] : null,
                floatLabelType: this.floatLabelType,
                properties: {
                    readonly: this.getModuleName() === 'dropdownlist' ? true : this.readonly,
                    placeholder: this.placeholder,
                    cssClass: updatedCssClassValues,
                    enabled: this.enabled,
                    enableRtl: this.enableRtl,
                    showClearButton: this.showClearButton
                },
            }, this.createElement);
            if (this.element.tagName === this.getNgDirective()) {
                this.element.appendChild(this.inputWrapper.container);
            }
            else {
                this.inputElement.parentElement.insertBefore(this.element, this.inputElement);
            }
            this.hiddenElement = this.createElement('select', {
                attrs: { 'aria-hidden': 'true', 'tabindex': '-1', 'class': dropDownListClasses.hiddenElement }
            });
            sf.base.prepend([this.hiddenElement], this.inputWrapper.container);
            this.validationAttribute(this.element, this.hiddenElement);
            this.setFields();
            this.inputWrapper.container.style.width = sf.base.formatUnit(this.width);
            this.inputWrapper.container.classList.add('e-ddl');
            this.wireEvent();
            this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
            this.element.removeAttribute('tabindex');
            var id = this.element.getAttribute('id') ? this.element.getAttribute('id') : sf.base.getUniqueID('ej2_dropdownlist');
            this.element.id = id;
            this.hiddenElement.id = id + '_hidden';
            this.targetElement().setAttribute('tabindex', this.tabIndex);
            sf.base.attributes(this.targetElement(), this.getAriaAttributes());
            this.updateDataAttribute(this.htmlAttributes);
            this.setHTMLAttributes();
            if (this.value !== null || this.activeIndex !== null || this.text !== null) {
                this.initValue();
            }
            else if (this.element.tagName === 'SELECT' && this.element.options[0]) {
                var selectElement = this.element;
                this.value = selectElement.options[selectElement.selectedIndex].value;
                this.text = sf.base.isNullOrUndefined(this.value) ? null : selectElement.options[selectElement.selectedIndex].textContent;
                this.initValue();
            }
            this.preventTabIndex(this.element);
            if (!this.enabled) {
                this.targetElement().tabIndex = -1;
            }
            this.initial = false;
            this.element.style.opacity = '';
            this.inputElement.onselect = function (e) { e.stopImmediatePropagation(); };
            this.inputElement.onchange = function (e) { e.stopImmediatePropagation(); };
            if (this.element.hasAttribute('autofocus')) {
                this.focusIn();
            }
            if (!sf.base.isNullOrUndefined(this.text)) {
                this.inputElement.setAttribute('value', this.text);
            }
        }
        this.renderComplete();
    };
    
    DropDownList.prototype.setFooterTemplate = function (popupEle) {
        var compiledString;
        if (this.footer) {
            this.footer.innerHTML = '';
        }
        else {
            this.footer = this.createElement('div');
            sf.base.addClass([this.footer], dropDownListClasses.footer);
        }
        var footercheck = this.dropdownCompiler(this.footerTemplate);
        if (footercheck) {
            compiledString = sf.base.compile(document.querySelector(this.footerTemplate).innerHTML.trim());
        }
        else {
            compiledString = sf.base.compile(this.footerTemplate);
        }
        for (var _i = 0, _a = compiledString({}, null, null, this.footerTemplateId, this.isStringTemplate); _i < _a.length; _i++) {
            var item = _a[_i];
            this.footer.appendChild(item);
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, false, true);
        sf.base.append([this.footer], popupEle);
    };
    DropDownList.prototype.setHeaderTemplate = function (popupEle) {
        var compiledString;
        if (this.header) {
            this.header.innerHTML = '';
        }
        else {
            this.header = this.createElement('div');
            sf.base.addClass([this.header], dropDownListClasses.header);
        }
        var headercheck = this.dropdownCompiler(this.headerTemplate);
        if (headercheck) {
            compiledString = sf.base.compile(document.querySelector(this.headerTemplate).innerHTML.trim());
        }
        else {
            compiledString = sf.base.compile(this.headerTemplate);
        }
        for (var _i = 0, _a = compiledString({}, null, null, this.headerTemplateId, this.isStringTemplate); _i < _a.length; _i++) {
            var item = _a[_i];
            this.header.appendChild(item);
        }
        this.DropDownBaseupdateBlazorTemplates(false, false, false, false, false, true, false);
        var contentEle = popupEle.querySelector('div.e-content');
        popupEle.insertBefore(this.header, contentEle);
    };
    DropDownList.prototype.setOldText = function (text) {
        this.text = text;
    };
    DropDownList.prototype.setOldValue = function (value) {
        this.value = value;
    };
    DropDownList.prototype.refreshPopup = function () {
        if (!sf.base.isNullOrUndefined(this.popupObj) && document.body.contains(this.popupObj.element) &&
            ((this.allowFiltering && !(sf.base.Browser.isDevice && this.isFilterLayout())) || this.getModuleName() === 'autocomplete')) {
            sf.base.removeClass([this.popupObj.element], 'e-popup-close');
            this.popupObj.refreshPosition(this.inputWrapper.container);
            this.popupObj.resolveCollision();
        }
    };
    DropDownList.prototype.checkDatasource = function (newProp) {
        if (newProp.dataSource && !sf.base.isNullOrUndefined(Object.keys(newProp.dataSource)) && this.itemTemplate && this.allowFiltering) {
            this.list = null;
            this.actionCompleteData = { ulElement: null, list: null, isUpdated: false };
        }
        var isChangeValue = Object.keys(newProp).indexOf('value') !== -1 && sf.base.isNullOrUndefined(newProp.value);
        var isChangeText = Object.keys(newProp).indexOf('text') !== -1 && sf.base.isNullOrUndefined(newProp.text);
        if (this.getModuleName() !== 'autocomplete' && this.allowFiltering && (isChangeValue || isChangeText)) {
            this.itemData = null;
        }
    };
    DropDownList.prototype.updateDataSource = function (props) {
        if (this.inputElement.value !== '' || (!sf.base.isNullOrUndefined(props) && (sf.base.isNullOrUndefined(props.dataSource)
            || (!(props.dataSource instanceof sf.data.DataManager) && props.dataSource.length === 0)))) {
            this.clearAll(null, props);
        }
        if (!(!sf.base.isNullOrUndefined(props) && (sf.base.isNullOrUndefined(props.dataSource)
            || (!(props.dataSource instanceof sf.data.DataManager) && props.dataSource.length === 0))) || !(props.dataSource === [])) {
            this.resetList(this.dataSource);
        }
        if (!this.isCustomFilter && !this.isFilterFocus && document.activeElement !== this.filterInput) {
            this.checkCustomValue();
        }
    };
    DropDownList.prototype.checkCustomValue = function () {
        this.itemData = this.getDataByValue(this.value);
        var dataItem = this.getItemData();
        this.setProperties({ 'value': dataItem.value, 'text': dataItem.text });
    };
    DropDownList.prototype.updateInputFields = function () {
        if (this.getModuleName() === 'dropdownlist') {
            sf.inputs.Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
        }
    };
    /**
     * Dynamically change the value of properties.
     * @private
     */
    DropDownList.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (this.getModuleName() === 'dropdownlist') {
            if (!this.isServerBlazor) {
                this.checkDatasource(newProp);
                this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp);
            }
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'query':
                case 'dataSource':
                    break;
                case 'htmlAttributes':
                    this.setHTMLAttributes();
                    break;
                case 'width':
                    this.setEleWidth(newProp.width);
                    break;
                case 'placeholder':
                    sf.inputs.Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    break;
                case 'filterBarPlaceholder':
                    if (this.filterInput) {
                        sf.inputs.Input.setPlaceholder(newProp.filterBarPlaceholder, this.filterInput);
                    }
                    break;
                case 'readonly':
                    if (this.getModuleName() !== 'dropdownlist') {
                        sf.inputs.Input.setReadonly(newProp.readonly, this.inputElement);
                    }
                    break;
                case 'cssClass':
                    this.setCssClass(newProp.cssClass, oldProp.cssClass);
                    break;
                case 'enableRtl':
                    this.setEnableRtl();
                    break;
                case 'enabled':
                    this.setEnable();
                    break;
                case 'text':
                    if (newProp.text === null) {
                        this.clearAll();
                        break;
                    }
                    if (!this.list) {
                        if (this.dataSource instanceof sf.data.DataManager) {
                            this.initRemoteRender = true;
                        }
                        this.renderList();
                    }
                    if (!this.initRemoteRender) {
                        var li = this.getElementByText(newProp.text);
                        if (!this.checkValidLi(li)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.text, oldProp.text, 'text');
                            }
                            else if (!this.isServerBlazor) {
                                this.setOldText(oldProp.text);
                            }
                        }
                        this.updateInputFields();
                    }
                    break;
                case 'value':
                    if (newProp.value === null) {
                        this.clearAll();
                        break;
                    }
                    this.notify('beforeValueChange', { newProp: newProp }); // gird component value type change
                    if (!this.list) {
                        if (this.dataSource instanceof sf.data.DataManager) {
                            this.initRemoteRender = true;
                        }
                        this.renderList();
                    }
                    if (!this.initRemoteRender) {
                        var item = this.getElementByValue(newProp.value);
                        if (!this.checkValidLi(item)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.value, oldProp.value, 'value');
                            }
                            else if (!this.isServerBlazor) {
                                this.setOldValue(oldProp.value);
                            }
                        }
                        this.updateInputFields();
                    }
                    break;
                case 'index':
                    if (newProp.index === null) {
                        this.clearAll();
                        break;
                    }
                    if (!this.list) {
                        if (this.dataSource instanceof sf.data.DataManager) {
                            this.initRemoteRender = true;
                        }
                        this.renderList();
                    }
                    if (!this.initRemoteRender && this.liCollections) {
                        var element = this.liCollections[newProp.index];
                        if (!this.checkValidLi(element)) {
                            if (this.liCollections && this.liCollections.length === 100 &&
                                this.getModuleName() === 'autocomplete' && this.listData.length > 100) {
                                this.setSelectionData(newProp.index, oldProp.index, 'index');
                            }
                            else if (!this.isServerBlazor) {
                                this.index = oldProp.index;
                            }
                        }
                        this.updateInputFields();
                    }
                    break;
                case 'footerTemplate':
                    if (this.popupObj) {
                        this.setFooterTemplate(this.popupObj.element);
                    }
                    break;
                case 'headerTemplate':
                    if (this.popupObj) {
                        this.setHeaderTemplate(this.popupObj.element);
                    }
                    break;
                case 'valueTemplate':
                    if (!sf.base.isNullOrUndefined(this.itemData) && this.valueTemplate != null) {
                        this.setValueTemplate();
                    }
                    break;
                case 'allowFiltering':
                    if (this.allowFiltering) {
                        this.actionCompleteData = { ulElement: this.ulElement,
                            list: this.listData, isUpdated: true };
                        this.updateSelectElementData(this.allowFiltering);
                    }
                    break;
                case 'floatLabelType':
                    sf.inputs.Input.removeFloating(this.inputWrapper);
                    sf.inputs.Input.addFloating(this.inputElement, newProp.floatLabelType, this.placeholder, this.createElement);
                    break;
                case 'showClearButton':
                    sf.inputs.Input.setClearButton(newProp.showClearButton, this.inputElement, this.inputWrapper, null, this.createElement);
                    this.bindClearEvent();
                    break;
                default:
                    var ddlProps = void 0;
                    ddlProps = this.getPropObject(prop, newProp, oldProp);
                    _super.prototype.onPropertyChanged.call(this, ddlProps.newProperty, ddlProps.oldProperty);
                    break;
            }
        }
    };
    DropDownList.prototype.checkValidLi = function (element) {
        if (this.isValidLI(element)) {
            this.setSelection(element, null);
            return true;
        }
        return false;
    };
    DropDownList.prototype.setSelectionData = function (newProp, oldProp, prop) {
        var _this = this;
        var li;
        this.updateListValues = function () {
            if (prop === 'text') {
                li = _this.getElementByText(newProp);
                if (!_this.checkValidLi(li)) {
                    _this.setOldText(oldProp);
                }
            }
            else if (prop === 'value') {
                li = _this.getElementByValue(newProp);
                if (!_this.checkValidLi(li)) {
                    _this.setOldValue(oldProp);
                }
            }
            else if (prop === 'index') {
                li = _this.liCollections[newProp];
                if (!_this.checkValidLi(li)) {
                    _this.index = oldProp;
                }
            }
        };
    };
    DropDownList.prototype.setCssClass = function (newClass, oldClass) {
        if (!sf.base.isNullOrUndefined(oldClass)) {
            oldClass = (oldClass.replace(/\s+/g, ' ')).trim();
        }
        if (!sf.base.isNullOrUndefined(newClass)) {
            newClass = (newClass.replace(/\s+/g, ' ')).trim();
        }
        sf.inputs.Input.setCssClass(newClass, [this.inputWrapper.container], oldClass);
        if (this.popupObj) {
            sf.inputs.Input.setCssClass(newClass, [this.popupObj.element], oldClass);
        }
    };
    /**
     * Return the module name.
     * @private
     */
    DropDownList.prototype.getModuleName = function () {
        return 'dropdownlist';
    };
    /**
     * Opens the popup that displays the list of items.
     * @returns void.
     */
    DropDownList.prototype.showPopup = function () {
        if (!this.enabled) {
            return;
        }
        if (sf.base.isBlazor() && this.itemTemplate) {
            this.DropDownBaseupdateBlazorTemplates(true, false, false, false);
        }
        if (this.beforePopupOpen) {
            this.refreshPopup();
            return;
        }
        this.beforePopupOpen = true;
        if (this.isFiltering() && !this.isActive && this.actionCompleteData.list && this.actionCompleteData.list[0]) {
            this.isActive = true;
            this.onActionComplete(this.actionCompleteData.ulElement, this.actionCompleteData.list, null, true);
        }
        else if (sf.base.isNullOrUndefined(this.list) || !sf.base.isUndefined(this.list) && this.list.classList.contains(sf.dropdowns.dropDownBaseClasses.noData)) {
            this.renderList();
        }
        else if (this.isFiltering() && this.isServerBlazor) {
            this.renderList();
        }
        if (!this.isServerBlazor) {
            this.invokeRenderPopup();
        }
        var popupHolderEle = !this.isFiltering() || document.querySelector('#' + this.element.id + '_popup_holder');
        var isDropdownComp = this.getModuleName() === 'dropdownlist' || !this.isFiltering();
        if (this.isServerBlazor && popupHolderEle && !sf.base.isNullOrUndefined(this.list) && isDropdownComp) {
            this.invokeRenderPopup();
        }
    };
    DropDownList.prototype.invokeRenderPopup = function () {
        if (sf.base.Browser.isDevice && this.isFilterLayout()) {
            var proxy_2 = this;
            window.onpopstate = function () {
                proxy_2.hidePopup();
            };
            history.pushState({}, '');
        }
        if (!sf.base.isNullOrUndefined(this.list.children[0]) || this.list.classList.contains(sf.dropdowns.dropDownBaseClasses.noData)) {
            this.renderPopup();
        }
        sf.base.attributes(this.targetElement(), { 'aria-activedescendant': this.selectedLI ? this.selectedLI.id : null });
    };
    DropDownList.prototype.clientRenderPopup = function (data, popupEle) {
        if (popupEle) {
            this.serverPopupEle = popupEle;
            this.list = popupEle.querySelector('.e-dropdownbase.e-content') ?
                popupEle.querySelector('.e-dropdownbase.e-content') : this.list;
            this.ulElement = this.list.querySelector('ul');
            if (sf.base.isNullOrUndefined(this.ulElement) && !this.list.classList.contains(sf.dropdowns.dropDownBaseClasses.noData)) {
                sf.base.addClass([this.list], [sf.dropdowns.dropDownBaseClasses.noData]);
            }
            this.liCollections = this.ulElement ?
                this.ulElement.querySelectorAll('.' + sf.dropdowns.dropDownBaseClasses.li) : [];
            this.listData = data;
            if (this.getModuleName() === 'autocomplete' && this.liCollections.length > 0) {
                this.renderHightSearch();
            }
            this.initRemoteRender = false;
            if (!this.isPopupOpen) {
                this.serverBlazorUpdateSelection();
            }
            this.unWireListEvents();
            this.wireListEvents();
            if (this.isServerIncrementalSearch && this.searchKeyEvent) {
                this.isServerIncrementalSearch = false;
                this.initial = false;
                this.onServerIncrementalSearch(this.searchKeyEvent);
            }
            if (this.isServerNavigation && this.searchKeyEvent) {
                if (this.searchKeyEvent.action === 'down' || this.searchKeyEvent.action === 'up') {
                    this.isServerNavigation = false;
                    this.updateUpDownAction(this.searchKeyEvent);
                }
                else if (this.searchKeyEvent.action === 'home' || this.searchKeyEvent.action === 'end') {
                    this.isServerNavigation = false;
                    this.updateHomeEndAction(this.searchKeyEvent);
                }
            }
            if (this.beforePopupOpen) {
                this.invokeRenderPopup();
            }
            if (this.getModuleName() !== 'dropdownlist') {
                this.onActionComplete(this.ulElement, this.listData);
            }
        }
        else if (data != null && this.listData !== data) {
            this.listData = data;
            this.initRemoteRender = false;
        }
    };
    DropDownList.prototype.renderHightSearch = function () {
        // update high light search 
    };
    DropDownList.prototype.updateclientItemData = function (data) {
        this.listData = data;
    };
    DropDownList.prototype.initValueItemData = function (selectData) {
        this.itemData = selectData;
        this.previousValue = this.value;
        this.initial = false;
    };
    DropDownList.prototype.serverUpdateListElement = function (data, popupEle) {
        this.listData = data;
        if (this.ulElement) {
            this.liCollections = this.ulElement.querySelectorAll('.' + sf.dropdowns.dropDownBaseClasses.li);
        }
    };
    /**
     * Hides the popup if it is in an open state.
     * @returns void.
     */
    DropDownList.prototype.hidePopup = function (e) {
        var isHeader = (this.headerTemplate) ? true : false;
        var isFooter = (this.headerTemplate) ? true : false;
        this.DropDownBaseresetBlazorTemplates(false, false, false, false, false, isHeader, isFooter);
        if (this.isEscapeKey && this.getModuleName() === 'dropdownlist') {
            sf.inputs.Input.setValue(this.text, this.inputElement, this.floatLabelType, this.showClearButton);
            this.isEscapeKey = false;
            if (!sf.base.isNullOrUndefined(this.index)) {
                var element = this.findListElement(this.ulElement, 'li', 'data-value', this.value);
                this.selectedLI = this.liCollections[this.index] || element;
                if (this.selectedLI) {
                    this.updateSelectedItem(this.selectedLI, null, true);
                    if (this.valueTemplate && this.itemData !== null) {
                        this.setValueTemplate();
                    }
                }
            }
            else {
                this.resetSelection();
            }
        }
        this.closePopup();
        var dataItem = this.getItemData();
        var isSelectVal = this.isServerBlazor ? !sf.base.isNullOrUndefined(this.value) : !sf.base.isNullOrUndefined(this.selectedLI);
        if (this.inputElement.value.trim() === '' && !this.isInteracted && (this.isSelectCustom ||
            isSelectVal && this.inputElement.value !== dataItem.text)) {
            this.isSelectCustom = false;
            this.clearAll(e);
        }
    };
    /**
     * Sets the focus on the component for interaction.
     * @returns void.
     */
    DropDownList.prototype.focusIn = function (e) {
        if (!this.enabled) {
            return;
        }
        if (this.targetElement().classList.contains(dropDownListClasses.disable)) {
            return;
        }
        var isFocused = false;
        if (this.preventFocus && sf.base.Browser.isDevice) {
            this.inputWrapper.container.tabIndex = 1;
            this.inputWrapper.container.focus();
            this.preventFocus = false;
            isFocused = true;
        }
        if (!isFocused) {
            this.targetElement().focus();
        }
        sf.base.addClass([this.inputWrapper.container], [dropDownListClasses.inputFocus]);
        this.onFocus(e);
    };
    /**
     * Moves the focus from the component if the component is already focused.
     * @returns void.
     */
    DropDownList.prototype.focusOut = function (e) {
        if (!this.enabled) {
            return;
        }
        this.isTyped = true;
        this.hidePopup(e);
        this.targetElement().blur();
        sf.base.removeClass([this.inputWrapper.container], [dropDownListClasses.inputFocus]);
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    DropDownList.prototype.destroy = function () {
        this.isActive = false;
        if (!this.isServerBlazor || (this.popupObj && document.body.contains(this.popupObj.element))) {
            this.hidePopup();
        }
        this.unWireEvent();
        if (this.list) {
            this.unWireListEvents();
            if (this.isServerBlazor) {
                if ((this.fields.groupBy) && !this.isGroupChecking) {
                    sf.base.EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
                }
            }
        }
        if (!this.isServerBlazor) {
            if (this.element && !this.element.classList.contains('e-' + this.getModuleName())) {
                return;
            }
            var attrArray = ['readonly', 'aria-disabled', 'aria-placeholder',
                'placeholder', 'aria-owns', 'aria-labelledby', 'aria-haspopup', 'aria-expanded',
                'aria-activedescendant', 'autocomplete', 'aria-readonly', 'autocorrect',
                'autocapitalize', 'spellcheck', 'aria-autocomplete', 'aria-live', 'aria-describedby', 'aria-label'];
            for (var i = 0; i < attrArray.length; i++) {
                this.inputElement.removeAttribute(attrArray[i]);
            }
            this.inputElement.setAttribute('tabindex', this.tabIndex);
            this.inputElement.classList.remove('e-input');
            sf.inputs.Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
            this.element.style.display = 'block';
            if (this.inputWrapper.container.parentElement.tagName === this.getNgDirective()) {
                sf.base.detach(this.inputWrapper.container);
            }
            else {
                this.inputWrapper.container.parentElement.insertBefore(this.element, this.inputWrapper.container);
                sf.base.detach(this.inputWrapper.container);
            }
            _super.prototype.destroy.call(this);
        }
    };
    
    /**
     * Gets all the list items bound on this component.
     * @returns Element[].
     */
    DropDownList.prototype.getItems = function () {
        if (!this.list) {
            if (this.dataSource instanceof sf.data.DataManager) {
                this.initRemoteRender = true;
            }
            this.renderList();
        }
        return this.ulElement ? _super.prototype.getItems.call(this) : [];
    };
    /**
     * Gets the data Object that matches the given value.
     * @param { string | number } value - Specifies the value of the list item.
     * @returns Object.
     * @blazorType object
     */
    DropDownList.prototype.getDataByValue = function (value) {
        return _super.prototype.getDataByValue.call(this, value);
    };
    /**
     * Allows you to clear the selected values from the component.
     * @returns void.
     */
    DropDownList.prototype.clear = function () {
        this.value = null;
    };
    __decorate([
        sf.base.Property(null)
    ], DropDownList.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property('100%')
    ], DropDownList.prototype, "width", void 0);
    __decorate([
        sf.base.Property('300px')
    ], DropDownList.prototype, "popupHeight", void 0);
    __decorate([
        sf.base.Property('100%')
    ], DropDownList.prototype, "popupWidth", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownList.prototype, "placeholder", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownList.prototype, "filterBarPlaceholder", void 0);
    __decorate([
        sf.base.Property({})
    ], DropDownList.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownList.prototype, "query", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownList.prototype, "valueTemplate", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownList.prototype, "headerTemplate", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownList.prototype, "footerTemplate", void 0);
    __decorate([
        sf.base.Property(false)
    ], DropDownList.prototype, "allowFiltering", void 0);
    __decorate([
        sf.base.Property(false)
    ], DropDownList.prototype, "readonly", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownList.prototype, "text", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownList.prototype, "value", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownList.prototype, "index", void 0);
    __decorate([
        sf.base.Property('Never')
    ], DropDownList.prototype, "floatLabelType", void 0);
    __decorate([
        sf.base.Property(false)
    ], DropDownList.prototype, "showClearButton", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownList.prototype, "filtering", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownList.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownList.prototype, "beforeOpen", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownList.prototype, "open", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownList.prototype, "close", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownList.prototype, "blur", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownList.prototype, "focus", void 0);
    DropDownList = __decorate([
        sf.base.NotifyPropertyChanges
    ], DropDownList);
    return DropDownList;
}(sf.dropdowns.DropDownBase));

/**
 * export all modules from current location
 */

exports.dropDownListClasses = dropDownListClasses;
exports.DropDownList = DropDownList;

return exports;

});
sfBlazor.modules["dropdownlist"] = "dropdowns.DropDownList";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.dropdownlist, () => {
    sf.dropdowns = sf.base.extend({}, sf.dropdowns, sfdropdownlist({}));
});