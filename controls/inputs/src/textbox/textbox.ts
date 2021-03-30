import { Component, Property, Event, EmitType, EventHandler, L10n, setValue, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, detach, Internationalization, getUniqueID, closest } from '@syncfusion/ej2-base';
import { addClass, removeClass, isBlazor } from '@syncfusion/ej2-base';
import { FloatLabelType, Input, InputObject } from '../input/input';
import { TextBoxModel} from './textbox-model';

const HIDE_CLEAR: string = 'e-clear-icon-hide';
const TEXTBOX_FOCUS: string = 'e-input-focus';
const containerAttr: string[] = ['title', 'style', 'class'];

export interface FocusInEventArgs {
    /** Returns the TextBox container element */
    container?: HTMLElement
    /** Returns the event parameters from TextBox. */
    event?: Event
    /** Returns the entered value of the TextBox. */
    value?: string
}

export interface FocusOutEventArgs {
    /** Returns the TextBox container element */
    container?: HTMLElement
    /** Returns the event parameters from TextBox. */
    event?: Event
    /** Returns the entered value of the TextBox. */
    value?: string
}

export interface ChangedEventArgs extends FocusInEventArgs {
    /** Returns the previously entered value of the TextBox. */
    previousValue?: string
    /** DEPRECATED-Returns the original event. */
    isInteraction?: boolean
    /** Returns the original event. */
    isInteracted?: boolean
}

