import { Component, EventHandler, Property, Event, Browser, L10n, EmitType } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, BaseEventArgs } from '@syncfusion/ej2-base';
import { createElement, attributes, addClass, removeClass, detach, closest } from '@syncfusion/ej2-base';
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
    private timeOut: any; // tslint:disable-line
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

    /*NumericTextBox Options */

    /**
     * Gets or Sets the CSS classes to root element of the NumericTextBox which helps to customize the
     * complete UI styles for the NumericTextBox component.
     * @default null
     */
    @Property('')
    public cssClass: string;

    /**
     * Sets the value of the NumericTextBox.
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
     * @default null
     * @aspType object
     * @isGenericType true
     * @blazorDefaultValue EjsBase.GetNumericValue<TValue>("MinValue")
     */
    @Property(-(Number.MAX_VALUE))
    public min: number;

    /**
     * Specifies a maximum value that is allowed a user can enter.
     * For more information on max, refer to
     * [max](../../numerictextbox/getting-started/#range-validation).
     * @default null
     * @aspType object
     * @isGenericType true
     * @blazorDefaultValue EjsBase.GetNumericValue<TValue>("MaxValue")
     */
    @Property(Number.MAX_VALUE)
    public max: number;

    /**
     * Specifies the incremental or decremental step size for the NumericTextBox.
     * For more information on step, refer to
     * [step](../../numerictextbox/getting-started/#range-validation).
     * @default 1
     * @isGenericType true
     * @blazorDefaultValue EjsBase.GetNumericValue<TValue>("Step")
     */
    @Property(1)
    public step: number;

    /**
     * Specifies the width of the NumericTextBox.
     * @default null
     */
    @Property(null)
    public width: number | string;

    /**
     * Gets or sets the string shown as a hint/placeholder when the NumericTextBox is empty.
     * It acts as a label and floats above the NumericTextBox based on the
     * <b><a href="#floatlabeltype" target="_blank">floatLabelType.</a></b>
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };

    /**
     * Specifies whether the up and down spin buttons should be displayed in NumericTextBox.
     * @default true
     */
    @Property(true)
    public showSpinButton: boolean;

    /**
     * Sets a value that enables or disables the readonly state on the NumericTextBox. If it is true, 
     * NumericTextBox will not allow your input.
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * Sets a value that enables or disables the NumericTextBox control.
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Specifies whether to show or hide the clear icon.
     * @default false
     */
    @Property(false)
    public showClearButton: boolean;

    /**
     * Enable or disable persisting NumericTextBox state between page reloads. If enabled, the `value` state will be persisted.
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Specifies the number format that indicates the display format for the value of the NumericTextBox.
     * For more information on formats, refer to
     * [formats](../../numerictextbox/formats/#standard-formats).
     * @default 'n2'
     */
    @Property('n2')
    public format: string;

    /**
     * Specifies the number precision applied to the textbox value when the NumericTextBox is focused.
     * For more information on decimals, refer to
     * [decimals](../../numerictextbox/formats/#precision-of-numbers).
     * @default null
     * @isBlazorNullableType true
     * @blazorDefaultValue 
     * @blazorType int
     */
    @Property(null)
    public decimals: number;

    /**
     * Specifies the currency code to use in currency formatting.
     * Possible values are the ISO 4217 currency codes, such as 'USD' for the US dollar,'EUR' for the euro.
     * @default null
     */
    @Property(null)
    public currency: string;

    /**
     * Specifies the currency code to use in currency formatting.
     * Possible values are the ISO 4217 currency codes, such as 'USD' for the US dollar,'EUR' for the euro.
     * @default null
     * @private
     */
    @Property(null)
    private currencyCode: string;

    /**
     * Specifies a value that indicates whether the NumericTextBox control allows the value for the specified range.
     * * If it is true, the input value will be restricted between the min and max range.
     * The typed value gets modified to fit the range on focused out state.
     * ```html
     * <input type='text' id="numeric"/>
     * ```
     * ```typescript
     * <script>
     *   var numericObj = new NumericTextBox({ min: 10, max: 20, value: 15 });
     *   numericObj.appendTo("#numeric");
     * </script>
     * ```
     * * Else, it allows any value even out of range value,
     * At that time of wrong value entered, the error class will be added to the component to highlight the error.
     * ```html
     * <input type='text' id="numeric"/>
     * ```
     * ```typescript
     * <script>
     *   var numericObj = new NumericTextBox({ strictMode: false, min: 10, max: 20, value: 15 });
     *   numericObj.appendTo("#numeric");
     * </script>
     * ```
     * @default true
     */
    @Property(true)
    public strictMode: boolean;

    /**
     * Specifies whether the decimals length should be restricted during typing.
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
     * @default Never
     */
    @Property('Never')
    public floatLabelType: FloatLabelType;

    /**
     * Triggers when the NumericTextBox component is created.
     * @event
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the NumericTextBox component is destroyed.
     * @event
     * @blazorProperty 'Destroyed'
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers when the value of the NumericTextBox changes.
     * @event
     * @blazorProperty 'ValueChange'
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;

    /**
     * Triggers when the NumericTextBox got focus in.
     * @event
     */
    @Event()
    public focus: EmitType<NumericFocusEventArgs>;

    /**
     * Triggers when the NumericTextBox got focus out.
     * @event
     */
    @Event()
    public blur: EmitType<NumericBlurEventArgs>;


    constructor(options?: NumericTextBoxModel, element?: string | HTMLInputElement) {
        super(options, <HTMLInputElement | string>element);
        this.numericOptions = options;
    }

    protected preRender(): void {
        this.isPrevFocused = false;
        this.decimalSeparator = '.';
        this.intRegExp = new RegExp('/^(-)?(\d*)$/');
        this.isCalled = false;
        let ejInstance: Object = getValue('ej2_instances', this.element);
        this.cloneElement = <HTMLElement>this.element.cloneNode(true);
        removeClass([this.cloneElement], [CONTROL, COMPONENT, 'e-lib']);
        this.angularTagName = null;
        this.formEle = <HTMLFormElement>closest(this.element, 'form');
        if (this.element.tagName === 'EJS-NUMERICTEXTBOX') {
            this.angularTagName = this.element.tagName;
            let input: HTMLElement = this.createElement('input');
            let index: number = 0;
            for (index; index < this.element.attributes.length; index++) {
                let attributeName: string = this.element.attributes[index].nodeName;
                if (attributeName !== 'id') {
                    input.setAttribute(this.element.attributes[index].nodeName, this.element.attributes[index].nodeValue);
                    input.innerHTML = this.element.innerHTML;
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
        attributes(this.element, { 'role': 'spinbutton', 'tabindex': '0', 'autocomplete': 'off', 'aria-live': 'assertive' });
        let localeText: object = { incrementTitle: 'Increment value', decrementTitle: 'Decrement value', placeholder: this.placeholder };
        this.l10n = new L10n('numerictextbox', localeText, this.locale);
        if (this.l10n.getConstant('placeholder') !== '') {
            this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        }
        this.isValidState = true;
        this.inputStyle = null;
        this.inputName = null;
        this.cultureInfo = {};
        this.initCultureInfo();
        this.initCultureFunc();
        this.updateHTMLAttrToElement();
        this.checkAttributes(false);
        this.prevValue = this.value;
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
     * @private
     */
    public render(): void {
        if (this.element.tagName.toLowerCase() === 'input') {
            this.createWrapper();
            if (this.showSpinButton) { this.spinBtnCreation(); }
            this.setElementWidth(this.width);
            if (!this.container.classList.contains('e-input-group')) { this.container.classList.add('e-input-group'); }
            this.changeValue(this.value === null || isNaN(this.value) ? null : this.strictMode ? this.trimValue(this.value) : this.value);
            this.wireEvents();
            if (this.value !== null && !isNaN(this.value)) {
                if (this.decimals) {
                    this.setProperties({ value: this.roundNumber(this.value, this.decimals) }, true);
                }
            }
            if (this.element.getAttribute('value') || this.value) {
                this.element.setAttribute('value', this.element.value);
            }
            this.renderComplete();
        }
    }

    private checkAttributes(isDynamic: boolean): void {
        let attributes: string[] = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['value', 'min', 'max', 'step', 'disabled', 'readonly', 'style', 'name', 'placeholder'];
        for (let prop of attributes) {
            if (!isNullOrUndefined(this.element.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        // tslint:disable-next-line
                        if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['enabled'] === undefined)) || isDynamic) {
                            let enabled: boolean = this.element.getAttribute(prop) === 'disabled' || this.element.getAttribute(prop) === ''
                                || this.element.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, !isDynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['readonly'] === undefined)) || isDynamic) {
                            let readonly: boolean = this.element.getAttribute(prop) === 'readonly' || this.element.getAttribute(prop) === ''
                                || this.element.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !isDynamic);
                        }
                        break;
                    case 'placeholder':
                        // tslint:disable-next-line
                        if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['placeholder'] === undefined)) || isDynamic) {
                            this.setProperties({placeholder: this.element.placeholder}, !isDynamic);
                        }
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['value'] === undefined)) || isDynamic){
                            let setNumber: number = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            this.setProperties(setValue(prop, setNumber, {}), !isDynamic);
                        }
                        break;
                    case 'min':
                        // tslint:disable-next-line
                        if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['min'] === undefined)) || isDynamic) {
                            let minValue: number = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            if (minValue !== null && !isNaN(minValue)) {
                                this.setProperties(setValue(prop, minValue, {}), !isDynamic);
                            }
                        }
                        break;
                    case 'max':
                        // tslint:disable-next-line
                        if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['max'] === undefined)) || isDynamic) {
                            let maxValue: number = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            if (maxValue !== null && !isNaN(maxValue)) {
                                this.setProperties(setValue(prop, maxValue, {}), !isDynamic);
                            }
                        }
                        break;
                    case 'step':
                        // tslint:disable-next-line
                        if (( isNullOrUndefined(this.numericOptions) || (this.numericOptions['step'] === undefined)) || isDynamic) {
                            let stepValue: number = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
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
                    default:
                        let value: number = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                        if ((value !== null && !isNaN(value)) || (prop === 'value')) {
                            this.setProperties(setValue(prop, value, {}), true);
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
        let inputObj: InputObject = Input.createInput(
            {
                element: this.element,
                floatLabelType: this.floatLabelType,
                properties: {
                    readonly: this.readonly,
                    placeholder: this.placeholder,
                    cssClass: this.cssClass,
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
        if (this.readonly) { attributes(this.element, { 'aria-readonly': 'true' }); }
        this.hiddenInput = <HTMLInputElement>(this.createElement('input', { attrs: { type: 'text',
                            'validateHidden': 'true', 'class': HIDDENELEMENT } }));
        this.inputName = this.inputName !== null ? this.inputName : this.element.id;
        this.element.removeAttribute('name');
        attributes(this.hiddenInput, { 'name': this.inputName });
        this.container.insertBefore(this.hiddenInput, this.container.childNodes[1]);
        this.updateDataAttribute(false);
        if (this.inputStyle !== null) { attributes(this.container, { 'style': this.inputStyle }); }
    }
    private updateDataAttribute(isDynamic: boolean) : void {
        let attr: { [key: string]: string; } = {};
        if (!isDynamic) {
            for (let a: number = 0; a < this.element.attributes.length; a++) {
                attr[this.element.attributes[a].name] = this.element.getAttribute(this.element.attributes[a].name);
            }
        } else {
                attr = this.htmlAttributes;
        }
        for (let key of Object.keys(attr)) {
            if (key.indexOf('data') === 0 ) {
                this.hiddenInput.setAttribute(key, attr[key]);
            }
        }
    }
    private updateHTMLAttrToElement(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (let pro of Object.keys(this.htmlAttributes)) {
                if (wrapperAttributes.indexOf(pro) < 0 ) {
                    this.element.setAttribute(pro, this.htmlAttributes[pro]);
                }
            }
        }
    }
    private updateHTMLAttrToWrapper(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (let pro of Object.keys(this.htmlAttributes)) {
                if (wrapperAttributes.indexOf(pro) > -1 ) {
                    if (pro === 'class') {
                        addClass([this.container], this.htmlAttributes[pro].split(' '));
                    } else if (pro === 'style') {
                        let numericStyle: string = this.container.getAttribute(pro);
                        numericStyle = !isNullOrUndefined(numericStyle) ? (numericStyle + this.htmlAttributes[pro]) :
                        this.htmlAttributes[pro];
                        this.container.setAttribute(pro, numericStyle);
                    } else {
                        this.container.setAttribute(pro, this.htmlAttributes[pro]);
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
            'title': this.l10n.getConstant('decrementTitle'),
            'aria-label': this.l10n.getConstant('decrementTitle')
        });
        this.spinUp = Input.appendSpan(SPINICON + ' ' + SPINUP, this.container, this.createElement);
        attributes(this.spinUp, {
            'title': this.l10n.getConstant('incrementTitle'),
            'aria-label': this.l10n.getConstant('incrementTitle')
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
            this.setProperties({ min: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.min)) }, true);
            }
            if (this.max !== (Number.MAX_VALUE)) {
            this.setProperties({ max: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.max)) }, true);
            }
        }
        this.setProperties({ min: this.min > this.max ? this.max : this.min }, true);
        attributes(this.element, { 'aria-valuemin': this.min.toString(), 'aria-valuemax': this.max.toString() });
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
        let value: number = this.isFocused ? this.instance.getNumberParser({ format: 'n' })(this.element.value) : this.value;
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
        if (!(this.inputWrapper.clearButton.classList.contains('e-clear-icon-hide'))) {
            this.clear(e);
        }
        this.isInteract = true;
        this.raiseChangeEvent(e);
    }
    private clear(event: MouseEvent): void {
        this.setProperties({ value: null }, true);
        this.setElementValue('');
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
        let parsedInput: number = this.instance.getNumberParser({ format: 'n' })(this.element.value);
        this.updateValue(parsedInput, event);
    }

    private raiseChangeEvent(event?: Event): void {
        if (this.prevValue !== this.value) {
            let eventArgs: Object = {};
            this.changeEventArgs = { value: this.value, previousValue: this.prevValue, isInteracted: this.isInteract,
                                                                                            isInteraction: this.isInteract, event: event };
            if (event) { this.changeEventArgs.event = event; }
            if (this.changeEventArgs.event === undefined) {
                this.changeEventArgs.isInteracted = false;
                this.changeEventArgs.isInteraction = false;
             }
            merge(eventArgs, this.changeEventArgs);
            this.prevValue = this.value;
            this.isInteract = false;
            this.trigger('change', eventArgs);
        }
    }

    private pasteHandler(): void {
        if (!this.enabled || this.readonly) { return; }
        let beforeUpdate: string = this.element.value;
        setTimeout(() => {
            if (!this.numericRegex().test(this.element.value)) {
                this.setElementValue(beforeUpdate);
            }
        });
    }

    private preventHandler(): void {
        let iOS: boolean = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        setTimeout(() => {
                if (this.element.selectionStart > 0) {
                    let currentPos: number = this.element.selectionStart;
                    let prevPos: number = this.element.selectionStart - 1;
                    let start: number = 0;
                    let ignoreKeyCode: number;
                    let valArray: string[] = this.element.value.split('');
                    let numericObject: Object = getNumericObject(this.locale);
                    let decimalSeparator: string = getValue('decimal', numericObject);
                    ignoreKeyCode = decimalSeparator.charCodeAt(0);
                    if (this.element.value[prevPos] === ' ' && this.element.selectionStart > 0 && !iOS) {
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
                            if (isNullOrUndefined(this.prevVal)) {
                                this.element.value = this.element.value;
                            } else {
                                this.element.value = this.prevVal;
                            }
                            this.element.setSelectionRange(this.element.selectionStart, this.element.selectionStart);
                        }
                    }
                    this.prevVal = this.element.value;
            }
        });
    }
    private keyUpHandler(event: KeyboardEvent): void {
        if (!this.enabled || this.readonly) { return; }
        let iOS: boolean = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        if (!iOS && Browser.isDevice) {
            this.preventHandler();
        }
        let parseValue: number = this.instance.getNumberParser({ format: 'n' })(this.element.value);
        parseValue = parseValue === null || isNaN(parseValue) ? null : parseValue;
        this.hiddenInput.value = parseValue || parseValue === 0 ? parseValue.toString() : null;
        let formElement: Element = closest(this.element, 'form');
        if (formElement) {
            let element: Element = this.element.nextElementSibling;
            let keyupEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    };
    private inputHandler(event: KeyboardEvent): void {
        if (!this.enabled || this.readonly) { return; }
        let iOS: boolean = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        let fireFox: boolean = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if ((fireFox || iOS) && Browser.isDevice) {
            this.preventHandler();
        }
    };

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
    };

    private performAction(value: number, step: number, operation: string): number {
        if (value === null || isNaN(value)) {
            value = 0;
        }
        let updatedValue: number = operation === INCREMENT ? value + step : value - step;
        updatedValue = this.correctRounding(value, step, updatedValue);
        return this.strictMode ? this.trimValue(updatedValue) : updatedValue;
    };

    private correctRounding(value: number, step: number, result: number): number {
        let floatExp: RegExp = new RegExp('[,.](.*)');
        let valueText: string = value.toString();
        let stepText: string = step.toString();
        let floatValue: boolean = floatExp.test(value.toString());
        let floatStep: boolean = floatExp.test(step.toString());
        if (floatValue || floatStep) {
            let valueCount: number = floatValue ? floatExp.exec(value.toString())[0].length : 0;
            let stepCount: number = floatStep ? floatExp.exec(step.toString())[0].length : 0;
            let max: number = Math.max(valueCount, stepCount);
            return value = this.roundValue(result, max);
        }
        return result;
    };

    private roundValue(result: number, precision: number): number {
        precision = precision || 0;
        let divide: number = Math.pow(10, precision);
        return result *= divide, result = Math.round(result) / divide;
    };

    private updateValue(value: number, event?: Event): void {
        if (event) { this.isInteract = true; }
        if (value !== null && !isNaN(value)) {
            if (this.decimals) {
                value = this.roundNumber(value, this.decimals);
            }
        }
        this.changeValue(value === null || isNaN(value) ? null : this.strictMode ? this.trimValue(value) : value);
        this.raiseChangeEvent(event);
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
            let numberOfDecimals: number;
            numberOfDecimals = this.getNumberOfDecimals(value);
            this.setProperties({ value: this.roundNumber(value, numberOfDecimals) }, true);
        }
        this.modifyText();
        if (!this.strictMode) { this.validateState(); }
    };

    private modifyText(): void {
        if (this.value || this.value === 0) {
            let value: string = this.formatNumber();
            let elementValue: string = this.isFocused ? value : this.instance.getNumberFormat(this.cultureInfo)(this.value);
            this.setElementValue(elementValue);
            attributes(this.element, { 'aria-valuenow': value });
            this.hiddenInput.value = this.value.toString();
        } else {
            this.setElementValue('');
            this.element.removeAttribute('aria-valuenow');
            this.hiddenInput.value = null;
        }
    };
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
        let EXPREGEXP: RegExp = new RegExp('[eE][\-+]?([0-9]+)');
        let valueString: string = value.toString();
        if (EXPREGEXP.test(valueString)) {
            let result: RegExpExecArray = EXPREGEXP.exec(valueString);
            if (!isNullOrUndefined(result)) {
                valueString = value.toFixed(Math.min(parseInt(result[1], 10), 20));
            }
        }
        let decimalPart: string = valueString.split('.')[1];
        numberOfDecimals = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
        if (this.decimals !== null) {
            numberOfDecimals = numberOfDecimals < this.decimals ? numberOfDecimals : this.decimals;
        }
        return numberOfDecimals;
    }

    private formatNumber(): string {
        let numberOfDecimals: number;
        numberOfDecimals = this.getNumberOfDecimals(this.value);
        return this.instance.getNumberFormat({
            maximumFractionDigits: numberOfDecimals,
            minimumFractionDigits: numberOfDecimals, useGrouping: false
        })(this.value);
    };

    private trimValue(value: number): number {
        if (value > this.max) {
            return this.max;
        }
        if (value < this.min) {
            return this.min;
        }
        return value;
    };
    private roundNumber(value: number, precision: number): number {
        let result: number = value;
        let decimals: number = precision || 0;
        let result1: string[] = result.toString().split('e');
        result = Math.round(Number(result1[0] + 'e' + (result1[1] ? (Number(result1[1]) + decimals) : decimals)));
        let result2: string[] = result.toString().split('e');
        result = Number(result2[0] + 'e' + (result2[1] ? (Number(result2[1]) - decimals) : -decimals));
        return Number(result.toFixed(decimals));
    };
    private cancelEvent(event: Event): boolean {
        event.preventDefault();
        return false;
    }

    private keyPressHandler(event: KeyboardEvent): boolean {
        if (!this.enabled || this.readonly) { return true; }
        if (!Browser.isDevice && Browser.info.version === '11.0'  && event.keyCode === 13) {
            let parsedInput: number = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput, event);
            return true;
         }
        if (event.which === 0 || event.metaKey || event.ctrlKey || event.keyCode === 8 || event.keyCode === 13) { return true; }
        let currentChar: string = String.fromCharCode(event.which);
        let text: string = this.element.value;
        text = text.substring(0, this.element.selectionStart) + currentChar + text.substring(this.element.selectionEnd);
        if (!this.numericRegex().test(text)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        } else {
            return true;
        }
    };

    private numericRegex(): RegExp {
        let numericObject: Object = getNumericObject(this.locale);
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
        return new RegExp('^(-)?(((\\d+(' + decimalSeparator + '\\d' + fractionRule +
            ')?)|(' + decimalSeparator + '\\d' + fractionRule + ')))?$');
    };

    private mouseWheel(event: MouseWheelEvent): void {
        event.preventDefault();
        let delta: number;
        let rawEvent: WheelEvent = event;
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
        this.focusEventArgs = {event: event, value: this.value, container: this.container };
        this.trigger('focus', this.focusEventArgs);
        if (!this.enabled || this.readonly) { return; }
        this.isFocused = true;
        removeClass([this.container], ERROR);
        this.prevValue = this.value;
        if ((this.value || this.value === 0)) {
            let formatValue: string = this.formatNumber();
            this.setElementValue(formatValue);
            if (!this.isPrevFocused) {
                if (!Browser.isDevice && Browser.info.version === '11.0') {
                    this.element.setSelectionRange(0, formatValue.length);
                } else {
                    let delay: number = (Browser.isDevice && Browser.isIos) ? 600 : 0;
                    setTimeout(
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
    };

    private focusOutHandler(event: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent): void {
        this.blurEventArgs = {event: event, value: this.value, container: this.container };
        this.trigger('blur', this.blurEventArgs);
        if (!this.enabled || this.readonly) { return; }
        if (this.isPrevFocused) {
            event.preventDefault();
            if (Browser.isDevice) {
                let value: string = this.element.value;
                this.element.focus();
                this.isPrevFocused = false;
                let ele: HTMLInputElement = this.element;
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
            let parsedInput: number = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput);
            if (!Browser.isDevice) {
                EventHandler.remove(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel);
            }
        }
        let formElement: Element = closest(this.element, 'form');
        if (formElement) {
            let element: Element = this.element.nextElementSibling;
            let focusEvent: FocusEvent = document.createEvent('FocusEvent');
            focusEvent.initEvent('focusout', false, true);
            element.dispatchEvent(focusEvent);
        }
    };

    private mouseDownOnSpinner(event: MouseEvent): void {
        if (this.isFocused) {
            this.isPrevFocused = true;
            event.preventDefault();
        }
        if (!this.getElementData(event)) { return; }
        let result: boolean = this.getElementData(event);
        let target: HTMLElement = <HTMLElement>event.currentTarget;
        let action: string = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
        EventHandler.add(target, 'mouseleave', this.mouseUpClick, this);
        this.timeOut = setInterval(() => { this.isCalled = true; this.action(action, event); }, 150);
        EventHandler.add(document, 'mouseup', this.mouseUpClick, this);
    }

    private touchMoveOnSpinner(event: MouseEvent): void {
        let target: Element = document.elementFromPoint(event.clientX, event.clientY);
        if (!(target.classList.contains(SPINICON))) {
            clearInterval(this.timeOut);
        }
    }

    private mouseUpOnSpinner(event: MouseEvent): void {
        if (this.isPrevFocused) {
            this.element.focus();
            if (!Browser.isDevice) {
                this.isPrevFocused = false;
            }
        }
        if (!Browser.isDevice) { event.preventDefault(); }
        if (!this.getElementData(event)) { return; }
        let target: HTMLElement = <HTMLElement>event.currentTarget;
        let action: string = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
        EventHandler.remove(target, 'mouseleave', this.mouseUpClick);
        if (!this.isCalled) { this.action(action, event); }
        this.isCalled = false;
        EventHandler.remove(document, 'mouseup', this.mouseUpClick);
        let formElement: Element = closest(this.element, 'form');
        if (formElement) {
            let element: Element = this.element.nextElementSibling;
            let keyupEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
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
        let hiddenInput : HTMLElement = this.hiddenInput;
        this.hiddenInput.remove();
        Input.addFloating(this.element, this.floatLabelType, this.placeholder, this.createElement);
        this.container.insertBefore(hiddenInput, this.container.childNodes[1]);
    }

    private mouseUpClick(event: MouseEvent): void {
        event.stopPropagation();
        clearInterval(this.timeOut);
        this.isCalled = false;
        EventHandler.remove(this.spinUp, 'mouseleave', this.mouseUpClick);
        EventHandler.remove(this.spinDown, 'mouseleave', this.mouseUpClick);
    }

    /**
     * Increments the NumericTextBox value with the specified step value.
     * @param  {number} step - Specifies the value used to increment the NumericTextBox value.
     * if its not given then numeric value will be incremented based on the step property value.
     */
    public increment(step: number = this.step): void {
        this.isInteract = false;
        this.changeValue(this.performAction(this.value, step, INCREMENT));
        this.raiseChangeEvent();
    }
    /**
     * Decrements the NumericTextBox value with specified step value.
     * @param  {number} step - Specifies the value used to decrement the NumericTextBox value.
     * if its not given then numeric value will be decremented based on the step property value.
     */
    public decrement(step: number = this.step): void {
        this.isInteract = false;
        this.changeValue(this.performAction(this.value, step, DECREMENT));
        this.raiseChangeEvent();
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.unwireEvents();
        detach(this.hiddenInput);
        if (this.showSpinButton) {
            this.unwireSpinBtnEvents();
            detach(this.spinUp);
            detach(this.spinDown);
        }
        let attrArray: string[] = ['aria-labelledby', 'role', 'autocomplete', 'aria-readonly',
            'autocorrect', 'aria-disabled', 'aria-placeholder', 'autocapitalize',
            'spellcheck', 'aria-autocomplete', 'tabindex', 'aria-valuemin',
            'aria-valuemax', 'aria-live', 'aria-valuenow', 'aria-invalid'];
        attrArray.forEach((value: string): void => {
            this.element.removeAttribute(value);
        });
        this.element.classList.remove('e-input');
        this.container.insertAdjacentElement('afterend', this.element);
        detach(this.container);
        super.destroy();
    }

    /**
     * Returns the value of NumericTextBox with the format applied to the NumericTextBox.
     */
    public getText(): string {
        return this.element.value;
    }

    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    public focusIn(): void {
        if (document.activeElement !== this.element && this.enabled) {
            this.element.focus();
            addClass([this.container], [NUMERIC_FOCUS]);
        }
    }

    /**
     * Remove the focus from widget, if the widget is in focus state. 
     * @returns void
     */
    public focusOut(): void {
        if (document.activeElement === this.element && this.enabled) {
            this.element.blur();
            removeClass([this.container], [NUMERIC_FOCUS]);
        }
    }

    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['value'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    public onPropertyChanged(newProp: NumericTextBoxModel, oldProp: NumericTextBoxModel): void {
        let elementVal: number;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                    this.setElementWidth(newProp.width);
                    break;
                case 'cssClass':
                    Input.setCssClass(newProp.cssClass, [this.container], oldProp.cssClass);
                    break;
                case 'enabled':
                    Input.setEnabled(newProp.enabled, this.element);
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
                    break;
                case 'placeholder':
                    Input.setPlaceholder(newProp.placeholder, this.element);
                    break;
                case 'step':
                    this.step = newProp.step;
                    this.validateStep();
                    break;
                case 'showSpinButton':
                    if (newProp.showSpinButton) {
                        this.spinBtnCreation();
                    } else {
                        detach(this.spinUp);
                        detach(this.spinDown);
                    }
                    break;
                case 'showClearButton':
                        Input.setClearButton(newProp.showClearButton, this.element, this.inputWrapper, undefined, this.createElement);
                        this.bindClearEvent();
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    this.floatLabelTypeUpdate();
                    break;
                case 'value':
                    this.updateValue(newProp.value);
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
                case 'currency':
                    let propVal: string = getValue(prop, newProp);
                    this.setProperties({ currencyCode: propVal }, true);
                    this.updateCurrency(prop, propVal);
                    break;
                case 'currencyCode':
                    let propValue: string = getValue(prop, newProp);
                    this.setProperties({ currency: propValue }, true);
                    this.updateCurrency('currency', propValue);
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

    /**
     * Gets the component name
     * @private
     */
    public getModuleName(): string {
        return 'numerictextbox';
    }
}

export interface ChangeEventArgs extends BaseEventArgs {
    /** Returns the entered value of the NumericTextBox. */
    value?: number;
    /** Returns the previously entered value of the NumericTextBox. */
    previousValue?: number;
    /** Returns the event parameters from NumericTextBox. */
    event?: Event;
    /** Returns true when the value of NumericTextBox is changed by user interaction. Otherwise, it returns false 
     * @private
     */
    isInteraction?: boolean;
    /** Returns true when the value of NumericTextBox is changed by user interaction. Otherwise, it returns false */
    isInteracted?: boolean;
}

export interface NumericFocusEventArgs extends BaseEventArgs {
    /** Returns the original event arguments. */
    event?: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent;
    /** Returns the value of the NumericTextBox. */
    value: number;
    /** Returns the NumericTextBox container element */
    container?: HTMLElement;
}

export interface NumericBlurEventArgs extends BaseEventArgs {
    /** Returns the original event arguments. */
    event?: MouseEvent | FocusEvent | TouchEvent | KeyboardEvent;
    /** Returns the value of the NumericTextBox. */
    value: number;
    /** Returns the NumericTextBox container element */
    container?: HTMLElement;
}
