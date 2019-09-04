import { Ajax, Animation, Base, Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, addClass, append, attributes, classList, closest, compile, createElement, detach, extend, formatUnit, getInstance, getNumericObject, getUniqueID, getValue, isBlazor, isNullOrUndefined, merge, onIntlChange, remove, removeClass, resetBlazorTemplate, rippleEffect, select, selectAll, setStyleAttribute, setValue, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { Popup, Tooltip, createSpinner, getZindexPartial, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { SplitButton, getModel } from '@syncfusion/ej2-splitbuttons';

const CLASSNAMES = {
    RTL: 'e-rtl',
    DISABLE: 'e-disabled',
    INPUT: 'e-input',
    TEXTAREA: 'e-multi-line-input',
    INPUTGROUP: 'e-input-group',
    FLOATINPUT: 'e-float-input',
    FLOATLINE: 'e-float-line',
    FLOATTEXT: 'e-float-text',
    CLEARICON: 'e-clear-icon',
    CLEARICONHIDE: 'e-clear-icon-hide',
    LABELTOP: 'e-label-top',
    LABELBOTTOM: 'e-label-bottom',
    NOFLOATLABEL: 'e-no-float-label',
    INPUTCUSTOMTAG: 'e-input-custom-tag',
    FLOATCUSTOMTAG: 'e-float-custom-tag'
};
/**
 * Base for Input creation through util methods.
 */
var Input;
(function (Input) {
    let floatType;
    /**
     * Create a wrapper to input element with multiple span elements and set the basic properties to input based components.
     * ```
     * E.g : Input.createInput({ element: element, floatLabelType : "Auto", properties: { placeholder: 'Search' } });
     * ```
     * @param args
     */
    function createInput(args, internalCreateElement) {
        let makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        let inputObject = { container: null, buttons: [], clearButton: null };
        floatType = args.floatLabelType;
        if (isNullOrUndefined(args.floatLabelType) || args.floatLabelType === 'Never') {
            inputObject.container = createInputContainer(args, CLASSNAMES.INPUTGROUP, CLASSNAMES.INPUTCUSTOMTAG, 'span', makeElement);
            args.element.parentNode.insertBefore(inputObject.container, args.element);
            addClass([args.element], CLASSNAMES.INPUT);
            inputObject.container.appendChild(args.element);
        }
        else {
            createFloatingInput(args, inputObject, makeElement);
        }
        checkInputValue(args.floatLabelType, args.element);
        args.element.addEventListener('focus', function () {
            let parent = getParentNode(this);
            if (parent.classList.contains('e-input-group') || parent.classList.contains('e-outline')
                || parent.classList.contains('e-filled')) {
                parent.classList.add('e-input-focus');
            }
        });
        args.element.addEventListener('blur', function () {
            let parent = getParentNode(this);
            if (parent.classList.contains('e-input-group') || parent.classList.contains('e-outline')
                || parent.classList.contains('e-filled')) {
                parent.classList.remove('e-input-focus');
            }
        });
        args.element.addEventListener('input', () => {
            checkInputValue(floatType, args.element);
        });
        if (!isNullOrUndefined(args.properties) && !isNullOrUndefined(args.properties.showClearButton) &&
            args.properties.showClearButton && args.element.tagName !== 'TEXTAREA') {
            setClearButton(args.properties.showClearButton, args.element, inputObject, true, makeElement);
            inputObject.clearButton.setAttribute('role', 'button');
            if (inputObject.container.classList.contains(CLASSNAMES.FLOATINPUT)) {
                addClass([inputObject.container], CLASSNAMES.INPUTGROUP);
            }
        }
        if (!isNullOrUndefined(args.buttons) && args.element.tagName !== 'TEXTAREA') {
            for (let i = 0; i < args.buttons.length; i++) {
                inputObject.buttons.push(appendSpan(args.buttons[i], inputObject.container, makeElement));
            }
        }
        if (!isNullOrUndefined(args.element) && args.element.tagName === 'TEXTAREA') {
            addClass([inputObject.container], CLASSNAMES.TEXTAREA);
        }
        inputObject = setPropertyValue(args, inputObject);
        return inputObject;
    }
    Input.createInput = createInput;
    function checkInputValue(floatLabelType, inputElement) {
        let inputValue = inputElement.value;
        if (inputValue !== '' && !isNullOrUndefined(inputValue)) {
            inputElement.parentElement.classList.add('e-valid-input');
        }
        else if (floatLabelType !== 'Always') {
            inputElement.parentElement.classList.remove('e-valid-input');
        }
    }
    function _focusFn() {
        let label = getParentNode(this).getElementsByClassName('e-float-text')[0];
        addClass([label], CLASSNAMES.LABELTOP);
        if (label.classList.contains(CLASSNAMES.LABELBOTTOM)) {
            removeClass([label], CLASSNAMES.LABELBOTTOM);
        }
    }
    function _blurFn() {
        let parent = getParentNode(this);
        if ((parent.getElementsByTagName('textarea')[0]) ? parent.getElementsByTagName('textarea')[0].value === '' :
            parent.getElementsByTagName('input')[0].value === '') {
            let label = parent.getElementsByClassName('e-float-text')[0];
            if (label.classList.contains(CLASSNAMES.LABELTOP)) {
                removeClass([label], CLASSNAMES.LABELTOP);
            }
            addClass([label], CLASSNAMES.LABELBOTTOM);
        }
    }
    function wireFloatingEvents(element) {
        element.addEventListener('focus', _focusFn);
        element.addEventListener('blur', _blurFn);
    }
    function unwireFloatingEvents(element) {
        element.removeEventListener('focus', _focusFn);
        element.removeEventListener('blur', _blurFn);
    }
    function createFloatingInput(args, inputObject, internalCreateElement) {
        let makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        let floatLinelement;
        let floatLabelElement;
        if (args.floatLabelType === 'Auto') {
            wireFloatingEvents(args.element);
        }
        if (isNullOrUndefined(inputObject.container)) {
            inputObject.container = createInputContainer(args, CLASSNAMES.FLOATINPUT, CLASSNAMES.FLOATCUSTOMTAG, 'div', makeElement);
            args.element.parentNode.insertBefore(inputObject.container, args.element);
        }
        else {
            if (!isNullOrUndefined(args.customTag)) {
                inputObject.container.classList.add(CLASSNAMES.FLOATCUSTOMTAG);
            }
            inputObject.container.classList.add(CLASSNAMES.FLOATINPUT);
        }
        floatLinelement = makeElement('span', { className: CLASSNAMES.FLOATLINE });
        floatLabelElement = makeElement('label', { className: CLASSNAMES.FLOATTEXT });
        if (!isNullOrUndefined(args.element.id) && args.element.id !== '') {
            floatLabelElement.id = 'label_' + args.element.id.replace(/ /g, '_');
            attributes(args.element, { 'aria-labelledby': floatLabelElement.id });
        }
        if (!isNullOrUndefined(args.element.placeholder) && args.element.placeholder !== '') {
            floatLabelElement.innerHTML = args.element.placeholder;
            args.element.removeAttribute('placeholder');
        }
        if (!isNullOrUndefined(args.properties) && !isNullOrUndefined(args.properties.placeholder) &&
            args.properties.placeholder !== '') {
            floatLabelElement.innerHTML = args.properties.placeholder;
        }
        if (!floatLabelElement.innerHTML) {
            inputObject.container.classList.add(CLASSNAMES.NOFLOATLABEL);
        }
        inputObject.container.appendChild(args.element);
        inputObject.container.appendChild(floatLinelement);
        inputObject.container.appendChild(floatLabelElement);
        updateLabelState(args.element.value, floatLabelElement);
        if (args.floatLabelType === 'Always') {
            if (floatLabelElement.classList.contains(CLASSNAMES.LABELBOTTOM)) {
                removeClass([floatLabelElement], CLASSNAMES.LABELBOTTOM);
            }
            addClass([floatLabelElement], CLASSNAMES.LABELTOP);
        }
        if (args.floatLabelType === 'Auto') {
            args.element.addEventListener('input', (event) => {
                updateLabelState(args.element.value, floatLabelElement);
            });
            args.element.addEventListener('blur', (event) => {
                updateLabelState(args.element.value, floatLabelElement);
            });
        }
        if (!isNullOrUndefined(args.element.getAttribute('id'))) {
            floatLabelElement.setAttribute('for', args.element.getAttribute('id'));
        }
    }
    function checkFloatLabelType(type, container) {
        if (type === 'Always' && container.classList.contains('e-outline')) {
            container.classList.add('e-valid-input');
        }
    }
    function setPropertyValue(args, inputObject) {
        if (!isNullOrUndefined(args.properties)) {
            for (let prop of Object.keys(args.properties)) {
                switch (prop) {
                    case 'cssClass':
                        setCssClass(args.properties.cssClass, [inputObject.container]);
                        checkFloatLabelType(args.floatLabelType, inputObject.container);
                        break;
                    case 'enabled':
                        setEnabled(args.properties.enabled, args.element, args.floatLabelType, inputObject.container);
                        break;
                    case 'enableRtl':
                        setEnableRtl(args.properties.enableRtl, [inputObject.container]);
                        break;
                    case 'placeholder':
                        setPlaceholder(args.properties.placeholder, args.element);
                        break;
                    case 'readonly':
                        setReadonly(args.properties.readonly, args.element);
                        break;
                }
            }
        }
        return inputObject;
    }
    function updateIconState(value, button) {
        if (value) {
            removeClass([button], CLASSNAMES.CLEARICONHIDE);
        }
        else {
            addClass([button], CLASSNAMES.CLEARICONHIDE);
        }
    }
    function updateLabelState(value, label) {
        if (value) {
            addClass([label], CLASSNAMES.LABELTOP);
            if (label.classList.contains(CLASSNAMES.LABELBOTTOM)) {
                removeClass([label], CLASSNAMES.LABELBOTTOM);
            }
        }
        else {
            if (label.classList.contains(CLASSNAMES.LABELTOP)) {
                removeClass([label], CLASSNAMES.LABELTOP);
            }
            addClass([label], CLASSNAMES.LABELBOTTOM);
        }
    }
    function getParentNode(element) {
        let parentNode = element.parentNode;
        return parentNode;
    }
    /**
     * To create clear button.
     */
    function createClearButton(element, inputObject, initial, internalCreateElement) {
        let makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        let button = makeElement('span', { className: CLASSNAMES.CLEARICON });
        let container = inputObject.container;
        if (!isNullOrUndefined(initial)) {
            container.appendChild(button);
        }
        else {
            let baseElement = inputObject.container.classList.contains(CLASSNAMES.FLOATINPUT) ?
                inputObject.container.querySelector('.' + CLASSNAMES.FLOATTEXT) : element;
            baseElement.insertAdjacentElement('afterend', button);
        }
        if (!isNullOrUndefined(container) &&
            container.classList.contains(CLASSNAMES.FLOATINPUT)) {
            addClass([container], CLASSNAMES.INPUTGROUP);
        }
        addClass([button], CLASSNAMES.CLEARICONHIDE);
        wireClearBtnEvents(element, button, container);
        button.setAttribute('aria-label', 'close');
        return button;
    }
    function wireClearBtnEvents(element, button, container) {
        button.addEventListener('click', (event) => {
            if (!(element.classList.contains(CLASSNAMES.DISABLE) || element.readOnly)) {
                event.preventDefault();
                if (element !== document.activeElement) {
                    element.focus();
                }
                element.value = '';
                addClass([button], CLASSNAMES.CLEARICONHIDE);
            }
        });
        element.addEventListener('input', (event) => {
            updateIconState(element.value, button);
        });
        element.addEventListener('focus', (event) => {
            updateIconState(element.value, button);
        });
        element.addEventListener('blur', (event) => {
            setTimeout(() => { addClass([button], CLASSNAMES.CLEARICONHIDE); }, 200);
        });
    }
    function validateLabel(element, floatLabelType) {
        let parent = getParentNode(element);
        if (parent.classList.contains(CLASSNAMES.FLOATINPUT) && floatLabelType === 'Auto') {
            let label = getParentNode(element).getElementsByClassName('e-float-text')[0];
            updateLabelState(element.value, label);
        }
    }
    /**
     * To create input box contianer.
     */
    function createInputContainer(args, className, tagClass, tag, internalCreateElement) {
        let makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        let container;
        if (!isNullOrUndefined(args.customTag)) {
            container = makeElement(args.customTag, { className: className });
            container.classList.add(tagClass);
        }
        else {
            container = makeElement(tag, { className: className });
        }
        container.classList.add('e-control-wrapper');
        return container;
    }
    function encodePlaceHolder(placeholder) {
        let result = '';
        if (!isNullOrUndefined(placeholder) && placeholder !== '') {
            let spanEle = document.createElement('span');
            spanEle.innerHTML = placeholder;
            result = spanEle.innerHTML;
        }
        return result;
    }
    /**
     * Sets the value to the input element.
     * ```
     * E.g : Input.setValue('content', element, "Auto", true );
     * ```
     * @param value - Specify the value of the input element.
     * @param element - The element on which the specified value is updated.
     * @param floatLabelType - Specify the float label type of the input element.
     * @param clearButton - Boolean value to specify whether the clear icon is enabled / disabled on the input.
     */
    function setValue$$1(value, element, floatLabelType, clearButton) {
        element.value = value;
        if ((!isNullOrUndefined(floatLabelType)) && floatLabelType === 'Auto') {
            validateLabel(element, floatLabelType);
        }
        if (!isNullOrUndefined(clearButton) && clearButton) {
            let parentElement = getParentNode(element);
            if (!isNullOrUndefined(parentElement)) {
                let button = parentElement.getElementsByClassName(CLASSNAMES.CLEARICON)[0];
                if (element.value && parentElement.classList.contains('e-input-focus')) {
                    removeClass([button], CLASSNAMES.CLEARICONHIDE);
                }
                else {
                    addClass([button], CLASSNAMES.CLEARICONHIDE);
                }
            }
        }
        checkInputValue(floatLabelType, element);
    }
    Input.setValue = setValue$$1;
    /**
     * Sets the single or multiple cssClass to wrapper of input element.
     * ```
     * E.g : Input.setCssClass('e-custom-class', [element]);
     * ```
     * @param cssClass - Css class names which are needed to add.
     * @param elements - The elements which are needed to add / remove classes.
     * @param oldClass - Css class names which are needed to remove. If old classes are need to remove, can give this optional parameter.
     */
    function setCssClass(cssClass, elements, oldClass) {
        if (!isNullOrUndefined(oldClass) && oldClass !== '') {
            removeClass(elements, oldClass.split(' '));
        }
        if (!isNullOrUndefined(cssClass) && cssClass !== '') {
            addClass(elements, cssClass.split(' '));
        }
    }
    Input.setCssClass = setCssClass;
    /**
     * Set the placeholder attribute to the input element.
     * ```
     * E.g : Input.setPlaceholder('Search here', element);
     * ```
     * @param placeholder - Placeholder value which is need to add.
     * @param element - The element on which the placeholder is need to add.
     */
    function setPlaceholder(placeholder, element) {
        let parentElement;
        placeholder = encodePlaceHolder(placeholder);
        parentElement = getParentNode(element);
        if (parentElement.classList.contains(CLASSNAMES.FLOATINPUT)) {
            if (!isNullOrUndefined(placeholder) && placeholder !== '') {
                parentElement.getElementsByClassName(CLASSNAMES.FLOATTEXT)[0].textContent = placeholder;
                parentElement.classList.remove(CLASSNAMES.NOFLOATLABEL);
                element.removeAttribute('placeholder');
            }
            else {
                parentElement.classList.add(CLASSNAMES.NOFLOATLABEL);
                parentElement.getElementsByClassName(CLASSNAMES.FLOATTEXT)[0].textContent = '';
            }
        }
        else {
            if (!isNullOrUndefined(placeholder) && placeholder !== '') {
                attributes(element, { 'placeholder': placeholder, 'aria-placeholder': placeholder });
            }
            else {
                element.removeAttribute('placeholder');
                element.removeAttribute('aria-placeholder');
            }
        }
    }
    Input.setPlaceholder = setPlaceholder;
    /**
     * Set the read only attribute to the input element
     * ```
     * E.g : Input.setReadonly(true, element);
     * ```
     * @param isReadonly
     * - Boolean value to specify whether to set read only. Setting "True" value enables read only.
     * @param element
     * - The element which is need to enable read only.
     */
    function setReadonly(isReadonly, element, floatLabelType) {
        if (isReadonly) {
            attributes(element, { readonly: '' });
        }
        else {
            element.removeAttribute('readonly');
        }
        if (!isNullOrUndefined(floatLabelType)) {
            validateLabel(element, floatLabelType);
        }
    }
    Input.setReadonly = setReadonly;
    /**
     * Displays the element direction from right to left when its enabled.
     * ```
     * E.g : Input.setEnableRtl(true, [inputObj.container]);
     * ```
     * @param isRtl
     * - Boolean value to specify whether to set RTL. Setting "True" value enables the RTL mode.
     * @param elements
     * - The elements that are needed to enable/disable RTL.
     */
    function setEnableRtl(isRtl, elements) {
        if (isRtl) {
            addClass(elements, CLASSNAMES.RTL);
        }
        else {
            removeClass(elements, CLASSNAMES.RTL);
        }
    }
    Input.setEnableRtl = setEnableRtl;
    /**
     * Enables or disables the given input element.
     * ```
     * E.g : Input.setEnabled(false, element);
     * ```
     * @param isEnable
     * - Boolean value to specify whether to enable or disable.
     * @param element
     * - Element to be enabled or disabled.
     */
    function setEnabled(isEnable, element, floatLabelType, inputContainer) {
        let disabledAttrs = { 'disabled': 'disabled', 'aria-disabled': 'true' };
        let considerWrapper = isNullOrUndefined(inputContainer) ? false : true;
        if (isEnable) {
            element.classList.remove(CLASSNAMES.DISABLE);
            removeAttributes(disabledAttrs, element);
            if (considerWrapper) {
                removeClass([inputContainer], CLASSNAMES.DISABLE);
            }
        }
        else {
            element.classList.add(CLASSNAMES.DISABLE);
            addAttributes(disabledAttrs, element);
            if (considerWrapper) {
                addClass([inputContainer], CLASSNAMES.DISABLE);
            }
        }
        if (!isNullOrUndefined(floatLabelType)) {
            validateLabel(element, floatLabelType);
        }
    }
    Input.setEnabled = setEnabled;
    function setClearButton(isClear, element, inputObject, initial, internalCreateElement) {
        let makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        if (isClear) {
            inputObject.clearButton = createClearButton(element, inputObject, initial, makeElement);
        }
        else {
            inputObject.clearButton.remove();
            inputObject.clearButton = null;
        }
    }
    Input.setClearButton = setClearButton;
    /**
     * Removing the multiple attributes from the given element such as "disabled","id" , etc.
     * ```
     * E.g : Input.removeAttributes({ 'disabled': 'disabled', 'aria-disabled': 'true' }, element);
     * ```
     * @param attrs
     *  - Array of attributes which are need to removed from the element.
     * @param element
     *  - Element on which the attributes are needed to be removed.
     */
    function removeAttributes(attrs, element) {
        for (let key of Object.keys(attrs)) {
            let parentElement;
            parentElement = getParentNode(element);
            if (key === 'disabled') {
                element.classList.remove(CLASSNAMES.DISABLE);
            }
            if (key === 'disabled' && parentElement.classList.contains(CLASSNAMES.INPUTGROUP)) {
                parentElement.classList.remove(CLASSNAMES.DISABLE);
            }
            if (key === 'placeholder' && parentElement.classList.contains(CLASSNAMES.FLOATINPUT)) {
                parentElement.getElementsByClassName(CLASSNAMES.FLOATTEXT)[0].textContent = '';
            }
            else {
                element.removeAttribute(key);
            }
        }
    }
    Input.removeAttributes = removeAttributes;
    /**
     * Adding the multiple attributes to the given element such as "disabled","id" , etc.
     * ```
     * E.g : Input.addAttributes({ 'id': 'inputpopup' }, element);
     * ```
     * @param attrs
     * - Array of attributes which is added to element.
     * @param element
     * - Element on which the attributes are needed to be added.
     */
    function addAttributes(attrs, element) {
        for (let key of Object.keys(attrs)) {
            let parentElement;
            parentElement = getParentNode(element);
            if (key === 'disabled') {
                element.classList.add(CLASSNAMES.DISABLE);
            }
            if (key === 'disabled' && parentElement.classList.contains(CLASSNAMES.INPUTGROUP)) {
                parentElement.classList.add(CLASSNAMES.DISABLE);
            }
            if (key === 'placeholder' && parentElement.classList.contains(CLASSNAMES.FLOATINPUT)) {
                parentElement.getElementsByClassName(CLASSNAMES.FLOATTEXT)[0].textContent = attrs[key];
            }
            else {
                element.setAttribute(key, attrs[key]);
            }
        }
    }
    Input.addAttributes = addAttributes;
    function removeFloating(input) {
        let container = input.container;
        if (!isNullOrUndefined(container) && container.classList.contains(CLASSNAMES.FLOATINPUT)) {
            let inputEle = container.querySelector('textarea') ? container.querySelector('textarea') :
                container.querySelector('input');
            let placeholder = container.querySelector('.' + CLASSNAMES.FLOATTEXT).textContent;
            let clearButton = container.querySelector('.e-clear-icon') !== null;
            detach(container.querySelector('.' + CLASSNAMES.FLOATLINE));
            detach(container.querySelector('.' + CLASSNAMES.FLOATTEXT));
            classList(container, [CLASSNAMES.INPUTGROUP], [CLASSNAMES.FLOATINPUT]);
            unwireFloatingEvents(inputEle);
            attributes(inputEle, { 'placeholder': placeholder });
            inputEle.classList.add(CLASSNAMES.INPUT);
            if (!clearButton && inputEle.tagName === 'INPUT') {
                inputEle.removeAttribute('required');
            }
        }
    }
    Input.removeFloating = removeFloating;
    function addFloating(input, type, placeholder, internalCreateElement) {
        let makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        let container = closest(input, '.' + CLASSNAMES.INPUTGROUP);
        floatType = type;
        if (type !== 'Never') {
            let customTag = container.tagName;
            customTag = customTag !== 'DIV' && customTag !== 'SPAN' ? customTag : null;
            let args = { element: input, floatLabelType: type, customTag: customTag, properties: { placeholder: placeholder } };
            let iconEle = container.querySelector('.e-clear-icon');
            let inputObj = { container: container };
            input.classList.remove(CLASSNAMES.INPUT);
            createFloatingInput(args, inputObj, makeElement);
            if (isNullOrUndefined(iconEle)) {
                iconEle = container.querySelector('.e-input-group-icon');
            }
            if (isNullOrUndefined(iconEle)) {
                container.classList.remove(CLASSNAMES.INPUTGROUP);
            }
            else {
                let floatLine = container.querySelector('.' + CLASSNAMES.FLOATLINE);
                let floatText = container.querySelector('.' + CLASSNAMES.FLOATTEXT);
                container.insertBefore(input, iconEle);
                container.insertBefore(floatLine, iconEle);
                container.insertBefore(floatText, iconEle);
            }
        }
        checkFloatLabelType(type, input.parentElement);
    }
    Input.addFloating = addFloating;
    /**
     * Enable or Disable the ripple effect on the icons inside the Input. Ripple effect is only applicable for material theme.
     * ```
     * E.g : Input.setRipple(true, [inputObjects]);
     * ```
     * @param isRipple
     * - Boolean value to specify whether to enable the ripple effect.
     * @param inputObject
     * - Specify the collection of input objects.
     */
    function setRipple(isRipple, inputObj) {
        for (let i = 0; i < inputObj.length; i++) {
            _internalRipple(isRipple, inputObj[i].container);
        }
    }
    Input.setRipple = setRipple;
    function _internalRipple(isRipple, container, button) {
        let argsButton = [];
        argsButton.push(button);
        let buttons = isNullOrUndefined(button) ?
            container.querySelectorAll('.e-input-group-icon') : argsButton;
        if (isRipple && buttons.length > 0) {
            for (let index = 0; index < buttons.length; index++) {
                buttons[index].addEventListener('mousedown', _onMouseDownRipple, false);
                buttons[index].addEventListener('mouseup', _onMouseUpRipple, false);
            }
        }
        else if (buttons.length > 0) {
            for (let index = 0; index < buttons.length; index++) {
                buttons[index].removeEventListener('mousedown', _onMouseDownRipple, this);
                buttons[index].removeEventListener('mouseup', _onMouseUpRipple, this);
            }
        }
    }
    function _onMouseRipple(container, button) {
        if (!container.classList.contains('e-disabled') && !container.querySelector('input').readOnly) {
            button.classList.add('e-input-btn-ripple');
        }
    }
    function _onMouseDownRipple() {
        let ele = this;
        let parentEle = this.parentElement;
        while (!parentEle.classList.contains('e-input-group')) {
            parentEle = parentEle.parentElement;
        }
        _onMouseRipple(parentEle, ele);
    }
    function _onMouseUpRipple() {
        let ele = this;
        setTimeout(() => { ele.classList.remove('e-input-btn-ripple'); }, 500);
    }
    /**
     * Creates a new span element with the given icons added and append it in container element.
     * ```
     * E.g : Input.appendSpan('e-icon-spin', inputObj.container);
     * ```
     * @param iconClass - Icon classes which are need to add to the span element which is going to created.
     * Span element acts as icon or button element for input.
     * @param container - The container on which created span element is going to append.
     */
    function appendSpan(iconClass, container, internalCreateElement) {
        let makeElement = !isNullOrUndefined(internalCreateElement) ? internalCreateElement : createElement;
        let button = makeElement('span', { className: iconClass });
        button.classList.add('e-input-group-icon');
        container.appendChild(button);
        if (!container.classList.contains(CLASSNAMES.INPUTGROUP)) {
            container.classList.add(CLASSNAMES.INPUTGROUP);
        }
        _internalRipple(true, container, button);
        return button;
    }
    Input.appendSpan = appendSpan;
})(Input || (Input = {}));

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const ROOT = 'e-control-wrapper e-numeric';
const SPINICON = 'e-input-group-icon';
const SPINUP = 'e-spin-up';
const SPINDOWN = 'e-spin-down';
const ERROR = 'e-error';
const INCREMENT = 'increment';
const DECREMENT = 'decrement';
const INTREGEXP = new RegExp('^(-)?(\\d*)$');
const DECIMALSEPARATOR = '.';
const COMPONENT = 'e-numerictextbox';
const CONTROL = 'e-control';
const NUMERIC_FOCUS = 'e-input-focus';
const wrapperAttributes = ['title', 'style', 'class'];
/**
 * Represents the NumericTextBox component that allows the user to enter only numeric values.
 * ```html
 * <input type='text' id="numeric"/>
 * ```
 * ```typescript
 * <script>
 *   var numericObj = new NumericTextBox({ value: 10 });
 *   numericObj.appendTo("#numeric");
 * </script>
 * ```
 */
let NumericTextBox = class NumericTextBox extends Component {
    constructor(options, element) {
        super(options, element);
        this.numericOptions = options;
    }
    preRender() {
        this.isPrevFocused = false;
        this.decimalSeparator = '.';
        this.intRegExp = new RegExp('/^(-)?(\d*)$/');
        this.isCalled = false;
        let ejInstance = getValue('ej2_instances', this.element);
        this.cloneElement = this.element.cloneNode(true);
        removeClass([this.cloneElement], [CONTROL, COMPONENT, 'e-lib']);
        this.angularTagName = null;
        this.formEle = closest(this.element, 'form');
        if (this.element.tagName === 'EJS-NUMERICTEXTBOX') {
            this.angularTagName = this.element.tagName;
            let input = this.createElement('input');
            let index = 0;
            for (index; index < this.element.attributes.length; index++) {
                let attributeName = this.element.attributes[index].nodeName;
                if (attributeName !== 'id') {
                    input.setAttribute(this.element.attributes[index].nodeName, this.element.attributes[index].nodeValue);
                    input.innerHTML = this.element.innerHTML;
                }
            }
            if (this.element.hasAttribute('name')) {
                this.element.removeAttribute('name');
            }
            this.element.classList.remove('e-control', 'e-numerictextbox');
            this.element.appendChild(input);
            this.element = input;
            setValue('ej2_instances', ejInstance, this.element);
        }
        attributes(this.element, { 'role': 'spinbutton', 'tabindex': '0', 'autocomplete': 'off', 'aria-live': 'assertive' });
        let localeText = { incrementTitle: 'Increment value', decrementTitle: 'Decrement value', placeholder: this.placeholder };
        this.l10n = new L10n('numerictextbox', localeText, this.locale);
        if (this.l10n.getConstant('placeholder') !== '') {
            this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        }
        this.isValidState = true;
        this.inputStyle = null;
        this.inputName = null;
        this.cultureInfo = {};
        this.initCultureInfo();
        this.initCultureFunc();
        this.updateHTMLAttrToElement();
        this.checkAttributes(false);
        this.prevValue = this.value;
        if (this.formEle) {
            this.inputEleValue = this.value;
        }
        this.validateMinMax();
        this.validateStep();
        if (this.placeholder === null) {
            this.updatePlaceholder();
        }
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    render() {
        if (this.element.tagName.toLowerCase() === 'input') {
            this.createWrapper();
            if (this.showSpinButton) {
                this.spinBtnCreation();
            }
            if (!isNullOrUndefined(this.width)) {
                setStyleAttribute(this.container, { 'width': formatUnit(this.width) });
            }
            if (!this.container.classList.contains('e-input-group')) {
                this.container.classList.add('e-input-group');
            }
            this.changeValue(this.value === null || isNaN(this.value) ? null : this.strictMode ? this.trimValue(this.value) : this.value);
            this.wireEvents();
            if (this.value !== null && !isNaN(this.value)) {
                if (this.decimals) {
                    this.setProperties({ value: this.roundNumber(this.value, this.decimals) }, true);
                }
            }
            if (this.element.getAttribute('value') || this.value) {
                this.element.setAttribute('value', this.element.value);
            }
            this.renderComplete();
        }
    }
    checkAttributes(isDynamic) {
        let attributes$$1 = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['value', 'min', 'max', 'step', 'disabled', 'readonly', 'style', 'name', 'placeholder'];
        for (let prop of attributes$$1) {
            if (!isNullOrUndefined(this.element.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.numericOptions) || (this.numericOptions['enabled'] === undefined)) || isDynamic) {
                            let enabled = this.element.getAttribute(prop) === 'disabled' || this.element.getAttribute(prop) === ''
                                || this.element.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, !isDynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.numericOptions) || (this.numericOptions['readonly'] === undefined)) || isDynamic) {
                            let readonly = this.element.getAttribute(prop) === 'readonly' || this.element.getAttribute(prop) === ''
                                || this.element.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !isDynamic);
                        }
                        break;
                    case 'placeholder':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.numericOptions) || (this.numericOptions['placeholder'] === undefined)) || isDynamic) {
                            this.setProperties({ placeholder: this.element.placeholder }, !isDynamic);
                        }
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.numericOptions) || (this.numericOptions['value'] === undefined)) || isDynamic) {
                            let setNumber = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            this.setProperties(setValue(prop, setNumber, {}), !isDynamic);
                        }
                        break;
                    case 'min':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.numericOptions) || (this.numericOptions['min'] === undefined)) || isDynamic) {
                            let minValue = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            if (minValue !== null && !isNaN(minValue)) {
                                this.setProperties(setValue(prop, minValue, {}), !isDynamic);
                            }
                        }
                        break;
                    case 'max':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.numericOptions) || (this.numericOptions['max'] === undefined)) || isDynamic) {
                            let maxValue = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            if (maxValue !== null && !isNaN(maxValue)) {
                                this.setProperties(setValue(prop, maxValue, {}), !isDynamic);
                            }
                        }
                        break;
                    case 'step':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.numericOptions) || (this.numericOptions['step'] === undefined)) || isDynamic) {
                            let stepValue = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                            if (stepValue !== null && !isNaN(stepValue)) {
                                this.setProperties(setValue(prop, stepValue, {}), !isDynamic);
                            }
                        }
                        break;
                    case 'style':
                        this.inputStyle = this.element.getAttribute(prop);
                        break;
                    case 'name':
                        this.inputName = this.element.getAttribute(prop);
                        break;
                    default:
                        let value = this.instance.getNumberParser({ format: 'n' })(this.element.getAttribute(prop));
                        if ((value !== null && !isNaN(value)) || (prop === 'value')) {
                            this.setProperties(setValue(prop, value, {}), true);
                        }
                        break;
                }
            }
        }
    }
    updatePlaceholder() {
        this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
    }
    initCultureFunc() {
        this.instance = new Internationalization(this.locale);
    }
    initCultureInfo() {
        this.cultureInfo.format = this.format;
        if (getValue('currency', this) !== null) {
            setValue('currency', this.currency, this.cultureInfo);
            this.setProperties({ currencyCode: this.currency }, true);
        }
    }
    /* Wrapper creation */
    createWrapper() {
        let inputObj = Input.createInput({
            element: this.element,
            floatLabelType: this.floatLabelType,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: this.cssClass,
                enableRtl: this.enableRtl,
                showClearButton: this.showClearButton,
                enabled: this.enabled
            }
        }, this.createElement);
        this.inputWrapper = inputObj;
        this.container = inputObj.container;
        this.container.setAttribute('class', ROOT + ' ' + this.container.getAttribute('class'));
        this.updateHTMLAttrToWrapper();
        if (this.readonly) {
            attributes(this.element, { 'aria-readonly': 'true' });
        }
        this.hiddenInput = (this.createElement('input', { attrs: { type: 'hidden', 'validateHidden': 'true' } }));
        this.inputName = this.inputName !== null ? this.inputName : this.element.id;
        this.element.removeAttribute('name');
        attributes(this.hiddenInput, { 'name': this.inputName });
        this.container.insertBefore(this.hiddenInput, this.container.childNodes[1]);
        if (this.inputStyle !== null) {
            attributes(this.container, { 'style': this.inputStyle });
        }
    }
    updateHTMLAttrToElement() {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (let pro of Object.keys(this.htmlAttributes)) {
                if (wrapperAttributes.indexOf(pro) < 0) {
                    this.element.setAttribute(pro, this.htmlAttributes[pro]);
                }
            }
        }
    }
    updateHTMLAttrToWrapper() {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (let pro of Object.keys(this.htmlAttributes)) {
                if (wrapperAttributes.indexOf(pro) > -1) {
                    if (pro === 'class') {
                        addClass([this.container], this.htmlAttributes[pro].split(' '));
                    }
                    else if (pro === 'style') {
                        let numericStyle = this.container.getAttribute(pro);
                        numericStyle = !isNullOrUndefined(numericStyle) ? (numericStyle + this.htmlAttributes[pro]) :
                            this.htmlAttributes[pro];
                        this.container.setAttribute(pro, numericStyle);
                    }
                    else {
                        this.container.setAttribute(pro, this.htmlAttributes[pro]);
                    }
                }
            }
        }
    }
    /* Spinner creation */
    spinBtnCreation() {
        this.spinDown = Input.appendSpan(SPINICON + ' ' + SPINDOWN, this.container, this.createElement);
        attributes(this.spinDown, {
            'title': this.l10n.getConstant('decrementTitle'),
            'aria-label': this.l10n.getConstant('decrementTitle')
        });
        this.spinUp = Input.appendSpan(SPINICON + ' ' + SPINUP, this.container, this.createElement);
        attributes(this.spinUp, {
            'title': this.l10n.getConstant('incrementTitle'),
            'aria-label': this.l10n.getConstant('incrementTitle')
        });
        this.wireSpinBtnEvents();
    }
    validateMinMax() {
        if (!(typeof (this.min) === 'number' && !isNaN(this.min))) {
            this.setProperties({ min: -(Number.MAX_VALUE) }, true);
        }
        if (!(typeof (this.max) === 'number' && !isNaN(this.max))) {
            this.setProperties({ max: Number.MAX_VALUE }, true);
        }
        if (this.decimals !== null) {
            if (this.min !== -(Number.MAX_VALUE)) {
                this.setProperties({ min: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.min)) }, true);
            }
            if (this.max !== (Number.MAX_VALUE)) {
                this.setProperties({ max: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.max)) }, true);
            }
        }
        this.setProperties({ min: this.min > this.max ? this.max : this.min }, true);
        attributes(this.element, { 'aria-valuemin': this.min.toString(), 'aria-valuemax': this.max.toString() });
    }
    formattedValue(decimals, value) {
        return this.instance.getNumberFormat({
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals, useGrouping: false
        })(value);
    }
    validateStep() {
        if (this.decimals !== null) {
            this.setProperties({ step: this.instance.getNumberParser({ format: 'n' })(this.formattedValue(this.decimals, this.step)) }, true);
        }
    }
    action(operation, event) {
        this.isInteract = true;
        let value = this.isFocused ? this.instance.getNumberParser({ format: 'n' })(this.element.value) : this.value;
        this.changeValue(this.performAction(value, this.step, operation));
        this.raiseChangeEvent(event);
    }
    checkErrorClass() {
        if (this.isValidState) {
            removeClass([this.container], ERROR);
        }
        else {
            addClass([this.container], ERROR);
        }
        attributes(this.element, { 'aria-invalid': this.isValidState ? 'false' : 'true' });
    }
    bindClearEvent() {
        if (this.showClearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
    }
    resetHandler(e) {
        e.preventDefault();
        if (!(this.inputWrapper.clearButton.classList.contains('e-clear-icon-hide'))) {
            this.clear(e);
        }
        this.isInteract = true;
        this.raiseChangeEvent(e);
    }
    clear(event) {
        this.setProperties({ value: null }, true);
        this.setElementValue('');
    }
    resetFormHandler() {
        if (this.element.tagName === 'EJS-NUMERICTEXTBOX') {
            this.updateValue(null);
        }
        else {
            this.updateValue(this.inputEleValue);
        }
    }
    setSpinButton() {
        if (!isNullOrUndefined(this.spinDown)) {
            attributes(this.spinDown, {
                'title': this.l10n.getConstant('decrementTitle'),
                'aria-label': this.l10n.getConstant('decrementTitle')
            });
        }
        if (!isNullOrUndefined(this.spinUp)) {
            attributes(this.spinUp, {
                'title': this.l10n.getConstant('incrementTitle'),
                'aria-label': this.l10n.getConstant('incrementTitle')
            });
        }
    }
    wireEvents() {
        EventHandler.add(this.element, 'focus', this.focusHandler, this);
        EventHandler.add(this.element, 'blur', this.focusOutHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyDownHandler, this);
        EventHandler.add(this.element, 'keyup', this.keyUpHandler, this);
        EventHandler.add(this.element, 'input', this.inputHandler, this);
        EventHandler.add(this.element, 'keypress', this.keyPressHandler, this);
        EventHandler.add(this.element, 'change', this.changeHandler, this);
        EventHandler.add(this.element, 'paste', this.pasteHandler, this);
        if (this.enabled) {
            this.bindClearEvent();
            if (this.formEle) {
                EventHandler.add(this.formEle, 'reset', this.resetFormHandler, this);
            }
        }
    }
    wireSpinBtnEvents() {
        /* bind spin button events */
        EventHandler.add(this.spinUp, Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchStartEvent, this.mouseDownOnSpinner, this);
        EventHandler.add(this.spinUp, Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchEndEvent, this.mouseUpOnSpinner, this);
        EventHandler.add(this.spinUp, Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
        EventHandler.add(this.spinDown, Browser.touchMoveEvent, this.touchMoveOnSpinner, this);
    }
    unwireEvents() {
        EventHandler.remove(this.element, 'focus', this.focusHandler);
        EventHandler.remove(this.element, 'blur', this.focusOutHandler);
        EventHandler.remove(this.element, 'keyup', this.keyUpHandler);
        EventHandler.remove(this.element, 'input', this.inputHandler);
        EventHandler.remove(this.element, 'keydown', this.keyDownHandler);
        EventHandler.remove(this.element, 'keypress', this.keyPressHandler);
        EventHandler.remove(this.element, 'change', this.changeHandler);
        EventHandler.remove(this.element, 'paste', this.pasteHandler);
        if (this.formEle) {
            EventHandler.remove(this.formEle, 'reset', this.resetFormHandler);
        }
    }
    unwireSpinBtnEvents() {
        /* unbind spin button events */
        EventHandler.remove(this.spinUp, Browser.touchStartEvent, this.mouseDownOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchStartEvent, this.mouseDownOnSpinner);
        EventHandler.remove(this.spinUp, Browser.touchEndEvent, this.mouseUpOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchEndEvent, this.mouseUpOnSpinner);
        EventHandler.remove(this.spinUp, Browser.touchMoveEvent, this.touchMoveOnSpinner);
        EventHandler.remove(this.spinDown, Browser.touchMoveEvent, this.touchMoveOnSpinner);
    }
    changeHandler(event) {
        event.stopPropagation();
        if (!this.element.value.length) {
            this.setProperties({ value: null }, true);
        }
        let parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
        this.updateValue(parsedInput, event);
    }
    raiseChangeEvent(event) {
        if (this.prevValue !== this.value) {
            let eventArgs = {};
            this.changeEventArgs = { value: this.value, previousValue: this.prevValue, isInteracted: this.isInteract,
                isInteraction: this.isInteract, event: event };
            if (event) {
                this.changeEventArgs.event = event;
            }
            if (this.changeEventArgs.event === undefined) {
                this.changeEventArgs.isInteracted = false;
                this.changeEventArgs.isInteraction = false;
            }
            merge(eventArgs, this.changeEventArgs);
            this.prevValue = this.value;
            this.isInteract = false;
            this.trigger('change', eventArgs);
        }
    }
    pasteHandler() {
        if (!this.enabled || this.readonly) {
            return;
        }
        let beforeUpdate = this.element.value;
        setTimeout(() => {
            if (!this.numericRegex().test(this.element.value)) {
                this.setElementValue(beforeUpdate);
            }
        });
    }
    preventHandler() {
        let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        setTimeout(() => {
            if (this.element.selectionStart > 0) {
                let currentPos = this.element.selectionStart;
                let prevPos = this.element.selectionStart - 1;
                let start = 0;
                let ignoreKeyCode;
                let valArray = this.element.value.split('');
                let numericObject = getNumericObject(this.locale);
                let decimalSeparator = getValue('decimal', numericObject);
                ignoreKeyCode = decimalSeparator.charCodeAt(0);
                if (this.element.value[prevPos] === ' ' && this.element.selectionStart > 0 && !iOS) {
                    if (isNullOrUndefined(this.prevVal)) {
                        this.element.value = this.element.value.trim();
                    }
                    else if (prevPos !== 0) {
                        this.element.value = this.prevVal;
                    }
                    else if (prevPos === 0) {
                        this.element.value = this.element.value.trim();
                    }
                    this.element.setSelectionRange(prevPos, prevPos);
                }
                else if (isNaN(parseFloat(this.element.value[this.element.selectionStart - 1])) &&
                    this.element.value[this.element.selectionStart - 1].charCodeAt(0) !== 45) {
                    if ((valArray.indexOf(this.element.value[this.element.selectionStart - 1]) !==
                        valArray.lastIndexOf(this.element.value[this.element.selectionStart - 1]) &&
                        this.element.value[this.element.selectionStart - 1].charCodeAt(0) === ignoreKeyCode) ||
                        this.element.value[this.element.selectionStart - 1].charCodeAt(0) !== ignoreKeyCode) {
                        this.element.value = this.element.value.substring(0, prevPos) +
                            this.element.value.substring(currentPos, this.element.value.length);
                        this.element.setSelectionRange(prevPos, prevPos);
                        if (isNaN(parseFloat(this.element.value[this.element.selectionStart - 1])) && this.element.selectionStart > 0
                            && this.element.value.length) {
                            this.preventHandler();
                        }
                    }
                }
                else if (isNaN(parseFloat(this.element.value[this.element.selectionStart - 2])) && this.element.selectionStart > 1 &&
                    this.element.value[this.element.selectionStart - 2].charCodeAt(0) !== 45) {
                    if ((valArray.indexOf(this.element.value[this.element.selectionStart - 2]) !==
                        valArray.lastIndexOf(this.element.value[this.element.selectionStart - 2]) &&
                        this.element.value[this.element.selectionStart - 2].charCodeAt(0) === ignoreKeyCode) ||
                        this.element.value[this.element.selectionStart - 2].charCodeAt(0) !== ignoreKeyCode) {
                        this.element.setSelectionRange(prevPos, prevPos);
                        this.nextEle = this.element.value[this.element.selectionStart];
                        this.cursorPosChanged = true;
                        this.preventHandler();
                    }
                }
                if (this.cursorPosChanged === true && this.element.value[this.element.selectionStart] === this.nextEle &&
                    isNaN(parseFloat(this.element.value[this.element.selectionStart - 1]))) {
                    this.element.setSelectionRange(this.element.selectionStart + 1, this.element.selectionStart + 1);
                    this.cursorPosChanged = false;
                    this.nextEle = null;
                }
                if (this.element.value.trim() === '') {
                    this.element.setSelectionRange(start, start);
                }
                if (this.element.selectionStart > 0) {
                    if ((this.element.value[this.element.selectionStart - 1].charCodeAt(0) === 45) && this.element.selectionStart > 1) {
                        if (isNullOrUndefined(this.prevVal)) {
                            this.element.value = this.element.value;
                        }
                        else {
                            this.element.value = this.prevVal;
                        }
                        this.element.setSelectionRange(this.element.selectionStart, this.element.selectionStart);
                    }
                }
                this.prevVal = this.element.value;
            }
        });
    }
    keyUpHandler(event) {
        if (!this.enabled || this.readonly) {
            return;
        }
        let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        if (!iOS && Browser.isDevice) {
            this.preventHandler();
        }
        let parseValue = this.instance.getNumberParser({ format: 'n' })(this.element.value);
        parseValue = parseValue === null || isNaN(parseValue) ? null : parseValue;
        this.hiddenInput.value = parseValue || parseValue === 0 ? parseValue.toString() : null;
        let formElement = closest(this.element, 'form');
        if (formElement) {
            let element = this.element.nextElementSibling;
            let keyupEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    }
    ;
    inputHandler(event) {
        if (!this.enabled || this.readonly) {
            return;
        }
        let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        let fireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if ((fireFox || iOS) && Browser.isDevice) {
            this.preventHandler();
        }
    }
    ;
    keyDownHandler(event) {
        if (!this.readonly) {
            switch (event.keyCode) {
                case 38:
                    event.preventDefault();
                    this.action(INCREMENT, event);
                    break;
                case 40:
                    event.preventDefault();
                    this.action(DECREMENT, event);
                    break;
                default: break;
            }
        }
    }
    ;
    performAction(value, step, operation) {
        if (value === null || isNaN(value)) {
            value = 0;
        }
        let updatedValue = operation === INCREMENT ? value + step : value - step;
        updatedValue = this.correctRounding(value, step, updatedValue);
        return this.strictMode ? this.trimValue(updatedValue) : updatedValue;
    }
    ;
    correctRounding(value, step, result) {
        let floatExp = new RegExp('[,.](.*)');
        let valueText = value.toString();
        let stepText = step.toString();
        let floatValue = floatExp.test(value.toString());
        let floatStep = floatExp.test(step.toString());
        if (floatValue || floatStep) {
            let valueCount = floatValue ? floatExp.exec(value.toString())[0].length : 0;
            let stepCount = floatStep ? floatExp.exec(step.toString())[0].length : 0;
            let max = Math.max(valueCount, stepCount);
            return value = this.roundValue(result, max);
        }
        return result;
    }
    ;
    roundValue(result, precision) {
        precision = precision || 0;
        let divide = Math.pow(10, precision);
        return result *= divide, result = Math.round(result) / divide;
    }
    ;
    updateValue(value, event) {
        if (event) {
            this.isInteract = true;
        }
        if (value !== null && !isNaN(value)) {
            if (this.decimals) {
                value = this.roundNumber(value, this.decimals);
            }
        }
        this.changeValue(value === null || isNaN(value) ? null : this.strictMode ? this.trimValue(value) : value);
        this.raiseChangeEvent(event);
    }
    updateCurrency(prop, propVal) {
        setValue(prop, propVal, this.cultureInfo);
        this.updateValue(this.value);
    }
    changeValue(value) {
        if (!(value || value === 0)) {
            value = null;
            this.setProperties({ value: value }, true);
        }
        else {
            let numberOfDecimals;
            let decimalPart = value.toString().split('.')[1];
            numberOfDecimals = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
            if (this.decimals !== null) {
                numberOfDecimals = numberOfDecimals < this.decimals ? numberOfDecimals : this.decimals;
            }
            this.setProperties({ value: this.roundNumber(value, numberOfDecimals) }, true);
        }
        this.modifyText();
        if (!this.strictMode) {
            this.validateState();
        }
    }
    ;
    modifyText() {
        if (this.value || this.value === 0) {
            let value = this.formatNumber();
            let elementValue = this.isFocused ? value : this.instance.getNumberFormat(this.cultureInfo)(this.value);
            this.setElementValue(elementValue);
            attributes(this.element, { 'aria-valuenow': value });
            this.hiddenInput.value = this.value.toString();
        }
        else {
            this.setElementValue('');
            this.element.removeAttribute('aria-valuenow');
            this.hiddenInput.value = null;
        }
    }
    ;
    setElementValue(val, element) {
        Input.setValue(val, (element ? element : this.element), this.floatLabelType, this.showClearButton);
    }
    validateState() {
        this.isValidState = true;
        if (this.value || this.value === 0) {
            this.isValidState = !(this.value > this.max || this.value < this.min);
        }
        this.checkErrorClass();
    }
    formatNumber() {
        let numberOfDecimals;
        let currentValue = this.value;
        let decimalPart = currentValue.toString().split('.')[1];
        numberOfDecimals = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
        if (this.decimals !== null) {
            numberOfDecimals = numberOfDecimals < this.decimals ? numberOfDecimals : this.decimals;
        }
        return this.instance.getNumberFormat({
            maximumFractionDigits: numberOfDecimals,
            minimumFractionDigits: numberOfDecimals, useGrouping: false
        })(this.value);
    }
    ;
    trimValue(value) {
        if (value > this.max) {
            return this.max;
        }
        if (value < this.min) {
            return this.min;
        }
        return value;
    }
    ;
    roundNumber(value, precision) {
        let result = value;
        let decimals = precision || 0;
        let result1 = result.toString().split('e');
        result = Math.round(Number(result1[0] + 'e' + (result1[1] ? (Number(result1[1]) + decimals) : decimals)));
        let result2 = result.toString().split('e');
        result = Number(result2[0] + 'e' + (result2[1] ? (Number(result2[1]) - decimals) : -decimals));
        return Number(result.toFixed(decimals));
    }
    ;
    cancelEvent(event) {
        event.preventDefault();
        return false;
    }
    keyPressHandler(event) {
        if (!this.enabled || this.readonly) {
            return true;
        }
        if (!Browser.isDevice && Browser.info.version === '11.0' && event.keyCode === 13) {
            let parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput, event);
            return true;
        }
        if (event.which === 0 || event.metaKey || event.ctrlKey || event.keyCode === 8 || event.keyCode === 13) {
            return true;
        }
        let currentChar = String.fromCharCode(event.which);
        let text = this.element.value;
        text = text.substring(0, this.element.selectionStart) + currentChar + text.substring(this.element.selectionEnd);
        if (!this.numericRegex().test(text)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        else {
            return true;
        }
    }
    ;
    numericRegex() {
        let numericObject = getNumericObject(this.locale);
        let decimalSeparator = getValue('decimal', numericObject);
        let fractionRule = '*';
        if (decimalSeparator === DECIMALSEPARATOR) {
            decimalSeparator = '\\' + decimalSeparator;
        }
        if (this.decimals === 0 && this.validateDecimalOnType) {
            return INTREGEXP;
        }
        if (this.decimals && this.validateDecimalOnType) {
            fractionRule = '{0,' + this.decimals + '}';
        }
        return new RegExp('^(-)?(((\\d+(' + decimalSeparator + '\\d' + fractionRule +
            ')?)|(' + decimalSeparator + '\\d' + fractionRule + ')))?$');
    }
    ;
    mouseWheel(event) {
        event.preventDefault();
        let delta;
        let rawEvent = event;
        if (rawEvent.wheelDelta) {
            delta = rawEvent.wheelDelta / 120;
        }
        else if (rawEvent.detail) {
            delta = -rawEvent.detail / 3;
        }
        if (delta > 0) {
            this.action(INCREMENT, event);
        }
        else if (delta < 0) {
            this.action(DECREMENT, event);
        }
        this.cancelEvent(event);
    }
    focusHandler(event) {
        this.focusEventArgs = { event: event, value: this.value, container: this.container };
        this.trigger('focus', this.focusEventArgs);
        if (!this.enabled || this.readonly) {
            return;
        }
        this.isFocused = true;
        removeClass([this.container], ERROR);
        this.prevValue = this.value;
        if ((this.value || this.value === 0)) {
            let formatValue = this.formatNumber();
            this.setElementValue(formatValue);
            if (!this.isPrevFocused) {
                if (!Browser.isDevice && Browser.info.version === '11.0') {
                    this.element.setSelectionRange(0, formatValue.length);
                }
                else {
                    let delay = (Browser.isDevice && Browser.isIos) ? 600 : 0;
                    setTimeout(() => {
                        this.element.setSelectionRange(0, formatValue.length);
                    }, delay);
                }
            }
        }
        if (!Browser.isDevice) {
            EventHandler.add(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel, this);
        }
    }
    ;
    focusOutHandler(event) {
        this.blurEventArgs = { event: event, value: this.value, container: this.container };
        this.trigger('blur', this.blurEventArgs);
        if (!this.enabled || this.readonly) {
            return;
        }
        if (this.isPrevFocused) {
            event.preventDefault();
            if (Browser.isDevice) {
                let value = this.element.value;
                this.element.focus();
                this.isPrevFocused = false;
                let ele = this.element;
                setTimeout(() => {
                    this.setElementValue(value, ele);
                }, 200);
            }
        }
        else {
            this.isFocused = false;
            if (!this.element.value.length) {
                this.setProperties({ value: null }, true);
            }
            let parsedInput = this.instance.getNumberParser({ format: 'n' })(this.element.value);
            this.updateValue(parsedInput);
            if (!Browser.isDevice) {
                EventHandler.remove(this.element, 'mousewheel DOMMouseScroll', this.mouseWheel);
            }
        }
        let formElement = closest(this.element, 'form');
        if (formElement) {
            let element = this.element.nextElementSibling;
            let focusEvent = document.createEvent('FocusEvent');
            focusEvent.initEvent('focusout', false, true);
            element.dispatchEvent(focusEvent);
        }
    }
    ;
    mouseDownOnSpinner(event) {
        if (this.isFocused) {
            this.isPrevFocused = true;
            event.preventDefault();
        }
        if (!this.getElementData(event)) {
            return;
        }
        let result = this.getElementData(event);
        let target = event.currentTarget;
        let action = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
        EventHandler.add(target, 'mouseleave', this.mouseUpClick, this);
        this.timeOut = setInterval(() => { this.isCalled = true; this.action(action, event); }, 150);
        EventHandler.add(document, 'mouseup', this.mouseUpClick, this);
    }
    touchMoveOnSpinner(event) {
        let target = document.elementFromPoint(event.clientX, event.clientY);
        if (!(target.classList.contains(SPINICON))) {
            clearInterval(this.timeOut);
        }
    }
    mouseUpOnSpinner(event) {
        if (this.isPrevFocused) {
            this.element.focus();
            if (!Browser.isDevice) {
                this.isPrevFocused = false;
            }
        }
        if (!Browser.isDevice) {
            event.preventDefault();
        }
        if (!this.getElementData(event)) {
            return;
        }
        let target = event.currentTarget;
        let action = (target.classList.contains(SPINUP)) ? INCREMENT : DECREMENT;
        EventHandler.remove(target, 'mouseleave', this.mouseUpClick);
        if (!this.isCalled) {
            this.action(action, event);
        }
        this.isCalled = false;
        EventHandler.remove(document, 'mouseup', this.mouseUpClick);
        let formElement = closest(this.element, 'form');
        if (formElement) {
            let element = this.element.nextElementSibling;
            let keyupEvent = document.createEvent('KeyboardEvent');
            keyupEvent.initEvent('keyup', false, true);
            element.dispatchEvent(keyupEvent);
        }
    }
    getElementData(event) {
        if ((event.which && event.which === 3) || (event.button && event.button === 2)
            || !this.enabled || this.readonly) {
            return false;
        }
        clearInterval(this.timeOut);
        return true;
    }
    floatLabelTypeUpdate() {
        Input.removeFloating(this.inputWrapper);
        let hiddenInput = this.hiddenInput;
        this.hiddenInput.remove();
        Input.addFloating(this.element, this.floatLabelType, this.placeholder, this.createElement);
        this.container.insertBefore(hiddenInput, this.container.childNodes[1]);
    }
    mouseUpClick(event) {
        event.stopPropagation();
        clearInterval(this.timeOut);
        this.isCalled = false;
        EventHandler.remove(this.spinUp, 'mouseleave', this.mouseUpClick);
        EventHandler.remove(this.spinDown, 'mouseleave', this.mouseUpClick);
    }
    /**
     * Increments the NumericTextBox value with the specified step value.
     * @param  {number} step - Specifies the value used to increment the NumericTextBox value.
     * if its not given then numeric value will be incremented based on the step property value.
     */
    increment(step = this.step) {
        this.isInteract = false;
        this.changeValue(this.performAction(this.value, step, INCREMENT));
        this.raiseChangeEvent();
    }
    /**
     * Decrements the NumericTextBox value with specified step value.
     * @param  {number} step - Specifies the value used to decrement the NumericTextBox value.
     * if its not given then numeric value will be decremented based on the step property value.
     */
    decrement(step = this.step) {
        this.isInteract = false;
        this.changeValue(this.performAction(this.value, step, DECREMENT));
        this.raiseChangeEvent();
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.unwireEvents();
        detach(this.hiddenInput);
        if (this.showSpinButton) {
            this.unwireSpinBtnEvents();
            detach(this.spinUp);
            detach(this.spinDown);
        }
        let attrArray = ['aria-labelledby', 'role', 'autocomplete', 'aria-readonly',
            'autocorrect', 'aria-disabled', 'aria-placeholder', 'autocapitalize',
            'spellcheck', 'aria-autocomplete', 'tabindex', 'aria-valuemin',
            'aria-valuemax', 'aria-live', 'aria-valuenow', 'aria-invalid'];
        attrArray.forEach((value) => {
            this.element.removeAttribute(value);
        });
        this.element.classList.remove('e-input');
        this.container.insertAdjacentElement('afterend', this.element);
        detach(this.container);
        super.destroy();
    }
    /**
     * Returns the value of NumericTextBox with the format applied to the NumericTextBox.
     */
    getText() {
        return this.element.value;
    }
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    focusIn() {
        if (document.activeElement !== this.element && this.enabled) {
            this.element.focus();
            addClass([this.container], [NUMERIC_FOCUS]);
        }
    }
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    focusOut() {
        if (document.activeElement === this.element && this.enabled) {
            this.element.blur();
            removeClass([this.container], [NUMERIC_FOCUS]);
        }
    }
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    getPersistData() {
        let keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                    setStyleAttribute(this.container, { 'width': formatUnit(newProp.width) });
                    break;
                case 'cssClass':
                    Input.setCssClass(newProp.cssClass, [this.container], oldProp.cssClass);
                    break;
                case 'enabled':
                    Input.setEnabled(newProp.enabled, this.element);
                    break;
                case 'enableRtl':
                    Input.setEnableRtl(newProp.enableRtl, [this.container]);
                    break;
                case 'readonly':
                    Input.setReadonly(newProp.readonly, this.element);
                    if (this.readonly) {
                        attributes(this.element, { 'aria-readonly': 'true' });
                    }
                    else {
                        this.element.removeAttribute('aria-readonly');
                    }
                    break;
                case 'htmlAttributes':
                    this.updateHTMLAttrToElement();
                    this.updateHTMLAttrToWrapper();
                    this.checkAttributes(true);
                    break;
                case 'placeholder':
                    Input.setPlaceholder(newProp.placeholder, this.element);
                    break;
                case 'step':
                    this.step = newProp.step;
                    this.validateStep();
                    break;
                case 'showSpinButton':
                    if (newProp.showSpinButton) {
                        this.spinBtnCreation();
                    }
                    else {
                        detach(this.spinUp);
                        detach(this.spinDown);
                    }
                    break;
                case 'showClearButton':
                    Input.setClearButton(newProp.showClearButton, this.element, this.inputWrapper, undefined, this.createElement);
                    this.bindClearEvent();
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    this.floatLabelTypeUpdate();
                    break;
                case 'value':
                    this.updateValue(newProp.value);
                    break;
                case 'min':
                case 'max':
                    setValue(prop, getValue(prop, newProp), this);
                    this.validateMinMax();
                    this.updateValue(this.value);
                    break;
                case 'strictMode':
                    this.strictMode = newProp.strictMode;
                    this.updateValue(this.value);
                    this.validateState();
                    break;
                case 'locale':
                    this.initCultureFunc();
                    this.l10n.setLocale(this.locale);
                    this.setSpinButton();
                    this.updatePlaceholder();
                    Input.setPlaceholder(this.placeholder, this.element);
                    this.updateValue(this.value);
                    break;
                case 'currency':
                    let propVal = getValue(prop, newProp);
                    this.setProperties({ currencyCode: propVal }, true);
                    this.updateCurrency(prop, propVal);
                    break;
                case 'currencyCode':
                    let propValue = getValue(prop, newProp);
                    this.setProperties({ currency: propValue }, true);
                    this.updateCurrency('currency', propValue);
                    break;
                case 'format':
                    setValue(prop, getValue(prop, newProp), this);
                    this.initCultureInfo();
                    this.updateValue(this.value);
                    break;
                case 'decimals':
                    this.decimals = newProp.decimals;
                    this.updateValue(this.value);
            }
        }
    }
    /**
     * Gets the component name
     * @private
     */
    getModuleName() {
        return 'numerictextbox';
    }
};
__decorate([
    Property('')
], NumericTextBox.prototype, "cssClass", void 0);
__decorate([
    Property(null)
], NumericTextBox.prototype, "value", void 0);
__decorate([
    Property(-(Number.MAX_VALUE))
], NumericTextBox.prototype, "min", void 0);
__decorate([
    Property(Number.MAX_VALUE)
], NumericTextBox.prototype, "max", void 0);
__decorate([
    Property(1)
], NumericTextBox.prototype, "step", void 0);
__decorate([
    Property(null)
], NumericTextBox.prototype, "width", void 0);
__decorate([
    Property(null)
], NumericTextBox.prototype, "placeholder", void 0);
__decorate([
    Property({})
], NumericTextBox.prototype, "htmlAttributes", void 0);
__decorate([
    Property(true)
], NumericTextBox.prototype, "showSpinButton", void 0);
__decorate([
    Property(false)
], NumericTextBox.prototype, "readonly", void 0);
__decorate([
    Property(true)
], NumericTextBox.prototype, "enabled", void 0);
__decorate([
    Property(false)
], NumericTextBox.prototype, "showClearButton", void 0);
__decorate([
    Property(false)
], NumericTextBox.prototype, "enablePersistence", void 0);
__decorate([
    Property('n2')
], NumericTextBox.prototype, "format", void 0);
__decorate([
    Property(null)
], NumericTextBox.prototype, "decimals", void 0);
__decorate([
    Property(null)
], NumericTextBox.prototype, "currency", void 0);
__decorate([
    Property(null)
], NumericTextBox.prototype, "currencyCode", void 0);
__decorate([
    Property(true)
], NumericTextBox.prototype, "strictMode", void 0);
__decorate([
    Property(false)
], NumericTextBox.prototype, "validateDecimalOnType", void 0);
__decorate([
    Property('Never')
], NumericTextBox.prototype, "floatLabelType", void 0);
__decorate([
    Event()
], NumericTextBox.prototype, "created", void 0);
__decorate([
    Event()
], NumericTextBox.prototype, "destroyed", void 0);
__decorate([
    Event()
], NumericTextBox.prototype, "change", void 0);
__decorate([
    Event()
], NumericTextBox.prototype, "focus", void 0);
__decorate([
    Event()
], NumericTextBox.prototype, "blur", void 0);
NumericTextBox = __decorate([
    NotifyPropertyChanges
], NumericTextBox);

/**
 * NumericTextBox modules
 */

/**
 * MaskedTextBox base module
 */
const ERROR$1 = 'e-error';
const INPUTGROUP = 'e-input-group';
const FLOATINPUT = 'e-float-input';
const UTILMASK = 'e-utility-mask';
const TOPLABEL = 'e-label-top';
const BOTTOMLABEL = 'e-label-bottom';
/**
 * @hidden
 * Built-in masking elements collection.
 */
let regularExpressions = {
    '0': '[0-9]',
    '9': '[0-9 ]',
    '#': '[0-9 +-]',
    'L': '[A-Za-z]',
    '?': '[A-Za-z ]',
    '&': '[^\x7f ]+',
    'C': '[^\x7f]+',
    'A': '[A-Za-z0-9]',
    'a': '[A-Za-z0-9 ]',
};
/**
 * @hidden
 * Generate required masking elements to the MaskedTextBox from user mask input.
 */
function createMask() {
    attributes(this.element, {
        'role': 'textbox', 'autocomplete': 'off', 'autocorrect': 'off', 'autocapitalize': 'off',
        'spellcheck': 'false', 'aria-live': 'assertive', 'aria-valuenow': ''
    });
    if (this.mask) {
        let splitMask = this.mask.split(']');
        for (let i = 0; i < splitMask.length; i++) {
            if (splitMask[i][splitMask[i].length - 1] === '\\') {
                splitMask[i] = splitMask[i] + ']';
                let splitInnerMask = splitMask[i].split('[');
                for (let j = 0; j < splitInnerMask.length; j++) {
                    if (splitInnerMask[j][splitInnerMask[j].length - 1] === '\\') {
                        splitInnerMask[j] = splitInnerMask[j] + '[';
                    }
                    pushIntoRegExpCollec.call(this, splitInnerMask[j]);
                }
            }
            else {
                let splitInnerMask = splitMask[i].split('[');
                if (splitInnerMask.length > 1) {
                    let chkSpace = false;
                    for (let j = 0; j < splitInnerMask.length; j++) {
                        if (splitInnerMask[j] === '\\') {
                            this.customRegExpCollec.push('[');
                            this.hiddenMask += splitInnerMask[j] + '[';
                        }
                        else if (splitInnerMask[j] === '') {
                            chkSpace = true;
                        }
                        else if ((splitInnerMask[j] !== '' && chkSpace) || j === splitInnerMask.length - 1) {
                            this.customRegExpCollec.push('[' + splitInnerMask[j] + ']');
                            this.hiddenMask += this.promptChar;
                            chkSpace = false;
                        }
                        else {
                            pushIntoRegExpCollec.call(this, splitInnerMask[j]);
                        }
                    }
                }
                else {
                    pushIntoRegExpCollec.call(this, splitInnerMask[0]);
                }
            }
        }
        this.escapeMaskValue = this.hiddenMask;
        this.promptMask = this.hiddenMask.replace(/[09?LCAa#&]/g, this.promptChar);
        if (!isNullOrUndefined(this.customCharacters)) {
            for (let i = 0; i < this.promptMask.length; i++) {
                if (!isNullOrUndefined(this.customCharacters[this.promptMask[i]])) {
                    this.promptMask = this.promptMask.replace(new RegExp(this.promptMask[i], 'g'), this.promptChar);
                }
            }
        }
        let escapeNumber = 0;
        if (this.hiddenMask.match(new RegExp(/\\/))) {
            for (let i = 0; i < this.hiddenMask.length; i++) {
                let j = 0;
                if (i >= 1) {
                    j = i;
                }
                escapeNumber = this.hiddenMask.length - this.promptMask.length;
                j = j - escapeNumber;
                if ((i > 0 && this.hiddenMask[i - 1] !== '\\') && (this.hiddenMask[i] === '>' ||
                    this.hiddenMask[i] === '<' || this.hiddenMask[i] === '|')) {
                    this.promptMask = this.promptMask.substring(0, j) +
                        this.promptMask.substring((i + 1) - escapeNumber, this.promptMask.length);
                    this.escapeMaskValue = this.escapeMaskValue.substring(0, j) +
                        this.escapeMaskValue.substring((i + 1) - escapeNumber, this.escapeMaskValue.length);
                }
                if (this.hiddenMask[i] === '\\') {
                    this.promptMask = this.promptMask.substring(0, j) + this.hiddenMask[i + 1] +
                        this.promptMask.substring((i + 2) - escapeNumber, this.promptMask.length);
                    this.escapeMaskValue = this.escapeMaskValue.substring(0, j) + this.escapeMaskValue[i + 1] +
                        this.escapeMaskValue.substring((i + 2) - escapeNumber, this.escapeMaskValue.length);
                }
            }
        }
        else {
            this.promptMask = this.promptMask.replace(/[>|<]/g, '');
            this.escapeMaskValue = this.hiddenMask.replace(/[>|<]/g, '');
        }
        attributes(this.element, { 'aria-invalid': 'false' });
    }
}
/**
 * @hidden
 * Apply mask ability with masking elements to the MaskedTextBox.
 */
function applyMask() {
    setElementValue.call(this, this.promptMask);
    setMaskValue.call(this, this.value);
}
/**
 * @hidden
 * To wire required events to the MaskedTextBox.
 */
function wireEvents() {
    EventHandler.add(this.element, 'keydown', maskInputKeyDownHandler, this);
    EventHandler.add(this.element, 'keypress', maskInputKeyPressHandler, this);
    EventHandler.add(this.element, 'keyup', maskInputKeyUpHandler, this);
    EventHandler.add(this.element, 'input', maskInputHandler, this);
    EventHandler.add(this.element, 'focus', maskInputFocusHandler, this);
    EventHandler.add(this.element, 'blur', maskInputBlurHandler, this);
    EventHandler.add(this.element, 'paste', maskInputPasteHandler, this);
    EventHandler.add(this.element, 'cut', maskInputCutHandler, this);
    EventHandler.add(this.element, 'drop', maskInputDropHandler, this);
    if (this.enabled) {
        bindClearEvent.call(this);
        if (this.formElement) {
            EventHandler.add(this.formElement, 'reset', resetFormHandler, this);
        }
    }
}
/**
 * @hidden
 * To unwire events attached to the MaskedTextBox.
 */
function unwireEvents() {
    EventHandler.remove(this.element, 'keydown', maskInputKeyDownHandler);
    EventHandler.remove(this.element, 'keypress', maskInputKeyPressHandler);
    EventHandler.remove(this.element, 'keyup', maskInputKeyUpHandler);
    EventHandler.remove(this.element, 'input', maskInputHandler);
    EventHandler.remove(this.element, 'focus', maskInputFocusHandler);
    EventHandler.remove(this.element, 'blur', maskInputBlurHandler);
    EventHandler.remove(this.element, 'paste', maskInputPasteHandler);
    EventHandler.remove(this.element, 'cut', maskInputCutHandler);
    if (this.formElement) {
        EventHandler.remove(this.formElement, 'reset', resetFormHandler);
    }
}
/**
 * @hidden
 * To bind required events to the MaskedTextBox clearButton.
 */
function bindClearEvent() {
    if (this.showClearButton) {
        EventHandler.add(this.inputObj.clearButton, 'mousedown touchstart', resetHandler, this);
    }
}
function resetHandler(e) {
    e.preventDefault();
    if (!this.inputObj.clearButton.classList.contains('e-clear-icon-hide')) {
        clear.call(this, e);
        this.value = '';
    }
}
function clear(event) {
    let value = this.element.value;
    setElementValue.call(this, this.promptMask);
    this.redoCollec.unshift({
        value: this.promptMask, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd
    });
    triggerMaskChangeEvent.call(this, event, value);
    this.element.setSelectionRange(0, 0);
}
function resetFormHandler() {
    if (this.element.tagName === 'EJS-MASKEDTEXTBOX') {
        setElementValue.call(this, this.promptMask);
    }
    else {
        this.value = this.initInputValue;
    }
}
/**
 * @hidden
 * To get masked value from the MaskedTextBox.
 */
function unstrippedValue(element) {
    return element.value;
}
/**
 * @hidden
 * To extract raw value from the MaskedTextBox.
 */
function strippedValue(element, maskValues) {
    let value = '';
    let k = 0;
    let checkMask = false;
    let maskValue = (!isNullOrUndefined(maskValues)) ? maskValues : (!isNullOrUndefined(element) &&
        !isNullOrUndefined(this)) ? element.value : maskValues;
    if (maskValue !== this.promptMask) {
        for (let i = 0; i < this.customRegExpCollec.length; i++) {
            if (checkMask) {
                checkMask = false;
            }
            if (this.customRegExpCollec[k] === '>' || this.customRegExpCollec[k] === '<' ||
                this.customRegExpCollec[k] === '|' || this.customRegExpCollec[k] === '\\') {
                --i;
                checkMask = true;
            }
            if (!checkMask) {
                if ((maskValue[i] !== this.promptChar) && (!isNullOrUndefined(this.customRegExpCollec[k]) &&
                    ((!isNullOrUndefined(this.regExpCollec[this.customRegExpCollec[k]])) ||
                        (this.customRegExpCollec[k].length > 2 && this.customRegExpCollec[k][0] === '[' &&
                            this.customRegExpCollec[k][this.customRegExpCollec[k].length - 1] === ']') ||
                        (!isNullOrUndefined(this.customCharacters) &&
                            (!isNullOrUndefined(this.customCharacters[this.customRegExpCollec[k]]))))) && (maskValue !== '')) {
                    value += maskValue[i];
                }
            }
            ++k;
        }
    }
    if (this.mask === null || this.mask === '' && this.value !== undefined) {
        value = maskValue;
    }
    return value;
}
function pushIntoRegExpCollec(value) {
    for (let k = 0; k < value.length; k++) {
        this.hiddenMask += value[k];
        if (value[k] !== '\\') {
            this.customRegExpCollec.push(value[k]);
        }
    }
}
function maskInputFocusHandler(event) {
    let eventArgs = {
        selectionStart: 0,
        event: event,
        value: this.value,
        maskedValue: this.element.value,
        container: this.inputObj.container,
        selectionEnd: (this.promptMask.length > 0) ? this.promptMask.length : this.element.value.length,
    };
    this.trigger('focus', eventArgs, (eventArgs) => {
        if (this.mask) {
            this.isFocus = true;
            if (this.element.value === '') {
                setElementValue.call(this, this.promptMask);
            }
            else {
                setElementValue.call(this, this.element.value);
            }
            if (!Browser.isDevice && Browser.info.version === '11.0') {
                this.element.setSelectionRange(eventArgs.selectionStart, eventArgs.selectionEnd);
            }
            else {
                let delay = (Browser.isDevice && Browser.isIos) ? 450 : 0;
                setTimeout(() => {
                    this.element.setSelectionRange(eventArgs.selectionStart, eventArgs.selectionEnd);
                }, delay);
            }
        }
    });
}
function maskInputBlurHandler(event) {
    this.blurEventArgs = {
        event: event,
        value: this.value,
        maskedValue: this.element.value,
        container: this.inputObj.container
    };
    this.trigger('blur', this.blurEventArgs);
    if (this.mask) {
        this.isFocus = false;
        if (this.placeholder && this.element.value === this.promptMask && this.floatLabelType !== 'Always') {
            setElementValue.call(this, '');
            let labelElement = this.element.parentNode.querySelector('.e-float-text');
            if (this.floatLabelType === 'Auto' && !isNullOrUndefined(labelElement) && labelElement.classList.contains(TOPLABEL)) {
                removeClass([labelElement], TOPLABEL);
            }
        }
    }
}
function maskInputPasteHandler(event) {
    if (this.mask && !this.readonly) {
        let sIndex = this.element.selectionStart;
        let eIndex = this.element.selectionEnd;
        let oldValue = this.element.value;
        setElementValue.call(this, '');
        this._callPasteHandler = true;
        setTimeout(() => {
            let value = this.element.value.replace(/ /g, '');
            if (this.redoCollec.length > 0 && this.redoCollec[0].value === this.element.value) {
                value = strippedValue.call(this, this.element);
            }
            setElementValue.call(this, oldValue);
            this.element.selectionStart = sIndex;
            this.element.selectionEnd = eIndex;
            let i = 0;
            this.maskKeyPress = true;
            do {
                validateValue.call(this, value[i], false, null);
                ++i;
            } while (i < value.length);
            this.maskKeyPress = false;
            this._callPasteHandler = false;
            if (this.element.value === oldValue) {
                let i = 0;
                this.maskKeyPress = true;
                do {
                    validateValue.call(this, value[i], false, null);
                    ++i;
                } while (i < value.length);
                this.maskKeyPress = false;
            }
            else {
                triggerMaskChangeEvent.call(this, event, oldValue);
            }
        }, 1);
    }
}
function maskInputCutHandler(event) {
    if (this.mask && !this.readonly) {
        let preValue = this.element.value;
        let sIndex = this.element.selectionStart;
        let eIndex = this.element.selectionEnd;
        this.undoCollec.push({ value: this.element.value, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd });
        let value = this.element.value.substring(0, sIndex) + this.promptMask.substring(sIndex, eIndex) +
            this.element.value.substring(eIndex);
        setTimeout(() => {
            setElementValue.call(this, value);
            this.element.selectionStart = this.element.selectionEnd = sIndex;
            if (this.element.value !== preValue) {
                triggerMaskChangeEvent.call(this, event, null);
            }
        }, 0);
    }
}
function maskInputDropHandler(event) {
    event.preventDefault();
}
function maskInputHandler(event) {
    if (Browser.isIE === true && this.element.value === '' && this.floatLabelType === 'Never') {
        return;
    }
    let eventArgs = { ctrlKey: false, keyCode: 229 };
    // tslint:disable-next-line
    extend(event, eventArgs);
    if (this.mask) {
        if (this.element.value === '') {
            this.redoCollec.unshift({
                value: this.promptMask, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd
            });
        }
        if (this.element.value.length === 1) {
            this.element.value = this.element.value + this.promptMask;
            this.element.setSelectionRange(1, 1);
        }
        if (!this._callPasteHandler) {
            removeMaskInputValues.call(this, event);
        }
        if (this.element.value.length > this.promptMask.length) {
            let startIndex = this.element.selectionStart;
            let addedValues = this.element.value.length - this.promptMask.length;
            let value = this.element.value.substring(startIndex - addedValues, startIndex);
            this.maskKeyPress = false;
            let i = 0;
            do {
                validateValue.call(this, value[i], event.ctrlKey, event);
                ++i;
            } while (i < value.length);
            if (this.element.value !== this.preEleVal) {
                triggerMaskChangeEvent.call(this, event, null);
            }
        }
        let val = strippedValue.call(this, this.element);
        this.prevValue = val;
        this.value = val;
        if (val === '') {
            setElementValue.call(this, this.promptMask);
            this.element.setSelectionRange(0, 0);
        }
    }
}
function maskInputKeyDownHandler(event) {
    if (this.mask && !this.readonly) {
        if (event.keyCode !== 229) {
            if (event.ctrlKey && (event.keyCode === 89 || event.keyCode === 90)) {
                event.preventDefault();
            }
            removeMaskInputValues.call(this, event);
        }
        let startValue = this.element.value;
        if (event.ctrlKey && (event.keyCode === 89 || event.keyCode === 90)) {
            let collec;
            if (event.keyCode === 90 && this.undoCollec.length > 0 && startValue !== this.undoCollec[this.undoCollec.length - 1].value) {
                collec = this.undoCollec[this.undoCollec.length - 1];
                this.redoCollec.unshift({
                    value: this.element.value, startIndex: this.element.selectionStart,
                    endIndex: this.element.selectionEnd
                });
                setElementValue.call(this, collec.value);
                this.element.selectionStart = collec.startIndex;
                this.element.selectionEnd = collec.endIndex;
                this.undoCollec.splice(this.undoCollec.length - 1, 1);
            }
            else if (event.keyCode === 89 && this.redoCollec.length > 0 && startValue !== this.redoCollec[0].value) {
                collec = this.redoCollec[0];
                this.undoCollec.push({
                    value: this.element.value, startIndex: this.element.selectionStart,
                    endIndex: this.element.selectionEnd
                });
                setElementValue.call(this, collec.value);
                this.element.selectionStart = collec.startIndex;
                this.element.selectionEnd = collec.endIndex;
                this.redoCollec.splice(0, 1);
            }
        }
    }
}
function mobileRemoveFunction() {
    let collec;
    let sIndex = this.element.selectionStart;
    let eIndex = this.element.selectionEnd;
    if (this.redoCollec.length > 0) {
        collec = this.redoCollec[0];
        setElementValue.call(this, collec.value);
        if ((collec.startIndex - sIndex) === 1) {
            this.element.selectionStart = collec.startIndex;
            this.element.selectionEnd = collec.endIndex;
        }
        else {
            this.element.selectionStart = sIndex + 1;
            this.element.selectionEnd = eIndex + 1;
        }
    }
    else {
        setElementValue.call(this, this.promptMask);
        this.element.selectionStart = this.element.selectionEnd = sIndex;
    }
}
function autoFillMaskInputValues(isRemove, oldEventVal, event) {
    if (event.type === 'input') {
        isRemove = false;
        oldEventVal = this.element.value;
        setElementValue.call(this, this.promptMask);
        setMaskValue.call(this, oldEventVal);
    }
    return isRemove;
}
function removeMaskInputValues(event) {
    let isRemove = false;
    let oldEventVal;
    let isDeleted = false;
    if (this.element.value.length < this.promptMask.length) {
        isRemove = true;
        oldEventVal = this.element.value;
        isRemove = autoFillMaskInputValues.call(this, isRemove, oldEventVal, event);
        mobileRemoveFunction.call(this);
    }
    if (this.element.value.length >= this.promptMask.length && event.type === 'input') {
        isRemove = autoFillMaskInputValues.call(this, isRemove, oldEventVal, event);
    }
    let initStartIndex = this.element.selectionStart;
    let initEndIndex = this.element.selectionEnd;
    let startIndex = this.element.selectionStart;
    let endIndex = this.element.selectionEnd;
    let maskValue = this.hiddenMask.replace(/[>|\\<]/g, '');
    let curMask = maskValue[startIndex - 1];
    let parentElement = this.element.parentNode;
    if (isRemove || event.keyCode === 8 || event.keyCode === 46) {
        this.undoCollec.push({ value: this.element.value, startIndex: this.element.selectionStart, endIndex: endIndex });
        let multipleDel = false;
        let preValue = this.element.value;
        if (startIndex > 0 || ((event.keyCode === 8 || event.keyCode === 46) && startIndex < this.element.value.length
            && ((this.element.selectionEnd - startIndex) !== this.element.value.length))) {
            let index = startIndex;
            if (startIndex !== endIndex) {
                startIndex = endIndex;
                if (event.keyCode === 46) {
                    multipleDel = true;
                }
            }
            else if (event.keyCode === 46) {
                ++index;
            }
            else {
                --index;
            }
            for (let k = startIndex; (event.keyCode === 8 || isRemove || multipleDel) ? k > index : k < index; (event.keyCode === 8 || isRemove || multipleDel) ? k-- : k++) {
                for (let i = startIndex; (event.keyCode === 8 || isRemove || multipleDel) ? i > 0 : i < this.element.value.length; (event.keyCode === 8 || isRemove || multipleDel) ? i-- : i++) {
                    let sIndex;
                    if (((event.keyCode === 8 || multipleDel) && ((initStartIndex !== initEndIndex && initStartIndex !== startIndex) ||
                        (initStartIndex === initEndIndex))) || isRemove) {
                        curMask = maskValue[i - 1];
                        sIndex = startIndex - 1;
                    }
                    else {
                        curMask = maskValue[i];
                        sIndex = startIndex;
                        ++startIndex;
                    }
                    let oldValue = this.element.value[sIndex];
                    if ((isNullOrUndefined(this.regExpCollec[curMask]) && (!isNullOrUndefined(this.customCharacters)
                        && isNullOrUndefined(this.customCharacters[curMask]))
                        && ((this.hiddenMask[sIndex] !== this.promptChar && this.customRegExpCollec[sIndex][0] !== '['
                            && this.customRegExpCollec[sIndex][this.customRegExpCollec[sIndex].length - 1] !== ']')))
                        || (this.promptMask[sIndex] !== this.promptChar && isNullOrUndefined(this.customCharacters))) {
                        this.element.selectionStart = this.element.selectionEnd = sIndex;
                        event.preventDefault();
                        if (event.keyCode === 46 && !multipleDel) {
                            ++this.element.selectionStart;
                        }
                    }
                    else {
                        let value = this.element.value;
                        let prompt = this.promptChar;
                        let elementValue = value.substring(0, sIndex) + prompt + value.substring(startIndex, value.length);
                        setElementValue.call(this, elementValue);
                        event.preventDefault();
                        this.element.selectionStart = this.element.selectionEnd = sIndex;
                        isDeleted = true;
                    }
                    startIndex = this.element.selectionStart;
                    if ((!isDeleted && event.keyCode === 8) || multipleDel || (!isDeleted && !(event.keyCode === 46))) {
                        sIndex = startIndex - 1;
                    }
                    else {
                        sIndex = startIndex;
                        isDeleted = false;
                    }
                    oldValue = this.element.value[sIndex];
                    if (((initStartIndex !== initEndIndex) && (this.element.selectionStart === initStartIndex))
                        || (this.promptMask[sIndex] === this.promptChar) || ((oldValue !== this.promptMask[sIndex]) &&
                        (this.promptMask[sIndex] !== this.promptChar) && !isNullOrUndefined(this.customCharacters))) {
                        break;
                    }
                }
            }
        }
        if (this.element.selectionStart === 0 && (this.element.selectionEnd === this.element.value.length)) {
            setElementValue.call(this, this.promptMask);
            event.preventDefault();
            this.element.selectionStart = this.element.selectionEnd = startIndex;
        }
        this.redoCollec.unshift({
            value: this.element.value, startIndex: this.element.selectionStart,
            endIndex: this.element.selectionEnd
        });
        if (this.element.value !== preValue) {
            triggerMaskChangeEvent.call(this, event, oldEventVal);
        }
    }
}
function maskInputKeyPressHandler(event) {
    if (this.mask && !this.readonly) {
        let oldValue = this.element.value;
        if ((!event.ctrlKey) || (event.ctrlKey && event.code !== 'KeyA' && event.code !== 'KeyY'
            && event.code !== 'KeyZ' && event.code !== 'KeyX' && event.code !== 'KeyC' && event.code !== 'KeyV')) {
            this.maskKeyPress = true;
            let key = event.key;
            if (key === 'Spacebar') {
                key = String.fromCharCode(event.keyCode);
            }
            if (!key) {
                this.isIosInvalid = true;
                validateValue.call(this, String.fromCharCode(event.keyCode), event.ctrlKey, event);
                event.preventDefault();
                this.isIosInvalid = false;
            }
            else if (key && key.length === 1) {
                validateValue.call(this, key, event.ctrlKey, event);
                event.preventDefault();
            }
            if (event.keyCode === 32 && key === ' ' && this.promptChar === ' ') {
                this.element.selectionStart = this.element.selectionEnd = this.element.selectionStart - key.length;
            }
        }
        if (this.element.value !== oldValue) {
            triggerMaskChangeEvent.call(this, event, oldValue);
        }
    }
}
function triggerMaskChangeEvent(event, oldValue) {
    let prevOnChange = this.isProtectedOnChange;
    if (!isNullOrUndefined(this.changeEventArgs) && !this.isInitial) {
        let eventArgs = {};
        this.changeEventArgs = { value: this.element.value, maskedValue: this.element.value, isInteraction: false, isInteracted: false };
        if (this.mask) {
            this.changeEventArgs.value = strippedValue.call(this, this.element);
        }
        if (!isNullOrUndefined(event)) {
            this.changeEventArgs.isInteracted = true;
            this.changeEventArgs.isInteraction = true;
            this.changeEventArgs.event = event;
        }
        this.isProtectedOnChange = true;
        this.value = this.changeEventArgs.value;
        this.isProtectedOnChange = prevOnChange;
        merge(eventArgs, this.changeEventArgs);
        this.trigger('change', eventArgs);
    }
    this.preEleVal = this.element.value;
    this.prevValue = strippedValue.call(this, this.element);
    attributes(this.element, { 'aria-valuenow': this.element.value });
}
function maskInputKeyUpHandler(event) {
    if (this.mask && !this.readonly) {
        let collec;
        if (!this.maskKeyPress && event.keyCode === 229) {
            let oldEventVal;
            if (this.element.value.length === 1) {
                this.element.value = this.element.value + this.promptMask;
                this.element.setSelectionRange(1, 1);
            }
            if (this.element.value.length > this.promptMask.length) {
                let startIndex = this.element.selectionStart;
                let addedValues = this.element.value.length - this.promptMask.length;
                let val = this.element.value.substring(startIndex - addedValues, startIndex);
                if (this.undoCollec.length > 0) {
                    collec = this.undoCollec[this.undoCollec.length - 1];
                    let startIndex = this.element.selectionStart;
                    oldEventVal = collec.value;
                    let oldVal = collec.value.substring(startIndex - addedValues, startIndex);
                    collec = this.redoCollec[0];
                    val = val.trim();
                    let isSpace = Browser.isAndroid && val === '';
                    if (!isSpace && oldVal !== val && collec.value.substring(startIndex - addedValues, startIndex) !== val) {
                        validateValue.call(this, val, event.ctrlKey, event);
                    }
                    else if (isSpace) {
                        preventUnsupportedValues.call(this, event, startIndex - 1, this.element.selectionEnd - 1, val, event.ctrlKey, false);
                    }
                }
                else {
                    oldEventVal = this.promptMask;
                    validateValue.call(this, val, event.ctrlKey, event);
                }
                this.maskKeyPress = false;
                triggerMaskChangeEvent.call(this, event, oldEventVal);
            }
        }
        else {
            removeMaskError.call(this);
        }
        let val = strippedValue.call(this, this.element);
        if (!((this.element.selectionStart === 0) && (this.promptMask === this.element.value) && val === '')
            || (val === '' && this.value !== val)) {
            this.prevValue = val;
            this.value = val;
        }
    }
    else {
        triggerMaskChangeEvent.call(this, event);
    }
    if (this.element.selectionStart === 0 && this.element.selectionEnd === 0) {
        // tslint:disable-next-line
        let temp = this.element;
        setTimeout(() => {
            temp.setSelectionRange(0, 0);
        }, 0);
    }
}
function mobileSwipeCheck(key) {
    if (key.length > 1 && ((this.promptMask.length + key.length) < this.element.value.length)) {
        let elementValue = this.redoCollec[0].value.substring(0, this.redoCollec[0].startIndex) + key +
            this.redoCollec[0].value.substring(this.redoCollec[0].startIndex, this.redoCollec[0].value.length);
        setElementValue.call(this, elementValue);
        this.element.selectionStart = this.element.selectionEnd = this.redoCollec[0].startIndex + key.length;
    }
    this.element.selectionStart = this.element.selectionStart - key.length;
    this.element.selectionEnd = this.element.selectionEnd - key.length;
}
function mobileValidation(key) {
    if (!this.maskKeyPress) {
        mobileSwipeCheck.call(this, key);
    }
}
function validateValue(key, isCtrlKey, event) {
    mobileValidation.call(this, key);
    if (isNullOrUndefined(this) || isNullOrUndefined(key)) {
        return;
    }
    let startIndex = this.element.selectionStart;
    let initStartIndex = startIndex;
    let endIndex = this.element.selectionEnd;
    let curMask;
    let allowText = false;
    let value = this.element.value;
    let eventOldVal;
    let prevSupport = false;
    let isEqualVal = false;
    for (let k = 0; k < key.length; k++) {
        let keyValue = key[k];
        startIndex = this.element.selectionStart;
        endIndex = this.element.selectionEnd;
        if (!this.maskKeyPress && initStartIndex === startIndex) {
            startIndex = startIndex + k;
        }
        if ((!this.maskKeyPress || startIndex < this.promptMask.length)) {
            for (let i = startIndex; i < this.promptMask.length; i++) {
                let maskValue = this.escapeMaskValue;
                curMask = maskValue[startIndex];
                if (this.hiddenMask[startIndex] === '\\' && this.hiddenMask[startIndex + 1] === key) {
                    isEqualVal = true;
                }
                if ((isNullOrUndefined(this.regExpCollec[curMask]) && (isNullOrUndefined(this.customCharacters)
                    || (!isNullOrUndefined(this.customCharacters) && isNullOrUndefined(this.customCharacters[curMask])))
                    && ((this.hiddenMask[startIndex] !== this.promptChar && this.customRegExpCollec[startIndex][0] !== '['
                        && this.customRegExpCollec[startIndex][this.customRegExpCollec[startIndex].length - 1] !== ']')))
                    || ((this.promptMask[startIndex] !== this.promptChar) && isNullOrUndefined(this.customCharacters))
                    || (this.promptChar === curMask && this.escapeMaskValue === this.mask)) {
                    this.element.selectionStart = this.element.selectionEnd = startIndex + 1;
                    startIndex = this.element.selectionStart;
                    curMask = this.hiddenMask[startIndex];
                }
            }
            if (!isNullOrUndefined(this.customCharacters) && !isNullOrUndefined(this.customCharacters[curMask])) {
                let customValStr = this.customCharacters[curMask];
                let customValArr = customValStr.split(',');
                for (let i = 0; i < customValArr.length; i++) {
                    if (keyValue.match(new RegExp('[' + customValArr[i] + ']'))) {
                        allowText = true;
                        break;
                    }
                }
            }
            else if (!isNullOrUndefined(this.regExpCollec[curMask]) && keyValue.match(new RegExp(this.regExpCollec[curMask]))
                && this.promptMask[startIndex] === this.promptChar) {
                allowText = true;
            }
            else if (this.promptMask[startIndex] === this.promptChar && this.customRegExpCollec[startIndex][0] === '['
                && this.customRegExpCollec[startIndex][this.customRegExpCollec[startIndex].length - 1] === ']'
                && keyValue.match(new RegExp(this.customRegExpCollec[startIndex]))) {
                allowText = true;
            }
            if ((!this.maskKeyPress || startIndex < this.hiddenMask.length) && allowText) {
                if (k === 0) {
                    if (this.maskKeyPress) {
                        this.undoCollec.push({ value: value, startIndex: startIndex, endIndex: startIndex });
                    }
                    else {
                        let sIndex = this.element.selectionStart;
                        let eIndex = this.element.selectionEnd;
                        if (this.redoCollec.length > 0) {
                            eventOldVal = this.redoCollec[0].value;
                            setElementValue.call(this, eventOldVal);
                            this.undoCollec.push(this.redoCollec[0]);
                        }
                        else {
                            this.undoCollec.push({ value: this.promptMask, startIndex: startIndex, endIndex: startIndex });
                            eventOldVal = this.promptMask;
                            setElementValue.call(this, eventOldVal);
                        }
                        this.element.selectionStart = sIndex;
                        this.element.selectionEnd = eIndex;
                    }
                }
                startIndex = this.element.selectionStart;
                applySupportedValues.call(this, event, startIndex, keyValue, eventOldVal, isEqualVal);
                prevSupport = true;
                if (k === key.length - 1) {
                    this.redoCollec.unshift({
                        value: this.element.value, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd
                    });
                }
                allowText = false;
            }
            else {
                startIndex = this.element.selectionStart;
                preventUnsupportedValues.call(this, event, startIndex, initStartIndex, key, isCtrlKey, prevSupport);
            }
            if (k === key.length - 1 && !allowText) {
                if (!Browser.isAndroid || (Browser.isAndroid && startIndex < this.promptMask.length)) {
                    this.redoCollec.unshift({
                        value: this.element.value, startIndex: this.element.selectionStart, endIndex: this.element.selectionEnd
                    });
                }
            }
        }
        else {
            if (key.length === 1 && !isCtrlKey && !isNullOrUndefined(event)) {
                addMaskErrorClass.call(this);
            }
        }
    }
}
function applySupportedValues(event, startIndex, keyValue, eventOldVal, isEqualVal) {
    if (this.hiddenMask.length > this.promptMask.length) {
        keyValue = changeToLowerUpperCase.call(this, keyValue, this.element.value);
    }
    if (!isEqualVal) {
        let value = this.element.value;
        let elementValue = value.substring(0, startIndex) + keyValue + value.substring(startIndex + 1, value.length);
        setElementValue.call(this, elementValue);
        this.element.selectionStart = this.element.selectionEnd = startIndex + 1;
    }
}
function preventUnsupportedValues(event, sIdx, idx, key, ctrl, chkSupport) {
    if (!this.maskKeyPress) {
        let eventOldVal;
        let value = this.element.value;
        if (sIdx >= this.promptMask.length) {
            setElementValue.call(this, value.substring(0, sIdx));
        }
        else {
            if (idx === sIdx) {
                setElementValue.call(this, value.substring(0, sIdx) + value.substring(sIdx + 1, value.length));
            }
            else {
                if (this.promptMask.length === this.element.value.length) {
                    setElementValue.call(this, value.substring(0, sIdx) + value.substring(sIdx, value.length));
                }
                else {
                    setElementValue.call(this, value.substring(0, idx) + value.substring(idx + 1, value.length));
                }
            }
            this.element.selectionStart = this.element.selectionEnd = (chkSupport ||
                this.element.value[idx] !== this.promptChar) ? sIdx : idx;
        }
        eventOldVal = this.element.value;
        addMaskErrorClass.call(this);
    }
    if (key.length === 1 && !ctrl && !isNullOrUndefined(event)) {
        addMaskErrorClass.call(this);
    }
}
function addMaskErrorClass() {
    let parentElement = this.element.parentNode;
    let timer = 200;
    if (parentElement.classList.contains(INPUTGROUP) || parentElement.classList.contains(FLOATINPUT)) {
        addClass([parentElement], ERROR$1);
    }
    else {
        addClass([this.element], ERROR$1);
    }
    if (this.isIosInvalid === true) {
        timer = 400;
    }
    attributes(this.element, { 'aria-invalid': 'true' });
    setTimeout(() => {
        if (!this.maskKeyPress) {
            removeMaskError.call(this);
        }
    }, timer);
}
function removeMaskError() {
    let parentElement = this.element.parentNode;
    if (!isNullOrUndefined(parentElement)) {
        removeClass([parentElement], ERROR$1);
    }
    removeClass([this.element], ERROR$1);
    attributes(this.element, { 'aria-invalid': 'false' });
}
/**
 * @hidden
 * Validates user input using masking elements '<' , '>' and '|'.
 */
function changeToLowerUpperCase(key, value) {
    let promptMask;
    let i;
    let curVal = value;
    let caseCount = 0;
    for (i = 0; i < this.hiddenMask.length; i++) {
        if (this.hiddenMask[i] === '\\') {
            promptMask = curVal.substring(0, i) + '\\' + curVal.substring(i, curVal.length);
        }
        if (this.hiddenMask[i] === '>' || this.hiddenMask[i] === '<' || this.hiddenMask[i] === '|') {
            if (this.hiddenMask[i] !== curVal[i]) {
                promptMask = curVal.substring(0, i) + this.hiddenMask[i] + curVal.substring(i, curVal.length);
            }
            ++caseCount;
        }
        if (promptMask) {
            if (((promptMask[i] === this.promptChar) && (i > this.element.selectionStart)) ||
                (this.element.value.indexOf(this.promptChar) < 0 && (this.element.selectionStart + caseCount) === i)) {
                caseCount = 0;
                break;
            }
            curVal = promptMask;
        }
    }
    while (i >= 0 && promptMask) {
        if (i === 0 || promptMask[i - 1] !== '\\') {
            let val = this.element.value;
            if (promptMask[i] === '>') {
                key = key.toUpperCase();
                break;
            }
            else if (promptMask[i] === '<') {
                key = key.toLowerCase();
                break;
            }
            else if (promptMask[i] === '|') {
                break;
            }
        }
        --i;
    }
    return key;
}
/**
 * @hidden
 * To set updated values in the MaskedTextBox.
 */
function setMaskValue(val) {
    if (this.mask && val !== undefined && (this.prevValue === undefined || this.prevValue !== val)) {
        this.maskKeyPress = true;
        setElementValue.call(this, this.promptMask);
        if (val !== '' && !(val === null && this.floatLabelType === 'Never' && this.placeholder)) {
            this.element.selectionStart = 0;
            this.element.selectionEnd = 0;
        }
        if (val !== null) {
            for (let i = 0; i < val.length; i++) {
                validateValue.call(this, val[i], false, null);
            }
        }
        let newVal = strippedValue.call(this, this.element);
        this.prevValue = newVal;
        this.value = newVal;
        triggerMaskChangeEvent.call(this, null, null);
        this.maskKeyPress = false;
        let labelElement = this.element.parentNode.querySelector('.e-float-text');
        if (this.element.value === this.promptMask && this.floatLabelType === 'Auto' && this.placeholder &&
            !isNullOrUndefined(labelElement) && labelElement.classList.contains(TOPLABEL) && !this.isFocus) {
            removeClass([labelElement], TOPLABEL);
            addClass([labelElement], BOTTOMLABEL);
            setElementValue.call(this, '');
        }
    }
    if (this.mask === null || this.mask === '' && this.value !== undefined) {
        setElementValue.call(this, this.value);
    }
}
/**
 * @hidden
 * To set updated values in the input element.
 */
function setElementValue(val, element) {
    if (!this.isFocus && this.floatLabelType === 'Auto' && this.placeholder && isNullOrUndefined(this.value)) {
        val = '';
    }
    let value = strippedValue.call(this, (element ? element : this.element), val);
    if (value === null || value === '') {
        Input.setValue(val, (element ? element : this.element), this.floatLabelType, false);
        if (this.showClearButton) {
            this.inputObj.clearButton.classList.add('e-clear-icon-hide');
        }
    }
    else {
        Input.setValue(val, (element ? element : this.element), this.floatLabelType, this.showClearButton);
    }
}
/**
 * @hidden
 * Provide mask support to input textbox through utility method.
 */
function maskInput(args) {
    let inputEle = getMaskInput(args);
    applyMask.call(inputEle);
    let val = strippedValue.call(this, this.element);
    this.prevValue = val;
    this.value = val;
    if (args.mask) {
        unwireEvents.call(inputEle);
        wireEvents.call(inputEle);
    }
}
function getMaskInput(args) {
    addClass([args.element], UTILMASK);
    let inputEle = {
        element: args.element,
        mask: args.mask,
        promptMask: '',
        hiddenMask: '',
        escapeMaskValue: '',
        promptChar: args.promptChar ? (args.promptChar.length > 1) ? args.promptChar = args.promptChar[0]
            : args.promptChar : '_',
        value: args.value ? args.value : null,
        regExpCollec: regularExpressions,
        customRegExpCollec: [],
        customCharacters: args.customCharacters,
        undoCollec: [],
        redoCollec: [],
        maskKeyPress: false,
        prevValue: ''
    };
    createMask.call(inputEle);
    return inputEle;
}
/**
 * @hidden
 * Gets raw value of the textbox which has been masked through utility method.
 */
function getVal(args) {
    return strippedValue.call(getUtilMaskEle(args), args.element);
}
/**
 * @hidden
 * Gets masked value of the textbox which has been masked through utility method.
 */
function getMaskedVal(args) {
    return unstrippedValue.call(getUtilMaskEle(args), args.element);
}
function getUtilMaskEle(args) {
    let inputEle;
    if (!isNullOrUndefined(args) && args.element.classList.contains(UTILMASK)) {
        inputEle = getMaskInput(args);
    }
    return inputEle;
}
/**
 * @hidden
 * Arguments to perform undo and redo functionalities.
 */
class MaskUndo {
}

/**
 * MaskedTextbox base modules
 */

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const ROOT$1 = 'e-widget e-control-wrapper e-mask';
const INPUT = 'e-input';
const COMPONENT$1 = 'e-maskedtextbox';
const CONTROL$1 = 'e-control';
const MASKINPUT_FOCUS = 'e-input-focus';
const wrapperAttr = ['title', 'style', 'class'];
/**
 * The MaskedTextBox allows the user to enter the valid input only based on the provided mask.
 * ```html
 * <input id="mask" type="text" />
 * ```
 * ```typescript
 * <script>
 * var maskObj = new MaskedTextBox({ mask: "(999) 9999-999" });
 * maskObj.appendTo('#mask');
 * </script>
 * ```
 */
let MaskedTextBox = class MaskedTextBox extends Component {
    constructor(options, element) {
        super(options, element);
        this.initInputValue = '';
        this.maskOptions = options;
    }
    /**
     * Gets the component name
     * @private
     */
    getModuleName() {
        return 'maskedtextbox';
    }
    /**
     * Initializes the event handler
     * @private
     */
    preRender() {
        this.promptMask = '';
        this.hiddenMask = '';
        this.escapeMaskValue = '';
        this.regExpCollec = regularExpressions;
        this.customRegExpCollec = [];
        this.undoCollec = [];
        this.redoCollec = [];
        this.changeEventArgs = {};
        this.focusEventArgs = {};
        this.blurEventArgs = {};
        this.maskKeyPress = false;
        this.isFocus = false;
        this.isInitial = false;
        this.isIosInvalid = false;
        let ejInstance = getValue('ej2_instances', this.element);
        this.cloneElement = this.element.cloneNode(true);
        removeClass([this.cloneElement], [CONTROL$1, COMPONENT$1, 'e-lib']);
        this.angularTagName = null;
        this.formElement = closest(this.element, 'form');
        if (this.element.tagName === 'EJS-MASKEDTEXTBOX') {
            this.angularTagName = this.element.tagName;
            let input = this.createElement('input');
            for (let i = 0; i < this.element.attributes.length; i++) {
                input.setAttribute(this.element.attributes[i].nodeName, this.element.attributes[i].nodeValue);
                input.innerHTML = this.element.innerHTML;
            }
            if (this.element.hasAttribute('id')) {
                this.element.removeAttribute('id');
            }
            this.element.classList.remove('e-control', 'e-maskedtextbox');
            this.element.classList.add('e-mask-container');
            this.element.appendChild(input);
            this.element = input;
            setValue('ej2_instances', ejInstance, this.element);
        }
        this.updateHTMLAttrToElement();
        this.checkHtmlAttributes(false);
        if (this.formElement) {
            this.initInputValue = this.value;
        }
    }
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    getPersistData() {
        let keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Initializes the component rendering.
     * @private
     */
    render() {
        if (this.element.tagName.toLowerCase() === 'input') {
            if (this.floatLabelType === 'Never') {
                addClass([this.element], INPUT);
            }
            this.createWrapper();
            this.updateHTMLAttrToWrapper();
            if (this.element.name === '') {
                this.element.setAttribute('name', this.element.id);
            }
            this.isInitial = true;
            this.resetMaskedTextBox();
            this.isInitial = false;
            this.setMaskPlaceholder(true, false);
            this.setWidth(this.width);
            this.preEleVal = this.element.value;
            if (!Browser.isDevice && (Browser.info.version === '11.0' || Browser.info.name === 'edge')) {
                this.element.blur();
            }
            if (this.element.getAttribute('value') || this.value) {
                this.element.setAttribute('value', this.element.value);
            }
            this.renderComplete();
        }
    }
    updateHTMLAttrToElement() {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (let key of Object.keys(this.htmlAttributes)) {
                if (wrapperAttr.indexOf(key) < 0) {
                    this.element.setAttribute(key, this.htmlAttributes[key]);
                }
            }
        }
    }
    updateHTMLAttrToWrapper() {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (let key of Object.keys(this.htmlAttributes)) {
                if (wrapperAttr.indexOf(key) > -1) {
                    if (key === 'class') {
                        addClass([this.inputObj.container], this.htmlAttributes[key].split(' '));
                    }
                    else if (key === 'style') {
                        let maskStyle = this.inputObj.container.getAttribute(key);
                        maskStyle = !isNullOrUndefined(maskStyle) ? (maskStyle + this.htmlAttributes[key]) :
                            this.htmlAttributes[key];
                        this.inputObj.container.setAttribute(key, maskStyle);
                    }
                    else {
                        this.inputObj.container.setAttribute(key, this.htmlAttributes[key]);
                    }
                }
            }
        }
    }
    resetMaskedTextBox() {
        this.promptMask = '';
        this.hiddenMask = '';
        this.escapeMaskValue = '';
        this.customRegExpCollec = [];
        this.undoCollec = [];
        this.redoCollec = [];
        if (this.promptChar.length > 1) {
            this.promptChar = this.promptChar[0];
        }
        createMask.call(this);
        applyMask.call(this);
        if (this.mask === null || this.mask === '' && this.value !== undefined) {
            setElementValue.call(this, this.value);
        }
        let val = strippedValue.call(this, this.element);
        this.prevValue = val;
        this.value = val;
        if (!this.isInitial) {
            unwireEvents.call(this);
        }
        wireEvents.call(this);
    }
    setMaskPlaceholder(setVal, dynamicPlaceholder) {
        if (dynamicPlaceholder || this.placeholder) {
            Input.setPlaceholder(this.placeholder, this.element);
            if (this.element.value === this.promptMask && setVal && this.floatLabelType !== 'Always') {
                setElementValue.call(this, '');
            }
            if (this.floatLabelType === 'Never') {
                maskInputBlurHandler.call(this);
            }
        }
    }
    setWidth(width) {
        if (!isNullOrUndefined(width)) {
            this.element.style.width = formatUnit(width);
            this.inputObj.container.style.width = formatUnit(width);
        }
    }
    checkHtmlAttributes(isDynamic) {
        let attributes$$1 = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes)
            : ['placeholder', 'disabled', 'value', 'readonly'];
        for (let key of attributes$$1) {
            if (!isNullOrUndefined(this.element.getAttribute(key))) {
                switch (key) {
                    case 'placeholder':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.maskOptions) || (this.maskOptions['placeholder'] === undefined)) || isDynamic) {
                            this.setProperties({ placeholder: this.element.placeholder }, !isDynamic);
                        }
                        break;
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.maskOptions) || (this.maskOptions['enabled'] === undefined)) || isDynamic) {
                            let enabled = this.element.getAttribute(key) === 'disabled' || this.element.getAttribute(key) === '' ||
                                this.element.getAttribute(key) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, !isDynamic);
                        }
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.maskOptions) || (this.maskOptions['value'] === undefined)) || isDynamic) {
                            this.setProperties({ value: this.element.value }, !isDynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.maskOptions) || (this.maskOptions['readonly'] === undefined)) || isDynamic) {
                            let readonly = this.element.getAttribute(key) === 'readonly' || this.element.getAttribute(key) === ''
                                || this.element.getAttribute(key) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !isDynamic);
                        }
                        break;
                }
            }
        }
    }
    createWrapper() {
        this.inputObj = Input.createInput({
            element: this.element,
            floatLabelType: this.floatLabelType,
            properties: {
                enableRtl: this.enableRtl,
                cssClass: this.cssClass,
                enabled: this.enabled,
                readonly: this.readonly,
                placeholder: this.placeholder,
                showClearButton: this.showClearButton
            }
        }, this.createElement);
        this.inputObj.container.setAttribute('class', ROOT$1 + ' ' + this.inputObj.container.getAttribute('class'));
    }
    /**
     * Calls internally if any of the property value is changed.
     * @hidden
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'value':
                    setMaskValue.call(this, this.value);
                    if (this.placeholder) {
                        this.setMaskPlaceholder(false, false);
                    }
                    break;
                case 'placeholder':
                    this.setMaskPlaceholder(true, true);
                    break;
                case 'width':
                    this.setWidth(newProp.width);
                    break;
                case 'cssClass':
                    Input.setCssClass(newProp.cssClass, [this.inputObj.container], oldProp.cssClass);
                    break;
                case 'enabled':
                    Input.setEnabled(newProp.enabled, this.element);
                    break;
                case 'readonly':
                    Input.setReadonly(newProp.readonly, this.element);
                    break;
                case 'enableRtl':
                    Input.setEnableRtl(newProp.enableRtl, [this.inputObj.container]);
                    break;
                case 'customCharacters':
                    this.customCharacters = newProp.customCharacters;
                    this.resetMaskedTextBox();
                    break;
                case 'showClearButton':
                    Input.setClearButton(newProp.showClearButton, this.element, this.inputObj, undefined, this.createElement);
                    bindClearEvent.call(this);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    Input.removeFloating(this.inputObj);
                    Input.addFloating(this.element, this.floatLabelType, this.placeholder, this.createElement);
                    break;
                case 'htmlAttributes':
                    this.updateHTMLAttrToElement();
                    this.updateHTMLAttrToWrapper();
                    this.checkHtmlAttributes(true);
                    break;
                case 'mask':
                    let strippedValue$$1 = this.value;
                    this.mask = newProp.mask;
                    this.updateValue(strippedValue$$1);
                    break;
                case 'promptChar':
                    if (newProp.promptChar.length > 1) {
                        newProp.promptChar = newProp.promptChar[0];
                    }
                    if (newProp.promptChar) {
                        this.promptChar = newProp.promptChar;
                    }
                    else {
                        this.promptChar = '_';
                    }
                    let value = this.element.value.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                    if (this.promptMask === this.element.value) {
                        value = this.promptMask.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                    }
                    this.promptMask = this.promptMask.replace(new RegExp('[' + oldProp.promptChar + ']', 'g'), this.promptChar);
                    this.undoCollec = this.redoCollec = [];
                    setElementValue.call(this, value);
                    break;
            }
        }
    }
    updateValue(strippedVal) {
        this.resetMaskedTextBox();
        setMaskValue.call(this, strippedVal);
    }
    /**
     * Gets the value of the MaskedTextBox with the masked format.
     * By using `value` property, you can get the raw value of maskedtextbox without literals and prompt characters.
     * @return {string}
     */
    getMaskedValue() {
        return unstrippedValue.call(this, this.element);
    }
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    focusIn() {
        if (document.activeElement !== this.element && this.enabled) {
            this.element.focus();
            addClass([this.inputObj.container], [MASKINPUT_FOCUS]);
        }
    }
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    focusOut() {
        if (document.activeElement === this.element && this.enabled) {
            this.element.blur();
            removeClass([this.inputObj.container], [MASKINPUT_FOCUS]);
        }
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    destroy() {
        unwireEvents.call(this);
        let attrArray = ['aria-labelledby', 'role', 'autocomplete', 'aria-readonly',
            'autocorrect', 'aria-disabled', 'aria-placeholder', 'autocapitalize',
            'spellcheck', 'aria-autocomplete',
            'aria-live', 'aria-valuenow', 'aria-invalid'];
        attrArray.forEach((value) => {
            this.element.removeAttribute(value);
        });
        this.element.classList.remove('e-input');
        this.inputObj.container.insertAdjacentElement('afterend', this.element);
        detach(this.inputObj.container);
        super.destroy();
    }
};
__decorate$1([
    Property(null)
], MaskedTextBox.prototype, "cssClass", void 0);
__decorate$1([
    Property(null)
], MaskedTextBox.prototype, "width", void 0);
__decorate$1([
    Property(null)
], MaskedTextBox.prototype, "placeholder", void 0);
__decorate$1([
    Property('Never')
], MaskedTextBox.prototype, "floatLabelType", void 0);
__decorate$1([
    Property({})
], MaskedTextBox.prototype, "htmlAttributes", void 0);
__decorate$1([
    Property(true)
], MaskedTextBox.prototype, "enabled", void 0);
__decorate$1([
    Property(false)
], MaskedTextBox.prototype, "readonly", void 0);
__decorate$1([
    Property(false)
], MaskedTextBox.prototype, "showClearButton", void 0);
__decorate$1([
    Property(false)
], MaskedTextBox.prototype, "enablePersistence", void 0);
__decorate$1([
    Property(null)
], MaskedTextBox.prototype, "mask", void 0);
__decorate$1([
    Property('_')
], MaskedTextBox.prototype, "promptChar", void 0);
__decorate$1([
    Property(null)
], MaskedTextBox.prototype, "value", void 0);
__decorate$1([
    Property(null)
], MaskedTextBox.prototype, "customCharacters", void 0);
__decorate$1([
    Event()
], MaskedTextBox.prototype, "created", void 0);
__decorate$1([
    Event()
], MaskedTextBox.prototype, "destroyed", void 0);
__decorate$1([
    Event()
], MaskedTextBox.prototype, "change", void 0);
__decorate$1([
    Event()
], MaskedTextBox.prototype, "focus", void 0);
__decorate$1([
    Event()
], MaskedTextBox.prototype, "blur", void 0);
MaskedTextBox = __decorate$1([
    NotifyPropertyChanges
], MaskedTextBox);

/**
 * MaskedTextbox modules
 */

/**
 * MaskedTextbox modules
 */

/**
 * Input box Component
 */

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the ticks data of the Slider.
 */
class TicksData extends ChildProperty {
}
__decorate$2([
    Property('None')
], TicksData.prototype, "placement", void 0);
__decorate$2([
    Property(10)
], TicksData.prototype, "largeStep", void 0);
__decorate$2([
    Property(1)
], TicksData.prototype, "smallStep", void 0);
__decorate$2([
    Property(false)
], TicksData.prototype, "showSmallTicks", void 0);
__decorate$2([
    Property(null)
], TicksData.prototype, "format", void 0);
/**
 * It illustrates the limit data in slider.
 */
class LimitData extends ChildProperty {
}
__decorate$2([
    Property(false)
], LimitData.prototype, "enabled", void 0);
__decorate$2([
    Property(null)
], LimitData.prototype, "minStart", void 0);
__decorate$2([
    Property(null)
], LimitData.prototype, "minEnd", void 0);
__decorate$2([
    Property(null)
], LimitData.prototype, "maxStart", void 0);
__decorate$2([
    Property(null)
], LimitData.prototype, "maxEnd", void 0);
__decorate$2([
    Property(false)
], LimitData.prototype, "startHandleFixed", void 0);
__decorate$2([
    Property(false)
], LimitData.prototype, "endHandleFixed", void 0);
/**
 * It illustrates the tooltip data in slider.
 */
class TooltipData extends ChildProperty {
}
__decorate$2([
    Property('')
], TooltipData.prototype, "cssClass", void 0);
__decorate$2([
    Property('Before')
], TooltipData.prototype, "placement", void 0);
__decorate$2([
    Property('Focus')
], TooltipData.prototype, "showOn", void 0);
__decorate$2([
    Property(false)
], TooltipData.prototype, "isVisible", void 0);
__decorate$2([
    Property(null)
], TooltipData.prototype, "format", void 0);
const bootstrapTooltipOffset = 6;
const bootstrap4TooltipOffset = 3;
const classNames = {
    root: 'e-slider',
    rtl: 'e-rtl',
    sliderHiddenInput: 'e-slider-input',
    controlWrapper: 'e-control-wrapper',
    sliderHandle: 'e-handle',
    rangeBar: 'e-range',
    sliderButton: 'e-slider-button',
    firstButton: 'e-first-button',
    secondButton: 'e-second-button',
    scale: 'e-scale',
    tick: 'e-tick',
    large: 'e-large',
    tickValue: 'e-tick-value',
    sliderTooltip: 'e-slider-tooltip',
    sliderHover: 'e-slider-hover',
    sliderFirstHandle: 'e-handle-first',
    sliderSecondHandle: 'e-handle-second',
    sliderDisabled: 'e-disabled',
    sliderContainer: 'e-slider-container',
    horizontalTooltipBefore: 'e-slider-horizontal-before',
    horizontalTooltipAfter: 'e-slider-horizontal-after',
    verticalTooltipBefore: 'e-slider-vertical-before',
    verticalTooltipAfter: 'e-slider-vertical-after',
    materialTooltip: 'e-material-tooltip',
    materialTooltipOpen: 'e-material-tooltip-open',
    materialTooltipActive: 'e-tooltip-active',
    materialSlider: 'e-material-slider',
    sliderTrack: 'e-slider-track',
    sliderHandleFocused: 'e-handle-focused',
    verticalSlider: 'e-vertical',
    horizontalSlider: 'e-horizontal',
    sliderHandleStart: 'e-handle-start',
    sliderTooltipStart: 'e-material-tooltip-start',
    sliderTabHandle: 'e-tab-handle',
    sliderButtonIcon: 'e-button-icon',
    sliderSmallSize: 'e-small-size',
    sliderTickPosition: 'e-tick-pos',
    sliderFirstTick: 'e-first-tick',
    sliderLastTick: 'e-last-tick',
    sliderButtonClass: 'e-slider-btn',
    sliderTooltipWrapper: 'e-tooltip-wrap',
    sliderTabTrack: 'e-tab-track',
    sliderTabRange: 'e-tab-range',
    sliderActiveHandle: 'e-handle-active',
    sliderMaterialHandle: 'e-material-handle',
    sliderMaterialRange: 'e-material-range',
    sliderMaterialDefault: 'e-material-default',
    materialTooltipShow: 'e-material-tooltip-show',
    materialTooltipHide: 'e-material-tooltip-hide',
    readonly: 'e-read-only',
    limits: 'e-limits',
    limitBarDefault: 'e-limit-bar',
    limitBarFirst: 'e-limit-first',
    limitBarSecond: 'e-limit-second',
    dragHorizontal: 'e-drag-horizontal',
    dragVertical: 'e-drag-vertical'
};
/**
 * The Slider component allows the user to select a value or range
 * of values in-between a min and max range, by dragging the handle over the slider bar.
 * ```html
 * <div id='slider'></div>
 * ```
 * ```typescript
 * <script>
 *   var sliderObj = new Slider({ value: 10 });
 *   sliderObj.appendTo('#slider');
 * </script>
 * ```
 */
let Slider = class Slider extends Component {
    constructor(options, element) {
        super(options, element);
        this.horDir = 'left';
        this.verDir = 'bottom';
        this.transition = {
            handle: 'left .4s cubic-bezier(.25, .8, .25, 1), right .4s cubic-bezier(.25, .8, .25, 1), ' +
                'top .4s cubic-bezier(.25, .8, .25, 1) , bottom .4s cubic-bezier(.25, .8, .25, 1)',
            rangeBar: 'all .4s cubic-bezier(.25, .8, .25, 1)'
        };
        this.transitionOnMaterialTooltip = {
            handle: 'left 1ms ease-out, right 1ms ease-out, bottom 1ms ease-out, top 1ms ease-out',
            rangeBar: 'left 1ms ease-out, right 1ms ease-out, bottom 1ms ease-out, width 1ms ease-out, height 1ms ease-out'
        };
        this.scaleTransform = 'transform .4s cubic-bezier(.25, .8, .25, 1)';
        this.customAriaText = null;
        this.drag = true;
    }
    preRender() {
        let localeText = { incrementTitle: 'Increase', decrementTitle: 'Decrease' };
        this.l10n = new L10n('slider', localeText, this.locale);
        this.isElementFocused = false;
        this.tickElementCollection = [];
        this.tooltipFormatInfo = {};
        this.ticksFormatInfo = {};
        this.initCultureInfo();
        this.initCultureFunc();
        this.formChecker();
    }
    formChecker() {
        const formElement = closest(this.element, 'form');
        if (formElement) {
            this.isForm = true;
            // this condition needs to be checked, if the slider is going to be refreshed by `refresh()`
            // then we need to revert the slider `value` back to `formResetValue` to preserve the initial value
            if (!isNullOrUndefined(this.formResetValue)) {
                this.setProperties({ 'value': this.formResetValue }, true);
            }
            this.formResetValue = this.value;
            if (this.type === 'Range' &&
                (isNullOrUndefined(this.formResetValue) || typeof (this.formResetValue) !== 'object')) {
                this.formResetValue = [parseFloat(formatUnit(this.min)), parseFloat(formatUnit(this.max))];
            }
            else if (isNullOrUndefined(this.formResetValue)) {
                this.formResetValue = parseFloat(formatUnit(this.min));
            }
            this.formElement = formElement;
        }
        else {
            this.isForm = false;
        }
    }
    initCultureFunc() {
        this.internationalization = new Internationalization(this.locale);
    }
    initCultureInfo() {
        this.tooltipFormatInfo.format = (!isNullOrUndefined(this.tooltip.format)) ? this.tooltip.format : null;
        this.ticksFormatInfo.format = (!isNullOrUndefined(this.ticks.format)) ? this.ticks.format : null;
    }
    formatString(value, formatInfo) {
        let formatValue = null;
        let formatString = null;
        if ((value || value === 0)) {
            formatValue = this.formatNumber(value);
            let numberOfDecimals = this.numberOfDecimals(value);
            formatString = this.internationalization.getNumberFormat(formatInfo)(this.makeRoundNumber(value, numberOfDecimals));
        }
        return { elementVal: formatValue, formatString: formatString };
    }
    ;
    formatNumber(value) {
        let numberOfDecimals = this.numberOfDecimals(value);
        return this.internationalization.getNumberFormat({
            maximumFractionDigits: numberOfDecimals,
            minimumFractionDigits: numberOfDecimals, useGrouping: false
        })(value);
    }
    ;
    numberOfDecimals(value) {
        let decimalPart = value.toString().split('.')[1];
        let numberOfDecimals = !decimalPart || !decimalPart.length ? 0 : decimalPart.length;
        return numberOfDecimals;
    }
    makeRoundNumber(value, precision) {
        let decimals = precision || 0;
        return Number(value.toFixed(decimals));
    }
    ;
    fractionalToInteger(value) {
        value = (this.numberOfDecimals(value) === 0) ? Number(value).toFixed(this.noOfDecimals) : value;
        let tens = 1;
        for (let i = 0; i < this.noOfDecimals; i++) {
            tens *= 10;
        }
        value = Number((value * tens).toFixed(0));
        return value;
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    render() {
        this.initialize();
        this.initRender();
        this.wireEvents();
        this.setZindex();
        this.renderComplete();
    }
    initialize() {
        addClass([this.element], classNames.root);
        this.setCSSClass();
    }
    setCSSClass(oldCSSClass) {
        if (oldCSSClass) {
            removeClass([this.element], oldCSSClass.split(' '));
        }
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
    }
    setEnabled() {
        if (!this.enabled) {
            addClass([this.sliderContainer], [classNames.sliderDisabled]);
            if (this.tooltip.isVisible && this.tooltipElement && this.tooltip.showOn === 'Always') {
                this.tooltipElement.classList.add(classNames.sliderDisabled);
            }
            this.unwireEvents();
        }
        else {
            removeClass([this.sliderContainer], [classNames.sliderDisabled]);
            if (this.tooltip.isVisible && this.tooltipElement && this.tooltip.showOn === 'Always') {
                this.tooltipElement.classList.remove(classNames.sliderDisabled);
            }
            this.wireEvents();
        }
    }
    getTheme(container) {
        let theme = window.getComputedStyle(container, ':after').getPropertyValue('content');
        return theme.replace(/['"]+/g, '');
    }
    /**
     * Initialize the rendering
     * @private
     */
    initRender() {
        this.sliderContainer = this.createElement('div', { className: classNames.sliderContainer + ' ' + classNames.controlWrapper });
        this.element.parentNode.insertBefore(this.sliderContainer, this.element);
        this.sliderContainer.appendChild(this.element);
        this.sliderTrack = this.createElement('div', { className: classNames.sliderTrack });
        this.element.appendChild(this.sliderTrack);
        this.element.tabIndex = -1;
        this.getThemeInitialization();
        this.setHandler();
        this.createRangeBar();
        if (this.limits.enabled) {
            this.createLimitBar();
        }
        this.setOrientClass();
        this.hiddenInput = (this.createElement('input', {
            attrs: {
                type: 'hidden', value: (isNullOrUndefined(this.value) ? this.min.toString() : this.value.toString()),
                name: this.element.getAttribute('name') || this.element.getAttribute('id') ||
                    '_' + (Math.random() * 1000).toFixed(0) + 'slider', class: classNames.sliderHiddenInput
            }
        }));
        this.hiddenInput.tabIndex = -1;
        this.sliderContainer.appendChild(this.hiddenInput);
        if (this.showButtons) {
            this.setButtons();
        }
        this.setEnableRTL();
        if (this.type === 'Range') {
            this.rangeValueUpdate();
        }
        else {
            this.value = isNullOrUndefined(this.value) ? parseFloat(formatUnit(this.min.toString())) : this.value;
        }
        this.previousVal = this.type !== 'Range' ? this.checkHandleValue(parseFloat(formatUnit(this.value.toString()))) :
            [this.checkHandleValue(parseFloat(formatUnit(this.value[0].toString()))),
                this.checkHandleValue(parseFloat(formatUnit(this.value[1].toString())))];
        this.previousChanged = this.previousVal;
        if (!isNullOrUndefined(this.element.hasAttribute('name'))) {
            this.element.removeAttribute('name');
        }
        this.setValue();
        if (this.limits.enabled) {
            this.setLimitBar();
        }
        if (this.ticks.placement !== 'None') {
            this.renderScale();
        }
        if (this.tooltip.isVisible) {
            this.renderTooltip();
        }
        if (!this.enabled) {
            addClass([this.sliderContainer], [classNames.sliderDisabled]);
        }
        else {
            removeClass([this.sliderContainer], [classNames.sliderDisabled]);
        }
        if (this.readonly) {
            addClass([this.sliderContainer], [classNames.readonly]);
        }
        else {
            removeClass([this.sliderContainer], [classNames.readonly]);
        }
    }
    getThemeInitialization() {
        this.isMaterial = this.getTheme(this.sliderContainer) === 'material'
            || this.getTheme(this.sliderContainer) === 'material-dark';
        this.isBootstrap = this.getTheme(this.sliderContainer) === 'bootstrap'
            || this.getTheme(this.sliderContainer) === 'bootstrap-dark';
        this.isBootstrap4 = this.getTheme(this.sliderContainer) === 'bootstrap4';
        this.isMaterialTooltip = this.isMaterial && this.type !== 'Range' && this.tooltip.isVisible;
    }
    createRangeBar() {
        if (this.type !== 'Default') {
            this.rangeBar = (this.createElement('div', { attrs: { class: classNames.rangeBar } }));
            this.element.appendChild(this.rangeBar);
            if (this.drag && this.type === 'Range') {
                if (this.orientation === 'Horizontal') {
                    this.rangeBar.classList.add(classNames.dragHorizontal);
                }
                else {
                    this.rangeBar.classList.add(classNames.dragVertical);
                }
            }
        }
    }
    createLimitBar() {
        let firstElementClassName = this.type !== 'Range' ? classNames.limitBarDefault :
            classNames.limitBarFirst;
        firstElementClassName += ' ' + classNames.limits;
        this.limitBarFirst = (this.createElement('div', {
            attrs: { class: firstElementClassName }
        }));
        this.element.appendChild(this.limitBarFirst);
        if (this.type === 'Range') {
            this.limitBarSecond = (this.createElement('div', {
                attrs: {
                    class: classNames.limitBarSecond + ' ' + classNames.limits
                }
            }));
            this.element.appendChild(this.limitBarSecond);
        }
    }
    setOrientClass() {
        if (this.orientation !== 'Vertical') {
            this.sliderContainer.classList.remove(classNames.verticalSlider);
            this.sliderContainer.classList.add(classNames.horizontalSlider);
            this.firstHandle.setAttribute('aria-orientation', 'horizontal');
            if (this.type === 'Range') {
                this.secondHandle.setAttribute('aria-orientation', 'horizontal');
            }
        }
        else {
            this.sliderContainer.classList.remove(classNames.horizontalSlider);
            this.sliderContainer.classList.add(classNames.verticalSlider);
            this.firstHandle.setAttribute('aria-orientation', 'vertical');
            if (this.type === 'Range') {
                this.secondHandle.setAttribute('aria-orientation', 'vertical');
            }
        }
    }
    setAriaAttributes(element) {
        let min = this.min;
        let max = this.max;
        if (!isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            min = this.customValues[0];
            max = this.customValues[this.customValues.length - 1];
        }
        if (this.type !== 'Range') {
            attributes(element, {
                'aria-valuemin': min.toString(), 'aria-valuemax': max.toString()
            });
        }
        else {
            let range = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
                [[min.toString(), (this.customValues[this.value[1]]).toString()],
                    [(this.customValues[this.value[0]]).toString(), max.toString()]] :
                [[min.toString(), this.value[1].toString()], [this.value[0].toString(), max.toString()]];
            range.forEach((range, index) => {
                let element = index === 0 ? this.firstHandle : this.secondHandle;
                if (element) {
                    attributes(element, {
                        'aria-valuemin': range[0], 'aria-valuemax': range[1]
                    });
                }
            });
        }
    }
    createSecondHandle() {
        this.secondHandle = this.createElement('div', {
            attrs: {
                class: classNames.sliderHandle, 'role': 'slider', 'aria-labelledby': this.element.id + '_title', tabIndex: '0'
            }
        });
        this.secondHandle.classList.add(classNames.sliderSecondHandle);
        this.element.appendChild(this.secondHandle);
    }
    createFirstHandle() {
        this.firstHandle = this.createElement('div', {
            attrs: {
                class: classNames.sliderHandle, 'role': 'slider', 'aria-labelledby': this.element.id + '_title', tabIndex: '0'
            }
        });
        this.firstHandle.classList.add(classNames.sliderFirstHandle);
        this.element.appendChild(this.firstHandle);
        if (this.isMaterialTooltip) {
            this.materialHandle = this.createElement('div', {
                attrs: {
                    class: classNames.sliderHandle + ' ' +
                        classNames.sliderMaterialHandle
                }
            });
            this.element.appendChild(this.materialHandle);
        }
    }
    wireFirstHandleEvt(destroy) {
        if (!destroy) {
            EventHandler.add(this.firstHandle, 'mousedown touchstart', this.handleFocus, this);
            EventHandler.add(this.firstHandle, 'transitionend', this.transitionEnd, this);
            EventHandler.add(this.firstHandle, 'mouseenter touchenter', this.handleOver, this);
            EventHandler.add(this.firstHandle, 'mouseleave touchend', this.handleLeave, this);
        }
        else {
            EventHandler.remove(this.firstHandle, 'mousedown touchstart', this.handleFocus);
            EventHandler.remove(this.firstHandle, 'transitionend', this.transitionEnd);
            EventHandler.remove(this.firstHandle, 'mouseenter touchenter', this.handleOver);
            EventHandler.remove(this.firstHandle, 'mouseleave touchend', this.handleLeave);
        }
    }
    wireSecondHandleEvt(destroy) {
        if (!destroy) {
            EventHandler.add(this.secondHandle, 'mousedown touchstart', this.handleFocus, this);
            EventHandler.add(this.secondHandle, 'transitionend', this.transitionEnd, this);
            EventHandler.add(this.secondHandle, 'mouseenter touchenter', this.handleOver, this);
            EventHandler.add(this.secondHandle, 'mouseleave touchend', this.handleLeave, this);
        }
        else {
            EventHandler.remove(this.secondHandle, 'mousedown touchstart', this.handleFocus);
            EventHandler.remove(this.secondHandle, 'transitionend', this.transitionEnd);
            EventHandler.remove(this.secondHandle, 'mouseenter touchenter', this.handleOver);
            EventHandler.remove(this.secondHandle, 'mouseleave touchend', this.handleLeave);
        }
    }
    handleStart() {
        if (this.type !== 'Range') {
            this.firstHandle.classList[this.handlePos1 === 0 ? 'add' : 'remove'](classNames.sliderHandleStart);
            if (this.isMaterialTooltip) {
                this.materialHandle.classList[this.handlePos1 === 0 ? 'add' : 'remove'](classNames.sliderHandleStart);
                if (this.tooltipElement) {
                    this.tooltipElement.classList[this.handlePos1 === 0 ? 'add' : 'remove'](classNames.sliderTooltipStart);
                }
            }
        }
    }
    transitionEnd(e) {
        if (e.propertyName !== 'transform') {
            this.handleStart();
            this.getHandle().style.transition = 'none';
            if (this.type !== 'Default') {
                this.rangeBar.style.transition = 'none';
            }
            if (this.isMaterial && this.tooltip.isVisible && this.type === 'Default') {
                this.tooltipElement.style.transition = this.transition.handle;
            }
            this.tooltipToggle(this.getHandle());
            this.closeTooltip();
        }
    }
    handleFocusOut() {
        if (this.firstHandle.classList.contains(classNames.sliderHandleFocused)) {
            this.firstHandle.classList.remove(classNames.sliderHandleFocused);
        }
        if (this.type === 'Range') {
            if (this.secondHandle.classList.contains(classNames.sliderHandleFocused)) {
                this.secondHandle.classList.remove(classNames.sliderHandleFocused);
            }
        }
    }
    handleFocus(e) {
        if (e.currentTarget === this.firstHandle) {
            this.firstHandle.classList.add(classNames.sliderHandleFocused);
        }
        else {
            this.secondHandle.classList.add(classNames.sliderHandleFocused);
        }
    }
    handleOver(e) {
        if (this.tooltip.isVisible && this.tooltip.showOn === 'Hover') {
            this.tooltipToggle(e.currentTarget);
        }
    }
    handleLeave(e) {
        if (this.tooltip.isVisible && this.tooltip.showOn === 'Hover' &&
            !e.currentTarget.classList.contains(classNames.sliderHandleFocused) &&
            !e.currentTarget.classList.contains(classNames.sliderTabHandle)) {
            this.closeTooltip();
        }
    }
    setHandler() {
        if (this.min > this.max) {
            this.min = this.max;
        }
        this.createFirstHandle();
        if (this.type === 'Range') {
            this.createSecondHandle();
        }
    }
    setEnableRTL() {
        this.enableRtl && this.orientation !== 'Vertical' ? addClass([this.sliderContainer], classNames.rtl) :
            removeClass([this.sliderContainer], classNames.rtl);
        let preDir = (this.orientation !== 'Vertical') ? this.horDir : this.verDir;
        if (this.enableRtl) {
            this.horDir = 'right';
            this.verDir = 'bottom';
        }
        else {
            this.horDir = 'left';
            this.verDir = 'bottom';
        }
        let currDir = (this.orientation !== 'Vertical') ? this.horDir : this.verDir;
        if (preDir !== currDir) {
            if (this.orientation === 'Horizontal') {
                setStyleAttribute(this.firstHandle, { 'right': '', 'left': 'auto' });
                if (this.type === 'Range') {
                    setStyleAttribute(this.secondHandle, { 'top': '', 'left': 'auto' });
                }
            }
        }
    }
    tooltipValue() {
        let text;
        let args = {
            value: this.value,
            text: ''
        };
        this.setTooltipContent();
        args.text = text = this.tooltipObj.content;
        this.trigger('tooltipChange', args, (observedArgs) => {
            this.addTooltipClass(observedArgs.text);
            if (text !== observedArgs.text) {
                this.customAriaText = observedArgs.text;
                this.tooltipObj.content = observedArgs.text;
                this.setAriaAttrValue(this.firstHandle);
                if (this.type === 'Range') {
                    this.setAriaAttrValue(this.secondHandle);
                }
            }
        });
    }
    setTooltipContent() {
        let content;
        content = this.formatContent(this.tooltipFormatInfo, false);
        this.tooltipObj.content = content;
    }
    formatContent(formatInfo, ariaContent) {
        let content = '';
        let handle1 = this.handleVal1;
        let handle2 = this.handleVal2;
        if (!isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            handle1 = this.customValues[this.handleVal1];
            handle2 = this.customValues[this.handleVal2];
        }
        if (!ariaContent) {
            if (this.type === 'Range') {
                if (this.enableRtl && this.orientation !== 'Vertical') {
                    content = (!isNullOrUndefined(formatInfo.format)) ? (this.formatString(handle2, formatInfo)
                        .formatString + ' - ' + this.formatString(handle1, formatInfo).formatString) :
                        (handle2.toString() + ' - ' + handle1.toString());
                }
                else {
                    content = (!isNullOrUndefined(formatInfo.format)) ? (this.formatString(handle1, formatInfo)
                        .formatString + ' - ' + this.formatString(handle2, formatInfo).formatString) :
                        (handle1.toString() + ' - ' + handle2.toString());
                }
            }
            else {
                if (!isNullOrUndefined(handle1)) {
                    content = (!isNullOrUndefined(formatInfo.format)) ?
                        this.formatString(handle1, formatInfo).formatString : handle1.toString();
                }
            }
            return content;
        }
        else {
            if (this.type === 'Range') {
                if (this.enableRtl && this.orientation !== 'Vertical') {
                    content = (!isNullOrUndefined(this.tooltip) && !isNullOrUndefined(this.tooltip.format)) ?
                        (this.formatString(handle2, formatInfo).elementVal + ' - ' +
                            this.formatString(handle1, formatInfo).elementVal) :
                        (handle2.toString() + ' - ' + handle1.toString());
                }
                else {
                    content = (!isNullOrUndefined(this.tooltip) && !isNullOrUndefined(this.tooltip.format)) ?
                        (this.formatString(handle1, formatInfo).elementVal + ' - ' +
                            this.formatString(handle2, formatInfo).elementVal) :
                        (handle1.toString() + ' - ' + handle2.toString());
                }
            }
            else {
                if (!isNullOrUndefined(handle1)) {
                    content = (!isNullOrUndefined(this.tooltip) && !isNullOrUndefined(this.tooltip.format)) ?
                        this.formatString(handle1, formatInfo).elementVal : handle1.toString();
                }
            }
            return content;
        }
    }
    addTooltipClass(content) {
        if (this.isMaterialTooltip) {
            let count = content.toString().length;
            if (!this.tooltipElement) {
                let cssClass = count > 4 ? classNames.sliderMaterialRange : classNames.sliderMaterialDefault;
                this.tooltipObj.cssClass = classNames.sliderTooltip + ' ' + cssClass;
            }
            else {
                let cssClass = count > 4 ?
                    { oldCss: classNames.sliderMaterialDefault, newCss: classNames.sliderMaterialRange } :
                    { oldCss: classNames.sliderMaterialRange, newCss: classNames.sliderMaterialDefault };
                this.tooltipElement.classList.remove(cssClass.oldCss);
                if (!this.tooltipElement.classList.contains(cssClass.newCss)) {
                    this.tooltipElement.classList.add(cssClass.newCss);
                    this.tooltipElement.style.transform = count > 4 ? 'scale(1)' :
                        this.getTooltipTransformProperties(this.previousTooltipClass).rotate;
                }
            }
        }
    }
    tooltipPlacement() {
        return this.orientation === 'Horizontal' ? (this.tooltip.placement === 'Before' ? 'TopCenter' : 'BottomCenter') :
            (this.tooltip.placement === 'Before' ? 'LeftCenter' : 'RightCenter');
    }
    tooltipBeforeOpen(args) {
        this.tooltipElement = args.element;
        if (this.tooltip.cssClass) {
            addClass([this.tooltipElement], this.tooltip.cssClass.split(' ').filter((css) => css));
        }
        args.target.removeAttribute('aria-describedby');
        if (this.isMaterialTooltip) {
            this.tooltipElement.firstElementChild.classList.add(classNames.materialTooltipHide);
            this.handleStart();
            this.setTooltipTransform();
        }
    }
    tooltipCollision(position) {
        if (this.isBootstrap || this.isBootstrap4 || (this.isMaterial && !this.isMaterialTooltip)) {
            const tooltipOffsetValue = this.isBootstrap4 ? bootstrap4TooltipOffset : bootstrapTooltipOffset;
            switch (position) {
                case 'TopCenter':
                    this.tooltipObj.setProperties({ 'offsetY': -(tooltipOffsetValue) }, false);
                    break;
                case 'BottomCenter':
                    this.tooltipObj.setProperties({ 'offsetY': tooltipOffsetValue }, false);
                    break;
                case 'LeftCenter':
                    this.tooltipObj.setProperties({ 'offsetX': -(tooltipOffsetValue) }, false);
                    break;
                case 'RightCenter':
                    this.tooltipObj.setProperties({ 'offsetX': tooltipOffsetValue }, false);
                    break;
            }
        }
    }
    wireMaterialTooltipEvent(destroy) {
        if (this.isMaterialTooltip) {
            if (!destroy) {
                EventHandler.add(this.tooltipElement, 'mousedown touchstart', this.sliderDown, this);
            }
            else {
                EventHandler.remove(this.tooltipElement, 'mousedown touchstart', this.sliderDown);
            }
        }
    }
    tooltipPositionCalculation(position) {
        let cssClass;
        switch (position) {
            case 'TopCenter':
                cssClass = classNames.horizontalTooltipBefore;
                break;
            case 'BottomCenter':
                cssClass = classNames.horizontalTooltipAfter;
                break;
            case 'LeftCenter':
                cssClass = classNames.verticalTooltipBefore;
                break;
            case 'RightCenter':
                cssClass = classNames.verticalTooltipAfter;
                break;
        }
        return cssClass;
    }
    getTooltipTransformProperties(className) {
        let transformProperties;
        if (this.tooltipElement) {
            let position = this.orientation === 'Horizontal' ?
                ((this.tooltipElement.clientHeight + 14) - (this.tooltipElement.clientHeight / 2)) :
                ((this.tooltipElement.clientWidth + 14) - (this.tooltipElement.clientWidth / 2));
            transformProperties = this.orientation === 'Horizontal' ?
                (className === classNames.horizontalTooltipBefore ? { rotate: 'rotate(45deg)', translate: `translateY(${position}px)` } :
                    { rotate: 'rotate(225deg)', translate: `translateY(${-(position)}px)` }) :
                (className === classNames.verticalTooltipBefore ? { rotate: 'rotate(-45deg)', translate: `translateX(${position}px)` } :
                    { rotate: 'rotate(-225deg)', translate: `translateX(${(-position)}px)` });
        }
        return transformProperties;
    }
    openMaterialTooltip() {
        if (this.isMaterialTooltip) {
            this.refreshTooltip(this.firstHandle);
            let tooltipContentElement = this.tooltipElement.firstElementChild;
            tooltipContentElement.classList.remove(classNames.materialTooltipHide);
            tooltipContentElement.classList.add(classNames.materialTooltipShow);
            this.firstHandle.style.cursor = 'default';
            this.tooltipElement.style.transition = this.scaleTransform;
            this.tooltipElement.classList.add(classNames.materialTooltipOpen);
            this.materialHandle.style.transform = 'scale(0)';
            if (tooltipContentElement.innerText.length > 4) {
                this.tooltipElement.style.transform = 'scale(1)';
            }
            else {
                this.tooltipElement.style.transform = this.getTooltipTransformProperties(this.previousTooltipClass).rotate;
            }
            if (this.type === 'Default') {
                setTimeout(() => { this.tooltipElement.style.transition = this.transition.handle; }, 2500);
            }
            else {
                setTimeout(() => { this.tooltipElement.style.transition = 'none'; }, 2500);
            }
        }
    }
    closeMaterialTooltip() {
        if (this.isMaterialTooltip) {
            let tooltipContentElement = this.tooltipElement.firstElementChild;
            this.tooltipElement.style.transition = this.scaleTransform;
            tooltipContentElement.classList.remove(classNames.materialTooltipShow);
            tooltipContentElement.classList.add(classNames.materialTooltipHide);
            this.firstHandle.style.cursor = '-webkit-grab';
            this.firstHandle.style.cursor = 'grab';
            this.materialHandle.style.transform = 'scale(1)';
            this.tooltipElement.classList.remove(classNames.materialTooltipOpen);
            this.setTooltipTransform();
            this.tooltipTarget = undefined;
            setTimeout(() => { this.tooltipElement.style.transition = 'none'; }, 2500);
        }
    }
    checkTooltipPosition(args) {
        if (this.tooltipCollidedPosition === undefined ||
            this.tooltipCollidedPosition !== args.collidedPosition) {
            if (this.isMaterialTooltip) {
                let tooltipClass = this.tooltipPositionCalculation(args.collidedPosition);
                args.element.classList.remove(this.previousTooltipClass);
                args.element.classList.add(tooltipClass);
                this.previousTooltipClass = tooltipClass;
                if (args.element.style.transform && args.element.classList.contains(classNames.materialTooltipOpen) &&
                    args.element.firstElementChild.innerText.length <= 4) {
                    args.element.style.transform = this.getTooltipTransformProperties(this.previousTooltipClass).rotate;
                }
            }
            this.tooltipCollidedPosition = args.collidedPosition;
        }
        if (this.isMaterialTooltip && this.tooltipElement && this.tooltipElement.style.transform.indexOf('translate') !== -1) {
            this.setTooltipTransform();
        }
    }
    setTooltipTransform() {
        let transformProperties = this.getTooltipTransformProperties(this.previousTooltipClass);
        if (this.tooltipElement.firstElementChild.innerText.length > 4) {
            this.tooltipElement.style.transform = `${transformProperties.translate} scale(0.01)`;
        }
        else {
            this.tooltipElement.style.transform = `${transformProperties.translate} ${transformProperties.rotate} scale(0.01)`;
        }
    }
    renderTooltip() {
        this.tooltipObj = new Tooltip({
            showTipPointer: this.isBootstrap || this.isMaterial || this.isBootstrap4,
            cssClass: classNames.sliderTooltip,
            height: this.isMaterial ? 30 : 'auto',
            animation: { open: { effect: 'None' }, close: { effect: 'FadeOut', duration: 500 } },
            opensOn: 'Custom',
            beforeOpen: this.tooltipBeforeOpen.bind(this),
            beforeCollision: this.checkTooltipPosition.bind(this),
            beforeClose: this.tooltipBeforeClose.bind(this)
        });
        this.tooltipObj.appendTo(this.firstHandle);
        this.initializeTooltipProps();
    }
    initializeTooltipProps() {
        let tooltipShowOn = this.isMaterialTooltip ? 'Always' : (this.tooltip.showOn === 'Auto' ? 'Hover' : this.tooltip.showOn);
        this.setProperties({ tooltip: { showOn: tooltipShowOn } }, true);
        this.tooltipObj.position = this.tooltipPlacement();
        this.tooltipCollision(this.tooltipObj.position);
        [this.firstHandle, this.rangeBar, this.secondHandle].forEach((handle) => {
            if (!isNullOrUndefined(handle)) {
                handle.style.transition = 'none';
            }
        });
        if (this.isMaterialTooltip) {
            this.sliderContainer.classList.add(classNames.materialSlider);
            this.tooltipValue();
            this.tooltipObj.animation.close.effect = 'None';
            this.tooltipObj.open(this.firstHandle);
        }
    }
    tooltipBeforeClose() {
        this.tooltipElement = undefined;
        this.tooltipCollidedPosition = undefined;
    }
    setButtons() {
        this.firstBtn = this.createElement('div', { className: classNames.sliderButton + ' ' + classNames.firstButton });
        this.firstBtn.appendChild(this.createElement('span', { className: classNames.sliderButtonIcon }));
        this.firstBtn.tabIndex = -1;
        this.secondBtn = this.createElement('div', { className: classNames.sliderButton + ' ' + classNames.secondButton });
        this.secondBtn.appendChild(this.createElement('span', { className: classNames.sliderButtonIcon }));
        this.secondBtn.tabIndex = -1;
        this.sliderContainer.classList.add(classNames.sliderButtonClass);
        this.sliderContainer.appendChild(this.firstBtn);
        this.sliderContainer.appendChild(this.secondBtn);
        this.sliderContainer.appendChild(this.element);
        this.buttonTitle();
    }
    buttonTitle() {
        let enabledRTL = this.enableRtl && this.orientation !== 'Vertical';
        this.l10n.setLocale(this.locale);
        let decrementTitle = this.l10n.getConstant('decrementTitle');
        let incrementTitle = this.l10n.getConstant('incrementTitle');
        attributes(enabledRTL ? this.secondBtn : this.firstBtn, { 'aria-label': decrementTitle, title: decrementTitle });
        attributes(enabledRTL ? this.firstBtn : this.secondBtn, { 'aria-label': incrementTitle, title: incrementTitle });
    }
    buttonFocusOut() {
        if (this.isMaterial) {
            this.getHandle().classList.remove('e-large-thumb-size');
        }
    }
    repeatButton(args) {
        let hVal = this.handleValueUpdate();
        let enabledRTL = this.enableRtl && this.orientation !== 'Vertical';
        let value;
        if (args.target.parentElement.classList.contains(classNames.firstButton)
            || args.target.classList.contains(classNames.firstButton)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.step.toString()), true)) :
                (value = this.add(hVal, parseFloat(this.step.toString()), false));
        }
        else if (args.target.parentElement.classList.contains(classNames.secondButton)
            || (args.target.classList.contains(classNames.secondButton))) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.step.toString()), false)) :
                (value = this.add(hVal, parseFloat(this.step.toString()), true));
        }
        if (this.limits.enabled) {
            value = this.getLimitCorrectedValues(value);
        }
        if (value >= this.min && value <= this.max) {
            this.changeHandleValue(value);
            this.tooltipToggle(this.getHandle());
        }
    }
    repeatHandlerMouse(args) {
        args.preventDefault();
        if (args.type === ('mousedown') || args.type === ('touchstart')) {
            this.buttonClick(args);
            this.repeatInterval = setInterval(this.repeatButton.bind(this), 180, args);
        }
    }
    materialChange() {
        if (!this.getHandle().classList.contains('e-large-thumb-size')) {
            this.getHandle().classList.add('e-large-thumb-size');
        }
    }
    repeatHandlerUp(e) {
        this.changeEvent('changed');
        this.closeTooltip();
        clearInterval(this.repeatInterval);
        this.getHandle().focus();
    }
    customTickCounter(bigNum) {
        let tickCount = 4;
        if (!isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            if (bigNum > 4) {
                tickCount = 3;
            }
            if (bigNum > 7) {
                tickCount = 2;
            }
            if (bigNum > 14) {
                tickCount = 1;
            }
            if (bigNum > 28) {
                tickCount = 0;
            }
        }
        return tickCount;
    }
    // tslint:disable-next-line:max-func-body-length
    renderScale() {
        let orien = this.orientation === 'Vertical' ? 'v' : 'h';
        this.noOfDecimals = this.numberOfDecimals(this.step);
        this.ul = this.createElement('ul', {
            className: classNames.scale + ' ' + 'e-' + orien + '-scale ' + classNames.tick + '-' + this.ticks.placement.toLowerCase(),
            attrs: { role: 'presentation', tabIndex: '-1', 'aria-hidden': 'true' }
        });
        this.ul.style.zIndex = '-1';
        if (Browser.isAndroid && orien === 'h') {
            this.ul.classList.add(classNames.sliderTickPosition);
        }
        let smallStep = this.ticks.smallStep;
        if (!this.ticks.showSmallTicks) {
            this.ticks.largeStep > 0 ? (smallStep = this.ticks.largeStep) :
                (smallStep = (parseFloat(formatUnit(this.max))) - (parseFloat(formatUnit(this.min))));
        }
        else if (smallStep <= 0) {
            smallStep = parseFloat(formatUnit(this.step));
        }
        let min = this.fractionalToInteger(this.min);
        let max = this.fractionalToInteger(this.max);
        let steps = this.fractionalToInteger(smallStep);
        let bigNum = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 && this.customValues.length - 1;
        let customStep = this.customTickCounter(bigNum);
        let count = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
            (bigNum * customStep) + bigNum : Math.abs((max - min) / steps);
        this.element.appendChild(this.ul);
        let li;
        let start = parseFloat(this.min.toString());
        if (orien === 'v') {
            start = parseFloat(this.max.toString());
        }
        let left = 0;
        let islargeTick;
        let tickWidth = 100 / count;
        if (tickWidth === Infinity) {
            tickWidth = 5;
        }
        for (let i = 0, y = !isNullOrUndefined(this.customValues) && this.customValues.length > 0 ?
            this.customValues.length - 1 : 0, k = 0; i <= count; i++) {
            li = (this.createElement('li', {
                attrs: {
                    class: classNames.tick, role: 'presentation', tabIndex: '-1',
                    'aria-hidden': 'true'
                }
            }));
            if (!isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
                islargeTick = i % (customStep + 1) === 0;
                if (islargeTick) {
                    if (orien === 'h') {
                        start = this.customValues[k];
                        k++;
                    }
                    else {
                        start = this.customValues[y];
                        y--;
                    }
                    li.setAttribute('title', start.toString());
                }
            }
            else {
                li.setAttribute('title', start.toString());
                if (this.numberOfDecimals(this.max) === 0 && this.numberOfDecimals(this.min) === 0 &&
                    this.numberOfDecimals(this.step) === 0) {
                    if (orien === 'h') {
                        islargeTick = ((start - parseFloat(this.min.toString())) % this.ticks.largeStep === 0) ? true : false;
                    }
                    else {
                        islargeTick = (Math.abs(start - parseFloat(this.max.toString())) % this.ticks.largeStep === 0) ? true : false;
                    }
                }
                else {
                    let largestep = this.fractionalToInteger(this.ticks.largeStep);
                    let startValue = this.fractionalToInteger(start);
                    if (orien === 'h') {
                        islargeTick = ((startValue - min) % largestep === 0) ? true : false;
                    }
                    else {
                        islargeTick = (Math.abs(startValue - parseFloat(max.toString())) % largestep === 0) ? true : false;
                    }
                }
            }
            if (islargeTick) {
                li.classList.add(classNames.large);
            }
            (orien === 'h') ? (li.style.width = tickWidth + '%') : (li.style.height = tickWidth + '%');
            let repeat = islargeTick ? (this.ticks.placement === 'Both' ? 2 : 1) : 0;
            if (islargeTick) {
                for (let j = 0; j < repeat; j++) {
                    this.createTick(li, start, tickWidth);
                }
            }
            else if (isNullOrUndefined(this.customValues)) {
                this.formatTicksValue(li, start);
            }
            this.ul.appendChild(li);
            this.tickElementCollection.push(li);
            let decimalPoints;
            if (isNullOrUndefined(this.customValues)) {
                if (this.numberOfDecimals(smallStep) > this.numberOfDecimals(start)) {
                    decimalPoints = this.numberOfDecimals(smallStep);
                }
                else {
                    decimalPoints = this.numberOfDecimals(start);
                }
                if (orien === 'h') {
                    start = this.makeRoundNumber(start + smallStep, decimalPoints);
                }
                else {
                    start = this.makeRoundNumber(start - smallStep, decimalPoints);
                }
                left = this.makeRoundNumber(left + smallStep, decimalPoints);
            }
        }
        this.ticksAlignment(orien, tickWidth);
    }
    ticksAlignment(orien, tickWidth, triggerEvent = true) {
        this.firstChild = this.ul.firstElementChild;
        this.lastChild = this.ul.lastElementChild;
        this.firstChild.classList.add(classNames.sliderFirstTick);
        this.lastChild.classList.add(classNames.sliderLastTick);
        this.sliderContainer.classList.add(classNames.scale + '-' + this.ticks.placement.toLowerCase());
        if (orien === 'h') {
            this.firstChild.style.width = tickWidth / 2 + '%';
            this.lastChild.style.width = tickWidth / 2 + '%';
        }
        else {
            this.firstChild.style.height = tickWidth / 2 + '%';
            this.lastChild.style.height = tickWidth / 2 + '%';
        }
        let eventArgs = { ticksWrapper: this.ul, tickElements: this.tickElementCollection };
        if (triggerEvent) {
            this.trigger('renderedTicks', eventArgs);
        }
        this.scaleAlignment();
    }
    createTick(li, start, tickWidth) {
        let span = this.createElement('span', {
            className: classNames.tickValue + ' ' + classNames.tick + '-' + this.ticks.placement.toLowerCase(),
            attrs: { role: 'presentation', tabIndex: '-1', 'aria-hidden': 'true' }
        });
        li.appendChild(span);
        if (isNullOrUndefined(this.customValues)) {
            this.formatTicksValue(li, start, span, tickWidth);
        }
        else {
            span.innerHTML = start.toString();
        }
    }
    formatTicksValue(li, start, spanElement, tickWidth) {
        const tickText = this.formatNumber(start);
        const text = !isNullOrUndefined(this.ticks) && !isNullOrUndefined(this.ticks.format) ?
            this.formatString(start, this.ticksFormatInfo).formatString : tickText;
        const eventArgs = { value: start, text: text, tickElement: li };
        this.trigger('renderingTicks', eventArgs, (observedArgs) => {
            li.setAttribute('title', observedArgs.text.toString());
            if (spanElement) {
                spanElement.innerHTML = observedArgs.text.toString();
            }
            if (isBlazor()) {
                const orien = this.orientation === 'Horizontal' ? 'h' : 'v';
                this.ticksAlignment(orien, tickWidth, false);
            }
        });
    }
    scaleAlignment() {
        this.tickValuePosition();
        let orien = this.orientation === 'Vertical' ? 'v' : 'h';
        if (this.orientation === 'Vertical') {
            (this.element.getBoundingClientRect().width <= 15) ?
                this.sliderContainer.classList.add(classNames.sliderSmallSize) :
                this.sliderContainer.classList.remove(classNames.sliderSmallSize);
        }
        else {
            (this.element.getBoundingClientRect().height <= 15) ?
                this.sliderContainer.classList.add(classNames.sliderSmallSize) :
                this.sliderContainer.classList.remove(classNames.sliderSmallSize);
        }
    }
    tickValuePosition() {
        let first = this.firstChild.getBoundingClientRect();
        let firstChild;
        let smallStep = this.ticks.smallStep;
        let count = Math.abs((parseFloat(formatUnit(this.max))) - (parseFloat(formatUnit(this.min)))) / smallStep;
        if (this.firstChild.children.length > 0) {
            firstChild = this.firstChild.children[0].getBoundingClientRect();
        }
        let tickElements = [this.sliderContainer.querySelectorAll('.' + classNames.tick + '.' +
                classNames.large + ' .' + classNames.tickValue)];
        let other;
        if (this.ticks.placement === 'Both') {
            other = [].slice.call(tickElements[0], 2);
        }
        else {
            other = [].slice.call(tickElements[0], 1);
        }
        let tickWidth = this.orientation === 'Vertical' ?
            (first.height * 2) : (first.width * 2);
        for (let i = 0; i < this.firstChild.children.length; i++) {
            if (this.orientation === 'Vertical') {
                this.firstChild.children[i].style.top = -(firstChild.height / 2) + 'px';
            }
            else {
                if (!this.enableRtl) {
                    this.firstChild.children[i].style.left = -(firstChild.width / 2) + 'px';
                }
                else {
                    this.firstChild.children[i].style.left = (tickWidth -
                        this.firstChild.children[i].getBoundingClientRect().width) / 2 + 'px';
                }
            }
        }
        for (let i = 0; i < other.length; i++) {
            let otherChild = other[i].getBoundingClientRect();
            if (this.orientation === 'Vertical') {
                setStyleAttribute(other[i], { top: (tickWidth - otherChild.height) / 2 + 'px' });
            }
            else {
                setStyleAttribute(other[i], { left: (tickWidth - otherChild.width) / 2 + 'px' });
            }
        }
        if (this.enableRtl && this.lastChild.children.length && count !== 0) {
            this.lastChild.children[0].style.left = -(this.lastChild.getBoundingClientRect().width / 2) + 'px';
            if (this.ticks.placement === 'Both') {
                this.lastChild.children[1].style.left = -(this.lastChild.getBoundingClientRect().width / 2) + 'px';
            }
        }
        if (count === 0) {
            if (this.orientation === 'Horizontal') {
                if (!this.enableRtl) {
                    this.firstChild.classList.remove(classNames.sliderLastTick);
                    this.firstChild.style.left = this.firstHandle.style.left;
                }
                else {
                    this.firstChild.classList.remove(classNames.sliderLastTick);
                    this.firstChild.style.right = this.firstHandle.style.right;
                    this.firstChild.children[0].style.left =
                        (this.firstChild.getBoundingClientRect().width / 2) + 2 + 'px';
                    if (this.ticks.placement === 'Both') {
                        this.firstChild.children[1].style.left =
                            (this.firstChild.getBoundingClientRect().width / 2) + 2 + 'px';
                    }
                }
            }
            if (this.orientation === 'Vertical') {
                this.firstChild.classList.remove(classNames.sliderLastTick);
            }
        }
    }
    setAriaAttrValue(element) {
        let ariaValueText;
        let isTickFormatted = ((!isNullOrUndefined(this.ticks) && !isNullOrUndefined(this.ticks.format))) ? true : false;
        let text = !isTickFormatted ?
            this.formatContent(this.ticksFormatInfo, false) : this.formatContent(this.tooltipFormatInfo, false);
        let valuenow = isTickFormatted ? this.formatContent(this.ticksFormatInfo, true) :
            this.formatContent(this.tooltipFormatInfo, true);
        text = (!this.customAriaText) ? (text) : (this.customAriaText);
        if (text.split(' - ').length === 2) {
            ariaValueText = text.split(' - ');
        }
        else {
            ariaValueText = [text, text];
        }
        this.setAriaAttributes(element);
        if (this.type !== 'Range') {
            attributes(element, { 'aria-valuenow': valuenow, 'aria-valuetext': text });
        }
        else {
            (!this.enableRtl) ? ((element === this.firstHandle) ?
                attributes(element, { 'aria-valuenow': valuenow.split(' - ')[0], 'aria-valuetext': ariaValueText[0] }) :
                attributes(element, { 'aria-valuenow': valuenow.split(' - ')[1], 'aria-valuetext': ariaValueText[1] })) :
                ((element === this.firstHandle) ?
                    attributes(element, { 'aria-valuenow': valuenow.split(' - ')[1], 'aria-valuetext': ariaValueText[1] }) :
                    attributes(element, { 'aria-valuenow': valuenow.split(' - ')[0], 'aria-valuetext': ariaValueText[0] }));
        }
    }
    handleValueUpdate() {
        let hVal;
        if (this.type === 'Range') {
            if (this.activeHandle === 1) {
                hVal = this.handleVal1;
            }
            else {
                hVal = this.handleVal2;
            }
        }
        else {
            hVal = this.handleVal1;
        }
        return hVal;
    }
    getLimitCorrectedValues(value) {
        if (this.type === 'MinRange' || this.type === 'Default') {
            value = (this.getLimitValueAndPosition(value, this.limits.minStart, this.limits.minEnd))[0];
        }
        else {
            if (this.activeHandle === 1) {
                value = (this.getLimitValueAndPosition(value, this.limits.minStart, this.limits.minEnd))[0];
            }
            else {
                value = (this.getLimitValueAndPosition(value, this.limits.maxStart, this.limits.maxEnd))[0];
            }
        }
        return value;
    }
    focusSliderElement() {
        if (!this.isElementFocused) {
            this.element.focus();
            this.isElementFocused = true;
        }
    }
    buttonClick(args) {
        this.focusSliderElement();
        let value;
        let enabledRTL = this.enableRtl && this.orientation !== 'Vertical';
        let hVal = this.handleValueUpdate();
        if ((args.keyCode === 40) || (args.keyCode === 37)
            || args.currentTarget.classList.contains(classNames.firstButton)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.step.toString()), true)) :
                (value = this.add(hVal, parseFloat(this.step.toString()), false));
        }
        else if ((args.keyCode === 38) || (args.keyCode === 39) ||
            args.currentTarget.classList.contains(classNames.secondButton)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.step.toString()), false)) :
                (value = this.add(hVal, parseFloat(this.step.toString()), true));
        }
        else if ((args.keyCode === 33
            || args.currentTarget.classList.contains(classNames.firstButton))) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), false)) :
                (value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), true));
        }
        else if ((args.keyCode === 34) ||
            args.currentTarget.classList.contains(classNames.secondButton)) {
            enabledRTL ? (value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), true)) :
                (value = this.add(hVal, parseFloat(this.ticks.largeStep.toString()), false));
        }
        else if ((args.keyCode === 36)) {
            value = parseFloat(this.min.toString());
        }
        else if ((args.keyCode === 35)) {
            value = parseFloat(this.max.toString());
        }
        if (this.limits.enabled) {
            value = this.getLimitCorrectedValues(value);
        }
        this.changeHandleValue(value);
        if (this.isMaterial && !this.tooltip.isVisible &&
            !this.getHandle().classList.contains(classNames.sliderTabHandle)) {
            this.materialChange();
        }
        this.tooltipToggle(this.getHandle());
        this.getHandle().focus();
        if (args.currentTarget.classList.contains(classNames.firstButton)) {
            EventHandler.add(this.firstBtn, 'mouseup touchend', this.buttonUp, this);
        }
        if (args.currentTarget.classList.contains(classNames.secondButton)) {
            EventHandler.add(this.secondBtn, 'mouseup touchend', this.buttonUp, this);
        }
    }
    tooltipToggle(target) {
        if (this.isMaterialTooltip) {
            !this.tooltipElement.classList.contains(classNames.materialTooltipOpen) ?
                this.openMaterialTooltip() : this.refreshTooltip(this.firstHandle);
        }
        else {
            !this.tooltipElement ? this.openTooltip(target) : this.refreshTooltip(target);
        }
    }
    buttonUp(args) {
        if (args.currentTarget.classList.contains(classNames.firstButton)) {
            EventHandler.remove(this.firstBtn, 'mouseup touchend', this.buttonUp);
        }
        if (args.currentTarget.classList.contains(classNames.secondButton)) {
            EventHandler.remove(this.secondBtn, 'mouseup touchend', this.buttonUp);
        }
    }
    setRangeBar() {
        if (this.orientation === 'Horizontal') {
            if (this.type === 'MinRange') {
                this.enableRtl ? (this.rangeBar.style.right = '0px') : (this.rangeBar.style.left = '0px');
                setStyleAttribute(this.rangeBar, { 'width': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else {
                this.enableRtl ? (this.rangeBar.style.right =
                    this.handlePos1 + 'px') : (this.rangeBar.style.left = this.handlePos1 + 'px');
                setStyleAttribute(this.rangeBar, { 'width': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
        else {
            if (this.type === 'MinRange') {
                this.rangeBar.style.bottom = '0px';
                setStyleAttribute(this.rangeBar, { 'height': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else {
                this.rangeBar.style.bottom = this.handlePos1 + 'px';
                setStyleAttribute(this.rangeBar, { 'height': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
    }
    checkValidValueAndPos(value) {
        value = this.checkHandleValue(value);
        value = this.checkHandlePosition(value);
        return value;
    }
    setLimitBarPositions(fromMinPostion, fromMaxpostion, toMinPostion, toMaxpostion) {
        if (this.orientation === 'Horizontal') {
            if (!this.enableRtl) {
                this.limitBarFirst.style.left = fromMinPostion + 'px';
                this.limitBarFirst.style.width = (fromMaxpostion - fromMinPostion) + 'px';
            }
            else {
                this.limitBarFirst.style.right = fromMinPostion + 'px';
                this.limitBarFirst.style.width = (fromMaxpostion - fromMinPostion) + 'px';
            }
        }
        else {
            this.limitBarFirst.style.bottom = fromMinPostion + 'px';
            this.limitBarFirst.style.height = (fromMaxpostion - fromMinPostion) + 'px';
        }
        if (this.type === 'Range') {
            if (this.orientation === 'Horizontal') {
                if (!this.enableRtl) {
                    this.limitBarSecond.style.left = toMinPostion + 'px';
                    this.limitBarSecond.style.width = (toMaxpostion - toMinPostion) + 'px';
                }
                else {
                    this.limitBarSecond.style.right = toMinPostion + 'px';
                    this.limitBarSecond.style.width = (toMaxpostion - toMinPostion) + 'px';
                }
            }
            else {
                this.limitBarSecond.style.bottom = toMinPostion + 'px';
                this.limitBarSecond.style.height = (toMaxpostion - toMinPostion) + 'px';
            }
        }
    }
    setLimitBar() {
        if (this.type === 'Default' || this.type === 'MinRange') {
            let fromPosition = (this.getLimitValueAndPosition(this.limits.minStart, this.limits.minStart, this.limits.minEnd, true))[0];
            fromPosition = this.checkValidValueAndPos(fromPosition);
            let toPosition = (this.getLimitValueAndPosition(this.limits.minEnd, this.limits.minStart, this.limits.minEnd, true))[0];
            toPosition = this.checkValidValueAndPos(toPosition);
            this.setLimitBarPositions(fromPosition, toPosition);
        }
        else if (this.type === 'Range') {
            let fromMinPostion = (this.getLimitValueAndPosition(this.limits.minStart, this.limits.minStart, this.limits.minEnd, true))[0];
            fromMinPostion = this.checkValidValueAndPos(fromMinPostion);
            let fromMaxpostion = (this.getLimitValueAndPosition(this.limits.minEnd, this.limits.minStart, this.limits.minEnd, true))[0];
            fromMaxpostion = this.checkValidValueAndPos(fromMaxpostion);
            let toMinPostion = (this.getLimitValueAndPosition(this.limits.maxStart, this.limits.maxStart, this.limits.maxEnd, true))[0];
            toMinPostion = this.checkValidValueAndPos(toMinPostion);
            let toMaxpostion = (this.getLimitValueAndPosition(this.limits.maxEnd, this.limits.maxStart, this.limits.maxEnd, true))[0];
            toMaxpostion = this.checkValidValueAndPos(toMaxpostion);
            this.setLimitBarPositions(fromMinPostion, fromMaxpostion, toMinPostion, toMaxpostion);
        }
    }
    getLimitValueAndPosition(currentValue, minValue, maxValue, limitBar) {
        if (isNullOrUndefined(minValue)) {
            minValue = this.min;
            if (isNullOrUndefined(currentValue) && limitBar) {
                currentValue = minValue;
            }
        }
        if (isNullOrUndefined(maxValue)) {
            maxValue = this.max;
            if (isNullOrUndefined(currentValue) && limitBar) {
                currentValue = maxValue;
            }
        }
        if (currentValue < minValue) {
            currentValue = minValue;
        }
        if (currentValue > maxValue) {
            currentValue = maxValue;
        }
        return [currentValue, this.checkHandlePosition(currentValue)];
    }
    setValue() {
        if (!isNullOrUndefined(this.customValues) && this.customValues.length > 0) {
            this.min = 0;
            this.max = this.customValues.length - 1;
        }
        this.setAriaAttributes(this.firstHandle);
        this.handleVal1 = isNullOrUndefined(this.value) ? this.checkHandleValue(parseFloat(this.min.toString())) :
            this.checkHandleValue(parseFloat(this.value.toString()));
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        this.preHandlePos1 = this.handlePos1;
        isNullOrUndefined(this.activeHandle) ? (this.type === 'Range' ? this.activeHandle = 2 : this.activeHandle = 1) :
            this.activeHandle = this.activeHandle;
        if (this.type === 'Default' || this.type === 'MinRange') {
            if (this.limits.enabled) {
                let values = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
                this.handleVal1 = values[0];
                this.handlePos1 = values[1];
                this.preHandlePos1 = this.handlePos1;
            }
            this.setHandlePosition();
            this.handleStart();
            this.value = this.handleVal1;
            this.setAriaAttrValue(this.firstHandle);
            this.changeEvent('changed');
        }
        else {
            this.validateRangeValue();
        }
        if (this.type !== 'Default') {
            this.setRangeBar();
        }
        if (this.limits.enabled) {
            this.setLimitBar();
        }
    }
    rangeValueUpdate() {
        if (this.value === null || typeof (this.value) !== 'object') {
            this.value = [parseFloat(formatUnit(this.min)), parseFloat(formatUnit(this.max))];
        }
    }
    validateRangeValue() {
        this.rangeValueUpdate();
        this.setRangeValue();
    }
    modifyZindex() {
        if (this.type === 'Range') {
            if (this.activeHandle === 1) {
                this.firstHandle.style.zIndex = (this.zIndex + 4) + '';
                this.secondHandle.style.zIndex = (this.zIndex + 3) + '';
            }
            else {
                this.firstHandle.style.zIndex = (this.zIndex + 3) + '';
                this.secondHandle.style.zIndex = (this.zIndex + 4) + '';
            }
        }
        else if (this.isMaterialTooltip && this.tooltipElement) {
            this.tooltipElement.style.zIndex = (this.zIndex + 4) + '';
        }
    }
    setHandlePosition() {
        let handle;
        let pos = (this.activeHandle === 1) ? this.handlePos1 : this.handlePos2;
        if (this.isMaterialTooltip) {
            handle = [this.firstHandle, this.materialHandle];
        }
        else {
            handle = [this.getHandle()];
        }
        this.handleStart();
        handle.forEach((handle) => {
            if (this.orientation === 'Horizontal') {
                this.enableRtl ? (handle.style.right =
                    `${pos}px`) : (handle.style.left = `${pos}px`);
            }
            else {
                handle.style.bottom = `${pos}px`;
            }
        });
        this.changeEvent('change');
    }
    getHandle() {
        return (this.activeHandle === 1) ? this.firstHandle : this.secondHandle;
    }
    setRangeValue() {
        this.updateRangeValue();
        this.activeHandle = 1;
        this.setHandlePosition();
        this.activeHandle = 2;
        this.setHandlePosition();
        this.activeHandle = 1;
    }
    changeEvent(eventName) {
        let previous = eventName === 'change' ? this.previousVal : this.previousChanged;
        if (this.type !== 'Range') {
            this.setProperties({ 'value': this.handleVal1 }, true);
            if (previous !== this.value) {
                this.trigger(eventName, this.changeEventArgs(eventName));
                this.setPreviousVal(eventName, this.value);
            }
            this.setAriaAttrValue(this.firstHandle);
        }
        else {
            let value = this.value = [this.handleVal1, this.handleVal2];
            this.setProperties({ 'value': value }, true);
            if (previous.length === this.value.length
                && this.value[0] !== previous[0] || this.value[1] !== previous[1]) {
                this.trigger(eventName, this.changeEventArgs(eventName));
                this.setPreviousVal(eventName, this.value);
            }
            this.setAriaAttrValue(this.getHandle());
        }
        this.hiddenInput.value = this.value.toString();
    }
    changeEventArgs(eventName) {
        let eventArgs;
        if (this.tooltip.isVisible && this.tooltipObj) {
            this.tooltipValue();
            eventArgs = {
                value: this.value,
                previousValue: eventName === 'change' ? this.previousVal : this.previousChanged,
                action: eventName, text: this.tooltipObj.content
            };
        }
        else {
            eventArgs = {
                value: this.value,
                previousValue: eventName === 'change' ? this.previousVal : this.previousChanged,
                action: eventName, text: isNullOrUndefined(this.ticksFormatInfo.format) ? this.value.toString() :
                    (this.type !== 'Range' ? this.formatString(this.value, this.ticksFormatInfo).formatString :
                        (this.formatString(this.value[0], this.ticksFormatInfo).formatString + ' - ' +
                            this.formatString(this.value[1], this.ticksFormatInfo).formatString))
            };
        }
        return eventArgs;
    }
    setPreviousVal(eventName, value) {
        if (eventName === 'change') {
            this.previousVal = value;
        }
        else {
            this.previousChanged = value;
        }
    }
    updateRangeValue() {
        let values = this.value.toString().split(',').map(Number);
        if ((this.enableRtl && this.orientation !== 'Vertical') || this.rtl) {
            this.value = [values[1], values[0]];
        }
        else {
            this.value = [values[0], values[1]];
        }
        if (this.enableRtl && this.orientation !== 'Vertical') {
            this.handleVal1 = this.checkHandleValue(this.value[1]);
            this.handleVal2 = this.checkHandleValue(this.value[0]);
        }
        else {
            this.handleVal1 = this.checkHandleValue(this.value[0]);
            this.handleVal2 = this.checkHandleValue(this.value[1]);
        }
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        this.handlePos2 = this.checkHandlePosition(this.handleVal2);
        if (this.handlePos1 > this.handlePos2) {
            this.handlePos1 = this.handlePos2;
            this.handleVal1 = this.handleVal2;
        }
        this.preHandlePos1 = this.handlePos1;
        this.preHandlePos2 = this.handlePos2;
        if (this.limits.enabled) {
            this.activeHandle = 1;
            let values = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
            this.handleVal1 = values[0];
            this.handlePos1 = values[1];
            this.preHandlePos1 = this.handlePos1;
            this.activeHandle = 2;
            values = this.getLimitValueAndPosition(this.handleVal2, this.limits.maxStart, this.limits.maxEnd);
            this.handleVal2 = values[0];
            this.handlePos2 = values[1];
            this.preHandlePos2 = this.handlePos2;
        }
    }
    checkHandlePosition(value) {
        let pos;
        value = (100 *
            (value - (parseFloat(formatUnit(this.min))))) / ((parseFloat(formatUnit(this.max))) - (parseFloat(formatUnit(this.min))));
        if (this.orientation === 'Horizontal') {
            pos = this.element.getBoundingClientRect().width * (value / 100);
        }
        else {
            pos = this.element.getBoundingClientRect().height * (value / 100);
        }
        if (((parseFloat(formatUnit(this.max))) === (parseFloat(formatUnit(this.min))))) {
            if (this.orientation === 'Horizontal') {
                pos = this.element.getBoundingClientRect().width;
            }
            else {
                pos = this.element.getBoundingClientRect().height;
            }
        }
        return pos;
    }
    checkHandleValue(value) {
        if (this.min > this.max) {
            this.min = this.max;
        }
        if (this.min === this.max) {
            return (parseFloat(formatUnit(this.max)));
        }
        let handle = this.tempStartEnd();
        if (value < handle.start) {
            value = handle.start;
        }
        else if (value > handle.end) {
            value = handle.end;
        }
        return value;
    }
    /**
     * It is used to reposition slider.
     * @returns void
     */
    reposition() {
        this.firstHandle.style.transition = 'none';
        if (this.type !== 'Default') {
            this.rangeBar.style.transition = 'none';
        }
        if (this.type === 'Range') {
            this.secondHandle.style.transition = 'none';
        }
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        if (this.handleVal2) {
            this.handlePos2 = this.checkHandlePosition(this.handleVal2);
        }
        if (this.orientation === 'Horizontal') {
            this.enableRtl ? this.firstHandle.style.right =
                `${this.handlePos1}px` : this.firstHandle.style.left = `${this.handlePos1}px`;
            if (this.isMaterialTooltip) {
                this.enableRtl ? this.materialHandle.style.right =
                    `${this.handlePos1}px` : this.materialHandle.style.left = `${this.handlePos1}px`;
            }
            if (this.type === 'MinRange') {
                this.enableRtl ? (this.rangeBar.style.right = '0px') : (this.rangeBar.style.left = '0px');
                setStyleAttribute(this.rangeBar, { 'width': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else if (this.type === 'Range') {
                this.enableRtl ? this.secondHandle.style.right =
                    `${this.handlePos2}px` : this.secondHandle.style.left = `${this.handlePos2}px`;
                this.enableRtl ? (this.rangeBar.style.right =
                    this.handlePos1 + 'px') : (this.rangeBar.style.left = this.handlePos1 + 'px');
                setStyleAttribute(this.rangeBar, { 'width': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
        else {
            this.firstHandle.style.bottom = `${this.handlePos1}px`;
            if (this.isMaterialTooltip) {
                this.materialHandle.style.bottom = `${this.handlePos1}px`;
            }
            if (this.type === 'MinRange') {
                this.rangeBar.style.bottom = '0px';
                setStyleAttribute(this.rangeBar, { 'height': isNullOrUndefined(this.handlePos1) ? 0 : this.handlePos1 + 'px' });
            }
            else if (this.type === 'Range') {
                this.secondHandle.style.bottom = `${this.handlePos2}px`;
                this.rangeBar.style.bottom = this.handlePos1 + 'px';
                setStyleAttribute(this.rangeBar, { 'height': this.handlePos2 - this.handlePos1 + 'px' });
            }
        }
        if (this.limits.enabled) {
            this.setLimitBar();
        }
        if (this.ticks.placement !== 'None' && this.ul) {
            this.removeElement(this.ul);
            this.ul = undefined;
            this.renderScale();
        }
        this.handleStart();
        if (!this.tooltip.isVisible) {
            setTimeout(() => {
                this.firstHandle.style.transition = this.scaleTransform;
                if (this.type === 'Range') {
                    this.secondHandle.style.transition = this.scaleTransform;
                }
            });
        }
        this.refreshTooltip(this.tooltipTarget);
    }
    changeHandleValue(value) {
        let position = null;
        if (this.activeHandle === 1) {
            if (!(this.limits.enabled && this.limits.startHandleFixed)) {
                this.handleVal1 = this.checkHandleValue(value);
                this.handlePos1 = this.checkHandlePosition(this.handleVal1);
                if (this.type === 'Range' && this.handlePos1 > this.handlePos2) {
                    this.handlePos1 = this.handlePos2;
                    this.handleVal1 = this.handleVal2;
                }
                if (this.handlePos1 !== this.preHandlePos1) {
                    position = this.preHandlePos1 = this.handlePos1;
                }
            }
            this.modifyZindex();
        }
        else {
            if (!(this.limits.enabled && this.limits.endHandleFixed)) {
                this.handleVal2 = this.checkHandleValue(value);
                this.handlePos2 = this.checkHandlePosition(this.handleVal2);
                if (this.type === 'Range' && this.handlePos2 < this.handlePos1) {
                    this.handlePos2 = this.handlePos1;
                    this.handleVal2 = this.handleVal1;
                }
                if (this.handlePos2 !== this.preHandlePos2) {
                    position = this.preHandlePos2 = this.handlePos2;
                }
            }
            this.modifyZindex();
        }
        if (position !== null) {
            if (this.type !== 'Default') {
                this.setRangeBar();
            }
            this.setHandlePosition();
        }
    }
    tempStartEnd() {
        if (this.min > this.max) {
            return {
                start: this.max,
                end: this.min
            };
        }
        else {
            return {
                start: this.min,
                end: this.max
            };
        }
    }
    xyToPosition(position) {
        let pos;
        if (this.min === this.max) {
            return 100;
        }
        if (this.orientation === 'Horizontal') {
            let left = position.x - this.element.getBoundingClientRect().left;
            let num = this.element.offsetWidth / 100;
            this.val = (left / num);
        }
        else {
            let top = position.y - this.element.getBoundingClientRect().top;
            let num = this.element.offsetHeight / 100;
            this.val = 100 - (top / num);
        }
        let val = this.stepValueCalculation(this.val);
        if (val < 0) {
            val = 0;
        }
        else if (val > 100) {
            val = 100;
        }
        if (this.enableRtl && this.orientation !== 'Vertical') {
            val = 100 - val;
        }
        if (this.orientation === 'Horizontal') {
            pos = this.element.getBoundingClientRect().width * (val / 100);
        }
        else {
            pos = this.element.getBoundingClientRect().height * (val / 100);
        }
        return pos;
    }
    stepValueCalculation(value) {
        if (this.step === 0) {
            this.step = 1;
        }
        let percentStep = (parseFloat(formatUnit(this.step))) / ((parseFloat(formatUnit(this.max)) - parseFloat(formatUnit(this.min))) / 100);
        let remain = value % Math.abs(percentStep);
        if (remain !== 0) {
            if ((percentStep / 2) > remain) {
                value -= remain;
            }
            else {
                value += Math.abs(percentStep) - remain;
            }
        }
        return value;
    }
    add(a, b, addition) {
        let precision;
        let x = Math.pow(10, precision || 3);
        let val;
        if (addition) {
            val = (Math.round(a * x) + Math.round(b * x)) / x;
        }
        else {
            val = (Math.round(a * x) - Math.round(b * x)) / x;
        }
        return val;
    }
    positionToValue(pos) {
        let val;
        let diff = parseFloat(formatUnit(this.max)) - parseFloat(formatUnit(this.min));
        if (this.orientation === 'Horizontal') {
            val = (pos / this.element.getBoundingClientRect().width) * diff;
        }
        else {
            val = (pos / this.element.getBoundingClientRect().height) * diff;
        }
        let total = this.add(val, parseFloat(this.min.toString()), true);
        return (total);
    }
    sliderBarClick(evt) {
        evt.preventDefault();
        let pos;
        if (evt.type === 'mousedown' || evt.type === 'click') {
            pos = { x: evt.clientX, y: evt.clientY };
        }
        else if (evt.type === 'touchstart') {
            pos = { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
        }
        let handlepos = this.xyToPosition(pos);
        let handleVal = this.positionToValue(handlepos);
        if (this.type === 'Range' && (this.handlePos2 - handlepos) < (handlepos - this.handlePos1)) {
            this.activeHandle = 2;
            if (!(this.limits.enabled && this.limits.endHandleFixed)) {
                if (this.limits.enabled) {
                    let value = this.getLimitValueAndPosition(handleVal, this.limits.maxStart, this.limits.maxEnd);
                    handleVal = value[0];
                    handlepos = value[1];
                }
                this.secondHandle.classList.add(classNames.sliderActiveHandle);
                this.handlePos2 = this.preHandlePos2 = handlepos;
                this.handleVal2 = handleVal;
            }
            this.modifyZindex();
            this.secondHandle.focus();
        }
        else {
            this.activeHandle = 1;
            if (!(this.limits.enabled && this.limits.startHandleFixed)) {
                if (this.limits.enabled) {
                    let value = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
                    handleVal = value[0];
                    handlepos = value[1];
                }
                this.firstHandle.classList.add(classNames.sliderActiveHandle);
                this.handlePos1 = this.preHandlePos1 = handlepos;
                this.handleVal1 = handleVal;
            }
            this.modifyZindex();
            this.firstHandle.focus();
        }
        if (this.isMaterialTooltip) {
            this.tooltipElement.classList.add(classNames.materialTooltipActive);
        }
        let focusedElement = this.element.querySelector('.' + classNames.sliderTabHandle);
        if (focusedElement && this.getHandle() !== focusedElement) {
            focusedElement.classList.remove(classNames.sliderTabHandle);
        }
        let handle = this.activeHandle === 1 ? this.firstHandle : this.secondHandle;
        if (evt.target === handle) {
            if (this.isMaterial && !this.tooltip.isVisible &&
                !this.getHandle().classList.contains(classNames.sliderTabHandle)) {
                this.materialChange();
            }
            this.tooltipToggle(this.getHandle());
            return;
        }
        if (!this.checkRepeatedValue(handleVal)) {
            return;
        }
        let transition = this.isMaterial && this.tooltip.isVisible ?
            this.transitionOnMaterialTooltip : this.transition;
        this.getHandle().style.transition = transition.handle;
        if (this.type !== 'Default') {
            this.rangeBar.style.transition = transition.rangeBar;
        }
        this.setHandlePosition();
        if (this.type !== 'Default') {
            this.setRangeBar();
        }
    }
    sliderDown(event) {
        event.preventDefault();
        this.focusSliderElement();
        if (this.type === 'Range' && this.drag && event.target === this.rangeBar) {
            let xPostion;
            let yPostion;
            if (event.type === 'mousedown') {
                [xPostion, yPostion] = [event.clientX, event.clientY];
            }
            else if (event.type === 'touchstart') {
                [xPostion, yPostion] = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
            }
            if (this.orientation === 'Horizontal') {
                this.firstPartRemain = xPostion - this.rangeBar.getBoundingClientRect().left;
                this.secondPartRemain = this.rangeBar.getBoundingClientRect().right - xPostion;
            }
            else {
                this.firstPartRemain = yPostion - this.rangeBar.getBoundingClientRect().top;
                this.secondPartRemain = this.rangeBar.getBoundingClientRect().bottom - yPostion;
            }
            this.minDiff = this.handleVal2 - this.handleVal1;
            this.tooltipToggle(this.rangeBar);
            let focusedElement = this.element.querySelector('.' + classNames.sliderTabHandle);
            if (focusedElement) {
                focusedElement.classList.remove(classNames.sliderTabHandle);
            }
            EventHandler.add(document, 'mousemove touchmove', this.dragRangeBarMove, this);
            EventHandler.add(document, 'mouseup touchend', this.dragRangeBarUp, this);
        }
        else {
            this.sliderBarClick(event);
            EventHandler.add(document, 'mousemove touchmove', this.sliderBarMove, this);
            EventHandler.add(document, 'mouseup touchend', this.sliderBarUp, this);
        }
    }
    handleValueAdjust(handleValue, assignValue, handleNumber) {
        if (handleNumber === 1) {
            this.handleVal1 = assignValue;
            this.handleVal2 = this.handleVal1 + this.minDiff;
        }
        else if (handleNumber === 2) {
            this.handleVal2 = assignValue;
            this.handleVal1 = this.handleVal2 - this.minDiff;
        }
        this.handlePos1 = this.checkHandlePosition(this.handleVal1);
        this.handlePos2 = this.checkHandlePosition(this.handleVal2);
    }
    dragRangeBarMove(event) {
        if (event.type !== 'touchmove') {
            event.preventDefault();
        }
        let pos;
        this.rangeBar.style.transition = 'none';
        this.firstHandle.style.transition = 'none';
        this.secondHandle.style.transition = 'none';
        let xPostion;
        let yPostion;
        if (event.type === 'mousemove') {
            [xPostion, yPostion] = [event.clientX, event.clientY];
        }
        else {
            [xPostion, yPostion] = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
        }
        if (!(this.limits.enabled && this.limits.startHandleFixed) && !(this.limits.enabled && this.limits.endHandleFixed)) {
            if (!this.enableRtl) {
                pos = { x: xPostion - this.firstPartRemain, y: yPostion + this.secondPartRemain };
            }
            else {
                pos = { x: xPostion + this.secondPartRemain, y: yPostion + this.secondPartRemain };
            }
            this.handlePos1 = this.xyToPosition(pos);
            this.handleVal1 = this.positionToValue(this.handlePos1);
            if (!this.enableRtl) {
                pos = { x: xPostion + this.secondPartRemain, y: yPostion - this.firstPartRemain };
            }
            else {
                pos = { x: xPostion - this.firstPartRemain, y: yPostion - this.firstPartRemain };
            }
            this.handlePos2 = this.xyToPosition(pos);
            this.handleVal2 = this.positionToValue(this.handlePos2);
            if (this.limits.enabled) {
                let value = this.getLimitValueAndPosition(this.handleVal1, this.limits.minStart, this.limits.minEnd);
                this.handleVal1 = value[0];
                this.handlePos1 = value[1];
                if (this.handleVal1 === this.limits.minEnd) {
                    this.handleValueAdjust(this.handleVal1, this.limits.minEnd, 1);
                }
                if (this.handleVal1 === this.limits.minStart) {
                    this.handleValueAdjust(this.handleVal1, this.limits.minStart, 1);
                }
                value = this.getLimitValueAndPosition(this.handleVal2, this.limits.maxStart, this.limits.maxEnd);
                this.handleVal2 = value[0];
                this.handlePos2 = value[1];
                if (this.handleVal2 === this.limits.maxStart) {
                    this.handleValueAdjust(this.handleVal2, this.limits.maxStart, 2);
                }
                if (this.handleVal2 === this.limits.maxEnd) {
                    this.handleValueAdjust(this.handleVal2, this.limits.maxEnd, 2);
                }
            }
            if (this.handleVal2 === this.max) {
                this.handleValueAdjust(this.handleVal2, this.max, 2);
            }
            if (this.handleVal1 === this.min) {
                this.handleValueAdjust(this.handleVal1, this.min, 1);
            }
        }
        this.activeHandle = 1;
        this.setHandlePosition();
        this.activeHandle = 2;
        this.setHandlePosition();
        this.tooltipToggle(this.rangeBar);
        this.setRangeBar();
    }
    sliderBarUp() {
        this.changeEvent('changed');
        this.handleFocusOut();
        this.firstHandle.classList.remove(classNames.sliderActiveHandle);
        if (this.type === 'Range') {
            this.secondHandle.classList.remove(classNames.sliderActiveHandle);
        }
        this.closeTooltip();
        if (this.isMaterial) {
            this.getHandle().classList.remove('e-large-thumb-size');
            if (this.isMaterialTooltip) {
                this.tooltipElement.classList.remove(classNames.materialTooltipActive);
            }
        }
        EventHandler.remove(document, 'mousemove touchmove', this.sliderBarMove);
        EventHandler.remove(document, 'mouseup touchend', this.sliderBarUp);
    }
    sliderBarMove(evt) {
        if (evt.type !== 'touchmove') {
            evt.preventDefault();
        }
        let pos;
        if (evt.type === 'mousemove') {
            pos = { x: evt.clientX, y: evt.clientY };
        }
        else {
            pos = { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
        }
        let handlepos = this.xyToPosition(pos);
        let handleVal = this.positionToValue(handlepos);
        handlepos = Math.round(handlepos);
        if (this.type !== 'Range' && this.activeHandle === 1) {
            if (!(this.limits.enabled && this.limits.startHandleFixed)) {
                if (this.limits.enabled) {
                    let valueAndPostion = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
                    handlepos = valueAndPostion[1];
                    handleVal = valueAndPostion[0];
                }
                this.handlePos1 = handlepos;
                this.handleVal1 = handleVal;
            }
            this.firstHandle.classList.add(classNames.sliderActiveHandle);
        }
        if (this.type === 'Range') {
            if (this.activeHandle === 1) {
                this.firstHandle.classList.add(classNames.sliderActiveHandle);
                if (!(this.limits.enabled && this.limits.startHandleFixed)) {
                    if (handlepos > this.handlePos2) {
                        handlepos = this.handlePos2;
                        handleVal = this.handleVal2;
                    }
                    if (handlepos !== this.preHandlePos1) {
                        if (this.limits.enabled) {
                            let value = this.getLimitValueAndPosition(handleVal, this.limits.minStart, this.limits.minEnd);
                            handleVal = value[0];
                            handlepos = value[1];
                        }
                        this.handlePos1 = this.preHandlePos1 = handlepos;
                        this.handleVal1 = handleVal;
                        this.activeHandle = 1;
                    }
                }
            }
            else if (this.activeHandle === 2) {
                this.secondHandle.classList.add(classNames.sliderActiveHandle);
                if (!(this.limits.enabled && this.limits.endHandleFixed)) {
                    if (handlepos < this.handlePos1) {
                        handlepos = this.handlePos1;
                        handleVal = this.handleVal1;
                    }
                    if (handlepos !== this.preHandlePos2) {
                        if (this.limits.enabled) {
                            let value = this.getLimitValueAndPosition(handleVal, this.limits.maxStart, this.limits.maxEnd);
                            handleVal = value[0];
                            handlepos = value[1];
                        }
                        this.handlePos2 = this.preHandlePos2 = handlepos;
                        this.handleVal2 = handleVal;
                        this.activeHandle = 2;
                    }
                }
            }
        }
        if (!this.checkRepeatedValue(handleVal)) {
            return;
        }
        this.getHandle().style.transition = this.scaleTransform;
        if (this.type !== 'Default') {
            this.rangeBar.style.transition = 'none';
        }
        this.setHandlePosition();
        if (this.isMaterial && !this.tooltip.isVisible &&
            !this.getHandle().classList.contains(classNames.sliderTabHandle)) {
            this.materialChange();
        }
        this.tooltipToggle(this.getHandle());
        if (this.type !== 'Default') {
            this.setRangeBar();
        }
    }
    dragRangeBarUp(event) {
        this.changeEvent('changed');
        this.closeTooltip();
        EventHandler.remove(document, 'mousemove touchmove', this.dragRangeBarMove);
        EventHandler.remove(document, 'mouseup touchend', this.dragRangeBarUp);
    }
    checkRepeatedValue(currentValue) {
        if (this.type === 'Range') {
            let previousVal = this.enableRtl && this.orientation !== 'Vertical' ? (this.activeHandle === 1 ?
                this.previousVal[1] : this.previousVal[0]) :
                (this.activeHandle === 1 ? this.previousVal[0] : this.previousVal[1]);
            if (currentValue === previousVal) {
                return 0;
            }
        }
        else {
            if (currentValue === this.previousVal) {
                return 0;
            }
        }
        return 1;
    }
    refreshTooltip(target) {
        if (this.tooltip.isVisible && this.tooltipObj) {
            this.tooltipValue();
            if (target) {
                this.tooltipObj.refresh(target);
                this.tooltipTarget = target;
            }
        }
    }
    openTooltip(target) {
        if (this.tooltip.isVisible && this.tooltipObj && !this.isMaterialTooltip) {
            this.tooltipValue();
            this.tooltipObj.open(target);
            this.tooltipTarget = target;
        }
    }
    closeTooltip() {
        if (this.tooltip.isVisible && this.tooltipObj && this.tooltip.showOn !== 'Always' && !this.isMaterialTooltip) {
            this.tooltipValue();
            this.tooltipObj.close();
            this.tooltipTarget = undefined;
        }
    }
    keyDown(event) {
        switch (event.keyCode) {
            case 37:
            case 38:
            case 39:
            case 40:
            case 33:
            case 34:
            case 36:
            case 35:
                event.preventDefault();
                this.buttonClick(event);
                break;
        }
    }
    wireButtonEvt(destroy) {
        if (!destroy) {
            EventHandler.add(this.firstBtn, 'mouseleave touchleave', this.buttonFocusOut, this);
            EventHandler.add(this.secondBtn, 'mouseleave touchleave', this.buttonFocusOut, this);
            EventHandler.add(this.firstBtn, 'mousedown touchstart', this.repeatHandlerMouse, this);
            EventHandler.add(this.firstBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp, this);
            EventHandler.add(this.secondBtn, 'mousedown touchstart', this.repeatHandlerMouse, this);
            EventHandler.add(this.secondBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp, this);
            EventHandler.add(this.firstBtn, 'focusout', this.sliderFocusOut, this);
            EventHandler.add(this.secondBtn, 'focusout', this.sliderFocusOut, this);
        }
        else {
            EventHandler.remove(this.firstBtn, 'mouseleave touchleave', this.buttonFocusOut);
            EventHandler.remove(this.secondBtn, 'mouseleave touchleave', this.buttonFocusOut);
            EventHandler.remove(this.firstBtn, 'mousedown touchstart', this.repeatHandlerMouse);
            EventHandler.remove(this.firstBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp);
            EventHandler.remove(this.secondBtn, 'mousedown touchstart', this.repeatHandlerMouse);
            EventHandler.remove(this.secondBtn, 'mouseup mouseleave touchup touchend', this.repeatHandlerUp);
            EventHandler.remove(this.firstBtn, 'focusout', this.sliderFocusOut);
            EventHandler.remove(this.secondBtn, 'focusout', this.sliderFocusOut);
        }
    }
    wireEvents() {
        this.onresize = this.reposition.bind(this);
        window.addEventListener('resize', this.onresize);
        if (this.enabled && !this.readonly) {
            EventHandler.add(this.element, 'mousedown touchstart', this.sliderDown, this);
            EventHandler.add(this.sliderContainer, 'keydown', this.keyDown, this);
            EventHandler.add(this.sliderContainer, 'keyup', this.keyUp, this);
            EventHandler.add(this.element, 'focusout', this.sliderFocusOut, this);
            EventHandler.add(this.sliderContainer, 'mouseover mouseout touchstart touchend', this.hover, this);
            this.wireFirstHandleEvt(false);
            if (this.type === 'Range') {
                this.wireSecondHandleEvt(false);
            }
            if (this.showButtons) {
                this.wireButtonEvt(false);
            }
            this.wireMaterialTooltipEvent(false);
            if (this.isForm) {
                EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
            }
        }
    }
    unwireEvents() {
        EventHandler.remove(this.element, 'mousedown touchstart', this.sliderDown);
        EventHandler.remove(this.sliderContainer, 'keydown', this.keyDown);
        EventHandler.remove(this.sliderContainer, 'keyup', this.keyUp);
        EventHandler.remove(this.element, 'focusout', this.sliderFocusOut);
        EventHandler.remove(this.sliderContainer, 'mouseover mouseout touchstart touchend', this.hover);
        this.wireFirstHandleEvt(true);
        if (this.type === 'Range') {
            this.wireSecondHandleEvt(true);
        }
        if (this.showButtons) {
            this.wireButtonEvt(true);
        }
        this.wireMaterialTooltipEvent(true);
        EventHandler.remove(this.element, 'reset', this.formResetHandler);
    }
    formResetHandler() {
        this.setProperties({ 'value': this.formResetValue }, true);
        this.setValue();
    }
    keyUp(event) {
        if (event.keyCode === 9 && event.target.classList.contains(classNames.sliderHandle)) {
            this.focusSliderElement();
            if (!event.target.classList.contains(classNames.sliderTabHandle)) {
                if (this.element.querySelector('.' + classNames.sliderTabHandle)) {
                    this.element.querySelector('.' + classNames.sliderTabHandle).classList.remove(classNames.sliderTabHandle);
                }
                event.target.classList.add(classNames.sliderTabHandle);
                let parentElement = event.target.parentElement;
                if (parentElement === this.element) {
                    parentElement.querySelector('.' + classNames.sliderTrack).classList.add(classNames.sliderTabTrack);
                    if (this.type === 'Range' || this.type === 'MinRange') {
                        parentElement.querySelector('.' + classNames.rangeBar).classList.add(classNames.sliderTabRange);
                    }
                }
                if (this.type === 'Range') {
                    (event.target.previousSibling).classList.contains(classNames.sliderHandle) ?
                        this.activeHandle = 2 : this.activeHandle = 1;
                }
                this.getHandle().focus();
                this.tooltipToggle(this.getHandle());
            }
        }
        this.closeTooltip();
        this.changeEvent('changed');
    }
    hover(event) {
        if (!isNullOrUndefined(event)) {
            if (event.type === 'mouseover' || event.type === 'touchmove' || event.type === 'mousemove' ||
                event.type === 'pointermove' || event.type === 'touchstart') {
                this.sliderContainer.classList.add(classNames.sliderHover);
            }
            else {
                this.sliderContainer.classList.remove(classNames.sliderHover);
            }
        }
    }
    sliderFocusOut(event) {
        if (event.relatedTarget !== this.secondHandle && event.relatedTarget !== this.firstHandle &&
            event.relatedTarget !== this.element && event.relatedTarget !== this.firstBtn && event.relatedTarget !== this.secondBtn) {
            this.closeMaterialTooltip();
            if (this.element.querySelector('.' + classNames.sliderTabHandle)) {
                this.element.querySelector('.' + classNames.sliderTabHandle).classList.remove(classNames.sliderTabHandle);
            }
            if (this.element.querySelector('.' + classNames.sliderTabTrack)) {
                this.element.querySelector('.' + classNames.sliderTabTrack).classList.remove(classNames.sliderTabTrack);
                if ((this.type === 'Range' || this.type === 'MinRange') &&
                    this.element.querySelector('.' + classNames.sliderTabRange)) {
                    this.element.querySelector('.' + classNames.sliderTabRange).classList.remove(classNames.sliderTabRange);
                }
            }
            this.hiddenInput.focus();
            this.hiddenInput.blur();
            this.isElementFocused = false;
        }
    }
    removeElement(element) {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }
    changeSliderType(type) {
        if (this.isMaterialTooltip && this.materialHandle) {
            this.sliderContainer.classList.remove(classNames.materialSlider);
            this.removeElement(this.materialHandle);
            this.materialHandle = undefined;
        }
        this.removeElement(this.firstHandle);
        this.firstHandle = undefined;
        if (type !== 'Default') {
            if (type === 'Range') {
                this.removeElement(this.secondHandle);
                this.secondHandle = undefined;
            }
            this.removeElement(this.rangeBar);
            this.rangeBar = undefined;
        }
        if (this.tooltip.isVisible && !isNullOrUndefined(this.tooltipObj)) {
            this.tooltipObj.destroy();
            this.tooltipElement = undefined;
            this.tooltipCollidedPosition = undefined;
        }
        if (this.limits.enabled) {
            if (type === 'MinRange' || type === 'Default') {
                if (!isNullOrUndefined(this.limitBarFirst)) {
                    this.removeElement(this.limitBarFirst);
                    this.limitBarFirst = undefined;
                }
            }
            else {
                if (!isNullOrUndefined(this.limitBarSecond)) {
                    this.removeElement(this.limitBarSecond);
                    this.limitBarSecond = undefined;
                }
            }
        }
        this.activeHandle = 1;
        this.getThemeInitialization();
        if (this.type === 'Range') {
            this.rangeValueUpdate();
        }
        this.createRangeBar();
        if (this.limits.enabled) {
            this.createLimitBar();
        }
        this.setHandler();
        this.setOrientClass();
        this.wireFirstHandleEvt(false);
        if (this.type === 'Range') {
            this.wireSecondHandleEvt(false);
        }
        this.setValue();
        if (this.tooltip.isVisible) {
            this.renderTooltip();
            this.wireMaterialTooltipEvent(false);
        }
        this.updateConfig();
    }
    changeRtl() {
        if (!this.enableRtl && this.type === 'Range') {
            this.value = [this.handleVal2, this.handleVal1];
        }
        this.updateConfig();
        if (this.tooltip.isVisible) {
            this.tooltipObj.refresh(this.firstHandle);
        }
        if (this.showButtons) {
            let enabledRTL = this.enableRtl && this.orientation !== 'Vertical';
            attributes(enabledRTL ? this.secondBtn : this.firstBtn, { 'aria-label': 'Decrease', title: 'Decrease' });
            attributes(enabledRTL ? this.firstBtn : this.secondBtn, { 'aria-label': 'Increase', title: 'Increase' });
        }
    }
    changeOrientation() {
        this.changeSliderType(this.type);
    }
    updateConfig() {
        this.setEnableRTL();
        this.setValue();
        if (this.tooltip.isVisible) {
            this.refreshTooltip(this.tooltipTarget);
        }
        if (this.ticks.placement !== 'None') {
            if (this.ul) {
                this.removeElement(this.ul);
                this.ul = undefined;
                this.renderScale();
            }
        }
        this.limitsPropertyChange();
    }
    limitsPropertyChange() {
        if (this.limits.enabled) {
            if (isNullOrUndefined(this.limitBarFirst) && this.type !== 'Range') {
                this.createLimitBar();
            }
            if (isNullOrUndefined(this.limitBarFirst) && isNullOrUndefined(this.limitBarSecond) && this.type === 'Range') {
                this.createLimitBar();
            }
            this.setLimitBar();
            this.setValue();
        }
        else {
            if (!isNullOrUndefined(this.limitBarFirst)) {
                detach(this.limitBarFirst);
            }
            if (!isNullOrUndefined(this.limitBarSecond)) {
                detach(this.limitBarSecond);
            }
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData() {
        let keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Prepares the slider for safe removal from the DOM.
     * Detaches all event handlers, attributes, and classes to avoid memory leaks.
     * @method destroy
     * @return {void}
     */
    destroy() {
        super.destroy();
        this.unwireEvents();
        window.removeEventListener('resize', this.onresize);
        removeClass([this.sliderContainer], [classNames.sliderDisabled]);
        this.firstHandle.removeAttribute('aria-orientation');
        if (this.type === 'Range') {
            this.secondHandle.removeAttribute('aria-orientation');
        }
        this.sliderContainer.parentNode.insertBefore(this.element, this.sliderContainer);
        detach(this.sliderContainer);
        if (this.tooltip.isVisible) {
            this.tooltipObj.destroy();
        }
        this.element.innerHTML = '';
    }
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    // tslint:disable-next-line
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
                case 'value':
                    if (newProp && oldProp) {
                        let value = isNullOrUndefined(newProp.value) ?
                            (this.type === 'Range' ? [this.min, this.max] : this.min) : newProp.value;
                        this.setProperties({ 'value': value }, true);
                        if (!isNullOrUndefined(oldProp.value) && oldProp.value.toString() !== value.toString()) {
                            this.setValue();
                            this.refreshTooltip(this.tooltipTarget);
                            if (this.type === 'Range') {
                                if (isNullOrUndefined(newProp.value) || oldProp.value[1] === value[1]) {
                                    this.activeHandle = 1;
                                }
                                else {
                                    this.activeHandle = 2;
                                }
                            }
                        }
                    }
                    break;
                case 'min':
                case 'step':
                case 'max':
                    this.setMinMaxValue();
                    break;
                case 'tooltip':
                    if (!isNullOrUndefined(newProp.tooltip) && !isNullOrUndefined(oldProp.tooltip)) {
                        this.setTooltip();
                    }
                    break;
                case 'type':
                    if (!isNullOrUndefined(oldProp) && Object.keys(oldProp).length
                        && !isNullOrUndefined(oldProp.type)) {
                        this.changeSliderType(oldProp.type);
                        this.setZindex();
                    }
                    break;
                case 'enableRtl':
                    if (oldProp.enableRtl !== newProp.enableRtl && this.orientation !== 'Vertical') {
                        this.rtl = oldProp.enableRtl;
                        this.changeRtl();
                    }
                    break;
                case 'limits':
                    this.limitsPropertyChange();
                    break;
                case 'orientation':
                    this.changeOrientation();
                    break;
                case 'ticks':
                    if (!isNullOrUndefined(this.sliderContainer.querySelector('.' + classNames.scale))) {
                        detach(this.ul);
                        Array.prototype.forEach.call(this.sliderContainer.classList, (className) => {
                            if (className.match(/e-scale-/)) {
                                this.sliderContainer.classList.remove(className);
                            }
                        });
                    }
                    if (this.ticks.placement !== 'None') {
                        this.renderScale();
                        this.setZindex();
                    }
                    break;
                case 'locale':
                    if (this.showButtons) {
                        this.buttonTitle();
                    }
                    break;
                case 'showButtons':
                    if (newProp.showButtons) {
                        this.setButtons();
                        this.reposition();
                        if (this.enabled && !this.readonly) {
                            this.wireButtonEvt(false);
                        }
                    }
                    else {
                        if (this.firstBtn && this.secondBtn) {
                            this.sliderContainer.removeChild(this.firstBtn);
                            this.sliderContainer.removeChild(this.secondBtn);
                            this.sliderContainer.classList.remove(classNames.sliderButtonClass);
                            this.firstBtn = undefined;
                            this.secondBtn = undefined;
                        }
                    }
                    break;
                case 'enabled':
                    this.setEnabled();
                    break;
                case 'readonly':
                    this.setReadOnly();
                    break;
                case 'customValues':
                    this.setValue();
                    this.reposition();
                    break;
            }
        }
    }
    setReadOnly() {
        if (this.readonly) {
            this.unwireEvents();
            this.sliderContainer.classList.add(classNames.readonly);
        }
        else {
            this.wireEvents();
            this.sliderContainer.classList.remove(classNames.readonly);
        }
    }
    setMinMaxValue() {
        this.setValue();
        this.refreshTooltip(this.tooltipTarget);
        if (!isNullOrUndefined(this.sliderContainer.querySelector('.' + classNames.scale))) {
            if (this.ul) {
                detach(this.ul);
                Array.prototype.forEach.call(this.sliderContainer.classList, (className) => {
                    if (className.match(/e-scale-/)) {
                        this.sliderContainer.classList.remove(className);
                    }
                });
            }
        }
        if (this.ticks.placement !== 'None') {
            this.renderScale();
            this.setZindex();
        }
    }
    setZindex() {
        this.zIndex = 6;
        if (!isNullOrUndefined(this.ticks) && this.ticks.placement !== 'None') {
            this.ul.style.zIndex = (this.zIndex + -7) + '';
            this.element.style.zIndex = (this.zIndex + 2) + '';
        }
        if (!this.isMaterial && !isNullOrUndefined(this.ticks) && this.ticks.placement === 'Both') {
            this.element.style.zIndex = (this.zIndex + 2) + '';
        }
        this.firstHandle.style.zIndex = (this.zIndex + 3) + '';
        if (this.type === 'Range') {
            this.secondHandle.style.zIndex = (this.zIndex + 4) + '';
        }
    }
    setTooltip() {
        this.changeSliderType(this.type);
    }
    /**
     * Gets the component name
     * @private
     */
    getModuleName() {
        return 'slider';
    }
};
__decorate$2([
    Property(null)
], Slider.prototype, "value", void 0);
__decorate$2([
    Property(null)
], Slider.prototype, "customValues", void 0);
__decorate$2([
    Property(1)
], Slider.prototype, "step", void 0);
__decorate$2([
    Property(0)
], Slider.prototype, "min", void 0);
__decorate$2([
    Property(100)
], Slider.prototype, "max", void 0);
__decorate$2([
    Property(false)
], Slider.prototype, "readonly", void 0);
__decorate$2([
    Property('Default')
], Slider.prototype, "type", void 0);
__decorate$2([
    Complex({}, TicksData)
], Slider.prototype, "ticks", void 0);
__decorate$2([
    Complex({}, LimitData)
], Slider.prototype, "limits", void 0);
__decorate$2([
    Property(true)
], Slider.prototype, "enabled", void 0);
__decorate$2([
    Complex({}, TooltipData)
], Slider.prototype, "tooltip", void 0);
__decorate$2([
    Property(false)
], Slider.prototype, "showButtons", void 0);
__decorate$2([
    Property(true)
], Slider.prototype, "enableAnimation", void 0);
__decorate$2([
    Property('Horizontal')
], Slider.prototype, "orientation", void 0);
__decorate$2([
    Property('')
], Slider.prototype, "cssClass", void 0);
__decorate$2([
    Event()
], Slider.prototype, "created", void 0);
__decorate$2([
    Event()
], Slider.prototype, "change", void 0);
__decorate$2([
    Event()
], Slider.prototype, "changed", void 0);
__decorate$2([
    Event()
], Slider.prototype, "renderingTicks", void 0);
__decorate$2([
    Event()
], Slider.prototype, "renderedTicks", void 0);
__decorate$2([
    Event()
], Slider.prototype, "tooltipChange", void 0);
Slider = __decorate$2([
    NotifyPropertyChanges
], Slider);

/**
 * Slider modules
 */

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FormValidator_1;
/**
 * global declarations
 */
// tslint:disable-next-line:no-any
let regex = {
    EMAIL: new RegExp('^[A-Za-z0-9._%+-]{1,}@[A-Za-z0-9._%+-]{1,}([.]{1}[a-zA-Z0-9]{2,5}' +
        '|[.]{1}[a-zA-Z0-9]{2,4}[.]{1}[a-zA-Z0-9]{2,4})$'),
    URL: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/m,
    DATE_ISO: new RegExp('^([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$'),
    DIGITS: new RegExp('^[0-9]*$'),
    PHONE: new RegExp('^[+]?[0-9]{9,13}$'),
    CREDITCARD: new RegExp('^\\d{13,16}$')
};
/**
 * ErrorOption values
 * @private
 */
var ErrorOption;
(function (ErrorOption) {
    /**
     * Defines the error message.
     */
    ErrorOption[ErrorOption["Message"] = 0] = "Message";
    /**
     * Defines the error element type.
     */
    ErrorOption[ErrorOption["Label"] = 1] = "Label";
})(ErrorOption || (ErrorOption = {}));
/**
 * FormValidator class enables you to validate the form fields based on your defined rules
 * ```html
 * <form id='formId'>
 *  <input type='text' name='Name' />
 *  <input type='text' name='Age' />
 * </form>
 * <script>
 *   let formObject = new FormValidator('#formId', {
 *      rules: { Name: { required: true }, Age: { range: [18, 30] } };
 *   });
 *   formObject.validate();
 * </script>
 * ```
 */
let FormValidator = FormValidator_1 = class FormValidator extends Base {
    // Initializes the FormValidator 
    constructor(element, options) {
        super(options, element);
        this.validated = [];
        this.errorRules = [];
        this.allowSubmit = false;
        this.required = 'required';
        this.infoElement = null;
        this.inputElement = null;
        this.selectQuery = 'input:not([type=reset]):not([type=button]), select, textarea';
        // tslint:disable-next-line:no-any
        this.localyMessage = {};
        /**
         * Specifies the default messages for validation rules.
         * @default { List of validation message }
         */
        this.defaultMessages = {
            required: 'This field is required.',
            email: 'Please enter a valid email address.',
            url: 'Please enter a valid URL.',
            date: 'Please enter a valid date.',
            dateIso: 'Please enter a valid date ( ISO ).',
            creditcard: 'Please enter valid card number',
            number: 'Please enter a valid number.',
            digits: 'Please enter only digits.',
            maxLength: 'Please enter no more than {0} characters.',
            minLength: 'Please enter at least {0} characters.',
            rangeLength: 'Please enter a value between {0} and {1} characters long.',
            range: 'Please enter a value between {0} and {1}.',
            max: 'Please enter a value less than or equal to {0}.',
            min: 'Please enter a value greater than or equal to {0}.',
            regex: 'Please enter a correct value.',
            tel: 'Please enter a valid phone number.',
            pattern: 'Please enter a correct pattern value.',
            equalTo: 'Please enter the valid match text',
        };
        if (typeof this.rules === 'undefined') {
            this.rules = {};
        }
        this.l10n = new L10n('formValidator', this.defaultMessages, this.locale);
        if (this.locale) {
            this.localeFunc();
        }
        onIntlChange.on('notifyExternalChange', this.afterLocalization, this);
        element = typeof element === 'string' ? select(element, document) : element;
        // Set novalidate to prevent default HTML5 form validation
        if (this.element != null) {
            this.element.setAttribute('novalidate', '');
            this.inputElements = selectAll(this.selectQuery, this.element);
            this.createHTML5Rules();
            this.wireEvents();
        }
        else {
            return undefined;
        }
    }
    // tslint:enable
    /**
     * Add validation rules to the corresponding input element based on `name` attribute.
     * @param {string} name `name` of form field.
     * @param {Object} rules Validation rules for the corresponding element.
     * @return {void}
     */
    addRules(name, rules) {
        if (name) {
            if (this.rules.hasOwnProperty(name)) {
                extend(this.rules[name], rules, {});
            }
            else {
                this.rules[name] = rules;
            }
        }
    }
    /**
     * Remove validation to the corresponding field based on name attribute.
     * When no parameter is passed, remove all the validations in the form.
     * @param {string} name Input name attribute value.
     * @param {string[]} rules List of validation rules need to be remove from the corresponding element.
     * @return {void}
     */
    removeRules(name, rules) {
        if (!name && !rules) {
            this.rules = {};
        }
        else if (this.rules[name] && !rules) {
            delete this.rules[name];
        }
        else if (!isNullOrUndefined(this.rules[name] && rules)) {
            for (let i = 0; i < rules.length; i++) {
                delete this.rules[name][rules[i]];
            }
        }
        else {
            return;
        }
    }
    /**
     * Validate the current form values using defined rules.
     * Returns `true` when the form is valid otherwise `false`
     * @param {string} selected - Optional parameter to validate specified element.
     * @return {boolean}
     */
    validate(selected) {
        let rules = Object.keys(this.rules);
        if (selected && rules.length) {
            this.validateRules(selected);
            //filter the selected element it don't have any valid input element
            return rules.indexOf(selected) !== -1 && this.errorRules.filter((data) => {
                return data.name === selected;
            }).length === 0;
        }
        else {
            this.errorRules = [];
            for (let name of rules) {
                this.validateRules(name);
            }
            return this.errorRules.length === 0;
        }
    }
    /**
     * Reset the value of all the fields in form.
     * @return {void}
     */
    reset() {
        this.element.reset();
        this.clearForm();
    }
    /**
     * Get input element by name.
     * @param {string} name - Input element name attribute value.
     * @return {HTMLInputElement}
     */
    getInputElement(name) {
        this.inputElement = (select('[name="' + name + '"]', this.element));
        return this.inputElement;
    }
    /**
     * Destroy the form validator object and error elements.
     * @return {void}
     */
    destroy() {
        this.reset();
        this.unwireEvents();
        this.rules = {};
        let elements = selectAll('.' + this.errorClass + ', .' + this.validClass, this.element);
        for (let element of elements) {
            element.remove();
        }
        super.destroy();
        onIntlChange.off('notifyExternalChange', this.afterLocalization);
    }
    /**
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'locale':
                    this.localeFunc();
                    break;
            }
        }
    }
    ;
    /**
     * @private
     */
    localeFunc() {
        for (let key of Object.keys(this.defaultMessages)) {
            this.l10n.setLocale(this.locale);
            let value = this.l10n.getConstant(key);
            this.localyMessage[key] = value;
        }
    }
    /**
     * @private
     */
    getModuleName() {
        return 'formValidator';
    }
    /**
     * @private
     */
    // tslint:disable-next-line:no-any
    afterLocalization(args) {
        this.locale = args.locale;
        this.localeFunc();
    }
    clearForm() {
        this.errorRules = [];
        this.validated = [];
        let elements = selectAll(this.selectQuery, this.element);
        for (let element of elements) {
            let input = element;
            input.removeAttribute('aria-invalid');
            input.classList.remove(this.errorClass);
            if (input.name.length > 0) {
                this.getInputElement(input.name);
                this.getErrorElement(input.name);
                this.hideMessage(input.name);
            }
            input.classList.remove(this.validClass);
        }
    }
    createHTML5Rules() {
        let defRules = ['required', 'validateHidden', 'regex', 'rangeLength', 'maxLength', 'minLength', 'dateIso', 'digits',
            'pattern', 'data-val-required', 'type', 'data-validation', 'min', 'max', 'range', 'equalTo', 'data-val-minlength-min',
            'data-val-equalto-other', 'data-val-maxlength-max', 'data-val-range-min', 'data-val-regex-pattern', 'data-val-length-max',
            'data-val-creditcard', 'data-val-phone'];
        let acceptedTypes = ['hidden', 'email', 'url', 'date', 'number', 'tel'];
        for (let input of (this.inputElements)) {
            // Default attribute rules 
            let allRule = {};
            for (let rule of defRules) {
                if (input.getAttribute(rule) !== null) {
                    switch (rule) {
                        case 'required':
                            this.defRule(input, allRule, rule, input.required);
                            break;
                        case 'data-validation':
                            rule = input.getAttribute(rule);
                            this.defRule(input, allRule, rule, true);
                            break;
                        case 'type':
                            if (acceptedTypes.indexOf(input.type) !== -1) {
                                this.defRule(input, allRule, input.type, true);
                            }
                            break;
                        case 'rangeLength':
                        case 'range':
                            this.defRule(input, allRule, rule, JSON.parse(input.getAttribute(rule)));
                            break;
                        case 'equalTo':
                            let id = input.getAttribute(rule);
                            this.defRule(input, allRule, rule, id);
                            break;
                        default:
                            if (input.getAttribute('data-val') === 'true') {
                                this.annotationRule(input, allRule, rule, input.getAttribute(rule));
                            }
                            else {
                                this.defRule(input, allRule, rule, input.getAttribute(rule));
                            }
                    }
                }
            }
            //adding pattern type validation
            if (Object.keys(allRule).length !== 0) {
                this.addRules(input.name, allRule);
            }
        }
    }
    annotationRule(input, ruleCon, ruleName, value) {
        let annotationRule = ruleName.split('-');
        let rulesList = ['required', 'creditcard', 'phone', 'maxlength', 'minlength', 'range', 'regex', 'equalto'];
        let ruleFirstName = annotationRule[annotationRule.length - 1];
        let ruleSecondName = annotationRule[annotationRule.length - 2];
        if (rulesList.indexOf(ruleFirstName) !== -1) {
            switch (ruleFirstName) {
                case 'required':
                    this.defRule(input, ruleCon, 'required', value);
                    break;
                case 'creditcard':
                    this.defRule(input, ruleCon, 'creditcard', value);
                    break;
                case 'phone':
                    this.defRule(input, ruleCon, 'tel', value);
                    break;
            }
        }
        else if (rulesList.indexOf(ruleSecondName) !== -1) {
            switch (ruleSecondName) {
                case 'maxlength':
                    this.defRule(input, ruleCon, 'maxLength', value);
                    break;
                case 'minlength':
                    this.defRule(input, ruleCon, 'minLength', value);
                    break;
                case 'range':
                    let minvalue = input.getAttribute('data-val-range-min');
                    let maxvalue = input.getAttribute('data-val-range-max');
                    this.defRule(input, ruleCon, 'range', [minvalue, maxvalue]);
                    break;
                case 'equalto':
                    let id = input.getAttribute(ruleName).split('.');
                    this.defRule(input, ruleCon, 'equalTo', id[id.length - 1]);
                    break;
                case 'regex':
                    this.defRule(input, ruleCon, 'regex', value);
                    break;
            }
        }
    }
    defRule(input, ruleCon, ruleName, value) {
        let message = input.getAttribute('data-' + ruleName + '-message');
        let annotationMessage = input.getAttribute('data-val-' + ruleName);
        let customMessage;
        if (this.rules[input.name] && ruleName !== 'validateHidden' && ruleName !== 'hidden') {
            this.getInputElement(input.name);
            customMessage = this.getErrorMessage(this.rules[input.name][ruleName], ruleName);
        }
        if (message) {
            value = [value, message];
        }
        else if (annotationMessage) {
            value = [value, annotationMessage];
        }
        else if (customMessage) {
            value = [value, customMessage];
        }
        ruleCon[ruleName] = value;
    }
    // Wire events to the form elements
    wireEvents() {
        for (let input of (this.inputElements)) {
            if (FormValidator_1.isCheckable(input)) {
                EventHandler.add(input, 'click', this.clickHandler, this);
            }
            else if (input.tagName === 'SELECT') {
                EventHandler.add(input, 'change', this.changeHandler, this);
            }
            else {
                EventHandler.add(input, 'focusout', this.focusOutHandler, this);
                EventHandler.add(input, 'keyup', this.keyUpHandler, this);
            }
        }
        EventHandler.add(this.element, 'submit', this.submitHandler, this);
        EventHandler.add(this.element, 'reset', this.resetHandler, this);
    }
    // UnWire events to the form elements
    unwireEvents() {
        for (let input of (this.inputElements)) {
            EventHandler.clearEvents(input);
        }
        EventHandler.remove(this.element, 'submit', this.submitHandler);
        EventHandler.remove(this.element, 'reset', this.resetHandler);
    }
    // Handle input element focusout event
    focusOutHandler(e) {
        this.trigger('focusout', e);
        //FormValidator.triggerCallback(this.focusout, e);
        let element = e.target;
        if (this.rules[element.name]) {
            if (this.rules[element.name][this.required] || element.value.length > 0) {
                this.validate(element.name);
            }
            else if (this.validated.indexOf(element.name) === -1) {
                this.validated.push(element.name);
            }
        }
    }
    // Handle input element keyup event
    keyUpHandler(e) {
        this.trigger('keyup', e);
        let element = e.target;
        // List of keys need to prevent while validation
        let excludeKeys = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];
        if (e.which === 9 && (!this.rules[element.name] || (this.rules[element.name] && !this.rules[element.name][this.required]))) {
            return;
        }
        if (this.validated.indexOf(element.name) !== -1 && this.rules[element.name] && excludeKeys.indexOf(e.which) === -1) {
            this.validate(element.name);
        }
    }
    // Handle input click event
    clickHandler(e) {
        this.trigger('click', e);
        let element = e.target;
        // If element type is not submit allow validation
        if (element.type !== 'submit') {
            this.validate(element.name);
        }
        else if (element.getAttribute('formnovalidate') !== null) {
            // Prevent form validation, if submit button has formnovalidate attribute
            this.allowSubmit = true;
        }
    }
    // Handle input change event
    changeHandler(e) {
        this.trigger('change', e);
        let element = e.target;
        this.validate(element.name);
    }
    // Handle form submit event
    submitHandler(e) {
        this.trigger('submit', e);
        //FormValidator.triggerCallback(this.submit, e);
        // Prevent form submit if validation failed
        if (!this.allowSubmit && !this.validate()) {
            e.preventDefault();
        }
        else {
            this.allowSubmit = false;
        }
    }
    // Handle form reset
    resetHandler() {
        this.clearForm();
    }
    // Validate each rule based on input element name
    validateRules(name) {
        if (!this.rules[name]) {
            return;
        }
        let rules = Object.keys(this.rules[name]);
        let hiddenType = false;
        let validateHiddenType = false;
        let vhPos = rules.indexOf('validateHidden');
        let hPos = rules.indexOf('hidden');
        this.getInputElement(name);
        if (hPos !== -1) {
            hiddenType = true;
        }
        if (vhPos !== -1) {
            validateHiddenType = true;
        }
        if (!hiddenType || (hiddenType && validateHiddenType)) {
            if (vhPos !== -1) {
                rules.splice(vhPos, 1);
            }
            if (hPos !== -1) {
                rules.splice((hPos - 1), 1);
            }
            this.getErrorElement(name);
            for (let rule of rules) {
                let errorMessage = this.getErrorMessage(this.rules[name][rule], rule);
                let errorRule = { name: name, message: errorMessage };
                let eventArgs = {
                    inputName: name,
                    element: this.inputElement,
                    message: errorMessage
                };
                if (!this.isValid(name, rule) && !this.inputElement.classList.contains(this.ignore)) {
                    this.removeErrorRules(name);
                    this.errorRules.push(errorRule);
                    // Set aria attributes to invalid elements
                    this.inputElement.setAttribute('aria-invalid', 'true');
                    this.inputElement.setAttribute('aria-describedby', this.inputElement.id + '-info');
                    this.inputElement.classList.add(this.errorClass);
                    this.inputElement.classList.remove(this.validClass);
                    if (!this.infoElement) {
                        this.createErrorElement(name, errorRule.message, this.inputElement);
                    }
                    else {
                        this.showMessage(errorRule);
                    }
                    eventArgs.errorElement = this.infoElement;
                    eventArgs.status = 'failure';
                    this.inputElement.classList.add(this.errorClass);
                    this.inputElement.classList.remove(this.validClass);
                    this.optionalValidationStatus(name, eventArgs);
                    this.trigger('validationComplete', eventArgs);
                    // Set aria-required to required rule elements
                    if (rule === 'required') {
                        this.inputElement.setAttribute('aria-required', 'true');
                    }
                    break;
                }
                else {
                    this.hideMessage(name);
                    eventArgs.status = 'success';
                    this.trigger('validationComplete', eventArgs);
                }
            }
        }
        else {
            return;
        }
    }
    // Update the optional validation status
    optionalValidationStatus(name, refer) {
        if (!this.rules[name][this.required] && !this.inputElement.value.length && !isNullOrUndefined(this.infoElement)) {
            this.infoElement.innerHTML = this.inputElement.value;
            this.infoElement.setAttribute('aria-invalid', 'false');
            refer.status = '';
            this.hideMessage(name);
        }
    }
    // Check the input element whether it's value satisfy the validation rule or not
    isValid(name, rule) {
        let params = this.rules[name][rule];
        let param = (params instanceof Array && typeof params[1] === 'string') ? params[0] : params;
        let currentRule = this.rules[name][rule];
        let args = { value: this.inputElement.value, param: param, element: this.inputElement, formElement: this.element };
        this.trigger('validationBegin', args);
        if (currentRule && typeof currentRule[0] === 'function') {
            let fn = currentRule[0];
            return fn.call(this, { element: this.inputElement, value: this.inputElement.value });
        }
        else if (FormValidator_1.isCheckable(this.inputElement)) {
            if (rule !== 'required') {
                return true;
            }
            return selectAll('input[name=' + name + ']:checked', this.element).length > 0;
        }
        else {
            return FormValidator_1.checkValidator[rule](args);
        }
    }
    // Return default error message or custom error message 
    getErrorMessage(ruleValue, rule) {
        let message = this.inputElement.getAttribute('data-' + rule + '-message') ?
            this.inputElement.getAttribute('data-' + rule + '-message') :
            (ruleValue instanceof Array && typeof ruleValue[1] === 'string') ? ruleValue[1] :
                (Object.keys(this.localyMessage).length !== 0) ? this.localyMessage[rule] : this.defaultMessages[rule];
        let formats = message.match(/{(\d)}/g);
        if (!isNullOrUndefined(formats)) {
            for (let i = 0; i < formats.length; i++) {
                let value = ruleValue instanceof Array ? ruleValue[i] : ruleValue;
                message = message.replace(formats[i], value);
            }
        }
        return message;
    }
    // Create error element based on name and error message
    createErrorElement(name, message, input) {
        let errorElement = createElement(this.errorElement, {
            className: this.errorClass,
            innerHTML: message,
            attrs: { for: name }
        });
        // Create message design if errorOption is message
        if (this.errorOption === ErrorOption.Message) {
            errorElement.classList.remove(this.errorClass);
            errorElement.classList.add('e-message');
            errorElement = createElement(this.errorContainer, { className: this.errorClass, innerHTML: errorElement.outerHTML });
        }
        errorElement.id = this.inputElement.name + '-info';
        // Append error message into MVC error message element
        if (this.element.querySelector('[data-valmsg-for="' + input.id + '"]')) {
            this.element.querySelector('[data-valmsg-for="' + input.id + '"]').appendChild(errorElement);
        }
        else if (input.hasAttribute('data-msg-containerid') === true) {
            // Append error message into custom div element
            let containerId = input.getAttribute('data-msg-containerid');
            let divElement = this.element.querySelector('#' + containerId);
            divElement.appendChild(errorElement);
        }
        else if (this.customPlacement != null) {
            // Call custom placement function if customPlacement is not null
            this.customPlacement.call(this, this.inputElement, errorElement);
        }
        else {
            this.inputElement.parentNode.insertBefore(errorElement, this.inputElement.nextSibling);
        }
        errorElement.style.display = 'block';
        this.getErrorElement(name);
        this.validated.push(name);
        this.checkRequired(name);
    }
    // Get error element by name
    getErrorElement(name) {
        this.infoElement = select(this.errorElement + '.' + this.errorClass, this.inputElement.parentElement);
        if (!this.infoElement) {
            this.infoElement = select(this.errorElement + '.' + this.errorClass + '[for="' + name + '"]', this.element);
        }
        return this.infoElement;
    }
    // Remove existing rule from errorRules object
    removeErrorRules(name) {
        for (let i = 0; i < this.errorRules.length; i++) {
            let rule = this.errorRules[i];
            if (rule.name === name) {
                this.errorRules.splice(i, 1);
            }
        }
    }
    // Show error message to the input element
    showMessage(errorRule) {
        this.infoElement.style.display = 'block';
        this.infoElement.innerHTML = errorRule.message;
        this.checkRequired(errorRule.name);
    }
    // Hide error message based on input name
    hideMessage(name) {
        if (this.infoElement) {
            this.infoElement.style.display = 'none';
            this.removeErrorRules(name);
            this.inputElement.classList.add(this.validClass);
            this.inputElement.classList.remove(this.errorClass);
            this.inputElement.setAttribute('aria-invalid', 'false');
        }
    }
    // Check whether the input element have required rule and its value is not empty
    checkRequired(name) {
        if (!this.rules[name][this.required] && !this.inputElement.value.length && !isNullOrUndefined(this.infoElement)) {
            this.infoElement.innerHTML = this.inputElement.value;
            this.infoElement.setAttribute('aria-invalid', 'false');
            this.hideMessage(name);
        }
    }
    // Return boolean result if the input have chekcable or submit types
    static isCheckable(input) {
        let inputType = input.getAttribute('type');
        return inputType && (inputType === 'checkbox' || inputType === 'radio' || inputType === 'submit');
    }
};
// List of function to validate the rules
FormValidator.checkValidator = {
    required: (option) => {
        return option.value.length > 0;
    },
    email: (option) => {
        return regex.EMAIL.test(option.value);
    },
    url: (option) => {
        return regex.URL.test(option.value);
    },
    dateIso: (option) => {
        return regex.DATE_ISO.test(option.value);
    },
    tel: (option) => {
        return regex.PHONE.test(option.value);
    },
    creditcard: (option) => {
        return regex.CREDITCARD.test(option.value);
    },
    number: (option) => {
        return !isNaN(Number(option.value)) && option.value.indexOf(' ') === -1;
    },
    digits: (option) => {
        return regex.DIGITS.test(option.value);
    },
    maxLength: (option) => {
        return option.value.length <= option.param;
    },
    minLength: (option) => {
        return option.value.length >= option.param;
    },
    rangeLength: (option) => {
        let param = option.param;
        return option.value.length >= param[0] && option.value.length <= param[1];
    },
    range: (option) => {
        let param = option.param;
        return !isNaN(Number(option.value)) && Number(option.value) >= param[0] && Number(option.value) <= param[1];
    },
    date: (option) => {
        return !isNaN(new Date(option.value).getTime());
    },
    max: (option) => {
        if (!isNaN(Number(option.value))) {
            // Maximum rule validation for number
            return +option.value <= option.param;
        }
        // Maximum rule validation for date
        return new Date(option.value).getTime() <= new Date(JSON.parse(JSON.stringify(option.param))).getTime();
    },
    min: (option) => {
        if (!isNaN(Number(option.value))) {
            // Minimum rule validation for number
            return +option.value >= option.param;
        }
        else if ((option.value).indexOf(',') !== -1) {
            let uNum = (option.value).replace(/,/g, '');
            return parseFloat(uNum) >= option.param;
        }
        else {
            // Minimum rule validation for date
            return new Date(option.value).getTime() >= new Date(JSON.parse(JSON.stringify(option.param))).getTime();
        }
    },
    regex: (option) => {
        return new RegExp(option.param).test(option.value);
    },
    equalTo: (option) => {
        let compareTo = option.formElement.querySelector('#' + option.param);
        option.param = compareTo.value;
        return option.param === option.value;
    },
};
__decorate$3([
    Property('')
], FormValidator.prototype, "locale", void 0);
__decorate$3([
    Property('e-hidden')
], FormValidator.prototype, "ignore", void 0);
__decorate$3([
    Property()
], FormValidator.prototype, "rules", void 0);
__decorate$3([
    Property('e-error')
], FormValidator.prototype, "errorClass", void 0);
__decorate$3([
    Property('e-valid')
], FormValidator.prototype, "validClass", void 0);
__decorate$3([
    Property('label')
], FormValidator.prototype, "errorElement", void 0);
__decorate$3([
    Property('div')
], FormValidator.prototype, "errorContainer", void 0);
__decorate$3([
    Property(ErrorOption.Label)
], FormValidator.prototype, "errorOption", void 0);
__decorate$3([
    Event()
], FormValidator.prototype, "focusout", void 0);
__decorate$3([
    Event()
], FormValidator.prototype, "keyup", void 0);
__decorate$3([
    Event()
], FormValidator.prototype, "click", void 0);
__decorate$3([
    Event()
], FormValidator.prototype, "change", void 0);
__decorate$3([
    Event()
], FormValidator.prototype, "submit", void 0);
__decorate$3([
    Event()
], FormValidator.prototype, "validationBegin", void 0);
__decorate$3([
    Event()
], FormValidator.prototype, "validationComplete", void 0);
__decorate$3([
    Event()
], FormValidator.prototype, "customPlacement", void 0);
FormValidator = FormValidator_1 = __decorate$3([
    NotifyPropertyChanges
], FormValidator);

/**
 * Input box Component
 */

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const CONTROL_WRAPPER = 'e-upload';
const INPUT_WRAPPER = 'e-file-select';
const DROP_AREA = 'e-file-drop';
const DROP_WRAPPER = 'e-file-select-wrap';
const LIST_PARENT = 'e-upload-files';
const FILE = 'e-upload-file-list';
const STATUS = 'e-file-status';
const ACTION_BUTTONS = 'e-upload-actions';
const UPLOAD_BUTTONS = 'e-file-upload-btn e-css e-btn e-flat e-primary';
const CLEAR_BUTTONS = 'e-file-clear-btn e-css e-btn e-flat';
const FILE_NAME = 'e-file-name';
const FILE_TYPE = 'e-file-type';
const FILE_SIZE = 'e-file-size';
const REMOVE_ICON = 'e-file-remove-btn';
const DELETE_ICON = 'e-file-delete-btn';
const ABORT_ICON = 'e-file-abort-btn';
const RETRY_ICON = 'e-file-reload-btn';
const DRAG_HOVER = 'e-upload-drag-hover';
const PROGRESS_WRAPPER = 'e-upload-progress-wrap';
const PROGRESSBAR = 'e-upload-progress-bar';
const PROGRESSBAR_TEXT = 'e-progress-bar-text';
const UPLOAD_INPROGRESS = 'e-upload-progress';
const UPLOAD_SUCCESS = 'e-upload-success';
const UPLOAD_FAILED = 'e-upload-fails';
const TEXT_CONTAINER = 'e-file-container';
const VALIDATION_FAILS = 'e-validation-fails';
const RTL = 'e-rtl';
const DISABLED = 'e-disabled';
const RTL_CONTAINER = 'e-rtl-container';
const ICON_FOCUSED = 'e-clear-icon-focus';
const PROGRESS_INNER_WRAPPER = 'e-progress-inner-wrap';
const PAUSE_UPLOAD = 'e-file-pause-btn';
const RESUME_UPLOAD = 'e-file-play-btn';
const RESTRICT_RETRY = 'e-restrict-retry';
const wrapperAttr$1 = ['title', 'style', 'class'];
class FilesProp extends ChildProperty {
}
__decorate$4([
    Property('')
], FilesProp.prototype, "name", void 0);
__decorate$4([
    Property(null)
], FilesProp.prototype, "size", void 0);
__decorate$4([
    Property('')
], FilesProp.prototype, "type", void 0);
class ButtonsProps extends ChildProperty {
}
__decorate$4([
    Property('Browse...')
], ButtonsProps.prototype, "browse", void 0);
__decorate$4([
    Property('Upload')
], ButtonsProps.prototype, "upload", void 0);
__decorate$4([
    Property('Clear')
], ButtonsProps.prototype, "clear", void 0);
class AsyncSettings extends ChildProperty {
}
__decorate$4([
    Property('')
], AsyncSettings.prototype, "saveUrl", void 0);
__decorate$4([
    Property('')
], AsyncSettings.prototype, "removeUrl", void 0);
__decorate$4([
    Property(0)
], AsyncSettings.prototype, "chunkSize", void 0);
__decorate$4([
    Property(3)
], AsyncSettings.prototype, "retryCount", void 0);
__decorate$4([
    Property(500)
], AsyncSettings.prototype, "retryAfterDelay", void 0);
/**
 * The uploader component allows to upload images, documents, and other files from local to server.
 * ```html
 * <input type='file' name='images[]' id='upload'/>
 * ```
 * ```typescript
 * <script>
 *   var uploadObj = new Uploader();
 *   uploadObj.appendTo('#upload');
 * </script>
 * ```
 */
let Uploader = class Uploader extends Component {
    /**
     * Triggers when change the Uploader value.
     */
    constructor(options, element) {
        super(options, element);
        this.initialAttr = { accept: null, multiple: false, disabled: false };
        this.fileList = [];
        this.filesData = [];
        this.uploadedFilesData = [];
        this.base64String = [];
        this.isForm = false;
        this.allTypes = false;
        this.pausedData = [];
        this.uploadMetaData = [];
        this.tabIndex = '0';
        this.btnTabIndex = '0';
        this.disableKeyboardNavigation = false;
        this.count = -1;
        this.actionCompleteCount = 0;
        this.flag = true;
        this.selectedFiles = [];
        this.uploaderOptions = options;
    }
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'allowedExtensions':
                    this.setExtensions(this.allowedExtensions);
                    this.clearAll();
                    break;
                case 'enabled':
                    this.setControlStatus();
                    break;
                case 'multiple':
                    this.setMultipleSelection();
                    break;
                case 'enableRtl':
                    this.setRTL();
                    this.reRenderFileList();
                    break;
                case 'buttons':
                    this.buttons.browse = isNullOrUndefined(this.buttons.browse) ? '' : this.buttons.browse;
                    this.buttons.clear = isNullOrUndefined(this.buttons.clear) ? '' : this.buttons.clear;
                    this.buttons.upload = isNullOrUndefined(this.buttons.upload) ? '' : this.buttons.upload;
                    this.renderButtonTemplates();
                    break;
                case 'dropArea':
                    this.unBindDropEvents();
                    this.setDropArea();
                    break;
                case 'htmlAttributes':
                    this.updateHTMLAttrToElement();
                    this.updateHTMLAttrToWrapper();
                    this.checkHTMLAttributes(true);
                    break;
                case 'files':
                    this.renderPreLoadFiles();
                    break;
                case 'directoryUpload':
                    this.updateDirectoryAttributes();
                    break;
                case 'minFileSize':
                case 'maxFileSize':
                case 'template':
                case 'autoUpload':
                    this.clearAll();
                    break;
                case 'sequentialUpload':
                    this.clearAll();
                    break;
                case 'locale':
                    this.l10n.setLocale(this.locale);
                    this.setLocalizedTexts();
                    this.preLocaleObj = getValue('currentLocale', this.l10n);
                    break;
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
            }
        }
    }
    setLocalizedTexts() {
        if (isNullOrUndefined(this.template)) {
            if (typeof (this.buttons.browse) === 'string') {
                this.browseButton.innerText = (this.buttons.browse === 'Browse...') ?
                    this.localizedTexts('Browse') : this.buttons.browse;
                this.browseButton.setAttribute('title', this.browseButton.innerText);
                this.uploadWrapper.querySelector('.' + DROP_AREA).innerHTML = this.localizedTexts('dropFilesHint');
            }
            this.updateFileList();
        }
    }
    getKeyValue(val) {
        let keyValue;
        for (let key of Object.keys(this.preLocaleObj)) {
            if (this.preLocaleObj[key] === val) {
                keyValue = key;
            }
        }
        return keyValue;
    }
    updateFileList() {
        let element;
        /* istanbul ignore next */
        if (this.fileList.length > 0 && !isNullOrUndefined(this.uploadWrapper.querySelector('.' + LIST_PARENT))) {
            for (let i = 0; i < this.fileList.length; i++) {
                element = this.fileList[i].querySelector('.e-file-status');
                element.innerHTML = this.localizedTexts(this.getKeyValue(this.filesData[i].status));
                this.filesData[i].status = this.localizedTexts(this.getKeyValue(this.filesData[i].status));
                if (this.fileList[i].classList.contains(UPLOAD_SUCCESS)) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('delete'));
                }
                if (this.fileList[i].querySelector('.e-file-play-btn')) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('resume'));
                }
                if (this.fileList[i].querySelector('.e-file-remove-btn')) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('remove'));
                }
                if (this.fileList[i].querySelector('.e-file-reload-btn')) {
                    this.fileList[i].querySelector('.e-icons').setAttribute('title', this.localizedTexts('retry'));
                }
                if (!this.autoUpload) {
                    this.uploadButton.innerText = (this.buttons.upload === 'Upload') ?
                        this.localizedTexts('Upload') : this.buttons.upload;
                    this.uploadButton.setAttribute('title', this.localizedTexts('Upload'));
                    this.clearButton.innerText = (this.buttons.clear === 'Clear') ?
                        this.localizedTexts('Clear') : this.buttons.clear;
                    this.clearButton.setAttribute('title', this.localizedTexts('Clear'));
                }
            }
        }
    }
    reRenderFileList() {
        if (this.listParent) {
            detach(this.listParent);
            this.listParent = null;
            this.fileList = [];
            this.createFileList(this.filesData);
            if (this.actionButtons) {
                this.removeActionButtons();
                this.renderActionButtons();
                this.checkActionButtonStatus();
            }
        }
    }
    preRender() {
        this.cloneElement = this.element.cloneNode(true);
        this.localeText = { Browse: 'Browse...', Clear: 'Clear', Upload: 'Upload',
            dropFilesHint: 'Or drop files here', invalidMaxFileSize: 'File size is too large',
            invalidMinFileSize: 'File size is too small', invalidFileType: 'File type is not allowed',
            uploadFailedMessage: 'File failed to upload', uploadSuccessMessage: 'File uploaded successfully',
            removedSuccessMessage: 'File removed successfully', removedFailedMessage: 'Unable to remove file', inProgress: 'Uploading',
            readyToUploadMessage: 'Ready to upload', abort: 'Abort', remove: 'Remove', cancel: 'Cancel', delete: 'Delete file',
            pauseUpload: 'File upload paused', pause: 'Pause', resume: 'Resume', retry: 'Retry',
            fileUploadCancel: 'File upload canceled'
        };
        this.l10n = new L10n('uploader', this.localeText, this.locale);
        this.preLocaleObj = getValue('currentLocale', this.l10n);
        this.updateHTMLAttrToElement();
        this.checkHTMLAttributes(false);
        let parentEle = closest(this.element, 'form');
        if (!isNullOrUndefined(parentEle)) {
            for (; parentEle && parentEle !== document.documentElement; parentEle = parentEle.parentElement) {
                if (parentEle.tagName === 'FORM') {
                    this.isForm = true;
                    this.formElement = parentEle;
                    parentEle.setAttribute('enctype', 'multipart/form-data');
                    parentEle.setAttribute('encoding', 'multipart/form-data');
                }
            }
        }
        // tslint:disable-next-line
        let ejInstance = getValue('ej2_instances', this.element);
        /* istanbul ignore next */
        if (this.element.tagName === 'EJS-UPLOADER') {
            let inputElement = this.createElement('input', { attrs: { type: 'file' } });
            let index = 0;
            for (index; index < this.element.attributes.length; index++) {
                inputElement.setAttribute(this.element.attributes[index].nodeName, this.element.attributes[index].nodeValue);
                inputElement.innerHTML = this.element.innerHTML;
            }
            if (!inputElement.hasAttribute('name')) {
                inputElement.setAttribute('name', 'UploadFiles');
            }
            this.element.appendChild(inputElement);
            this.element = inputElement;
            setValue('ej2_instances', ejInstance, this.element);
        }
        /* istanbul ignore next */
        if (ejInstance[0].isPureReactComponent) {
            if (!isNullOrUndefined(ejInstance[0].props.name)) {
                this.element.setAttribute('name', ejInstance[0].props.name);
            }
            else if (!isNullOrUndefined(ejInstance[0].props.id) && isNullOrUndefined(ejInstance[0].props.name)) {
                this.element.setAttribute('name', ejInstance[0].props.id);
            }
            else {
                this.element.setAttribute('name', 'UploadFiles');
            }
        }
        if (isNullOrUndefined(this.element.getAttribute('name'))) {
            this.element.setAttribute('name', this.element.getAttribute('id'));
        }
        if (!this.element.hasAttribute('type')) {
            this.element.setAttribute('type', 'file');
        }
        this.updateDirectoryAttributes();
        this.keyConfigs = {
            enter: 'enter'
        };
        if (this.element.hasAttribute('tabindex')) {
            this.tabIndex = this.element.getAttribute('tabindex');
        }
        this.browserName = Browser.info.name;
    }
    getPersistData() {
        return this.addOnPersist([]);
    }
    /**
     * Return the module name of the component.
     */
    getModuleName() {
        return 'uploader';
    }
    updateDirectoryAttributes() {
        if (this.directoryUpload) {
            this.element.setAttribute('directory', 'true');
            this.element.setAttribute('webkitdirectory', 'true');
        }
        else {
            this.element.removeAttribute('directory');
            this.element.removeAttribute('webkitdirectory');
        }
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    render() {
        this.renderBrowseButton();
        this.initializeUpload();
        this.updateHTMLAttrToWrapper();
        this.wireEvents();
        this.setMultipleSelection();
        this.setExtensions(this.allowedExtensions);
        this.setRTL();
        this.renderPreLoadFiles();
        this.setControlStatus();
        this.setCSSClass();
        this.renderComplete();
    }
    renderBrowseButton() {
        this.browseButton = this.createElement('button', { className: 'e-css e-btn', attrs: { 'type': 'button' } });
        this.browseButton.setAttribute('tabindex', this.tabIndex);
        if (typeof (this.buttons.browse) === 'string') {
            this.browseButton.textContent = (this.buttons.browse === 'Browse...') ?
                this.localizedTexts('Browse') : this.buttons.browse;
            this.browseButton.setAttribute('title', this.browseButton.innerText);
        }
        else {
            this.browseButton.appendChild(this.buttons.browse);
        }
        this.element.setAttribute('aria-label', 'Uploader');
    }
    renderActionButtons() {
        this.element.setAttribute('tabindex', '-1');
        this.actionButtons = this.createElement('div', { className: ACTION_BUTTONS });
        this.uploadButton = this.createElement('button', { className: UPLOAD_BUTTONS,
            attrs: { 'type': 'button', 'tabindex': this.btnTabIndex } });
        this.clearButton = this.createElement('button', { className: CLEAR_BUTTONS,
            attrs: { 'type': 'button', 'tabindex': this.btnTabIndex } });
        this.actionButtons.appendChild(this.clearButton);
        this.actionButtons.appendChild(this.uploadButton);
        this.renderButtonTemplates();
        this.uploadWrapper.appendChild(this.actionButtons);
        this.browseButton.blur();
        this.uploadButton.focus();
        this.wireActionButtonEvents();
    }
    wireActionButtonEvents() {
        EventHandler.add(this.uploadButton, 'click', this.uploadButtonClick, this);
        EventHandler.add(this.clearButton, 'click', this.clearButtonClick, this);
    }
    unwireActionButtonEvents() {
        EventHandler.remove(this.uploadButton, 'click', this.uploadButtonClick);
        EventHandler.remove(this.clearButton, 'click', this.clearButtonClick);
    }
    removeActionButtons() {
        if (this.actionButtons) {
            this.unwireActionButtonEvents();
            detach(this.actionButtons);
            this.actionButtons = null;
        }
    }
    renderButtonTemplates() {
        if (typeof (this.buttons.browse) === 'string') {
            this.browseButton.textContent = (this.buttons.browse === 'Browse...') ?
                this.localizedTexts('Browse') : this.buttons.browse;
            this.browseButton.setAttribute('title', this.browseButton.textContent);
        }
        else {
            this.browseButton.innerHTML = '';
            this.browseButton.appendChild(this.buttons.browse);
        }
        if (this.uploadButton) {
            let uploadText;
            uploadText = isNullOrUndefined(this.buttons.upload) ? 'Upload' : this.buttons.upload;
            this.buttons.upload = uploadText;
            if (typeof (this.buttons.upload) === 'string') {
                this.uploadButton.textContent = (this.buttons.upload === 'Upload') ?
                    this.localizedTexts('Upload') : this.buttons.upload;
                this.uploadButton.setAttribute('title', this.uploadButton.textContent);
            }
            else {
                this.uploadButton.innerHTML = '';
                this.uploadButton.appendChild(this.buttons.upload);
            }
        }
        if (this.clearButton) {
            let clearText;
            clearText = isNullOrUndefined(this.buttons.clear) ? 'Clear' : this.buttons.clear;
            this.buttons.clear = clearText;
            if (typeof (this.buttons.clear) === 'string') {
                this.clearButton.textContent = (this.buttons.clear === 'Clear') ?
                    this.localizedTexts('Clear') : this.buttons.clear;
                this.clearButton.setAttribute('title', this.clearButton.textContent);
            }
            else {
                this.clearButton.innerHTML = '';
                this.clearButton.appendChild(this.buttons.clear);
            }
        }
    }
    initializeUpload() {
        this.element.setAttribute('tabindex', '-1');
        let inputWrapper = this.createElement('span', { className: INPUT_WRAPPER });
        this.element.parentElement.insertBefore(inputWrapper, this.element);
        this.dropAreaWrapper = this.createElement('div', { className: DROP_WRAPPER });
        this.element.parentElement.insertBefore(this.dropAreaWrapper, this.element);
        inputWrapper.appendChild(this.element);
        this.dropAreaWrapper.appendChild(this.browseButton);
        this.dropAreaWrapper.appendChild(inputWrapper);
        let fileDropArea = this.createElement('span', { className: DROP_AREA });
        fileDropArea.innerHTML = this.localizedTexts('dropFilesHint');
        this.dropAreaWrapper.appendChild(fileDropArea);
        this.uploadWrapper = this.createElement('div', { className: CONTROL_WRAPPER });
        this.dropAreaWrapper.parentElement.insertBefore(this.uploadWrapper, this.dropAreaWrapper);
        this.uploadWrapper.appendChild(this.dropAreaWrapper);
        this.setDropArea();
    }
    renderPreLoadFiles() {
        if (this.files.length) {
            if (isNullOrUndefined(this.files[0].size)) {
                return;
            }
            let files = [].slice.call(this.files);
            let filesData = [];
            if (!this.multiple) {
                this.clearData();
                files = [files[0]];
            }
            for (let data of files) {
                let fileData = {
                    name: data.name + '.' + data.type.split('.')[data.type.split('.').length - 1],
                    rawFile: '',
                    size: data.size,
                    status: this.localizedTexts('uploadSuccessMessage'),
                    type: data.type,
                    validationMessages: { minSize: '', maxSize: '' },
                    statusCode: '2'
                };
                filesData.push(fileData);
                this.filesData.push(fileData);
            }
            this.createFileList(filesData);
            if (!this.autoUpload && this.listParent && !this.actionButtons && (!this.isForm || this.allowUpload()) && this.showFileList) {
                this.renderActionButtons();
            }
            this.checkActionButtonStatus();
        }
    }
    checkActionButtonStatus() {
        if (this.actionButtons) {
            let length = this.uploadWrapper.querySelectorAll('.' + VALIDATION_FAILS).length +
                this.uploadWrapper.querySelectorAll('.e-upload-fails:not(.e-upload-progress)').length +
                this.uploadWrapper.querySelectorAll('span.' + UPLOAD_SUCCESS).length +
                this.uploadWrapper.querySelectorAll('span.' + UPLOAD_INPROGRESS).length;
            if (length > 0 && length === this.uploadWrapper.querySelectorAll('li').length) {
                this.uploadButton.setAttribute('disabled', 'disabled');
            }
            else {
                this.uploadButton.removeAttribute('disabled');
            }
        }
    }
    setDropArea() {
        let dropTextArea = this.dropAreaWrapper.querySelector('.e-file-drop');
        if (this.dropArea) {
            this.dropZoneElement = (typeof (this.dropArea) !== 'string') ? this.dropArea :
                document.querySelector(this.dropArea);
            let element = this.element;
            let enableDropText = false;
            while (element.parentNode) {
                element = element.parentNode;
                if (element === this.dropZoneElement) {
                    enableDropText = true;
                    dropTextArea.textContent = this.localizedTexts('dropFilesHint');
                }
            }
            if (!enableDropText) {
                dropTextArea.textContent = '';
            }
        }
        else {
            this.dropZoneElement = this.uploadWrapper;
            dropTextArea.textContent = this.localizedTexts('dropFilesHint');
        }
        this.bindDropEvents();
    }
    updateHTMLAttrToElement() {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (let pro of Object.keys(this.htmlAttributes)) {
                if (wrapperAttr$1.indexOf(pro) < 0) {
                    this.element.setAttribute(pro, this.htmlAttributes[pro]);
                }
            }
        }
    }
    updateHTMLAttrToWrapper() {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (let pro of Object.keys(this.htmlAttributes)) {
                if (wrapperAttr$1.indexOf(pro) > -1) {
                    if (pro === 'class') {
                        addClass([this.uploadWrapper], this.htmlAttributes[pro].split(' '));
                    }
                    else if (pro === 'style') {
                        let uploadStyle = this.uploadWrapper.getAttribute(pro);
                        uploadStyle = !isNullOrUndefined(uploadStyle) ? (uploadStyle + this.htmlAttributes[pro]) :
                            this.htmlAttributes[pro];
                        this.uploadWrapper.setAttribute(pro, uploadStyle);
                    }
                    else {
                        this.uploadWrapper.setAttribute(pro, this.htmlAttributes[pro]);
                    }
                }
            }
        }
    }
    setMultipleSelection() {
        if (this.multiple && !this.element.hasAttribute('multiple')) {
            let newAttr = document.createAttribute('multiple');
            newAttr.value = 'multiple';
            this.element.setAttributeNode(newAttr);
        }
        else if (!this.multiple) {
            this.element.removeAttribute('multiple');
        }
    }
    checkAutoUpload(fileData) {
        if (this.autoUpload) {
            if (this.sequentialUpload) {
                /* istanbul ignore next */
                this.sequenceUpload(fileData);
            }
            else {
                this.upload(fileData);
            }
            this.removeActionButtons();
        }
        else if (!this.actionButtons) {
            this.renderActionButtons();
        }
        this.checkActionButtonStatus();
    }
    sequenceUpload(fileData) {
        if (this.filesData.length - fileData.length === 0 ||
            this.filesData[(this.filesData.length - fileData.length - 1)].statusCode !== '1') {
            ++this.count;
            let isFileListCreated = this.showFileList ? false : true;
            if (typeof this.filesData[this.count] === 'object') {
                this.upload(this.filesData[this.count], isFileListCreated);
                if (this.filesData[this.count].statusCode === '0') {
                    this.sequenceUpload(fileData);
                }
            }
            else {
                --this.count;
            }
        }
    }
    setCSSClass(oldCSSClass) {
        if (this.cssClass) {
            addClass([this.uploadWrapper], this.cssClass.split(this.cssClass.indexOf(',') > -1 ? ',' : ' '));
        }
        if (oldCSSClass) {
            removeClass([this.uploadWrapper], oldCSSClass.split(' '));
        }
    }
    wireEvents() {
        EventHandler.add(this.browseButton, 'click', this.browseButtonClick, this);
        EventHandler.add(this.element, 'change', this.onSelectFiles, this);
        EventHandler.add(document, 'click', this.removeFocus, this);
        this.keyboardModule = new KeyboardEvents(this.uploadWrapper, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
        if (this.isForm) {
            EventHandler.add(this.formElement, 'reset', this.resetForm, this);
        }
    }
    unWireEvents() {
        EventHandler.remove(this.browseButton, 'click', this.browseButtonClick);
        EventHandler.remove(this.element, 'change', this.onSelectFiles);
        EventHandler.remove(document, 'click', this.removeFocus);
        if (this.isForm) {
            EventHandler.remove(this.formElement, 'reset', this.resetForm);
        }
        this.keyboardModule.destroy();
    }
    resetForm() {
        this.clearAll();
    }
    keyActionHandler(e) {
        let targetElement = e.target;
        switch (e.action) {
            case 'enter':
                if (e.target === this.clearButton) {
                    this.clearButtonClick();
                }
                else if (e.target === this.uploadButton) {
                    this.uploadButtonClick();
                }
                else if (e.target === this.browseButton) {
                    this.browseButtonClick();
                }
                else if (targetElement.classList.contains(PAUSE_UPLOAD)) {
                    let metaData = this.getCurrentMetaData(null, e);
                    metaData.file.statusCode = '4';
                    metaData.file.status = this.localizedTexts('pauseUpload');
                    this.abortUpload(metaData, false);
                }
                else if (targetElement.classList.contains(RESUME_UPLOAD)) {
                    this.resumeUpload(this.getCurrentMetaData(null, e), e);
                }
                else if (targetElement.classList.contains(RETRY_ICON)) {
                    let metaData = this.getCurrentMetaData(null, e);
                    if (!isNullOrUndefined(metaData)) {
                        metaData.file.statusCode = '1';
                        metaData.file.status = this.localizedTexts('readyToUploadMessage');
                        this.chunkUpload(metaData.file);
                    }
                    else {
                        let target = e.target.parentElement;
                        let fileData = this.filesData[this.fileList.indexOf(target)];
                        this.retry(fileData);
                    }
                }
                else {
                    this.removeFiles(e);
                    if (!targetElement.classList.contains(ABORT_ICON)) {
                        this.browseButton.focus();
                    }
                }
                e.preventDefault();
                e.stopPropagation();
                break;
        }
    }
    getCurrentMetaData(fileInfo, e) {
        let fileData;
        let targetMetaData;
        if (isNullOrUndefined(fileInfo)) {
            let target = e.target.parentElement;
            fileData = this.filesData[this.fileList.indexOf(target)];
        }
        else {
            fileData = fileInfo;
        }
        for (let i = 0; i < this.uploadMetaData.length; i++) {
            if (this.uploadMetaData[i].file.name === fileData.name) {
                targetMetaData = this.uploadMetaData[i];
            }
        }
        return targetMetaData;
    }
    removeFocus() {
        if (this.uploadWrapper && this.listParent && this.listParent.querySelector('.' + ICON_FOCUSED)) {
            document.activeElement.blur();
            this.listParent.querySelector('.' + ICON_FOCUSED).classList.remove(ICON_FOCUSED);
        }
    }
    browseButtonClick() {
        this.element.click();
    }
    uploadButtonClick() {
        if (this.sequentialUpload) {
            this.sequenceUpload(this.filesData);
        }
        else {
            this.upload(this.filesData);
        }
    }
    clearButtonClick() {
        this.clearAll();
        /* istanbul ignore next */
        if (this.sequentialUpload) {
            this.count = -1;
        }
        this.actionCompleteCount = 0;
    }
    bindDropEvents() {
        if (this.dropZoneElement) {
            EventHandler.add(this.dropZoneElement, 'drop', this.dropElement, this);
            EventHandler.add(this.dropZoneElement, 'dragover', this.dragHover, this);
            EventHandler.add(this.dropZoneElement, 'dragleave', this.onDragLeave, this);
            EventHandler.add(this.dropZoneElement, 'paste', this.onPasteFile, this);
        }
    }
    unBindDropEvents() {
        if (this.dropZoneElement) {
            EventHandler.remove(this.dropZoneElement, 'drop', this.dropElement);
            EventHandler.remove(this.dropZoneElement, 'dragover', this.dragHover);
            EventHandler.remove(this.dropZoneElement, 'dragleave', this.onDragLeave);
        }
    }
    onDragLeave(e) {
        this.dropZoneElement.classList.remove(DRAG_HOVER);
    }
    dragHover(e) {
        if (!this.enabled) {
            return;
        }
        this.dropZoneElement.classList.add(DRAG_HOVER);
        e.preventDefault();
        e.stopPropagation();
    }
    /* istanbul ignore next */
    dropElement(e) {
        this.dropZoneElement.classList.remove(DRAG_HOVER);
        this.onSelectFiles(e);
        e.preventDefault();
        e.stopPropagation();
    }
    /* istanbul ignore next */
    onPasteFile(event) {
        let item = event.clipboardData.items;
        if (item.length !== 1) {
            return;
        }
        let pasteFile = [].slice.call(item)[0];
        if ((pasteFile.kind === 'file') && pasteFile.type.match('^image/')) {
            this.renderSelectedFiles(event, [pasteFile.getAsFile()], false, true);
        }
    }
    removeFiles(args) {
        if (!this.enabled) {
            return;
        }
        let selectedElement = args.target.parentElement;
        let index = this.fileList.indexOf(selectedElement);
        let liElement = this.fileList[index];
        let fileData = this.filesData[index];
        if (isNullOrUndefined(fileData)) {
            return;
        }
        if (args.target.classList.contains(ABORT_ICON)) {
            fileData.statusCode = '5';
            if (!isNullOrUndefined(liElement)) {
                let spinnerTarget = liElement.querySelector('.' + ABORT_ICON);
                createSpinner({ target: spinnerTarget, width: '20px' });
                showSpinner(spinnerTarget);
            }
            if (this.sequentialUpload) {
                /* istanbul ignore next */
                this.uploadSequential();
            }
            if (!(liElement.classList.contains(RESTRICT_RETRY))) {
                this.checkActionComplete(true);
            }
        }
        else {
            this.remove(fileData, false, false, true, args);
        }
        this.element.value = '';
        this.checkActionButtonStatus();
    }
    removeFilesData(file, customTemplate) {
        let index;
        if (customTemplate) {
            if (!this.showFileList) {
                index = this.filesData.indexOf(file);
                this.filesData.splice(index, 1);
            }
            return;
        }
        let selectedElement = this.getLiElement(file);
        if (isNullOrUndefined(selectedElement)) {
            return;
        }
        detach(selectedElement);
        index = this.fileList.indexOf(selectedElement);
        this.fileList.splice(index, 1);
        this.filesData.splice(index, 1);
        if (this.fileList.length === 0 && !isNullOrUndefined(this.listParent)) {
            detach(this.listParent);
            this.listParent = null;
            this.removeActionButtons();
        }
        if (this.sequentialUpload) {
            /* istanbul ignore next */
            if (index <= this.count) {
                --this.count;
            }
        }
    }
    removeUploadedFile(file, eventArgs, removeDirectly, custom) {
        let selectedFiles = file;
        let ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
        ajax.emitError = false;
        let formData = new FormData();
        ajax.beforeSend = (e) => {
            eventArgs.currentRequest = ajax.httpRequest;
            if (!removeDirectly) {
                this.trigger('removing', eventArgs, (eventArgs) => {
                    if (eventArgs.cancel) {
                        e.cancel = true;
                    }
                    else {
                        this.removingEventCallback(eventArgs, formData, selectedFiles, file);
                    }
                });
            }
            else {
                this.removingEventCallback(eventArgs, formData, selectedFiles, file);
            }
        };
        ajax.onLoad = (e) => { this.removeCompleted(e, selectedFiles, custom); return {}; };
        /* istanbul ignore next */
        ajax.onError = (e) => { this.removeFailed(e, selectedFiles, custom); return {}; };
        ajax.send(formData);
    }
    removingEventCallback(eventArgs, formData, selectedFiles, file) {
        /* istanbul ignore next */
        let name = this.element.getAttribute('name');
        let liElement = this.getLiElement(file);
        if (!isNullOrUndefined(liElement) && (!isNullOrUndefined(liElement.querySelector('.' + DELETE_ICON)) ||
            !isNullOrUndefined(liElement.querySelector('.' + REMOVE_ICON)))) {
            let spinnerTarget;
            spinnerTarget = liElement.querySelector('.' + DELETE_ICON) ? liElement.querySelector('.' + DELETE_ICON) :
                liElement.querySelector('.' + REMOVE_ICON);
            createSpinner({ target: spinnerTarget, width: '20px' });
            showSpinner(spinnerTarget);
        }
        if (eventArgs.postRawFile && !isNullOrUndefined(selectedFiles.rawFile) && selectedFiles.rawFile !== '') {
            formData.append(name, selectedFiles.rawFile);
        }
        else {
            formData.append(name, selectedFiles.name);
        }
        this.updateFormData(formData, eventArgs.customFormData);
    }
    /* istanbul ignore next */
    updateFormData(formData, customData) {
        if (customData.length > 0 && customData[0]) {
            for (let i = 0; i < customData.length; i++) {
                let data = customData[i];
                // tslint:disable-next-line
                let value = Object.keys(data).map(function (e) {
                    return data[e];
                });
                formData.append(Object.keys(data)[0], value);
            }
        }
    }
    /* istanbul ignore next */
    updateCustomheader(request, currentRequest) {
        if (currentRequest.length > 0 && currentRequest[0]) {
            for (let i = 0; i < currentRequest.length; i++) {
                let data = currentRequest[i];
                // tslint:disable-next-line
                let value = Object.keys(data).map(function (e) {
                    return data[e];
                });
                request.setRequestHeader(Object.keys(data)[0], value);
            }
        }
    }
    removeCompleted(e, files, customTemplate) {
        let response = e && e.currentTarget ? this.getResponse(e) : null;
        let args = {
            e, response: response, operation: 'remove', file: this.updateStatus(files, this.localizedTexts('removedSuccessMessage'), '2')
        };
        this.trigger('success', args);
        this.removeFilesData(files, customTemplate);
        let index = this.uploadedFilesData.indexOf(files);
        this.uploadedFilesData.splice(index, 1);
        this.trigger('change', { files: this.uploadedFilesData });
    }
    removeFailed(e, files, customTemplate) {
        let response = e && e.currentTarget ? this.getResponse(e) : null;
        let args = {
            e, response: response, operation: 'remove', file: this.updateStatus(files, this.localizedTexts('removedFailedMessage'), '0')
        };
        if (!customTemplate) {
            let index = this.filesData.indexOf(files);
            let rootElement = this.fileList[index];
            if (rootElement) {
                let statusElement = rootElement.querySelector('.' + STATUS);
                rootElement.classList.remove(UPLOAD_SUCCESS);
                statusElement.classList.remove(UPLOAD_SUCCESS);
                rootElement.classList.add(UPLOAD_FAILED);
                statusElement.classList.add(UPLOAD_FAILED);
            }
            this.checkActionButtonStatus();
        }
        this.trigger('failure', args);
        let liElement = this.getLiElement(files);
        /* istanbul ignore next */
        if (!isNullOrUndefined(liElement) && !isNullOrUndefined(liElement.querySelector('.' + DELETE_ICON))) {
            let spinnerTarget = liElement.querySelector('.' + DELETE_ICON);
            hideSpinner(spinnerTarget);
            detach(liElement.querySelector('.e-spinner-pane'));
        }
    }
    /* istanbul ignore next */
    getFilesFromFolder(event) {
        this.filesEntries = [];
        let items;
        items = this.multiple ? event.dataTransfer.items : [event.dataTransfer.items[0]];
        let validDirectoryUpload = this.checkDirectoryUpload(items);
        if (!validDirectoryUpload) {
            return;
        }
        for (let i = 0; i < items.length; i++) {
            // tslint:disable-next-line
            let item = items[i].webkitGetAsEntry();
            if (item.isFile) {
                let files = [];
                // tslint:disable-next-line
                (item).file((fileObj) => {
                    let path = item.fullPath;
                    files.push({ 'path': path, 'file': fileObj });
                });
                this.renderSelectedFiles(event, files, true);
            }
            else if (item.isDirectory) {
                this.traverseFileTree(item, event);
            }
        }
    }
    /* istanbul ignore next */
    checkDirectoryUpload(items) {
        for (let i = 0; i < items.length; i++) {
            // tslint:disable-next-line
            let item = items[i].webkitGetAsEntry();
            if (item.isDirectory) {
                return true;
            }
        }
        return false;
    }
    // tslint:disable
    /* istanbul ignore next */
    traverseFileTree(item, event) {
        if (typeof (item) === 'boolean') {
            let files = [];
            for (let i = 0; i < this.filesEntries.length; i++) {
                this.filesEntries[i].file((fileObj) => {
                    let path = this.filesEntries[i].fullPath;
                    files.push({ 'path': path, 'file': fileObj });
                });
            }
            this.renderSelectedFiles(event, files, true);
        }
        else if (item.isFile) {
            this.filesEntries.push(item);
        }
        else if (item.isDirectory) {
            // tslint:disable-next-line
            let directoryReader = item.createReader();
            // tslint:disable-next-line
            directoryReader.readEntries((entries) => {
                for (let i = 0; i < entries.length; i++) {
                    this.traverseFileTree(entries[i]);
                    // tslint:disable-next-line
                }
                
                this.traverseFileTree(true);
                this.filesEntries = [];
            });
        }
    }
    // tslint:enable
    onSelectFiles(args) {
        if (!this.enabled) {
            return;
        }
        let targetFiles;
        /* istanbul ignore next */
        if (args.type === 'drop') {
            if (this.directoryUpload) {
                this.getFilesFromFolder(args);
            }
            else {
                let files = this.sortFilesList = args.dataTransfer.files;
                this.element.files = files;
                targetFiles = this.multiple ? this.sortFileList(files) : [files[0]];
                this.renderSelectedFiles(args, targetFiles);
            }
        }
        else {
            targetFiles = [].slice.call(args.target.files);
            this.renderSelectedFiles(args, targetFiles);
        }
    }
    /* istanbul ignore next */
    getBase64(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    }
    /* istanbul ignore next */
    renderSelectedFiles(args, 
    // tslint:disable-next-line
    targetFiles, directory, paste) {
        return __awaiter(this, void 0, void 0, function* () {
            let eventArgs = {
                event: args,
                cancel: false,
                filesData: [],
                isModified: false,
                modifiedFilesData: [],
                progressInterval: '',
                isCanceled: false,
                currentRequest: null,
                customFormData: null
            };
            /* istanbul ignore next */
            if (targetFiles.length < 1) {
                eventArgs.isCanceled = true;
                this.trigger('selected', eventArgs);
                return;
            }
            this.flag = true;
            let fileData = [];
            if (!this.multiple) {
                this.clearData(true);
                targetFiles = [targetFiles[0]];
            }
            for (let i = 0; i < targetFiles.length; i++) {
                let file = directory ? targetFiles[i].file : targetFiles[i];
                /* istanbul ignore next */
                if (isBlazor()) {
                    let data = yield this.getBase64(file);
                    this.base64String.push(data);
                }
                let fileName = directory ? targetFiles[i].path.substring(1, targetFiles[i].path.length) : paste ?
                    getUniqueID(file.name.substring(0, file.name.lastIndexOf('.'))) + '.' + this.getFileType(file.name) :
                    this.directoryUpload ? targetFiles[i].webkitRelativePath : file.name;
                let fileDetails = {
                    name: fileName,
                    rawFile: file,
                    size: file.size,
                    status: this.localizedTexts('readyToUploadMessage'),
                    type: this.getFileType(file.name),
                    validationMessages: this.validatedFileSize(file.size),
                    statusCode: '1'
                };
                /* istanbul ignore next */
                if (paste) {
                    fileDetails.fileSource = 'paste';
                }
                fileDetails.status = fileDetails.validationMessages.minSize !== '' ? this.localizedTexts('invalidMinFileSize') :
                    fileDetails.validationMessages.maxSize !== '' ? this.localizedTexts('invalidMaxFileSize') : fileDetails.status;
                if (fileDetails.validationMessages.minSize !== '' || fileDetails.validationMessages.maxSize !== '') {
                    fileDetails.statusCode = '0';
                    this.checkActionComplete(true);
                }
                fileData.push(fileDetails);
            }
            eventArgs.filesData = fileData;
            if (this.allowedExtensions.indexOf('*') > -1) {
                this.allTypes = true;
            }
            if (!this.allTypes) {
                fileData = this.checkExtension(fileData);
            }
            this.trigger('selected', eventArgs, (eventArgs) => {
                if (!eventArgs.cancel) {
                    /* istanbul ignore next */
                    if (isBlazor()) {
                        this.currentRequestHeader = eventArgs.currentRequest;
                        this.customFormDatas = eventArgs.customFormData;
                    }
                    this.selectedFiles = fileData;
                    this.btnTabIndex = this.disableKeyboardNavigation ? '-1' : '0';
                    if (this.showFileList) {
                        if (eventArgs.isModified && eventArgs.modifiedFilesData.length > 0) {
                            let dataFiles = this.allTypes ? eventArgs.modifiedFilesData :
                                this.checkExtension(eventArgs.modifiedFilesData);
                            this.updateSortedFileList(dataFiles);
                            this.filesData = dataFiles;
                            if (!this.isForm || this.allowUpload()) {
                                this.checkAutoUpload(dataFiles);
                            }
                        }
                        else {
                            this.createFileList(fileData);
                            this.filesData = this.filesData.concat(fileData);
                            if (!this.isForm || this.allowUpload()) {
                                this.checkAutoUpload(fileData);
                            }
                        }
                        if (!isNullOrUndefined(eventArgs.progressInterval) && eventArgs.progressInterval !== '') {
                            this.progressInterval = eventArgs.progressInterval;
                        }
                    }
                    else {
                        this.filesData = this.filesData.concat(fileData);
                        if (this.autoUpload) {
                            this.upload(this.filesData, true);
                        }
                    }
                    this.raiseActionComplete();
                }
            });
        });
    }
    allowUpload() {
        let allowFormUpload = false;
        if (this.isForm && (!isNullOrUndefined(this.asyncSettings.saveUrl) && this.asyncSettings.saveUrl !== '')) {
            allowFormUpload = true;
        }
        return allowFormUpload;
    }
    clearData(singleUpload) {
        if (!isNullOrUndefined(this.listParent)) {
            detach(this.listParent);
            this.listParent = null;
        }
        if (this.browserName !== 'msie' && !singleUpload) {
            this.element.value = '';
        }
        this.fileList = [];
        this.filesData = [];
        this.removeActionButtons();
    }
    updateSortedFileList(filesData) {
        let previousListClone = this.createElement('div', { id: 'clonewrapper' });
        let added = -1;
        let removedList;
        if (this.listParent) {
            for (let i = 0; i < this.listParent.querySelectorAll('li').length; i++) {
                let liElement = this.listParent.querySelectorAll('li')[i];
                previousListClone.appendChild(liElement.cloneNode(true));
            }
            removedList = this.listParent.querySelectorAll('li');
            for (let item of removedList) {
                detach(item);
            }
            this.removeActionButtons();
            let oldList = [].slice.call(previousListClone.childNodes);
            detach(this.listParent);
            this.listParent = null;
            this.fileList = [];
            this.createParentUL();
            for (let index = 0; index < filesData.length; index++) {
                for (let j = 0; j < this.filesData.length; j++) {
                    if (this.filesData[j].name === filesData[index].name) {
                        this.listParent.appendChild(oldList[j]);
                        EventHandler.add(oldList[j].querySelector('.e-icons'), 'click', this.removeFiles, this);
                        this.fileList.push(oldList[j]);
                        added = index;
                    }
                }
                if (added !== index) {
                    this.createFileList([filesData[index]]);
                }
            }
        }
        else {
            this.createFileList(filesData);
        }
    }
    isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }
    checkExtension(files) {
        let dropFiles = files;
        if (!this.isBlank(this.allowedExtensions)) {
            let allowedExtensions = [];
            let extensions = this.allowedExtensions.split(',');
            for (let extension of extensions) {
                allowedExtensions.push(extension.trim().toLocaleLowerCase());
            }
            for (let i = 0; i < files.length; i++) {
                if (allowedExtensions.indexOf(('.' + files[i].type).toLocaleLowerCase()) === -1) {
                    files[i].status = this.localizedTexts('invalidFileType');
                    files[i].statusCode = '0';
                }
            }
        }
        return dropFiles;
    }
    validatedFileSize(fileSize) {
        let minSizeError = '';
        let maxSizeError = '';
        if (fileSize < this.minFileSize) {
            minSizeError = this.localizedTexts('invalidMinFileSize');
        }
        else if (fileSize > this.maxFileSize) {
            maxSizeError = this.localizedTexts('invalidMaxFileSize');
        }
        else {
            minSizeError = '';
            maxSizeError = '';
        }
        let errorMessage = { minSize: minSizeError, maxSize: maxSizeError };
        return errorMessage;
    }
    isPreLoadFile(fileData) {
        let isPreload = false;
        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i].name === fileData.name.slice(0, fileData.name.lastIndexOf('.')) && this.files[i].type === fileData.type) {
                isPreload = true;
            }
        }
        return isPreload;
    }
    createCustomfileList(fileData) {
        this.createParentUL();
        resetBlazorTemplate(this.element.id + 'Template', 'Template');
        for (let listItem of fileData) {
            let liElement = this.createElement('li', { className: FILE, attrs: { 'data-file-name': listItem.name } });
            this.uploadTemplateFn = this.templateComplier(this.template);
            let fromElements = [].slice.call(this.uploadTemplateFn(listItem, null, null, this.element.id + 'Template', this.isStringTemplate));
            let index = fileData.indexOf(listItem);
            append(fromElements, liElement);
            let eventArgs = {
                element: liElement,
                fileInfo: listItem,
                index: index,
                isPreload: this.isPreLoadFile(listItem)
            };
            let eventsArgs = {
                element: liElement,
                fileInfo: listItem,
                index: index,
                isPreload: this.isPreLoadFile(listItem)
            };
            this.trigger('rendering', eventArgs);
            this.trigger('fileListRendering', eventsArgs);
            this.listParent.appendChild(liElement);
            this.fileList.push(liElement);
        }
        updateBlazorTemplate(this.element.id + 'Template', 'Template', this);
    }
    createParentUL() {
        if (isNullOrUndefined(this.listParent)) {
            this.listParent = this.createElement('ul', { className: LIST_PARENT });
            this.uploadWrapper.appendChild(this.listParent);
        }
    }
    createFileList(fileData) {
        this.createParentUL();
        if (this.template !== '' && !isNullOrUndefined(this.template)) {
            this.createCustomfileList(fileData);
        }
        else {
            for (let listItem of fileData) {
                let liElement = this.createElement('li', { className: FILE, attrs: { 'data-file-name': listItem.name } });
                let textContainer = this.createElement('span', { className: TEXT_CONTAINER });
                let textElement = this.createElement('span', { className: FILE_NAME, attrs: { 'title': listItem.name } });
                textElement.innerHTML = this.getFileNameOnly(listItem.name);
                let fileExtension = this.createElement('span', { className: FILE_TYPE });
                fileExtension.innerHTML = '.' + this.getFileType(listItem.name);
                if (!this.enableRtl) {
                    textContainer.appendChild(textElement);
                    textContainer.appendChild(fileExtension);
                }
                else {
                    let rtlContainer = this.createElement('span', { className: RTL_CONTAINER });
                    rtlContainer.appendChild(fileExtension);
                    rtlContainer.appendChild(textElement);
                    textContainer.appendChild(rtlContainer);
                }
                let fileSize = this.createElement('span', { className: FILE_SIZE });
                fileSize.innerHTML = this.bytesToSize(listItem.size);
                textContainer.appendChild(fileSize);
                let statusElement = this.createElement('span', { className: STATUS });
                textContainer.appendChild(statusElement);
                statusElement.innerHTML = listItem.status;
                liElement.appendChild(textContainer);
                let iconElement = this.createElement('span', { className: ' e-icons', attrs: { 'tabindex': this.btnTabIndex } });
                /* istanbul ignore next */
                if (this.browserName === 'msie') {
                    iconElement.classList.add('e-msie');
                }
                iconElement.setAttribute('title', this.localizedTexts('remove'));
                liElement.appendChild(iconElement);
                EventHandler.add(iconElement, 'click', this.removeFiles, this);
                if (listItem.statusCode === '2') {
                    statusElement.classList.add(UPLOAD_SUCCESS);
                    iconElement.classList.add(DELETE_ICON);
                    iconElement.setAttribute('title', this.localizedTexts('delete'));
                }
                else if (listItem.statusCode !== '1') {
                    statusElement.classList.remove(UPLOAD_SUCCESS);
                    statusElement.classList.add(VALIDATION_FAILS);
                }
                if (this.autoUpload && listItem.statusCode === '1' && this.asyncSettings.saveUrl !== '') {
                    statusElement.innerHTML = '';
                }
                if (!iconElement.classList.contains(DELETE_ICON)) {
                    iconElement.classList.add(REMOVE_ICON);
                }
                let index = fileData.indexOf(listItem);
                let eventArgs = {
                    element: liElement,
                    fileInfo: listItem,
                    index: index,
                    isPreload: this.isPreLoadFile(listItem)
                };
                let eventsArgs = {
                    element: liElement,
                    fileInfo: listItem,
                    index: index,
                    isPreload: this.isPreLoadFile(listItem)
                };
                this.trigger('rendering', eventArgs);
                this.trigger('fileListRendering', eventsArgs);
                this.listParent.appendChild(liElement);
                this.fileList.push(liElement);
                this.truncateName(textElement);
            }
        }
    }
    getSlicedName(nameElement) {
        let text;
        text = nameElement.textContent;
        nameElement.dataset.tail = text.slice(text.length - 10);
    }
    truncateName(name) {
        let nameElement = name;
        if (this.browserName !== 'edge' && nameElement.offsetWidth < nameElement.scrollWidth) {
            this.getSlicedName(nameElement);
            /* istanbul ignore next */
        }
        else if (nameElement.offsetWidth + 1 < nameElement.scrollWidth) {
            this.getSlicedName(nameElement);
        }
    }
    getFileType(name) {
        let extension;
        let index = name.lastIndexOf('.');
        if (index >= 0) {
            extension = name.substring(index + 1);
        }
        return extension ? extension : '';
    }
    getFileNameOnly(name) {
        let type = this.getFileType(name);
        let names = name.split('.' + type);
        return type = names[0];
    }
    setInitialAttributes() {
        if (this.initialAttr.accept) {
            this.element.setAttribute('accept', this.initialAttr.accept);
        }
        if (this.initialAttr.disabled) {
            this.element.setAttribute('disabled', 'disabled');
        }
        if (this.initialAttr.multiple) {
            let newAttr = document.createAttribute('multiple');
            this.element.setAttributeNode(newAttr);
        }
    }
    filterfileList(files) {
        let filterFiles = [];
        let li;
        for (let i = 0; i < files.length; i++) {
            li = this.getLiElement(files[i]);
            if (!li.classList.contains(UPLOAD_SUCCESS)) {
                filterFiles.push(files[i]);
            }
        }
        return filterFiles;
    }
    updateStatus(files, status, statusCode, updateLiStatus = true) {
        if (!(status === '' || isNullOrUndefined(status)) && !(statusCode === '' || isNullOrUndefined(statusCode))) {
            files.status = status;
            files.statusCode = statusCode;
        }
        if (updateLiStatus) {
            let li = this.getLiElement(files);
            if (!isNullOrUndefined(li)) {
                if (!isNullOrUndefined(li.querySelector('.' + STATUS)) && !((status === '' || isNullOrUndefined(status)))) {
                    li.querySelector('.' + STATUS).textContent = status;
                }
            }
        }
        return files;
    }
    getLiElement(files) {
        let index;
        for (let i = 0; i < this.filesData.length; i++) {
            if (this.filesData[i].name === files.name) {
                index = i;
            }
        }
        return this.fileList[index];
    }
    createProgressBar(liElement) {
        let progressbarWrapper = this.createElement('span', { className: PROGRESS_WRAPPER });
        let progressBar = this.createElement('progressbar', { className: PROGRESSBAR, attrs: { value: '0', max: '100' } });
        let progressbarInnerWrapper = this.createElement('span', { className: PROGRESS_INNER_WRAPPER });
        progressBar.setAttribute('style', 'width: 0%');
        let progressbarText = this.createElement('span', { className: PROGRESSBAR_TEXT });
        progressbarText.textContent = '0%';
        progressbarInnerWrapper.appendChild(progressBar);
        progressbarWrapper.appendChild(progressbarInnerWrapper);
        progressbarWrapper.appendChild(progressbarText);
        liElement.querySelector('.' + TEXT_CONTAINER).appendChild(progressbarWrapper);
    }
    /* istanbul ignore next */
    updateProgressbar(e, li) {
        if (!isNaN(Math.round((e.loaded / e.total) * 100)) && !isNullOrUndefined(li.querySelector('.' + PROGRESSBAR))) {
            if (!isNullOrUndefined(this.progressInterval) && this.progressInterval !== '') {
                let value = (Math.round((e.loaded / e.total) * 100)) % parseInt(this.progressInterval, 10);
                if (value === 0 || value === 100) {
                    this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
                }
            }
            else {
                this.changeProgressValue(li, Math.round((e.loaded / e.total) * 100).toString() + '%');
            }
        }
    }
    changeProgressValue(li, progressValue) {
        li.querySelector('.' + PROGRESSBAR).setAttribute('style', 'width:' + progressValue);
        li.querySelector('.' + PROGRESSBAR_TEXT).textContent = progressValue;
    }
    uploadInProgress(e, files, customUI, request) {
        let li = this.getLiElement(files);
        if (isNullOrUndefined(li) && (!customUI)) {
            return;
        }
        if (!isNullOrUndefined(li)) {
            /* istanbul ignore next */
            if (files.statusCode === '5') {
                this.cancelUploadingFile(files, e, request, li);
            }
            if (!(li.querySelectorAll('.' + PROGRESS_WRAPPER).length > 0) && li.querySelector('.' + STATUS)) {
                li.querySelector('.' + STATUS).classList.add(UPLOAD_INPROGRESS);
                this.createProgressBar(li);
                this.updateProgressBarClasses(li, UPLOAD_INPROGRESS);
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_FAILED);
            }
            this.updateProgressbar(e, li);
            let iconEle = li.querySelector('.' + REMOVE_ICON);
            if (!isNullOrUndefined(iconEle)) {
                iconEle.classList.add(ABORT_ICON, UPLOAD_INPROGRESS);
                iconEle.setAttribute('title', this.localizedTexts('abort'));
                iconEle.classList.remove(REMOVE_ICON);
            }
        }
        else {
            this.cancelUploadingFile(files, e, request);
        }
        let args = { e, operation: 'upload', file: this.updateStatus(files, this.localizedTexts('inProgress'), '3') };
        this.trigger('progress', args);
    }
    /* istanbul ignore next */
    cancelUploadingFile(files, e, request, li) {
        if (files.statusCode === '5') {
            let eventArgs = {
                event: e,
                fileData: files,
                cancel: false
            };
            this.trigger('canceling', eventArgs, (eventArgs) => {
                if (eventArgs.cancel) {
                    files.statusCode = '3';
                    if (!isNullOrUndefined(li)) {
                        let spinnerTarget = li.querySelector('.' + ABORT_ICON);
                        if (!isNullOrUndefined(spinnerTarget)) {
                            hideSpinner(spinnerTarget);
                            detach(li.querySelector('.e-spinner-pane'));
                        }
                    }
                }
                else {
                    request.emitError = false;
                    request.httpRequest.abort();
                    let formData = new FormData();
                    if (files.statusCode === '5') {
                        let name = this.element.getAttribute('name');
                        formData.append(name, files.name);
                        formData.append('cancel-uploading', files.name);
                        let ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
                        ajax.emitError = false;
                        ajax.onLoad = (e) => { this.removecanceledFile(e, files); return {}; };
                        ajax.send(formData);
                    }
                }
            });
        }
    }
    removecanceledFile(e, file) {
        let liElement = this.getLiElement(file);
        if (liElement.querySelector('.' + RETRY_ICON) || isNullOrUndefined(liElement.querySelector('.' + ABORT_ICON))) {
            return;
        }
        this.updateStatus(file, this.localizedTexts('fileUploadCancel'), '5');
        this.renderFailureState(e, file, liElement);
        let spinnerTarget = liElement.querySelector('.' + REMOVE_ICON);
        if (!isNullOrUndefined(liElement)) {
            hideSpinner(spinnerTarget);
            detach(liElement.querySelector('.e-spinner-pane'));
        }
        let requestResponse = e && e.currentTarget ? this.getResponse(e) : null;
        let args = { event: e, response: requestResponse, operation: 'cancel', file: file };
        this.trigger('success', args);
    }
    renderFailureState(e, file, liElement) {
        this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
        this.removeProgressbar(liElement, 'failure');
        if (!isNullOrUndefined(liElement.querySelector('.e-file-status'))) {
            liElement.querySelector('.e-file-status').classList.add(UPLOAD_FAILED);
        }
        let deleteIcon = liElement.querySelector('.' + ABORT_ICON);
        if (isNullOrUndefined(deleteIcon)) {
            return;
        }
        deleteIcon.classList.remove(ABORT_ICON, UPLOAD_INPROGRESS);
        deleteIcon.classList.add(REMOVE_ICON);
        deleteIcon.setAttribute('title', this.localizedTexts('remove'));
        this.pauseButton = this.createElement('span', { className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': this.btnTabIndex } });
        liElement.insertBefore(this.pauseButton, deleteIcon);
        this.pauseButton.setAttribute('title', this.localizedTexts('retry'));
        let retryElement = liElement.querySelector('.' + RETRY_ICON);
        /* istanbul ignore next */
        retryElement.addEventListener('click', (e) => { this.reloadcanceledFile(e, file, liElement, false); }, false);
    }
    reloadcanceledFile(e, file, liElement, custom) {
        file.statusCode = '1';
        file.status = this.localizedTexts('readyToUploadMessage');
        if (!custom) {
            liElement.querySelector('.' + STATUS).classList.remove(UPLOAD_FAILED);
            if (!isNullOrUndefined(liElement.querySelector('.' + RETRY_ICON))) {
                detach(liElement.querySelector('.' + RETRY_ICON));
            }
            this.pauseButton = null;
        }
        /* istanbul ignore next */
        liElement.classList.add(RESTRICT_RETRY);
        this.upload([file]);
    }
    /* istanbul ignore next */
    uploadComplete(e, file, customUI) {
        let status = e.target;
        if (status.readyState === 4 && status.status >= 200 && status.status <= 299) {
            let li = this.getLiElement(file);
            if (isNullOrUndefined(li) && (!customUI || isNullOrUndefined(customUI))) {
                return;
            }
            if (!isNullOrUndefined(li)) {
                this.updateProgressBarClasses(li, UPLOAD_SUCCESS);
                this.removeProgressbar(li, 'success');
                let iconEle = li.querySelector('.' + ABORT_ICON);
                if (!isNullOrUndefined(iconEle)) {
                    iconEle.classList.add(DELETE_ICON);
                    iconEle.setAttribute('title', this.localizedTexts('delete'));
                    iconEle.classList.remove(ABORT_ICON);
                    iconEle.classList.remove(UPLOAD_INPROGRESS);
                }
            }
            this.raiseSuccessEvent(e, file);
        }
        else {
            this.uploadFailed(e, file);
        }
    }
    getResponse(e) {
        // tslint:disable-next-line
        let target = e.currentTarget;
        let response = {
            readyState: target.readyState,
            statusCode: target.status,
            statusText: target.statusText,
            headers: target.getAllResponseHeaders(),
            withCredentials: target.withCredentials
        };
        return response;
    }
    raiseSuccessEvent(e, file) {
        let response = e && e.currentTarget ? this.getResponse(e) : null;
        let statusMessage = this.localizedTexts('uploadSuccessMessage');
        let args = {
            e, response: response, operation: 'upload', file: this.updateStatus(file, statusMessage, '2', false), statusText: statusMessage
        };
        this.trigger('success', args, (args) => {
            // tslint:disable-next-line
            this.updateStatus(file, args.statusText, '2');
            this.uploadedFilesData.push(file);
            this.trigger('change', { file: this.uploadedFilesData });
            this.checkActionButtonStatus();
            if (this.fileList.length > 0) {
                if ((!(this.getLiElement(file)).classList.contains(RESTRICT_RETRY))) {
                    this.uploadSequential();
                    this.checkActionComplete(true);
                }
                else {
                    /* istanbul ignore next */
                    (this.getLiElement(file)).classList.remove(RESTRICT_RETRY);
                }
            }
        });
    }
    uploadFailed(e, file) {
        let li = this.getLiElement(file);
        let response = e && e.currentTarget ? this.getResponse(e) : null;
        let statusMessage = this.localizedTexts('uploadFailedMessage');
        let args = {
            e, response: response, operation: 'upload', file: this.updateStatus(file, statusMessage, '0', false), statusText: statusMessage
        };
        if (!isNullOrUndefined(li)) {
            this.renderFailureState(e, file, li);
        }
        this.trigger('failure', args, (args) => {
            // tslint:disable-next-line
            this.updateStatus(file, args.statusText, '0');
            this.checkActionButtonStatus();
            this.uploadSequential();
            this.checkActionComplete(true);
        });
    }
    uploadSequential() {
        if (this.sequentialUpload) {
            if (this.autoUpload) {
                /* istanbul ignore next */
                this.checkAutoUpload(this.filesData);
            }
            else {
                this.uploadButtonClick();
            }
        }
    }
    checkActionComplete(increment) {
        increment ? ++this.actionCompleteCount : --this.actionCompleteCount;
        this.raiseActionComplete();
    }
    raiseActionComplete() {
        if ((this.filesData.length === this.actionCompleteCount) && this.flag) {
            this.flag = false;
            let eventArgs = {
                fileData: []
            };
            eventArgs.fileData = this.getSelectedFileStatus(this.selectedFiles);
            this.trigger('actionComplete', eventArgs);
        }
    }
    getSelectedFileStatus(selectedFiles) {
        let matchFiles = [];
        let matchFilesIndex = 0;
        for (let selectFileIndex = 0; selectFileIndex < selectedFiles.length; selectFileIndex++) {
            let selectedFileData = selectedFiles[selectFileIndex];
            for (let fileDataIndex = 0; fileDataIndex < this.filesData.length; fileDataIndex++) {
                if (this.filesData[fileDataIndex].name === selectedFileData.name) {
                    matchFiles[matchFilesIndex] = this.filesData[fileDataIndex];
                    ++matchFilesIndex;
                }
            }
        }
        return matchFiles;
    }
    updateProgressBarClasses(li, className) {
        let progressBar = li.querySelector('.' + PROGRESSBAR);
        if (!isNullOrUndefined(progressBar)) {
            progressBar.classList.add(className);
        }
    }
    removeProgressbar(li, callType) {
        if (!isNullOrUndefined(li.querySelector('.' + PROGRESS_WRAPPER))) {
            this.progressAnimation = new Animation({ duration: 1250 });
            this.progressAnimation.animate(li.querySelector('.' + PROGRESS_WRAPPER), { name: 'FadeOut' });
            this.progressAnimation.animate(li.querySelector('.' + PROGRESSBAR_TEXT), { name: 'FadeOut' });
            setTimeout(() => { this.animateProgressBar(li, callType); }, 750);
        }
    }
    /* istanbul ignore next */
    animateProgressBar(li, callType) {
        if (callType === 'success') {
            li.classList.add(UPLOAD_SUCCESS);
            if (!isNullOrUndefined(li.querySelector('.' + STATUS))) {
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_INPROGRESS);
                this.progressAnimation.animate(li.querySelector('.' + STATUS), { name: 'FadeIn' });
                li.querySelector('.' + STATUS).classList.add(UPLOAD_SUCCESS);
            }
        }
        else {
            if (!isNullOrUndefined(li.querySelector('.' + STATUS))) {
                li.querySelector('.' + STATUS).classList.remove(UPLOAD_INPROGRESS);
                this.progressAnimation.animate(li.querySelector('.' + STATUS), { name: 'FadeIn' });
                li.querySelector('.' + STATUS).classList.add(UPLOAD_FAILED);
            }
        }
        if (li.querySelector('.' + PROGRESS_WRAPPER)) {
            detach(li.querySelector('.' + PROGRESS_WRAPPER));
        }
    }
    setExtensions(extensions) {
        if (extensions !== '' && !isNullOrUndefined(extensions)) {
            this.element.setAttribute('accept', extensions);
        }
        else {
            this.element.removeAttribute('accept');
        }
    }
    templateComplier(uploadTemplate) {
        if (uploadTemplate) {
            try {
                if (document.querySelectorAll(uploadTemplate).length) {
                    return compile(document.querySelector(uploadTemplate).innerHTML.trim());
                }
            }
            catch (exception) {
                return compile(uploadTemplate);
            }
        }
        return undefined;
    }
    setRTL() {
        this.enableRtl ? addClass([this.uploadWrapper], RTL) : removeClass([this.uploadWrapper], RTL);
    }
    localizedTexts(localeText) {
        this.l10n.setLocale(this.locale);
        return this.l10n.getConstant(localeText);
    }
    setControlStatus() {
        if (!this.enabled) {
            this.uploadWrapper.classList.add(DISABLED);
            this.element.setAttribute('disabled', 'disabled');
            this.browseButton.setAttribute('disabled', 'disabled');
            if (!isNullOrUndefined(this.clearButton)) {
                this.clearButton.setAttribute('disabled', 'disabled');
            }
            if (!isNullOrUndefined(this.uploadButton)) {
                this.uploadButton.setAttribute('disabled', 'disabled');
            }
        }
        else {
            if (this.uploadWrapper.classList.contains(DISABLED)) {
                this.uploadWrapper.classList.remove(DISABLED);
            }
            if (!isNullOrUndefined(this.browseButton) && this.element.hasAttribute('disabled')) {
                this.element.removeAttribute('disabled');
                this.browseButton.removeAttribute('disabled');
            }
            if (!isNullOrUndefined(this.clearButton) && this.clearButton.hasAttribute('disabled')) {
                this.clearButton.removeAttribute('disabled');
            }
            if (!isNullOrUndefined(this.uploadButton) && this.uploadButton.hasAttribute('disabled')) {
                this.uploadButton.hasAttribute('disabled');
            }
        }
    }
    checkHTMLAttributes(isDynamic) {
        let attributes$$1 = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['accept', 'multiple', 'disabled'];
        for (let prop of attributes$$1) {
            if (!isNullOrUndefined(this.element.getAttribute(prop))) {
                switch (prop) {
                    case 'accept':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.uploaderOptions) || (this.uploaderOptions['allowedExtensions'] === undefined))
                            || isDynamic) {
                            this.setProperties({ allowedExtensions: this.element.getAttribute('accept') }, !isDynamic);
                            this.initialAttr.accept = this.allowedExtensions;
                        }
                        break;
                    case 'multiple':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.uploaderOptions) || (this.uploaderOptions['multiple'] === undefined)) || isDynamic) {
                            let isMutiple = this.element.getAttribute(prop) === 'multiple' ||
                                this.element.getAttribute(prop) === '' || this.element.getAttribute(prop) === 'true' ? true : false;
                            this.setProperties({ multiple: isMutiple }, !isDynamic);
                            this.initialAttr.multiple = true;
                        }
                        break;
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.uploaderOptions) || (this.uploaderOptions['enabled'] === undefined)) || isDynamic) {
                            let isDisabled = this.element.getAttribute(prop) === 'disabled' ||
                                this.element.getAttribute(prop) === '' || this.element.getAttribute(prop) === 'true' ? false : true;
                            this.setProperties({ enabled: isDisabled }, !isDynamic);
                            this.initialAttr.disabled = true;
                        }
                }
            }
        }
    }
    chunkUpload(file, custom, fileIndex) {
        let start = 0;
        let end = Math.min(this.asyncSettings.chunkSize, file.size);
        let index = 0;
        let blob = file.rawFile.slice(start, end);
        let metaData = { chunkIndex: index, blob: blob, file: file, start: start, end: end, retryCount: 0, request: null };
        this.sendRequest(file, metaData, custom, fileIndex);
    }
    sendRequest(file, metaData, custom, fileIndex) {
        let formData = new FormData();
        let cloneFile;
        let blob = file.rawFile.slice(metaData.start, metaData.end);
        formData.append('chunkFile', blob, file.name);
        formData.append('chunk-index', metaData.chunkIndex.toString());
        formData.append('chunkIndex', metaData.chunkIndex.toString());
        let totalChunk = Math.max(Math.ceil(file.size / this.asyncSettings.chunkSize), 1);
        formData.append('total-chunk', totalChunk.toString());
        formData.append('totalChunk', totalChunk.toString());
        let ajax = new Ajax({ url: this.asyncSettings.saveUrl, type: 'POST', async: true, contentType: null });
        ajax.emitError = false;
        ajax.onLoad = (e) => { this.chunkUploadComplete(e, metaData, custom); return {}; };
        ajax.onUploadProgress = (e) => {
            this.chunkUploadInProgress(e, metaData, custom);
            return {};
        };
        let eventArgs = {
            fileData: file,
            customFormData: [],
            cancel: false,
            chunkSize: this.asyncSettings.chunkSize === 0 ? null : this.asyncSettings.chunkSize
        };
        ajax.beforeSend = (e) => {
            eventArgs.currentRequest = ajax.httpRequest;
            eventArgs.currentChunkIndex = metaData.chunkIndex;
            /* istanbul ignore next */
            if (isBlazor()) {
                cloneFile = new File([file.rawFile], file.name);
                eventArgs.fileData.rawFile = fileIndex ? this.base64String[fileIndex] : null;
                if (this.currentRequestHeader) {
                    this.updateCustomheader(ajax.httpRequest, this.currentRequestHeader);
                }
                if (this.customFormDatas) {
                    this.updateFormData(formData, this.customFormDatas);
                }
            }
            if (eventArgs.currentChunkIndex === 0) {
                // This event is currently not required but to avoid breaking changes for previous customer, we have included.
                this.trigger('uploading', eventArgs, (eventArgs) => {
                    if (isBlazor()) {
                        eventArgs.fileData.rawFile = cloneFile;
                    }
                    this.uploadingEventCallback(formData, eventArgs, e, file);
                });
            }
            else {
                this.trigger('chunkUploading', eventArgs, (eventArgs) => {
                    if (isBlazor()) {
                        eventArgs.fileData.rawFile = cloneFile;
                    }
                    this.uploadingEventCallback(formData, eventArgs, e, file);
                });
            }
        };
        /* istanbul ignore next */
        ajax.onError = (e) => { this.chunkUploadFailed(e, metaData, custom); return {}; };
        ajax.send(formData);
        metaData.request = ajax;
    }
    uploadingEventCallback(formData, eventArgs, e, file) {
        if (eventArgs.cancel) {
            this.eventCancelByArgs(e, eventArgs, file);
        }
        else {
            this.updateFormData(formData, eventArgs.customFormData);
        }
    }
    eventCancelByArgs(e, eventArgs, file) {
        e.cancel = true;
        if (eventArgs.fileData.statusCode === '5') {
            return;
        }
        let liElement = this.getLiElement(eventArgs.fileData);
        liElement.querySelector('.' + STATUS).innerHTML = this.localizedTexts('fileUploadCancel');
        liElement.querySelector('.' + STATUS).classList.add(UPLOAD_FAILED);
        eventArgs.fileData.statusCode = '5';
        eventArgs.fileData.status = this.localizedTexts('fileUploadCancel');
        this.pauseButton = this.createElement('span', { className: 'e-icons e-file-reload-btn', attrs: { 'tabindex': this.btnTabIndex } });
        liElement.insertBefore(this.pauseButton, liElement.querySelector('.' + REMOVE_ICON));
        this.pauseButton.setAttribute('title', this.localizedTexts('retry'));
        /* istanbul ignore next */
        this.pauseButton.addEventListener('click', (e) => { this.reloadcanceledFile(e, file, liElement); }, false);
        this.checkActionButtonStatus();
    }
    checkChunkUpload() {
        return (this.asyncSettings.chunkSize <= 0 || isNullOrUndefined(this.asyncSettings.chunkSize)) ? false : true;
    }
    chunkUploadComplete(e, metaData, custom) {
        let response = e.target;
        let liElement;
        if (response.readyState === 4 && response.status >= 200 && response.status < 300) {
            let requestResponse = e && e.currentTarget ? this.getResponse(e) : null;
            let totalChunk = Math.max(Math.ceil(metaData.file.size / this.asyncSettings.chunkSize), 1);
            let eventArgs = {
                event: e,
                file: metaData.file,
                chunkIndex: metaData.chunkIndex,
                totalChunk: totalChunk,
                chunkSize: this.asyncSettings.chunkSize,
                response: requestResponse
            };
            this.trigger('chunkSuccess', eventArgs);
            if (isNullOrUndefined(custom) || !custom) {
                liElement = this.getLiElement(metaData.file);
            }
            this.updateMetaData(metaData);
            if (metaData.end === metaData.file.size) {
                metaData.file.statusCode = '3';
            }
            if (metaData.file.statusCode === '5') {
                let eventArgs = { event: e, fileData: metaData.file, cancel: false };
                this.trigger('canceling', eventArgs, (eventArgs) => {
                    /* istanbul ignore next */
                    if (eventArgs.cancel) {
                        metaData.file.statusCode = '3';
                        let spinnerTarget = liElement.querySelector('.' + ABORT_ICON);
                        if (!isNullOrUndefined(liElement) && !isNullOrUndefined(spinnerTarget)) {
                            hideSpinner(spinnerTarget);
                            detach(liElement.querySelector('.e-spinner-pane'));
                        }
                        this.sendNextRequest(metaData);
                    }
                    else {
                        metaData.request.emitError = false;
                        response.abort();
                        let formData = new FormData();
                        let name = this.element.getAttribute('name');
                        formData.append(name, metaData.file.name);
                        formData.append('cancel-uploading', metaData.file.name);
                        formData.append('cancelUploading', metaData.file.name);
                        let ajax = new Ajax(this.asyncSettings.removeUrl, 'POST', true, null);
                        ajax.emitError = false;
                        ajax.onLoad = (e) => { this.removeChunkFile(e, metaData, custom); return {}; };
                        ajax.send(formData);
                    }
                });
            }
            else {
                if ((totalChunk - 1) === metaData.chunkIndex && totalChunk > metaData.chunkIndex) {
                    let index = this.pausedData.indexOf(metaData);
                    if (index >= 0) {
                        this.pausedData.splice(index, 1);
                    }
                    if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom) && liElement) {
                        if (liElement) {
                            detach(liElement.querySelector('.' + PAUSE_UPLOAD));
                        }
                        this.removeChunkProgressBar(metaData);
                    }
                    this.raiseSuccessEvent(e, metaData.file);
                    return;
                }
                this.sendNextRequest(metaData);
            }
        }
        else {
            this.chunkUploadFailed(e, metaData);
        }
    }
    sendNextRequest(metaData) {
        metaData.start = metaData.end;
        metaData.end += this.asyncSettings.chunkSize;
        metaData.end = Math.min(metaData.end, metaData.file.size);
        metaData.chunkIndex += 1;
        this.sendRequest(metaData.file, metaData);
    }
    removeChunkFile(e, metaData, custom) {
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) && !custom)) {
            let liElement = this.getLiElement(metaData.file);
            let deleteIcon = liElement.querySelector('.' + ABORT_ICON);
            let spinnerTarget = deleteIcon;
            this.updateStatus(metaData.file, this.localizedTexts('fileUploadCancel'), '5');
            this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
            this.removeProgressbar(liElement, 'failure');
            deleteIcon.classList.remove(ABORT_ICON);
            deleteIcon.classList.add(REMOVE_ICON);
            deleteIcon.setAttribute('title', this.localizedTexts('remove'));
            let pauseIcon = liElement.querySelector('.' + PAUSE_UPLOAD);
            pauseIcon.classList.add(RETRY_ICON);
            pauseIcon.classList.remove(PAUSE_UPLOAD);
            pauseIcon.setAttribute('title', this.localizedTexts('retry'));
            if (!isNullOrUndefined(liElement) && !isNullOrUndefined(deleteIcon)) {
                hideSpinner(spinnerTarget);
                detach(liElement.querySelector('.e-spinner-pane'));
            }
        }
    }
    pauseUpload(metaData, e, custom) {
        metaData.file.statusCode = '4';
        metaData.file.status = this.localizedTexts('pause');
        this.updateMetaData(metaData);
        let eventArgs = {
            event: e ? e : null,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            chunkCount: Math.round(metaData.file.size / this.asyncSettings.chunkSize),
            chunkSize: this.asyncSettings.chunkSize
        };
        this.abortUpload(metaData, custom, eventArgs);
    }
    abortUpload(metaData, custom, eventArgs) {
        metaData.request.emitError = false;
        metaData.request.httpRequest.abort();
        let liElement = this.getLiElement(metaData.file);
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom)) {
            let targetElement = liElement.querySelector('.' + PAUSE_UPLOAD);
            targetElement.classList.remove(PAUSE_UPLOAD);
            targetElement.classList.add(RESUME_UPLOAD);
            targetElement.setAttribute('title', this.localizedTexts('resume'));
            targetElement.nextElementSibling.classList.add(REMOVE_ICON);
            targetElement.nextElementSibling.classList.remove(ABORT_ICON);
            targetElement.nextElementSibling.setAttribute('title', this.localizedTexts('remove'));
        }
        for (let i = 0; i < this.pausedData.length; i++) {
            if (this.pausedData[i].file.name === metaData.file.name) {
                this.pausedData.splice(i, 1);
            }
        }
        this.pausedData.push(metaData);
        this.trigger('pausing', eventArgs);
    }
    resumeUpload(metaData, e, custom) {
        let liElement = this.getLiElement(metaData.file);
        let targetElement;
        if (!isNullOrUndefined(liElement)) {
            targetElement = liElement.querySelector('.' + RESUME_UPLOAD);
        }
        if (!isNullOrUndefined(targetElement) && (isNullOrUndefined(custom) || !custom)) {
            targetElement.classList.remove(RESUME_UPLOAD);
            targetElement.classList.add(PAUSE_UPLOAD);
            targetElement.setAttribute('title', this.localizedTexts('pause'));
            targetElement.nextElementSibling.classList.remove(REMOVE_ICON);
            targetElement.nextElementSibling.classList.add(ABORT_ICON);
            targetElement.nextElementSibling.setAttribute('title', this.localizedTexts('abort'));
        }
        metaData.file.status = this.localizedTexts('inProgress');
        metaData.file.statusCode = '3';
        this.updateMetaData(metaData);
        let eventArgs = {
            event: e ? e : null,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            chunkCount: Math.round(metaData.file.size / this.asyncSettings.chunkSize),
            chunkSize: this.asyncSettings.chunkSize
        };
        this.trigger('resuming', eventArgs);
        for (let i = 0; i < this.pausedData.length; i++) {
            if (this.pausedData[i].end === this.pausedData[i].file.size) {
                this.chunkUploadComplete(e, metaData, custom);
            }
            else {
                if (this.pausedData[i].file.name === metaData.file.name) {
                    this.pausedData[i].start = this.pausedData[i].end;
                    this.pausedData[i].end = this.pausedData[i].end + this.asyncSettings.chunkSize;
                    this.pausedData[i].end = Math.min(this.pausedData[i].end, this.pausedData[i].file.size);
                    this.pausedData[i].chunkIndex = this.pausedData[i].chunkIndex + 1;
                    this.sendRequest(this.pausedData[i].file, this.pausedData[i], custom);
                }
            }
        }
    }
    updateMetaData(metaData) {
        if (this.uploadMetaData.indexOf(metaData) === -1) {
            this.uploadMetaData.push(metaData);
        }
        else {
            this.uploadMetaData.splice(this.uploadMetaData.indexOf(metaData), 1);
            this.uploadMetaData.push(metaData);
        }
    }
    removeChunkProgressBar(metaData) {
        let liElement = this.getLiElement(metaData.file);
        if (!isNullOrUndefined(liElement)) {
            this.updateProgressBarClasses(liElement, UPLOAD_SUCCESS);
            this.removeProgressbar(liElement, 'success');
            let cancelButton = liElement.querySelector('.' + ABORT_ICON);
            if (!isNullOrUndefined(cancelButton)) {
                cancelButton.classList.add(DELETE_ICON);
                cancelButton.setAttribute('title', this.localizedTexts('delete'));
                cancelButton.classList.remove(ABORT_ICON, UPLOAD_INPROGRESS);
            }
        }
    }
    chunkUploadFailed(e, metaData, custom) {
        let chunkCount = Math.max(Math.ceil(metaData.file.size / this.asyncSettings.chunkSize), 1);
        let liElement;
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom)) {
            liElement = this.getLiElement(metaData.file);
        }
        let requestResponse = e && e.currentTarget ? this.getResponse(e) : null;
        let eventArgs = {
            event: e,
            file: metaData.file,
            chunkIndex: metaData.chunkIndex,
            totalChunk: chunkCount,
            chunkSize: this.asyncSettings.chunkSize,
            cancel: false,
            response: requestResponse
        };
        this.trigger('chunkFailure', eventArgs, (eventArgs) => {
            // To prevent triggering of failure event
            // tslint:disable-next-line
            if (!eventArgs.cancel) {
                if (metaData.retryCount < this.asyncSettings.retryCount) {
                    setTimeout(() => { this.retryRequest(liElement, metaData, custom); }, this.asyncSettings.retryAfterDelay);
                }
                else {
                    if (!isNullOrUndefined(liElement)) {
                        let pauseButton = liElement.querySelector('.' + PAUSE_UPLOAD) ?
                            liElement.querySelector('.' + PAUSE_UPLOAD) : liElement.querySelector('.' + RESUME_UPLOAD);
                        if (!isNullOrUndefined(pauseButton)) {
                            pauseButton.classList.add(RETRY_ICON);
                            pauseButton.classList.remove(PAUSE_UPLOAD, RESUME_UPLOAD);
                        }
                        this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
                        this.removeProgressbar(liElement, 'failure');
                        liElement.querySelector('.e-icons').classList.remove(UPLOAD_INPROGRESS);
                        let iconElement = liElement.querySelector('.' + ABORT_ICON) ?
                            liElement.querySelector('.' + ABORT_ICON) : liElement.querySelector('.' + REMOVE_ICON);
                        iconElement.classList.remove(ABORT_ICON);
                        if (!isNullOrUndefined(liElement.querySelector('.' + PAUSE_UPLOAD))) {
                            detach(liElement.querySelector('.' + PAUSE_UPLOAD));
                        }
                        if (metaData.start > 0) {
                            iconElement.classList.add(DELETE_ICON);
                            iconElement.setAttribute('title', this.localizedTexts('delete'));
                        }
                        else {
                            iconElement.classList.add(REMOVE_ICON);
                            iconElement.setAttribute('title', this.localizedTexts('remove'));
                        }
                    }
                    metaData.retryCount = 0;
                    let file = metaData.file;
                    let failureMessage = this.localizedTexts('uploadFailedMessage');
                    let args = {
                        e, response: requestResponse,
                        operation: 'upload',
                        file: this.updateStatus(file, failureMessage, '0', false),
                        statusText: failureMessage
                    };
                    this.trigger('failure', args, (args) => {
                        // tslint:disable-next-line
                        this.updateStatus(file, args.statusText, '0');
                        this.uploadSequential();
                        this.checkActionComplete(true);
                    });
                }
            }
        });
    }
    retryRequest(liElement, metaData, custom) {
        if (isNullOrUndefined(this.template) && (isNullOrUndefined(custom) || !custom) && liElement) {
            this.updateProgressBarClasses(liElement, UPLOAD_FAILED);
        }
        metaData.retryCount += 1;
        this.sendRequest(metaData.file, metaData);
    }
    checkPausePlayAction(e) {
        let targetElement = e.target;
        let selectedElement = e.target.parentElement;
        let index = this.fileList.indexOf(selectedElement);
        let fileData = this.filesData[index];
        let metaData = this.getCurrentMetaData(fileData);
        if (targetElement.classList.contains(PAUSE_UPLOAD)) {
            /* istanbul ignore next */
            this.pauseUpload(metaData, e);
        }
        else if (targetElement.classList.contains(RESUME_UPLOAD)) {
            /* istanbul ignore next */
            this.resumeUpload(metaData, e);
        }
        else if (targetElement.classList.contains(RETRY_ICON)) {
            if (metaData.file.status === this.localizedTexts('fileUploadCancel')) {
                this.retryUpload(metaData, false);
            }
            else {
                this.retryUpload(metaData, true);
            }
        }
    }
    retryUpload(metaData, fromcanceledStage) {
        if (fromcanceledStage) {
            metaData.end = metaData.end + this.asyncSettings.chunkSize;
            metaData.start = metaData.start + this.asyncSettings.chunkSize;
            this.sendRequest(metaData.file, metaData);
        }
        else {
            metaData.file.statusCode = '1';
            metaData.file.status = this.localizedTexts('readyToUploadMessage');
            this.chunkUpload(metaData.file);
        }
        /* istanbul ignore next */
        (this.getLiElement(metaData.file)).classList.add(RESTRICT_RETRY);
    }
    chunkUploadInProgress(e, metaData, custom) {
        if (metaData.file.statusCode === '4') {
            return;
        }
        if (metaData.file.statusCode !== '4' && metaData.file.statusCode !== '5') {
            metaData.file.statusCode = '3';
            metaData.file.status = this.localizedTexts('inProgress');
        }
        this.updateMetaData(metaData);
        let liElement = this.getLiElement(metaData.file);
        if (isNullOrUndefined(liElement)) {
            return;
        }
        let retryElement = liElement.querySelector('.' + RETRY_ICON);
        if (!isNullOrUndefined(retryElement)) {
            retryElement.classList.add(PAUSE_UPLOAD);
            retryElement.setAttribute('title', this.localizedTexts('pause'));
            retryElement.classList.remove(RETRY_ICON);
        }
        if (!isNullOrUndefined(liElement)) {
            if (!(liElement.querySelectorAll('.' + PROGRESS_WRAPPER).length > 0)) {
                let statusElement = liElement.querySelector('.' + STATUS);
                if (isNullOrUndefined(this.template)) {
                    statusElement.classList.add(UPLOAD_INPROGRESS);
                    statusElement.classList.remove(UPLOAD_FAILED);
                    this.createProgressBar(liElement);
                    this.updateProgressBarClasses(liElement, UPLOAD_INPROGRESS);
                }
                let clearIcon = liElement.querySelector('.' + REMOVE_ICON) ? liElement.querySelector('.' + REMOVE_ICON) :
                    liElement.querySelector('.' + DELETE_ICON);
                if (!isNullOrUndefined(clearIcon)) {
                    clearIcon.classList.add(ABORT_ICON);
                    clearIcon.setAttribute('title', this.localizedTexts('abort'));
                    clearIcon.classList.remove(REMOVE_ICON);
                }
            }
            if (!isNaN(Math.round((e.loaded / e.total) * 100)) && isNullOrUndefined(this.template) && metaData.file.statusCode !== '4') {
                let loadedSize = (metaData.chunkIndex * this.asyncSettings.chunkSize);
                let value = Math.min((((loadedSize + e.loaded) / metaData.file.size) * 100), 100);
                this.changeProgressValue(liElement, Math.round(value).toString() + '%');
            }
            if (metaData.chunkIndex === 0) {
                this.checkActionButtonStatus();
            }
        }
        if (isNullOrUndefined(liElement.querySelector('.' + PAUSE_UPLOAD)) && isNullOrUndefined(this.template)) {
            this.pauseButton = this.createElement('span', { className: 'e-icons e-file-pause-btn', attrs: { 'tabindex': this.btnTabIndex } });
            if (this.browserName === 'msie') {
                this.pauseButton.classList.add('e-msie');
            }
            liElement.insertBefore(this.pauseButton, liElement.querySelector('.' + ABORT_ICON));
            this.pauseButton.setAttribute('title', this.localizedTexts('pause'));
            this.pauseButton.addEventListener('click', (e) => { this.checkPausePlayAction(e); }, false);
        }
    }
    /**
     * It is used to convert bytes value into kilobytes or megabytes depending on the size based
     * on [binary prefix](https://en.wikipedia.org/wiki/Binary_prefix).
     * @param { number } bytes - specifies the file size in bytes.
     * @returns string
     */
    bytesToSize(bytes) {
        let i = -1;
        if (!bytes) {
            return '0.0 KB';
        }
        do {
            bytes = bytes / 1024;
            i++;
        } while (bytes > 99);
        if (i >= 2) {
            bytes = bytes * 1024;
            i = 1;
        }
        return Math.max(bytes, 0).toFixed(1) + ' ' + ['KB', 'MB'][i];
    }
    /**
     * Allows you to sort the file data alphabetically based on its file name clearly.
     * @param { FileList } filesData - specifies the files data for upload.
     * @returns File[]
     */
    /* istanbul ignore next */
    sortFileList(filesData) {
        filesData = filesData ? filesData : this.sortFilesList;
        let files = filesData;
        let fileNames = [];
        for (let i = 0; i < files.length; i++) {
            fileNames.push(files[i].name);
        }
        let sortedFileNames = fileNames.sort();
        let sortedFilesData = [];
        for (let name of sortedFileNames) {
            for (let i = 0; i < files.length; i++) {
                if (name === files[i].name) {
                    sortedFilesData.push(files[i]);
                }
            }
        }
        return sortedFilesData;
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     * @method destroy
     * @return {void}.
     */
    destroy() {
        this.element.value = null;
        this.clearAll();
        this.unWireEvents();
        this.unBindDropEvents();
        if (this.multiple) {
            this.element.removeAttribute('multiple');
        }
        if (!this.enabled) {
            this.element.removeAttribute('disabled');
        }
        this.element.removeAttribute('accept');
        this.setInitialAttributes();
        let attributes$$1 = ['aria-label', 'directory', 'webkitdirectory', 'tabindex'];
        for (let key of attributes$$1) {
            this.element.removeAttribute(key);
        }
        this.uploadWrapper.parentElement.appendChild(this.element);
        detach(this.uploadWrapper);
        this.uploadWrapper = null;
        super.destroy();
    }
    /**
     * Allows you to call the upload process manually by calling save URL action.
     * To process the selected files (added in upload queue), pass an empty argument otherwise
     * upload the specific file based on its argument.
     * @param { FileInfo | FileInfo[] } files - specifies the files data for upload.
     * @returns void
     */
    upload(files, custom) {
        files = files ? files : this.filesData;
        let uploadFiles = this.validateFileType(files);
        this.uploadFiles(uploadFiles, custom);
    }
    validateFileType(files) {
        let uploadFiles = [];
        if (files instanceof Array) {
            uploadFiles = files;
        }
        else {
            uploadFiles.push(files);
        }
        return uploadFiles;
    }
    uploadFiles(files, custom) {
        let selectedFiles = [];
        let cloneFiles = [];
        if (this.asyncSettings.saveUrl === '' || isNullOrUndefined(this.asyncSettings.saveUrl)) {
            return;
        }
        if (!custom || isNullOrUndefined(custom)) {
            if (!this.multiple) {
                let file = [];
                file.push(files[0]);
                selectedFiles = this.filterfileList(file);
            }
            else {
                selectedFiles = this.filterfileList(files);
            }
        }
        else {
            selectedFiles = files;
        }
        let chunkEnabled = this.checkChunkUpload();
        for (let i = 0; i < selectedFiles.length; i++) {
            let ajax = new Ajax(this.asyncSettings.saveUrl, 'POST', true, null);
            ajax.emitError = false;
            let getFileData;
            /* istanbul ignore next */
            if (isBlazor()) {
                getFileData = selectedFiles.slice(0);
                cloneFiles.push(new File([getFileData[i].rawFile], getFileData[i].name));
            }
            let eventArgs = {
                fileData: (isBlazor()) ? getFileData[i] : selectedFiles[i],
                customFormData: [],
                cancel: false
            };
            let formData = new FormData();
            ajax.beforeSend = (e) => {
                eventArgs.currentRequest = ajax.httpRequest;
                /* istanbul ignore next */
                if (isBlazor()) {
                    eventArgs.fileData.rawFile = this.base64String[i];
                    if (this.currentRequestHeader) {
                        this.updateCustomheader(ajax.httpRequest, this.currentRequestHeader);
                    }
                    if (this.customFormDatas) {
                        this.updateFormData(formData, this.customFormDatas);
                    }
                }
                this.trigger('uploading', eventArgs, (eventArgs) => {
                    /* istanbul ignore next */
                    if (isBlazor()) {
                        selectedFiles[i].rawFile = eventArgs.fileData.rawFile = cloneFiles[i];
                    }
                    if (eventArgs.cancel) {
                        this.eventCancelByArgs(e, eventArgs, selectedFiles[i]);
                    }
                    this.updateFormData(formData, eventArgs.customFormData);
                });
            };
            if (selectedFiles[i].statusCode === '1') {
                let name = this.element.getAttribute('name');
                formData.append(name, selectedFiles[i].rawFile, selectedFiles[i].name);
                if (chunkEnabled && selectedFiles[i].size > this.asyncSettings.chunkSize) {
                    this.chunkUpload(selectedFiles[i], custom, i);
                }
                else {
                    ajax.onLoad = (e) => {
                        if (eventArgs.cancel && isBlazor()) {
                            return {};
                        }
                        else {
                            this.uploadComplete(e, selectedFiles[i], custom);
                            return {};
                        }
                    };
                    ajax.onUploadProgress = (e) => {
                        if (eventArgs.cancel && isBlazor()) {
                            return {};
                        }
                        else {
                            this.uploadInProgress(e, selectedFiles[i], custom, ajax);
                            return {};
                        }
                    };
                    /* istanbul ignore next */
                    ajax.onError = (e) => { this.uploadFailed(e, selectedFiles[i]); return {}; };
                    ajax.send(formData);
                }
            }
        }
    }
    /**
     * Remove the uploaded file from server manually by calling the remove URL action.
     * If you pass an empty argument to this method, the complete file list can be cleared,
     * otherwise remove the specific file based on its argument (“file_data”).
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to remove from file list/server.
     * @param { boolean } customTemplate - Set true if the component rendering with customize template.
     * @param { boolean } removeDirectly - Set true if files remove without removing event.
     * @param { boolean } postRawFile - Set false, to post file name only to the remove action.
     * @returns void
     */
    remove(fileData, customTemplate, removeDirectly, postRawFile, args) {
        if (isNullOrUndefined(postRawFile)) {
            postRawFile = true;
        }
        let eventArgs = {
            event: args,
            cancel: false,
            filesData: [],
            customFormData: [],
            postRawFile: postRawFile
        };
        let index;
        if (this.isForm && (isNullOrUndefined(this.asyncSettings.removeUrl) || this.asyncSettings.removeUrl === '')) {
            eventArgs.filesData = this.getFilesData();
            this.trigger('removing', eventArgs, (eventArgs) => {
                if (!eventArgs.cancel) {
                    this.clearAll();
                }
            });
        }
        else {
            let removeFiles = [];
            fileData = !isNullOrUndefined(fileData) ? fileData : this.filesData;
            if (fileData instanceof Array) {
                removeFiles = fileData;
            }
            else {
                removeFiles.push(fileData);
            }
            eventArgs.filesData = removeFiles;
            let removeUrl = this.asyncSettings.removeUrl;
            let validUrl = (removeUrl === '' || isNullOrUndefined(removeUrl)) ? false : true;
            for (let files of removeFiles) {
                index = this.filesData.indexOf(files);
                if ((files.statusCode === '2' || files.statusCode === '4') && validUrl) {
                    this.removeUploadedFile(files, eventArgs, removeDirectly, customTemplate);
                }
                else {
                    if (!removeDirectly) {
                        this.trigger('removing', eventArgs, (eventArgs) => {
                            if (!eventArgs.cancel) {
                                this.removeFilesData(files, customTemplate);
                            }
                        });
                    }
                    else {
                        this.removeFilesData(files, customTemplate);
                    }
                }
                if (this.sequentialUpload) {
                    /* istanbul ignore next */
                    if (index <= this.actionCompleteCount) {
                        this.checkActionComplete(false);
                    }
                }
                else {
                    this.checkActionComplete(false);
                }
            }
        }
    }
    /**
     * Clear all the file entries from list that can be uploaded files or added in upload queue.
     * @returns void
     */
    clearAll() {
        if (isNullOrUndefined(this.listParent)) {
            if (this.browserName !== 'msie') {
                this.element.value = '';
            }
            this.filesData = [];
            return;
        }
        let eventArgs = {
            cancel: false,
            filesData: this.filesData
        };
        this.trigger('clearing', eventArgs, (eventArgs) => {
            if (!eventArgs.cancel) {
                this.clearData();
                this.actionCompleteCount = 0;
                this.count = -1;
            }
        });
    }
    /**
     * Get the data of files which are shown in file list.
     * @returns FileInfo[]
     */
    getFilesData() {
        if (!isBlazor()) {
            return this.filesData;
        }
        else {
            for (let i = 0; i < this.filesData.length; i++) {
                this.filesData[i].rawFile = this.base64String[i];
            }
            return this.filesData;
        }
    }
    /**
     * Pauses the in-progress chunked upload based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to pause from uploading.
     * @param { boolean } custom - Set true if used custom UI.
     * @returns void
     */
    pause(fileData, custom) {
        fileData = fileData ? fileData : this.filesData;
        let fileDataFiles = this.validateFileType(fileData);
        this.pauseUploading(fileDataFiles, custom);
    }
    pauseUploading(fileData, custom) {
        let files = this.getFiles(fileData);
        for (let i = 0; i < files.length; i++) {
            if (files[i].statusCode === '3') {
                this.pauseUpload(this.getCurrentMetaData(files[i], null), null, custom);
            }
        }
    }
    getFiles(fileData) {
        let files = [];
        if (!isNullOrUndefined(fileData) && !(fileData instanceof Array)) {
            files.push(fileData);
        }
        else {
            files = fileData;
        }
        return files;
    }
    /**
     * Resumes the chunked upload that is previously paused based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to resume the paused file.
     * @param { boolean } custom - Set true if used custom UI.
     * @returns void
     */
    resume(fileData, custom) {
        fileData = fileData ? fileData : this.filesData;
        let fileDataFiles = this.validateFileType(fileData);
        this.resumeFiles(fileDataFiles, custom);
    }
    resumeFiles(fileData, custom) {
        let files = this.getFiles(fileData);
        for (let i = 0; i < files.length; i++) {
            if (files[i].statusCode === '4') {
                this.resumeUpload(this.getCurrentMetaData(files[i], null), null, custom);
            }
        }
    }
    /**
     * Retries the canceled or failed file upload based on the file data.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to retry the canceled or failed file.
     * @param { boolean } fromcanceledStage - Set true to retry from canceled stage and set false to retry from initial stage.
     * @returns void
     */
    retry(fileData, fromcanceledStage, custom) {
        fileData = fileData ? fileData : this.filesData;
        let fileDataFiles = this.validateFileType(fileData);
        this.retryFailedFiles(fileDataFiles, fromcanceledStage, custom);
    }
    retryFailedFiles(fileData, fromcanceledStage, custom) {
        let files = this.getFiles(fileData);
        for (let i = 0; i < files.length; i++) {
            if (files[i].statusCode === '5' || files[i].statusCode === '0') {
                if (this.asyncSettings.chunkSize > 0) {
                    this.retryUpload(this.getCurrentMetaData(files[i], null), fromcanceledStage);
                }
                else {
                    let liElement;
                    if (!custom) {
                        liElement = this.fileList[this.filesData.indexOf(files[i])];
                    }
                    this.reloadcanceledFile(null, files[i], liElement, custom);
                }
            }
        }
    }
    /**
     * Stops the in-progress chunked upload based on the file data.
     * When the file upload is canceled, the partially uploaded file is removed from server.
     * @param { FileInfo | FileInfo[] } fileData - specifies the files data to cancel the progressing file.
     * @returns void
     */
    cancel(fileData) {
        fileData = fileData ? fileData : this.filesData;
        let cancelingFiles = this.validateFileType(fileData);
        this.cancelUpload(cancelingFiles);
    }
    cancelUpload(fileData) {
        let files = this.getFiles(fileData);
        if (this.asyncSettings.chunkSize > 0) {
            for (let i = 0; i < files.length; i++) {
                if (files[i].statusCode === '3') {
                    let metaData = this.getCurrentMetaData(files[i], null);
                    metaData.file.statusCode = '5';
                    metaData.file.status = this.localizedTexts('fileUploadCancel');
                    this.updateMetaData(metaData);
                    this.showHideUploadSpinner(files[i]);
                }
            }
        }
        else {
            for (let i = 0; i < files.length; i++) {
                if (files[i].statusCode === '3') {
                    files[i].statusCode = '5';
                    files[i].status = this.localizedTexts('fileUploadCancel');
                    this.showHideUploadSpinner(files[i]);
                }
            }
        }
    }
    showHideUploadSpinner(files) {
        let liElement = this.getLiElement(files);
        if (!isNullOrUndefined(liElement) && isNullOrUndefined(this.template)) {
            let spinnerTarget = liElement.querySelector('.' + ABORT_ICON);
            createSpinner({ target: spinnerTarget, width: '20px' });
            showSpinner(spinnerTarget);
        }
    }
};
__decorate$4([
    Complex({ saveUrl: '', removeUrl: '' }, AsyncSettings)
], Uploader.prototype, "asyncSettings", void 0);
__decorate$4([
    Property(false)
], Uploader.prototype, "sequentialUpload", void 0);
__decorate$4([
    Property({})
], Uploader.prototype, "htmlAttributes", void 0);
__decorate$4([
    Property('')
], Uploader.prototype, "cssClass", void 0);
__decorate$4([
    Property(true)
], Uploader.prototype, "enabled", void 0);
__decorate$4([
    Property(null)
], Uploader.prototype, "template", void 0);
__decorate$4([
    Property(true)
], Uploader.prototype, "multiple", void 0);
__decorate$4([
    Property(true)
], Uploader.prototype, "autoUpload", void 0);
__decorate$4([
    Complex({}, ButtonsProps)
], Uploader.prototype, "buttons", void 0);
__decorate$4([
    Property('')
], Uploader.prototype, "allowedExtensions", void 0);
__decorate$4([
    Property(0)
], Uploader.prototype, "minFileSize", void 0);
__decorate$4([
    Property(30000000)
], Uploader.prototype, "maxFileSize", void 0);
__decorate$4([
    Property(null)
], Uploader.prototype, "dropArea", void 0);
__decorate$4([
    Collection([{}], FilesProp)
], Uploader.prototype, "files", void 0);
__decorate$4([
    Property(true)
], Uploader.prototype, "showFileList", void 0);
__decorate$4([
    Property(false)
], Uploader.prototype, "directoryUpload", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "created", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "actionComplete", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "rendering", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "fileListRendering", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "selected", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "uploading", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "success", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "failure", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "removing", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "clearing", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "progress", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "change", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "chunkSuccess", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "chunkFailure", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "chunkUploading", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "canceling", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "pausing", void 0);
__decorate$4([
    Event()
], Uploader.prototype, "resuming", void 0);
Uploader = __decorate$4([
    NotifyPropertyChanges
], Uploader);

/**
 * Uploader modules
 */

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const APPLY = 'e-apply';
const CANCEL = 'e-cancel';
const CURRENT = 'e-current';
const CONTAINER = 'e-container';
const CTRLBTN = 'e-ctrl-btn';
const CTRLSWITCH = 'e-switch-ctrl-btn';
const DISABLED$1 = 'e-disabled';
const FORMATSWITCH = 'e-value-switch-btn';
const HANDLER = 'e-handler';
const HEX = 'e-hex';
const HIDEHEX = 'e-hide-hex-value';
const HIDEOPACITY = 'e-hide-opacity';
const HIDERGBA = 'e-hide-switchable-value';
const HIDEVALUE = 'e-hide-value';
const HIDEVALUESWITCH = 'e-hide-valueswitcher';
const HSVAREA = 'e-hsv-color';
const HSVCONTAINER = 'e-hsv-container';
const INPUTWRAPPER = 'e-selected-value';
const MODESWITCH = 'e-mode-switch-btn';
const NOCOLOR = 'e-nocolor-item';
const OPACITY = 'e-opacity-value';
const PALETTES = 'e-palette';
const PALETTECONTENT = 'e-color-palette';
const PICKERCONTENT = 'e-color-picker';
const PREVIEW = 'e-preview-container';
const PREVIOUS = 'e-previous';
const RTL$1 = 'e-rtl';
const SHOWVALUE = 'e-show-value';
const SELECT = 'e-selected';
const SPLITPREVIEW = 'e-split-preview';
const TILE = 'e-tile';
const presets = {
    default: ['#000000', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#ffeb3b',
        '#ffffff', '#ffebee', '#fce4ec', '#f3e5f5', '#ede7f6', '#e3f2fd', '#e1f5fe', '#e0f7fa', '#e0f2f1', '#fffde7',
        '#f2f2f2', '#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#bbdefb', '#b3e5fc', '#b2ebf2', '#b2dfdb', '#fff9c4',
        '#e6e6e6', '#ef9a9a', '#f48fb1', '#ce93d8', '#b39ddb', '#90caf9', '#81d4fa', '#80deea', '#80cbc4', '#fff59d',
        '#cccccc', '#e57373', '#f06292', '#ba68c8', '#9575cd', '#64b5f6', '#4fc3f7', '#4dd0e1', '#4db6ac', '#fff176',
        '#b3b3b3', '#ef5350', '#ec407a', '#ab47bc', '#7e57c2', '#42a5f5', '#29b6f6', '#26c6da', '#26a69a', '#ffee58',
        '#999999', '#e53935', '#d81b60', '#8e24aa', '#5e35b1', '#1e88e5', '#039be5', '#00acc1', '#00897b', '#fdd835',
        '#808080', '#d32f2f', '#c2185b', '#7b1fa2', '#512da8', '#1976d2', '#0288d1', '#0097a7', '#00796b', '#fbc02d',
        '#666666', '#c62828', '#ad1457', '#6a1b9a', '#4527a0', '#1565c0', '#0277bd', '#00838f', '#00695c', '#f9a825',
        '#4d4d4d', '#b71c1c', '#880e4f', '#4a148c', '#311b92', '#0d47a1', '#01579b', '#006064', '#004d40', '#f57f17']
};
/**
 * ColorPicker component is a user interface to select and adjust color values. It provides supports for various
 * color specification like Red Green Blue, Hue Saturation Value and Hex codes.
 * ```html
 * <input type="color" id="color-picker">
 * ```
 * ```typescript
 * <script>
 *   let colorPickerObj: ColorPicker = new ColorPicker(null , "#color-picker");
 * </script>
 * ```
 */
let ColorPicker = class ColorPicker extends Component {
    constructor(options, element) {
        super(options, element);
    }
    preRender() {
        let ele = this.element;
        this.formElement = closest(this.element, 'form');
        if (this.formElement) {
            EventHandler.add(this.formElement, 'reset', this.formResetHandler, this);
        }
        let localeText = { Apply: 'Apply', Cancel: 'Cancel', ModeSwitcher: 'Switch Mode' };
        this.l10n = new L10n('colorpicker', localeText, this.locale);
        if (ele.getAttribute('ejs-for') && !ele.getAttribute('name')) {
            ele.setAttribute('name', ele.id);
        }
    }
    /**
     * To Initialize the component rendering
     * @private
     */
    render() {
        this.initWrapper();
        if (this.inline) {
            this.createWidget();
        }
        else {
            this.createSplitBtn();
        }
        if (!this.enableOpacity) {
            addClass([this.container.parentElement], HIDEOPACITY);
        }
        this.renderComplete();
    }
    initWrapper() {
        let wrapper = this.createElement('div', { className: 'e-' + this.getModuleName() + '-wrapper' });
        this.element.parentNode.insertBefore(wrapper, this.element);
        wrapper.appendChild(this.element);
        attributes(this.element, { 'tabindex': '-1', 'spellcheck': 'false' });
        this.container = this.createElement('div', { className: CONTAINER });
        this.getWrapper().appendChild(this.container);
        let value = this.value ? this.roundValue(this.value).toLowerCase() : '#008000ff';
        let slicedValue = value.slice(0, 7);
        if (isNullOrUndefined(this.initialInputValue)) {
            this.initialInputValue = slicedValue;
        }
        this.element.value = slicedValue;
        this.setProperties({ 'value': value }, true);
        if (this.enableRtl) {
            wrapper.classList.add(RTL$1);
        }
        if (this.cssClass) {
            addClass([wrapper], this.cssClass.split(' '));
        }
        this.tileRipple = rippleEffect(this.container, { selector: '.' + TILE });
        this.ctrlBtnRipple = rippleEffect(this.container, { selector: '.e-btn' });
    }
    getWrapper() {
        return this.element.parentElement;
    }
    createWidget() {
        if (this.mode === 'Palette') {
            this.createPalette();
            if (!this.inline) {
                this.firstPaletteFocus();
            }
        }
        else {
            this.createPicker();
            if (!this.inline) {
                this.getDragHandler().focus();
            }
        }
        this.isRgb = true;
        this.createInput();
        this.createCtrlBtn();
        if (!this.disabled) {
            this.wireEvents();
        }
        if (this.inline && this.disabled) {
            this.toggleDisabled(true);
        }
        if (Browser.isDevice) {
            this.refreshPopupPos();
        }
    }
    createSplitBtn() {
        let splitButton = this.createElement('button', { className: 'e-split-colorpicker' });
        this.getWrapper().appendChild(splitButton);
        this.splitBtn = new SplitButton({
            iconCss: 'e-selected-color',
            target: this.container,
            disabled: this.disabled,
            enableRtl: this.enableRtl,
            open: this.onOpen.bind(this),
            beforeOpen: this.beforeOpenFn.bind(this),
            beforeClose: this.beforePopupClose.bind(this),
            click: (args) => {
                this.trigger('change', {
                    currentValue: { hex: this.value.slice(0, 7), rgba: this.convertToRgbString(this.hexToRgb(this.value)) },
                    previousValue: { hex: null, rgba: null }, value: this.value
                });
            }
        });
        this.splitBtn.createElement = this.createElement;
        this.splitBtn.appendTo(splitButton);
        let preview = this.createElement('span', { className: SPLITPREVIEW });
        select('.e-selected-color', splitButton).appendChild(preview);
        preview.style.backgroundColor = this.convertToRgbString(this.hexToRgb(this.value));
        let popupEle = this.getPopupEle();
        addClass([popupEle], 'e-colorpicker-popup');
        if (this.cssClass) {
            addClass([popupEle], this.cssClass.split(' '));
        }
        if (Browser.isDevice) {
            let popupInst = this.getPopupInst();
            popupInst.relateTo = document.body;
            popupInst.position = { X: 'center', Y: 'center' };
            popupInst.targetType = 'container';
            popupInst.collision = { X: 'fit', Y: 'fit' };
            popupInst.offsetY = 4;
            popupEle.style.zIndex = getZindexPartial(this.splitBtn.element).toString();
        }
    }
    onOpen(args) {
        this.trigger('open', { element: this.container });
    }
    getPopupInst() {
        return getInstance(this.getPopupEle(), Popup);
    }
    beforeOpenFn(args) {
        let beforeOpenArgs = { element: this.container, event: args.event, cancel: false };
        this.trigger('beforeOpen', beforeOpenArgs, (observeOpenArgs) => {
            args.cancel = observeOpenArgs.cancel;
            if (!observeOpenArgs.cancel) {
                let popupEle = this.getPopupEle();
                popupEle.style.top = formatUnit(0 + pageYOffset);
                popupEle.style.left = formatUnit(0 + pageXOffset);
                popupEle.style.display = 'block';
                this.createWidget();
                popupEle.style.display = '';
                if (Browser.isDevice) {
                    this.modal = this.createElement('div');
                    this.modal.className = 'e-' + this.getModuleName() + ' e-modal';
                    this.modal.style.display = 'none';
                    document.body.insertBefore(this.modal, popupEle);
                    document.body.className += ' e-colorpicker-overflow';
                    this.modal.style.display = 'block';
                    this.modal.style.zIndex = (Number(popupEle.style.zIndex) - 1).toString();
                }
            }
        });
    }
    beforePopupClose(args) {
        if (!isNullOrUndefined(args.event)) {
            let beforeCloseArgs = { element: this.container, event: args.event, cancel: false };
            this.trigger('beforeClose', beforeCloseArgs, (observedCloseArgs) => {
                if (Browser.isDevice && args.event.target === this.modal) {
                    observedCloseArgs.cancel = true;
                }
                args.cancel = observedCloseArgs.cancel;
                if (!observedCloseArgs.cancel) {
                    this.onPopupClose();
                }
            });
        }
    }
    onPopupClose() {
        this.unWireEvents();
        this.destroyOtherComp();
        this.container.style.width = '';
        select('.' + SPLITPREVIEW, this.splitBtn.element).style.backgroundColor
            = this.convertToRgbString(this.hexToRgb(this.value));
        this.container.innerHTML = '';
        removeClass([this.container], [PICKERCONTENT, PALETTECONTENT]);
        if (Browser.isDevice && this.modal) {
            removeClass([document.body], 'e-colorpicker-overflow');
            this.modal.style.display = 'none';
            this.modal.outerHTML = '';
            this.modal = null;
        }
    }
    createPalette() {
        classList(this.container, [PALETTECONTENT], [PICKERCONTENT]);
        if (this.presetColors) {
            let paletteGroup = this.createElement('div', { className: 'e-custom-palette' });
            this.appendElement(paletteGroup);
            let keys = Object.keys(this.presetColors);
            if (keys.length === 1) {
                this.appendPalette(this.presetColors[keys[0]], keys[0], paletteGroup);
            }
            else {
                for (let i = 0, len = keys.length; i < len; i++) {
                    this.appendPalette(this.presetColors[keys[i]], keys[i], paletteGroup);
                }
            }
            if (selectAll('.e-row', paletteGroup).length > 10) {
                addClass([paletteGroup], 'e-palette-group');
            }
        }
        else {
            this.appendPalette(presets.default, 'default');
        }
        if (this.mode === 'Palette' && !this.modeSwitcher && this.noColor) {
            this.setNoColor();
        }
        let width = parseInt(getComputedStyle(this.container).borderBottomWidth, 10);
        this.container.style.width = formatUnit(this.container.children[0].offsetWidth + width + width);
        this.rgb = this.hexToRgb(this.roundValue(this.value));
        this.hsv = this.rgbToHsv.apply(this, this.rgb);
    }
    firstPaletteFocus() {
        if (!select('.' + SELECT, this.container.children[0])) {
            selectAll('.' + PALETTES, this.container)[0].focus();
        }
    }
    appendPalette(colors, key, refEle) {
        let palette = this.createElement('div', { className: PALETTES, attrs: { 'tabindex': '0' } });
        if (refEle) {
            refEle.appendChild(palette);
        }
        else {
            this.appendElement(palette);
        }
        let row;
        let tile;
        let roundedColor;
        for (let i = 0, len = colors.length; i < len; i++) {
            if (i === 0 || i % this.columns === 0) {
                row = this.createElement('div', {
                    className: 'e-row', attrs: { 'role': 'row' }
                });
                palette.appendChild(row);
            }
            roundedColor = this.roundValue(colors[i]).toLowerCase();
            tile = this.createElement('span', {
                className: TILE, attrs: { 'role': 'gridcell', 'aria-label': roundedColor, 'aria-selected': 'false' }
            });
            this.trigger('beforeTileRender', { element: tile, presetName: key, value: colors[i] });
            row.appendChild(tile);
            if (this.value === roundedColor) {
                this.addTileSelection(tile);
                palette.focus();
            }
            tile.style.backgroundColor = this.convertToRgbString(this.hexToRgb(roundedColor));
        }
    }
    setNoColor() {
        let noColorEle = this.container.querySelector('.e-row').children[0];
        noColorEle.classList.add(NOCOLOR);
        if (!this.value) {
            noColorEle.classList.add(SELECT);
            closest(noColorEle, '.' + PALETTES).focus();
        }
        ['aria-selected', 'aria-label'].forEach((attr) => { noColorEle.removeAttribute(attr); });
        noColorEle.style.backgroundColor = '';
    }
    appendElement(ele, insertPos = 0) {
        let refEle = this.container.children[insertPos];
        refEle ? this.container.insertBefore(ele, refEle) : this.container.appendChild(ele);
    }
    addTileSelection(ele) {
        ele.classList.add(SELECT);
        ele.setAttribute('aria-selected', 'true');
    }
    createPicker() {
        classList(this.container, [PICKERCONTENT], [PALETTECONTENT]);
        let hsvContainer = this.createElement('div', { className: HSVCONTAINER });
        this.appendElement(hsvContainer);
        hsvContainer.appendChild(this.createElement('div', { className: HSVAREA }));
        let dragHandler = this.createElement('span', { className: HANDLER, attrs: { 'tabindex': '0' } });
        hsvContainer.appendChild(dragHandler);
        this.rgb = this.hexToRgb(this.value);
        this.hsv = this.rgbToHsv.apply(this, this.rgb);
        this.setHsvContainerBg();
        this.setHandlerPosition();
        this.createSlider();
        this.createDragTooltip();
    }
    setHsvContainerBg(h = this.hsv[0]) {
        this.getHsvContainer().style.backgroundColor = this.convertToRgbString(this.hsvToRgb(h, 100, 100, 1));
    }
    getHsvContainer() {
        return select('.' + HSVCONTAINER, this.container);
    }
    setHandlerPosition() {
        let dragHandler = this.getDragHandler();
        let hsvArea = select('.' + HSVAREA, this.container);
        if (this.enableRtl) {
            dragHandler.style.left = formatUnit(hsvArea.offsetWidth * Math.abs(100 - this.hsv[1]) / 100);
        }
        else {
            dragHandler.style.left = formatUnit(hsvArea.offsetWidth * this.hsv[1] / 100);
        }
        dragHandler.style.top = formatUnit(hsvArea.offsetHeight * (100 - this.hsv[2]) / 100);
    }
    createSlider() {
        let sliderPreviewWrapper = this.createElement('div', { className: 'e-slider-preview' });
        this.appendElement(sliderPreviewWrapper, 1);
        this.createPreview(sliderPreviewWrapper);
        let sliderWrapper = this.createElement('div', { className: 'e-colorpicker-slider' });
        sliderPreviewWrapper.insertBefore(sliderWrapper, sliderPreviewWrapper.children[0]);
        let slider = this.createElement('div', { className: 'e-hue-slider' });
        sliderWrapper.appendChild(slider);
        this.hueSlider = new Slider({
            value: this.hsv[0],
            min: 0,
            max: 359,
            enableRtl: this.enableRtl,
            enabled: !this.disabled,
            change: this.hueChange.bind(this)
        });
        this.hueSlider.createElement = this.createElement;
        this.hueSlider.appendTo(slider);
        if (this.enableOpacity) {
            slider = this.createElement('div', { className: 'e-opacity-slider' });
            sliderWrapper.appendChild(slider);
            this.createOpacitySlider(slider);
        }
    }
    createOpacitySlider(slider) {
        this.opacitySlider = new Slider({
            value: this.rgb[3] * 100,
            min: 0,
            max: 100,
            enableRtl: this.enableRtl,
            enabled: !this.disabled,
            change: this.opacityChange.bind(this)
        });
        this.opacitySlider.createElement = this.createElement;
        this.opacitySlider.appendTo(slider);
        let opacityBgTrack = this.createElement('div', { className: 'e-opacity-empty-track' });
        slider.appendChild(opacityBgTrack);
        this.updateOpacitySliderBg();
    }
    updateOpacitySliderBg() {
        let direction = this.enableRtl ? 'to left' : 'to right';
        select('.e-slider-track', this.opacitySlider.element).style.background =
            'linear-gradient(' + direction + ', rgba(' + this.rgb.slice(0, 3) + ', 0) 0%, ' +
                this.convertToRgbString(this.rgb.slice(0, 3)) + ' 100%)';
    }
    hueChange(args) {
        this.hsv[0] = args.value;
        this.setHsvContainerBg();
        this.convertToOtherFormat();
    }
    opacityChange(args) {
        let value = args.value;
        let pValue = this.rgbToHex(this.rgb);
        this.hsv[3] = value / 100;
        this.rgb[3] = value / 100;
        let cValue = this.rgbToHex(this.rgb);
        this.updateOpacityInput(value);
        let rgb = this.convertToRgbString(this.rgb);
        this.updatePreview(rgb);
        this.triggerEvent(cValue, pValue, rgb);
    }
    updateOpacityInput(value) {
        if (!this.getWrapper().classList.contains(HIDEVALUE)) {
            let opacityTextBoxInst = getInstance(select('.' + OPACITY, this.container), NumericTextBox);
            opacityTextBoxInst.value = value;
            opacityTextBoxInst.dataBind();
        }
    }
    createPreview(parentEle) {
        let previewContainer = this.createElement('div', { className: PREVIEW });
        parentEle.appendChild(previewContainer);
        let preview = this.createElement('span', { className: 'e-preview ' + CURRENT });
        previewContainer.appendChild(preview);
        let colorValue = this.convertToRgbString(this.rgb);
        preview.style.backgroundColor = colorValue;
        preview = this.createElement('span', { className: 'e-preview ' + PREVIOUS });
        previewContainer.appendChild(preview);
        preview.style.backgroundColor = colorValue;
    }
    isPicker() {
        return !this.container.classList.contains(PALETTECONTENT);
    }
    getPopupEle() {
        return this.container.parentElement;
    }
    createNumericInput(element, value, label, max) {
        let numericInput = new NumericTextBox({
            value: value,
            placeholder: label,
            min: 0,
            max: max,
            format: '###.##',
            showSpinButton: false,
            floatLabelType: 'Always',
            enableRtl: this.enableRtl,
            enabled: !this.disabled,
            readonly: this.isPicker() ? false : true,
            change: (args) => {
                if (args.event) {
                    this.inputHandler(args.event);
                }
            }
        });
        numericInput.createElement = this.createElement;
        numericInput.appendTo(element);
    }
    createInput() {
        let isPicker = this.isPicker();
        let wrapper = this.getWrapper();
        if ((isPicker && !wrapper.classList.contains(HIDEVALUE)) || (!isPicker && wrapper.classList.contains(SHOWVALUE))) {
            let inputWrap = this.createElement('div', { className: INPUTWRAPPER });
            isPicker ? this.appendElement(inputWrap, 2) : this.appendElement(inputWrap, 1);
            let container = this.createElement('div', { className: 'e-input-container' });
            inputWrap.appendChild(container);
            if (!wrapper.classList.contains(HIDEVALUESWITCH)) {
                this.appendValueSwitchBtn(inputWrap);
            }
            if (!wrapper.classList.contains(HIDEHEX)) {
                let hexInput = this.createElement('input', {
                    className: HEX,
                    attrs: { 'maxlength': '7', 'spellcheck': 'false' }
                });
                container.appendChild(hexInput);
                Input.createInput({
                    element: hexInput,
                    floatLabelType: 'Always',
                    properties: {
                        placeholder: 'HEX',
                        enableRtl: this.enableRtl,
                        enabled: !this.disabled,
                        readonly: this.isPicker() ? false : true
                    }
                }, this.createElement);
                Input.setValue(this.value.slice(0, 7), hexInput);
                hexInput.addEventListener('input', this.inputHandler.bind(this));
            }
            if (!wrapper.classList.contains(HIDERGBA)) {
                let label;
                let value;
                if (this.isRgb) {
                    label = 'RGB';
                    value = this.rgb;
                }
                else {
                    label = 'HSV';
                    value = this.hsv;
                }
                let clsName = ['rh', 'gs', 'bv'];
                for (let i = 0; i < 3; i++) {
                    this.createNumericInput(container.appendChild(this.createElement('input', { className: 'e-' + clsName[i] + '-value' })), value[i], label[i], 255);
                }
                if (this.enableOpacity) {
                    this.appendOpacityValue(container);
                }
            }
        }
    }
    appendOpacityValue(container) {
        this.createNumericInput(container.appendChild(this.createElement('input', { className: OPACITY })), this.rgb[3] * 100, 'A', 100);
    }
    appendValueSwitchBtn(targetEle) {
        let valueSwitchBtn = this.createElement('button', {
            className: 'e-icons e-css e-btn e-flat e-icon-btn ' + FORMATSWITCH
        });
        targetEle.appendChild(valueSwitchBtn);
        if (this.isPicker() && !this.getWrapper().classList.contains(HIDERGBA)) {
            valueSwitchBtn.addEventListener('click', this.formatSwitchHandler.bind(this));
        }
    }
    createCtrlBtn() {
        if (this.modeSwitcher || this.showButtons) {
            this.l10n.setLocale(this.locale);
            let btnWrapper = this.createElement('div', { className: CTRLSWITCH });
            this.container.appendChild(btnWrapper);
            if (this.showButtons) {
                let controlBtnWrapper = this.createElement('div', { className: CTRLBTN });
                btnWrapper.appendChild(controlBtnWrapper);
                let apply = this.l10n.getConstant('Apply');
                controlBtnWrapper.appendChild(this.createElement('button', {
                    innerHTML: apply,
                    className: 'e-btn e-css e-flat e-primary e-small ' + APPLY,
                    attrs: { 'title': apply }
                }));
                let cancel = this.l10n.getConstant('Cancel');
                controlBtnWrapper.appendChild(this.createElement('button', {
                    innerHTML: cancel,
                    className: 'e-btn e-css e-flat e-small ' + CANCEL,
                    attrs: { 'title': cancel }
                }));
            }
            if (this.modeSwitcher) {
                this.appendModeSwitchBtn();
            }
        }
    }
    appendModeSwitchBtn() {
        let modeSwitcher = this.createElement('button', {
            className: 'e-icons e-btn e-flat e-icon-btn ' + MODESWITCH, attrs: { title: this.l10n.getConstant('ModeSwitcher') }
        });
        select('.' + CTRLSWITCH, this.container).insertBefore(modeSwitcher, select('.' + CTRLBTN, this.container));
    }
    createDragTooltip() {
        let tooltip = new Tooltip({
            opensOn: 'Custom',
            showTipPointer: false,
            cssClass: 'e-color-picker-tooltip',
            beforeOpen: (args) => {
                this.tooltipEle = args.element;
            },
            animation: { open: { effect: 'None' }, close: { effect: 'None' } }
        });
        tooltip.createElement = this.createElement;
        tooltip.appendTo(this.container);
        tooltip.open(this.container);
        this.tooltipEle.style.zIndex = getZindexPartial(this.tooltipEle).toString();
        select('.e-tip-content', this.tooltipEle).appendChild(this.createElement('div', { className: 'e-tip-transparent' }));
    }
    getTooltipInst() {
        return getInstance(this.container, Tooltip);
    }
    setTooltipOffset(value) {
        this.getTooltipInst().offsetY = value;
    }
    toggleDisabled(enable) {
        enable ? this.getWrapper().classList.add(DISABLED$1) : this.getWrapper().classList.remove(DISABLED$1);
        if (this.showButtons) {
            ([].slice.call(selectAll('.e-btn', this.container))).forEach((ele) => {
                enable ? attributes(ele, { 'disabled': '' }) : ele.removeAttribute('disabled');
            });
        }
    }
    convertToRgbString(rgb) {
        return rgb.length ? rgb.length === 4 ? 'rgba(' + rgb.join() + ')' : 'rgb(' + rgb.join() + ')' : '';
    }
    convertToHsvString(hsv) {
        return hsv.length === 4 ? 'hsva(' + hsv.join() + ')' : 'hsv(' + hsv.join() + ')';
    }
    updateHsv() {
        this.hsv[1] = this.hsv[1] > 100 ? 100 : this.hsv[1];
        this.hsv[2] = this.hsv[2] > 100 ? 100 : this.hsv[2];
        this.setHandlerPosition();
    }
    convertToOtherFormat(isKey = false) {
        let pValue = this.rgbToHex(this.rgb);
        this.rgb = this.hsvToRgb.apply(this, this.hsv);
        let cValue = this.rgbToHex(this.rgb);
        let rgba = this.convertToRgbString(this.rgb);
        this.updatePreview(rgba);
        this.updateInput(cValue);
        this.triggerEvent(cValue, pValue, rgba, isKey);
    }
    updateInput(value) {
        let wrapper = this.getWrapper();
        if (!wrapper.classList.contains(HIDEVALUE)) {
            if (!wrapper.classList.contains(HIDEHEX)) {
                Input.setValue(value.substr(0, 7), select('.' + HEX, this.container));
            }
            if (!wrapper.classList.contains(HIDERGBA)) {
                if (this.isRgb) {
                    this.updateValue(this.rgb, false);
                }
                else {
                    this.updateValue(this.hsv, false);
                }
            }
        }
    }
    updatePreview(value) {
        if (this.enableOpacity) {
            this.updateOpacitySliderBg();
        }
        select('.e-tip-transparent', this.tooltipEle).style.backgroundColor = value;
        select('.' + PREVIEW + ' .' + CURRENT, this.container).style.backgroundColor = value;
        select('.' + PREVIEW + ' .' + PREVIOUS, this.container).style.backgroundColor
            = this.convertToRgbString(this.hexToRgb(this.value));
    }
    getDragHandler() {
        return select('.' + HANDLER, this.container);
    }
    removeTileSelection() {
        let selectedEle = [].slice.call(selectAll('.' + SELECT, this.container.children[0]));
        selectedEle.forEach((ele) => {
            ele.classList.remove(SELECT);
            ele.setAttribute('aria-selected', 'false');
        });
    }
    convertRgbToNumberArray(value) {
        return (value.slice(value.indexOf('(') + 1, value.indexOf(')'))).split(',').map((n, i) => {
            return (i !== 3) ? parseInt(n, 10) : parseFloat(n);
        });
    }
    /**
     * To get color value in specified type.
     * @param value - Specify the color value.
     * @param type - Specify the type to which the specified color needs to be converted.
     * @method getValue
     * @return {string}
     */
    getValue(value, type) {
        if (!value) {
            value = this.value;
        }
        type = !type ? 'hex' : type.toLowerCase();
        if (value[0] === 'r') {
            let cValue = this.convertRgbToNumberArray(value);
            if (type === 'hex' || type === 'hexa') {
                let hex = this.rgbToHex(cValue);
                return type === 'hex' ? hex.slice(0, 7) : hex;
            }
            else {
                if (type === 'hsv') {
                    return this.convertToHsvString(this.rgbToHsv.apply(this, cValue.slice(0, 3)));
                }
                else {
                    if (type === 'hsva') {
                        return this.convertToHsvString(this.rgbToHsv.apply(this, cValue));
                    }
                    else {
                        return 'null';
                    }
                }
            }
        }
        else {
            if (value[0] === 'h') {
                let cValue = this.hsvToRgb.apply(this, this.convertRgbToNumberArray(value));
                if (type === 'rgba') {
                    return this.convertToRgbString(cValue);
                }
                else {
                    if (type === 'hex' || type === 'hexa') {
                        let hex = this.rgbToHex(cValue);
                        return type === 'hex' ? hex.slice(0, 7) : hex;
                    }
                    else {
                        if (type === 'rgb') {
                            return this.convertToRgbString(cValue.slice(0, 3));
                        }
                        else {
                            return 'null';
                        }
                    }
                }
            }
            else {
                value = this.roundValue(value);
                let rgb = this.hexToRgb(value);
                if (type === 'rgb' || type === 'hsv') {
                    rgb = rgb.slice(0, 3);
                }
                if (type === 'rgba' || type === 'rgb') {
                    return this.convertToRgbString(rgb);
                }
                else {
                    if (type === 'hsva' || type === 'hsv') {
                        return this.convertToHsvString(this.rgbToHsv.apply(this, rgb));
                    }
                    else {
                        if (type === 'hex') {
                            return value.slice(0, 7);
                        }
                        else {
                            if (type === 'a') {
                                return rgb[3].toString();
                            }
                            else {
                                return 'null';
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     * To show/hide ColorPicker popup based on current state of the SplitButton.
     * @method toggle
     * @return {void}
     */
    toggle() {
        this.container.parentElement.classList.contains('e-popup-close') ? this.splitBtn.toggle() : this.closePopup(null);
    }
    /**
     * Get component name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'colorpicker';
    }
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    getPersistData() {
        return this.addOnPersist(['value']);
    }
    wireEvents() {
        if (this.isPicker()) {
            let dragHandler = this.getDragHandler();
            EventHandler.add(dragHandler, 'keydown', this.pickerKeyDown, this);
            EventHandler.add(this.getHsvContainer(), 'mousedown touchstart', this.handlerDown, this);
            if (this.modeSwitcher || this.showButtons) {
                this.addCtrlSwitchEvent();
            }
            EventHandler.add(select('.' + PREVIOUS, this.container), 'click', this.previewHandler, this);
        }
        else {
            EventHandler.add(this.container, 'click', this.paletteClickHandler, this);
            EventHandler.add(this.container, 'keydown', this.paletteKeyDown, this);
        }
    }
    formResetHandler() {
        this.value = this.initialInputValue;
        attributes(this.element, { 'value': this.initialInputValue });
    }
    addCtrlSwitchEvent() {
        EventHandler.add(select('.' + CTRLSWITCH, this.container), 'click', this.btnClickHandler, this);
    }
    pickerKeyDown(e) {
        switch (e.keyCode) {
            case 39:
                this.handlerDragPosition(1, this.enableRtl ? -1 : 1, e);
                break;
            case 37:
                this.handlerDragPosition(1, this.enableRtl ? 1 : -1, e);
                break;
            case 38:
                this.handlerDragPosition(2, 1, e);
                break;
            case 40:
                this.handlerDragPosition(2, -1, e);
                break;
            case 13:
                e.preventDefault();
                let cValue = this.rgbToHex(this.rgb);
                this.enterKeyHandler(cValue, e);
        }
    }
    enterKeyHandler(value, e) {
        this.triggerChangeEvent(value);
        if (!this.inline) {
            this.closePopup(e);
            this.splitBtn.element.focus();
        }
    }
    closePopup(e) {
        let beforeCloseArgs = { element: this.container, event: e, cancel: false };
        this.trigger('beforeClose', beforeCloseArgs, (observedcloseArgs) => {
            if (!observedcloseArgs.cancel) {
                this.splitBtn.toggle();
                this.onPopupClose();
            }
        });
    }
    triggerChangeEvent(value) {
        let hex = value.slice(0, 7);
        this.trigger('change', {
            currentValue: { hex: hex, rgba: this.convertToRgbString(this.rgb) },
            previousValue: { hex: this.value.slice(0, 7), rgba: this.convertToRgbString(this.hexToRgb(this.value)) },
            value: value
        });
        this.setProperties({ 'value': value }, true);
        this.element.value = hex ? hex : '#000000';
    }
    handlerDragPosition(prob, value, e) {
        e.preventDefault();
        this.hsv[prob] += value * (e.ctrlKey ? 1 : 3);
        if (this.hsv[prob] < 0) {
            this.hsv[prob] = 0;
        }
        this.updateHsv();
        this.convertToOtherFormat(true);
    }
    handlerDown(e) {
        e.preventDefault();
        if (e.type === 'mousedown') {
            this.clientX = Math.abs(e.pageX - pageXOffset);
            this.clientY = Math.abs(e.pageY - pageYOffset);
            this.setTooltipOffset(8);
        }
        else {
            this.clientX = Math.abs(e.changedTouches[0].pageX - pageXOffset);
            this.clientY = Math.abs(e.changedTouches[0].pageY - pageYOffset);
            this.setTooltipOffset(-8);
        }
        this.setHsv(this.clientX, this.clientY);
        this.getDragHandler().style.transition = 'left .4s cubic-bezier(.25, .8, .25, 1), top .4s cubic-bezier(.25, .8, .25, 1)';
        this.updateHsv();
        this.convertToOtherFormat();
        this.getDragHandler().focus();
        EventHandler.add(document, 'mousemove touchmove', this.handlerMove, this);
        EventHandler.add(document, 'mouseup touchend', this.handlerEnd, this);
    }
    handlerMove(e) {
        if (e.type !== 'touchmove') {
            e.preventDefault();
        }
        let x;
        let y;
        if (e.type === 'mousemove') {
            x = Math.abs(e.pageX - pageXOffset);
            y = Math.abs(e.pageY - pageYOffset);
        }
        else {
            x = Math.abs(e.changedTouches[0].pageX - pageXOffset);
            y = Math.abs(e.changedTouches[0].pageY - pageYOffset);
        }
        this.setHsv(x, y);
        let dragHandler = this.getDragHandler();
        let left = parseInt(dragHandler.style.left, 10);
        let top = parseInt(dragHandler.style.top, 10);
        this.updateHsv();
        this.convertToOtherFormat();
        this.getTooltipInst().refresh(dragHandler);
        if (!this.tooltipEle.style.transform) {
            if (Math.abs(this.clientX - x) > 8 || Math.abs(this.clientY - y) > 8) {
                select('.' + HSVAREA, this.container).style.cursor = 'pointer';
                dragHandler.style.transition = 'none';
                if (!this.inline) {
                    this.tooltipEle.style.zIndex = (parseInt(this.getPopupEle().style.zIndex, 10) + 1).toString();
                }
                this.tooltipEle.style.transform = 'rotate(45deg)';
                dragHandler.classList.add('e-hide-handler');
            }
        }
    }
    setHsv(clientX, clientY) {
        let ele = select('.' + HSVAREA, this.container);
        let position = ele.getBoundingClientRect();
        if (this.enableRtl) {
            clientX = clientX > position.right ? 0 : Math.abs(clientX - position.right);
        }
        else {
            clientX = clientX > position.left ? Math.abs(clientX - position.left) : 0;
        }
        clientY = clientY > position.top ? Math.abs(clientY - position.top) : 0;
        this.hsv[2] = Math.round(Number(100 * (ele.offsetHeight -
            Math.max(0, Math.min(ele.offsetHeight, (clientY - ele.offsetTop)))) / ele.offsetHeight) * 10) / 10;
        this.hsv[1] =
            Math.round(Number(100 * (Math.max(0, Math.min(ele.offsetWidth, (clientX - ele.offsetLeft)))) / ele.offsetWidth) * 10) / 10;
    }
    handlerEnd(e) {
        if (e.type !== 'touchend') {
            e.preventDefault();
        }
        EventHandler.remove(document, 'mousemove touchmove', this.handlerMove);
        EventHandler.remove(document, 'mouseup touchend', this.handlerEnd);
        let dragHandler = this.getDragHandler();
        select('.' + HSVAREA, this.container).style.cursor = '';
        if (this.tooltipEle.style.transform) {
            this.tooltipEle.style.transform = '';
            dragHandler.classList.remove('e-hide-handler');
        }
        if (!this.inline && !this.showButtons) {
            this.closePopup(e);
        }
    }
    btnClickHandler(e) {
        let target = e.target;
        if (closest(target, '.' + MODESWITCH)) {
            e.stopPropagation();
            this.switchToPalette();
        }
        else {
            if (target.classList.contains(APPLY) || target.classList.contains(CANCEL)) {
                this.ctrlBtnClick(target, e);
            }
        }
    }
    switchToPalette() {
        this.trigger('beforeModeSwitch', { element: this.container, mode: 'Palette' });
        this.unWireEvents();
        this.destroyOtherComp();
        detach(select('.e-slider-preview', this.container));
        if (!this.getWrapper().classList.contains(HIDEVALUE)) {
            remove(select('.' + INPUTWRAPPER, this.container));
        }
        detach(this.getHsvContainer());
        this.createPalette();
        this.firstPaletteFocus();
        this.createInput();
        this.refreshPopupPos();
        this.wireEvents();
    }
    refreshPopupPos() {
        if (!this.inline) {
            let popupEle = this.getPopupEle();
            popupEle.style.left = formatUnit(0 + pageXOffset);
            popupEle.style.top = formatUnit(0 + pageYOffset);
            this.getPopupInst().refreshPosition(this.splitBtn.element.parentElement);
        }
    }
    formatSwitchHandler(e) {
        let target = e.target.parentElement;
        if (this.isRgb) {
            this.updateValue(this.hsv, true, 3, [360, 100, 100]);
            this.isRgb = false;
        }
        else {
            this.updateValue(this.rgb, true, 2);
            this.isRgb = true;
        }
    }
    updateValue(value, format, idx, max) {
        let clsName = ['e-rh-value', 'e-gs-value', 'e-bv-value'];
        let inst;
        for (let i = 0, len = clsName.length; i < len; i++) {
            inst = getInstance(select('.' + clsName[i], this.container), NumericTextBox);
            inst.value = Math.round(value[i]);
            if (format) {
                inst.placeholder = clsName[i].substr(idx, 1).toUpperCase();
                inst.max = max ? max[i] : 255;
            }
            inst.dataBind();
        }
    }
    previewHandler(e) {
        let target = e.target;
        let pValue = this.rgbToHex(this.rgb);
        this.rgb = this.convertRgbToNumberArray(target.style.backgroundColor);
        if (!this.rgb[3]) {
            this.rgb[3] = 1;
        }
        let cValue = this.rgbToHex(this.rgb);
        let hsv = this.rgbToHsv.apply(this, this.rgb);
        if (hsv[0] !== this.hsv[0]) {
            this.hueSlider.setProperties({ 'value': hsv[0] }, true);
            this.hueSlider.refresh();
        }
        this.setHsvContainerBg(hsv[0]);
        if (this.enableOpacity && hsv[3] !== this.hsv[3]) {
            this.opacitySlider.setProperties({ 'value': hsv[3] * 100 }, true);
            this.opacitySlider.refresh();
            this.updateOpacitySliderBg();
        }
        this.hsv = hsv;
        this.setHandlerPosition();
        this.updateInput(cValue);
        select('.' + PREVIEW + ' .' + CURRENT, this.container).style.backgroundColor = this.convertToRgbString(this.rgb);
        this.triggerEvent(cValue, pValue, this.convertToRgbString(this.rgb));
    }
    paletteClickHandler(e) {
        e.preventDefault();
        let target = e.target;
        if (target.classList.contains(TILE)) {
            this.removeTileSelection();
            this.addTileSelection(target);
            if (target.classList.contains(NOCOLOR)) {
                this.noColorTile();
            }
            else {
                let cValue = target.getAttribute('aria-label');
                let pValue = this.rgbToHex(this.rgb);
                this.rgb = this.hexToRgb(this.roundValue(cValue));
                this.hsv = this.rgbToHsv.apply(this, this.rgb);
                if (this.getWrapper().classList.contains(SHOWVALUE)) {
                    this.updateInput(cValue);
                }
                this.triggerEvent(cValue, pValue, this.convertToRgbString(this.rgb));
            }
            if (!this.inline && !this.showButtons) {
                this.closePopup(e);
            }
        }
        else {
            if (closest(target, '.' + MODESWITCH)) {
                this.switchToPicker();
            }
            else {
                if (target.classList.contains(APPLY) || target.classList.contains(CANCEL)) {
                    this.ctrlBtnClick(target, e);
                }
                else {
                    if (this.getWrapper().classList.contains(SHOWVALUE) && closest(target, '.' + FORMATSWITCH)) {
                        this.formatSwitchHandler(e);
                    }
                }
            }
        }
    }
    noColorTile(isKey = false) {
        let pValue = this.rgbToHex(this.rgb);
        this.rgb = [];
        this.hsv = [];
        this.triggerEvent('', pValue, '', isKey);
    }
    switchToPicker() {
        let wrapper = this.getWrapper();
        this.trigger('beforeModeSwitch', { element: this.container, mode: 'Picker' });
        this.unWireEvents();
        ([].slice.call(selectAll('.' + PALETTES, this.container))).forEach((ele) => {
            detach(ele);
        });
        if (wrapper.classList.contains(SHOWVALUE)) {
            detach(select('.' + INPUTWRAPPER, this.container));
        }
        this.container.style.width = '';
        let grpEle = select('.e-custom-palette', this.container);
        if (this.presetColors) {
            remove(grpEle);
        }
        this.createPicker();
        this.getDragHandler().focus();
        this.createInput();
        this.refreshPopupPos();
        this.wireEvents();
    }
    ctrlBtnClick(ele, e) {
        if (ele.classList.contains(APPLY)) {
            let cValue = this.rgbToHex(this.rgb);
            this.triggerChangeEvent(cValue);
        }
        if (!this.inline) {
            this.closePopup(e);
            this.splitBtn.element.focus();
        }
    }
    paletteKeyDown(e) {
        let target = e.target;
        if (!target.classList.contains(PALETTES)) {
            return;
        }
        let selectedEle;
        let idx;
        let tiles = [].slice.call(selectAll('.' + TILE, target));
        let prevSelectedEle = (tiles.filter((tile) => tile.classList.contains('e-selected'))).pop();
        switch (!e.altKey && e.keyCode) {
            case 39:
                e.preventDefault();
                selectedEle = prevSelectedEle ? tiles[this.tilePosition(tiles, prevSelectedEle, this.enableRtl ? -1 : 1)]
                    : tiles[this.enableRtl ? tiles.length - 1 : 0];
                this.keySelectionChanges(selectedEle);
                break;
            case 37:
                e.preventDefault();
                selectedEle = prevSelectedEle ? tiles[this.tilePosition(tiles, prevSelectedEle, this.enableRtl ? 1 : -1)]
                    : tiles[this.enableRtl ? 0 : tiles.length - 1];
                this.keySelectionChanges(selectedEle);
                break;
            case 38:
                e.preventDefault();
                idx = prevSelectedEle ? this.tilePosition(tiles, prevSelectedEle, -this.columns) : 0;
                selectedEle = tiles[idx] ? tiles[idx] : tiles[idx - this.columns];
                this.keySelectionChanges(selectedEle);
                break;
            case 40:
                e.preventDefault();
                idx = prevSelectedEle ? this.tilePosition(tiles, prevSelectedEle, this.columns) : tiles.length - 1;
                if (tiles[idx]) {
                    selectedEle = tiles[idx];
                }
                else {
                    idx %= tiles.length;
                    idx += tiles[tiles.length - 1].parentElement.childElementCount;
                    selectedEle = tiles[idx];
                }
                this.keySelectionChanges(selectedEle);
                break;
            case 13:
                e.preventDefault();
                if (prevSelectedEle) {
                    let cValue = prevSelectedEle.getAttribute('aria-label');
                    this.enterKeyHandler(cValue ? cValue : '', e);
                }
        }
    }
    keySelectionChanges(newEle) {
        this.removeTileSelection();
        this.addTileSelection(newEle);
        if (newEle.classList.contains(NOCOLOR)) {
            this.noColorTile(true);
        }
        else {
            let cValue = newEle.getAttribute('aria-label');
            let pValue = this.rgbToHex(this.rgb);
            this.rgb = this.hexToRgb(cValue);
            this.hsv = this.rgbToHsv.apply(this, this.rgb);
            if (this.getWrapper().classList.contains(SHOWVALUE)) {
                this.updateInput(cValue);
            }
            this.triggerEvent(cValue, pValue, this.convertToRgbString(this.rgb), true);
        }
    }
    tilePosition(items, element, cIdx) {
        items = Array.prototype.slice.call(items);
        let n = items.length;
        let emptyCount = this.columns - items[n - 1].parentElement.childElementCount;
        let idx = items.indexOf(element);
        idx += cIdx;
        idx < 0 ? idx += n + emptyCount : idx %= n + emptyCount;
        return idx;
    }
    inputHandler(e) {
        let target = e.target;
        if (!target.value.length) {
            return;
        }
        let hsv;
        let pValue;
        let label = select('.e-float-text', target.parentElement).textContent;
        switch (label) {
            case 'HEX':
                let value = '';
                if ((target.value[0] === '#' && target.value.length !== 5) || (target.value[0] !== '#' && target.value.length !== 4)) {
                    value = this.roundValue(target.value);
                }
                if (value.length === 9) {
                    pValue = this.rgbToHex(this.rgb);
                    this.rgb = this.hexToRgb(value + value.substr(-2));
                    this.inputValueChange(this.rgbToHsv.apply(this, this.rgb), pValue, target.value);
                }
                else {
                    return;
                }
                break;
            case 'R':
                if (this.rgb[0] !== Number(target.value)) {
                    pValue = this.rgbToHex(this.rgb);
                    this.rgb[0] = Number(target.value);
                    hsv = this.rgbToHsv.apply(this, this.rgb);
                    this.inputValueChange(hsv, pValue);
                }
                break;
            case 'G':
                if (this.rgb[1] !== Number(target.value)) {
                    pValue = this.rgbToHex(this.rgb);
                    this.rgb[1] = Number(target.value);
                    hsv = this.rgbToHsv.apply(this, this.rgb);
                    this.inputValueChange(hsv, pValue);
                }
                break;
            case 'B':
                if (this.rgb[2] !== Number(target.value)) {
                    pValue = this.rgbToHex(this.rgb);
                    this.rgb[2] = Number(target.value);
                    hsv = this.rgbToHsv.apply(this, this.rgb);
                    this.inputValueChange(hsv, pValue);
                }
                break;
            case 'H':
                this.hueSlider.value = Number(target.value);
                break;
            case 'S':
                if (this.hsv[1] !== Number(target.value)) {
                    this.hsv[1] = Number(target.value);
                    this.updateHsv();
                    this.convertToOtherFormat();
                }
                break;
            case 'V':
                if (this.hsv[2] !== Number(target.value)) {
                    this.hsv[2] = Number(target.value);
                    this.updateHsv();
                    this.convertToOtherFormat();
                }
                break;
            case 'A':
                this.opacitySlider.value = Number(target.value);
                break;
        }
    }
    inputValueChange(hsv, pValue, value) {
        if (hsv[0] !== this.hsv[0]) {
            this.hueSlider.setProperties({ 'value': hsv[0] }, true);
            this.hueSlider.refresh();
            this.setHsvContainerBg(hsv[0]);
        }
        this.hsv = hsv;
        let cValue = this.rgbToHex(this.rgb);
        this.setHandlerPosition();
        this.updateInput(value ? value : cValue);
        let rgba = this.convertToRgbString(this.rgb);
        this.updatePreview(rgba);
        this.triggerEvent(cValue, pValue, rgba);
    }
    triggerEvent(cValue, pValue, rgba, isKey = false) {
        let hex = cValue.slice(0, 7);
        if (!this.showButtons && !isKey) {
            this.trigger('change', { currentValue: { hex: hex, rgba: rgba },
                previousValue: { hex: this.value.slice(0, 7), rgba: this.convertToRgbString(this.hexToRgb(this.value)) }, value: cValue });
            this.setProperties({ 'value': cValue }, true);
            this.element.value = hex ? hex : '#000000';
        }
        else {
            this.trigger('select', {
                currentValue: { hex: hex, rgba: rgba },
                previousValue: { hex: pValue.slice(0, 7), rgba: this.convertToRgbString(this.hexToRgb(pValue)) }
            });
        }
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers.
     * Also it maintains the initial input element from the DOM.
     * @method destroy
     * @return {void}
     */
    destroy() {
        let wrapper = this.getWrapper();
        super.destroy();
        ['tabindex', 'spellcheck'].forEach((attr) => { this.element.removeAttribute(attr); });
        if (this.inline) {
            this.unWireEvents();
            this.destroyOtherComp();
        }
        else {
            if (this.isPopupOpen()) {
                this.unWireEvents();
                this.destroyOtherComp();
            }
            this.splitBtn.destroy();
            this.splitBtn = null;
        }
        this.tileRipple();
        this.tileRipple = null;
        this.ctrlBtnRipple();
        this.ctrlBtnRipple = null;
        detach(this.element.nextElementSibling);
        wrapper.parentElement.insertBefore(this.element, wrapper);
        detach(wrapper);
        this.container = null;
        if (this.formElement) {
            EventHandler.remove(this.formElement, 'reset', this.formResetHandler);
        }
    }
    destroyOtherComp() {
        if (this.isPicker()) {
            this.hueSlider.destroy();
            if (this.enableOpacity) {
                this.opacitySlider.destroy();
                this.opacitySlider = null;
            }
            this.hueSlider = null;
            let tooltipInst = this.getTooltipInst();
            tooltipInst.close();
            tooltipInst.destroy();
            this.tooltipEle = null;
        }
    }
    isPopupOpen() {
        return this.getPopupEle().classList.contains('e-popup-open');
    }
    unWireEvents() {
        if (this.isPicker()) {
            let wrapper = this.getWrapper();
            let dragHandler = this.getDragHandler();
            EventHandler.remove(dragHandler, 'keydown', this.pickerKeyDown);
            EventHandler.remove(this.getHsvContainer(), 'mousedown touchstart', this.handlerDown);
            if (this.modeSwitcher || this.showButtons) {
                EventHandler.remove(select('.' + CTRLSWITCH, this.container), 'click', this.btnClickHandler);
            }
            EventHandler.remove(select('.' + PREVIOUS, this.container), 'click', this.previewHandler);
        }
        else {
            EventHandler.remove(this.container, 'click', this.paletteClickHandler);
            EventHandler.remove(this.container, 'keydown', this.paletteKeyDown);
        }
    }
    roundValue(value) {
        if (!value) {
            return '';
        }
        if (value[0] !== '#') {
            value = '#' + value;
        }
        let len = value.length;
        if (len === 4) {
            value += 'f';
            len = 5;
        }
        if (len === 5) {
            let tempValue = '';
            for (let i = 1, len = value.length; i < len; i++) {
                tempValue += (value.charAt(i) + value.charAt(i));
            }
            value = '#' + tempValue;
            len = 9;
        }
        if (len === 7) {
            value += 'ff';
        }
        return value;
    }
    hexToRgb(hex) {
        if (!hex) {
            return [];
        }
        hex = hex.trim();
        if (hex.length !== 9) {
            hex = this.roundValue(hex);
        }
        let opacity = Number((parseInt(hex.slice(-2), 16) / 255).toFixed(2));
        hex = hex.slice(1, 7);
        let bigInt = parseInt(hex, 16);
        let h = [];
        h.push((bigInt >> 16) & 255);
        h.push((bigInt >> 8) & 255);
        h.push(bigInt & 255);
        h.push(opacity);
        return h;
    }
    rgbToHsv(r, g, b, opacity) {
        if (this.rgb && !this.rgb.length) {
            return [];
        }
        r /= 255;
        g /= 255;
        b /= 255;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h;
        let s;
        let v = max;
        let d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max === min) {
            h = 0;
        }
        else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        let hsv = [Math.round(h * 360), Math.round(s * 1000) / 10, Math.round(v * 1000) / 10];
        if (!isNullOrUndefined(opacity)) {
            hsv.push(opacity);
        }
        return hsv;
    }
    hsvToRgb(h, s, v, opacity) {
        let r;
        let g;
        let b;
        let i;
        let f;
        let p;
        let q;
        let t;
        s /= 100;
        v /= 100;
        if (s === 0) {
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), opacity];
        }
        h /= 60;
        i = Math.floor(h);
        f = h - i;
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));
        switch (i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            default:
                r = v;
                g = p;
                b = q;
        }
        let rgb = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        if (!isNullOrUndefined(opacity)) {
            rgb.push(opacity);
        }
        return rgb;
    }
    rgbToHex(rgb) {
        return rgb.length ? ('#' + this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]) +
            (!isNullOrUndefined(rgb[3]) ? (rgb[3] !== 0 ? (Math.round(rgb[3] * 255) + 0x10000).toString(16).substr(-2) : '00') : '')) : '';
    }
    hex(x) {
        return ('0' + x.toString(16)).slice(-2);
    }
    changeModeSwitcherProp(prop) {
        let ctrlSwitchWrapper = select('.' + CTRLSWITCH, this.container);
        if (prop) {
            if (ctrlSwitchWrapper) {
                this.appendModeSwitchBtn();
            }
            else {
                this.createCtrlBtn();
                if (this.isPicker() && !this.disabled) {
                    this.addCtrlSwitchEvent();
                }
            }
        }
        else {
            if (ctrlSwitchWrapper) {
                if (this.showButtons) {
                    detach(select('.' + MODESWITCH, ctrlSwitchWrapper));
                }
                else {
                    remove(ctrlSwitchWrapper);
                }
            }
        }
    }
    changeShowBtnProps(prop) {
        let ctrlBtnWrapper = select('.' + CTRLSWITCH, this.container);
        if (prop) {
            if (ctrlBtnWrapper) {
                remove(ctrlBtnWrapper);
            }
            this.createCtrlBtn();
            if (this.isPicker() && !this.disabled) {
                this.addCtrlSwitchEvent();
            }
        }
        else {
            if (this.modeSwitcher) {
                detach(select('.' + CTRLBTN, ctrlBtnWrapper));
            }
            else {
                remove(ctrlBtnWrapper);
            }
        }
    }
    changeValueProp(newProp) {
        if (this.isPicker()) {
            this.rgb = this.hexToRgb(newProp);
            this.hsv = this.rgbToHsv.apply(this, this.rgb);
            this.setHandlerPosition();
            detach(closest(this.hueSlider.element, '.e-slider-preview'));
            this.createSlider();
            this.setHsvContainerBg();
            this.updateInput(newProp);
            if (this.rgb.length === 4) {
                this.updateOpacityInput(this.rgb[3] * 100);
            }
        }
        else {
            this.removeTileSelection();
            let ele = select('span[aria-label="' + this.roundValue(newProp) + '"]', this.container);
            if (ele) {
                this.addTileSelection(ele);
            }
        }
    }
    setInputEleProps(prop) {
        remove(select('.' + INPUTWRAPPER, this.container));
        this.createInput();
    }
    changeDisabledProp(newProp) {
        if (this.isPicker()) {
            this.hueSlider.enabled = !newProp;
            this.opacitySlider.enabled = !newProp;
            this.setInputEleProps(newProp);
        }
        if (newProp) {
            this.toggleDisabled(true);
            this.unWireEvents();
        }
        else {
            this.toggleDisabled(false);
            this.wireEvents();
        }
    }
    changeCssClassProps(newProp, oldProp) {
        let wrapper = this.getWrapper();
        let popupWrapper = this.getPopupEle();
        if (oldProp) {
            removeClass([wrapper, popupWrapper], oldProp.split(' '));
        }
        if (newProp) {
            addClass([wrapper, popupWrapper], newProp.split(' '));
        }
    }
    changeRtlProps(newProp) {
        if (newProp) {
            addClass([this.getWrapper()], 'e-rtl');
        }
        else {
            removeClass([this.getWrapper()], 'e-rtl');
        }
    }
    changePaletteProps() {
        detach(this.container.children[0]);
        this.container.style.width = '';
        this.createPalette();
    }
    changeOpacityProps(newProp) {
        let wrapper = this.getWrapper();
        if (newProp) {
            removeClass([this.container.parentElement], HIDEOPACITY);
            this.createOpacitySlider(select('.e-colorpicker-slider', this.container).appendChild(this.createElement('div', { className: 'e-opacity-slider' })));
            if (!wrapper.classList.contains(HIDEVALUE) && !wrapper.classList.contains(HIDERGBA)) {
                this.appendOpacityValue(select('.e-input-container', this.container));
            }
        }
        else {
            addClass([this.container.parentElement], HIDEOPACITY);
            this.opacitySlider.destroy();
            remove(this.opacitySlider.element);
            this.opacitySlider = null;
            if (!wrapper.classList.contains(HIDEVALUE) && !wrapper.classList.contains(HIDERGBA)) {
                remove(select('.' + OPACITY, this.container).parentElement);
            }
        }
    }
    /**
     * Called internally if any of the property value changed.
     * @param  {ColorPickerModel} newProp
     * @param  {ColorPickerModel} oldProp
     * @returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        if (!isNullOrUndefined(newProp.value)) {
            let value = this.roundValue(newProp.value);
            if (value.length === 9) {
                this.element.value = this.roundValue(value).slice(0, 7);
                let preview = this.splitBtn && select('.' + SPLITPREVIEW, this.splitBtn.element);
                if (preview) {
                    preview.style.backgroundColor = this.convertToRgbString(this.hexToRgb(newProp.value));
                }
            }
            else {
                this.value = oldProp.value;
            }
        }
        if (!this.inline && isNullOrUndefined(newProp.inline)) {
            let otherCompModel = ['disabled', 'enableRtl'];
            this.splitBtn.setProperties(getModel(newProp, otherCompModel));
            if (!this.isPopupOpen()) {
                this.changeCssClassProps(newProp.cssClass, oldProp.cssClass);
                this.changeRtlProps(newProp.enableRtl);
                return;
            }
        }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'inline':
                    if (newProp.inline) {
                        this.getWrapper().appendChild(this.container);
                        this.splitBtn.destroy();
                        detach(this.element.nextElementSibling);
                        if (!this.container.children.length) {
                            this.createWidget();
                        }
                    }
                    else {
                        this.destroyOtherComp();
                        this.unWireEvents();
                        this.container.innerHTML = '';
                        this.createSplitBtn();
                    }
                    break;
                case 'cssClass':
                    this.changeCssClassProps(newProp.cssClass, oldProp.cssClass);
                    let props = newProp.cssClass.split(' ').concat(oldProp.cssClass.split(' '));
                    props = props.reduce((a, b) => { if (a.indexOf(b) < 0) {
                        a.push(b);
                    } return a; }, []);
                    let count = 0;
                    props.forEach((cls) => {
                        if (count === 0 &&
                            (cls === HIDEVALUE || cls === HIDEVALUESWITCH || cls === SHOWVALUE || cls === HIDEHEX || cls === HIDERGBA)) {
                            let inputWrap = select('.' + INPUTWRAPPER, this.container);
                            if (inputWrap) {
                                remove(select('.' + INPUTWRAPPER, this.container));
                            }
                            this.createInput();
                            count++;
                        }
                    });
                    break;
                case 'enableRtl':
                    if (this.isPicker()) {
                        this.hueSlider.enableRtl = newProp.enableRtl;
                        if (this.enableOpacity) {
                            this.opacitySlider.enableRtl = newProp.enableRtl;
                        }
                        this.setInputEleProps(newProp.enableRtl);
                    }
                    this.changeRtlProps(newProp.enableRtl);
                    break;
                case 'disabled':
                    this.changeDisabledProp(newProp.disabled);
                    break;
                case 'value':
                    if (this.value !== oldProp.value) {
                        this.changeValueProp(newProp.value);
                    }
                    break;
                case 'showButtons':
                    this.changeShowBtnProps(newProp.showButtons);
                    break;
                case 'mode':
                    if (newProp.mode === 'Picker') {
                        this.switchToPicker();
                    }
                    else {
                        this.switchToPalette();
                    }
                    break;
                case 'modeSwitcher':
                    this.changeModeSwitcherProp(newProp.modeSwitcher);
                    break;
                case 'columns':
                case 'presetColors':
                    if (!this.isPicker()) {
                        this.changePaletteProps();
                    }
                    break;
                case 'noColor':
                    if (newProp.noColor) {
                        if (this.mode === 'Palette' && !this.modeSwitcher) {
                            this.setNoColor();
                        }
                    }
                    else {
                        this.changePaletteProps();
                    }
                    break;
                case 'enableOpacity':
                    this.changeOpacityProps(newProp.enableOpacity);
                    break;
            }
        }
    }
    /**
     * Sets the focus to Colorpicker
     * its native method
     * @public
     */
    focusIn() {
        this.element.parentElement.focus();
    }
};
__decorate$5([
    Property('#008000ff')
], ColorPicker.prototype, "value", void 0);
__decorate$5([
    Property('')
], ColorPicker.prototype, "cssClass", void 0);
__decorate$5([
    Property(false)
], ColorPicker.prototype, "disabled", void 0);
__decorate$5([
    Property('Picker')
], ColorPicker.prototype, "mode", void 0);
__decorate$5([
    Property(true)
], ColorPicker.prototype, "modeSwitcher", void 0);
__decorate$5([
    Property(null)
], ColorPicker.prototype, "presetColors", void 0);
__decorate$5([
    Property(true)
], ColorPicker.prototype, "showButtons", void 0);
__decorate$5([
    Property(10)
], ColorPicker.prototype, "columns", void 0);
__decorate$5([
    Property(false)
], ColorPicker.prototype, "inline", void 0);
__decorate$5([
    Property(false)
], ColorPicker.prototype, "noColor", void 0);
__decorate$5([
    Property(false)
], ColorPicker.prototype, "enablePersistence", void 0);
__decorate$5([
    Property(true)
], ColorPicker.prototype, "enableOpacity", void 0);
__decorate$5([
    Event()
], ColorPicker.prototype, "select", void 0);
__decorate$5([
    Event()
], ColorPicker.prototype, "change", void 0);
__decorate$5([
    Event()
], ColorPicker.prototype, "beforeTileRender", void 0);
__decorate$5([
    Event()
], ColorPicker.prototype, "beforeOpen", void 0);
__decorate$5([
    Event()
], ColorPicker.prototype, "open", void 0);
__decorate$5([
    Event()
], ColorPicker.prototype, "beforeClose", void 0);
__decorate$5([
    Event()
], ColorPicker.prototype, "beforeModeSwitch", void 0);
__decorate$5([
    Event()
], ColorPicker.prototype, "created", void 0);
ColorPicker = __decorate$5([
    NotifyPropertyChanges
], ColorPicker);

/**
 * ColorPicker modules
 */

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const HIDE_CLEAR = 'e-clear-icon-hide';
const TEXTBOX_FOCUS = 'e-input-focus';
const containerAttr = ['title', 'style', 'class'];
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
let TextBox = class TextBox extends Component {
    constructor(options, element) {
        super(options, element);
        this.previousValue = null;
        this.isAngular = false;
        this.isHiddenInput = false;
        this.isForm = false;
        this.inputPreviousValue = null;
        this.isVue = false;
        this.textboxOptions = options;
    }
    /**
     * Calls internally if any of the property value is changed.
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
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
                    let prevOnChange = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    if (!this.isBlank(this.value)) {
                        this.value = this.value.toString();
                    }
                    this.isProtectedOnChange = prevOnChange;
                    Input.setValue(this.value, this.respectiveElement, this.floatLabelType, this.showClearButton);
                    if (this.isHiddenInput) {
                        this.element.value = this.respectiveElement.value;
                    }
                    this.inputPreviousValue = this.respectiveElement.value;
                    /* istanbul ignore next */
                    if ((this.isAngular || this.isVue) && this.preventChange === true) {
                        this.previousValue = this.isAngular ? this.value : this.previousValue;
                        this.preventChange = false;
                    }
                    else if (isNullOrUndefined(this.isAngular) || !this.isAngular
                        || (this.isAngular && !this.preventChange) || (this.isAngular && isNullOrUndefined(this.preventChange))) {
                        this.raiseChangeEvent();
                    }
                    break;
                case 'htmlAttributes':
                    this.updateHTMLAttrToElement();
                    this.updateHTMLAttrToWrapper();
                    let attributes$$1 = this.element.attributes;
                    this.checkAttributes(true);
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
                    Input.setCssClass(newProp.cssClass, [this.textboxWrapper.container], oldProp.cssClass);
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
    getModuleName() {
        return 'textbox';
    }
    isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }
    preRender() {
        this.cloneElement = this.element.cloneNode(true);
        this.formElement = closest(this.element, 'form');
        if (!isNullOrUndefined(this.formElement)) {
            this.isForm = true;
        }
        /* istanbul ignore next */
        if (this.element.tagName === 'EJS-TEXTBOX') {
            let ejInstance = getValue('ej2_instances', this.element);
            let inputElement = this.multiline ?
                this.createElement('textarea') :
                this.createElement('input');
            let index = 0;
            for (index; index < this.element.attributes.length; index++) {
                let attributeName = this.element.attributes[index].nodeName;
                if (attributeName !== 'id') {
                    inputElement.setAttribute(attributeName, this.element.attributes[index].nodeValue);
                    inputElement.innerHTML = this.element.innerHTML;
                    if (attributeName === 'name') {
                        this.element.removeAttribute('name');
                    }
                }
            }
            this.element.appendChild(inputElement);
            this.element = inputElement;
            setValue('ej2_instances', ejInstance, this.element);
        }
        this.updateHTMLAttrToElement();
        this.checkAttributes(false);
        if (this.element.tagName !== 'TEXTAREA') {
            this.element.setAttribute('type', this.type);
        }
        this.element.setAttribute('role', 'textbox');
        this.globalize = new Internationalization(this.locale);
        let localeText = { placeholder: this.placeholder };
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
            this.textarea = this.createElement('textarea');
            this.element.parentNode.insertBefore(this.textarea, this.element);
            this.element.setAttribute('type', 'hidden');
            this.textarea.setAttribute('name', this.element.getAttribute('name'));
            this.element.removeAttribute('name');
            this.textarea.setAttribute('role', this.element.getAttribute('role'));
            this.element.removeAttribute('role');
            let attribute = ['required', 'minlength', 'maxlength'];
            for (let i = 0; i < attribute.length; i++) {
                if (this.element.hasAttribute(attribute[i])) {
                    let attr = this.element.getAttribute(attribute[i]);
                    this.textarea.setAttribute(attribute[i], attr);
                    this.element.removeAttribute(attribute[i]);
                }
            }
        }
    }
    checkAttributes(isDynamic) {
        let attrs = isDynamic ? isNullOrUndefined(this.htmlAttributes) ? [] : Object.keys(this.htmlAttributes) :
            ['placeholder', 'disabled', 'value', 'readonly', 'type'];
        for (let key of attrs) {
            if (!isNullOrUndefined(this.element.getAttribute(key))) {
                switch (key) {
                    case 'disabled':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.textboxOptions) || (this.textboxOptions['enabled'] === undefined)) || isDynamic) {
                            let enabled = this.element.getAttribute(key) === 'disabled' || this.element.getAttribute(key) === '' ||
                                this.element.getAttribute(key) === 'true' ? false : true;
                            this.setProperties({ enabled: enabled }, !isDynamic);
                        }
                        break;
                    case 'readonly':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.textboxOptions) || (this.textboxOptions['readonly'] === undefined)) || isDynamic) {
                            let readonly = this.element.getAttribute(key) === 'readonly' || this.element.getAttribute(key) === ''
                                || this.element.getAttribute(key) === 'true' ? true : false;
                            this.setProperties({ readonly: readonly }, !isDynamic);
                        }
                        break;
                    case 'placeholder':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.textboxOptions) || (this.textboxOptions['placeholder'] === undefined)) || isDynamic) {
                            this.setProperties({ placeholder: this.element.placeholder }, !isDynamic);
                        }
                        break;
                    case 'value':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.textboxOptions) || (this.textboxOptions['value'] === undefined)) || isDynamic) {
                            this.setProperties({ value: this.element.value }, !isDynamic);
                        }
                        break;
                    case 'type':
                        // tslint:disable-next-line
                        if ((isNullOrUndefined(this.textboxOptions) || (this.textboxOptions['type'] === undefined)) || isDynamic) {
                            this.setProperties({ type: this.element.type }, !isDynamic);
                        }
                        break;
                }
            }
        }
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    render() {
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
        this.updateHTMLAttrToWrapper();
        if (this.isHiddenInput) {
            this.respectiveElement.parentNode.insertBefore(this.element, this.respectiveElement);
        }
        this.wireEvents();
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
        this.inputPreviousValue = this.value;
        this.renderComplete();
    }
    updateHTMLAttrToWrapper() {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (let key of Object.keys(this.htmlAttributes)) {
                if (containerAttr.indexOf(key) > -1) {
                    if (key === 'class') {
                        addClass([this.textboxWrapper.container], this.htmlAttributes[key].split(' '));
                    }
                    else if (key === 'style') {
                        let setStyle = this.textboxWrapper.container.getAttribute(key);
                        setStyle = !isNullOrUndefined(setStyle) ? (setStyle + this.htmlAttributes[key]) :
                            this.htmlAttributes[key];
                        this.textboxWrapper.container.setAttribute(key, setStyle);
                    }
                    else {
                        this.textboxWrapper.container.setAttribute(key, this.htmlAttributes[key]);
                    }
                }
            }
        }
    }
    updateHTMLAttrToElement() {
        if (!isNullOrUndefined(this.htmlAttributes)) {
            for (let key of Object.keys(this.htmlAttributes)) {
                if (containerAttr.indexOf(key) < 0) {
                    this.element.setAttribute(key, this.htmlAttributes[key]);
                }
            }
        }
    }
    setInitialValue() {
        if (!this.isAngular) {
            this.respectiveElement.setAttribute('value', this.initialValue);
        }
    }
    wireEvents() {
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
    resetValue(value) {
        let prevOnChange = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.value = value;
        this.isProtectedOnChange = prevOnChange;
    }
    resetForm() {
        if (this.isAngular) {
            this.resetValue('');
        }
        else {
            this.resetValue(this.initialValue);
        }
        let label = this.textboxWrapper.container.querySelector('.e-float-text');
        if (!isNullOrUndefined(label)) {
            if ((isNullOrUndefined(this.initialValue) || this.initialValue === '')) {
                label.classList.add('e-label-bottom');
                label.classList.remove('e-label-top');
            }
            else if (this.initialValue !== '') {
                label.classList.add('e-label-top');
                label.classList.remove('e-label-bottom');
            }
        }
    }
    focusHandler(args) {
        let eventArgs = {
            container: this.textboxWrapper.container,
            event: args,
            value: this.value
        };
        this.trigger('focus', eventArgs);
    }
    focusOutHandler(args) {
        if (!(this.previousValue === null && this.value === null && this.respectiveElement.value === '') &&
            (this.previousValue !== this.respectiveElement.value)) {
            this.raiseChangeEvent(args, true);
        }
        let eventArgs = {
            container: this.textboxWrapper.container,
            event: args,
            value: this.value
        };
        this.trigger('blur', eventArgs);
    }
    inputHandler(args) {
        // tslint:disable-next-line
        let textboxObj = this;
        let eventArgs = {
            event: args,
            value: this.respectiveElement.value,
            previousValue: this.inputPreviousValue,
            container: this.textboxWrapper.container
        };
        this.inputPreviousValue = this.respectiveElement.value;
        /* istanbul ignore next */
        if (this.isAngular) {
            textboxObj.localChange({ value: this.respectiveElement.value });
            this.preventChange = true;
        }
        if (this.isVue) {
            this.preventChange = true;
        }
        this.trigger('input', eventArgs);
        args.stopPropagation();
    }
    changeHandler(args) {
        this.setProperties({ value: this.respectiveElement.value }, true);
        this.raiseChangeEvent(args, true);
        args.stopPropagation();
    }
    raiseChangeEvent(event, interaction) {
        let eventArgs = {
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
    bindClearEvent() {
        if (this.showClearButton && this.respectiveElement.tagName !== 'TEXTAREA') {
            EventHandler.add(this.textboxWrapper.clearButton, 'mousedown touchstart', this.resetInputHandler, this);
        }
    }
    resetInputHandler(event) {
        event.preventDefault();
        if (!(this.textboxWrapper.clearButton.classList.contains(HIDE_CLEAR))) {
            let previousValue = this.value;
            Input.setValue('', this.respectiveElement, this.floatLabelType, this.showClearButton);
            if (this.isHiddenInput) {
                this.element.value = this.respectiveElement.value;
            }
            this.setProperties({ value: this.respectiveElement.value }, true);
            let eventArgs = {
                event: event,
                value: this.respectiveElement.value,
                previousValue: this.inputPreviousValue,
                container: this.textboxWrapper.container
            };
            this.trigger('input', eventArgs);
            this.inputPreviousValue = this.respectiveElement.value;
            this.raiseChangeEvent(event, true);
        }
    }
    unWireEvents() {
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
    destroy() {
        this.unWireEvents();
        if (this.element.tagName === 'INPUT' && this.multiline) {
            detach(this.textboxWrapper.container.getElementsByTagName('textarea')[0]);
            this.respectiveElement = this.element;
            this.element.removeAttribute('type');
        }
        this.respectiveElement.classList.remove('e-input');
        this.removeAttributes(['aria-placeholder', 'aria-disabled', 'aria-readonly', 'aria-labelledby']);
        this.textboxWrapper.container.insertAdjacentElement('afterend', this.respectiveElement);
        detach(this.textboxWrapper.container);
        this.textboxWrapper = null;
        super.destroy();
    }
    /**
     * Gets the properties to be maintained in the persisted state.
     * @return {string}
     */
    getPersistData() {
        let keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Adding the multiple attributes as key-value pair to the TextBox element.
     * @param { { [key: string]: string } } attributes - Specifies the attributes to be add to TextBox element.
     * @return {void}
     */
    addAttributes(attributes$$1) {
        for (let key of Object.keys(attributes$$1)) {
            if (key === 'disabled') {
                this.setProperties({ enabled: false }, true);
                Input.setEnabled(this.enabled, this.respectiveElement, this.floatLabelType, this.textboxWrapper.container);
            }
            else if (key === 'readonly') {
                this.setProperties({ readonly: true }, true);
                Input.setReadonly(this.readonly, this.respectiveElement);
            }
            else if (key === 'class') {
                this.respectiveElement.classList.add(attributes$$1[key]);
            }
            else if (key === 'placeholder') {
                this.setProperties({ placeholder: attributes$$1[key] }, true);
                Input.setPlaceholder(this.placeholder, this.respectiveElement);
            }
            else if (key === 'rows' && this.respectiveElement.tagName === 'TEXTAREA') {
                this.respectiveElement.setAttribute(key, attributes$$1[key]);
            }
            else {
                this.respectiveElement.setAttribute(key, attributes$$1[key]);
            }
        }
    }
    /**
     * Removing the multiple attributes as key-value pair to the TextBox element.
     * @param { string[] } attributes - Specifies the attributes name to be removed from TextBox element.
     * @return {void}
     */
    removeAttributes(attributes$$1) {
        for (let key of attributes$$1) {
            if (key === 'disabled') {
                this.setProperties({ enabled: true }, true);
                Input.setEnabled(this.enabled, this.respectiveElement, this.floatLabelType, this.textboxWrapper.container);
            }
            else if (key === 'readonly') {
                this.setProperties({ readonly: false }, true);
                Input.setReadonly(this.readonly, this.respectiveElement);
            }
            else if (key === 'placeholder') {
                this.setProperties({ placeholder: null }, true);
                Input.setPlaceholder(this.placeholder, this.respectiveElement);
            }
            else {
                this.respectiveElement.removeAttribute(key);
            }
        }
    }
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    focusIn() {
        if (document.activeElement !== this.respectiveElement && this.enabled) {
            this.respectiveElement.focus();
            addClass([this.textboxWrapper.container], [TEXTBOX_FOCUS]);
        }
    }
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    focusOut() {
        if (document.activeElement === this.respectiveElement && this.enabled) {
            this.respectiveElement.blur();
            removeClass([this.textboxWrapper.container], [TEXTBOX_FOCUS]);
        }
    }
};
__decorate$6([
    Property('text')
], TextBox.prototype, "type", void 0);
__decorate$6([
    Property(false)
], TextBox.prototype, "readonly", void 0);
__decorate$6([
    Property(null)
], TextBox.prototype, "value", void 0);
__decorate$6([
    Property('Never')
], TextBox.prototype, "floatLabelType", void 0);
__decorate$6([
    Property('')
], TextBox.prototype, "cssClass", void 0);
__decorate$6([
    Property(null)
], TextBox.prototype, "placeholder", void 0);
__decorate$6([
    Property({})
], TextBox.prototype, "htmlAttributes", void 0);
__decorate$6([
    Property(false)
], TextBox.prototype, "multiline", void 0);
__decorate$6([
    Property(true)
], TextBox.prototype, "enabled", void 0);
__decorate$6([
    Property(false)
], TextBox.prototype, "showClearButton", void 0);
__decorate$6([
    Property(false)
], TextBox.prototype, "enablePersistence", void 0);
__decorate$6([
    Event()
], TextBox.prototype, "created", void 0);
__decorate$6([
    Event()
], TextBox.prototype, "destroyed", void 0);
__decorate$6([
    Event()
], TextBox.prototype, "change", void 0);
__decorate$6([
    Event()
], TextBox.prototype, "blur", void 0);
__decorate$6([
    Event()
], TextBox.prototype, "focus", void 0);
__decorate$6([
    Event()
], TextBox.prototype, "input", void 0);
TextBox = __decorate$6([
    NotifyPropertyChanges
], TextBox);

/**
 * Uploader modules
 */

/**
 * NumericTextBox all modules
 */

export { NumericTextBox, regularExpressions, createMask, applyMask, wireEvents, unwireEvents, bindClearEvent, unstrippedValue, strippedValue, maskInputFocusHandler, maskInputBlurHandler, maskInputDropHandler, mobileRemoveFunction, setMaskValue, setElementValue, maskInput, getVal, getMaskedVal, MaskUndo, MaskedTextBox, Input, TicksData, LimitData, TooltipData, Slider, regex, ErrorOption, FormValidator, FilesProp, ButtonsProps, AsyncSettings, Uploader, ColorPicker, TextBox };
//# sourceMappingURL=ej2-inputs.es2015.js.map
