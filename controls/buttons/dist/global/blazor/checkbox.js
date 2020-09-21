window.sf = window.sf || {};
var sfcheckbox = (function (exports) {
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
var CHECK = 'e-check';
var DISABLED = 'e-checkbox-disabled';
var FRAME = 'e-frame';
var INDETERMINATE = 'e-stop';
var LABEL = 'e-label';
var RIPPLE = 'e-ripple-container';
var RIPPLECHECK = 'e-ripple-check';
var RIPPLEINDETERMINATE = 'e-ripple-stop';
var RTL = 'e-rtl';
var WRAPPER = 'e-checkbox-wrapper';
var containerAttr = ['title', 'class', 'style', 'disabled', 'readonly', 'name', 'value'];
/**
 * The CheckBox is a graphical user interface element that allows you to select one or more options from the choices.
 * It contains checked, unchecked, and indeterminate states.
 * ```html
 * <input type="checkbox" id="checkbox"/>
 * <script>
 * var checkboxObj = new CheckBox({ label: "Default" });
 * checkboxObj.appendTo("#checkbox");
 * </script>
 * ```
 */
var CheckBox = /** @class */ (function (_super) {
    __extends(CheckBox, _super);
    /**
     * Constructor for creating the widget
     * @private
     */
    function CheckBox(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isFocused = false;
        _this.isMouseClick = false;
        return _this;
    }
    CheckBox.prototype.changeState = function (state) {
        var ariaState;
        var rippleSpan;
        var frameSpan = this.getWrapper().getElementsByClassName(FRAME)[0];
        if (sf.base.isRippleEnabled) {
            rippleSpan = this.getWrapper().getElementsByClassName(RIPPLE)[0];
        }
        if (state === 'check') {
            frameSpan.classList.remove(INDETERMINATE);
            frameSpan.classList.add(CHECK);
            if (rippleSpan) {
                rippleSpan.classList.remove(RIPPLEINDETERMINATE);
                rippleSpan.classList.add(RIPPLECHECK);
            }
            ariaState = 'true';
            this.element.checked = true;
        }
        else if (state === 'uncheck') {
            sf.base.removeClass([frameSpan], [CHECK, INDETERMINATE]);
            if (rippleSpan) {
                sf.base.removeClass([rippleSpan], [RIPPLECHECK, RIPPLEINDETERMINATE]);
            }
            ariaState = 'false';
            this.element.checked = false;
        }
        else {
            frameSpan.classList.remove(CHECK);
            frameSpan.classList.add(INDETERMINATE);
            if (rippleSpan) {
                rippleSpan.classList.remove(RIPPLECHECK);
                rippleSpan.classList.add(RIPPLEINDETERMINATE);
            }
            ariaState = 'mixed';
            this.element.indeterminate = true;
        }
        this.getWrapper().setAttribute('aria-checked', ariaState);
    };
    CheckBox.prototype.clickHandler = function (event) {
        if (this.isMouseClick) {
            this.focusOutHandler();
            this.isMouseClick = false;
        }
        if (this.indeterminate) {
            this.changeState(this.checked ? 'check' : 'uncheck');
            this.indeterminate = false;
            this.element.indeterminate = false;
        }
        else if (this.checked) {
            this.changeState('uncheck');
            this.checked = false;
        }
        else {
            this.changeState('check');
            this.checked = true;
        }
        var changeEventArgs = { checked: this.element.checked, event: event };
        this.trigger('change', changeEventArgs);
    };
    /**
     * Destroys the widget.
     * @returns void
     */
    CheckBox.prototype.destroy = function () {
        var _this = this;
        var wrapper = this.getWrapper();
        if (sf.base.isBlazor() && this.isServerRendered) {
            if (!this.disabled) {
                this.wrapper = wrapper;
                this.unWireEvents();
            }
        }
        else {
            if (this.wrapper) {
                wrapper = this.wrapper;
                _super.prototype.destroy.call(this);
                if (!this.disabled) {
                    this.unWireEvents();
                }
                if (this.tagName === 'INPUT') {
                    if (this.getWrapper()) {
                        wrapper.parentNode.insertBefore(this.element, wrapper);
                    }
                    sf.base.detach(wrapper);
                    this.element.checked = false;
                    if (this.indeterminate) {
                        this.element.indeterminate = false;
                    }
                    ['name', 'value', 'disabled'].forEach(function (key) {
                        _this.element.removeAttribute(key);
                    });
                }
                else {
                    ['role', 'aria-checked', 'class'].forEach(function (key) {
                        wrapper.removeAttribute(key);
                    });
                    wrapper.innerHTML = '';
                }
            }
        }
    };
    CheckBox.prototype.focusHandler = function () {
        this.isFocused = true;
    };
    CheckBox.prototype.focusOutHandler = function () {
        this.getWrapper().classList.remove('e-focus');
        this.isFocused = false;
    };
    /**
     * Gets the module name.
     * @private
     */
    CheckBox.prototype.getModuleName = function () {
        return 'checkbox';
    };
    /**
     * Gets the properties to be maintained in the persistence state.
     * @private
     */
    CheckBox.prototype.getPersistData = function () {
        return this.addOnPersist(['checked', 'indeterminate']);
    };
    CheckBox.prototype.getWrapper = function () {
        if (this.element.parentElement) {
            return this.element.parentElement.parentElement;
        }
        else {
            return null;
        }
    };
    CheckBox.prototype.initialize = function () {
        if (sf.base.isNullOrUndefined(this.initialCheckedValue)) {
            this.initialCheckedValue = this.checked;
        }
        if (this.name) {
            this.element.setAttribute('name', this.name);
        }
        if (this.value) {
            this.element.setAttribute('value', this.value);
        }
        if (this.checked) {
            this.changeState('check');
        }
        if (this.indeterminate) {
            this.changeState();
        }
        if (this.disabled) {
            this.setDisabled();
        }
    };
    CheckBox.prototype.initWrapper = function () {
        var wrapper = this.element.parentElement;
        if (!wrapper.classList.contains(WRAPPER)) {
            wrapper = this.createElement('div', {
                className: WRAPPER, attrs: { 'role': 'checkbox', 'aria-checked': 'false' }
            });
            this.element.parentNode.insertBefore(wrapper, this.element);
        }
        var label = this.createElement('label', { attrs: { for: this.element.id } });
        var frameSpan = this.createElement('span', { className: 'e-icons ' + FRAME });
        wrapper.classList.add('e-wrapper');
        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        if (this.cssClass) {
            sf.base.addClass([wrapper], this.cssClass.split(' '));
        }
        wrapper.appendChild(label);
        label.appendChild(this.element);
        sf.buttons.setHiddenInput(this, label);
        label.appendChild(frameSpan);
        if (sf.base.isRippleEnabled) {
            var rippleSpan = this.createElement('span', { className: RIPPLE });
            if (this.labelPosition === 'Before') {
                label.appendChild(rippleSpan);
            }
            else {
                label.insertBefore(rippleSpan, frameSpan);
            }
            sf.base.rippleEffect(rippleSpan, { duration: 400, isCenterRipple: true });
        }
        if (this.label) {
            this.setText(this.label);
        }
    };
    CheckBox.prototype.keyUpHandler = function () {
        if (this.isFocused) {
            this.getWrapper().classList.add('e-focus');
        }
    };
    CheckBox.prototype.labelMouseHandler = function (e) {
        this.isMouseClick = true;
        var rippleSpan = this.getWrapper().getElementsByClassName(RIPPLE)[0];
        sf.buttons.rippleMouseHandler(e, rippleSpan);
    };
    /**
     * Called internally if any of the property value changes.
     * @private
     */
    CheckBox.prototype.onPropertyChanged = function (newProp, oldProp) {
        var wrapper = this.getWrapper();
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'checked':
                    this.indeterminate = false;
                    this.element.indeterminate = false;
                    this.changeState(newProp.checked ? 'check' : 'uncheck');
                    break;
                case 'indeterminate':
                    if (newProp.indeterminate) {
                        this.changeState();
                    }
                    else {
                        this.element.indeterminate = false;
                        this.changeState(this.checked ? 'check' : 'uncheck');
                    }
                    break;
                case 'disabled':
                    if (newProp.disabled) {
                        this.setDisabled();
                        this.wrapper = this.getWrapper();
                        this.unWireEvents();
                    }
                    else {
                        this.element.disabled = false;
                        wrapper.classList.remove(DISABLED);
                        wrapper.setAttribute('aria-disabled', 'false');
                        this.wireEvents();
                    }
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        sf.base.removeClass([wrapper], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        sf.base.addClass([wrapper], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        wrapper.classList.add(RTL);
                    }
                    else {
                        wrapper.classList.remove(RTL);
                    }
                    break;
                case 'label':
                    this.setText(newProp.label);
                    break;
                case 'labelPosition':
                    var label = wrapper.getElementsByClassName(LABEL)[0];
                    var labelWrap = wrapper.getElementsByTagName('label')[0];
                    sf.base.detach(label);
                    if (newProp.labelPosition === 'After') {
                        labelWrap.appendChild(label);
                    }
                    else {
                        labelWrap.insertBefore(label, wrapper.getElementsByClassName(FRAME)[0]);
                    }
                    break;
                case 'name':
                    this.element.setAttribute('name', newProp.name);
                    break;
                case 'value':
                    this.element.setAttribute('value', newProp.value);
                    break;
                case 'htmlAttributes':
                    this.updateHtmlAttributeToWrapper();
                    break;
            }
        }
    };
    /**
     * Initialize Angular, React and Unique ID support.
     * @private
     */
    CheckBox.prototype.preRender = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            return;
        }
        var element = this.element;
        this.formElement = sf.base.closest(this.element, 'form');
        this.tagName = this.element.tagName;
        element = sf.buttons.wrapperInitialize(this.createElement, 'EJS-CHECKBOX', 'checkbox', element, WRAPPER, 'checkbox');
        this.element = element;
        if (this.element.getAttribute('type') !== 'checkbox') {
            this.element.setAttribute('type', 'checkbox');
        }
        if (!this.element.id) {
            this.element.id = sf.base.getUniqueID('e-' + this.getModuleName());
        }
    };
    /**
     * Initialize the control rendering.
     * @private
     */
    CheckBox.prototype.render = function () {
        if (sf.base.isBlazor() && this.isServerRendered) {
            if (sf.base.isRippleEnabled) {
                sf.base.rippleEffect(this.getWrapper().getElementsByClassName(RIPPLE)[0], { duration: 400, isCenterRipple: true });
            }
        }
        else {
            this.initWrapper();
            this.initialize();
        }
        if (!this.disabled) {
            this.wireEvents();
        }
        this.updateHtmlAttributeToWrapper();
        this.renderComplete();
        this.wrapper = this.getWrapper();
    };
    CheckBox.prototype.setDisabled = function () {
        var wrapper = this.getWrapper();
        this.element.disabled = true;
        wrapper.classList.add(DISABLED);
        wrapper.setAttribute('aria-disabled', 'true');
    };
    CheckBox.prototype.setText = function (text) {
        var label = this.getWrapper().getElementsByClassName(LABEL)[0];
        if (label) {
            label.textContent = text;
        }
        else {
            text = (this.enableHtmlSanitizer) ? sf.base.SanitizeHtmlHelper.sanitize(text) : text;
            label = this.createElement('span', { className: LABEL, innerHTML: text });
            var labelWrap = this.getWrapper().getElementsByTagName('label')[0];
            if (this.labelPosition === 'Before') {
                labelWrap.insertBefore(label, this.getWrapper().getElementsByClassName(FRAME)[0]);
            }
            else {
                labelWrap.appendChild(label);
            }
        }
    };
    CheckBox.prototype.changeHandler = function (e) {
        e.stopPropagation();
    };
    CheckBox.prototype.formResetHandler = function () {
        this.checked = this.initialCheckedValue;
        this.element.checked = this.initialCheckedValue;
    };
    CheckBox.prototype.unWireEvents = function () {
        var wrapper = this.wrapper;
        sf.base.EventHandler.remove(this.element, 'click', this.clickHandler);
        sf.base.EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        sf.base.EventHandler.remove(this.element, 'focus', this.focusHandler);
        sf.base.EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        var label = wrapper.getElementsByTagName('label')[0];
        sf.base.EventHandler.remove(label, 'mousedown', this.labelMouseHandler);
        sf.base.EventHandler.remove(label, 'mouseup', this.labelMouseHandler);
        if (this.formElement) {
            sf.base.EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
        if (this.tagName === 'EJS-CHECKBOX') {
            sf.base.EventHandler.remove(this.element, 'change', this.changeHandler);
        }
    };
    CheckBox.prototype.wireEvents = function () {
        var wrapper = this.getWrapper();
        sf.base.EventHandler.add(this.element, 'click', this.clickHandler, this);
        sf.base.EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        sf.base.EventHandler.add(this.element, 'focus', this.focusHandler, this);
        sf.base.EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        var label = wrapper.getElementsByTagName('label')[0];
        sf.base.EventHandler.add(label, 'mousedown', this.labelMouseHandler, this);
        sf.base.EventHandler.add(label, 'mouseup', this.labelMouseHandler, this);
        if (this.formElement) {
            sf.base.EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
        if (this.tagName === 'EJS-CHECKBOX') {
            sf.base.EventHandler.add(this.element, 'change', this.changeHandler, this);
        }
    };
    CheckBox.prototype.updateHtmlAttributeToWrapper = function () {
        if (!sf.base.isNullOrUndefined(this.htmlAttributes)) {
            for (var _i = 0, _a = Object.keys(this.htmlAttributes); _i < _a.length; _i++) {
                var key = _a[_i];
                if (containerAttr.indexOf(key) > -1) {
                    var wrapper = this.getWrapper();
                    if (key === 'class') {
                        sf.base.addClass([wrapper], this.htmlAttributes[key].split(' '));
                    }
                    else if (key === 'title') {
                        wrapper.setAttribute(key, this.htmlAttributes[key]);
                    }
                    else if (key === 'style') {
                        var frameSpan = this.getWrapper().getElementsByClassName(FRAME)[0];
                        frameSpan.setAttribute(key, this.htmlAttributes[key]);
                    }
                    else {
                        this.element.setAttribute(key, this.htmlAttributes[key]);
                    }
                }
            }
        }
    };
    /**
     * Click the CheckBox element
     * its native method
     * @public
     */
    CheckBox.prototype.click = function () {
        this.element.click();
    };
    /**
     * Sets the focus to CheckBox
     * its native method
     * @public
     */
    CheckBox.prototype.focusIn = function () {
        this.element.focus();
    };
    __decorate([
        sf.base.Event()
    ], CheckBox.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], CheckBox.prototype, "created", void 0);
    __decorate([
        sf.base.Property(false)
    ], CheckBox.prototype, "checked", void 0);
    __decorate([
        sf.base.Property('')
    ], CheckBox.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(false)
    ], CheckBox.prototype, "disabled", void 0);
    __decorate([
        sf.base.Property(false)
    ], CheckBox.prototype, "indeterminate", void 0);
    __decorate([
        sf.base.Property('')
    ], CheckBox.prototype, "label", void 0);
    __decorate([
        sf.base.Property('After')
    ], CheckBox.prototype, "labelPosition", void 0);
    __decorate([
        sf.base.Property('')
    ], CheckBox.prototype, "name", void 0);
    __decorate([
        sf.base.Property('')
    ], CheckBox.prototype, "value", void 0);
    __decorate([
        sf.base.Property(false)
    ], CheckBox.prototype, "enableHtmlSanitizer", void 0);
    __decorate([
        sf.base.Property({})
    ], CheckBox.prototype, "htmlAttributes", void 0);
    CheckBox = __decorate([
        sf.base.NotifyPropertyChanges
    ], CheckBox);
    return CheckBox;
}(sf.base.Component));

/**
 * CheckBox modules
 */

exports.CheckBox = CheckBox;

return exports;

});
sfBlazor.modules["checkbox"] = "buttons.CheckBox";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.checkbox, () => {
    sf.buttons = sf.base.extend({}, sf.buttons, sfcheckbox({}));
});