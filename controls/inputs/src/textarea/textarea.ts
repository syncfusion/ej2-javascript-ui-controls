import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, isNullOrUndefined, setValue, getValue } from '@syncfusion/ej2-base';
import { detach, getUniqueID, Event, EventHandler, EmitType, Internationalization, L10n, addClass, removeClass, closest, formatUnit } from '@syncfusion/ej2-base';
import { FloatLabelType, Input, InputObject, TEXTBOX_FOCUS } from '../input/input';
import { FocusInEventArgs, FocusOutEventArgs, InputEventArgs, ChangedEventArgs } from '../textbox/textbox';
import { TextAreaModel } from './textarea-model';

const HIDE_CLEAR: string = 'e-clear-icon-hide';
const AUTO_WIDTH: string = 'e-auto-width';
const RESIZE_X: string = 'e-resize-x';
const RESIZE_Y: string = 'e-resize-y';
const RESIZE_XY: string = 'e-resize-xy';
const RESIZE_NONE: string = 'e-resize-none';
export type Resize = 'Vertical' | 'Horizontal' | 'Both' | 'None';

@NotifyPropertyChanges
export class TextArea extends Component<HTMLTextAreaElement> implements INotifyPropertyChanged {
    private textareaWrapper: InputObject;
    private textareaOptions: TextAreaModel;
    private globalize: Internationalization;
    private l10n: L10n;
    private previousValue: string = null;
    private formElement: HTMLElement;
    private isForm: boolean = false;
    private initialValue: string;
    private inputPreviousValue: string = null;
    private preventChange: boolean;
    private clearButton: HTMLElement;

    /**
     * Specifies the boolean value whether the TextArea allows user to change the text.
     *
     * @default false
     */
    @Property(false)
    public readonly: boolean;

    /**
     * Sets the content of the TextArea.
     *
     * @default null
     */
    @Property(null)
    public value: string;

    /**
     * Specifies the floating label behavior of the TextArea that the placeholder text floats above the TextArea based on the below values.
     * Possible values are:
     * * `Never` - The placeholder text should not be float ever.
     * * `Always` - The placeholder text floats above the TextArea always.
     * * `Auto` - The placeholder text floats above the TextArea while focusing or enter a value in TextArea.
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
     * Specifies the text that is shown as a hint/placeholder until the user focus or enter a value in TextArea.
     * The property is depending on the floatLabelType property.
     *
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };

    /**
     * Specifies a Boolean value that indicates whether the TextArea allow user to interact with it.
     *
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Specifies a Boolean value that indicates whether the clear button is displayed in TextArea.
     *
     * @default false
     */
    @Property(false)
    public showClearButton: boolean;

    /**
     * Enable or disable persisting TextArea state between page reloads. If enabled, the `value` state will be persisted.
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Specifies the width of the TextArea component.
     *
     * @default null
     */
    @Property(null)
    public width: number | string;

    /**
     * Specifies the resize mode of textarea.
     * possible values are:
     * * `Vertical` - The textarea element can be resized vertically.
     * * `Horizontal` - The textarea element can be resized horizontally.
     * * `Both` - The textarea element can be resized both vertically and horizontally.
     * * `None` - The textarea element cannot be resized.
     *
     * @default Both
     */
    @Property('Both')
    public resizeMode: Resize;

    /**
     * Specifies the maximum number of characters allowed in TextArea.
     *
     * @aspType int?
     */
    @Property(null)
    public maxLength: number;

    /**
     * specifies the visible width of the textarea, measured in average character widths.
     *
     * @aspType int?
     */
    @Property(null)
    public cols: number;

    /**
     * specifies the visible height of the textarea, measured in lines
     *
     * @aspType int?
     */
    @Property(null)
    public rows: number;

    /**
     * Triggers when the TextArea component is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the TextArea component is destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * Triggers when the content of TextArea has changed and gets focus-out.
     *
     * @event change
     */
    @Event()
    public change: EmitType<ChangedEventArgs>;

    /**
     * Triggers when the TextArea has focus-out.
     *
     * @event blur
     */
    @Event()
    public blur: EmitType<FocusOutEventArgs>;

    /**
     * Triggers when the TextArea gets focus.
     *
     * @event focus
     */
    @Event()
    public focus: EmitType<FocusInEventArgs>;

