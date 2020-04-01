import { Component, Event, EventHandler, NotifyPropertyChanges, Observer, Property, SanitizeHtmlHelper, addClass, append, attributes, closest, deleteObject, detach, getElement, getInstance, getUniqueID, getValue, isBlazor, isNullOrUndefined, isRippleEnabled, removeClass, rippleEffect, setValue } from '@syncfusion/ej2-base';

/**
 * Initialize wrapper element for angular.
 * @private
 */
function wrapperInitialize(createElement, tag, type, element, WRAPPER, role) {
    let input = element;
    if (element.tagName === tag) {
        let ejInstance = getValue('ej2_instances', element);
        input = createElement('input', { attrs: { 'type': type } });
        let props = ['change', 'cssClass', 'label', 'labelPosition', 'id'];
        for (let index = 0, len = element.attributes.length; index < len; index++) {
            if (props.indexOf(element.attributes[index].nodeName) === -1) {
                input.setAttribute(element.attributes[index].nodeName, element.attributes[index].nodeValue);
            }
        }
        attributes(element, { 'class': WRAPPER, 'role': role, 'aria-checked': 'false' });
        element.appendChild(input);
        setValue('ej2_instances', ejInstance, input);
        deleteObject(element, 'ej2_instances');
    }
    return input;
}
function getTextNode(element) {
    let node;
    let childnode = element.childNodes;
    for (let i = 0; i < childnode.length; i++) {
        node = childnode[i];
        if (node.nodeType === 3) {
            return node;
        }
    }
    return null;
}
/**
 * Destroy the button components.
 * @private
 */
function destroy(ejInst, wrapper, tagName) {
    if (tagName === 'INPUT') {
        wrapper.parentNode.insertBefore(ejInst.element, wrapper);
        detach(wrapper);
        ejInst.element.checked = false;
        ['name', 'value', 'disabled'].forEach((key) => {
            ejInst.element.removeAttribute(key);
        });
    }
    else {
        ['role', 'aria-checked', 'class'].forEach((key) => {
            wrapper.removeAttribute(key);
        });
        wrapper.innerHTML = '';
    }
}
function preRender(proxy, control, wrapper, element, moduleName) {
    element = wrapperInitialize(proxy.createElement, control, 'checkbox', element, wrapper, moduleName);
    proxy.element = element;
    if (proxy.element.getAttribute('type') !== 'checkbox') {
        proxy.element.setAttribute('type', 'checkbox');
    }
    if (!proxy.element.id) {
        proxy.element.id = getUniqueID('e-' + moduleName);
    }
}
/**
 * Creates CheckBox component UI with theming and ripple support.
 * @private
 */
function createCheckBox(createElement, enableRipple = false, options = {}) {
    let wrapper = createElement('div', { className: 'e-checkbox-wrapper e-css' });
    if (options.cssClass) {
        addClass([wrapper], options.cssClass.split(' '));
    }
    if (options.enableRtl) {
        wrapper.classList.add('e-rtl');
    }
    if (enableRipple) {
        let rippleSpan = createElement('span', { className: 'e-ripple-container' });
        rippleEffect(rippleSpan, { isCenterRipple: true, duration: 400 });
        wrapper.appendChild(rippleSpan);
    }
    let frameSpan = createElement('span', { className: 'e-frame e-icons' });
    if (options.checked) {
        frameSpan.classList.add('e-check');
    }
    wrapper.appendChild(frameSpan);
    if (options.label) {
        let labelSpan = createElement('span', { className: 'e-label', innerHTML: options.label });
        wrapper.appendChild(labelSpan);
    }
    return wrapper;
}
function rippleMouseHandler(e, rippleSpan) {
    if (rippleSpan) {
        let event = document.createEvent('MouseEvents');
        event.initEvent(e.type, false, true);
        rippleSpan.dispatchEvent(event);
    }
}
/**
 * Append hidden input to given element
 * @private
 */
function setHiddenInput(proxy, wrap) {
    if (proxy.element.getAttribute('ejs-for')) {
        wrap.appendChild(proxy.createElement('input', {
            attrs: { 'name': proxy.name || proxy.element.name, 'value': 'false', 'type': 'hidden' }
        }));
    }
}

/**
 * Common modules
 */

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const buttonObserver = new Observer();
const cssClassName = {
    RTL: 'e-rtl',
    BUTTON: 'e-btn',
    PRIMARY: 'e-primary',
    ICONBTN: 'e-icon-btn'
};
/**
 * The Button is a graphical user interface element that triggers an event on its click action. It can contain a text, an image, or both.
 * ```html
 * <button id="button">Button</button>
 * ```
 * ```typescript
 * <script>
 * var btnObj = new Button();
 * btnObj.appendTo("#button");
 * </script>
 * ```
 */
