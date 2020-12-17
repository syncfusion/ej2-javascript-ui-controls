import { Browser, ChildProperty, Complex, Component, Event, EventHandler, Internationalization, L10n, NotifyPropertyChanges, Property, SanitizeHtmlHelper, Touch, addClass, closest, compile, detach, extend, getValue, isBlazor, isNullOrUndefined, removeClass, resetBlazorTemplate, select, setStyleAttribute, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { DataManager, ODataV4Adaptor, Predicate, Query, UrlAdaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import { Button } from '@syncfusion/ej2-buttons';
import { DatePicker, DateRangePicker, DateTimePicker, TimePicker } from '@syncfusion/ej2-calendars';
import { Tooltip, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { ColorPicker, FormValidator, MaskedTextBox, NumericTextBox, Slider, TextBox } from '@syncfusion/ej2-inputs';
import { AutoComplete, ComboBox, DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { FileManager, HtmlEditor, Image, Link, MarkdownEditor, QuickToolbar, RichTextEditor, Table, Toolbar } from '@syncfusion/ej2-richtexteditor';

/**
 * Exports util methods used by In-place editor.
 */
let intl = new Internationalization();
/**
 * @hidden
 */
function parseValue(type, val, model) {
    if (isNullOrUndefined(val) || val === '') {
        return '';
    }
    let result;
    let tempFormat;
    switch (type) {
        case 'Color':
            let hex = val;
            result = (hex.length > 7) ? hex.slice(0, -2) : hex;
            break;
        case 'Date':
            tempFormat = model.format;
            result = intl.formatDate(val, { format: tempFormat, type: type, skeleton: isBlazor() ? 'd' : 'yMd' });
            break;
        case 'DateRange':
            tempFormat = model.format;
            let date = val;
            result = intl.formatDate(date[0], { format: tempFormat, type: type, skeleton: isBlazor() ? 'd' : 'yMd' }) + ' - '
                + intl.formatDate(date[1], { format: tempFormat, type: type, skeleton: isBlazor() ? 'd' : 'yMd' });
            break;
        case 'DateTime':
            tempFormat = model.format;
            if (isNullOrUndefined(tempFormat) || tempFormat === '') {
                result = intl.formatDate(val, { format: tempFormat, type: type, skeleton: isBlazor() ? 'd' : 'yMd' }) + ' '
                    + intl.formatDate(val, { format: tempFormat, type: type, skeleton: isBlazor() ? 't' : 'hm' });
            }
            else {
                result = intl.formatDate(val, { format: tempFormat, type: type, skeleton: isBlazor() ? 'd' : 'yMd' });
            }
            break;
        case 'Time':
            tempFormat = model.format;
            result = intl.formatDate(val, { format: tempFormat, type: type, skeleton: isBlazor() ? 't' : 'hm' });
            break;
        case 'Numeric':
            tempFormat = isNullOrUndefined(model.format) ? 'n2' :
                model.format;
            let tempVal = isNullOrUndefined(val) ? null : (typeof (val) === 'number' ? val : intl.parseNumber(val));
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
            let temp = val.split('-');
            val = [new Date(temp[0]), new Date(temp[1])];
        }
    }
    return val;
}

/**
 * In-place Editor events defined here.
 */
/** @hidden */
const render = 'render';
/** @hidden */
const update = 'update';
/** @hidden */
const destroy = 'destroy';
/** @hidden */
const setFocus = 'set-focus';
/** @hidden */
const accessValue = 'access-value';
/** @hidden */
const destroyModules = 'destroy-modules';
/** @hidden */
const showPopup = 'show-popup';

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the popup settings of the In-place editor.
 */
class PopupSettings extends ChildProperty {
}
__decorate([
    Property('')
], PopupSettings.prototype, "title", void 0);
__decorate([
    Property(null)
], PopupSettings.prototype, "model", void 0);
/**
 * @hidden
 */
let modulesList = {
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
let localeConstant = {
    'Click': { 'editAreaClick': 'Click to edit' },
    'DblClick': { 'editAreaDoubleClick': 'Double click to edit' },
    'EditIconClick': { 'editAreaClick': 'Click to edit' },
};

/**
 * In-place Editor classes defined here.
 */
/** @hidden */
const ROOT = 'e-inplaceeditor';
/** @hidden */
const ROOT_TIP = 'e-inplaceeditor-tip';
/** @hidden */
const VALUE_WRAPPER = 'e-editable-value-wrapper';
/** @hidden */
const VALUE = 'e-editable-value';
/** @hidden */
const OVERLAY_ICON = 'e-editable-overlay-icon';
/** @hidden */
const TIP_TITLE = 'e-editable-tip-title';
/** @hidden */
const TITLE = 'e-editable-title';
/** @hidden */
const INLINE = 'e-editable-inline';
/** @hidden */
const POPUP = 'e-editable-popup';
/** @hidden */
const WRAPPER = 'e-editable-wrapper';
/** @hidden */
const LOADING = 'e-editable-loading';
/** @hidden */
const FORM = 'e-editable-form';
/** @hidden */
const CTRL_GROUP = 'e-component-group';
/** @hidden */
const INPUT = 'e-editable-component';
/** @hidden */
const BUTTONS = 'e-editable-action-buttons';
/** @hidden */
const EDITABLE_ERROR = 'e-editable-error';
/** @hidden */
const ELEMENTS = 'e-editable-elements';
/** @hidden */
const OPEN = 'e-editable-open';
/** @hidden */
const BTN_SAVE = 'e-btn-save';
/** @hidden */
const BTN_CANCEL = 'e-btn-cancel';
/** @hidden */
const RTE_SPIN_WRAP = 'e-rte-spin-wrap';
/** @hidden */
const CTRL_OVERLAY = 'e-control-overlay';
/** @hidden */
const DISABLE = 'e-disable';
/** @hidden */
const ICONS = 'e-icons';
/** @hidden */
const PRIMARY = 'e-primary';
/** @hidden */
const SHOW = 'e-show';
/** @hidden */
const HIDE = 'e-hide';
/** @hidden */
const RTL = 'e-rtl';
/** @hidden */
const ERROR = 'e-error';
/** @hidden */
const LOAD = 'e-loading';

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
let InPlaceEditor = class InPlaceEditor extends Component {
    /**
     * Initializes a new instance of the In-place editor class.
     * @param options  - Specifies In-place editor model properties as options.
     * @param element  - Specifies the element for which In-place editor applies.
     */
    constructor(options, element) {
        super(options, element);
        this.initRender = true;
        this.isTemplate = false;
        this.isExtModule = false;
        this.submitBtn = undefined;
        this.cancelBtn = undefined;
        this.isClearTarget = false;
        this.btnElements = undefined;
        this.dataManager = undefined;
        this.divComponents = ['RTE', 'Slider'];
        this.clearComponents = ['AutoComplete', 'Mask', 'Text'];
        this.dateType = ['Date', 'DateTime', 'Time'];
        this.inputDataEle = ['Date', 'DateTime', 'DateRange', 'Time', 'Numeric'];
        this.dropDownEle = ['AutoComplete', 'ComboBox', 'DropDownList', 'MultiSelect'];
        this.moduleList = ['AutoComplete', 'Color', 'ComboBox', 'DateRange', 'MultiSelect', 'RTE', 'Slider', 'Time'];
        /**
         * @hidden
         */
        this.needsID = true;
    }
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        if (isNullOrUndefined(this.model)) {
            this.setProperties({ model: {} }, true);
        }
        this.titleEle = this.createElement('div', { className: TITLE });
        if (!isNullOrUndefined(this.popupSettings.model) && this.popupSettings.model.afterOpen) {
            this.afterOpenEvent = this.popupSettings.model.afterOpen;
        }
    }
    /**
     * To Initialize the In-place editor rendering
     * @private
     */
    render() {
        if (isNullOrUndefined(this.element.getAttribute('tabindex'))) {
            this.element.setAttribute('tabindex', '0');
        }
        this.checkIsTemplate();
        this.disable(this.disabled);
        this.updateAdaptor();
        this.appendValueElement();
        this.updateValue();
        this.textOption === 'Never' ?
            this.renderValue(this.checkValue(parseValue(this.type, this.value, this.model)))
            : this.renderInitialValue();
        this.wireEvents();
        this.setRtl(this.enableRtl);
        this.enableEditor(this.enableEditMode);
        this.setClass('add', this.cssClass);
        this.renderComplete();
    }
    setClass(action, val) {
        if (!this.isEmpty(val)) {
            let allClassName = val.split(' ');
            for (let i = 0; i < allClassName.length; i++) {
                if (allClassName[i].trim() !== '') {
                    action === 'add' ? addClass([this.element], [allClassName[i]]) : removeClass([this.element], [allClassName[i]]);
                }
            }
        }
    }
    appendValueElement() {
        this.valueWrap = this.createElement('div', { id: this.element.id + '_wrap', className: VALUE_WRAPPER });
        if (!isBlazor()) {
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
    }
    renderInitialValue() {
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
    }
    getInitFieldMapValue() {
        let model = this.model;
        let mText = model.fields.text;
        let mVal = model.fields.value;
        let query = isNullOrUndefined(model.query) ? new Query() : model.query;
        if (model.dataSource instanceof DataManager) {
            model.dataSource.executeQuery(this.getInitQuery(model, query)).then((e) => {
                this.updateInitValue(mText, mVal, e.result);
            });
        }
        else {
            this.updateInitValue(mText, mVal, new DataManager(model.dataSource).executeLocal(this.getInitQuery(model, query)));
        }
    }
    getInitQuery(model, query) {
        let predicate;
        let mVal = model.fields.value;
        let value = this.value;
        if (this.type !== 'MultiSelect' || typeof (this.value) !== 'object') {
            predicate = new Predicate(mVal, 'equal', this.value);
        }
        else {
            let i = 0;
            for (let val of value) {
                predicate = ((i === 0) ? predicate = new Predicate(mVal, 'equal', val) : predicate.or(mVal, 'equal', val));
                i++;
            }
        }
        return query.where(predicate);
    }
    updateInitValue(mText, mVal, result) {
        if (result.length <= 0) {
            return;
        }
        if (result.length === 1) {
            this.valueEle.innerHTML = this.checkValue(getValue((isNullOrUndefined(mText) ? mVal : mText), result[0]));
        }
        else {
            let val = [];
            for (let obj of result) {
                val.push(getValue((isNullOrUndefined(mText) ? mVal : mText), obj));
            }
            this.valueEle.innerHTML = this.checkValue(val.toString());
        }
        hideSpinner(this.valueWrap);
        this.valueWrap.classList.remove(LOAD);
    }
    renderValue(val) {
        this.enableHtmlSanitizer && this.type !== 'RTE' && this.type !== 'MultiSelect' ? this.valueEle.innerText = val :
            this.valueEle.innerHTML = val;
        if (this.type === 'Color') {
            setStyleAttribute(this.valueEle, { 'color': val });
        }
        if (this.mode === 'Inline') {
            removeClass([this.valueWrap], [HIDE]);
        }
    }
    renderEditor() {
        this.prevValue = this.value;
        this.beginEditArgs = { mode: this.mode, cancelFocus: false, cancel: false };
        this.trigger('beginEdit', this.beginEditArgs);
        if (this.beginEditArgs.cancel) {
            return;
        }
        let tipOptions = undefined;
        let target = select('.' + VALUE_WRAPPER, this.element);
        if (this.editableOn !== 'EditIconClick') {
            target.parentElement.removeAttribute('title');
        }
        if (this.valueWrap.classList.contains(OPEN)) {
            return;
        }
        if (this.mode === 'Inline') {
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
            let content = this.createElement('div', { className: POPUP });
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
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    renderAndOpen() {
        this.renderControl(this.inlineWrapper);
        this.afterOpenHandler(null);
    }
    checkRemoteData(model) {
        if (model.dataSource instanceof DataManager) {
            model.dataBound = () => {
                this.afterOpenHandler(null);
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
    }
    showDropDownPopup() {
        if (this.type === 'DropDownList') {
            if (!this.model.allowFiltering) {
                this.componentObj.focusIn();
            }
            this.componentObj.showPopup();
        }
        else {
            if (this.isExtModule) {
                this.notify(((this.type === 'MultiSelect') ? setFocus : showPopup), {});
            }
        }
    }
    setAttribute(ele, attr) {
        let value = this.name && this.name.length !== 0 ? this.name : this.element.id;
        attr.forEach((val) => {
            ele.setAttribute(val, ((val === 'id') ? (value + '_editor') : value));
        });
    }
    renderControl(target) {
        let ele;
        this.containerEle = this.createElement('div', { className: WRAPPER });
        this.loader = this.createElement('div', { className: LOADING });
        this.formEle = this.createElement('form', { className: FORM });
        let ctrlGroupEle = this.createElement('div', { className: CTRL_GROUP });
        let inputWrap = this.createElement('div', { className: INPUT });
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
    }
    appendButtons(trg) {
        if (this.showButtons && trg) {
            this.btnElements = this.renderButtons();
            trg.appendChild(this.btnElements);
            this.wireBtnEvents();
        }
    }
    renderButtons() {
        let btnWrap = this.createElement('div', { className: BUTTONS });
        let primary = (!isNullOrUndefined(this.saveButton.content) && this.saveButton.content.length !== 0) ? (' ' + PRIMARY) : '';
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
    }
    createButtons(args) {
        let btnObj = undefined;
        if (Object.keys(args.model).length > 0) {
            let btnEle = this.createElement('button', {
                className: args.className,
                attrs: { 'type': args.type, 'title': this.getLocale(args.title, args.constant) }
            });
            args.container.appendChild(btnEle);
            btnObj = new Button(args.model, btnEle);
        }
        return btnObj;
    }
    renderComponent(ele) {
        this.isExtModule = (Array.prototype.indexOf.call(this.moduleList, this.type) > -1) ? true : false;
        let classProp;
        if (!isNullOrUndefined(this.model.cssClass)) {
            classProp = this.model.cssClass.indexOf(ELEMENTS) < 0 ?
                this.model.cssClass === '' ? ELEMENTS : this.model.cssClass + ' ' + ELEMENTS :
                this.model.cssClass;
        }
        else {
            classProp = ELEMENTS;
        }
        extend(this.model, this.model, {
            cssClass: classProp, enableRtl: this.enableRtl, locale: this.locale, change: this.changeHandler.bind(this)
        });
        if (!isNullOrUndefined(this.value)) {
            this.updateModelValue();
        }
        if (this.isExtModule) {
            this.notify(render, { module: modulesList[this.type], target: ele, type: this.type });
        }
        else {
            if (isNullOrUndefined(this.model.showClearButton) && !isBlazor()) {
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
    }
    updateAdaptor() {
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
    }
    loadSpinner(callType) {
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
    }
    removeSpinner(callType) {
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
    }
    getEditElement() {
        return select('.' + ELEMENTS, this.formEle);
    }
    getLocale(prop, val) {
        return new L10n('inplace-editor', prop, this.locale).getConstant(val);
    }
    checkValue(val) {
        return (!this.isEmpty(val)) ? val : this.emptyText;
    }
    extendModelValue(val) {
        let model = this.model;
        extend(model, { value: val });
        this.setProperties({ model: model }, true);
    }
    updateValue() {
        let value = this.value;
        if (this.enableHtmlSanitizer && typeof (this.value) === 'string') {
            value = this.sanitizeHelper(this.value);
        }
        if (!isNullOrUndefined(this.value)) {
            this.setProperties({ value: getCompValue(this.type, value) }, true);
            this.extendModelValue(getCompValue(this.type, value));
        }
    }
    updateModelValue() {
        if (this.type === 'MultiSelect' && !this.isEmpty(this.value)) {
            this.model.value = this.value.slice();
        }
        else {
            this.model.value = this.value;
        }
    }
    setValue() {
        if (this.isExtModule) {
            this.notify(update, { type: this.type });
        }
        else if (this.componentObj) {
            if (this.type === 'Numeric' && this.componentObj.value === null) {
                this.componentObj.setProperties({ value: null }, true);
            }
            this.setProperties({ value: this.componentObj.value }, true);
            this.extendModelValue(this.componentObj.value);
        }
    }
    getDropDownsValue(display) {
        let value;
        if (Array.prototype.indexOf.call(this.dropDownEle, this.type) > -1 && this.type !== 'MultiSelect') {
            value = display ? select('.e-' + this.type.toLocaleLowerCase(), this.containerEle).value :
                this.value.toString();
        }
        else if (this.type === 'MultiSelect') {
            this.notify(accessValue, { type: this.type });
            value = display ? this.printValue : this.value.join();
        }
        return value;
    }
    getSendValue() {
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
    }
    getRenderValue() {
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
    }
    setRtl(value) {
        value ? addClass([this.element], [RTL]) : removeClass([this.element], [RTL]);
    }
    setFocus() {
        if (this.isTemplate) {
            return;
        }
        this.isExtModule ? this.notify(setFocus, {}) : this.componentObj.element.focus();
    }
    removeEditor(isBlazorDestroy) {
        if (isBlazor() && !this.isStringTemplate) {
            resetBlazorTemplate(this.element.id + 'template', 'Template');
        }
        let tipEle;
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
        if (!isBlazorDestroy) {
            this.setProperties({ enableEditMode: false }, true);
        }
        if (this.editableOn !== 'EditIconClick') {
            let titleConstant = (this.editableOn === 'DblClick') ? 'editAreaDoubleClick' : 'editAreaClick';
            if (!isNullOrUndefined(this.valueWrap.parentElement)) {
                this.valueWrap.parentElement.setAttribute('title', this.getLocale(localeConstant[this.editableOn], titleConstant));
            }
        }
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.clearTemplate();
        }
    }
    destroyComponents() {
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
    }
    destroyButtons() {
        if (!isNullOrUndefined(this.submitBtn)) {
            EventHandler.remove(this.submitBtn.element, 'mousedown', this.submitHandler);
            EventHandler.remove(this.submitBtn.element, 'click', this.submitPrevent);
            EventHandler.remove(this.submitBtn.element, 'keydown', this.btnKeyDownHandler);
            this.submitBtn.destroy();
            this.submitBtn = undefined;
        }
        if (!isNullOrUndefined(this.cancelBtn)) {
            EventHandler.remove(this.cancelBtn.element, 'mousedown', this.cancelBtnClick);
            EventHandler.remove(this.cancelBtn.element, 'keydown', this.btnKeyDownHandler);
            this.cancelBtn.destroy();
            this.cancelBtn = undefined;
        }
        this.btnElements = undefined;
    }
    getQuery(params) {
        let query = new Query();
        Object.keys(params).forEach((key) => {
            query.addParams(key, params[key]);
        });
        return query;
    }
    sendValue() {
        let eventArgs = { data: { name: this.name, primaryKey: this.primaryKey, value: this.getSendValue() } };
        this.trigger('actionBegin', eventArgs, (actionBeginArgs) => {
            if (actionBeginArgs.cancel) {
                this.removeSpinner('submit');
                if (this.mode === 'Popup') {
                    this.updateArrow();
                }
            }
            else {
                if (!this.isEmpty(this.url) && !this.isEmpty(this.primaryKey)
                    && (this.initRender || (!this.initRender && this.prevValue !== this.value))) {
                    this.dataManager = new DataManager({ url: this.url, adaptor: this.dataAdaptor });
                    if (this.adaptor === 'UrlAdaptor') {
                        this.dataManager.executeQuery(this.getQuery(actionBeginArgs.data), this.successHandler.bind(this), this.failureHandler.bind(this));
                    }
                    else {
                        let crud = this.dataManager.insert(actionBeginArgs.data);
                        crud.then((e) => this.successHandler(e)).catch((e) => this.failureHandler(e));
                    }
                }
                else {
                    let eventArg = { data: {}, value: actionBeginArgs.data.value };
                    this.triggerSuccess(eventArg);
                }
                this.dataManager = undefined;
            }
        });
    }
    isEmpty(value) {
        return (!isNullOrUndefined(value) && value.length !== 0) ? false : true;
    }
    checkIsTemplate() {
        this.isTemplate = (!isNullOrUndefined(this.template) && this.template !== '') ? true : false;
    }
    templateCompile(trgEle, tempStr) {
        let tempEle;
        if (typeof tempStr === 'string') {
            tempStr = tempStr.trim();
        }
        let compiler = compile(tempStr);
        if (!isNullOrUndefined(compiler)) {
            let isString = (isBlazor() &&
                !this.isStringTemplate && (tempStr).indexOf('<div>Blazor') === 0) ?
                this.isStringTemplate : true;
            tempEle = compiler({}, this, 'template', this.element.id + 'template', isString);
        }
        if (!isNullOrUndefined(compiler) && tempEle.length > 0) {
            [].slice.call(tempEle).forEach((el) => {
                trgEle.appendChild(el);
            });
            if (isBlazor() && !this.isStringTemplate && (tempStr).indexOf('<div>Blazor') === 0) {
                updateBlazorTemplate(this.element.id + 'template', 'Template', this);
            }
        }
    }
    /**
     * @hidden
     */
    sanitizeHelper(value) {
        if (this.enableHtmlSanitizer) {
            let item = SanitizeHtmlHelper.beforeSanitize();
            let beforeEvent = {
                cancel: false,
                helper: null
            };
            extend(item, item, beforeEvent);
            this.trigger('beforeSanitizeHtml', item, (args) => {
                if (item.cancel && !isNullOrUndefined(item.helper)) {
                    value = item.helper(value);
                }
                else if (!item.cancel) {
                    value = SanitizeHtmlHelper.serializeValue(item, value);
                }
            });
        }
        return value;
    }
    appendTemplate(trgEle, tempStr) {
        tempStr = typeof (tempStr) === 'string' ? this.sanitizeHelper(tempStr) : tempStr;
        this.setProperties({ template: tempStr }, true);
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
    }
    disable(value) {
        value ? addClass([this.element], [DISABLE]) : removeClass([this.element], [DISABLE]);
    }
    enableEditor(val) {
        (val) ? this.renderEditor() : this.cancelHandler();
    }
    checkValidation(fromSubmit, isValidate) {
        let args;
        if (this.validationRules) {
            let rules = Object.keys(this.validationRules);
            let validationLength = Object.keys(this.validationRules[rules[0]]).length;
            validationLength = 'validateHidden' in this.validationRules[rules[0]] ? validationLength - 1 : validationLength;
            let count = 0;
            this.formValidate = new FormValidator(this.formEle, {
                rules: this.validationRules,
                validationComplete: (e) => {
                    count = count + 1;
                    args = {
                        errorMessage: e.message,
                        data: { name: this.name, primaryKey: this.primaryKey, value: this.checkValue(this.getSendValue()) }
                    };
                    this.trigger('validating', args, (validateArgs) => {
                        if (e.status === 'failure') {
                            e.errorElement.innerText = validateArgs.errorMessage;
                            this.toggleErrorClass(true);
                        }
                        else {
                            this.toggleErrorClass(false);
                        }
                        if (!isNullOrUndefined(fromSubmit) && fromSubmit && (validationLength === count || e.status === 'failure')) {
                            fromSubmit = false;
                            this.afterValidation(isValidate);
                            count = 0;
                        }
                    });
                },
                customPlacement: (inputElement, errorElement) => {
                    if (this.formEle) {
                        select('.' + EDITABLE_ERROR, this.formEle).appendChild(errorElement);
                    }
                }
            });
            count = 0;
            this.formValidate.validate();
        }
        else if (this.template !== '') {
            args = {
                errorMessage: '',
                data: { name: this.name, primaryKey: this.primaryKey, value: this.checkValue(this.getSendValue()) }
            };
            this.trigger('validating', args, (validateArgs) => {
                if (validateArgs.errorMessage) {
                    select('.' + EDITABLE_ERROR, this.formEle).innerHTML = validateArgs.errorMessage;
                    this.toggleErrorClass(true);
                }
                else {
                    this.toggleErrorClass(false);
                }
                this.afterValidation(isValidate);
            });
        }
        else {
            this.afterValidation(isValidate);
        }
    }
    afterValidation(isValidate) {
        if (!this.formEle.classList.contains(ERROR) && isValidate) {
            this.loadSpinner('validate');
            if (this.mode === 'Popup') {
                this.updateArrow();
            }
            this.sendValue();
        }
    }
    toggleErrorClass(value) {
        if (isNullOrUndefined(this.formEle)) {
            return;
        }
        let inputEle = select('.e-input-group', this.formEle);
        let errorClass = (element, val, action) => {
            [].slice.call(element).forEach((ele) => {
                if (ele) {
                    action === 'add' ? addClass([ele], [val]) : removeClass([ele], [val]);
                }
            });
        };
        errorClass([this.formEle, inputEle], ERROR, value ? 'add' : 'remove');
    }
    updateArrow() {
        let pos = this.tipObj.tipPointerPosition;
        this.tipObj.tipPointerPosition = (pos === 'Middle') ? 'Auto' : 'Middle';
        this.tipObj.tipPointerPosition = pos;
        this.tipObj.dataBind();
    }
    triggerSuccess(args) {
        let val = args.value;
        this.trigger('actionSuccess', args, (actionArgs) => {
            this.removeSpinner('submit');
            if (!actionArgs.cancel) {
                this.renderValue(this.checkValue((actionArgs.value !== val) ? actionArgs.value : this.getRenderValue()));
            }
            if (actionArgs.cancel && this.mode === 'Inline') {
                removeClass([this.valueWrap], [HIDE]);
            }
            this.removeEditor();
        });
    }
    wireEvents() {
        this.wireEditEvent(this.editableOn);
        EventHandler.add(this.editIcon, 'click', this.clickHandler, this);
        EventHandler.add(this.element, 'keydown', this.valueKeyDownHandler, this);
        EventHandler.add(document, 'scroll', this.scrollResizeHandler, this);
        window.addEventListener('resize', this.scrollResizeHandler.bind(this));
        if (Array.prototype.indexOf.call(this.clearComponents, this.type) > -1) {
            EventHandler.add(this.element, 'mousedown', this.mouseDownHandler, this);
        }
    }
    wireDocEvent() {
        EventHandler.add(document, 'mousedown', this.docClickHandler, this);
    }
    wireEditEvent(event) {
        if (event === 'EditIconClick') {
            return;
        }
        let titleConstant = (event === 'Click') ? 'editAreaClick' : 'editAreaDoubleClick';
        this.element.setAttribute('title', this.getLocale(localeConstant[event], titleConstant));
        if (Browser.isDevice && Browser.isIos && event === 'DblClick') {
            this.touchModule = new Touch(this.valueWrap, { tap: this.doubleTapHandler.bind(this) });
        }
        else {
            EventHandler.add(this.valueWrap, event.toLowerCase(), this.clickHandler, this);
        }
    }
    wireEditorKeyDownEvent(ele) {
        EventHandler.add(ele, 'keydown', this.enterKeyDownHandler, this);
    }
    wireBtnEvents() {
        if (!isNullOrUndefined(this.submitBtn)) {
            EventHandler.add(this.submitBtn.element, 'mousedown', this.submitHandler, this);
            EventHandler.add(this.submitBtn.element, 'click', this.submitPrevent, this);
            EventHandler.add(this.submitBtn.element, 'keydown', this.btnKeyDownHandler, this);
        }
        if (!isNullOrUndefined(this.cancelBtn)) {
            EventHandler.add(this.cancelBtn.element, 'mousedown', this.cancelBtnClick, this);
            EventHandler.add(this.cancelBtn.element, 'keydown', this.btnKeyDownHandler, this);
        }
    }
    cancelBtnClick(e) {
        this.cancelHandler();
        this.trigger('cancelClick', e);
    }
    unWireEvents() {
        this.unWireEditEvent(this.editableOn);
        EventHandler.remove(this.editIcon, 'click', this.clickHandler);
        EventHandler.remove(document, 'scroll', this.scrollResizeHandler);
        window.removeEventListener('resize', this.scrollResizeHandler.bind(this));
        EventHandler.remove(this.element, 'keydown', this.valueKeyDownHandler);
        if (Array.prototype.indexOf.call(this.clearComponents, this.type) > -1) {
            EventHandler.remove(this.element, 'mousedown', this.mouseDownHandler);
        }
    }
    unWireDocEvent() {
        EventHandler.remove(document, 'mousedown', this.docClickHandler);
    }
    unWireEditEvent(event) {
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
    }
    unWireEditorKeyDownEvent(ele) {
        EventHandler.remove(ele, 'keydown', this.enterKeyDownHandler);
    }
    submitPrevent(e) {
        e.preventDefault();
    }
    btnKeyDownHandler(e) {
        let trg = e.target;
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
            }
            else if (this.actionOnBlur === 'Cancel') {
                this.cancelHandler();
            }
        }
    }
    afterOpenHandler(e) {
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
        if (!this.beginEditArgs.cancelFocus) {
            if (this.mode === 'Inline' && (['AutoComplete', 'ComboBox', 'DropDownList', 'MultiSelect'].indexOf(this.type) > -1)
                && this.model.dataSource instanceof DataManager) {
                this.showDropDownPopup();
            }
            else {
                this.setFocus();
            }
        }
        if (this.afterOpenEvent) {
            this.tipObj.setProperties({ afterOpen: this.afterOpenEvent }, true);
            this.tipObj.trigger('afterOpen', e);
        }
    }
    popMouseDown(e) {
        let trgClass = e.target.classList;
        if (trgClass.contains('e-chips-close') && !trgClass.contains('e-close-hooker')) {
            this.updateArrow();
        }
    }
    doubleTapHandler(e) {
        if (e.tapCount > 1) {
            this.clickHandler(e.originalEvent);
        }
    }
    clickHandler(e) {
        if (this.editableOn !== 'EditIconClick') {
            e.stopPropagation();
        }
        this.renderEditor();
    }
    submitHandler(e) {
        e.preventDefault();
        this.save();
        this.trigger('submitClick', e);
    }
    cancelHandler() {
        this.removeEditor();
    }
    popClickHandler(e) {
        let tipTarget = select('.' + VALUE_WRAPPER, this.element);
        if (e.target.classList.contains('e-chips-close')) {
            this.tipObj.refresh(tipTarget);
        }
    }
    successHandler(e) {
        this.initRender = false;
        let eventArgs = { data: e, value: this.getSendValue() };
        this.triggerSuccess(eventArgs);
    }
    failureHandler(e) {
        let eventArgs = { data: e, value: this.getSendValue() };
        this.trigger('actionFailure', eventArgs, (args) => {
            this.removeSpinner('submit');
            if (this.mode === 'Popup') {
                this.updateArrow();
            }
        });
    }
    enterKeyDownHandler(e) {
        if (!closest(e.target, '.' + INPUT + ' .e-richtexteditor')) {
            if ((e.keyCode === 13 && e.which === 13) && closest(e.target, '.' + INPUT)) {
                this.save();
            }
            else if (e.keyCode === 27 && e.which === 27) {
                this.cancelHandler();
            }
        }
    }
    valueKeyDownHandler(e) {
        if (e.keyCode === 9 && e.shiftKey === true && e.target.tagName !== 'BUTTON') {
            if (this.actionOnBlur === 'Submit') {
                this.save();
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
    }
    mouseDownHandler(e) {
        if (e.target.classList.contains('e-clear-icon')) {
            this.isClearTarget = true;
        }
    }
    scrollResizeHandler() {
        if (this.mode === 'Popup' && this.tipObj && !(Browser.isDevice)) {
            this.removeEditor();
        }
    }
    docClickHandler(e) {
        let trg = e.target;
        if (this.isClearTarget) {
            this.isClearTarget = false;
            return;
        }
        let relateRoot = closest(trg, '.' + ROOT);
        let relateTipRoot = closest(trg, '.' + ROOT_TIP);
        let relateElements = closest(trg, '.' + ELEMENTS);
        let relateRTEElements = closest(trg, '.e-rte-elements');
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
    }
    changeHandler(e) {
        let eventArgs = {
            previousValue: this.compPrevValue === undefined ? this.value : this.compPrevValue,
            value: e.value
        };
        if (this.type === 'AutoComplete' || this.type === 'ComboBox' || this.type === 'DropDownList') {
            eventArgs.itemData = e.itemData;
            eventArgs.previousItemData = e.previousItemData;
        }
        this.compPrevValue = eventArgs.value;
        this.trigger('change', eventArgs);
    }
    /**
     * Validate current editor value.
     * @returns void
     */
    validate() {
        this.checkValidation(true, false);
    }
    /**
     * Submit the edited input value to the server.
     * @returns void
     */
    save() {
        if (!this.formEle) {
            return;
        }
        this.element.focus();
        this.editEle = select('.' + INPUT, this.formEle);
        let errEle = null;
        errEle = select('.' + ERROR, this.editEle);
        if (!this.isTemplate) {
            this.setValue();
        }
        this.checkValidation(true, true);
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    destroy() {
        this.removeEditor(isBlazor());
        if (this.isExtModule) {
            this.notify(destroy, {});
        }
        this.unWireEvents();
        let classList = [DISABLE, RTL];
        classList.forEach((val) => {
            removeClass([this.element], [val]);
        });
        while (this.element.firstElementChild) {
            this.element.removeChild(this.element.firstElementChild);
        }
        if (!(isBlazor() && this.isServerRendered)) {
            super.destroy();
        }
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.clearTemplate();
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    getPersistData() {
        return this.addOnPersist(['value']);
    }
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules() {
        let modules = [];
        modules.push({ member: modulesList[this.type], args: [this] });
        return modules;
    }
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'inplaceeditor';
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of property that changed.
     * @param  {InPlaceEditorModel} newProp
     * @param  {InPlaceEditorModel} oldProp
     * @returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        this.removeEditor();
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'showButtons':
                    (newProp.showButtons) ? this.appendButtons(this.formEle) : this.destroyButtons();
                    break;
                case 'value':
                    this.updateValue();
                    this.textOption === 'Never' ? this.renderValue(this.checkValue(parseValue(this.type, this.value, this.model)))
                        : this.renderInitialValue();
                    break;
                case 'emptyText':
                    this.textOption === 'Never' ? this.renderValue(this.checkValue(parseValue(this.type, this.value, this.model)))
                        : this.renderInitialValue();
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
    Property('Never')
], InPlaceEditor.prototype, "textOption", void 0);
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
], InPlaceEditor.prototype, "change", void 0);
__decorate$1([
    Event()
], InPlaceEditor.prototype, "submitClick", void 0);
__decorate$1([
    Event()
], InPlaceEditor.prototype, "cancelClick", void 0);
__decorate$1([
    Event()
], InPlaceEditor.prototype, "destroyed", void 0);
InPlaceEditor = __decorate$1([
    NotifyPropertyChanges
], InPlaceEditor);

/**
 * Base modules
 */

/**
 * The `Base` module.
 */
class Base {
    constructor(parent, module) {
        this.parent = parent;
        this.module = module;
        this.addEventListener();
    }
    render(e) {
        this.module.render(e);
    }
    showPopup() {
        this.module.showPopup();
    }
    focus() {
        this.module.focus();
    }
    update(e) {
        this.module.updateValue(e);
    }
    getValue() {
        this.module.getRenderValue();
    }
    destroyComponent() {
        if (isNullOrUndefined(this.module.compObj)) {
            return;
        }
        this.module.compObj.destroy();
        this.module.compObj = undefined;
    }
    destroy() {
        this.destroyComponent();
        this.removeEventListener();
    }
    addEventListener() {
        this.parent.on(render, this.render, this);
        this.parent.on(setFocus, this.focus, this);
        this.parent.on(showPopup, this.showPopup, this);
        this.parent.on(update, this.update, this);
        this.parent.on(accessValue, this.getValue, this);
        this.parent.on(destroyModules, this.destroyComponent, this);
        this.parent.on(destroy, this.destroy, this);
    }
    removeEventListener() {
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
    }
}

/**
 * The `AutoComplete` module is used configure the properties of Auto complete type editor.
 */
class AutoComplete$1 {
    constructor(parent) {
        this.compObj = undefined;
        this.parent = parent;
        this.parent.atcModule = this;
        this.base = new Base(this.parent, this);
    }
    render(e) {
        this.compObj = new AutoComplete(this.parent.model);
        this.compObj.appendTo(e.target);
    }
    /**
     * @hidden
     */
    showPopup() {
        this.compObj.focusIn();
        this.compObj.showPopup();
    }
    focus() {
        this.compObj.element.focus();
    }
    updateValue(e) {
        if (this.compObj && e.type === 'AutoComplete') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }
    /**
     * Destroys the module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.base.destroy();
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'auto-complete';
    }
}

/**
 * The `ColorPicker` module is used configure the properties of Color picker type editor.
 */
class ColorPicker$1 {
    constructor(parent) {
        this.compObj = undefined;
        this.parent = parent;
        this.parent.colorModule = this;
        this.base = new Base(this.parent, this);
    }
    render(e) {
        this.compObj = new ColorPicker(this.parent.model);
        this.compObj.appendTo(e.target);
    }
    focus() {
        this.compObj.element.focus();
    }
    updateValue(e) {
        if (this.compObj && e.type === 'Color') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }
    /**
     * Destroys the module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.base.destroy();
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'color-picker';
    }
}

/**
 * The `ComboBox` module is used configure the properties of Combo box type editor.
 */
class ComboBox$1 {
    constructor(parent) {
        this.compObj = undefined;
        this.parent = parent;
        this.parent.comboBoxModule = this;
        this.base = new Base(this.parent, this);
    }
    render(e) {
        this.compObj = new ComboBox(this.parent.model);
        this.compObj.appendTo(e.target);
    }
    focus() {
        this.compObj.element.focus();
    }
    /**
     * @hidden
     */
    showPopup() {
        this.compObj.focusIn();
        this.compObj.showPopup();
    }
    updateValue(e) {
        if (this.compObj && e.type === 'ComboBox') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }
    /**
     * Destroys the module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.base.destroy();
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'combo-box';
    }
}

/**
 * The `DateRangePicker` module is used configure the properties of Date range picker type editor.
 */
class DateRangePicker$1 {
    constructor(parent) {
        this.compObj = undefined;
        this.parent = parent;
        this.parent.dateRangeModule = this;
        this.base = new Base(this.parent, this);
    }
    render(e) {
        this.compObj = new DateRangePicker(this.parent.model);
        this.compObj.appendTo(e.target);
    }
    focus() {
        this.compObj.element.focus();
    }
    updateValue(e) {
        if (this.compObj && e.type === 'DateRange') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }
    /**
     * Destroys the module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.base.destroy();
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'date-range-picker';
    }
}

/**
 * The `MultiSelect` module is used configure the properties of Multi select type editor.
 */
class MultiSelect$1 {
    constructor(parent) {
        this.isPopOpen = false;
        this.compObj = undefined;
        this.parent = parent;
        this.parent.multiSelectModule = this;
        this.base = new Base(this.parent, this);
    }
    render(e) {
        let compModel = Object.assign({}, this.parent.model);
        this.openEvent = compModel.open;
        this.closeEvent = compModel.close;
        compModel.open = this.openHandler.bind(this);
        compModel.close = this.closeHandler.bind(this);
        this.compObj = new MultiSelect(compModel);
        this.compObj.appendTo(e.target);
    }
    openHandler(e) {
        this.isPopOpen = true;
        if (this.openEvent) {
            this.compObj.setProperties({ open: this.openEvent }, true);
            this.compObj.trigger('open', e);
        }
    }
    closeHandler(e) {
        this.isPopOpen = false;
        if (this.closeEvent) {
            this.compObj.setProperties({ close: this.closeEvent }, true);
            this.compObj.trigger('close', e);
        }
    }
    focus() {
        if (!this.isPopOpen) {
            let evt = document.createEvent('MouseEvent');
            evt.initEvent('mousedown', true, true);
            closest(this.compObj.element, '.e-multi-select-wrapper').dispatchEvent(evt);
        }
    }
    updateValue(e) {
        if (this.compObj && e.type === 'MultiSelect') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }
    getRenderValue() {
        this.parent.printValue = this.compObj.text;
    }
    /**
     * Destroys the module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.base.destroy();
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'multi-select';
    }
}

/**
 * The `RTE` module is used configure the properties of RTE type editor.
 */
class Rte {
    constructor(parent) {
        this.compObj = undefined;
        RichTextEditor.Inject(HtmlEditor, MarkdownEditor, Toolbar, Link, Image, QuickToolbar, Table, FileManager);
        this.parent = parent;
        this.parent.rteModule = this;
        this.base = new Base(this.parent, this);
    }
    render(e) {
        this.compObj = new RichTextEditor(this.parent.model);
        this.compObj.appendTo(e.target);
    }
    focus() {
        this.compObj.focusIn();
    }
    updateValue(e) {
        if (this.compObj && e.type === 'RTE') {
            this.parent.setProperties({ value: this.getRteValue() }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }
    getRteValue() {
        let rteVal;
        if (this.compObj.editorMode === 'Markdown') {
            rteVal = this.compObj.contentModule.getEditPanel().value;
            return (rteVal === '') ? '' : rteVal;
        }
        else {
            rteVal = this.compObj.contentModule.getEditPanel().innerHTML;
            return (rteVal === '<p><br></p>' || rteVal === '&lt;p&gt;&lt;br&gt;&lt;/p&gt;' || rteVal === '') ? '' : rteVal;
        }
    }
    refresh() {
        this.compObj.refresh();
    }
    /**
     * Destroys the rte module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.base.destroy();
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'rte';
    }
}

/**
 * The `Slider` module is used configure the properties of Slider type editor.
 */
class Slider$1 {
    constructor(parent) {
        this.compObj = undefined;
        this.parent = parent;
        this.parent.sliderModule = this;
        this.base = new Base(this.parent, this);
    }
    render(e) {
        this.compObj = new Slider(this.parent.model);
        this.compObj.appendTo(e.target);
    }
    focus() {
        this.compObj.element.focus();
    }
    updateValue(e) {
        if (this.compObj && e.type === 'Slider') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }
    refresh() {
        this.compObj.refresh();
    }
    /**
     * Destroys the slider module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.base.destroy();
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'slider';
    }
}

/**
 * The `TimePicker` module is used configure the properties of Time picker type editor.
 */
class TimePicker$1 {
    constructor(parent) {
        this.compObj = undefined;
        this.parent = parent;
        this.parent.timeModule = this;
        this.base = new Base(this.parent, this);
    }
    render(e) {
        this.compObj = new TimePicker(this.parent.model);
        this.compObj.appendTo(e.target);
    }
    focus() {
        this.compObj.focusIn();
    }
    updateValue(e) {
        if (this.compObj && e.type === 'Time') {
            this.parent.setProperties({ value: this.compObj.value }, true);
            this.parent.extendModelValue(this.compObj.value);
        }
    }
    /**
     * Destroys the module.
     * @method destroy
     * @return {void}
     * @hidden
     */
    destroy() {
        this.base.destroy();
    }
    /**
     * For internal use only - Get the module name.
     */
    getModuleName() {
        return 'time-picker';
    }
}

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
//# sourceMappingURL=ej2-inplace-editor.es2015.js.map
