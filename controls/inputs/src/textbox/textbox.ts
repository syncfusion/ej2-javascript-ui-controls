import { Component, Property, Event, EmitType, EventHandler, L10n, setValue, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, detach, Internationalization, getUniqueID, closest } from '@syncfusion/ej2-base';
import { FloatLabelType, Input, InputObject } from '../input/input';
import { TextBoxModel} from './textbox-model';

const ROOT: string = 'e-textbox';
const CONTROL: string = 'e-control';
const HIDE_CLEAR: string = 'e-clear-icon-hide';

export interface FocusInEventArgs {
    /** Returns the TextBox container element */
    container?: HTMLElement;
    /** Returns the event parameters from TextBox. */
    event?: Event;
    /** Returns the entered value of the TextBox. */
    value?: string;
}

export interface FocusOutEventArgs {
    /** Returns the TextBox container element */
    container?: HTMLElement;
    /** Returns the event parameters from TextBox. */
    event?: Event;
    /** Returns the entered value of the TextBox. */
    value?: string;
}

export interface ChangedEventArgs extends FocusInEventArgs {
    /** Returns the previously entered value of the TextBox. */
    previousValue?: string;
    /** DEPRECATED-Returns the original event. */
    isInteraction?: boolean;
    /** Returns the original event. */
    isInteracted?: boolean;
}

export interface InputEventArgs extends FocusInEventArgs {
    /** Returns the previously updated value of the TextBox. */
    previousValue?: string;
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
    /**
     * Specifies the behavior of the TextBox such as text, password, email, etc.
     * @default 'text'
     */
    @Property('text')
    public type: string;

    /**
     * Specifies the boolean value whether the TextBox allows user to change the text.
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * Sets the content of the TextBox.
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
     * @default Never
     */
    @Property('Never')
    public floatLabelType: FloatLabelType;

    /**
     * Specifies the CSS class value that is appended to wrapper of Textbox.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies the text that is shown as a hint/placeholder until the user focus or enter a value in Textbox.
     * The property is depending on the floatLabelType property.
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /**
     * Specifies a Boolean value that enable or disable the RTL mode on the Textbox. The content of Textbox
     * display from right to left direction when enable this RTL mode.
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;

    /**
     * Specifies a boolean value that enable or disable the multiline on the TextBox. 
     * The TextBox changes from single line to multiline when enable this multiline mode.
     * @default false
     */
    @Property(false)
    public multiline: boolean;

    /**
     * Specifies a Boolean value that indicates whether the TextBox allow user to interact with it.
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Specifies a Boolean value that indicates whether the clear button is displayed in Textbox.
     * @default false
     */
    @Property(false)
    public showClearButton: boolean;

    /**
     * Enable or disable persisting TextBox state between page reloads. If enabled, the `value` state will be persisted.
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Triggers when the TextBox component is created.
     * @event
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the TextBox component is destroyed.
     * @event
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers when the content of TextBox has changed and gets focus-out.
     * @event
     */
    @Event()
    public change: EmitType<ChangedEventArgs>;

    /**
     * Triggers when the TextBox has focus-out.
     * @event
     */
    @Event()
    public blur: EmitType<FocusOutEventArgs>;

    /**
     * Triggers when the TextBox gets focus.
     * @event
     */
    @Event()
    public focus: EmitType<FocusInEventArgs>;

    /**
     * Triggers each time when the value of TextBox has changed.
     * @event
     */
    @Event()
    public input: EmitType<InputEventArgs>;

