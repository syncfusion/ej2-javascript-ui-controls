import { Component, INotifyPropertyChanged, NotifyPropertyChanges, Property, closest } from '@syncfusion/ej2-base';
import { EmitType, Event, EventHandler, MouseEventArgs } from '@syncfusion/ej2-base';
import { addClass, isRippleEnabled, removeClass, rippleEffect, isNullOrUndefined } from '@syncfusion/ej2-base';
import { SwitchModel } from './switch-model';
import { rippleMouseHandler, destroy, preRender, ChangeEventArgs, setHiddenInput } from './../common/common';

const CHECK: string = 'e-check';
const DISABLED: string = 'e-switch-disabled';
const RIPPLE: string = 'e-ripple-container';
const RIPPLE_CHECK: string = 'e-ripple-check';
const RTL: string = 'e-rtl';
const WRAPPER: string = 'e-switch-wrapper';
const ACTIVE: string = 'e-switch-active';

/**
 * The Switch is a graphical user interface element that allows you to toggle between checked and unchecked states.
 * ```html
 * <input type="checkbox" id="switch"/>
 * <script>
 * var switchObj = new Switch({});
 * switchObj.appendTo("#switch");
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class Switch extends Component<HTMLInputElement> implements INotifyPropertyChanged {
    private tagName: string;
    private isFocused: boolean = false;
    private isDrag: boolean = false;
    private delegateMouseUpHandler: Function;
    private delegateKeyUpHandler: Function;
    private formElement: HTMLFormElement;
    private initialSwitchCheckedValue: boolean;

    /**
     * Triggers when Switch state has been changed by user interaction.
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
     * Specifies a value that indicates whether the Switch is `checked` or not.
     * When set to `true`, the Switch will be in `checked` state.
     * @default false
     */
    @Property(false)
    public checked: boolean;

    /**
     * You can add custom styles to the Switch by using this property.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the Switch is `disabled` or not.
     * When set to `true`, the Switch will be in `disabled` state.
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines `name` attribute for the Switch.
     * It is used to reference form data (Switch value) after a form is submitted.
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Specifies a text that indicates the Switch is in checked state.
     * @default ''
     */
    @Property('')
    public onLabel: string;

    /**
     * Specifies a text that indicates the Switch is in unchecked state.
     * @default ''
     */
    @Property('')
    public offLabel: string;

    /**
     * Defines `value` attribute for the Switch.
     * It is a form data passed to the server when submitting the form.
     * @default ''
     */
    @Property('')
    public value: string;

    /**
     * Constructor for creating the widget.
     * @private
     */
    constructor(options?: SwitchModel, element?: string | HTMLInputElement) {
        super(options, <string | HTMLInputElement>element);
    }
    private changeState(state?: boolean): void {
        let ariaState: string;
        let rippleSpan: Element;
        let wrapper: Element = this.getWrapper();
        let bar: Element = wrapper.querySelector('.e-switch-inner');
        let handle: Element = wrapper.querySelector('.e-switch-handle');
        if (isRippleEnabled) {
            rippleSpan = wrapper.getElementsByClassName(RIPPLE)[0];
        }
        if (state) {
            addClass([bar, handle], ACTIVE);
            ariaState = 'true';
            this.element.checked = true;
            this.checked = true;
            if (rippleSpan) {
                addClass([rippleSpan], [RIPPLE_CHECK]);
            }
        } else {
            removeClass([bar, handle], ACTIVE);
            ariaState = 'false';
            this.element.checked = false;
            this.checked = false;
            if (rippleSpan) {
                removeClass([rippleSpan], [RIPPLE_CHECK]);
            }
        }
        wrapper.setAttribute('aria-checked', ariaState);
    }
    private clickHandler(evt?: Event): void {
        this.isDrag = false;
        this.focusOutHandler();
        this.changeState(!this.checked);
        this.element.focus();
        let changeEventArgs: ChangeEventArgs = { checked: this.element.checked, event: evt };
        this.trigger('change', changeEventArgs);
    }
    /**
     * Destroys the Switch widget.
     * @returns void
     */
    public destroy(): void {
            super.destroy();
            if (!this.disabled) {
                this.unWireEvents();
            }
            destroy(this, this.getWrapper(), this.tagName);
    }
    private focusHandler(): void {
        this.isFocused = true;
    }
    private focusOutHandler(): void {
        this.getWrapper().classList.remove('e-focus');
    }
    /**
     * Gets the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'switch';
    }
    /**
     * Gets the properties to be maintained in the persistence state.
     * @private
     */
    public getPersistData(): string {
        return this.addOnPersist(['checked']);
    }
    private getWrapper(): Element {
        return this.element.parentElement;
    }
    private initialize(): void {
        if (isNullOrUndefined(this.initialSwitchCheckedValue)) {
            this.initialSwitchCheckedValue = this.checked;
        }
        if (this.name) {
            this.element.setAttribute('name', this.name);
        }
        if (this.value) {
            this.element.setAttribute('value', this.value);
        }
        if (this.checked) {
            this.changeState(true);
        }
        if (this.disabled) {
            this.setDisabled();
        }
        if (this.onLabel || this.offLabel) {
            this.setLabel(this.onLabel, this.offLabel);
        }
    }
    private initWrapper(): void {
        let wrapper: Element = this.element.parentElement;
        if (!wrapper.classList.contains(WRAPPER)) {
            wrapper = this.createElement('div', {
                className: WRAPPER, attrs: { 'role': 'switch', 'aria-checked': 'false' }
            });
            this.element.parentNode.insertBefore(wrapper, this.element);
        }
        let switchInner: Element = this.createElement('span', { className: 'e-switch-inner' });
        let onLabel: Element = this.createElement('span', { className: 'e-switch-on' });
        let offLabel: Element = this.createElement('span', { className: 'e-switch-off' });
        let handle: Element = this.createElement('span', { className: 'e-switch-handle' });
        wrapper.appendChild(this.element);
        setHiddenInput(this, wrapper);
        switchInner.appendChild(onLabel);
        switchInner.appendChild(offLabel);
        wrapper.appendChild(switchInner);
        wrapper.appendChild(handle);
        if (isRippleEnabled) {
            let rippleSpan: HTMLElement = this.createElement('span', { className: RIPPLE });
            handle.appendChild(rippleSpan);
            rippleEffect(rippleSpan, { duration: 400, isCenterRipple: true });
        }
        wrapper.classList.add('e-wrapper');
        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        if (this.cssClass) {
            addClass([wrapper], this.cssClass.split(' '));
        }
    }
    /**
     * Called internally if any of the property value changes.
     * @private
     */
    public onPropertyChanged(newProp: SwitchModel, oldProp: SwitchModel): void {
        let wrapper: Element = this.getWrapper();
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'checked':
                    this.changeState(newProp.checked);
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
                case 'value':
                    this.element.setAttribute('value', newProp.value);
                    break;
                case 'name':
                    this.element.setAttribute('name', newProp.name);
                    break;
                case 'onLabel':
                case 'offLabel':
                    this.setLabel(newProp.onLabel, newProp.offLabel);
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        wrapper.classList.add(RTL);
                    } else {
                        wrapper.classList.remove(RTL);
                    }
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([wrapper], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([wrapper], newProp.cssClass.split(' '));
                    }
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
        this.formElement = <HTMLFormElement>closest(this.element, 'form');
        this.tagName = this.element.tagName;
        preRender(this, 'EJS-SWITCH', WRAPPER, element, this.getModuleName());
    }
    /**
     * Initialize control rendering.
     * @private
     */
    protected render(): void {
        this.initWrapper();
        this.initialize();
        if (!this.disabled) {
            this.wireEvents();
        }
        this.renderComplete();
    }
    private rippleHandler(e: MouseEvent): void {
        let rippleSpan: Element = this.getWrapper().getElementsByClassName(RIPPLE)[0];
        rippleMouseHandler(e, rippleSpan);
        if (e.type === 'mousedown' && (e.currentTarget as Element).classList.contains('e-switch-wrapper') && e.which === 1) {
            this.isDrag = true;
            this.isFocused = false;
        }
    }
    private rippleTouchHandler(eventType: string): void {
        let rippleSpan: Element = this.getWrapper().getElementsByClassName(RIPPLE)[0];
        if (rippleSpan) {
            let event: MouseEvent = document.createEvent('MouseEvents');
            event.initEvent(eventType, false, true);
            rippleSpan.dispatchEvent(event);
        }
    }
    private setDisabled(): void {
        let wrapper: Element = this.getWrapper();
        this.element.disabled = true;
        wrapper.classList.add(DISABLED);
        wrapper.setAttribute('aria-disabled', 'true');
    }
    private setLabel(onText: string, offText: string): void {
        let wrapper: Element = this.getWrapper();
        if (onText) {
            wrapper.querySelector('.e-switch-on').textContent = onText;
        }
        if (offText) {
            wrapper.querySelector('.e-switch-off').textContent = offText;
        }
    }
    private switchFocusHandler(): void {
        if (this.isFocused) {
            this.getWrapper().classList.add('e-focus');
        }
    }
    private switchMouseUp(e: MouseEventArgs): void {
        let target: Element = e.target as Element;
        let rippleSpan: Element = this.getWrapper().getElementsByClassName(RIPPLE)[0];
        if (e.type === 'touchmove') {
            e.preventDefault();
        }
        if (e.type === 'touchstart') {
            this.isDrag = true;
            this.rippleTouchHandler('mousedown');
        }
        if (this.isDrag) {
            if ((e.type === 'mouseup' && target.className.indexOf('e-switch') < 0) || e.type === 'touchend') {
                this.clickHandler(e);
                this.rippleTouchHandler('mouseup');
                e.preventDefault();
            }
        }
    }

    private formResetHandler(): void {
        this.checked = this.initialSwitchCheckedValue;
        this.element.checked = this.initialSwitchCheckedValue;
    }
    /**
     * Toggle the Switch component state into checked/unchecked.
     * @returns void
     */
    public toggle(): void {
        this.clickHandler();
    }
    private wireEvents(): void {
        let wrapper: Element = this.getWrapper();
        let handle: Element = wrapper.querySelector('.e-switch-handle');
        this.delegateMouseUpHandler = this.switchMouseUp.bind(this);
        this.delegateKeyUpHandler = this.switchFocusHandler.bind(this);
        EventHandler.add(wrapper, 'click', this.clickHandler, this);
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        EventHandler.add(this.element, 'mouseup', this.delegateMouseUpHandler, this);
        EventHandler.add(this.element, 'keyup', this.delegateKeyUpHandler, this);
        EventHandler.add(wrapper, 'mousedown mouseup', this.rippleHandler, this);
        EventHandler.add(wrapper, 'touchstart touchmove touchend', this.switchMouseUp, this);
        if (this.formElement) {
            EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
    }
    private unWireEvents(): void {
        let wrapper: Element = this.getWrapper();
        let handle: Element = wrapper.querySelector('.e-switch-handle');
        EventHandler.remove(wrapper, 'click', this.clickHandler);
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        EventHandler.remove(this.element, 'mouseup', this.delegateMouseUpHandler);
        EventHandler.remove(this.element, 'keyup', this.delegateKeyUpHandler);
        EventHandler.remove(wrapper, 'mousedown mouseup', this.rippleHandler);
        EventHandler.remove(wrapper, 'touchstart touchmove touchend', this.switchMouseUp);
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
    }

    /**
     * Click the switch element
     * its native method
     * @public
     */
    public click(): void {
        this.element.click();
   }

    /**
     * Sets the focus to Switch
     * its native method
     * @public
     */
    public focusIn(): void {
       this.element.focus();
  }
}

