import { Component, Property, Event, EmitType, EventHandler, L10n, setValue, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, detach, Internationalization, getUniqueID } from '@syncfusion/ej2-base';
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
    /** Returns the original event. */
    isInteraction?: boolean;
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
export class TextBox extends Component<HTMLInputElement> implements INotifyPropertyChanged {

    private textboxWrapper: InputObject;
    private l10n: L10n;
    private previousValue: string = null;
    private cloneElement: HTMLInputElement;
    private globalize: Internationalization;

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
    public change: ChangedEventArgs;

    /**
     * Triggers when the TextBox has focus-out.
     * @event
     */
    @Event()
    public blur: FocusOutEventArgs;

    /**
     * Triggers when the TextBox gets focus.
     * @event
     */
    @Event()
    public focus: FocusInEventArgs;

    /**
     * Triggers each time when the value of TextBox has changed.
     * @event
     */
    @Event()
    public input: InputEventArgs;

    constructor(options?: TextBoxModel, element?: string | HTMLInputElement) {
        super(options, <HTMLInputElement | string>element);
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
                    Input.addFloating(this.element, this.floatLabelType, this.placeholder);
                    break;
                case 'enabled':
                    Input.setEnabled(this.enabled, this.element, this.floatLabelType, this.textboxWrapper.container);
                    break;
                case 'value':
                    let prevOnChange: boolean = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    if (!this.isBlank(this.value)) {
                        this.value = this.value.toString();
                    }
                    this.isProtectedOnChange = prevOnChange;
                    Input.setValue(this.value, this.element, this.floatLabelType, this.showClearButton);
                    this.raiseChangeEvent();
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.element);
                    break;
                case 'type':
                    this.element.setAttribute('type', this.type);
                    this.raiseChangeEvent();
                    break;
                case 'showClearButton':
                    Input.setClearButton(this.showClearButton, this.element, this.textboxWrapper);
                    this.bindClearEvent();
                    break;
                case 'enableRtl':
                    Input.setEnableRtl(this.enableRtl, [this.textboxWrapper.container]);
                    break;
                case 'placeholder':
                    Input.setPlaceholder(this.placeholder, this.element);
                    break;
                case 'cssClass':
                    Input.setCssClass(this.cssClass, [this.textboxWrapper.container]);
                    break;
                case 'locale':
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    Input.setPlaceholder(this.placeholder, this.element);
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
        /* istanbul ignore next */
        if (this.element.tagName === 'EJS-TEXTBOX') {
            let ejInstance: Object = getValue('ej2_instances', this.element);
            let inputElement: HTMLInputElement = <HTMLInputElement>this.createElement('input');
            let index: number = 0;
            for (index; index < this.element.attributes.length; index++) {
                inputElement.setAttribute(this.element.attributes[index].nodeName, this.element.attributes[index].nodeValue);
                inputElement.innerHTML = this.element.innerHTML;
            }
            this.element.appendChild(inputElement);
            this.element = inputElement;
            setValue('ej2_instances', ejInstance, this.element);
        }
        let attributes: NamedNodeMap = this.element.attributes;
        this.checkAttributes(attributes);
        this.element.setAttribute('type', this.type);
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
        this.textboxWrapper = Input.createInput({
            element: this.element,
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
        this.wireEvents();
        if (this.element.value !== '') {
            this.value = this.element.value;
        }
        if (!isNullOrUndefined(this.value)) {
            Input.setValue(this.value, this.element, this.floatLabelType, this.showClearButton);
        }
    }

    private wireEvents(): void {
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'blur', this.focusOutHandler, this);
        EventHandler.add(this.element, 'input', this.inputHandler, this);
        EventHandler.add(this.element, 'change', this.changeHandler, this);
        if (this.enabled) {
            this.bindClearEvent();
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
        if (!(this.previousValue === null && this.value === null && this.element.value === '') &&
        (this.previousValue !== this.element.value)) {
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
        let eventArgs: InputEventArgs = {
            event: args,
            value: this.element.value,
            previousValue: this.value,
            container: this.textboxWrapper.container
        };
        this.trigger('input', eventArgs);
    }

    private changeHandler(args: Event): void {
        this.setProperties({value: this.element.value}, true);
        this.raiseChangeEvent(args, true);
    }

    private raiseChangeEvent(event?: Event, interaction?: boolean): void {
        let eventArgs: ChangedEventArgs = {
            event: event,
            value: this.value,
            previousValue: this.previousValue,
            container: this.textboxWrapper.container,
            isInteraction: interaction ? interaction : false
        };
        this.trigger('change', eventArgs);
        this.previousValue = this.value;
    }

    private bindClearEvent(): void {
        if (this.showClearButton) {
            EventHandler.add(this.textboxWrapper.clearButton, 'mousedown touchstart', this.resetInputHandler, this);
        }
    }

    private resetInputHandler(event?: MouseEvent): void {
        event.preventDefault();
        if (!(this.textboxWrapper.clearButton.classList.contains(HIDE_CLEAR))) {
            Input.setValue('', this.element, this.floatLabelType, this.showClearButton);
        }
    }

    private unWireEvents(): void {
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'blur', this.focusOutHandler);
        EventHandler.remove(this.element, 'input', this.inputHandler);
        EventHandler.remove(this.element, 'change', this.changeHandler);
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also, it maintains the initial TextBox element from the DOM.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.unWireEvents();
        this.textboxWrapper.container.parentElement.appendChild(this.cloneElement);
        detach(this.textboxWrapper.container);
        this.textboxWrapper = null;
        this.cloneElement.classList.remove(ROOT, CONTROL);
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
                Input.setEnabled(this.enabled, this.element, this.floatLabelType, this.textboxWrapper.container);
            } else if (key === 'readonly') {
                this.setProperties({ readonly: true }, true);
                Input.setReadonly(this.readonly, this.element);
            } else if (key === 'class') {
                this.element.classList.add(attributes[key]);
            } else if (key === 'placeholder') {
                this.setProperties({ placeholder: attributes[key] }, true);
                Input.setPlaceholder(this.placeholder, this.element);
            } else {
                this.element.setAttribute(key, attributes[key]);
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
                Input.setEnabled(this.enabled, this.element, this.floatLabelType, this.textboxWrapper.container);
            } else if (key === 'readonly') {
                this.setProperties({ readonly: false }, true);
                Input.setReadonly(this.readonly, this.element);
            } else if (key === 'placeholder') {
                this.setProperties({ placeholder: null }, true);
                Input.setPlaceholder(this.placeholder, this.element);
            } else {
                this.element.removeAttribute(key);
            }
        }
    }
}