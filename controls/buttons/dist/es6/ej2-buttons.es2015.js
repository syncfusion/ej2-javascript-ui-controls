import { Component, Event, EventHandler, NotifyPropertyChanges, Property, addClass, attributes, deleteObject, detach, getInstance, getUniqueID, getValue, isRippleEnabled, removeClass, rippleEffect, setValue } from '@syncfusion/ej2-base';

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
 * Common modules
 */

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
        this.initialize();
    }
    initialize() {
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
        if (this.isPrimary) {
            this.element.classList.add(cssClassName.PRIMARY);
        }
        if (this.content) {
            this.element.innerHTML = this.content;
        }
        this.setIconCss();
        if (this.enableRtl) {
            this.element.classList.add(cssClassName.RTL);
        }
        if (this.disabled) {
            this.controlStatus(this.disabled);
        }
        else {
            this.wireEvents();
        }
        this.removeRippleEffect = rippleEffect(this.element, { selector: '.' + cssClassName.BUTTON });
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
        this.unWireEvents();
        this.removeRippleEffect();
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
     * @param  {Button} newProp
     * @param  {Button} oldProp
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
                    this.unWireEvents();
                    break;
                case 'iconCss':
                    let span = this.element.querySelector('span.e-btn-icon');
                    if (span) {
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
                    this.element.innerHTML = newProp.content;
                    this.setIconCss();
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
        this.isKeyPressed = false;
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
        this.focusOutHandler();
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
    focusHandler() {
        if (this.isKeyPressed) {
            this.getWrapper().classList.add('e-focus');
        }
    }
    focusOutHandler() {
        this.getWrapper().classList.remove('e-focus');
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
    keyDownHandler() {
        this.isKeyPressed = true;
    }
    labelMouseHandler(e) {
        let rippleSpan = this.getWrapper().getElementsByClassName(RIPPLE)[0];
        rippleMouseHandler(e, rippleSpan);
    }
    mouseDownHandler() {
        this.isKeyPressed = false;
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
            }
        }
    }
    /**
     * Initialize Angular, React and Unique ID support.
     * @private
     */
    preRender() {
        let element = this.element;
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
    render() {
        this.initWrapper();
        this.initialize();
        if (!this.disabled) {
            this.wireEvents();
        }
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
    unWireEvents() {
        let wrapper = this.getWrapper();
        EventHandler.remove(this.element, 'click', this.clickHandler);
        EventHandler.remove(document, 'keydown', this.keyDownHandler);
        EventHandler.remove(wrapper, 'mousedown', this.mouseDownHandler);
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        let label = wrapper.getElementsByTagName('label')[0];
        EventHandler.remove(label, 'mousedown', this.labelMouseHandler);
        EventHandler.remove(label, 'mouseup', this.labelMouseHandler);
        if (this.tagName === 'EJS-CHECKBOX') {
            EventHandler.remove(this.element, 'change', this.changeHandler);
        }
    }
    wireEvents() {
        let wrapper = this.getWrapper();
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        EventHandler.add(document, 'keydown', this.keyDownHandler, this);
        EventHandler.add(wrapper, 'mousedown', this.mouseDownHandler, this);
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        let label = wrapper.getElementsByTagName('label')[0];
        EventHandler.add(label, 'mousedown', this.labelMouseHandler, this);
        EventHandler.add(label, 'mouseup', this.labelMouseHandler, this);
        if (this.tagName === 'EJS-CHECKBOX') {
            EventHandler.add(this.element, 'change', this.changeHandler, this);
        }
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
        this.isKeyPressed = false;
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
        let name = this.element.getAttribute('name');
        let radioGrp = document.querySelectorAll('input.e-radio[name="' + name + '"]');
        for (let i = 0; i < radioGrp.length; i++) {
            input = radioGrp[i];
            if (input !== this.element) {
                getInstance(input, RadioButton_1).checked = false;
            }
        }
    }
    /**
     * Destroys the widget.
     * @returns void
     */
    destroy() {
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
    focusHandler() {
        if (this.isKeyPressed) {
            this.getLabel().classList.add('e-focus');
        }
    }
    focusOutHandler() {
        this.getLabel().classList.remove('e-focus');
    }
    getModuleName() {
        return 'radio';
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
    keyDownHandler() {
        this.isKeyPressed = true;
    }
    labelRippleHandler(e) {
        let ripple = this.getLabel().getElementsByClassName(RIPPLE$1)[0];
        rippleMouseHandler(e, ripple);
    }
    mouseDownHandler() {
        this.isKeyPressed = false;
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
        let element = this.element;
        this.tagName = this.element.tagName;
        element = wrapperInitialize(this.createElement, 'EJS-RADIOBUTTON', 'radio', element, WRAPPER$1, 'radio');
        this.element = element;
        if (this.element.getAttribute('type') !== 'radio') {
            this.element.setAttribute('type', 'radio');
        }
        if (!this.element.id) {
            this.element.id = getUniqueID('e-' + this.getModuleName());
        }
    }
    /**
     * Initialize the control rendering
     * @private
     */
    render() {
        this.initialize();
        if (!this.disabled) {
            this.wireEvents();
        }
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
        EventHandler.remove(document, 'keydown', this.keyDownHandler);
        EventHandler.remove(label, 'mousedown', this.mouseDownHandler);
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        let rippleLabel = label.getElementsByClassName(LABEL$1)[0];
        if (rippleLabel) {
            EventHandler.remove(rippleLabel, 'mousedown', this.labelRippleHandler);
            EventHandler.remove(rippleLabel, 'mouseup', this.labelRippleHandler);
        }
    }
    wireEvents() {
        let label = this.getLabel();
        EventHandler.add(this.element, 'change', this.changeHandler, this);
        EventHandler.add(document, 'keydown', this.keyDownHandler, this);
        EventHandler.add(label, 'mousedown', this.mouseDownHandler, this);
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        let rippleLabel = label.getElementsByClassName(LABEL$1)[0];
        if (rippleLabel) {
            EventHandler.add(rippleLabel, 'mousedown', this.labelRippleHandler, this);
            EventHandler.add(rippleLabel, 'mouseup', this.labelRippleHandler, this);
        }
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
        this.isKeyPressed = false;
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
        super.destroy();
        if (!this.disabled) {
            this.unWireEvents();
        }
        destroy(this, this.getWrapper(), this.tagName);
    }
    focusHandler() {
        if (this.isKeyPressed) {
            this.getWrapper().classList.add('e-focus');
        }
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
        switchInner.appendChild(onLabel);
        switchInner.appendChild(offLabel);
        wrapper.appendChild(switchInner);
        wrapper.appendChild(handle);
        if (isRippleEnabled) {
            let rippleSpan = this.createElement('span', { className: RIPPLE$2 });
            handle.appendChild(rippleSpan);
            rippleEffect(rippleSpan, { duration: 400, isCenterRipple: true });
        }
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
        let element = this.element;
        this.tagName = this.element.tagName;
        preRender(this, 'EJS-SWITCH', WRAPPER$2, element, this.getModuleName());
    }
    /**
     * Initialize control rendering.
     * @private
     */
    render() {
        this.initWrapper();
        this.initialize();
        if (!this.disabled) {
            this.wireEvents();
        }
    }
    rippleHandler(e) {
        let rippleSpan = this.getWrapper().getElementsByClassName(RIPPLE$2)[0];
        rippleMouseHandler(e, rippleSpan);
        if (e.type === 'mousedown' && e.currentTarget.classList.contains('e-switch-wrapper') && e.which === 1) {
            this.isDrag = true;
            this.isKeyPressed = false;
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
        this.isKeyPressed = true;
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
        EventHandler.add(wrapper, 'click', this.clickHandler, this);
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        EventHandler.add(document, 'mouseup', this.switchMouseUp, this);
        EventHandler.add(document, 'keydown', this.switchFocusHandler, this);
        EventHandler.add(wrapper, 'mousedown mouseup', this.rippleHandler, this);
        EventHandler.add(wrapper, 'touchstart touchmove touchend', this.switchMouseUp, this);
    }
    unWireEvents() {
        let wrapper = this.getWrapper();
        let handle = wrapper.querySelector('.e-switch-handle');
        EventHandler.remove(wrapper, 'click', this.clickHandler);
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        EventHandler.remove(document, 'mouseup', this.switchMouseUp);
        EventHandler.remove(document, 'keydown', this.switchFocusHandler);
        EventHandler.remove(wrapper, 'mousedown mouseup', this.rippleHandler);
        EventHandler.remove(wrapper, 'touchstart touchmove touchend', this.switchMouseUp);
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

/**
 * Button all modules
 */

export { wrapperInitialize, getTextNode, destroy, preRender, createCheckBox, rippleMouseHandler, Button, CheckBox, RadioButton, Switch };
//# sourceMappingURL=ej2-buttons.es2015.js.map
