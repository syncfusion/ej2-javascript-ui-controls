window.sf = window.sf || {};
var sfformvalidator = (function (exports) {
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
/**
 * global declarations
 */
// tslint:disable-next-line:no-any
var regex = {
    EMAIL: new RegExp('^[A-Za-z0-9._%+-]{1,}@[A-Za-z0-9._%+-]{1,}([.]{1}[a-zA-Z0-9]{2,}' +
        '|[.]{1}[a-zA-Z0-9]{2,4}[.]{1}[a-zA-Z0-9]{2,4})$'),
    URL: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/m,
    DATE_ISO: new RegExp('^([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$'),
    DIGITS: new RegExp('^[0-9]*$'),
    PHONE: new RegExp('^[+]?[0-9]{9,13}$'),
    CREDITCARD: new RegExp('^\\d{13,16}$')
};
/**
 * ErrorOption values
 * @private
 */

(function (ErrorOption) {
    /**
     * Defines the error message.
     */
    ErrorOption[ErrorOption["Message"] = 0] = "Message";
    /**
     * Defines the error element type.
     */
    ErrorOption[ErrorOption["Label"] = 1] = "Label";
})(exports.ErrorOption || (exports.ErrorOption = {}));
/**
 * FormValidator class enables you to validate the form fields based on your defined rules
 * ```html
 * <form id='formId'>
 *  <input type='text' name='Name' />
 *  <input type='text' name='Age' />
 * </form>
 * <script>
 *   let formObject = new FormValidator('#formId', {
 *      rules: { Name: { required: true }, Age: { range: [18, 30] } };
 *   });
 *   formObject.validate();
 * </script>
 * ```
 */
var FormValidator = /** @class */ (function (_super) {
    __extends(FormValidator, _super);
    // Initializes the FormValidator 
    function FormValidator(element, options) {
        var _this = _super.call(this, options, element) || this;
        _this.validated = [];
        _this.errorRules = [];
        _this.allowSubmit = false;
        _this.required = 'required';
        _this.infoElement = null;
        _this.inputElement = null;
        _this.selectQuery = 'input:not([type=reset]):not([type=button]), select, textarea';
        // tslint:disable-next-line:no-any
        _this.localyMessage = {};
        /**
         * Specifies the default messages for validation rules.
         * @default { List of validation message }
         */
        _this.defaultMessages = {
            required: 'This field is required.',
            email: 'Please enter a valid email address.',
            url: 'Please enter a valid URL.',
            date: 'Please enter a valid date.',
            dateIso: 'Please enter a valid date ( ISO ).',
            creditcard: 'Please enter valid card number',
            number: 'Please enter a valid number.',
            digits: 'Please enter only digits.',
            maxLength: 'Please enter no more than {0} characters.',
            minLength: 'Please enter at least {0} characters.',
            rangeLength: 'Please enter a value between {0} and {1} characters long.',
            range: 'Please enter a value between {0} and {1}.',
            max: 'Please enter a value less than or equal to {0}.',
            min: 'Please enter a value greater than or equal to {0}.',
            regex: 'Please enter a correct value.',
            tel: 'Please enter a valid phone number.',
            pattern: 'Please enter a correct pattern value.',
            equalTo: 'Please enter the valid match text',
        };
        if (typeof _this.rules === 'undefined') {
            _this.rules = {};
        }
        _this.l10n = new sf.base.L10n('formValidator', _this.defaultMessages, _this.locale);
        if (_this.locale) {
            _this.localeFunc();
        }
        sf.base.onIntlChange.on('notifyExternalChange', _this.afterLocalization, _this);
        element = typeof element === 'string' ? sf.base.select(element, document) : element;
        // Set novalidate to prevent default HTML5 form validation
        if (_this.element != null) {
            _this.element.setAttribute('novalidate', '');
            _this.inputElements = sf.base.selectAll(_this.selectQuery, _this.element);
            _this.createHTML5Rules();
            _this.wireEvents();
        }
        else {
            return undefined;
        }
        return _this;
    }
    FormValidator_1 = FormValidator;
    // tslint:enable
    /**
     * Add validation rules to the corresponding input element based on `name` attribute.
     * @param {string} name `name` of form field.
     * @param {Object} rules Validation rules for the corresponding element.
     * @return {void}
     */
    FormValidator.prototype.addRules = function (name, rules) {
        if (name) {
            if (this.rules.hasOwnProperty(name)) {
                sf.base.extend(this.rules[name], rules, {});
            }
            else {
                this.rules[name] = rules;
            }
        }
    };
    /**
     * Remove validation to the corresponding field based on name attribute.
     * When no parameter is passed, remove all the validations in the form.
     * @param {string} name Input name attribute value.
     * @param {string[]} rules List of validation rules need to be remove from the corresponding element.
     * @return {void}
     */
    FormValidator.prototype.removeRules = function (name, rules) {
        if (!name && !rules) {
            this.rules = {};
        }
        else if (this.rules[name] && !rules) {
            delete this.rules[name];
        }
        else if (!sf.base.isNullOrUndefined(this.rules[name] && rules)) {
            for (var i = 0; i < rules.length; i++) {
                delete this.rules[name][rules[i]];
            }
        }
        else {
            return;
        }
    };
    /**
     * Validate the current form values using defined rules.
     * Returns `true` when the form is valid otherwise `false`
     * @param {string} selected - Optional parameter to validate specified element.
     * @return {boolean}
     */
    FormValidator.prototype.validate = function (selected) {
        var rules = Object.keys(this.rules);
        if (selected && rules.length) {
            this.validateRules(selected);
            //filter the selected element it don't have any valid input element
            return rules.indexOf(selected) !== -1 && this.errorRules.filter(function (data) {
                return data.name === selected;
            }).length === 0;
        }
        else {
            this.errorRules = [];
            for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
                var name_1 = rules_1[_i];
                this.validateRules(name_1);
            }
            return this.errorRules.length === 0;
        }
    };
    /**
     * Reset the value of all the fields in form.
     * @return {void}
     */
    FormValidator.prototype.reset = function () {
        this.element.reset();
        this.clearForm();
    };
    /**
     * Get input element by name.
     * @param {string} name - Input element name attribute value.
     * @return {HTMLInputElement}
     */
    FormValidator.prototype.getInputElement = function (name) {
        this.inputElement = (sf.base.select('[name="' + name + '"]', this.element));
        return this.inputElement;
    };
    /**
     * Destroy the form validator object and error elements.
     * @return {void}
     */
    FormValidator.prototype.destroy = function () {
        this.reset();
        this.unwireEvents();
        this.rules = {};
        var elements = sf.base.selectAll('.' + this.errorClass + ', .' + this.validClass, this.element);
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            sf.base.detach(element);
        }
        _super.prototype.destroy.call(this);
        sf.base.onIntlChange.off('notifyExternalChange', this.afterLocalization);
    };
    /**
     * @private
     */
    FormValidator.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'locale':
                    this.localeFunc();
                    break;
            }
        }
    };
    
    /**
     * @private
     */
    FormValidator.prototype.localeFunc = function () {
        for (var _i = 0, _a = Object.keys(this.defaultMessages); _i < _a.length; _i++) {
            var key = _a[_i];
            this.l10n.setLocale(this.locale);
            var value = this.l10n.getConstant(key);
            this.localyMessage[key] = value;
        }
    };
    /**
     * @private
     */
    FormValidator.prototype.getModuleName = function () {
        return 'formValidator';
    };
    /**
     * @private
     */
    // tslint:disable-next-line:no-any
    FormValidator.prototype.afterLocalization = function (args) {
        this.locale = args.locale;
        this.localeFunc();
    };
    /**
     * Allows you to refresh the form validator base events to the elements inside the form.
     * @return {void}
     */
    FormValidator.prototype.refresh = function () {
        this.unwireEvents();
        this.inputElements = sf.base.selectAll(this.selectQuery, this.element);
        this.wireEvents();
    };
    FormValidator.prototype.clearForm = function () {
        this.errorRules = [];
        this.validated = [];
        var elements = sf.base.selectAll(this.selectQuery, this.element);
        for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
            var element = elements_2[_i];
            var input = element;
            input.removeAttribute('aria-invalid');
            input.classList.remove(this.errorClass);
            if (input.name.length > 0) {
                this.getInputElement(input.name);
                this.getErrorElement(input.name);
                this.hideMessage(input.name);
            }
            input.classList.remove(this.validClass);
        }
    };
    FormValidator.prototype.createHTML5Rules = function () {
        var defRules = ['required', 'validateHidden', 'regex', 'rangeLength', 'maxLength', 'minLength', 'dateIso', 'digits',
            'pattern', 'data-val-required', 'type', 'data-validation', 'min', 'max', 'range', 'equalTo', 'data-val-minlength-min',
            'data-val-equalto-other', 'data-val-maxlength-max', 'data-val-range-min', 'data-val-regex-pattern', 'data-val-length-max',
            'data-val-creditcard', 'data-val-phone'];
        var acceptedTypes = ['hidden', 'email', 'url', 'date', 'number', 'tel'];
        for (var _i = 0, _a = (this.inputElements); _i < _a.length; _i++) {
            var input = _a[_i];
            // Default attribute rules 
            var allRule = {};
            for (var _b = 0, defRules_1 = defRules; _b < defRules_1.length; _b++) {
                var rule = defRules_1[_b];
                if (input.getAttribute(rule) !== null) {
                    switch (rule) {
                        case 'required':
                            this.defRule(input, allRule, rule, input.required);
                            break;
                        case 'data-validation':
                            rule = input.getAttribute(rule);
                            this.defRule(input, allRule, rule, true);
                            break;
                        case 'type':
                            if (acceptedTypes.indexOf(input.type) !== -1) {
                                this.defRule(input, allRule, input.type, true);
                            }
                            break;
                        case 'rangeLength':
                        case 'range':
                            this.defRule(input, allRule, rule, JSON.parse(input.getAttribute(rule)));
                            break;
                        case 'equalTo':
                            var id = input.getAttribute(rule);
                            this.defRule(input, allRule, rule, id);
                            break;
                        default:
                            if (input.getAttribute('data-val') === 'true') {
                                this.annotationRule(input, allRule, rule, input.getAttribute(rule));
                            }
                            else {
                                this.defRule(input, allRule, rule, input.getAttribute(rule));
                            }
                    }
                }
            }
            //adding pattern type validation
            if (Object.keys(allRule).length !== 0) {
                this.addRules(input.name, allRule);
            }
        }
    };
    FormValidator.prototype.annotationRule = function (input, ruleCon, ruleName, value) {
        var annotationRule = ruleName.split('-');
        var rulesList = ['required', 'creditcard', 'phone', 'maxlength', 'minlength', 'range', 'regex', 'equalto'];
        var ruleFirstName = annotationRule[annotationRule.length - 1];
        var ruleSecondName = annotationRule[annotationRule.length - 2];
        if (rulesList.indexOf(ruleFirstName) !== -1) {
            switch (ruleFirstName) {
                case 'required':
                    this.defRule(input, ruleCon, 'required', value);
                    break;
                case 'creditcard':
                    this.defRule(input, ruleCon, 'creditcard', value);
                    break;
                case 'phone':
                    this.defRule(input, ruleCon, 'tel', value);
                    break;
            }
        }
        else if (rulesList.indexOf(ruleSecondName) !== -1) {
            switch (ruleSecondName) {
                case 'maxlength':
                    this.defRule(input, ruleCon, 'maxLength', value);
                    break;
                case 'minlength':
                    this.defRule(input, ruleCon, 'minLength', value);
                    break;
                case 'range':
                    var minvalue = input.getAttribute('data-val-range-min');
                    var maxvalue = input.getAttribute('data-val-range-max');
                    this.defRule(input, ruleCon, 'range', [minvalue, maxvalue]);
                    break;
                case 'equalto':
                    var id = input.getAttribute(ruleName).split('.');
                    this.defRule(input, ruleCon, 'equalTo', id[id.length - 1]);
                    break;
                case 'regex':
                    this.defRule(input, ruleCon, 'regex', value);
                    break;
            }
        }
    };
    FormValidator.prototype.defRule = function (input, ruleCon, ruleName, value) {
        var message = input.getAttribute('data-' + ruleName + '-message');
        var annotationMessage = input.getAttribute('data-val-' + ruleName);
        var customMessage;
        if (this.rules[input.name] && ruleName !== 'validateHidden' && ruleName !== 'hidden') {
            this.getInputElement(input.name);
            customMessage = this.getErrorMessage(this.rules[input.name][ruleName], ruleName);
        }
        if (message) {
            value = [value, message];
        }
        else if (annotationMessage) {
            value = [value, annotationMessage];
        }
        else if (customMessage) {
            value = [value, customMessage];
        }
        ruleCon[ruleName] = value;
    };
    // Wire events to the form elements
    FormValidator.prototype.wireEvents = function () {
        for (var _i = 0, _a = (this.inputElements); _i < _a.length; _i++) {
            var input = _a[_i];
            if (FormValidator_1.isCheckable(input)) {
                sf.base.EventHandler.add(input, 'click', this.clickHandler, this);
            }
            else if (input.tagName === 'SELECT') {
                sf.base.EventHandler.add(input, 'change', this.changeHandler, this);
            }
            else {
                sf.base.EventHandler.add(input, 'focusout', this.focusOutHandler, this);
                sf.base.EventHandler.add(input, 'keyup', this.keyUpHandler, this);
            }
        }
        sf.base.EventHandler.add(this.element, 'submit', this.submitHandler, this);
        sf.base.EventHandler.add(this.element, 'reset', this.resetHandler, this);
    };
    // UnWire events to the form elements
    FormValidator.prototype.unwireEvents = function () {
        for (var _i = 0, _a = (this.inputElements); _i < _a.length; _i++) {
            var input = _a[_i];
            sf.base.EventHandler.clearEvents(input);
        }
        sf.base.EventHandler.remove(this.element, 'submit', this.submitHandler);
        sf.base.EventHandler.remove(this.element, 'reset', this.resetHandler);
    };
    // Handle input element focusout event
    FormValidator.prototype.focusOutHandler = function (e) {
        this.trigger('focusout', e);
        //FormValidator.triggerCallback(this.focusout, e);
        var element = e.target;
        if (this.rules[element.name]) {
            if (this.rules[element.name][this.required] || element.value.length > 0) {
                this.validate(element.name);
            }
            else if (this.validated.indexOf(element.name) === -1) {
                this.validated.push(element.name);
            }
        }
    };
    // Handle input element keyup event
    FormValidator.prototype.keyUpHandler = function (e) {
        this.trigger('keyup', e);
        var element = e.target;
        // List of keys need to prevent while validation
        var excludeKeys = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];
        if (e.which === 9 && (!this.rules[element.name] || (this.rules[element.name] && !this.rules[element.name][this.required]))) {
            return;
        }
        if (this.validated.indexOf(element.name) !== -1 && this.rules[element.name] && excludeKeys.indexOf(e.which) === -1) {
            this.validate(element.name);
        }
    };
    // Handle input click event
    FormValidator.prototype.clickHandler = function (e) {
        this.trigger('click', e);
        var element = e.target;
        // If element type is not submit allow validation
        if (element.type !== 'submit') {
            this.validate(element.name);
        }
        else if (element.getAttribute('formnovalidate') !== null) {
            // Prevent form validation, if submit button has formnovalidate attribute
            this.allowSubmit = true;
        }
    };
    // Handle input change event
    FormValidator.prototype.changeHandler = function (e) {
        this.trigger('change', e);
        var element = e.target;
        this.validate(element.name);
    };
    // Handle form submit event
    FormValidator.prototype.submitHandler = function (e) {
        this.trigger('submit', e);
        //FormValidator.triggerCallback(this.submit, e);
        // Prevent form submit if validation failed
        if (!this.allowSubmit && !this.validate()) {
            e.preventDefault();
        }
        else {
            this.allowSubmit = false;
        }
    };
    // Handle form reset
    FormValidator.prototype.resetHandler = function () {
        this.clearForm();
    };
    // Validate each rule based on input element name
    FormValidator.prototype.validateRules = function (name) {
        if (!this.rules[name]) {
            return;
        }
        var rules = Object.keys(this.rules[name]);
        var hiddenType = false;
        var validateHiddenType = false;
        var vhPos = rules.indexOf('validateHidden');
        var hPos = rules.indexOf('hidden');
        this.getInputElement(name);
        if (hPos !== -1) {
            hiddenType = true;
        }
        if (vhPos !== -1) {
            validateHiddenType = true;
        }
        if (!hiddenType || (hiddenType && validateHiddenType)) {
            if (vhPos !== -1) {
                rules.splice(vhPos, 1);
            }
            if (hPos !== -1) {
                rules.splice((hPos - 1), 1);
            }
            this.getErrorElement(name);
            for (var _i = 0, rules_2 = rules; _i < rules_2.length; _i++) {
                var rule = rules_2[_i];
                var errorMessage = this.getErrorMessage(this.rules[name][rule], rule);
                var errorRule = { name: name, message: errorMessage };
                var eventArgs = {
                    inputName: name,
                    element: this.inputElement,
                    message: errorMessage
                };
                if (!this.isValid(name, rule) && !this.inputElement.classList.contains(this.ignore)) {
                    this.removeErrorRules(name);
                    this.errorRules.push(errorRule);
                    // Set aria attributes to invalid elements
                    this.inputElement.setAttribute('aria-invalid', 'true');
                    this.inputElement.setAttribute('aria-describedby', this.inputElement.id + '-info');
                    this.inputElement.classList.add(this.errorClass);
                    this.inputElement.classList.remove(this.validClass);
                    if (!this.infoElement) {
                        this.createErrorElement(name, errorRule.message, this.inputElement);
                    }
                    else {
                        this.showMessage(errorRule);
                    }
                    eventArgs.errorElement = this.infoElement;
                    eventArgs.status = 'failure';
                    this.inputElement.classList.add(this.errorClass);
                    this.inputElement.classList.remove(this.validClass);
                    this.optionalValidationStatus(name, eventArgs);
                    this.trigger('validationComplete', eventArgs);
                    // Set aria-required to required rule elements
                    if (rule === 'required') {
                        this.inputElement.setAttribute('aria-required', 'true');
                    }
                    break;
                }
                else {
                    this.hideMessage(name);
                    eventArgs.status = 'success';
                    this.trigger('validationComplete', eventArgs);
                }
            }
        }
        else {
            return;
        }
    };
    // Update the optional validation status
    FormValidator.prototype.optionalValidationStatus = function (name, refer) {
        if (!this.rules[name][this.required] && !this.inputElement.value.length && !sf.base.isNullOrUndefined(this.infoElement)) {
            this.infoElement.innerHTML = this.inputElement.value;
            this.infoElement.setAttribute('aria-invalid', 'false');
            refer.status = '';
            this.hideMessage(name);
        }
    };
    // Check the input element whether it's value satisfy the validation rule or not
    FormValidator.prototype.isValid = function (name, rule) {
        var params = this.rules[name][rule];
        var param = (params instanceof Array && typeof params[1] === 'string') ? params[0] : params;
        var currentRule = this.rules[name][rule];
        var args = { value: this.inputElement.value, param: param, element: this.inputElement, formElement: this.element };
        this.trigger('validationBegin', args);
        if (currentRule && typeof currentRule[0] === 'function') {
            var fn = currentRule[0];
            return fn.call(this, { element: this.inputElement, value: this.inputElement.value });
        }
        else if (FormValidator_1.isCheckable(this.inputElement)) {
            if (rule !== 'required') {
                return true;
            }
            return sf.base.selectAll('input[name=' + name + ']:checked', this.element).length > 0;
        }
        else {
            return FormValidator_1.checkValidator[rule](args);
        }
    };
    // Return default error message or custom error message 
    FormValidator.prototype.getErrorMessage = function (ruleValue, rule) {
        var message = this.inputElement.getAttribute('data-' + rule + '-message') ?
            this.inputElement.getAttribute('data-' + rule + '-message') :
            (ruleValue instanceof Array && typeof ruleValue[1] === 'string') ? ruleValue[1] :
                (Object.keys(this.localyMessage).length !== 0) ? this.localyMessage[rule] : this.defaultMessages[rule];
        var formats = message.match(/{(\d)}/g);
        if (!sf.base.isNullOrUndefined(formats)) {
            for (var i = 0; i < formats.length; i++) {
                var value = ruleValue instanceof Array ? ruleValue[i] : ruleValue;
                message = message.replace(formats[i], value);
            }
        }
        return message;
    };
    // Create error element based on name and error message
    FormValidator.prototype.createErrorElement = function (name, message, input) {
        var errorElement = sf.base.createElement(this.errorElement, {
            className: this.errorClass,
            innerHTML: message,
            attrs: { for: name }
        });
        // Create message design if errorOption is message
        if (this.errorOption === exports.ErrorOption.Message) {
            errorElement.classList.remove(this.errorClass);
            errorElement.classList.add('e-message');
            errorElement = sf.base.createElement(this.errorContainer, { className: this.errorClass, innerHTML: errorElement.outerHTML });
        }
        errorElement.id = this.inputElement.name + '-info';
        // Append error message into MVC error message element
        if (this.element.querySelector('[data-valmsg-for="' + input.id + '"]')) {
            this.element.querySelector('[data-valmsg-for="' + input.id + '"]').appendChild(errorElement);
        }
        else if (input.hasAttribute('data-msg-containerid') === true) {
            // Append error message into custom div element
            var containerId = input.getAttribute('data-msg-containerid');
            var divElement = this.element.querySelector('#' + containerId);
            divElement.appendChild(errorElement);
        }
        else if (this.customPlacement != null) {
            // Call custom placement function if customPlacement is not null
            this.customPlacement.call(this, this.inputElement, errorElement);
        }
        else {
            this.inputElement.parentNode.insertBefore(errorElement, this.inputElement.nextSibling);
        }
        errorElement.style.display = 'block';
        this.getErrorElement(name);
        this.validated.push(name);
        this.checkRequired(name);
    };
    // Get error element by name
    FormValidator.prototype.getErrorElement = function (name) {
        this.infoElement = sf.base.select(this.errorElement + '.' + this.errorClass, this.inputElement.parentElement);
        if (!this.infoElement) {
            this.infoElement = sf.base.select(this.errorElement + '.' + this.errorClass + '[for="' + name + '"]', this.element);
        }
        return this.infoElement;
    };
    // Remove existing rule from errorRules object
    FormValidator.prototype.removeErrorRules = function (name) {
        for (var i = 0; i < this.errorRules.length; i++) {
            var rule = this.errorRules[i];
            if (rule.name === name) {
                this.errorRules.splice(i, 1);
            }
        }
    };
    // Show error message to the input element
    FormValidator.prototype.showMessage = function (errorRule) {
        this.infoElement.style.display = 'block';
        this.infoElement.innerHTML = errorRule.message;
        this.checkRequired(errorRule.name);
    };
    // Hide error message based on input name
    FormValidator.prototype.hideMessage = function (name) {
        if (this.infoElement) {
            this.infoElement.style.display = 'none';
            this.removeErrorRules(name);
            this.inputElement.classList.add(this.validClass);
            this.inputElement.classList.remove(this.errorClass);
            this.inputElement.setAttribute('aria-invalid', 'false');
        }
    };
    // Check whether the input element have required rule and its value is not empty
    FormValidator.prototype.checkRequired = function (name) {
        if (!this.rules[name][this.required] && !this.inputElement.value.length && !sf.base.isNullOrUndefined(this.infoElement)) {
            this.infoElement.innerHTML = this.inputElement.value;
            this.infoElement.setAttribute('aria-invalid', 'false');
            this.hideMessage(name);
        }
    };
    // Return boolean result if the input have chekcable or submit types
    FormValidator.isCheckable = function (input) {
        var inputType = input.getAttribute('type');
        return inputType && (inputType === 'checkbox' || inputType === 'radio' || inputType === 'submit');
    };
    var FormValidator_1;
    // List of function to validate the rules
    FormValidator.checkValidator = {
        required: function (option) {
            return option.value.length > 0;
        },
        email: function (option) {
            return regex.EMAIL.test(option.value);
        },
        url: function (option) {
            return regex.URL.test(option.value);
        },
        dateIso: function (option) {
            return regex.DATE_ISO.test(option.value);
        },
        tel: function (option) {
            return regex.PHONE.test(option.value);
        },
        creditcard: function (option) {
            return regex.CREDITCARD.test(option.value);
        },
        number: function (option) {
            return !isNaN(Number(option.value)) && option.value.indexOf(' ') === -1;
        },
        digits: function (option) {
            return regex.DIGITS.test(option.value);
        },
        maxLength: function (option) {
            return option.value.length <= option.param;
        },
        minLength: function (option) {
            return option.value.length >= option.param;
        },
        rangeLength: function (option) {
            var param = option.param;
            return option.value.length >= param[0] && option.value.length <= param[1];
        },
        range: function (option) {
            var param = option.param;
            return !isNaN(Number(option.value)) && Number(option.value) >= param[0] && Number(option.value) <= param[1];
        },
        date: function (option) {
            return !isNaN(new Date(option.value).getTime());
        },
        max: function (option) {
            if (!isNaN(Number(option.value))) {
                // Maximum rule validation for number
                return +option.value <= option.param;
            }
            // Maximum rule validation for date
            return new Date(option.value).getTime() <= new Date(JSON.parse(JSON.stringify(option.param))).getTime();
        },
        min: function (option) {
            if (!isNaN(Number(option.value))) {
                // Minimum rule validation for number
                return +option.value >= option.param;
            }
            else if ((option.value).indexOf(',') !== -1) {
                var uNum = (option.value).replace(/,/g, '');
                return parseFloat(uNum) >= option.param;
            }
            else {
                // Minimum rule validation for date
                return new Date(option.value).getTime() >= new Date(JSON.parse(JSON.stringify(option.param))).getTime();
            }
        },
        regex: function (option) {
            return new RegExp(option.param).test(option.value);
        },
        equalTo: function (option) {
            var compareTo = option.formElement.querySelector('#' + option.param);
            option.param = compareTo.value;
            return option.param === option.value;
        },
    };
    __decorate([
        sf.base.Property('')
    ], FormValidator.prototype, "locale", void 0);
    __decorate([
        sf.base.Property('e-hidden')
    ], FormValidator.prototype, "ignore", void 0);
    __decorate([
        sf.base.Property()
    ], FormValidator.prototype, "rules", void 0);
    __decorate([
        sf.base.Property('e-error')
    ], FormValidator.prototype, "errorClass", void 0);
    __decorate([
        sf.base.Property('e-valid')
    ], FormValidator.prototype, "validClass", void 0);
    __decorate([
        sf.base.Property('label')
    ], FormValidator.prototype, "errorElement", void 0);
    __decorate([
        sf.base.Property('div')
    ], FormValidator.prototype, "errorContainer", void 0);
    __decorate([
        sf.base.Property(exports.ErrorOption.Label)
    ], FormValidator.prototype, "errorOption", void 0);
    __decorate([
        sf.base.Event()
    ], FormValidator.prototype, "focusout", void 0);
    __decorate([
        sf.base.Event()
    ], FormValidator.prototype, "keyup", void 0);
    __decorate([
        sf.base.Event()
    ], FormValidator.prototype, "click", void 0);
    __decorate([
        sf.base.Event()
    ], FormValidator.prototype, "change", void 0);
    __decorate([
        sf.base.Event()
    ], FormValidator.prototype, "submit", void 0);
    __decorate([
        sf.base.Event()
    ], FormValidator.prototype, "validationBegin", void 0);
    __decorate([
        sf.base.Event()
    ], FormValidator.prototype, "validationComplete", void 0);
    __decorate([
        sf.base.Event()
    ], FormValidator.prototype, "customPlacement", void 0);
    FormValidator = FormValidator_1 = __decorate([
        sf.base.NotifyPropertyChanges
    ], FormValidator);
    return FormValidator;
}(sf.base.Base));

/**
 * Input box Component
 */

exports.regex = regex;
exports.FormValidator = FormValidator;

return exports;

});
sfBlazor.modules["formvalidator"] = "inputs.FormValidator";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.formvalidator, () => {
    sf.inputs = sf.base.extend({}, sf.inputs, sfformvalidator({}));
});