export interface InputEventArgs extends FocusInEventArgs {
    /** Returns the previously updated value of the TextBox. */
    previousValue?: string
}
/**
 * Represents the TextBox component that allows the user to enter the values based on it's type.
 * ```html
 * <input name='images' id='textbox'/>
 * ```
 * ```typescript
 * <script>
 *   var textboxObj = new TextBox();
 *   textboxObj.appendTo('#textbox');
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class TextBox extends Component<HTMLInputElement | HTMLTextAreaElement> implements INotifyPropertyChanged {

    private textboxWrapper: InputObject;
    private l10n: L10n;
    private previousValue: string = null;
    private cloneElement: HTMLInputElement;
    private globalize: Internationalization;
    private preventChange: boolean;
    private isAngular: boolean = false;
    private isHiddenInput: boolean = false;
    private textarea: HTMLTextAreaElement;
    private respectiveElement: HTMLInputElement | HTMLTextAreaElement;
    private isForm: boolean = false;
    private formElement: HTMLElement;
    private initialValue: string;
    private textboxOptions: TextBoxModel;
    private inputPreviousValue: string = null;
    private isVue: boolean = false;

    /**
     * Specifies the behavior of the TextBox such as text, password, email, etc.
     *
     * @default 'text'
     */
    @Property('text')
    public type: string;

    /**
     * Specifies the boolean value whether the TextBox allows user to change the text.
     *
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * Sets the content of the TextBox.
     *
     * @default null
     */
    @Property(null)
    public value: string;

    /**
     * Specifies the floating label behavior of the TextBox that the placeholder text floats above the TextBox based on the below values.
     * Possible values are:
     * * `Never` - The placeholder text should not be float ever.
     * * `Always` - The placeholder text floats above the TextBox always.
     * * `Auto` - The placeholder text floats above the TextBox while focusing or enter a value in Textbox.
     *
     * @default Never
     */
    @Property('Never')
    public floatLabelType: FloatLabelType;

    /**
     * Specifies the CSS class value that is appended to wrapper of Textbox.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies the text that is shown as a hint/placeholder until the user focus or enter a value in Textbox.
     * The property is depending on the floatLabelType property.
     *
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /**
     * Specifies whether the browser is allow to automatically enter or select a value for the textbox.
     * By default, autocomplete is enabled for textbox.
     * Possible values are:
     * `on` - Specifies that autocomplete is enabled.
     * `off` - Specifies that autocomplete is disabled.
     *
     * @default 'on'
     */
    @Property('on')
    public autocomplete: string;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     * {% codeBlock src='textbox/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };

    /**
     * Specifies a boolean value that enable or disable the multiline on the TextBox.
     * The TextBox changes from single line to multiline when enable this multiline mode.
     *
     * @default false
     */
    @Property(false)
    public multiline: boolean;

    /**
     * Specifies a Boolean value that indicates whether the TextBox allow user to interact with it.
     *
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Specifies a Boolean value that indicates whether the clear button is displayed in Textbox.
     *
     * @default false
     */
    @Property(false)
    public showClearButton: boolean;

    /**
     * Enable or disable persisting TextBox state between page reloads. If enabled, the `value` state will be persisted.
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Specifies the width of the Textbox component.
     *
     * @default null
     */
    @Property(null)
    public width: number | string;

    /**
     * Triggers when the TextBox component is created.
     *
     * @event created
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the TextBox component is destroyed.
     *
     * @event destroyed
     * @blazorProperty 'Destroyed'
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers when the content of TextBox has changed and gets focus-out.
     *
     * @event change
     * @blazorProperty 'ValueChange'
     */
    @Event()
    public change: EmitType<ChangedEventArgs>;

    /**
     * Triggers when the TextBox has focus-out.
     *
     * @event blur
     */
    @Event()
    public blur: EmitType<FocusOutEventArgs>;

    /**
     * Triggers when the TextBox gets focus.
     *
     * @event focus
     */
    @Event()
    public focus: EmitType<FocusInEventArgs>;

    /**
     * Triggers each time when the value of TextBox has changed.
     *
     * @event input
     */
    @Event()
    public input: EmitType<InputEventArgs>;

    /**
     *
     * @param {TextBoxModel} options - Specifies the TextBox model.
     * @param {string | HTMLInputElement | HTMLTextAreaElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: TextBoxModel, element?: string | HTMLInputElement | HTMLTextAreaElement ) {
        super(options, <string | HTMLInputElement | HTMLTextAreaElement> element);
        this.textboxOptions = options;
    }

    /**
     * Calls internally if any of the property value is changed.
     *
     * @param {TextBoxModel} newProp - Returns the dynamic property value of the component.
     * @param {TextBoxModel} oldProp - Returns the previous property value of the component.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: TextBoxModel, oldProp: TextBoxModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'floatLabelType':
                Input.removeFloating(this.textboxWrapper);
                Input.addFloating(this.respectiveElement, this.floatLabelType, this.placeholder);
                break;
            case 'enabled':
                Input.setEnabled(this.enabled, this.respectiveElement, this.floatLabelType, this.textboxWrapper.container);
                this.bindClearEvent();
                break;
            case 'width':
                Input.setWidth(newProp.width, this.textboxWrapper.container);
                break;
            case 'value': {
                const prevOnChange: boolean = this.isProtectedOnChange;
                this.isProtectedOnChange = true;
                if (!this.isBlank(this.value)) {
                    this.value = this.value.toString();
                }
                this.isProtectedOnChange = prevOnChange;
                Input.setValue(this.value, this.respectiveElement, this.floatLabelType, this.showClearButton);
                if (this.isHiddenInput) {
                    this.element.value = this.respectiveElement.value;
                }
                this.inputPreviousValue = this.respectiveElement.value;
                /* istanbul ignore next */
                if ((this.isAngular || this.isVue) && this.preventChange === true) {
                    this.previousValue = this.isAngular ? this.value : this.previousValue;
                    this.preventChange = false;
                } else if (isNullOrUndefined(this.isAngular) || !this.isAngular
                    || (this.isAngular && !this.preventChange) || (this.isAngular && isNullOrUndefined(this.preventChange))) {
                    this.raiseChangeEvent();
                }
            }
                break;
            case 'htmlAttributes': {
                this.updateHTMLAttrToElement();
                this.updateHTMLAttrToWrapper();
                this.checkAttributes(true);
                Input.validateInputType(this.textboxWrapper.container, this.element);
            }
                break;
            case 'readonly':
                Input.setReadonly(this.readonly, this.respectiveElement);
                break;
            case 'type':
                if (this.respectiveElement.tagName !== 'TEXTAREA') {
                    this.respectiveElement.setAttribute('type', this.type);
                    Input.validateInputType(this.textboxWrapper.container, this.element);
                    this.raiseChangeEvent();
                }
                break;
            case 'showClearButton':
                if (this.respectiveElement.tagName !== 'TEXTAREA') {
                    Input.setClearButton(this.showClearButton, this.respectiveElement, this.textboxWrapper);
                    this.bindClearEvent();
                }
                break;
            case 'enableRtl':
                Input.setEnableRtl(this.enableRtl, [this.textboxWrapper.container]);
                break;
            case 'placeholder':
                Input.setPlaceholder(this.placeholder, this.respectiveElement);
                break;
            case 'autocomplete':
                if ( this.autocomplete !== 'on' && this.autocomplete !== '') {
                    this.respectiveElement.autocomplete = this.autocomplete;
                } else {
                    this.removeAttributes(['autocomplete']);
                }
                break;
            case 'cssClass':
                this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                break;
            case 'locale':
                this.globalize = new Internationalization(this.locale);
                this.l10n.setLocale(this.locale);
                this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                Input.setPlaceholder(this.placeholder, this.respectiveElement);
                break;
            }
        }
    }

    /**
     * Gets the component name
     *
     * @returns {string} Returns the component name.
     * @private
     */
    public getModuleName(): string {
        return 'textbox';
    }

    private isBlank(str: string): boolean {
        return (!str || /^\s*$/.test(str));
    }

    protected preRender(): void {
        if (!(isBlazor() && this.isServerRendered)) {
            this.cloneElement = <HTMLInputElement>this.element.cloneNode(true);
            this.formElement = closest(this.element, 'form') as HTMLFormElement;
            if (!isNullOrUndefined(this.formElement)) {
                this.isForm = true;
            }
            /* istanbul ignore next */
            if (this.element.tagName === 'EJS-TEXTBOX') {
                const ejInstance: Object = getValue('ej2_instances', this.element);
                const inputElement: string | HTMLInputElement | HTMLTextAreaElement = this.multiline ?
                    <HTMLTextAreaElement>this.createElement('textarea') :
                    <HTMLInputElement>this.createElement('input');
                let index: number = 0;
                for (index; index < this.element.attributes.length; index++) {
                    const attributeName: string = this.element.attributes[index].nodeName;
                    if (attributeName !== 'id') {
                        inputElement.setAttribute(attributeName, this.element.attributes[index].nodeValue);
                        inputElement.innerHTML = this.element.innerHTML;
                        if (attributeName === 'name') {
                            this.element.removeAttribute('name');
                        }
                    }
                }
                this.element.appendChild(inputElement);
                this.element = inputElement;
                setValue('ej2_instances', ejInstance, this.element);
            }
            this.updateHTMLAttrToElement();
            this.checkAttributes(false);
            if (this.element.tagName !== 'TEXTAREA') {
                this.element.setAttribute('type', this.type);
            }
            this.element.setAttribute('role', 'textbox');
            this.globalize = new Internationalization(this.locale);
            const localeText: { placeholder: string } = { placeholder: this.placeholder };
            this.l10n = new L10n('textbox', localeText, this.locale);
            if (this.l10n.getConstant('placeholder') !== '') {
                this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
            }
            if (!this.element.hasAttribute('id')) {
                this.element.setAttribute('id', getUniqueID('textbox'));
            }
            if (!this.element.hasAttribute('name')) {
                this.element.setAttribute('name', this.element.getAttribute('id'));
            }
            if (this.element.tagName === 'INPUT' && this.multiline) {
                this.isHiddenInput = true;
                this.textarea = <HTMLTextAreaElement>this.createElement('textarea');
                this.element.parentNode.insertBefore(this.textarea, this.element);
                this.element.setAttribute('type', 'hidden');
                this.textarea.setAttribute('name', this.element.getAttribute('name'));
                this.element.removeAttribute('name');
                this.textarea.setAttribute('role', this.element.getAttribute('role'));
                this.element.removeAttribute('role');
                this.textarea.setAttribute('id', getUniqueID('textarea'));
                const apiAttributes : string[] = ['placeholder', 'disabled', 'value', 'readonly', 'type', 'autocomplete'];
                for (let index: number = 0; index < this.element.attributes.length; index++) {
                    const attributeName: string = this.element.attributes[index].nodeName;
                    if (this.element.hasAttribute(attributeName) && containerAttr.indexOf(attributeName) < 0 &&
                        !(attributeName === 'id' || attributeName === 'type' || attributeName === 'e-mappinguid')) {
                        // e-mappinguid attribute is handled for Grid component.
                        this.textarea.setAttribute(attributeName, this.element.attributes[index].nodeValue);
                        if (apiAttributes.indexOf(attributeName) < 0) {
                            this.element.removeAttribute(attributeName);
                            index--;
                        }
                    }
                }
            }
        }
    }

    private checkAttributes(isDynamic: boolean): void {
        const attrs: string[]  = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['placeholder', 'disabled', 'value', 'readonly', 'type', 'autocomplete'];
        for (const key of attrs) {
            if (!isNullOrUndefined(this.element.getAttribute(key))) {
                switch (key) {
                case 'disabled':
                    // eslint-disable-next-line @typescript-eslint/dot-notation
                    if (( isNullOrUndefined(this.textboxOptions) || (this.textboxOptions['enabled'] === undefined)) || isDynamic) {
                        const enabled: boolean = this.element.getAttribute(key) === 'disabled' || this.element.getAttribute(key) === '' ||
                            this.element.getAttribute(key) === 'true' ? false : true;
                        this.setProperties({enabled: enabled}, !isDynamic);
                    }
                    break;
                case 'readonly':
                    // eslint-disable-next-line @typescript-eslint/dot-notation
                    if (( isNullOrUndefined(this.textboxOptions) || (this.textboxOptions['readonly'] === undefined)) || isDynamic) {
                        const readonly: boolean = this.element.getAttribute(key) === 'readonly' || this.element.getAttribute(key) === ''
                            || this.element.getAttribute(key) === 'true' ? true : false;
                        this.setProperties({readonly: readonly}, !isDynamic);
                    }
                    break;
                case 'placeholder':
                    // eslint-disable-next-line @typescript-eslint/dot-notation
                    if (( isNullOrUndefined(this.textboxOptions) || (this.textboxOptions['placeholder'] === undefined)) || isDynamic) {
                        this.setProperties({placeholder: this.element.placeholder}, !isDynamic);
                    }
                    break;
                case 'autocomplete':
                    // eslint-disable-next-line @typescript-eslint/dot-notation
                    if (( isNullOrUndefined(this.textboxOptions) || (this.textboxOptions['autocomplete'] === undefined)) || isDynamic) {
                        const autoCompleteTxt: string = this.element.autocomplete === 'off' ? 'off' : 'on';
                        this.setProperties({ autocomplete: autoCompleteTxt }, !isDynamic);
                    }
                    break;
                case 'value':
                    // eslint-disable-next-line @typescript-eslint/dot-notation
                    if (( isNullOrUndefined(this.textboxOptions) || (this.textboxOptions['value'] === undefined)) || isDynamic) {
                        this.setProperties({value: this.element.value}, !isDynamic);
                    }
                    break;
                case 'type':
                    // eslint-disable-next-line @typescript-eslint/dot-notation
                    if (( isNullOrUndefined(this.textboxOptions) || (this.textboxOptions['type'] === undefined)) || isDynamic) {
                        this.setProperties({type: this.element.type}, !isDynamic);
                    }
                    break;
                }
            }
        }
    }

    /**
     * To Initialize the control rendering
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        let updatedCssClassValue: string = this.cssClass;
        if (!isNullOrUndefined(this.cssClass) && this.cssClass !== '') {
            updatedCssClassValue = this.getInputValidClassList(this.cssClass);
        }
        if (!(isBlazor() && this.isServerRendered)) {
            this.respectiveElement = (this.isHiddenInput) ? this.textarea : this.element;
            this.textboxWrapper = Input.createInput({
                element: this.respectiveElement,
                floatLabelType: this.floatLabelType,
                properties: {
                    enabled: this.enabled,
                    enableRtl: this.enableRtl,
                    cssClass: updatedCssClassValue,
                    readonly: this.readonly,
                    placeholder: this.placeholder,
                    showClearButton: this.showClearButton
                }
            });
            this.updateHTMLAttrToWrapper();
            if (this.isHiddenInput) {
                this.respectiveElement.parentNode.insertBefore(this.element, this.respectiveElement);
            }
        } else {
            this.respectiveElement = this.element;
            this.textboxWrapper = { container: this.element.parentElement };
            if (this.showClearButton && !this.multiline) {
                this.textboxWrapper.clearButton = this.textboxWrapper.container.querySelector('.e-clear-icon');
                Input.wireClearBtnEvents(this.respectiveElement, this.textboxWrapper.clearButton, this.textboxWrapper.container);
            }
            if (this.floatLabelType === 'Auto') {
                Input.wireFloatingEvents(this.respectiveElement);
            }
            // eslint-disable-next-line max-len, @typescript-eslint/no-explicit-any
            Input.bindInitialEvent({ element: this.respectiveElement, buttons: null, customTag: null, floatLabelType: this.floatLabelType, properties: (this as any).properties });
        }
        this.wireEvents();
        if (!isNullOrUndefined(this.value)) {
            Input.setValue(this.value, this.respectiveElement, this.floatLabelType, this.showClearButton);
            if (this.isHiddenInput) {
                this.element.value = this.respectiveElement.value;
            }
        }
        if (!isNullOrUndefined(this.value)) {
            this.initialValue = this.value;
            this.setInitialValue();
        }
        if (this.autocomplete !== 'on' && this.autocomplete !== '') {
            this.respectiveElement.autocomplete = this.autocomplete;
            // eslint-disable-next-line @typescript-eslint/dot-notation
        } else if (!isNullOrUndefined(this.textboxOptions) && (this.textboxOptions['autocomplete'] !== undefined)) {
            this.removeAttributes(['autocomplete']);
        }
        this.previousValue = this.value;
        this.inputPreviousValue = this.value;
        this.respectiveElement.defaultValue = this.respectiveElement.value;
        Input.setWidth(this.width, this.textboxWrapper.container);
        this.renderComplete();
    }

    private updateHTMLAttrToWrapper(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (const key of Object.keys(this.htmlAttributes)) {
                if (containerAttr.indexOf(key) > -1 ) {
                    if (key === 'class') {
                        const updatedClassValues : string = this.getInputValidClassList(this.htmlAttributes[key]);
                        if (updatedClassValues !== '') {
                            addClass([this.textboxWrapper.container], updatedClassValues.split(' '));
                        }
                    } else if (key === 'style') {
                        let setStyle: string = this.textboxWrapper.container.getAttribute(key);
                        setStyle = !isNullOrUndefined(setStyle) ? (setStyle + this.htmlAttributes[key]) :
                            this.htmlAttributes[key];
                        this.textboxWrapper.container.setAttribute(key, setStyle);
                    } else {
                        this.textboxWrapper.container.setAttribute(key, this.htmlAttributes[key]);
                    }
                }
            }
        }
    }

    private updateHTMLAttrToElement(): void {
        if ( !isNullOrUndefined(this.htmlAttributes)) {
            for (const key of Object.keys(this.htmlAttributes)) {
                if (containerAttr.indexOf(key) < 0 ) {
                    this.element.setAttribute(key, this.htmlAttributes[key]);
                }
            }
        }
    }
    private updateCssClass(newClass : string, oldClass : string) : void {
        Input.setCssClass(this.getInputValidClassList(newClass), [this.textboxWrapper.container], this.getInputValidClassList(oldClass));
    }
    private getInputValidClassList(inputClassName: string): string {
        let result: string = inputClassName;
        if (!isNullOrUndefined(inputClassName) && inputClassName !== '') {
            result = (inputClassName.replace(/\s+/g, ' ')).trim();
        }
        return result;
    }
    private setInitialValue() : void {
        if (!this.isAngular) {
            this.respectiveElement.setAttribute('value', this.initialValue);
        }
    }

    private wireEvents(): void {
        EventHandler.add(this.respectiveElement, 'focus', this.focusHandler, this);
        EventHandler.add(this.respectiveElement, 'blur', this.focusOutHandler, this);
        EventHandler.add(this.respectiveElement, 'input', this.inputHandler, this);
        EventHandler.add(this.respectiveElement, 'change', this.changeHandler, this);
        if (this.isForm) {
            EventHandler.add(this.formElement, 'reset', this.resetForm, this);
        }
        this.bindClearEvent();
        if (!isNullOrUndefined(this.textboxWrapper.container.querySelector('.e-float-text')) && this.floatLabelType === 'Auto'
           && this.textboxWrapper.container.classList.contains('e-autofill') &&
           this.textboxWrapper.container.classList.contains('e-outline')) {
            EventHandler.add((this.textboxWrapper.container.querySelector('.e-float-text')), 'animationstart', this.animationHandler, this);
        }
    }

    private animationHandler() : void {
        this.textboxWrapper.container.classList.add('e-valid-input');
        const label: HTMLElement = this.textboxWrapper.container.querySelector('.e-float-text');
        if (!isNullOrUndefined(label)) {
            label.classList.add('e-label-top');
            if (label.classList.contains('e-label-bottom')) {
                label.classList.remove('e-label-bottom');
            }
        }
    }

    private resetValue(value: string) : void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.value = value;
        this.isProtectedOnChange = prevOnChange;
    }
    private resetForm() : void {
        if (this.isAngular) {
            this.resetValue('');
        } else {
            this.resetValue(this.initialValue);
        }
        if (!isNullOrUndefined(this.textboxWrapper)) {
            const label: HTMLElement = this.textboxWrapper.container.querySelector('.e-float-text');
            if (!isNullOrUndefined(label)) {
                if ((isNullOrUndefined(this.initialValue) || this.initialValue === '')) {
                    label.classList.add('e-label-bottom');
                    label.classList.remove('e-label-top');
                } else if (this.initialValue !== '') {
                    label.classList.add('e-label-top');
                    label.classList.remove('e-label-bottom');
                }
            }
        }
    }

    private focusHandler(args: MouseEvent | TouchEvent | KeyboardEvent): void {
        const eventArgs: FocusInEventArgs = {
            container: this.textboxWrapper.container,
            event: args,
            value: this.value
        };
        this.trigger('focus', eventArgs);
    }
    private focusOutHandler(args: MouseEvent | TouchEvent | KeyboardEvent): void {
        if (!(this.previousValue === null && this.value === null && this.respectiveElement.value === '') &&
        (this.previousValue !== this.respectiveElement.value)) {
            this.raiseChangeEvent(args, true);
        }
        const eventArgs: FocusOutEventArgs = {
            container: this.textboxWrapper.container,
            event: args,
            value: this.value
        };
        this.trigger('blur', eventArgs);
    }

    private inputHandler(args: KeyboardEvent): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-this-alias
        const textboxObj: any = this;
        const eventArgs: InputEventArgs = {
            event: args,
            value: this.respectiveElement.value,
            previousValue: this.inputPreviousValue,
            container: this.textboxWrapper.container
        };
        this.inputPreviousValue = this.respectiveElement.value;
        /* istanbul ignore next */
        if (this.isAngular) {
            textboxObj.localChange({ value: this.respectiveElement.value });
            this.preventChange = true;
        }
        if (this.isVue) {
            this.preventChange = true;
        }
        this.trigger('input', eventArgs);
        args.stopPropagation();
    }

    private changeHandler(args: Event): void {
        this.setProperties({value: this.respectiveElement.value}, true);
        this.raiseChangeEvent(args, true);
        args.stopPropagation();
    }

    private raiseChangeEvent(event?: Event, interaction?: boolean): void {
        const eventArgs: ChangedEventArgs = {
            event: event,
            value: this.value,
            previousValue: this.previousValue,
            container: this.textboxWrapper.container,
            isInteraction: interaction ? interaction : false,
            isInteracted: interaction ? interaction : false
        };
        this.preventChange = false;
        this.trigger('change', eventArgs);
        this.previousValue = this.value;
    }

    private bindClearEvent(): void {
        if (this.showClearButton && this.respectiveElement.tagName !== 'TEXTAREA') {
            if (this.enabled) {
                EventHandler.add(this.textboxWrapper.clearButton, 'mousedown touchstart', this.resetInputHandler, this);
            } else {
                EventHandler.remove(this.textboxWrapper.clearButton, 'mousedown touchstart', this.resetInputHandler);
            }
        }
    }

    private resetInputHandler(event?: MouseEvent): void {
        event.preventDefault();
        if (!(this.textboxWrapper.clearButton.classList.contains(HIDE_CLEAR))) {
            Input.setValue('', this.respectiveElement, this.floatLabelType, this.showClearButton);
            if (this.isHiddenInput) {
                this.element.value = this.respectiveElement.value;
            }
            this.setProperties({value: this.respectiveElement.value}, true);
            const eventArgs: InputEventArgs = {
                event: event,
                value: this.respectiveElement.value,
                previousValue: this.inputPreviousValue,
                container: this.textboxWrapper.container
            };
            this.trigger('input', eventArgs);
            this.inputPreviousValue = this.respectiveElement.value;
            this.raiseChangeEvent(event, true);
        }
    }

    private unWireEvents(): void {
        EventHandler.remove(this.respectiveElement, 'focus', this.focusHandler);
        EventHandler.remove(this.respectiveElement, 'blur', this.focusOutHandler);
        EventHandler.remove(this.respectiveElement, 'input', this.inputHandler);
        EventHandler.remove(this.respectiveElement, 'change', this.changeHandler);
        if (this.isForm) {
            EventHandler.remove(this.formElement, 'reset', this.resetForm);
        }
        if (!isNullOrUndefined(this.textboxWrapper.container.querySelector('.e-float-text')) && this.floatLabelType === 'Auto'
           && this.textboxWrapper.container.classList.contains('e-outline') &&
           this.textboxWrapper.container.classList.contains('e-autofill')) {
            EventHandler.remove((this.textboxWrapper.container.querySelector('.e-float-text')), 'animationstart', this.animationHandler);
        }
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also, it maintains the initial TextBox element from the DOM.
     *
     * @method destroy
     * @returns {void}
     */

    public destroy(): void {
        this.unWireEvents();
        if (!(isBlazor() && this.isServerRendered)) {
            if (this.element.tagName === 'INPUT' && this.multiline) {
                detach(this.textboxWrapper.container.getElementsByTagName('textarea')[0]);
                this.respectiveElement = this.element;
                this.element.removeAttribute('type');
            }
            this.respectiveElement.value = this.respectiveElement.defaultValue;
            this.respectiveElement.classList.remove('e-input');
            this.removeAttributes(['aria-placeholder', 'aria-disabled', 'aria-readonly', 'aria-labelledby']);
            if (!isNullOrUndefined(this.textboxWrapper)) {
                this.textboxWrapper.container.insertAdjacentElement('afterend', this.respectiveElement);
                detach(this.textboxWrapper.container);
            }
            this.textboxWrapper = null;
            super.destroy();
        } else {
            this.textboxWrapper = null;
        }
    }

    /**
     * Adding the icons to the TextBox component.
     *
     * @param { string } position - Specify the icon placement on the TextBox. Possible values are append and prepend.
     * @param { string | string[] } icons - Icon classes which are need to add to the span element which is going to created.
     * Span element acts as icon or button element for TextBox.
     * @returns {void}
     */
    public addIcon(position: string, icons: string | string[]): void {
        Input.addIcon(position, icons, this.textboxWrapper.container, this.respectiveElement, this.createElement);
    }
    /* eslint-disable valid-jsdoc, jsdoc/require-returns */
    /**
     * Gets the properties to be maintained in the persisted state.
     *
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['value'];
        return this.addOnPersist(keyEntity);
    }
    /* eslint-enable valid-jsdoc, jsdoc/require-returns */
    /**
     * Adding the multiple attributes as key-value pair to the TextBox element.
     *
     * @param {string} attributes - Specifies the attributes to be add to TextBox element.
     * @returns {void}
     */
    public addAttributes(attributes: { [key: string]: string }): void {
        for (const key of Object.keys(attributes)) {
            if (key === 'disabled') {
                this.setProperties({ enabled: false }, true);
                Input.setEnabled(this.enabled, this.respectiveElement, this.floatLabelType, this.textboxWrapper.container);
            } else if (key === 'readonly') {
                this.setProperties({ readonly: true }, true);
                Input.setReadonly(this.readonly, this.respectiveElement);
            } else if (key === 'class') {
                this.respectiveElement.classList.add(attributes[key]);
            } else if (key === 'placeholder') {
                this.setProperties({ placeholder: attributes[key] }, true);
                Input.setPlaceholder(this.placeholder, this.respectiveElement);
            } else if (key === 'rows' && this.respectiveElement.tagName === 'TEXTAREA') {
                this.respectiveElement.setAttribute(key, attributes[key]);
            } else {
                this.respectiveElement.setAttribute(key, attributes[key]);
            }
        }
    }
    /**
     * Removing the multiple attributes as key-value pair to the TextBox element.
     *
     * @param { string[] } attributes - Specifies the attributes name to be removed from TextBox element.
     * @returns {void}
     */
    public removeAttributes(attributes: string[]): void {
        for (const key of attributes) {
            if (key === 'disabled') {
                this.setProperties({ enabled: true }, true);
                Input.setEnabled(this.enabled, this.respectiveElement, this.floatLabelType, this.textboxWrapper.container);
            } else if (key === 'readonly') {
                this.setProperties({ readonly: false }, true);
                Input.setReadonly(this.readonly, this.respectiveElement);
            } else if (key === 'placeholder') {
                this.setProperties({ placeholder: null }, true);
                Input.setPlaceholder(this.placeholder, this.respectiveElement);
            } else {
                this.respectiveElement.removeAttribute(key);
            }
        }
    }

    /**
     * Sets the focus to widget for interaction.
     *
     * @returns {void}
     */
    public focusIn(): void {
        if (document.activeElement !== this.respectiveElement && this.enabled) {
            this.respectiveElement.focus();
            if (this.textboxWrapper.container.classList.contains('e-input-group')
             || this.textboxWrapper.container.classList.contains('e-outline')
             || this.textboxWrapper.container.classList.contains('e-filled')) {
                addClass([this.textboxWrapper.container], [TEXTBOX_FOCUS]);
            }
        }
    }

    /**
     * Remove the focus from widget, if the widget is in focus state.
     *
     * @returns {void}
     */
    public focusOut(): void {
        if (document.activeElement === this.respectiveElement && this.enabled) {
            this.respectiveElement.blur();
            if (this.textboxWrapper.container.classList.contains('e-input-group')
             || this.textboxWrapper.container.classList.contains('e-outline')
             || this.textboxWrapper.container.classList.contains('e-filled')) {
                removeClass([this.textboxWrapper.container], [TEXTBOX_FOCUS]);
            }
        }
    }
}
