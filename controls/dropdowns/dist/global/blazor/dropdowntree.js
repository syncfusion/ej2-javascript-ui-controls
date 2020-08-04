window.sf = window.sf || {};
var sfdropdowntree = (function (exports) {
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
var RTL = 'e-rtl';
var DROPDOWNTREE = 'e-ddt';
var HIDDENELEMENT = 'e-ddt-hidden';
var DROPDOWNICON = 'e-input-group-icon e-ddt-icon e-icons';
var SHOW_CHIP = 'e-show-chip';
var SHOW_CLEAR = 'e-show-clear';
var SHOW_DD_ICON = 'e-show-dd-icon';
var CHIP_INPUT = 'e-chip-input';
var INPUTFOCUS = 'e-input-focus';
var INPUTGROUP = 'e-input-group';
var ICONANIMATION = 'e-icon-anim';
var CLOSEICON_CLASS = 'e-clear-icon e-icons';
var CHIP_WRAPPER = 'e-chips-wrapper';
var CHIP_COLLECTION = 'e-chips-collection';
var CHIP = 'e-chips';
var CHIP_CONTENT = 'e-chipcontent';
var CHIP_CLOSE = 'e-chips-close';
var HIDEICON = 'e-icon-hide';
var POPUP_CLASS = 'e-ddt e-popup';
var PARENTITEM = 'e-list-parent';
var CONTENT = 'e-popup-content';
var DROPDOWN = 'e-dropdown';
var DISABLED = 'e-disabled';
var ICONS = 'e-icons';
var CHECKALLPARENT = 'e-selectall-parent';
var CHECKALLHIDE = 'e-hide-selectall';
var BIGGER = 'e-bigger';
var SMALL = 'e-small';
var ALLTEXT = 'e-all-text';
var CHECKBOXFRAME = 'e-frame';
var CHECK = 'e-check';
var CHECKBOXWRAP = 'e-checkbox-wrapper';
var FILTERWRAP = 'e-filter-wrap';
var DDTICON = 'e-ddt-icon';
var FOOTER = 'e-ddt-footer';
var HEADER = 'e-ddt-header';
var NODATACONTAINER = 'e-ddt-nodata';
var NODATA = 'e-no-data';
var HEADERTEMPLATE = 'HeaderTemplate';
var FOOTERTEMPLATE = 'FooterTemplate';
var NORECORDSTEMPLATE = 'NoRecordsTemplate';
var ACTIONFAILURETEMPLATE = 'ActionFailureTemplate';
var Fields = /** @class */ (function (_super) {
    __extends(Fields, _super);
    function Fields() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property('child')
    ], Fields.prototype, "child", void 0);
    __decorate([
        sf.base.Property([])
    ], Fields.prototype, "dataSource", void 0);
    __decorate([
        sf.base.Property('expanded')
    ], Fields.prototype, "expanded", void 0);
    __decorate([
        sf.base.Property('hasChildren')
    ], Fields.prototype, "hasChildren", void 0);
    __decorate([
        sf.base.Property('htmlAttributes')
    ], Fields.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Property('iconCss')
    ], Fields.prototype, "iconCss", void 0);
    __decorate([
        sf.base.Property('imageUrl')
    ], Fields.prototype, "imageUrl", void 0);
    __decorate([
        sf.base.Property('parentValue')
    ], Fields.prototype, "parentValue", void 0);
    __decorate([
        sf.base.Property(null)
    ], Fields.prototype, "query", void 0);
    __decorate([
        sf.base.Property('selected')
    ], Fields.prototype, "selected", void 0);
    __decorate([
        sf.base.Property(null)
    ], Fields.prototype, "tableName", void 0);
    __decorate([
        sf.base.Property('text')
    ], Fields.prototype, "text", void 0);
    __decorate([
        sf.base.Property('tooltip')
    ], Fields.prototype, "tooltip", void 0);
    __decorate([
        sf.base.Property('value')
    ], Fields.prototype, "value", void 0);
    return Fields;
}(sf.base.ChildProperty));
var TreeSettings = /** @class */ (function (_super) {
    __extends(TreeSettings, _super);
    function TreeSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property(false)
    ], TreeSettings.prototype, "autoCheck", void 0);
    __decorate([
        sf.base.Property('Auto')
    ], TreeSettings.prototype, "expandOn", void 0);
    __decorate([
        sf.base.Property(false)
    ], TreeSettings.prototype, "loadOnDemand", void 0);
    return TreeSettings;
}(sf.base.ChildProperty));
/**
 * The Dropdown Tree control allows you to select single or multiple values from hierarchical data in a tree-like structure.
 * It has several out-of-the-box features, such as data binding, check boxes, templates, filter,
 * UI customization, accessibility, and preselected values.
 * ```html
 *  <input type="text" id="tree"></input>
 * ```
 * ```typescript
 *  let ddtObj: DropDownTree = new DropDownTree();
 *  ddtObj.appendTo("#tree");
 * ```
 */
