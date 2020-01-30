import { Browser, ChildProperty, Complex, Component, Event, EventHandler, Internationalization, L10n, NotifyPropertyChanges, Property, SanitizeHtmlHelper, Touch, addClass, closest, compile, detach, extend, getValue, isNullOrUndefined, removeClass, resetBlazorTemplate, select, setStyleAttribute, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { DataManager, ODataV4Adaptor, Predicate, Query, UrlAdaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import { Button } from '@syncfusion/ej2-buttons';
import { DatePicker, DateRangePicker, DateTimePicker, TimePicker } from '@syncfusion/ej2-calendars';
import { ColorPicker, FormValidator, MaskedTextBox, NumericTextBox, Slider, TextBox } from '@syncfusion/ej2-inputs';
import { Tooltip, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { AutoComplete, ComboBox, DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { HtmlEditor, Image, Link, MarkdownEditor, QuickToolbar, RichTextEditor, Table, Toolbar } from '@syncfusion/ej2-richtexteditor';

/**
 * Exports util methods used by In-place editor.
 */
var intl = new Internationalization();
/**
 * @hidden
 */
function parseValue(type, val, model) {
    if (isNullOrUndefined(val) || val === '') {
        return '';
    }
    var result;
    var tempFormat;
    switch (type) {
        case 'Color':
            var hex = val;
            result = (hex.length > 7) ? hex.slice(0, -2) : hex;
            break;
        case 'Date':
            tempFormat = model.format;
            result = intl.formatDate(val, { format: tempFormat, type: type, skeleton: 'yMd' });
            break;
        case 'DateRange':
            tempFormat = model.format;
            var date = val;
            result = intl.formatDate(date[0], { format: tempFormat, type: type, skeleton: 'yMd' }) + ' - '
                + intl.formatDate(date[1], { format: tempFormat, type: type, skeleton: 'yMd' });
            break;
        case 'DateTime':
            tempFormat = model.format;
            if (isNullOrUndefined(tempFormat) || tempFormat === '') {
                result = intl.formatDate(val, { format: tempFormat, type: type, skeleton: 'yMd' }) + ' '
                    + intl.formatDate(val, { format: tempFormat, type: type, skeleton: 'hm' });
            }
            else {
                result = intl.formatDate(val, { format: tempFormat, type: type, skeleton: 'yMd' });
            }
            break;
        case 'Time':
            tempFormat = model.format;
            result = intl.formatDate(val, { format: tempFormat, type: type, skeleton: 'hm' });
            break;
        case 'Numeric':
            tempFormat = isNullOrUndefined(model.format) ? 'n2' :
                model.format;
            var tempVal = isNullOrUndefined(val) ? null : (typeof (val) === 'number' ? val : intl.parseNumber(val));
            result = intl.formatNumber(tempVal, { format: tempFormat });
            break;
        default:
            result = val.toString();
            break;
    }
    return result;
}
function getCompValue(type, val) {
    if (isNullOrUndefined(val) || val === '') {
        return val;
    }
    if ((type === 'Date' || type === 'Time' || type === 'DateTime') && typeof (val) === 'string') {
        val = new Date(val);
    }
    else if (type === 'DateRange') {
        if (typeof (val) === 'object' && typeof (val[0]) === 'string') {
            val = [new Date(val[0]), new Date(val[1])];
        }
        else if (typeof (val) === 'string') {
            var temp = val.split('-');
            val = [new Date(temp[0]), new Date(temp[1])];
        }
    }
    return val;
}

/**
 * InPlace-Editor events defined here.
 */
/** @hidden */
var render = 'render';
/** @hidden */
var update = 'update';
/** @hidden */
var destroy = 'destroy';
/** @hidden */
var setFocus = 'set-focus';
/** @hidden */
var accessValue = 'access-value';
/** @hidden */
var destroyModules = 'destroy-modules';
/** @hidden */
var showPopup = 'show-popup';

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
 * Configures the popup settings of the In-place editor.
 */
var PopupSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(PopupSettings, _super);
    function PopupSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('')
    ], PopupSettings.prototype, "title", void 0);
    __decorate([
        Property(null)
    ], PopupSettings.prototype, "model", void 0);
    return PopupSettings;
}(ChildProperty));
/**
 * @hidden
 */
var modulesList = {
    'AutoComplete': 'auto-complete',
    'Color': 'color-picker',
    'ComboBox': 'combo-box',
    'DateRange': 'date-range-picker',
    'MultiSelect': 'multi-select',
    'RTE': 'rte',
    'Slider': 'slider',
    'Time': 'time-picker'
};
/**
 * @hidden
 */
var localeConstant = {
    'Click': { 'editAreaClick': 'Click to edit' },
    'DblClick': { 'editAreaDoubleClick': 'Double click to edit' },
    'EditIconClick': { 'editAreaClick': 'Click to edit' },
};

/**
 * InPlace-Editor classes defined here.
 */
/** @hidden */
var ROOT = 'e-inplaceeditor';
/** @hidden */
var ROOT_TIP = 'e-inplaceeditor-tip';
/** @hidden */
var VALUE_WRAPPER = 'e-editable-value-wrapper';
/** @hidden */
var VALUE = 'e-editable-value';
/** @hidden */
var OVERLAY_ICON = 'e-editable-overlay-icon';
/** @hidden */
var TIP_TITLE = 'e-editable-tip-title';
/** @hidden */
var TITLE = 'e-editable-title';
/** @hidden */
var INLINE = 'e-editable-inline';
/** @hidden */
var POPUP = 'e-editable-popup';
/** @hidden */
var WRAPPER = 'e-editable-wrapper';
/** @hidden */
var LOADING = 'e-editable-loading';
/** @hidden */
var FORM = 'e-editable-form';
/** @hidden */
var CTRL_GROUP = 'e-component-group';
/** @hidden */
var INPUT = 'e-editable-component';
/** @hidden */
var BUTTONS = 'e-editable-action-buttons';
/** @hidden */
var EDITABLE_ERROR = 'e-editable-error';
/** @hidden */
var ELEMENTS = 'e-editable-elements';
/** @hidden */
var OPEN = 'e-editable-open';
/** @hidden */
var BTN_SAVE = 'e-btn-save';
/** @hidden */
var BTN_CANCEL = 'e-btn-cancel';
/** @hidden */
var RTE_SPIN_WRAP = 'e-rte-spin-wrap';
/** @hidden */
var CTRL_OVERLAY = 'e-control-overlay';
/** @hidden */
var DISABLE = 'e-disable';
/** @hidden */
var ICONS = 'e-icons';
/** @hidden */
var PRIMARY = 'e-primary';
/** @hidden */
var SHOW = 'e-show';
/** @hidden */
var HIDE = 'e-hide';
/** @hidden */
var RTL = 'e-rtl';
/** @hidden */
var ERROR = 'e-error';
/** @hidden */
var LOAD = 'e-loading';

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
/* Helper modules */
/* Models */
/* Interface */
/**
 * ```html
 * * The In-place editor control is used to edit an element in a place and to update the value in server.
 * <div id='element' />
 * <script>
 *   var editorObj = new InPlaceEditor();
 *   editorObj.appendTo('#element');
 * </script>
 * ```
 */