let Button = class Button extends Component {
    /**
     * Constructor for creating the widget
     * @param  {ButtonModel} options?
     * @param  {string|HTMLButtonElement} element?
     */
    constructor(options, element) {
        super(options, element);
    }
    preRender() {
        // pre render code snippets
    }
    /**
     * Initialize the control rendering
     * @returns void
     * @private
     */
    render() {
        if (isBlazor() && this.isServerRendered) {
            if (!this.disabled) {
                this.wireEvents();
            }
            buttonObserver.notify('component-rendered', { id: this.element.id, instance: this });
        }
        else {
            this.initialize();
        }
        this.removeRippleEffect = rippleEffect(this.element, { selector: '.' + cssClassName.BUTTON });
        this.renderComplete();
    }
    initialize() {
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
        if (this.isPrimary) {
            this.element.classList.add(cssClassName.PRIMARY);
        }
        if (!isBlazor() || (isBlazor() && this.getModuleName() !== 'progress-btn')) {
            if (this.content) {
                let tempContent = (this.enableHtmlSanitizer) ? SanitizeHtmlHelper.sanitize(this.content) : this.content;
                this.element.innerHTML = tempContent;
            }
            this.setIconCss();
        }
        if (this.enableRtl) {
            this.element.classList.add(cssClassName.RTL);
        }
        if (this.disabled) {
            this.controlStatus(this.disabled);
        }
        else {
            this.wireEvents();
        }
    }
    controlStatus(disabled) {
        this.element.disabled = disabled;
    }
    setIconCss() {
        if (this.iconCss) {
            let span = this.createElement('span', { className: 'e-btn-icon ' + this.iconCss });
            if (!this.element.textContent.trim()) {
                this.element.classList.add(cssClassName.ICONBTN);
            }
            else {
                span.classList.add('e-icon-' + this.iconPosition.toLowerCase());
                if (this.iconPosition === 'Top' || this.iconPosition === 'Bottom') {
                    this.element.classList.add('e-' + this.iconPosition.toLowerCase() + '-icon-btn');
                }
            }
            let node = this.element.childNodes[0];
            if (node && (this.iconPosition === 'Left' || this.iconPosition === 'Top')) {
                this.element.insertBefore(span, node);
            }
            else {
                this.element.appendChild(span);
            }
        }
    }
    wireEvents() {
        if (this.isToggle) {
            EventHandler.add(this.element, 'click', this.btnClickHandler, this);
        }
    }
    unWireEvents() {
        if (this.isToggle) {
            EventHandler.remove(this.element, 'click', this.btnClickHandler);
        }
    }
    btnClickHandler() {
        if (this.element.classList.contains('e-active')) {
            this.element.classList.remove('e-active');
        }
        else {
            this.element.classList.add('e-active');
        }
    }
    /**
     * Destroys the widget.
     * @returns void
     */
    destroy() {
        if (!(isBlazor() && this.isServerRendered)) {
            let span;
            let classList = [cssClassName.PRIMARY, cssClassName.RTL, cssClassName.ICONBTN, 'e-success', 'e-info', 'e-danger',
                'e-warning', 'e-flat', 'e-outline', 'e-small', 'e-bigger', 'e-active', 'e-round',
                'e-top-icon-btn', 'e-bottom-icon-btn'];
            if (this.cssClass) {
                classList = classList.concat(this.cssClass.split(' '));
            }
            super.destroy();
            removeClass([this.element], classList);
            if (!this.element.getAttribute('class')) {
                this.element.removeAttribute('class');
            }
            if (this.disabled) {
                this.element.removeAttribute('disabled');
            }
            if (this.content) {
                this.element.innerHTML = this.element.innerHTML.replace(this.content, '');
            }
            span = this.element.querySelector('span.e-btn-icon');
            if (span) {
                detach(span);
            }
        }
        this.unWireEvents();
        if (isRippleEnabled) {
            this.removeRippleEffect();
        }
    }
    /**
     * Get component name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'btn';
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @private
     */
    getPersistData() {
        return this.addOnPersist([]);
    }
    /**
     * Dynamically injects the required modules to the component.
     * @private
     */
    static Inject() {
        // Inject code snippets
    }
    /**
     * Called internally if any of the property value changed.
     * @param  {ButtonModel} newProp
     * @param  {ButtonModel} oldProp
     * @returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'isPrimary':
                    if (newProp.isPrimary) {
                        this.element.classList.add(cssClassName.PRIMARY);
                    }
                    else {
                        this.element.classList.remove(cssClassName.PRIMARY);
                    }
                    break;
                case 'disabled':
                    this.controlStatus(newProp.disabled);
                    break;
                case 'iconCss':
                    let span = this.element.querySelector('span.e-btn-icon');
                    if (span) {
                        if (newProp.iconCss) {
                            span.className = 'e-btn-icon ' + newProp.iconCss;
                            if (this.element.textContent.trim()) {
                                if (this.iconPosition === 'Left') {
                                    span.classList.add('e-icon-left');
                                }
                                else {
                                    span.classList.add('e-icon-right');
                                }
                            }
                        }
                        else {
                            detach(span);
                        }
                    }
                    else {
                        this.setIconCss();
                    }
                    break;
                case 'iconPosition':
                    removeClass([this.element], ['e-top-icon-btn', 'e-bottom-icon-btn']);
                    span = this.element.querySelector('span.e-btn-icon');
                    if (span) {
                        detach(span);
                    }
                    this.setIconCss();
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([this.element], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([this.element], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        this.element.classList.add(cssClassName.RTL);
                    }
                    else {
                        this.element.classList.remove(cssClassName.RTL);
                    }
                    break;
                case 'content':
                    let node = getTextNode(this.element);
                    if (!node) {
                        this.element.classList.remove(cssClassName.ICONBTN);
                    }
                    if (!isBlazor() || (isBlazor() && !this.isServerRendered && this.getModuleName() !== 'progress-btn')) {
                        if (this.enableHtmlSanitizer) {
                            newProp.content = SanitizeHtmlHelper.sanitize(newProp.content);
                        }
                        this.element.innerHTML = newProp.content;
                        this.setIconCss();
                    }
                    break;
                case 'isToggle':
                    if (newProp.isToggle) {
                        EventHandler.add(this.element, 'click', this.btnClickHandler, this);
                    }
                    else {
                        EventHandler.remove(this.element, 'click', this.btnClickHandler);
                        removeClass([this.element], ['e-active']);
                    }
                    break;
            }
        }
    }
    /**
     * Click the button element
     * its native method
     * @public
     */
    click() {
        this.element.click();
    }
    /**
     * Sets the focus to Button
     * its native method
     * @public
     */
    focusIn() {
        this.element.focus();
    }
};
__decorate([
    Property('Left')
], Button.prototype, "iconPosition", void 0);
__decorate([
    Property('')
], Button.prototype, "iconCss", void 0);
__decorate([
    Property(false)
], Button.prototype, "disabled", void 0);
__decorate([
    Property(false)
], Button.prototype, "isPrimary", void 0);
__decorate([
    Property('')
], Button.prototype, "cssClass", void 0);
__decorate([
    Property('')
], Button.prototype, "content", void 0);
__decorate([
    Property(false)
], Button.prototype, "isToggle", void 0);
__decorate([
    Property()
], Button.prototype, "locale", void 0);
__decorate([
    Property(false)
], Button.prototype, "enableHtmlSanitizer", void 0);
__decorate([
    Event()
], Button.prototype, "created", void 0);
Button = __decorate([
    NotifyPropertyChanges
], Button);

