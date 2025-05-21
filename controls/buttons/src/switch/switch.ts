import { Component, INotifyPropertyChanged, NotifyPropertyChanges, Property, closest, setValue } from '@syncfusion/ej2-base';
import { EmitType, Event, EventHandler, MouseEventArgs } from '@syncfusion/ej2-base';
import { addClass, isRippleEnabled, removeClass, rippleEffect, isNullOrUndefined } from '@syncfusion/ej2-base';
import { SwitchModel } from './switch-model';
import { rippleMouseHandler, destroy, preRender, ChangeEventArgs, BeforeChangeEventArgs, setHiddenInput } from './../common/common';

const DISABLED: string = 'e-switch-disabled';
const RIPPLE: string = 'e-ripple-container';
const RIPPLE_CHECK: string = 'e-ripple-check';
const RTL: string = 'e-rtl';
const WRAPPER: string = 'e-switch-wrapper';
const ACTIVE: string = 'e-switch-active';
const ATTRIBUTES: string[] = ['title', 'class', 'style', 'disabled', 'readonly', 'name', 'value', 'aria-label', 'id', 'role', 'tabindex'];

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
    private isWireEvents: boolean = false;
    private delegateMouseUpHandler: Function;
    private delegateKeyUpHandler: Function;
    private formElement: HTMLFormElement;
    private initialSwitchCheckedValue: boolean;
    private bTouchY: number;
    private bTouchX: number;

    /**
     * This event is triggered before the state of the switch is changed in the Switch component.
     * @event beforeChange
     * @remarks
     * The `beforeChange` event allows developers to intercept and cancel the switch state change before it is applied.
     */
    @Event()
    public beforeChange: EmitType<BeforeChangeEventArgs>;

    /**
     * Triggers when Switch state has been changed by user interaction.
     *
     * @event change
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Specifies a value that indicates whether the Switch is `checked` or not.
     * When set to `true`, the Switch will be in `checked` state.
     *
     * @default false
     */
    @Property(false)
    public checked: boolean;

    /**
     * You can add custom styles to the Switch by using this property.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the Switch is `disabled` or not.
     * When set to `true`, the Switch will be in `disabled` state.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines `name` attribute for the Switch.
     * It is used to reference form data (Switch value) after a form is submitted.
     *
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Specifies a text that indicates the Switch is in checked state.
     *
     * @default ''
     */
    @Property('')
    public onLabel: string;

    /**
     * Specifies a text that indicates the Switch is in unchecked state.
     *
     * @default ''
     */
    @Property('')
    public offLabel: string;

    /**
     * Defines `value` attribute for the Switch.
     * It is a form data passed to the server when submitting the form.
     *
     * @default ''
     */
    @Property('')
    public value: string;

    /**
     * You can add the additional html attributes such as disabled, value etc., to the element.
     * If you configured both property and equivalent html attribute then the component considers the property value.
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };

    /**
     * Constructor for creating the widget.
     *
     * @private
     *
     * @param {SwitchModel} options switch model
     * @param {string | HTMLInputElement} element target element
     *
     */
    constructor(options?: SwitchModel, element?: string | HTMLInputElement) {
        super(options, <string | HTMLInputElement>element);
    }
    private changeState(state?: boolean): void {
        let rippleSpan: Element | null = null;
        const wrapper: Element = this.getWrapper() as Element;
        const bar: Element = wrapper.querySelector('.e-switch-inner') as Element;
        const handle: Element = wrapper.querySelector('.e-switch-handle') as Element;
        if (isRippleEnabled) {
            rippleSpan = wrapper.getElementsByClassName(RIPPLE)[0];
        }
        if (state) {
            addClass([bar, handle], ACTIVE);
            this.element.checked = true;
            this.checked = true;
            if (rippleSpan) {
                addClass([rippleSpan], [RIPPLE_CHECK]);
            }
        } else {
            removeClass([bar, handle], ACTIVE);
            this.element.checked = false;
            this.checked = false;
            if (rippleSpan) {
                removeClass([rippleSpan], [RIPPLE_CHECK]);
            }
        }
    }
    private clickHandler(evt?: Event): void {
        if (evt && this.element.closest('label')) {
            if (evt.target !== this.element) { return; }
        }
        this.isDrag = false;
        this.focusOutHandler();
        const beforeChangeEventArgs: BeforeChangeEventArgs = { event: evt, cancel: false, checked: this.checked };
        this.trigger('beforeChange', beforeChangeEventArgs);
        if (!beforeChangeEventArgs.cancel) {
            this.changeState(!beforeChangeEventArgs.checked);
            this.element.focus();
            const changeEventArgs: ChangeEventArgs = { checked: this.element.checked, event: evt };
            this.trigger('change', changeEventArgs);
        }
    }
    /**
     * Destroys the Switch widget.
     *
     * @returns {void}
     */
    public destroy(): void {
        super.destroy();
        if (!this.disabled) {
            this.unWireEvents();
        }
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
        if (this.getWrapper()) {
            destroy(this, this.getWrapper() as Element, this.tagName);
        }
        if (this.refreshing) {
            ['e-control', 'e-switch', 'e-lib'].forEach((key: string) => {
                this.element.classList.add(key);
            });
            setValue('ej2_instances', [this], this.element);
        }
    }
    private focusHandler(): void {
        this.isFocused = true;
    }
    private focusOutHandler(): void {
        (this.getWrapper() as Element).classList.remove('e-focus');
    }
    /**
     * Gets the module name.
     *
     * @private
     * @returns {string} - Module Name
     */
    protected getModuleName(): string {
        return 'switch';
    }
    /**
     * Gets the properties to be maintained in the persistence state.
     *
     * @private
     * @returns {string} - Persist data
     */
    public getPersistData(): string {
        return this.addOnPersist(['checked']);
    }
    private getWrapper(): Element | null{
        if (this.element.parentElement) {
            return this.element.parentElement;
        } else {
            return null;
        }
    }
    private initialize(): void {
        this.element.setAttribute('role', 'switch');
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
        let wrapper: Element = this.element.parentElement as Element;
        if (!wrapper.classList.contains(WRAPPER)) {
            wrapper = this.createElement('div', {
                className: WRAPPER
            });
            (this.element.parentNode as Element).insertBefore(wrapper, this.element);
        }
        const switchInner: Element = this.createElement('span', { className: 'e-switch-inner' });
        const onLabel: Element = this.createElement('span', { className: 'e-switch-on' });
        const offLabel: Element = this.createElement('span', { className: 'e-switch-off' });
        const handle: Element = this.createElement('span', { className: 'e-switch-handle' });
        wrapper.appendChild(this.element);
        setHiddenInput(this, wrapper);
        switchInner.appendChild(onLabel);
        switchInner.appendChild(offLabel);
        wrapper.appendChild(switchInner);
        wrapper.appendChild(handle);
        if (isRippleEnabled) {
            const rippleSpan: HTMLElement = this.createElement('span', { className: RIPPLE });
            handle.appendChild(rippleSpan);
            rippleEffect(rippleSpan, { duration: 400, isCenterRipple: true });
        }
        wrapper.classList.add('e-wrapper');
        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        if (this.cssClass) {
            addClass([wrapper], this.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }
    }
    /**
     * Called internally if any of the property value changes.
     *
     * @private
     * @param {SwitchModel} newProp - Specifies New Properties
     * @param {SwitchModel} oldProp - Specifies Old Properties
     * @returns {void}
     */
    public onPropertyChanged(newProp: SwitchModel, oldProp: SwitchModel): void {
        const wrapper: Element = this.getWrapper() as Element;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'checked':
                this.changeState(newProp.checked);
                break;
            case 'disabled':
                if (newProp.disabled) {
                    this.setDisabled();
                    this.unWireEvents();
                    this.isWireEvents = false;
                } else {
                    this.element.disabled = false;
                    wrapper.classList.remove(DISABLED);
                    wrapper.setAttribute('aria-disabled', 'false');
                    if (!this.isWireEvents) {
                        this.wireEvents();
                        this.isWireEvents = true;
                    }
                }
                break;
            case 'value':
                this.element.setAttribute('value', newProp.value as string);
                break;
            case 'name':
                this.element.setAttribute('name', newProp.name as string);
                break;
            case 'onLabel':
            case 'offLabel':
                this.setLabel(newProp.onLabel as string, newProp.offLabel as string);
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
                    removeClass([wrapper], oldProp.cssClass.split(/\s+/).filter((c: string) => c.length > 0));
                }
                if (newProp.cssClass) {
                    addClass([wrapper], newProp.cssClass.replace(/\s+/g, ' ').trim().split(' '));
                }
                break;
            case 'htmlAttributes':
                this.updateHtmlAttribute();
                break;
            }
        }
    }
    /**
     * Initialize Angular, React and Unique ID support.
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        const element: HTMLInputElement = this.element;
        this.formElement = <HTMLFormElement>closest(this.element, 'form');
        this.tagName = this.element.tagName;
        preRender(this, 'EJS-SWITCH', WRAPPER, element, this.getModuleName());
    }
    /**
     * Initialize control rendering.
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        this.initWrapper();
        this.initialize();
        if (!this.disabled) {
            this.wireEvents();
        }
        if (this.formElement) {
            EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
        this.renderComplete();
        this.updateHtmlAttribute();
    }

    private rippleHandler(e: MouseEvent): void {
        const rippleSpan: Element = (this.getWrapper() as Element).getElementsByClassName(RIPPLE)[0];
        rippleMouseHandler(e, rippleSpan);
        if (e.type === 'mousedown' && (e.currentTarget as Element).classList.contains('e-switch-wrapper') && e.which === 1) {
            this.isDrag = true;
            this.isFocused = false;
        }
    }

    private mouseLeaveHandler(e: MouseEvent): void {
        const rippleSpan: Element = (this.element.parentElement as Element).getElementsByClassName(RIPPLE)[0];
        if (rippleSpan) {
            const rippleElem: NodeListOf<Element> = rippleSpan.querySelectorAll('.e-ripple-element');
            for (let i: number = rippleElem.length - 1; i > 0; i--) {
                rippleSpan.removeChild(rippleSpan.childNodes[i as number]);
            }
            rippleMouseHandler(e, rippleSpan);
        }
    }
    private rippleTouchHandler(eventType: string): void {
        const rippleSpan: Element = (this.getWrapper() as Element).getElementsByClassName(RIPPLE)[0];
        if (rippleSpan) {
            const event: MouseEvent = document.createEvent('MouseEvents');
            event.initEvent(eventType, false, true);
            rippleSpan.dispatchEvent(event);
        }
    }
    private setDisabled(): void {
        const wrapper: Element = this.getWrapper() as Element;
        this.element.disabled = true;
        wrapper.classList.add(DISABLED);
        wrapper.setAttribute('aria-disabled', 'true');
    }
    private setLabel(onText: string, offText: string): void {
        const wrapper: Element = this.getWrapper() as Element;
        if (onText) {
            (wrapper.querySelector('.e-switch-on') as Element).textContent = onText;
        }
        if (offText) {
            (wrapper.querySelector('.e-switch-off') as Element).textContent = offText;
        }
    }
    private updateHtmlAttribute(): void {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (const key of Object.keys(this.htmlAttributes)) {
                const wrapper: Element = this.getWrapper() as Element;
                if (ATTRIBUTES.indexOf(key) > -1) {
                    if (key === 'class') {
                        addClass([wrapper], this.htmlAttributes[`${key}`].split(' '));
                    } else if (key === 'title') {
                        wrapper.setAttribute(key, this.htmlAttributes[`${key}`]);
                    } else if (key === 'style') {
                        wrapper.setAttribute(key, this.htmlAttributes[`${key}`]);
                    } else if (key === 'disabled') {
                        if (this.htmlAttributes[`${key}`] === 'true') {
                            this.setDisabled();
                        }
                        this.element.setAttribute(key, this.htmlAttributes[`${key}`]);
                    } else {
                        this.element.setAttribute(key, this.htmlAttributes[`${key}`]);
                    }
                } else {
                    wrapper.setAttribute(key, this.htmlAttributes[`${key}`]);
                }
            }
        }
    }
    private switchFocusHandler(e?: KeyboardEvent): void {
        if (this.isFocused) {
            (this.getWrapper() as Element).classList.add('e-focus');
        }
        if (e && e.type === 'keyup' && e.code === 'Space' && (this as any).isAngular) {
            this.clickHandler(e);
            e.stopPropagation();
            e.preventDefault();
        }
    }
    private switchMouseUp(e: MouseEventArgs): void {
        let aTouchY: number = 0; let yDiff: number = 0;
        let aTouchX: number = 0; let xDiff: number = 0;
        const target: Element = e.target as Element;
        if (e.type === 'touchmove') {
            e.preventDefault();
            aTouchX = e.changedTouches[0].clientX;
            aTouchY = e.changedTouches[0].clientY;
            xDiff = this.bTouchX - aTouchX;
            yDiff = this.bTouchY - aTouchY;
            if (Math.abs(xDiff) < Math.abs(yDiff)) {
                this.isDrag = false;
                this.rippleTouchHandler('mouseup');
            } else {
                this.isDrag = true;
            }
        }
        if (e.type === 'touchstart') {
            this.bTouchX = e.changedTouches[0].clientX;
            this.bTouchY = e.changedTouches[0].clientY;
            this.isDrag = true;
            this.rippleTouchHandler('mousedown');
        }
        if (this.isDrag) {
            if ((e.type === 'mouseup' && target.className.indexOf('e-switch') < 0) || e.type === 'touchend') {
                xDiff = this.bTouchX - e.changedTouches[0].clientX;
                yDiff = this.bTouchY - e.changedTouches[0].clientY;
                if (Math.abs(xDiff) >= Math.abs(yDiff)) {
                    this.clickHandler(e);
                    this.rippleTouchHandler('mouseup');
                    e.preventDefault();
                }
            }
        }
    }

    private formResetHandler(): void {
        this.checked = this.initialSwitchCheckedValue;
        this.element.checked = this.initialSwitchCheckedValue;
    }
    /**
     * Toggle the Switch component state into checked/unchecked.
     *
     * @returns {void}
     */
    public toggle(): void {
        this.clickHandler();
    }
    private wireEvents(): void {
        const wrapper: Element = this.getWrapper() as Element;
        this.delegateMouseUpHandler = this.switchMouseUp.bind(this);
        this.delegateKeyUpHandler = this.switchFocusHandler.bind(this);
        EventHandler.add(wrapper, 'click', this.clickHandler, this);
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        EventHandler.add(this.element, 'mouseup', this.delegateMouseUpHandler, this);
        EventHandler.add(this.element, 'keyup', this.delegateKeyUpHandler, this);
        EventHandler.add(wrapper, 'mousedown mouseup', this.rippleHandler, this);
        EventHandler.add(wrapper, 'mouseleave', this.mouseLeaveHandler, this);
        EventHandler.add(wrapper, 'touchstart touchmove touchend', this.switchMouseUp, this);
    }
    private unWireEvents(): void {
        const wrapper: Element = this.getWrapper() as Element;
        if (wrapper) {
            EventHandler.remove(wrapper, 'click', this.clickHandler);
            EventHandler.remove(wrapper, 'mousedown mouseup', this.rippleHandler);
            EventHandler.remove(wrapper, 'mouseleave', this.mouseLeaveHandler);
            EventHandler.remove(wrapper, 'touchstart touchmove touchend', this.switchMouseUp);
        }
        if (this.element) {
            EventHandler.remove(this.element, 'focus', this.focusHandler);
            EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
            EventHandler.remove(this.element, 'mouseup', this.delegateMouseUpHandler);
            EventHandler.remove(this.element, 'keyup', this.delegateKeyUpHandler);
        }
    }

    /**
     * Click the switch element
     * its native method
     *
     * @public
     * @returns {void}
     */
    public click(): void {
        this.element.click();
    }

    /**
     * Sets the focus to Switch
     * its native method
     *
     * @public
     */

    public focusIn(): void {
        this.element.focus();
    }
}
