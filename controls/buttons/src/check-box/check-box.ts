import { Component, INotifyPropertyChanged, NotifyPropertyChanges, Property, setValue } from '@syncfusion/ej2-base';
import { EmitType, Event, EventHandler, isNullOrUndefined, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { addClass, detach, getUniqueID, isRippleEnabled, removeClass, rippleEffect, closest } from '@syncfusion/ej2-base';
import { CheckBoxModel } from './check-box-model';
import { wrapperInitialize, rippleMouseHandler, ChangeEventArgs, setHiddenInput } from './../common/common';
/**
 * Defines the label position of CheckBox.
 * ```props
 * After :- When the label is positioned After, it appears to the right of the CheckBox.
 * Before :- When the label is positioned Before, it appears to the left of the CheckBox.
 * ```
 */
export type LabelPosition = 'After' | 'Before';

const CHECK: string  = 'e-check';
const DISABLED: string = 'e-checkbox-disabled';
const FRAME: string = 'e-frame';
const INDETERMINATE: string = 'e-stop';
const LABEL: string = 'e-label';
const RIPPLE: string = 'e-ripple-container';
const RIPPLECHECK: string = 'e-ripple-check';
const RIPPLEINDETERMINATE: string = 'e-ripple-stop';
const RTL: string = 'e-rtl';
const WRAPPER: string = 'e-checkbox-wrapper';
const containerAttr: string[] = ['title', 'class', 'style', 'disabled', 'readonly', 'name', 'value', 'id', 'tabindex', 'aria-label', 'required'];

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
    private isFocused: boolean = false;
    private isMouseClick: boolean = false;
    private formElement: HTMLElement;
    private initialCheckedValue: boolean;
    private wrapper: Element;
    private clickTriggered: boolean = false;
    private validCheck: boolean = true;
    private type: string = 'checkbox';

    /**
     * Triggers when the CheckBox state has been changed by user interaction.
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
     * Specifies a value that indicates whether the CheckBox is `checked` or not.
     * When set to `true`, the CheckBox will be in `checked` state.
     *
     * @default false
     */
    @Property(false)
    public checked: boolean;

    /**
     * Defines class/multiple classes separated by a space in the CheckBox element.
     * You can add custom styles to the CheckBox by using this property.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies a value that indicates whether the CheckBox is `disabled` or not.
     * When set to `true`, the CheckBox will be in `disabled` state.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Specifies a value that indicates whether the CheckBox is in `indeterminate` state or not.
     * When set to `true`, the CheckBox will be in `indeterminate` state.
     *
     * @default false
     */
    @Property(false)
    public indeterminate: boolean;

    /**
     * Defines the caption for the CheckBox, that describes the purpose of the CheckBox.
     *
     * @default ''
     */
    @Property('')
    public label: string;

    /**
     * Positions label `before`/`after` the CheckBox.
     * The possible values are:
     * * Before - The label is positioned to left of the CheckBox.
     * * After - The label is positioned to right of the CheckBox.
     *
     * @default 'After'
     */
    @Property('After')
    public labelPosition: LabelPosition;

    /**
     * Defines `name` attribute for the CheckBox.
     * It is used to reference form data (CheckBox value) after a form is submitted.
     *
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Defines `value` attribute for the CheckBox.
     * It is a form data passed to the server when submitting the form.
     *
     * @default ''
     */
    @Property('')
    public value: string;

    /**
     * Specifies whether to enable the rendering of untrusted HTML values in the CheckBox component.
     * If 'enableHtmlSanitizer' set to true, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default true
     */
    @Property(true)
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
     * @param {CheckBoxModel} options - Specifies checkbox model
     * @param {string | HTMLInputElement} element - Specifies target element
     */
    constructor(options?: CheckBoxModel, element?: string | HTMLInputElement) {
        super(options, <string | HTMLInputElement>element);
    }

    private changeState(state?: string, isInitialize?: boolean, isInterAction?: boolean): void {
        const wrapper: Element = this.getWrapper() as Element;
        let rippleSpan: Element | null = null;
        let frameSpan: Element | null = null;
        if (wrapper) {
            frameSpan = wrapper.getElementsByClassName(FRAME)[0];
            if (isRippleEnabled) {
                rippleSpan = wrapper.getElementsByClassName(RIPPLE)[0];
            }
        }
        if (state === 'check') {
            if (frameSpan) {
                frameSpan.classList.remove(INDETERMINATE);
                frameSpan.classList.add(CHECK);
            }
            if (rippleSpan) {
                rippleSpan.classList.remove(RIPPLEINDETERMINATE);
                rippleSpan.classList.add(RIPPLECHECK);
            }
            this.element.checked = true;
            if ((this.element.required || closest(this.element, 'form') && closest(this.element, 'form').classList.contains('e-formvalidator')) && this.validCheck && !isInitialize && isInterAction) {
                this.element.checked = false;
                this.validCheck = false;
            } else if (this.element.required || closest(this.element, 'form') && closest(this.element, 'form').classList.contains('e-formvalidator')) {
                this.validCheck = true;
            }
        } else if (state === 'uncheck') {
            if (frameSpan) {
                removeClass([frameSpan], [CHECK, INDETERMINATE]);
            }
            if (rippleSpan) {
                removeClass([rippleSpan], [RIPPLECHECK, RIPPLEINDETERMINATE]);
            }
            this.element.checked = false;
            if ((this.element.required || closest(this.element, 'form') && closest(this.element, 'form').classList.contains('e-formvalidator')) && this.validCheck && !isInitialize && isInterAction) {
                this.element.checked = true;
                this.validCheck = false;
            } else if (this.element.required || closest(this.element, 'form') && closest(this.element, 'form').classList.contains('e-formvalidator')) {
                this.validCheck = true;
            }
        } else {
            if (frameSpan) {
                frameSpan.classList.remove(CHECK);
                frameSpan.classList.add(INDETERMINATE);
            }
            if (rippleSpan) {
                rippleSpan.classList.remove(RIPPLECHECK);
                rippleSpan.classList.add(RIPPLEINDETERMINATE);
            }
            this.element.indeterminate = true;
            this.indeterminate = true;
        }
    }

    private clickHandler(event: Event): void {
        if ((event.target as HTMLElement).tagName === 'INPUT' && this.clickTriggered) {
            this.changeState(this.checked ? 'check' : 'uncheck');
            this.clickTriggered = false;
            return;
        }
        if ((event.target as HTMLElement).tagName === 'SPAN' || (event.target as HTMLElement).tagName === 'LABEL' ||
            closest(event.target as Element, '.e-label')) {
            this.clickTriggered = true;
        }
        if (this.isMouseClick) {
            this.focusOutHandler();
            this.isMouseClick = false;
        }
        if (this.indeterminate) {
            this.changeState(this.checked ? 'check' : 'uncheck', false, true);
            this.indeterminate = false;
            this.element.indeterminate = false;
        } else if (this.checked) {
            this.changeState('uncheck', false, true);
            this.checked = false;
        } else {
            this.changeState('check', false, true);
            this.checked = true;
        }
        const changeEventArgs: ChangeEventArgs = { checked: this.updateVueArrayModel(false), event: event };
        this.trigger('change', changeEventArgs);
        event.stopPropagation();
    }

    /**
     * Destroys the widget.
     *
     * @returns {void}
     */
    public destroy(): void {
        let wrapper: Element = this.getWrapper() as Element;
        super.destroy();
        if (this.wrapper) {
            wrapper = this.wrapper;
            if (!this.disabled) {
                this.unWireEvents();
            }
            if (this.tagName === 'INPUT') {
                if (this.getWrapper() && wrapper.parentNode) {
                    wrapper.parentNode.insertBefore(this.element, wrapper);
                }
                detach(wrapper);
                this.element.checked = false;
                if (this.indeterminate) {
                    this.element.indeterminate = false;
                }
                ['name', 'value', 'disabled'].forEach((key: string) => {
                    this.element.removeAttribute(key);
                });
            } else {
                ['class'].forEach((key: string) => {
                    wrapper.removeAttribute(key);
                });
                wrapper.innerHTML = '';
                this.element = wrapper as HTMLInputElement;
                if (this.refreshing) {
                    ['e-control', 'e-checkbox', 'e-lib'].forEach((key: string) => {
                        this.element.classList.add(key);
                    });
                    setValue('ej2_instances', [this], this.element);
                }
            }
        }
    }

    private focusHandler(): void {
        this.isFocused = true;
    }

    private focusOutHandler(): void {
        const wrapper: Element = this.getWrapper() as Element;
        if (wrapper) {
            wrapper.classList.remove('e-focus');
        }
        this.isFocused = false;
    }

    /**
     * Gets the module name.
     *
     * @private
     * @returns {string} - Module Name
     */
    protected getModuleName(): string {
        return 'checkbox';
    }

    /**
     * Gets the properties to be maintained in the persistence state.
     *
     * @private
     * @returns {string} - Persist Data
     */
    public getPersistData(): string {
        return this.addOnPersist(['checked', 'indeterminate']);
    }

    private getWrapper(): Element | null {
        if (this.element && this.element.parentElement) {
            return this.element.parentElement.parentElement;
        } else {
            return null;
        }
    }

    private getLabel(): Element | null {
        if (this.element) {
            return this.element.parentElement;
        } else {
            return null;
        }
    }

    private initialize(): void {
        if (isNullOrUndefined(this.initialCheckedValue)) {
            this.initialCheckedValue = this.checked;
        }
        if (this.name) {
            this.element.setAttribute('name', this.name);
        }
        this.element.setAttribute('tabindex', '0');
        if (this.value) {
            this.element.setAttribute('value', this.value);
            if (this.isVue && typeof this.value === 'boolean' && this.value === true) {
                this.setProperties({ 'checked': true }, true);
            }
        }
        if (this.checked) {
            this.changeState('check', true);
        }
        if (this.indeterminate) {
            this.changeState();
        }
        if (this.disabled) {
            this.setDisabled();
        }
    }

    private initWrapper(): void {
        let wrapper: Element = this.element.parentElement as Element;
        if (!wrapper.classList.contains(WRAPPER)) {
            wrapper = this.createElement('div', {
                className: WRAPPER
            });
            if (this.element.parentNode) {
                this.element.parentNode.insertBefore(wrapper, this.element);
            }
        }
        const label: Element = this.createElement('label', { attrs: { for: this.htmlAttributes.id ? this.htmlAttributes.id : this.element.id } });
        const frameSpan: Element = this.createElement('span', { className: 'e-icons ' + FRAME });
        wrapper.classList.add('e-wrapper');
        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        if (this.cssClass) {
            addClass([wrapper], this.cssClass.replace(/\s+/g, ' ').trim().split(' '));
        }
        wrapper.appendChild(label);
        label.appendChild(this.element);
        setHiddenInput(this, label);
        label.appendChild(frameSpan);
        if (isRippleEnabled) {
            const rippleSpan: HTMLElement = this.createElement('span', { className: RIPPLE });
            if (this.labelPosition === 'Before') {
                label.appendChild(rippleSpan);
            } else {
                label.insertBefore(rippleSpan, frameSpan);
            }
            rippleEffect(rippleSpan, { duration: 400, isCenterRipple: true });
        }
        if (this.label) {
            this.setText(this.label);
        }
    }

    private keyUpHandler(): void {
        if (this.isFocused) {
            (this.getWrapper() as Element).classList.add('e-focus');
        }
    }

    private labelMouseDownHandler(e: MouseEvent): void {
        this.isMouseClick = true;
        const rippleSpan: Element = (this.getWrapper() as Element).getElementsByClassName(RIPPLE)[0];
        rippleMouseHandler(e, rippleSpan);
    }

    private labelMouseLeaveHandler(e: MouseEvent): void {
        const rippleSpan: Element = (this.getLabel() as Element).getElementsByClassName(RIPPLE)[0];
        if (rippleSpan) {
            const rippleElem: NodeListOf<Element> = rippleSpan.querySelectorAll('.e-ripple-element');
            for (let i: number = rippleElem.length - 1; i > 0; i--) {
                rippleSpan.removeChild(rippleSpan.childNodes[i as number]);
            }
            rippleMouseHandler(e, rippleSpan);
        }
    }

    private labelMouseUpHandler(e: MouseEvent): void {
        this.isMouseClick = true;
        const rippleSpan: Element = (this.getWrapper() as Element).getElementsByClassName(RIPPLE)[0];
        if (rippleSpan) {
            const rippleElem: NodeListOf<Element> = rippleSpan.querySelectorAll('.e-ripple-element');
            for (let i: number = 0; i < rippleElem.length - 1; i++) {
                rippleSpan.removeChild(rippleSpan.childNodes[i as number]);
            }
            rippleMouseHandler(e, rippleSpan);
        }
    }

    /**
     * Called internally if any of the property value changes.
     *
     * @private
     * @param {CheckBoxModel} newProp - Specifies new Properties
     * @param {CheckBoxModel} oldProp - Specifies old Properties
     *
     * @returns {void}
     */
    public onPropertyChanged(newProp: CheckBoxModel, oldProp: CheckBoxModel): void {
        const wrapper: Element = this.getWrapper() as Element;
        for (const prop of Object.keys(newProp)) {
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
                    this.wrapper = this.getWrapper() as Element;
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
                    removeClass([wrapper], oldProp.cssClass.split(/\s+/).filter((c: string) => c.length > 0));
                }
                if (newProp.cssClass) {
                    addClass([wrapper], newProp.cssClass.replace(/\s+/g, ' ').trim().split(' '));
                }
                break;
            case 'enableRtl':
                if (newProp.enableRtl) {
                    wrapper.classList.add(RTL);
                } else {
                    wrapper.classList.remove(RTL);
                }
                break;
            case 'label':
                this.setText(newProp.label as string);
                break;
            case 'labelPosition': {
                const label: Element = wrapper.getElementsByClassName(LABEL)[0];
                const labelWrap: Element = wrapper.getElementsByTagName('label')[0];
                detach(label);
                if (newProp.labelPosition === 'After') {
                    labelWrap.appendChild(label);
                } else {
                    labelWrap.insertBefore(label, wrapper.getElementsByClassName(FRAME)[0]);
                }
                break;
            }
            case 'name':
                this.element.setAttribute('name', newProp.name as string);
                break;
            case 'value':
                if (this.isVue && typeof newProp.value === 'object') { break; }
                this.element.setAttribute('value', newProp.value as string);
                break;
            case 'htmlAttributes':
                this.updateHtmlAttributeToWrapper();
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
     * Initialize the control rendering.
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
        this.updateHtmlAttributeToWrapper();
        this.updateVueArrayModel(true);
        this.renderComplete();
        this.wrapper = this.getWrapper() as Element;
    }

    private setDisabled(): void {
        const wrapper: Element = this.getWrapper() as Element;
        this.element.disabled = true;
        wrapper.classList.add(DISABLED);
        wrapper.setAttribute('aria-disabled', 'true');
    }

    private setText(text: string): void {
        const wrapper: Element = this.getWrapper() as Element;
        if (!wrapper) {
            return;
        }
        let label: Element = wrapper.getElementsByClassName(LABEL)[0];
        if (label) {
            label.innerHTML = (this.enableHtmlSanitizer) ? SanitizeHtmlHelper.sanitize(text) : text;
        } else {
            text = (this.enableHtmlSanitizer) ? SanitizeHtmlHelper.sanitize(text) : text;
            label = this.createElement('span', { className: LABEL, innerHTML: text });
            const labelWrap: Element = wrapper.getElementsByTagName('label')[0];
            if (this.labelPosition === 'Before') {
                labelWrap.insertBefore(label, wrapper.getElementsByClassName(FRAME)[0]);
            } else {
                labelWrap.appendChild(label);
            }
        }
    }

    private changeHandler(e: MouseEvent): void {
        e.stopPropagation();
    }

    private formResetHandler(): void {
        this.checked = this.initialCheckedValue;
        this.element.checked = this.initialCheckedValue;
    }

    protected unWireEvents(): void {
        const wrapper: Element = this.wrapper;
        EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        if (wrapper) {
            EventHandler.remove(wrapper, 'click', this.clickHandler);
            const label: Element = wrapper.getElementsByTagName('label')[0];
            if (label) {
                EventHandler.remove(label, 'mousedown', this.labelMouseDownHandler);
                EventHandler.remove(label, 'mouseup', this.labelMouseUpHandler);
                EventHandler.remove(label, 'mouseleave', this.labelMouseLeaveHandler);
            }
        }
        const formElem: HTMLFormElement = <HTMLFormElement>closest(this.element, 'form');
        if (formElem) {
            EventHandler.remove(formElem, 'reset', this.formResetHandler);
        }
        if (this.tagName === 'EJS-CHECKBOX') {
            EventHandler.remove(this.element, 'change', this.changeHandler);
        }

    }

    protected wireEvents(): void {
        const wrapper: Element = this.getWrapper() as Element;
        EventHandler.add(wrapper, 'click', this.clickHandler, this);
        EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        const label: Element = wrapper.getElementsByTagName('label')[0];
        EventHandler.add(label, 'mousedown', this.labelMouseDownHandler, this);
        EventHandler.add(label, 'mouseup', this.labelMouseUpHandler, this);
        EventHandler.add(label, 'mouseleave', this.labelMouseLeaveHandler, this);
        const formElem: HTMLFormElement = <HTMLFormElement>closest(this.element, 'form');
        if (formElem) {
            EventHandler.add(formElem, 'reset', this.formResetHandler, this);
        }
        if (this.tagName === 'EJS-CHECKBOX') {
            EventHandler.add(this.element, 'change', this.changeHandler, this);
        }
    }

    private updateVueArrayModel(init: boolean): boolean {
        if (this.isVue && typeof this.value === 'object') {
            const value: string = this.element.value;
            if (value && this.value) {
                if (init) {
                    for (let i: number = 0; i < (this.value as string[]).length; i++) {
                        if (value === (this.value as string[])[i as number]) {
                            this.changeState('check'); this.setProperties({ 'checked': true }, true);
                        }
                    }
                } else {
                    const index: number = (this.value as string[]).indexOf(value);
                    if (this.checked) {
                        if (index < 0) {
                            (this.value as string[]).push(value);
                        }
                    } else {
                        if (index > -1) {
                            (this.value as string[]).splice(index, 1);
                        }
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return this.value as any;
                }
            }
        }
        return this.validCheck ? this.element.checked : !this.element.checked;
    }

    protected updateHtmlAttributeToWrapper(): void {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (const key of Object.keys(this.htmlAttributes)) {
                const wrapper: Element = this.getWrapper() as Element;
                if (containerAttr.indexOf(key) > -1) {
                    if (key === 'class') {
                        addClass([wrapper], this.htmlAttributes[`${key}`].split(' '));
                    } else if (key === 'title') {
                        wrapper.setAttribute(key, this.htmlAttributes[`${key}`]);
                    } else if (key === 'style') {
                        const frameSpan: Element = (this.getWrapper() as Element).getElementsByClassName(FRAME)[0];
                        frameSpan.setAttribute(key, this.htmlAttributes[`${key}`]);
                    } else if (key === 'disabled') {
                        if (this.htmlAttributes[`${key}`] === 'true') {
                            this.setDisabled();
                        }
                        this.element.setAttribute(key, this.htmlAttributes[`${key}`]);
                    }
                    else {
                        this.element.setAttribute(key, this.htmlAttributes[`${key}`]);
                    }
                } else {
                    wrapper.setAttribute(key, this.htmlAttributes[`${key}`]);
                }
            }
        }
    }

    /**
     * Click the CheckBox element
     * its native method
     *
     * @public
     * @returns {void}
     */
    public click(): void {
        this.element.click();
    }

    /**
     * Sets the focus to CheckBox
     * its native method
     *
     * @public
     * @returns {void}
     */
    public focusIn(): void {
        this.element.focus();
    }
}
