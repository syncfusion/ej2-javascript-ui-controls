import { selectAll, select, createElement, Base, EmitType, detach } from '@syncfusion/ej2-base';
import { extend, isNullOrUndefined, IKeyValue, EventHandler } from '@syncfusion/ej2-base';
import { Property, NotifyPropertyChanges, INotifyPropertyChanged, Event, onIntlChange } from '@syncfusion/ej2-base';
import { Internationalization, L10n } from '@syncfusion/ej2-base';
import { FormValidatorModel } from './form-validator-model';

/**
 * global declarations
 */
// tslint:disable-next-line:no-any
export let regex: any = {
    EMAIL: new RegExp('^[A-Za-z0-9._%+-]{1,}@[A-Za-z0-9._%+-]{1,}([.]{1}[a-zA-Z0-9]{2,5}' +
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
export enum ErrorOption {
    /**
     * Defines the error message.
     */
    Message,
    /**
     * Defines the error element type.
     */
    Label
}

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
@NotifyPropertyChanges
export class FormValidator extends Base<HTMLFormElement> implements INotifyPropertyChanged {
    private validated: string[] = [];
    private errorRules: ErrorRule[] = [];
    private allowSubmit: boolean = false;
    private required: string = 'required';
    private infoElement: HTMLElement = null;
    private inputElement: HTMLInputElement = null;
    private selectQuery: string = 'input:not([type=reset]):not([type=button]), select, textarea';
    private inputElements: HTMLInputElement[];
    private l10n: L10n;
    private internationalization: Internationalization;
    // tslint:disable-next-line:no-any
    private localyMessage: any = {};
    /**
     * default locale variable
     */
    @Property('')
    public locale: string;


    /**
     * Ignores input fields based on the class name
     * @default 'e-hidden'
     */
    @Property('e-hidden')
    public ignore: string;

    /**
     * Maps the input fields with validation rules
     * @default {}
     */
    @Property()
    public rules: { [name: string]: { [rule: string]: Object } };

    /**
     * Sets the defined css class to error fields 
     * @default 'e-error'
     */
    @Property('e-error')
    public errorClass: string;

    /**
     * Sets the defined css class to valid fields 
     * @default 'e-valid'
     */
    @Property('e-valid')
    public validClass: string;

    /**
     * Specify HTML element for error
     * @default 'label'
     */
    @Property('label')
    public errorElement: string;

    /**
     * Specify HTML element for error container 
     * @default 'div'
     */
    @Property('div')
    public errorContainer: string;

    /**
     * Option to display the error
     * @default ErrorOption.Label
     * @deprecated
     */
    @Property(ErrorOption.Label)
    public errorOption: ErrorOption;

    /**
     * Triggers when a field's focused  out
     * @event
     */
    @Event()
    public focusout: EmitType<Event>;

    /**
     * Trigger when keyup is triggered in any fields
     * @event
     */
    @Event()
    public keyup: EmitType<KeyboardEvent>;

    /**
     * Triggers when a check box field is clicked
     * @event
     */
    @Event()
    public click: EmitType<Event>;

    /**
     * Trigger when a select/drop-down field is changed
     * @event
     */
    @Event()
    public change: EmitType<Event>;

    /**
     * Triggers before form is being submitted
     * @event
     */
    @Event()
    public submit: EmitType<Event>;

    /**
     * Triggers before validation starts
     * @event
     */
    @Event()
    public validationBegin: EmitType<Object | ValidArgs>;

    /**
     * Triggers after validation is completed
     * @event
     */
    @Event()
    public validationComplete: EmitType<Object | FormEventArgs>;

    /**
     * Assigns the custom function to place the error message in the page.
     * @event
     */
    // tslint:disable
    @Event()
    public customPlacement: EmitType<HTMLElement | any>;

    // tslint:enable

    /**
     * Add validation rules to the corresponding input element based on `name` attribute.   
     * @param {string} name `name` of form field. 
     * @param {Object} rules Validation rules for the corresponding element. 
     * @return {void}
     */
    public addRules(name: string, rules: Object): void {
        if (name) {
            if (this.rules.hasOwnProperty(name)) {
                extend(this.rules[name], rules, {});
            } else {
                this.rules[name] = <IKeyValue>rules;
            }
        }
    }

    /**
     * Remove validation to the corresponding field based on name attribute.   
     * When no parameter is passed, remove all the validations in the form.
     * @param {string} name Input name attribute value.
     * @param {string[]} rules List of validation rules need to be remove from the corresponding element. 
     * @return {void}
     */
    public removeRules(name?: string, rules?: string[]): void {
        if (!name && !rules) {
            this.rules = {};
        } else if (this.rules[name] && !rules) {
            delete this.rules[name];
        } else if (!isNullOrUndefined(this.rules[name] && rules)) {
            for (let i: number = 0; i < rules.length; i++) {
                delete this.rules[name][rules[i]];
            }
        } else {
            return;
        }
    }

    /**
     * Validate the current form values using defined rules.
     * Returns `true` when the form is valid otherwise `false`
     * @param {string} selected - Optional parameter to validate specified element.    
     * @return {boolean} 
     */
    public validate(selected?: string): boolean {
        let rules: string[] = Object.keys(this.rules);
        if (selected && rules.length) {
            this.validateRules(selected);
            //filter the selected element it don't have any valid input element
            return rules.indexOf(selected) !== -1 && this.errorRules.filter((data: ErrorRule) => {
                return data.name === selected;
            }).length === 0;
        } else {
            this.errorRules = [];
            for (let name of rules) {
                this.validateRules(name);
            }
            return this.errorRules.length === 0;
        }
    }

    /**
     * Reset the value of all the fields in form.
     * @return {void}
     */
    public reset(): void {
        this.element.reset();
        this.clearForm();
    }

    /**
     * Get input element by name. 
     * @param {string} name - Input element name attribute value.            
     * @return {HTMLInputElement}
     */
    public getInputElement(name: string): HTMLInputElement {
        this.inputElement = <HTMLInputElement>(select('[name="' + name + '"]', this.element));
        return this.inputElement;
    }

    /**
     * Destroy the form validator object and error elements.      
     * @return {void}
     */
    public destroy(): void {
        this.reset();
        this.unwireEvents();
        this.rules = {};
        let elements: HTMLElement[] = selectAll('.' + this.errorClass + ', .' + this.validClass, this.element);
        for (let element of elements) {
            detach(element);
        }
        super.destroy();
        onIntlChange.off('notifyExternalChange', this.afterLocalization);
    }

    /**
     * Specifies the default messages for validation rules.
     * @default { List of validation message }
     */
    public defaultMessages: { [rule: string]: string } = {
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

    /**
     * @private
     */
    public onPropertyChanged(newProp: FormValidatorModel, oldProp?: FormValidatorModel): void {
        for (let prop of Object.keys(newProp)) {
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
    public localeFunc(): void {
        for (let key of Object.keys(this.defaultMessages)) {
            this.l10n.setLocale(this.locale);
            let value: string = this.l10n.getConstant(key);
            this.localyMessage[key] = value;
        }
    }


    /**
     * @private
     */
    public getModuleName(): string {
        return 'formValidator';
    }
    /**
     * @private
     */
    // tslint:disable-next-line:no-any
    public afterLocalization(args: any): void {
        this.locale = args.locale;
        this.localeFunc();
    }


    // Initializes the FormValidator 
    constructor(element: string | HTMLFormElement, options?: FormValidatorModel) {
        super(options, element);
        if (typeof this.rules === 'undefined') {
            this.rules = {};
        }
        this.l10n = new L10n('formValidator', this.defaultMessages, this.locale);
        if (this.locale) {
            this.localeFunc();
        }
        onIntlChange.on('notifyExternalChange', this.afterLocalization, this);

        element = typeof element === 'string' ? <HTMLFormElement>select(element, document) : element;
        // Set novalidate to prevent default HTML5 form validation
        if (this.element != null) {
            this.element.setAttribute('novalidate', '');
            this.inputElements = <HTMLInputElement[]>selectAll(this.selectQuery, this.element);
            this.createHTML5Rules();
            this.wireEvents();
        } else {
            return undefined;
        }
    }

    private clearForm(): void {
        this.errorRules = [];
        this.validated = [];
        let elements: HTMLElement[] = selectAll(this.selectQuery, this.element);
        for (let element of elements) {
            let input: HTMLInputElement = <HTMLInputElement>element;
            input.removeAttribute('aria-invalid');
            input.classList.remove(this.errorClass);
            if (input.name.length > 0) {
                this.getInputElement(input.name);
                this.getErrorElement(input.name);
                this.hideMessage(input.name);
            }
            input.classList.remove(this.validClass);
        }
    }

    private createHTML5Rules(): void {
        let defRules: string[] = ['required', 'validateHidden', 'regex', 'rangeLength', 'maxLength', 'minLength', 'dateIso', 'digits',
            'pattern', 'data-val-required', 'type', 'data-validation', 'min', 'max', 'range', 'equalTo', 'data-val-minlength-min',
            'data-val-equalto-other', 'data-val-maxlength-max', 'data-val-range-min', 'data-val-regex-pattern', 'data-val-length-max',
            'data-val-creditcard', 'data-val-phone'];
        let acceptedTypes: string[] = ['hidden', 'email', 'url', 'date', 'number', 'tel'];
        for (let input of (this.inputElements)) {
            // Default attribute rules 
            let allRule: { [key: string]: Object } = {};
            for (let rule of defRules) {
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
                            let id: string = input.getAttribute(rule);
                            this.defRule(input, allRule, rule, id);
                            break;
                        default:
                            if (input.getAttribute('data-val') === 'true') {
                                this.annotationRule(input, allRule, rule, input.getAttribute(rule));
                            } else {
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
    }

    private annotationRule(input: HTMLInputElement, ruleCon: { [key: string]: Object }, ruleName: string, value: Object): void {
        let annotationRule: string[] = ruleName.split('-');
        let rulesList: string[] = ['required', 'creditcard', 'phone', 'maxlength', 'minlength', 'range', 'regex', 'equalto'];
        let ruleFirstName: string = annotationRule[annotationRule.length - 1];
        let ruleSecondName: string = annotationRule[annotationRule.length - 2];
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
        } else if (rulesList.indexOf(ruleSecondName) !== -1) {
            switch (ruleSecondName) {
                case 'maxlength':
                    this.defRule(input, ruleCon, 'maxLength', value);
                    break;
                case 'minlength':
                    this.defRule(input, ruleCon, 'minLength', value);
                    break;
                case 'range':
                    let minvalue: string = input.getAttribute('data-val-range-min');
                    let maxvalue: string = input.getAttribute('data-val-range-max');
                    this.defRule(input, ruleCon, 'range', [minvalue, maxvalue]);
                    break;
                case 'equalto':
                    let id: string[] = input.getAttribute(ruleName).split('.');
                    this.defRule(input, ruleCon, 'equalTo', id[id.length - 1]);
                    break;
                case 'regex':
                    this.defRule(input, ruleCon, 'regex', value);
                    break;
            }
        }
    }

    private defRule(input: HTMLInputElement, ruleCon: { [key: string]: Object }, ruleName: string, value: Object): void {
        let message: string = input.getAttribute('data-' + ruleName + '-message');
        let annotationMessage: string = input.getAttribute('data-val-' + ruleName);
        let customMessage: string;
        if (this.rules[input.name] && ruleName !== 'validateHidden' && ruleName !== 'hidden') {
            this.getInputElement(input.name);
            customMessage = this.getErrorMessage(this.rules[input.name][ruleName], ruleName);
        }
        if (message) {
            value = [value, message];
        } else if (annotationMessage) {
            value = [value, annotationMessage];
        } else if (customMessage) {
            value = [value, customMessage];
        }
        ruleCon[ruleName] = value;
    }

    // Wire events to the form elements
    private wireEvents(): void {
        for (let input of (this.inputElements)) {
            if (FormValidator.isCheckable(input)) {
                EventHandler.add(input, 'click', this.clickHandler, this);
            } else if (input.tagName === 'SELECT') {
                EventHandler.add(input, 'change', this.changeHandler, this);
            } else {
                EventHandler.add(input, 'focusout', this.focusOutHandler, this);
                EventHandler.add(input, 'keyup', this.keyUpHandler, this);
            }
        }
        EventHandler.add(this.element, 'submit', this.submitHandler, this);
        EventHandler.add(this.element, 'reset', this.resetHandler, this);
    }

    // UnWire events to the form elements
    private unwireEvents(): void {
        for (let input of (this.inputElements)) {
            EventHandler.clearEvents(input);
        }
        EventHandler.remove(this.element, 'submit', this.submitHandler);
        EventHandler.remove(this.element, 'reset', this.resetHandler);
    }

    // Handle input element focusout event
    private focusOutHandler(e: Event): void {
        this.trigger('focusout', e);
        //FormValidator.triggerCallback(this.focusout, e);
        let element: HTMLInputElement = <HTMLInputElement>e.target;
        if (this.rules[element.name]) {
            if (this.rules[element.name][this.required] || element.value.length > 0) {
                this.validate(element.name);
            } else if (this.validated.indexOf(element.name) === -1) {
                this.validated.push(element.name);
            }
        }
    }

    // Handle input element keyup event
    private keyUpHandler(e: KeyboardEvent): void {
        this.trigger('keyup', e);
        let element: HTMLInputElement = <HTMLInputElement>e.target;
        // List of keys need to prevent while validation
        let excludeKeys: number[] = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];
        if (e.which === 9 && (!this.rules[element.name] || (this.rules[element.name] && !this.rules[element.name][this.required]))) {
            return;
        }
        if (this.validated.indexOf(element.name) !== -1 && this.rules[element.name] && excludeKeys.indexOf(e.which) === -1) {
            this.validate(element.name);
        }
    }

    // Handle input click event
    private clickHandler(e: Event): void {
        this.trigger('click', e);
        let element: HTMLInputElement = <HTMLInputElement>e.target;
        // If element type is not submit allow validation
        if (element.type !== 'submit') {
            this.validate(element.name);
        } else if (element.getAttribute('formnovalidate') !== null) {
            // Prevent form validation, if submit button has formnovalidate attribute
            this.allowSubmit = true;
        }
    }

    // Handle input change event
    private changeHandler(e: Event): void {
        this.trigger('change', e);
        let element: HTMLInputElement = <HTMLInputElement>e.target;
        this.validate(element.name);
    }

    // Handle form submit event
    private submitHandler(e: Event): void {
        this.trigger('submit', e);
        //FormValidator.triggerCallback(this.submit, e);
        // Prevent form submit if validation failed
        if (!this.allowSubmit && !this.validate()) {
            e.preventDefault();
        } else {
            this.allowSubmit = false;
        }
    }

    // Handle form reset
    private resetHandler(): void {
        this.clearForm();
    }

    // Validate each rule based on input element name
    private validateRules(name: string): void {
        if (!this.rules[name]) {
            return;
        }
        let rules: string[] = Object.keys(this.rules[name]);
        let hiddenType: boolean = false;
        let validateHiddenType: boolean = false;
        let vhPos: number = rules.indexOf('validateHidden');
        let hPos: number = rules.indexOf('hidden');
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
            for (let rule of rules) {
                let errorMessage: string = this.getErrorMessage(this.rules[name][rule], rule);
                let errorRule: ErrorRule = { name: name, message: errorMessage };
                let eventArgs: FormEventArgs = {
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
                    } else {
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
                } else {
                    this.hideMessage(name);
                    eventArgs.status = 'success';
                    this.trigger('validationComplete', eventArgs);
                }
            }
        } else {
            return;
        }
    }

    // Update the optional validation status
    private optionalValidationStatus(name: string, refer: FormEventArgs): void {
        if (!this.rules[name][this.required] && !this.inputElement.value.length && !isNullOrUndefined(this.infoElement)) {
            this.infoElement.innerHTML = this.inputElement.value;
            this.infoElement.setAttribute('aria-invalid', 'false');
            refer.status = '';
            this.hideMessage(name);
        }
    }

    // Check the input element whether it's value satisfy the validation rule or not
    private isValid(name: string, rule: string): boolean {
        let params: Object = this.rules[name][rule];
        let param: Object = (params instanceof Array && typeof params[1] === 'string') ? params[0] : params;
        let currentRule: { [key: string]: Object } = <IKeyValue>this.rules[name][rule];
        let args: ValidArgs = { value: this.inputElement.value, param: param, element: this.inputElement, formElement: this.element };
        this.trigger('validationBegin', args);
        if (currentRule && typeof currentRule[0] === 'function') {
            let fn: () => boolean = <() => boolean>currentRule[0];
            return fn.call(this, { element: this.inputElement, value: this.inputElement.value });
        } else if (FormValidator.isCheckable(this.inputElement)) {
            if (rule !== 'required') { return true; }
            return selectAll('input[name=' + name + ']:checked', this.element).length > 0;
        } else {
            return FormValidator.checkValidator[rule](args);
        }
    }

    // Return default error message or custom error message 
    private getErrorMessage(ruleValue: Object, rule: string): string {
        let message: string = this.inputElement.getAttribute('data-' + rule + '-message') ?
            this.inputElement.getAttribute('data-' + rule + '-message') :
            (ruleValue instanceof Array && typeof ruleValue[1] === 'string') ? ruleValue[1] :
                (Object.keys(this.localyMessage).length !== 0) ? this.localyMessage[rule] : this.defaultMessages[rule];
        let formats: string[] = message.match(/{(\d)}/g);
        if (!isNullOrUndefined(formats)) {
            for (let i: number = 0; i < formats.length; i++) {
                let value: string = ruleValue instanceof Array ? ruleValue[i] : ruleValue;
                message = message.replace(formats[i], value);
            }
        }
        return message;
    }

    // Create error element based on name and error message
    private createErrorElement(name: string, message: string, input: HTMLInputElement): void {
        let errorElement: HTMLElement = createElement(this.errorElement, {
            className: this.errorClass,
            innerHTML: message,
            attrs: { for: name }
        });
        // Create message design if errorOption is message
        if (this.errorOption === ErrorOption.Message) {
            errorElement.classList.remove(this.errorClass);
            errorElement.classList.add('e-message');
            errorElement = createElement(this.errorContainer, { className: this.errorClass, innerHTML: errorElement.outerHTML });
        }
        errorElement.id = this.inputElement.name + '-info';

        // Append error message into MVC error message element
        if (this.element.querySelector('[data-valmsg-for="' + input.id + '"]')) {
            this.element.querySelector('[data-valmsg-for="' + input.id + '"]').appendChild(errorElement);
        } else if (input.hasAttribute('data-msg-containerid') === true) {
            // Append error message into custom div element
            let containerId: string = input.getAttribute('data-msg-containerid');
            let divElement: Element = this.element.querySelector('#' + containerId);
            divElement.appendChild(errorElement);
        } else if (this.customPlacement != null) {
            // Call custom placement function if customPlacement is not null
            this.customPlacement.call(this, this.inputElement, errorElement);
        } else {
            this.inputElement.parentNode.insertBefore(errorElement, this.inputElement.nextSibling);
        }
        errorElement.style.display = 'block';
        this.getErrorElement(name);
        this.validated.push(name);
        this.checkRequired(name);
    }

    // Get error element by name
    private getErrorElement(name: string): HTMLElement {
        this.infoElement = <HTMLElement>select(this.errorElement + '.' + this.errorClass, this.inputElement.parentElement);
        if (!this.infoElement) {
            this.infoElement = (<HTMLElement>select(this.errorElement + '.' + this.errorClass + '[for="' + name + '"]', this.element));
        }
        return this.infoElement;
    }

    // Remove existing rule from errorRules object
    private removeErrorRules(name: string): void {
        for (let i: number = 0; i < this.errorRules.length; i++) {
            let rule: ErrorRule = this.errorRules[i];
            if (rule.name === name) {
                this.errorRules.splice(i, 1);
            }
        }
    }

    // Show error message to the input element
    private showMessage(errorRule: ErrorRule): void {
        this.infoElement.style.display = 'block';
        this.infoElement.innerHTML = errorRule.message;
        this.checkRequired(errorRule.name);
    }

    // Hide error message based on input name
    private hideMessage(name: string): void {
        if (this.infoElement) {
            this.infoElement.style.display = 'none';
            this.removeErrorRules(name);
            this.inputElement.classList.add(this.validClass);
            this.inputElement.classList.remove(this.errorClass);
            this.inputElement.setAttribute('aria-invalid', 'false');
        }
    }

    // Check whether the input element have required rule and its value is not empty
    private checkRequired(name: string): void {
        if (!this.rules[name][this.required] && !this.inputElement.value.length && !isNullOrUndefined(this.infoElement)) {
            this.infoElement.innerHTML = this.inputElement.value;
            this.infoElement.setAttribute('aria-invalid', 'false');
            this.hideMessage(name);
        }
    }

    // List of function to validate the rules
    private static checkValidator: Validator = {
        required: (option: ValidArgs): boolean => {
            return option.value.length > 0;
        },
        email: (option: ValidArgs): boolean => {
            return regex.EMAIL.test(option.value);
        },
        url: (option: ValidArgs): boolean => {
            return regex.URL.test(option.value);
        },
        dateIso: (option: ValidArgs): boolean => {
            return regex.DATE_ISO.test(option.value);
        },
        tel: (option: ValidArgs): boolean => {
            return regex.PHONE.test(option.value);
        },
        creditcard: (option: ValidArgs): boolean => {
            return regex.CREDITCARD.test(option.value);
        },
        number: (option: ValidArgs): boolean => {
            return !isNaN(Number(option.value)) && option.value.indexOf(' ') === -1;
        },
        digits: (option: ValidArgs): boolean => {
            return regex.DIGITS.test(option.value);
        },
        maxLength: (option: ValidArgs): boolean => {
            return option.value.length <= option.param;
        },
        minLength: (option: ValidArgs): boolean => {
            return option.value.length >= option.param;
        },
        rangeLength: (option: ValidArgs): boolean => {
            let param: number[] = <number[]>option.param;
            return option.value.length >= param[0] && option.value.length <= param[1];
        },
        range: (option: ValidArgs): boolean => {
            let param: number[] = <number[]>option.param;
            return !isNaN(Number(option.value)) && Number(option.value) >= param[0] && Number(option.value) <= param[1];
        },
        date: (option: ValidArgs): boolean => {
            return !isNaN(new Date(option.value).getTime());
        },
        max: (option: ValidArgs): boolean => {
            if (!isNaN(Number(option.value))) {
                // Maximum rule validation for number
                return +option.value <= option.param;
            }
            // Maximum rule validation for date
            return new Date(option.value).getTime() <= new Date(JSON.parse(JSON.stringify(option.param))).getTime();
        },
        min: (option: ValidArgs): boolean => {
            if (!isNaN(Number(option.value))) {
                // Minimum rule validation for number
                return +option.value >= option.param;
            } else if ((option.value).indexOf(',') !== -1) {
                let uNum: string = (option.value).replace(/,/g, '');
                return parseFloat(uNum) >= option.param;
            } else {
                // Minimum rule validation for date
                return new Date(option.value).getTime() >= new Date(JSON.parse(JSON.stringify(option.param))).getTime();
            }
        },
        regex: (option: ValidArgs): boolean => {
            return new RegExp(<string>option.param).test(option.value);
        },
        equalTo: (option: ValidArgs): boolean => {
            let compareTo: HTMLInputElement = <HTMLInputElement>option.formElement.querySelector('#' + option.param);
            option.param = compareTo.value;
            return option.param === option.value;
        },
    };

    // Return boolean result if the input have chekcable or submit types
    private static isCheckable(input: Element): boolean {
        let inputType: string = input.getAttribute('type');
        return inputType && (inputType === 'checkbox' || inputType === 'radio' || inputType === 'submit');
    }
}

interface Validator {
    [rule: string]: (value: ValidArgs) => boolean;
}

export interface ValidArgs {
    /**
     * Returns the value in input element.
     */
    value: string;
    /**
     * Returns the rule mapped for the input.
     */
    param?: Object;
    /**
     * Returns the input element.
     */
    element?: HTMLElement;
    /**
     * Returns the current form element.
     */
    formElement?: HTMLFormElement;
}

interface ErrorRule {
    name: string;
    message: string;
}

export interface FormEventArgs {
    /**
     * Returns the name of the input element.
     */
    inputName: string;
    /**
     * Returns the error message.
     */
    message: string;
    /**
     * Returns the input element.
     */
    element: HTMLInputElement;
    /**
     * Returns the status input element.
     */
    status?: string;
    /**
     * Returns the error element for corresponding input.
     */
    errorElement?: HTMLElement;
}