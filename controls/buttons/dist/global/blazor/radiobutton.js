window.sf = window.sf || {};
var sfradiobutton = (function (exports) {
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
var LABEL = 'e-label';
var RIPPLE = 'e-ripple-container';
var RTL = 'e-rtl';
var WRAPPER = 'e-radio-wrapper';
/**
 * The RadioButton is a graphical user interface element that allows you to select one option from the choices.
 * It contains checked and unchecked states.
 * ```html
 * <input type="radio" id="radio"/>
 * <script>
 * var radioObj = new RadioButton({ label: "Default" });
 * radioObj.appendTo("#radio");
 * </script>
 * ```
 */
var RadioButton = /** @class */ (function (_super) {
    __extends(RadioButton, _super);
    /**
     * Constructor for creating the widget
     * @private
     */
    function RadioButton(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.isFocused = false;
        return _this;
    }
    RadioButton_1 = RadioButton;
    RadioButton.prototype.changeHandler = function (event) {
        this.checked = true;
        this.dataBind();
        var changeEventArgs = { value: this.value, event: event };
        this.trigger('change', changeEventArgs);
        if (this.tagName === 'EJS-RADIOBUTTON') {
            event.stopPropagation();
        }
    };
    RadioButton.prototype.updateChange = function (state) {
        var input;
        var instance;
        var radioGrp = this.getRadioGroup();
        for (var i = 0; i < radioGrp.length; i++) {
            input = radioGrp[i];
            if (input !== this.element) {
                instance = sf.base.getInstance(input, RadioButton_1);
                instance.checked = false;
                if (this.tagName === 'EJS-RADIOBUTTON') {
                    instance.angularValue = this.value;
                }
            }
        }
    };
    /**
     * Destroys the widget.
     * @returns void
     */
    RadioButton.prototype.destroy = function () {
        var _this = this;
        var radioWrap = this.element.parentElement;
        _super.prototype.destroy.call(this);
        if (!this.disabled) {
            this.unWireEvents();
        }
        if (this.tagName === 'INPUT') {
            if (radioWrap.parentNode) {
                radioWrap.parentNode.insertBefore(this.element, radioWrap);
            }
            sf.base.detach(radioWrap);
            this.element.checked = false;
            ['name', 'value', 'disabled'].forEach(function (key) {
                _this.element.removeAttribute(key);
            });
        }
        else {
            ['role', 'aria-checked', 'class'].forEach(function (key) {
                radioWrap.removeAttribute(key);
            });
            radioWrap.innerHTML = '';
        }
    };
    RadioButton.prototype.focusHandler = function () {
        this.isFocused = true;
    };
    RadioButton.prototype.focusOutHandler = function () {
        this.getLabel().classList.remove('e-focus');
    };
    RadioButton.prototype.getModuleName = function () {
        return 'radio';
    };
    /**
     * To get the value of selected radio button in a group.
     * @method getSelectedValue
     * @return {string}
     */
    RadioButton.prototype.getSelectedValue = function () {
        var input;
        var radioGrp = this.getRadioGroup();
        for (var i = 0, len = radioGrp.length; i < len; i++) {
            input = radioGrp[i];
            if (input.checked) {
                return input.value;
            }
        }
        return '';
    };
    RadioButton.prototype.getRadioGroup = function () {
        return document.querySelectorAll('input.e-radio[name="' + this.element.getAttribute('name') + '"]');
    };
    /**
     * Gets the properties to be maintained in the persistence state.
     * @private
     */
    RadioButton.prototype.getPersistData = function () {
        return this.addOnPersist(['checked']);
    };
    RadioButton.prototype.getLabel = function () {
        return this.element.nextElementSibling;
    };
    RadioButton.prototype.initialize = function () {
        if (sf.base.isNullOrUndefined(this.initialCheckedValue)) {
            this.initialCheckedValue = this.checked;
        }
        this.initWrapper();
        if (this.name) {
            this.element.setAttribute('name', this.name);
        }
        if (this.value) {
            this.element.setAttribute('value', this.value);
        }
        if (this.checked) {
            this.element.checked = true;
        }
        if (this.disabled) {
            this.setDisabled();
        }
    };
    RadioButton.prototype.initWrapper = function () {
        var rippleSpan;
        var wrapper = this.element.parentElement;
        if (!wrapper.classList.contains(WRAPPER)) {
            wrapper = this.createElement('div', { className: WRAPPER });
            this.element.parentNode.insertBefore(wrapper, this.element);
        }
        var label = this.createElement('label', { attrs: { for: this.element.id } });
        wrapper.appendChild(this.element);
        wrapper.appendChild(label);
        if (sf.base.isRippleEnabled) {
            rippleSpan = this.createElement('span', { className: (RIPPLE) });
            label.appendChild(rippleSpan);
            sf.base.rippleEffect(rippleSpan, {
                duration: 400,
                isCenterRipple: true
            });
        }
        wrapper.classList.add('e-wrapper');
        if (this.enableRtl) {
            label.classList.add(RTL);
        }
        if (this.cssClass) {
            sf.base.addClass([label], this.cssClass.split(' '));
        }
        if (this.label) {
            this.setText(this.label);
        }
    };
    RadioButton.prototype.keyUpHandler = function () {
        if (this.isFocused) {
            this.getLabel().classList.add('e-focus');
        }
    };
    RadioButton.prototype.labelRippleHandler = function (e) {
        var ripple = this.getLabel().getElementsByClassName(RIPPLE)[0];
        sf.buttons.rippleMouseHandler(e, ripple);
    };
    RadioButton.prototype.formResetHandler = function () {
        this.checked = this.initialCheckedValue;
        if (this.initialCheckedValue) {
            sf.base.attributes(this.element, { 'checked': 'true' });
        }
    };
    /**
     * Called internally if any of the property value changes.
     * @private
     */
    RadioButton.prototype.onPropertyChanged = function (newProp, oldProp) {
        var label = this.getLabel();
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'checked':
                    if (newProp.checked) {
                        this.updateChange(newProp.checked);
                    }
                    this.element.checked = newProp.checked;
                    break;
                case 'disabled':
                    if (newProp.disabled) {
                        this.setDisabled();
                        this.unWireEvents();
                    }
                    else {
                        this.element.disabled = false;
                        this.wireEvents();
                    }
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        sf.base.removeClass([label], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        sf.base.addClass([label], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        label.classList.add(RTL);
                    }
                    else {
                        label.classList.remove(RTL);
                    }
                    break;
                case 'label':
                    this.setText(newProp.label);
                    break;
                case 'labelPosition':
                    if (newProp.labelPosition === 'Before') {
                        label.classList.add('e-right');
                    }
                    else {
                        label.classList.remove('e-right');
                    }
                    break;
                case 'name':
                    this.element.setAttribute('name', newProp.name);
                    break;
                case 'value':
                    this.element.setAttribute('value', newProp.value);
                    break;
            }
        }
    };
    /**
     * Initialize checked Property, Angular and React and Unique ID support.
     * @private
     */
    RadioButton.prototype.preRender = function () {
        var element = this.element;
        this.formElement = sf.base.closest(this.element, 'form');
        this.tagName = this.element.tagName;
        element = sf.buttons.wrapperInitialize(this.createElement, 'EJS-RADIOBUTTON', 'radio', element, WRAPPER, 'radio');
        this.element = element;
        if (this.element.getAttribute('type') !== 'radio') {
            this.element.setAttribute('type', 'radio');
        }
        if (!this.element.id) {
            this.element.id = sf.base.getUniqueID('e-' + this.getModuleName());
        }
        if (this.tagName === 'EJS-RADIOBUTTON') {
            var formControlName = this.element.getAttribute('formcontrolname');
            if (formControlName) {
                this.setProperties({ 'name': formControlName }, true);
                this.element.setAttribute('name', formControlName);
            }
        }
    };
    /**
     * Initialize the control rendering
     * @private
     */
    RadioButton.prototype.render = function () {
        this.initialize();
        if (!this.disabled) {
            this.wireEvents();
        }
        this.renderComplete();
    };
    RadioButton.prototype.setDisabled = function () {
        this.element.disabled = true;
    };
    RadioButton.prototype.setText = function (text) {
        var label = this.getLabel();
        var textLabel = label.getElementsByClassName(LABEL)[0];
        if (textLabel) {
            textLabel.textContent = text;
        }
        else {
            text = (this.enableHtmlSanitizer) ? sf.base.SanitizeHtmlHelper.sanitize(text) : text;
            textLabel = this.createElement('span', { className: LABEL, innerHTML: text });
            label.appendChild(textLabel);
        }
        if (this.labelPosition === 'Before') {
            this.getLabel().classList.add('e-right');
        }
        else {
            this.getLabel().classList.remove('e-right');
        }
    };
    RadioButton.prototype.unWireEvents = function () {
        var label = this.getLabel();
        sf.base.EventHandler.remove(this.element, 'change', this.changeHandler);
        sf.base.EventHandler.remove(this.element, 'focus', this.focusHandler);
        sf.base.EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        sf.base.EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        var rippleLabel = label.getElementsByClassName(LABEL)[0];
        if (rippleLabel) {
            sf.base.EventHandler.remove(rippleLabel, 'mousedown', this.labelRippleHandler);
            sf.base.EventHandler.remove(rippleLabel, 'mouseup', this.labelRippleHandler);
        }
        if (this.formElement) {
            sf.base.EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
    };
    RadioButton.prototype.wireEvents = function () {
        var label = this.getLabel();
        sf.base.EventHandler.add(this.element, 'change', this.changeHandler, this);
        sf.base.EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        sf.base.EventHandler.add(this.element, 'focus', this.focusHandler, this);
        sf.base.EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        var rippleLabel = label.getElementsByClassName(LABEL)[0];
        if (rippleLabel) {
            sf.base.EventHandler.add(rippleLabel, 'mousedown', this.labelRippleHandler, this);
            sf.base.EventHandler.add(rippleLabel, 'mouseup', this.labelRippleHandler, this);
        }
        if (this.formElement) {
            sf.base.EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
    };
    /**
     * Click the RadioButton element
     * its native method
     * @public
     */
    RadioButton.prototype.click = function () {
        this.element.click();
    };
    /**
     * Sets the focus to RadioButton
     * its native method
     * @public
     */
    RadioButton.prototype.focusIn = function () {
        this.element.focus();
    };
    var RadioButton_1;
    __decorate([
        sf.base.Event()
    ], RadioButton.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], RadioButton.prototype, "created", void 0);
    __decorate([
        sf.base.Property(false)
    ], RadioButton.prototype, "checked", void 0);
    __decorate([
        sf.base.Property('')
    ], RadioButton.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(false)
    ], RadioButton.prototype, "disabled", void 0);
    __decorate([
        sf.base.Property('')
    ], RadioButton.prototype, "label", void 0);
    __decorate([
        sf.base.Property('After')
    ], RadioButton.prototype, "labelPosition", void 0);
    __decorate([
        sf.base.Property('')
    ], RadioButton.prototype, "name", void 0);
    __decorate([
        sf.base.Property('')
    ], RadioButton.prototype, "value", void 0);
    __decorate([
        sf.base.Property(false)
    ], RadioButton.prototype, "enableHtmlSanitizer", void 0);
    RadioButton = RadioButton_1 = __decorate([
        sf.base.NotifyPropertyChanges
    ], RadioButton);
    return RadioButton;
}(sf.base.Component));

/**
 * RadioButton modules
 */

exports.RadioButton = RadioButton;

return exports;

});

    sf.buttons = sf.base.extend({}, sf.buttons, sfradiobutton({}));