var InPlaceEditor = /** @__PURE__ @class */ (function (_super) {
    __extends$1(InPlaceEditor, _super);
    /**
     * Initializes a new instance of the In-place editor class.
     * @param options  - Specifies In-place editor model properties as options.
     * @param element  - Specifies the element for which In-place editor applies.
     */
    function InPlaceEditor(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.initRender = true;
        _this.isTemplate = false;
        _this.isExtModule = false;
        _this.submitBtn = undefined;
        _this.cancelBtn = undefined;
        _this.isClearTarget = false;
        _this.btnElements = undefined;
        _this.dataManager = undefined;
        _this.divComponents = ['RTE', 'Slider'];
        _this.clearComponents = ['AutoComplete', 'Mask', 'Text'];
        _this.dateType = ['Date', 'DateTime', 'Time'];
        _this.inputDataEle = ['Date', 'DateTime', 'DateRange', 'Time', 'Numeric'];
        _this.dropDownEle = ['AutoComplete', 'ComboBox', 'DropDownList', 'MultiSelect'];
        _this.moduleList = ['AutoComplete', 'Color', 'ComboBox', 'DateRange', 'MultiSelect', 'RTE', 'Slider', 'Time'];
        /**
         * @hidden
         */
        _this.needsID = true;
        return _this;
    }
    /**
     * Initialize the event handler
     * @private
     */
    InPlaceEditor.prototype.preRender = function () {
        if (isNullOrUndefined(this.model)) {
            this.setProperties({ model: {} }, true);
        }
        this.titleEle = this.createElement('div', { className: TITLE });
        if (!isNullOrUndefined(this.popupSettings.model) && this.popupSettings.model.afterOpen) {
            this.afterOpenEvent = this.popupSettings.model.afterOpen;
        }
    };
    /**
     * To Initialize the In-place editor rendering
     * @private
     */
    InPlaceEditor.prototype.render = function () {
        this.element.setAttribute('tabindex', '0');
        this.checkIsTemplate();
        this.disable(this.disabled);
        this.updateAdaptor();
        this.appendValueElement();
        this.updateValue();
        this.renderInitialValue();
        this.wireEvents();
        this.setRtl(this.enableRtl);
        this.enableEditor(this.enableEditMode);
        this.setClass('add', this.cssClass);
        this.renderComplete();
    };
    InPlaceEditor.prototype.setClass = function (action, val) {
        if (!this.isEmpty(val)) {
            action === 'add' ? addClass([this.element], [val]) : removeClass([this.element], [val]);
        }
    };
    InPlaceEditor.prototype.appendValueElement = function () {
        this.valueWrap = this.createElement('div', { id: this.element.id + '_wrap', className: VALUE_WRAPPER });
        if (Object.keys(window).indexOf('ejsInterop') === -1) {
            this.element.innerHTML = '';
        }
        this.valueEle = this.createElement('span', { className: VALUE });
        this.editIcon = this.createElement('span', {
            className: OVERLAY_ICON + ' ' + ICONS,
            attrs: { 'title': this.getLocale({ editIcon: 'Click to edit' }, 'editIcon') }
        });
        this.valueWrap.appendChild(this.valueEle);
        this.valueWrap.appendChild(this.editIcon);
        this.element.appendChild(this.valueWrap);
    };
    InPlaceEditor.prototype.renderInitialValue = function () {
        if (['AutoComplete', 'ComboBox', 'DropDownList', 'MultiSelect'].indexOf(this.type) > -1
            && !isNullOrUndefined(this.value) && !this.isEmpty(this.value.toString()) && !isNullOrUndefined(this.model.fields)
            && !isNullOrUndefined(this.model.dataSource)) {
            this.renderValue(this.getLocale({ loadingText: 'Loading...' }, 'loadingText'));
            this.valueWrap.classList.add(LOAD);
            createSpinner({ target: this.valueWrap, width: 10 });
            showSpinner(this.valueWrap);
            this.getInitFieldMapValue();
        }
        else {
            this.renderValue(this.checkValue(parseValue(this.type, this.value, this.model)));
        }
    };
    InPlaceEditor.prototype.getInitFieldMapValue = function () {
        var _this = this;
        var model = this.model;
        var mText = model.fields.text;
        var mVal = model.fields.value;
        var query = isNullOrUndefined(model.query) ? new Query() : model.query;
        if (model.dataSource instanceof DataManager) {
            model.dataSource.executeQuery(this.getInitQuery(model, query)).then(function (e) {
                _this.updateInitValue(mText, mVal, e.result);
            });
        }
        else {
            this.updateInitValue(mText, mVal, new DataManager(model.dataSource).executeLocal(this.getInitQuery(model, query)));
        }
    };
    InPlaceEditor.prototype.getInitQuery = function (model, query) {
        var predicate;
        var mVal = model.fields.value;
        var value = this.value;
        if (this.type !== 'MultiSelect' || typeof (this.value) !== 'object') {
            predicate = new Predicate(mVal, 'equal', this.value);
        }
        else {
            var i = 0;
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var val = value_1[_i];
                predicate = ((i === 0) ? predicate = new Predicate(mVal, 'equal', val) : predicate.or(mVal, 'equal', val));
                i++;
            }
        }
        return query.where(predicate);
    };
    InPlaceEditor.prototype.updateInitValue = function (mText, mVal, result) {
        if (result.length <= 0) {
            return;
        }
        if (result.length === 1) {
            this.valueEle.innerHTML = this.checkValue(getValue((isNullOrUndefined(mText) ? mVal : mText), result[0]));
        }
        else {
            var val = [];
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var obj = result_1[_i];
                val.push(getValue((isNullOrUndefined(mText) ? mVal : mText), obj));
            }
            this.valueEle.innerHTML = this.checkValue(val.toString());
        }
        hideSpinner(this.valueWrap);
        this.valueWrap.classList.remove(LOAD);
    };
    InPlaceEditor.prototype.renderValue = function (val) {
        this.valueEle.innerHTML = val;
        if (this.type === 'Color') {
            setStyleAttribute(this.valueEle, { 'color': val });
        }
        if (this.mode === 'Inline') {
            removeClass([this.valueWrap], [HIDE]);
        }
    };
    InPlaceEditor.prototype.renderEditor = function () {
        this.prevValue = this.value;
        this.beginEditArgs = { mode: this.mode, cancelFocus: false, cancel: false };
        this.trigger('beginEdit', this.beginEditArgs);
        if (this.beginEditArgs.cancel) {
            return;
        }
        var tipOptions = undefined;
        var target = select('.' + VALUE_WRAPPER, this.element);
        if (this.editableOn !== 'EditIconClick') {
            target.parentElement.removeAttribute('title');
        }
        if (this.valueWrap.classList.contains(OPEN)) {
            return;
        }
        if (this.mode === 'Inline') {
            this.loaderWidth = this.valueWrap.offsetWidth;
            addClass([this.valueWrap], [HIDE]);
            this.inlineWrapper = this.createElement('div', { className: INLINE });
            this.element.appendChild(this.inlineWrapper);
            if (['AutoComplete', 'ComboBox', 'DropDownList', 'MultiSelect'].indexOf(this.type) > -1) {
                this.checkRemoteData(this.model);
            }
            else {
                this.renderAndOpen();
            }
        }
        else {
            if (!isNullOrUndefined(this.popupSettings.model) && this.popupSettings.model.afterOpen) {
                this.popupSettings.model.afterOpen = this.afterOpenHandler.bind(this);
            }
            var content = this.createElement('div', { className: POPUP });
            if (!this.isEmpty(this.popupSettings.title)) {
                this.titleEle.innerHTML = this.popupSettings.title;
                content.appendChild(this.titleEle);
            }
            tipOptions = {
                content: content, opensOn: 'Custom',
                enableRtl: this.enableRtl, cssClass: ROOT_TIP,
                afterOpen: this.afterOpenHandler.bind(this)
            };
            content.appendChild(this.renderControl(document.body));
            extend(tipOptions, this.popupSettings.model, tipOptions, true);
            this.tipObj = new Tooltip(tipOptions);
            this.tipObj.appendTo(target);
            this.tipObj.open(target);
        }
        if (this.actionOnBlur !== 'Ignore') {
            this.wireDocEvent();
        }
        addClass([this.valueWrap], [OPEN]);
        this.setProperties({ enableEditMode: true }, true);
    };
    InPlaceEditor.prototype.renderAndOpen = function () {
        this.renderControl(this.inlineWrapper);
        this.afterOpenHandler(null);
    };
    InPlaceEditor.prototype.checkRemoteData = function (model) {
        var _this = this;
        if (model.dataSource instanceof DataManager) {
            model.dataBound = function () {
                _this.afterOpenHandler(null);
            };
            this.renderControl(this.inlineWrapper);
            if ((isNullOrUndefined(model.value) && isNullOrUndefined(this.value)) || (model.value === this.value
                && (!isNullOrUndefined(model.value) && model.value.length === 0))) {
                this.showDropDownPopup();
            }
        }
        else {
            this.renderAndOpen();
        }
    };
    InPlaceEditor.prototype.showDropDownPopup = function () {
        if (this.type === 'DropDownList') {
            this.componentObj.focusIn();
            this.componentObj.showPopup();
        }
        else {
            if (this.isExtModule) {
                this.notify(((this.type === 'MultiSelect') ? setFocus : showPopup), {});
            }
        }
    };
    InPlaceEditor.prototype.setAttribute = function (ele, attr) {
        var value = this.name && this.name.length !== 0 ? this.name : this.element.id;
        attr.forEach(function (val) {
            ele.setAttribute(val, ((val === 'id') ? (value + '_editor') : value));
        });
    };
    InPlaceEditor.prototype.renderControl = function (target) {
        var ele;
        this.containerEle = this.createElement('div', { className: WRAPPER });
        this.loader = this.createElement('div', { className: LOADING });
        this.formEle = this.createElement('form', { className: FORM });
        var ctrlGroupEle = this.createElement('div', { className: CTRL_GROUP });
        var inputWrap = this.createElement('div', { className: INPUT });
        target.appendChild(this.containerEle);
        this.loadSpinner();
        this.containerEle.appendChild(this.formEle);
        this.formEle.appendChild(ctrlGroupEle);
        if (this.isTemplate) {
            this.appendTemplate(inputWrap, this.template);
        }
        else {
            if (Array.prototype.indexOf.call(this.divComponents, this.type) > -1) {
                ele = this.createElement('div');
                this.setAttribute(ele, ['id']);
            }
            else {
                ele = this.createElement('input');
                this.setAttribute(ele, ['id', 'name']);
            }
            this.componentRoot = ele;
            inputWrap.appendChild(ele);
            inputWrap.appendChild(this.loader);
        }
        ctrlGroupEle.appendChild(inputWrap);
        ctrlGroupEle.appendChild(this.createElement('div', { className: EDITABLE_ERROR }));
        this.appendButtons(this.formEle);
        if (!this.isTemplate) {
            this.renderComponent(ele);
        }
        this.removeSpinner();
        if (this.submitOnEnter) {
            this.wireEditorKeyDownEvent(this.containerEle);
        }
        return this.containerEle;
    };
    InPlaceEditor.prototype.appendButtons = function (trg) {
        if (this.showButtons && trg) {
            this.btnElements = this.renderButtons();
            trg.appendChild(this.btnElements);
            this.wireBtnEvents();
        }
    };
    InPlaceEditor.prototype.renderButtons = function () {
        var btnWrap = this.createElement('div', { className: BUTTONS });
        var primary = (!isNullOrUndefined(this.saveButton.content) && this.saveButton.content.length !== 0) ? (' ' + PRIMARY) : '';
        this.submitBtn = this.createButtons({
            constant: 'save', type: 'submit', container: btnWrap,
            title: { save: 'Save' }, model: this.saveButton,
            className: BTN_SAVE + primary
        });
        this.cancelBtn = this.createButtons({
            type: 'button', constant: 'cancel', title: { cancel: 'Cancel' },
            container: btnWrap, model: this.cancelButton,
            className: BTN_CANCEL
        });
        return btnWrap;
    };
    InPlaceEditor.prototype.createButtons = function (args) {
        var btnObj = undefined;
        if (Object.keys(args.model).length > 0) {
            var btnEle = this.createElement('button', {
                className: args.className,
                attrs: { 'type': args.type, 'title': this.getLocale(args.title, args.constant) }
            });
            args.container.appendChild(btnEle);
            btnObj = new Button(args.model, btnEle);
        }
        return btnObj;
    };
    InPlaceEditor.prototype.renderComponent = function (ele) {
        this.isExtModule = (Array.prototype.indexOf.call(this.moduleList, this.type) > -1) ? true : false;
        var classProp;
        if (!isNullOrUndefined(this.model.cssClass)) {
            classProp = this.model.cssClass.indexOf(ELEMENTS) < 0 ?
                this.model.cssClass === '' ? ELEMENTS : this.model.cssClass + ' ' + ELEMENTS :
                this.model.cssClass;
        }
        else {
            classProp = ELEMENTS;
        }
        extend(this.model, this.model, { cssClass: classProp });
        if (!isNullOrUndefined(this.value)) {
            this.updateModelValue();
        }
        if (this.isExtModule) {
            this.notify(render, { module: modulesList[this.type], target: ele, type: this.type });
        }
        else {
            if (isNullOrUndefined(this.model.showClearButton)) {
                this.model.showClearButton = true;
            }
            switch (this.type) {
                case 'Date':
                    this.componentObj = new DatePicker(this.model);
                    break;
                case 'DateTime':
                    this.componentObj = new DateTimePicker(this.model);
                    break;
                case 'DropDownList':
                    this.componentObj = new DropDownList(this.model);
                    break;
                case 'Mask':
                    this.componentObj = new MaskedTextBox(this.model);
                    break;
                case 'Numeric':
                    if (this.model.value) {
                        this.model.value = this.model.value.toString().replace(/[`~!@#$%^&*()_|\=?;:'",<>\{\}\[\]\\\/]/gi, '');
                    }
                    this.componentObj = new NumericTextBox(this.model);
                    break;
                case 'Text':
                    this.componentObj = new TextBox(this.model);
                    break;
            }
            this.componentObj.appendTo(ele);
        }
    };
    InPlaceEditor.prototype.updateAdaptor = function () {
        switch (this.adaptor) {
            case 'UrlAdaptor':
                this.dataAdaptor = new UrlAdaptor;
                break;
            case 'WebApiAdaptor':
                this.dataAdaptor = new WebApiAdaptor;
                break;
            case 'ODataV4Adaptor':
                this.dataAdaptor = new ODataV4Adaptor;
                break;
        }
    };
    InPlaceEditor.prototype.loadSpinner = function (callType) {
        addClass([this.loader], [SHOW]);
        if (callType === 'validate' && (this.type === 'RTE' || this.type === 'Color' || this.type === 'Slider')) {
            addClass([this.loader], [RTE_SPIN_WRAP]);
            addClass([this.getEditElement()], [CTRL_OVERLAY]);
            this.spinObj = { target: this.loader };
        }
        else {
            this.spinObj = { target: this.loader, width: Browser.isDevice ? '16px' : '14px' };
        }
        if (this.formEle) {
            addClass([this.formEle], [LOAD]);
        }
        if (this.btnElements) {
            addClass([this.btnElements], [HIDE]);
        }
        setStyleAttribute(this.loader, { 'width': '100%' });
        createSpinner(this.spinObj);
        showSpinner(this.spinObj.target);
    };
    InPlaceEditor.prototype.removeSpinner = function (callType) {
        this.loader.removeAttribute('style');
        hideSpinner(this.spinObj.target);
        detach(this.spinObj.target.firstChild);
        if (callType === 'submit' && (this.type === 'RTE' || this.type === 'Color' || this.type === 'Slider')) {
            removeClass([this.loader], [RTE_SPIN_WRAP]);
            removeClass([this.getEditElement()], [CTRL_OVERLAY]);
        }
        if (this.formEle) {
            removeClass([this.formEle], [LOAD]);
        }
        if (this.btnElements) {
            removeClass([this.btnElements], [HIDE]);
        }
        removeClass([this.loader], [SHOW]);
    };
    InPlaceEditor.prototype.getEditElement = function () {
        return select('.' + ELEMENTS, this.formEle);
    };
    InPlaceEditor.prototype.getLocale = function (prop, val) {
        return new L10n('inplace-editor', prop, this.locale).getConstant(val);
    };
    InPlaceEditor.prototype.checkValue = function (val) {
        return (!this.isEmpty(val)) ? val : this.emptyText;
    };
    InPlaceEditor.prototype.extendModelValue = function (val) {
        var model = this.model;
        extend(model, { value: val });
        this.setProperties({ model: model }, true);
    };
    InPlaceEditor.prototype.updateValue = function () {
        if (!isNullOrUndefined(this.value)) {
            this.setProperties({ value: getCompValue(this.type, this.value) }, true);
            this.extendModelValue(getCompValue(this.type, this.value));
        }
    };
    InPlaceEditor.prototype.updateModelValue = function () {
        if (this.type === 'MultiSelect' && !this.isEmpty(this.value)) {
            this.model.value = this.value.slice();
        }
        else {
            this.model.value = this.value;
        }
    };
    InPlaceEditor.prototype.setValue = function () {
        if (this.isExtModule) {
            this.notify(update, { type: this.type });
        }
        else if (this.componentObj) {
            this.setProperties({ value: this.componentObj.value }, true);
            this.extendModelValue(this.componentObj.value);
        }
    };
    InPlaceEditor.prototype.getDropDownsValue = function (display) {
        var value;
        if (Array.prototype.indexOf.call(this.dropDownEle, this.type) > -1 && this.type !== 'MultiSelect') {
            value = display ? select('.e-' + this.type.toLocaleLowerCase(), this.containerEle).value :
                this.value.toString();
        }
        else if (this.type === 'MultiSelect') {
            this.notify(accessValue, { type: this.type });
            value = display ? this.printValue : this.value.join();
        }
        return value;
    };
    InPlaceEditor.prototype.getSendValue = function () {
        if (this.isEmpty(this.value)) {
            return '';
        }
        if (Array.prototype.indexOf.call(this.dropDownEle, this.type) > -1) {
            return this.getDropDownsValue(false);
        }
        else if (Array.prototype.indexOf.call(this.dateType, this.type) > -1) {
            return this.value.toISOString();
        }
        else if (this.type === 'DateRange') {
            return this.value[0].toISOString() + ' - ' + this.value[1].toISOString();
        }
        else {
            return this.value.toString();
        }
    };
    InPlaceEditor.prototype.getRenderValue = function () {
        if (this.type === 'Mask' && this.componentObj.value.length !== 0) {
            return this.componentObj.getMaskedValue();
        }
        else if (Array.prototype.indexOf.call(this.inputDataEle, this.type) > -1) {
            return this.componentRoot.value;
        }
        else if (Array.prototype.indexOf.call(this.dropDownEle, this.type) > -1) {
            return this.getDropDownsValue(true);
        }
        else {
            return parseValue(this.type, this.value, this.model);
        }
    };
    InPlaceEditor.prototype.setRtl = function (value) {
        value ? addClass([this.element], [RTL]) : removeClass([this.element], [RTL]);
    };
    InPlaceEditor.prototype.setFocus = function () {
        if (this.isTemplate) {
            return;
        }
        this.isExtModule ? this.notify(setFocus, {}) : this.componentObj.element.focus();
    };
    InPlaceEditor.prototype.removeEditor = function () {
        var blazorContain = Object.keys(window);
        if (blazorContain.indexOf('ejsInterop') !== -1 && !this.isStringTemplate) {
            resetBlazorTemplate(this.element.id + 'template', 'Template');
        }
        var tipEle;
        if (this.tipObj && this.formEle) {
            tipEle = closest(this.formEle, '.' + ROOT_TIP);
            tipEle.classList.add(HIDE);
        }
        this.unWireDocEvent();
        this.destroyComponents();
        this.formEle = undefined;
        if (!isNullOrUndefined(select('.' + INLINE, this.element))) {
            detach(this.inlineWrapper);
            this.inlineWrapper = undefined;
        }
        else if (this.tipObj) {
            if (this.type === 'MultiSelect') {
                EventHandler.remove(this.containerEle, 'mousedown', this.popMouseDown);
                EventHandler.remove(this.containerEle, 'click', this.popClickHandler);
            }
            this.tipObj.close();
            this.tipObj.destroy();
            this.tipObj = undefined;
        }
        this.containerEle = undefined;
        removeClass([this.valueWrap], [OPEN, HIDE]);
        this.setProperties({ enableEditMode: false }, true);
        if (this.editableOn !== 'EditIconClick') {
            var titleConstant = (this.editableOn === 'DblClick') ? 'editAreaDoubleClick' : 'editAreaClick';
            this.valueWrap.parentElement.setAttribute('title', this.getLocale(localeConstant[this.editableOn], titleConstant));
        }
    };
    InPlaceEditor.prototype.destroyComponents = function () {
        if (this.showButtons) {
            this.destroyButtons();
        }
        if (this.isExtModule) {
            this.notify(destroyModules, {});
        }
        else {
            if (this.templateEle) {
                document.body.appendChild(this.templateEle);
                this.templateEle.style.display = 'none';
                this.templateEle = undefined;
            }
            if (!isNullOrUndefined(this.componentObj)) {
                this.componentObj.destroy();
                this.componentObj = undefined;
            }
        }
        if (this.formValidate) {
            this.formValidate = undefined;
        }
        if (this.submitOnEnter && this.containerEle) {
            this.unWireEditorKeyDownEvent(this.containerEle);
        }
    };
    InPlaceEditor.prototype.destroyButtons = function () {
        if (!isNullOrUndefined(this.submitBtn)) {
            EventHandler.remove(this.submitBtn.element, 'mousedown', this.submitHandler);
            EventHandler.remove(this.submitBtn.element, 'click', this.submitPrevent);
            EventHandler.remove(this.submitBtn.element, 'keydown', this.btnKeyDownHandler);
            this.submitBtn.destroy();
            this.submitBtn = undefined;
        }
        if (!isNullOrUndefined(this.cancelBtn)) {
            EventHandler.remove(this.cancelBtn.element, 'mousedown', this.cancelHandler);
            EventHandler.remove(this.cancelBtn.element, 'keydown', this.btnKeyDownHandler);
            this.cancelBtn.destroy();
            this.cancelBtn = undefined;
        }
        this.btnElements = undefined;
    };
    InPlaceEditor.prototype.getQuery = function (params) {
        var query = new Query();
        Object.keys(params).forEach(function (key) {
            query.addParams(key, params[key]);
        });
        return query;
    };
    InPlaceEditor.prototype.sendValue = function () {
        var _this = this;
        var eventArgs = { data: { name: this.name, primaryKey: this.primaryKey, value: this.getSendValue() } };
        this.trigger('actionBegin', eventArgs, function (actionBeginArgs) {
            if (actionBeginArgs.cancel) {
                _this.removeSpinner('submit');
                if (_this.mode === 'Popup') {
                    _this.updateArrow();
                }
            }
            else {
                if (!_this.isEmpty(_this.url) && !_this.isEmpty(_this.primaryKey)
                    && (_this.initRender || (!_this.initRender && _this.prevValue !== _this.value))) {
                    _this.dataManager = new DataManager({ url: _this.url, adaptor: _this.dataAdaptor });
                    if (_this.adaptor === 'UrlAdaptor') {
                        _this.dataManager.executeQuery(_this.getQuery(actionBeginArgs.data), _this.successHandler.bind(_this), _this.failureHandler.bind(_this));
                    }
                    else {
                        var crud = _this.dataManager.insert(actionBeginArgs.data);
                        crud.then(function (e) { return _this.successHandler(e); }).catch(function (e) { return _this.failureHandler(e); });
                    }
                }
                else {
                    var eventArg = { data: {}, value: actionBeginArgs.data.value };
                    _this.triggerSuccess(eventArg);
                }
                _this.dataManager = undefined;
            }
        });
    };
    InPlaceEditor.prototype.isEmpty = function (value) {
        return (!isNullOrUndefined(value) && value.length !== 0) ? false : true;
    };
    InPlaceEditor.prototype.checkIsTemplate = function () {
        this.isTemplate = (!isNullOrUndefined(this.template) && this.template !== '') ? true : false;
    };
    InPlaceEditor.prototype.templateCompile = function (trgEle, tempStr) {
        var tempEle;
        var blazorContain = Object.keys(window);
        if (typeof tempStr === 'string') {
            tempStr = tempStr.trim();
        }
        var compiler = compile(tempStr);
        if (!isNullOrUndefined(compiler)) {
            var isString = (blazorContain.indexOf('ejsInterop') !== -1 &&
                !this.isStringTemplate && (tempStr).indexOf('<div>Blazor') === 0) ?
                this.isStringTemplate : true;
            tempEle = compiler({}, this, 'template', this.element.id + 'template', isString);
        }
        if (!isNullOrUndefined(compiler) && tempEle.length > 0) {
            [].slice.call(tempEle).forEach(function (el) {
                trgEle.appendChild(el);
            });
            if (blazorContain.indexOf('ejsInterop') !== -1 && !this.isStringTemplate && (tempStr).indexOf('<div>Blazor') === 0) {
                updateBlazorTemplate(this.element.id + 'template', 'Template', this);
            }
        }
    };
    /**
     * @hidden
     */
    InPlaceEditor.prototype.sanitizeHelper = function (value) {
        if (this.enableHtmlSanitizer) {
            var item_1 = SanitizeHtmlHelper.beforeSanitize();
            var beforeEvent = {
                cancel: false,
                helper: null
            };
            extend(item_1, item_1, beforeEvent);
            this.trigger('beforeSanitizeHtml', item_1, function (args) {
                if (item_1.cancel && !isNullOrUndefined(item_1.helper)) {
                    value = item_1.helper(value);
                }
                else if (!item_1.cancel) {
                    value = SanitizeHtmlHelper.serializeValue(item_1, value);
                }
            });
        }
        return value;
    };
    InPlaceEditor.prototype.appendTemplate = function (trgEle, tempStr) {
        tempStr = typeof (tempStr) === 'string' ? this.sanitizeHelper(tempStr) : tempStr;
        if (typeof tempStr === 'string' || isNullOrUndefined(tempStr.innerHTML)) {
            if (tempStr[0] === '.' || tempStr[0] === '#') {
                if (document.querySelectorAll(tempStr).length) {
                    this.templateEle = document.querySelector(tempStr);
                    trgEle.appendChild(this.templateEle);
                    this.templateEle.style.display = '';
                }
                else {
                    this.templateCompile(trgEle, tempStr);
                }
            }
            else {
                this.templateCompile(trgEle, tempStr);
            }
        }
        else {
            this.templateEle = tempStr;
            trgEle.appendChild(this.templateEle);
        }
    };
    InPlaceEditor.prototype.disable = function (value) {
        value ? addClass([this.element], [DISABLE]) : removeClass([this.element], [DISABLE]);
    };
    InPlaceEditor.prototype.enableEditor = function (val) {
        (val) ? this.renderEditor() : this.cancelHandler();
    };
    InPlaceEditor.prototype.checkValidation = function () {
        var _this = this;
        var args;
        if (this.validationRules) {
            this.formValidate = new FormValidator(this.formEle, {
                rules: this.validationRules,
                validationComplete: function (e) {
                    args = {
                        errorMessage: e.message,
                        data: { name: _this.name, primaryKey: _this.primaryKey, value: _this.checkValue(_this.getSendValue()) }
                    };
                    _this.trigger('validating', args, function (validateArgs) {
                        if (e.status === 'failure') {
                            e.errorElement.innerText = validateArgs.errorMessage;
                            _this.toggleErrorClass(true);
                        }
                        else {
                            _this.toggleErrorClass(false);
                        }
                    });
                },
                customPlacement: function (inputElement, errorElement) {
                    select('.' + EDITABLE_ERROR, _this.formEle).appendChild(errorElement);
                }
            });
            this.formValidate.validate();
        }
        else {
            args = {
                errorMessage: '',
                data: { name: this.name, primaryKey: this.primaryKey, value: this.checkValue(this.getSendValue()) }
            };
            this.trigger('validating', args, function (validateArgs) {
                if (validateArgs.errorMessage) {
                    select('.' + EDITABLE_ERROR, _this.formEle).innerHTML = validateArgs.errorMessage;
                    _this.toggleErrorClass(true);
                }
                else {
                    _this.toggleErrorClass(false);
                }
            });
        }
    };
    InPlaceEditor.prototype.toggleErrorClass = function (value) {
        if (isNullOrUndefined(this.formEle)) {
            return;
        }
        var inputEle = select('.e-input-group', this.formEle);
        var errorClass = function (element, val, action) {
            [].slice.call(element).forEach(function (ele) {
                if (ele) {
                    action === 'add' ? addClass([ele], [val]) : removeClass([ele], [val]);
                }
            });
        };
        errorClass([this.formEle, inputEle], ERROR, value ? 'add' : 'remove');
    };
    InPlaceEditor.prototype.updateArrow = function () {
        var pos = this.tipObj.tipPointerPosition;
        this.tipObj.tipPointerPosition = (pos === 'Middle') ? 'Auto' : 'Middle';
        this.tipObj.tipPointerPosition = pos;
        this.tipObj.dataBind();
    };
    InPlaceEditor.prototype.triggerSuccess = function (args) {
        var _this = this;
        var val = args.value;
        this.trigger('actionSuccess', args, function (actionArgs) {
            _this.removeSpinner('submit');
            if (!actionArgs.cancel) {
                _this.renderValue(_this.checkValue((actionArgs.value !== val) ? actionArgs.value : _this.getRenderValue()));
            }
            if (actionArgs.cancel && _this.mode === 'Inline') {
                removeClass([_this.valueWrap], [HIDE]);
            }
            _this.removeEditor();
        });
    };
    InPlaceEditor.prototype.wireEvents = function () {
        this.wireEditEvent(this.editableOn);
        EventHandler.add(this.editIcon, 'click', this.clickHandler, this);
        EventHandler.add(this.element, 'keydown', this.valueKeyDownHandler, this);
        EventHandler.add(document, 'scroll', this.scrollResizeHandler, this);
        window.addEventListener('resize', this.scrollResizeHandler.bind(this));
        if (Array.prototype.indexOf.call(this.clearComponents, this.type) > -1) {
            EventHandler.add(this.element, 'mousedown', this.mouseDownHandler, this);
        }
    };
    InPlaceEditor.prototype.wireDocEvent = function () {
        EventHandler.add(document, 'mousedown', this.docClickHandler, this);
    };
    InPlaceEditor.prototype.wireEditEvent = function (event) {
        if (event === 'EditIconClick') {
            return;
        }
        var titleConstant = (event === 'Click') ? 'editAreaClick' : 'editAreaDoubleClick';
        this.element.setAttribute('title', this.getLocale(localeConstant[event], titleConstant));
        if (Browser.isDevice && Browser.isIos && event === 'DblClick') {
            this.touchModule = new Touch(this.valueWrap, { tap: this.doubleTapHandler.bind(this) });
        }
        else {
            EventHandler.add(this.valueWrap, event.toLowerCase(), this.clickHandler, this);
        }
    };
    InPlaceEditor.prototype.wireEditorKeyDownEvent = function (ele) {
        EventHandler.add(ele, 'keydown', this.enterKeyDownHandler, this);
    };
    InPlaceEditor.prototype.wireBtnEvents = function () {
        if (!isNullOrUndefined(this.submitBtn)) {
            EventHandler.add(this.submitBtn.element, 'mousedown', this.submitHandler, this);
            EventHandler.add(this.submitBtn.element, 'click', this.submitPrevent, this);
            EventHandler.add(this.submitBtn.element, 'keydown', this.btnKeyDownHandler, this);
        }
        if (!isNullOrUndefined(this.cancelBtn)) {
            EventHandler.add(this.cancelBtn.element, 'mousedown', this.cancelHandler, this);
            EventHandler.add(this.cancelBtn.element, 'keydown', this.btnKeyDownHandler, this);
        }
    };
    InPlaceEditor.prototype.unWireEvents = function () {
        this.unWireEditEvent(this.editableOn);
        EventHandler.remove(this.editIcon, 'click', this.clickHandler);
        EventHandler.remove(document, 'scroll', this.scrollResizeHandler);
        window.removeEventListener('resize', this.scrollResizeHandler.bind(this));
        EventHandler.remove(this.element, 'keydown', this.valueKeyDownHandler);
        if (Array.prototype.indexOf.call(this.clearComponents, this.type) > -1) {
            EventHandler.remove(this.element, 'mousedown', this.mouseDownHandler);
        }
    };
    InPlaceEditor.prototype.unWireDocEvent = function () {
        EventHandler.remove(document, 'mousedown', this.docClickHandler);
    };
    InPlaceEditor.prototype.unWireEditEvent = function (event) {
        if (event === 'EditIconClick') {
            return;
        }
        this.element.removeAttribute('title');
        if (Browser.isDevice && Browser.isIos && event === 'DblClick') {
            this.touchModule.destroy();
            this.touchModule = undefined;
        }
        else {
            EventHandler.remove(this.valueWrap, event.toLowerCase(), this.clickHandler);
        }
    };
    InPlaceEditor.prototype.unWireEditorKeyDownEvent = function (ele) {
        EventHandler.remove(ele, 'keydown', this.enterKeyDownHandler);
    };
    InPlaceEditor.prototype.submitPrevent = function (e) {
        e.preventDefault();
    };
    InPlaceEditor.prototype.btnKeyDownHandler = function (e) {
        var trg = e.target;
        if ((e.keyCode === 13 && e.which === 13) || (e.keyCode === 32 && e.which === 32)) {
            if (trg.classList.contains(BTN_SAVE)) {
                this.save();
            }
            else if (trg.classList.contains(BTN_CANCEL)) {
                this.cancelHandler();
            }
        }
        if (e.keyCode === 9 && e.shiftKey === false &&
            (isNullOrUndefined(e.target.nextElementSibling) ||
                e.target.nextElementSibling.tagName !== 'BUTTON')) {
            if (this.actionOnBlur === 'Submit') {
                this.save();
                this.cancelHandler();
            }
            else if (this.actionOnBlur === 'Cancel') {
                this.cancelHandler();
            }
        }
    };
    InPlaceEditor.prototype.afterOpenHandler = function (e) {
        var _this = this;
        if (this.mode === 'Popup' && this.type === 'MultiSelect') {
            EventHandler.add(this.containerEle, 'mousedown', this.popMouseDown, this);
            EventHandler.add(this.containerEle, 'click', this.popClickHandler, this);
        }
        if (this.mode === 'Popup' && !this.isEmpty(this.titleEle.innerHTML)) {
            e.element.classList.add(TIP_TITLE);
        }
        if (this.type === 'RTE') {
            this.rteModule.refresh();
            this.setAttribute(select('.e-richtexteditor textarea', this.containerEle), ['name']);
        }
        else if (this.type === 'Slider') {
            this.sliderModule.refresh();
            this.setAttribute(select('.e-slider-input', this.containerEle), ['name']);
        }
        var eventArgs = { mode: this.mode, cancelFocus: false };
        this.trigger('beginEdit', eventArgs, function (args) {
            if (!_this.beginEditArgs.cancelFocus) {
                if (_this.mode === 'Inline' && (['AutoComplete', 'ComboBox', 'DropDownList', 'MultiSelect'].indexOf(_this.type) > -1)
                    && _this.model.dataSource instanceof DataManager) {
                    _this.showDropDownPopup();
                }
                else {
                    _this.setFocus();
                }
            }
            if (_this.afterOpenEvent) {
                _this.tipObj.setProperties({ afterOpen: _this.afterOpenEvent }, true);
                _this.tipObj.trigger('afterOpen', e);
            }
        });
    };
    InPlaceEditor.prototype.popMouseDown = function (e) {
        var trgClass = e.target.classList;
        if (trgClass.contains('e-chips-close') && !trgClass.contains('e-close-hooker')) {
            this.updateArrow();
        }
    };
    InPlaceEditor.prototype.doubleTapHandler = function (e) {
        if (e.tapCount > 1) {
            this.clickHandler(e.originalEvent);
        }
    };
    InPlaceEditor.prototype.clickHandler = function (e) {
        if (this.editableOn !== 'EditIconClick') {
            e.stopPropagation();
        }
        this.renderEditor();
    };
    InPlaceEditor.prototype.submitHandler = function (e) {
        e.preventDefault();
        this.save();
    };
    InPlaceEditor.prototype.cancelHandler = function () {
        this.removeEditor();
    };
    InPlaceEditor.prototype.popClickHandler = function (e) {
        var tipTarget = select('.' + VALUE_WRAPPER, this.element);
        if (e.target.classList.contains('e-chips-close')) {
            this.tipObj.refresh(tipTarget);
        }
    };
    InPlaceEditor.prototype.successHandler = function (e) {
        this.initRender = false;
        var eventArgs = { data: e, value: this.getSendValue() };
        this.triggerSuccess(eventArgs);
    };
    InPlaceEditor.prototype.failureHandler = function (e) {
        var _this = this;
        var eventArgs = { data: e, value: this.getSendValue() };
        this.trigger('actionFailure', eventArgs, function (args) {
            _this.removeSpinner('submit');
            if (_this.mode === 'Popup') {
                _this.updateArrow();
            }
        });
    };
    InPlaceEditor.prototype.enterKeyDownHandler = function (e) {
        if (!closest(e.target, '.' + INPUT + ' .e-richtexteditor')) {
            if ((e.keyCode === 13 && e.which === 13) && closest(e.target, '.' + INPUT)) {
                this.save();
            }
            else if (e.keyCode === 27 && e.which === 27) {
                this.cancelHandler();
            }
        }
    };
    InPlaceEditor.prototype.valueKeyDownHandler = function (e) {
        if (e.keyCode === 9 && e.shiftKey === true && e.target.tagName !== 'BUTTON') {
            if (this.actionOnBlur === 'Submit') {
                this.save();
                this.cancelHandler();
            }
            else if (this.actionOnBlur === 'Cancel') {
                this.cancelHandler();
            }
        }
        if ((e.keyCode === 13 && e.which === 13) && e.target.classList.contains(ROOT) &&
            !this.valueWrap.classList.contains(OPEN) && !this.element.classList.contains(DISABLE)) {
            e.preventDefault();
            this.renderEditor();
        }
    };
    InPlaceEditor.prototype.mouseDownHandler = function (e) {
        if (e.target.classList.contains('e-clear-icon')) {
            this.isClearTarget = true;
        }
    };
    InPlaceEditor.prototype.scrollResizeHandler = function () {
        if (this.mode === 'Popup' && this.tipObj && !(Browser.isDevice)) {
            this.removeEditor();
        }
    };
    InPlaceEditor.prototype.docClickHandler = function (e) {
        var trg = e.target;
        if (this.isClearTarget) {
            this.isClearTarget = false;
            return;
        }
        var relateRoot = closest(trg, '.' + ROOT);
        var relateTipRoot = closest(trg, '.' + ROOT_TIP);
        var relateElements = closest(trg, '.' + ELEMENTS);
        var relateRTEElements = closest(trg, '.e-rte-elements');
        if ((!isNullOrUndefined(relateRoot) && relateRoot.isEqualNode(this.element)) ||
            (!isNullOrUndefined(relateTipRoot) && this.tipObj && (relateTipRoot.id.indexOf(this.valueWrap.id) > -1)) ||
            !isNullOrUndefined(relateElements) || !isNullOrUndefined(relateRTEElements) || trg.classList.contains('e-chips-close')) {
            return;
        }
        else {
            if (this.actionOnBlur === 'Submit') {
                this.save();
            }
            else if (this.actionOnBlur === 'Cancel') {
                this.cancelHandler();
            }
        }
    };
    /**
     * Validate current editor value.
     * @returns void
     */
    InPlaceEditor.prototype.validate = function () {
        this.checkValidation();
    };
    /**
     * Submit the edited input value to the server.
     * @returns void
     */
    InPlaceEditor.prototype.save = function () {
        if (!this.formEle) {
            return;
        }
        this.element.focus();
        this.editEle = select('.' + INPUT, this.formEle);
        var errEle = null;
        errEle = select('.' + ERROR, this.editEle);
        var type = this.type;
        var calendarComp = type === 'Date' || type === 'DateTime' || type === 'DateRange' || type === 'Time';
        if ((errEle && !isNullOrUndefined(this.validationRules)) || (errEle && calendarComp)) {
            return;
        }
        if (!this.isTemplate) {
            this.setValue();
        }
        this.checkValidation();
        if (!this.formEle.classList.contains(ERROR)) {
            this.loadSpinner('validate');
            if (this.mode === 'Popup') {
                this.updateArrow();
            }
            this.sendValue();
        }
    };
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    InPlaceEditor.prototype.destroy = function () {
        var _this = this;
        this.removeEditor();
        if (this.isExtModule) {
            this.notify(destroy, {});
        }
        this.unWireEvents();
        var classList = [DISABLE, RTL];
        classList.forEach(function (val) {
            removeClass([_this.element], [val]);
        });
        while (this.element.firstElementChild) {
            this.element.removeChild(this.element.firstElementChild);
        }
        _super.prototype.destroy.call(this);
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    InPlaceEditor.prototype.getPersistData = function () {
        return this.addOnPersist(['value']);
    };
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    InPlaceEditor.prototype.requiredModules = function () {
        var modules = [];
        modules.push({ member: modulesList[this.type], args: [this] });
        return modules;
    };
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    InPlaceEditor.prototype.getModuleName = function () {
        return 'inplaceeditor';
    };
    /**
     * Gets called when the model property changes.The data that describes the old and new values of property that changed.
     * @param  {InPlaceEditorModel} newProp
     * @param  {InPlaceEditorModel} oldProp
     * @returns void
     * @private
     */
    InPlaceEditor.prototype.onPropertyChanged = function (newProp, oldProp) {
        this.removeEditor();
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'showButtons':
                    (newProp.showButtons) ? this.appendButtons(this.formEle) : this.destroyButtons();
                    break;
                case 'value':
                    this.updateValue();
                    this.renderInitialValue();
                    break;
                case 'emptyText':
                    this.renderInitialValue();
                    break;
                case 'template':
                    this.checkIsTemplate();
                    break;
                case 'disabled':
                    this.disable(newProp.disabled);
                    break;
                case 'enableRtl':
                    this.setRtl(newProp.enableRtl);
                    break;
                case 'cssClass':
                    this.setClass('remove', oldProp.cssClass);
                    this.setClass('add', newProp.cssClass);
                    break;
                case 'mode':
                    this.enableEditor(this.enableEditMode);
                    break;
                case 'enableEditMode':
                    this.enableEditor(newProp.enableEditMode);
                    break;
                case 'editableOn':
                    this.unWireEditEvent(oldProp.editableOn);
                    if (newProp.editableOn !== 'EditIconClick') {
                        this.wireEditEvent(newProp.editableOn);
                    }
                    break;
            }
        }
    };
    __decorate$1([
        Property('')
    ], InPlaceEditor.prototype, "name", void 0);
    __decorate$1([
        Property(null)
    ], InPlaceEditor.prototype, "value", void 0);
    __decorate$1([
        Property('')
    ], InPlaceEditor.prototype, "template", void 0);
    __decorate$1([
        Property(true)
    ], InPlaceEditor.prototype, "enableHtmlSanitizer", void 0);
    __decorate$1([
        Property('')
    ], InPlaceEditor.prototype, "cssClass", void 0);
    __decorate$1([
        Property('')
    ], InPlaceEditor.prototype, "primaryKey", void 0);
    __decorate$1([
        Property('Empty')
    ], InPlaceEditor.prototype, "emptyText", void 0);
    __decorate$1([
        Property('')
    ], InPlaceEditor.prototype, "url", void 0);
    __decorate$1([
        Property('Popup')
    ], InPlaceEditor.prototype, "mode", void 0);
    __decorate$1([
        Property('UrlAdaptor')
    ], InPlaceEditor.prototype, "adaptor", void 0);
    __decorate$1([
        Property('Text')
    ], InPlaceEditor.prototype, "type", void 0);
    __decorate$1([
        Property('Click')
    ], InPlaceEditor.prototype, "editableOn", void 0);
    __decorate$1([
        Property('Submit')
    ], InPlaceEditor.prototype, "actionOnBlur", void 0);
    __decorate$1([
        Property(false)
    ], InPlaceEditor.prototype, "enablePersistence", void 0);
    __decorate$1([
        Property(false)
    ], InPlaceEditor.prototype, "disabled", void 0);
    __decorate$1([
        Property(true)
    ], InPlaceEditor.prototype, "showButtons", void 0);
    __decorate$1([
        Property(false)
    ], InPlaceEditor.prototype, "enableEditMode", void 0);
    __decorate$1([
        Property(true)
    ], InPlaceEditor.prototype, "submitOnEnter", void 0);
    __decorate$1([
        Complex({}, PopupSettings)
    ], InPlaceEditor.prototype, "popupSettings", void 0);
    __decorate$1([
        Property(null)
    ], InPlaceEditor.prototype, "model", void 0);
    __decorate$1([
        Property({ iconCss: 'e-icons e-save-icon' })
    ], InPlaceEditor.prototype, "saveButton", void 0);
    __decorate$1([
        Property({ iconCss: 'e-icons e-cancel-icon' })
    ], InPlaceEditor.prototype, "cancelButton", void 0);
    __decorate$1([
        Property(null)
    ], InPlaceEditor.prototype, "validationRules", void 0);
    __decorate$1([
        Event()
    ], InPlaceEditor.prototype, "created", void 0);
    __decorate$1([
        Event()
    ], InPlaceEditor.prototype, "beforeSanitizeHtml", void 0);
    __decorate$1([
        Event()
    ], InPlaceEditor.prototype, "actionBegin", void 0);
    __decorate$1([
        Event()
    ], InPlaceEditor.prototype, "actionSuccess", void 0);
    __decorate$1([
        Event()
    ], InPlaceEditor.prototype, "actionFailure", void 0);
    __decorate$1([
        Event()
    ], InPlaceEditor.prototype, "validating", void 0);
    __decorate$1([
        Event()
    ], InPlaceEditor.prototype, "beginEdit", void 0);
    __decorate$1([
        Event()
    ], InPlaceEditor.prototype, "destroyed", void 0);
    InPlaceEditor = __decorate$1([
        NotifyPropertyChanges
    ], InPlaceEditor);
    return InPlaceEditor;
}(Component));

/**
 * Base modules
 */

/**
 * The `Base` module.
 */
var Base = /** @__PURE__ @class */ (function () {
    function Base(parent, module) {
        this.parent = parent;
        this.module = module;
        this.addEventListener();
    }
    Base.prototype.render = function (e) {
        this.module.render(e);
    };
    Base.prototype.showPopup = function () {
        this.module.showPopup();
    };
    Base.prototype.focus = function () {
        this.module.focus();
    };
    Base.prototype.update = function (e) {
        this.module.updateValue(e);
    };
    Base.prototype.getValue = function () {
        this.module.getRenderValue();
    };
    Base.prototype.destroyComponent = function () {
        if (isNullOrUndefined(this.module.compObj)) {
            return;
        }
        this.module.compObj.destroy();
        this.module.compObj = undefined;
    };
    Base.prototype.destroy = function () {
        this.destroyComponent();
        this.removeEventListener();
    };
    Base.prototype.addEventListener = function () {
        this.parent.on(render, this.render, this);
        this.parent.on(setFocus, this.focus, this);
        this.parent.on(showPopup, this.showPopup, this);
        this.parent.on(update, this.update, this);
        this.parent.on(accessValue, this.getValue, this);
        this.parent.on(destroyModules, this.destroyComponent, this);
        this.parent.on(destroy, this.destroy, this);
    };
    Base.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(render, this.render);
        this.parent.off(setFocus, this.focus);
        this.parent.off(showPopup, this.showPopup);
        this.parent.off(update, this.update);
        this.parent.off(accessValue, this.getValue);
        this.parent.off(destroyModules, this.destroyComponent);
        this.parent.off(destroy, this.destroy);
    };
    return Base;
}());

/**
 * The `AutoComplete` module is used configure the properties of Auto complete type editor.
 */
var AutoComplete$1 = /** @__PURE__ @class */ (function () {
    function AutoComplete$$1(parent) {
        this.compObj = undefined;
        this.parent = parent;
        this.parent.atcModule = this;
        this.base = new Base(this.parent, this);
    }
    AutoComplete$$1.prototype.render = function (e) {
        this.compObj = new AutoComplete(this.parent.model);
        this.compObj.appendTo(e.target);
    };
    /**
     * @hidden
     */
    AutoComplete$$1.prototype.showPopup = function () {
        this.compObj.focusIn();
        this.compObj.showPopup();
    };
    AutoComplete$$1.prototype.focus = function () {
        this.compObj.element.focus();
    };
    AutoComplete$$1.prototype.updateValue = function (e) {
        if (this.compObj && e.type === 'AutoComplete') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    };
    /**
     * Destroys the module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    AutoComplete$$1.prototype.destroy = function () {
        this.base.destroy();
    };
    /**
     * For internal use only - Get the module name.
     */
    AutoComplete$$1.prototype.getModuleName = function () {
        return 'auto-complete';
    };
    return AutoComplete$$1;
}());

/**
 * The `ColorPicker` module is used configure the properties of Color picker type editor.
 */
var ColorPicker$1 = /** @__PURE__ @class */ (function () {
    function ColorPicker$$1(parent) {
        this.compObj = undefined;
        this.parent = parent;
        this.parent.colorModule = this;
        this.base = new Base(this.parent, this);
    }
    ColorPicker$$1.prototype.render = function (e) {
        this.compObj = new ColorPicker(this.parent.model);
        this.compObj.appendTo(e.target);
    };
    ColorPicker$$1.prototype.focus = function () {
        this.compObj.element.focus();
    };
    ColorPicker$$1.prototype.updateValue = function (e) {
        if (this.compObj && e.type === 'Color') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    };
    /**
     * Destroys the module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    ColorPicker$$1.prototype.destroy = function () {
        this.base.destroy();
    };
    /**
     * For internal use only - Get the module name.
     */
    ColorPicker$$1.prototype.getModuleName = function () {
        return 'color-picker';
    };
    return ColorPicker$$1;
}());

/**
 * The `ComboBox` module is used configure the properties of Combo box type editor.
 */
var ComboBox$1 = /** @__PURE__ @class */ (function () {
    function ComboBox$$1(parent) {
        this.compObj = undefined;
        this.parent = parent;
        this.parent.comboBoxModule = this;
        this.base = new Base(this.parent, this);
    }
    ComboBox$$1.prototype.render = function (e) {
        this.compObj = new ComboBox(this.parent.model);
        this.compObj.appendTo(e.target);
    };
    ComboBox$$1.prototype.focus = function () {
        this.compObj.element.focus();
    };
    /**
     * @hidden
     */
    ComboBox$$1.prototype.showPopup = function () {
        this.compObj.focusIn();
        this.compObj.showPopup();
    };
    ComboBox$$1.prototype.updateValue = function (e) {
        if (this.compObj && e.type === 'ComboBox') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    };
    /**
     * Destroys the module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    ComboBox$$1.prototype.destroy = function () {
        this.base.destroy();
    };
    /**
     * For internal use only - Get the module name.
     */
    ComboBox$$1.prototype.getModuleName = function () {
        return 'combo-box';
    };
    return ComboBox$$1;
}());

/**
 * The `DateRangePicker` module is used configure the properties of Date range picker type editor.
 */
var DateRangePicker$1 = /** @__PURE__ @class */ (function () {
    function DateRangePicker$$1(parent) {
        this.compObj = undefined;
        this.parent = parent;
        this.parent.dateRangeModule = this;
        this.base = new Base(this.parent, this);
    }
    DateRangePicker$$1.prototype.render = function (e) {
        this.compObj = new DateRangePicker(this.parent.model);
        this.compObj.appendTo(e.target);
    };
    DateRangePicker$$1.prototype.focus = function () {
        this.compObj.element.focus();
    };
    DateRangePicker$$1.prototype.updateValue = function (e) {
        if (this.compObj && e.type === 'DateRange') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    };
    /**
     * Destroys the module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    DateRangePicker$$1.prototype.destroy = function () {
        this.base.destroy();
    };
    /**
     * For internal use only - Get the module name.
     */
    DateRangePicker$$1.prototype.getModuleName = function () {
        return 'date-range-picker';
    };
    return DateRangePicker$$1;
}());

var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * The `MultiSelect` module is used configure the properties of Multi select type editor.
 */
var MultiSelect$1 = /** @__PURE__ @class */ (function () {
    function MultiSelect$$1(parent) {
        this.isPopOpen = false;
        this.compObj = undefined;
        this.parent = parent;
        this.parent.multiSelectModule = this;
        this.base = new Base(this.parent, this);
    }
    MultiSelect$$1.prototype.render = function (e) {
        var compModel = __assign({}, this.parent.model);
        this.openEvent = compModel.open;
        this.closeEvent = compModel.close;
        compModel.open = this.openHandler.bind(this);
        compModel.close = this.closeHandler.bind(this);
        this.compObj = new MultiSelect(compModel);
        this.compObj.appendTo(e.target);
    };
    MultiSelect$$1.prototype.openHandler = function (e) {
        this.isPopOpen = true;
        if (this.openEvent) {
            this.compObj.setProperties({ open: this.openEvent }, true);
            this.compObj.trigger('open', e);
        }
    };
    MultiSelect$$1.prototype.closeHandler = function (e) {
        this.isPopOpen = false;
        if (this.closeEvent) {
            this.compObj.setProperties({ close: this.closeEvent }, true);
            this.compObj.trigger('close', e);
        }
    };
    MultiSelect$$1.prototype.focus = function () {
        if (!this.isPopOpen) {
            var evt = document.createEvent('MouseEvent');
            evt.initEvent('mousedown', true, true);
            closest(this.compObj.element, '.e-multi-select-wrapper').dispatchEvent(evt);
        }
    };
    MultiSelect$$1.prototype.updateValue = function (e) {
        if (this.compObj && e.type === 'MultiSelect') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    };
    MultiSelect$$1.prototype.getRenderValue = function () {
        this.parent.printValue = this.compObj.text;
    };
    /**
     * Destroys the module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    MultiSelect$$1.prototype.destroy = function () {
        this.base.destroy();
    };
    /**
     * For internal use only - Get the module name.
     */
    MultiSelect$$1.prototype.getModuleName = function () {
        return 'multi-select';
    };
    return MultiSelect$$1;
}());

/**
 * The `RTE` module is used configure the properties of RTE type editor.
 */
var Rte = /** @__PURE__ @class */ (function () {
    function Rte(parent) {
        this.compObj = undefined;
        RichTextEditor.Inject(HtmlEditor, MarkdownEditor, Toolbar, Link, Image, QuickToolbar, Table);
        this.parent = parent;
        this.parent.rteModule = this;
        this.base = new Base(this.parent, this);
    }
    Rte.prototype.render = function (e) {
        this.compObj = new RichTextEditor(this.parent.model);
        this.compObj.appendTo(e.target);
    };
    Rte.prototype.focus = function () {
        this.compObj.focusIn();
    };
    Rte.prototype.updateValue = function (e) {
        if (this.compObj && e.type === 'RTE') {
            this.parent.setProperties({ value: this.getRteValue() }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    };
    Rte.prototype.getRteValue = function () {
        var rteVal;
        if (this.compObj.editorMode === 'Markdown') {
            rteVal = this.compObj.contentModule.getEditPanel().value;
            return (rteVal === '') ? '' : rteVal;
        }
        else {
            rteVal = this.compObj.contentModule.getEditPanel().innerHTML;
            return (rteVal === '<p><br></p>' || rteVal === '&lt;p&gt;&lt;br&gt;&lt;/p&gt;' || rteVal === '') ? '' : rteVal;
        }
    };
    Rte.prototype.refresh = function () {
        this.compObj.refresh();
    };
    /**
     * Destroys the rte module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    Rte.prototype.destroy = function () {
        this.base.destroy();
    };
    /**
     * For internal use only - Get the module name.
     */
    Rte.prototype.getModuleName = function () {
        return 'rte';
    };
    return Rte;
}());

/**
 * The `Slider` module is used configure the properties of Slider type editor.
 */
var Slider$1 = /** @__PURE__ @class */ (function () {
    function Slider$$1(parent) {
        this.compObj = undefined;
        this.parent = parent;
        this.parent.sliderModule = this;
        this.base = new Base(this.parent, this);
    }
    Slider$$1.prototype.render = function (e) {
        this.compObj = new Slider(this.parent.model);
        this.compObj.appendTo(e.target);
    };
    Slider$$1.prototype.focus = function () {
        this.compObj.element.focus();
    };
    Slider$$1.prototype.updateValue = function (e) {
        if (this.compObj && e.type === 'Slider') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    };
    Slider$$1.prototype.refresh = function () {
        this.compObj.refresh();
    };
    /**
     * Destroys the slider module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    Slider$$1.prototype.destroy = function () {
        this.base.destroy();
    };
    /**
     * For internal use only - Get the module name.
     */
    Slider$$1.prototype.getModuleName = function () {
        return 'slider';
    };
    return Slider$$1;
}());

/**
 * The `TimePicker` module is used configure the properties of Time picker type editor.
 */
var TimePicker$1 = /** @__PURE__ @class */ (function () {
    function TimePicker$$1(parent) {
        this.compObj = undefined;
        this.parent = parent;
        this.parent.timeModule = this;
        this.base = new Base(this.parent, this);
    }
    TimePicker$$1.prototype.render = function (e) {
        this.compObj = new TimePicker(this.parent.model);
        this.compObj.appendTo(e.target);
    };
    TimePicker$$1.prototype.focus = function () {
        this.compObj.focusIn();
    };
    TimePicker$$1.prototype.updateValue = function (e) {
        if (this.compObj && e.type === 'Time') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    };
    /**
     * Destroys the module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    TimePicker$$1.prototype.destroy = function () {
        this.base.destroy();
    };
    /**
     * For internal use only - Get the module name.
     */
    TimePicker$$1.prototype.getModuleName = function () {
        return 'time-picker';
    };
    return TimePicker$$1;
}());

/**
 *
 */

/**
 *
 */

/**
 *
 */

export { parseValue, getCompValue, render, update, destroy, setFocus, accessValue, destroyModules, showPopup, PopupSettings, modulesList, localeConstant, ROOT, ROOT_TIP, VALUE_WRAPPER, VALUE, OVERLAY_ICON, TIP_TITLE, TITLE, INLINE, POPUP, WRAPPER, LOADING, FORM, CTRL_GROUP, INPUT, BUTTONS, EDITABLE_ERROR, ELEMENTS, OPEN, BTN_SAVE, BTN_CANCEL, RTE_SPIN_WRAP, CTRL_OVERLAY, DISABLE, ICONS, PRIMARY, SHOW, HIDE, RTL, ERROR, LOAD, InPlaceEditor, Base, AutoComplete$1 as AutoComplete, ColorPicker$1 as ColorPicker, ComboBox$1 as ComboBox, DateRangePicker$1 as DateRangePicker, MultiSelect$1 as MultiSelect, Rte, Slider$1 as Slider, TimePicker$1 as TimePicker };
//# sourceMappingURL=ej2-inplace-editor.es5.js.map