var DropDownTree = /** @class */ (function (_super) {
    __extends(DropDownTree, _super);
    function DropDownTree(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.filterTimer = null;
        _this.isFilteredData = false;
        _this.isFilterRestore = false;
        _this.selectedData = [];
        _this.filterDelayTime = 300;
        return _this;
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @hidden
     */
    DropDownTree.prototype.getPersistData = function () {
        var keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Initialize the event handler.
     * @private
     */
    DropDownTree.prototype.preRender = function () {
        this.inputFocus = false;
        this.isPopupOpen = false;
        this.isFirstRender = true;
        this.isInitialized = false;
        this.currentText = null;
        this.currentValue = null;
        this.oldValue = null;
        this.removeValue = false;
        this.selectedText = [];
        this.treeItems = [];
        this.dataValue = null;
        this.isNodeSelected = false;
        this.isDynamicChange = false;
        this.isBlazorPlatForm = sf.base.isBlazor();
        this.headerTemplateId = "" + this.element.id + HEADERTEMPLATE;
        this.footerTemplateId = "" + this.element.id + FOOTERTEMPLATE;
        this.actionFailureTemplateId = "" + this.element.id + ACTIONFAILURETEMPLATE;
        this.noRecordsTemplateId = "" + this.element.id + NORECORDSTEMPLATE;
        this.keyConfigs = {
            escape: 'escape',
            altUp: 'alt+uparrow',
            altDown: 'alt+downarrow',
            tab: 'tab',
            shiftTab: 'shift+tab',
            end: 'end',
            enter: 'enter',
            home: 'home',
            moveDown: 'downarrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            ctrlDown: 'ctrl+downarrow',
            ctrlUp: 'ctrl+uparrow',
            ctrlEnter: 'ctrl+enter',
            ctrlHome: 'ctrl+home',
            ctrlEnd: 'ctrl+end',
            shiftDown: 'shift+downarrow',
            shiftUp: 'shift+uparrow',
            shiftEnter: 'shift+enter',
            shiftHome: 'shift+home',
            shiftEnd: 'shift+end',
            csDown: 'ctrl+shift+downarrow',
            csUp: 'ctrl+shift+uparrow',
            csEnter: 'ctrl+shift+enter',
            csHome: 'ctrl+shift+home',
            csEnd: 'ctrl+shift+end',
            space: 'space',
            ctrlA: 'ctrl+A'
        };
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    DropDownTree.prototype.render = function () {
        this.ensureAutoCheck();
        if (this.element.tagName === 'INPUT') {
            this.inputEle = this.element;
            if (sf.base.isNullOrUndefined(this.inputEle.getAttribute('role'))) {
                this.inputEle.setAttribute('role', 'textbox');
            }
            if (sf.base.isNullOrUndefined(this.inputEle.getAttribute('type'))) {
                this.inputEle.setAttribute('type', 'text');
            }
        }
        else {
            this.inputEle = this.createElement('input', { attrs: { role: 'textbox', type: 'text' } });
            this.element.parentElement.insertBefore(this.inputEle, this.element);
        }
        this.inputObj = sf.inputs.Input.createInput({
            element: this.inputEle,
            floatLabelType: this.floatLabelType,
            buttons: this.showDropDownIcon ? [DROPDOWNICON] : null,
            properties: {
                readonly: true,
                placeholder: this.placeholder,
                enabled: this.enabled,
                cssClass: this.cssClass,
                enableRtl: this.enableRtl,
            },
        }, this.createElement);
        this.inputWrapper = this.inputObj.container;
        if (!this.inputWrapper.classList.contains(INPUTGROUP)) {
            this.inputWrapper.classList.add(INPUTGROUP);
        }
        if (this.showDropDownIcon) {
            this.inputWrapper.classList.add(SHOW_DD_ICON);
        }
        if (this.element.tagName === this.getDirective()) {
            this.element.appendChild(this.inputWrapper);
        }
        this.createHiddenElement();
        this.createClearIcon();
        this.inputWrapper.classList.add(DROPDOWNTREE);
        this.setElementWidth(this.width);
        this.setAttributes();
        this.updateDataAttribute();
        this.setHTMLAttributes();
        this.popupDiv = this.createElement('div', { className: CONTENT, attrs: { 'tabindex': '0' } });
        this.popupDiv.classList.add(DROPDOWN);
        this.tree = this.createElement('div', { id: this.element.id + '_tree', });
        this.popupDiv.appendChild(this.tree);
        document.body.appendChild(this.popupDiv);
        this.wireTreeEvents();
        this.popupDiv.style.display = 'none';
        this.renderTree();
        this.isRemoteData = this.fields.dataSource instanceof sf.data.DataManager;
        if (!this.isRemoteData) {
            this.setTreeValue();
            this.setTreeText();
            this.updateHiddenValue();
            this.setSelectedValue();
        }
        if ((this.allowMultiSelection || this.showCheckBox) && this.mode !== 'Delimiter') {
            this.createChip();
        }
        this.wireEvents();
        var firstUl = sf.base.select('.' + PARENTITEM, this.treeObj.element);
        if (firstUl && firstUl.getAttribute('aria-multiselectable')) {
            firstUl.removeAttribute('aria-multiselectable');
        }
        this.oldValue = this.value;
        this.isInitialized = true;
        this.renderComplete();
    };
    DropDownTree.prototype.ensureAutoCheck = function () {
        if (this.allowFiltering && this.treeSettings.autoCheck) {
            this.setProperties({ treeSettings: { autoCheck: false } }, true);
        }
    };
    DropDownTree.prototype.hideCheckAll = function (flag) {
        var checkAllEle = !sf.base.isNullOrUndefined(this.popupEle) ? this.popupEle.querySelector('.' + CHECKALLPARENT) : null;
        if (!sf.base.isNullOrUndefined(checkAllEle)) {
            if (flag && !checkAllEle.classList.contains(CHECKALLHIDE)) {
                sf.base.addClass([checkAllEle], CHECKALLHIDE);
            }
            else if (!flag && checkAllEle.classList.contains(CHECKALLHIDE)) {
                sf.base.removeClass([checkAllEle], CHECKALLHIDE);
            }
        }
    };
    DropDownTree.prototype.renderFilter = function () {
        this.filterContainer = this.createElement('div', {
            id: this.element.id + '_filter_wrap',
            className: FILTERWRAP
        });
        var filterInput = this.createElement('input', {
            id: this.element.id + '_filter',
            attrs: { autocomplete: 'off', 'aria-label': this.filterBarPlaceholder }
        });
        this.filterContainer.appendChild(filterInput);
        sf.base.prepend([this.filterContainer], this.popupEle);
        this.filterObj = new sf.inputs.TextBox({
            value: '',
            showClearButton: true,
            placeholder: this.filterBarPlaceholder,
            input: this.filterChangeHandler.bind(this),
        });
        this.filterObj.appendTo('#' + this.element.id + '_filter');
    };
    DropDownTree.prototype.filterChangeHandler = function (args) {
        var _this = this;
        if (!sf.base.isNullOrUndefined(args.value)) {
            window.clearTimeout(this.filterTimer);
            this.filterTimer = window.setTimeout(function () { _this.filterHandler(args.value, args.event); }, this.filterDelayTime);
        }
    };
    DropDownTree.prototype.filterHandler = function (value, event) {
        var _this = this;
        if (!this.isFilteredData) {
            this.treeData = this.treeObj.getTreeData();
        }
        var filterFields = this.cloneFields(this.fields);
        var args = {
            cancel: false,
            preventDefaultAction: false,
            event: event,
            text: value,
            fields: filterFields
        };
        this.trigger('filtering', args, function (args) {
            if (!args.cancel) {
                var flag = false;
                var fields = void 0;
                _this.isFilteredData = true;
                if (value === '') {
                    _this.isFilteredData = false;
                    _this.isFilterRestore = true;
                    fields = _this.cloneFields(_this.fields);
                }
                else if (args.preventDefaultAction) {
                    fields = args.fields;
                }
                else {
                    if (_this.treeDataType === 1) {
                        fields = _this.selfReferencefilter(value, args.fields);
                    }
                    else {
                        if (_this.fields.dataSource instanceof sf.data.DataManager) {
                            flag = true;
                        }
                        else {
                            fields = _this.nestedFilter(value, args.fields);
                        }
                    }
                }
                _this.hideCheckAll(_this.isFilteredData);
                if (flag) {
                    return;
                }
                _this.treeObj.fields = _this.getTreeFields(fields);
                _this.treeObj.dataBind();
            }
        });
    };
    DropDownTree.prototype.nestedFilter = function (value, filteredFields) {
        var matchedDataSource = [];
        for (var i = 0; i < this.treeData.length; i++) {
            var filteredChild = this.nestedChildFilter(value, this.treeData[i]);
            if (!sf.base.isNullOrUndefined(filteredChild)) {
                matchedDataSource.push(filteredChild);
            }
        }
        filteredFields.dataSource = matchedDataSource;
        return filteredFields;
    };
    DropDownTree.prototype.nestedChildFilter = function (value, node) {
        var children = node[this.fields.child];
        if (sf.base.isNullOrUndefined(children)) {
            return (this.isMatchedNode(value, node)) ? node : null;
        }
        else {
            var matchedChildren = [];
            for (var i = 0; i < children.length; i++) {
                var filteredChild = this.nestedChildFilter(value, children[i]);
                if (!sf.base.isNullOrUndefined(filteredChild)) {
                    matchedChildren.push(filteredChild);
                }
            }
            if (matchedChildren.length !== 0) {
                node[this.fields.child] = matchedChildren;
                return node;
            }
            else {
                node[this.fields.child] = null;
                return (this.isMatchedNode(value, node)) ? node : null;
            }
        }
    };
    DropDownTree.prototype.selfReferencefilter = function (value, filteredFields) {
        var matchedData = [];
        var matchedDataSource = [];
        for (var i = 0; i < this.treeData.length; i++) {
            if (this.isMatchedNode(value, this.treeData[i])) {
                matchedData.push(this.treeData[i]);
            }
        }
        for (var i = 0; i < matchedData.length; i++) {
            if (matchedDataSource.indexOf(matchedData[i]) === -1) {
                matchedDataSource.push(matchedData[i]);
                var parentId = matchedData[i][this.fields.parentValue];
                while (!sf.base.isNullOrUndefined(parentId)) {
                    var parent_1 = null;
                    for (var j = 0; j < this.treeData.length; j++) {
                        var value_1 = this.treeData[j][this.fields.value];
                        if (!sf.base.isNullOrUndefined(value_1) && (value_1 === parentId)) {
                            parent_1 = this.treeData[j];
                            break;
                        }
                    }
                    if (!sf.base.isNullOrUndefined(parent_1) && (matchedDataSource.indexOf(parent_1) === -1)) {
                        matchedDataSource.push(parent_1);
                        parentId = parent_1[this.fields.parentValue];
                    }
                    else {
                        break;
                    }
                }
            }
        }
        filteredFields.dataSource = matchedDataSource;
        return filteredFields;
    };
    DropDownTree.prototype.isMatchedNode = function (value, node) {
        var checkValue = node[this.fields.text];
        if (this.ignoreCase) {
            checkValue = checkValue.toLowerCase();
            value = value.toLowerCase();
        }
        if (this.ignoreAccent) {
            checkValue = sf.data.DataUtil.ignoreDiacritics(checkValue);
            value = sf.data.DataUtil.ignoreDiacritics(value);
        }
        if (this.filterType === 'StartsWith') {
            return checkValue.slice(0, value.length) === value;
        }
        else if (this.filterType === 'EndsWith') {
            return checkValue.slice(-value.length) === value;
        }
        else {
            return checkValue.indexOf(value) !== -1;
        }
    };
    /* To wire events for the dropdown tree */
    DropDownTree.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.inputWrapper, 'mouseup', this.dropDownClick, this);
        sf.base.EventHandler.add(this.inputWrapper, 'focus', this.focusIn, this);
        sf.base.EventHandler.add(this.inputWrapper, 'blur', this.focusOut, this);
        sf.base.EventHandler.add(this.inputWrapper, 'mousemove', this.mouseIn, this);
        sf.base.EventHandler.add(this.inputWrapper, 'mouseout', this.onMouseLeave, this);
        sf.base.EventHandler.add(this.overAllClear, 'mousedown', this.clearAll, this);
        sf.base.EventHandler.add(window, 'resize', this.windowResize, this);
        var formElement = sf.base.closest(this.inputWrapper, 'form');
        if (formElement) {
            sf.base.EventHandler.add(formElement, 'reset', this.resetValueHandler, this);
        }
        this.keyboardModule = new sf.base.KeyboardEvents(this.inputWrapper, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    };
    DropDownTree.prototype.wireTreeEvents = function () {
        this.keyboardModule = new sf.base.KeyboardEvents(this.tree, {
            keyAction: this.treeAction.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    };
    DropDownTree.prototype.wireCheckAllWrapperEvents = function () {
        this.keyboardModule = new sf.base.KeyboardEvents(this.checkAllParent, {
            keyAction: this.checkAllAction.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    };
    /* To unwire events for the dropdown tree */
    DropDownTree.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(this.inputWrapper, 'mouseup', this.dropDownClick);
        sf.base.EventHandler.remove(this.inputWrapper, 'focus', this.focusIn);
        sf.base.EventHandler.remove(this.inputWrapper, 'blur', this.focusOut);
        sf.base.EventHandler.remove(this.inputWrapper, 'mousemove', this.mouseIn);
        sf.base.EventHandler.remove(this.inputWrapper, 'mouseout', this.onMouseLeave);
        sf.base.EventHandler.remove(this.overAllClear, 'mousedown', this.clearAll);
        sf.base.EventHandler.remove(window, 'resize', this.windowResize);
        var formElement = sf.base.closest(this.inputWrapper, 'form');
        if (formElement) {
            sf.base.EventHandler.remove(formElement, 'reset', this.resetValueHandler);
        }
    };
    /* Trigger when the dropdown is clicked */
    DropDownTree.prototype.dropDownClick = function (e) {
        if (!this.enabled || this.readonly) {
            return;
        }
        if (this.isClearButtonClick) {
            this.isClearButtonClick = false;
            return;
        }
        if (this.isPopupOpen) {
            this.hidePopup();
        }
        else {
            this.focusIn(e);
            this.renderPopup();
        }
        this.showOverAllClear();
    };
    DropDownTree.prototype.mouseIn = function () {
        if (this.enabled || !this.readonly) {
            this.showOverAllClear();
        }
    };
    DropDownTree.prototype.onMouseLeave = function () {
        if (!this.inputFocus) {
            sf.base.addClass([this.overAllClear], HIDEICON);
            sf.base.removeClass([this.inputWrapper], SHOW_CLEAR);
        }
    };
    DropDownTree.prototype.getDirective = function () {
        return 'EJS-DROPDOWNTREE';
    };
    DropDownTree.prototype.focusOut = function (e) {
        if (!this.enabled || this.readonly || !this.inputFocus) {
            return;
        }
        if ((sf.base.Browser.isIE || sf.base.Browser.info.name === 'edge') && (e.target === this.inputWrapper)) {
            return;
        }
        var target = e.relatedTarget;
        if ((target !== this.inputEle) && (sf.base.isNullOrUndefined(target)) && (e.target !== this.inputWrapper || !this.isPopupOpen)) {
            this.onFocusOut(e);
        }
    };
    DropDownTree.prototype.onFocusOut = function (event) {
        this.inputFocus = false;
        if (this.isPopupOpen) {
            this.hidePopup();
        }
        if (this.isClearButtonClick) {
            this.isClearButtonClick = false;
        }
        if (this.showClearButton) {
            sf.base.addClass([this.overAllClear], HIDEICON);
            sf.base.removeClass([this.inputWrapper], SHOW_CLEAR);
        }
        sf.base.removeClass([this.inputWrapper], [INPUTFOCUS]);
        if ((this.allowMultiSelection || this.showCheckBox) && this.mode !== 'Delimiter') {
            var isValue = this.value ? (this.value.length ? true : false) : false;
            if (this.chipWrapper && (this.mode === 'Default') || (this.mode === 'Box' && !isValue)) {
                sf.base.addClass([this.chipWrapper], HIDEICON);
                sf.base.removeClass([this.inputWrapper], SHOW_CHIP);
                sf.base.removeClass([this.inputEle], CHIP_INPUT);
            }
        }
        if (this.changeOnBlur) {
            this.triggerChangeEvent(event);
        }
        this.removeValue = false;
        this.oldValue = this.value;
        this.trigger('blur');
    };
    DropDownTree.prototype.triggerChangeEvent = function (event) {
        var isEqual = this.compareValues(this.oldValue, this.value);
        if ((!isEqual || this.isChipDelete) && !this.removeValue) {
            var eventArgs = {
                e: event,
                oldValue: this.oldValue,
                value: this.value,
                isInteracted: event ? true : false,
                element: this.element
            };
            this.trigger('change', eventArgs);
        }
    };
    DropDownTree.prototype.compareValues = function (oldValue, newValue) {
        if (oldValue === null || oldValue.length === 0) {
            var isValid = oldValue === null ? ((newValue === oldValue) ? true : false) :
                (oldValue.length === 0 ? (newValue === oldValue) : false);
            return isValid;
        }
        else if (oldValue.length !== newValue.length) {
            return false;
        }
        for (var i = 0; i < oldValue.length; i++) {
            if (oldValue[i] !== newValue[i]) {
                return false;
            }
        }
        return true;
    };
    DropDownTree.prototype.focusIn = function (e) {
        if (!this.enabled || this.readonly || this.inputFocus) {
            return;
        }
        this.showOverAllClear();
        this.inputFocus = true;
        sf.base.addClass([this.inputWrapper], [INPUTFOCUS]);
        if ((this.allowMultiSelection || this.showCheckBox) && this.mode === 'Default' && this.inputFocus) {
            if (this.chipWrapper && (this.value && this.value.length !== 0)) {
                sf.base.removeClass([this.chipWrapper], HIDEICON);
                sf.base.addClass([this.inputWrapper], SHOW_CHIP);
                sf.base.addClass([this.inputEle], CHIP_INPUT);
            }
            if (this.popupObj) {
                this.popupObj.refreshPosition();
            }
        }
        var args = { isInteracted: e ? true : false, event: e };
        this.trigger('focus', args);
    };
    DropDownTree.prototype.treeAction = function (e) {
        var _this = this;
        var eventArgs = {
            cancel: false,
            event: e,
        };
        this.trigger('keyPress', eventArgs, function (observedArgs) {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'escape':
                    case 'altUp':
                        _this.inputWrapper.focus();
                        e.preventDefault();
                        if (_this.isPopupOpen) {
                            _this.hidePopup();
                        }
                        break;
                    case 'tab':
                    case 'shiftTab':
                        if (_this.isPopupOpen) {
                            _this.hidePopup();
                        }
                        break;
                    case 'enter':
                    case 'ctrlEnter':
                    case 'shiftEnter':
                    case 'csEnter':
                        if (!_this.showCheckBox) {
                            _this.isValueChange = true;
                            _this.keyEventArgs = e;
                        }
                        break;
                    case 'space':
                        _this.isValueChange = true;
                        _this.keyEventArgs = e;
                        break;
                    case 'ctrlA':
                        if (_this.allowMultiSelection) {
                            _this.selectAll(true);
                        }
                        break;
                    case 'moveRight':
                    case 'moveLeft':
                    case 'shiftDown':
                    case 'moveDown':
                    case 'ctrlDown':
                    case 'csDown':
                    case 'shiftUp':
                    case 'moveUp':
                    case 'ctrlUp':
                    case 'csUp':
                    case 'home':
                    case 'shiftHome':
                    case 'ctrlHome':
                    case 'csHome':
                    case 'end':
                    case 'shiftEnd':
                    case 'ctrlEnd':
                    case 'csEnd':
                }
            }
            else {
                e.stopImmediatePropagation();
            }
        });
    };
    DropDownTree.prototype.keyActionHandler = function (e) {
        var _this = this;
        var eventArgs = {
            cancel: false,
            event: e,
        };
        this.trigger('keyPress', eventArgs, function (observedArgs) {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'escape':
                    case 'altUp':
                    case 'shiftTab':
                    case 'tab':
                        if (_this.isPopupOpen) {
                            _this.hidePopup();
                        }
                        break;
                    case 'altDown':
                        if (!_this.isPopupOpen) {
                            _this.showPopup();
                            e.preventDefault();
                        }
                        break;
                    case 'moveDown':
                        if (_this.showSelectAll && _this.showCheckBox) {
                            _this.checkAllParent.focus();
                        }
                        break;
                }
            }
        });
    };
    DropDownTree.prototype.checkAllAction = function (e) {
        var _this = this;
        var eventArgs = {
            cancel: false,
            event: e,
        };
        this.trigger('keyPress', eventArgs, function (observedArgs) {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'space':
                        _this.clickHandler(e);
                        break;
                    case 'moveDown':
                        _this.treeObj.element.focus();
                }
            }
        });
    };
    DropDownTree.prototype.windowResize = function () {
        if (this.popupObj) {
            this.popupObj.setProperties({ width: this.setWidth() });
            this.popupObj.refreshPosition();
        }
    };
    DropDownTree.prototype.resetValueHandler = function (e) {
        var formElement = sf.base.closest(this.inputWrapper, 'form');
        if (formElement && e.target === formElement) {
            this.resetValue(true);
        }
    };
    DropDownTree.prototype.getAriaAttributes = function () {
        var disable = this.enabled ? 'false' : 'true';
        return {
            'aria-disabled': disable,
            'aria-owns': this.element.id + '_options',
            'role': 'listbox',
            'aria-haspopup': 'true',
            'aria-expanded': 'false',
            'aria-activedescendant': 'null',
            'aria-labelledby': this.hiddenElement.id
        };
    };
    DropDownTree.prototype.createHiddenElement = function () {
        if (this.allowMultiSelection || this.showCheckBox) {
            this.hiddenElement = this.createElement('select', {
                attrs: { 'aria-hidden': 'true', 'class': HIDDENELEMENT, 'tabindex': '-1', 'multiple': '' }
            });
        }
        else {
            this.hiddenElement = this.createElement('select', {
                attrs: { 'aria-hidden': 'true', 'tabindex': '-1', 'class': HIDDENELEMENT }
            });
        }
        sf.base.prepend([this.hiddenElement], this.inputWrapper);
        this.validationAttribute();
    };
    DropDownTree.prototype.createClearIcon = function () {
        this.overAllClear = this.createElement('span', {
            className: CLOSEICON_CLASS
        });
        sf.base.addClass([this.overAllClear], HIDEICON);
        sf.base.removeClass([this.inputWrapper], SHOW_CLEAR);
        if (this.showClearButton) {
            this.inputWrapper.insertBefore(this.overAllClear, this.inputObj.buttons[0]);
        }
    };
    DropDownTree.prototype.validationAttribute = function () {
        var name = this.inputEle.getAttribute('name') ? this.inputEle.getAttribute('name') : this.inputEle.getAttribute('id');
        this.hiddenElement.setAttribute('name', name);
        this.inputEle.removeAttribute('name');
        var attributes$$1 = ['required', 'aria-required', 'form'];
        for (var i = 0; i < attributes$$1.length; i++) {
            var attr = this.inputEle.getAttribute(attributes$$1[i]);
            if (attr) {
                this.hiddenElement.setAttribute(attributes$$1[i], attr);
                this.inputEle.removeAttribute(attributes$$1[i]);
            }
        }
    };
    DropDownTree.prototype.createChip = function () {
        if (!this.inputWrapper.contains(this.chipWrapper)) {
            this.chipWrapper = this.createElement('span', {
                className: CHIP_WRAPPER,
            });
            this.chipCollection = this.createElement('span', {
                className: CHIP_COLLECTION
            });
            this.chipWrapper.appendChild(this.chipCollection);
            this.inputWrapper.insertBefore(this.chipWrapper, this.hiddenElement);
            sf.base.addClass([this.inputWrapper], SHOW_CHIP);
            var isValid = this.getValidMode();
            if (isValid && this.value !== null) {
                sf.base.addClass([this.inputEle], CHIP_INPUT);
            }
            else if (this.value === null) {
                sf.base.addClass([this.chipWrapper], HIDEICON);
            }
        }
    };
    DropDownTree.prototype.getValidMode = function () {
        if (this.allowMultiSelection || this.showCheckBox) {
            return this.mode === 'Box' ? true : (this.mode === 'Default' && this.inputFocus) ? true : false;
        }
        else {
            return false;
        }
    };
    DropDownTree.prototype.createSelectAllWrapper = function () {
        this.checkAllParent = this.createElement('div', {
            className: CHECKALLPARENT, attrs: { 'tabindex': '0' }
        });
        this.selectAllSpan = this.createElement('span', {
            className: ALLTEXT
        });
        this.selectAllSpan.textContent = '';
        var ele = sf.base.closest(this.element, '.' + BIGGER);
        var touchClass = sf.base.isNullOrUndefined(ele) ? '' : SMALL;
        this.checkBoxElement = sf.buttons.createCheckBox(this.createElement, true, { cssClass: touchClass });
        this.checkBoxElement.setAttribute('role', 'checkbox');
        this.checkAllParent.appendChild(this.checkBoxElement);
        this.checkAllParent.appendChild(this.selectAllSpan);
        this.setLocale();
        sf.base.EventHandler.add(this.checkAllParent, 'mouseup', this.clickHandler, this);
        this.wireCheckAllWrapperEvents();
    };
    DropDownTree.prototype.clickHandler = function (e) {
        var target;
        if ((e.currentTarget && e.currentTarget.classList.contains(CHECKALLPARENT))) {
            target = e.currentTarget.firstElementChild.lastElementChild;
        }
        else {
            target = e.target;
        }
        this.checkWrapper = sf.base.closest(target, '.' + CHECKBOXWRAP);
        if (!sf.base.isNullOrUndefined(this.checkWrapper)) {
            var checkElement = sf.base.select('.' + CHECKBOXFRAME, this.checkWrapper);
            this.changeState(this.checkWrapper, checkElement.classList.contains(CHECK) ? 'uncheck' : 'check', e);
        }
        e.preventDefault();
    };
    DropDownTree.prototype.changeState = function (wrapper, state, e) {
        var ariaState;
        var frameSpan = wrapper.getElementsByClassName(CHECKBOXFRAME)[0];
        if (state === 'check' && !frameSpan.classList.contains(CHECK)) {
            frameSpan.classList.add(CHECK);
            ariaState = 'true';
            if (!this.isReverseUpdate) {
                this.treeObj.checkAll();
                if (!this.changeOnBlur) {
                    this.triggerChangeEvent(e);
                }
            }
            this.setLocale(true);
        }
        else if (state === 'uncheck' && (frameSpan.classList.contains(CHECK))) {
            frameSpan.classList.remove(CHECK);
            ariaState = 'false';
            if (!this.isReverseUpdate) {
                this.treeObj.uncheckAll();
                if (!this.changeOnBlur) {
                    this.triggerChangeEvent(e);
                }
            }
            this.setLocale(false);
        }
        this.setMultiSelect();
        this.ensurePlaceHolder();
        ariaState = state === 'check' ? 'true' : 'false';
        if (!sf.base.isNullOrUndefined(ariaState)) {
            wrapper.setAttribute('aria-checked', ariaState);
        }
    };
    DropDownTree.prototype.setLocale = function (unSelect) {
        if (!this.selectAllSpan) {
            return;
        }
        if (this.selectAllText !== 'Select All' || this.unSelectAllText !== 'Unselect All') {
            var template = unSelect ? this.unSelectAllText : this.selectAllText;
            var compiledString = void 0;
            this.selectAllSpan.textContent = '';
            compiledString = sf.base.compile(template);
            for (var _i = 0, _a = compiledString({}, null, null, null, !this.isStringTemplate); _i < _a.length; _i++) {
                var item = _a[_i];
                this.selectAllSpan.textContent = item.textContent;
            }
        }
        else {
            this.selectAllSpan.textContent = unSelect ? this.unSelectAllText : this.selectAllText;
        }
    };
    DropDownTree.prototype.setAttributes = function () {
        this.element.removeAttribute('tabindex');
        var id = this.element.getAttribute('id');
        this.hiddenElement.id = id + '_hidden';
        this.inputWrapper.setAttribute('tabindex', '0');
        sf.base.attributes(this.inputWrapper, this.getAriaAttributes());
    };
    DropDownTree.prototype.setHTMLAttributes = function () {
        if (Object.keys(this.htmlAttributes).length) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var htmlAttr = _a[_i];
                if (htmlAttr === 'class') {
                    this.inputWrapper.classList.add(this.htmlAttributes[htmlAttr]);
                }
                else if (htmlAttr === 'disabled' && this.htmlAttributes[htmlAttr] === 'disabled') {
                    this.setProperties({ enabled: false }, true);
                    this.setEnable();
                }
                else if (htmlAttr === 'readonly' && !sf.base.isNullOrUndefined(this.htmlAttributes[htmlAttr])) {
                    this.setProperties({ readonly: true }, true);
                    this.dataBind();
                }
                else if (htmlAttr === 'style') {
                    this.inputWrapper.setAttribute('style', this.htmlAttributes[htmlAttr]);
                }
                else {
                    var defaultAttr = ['title', 'id', 'placeholder', 'aria-placeholder',
                        'role', 'autocorrect', 'autocomplete', 'autocapitalize', 'spellcheck', 'minlength', 'maxlength'];
                    var validateAttr = ['name', 'required'];
                    if (htmlAttr.indexOf('data') === 0 || validateAttr.indexOf(htmlAttr) > -1) {
                        this.hiddenElement.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                    else if (defaultAttr.indexOf(htmlAttr) > -1) {
                        htmlAttr === 'placeholder' ? sf.inputs.Input.setPlaceholder(this.htmlAttributes[htmlAttr], this.inputEle) :
                            this.inputEle.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                    else {
                        this.inputWrapper.setAttribute(htmlAttr, this.htmlAttributes[htmlAttr]);
                    }
                }
            }
        }
    };
    DropDownTree.prototype.updateDataAttribute = function () {
        var value = this.htmlAttributes;
        var invalidAttr = ['class', 'style', 'id', 'type'];
        var attr = {};
        for (var a = 0; a < this.element.attributes.length; a++) {
            if (invalidAttr.indexOf(this.element.attributes[a].name) === -1 &&
                !(this.element.attributes[a].name === 'readonly')) {
                attr[this.element.attributes[a].name] = this.element.getAttribute(this.element.attributes[a].name);
            }
        }
        sf.base.extend(attr, value, attr);
        this.setProperties({ htmlAttributes: attr }, true);
    };
    DropDownTree.prototype.showOverAllClear = function () {
        if (!this.enabled || this.readonly) {
            return;
        }
        if (this.overAllClear) {
            var isValue = this.value ? (this.value.length ? true : false) : false;
            if (isValue && this.showClearButton) {
                sf.base.removeClass([this.overAllClear], HIDEICON);
                sf.base.addClass([this.inputWrapper], SHOW_CLEAR);
            }
            else {
                sf.base.addClass([this.overAllClear], HIDEICON);
                sf.base.removeClass([this.inputWrapper], SHOW_CLEAR);
            }
        }
    };
    DropDownTree.prototype.setTreeValue = function () {
        if (this.value !== null && this.value.length !== 0) {
            var data = void 0;
            if (this.showCheckBox || this.allowMultiSelection) {
                for (var i = 0; i < this.value.length; i++) {
                    data = this.treeObj.getTreeData(this.value[i])[0];
                    if (sf.base.isNullOrUndefined(data)) {
                        this.value.splice(this.value.indexOf(this.value[i]), 1);
                    }
                }
                if (this.value.length !== 0) {
                    this.setValidValue();
                }
            }
            else {
                data = this.treeObj.getTreeData(this.value[0])[0];
                if (!sf.base.isNullOrUndefined(data)) {
                    this.setProperties({ text: data[this.fields.text] }, true);
                    this.setValidValue();
                }
                else {
                    this.setProperties({ value: this.currentValue }, true);
                }
            }
        }
    };
    DropDownTree.prototype.setTreeText = function () {
        if (this.value !== null && !this.isInitialized) {
            return;
        }
        if (this.text !== null) {
            var data = void 0;
            var valArr = [];
            if (this.showCheckBox || this.allowMultiSelection) {
                var textArr = this.text.split(this.delimiterChar);
                for (var i = 0; i < textArr.length; i++) {
                    data = this.getItems(textArr[i]);
                    if (!sf.base.isNullOrUndefined(data)) {
                        valArr.push(data[this.fields.value].toString());
                    }
                }
                if (valArr.length !== 0) {
                    this.oldValue = this.value;
                    this.setProperties({ value: valArr }, true);
                    this.setValidValue();
                }
                else {
                    this.setProperties({ text: this.currentText }, true);
                }
            }
            else {
                data = this.getItems(this.text);
                if (!sf.base.isNullOrUndefined(data)) {
                    this.oldValue = this.value;
                    this.setProperties({ value: [data[this.fields.value].toString()] }, true);
                    this.setValidValue();
                }
                else {
                    this.setProperties({ text: this.currentText }, true);
                }
            }
        }
    };
    DropDownTree.prototype.setSelectedValue = function () {
        if (this.value != null) {
            return;
        }
        if (!this.isInitialized) {
            this.oldValue = this.value;
            if (this.treeObj.selectedNodes.length > 0 && !this.showCheckBox) {
                this.setProperties({ value: this.treeObj.selectedNodes }, true);
                if (this.allowMultiSelection) {
                    this.updateMode();
                }
            }
            else if (this.showCheckBox && this.treeObj.checkedNodes) {
                if (this.treeObj.checkedNodes.length > 0) {
                    this.setProperties({ value: this.treeObj.checkedNodes }, true);
                    sf.base.setValue('selectedNodes', [], this.treeObj);
                    this.treeObj.dataBind();
                    this.updateMode();
                }
            }
            this.updateSelectedValues();
            this.currentText = this.text;
            this.currentValue = this.value;
        }
    };
    DropDownTree.prototype.setValidValue = function () {
        if (!this.showCheckBox && !this.allowMultiSelection) {
            sf.inputs.Input.setValue(this.text, this.inputEle, this.floatLabelType);
            var id = this.value[0].toString();
            if (this.treeObj.selectedNodes[0] !== id) {
                sf.base.setValue('selectedNodes', [id], this.treeObj);
            }
        }
        else {
            if (this.showCheckBox) {
                this.treeObj.checkedNodes = this.value.slice();
                sf.base.setValue('selectedNodes', [], this.treeObj);
                this.treeObj.dataBind();
                this.setMultiSelect();
            }
            else {
                this.treeObj.selectedNodes = this.value.slice();
                this.selectedText = [];
                this.updateSelectedValues();
            }
            this.treeObj.dataBind();
        }
        this.currentText = this.text;
        this.currentValue = this.value;
        if (this.isInitialized) {
            this.triggerChangeEvent();
        }
    };
    DropDownTree.prototype.getItems = function (givenText) {
        var data;
        if (this.treeDataType === 1) {
            for (var i = 0; i < this.treeItems.length; i++) {
                var text = sf.base.getValue(this.fields.text, this.treeItems[i]);
                if (!sf.base.isNullOrUndefined(this.treeItems[i]) && !sf.base.isNullOrUndefined(text) && text === givenText) {
                    data = this.treeItems[i];
                    break;
                }
            }
        }
        else {
            data = this.getNestedItems(this.treeItems, this.fields, givenText);
        }
        return data;
    };
    DropDownTree.prototype.getNestedItems = function (data, field, givenText) {
        var newData;
        for (var i = 0, objlen = data.length; i < objlen; i++) {
            var dataId = sf.base.getValue(this.fields.text, data[i]);
            if (data[i] && dataId && dataId.toString() === givenText) {
                return data[i];
            }
            else if (typeof field.child === 'string' && !sf.base.isNullOrUndefined(sf.base.getValue(field.child, data[i]))) {
                var childData = sf.base.getValue(field.child, data[i]);
                newData = this.getNestedItems(childData, this.getChildType(field), givenText);
                if (newData !== undefined) {
                    break;
                }
            }
            else if (this.fields.dataSource instanceof sf.data.DataManager && !sf.base.isNullOrUndefined(sf.base.getValue('child', data[i]))) {
                var child = 'child';
                newData = this.getNestedItems(sf.base.getValue(child, data[i]), this.getChildType(field), givenText);
                if (newData !== undefined) {
                    break;
                }
            }
        }
        return newData;
    };
    DropDownTree.prototype.getChildType = function (mapper) {
        return (typeof mapper.child === 'string' || sf.base.isNullOrUndefined(mapper.child)) ? mapper : mapper.child;
    };
    /* To render the treeview */
    DropDownTree.prototype.renderTree = function () {
        this.treeObj = new sf.navigations.TreeView({
            fields: this.getTreeFields(this.fields),
            enableRtl: this.enableRtl,
            nodeSelected: this.onNodeSelected.bind(this),
            nodeChecked: this.onNodeChecked.bind(this),
            nodeChecking: this.beforeCheck.bind(this),
            actionFailure: this.onActionFailure.bind(this),
            nodeClicked: this.onNodeClicked.bind(this),
            dataBound: this.OnDataBound.bind(this),
            allowMultiSelection: this.allowMultiSelection,
            showCheckBox: this.showCheckBox,
            autoCheck: this.treeSettings.autoCheck,
            sortOrder: this.sortOrder,
            expandOn: this.treeSettings.expandOn,
            loadOnDemand: this.treeSettings.loadOnDemand,
            nodeSelecting: this.onBeforeSelect.bind(this),
            nodeTemplate: this.itemTemplate
        });
        this.treeObj.appendTo('#' + this.tree.id);
    };
    /* To render the popup element */
    DropDownTree.prototype.renderPopup = function () {
        var _this = this;
        if (this.isFilteredData) {
            this.filterObj.value = '';
            this.treeObj.fields = this.getTreeFields(this.fields);
            this.isFilterRestore = true;
            this.isFilteredData = false;
            this.hideCheckAll(false);
        }
        var isCancelled = false;
        var args = { cancel: false };
        this.trigger('beforeOpen', args, function (args) {
            if (!args.cancel) {
                sf.base.addClass([_this.inputWrapper], [ICONANIMATION]);
                if (_this.isFirstRender) {
                    _this.popupEle = _this.createElement('div', {
                        id: _this.element.id + '_popup', className: POPUP_CLASS + ' ' + (_this.cssClass != null ? _this.cssClass : '')
                    });
                    document.body.appendChild(_this.popupEle);
                    _this.createPopup(_this.popupEle);
                }
                else {
                    _this.popupEle = _this.popupObj.element;
                }
            }
            else {
                isCancelled = true;
            }
            if (_this.isFirstRender && !isCancelled) {
                sf.base.prepend([_this.popupDiv], _this.popupEle);
                _this.popupDiv.style.display = 'block';
                if (_this.allowFiltering) {
                    _this.renderFilter();
                }
                if (_this.showCheckBox && _this.showSelectAll && (!_this.popupDiv.classList.contains(NODATA))) {
                    _this.createSelectAllWrapper();
                    _this.popupEle.insertBefore(_this.checkAllParent, _this.popupDiv);
                }
                if (_this.headerTemplate) {
                    _this.setHeaderTemplate();
                }
                if (_this.footerTemplate) {
                    _this.setFooterTemplate();
                }
                _this.isFirstRender = false;
            }
            if (!isCancelled) {
                sf.base.attributes(_this.inputWrapper, { 'aria-expanded': 'true' });
                _this.popupObj.show(null, (_this.zIndex === 1000) ? _this.inputEle : null);
                _this.popupEle.style.display = 'block';
                _this.updatePopupHeight();
                _this.popupObj.refreshPosition();
                if (!(_this.showCheckBox && _this.showSelectAll) && (!_this.popupDiv.classList.contains(NODATA)
                    && _this.treeItems.length > 0)) {
                    _this.treeObj.element.focus();
                }
                if (_this.checkSelectAll && _this.checkBoxElement) {
                    var wrap = sf.base.closest(_this.checkBoxElement, '.' + CHECKBOXWRAP);
                    _this.changeState(wrap, 'check');
                    _this.checkSelectAll = false;
                }
                if (_this.allowFiltering) {
                    sf.base.removeClass([_this.inputWrapper], [INPUTFOCUS]);
                    _this.filterObj.element.focus();
                }
                var eventArgs = { popup: _this.popupObj };
                _this.trigger('open', eventArgs);
            }
        });
    };
    DropDownTree.prototype.updatePopupHeight = function () {
        if (this.isFirstRender) {
            return;
        }
        var popupHeight = this.getHeight();
        this.popupEle.style.maxHeight = popupHeight;
        if (this.allowFiltering) {
            var height = Math.round(this.filterContainer.getBoundingClientRect().height);
            popupHeight = sf.base.formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        if (this.headerTemplate) {
            var height = Math.round(this.header.getBoundingClientRect().height);
            popupHeight = sf.base.formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        if (this.showCheckBox && this.showSelectAll) {
            var height = Math.round(this.checkAllParent.getBoundingClientRect().height);
            popupHeight = sf.base.formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        if (this.footerTemplate) {
            var height = Math.round(this.footer.getBoundingClientRect().height);
            popupHeight = sf.base.formatUnit(parseInt(popupHeight, 10) - height + 'px');
        }
        var border = parseInt(window.getComputedStyle(this.popupEle).borderTopWidth, 10);
        border = border + parseInt(window.getComputedStyle(this.popupEle).borderBottomWidth, 10);
        popupHeight = sf.base.formatUnit(parseInt(popupHeight, 10) - border + 'px');
        this.popupDiv.style.maxHeight = popupHeight;
    };
    DropDownTree.prototype.createPopup = function (element) {
        var _this = this;
        if (this.isFirstRender) {
            this.popupObj = new sf.popups.Popup(element, {
                width: this.setWidth(),
                targetType: 'relative',
                collision: { X: 'flip', Y: 'flip' },
                relateTo: this.inputWrapper,
                zIndex: this.zIndex,
                enableRtl: this.enableRtl,
                position: { X: 'left', Y: 'bottom' },
                close: function () {
                    _this.isPopupOpen = false;
                },
                open: function () {
                    sf.base.EventHandler.add(document, 'mousedown', _this.onDocumentClick, _this);
                    _this.isPopupOpen = true;
                },
                targetExitViewport: function () {
                    if (!sf.base.Browser.isDevice) {
                        _this.hidePopup();
                    }
                }
            });
        }
    };
    /* To calculate the width when change via set model */
    DropDownTree.prototype.setElementWidth = function (inputWidth) {
        var ddElement = this.inputWrapper;
        if (!sf.base.isNullOrUndefined(inputWidth)) {
            if (typeof inputWidth === 'number') {
                ddElement.style.width = sf.base.formatUnit(inputWidth);
            }
            else if (typeof inputWidth === 'string') {
                ddElement.style.width = (inputWidth.match(/px|%|em/)) ? (inputWidth) :
                    (sf.base.formatUnit(inputWidth));
            }
        }
    };
    /* To calculate the width of the popup */
    DropDownTree.prototype.setWidth = function () {
        var width = sf.base.formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            var inputWidth = this.inputWrapper.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        else if (typeof this.popupWidth === 'string') {
            width = (this.popupWidth.match(/px|em/)) ? (this.popupWidth) : width;
        }
        return width;
    };
    /* To calculate the height of the popup */
    DropDownTree.prototype.getHeight = function () {
        var height = sf.base.formatUnit(this.popupHeight);
        if (height.indexOf('%') > -1) {
            // Will set the height of the popup according to the view port height
            var viewPortHeight = document.documentElement.clientHeight * parseFloat(height) / 100;
            height = viewPortHeight.toString() + 'px';
        }
        else if (typeof this.popupHeight === 'string') {
            height = (this.popupHeight.match(/px|em/)) ? (this.popupHeight) : height;
        }
        return height;
    };
    DropDownTree.prototype.onDocumentClick = function (e) {
        var target = e.target;
        var isTree = sf.base.closest(target, '.' + PARENTITEM);
        var isFilter = sf.base.closest(target, '.' + FILTERWRAP);
        var isScroller = target.classList.contains(DROPDOWN) ? true :
            (sf.base.matches(target, '.e-ddt .e-popup') || sf.base.matches(target, '.e-ddt .e-treeview'));
        if ((this.isPopupOpen && (this.inputWrapper.contains(target) || isTree || isFilter || isScroller)) ||
            ((this.allowMultiSelection || this.showCheckBox) && (this.isPopupOpen && target.classList.contains(CHIP_CLOSE) ||
                (this.isPopupOpen && (target.classList.contains(CHECKALLPARENT) || target.classList.contains(ALLTEXT)
                    || target.classList.contains(CHECKBOXFRAME)))))) {
            this.isDocumentClick = false;
            e.preventDefault();
        }
        else if (!this.inputWrapper.contains(target) && this.inputFocus) {
            this.focusOut(e);
        }
    };
    DropDownTree.prototype.onActionFailure = function (e) {
        this.trigger('actionFailure', e);
        this.l10nUpdate(true);
        sf.base.addClass([this.popupDiv], NODATA);
    };
    DropDownTree.prototype.OnDataBound = function (args) {
        this.treeItems = args.data;
        if (this.treeItems.length <= 0) {
            this.l10nUpdate();
            sf.base.addClass([this.popupDiv], NODATA);
            this.hideCheckAll(true);
        }
        else if (this.popupDiv.classList.contains(NODATA) && this.treeItems.length >= 1) {
            sf.base.removeClass([this.popupDiv], NODATA);
            this.hideCheckAll(false);
        }
        this.treeDataType = this.getTreeDataType(this.treeItems, this.fields);
        if (this.isFirstRender && this.isRemoteData) {
            this.setTreeValue();
            this.setTreeText();
            this.updateHiddenValue();
            this.setSelectedValue();
            this.treeObj.element.focus();
        }
        var eventArgs = { data: args.data };
        this.trigger('dataBound', eventArgs);
        if (this.isFilteredData) {
            this.treeObj.expandAll();
        }
        if (this.isFilterRestore) {
            this.restoreFilterSelection();
            this.isFilterRestore = false;
        }
    };
    DropDownTree.prototype.restoreFilterSelection = function () {
        if (this.showCheckBox) {
            this.treeObj.checkedNodes = this.value ? this.value : [];
        }
        else {
            this.treeObj.selectedNodes = this.value ? this.value : [];
        }
    };
    /* To set cssclass for the dropdowntree */
    DropDownTree.prototype.setCssClass = function (newClass, oldClass) {
        var elements = this.popupObj ? [this.inputWrapper, this.popupObj.element] : [this.inputWrapper];
        if (!sf.base.isNullOrUndefined(oldClass) && oldClass !== '') {
            sf.base.removeClass(elements, oldClass.split(' '));
        }
        if (!sf.base.isNullOrUndefined(newClass) && newClass !== '') {
            sf.base.addClass(elements, newClass.split(' '));
        }
    };
    DropDownTree.prototype.setEnableRTL = function (state) {
        if (state) {
            this.inputWrapper.classList.add(RTL);
        }
        else {
            this.inputWrapper.classList.remove(RTL);
        }
        if (this.popupObj) {
            this.popupObj.enableRtl = state;
            this.popupObj.dataBind();
        }
        if (this.treeObj) {
            this.treeObj.enableRtl = state;
            this.treeObj.dataBind();
        }
    };
    /* To set enable property */
    DropDownTree.prototype.setEnable = function () {
        sf.inputs.Input.setEnabled(this.enabled, this.inputEle);
        if (this.enabled) {
            sf.base.removeClass([this.inputWrapper], DISABLED);
            this.inputEle.setAttribute('aria-disabled', 'false');
            this.inputWrapper.setAttribute('aria-disabled', 'false');
        }
        else {
            if (this.isPopupOpen) {
                this.hidePopup();
            }
            sf.base.addClass([this.inputWrapper], DISABLED);
            if (this.inputWrapper && this.inputWrapper.classList.contains(INPUTFOCUS)) {
                sf.base.removeClass([this.inputWrapper], [INPUTFOCUS]);
            }
            this.inputEle.setAttribute('aria-disabled', 'true');
            this.inputWrapper.setAttribute('aria-disabled', 'true');
        }
    };
    DropDownTree.prototype.cloneFields = function (fields) {
        var clonedField = {
            dataSource: fields.dataSource, value: fields.value, text: fields.text, parentValue: fields.parentValue,
            child: this.cloneChildField(fields.child), hasChildren: fields.hasChildren, expanded: fields.expanded,
            iconCss: fields.iconCss, imageUrl: fields.imageUrl, htmlAttributes: fields.htmlAttributes, query: fields.query,
            selected: fields.selected, tableName: fields.tableName, tooltip: fields.tooltip
        };
        return clonedField;
    };
    DropDownTree.prototype.cloneChildField = function (fields) {
        if (typeof fields === 'string') {
            return fields;
        }
        else {
            var clonedField = {
                dataSource: fields.dataSource, value: fields.value, text: fields.text, parentValue: fields.parentValue,
                child: (fields.child ? this.cloneChildField(fields.child) : null), hasChildren: fields.hasChildren,
                expanded: fields.expanded, iconCss: fields.iconCss, imageUrl: fields.imageUrl, htmlAttributes: fields.htmlAttributes,
                query: fields.query, selected: fields.selected, tableName: fields.tableName, tooltip: fields.tooltip
            };
            return clonedField;
        }
    };
    DropDownTree.prototype.getTreeFields = function (fields) {
        var treeFields = {
            dataSource: fields.dataSource, id: fields.value, text: fields.text, parentID: fields.parentValue,
            child: this.getTreeChildren(fields.child), hasChildren: fields.hasChildren, expanded: fields.expanded,
            iconCss: fields.iconCss, imageUrl: fields.imageUrl, isChecked: fields.selected,
            htmlAttributes: fields.htmlAttributes, query: fields.query, selected: fields.selected,
            tableName: fields.tableName, tooltip: fields.tooltip
        };
        return treeFields;
    };
    DropDownTree.prototype.getTreeChildren = function (mapper) {
        if (typeof mapper === 'string') {
            return mapper;
        }
        else if (!sf.base.isNullOrUndefined(mapper)) {
            var childFields = void 0;
            mapper = this.getActualProperties(mapper);
            childFields = mapper;
            if (mapper.value) {
                childFields.id = mapper.value;
            }
            if (mapper.parentValue) {
                childFields.parentID = mapper.parentValue;
            }
            if (mapper.child) {
                childFields.child = this.getTreeChildren(mapper.child);
            }
            if (mapper.selected && this.showCheckBox) {
                childFields.isChecked = mapper.selected;
            }
            return childFields;
        }
        return null;
    };
    DropDownTree.prototype.getTreeDataType = function (ds, field) {
        if (this.fields.dataSource instanceof sf.data.DataManager) {
            for (var i = 0; i < ds.length; i++) {
                if ((typeof field.child === 'string') && sf.base.isNullOrUndefined(sf.base.getValue(field.child, ds[i]))) {
                    return 1;
                }
            }
            return 2;
        }
        for (var i = 0, len = ds.length; i < len; i++) {
            if ((typeof field.child === 'string') && !sf.base.isNullOrUndefined(sf.base.getValue(field.child, ds[i]))) {
                return 2;
            }
            if (!sf.base.isNullOrUndefined(sf.base.getValue(field.parentValue, ds[i])) || !sf.base.isNullOrUndefined(sf.base.getValue(field.hasChildren, ds[i]))) {
                return 1;
            }
        }
        return 1;
    };
    /* Triggers when the tree fields is changed dynamically */
    DropDownTree.prototype.setFields = function () {
        this.resetValue();
        this.treeObj.fields = this.getTreeFields(this.fields);
        this.treeObj.dataBind();
    };
    DropDownTree.prototype.getEventArgs = function (args) {
        var checkData = args.data;
        var selectData = args.nodeData;
        var state;
        if (this.showCheckBox) {
            if (args.action === 'check') {
                state = 'select';
            }
            else if (args.action === 'uncheck') {
                state = 'un-select';
            }
        }
        var eventArgs = {
            action: this.showCheckBox ? state : args.action,
            isInteracted: args.isInteracted,
            item: args.node,
            itemData: this.showCheckBox ? checkData[0] : selectData
        };
        return eventArgs;
    };
    DropDownTree.prototype.onBeforeSelect = function (args) {
        if (args.isInteracted) {
            this.oldValue = this.value ? this.value.slice() : this.value;
            if (this.value === null) {
                this.setProperties({ value: [] }, true);
            }
        }
    };
    DropDownTree.prototype.updateHiddenValue = function () {
        if (this.allowMultiSelection || this.showCheckBox) {
            return;
        }
        if (this.value && this.value.length) {
            this.hiddenElement.innerHTML = '<option selected value ="' + this.value[0] + '">' + this.text + '</option>';
        }
        else {
            this.hiddenElement.innerHTML = '';
        }
    };
    /* Triggers when the tree node is selected */
    DropDownTree.prototype.onNodeSelected = function (args) {
        if (this.showCheckBox) {
            return;
        }
        var selectedText;
        if (args.isInteracted) {
            var id = sf.base.getValue('id', args.nodeData).toString();
            if (!this.allowMultiSelection) {
                this.hiddenElement.innerHTML = '';
                this.setProperties({ value: [id] }, true);
                if (this.itemTemplate) {
                    selectedText = sf.base.getValue('text', this.treeObj.getNode(id));
                }
                else {
                    selectedText = sf.base.getValue('text', args.nodeData).toString();
                }
                sf.inputs.Input.setValue(selectedText, this.inputEle, this.floatLabelType);
                this.setProperties({ text: selectedText }, true);
                this.currentText = this.text;
                this.currentValue = this.value;
                sf.base.attributes(this.inputWrapper, { 'aria-describedby': this.element.id });
                sf.base.attributes(this.inputWrapper, { 'aria-activedescendant': id.toString() });
                this.updateHiddenValue();
                this.showOverAllClear();
                this.hidePopup();
                this.isNodeSelected = true;
            }
            else if (this.allowMultiSelection) {
                this.setMultiSelect();
            }
        }
        var eventArgs = this.getEventArgs(args);
        this.trigger('select', eventArgs);
        if (this.isValueChange && !this.changeOnBlur) {
            this.triggerChangeEvent(this.keyEventArgs);
            this.isValueChange = false;
        }
    };
    DropDownTree.prototype.onNodeClicked = function (args) {
        if (!this.changeOnBlur && this.isNodeSelected) {
            this.triggerChangeEvent(args.event);
            this.isNodeSelected = false;
        }
        var target = args.event.target;
        if ((target.classList.contains('e-fullrow') || target.classList.contains('e-list-text')) && this.showCheckBox) {
            var getNodeDetails = this.treeObj.getNode(args.node);
            if (getNodeDetails.isChecked === 'true') {
                this.treeObj.uncheckAll([args.node]);
            }
            else {
                this.treeObj.checkAll([args.node]);
            }
            this.setMultiSelect();
            this.ensurePlaceHolder();
        }
        if (!this.changeOnBlur && (this.allowMultiSelection || this.showCheckBox)) {
            this.triggerChangeEvent(args.event);
        }
    };
    DropDownTree.prototype.onNodeChecked = function (args) {
        var eventArgs = this.getEventArgs(args);
        this.trigger('select', eventArgs);
        if (this.isFilteredData && args.action === 'uncheck') {
            var id = sf.base.getValue('id', args.data[0]).toString();
            this.removeSelectedData(id, true);
        }
        if (!this.isChipDelete && args.isInteracted) {
            this.setMultiSelect();
            this.ensurePlaceHolder();
        }
        if (this.showSelectAll && this.checkBoxElement) {
            var nodes = this.treeObj.element.querySelectorAll('li');
            var checkedNodes = this.treeObj.element.querySelectorAll('li .e-checkbox-wrapper[aria-checked=true]');
            var wrap = sf.base.closest(this.checkBoxElement, '.' + CHECKBOXWRAP);
            if (wrap && args.action === 'uncheck') {
                this.isReverseUpdate = true;
                this.changeState(wrap, 'uncheck');
                this.isReverseUpdate = false;
            }
            else if (wrap && args.action === 'check' && checkedNodes.length === nodes.length) {
                this.isReverseUpdate = true;
                this.changeState(wrap, 'check');
                this.isReverseUpdate = false;
            }
        }
    };
    DropDownTree.prototype.beforeCheck = function (args) {
        if (args.isInteracted) {
            this.oldValue = this.value ? this.value.slice() : this.value;
        }
    };
    DropDownTree.prototype.updateClearButton = function (state) {
        if (state) {
            if (!this.inputWrapper.contains(this.overAllClear)) {
                this.inputEle.parentElement.insertBefore(this.overAllClear, this.inputEle.nextSibling);
            }
            else {
                sf.base.removeClass([this.overAllClear], HIDEICON);
                sf.base.addClass([this.inputWrapper], SHOW_CLEAR);
            }
        }
        else {
            sf.base.addClass([this.overAllClear], HIDEICON);
            sf.base.removeClass([this.inputWrapper], SHOW_CLEAR);
        }
        if ((this.allowMultiSelection || this.showCheckBox) && this.chipWrapper) {
            var chipClose = sf.base.selectAll('.' + CHIP_CLOSE, this.chipWrapper);
            for (var i = 0; i < chipClose.length; i++) {
                if (!state) {
                    sf.base.addClass([chipClose[i]], HIDEICON);
                }
                else {
                    sf.base.removeClass([chipClose[i]], HIDEICON);
                }
            }
        }
    };
    DropDownTree.prototype.updateDropDownIconState = function (state) {
        var spinIcon = sf.base.select('.' + DDTICON, this.inputWrapper);
        if (state) {
            if (!spinIcon) {
                sf.inputs.Input.appendSpan(DROPDOWNICON, this.inputWrapper, this.createElement);
            }
            else {
                sf.base.removeClass([spinIcon], HIDEICON);
            }
            sf.base.addClass([this.inputWrapper], SHOW_DD_ICON);
        }
        else {
            sf.base.addClass([spinIcon], HIDEICON);
            sf.base.removeClass([this.inputWrapper], SHOW_DD_ICON);
        }
    };
    DropDownTree.prototype.updateMode = function () {
        if (this.mode !== 'Delimiter') {
            if (!this.inputWrapper.contains(this.chipWrapper)) {
                this.createChip();
            }
            var isValid = this.getValidMode();
            if (this.chipWrapper.classList.contains(HIDEICON) && isValid) {
                sf.base.removeClass([this.chipWrapper], HIDEICON);
                sf.base.addClass([this.inputWrapper], SHOW_CHIP);
            }
            else if (!isValid) {
                sf.base.addClass([this.chipWrapper], HIDEICON);
                sf.base.removeClass([this.inputWrapper], SHOW_CHIP);
            }
            var isValue = this.value !== null ? (this.value.length !== 0 ? true : false) : false;
            if (isValid && isValue) {
                sf.base.addClass([this.inputEle], CHIP_INPUT);
            }
            else {
                sf.base.removeClass([this.inputEle], CHIP_INPUT);
            }
        }
        else if (this.inputEle.classList.contains(CHIP_INPUT)) {
            sf.base.removeClass([this.inputEle], CHIP_INPUT);
            if (this.chipWrapper) {
                sf.base.addClass([this.chipWrapper], HIDEICON);
                sf.base.removeClass([this.inputWrapper], SHOW_CHIP);
            }
        }
    };
    DropDownTree.prototype.ensurePlaceHolder = function () {
        if (this.value && this.value.length === 0) {
            sf.base.removeClass([this.inputEle], CHIP_INPUT);
            if (this.chipWrapper) {
                sf.base.addClass([this.chipWrapper], HIDEICON);
            }
        }
    };
    DropDownTree.prototype.ensureClearIconPosition = function (floatLabelType) {
        if (floatLabelType !== 'Never') {
            this.inputWrapper.insertBefore(this.overAllClear, this.inputObj.buttons[0]);
        }
    };
    DropDownTree.prototype.setMultiSelectValue = function (newValues) {
        if (!this.isFilteredData) {
            this.setProperties({ value: newValues }, true);
            if (newValues && newValues.length !== 0 && !this.showCheckBox) {
                this.treeObj.selectedNodes = this.value.slice();
                this.treeObj.dataBind();
            }
        }
        else {
            var selectedValues = sf.base.isNullOrUndefined(this.value) ? [] : this.value;
            for (var i = 0; i < newValues.length; i++) {
                if (sf.base.isNullOrUndefined(this.value) || this.value.indexOf(newValues[i]) === -1) {
                    selectedValues.push(newValues[i]);
                }
            }
            this.setProperties({ value: selectedValues }, true);
        }
    };
    DropDownTree.prototype.setMultiSelect = function () {
        if (this.showCheckBox && !this.isDynamicChange) {
            this.setMultiSelectValue(this.treeObj.checkedNodes);
        }
        else {
            var ddtValue = this.allowMultiSelection ? (this.showCheckBox ? this.treeObj.checkedNodes
                : this.treeObj.selectedNodes) : (this.value ? (this.showCheckBox ? this.value : [this.value[0]]) : null);
            this.setMultiSelectValue(ddtValue);
            if (this.showCheckBox && this.value !== null) {
                this.treeObj.checkedNodes = this.value;
                this.treeObj.dataBind();
            }
        }
        this.selectedText = [];
        var checkSelection = this.allowMultiSelection ? true : (this.showCheckBox ? true : false);
        if (this.inputWrapper.contains(this.chipWrapper) && !checkSelection) {
            sf.base.removeClass([this.inputEle], CHIP_INPUT);
            sf.base.detach(this.chipWrapper);
        }
        var isValid = this.getValidMode();
        if (isValid && this.value !== null) {
            sf.base.addClass([this.inputEle], CHIP_INPUT);
            if (this.chipWrapper) {
                sf.base.removeClass([this.chipWrapper], HIDEICON);
            }
        }
        var isValue = this.value ? (this.value.length ? true : false) : false;
        if (this.chipWrapper && (this.mode === 'Box' && !isValue)) {
            sf.base.addClass([this.chipWrapper], HIDEICON);
            sf.base.removeClass([this.inputEle], CHIP_INPUT);
        }
        this.updateSelectedValues();
    };
    DropDownTree.prototype.getSelectedData = function (value) {
        var data = null;
        if (this.isFilteredData) {
            for (var i = 0; i < this.selectedData.length; i++) {
                if (sf.base.getValue(this.treeSettings.loadOnDemand ? this.fields.value : 'id', this.selectedData[i]).toString() === value) {
                    data = this.selectedData[i];
                    break;
                }
            }
        }
        if (sf.base.isNullOrUndefined(data)) {
            if (this.treeSettings.loadOnDemand) {
                data = this.treeObj.getTreeData(value)[0];
            }
            else {
                data = this.treeObj.getNode(value);
            }
            if (!sf.base.isNullOrUndefined(data)) {
                this.selectedData.push(data);
            }
        }
        return data;
    };
    DropDownTree.prototype.removeSelectedData = function (value, muteOnChange) {
        var selectedValues = sf.base.isNullOrUndefined(this.value) ? [] : this.value.slice();
        selectedValues.splice(selectedValues.indexOf(value), 1);
        this.setProperties({ value: selectedValues }, muteOnChange);
        for (var i = 0; i < this.selectedData.length; i++) {
            if (sf.base.getValue(this.treeSettings.loadOnDemand ? this.fields.value : 'id', this.selectedData[i]).toString() === value) {
                this.selectedData.splice(i, 1);
                break;
            }
        }
    };
    DropDownTree.prototype.updateSelectedValues = function () {
        this.dataValue = '';
        var temp;
        var text;
        var textValue = '';
        var selectedData;
        this.hiddenElement.innerHTML = '';
        if ((!this.isChipDelete || this.treeSettings.autoCheck) && (this.inputWrapper.contains(this.chipWrapper))) {
            this.chipCollection.innerHTML = '';
        }
        if (!this.isFilteredData) {
            this.selectedData = [];
        }
        if (!sf.base.isNullOrUndefined(this.value)) {
            for (var i = 0, len = this.value.length; i < len; i++) {
                selectedData = this.getSelectedData(this.value[i]);
                text = sf.base.getValue(this.treeSettings.loadOnDemand ? this.fields.text : 'text', selectedData);
                this.selectedText.push(text);
                temp = this.selectedText[this.selectedText.length - 1];
                if (this.selectedText.length > 1) {
                    this.dataValue += (this.delimiterChar + ' ' + temp);
                    textValue += (',' + temp);
                    this.setProperties({ text: textValue }, true);
                }
                else {
                    this.dataValue += temp;
                    textValue += temp;
                }
                if (this.mode !== 'Delimiter' && (!this.isChipDelete || this.treeSettings.autoCheck) &&
                    (this.allowMultiSelection || this.showCheckBox)) {
                    this.setChipValues(temp, this.value[i]);
                }
                this.hiddenElement.innerHTML += '<option selected value ="' + this.value[i] + '">' +
                    this.selectedText[this.selectedText.length - 1] + '</option>';
            }
        }
        var isValid = this.getValidMode();
        if (this.mode !== 'Box' && (this.allowMultiSelection || this.showCheckBox) && !isValid) {
            if (this.chipWrapper) {
                sf.base.addClass([this.chipWrapper], HIDEICON);
                sf.base.removeClass([this.inputWrapper], SHOW_CHIP);
            }
        }
        sf.inputs.Input.setValue(this.dataValue, this.inputEle, this.floatLabelType);
        if (textValue === '') {
            this.setProperties({ text: null }, true);
        }
        else {
            this.setProperties({ text: textValue }, true);
        }
        if (this.showClearButton && this.inputFocus) {
            this.showOverAllClear();
        }
        if ((this.allowMultiSelection || this.showCheckBox) && this.popupObj) {
            this.popupObj.refreshPosition();
        }
        this.currentText = this.text;
        this.currentValue = this.value;
    };
    DropDownTree.prototype.setChipValues = function (text, value) {
        if (!this.inputWrapper.contains(this.chipWrapper)) {
            this.createChip();
        }
        var chip = this.createElement('span', {
            className: CHIP,
            attrs: { 'data-value': value }
        });
        var chipContent = this.createElement('span', { className: CHIP_CONTENT });
        var chipClose = this.createElement('span', { className: CHIP_CLOSE + ' ' + ICONS });
        chipContent.innerHTML = text;
        chip.appendChild(chipContent);
        this.chipCollection.appendChild(chip);
        if (this.showClearButton) {
            chip.appendChild(chipClose);
            sf.base.EventHandler.add(chipClose, 'mousedown', this.removeChip, this);
        }
    };
    DropDownTree.prototype.setSelectAllWrapper = function (state) {
        if (this.isFirstRender) {
            return;
        }
        if (state && !this.popupEle.contains(this.checkAllParent) && this.showCheckBox) {
            this.createSelectAllWrapper();
            this.popupEle.insertBefore(this.checkAllParent, this.popupDiv);
        }
        else if (this.popupEle.contains(this.checkAllParent)) {
            sf.base.detach(this.checkAllParent);
            this.checkAllParent = null;
        }
    };
    DropDownTree.prototype.setHeaderTemplate = function () {
        var compiledString;
        if (this.header) {
            this.header.innerHTML = '';
        }
        else {
            this.header = this.createElement('div');
            sf.base.addClass([this.header], HEADER);
        }
        compiledString = this.templateComplier(this.headerTemplate);
        for (var _i = 0, _a = compiledString({}, null, null, this.headerTemplateId, this.isStringTemplate); _i < _a.length; _i++) {
            var item = _a[_i];
            this.header.appendChild(item);
        }
        this.ddtupdateBlazorTemplates(false, false, true, false);
        this.popupEle.insertBefore(this.header, this.checkAllParent ? this.checkAllParent : this.popupDiv);
    };
    DropDownTree.prototype.templateComplier = function (template) {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return sf.base.compile(document.querySelector(template).innerHTML.trim());
                }
            }
            catch (e) {
                return sf.base.compile(template);
            }
        }
        return sf.base.compile(template);
    };
    DropDownTree.prototype.setFooterTemplate = function () {
        var compiledString;
        if (this.footer) {
            this.footer.innerHTML = '';
        }
        else {
            this.footer = this.createElement('div');
            sf.base.addClass([this.footer], FOOTER);
        }
        compiledString = this.templateComplier(this.footerTemplate);
        for (var _i = 0, _a = compiledString({}, null, null, this.footerTemplateId, this.isStringTemplate); _i < _a.length; _i++) {
            var item = _a[_i];
            this.footer.appendChild(item);
        }
        this.ddtupdateBlazorTemplates(false, false, false, true);
        sf.base.append([this.footer], this.popupEle);
    };
    DropDownTree.prototype.clearAll = function (e) {
        if (!this.enabled || this.readonly) {
            return;
        }
        this.resetValue();
        this.showOverAllClear();
        if ((this.allowMultiSelection || this.showCheckBox) && this.popupObj) {
            this.popupObj.refreshPosition();
        }
        if (e) {
            this.isClearButtonClick = true;
        }
        if (!this.changeOnBlur) {
            this.triggerChangeEvent(e);
        }
    };
    DropDownTree.prototype.removeChip = function (e) {
        if (!this.enabled || this.readonly) {
            return;
        }
        var element = e.target.parentElement;
        var value = element.getAttribute('data-value');
        if (this.chipCollection) {
            if (element) {
                sf.base.remove(element);
            }
        }
        this.isChipDelete = true;
        this.isClearButtonClick = true;
        this.removeSelectedData(value, true);
        this.selectedText = [];
        if (this.allowMultiSelection) {
            this.treeObj.selectedNodes = this.value.slice();
            this.updateSelectedValues();
        }
        if (this.showCheckBox) {
            this.treeObj.uncheckAll([value]);
            this.clearCheckAll();
            this.setMultiSelect();
        }
        this.triggerChangeEvent(e);
        this.isChipDelete = false;
        this.ensurePlaceHolder();
    };
    DropDownTree.prototype.resetValue = function (isDynamicChange) {
        sf.inputs.Input.setValue(null, this.inputEle, this.floatLabelType);
        this.oldValue = this.value;
        this.dataValue = null;
        this.setProperties({ value: [] }, true);
        this.setProperties({ text: null }, true);
        this.selectedData = [];
        sf.base.setValue('selectedNodes', [], this.treeObj);
        this.hiddenElement.innerHTML = '';
        if (this.showCheckBox) {
            this.treeObj.uncheckAll();
            this.setMultiSelect();
            this.clearCheckAll();
        }
        if (this.oldValue === null && !isDynamicChange) {
            this.removeValue = true;
        }
        else if (isDynamicChange) {
            this.triggerChangeEvent();
        }
        if ((this.allowMultiSelection || this.showCheckBox) && this.chipWrapper) {
            this.chipCollection.innerHTML = '';
            this.ensurePlaceHolder();
        }
    };
    DropDownTree.prototype.clearCheckAll = function () {
        if (this.showSelectAll && this.value.length === 0) {
            this.setLocale(false);
        }
    };
    DropDownTree.prototype.selectAllItems = function (state) {
        if (this.showCheckBox) {
            state ? this.treeObj.checkAll() : this.treeObj.uncheckAll();
            this.checkSelectAll = true;
        }
        else if (this.allowMultiSelection) {
            if (!state) {
                this.treeObj.selectedNodes = [];
            }
            else {
                var li = sf.base.selectAll('li', this.treeObj.element);
                var id = void 0;
                var arr = [];
                for (var i = 0; i < li.length; i++) {
                    id = li[i].getAttribute('data-uid').toString();
                    arr.push(id);
                }
                this.treeObj.selectedNodes = arr;
            }
        }
        this.updateMode();
        this.setMultiSelect();
    };
    DropDownTree.prototype.updateTreeSettings = function (prop) {
        var value = Object.keys(prop.treeSettings)[0];
        if (value === 'autoCheck') {
            this.ensureAutoCheck();
            this.treeObj.autoCheck = this.treeSettings.autoCheck;
        }
        else if (value === 'loadOnDemand') {
            this.treeObj.loadOnDemand = this.treeSettings.loadOnDemand;
        }
        else if (value === 'expandOn') {
            this.treeObj.expandOn = this.treeSettings.expandOn;
            this.treeObj.dataBind();
            return;
        }
        this.treeObj.dataBind();
        this.setMultiSelect();
    };
    DropDownTree.prototype.updateCheckBoxState = function (checkBox) {
        this.treeObj.showCheckBox = checkBox;
        this.treeObj.dataBind();
        this.isDynamicChange = true;
        this.setSelectAllWrapper(this.showSelectAll);
        if (this.showSelectAll) {
            this.setLocale();
        }
        if (this.showCheckBox) {
            this.updateMode();
        }
        this.setMultiSelect();
        this.isDynamicChange = false;
    };
    DropDownTree.prototype.updateTemplate = function () {
        if (this.popupObj) {
            this.popupObj.destroy();
            if (this.isPopupOpen) {
                this.hidePopup();
                this.isFirstRender = true;
                this.renderPopup();
            }
            else {
                this.isFirstRender = true;
            }
        }
    };
    DropDownTree.prototype.l10nUpdate = function (actionFailure) {
        if (this.noRecord) {
            this.noRecord.innerHTML = '';
        }
        else {
            this.noRecord = this.createElement('div');
            sf.base.addClass([this.noRecord], NODATACONTAINER);
            sf.base.prepend([this.noRecord], this.popupDiv);
        }
        if (this.noRecordsTemplate !== 'No Records Found' || this.actionFailureTemplate !== 'The Request Failed') {
            var template = actionFailure ? this.actionFailureTemplate : this.noRecordsTemplate;
            var compiledString = void 0;
            var templateId = actionFailure ? this.actionFailureTemplateId : this.noRecordsTemplateId;
            compiledString = this.templateComplier(template);
            for (var _i = 0, _a = compiledString({}, null, null, templateId, this.isStringTemplate); _i < _a.length; _i++) {
                var item = _a[_i];
                this.noRecord.appendChild(item);
            }
            this.ddtupdateBlazorTemplates(!actionFailure, actionFailure);
        }
        else {
            var l10nLocale = { noRecordsTemplate: 'No Records Found', actionFailureTemplate: 'The Request Failed' };
            this.l10n = new sf.base.L10n(this.getModuleName(), l10nLocale, this.locale);
            this.noRecord.innerHTML = actionFailure ?
                this.l10n.getConstant('actionFailureTemplate') : this.l10n.getConstant('noRecordsTemplate');
        }
    };
    DropDownTree.prototype.ddtupdateBlazorTemplates = function (noRecord, action, header, footer, isEmpty) {
        if (!this.isStringTemplate) {
            if (this.noRecordsTemplate && noRecord) {
                sf.base.updateBlazorTemplate(this.noRecordsTemplateId, NORECORDSTEMPLATE, this, isEmpty);
            }
            if (this.actionFailureTemplate && action) {
                sf.base.updateBlazorTemplate(this.actionFailureTemplateId, ACTIONFAILURETEMPLATE, this, isEmpty);
            }
            if (header) {
                sf.base.updateBlazorTemplate(this.headerTemplateId, HEADERTEMPLATE, this);
            }
            if (footer) {
                sf.base.updateBlazorTemplate(this.footerTemplateId, FOOTERTEMPLATE, this);
            }
        }
    };
    DropDownTree.prototype.ddtresetBlazorTemplates = function (noRecord, action, header, footer) {
        if (!this.isStringTemplate) {
            if (this.noRecordsTemplate && noRecord) {
                sf.base.resetBlazorTemplate(this.noRecordsTemplateId, NORECORDSTEMPLATE);
            }
            if (this.actionFailureTemplate && action) {
                sf.base.resetBlazorTemplate(this.actionFailureTemplateId, ACTIONFAILURETEMPLATE);
            }
            if (header) {
                sf.base.resetBlazorTemplate(this.headerTemplateId, HEADERTEMPLATE);
            }
            if (footer) {
                sf.base.resetBlazorTemplate(this.footerTemplateId, FOOTERTEMPLATE);
            }
        }
    };
    DropDownTree.prototype.updateRecordTemplate = function (action) {
        if (this.treeItems && this.treeItems.length <= 0) {
            this.l10nUpdate(action);
            this.updateTemplate();
        }
    };
    DropDownTree.prototype.updateMultiSelection = function (state) {
        this.treeObj.allowMultiSelection = state;
        this.treeObj.dataBind();
        this.updateOption();
        if (this.allowMultiSelection) {
            this.updateMode();
        }
        this.setMultiSelect();
    };
    DropDownTree.prototype.updateAllowFiltering = function (state) {
        if (!this.isFirstRender) {
            if (state) {
                this.renderFilter();
            }
            else {
                this.destroyFilter();
            }
        }
        this.ensureAutoCheck();
    };
    DropDownTree.prototype.updateFilterPlaceHolder = function () {
        if (this.filterObj) {
            this.filterObj.placeholder = this.filterBarPlaceholder;
            this.filterObj.element.setAttribute('aria-label', this.filterBarPlaceholder);
        }
    };
    DropDownTree.prototype.updateValue = function (value) {
        if (sf.base.isNullOrUndefined(value) || value.length === 0) {
            this.resetValue(true);
        }
        else {
            this.setTreeValue();
        }
        this.updateHiddenValue();
    };
    DropDownTree.prototype.updateText = function (text) {
        if (sf.base.isNullOrUndefined(text)) {
            this.resetValue();
        }
        else {
            this.setTreeText();
        }
        this.updateHiddenValue();
    };
    DropDownTree.prototype.updateModelMode = function () {
        var validMode = this.allowMultiSelection ? true : (this.showCheckBox ? true : false);
        if (!validMode) {
            return;
        }
        this.updateMode();
        this.setMultiSelect();
    };
    DropDownTree.prototype.updateOption = function () {
        if (!this.hiddenElement.hasAttribute('multiple') && (this.allowMultiSelection || this.showCheckBox)) {
            this.hiddenElement.setAttribute('multiple', '');
        }
        else if (this.hiddenElement.hasAttribute('multiple') && (!this.allowMultiSelection && !this.showCheckBox)) {
            this.hiddenElement.removeAttribute('multiple');
        }
    };
    /**
     * Dynamically change the value of properties.
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    DropDownTree.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'width':
                    this.setElementWidth(newProp.width);
                    if (this.popupObj) {
                        this.popupObj.element.style.width = this.setWidth();
                    }
                    break;
                case 'placeholder':
                    sf.inputs.Input.setPlaceholder(newProp.placeholder, this.inputEle);
                    break;
                case 'cssClass':
                    this.setCssClass(newProp.cssClass, oldProp.cssClass);
                    break;
                case 'enableRtl':
                    this.setEnableRTL(this.enableRtl);
                    break;
                case 'fields':
                    this.setFields();
                    break;
                case 'readonly':
                    sf.inputs.Input.setReadonly(newProp.readonly, this.inputEle);
                    break;
                case 'enabled':
                    this.setEnable();
                    break;
                case 'floatLabelType':
                    sf.inputs.Input.removeFloating(this.inputObj);
                    sf.inputs.Input.addFloating(this.inputEle, newProp.floatLabelType, this.placeholder, this.createElement);
                    this.ensureClearIconPosition(newProp.floatLabelType);
                    break;
                case 'showClearButton':
                    this.updateClearButton(newProp.showClearButton);
                    break;
                case 'allowFiltering':
                    this.updateAllowFiltering(newProp.allowFiltering);
                    break;
                case 'filterBarPlaceholder':
                    this.updateFilterPlaceHolder();
                    break;
                case 'value':
                    this.updateValue(newProp.value);
                    break;
                case 'text':
                    this.updateText(newProp.text);
                    break;
                case 'allowMultiSelection':
                    this.updateMultiSelection(newProp.allowMultiSelection);
                    break;
                case 'mode':
                    this.updateModelMode();
                    break;
                case 'delimiterChar':
                    if (this.mode === 'Box') {
                        return;
                    }
                    if (this.showCheckBox || this.allowMultiSelection) {
                        this.setMultiSelect();
                    }
                    break;
                case 'selectAllText':
                    if (this.showCheckBox && this.showSelectAll) {
                        this.setLocale();
                    }
                    break;
                case 'unSelectAllText':
                    if (this.showCheckBox && this.showSelectAll) {
                        this.setLocale(false);
                    }
                    break;
                case 'showSelectAll':
                    if (this.showCheckBox) {
                        this.setSelectAllWrapper(newProp.showSelectAll);
                        this.updatePopupHeight();
                    }
                    break;
                case 'showCheckBox':
                    this.updateCheckBoxState(newProp.showCheckBox);
                    this.updatePopupHeight();
                    this.updateOption();
                    break;
                case 'treeSettings':
                    this.updateTreeSettings(newProp);
                    break;
                case 'sortOrder':
                    this.treeObj.sortOrder = newProp.sortOrder;
                    this.treeObj.dataBind();
                    break;
                case 'showDropDownIcon':
                    this.updateDropDownIconState(newProp.showDropDownIcon);
                    break;
                case 'popupWidth':
                    if (this.popupObj) {
                        this.popupObj.element.style.width = this.setWidth();
                    }
                    break;
                case 'popupHeight':
                    if (this.popupObj) {
                        this.updatePopupHeight();
                    }
                    break;
                case 'zIndex':
                    if (this.popupObj) {
                        this.popupObj.zIndex = newProp.zIndex;
                        this.popupObj.dataBind();
                    }
                    break;
                case 'headerTemplate':
                    this.updateTemplate();
                    break;
                case 'footerTemplate':
                    this.updateTemplate();
                    break;
                case 'itemTemplate':
                    this.treeObj.nodeTemplate = newProp.itemTemplate;
                    this.treeObj.dataBind();
                    break;
                case 'noRecordsTemplate':
                    this.updateRecordTemplate();
                    break;
                case 'actionFailureTemplate':
                    this.updateRecordTemplate(true);
                    break;
                case 'htmlAttributes':
                    this.setHTMLAttributes();
                    break;
            }
        }
    };
    /**
     * Allows you to clear the selected values from the Dropdown Tree component.
     * @method clear
     * @return {void}.
     */
    DropDownTree.prototype.clear = function () {
        this.clearAll();
        if (this.inputFocus) {
            this.onFocusOut();
        }
        else {
            if (this.changeOnBlur) {
                this.triggerChangeEvent();
            }
            this.removeValue = false;
        }
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    DropDownTree.prototype.destroy = function () {
        this.ddtresetBlazorTemplates(true, true, true, true);
        this.unWireEvents();
        this.setCssClass(null, this.cssClass);
        this.resetValue();
        this.treeObj.destroy();
        this.destroyFilter();
        if (this.popupObj) {
            this.popupObj.destroy();
            sf.base.detach(this.popupObj.element);
        }
        if (this.element.tagName !== this.getDirective()) {
            this.inputWrapper.parentElement.insertBefore(this.element, this.inputWrapper);
        }
        sf.base.detach(this.inputWrapper);
        sf.base.detach(this.popupDiv);
        this.element.classList.remove('e-input');
        _super.prototype.destroy.call(this);
    };
    DropDownTree.prototype.destroyFilter = function () {
        if (this.filterObj) {
            this.filterObj.destroy();
            sf.base.detach(this.filterObj.element);
            sf.base.detach(this.filterContainer);
            this.filterObj = null;
        }
    };
    /**
     * Ensures visibility of the Dropdown Tree item by using item value or item element.
     * If many Dropdown Tree items are present, and we are in need to find a particular item, then the `ensureVisible` property
     * helps you to bring the item to visibility by expanding the Dropdown Tree and scrolling to the specific item.
     * @param  {string | Element} item - Specifies the value of Dropdown Tree item/ Dropdown Tree item element.
     */
    DropDownTree.prototype.ensureVisible = function (item) {
        this.treeObj.ensureVisible(item);
    };
    /**
     * To get the updated data of source of the Dropdown Tree.
     * @param  {string | Element} item - Specifies the value of Dropdown Tree item/ Dropdown Tree item element.
     * @returns { { [key: string]: Object }[] }.
     */
    DropDownTree.prototype.getData = function (item) {
        return this.treeObj.getTreeData(item);
    };
    /**
     * Close the Dropdown tree pop-up.
     * @returns void.
     */
    DropDownTree.prototype.hidePopup = function () {
        var eventArgs = { popup: this.popupObj };
        this.inputWrapper.classList.remove(ICONANIMATION);
        if (this.popupEle) {
            this.popupEle.style.display = 'none';
        }
        sf.base.attributes(this.inputWrapper, { 'aria-expanded': 'false' });
        if (this.popupObj && this.isPopupOpen) {
            this.popupObj.hide();
            if (this.inputFocus) {
                this.inputWrapper.focus();
                if (this.allowFiltering) {
                    sf.base.addClass([this.inputWrapper], [INPUTFOCUS]);
                }
            }
            this.trigger('close', eventArgs);
        }
    };
    /**
     * Based on the state parameter, entire list item will be selected or deselected.
     * parameter
     * `true`   - Selects entire Dropdown Tree items.
     * `false`  - Unselects entire Dropdown Tree items.
     * @returns void
     */
    DropDownTree.prototype.selectAll = function (state) {
        this.selectAllItems(state);
    };
    /**
     * Opens the popup that displays the Dropdown Tree items.
     * @returns void.
     */
    DropDownTree.prototype.showPopup = function () {
        if (!this.enabled || this.readonly || this.isPopupOpen) {
            return;
        }
        this.renderPopup();
        this.focusIn();
    };
    /**
     * Return the module name.
     * @private
     */
    DropDownTree.prototype.getModuleName = function () {
        return 'dropdowntree';
    };
    __decorate([
        sf.base.Property('The Request Failed')
    ], DropDownTree.prototype, "actionFailureTemplate", void 0);
    __decorate([
        sf.base.Property(false)
    ], DropDownTree.prototype, "allowFiltering", void 0);
    __decorate([
        sf.base.Property(false)
    ], DropDownTree.prototype, "allowMultiSelection", void 0);
    __decorate([
        sf.base.Property(true)
    ], DropDownTree.prototype, "changeOnBlur", void 0);
    __decorate([
        sf.base.Property('')
    ], DropDownTree.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(',')
    ], DropDownTree.prototype, "delimiterChar", void 0);
    __decorate([
        sf.base.Property(true)
    ], DropDownTree.prototype, "enabled", void 0);
    __decorate([
        sf.base.Complex({}, Fields)
    ], DropDownTree.prototype, "fields", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownTree.prototype, "filterBarPlaceholder", void 0);
    __decorate([
        sf.base.Property('StartsWith')
    ], DropDownTree.prototype, "filterType", void 0);
    __decorate([
        sf.base.Property('Never')
    ], DropDownTree.prototype, "floatLabelType", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownTree.prototype, "footerTemplate", void 0);
    __decorate([
        sf.base.Property(false)
    ], DropDownTree.prototype, "ignoreAccent", void 0);
    __decorate([
        sf.base.Property(true)
    ], DropDownTree.prototype, "ignoreCase", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownTree.prototype, "headerTemplate", void 0);
    __decorate([
        sf.base.Property({})
    ], DropDownTree.prototype, "htmlAttributes", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownTree.prototype, "itemTemplate", void 0);
    __decorate([
        sf.base.Property('Default')
    ], DropDownTree.prototype, "mode", void 0);
    __decorate([
        sf.base.Property('No Records Found')
    ], DropDownTree.prototype, "noRecordsTemplate", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownTree.prototype, "placeholder", void 0);
    __decorate([
        sf.base.Property('300px')
    ], DropDownTree.prototype, "popupHeight", void 0);
    __decorate([
        sf.base.Property('100%')
    ], DropDownTree.prototype, "popupWidth", void 0);
    __decorate([
        sf.base.Property(false)
    ], DropDownTree.prototype, "readonly", void 0);
    __decorate([
        sf.base.Property(false)
    ], DropDownTree.prototype, "showSelectAll", void 0);
    __decorate([
        sf.base.Property('Select All')
    ], DropDownTree.prototype, "selectAllText", void 0);
    __decorate([
        sf.base.Property(false)
    ], DropDownTree.prototype, "showCheckBox", void 0);
    __decorate([
        sf.base.Property(true)
    ], DropDownTree.prototype, "showClearButton", void 0);
    __decorate([
        sf.base.Property(true)
    ], DropDownTree.prototype, "showDropDownIcon", void 0);
    __decorate([
        sf.base.Property('None')
    ], DropDownTree.prototype, "sortOrder", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownTree.prototype, "text", void 0);
    __decorate([
        sf.base.Complex({}, TreeSettings)
    ], DropDownTree.prototype, "treeSettings", void 0);
    __decorate([
        sf.base.Property('Unselect All')
    ], DropDownTree.prototype, "unSelectAllText", void 0);
    __decorate([
        sf.base.Property(null)
    ], DropDownTree.prototype, "value", void 0);
    __decorate([
        sf.base.Property('100%')
    ], DropDownTree.prototype, "width", void 0);
    __decorate([
        sf.base.Property(1000)
    ], DropDownTree.prototype, "zIndex", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownTree.prototype, "actionFailure", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownTree.prototype, "beforeOpen", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownTree.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownTree.prototype, "close", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownTree.prototype, "blur", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownTree.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownTree.prototype, "dataBound", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownTree.prototype, "destroyed", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownTree.prototype, "filtering", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownTree.prototype, "focus", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownTree.prototype, "keyPress", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownTree.prototype, "open", void 0);
    __decorate([
        sf.base.Event()
    ], DropDownTree.prototype, "select", void 0);
    DropDownTree = __decorate([
        sf.base.NotifyPropertyChanges
    ], DropDownTree);
    return DropDownTree;
}(sf.base.Component));

/**
 * export all modules from current location
 */

exports.Fields = Fields;
exports.TreeSettings = TreeSettings;
exports.DropDownTree = DropDownTree;

return exports;

});
sfBlazor.modules["dropdowntree"] = "dropdowns.DropDownTree";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.dropdowntree, () => {
    sf.dropdowns = sf.base.extend({}, sf.dropdowns, sfdropdowntree({}));
});