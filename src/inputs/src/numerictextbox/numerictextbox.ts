import { Component, EventHandler, Property, Event, Browser, L10n, EmitType, getUniqueID } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, BaseEventArgs } from '@syncfusion/ej2-base';
import { attributes, addClass, removeClass, detach, closest } from '@syncfusion/ej2-base';
import { isNullOrUndefined, getValue, formatUnit, setValue, merge } from '@syncfusion/ej2-base';
import { Internationalization, NumberFormatOptions, getNumericObject } from '@syncfusion/ej2-base';
import { NumericTextBoxModel } from './numerictextbox-model';
import { Input, InputObject, FloatLabelType } from '../input/input';


const ROOT: string = 'e-control-wrapper e-numeric';
const SPINICON: string = 'e-input-group-icon';
const SPINUP: string = 'e-spin-up';
const SPINDOWN: string = 'e-spin-down';
const ERROR: string = 'e-error';
const INCREMENT: string = 'increment';
const DECREMENT: string = 'decrement';
const INTREGEXP: RegExp = new RegExp('^(-)?(\\d*)$');
const DECIMALSEPARATOR: string = '.';
const COMPONENT: string = 'e-numerictextbox';
const CONTROL: string = 'e-control';
const NUMERIC_FOCUS: string = 'e-input-focus';
const HIDDENELEMENT: string = 'e-numeric-hidden';
const wrapperAttributes: string[] = ['title', 'style', 'class'];
let selectionTimeOut: number = 0;