/**
 * Button modules
 */

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const CHECK = 'e-check';
const DISABLED = 'e-checkbox-disabled';
const FRAME = 'e-frame';
const INDETERMINATE = 'e-stop';
const LABEL = 'e-label';
const RIPPLE = 'e-ripple-container';
const RIPPLECHECK = 'e-ripple-check';
const RIPPLEINDETERMINATE = 'e-ripple-stop';
const RTL = 'e-rtl';
const WRAPPER = 'e-checkbox-wrapper';
const containerAttr = ['title', 'class', 'style', 'disabled', 'readonly', 'name', 'value'];
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
let CheckBox = class CheckBox extends Component {
    /**
     * Constructor for creating the widget
     * @private
     */
    constructor(options, element) {
        super(options, element);
        this.isFocused = false;
        this.isMouseClick = false;
    }
    changeState(state) {
        let ariaState;
        let rippleSpan;
        let frameSpan = this.getWrapper().getElementsByClassName(FRAME)[0];
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
        }
        else if (state === 'uncheck') {
            removeClass([frameSpan], [CHECK, INDETERMINATE]);
            if (rippleSpan) {
                removeClass([rippleSpan], [RIPPLECHECK, RIPPLEINDETERMINATE]);
            }
            ariaState = 'false';
            this.element.checked = false;
        }
        else {
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
    clickHandler(event) {
        if (this.isMouseClick) {
            this.focusOutHandler();
            this.isMouseClick = false;
        }
        if (this.indeterminate) {
            this.changeState(this.checked ? 'check' : 'uncheck');
            this.indeterminate = false;
            this.element.indeterminate = false;
        }
        else if (this.checked) {
            this.changeState('uncheck');
            this.checked = false;
        }
        else {
            this.changeState('check');
            this.checked = true;
        }
        let changeEventArgs = { checked: this.element.checked, event: event };
        this.trigger('change', changeEventArgs);
    }
    /**
     * Destroys the widget.
     * @returns void
     */
    destroy() {
        let wrapper = this.getWrapper();
        if (isBlazor() && this.isServerRendered) {
            if (!this.disabled) {
                this.unWireEvents();
            }
        }
        else {
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
                ['name', 'value', 'disabled'].forEach((key) => {
                    this.element.removeAttribute(key);
                });
            }
            else {
                ['role', 'aria-checked', 'class'].forEach((key) => {
                    wrapper.removeAttribute(key);
                });
                wrapper.innerHTML = '';
            }
        }
    }
    focusHandler() {
        this.isFocused = true;
    }
    focusOutHandler() {
        this.getWrapper().classList.remove('e-focus');
        this.isFocused = false;
    }
    /**
     * Gets the module name.
     * @private
     */
    getModuleName() {
        return 'checkbox';
    }
    /**
     * Gets the properties to be maintained in the persistence state.
     * @private
     */
    getPersistData() {
        return this.addOnPersist(['checked', 'indeterminate']);
    }
    getWrapper() {
        return this.element.parentElement.parentElement;
    }
    initialize() {
        if (isNullOrUndefined(this.initialCheckedValue)) {
            this.initialCheckedValue = this.checked;
        }
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
    initWrapper() {
        let wrapper = this.element.parentElement;
        if (!wrapper.classList.contains(WRAPPER)) {
            wrapper = this.createElement('div', {
                className: WRAPPER, attrs: { 'role': 'checkbox', 'aria-checked': 'false' }
            });
            this.element.parentNode.insertBefore(wrapper, this.element);
        }
        let label = this.createElement('label', { attrs: { for: this.element.id } });
        let frameSpan = this.createElement('span', { className: 'e-icons ' + FRAME });
        wrapper.classList.add('e-wrapper');
        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        if (this.cssClass) {
            addClass([wrapper], this.cssClass.split(' '));
        }
        wrapper.appendChild(label);
        label.appendChild(this.element);
        setHiddenInput(this, label);
        label.appendChild(frameSpan);
        if (isRippleEnabled) {
            let rippleSpan = this.createElement('span', { className: RIPPLE });
            if (this.labelPosition === 'Before') {
                label.appendChild(rippleSpan);
            }
            else {
                label.insertBefore(rippleSpan, frameSpan);
            }
            rippleEffect(rippleSpan, { duration: 400, isCenterRipple: true });
        }
        if (this.label) {
            this.setText(this.label);
        }
    }
    keyUpHandler() {
        if (this.isFocused) {
            this.getWrapper().classList.add('e-focus');
        }
    }
    labelMouseHandler(e) {
        this.isMouseClick = true;
        let rippleSpan = this.getWrapper().getElementsByClassName(RIPPLE)[0];
        rippleMouseHandler(e, rippleSpan);
    }
    /**
     * Called internally if any of the property value changes.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        let wrapper = this.getWrapper();
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
                    }
                    else {
                        this.element.indeterminate = false;
                        this.changeState(this.checked ? 'check' : 'uncheck');
                    }
                    break;
                case 'disabled':
                    if (newProp.disabled) {
                        this.setDisabled();
                        this.unWireEvents();
                    }
                    else {
                        this.element.disabled = false;
                        wrapper.classList.remove(DISABLED);
                        wrapper.setAttribute('aria-disabled', 'false');
                        this.wireEvents();
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
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        wrapper.classList.add(RTL);
                    }
                    else {
                        wrapper.classList.remove(RTL);
                    }
                    break;
                case 'label':
                    this.setText(newProp.label);
                    break;
                case 'labelPosition':
                    let label = wrapper.getElementsByClassName(LABEL)[0];
                    let labelWrap = wrapper.getElementsByTagName('label')[0];
                    detach(label);
                    if (newProp.labelPosition === 'After') {
                        labelWrap.appendChild(label);
                    }
                    else {
                        labelWrap.insertBefore(label, wrapper.getElementsByClassName(FRAME)[0]);
                    }
                    break;
                case 'name':
                    this.element.setAttribute('name', newProp.name);
                    break;
                case 'value':
                    this.element.setAttribute('value', newProp.value);
                    break;
                case 'htmlAttributes':
                    this.updateHtmlAttributeToWrapper();
                    break;
            }
        }
    }
    /**
     * Initialize Angular, React and Unique ID support.
     * @private
     */
    preRender() {
        if (isBlazor() && this.isServerRendered) {
            return;
        }
        let element = this.element;
        this.formElement = closest(this.element, 'form');
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
     * @private
     */
    render() {
        if (isBlazor() && this.isServerRendered) {
            if (isRippleEnabled) {
                rippleEffect(this.getWrapper().getElementsByClassName(RIPPLE)[0], { duration: 400, isCenterRipple: true });
            }
        }
        else {
            this.initWrapper();
            this.initialize();
        }
        if (!this.disabled) {
            this.wireEvents();
        }
        this.updateHtmlAttributeToWrapper();
        this.renderComplete();
    }
    setDisabled() {
        let wrapper = this.getWrapper();
        this.element.disabled = true;
        wrapper.classList.add(DISABLED);
        wrapper.setAttribute('aria-disabled', 'true');
    }
    setText(text) {
        let label = this.getWrapper().getElementsByClassName(LABEL)[0];
        if (label) {
            label.textContent = text;
        }
        else {
            text = (this.enableHtmlSanitizer) ? SanitizeHtmlHelper.sanitize(text) : text;
            label = this.createElement('span', { className: LABEL, innerHTML: text });
            let labelWrap = this.getWrapper().getElementsByTagName('label')[0];
            if (this.labelPosition === 'Before') {
                labelWrap.insertBefore(label, this.getWrapper().getElementsByClassName(FRAME)[0]);
            }
            else {
                labelWrap.appendChild(label);
            }
        }
    }
    changeHandler(e) {
        e.stopPropagation();
    }
    formResetHandler() {
        this.checked = this.initialCheckedValue;
        this.element.checked = this.initialCheckedValue;
    }
    unWireEvents() {
        let wrapper = this.getWrapper();
        EventHandler.remove(this.element, 'click', this.clickHandler);
        EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        let label = wrapper.getElementsByTagName('label')[0];
        EventHandler.remove(label, 'mousedown', this.labelMouseHandler);
        EventHandler.remove(label, 'mouseup', this.labelMouseHandler);
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
        if (this.tagName === 'EJS-CHECKBOX') {
            EventHandler.remove(this.element, 'change', this.changeHandler);
        }
    }
    wireEvents() {
        let wrapper = this.getWrapper();
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        let label = wrapper.getElementsByTagName('label')[0];
        EventHandler.add(label, 'mousedown', this.labelMouseHandler, this);
        EventHandler.add(label, 'mouseup', this.labelMouseHandler, this);
        if (this.formElement) {
            EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
        if (this.tagName === 'EJS-CHECKBOX') {
            EventHandler.add(this.element, 'change', this.changeHandler, this);
        }
    }
    updateHtmlAttributeToWrapper() {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (let key of Object.keys(this.htmlAttributes)) {
                if (containerAttr.indexOf(key) > -1) {
                    let wrapper = this.getWrapper();
                    if (key === 'class') {
                        addClass([wrapper], this.htmlAttributes[key].split(' '));
                    }
                    else if (key === 'title') {
                        wrapper.setAttribute(key, this.htmlAttributes[key]);
                    }
                    else if (key === 'style') {
                        let frameSpan = this.getWrapper().getElementsByClassName(FRAME)[0];
                        frameSpan.setAttribute(key, this.htmlAttributes[key]);
                    }
                    else {
                        this.element.setAttribute(key, this.htmlAttributes[key]);
                    }
                }
            }
        }
    }
    /**
     * Click the CheckBox element
     * its native method
     * @public
     */
    click() {
        this.element.click();
    }
    /**
     * Sets the focus to CheckBox
     * its native method
     * @public
     */
    focusIn() {
        this.element.focus();
    }
};
__decorate$1([
    Event()
], CheckBox.prototype, "change", void 0);
__decorate$1([
    Event()
], CheckBox.prototype, "created", void 0);
__decorate$1([
    Property(false)
], CheckBox.prototype, "checked", void 0);
__decorate$1([
    Property('')
], CheckBox.prototype, "cssClass", void 0);
__decorate$1([
    Property(false)
], CheckBox.prototype, "disabled", void 0);
__decorate$1([
    Property(false)
], CheckBox.prototype, "indeterminate", void 0);
__decorate$1([
    Property('')
], CheckBox.prototype, "label", void 0);
__decorate$1([
    Property('After')
], CheckBox.prototype, "labelPosition", void 0);
__decorate$1([
    Property('')
], CheckBox.prototype, "name", void 0);
__decorate$1([
    Property('')
], CheckBox.prototype, "value", void 0);
__decorate$1([
    Property(false)
], CheckBox.prototype, "enableHtmlSanitizer", void 0);
__decorate$1([
    Property({})
], CheckBox.prototype, "htmlAttributes", void 0);
CheckBox = __decorate$1([
    NotifyPropertyChanges
], CheckBox);

/**
 * CheckBox modules
 */

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RadioButton_1;
const LABEL$1 = 'e-label';
const RIPPLE$1 = 'e-ripple-container';
const RTL$1 = 'e-rtl';
const WRAPPER$1 = 'e-radio-wrapper';
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
let RadioButton = RadioButton_1 = class RadioButton extends Component {
    /**
     * Constructor for creating the widget
     * @private
     */
    constructor(options, element) {
        super(options, element);
        this.isFocused = false;
    }
    changeHandler(event) {
        this.checked = true;
        this.dataBind();
        let changeEventArgs = { value: this.value, event: event };
        this.trigger('change', changeEventArgs);
        if (this.tagName === 'EJS-RADIOBUTTON') {
            event.stopPropagation();
        }
    }
    updateChange(state) {
        let input;
        let instance;
        let radioGrp = this.getRadioGroup();
        for (let i = 0; i < radioGrp.length; i++) {
            input = radioGrp[i];
            if (input !== this.element) {
                instance = getInstance(input, RadioButton_1);
                instance.checked = false;
                if (this.tagName === 'EJS-RADIOBUTTON') {
                    instance.angularValue = this.value;
                }
            }
        }
    }
    /**
     * Destroys the widget.
     * @returns void
     */
    destroy() {
        if (isBlazor() && this.isServerRendered) {
            if (!this.disabled) {
                this.unWireEvents();
            }
        }
        else {
            let radioWrap = this.element.parentElement;
            super.destroy();
            if (!this.disabled) {
                this.unWireEvents();
            }
            if (this.tagName === 'INPUT') {
                radioWrap.parentNode.insertBefore(this.element, radioWrap);
                detach(radioWrap);
                this.element.checked = false;
                ['name', 'value', 'disabled'].forEach((key) => {
                    this.element.removeAttribute(key);
                });
            }
            else {
                ['role', 'aria-checked', 'class'].forEach((key) => {
                    radioWrap.removeAttribute(key);
                });
                radioWrap.innerHTML = '';
            }
        }
    }
    focusHandler() {
        this.isFocused = true;
    }
    focusOutHandler() {
        this.getLabel().classList.remove('e-focus');
    }
    getModuleName() {
        return 'radio';
    }
    /**
     * To get the value of selected radio button in a group.
     * @method getSelectedValue
     * @return {string}
     */
    getSelectedValue() {
        let input;
        let radioGrp = this.getRadioGroup();
        for (let i = 0, len = radioGrp.length; i < len; i++) {
            input = radioGrp[i];
            if (input.checked) {
                return input.value;
            }
        }
        return '';
    }
    getRadioGroup() {
        return document.querySelectorAll('input.e-radio[name="' + this.element.getAttribute('name') + '"]');
    }
    /**
     * Gets the properties to be maintained in the persistence state.
     * @private
     */
    getPersistData() {
        return this.addOnPersist(['checked']);
    }
    getLabel() {
        return this.element.nextElementSibling;
    }
    initialize() {
        if (isNullOrUndefined(this.initialCheckedValue)) {
            this.initialCheckedValue = this.checked;
        }
        this.initWrapper();
        if (this.name) {
            this.element.setAttribute('name', this.name);
        }
        if (this.value) {
            this.element.setAttribute('value', this.value);
        }
        if (this.checked) {
            this.element.checked = true;
        }
        if (this.disabled) {
            this.setDisabled();
        }
    }
    initWrapper() {
        let rippleSpan;
        let wrapper = this.element.parentElement;
        if (!wrapper.classList.contains(WRAPPER$1)) {
            wrapper = this.createElement('div', { className: WRAPPER$1 });
            this.element.parentNode.insertBefore(wrapper, this.element);
        }
        let label = this.createElement('label', { attrs: { for: this.element.id } });
        wrapper.appendChild(this.element);
        wrapper.appendChild(label);
        if (isRippleEnabled) {
            rippleSpan = this.createElement('span', { className: (RIPPLE$1) });
            label.appendChild(rippleSpan);
            rippleEffect(rippleSpan, {
                duration: 400,
                isCenterRipple: true
            });
        }
        wrapper.classList.add('e-wrapper');
        if (this.enableRtl) {
            label.classList.add(RTL$1);
        }
        if (this.cssClass) {
            addClass([label], this.cssClass.split(' '));
        }
        if (this.label) {
            this.setText(this.label);
        }
    }
    keyUpHandler() {
        if (this.isFocused) {
            this.getLabel().classList.add('e-focus');
        }
    }
    labelRippleHandler(e) {
        let ripple = this.getLabel().getElementsByClassName(RIPPLE$1)[0];
        rippleMouseHandler(e, ripple);
    }
    formResetHandler() {
        this.checked = this.initialCheckedValue;
        if (this.initialCheckedValue) {
            attributes(this.element, { 'checked': 'true' });
        }
    }
    /**
     * Called internally if any of the property value changes.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        let label = this.getLabel();
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'checked':
                    if (newProp.checked) {
                        this.updateChange(newProp.checked);
                    }
                    this.element.checked = newProp.checked;
                    break;
                case 'disabled':
                    if (newProp.disabled) {
                        this.setDisabled();
                        this.unWireEvents();
                    }
                    else {
                        this.element.disabled = false;
                        this.wireEvents();
                    }
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([label], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([label], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        label.classList.add(RTL$1);
                    }
                    else {
                        label.classList.remove(RTL$1);
                    }
                    break;
                case 'label':
                    this.setText(newProp.label);
                    break;
                case 'labelPosition':
                    if (newProp.labelPosition === 'Before') {
                        label.classList.add('e-right');
                    }
                    else {
                        label.classList.remove('e-right');
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
     * Initialize checked Property, Angular and React and Unique ID support.
     * @private
     */
    preRender() {
        if (isBlazor() && this.isServerRendered) {
            return;
        }
        let element = this.element;
        this.formElement = closest(this.element, 'form');
        this.tagName = this.element.tagName;
        element = wrapperInitialize(this.createElement, 'EJS-RADIOBUTTON', 'radio', element, WRAPPER$1, 'radio');
        this.element = element;
        if (this.element.getAttribute('type') !== 'radio') {
            this.element.setAttribute('type', 'radio');
        }
        if (!this.element.id) {
            this.element.id = getUniqueID('e-' + this.getModuleName());
        }
        if (this.tagName === 'EJS-RADIOBUTTON') {
            let formControlName = this.element.getAttribute('formcontrolname');
            if (formControlName) {
                this.setProperties({ 'name': formControlName }, true);
                this.element.setAttribute('name', formControlName);
            }
        }
    }
    /**
     * Initialize the control rendering
     * @private
     */
    render() {
        if (isBlazor() && this.isServerRendered) {
            if (isRippleEnabled) {
                let rippleSpan = this.element.parentElement.getElementsByClassName(RIPPLE$1)[0];
                rippleEffect(rippleSpan, { duration: 400, isCenterRipple: true });
            }
        }
        else {
            this.initialize();
        }
        if (!this.disabled) {
            this.wireEvents();
        }
        this.renderComplete();
    }
    setDisabled() {
        this.element.disabled = true;
    }
    setText(text) {
        let label = this.getLabel();
        let textLabel = label.getElementsByClassName(LABEL$1)[0];
        if (textLabel) {
            textLabel.textContent = text;
        }
        else {
            text = (this.enableHtmlSanitizer) ? SanitizeHtmlHelper.sanitize(text) : text;
            textLabel = this.createElement('span', { className: LABEL$1, innerHTML: text });
            label.appendChild(textLabel);
        }
        if (this.labelPosition === 'Before') {
            this.getLabel().classList.add('e-right');
        }
        else {
            this.getLabel().classList.remove('e-right');
        }
    }
    unWireEvents() {
        let label = this.getLabel();
        EventHandler.remove(this.element, 'change', this.changeHandler);
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        let rippleLabel = label.getElementsByClassName(LABEL$1)[0];
        if (rippleLabel) {
            EventHandler.remove(rippleLabel, 'mousedown', this.labelRippleHandler);
            EventHandler.remove(rippleLabel, 'mouseup', this.labelRippleHandler);
        }
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
    }
    wireEvents() {
        let label = this.getLabel();
        EventHandler.add(this.element, 'change', this.changeHandler, this);
        EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        let rippleLabel = label.getElementsByClassName(LABEL$1)[0];
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
     * @public
     */
    click() {
        this.element.click();
    }
    /**
     * Sets the focus to RadioButton
     * its native method
     * @public
     */
    focusIn() {
        this.element.focus();
    }
};
__decorate$2([
    Event()
], RadioButton.prototype, "change", void 0);
__decorate$2([
    Event()
], RadioButton.prototype, "created", void 0);
__decorate$2([
    Property(false)
], RadioButton.prototype, "checked", void 0);
__decorate$2([
    Property('')
], RadioButton.prototype, "cssClass", void 0);
__decorate$2([
    Property(false)
], RadioButton.prototype, "disabled", void 0);
__decorate$2([
    Property('')
], RadioButton.prototype, "label", void 0);
__decorate$2([
    Property('After')
], RadioButton.prototype, "labelPosition", void 0);
__decorate$2([
    Property('')
], RadioButton.prototype, "name", void 0);
__decorate$2([
    Property('')
], RadioButton.prototype, "value", void 0);
__decorate$2([
    Property(false)
], RadioButton.prototype, "enableHtmlSanitizer", void 0);
RadioButton = RadioButton_1 = __decorate$2([
    NotifyPropertyChanges
], RadioButton);

/**
 * RadioButton modules
 */

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const DISABLED$1 = 'e-switch-disabled';
const RIPPLE$2 = 'e-ripple-container';
const RIPPLE_CHECK = 'e-ripple-check';
const RTL$2 = 'e-rtl';
const WRAPPER$2 = 'e-switch-wrapper';
const ACTIVE = 'e-switch-active';
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
let Switch = class Switch extends Component {
    /**
     * Constructor for creating the widget.
     * @private
     */
    constructor(options, element) {
        super(options, element);
        this.isFocused = false;
        this.isDrag = false;
    }
    changeState(state) {
        let ariaState;
        let rippleSpan;
        let wrapper = this.getWrapper();
        let bar = wrapper.querySelector('.e-switch-inner');
        let handle = wrapper.querySelector('.e-switch-handle');
        if (isRippleEnabled) {
            rippleSpan = wrapper.getElementsByClassName(RIPPLE$2)[0];
        }
        if (state) {
            addClass([bar, handle], ACTIVE);
            ariaState = 'true';
            this.element.checked = true;
            this.checked = true;
            if (rippleSpan) {
                addClass([rippleSpan], [RIPPLE_CHECK]);
            }
        }
        else {
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
    clickHandler(evt) {
        this.isDrag = false;
        this.focusOutHandler();
        this.changeState(!this.checked);
        this.element.focus();
        let changeEventArgs = { checked: this.element.checked, event: evt };
        this.trigger('change', changeEventArgs);
    }
    /**
     * Destroys the Switch widget.
     * @returns void
     */
    destroy() {
        if (isBlazor() && this.isServerRendered) {
            if (!this.disabled) {
                this.unWireEvents();
            }
        }
        else {
            super.destroy();
            if (!this.disabled) {
                this.unWireEvents();
            }
            destroy(this, this.getWrapper(), this.tagName);
        }
    }
    focusHandler() {
        this.isFocused = true;
    }
    focusOutHandler() {
        this.getWrapper().classList.remove('e-focus');
    }
    /**
     * Gets the module name.
     * @private
     */
    getModuleName() {
        return 'switch';
    }
    /**
     * Gets the properties to be maintained in the persistence state.
     * @private
     */
    getPersistData() {
        return this.addOnPersist(['checked']);
    }
    getWrapper() {
        return this.element.parentElement;
    }
    initialize() {
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
    initWrapper() {
        let wrapper = this.element.parentElement;
        if (!wrapper.classList.contains(WRAPPER$2)) {
            wrapper = this.createElement('div', {
                className: WRAPPER$2, attrs: { 'role': 'switch', 'aria-checked': 'false' }
            });
            this.element.parentNode.insertBefore(wrapper, this.element);
        }
        let switchInner = this.createElement('span', { className: 'e-switch-inner' });
        let onLabel = this.createElement('span', { className: 'e-switch-on' });
        let offLabel = this.createElement('span', { className: 'e-switch-off' });
        let handle = this.createElement('span', { className: 'e-switch-handle' });
        wrapper.appendChild(this.element);
        setHiddenInput(this, wrapper);
        switchInner.appendChild(onLabel);
        switchInner.appendChild(offLabel);
        wrapper.appendChild(switchInner);
        wrapper.appendChild(handle);
        if (isRippleEnabled) {
            let rippleSpan = this.createElement('span', { className: RIPPLE$2 });
            handle.appendChild(rippleSpan);
            rippleEffect(rippleSpan, { duration: 400, isCenterRipple: true });
        }
        wrapper.classList.add('e-wrapper');
        if (this.enableRtl) {
            wrapper.classList.add(RTL$2);
        }
        if (this.cssClass) {
            addClass([wrapper], this.cssClass.split(' '));
        }
    }
    /**
     * Called internally if any of the property value changes.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        let wrapper = this.getWrapper();
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'checked':
                    this.changeState(newProp.checked);
                    break;
                case 'disabled':
                    if (newProp.disabled) {
                        this.setDisabled();
                        this.unWireEvents();
                    }
                    else {
                        this.element.disabled = false;
                        wrapper.classList.remove(DISABLED$1);
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
                        wrapper.classList.add(RTL$2);
                    }
                    else {
                        wrapper.classList.remove(RTL$2);
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
    preRender() {
        if (isBlazor() && this.isServerRendered) {
            return;
        }
        let element = this.element;
        this.formElement = closest(this.element, 'form');
        this.tagName = this.element.tagName;
        preRender(this, 'EJS-SWITCH', WRAPPER$2, element, this.getModuleName());
    }
    /**
     * Initialize control rendering.
     * @private
     */
    render() {
        if (isBlazor() && this.isServerRendered) {
            if (isRippleEnabled) {
                rippleEffect(this.element.parentElement, { duration: 400, isCenterRipple: true });
            }
        }
        else {
            this.initWrapper();
            this.initialize();
        }
        if (!this.disabled) {
            this.wireEvents();
        }
        this.renderComplete();
    }
    rippleHandler(e) {
        let rippleSpan = this.getWrapper().getElementsByClassName(RIPPLE$2)[0];
        rippleMouseHandler(e, rippleSpan);
        if (e.type === 'mousedown' && e.currentTarget.classList.contains('e-switch-wrapper') && e.which === 1) {
            this.isDrag = true;
            this.isFocused = false;
        }
    }
    rippleTouchHandler(eventType) {
        let rippleSpan = this.getWrapper().getElementsByClassName(RIPPLE$2)[0];
        if (rippleSpan) {
            let event = document.createEvent('MouseEvents');
            event.initEvent(eventType, false, true);
            rippleSpan.dispatchEvent(event);
        }
    }
    setDisabled() {
        let wrapper = this.getWrapper();
        this.element.disabled = true;
        wrapper.classList.add(DISABLED$1);
        wrapper.setAttribute('aria-disabled', 'true');
    }
    setLabel(onText, offText) {
        let wrapper = this.getWrapper();
        if (onText) {
            wrapper.querySelector('.e-switch-on').textContent = onText;
        }
        if (offText) {
            wrapper.querySelector('.e-switch-off').textContent = offText;
        }
    }
    switchFocusHandler() {
        if (this.isFocused) {
            this.getWrapper().classList.add('e-focus');
        }
    }
    switchMouseUp(e) {
        let target = e.target;
        let rippleSpan = this.getWrapper().getElementsByClassName(RIPPLE$2)[0];
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
    formResetHandler() {
        this.checked = this.initialSwitchCheckedValue;
        this.element.checked = this.initialSwitchCheckedValue;
    }
    /**
     * Toggle the Switch component state into checked/unchecked.
     * @returns void
     */
    toggle() {
        this.clickHandler();
    }
    wireEvents() {
        let wrapper = this.getWrapper();
        let handle = wrapper.querySelector('.e-switch-handle');
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
    unWireEvents() {
        let wrapper = this.getWrapper();
        let handle = wrapper.querySelector('.e-switch-handle');
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
    click() {
        this.element.click();
    }
    /**
     * Sets the focus to Switch
     * its native method
     * @public
     */
    focusIn() {
        this.element.focus();
    }
};
__decorate$3([
    Event()
], Switch.prototype, "change", void 0);
__decorate$3([
    Event()
], Switch.prototype, "created", void 0);
__decorate$3([
    Property(false)
], Switch.prototype, "checked", void 0);
__decorate$3([
    Property('')
], Switch.prototype, "cssClass", void 0);
__decorate$3([
    Property(false)
], Switch.prototype, "disabled", void 0);
__decorate$3([
    Property('')
], Switch.prototype, "name", void 0);
__decorate$3([
    Property('')
], Switch.prototype, "onLabel", void 0);
__decorate$3([
    Property('')
], Switch.prototype, "offLabel", void 0);
__decorate$3([
    Property('')
], Switch.prototype, "value", void 0);
Switch = __decorate$3([
    NotifyPropertyChanges
], Switch);

/**
 * Switch modules
 */

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const classNames = {
    chipSet: 'e-chip-set',
    chip: 'e-chip',
    avatar: 'e-chip-avatar',
    text: 'e-chip-text',
    icon: 'e-chip-icon',
    delete: 'e-chip-delete',
    deleteIcon: 'e-dlt-btn',
    multiSelection: 'e-multi-selection',
    singleSelection: 'e-selection',
    active: 'e-active',
    chipWrapper: 'e-chip-avatar-wrap',
    iconWrapper: 'e-chip-icon-wrap',
    focused: 'e-focused',
    disabled: 'e-disabled',
    rtl: 'e-rtl',
};
/**
 * A chip component is a small block of essential information, mostly used on contacts or filter tags.
 * ```html
 * <div id="chip"></div>
 * ```
 * ```typescript
 * <script>
 * var chipObj = new ChipList();
 * chipObj.appendTo("#chip");
 * </script>
 * ```
 */
let ChipList = class ChipList extends Component {
    constructor(options, element) {
        super(options, element);
        this.multiSelectedChip = [];
    }
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        //prerender
    }
    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */
    render() {
        this.type = this.chips.length ? 'chipset' : (this.text || this.element.innerText ? 'chip' : 'chipset');
        if (!isBlazor() || !this.isServerRendered) {
            this.setAttributes();
            this.createChip();
            this.setRtl();
            this.select(this.selectedChips);
        }
        this.wireEvent(false);
        this.rippleFunction = rippleEffect(this.element, {
            selector: '.e-chip'
        });
        this.renderComplete();
    }
    createChip() {
        this.innerText = this.element.innerText.trim();
        if (isBlazor()) {
            let childElement = this.element.querySelectorAll('.e-chip');
            for (let i = 0; i < childElement.length; i++) {
                if (childElement[i] != null) {
                    detach(childElement[i]);
                }
            }
        }
        else {
            this.element.innerHTML = '';
        }
        this.chipCreation(this.type === 'chip' ? [this.innerText ? this.innerText : this.text] : this.chips);
    }
    setAttributes() {
        if (this.type === 'chip') {
            this.element.tabIndex = 0;
            this.element.setAttribute('role', 'option');
        }
        else {
            this.element.classList.add(classNames.chipSet);
            this.element.setAttribute('role', 'listbox');
            if (this.selection === 'Multiple') {
                this.element.classList.add(classNames.multiSelection);
                this.element.setAttribute('aria-multiselectable', 'true');
            }
            else if (this.selection === 'Single') {
                this.element.classList.add(classNames.singleSelection);
                this.element.setAttribute('aria-multiselectable', 'false');
            }
            else {
                this.element.setAttribute('aria-multiselectable', 'false');
            }
        }
    }
    setRtl() {
        this.element.classList[this.enableRtl ? 'add' : 'remove'](classNames.rtl);
    }
    chipCreation(data) {
        let chipListArray = [];
        for (let i = 0; i < data.length; i++) {
            let fieldsData = this.getFieldValues(data[i]);
            let chipArray = this.elementCreation(fieldsData);
            let className = (classNames.chip + ' ' + (fieldsData.enabled ? ' ' : classNames.disabled) + ' ' +
                (fieldsData.avatarIconCss || fieldsData.avatarText ? classNames.chipWrapper : (fieldsData.leadingIconCss ?
                    classNames.iconWrapper : ' ')) + ' ' + fieldsData.cssClass).split(' ').filter((css) => css);
            if (this.type === 'chip') {
                chipListArray = chipArray;
                addClass([this.element], className);
                this.element.setAttribute('aria-label', fieldsData.text);
                if (fieldsData.value) {
                    this.element.setAttribute('data-value', fieldsData.value.toString());
                }
            }
            else {
                let wrapper = this.createElement('DIV', {
                    className: className.join(' '), attrs: {
                        tabIndex: '0', role: 'option',
                        'aria-label': fieldsData.text, 'aria-selected': 'false'
                    }
                });
                if (fieldsData.value) {
                    wrapper.setAttribute('data-value', fieldsData.value.toString());
                }
                append(chipArray, wrapper);
                chipListArray.push(wrapper);
            }
        }
        append(chipListArray, this.element);
    }
    getFieldValues(data) {
        let chipEnabled = !(this.enabled.toString() === 'false');
        let fields = {
            text: typeof data === 'object' ? (data.text ? data.text.toString() : this.text.toString()) :
                (this.type === 'chip' ? (this.innerText ? this.innerText : this.text.toString()) : data.toString()),
            cssClass: typeof data === 'object' ? (data.cssClass ? data.cssClass.toString() : this.cssClass.toString()) :
                (this.cssClass.toString()),
            leadingIconCss: typeof data === 'object' ? (data.leadingIconCss ? data.leadingIconCss.toString() :
                this.leadingIconCss.toString()) : (this.leadingIconCss.toString()),
            avatarIconCss: typeof data === 'object' ? (data.avatarIconCss ? data.avatarIconCss.toString() :
                this.avatarIconCss.toString()) : (this.avatarIconCss.toString()),
            avatarText: typeof data === 'object' ? (data.avatarText ? data.avatarText.toString() : this.avatarText.toString()) :
                (this.avatarText.toString()),
            trailingIconCss: typeof data === 'object' ? (data.trailingIconCss ? data.trailingIconCss.toString() :
                this.trailingIconCss.toString()) : (this.trailingIconCss.toString()),
            enabled: typeof data === 'object' ? (!isNullOrUndefined(data.enabled) ? (data.enabled.toString() === 'false' ? false : true) :
                chipEnabled) : (chipEnabled),
            value: typeof data === 'object' ? ((data.value ? data.value.toString() : null)) : null
        };
        return fields;
    }
    elementCreation(fields) {
        let chipArray = [];
        if (fields.avatarText || fields.avatarIconCss) {
            let className = (classNames.avatar + ' ' + fields.avatarIconCss).trim();
            let chipAvatarElement = this.createElement('span', { className: className });
            chipAvatarElement.innerText = fields.avatarText;
            chipArray.push(chipAvatarElement);
        }
        else if (fields.leadingIconCss) {
            let className = (classNames.icon + ' ' + fields.leadingIconCss).trim();
            let chipIconElement = this.createElement('span', { className: className });
            chipArray.push(chipIconElement);
        }
        let chipTextElement = this.createElement('span', { className: classNames.text });
        chipTextElement.innerText = fields.text;
        chipArray.push(chipTextElement);
        if (fields.trailingIconCss || (this.type !== 'chip' && this.enableDelete)) {
            let className = (classNames.delete + ' ' +
                (fields.trailingIconCss ? fields.trailingIconCss : classNames.deleteIcon)).trim();
            let chipdeleteElement = this.createElement('span', { className: className });
            chipArray.push(chipdeleteElement);
        }
        return chipArray;
    }
    /**
     * A function that finds chip based on given input.
     * @param  {number | HTMLElement } fields - We can pass index number or element of chip.
     */
    find(fields) {
        let chipData;
        let chipElement = fields instanceof HTMLElement ?
            fields : this.element.querySelectorAll('.' + classNames.chip)[fields];
        if (chipElement && this.type !== 'chip') {
            chipData = { text: undefined, index: undefined, element: undefined, data: undefined };
            chipData.index = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.chip)).indexOf(chipElement);
            chipData.text = typeof this.chips[chipData.index] === 'object' ?
                (this.chips[chipData.index].text ?
                    this.chips[chipData.index].text.toString() : '') :
                this.chips[chipData.index].toString();
            chipData.data = this.chips[chipData.index];
            chipData.element = chipElement;
        }
        return chipData;
    }
    /**
     * Allows adding the chip item(s) by passing a single or array of string, number, or ChipModel values.
     * @param  {string[] | number[] | ChipModel[] | string | number | ChipModel} chipsData - We can pass array of string or
     *  array of number or array of chip model or string data or number data or chip model.
     * @deprecated
     */
    add(chipsData) {
        if (this.type !== 'chip') {
            let fieldData = chipsData instanceof Array ?
                chipsData : [chipsData];
            this.chips.push(...fieldData);
            this.chipCreation(fieldData);
        }
    }
    /**
     * Allows selecting the chip item(s) by passing a single or array of string, number, or ChipModel values.
     * @param  {number | number[] | HTMLElement | HTMLElement[]} fields - We can pass number or array of number
     *  or chip element or array of chip element.
     */
    select(fields) {
        this.onSelect(fields, false);
    }
    multiSelection(newProp) {
        const items = this.element.querySelectorAll('.' + 'e-chip');
        for (let j = 0; j < newProp.length; j++) {
            if (typeof newProp[j] === 'string') {
                for (let k = 0; k < items.length; k++) {
                    if (newProp[j] !== k) {
                        if (newProp[j] === items[k].attributes[5].value) {
                            this.multiSelectedChip.push(k);
                            break;
                        }
                    }
                }
            }
            else {
                this.multiSelectedChip.push(newProp[j]);
            }
        }
    }
    onSelect(fields, callFromProperty) {
        if (this.type !== 'chip' && this.selection !== 'None') {
            if (callFromProperty) {
                let chipElements = this.element.querySelectorAll('.' + classNames.chip);
                for (let i = 0; i < chipElements.length; i++) {
                    chipElements[i].setAttribute('aria-selected', 'false');
                    chipElements[i].classList.remove(classNames.active);
                }
            }
            let fieldData = fields instanceof Array ? fields : [fields];
            for (let i = 0; i < fieldData.length; i++) {
                let chipElement = fieldData[i] instanceof HTMLElement ? fieldData[i]
                    : this.element.querySelectorAll('.' + classNames.chip)[fieldData[i]];
                if (chipElement instanceof HTMLElement) {
                    this.selectionHandler(chipElement);
                }
            }
        }
    }
    /**
     * Allows removing the chip item(s) by passing a single or array of string, number, or ChipModel values.
     * @param  {number | number[] | HTMLElement | HTMLElement[]} fields - We can pass number or array of number
     *  or chip element or array of chip element.
     */
    remove(fields) {
        if (this.type !== 'chip') {
            let fieldData = fields instanceof Array ? fields : [fields];
            let chipElements = [];
            let chipCollection = this.element.querySelectorAll('.' + classNames.chip);
            fieldData.forEach((data) => {
                let chipElement = data instanceof HTMLElement ? data
                    : chipCollection[data];
                if (chipElement instanceof HTMLElement) {
                    chipElements.push(chipElement);
                }
            });
            chipElements.forEach((element) => {
                let chips = this.element.querySelectorAll('.' + classNames.chip);
                let index = Array.prototype.slice.call(chips).indexOf(element);
                this.deleteHandler(element, index);
            });
        }
    }
    /**
     * Returns the selected chip(s) data.
     */
    getSelectedChips() {
        let selectedChips;
        if (this.type !== 'chip' && this.selection !== 'None') {
            let selectedItems = { texts: [], Indexes: [], data: [], elements: [] };
            const items = this.element.querySelectorAll('.' + classNames.active);
            for (let i = 0; i < items.length; i++) {
                const chip = items[i];
                selectedItems.elements.push(chip);
                let index = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.chip)).indexOf(chip);
                selectedItems.Indexes.push(index);
                selectedItems.data.push(this.chips[index]);
                let text = typeof this.chips[index] === 'object' ?
                    this.chips[index].text ? this.chips[index].text.toString()
                        : null : this.chips[index].toString();
                selectedItems.texts.push(text);
            }
            let selectedItem = {
                text: selectedItems.texts[0], index: selectedItems.Indexes[0],
                data: selectedItems.data[0], element: selectedItems.elements[0]
            };
            selectedChips = !isNullOrUndefined(selectedItem.index) ?
                (this.selection === 'Multiple' ? selectedItems : selectedItem) : undefined;
        }
        return selectedChips;
    }
    wireEvent(unWireEvent) {
        if (!unWireEvent) {
            EventHandler.add(this.element, 'click', this.clickHandler, this);
            EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
            EventHandler.add(this.element, 'keydown', this.keyHandler, this);
            EventHandler.add(this.element, 'keyup', this.keyHandler, this);
        }
        else {
            EventHandler.remove(this.element, 'click', this.clickHandler);
            EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
            EventHandler.remove(this.element, 'keydown', this.keyHandler);
            EventHandler.remove(this.element, 'keyup', this.keyHandler);
        }
    }
    keyHandler(e) {
        if (e.target.classList.contains(classNames.chip)) {
            if (e.type === 'keydown') {
                if (e.keyCode === 13) {
                    this.clickHandler(e);
                }
                else if (e.keyCode === 46 && this.enableDelete) {
                    this.clickHandler(e, true);
                }
            }
            else if (e.keyCode === 9) {
                this.focusInHandler(e.target);
            }
        }
    }
    focusInHandler(chipWrapper) {
        if (!chipWrapper.classList.contains(classNames.focused)) {
            chipWrapper.classList.add(classNames.focused);
        }
    }
    focusOutHandler(e) {
        let chipWrapper = closest(e.target, '.' + classNames.chip);
        let focusedElement = this.type === 'chip' ? (this.element.classList.contains(classNames.focused) ?
            this.element : null) : this.element.querySelector('.' + classNames.focused);
        if (chipWrapper && focusedElement) {
            focusedElement.classList.remove(classNames.focused);
        }
    }
    clickHandler(e, del = false) {
        let chipWrapper = closest(e.target, '.' + classNames.chip);
        if (chipWrapper) {
            let chipDataArgs;
            if (this.type !== 'chip') {
                chipDataArgs = this.find(chipWrapper);
            }
            else {
                let index = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.chip)).indexOf(chipWrapper);
                chipDataArgs = {
                    text: this.innerText ? this.innerText : this.text,
                    element: chipWrapper, data: this.text, index: index
                };
            }
            chipDataArgs.event = e;
            chipDataArgs.cancel = false;
            this.trigger('beforeClick', chipDataArgs, (observedArgs) => {
                if (!observedArgs.cancel) {
                    observedArgs.element = isBlazor() ? getElement(observedArgs.element) : observedArgs.element;
                    this.clickEventHandler(observedArgs.element, e, del);
                }
            });
        }
    }
    clickEventHandler(chipWrapper, e, del) {
        if (this.type !== 'chip') {
            let chipData = this.find(chipWrapper);
            chipData.event = e;
            let deleteElement = e.target.classList.contains(classNames.deleteIcon) ?
                e.target : (del ? chipWrapper.querySelector('.' + classNames.deleteIcon) : undefined);
            if (deleteElement && this.enableDelete) {
                chipData.cancel = false;
                let deletedItemArgs = chipData;
                this.trigger('delete', deletedItemArgs, (observedArgs) => {
                    if (!observedArgs.cancel) {
                        observedArgs.element = isBlazor() ? getElement(observedArgs.element) : observedArgs.element;
                        this.deleteHandler(observedArgs.element, observedArgs.index);
                    }
                });
            }
            else if (this.selection !== 'None') {
                this.selectionHandler(chipWrapper);
                chipData.selected = chipWrapper.classList.contains(classNames.active);
                let selectedItemArgs = chipData;
                this.trigger('click', selectedItemArgs);
            }
            else {
                this.focusInHandler(chipWrapper);
                let clickedItemArgs = chipData;
                this.trigger('click', clickedItemArgs);
            }
        }
        else {
            this.focusInHandler(chipWrapper);
            let clickedItemArgs = {
                text: this.innerText ? this.innerText : this.text,
                element: chipWrapper, data: this.text, event: e
            };
            this.trigger('click', clickedItemArgs);
        }
    }
    selectionHandler(chipWrapper) {
        if (this.selection === 'Single') {
            let activeElement = this.element.querySelector('.' + classNames.active);
            if (activeElement && activeElement !== chipWrapper) {
                activeElement.classList.remove(classNames.active);
                activeElement.setAttribute('aria-selected', 'false');
            }
            this.setProperties({ selectedChips: null }, true);
        }
        else {
            this.setProperties({ selectedChips: [] }, true);
        }
        if (chipWrapper.classList.contains(classNames.active)) {
            chipWrapper.classList.remove(classNames.active);
            chipWrapper.setAttribute('aria-selected', 'false');
        }
        else {
            chipWrapper.classList.add(classNames.active);
            chipWrapper.setAttribute('aria-selected', 'true');
        }
        this.updateSelectedChips();
    }
    updateSelectedChips() {
        let chipListEle = this.element.querySelectorAll('.e-chip');
        let chipCollIndex = [];
        let chipCollValue = [];
        let chip = null;
        let value;
        for (let i = 0; i < chipListEle.length; i++) {
            let selectedEle = this.element.querySelectorAll('.e-chip')[i];
            if (selectedEle.getAttribute('aria-selected') === 'true') {
                value = selectedEle.getAttribute('data-value');
                if (this.selection === 'Single' && selectedEle.classList.contains('e-active')) {
                    chip = value ? value : i;
                    break;
                }
                else {
                    value ? chipCollValue.push(value) : chipCollIndex.push(i);
                }
            }
        }
        this.setProperties({ selectedChips: this.selection === 'Single' ? chip : value ? chipCollValue : chipCollIndex }, true);
    }
    deleteHandler(chipWrapper, index) {
        this.allowServerDataBinding = true;
        this.chips.splice(index, 1);
        this.setProperties({ chips: this.chips }, true);
        this.serverDataBind();
        this.allowServerDataBinding = false;
        if (!(isBlazor() && this.isServerRendered)) {
            detach(chipWrapper);
        }
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also, it removes the attributes and classes.
     */
    destroy() {
        removeClass([this.element], [classNames.chipSet, classNames.chip, classNames.rtl,
            classNames.multiSelection, classNames.singleSelection, classNames.disabled, classNames.chipWrapper, classNames.iconWrapper,
            classNames.active, classNames.focused].concat(this.cssClass.toString().split(' ').filter((css) => css)));
        this.removeMultipleAttributes(['tabindex', 'role', 'aria-label', 'aria-multiselectable'], this.element);
        this.wireEvent(true);
        this.rippleFunction();
        if (isBlazor()) {
            let chipChildElement = this.element.querySelectorAll('.e-chip');
            for (let i = 0; i < chipChildElement.length; i++) {
                if (chipChildElement[i] != null) {
                    detach(chipChildElement[i]);
                }
            }
        }
        else {
            super.destroy();
            this.element.innerHTML = '';
            this.element.innerText = this.innerText;
        }
    }
    removeMultipleAttributes(attributes$$1, element) {
        attributes$$1.forEach((attr) => {
            element.removeAttribute(attr);
        });
    }
    getPersistData() {
        return this.addOnPersist([]);
    }
    getModuleName() {
        return 'chip-list';
    }
    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'chips':
                case 'text':
                case 'avatarText':
                case 'avatarIconCss':
                case 'leadingIconCss':
                case 'trailingIconCss':
                case 'selection':
                case 'enableDelete':
                case 'enabled':
                    if (!(isBlazor() && this.isServerRendered)) {
                        this.isServerRendered = false;
                        this.refresh();
                        this.isServerRendered = true;
                    }
                    break;
                case 'cssClass':
                    if (!(isBlazor() && this.isServerRendered)) {
                        if (this.type === 'chip') {
                            removeClass([this.element], oldProp.cssClass.toString().split(' ').filter((css) => css));
                            addClass([this.element], newProp.cssClass.toString().split(' ').filter((css) => css));
                        }
                        else {
                            this.isServerRendered = false;
                            this.refresh();
                            this.isServerRendered = true;
                        }
                    }
                    break;
                case 'selectedChips':
                    removeClass(this.element.querySelectorAll('.e-active'), 'e-active');
                    if (this.selection === 'Multiple') {
                        this.multiSelectedChip = [];
                        this.multiSelection(newProp.selectedChips);
                        this.onSelect(this.multiSelectedChip, true);
                        this.updateSelectedChips();
                    }
                    else {
                        this.onSelect(newProp.selectedChips, true);
                    }
                    break;
                case 'enableRtl':
                    this.setRtl();
                    break;
            }
        }
    }
};
__decorate$4([
    Property([])
], ChipList.prototype, "chips", void 0);
__decorate$4([
    Property('')
], ChipList.prototype, "text", void 0);
__decorate$4([
    Property('')
], ChipList.prototype, "avatarText", void 0);
__decorate$4([
    Property('')
], ChipList.prototype, "avatarIconCss", void 0);
__decorate$4([
    Property('')
], ChipList.prototype, "leadingIconCss", void 0);
__decorate$4([
    Property('')
], ChipList.prototype, "trailingIconCss", void 0);
__decorate$4([
    Property('')
], ChipList.prototype, "cssClass", void 0);
__decorate$4([
    Property(true)
], ChipList.prototype, "enabled", void 0);
__decorate$4([
    Property([])
], ChipList.prototype, "selectedChips", void 0);
__decorate$4([
    Property('None')
], ChipList.prototype, "selection", void 0);
__decorate$4([
    Property(false)
], ChipList.prototype, "enableDelete", void 0);
__decorate$4([
    Event()
], ChipList.prototype, "created", void 0);
__decorate$4([
    Event()
], ChipList.prototype, "click", void 0);
__decorate$4([
    Event()
], ChipList.prototype, "beforeClick", void 0);
__decorate$4([
    Event()
], ChipList.prototype, "delete", void 0);
ChipList = __decorate$4([
    NotifyPropertyChanges
], ChipList);

/**
 * Represents ChipList `Chip` model class.
 */
class Chip {
}

/**
 * Chip modules
 */

/**
 * Button all modules
 */

export { wrapperInitialize, getTextNode, destroy, preRender, createCheckBox, rippleMouseHandler, setHiddenInput, buttonObserver, Button, CheckBox, RadioButton, Switch, classNames, ChipList, Chip };
//# sourceMappingURL=ej2-buttons.es2015.js.map
