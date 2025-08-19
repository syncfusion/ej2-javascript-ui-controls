import { INotifyPropertyChanged, NotifyPropertyChanges, Component, Property, getUniqueID, isNullOrUndefined, addClass, attributes, removeClass, remove, EmitType, Event, EventHandler } from '@syncfusion/ej2-base';
import { OtpInputModel } from './otp-input-model';

const INPUTFIELD: string = 'e-otp-input-field';
const RTL: string = 'e-rtl';

/**
 * Specifies the type of input for the Otp (One-Time Password) input component.
 */
export enum OtpInputType {
    /**
     * Specifies the type of input to be number for the Otp input.
     */
    Number = 'number',
    /**
     * Specifies the type of input to be text for the Otp input.
     */
    Text = 'text',
    /**
     * Specifies the type of input to be password for the Otp input.
     */
    Password = 'password'
}

/**
 * Specifies the style variant for the Otp (One-Time Password) input component.
 */
export enum OtpInputStyle {
    /**
     * Specifies the style of the Otp input to be outlined.
     */
    Outlined = 'outlined',
    /**
     * Specifies the style of the Otp input to be underlined.
     */
    Underlined = 'underlined',
    /**
     * Specifies the style of the Otp input to be filled.
     */
    Filled = 'filled',
}

/**
 * Enum for the case transformation options for OTP input text.
 *
 * @readonly
 * @enum {string}
 */
export enum TextTransform {
    /**
     * No case transformation. The input text remains unchanged.
     */
    None = 'none',
    /**
     * Convert the input text to uppercase.
     */
    Uppercase = 'uppercase',
    /**
     * Convert the input text to lowercase.
     */
    Lowercase = 'lowercase',
}

/**
 * Provides information about valueChanged event callback
 */
export interface OtpChangedEventArgs {
    /**
     * Provides the Otp input container element.
     */
    element: HTMLElement;

    /**
     * Provides the original event.
     */
    event: Event;

    /**
     * Provides whether the change is triggered by user interaction.
     */
    isInteracted: boolean;

    /**
     * Provides the previous value of the Otp input.
     */
    previousValue: string | number;

    /**
     * Provides the current value of the Otp input.
     */
    value: string | number;
}

/**
 * Provides information about focus event callback
 */
export interface OtpFocusEventArgs {
    /**
     * Provides the Otp input container element.
     */
    element: HTMLElement;

    /**
     * Provides the original event.
     */
    event: Event;

    /**
     * Provides whether the change is triggered by user interaction.
     */
    isInteracted: boolean;

    /**
     * Provides the current value of the Otp input.
     */
    value: string | number;

    /**
     * The index of the OTP input field that is currently focused.
     */
    index: number;
}

/**
 * Provides information about input event callback
 */
export interface OtpInputEventArgs {
    /**
     * Provides the Otp input container element.
     */
    element: HTMLElement;

    /**
     * Provides the original event.
     */
    event: Event;

    /**
     * Provides the previous value of the Otp input.
     */
    previousValue: string | number;

    /**
     * Provides the current value of the Otp input.
     */
    value: string | number;

    /**
     * The index of the OTP input field that is currently focused.
     */
    index: number;
}