/**
 * Represents the NumericTextBox component that allows the user to enter only numeric values.
 * ```html
 * <input type='text' id="numeric"/>
 * ```
 * ```typescript
 * <script>
 *   var numericObj = new NumericTextBox({ value: 10 });
 *   numericObj.appendTo("#numeric");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class NumericTextBox extends Component<HTMLInputElement> implements INotifyPropertyChanged {

    /* Internal variables */
    private container: HTMLElement;
    private inputWrapper: InputObject;
    private cloneElement: HTMLElement;
    private hiddenInput: HTMLInputElement;
    private spinUp: HTMLElement;
    private spinDown: HTMLElement;
    private formEle: HTMLElement;
    private inputEleValue: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private timeOut: any;
    private prevValue: number;
    private isValidState: boolean;
    private isFocused: boolean;
    private isPrevFocused: boolean;
    private instance: Internationalization;
    private cultureInfo: NumberFormatOptions;
    private inputStyle: string;
    private inputName: string;
    private decimalSeparator: string;
    private angularTagName: string;
    private intRegExp: RegExp;
    private l10n: L10n;
    private isCalled: boolean;
    private prevVal: string;
    private nextEle: string;
    private cursorPosChanged: boolean;
    private changeEventArgs: ChangeEventArgs;
    private focusEventArgs: NumericFocusEventArgs;
    private blurEventArgs: NumericBlurEventArgs;
    private numericOptions: NumericTextBoxModel;
    private isInteract: boolean;
    private serverDecimalSeparator: string;
    private preventChange: boolean = false;
    private elementPrevValue: string;
    private isDynamicChange: boolean = false;
    private inputValue: number;
    private clearButton: HTMLElement;

    /*NumericTextBox Options */

    /**
     * Gets or Sets the CSS classes to root element of the NumericTextBox which helps to customize the
     * complete UI styles for the NumericTextBox component.
     *
     * @default null
     */
    @Property('')
    public cssClass: string;

    /**
     * Sets the value of the NumericTextBox.
     *
     * @default null
     * @aspType object
     * @isGenericType true
     */
    @Property(null)
    public value: number;

    /**
     * Specifies a minimum value that is allowed a user can enter.
     * For more information on min, refer to
     * [min](../../numerictextbox/getting-started/#range-validation).
     *
     * @default null
     * @aspType object
     * @isGenericType true
     * @deprecated
     */
    @Property(-(Number.MAX_VALUE))
    public min: number;

    /**
     * Specifies a maximum value that is allowed a user can enter.
     * For more information on max, refer to
     * [max](../../numerictextbox/getting-started/#range-validation).
     *
     * @default null
     * @aspType object
     * @isGenericType true
     * @deprecated
     */
    @Property(Number.MAX_VALUE)
    public max: number;

    /**
     * Specifies the incremental or decremental step size for the NumericTextBox.
     * For more information on step, refer to
     * [step](../../numerictextbox/getting-started/#range-validation).
     *
     * @default 1
     * @isGenericType true
     */
    @Property(1)
    public step: number;

    /**
     * Specifies the width of the NumericTextBox.
     *
     * @default null
     */
    @Property(null)
    public width: number | string;

    /**
     * Gets or sets the string shown as a hint/placeholder when the NumericTextBox is empty.
     * It acts as a label and floats above the NumericTextBox based on the
     * <b><a href="#floatlabeltype" target="_blank">floatLabelType.</a></b>
     *
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * {% codeBlock src='numerictextbox/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };

    /**
     * Specifies whether the up and down spin buttons should be displayed in NumericTextBox.
     *
     * @default true
     */
    @Property(true)
    public showSpinButton: boolean;

    /**
     * Sets a value that enables or disables the readonly state on the NumericTextBox. If it is true,
     * NumericTextBox will not allow your input.
     *
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * Sets a value that enables or disables the NumericTextBox control.
     *
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Specifies whether to show or hide the clear icon.
     *
     * @default false
     */
    @Property(false)
    public showClearButton: boolean;

    /**
     * Enable or disable persisting NumericTextBox state between page reloads. If enabled, the `value` state will be persisted.
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Specifies the number format that indicates the display format for the value of the NumericTextBox.
     * For more information on formats, refer to
     * [formats](../../numerictextbox/formats/#standard-formats).
     *
     * @default 'n2'
     */
    @Property('n2')
    public format: string;

    /**
     * Specifies the number precision applied to the textbox value when the NumericTextBox is focused.
     * For more information on decimals, refer to
     * [decimals](../../numerictextbox/formats/#precision-of-numbers).
     *
     * @default null
     */
    @Property(null)
    public decimals: number;

    /**
     * Specifies the currency code to use in currency formatting.
     * Possible values are the ISO 4217 currency codes, such as 'USD' for the US dollar,'EUR' for the euro.
     *
     * @default null
     */
    @Property(null)
    public currency: string;

    /**
     * Specifies the currency code to use in currency formatting.
     * Possible values are the ISO 4217 currency codes, such as 'USD' for the US dollar,'EUR' for the euro.
     *
     * @default null
     * @private
     */
    @Property(null)
    private currencyCode: string;

    /**
     * Specifies a value that indicates whether the NumericTextBox control allows the value for the specified range.
     * If it is true, the input value will be restricted between the min and max range.
     * The typed value gets modified to fit the range on focused out state.
     * Else, it allows any value even out of range value,
     * At that time of wrong value entered, the error class will be added to the component to highlight the error.
     * {% codeBlock src='numerictextbox/strictMode/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public strictMode: boolean;

    /**
     * Specifies whether the decimals length should be restricted during typing.
     *
     * @default false
     */
    @Property(false)
    public validateDecimalOnType: boolean;

    /**
     * The <b><a href="#placeholder" target="_blank">placeholder</a></b> acts as a label
     * and floats above the NumericTextBox based on the below values.
     * Possible values are:
     * * `Never` - Never floats the label in the NumericTextBox when the placeholder is available.
     * * `Always` - The floating label always floats above the NumericTextBox.
     * * `Auto` - The floating label floats above the NumericTextBox after focusing it or when enters the value in it.
     *
     * @default Never
     */
    @Property('Never')
    public floatLabelType: FloatLabelType;

    /**
     * Triggers when the NumericTextBox component is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the NumericTextBox component is destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers when the value of the NumericTextBox changes.
     * The change event of the NumericTextBox component will be triggered in the following scenarios:
     * * Changing the previous value using keyboard interaction and then focusing out of the component.
     * * Focusing on the component and scrolling within the input.
     * * Changing the value using the spin buttons.
     * * Programmatically changing the value using the value property.
     *
     * @event change
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;

    /**
     * Triggers when the NumericTextBox got focus in.
     *
     * @event focus
     */
    @Event()
    public focus: EmitType<NumericFocusEventArgs>;

    /**
     * Triggers when the NumericTextBox got focus out.
     *
     * @event blur
     */
    @Event()
    public blur: EmitType<NumericBlurEventArgs>;

    /**
     *
     * @param {NumericTextBoxModel} options - Specifies the NumericTextBox model.
     * @param {string | HTMLInputElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: NumericTextBoxModel, element?: string | HTMLInputElement) {
        super(options, <HTMLInputElement | string>element);
        this.numericOptions = options;
    }

    protected preRender(): void {
        this.isPrevFocused = false;
        this.decimalSeparator = '.';
        // eslint-disable-next-line no-useless-escape
        this.intRegExp = new RegExp('/^(-)?(\d*)$/');
        this.isCalled = false;
        const ejInstance: Object = getValue('ej2_instances', this.element);
        this.cloneElement = <HTMLElement>this.element.cloneNode(true);
        removeClass([this.cloneElement], [CONTROL, COMPONENT, 'e-lib']);
        this.angularTagName = null;
        this.formEle = <HTMLFormElement>closest(this.element, 'form');
        if (this.element.tagName === 'EJS-NUMERICTEXTBOX') {
            this.angularTagName = this.element.tagName;
            const input: HTMLElement = this.createElement('input');
            let index: number = 0;
            for (index; index < this.element.attributes.length; index++) {
                const attributeName: string = this.element.attributes[index as number].nodeName;
                if (attributeName !== 'id' && attributeName !== 'class') {
                    input.setAttribute(this.element.attributes[index as number].nodeName,
                                       this.element.attributes[index as number].nodeValue);
                    input.innerHTML = this.element.innerHTML;
                }
                else if (attributeName === 'class') {
                    input.setAttribute(attributeName, this.element.className.split(' ').filter((item: string) => item.indexOf('ng-') !== 0).join(' '));
                }
            }
            if (this.element.hasAttribute('name')) {
                this.element.removeAttribute('name');
            }
            this.element.classList.remove('e-control', 'e-numerictextbox');
            this.element.appendChild(input);
            this.element = <HTMLInputElement>input;
            setValue('ej2_instances', ejInstance, this.element);

        }
        attributes(this.element, { 'role': 'spinbutton', 'tabindex': '0', 'autocomplete': 'off'});
        const localeText: object = {
            incrementTitle: 'Increment value', decrementTitle: 'Decrement value', placeholder: this.placeholder
        };
        this.l10n = new L10n('numerictextbox', localeText, this.locale);
        if (this.l10n.getConstant('placeholder') !== '') {
            this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        }
        if (!this.element.hasAttribute('id')) {
            this.element.setAttribute('id', getUniqueID('numerictextbox'));
        }
        this.isValidState = true;
        this.inputStyle = null;
        this.inputName = null;
        this.cultureInfo = {};
        this.initCultureInfo();
        this.initCultureFunc();
        this.prevValue = this.value;
        this.updateHTMLAttrToElement();
        this.checkAttributes(false);
        if (this.formEle) {
            this.inputEleValue = this.value;
        }
        this.validateMinMax();
        this.validateStep();
        if (this.placeholder === null) {
            this.updatePlaceholder();
        }
    }

    /**
     * To Initialize the control rendering
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        if (this.element.tagName.toLowerCase() === 'input') {
            this.createWrapper();
            if (this.showSpinButton) {
                this.spinBtnCreation();
            }
            this.setElementWidth(this.width);
            if (!this.container.classList.contains('e-input-group')) {
                this.container.classList.add('e-input-group');
            }
            this.changeValue(this.value === null || isNaN(this.value) ?
                null : this.strictMode ? this.trimValue(this.value) : this.value);
            this.wireEvents();
            if (this.value !== null && !isNaN(this.value)) {
                if (this.decimals) {
                    this.setProperties({ value: this.roundNumber(this.value, this.decimals) }, true);
                }
            }
            if (this.element.getAttribute('value') || this.value) {
                this.element.setAttribute('value', this.element.value);
                this.hiddenInput.setAttribute('value', this.hiddenInput.value);
            }
            this.elementPrevValue = this.element.value;
            if (this.element.hasAttribute('data-val')) {
                this.element.setAttribute('data-val', 'false');
            }
            if (!this.element.hasAttribute('aria-labelledby') && !this.element.hasAttribute('placeholder') && !this.element.hasAttribute('aria-label')) {
                this.element.setAttribute('aria-label', 'numerictextbox');
            }
            if (!isNullOrUndefined(closest(this.element, 'fieldset') as HTMLFieldSetElement) && (closest(this.element, 'fieldset') as HTMLFieldSetElement).disabled) {
                this.enabled = false;
            }
            this.renderComplete();
        }
    }

    private checkAttributes(isDynamic: boolean): void {
        const attributes: string[] = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['value', 'min', 'max', 'step', 'disabled', 'readonly', 'style', 'name', 'placeholder'];
        for (const prop of attributes) {
            if (!isNullOrUndefined(this.element.getAttribute(prop))) {
                switch (prop) {
                case 'disabled':
                    if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['enabled'] === undefined)) || isDynamic) {
                        const enabled: boolean = this.element.getAttribute(prop) === 'disabled' || this.element.getAttribute(prop) === ''
                                || this.element.getAttribute(prop) === 'true' ? false : true;
                        this.setProperties({ enabled: enabled }, !isDynamic);
                    }
                    break;
                case 'readonly':
                    if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['readonly'] === undefined)) || isDynamic) {
                        const readonly: boolean = this.element.getAttribute(prop) === 'readonly' || this.element.getAttribute(prop) === ''
                                || this.element.getAttribute(prop) === 'true' ? true : false;
                        this.setProperties({ readonly: readonly }, !isDynamic);
                    }
                    break;
                case 'placeholder':
                    if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['placeholder'] === undefined)) || isDynamic) {
                        this.setProperties({placeholder: this.element.placeholder}, !isDynamic);
                    }
                    break;
                case 'value':
                    if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['value'] === undefined)) || isDynamic){
                        const setNumber: number = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                        this.setProperties(setValue(prop, setNumber, {}), !isDynamic);
                    }
                    break;
                case 'min':
                    if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['min'] === undefined)) || isDynamic) {
                        const minValue: number = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                        if (minValue !== null && !isNaN(minValue)) {
                            this.setProperties(setValue(prop, minValue, {}), !isDynamic);
                        }
                    }
                    break;
                case 'max':
                    if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['max'] === undefined)) || isDynamic) {
                        const maxValue: number = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                        if (maxValue !== null && !isNaN(maxValue)) {
                            this.setProperties(setValue(prop, maxValue, {}), !isDynamic);
                        }
                    }
                    break;
                case 'step':
                    if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['step'] === undefined)) || isDynamic) {
                        const stepValue: number = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                        if (stepValue !== null && !isNaN(stepValue)) {
                            this.setProperties(setValue(prop, stepValue, {}), !isDynamic);
                        }
                    }
                    break;
                case 'style':
                    this.inputStyle = this.element.getAttribute(prop);
                    break;
                case 'name':
                    this.inputName = this.element.getAttribute(prop);
                    break;
                default: {
                    const value: number = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                    if ((value !== null && !isNaN(value)) || (prop === 'value')) {
                        this.setProperties(setValue(prop, value, {}), true);
                    }
                }
                    break;
                }
            }
        }
    }

    private updatePlaceholder(): void {
        this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
    }

    private initCultureFunc(): void {
        this.instance = new Internationalization(this.locale);
    }

    private initCultureInfo(): void {
        this.cultureInfo.format = this.format;
        if (getValue('currency', this) !== null) {
            setValue('currency', this.currency, this.cultureInfo);
            this.setProperties({ currencyCode: this.currency }, true);
        }
    }

    /* Wrapper creation */
    private createWrapper(): void {
        let updatedCssClassValue: string = this.cssClass;
        if (!isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            updatedCssClassValue = this.getNumericValidClassList(this.cssClass);
        }
        const inputObj: InputObject = Input.createInput(
            {
                element: this.element,
                floatLabelType: this.floatLabelType,
                properties: {
                    readonly: this.readonly,
                    placeholder: this.placeholder,
                    cssClass: updatedCssClassValue,
                    enableRtl: this.enableRtl,
                    showClearButton: this.showClearButton,
                    enabled: this.enabled
                }
            },
            this.createElement
        );
        this.inputWrapper = inputObj;
        this.container = inputObj.container;
        this.container.setAttribute('class', ROOT + ' ' + this.container.getAttribute('class'));
        this.updateHTMLAttrToWrapper();
        if (this.readonly) {
            attributes(this.element, { 'aria-readonly': 'true' });
        }
        this.hiddenInput = <HTMLInputElement>(this.createElement('input', { attrs: { type: 'text',
            'data-validateHidden': 'true', 'aria-label': 'hidden', 'class': HIDDENELEMENT } }));
        this.inputName = this.inputName !== null ? this.inputName : this.element.id;
        this.element.removeAttribute('name');
        if (this.isAngular && this.angularTagName === 'EJS-NUMERICTEXTBOX' && this.cloneElement.id.length > 0) {
            attributes(this.hiddenInput, { 'name': this.cloneElement.id });
        } else {
            attributes(this.hiddenInput, { 'name': this.inputName });
        }
        this.container.insertBefore(this.hiddenInput, this.container.childNodes[1]);
        this.updateDataAttribute(false);
        if (this.inputStyle !== null) {
            attributes(this.container, { 'style': this.inputStyle });
        }
    }
    private updateDataAttribute(isDynamic: boolean) : void {
        let attr: { [key: string]: string } = {};
        if (!isDynamic) {
            for (let a: number = 0; a < this.element.attributes.length; a++) {
                attr[this.element.attributes[a as number].name] = this.element.getAttribute(this.element.attributes[a as number].name);
            }
        } else {
            attr = this.htmlAttributes;
        }
        for (const key of Object.keys(attr)) {
            if (key.indexOf('data') === 0 ) {
                this.hiddenInput.setAttribute(key, attr[`${key}`]);
            }
        }
    }
    private updateHTMLAttrToElement(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (const pro of Object.keys(this.htmlAttributes)) {
                if (wrapperAttributes.indexOf(pro) < 0 ) {
                    this.element.setAttribute(pro, this.htmlAttributes[`${pro}`]);
                }
            }
        }
    }
    private updateCssClass(newClass : string, oldClass : string) : void {
        Input.setCssClass(this.getNumericValidClassList(newClass), [this.container], this.getNumericValidClassList(oldClass));
    }
    private getNumericValidClassList(numericClassName: string): string {
        let result: string = numericClassName;
        if (!isNullOrUndefined(numericClassName) && numericClassName !== '') {
            result = (numericClassName.replace(/\s+/g, ' ')).trim();
        }
        return result;
    }
    private updateHTMLAttrToWrapper(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (const pro of Object.keys(this.htmlAttributes)) {
                if (wrapperAttributes.indexOf(pro) > -1 ) {
                    if (pro === 'class') {
                        const updatedClassValue : string = this.getNumericValidClassList(this.htmlAttributes[`${pro}`]);
                        if (updatedClassValue !== '') {
                            addClass([this.container], updatedClassValue.split(' '));
                        }
                    } else if (pro === 'style') {
                        let numericStyle: string = this.container.getAttribute(pro);
                        numericStyle = !isNullOrUndefined(numericStyle) ? (numericStyle + this.htmlAttributes[`${pro}`]) :
                            this.htmlAttributes[`${pro}`];
                        this.container.setAttribute(pro, numericStyle);
                    } else {
                        this.container.setAttribute(pro, this.htmlAttributes[`${pro}`]);
                    }
                }
            }
        }
    }

    private setElementWidth(width: number | string): void {
        if (!isNullOrUndefined(width)) {
            if (typeof width === 'number') {
                this.container.style.width = formatUnit(width);
            } else if (typeof width === 'string') {
                this.container.style.width = (width.match(/px|%|em/)) ? <string>(width) : <string>(formatUnit(width));
            }
        }
    }

    /* Spinner creation */
    private spinBtnCreation(): void {
        this.spinDown = Input.appendSpan(SPINICON + ' ' + SPINDOWN, this.container, this.createElement);
        attributes(this.spinDown, {
            'title': this.l10n.getConstant('decrementTitle')
        });
        this.spinUp = Input.appendSpan(SPINICON + ' ' + SPINUP, this.container, this.createElement);
        attributes(this.spinUp, {
            'title': this.l10n.getConstant('incrementTitle')
        });
        this.wireSpinBtnEvents();
    }

    private validateMinMax(): void {
        if (!(typeof (this.min) === 'number' && !isNaN(this.min))) {
            this.setProperties({ min: -(Number.MAX_VALUE) }, true);
        }
        if (!(typeof (this.max) === 'number' && !isNaN(this.max))) {
            this.setProperties({ max: Number.MAX_VALUE }, true);
        }
        if (this.decimals !== null) {
            if (this.min !== -(Number.MAX_VALUE)) {
                this.setProperties(
                    { min: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.min)) }, true);
            }
            if (this.max !== (Number.MAX_VALUE)) {
                this.setProperties(
                    { max: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.max)) }, true);
            }
        }
        this.setProperties({ min: this.min > this.max ? this.max : this.min }, true);
        if (this.min !== -(Number.MAX_VALUE)){
            attributes(this.element, { 'aria-valuemin': this.min.toString()});
        }
        if (this.max !== (Number.MAX_VALUE)) {
            attributes(this.element, { 'aria-valuemax': this.max.toString() });
        }
    }

    private formattedValue(decimals: number, value: number): string {
        return this.instance.getNumberFormat({
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals, useGrouping: false
        })(value);
    }

    private validateStep(): void {
        if (this.decimals !== null) {
            this.setProperties({ step: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.step)) }, true);
        }
    }

    private action(operation: string, event: Event): void {
        this.isInteract = true;
        const value: number = this.isFocused ? this.instance.getNumberParser({ format: 'n' })(this.element.value) : this.value;
        this.changeValue(this.performAction(value, this.step, operation));
        this.raiseChangeEvent(event);
    }

    private checkErrorClass(): void {
        if (this.isValidState) {
            removeClass([this.container], ERROR);
        } else {
            addClass([this.container], ERROR);
        }
        attributes(this.element, { 'aria-invalid': this.isValidState ? 'false' : 'true' });
    }

    private bindClearEvent(): void {
        if (this.showClearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
    }
    protected resetHandler(e?: MouseEvent): void {
        e.preventDefault();
        if (!(this.inputWrapper.clearButton.classList.contains('e-clear-icon-hide')) || this.inputWrapper.container.classList.contains('e-static-clear')) {
            this.clear(e);
        }
        this.isInteract = true;
        this.raiseChangeEvent(e);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private clear(event: MouseEvent): void {
        this.setProperties({ value: null }, true);
        this.setElementValue('');
        this.hiddenInput.value = '';
        const formElement: Element = closest(this.element, 'form');
        if (formElement) {
            const element: Element = this.element.nextElementSibling;
            const keyupEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    }

    protected resetFormHandler(): void {
        if (this.element.tagName === 'EJS-NUMERICTEXTBOX') {
            this.updateValue(null);
        } else {
            this.updateValue(this.inputEleValue);
        }
    }

    private setSpinButton(): void {
        if (!isNullOrUndefined(this.spinDown)) {
            attributes(this.spinDown, {
                'title': this.l10n.getConstant('decrementTitle'),
                'aria-label': this.l10n.getConstant('decrementTitle')
            });
        }
        if (!isNullOrUndefined(this.spinUp)) {
            attributes(this.spinUp, {
                'title': this.l10n.getConstant('incrementTitle'),
                'aria-label': this.l10n.getConstant('incrementTitle')
            });
        }
    }

    private wireEvents(): void {
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'blur', this.focusOutHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyDownHandler, this);
        EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        EventHandler.add(this.element, 'input', this.inputHandler, this);
        EventHandler.add(this.element, 'keypress', this.keyPressHandler, this);
        EventHandler.add(this.element, 'change', this.changeHandler, this);
        EventHandler.add(this.element, 'paste', this.pasteHandler, this);
        if (this.enabled) {
            this.bindClearEvent();
            if (this.formEle) {
                EventHandler.add(this.formEle, 'reset', this.resetFormHandler, this);
            }
        }
    }

    private wireSpinBtnEvents(): void {
        /* bind spin button events */
        EventHandler.add(this.spinUp, Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        EventHandler.add(this.spinUp, Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        EventHandler.add(this.spinUp, Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
    }

    private unwireEvents(): void {
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'blur', this.focusOutHandler);
        EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        EventHandler.remove(this.element, 'input', this.inputHandler);
        EventHandler.remove(this.element, 'keydown', this.keyDownHandler);
        EventHandler.remove(this.element, 'keypress', this.keyPressHandler);
        EventHandler.remove(this.element, 'change', this.changeHandler);
        EventHandler.remove(this.element, 'paste', this.pasteHandler);
        if (this.formEle) {
            EventHandler.remove(this.formEle, 'reset', this.resetFormHandler);
        }
    }

    private unwireSpinBtnEvents(): void {
        /* unbind spin button events */
        EventHandler.remove(this.spinUp, Browser.touchStartEvent, this.mouseDownOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchStartEvent, this.mouseDownOnSpinner);
        EventHandler.remove(this.spinUp, Browser.touchEndEvent, this.mouseUpOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchEndEvent, this.mouseUpOnSpinner);
        EventHandler.remove(this.spinUp, Browser.touchMoveEvent, this.touchMoveOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchMoveEvent, this.touchMoveOnSpinner);
    }

    private changeHandler(event: Event): void {
        event.stopPropagation();
        if (!this.element.value.length) {
            this.setProperties({ value: null }, true);
        }
        const parsedInput: number = this.instance.getNumberParser({ format: 'n' })(this.element.value);
        this.updateValue(parsedInput, event);
    }

    private raiseChangeEvent(event?: Event): void {
        this.inputValue = (isNullOrUndefined(this.inputValue) || isNaN(this.inputValue)) ? null : this.inputValue;
        if (this.prevValue !== this.value || this.prevValue !== this.inputValue) {
            const eventArgs: Object = {};
            this.changeEventArgs = { value: this.value, previousValue: this.prevValue, isInteracted: this.isInteract,
                isInteraction: this.isInteract, event: event };
            if (event) {
                this.changeEventArgs.event = event;
            }
            if (this.changeEventArgs.event === undefined) {
                this.changeEventArgs.isInteracted = false;
                this.changeEventArgs.isInteraction = false;
            }
            merge(eventArgs, this.changeEventArgs);
            this.prevValue = this.value;
            this.isInteract = false;
            this.elementPrevValue = this.element.value;
            this.preventChange = false;
            this.trigger('change', eventArgs);
        }
    }

    private pasteHandler(): void {
        if (!this.enabled || this.readonly) {
            return;
        }
        const beforeUpdate: string = this.element.value;
        setTimeout(() => {
            if (!this.numericRegex().test(this.element.value)) {
                this.setElementValue(beforeUpdate);
            }
        });
    }

    private preventHandler(): void {
        const iOS: boolean = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        setTimeout(() => {
            if (this.element.selectionStart > 0) {
                const currentPos: number = this.element.selectionStart;
                const prevPos: number = this.element.selectionStart - 1;
                const start: number = 0;
                const valArray: string[] = this.element.value.split('');
                const numericObject: Object = getNumericObject(this.locale);
                const decimalSeparator: string = getValue('decimal', numericObject);
                const ignoreKeyCode: number = decimalSeparator.charCodeAt(0);
                if (this.element.value[prevPos as number] === ' ' && this.element.selectionStart > 0 && !iOS) {
                    if (isNullOrUndefined(this.prevVal)) {
                        this.element.value = this.element.value.trim();
                    } else if (prevPos !== 0) {
                        this.element.value = this.prevVal;
                    } else if (prevPos === 0) {
                        this.element.value = this.element.value.trim();
                    }
                    this.element.setSelectionRange(prevPos, prevPos);
                } else if (isNaN(parseFloat(this.element.value[this.element.selectionStart - 1])) &&
                        this.element.value[this.element.selectionStart - 1].charCodeAt(0) !== 45) {
                    if ((valArray.indexOf(this.element.value[this.element.selectionStart - 1]) !==
                            valArray.lastIndexOf(this.element.value[this.element.selectionStart - 1]) &&
                            this.element.value[this.element.selectionStart - 1].charCodeAt(0) === ignoreKeyCode) ||
                            this.element.value[this.element.selectionStart - 1].charCodeAt(0) !== ignoreKeyCode) {
                        this.element.value = this.element.value.substring(0, prevPos) +
                            this.element.value.substring(currentPos, this.element.value.length);
                        this.element.setSelectionRange(prevPos, prevPos);
                        if (isNaN(parseFloat(this.element.value[this.element.selectionStart - 1])) && this.element.selectionStart > 0
                                && this.element.value.length) {
                            this.preventHandler();
                        }
                    }
                } else if (isNaN(parseFloat(this.element.value[this.element.selectionStart - 2])) && this.element.selectionStart > 1 &&
                        this.element.value[this.element.selectionStart - 2].charCodeAt(0) !== 45) {
                    if ((valArray.indexOf(this.element.value[this.element.selectionStart - 2]) !==
                            valArray.lastIndexOf(this.element.value[this.element.selectionStart - 2]) &&
                            this.element.value[this.element.selectionStart - 2].charCodeAt(0) === ignoreKeyCode) ||
                            this.element.value[this.element.selectionStart - 2].charCodeAt(0) !== ignoreKeyCode) {
                        this.element.setSelectionRange(prevPos, prevPos);
                        this.nextEle = this.element.value[this.element.selectionStart];
                        this.cursorPosChanged = true;
                        this.preventHandler();
                    }
                }
                if (this.cursorPosChanged === true && this.element.value[this.element.selectionStart] === this.nextEle &&
                        isNaN(parseFloat(this.element.value[this.element.selectionStart - 1]))) {
                    this.element.setSelectionRange(this.element.selectionStart + 1, this.element.selectionStart + 1);
                    this.cursorPosChanged = false;
                    this.nextEle = null;
                }
                if (this.element.value.trim() === '') {
                    this.element.setSelectionRange(start, start);
                }
                if (this.element.selectionStart > 0) {
                    if ((this.element.value[this.element.selectionStart - 1].charCodeAt(0) === 45) && this.element.selectionStart > 1) {
                        if (!isNullOrUndefined(this.prevVal)) {
                            this.element.value = this.prevVal;
                        }
                        this.element.setSelectionRange(this.element.selectionStart, this.element.selectionStart);
                    }
                    if (this.element.value[this.element.selectionStart - 1] === decimalSeparator &&
                        this.decimals === 0 &&
                        this.validateDecimalOnType) {
                        this.element.value = this.element.value.substring(0, prevPos) +
                            this.element.value.substring(currentPos, this.element.value.length);
                    }
                }
                this.prevVal = this.element.value;
            }
        });
    }
    private keyUpHandler(): void {
        if (!this.enabled || this.readonly) {
            return;
        }
        const iOS: boolean = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        if (!iOS && Browser.isDevice) {
            this.preventHandler();
        }
        let parseValue: number = this.instance.getNumberParser({ format: 'n' })(this.element.value);
        parseValue = parseValue === null || isNaN(parseValue) ? null : parseValue;
        this.hiddenInput.value = parseValue || parseValue === 0 ? parseValue.toString() : null;
        const formElement: Element = closest(this.element, 'form');
        if (formElement) {
            const element: Element = this.element.nextElementSibling;
            const keyupEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    }
    private inputHandler(event: KeyboardEvent): void {
        const numerictextboxObj: any = null || this;
        if (!this.enabled || this.readonly) {
            return;
        }
        const iOS: boolean = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        const fireFox: boolean = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if ((fireFox || iOS) && Browser.isDevice) {
            this.preventHandler();
        }
        /* istanbul ignore next */
        if ( this.isAngular
            && this.element.value !== getValue('decimal', getNumericObject(this.locale))
            && this.element.value !== getValue('minusSign', getNumericObject(this.locale))
            && this.numericRegex().test(this.element.value)) {
            let parsedValue: number = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            parsedValue = isNaN(parsedValue) ? null : parsedValue;
            numerictextboxObj.localChange({value: parsedValue});
            this.preventChange = true;
        }
        if (this.isVue) {
            let current: number = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            const previous: number = this.instance.getNumberParser({ format: 'n' })(this.elementPrevValue);
            //EJ2-54963-if type "." or ".0" or "-.0" it converts to "0" automatically when binding v-model
            const nonZeroRegex: RegExp = new RegExp('[^0-9]+$');
            if (nonZeroRegex.test(this.element.value) ||
            ((this.elementPrevValue.indexOf('.') !== -1 || this.elementPrevValue.indexOf('-') !== -1) &&
              this.element.value[this.element.value.length - 1] === '0')) {
                current = this.value;
            }
            const eventArgs: object = {
                event: event,
                value: (current === null || isNaN(current) ? null : current),
                previousValue: (previous === null || isNaN(previous) ? null : previous)
            };
            this.preventChange = true;
            this.elementPrevValue = this.element.value;
            this.trigger('input', eventArgs);
        }
    }

    private keyDownHandler(event: KeyboardEvent): void {
        if (!this.readonly) {
            switch (event.keyCode) {
            case 38:
                event.preventDefault();
                this.action(INCREMENT, event);
                break;
            case 40:
                event.preventDefault();
                this.action(DECREMENT, event);
                break;
            default: break;
            }
        }
    }

    private performAction(value: number, step: number, operation: string): number {
        if (value === null || isNaN(value)) {
            value = 0;
        }
        let updatedValue: number = operation === INCREMENT ? value + step : value - step;
        updatedValue = this.correctRounding(value, step, updatedValue);
        return this.strictMode ? this.trimValue(updatedValue) : updatedValue;
    }

    private correctRounding(value: number, step: number, result: number): number {
        const floatExp: RegExp = new RegExp('[,.](.*)');
        const floatValue: boolean = floatExp.test(value.toString());
        const floatStep: boolean = floatExp.test(step.toString());
        if (floatValue || floatStep) {
            const valueCount: number = floatValue ? floatExp.exec(value.toString())[0].length : 0;
            const stepCount: number = floatStep ? floatExp.exec(step.toString())[0].length : 0;
            const max: number = Math.max(valueCount, stepCount);
            return value = this.roundValue(result, max);
        }
        return result;
    }

    private roundValue(result: number, precision: number): number {
        precision = precision || 0;
        const divide: number = Math.pow(10, precision);
        return result *= divide, result = Math.round(result) / divide;
    }

    private updateValue(value: number, event?: Event): void {
        if (event) {
            this.isInteract = true;
        }
        if (value !== null && !isNaN(value)) {
            if (this.decimals) {
                value = this.roundNumber(value, this.decimals);
            }
        }
        this.inputValue = value;
        if (!(this.isVue && this.element && this.element.hasAttribute('modelvalue') && this.isDynamicChange)) {
            this.changeValue(value === null || isNaN(value) ? null : this.strictMode ? this.trimValue(value) : value);
        }
        /* istanbul ignore next */
        if (!this.isDynamicChange) {
            this.raiseChangeEvent(event);
        }
    }

    private updateCurrency(prop: string, propVal: string): void {
        setValue(prop, propVal, this.cultureInfo);
        this.updateValue(this.value);
    }

    private changeValue(value: number): void {
        if (!(value || value === 0)) {
            value = null;
            this.setProperties({ value: value }, true);
        } else {
            const numberOfDecimals: number = this.getNumberOfDecimals(value);
            this.setProperties({ value: this.roundNumber(value, numberOfDecimals) }, true);
        }
        this.modifyText();
        if (!this.strictMode) {
            this.validateState();
        }
    }

    private modifyText(): void {
        if (this.value || this.value === 0) {
            const value: string = this.formatNumber();
            const elementValue: string = this.isFocused ? value : this.instance.getNumberFormat(this.cultureInfo)(this.value);
            this.setElementValue(elementValue);
            attributes(this.element, { 'aria-valuenow': value });
            if (!isNullOrUndefined(this.hiddenInput)) {
                this.hiddenInput.value = this.value.toString();
                if (this.value !== null && this.serverDecimalSeparator) {
                    this.hiddenInput.value = this.hiddenInput.value.replace('.', this.serverDecimalSeparator);
                }
            }
        } else {
            this.setElementValue('');
            this.element.removeAttribute('aria-valuenow');
            this.hiddenInput.value = null;
        }
    }
    private setElementValue(val: string, element ? : HTMLInputElement): void {
        Input.setValue(val, (element ? element : this.element), this.floatLabelType, this.showClearButton);
    }

    private validateState(): void {
        this.isValidState = true;
        if (this.value || this.value === 0) {
            this.isValidState = !(this.value > this.max || this.value < this.min);
        }
        this.checkErrorClass();
    }

    private getNumberOfDecimals(value: number): number {
        let numberOfDecimals: number;
        // eslint-disable-next-line no-useless-escape
        const EXPREGEXP: RegExp = new RegExp('[eE][\-+]?([0-9]+)');
        let valueString: string = value.toString();
        if (EXPREGEXP.test(valueString)) {
            const result: RegExpExecArray = EXPREGEXP.exec(valueString);
            if (!isNullOrUndefined(result)) {
                valueString = value.toFixed(Math.min(parseInt(result[1], 10), 20));
            }
        }
        const decimalPart: string = valueString.split('.')[1];
        numberOfDecimals = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
        if (this.decimals !== null) {
            numberOfDecimals = numberOfDecimals < this.decimals ? numberOfDecimals : this.decimals;
        }
        return numberOfDecimals;
    }

    private formatNumber(): string {
        const numberOfDecimals: number = this.getNumberOfDecimals(this.value);
        return this.instance.getNumberFormat({
            maximumFractionDigits: numberOfDecimals,
            minimumFractionDigits: numberOfDecimals, useGrouping: false
        })(this.value);
    }

    private trimValue(value: number): number {
        if (value > this.max) {
            return this.max;
        }
        if (value < this.min) {
            return this.min;
        }
        return value;
    }
    private roundNumber(value: number, precision: number): number {
        let result: number = value;
        const decimals: number = precision || 0;
        const result1: string[] = result.toString().split('e');
        result = Math.round(Number(result1[0] + 'e' + (result1[1] ? (Number(result1[1]) + decimals) : decimals)));
        const result2: string[] = result.toString().split('e');
        result = Number(result2[0] + 'e' + (result2[1] ? (Number(result2[1]) - decimals) : -decimals));
        return Number(result.toFixed(decimals));
    }
    private cancelEvent(event: Event): boolean {
        event.preventDefault();
        return false;
    }

    private keyPressHandler(event: KeyboardEvent): boolean {
        if (!this.enabled || this.readonly) {
            return true;
        }
        if (!Browser.isDevice && Browser.info.version === '11.0'  && event.keyCode === 13) {
            const parsedInput: number = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput, event);
            return true;
        }
        if (event.which === 0 || event.metaKey || event.ctrlKey || event.keyCode === 8 || event.keyCode === 13) {
            return true;
        }
        let currentChar: string = String.fromCharCode(event.which);
        const decimalSeparator: string = getValue('decimal', getNumericObject(this.locale));
        const isAlterNumPadDecimalChar: boolean = event.code === 'NumpadDecimal' && currentChar !== decimalSeparator;
        //EJ2-59813-replace the culture decimal separator value with numberpad decimal separator value when culture decimal separator and numberpad decimal separator are different
        if (isAlterNumPadDecimalChar) {
            currentChar = decimalSeparator;
        }
        let text: string = this.element.value;
        text = text.substring(0, this.element.selectionStart) + currentChar + text.substring(this.element.selectionEnd);
        if (!this.numericRegex().test(text)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        } else {
            //EJ2-59813-update the numberpad decimal separator and update the cursor position
            if (isAlterNumPadDecimalChar) {
                const start : number = this.element.selectionStart + 1;
                this.element.value = text;
                this.element.setSelectionRange(start, start);
                event.preventDefault();
                event.stopPropagation();
            }
            return true;
        }
    }

    private numericRegex(): RegExp {
        const numericObject: Object = getNumericObject(this.locale);
        let decimalSeparator: string = getValue('decimal', numericObject);
        let fractionRule: string = '*';
        if (decimalSeparator === DECIMALSEPARATOR) {
            decimalSeparator = '\\' + decimalSeparator;
        }
        if (this.decimals === 0  && this.validateDecimalOnType ) {
            return INTREGEXP;
        }
        if (this.decimals && this.validateDecimalOnType) {
            fractionRule = '{0,' + this.decimals + '}';
        }
        /* eslint-disable-next-line security/detect-non-literal-regexp */
        return new RegExp('^\\s*(-)?(((\\d+(' + decimalSeparator + '\\d' + fractionRule +
            ')?)|(' + decimalSeparator + '\\d' + fractionRule + ')))?$');
    }

    private mouseWheel(event: MouseWheelEvent): void {
        event.preventDefault();
        let delta: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawEvent: any = event;
        if (rawEvent.wheelDelta) {
            delta = rawEvent.wheelDelta / 120;
        } else if (rawEvent.detail) {
            delta = -rawEvent.detail / 3;
        }
        if (delta > 0) {
            this.action(INCREMENT, event);
        } else if (delta < 0) {
            this.action(DECREMENT, event);
        }
        this.cancelEvent(event);
    }

    private focusHandler(event: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent): void {
        clearTimeout(selectionTimeOut);
        this.focusEventArgs = {event: event, value: this.value, container: this.container };
        this.trigger('focus', this.focusEventArgs);
        if (!this.enabled || this.readonly) {
            return;
        }
        this.isFocused = true;
        this.prevValue = this.value;
        if ((this.value || this.value === 0)) {
            const formatValue: string = this.formatNumber();
            this.setElementValue(formatValue);
            if (!this.isPrevFocused) {
                if (!Browser.isDevice && Browser.info.version === '11.0') {
                    this.element.setSelectionRange(0, formatValue.length);
                } else {
                    const delay: number = (Browser.isDevice && Browser.isIos) ? 600 : 0;
                    selectionTimeOut = setTimeout(
                        () => {
                            this.element.setSelectionRange(0, formatValue.length);
                        },
                        delay);
                }
            }
        }
        if (!Browser.isDevice) {
            EventHandler.add(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel, this);
        }
    }

    private focusOutHandler(event: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent): void {
        this.blurEventArgs = {event: event, value: this.value, container: this.container };
        this.trigger('blur', this.blurEventArgs);
        if (!this.enabled || this.readonly) {
            return;
        }
        if (this.isPrevFocused) {
            event.preventDefault();
            if (Browser.isDevice) {
                const value: string = this.element.value;
                this.element.focus();
                this.isPrevFocused = false;
                const ele: HTMLInputElement = this.element;
                setTimeout(
                    () => {
                        this.setElementValue(value, ele);
                    },
                    200);
            }
        } else {
            this.isFocused = false;
            if (!this.element.value.length) {
                this.setProperties({ value: null }, true);
            }
            const parsedInput: number = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput);
            if (!Browser.isDevice) {
                EventHandler.remove(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel);
            }
        }
        const formElement: Element = closest(this.element, 'form');
        if (formElement) {
            const element: Element = this.element.nextElementSibling;
            const focusEvent: FocusEvent = document.createEvent('FocusEvent');
            focusEvent.initEvent('focusout', false, true);
            element.dispatchEvent(focusEvent);
        }
    }

    private mouseDownOnSpinner(event: MouseEvent): void {
        if (this.isFocused) {
            this.isPrevFocused = true;
            event.preventDefault();
        }
        if (!this.getElementData(event)) {
            return;
        }
        this.getElementData(event);
        const target: HTMLElement = <HTMLElement>event.currentTarget;
        const action: string = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
        EventHandler.add(target, 'mouseleave', this.mouseUpClick, this);
        this.timeOut = setInterval(() => {
            this.isCalled = true; this.action(action, event);
        }, 150);
        EventHandler.add(document, 'mouseup', this.mouseUpClick, this);
    }

    private touchMoveOnSpinner(event: MouseEvent | TouchEvent): void {
        let target: Element;
        if (event.type === 'touchmove') {
            const touchEvent: TouchList = (event as TouchEvent).touches;
            target = touchEvent.length && document.elementFromPoint(touchEvent[0].pageX, touchEvent[0].pageY);
        } else {
            target = document.elementFromPoint((event as MouseEvent).clientX, (event as MouseEvent).clientY);
        }
        if (!(target.classList.contains(SPINICON))) {
            clearInterval(this.timeOut);
        }
    }

    private mouseUpOnSpinner(event: MouseEvent): void {
        this.prevValue = this.value;
        if (this.isPrevFocused) {
            this.element.focus();
            if (!Browser.isDevice) {
                this.isPrevFocused = false;
            }
        }
        if (!Browser.isDevice) {
            event.preventDefault();
        }
        if (!this.getElementData(event)) {
            return;
        }
        const target: HTMLElement = <HTMLElement>event.currentTarget;
        const action: string = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
        EventHandler.remove(target, 'mouseleave', this.mouseUpClick);
        if (!this.isCalled) {
            this.action(action, event);
        }
        this.isCalled = false;
        EventHandler.remove(document, 'mouseup', this.mouseUpClick);
        const formElement: Element = closest(this.element, 'form');
        if (formElement) {
            const element: Element = this.element.nextElementSibling;
            const keyupEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    }

    private getElementData(event: MouseEvent): boolean {
        if ((event.which && event.which === 3) || (event.button && event.button === 2)
            || !this.enabled || this.readonly) {
            return false;
        }
        clearInterval(this.timeOut);
        return true;
    }

    private floatLabelTypeUpdate(): void {
        Input.removeFloating(this.inputWrapper);
        const hiddenInput : HTMLElement = this.hiddenInput;
        this.hiddenInput.remove();
        Input.addFloating(this.element, this.floatLabelType, this.placeholder, this.createElement);
        this.container.insertBefore(hiddenInput, this.container.childNodes[1]);
    }

    private mouseUpClick(event: MouseEvent): void {
        event.stopPropagation();
        clearInterval(this.timeOut);
        this.isCalled = false;
        if (this.spinUp) {
            EventHandler.remove(this.spinUp, 'mouseleave', this.mouseUpClick);
        }
        if (this.spinDown) {
            EventHandler.remove(this.spinDown, 'mouseleave', this.mouseUpClick);
        }
    }

    /**
     * Increments the NumericTextBox value with the specified step value.
     *
     * @param {number} step - Specifies the value used to increment the NumericTextBox value.
     * if its not given then numeric value will be incremented based on the step property value.
     * @returns {void}
     */
    public increment(step: number = this.step): void {
        this.isInteract = false;
        this.changeValue(this.performAction(this.value, step, INCREMENT));
        this.raiseChangeEvent();
    }
    /**
     * Decrements the NumericTextBox value with specified step value.
     *
     * @param {number} step - Specifies the value used to decrement the NumericTextBox value.
     * if its not given then numeric value will be decremented based on the step property value.
     * @returns {void}
     */
    public decrement(step: number = this.step): void {
        this.isInteract = false;
        this.changeValue(this.performAction(this.value, step, DECREMENT));
        this.raiseChangeEvent();
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     *
     * @method destroy
     * @returns {void}
     */
    public destroy(): void {
        this.unwireEvents();
        if (this.showClearButton) {
            this.clearButton = document.getElementsByClassName('e-clear-icon')[0] as HTMLElement;
        }
        detach(this.hiddenInput);
        if (this.showSpinButton) {
            this.unwireSpinBtnEvents();
            detach(this.spinUp);
            detach(this.spinDown);
        }
        const attrArray: string[] = ['aria-labelledby', 'role', 'autocomplete', 'aria-readonly',
            'aria-disabled', 'autocapitalize', 'spellcheck', 'aria-autocomplete', 'tabindex',
            'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-invalid'];
        for (let i: number = 0; i < attrArray.length; i++) {
            this.element.removeAttribute(attrArray[i as number]);
        }
        this.element.classList.remove('e-input');
        this.container.insertAdjacentElement('afterend', this.element);
        detach(this.container);
        this.spinUp = null;
        this.spinDown = null;
        this.container = null;
        this.hiddenInput = null;
        this.changeEventArgs = null;
        this.blurEventArgs = null;
        this.focusEventArgs = null;
        this.inputWrapper = null;
        Input.destroy({
            element: this.element,
            floatLabelType: this.floatLabelType,
            properties: this.properties
        }, this.clearButton);
        super.destroy();
    }

    /**
     * Returns the value of NumericTextBox with the format applied to the NumericTextBox.
     *
     * @returns {string} - Returns the formatted value of the NumericTextBox.
     */
    public getText(): string {
        return this.element.value;
    }

    /**
     * Sets the focus to widget for interaction.
     *
     * @returns {void}
     */
    public focusIn(): void {
        if (document.activeElement !== this.element && this.enabled) {
            this.element.focus();
            addClass([this.container], [NUMERIC_FOCUS]);
        }
    }

    /**
     * Remove the focus from widget, if the widget is in focus state.
     *
     * @returns {void}
     */
    public focusOut(): void {
        if (document.activeElement === this.element && this.enabled) {
            this.element.blur();
            removeClass([this.container], [NUMERIC_FOCUS]);
        }
    }

    /**
     * Gets the properties to be maintained in the persisted state.
     *
     * @returns {string} - Returns the persisted data.
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['value'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Calls internally if any of the property value is changed.
     *
     * @param {NumericTextBoxModel} newProp - Returns the dynamic property value of the component.
     * @param {NumericTextBoxModel} oldProp - Returns the previous property value of the component.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: NumericTextBoxModel, oldProp: NumericTextBoxModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'width':
                this.setElementWidth(newProp.width);
                Input.calculateWidth(this.element, this.container);
                break;
            case 'cssClass':
                this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                break;
            case 'enabled':
                Input.setEnabled(newProp.enabled, this.element);
                this.bindClearEvent();
                break;
            case 'enableRtl':
                Input.setEnableRtl(newProp.enableRtl, [this.container]);
                break;
            case 'readonly':
                Input.setReadonly(newProp.readonly, this.element);
                if (this.readonly) {
                    attributes(this.element, { 'aria-readonly': 'true' });
                } else {
                    this.element.removeAttribute('aria-readonly');
                }
                break;
            case 'htmlAttributes':
                this.updateHTMLAttrToElement();
                this.updateHTMLAttrToWrapper();
                this.updateDataAttribute(true);
                this.checkAttributes(true);
                Input.validateInputType(this.container, this.element);
                break;
            case 'placeholder':
                Input.setPlaceholder(newProp.placeholder, this.element);
                Input.calculateWidth(this.element, this.container);
                break;
            case 'step':
                this.step = newProp.step;
                this.validateStep();
                break;
            case 'showSpinButton':
                this.updateSpinButton(newProp);
                break;
            case 'showClearButton':
                this.updateClearButton(newProp);
                break;
            case 'floatLabelType':
                this.floatLabelType = newProp.floatLabelType;
                this.floatLabelTypeUpdate();
                break;
            case 'value':
                this.isDynamicChange = (this.isAngular || this.isVue) && this.preventChange;
                this.updateValue(newProp.value);
                if (this.isDynamicChange) {
                    this.preventChange = false;
                    this.isDynamicChange = false;
                }
                break;
            case 'min':
            case 'max':
                setValue(prop, getValue(prop, newProp), this);
                this.validateMinMax();
                this.updateValue(this.value);
                break;
            case 'strictMode':
                this.strictMode = newProp.strictMode;
                this.updateValue(this.value);
                this.validateState();
                break;
            case 'locale':
                this.initCultureFunc();
                this.l10n.setLocale(this.locale);
                this.setSpinButton();
                this.updatePlaceholder();
                Input.setPlaceholder(this.placeholder, this.element);
                this.updateValue(this.value);
                break;
            case 'currency': {
                const propVal: string = getValue(prop, newProp);
                this.setProperties({ currencyCode: propVal }, true);
                this.updateCurrency(prop, propVal);
            }
                break;
            case 'currencyCode': {
                const propValue: string = getValue(prop, newProp);
                this.setProperties({ currency: propValue }, true);
                this.updateCurrency('currency', propValue);
            }
                break;
            case 'format':
                setValue(prop, getValue(prop, newProp), this);
                this.initCultureInfo();
                this.updateValue(this.value);
                break;
            case 'decimals':
                this.decimals = newProp.decimals;
                this.updateValue(this.value);
            }
        }
    }

    private updateClearButton(newProp: NumericTextBoxModel): void {
        Input.setClearButton(newProp.showClearButton, this.element, this.inputWrapper, undefined, this.createElement);
        this.bindClearEvent();
    }

    private updateSpinButton(newProp: NumericTextBoxModel): void {
        if (newProp.showSpinButton) {
            this.spinBtnCreation();
        } else {
            detach(this.spinUp);
            detach(this.spinDown);
        }
    }

    /**
     * Gets the component name
     *
     * @returns {string} Returns the component name.
     * @private
     */
    public getModuleName(): string {
        return 'numerictextbox';
    }
}

export interface ChangeEventArgs extends BaseEventArgs {
    /** Returns the entered value of the NumericTextBox.
     *
     * @isGenericType true
     */
    value?: number
    /** Returns the previously entered value of the NumericTextBox.
     *
     * @isGenericType true
     */
    previousValue?: number
    /** Returns the event parameters from NumericTextBox. */
    event?: Event
    /** Returns true when the value of NumericTextBox is changed by user interaction. Otherwise, it returns false
     *
     * @private
     */
    isInteraction?: boolean
    /** Returns true when the value of NumericTextBox is changed by user interaction. Otherwise, it returns false */
    isInteracted?: boolean
}

export interface NumericFocusEventArgs extends BaseEventArgs {
    /** Returns the original event arguments. */
    event?: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent
    /** Returns the value of the NumericTextBox.
     *
     * @isGenericType true
     */
    value: number
    /** Returns the NumericTextBox container element */
    container?: HTMLElement
}

export interface NumericBlurEventArgs extends BaseEventArgs {
    /** Returns the original event arguments. */
    event?: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent
    /** Returns the value of the NumericTextBox.
     *
     * @isGenericType true
     */
    value: number
    /** Returns the NumericTextBox container element */
    container?: HTMLElement
}
