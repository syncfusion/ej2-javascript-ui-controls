import { Component, INotifyPropertyChanged, rippleEffect, NotifyPropertyChanges, Property, closest } from '@syncfusion/ej2-base';
import { addClass, getInstance, getUniqueID, isRippleEnabled, removeClass, attributes, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BaseEventArgs, detach, EmitType, Event, EventHandler, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { wrapperInitialize, rippleMouseHandler } from './../common/common';
import { RadioButtonModel } from './radio-button-model';
/**
 * Defines the label position of Radio Button.
 * ```props
 * After :- When the label is positioned After, it appears to the right of the Radio Button.
 * Before :- When the label is positioned Before, it appears to the left of the Radio Button.
 * ```
 */
export type RadioLabelPosition = 'After' | 'Before';

const LABEL: string = 'e-label';
const RIPPLE: string = 'e-ripple-container';
const RTL: string = 'e-rtl';
const WRAPPER: string = 'e-radio-wrapper';
const ATTRIBUTES: string[] = ['title', 'class', 'style', 'disabled', 'readonly', 'name', 'value'];

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
@NotifyPropertyChanges
export class RadioButton extends Component<HTMLInputElement> implements INotifyPropertyChanged {
    private tagName: string;
    private isFocused: boolean = false;
    private formElement: HTMLFormElement;
    private initialCheckedValue: boolean;
    private angularValue: string;
    private isVue: boolean;
    private wrapper: Element;

    /**
     * Event trigger when the RadioButton state has been changed by user interaction.
     *
     * @event change
     */
    @Event()
    public change: EmitType<ChangeArgs>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Specifies a value that indicates whether the RadioButton is `checked` or not.
     * When set to `true`, the RadioButton will be in `checked` state.
     *
     * @default false
     */
    @Property(false)
    public checked: boolean;

    /**
     * Defines class/multiple classes separated by a space in the RadioButton element.
     * You can add custom styles to the RadioButton by using this property.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the RadioButton is `disabled` or not.
     * When set to `true`, the RadioButton will be in `disabled` state.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines the caption for the RadioButton, that describes the purpose of the RadioButton.
     *
     * @default ''
     */
    @Property('')
    public label: string;

    /**
     * Positions label `before`/`after` the RadioButton.
     * The possible values are:
     * * Before: The label is positioned to left of the RadioButton.
     * * After: The label is positioned to right of the RadioButton.
     *
     * @default 'After'
     */
    @Property('After')
    public labelPosition: RadioLabelPosition;

    /**
     * Defines `name` attribute for the RadioButton.
     * It is used to reference form data (RadioButton value) after a form is submitted.
     *
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Defines `value` attribute for the RadioButton.
     * It is a form data passed to the server when submitting the form.
     *
     * @default ''
     */
    @Property('')
    public value: string;

    /**
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default false
     */
    @Property(false)
    public enableHtmlSanitizer: boolean;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };

    /**
     * Constructor for creating the widget
     *
     * @private
     * @param {RadioButtonModel} options - Specifies Radio button model
     * @param {string | HTMLInputElement} element - Specifies target element
     */
    constructor(options?: RadioButtonModel, element?: string | HTMLInputElement) {
        super(options, <string | HTMLInputElement>element);
    }

    private changeHandler(event: Event): void {
        this.checked = true; this.dataBind();
        let value: string = this.element.getAttribute('value');
        value = this.isVue && value ? this.element.value : this.value;
        this.trigger('change', <ChangeArgs>{ value: value, event: event });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((this as any).isAngular) {
            event.stopPropagation();
        }
    }

    private updateChange(): void {
        let input: HTMLInputElement; let instance: RadioButton;
        const radioGrp: NodeListOf<Element> = this.getRadioGroup();
        for (let i: number = 0; i < radioGrp.length; i++) {
            input = radioGrp[i as number] as HTMLInputElement;
            if (input !== this.element) {
                instance = getInstance(input, RadioButton) as RadioButton; instance.checked = false;
                if (this.tagName === 'EJS-RADIOBUTTON') { instance.angularValue = this.value; }
            }
        }
    }

    /**
     * Destroys the widget.
     *
     * @returns {void}
     */
    public destroy(): void {
        const radioWrap: Element = this.wrapper;
        super.destroy();
        if (radioWrap) {
            if (!this.disabled) {
                this.unWireEvents();
            }
            if (this.tagName === 'INPUT') {
                if (radioWrap.parentNode) {
                    radioWrap.parentNode.insertBefore(this.element, radioWrap);
                }
                detach(radioWrap);
                this.element.checked = false;
                ['name', 'value', 'disabled'].forEach((key: string) => {
                    this.element.removeAttribute(key);
                });
            } else {
                ['role', 'aria-checked', 'class'].forEach((key: string) => {
                    radioWrap.removeAttribute(key);
                });
                radioWrap.innerHTML = '';
            }
        }
    }

    private focusHandler(): void {
        this.isFocused = true;
    }

    private focusOutHandler(): void {
        const label: Element = this.getLabel();
        if (label) {
            label.classList.remove('e-focus');
        }
    }

    protected getModuleName(): string {
        return 'radio';
    }

    /**
     * To get the value of selected radio button in a group.
     *
     * @method getSelectedValue
     * @returns {string} - Selected Value
     */
    public getSelectedValue(): string {
        let input: HTMLInputElement; const radioGrp: NodeListOf<Element> = this.getRadioGroup();
        for (let i: number = 0, len: number = radioGrp.length; i < len; i++) {
            input = radioGrp[i as number] as HTMLInputElement;
            if (input.checked ) { return input.value; }
        }
        return '';
    }

    private getRadioGroup(): NodeListOf<Element> {
        return document.querySelectorAll('input.e-radio[name="' + this.element.getAttribute('name') + '"]');
    }

    /**
     * Gets the properties to be maintained in the persistence state.
     *
     * @private
     * @returns {string} - Persist Data
     */
    public getPersistData(): string {
        return this.addOnPersist(['checked']);
    }

    private getWrapper(): Element {
        if (this.element) {
            return this.element.parentElement;
        } else {
            return null;
        }
    }

    private getLabel(): Element {
        if (this.element) {
            return this.element.nextElementSibling;
        } else {
            return null;
        }
    }

    private initialize(): void {
        if (isNullOrUndefined(this.initialCheckedValue)) {
            this.initialCheckedValue = this.checked;
        }
        this.initWrapper();
        this.updateHtmlAttribute();
        if (this.name) {
            this.element.setAttribute('name', this.name);
        }
        const value: string = this.element.getAttribute('value');
        if (this.isVue && value && value === this.value) {
            this.checked = true;
        }
        if (this.isVue ? this.value && !value : this.value) {
            this.element.setAttribute('value', this.value);
        }
        if (this.checked) {
            this.element.checked = true;
        }
        if (this.disabled) {
            this.setDisabled();
        }
    }

    private initWrapper(): void {
        let rippleSpan: Element;
        let wrapper: Element = this.element.parentElement;
        if (!wrapper.classList.contains(WRAPPER)) {
            wrapper = this.createElement('div', { className: WRAPPER });
            this.element.parentNode.insertBefore(wrapper, this.element);
        }
        const label: HTMLElement = this.createElement('label', { attrs: { for: this.element.id } });
        wrapper.appendChild(this.element);
        wrapper.appendChild(label);
        if (isRippleEnabled) {
            rippleSpan = this.createElement('span', { className: (RIPPLE) });
            label.appendChild(rippleSpan);
            rippleEffect(rippleSpan as HTMLElement, {
                duration: 400,
                isCenterRipple: true
            });
        }
        wrapper.classList.add('e-wrapper');
        if (this.enableRtl) {
            label.classList.add(RTL);
        }
        if (this.cssClass) {
            addClass([wrapper], this.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }
        if (this.label) {
            this.setText(this.label);
        }
    }

    private keyUpHandler(): void {
        if (this.isFocused) {
            this.getLabel().classList.add('e-focus');
        }
    }

    private labelRippleHandler(e: MouseEvent): void {
        const ripple: Element = this.getLabel().getElementsByClassName(RIPPLE)[0];
        rippleMouseHandler(e, ripple);
    }

    private formResetHandler(): void {
        this.checked = this.initialCheckedValue;
        if (this.initialCheckedValue) {
            attributes(this.element, { 'checked' : 'true'});
        }
    }

    /**
     * Called internally if any of the property value changes.
     *
     * @private
     * @param {RadioButtonModel} newProp - Specifies New Properties
     * @param {RadioButtonModel} oldProp - Specifies Old Properties
     * @returns {void}
     */
    public onPropertyChanged(newProp: RadioButtonModel, oldProp: RadioButtonModel): void {
        const wrap: Element = this.getWrapper();
        const label: Element = this.getLabel();
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'checked':
                if (newProp.checked) {
                    this.updateChange();
                }
                this.element.checked = newProp.checked;
                break;
            case 'disabled':
                if (newProp.disabled) {
                    this.setDisabled();
                    this.unWireEvents();
                } else {
                    this.element.disabled = false;
                    this.wireEvents();
                }
                break;
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([wrap], oldProp.cssClass.split(' '));
                }
                if (newProp.cssClass) {
                    addClass([wrap], newProp.cssClass.replace(/\s+/g, ' ').trim().split(' '));
                }
                break;
            case 'enableRtl':
                if (newProp.enableRtl) {
                    label.classList.add(RTL);
                } else {
                    label.classList.remove(RTL);
                }
                break;
            case 'label':
                this.setText(newProp.label);
                break;
            case 'labelPosition':
                if (newProp.labelPosition === 'Before') {
                    label.classList.add('e-right');
                } else {
                    label.classList.remove('e-right');
                }
                break;
            case 'name':
                this.element.setAttribute('name', newProp.name);
                break;
            case 'value':
                if (!isNullOrUndefined(this.htmlAttributes) && this.htmlAttributes.value) { break; }
                this.element.setAttribute('value', newProp.value);
                break;
            case 'htmlAttributes':
                this.updateHtmlAttribute();
                break;
            }
        }
    }

    /**
     * Initialize checked Property, Angular and React and Unique ID support.
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        let element: HTMLInputElement = this.element;
        this.formElement = <HTMLFormElement>closest(this.element, 'form');
        this.tagName = this.element.tagName;
        element = wrapperInitialize(this.createElement, 'EJS-RADIOBUTTON', 'radio', element, WRAPPER, 'radio');
        this.element = element;
        if (this.element.getAttribute('type') !== 'radio') {
            this.element.setAttribute('type', 'radio');
        }
        if (!this.element.id) {
            this.element.id = getUniqueID('e-' + this.getModuleName());
        }
        if (this.tagName === 'EJS-RADIOBUTTON') {
            const formControlName: string = this.element.getAttribute('formcontrolname');
            if (formControlName) {
                this.setProperties({ 'name': formControlName }, true); this.element.setAttribute('name', formControlName);
            }
        }
    }

    /**
     * Initialize the control rendering
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        this.initialize();
        if (!this.disabled) {
            this.wireEvents();
        }
        this.renderComplete();
        this.wrapper = this.getWrapper();
    }

    private setDisabled(): void {
        this.element.disabled = true;
    }

    private setText(text: string): void {
        const label: Element = this.getLabel();
        let textLabel: Element = label.getElementsByClassName(LABEL)[0];
        if (textLabel) {
            textLabel.textContent = text;
        } else {
            text = (this.enableHtmlSanitizer) ? SanitizeHtmlHelper.sanitize(text) : text;
            textLabel = this.createElement('span', { className: LABEL, innerHTML: text });
            label.appendChild(textLabel);
        }
        if (this.labelPosition === 'Before') {
            this.getLabel().classList.add('e-right');
        } else {
            this.getLabel().classList.remove('e-right');
        }
    }

    private updateHtmlAttribute(): void {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (const key of Object.keys(this.htmlAttributes)) {
                if (ATTRIBUTES.indexOf(key) > -1) {
                    const wrapper: Element = this.element.parentElement;
                    if (key === 'class') {
                        addClass([wrapper], this.htmlAttributes[`${key}`].replace(/\s+/g, ' ').trim().split(' '));
                    } else if (key === 'title' || key === 'style') {
                        wrapper.setAttribute(key, this.htmlAttributes[`${key}`]);
                    } else {
                        this.element.setAttribute(key, this.htmlAttributes[`${key}`]);
                    }
                }
            }
        }
    }

    protected unWireEvents(): void {
        const label: Element = this.wrapper;
        EventHandler.remove(this.element, 'change', this.changeHandler);
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        const rippleLabel: Element = label.getElementsByTagName('label')[0];
        if (rippleLabel) {
            EventHandler.remove(rippleLabel, 'mousedown', this.labelRippleHandler);
            EventHandler.remove(rippleLabel, 'mouseup', this.labelRippleHandler);
        }
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
    }

    protected wireEvents(): void {
        const label: Element = this.getLabel();
        EventHandler.add(this.element, 'change', this.changeHandler, this);
        EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        const rippleLabel: Element = label.getElementsByClassName(LABEL)[0];
        if (rippleLabel) {
            EventHandler.add(rippleLabel, 'mousedown', this.labelRippleHandler, this);
            EventHandler.add(rippleLabel, 'mouseup', this.labelRippleHandler, this);
        }
        if (this.formElement) {
            EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
    }

    /**
     * Click the RadioButton element
     * its native method
     *
     * @public
     * @returns {void}
     */
    public click(): void {
        this.element.click();
    }

    /**
     * Sets the focus to RadioButton
     * its native method
     *
     * @public
     * @returns {void}
     */
    public focusIn(): void {
        this.element.focus();
    }
}
/**
 * Interface for Radio Button change event arguments.
 */
export interface ChangeArgs extends BaseEventArgs {
    /** Returns the value of the RadioButton. */
    value?: string;
    /** Returns the event parameters of the RadioButton. */
    event?: Event;
}