/**
 * Represents the Otp component that allows the user to enter the otp values.
 * ```html
 * <div id='OTPInput'></div>
 * ```
 * ```typescript
 * <script>
 *   var OtpinputObj = new OtpInput();
 *   OtpinputObj.appendTo('#OTPInput');
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class OtpInput extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Specifies the length of the Otp (One-Time Password) to be entered by the user.
     * This determines the number of input fields in the Otp Input.
     *
     * {% codeBlock src='otp-input/length/index.md' %}{% endcodeBlock %}
     *
     * @default 4
     */
    @Property(4)
    public length: number;

    /**
     * Specifies the value of the Otp (One-Time Password) input.
     * This can be a string or a number, representing the Otp value entered by the user.
     *
     * {% codeBlock src='otp-input/value/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @aspType string
     */
    @Property('')
    public value: string | number;

    /**
     * Specifies the input type of the Otp.
     *
     * {% codeBlock src='otp-input/type/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default OtpInputType.Number
     * @asptype OtpInputType
     */
    @Property(OtpInputType.Number)
    public type: string | OtpInputType;

    /**
     * Specifies the separator used to separate each input field in the Otp Input component.
     * The separator is displayed between each input field.
     *
     * {% codeBlock src='otp-input/separator/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Property('')
    public separator: string;

    /**
     * Specifies the text that is shown as a hint/placeholder until the user focuses on or enters a value in the Otp Input.
     * If a single text is provided, it will be used for all input fields; otherwise, each text letter will be used for each field.
     *
     * {% codeBlock src='otp-input/placeholder/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    @Property('')
    public placeholder: string;

    /**
     * Specifies the style variant for the input fields in the Otp Input component.
     *
     * {% codeBlock src='otp-input/stylingMode/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default OtpInputStyle.Outlined
     * @asptype OtpInputStyle
     */
    @Property(OtpInputStyle.Outlined)
    public stylingMode: string | OtpInputStyle;

    /**
     * Specifies whether the Otp input component is disabled.
     * When set to true, the component is disabled and user input is not allowed.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines one or more CSS classes that can be used to customize the appearance of the Otp (One-Time Password) input component.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies whether the OTP input field should automatically receive focus when the component is rendered.
     *
     * @type {boolean}
     * @default false
     */
    @Property(false)
    public autoFocus: boolean;

    /**
     * Specifies the case transformation for the OTP input text.
     *
     * Valid values are:
     * - `TextTransform.Uppercase` for uppercase transformation.
     * - `TextTransform.Lowercase` for lowercase transformation.
     * - `TextTransform.None` for no transformation.
     *
     * @isenumeration true
     * @asptype TextTransform
     * @type {TextTransform}
     * @default TextTransform.None
     */
    @Property(TextTransform.None)
    public textTransform: string | TextTransform;

    /**
     * Specifies additional HTML attributes to be applied to the Otp (One-Time Password) input component.
     *
     * {% codeBlock src='otp-input/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };

    /**
     * Defines the ARIA-label attribute for each input field in the Otp (One-Time Password) input component.
     * Each string in the array corresponds to the ARIA-label attribute for each input field.
     *
     * {% codeBlock src='otp-input/ariaLabels/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Property([])
    public ariaLabels: string[];

    /**
     * Event triggers after the creation of the Otp Input.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Event triggers after the value is changed and the Otp input is focused out.
     *
     * @event change
     */
    @Event()
    public valueChanged: EmitType<OtpChangedEventArgs>;

    /**
     * Event triggers when the Otp input is focused.
     *
     * @event focus
     */
    @Event()
    public focus: EmitType<OtpFocusEventArgs>;

    /**
     * Event triggers when the Otp input is focused out.
     *
     * @event blur
     */
    @Event()
    public blur: EmitType<OtpFocusEventArgs>;

    /**
     * Event triggers each time when the value of each Otp input is changed.
     *
     * @event input
     */
    @Event()
    public input: EmitType<OtpInputEventArgs>;

    /* Private variables */
    private inputs: HTMLInputElement[] = [];
    private previousValue: string = '';
    private hiddenInputEle: HTMLInputElement;
    private separatorElements: HTMLSpanElement[] = [];
    private shouldFireFocus: boolean = true;
    private shouldFireBlur: boolean = true;
    private isFocusInCalled: boolean = false;
    private isFocusOutCalled: boolean = false;

    constructor(options?: OtpInputModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string> element);
    }

    protected preRender(): void {
        if (!this.element.id) {
            this.element.id = getUniqueID('e-' + this.getModuleName());
        }
    }

    public render(): void {
        this.initialize();
    }

    private initialize(): void {
        attributes(this.element, { 'role': 'group' });
        this.renderInputs();
        this.renderSeparator(1, this.inputs.length);
        this.addPlaceHolder();
        this.updateCssClass(this.cssClass);
        this.updateVariantClass();
        this.updateAriaLabel(this.ariaLabels);
        this.setElementAttributes(this.htmlAttributes, this.element);
        if (this.enableRtl) {
            this.element.classList.add(RTL);
        }
        this.previousValue = this.value.toString();
        if (this.autoFocus) { this.focusIn(); }
    }

    private renderInputs(): void {
        this.hiddenInputEle = this.createElement('input', {
            id: 'otpInput_hidden',
            attrs: {
                name: this.element.id,
                type: 'hidden',
                value: this.type === 'number' ? this.value.toString().replace(/\D/g, '') : this.value.toString(),
                autoComplete: 'off'
            }
        });
        this.element.appendChild(this.hiddenInputEle);
        for (let i: number = 0; i < this.length; i++) {
            this.createOtpInput(i);
        }
    }

    private createOtpInput(index: number): void {
        const valueContainer: string[] | undefined = this.getDefaultValue();
        let inputValue: string = '';
        if (valueContainer) {
            const valueAtIndex: string = valueContainer[parseInt(index.toString(), 10)];
            if (this.type === 'number') {
                if (!isNaN(Number(valueAtIndex))) {
                    inputValue = valueAtIndex;
                }
            } else {
                inputValue = valueAtIndex || '';
            }
        }
        const inputEle: HTMLInputElement = this.createElement('input', {
            id: `${this.element.id}-${index + 1}`,
            className: INPUTFIELD + ' ' + 'e-input',
            attrs: {
                maxlength: '1',
                type: this.type,
                inputmode: this.htmlAttributes['inputmode'] || (this.type === 'number' ? 'numeric' : 'text')
            }
        });
        if (this.disabled) {
            inputEle.setAttribute('disabled', 'disabled');
        }
        this.element.appendChild(inputEle);
        this.inputs.push(inputEle);
        if (inputValue) {
            inputEle.value = inputValue;
        }
        this.wireEvents(inputEle, index);
    }

    private handleWheelEvent = (e: WheelEvent): void => {
        e.preventDefault();
    };

    private renderSeparator(index: number, length: number): void {
        if (this.separator.length > 0) {
            for (let i: number = index; i < length; i++) {
                const separatorElement: HTMLSpanElement = this.createElement('span', {
                    className: 'e-otp-separator'
                });
                separatorElement.textContent = this.separator;
                this.separatorElements.push(separatorElement);
                this.element.insertBefore(separatorElement, this.inputs[parseInt(i.toString(), 10)]);
            }
        }
    }

    private updateSeparatorValue(): void {
        if (this.separator === '') {
            this.separatorElements.forEach((element: HTMLSpanElement) => remove(element));
            this.separatorElements = [];
        } else {
            this.separatorElements.forEach((element: HTMLSpanElement) => {
                element.textContent = this.separator;
            });
        }
    }

    private addPlaceHolder(): void {
        for (let i: number = 0; i < this.inputs.length; i++) {
            const placeholderValue: string = this.placeholder.length <= 1 ? this.placeholder : this.placeholder.charAt(i);
            this.setElementAttributes({ 'placeholder':  placeholderValue}, this.inputs[parseInt(i.toString(), 10)]);
        }
    }

    private updateInputType(inputType: string): void {
        const inputMode: string = this.htmlAttributes['inputmode'] || (inputType === 'number' ? 'numeric' : 'text');
        this.inputs.forEach((input: HTMLInputElement) => {
            input.type = inputType;
            input.setAttribute('inputmode', inputMode);
        });
    }

    private getDefaultValue (): string[] | undefined {
        let extractedValue: string = typeof this.value === 'number' ? this.value.toString() : this.value;
        if (this.textTransform) {
            extractedValue = this.getTransformedText(extractedValue);
        }
        // To remove the white space if present.
        const value: string = extractedValue.replace(/\s/g, '');
        return value.length > 0 ? value.split('') : undefined;
    }

    private getTransformedText(transformingText: string): string {
        const transformedText: string = this.textTransform.toLowerCase() === TextTransform.Lowercase ? transformingText.toLowerCase() :
            this.textTransform.toLowerCase() === TextTransform.Uppercase ? transformingText.toUpperCase() : transformingText;
        return transformedText;
    }

    private handleInputChange(index: number, event: KeyboardEvent): void {
        const currentInputElement: HTMLInputElement = this.inputs[parseInt(index.toString(), 10)];
        if (currentInputElement && index < this.length - 1 && currentInputElement.value.length > 0) {
            const nextInputElement: HTMLInputElement = this.inputs[parseInt(index.toString(), 10) + 1];
            this.shouldFireFocus = this.shouldFireBlur = false;
            nextInputElement.focus();
            if (nextInputElement && nextInputElement.value.length > 0) {
                nextInputElement.select();
            }
        }
        const target: HTMLInputElement = event.target as HTMLInputElement;
        if (target.value.length > 1) {
            target.value = target.value.slice(0, 1);
        }
        if (this.textTransform) {
            target.value = this.getTransformedText(target.value);
        }
        this.triggerInputEvent(index, event);
        this.triggerValuechanged(event, true);
    }

    private handleKeyAction(index: number, event: KeyboardEvent): void {
        if (event.key.length > 1 && !(
            (index === 0 && event.key === 'Backspace') ||
            (index === this.length - 1 && event.key === 'Delete'))) {
            this.shouldFireFocus = this.shouldFireBlur = false;
        }
        const currentInputElement: HTMLInputElement = this.inputs[parseInt(index.toString(), 10)];
        const previousInputElement: HTMLInputElement = this.inputs[parseInt(index.toString(), 10) - 1];
        const nextInputElement: HTMLInputElement = this.inputs[parseInt(index.toString(), 10) + 1];
        if (event.key === 'Delete') {
            let value: string = '';
            if (currentInputElement.value.length > 0) {
                value = currentInputElement.value;
                currentInputElement.value = '';
            }
            else if (index !== this.inputs.length - 1) {
                value = nextInputElement.value;
                nextInputElement.value = '';
                nextInputElement.focus();
            }
            if (value.length > 0){
                this.triggerInputEvent(index, event);
            }
        }
        else if (event.key === 'Backspace') {
            if (index !== 0 && currentInputElement.value.length === 0) {
                const previousValue: string = previousInputElement.value;
                previousInputElement.value = '';
                previousInputElement.focus();
                if (previousValue.length > 0) {
                    this.triggerInputEvent(index, event);
                }
            }
        }
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            if (event.key === 'ArrowLeft' && index > 0) {
                previousInputElement.focus();
                previousInputElement.select();
            }
            else if (event.key === 'ArrowRight' && index < this.inputs.length - 1) {
                nextInputElement.focus();
                nextInputElement.select();
            }
            event.preventDefault();
        }
        else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
        }
        else if (event.key !== 'Tab' && !event.shiftKey && !event.ctrlKey) {
            if (this.type === 'number' && (/\D/.test(event.key.toLocaleLowerCase()))) {
                event.preventDefault();
            }
        }
    }

    private handleSelection(index: number): void {
        const currentInputElement: HTMLInputElement = this.inputs[parseInt(index.toString(), 10)];
        if (currentInputElement.value) {
            currentInputElement.select();
        }
    }

    private handleFocus(index: number, event: MouseEvent | TouchEvent | KeyboardEvent): void {
        addClass([this.inputs[parseInt(index.toString(), 10)]], 'e-otp-input-focus');
        if (this.shouldFireFocus) {
            const eventArgs: OtpFocusEventArgs = {
                element: this.element,
                event: event,
                index: index,
                isInteracted: this.isFocusInCalled ? false : true,
                value: this.value
            };
            this.trigger('focus', eventArgs);
        }
        this.shouldFireFocus = true;
    }

    private handleBlur(index: number, event: MouseEvent | TouchEvent | KeyboardEvent): void {
        removeClass([this.inputs[parseInt(index.toString(), 10)]], 'e-otp-input-focus');
        if (this.shouldFireBlur) {
            const eventArgs: OtpFocusEventArgs = {
                element: this.element,
                event: event,
                value: this.value,
                index: index,
                isInteracted: this.isFocusOutCalled ? false : true
            };
            this.trigger('blur', eventArgs);
        }
        this.shouldFireBlur = true;
    }

    private handlePaste(index: number, event: ClipboardEvent): void {
        const clipboardData: DataTransfer = event.clipboardData;
        if (clipboardData) {
            const pastedText: string = clipboardData.getData('text');
            const pastedValues: string[] = pastedText.split('');
            let pastedValueIndex: number = 0;
            for (let i: number = index; i < this.inputs.length; i++) {
                if (pastedValues.length > 0 && pastedValues[parseInt(pastedValueIndex.toString(), 10)]) {
                    this.inputs[parseInt(i.toString(), 10)].value = pastedValues[parseInt(pastedValueIndex.toString(), 10)];
                    pastedValueIndex++;
                    this.updateValueProperty();
                }
            }
            this.focusIn();
            this.triggerValuechanged(event, true);
        }
    }

    private triggerInputEvent (index: number, event: KeyboardEvent): void {
        const previousValue: string = this.value.toString();
        this.updateValueProperty();
        const inputEventArgs: OtpInputEventArgs = {
            element: this.element,
            event: event,
            previousValue: previousValue,
            value: this.value.toString(),
            index: index
        };
        this.trigger('input', inputEventArgs);
    }

    private triggerValuechanged (event?: MouseEvent | TouchEvent | KeyboardEvent | ClipboardEvent, isInteracted?: boolean): void {
        if (this.length === this.value.toString().length) {
            if (this.previousValue !== this.value) {
                const eventArgs: OtpChangedEventArgs = {
                    element: this.element,
                    event: event,
                    isInteracted: isInteracted ? isInteracted : false,
                    previousValue: this.previousValue,
                    value: this.value
                };
                this.trigger('valueChanged', eventArgs);
                this.previousValue = this.value.toString();
            }
        }
    }

    private wireEvents (inputEle: HTMLInputElement, index: number): void {
        EventHandler.add(inputEle, 'focus', this.handleFocus.bind(this, index), this);
        EventHandler.add(inputEle, 'blur', this.handleBlur.bind(this, index), this);
        EventHandler.add(inputEle, 'input', this.handleInputChange.bind(this, index), this);
        EventHandler.add(inputEle, 'keydown', this.handleKeyAction.bind(this, index), this);
        EventHandler.add(inputEle, 'click', this.handleSelection.bind(this, index), this);
        EventHandler.add(inputEle, 'paste', this.handlePaste.bind(this, index), this);
        EventHandler.add(inputEle, 'wheel', this.handleWheelEvent, this);
    }

    private unWireEvents (): void {
        for (let i: number = 0; i < this.inputs.length; i++) {
            const currentInputElement: HTMLInputElement = this.inputs[parseInt(i.toString(), 10)];
            EventHandler.remove(currentInputElement, 'focus', this.handleFocus.bind(this, i));
            EventHandler.remove(currentInputElement, 'blur', this.handleBlur.bind(this, i));
            EventHandler.remove(currentInputElement, 'input', this.handleInputChange.bind(this, i));
            EventHandler.remove(currentInputElement, 'keydown', this.handleKeyAction.bind(this, i));
            EventHandler.remove(currentInputElement, 'click', this.handleSelection.bind(this, i));
            EventHandler.remove(currentInputElement, 'paste', this.handlePaste.bind(this, i));
            EventHandler.remove(currentInputElement, 'wheel', this.handleWheelEvent);
        }
    }

    private updateValueProperty(): void {
        let value: string = '';
        this.inputs.forEach((input: HTMLInputElement) => {
            value += input.value;
        });
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.value = typeof this.value === 'number' ? parseInt(value, 10) : value;
        this.isProtectedOnChange = prevOnChange;
        this.hiddenInputEle.value = this.value.toString();
    }

    private updateInputValue(previousValue: string | number): void {
        let stringifiedValue: string = this.value.toString();
        if (this.textTransform) {
            stringifiedValue = this.getTransformedText(stringifiedValue);
        }
        const previousStringValue: string = previousValue.toString();
        for (let i: number = 0; i < this.inputs.length; i++) {
            if (previousStringValue.charAt(i) !== stringifiedValue.charAt(i)) {
                this.inputs[parseInt(i.toString(), 10)].value = stringifiedValue.charAt(i);
                this.hiddenInputEle.value = stringifiedValue;
            }
        }
        this.focusIn();
    }

    private updateCssClass(addCss: string, removeCss: string = ''): void {
        let cssClasses: string[];
        if (removeCss) {
            cssClasses = removeCss.trim().split(' ');
            this.element.classList.remove(...cssClasses);
        }
        if (addCss) {
            cssClasses = addCss.trim().split(' ');
            this.element.classList.add(...cssClasses);
        }
    }

    private updateVariantClass(): void {
        const variantClass: string = this.stylingMode.toLocaleLowerCase() === 'outlined' ? 'outline' : this.stylingMode.toLocaleLowerCase();
        const validClasses: string[] = ['underlined', 'filled', 'outline'];
        if (validClasses.indexOf(variantClass) !== -1) {
            removeClass([this.element], validClasses.map((cls: string) => `e-${cls}`));
            addClass([this.element], `e-${variantClass}`);
        }
    }

    private updateAriaLabel(customAriaLabel: string[]): void {
        this.inputs.forEach((input: HTMLInputElement, index: number) => {
            const defaultLabel: string = `Enter Otp Character ${index + 1}`;
            const ariaLabel: string =
                customAriaLabel && customAriaLabel.length > 0
                    ? customAriaLabel[parseInt(index.toString(), 10)] || defaultLabel
                    : defaultLabel;
            input.setAttribute('aria-label', ariaLabel);
        });
    }

    private updateDisabledState(): void {
        this.inputs.forEach((input: HTMLInputElement) => {
            if (this.disabled) { input.setAttribute('disabled', 'disabled'); }
            else { input.removeAttribute('disabled'); }
        });
    }

    private setElementAttributes (htmlAttributes : {[key: string]: string}, element: HTMLElement): void {
        if (!isNullOrUndefined(htmlAttributes)) {
            for (const key in htmlAttributes) {
                if (key === 'class') {
                    const elementClass: string = htmlAttributes['class'].replace(/\s+/g, ' ').trim();
                    if (elementClass) {
                        addClass([element], elementClass.split(' '));
                    }
                }
                else if (key === 'inputmode') {
                    this.setInputMode(htmlAttributes[`${key}`]);
                }
                else if (key === 'name' && this.element.id === element.id) {
                    this.hiddenInputEle.setAttribute(key, htmlAttributes[`${key}`]);
                }
                else {
                    element.setAttribute(key, htmlAttributes[`${key}`]);
                }
            }
        }
    }

    private setInputMode(inputModeValue: string): void {
        for (let i: number = 0; i < this.inputs.length; i++) {
            this.inputs[parseInt(i.toString(), 10)].setAttribute('inputmode', inputModeValue);
        }
    }

    private handleLengthChange (currentValue: number, previousValue: number): void {
        const isLengthAdded: boolean = (currentValue - previousValue) > 0;
        if (isLengthAdded) {
            for (let i: number = previousValue; i < currentValue; i++) {
                this.createOtpInput(i);
            }
            this.renderSeparator(previousValue, currentValue);
            this.addPlaceHolder();
            this.updateAriaLabel(this.ariaLabels);
        }
        else {
            if (currentValue >= 0 && this.inputs.length > 0) {
                for (let i: number = currentValue; i < this.inputs.length; i++) {
                    remove(this.inputs[parseInt(i.toString(), 10)]);
                }
                this.inputs.splice(currentValue);
                if (this.separatorElements.length > 0) {
                    // separator should be completely removed when length is 0 or 1;
                    const index: number = currentValue === 0 ? 0 : currentValue - 1;
                    for (let i: number = index; i < this.separatorElements.length; i++) {
                        remove(this.separatorElements[parseInt(i.toString(), 10)]);
                    }
                    this.separatorElements.splice(index);
                }
            }
        }
    }

    /**
     * To get component name.
     *
     * @returns {string} - Module Name
     * @private
     */
    public getModuleName(): string {
        return 'otpinput';
    }

    /**
     * To get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist data
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * Destroy the Otp input.
     *
     * @returns {void}
     */
    public destroy(): void {
        super.destroy();
        this.unWireEvents();
        this.inputs.forEach((input: HTMLInputElement) => { remove(input); });
        this.separatorElements.forEach((separatorElement: HTMLSpanElement) => { remove(separatorElement); });
        remove(this.hiddenInputEle);
        removeClass([this.element], ['e-underlined', 'e-filled', 'e-outline', 'e-rtl']);
        if (this.cssClass) {
            removeClass([this.element], this.cssClass.trim().split(' '));
        }
        this.element.removeAttribute('role');
        this.inputs = [];
        this.separatorElements = [];
        this.hiddenInputEle = null;
    }

    /**
     * Sets the focus to the Otp input for interaction.
     *
     * @returns {void}
     */
    public focusIn (): void {
        this.isFocusInCalled = true;
        let focusIndex: number = this.inputs.length - 1;
        for ( let index: number = 0; index < this.inputs.length; index++) {
            if (!(this.inputs[parseInt(index.toString(), 10)].value.length > 0)) {
                focusIndex = index;
                break;
            }
        }
        this.inputs[parseInt(focusIndex.toString(), 10)].focus();
        this.isFocusInCalled = false;
    }

    /**
     * Remove the focus from Otp input, if it is in focus state.
     *
     * @returns {void}
     */
    public focusOut (): void {
        this.isFocusOutCalled = true;
        this.inputs.forEach((input: HTMLInputElement) => {
            input.blur();
        });
        this.isFocusOutCalled = false;
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param  {OtpInputModel} newProp - Specifies new properties
     * @param  {OtpInputModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: OtpInputModel, oldProp?: OtpInputModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'textTransform':
                this.updateInputValue(this.value);
                break;
            case 'value':
                this.updateInputValue(oldProp.value);
                this.triggerValuechanged();
                break;
            case 'placeholder':
                this.addPlaceHolder();
                break;
            case 'disabled':
                this.updateDisabledState();
                break;
            case 'cssClass':
                this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                break;
            case 'separator':
                if (oldProp.separator === '') {
                    this.renderSeparator(1, this.inputs.length);
                }
                else {
                    this.updateSeparatorValue();
                }
                break;
            case 'htmlAttributes':
                this.setElementAttributes(newProp.htmlAttributes, this.element);
                break;
            case 'type':
                this.updateInputType(newProp.type);
                break;
            case 'stylingMode':
                this.updateVariantClass();
                break;
            case 'ariaLabels':
                this.updateAriaLabel(newProp.ariaLabels);
                break;
            case 'length':
                this.handleLengthChange(newProp.length, oldProp.length);
                break;
            case 'enableRtl':
                this.element.classList[this.enableRtl ? 'add' : 'remove'](RTL);
                break;
            case 'autoFocus':
                if (this.autoFocus) { this.focusIn(); }
                break;
            }
        }
    }
}