    constructor(options?: TextBoxModel, element?: string | HTMLInputElement | HTMLTextAreaElement ) {
        super(options, <string | HTMLInputElement | HTMLTextAreaElement> element);
    }

    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    public onPropertyChanged(newProp: TextBoxModel, oldProp: TextBoxModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'floatLabelType':
                    Input.removeFloating(this.textboxWrapper);
                    Input.addFloating(this.respectiveElement, this.floatLabelType, this.placeholder);
                    break;
                case 'enabled':
                    Input.setEnabled(this.enabled, this.respectiveElement, this.floatLabelType, this.textboxWrapper.container);
                    break;
                case 'value':
                    let prevOnChange: boolean = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    if (!this.isBlank(this.value)) {
                        this.value = this.value.toString();
                    }
                    this.isProtectedOnChange = prevOnChange;
                    Input.setValue(this.value, this.respectiveElement, this.floatLabelType, this.showClearButton);
                    if (this.isHiddenInput) {
                    this.element.value = this.respectiveElement.value;
                    }
                    /* istanbul ignore next */
                    if (this.isAngular && this.preventChange === true) {
                        this.previousValue = this.value;
                        this.preventChange = false;
                    } else if (isNullOrUndefined(this.isAngular) || !this.isAngular
                    || (this.isAngular && !this.preventChange) || (this.isAngular && isNullOrUndefined(this.preventChange))) {
                        this.raiseChangeEvent();
                    }
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.respectiveElement);
                    break;
                case 'type':
                    if (this.respectiveElement.tagName !== 'TEXTAREA') {
                    this.respectiveElement.setAttribute('type', this.type);
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
                case 'cssClass':
                    Input.setCssClass(this.cssClass, [this.textboxWrapper.container]);
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
     * @private
     */
    public getModuleName(): string {
        return 'textbox';
    }

    private isBlank(str: string): boolean {
        return (!str || /^\s*$/.test(str));
    }

    protected preRender(): void {
        this.cloneElement = <HTMLInputElement>this.element.cloneNode(true);
        this.formElement = closest(this.element, 'form') as HTMLFormElement;
        if (!isNullOrUndefined(this.formElement)) {
            this.isForm = true;
        }
        /* istanbul ignore next */
        if (this.element.tagName === 'EJS-TEXTBOX') {
            let ejInstance: Object = getValue('ej2_instances', this.element);
            let inputElement: string | HTMLInputElement | HTMLTextAreaElement = this.multiline ?
                              <HTMLTextAreaElement>this.createElement('textarea') :
                              <HTMLInputElement>this.createElement('input');
            let index: number = 0;
            for (index; index < this.element.attributes.length; index++) {
                if (this.element.attributes[index].nodeName !== 'id') {
                    inputElement.setAttribute(this.element.attributes[index].nodeName, this.element.attributes[index].nodeValue);
                    inputElement.innerHTML = this.element.innerHTML;
                }
            }
            this.element.appendChild(inputElement);
            this.element = inputElement;
            setValue('ej2_instances', ejInstance, this.element);
        }
        let attributes: NamedNodeMap = this.element.attributes;
        this.checkAttributes(attributes);
        if (this.element.tagName !== 'TEXTAREA') {
            this.element.setAttribute('type', this.type);
        }
        this.globalize = new Internationalization(this.locale);
        let localeText: { placeholder: string } = { placeholder: this.placeholder };
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
            let attribute: string[] = ['required', 'minlength', 'maxlength'];
            for (let i: number = 0; i < attribute.length; i++) {
            if (this.element.hasAttribute(attribute[i])) {
            let attr: string = this.element.getAttribute(attribute[i]);
            this.textarea.setAttribute(attribute[i], attr);
            this.element.removeAttribute(attribute[i]);
            }
          }
        }
    }

    private checkAttributes(attrs: NamedNodeMap): void {
        for (let i: number = 0; i < attrs.length; i++) {
            let key: string = attrs[i].nodeName;
            if (key === 'disabled') {
                this.setProperties({enabled: false}, true);
            } else if (key === 'readonly') {
                this.setProperties({readonly: true}, true);
            } else if (key === 'placeholder') {
                this.setProperties({placeholder: attrs[i].nodeValue}, true);
            }
        }
    }