    /**
     * Triggers each time when the value of TextArea has changed.
     *
     * @event input
     */
    @Event()
    public input: EmitType<InputEventArgs>;

    public constructor(options?: TextAreaModel, element?: string | HTMLTextAreaElement ) {
        super(options, <string | HTMLTextAreaElement> element);
        this.textareaOptions = options;
    }

    /**
     * Calls internally if any of the property value is changed.
     *
     * @param {TextAreaModel} newProp - Returns the dynamic property value of the component.
     * @param {TextAreaModel} oldProp - Returns the previous property value of the component.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: TextAreaModel, oldProp: TextAreaModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'floatLabelType':
                Input.removeFloating(this.textareaWrapper);
                Input.addFloating(this.element, this.floatLabelType, this.placeholder);
                if (this.floatLabelType === 'Never') {
                    this.element.removeAttribute('aria-labelledby');
                }
                break;
            case 'enabled':
                Input.setEnabled(this.enabled, this.element, this.floatLabelType, this.textareaWrapper.container);
                this.bindClearEvent();
                if (!this.enabled && this.resizeMode !== 'None') {
                    this.element.classList.remove(this.getCurrentResizeClass(this.resizeMode));
                    this.element.classList.add(RESIZE_NONE);
                } else {
                    this.element.classList.add(this.getCurrentResizeClass(this.resizeMode));
                }
                break;
            case 'width':
                if (this.resizeMode !== 'None' && this.resizeMode !== 'Vertical') {
                    this.setElementWidth(newProp.width);
                    this.textareaWrapper.container.classList.add(AUTO_WIDTH);
                } else {
                    if (this.textareaWrapper.container.classList.contains(AUTO_WIDTH)) {
                        this.textareaWrapper.container.classList.remove(AUTO_WIDTH);
                    }
                    Input.setWidth(newProp.width, this.textareaWrapper.container);
                }
                break;
            case 'value': {
                const prevOnChange: boolean = this.isProtectedOnChange;
                this.isProtectedOnChange = true;
                if (!Input.isBlank(this.value)) {
                    this.value = this.value.toString();
                }
                this.isProtectedOnChange = prevOnChange;
                Input.setValue(this.value, this.element, this.floatLabelType, this.showClearButton);
                this.inputPreviousValue = this.element.value;
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
                this.updateHTMLAttributesToElement();
                this.updateHTMLAttributesToWrapper();
                this.checkAttributes(true);
                Input.validateInputType(this.textareaWrapper.container, this.element);
            }
                break;
            case 'readonly':
                Input.setReadonly(this.readonly, this.element);
                if (this.readonly) {
                    this.element.setAttribute('aria-readonly', 'true');
                } else {
                    this.element.removeAttribute('aria-readonly');
                }
                break;
            case 'showClearButton':
                Input.setClearButton(this.showClearButton, this.element, this.textareaWrapper);
                this.bindClearEvent();
                break;
            case 'enableRtl':
                Input.setEnableRtl(this.enableRtl, [this.textareaWrapper.container]);
                break;
            case 'placeholder':
                Input.setPlaceholder(this.placeholder, this.element);
                Input.calculateWidth(this.element, this.textareaWrapper.container);
                break;
            case 'cssClass':
                Input.updateCssClass(newProp.cssClass, oldProp.cssClass, this.textareaWrapper.container);
                break;
            case 'locale':
                this.globalize = new Internationalization(this.locale);
                this.l10n.setLocale(this.locale);
                this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                Input.setPlaceholder(this.placeholder, this.element);
                break;
            case 'rows':
                if (this.rows) {
                    this.element.setAttribute('rows', this.rows.toString());
                }
                break;
            case 'cols':
                if (this.cols) {
                    this.element.setAttribute('cols', this.cols.toString());
                    if (this.width == null) {
                        this.textareaWrapper.container.classList.add(AUTO_WIDTH);
                    }
                }
                break;
            case 'maxLength':
                if (this.maxLength) {
                    this.element.setAttribute('maxlength', this.maxLength.toString());
                }
                break;
            case 'resizeMode':
                if (this.enabled) {
                    if (this.element.classList.contains(this.getCurrentResizeClass(oldProp.resizeMode))) {
                        this.element.classList.remove(this.getCurrentResizeClass(oldProp.resizeMode));
                    }
                    this.element.classList.add(this.getCurrentResizeClass(this.resizeMode));
                    if (this.element.style.width && (this.resizeMode === 'None' || this.resizeMode === 'Vertical')) {
                        Input.setWidth(this.element.style.width, this.textareaWrapper.container);
                    } else {
                        const currentWidth: number = this.element.offsetWidth;
                        this.element.style.width = currentWidth + 'px';
                        if (this.textareaWrapper.container.style.width) {
                            this.textareaWrapper.container.style.width = '';
                        }
                    }
                    this.setWrapperWidth();
                }
                break;
            }
        }
    }

    protected preRender(): void {
        this.formElement = closest(this.element, 'form') as HTMLFormElement;
        if (!isNullOrUndefined(this.formElement)) {
            this.isForm = true;
        }
        /* istanbul ignore next */
        if (this.element.tagName === 'EJS-TEXTAREA' || this.element.tagName === 'EJS-SMARTTEXTAREA') {
            const ejInstance: Object = getValue('ej2_instances', this.element);
            const inputElement: string | HTMLTextAreaElement = <HTMLTextAreaElement>this.createElement('textarea');
            let index: number = 0;
            for (index; index < this.element.attributes.length; index++) {
                const attributeName: string = this.element.attributes[index as number].nodeName;
                if (attributeName !== 'id' && attributeName !== 'class') {
                    inputElement.setAttribute(attributeName, this.element.attributes[index as number].nodeValue);
                    inputElement.innerHTML = this.element.innerHTML;
                    if (attributeName === 'name') {
                        this.element.removeAttribute('name');
                    }
                } else if (attributeName === 'class') {
                    inputElement.setAttribute(attributeName, this.element.className.split(' ').filter((item: string) => item.indexOf('ng-') !== 0).join(' '));
                }
            }
            this.element.appendChild(inputElement);
            this.element = inputElement;
            setValue('ej2_instances', ejInstance, this.element);
        }
        this.updateHTMLAttributesToElement();
        this.checkAttributes(false);
        if (( isNullOrUndefined(this.textareaOptions) || (this.textareaOptions['value'] === undefined)) && this.element.value !== '') {
            this.setProperties({value: this.element.value}, true);
        }
        this.globalize = new Internationalization(this.locale);
        const localeText: { placeholder: string } = { placeholder: this.placeholder };
        this.l10n = new L10n('textarea', localeText, this.locale);
        if (this.l10n.getConstant('placeholder') !== '') {
            this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        }
        if (!this.element.hasAttribute('id')) {
            this.element.setAttribute('id', getUniqueID('textbox'));
        }
        if (!this.element.hasAttribute('name')) {
            this.element.setAttribute('name', this.element.getAttribute('id'));
        }
        if (this.rows) {
            this.element.setAttribute('rows', this.rows.toString());
        }
        if (this.cols) {
            this.element.setAttribute('cols', this.cols.toString());
        }
        if (this.maxLength) {
            this.element.setAttribute('maxlength', this.maxLength.toString());
        }
        if (!this.element.style.resize && this.enabled) {
            this.element.classList.add(this.getCurrentResizeClass(this.resizeMode));
        }
        if (this.enabled) {
            this.element.setAttribute('aria-multiline', 'true');
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
            updatedCssClassValue = Input.getInputValidClassList(this.cssClass);
        }
        this.textareaWrapper = Input.createInput({
            element: this.element,
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
        this.updateHTMLAttributesToWrapper();
        this.wireEvents();
        if (!isNullOrUndefined(this.value)) {
            Input.setValue(this.value, this.element, this.floatLabelType, this.showClearButton);
        }
        if (!isNullOrUndefined(this.value)) {
            this.initialValue = this.value;
            if (!this.isAngular) {
                this.element.setAttribute('value', this.initialValue);
            }
        }
        this.previousValue = this.value;
        this.inputPreviousValue = this.value;
        this.element.defaultValue = this.element.value;
        Input.setWidth(this.width, this.textareaWrapper.container);
        this.setWrapperWidth();
        this.renderComplete();
    }

    public getModuleName(): string {
        return 'textarea';
    }

    /**
     * Gets the properties to be maintained in the persisted state.
     *
     * @returns {string} - Returns the string value.
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['value'];
        return this.addOnPersist(keyEntity);
    }

    private checkAttributes(isDynamic: boolean): void {
        const attrs: string[]  = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['placeholder', 'disabled', 'value', 'readonly'];
        for (const key of attrs) {
            if (!isNullOrUndefined(this.element.getAttribute(key))) {
                switch (key) {
                case 'disabled':
                    if (( isNullOrUndefined(this.textareaOptions) || (this.textareaOptions['enabled'] === undefined)) || isDynamic) {
                        const enabled: boolean = this.element.getAttribute(key) === 'disabled' || this.element.getAttribute(key) === '' ||
                            this.element.getAttribute(key) === 'true' ? false : true;
                        this.setProperties({enabled: enabled}, !isDynamic);
                    }
                    break;
                case 'readonly':
                    if (( isNullOrUndefined(this.textareaOptions) || (this.textareaOptions['readonly'] === undefined)) || isDynamic) {
                        const readonly: boolean = this.element.getAttribute(key) === 'readonly' || this.element.getAttribute(key) === ''
                            || this.element.getAttribute(key) === 'true' ? true : false;
                        this.setProperties({readonly: readonly}, !isDynamic);
                    }
                    break;
                case 'placeholder':
                    if (( isNullOrUndefined(this.textareaOptions) || (this.textareaOptions['placeholder'] === undefined)) || isDynamic) {
                        this.setProperties({placeholder: this.element.placeholder}, !isDynamic);
                    }
                    break;
                case 'value':
                    if ((( isNullOrUndefined(this.textareaOptions) || (this.textareaOptions['value'] === undefined)) || isDynamic) && this.element.value !== '') {
                        this.setProperties({value: this.element.value}, !isDynamic);
                    }
                    break;
                }
            }
        }
    }

    protected wireEvents(): void {
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'blur', this.focusOutHandler, this);
        EventHandler.add(this.element, 'keydown', this.keydownHandler, this);
        EventHandler.add(this.element, 'input', this.inputHandler, this);
        EventHandler.add(this.element, 'change', this.changeHandler, this);
        if (this.isForm) {
            EventHandler.add(this.formElement, 'reset', this.resetForm, this);
        }
        this.bindClearEvent();
    }

    protected unWireEvents(): void {
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'blur', this.focusOutHandler);
        EventHandler.remove(this.element, 'keydown', this.keydownHandler);
        EventHandler.remove(this.element, 'input', this.inputHandler);
        EventHandler.remove(this.element, 'change', this.changeHandler);
        if (this.isForm) {
            EventHandler.remove(this.formElement, 'reset', this.resetForm);
        }
    }

    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also, it maintains the initial TextArea element from the DOM.
     *
     * @method destroy
     * @returns {void}
     */

    public destroy(): void {
        this.unWireEvents();
        if (this.showClearButton) {
            this.clearButton = document.getElementsByClassName('e-clear-icon')[0] as HTMLElement;
        }
        this.element.value = this.element.defaultValue;
        this.element.classList.remove('e-input', RESIZE_X, RESIZE_Y, RESIZE_XY, RESIZE_NONE);
        if (this.textareaWrapper.container.style.width.includes('%')) {
            EventHandler.remove(this.element, 'mousemove', this.onMouseMove);
        }
        this.removeAttributes(['aria-disabled', 'aria-readonly', 'aria-labelledby', 'aria-multiline']);
        if (!isNullOrUndefined(this.textareaWrapper)) {
            this.textareaWrapper.container.insertAdjacentElement('afterend', this.element);
            detach(this.textareaWrapper.container);
        }
        this.textareaWrapper = null;
        Input.destroy({
            element: this.element,
            floatLabelType: this.floatLabelType,
            properties: this.properties
        }, this.clearButton);
        this.formElement = null;
        super.destroy();
    }

    private focusHandler(args: MouseEvent | TouchEvent | KeyboardEvent): void {
        const eventArgs: FocusInEventArgs = {
            container: this.textareaWrapper.container,
            event: args,
            value: this.value
        };
        this.trigger('focus', eventArgs);
    }

    private focusOutHandler(args: MouseEvent | TouchEvent | KeyboardEvent): void {
        if (!(this.previousValue === null && this.value === null) &&
        (this.previousValue !== this.value)) {
            this.raiseChangeEvent(args, true);
        }
        const eventArgs: FocusOutEventArgs = {
            container: this.textareaWrapper.container,
            event: args,
            value: this.value
        };
        this.trigger('blur', eventArgs);
    }

    protected keydownHandler (args: KeyboardEvent): void {
        if ((args.keyCode === 13 || args.keyCode === 9) && !((this.previousValue === null || this.previousValue === '') && (this.value === null || this.value === '') && this.element.value === '')) {
            this.setProperties({ value: this.element.value }, true);
        }
    }

    private inputHandler(args: KeyboardEvent): void {
        const textareaObj: any = null || this;
        const eventArgs: InputEventArgs = {
            event: args,
            value: this.element.value,
            previousValue: this.inputPreviousValue,
            container: this.textareaWrapper.container
        };
        this.inputPreviousValue = this.element.value;
        /* istanbul ignore next */
        if (this.isAngular) {
            textareaObj.localChange({ value: this.element.value });
            this.preventChange = true;
        }
        if (this.isVue) {
            this.preventChange = true;
        }
        this.trigger('input', eventArgs);
        args.stopPropagation();
    }

    private changeHandler(args: Event): void {
        this.setProperties({value: this.element.value}, true);
        if (this.previousValue !== this.value) {
            this.raiseChangeEvent(args, true);
        }
        args.stopPropagation();
    }

    private raiseChangeEvent(event?: Event, interaction?: boolean): void {
        const eventArgs: ChangedEventArgs = {
            event: event,
            value: this.value,
            previousValue: this.previousValue,
            container: this.textareaWrapper.container,
            isInteraction: interaction ? interaction : false,
            isInteracted: interaction ? interaction : false
        };
        this.preventChange = false;
        this.trigger('change', eventArgs);
        this.previousValue = this.value;
    }

    private updateHTMLAttributesToWrapper(): void {
        Input.updateHTMLAttributesToWrapper(this.htmlAttributes, this.textareaWrapper.container);
    }

    private updateHTMLAttributesToElement(): void {
        Input.updateHTMLAttributesToElement(this.htmlAttributes, this.element);
    }

    private bindClearEvent(): void {
        if (this.showClearButton) {
            if (this.enabled) {
                EventHandler.add(this.textareaWrapper.clearButton, 'mousedown touchstart', this.resetInputHandler, this);
            } else {
                EventHandler.remove(this.textareaWrapper.clearButton, 'mousedown touchstart', this.resetInputHandler);
            }
        }
    }

    private resetInputHandler(event?: MouseEvent): void {
        event.preventDefault();
        if (!(this.textareaWrapper.clearButton.classList.contains(HIDE_CLEAR)) || this.textareaWrapper.container.classList.contains('e-static-clear')) {
            Input.setValue('', this.element, this.floatLabelType, this.showClearButton);
            this.setProperties({value: this.element.value}, true);
        }
        const eventArgs: InputEventArgs = {
            event: event,
            value: this.element.value,
            previousValue: this.inputPreviousValue,
            container: this.textareaWrapper.container
        };
        this.trigger('input', eventArgs);
        this.inputPreviousValue = this.element.value;
        this.raiseChangeEvent(event, true);
        if (closest(this.element, 'form')) {
            const element: Element = this.element;
            const keyupEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    }

    /**
     * Adding the multiple attributes as key-value pair to the TextArea element.
     *
     * @param {string} attributes - Specifies the attributes to be add to TextArea element.
     * @returns {void}
     */
    public addAttributes(attributes: { [key: string]: string }): void {
        for (const key of Object.keys(attributes)) {
            if (key === 'disabled') {
                this.setProperties({ enabled: false }, true);
                Input.setEnabled(this.enabled, this.element, this.floatLabelType, this.textareaWrapper.container);
            } else if (key === 'readonly') {
                this.setProperties({ readonly: true }, true);
                Input.setReadonly(this.readonly, this.element);
            } else if (key === 'class') {
                this.element.classList.add(attributes[`${key}`]);
            } else if (key === 'placeholder') {
                this.setProperties({ placeholder: attributes[`${key}`] }, true);
                Input.setPlaceholder(this.placeholder, this.element);
            } else {
                this.element.setAttribute(key, attributes[`${key}`]);
            }
        }
    }

    /**
     * Removing the multiple attributes as key-value pair to the TextArea element.
     *
     * @param { string[] } attributes - Specifies the attributes name to be removed from TextArea element.
     * @returns {void}
     */
    public removeAttributes(attributes: string[]): void {
        for (const key of attributes) {
            if (key === 'disabled') {
                this.setProperties({ enabled: true }, true);
                Input.setEnabled(this.enabled, this.element, this.floatLabelType, this.textareaWrapper.container);
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

    /**
     * Sets the focus to widget for interaction.
     *
     * @returns {void}
     */
    public focusIn(): void {
        if (document.activeElement !== this.element && this.enabled) {
            this.element.focus();
            if (this.textareaWrapper.container.classList.contains('e-input-group')
             || this.textareaWrapper.container.classList.contains('e-outline')
             || this.textareaWrapper.container.classList.contains('e-filled')) {
                addClass([this.textareaWrapper.container], [TEXTBOX_FOCUS]);
            }
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
            if (this.textareaWrapper.container.classList.contains('e-input-group')
             || this.textareaWrapper.container.classList.contains('e-outline')
             || this.textareaWrapper.container.classList.contains('e-filled')) {
                removeClass([this.textareaWrapper.container], [TEXTBOX_FOCUS]);
            }
        }
    }

    /**
     * Sets up the width for the textarea wrapper.
     *
     * @returns {void}
     */
    private setWrapperWidth(): void {
        if (this.enabled && ((this.resizeMode !== 'None' && this.resizeMode !== 'Vertical') || (this.cols || this.element.getAttribute('cols')))) {
            if (this.resizeMode !== 'None' && this.resizeMode !== 'Vertical' && !this.textareaWrapper.container.style.width.includes('%')) {
                this.setElementWidth(this.textareaWrapper.container.style.width);
            }
            if (!this.textareaWrapper.container.style.width.includes('%')) {
                this.textareaWrapper.container.classList.add(AUTO_WIDTH);
                this.textareaWrapper.container.style.width = '';
            }
            if (this.textareaWrapper.container.style.width.includes('%')) {
                EventHandler.add(this.element, 'mousemove', this.onMouseMove, this);
            }
        } else {
            if (this.textareaWrapper.container.classList.contains(AUTO_WIDTH)) {
                this.textareaWrapper.container.classList.remove(AUTO_WIDTH);
            }
        }
    }

    private onMouseMove(): void {
        if (this.textareaWrapper.container.style.width !== 'auto') {
            const initialWidth: string = this.element.style.width;
            setTimeout(() => {
                const currentWidth: string = this.element.style.width;
                if (initialWidth !== currentWidth) {
                    this.textareaWrapper.container.style.width = 'auto';
                }
            }, 5);
        }
    }

    private resetForm() : void {
        if (this.isAngular) {
            this.resetValue('');
        } else {
            this.resetValue(this.initialValue);
        }
        if (!isNullOrUndefined(this.textareaWrapper)) {
            const label: HTMLElement = this.textareaWrapper.container.querySelector('.e-float-text');
            if (!isNullOrUndefined(label) && this.floatLabelType !== 'Always') {
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
    private resetValue(value: string) : void {
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.value = value;
        if (value == null && this.textareaWrapper.container.classList.contains('e-valid-input') && !(this.floatLabelType === 'Always' && this.textareaWrapper.container.classList.contains('e-outline'))) {
            this.textareaWrapper.container.classList.remove('e-valid-input');
        }
        this.isProtectedOnChange = prevOnChange;
    }
    private setElementWidth(width: number | string): void {
        if (typeof width === 'number') {
            this.element.style.width = formatUnit(width);
        } else if (typeof width === 'string') {
            this.element.style.width = (width.match(/px|%|em/)) ? <string>(width) : <string>(formatUnit(width));
        }
    }

    private getCurrentResizeClass(resizeMode: string): string {
        return resizeMode === 'None' ? RESIZE_NONE : (resizeMode === 'Both' ? RESIZE_XY : resizeMode === 'Horizontal' ? RESIZE_X : RESIZE_Y );
    }
}
