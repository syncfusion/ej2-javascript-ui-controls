import { Component, INotifyPropertyChanged , NotifyPropertyChanges, Property } from '@syncfusion/ej2-base';
import { EmitType, Event, EventHandler, KeyboardEvents } from '@syncfusion/ej2-base';
import { addClass, detach, getUniqueID, isRippleEnabled, removeClass, rippleEffect } from '@syncfusion/ej2-base';
import { CheckBoxModel } from './check-box-model';
import { wrapperInitialize, rippleMouseHandler, ChangeEventArgs } from './../common/common';

export type LabelPosition = 'After' | 'Before';

const CHECK: string = 'e-check';
const DISABLED: string = 'e-checkbox-disabled';
const FRAME: string = 'e-frame';
const INDETERMINATE: string = 'e-stop';
const LABEL: string = 'e-label';
const RIPPLE: string = 'e-ripple-container';
const RIPPLECHECK: string = 'e-ripple-check';
const RIPPLEINDETERMINATE: string = 'e-ripple-stop';
const RTL: string = 'e-rtl';
const WRAPPER: string = 'e-checkbox-wrapper';

/**
 * The CheckBox is a graphical user interface element that allows you to select one or more options from the choices.
 * It contains checked, unchecked, and indeterminate states.
 * ```html
 * <input type="checkbox" id="checkbox"/>
 * <script>
 * var checkboxObj = new CheckBox({ label: "Default" });
 * checkboxObj.appendTo("#checkbox");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class CheckBox extends Component<HTMLInputElement> implements INotifyPropertyChanged {
    private tagName: string;
    private isKeyPressed: boolean = false;
    private keyboardModule: KeyboardEvents;

    /**
     * Triggers when the CheckBox state has been changed by user interaction.
     * @event
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Specifies a value that indicates whether the CheckBox is `checked` or not.
     * When set to `true`, the CheckBox will be in `checked` state.
     * @default false
     */
    @Property(false)
    public checked: boolean;

    /**
     * Defines class/multiple classes separated by a space in the CheckBox element.
     * You can add custom styles to the CheckBox by using this property.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the CheckBox is `disabled` or not.
     * When set to `true`, the CheckBox will be in `disabled` state.
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Specifies a value that indicates whether the CheckBox is in `indeterminate` state or not.
     * When set to `true`, the CheckBox will be in `indeterminate` state.
     * @default false
     */
    @Property(false)
    public indeterminate: boolean;

    /**
     * Defines the caption for the CheckBox, that describes the purpose of the CheckBox.
     * @default ''
     */
    @Property('')
    public label: string;

    /**
     * Positions label `before`/`after` the CheckBox.
     * The possible values are:
     * * Before - The label is positioned to left of the CheckBox.
     * * After - The label is positioned to right of the CheckBox.
     * @default 'After'
     */
    @Property('After')
    public labelPosition: LabelPosition;

    /**
     * Defines `name` attribute for the CheckBox.
     * It is used to reference form data (CheckBox value) after a form is submitted.
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Defines `value` attribute for the CheckBox.
     * It is a form data passed to the server when submitting the form.
     * @default ''
     */
    @Property('')
    public value: string;

    /**
     * Constructor for creating the widget
     * @private
     */
    constructor(options?: CheckBoxModel, element?: string | HTMLInputElement) {
        super(options, <string | HTMLInputElement>element);
    }

    private changeState(state?: string): void {
        let ariaState: string;
        let rippleSpan: Element;
        let frameSpan: Element = this.getWrapper().getElementsByClassName(FRAME)[0];
        if (isRippleEnabled) {
            rippleSpan = this.getWrapper().getElementsByClassName(RIPPLE)[0];
        }
        if (state === 'check') {
            frameSpan.classList.remove(INDETERMINATE);
            frameSpan.classList.add(CHECK);
            if (rippleSpan) {
                rippleSpan.classList.remove(RIPPLEINDETERMINATE);
                rippleSpan.classList.add(RIPPLECHECK);
            }
            ariaState = 'true';
            this.element.checked = true;
        } else if (state === 'uncheck') {
            removeClass([frameSpan], [CHECK, INDETERMINATE]);
            if (rippleSpan) {
                removeClass([rippleSpan], [RIPPLECHECK, RIPPLEINDETERMINATE]);
            }
            ariaState = 'false';
            this.element.checked = false;
        } else {
            frameSpan.classList.remove(CHECK);
            frameSpan.classList.add(INDETERMINATE);
            if (rippleSpan) {
                rippleSpan.classList.remove(RIPPLECHECK);
                rippleSpan.classList.add(RIPPLEINDETERMINATE);
            }
            ariaState = 'mixed';
            this.element.indeterminate = true;
        }
        this.getWrapper().setAttribute('aria-checked', ariaState);
    }

    private clickHandler(event: Event): void {
        this.focusOutHandler();
        if (this.indeterminate) {
            this.changeState(this.checked ? 'check' : 'uncheck');
            this.indeterminate = false;
            this.element.indeterminate = false;
        } else if (this.checked) {
            this.changeState('uncheck');
            this.checked = false;
        } else {
            this.changeState('check');
            this.checked = true;
        }
        let changeEventArgs: ChangeEventArgs = { checked: this.element.checked, event: event };
        this.trigger('change', changeEventArgs);
    }

    /**
     * Destroys the widget.
     * @returns void
     */
    public destroy(): void {
        let wrapper: Element = this.getWrapper();
        super.destroy();
        if (!this.disabled) {
            this.unWireEvents();
        }
        if (this.tagName === 'INPUT') {
            wrapper.parentNode.insertBefore(this.element, wrapper);
            detach(wrapper);
            this.element.checked = false;
            if (this.indeterminate) {
                this.element.indeterminate = false;
            }
            ['name', 'value', 'disabled'].forEach((key: string) => {
                this.element.removeAttribute(key);
            });
        } else {
            ['role', 'aria-checked', 'class'].forEach((key: string) => {
                wrapper.removeAttribute(key);
            });
            wrapper.innerHTML = '';
        }
    }

    private focusHandler(): void {
        if (this.isKeyPressed) {
            this.getWrapper().classList.add('e-focus');
        }
    }

    private focusOutHandler(): void {
        this.getWrapper().classList.remove('e-focus');
    }

    /**
     * Gets the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'checkbox';
    }

    /**
     * Gets the properties to be maintained in the persistence state.
     * @private
     */
    public getPersistData(): string {
        return this.addOnPersist(['checked', 'indeterminate']);
    }

    private getWrapper(): Element {
        return this.element.parentElement.parentElement;
    }

    private initialize(): void {
        if (this.name) {
            this.element.setAttribute('name', this.name);
        }
        if (this.value) {
            this.element.setAttribute('value', this.value);
        }
        if (this.checked) {
            this.changeState('check');
        }
        if (this.indeterminate) {
            this.changeState();
        }
        if (this.disabled) {
            this.setDisabled();
        }
    }

    private initWrapper(): void {
        let wrapper: Element = this.element.parentElement;
        if (!wrapper.classList.contains(WRAPPER)) {
            wrapper = this.createElement('div', {
                className: WRAPPER, attrs: { 'role': 'checkbox', 'aria-checked': 'false' }
            });
            this.element.parentNode.insertBefore(wrapper, this.element);
        }
        let label: Element = this.createElement('label', { attrs: { for: this.element.id } });
        let frameSpan: Element = this.createElement('span', { className: 'e-icons ' + FRAME });
        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        if (this.cssClass) {
            addClass([wrapper], this.cssClass.split(' '));
        }
        wrapper.appendChild(label);
        label.appendChild(this.element);
        label.appendChild(frameSpan);
        if (isRippleEnabled) {
            let rippleSpan: HTMLElement = this.createElement('span', { className: RIPPLE });
            if (this.labelPosition === 'Before') {
                label.appendChild(rippleSpan);
            }else {
                label.insertBefore(rippleSpan, frameSpan);
            }
            rippleEffect(rippleSpan, { duration: 400, isCenterRipple: true });
        }
        if (this.label) {
            this.setText(this.label);
        }
    }

    private keyDownHandler(): void {
        this.isKeyPressed = true;
    }

    private labelMouseHandler(e: MouseEvent): void {
        let rippleSpan: Element = this.getWrapper().getElementsByClassName(RIPPLE)[0];
        rippleMouseHandler(e, rippleSpan);
    }

    private mouseDownHandler(): void {
        this.isKeyPressed = false;
    }

    /**
     * Called internally if any of the property value changes.
     * @private
     */
    public onPropertyChanged(newProp: CheckBoxModel, oldProp: CheckBoxModel): void {
        let wrapper: Element = this.getWrapper();
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'checked':
                    this.indeterminate = false;
                    this.element.indeterminate = false;
                    this.changeState(newProp.checked ? 'check' : 'uncheck');
                    break;
                case 'indeterminate':
                    if (newProp.indeterminate) {
                        this.changeState();
                    } else {
                        this.element.indeterminate = false;
                        this.changeState(this.checked ? 'check' : 'uncheck');
                    }
                    break;
                case 'disabled':
                    if (newProp.disabled) {
                        this.setDisabled();
                        this.unWireEvents();
                    } else {
                        this.element.disabled = false;
                        wrapper.classList.remove(DISABLED);
                        wrapper.setAttribute('aria-disabled', 'false');
                        this.wireEvents();
                    }
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        wrapper.classList.remove(oldProp.cssClass);
                    }
                    wrapper.classList.add(newProp.cssClass);
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        wrapper.classList.add(RTL);
                    } else {
                        wrapper.classList.remove(RTL);
                    }
                    break;
                case 'label':
                    this.setText(newProp.label);
                    break;
                case 'labelPosition':
                    let label: Element = wrapper.getElementsByClassName(LABEL)[0];
                    let labelWrap: Element = wrapper.getElementsByTagName('label')[0];
                    detach(label);
                    if (newProp.labelPosition === 'After') {
                        labelWrap.appendChild(label);
                    } else {
                        labelWrap.insertBefore(label, wrapper.getElementsByClassName(FRAME)[0]);
                    }
                    break;
                case 'name':
                    this.element.setAttribute('name', newProp.name);
                    break;
                case 'value':
                    this.element.setAttribute('value', newProp.value);
                    break;
            }
        }
    }

    /**
     * Initialize Angular, React and Unique ID support.
     * @private
     */
    protected preRender(): void {
        let element: HTMLInputElement = this.element;
        this.tagName = this.element.tagName;
        element = wrapperInitialize(this.createElement, 'EJS-CHECKBOX', 'checkbox', element, WRAPPER, 'checkbox');
        this.element = element;
        if (this.element.getAttribute('type') !== 'checkbox') {
            this.element.setAttribute('type', 'checkbox');
        }
        if (!this.element.id) {
            this.element.id = getUniqueID('e-' + this.getModuleName());
        }
    }

    /**
     * Initialize the control rendering
     * @private
     */
    protected render(): void {
        this.initWrapper();
        this.initialize();
        if (!this.disabled) {
            this.wireEvents();
        }
    }

    private setDisabled(): void {
        let wrapper: Element = this.getWrapper();
        this.element.disabled = true;
        wrapper.classList.add(DISABLED);
        wrapper.setAttribute('aria-disabled', 'true');
    }

    private setText(text: string): void {
        let label: Element = this.getWrapper().getElementsByClassName(LABEL)[0];
        if (label) {
            label.textContent = text;
        } else {
            label = this.createElement('span', { className: LABEL, innerHTML: text });
            let labelWrap: Element = this.getWrapper().getElementsByTagName('label')[0];
            if (this.labelPosition === 'Before') {
                labelWrap.insertBefore(label, this.getWrapper().getElementsByClassName(FRAME)[0]);
            } else {
                labelWrap.appendChild(label);
            }
        }
    }

    private changeHandler(e: MouseEvent): void {
        e.stopPropagation();
    }

    protected unWireEvents(): void {
        let wrapper: Element = this.getWrapper();
        EventHandler.remove(this.element, 'click', this.clickHandler);
        EventHandler.remove(document, 'keydown', this.keyDownHandler);
        EventHandler.remove(wrapper, 'mousedown', this.mouseDownHandler);
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        let label: Element = wrapper.getElementsByTagName('label')[0];
        EventHandler.remove(label, 'mousedown', this.labelMouseHandler);
        EventHandler.remove(label, 'mouseup', this.labelMouseHandler);
        if (this.tagName === 'EJS-CHECKBOX') {
            EventHandler.remove(this.element, 'change', this.changeHandler);
        }

    }

    protected wireEvents(): void {
        let wrapper: Element = this.getWrapper();
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        EventHandler.add(document, 'keydown', this.keyDownHandler, this);
        EventHandler.add(wrapper, 'mousedown', this.mouseDownHandler, this);
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        let label: Element = wrapper.getElementsByTagName('label')[0];
        EventHandler.add(label, 'mousedown', this.labelMouseHandler, this);
        EventHandler.add(label, 'mouseup', this.labelMouseHandler, this);
        if (this.tagName === 'EJS-CHECKBOX') {
            EventHandler.add(this.element, 'change', this.changeHandler, this);
        }
    }
}