    /**
     * To Initialize the control rendering
     * @private
     */
    public render(): void {
        this.respectiveElement = (this.isHiddenInput) ? this.textarea : this.element;
        this.textboxWrapper = Input.createInput({
            element: this.respectiveElement,
            floatLabelType: this.floatLabelType,
            properties: {
                enabled: this.enabled,
                enableRtl: this.enableRtl,
                cssClass: this.cssClass,
                readonly: this.readonly,
                placeholder: this.placeholder,
                showClearButton: this.showClearButton
            }
        });
        if (this.isHiddenInput) {
            this.respectiveElement.parentNode.insertBefore( this.element , this.respectiveElement);
        }
        this.wireEvents();
        if (this.respectiveElement.value !== '') {
            this.value = this.respectiveElement.value;
        }
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
        this.previousValue = this.value;
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
        if (this.enabled) {
            this.bindClearEvent();
        }
    }

    private resetValue(value: string) : void {
        let prevOnChange: boolean = this.isProtectedOnChange;
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
        let label: HTMLElement = this.textboxWrapper.container.querySelector('.e-float-text');
        if (isNullOrUndefined(this.initialValue) || this.initialValue === '') {
            label.classList.add('e-label-bottom');
            label.classList.remove('e-label-top');
        } else if (this.initialValue !== '') {
            label.classList.add('e-label-top');
            label.classList.remove('e-label-bottom');
        }
    }

    private focusHandler(args: MouseEvent | TouchEvent | KeyboardEvent): void {
        let eventArgs: FocusInEventArgs = {
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
        let eventArgs: FocusOutEventArgs = {
            container: this.textboxWrapper.container,
            event: args,
            value: this.value
        };
        this.trigger('blur', eventArgs);
    }

    private inputHandler(args: KeyboardEvent): void {
        // tslint:disable-next-line
        let textboxObj: any = this;
        let eventArgs: InputEventArgs = {
            event: args,
            value: this.respectiveElement.value,
            previousValue: this.value,
            container: this.textboxWrapper.container
        };
        /* istanbul ignore next */
        if (this.isAngular) {
            textboxObj.localChange({ value: this.respectiveElement.value });
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
        let eventArgs: ChangedEventArgs = {
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
            EventHandler.add(this.textboxWrapper.clearButton, 'mousedown touchstart', this.resetInputHandler, this);
        }
    }

    private resetInputHandler(event?: MouseEvent): void {
        event.preventDefault();
        if (!(this.textboxWrapper.clearButton.classList.contains(HIDE_CLEAR))) {
            let previousValue: string = this.value;
            Input.setValue('', this.respectiveElement, this.floatLabelType, this.showClearButton);
            if (this.isHiddenInput) {
                this.element.value = this.respectiveElement.value;
                }
            this.setProperties({value: this.respectiveElement.value}, true);
            let eventArgs: InputEventArgs = {
                event: event,
                value: this.respectiveElement.value,
                previousValue: previousValue,
                container: this.textboxWrapper.container
            };
            this.trigger('input', eventArgs);
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
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also, it maintains the initial TextBox element from the DOM.
     * @method destroy
     * @return {void}
     */

    public destroy(): void {
        this.unWireEvents();
        this.respectiveElement.classList.remove('e-input');
        this.removeAttributes(['aria-placeholder', 'aria-disabled', 'aria-readonly', 'aria-labelledby']);
        this.textboxWrapper.container.parentElement.appendChild(this.respectiveElement);
        detach(this.textboxWrapper.container);
        this.textboxWrapper = null;
        super.destroy();
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
     * Adding the multiple attributes as key-value pair to the TextBox element.
     * @param { { [key: string]: string } } attributes - Specifies the attributes to be add to TextBox element.
     * @return {void}
     */
    public addAttributes(attributes: { [key: string]: string }): void {
        for (let key of Object.keys(attributes)) {
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
     * @param { string[] } attributes - Specifies the attributes name to be removed from TextBox element.
     * @return {void}
     */
    public removeAttributes(attributes: string[]): void {
        for (let key of attributes) {
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
}